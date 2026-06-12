#!/usr/bin/env node
// Patches web-video-creator logger.js to fix deprecated util.isString() call
// that crashes on modern Node.js versions.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// npm workspaces may hoist web-video-creator to the repo root node_modules
const candidates = [
  resolve(__dirname, "..", "node_modules", "web-video-creator", "lib", "logger.js"),
  resolve(__dirname, "..", "..", "node_modules", "web-video-creator", "lib", "logger.js"),
];

const loggerPath = candidates.find(existsSync);

if (!loggerPath) {
  console.warn("[patch] Could not find web-video-creator/lib/logger.js in:", candidates);
  process.exit(0);
}

try {
  let content = readFileSync(loggerPath, "utf-8");
  if (content.includes("util.isString")) {
    content = content.replace(
      /!util\.isString\((.+?)\)/g,
      'typeof ($1) !== "string"'
    );
    writeFileSync(loggerPath, content, "utf-8");
    console.log("[patch] Fixed deprecated util.isString in", loggerPath);
  } else {
    console.log("[patch] Already patched:", loggerPath);
  }
} catch (err) {
  console.warn("[patch] Could not patch web-video-creator:", err.message);
}
