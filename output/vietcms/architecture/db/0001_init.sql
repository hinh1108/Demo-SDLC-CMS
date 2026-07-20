-- ============================================================
-- VietCMS · Migration 0001 — Initial schema (PostgreSQL 16)
-- Multi-tenant (RLS) · versioning · JSONB block content · partitioned analytics
-- Refines 03-data-model-v1.md into production-ready DDL.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS citext;      -- email case-insensitive
-- gen_random_uuid() có sẵn trong core PG13+ (không cần pgcrypto)

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ---------- Enums ----------
CREATE TYPE content_status AS ENUM ('draft','review','approved','scheduled','published','archived');
CREATE TYPE approval_result AS ENUM ('approved','rejected');
CREATE TYPE domain_status  AS ENUM ('pending','active','failed');
CREATE TYPE sub_status     AS ENUM ('active','past_due','canceled','free');
CREATE TYPE invoice_status AS ENUM ('paid','pending','failed','refunded');
CREATE TYPE job_status     AS ENUM ('queued','running','done','failed');
CREATE TYPE user_status    AS ENUM ('pending','active','disabled');
CREATE TYPE content_kind   AS ENUM ('page','post');

-- ============================================================
-- Core: tenancy, RBAC, users
-- ============================================================
CREATE TABLE tenant (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  status     text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE role (                                   -- global (không tenant-scoped)
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,                   -- admin|manager|editor|contributor
  permissions jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE app_user (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  email         citext NOT NULL,
  name          text,
  role_id       uuid NOT NULL REFERENCES role(id),
  status        user_status NOT NULL DEFAULT 'pending',
  password_hash text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);
CREATE TRIGGER trg_user_updated BEFORE UPDATE ON app_user
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Sites & content
-- ============================================================
CREATE TABLE site (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  name        text NOT NULL,
  template_id uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_site_tenant ON site (tenant_id);

CREATE TABLE content (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id            uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  kind               content_kind NOT NULL,
  title              text NOT NULL,
  slug               text NOT NULL,
  status             content_status NOT NULL DEFAULT 'draft',
  current_version_id uuid,
  author_id          uuid REFERENCES app_user(id),
  seo_score          int,
  scheduled_at       timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, slug)                              -- BR-02
);
CREATE TRIGGER trg_content_updated BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Filter (tenant,site,status) + sort updated_at DESC  → covering index cho list/queue
CREATE INDEX ix_content_tenant_site_status_upd
  ON content (tenant_id, site_id, status, updated_at DESC);
-- Hàng chờ duyệt: partial index nhỏ, chỉ nội dung 'review'
CREATE INDEX ix_content_review_queue
  ON content (tenant_id, updated_at DESC) WHERE status = 'review';
-- Dashboard "nội dung gần đây" toàn tenant (mọi site), sort updated_at DESC
-- (đã verify: Seq Scan 21.5ms → Index Scan 0.06ms, xem 05-db-optimization)
CREATE INDEX ix_content_tenant_updated ON content (tenant_id, updated_at DESC);
-- Full-text tìm theo tiêu đề (SRS §III.3)
CREATE INDEX ix_content_title_fts
  ON content USING GIN (to_tsvector('simple', title));

CREATE TABLE content_version (                        -- BR-01: append-only mỗi save
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  blocks     jsonb NOT NULL,
  author_id  uuid NOT NULL REFERENCES app_user(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Lấy phiên bản mới nhất của 1 content nhanh
CREATE INDEX ix_version_content_created ON content_version (content_id, created_at DESC);
-- Truy vấn JSONB block (vd tìm content có block ảnh) — jsonb_path_ops nhỏ & nhanh cho @>
CREATE INDEX ix_version_blocks_gin ON content_version USING GIN (blocks jsonb_path_ops);

ALTER TABLE content ADD CONSTRAINT fk_content_current_version
  FOREIGN KEY (current_version_id) REFERENCES content_version(id) ON DELETE SET NULL;

CREATE TABLE approval (                               -- UC-02, BR-03/04/05
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  version_id  uuid NOT NULL REFERENCES content_version(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES app_user(id),
  result      approval_result NOT NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_approval_version ON approval (version_id);

CREATE TABLE seo_meta (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id  uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  title       text, description text, keywords text,
  schema_json jsonb, score int,
  UNIQUE (content_id)
);

CREATE TABLE category (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id   uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  name text NOT NULL
);
CREATE TABLE content_category (
  content_id  uuid REFERENCES content(id) ON DELETE CASCADE,
  category_id uuid REFERENCES category(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

-- ============================================================
-- Media, domain, forms/leads, publish
-- ============================================================
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id   uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  url text NOT NULL, format text, size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_media_site ON media (site_id, created_at DESC);

CREATE TABLE domain (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id   uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  domain text NOT NULL UNIQUE,
  status domain_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  site_id   uuid NOT NULL REFERENCES site(id) ON DELETE CASCADE,
  fields jsonb NOT NULL
);
CREATE TABLE lead (                                   -- PII → ND 13/2023
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  form_id   uuid NOT NULL REFERENCES form(id) ON DELETE CASCADE,
  data jsonb NOT NULL, consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_lead_form ON lead (form_id, created_at DESC);

CREATE TABLE publish_job (                            -- UC-03
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  run_at timestamptz NOT NULL,
  status job_status NOT NULL DEFAULT 'queued',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (run_at >= created_at)                        -- không lịch quá khứ
);
-- Worker chỉ quét job 'queued' đến hạn → partial index rất nhỏ
CREATE INDEX ix_publishjob_due ON publish_job (run_at) WHERE status = 'queued';

-- ============================================================
-- Billing & AI usage
-- ============================================================
CREATE TABLE plan (                                   -- global, giá VND
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, price_vnd bigint NOT NULL,
  period text NOT NULL, limits jsonb NOT NULL
);
CREATE TABLE subscription (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plan(id),
  status sub_status NOT NULL DEFAULT 'free',
  renews_at timestamptz
);
CREATE INDEX ix_sub_tenant ON subscription (tenant_id);
CREATE TABLE invoice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES subscription(id),
  amount_vnd bigint NOT NULL, status invoice_status NOT NULL DEFAULT 'pending',
  gateway text, gateway_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gateway, gateway_ref)                        -- idempotent webhook
);
CREATE INDEX ix_invoice_tenant ON invoice (tenant_id, created_at DESC);

CREATE TABLE ai_usage (                               -- BR-07 quota metering (high-churn)
  id bigserial,
  tenant_id uuid NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id uuid REFERENCES app_user(id),
  feature text NOT NULL,
  tokens int, cost_vnd bigint,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
CREATE INDEX ix_ai_usage_tenant_time ON ai_usage (tenant_id, occurred_at DESC);

-- ============================================================
-- Analytics — PARTITIONED by month (high-volume, time-series)
-- ============================================================
CREATE TABLE analytics_event (
  id bigserial,
  tenant_id uuid NOT NULL,
  site_id uuid NOT NULL,
  type text NOT NULL,
  props jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

CREATE INDEX ix_analytics_tenant_site_time
  ON analytics_event (tenant_id, site_id, occurred_at);

-- Partitions (tự động tạo bằng pg_partman/cron trong production)
CREATE TABLE analytics_event_2026_05 PARTITION OF analytics_event
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE analytics_event_2026_06 PARTITION OF analytics_event
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE analytics_event_2026_07 PARTITION OF analytics_event
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE analytics_event_default PARTITION OF analytics_event DEFAULT;

-- ============================================================
-- Row-Level Security — cô lập tenant (ADR-002)
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'app_user','site','content','content_version','approval','seo_meta',
    'category','media','domain','form','lead','publish_job',
    'subscription','invoice','ai_usage','analytics_event'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format($f$
      CREATE POLICY tenant_isolation ON %I
        USING (tenant_id = current_setting('app.current_tenant', true)::uuid)
        WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::uuid);
    $f$, t);
  END LOOP;
END $$;

-- App role (không superuser, không BYPASSRLS) — RLS áp dụng thật sự
CREATE ROLE app_role NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_role;
