# Chuẩn đầu ra — Pha 3

## 1. SRS / FRS
**Phải có:** giới thiệu, glossary, tổng quan, to-be process, yêu cầu chức năng (use case/story),
yêu cầu phi chức năng, data model, giao diện, tích hợp.
**Đạt chuẩn khi:** mỗi yêu cầu đạt rubric chất lượng (xem `writing-standards.md`); có version & glossary.

## 2. Use Case
**Phải có:** actor, tiền điều kiện, luồng chính, luồng phụ/ngoại lệ, hậu điều kiện, quy tắc nghiệp vụ.
**Đạt chuẩn khi:** luồng đánh số rõ; có ít nhất một luồng ngoại lệ/lỗi.

## 3. User Story + AC
**Phải có:** "As a... I want... so that...", ưu tiên, AC dạng Given-When-Then, truy vết.
**Đạt chuẩn khi:** đủ nhỏ cho một sprint; AC cover luồng chính + biên + lỗi; AC đo được.

## 4. Yêu cầu phi chức năng
**Đạt chuẩn khi:** mỗi NFR có tiêu chí đo cụ thể (vd "< 2s với 95% request", "uptime ≥ 99.5%"),
không dùng từ mơ hồ.

## 5. Data model / ERD
**Đạt chuẩn khi:** phủ mọi thực thể yêu cầu nhắc tới; có quan hệ, khoá, quy tắc hợp lệ, bắt buộc/tuỳ chọn.

## 6. Traceability Matrix
**Đạt chuẩn khi:** mỗi mục tiêu ↔ ≥1 yêu cầu; mỗi yêu cầu ↔ ≥1 story/use case ↔ (test case sau);
không yêu cầu mồ côi; không mục tiêu thiếu yêu cầu.

## Rubric chung
- [ ] Tài liệu có version, ngày, người soạn, trạng thái.
- [ ] Glossary định nghĩa thuật ngữ; dùng từ nhất quán.
- [ ] Mô hình (BPMN/ERD/wireframe) khớp với text.
- [ ] Đã ưu tiên; đã truy vết; đã tự review theo checklist.
