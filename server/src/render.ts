import WebVideoCreator from "web-video-creator";
import { mkdirSync, createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import os from "node:os";
import type { Project } from "./types.js";
import { buildChunks } from "./templates.js";

function downloadToTemp(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        downloadToTemp(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", reject);
    }).on("error", reject);
  });
}

export async function renderProject(project: Project) {
  const outputDir = path.resolve("output");
  mkdirSync(outputDir, { recursive: true });

  const wvc = new WebVideoCreator();
  wvc.config({ compatibleRenderingMode: true });

  const filename = `render-${Date.now()}.${project.outputFormat}`;
  const outputPath = path.join(outputDir, filename);

  const videoOptions: Record<string, unknown> = {
    width: project.width,
    height: project.height,
    fps: project.fps,
    chunks: buildChunks(project),
    outputPath,
    backgroundOpacity: project.backgroundOpacity,
    showProgress: true,
  };

  if (project.videoBitrate) {
    videoOptions.videoBitrate = project.videoBitrate;
  } else if (project.videoQuality > 0 && project.videoQuality < 100) {
    videoOptions.videoQuality = project.videoQuality;
  }

  if (project.audioBitrate) videoOptions.audioBitrate = project.audioBitrate;
  if (project.pixelFormat) videoOptions.pixelFormat = project.pixelFormat;
  if (project.volume !== 100) videoOptions.volume = project.volume;

  if (project.coverCapture) {
    videoOptions.coverCapture = true;
    if (project.coverCaptureTime > 0) videoOptions.coverCaptureTime = project.coverCaptureTime;
    if (project.coverCaptureFormat) videoOptions.coverCaptureFormat = project.coverCaptureFormat;
  }

  let tempCoverPath: string | null = null;
  if (project.attachCoverPath) {
    const cp = project.attachCoverPath.trim();
    if (cp.startsWith("http://") || cp.startsWith("https://")) {
      const ext = cp.split("?")[0].split(".").pop() || "jpg";
      tempCoverPath = path.join(os.tmpdir(), `wvc-cover-${Date.now()}.${ext}`);
      await downloadToTemp(cp, tempCoverPath);
      videoOptions.attachCoverPath = tempCoverPath;
    } else {
      videoOptions.attachCoverPath = cp;
    }
  }

  const video = (wvc as any).createMultiVideo(videoOptions);

  const validFonts = (project.fonts ?? []).filter((f) => f.path?.trim() && f.family?.trim());
  if (validFonts.length) {
    video.registerFonts(validFonts.map((f) => ({
      path: f.path,
      family: f.family,
      format: f.format,
    })));
  }

  const validAudios = (project.audios ?? []).filter((a) => a.path?.trim());
  const tempAudioPaths: string[] = [];
  const resolvedAudios = await Promise.all(
    validAudios.map(async (a) => {
      let resolvedPath = a.path;
      if (a.path.startsWith("http://") || a.path.startsWith("https://")) {
        const ext = a.path.split("?")[0].split(".").pop() || "mp3";
        const tmp = path.join(os.tmpdir(), `wvc-audio-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
        await downloadToTemp(a.path, tmp);
        tempAudioPaths.push(tmp);
        resolvedPath = tmp;
      }
      return { ...a, path: resolvedPath };
    })
  );
  if (resolvedAudios.length) {
    video.addAudios(resolvedAudios.map((a) => ({
      path: a.path,
      loop: a.loop,
      volume: a.volume,
      ...(a.startTime > 0 && { startTime: a.startTime }),
      ...(a.endTime > 0 && { endTime: a.endTime }),
      ...(a.seekStart > 0 && { seekStart: a.seekStart }),
      ...(a.seekEnd > 0 && { seekEnd: a.seekEnd }),
      ...(a.fadeInDuration > 0 && { fadeInDuration: a.fadeInDuration }),
      ...(a.fadeOutDuration > 0 && { fadeOutDuration: a.fadeOutDuration }),
    })));
  }

  await new Promise<void>((resolve, reject) => {
    video.once("completed", () => resolve());
    video.once("error", (err: unknown) => reject(err));
    video.start();
  });

  if (tempCoverPath) unlink(tempCoverPath).catch(() => {});
  for (const p of tempAudioPaths) unlink(p).catch(() => {});

  return { filename, outputPath };
}
