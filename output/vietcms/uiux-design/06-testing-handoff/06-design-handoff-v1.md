# Design Handoff — VietCMS · 3 màn Must-have (MVP)

> Phase 6 · v1.0 · 2026-07-20 · Bàn giao cho engineering.
> Phạm vi: **Trình soạn thảo no-code** (US-01), **Hàng chờ duyệt** (US-05/06), **Bảng điều khiển** (US-18).
> Nguyên tắc: mọi giá trị màu/spacing/type **lấy từ design tokens** — không hardcode hex.

---

## 1. Overview

| | |
|---|---|
| **Sản phẩm** | VietCMS — no-code Marketing CMS SaaS multi-tenant cho đội marketing mid-market VN |
| **Màn bàn giao** | Editor (desktop) · Approval queue (mobile) · Dashboard (desktop) |
| **User stories** | US-01, US-05, US-06, US-18 (Must). Liên quan: US-02, US-10, US-11, US-14, US-15 |
| **Personas** | Ngọc (biên tập, non-tech) · Hải (trưởng phòng, duyệt mobile) · Trang (SEO) |
| **Ngoài phạm vi bàn giao này** | E-commerce, theme marketplace, i18n ngoài VN/EN, headless API công khai, native app (theo scope §3) |

### Nguồn thiết kế (single source of truth)
| Tài nguyên | Đường dẫn |
|---|---|
| Hi-fi mockups | `../05-ui-design/05-mockup-index.html` (+ 3 file mockup) |
| **Design tokens (dev consume)** | `../05-ui-design/05-design-tokens-v1.json` |
| Design system / component library | `../05-ui-design/05-design-system-v1.html` |
| A11y audit (contrast đã verify) | `../05-ui-design/05-a11y-audit-v1.md` |
| Wireframe + annotations (states/edge case) | `../04-wireframe/04-annotations-v1.md` |
| Components checklist | `../04-wireframe/04-components-needed-v1.md` |
| IA/Sitemap · Journey | `../02-define/02-ia-sitemap-v1.html` · `../02-define/02-journey-tao-duyet-xuat-ban-v1.html` |

---

## 2. Design Tokens (nền tảng — dùng cho mọi màn)

> Import từ `05-design-tokens-v1.json`. Dưới đây là bảng tra nhanh.

### Màu
| Token | Value | Dùng cho |
|---|---|---|
| `primary-600` | #2563EB | Base nút/link, brand. White text đạt **5.17:1** ✓ |
| `primary-700` / `800` | #1D4ED8 / #1E40AF | Hover / pressed |
| `primary-50` / `100` | #EFF5FF / #DBE8FE | Nền nhạt, highlight |
| `neutral-900…50` | #0F172A … #F8FAFC | Text (900 body), border (200), surface (0/50) |
| `accent-600` | #7C3AED | **Chỉ cho tính năng AI** (violet) |
| `success/warning/error/info` | #059669 / #D97706 / #DC2626 / #2563EB | Trạng thái (kèm `-bg`, `-fg`) |

### Typography — font **Inter** (fallback system-ui). Hỗ trợ đầy đủ dấu tiếng Việt.
| Token | Size / LH / Weight | Dùng |
|---|---|---|
| `display` | 48 / 1.15 / 700 | Hero |
| `h1` | 32 / 1.25 / 700 | Tiêu đề trang |
| `h2` | 24 / 1.3 / 600 | Section |
| `h3` | 20 / 1.4 / 600 | Tiêu đề phụ |
| `h4` | 16 / 1.4 / 600 | Card title |
| `body` | 16 / 1.5 / 400 | Mặc định |
| `body-sm` | 14 / 1.5 / 400 | Phụ, label |
| `caption` | 12 / 1.4 / 400 | Meta |

