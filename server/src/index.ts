import express from "express";
import cors from "cors";
import path from "node:path";
import { renderProject } from "./render.js";
import type { Project } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Serve the compiled videos statically
app.use("/output", express.static(path.resolve("output")));

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Serving render output from ${path.resolve("output")}`);
});
