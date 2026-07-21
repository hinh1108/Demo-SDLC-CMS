# Mô tả Quy trình Hiện trạng (As-is)

| Trường | Nội dung |
|---|---|
| Quy trình | |
| Phạm vi | |
| Nguồn thông tin | (phỏng vấn/quan sát/tài liệu) |

## Tổng quan
*Mục đích quy trình, người liên quan, kích hoạt khi nào.*

## Các bước hiện tại
| # | Bước | Actor | Đầu vào | Đầu ra | Công cụ/Hệ thống | Pain point |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |

## Quy tắc nghiệp vụ hiện hành
-

## Điểm đau & cơ hội cải tiến
| Pain point | Tác động | Cơ hội cải tiến (to-be sẽ xử lý) |
|---|---|---|
| | | |

## Sơ đồ (PlantUML — swimlane theo vai trò)
*Xem `references/diagrams.md`. Mỗi `|#Màu|Tên lane|` là một vai trò/phòng ban; thay nội dung mẫu
bằng quy trình thực tế.*

```plantuml
@startuml
skinparam defaultFontName "Segoe UI"
skinparam shadowing false
skinparam ActivityBackgroundColor #E3F2FD
skinparam ActivityBorderColor #1565C0
skinparam ActivityDiamondBackgroundColor #FFF8E1
skinparam ActivityDiamondBorderColor #F57F17
skinparam ArrowColor #5B6B79

|#E8F5E9|Người dùng|
start
:Thực hiện bước thủ công 1;

|#E3F2FD|Bộ phận A|
:Tiếp nhận & kiểm tra;
if (Hợp lệ?) then (Không)
  |Người dùng|
  :Bổ sung/sửa thông tin;
  stop
else (Có)
  |#FFF8E1|Bộ phận B|
  :Xử lý & ghi nhận kết quả;
  |Người dùng|
  :Nhận kết quả;
  stop
endif
@enduml
```
