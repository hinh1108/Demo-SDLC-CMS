# Chuẩn viết yêu cầu tốt

## Đặc tính mỗi yêu cầu (chuẩn IEEE / INVEST)
- **Rõ ràng:** một cách hiểu duy nhất.
- **Không nhập nhằng:** tránh "và/hoặc" gây đa nghĩa.
- **Đo lường được:** có tiêu chí định lượng.
- **Khả thi:** trong ràng buộc kỹ thuật/ngân sách/thời gian.
- **Kiểm thử được:** viết được test case xác nhận đạt/không.
- **Đơn nhất (atomic):** một yêu cầu nói một điều.
- **Truy vết được:** có ID, gắn mục tiêu nghiệp vụ.

## Chức năng vs Phi chức năng
- **Chức năng (FR):** hệ thống *làm gì* — "Hệ thống cho phép người dùng đặt lại mật khẩu qua email."
- **Phi chức năng (NFR):** hệ thống *tốt thế nào* — hiệu năng, bảo mật, khả dụng, khả mở rộng, tuân thủ.

## Ví dụ xấu → tốt
| Xấu (mơ hồ) | Tốt (đạt chuẩn) |
|---|---|
| Trang phải tải nhanh | Trang sản phẩm tải dưới 2 giây với 95% request ở 1000 user đồng thời |
| Giao diện thân thiện | Người dùng mới hoàn thành đặt hàng trong ≤ 3 phút không cần hướng dẫn |
| Hệ thống bảo mật | Mật khẩu băm bcrypt; khoá tài khoản sau 5 lần đăng nhập sai trong 10 phút |
| Hỗ trợ xuất báo cáo và in và gửi mail | (tách 3 yêu cầu đơn nhất: xuất / in / gửi mail) |

## Cờ đỏ — gặp là viết lại
"v.v.", "tương tự", "linh hoạt", "thân thiện", "nhanh", "đơn giản", "nếu cần",
"hỗ trợ tất cả", "xử lý mọi trường hợp".

## Acceptance Criteria
Given–When–Then; mỗi story cover luồng chính + biên + lỗi. AC phải đo được, không phụ thuộc diễn giải.
