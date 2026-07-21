# Sơ đồ cho BA (Mermaid + PlantUML)

Vẽ sơ đồ bằng mã text, nhúng trực tiếp vào markdown (.md), thay cho ảnh tĩnh để dễ chỉnh sửa và
truy vết thay đổi. Quy ước trong tài liệu này:
- **Mermaid** cho flowchart, sequence, ERD, state, gantt — render sẵn trên GitHub/VS Code/Obsidian.
- **PlantUML** cho **swimlane** (Mermaid không có swimlane gốc); Use Case vẽ bằng **Mermaid mô phỏng** — render bằng plugin VS Code/IntelliJ,
  hoặc server plantuml.com / kroki.io.

## Bảng màu chuẩn cho sơ đồ Mermaid
Trong Mermaid, khai báo `classDef` rồi gán bằng `:::tên`. Giữ đúng ý nghĩa màu để dễ nhận diện
(swimlane PlantUML đổi màu lane bằng `|#Màu|Tên|`):

| Vai trò | Ý nghĩa | Màu nền / viền |
|---|---|---|
| `startEnd` | Điểm bắt đầu / kết thúc | xanh lá `#E8F5E9` / `#2E7D32` |
| `process` | Hành động / xử lý | xanh dương `#E3F2FD` / `#1565C0` |
| `decision` | Điểm quyết định | hổ phách `#FFF8E1` / `#F57F17` |
| `data` | Lưu trữ / CSDL | tím `#F3E5F5` / `#6A1B9A` |
| `error` | Lỗi / từ chối | đỏ `#FFEBEE` / `#C62828` |

---

## 1. Flowchart quy trình (As-Is / To-Be)
Dùng cho Business Process Overview. `flowchart TD` (trên→dưới) hoặc `LR` (trái→phải).

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'14px','lineColor':'#90A4AE'}}}%%
flowchart TD
    A([Khách đăng ký vay]):::startEnd --> B[Nộp hồ sơ]:::process
    B --> C{Hồ sơ hợp lệ?}:::decision
    C -- Không --> B
    C -- Có --> D[Thẩm định tín dụng]:::process
    D --> E{Phê duyệt?}:::decision
    E -- Từ chối --> F[Gửi thông báo từ chối]:::error
    E -- Đồng ý --> G[Giải ngân]:::process
    G --> H[("Lưu hồ sơ & lịch trả nợ")]:::data
    H --> I["Theo dõi & nhắc nợ tự động"]:::process
    F --> Z([Kết thúc]):::startEnd
    I --> Z

    classDef startEnd fill:#E8F5E9,stroke:#2E7D32,stroke-width:1.5px,color:#1B5E20
    classDef process fill:#E3F2FD,stroke:#1565C0,stroke-width:1.5px,color:#0D47A1
    classDef decision fill:#FFF8E1,stroke:#F57F17,stroke-width:1.5px,color:#E65100
    classDef data fill:#F3E5F5,stroke:#6A1B9A,stroke-width:1.5px,color:#4A148C
    classDef error fill:#FFEBEE,stroke:#C62828,stroke-width:1.5px,color:#B71C1C
```

Quy ước hình: `([...])` bắt đầu/kết thúc · `[...]` hành động · `{...}` quyết định ·
`[(...)]` cơ sở dữ liệu. Mỗi nhánh quyết định gắn nhãn điều kiện.

---

## 2. Swimlane — dùng PlantUML
**Mermaid không có swimlane gốc** (phải ghép `subgraph` chắp vá, hay vỡ bố cục: lệch chiều cao lane,
mũi tên cắt nhau, `direction` bị bỏ qua). Vì vậy **mọi swimlane dùng PlantUML** — có swimlane dọc gốc
qua cú pháp `|Lane|` trong activity diagram, lane tự căn cột đều, hỗ trợ `if/else`, `while` (vòng lặp),
`fork` (song song). Đặt mã trong khối ```` ```plantuml ... ``` ````. Đổi màu lane bằng `|#Màu|Tên|`.

### Swimlane phân lớp (theo lớp hệ thống)
Luồng mua hàng qua 4 lớp User → Frontend → Backend → Database; mỗi lớp là một lane (cột dọc).

