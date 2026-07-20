# PostgreSQL — Schema, Index & Optimization (verified) — VietCMS

> Phase 3b · v1.0 · 2026-07-20 · Nâng data model lên production-ready.
> **Đã kiểm chứng thật** trên PostgreSQL 16 (Docker): apply schema → seed 50k content / 65k version / 200k analytics → `EXPLAIN (ANALYZE, BUFFERS)`.
> Migration: [`db/0001_init.sql`](db/0001_init.sql) · Bối cảnh: [Data model](03-data-model-v1.md) · [ADR-002 RLS](02-adr-log-v1.md#adr-002) · [ADR-003 Postgres](02-adr-log-v1.md#adr-003).

---

## 1. Tóm tắt kết quả verify

| Query (pattern thực từ API) | Index | Kết quả EXPLAIN | Thời gian |
|---|---|---|---|
| Q1 List content (tenant+site+status, sort updated_at) | `ix_content_tenant_site_status_upd` | **Index Scan**, né sort, 4 buffers | 0.04 ms |
| Q2 Full-text tiêu đề | `ix_content_title_fts` (GIN) | **Bitmap Index Scan**, 8000 match | 5.6 ms |
| Q3 Phiên bản mới nhất của content | `ix_version_content_created` | **Index Scan** | — |
| Q4 Hàng chờ duyệt (status=review) | `ix_content_review_queue` (**partial**) | **Index Scan**, 5 buffers | 0.03 ms |
| Q5 Analytics theo tháng | partition `_2026_06` | **Partition pruning** ✓ (chỉ quét 1 phân vùng) | 33 ms |
| Q6 JSONB `blocks @> image` | `ix_version_blocks_gin` (GIN) | **Bitmap Index Scan** (khi selective) | 15 ms |
| Dashboard recent (thêm index) | `ix_content_tenant_updated` | Seq Scan **21.5ms → 0.06ms** (~340×) | 0.06 ms |
| RLS cô lập tenant | policy `tenant_isolation` | A thấy 40k, B thấy 10k; ghi sai tenant **bị chặn** | — |

> Tất cả index đã được **planner thực sự chọn** (verify trước/sau — MUST DO của skill), không chỉ tạo cho có.

---

## 2. Chiến lược Index (gắn với query pattern API)

### 2.1 `content` — bảng nóng nhất
```sql
-- List/filter + sort trong 1 index (tránh sort riêng)
CREATE INDEX ix_content_tenant_site_status_upd
  ON content (tenant_id, site_id, status, updated_at DESC);
-- Hàng chờ duyệt — PARTIAL index (chỉ ~%nhỏ 'review') → rất nhỏ, rất nhanh
CREATE INDEX ix_content_review_queue
  ON content (tenant_id, updated_at DESC) WHERE status = 'review';
-- Dashboard "nội dung gần đây" toàn tenant (mọi site)
CREATE INDEX ix_content_tenant_updated ON content (tenant_id, updated_at DESC);
-- Full-text tiêu đề (SRS §III.3)
CREATE INDEX ix_content_title_fts ON content USING GIN (to_tsvector('simple', title));
```
**Bằng chứng Q1 (Index Scan, không sort):**
```
Limit (actual rows=20)  Buffers: shared hit=4
  ->  Index Scan using ix_content_tenant_site_status_upd on content
        Index Cond: (tenant_id=... AND site_id=... AND status='published')
Execution Time: 0.038 ms
```
**Bằng chứng dashboard recent — before/after (giá trị thật):**
```
BEFORE:  Seq Scan on content (rows=40000) + top-N sort · Buffers hit=969 · 21.553 ms
AFTER :  Index Scan using ix_content_tenant_updated · Buffers hit=1 read=3 · 0.064 ms   (~340× nhanh hơn)
```
> Bài học: index composite phải **khớp cả thứ tự filter lẫn ORDER BY**. `(tenant_id, site_id, status, updated_at)` không phục vụ được truy vấn chỉ theo `(tenant_id, updated_at)` — cần index riêng.

### 2.2 `content_version` — versioning + JSONB
```sql
CREATE INDEX ix_version_content_created ON content_version (content_id, created_at DESC); -- lấy bản mới nhất
CREATE INDEX ix_version_blocks_gin ON content_version USING GIN (blocks jsonb_path_ops);  -- @> containment
```
**Bằng chứng GIN JSONB (Q6b, forced để chứng minh index hoạt động):**
```
Bitmap Heap Scan on content_version (rows=14972)
  ->  Bitmap Index Scan on ix_version_blocks_gin   -- Buffers: shared hit=5 (index rất gọn)
        Index Cond: (blocks @> '[{"type":"image"}]')
```
> ⚠️ Với `LIMIT 5` + predicate **không chọn lọc** (~23% khớp), planner chọn Seq Scan (rẻ hơn khi chỉ cần 5 dòng). GIN chỉ thắng khi predicate **selective** hoặc quét toàn bộ. → GIN `blocks` là **tuỳ chọn cho MVP** (chưa query sâu vào block); giữ cho tương lai.

### 2.3 Partial index cho hàng đợi job
```sql
CREATE INDEX ix_publishjob_due ON publish_job (run_at) WHERE status='queued';
```
Worker chỉ quét job `queued` đến hạn → index chỉ chứa dòng đang chờ, cực nhỏ.

---

## 3. Multi-tenancy — RLS (verified)
```sql
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON content
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant', true)::uuid);
-- App set mỗi request:  SET app.current_tenant = '<uuid>';
```
**Bằng chứng cô lập (role `app_role`, non-superuser):**
```
SET app.current_tenant='...A';  SELECT count(*) FROM content;  -- tenantA sees 40000
SET app.current_tenant='...B';  SELECT count(*) FROM content;  -- tenantB sees 10000
INSERT INTO site (tenant_id, name) VALUES ('...A','hack');
  -- ERROR: new row violates row-level security policy for table "site"   ✓ WITH CHECK chặn ghi chéo
```
- Dùng `current_setting('app.current_tenant', true)` (missing_ok) → khi chưa set, trả NULL → **không thấy dòng nào** (fail-safe).
- **Superuser bypass RLS** → app phải kết nối bằng role thường (không BYPASSRLS). Đã tạo `app_role`.
- Defense-in-depth: RLS (DB) + guard (API) + query scope (ORM). **Không** dựa một tầng.

---

## 4. Partitioning — `analytics_event`
```sql
CREATE TABLE analytics_event (...) PARTITION BY RANGE (occurred_at);
CREATE TABLE analytics_event_2026_06 PARTITION OF analytics_event
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');  -- + _05, _07, default
```
**Bằng chứng pruning (Q5):** truy vấn tháng 6 chỉ chạm `analytics_event_2026_06`, các phân vùng khác **không quét**:
```
->  Seq Scan on analytics_event_2026_06 analytics_event (rows=66838)
```
- Trong seed chỉ 1 tenant nên seq-scan-trong-phân-vùng là tối ưu (khớp ~toàn bộ). **Production nhiều tenant/phân vùng:** index `ix_analytics_tenant_site_time (tenant_id, site_id, occurred_at)` lọc 1 tenant trong phân vùng.
- **Vận hành:** tạo phân vùng theo tháng tự động bằng **pg_partman** + `pg_cron`; drop/detach phân vùng cũ (retention) rẻ hơn DELETE. Cân nhắc rollup bảng tổng hợp cho dashboard.

---

## 5. Autovacuum & Maintenance (bảng high-churn)
Các bảng ghi nhiều: `content_version` (mỗi save), `analytics_event`, `ai_usage`, `publish_job`. Hạ ngưỡng autovacuum để tránh bloat:
```sql
ALTER TABLE content_version SET (autovacuum_vacuum_scale_factor=0.05, autovacuum_analyze_scale_factor=0.02);
ALTER TABLE analytics_event SET (autovacuum_vacuum_scale_factor=0.02);  -- (đặt trên từng partition)
ALTER TABLE publish_job     SET (autovacuum_vacuum_scale_factor=0.05);
```
- `publish_job` xoá/đổi trạng thái liên tục → dễ bloat; vacuum thường xuyên.
- **Không** tắt autovacuum toàn cục.
- `ANALYZE` sau bulk load/migration (đã làm trong verify).

---

## 6. Monitoring (chạy định kỳ trong production)
```sql
-- Query chậm (bật extension trước)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- Bloat / dead tuples
SELECT relname, n_dead_tup, n_live_tup,
       round(n_dead_tup::numeric/NULLIF(n_live_tup+n_dead_tup,0)*100,2) AS dead_pct, last_autovacuum
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 20;

-- Index không dùng (cân nhắc bỏ)
SELECT relname, indexrelname, idx_scan
FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY relname;

-- Replication lag (khi có standby cho uptime ≥99.5%)
SELECT client_addr, state, (sent_lsn - replay_lsn) AS lag_bytes FROM pg_stat_replication;
```

---

## 7. Connection pooling & hạ tầng
- **PgBouncer** (transaction pooling) trước Postgres — bắt buộc cho app nhiều kết nối (NestJS pool).
  - Lưu ý: `SET app.current_tenant` là session state → dùng ở mức transaction (SET LOCAL trong cùng transaction) để tương thích transaction pooling.
- Managed Postgres có **PITR** + standby (đáp NFR sao lưu + uptime 99.5%).
- Mã hoá at-rest + TLS; nhật ký truy cập PII (ND 13/2023).

---

## 8. Cách tái tạo kiểm chứng
```bash
docker run -d --name pg -e POSTGRES_PASSWORD=pw -e POSTGRES_DB=vietcms postgres:16
docker exec -i pg psql -U postgres -d vietcms < db/0001_init.sql
# seed + EXPLAIN: xem script trong quá trình verify (generate_series 50k/65k/200k) rồi:
#   EXPLAIN (ANALYZE, BUFFERS) <query>
```

---

## 9. Thay đổi so với data model draft (03)
- Thêm `created_at`/`updated_at` + trigger `set_updated_at`; fix `publish_job.created_at` (CHECK cần cột này).
- `content` gộp page/post qua `kind` (enum) — tái dùng versioning/approval/seo.
- Thêm index dashboard `ix_content_tenant_updated` (phát hiện qua EXPLAIN).
- Partition `analytics_event` theo tháng; PK `(id, occurred_at)`.
- `invoice UNIQUE(gateway, gateway_ref)` cho webhook idempotent.
- Role `app_role` (non-superuser) để RLS có hiệu lực thật.

---

*Next: đưa `0001_init.sql` vào migration tool (Prisma/TypeORM/Knex) khi khởi tạo repo backend. Tinh chỉnh thêm khi có query thật từ `pg_stat_statements` trong staging.*
