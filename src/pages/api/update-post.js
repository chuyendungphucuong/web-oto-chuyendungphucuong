import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { slug, title, category, author, summary, image, content } = data;

    if (!slug || !title) {
      return new Response(JSON.stringify({ success: false, message: 'Vui lòng nhập đầy đủ Tiêu đề và Slug bài viết.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const postsFilePath = path.resolve(process.cwd(), 'src/data/posts.json');
    let posts = [];
    if (fs.existsSync(postsFilePath)) {
      posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    }

    const index = posts.findIndex((p) => p.slug === slug);
    const currentDate = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

    if (index !== -1) {
      // Cập nhật bài viết cũ
      posts[index] = {
        ...posts[index],
        title,
        category: category || 'Kinh Nghiệm Vận Tải & Đầu Tư',
        author: author || 'Chuyên gia Phú Cường',
        summary: summary || '',
        image: image || posts[index].image,
        content: content || posts[index].content
      };
    } else {
      // Thêm bài viết mới
      const newPost = {
        slug,
        title,
        category: category || 'Kinh Nghiệm Vận Tải & Đầu Tư',
        date: currentDate,
        author: author || 'Chuyên gia Phú Cường',
        views: '1 lượt xem',
        summary: summary || '',
        image: image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
        content: content || ''
      };
      posts.unshift(newPost);
    }

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: 'Đã lưu bài viết thành công!' }), {
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
