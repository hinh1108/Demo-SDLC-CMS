# Business Case

| Trường | Nội dung |
|---|---|
| Dự án | marketing-cms-saas (VietCMS) |
| Phiên bản | v0.1 |
| Ngày | 18/06/2026 |
| Người soạn | (Business Analyst) |
| Sponsor | (chờ điền — người duyệt ngân sách) |
| Trạng thái | Draft |

## 1. Tóm tắt điều hành

Đội marketing tại doanh nghiệp vừa ở Việt Nam cần tự chủ xuất bản nội dung website nhưng đang phụ thuộc lập trình viên, gánh chi phí và độ phức tạp của WordPress/plugin, hoặc dùng nền tảng quốc tế (Wix/Webflow) không bản địa hoá và tính phí theo USD. Đề xuất xây dựng **VietCMS** — một Web/Marketing CMS dạng SaaS, no-code, tối ưu cho thị trường Việt (tiếng Việt, hiệu năng/SEO mạnh, trợ lý AI, thanh toán nội địa). **Khuyến nghị: Go**, với phạm vi MVP gọn trong ~6 tháng để xác thực product-market fit trước khi đầu tư mở rộng.

## 2. Phát biểu vấn đề / cơ hội

**Vấn đề gốc:** Biên tập viên/marketer không-kỹ-thuật không thể tự tạo và phát hành nội dung website một cách nhanh và độc lập. Mỗi thay đổi nội dung phải qua lập trình viên/agency, gây chậm trễ, tăng chi phí và làm giảm tốc độ ra thị trường của hoạt động marketing.

**Đối tượng ảnh hưởng:** trưởng phòng marketing, biên tập viên, chuyên viên SEO tại doanh nghiệp vừa; gián tiếp là đội IT (bị kéo vào việc nội dung) và ban lãnh đạo (chi phí, tốc độ).

**Chi phí của hiện trạng:**
- WordPress: miễn phí lõi nhưng TCO thực tế cao (hosting, plugin trả phí, bảo trì, vá bảo mật, cần người kỹ thuật).
- Wix/Webflow: dễ dùng hơn nhưng tính phí theo USD, hỗ trợ và thanh toán không bản địa hoá, tối ưu tiếng Việt/SEO local hạn chế.
- Phụ thuộc dev/agency: thời gian chờ mỗi lần cập nhật nội dung, chi phí thuê ngoài lặp lại.

**Cơ hội:** Khoảng trống cho một CMS bản địa hoá, no-code, chi phí tổng minh bạch và thấp, nhắm đúng phân khúc mid-market Việt — nơi nền tảng quốc tế phục vụ chưa tối ưu còn WordPress đòi hỏi năng lực kỹ thuật.

## 3. Mục tiêu nghiệp vụ (SMART)

| ID | Mục tiêu | KPI | Mục tiêu định lượng | Hạn |
|---|---|---|---|---|
| BO-01 | Ra mắt MVP đủ dùng | Trạng thái phát hành MVP | MVP công khai chạy ổn định | T+6 tháng |
| BO-02 | Chứng minh tự chủ no-code | Thời gian xuất bản trang đầu / tỷ lệ kích hoạt | < 30 phút; ≥ 70% người dùng thử xuất bản trang đầu trong 24h | T+7 tháng |
| BO-03 | Xác thực nhu cầu trả phí | Số khách hàng trả phí | ≥ 10 khách mid-market | T+9 tháng |
| BO-04 | Lợi thế chi phí & chất lượng | TCO so với đối thủ / Lighthouse | TCO thấp hơn rõ rệt WordPress-có-quản-trị & Webflow; Lighthouse ≥ 90 mobile | T+7 tháng |

## 4. Các phương án

