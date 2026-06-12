# Quoc 67k1 video creator web — Web Video Creator

(Link Demo)[https://quoc-67k1-video-creator.vercel.app/]

Trình chỉnh sửa video trên trình duyệt, tạo video từ các cảnh HTML animation và ghép nhạc nền.

## Cấu trúc dự án

```
wvc-editor/
├── client/          # React + TypeScript (Vite) — giao diện editor
├── server/          # Node.js + Express — render video & upload file
├── vercel.json      # Cấu hình Vercel (build client, serve dist/)
└── deploy.sh        # Script tự động build + deploy
```

## Yêu cầu

| Công cụ | Phiên bản |
|---------|-----------|
| Node.js | ≥ 18      |
| npm     | ≥ 9       |
| Vercel CLI | `npm i -g vercel` |

---

## Chạy local (Development)

### Cách 1 — Script tổng hợp

```bash
./deploy.sh --dev
```

Khởi động song song **client** (Vite, port 5173) và **server** (tsx watch, port 3001).

### Cách 2 — Thủ công

```bash
# Terminal 1: client
cd client && npm install && npm run dev

# Terminal 2: server
cd server && npm install && npm run dev
```

---

## Build

```bash
# Build cả hai workspace
npm run build

# Hoặc chỉ client (output → client/dist/)
cd client && npm run build
```

---

## Deploy lên Vercel

### Script một lệnh

```bash
# Preview deploy (URL tạm)
./deploy.sh

# Production deploy (URL chính thức)
./deploy.sh --prod

# Deploy không build lại (dùng dist/ hiện tại)
./deploy.sh --skip-build --prod
```

### Thủ công

```bash
# Từ thư mục gốc wvc-editor/
vercel deploy          # preview
vercel deploy --prod   # production
```

> **Lưu ý:** Luôn chạy `vercel deploy` từ thư mục gốc `wvc-editor/`, không phải từ `client/`. File `vercel.json` ở root cấu hình đúng `outputDirectory: "client/dist"`.

---

## Luồng deploy

```
./deploy.sh --prod
    │
    ├─ [1] npm install      (nếu node_modules chưa có)
    ├─ [2] tsc --noEmit     (kiểm tra TypeScript)
    ├─ [3] vite build       (output → client/dist/)
    └─ [4] vercel deploy --prod
```

---

## Cấu hình Vercel (`vercel.json`)

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "echo skip"
}
```

Vercel chạy build bên trong `client/` và serve từ `client/dist/`.

---

## Biến môi trường

Client kết nối server qua `http://localhost:3001` (hardcoded trong `FileOrUrlInput.tsx`). Khi deploy production, cần cập nhật URL server cho đúng.

---

## Server API

| Method | Endpoint         | Mô tả                        |
|--------|-----------------|------------------------------|
| POST   | `/api/upload`   | Upload file (font/audio/ảnh) |
| POST   | `/api/render`   | Bắt đầu render video         |
| GET    | `/api/status`   | Trạng thái render            |
| GET    | `/uploads/:file`| Tải file đã upload           |
| GET    | `/output/:file` | Tải video đã render          |
