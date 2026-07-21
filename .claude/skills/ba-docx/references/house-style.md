# House style — chi tiết & ví dụ ráp tài liệu

Tài liệu này mô tả đầy đủ quy ước định dạng và cách dùng `scripts/styles.js`.
Mọi hằng số màu/khoảng cách đã đặt sẵn trong helper; chỉ cần ráp nội dung.

## Thông số nền

| Hạng mục | Giá trị |
|---|---|
| Khổ giấy | US Letter 12240 × 15840 DXA |
| Lề | 1 inch (1440 DXA) mỗi bên → bề rộng nội dung 9360 DXA |
| Font | Times New Roman |
| Cỡ chữ body | 11pt (size 22 nửa-điểm), căn đều, line 300 (~1,25) |
| Heading 1 | 14pt đậm `1F4E79`, gạch chân xanh, đánh số "N. " |
| Heading 2 | 12pt đậm `2E5496`, không số |
| Header bảng | nền `1F4E79`, chữ trắng đậm 9.5pt |
| Sọc thân bảng | dòng chẵn nền `F2F2F2` |
| Viền bảng | `BFBFBF` |
| Hộp ghi chú | nền `D6E4F0`, viền trái xanh dày |
| Footer | xám `808080`, tên tài liệu trái + "Trang x/y" phải |

## Bộ helper trong `scripts/styles.js`

| Hàm | Công dụng |
|---|---|
| `pageProps()` | thuộc tính khổ giấy/lề cho section |
| `docStyles()` | style mặc định + Heading 1/2 |
| `numbering()` | cấu hình bullet (`bullets`) và số (`steps`) |
| `footer(docTitle)` | footer "Trang x/y" |
| `cover({label,title,subtitle,author,version,date})` | trang bìa (trả mảng paragraph, có sẵn ngắt trang) |
| `toc(heading?)` | tiêu đề + mục lục tự động + ngắt trang |
| `h1(text,num)` / `h2(text)` | heading (num là số mục, vd "1") |
| `para(text)` | đoạn văn căn đều |
| `bullet(text)` / `step(text)` | mục danh sách dạng chấm / đánh số |
| `lead(label,rest)` | mảng run: in đậm `label` rồi nối `rest` (dùng trong bullet/para nhiều run) |
| `dataTable(widths,header,rows,opts?)` | bảng dữ liệu header xanh + sọc; `widths` tổng = 9360 |
| `infoTable(pairs,labelW?)` | bảng 2 cột "Trường \| Nội dung" |
| `calloutBox([p1,p2,...])` | hộp ghi chú nền xanh nhạt; mỗi phần tử là chuỗi hoặc mảng run |
| `figure(pngPath,caption,w?,h?)` | hình căn giữa + caption nghiêng |

## Khung tài liệu BA chuẩn

Thứ tự thường dùng: Bìa → Mục lục → 1. Thông tin chung (infoTable) →
2. Tổng quan (para) → các mục nội dung (bảng/bullet/step/figure) →
mục cuối "Ghi chú / định hướng" (calloutBox).

## Ví dụ ráp hoàn chỉnh

```javascript
const fs = require("fs");
const { Document, Packer } = require("docx");
const S = require("./styles");           // cùng thư mục scripts/

const DOC_TITLE = "Mô tả Quy trình Hiện trạng (As-Is) — Module PIS";

const doc = new Document({
  creator: "Phòng Phân tích Nghiệp vụ",
  title: DOC_TITLE,
  styles: S.docStyles(),
  numbering: S.numbering(),
  sections: [{
    properties: S.pageProps(),
    footers: S.footer(DOC_TITLE),
    children: [
      ...S.cover({
        label: "Tài liệu Phân tích Nghiệp vụ",
        title: "Mô tả Quy trình Hiện trạng (As-Is)",
        subtitle: "Giải phẫu bệnh — Module PIS",
        author: "Phòng Phân tích Nghiệp vụ",
        version: "1.0",
        date: "11/06/2026",
      }),
      ...S.toc(),

      S.h1("Thông tin chung", "1"),
      S.infoTable([
        ["Tên quy trình", "Xử lý bệnh phẩm giải phẫu bệnh từ tiếp nhận đến lưu trữ."],
        ["Phạm vi", "Trung tâm Giải phẫu bệnh — Bệnh viện Bạch Mai."],
        ["Nguồn thông tin", "Biên bản phỏng vấn lãnh đạo và khảo sát vòng 2."],
      ]),

      S.h1("Tổng quan", "2"),
      S.para("Quy trình bao gồm nhiều bước chuyên môn liên tiếp, bắt đầu khi bác sĩ lâm sàng tạo chỉ định trên Hệ thống Thông tin Bệnh viện (HIS)."),

      S.h1("Các bước trong quy trình", "3"),
      S.dataTable(
        [460, 1700, 1600, 1900, 1900, 1800],
        ["TT", "Bước", "Người thực hiện", "Đầu vào", "Đầu ra", "Điểm hạn chế"],
        [
          ["1", "Tạo chỉ định", "Bác sĩ lâm sàng", "Yêu cầu xét nghiệm", "Chỉ định", "Còn dùng giấy song song."],
          ["2", "Tiếp nhận và tạo mã", "Nhân viên tiếp nhận", "Bệnh phẩm", "Mã gốc", "Đối chiếu thủ công."],
        ]
      ),

      S.h1("Quy tắc nghiệp vụ", "4"),
      S.bullet("Giữ một mã gốc duy nhất cho mỗi ca."),
      S.bullet(S.lead("Nhuộm bổ sung: ", "tạo y lệnh mới, không mở lại y lệnh đã ký.")),

      S.h1("Quy trình bổ sung", "5"),
      S.step("Bác sĩ đọc ca và ký hoàn thành y lệnh gốc."),
      S.step("Khuyến nghị tạo y lệnh mới trên HIS."),

      S.h1("Sơ đồ luồng", "6"),
      ...S.figure("media/swimlane.png", "Hình 1. Quy trình As-Is theo vai trò"),

      S.h1("Ghi chú định hướng to-be", "7"),
      S.calloutBox([
        S.lead("Trạm quét giao – nhận: ", "ghi trạng thái thời gian thực giữa các phòng."),
        S.lead("Nhuộm bổ sung: ", "liên kết y lệnh bổ sung với y lệnh gốc và khối nến gốc."),
      ]),
    ],
  }],
});

Packer.toBuffer(doc).then((b) => fs.writeFileSync("output.docx", b));
```

## Kiểm tra sau khi dựng

```bash
# validate (dùng script của skill docx nếu có)
python <docx-skill>/scripts/office/validate.py output.docx
# xem thử bằng ảnh
python <docx-skill>/scripts/office/soffice.py --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 90 output.pdf pg
```

Luôn xem ảnh vài trang để chắc tiếng Việt có dấu, bảng không tràn cột, hình
hiển thị đúng trước khi giao file.
