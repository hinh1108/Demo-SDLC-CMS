# Feature Spec — Soạn thảo no-code (block editor + versioning) (US-01)

> feature-forge · v1.0 · 2026-07-20 · Epic 1 · Must · Effort L
> Trace: US-01 · UC-01 · BR-01/02 · API `/sites/{id}/contents`, `/contents/{id}`, `/contents/{id}/versions`

## 1. Overview & user value
Biên tập viên không-kỹ-thuật tự tạo & dàn trang bằng kéo-thả block, tự lưu an toàn có phiên bản, không cần dev. Đây là màn trung tâm gắn North-star. Nội dung lưu dạng **JSON block** (JSONB) — ADR-005, editor trên TipTap.

## 2. Functional Requirements (EARS)
- **FR-1** When người dùng tạo nội dung mới (trống hoặc từ template), the system shall mở trình soạn thảo kéo-thả và tạo bản nháp `draft`.
- **FR-2** When người dùng kéo/sửa/xoá block, the system shall cập nhật mô hình block và **tự lưu** một `content_version` mới (BR-01, append-only).
- **FR-3** When người dùng đặt slug đã tồn tại trong site, the system shall từ chối lưu và đề xuất slug thay thế (BR-02).
- **FR-4** Where mất kết nối khi đang soạn, the system shall giữ bản nháp cục bộ và đồng bộ khi có mạng, không mất dữ liệu.
- **FR-5** When người dùng mở lịch sử phiên bản, the system shall liệt kê version theo thời gian và cho khôi phục.
- **FR-6** The system shall phản hồi thao tác lưu **trong < 2 giây** (95% ở tải bình thường).

## 3. Non-functional
- Nội dung block validate theo schema (chống JSON rác/XSS khi render public).
- Cô lập tenant (RLS trên content/content_version).
- Editor tải nhanh; hỗ trợ dán từ Docs giữ định dạng cơ bản.

## 4. Acceptance Criteria
- **AC-1:** Given đã đăng nhập & chọn site, When tạo trang mới và kéo block, Then nội dung hiển thị đúng bố cục và tự lưu thành `draft` có version.
- **AC-2:** Given slug đã tồn tại, When lưu, Then trả `409 slug-conflict` + gợi ý slug.
- **AC-3:** Given mất mạng khi soạn, When mạng trở lại, Then bản nháp đồng bộ, không mất dữ liệu.
- **AC-4:** Given nhiều lần sửa, When mở lịch sử, Then thấy các version và khôi phục được.
- **AC-5 (isolation):** Given user tenant A, When mở content của tenant B (id), Then `404`/không truy cập.

## 5. Error handling
| Tình huống | HTTP | type |
|---|---|---|
| Slug trùng | 409 | slug-conflict |
| Block JSON không hợp lệ | 422 | validation-error |
| Không tìm thấy content/site | 404 | not-found |
| Lỗi lưu (server) | 500 | internal-error (toast + retry FE) |

## 6. Implementation TODO
**[Backend]**
- [ ] `POST /v1/sites/:siteId/contents` (tạo draft, auto-slug, BR-02 unique).
- [ ] `PATCH /v1/contents/:id` (title/slug/category — 409 slug).
- [ ] `POST /v1/contents/:id/versions` (autosave → append version, BR-01) — validate block schema.
- [ ] `GET /v1/contents/:id/versions`, `GET /v1/versions/:id` (lịch sử/khôi phục).
- [ ] Block schema (Zod/class-validator) — an toàn khi render.
**[Frontend]**
- [ ] Editor TipTap + block palette + canvas (theo mockup `05-mockup-editor-desktop-v1.html`).
- [ ] Autosave (debounce) + indicator "Đã lưu"; **offline queue** + sync khi online.
- [ ] Panel SEO/AI (US-09/US-10 sau).
**[Security]**
- [ ] Sanitize/escape khi render block ra HTML public (chống XSS).
- [ ] RLS + tenant từ JWT; parameterized queries.
**[Test]**
- [ ] e2e: create→draft+version, slug dup→409, autosave nhiều version, offline sync, cross-tenant.
