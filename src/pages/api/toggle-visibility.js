import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export async function POST({ request }) {
  try {
    const { type, slug } = await request.json();
    if (!type || !slug) {
      return new Response(JSON.stringify({ success: false, error: 'Thiếu type hoặc slug' }), { status: 400 });
    }

    if (type === 'post') {
      const postPath = path.resolve(process.cwd(), 'src/data/posts.json');
      const posts = JSON.parse(fs.readFileSync(postPath, 'utf8'));
      const item = posts.find((p) => p.slug === slug);
      if (!item) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy bài viết' }), { status: 404 });
      item.isHidden = !Boolean(item.isHidden);
      fs.writeFileSync(postPath, JSON.stringify(posts, null, 2), 'utf8');
      return new Response(JSON.stringify({ success: true, isHidden: item.isHidden }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (type === 'vehicle') {
      const catDir = path.resolve(process.cwd(), 'src/data/categories');
      const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const fullPath = path.join(catDir, file);
        const list = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const item = Array.isArray(list) ? list.find((v) => v.slug === slug) : null;
        if (item) {
          item.isHidden = !Boolean(item.isHidden);
          fs.writeFileSync(fullPath, JSON.stringify(list, null, 2), 'utf8');
          return new Response(JSON.stringify({ success: true, isHidden: item.isHidden }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy sản phẩm' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: false, error: 'Loại dữ liệu không hợp lệ' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
