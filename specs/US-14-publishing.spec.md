# Feature Spec — Xuất bản 1-chạm + tên miền (US-14)

> feature-forge · v1.0 · 2026-07-20 · Epic 4 · Must · Effort L
> Trace: US-14 · UC-03 · BR-05/06 · API `/contents/{id}/publication`

## 1. Overview & user value
Đưa nội dung **đã duyệt** ra công khai bằng một thao tác, đạt SEO/tốc độ tốt (Lighthouse ≥ 90). Loại bỏ phụ thuộc dev khi phát hành (pain P1). Render SSR/static + đẩy CDN (ADR-004).

## 2. Functional Requirements (EARS)
- **FR-1** When người dùng xuất bản nội dung ở trạng thái `approved`, the system shall render trang (SSR/static), đẩy CDN, áp thẻ SEO, cập nhật sitemap, đặt trạng thái `published`.
- **FR-2** Where nội dung **không** ở trạng thái `approved`, the system shall từ chối xuất bản (BR-05).
- **FR-3** Where tên miền chưa sẵn sàng DNS/SSL, the system shall xuất bản tạm trên **subdomain** và cảnh báo (BR-06).
- **FR-4** When người dùng gỡ xuất bản, the system shall đưa nội dung về `draft` và loại khỏi sitemap.
- **FR-5** The system shall đảm bảo trang xuất bản đạt **Lighthouse Performance ≥ 90 mobile** (MT-04).
- **FR-6** When publish là tác vụ nặng, the system shall xử lý bất đồng bộ (queue) và trả `202` nếu chưa hoàn tất.

## 3. Non-functional
- Idempotent (header `Idempotency-Key`) — publish lặp không nhân bản.
- Invalidation CDN sau render; custom domain qua ACME/managed cert.
- Cô lập tenant; chỉ nội dung tenant mình.

## 4. Acceptance Criteria
- **AC-1:** Given nội dung `approved` và domain hợp lệ, When xuất bản, Then trang online (SSR/static + CDN), sitemap cập nhật, trạng thái `published`, trả `public_url`.
- **AC-2:** Given nội dung `draft`/`review`, When xuất bản, Then trả `409 not-approved`.
- **AC-3:** Given domain chưa trỏ DNS/SSL, When xuất bản, Then dùng subdomain tạm và cảnh báo (`used_temp_subdomain=true`).
- **AC-4:** Given đã publish, When gỡ xuất bản, Then về `draft` và mất khỏi sitemap.
- **AC-5:** Given trang publish, When đo Lighthouse mobile, Then Performance ≥ 90.

## 5. Error handling
| Tình huống | HTTP | type |
|---|---|---|
| Chưa duyệt | 409 | not-approved |
| Domain chưa sẵn sàng | 202 | (không lỗi — subdomain tạm) |
| Lịch quá khứ (US-15) | 422 | validation-error |
| Render lỗi | 500 | internal-error (job retry) |

## 6. Implementation TODO
**[Backend]**
- [ ] `POST /v1/contents/:id/publication` — kiểm state=approved (BR-05) → enqueue PublishJob → 200/202.
- [ ] Publish worker (BullMQ): render → push CDN/storage → invalidate → update sitemap+status.
- [ ] `DELETE /v1/contents/:id/publication` (gỡ xuất bản).
- [ ] Domain readiness check + subdomain fallback (BR-06); ACME cert automation.
- [ ] Sitemap generator per site.
**[Frontend]**
- [ ] Nút "Xuất bản" + trạng thái tiến trình; hiển thị `public_url`; cảnh báo subdomain tạm.
**[Security]**
- [ ] Chỉ nội dung tenant mình + trạng thái approved mới publish; idempotency.
- [ ] Render output sanitize (XSS) từ block JSON.
**[Test]**
- [ ] e2e: approved→published+url, not-approved→409, no-domain→temp subdomain, unpublish→draft.
- [ ] Lighthouse CI trên trang mẫu ≥ 90.
