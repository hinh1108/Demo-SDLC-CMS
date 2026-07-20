# UI/UX Design Process — Guideline tổng thể

> Dự án: **VietCMS** (no-code Marketing CMS SaaS cho đội marketing mid-market Việt)
> Ngày: 2026-07-20 · Phiên bản: v1.0
> Tài liệu này mô tả **toàn bộ 6 phase** của quy trình thiết kế UI/UX, mỗi phase dùng **skill** nào, cho ra **deliverable** gì, và lưu ở **thư mục** nào.

---

## 1. Tổng quan — 6 phase, 6 skill

Quy trình đi tuyến tính nhưng **lặp** (iterate) khi cần. Mỗi phase lấy output của phase trước làm input.

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  PHASE 1     │──▶│  PHASE 2     │──▶│  PHASE 3     │──▶│  PHASE 4     │──▶│  PHASE 5     │──▶│  PHASE 6     │
│  Research    │   │  Define      │   │  Ideation    │   │  Wireframe   │   │  UI Design   │   │  Testing &   │
│  & Discovery │   │  & Analyze   │   │  & Sketching │   │  & Prototype │   │  System      │   │  Handoff     │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
  ux-research        ux-define          ux-ideation        ux-wireframe       ui-design-system   ux-testing-handoff
  01-research        02-define          03-ideation        04-wireframe       05-ui-design       06-testing-handoff
       │                                                                                               │
       └───────────────────────────────◀── iterate dựa trên kết quả test ──────────────────────────────┘
