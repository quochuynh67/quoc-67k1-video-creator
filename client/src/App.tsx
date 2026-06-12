import { useEffect, useMemo, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { renderProject, getDownloadUrl } from "./lib/api";
import type { Project, Scene, AudioTrack, FontEntry } from "./lib/types";
import { SceneListItem } from "./components/SceneList";
import { TEMPLATES, instantiateTemplate } from "./lib/templates";

const uid = () => crypto.randomUUID();

const TRANSITIONS = [
  { value: "fade", label: "Mờ dần" },
  { value: "fadeblack", label: "Mờ đen" },
  { value: "fadewhite", label: "Mờ trắng" },
  { value: "dissolve", label: "Tan biến" },
  { value: "wipeleft", label: "Quét trái" },
  { value: "wiperight", label: "Quét phải" },
  { value: "wipeup", label: "Quét lên" },
  { value: "wipedown", label: "Quét xuống" },
  { value: "slideleft", label: "Trượt trái" },
  { value: "slideright", label: "Trượt phải" },
  { value: "slideup", label: "Trượt lên" },
  { value: "slidedown", label: "Trượt xuống" },
  { value: "circlecrop", label: "Cắt tròn" },
  { value: "rectcrop", label: "Cắt chữ nhật" },
  { value: "circleopen", label: "Mở vòng tròn" },
  { value: "circleclose", label: "Đóng vòng tròn" },
  { value: "horzopen", label: "Mở ngang" },
  { value: "horzclose", label: "Đóng ngang" },
  { value: "vertopen", label: "Mở dọc" },
  { value: "vertclose", label: "Đóng dọc" },
  { value: "radial", label: "Xoay tròn" },
  { value: "hblur", label: "Mờ ngang" },
  { value: "zoomin", label: "Phóng to" },
  { value: "pixelize", label: "Pixel hóa" },
  { value: "diagbl", label: "Chéo dưới trái" },
  { value: "diagbr", label: "Chéo dưới phải" },
  { value: "diagtl", label: "Chéo trên trái" },
  { value: "diagtr", label: "Chéo trên phải" },
  { value: "hlslice", label: "Cắt lát ngang trái" },
  { value: "hrslice", label: "Cắt lát ngang phải" },
  { value: "vuslice", label: "Cắt lát dọc lên" },
  { value: "vdslice", label: "Cắt lát dọc xuống" },
  { value: "squeezev", label: "Ép dọc" },
  { value: "squeezeh", label: "Ép ngang" },
  { value: "coverleft", label: "Phủ trái" },
  { value: "coverright", label: "Phủ phải" },
  { value: "coverup", label: "Phủ lên" },
  { value: "coverdown", label: "Phủ xuống" },
  { value: "revealleft", label: "Hé lộ trái" },
  { value: "revealright", label: "Hé lộ phải" },
  { value: "revealup", label: "Hé lộ lên" },
  { value: "revealdown", label: "Hé lộ xuống" },
];

function makeScene(n: number): Scene {
  return {
    id: uid(),
    name: `Scene ${n}`,
    duration: 4000,
    background: "#0f172a",
    sourceType: "html",
    html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:56px;font-family:system-ui;font-weight:bold;">Scene ${n}</div>`,
    url: "",
    transition: null,
    startTime: 0,
    autostartRender: true,
  };
}

const initialProject: Project = {
  width: 1280,
  height: 720,
  fps: 30,
  backgroundOpacity: 1,
  outputFormat: "mp4",
  videoQuality: 80,
  videoBitrate: "",
  audioBitrate: "",
  pixelFormat: "yuv420p",
  volume: 100,
  coverCapture: false,
  coverCaptureTime: 0,
  coverCaptureFormat: "jpg",
  attachCoverPath: "",
  fonts: [],
  audios: [],
  scenes: [
    {
      id: uid(),
      name: "Intro Scene",
      duration: 4000,
      background: "#1e1b4b",
      sourceType: "html",
      html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:system-ui;text-align:center;padding:20px;">
  <h1 style="font-size:54px;margin:0;background:linear-gradient(to right,#818cf8,#e0e7ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;">Welcome to 67k1 Video Creator</h1>
  <p style="font-size:24px;color:#a5b4fc;margin-top:10px;">Render beautiful animations from HTML templates</p>
</div>`,
      url: "",
      transition: null,
      startTime: 0,
      autostartRender: true,
    },
    {
      id: uid(),
      name: "Feature Scene",
      duration: 4000,
      background: "#062f4f",
      sourceType: "html",
      html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-family:system-ui;">
  <div style="border:2px solid #22d3ee;padding:30px;border-radius:12px;background:rgba(0,0,0,0.4);text-align:center;">
    <div style="font-size:48px;color:#22d3ee;font-weight:700;">Full Puppeteer Support</div>
    <div style="font-size:20px;color:#93c5fd;margin-top:8px;">Highly customizable components and styles</div>
  </div>
</div>`,
      url: "",
      transition: null,
      startTime: 0,
      autostartRender: true,
    }
  ]
};

function PropSection({
  title,
  defaultOpen = false,
  children
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="prop-section">
      <summary className="prop-section-title">{title}</summary>
      <div className="prop-section-body">{children}</div>
    </details>
  );
}

// Injected into every iframe write — exposes window.__wvc for animation control
const CTRL = `<script>(function(){var g=function(){return document.getAnimations?document.getAnimations():[]};window.__wvc={play:function(){g().forEach(function(a){a.play()})},pause:function(){g().forEach(function(a){a.pause()})},seek:function(t){g().forEach(function(a){a.currentTime=t})}}})();</script>`;

const fmt = (ms: number) => {
  const s = ms / 1000;
  return `${s.toFixed(1)}s`;
};

export default function App() {
  const [project, setProject] = useState<Project>(initialProject);
  const [selectedId, setSelectedId] = useState(project.scenes[0].id);
  const [busy, setBusy] = useState(false);
  const [renderFilename, setRenderFilename] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playhead, setPlayhead] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSceneId = useRef("");
  const rafRef = useRef<number | null>(null);
  // Tracks { time: performance.now(), playhead: ms } at the moment play started
  const playOrigin = useRef({ time: 0, ms: 0 });

  const selected = useMemo(
    () => project.scenes.find((s) => s.id === selectedId) ?? project.scenes[0],
    [project, selectedId]
  );

  const duration = selected?.duration ?? 4000;

  // Call a method on the iframe's __wvc controller
  const wvc = (method: "play" | "pause" | "seek", arg?: number) => {
    try {
      const api = (iframeRef.current?.contentWindow as any)?.__wvc;
      if (api) arg !== undefined ? api[method](arg) : api[method]();
    } catch {}
  };

  const writeToIframe = (html: string) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    try {
      doc.open();
      doc.write(CTRL + html);
      doc.close();
    } catch {}
  };

  // RAF loop — runs while isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const tick = (now: number) => {
      const elapsed = now - playOrigin.current.time;
      const cur = playOrigin.current.ms + elapsed;
      if (cur >= duration) {
        setPlayhead(duration);
        setIsPlaying(false);
        return;
      }
      setPlayhead(cur);
      rafRef.current = requestAnimationFrame(tick);
    };
    playOrigin.current = { time: performance.now(), ms: playhead };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Pause the iframe animations when not playing
  useEffect(() => {
    if (!isPlaying) wvc("pause");
  }, [isPlaying]);

  // Scene switch: write content + reset playhead
  useEffect(() => {
    if (selected?.sourceType !== "html") return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const write = () => {
      writeToIframe(selected.html ?? "");
      setPlayhead(0);
      setIsPlaying(true);
      playOrigin.current = { time: performance.now(), ms: 0 };
    };

    if (
      iframe.contentDocument?.readyState === "complete" ||
      iframe.contentDocument?.readyState === "interactive"
    ) {
      write();
      return;
    }
    iframe.addEventListener("load", write, { once: true });
    return () => iframe.removeEventListener("load", write);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (playhead >= duration) {
        // Restart from beginning
        writeToIframe(selected?.html ?? "");
        setPlayhead(0);
        playOrigin.current = { time: performance.now(), ms: 0 };
      } else {
        playOrigin.current = { time: performance.now(), ms: playhead };
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (ms: number) => {
    setPlayhead(ms);
    wvc("seek", ms);
    if (isPlaying) {
      // Update origin so RAF continues from new position
      playOrigin.current = { time: performance.now(), ms };
    }
  };

  const handleRestart = () => {
    writeToIframe(selected?.html ?? "");
    setPlayhead(0);
    setIsPlaying(true);
    playOrigin.current = { time: performance.now(), ms: 0 };
  };

  // Typing: debounce preview update so animations aren't restarted on every keystroke
  useEffect(() => {
    if (selected?.sourceType !== "html") return;
    // Skip on scene switch — the effect above handles that
    if (lastSceneId.current !== selectedId) {
      lastSceneId.current = selectedId;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      writeToIframe(selected.html ?? "");
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.html]);

  const updateProject = (patch: Partial<Project>) =>
    setProject((p) => ({ ...p, ...patch }));

  const updateScene = (patch: Partial<Scene>) =>
    setProject((p) => ({
      ...p,
      scenes: p.scenes.map((s) => (s.id === selectedId ? { ...s, ...patch } : s))
    }));

  const addScene = () => {
    const scene = makeScene(project.scenes.length + 1);
    setProject((p) => ({ ...p, scenes: [...p.scenes, scene] }));
    setSelectedId(scene.id);
  };

  const deleteScene = (id: string) => {
    if (project.scenes.length <= 1) return;
    setProject((p) => ({ ...p, scenes: p.scenes.filter((s) => s.id !== id) }));
    if (selectedId === id) {
      setSelectedId(project.scenes.find((s) => s.id !== id)!.id);
    }
  };

  const duplicateScene = (id: string) => {
    const src = project.scenes.find((s) => s.id === id);
    if (!src) return;
    const copy = { ...src, id: uid(), name: `${src.name} Copy` };
    setProject((p) => ({ ...p, scenes: [...p.scenes, copy] }));
    setSelectedId(copy.id);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProject((p) => {
      const oldIndex = p.scenes.findIndex((s) => s.id === active.id);
      const newIndex = p.scenes.findIndex((s) => s.id === over.id);
      return { ...p, scenes: arrayMove(p.scenes, oldIndex, newIndex) };
    });
  };

  // Audio operations (project-level)
  const addAudio = () => {
    const track: AudioTrack = {
      id: uid(), path: "", loop: false, volume: 100,
      startTime: 0, endTime: 0, seekStart: 0, seekEnd: 0,
      fadeInDuration: 0, fadeOutDuration: 0,
    };
    updateProject({ audios: [...project.audios, track] });
  };
  const removeAudio = (id: string) =>
    updateProject({ audios: project.audios.filter((a) => a.id !== id) });
  const updateAudio = (id: string, patch: Partial<AudioTrack>) =>
    updateProject({ audios: project.audios.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

  // Font operations (project-level)
  const addFont = () => {
    const font: FontEntry = { id: uid(), path: "", family: "", format: "truetype" };
    updateProject({ fonts: [...project.fonts, font] });
  };
  const removeFont = (id: string) =>
    updateProject({ fonts: project.fonts.filter((f) => f.id !== id) });
  const updateFont = (id: string, patch: Partial<FontEntry>) =>
    updateProject({ fonts: project.fonts.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

  const loadTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const scenes = instantiateTemplate(tpl);
    setProject((p) => ({ ...p, scenes }));
    setSelectedId(scenes[0].id);
    setShowTemplates(false);
  };

  const handleRender = async () => {
    setBusy(true);
    setRenderError(null);
    setRenderFilename(null);
    try {
      const res = await renderProject(project);
      if (res.ok && res.filename) {
        setRenderFilename(res.filename);
      } else {
        throw new Error(res.error || "Không thể tạo video");
      }
    } catch (err: any) {
      setRenderError(err.message || "Đã xảy ra lỗi trong quá trình xuất video");
    } finally {
      setBusy(false);
    }
  };

  const iframeSrc = selected?.sourceType === "url" && selected.url
    ? selected.url
    : "about:blank";

  return (
    <div className="app">
      {/* Preview */}
      <main className="preview">
        <div className="preview-info">
          Viewport: <span>{project.width}x{project.height}</span> · {project.fps}fps
        </div>
        <div
          className="preview-container"
          style={{ width: project.width / 2, height: project.height / 2, background: selected?.background }}
        >
          <iframe
            ref={iframeRef}
            key={selected?.id}
            src={iframeSrc}
            title="xem trước"
            style={{
              width: project.width,
              height: project.height,
              border: "none",
              transform: "scale(0.5)",
              transformOrigin: "top left",
              background: "transparent"
            }}
          />
        </div>

        {/* Preview Controller */}
        {selected?.sourceType === "html" && (
          <div className="preview-controller">
            <button className="ctrl-btn" onClick={handleRestart} title="Bắt đầu lại">↺</button>
            <button className="ctrl-btn ctrl-play" onClick={togglePlay} title={isPlaying ? "Tạm dừng" : "Phát"}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <span className="ctrl-time">{fmt(playhead)}</span>
            <input
              className="ctrl-seek"
              type="range"
              min={0}
              max={duration}
              step={100}
              value={Math.min(playhead, duration)}
              onChange={(e) => handleSeek(Number(e.target.value))}
            />
            <span className="ctrl-time ctrl-total">{fmt(duration)}</span>
          </div>
        )}

        {(busy || renderFilename || renderError) && (
          <div className="render-overlay">
            <div className="render-status-card">
              {busy && (
                <>
                  <div className="spinner"></div>
                  <h3 className="render-title">Đang xuất video</h3>
                  <p className="render-subtitle">Chrome đang dựng animation HTML và biên dịch qua FFmpeg...</p>
                </>
              )}
              {renderFilename && (
                <>
                  <h3 className="render-title" style={{ color: "#10b981" }}>🎉 Xuất video thành công!</h3>
                  <p className="render-subtitle">Video của bạn đã được tạo xong.</p>
                  <a href={getDownloadUrl(renderFilename)} target="_blank" rel="noreferrer">
                    <button className="btn-success">Tải video ({project.outputFormat.toUpperCase()})</button>
                  </a>
                  <button onClick={() => setRenderFilename(null)} style={{ marginTop: 12, width: "100%", background: "transparent", border: "1px solid var(--border-color)" }}>
                    Đóng
                  </button>
                </>
              )}
              {renderError && (
                <>
                  <h3 className="render-title" style={{ color: "#ef4444" }}>❌ Xuất video thất bại</h3>
                  <p className="render-subtitle">Đã xảy ra lỗi trong quá trình biên dịch.</p>
                  <div className="render-error">{renderError}</div>
                  <button onClick={() => setRenderError(null)} style={{ marginTop: 20, width: "100%", background: "transparent", border: "1px solid var(--border-color)" }}>
                    Bỏ qua
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bảng thuộc tính */}
      <aside className="props">
        <div className="panel-header">
          <h2>Thuộc tính</h2>
        </div>
        <div className="panel-content">

          {/* ── Dự án ── */}
          <PropSection title="Dự án" defaultOpen>
            <div className="form-row">
              <div className="form-group">
                <label>Chiều rộng (px)</label>
                <input type="number" value={project.width} onChange={(e) => updateProject({ width: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Chiều cao (px)</label>
                <input type="number" value={project.height} onChange={(e) => updateProject({ height: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>FPS</label>
                <input type="number" value={project.fps} onChange={(e) => updateProject({ fps: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Độ mờ nền</label>
                <input type="number" step="0.1" min="0" max="1" value={project.backgroundOpacity} onChange={(e) => updateProject({ backgroundOpacity: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label>Định dạng xuất</label>
              <select value={project.outputFormat} onChange={(e) => updateProject({ outputFormat: e.target.value as "mp4" | "webm" })}>
                <option value="mp4">MP4 Video</option>
                <option value="webm">WebM (Hỗ trợ trong suốt)</option>
              </select>
            </div>
          </PropSection>

          {/* ── Chất lượng xuất ── */}
          <PropSection title="Chất lượng xuất">
            <div className="form-row">
              <div className="form-group">
                <label>Chất lượng video (0–100)</label>
                <input type="number" min="0" max="100" value={project.videoQuality} onChange={(e) => updateProject({ videoQuality: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Âm lượng (%)</label>
                <input type="number" min="0" max="200" value={project.volume} onChange={(e) => updateProject({ volume: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Bitrate video</label>
                <input placeholder="vd: 8192k" value={project.videoBitrate} onChange={(e) => updateProject({ videoBitrate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Bitrate âm thanh</label>
                <input placeholder="vd: 320k" value={project.audioBitrate} onChange={(e) => updateProject({ audioBitrate: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Định dạng pixel</label>
              <select value={project.pixelFormat} onChange={(e) => updateProject({ pixelFormat: e.target.value as Project["pixelFormat"] })}>
                <option value="yuv420p">yuv420p (Mặc định, tương thích cao)</option>
                <option value="yuv444p">yuv444p (Màu sắc chính xác hơn)</option>
                <option value="rgb24">rgb24 (Chính xác nhất, file lớn)</option>
              </select>
            </div>
          </PropSection>

          {/* ── Ảnh bìa ── */}
          <PropSection title="Ảnh bìa">
            <div className="toggle-row">
              <label>Chụp khung bìa</label>
              <input type="checkbox" className="toggle" checked={project.coverCapture} onChange={(e) => updateProject({ coverCapture: e.target.checked })} />
            </div>
            {project.coverCapture && (
              <div className="form-row">
                <div className="form-group">
                  <label>Thời điểm chụp (ms)</label>
                  <input type="number" step="100" value={project.coverCaptureTime} onChange={(e) => updateProject({ coverCaptureTime: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Định dạng</label>
                  <select value={project.coverCaptureFormat} onChange={(e) => updateProject({ coverCaptureFormat: e.target.value as Project["coverCaptureFormat"] })}>
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="bmp">BMP</option>
                  </select>
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Đường dẫn ảnh bìa</label>
              <input placeholder="./cover.jpg" value={project.attachCoverPath} onChange={(e) => updateProject({ attachCoverPath: e.target.value })} />
            </div>
          </PropSection>

          {/* ── Phông chữ ── */}
          <PropSection title={`Phông chữ${project.fonts.length ? ` (${project.fonts.length})` : ""}`}>
            {project.fonts.map((font, i) => (
              <div key={font.id} className="media-card">
                <div className="card-header">
                  <span className="card-title">Phông {i + 1}</span>
                  <button className="btn-remove" onClick={() => removeFont(font.id)}>Xóa</button>
                </div>
                <div className="form-group">
                  <label>Đường dẫn / URL</label>
                  <input placeholder="./font.ttf" value={font.path} onChange={(e) => updateFont(font.id, { path: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên font family</label>
                    <input placeholder="MyFont" value={font.family} onChange={(e) => updateFont(font.id, { family: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Định dạng</label>
                    <select value={font.format} onChange={(e) => updateFont(font.id, { format: e.target.value })}>
                      <option value="truetype">truetype (TTF)</option>
                      <option value="opentype">opentype (OTF)</option>
                      <option value="woff">woff</option>
                      <option value="woff2">woff2</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn-add" onClick={addFont}>+ Thêm phông chữ</button>
          </PropSection>

          {/* ── Âm thanh nền ── */}
          <PropSection title={`Âm thanh nền${project.audios.length ? ` (${project.audios.length})` : ""}`}>
            {project.audios.map((audio, i) => (
              <div key={audio.id} className="media-card">
                <div className="card-header">
                  <span className="card-title">Track {i + 1}</span>
                  <button className="btn-remove" onClick={() => removeAudio(audio.id)}>Xóa</button>
                </div>
                <div className="form-group">
                  <label>Đường dẫn / URL</label>
                  <input placeholder="./bgm.mp3" value={audio.path} onChange={(e) => updateAudio(audio.id, { path: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Âm lượng (%)</label>
                    <input type="number" min="0" max="200" value={audio.volume} onChange={(e) => updateAudio(audio.id, { volume: Number(e.target.value) })} />
                  </div>
                  <div className="form-group" style={{ alignSelf: "end" }}>
                    <div className="toggle-row" style={{ marginBottom: 0 }}>
                      <label>Lặp lại</label>
                      <input type="checkbox" className="toggle" checked={audio.loop} onChange={(e) => updateAudio(audio.id, { loop: e.target.checked })} />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bắt đầu (ms)</label>
                    <input type="number" step="100" value={audio.startTime} onChange={(e) => updateAudio(audio.id, { startTime: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Kết thúc (ms)</label>
                    <input type="number" step="100" value={audio.endTime} onChange={(e) => updateAudio(audio.id, { endTime: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tua từ (ms)</label>
                    <input type="number" step="100" value={audio.seekStart} onChange={(e) => updateAudio(audio.id, { seekStart: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Tua đến (ms)</label>
                    <input type="number" step="100" value={audio.seekEnd} onChange={(e) => updateAudio(audio.id, { seekEnd: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fade vào (ms)</label>
                    <input type="number" step="50" value={audio.fadeInDuration} onChange={(e) => updateAudio(audio.id, { fadeInDuration: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Fade ra (ms)</label>
                    <input type="number" step="50" value={audio.fadeOutDuration} onChange={(e) => updateAudio(audio.id, { fadeOutDuration: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn-add" onClick={addAudio}>+ Thêm âm thanh</button>
          </PropSection>

          {/* ── Cảnh ── */}
          {selected && (
            <>
              <PropSection title="Cảnh hiện tại" defaultOpen>
                <div className="form-group">
                  <label>Tên cảnh</label>
                  <input value={selected.name} onChange={(e) => updateScene({ name: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Thời lượng (ms)</label>
                    <input type="number" step="100" value={selected.duration} onChange={(e) => updateScene({ duration: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Màu nền</label>
                    <input value={selected.background} onChange={(e) => updateScene({ background: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nguồn nội dung</label>
                  <div className="source-toggle">
                    <button
                      className={selected.sourceType === "html" ? "active" : ""}
                      onClick={() => updateScene({ sourceType: "html" })}
                    >HTML</button>
                    <button
                      className={selected.sourceType === "url" ? "active" : ""}
                      onClick={() => updateScene({ sourceType: "url" })}
                    >URL</button>
                  </div>
                </div>

                {selected.sourceType === "url" ? (
                  <div className="form-group">
                    <label>Địa chỉ trang</label>
                    <input
                      placeholder="http://localhost:8080/scene.html"
                      value={selected.url}
                      onChange={(e) => updateScene({ url: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Nội dung HTML</label>
                    <textarea value={selected.html} onChange={(e) => updateScene({ html: e.target.value })} />
                  </div>
                )}
              </PropSection>

              {/* ── Capture ── */}
              <PropSection title="Ghi hình">
                <div className="form-group">
                  <label>Bắt đầu ghi tại (ms)</label>
                  <input
                    type="number"
                    step="100"
                    value={selected.startTime}
                    onChange={(e) => updateScene({ startTime: Number(e.target.value) })}
                  />
                </div>
                <div className="toggle-row">
                  <label>Tự động bắt đầu</label>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={selected.autostartRender}
                    onChange={(e) => updateScene({ autostartRender: e.target.checked })}
                  />
                </div>
              </PropSection>

              {/* ── Hiệu ứng chuyển cảnh ── */}
              <PropSection title="Chuyển cảnh (sau cảnh này)">
                <div className="toggle-row">
                  <label>Bật hiệu ứng</label>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={selected.transition !== null}
                    onChange={(e) =>
                      updateScene({
                        transition: e.target.checked
                          ? { id: "fade", duration: 500 }
                          : null
                      })
                    }
                  />
                </div>
                {selected.transition && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Hiệu ứng</label>
                      <select
                        value={selected.transition.id}
                        onChange={(e) =>
                          updateScene({ transition: { ...selected.transition!, id: e.target.value } })
                        }
                      >
                        {TRANSITIONS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Thời gian (ms)</label>
                      <input
                        type="number"
                        step="100"
                        value={selected.transition.duration}
                        onChange={(e) =>
                          updateScene({ transition: { ...selected.transition!, duration: Number(e.target.value) } })
                        }
                      />
                    </div>
                  </div>
                )}
              </PropSection>
            </>
          )}

        </div>
      </aside>

      {/* Template picker modal */}
      {showTemplates && (
        <div className="template-overlay" onClick={() => setShowTemplates(false)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <h3>Chọn template</h3>
              <button className="btn-close-modal" onClick={() => setShowTemplates(false)}>✕</button>
            </div>
            <div className="template-grid">
              {TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="template-card" onClick={() => loadTemplate(tpl.id)}>
                  <div className="template-category">{tpl.category}</div>
                  <div className="template-name">{tpl.name}</div>
                  <div className="template-desc">{tpl.description}</div>
                  <div className="template-scenes">{tpl.scenes.length} cảnh</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline — Scene Track (bottom) */}
      <aside className="sidebar">
        <div className="timeline-controls">
          <span className="timeline-label">Cảnh ({project.scenes.length})</span>
          <button onClick={() => setShowTemplates(true)} className="btn-template">📋 Template</button>
          <button onClick={addScene} className="btn-secondary">+ Thêm</button>
          <button onClick={handleRender} disabled={busy} className="btn-primary">
            🚀 Xuất
          </button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={project.scenes.map((s) => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="scene-list">
              {project.scenes.map((scene) => (
                <SceneListItem
                  key={scene.id}
                  scene={scene}
                  active={scene.id === selectedId}
                  onSelect={() => setSelectedId(scene.id)}
                  onDelete={() => deleteScene(scene.id)}
                  onDuplicate={() => duplicateScene(scene.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </aside>
    </div>
  );
}