### Spacing (8px grid), Radius, Shadow, Motion, Z-index, Breakpoint
- **Spacing:** 1=4 · 2=8 · 3=12 · 4=16(base) · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64.
- **Radius:** sm=6 · md=8 · lg=12 · xl=16 · full=9999. Nút/input dùng `md`; card `lg/xl`.
- **Shadow:** xs/sm/md/lg/xl (xem tokens). Card `sm`, hover `md`, overlay/modal `xl`.
- **Motion:** fast=150ms (hover/focus) · normal=250ms (enter) · slow=400ms (modal). Easing: `out` (vào), `in-out` (di chuyển), `spring` (nhấn nhá). **Honor `prefers-reduced-motion`**.
- **Z-index:** dropdown 1000 · sticky 1100 · overlay 1200 · modal 1300 · toast 1400 · tooltip 1500.
- **Breakpoint:** mobile 0 · tablet 640 · desktop 1024 · wide 1280 (max content 1280).

### Component tokens
- **Button:** height sm/md/lg = 32/40/48px; paddingX 12/16/20; radius `md`; **min touch target 44px** (mobile).
- **Input:** height 40px; paddingX 12; radius `md`; border `neutral-300`.
- **Focus ring (bắt buộc, mọi element tương tác):** `box-shadow: 0 0 0 3px rgba(37,99,235,.35)`; dùng `:focus-visible`.

---

## 3. Component Inventory (map với design system)

| Component | Trạng thái | Ghi chú build |
|---|---|---|
| Button (primary/secondary/ghost/AI/destructive) | ✅ DS | AI = gradient violet |
| Input / Textarea / Select | ✅ DS | state focus/error/disabled |
| Badge trạng thái nội dung | ✅ DS | Bảng màu chuẩn ở §7 |
| Card, Avatar, Table, Tabs, Alert/Toast | ✅ DS | |
| **Editor canvas (block)** | 🔴 mới | Hover viền, drag handle, inline edit, drop indicator |
| **Block palette** | 🔴 mới | Kéo-thả; nhóm block + section + block AI |
| **SEO score panel** (vòng SVG) | 🔴 mới | Thang màu theo ngưỡng §7 |
| **AI panel** | 🟡 | Prompt + gợi ý; accent violet |
| **Autosave/version indicator** | 🔴 mới | "Đã tự lưu · Nx phút trước" |
| **Side-nav + icon rail + site switcher** | 🔴 mới | Nav L1 theo IA |
| **KPI stat tile** (delta ▲/▼) | 🟡 | |
| **Approval action bar (mobile sticky)** | 🔴 mới | ≥48px, trong tầm ngón cái |
| **Chart wrapper** | 🔴 mới | Chọn lib (Recharts/Chart.js); có empty/loading |
| **Skeleton loading** | 🟡 | card/table/tile/editor |

---

## 4. Màn 1 — Trình soạn thảo no-code (Desktop) · US-01

**Mockup:** `05-mockup-editor-desktop-v1.html` · **Layout:** grid 4 cột `60px / 224px / 1fr / 316px` (icon rail / block palette / canvas / settings panel). Min-height 660px.

### Cấu trúc & spec
| Vùng | Spec |
|---|---|
| **Icon rail** | nền `neutral-900`; item 40×40 radius `md`; active nền `primary-600`; hover `neutral-800`; tooltip nhãn khi hover |
| **Block palette** | nền `neutral-0`; block = card `sm`, radius `md`, `body-sm`; hover → `primary-50` + dịch 2px; block AI → nền `accent-50`, chữ `accent-700` |
| **Top bar** | breadcrumb `body-sm`; badge "Bản nháp" (info); autosave indicator; nút Xem trước/Lên lịch (ghost) + **Gửi duyệt** (primary) |
| **Canvas** | max-width 740px; card radius `xl`, shadow `md`, padding 40/48; block hover → viền `primary-200` + nền `primary-50`, hiện drag handle `⣿` |
| **Settings panel** | tabs *Trang / SEO / ✨AI*; tab AI active dùng màu `accent`. SEO panel: vòng điểm SVG + fields + gợi ý AI (áp một chạm) |

