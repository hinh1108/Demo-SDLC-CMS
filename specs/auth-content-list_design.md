# Technical Design — Auth + Content List (vertical slice #1)

> Phase 4 · Implementation · fullstack-guardian · 2026-07-20
> Feature đầu tiên: đăng nhập (JWT) + liệt kê nội dung theo tenant. Là nền bảo mật cho mọi feature sau.
> Truy vết: US-01/US-07/US-18 · API `/auth/login`, `/sites/{id}/contents` (openapi-v1.yaml) · Data model + RLS (03/05-db).

## 1. Scope & Acceptance Criteria
- **AC1** POST `/v1/auth/login` với email+mật khẩu đúng → trả JWT (chứa `sub`, `tenant_id`, `role`), `expires_in`.
- **AC2** Sai mật khẩu / user không tồn tại → `401` **thông báo chung** (không lộ user tồn tại hay không).
- **AC3** GET `/v1/sites/{site_id}/contents` với JWT hợp lệ → chỉ trả nội dung **thuộc tenant của token** (RLS), phân trang, lọc `status`.
- **AC4** Không có token / token sai → `401`.
- **AC5** JWT của **tenant B** gọi → **không** thấy dữ liệu tenant A (kể cả khi truyền `site_id` của A).
- **AC6** Lỗi trả theo **RFC 7807** `application/problem+json`; không lộ stack/thông tin nhạy cảm.

## 2. Ba góc nhìn

### 2.1 [Backend]
- **NestJS** (ADR-009) chạy thật, kết nối **PostgreSQL** qua `pg` Pool bằng role **`app_login`** (non-superuser → RLS có hiệu lực).
- **Tenant scoping:** mỗi request đọc `tenant_id` từ JWT → mở transaction, `set_config('app.current_tenant', <uuid>, true)` (SET LOCAL, an toàn với connection pooling) → RLS tự lọc.
- **Auth lookup:** dùng hàm `auth_lookup(email)` **SECURITY DEFINER** (owner=postgres, bypass RLS) chỉ để tra user lúc đăng nhập (chưa biết tenant). Bề mặt hẹp, trả tối thiểu.
- **Parameterized queries** ($1,$2…) — không nối chuỗi SQL.
- Mật khẩu **bcrypt** (bcryptjs). JWT ký bằng secret từ **env** (không hardcode).

### 2.2 [Frontend]
- **Typed API client** (`web/src/api-client.ts`) đính `Authorization: Bearer`; parse lỗi problem+json.
- **React hook** `useContents` + `LoginForm` (mẫu tích hợp).
- **Client-side guard** (vd kiểm tra email/format) — nhưng **không bao giờ là hàng rào duy nhất**; server luôn validate lại.

### 2.3 [Security] — checkpoint trước khi code
- [x] **AuthN:** JWT verify **phía server** (guard); header client chỉ là tiện lợi, không phải cổng.
- [x] **AuthZ / tenant isolation:** RLS (DB) + tenant từ JWT (không nhận từ client body/param) → defense-in-depth. Superuser bypass RLS ⇒ app dùng role thường.
- [x] **Input validation** cả client lẫn server (`class-validator`, whitelist).
- [x] **SQL injection:** parameterized queries + `set_config(...,true)` tham số hoá.
- [x] **Output:** response schema tường minh — **không** trả `password_hash` hay field nhạy cảm; content trả field giới hạn.
- [x] **Error handling:** RFC 7807, thông báo chung cho auth (chống user enumeration), không lộ stack.
- [x] **Secrets:** JWT secret + DB creds từ env.
- [x] **Security logging:** ghi sự kiện đăng nhập (email + IP + kết quả), **không** log mật khẩu.
- [x] **Rate limit:** throttle `/auth/login` theo IP (chống brute-force) — bản MVP in-memory.
- [x] **CORS:** chỉ cho origin FE cấu hình.
- [x] **Transport:** TLS (ở tầng hạ tầng); cookie/token xử lý an toàn.

## 3. Thành phần & luồng
```
POST /v1/auth/login  → AuthController → AuthService
   → Db.authLookup(email)  [SECURITY DEFINER, bypass RLS]
   → bcrypt.compare → sign JWT{sub,tenant_id,role} → { access_token, expires_in }

GET /v1/sites/:site_id/contents  (JwtGuard)
   → ContentController (validate query) → ContentService
   → Db.withTenant(tenantId, client => client.query(SELECT ... WHERE site_id=$1 ...))
      [BEGIN; SET LOCAL app.current_tenant; RLS lọc theo tenant; COMMIT]
   → map DTO (field giới hạn) → { data, pagination }
```

## 4. Kiểm thử (runnable verify — scripts/e2e-verify.mjs)
1. Login tenant A (ngoc@a.vn) → nhận JWT.
2. List contents site A → chỉ content tenant A.
3. Login tenant B (ed@b.vn) → JWT B; list **site A** → **0 dòng** (RLS chặn) → AC5.
4. Gọi không token → 401 → AC4.
5. Sai mật khẩu → 401 chung → AC2.

## 5. Handoff (sau khi xong)
- → **Test Master** (mở rộng test), **DevOps** (Docker Compose có sẵn), **security-reviewer** (rà soát).
- Mở rộng: refresh token rotation, RBAC guard cho action (duyệt/xuất bản), throttle bằng Redis.
