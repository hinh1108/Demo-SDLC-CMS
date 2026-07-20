-- ============================================================
-- Migration 0004 — SEO / public sitemap (US-09)
-- ============================================================

-- Sitemap công khai (search engine, không auth) → SECURITY DEFINER,
-- chỉ trả nội dung ĐÃ XUẤT BẢN của site. Bề mặt hẹp, read-only.
CREATE OR REPLACE FUNCTION public_sitemap(p_site_id uuid)
RETURNS TABLE(slug text, public_url text, published_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT slug, public_url, published_at
  FROM content
  WHERE site_id = p_site_id AND status = 'published'
  ORDER BY published_at DESC;
$$;
REVOKE ALL ON FUNCTION public_sitemap(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_sitemap(uuid) TO app_role;