### States
| State | Hành vi |
|---|---|
| **Default** | Đang soạn (như mockup) |
| **Autosave** | Định kỳ + on blur → indicator "Đang lưu…" → "Đã tự lưu · Nx phút trước" + toast thoáng |
| **Offline** (US-01 AC) | Banner "Đang ngoại tuyến — thay đổi sẽ đồng bộ khi có mạng"; **khi online lại đồng bộ, không mất dữ liệu** |
| **Lỗi lưu (server)** | Toast `error` "Không lưu được — thử lại" + nút thử lại |
| **AI đang sinh** (US-10 AC) | Skeleton trong panel AI; **AI lỗi → báo lỗi, KHÔNG trừ hạn mức AI** |
| **Empty canvas** | Placeholder "Nhấp để soạn, hoặc kéo block từ trái" + nút ＋ Thêm block |

### Interactions
- Kéo block từ palette → thả vào canvas (drop indicator giữa block). Sắp xếp lại bằng drag handle.
- Click block → inline edit (contenteditable / rich text). ＋ Thêm block mở menu chọn loại.
- Tab switching trong panel (`role="tab"`). Gợi ý AI "Áp dụng" → ghi giá trị vào field tương ứng.
- **Gửi duyệt** → set trạng thái *Chờ duyệt*, gửi thông báo Approver, điều hướng/màn xác nhận.

### Data & validation
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| Tiêu đề | text | required; cảnh báo khi rỗng lúc lưu |
| Slug | slug | **duy nhất/site**; trùng → lỗi inline + đề xuất slug khác (US-01 AC); auto-slug từ tiêu đề |
| Tiêu đề SEO | text | đếm ký tự, cảnh báo >60 |
| Meta description | text | khuyến nghị ≤160; rỗng → hạ điểm SEO |
| Nội dung block | JSON (block model) | versioned, autosave |
| **Gửi duyệt khi chưa có Approver** (US-05 AC) | — | cảnh báo "Admin cần thiết lập người duyệt", chặn gửi |

### Edge cases
- Dán từ Google Docs/Word → giữ định dạng cơ bản (heading/list/bold/link), loại style rác.
- Bài rất dài → canvas cuộn, panel phải sticky.
- Xung đột phiên bản (2 người sửa) → cảnh báo, mở lịch sử phiên bản.

---

## 5. Màn 2 — Hàng chờ duyệt (Mobile) · US-05/06

**Mockup:** `05-mockup-approval-mobile-v1.html` · **Viewport thiết kế:** 340–375px. Mobile-first.

### Cấu trúc & spec
| Vùng | Spec |
|---|---|
| **App bar** (sticky top) | tiêu đề `h4`; badge số lượng (warning); avatar 32px |
| **Segmented tabs** | Chờ duyệt / Tất cả / Đã duyệt; active nền `primary-600` chữ trắng |
| **Card bài** | card radius `lg`, shadow `sm`, padding 14; tiêu đề `body`/600; tác giả (avatar 24 + tên `body-sm`); badge trạng thái + điểm SEO; tap toàn card → chi tiết; `:active` scale .99 |
| **Chi tiết** | preview nội dung + meta; ô ghi chú; **action bar sticky bottom** |
| **Action bar** | Trả lại (destructive-outline) + Duyệt (primary); nút **cao 48px** (≥44px), full-width chia đôi |

### States (bắt buộc implement đủ)
| State | Hành vi |
|---|---|
| ① **List** | như mockup |
| ② **Detail/review** | preview + ô ghi chú + action bar |
| ③ **Success** (US-06 AC) | "Đã duyệt …" + **lưu bản ghi duyệt (ai, khi nào)**; giảm badge; về list |
| ④ **Empty** | "Tất cả đã được duyệt 🎉" |
| **Loading** | skeleton card |
| **Lỗi tải/mất mạng** | empty-error + "Thử lại" |
| **Đã trả lại** (US-06 AC) | bài về *Draft*, biên tập viên nhận phản hồi; xác nhận "Đã trả lại kèm ghi chú" |
| **Xung đột** | bài đã bị người khác xử lý → "Bài đã được xử lý" |

