# Hướng dẫn viết BRD (Business Requirements Document)

BRD là deliverable tổng hợp chính của Pha 2: gom toàn bộ kết quả elicitation thành một tài liệu
nghiệp vụ thống nhất, được stakeholder phê duyệt, làm "vạch đích" (baseline) cho thiết kế chi tiết
ở Pha 3. BRD mô tả nghiệp vụ **cần gì và vì sao** — chưa đi vào đặc tả kỹ thuật.

Dùng cùng `assets/templates/brd-template.md` (khung điền sẵn). File này giải thích **cách viết** và
**tiêu chuẩn** từng phần.

## Cấu trúc chuẩn (theo thứ tự)

### 1. Lịch sử chỉnh sửa tài liệu (Document Revisions)
Bảng: Ngày | Phiên bản | Nội dung thay đổi. Giúp truy vết ai sửa gì, khi nào.

### 2. Phê duyệt (Approvals)
Bảng ký duyệt (Vai trò | Họ tên | Chức danh | Chữ ký | Ngày). Các vai trò chuẩn: Project Sponsor,
Business Owner, Project Manager, System Architect, Development Lead, UX Lead, Quality Lead, Content Lead.
Mục đích: xác nhận cam kết, thiết lập trách nhiệm, tạo baseline kiểm soát thay đổi, giảm tranh cãi về sau.

