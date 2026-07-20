# Use Cases — marketing-cms-saas (VietCMS)

**Dự án:** marketing-cms-saas · **Ngày:** 18/06/2026 · **Phiên bản:** v0.1
**Quy ước mã:** UC-<số>. Mỗi UC truy vết về FR trong BRD. Quy tắc nghiệp vụ: BR-<số>.

## Tác nhân (Actors)
| Mã | Tác nhân | Mô tả |
|---|---|---|
| A1 | Admin (tenant) | Quản trị tài khoản, người dùng, site, gói/thanh toán |
| A2 | Biên tập viên (Editor) | Tạo/sửa/gửi duyệt nội dung |
| A3 | Trưởng phòng Marketing (Approver) | Duyệt/từ chối nội dung |
| A4 | Cộng tác viên (Contributor) | Tạo nội dung, không xuất bản |
| A5 | Khách truy cập (Visitor) | Xem site công khai, gửi form |
| A6 | Hệ thống VietCMS | Tự động render, SEO, AI, billing, analytics |

---

## UC-01 — Soạn thảo trang/bài bằng no-code editor `FR-G-001, FR-G-002`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A2 Biên tập viên (A4 Cộng tác viên) |
| Mức ưu tiên | Critical (Must) |
| Trigger | Người dùng chọn "Tạo trang/bài mới" |
| Tiền điều kiện | Đã đăng nhập; có quyền tạo nội dung; đã chọn site |
| Kết quả | Bản nháp được lưu kèm phiên bản |

**Luồng chính:**
1. Người dùng chọn tạo mới (trống hoặc từ template).
2. Hệ thống mở no-code editor (kéo-thả block/section).
3. Người dùng thêm/sắp xếp block, nhập nội dung, chèn media.
4. Hệ thống tự lưu nháp định kỳ và tạo CONTENT_VERSION (BR-01).
5. Người dùng lưu/đặt tiêu đề, slug.
6. Hệ thống xác thực slug duy nhất trong site (BR-02) và lưu.

**Luồng phụ:**
- 3a. Người dùng dùng AI gợi ý nội dung → xem UC-04.
- 1a. Tạo từ template bản địa theo ngành (FR-G-006).

**Luồng ngoại lệ:**
- 6a. Slug trùng → hệ thống báo lỗi, đề xuất slug thay thế.
- 4a. Mất kết nối → giữ bản nháp cục bộ, đồng bộ khi có mạng.

---

## UC-02 — Gửi duyệt & phê duyệt nội dung `FR-W-001, FR-W-002`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A2 Biên tập viên (gửi), A3 Trưởng phòng (duyệt) |
| Mức ưu tiên | Critical (Must) |
| Trigger | Biên tập viên chọn "Gửi duyệt" |
| Tiền điều kiện | Có bản nháp; người gửi có quyền; người duyệt có vai trò Approver |
| Kết quả | Nội dung ở trạng thái Approved hoặc trả lại Draft kèm phản hồi |

**Luồng chính:**
1. Biên tập viên gửi bản nháp đi duyệt.
2. Hệ thống chuyển trạng thái sang "Chờ duyệt", thông báo cho Approver (BR-03).
3. Approver xem nội dung và bản so sánh phiên bản.
4. Approver phê duyệt.
5. Hệ thống chuyển trạng thái "Approved", ghi APPROVAL (người, thời điểm).

**Luồng phụ:**
- 4a. Approver từ chối kèm ghi chú → trạng thái trở về Draft, thông báo biên tập viên.

**Luồng ngoại lệ:**
- 2a. Không có Approver được cấu hình → hệ thống cảnh báo Admin thiết lập (BR-04).
- 3a. Nội dung bị sửa sau khi gửi → hệ thống yêu cầu gửi lại phiên bản mới nhất.

---

## UC-03 — Xuất bản / lên lịch xuất bản `FR-PUB-001, FR-G-007`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A2 Biên tập viên / A1 Admin |
| Mức ưu tiên | Critical (Must) |
| Trigger | Chọn "Xuất bản" hoặc "Lên lịch" trên nội dung đã duyệt |
| Tiền điều kiện | Nội dung ở trạng thái Approved; site có domain hợp lệ |
| Kết quả | Trang công khai online (ngay hoặc theo lịch), sitemap cập nhật |

