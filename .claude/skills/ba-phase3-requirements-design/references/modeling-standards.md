# Chuẩn mô hình hoá

## BPMN / Flowchart quy trình
- Mỗi quy trình có điểm bắt đầu và kết thúc rõ; mỗi nhánh quyết định có nhãn điều kiện.
- Dùng lane (swimlane) để chỉ actor chịu trách nhiệm mỗi bước.
- To-be phải chỉ rõ điểm khác biệt/cải tiến so với as-is (đánh dấu).
- Không để bước "treo" (không có đầu ra) hay nhánh không hội tụ.

## Use Case
- Đặt tên theo mục tiêu actor ("Đặt hàng", "Hoàn tiền").
- Luồng chính đánh số tuần tự; luồng phụ/ngoại lệ tham chiếu bước rẽ nhánh.
- Phải có ít nhất một luồng lỗi/ngoại lệ.

## User Story map (nếu Agile)
- Sắp theo hành trình người dùng; nhóm theo epic.
- Story đủ nhỏ cho một sprint; nếu to → tách (split theo luồng/quy tắc/dữ liệu).

## ERD / Data model
- Mỗi thực thể có khoá chính; quan hệ có bản số (1-1, 1-n, n-n).
- Mỗi thuộc tính: kiểu, bắt buộc/tuỳ chọn, quy tắc hợp lệ.
- Phủ mọi thực thể mà yêu cầu nhắc tới; không thực thể mồ côi.

## Wireframe / đặc tả màn hình
- Mỗi màn hình liệt kê: thành phần, dữ liệu hiển thị, hành động, trạng thái (empty/loading/error).
- Chỉ rõ luồng điều hướng giữa các màn hình.
- Wireframe khớp với yêu cầu chức năng tương ứng (gắn ID).

## Vẽ bằng mã text (xem `references/diagrams.md`)
Nhúng sơ đồ bằng mã vào SRS/đặc tả thay cho ảnh tĩnh — dễ chỉnh sửa, dễ truy vết qua version control:
- Quy trình to-be / luồng nghiệp vụ có phân vai trò → **swimlane PlantUML** (`|Lane|`).
- Use Case diagram (actor ↔ chức năng) → **Mermaid** mô phỏng (flowchart + include/extend nét đứt).
- Flowchart đơn giản (không phân lane) → **Mermaid** `flowchart`.
- Luồng tương tác/tích hợp use case → **Mermaid** `sequenceDiagram`.
- Data model → **Mermaid** `erDiagram`.
- Vòng đời trạng thái đối tượng → **Mermaid** `stateDiagram-v2`.

## Nguyên tắc chung
Mô hình là công cụ giao tiếp, không phải nghệ thuật. Ưu tiên rõ ràng & nhất quán với text đặc tả.
Mọi mô hình phải đồng bộ với SRS — sửa một bên thì cập nhật bên kia (kể cả mã sơ đồ).
