# Persona — Biên tập viên / Content · "Ngọc"

> ⚠️ **Proto-persona (assumption-based).** Dựng từ `docs/ba-docs/` (as-is-process, competitor-analysis, user-stories) + phân tích đối thủ, **chưa qua phỏng vấn người dùng thật**. Cần validate bằng `ux-research` / interview theo `docs/ba-docs/ba-phase2-elicitation/interview-guide.md` trước khi coi là kết luận chắc.
>
> 🎯 **Persona PRIMARY** — là người dùng gắn trực tiếp với North-star metric của VietCMS: *"số nội dung được phát hành bởi người dùng không-kỹ-thuật mỗi tuần"*. Mọi quyết định thiết kế ưu tiên phục vụ Ngọc.

---

## Ảnh chân dung

| | |
|---|---|
| **Tên** | Nguyễn Thị Ngọc |
| **Tuổi / Vai trò** | 27 · Biên tập viên nội dung (Content Editor) |
| **Bối cảnh** | Đội marketing 6 người tại một công ty giáo dục/dịch vụ mid-market (~120 nhân sự) ở TP.HCM |
| **Trình độ kỹ thuật** | **Thấp** — thành thạo Word/Google Docs, Canva; **không biết code**, ngại đụng vào HTML/hosting |
| **Thiết bị** | Laptop công ty (Chrome), điện thoại để duyệt nhanh |

> 💬 *"Mình viết xong bài trong buổi sáng, nhưng để nó lên được website thì phải chờ bạn dev cả tuần — mà nhiều khi chỉ là đổi cái ảnh với sửa vài dòng."*

---

## Mục tiêu (Goals)

1. **Tự xuất bản nội dung mà không cần nhờ dev** — chủ động về thời gian ra bài.
2. Viết nhanh hơn — có công cụ hỗ trợ soạn/đặt lại tiêu đề **tiếng Việt** tốt.
3. Tái sử dụng ảnh/nội dung cũ dễ dàng, không phải tải đi tải lại.
4. Biết rõ bài của mình đang ở đâu trong quy trình duyệt (nháp / chờ duyệt / đã đăng).

## Động lực (Motivations)

- Muốn được ghi nhận qua **số bài lên sóng & hiệu quả**, không phải "chờ dev".
- Ghét cảm giác **bị kẹt, phụ thuộc** người khác cho việc nhỏ.
- Thích công cụ trực quan, "thấy sao được vậy" (WYSIWYG).

## Điểm đau (Pain Points) — truy vết BA docs

| Pain | Mô tả | Nguồn |
|---|---|---|
| **Phụ thuộc dev/agency** | Thay đổi layout, chèn tính năng, đôi khi cả sửa ảnh phải chờ dev → chậm ra thị trường | P1 (as-is) |
| **Viết tốn thời gian, AI tiếng Việt yếu** | Công cụ AI hiện tại dịch cứng, không tự nhiên | P4 |
| **Quy trình duyệt rời rạc** | Gửi bài duyệt qua Zalo/email, mất dấu phiên bản, không biết ai đang giữ | P8 |
| **Công cụ phân mảnh** | Viết ở Docs, ảnh ở Canva, lên bài ở CMS, chat duyệt ở Zalo — chuyển qua lại mệt | P6 |

## Hành vi & thói quen (Behaviors > Demographics)

- Soạn bản thảo trong **Google Docs**, rồi copy sang CMS → vỡ định dạng, phải chỉnh lại.
- Một tuần ra **3–5 bài**; cao điểm campaign nhiều hơn.
- Hay soạn dở, bị gián đoạn → **sợ mất bản nháp** khi mạng chập chờn.
- Chủ động hỏi SEO "tối ưu chưa" và hỏi trưởng phòng "duyệt giúp em" — nhiều khâu thủ công.

## Nhu cầu với sản phẩm (mapping User Stories)

| Nhu cầu | User Story |
|---|---|
| Kéo-thả no-code, tự lưu bản nháp có phiên bản | **US-01 (Must)** |
| Thư viện media tái sử dụng, tự tối ưu WebP/CDN | US-02 (Should) |
| Gửi nội dung đi duyệt, thấy trạng thái | **US-05 (Must)** |
| AI viết nội dung tiếng Việt | US-10 (Should) |
| Xuất bản một chạm lên domain | **US-14 (Must)** |
| Lên lịch xuất bản + preview/staging | US-15 (Should) |

## Kịch bản tiêu biểu (Scenario)

> Ngọc nhận brief viết bài "5 mẹo tối ưu tốc độ tải website". Cô soạn ngay trong trình no-code của VietCMS, gọi **AI** gợi ý dàn ý + tiêu đề chuẩn SEO, chèn ảnh từ **media library** (tự nén WebP). Xong, cô bấm **"Gửi duyệt"** — trưởng phòng nhận thông báo. Sau khi được duyệt, cô **lên lịch xuất bản** 8h sáng mai. Không một dòng code, không nhờ ai.

## Hàm ý thiết kế (Design Implications)

- **Trình soạn thảo phải là màn hình trung tâm**, tối giản, "không dạy học" — Ngọc phải tự làm được trong <30 phút lần đầu (MT-02).
- **Tự lưu + versioning + resilient offline** là bắt buộc (nỗi sợ mất bài).
- Nút **AI** đặt trong ngữ cảnh soạn thảo, dùng màu accent violet để nhận diện.
- Trạng thái bài (nháp/chờ duyệt/đã đăng) phải **hiển thị rõ, mọi lúc** — dùng badge + màu + text.
- Giảm ma sát copy từ Docs: hỗ trợ paste giữ định dạng cơ bản.

## Liên kết
- Journey của Ngọc: [02-journey-tao-duyet-xuat-ban-v1.html](02-journey-tao-duyet-xuat-ban-v1.html)
- Problem statement: [02-problem-statement-v1.md](02-problem-statement-v1.md)
- Persona liên quan: [Trưởng phòng MKT "Hải"](02-persona-truong-phong-marketing-v1.md) (người duyệt bài của Ngọc), [Chuyên viên SEO "Trang"](02-persona-chuyen-vien-seo-v1.md)
