# CẨM NANG THIẾT LẬP QUẢNG CÁO ĐA KÊNH: GOOGLE ADS & FACEBOOK RETARGETING
**Dự án:** Ô Tô Chuyên Dùng Phú Cường (`chuyendungphucuong.vn`)  
**Sản phẩm mục tiêu:** Xe bồn chở cám (Thức ăn chăn nuôi) dung tích $15\text{m}^3 - 36\text{m}^3$  
**Tổng ngân sách mẫu:** $3.000.000\text{ VNĐ} / 15\text{ ngày}$ ($200.000\text{ VNĐ/ngày}$)

---

## PHẦN 1: CHIẾN LƯỢC PHÂN BỔ NGÂN SÁCH & LUỒNG KHÁCH HÀNG

1. **Google Ads (Tìm kiếm - Search): $82,5\%$ ngân sách ($\approx 165.000\text{ VNĐ/ngày}$)**
   * **Vai trò:** Phễu thu hút khách hàng chủ động có nhu cầu thực tế đang tìm kiếm thông tin, thông số và giá xe bồn cám trên Google.
   * **Đích đến:** Đưa khách hàng truy cập vào website `chuyendungphucuong.vn`.

2. **Google Tag Manager & Meta Pixel: Cầu nối dữ liệu**
   * **Vai trò:** Ghi nhận và lưu trữ toàn bộ danh sách những người đã bấm từ Google vào xem website.

3. **Facebook Ads (Tin nhắn bám đuổi - Retargeting): $17,5\%$ ngân sách ($\approx 35.000\text{ VNĐ/ngày}$)**
   * **Vai trò:** Hiển thị quảng cáo báo giá xưởng và ưu đãi trả góp bám đuổi theo đúng những người vừa xem website khi họ mở Facebook/Messenger.
   * **Đích đến:** Thu hút khách nhắn tin trực tiếp về Fanpage **Hoàng Vũ Xe Chuyên Dùng - Xe Khách SG** để xin số điện thoại/Zalo chốt đơn.

---

## PHẦN 2: QUY TRÌNH CÀI ĐẶT GOOGLE ADS (CHIẾN DỊCH TÌM KIẾM)

### Bước 1: Cài đặt chung cấp Chiến dịch (Campaign)
* **Tên chiến dịch:** `Xe Bồn Cám - Tìm Kiếm`
* **Mục tiêu:** Lượt truy cập trang web / Khách hàng tiềm năng.
* **Mạng quảng cáo (Networks):** 
  * Chỉ tích chọn **Mạng tìm kiếm (Search Network)**.
  * **Bỏ tích** *Mạng hiển thị (Display Network)* và *Bao gồm các đối tác tìm kiếm của Google* để tránh hao hụt ngân sách vào các lượt nhấp chuột rác.
* **Vị trí địa lý:** Nhắm mục tiêu các tỉnh thành trọng điểm chăn nuôi công nghiệp (TP.HCM, Đồng Nai, Bình Dương, Long An, Tiền Giang, Tây Ninh, Bình Phước, khu vực miền Nam & Tây Nguyên).
* **Ngân sách hàng ngày:** `165.000 VNĐ/ngày`.
* **Chiến lược giá thầu:** Tối đa hóa lượt nhấp (Maximize Clicks).

### Bước 2: Thiết lập Nhóm quảng cáo & Từ khóa (Ad Group & Keywords)
Sử dụng định dạng **Từ khóa đối sánh cụm từ (Phrase Match - đặt trong dấu ngoặc kép `""`)** để kiểm soát chất lượng người tìm:
* `"xe bồn chở cám"`
* `"xe bồn chở thức ăn chăn nuôi"`
* `"giá xe bồn chở cám"`
* `"xe bồn cám 36 khối"`
* `"xe bồn cám chenglong"`
* `"xe bồn cám howo"`
* `"đóng bồn chở cám"`

### Bước 3: Danh sách Từ khóa phủ định (Negative Keywords - Bắt buộc)
Thêm vào mục **Từ khóa phủ định** để chặn những người tìm kiếm thông tin không mua xe mới:
* `cũ`, `thanh lý`, `đã qua sử dụng`, `bãi`
* `tuyển dụng`, `việc làm`, `tài xế`, `lái xe`
* `cho thuê`, `thuê xe`
* `mô hình`, `đồ chơi`, `hình ảnh`, `bản vẽ cad`

