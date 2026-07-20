# Annotations — VietCMS Wireframe v1 (3 màn Must-have)

> Phase 4 · Mid-fi · 2026-07-20 · Mô tả hành vi, validation, states & edge case đi kèm wireframe. Bàn giao cho dev review + Phase 5.

---

## Màn 1 — Trình soạn thảo no-code (Desktop) · US-01

### Component & hành vi
1. **Icon rail (trái):** điều hướng L1 theo IA. Active = "Nội dung". Hover hiện tooltip nhãn.
2. **Block palette:** kéo block/section vào canvas. `⠿` = drag handle. Khối AI (violet) = chèn nội dung do AI sinh.
3. **Canvas block:** hover hiện viền + handle kéo sắp xếp. Click để sửa inline (WYSIWYG). Nút **＋ Thêm block** mở menu block.
4. **Autosave:** tự lưu định kỳ + khi blur; hiển thị "☁ Đã tự lưu · 2 phút trước". Link **Lịch sử phiên bản** mở danh sách version.
5. **Panel phải (tabs):** *Trang* (slug, ảnh đại diện, danh mục) · *SEO* (điểm SEO, title, meta, gợi ý AI) · *AI* (prompt viết nội dung).
6. **Điểm SEO:** cập nhật thời gian thực theo nội dung; màu cảnh báo khi <70. Gợi ý AI **áp dụng một chạm**.
7. **Nút "Gửi duyệt":** chuyển bài sang trạng thái *Chờ duyệt*, thông báo cho Approver → điều hướng sang Màn 2.

### Validation
- **Slug trùng** → báo lỗi inline + đề xuất slug khác (US-01 AC). Chặn lưu tới khi sửa.
- **Title SEO** đếm ký tự, cảnh báo khi >60.
- **Gửi duyệt** khi chưa cấu hình Approver → cảnh báo "Admin cần thiết lập người duyệt" (US-05 AC).

### States
- **Default:** đang soạn (như wireframe).
- **Offline/mất mạng:** banner "Đang ngoại tuyến — thay đổi sẽ đồng bộ khi có mạng"; khi online lại → sync bản nháp, **không mất dữ liệu** (US-01 AC).
- **Đang lưu:** indicator "Đang lưu…".
- **Lỗi lưu (server):** toast đỏ "Không lưu được — thử lại" + nút thử lại.
- **AI đang sinh:** skeleton trong panel AI; nếu **AI lỗi → báo lỗi, không trừ hạn mức** (US-10 AC).

### Edge case
- Bài rất dài → canvas cuộn, panel phải sticky.
- Dán từ Google Docs → giữ định dạng cơ bản (heading/list/bold), loại style rác.

---

## Màn 2 — Hàng chờ duyệt (Mobile) · US-05/06

### Component & hành vi
1. **App bar:** tiêu đề "Chờ duyệt" + badge số lượng + avatar người dùng.
2. **Segmented tabs:** Chờ duyệt / Tất cả / Đã duyệt.
3. **Card bài:** tiêu đề, tác giả (avatar + tên), thời gian, badge trạng thái, điểm SEO. Tap toàn card → chi tiết.
4. **Màn chi tiết:** preview nội dung + meta; **ô ghi chú** (dùng khi trả lại); **action bar sticky** đáy: *Trả lại* (đỏ, viền) + *Duyệt* (primary).
5. **Duyệt** → lưu bản ghi duyệt (ai, khi nào) → success → giảm badge, quay lại list (US-06 AC).
6. **Trả lại** → yêu cầu/không bắt buộc ghi chú → bài về *Draft*, biên tập viên nhận phản hồi (US-06 AC).

### States (đã vẽ ①–④)
- ① **List (default)** · ② **Detail/review** · ③ **Success** · ④ **Empty** ("Không có bài chờ duyệt 🎉").
- **Còn thiếu (cần dựng khi hi-fi/build):**
  - **Loading:** skeleton card khi tải list.
  - **Lỗi tải / mất mạng:** empty-error + nút "Thử lại".
  - **Đã trả lại:** xác nhận "Đã trả lại kèm ghi chú" + bài rời khỏi hàng chờ.
  - **Xung đột:** bài đã bị người khác duyệt → thông báo "Bài đã được xử lý".

### Nguyên tắc mobile
- Thao tác **1 tay**: action bar trong tầm ngón cái. Approve ≤ 2 chạm từ list.
- Touch target ≥ 44px (áp ở Phase 5).

---

## Màn 3 — Bảng điều khiển (Desktop) · US-18

### Component & hành vi
1. **Sidebar** (IA L1) + **site switcher** (đa site — US-08) ở đầu.
2. **KPI tiles (×4):** Bài viết xuất bản · Traffic · Lead · Điểm SEO TB; mỗi tile có delta ▲/▼ so với kỳ trước. **Date range** đổi toàn dashboard.
3. **Biểu đồ traffic:** click "Xem Phân tích" → mục Phân tích.
4. **"Việc cần duyệt của tôi":** danh sách rút gọn → link sang Màn 2 (hàng chờ duyệt).
5. **Bảng nội dung gần đây:** tiêu đề, tác giả, trạng thái (badge), SEO, cập nhật; click hàng → mở editor.
6. **Nút "＋ Tạo nội dung"** → mở Màn 1 (editor).

### States
- **Default:** có dữ liệu (như wireframe).
- **Empty (site mới, chưa dữ liệu):** KPI hiển thị "—", chart trạng thái trống, CTA "Tạo nội dung đầu tiên" (US-18 AC "chưa đủ dữ liệu → empty kèm hướng dẫn").
- **Loading:** skeleton cho tiles + chart + bảng.
- **Lỗi tải số liệu:** panel báo lỗi cục bộ + thử lại (không sập cả trang).

### Edge case
- Delta khi kỳ trước = 0 → hiển thị "mới" thay vì %.
- Nhiều site → switcher; quyền theo vai trò (cộng tác viên không thấy KPI tài chính).

---

## Luồng liên kết (clickable)
```
Dashboard ──＋Tạo nội dung──▶ Editor ──Gửi duyệt──▶ Approval(mobile) ──✓Duyệt──▶ Success
    ▲                                                     │
    └──────────────── Việc cần duyệt ────────────────────┘
```

## Truy vết
- Personas: [Ngọc](../02-define/02-persona-bien-tap-vien-v1.md) · [Hải](../02-define/02-persona-truong-phong-marketing-v1.md) · [Trang](../02-define/02-persona-chuyen-vien-seo-v1.md)
- IA: [02-ia-sitemap-v1.html](../02-define/02-ia-sitemap-v1.html) · Journey: [02-journey…](../02-define/02-journey-tao-duyet-xuat-ban-v1.html)
- User stories: `docs/ba-docs/ba-phase3-requirements-design/user-stories.md`
