# User Stories + Acceptance Criteria + MoSCoW — marketing-cms-saas (VietCMS)

**Dự án:** marketing-cms-saas · **Ngày:** 18/06/2026 · **Phiên bản:** v0.1
**Quy ước:** US-<số>. MoSCoW: Must (MVP bắt buộc) · Should (quan trọng) · Could (nếu kịp) · Won't-this-time (bản sau). Mỗi story truy vết FR/UC.

> Ánh xạ MoSCoW ↔ ưu tiên BRD: Must = ưu tiên 1; Should = ưu tiên 2; Could = ưu tiên 3–4; Won't-this-time = ưu tiên 5. (Xử lý CONFLICT-01: giữ phạm vi MVP gọn.)

---

## Epic 1 — Soạn thảo & quản lý nội dung

### US-01 (Must) `UC-01, FR-G-001/002`
**Là** biên tập viên, **tôi muốn** tạo và dàn trang bằng trình kéo-thả no-code **để** tự xuất bản nội dung không cần lập trình viên.
- **Given** tôi đã đăng nhập và chọn site, **When** tôi tạo trang mới và kéo các block vào, **Then** nội dung hiển thị đúng bố cục và được tự lưu thành bản nháp có phiên bản.
- **Given** tôi đặt slug đã tồn tại, **When** tôi lưu, **Then** hệ thống báo lỗi và đề xuất slug khác.
- **Given** mất kết nối khi đang soạn, **When** mạng trở lại, **Then** bản nháp được đồng bộ không mất dữ liệu.

### US-02 (Should) `FR-G-003`
**Là** biên tập viên, **tôi muốn** quản lý thư viện media **để** tái sử dụng ảnh/video.
- **Given** tôi tải ảnh lên, **When** vượt dung lượng cho phép, **Then** hệ thống báo lỗi rõ giới hạn.
- **Given** ảnh đã tải, **When** tôi chèn vào trang, **Then** ảnh tự tối ưu (WebP) và phục vụ qua CDN.

### US-03 (Could) `UC-05, FR-G-006`
**Là** người dùng mới, **tôi muốn** chọn template bản địa theo ngành **để** khởi tạo site nhanh.
- **Given** tôi chọn template ngành, **When** tạo site, **Then** site có cấu trúc trang mẫu phù hợp ngành đó.

### US-04 (Could) `FR-G-005`
**Là** người dùng mới, **tôi muốn** AI tạo site nháp từ mô tả doanh nghiệp **để** tiết kiệm thời gian khởi tạo.
- **Given** tôi nhập mô tả, **When** AI sinh site, **Then** một site nháp có nội dung gợi ý được tạo để tôi tinh chỉnh.

---

## Epic 2 — Quy trình duyệt & cộng tác

### US-05 (Must) `UC-02, FR-W-001`
**Là** biên tập viên, **tôi muốn** gửi nội dung đi duyệt **để** trưởng phòng kiểm soát trước khi lên site.
- **Given** có bản nháp, **When** tôi gửi duyệt, **Then** trạng thái chuyển "Chờ duyệt" và Approver nhận thông báo.
- **Given** không có Approver được cấu hình, **When** tôi gửi duyệt, **Then** hệ thống cảnh báo Admin thiết lập.

### US-06 (Must) `UC-02, FR-W-002`
**Là** trưởng phòng, **tôi muốn** duyệt hoặc trả lại nội dung kèm ghi chú **để** đảm bảo chất lượng.
- **Given** nội dung chờ duyệt, **When** tôi phê duyệt, **Then** trạng thái "Approved" và bản ghi duyệt (người, thời điểm) được lưu.
- **Given** nội dung chờ duyệt, **When** tôi từ chối kèm ghi chú, **Then** nội dung về Draft và biên tập viên nhận phản hồi.

### US-07 (Must) `UC-06, FR-W-002`
**Là** admin, **tôi muốn** mời người dùng và gán vai trò **để** kiểm soát quyền truy cập.
- **Given** tôi mời email mới, **When** trong hạn mức seat, **Then** lời mời được gửi và người dùng tạo ở trạng thái chờ kích hoạt.
- **Given** vượt số seat của gói, **When** tôi mời thêm, **Then** hệ thống chặn và mời nâng cấp.

### US-08 (Could) `FR-W-003`
**Là** admin/agency, **tôi muốn** quản lý nhiều site trong một workspace **để** vận hành tập trung.
- **Given** tôi có nhiều site, **When** mở workspace, **Then** tôi thấy và chuyển đổi giữa các site theo quyền.

---

## Epic 3 — SEO, hiệu năng & AI

### US-09 (Must) `FR-SEO-001`
**Là** chuyên viên SEO, **tôi muốn** quản lý metadata và sitemap tự động **để** nội dung chuẩn SEO mà không cần plugin.
- **Given** một trang, **When** tôi nhập title/description, **Then** metadata áp vào HTML xuất bản.
- **Given** trang được xuất bản, **When** hoàn tất, **Then** sitemap tự cập nhật.

### US-10 (Should) `UC-04, FR-AI-001`
**Là** biên tập viên, **tôi muốn** AI viết nội dung tiếng Việt **để** tăng năng suất.
- **Given** tôi nhập ngữ cảnh, **When** AI sinh nội dung, **Then** tôi xem/chỉnh/chấp nhận và hạn mức AI bị trừ.
- **Given** dịch vụ AI lỗi, **When** sinh nội dung, **Then** hệ thống báo lỗi và không trừ hạn mức.

### US-11 (Should) `UC-04, FR-AI-002`
**Là** chuyên viên SEO, **tôi muốn** AI đề xuất tiêu đề/meta/từ khoá/schema **để** tối ưu SEO nhanh.
- **Given** một trang có nội dung, **When** tôi gọi AI SEO, **Then** nhận đề xuất áp dụng được một chạm.