### Interactions & data
- **Duyệt** → POST approval {content_id, approver_id, timestamp, action: approved}. **Trả lại** → {..., action: rejected, note}. Ghi chú optional khi duyệt, **khuyến nghị khi trả lại**.
- Thao tác 1 tay: action bar trong tầm ngón cái; approve ≤ 2 chạm từ list.
- Thông báo realtime khi có bài mới vào hàng chờ (badge count cập nhật).

---

## 6. Màn 3 — Bảng điều khiển (Desktop) · US-18

**Mockup:** `05-mockup-dashboard-desktop-v1.html` · **Layout:** grid `236px / 1fr` (sidebar / main). Main padding 24/30.

### Cấu trúc & spec
| Vùng | Spec |
|---|---|
| **Sidebar** | nền `neutral-900`; brand + **site switcher** (đa site US-08) + nav L1 (active `primary-600`) + user chip đáy |
| **Head** | greeting `h1` + subtitle `body-sm` muted; date range picker; nút ＋ Tạo nội dung (primary) |
| **KPI tiles ×4** | card radius `lg`; icon 34px; value `28px/800`; **delta ▲/▼** badge (up=success-bg, down=error-bg); hover → shadow `md` + lift 2px |
| **Chart traffic** | panel; bars gradient `primary-500→200`, radius top 6; label trục X; link "Xem Phân tích" |
| **Việc cần duyệt** | list rút gọn (avatar + tiêu đề + thời gian + badge) → link Màn 2; CTA "Mở hàng chờ duyệt" |
| **Bảng nội dung gần đây** | table sortable; row hover `neutral-50`; badge trạng thái + điểm SEO; click hàng → editor |

### States
| State | Hành vi |
|---|---|
| **Default** | có dữ liệu |
| **Empty** (US-18 AC) | site mới → KPI "—", chart trạng thái trống, CTA "Tạo nội dung đầu tiên" |
| **Loading** | skeleton cho tiles + chart + table |
| **Lỗi tải số liệu** | panel báo lỗi cục bộ + thử lại (không sập cả trang) |

### Data & edge cases
- KPI: publishedCount, visits, leads, avgSeoScore + delta so kỳ trước. Date range đổi toàn dashboard.
- Delta khi kỳ trước = 0 → "mới" thay vì %.
- Quyền theo vai trò: cộng tác viên không thấy KPI nhạy cảm; Admin/Trưởng phòng full.
- Đa site → site switcher lọc toàn bộ dashboard theo site đang chọn.

---

## 7. Pattern & state chuẩn hoá (áp mọi màn)

### Badge trạng thái nội dung
| Trạng thái | Token màu | Nhãn |
|---|---|---|
| Bản nháp | info (blue) | "Bản nháp" |
| Chờ duyệt | warning (amber) | "Chờ duyệt" |
| Đã xuất bản | success (green) | "Đã xuất bản" |
| Đã trả lại | error-fg nhạt | "Đã trả lại" |
| Lưu trữ | neutral | "Lưu trữ" |

> ⚠️ Trạng thái phải truyền tải bằng **màu + chấm/icon + text** (WCAG 1.4.1) — không chỉ màu.

### Thang màu điểm SEO
| Ngưỡng | Màu |
|---|---|
| < 70 | warning (amber) — "Cần cải thiện" |
| 70–89 | neutral/primary — "Khá" |
| ≥ 90 | success (green) — "Tốt" |

### Nhận diện AI
Mọi điểm chạm AI (viết nội dung, gợi ý SEO, tạo ảnh) dùng **accent violet** — tách khỏi thao tác thủ công.

---

## 8. Accessibility (WCAG 2.1 AA — bắt buộc)

> Chi tiết + bảng contrast đã verify: `../05-ui-design/05-a11y-audit-v1.md`.