### Bước 4: Mẫu Quảng cáo Tìm kiếm Thích ứng (RSA)
* **Tiêu đề (Headlines):**
  1. Xe Bồn Chở Cám 15m3 - 36m3 Có Sẵn
  2. Báo Giá Xưởng Đóng Bồn Phú Cường
  3. Xe Bồn Cám Chenglong, Howo, Dongfeng
  4. Hỗ Trợ Trả Góp Ngân Hàng Lên Đến 85%
  5. Bồn Thép Q345B & Hợp Kim Nhôm Cao Cấp
  6. Xả Trục Vít & Thổi Khí Nén Siêu Nhanh
* **Mô tả (Descriptions):**
  1. Chuyên đóng mới và phân phối xe bồn chở thức ăn chăn nuôi từ 15 đến 36 khối. Đầy đủ hồ sơ đăng kiểm, giao xe tận nơi toàn quốc.
  2. Hỗ trợ vay ngân hàng lãi suất ưu đãi, duyệt hồ sơ nhanh. Bảo hành chính hãng tại xưởng Ô Tô Chuyên Dùng Phú Cường. Gọi nhận báo giá ngay!

---

## PHẦN 3: KẾT NỐI META PIXEL QUA GOOGLE TAG MANAGER (GTM)

### Bước 1: Lấy mã ID Meta Pixel
1. Truy cập **Meta Business Suite** -> **Cài đặt cho doanh nghiệp** (`https://business.facebook.com/settings/datasets`) hoặc **Trình quản lý sự kiện** (`https://eventsmanager.facebook.com`).
2. Vào mục **Nguồn dữ liệu** -> **Tập dữ liệu (Datasets)**.
3. Tạo Pixel mới và sao chép dãy số ID.
   * *ID Pixel hiện tại của Phú Cường:* **`279781208541283`**

### Bước 2: Gắn mã Pixel vào Website bằng Google Tag Manager
1. Truy cập `https://tagmanager.google.com` và chọn container `www.ChuyenDungPhuCuong.vn`.
2. Vào mục **Thẻ (Tags)** ở cột trái -> Bấm **Mới (New)**.
3. **Tên thẻ:** `Meta Pixel - PageView`
4. **Cấu hình thẻ (Tag Configuration):** Chọn loại thẻ **HTML tùy chỉnh (Custom HTML)** và dán đoạn mã chuẩn:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '279781208541283');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=279781208541283&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

5. **Kích hoạt (Triggering):** Chọn **`All Pages`** (Tất cả các trang) -> Bấm **Save (Lưu)**.
6. **Xuất bản (Quan trọng):** Bấm nút màu xanh **Submit (Gửi)** ở góc trên bên phải -> Bấm **Publish (Xuất bản)** -> Bấm **Skip (Bỏ qua)**. Màn hình báo **Version is Live** màu xanh lá là hoàn tất.

---

## PHẦN 4: TẠO TỆP ĐỐI TƯỢNG BÁM ĐUỔI TRÊN FACEBOOK (CUSTOM AUDIENCE)

1. Truy cập trực tiếp trang **Đối tượng (Audiences)**: `https://adsmanager.facebook.com/audiences`
2. Bấm **Tạo đối tượng (Create Audience)** -> Chọn **Đối tượng tùy chỉnh (Custom Audience)**.
3. Chọn nguồn: **Trang web (Website)** -> Bấm **Tiếp tục**.
4. Thiết lập thông số:
   * **Nguồn (Source):** Chọn Pixel ID `279781208541283`.
   * **Sự kiện (Events):** *Tất cả khách truy cập trang web (All website visitors)*.
   * **Thời gian lưu giữ (Retention):** `30` ngày.
   * **Tên đối tượng:** `Khach vao web chuyendungphucuong - 30 ngay`
5. Bấm **Tạo đối tượng** -> **Xong**.

---

## PHẦN 5: THIẾT LẬP CHIẾN DỊCH FACEBOOK ADS RETARGETING

Truy cập Trình quản lý quảng cáo: `https://adsmanager.facebook.com` và bấm **`+ Tạo`**.

