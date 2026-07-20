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
docker compose up -d --build    # api + postgres (auto-migrate) + redis
docker compose exec -T api node scripts/seed.mjs   # dữ liệu demo
node scripts/e2e-verify.mjs     # verify: 10 passed
```
API: http://localhost:3001/v1 · health `/v1/health` · readiness `/v1/health/ready`

### B. Chạy API từ source (dev)
```bash
docker compose up -d postgres redis   # chỉ DB
cd apps/api && npm install && cp .env.example .env
npm run seed && npm run build && npm start
node ../../scripts/e2e-verify.mjs
```
Tài khoản demo (mật khẩu `Password123!`): `ngoc@a.vn` (editor, tenant A), `hai@a.vn` (manager, A), `ed@b.vn` (editor, tenant B).

## Đã implement (slice #1)
| Endpoint | Mô tả |
|---|---|
| `POST /v1/auth/login` | Xác thực → JWT (`sub`, `tenant_id`, `role`) · 200 |
| `GET /v1/sites/:siteId/contents` | List content theo tenant (RLS), lọc `status`, cursor pagination |

## Kết quả verify (10/10 pass)
AC1 login 200+token · AC2 sai pass → 401 chung (chống enumeration) · AC3 list scoped + không leak field · filter status · AC4 no-token → 401 · **AC5 JWT tenant B xem site A → 0 rows (RLS cô lập)** · validation UUID → 400.

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
