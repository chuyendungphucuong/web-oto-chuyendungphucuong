import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const filePath = path.resolve('src/data/vehicles.json');
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: 'Đã lưu dữ liệu thành công!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
