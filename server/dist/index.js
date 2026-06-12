import express from "express";
import path from "node:path";
import { mkdirSync } from "node:fs";
import multer from "multer";
import { renderProject } from "./render.js";
const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
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
    if (!req.file) {
        res.status(400).json({ ok: false, error: "No file" });
        return;
    }
    res.json({ ok: true, path: `/uploads/${req.file.filename}`, filename: req.file.filename });
});
app.post("/api/render", async (req, res) => {
    try {
        const project = req.body;
        const result = await renderProject(project);
        res.json({ ok: true, ...result });
    }
    catch (error) {
        console.error("Render failed:", error);
        res.status(500).json({ ok: false, error: error?.message ?? "Render error" });
    }
});
app.get("/api/health", (_req, res) => res.json({ ok: true }));
const PORT = Number(3000);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API server running on port ${PORT}`);
});
