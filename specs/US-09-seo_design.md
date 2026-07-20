# Implementation Design + Security Checkpoint — US-09 SEO meta + sitemap.xml (slice #5)

> fullstack-guardian · 2026-07-20 · Trace US-09 · UC-04(SEO) · MT-04 · API `/contents/:id/seo`, `/sites/:siteId/sitemap.xml`

## Scope
- Quản lý metadata SEO cho content (title/description/keywords/schema) + **điểm SEO** tự tính.
- **sitemap.xml công khai** cho search engine (chỉ nội dung `published`).
- Áp metadata khi publish (render stub — ADR-004).

## Endpoints
| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | `/v1/contents/:id/seo` | JWT | Lấy SEO meta (mặc định nếu chưa có) |
| PUT | `/v1/contents/:id/seo` | JWT | Upsert SEO meta + tính điểm |
| GET | `/v1/sites/:siteId/sitemap.xml` | **Public** | XML sitemap (published) |

## Điểm SEO (heuristic 0–100)
title(30)+độ dài 30–60(10) · description(25)+độ dài 50–160(10) · keywords(15) · schema_json(10).

## Security Checkpoint
- [x] **AuthN/AuthZ:** GET/PUT seo yêu cầu JWT + RLS tenant. sitemap.xml **public** (dữ liệu đã publish vốn công khai).
- [x] **Public sitemap KHÔNG mở RLS:** dùng hàm `public_sitemap(site_id)` **SECURITY DEFINER**, chỉ trả `slug/public_url/published_at` của nội dung `published`. Bề mặt hẹp, read-only.
- [x] **Output encoding (XSS/XML injection) — trọng tâm:**
  - sitemap.xml: **XML-escape** mọi giá trị (`<>&'"`). Dù slug đã allow-list, vẫn escape phòng thủ.
  - SEO title/description sẽ vào HTML `<meta>` khi render (US-14): phải **HTML-escape** ở render (ngoài slice); ở đây validate + lưu dữ liệu.
- [x] **Input validation:** title ≤200, description ≤320, keywords ≤500, `schema_json` là object. Server + client.
- [x] **SQL injection:** parameterized; upsert `ON CONFLICT (content_id)`.
- [x] **Isolation:** GET/PUT qua RLS; cross-tenant → 404. sitemap chỉ published (không lộ draft).
- [x] **Error handling:** 404 content · 400 validation · RFC 7807.
- [x] **Logging:** log cập nhật SEO + áp meta khi publish (content, user).
- [x] **No sensitive leakage:** sitemap không lộ nội dung nháp/nội bộ; response seo không kèm field nội bộ.

## Test (e2e-seo.mjs)
GET seo mặc định · PUT seo hợp lệ → score cao · content.seo_score cập nhật · title quá dài→400 · schema_json không phải object→400 · publish content → sitemap.xml public 200 + Content-Type xml + chứa <loc> + well-formed · sitemap không chứa nội dung nháp · cross-tenant seo→404 · XML-escape an toàn.
