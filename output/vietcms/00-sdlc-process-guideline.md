# SDLC Process Guideline — VietCMS

> Dự án: **VietCMS** — no-code Marketing CMS SaaS multi-tenant cho đội marketing mid-market Việt.
> Ngày: 2026-07-20 · Phiên bản: v1.0
> Tài liệu này mô tả **toàn bộ vòng đời phát triển phần mềm (SDLC)** của VietCMS: mỗi phase làm gì, gọi **skill** nào, ra **deliverable** gì, lưu ở **đâu**, và **trạng thái hiện tại**.
> Đây là guideline cấp dự án. Guideline chi tiết riêng cho pha thiết kế UI/UX xem: [`uiux-design/00-uiux-process-guideline.md`](uiux-design/00-uiux-process-guideline.md).

---

## 1. Tổng quan — 7 phase SDLC

```
┌───────────┐  ┌───────────┐  ┌────────────────────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ 1.Planning│─▶│2.Require- │─▶│ 3. Design               │─▶│4.Implemen-│─▶│5.Testing  │─▶│6.Deploy   │─▶│7.Maintain │
│           │  │  ments    │  │  ┌─UI/UX──┐ ┌─Technical─┐│  │  tation   │  │           │  │           │  │           │
│           │  │           │  │  │  ✅    │ │    ✅     ││  │    ⬜    │  │    ⬜    │  │    ⬜    │  │    ⬜    │
└───────────┘  └───────────┘  └────────────────────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘
      ✅             ✅              Design xong                ⬅️ ĐANG Ở ĐÂY                                    ↺ lặp
```

| # | Phase | Câu hỏi cốt lõi | Trạng thái VietCMS |
|---|---|---|---|
| 1 | **Planning** | Xây gì? Cho ai? Vì sao? | ✅ Xong |
| 2 | **Requirements** | Cần những gì (chức năng + phi chức năng)? | ✅ Xong |
| 3 | **Design** — UI/UX | Trông & vận hành thế nào với người dùng? | ✅ Xong |
| 3 | **Design** — Technical | Kiến trúc/data/API xây thế nào? | ✅ Xong |
| 4 | **Implementation** | Viết code | ⬜ **Bước kế tiếp** |
| 5 | **Testing** | Đúng & an toàn chưa? | ⬜ Chưa |
| 6 | **Deployment** | Đưa lên production thế nào? | ⬜ Chưa |
| 7 | **Maintenance** | Vận hành, sửa lỗi, tối ưu | ⬜ Chưa |

---

## 2. Chi tiết từng phase

### Phase 1 — Planning ✅
- **Mục đích:** định tầm nhìn, phạm vi, mục tiêu kinh doanh trước khi làm gì khác.
- **Deliverable (đã có):** product vision, business case, scope statement.
- **Vị trí:** `docs/ba-docs/ba-phase1-business-analysis/`.
- **Skill liên quan:** `feature-forge` (đặc tả tính năng), `architecture-designer` (đánh giá khả thi sớm).

### Phase 2 — Requirements (Elicitation & Analysis) ✅
- **Mục đích:** thu thập & đặc tả yêu cầu chức năng + phi chức năng.
- **Deliverable (đã có):** BRD, SRS, use-cases, user-stories (23 US + MoSCoW), traceability matrix, competitor analysis, as-is process.
- **Vị trí:** `docs/ba-docs/ba-phase2-elicitation/`, `docs/ba-docs/ba-phase3-requirements-design/`.
- **Skill liên quan:** `feature-forge` (EARS requirements, acceptance criteria), `spec-miner` (khai thác spec từ tài liệu).

### Phase 3a — Design: UI/UX ✅
- **Mục đích:** thiết kế trải nghiệm & giao diện. Quy trình con 6 pha riêng.
- **Deliverable (đã có):** personas, journey, IA, design system + tokens, wireframes, hi-fi mockups, design handoff.
- **Vị trí:** `output/vietcms/uiux-design/` → chi tiết ở [`00-uiux-process-guideline.md`](uiux-design/00-uiux-process-guideline.md).
- **Skill:** `ux-research`, `ux-define`, `ux-ideation`, `ux-wireframe`, `ui-design-system`, `ux-testing-handoff`.

