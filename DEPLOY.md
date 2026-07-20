# Deploy — VietCMS (Docker Compose)

Deploy đơn giản cả stack (API + Postgres + Redis) bằng một lệnh. Đã verify: 3 service healthy, 10/10 e2e bảo mật pass.

## Yêu cầu
- Docker + Docker Compose v2.
- Đặt **secret** `JWT_SECRET` (bắt buộc — compose fail nếu thiếu).

## Deploy (1 lệnh)
```bash
cp .env.example .env         # rồi ĐẶT JWT_SECRET thật trong .env
docker compose up -d --build # build image api + chạy pg (auto-migrate) + redis + api
docker compose exec -T api node scripts/seed.mjs   # (tuỳ chọn) nạp dữ liệu demo
```
- API: http://localhost:3001/v1 · liveness `/v1/health` · readiness `/v1/health/ready`
- Migrations tự apply ở lần init Postgres đầu (mount `db/*.sql` vào `docker-entrypoint-initdb.d`).

## Kiểm chứng sau deploy (smoke test)
```bash
docker compose ps                        # tất cả (healthy)
curl -s localhost:3001/v1/health         # {"status":"ok",...}
curl -s localhost:3001/v1/health/ready   # {"status":"ready","db":"up"}
node scripts/e2e-verify.mjs              # 10 passed, 0 failed
```

## Thành phần & thực hành tốt đã áp
| Hạng mục | Cách làm |
|---|---|
| **Health/readiness probe** | Dockerfile `HEALTHCHECK` → `/v1/health`; readiness `/v1/health/ready` (ping DB) |
| **Non-root** | Image chạy `USER node` |
| **Resource limits** | `deploy.resources.limits` (0.75 cpu / 256M) |
| **Không dùng `latest`** | Image pin tag `vietcms/api:${API_TAG}` (mặc định 0.1.0) |
| **Secrets không hardcode** | `JWT_SECRET` từ env (`.env` gitignored); compose bắt buộc phải set |
| **Thứ tự khởi động** | `api` `depends_on: postgres (service_healthy)` → migrations xong mới chạy |
| **Restart policy** | `unless-stopped` |
| **Data bền** | Postgres dùng named volume `pgdata` |

## Cập nhật / phát hành phiên bản mới
```bash
# Gắn tag phiên bản (KHÔNG dùng latest), giữ image cũ để rollback
API_TAG=0.2.0 docker compose build api
API_TAG=0.2.0 docker compose up -d api        # recreate container api (downtime ngắn)
node scripts/e2e-verify.mjs                    # verify
```

## Rollback procedure
```bash
# 1. Quay về image phiên bản trước (image cũ vẫn còn trên máy)
API_TAG=0.1.0 docker compose up -d --no-build api

# 2. Verify
docker compose ps                              # api (healthy)
curl -f localhost:3001/v1/health/ready
node scripts/e2e-verify.mjs

# Nếu lỗi migration: khôi phục DB từ backup (xem dưới) rồi rollback image.
```
> Downtime ngắn khi recreate 1 container. Cần zero-downtime → chạy 2 replica sau reverse-proxy (nginx/traefik) hoặc chuyển K8s (rolling update) — giai đoạn sau.

## Backup / Restore (Postgres)
```bash
# Backup
docker compose exec -T postgres pg_dump -U postgres vietcms > backup_$(date +%F).sql
# Restore
docker compose exec -T postgres psql -U postgres -d vietcms < backup_YYYY-MM-DD.sql
```

## Dừng / dọn
```bash
docker compose down          # dừng, GIỮ dữ liệu (volume pgdata)
docker compose down -v       # dừng và XOÁ luôn dữ liệu
```

## Ghi chú production (nâng cấp sau)
- **Secrets:** chuyển `JWT_SECRET` + mật khẩu DB (`app_login`) sang **Docker secrets** / secret manager (Vault, AWS SM). Hiện `app_login` password đặt cố định trong `0002_auth.sql` — production nên tham số hoá + rotate.
- **CI/CD:** thêm GitHub Actions (build → e2e với service Postgres → **trivy scan image** → push GHCR). Chưa làm ở bản này.
- **Monitoring:** hiện có healthcheck. Thêm `/metrics` (Prometheus) + Grafana + alert.
- **TLS:** đặt reverse proxy (traefik/caddy) trước API cho HTTPS + custom domain.
- **Staging:** deploy stack này lên môi trường staging trước, chạy e2e, rồi mới production.