```

| # | Phase | Skill | Câu hỏi cốt lõi | Output folder |
|---|---|---|---|---|
| 1 | **Research & Discovery** | `ux-research` | Người dùng là ai? Đau ở đâu? Thị trường ra sao? | `01-research/` |
| 2 | **Define & Analyze** | `ux-define` | Ta giải quyết vấn đề gì, cho ai? | `02-define/` |
| 3 | **Ideation & Sketching** | `ux-ideation` | Có những cách nào? Chọn hướng nào? | `03-ideation/` |
| 4 | **Wireframe & Prototype** | `ux-wireframe` | Bố cục & luồng từng màn thế nào? | `04-wireframe/` |
| 5 | **UI Design & Design System** | `ui-design-system` | Trông ra sao? Hệ thống visual nào? | `05-ui-design/` |
| 6 | **Testing & Handoff** | `ux-testing-handoff` | Có dùng được không? Bàn giao dev thế nào? | `06-testing-handoff/` |

**Gốc lưu trữ chung:** `output/vietcms/uiux-design/`

---

## 2. Chi tiết từng phase

### Phase 1 — Research & Discovery · `ux-research`
> Pha quan trọng nhất: mọi quyết định sau đều dựa vào hiểu biết thu được ở đây.

- **Mục đích:** hiểu người dùng, thị trường, bối cảnh kinh doanh trước khi thiết kế.
- **Kích hoạt khi:** "nghiên cứu người dùng", "phỏng vấn", "khảo sát", "phân tích đối thủ", "tôi muốn hiểu người dùng của tôi".
- **Deliverable tiêu biểu:** research plan, interview guide, survey/screener, competitive matrix, heuristic evaluation, research synthesis (insights + pain points).
- **Output:** `01-research/` — vd `01-research-plan-v1.md`, `01-interview-guide-editor-v1.md`, `01-competitive-matrix-v1.md`.
- **Input sẵn có của VietCMS:** đã có nhiều dữ liệu ở `docs/ba-docs/` (product vision, BRD, competitor analysis, personas ngầm) → có thể tái sử dụng.

### Phase 2 — Define & Analyze · `ux-define`
> Chuyển từ *hiểu* sang *định hướng* — đóng khung problem space.

- **Mục đích:** biến insight thành artifact định hướng mà cả team tham chiếu được.
- **Kích hoạt khi:** "persona", "chân dung người dùng", "journey map", "kiến trúc thông tin", "sitemap", "design brief", "JTBD", "problem statement".
- **Deliverable tiêu biểu:** user persona, empathy map, user journey map, information architecture / sitemap, problem statement, value proposition canvas.
- **Output:** `02-define/` — vd `02-persona-bien-tap-vien-v1.md`, `02-journey-tao-xuat-ban-v1.html`, `02-ia-sitemap-v1.html`.

### Phase 3 — Ideation & Sketching · `ux-ideation`
> Nguyên tắc: **Quantity → Quality**. Generate nhiều, rồi loại bỏ.

- **Mục đích:** đề xuất nhiều giải pháp cho problem statement, chọn 1–2 hướng tốt nhất.
- **Kích hoạt khi:** "ý tưởng", "brainstorm", "user flow", "How Might We / HMW", "crazy 8", "design sprint", "concept selection".
- **Deliverable tiêu biểu:** HMW statements, concepts, Crazy 8s, user/task flow, storyboard, prioritization matrix, selected concepts.
- **Output:** `03-ideation/` — vd `03-hmw-statements-v1.md`, `03-userflow-xuat-ban-v1.html`, `03-selected-concepts-v1.md`.

### Phase 4 — Wireframe & Prototype · `ux-wireframe`
> Xác nhận **luồng + content hierarchy** trước khi đầu tư vào visual.

- **Mục đích:** chuyển concept thành bố cục cụ thể từng màn — chưa màu sắc/branding.
- **Kích hoạt khi:** "wireframe", "khung sườn", "prototype", "mockup", "lo-fi/mid-fi", "clickable prototype", "xem thử trông thế nào".
- **Deliverable tiêu biểu:** HTML wireframes (mở browser, click được), annotation spec, **`04-components-needed`** (danh sách component → bàn giao cho Phase 5).
- **Output:** `04-wireframe/` — vd `04-wireframe-dashboard-desktop-v1.html`, `04-prototype-index.html`, `04-components-needed-v1.md`.

### Phase 5 — UI Design & Design System · `ui-design-system`  ✅ ĐÃ LÀM
> Pha "đẹp" — nhưng đẹp phải có hệ thống.

- **Mục đích:** chuyển wireframe thành visual hoàn chỉnh + xây design system tái sử dụng.
- **Kích hoạt khi:** "design system", "bảng màu", "typography", "component library", "design tokens", "hi-fi mockup", "accessibility/WCAG", "dark mode".
- **Deliverable tiêu biểu:** living style guide (HTML), color system, typography, component library, design tokens (JSON), hi-fi mockup, a11y audit, responsive/motion spec.
- **Output:** `05-ui-design/` — VietCMS đã có: `05-design-system-v1.html`, `05-design-tokens-v1.json`, `05-a11y-audit-v1.md`.

### Phase 6 — Testing & Handoff · `ux-testing-handoff`
> Nơi nhiều dự án thất bại: "đẹp trong Figma" nhưng vỡ lúc release.

- **Mục đích:** validate với user thật + bàn giao dev không mất chi tiết + iterate theo data.
- **Kích hoạt khi:** "usability test", "A/B test", "design handoff", "design QA", "test plan", "post-launch review".
- **Deliverable tiêu biểu:** usability test plan/script/screener, session notes, test findings, design handoff spec, A/B test setup, design QA checklist.
- **Output:** `06-testing-handoff/` — vd `06-usability-test-plan-v1.md`, `06-handoff-spec-v1.md`, `06-test-findings-round1.md`.

---

## 3. Quy ước dùng chung (mọi phase)

- **Thư mục:** `output/vietcms/uiux-design/0N-<phase>/` — số thứ tự cố định theo phase.
- **Đặt tên file:** `[N]-[type]-[scope]-v[version].[ext]` — vd `05-design-tokens-v1.json`.
- **Versioning:** tăng `v1 → v2` khi iterate; giữ bản cũ để so sánh.
- **Ngôn ngữ:** nội dung tiếng Việt (đúng đối tượng VietCMS); token/code giữ tiếng Anh.
- **Định dạng:** tài liệu = `.md`; artifact xem-được = `.html`; dữ liệu cho dev = `.json`.
- **Kế thừa:** mỗi phase đọc output phase trước làm input — không bắt đầu từ số 0.

---

## 4. Tình trạng hiện tại của VietCMS

| Phase | Skill | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 · Research | `ux-research` | ⬜ Chưa (có sẵn BA docs) | Dữ liệu nền nằm ở `docs/ba-docs/` — nên chắt lọc thành research synthesis |
| 2 · Define | `ux-define` | ✅ **Xong (v1)** | 3 persona + journey + IA/sitemap + problem statement (từ BA docs) |
| 3 · Ideation | `ux-ideation` | ⬜ Chưa | Chưa có user flow / concept |
| 4 · Wireframe | `ux-wireframe` | ✅ **Xong (v1)** | 3 màn Must-have (Editor, Duyệt-mobile, Dashboard) mid-fi + prototype + annotations + components-needed |
| 5 · UI Design | `ui-design-system` | ✅ **Xong (v1)** | Design system + tokens + a11y audit + **hi-fi mockup 3 màn** (editor, duyệt-mobile, dashboard) |
| 6 · Testing/Handoff | `ux-testing-handoff` | 🟡 **Một phần** | Design handoff spec (3 màn) ✅ · usability test / QA checklist chưa làm |

> ⚠️ **Lưu ý quy trình:** Design system (Phase 5) đã được xây **trước** wireframe (Phase 4) — hợp lệ vì nó là nền tảng visual, nhưng lý tưởng nên bổ sung Phase 1→4 để mockup bám đúng nhu cầu người dùng đã được validate.

### Đề xuất bước tiếp theo cho VietCMS
1. **Nhanh (tận dụng BA docs):** chạy `ux-define` để dựng persona + journey + sitemap từ `docs/ba-docs/`, rồi `ux-wireframe` cho các màn chính (Dashboard bài viết, Trình soạn thảo, Duyệt/Workflow).
2. **Sau đó:** áp design system v1 vào wireframe → hi-fi mockup (quay lại `ui-design-system` phần mockup).
3. **Cuối:** `ux-testing-handoff` để test với biên tập viên thật + bàn giao dev.

---

## 5. Cách gọi skill

Trong Claude Code, gõ lệnh slash tương ứng, ví dụ:

```
/ux-research          → Phase 1
/ux-define            → Phase 2
/ux-ideation          → Phase 3
/ux-wireframe         → Phase 4
/ui-design-system     → Phase 5  (đã dùng)
/ux-testing-handoff   → Phase 6
```

Hoặc chỉ cần mô tả nhu cầu bằng tiếng Việt (vd "tôi muốn dựng persona cho biên tập viên") — skill sẽ tự kích hoạt theo từ khoá.