```plantuml
@startuml
skinparam defaultFontName "Segoe UI"
skinparam shadowing false
skinparam ActivityBorderColor #333333
skinparam ArrowColor #5B6B79

|#FFE4B5|User|
start
:Browse Products;
|#87CEEB|Frontend|
:Display Catalog;
|#90EE90|Backend|
:Fetch Products;
|#E6E6FA|Database|
:Query Products;
|Backend|
:Return Products;
|Frontend|
:Render Catalog;

|User|
:Add to Cart;
|Frontend|
:Update Cart UI;
|Backend|
:Update Cart Session;
|Database|
:Save Cart;

|User|
:Checkout;
|Frontend|
:Show Checkout Form;
|Backend|
:Validate Order;

|User|
:Enter Payment;
|Frontend|
:Submit Order;
|Backend|
:Process Payment;
:Create Order;
|Database|
:Insert Order;
stop
@enduml
```

Quy ước: mỗi `|#Màu|Tên lane|` mở một lane (cột dọc); đổi sang lane khác = bàn giao. `:Hành động;`
là một bước; bước viết liên tiếp trong cùng lane sẽ nối dọc xuống. Có thể quay lại lane trước (vd
`Backend → Database → Backend`) để mô tả request/response.

### Quy trình nghiệp vụ end-to-end (có rẽ nhánh & vòng lặp)
Quy trình thực tế nhiều bàn giao, rẽ nhánh, vòng lặp — PlantUML xử lý gọn bằng `if/else`, `while`.

```plantuml
@startuml
skinparam defaultFontName "Segoe UI"
skinparam shadowing false
skinparam ActivityBackgroundColor #E3F2FD
skinparam ActivityBorderColor #1565C0
skinparam ActivityDiamondBackgroundColor #FFF8E1
skinparam ActivityDiamondBorderColor #F57F17
skinparam ArrowColor #5B6B79

|#E8F5E9|Khách hàng|
start
:Đặt hàng;

|#E3F2FD|Bán hàng|
:Tiếp nhận đơn;
if (Còn hàng?) then (Không)
  :Thông báo hết hàng;
  stop
else (Có)
  |#FFF8E1|Kho|
  :Soạn hàng;
  :Đóng gói;

  |#F3E5F5|Kế toán|
  :Xuất hoá đơn;
  while (Đã thanh toán?) is (Chưa)
    :Nhắc thanh toán;
  endwhile (Rồi)

  |#E1F5FE|Giao vận|
  :Giao hàng;

  |Khách hàng|
  :Nhận hàng;
  stop
endif
@enduml
```

Quy ước PlantUML: `|#Màu|Tên lane|` mở lane (cột dọc, đổi lane = bàn giao) · `start`/`stop` điểm đầu/cuối ·
`:Hành động;` bước xử lý · `if (...) then (...) else (...) endif` rẽ nhánh · `while (...) is (...) endwhile (...)`
vòng lặp · `fork`/`fork again`/`end fork` luồng song song.

> Render PlantUML bằng: plugin VS Code "PlantUML", IntelliJ, hoặc server plantuml.com / kroki.io.
> Các sơ đồ khác trong file (flowchart, sequence, ERD, state, gantt) vẫn dùng Mermaid.

---

## 2b. Use Case Diagram — dùng Mermaid (mô phỏng)
Mermaid không có use case gốc → mô phỏng bằng `flowchart`: **actor** = rectangle có 👤, **use case** =
stadium `(["..."])`, quan hệ `include`/`extend` = cạnh nét đứt có nhãn `-.->|include|` / `-.->|extend|`.
Gói các use case trong `subgraph` làm ranh giới hệ thống.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'12px','lineColor':'#9DB2C4'}}}%%
flowchart LR
    U["👤 Người dùng"]:::actor
    A["👤 Admin"]:::actor
    V["👤 Viewer"]:::actor
    subgraph SYS["Hệ thống"]
        direction TB
        UC1(["Đăng nhập"]):::uc
        UC1a(["Xác thực OTP"]):::uc
        UC2(["Quản lý dữ liệu"]):::uc
        UC2a(["Thêm/sửa/xóa bản ghi"]):::uc
        UC3(["Phân quyền"]):::uc
        UC4(["Xem báo cáo"]):::uc
    end
    U --> UC1
    U --> UC2
    A --> UC3
    V --> UC4
    UC1 -.->|include| UC1a
    UC2a -.->|extend| UC2

    classDef actor fill:#E3F2FD,stroke:#1565C0,stroke-width:1.5px,color:#0D47A1
    classDef uc fill:#F3E8FB,stroke:#8E5BD9,stroke-width:1.2px,color:#4A148C