### Tầng 1: Chiến dịch (Campaign)
* **Mục tiêu chiến dịch:** Chọn **Lượt tương tác (Engagement)** -> Bấm **Tiếp tục**.
* **Tên chiến dịch:** `Retargeting - Xe Bon Cam - Nhan Tin`
* **Chiến lược ngân sách (Quan trọng):** 
  * Tích chọn **Ngân sách nhóm quảng cáo** (Tắt tính năng *Ngân sách chiến dịch Advantage+* để tránh việc Facebook tự áp mức ngân sách mặc định tiền triệu mỗi ngày).
* **Hạng mục quảng cáo đặc biệt / Thử nghiệm A/B:** Để trống / Tắt.
* Bấm **Tiếp**.

### Tầng 2: Nhóm quảng cáo (Ad Set)
1. **Tên nhóm quảng cáo:** `Tep khach vao web chuyendungphucuong - 30 ngay`
2. **Lượt chuyển đổi:**
   * **Vị trí chuyển đổi:** `Đích đến của tin nhắn` (Ứng dụng nhắn tin).
   * **Trang Facebook:** `Hoàng Vũ Xe Chuyên Dùng - Xe Khách SG`
   * **Ứng dụng nhắn tin:** Chỉ tích chọn **Messenger** (bỏ Instagram/WhatsApp).
3. **Ngân sách và lịch chạy:**
   * Chọn **Ngân sách hàng ngày**: Nhập **`35.000` VNĐ**.
   * **Bỏ chọn** ô *"Chia sẻ lên đến 20% ngân sách với các nhóm quảng cáo khác"*.
   * *Lưu ý:* Khi chưa chọn tệp Pixel, Facebook sẽ hiện cảnh báo màu cam *"Quảng cáo có thể không thu được cuộc trò chuyện nào"* vì quy mô đang là 80 triệu người. Sau khi chọn tệp Pixel ở bước dưới, quy mô giảm về *Dưới 1.000*, mức $35.000\text{ VNĐ/ngày}$ sẽ hoạt động hoàn toàn hiệu quả.
4. **Đối tượng (Audience):**
   * Tại mục *Gợi ý đối tượng*, bấm vào chữ xanh **Hiển thị cài đặt**.
   * Tại ô **Thêm những đối tượng tùy chỉnh này** -> Nhấp chuột vào ô kính lúp **`Tìm kiếm đối tượng hiện có`** *(Tuyệt đối không bấm nút Tạo mới -> Đối tượng tương tự)*.
   * Chọn đúng tệp: **`Khach vao web chuyendungphucuong - 30 ngay`**.
   * **Vị trí:** Việt Nam.
   * **Độ tuổi:** Chỉnh từ **`28 - 65+`**.
5. **Vị trí quảng cáo (Placements):**
   * Chuyển từ *Advantage+* sang **Vị trí quảng cáo thủ công (Manual placements)**.
   * Chỉ tích chọn nền tảng **Facebook** và **Messenger** (bỏ chọn Instagram & Audience Network).
   * **Bỏ chọn** ô *"Cho phép chi tiêu giới hạn 5% cho vị trí quảng cáo bị loại trừ"*.
6. Bấm **Tiếp**.

### Tầng 3: Quảng cáo (Ad)
1. **Tên quảng cáo:** `Xe Bon Cam - Bai viet bao gia xuong`
2. **Định dạng:** Chọn **Một hình ảnh/video** (tối ưu diện tích hiển thị trên bảng tin điện thoại tốt hơn nhiều hình).
3. **File phương tiện (Media):**
   * Tải lên 1 hình ảnh chụp thực tế xe bồn cám (Chenglong/Howo) rõ nét tại bãi xe/xưởng ban ngày.
   * Tại bước **Tạo nội dung Advantage+ (Meta AI)**: **Không chọn** bất kỳ hình ảnh biến thể AI nào để giữ nguyên độ chân thực cơ khí của xe -> Bấm **Tiếp**.
