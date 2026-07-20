# Components Needed — Handoff cho Phase 5 (UI Design)

> Phase 4 → Phase 5 · 2026-07-20 · Danh sách component xuất hiện trong 3 wireframe Must-have, đối chiếu với **design system v1 đã có** (`../05-ui-design/05-design-system-v1.html`).
> Cột **Trạng thái**: ✅ đã có trong design system · 🟡 có nền, cần biến thể · 🔴 chưa có, cần thiết kế mới.

## Ghi chú ngược dòng
VietCMS **đã có design system v1 trước** (Phase 5 chạy trước Phase 4). Vì vậy nhiều component nền đã sẵn — việc còn lại chủ yếu là **các component phức tạp đặc thù CMS** (editor, block palette, SEO panel) và **áp token brand** vào wireframe để ra hi-fi mockup.

---

## 1. Component nền (đã có trong design system v1)

| Component | Trạng thái | Dùng ở màn | Ghi chú |
|---|---|---|---|
| Button (primary/secondary/ghost/AI/destructive) | ✅ | Cả 3 | AI dùng gradient violet |
| Text input / textarea / select | ✅ | Editor, Approval | Có state error/focus/disabled |
| Badge trạng thái (success/warning/info/neutral) | ✅ | Cả 3 | Nháp/Chờ duyệt/Đã xuất bản/Lưu trữ |
| Card | ✅ | Dashboard, Approval | |
| Avatar (đơn + nhóm) | ✅ | Cả 3 | Tác giả, người duyệt |
| Table (sortable, row hover) | ✅ | Dashboard | Bảng nội dung gần đây |
| Tabs | ✅ | Editor (panel), Approval (segmented) | |
| Alert / toast | ✅ | Editor (lỗi lưu), Approval | |
| Stat tile / KPI | 🟡 | Dashboard | Có mẫu trong DS, cần chuẩn hoá delta ▲/▼ |
| Empty state | 🟡 | Cả 3 | Có mẫu; cần bản cho từng ngữ cảnh |
| Toggle / checkbox / radio | ✅ | Editor (settings) | |

## 2. Component đặc thù CMS (cần thiết kế mới / mở rộng)

| Component | Trạng thái | Màn | Mô tả cần thiết kế |
|---|---|---|---|
| **Trình soạn thảo block (canvas)** | 🔴 | Editor | Block hover state, drag handle, inline edit, "+ thêm block", drop indicator |
| **Block palette** | 🔴 | Editor | Danh sách block/section kéo được; nhóm block thường + section mẫu + block AI |
| **Panel SEO (điểm SEO)** | 🔴 | Editor | Vòng/thanh điểm SEO thời gian thực + màu theo ngưỡng; danh sách gợi ý "áp một chạm" |
| **Panel Trợ lý AI** | 🟡 | Editor | Prompt box + gợi ý; dùng màu accent violet đã định nghĩa |
| **Autosave / version indicator** | 🔴 | Editor | "Đã tự lưu · Nx phút trước" + link lịch sử phiên bản |
| **Icon rail điều hướng** | 🟡 | Editor | Sidebar thu gọn dạng icon + tooltip (biến thể của side-nav) |
| **Side-nav (đầy đủ)** | 🔴 | Dashboard | Nav L1 + site switcher; chưa có trong DS v1 |
| **Site switcher** | 🔴 | Dashboard | Dropdown chuyển site (đa site — US-08) |
| **Approval action bar (mobile)** | 🔴 | Approval | Sticky bottom bar: Trả lại / Duyệt; tối ưu 1 tay |
| **Card duyệt (mobile)** | 🟡 | Approval | Biến thể card: tiêu đề + tác giả + SEO + badge |
| **Segmented control** | 🟡 | Approval | Có tabs; cần biến thể pill segmented cho mobile |
| **Chart wrapper (traffic)** | 🔴 | Dashboard | Khung biểu đồ + empty/loading; chọn thư viện chart ở dev |
| **Date range picker** | 🔴 | Dashboard | Chọn khoảng thời gian |
| **Skeleton loading** | 🟡 | Cả 3 | DS có mention; cần mẫu cho card/table/tile/editor |

## 3. Pattern / state cần chuẩn hoá ở Phase 5

- **Trạng thái nội dung** thống nhất màu + nhãn: `Bản nháp` (info/blue) · `Chờ duyệt` (warning) · `Đã xuất bản` (success) · `Đã trả lại` (neutral/đỏ nhạt) · `Lưu trữ` (neutral).
- **Điểm SEO** thang màu: <70 cảnh báo (amber) · 70–89 khá · ≥90 tốt (green).
- **Nhận diện AI:** mọi điểm chạm AI dùng accent violet (đã có token).
- **Empty / Loading / Error** cho: editor, hàng chờ duyệt, dashboard (tiles/chart/table).
- **Responsive:** editor & dashboard desktop-first; approval mobile-first (đã quyết ở Phase 4).

## 4. Việc cho Phase 5
1. Áp **design tokens brand (Blue)** vào 3 wireframe → hi-fi mockup (`05-mockup-*.html`).
2. Thiết kế 🔴 component đặc thù CMS ở trên, thêm vào component library.
3. Chuẩn hoá state matrix (mục 3) trong style guide.
4. Kiểm a11y: focus order trong editor, touch target action bar mobile, contrast badge SEO.

## Liên kết
- Wireframe: [Prototype index](04-prototype-index.html) · [Annotations](04-annotations-v1.md)
- Design system hiện có: [../05-ui-design/05-design-system-v1.html](../05-ui-design/05-design-system-v1.html) · [tokens](../05-ui-design/05-design-tokens-v1.json)
