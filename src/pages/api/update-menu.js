import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { mainMenu } = data;

    if (!mainMenu || !Array.isArray(mainMenu)) {
      return new Response(JSON.stringify({ success: false, message: 'Dữ liệu menu không hợp lệ.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const navFilePath = path.resolve(process.cwd(), 'src/data/navigation.json');
    const newNavData = { mainMenu };

    fs.writeFileSync(navFilePath, JSON.stringify(newNavData, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: 'Đã cập nhật và áp dụng Menu thành công!' }), {
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
