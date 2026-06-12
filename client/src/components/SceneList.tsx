import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Scene } from "../lib/types";

export function SceneListItem({
  scene,
  active,
  onSelect,
  onDelete,
  onDuplicate
}: {
  scene: Scene;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: scene.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`scene-item ${active ? "active" : ""}`}
      onClick={onSelect}
    >
      <div className="drag-handle" {...attributes} {...listeners}>⠿</div>

      <div className="scene-details">
        <strong className="scene-name">{scene.name}</strong>
        <div className="scene-meta">
          <span className="scene-duration">{scene.duration} ms</span>
          {scene.sourceType === "url" && <span className="scene-badge url">URL</span>}
          {scene.transition && <span className="scene-badge fx">{scene.transition.id}</span>}
        </div>
      </div>

      <div className="scene-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon btn-dup" onClick={onDuplicate} title="Nhân bản">Nhân</button>
        <button className="btn-icon btn-del" onClick={onDelete} title="Xóa cảnh">Xóa</button>
      </div>
    </div>
  );
}
