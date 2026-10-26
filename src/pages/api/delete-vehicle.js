import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: 'Thiếu mã định danh sản phẩm (slug).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const categoriesDir = path.resolve(process.cwd(), 'src/data/categories');
    const files = fs.readdirSync(categoriesDir);
    let deleted = false;
    let targetVehicle = null;

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(categoriesDir, file);
        const vehicles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const index = vehicles.findIndex((v) => v.slug === slug);
        if (index !== -1) {
          targetVehicle = vehicles[index];
          vehicles.splice(index, 1);
          fs.writeFileSync(filePath, JSON.stringify(vehicles, null, 2), 'utf-8');
          deleted = true;
          break;
        }
      }
    }

    if (!deleted) {
      return new Response(JSON.stringify({ success: false, message: 'Không tìm thấy sản phẩm cần xóa.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tự động dọn dẹp các file hình ảnh nội bộ của sản phẩm trong thư mục public/images/
    if (targetVehicle && Array.isArray(targetVehicle.images)) {
      targetVehicle.images.forEach((imgPath) => {
        if (typeof imgPath === 'string' && imgPath.startsWith('/images/')) {
          const fullPath = path.resolve(process.cwd(), 'public', imgPath.replace(/^\//, ''));
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
            } catch (err) {
              console.error('Không thể xóa ảnh:', fullPath);
            }
          }
        }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Đã xóa sản phẩm và dọn dẹp hình ảnh thành công!' }), {
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