### US-12 (Could) `FR-AI-003`
**Là** marketer, **tôi muốn** tối ưu hiển thị trên AI-search (AEO) **để** đón đầu xu hướng tìm kiếm.
- **Given** một trang, **When** bật AEO, **Then** hệ thống đề xuất cấu trúc/schema giúp xuất hiện trên công cụ AI-search.

### US-13 (Could) `FR-AI-004`
**Là** biên tập viên, **tôi muốn** AI tạo/tối ưu ảnh **để** có hình phù hợp và nhẹ.
- **Given** tôi yêu cầu ảnh, **When** AI tạo, **Then** ảnh được chèn ở định dạng WebP qua CDN.

---

## Epic 4 — Xuất bản & tên miền

### US-14 (Must) `UC-03, FR-PUB-001`
**Là** biên tập viên, **tôi muốn** xuất bản trang một chạm lên tên miền tuỳ chỉnh **để** đưa nội dung ra công khai nhanh.
- **Given** nội dung đã duyệt và domain hợp lệ, **When** tôi xuất bản, **Then** trang online (SSR/static + CDN), sitemap cập nhật.
- **Given** domain chưa trỏ DNS/SSL, **When** tôi xuất bản, **Then** hệ thống cảnh báo và dùng subdomain tạm.

### US-15 (Should) `UC-03, FR-G-007`
**Là** biên tập viên, **tôi muốn** lên lịch xuất bản và xem preview/staging **để** chủ động thời điểm.
- **Given** nội dung đã duyệt, **When** tôi đặt lịch tương lai, **Then** trang tự xuất bản đúng giờ.
- **Given** tôi đặt thời điểm quá khứ, **When** lưu lịch, **Then** hệ thống báo lỗi.

---

## Epic 5 — Lead, tích hợp & analytics

### US-16 (Should) `UC-08, FR-G-004`
**Là** khách truy cập, **tôi muốn** gửi form liên hệ **để** được tư vấn; **và là** chủ site nhận được lead.
- **Given** form đã xuất bản, **When** khách gửi đủ trường hợp lệ, **Then** lead được lưu và chủ site nhận thông báo.
- **Given** thiếu trường bắt buộc hoặc captcha fail, **When** gửi, **Then** hệ thống chặn và báo lỗi cụ thể.

### US-17 (Could) `FR-INT-002`
**Là** marketer, **tôi muốn** tích hợp Zalo/Facebook/GA4/ad pixel/CRM **để** đo lường và kết nối kênh.
- **Given** tôi cấu hình tích hợp, **When** lưu, **Then** sự kiện/dữ liệu được đẩy sang dịch vụ tương ứng.

### US-18 (Should) `UC-09, FR-AN-001`
**Là** trưởng phòng, **tôi muốn** xem dashboard traffic/SEO/chuyển đổi **để** đánh giá hiệu quả.
- **Given** site có dữ liệu, **When** tôi chọn khoảng thời gian, **Then** biểu đồ/chỉ số hiển thị đúng.
- **Given** chưa đủ dữ liệu, **When** mở dashboard, **Then** hiển thị trạng thái empty kèm hướng dẫn.

---

## Epic 6 — Tài khoản, gói & thanh toán

### US-19 (Must) `UC-07, FR-ACC-001, FR-INT-001`
**Là** admin, **tôi muốn** chọn gói và thanh toán định kỳ qua cổng VN **để** kích hoạt dịch vụ.
- **Given** tôi chọn gói trả phí, **When** thanh toán qua VNPay/MoMo/ZaloPay thành công, **Then** gói được kích hoạt, hoá đơn phát hành, hạn mức tính năng áp dụng.
- **Given** thanh toán thất bại, **When** xử lý, **Then** giữ gói cũ, cho thử lại; sau N lần hạ về Free.

### US-20 (Should) `FR-ACC-002`
**Là** khách hàng tiềm năng, **tôi muốn** dùng gói Free thật và thấy giá VND minh bạch **để** trải nghiệm trước khi trả phí.
- **Given** tôi đăng ký Free, **When** dùng, **Then** áp hạn mức free rõ ràng, không bị tính phí ẩn.
- **Given** đến kỳ gia hạn, **When** hệ thống thu phí, **Then** giá đúng cam kết, không tăng bất ngờ.

---

## Epic 7 — Mở rộng (ngoài MVP)

### US-21 (Could) `UC-10, FR-SEO-002`
**Là** biên tập viên, **tôi muốn** tạo phiên bản đa ngôn ngữ (VN/EN) với hreflang **để** phục vụ khách quốc tế.
- **Given** bật ngôn ngữ thứ hai, **When** tạo bản dịch, **Then** hreflang được áp đúng.

### US-22 (Won't-this-time) `UC-10, FR-INT-003`
**Là** lập trình viên, **tôi muốn** truy cập nội dung qua API headless (REST/GraphQL) **để** phân phối đa kênh.
- **Given** tôi tạo API token, **When** gọi API trong scope, **Then** nhận nội dung đúng quyền.

### US-23 (Won't-this-time) `FR-W-004`
**Là** chủ agency, **tôi muốn** white-label & multi-tenant billing **để** bán lại cho khách.
- **Given** bật white-label, **When** khách của tôi truy cập, **Then** thấy thương hiệu của tôi, và billing tách theo từng khách.

## Tổng hợp MoSCoW
- **Must (MVP):** US-01, US-05, US-06, US-07, US-09, US-14, US-19.
- **Should:** US-02, US-10, US-11, US-15, US-16, US-18, US-20.
- **Could:** US-03, US-04, US-08, US-12, US-13, US-17, US-21.
- **Won't-this-time:** US-22, US-23.
