# Architecture Decision Records (ADR) — VietCMS

> Phase 3b · v1.0 · 2026-07-20 · Mỗi ADR ghi lại một quyết định kiến trúc quan trọng kèm **đánh đổi** (không chỉ lợi ích).
> Bối cảnh chung: MVP 6 tháng · ngân sách hạn chế · đội nhỏ · multi-tenant SaaS · SEO/hiệu năng mặc định.
> Xem tổng quan: [01-architecture-overview-v1.md](01-architecture-overview-v1.md).

| ADR | Quyết định | Status |
|---|---|---|
| [001](#adr-001) | Modular Monolith (không microservices cho MVP) | Accepted |
| [002](#adr-002) | Multi-tenancy: shared DB + Row-Level Security | Accepted |
| [003](#adr-003) | PostgreSQL làm datastore chính | Accepted |
| [004](#adr-004) | Next.js SSG/ISR + CDN cho trang công khai | Accepted |
| [005](#adr-005) | Block content model (JSONB) + editor TipTap | Accepted |
| [006](#adr-006) | Async jobs (Redis/BullMQ) + SSE cho realtime | Accepted |
| [007](#adr-007) | AI abstraction, mặc định Anthropic Claude + quota | Accepted |
| [008](#adr-008) | Payment abstraction, VNPay trước cho MVP | Accepted |
| [009](#adr-009) | Backend NestJS/TypeScript | Accepted |

---

## ADR-001
# ADR-001: Modular Monolith cho MVP (không microservices)
**Status:** Accepted
## Context
Đội nhỏ, MVP 6 tháng, ngân sách hạn chế. Cần ship nhanh, vận hành đơn giản, nhưng vẫn giữ đường tiến hoá về microservices nếu tăng trưởng.
## Decision
Xây một **modular monolith** (NestJS) với module ranh giới rõ: Auth&Tenancy, Content, Workflow, Publishing, AI&SEO, Billing, Analytics, Leads. Một deployable; giao tiếp trong tiến trình.
## Alternatives Considered
- **Microservices:** scale/độc lập triển khai, nhưng chi phí vận hành (mạng, phân tán, devops) quá cao cho đội nhỏ/thời gian ngắn.
- **Serverless functions:** rẻ khi tải thấp, nhưng cold start + độ phức tạp state cho editor/publish không hợp.
## Consequences
- ➕ Ship nhanh, debug/deploy đơn giản, chi phí thấp, dễ refactor nội bộ.
- ➖ Scale theo cả khối; ranh giới module phải kỷ luật để sau tách được.
## Trade-offs
Ưu tiên **tốc độ giao hàng & đơn giản vận hành** hơn khả năng scale/triển khai độc lập ở giai đoạn đầu. Giữ module hoá để tách Publishing/AI thành service khi cần.

---

## ADR-002
# ADR-002: Multi-tenancy — Shared DB, Shared Schema + Row-Level Security
**Status:** Accepted
## Context
SRS yêu cầu **cô lập dữ liệu theo tenant** (NFR bảo mật). Cần cân bằng chi phí vận hành, mức cô lập, và tốc độ phát triển cho mid-market.
## Decision
Dùng **một database, một schema**; mọi bảng có `tenant_id`; cô lập bằng **PostgreSQL Row-Level Security**. Mỗi request set `app.current_tenant`; policy RLS lọc tự động. Defense-in-depth: guard API + query scope + RLS.
## Alternatives Considered
- **Database-per-tenant:** cô lập mạnh nhất, nhưng vận hành/di trú/chi phí cao, không hợp số lượng tenant lớn giá thấp.
- **Schema-per-tenant:** cô lập khá, nhưng migration nhân theo số schema, phức tạp khi nhiều tenant.
## Consequences
- ➕ Chi phí thấp, một migration, pooling hiệu quả, dễ vận hành.
- ➖ "Noisy neighbor"; rủi ro rò rỉ nếu quên scope → phải test cách ly nghiêm ngặt; giới hạn cô lập vật lý.
## Trade-offs
Chọn **chi phí thấp & đơn giản** hơn cô lập vật lý tuyệt đối. Khách enterprise cần cô lập cứng → cân nhắc DB riêng ở gói cao (sau).

---

## ADR-003
# ADR-003: PostgreSQL làm datastore chính
**Status:** Accepted
## Context
Cần ACID cho billing/approval, quan hệ phức tạp (tenant→site→page→version→approval), lưu **nội dung block linh hoạt**, full-text search cơ bản, và **RLS** cho multi-tenancy.
## Decision
Dùng **PostgreSQL** (managed) làm nguồn sự thật. Nội dung block lưu **JSONB**; quan hệ dùng bảng chuẩn hoá; full-text search Postgres cho MVP.
## Alternatives Considered
- **MongoDB:** schema linh hoạt cho content, nhưng yếu ACID đa-document (billing/approval rủi ro) và không RLS.
- **MySQL:** phổ biến, nhưng RLS/JSONB/full-text kém linh hoạt hơn Postgres.
## Consequences
- ➕ Một DB lo cả quan hệ + tài liệu (JSONB) + RLS + search → giảm số hệ thống.
- ➖ Scale ghi theo chiều dọc; sharding sau này phức tạp.
## Trade-offs
Ưu tiên **nhất quán & linh hoạt truy vấn** hơn khả năng scale ghi ngang vô hạn (chưa cần ở mid-market MVP).

---

## ADR-004
# ADR-004: Next.js SSG/ISR + CDN cho trang công khai
**Status:** Accepted
## Context
NFR MT-04: trang xuất bản đạt **Lighthouse ≥ 90 mobile**. Trang công khai đa tenant, custom domain, phải nhanh và chuẩn SEO.
## Decision
Kết xuất trang công khai bằng **Next.js SSG/ISR**: khi publish, render trang thành HTML tĩnh, đẩy **CDN**; ISR để cập nhật tăng dần. **Tách** renderer khỏi Admin App. Admin App cũng dùng Next.js (SSR/SPA).
## Alternatives Considered
- **SSR thuần mỗi request:** dễ động, nhưng khó đạt Lighthouse/độ trễ ổn định ở quy mô + tốn compute.
- **Client-side SPA cho public:** SEO/hiệu năng kém — loại.
## Consequences
- ➕ Tốc độ + SEO tối ưu, chịu tải tốt nhờ CDN, chi phí compute thấp khi phục vụ.
- ➖ Cần pipeline render lúc publish + quản lý invalidation cache + custom domain/SSL.
## Trade-offs
Ưu tiên **hiệu năng/SEO của trang công khai** (lời hứa cốt lõi) hơn sự đơn giản của SSR động.

---

## ADR-005
# ADR-005: Block content model (JSONB) + editor trên TipTap
**Status:** Accepted
## Context
Editor no-code kéo-thả theo block (US-01) là màn trung tâm; cần mô hình nội dung có cấu trúc, versioned, render lại được cho public site. (Open Q1)
## Decision
Định nghĩa **JSON block schema** (mảng block có type + props + children), lưu trong `content_version.content` (JSONB). Xây editor trên **TipTap (ProseMirror)** với custom node cho các block. Renderer public đọc JSON → HTML.
## Alternatives Considered
- **Lexical (Meta):** hiện đại, hiệu năng tốt; hệ sinh thái/plugin còn non hơn TipTap.
- **Editor.js:** block-native, nhưng tuỳ biến node phức tạp và schema kém linh hoạt.
- **HTML thô:** đơn giản, nhưng khó cấu trúc/tái sử dụng/an toàn (XSS) và khó render đa kênh.
## Consequences
- ➕ Nội dung có cấu trúc → render nhiều nơi, versioning/diff dễ, an toàn hơn HTML thô.
- ➖ Cần công xây custom node/block; hợp đồng schema phải quản lý phiên bản.
## Trade-offs
Ưu tiên **cấu trúc & khả năng tái sử dụng/an toàn** hơn tốc độ dựng ban đầu của HTML thô.

---

## ADR-006
# ADR-006: Async jobs (Redis/BullMQ) + SSE cho realtime
**Status:** Accepted
## Context
Publish (render+CDN), gọi AI, xử lý ảnh là tác vụ nặng/độ trễ cao → không nên chặn request. Thông báo duyệt cần realtime nhẹ. (Open Q2)
## Decision
Dùng **Redis + BullMQ** cho job queue (publish, AI, image, scheduled publish). Thông báo (duyệt, xuất bản xong) đẩy qua **Server-Sent Events (SSE)** — một chiều, đơn giản. WebSocket chỉ khi cần 2 chiều (chưa cần MVP).
## Alternatives Considered
- **WebSocket cho mọi thông báo:** mạnh nhưng phức tạp (kết nối, scale sticky) — thừa cho nhu cầu một chiều.
- **Polling:** đơn giản nhưng tốn tài nguyên/độ trễ.
- **Queue trên Postgres:** bớt một hệ thống, nhưng Redis cần cho cache/rate-limit dù sao.
## Consequences
- ➕ Request nhanh (<2s p95), tách tải, retry/at-least-once cho job; SSE nhẹ.
- ➖ Thêm Redis vào hạ tầng; cần xử lý job idempotent + theo dõi hàng đợi.
## Trade-offs
Ưu tiên **đáp ứng nhanh & độ tin cậy job** hơn việc giữ hạ tầng tối thiểu tuyệt đối.

---

## ADR-007
# ADR-007: AI abstraction, mặc định Anthropic Claude + quota metering
**Status:** Accepted
## Context
Cần AI viết/tối ưu nội dung **tiếng Việt** chất lượng (UC-04); tính hạn mức theo tenant (BR-07); tránh lock-in; xử lý lỗi không trừ hạn mức. (Open Q3)
## Decision
Tạo **AI provider abstraction** (interface chung: generate, suggestSeo…). Mặc định **Anthropic Claude** (tiếng Việt tốt). Gọi **async**; **quota metering** qua bảng `ai_usage`; lỗi AI → giữ nội dung gốc, **không trừ** hạn mức (BR-07). Cache kết quả khi hợp lý.
## Alternatives Considered
- **Khoá cứng một nhà cung cấp:** đơn giản, nhưng rủi ro lock-in/giá/chất lượng đổi.
- **Tự host mô hình mở:** kiểm soát chi phí dài hạn, nhưng vận hành/hạ tầng vượt ngân sách MVP.
## Consequences
- ➕ Đổi/kết hợp provider dễ; kiểm soát chi phí qua quota; chịu lỗi tốt.
- ➖ Phụ thuộc bên thứ ba (độ trễ/giá); cần theo dõi chi phí token theo tenant.
## Trade-offs
Ưu tiên **chất lượng tiếng Việt & linh hoạt provider** hơn kiểm soát hạ tầng AI tuyệt đối.

---

## ADR-008
# ADR-008: Payment abstraction, VNPay trước cho MVP
**Status:** Accepted
## Context
Cần thanh toán định kỳ qua cổng **nội địa** (VNPay/MoMo/ZaloPay — UC-07); tối thiểu một cổng cho MVP (FR-INT-001); giá VND minh bạch, không tăng gia hạn (BR-11). (Open Q6)
## Decision
Tạo **payment gateway abstraction** (charge, webhook, refund, subscription). Tích hợp **VNPay trước** cho MVP; **MoMo, ZaloPay** thêm sau. Webhook **idempotent**; retry + dunning: sau N lần thất bại hạ về Free (BR-12).
## Alternatives Considered
- **Tích hợp cả 3 cổng ngay:** phủ rộng, nhưng tốn thời gian MVP; mỗi cổng có đặc thù reconciliation.
- **Dùng aggregator/Stripe:** DX tốt, nhưng hỗ trợ nội địa VN + phương thức local hạn chế.
## Consequences
- ➕ Ship MVP nhanh với một cổng; thêm cổng không đụng nghiệp vụ billing.
- ➖ Phải chuẩn hoá khác biệt giữa các cổng trong abstraction; xử lý webhook/đối soát cẩn thận.
## Trade-offs
Ưu tiên **ra MVP nhanh + bản địa** hơn phủ đủ mọi cổng ngay từ đầu.

---

## ADR-009
# ADR-009: Backend NestJS / TypeScript
**Status:** Accepted
## Context
Frontend là Next.js/TypeScript. Cần backend có cấu trúc rõ, DI, dễ tuyển người, chia sẻ type với FE, phù hợp modular monolith.
## Decision
Dùng **NestJS (TypeScript)**. Chia sẻ type/DTO với frontend qua package chung (monorepo). REST cho MVP; GraphQL/headless API để sau (US-22).
## Alternatives Considered
- **FastAPI (Python):** xuất sắc cho AI/ML in-process; nhưng ở đây AI chủ yếu gọi API ngoài, và sẽ phải chuyển ngữ cảnh FE↔BE (2 ngôn ngữ).
- **Spring Boot (Java):** rất mạnh/ổn định enterprise, nhưng nặng và chậm khởi tạo cho đội nhỏ/MVP.
## Consequences
- ➕ Một ngôn ngữ toàn stack, share type, cấu trúc module hợp monolith, tuyển dụng dễ.
- ➖ Tính toán nặng/CPU-bound kém Java/Go; hệ AI Python phong phú hơn (bù bằng gọi API).
## Trade-offs
Ưu tiên **thống nhất TypeScript & tốc độ phát triển** hơn ưu thế hệ sinh thái Python cho AI (nhu cầu AI ở đây là gọi API, không train mô hình).

---

*Cập nhật ADR khi có quyết định mới hoặc thay đổi (đổi Status → Superseded và tham chiếu ADR thay thế).*
