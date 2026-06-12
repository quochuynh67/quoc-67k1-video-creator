import express from "express";
import cors from "cors";
import path from "node:path";
import { mkdirSync } from "node:fs";
import multer from "multer";
import { renderProject } from "./render.js";
const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowed = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
            : ["https://quoc-67k1-video-creator.vercel.app"];
        if (!origin || allowed.includes(origin) || allowed.includes("*")) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.options("*", cors());
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
const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API server running on port ${PORT}`);
});
