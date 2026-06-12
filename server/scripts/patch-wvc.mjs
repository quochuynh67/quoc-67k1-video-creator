#!/usr/bin/env node
// Patches web-video-creator logger.js to fix deprecated util.isString() call
// that crashes on modern Node.js versions.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const loggerPath = resolve(__dirname, "..", "node_modules", "web-video-creator", "lib", "logger.js");

try {
  let content = readFileSync(loggerPath, "utf-8");
  if (content.includes("util.isString")) {
    content = content.replace(
      /!util\.isString\((.+?)\)/g,
      'typeof ($1) !== "string"'
    );
    writeFileSync(loggerPath, content, "utf-8");
    console.log("[patch] Fixed deprecated util.isString in web-video-creator/lib/logger.js");
  } else {
    console.log("[patch] web-video-creator/lib/logger.js already patched");
  }
} catch (err) {
  console.warn("[patch] Could not patch web-video-creator:", err.message);
}
