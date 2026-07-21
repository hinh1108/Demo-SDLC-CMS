---
name: ba-phase1-business-analysis
description: >-
  Hỗ trợ Claude làm Business Analyst ở PHA 1 — Khởi tạo & Phân tích nghiệp vụ của một dự án phần mềm:
  xác định vấn đề/cơ hội nghiệp vụ, stakeholder, mục tiêu SMART, phạm vi (scope), giả định, ràng buộc,
  rủi ro và business case. Dùng skill này BẤT CỨ KHI NÀO người dùng: bắt đầu một dự án/ý tưởng mới và
  cần làm rõ "vì sao làm" trước khi đi vào yêu cầu chi tiết; nhắc tới business case, cost-benefit,
  stakeholder map, RACI, project scope, product vision / tầm nhìn sản phẩm, mục tiêu dự án, vấn đề nghiệp vụ, hoặc cần đánh giá xem một ý
  tưởng phần mềm có đáng làm không — kể cả khi không dùng từ "BA". Đây là pha ĐẦU TIÊN, làm trước
  elicitation (pha 2) và thiết kế yêu cầu (pha 3).
---

# BA Pha 1 — Khởi tạo & Phân tích Nghiệp vụ

Pha này trả lời câu hỏi: **"Vì sao dự án này nên tồn tại, và thành công nghĩa là gì?"**
Mục tiêu là làm rõ vấn đề nghiệp vụ và khung phạm vi TRƯỚC khi tốn công thu thập yêu cầu chi tiết.
Nếu pha này làm ẩu, mọi yêu cầu sau đó có nguy cơ giải quyết sai vấn đề.

## ⚙️ Quy ước thư mục Output (BẮT BUỘC)

Mọi deliverable của skill này **phải** lưu vào:

```
[workspace]/output/[tên-dự-án]/ba-docs/ba-phase1-business-analysis/
```

- `[workspace]` = thư mục làm việc hiện tại của user.
- `[tên-dự-án]` = tên dự án viết kebab-case (vd: `loan-management`, `hospital-portal`).
- `ba-docs/ba-phase1-business-analysis` = thư mục cố định cho pha này.

Trước khi tạo file đầu tiên:
1. Xác định tên dự án (từ context hoặc folder `output/` đã có); nếu chưa rõ → hỏi user (kebab-case).
2. Tạo folder nếu chưa có (Write tự tạo parent, hoặc `mkdir -p`).
3. Lưu mọi deliverable của pha vào đúng path trên để các skill khác cùng dự án dùng chung.

## Tư duy cốt lõi

Tách bạch **vấn đề** với **giải pháp**. Người dùng thường mô tả giải pháp họ tưởng tượng
("tôi cần một app"); việc của BA là lùi lại tìm vấn đề gốc và mục tiêu nghiệp vụ.
Mọi thứ ở pha này phải gắn về giá trị: tại sao tổ chức nên bỏ tiền/thời gian cho việc này.

## 🔁 Quy trình theo bước & Theo dõi tiến độ (Workflow + Resume)

Skill chạy theo các bước dưới đây và **lưu tiến độ** để có thể dừng/tiếp tục bất cứ lúc nào.

**Giao thức BẮT BUỘC mỗi khi skill được gọi:**
1. Mở file tiến độ `output/[tên-dự-án]/ba-docs/ba-phase1-business-analysis/_progress.md`.
   - Nếu **chưa có** → tạo từ mẫu ở cuối mục này (mọi bước `[ ]`) rồi bắt đầu **Bước 1**.
   - Nếu **đã có** → đọc, báo cho user các bước `[x]` đã xong và **tiếp tục từ bước `[ ]` đầu tiên** chưa hoàn thành.
2. Hỏi user: **tiếp tục** từ bước đang dở (mặc định) hay **làm lại từ đầu** (ghi đè `_progress.md`).
3. Hoàn thành mỗi bước → cập nhật `_progress.md`: đánh `[x]`, ghi file đầu ra + ngày + blocker (nếu có).
4. Chỉ đánh `[x]` khi bước đạt cột "Hoàn thành khi" (DoD). Bước có (gate) cần được phê duyệt mới qua.
5. **Ở MỖI bước: hỏi user theo bộ câu hỏi gợi ý trong `references/step-prompts.md`** (hỏi gọn, theo nhóm), chờ trả lời rồi tạo đầu ra từ câu trả lời — user chỉ cần trả lời câu hỏi.

