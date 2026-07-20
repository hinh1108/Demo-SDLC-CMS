# Problem Statement / Point-of-View — VietCMS

> Phase 2 · Define & Analyze · v1.0 · 2026-07-20
> Đóng khung *problem space* — mô tả **vấn đề**, không gợi giải pháp. Là input cho Phase 3 (Ideation / HMW).

---

## 1. Problem statement chính (primary — persona Ngọc)

> **Biên tập viên nội dung** ở doanh nghiệp marketing mid-market Việt **cần** tự tạo và phát hành nội dung website **bởi vì** chỉ họ hiểu rõ thông điệp và nhịp campaign của mình.
>
> **Vấn đề:** Hiện họ **phụ thuộc lập trình viên/agency** cho những thay đổi không tầm thường và phải **ghép nối nhiều công cụ rời rạc** (Docs, Canva, CMS, chat duyệt, plugin SEO), **dẫn đến** nội dung ra thị trường chậm, chi phí (TCO) cao và khó dự đoán, và đội marketing mất tự chủ.

## 2. Các POV statement theo persona

**Ngọc — Biên tập viên** (primary)
> Ngọc cần **tự đưa nội dung lên website trong vài phút** vì cô ngại code và không muốn chờ dev — *nhưng bất ngờ là* rào cản lớn nhất không phải "viết" mà là **mọi khâu sau khi viết** (dàn trang, duyệt, xuất bản) đều kẹt ở người khác.

**Hải — Trưởng phòng Marketing** (buyer + approver)
> Hải cần **kiểm soát chất lượng và chi phí** vì anh chịu KPI lẫn ngân sách — *nhưng bất ngờ là* thứ khiến anh mất kiểm soát nhiều nhất lại là **sự phân mảnh**: duyệt qua chat, chi phí rải rác ở hosting/plugin/dev, dữ liệu đo ở nhiều nơi.

**Trang — Chuyên viên SEO** (chuyên môn)
> Trang cần **SEO & hiệu năng chạy đúng ngay từ đầu** vì traffic organic là thước đo giá trị của cô — *nhưng bất ngờ là* cô tốn nhiều công nhất cho việc **lắp ghép & bảo trì plugin** và **chờ dev** cho SEO kỹ thuật, thay vì làm chiến lược từ khoá.

## 3. Bối cảnh & bằng chứng (từ BA docs)

- **Khoảng trống thị trường:** Chưa có *marketing CMS no-code bản địa VN*. Local (Haravan/Sapo) thiên commerce; LadiPage chỉ landing → khoảng giữa bỏ ngỏ. *(competitor insight #1)*
- **Khủng hoảng WordPress:** ~11k lỗ hổng/năm (+42% YoY), ~13k site bị hack/ngày, lần đầu giảm thị phần → cơ hội cho "managed, bảo mật, zero-maintenance". *(insight #2)*
- **AI nội dung + SEO tiếng Việt bị bỏ trống** ở local. *(insight #3)*
- **Ma sát giá/tiền tệ:** Webflow Team $2.500, Storyblok €99–349 ngoài tầm mid-market VN → gói dưới 1tr đ/mo, không phí setup thắng về TCO. *(insight #4)*

## 4. "As-is" gãy ở đâu (từ `as-is-process.md`)

Quy trình hiện tại 11 bước; hai điểm nghẽn nghiêm trọng nhất:
- **Bước 6 — Thay đổi layout/tính năng** kẹt ở **Dev/Agency** → P1 (phụ thuộc dev).
- **Bước 11 — Bảo trì/bảo mật** dồn lên **Dev/IT** → P2 (gánh nặng bảo mật WordPress).

Kèm theo các pain xuyên suốt: P3 (SEO lắp plugin), P4 (AI tiếng Việt yếu), P5 (TCO cao), P6 (công cụ phân mảnh), P7 (không bản địa), P8 (duyệt rời rạc).

## 5. Chỉ số thành công (từ Vision/Scope — để đo "đã giải quyết chưa")

- ⭐ **North-star:** số nội dung được **phát hành bởi người dùng không-kỹ-thuật mỗi tuần**.
- **MT-02:** thời gian tự xuất bản trang đầu tiên **< 30 phút** kể từ khi đăng ký.
- **Kích hoạt:** ≥ 70% người dùng thử **xuất bản trang đầu trong 24h**.
- **MT-04:** Lighthouse Performance **≥ 90** trên mobile cho trang xuất bản.

## 6. Ràng buộc (constraints — đóng khung không gian giải pháp)

- **Kỹ thuật:** kiến trúc multi-tenant; SEO/hiệu năng mặc định (SSR/static + CDN).
- **Thời gian:** MVP ~6 tháng; phạm vi tối thiểu (CONFLICT-01 → giữ MVP gọn).
- **Ngân sách:** hạn chế → ưu tiên dùng dịch vụ sẵn có.
- **Pháp lý:** tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
- **Bản địa:** tiếng Việt đầy đủ; thanh toán nội địa (VNPay/MoMo/ZaloPay).

## 7. Ngoài phạm vi lần này (tránh trôi vấn đề)

E-commerce/giỏ hàng, theme/plugin marketplace, i18n ngoài VN/EN, headless API công khai, CRM/automation sâu, native app, A/B testing nâng cao, migrate tự động từ WordPress/Wix. *(theo scope-statement §3)*

---

## Câu "How Might We" gợi ý (bắc cầu sang Phase 3 — ux-ideation)

1. *HMW* giúp một biên tập viên **không-kỹ-thuật** dàn trang & xuất bản trong **dưới 30 phút** mà không chạm tới code?
2. *HMW* biến quy trình **duyệt rời rạc** (chat/email) thành một luồng **trong hệ thống, có truy vết**, đủ nhanh để duyệt trên điện thoại?
3. *HMW* để **SEO & hiệu năng chuẩn ngay từ đầu** mà chuyên viên SEO không phải lắp ghép/bảo trì plugin?
4. *HMW* dùng **AI tiếng Việt** giảm thời gian soạn nội dung mà vẫn giữ giọng thương hiệu?
5. *HMW* làm **chi phí minh bạch, dự đoán được** thành một điểm tin cậy để trưởng phòng yên tâm chọn?

> ➡️ Chuyển các HMW này sang `ux-ideation` (Phase 3) để brainstorm giải pháp.

## Liên kết
- Personas: [Ngọc](02-persona-bien-tap-vien-v1.md) · [Hải](02-persona-truong-phong-marketing-v1.md) · [Trang](02-persona-chuyen-vien-seo-v1.md)
- Journey: [02-journey-tao-duyet-xuat-ban-v1.html](02-journey-tao-duyet-xuat-ban-v1.html) · IA: [02-ia-sitemap-v1.html](02-ia-sitemap-v1.html)
