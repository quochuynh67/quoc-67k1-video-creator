import { useRef, useState } from "react";
import { SERVER_BASE } from "../lib/api";

interface Props {
  value: string;
  onChange: (val: string) => void;
  accept?: string;
  placeholder?: string;
}

export function FileOrUrlInput({ value, onChange, accept, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${SERVER_BASE}/api/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) onChange(`${SERVER_BASE}${data.path}`);
    } catch {}
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="file-or-url">
      <input
        className="file-or-url__text"
        placeholder={placeholder ?? "Đường dẫn hoặc URL..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="file-or-url__btn"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="Chọn file từ máy"
      >
        {uploading ? "⏳" : "📁"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
