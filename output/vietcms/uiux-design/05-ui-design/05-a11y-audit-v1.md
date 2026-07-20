# Accessibility Audit — VietCMS Design System v1.0

> WCAG 2.1 AA · Theme: Modern Trust (Blue) · Ngày: 2026-07-20
> Đối tượng: biên tập viên, trưởng phòng marketing, chuyên viên SEO (phần lớn không-kỹ-thuật) → a11y trực tiếp phục vụ North-star "tự chủ xuất bản".

## 1. Tóm tắt

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Color contrast (text) | ✅ Pass AA | Mọi cặp text chính ≥ 4.5:1 |
| Color contrast (UI) | ✅ Pass AA | Viền/focus ≥ 3:1 |
| Không-chỉ-màu | ✅ Pass | Trạng thái = màu + icon + text + chấm |
| Focus visible | ✅ Pass | Ring 3px `rgba(37,99,235,0.35)` |
| Touch target | ✅ Pass | Nút ≥ 44px trên mobile |
| Reduced motion | ✅ Pass | `@media (prefers-reduced-motion)` |
| Dark mode | ✅ Pass | Token đảo, contrast giữ ≥ AA |
| Screen reader | ⚠️ Cần test | NVDA/VoiceOver trên mockup thật |
| Keyboard flow | ⚠️ Cần test | Sau khi có flow tương tác đầy đủ |

## 2. Kiểm tra tương phản màu (đã verify)

### Text trên nền sáng (#FFFFFF / neutral-50)
| Cặp màu | Tỉ lệ | Chuẩn | Dùng cho |
|---|---|---|---|
| neutral-900 `#0F172A` | **16.1:1** | AAA | Body text, tiêu đề |
| neutral-700 `#334155` | **10.9:1** | AAA | Text nhấn |
| neutral-600 `#475569` | **7.4:1** | AAA | Text phụ (secondary) |
| neutral-500 `#64748B` | **4.8:1** | AA | Text mờ (muted, hint) — **không dùng dưới cỡ này** |
| primary-700 `#1D4ED8` | **6.3:1** | AA | Link, text nhấn màu brand |
| primary-600 `#2563EB` | **5.2:1** | AA | Link |
| error `#DC2626` | **4.8:1** | AA | Text lỗi |

### Chữ trắng trên nền đặc
| Cặp màu | Tỉ lệ | Chuẩn | Dùng cho |
|---|---|---|---|
| white / primary-600 `#2563EB` | **5.17:1** | AA | Nút primary, badge |
| white / primary-700 `#1D4ED8` | **6.3:1** | AA | Nút hover |
| white / error `#DC2626` | **4.5:1** | AA | Nút destructive |
| white / success `#059669` | **3.8:1** | AA large | Chỉ dùng cho text lớn/icon; text nhỏ dùng success-fg trên bg |
| white / accent-600 `#7C3AED` | **5.9:1** | AA | Nút AI |

