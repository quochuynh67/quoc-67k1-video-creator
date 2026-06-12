import type { Project } from "./types";

const BASE = "http://localhost:3001";

export async function renderProject(project: Project) {
  const res = await fetch(`${BASE}/api/render`, {
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
  return `${BASE}/output/${filename}`;
}
