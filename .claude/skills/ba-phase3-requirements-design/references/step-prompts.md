# Câu hỏi gợi ý theo từng bước — Pha 3

Ở mỗi bước, skill hỏi user theo nhóm câu hỏi dưới đây, chờ trả lời rồi **tạo đầu ra từ câu trả lời**.
Thiếu thông tin → hỏi tiếp, không tự bịa. Đầu vào nền: BRD + Requirements Log + As-is (Pha 2).

## B1. Mô hình hoá to-be + data model
- Quy trình mới (to-be) khác as-is ở điểm nào? Bước nào được tự động hoá?
- Các thực thể dữ liệu chính là gì? Quan hệ giữa chúng (1-1, 1-n, n-n)?

## B2. Phân rã use case / user story
- Mỗi chức năng: actor là ai, mục tiêu là gì, luồng chính các bước?
- Có luồng phụ / ngoại lệ nào?
- (Agile) viết theo "As a... I want... so that..."?

## B3. Acceptance criteria
- Điều kiện nào để coi mỗi story là "đạt"? (Given–When–Then)
- Các trường hợp biên & lỗi cần cover?

## B4. Yêu cầu phi chức năng
- Ngưỡng hiệu năng (thời gian phản hồi, số user đồng thời)?
- Yêu cầu bảo mật / tuân thủ? Uptime/SLA? Khả mở rộng? Đa nền tảng?

## B5. Đặc tả UX / wireframe
- Các màn hình chính? Mỗi màn hiển thị & thao tác gì?
- Trường dữ liệu mỗi màn (định dạng, bắt buộc)? Trạng thái empty/loading/error?

## B6. Ưu tiên (MoSCoW)
- Mức ưu tiên mỗi yêu cầu (Must/Should/Could/Won't)? Gắn với mục tiêu nghiệp vụ nào?

## B7. Traceability matrix
- (Skill lập ma trận; hỏi xác nhận) mỗi yêu cầu gắn mục tiêu nào, story/test nào?
- Có yêu cầu "mồ côi" hoặc mục tiêu thiếu yêu cầu không?

## B8. Tự review & hoàn thiện SRS
- (Skill chấm theo review-checklists) còn yêu cầu mơ hồ / thiếu / mâu thuẫn / không kiểm thử được nào?