**Luồng chính:**
1. Người dùng chọn xuất bản ngay.
2. Hệ thống render trang (SSR/static), đẩy CDN, áp metadata SEO.
3. Hệ thống cập nhật sitemap và đặt trạng thái "Published" (BR-05).
4. Hệ thống hiển thị URL công khai.

**Luồng phụ:**
- 1a. Lên lịch: người dùng đặt thời điểm → hệ thống tạo PUBLISH_JOB, xuất bản tự động đúng giờ.
- 1b. Gỡ xuất bản (unpublish) → trạng thái về Draft, loại khỏi sitemap.

**Luồng ngoại lệ:**
- 2a. Domain chưa trỏ DNS/SSL → cảnh báo, xuất bản trên subdomain tạm (BR-06).
- 1a-x. Thời điểm lên lịch ở quá khứ → báo lỗi.

---

## UC-04 — AI hỗ trợ nội dung & SEO tiếng Việt `FR-AI-001, FR-AI-002, FR-AI-004`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A2 Biên tập viên; A6 Hệ thống (AI) |
| Mức ưu tiên | High (Should) |
| Trigger | Người dùng nhấn "Trợ lý AI" trong editor |
| Tiền điều kiện | Gói có bật tính năng AI; có hạn mức AI còn lại |
| Kết quả | Gợi ý nội dung/tiêu đề/meta/ảnh được áp dụng theo lựa chọn người dùng |

**Luồng chính:**
1. Người dùng nhập yêu cầu/ngữ cảnh (vd "viết đoạn mở đầu cho trang dịch vụ X").
2. Hệ thống gọi dịch vụ AI, sinh nội dung tiếng Việt.
3. Người dùng xem, chỉnh, chấp nhận hoặc tạo lại.
4. Hệ thống chèn nội dung và trừ hạn mức AI (BR-07).
5. (SEO) Hệ thống đề xuất tiêu đề/meta/từ khoá/schema; người dùng áp dụng.

**Luồng phụ:**
- 2a. AI tối ưu/sinh ảnh → tự chuyển WebP, đẩy CDN (FR-AI-004).
- 5a. AEO: đề xuất tối ưu cho AI-search (FR-AI-003, ưu tiên Could).

**Luồng ngoại lệ:**
- 2a-x. Dịch vụ AI lỗi/timeout → báo lỗi, giữ nội dung gốc, không trừ hạn mức.
- 1a. Hết hạn mức AI → mời nâng cấp gói.

---

## UC-05 — Tạo site từ template / AI site builder `FR-G-006, FR-G-005`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A1 Admin / A2 Biên tập viên |
| Mức ưu tiên | Medium (Should/Could) |
| Trigger | "Tạo site mới" |
| Tiền điều kiện | Gói cho phép thêm site; trong hạn mức số site |
| Kết quả | Site mới với cấu trúc cơ bản, sẵn sàng chỉnh sửa |

**Luồng chính:**
1. Người dùng chọn template theo ngành hoặc nhập mô tả doanh nghiệp.
2. (AI builder) Hệ thống sinh site nháp từ mô tả (FR-G-005, Could).
3. Hệ thống tạo SITE + trang mẫu, gán template.
4. Người dùng vào editor tinh chỉnh.

**Luồng ngoại lệ:**
- 1a-x. Vượt hạn mức site của gói → mời nâng cấp.

---

## UC-06 — Quản lý người dùng & phân quyền `FR-W-002`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A1 Admin |
| Mức ưu tiên | Critical (Must) |
| Trigger | Admin mời/sửa người dùng |
| Tiền điều kiện | Admin đã đăng nhập |
| Kết quả | Người dùng được tạo/cập nhật với vai trò tương ứng |

**Luồng chính:**
1. Admin mời người dùng qua email, chọn vai trò.
2. Hệ thống gửi lời mời, tạo USER trạng thái "chờ kích hoạt" (BR-08).
3. Người được mời đặt mật khẩu, kích hoạt.
4. Hệ thống áp ma trận phân quyền theo vai trò.

**Luồng ngoại lệ:**
- 1a. Email đã tồn tại trong tenant → báo lỗi.
- 2a. Vượt số seat của gói → mời nâng cấp (BR-09).

