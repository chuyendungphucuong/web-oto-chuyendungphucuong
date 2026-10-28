# QUY CHUẨN KIẾN TRÚC & DỮ LIỆU - Ô TÔ CHUYÊN DÙNG PHÚ CƯỜNG
- Domain: https://chuyendungphucuong.vn | Hotline: 0922 77 77 03 (Mr. Hoàng Vũ)
- Framework: Astro (*.astro). Tuyệt đối không nhầm với Next.js.

## 1. SCHEMA SẢN PHẨM (1-CLICK VEHICLE JSON)
Bắt buộc dùng đúng các key gốc sau:
- name, slug, brand, subCategory, subKey, category (xe-tai-chuyen-dung), price, priceText, promo, summary
- chassisSpecs: Object chứa thông số xe cơ sở (Key tiếng Việt có dấu)
- specialSpecs: Object chứa thông số chuyên dùng (Key tiếng Việt có dấu)
- faqs: Array gồm các object { question, answer }
- description: Chuỗi HTML sạch (h2, h3, p, ul, li, table)

## 2. SCHEMA BÀI VIẾT TIN TỨC (1-CLICK POST JSON)
- id, title, slug, category, date, publishedAt, author, excerpt, summary, image, seo, content (HTML sạch)