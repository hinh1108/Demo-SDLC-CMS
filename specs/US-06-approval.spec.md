# Feature Spec — Workflow duyệt nội dung (US-05 + US-06)

> feature-forge · v1.0 · 2026-07-20 · Epic 2 · Must · Effort M
> Trace: US-05, US-06 · UC-02 · BR-03/04/05 · API `/contents/{id}/submission`, `/approvals`, `/contents/{id}/approvals`

## 1. Overview & user value
Biên tập viên gửi nội dung đi duyệt; trưởng phòng (manager) duyệt hoặc trả lại kèm ghi chú, có **bản ghi truy vết**. Thay quy trình duyệt rời rạc qua chat/email (pain P8) bằng luồng trong hệ thống. Đây là đáy cảm xúc as-is → điểm khác biệt lớn.

## 2. Functional Requirements (EARS)
- **FR-1** When biên tập viên gửi bản nháp đi duyệt, the system shall chuyển trạng thái nội dung sang `review` và thông báo mọi approver được cấu hình của site (BR-03).
- **FR-2** Where site chưa cấu hình approver, the system shall chặn gửi duyệt và trả lỗi hướng dẫn admin thiết lập (BR-04).
- **FR-3** When một approver phê duyệt nội dung ở trạng thái `review`, the system shall chuyển sang `approved` và ghi một bản `approval` (approver, thời điểm, result=approved).
- **FR-4** When một approver từ chối kèm ghi chú, the system shall chuyển nội dung về `draft`, ghi bản `approval` (result=rejected, note) và thông báo biên tập viên.
- **FR-5** Where người dùng không có vai trò `manager`/`admin`, the system shall từ chối hành động duyệt (403).
- **FR-6** Where nội dung không ở trạng thái `review`, the system shall từ chối quyết định duyệt (409 conflict trạng thái).
- **FR-7** The system shall trả **hàng chờ duyệt** (`GET /approvals?status=pending`) chỉ gồm nội dung `review` thuộc tenant người gọi.

## 3. Non-functional
- Cô lập tenant qua RLS (approval, content đều có `tenant_id`).
- Thao tác duyệt phản hồi < 2s p95; tối ưu mobile (persona Hải duyệt trên điện thoại) — action ≤ 2 chạm.
- Thông báo: in-app + email (SRS §3.2).

## 4. Acceptance Criteria (Given/When/Then)
- **AC-1 (submit):** Given nội dung `draft` và site có approver, When biên tập viên gửi duyệt, Then trạng thái = `review` và approver nhận thông báo.
- **AC-2 (no approver):** Given site chưa có approver, When gửi duyệt, Then trả `409 approver-not-configured`, trạng thái giữ `draft`.
- **AC-3 (approve):** Given nội dung `review`, When manager phê duyệt, Then trạng thái = `approved`, tồn tại 1 bản ghi approval (approver+timestamp).
- **AC-4 (reject):** Given nội dung `review`, When manager từ chối kèm ghi chú, Then trạng thái = `draft`, biên tập viên nhận phản hồi, ghi chú lưu kèm.
- **AC-5 (RBAC):** Given user vai trò `editor`, When gọi duyệt, Then trả `403 forbidden`.
- **AC-6 (isolation):** Given manager tenant B, When mở `/approvals`, Then không thấy nội dung tenant A.
- **AC-7 (wrong state):** Given nội dung `published`, When gọi duyệt, Then trả `409` (không ở review).

## 5. Error handling
| Tình huống | HTTP | type (RFC 7807) |
|---|---|---|
| Chưa cấu hình approver | 409 | approver-not-configured |
| Không đủ quyền duyệt | 403 | forbidden |
| Nội dung không ở `review` | 409 | invalid-state |
| Từ chối thiếu ghi chú (nếu bắt buộc) | 422 | validation-error |
| Không tìm thấy content | 404 | not-found |

## 6. Implementation TODO
**[Backend]**
- [ ] `POST /v1/contents/:id/submission` — kiểm approver tồn tại (BR-04) → set `review` → enqueue notify.
- [ ] `GET /v1/approvals?status=pending` — RLS + filter status=review.
- [ ] `POST /v1/contents/:id/approvals` — **RBAC guard** (manager/admin) → transaction: kiểm state=review → ghi `approval` → set approved/draft.
- [ ] Notify service (in-app + email) — abstraction.
- [ ] Guard theo vai trò (mở rộng JwtGuard → RolesGuard đọc `role` từ JWT).
**[Frontend]**
- [ ] Màn hàng chờ duyệt (mobile) theo mockup `05-mockup-approval-mobile-v1.html`: list → detail → approve/reject.
- [ ] Action bar sticky, nút ≥44px; optimistic update + rollback khi lỗi.
**[Security]**
- [ ] RBAC enforced **server-side** (không tin client).
- [ ] Bản ghi approval bất biến (append-only), truy vết.
- [ ] Kiểm state transition hợp lệ (chống bỏ qua duyệt → publish, BR-05 ở US-14).
**[Test]**
- [ ] e2e: submit→review, no-approver→409, approve→approved+record, reject→draft, editor→403, cross-tenant→0.
