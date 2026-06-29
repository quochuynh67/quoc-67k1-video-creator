import html2canvas from 'html2canvas';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { Project, AudioTrack } from './types';

export type RenderProgress = {
  pct: number;
  status: string;
};

const FFMPEG_CDN = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

export async function renderProjectLocally(
  project: Project,
  onProgress: (p: RenderProgress) => void
): Promise<Blob> {
  const { width, height, fps, scenes, audios, outputFormat, volume, pixelFormat } = project;

  for (const scene of scenes) {
    if (scene.sourceType === 'url' && scene.url?.trim()) {
      throw new Error(
        `Cảnh "${scene.name}" dùng URL — không thể render phía client. Hãy chuyển sang HTML.`
      );
    }
  }

  onProgress({ pct: 0, status: 'Đang tải FFmpeg WASM (~25 MB lần đầu)...' });
  const ffmpeg = new FFmpeg();

  await ffmpeg.load({
    coreURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  // Load custom fonts into the document so html2canvas can see them
  const loadedFonts: FontFace[] = [];
  for (const font of project.fonts) {
    if (!font.path?.trim() || !font.family?.trim()) continue;
    try {
      const face = new FontFace(font.family, `url(${font.path})`);
      await face.load();
      document.fonts.add(face);
      loadedFonts.push(face);
    } catch (e) {
      console.warn('Font load failed:', font.family, e);
    }
  }

  // Off-screen render container (same-origin, accessible to html2canvas)
  const container = document.createElement('div');
  container.style.cssText =
    `position:fixed;left:-${width + 200}px;top:0;` +
    `width:${width}px;height:${height}px;overflow:hidden;pointer-events:none;`;
  document.body.appendChild(container);

  const totalFrames = scenes.reduce(
    (sum, s) => sum + Math.ceil((s.duration / 1000) * fps),
    0
  );
  let frameIdx = 0;

  try {
    for (let si = 0; si < scenes.length; si++) {
      const scene = scenes[si];

      const wrapper = document.createElement('div');
      wrapper.style.cssText =
        `width:${width}px;height:${height}px;overflow:hidden;` +
        `background:${scene.background};position:relative;`;
      wrapper.innerHTML = scene.html;
      container.replaceChildren(wrapper);

      // Two rAF passes so styles settle before we start seeking
      await rafTick(2);

      const sceneFrames = Math.ceil((scene.duration / 1000) * fps);

      for (let f = 0; f < sceneFrames; f++) {
        const frameMs = (f / fps) * 1000;

        seekAnimations(wrapper, frameMs);
        await rafTick(1);

        const captured = await html2canvas(wrapper, {
          width,
          height,
          backgroundColor: scene.background,
          useCORS: true,
          allowTaint: true,
          logging: false,
          scale: 1,
        });

        const blob = await canvasToBlob(captured, 'image/jpeg', 0.95);
        const name = `f${String(frameIdx).padStart(6, '0')}.jpg`;
        await ffmpeg.writeFile(name, await fetchFile(blob));

        frameIdx++;
        onProgress({
          pct: 0.05 + (frameIdx / totalFrames) * 0.68,
          status: `Render khung ${frameIdx}/${totalFrames} — cảnh ${si + 1}/${scenes.length}`,
        });
      }
    }

    // Load audio files
    const loadedAudios: Array<{ filename: string; track: AudioTrack }> = [];
    for (let ai = 0; ai < audios.length; ai++) {
      const track = audios[ai];
      if (!track.path?.trim()) continue;
      onProgress({ pct: 0.73 + (ai / Math.max(audios.length, 1)) * 0.04, status: `Tải âm thanh ${ai + 1}...` });
      try {
        const ext = track.path.split('?')[0].split('.').pop() || 'mp3';
        const filename = `a${ai}.${ext}`;
        await ffmpeg.writeFile(filename, await fetchFile(track.path));
        loadedAudios.push({ filename, track });
      } catch (e) {
        console.warn('Audio load failed:', track.path, e);
      }
    }

    onProgress({ pct: 0.78, status: 'Đang mã hóa video...' });

    ffmpeg.on('progress', ({ progress }) => {
      onProgress({
        pct: 0.78 + Math.min(progress, 1) * 0.2,
        status: `Mã hóa... ${Math.round(Math.min(progress, 1) * 100)}%`,
      });
    });

    const totalDurationSec = scenes.reduce((s, sc) => s + sc.duration / 1000, 0);
    const outputFile = `out.${outputFormat}`;

    const args: string[] = ['-framerate', String(fps), '-i', 'f%06d.jpg'];

    for (const { filename } of loadedAudios) {
      args.push('-i', filename);
    }

    // Video codec
    if (outputFormat === 'mp4') {
      args.push('-c:v', 'libx264', '-pix_fmt', pixelFormat === 'yuv444p' ? 'yuv444p' : 'yuv420p');
    } else {
      args.push('-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p');
    }

    // Video quality
    if (project.videoBitrate) {
      args.push('-b:v', project.videoBitrate);
    } else {
      const crf = Math.round(((100 - project.videoQuality) / 100) * 51);
      args.push('-crf', String(Math.max(0, Math.min(51, crf))));
    }

    // Audio mixing
    if (loadedAudios.length > 0) {
      const masterVol = volume / 100;
      const filterParts: string[] = [];
      const chainLabels: string[] = [];

      loadedAudios.forEach(({ track }, i) => {
        const vol = (track.volume / 100) * masterVol;
        const filters: string[] = [`volume=${vol.toFixed(4)}`];

        if (track.seekStart > 0 || track.seekEnd > 0) {
          const trim = `atrim=start=${(track.seekStart / 1000).toFixed(3)}${track.seekEnd > 0 ? `:end=${(track.seekEnd / 1000).toFixed(3)}` : ''}`;
          filters.push(trim, 'asetpts=PTS-STARTPTS');
        }

        if (track.startTime > 0) {
          filters.push(`adelay=${track.startTime}|${track.startTime}`);
        }

        if (track.endTime > 0) {
          filters.push(`atrim=end=${(track.endTime / 1000).toFixed(3)}`);
        }

        if (track.loop) {
          filters.push('aloop=loop=-1:size=2e+9');
        }

        if (track.fadeInDuration > 0) {
          filters.push(`afade=t=in:st=0:d=${(track.fadeInDuration / 1000).toFixed(3)}`);
        }

        if (track.fadeOutDuration > 0) {
          const st = Math.max(0, totalDurationSec - track.fadeOutDuration / 1000);
          filters.push(`afade=t=out:st=${st.toFixed(3)}:d=${(track.fadeOutDuration / 1000).toFixed(3)}`);
        }

        const outLabel = `[ao${i}]`;
        filterParts.push(`[${i + 1}:a]${filters.join(',')}${outLabel}`);
        chainLabels.push(outLabel);
      });

      let mapLabel: string;
      if (loadedAudios.length === 1) {
        mapLabel = chainLabels[0];
      } else {
        mapLabel = '[amix]';
        filterParts.push(
          `${chainLabels.join('')}amix=inputs=${loadedAudios.length}:duration=first${mapLabel}`
        );
      }

      args.push('-filter_complex', filterParts.join(';'));
      args.push('-map', '0:v', '-map', mapLabel);
      args.push('-c:a', outputFormat === 'mp4' ? 'aac' : 'libopus');
      if (project.audioBitrate) args.push('-b:a', project.audioBitrate);
    } else {
      args.push('-an');
    }

    args.push('-t', String(totalDurationSec), outputFile);

    await ffmpeg.exec(args);

    onProgress({ pct: 0.98, status: 'Đọc kết quả...' });

    const rawData = await ffmpeg.readFile(outputFile);
    // Copy into a guaranteed plain ArrayBuffer (ffmpeg may use SharedArrayBuffer internally)
    let plainBuffer: ArrayBuffer;
    if (typeof rawData === 'string') {
      plainBuffer = new TextEncoder().encode(rawData).buffer as ArrayBuffer;
    } else {
      const tmp = new Uint8Array(rawData.byteLength);
      tmp.set(rawData);
      plainBuffer = tmp.buffer as ArrayBuffer;
    }
    const resultBlob = new Blob([plainBuffer], {
      type: outputFormat === 'mp4' ? 'video/mp4' : 'video/webm',
    });

    onProgress({ pct: 1, status: 'Hoàn tất!' });
    return resultBlob;
  } finally {
    document.body.removeChild(container);
    for (const face of loadedFonts) document.fonts.delete(face);
  }
}

function seekAnimations(el: HTMLElement, timeMs: number) {
  try {
    const anims = el.getAnimations({ subtree: true } as GetAnimationsOptions);
    for (const anim of anims) {
      anim.pause();
      anim.currentTime = timeMs;
    }
  } catch {
    // getAnimations with subtree may not be available in all browsers
  }
}

function rafTick(count: number): Promise<void> {
  return new Promise<void>((resolve) => {
    let n = count;
    const tick = () => {
      if (--n <= 0) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      type,
      quality
    );
  });
}
