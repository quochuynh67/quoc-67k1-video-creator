import express from "express";
import cors from "cors";
import path from "node:path";
import { mkdirSync } from "node:fs";
import fs from "node:fs/promises";
import multer from "multer";
import { renderProject } from "./render.js";
import type { Project } from "./types.js";
import { convertToHls, listAllMp4s } from "./hls.js";
import type { HlsOptions } from "./hls.js";

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

const hlsOutputDir = path.resolve("output/hls");
mkdirSync(hlsOutputDir, { recursive: true });

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

// POST /api/convert-hls
// Body: { inputPath: string (absolute or /uploads/... url), outputDir?: string, ...HlsOptions }
// Returns conversion result with playlistUrl for streaming.
app.post("/api/convert-hls", async (req, res) => {
  try {
    const { inputPath, outputDir: rawOutputDir, ...hlsOpts } = req.body as {
      inputPath: string;
      outputDir?: string;
    } & HlsOptions;

    if (!inputPath) {
      res.status(400).json({ ok: false, error: "inputPath is required" });
      return;
    }

    // Resolve inputPath: accept URL-style /uploads/... or absolute paths
    const absInput = inputPath.startsWith("/uploads/")
      ? path.join(uploadDir, path.basename(inputPath))
      : path.resolve(inputPath);

    const stat = await fs.stat(absInput).catch(() => null);
    if (!stat) {
      res.status(400).json({ ok: false, error: `File not found: ${inputPath}` });
      return;
    }

    const outDir = rawOutputDir ? path.resolve(rawOutputDir) : hlsOutputDir;
    mkdirSync(outDir, { recursive: true });

    if (stat.isFile()) {
      if (!absInput.toLowerCase().endsWith(".mp4")) {
        res.status(400).json({ ok: false, error: "File must be an MP4" });
        return;
      }

      const result = await convertToHls(absInput, outDir, hlsOpts);
      if (!result.ok) {
        res.status(422).json(result);
        return;
      }

      const relPlaylist = path.relative(path.resolve("output"), result.playlistFile);
      res.json({ ...result, playlistUrl: `/output/${relPlaylist.replace(/\\/g, "/")}` });
    } else {
      // Directory: convert all MP4s inside
      const mp4Files = await listAllMp4s(absInput);
      if (!mp4Files.length) {
        res.status(400).json({ ok: false, error: "No MP4 files found in directory" });
        return;
      }

      const results = [];
      for (const file of mp4Files) {
        const result = await convertToHls(file, outDir, hlsOpts);
        if (result.ok) {
          const relPlaylist = path.relative(path.resolve("output"), result.playlistFile);
          results.push({ ...result, playlistUrl: `/output/${relPlaylist.replace(/\\/g, "/")}` });
        } else {
          results.push(result);
        }
      }

      res.json({ ok: true, results });
    }
  } catch (error: any) {
    console.error("HLS conversion failed:", error);
    res.status(500).json({ ok: false, error: error?.message ?? "Conversion error" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
