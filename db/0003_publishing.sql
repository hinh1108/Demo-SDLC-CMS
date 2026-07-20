-- ============================================================
-- Migration 0003 — Publishing state (US-14)
-- ============================================================
ALTER TABLE content
  ADD COLUMN IF NOT EXISTS published_version_id uuid REFERENCES content_version(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS public_url text;

-- Index cho sitemap (nội dung đã xuất bản của site)
CREATE INDEX IF NOT EXISTS ix_content_site_published
  ON content (site_id) WHERE status = 'published';
