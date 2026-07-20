# Persona — Chuyên viên SEO · "Trang"

> ⚠️ **Proto-persona (assumption-based).** Dựng từ `docs/ba-docs/`; chưa qua phỏng vấn thật — cần validate.
>
> 🎯 **Persona chuyên môn:** Trang là người biến "nội dung" thành "nội dung được tìm thấy". Cô là cầu nối giữa chất lượng nội dung (Ngọc) và KPI traffic (Hải). SEO/hiệu năng mặc định là một trong 3 lời hứa cốt lõi của VietCMS (MT-04: Lighthouse ≥ 90).

---

## Ảnh chân dung

| | |
|---|---|
| **Tên** | Lê Thu Trang |
| **Tuổi / Vai trò** | 29 · Chuyên viên SEO |
| **Bối cảnh** | Phụ trách SEO on-page + kỹ thuật cho website nội dung của công ty; báo cáo cho Hải |
| **Trình độ kỹ thuật** | **Trung bình–khá** — đọc hiểu HTML/schema cơ bản, dùng thành thạo GA4/Search Console/Ahrefs; **không phải dev**, không tự sửa được code core |
| **Thiết bị** | Laptop (nhiều tab công cụ SEO cùng lúc) |

> 💬 *"Cài Yoast rồi lại thêm plugin sitemap, plugin schema, plugin cache… mỗi lần update là nơm nớp lo xung đột. Mình chỉ muốn SEO chạy đúng ngay từ đầu."*

---

## Mục tiêu (Goals)

1. Nội dung **chuẩn SEO mà không phải lắp ghép plugin** — metadata, sitemap, schema sẵn sàng.
2. **Tối ưu nhanh**: gợi ý tiêu đề/meta/từ khoá áp dụng một chạm.
3. Trang **tải nhanh, Core Web Vitals tốt** (không phụ thuộc cấu hình cache thủ công).
4. Đón đầu **AI-search (AEO)** — nội dung xuất hiện trên ChatGPT/Gemini/Perplexity.

## Động lực (Motivations)

- Traffic organic tăng = giá trị của cô được chứng minh.
- Muốn dành thời gian cho **chiến lược từ khoá & nội dung**, không phải sửa lỗi kỹ thuật/plugin.
- Thích công cụ **đo được, tin được**, không "hên xui" theo plugin.

## Điểm đau (Pain Points) — truy vết BA docs

| Pain | Mô tả | Nguồn |
|---|---|---|
| **SEO/hiệu năng phải lắp ghép plugin** | Nhiều plugin rời, xung đột, kết quả không ổn định | P3 |
| **Phụ thuộc dev cho SEO kỹ thuật** | Sửa schema, canonical, hreflang… phải chờ dev | P1 |
| **AI SEO tiếng Việt yếu ở local** | Công cụ local (Haravan/Sapo) AI nội dung/SEO mỏng | P4 / competitor insight #3 |
| **Dữ liệu đo phân mảnh** | GA4, Search Console, thứ hạng ở nhiều nơi | P6 |

## Hành vi & thói quen

- Làm việc với **nhiều tab**: keyword tool, Search Console, trang đang tối ưu.
- Rà **điểm SEO từng trang** trước khi cho lên; thường phản hồi lại cho Ngọc.
- Theo dõi thứ hạng & Core Web Vitals định kỳ.
- Cập nhật meta/schema cho **nhiều trang cùng lúc** — cần thao tác hàng loạt.

## Nhu cầu với sản phẩm (mapping User Stories)

| Nhu cầu | User Story |
|---|---|
| Quản lý metadata + sitemap tự động, không cần plugin | **US-09 (Must)** |
| AI đề xuất tiêu đề/meta/từ khoá/schema áp một chạm | US-11 (Should) |
| Tối ưu hiển thị AI-search (AEO) | US-12 (Could) |
| Output nhanh, Core Web Vitals tốt (SSR/static + CDN) | (nền tảng — REQ 11, MT-04) |

## Kịch bản tiêu biểu (Scenario)

> Trước khi bài của Ngọc lên sóng, Trang mở tab **SEO** của trang đó: nhập title/description, hệ thống hiển thị **điểm SEO** thời gian thực và gợi ý từ AI (*"tiêu đề nên dưới 60 ký tự", "thêm schema Article"*) — cô áp một chạm. **Sitemap tự cập nhật** khi xuất bản. Không cài plugin nào, không nhờ dev. Cô bật thêm **AEO** để bài có cơ hội xuất hiện trên AI-search.

## Hàm ý thiết kế (Design Implications)

- **Panel SEO gắn liền trang/bài**, hiển thị **điểm SEO trực quan** + gợi ý AI áp-một-chạm.
- Metadata, canonical, schema, sitemap là **mặc định có sẵn**, không phải "cài thêm".
- Hỗ trợ **thao tác hàng loạt** meta cho nhiều trang.
- Hiển thị chỉ số **hiệu năng/Core Web Vitals** để Trang tin tưởng.
- Tính năng AI SEO dùng **màu accent violet** (nhận diện AI), tách khỏi thao tác thủ công.

## Liên kết
- IA/Sitemap (khu vực SEO): [02-ia-sitemap-v1.html](02-ia-sitemap-v1.html)
- Journey (giai đoạn tối ưu SEO): [02-journey-tao-duyet-xuat-ban-v1.html](02-journey-tao-duyet-xuat-ban-v1.html)
- Persona liên quan: [Biên tập viên "Ngọc"](02-persona-bien-tap-vien-v1.md), [Trưởng phòng MKT "Hải"](02-persona-truong-phong-marketing-v1.md)
