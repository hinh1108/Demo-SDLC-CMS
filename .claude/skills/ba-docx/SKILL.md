---
name: ba-docx
description: >-
  Tạo tài liệu Business Analyst dạng Word (.docx) theo "house style" chuẩn của
  phòng BA: trang bìa, mục lục tự động, mục đánh số, heading xanh có gạch chân,
  bảng header xanh kẻ viền sọc xen kẽ, hộp ghi chú, footer "Trang x/y", font
  Times New Roman, kèm quy ước biên tập câu chữ tiếng Việt (mở rộng viết tắt,
  câu trang trọng đủ chủ–vị, thống nhất thuật ngữ). HÃY DÙNG skill này BẤT CỨ
  KHI NÀO người dùng cần xuất một tài liệu BA ra Word — BRD, tài liệu hiện trạng
  As-Is, mô tả quy trình, SRS/FRS, biên bản phỏng vấn, đặc tả use case/user
  story — hoặc nói "xuất ra Word", "làm thành file docx", "chuẩn hoá định dạng
  tài liệu", "trình bày cho chuyên nghiệp", kể cả khi không nói chữ "house
  style". Dùng cho ĐỊNH DẠNG & VĂN PHONG của tài liệu BA; nội dung nghiệp vụ
  lấy từ các skill ba-phase1/2/3 hoặc từ chính hội thoại.
---

# ba-docx — Tạo tài liệu BA chuẩn (Word)

## Mục đích

Skill này biến nội dung nghiệp vụ (đã có sẵn từ hội thoại hoặc từ các skill
`ba-phase1/2/3`) thành một file Word trình bày nhất quán, trang trọng, dùng
được ngay để gửi stakeholder. Skill lo hai việc: **định dạng** (house style)
và **biên tập câu chữ** (văn phong tài liệu tiếng Việt). Nội dung phải có
trước; skill không bịa số liệu.

## Quy trình thực hiện

1. **Gom nội dung trước, định dạng sau.** Xác định đầy đủ phần nội dung
   (tiêu đề, các mục, bảng, danh sách, hình). Nếu thiếu, hỏi người dùng hoặc
   lấy từ các skill BA khác — đừng dựng file rỗng rồi mới điền.
2. **Biên tập câu chữ** theo `references/editing-style.md` *trước khi* đưa vào
   tài liệu: mở rộng viết tắt ở lần xuất hiện đầu, viết câu đủ chủ–vị, thống
   nhất thuật ngữ. Việc này làm trên text, không phải trên XML.
3. **Dựng file** bằng `docx-js` và bộ helper dựng sẵn ở `scripts/styles.js`
   (đừng tự viết lại các hàm style từ đầu — mọi quy ước màu/khoảng cách/bảng
   đã nằm trong đó). Xem `references/house-style.md` để biết chi tiết từng
   thành phần và ví dụ ráp tài liệu hoàn chỉnh.
4. **Kiểm tra**: validate file, đổi sang PDF và xem ảnh vài trang để chắc
   tiếng Việt, bảng và hình hiển thị đúng trước khi giao.

## House style — tóm tắt

Bản đầy đủ kèm mã ví dụ ở `references/house-style.md`. Tóm tắt để nắm tinh thần:

- **Khổ & font**: US Letter, lề 1 inch (1440 DXA), Times New Roman 11pt
  (size 22 nửa-điểm), body căn đều (justified), giãn dòng ~1,25 (line 300).
- **Màu chủ đạo**: xanh đậm `1F4E79` (heading 1, header bảng), xanh vừa
  `2E5496` (heading 2), nền sọc bảng `F2F2F2`, viền `BFBFBF`, hộp ghi chú
  nền `D6E4F0`.
- **Trang bìa**: nhãn loại tài liệu (in hoa, xám) → tên tài liệu (lớn, xanh)
  → phụ đề → đơn vị soạn thảo / phiên bản / ngày ban hành. Ngắt trang sau bìa.
- **Mục lục**: `TableOfContents` tự động (`headingStyleRange: "1-2"`), ngắt
  trang sau mục lục.
- **Heading**: đánh số "N. Tiêu đề" cho Heading 1, có gạch chân xanh bên dưới;
  Heading 2 không số. Phải đặt `outlineLevel` để vào được mục lục.
- **Bảng**: header tô `1F4E79` chữ trắng đậm, thân bảng sọc xen kẽ `F2F2F2`,
  kẻ viền `BFBFBF`, có padding ô; luôn dùng `WidthType.DXA` và cho tổng
  `columnWidths` = bề rộng nội dung (9360 DXA).
- **Danh sách**: dùng numbering (`LevelFormat.BULLET` / `DECIMAL`), tuyệt đối
  không gõ ký tự "•" hay "-" thủ công.
- **Hộp ghi chú / định hướng**: bảng 1 ô, viền trái xanh dày, nền `D6E4F0`.
- **Hình**: căn giữa, kèm caption in nghiêng xám "Hình N. …".
- **Footer**: tên tài liệu bên trái, "Trang x/y" bên phải (tab phải), gạch
  ngang phía trên.

## Văn phong biên tập — tóm tắt

Bản đầy đủ + bảng thuật ngữ ở `references/editing-style.md`:

- Mở rộng viết tắt ở lần đầu rồi mới dùng tắt: ví dụ "Hệ thống Thông tin
  Bệnh viện (HIS)", "bác sĩ" (không viết "BS"), "kỹ thuật viên" (không "KTV"),
  "dịch vụ" (không "DV").
- Viết câu đủ chủ–vị, trang trọng, tránh văn nói và dấu "→" trong câu văn
  (dùng "sau đó", "dẫn đến"); dấu "→" chỉ dùng trong sơ đồ/chuỗi bước ngắn.
- Thống nhất thuật ngữ xuyên suốt (một khái niệm — một từ).
- Câu mô tả quy trình nên ở thể bị động/khách quan, nhất quán thì.

## Lưu ý kỹ thuật docx-js

- Đặt khổ giấy tường minh (docx-js mặc định A4).
- Không dùng `\n`; mỗi đoạn là một `Paragraph` riêng.
- `ImageRun` bắt buộc có `type` ("png"/"jpg"...).
- Bảng cần "hai lớp" bề rộng: `columnWidths` (mảng) và `width` từng ô, khớp nhau.
- Dùng `ShadingType.CLEAR` (không SOLID) để tránh nền đen.
- Mục lục chỉ ăn heading dùng `HeadingLevel` + có `outlineLevel`.
