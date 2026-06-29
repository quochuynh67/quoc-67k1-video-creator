import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface HlsOptions {
  maxSizeMb?: number;
  startHlsTime?: number;
  minHlsTime?: number;
  stepDown?: number;
  maxRetries?: number;
  videoCodec?: string;
  audioCodec?: string;
  preset?: string;
  crf?: number;
  videoBitrateK?: number | null;
  audioBitrateK?: number;
  fps?: number | null;
  width?: number | null;
  profile?: string;
  level?: string;
}

export interface HlsResult {
  ok: true;
  inputFile: string;
  hlsDir: string;
  playlistFile: string;
  hlsTime: number;
  attempt: number;
  largestMb: number;
}

export interface HlsFailure {
  ok: false;
  inputFile: string;
  reason: string;
  largestMb: number | null;
  oversizedCount: number | null;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function removeDirSafe(dir: string) {
  await fs.rm(dir, { recursive: true, force: true });
}

async function getTsFilesWithSize(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: { file: string; sizeBytes: number; sizeMb: number }[] = [];
  for (const e of entries) {
    if (e.isFile() && e.name.toLowerCase().endsWith(".ts")) {
      const full = path.join(dir, e.name);
      const st = await fs.stat(full);
      out.push({ file: full, sizeBytes: st.size, sizeMb: st.size / 1024 / 1024 });
    }
  }
  out.sort((a, b) => a.sizeBytes - b.sizeBytes);
  return out;
}

async function verifySegments(dir: string, maxSizeMb: number) {
  const files = await getTsFilesWithSize(dir);
  const oversized = files.filter((x) => x.sizeMb > maxSizeMb);
  const largest = files.length ? files[files.length - 1] : null;
  return { files, oversized, largest, ok: oversized.length === 0 };
}

async function runFfmpegHls(
  inputFile: string,
  hlsDir: string,
  opts: Required<HlsOptions>,
  hlsTime: number
) {
  await fs.mkdir(hlsDir, { recursive: true });

  const playlistFile = path.join(hlsDir, "index.m3u8");
  const segPattern = path.join(hlsDir, "seg_%05d.ts");
  const ffArgs = ["-y", "-i", inputFile];

  if (opts.width) {
    ffArgs.push("-vf", `scale='min(${opts.width},iw)':-2`);
  }

  if (opts.fps) {
    ffArgs.push("-r", String(opts.fps));
  }

  const gop = opts.fps ? Math.max(1, Math.round(opts.fps * hlsTime)) : null;

  ffArgs.push(
    "-c:v", opts.videoCodec,
    "-preset", opts.preset,
    "-crf", String(opts.crf),
    "-profile:v", opts.profile,
    "-level", opts.level
  );

  if (opts.videoBitrateK) {
    ffArgs.push(
      "-maxrate", `${opts.videoBitrateK}k`,
      "-bufsize", `${opts.videoBitrateK * 2}k`
    );
  }

  if (gop) {
    ffArgs.push(
      "-g", String(gop),
      "-keyint_min", String(gop),
      "-sc_threshold", "0",
      "-force_key_frames", `expr:gte(t,n_forced*${hlsTime})`
    );
  }

  ffArgs.push(
    "-c:a", opts.audioCodec,
    "-b:a", `${opts.audioBitrateK}k`,
    "-ac", "2",
    "-start_number", "0",
    "-hls_time", String(hlsTime),
    "-hls_list_size", "0",
    "-hls_playlist_type", "vod",
    "-hls_flags", "independent_segments",
    "-hls_segment_filename", segPattern,
    "-f", "hls",
    playlistFile
  );

  await execFileAsync("ffmpeg", ffArgs);
  return { playlistFile, hlsDir };
}

export async function convertToHls(
  inputFile: string,
  outputDir: string,
  userOpts: HlsOptions = {}
): Promise<HlsResult | HlsFailure> {
  // Strip undefined values so they don't overwrite defaults via spread
  const defined = Object.fromEntries(
    Object.entries(userOpts).filter(([, v]) => v !== undefined)
  );
  const opts: Required<HlsOptions> = {
    maxSizeMb: 10,
    startHlsTime: 10,
    minHlsTime: 1,
    stepDown: 1,
    maxRetries: 10,
    videoCodec: "libx264",
    audioCodec: "aac",
    preset: "veryfast",
    crf: 23,
    videoBitrateK: null,
    audioBitrateK: 128,
    fps: null,
    width: null,
    profile: "main",
    level: "4.0",
    ...defined,
  };

  const baseName = path.basename(inputFile, path.extname(inputFile));
  const hlsDir = path.join(outputDir, baseName);

  let hlsTime = opts.startHlsTime;
  let attempt = 0;
  let lastCheck: Awaited<ReturnType<typeof verifySegments>> | null = null;

  while (attempt < opts.maxRetries && hlsTime >= opts.minHlsTime) {
    attempt += 1;
    await removeDirSafe(hlsDir);

    console.log(`[hls] attempt ${attempt}: ${baseName}, hls_time=${hlsTime}s`);
    try {
      await runFfmpegHls(inputFile, hlsDir, opts, hlsTime);
    } catch (err: any) {
      const stderr = err?.stderr ?? err?.message ?? String(err);
      throw new Error(`ffmpeg failed (attempt ${attempt}, hls_time=${hlsTime}s): ${stderr}`);
    }

    const check = await verifySegments(hlsDir, opts.maxSizeMb);
    lastCheck = check;

    if (check.ok) {
      return {
        ok: true,
        inputFile,
        hlsDir,
        playlistFile: path.join(hlsDir, "index.m3u8"),
        hlsTime,
        attempt,
        largestMb: check.largest?.sizeMb ?? 0,
      };
    }

    console.warn(
      `[hls] largest segment: ${check.largest?.sizeMb.toFixed(2)}MB, oversized: ${check.oversized.length}`
    );

    if (hlsTime <= opts.minHlsTime) break;
    hlsTime = clamp(hlsTime - opts.stepDown, opts.minHlsTime, opts.startHlsTime);
  }

  await removeDirSafe(hlsDir);

  return {
    ok: false,
    inputFile,
    reason: `Cannot satisfy max segment size ${opts.maxSizeMb}MB`,
    largestMb: lastCheck?.largest?.sizeMb ?? null,
    oversizedCount: lastCheck?.oversized?.length ?? null,
  };
}

export async function listAllMp4s(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp4"))
        out.push(fullPath);
    }
  }
  await walk(dir);
  return out;
}