---

## UC-07 — Quản lý gói đăng ký & thanh toán định kỳ `FR-ACC-001, FR-ACC-002, FR-INT-001`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A1 Admin; A6 Hệ thống (billing) |
| Mức ưu tiên | Critical (Must) |
| Trigger | Admin chọn/đổi gói hoặc đến kỳ gia hạn |
| Tiền điều kiện | Có phương thức thanh toán hợp lệ |
| Kết quả | Subscription cập nhật, hoá đơn phát hành, quyền tính năng áp dụng |

**Luồng chính:**
1. Admin chọn gói (Free/trả phí, giá VND minh bạch).
2. Admin nhập/chọn phương thức thanh toán (VNPay/MoMo/ZaloPay).
3. Hệ thống xử lý thanh toán qua cổng nội địa.
4. Hệ thống kích hoạt gói, phát hành INVOICE, áp hạn mức tính năng (BR-10).

**Luồng phụ:**
- 1a. Dùng gói Free → bỏ qua thanh toán, áp hạn mức free.
- Gia hạn tự động đến kỳ → hệ thống tự thu, không tăng giá so với cam kết (BR-11).

**Luồng ngoại lệ:**
- 3a. Thanh toán thất bại → giữ gói cũ, thông báo, cho thử lại; sau N lần hạ cấp về Free (BR-12).

---

## UC-08 — Khách truy cập gửi form thu lead `FR-G-004`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A5 Khách truy cập |
| Mức ưu tiên | High (Should) |
| Trigger | Khách điền và gửi form trên site công khai |
| Tiền điều kiện | Trang có form đã xuất bản |
| Kết quả | LEAD được lưu, thông báo cho chủ site |

**Luồng chính:**
1. Khách điền các trường form.
2. Hệ thống xác thực dữ liệu (bắt buộc/định dạng) và captcha (BR-13).
3. Hệ thống lưu LEAD, gửi thông báo, (tuỳ chọn) đẩy sang CRM/GA4.
4. Hiển thị thông báo cảm ơn.

**Luồng ngoại lệ:**
- 2a. Thiếu trường bắt buộc/sai định dạng → báo lỗi từng trường.
- 2b. Nghi spam (captcha fail) → từ chối gửi.

---

## UC-09 — Xem dashboard analytics `FR-AN-001`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A3 Trưởng phòng / A2 SEO |
| Mức ưu tiên | Medium (Should) |
| Trigger | Mở mục "Analytics" |
| Tiền điều kiện | Site đã xuất bản, có dữ liệu |
| Kết quả | Hiển thị traffic, SEO, chuyển đổi theo khoảng thời gian |

**Luồng chính:**
1. Người dùng chọn site và khoảng thời gian.
2. Hệ thống tổng hợp ANALYTICS_EVENT và hiển thị biểu đồ/chỉ số.
3. Người dùng lọc/ xuất báo cáo.

**Luồng ngoại lệ:**
- 2a. Chưa đủ dữ liệu → hiển thị trạng thái empty kèm hướng dẫn.

---

## UC-10 — Đa ngôn ngữ & API headless (mở rộng) `FR-SEO-002, FR-INT-003`
| Mục | Nội dung |
|---|---|
| Tác nhân chính | A2 Biên tập viên (đa ngôn ngữ); A1/Dev (API) |
| Mức ưu tiên | Low/Future (Could/Won't-this-time) |
| Trigger | Bật đa ngôn ngữ cho site / tạo API token |
| Tiền điều kiện | Gói hỗ trợ tính năng tương ứng |
| Kết quả | Phiên bản ngôn ngữ với hreflang / API key truy cập nội dung |

**Luồng chính (đa ngôn ngữ):**
1. Bật ngôn ngữ thứ hai (VN/EN) cho site.
2. Tạo phiên bản dịch của trang; hệ thống áp hreflang.

**Luồng chính (API):**
1. Admin tạo API token (REST/GraphQL).
2. Hệ thống cấp quyền đọc nội dung theo scope.

> Các UC ưu tiên Future được giữ trong đặc tả nhưng ngoài MVP (xử lý CONFLICT-01).