### Các bước
| # | Bước | Hành động chính | Đầu ra | Hoàn thành khi (DoD) |
|---|---|---|---|---|
| 1 | Làm rõ vấn đề/cơ hội | Hỏi vấn đề, đối tượng, chi phí, định vị cạnh tranh mức cao | ghi chú vấn đề (trong business-case) | Vấn đề tách khỏi giải pháp; rõ ai ảnh hưởng & chi phí |
| 2 | Stakeholder + RACI | Liệt kê bên liên quan, gán R/A/C/I | stakeholder-raci.md | Mỗi hoạt động lớn có đúng 1 'A' |
| 3 | Mục tiêu SMART | Đặt mục tiêu + KPI | (trong business-case) | Mọi mục tiêu SMART & có chỉ số |
| 4 | Khoanh phạm vi | In-scope / Out-of-scope | scope-statement.md | Out-of-scope cụ thể, rõ ràng |
| 5 | Giả định/Ràng buộc/Rủi ro | Ghi & xếp hạng rủi ro | risk-log.csv | Mỗi rủi ro có owner + hành động |
| 6 | Business Case | Chi phí–lợi ích + khuyến nghị | business-case.md | Có go/no-go dựa trên dữ liệu |
| 7 | Product Vision | Cô đọng tầm nhìn + north-star | product-vision.md | Nêu rõ cho ai/nhu cầu/khác biệt |
| 8 | Sponsor phê duyệt (gate) | Trình & lấy xác nhận | — | Sponsor xác nhận trước khi sang Pha 2 |

### Mẫu `_progress.md` (copy vào thư mục output của dự án)
```markdown
# Tiến độ — ba-phase1-business-analysis — Dự án: <tên-dự-án>
Cập nhật lần cuối: <DD/MM/YYYY>

- [ ] B1. Làm rõ vấn đề/cơ hội → đầu ra: ghi chú vấn đề (trong business-case)
- [ ] B2. Stakeholder + RACI → đầu ra: stakeholder-raci.md
- [ ] B3. Mục tiêu SMART → đầu ra: (trong business-case)
- [ ] B4. Khoanh phạm vi → đầu ra: scope-statement.md
- [ ] B5. Giả định/Ràng buộc/Rủi ro → đầu ra: risk-log.csv
- [ ] B6. Business Case → đầu ra: business-case.md
- [ ] B7. Product Vision → đầu ra: product-vision.md
- [ ] B8. Sponsor phê duyệt (gate) → đầu ra: —

Bước đang làm: <#>
Ghi chú / blocker:
```


## Chuẩn đầu vào (input)

Trước khi bắt đầu, cần — hoặc phải khai thác — các input sau. Chi tiết tiêu chuẩn chất lượng
từng input nằm ở `references/input-standards.md`:
- Mô tả vấn đề/ý tưởng nghiệp vụ (bối cảnh, nỗi đau).
- Bối cảnh tổ chức (ngành, quy mô, mục tiêu chiến lược liên quan).
- Danh sách bên liên quan ban đầu và người tài trợ (sponsor).
- Ràng buộc đã biết (ngân sách, thời hạn, công nghệ, pháp lý).

## Chuẩn đầu ra (output / deliverable)

Pha này bàn giao các tài liệu sau. Tiêu chuẩn chất lượng và cấu trúc bắt buộc của mỗi tài liệu
nằm ở `references/output-standards.md`; mẫu điền sẵn ở `assets/templates/`:
- **Product Vision** — `assets/templates/product-vision-template.md` (tầm nhìn sản phẩm — kim chỉ nam, viết sớm)
- **Business Case** — `assets/templates/business-case-template.md`
- **Stakeholder Map + RACI** — `assets/templates/stakeholder-raci-template.md`
- **Project Scope Statement** — `assets/templates/scope-statement-template.md`
- **Risk Log** — `assets/templates/risk-log-template.csv`

## Tiêu chí hoàn thành pha 1

- [ ] Vấn đề nghiệp vụ phát biểu rõ, tách khỏi giải pháp.
- [ ] Mọi mục tiêu là SMART và có KPI đo được.
- [ ] Stakeholder đầy đủ, mỗi người có vai trò RACI.
- [ ] Scope in/out minh bạch; giả định & ràng buộc tường minh.
- [ ] Có Product Vision cô đọng (cho ai/nhu cầu/khác biệt) + chỉ số north-star.
- [ ] Business Case có khuyến nghị go/no-go dựa trên chi phí–lợi ích.
- [ ] Sponsor xác nhận trước khi chuyển sang Pha 2 (Elicitation).

## Bàn giao sang Pha 2
Output của pha này (đặc biệt Scope Statement + Stakeholder Map) chính là **input chuẩn** cho
skill `ba-phase2-elicitation`.

## Bundled resources
- `references/step-prompts.md` — bộ câu hỏi gợi ý theo từng bước (user trả lời → tạo đầu ra).
- `references/input-standards.md` — tiêu chuẩn cho mọi input pha 1.
- `references/output-standards.md` — tiêu chuẩn & rubric chất lượng cho mọi deliverable pha 1.
- `references/techniques.md` — kỹ thuật phân tích (5 Whys, SWOT, RACI, SMART, MoSCoW sơ bộ).
- `assets/templates/` — mẫu Product Vision, Business Case, Stakeholder/RACI, Scope, Risk Log.
