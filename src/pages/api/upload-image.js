import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const title = formData.get('title') || 'oto-chuyen-dung-phu-cuong';
    const folderType = formData.get('type') || 'posts'; // 'products' hoặc 'posts'
    const customSubFolder = formData.get('slug') || '';

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ success: false, message: 'Không tìm thấy file ảnh tải lên.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Tạo slug chuẩn SEO từ tiêu đề hoặc mã xe
    const makeSlug = (str) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .trim()
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-');

    const baseSlug = makeSlug(customSubFolder || title) || 'phu-cuong-auto';

    // 2. Xác định thư mục lưu trữ (Tự động tạo folder riêng cho từng sản phẩm nếu là 'products')
    let relativeDir = 'images/posts';
    if (folderType === 'products') {
      relativeDir = `images/products/${baseSlug}`;
    }

    const uploadDir = path.resolve(process.cwd(), 'public', relativeDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. Tự động đánh số thứ tự file chuẩn SEO (.webp) tránh trùng lặp
    let counter = 1;
    let filename = `${baseSlug}-${counter}.webp`;
    while (fs.existsSync(path.join(uploadDir, filename))) {
      counter++;
      filename = `${baseSlug}-${counter}.webp`;
    }

    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 4. Dùng Sharp tự động xoay đúng chiều ảnh chụp (EXIF), Resize tối đa 1200px và nén sang WebP
    await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 82 })
      .toFile(filePath);

    const fileUrl = `/${relativeDir}/${filename}`;

    return new Response(JSON.stringify({ 
      success: true, 
      url: fileUrl, 
      filename 
    }), {
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
