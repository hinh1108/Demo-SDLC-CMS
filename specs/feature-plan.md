# VietCMS — Feature Plan (toàn bộ sản phẩm)

> Phase 4 · feature-forge · v1.0 · 2026-07-20
> Kế hoạch feature cho toàn bộ VietCMS: 7 epic · 23 feature. Mỗi feature có **EARS requirements**, acceptance summary, phụ thuộc, ưu tiên (MoSCoW), ước lượng, trạng thái, truy vết.
> Nguồn: `docs/ba-docs/` (23 user stories + AC + 13 BR) · `output/vietcms/architecture/` (roadmap, API, data model).
> Spec chi tiết (EARS + Given/When/Then + error table + TODO) cho feature Must: xem các file `specs/US-*.spec.md`.

## Cách đọc
- **MoSCoW:** Must (MVP bắt buộc) · Should (quan trọng) · Could (nếu kịp) · Won't (bản sau).
- **Effort:** S (≤3 ngày) · M (≤1 tuần) · L (>1 tuần).
- **Status:** ✅ done · 🟡 in-progress · ⬜ todo.
- **EARS:** `When <trigger>, the system shall <response>` · `Where <feature>, the system shall <behaviour>` · `The system shall <action> within <measure>`.

---

## 0. Tổng quan ưu tiên & waves

| Wave | Mục tiêu | Features |
|---|---|---|
| **W0 — Nền tảng** ✅🟡 | Auth, tenancy (RLS), RBAC, list nội dung | Auth+Content list (đã build), US-07 |
| **W1 — MVP core** ⬜ | Đủ để biên tập viên tạo→duyệt→xuất bản + thu tiền | US-01, US-05, US-06, US-09, US-14, US-19 |
| **W2 — Should** ⬜ | Năng suất + đo lường + free plan | US-02, US-10, US-11, US-15, US-16, US-18, US-20 |
| **W3 — Could** ⬜ | Mở rộng giá trị | US-03, US-04, US-08, US-12, US-13, US-17, US-21 |
| **Later** | Ngoài MVP | US-22, US-23 |

Bảng tổng (23 feature):

| ID | Feature | Epic | MoSCoW | Effort | Phụ thuộc | Status |
|---|---|---|---|---|---|---|
| US-01 | Soạn thảo no-code (block editor + version) | 1 | Must | L | Auth, DB | ⬜ |
| US-02 | Thư viện media (WebP/CDN) | 1 | Should | M | US-01, storage | ⬜ |
| US-03 | Template ngành | 1 | Could | M | US-01 | ⬜ |
| US-04 | AI tạo site từ mô tả | 1 | Could | M | US-01, AI | ⬜ |
| US-05 | Gửi duyệt | 2 | Must | S | US-01 | ⬜ |
| US-06 | Duyệt/từ chối + bản ghi | 2 | Must | M | US-05, RBAC | ⬜ |
| US-07 | Quản lý người dùng & vai trò | 2 | Must | M | Auth | ⬜ |
| US-08 | Đa site / workspace | 2 | Could | M | US-07 | ⬜ |
| US-09 | Metadata SEO + sitemap | 3 | Must | M | US-01, publish | ⬜ |
| US-10 | AI viết nội dung tiếng Việt | 3 | Should | M | US-01, AI, quota | ⬜ |
| US-11 | AI gợi ý SEO | 3 | Should | M | US-09, AI | ⬜ |
| US-12 | AEO (AI-search) | 3 | Could | M | US-09 | ⬜ |
| US-13 | AI tạo/tối ưu ảnh | 3 | Could | M | US-02, AI | ⬜ |
| US-14 | Xuất bản 1-chạm + tên miền | 4 | Must | L | US-06, render, CDN | ⬜ |
| US-15 | Lên lịch + preview/staging | 4 | Should | M | US-14, queue | ⬜ |
| US-16 | Form & Lead (public) | 5 | Should | M | US-01, captcha | ⬜ |
| US-17 | Tích hợp kênh (Zalo/FB/GA4/CRM) | 5 | Could | L | US-16 | ⬜ |
| US-18 | Dashboard phân tích | 5 | Should | M | analytics events | ⬜ |
| US-19 | Gói & thanh toán VN | 6 | Must | L | Auth, VNPay | ⬜ |
| US-20 | Gói Free + giá minh bạch | 6 | Should | S | US-19 | ⬜ |
| US-21 | Đa ngôn ngữ (VN/EN + hreflang) | 7 | Could | M | US-01, US-14 | ⬜ |
| US-22 | Headless API (REST/GraphQL) | 7 | Won't | L | — | ⬜ |
| US-23 | White-label multi-tenant billing | 7 | Won't | L | US-08, US-19 | ⬜ |