### Phase 3b — Design: Technical / Architecture ⬜ ⬅️ **BƯỚC KẾ TIẾP**
> Cầu nối bắt buộc giữa "UI xong" và "code". Đặc biệt quan trọng vì VietCMS là **multi-tenant SaaS + SEO/SSR + AI + thanh toán VN**.

- **Mục đích:** quyết kiến trúc, tech stack, data model, API contract, phi chức năng (bảo mật, hiệu năng, scale).
- **Câu hỏi cốt lõi:** hệ thống được xây thế nào để đáp ứng SRS + ràng buộc?
- **Deliverable đề xuất:** sơ đồ kiến trúc (C4), ADRs, tech stack decision, data model (ERD) multi-tenant, API spec (OpenAPI), non-functional plan (security/perf/scaling).
- **Vị trí đề xuất:** `output/vietcms/architecture/` (hoặc `docs/architecture/`).
- **Skill:**
  | Việc | Skill |
  |---|---|
  | Kiến trúc tổng thể, ADR, scalability, chọn stack | **`architecture-designer`** ⭐ vào đây trước |
  | API REST/GraphQL + OpenAPI | `api-designer` |
  | Data model multi-tenant, schema, index | `postgres-pro` / `database-optimizer` |
  | Tách microservices (nếu chọn) | `microservices-architect` |
  | Hạ tầng cloud | `cloud-architect` |
- **Input trực tiếp:** 7 Open Questions trong [`uiux-design/06-testing-handoff/06-design-handoff-v1.md`](uiux-design/06-testing-handoff/06-design-handoff-v1.md) (block model editor, nhà cung cấp AI, cổng thanh toán, ma trận quyền…).

### Phase 4 — Implementation (Development) ⬜
- **Mục đích:** hiện thực hoá thiết kế thành code chạy được.
- **Deliverable:** source code, unit tests, tài liệu code.
- **Vị trí:** repo code (chưa khởi tạo — dự án hiện chưa phải git repo).
- **Skill cho VietCMS:**
  | Phần | Skill |
  |---|---|
  | Frontend SSR/SEO (khớp MT-04 Lighthouse ≥90) | **`nextjs-developer`** ⭐ / `react-expert` |
  | Backend API | `fastapi-expert` / `nestjs-expert` / `spring-boot-engineer` |
  | Full-stack có bảo mật layered | `fullstack-guardian` |
  | Tích hợp AI nội dung/SEO tiếng Việt | `rag-architect` · `prompt-engineer` · `claude-api` |
  | Realtime (thông báo duyệt) | `websocket-engineer` |
  | Tài liệu code/API | `code-documenter` |

### Phase 5 — Testing & QA ⬜
- **Mục đích:** đảm bảo đúng, an toàn, dùng được.
- **Deliverable:** test suite, test report, security review, usability findings.
- **Skill:**
  | Loại | Skill |
  |---|---|
  | Chiến lược test, unit/integration | `test-master` |
  | E2E (luồng tạo→duyệt→xuất bản) | `playwright-expert` |
  | Rà soát code | `code-reviewer` (hoặc `/code-review`) |
  | **Bảo mật (điểm bán hàng vs WordPress)** | `security-reviewer` / `secure-code-guardian` |
  | Usability test UI (Phase 6 UI/UX còn dở) | `ux-testing-handoff` |
