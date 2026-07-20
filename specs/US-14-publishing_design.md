# Implementation Design + Security Checkpoint — US-14 Publishing (slice #4)

> fullstack-guardian · 2026-07-20 · Bổ sung triển khai cho `US-14-publishing.spec.md`.
> Slice này = state machine xuất bản + domain logic + sitemap. **Render SSR/static + đẩy CDN là external (ADR-004)** → biểu diễn bằng bước stub (log; production là job gọi renderer).

## Endpoints
| Method | Path | Mô tả |
|---|---|---|
| POST | `/v1/contents/:id/publication` | Xuất bản ngay (200) / lên lịch (202). **RBAC: admin, editor** |
| DELETE | `/v1/contents/:id/publication` | Gỡ xuất bản → draft (204). RBAC như trên |
| GET | `/v1/sites/:siteId/sitemap` | Danh sách URL đã xuất bản (tenant-scoped) |

## State machine (đã có từ slice trước)
`draft → review → approved → published` · `published → draft` (unpublish) · `approved → scheduled` (lên lịch).

## Security Checkpoint
- [x] **AuthN:** JwtGuard.
- [x] **AuthZ (RBAC):** chỉ `admin`/`editor` publish/unpublish (RolesGuard). `contributor` không publish (SRS matrix); `manager` chỉ duyệt → cũng không publish ở slice này. Enforce **server-side**, trước khi chạm state.
- [x] **BR-05 (cốt lõi):** chỉ nội dung `approved` (hoặc đã `published` — idempotent) mới publish được → nếu không: `409 not-approved`. Chống bỏ qua duyệt.
- [x] **BR-06:** domain chưa `active` → dùng subdomain tạm, `used_temp_subdomain=true`.
- [x] **Validation:** `scheduled_at` ISO-8601; **không ở quá khứ** → 422.
- [x] **SQL injection:** parameterized.
- [x] **Output/XSS:** public_url dựng từ slug đã validate (allow-list ký tự); render HTML (ngoài slice) phải encode.
- [x] **Isolation:** RLS mọi query; cross-tenant → 404.
- [x] **Idempotency:** chấp nhận header `Idempotency-Key`; publish lại nội dung đã published → giữ published (không nhân bản).
- [x] **Logging:** log publish/unpublish (content, user, tenant, url) — bước render/CDN log rõ.
- [x] **Error handling:** 409 not-approved · 422 lịch quá khứ · 403 RBAC · 404 · RFC 7807.

## Data (migration 0003)
`content` + `published_version_id`, `published_at`, `public_url`. Lên lịch dùng `publish_job` (đã có).

## Test (e2e-publishing.mjs)
create→save→submit→approve (dựng nội dung approved) · editor publish→200+public_url+status=published · publish lại→idempotent · publish draft→409 not-approved · **contributor publish→403** · **manager publish→403** · unpublish→204→draft · schedule tương lai→202 scheduled+job · schedule quá khứ→422 · sitemap chứa published, không chứa unpublished · cross-tenant publish→404.
