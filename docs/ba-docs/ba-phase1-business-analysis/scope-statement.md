# Project Scope Statement

| Trường | Nội dung |
|---|---|
| Dự án | marketing-cms-saas (VietCMS) |
| Phiên bản | v0.1 |
| Ngày | 18/06/2026 |

## 1. Mục tiêu dự án (SMART)

- **MT-01:** Ra mắt **MVP** một Web/Marketing CMS dạng SaaS multi-tenant trong **6 tháng** kể từ khi khởi động, đủ để một biên tập viên không-kỹ-thuật tạo và phát hành một website nội dung hoàn chỉnh mà không cần lập trình viên.
- **MT-02:** Đạt **thời gian tự xuất bản trang đầu tiên < 30 phút** kể từ lúc người dùng mới đăng ký (đo qua onboarding analytics) tính đến hết tháng thứ 7.
- **MT-03:** Ký được **≥ 10 khách hàng trả phí (pilot/early adopter)** thuộc phân khúc doanh nghiệp vừa trong 3 tháng sau khi ra mắt MVP.
- **MT-04:** Điểm hiệu năng web (Lighthouse Performance) của trang do hệ thống xuất bản **≥ 90** trên thiết bị di động ở cấu hình mặc định.

## 2. Trong phạm vi (In-scope) — MVP

- Trình soạn thảo nội dung trực quan **no-code** (block/visual editor) cho trang và bài viết.
- Quản lý cấu trúc nội dung: trang, bài viết, danh mục, media library cơ bản.
- **Workflow tạo–duyệt–phát hành** và **phân quyền theo vai trò** (admin, biên tập, cộng tác viên).
- **Đa người dùng & đa site (multi-tenant)** ở mức cơ bản phục vụ mô hình SaaS.
- **SEO & hiệu năng tối ưu mặc định:** quản lý metadata/thẻ SEO, tự sinh sitemap, tối ưu tốc độ tải.
- **Hỗ trợ tiếng Việt đầy đủ** trên giao diện và xử lý nội dung.
- **Trợ lý AI cơ bản** hỗ trợ soạn/tối ưu/đặt lại tiêu đề nội dung tiếng Việt.
- Quản lý tài khoản, gói đăng ký và **thanh toán định kỳ** (tích hợp tối thiểu một cổng thanh toán nội địa).
- Xuất bản website công khai (public site rendering) với tên miền tuỳ chỉnh ở mức cơ bản.

## 3. Ngoài phạm vi (Out-of-scope) — KHÔNG làm trong MVP

- Tính năng thương mại điện tử/giỏ hàng/quản lý đơn hàng (không cạnh tranh trực tiếp với nền tảng bán hàng).
- Chợ giao diện/plugin của bên thứ ba (theme/plugin marketplace).
- Đa ngôn ngữ ngoài tiếng Việt & tiếng Anh (i18n đầy đủ để sau).
- Headless/API-first công khai cho lập trình viên (cân nhắc giai đoạn sau, không phải MVP).
- Tích hợp CRM/marketing automation/email marketing chuyên sâu.
- Ứng dụng di động gốc (native app) — MVP chỉ web responsive.
- A/B testing, cá nhân hoá nội dung nâng cao, phân tích nâng cao.
- Di trú dữ liệu tự động từ WordPress/Wix (chỉ hỗ trợ nhập thủ công/CSV cơ bản nếu kịp).

## 4. Deliverable chính

| Deliverable | Mô tả | Người nhận |
|---|---|---|
| Ứng dụng SaaS MVP | Nền tảng CMS multi-tenant chạy được, gồm các tính năng in-scope | Khách hàng pilot, đội vận hành |
| Trang quản trị (Admin/Editor) | Giao diện soạn thảo, duyệt, phân quyền | Biên tập viên, trưởng phòng marketing |
| Cổng đăng ký & thanh toán | Đăng ký gói, thanh toán định kỳ nội địa | Khách hàng, bộ phận kinh doanh |
| Tài liệu hướng dẫn & onboarding | Hướng dẫn người dùng tự xuất bản | Khách hàng mới |

## 5. Mốc lớn (Milestones)

| Mốc | Ngày dự kiến |
|---|---|
| M0 — Phê duyệt Pha 1 (Vision/Scope/Business Case) | 06/2026 |
| M1 — Hoàn tất elicitation & đặc tả yêu cầu (Pha 2–3) | 08/2026 |
| M2 — Bản alpha nội bộ (soạn thảo + phát hành cơ bản) | 10/2026 |
| M3 — Bản beta với khách hàng pilot | 11/2026 |
| M4 — Ra mắt MVP công khai | 12/2026 |

## 6. Tiêu chí chấp nhận dự án

Dự án MVP coi là thành công khi: (1) một biên tập viên không-kỹ-thuật hoàn tất tạo và phát hành website nội dung mà không cần dev; (2) đạt MT-01 đến MT-04; (3) hệ thống vận hành ổn định cho nhiều khách hàng (multi-tenant) với thanh toán định kỳ hoạt động đúng.

## 7. Giả định & Ràng buộc

**Giả định:**
- Có nhu cầu thị trường rõ rệt ở phân khúc mid-market Việt cho một CMS bản địa hoá, giá thấp hơn (cần xác thực ở Pha 2).
- Đội ngũ có đủ năng lực kỹ thuật xây nền tảng multi-tenant trong khung thời gian đề ra.
- Có thể tích hợp ít nhất một cổng thanh toán nội địa trong thời gian MVP.
- Dịch vụ AI (tạo nội dung tiếng Việt) khả dụng với chi phí chấp nhận được ở quy mô MVP.

**Ràng buộc:**
- **Ngân sách hạn chế** → ưu tiên phạm vi tối thiểu, dùng dịch vụ/hạ tầng sẵn có thay vì tự xây.
- **Thời gian:** MVP trong ~6 tháng.
- **Công nghệ:** kiến trúc multi-tenant, đảm bảo hiệu năng/SEO mặc định.
- **Pháp lý:** tuân thủ quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP) khi lưu trữ dữ liệu khách hàng.
