---
name: ba-phase3-requirements-design
description: >-
  Hỗ trợ Claude làm Business Analyst ở PHA 3 — Phân tích & Thiết kế Yêu cầu cho dự án phần mềm:
  biến yêu cầu thô (đã thu thập) thành đặc tả rõ ràng, nhất quán, đủ để xây dựng. Bao gồm mô hình hoá
  quy trình to-be (BPMN/flowchart), viết use case và user story kèm acceptance criteria (Given-When-Then),
  yêu cầu phi chức năng, data model/ERD, đặc tả wireframe, ưu tiên (MoSCoW), và traceability matrix.
  Dùng skill này BẤT CỨ KHI NÀO người dùng: viết BRD/SRS/FRS, viết user story hoặc use case, mô hình hoá
  quy trình, vẽ ERD, đặc tả màn hình, lập ma trận truy vết, hay nói chung cần chuyển yêu cầu thành tài liệu
  kỹ thuật đủ để dev làm. Cũng dùng khi REVIEW chất lượng một tài liệu yêu cầu có sẵn. Đây là PHA 3,
  sau Elicitation (pha 2).
---

# BA Pha 3 — Phân tích & Thiết kế Yêu cầu

Mục tiêu: biến yêu cầu thô thành **đặc tả rõ ràng, nhất quán, kiểm thử được, đủ để team xây dựng**.
Đây là nơi BA tạo ra phần lớn tài liệu kỹ thuật và quyết định chất lượng đầu vào cho dev/test.

## ⚙️ Quy ước thư mục Output (BẮT BUỘC)

Mọi deliverable của skill này **phải** lưu vào:

```
[workspace]/output/[tên-dự-án]/ba-docs/ba-phase3-requirements-design/
```

- `[workspace]` = thư mục làm việc hiện tại của user.
- `[tên-dự-án]` = tên dự án viết kebab-case (vd: `loan-management`, `hospital-portal`).
- `ba-docs/ba-phase3-requirements-design` = thư mục cố định cho pha này.

Trước khi tạo file đầu tiên:
1. Xác định tên dự án (từ context hoặc folder `output/` đã có); nếu chưa rõ → hỏi user (kebab-case).
2. Tạo folder nếu chưa có (Write tự tạo parent, hoặc `mkdir -p`).
3. Lưu mọi deliverable của pha vào đúng path trên để các skill khác cùng dự án dùng chung.

## Tư duy cốt lõi

Mỗi yêu cầu phải **rõ ràng, đo lường được, khả thi, không nhập nhằng, kiểm thử được, đơn nhất**.
Tránh từ mơ hồ ("nhanh", "thân thiện") — thay bằng tiêu chí cụ thể. Tách yêu cầu chức năng
(hệ thống *làm gì*) khỏi phi chức năng (hệ thống *tốt thế nào*). Mọi yêu cầu phải truy vết được
về mục tiêu nghiệp vụ và (sau này) về test case.

## 🔁 Quy trình theo bước & Theo dõi tiến độ (Workflow + Resume)

Skill chạy theo các bước dưới đây và **lưu tiến độ** để có thể dừng/tiếp tục bất cứ lúc nào.

**Giao thức BẮT BUỘC mỗi khi skill được gọi:**
1. Mở file tiến độ `output/[tên-dự-án]/ba-docs/ba-phase3-requirements-design/_progress.md`.
   - Nếu **chưa có** → tạo từ mẫu ở cuối mục này (mọi bước `[ ]`) rồi bắt đầu **Bước 1**.
   - Nếu **đã có** → đọc, báo cho user các bước `[x]` đã xong và **tiếp tục từ bước `[ ]` đầu tiên** chưa hoàn thành.
2. Hỏi user: **tiếp tục** từ bước đang dở (mặc định) hay **làm lại từ đầu** (ghi đè `_progress.md`).
3. Hoàn thành mỗi bước → cập nhật `_progress.md`: đánh `[x]`, ghi file đầu ra + ngày + blocker (nếu có).
4. Chỉ đánh `[x]` khi bước đạt cột "Hoàn thành khi" (DoD). Bước có (gate) cần được phê duyệt mới qua.
5. **Ở MỖI bước: hỏi user theo bộ câu hỏi gợi ý trong `references/step-prompts.md`** (hỏi gọn, theo nhóm), chờ trả lời rồi tạo đầu ra từ câu trả lời — user chỉ cần trả lời câu hỏi.

