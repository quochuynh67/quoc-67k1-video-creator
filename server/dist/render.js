import WebVideoCreator from "web-video-creator";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { buildChunks } from "./templates.js";
export async function renderProject(project) {
    // Ensure output directory exists
    const outputDir = path.resolve("output");
    mkdirSync(outputDir, { recursive: true });
    // Initialize WebVideoCreator
    WebVideoCreator.config({
        debug: true
    });
    const wvc = new WebVideoCreator();
    const filename = `render-${Date.now()}.${project.outputFormat}`;
    const outputPath = path.join(outputDir, filename);
    const video = wvc.createMultiVideo({
        width: project.width,
        height: project.height,
        fps: project.fps,
        chunks: buildChunks(project),
        outputPath,
        backgroundOpacity: project.backgroundOpacity,
        showProgress: true
    });
    await video.startAndWait?.();
    if (!video.startAndWait) {
        await new Promise((resolve, reject) => {
            video.once("completed", () => resolve());
            video.once("error", (err) => reject(err));
            video.start();
        });
    }
    return { filename, outputPath };
}