```

---

## 3. Sequence diagram (luồng tương tác hệ thống)
Hữu ích cho use case có nhiều thành phần/tích hợp. `autonumber` đánh số bước tự động.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'14px','actorBkg':'#E3F2FD','actorBorder':'#1565C0','actorTextColor':'#0D47A1','signalColor':'#455A64','signalTextColor':'#263238','noteBkgColor':'#FFF8E1','noteBorderColor':'#F57F17'}}}%%
sequenceDiagram
    autonumber
    actor U as Người dùng
    participant FE as Giao diện
    participant API as Hệ thống
    participant DB as CSDL
    U->>FE: Đặt hàng
    FE->>API: Gửi đơn hàng
    API->>DB: Lưu đơn (trạng thái: chờ)
    DB-->>API: OK
    API-->>FE: Xác nhận + mã đơn
    Note over API,U: Gửi email xác nhận bất đồng bộ
    API->>U: Email xác nhận đơn hàng
```

---

## 4. ERD (mô hình dữ liệu)
Dùng cho yêu cầu dữ liệu / từ điển dữ liệu. Khai báo khoá (PK/FK) và bản số quan hệ.

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'14px'}}}%%
erDiagram
    KHACH_HANG ||--o{ DON_HANG : "đặt"
    DON_HANG ||--|{ CHI_TIET_DON : "gồm"
    SAN_PHAM ||--o{ CHI_TIET_DON : "thuộc"
    KHACH_HANG {
        int id PK
        string ho_ten
        string email
        string so_dien_thoai
    }
    DON_HANG {
        int id PK
        int khach_hang_id FK
        datetime ngay_dat
        string trang_thai
        decimal tong_tien
    }
    CHI_TIET_DON {
        int id PK
        int don_hang_id FK
        int san_pham_id FK
        int so_luong
        decimal don_gia
    }
    SAN_PHAM {
        int id PK
        string ten
        decimal gia
    }
```

Bản số: `||--o{` một-tới-nhiều · `||--||` một-một · `}o--o{` nhiều-nhiều ·
`||--|{` một-tới-một-hoặc-nhiều.

---

## 5. State diagram (vòng đời trạng thái)
Cho đối tượng có nhiều trạng thái (đơn hàng, hồ sơ...).

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'14px'}}}%%
stateDiagram-v2
    direction LR
    [*] --> ChoXuLy
    ChoXuLy --> DaXacNhan: xác nhận
    DaXacNhan --> DangGiao: xuất kho
    DangGiao --> HoanThanh: giao thành công
    ChoXuLy --> Huy: khách huỷ
    DaXacNhan --> Huy: khách huỷ
    HoanThanh --> [*]
    Huy --> [*]

    classDef done fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef cancel fill:#FFEBEE,stroke:#C62828,color:#B71C1C
    class HoanThanh done
    class Huy cancel
```

---

## 6. Gantt (lộ trình dự án) — tuỳ chọn

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Segoe UI, sans-serif','fontSize':'13px'}}}%%
gantt
    title Lộ trình dự án
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Phân tích
    Elicitation        :done,    a1, 2026-06-01, 10d
    BRD & phê duyệt     :active,  a2, after a1, 7d
    section Thiết kế
    SRS & mô hình       :         b1, after a2, 14d
    Review & chốt       :         b2, after b1, 5d
```

---

## Nguyên tắc dùng
- Cây nhiều nhánh (BFD / site map / phân rã chức năng): dùng **`flowchart LR`** (không phải TB/TD) để node con xếp dọc, tránh tràn ngang; nhãn dài nên rút gọn hoặc xuống dòng bằng `<br/>`.
- Giữ đúng bảng màu chuẩn ở mọi sơ đồ để người đọc nhận diện nhanh loại nút.
- Mỗi `classDef`/`init` chỉ cần khai báo một lần trong mỗi khối ```mermaid```.
- Sơ đồ là công cụ giao tiếp — ưu tiên rõ ràng, đồng bộ với mô tả text. Sửa quy trình thì
  cập nhật cả mã Mermaid lẫn bảng mô tả.
- Với BRD: tối thiểu có flowchart As-Is và To-Be.
