# Persona — Trưởng phòng Marketing (Approver + Buyer + Admin) · "Hải"

> ⚠️ **Proto-persona (assumption-based).** Dựng từ `docs/ba-docs/`; chưa qua phỏng vấn thật — cần validate.
>
> 🎯 **Persona kép quan trọng:** Hải vừa là **người dùng** (duyệt nội dung, xem báo cáo) vừa là **người quyết định mua & trả tiền** (chọn công cụ, ngân sách) vừa thường là **Admin** (mời người dùng, gán vai trò). Là "kinh tế của deal" — sản phẩm phải thuyết phục cả về công việc lẫn TCO.

---

## Ảnh chân dung

| | |
|---|---|
| **Tên** | Trần Minh Hải |
| **Tuổi / Vai trò** | 35 · Trưởng phòng Marketing |
| **Bối cảnh** | Quản lý đội 6 người (content, SEO, thiết kế, chạy ads), chịu KPI tăng trưởng traffic & lead |
| **Trình độ kỹ thuật** | Trung bình — hiểu marketing/analytics, **không code**; đủ để đánh giá công cụ nhưng không tự vận hành kỹ thuật |
| **Thiết bị** | Laptop + điện thoại (duyệt bài & xem dashboard khi di chuyển) |

> 💬 *"Mỗi tháng mình trả tiền hosting, mấy cái plugin, rồi thi thoảng thuê dev sửa — cộng lại chả biết bao nhiêu. Mình cần một con số cố định và nội dung cứ thế mà lên."*

---

## Mục tiêu (Goals)

1. **Kiểm soát chất lượng** nội dung trước khi lên site (duyệt/trả lại kèm ghi chú).
2. **Chi phí dự đoán được, thấp** — một con số VND/tháng, không phát sinh plugin/dev.
3. Nhìn được **hiệu quả** (traffic, SEO, chuyển đổi) để báo cáo ban lãnh đạo.
4. Quản lý **ai được làm gì** — phân quyền rõ ràng, an toàn.

## Động lực (Motivations)

- Đạt KPI mà **không phình đội kỹ thuật** hay ngân sách.
- Muốn đội tự chủ để mình **tập trung vào chiến lược**, không sa lầy vận hành.
- Tránh rủi ro: site bị hack (WordPress), vượt ngân sách, mất kiểm soát phiên bản.

## Điểm đau (Pain Points) — truy vết BA docs

| Pain | Mô tả | Nguồn |
|---|---|---|
| **TCO cao & khó dự đoán** | Hosting + plugin + công dev cộng dồn, khó lập ngân sách | P5 |
| **Duyệt/cộng tác rời rạc** | Duyệt qua chat/email, khó truy vết ai duyệt, khi nào | P8 |
| **Công cụ phân mảnh** | Builder, SEO, analytics, form mỗi thứ một nơi → dữ liệu phân mảnh | P6 |
| **Gánh nặng bảo mật/bảo trì** | Lo WordPress bị tấn công, phải nhớ cập nhật/vá | P2 |
| **Rủi ro tăng giá gia hạn** | Nền tảng quốc tế tăng phí khi gia hạn, tính USD | P7 / competitor insight #8 |

## Hành vi & thói quen

- Duyệt nội dung **xen kẽ trong ngày**, thường trên điện thoại → cần luồng duyệt nhanh, gọn.
- Xem **GA4 / Search Console** hàng tuần, tổng hợp thủ công thành báo cáo.
- Nhạy cảm giá, so sánh kỹ TCO giữa các lựa chọn trước khi quyết.
- Là người **mời thành viên mới** vào công cụ, phân vai trò.

## Nhu cầu với sản phẩm (mapping User Stories)

| Nhu cầu | User Story |
|---|---|
| Duyệt/trả lại nội dung kèm ghi chú, có bản ghi duyệt | **US-06 (Must)** |
| Mời người dùng & gán vai trò (theo seat) | **US-07 (Must)** |
| Dashboard traffic/SEO/chuyển đổi | US-18 (Should) |
| Chọn gói & thanh toán định kỳ qua cổng VN | **US-19 (Must)** |
| Gói Free thật + giá VND minh bạch, không tăng bất ngờ | US-20 (Should) |
| Quản lý nhiều site trong 1 workspace | US-08 (Could) |

## Kịch bản tiêu biểu (Scenario)

> Đang họp, Hải nhận thông báo "Ngọc gửi bài chờ duyệt". Anh mở trên điện thoại, đọc, thấy **điểm SEO 68** → trả lại kèm ghi chú *"bổ sung meta description"*. Chiều, bài được sửa và duyệt lại — anh **Approve**, hệ thống lưu ai duyệt, lúc nào. Cuối tuần, anh mở **dashboard** xem traffic tháng tăng 12%, xuất báo cáo cho sếp. Tất cả trong một nền tảng, một hoá đơn VND cố định.

## Hàm ý thiết kế (Design Implications)

- **Luồng duyệt phải tối ưu mobile** — đọc, comment, approve/reject trong vài chạm.
- Trạng thái duyệt + **audit trail** (ai, khi nào) hiển thị rõ.
- **Dashboard tổng quan** là màn hình chính của Hải (khác với Ngọc là editor).
- Trang **gói & thanh toán** phải minh bạch giá VND, không "chữ nhỏ", nhấn mạnh "không phí ẩn / không tăng gia hạn".
- Màn **quản lý người dùng & vai trò** rõ ràng, an toàn, chống nhầm quyền.

## Liên kết
- IA/Sitemap: [02-ia-sitemap-v1.html](02-ia-sitemap-v1.html)
- Problem statement: [02-problem-statement-v1.md](02-problem-statement-v1.md)
- Persona liên quan: [Biên tập viên "Ngọc"](02-persona-bien-tap-vien-v1.md) (người gửi bài), [Chuyên viên SEO "Trang"](02-persona-chuyen-vien-seo-v1.md)
