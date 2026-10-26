import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

// Mã băm SHA-256 của mật khẩu quản trị
const VALID_TOKEN = '8b940be7fb78aaa6b6567dd7a3987996947460df1c668e698eb92ca77e425349';

const GROUP_FILE_MAP: Record<string, string> = {
  'bon-thuc-pham': 'xe-bon-cam.json',
  'bon-nuoc': 'xe-bon-chuyen-dung.json',
  'bon-hut-chat-thai': 'xe-bon-chuyen-dung.json',
  'cuu-ho': 'xe-cuu-ho.json',
  'nang-dau': 'xe-nang-dau.json',
  'cau-truc': 'xe-cau.json',
  'cau-gap': 'xe-cau.json',
  'ep-rac': 'xe-moi-truong-nang.json',
  'xe-nang-khac': 'xe-moi-truong-nang.json',
  '16-cho': 'xe-khach-16-cho.json',
  '29-cho': 'xe-khach-29-47-cho.json',
  '34-cho': 'xe-khach-29-47-cho.json',
  '47-cho': 'xe-khach-29-47-cho.json'
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('x-admin-token');
    if (authHeader !== VALID_TOKEN) {
      return new Response(JSON.stringify({ success: false, message: 'Từ chối truy cập: Chưa xác thực bảo mật!' }), { status: 403 });
    }

    const { type, data } = await request.json();

    if (type === 'vehicles' && Array.isArray(data)) {
      const vehiclesDir = path.resolve('src/data/vehicles');
      if (!fs.existsSync(vehiclesDir)) {
        fs.mkdirSync(vehiclesDir, { recursive: true });
      }

      const buckets: Record<string, any[]> = {};
      for (const v of data) {
        const fName = GROUP_FILE_MAP[v.subKey] || 'xe-khac.json';
        if (!buckets[fName]) buckets[fName] = [];
        buckets[fName].push(v);
      }

      for (const [fName, list] of Object.entries(buckets)) {
        fs.writeFileSync(path.join(vehiclesDir, fName), JSON.stringify(list, null, 2), 'utf-8');
      }

      fs.writeFileSync(path.resolve('src/data/vehicles.json'), JSON.stringify(data, null, 2), 'utf-8');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Đã lưu và phân tách vào các file danh mục thành công!' 
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (type === 'posts' || type === 'navigation') {
      const target = type === 'posts' ? 'src/data/posts.json' : 'src/data/navigation.json';
      fs.writeFileSync(path.resolve(target), JSON.stringify(data, null, 2), 'utf-8');
      return new Response(JSON.stringify({ success: true, message: `Đã lưu ${type}!` }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Loại dữ liệu không hợp lệ' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};