> **Nền tảng đã có (W0):** đăng nhập JWT, tenancy RLS, list nội dung — xem `specs/auth-content-list_design.md`, `apps/api/`.

---

## Epic 1 — Soạn thảo & quản lý nội dung

### US-01 · Soạn thảo no-code (block editor + versioning) — Must · L
**Value:** Biên tập viên không-kỹ-thuật tự dàn trang & lưu an toàn, không cần dev (North-star).
**EARS:**
- When người dùng kéo một block vào canvas, the system shall chèn block vào đúng vị trí và cập nhật mô hình nội dung.
- When người dùng dừng chỉnh sửa (blur) hoặc theo chu kỳ, the system shall tự lưu một **content_version** mới (BR-01).
- When người dùng đặt slug đã tồn tại trong site, the system shall từ chối lưu và đề xuất slug thay thế (BR-02).
- Where kết nối mạng bị mất, the system shall giữ bản nháp cục bộ và đồng bộ khi có mạng, không mất dữ liệu.
- The system shall phản hồi thao tác lưu **trong < 2 giây** ở tải bình thường (95%).
**AC summary:** tạo/kéo-thả/tự lưu có version; slug trùng → lỗi + gợi ý; offline → sync không mất.
**Deps:** Auth/tenancy (done), DB `content`/`content_version`. **Spec chi tiết:** `specs/US-01-editor.spec.md`.

### US-02 · Thư viện media — Should · M
**EARS:**
- When người dùng tải ảnh lên, the system shall chuyển sang **WebP** và phục vụ qua **CDN**.
- When ảnh vượt dung lượng cho phép của gói, the system shall từ chối và báo rõ giới hạn.
- Where người dùng chèn ảnh vào trang, the system shall tái sử dụng bản đã tối ưu.
**Deps:** object storage + image pipeline (ADR-005/overview).

### US-03 · Template ngành — Could · M
**EARS:** When người dùng chọn template ngành, the system shall tạo site/trang với cấu trúc mẫu phù hợp ngành đó.

### US-04 · AI tạo site từ mô tả — Could · M
**EARS:** When người dùng nhập mô tả doanh nghiệp, the system shall sinh một site nháp có nội dung gợi ý để tinh chỉnh; When AI lỗi, the system shall báo lỗi và không tạo site rỗng.

---

## Epic 2 — Duyệt & cộng tác

### US-05 · Gửi duyệt — Must · S
**EARS:**
- When biên tập viên gửi bản nháp đi duyệt, the system shall chuyển trạng thái sang **review** và thông báo mọi approver được cấu hình (BR-03).
- Where site chưa cấu hình approver, the system shall chặn gửi duyệt và cảnh báo admin thiết lập (BR-04).
**AC:** submit → review + notify; no approver → chặn.
**Deps:** US-01.

