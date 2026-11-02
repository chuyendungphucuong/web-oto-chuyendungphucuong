# TÀI LIỆU HƯỚNG DẪN QUẢN TRỊ & BỘ TEMPLATE CHUẨN 1-CLICK JSON
**Hệ thống Website:** Ô Tô Chuyên Dùng Phú Cường (`https://chuyendungphucuong.vn`)  
**Nền tảng:** Astro Framework + TailwindCSS + GitHub + Cloudflare Pages  
**Cập nhật lần cuối:** 31/10/2026

---

## MỤC LỤC
1. [Quy trình vận hành & Đẩy dữ liệu từ Localhost lên Online](#1-quy-trình-vận-hành--đẩy-dữ-liệu-từ-localhost-lên-online)
2. [Hệ thống Chuyên mục & Danh mục chuẩn](#2-hệ-thống-chuyên-mục--danh-mục-chuẩn)
3. [Template JSON 1-Click cho Bài viết Tin tức (`PostSchema`)](#3-template-json-1-click-cho-bài-viết-tin-tức-postschema)
4. [Template JSON 1-Click cho Sản phẩm Xe (`ProductSchema`)](#4-template-json-1-click-cho-sản-phẩm-xe-productschema)
5. [Mẫu mã HTML Bảng so sánh & Định dạng bài viết](#5-mẫu-mã-html-bảng-so-sánh--định-dạng-bài-viết)
6. [Mẫu Câu lệnh (Prompt) giao việc cho AI viết bài mới](#6-mẫu-câu-lệnh-prompt-giao-việc-cho-ai-viết-bài-mới)
7. [Các lệnh Terminal xử lý sự cố thường gặp](#7-các-lệnh-terminal-xử-lý-sự-cố-thường-gặp)

---

## 1. QUY TRÌNH VẬN HÀNH & ĐẨY DỮ LIỆU TỪ LOCALHOST LÊN ONLINE

### Bước 1: Mở môi trường quản trị trên máy Mac (Localhost)
Mở ứng dụng **Terminal**, di chuyển vào thư mục dự án và chạy server nội bộ:
```bash
npm run dev
```
* **Trang chủ nội bộ:** `http://localhost:4321`
* **Trang Quản trị (Admin Dashboard):** `http://localhost:4321/admin`
* **Trang Quản lý Bài viết Tin tức:** `http://localhost:4321/admin/posts`
* **Trang Quản lý Kho xe Sản phẩm:** `http://localhost:4321/admin/products`

### Bước 2: Nạp dữ liệu bằng công cụ 1-Click JSON
1. Truy cập trang tạo mới Bài viết (`/admin/posts/edit`) hoặc Sản phẩm (`/admin/products/edit`).
2. Dán khối mã **JSON 1-Click** vào ô **"Trợ Lý Siêu Tốc (1-Click)"** rồi bấm nút **🚀 Tự Động Điền (1-Click)**.
3. Tải hình ảnh thực tế từ máy tính lên (hệ thống tự động chuyển đổi sang định dạng `.webp` nhẹ và chuẩn SEO).
4. Kiểm tra hoặc chỉnh sửa thêm bằng **Thanh công cụ Bảng so sánh trực quan** rồi bấm **💾 Lưu / Xuất bản**.

### Bước 3: Lệnh Terminal chuẩn để đồng bộ lên GitHub & Cloudflare (Online)
Sau khi đã lưu bài viết hoặc sản phẩm trên Localhost, mở **Terminal** và dán duy nhất cụm lệnh sau:
```bash
git add . && \
git commit -m "Cap nhat du lieu bai viet va san pham moi" && \
git pull origin main --rebase && \
git push origin main
```
*(Sau khoảng 45 - 60 giây, Cloudflare Pages sẽ tự động build xong và cập nhật trực tiếp lên `https://chuyendungphucuong.vn` cùng Sitemap XML).*

---

## 2. HỆ THỐNG CHUYÊN MỤC & DANH MỤC CHUẨN

### 2.1. Chuyên mục Bài viết Tin tức (`category` trong `posts.json`)
Khi tạo JSON cho bài viết, trường `"category"` nên sử dụng 1 trong 4 tên chuẩn sau (hệ thống tìm kiếm và bộ lọc không dấu đã hỗ trợ tự động khớp):
1. `Đánh Giá & So Sánh Xe` *(Dùng cho các bài so sánh 2 dòng xe, đánh giá chi tiết xe)*
2. `Thủ Tục Pháp Lý & Đăng Kiểm` *(Dùng cho bài thông tư đăng kiểm, thủ tục trả góp, cải tạo)*
3. `Kinh Nghiệm Vận Tải & Đầu Tư` *(Dùng cho bài tư vấn chọn xe, bài toán thu hồi vốn, bảo dưỡng)*
4. `Tin Tức & Bàn Giao Xe Showroom` *(Dùng cho bài sự kiện, hình ảnh bàn giao xe cho khách)*

### 2.2. Danh mục Sản phẩm Xe (`category` và `subKey` trong `vehicles.js`)
* **`category` (Nhóm chính):**
  * `xe-tai-chuyen-dung` (Xe tải chuyên dùng các loại)
  * `xe-khach` (Xe khách, Minibus)
* **`subKey` & `subCategory` phổ biến:**
  * `xe-bon-cho-cam` — Xe Bồn Chở Thức Ăn Chăn Nuôi (Bồn Cám)
  * `xe-moi-truong-nang` — Xe Phun Nước Rửa Đường - Môi Trường
  * `xe-cuu-ho-giao-thong` — Xe Cứu Hộ Giao Thông - Sàn Trượt
  * `xe-tai-gan-cau` — Xe Tải Gắn Cẩu Tự Hành
  * `xe-bon-xang-dau` — Xe Bồn Chở Xăng Dầu

---

## 3. TEMPLATE JSON 1-CLICK CHO BÀI VIẾT TIN TỨC (`PostSchema`)

Sử dụng mẫu JSON dưới đây để dán vào ô **1-Click** tại trang `/admin/posts/edit`:

```json
{
  "id": "slug-bai-viet-viet-thuong-khong-dau",
  "title": "Tiêu Đề Bài Viết Chuẩn SEO Chứa Từ Khóa Chính (60 - 70 Ký Tự)",
  "slug": "slug-bai-viet-viet-thuong-khong-dau",
  "category": "Đánh Giá & So Sánh Xe",
  "date": "31/10/2026",
  "publishedAt": "2026-10-31",
  "author": "Phú Cường Auto",
  "excerpt": "Đoạn mô tả ngắn gọn 2-3 câu tóm tắt nội dung cốt lõi của bài viết để hiển thị ngoài danh sách tin tức và thẻ Meta Description.",
  "summary": "Tóm tắt chuẩn AI Overviews: Nêu bật các thông số chính, kết luận so sánh và lợi ích đầu tư thực tế tại Ô Tô Chuyên Dùng Phú Cường.",
  "image": "/images/posts/ten-anh-dai-dien-bai-viet.webp",
  "seo": {
    "metaTitle": "Tiêu Đề SEO Hiển Thị Trên Google | Ô Tô Phú Cường",
    "metaDescription": "Mô tả chuẩn SEO dài 150-160 ký tự chứa từ khóa chính và kêu gọi hành động liên hệ Hotline 0922 77 77 03.",
    "keywords": "từ khóa 1, từ khóa 2, xe chuyên dùng phú cường, báo giá xe chuyên dùng"
  },
  "content": "<h2>Mở Đầu: Đặt Vấn Đề Thực Tế Của Doanh Nghiệp Vận Tải</h2><p>Đoạn văn mở đầu giới thiệu bối cảnh thực tế và lý do khách hàng cần quan tâm đến chủ đề bài viết...</p><h3>1. Bảng So Sánh Thông Số Kỹ Thuật Trực Diện</h3><p>Dưới đây là bảng đối chiếu chi tiết giữa hai phương án đầu tư:</p><div style=\"overflow-x:auto;margin:20px 0;\"><table><thead><tr><th>Tiêu chí so sánh</th><th>Phương án A</th><th>Phương án B</th></tr></thead><tbody><tr><td><strong>Nền xe cơ sở</strong></td><td>Thông số xe A</td><td>Thông số xe B</td></tr><tr><td><strong>Thể tích / Tải trọng</strong></td><td>Thông số tải trọng A</td><td>Thông số tải trọng B</td></tr><tr><td><strong>Hiệu năng vận hành</strong></td><td>Ưu điểm vận hành A</td><td>Ưu điểm vận hành B</td></tr></tbody></table></div><h3>2. Phân Tích Chuyên Sâu Ưu Nhược Điểm Thực Chiến</h3><h4>2.1. Khả năng khai thác và thu hồi vốn</h4><ul><li><strong>Điểm mạnh thứ nhất:</strong> Phân tích chi tiết kèm số liệu cụ thể.</li><li><strong>Điểm mạnh thứ hai:</strong> Phân tích chi tiết kèm số liệu cụ thể.</li></ul><h3>3. Đặt Mua Xe Chuyên Dùng Uy Tín, Hỗ Trợ Trả Góp 85% Tại Ô Tô Phú Cường</h3><p>Hệ thống <strong><a href=\"https://chuyendungphucuong.vn\">Ô Tô Chuyên Dùng Phú Cường</a></strong> cam kết cung cấp sản phẩm chính hãng, hỗ trợ vay ngân hàng 75% - 85%, giao xe tận nơi tại <strong>TP.HCM (Bình Chánh), Tiền Giang và An Giang</strong>. Liên hệ ngay <strong>Hotline/Zalo: 0922 77 77 03</strong> để nhận báo giá lăn bánh tốt nhất!</p>"
}
```

---

## 4. TEMPLATE JSON 1-CLICK CHO SẢN PHẨM XE (`ProductSchema`)

Sử dụng mẫu JSON dưới đây để dán vào ô **1-Click** tại trang `/admin/products/edit`:

```json
{
  "name": "Tên Đầy Đủ Của Mẫu Xe Chuyên Dùng (Kèm Mã Kiểu Loại)",
  "slug": "ten-day-du-cua-mau-xe-chuyen-dung",
  "brand": "CHENGLONG",
  "subCategory": "Xe Phun Nước Rửa Đường - Môi Trường",
  "subKey": "xe-moi-truong-nang",
  "category": "xe-tai-chuyen-dung",
  "price": 0,
  "priceText": "Liên hệ nhận giá tốt",
  "promo": "Hỗ trợ vay trả góp 75% - 85%, đăng ký đăng kiểm trọn gói, giao xe toàn quốc.",
  "summary": "Tóm tắt ngắn gọn cấu hình xe cơ sở, dung tích bồn/thùng chuyên dùng, công suất động cơ và tiêu chuẩn đăng kiểm mới nhất.",
  "chassisSpecs": {
    "Số giấy chứng nhận kiểm định": "26KOT/xxxxxx",
    "Hãng sản xuất / Nhãn hiệu": "Chenglong (Nhập khẩu nguyên chiếc)",
    "Tên thương mại / Mã kiểu loại": "WLW5310...",
    "Loại phương tiện": "Ô tô xi téc / Ô tô chuyên dùng...",
    "Năm sản xuất / Tình trạng": "2026 / Mới 100% chưa qua sử dụng",
    "Công thức bánh xe": "8x4 (4 chân)",
    "Khối lượng bản thân (Tự trọng)": "12.770 kg",
    "Khối lượng chuyên chở cho phép": "17.100 kg",
    "Khối lượng toàn bộ cho phép lớn nhất": "30.000 kg",
    "Kích thước bao (D x R x C)": "11.840 x 2.500 x 3.170 mm",
    "Kích thước lòng thùng / xi téc": "8.200 x 2.120 x 1.270 mm",
    "Khoảng cách trục": "2.100 + 4.600 + 1.350 mm",
    "Ký hiệu loại động cơ": "YC6L350-50 (4 kỳ, 6 xi lanh thẳng hàng, tăng áp)",
    "Thể tích làm việc": "8.424 cm³",
    "Công suất lớn nhất / Tốc độ quay": "257 kW / 2200 vòng/phút (~350 HP)",
    "Cỡ lốp xe": "11.00R20 đồng bộ trước sau"
  },
  "specialSpecs": {
    "Thể tích / Tải trọng chuyên dùng": "17.100 lít (17 khối)",
    "Vật liệu chế tạo": "Thép hợp kim chịu lực Q345B / SS400 chống ăn mòn",
    "Hệ thống bơm / Thủy lực": "Đồng bộ trích công suất PTO từ hộp số xe cơ sở",
    "Tiêu chuẩn kiểm định": "Đạt quy chuẩn theo Thông tư 54/2024/TT-BGTVT của Cục Đăng Kiểm Việt Nam"
  },
  "faqs": [
    {
      "question": "Mẫu xe này được hỗ trợ vay trả góp tối đa bao nhiêu phần trăm?",
      "answer": "Ô Tô Phú Cường hỗ trợ khách hàng cá nhân và doanh nghiệp vay trả góp từ 75% đến 85% giá trị xe và thiết bị chuyên dùng với lãi suất ưu đãi."
    },
    {
      "question": "Thời gian bảo hành và địa điểm bảo dưỡng ở đâu?",
      "answer": "Xe được bảo hành chính hãng theo tiêu chuẩn nhà máy, hỗ trợ bảo dưỡng hệ thống chuyên dùng tận nơi tại TP.HCM (Bình Chánh), Tiền Giang và An Giang."
    }
  ],
  "description": "<h2>Giới Thiệu Tổng Quan Sản Phẩm</h2><p>Mô tả chi tiết ưu điểm khung gầm, động cơ và hệ thống chuyên dùng...</p><h3>1. Đánh Giá Xe Cơ Sở & Động Cơ</h3><ul><li>Chi tiết động cơ...</li><li>Chi tiết khung gầm sắt-xi...</li></ul><h3>2. Kết Cấu Hệ Thống Chuyên Dùng</h3><ul><li>Chi tiết thiết bị chuyên dùng...</li></ul><h3>3. Chính Sách Hỗ Trợ Tại Ô Tô Phú Cường</h3><p>Liên hệ ngay <strong>Hotline/Zalo: 0922 77 77 03</strong> để nhận báo giá lăn bánh ưu đãi nhất!</p>"
}
```

---

## 5. MẪU MÃ HTML BẢNG SO SÁNH & ĐỊNH DẠNG BÀI VIẾT

Trong trang `/admin/posts/edit`, bạn có thể dùng nút **`+ Tạo Bảng Mới`** trên thanh công cụ màu xanh, hoặc dán trực tiếp đoạn mã HTML bảng chuẩn dưới đây vào hộp **"Mã Nguồn HTML Bài Viết"**:

```html
<div style="overflow-x:auto;margin:20px 0;">
  <table>
    <thead>
      <tr>
        <th>Tiêu chí so sánh</th>
        <th>Phiên bản 1</th>
        <th>Phiên bản 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Nền xe cơ sở</strong></td>
        <td>Thông số xe 1</td>
        <td>Thông số xe 2</td>
      </tr>
      <tr>
        <td><strong>Tốc độ vận hành</strong></td>
        <td>Thông số 1</td>
        <td>Thông số 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 6. MẪU CÂU LỆNH (PROMPT) GIAO VIỆC CHO AI VIẾT BÀI MỚI

Mỗi khi cần viết bài tin tức hoặc đăng sản phẩm mới, bạn chỉ cần copy đoạn mẫu dưới đây gửi cho trợ lý AI:

> **Mẫu yêu cầu viết bài Tin tức / So sánh:**  
> *"Với vai trò là chuyên gia SEO xe chuyên dùng của Ô Tô Phú Cường (Hotline 0922 77 77 03, chi nhánh tại Bình Chánh TP.HCM, Tiền Giang, An Giang), hãy viết cho tôi 1 bài viết chuẩn SEO ở mục `Đánh Giá & So Sánh Xe` về chủ đề: **[Nhập tên chủ đề]**. Yêu cầu trong bài phải có thẻ `<table>` so sánh trực diện các tiêu chí kỹ thuật và bài toán kinh tế. Xuất kết quả dưới dạng khối mã JSON 1-Click chuẩn theo file `AGENTS.md`."*

> **Mẫu yêu cầu tạo Sản phẩm mới từ Giấy Đăng Kiểm (PDF/Ảnh):**  
> *"Dựa vào file thông số kỹ thuật / giấy chứng nhận đăng kiểm đính kèm này, hãy viết bài giới thiệu sản phẩm chuẩn SEO và xuất mã JSON 1-Click chuẩn `ProductSchema` trong `AGENTS.md` để tôi nạp vào phần Sản phẩm."*

---

## 7. CÁC LỆNH TERMINAL XỬ LÝ SỰ CỐ THƯỜNG GẶP

### 7.1. Khi lệnh `git push` báo lỗi kẹt file khóa (`.git/index.lock`)
```bash
rm -f .git/index.lock && git add . && git commit -m "Cap nhat du lieu" && git pull origin main --rebase && git push origin main
```

### 7.2. Khi muốn kiểm tra xem trang web có lỗi cú pháp gì không trước khi đẩy lên Cloudflare
```bash
npm run build
```
*(Nếu dòng cuối cùng báo `Complete!` nghĩa là bản build sạch lỗi 100%, đẩy lên Cloudflare chắc chắn thành công).*

### 7.3. Lệnh tự động cập nhật trực tiếp nội dung file `AGENTS.md` này vào thư mục dự án
Nếu muốn lưu toàn bộ nội dung tài liệu mới này đè vào file `AGENTS.md` ngay trên máy Mac, bạn chỉ cần copy nội dung file này dán vào file `AGENTS.md` trong dự án rồi chạy lệnh đồng bộ Git quen thuộc.