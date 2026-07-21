# Checklist review chất lượng yêu cầu & tài liệu — Pha 3

Tự kiểm tra trước khi bàn giao, hoặc dùng để soát tài liệu có sẵn. Khi review, trả về vấn đề
**cụ thể**: yêu cầu nào, lỗi gì, đề xuất sửa thế nào.

## 1. Chất lượng từng yêu cầu
- [ ] Rõ ràng (một cách hiểu).
- [ ] Không nhập nhằng.
- [ ] Đo lường được.
- [ ] Khả thi.
- [ ] Kiểm thử được.
- [ ] Đơn nhất.
- [ ] Có ID & truy vết được.
- [ ] Có ưu tiên (MoSCoW).

## 2. Chất lượng tập yêu cầu
- [ ] Đầy đủ: cover luồng chính/phụ/ngoại lệ/lỗi.
- [ ] Nhất quán: không mâu thuẫn.
- [ ] Không trùng lặp.
- [ ] Có cả phi chức năng (hiệu năng/bảo mật/khả dụng/khả mở rộng/tuân thủ).
- [ ] Phạm vi in/out rõ; giả định & ràng buộc tường minh.

## 3. User Story & AC
- [ ] Theo mẫu "As a... I want... so that...", có giá trị độc lập.
- [ ] Đủ nhỏ cho một sprint.
- [ ] AC dạng Given-When-Then.
- [ ] AC cover luồng chính + biên + lỗi.
- [ ] AC đo được, không phụ thuộc diễn giải.

## 4. Mô hình & sơ đồ
- [ ] BPMN/flowchart khớp text.
- [ ] To-be chỉ rõ cải tiến so với as-is.
- [ ] ERD phủ mọi thực thể được nhắc tới.
- [ ] Wireframe khớp yêu cầu chức năng.

## 5. Traceability
- [ ] Mỗi mục tiêu ↔ ≥1 yêu cầu.
- [ ] Mỗi yêu cầu ↔ ≥1 story/use case ↔ (test case sau).
- [ ] Không yêu cầu mồ côi (nghi scope creep).
- [ ] Không mục tiêu thiếu yêu cầu (nghi thiếu sót).

## 6. Trình bày
- [ ] Có version, ngày, người soạn, trạng thái.
- [ ] Glossary đầy đủ; thuật ngữ nhất quán.
- [ ] Phần tổng quan người không kỹ thuật hiểu được.

## Cờ đỏ
"v.v.", "tương tự", "linh hoạt", "thân thiện", "nhanh", "đơn giản", "nếu cần",
"hỗ trợ tất cả", "xử lý mọi trường hợp".