4. **Văn bản & Nội dung:**
   * **Văn bản chính (Primary text):**
     ```text
     [BÁO GIÁ XƯỞNG] XE BỒN CHỞ CÁM TỪ 15M³ – 36M³ | GIAO NGAY TOÀN QUỐC

     Bác tài và chủ trang trại đang tìm dòng xe bồn chở thức ăn chăn nuôi tối ưu tải trọng, xả cám nhanh và không lo đọng cám?

     🔹 Đa dạng cấu hình: 3 chân, 4 chân, 5 chân (Chenglong, Howo...) thể tích từ 15 đến 36 khối.
     🔹 Vật liệu cao cấp: Thép chịu lực Q345B hoặc hợp kim nhôm đúc tiêu chuẩn cao, chống ăn mòn, tối ưu tự trọng xe.
     🔹 Hệ thống xả hiện đại: Tùy chọn cơ cấu xả trục vít hoặc hệ thống thổi khí nén công suất lớn, xả sạch đáy bồn.
     🔹 Đầy đủ hồ sơ kiểm định: Xe và bồn ra phiếu xuất xưởng chuẩn đăng kiểm, bao trọn gói thủ tục lăn bánh.

     🎁 Hỗ trợ vay vốn ngân hàng từ 75% - 85% giá trị xe, thủ tục nhanh chóng, giao xe tận nơi!

     Nhắn tin ngay cho Fanpage để nhận bảng báo giá lăn bánh và thông số kỹ thuật chi tiết!
     ```
   * **Tiêu đề (Headline):** `Báo Giá Xe Bồn Cám 15m3 - 36m3 Có Sẵn`
   * **Mô tả (Description):** `Xưởng đóng bồn Phú Cường - Hỗ trợ trả góp 85%`
   * **Nút kêu gọi hành động (CTA):** `Gửi tin nhắn`
5. **Mẫu tin nhắn tự động (Message Template - FAQ):**
   * **Lời chào mở đầu:**  
     `Dạ Chuyên Dùng Phú Cường xin chào Quý khách! Em có thể hỗ trợ bác tài / chủ trang trại thông tin về dòng xe bồn cám dung tích bao nhiêu khối hoặc phương án trả góp nào ạ?`
   * **Câu hỏi 1:** `Tôi muốn nhận báo giá lăn bánh xe bồn cám 36 khối.`  
     *Trả lời tự động:* `Dạ xe bồn cám 36 khối (chassis Howo/Chenglong 5 chân) bên em đang sẵn xe giao ngay, có tùy chọn xả trục vít hoặc thổi khí. Bác cho em xin Số điện thoại/Zalo để nhân viên gửi bảng báo giá lăn bánh chi tiết và thông số thùng ngay nhé ạ!`
   * **Câu hỏi 2:** `Tư vấn giúp tôi thủ tục vay trả góp ngân hàng.`  
     *Trả lời tự động:* `Dạ bên em liên kết các ngân hàng hỗ trợ vay từ 75% - 85% giá trị xe, duyệt hồ sơ nhanh gọn trong 24h, nhận hỗ trợ cả khách hàng cá nhân và doanh nghiệp. Bác để lại số điện thoại để bên em gọi tư vấn gói lãi suất tốt nhất nhé ạ!`
   * **Câu hỏi 3:** `Địa chỉ xưởng/bãi xe ở đâu để tôi qua xem trực tiếp?`  
     *Trả lời tự động:* `Dạ showroom và bãi xe chuyên dùng bên em đặt tại TP. Hồ Chí Minh. Bác có thể ghé trực tiếp xem xe, thử cơ cấu xả bồn. Bác để lại số điện thoại hoặc kết bạn Zalo để em gửi định vị chính xác và đón tiếp chu đáo ạ!`
6. Bấm **Lưu** -> Nhấn nút màu xanh lá **Đăng (Publish)** ở góc dưới cùng bên phải màn hình.

---

## PHẦN 6: CÁCH THEO DÕI & TỐI ƯU ĐỊNH KỲ (SAU MỖI 3 - 5 NGÀY)

1. **Trên Google Ads:**
   * Vào mục **Thông tin chi tiết và báo cáo** -> **Cụm từ tìm kiếm (Search terms)**.
   * Xem khách hàng thực tế đã gõ chữ gì để bấm vào quảng cáo. Nếu phát hiện từ khóa không liên quan (ví dụ: *mua cám con cò*, *bồn nước inox*), lập tức tích chọn và bấm **Thêm dưới dạng từ khóa phủ định**.
2. **Trên Facebook Ads:**
   * Theo dõi cột **Kết quả (Lượt bắt đầu cuộc trò chuyện qua tin nhắn)** và **Chi phí trên mỗi kết quả**.
   * Kiểm tra hộp thư **Meta Business Suite (Inbox)** thường xuyên để phản hồi ngay lập tức khi khách để lại số điện thoại hoặc Zalo.