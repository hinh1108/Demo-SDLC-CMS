# Implementation Design + Security Checkpoint — US-01 Editor (slice #3)

> fullstack-guardian · 2026-07-20 · Bổ sung phần triển khai cho `US-01-editor.spec.md`.
> Slice này = tầng dữ liệu/API cho editor (create/edit content + save version). Editor UI (TipTap) đầy đủ ở FE app sau; slice cung cấp API + client + validation + versioning chạy được.

## Endpoints (bám openapi-v1.yaml)
| Method | Path | Mô tả |
|---|---|---|
| POST | `/v1/sites/:siteId/contents` | Tạo content `draft` (BR-02 slug unique) |
| GET | `/v1/contents/:id` | Chi tiết + current version |
| PATCH | `/v1/contents/:id` | Sửa title/slug (409 slug) |
| POST | `/v1/contents/:id/versions` | **Lưu (autosave)** → version mới (BR-01) |
| GET | `/v1/contents/:id/versions` | Lịch sử phiên bản |
| GET | `/v1/versions/:id` | Xem 1 phiên bản |

## Ba góc nhìn
**[Backend]** NestJS, `withTenant()` (RLS), parameterized queries; block content JSONB append-only; slugify tiếng Việt (bỏ dấu).
**[Frontend]** client `createContent/saveVersion/getContent` + `useContentDraft` (autosave debounce + offline queue). Editor TipTap ráp sau.
**[Security]** xem checklist dưới.

## Security Checkpoint (trước khi code)
- [x] **AuthN:** JwtGuard (mọi route).
- [x] **AuthZ:** người dùng đã đăng nhập của tenant được tạo/sửa nội dung (editor/contributor/manager/admin). **Publish** tách ở US-14 (contributor không publish). Tenant từ JWT.
- [x] **Site ownership:** kiểm `site` thuộc tenant (RLS trên `site`) trước khi tạo content → chống tạo content trỏ site tenant khác.
- [x] **Input validation (server):**
  - `kind` ∈ {page, post}; `title` 1..200; `slug` khớp `^[a-z0-9]+(-[a-z0-9]+)*$`.
  - **Block JSON**: chỉ `type` trong allow-list; `props` là object; `children` là mảng; **giới hạn** số block (≤500), độ sâu (≤6), kích thước (≤512KB). Reject 422 nếu vi phạm.
- [x] **Input validation (client):** guard title/slug rỗng + format (không phải hàng rào duy nhất).
- [x] **SQL injection:** parameterized ($1..$n); slugify không nối chuỗi SQL.
- [x] **Output encoding (XSS):** block lưu là **dữ liệu có cấu trúc** (không phải HTML thô). Khi render trang công khai (US-14) phải **escape/encode** text theo ngữ cảnh + allow-list thẻ. Slice này validate cấu trúc đầu vào; không tự sinh HTML.
- [x] **BR-02 slug unique:** ràng buộc `UNIQUE(site_id, slug)` + kiểm trước → 409 kèm gợi ý.
- [x] **BR-01 versioning:** mỗi save = 1 `content_version` (append-only) → khôi phục được.
- [x] **Isolation:** RLS mọi query; cross-tenant → 404.
- [x] **Error handling:** 409 slug-conflict · 422 validation · 404 not-found · RFC 7807.
- [x] **Logging:** log tạo content + save version (id, user, tenant) — không log toàn bộ nội dung.
- [x] **Secrets:** không thêm secret mới.

## Test (e2e-editor.mjs)
create→draft+slug · duplicate slug→409 · saveVersion→201 · block xấu→422 · listVersions≥1 · getContent có current_version · patch slug→200 · patch trùng slug seed→409 · cross-tenant get→404 · tạo content trên site tenant khác→404.
