-- ============================================================
-- Migration 0002 — Auth support: SECURITY DEFINER lookup + runtime login role
-- ============================================================

-- Tra cứu user lúc đăng nhập (chưa biết tenant) — chạy quyền owner (bypass RLS),
-- bề mặt hẹp, chỉ trả field tối thiểu cần cho auth.
CREATE OR REPLACE FUNCTION auth_lookup(p_email citext)
RETURNS TABLE(id uuid, tenant_id uuid, role_name text, password_hash text, status user_status)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT u.id, u.tenant_id, r.name, u.password_hash, u.status
  FROM app_user u
  JOIN role r ON r.id = u.role_id
  WHERE u.email = p_email
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION auth_lookup(citext) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth_lookup(citext) TO app_role;

-- Role runtime của API: LOGIN, member của app_role (thừa kế grants),
-- KHÔNG superuser / KHÔNG bypassrls  → RLS có hiệu lực thật.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_login') THEN
    CREATE ROLE app_login LOGIN PASSWORD 'app_pw' IN ROLE app_role;
  END IF;
END $$;