| Phương án | Mô tả | Chi phí ước tính | Lợi ích | Rủi ro |
|---|---|---|---|---|
| **A. Giữ nguyên hiện trạng** | Khách tiếp tục dùng WordPress/Wix/Webflow hoặc thuê dev | Không đầu tư mới | Không rủi ro đầu tư | Bỏ lỡ cơ hội thị trường; vấn đề của khách vẫn còn |
| **B. Xây MVP SaaS bản địa hoá (đề xuất)** | Tự xây CMS no-code tối ưu thị trường Việt, ra MVP gọn 6 tháng | Thấp–trung bình (ngân sách hạn chế, ưu tiên dịch vụ sẵn có) | Kiểm soát sản phẩm & lộ trình; doanh thu định kỳ (MRR); khác biệt bản địa hoá | Cạnh tranh nền tảng lớn; cần đạt PMF; rủi ro chi phí AI/hạ tầng |
| **C. Tuỳ biến trên nền mã nguồn mở (Strapi/WordPress) bán dịch vụ** | Đóng gói & vận hành nền có sẵn thay vì xây từ đầu | Thấp ban đầu | Ra mắt nhanh hơn | Khó tạo khác biệt no-code/UX; phụ thuộc nền tảng gốc; biên lợi nhuận mỏng |

## 5. Phân tích chi phí – lợi ích

**Chi phí chính:** nhân sự phát triển MVP (~6 tháng), hạ tầng cloud multi-tenant, chi phí dịch vụ AI tạo nội dung, tích hợp cổng thanh toán, vận hành & hỗ trợ. Ngân sách hạn chế → ưu tiên dùng dịch vụ quản lý (managed) và nền tảng sẵn có để giảm chi phí xây dựng và thời gian.

**Lợi ích:**
- *Định lượng:* doanh thu định kỳ (MRR) từ khách trả phí; mục tiêu ≥ 10 khách hàng pilot trong 9 tháng làm cơ sở dự phóng mở rộng.
- *Định tính:* khác biệt bản địa hoá khó sao chép; tự chủ lộ trình sản phẩm; nền tảng để mở rộng (headless, đa ngôn ngữ, marketplace) ở giai đoạn sau.

**Nhận định ROI:** Ở phạm vi MVP gọn, mục tiêu chính là **xác thực product-market fit với chi phí thấp** thay vì hoàn vốn ngay. Quyết định đầu tư mở rộng (và mô hình ROI chi tiết) nên đặt ở cổng sau M4, dựa trên dữ liệu kích hoạt và chuyển đổi thực tế.

## 6. Rủi ro chính

| Rủi ro | Ảnh hưởng | Hướng xử lý | Owner |
|---|---|---|---|
| Cạnh tranh từ nền tảng lớn (WordPress, Wix, Webflow, Canva) | Cao | Tập trung khác biệt bản địa hoá + no-code + giá; nhắm thị trường ngách Việt | Sponsor/PO |
| Không đạt product-market fit | Cao | Phạm vi MVP gọn, pilot sớm, đo kích hoạt & phản hồi nhanh | PO/BA |
| Ngân sách/thời gian vượt mức | Trung bình–cao | Cắt phạm vi out-of-scope nghiêm ngặt; dùng dịch vụ managed | PM |
| Chi phí dịch vụ AI tăng theo quy mô | Trung bình | Giới hạn tính năng AI ở MVP; theo dõi đơn giá; có phương án thay thế | Tech Lead |
| Tuân thủ dữ liệu cá nhân (NĐ 13/2023) | Trung bình | Thiết kế bảo mật/đồng thuận dữ liệu từ đầu | Tech Lead/Legal |

> *Ghi chú: phạm vi tài liệu Pha 1 ở mức gọn nên rủi ro được gói trực tiếp tại đây thay vì tách Risk Log riêng; có thể tách `risk-log.csv` khi trình hội đồng đầu tư.*

## 7. Khuyến nghị

**Go / No-Go: GO (có điều kiện)** — chọn **Phương án B** với phạm vi MVP gọn. Lý do: vấn đề của khách hàng rõ ràng và tốn kém; có khoảng trống bản địa hoá thực tế; chiến lược MVP-gọn giữ chi phí thấp và cho phép xác thực PMF trước khi cam kết đầu tư lớn. *Điều kiện:* xác thực nhu cầu & mức sẵn sàng chi trả của mid-market Việt trong Pha 2 (Elicitation) trước khi mở rộng phạm vi.

## 8. Phê duyệt

| Người phê duyệt | Vai trò | Ngày |
|---|---|---|
| (chờ điền) | Sponsor | |
| (chờ điền) | Product Owner | |
