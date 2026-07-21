---
name: ba-phase2-elicitation
description: >-
  Hỗ trợ Claude làm Business Analyst ở PHA 2 — Thu thập yêu cầu (Elicitation) cho dự án phần mềm:
  lập kế hoạch và thực hiện phỏng vấn, workshop/JAD, quan sát, khảo sát, phân tích tài liệu hiện trạng,
  để khai thác đầy đủ nhu cầu (kể cả nhu cầu ẩn) và phân loại yêu cầu. Dùng skill này BẤT CỨ KHI NÀO
  người dùng: chuẩn bị/tiến hành phỏng vấn hay workshop yêu cầu; cần bộ câu hỏi elicitation; phân tích đối thủ / nghiên cứu đối thủ (danh mục chức năng, quy trình, tiêu chí so sánh); muốn ghi
  biên bản và phân loại yêu cầu thô; mô tả quy trình hiện trạng (as-is); hoặc nói chung cần "lấy yêu cầu"
  từ stakeholder trước khi viết đặc tả. Đây là PHA 2, sau khi có scope (pha 1) và trước thiết kế yêu cầu (pha 3).
---

# BA Pha 2 — Thu thập Yêu cầu (Elicitation)

Mục tiêu pha này: **khai thác đầy đủ, chính xác nhu cầu của các bên** — kể cả nhu cầu họ không
tự nói ra — và phân loại yêu cầu thô để pha 3 thiết kế. Chất lượng cả dự án phụ thuộc lớn vào pha này.

## ⚙️ Quy ước thư mục Output (BẮT BUỘC)

Mọi deliverable của skill này **phải** lưu vào:

```
[workspace]/output/[tên-dự-án]/ba-docs/ba-phase2-elicitation/
```

- `[workspace]` = thư mục làm việc hiện tại của user.
- `[tên-dự-án]` = tên dự án viết kebab-case (vd: `loan-management`, `hospital-portal`).
- `ba-docs/ba-phase2-elicitation` = thư mục cố định cho pha này.

Trước khi tạo file đầu tiên:
1. Xác định tên dự án (từ context hoặc folder `output/` đã có); nếu chưa rõ → hỏi user (kebab-case).
2. Tạo folder nếu chưa có (Write tự tạo parent, hoặc `mkdir -p`).
3. Lưu mọi deliverable của pha vào đúng path trên để các skill khác cùng dự án dùng chung.

## Tư duy cốt lõi

Phân biệt **nhu cầu thật** với **giải pháp được đề xuất**. Khi stakeholder nói "tôi cần nút export",
đó là giải pháp — hỏi "để làm gì?" để tìm nhu cầu gốc. Khai thác nhu cầu ngầm bằng quan sát và
ví dụ thật, không chỉ hỏi suông. Luôn xác nhận lại điều đã hiểu để tránh hiểu sai sớm.

## Chọn kỹ thuật elicitation

Chọn theo bối cảnh (chi tiết ở `references/techniques.md`):
- **Phỏng vấn 1-1** — đào sâu, lấy quan điểm cá nhân, chủ đề nhạy cảm.
- **Workshop / JAD** — cần thống nhất nhiều bên, ra quyết định nhanh.
- **Quan sát** — bắt nhu cầu ẩn, kiểm chứng quy trình thực tế.
- **Khảo sát** — cần dữ liệu từ số đông.
- **Phân tích tài liệu** — quy trình, biểu mẫu, hệ thống cũ.
- **Phân tích đối thủ / domain research** — benchmarking chức năng/quy trình/tiêu chí để phát hiện yêu cầu ứng viên.
- **Prototyping** — gợi phản hồi cụ thể khi yêu cầu mơ hồ.

## 🔁 Quy trình theo bước & Theo dõi tiến độ (Workflow + Resume)

Skill chạy theo các bước dưới đây và **lưu tiến độ** để có thể dừng/tiếp tục bất cứ lúc nào.

**Giao thức BẮT BUỘC mỗi khi skill được gọi:**
1. Mở file tiến độ `output/[tên-dự-án]/ba-docs/ba-phase2-elicitation/_progress.md`.
   - Nếu **chưa có** → tạo từ mẫu ở cuối mục này (mọi bước `[ ]`) rồi bắt đầu **Bước 1**.
   - Nếu **đã có** → đọc, báo cho user các bước `[x]` đã xong và **tiếp tục từ bước `[ ]` đầu tiên** chưa hoàn thành.
2. Hỏi user: **tiếp tục** từ bước đang dở (mặc định) hay **làm lại từ đầu** (ghi đè `_progress.md`).
3. Hoàn thành mỗi bước → cập nhật `_progress.md`: đánh `[x]`, ghi file đầu ra + ngày + blocker (nếu có).
4. Chỉ đánh `[x]` khi bước đạt cột "Hoàn thành khi" (DoD). Bước có (gate) cần được phê duyệt mới qua.
5. **Ở MỖI bước: hỏi user theo bộ câu hỏi gợi ý trong `references/step-prompts.md`** (hỏi gọn, theo nhóm), chờ trả lời rồi tạo đầu ra từ câu trả lời — user chỉ cần trả lời câu hỏi.