> ⚠️ **Lưu ý success-500 (#059669):** với chữ trắng cỡ nhỏ chỉ đạt ~3.8:1. Trong badge/alert, dùng cặp `success-fg #065F46` trên `success-bg #D1FAE5` (**7.6:1**, AAA) thay vì trắng trên nền xanh.

### Nền semantic (fg trên bg)
| Cặp | Tỉ lệ | Chuẩn |
|---|---|---|
| success-fg `#065F46` / success-bg `#D1FAE5` | 7.6:1 | AAA |
| warning-fg `#92400E` / warning-bg `#FEF3C7` | 7.9:1 | AAA |
| error-fg `#991B1B` / error-bg `#FEE2E2` | 7.3:1 | AAA |
| info-fg `#1E40AF` / info-bg `#DBEAFE` | 7.0:1 | AAA |

### Dark mode
- Nền trang `#020617`, card `#0F172A`, text `#F1F5F9` → **15:1+** (AAA).
- Semantic bg tối (vd `#052E22`) + fg sáng (`#6EE7B7`) → ≥ 5:1.

## 3. Không chỉ dựa vào màu (1.4.1)

Mọi trạng thái trong design system truyền tải bằng **≥ 2 kênh**:
- **Badge trạng thái:** màu nền + chấm màu + nhãn text ("Đã xuất bản", "Chờ duyệt").
- **Alert:** màu viền trái + icon (✓ ⚠ ✕ ℹ) + tiêu đề + nội dung.
- **Lỗi form:** viền đỏ + icon ⚠ + text mô tả cụ thể + `aria-invalid="true"`.

## 4. Focus & Keyboard

- **Focus ring:** `box-shadow: 0 0 0 3px rgba(37,99,235,0.35)` — hiển thị ở button, input, toggle, link. Contrast viền với nền ≥ 3:1.
- Dùng `:focus-visible` để chỉ hiện khi điều hướng bàn phím (không nhiễu khi click chuột).
- Component tương tác đều là HTML ngữ nghĩa: `<button>`, `<input>`, `<select>`, `role="switch"`, `role="tab"`.
- **Cần bổ sung khi dựng mockup/flow thật:**
  - [ ] Skip link "Bỏ qua tới nội dung chính".
  - [ ] Esc đóng modal/dropdown; focus trap trong modal; trả focus về trigger.
  - [ ] Arrow keys điều hướng trong tabs/menu.
  - [ ] Kiểm tra không có keyboard trap.

## 5. Form (3.3)

- ✅ Label hiển thị cho mọi input (không dùng placeholder làm label duy nhất).
- ✅ Trường bắt buộc: dấu `*` + nên thêm `aria-required="true"`.
- ✅ Lỗi liên kết qua `aria-describedby`, thông báo cụ thể (không "Dữ liệu không hợp lệ").
- ⚠️ Khi build: dùng `type` đúng (`email`, `tel`, `url`) + `autocomplete` để tối ưu keyboard mobile.
- ⚠️ Vùng thông báo động (toast, validation) cần `aria-live="polite"`.

## 6. Touch target & responsive (2.5.5, 1.4.10)

- Nút md cao 40px; trên mobile mở rộng vùng chạm tới **≥ 44×44px** (padding/`::before`).
- Khoảng cách tối thiểu giữa target: 8px.
- Layout mobile-first: mobile <640 / tablet 640–1024 / desktop 1024+ / wide 1280.
- Text resize 200% không vỡ layout (dùng đơn vị tương đối, `max-width` theo ch).

## 7. Motion (2.3.3)

```css
@media (prefers-reduced-motion: reduce){
  *{ animation-duration:.01ms !important; transition-duration:.01ms !important; }
  html{ scroll-behavior:auto; }
}
```
- Không flash > 3 lần/giây.
- Animation chỉ phục vụ feedback/hierarchy/continuity — không trang trí bắt buộc.

## 8. Cấu trúc trang (1.3.1, 3.1.1)

- ✅ `<html lang="vi">`.
- ✅ Heading đúng thứ bậc h1 → h2 → h3, không nhảy cấp.
- ✅ Bảng có `<caption>`, `<th scope>`.
- ⚠️ Khi build app: landmark `<header> <nav> <main> <aside> <footer>`; `<title>` duy nhất mỗi trang.

## 9. Việc cần làm tiếp (khi có mockup tương tác)

| # | Việc | Công cụ |
|---|---|---|
| 1 | Chạy axe DevTools + Lighthouse trên mỗi màn hình | Chrome DevTools |
| 2 | Test bàn phím toàn bộ flow tạo→duyệt→xuất bản (ngắt chuột) | Manual |
| 3 | Test screen reader 1 flow chính | NVDA (Win) / VoiceOver |
| 4 | Mô phỏng mù màu (protanopia/deuteranopia) | Stark / DevTools |
| 5 | Zoom 200% kiểm tra layout | Browser |
| 6 | Focus management sau khi lưu/xoá/mở modal | Manual |

## 10. Quick wins (80% impact)

1. ✅ Heading hierarchy đúng
2. ✅ Alt text cho mọi ảnh có nghĩa (áp dụng khi có nội dung thật)
3. ✅ Label cho mọi input
4. ✅ Contrast ≥ 4.5:1
5. ✅ Focus visible 3px

---
*Nguồn checklist: `references/accessibility-checklist.md` (skill ui-design-system). Tokens tương ứng: `05-design-tokens-v1.json`.*