### US-06 · Duyệt / từ chối + bản ghi — Must · M
**Value:** Trưởng phòng kiểm soát chất lượng, có truy vết (ai/khi nào).
**EARS:**
- When approver phê duyệt, the system shall chuyển trạng thái **approved** và lưu bản ghi duyệt (người, thời điểm).
- When approver từ chối kèm ghi chú, the system shall đưa nội dung về **draft** và thông báo biên tập viên.
- Where người dùng không có vai trò duyệt, the system shall từ chối hành động (403).
**AC:** approve→approved+record; reject→draft+note+notify; non-manager→403.
**Deps:** US-05, RBAC. **Spec chi tiết:** `specs/US-06-approval.spec.md`.

### US-07 · Quản lý người dùng & vai trò — Must · M
**EARS:**
- When admin mời một email trong hạn mức seat, the system shall gửi lời mời và tạo user trạng thái **pending** (BR-08).
- When admin mời vượt số seat của gói, the system shall chặn và mời nâng cấp (BR-09).
- When người được mời đặt mật khẩu, the system shall kích hoạt và áp ma trận phân quyền.
**AC:** invite→pending+email; over seat→block; accept→active.
**Deps:** Auth.

### US-08 · Đa site / workspace — Could · M
**EARS:** Where người dùng có nhiều site, the system shall cho chuyển đổi và lọc dữ liệu theo site đang chọn, theo quyền.

---

## Epic 3 — SEO, AI

### US-09 · Metadata SEO + sitemap — Must · M
**EARS:**
- When người dùng nhập title/description, the system shall áp metadata vào HTML khi xuất bản.
- When một trang được xuất bản, the system shall tự cập nhật **sitemap**.
- The system shall đạt **Lighthouse ≥ 90 mobile** cho trang xuất bản (MT-04).
**Deps:** US-01, publish pipeline.

### US-10 · AI viết nội dung tiếng Việt — Should · M
**EARS:**
- When người dùng gọi AI với ngữ cảnh, the system shall sinh nội dung tiếng Việt để xem/chỉnh/chấp nhận.
- When người dùng chấp nhận nội dung AI, the system shall trừ **hạn mức** của tenant (BR-07).
- When dịch vụ AI lỗi, the system shall báo lỗi, giữ nội dung gốc và **không** trừ hạn mức.
**Deps:** US-01, AI abstraction (ADR-007), `ai_usage`.

### US-11 · AI gợi ý SEO — Should · M
**EARS:** When người dùng gọi AI SEO cho một trang có nội dung, the system shall trả đề xuất tiêu đề/meta/từ khoá/schema áp-một-chạm.
**Deps:** US-09.

### US-12 · AEO (AI-search) — Could · M
**EARS:** Where AEO bật, the system shall đề xuất cấu trúc/schema giúp trang xuất hiện trên công cụ AI-search.

### US-13 · AI tạo/tối ưu ảnh — Could · M
**EARS:** When người dùng yêu cầu ảnh AI, the system shall chèn ảnh định dạng WebP qua CDN.

---

## Epic 4 — Xuất bản & tên miền

### US-14 · Xuất bản 1-chạm + tên miền — Must · L
**EARS:**
- When người dùng xuất bản nội dung **đã duyệt**, the system shall render trang (SSR/static), đẩy CDN, áp thẻ SEO, cập nhật sitemap.
- Where nội dung **chưa** ở trạng thái approved, the system shall từ chối xuất bản (BR-05).
- Where tên miền chưa sẵn sàng DNS/SSL, the system shall xuất bản tạm trên subdomain (BR-06).
**Deps:** US-06, renderer + CDN. **Spec chi tiết:** `specs/US-14-publishing.spec.md`.

### US-15 · Lên lịch + preview/staging — Should · M
**EARS:**
- When người dùng đặt lịch tương lai cho nội dung đã duyệt, the system shall tự xuất bản đúng giờ.
- When người dùng đặt thời điểm ở quá khứ, the system shall báo lỗi.
**Deps:** US-14, job queue (ADR-006).

---

## Epic 5 — Lead, tích hợp & phân tích

