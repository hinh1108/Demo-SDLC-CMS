# Implementation Design + Security Checkpoint — Full Admin App (Next.js)

> fullstack-guardian · 2026-07-20 · ADR-009 (Next.js). Thay bản UI tĩnh (`web/public`) bằng app thật ở `apps/web/`.

## Kiến trúc — BFF (Backend-for-Frontend)
```
Browser ⇄ Next.js (apps/web, :3000)
             ├─ /api/login   → gọi API /auth/login, set httpOnly cookie 'vt' (JWT)
             ├─ /api/logout  → xoá cookie
             └─ /api/proxy/* → forward tới API, ĐÍNH Bearer từ cookie (server-side)
Next.js  ⇄ API (NestJS, :3001)  [server-to-server, không CORS]
```
**Vì sao BFF:** token JWT nằm trong **httpOnly cookie** → JavaScript trình duyệt **không đọc được** → chống đánh cắp token qua XSS (điểm yếu của bản tĩnh lưu token trong JS). Client chỉ gọi same-origin `/api/proxy/*`; token được đính ở tầng server.

## Security Checkpoint
- [x] **Token không lộ ra JS:** httpOnly + sameSite=lax cookie; chỉ server proxy đọc.
- [x] **AuthN/AuthZ:** middleware chặn route chưa đăng nhập (redirect /login). RBAC hiển thị theo `role` (cookie role không nhạy cảm), **nhưng quyền thật enforce ở API** (RolesGuard) — client chỉ ẩn/hiện nút.
- [x] **CSRF:** cookie sameSite=lax; mutations qua POST/PUT/DELETE cùng origin. (Nâng cấp: CSRF token nếu mở cross-site.)
- [x] **Output/XSS:** React tự escape; không dùng `dangerouslySetInnerHTML`.
- [x] **Validation:** client guard (email/tiêu đề) — **không phải hàng rào duy nhất** (API validate lại).
- [x] **Secrets:** `BACKEND_URL` từ env; không hardcode; không đưa secret ra client bundle.
- [x] **Error handling:** proxy truyền nguyên problem+json; UI hiện `detail` qua toast; không lộ stack.
- [x] **Không lộ dữ liệu nhạy cảm:** proxy chỉ forward; API đã scope field.

## Màn (FE-00…FE-05)
login · content (list+create) · content/[id] (SEO + save version + submit/publish/unpublish + approve/reject) · approvals.

## Deploy
`output: standalone` → Docker multi-stage → thay service `web` (nginx) trong compose bằng Next.js. `BACKEND_URL=http://api:3001/v1` (nội bộ compose).

## Test
Build image OK · trang phục vụ (login) · flow login (set cookie) → proxy list → thao tác. Verify qua container.
