import fs from "fs";
import path from "path";

// 1. Liệt kê toàn bộ các trang hiện có trong src/pages
function listPages(dir, base = "") {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(listPages(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith(".astro")) {
      results.push("/" + rel.replace(/\\/g, "/").replace(/index\.astro$/, "").replace(/\.astro$/, ""));
    }
  }
  return results;
}

console.log("=== 1. DANH SÁCH TOÀN BỘ ROUTE TRANG WEB ===");
const allRoutes = listPages("src/pages");
console.log(allRoutes.join("\n"));

// 2. Kiểm tra Tracking Google Ads / GTM / Trang Cảm Ơn
console.log("\n=== 2. KIỂM TRA ĐO LƯỜNG CHUYỂN ĐỔI GOOGLE ADS ===");
const camOnFile = fs.existsSync("src/pages/cam-on.astro") ? fs.readFileSync("src/pages/cam-on.astro", "utf8") : "";
console.log("Trang /cam-on tồn tại:", camOnFile ? "✅ Có" : "❌ Thiếu trang /cam-on");
console.log("Có sự kiện dataLayer / gtag trên /cam-on:", /dataLayer|gtag|conversion/i.test(camOnFile) ? "✅ Có" : "⚠️ Chưa có mã bắn sự kiện chuyển đổi riêng");

const layoutTxt = fs.readFileSync("src/layouts/BaseLayout.astro", "utf8");
console.log("Có theo dõi click Hotline / Zalo trong BaseLayout:", /dataLayer\.push|gtag\(/i.test(layoutTxt) ? "✅ Có" : "⚠️ Chưa gắn tracking click Hotline/Zalo");

// 3. Kiểm tra trang Chính sách bảo mật (Bắt buộc cho Google Ads & Form thu Lead)
const hasPrivacy = allRoutes.some((r) => r.includes("chinh-sach") || r.includes("bao-mat") || r.includes("privacy"));
console.log("Có trang Chính sách bảo mật (Yêu cầu của Google Ads):", hasPrivacy ? "✅ Có" : "❌ Thiếu trang Chính sách bảo mật");

// 4. Kiểm tra chất lượng dữ liệu vehicles.js cho SEO & AI Overview
console.log("\n=== 3. KIỂM TRA CHẤT LƯỢNG DỮ LIỆU KHO XE (vehicles.js) ===");
import("./src/data/vehicles.js").then((mod) => {
  const list = Array.isArray(mod.allVehicles) ? mod.allVehicles : [];
  let missingDesc = 0;
  let missingChassis = 0;
  let missingSpecial = 0;
  let missingImages = 0;

  list.forEach((v) => {
    if (!v.description || String(v.description).trim().length < 40) missingDesc++;
    if (!v.chassisSpecs || Object.keys(v.chassisSpecs).length < 3) missingChassis++;
    if (!v.specialSpecs || Object.keys(v.specialSpecs).length < 2) missingSpecial++;
    if (!Array.isArray(v.images) || v.images.length === 0) missingImages++;
  });

  console.log(`Tổng số xe: ${list.length}`);
  console.log(`- Xe thiếu mô tả chi tiết (<40 ký tự): ${missingDesc}/${list.length}`);
  console.log(`- Xe thiếu thông số cơ sở (<3 trường): ${missingChassis}/${list.length}`);
  console.log(`- Xe thiếu thông số chuyên dùng (<2 trường): ${missingSpecial}/${list.length}`);
  console.log(`- Xe thiếu hình ảnh: ${missingImages}/${list.length}`);
});
