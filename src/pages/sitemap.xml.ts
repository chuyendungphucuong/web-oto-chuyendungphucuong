import { allVehicles } from "../data/vehicles.js";
import postsData from "../data/posts.json";
import navData from "../data/navigation.json";

function escapeXml(unsafe) {
  return String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET({ site }) {
  const baseUrl = site ? site.href.replace(/\/$/, "") : "https://chuyendungphucuong.vn";
  const today = new Date().toISOString().split("T")[0];
  const urlMap = new Map();

  const addUrl = (path, priority, changefreq, lastmod) => {
    if (!path) return;
    const fullUrl = path.startsWith("http") ? path : baseUrl + (path.startsWith("/") ? path : "/" + path);
    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, { loc: fullUrl, priority, changefreq, lastmod: lastmod || today });
    }
  };

  // A. Các trang cốt lõi (Priority cao nhất)
  addUrl("/", "1.0", "daily", today);
  addUrl("/san-pham", "0.9", "daily", today);
  addUrl("/tin-tuc", "0.8", "daily", today);
  addUrl("/tinh-lan-banh", "0.8", "weekly", today);

  // B. Tự động lấy các đường dẫn danh mục từ menu điều hướng
  const mainMenu = Array.isArray(navData?.mainMenu) ? navData.mainMenu : [];
  mainMenu.forEach((item) => {
    if (item?.url && item.url.startsWith("/") && !item.url.includes("#")) {
      addUrl(item.url, "0.8", "weekly", today);
    }
    if (Array.isArray(item?.children)) {
      item.children.forEach((sub) => {
        if (sub?.url && sub.url.startsWith("/") && !sub.url.includes("#")) {
          addUrl(sub.url, "0.8", "weekly", today);
        }
      });
    }
  });

  // C. Tự động quét toàn bộ Sản phẩm xe chuyên dùng (Priority 0.9)
  const vehicles = Array.isArray(allVehicles) ? allVehicles : [];
  vehicles.forEach((v) => {
    if (v && v.slug) {
      addUrl("/san-pham/" + v.slug, "0.9", "weekly", v.updatedAt || today);
    }
  });

  // D. Tự động quét toàn bộ Bài viết Tin tức & So sánh (Priority 0.7)
  const posts = Array.isArray(postsData) ? postsData : [];
  posts.forEach((p) => {
    if (p && p.slug) {
      let postDate = today;
      if (p.publishedAt && /^\d{4}-\d{2}-\d{2}$/.test(p.publishedAt)) {
        postDate = p.publishedAt;
      }
      addUrl("/tin-tuc/" + p.slug, "0.7", "monthly", postDate);
    }
  });

  // E. Xuất định dạng chuẩn XML Sitemap 0.9
  let xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
  for (const item of urlMap.values()) {
    xml += "  <url>\n";
    xml += "    <loc>" + escapeXml(item.loc) + "</loc>\n";
    xml += "    <lastmod>" + escapeXml(item.lastmod) + "</lastmod>\n";
    xml += "    <changefreq>" + item.changefreq + "</changefreq>\n";
    xml += "    <priority>" + item.priority + "</priority>\n";
    xml += "  </url>\n";
  }
  xml += "</urlset>";

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}