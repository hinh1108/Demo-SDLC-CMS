# API Design — VietCMS REST API v1

> Phase 3b · Technical Design · v1.0 · 2026-07-20
> Hợp đồng API cho VietCMS. Spec đầy đủ: [`openapi-v1.yaml`](openapi-v1.yaml) (OpenAPI 3.1).
> Bám: [Architecture overview](01-architecture-overview-v1.md) · [ADR-009 REST/NestJS](02-adr-log-v1.md#adr-009) · [Data model](03-data-model-v1.md).

---

## 1. Nguyên tắc & Conventions

| Hạng mục | Quyết định |
|---|---|
| Style | REST, resource-oriented, JSON |
| Base URL | `https://api.vietcms.vn/v1` |
| **Versioning** | URI-based (`/v1`); breaking change → `/v2`; deprecate qua header `Sunset` + `Deprecation` |
| **Naming** | Field JSON **snake_case** (khớp data model); path resource danh từ số nhiều, lowercase |
| **Auth** | JWT Bearer (access + refresh). **Tenant lấy từ claim `tenant_id`** — không đặt trong URL |
| **Pagination** | **Cursor-based**: `?cursor=&limit=` (max 100); response `{ data, pagination:{ next_cursor, has_more } }` |
| **Filtering** | Query param: `status`, `kind`, `q`, `from`, `to` |
| **Errors** | **RFC 7807** `application/problem+json`, `type` là URI ổn định |
| **Idempotency** | Header `Idempotency-Key` cho POST không idempotent (publish, thanh toán) |
| **Rate limit** | 429 + `Retry-After`; AI có quota riêng (402/429) |
| **Timezone/tiền** | ISO-8601 UTC; tiền VND (integer đồng) |

> Multi-tenancy: mọi endpoint (trừ `public/*`, `auth/*`, `plans`) yêu cầu JWT; tenant suy ra từ token → khớp RLS (`app.current_tenant`) ở DB. Cách ly chéo tenant test bắt buộc.

---

## 2. Resource Model (từ data model)

```
Tenant ─┬─ User ── Role
        ├─ Site ─┬─ Content (page|post) ─┬─ ContentVersion ── Approval
        │        │                        └─ SeoMeta
        │        ├─ Media
        │        ├─ Form ── Lead
        │        ├─ Domain
        │        └─ AnalyticsEvent
        └─ Subscription ── Plan / Invoice        AiUsage (quota)
```

| Resource | Collection URI | Ghi chú |
|---|---|---|
| Auth | `/auth/*` | login, refresh, accept-invite |
| Me | `/me` | hồ sơ + quyền người đăng nhập |
| Users | `/users` | admin: mời/gán vai trò (US-07) |
| Sites | `/sites` | đa site (US-08) |
| Contents | `/sites/{site_id}/contents`, `/contents/{id}` | gộp page/post (US-01) |
| Versions | `/contents/{id}/versions` | autosave = tạo version (BR-01) |
| Submission | `/contents/{id}/submission` | gửi duyệt (US-05) |
| Approvals | `/contents/{id}/approvals`, `/approvals` | duyệt + hàng chờ (US-06) |
| Publications | `/contents/{id}/publication(s)` | xuất bản/lịch/gỡ (US-14/15) |
| SEO | `/contents/{id}/seo` | metadata (US-09) |
| Media | `/sites/{site_id}/media` | upload, WebP (US-02) |
| Forms/Leads | `/sites/{site_id}/forms`, `/leads` | + public submit (US-16) |
| AI | `/ai/*` | sinh nội dung/SEO + quota (US-10/11) |
| Billing | `/plans`, `/subscription`, `/invoices` | thanh toán VN (US-19) |
| Analytics | `/sites/{site_id}/analytics` | dashboard (US-18) |
| Domains | `/sites/{site_id}/domains` | custom domain (US-14) |
| Webhooks | `/webhooks/payments/{gateway}` | callback cổng thanh toán |

---

## 3. Endpoint catalog (v1)

### Auth & Me
| Method | Path | Mô tả |
|---|---|---|
| POST | `/auth/login` | Đăng nhập → access + refresh token |
| POST | `/auth/refresh` | Làm mới access token |
| POST | `/auth/invitations/accept` | Đặt mật khẩu, kích hoạt (BR-08) |
| GET | `/me` | Hồ sơ + vai trò + tenant |

### Users (Admin)
`GET /users` · `POST /users` (mời) · `GET /users/{id}` · `PATCH /users/{id}` (vai trò/trạng thái) · `DELETE /users/{id}`

### Sites
`GET /sites` · `POST /sites` (từ template hoặc AI — US-05) · `GET /sites/{id}` · `PATCH /sites/{id}`

### Content (US-01)
| Method | Path | Mô tả |
|---|---|---|
| GET | `/sites/{site_id}/contents` | List, lọc `kind,status,q`, cursor |
| POST | `/sites/{site_id}/contents` | Tạo (trống/từ template) |
| GET | `/contents/{id}` | Chi tiết + current version |
| PATCH | `/contents/{id}` | Sửa title/slug… (409 nếu slug trùng — BR-02) |
| DELETE | `/contents/{id}` | Xoá |
| GET | `/contents/{id}/versions` | Lịch sử phiên bản |
| POST | `/contents/{id}/versions` | **Lưu (autosave)** → tạo version (BR-01) |
| GET | `/versions/{version_id}` | Xem 1 phiên bản |

### Workflow (US-05/06)
| Method | Path | Mô tả |
|---|---|---|
| POST | `/contents/{id}/submission` | Gửi duyệt (409 `approver-not-configured` nếu chưa có approver — BR-04) |
| GET | `/approvals?status=pending` | **Hàng chờ duyệt của tôi** |
| POST | `/contents/{id}/approvals` | Duyệt/từ chối kèm ghi chú → lưu bản ghi |
| GET | `/contents/{id}/approvals` | Lịch sử duyệt |

### Publishing (US-14/15)
| Method | Path | Mô tả |
|---|---|---|
| POST | `/contents/{id}/publication` | Xuất bản ngay/lịch (`scheduled_at`). 409 `not-approved` nếu chưa duyệt (BR-05); 202 nếu domain chưa sẵn sàng → subdomain tạm (BR-06) |
| DELETE | `/contents/{id}/publication` | Gỡ xuất bản |

### SEO (US-09) · Media (US-02)
`GET /contents/{id}/seo` · `PUT /contents/{id}/seo` · `GET /sites/{site_id}/media` · `POST /sites/{site_id}/media` (presigned/multipart)

### AI (US-10/11, BR-07)
| Method | Path | Mô tả |
|---|---|---|
| POST | `/ai/content-generations` | Sinh nội dung VN. 402 `quota-exceeded` nếu hết hạn mức; lỗi AI → không trừ |
| POST | `/ai/seo-suggestions` | Gợi ý tiêu đề/meta/từ khoá/schema |
| GET | `/ai/usage` | Hạn mức còn lại |

### Billing (US-19)
`GET /plans` (public) · `GET /subscription` · `POST /subscription` (chọn/đổi gói → payment intent) · `GET /invoices` · `POST /webhooks/payments/{gateway}` (idempotent)

### Analytics (US-18) · Forms/Leads (US-16)
`GET /sites/{site_id}/analytics?from=&to=&metric=` · `GET /sites/{site_id}/forms` · `POST /sites/{site_id}/forms` · `GET /sites/{site_id}/leads` · `POST /public/sites/{site_id}/forms/{form_id}/submissions` (public, captcha — BR-13, ND 13/2023)

---

## 4. Authentication & Authorization

- **AuthN:** JWT Bearer. `POST /auth/login` → `{ access_token (15m), refresh_token (30d) }`. Refresh xoay vòng.
- **Claims:** `sub` (user_id), `tenant_id`, `role`, `exp`.
- **AuthZ:** RBAC 2 tầng — API guard theo `role` (Admin/Manager/Editor/Contributor) + RLS DB theo `tenant_id`. Xem [ma trận quyền](01-architecture-overview-v1.md#6-rbac-giải-open-q5).
- **Public endpoints (không JWT):** `/auth/*`, `GET /plans`, `POST /public/sites/{site_id}/forms/{form_id}/submissions`, `POST /webhooks/payments/{gateway}` (xác thực bằng chữ ký cổng).

---

## 5. Error Catalog (RFC 7807 — `type` URI ổn định)

| HTTP | `type` (base `https://api.vietcms.vn/errors/`) | Khi nào | Truy vết |
|---|---|---|---|
| 400 | `validation-error` | Sai/thiếu tham số | — |
| 401 | `unauthorized` | Thiếu/hết hạn token | — |
| 403 | `forbidden` | Không đủ quyền (RBAC) | RBAC |
| 404 | `not-found` | Không có resource | — |
| 409 | `slug-conflict` | Slug trùng trong site | BR-02 |
| 409 | `approver-not-configured` | Gửi duyệt khi chưa có approver | BR-04 |
| 409 | `not-approved` | Publish nội dung chưa duyệt | BR-05 |
| 402 | `quota-exceeded` | Hết hạn mức AI | BR-07 |
| 402 | `plan-limit-exceeded` | Vượt số site/seat của gói | BR-09 |
| 429 | `rate-limited` | Vượt rate limit (+ `Retry-After`) | — |
| 422 | `unprocessable` | Hợp lệ cú pháp nhưng vi phạm nghiệp vụ | — |
| 5xx | `internal-error` | Lỗi hệ thống | — |

Ví dụ field-level:
```json
{ "type":"https://api.vietcms.vn/errors/validation-error","title":"Validation Error",
  "status":422,"detail":"Đường dẫn (slug) không hợp lệ.","instance":"/contents/req-abc",
  "errors":[{"field":"slug","message":"Chỉ gồm chữ thường và dấu nối."}] }
```

---

## 6. Pagination, Filtering, Sorting
- **Cursor** cho mọi collection: `?cursor=<opaque>&limit=20` (max 100). Response `pagination.next_cursor` (null nếu hết) + `has_more`.
- **Filter** qua query param (không lồng phức tạp): `status`, `kind`, `q` (full-text tiêu đề), `from`/`to` (analytics).
- **Sort**: `?sort=-updated_at` (tiền tố `-` = giảm dần); mặc định `updated_at desc`.

---

## 7. Versioning & Deprecation
- **v1** hiện tại (`/v1`). Thêm field/endpoint = non-breaking (không tăng version).
- **Breaking change** → `/v2`; chạy song song tối thiểu 6 tháng.
- Endpoint sắp bỏ: trả header `Deprecation: true` + `Sunset: <date>` + link tài liệu.
- **Headless public API** (US-22, Won't-this-time) sẽ là bề mặt riêng (`/public-api/v1`) với API key theo scope — thiết kế sau.

---

## 8. Validation (skill workflow bước 4) — ✅ ĐÃ CHẠY
```bash
npx @redocly/cli lint openapi-v1.yaml
# → "Woohoo! Your API description is valid. 🎉"  (0 errors)
```
- **Kết quả:** spec **hợp lệ, 0 lỗi**. Còn 35 *warnings* thuộc rule khuyến nghị `operation-4xx-response` (một số operation chỉ khai 200/201) — không chặn, sẽ bổ sung 4xx chung (401/500) khi vào build hoặc tắt rule trong `redocly.yaml`.
- Bước tiếp (khi có repo): mock server để test contract:
```bash
npx @stoplight/prism-cli mock openapi-v1.yaml
npx openapi-typescript openapi-v1.yaml -o packages/shared/api-types.ts   # share type FE↔BE (ADR-009)
```

---

## 9. Phạm vi spec v1
`openapi-v1.yaml` bao phủ **các resource Must + Should cốt lõi**: auth/me, users, sites, contents, versions, workflow (submission/approvals + queue), publications, seo, media, ai, billing (plans/subscription/invoices), analytics, public form submission. Các phần Could/Future (headless API, white-label, đa ngôn ngữ) mở rộng theo cùng convention khi tới.

---

*Next: `npx @redocly/cli lint` khi có repo → generate SDK/types (openapi-typescript) chia sẻ FE↔BE (ADR-009). Hoặc sang Implementation.*
