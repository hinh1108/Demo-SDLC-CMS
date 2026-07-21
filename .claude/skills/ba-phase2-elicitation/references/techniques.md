# Kỹ thuật Elicitation — khi nào dùng gì

| Kỹ thuật | Dùng khi | Điểm mạnh | Lưu ý |
|---|---|---|---|
| Phỏng vấn 1-1 | Cần chiều sâu, quan điểm cá nhân, chủ đề nhạy cảm | Khai thác sâu, linh hoạt | Tốn thời gian; dễ thiên lệch theo người được hỏi |
| Workshop / JAD | Cần thống nhất nhiều bên, quyết định nhanh | Giải quyết mâu thuẫn tại chỗ | Cần điều phối tốt; tránh người nói to lấn át |
| Quan sát (shadowing) | Nghi ngờ "nói khác làm", bắt nhu cầu ẩn | Thấy thực tế | Hiệu ứng bị quan sát; tốn công |
| Khảo sát | Cần dữ liệu số đông, phân tán địa lý | Quy mô lớn, định lượng | Câu hỏi phải rõ; tỉ lệ trả lời thấp |
| Phân tích tài liệu | Có hệ thống/quy trình cũ | Khách quan, có sẵn | Tài liệu có thể lỗi thời |
| Prototyping | Yêu cầu mơ hồ, khó hình dung | Phản hồi cụ thể | Dễ sa đà bàn UI thay vì nhu cầu |

## Mẹo điều phối
- **Im lặng có chủ đích:** hỏi xong thì chờ, đừng lấp khoảng trống — người ta sẽ nói thêm.
- **Lấy ví dụ thật:** "kể lần gần nhất anh/chị làm việc này" thay vì hỏi khái quát.
- **Đào nhu cầu gốc:** nghe giải pháp → hỏi "để làm gì / vấn đề là gì".
- **Xác nhận lại:** "ý anh/chị là... đúng không?" để chốt hiểu đúng tại chỗ.
- **Quản lý mâu thuẫn:** ghi nhận cả hai phía, không phân xử vội; chuyển cho người có quyền quyết.
- **Đóng buổi:** hỏi "còn gì quan trọng tôi chưa hỏi?" và "tôi nên gặp ai nữa?".

## Phân tích đối thủ / Domain research (benchmarking)
Một dạng "phân tích tài liệu" mở rộng: nghiên cứu sản phẩm đối thủ & thực tiễn ngành để **phát hiện
yêu cầu ứng viên**, quy tắc nghiệp vụ và chuẩn mực — KHÔNG sao chép, mà rút bài học.
- **Dùng khi:** thị trường đã có sản phẩm tương tự; cần định vị & tìm khoảng trống khác biệt.
- **So sánh gì:** danh mục chức năng, quy trình nghiệp vụ, tiêu chí nghiệp vụ (giá, tích hợp, bảo mật,
  quy mô, đa nền tảng, báo cáo...). Dùng `assets/templates/competitor-analysis-template.md`.
- **Đầu ra:** ma trận so sánh → yêu cầu ứng viên nạp vào Requirements Log (nguồn = "Competitor X");
  kết luận định vị nuôi Product Vision & Business Case (Pha 1).
- **Lưu ý:** so sánh **giao diện/UI chuyên sâu** thuộc `uiux-skills/ux-research`, không làm trùng ở đây.
