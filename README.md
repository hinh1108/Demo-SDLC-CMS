# VietCMS — Implementation

No-code Marketing CMS SaaS multi-tenant. Phase 4 (Implementation) — **vertical slice #1: Auth + Content list**, đã chạy & verify.

> Thiết kế đầy đủ (BA, UI/UX, kiến trúc, API, DB) ở `docs/` và `output/vietcms/`. Xem `output/vietcms/00-sdlc-process-guideline.md`.

## Cấu trúc
```
apps/api/          # Backend NestJS (TypeScript) — ADR-009
  src/auth/        # login (JWT), guard, throttle
  src/content/     # GET /sites/:id/contents (tenant-scoped)
  src/db/          # pg Pool + withTenant() (RLS SET LOCAL)
  src/common/      # RFC 7807 problem filter
  scripts/seed.mjs # seed 2 tenant + users (bcrypt) + content
web/src/           # FE: typed api-client, useContents hook, LoginForm
db/                # 0001_init.sql (schema+RLS) · 0002_auth.sql (auth_lookup + app_login)
specs/             # technical design (3 góc nhìn + security checklist)
scripts/e2e-verify.mjs   # kiểm thử bảo mật end-to-end
docker-compose.yml # Postgres 16 + Redis
```

## Chạy

### A. Deploy cả stack bằng Docker Compose (khuyến nghị) — xem [DEPLOY.md](DEPLOY.md)
```bash
cp .env.example .env            # đặt JWT_SECRET
docker compose up -d --build    # web + api + postgres (auto-migrate) + redis
docker compose exec -T api node scripts/seed.mjs   # dữ liệu demo
```
- **🖥️ Giao diện admin (Next.js): http://localhost:3000** — đăng nhập `ngoc@a.vn` / `Password123!` (BFF: JWT trong httpOnly cookie, code ở `apps/web/`)
- API: http://localhost:3001/v1 · health `/v1/health` · readiness `/v1/health/ready`
- Verify: `node scripts/e2e-verify.mjs` (và workflow/editor/publishing/seo)

### B. Chạy API từ source (dev)
```bash
docker compose up -d postgres redis   # chỉ DB
cd apps/api && npm install && cp .env.example .env
npm run seed && npm run build && npm start
node ../../scripts/e2e-verify.mjs
```
Tài khoản demo (mật khẩu `Password123!`): `ngoc@a.vn` (editor, tenant A), `hai@a.vn` (manager, A), `ed@b.vn` (editor, tenant B).

## Đã implement
**Slice #1 — Auth + Content list**
| Endpoint | Mô tả |
|---|---|
| `POST /v1/auth/login` | Xác thực → JWT (`sub`, `tenant_id`, `role`) · 200 |
| `GET /v1/sites/:siteId/contents` | List content theo tenant (RLS), lọc `status`, cursor pagination |
| `GET /v1/health` · `/health/ready` | Liveness · readiness (ping DB) |

**Slice #2 — Workflow duyệt (US-05/06)** · RBAC + state machine
| Endpoint | Mô tả |
|---|---|
| `POST /v1/contents/:id/submission` | Gửi duyệt → `review` (BR-04: chặn nếu chưa có approver) |
| `GET /v1/approvals` | Hàng chờ duyệt của tenant |
| `POST /v1/contents/:id/approvals` | Duyệt/từ chối (**RBAC: manager/admin**) → approved/draft + bản ghi |
| `GET /v1/contents/:id/approvals` | Lịch sử duyệt |

**Slice #3 — Editor + versioning (US-01)** · block validation + slug + versioning
| Endpoint | Mô tả |
|---|---|
| `POST /v1/sites/:siteId/contents` | Tạo content `draft` (slugify VN, BR-02 unique + gợi ý) |
| `GET /v1/contents/:id` | Chi tiết + current version (không leak tenant/site id) |
| `PATCH /v1/contents/:id` | Sửa title/slug (409 slug-conflict) |
| `POST /v1/contents/:id/versions` | Lưu (autosave) → version mới (BR-01) + **validate block JSON** |
| `GET /v1/contents/:id/versions` · `GET /v1/versions/:id` | Lịch sử / xem phiên bản |

**Slice #4 — Publishing (US-14)** · state machine + BR-05/06 + RBAC
| Endpoint | Mô tả |
|---|---|
| `POST /v1/contents/:id/publication` | Xuất bản (200) / lên lịch (202). **BR-05** chỉ approved; **RBAC admin/editor** |
| `DELETE /v1/contents/:id/publication` | Gỡ xuất bản → draft (204) |
| `GET /v1/sites/:siteId/sitemap` | URL đã xuất bản (BR-06: subdomain tạm khi chưa có domain) |

**Slice #5 — SEO meta + sitemap.xml (US-09)**
| Endpoint | Mô tả |
|---|---|
| `GET/PUT /v1/contents/:id/seo` | Metadata SEO + **điểm SEO** tự tính (0–100) |
| `GET /v1/sites/:siteId/sitemap.xml` | **Public** sitemap XML (SECURITY DEFINER, chỉ published, XML-escape) |

## Kết quả verify (59/59 pass)
- `scripts/e2e-verify.mjs` (10): login, RLS cô lập, không leak field, 401, validation.
- `scripts/e2e-workflow.mjs` (12): submit→review, BR-04 no-approver→409, queue, **RBAC editor→403**, approve→approved+record, reject cần ghi chú (422), state machine invalid→409.
- `scripts/e2e-editor.mjs` (13): create+slugify VN, slug trùng→409, save version (BR-01), **block JSON lạ→422**, versions, cross-tenant→404, tạo trên site tenant khác→404, slug sai format→400.
- `scripts/e2e-publishing.mjs` (12): **BR-05 draft→409 not-approved**, RBAC contributor/manager→403, editor publish→200+url, BR-06 subdomain tạm, idempotent, sitemap, unpublish→204, lên lịch→202, lịch quá khứ→422, cross-tenant→404.
- `scripts/e2e-seo.mjs` (12): GET/PUT seo + điểm SEO 100, content.seo_score, validation (title>200→400, schema_json→400), cross-tenant→404, **sitemap.xml public + Content-Type xml + well-formed + chỉ published (không lộ nháp)**.

## Bảo mật (3 góc nhìn — xem specs/auth-content-list_design.md)
- **Tenant isolation:** JWT mang `tenant_id` → `SET LOCAL app.current_tenant` → **PostgreSQL RLS**. API kết nối bằng role `app_login` (non-superuser → RLS thực thi). Defense-in-depth.
- **SQL injection:** parameterized queries ($1..$n) + `set_config(...,true)` tham số hoá.
- **Output:** response schema tường minh — không trả `password_hash`/`tenant_id`.
- **Auth:** bcrypt; JWT verify server-side; lỗi auth thông báo chung; security logging (không log mật khẩu); throttle login theo IP; secrets từ env; CORS.
- **Errors:** RFC 7807 `application/problem+json`, không lộ stack.

## Handoff (bước sau)
- **Test Master:** mở rộng test (unit + e2e jest), test cách ly RLS ở CI.
- **DevOps:** compose sẵn; thêm CI/CD, secrets management, migration runner.
- **security-reviewer:** rà soát trước merge.
- **Mở rộng:** refresh token rotation, RBAC guard theo action (duyệt/xuất bản), throttle bằng Redis, generate types từ `openapi-v1.yaml`.