### US-16 · Form & Lead (public) — Should · M
**EARS:**
- When khách gửi form đủ trường hợp lệ và qua captcha, the system shall lưu lead + consent và thông báo chủ site (BR-13, ND 13/2023).
- When thiếu trường/captcha sai, the system shall từ chối và báo lỗi từng trường.
**Deps:** US-01 (block form), captcha.

### US-17 · Tích hợp kênh — Could · L
**EARS:** When người dùng cấu hình tích hợp (Zalo/FB/GA4/pixel/CRM), the system shall đẩy sự kiện/dữ liệu sang dịch vụ tương ứng.

### US-18 · Dashboard phân tích — Should · M
**EARS:**
- When người dùng chọn khoảng thời gian, the system shall tổng hợp sự kiện và hiển thị biểu đồ traffic/SEO/chuyển đổi.
- Where chưa đủ dữ liệu, the system shall hiển thị trạng thái trống kèm hướng dẫn.
**Deps:** analytics events (partitioned).

---

## Epic 6 — Tài khoản, gói & thanh toán

### US-19 · Gói & thanh toán VN — Must · L
**EARS:**
- When admin chọn gói trả phí và thanh toán qua **VNPay/MoMo/ZaloPay** thành công, the system shall kích hoạt gói, phát hành hoá đơn, áp hạn mức (BR-10).
- When thanh toán thất bại N lần, the system shall hạ về gói Free (BR-12).
- The system shall giữ giá gia hạn **không vượt** mức đã cam kết (BR-11).
**Deps:** payment abstraction (ADR-008). **Spec chi tiết:** `specs/US-19-billing.spec.md` *(khi tới W1)*.

### US-20 · Gói Free + giá minh bạch — Should · S
**EARS:** When người dùng đăng ký Free, the system shall áp hạn mức free rõ ràng, không tính phí ẩn.

---

## Epic 7 — Mở rộng (ngoài MVP)

### US-21 · Đa ngôn ngữ VN/EN — Could · M
**EARS:** When bật ngôn ngữ thứ hai và tạo bản dịch, the system shall áp **hreflang** đúng.

### US-22 · Headless API — Won't-this-time · L
**EARS:** When lập trình viên tạo API token, the system shall cấp truy cập nội dung theo scope. *(bề mặt `/public-api/v1` riêng — thiết kế sau).*

### US-23 · White-label multi-tenant billing — Won't-this-time · L
**EARS:** Where white-label bật, the system shall hiển thị thương hiệu đại lý và tách billing theo từng khách.

---

## Non-functional (áp cho mọi feature — từ SRS §III.2)
- **Hiệu năng:** trang xuất bản Lighthouse ≥ 90 mobile; lưu/đăng < 2s p95.
- **Bảo mật:** cô lập tenant (RLS), ND 13/2023, captcha, kiểm soát phiên; managed/vá tự động.
- **Sao lưu:** version mỗi save; khôi phục; backup định kỳ (PITR).
- **Ổn định:** uptime ≥ 99,5%.
- **Dễ dùng:** người mới tự xuất bản < 30 phút; tiếng Việt đầy đủ.

## Error handling (nguyên tắc chung)
Mọi lỗi → **RFC 7807** `application/problem+json` với `type` URI ổn định (xem `openapi-v1.yaml` §error catalog). Auth → thông báo chung; nghiệp vụ → map BR (slug-conflict, approver-not-configured, not-approved, quota-exceeded, plan-limit-exceeded…).

## Trạng thái & bước tiếp
- ✅ W0: Auth + tenancy + Content list (chạy & verify 10/10).
- ⬜ W1 kế tiếp: **US-05 → US-06 → US-01 → US-09 → US-14 → US-19** (thứ tự theo phụ thuộc).
- Spec chi tiết Must (EARS + Given/When/Then + error table + TODO): `specs/US-01-editor.spec.md`, `specs/US-06-approval.spec.md`, `specs/US-14-publishing.spec.md` (tạo kèm). Các feature còn lại spec theo cùng template khi tới wave.
