import fs from 'fs';
import path from 'path';

function resolveTargetCategoryFile(subKey, category, name) {
  const sk = String(subKey || '').toLowerCase().trim();
  const cat = String(category || '').toLowerCase().trim();
  const nm = String(name || '').toLowerCase();

  if (cat === 'xe-khach' || sk.includes('khach') || sk.endsWith('-cho') || sk.includes('limousine')) {
    if (sk === 'xe-16-29-cho' || /\b(1[6-9]|2[0-9])\s*chỗ/.test(nm)) {
      return 'xe-khach-16-cho.json';
    }
    return 'xe-khach-29-47-cho.json';
  }
  if (sk === 'bon-thuc-pham') return 'xe-bon-cam.json';
  if (sk === 'bon-nuoc' || sk === 'bon-hut-chat-thai') return 'xe-bon-chuyen-dung.json';
  if (sk === 'xe-cau') return 'xe-cau.json';
  if (sk === 'cuu-ho' || sk === 'xe-cuu-ho-giao-thong') return 'xe-cuu-ho.json';
  if (sk === 'nang-dau') return 'xe-nang-dau.json';
  return 'xe-moi-truong-nang.json';
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const {
      slug,
      name,
      brand,
      price,
      minPrice,
      promo,
      customBadges,
      videoUrl,
      summary,
      description,
      images,
      chassisSpecs,
      specialSpecs,
      subCategory,
      subKey,
      category,
      isFeatured,
      faqs
    } = data;

    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: 'Vui lòng cung cấp mã định danh (slug).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const categoriesDir = path.resolve(process.cwd(), 'src/data/categories');
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
    }

    const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
    let updated = false;

    for (const file of files) {
      const filePath = path.join(categoriesDir, file);
      let vehicles = [];
      try {
        vehicles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        vehicles = [];
      }

      const index = vehicles.findIndex((v) => v.slug === slug);
      if (index !== -1) {
        if (name !== undefined) vehicles[index].name = name;
        if (brand !== undefined) vehicles[index].brand = brand;
        if (price !== undefined && price !== '') vehicles[index].price = parseFloat(price);
        if (minPrice !== undefined && minPrice !== '') vehicles[index].minPrice = parseFloat(minPrice);
        if (promo !== undefined) vehicles[index].promo = promo;
        if (customBadges !== undefined) vehicles[index].customBadges = customBadges;
        if (videoUrl !== undefined) vehicles[index].videoUrl = videoUrl;
        if (summary !== undefined) vehicles[index].summary = summary;
        if (description !== undefined) vehicles[index].description = description;
        if (subCategory !== undefined) vehicles[index].subCategory = subCategory;
        if (subKey !== undefined && subKey !== '') vehicles[index].subKey = subKey;
        if (category !== undefined && category !== '') vehicles[index].category = category;
        if (images !== undefined) vehicles[index].images = images;
        if (chassisSpecs !== undefined) vehicles[index].chassisSpecs = chassisSpecs;
        if (specialSpecs !== undefined) vehicles[index].specialSpecs = specialSpecs;
        if (faqs !== undefined) vehicles[index].faqs = faqs;
        if (isFeatured !== undefined) vehicles[index].isFeatured = Boolean(isFeatured);

        fs.writeFileSync(filePath, JSON.stringify(vehicles, null, 2), 'utf-8');
        updated = true;
        break;
      }
    }

    if (!updated) {
      const targetFile = resolveTargetCategoryFile(subKey, category, name);
      const targetPath = path.join(categoriesDir, targetFile);
      let vehicles = [];
      if (fs.existsSync(targetPath)) {
        try {
          vehicles = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
        } catch (e) {
          vehicles = [];
        }
      }

      const parsedPrice = price !== undefined && price !== '' ? parseFloat(price) : 0;
      const parsedMinPrice = minPrice !== undefined && minPrice !== '' ? parseFloat(minPrice) : parsedPrice;

      const newProduct = {
        slug,
        name: name || '',
        brand: brand || 'Phú Cường',
        price: parsedPrice,
        minPrice: parsedMinPrice,
        promo: promo || 'Tặng 100% Bảo hiểm Thân Vỏ & Miễn phí bảo dưỡng định kỳ 2 năm',
        customBadges: Array.isArray(customBadges) ? customBadges : [],
        videoUrl: videoUrl || '',
        summary: summary || '',
        description: description || '',
        subCategory: subCategory || 'Xe Chuyên Dùng',
        subKey: subKey || 'xe-tai-chuyen-dung',
        category: category || 'xe-tai-chuyen-dung',
        images: Array.isArray(images) ? images : [],
        showrooms: ['Bình Chánh, TP.HCM', 'Nhị Quý, Tiền Giang', 'Bình Đức, An Giang'],
        chassisSpecs: chassisSpecs || {},
        specialSpecs: specialSpecs || {},
        faqs: Array.isArray(faqs) ? faqs : [],
        isFeatured: Boolean(isFeatured)
      };

      vehicles.unshift(newProduct);
      fs.writeFileSync(targetPath, JSON.stringify(vehicles, null, 2), 'utf-8');

      return new Response(JSON.stringify({ success: true, message: `Đã tạo mới sản phẩm vào nhóm ${targetFile} thành công!` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Đã cập nhật thông tin sản phẩm thành công!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
