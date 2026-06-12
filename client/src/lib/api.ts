import type { Project } from "./types";

export const SERVER_BASE = "https://wvc-editor-server-production.up.railway.app";

export async function renderProject(project: Project) {
  const res = await fetch(`${SERVER_BASE}/api/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Render failed");
  }
  return res.json();
}

export function getDownloadUrl(filename: string) {
  return `${SERVER_BASE}/output/${filename}`;
}
