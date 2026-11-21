import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();
    const targetPath = path.resolve(process.cwd(), 'src/data/financial-settings.json');
    fs.writeFileSync(targetPath, JSON.stringify(body, null, 2), 'utf8');

    return new Response(JSON.stringify({ success: true, message: 'Đã cập nhật biểu phí lăn bánh thành công!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
