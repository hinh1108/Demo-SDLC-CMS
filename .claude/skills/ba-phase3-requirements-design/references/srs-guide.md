# Hướng dẫn viết SRS (Software Requirements Specification)

SRS là deliverable trọng tâm của Pha 3: đặc tả chi tiết **hệ thống làm gì** và **ràng buộc** của nó,
đủ để dev xây dựng và tester kiểm thử. Tài liệu theo chuẩn doanh nghiệp (song ngữ Việt–Anh khi cần).
Dùng cùng `assets/templates/srs-template.md` (khung điền sẵn). File này giải thích cách viết & tiêu chuẩn.

## A. Trang quản lý tài liệu (front matter — bắt buộc)
- **Trang bìa:** Logo, "DỰ ÁN", [TÊN DỰ ÁN].
- **Bảng định danh:** Mã hiệu dự án · Phiên bản `<x.y>` · Mã hiệu tài liệu `<Mã dự án>-SRS-<Phiên bản>`.
- **Lịch sử thay đổi:** Ngày hiệu lực | Phiên bản | Vị trí thay đổi | Nội dung | Lý do | Người thay đổi | Người phê duyệt.
- **Trang ký:** Người lập / Người kiểm tra / Người hỗ trợ (khách hàng) / Người duyệt — kèm chữ ký & ngày.
- **Mục lục:** đánh số La Mã I/II/III cho chương, số cho mục.

## B. Cấu trúc nội dung

### I. GIỚI THIỆU
1. **Mục đích:** tài liệu này dùng để làm gì, cho ai.
2. **Phạm vi:** tên sản phẩm, lợi ích chính, mục tiêu phần mềm hướng tới.
3. **Đối tượng sử dụng:** ai đọc tài liệu (thiết kế, lập trình, kiểm thử, vận hành, quản trị...).
4. **Tài liệu liên quan:** bảng (STT | Tài liệu | Phiên bản | Mô tả).
5. **Định nghĩa & từ viết tắt:** 5.1 Định nghĩa; 5.2 Thuật ngữ/Từ viết tắt — bảng (STT | Thuật ngữ | Định nghĩa).

### II. MÔ TẢ TỔNG THỂ
Mở đầu bằng "Tổng quan phần mềm": Góc nhìn sản phẩm (độc lập hay phần của hệ thống lớn), Chức năng
sản phẩm (nhóm chức năng chính), Đặc điểm người dùng (Admin/End-user + trình độ), Giả định & phụ thuộc.
1. **Mô hình tổng quan:** sơ đồ kiến trúc/khái niệm; 1.1 mô tả các đối tượng/thành phần, 1.2 mô tả hệ thống liên quan.
2. **Luồng nghiệp vụ tổng quan:**
   - **2.1 Sơ đồ nghiệp vụ tổng quan hệ thống** — sơ đồ phân rã chức năng **theo nhóm** (cây, Mermaid `flowchart LR` để tránh tràn ngang): root = hệ thống → nhóm chức năng → chức năng.
   - **2.2 Use Case Diagram tổng quan** (actor ↔ use case, PlantUML) + bảng **Danh sách chức năng–Use Case**
     (STT | Tính năng | Mô tả | Chi tiết) liệt kê & gom nhóm chức năng.
3. **Ma trận phân quyền:** bảng (STT | Name | Description | Assigned User | Đối tượng) — mỗi vai trò làm được gì.
4. **Sơ đồ chức năng (Site map / BFD):** sơ đồ phân rã chức năng theo cây.

### III. ĐẶC TẢ YÊU CẦU HỆ THỐNG
**1. Yêu cầu chức năng phần mềm** — với MỖI chức năng, đặc tả 4 mục con:
- **1.x.1 Mô tả chung:** bảng use case gồm — ID | Tên | Mô tả | Tác nhân | Ưu tiên | Trigger |
  Tiền điều kiện | Kết quả | Luồng chính (các bước) | Luồng phụ | Luồng ngoại lệ/kết thúc.
- **1.x.2 Luồng xử lý:** sơ đồ hoạt động/flow (xem `references/diagrams.md`).
- **1.x.3 Quy tắc xử lý nghiệp vụ:** bảng (Bước | Người thực hiện/HT | BR Code | Mô tả). Mỗi quy tắc có mã BR.
- **1.x.4 Thiết kế giao diện:** ảnh/wireframe màn hình + bảng trường thông tin
  (STT | Trường thông tin | Định dạng dữ liệu | Mô tả | Bắt buộc).

**2. Yêu cầu phi chức năng:** 2.1 Hiệu năng · 2.2 Bảo mật · 2.3 Sao lưu · 2.4 Tính ổn định · 2.5 Tính sử dụng.
Mỗi yêu cầu phải có **tiêu chí đo** (vd "< 2s với 95% request", "uptime ≥ 99.5%").

**3. Các yêu cầu khác:** 3.1 Quy định chung các thành phần hệ thống · 3.2 Quy định về thông báo ·
3.3 Quy định tìm kiếm thông tin (các quy ước dùng chung toàn hệ thống).

**4. Yêu cầu tích hợp:** hệ thống ngoài, dữ liệu trao đổi, giao thức/API.
**5. Chuyển đổi dữ liệu:** di trú/đồng bộ dữ liệu từ hệ thống cũ (nếu có).
**6. Phụ lục:** tài liệu/biểu mẫu tham chiếu.

## C. Cách viết "Luồng chính" trong Mô tả chung
Đánh số tuần tự từng bước (thao tác người dùng ↔ phản hồi hệ thống). Luồng ngoại lệ tham chiếu số
bước rẽ nhánh (vd "8b. Nếu file > 1000MB → báo lỗi ..."). Mỗi nhánh lỗi nêu rõ điều kiện + thông báo.

## D. Mã & truy vết
- Use case/chức năng có ID duy nhất; quy tắc nghiệp vụ có **BR Code**.
- Mỗi yêu cầu chức năng truy vết về yêu cầu nghiệp vụ trong BRD (BR-xx) và mục tiêu (BO-xx);
  cập nhật `assets/templates/traceability-matrix.csv`.

## E. Rubric chất lượng SRS (tự chấm trước khi bàn giao)
- [ ] Có đủ front matter: định danh, lịch sử thay đổi, trang ký, mục lục.
- [ ] Glossary định nghĩa mọi thuật ngữ/viết tắt dùng trong tài liệu.
- [ ] Có Use Case Diagram, Ma trận phân quyền, Site map (BFD).
- [ ] Mỗi chức năng đủ 4 mục: Mô tả chung (bảng use case) · Luồng xử lý · Quy tắc nghiệp vụ (BR Code) · Thiết kế giao diện.
- [ ] Luồng chính đánh số; có luồng phụ & luồng ngoại lệ/lỗi.
- [ ] Bảng trường thông tin nêu rõ định dạng & bắt buộc.
- [ ] NFR có tiêu chí đo; có quy định chung (thông báo, tìm kiếm).
- [ ] Tích hợp & chuyển đổi dữ liệu được đề cập (hoặc ghi rõ "không áp dụng").
- [ ] Mỗi yêu cầu truy vết được về BRD/mục tiêu; mã duy nhất, nhất quán.