### 3. Giới thiệu (Introduction)
**3.1 Project Summary**
- **Objectives (Mục tiêu):** mục tiêu tổng thể, mô tả cấp cao sản phẩm làm gì, gắn với mục tiêu kinh
  doanh, yêu cầu tương tác hệ thống khác. Viết theo **SMART** (có con số & mốc thời gian).
  - **SMART chi tiết** (mỗi chữ kèm câu hỏi gợi ý + ví dụ):
    - **S – Specific:** cải thiện điều gì, ai tham gia, kết quả cuối là gì? (vd: "Xây dựng tính năng
      tự động gửi báo cáo doanh thu hàng ngày qua email" thay vì "cải thiện phần mềm").
    - **M – Measurable:** bao nhiêu %, bao nhiêu tiền, bao nhiêu giờ? (vd: "giảm thời gian xử lý hồ sơ
      vay từ 5 ngày xuống 2 ngày").
    - **A – Achievable:** với ngân sách & nhân sự hiện tại có làm được không?
    - **R – Relevant:** có giải quyết đúng vấn đề doanh nghiệp đang gặp không?
    - **T – Time-bound:** mốc hoàn thành cụ thể (vd: "vận hành trước 30/06/2026").
- **Background (Bối cảnh):** lịch sử dự án ra đời — vấn đề đã xác định + lợi ích kỳ vọng.
  - **Business Drivers:** yếu tố thúc đẩy (tài chính, vận hành, thị trường, môi trường), dạng bullet/bảng.

**3.2 Project Scope** — mô tả In-Scope và Out-of-Scope rõ ràng để chống "scope creep".
  Câu hỏi định khung: "Đâu là những tính năng tối thiểu phải có để hệ thống vận hành được ngay (MVP)?" — đó là nòng cốt In-Scope.
- **In-Scope:** dùng động từ hành động (Tạo, Tích hợp, Cung cấp, Hỗ trợ, Đồng bộ...). Chia nhóm:
  Quy trình nghiệp vụ · Tính năng hệ thống · Dữ liệu & Báo cáo · Người dùng.
- **Out-of-Scope:** nêu rõ những gì hệ thống KHÔNG làm lần này.

**3.3 System Perspective:** yếu tố cản trở/thúc đẩy triển khai (pháp lý, giới hạn kỹ thuật, ngân sách).
- **Assumptions (Giả định):** điều tin là đúng để dự án tiến triển dù chưa có bằng chứng.
- **Constraints (Ràng buộc):** giới hạn PHẢI tuân thủ (thời gian, ngân sách, công nghệ, pháp luật).
- **Risks (Rủi ro):** sự kiện CÓ THỂ xảy ra gây ảnh hưởng tiêu cực — nêu sự kiện + hậu quả.
- **Issues (Vấn đề tồn tại):** khác rủi ro — vấn đề ĐANG xảy ra cần xử lý ngay.

### 4. Business Process Overview (Tổng quan quy trình)
Mô tả quy trình hiện tại (tương tác giữa hệ thống & phòng ban) kèm sơ đồ luồng trực quan. **Chọn đúng
sơ đồ** (xem `references/diagrams.md`):
- Quy trình có **nhiều actor/phòng ban** (vd người dùng ↔ hệ thống ↔ bộ phận khác) → **swimlane PlantUML**.
- Luồng **đơn giản, một actor** → flowchart Mermaid.
- **4.1 As-Is:** quy trình hiện tại (mô tả + sơ đồ).
- **4.2 To-Be:** quy trình đề xuất (có thể kèm use case), chỉ rõ điểm cải tiến/tự động hoá so với As-Is.

### 5. Business Requirements (Yêu cầu nghiệp vụ)
Liệt kê yêu cầu, phân loại theo nhóm & mức ưu tiên; liên kết tới use case; đưa vào ma trận truy vết.

**Thang ưu tiên (1–5):**

| Value | Rating | Mô tả |
|---|---|---|
| 1 | Critical | Cực kỳ quan trọng; dự án không khả thi nếu thiếu |
| 2 | High | Ưu tiên cao; vẫn triển khai mức tối thiểu được nếu thiếu |
| 3 | Medium | Mang lại giá trị nhất định; dự án vẫn tiếp tục được |
| 4 | Low | Ưu tiên thấp / "nên có" nếu thời gian & chi phí cho phép |
| 5 | Future | Ngoài phạm vi lần này; xem xét cho bản phát hành tương lai |

**5.1 Functional Requirements:** bảng (Mã yêu cầu | Ưu tiên | Mô tả | **Lý do/Rationale** |
**Tham chiếu Use Case** | **Stakeholder ảnh hưởng**). Gom nhóm và đặt mã theo nhóm:
- General/Base (FR-G-xxx), Security (FR-S-xxx), Reporting (FR-R-xxx),
  Usability (FR-U-xxx), Audit (FR-A-xxx)...

**5.2 Non-Functional Requirements:** bảng (ID | Requirement). Gồm thời gian xử lý, số người dùng
đồng thời, tính khả dụng, SLA... Mỗi NFR phải có tiêu chí đo cụ thể.

### 6. Phụ lục (Appendices)
- **6.1 Glossary (Thuật ngữ):** định nghĩa thuật ngữ đặc thù tổ chức/công nghệ/tiêu chuẩn.
- **6.2 Related Documents (Tài liệu liên quan):** danh sách tài liệu/đường link tham chiếu.

## Quy ước đặt mã yêu cầu
`FR-<Nhóm>-<Số>` cho yêu cầu chức năng (vd FR-S-001 = Functional / Security / 001);
`NFR-<Số>` cho phi chức năng. Mã phải duy nhất và giữ nguyên xuyên suốt để truy vết.

## Rubric chất lượng BRD (tự chấm trước khi trình duyệt)
- [ ] Có lịch sử phiên bản và bảng phê duyệt đủ vai trò (Sponsor → Content Lead).
- [ ] Mục tiêu đạt chuẩn SMART, có con số & mốc thời gian.
- [ ] Background nêu đủ vấn đề + lợi ích; có Business Drivers.
- [ ] Scope có cả In-Scope và Out-of-Scope cụ thể.
- [ ] Phân biệt rõ Assumptions / Constraints / Risks / Issues.
- [ ] Có quy trình As-Is và To-Be, chọn đúng loại sơ đồ (swimlane PlantUML khi nhiều actor).
- [ ] Yêu cầu phân loại theo nhóm, gán mức ưu tiên 1–5, có mã duy nhất; FR có Lý do, Use Case ref, Stakeholder.
- [ ] NFR có tiêu chí đo cụ thể.
- [ ] Có glossary và danh sách tài liệu liên quan.
- [ ] Mỗi yêu cầu truy vết được về mục tiêu; viết ở mức nghiệp vụ (chưa phải đặc tả kỹ thuật).

---

## Tiêu chuẩn nâng cao (rút từ BRD dự án thực tế)

Các thực hành tốt từ BRD dự án chính phủ/quy mô lớn — áp dụng để BRD chặt chẽ & truy vết được:

1. **Mã hoá chức năng & truy vết xuyên suốt.** Mỗi chức năng có **mã** (vd `TC-01`, `PAKN-05`) đặt ở
   Scope → mã này được tham chiếu lại trong bảng Yêu cầu chức năng (cột "Mã chức năng") và trong
   Danh sách Use Case (cột "Mã chức năng"). Tạo chuỗi truy vết Scope → FR → Use Case không đứt gãy.

2. **Bảng Căn cứ pháp lý (dự án thuộc lĩnh vực quản lý/được điều chỉnh).** Liệt kê luật/nghị định/
   thông tư kèm cột **"Nội dung liên quan trực tiếp đến hệ thống"** (map mỗi căn cứ → module nào nó
   làm nền) và link văn bản. Giúp mọi yêu cầu có cơ sở pháp lý, tránh làm sai quy định.

3. **Cột "Phạm vi (Trong/Ngoài)" ở từng bước quy trình.** Trong bảng mô tả quy trình nghiệp vụ, đánh
   dấu mỗi bước là **Trong phạm vi** (hệ thống này làm) hay **Ngoài phạm vi** (thủ công/hệ thống khác).
   Làm rõ ranh giới hệ thống ngay ở mức quy trình — chống hiểu nhầm & scope creep.

4. **Scope viết dạng bảng "Danh sách chức năng" có cấu trúc**, gom theo **nhóm chức năng**, mỗi dòng:
   Mã CN | Tên chức năng | Mô tả | Đối tượng (vai trò dùng) | Ghi chú (lưu ý tích hợp/ràng buộc).
   Cột Ghi chú rất hữu ích để gắn note kỹ thuật sớm (vd "Tích hợp VNeID", "Có captcha, kiểm soát phiên").

5. **Bảng Đối tượng sử dụng & vai trò (Actors).** STT | Tên tác nhân | Vai trò (mô tả trách nhiệm dạng
   gạch đầu dòng). Phân biệt rõ Khách (không đăng nhập) / Cá nhân / Tổ chức / Cán bộ — nền cho phân quyền.

6. **Mô tả yêu cầu chức năng theo các bước + nhúng quy tắc nghiệp vụ.** Mô tả FR liệt kê từng bước và
   gài luôn ràng buộc đo được (vd "mật khẩu ≥ 8 ký tự", "mỗi PAKN chỉ được đánh giá một lần",
   "không cần đăng nhập vẫn xem được"). Cụ thể, kiểm thử được.

7. **NFR có ngưỡng đo + tham chiếu tuân thủ.** Gom theo nhóm (Hiệu năng/Bảo mật/Khả dụng...), mỗi NFR có
   con số (vd "API tra cứu < 2s với 95% request", "uptime ≥ 99.5%/năm") và viện dẫn tiêu chuẩn/nghị định
   khi áp dụng (vd an toàn thông tin cấp độ 3 theo NĐ 85/2016).

8. **Lịch sử thay đổi có người thực hiện & nội dung ý nghĩa.** Ghi rõ ai sửa + tóm tắt thay đổi thực chất
   (vd "Bỏ chức năng Tự công bố; bổ sung tra cứu sản phẩm hợp quy đồng bộ từ dịch vụ công").

9. **Glossary có cột "Nguồn tham chiếu".** Ngoài định nghĩa, ghi nguồn (luật/tài liệu) để thuật ngữ
   pháp lý/chuyên ngành có cơ sở.

10. **Danh sách Use Case tổng hợp** (bảng: # | Tên Use Case | Tác nhân chính | Mô tả các bước |
    Mã chức năng) — đặt ở cuối BRD hoặc bàn giao sang Pha 3 làm đầu vào đặc tả chi tiết.