- ⚠️ **Đưa security vào sớm** — chống "khủng hoảng bảo mật WordPress" là khác biệt cạnh tranh (insight #2).

### Phase 6 — Deployment & Release ⬜
- **Mục đích:** đưa hệ thống lên production ổn định, lặp lại được.
- **Deliverable:** CI/CD pipeline, IaC, container/K8s manifest, monitoring, runbook.
- **Skill:** `devops-engineer`, `kubernetes-specialist`, `terraform-engineer`, `monitoring-expert`, `sre-engineer`, `chaos-engineer`.

### Phase 7 — Maintenance & Evolution ⬜
- **Mục đích:** vận hành, sửa lỗi, tối ưu, phát triển tính năng mới (US Could/Won't → bản sau).
- **Skill:** `debugging-wizard` (điều tra lỗi), `database-optimizer` (tối ưu query), `legacy-modernizer` (refactor), `monitoring-expert` (quan sát), `code-documenter`.
- **Lặp lại:** insight vận hành → quay về Phase 1/2/3 cho vòng phát triển mới.

---

## 3. Skill cheat-sheet (tra nhanh)

| SDLC phase | Skill chính | Skill hỗ trợ |
|---|---|---|
| Planning | `feature-forge` | `architecture-designer` |
| Requirements | `feature-forge`, `spec-miner` | — |
| Design · UI/UX | `ux-define` `ux-wireframe` `ui-design-system` | `ux-research` `ux-ideation` `ux-testing-handoff` |
| Design · Technical | **`architecture-designer`** | `api-designer` `postgres-pro` `microservices-architect` `cloud-architect` |
| Implementation | **`nextjs-developer`** + backend skill | `fullstack-guardian` `rag-architect` `websocket-engineer` `claude-api` |
| Testing | `test-master` `playwright-expert` | `code-reviewer` `security-reviewer` |
| Deployment | `devops-engineer` | `kubernetes-specialist` `terraform-engineer` `monitoring-expert` `sre-engineer` |
| Maintenance | `debugging-wizard` | `database-optimizer` `legacy-modernizer` `code-documenter` |

> Cách gọi: gõ `/<tên-skill>` hoặc mô tả nhu cầu bằng tiếng Việt (skill tự kích hoạt theo từ khoá).

---

## 4. Trạng thái & việc còn dở của VietCMS

| Phase | Trạng thái | Ghi chú |
|---|---|---|
| 1 Planning | ✅ | `docs/ba-docs/ba-phase1-*` |
| 2 Requirements | ✅ | `docs/ba-docs/ba-phase2-*`, `ba-phase3-*` (23 user stories) |
| 3a Design UI/UX | ✅ | `output/vietcms/uiux-design/` (define, wireframe, design system, hi-fi mockup, handoff) |
| 3b Design Technical | ✅ | `output/vietcms/architecture/` — overview + 9 ADR + data model + **OpenAPI 3.1 (lint pass)** + **DB schema/index verified bằng EXPLAIN thật (PG16)**; giải 7 Open Questions |
| 4 Implementation | 🟡 **Đang làm** | Repo khởi tạo (git). Slice #1 **Auth + Content list** (NestJS+RLS) đã chạy & verify 10/10 e2e. Xem `README.md`, `apps/api/`, `specs/` |
| 5 Testing | 🟡 | Design handoff xong; usability test + QA checklist (UI) & test code chưa làm |
| 6 Deployment | 🟡 **Đang làm** | Docker Compose deploy full-stack (api+pg+redis) — Dockerfile non-root + healthcheck + resource limits; verify 10/10 e2e. Xem `DEPLOY.md`. CI/CD + K8s chưa làm |
| 7 Maintenance | ⬜ | — |

### Việc còn dở cần nhớ
- **Phase 6 UI/UX** còn: usability test 3 mockup + design QA checklist.
- **Personas là proto-persona** — cần validate bằng phỏng vấn thật (`ux-research`).
- **7 Open Questions** trong design handoff cần chốt ở Phase 3b (technical design).

### Lộ trình đề xuất (thứ tự)
1. **`architecture-designer`** — kiến trúc + tech stack + data model + API (chốt luôn 7 Open Questions).
2. (song song) **usability test** 3 mockup với user thật để bắt vấn đề UX sớm.
3. **Implementation** — `nextjs-developer` (frontend SSR/SEO) + 1 backend skill; ưu tiên build design-system components trước.
4. **Testing** — `test-master` + `playwright-expert` + **`security-reviewer` (sớm)**.
5. **Deployment** — `devops-engineer` + `monitoring-expert`.

---

## 5. Quy ước chung
- **Cấu trúc output:** tài liệu planning/requirements ở `docs/`; artifact thiết kế/kiến trúc ở `output/vietcms/<phase>/`; code ở repo riêng khi khởi tạo.
- **Đặt tên:** giữ nhất quán, có version (`v1`, `v2`); tài liệu `.md`, artifact xem-được `.html`, dữ liệu cho dev `.json`.
- **Kế thừa:** mỗi phase lấy output phase trước làm input — không bắt đầu từ số 0.
- **Truy vết:** giữ liên kết ngược về user story / SRS để mọi quyết định có nguồn gốc.
- **Lặp:** SDLC không thẳng tuyệt đối — kết quả test/vận hành có thể đẩy ngược về design/requirements.

---

*Cập nhật guideline này mỗi khi hoàn thành một phase. Guideline UI/UX chi tiết: [`uiux-design/00-uiux-process-guideline.md`](uiux-design/00-uiux-process-guideline.md).*
