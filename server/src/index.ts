import express from "express";
import cors from "cors";
import path from "node:path";
import os from "node:os";
import { mkdirSync } from "node:fs";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import multer from "multer";
import { renderProject } from "./render.js";
import type { Project } from "./types.js";
import { convertToHls } from "./hls.js";
import type { HlsOptions } from "./hls.js";

const execFileAsync = promisify(execFile);

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});
app.use(express.json({ limit: "50mb" }));

const uploadDir = path.resolve("uploads");
mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

// Serve static assets
app.use("/output", express.static(path.resolve("output")));
app.use("/uploads", express.static(uploadDir));

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) { res.status(400).json({ ok: false, error: "No file" }); return; }
  res.json({ ok: true, path: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

app.post("/api/render", async (req, res) => {
  try {
    const project = req.body as Project;
    const result = await renderProject(project);
    res.json({ ok: true, ...result });
  } catch (error: any) {
    console.error("Render failed:", error);
    res.status(500).json({ ok: false, error: error?.message ?? "Render error" });
  }
});

// POST /api/convert-hls  (multipart: field "file" = MP4, optional JSON fields as form fields)
// One-shot: upload MP4 → convert → return zip → delete everything
const hlsUpload = multer({ dest: os.tmpdir() });
app.post("/api/convert-hls", hlsUpload.single("file"), async (req, res) => {
  const tmpInput = req.file?.path ?? null;
  let tmpHlsDir: string | null = null;
  let zipFile: string | null = null;

  async function cleanup() {
    await Promise.allSettled([
      tmpInput ? fs.rm(tmpInput, { force: true }) : Promise.resolve(),
      tmpHlsDir ? fs.rm(tmpHlsDir, { recursive: true, force: true }) : Promise.resolve(),
      zipFile ? fs.rm(zipFile, { force: true }) : Promise.resolve(),
    ]);
  }

  try {
    if (!tmpInput) {
      res.status(400).json({ ok: false, error: "Field 'file' (MP4) is required" });
      return;
    }

    const originalName = req.file!.originalname ?? "video.mp4";
    if (!originalName.toLowerCase().endsWith(".mp4")) {
      res.status(400).json({ ok: false, error: "File must be an MP4" });
      await cleanup();
      return;
    }

    // Rename to .mp4 so ffmpeg detects format correctly
    const namedInput = `${tmpInput}.mp4`;
    await fs.rename(tmpInput, namedInput);
    (req.file as any).path = namedInput;

    const hlsOpts: HlsOptions = {
      maxSizeMb: req.body.maxSizeMb ? Number(req.body.maxSizeMb) : undefined,
      startHlsTime: req.body.startHlsTime ? Number(req.body.startHlsTime) : undefined,
      minHlsTime: req.body.minHlsTime ? Number(req.body.minHlsTime) : undefined,
      stepDown: req.body.stepDown ? Number(req.body.stepDown) : undefined,
      maxRetries: req.body.maxRetries ? Number(req.body.maxRetries) : undefined,
      videoCodec: req.body.videoCodec,
      audioCodec: req.body.audioCodec,
      preset: req.body.preset,
      crf: req.body.crf ? Number(req.body.crf) : undefined,
      videoBitrateK: req.body.videoBitrateK ? Number(req.body.videoBitrateK) : undefined,
      audioBitrateK: req.body.audioBitrateK ? Number(req.body.audioBitrateK) : undefined,
      fps: req.body.fps ? Number(req.body.fps) : undefined,
      width: req.body.width ? Number(req.body.width) : undefined,
      profile: req.body.profile,
      level: req.body.level,
    };

    tmpHlsDir = await fs.mkdtemp(path.join(os.tmpdir(), "hls-out-"));
    const result = await convertToHls(namedInput, tmpHlsDir, hlsOpts);

    if (!result.ok) {
      res.status(422).json(result);
      await cleanup();
      return;
    }

    // Zip the HLS folder
    const baseName = path.basename(result.hlsDir);
    zipFile = path.join(os.tmpdir(), `${baseName}.zip`);
    await execFileAsync("zip", ["-r", zipFile, baseName], { cwd: tmpHlsDir });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${baseName}.zip"`);
    res.setHeader("X-Hls-Time", String(result.hlsTime));
    res.setHeader("X-Hls-Attempt", String(result.attempt));
    res.setHeader("X-Hls-Largest-Mb", result.largestMb.toFixed(2));

    res.download(zipFile, `${baseName}.zip`, async (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ ok: false, error: "Failed to send file" });
      }
      await cleanup();
    });
  } catch (error: any) {
    console.error("HLS conversion failed:", error);
    await cleanup();
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: error?.message ?? "Conversion error" });
    }
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