### Các bước
| # | Bước | Hành động chính | Đầu ra | Hoàn thành khi (DoD) |
|---|---|---|---|---|
| 1 | Mô hình hoá to-be + data model | Vẽ to-be (BPMN/swimlane) + ERD | (sơ đồ trong srs) | Mô hình nhất quán với yêu cầu |
| 2 | Phân rã use case / user story | Tách chức năng thành UC/story | use-cases.md / user-stories.md | Mỗi UC có luồng chính/phụ/ngoại lệ |
| 3 | Acceptance criteria | Viết Given–When–Then | (kèm story) | Cover luồng chính + biên + lỗi |
| 4 | Đặc tả phi chức năng | Hiệu năng/bảo mật/khả dụng... | (trong srs) | Mỗi NFR có tiêu chí đo |
| 5 | Đặc tả UX / wireframe | Mô tả màn hình + trường dữ liệu | (trong srs) | Khớp FR; có trạng thái lỗi/empty |
| 6 | Ưu tiên (MoSCoW) | Gán ưu tiên gắn mục tiêu | (trong srs) | Ưu tiên gắn mục tiêu nghiệp vụ |
| 7 | Traceability matrix | Ánh xạ mục tiêu↔REQ↔UC↔test | traceability-matrix.csv | Không yêu cầu mồ côi |
| 8 | Tự review & hoàn thiện SRS | Chấm theo review-checklists | srs.md | Pass checklist; mọi yêu cầu đạt chuẩn |

### Mẫu `_progress.md` (copy vào thư mục output của dự án)
```markdown
# Tiến độ — ba-phase3-requirements-design — Dự án: <tên-dự-án>
Cập nhật lần cuối: <DD/MM/YYYY>

- [ ] B1. Mô hình hoá to-be + data model → đầu ra: (sơ đồ trong srs)
- [ ] B2. Phân rã use case / user story → đầu ra: use-cases.md / user-stories.md
- [ ] B3. Acceptance criteria → đầu ra: (kèm story)
- [ ] B4. Đặc tả phi chức năng → đầu ra: (trong srs)
- [ ] B5. Đặc tả UX / wireframe → đầu ra: (trong srs)
- [ ] B6. Ưu tiên (MoSCoW) → đầu ra: (trong srs)
- [ ] B7. Traceability matrix → đầu ra: traceability-matrix.csv
- [ ] B8. Tự review & hoàn thiện SRS → đầu ra: srs.md

Bước đang làm: <#>
Ghi chú / blocker:
```


## Chuẩn đầu vào (input)
Chi tiết ở `references/input-standards.md`. Cần:
- BRD đã phê duyệt (output Pha 2).
- Requirements Log đã phân loại (output Pha 2).
- Mô tả quy trình As-is.
- Scope Statement & mục tiêu nghiệp vụ (Pha 1) để truy vết.

## Chuẩn đầu ra (output)
Tiêu chuẩn & rubric ở `references/output-standards.md`; chuẩn viết yêu cầu ở
`references/writing-standards.md`; mẫu ở `assets/templates/`:
- **SRS/FRS** — `assets/templates/srs-template.md`
- **Use Case** — `assets/templates/use-case-template.md`
- **User Story + AC** — `assets/templates/user-story-template.md`
- **Traceability Matrix** — `assets/templates/traceability-matrix.csv`
- **Sơ đồ to-be / ERD / wireframe spec** — theo `references/modeling-standards.md`

## Định dạng Acceptance Criteria
```
Given <bối cảnh/tiền điều kiện>
When <hành động của người dùng>
Then <kết quả mong đợi, đo lường được>
```
Mỗi story đủ AC cho luồng chính, luồng phụ và trường hợp lỗi.

## Tiêu chí hoàn thành pha 3
- [ ] Mọi yêu cầu đạt chuẩn chất lượng (clear/measurable/testable/atomic...).
- [ ] To-be process & data model nhất quán với yêu cầu.
- [ ] Mỗi story/use case có AC cover cả lỗi & biên.
- [ ] Yêu cầu phi chức năng có tiêu chí đo.
- [ ] Đã ưu tiên (MoSCoW) gắn với mục tiêu.
- [ ] Traceability matrix đầy đủ: không yêu cầu mồ côi, không mục tiêu thiếu yêu cầu.
- [ ] Đã tự review theo checklist.

## Bàn giao
SRS/Backlog + Traceability Matrix là input cho dev (Pha 4) và test (Pha 5).

## Khi review tài liệu yêu cầu có sẵn
Đọc tài liệu → chấm theo `references/review-checklists.md` → trả về vấn đề CỤ THỂ
(yêu cầu nào, lỗi gì, đề xuất sửa), không nhận xét chung chung.

## Bundled resources
- `references/step-prompts.md` — bộ câu hỏi gợi ý theo từng bước (user trả lời → tạo đầu ra).
- `references/input-standards.md` — tiêu chuẩn input pha 3.
- `references/output-standards.md` — tiêu chuẩn & rubric output pha 3.
- `references/writing-standards.md` — chuẩn viết yêu cầu tốt + ví dụ xấu/tốt.
- `references/modeling-standards.md` — chuẩn BPMN, use case, ERD, wireframe.
- `references/srs-guide.md` — hướng dẫn cấu trúc & cách viết SRS chuẩn doanh nghiệp + rubric.
- `references/diagrams.md` — mẫu sơ đồ Mermaid (flowchart, sequence, ERD, state, gantt) + swimlane PlantUML.
- `references/review-checklists.md` — checklist chất lượng yêu cầu & tài liệu.
- `assets/templates/` — SRS, use case, user story, traceability matrix.