- **Contrast:** body text ≥ 4.5:1, UI/viền ≥ 3:1. Các cặp đã verify: neutral-900/white 16:1, neutral-500/white 4.8:1, white/primary-600 5.17:1, white/error 4.5:1.
- **Focus:** ring 3px `:focus-visible` ở mọi element tương tác; focus order hợp lý (đặc biệt trong editor).
- **Keyboard:** Tab tới mọi control; Enter/Space kích hoạt; Esc đóng menu/dropdown; arrow trong tabs. Không keyboard trap.
- **Touch target ≥ 44px** (mobile — nhất là action bar duyệt).
- **Semantic HTML + ARIA:** `<button>`/`<nav>`/`<main>`; `role="tab"`, `aria-selected`; input có `<label>`/`aria-label`; lỗi liên kết `aria-describedby` + `aria-invalid`; toast/validation `aria-live="polite"`.
- **`<html lang="vi">`**; heading đúng thứ bậc h1→h2→h3.
- **Motion:** honor `prefers-reduced-motion`.
- **Text resize** 200% không vỡ layout.

---

## 9. Assets & Kỹ thuật

- **Icons:** dùng SVG stroke (đã có trong mockup — nav, chart, image placeholder). Chuẩn hoá bộ icon (stroke-width 1.8, 24×24 viewBox). Đề xuất Lucide/Heroicons cho phần còn thiếu.
- **Font:** Inter (self-host `.woff2` hoặc Google Fonts) + fallback `system-ui`. Cân nhắc variable font cho hiệu năng.
- **Ảnh nội dung:** tự chuyển **WebP + phục vụ CDN** (US-02); có srcset/retina.
- **Chart lib:** đề xuất Recharts (React) hoặc Chart.js — bọc trong component có empty/loading state.
- **Public site output** (ngoài admin): SSR/static + CDN, mục tiêu **Lighthouse Performance ≥ 90 mobile** (MT-04).

### Browser/device support
- Chrome, Safari, Firefox, Edge (2 phiên bản gần nhất).
- iOS 15+ · Android 11+.
- Min viewport **320px**. Admin editor/dashboard tối ưu desktop ≥1024; duyệt tối ưu mobile.

---

## 10. Open Questions (cần chốt trước/khi build)

| # | Câu hỏi | Chủ trì |
|---|---|---|
| 1 | Block model của editor (schema JSON) — tự định nghĩa hay dùng lib (Editor.js/TipTap/Lexical)? | Tech lead |
| 2 | Realtime cho hàng chờ duyệt (WebSocket vs polling)? | Backend |
| 3 | Nhà cung cấp AI tiếng Việt + cơ chế hạn mức (quota) — API nào? | Tech lead + PM |
| 4 | Chart library thống nhất toàn hệ thống? | Frontend |
| 5 | Chuẩn hoá vai trò & ma trận quyền (Admin/Biên tập/Cộng tác viên) chi tiết tới từng màn? | PM + BA |
| 6 | Cổng thanh toán ưu tiên MVP (VNPay/MoMo/ZaloPay) — thứ tự tích hợp? | PM |
| 7 | Chiến lược versioning nội dung (số version giữ, diff) | Backend |

---

## Ghi chú bàn giao
- **Chưa có usability test** trên mockup — khuyến nghị chạy 1 round (5 user/persona) trước khi build để bắt vấn đề sớm (xem gợi ý ở dưới). Personas là **proto-persona** cần validate.
- Design system đã có sẵn **component library + tokens** → ưu tiên build design-system components trước, rồi ráp màn.
- **Cặp đôi khuyến nghị:** dùng kèm `06-design-qa-checklist` (sau khi dev xong) để verify implementation khớp design.

## Sign-off
- [ ] Designer duyệt handoff
- [ ] Tech lead xác nhận feasibility + trả lời Open Questions
- [ ] PM duyệt scope
- [ ] Sẵn sàng sprint planning