### Các bước
| # | Bước | Hành động chính | Đầu ra | Hoàn thành khi (DoD) |
|---|---|---|---|---|
| 1 | Lập kế hoạch elicitation | Xác định cần lấy gì/từ ai/kỹ thuật nào | interview-guide.md | Có mục tiêu, đối tượng, câu hỏi chuẩn bị |
| 2 | Thu thập yêu cầu | Phỏng vấn/workshop/quan sát/khảo sát | meeting-minutes.md | Biên bản được người tham gia xác nhận |
| 3 | Phân tích đối thủ / domain research | Benchmarking chức năng/quy trình/tiêu chí | competitor-analysis.md | Có ma trận so sánh + yêu cầu ứng viên |
| 4 | Mô tả As-is | Vẽ/ghi quy trình hiện tại | as-is-process.md | Phản ánh thực tế, có pain point |
| 5 | Phân loại yêu cầu | Gắn loại + nguồn cho từng REQ | requirements-log.csv | Mỗi REQ có loại + nguồn; tách nhu cầu/giải pháp |
| 6 | Câu hỏi mở & mâu thuẫn | Ghi điểm chưa rõ/bất đồng | (trong requirements-log) | Không che giấu bất đồng; có hướng xử lý |
| 7 | Tổng hợp BRD | Gom thành BRD theo brd-guide | brd.md | Đủ cấu trúc + truy vết (Mã CN) |
| 8 | Phê duyệt BRD (gate) | Trình stakeholder duyệt | — | BRD được phê duyệt trước khi sang Pha 3 |

### Mẫu `_progress.md` (copy vào thư mục output của dự án)
```markdown
# Tiến độ — ba-phase2-elicitation — Dự án: <tên-dự-án>
Cập nhật lần cuối: <DD/MM/YYYY>

- [ ] B1. Lập kế hoạch elicitation → đầu ra: interview-guide.md
- [ ] B2. Thu thập yêu cầu → đầu ra: meeting-minutes.md
- [ ] B3. Phân tích đối thủ / domain research → đầu ra: competitor-analysis.md
- [ ] B4. Mô tả As-is → đầu ra: as-is-process.md
- [ ] B5. Phân loại yêu cầu → đầu ra: requirements-log.csv
- [ ] B6. Câu hỏi mở & mâu thuẫn → đầu ra: (trong requirements-log)
- [ ] B7. Tổng hợp BRD → đầu ra: brd.md
- [ ] B8. Phê duyệt BRD (gate) → đầu ra: —

Bước đang làm: <#>
Ghi chú / blocker:
```


## Chuẩn đầu vào (input)
Chi tiết tiêu chuẩn ở `references/input-standards.md`. Cần có:
- Scope Statement & Stakeholder Map (output Pha 1).
- Danh sách người sẽ phỏng vấn/tham gia workshop + lịch.
- Tài liệu hiện trạng (quy trình, biểu mẫu, hệ thống cũ) nếu có.

## Chuẩn đầu ra (output)
Tiêu chuẩn & rubric ở `references/output-standards.md`; mẫu ở `assets/templates/`:
- **BRD (Business Requirements Document)** — `assets/templates/brd-template.md` (khung điền sẵn) +
  `references/brd-guide.md` (hướng dẫn cách viết & rubric từng phần). Đây là deliverable tổng hợp
  chính của pha 2: gom toàn bộ kết quả elicitation thành tài liệu nghiệp vụ thống nhất, được
  stakeholder phê duyệt, làm baseline cho Pha 3. Khi soạn BRD, ĐỌC `references/brd-guide.md` trước
  để theo đúng cấu trúc chuẩn (Introduction → Scope → System Perspective → Process As-Is/To-Be →
  Business Requirements có thang ưu tiên 1–5 → Phụ lục).
- **Requirements Log (đã phân loại)** — `assets/templates/requirements-log.csv`
- **Biên bản phỏng vấn/workshop** — `assets/templates/meeting-minutes-template.md`
- **Mô tả quy trình As-is** — `assets/templates/as-is-process-template.md`
- **Phân tích đối thủ / Domain research** — `assets/templates/competitor-analysis-template.md`
- **Kế hoạch & câu hỏi phỏng vấn** — `assets/templates/interview-guide-template.md`
- **Open Questions / Conflicts log** — gộp trong Requirements Log hoặc biên bản.

Quan hệ: Requirements Log là dữ liệu thô đã phân loại; **BRD là bản tổng hợp & gom nhóm** từ
Requirements Log + As-is, viết ở mức nghiệp vụ (chưa phải đặc tả chức năng — đó là việc của Pha 3).

## Tiêu chí hoàn thành pha 2
- [ ] Mọi nhóm stakeholder chính đã được lấy yêu cầu (không chỉ người dễ gặp).
- [ ] Mỗi yêu cầu đã phân loại và ghi nguồn (ai, khi nào).
- [ ] Đã phân biệt nhu cầu với giải pháp.
- [ ] Mâu thuẫn giữa các bên được ghi nhận, không bị che giấu.
- [ ] Quy trình as-is được mô tả; câu hỏi mở được liệt kê.
- [ ] Biên bản được người tham gia xác nhận.
- [ ] BRD tổng hợp hoàn chỉnh và được sponsor/stakeholder phê duyệt.

## Bàn giao sang Pha 3
BRD đã phê duyệt + Requirements Log đã phân loại + as-is process là **input chuẩn** cho skill
`ba-phase3-requirements-design`.

## Bundled resources
- `references/step-prompts.md` — bộ câu hỏi gợi ý theo từng bước (user trả lời → tạo đầu ra).
- `references/input-standards.md` — tiêu chuẩn input pha 2.
- `references/output-standards.md` — tiêu chuẩn & rubric output pha 2.
- `references/techniques.md` — khi nào dùng kỹ thuật nào + mẹo điều phối.
- `references/question-bank.md` — ngân hàng câu hỏi theo chủ đề.
- `references/brd-guide.md` — hướng dẫn cấu trúc & cách viết BRD chuẩn + rubric chất lượng.
- `references/diagrams.md` — mẫu sơ đồ Mermaid (flowchart, sequence, ERD, state, gantt) + swimlane PlantUML.
- `assets/templates/` — BRD, interview guide, biên bản, requirements log, as-is process, phân tích đối thủ.
