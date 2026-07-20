# Physical Data Model — VietCMS (PostgreSQL, multi-tenant)

> Phase 3b · v1.0 · 2026-07-20 · Chuyển ERD logic (SRS/modeling) thành schema vật lý Postgres với **RLS multi-tenant**, **JSONB** cho block content, và index.
> Xem: [Overview](01-architecture-overview-v1.md) · [ADR-002 (RLS)](02-adr-log-v1.md#adr-002) · [ADR-003 (Postgres)](02-adr-log-v1.md#adr-003) · [ADR-005 (block model)](02-adr-log-v1.md#adr-005).

---

## 1. Nguyên tắc
- **Mọi bảng nghiệp vụ có `tenant_id`** (trừ bảng toàn cục như `plan`). Cô lập bằng **Row-Level Security**.
- Khoá chính **UUID** (`gen_random_uuid()`) — tránh lộ thứ tự/đếm giữa tenant.
- Timestamps `created_at`/`updated_at` (UTC) mọi bảng; hiển thị theo giờ VN ở tầng app.
- Nội dung block lưu **JSONB** trong `content_version` (append-only cho versioning — BR-01).
- Enum bằng `CREATE TYPE` để ràng buộc trạng thái.

## 2. Enums
```sql
CREATE TYPE content_status AS ENUM ('draft','review','approved','scheduled','published','archived');
CREATE TYPE approval_result AS ENUM ('approved','rejected');
CREATE TYPE domain_status  AS ENUM ('pending','active','failed');
CREATE TYPE sub_status     AS ENUM ('active','past_due','canceled','free');
CREATE TYPE invoice_status AS ENUM ('paid','pending','failed','refunded');
CREATE TYPE job_status     AS ENUM ('queued','running','done','failed');
CREATE TYPE user_status    AS ENUM ('pending','active','disabled');
```

## 3. Core: Tenancy, Users, RBAC
```sql
CREATE TABLE tenant (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  status      text NOT NULL DEFAULT 'active',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE role (            -- toàn cục; permissions dạng JSON
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,   -- Admin | Manager | Editor | Contributor
  permissions jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE app_user (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  email       citext NOT NULL,
  role_id     uuid NOT NULL REFERENCES role(id),
  status      user_status NOT NULL DEFAULT 'pending',   -- BR-08
  password_hash text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)                              -- email duy nhất trong tenant
);
```

## 4. Sites, Content, Versioning, Approval
```sql
CREATE TABLE site (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  name        text NOT NULL,
  template_id uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- PAGE và POST gộp thành 'content' với 'kind' để tái dùng versioning/approval/SEO
CREATE TABLE content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id     uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('page','post')),
  title       text NOT NULL,
  slug        text NOT NULL,
  status      content_status NOT NULL DEFAULT 'draft',
  current_version_id uuid,
  scheduled_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, slug)                                 -- BR-02: slug duy nhất trong site
);

CREATE TABLE content_version (                            -- BR-01: append-only mỗi save
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id  uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  blocks      jsonb NOT NULL,                             -- block model (ADR-005)
  author_id   uuid NOT NULL REFERENCES app_user(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE approval (                                   -- UC-02, BR-03/04/05
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  version_id  uuid NOT NULL REFERENCES content_version(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES app_user(id),
  result      approval_result NOT NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE seo_meta (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id  uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  title       text, description text, keywords text,
  schema_json jsonb,
  score       int
);

CREATE TABLE category (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  name text NOT NULL
);
CREATE TABLE content_category (
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  category_id uuid REFERENCES category(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);
```

## 5. Media, Domain, Forms/Leads, Publish, Analytics
```sql
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  url text NOT NULL, format text, size_bytes bigint,       -- tự WebP + CDN
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE domain (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE, status domain_status NOT NULL DEFAULT 'pending'  -- BR-06 DNS/SSL
);

CREATE TABLE form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  fields jsonb NOT NULL
);
CREATE TABLE lead (                                        -- PII → ND 13/2023
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  form_id uuid NOT NULL REFERENCES form(id) ON DELETE CASCADE,
  data jsonb NOT NULL, consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE publish_job (                                 -- UC-03, lên lịch
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  run_at timestamptz NOT NULL, status job_status NOT NULL DEFAULT 'queued',
  CHECK (run_at >= created_at)                             -- không lịch quá khứ
) ;  -- (thêm created_at ở bản đầy đủ)

CREATE TABLE analytics_event (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  site_id uuid NOT NULL,
  type text NOT NULL, props jsonb, occurred_at timestamptz NOT NULL DEFAULT now()
);  -- cân nhắc partition theo thời gian khi lớn
```

## 6. Billing & AI usage
```sql
CREATE TABLE plan (                                        -- toàn cục, giá VND
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, price_vnd bigint NOT NULL, period text NOT NULL,
  limits jsonb NOT NULL                                    -- {sites, seats, ai_quota,...} (BR-09/10)
);
CREATE TABLE subscription (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plan(id),
  status sub_status NOT NULL DEFAULT 'free',
  renews_at timestamptz
);
CREATE TABLE invoice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES subscription(id),
  amount_vnd bigint NOT NULL, status invoice_status NOT NULL DEFAULT 'pending',
  gateway text, gateway_ref text,                          -- VNPay/MoMo/ZaloPay + idempotency
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ai_usage (                                    -- BR-07 quota metering
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id uuid REFERENCES app_user(id),
  feature text NOT NULL,                                   -- content | seo | image
  tokens int, cost_vnd bigint, occurred_at timestamptz NOT NULL DEFAULT now()
);
```

## 7. Row-Level Security (cô lập tenant — ADR-002)
```sql
-- Bật RLS + policy cho MỖI bảng có tenant_id (ví dụ 'content'):
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON content
  USING (tenant_id = current_setting('app.current_tenant')::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);
-- App set biến session mỗi request:  SET app.current_tenant = '<tenant-uuid>';
-- Lặp lại cho: app_user, site, content_version, approval, seo_meta, category,
-- media, domain, form, lead, publish_job, analytics_event, subscription, invoice, ai_usage.
```
> **Defense-in-depth:** RLS là tầng cuối; API guard + query scope là tầng trước. **Bắt buộc test**: user tenant A không đọc/ghi được dữ liệu tenant B.

## 8. Index đề xuất (theo truy vấn thực tế)
```sql
CREATE INDEX ix_content_tenant_site_status ON content (tenant_id, site_id, status);
CREATE INDEX ix_content_site_slug          ON content (site_id, slug);
CREATE INDEX ix_version_content_created    ON content_version (content_id, created_at DESC);
CREATE INDEX ix_approval_version           ON approval (version_id);
CREATE INDEX ix_user_tenant                ON app_user (tenant_id);
CREATE INDEX ix_publishjob_status_runat    ON publish_job (status, run_at);
CREATE INDEX ix_analytics_tenant_site_time ON analytics_event (tenant_id, site_id, occurred_at);
CREATE INDEX ix_ai_usage_tenant_time       ON ai_usage (tenant_id, occurred_at);
-- Full-text tìm nội dung theo tiêu đề (SRS §III.3):
CREATE INDEX ix_content_title_fts ON content USING gin (to_tsvector('simple', title));
-- JSONB block truy vấn (nếu cần): GIN trên content_version.blocks.
```

## 9. Ánh xạ Business Rules → cơ chế
| BR | Cơ chế |
|---|---|
| BR-01 versioning mỗi save | `content_version` append-only |
| BR-02 slug duy nhất/site | `UNIQUE (site_id, slug)` |
| BR-03/04 duyệt | app logic + `approval`; chặn submit nếu không có approver |
| BR-05 chỉ Đã duyệt mới publish | check `status='approved'` trước publish_job |
| BR-06 domain chưa sẵn sàng | `domain.status` + fallback subdomain |
| BR-07 trừ hạn mức AI | ghi `ai_usage` chỉ khi thành công; lỗi → không ghi |
| BR-08 user chờ kích hoạt | `user_status='pending'` |
| BR-09/10 hạn mức gói | `plan.limits` (sites/seats/ai_quota) enforced ở app |
| BR-11 giá gia hạn không tăng | `subscription`/`invoice` giữ giá cam kết |
| BR-12 hạ Free sau N lần fail | dunning trên `invoice.status`/`subscription.status` |
| BR-13 captcha form | app-layer (không ở DB) |

## 10. Ghi chú migration & vận hành
- Dùng migration tool (Prisma Migrate / TypeORM / Knex) — **một schema, một migration** (lợi thế ADR-002).
- Backup: managed Postgres **PITR** + snapshot định kỳ (NFR sao lưu).
- `analytics_event` lớn → cân nhắc **partition theo tháng** + rollup bảng tổng hợp cho dashboard.
- Mã hoá at-rest (DB/storage) + TLS in-transit; nhật ký truy cập PII (ND 13/2023).

---

*Đây là bản phác thảo vật lý cho MVP — tinh chỉnh cùng `postgres-pro`/`database-optimizer` khi vào Implementation. Một số cột phụ (created_at đầy đủ, soft-delete, audit) bổ sung khi code.*
