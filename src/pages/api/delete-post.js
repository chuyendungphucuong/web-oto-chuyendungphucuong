import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { slug } = data;

    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: 'Thiếu định danh bài viết (slug).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const postsFilePath = path.resolve(process.cwd(), 'src/data/posts.json');
    if (!fs.existsSync(postsFilePath)) {
      return new Response(JSON.stringify({ success: false, message: 'Không tìm thấy kho dữ liệu bài viết.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return new Response(JSON.stringify({ success: false, message: 'Không tìm thấy bài viết cần xóa.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const targetPost = posts[postIndex];

    // Tự động quét và xóa các file ảnh liên quan đến bài viết trong thư mục public/images/posts/
    const imagesToDelete = [];
    if (targetPost.image && targetPost.image.startsWith('/images/posts/')) {
      imagesToDelete.push(targetPost.image);
    }

    if (targetPost.content) {
      // Dùng Regular Expression quét toàn bộ các đường dẫn ảnh src="..." có trong nội dung bài viết
      const imgRegex = /src="(\/images\/posts\/[^"]+)"/g;
      let match;
      while ((match = imgRegex.exec(targetPost.content)) !== null) {
        imagesToDelete.push(match[1]);
      }
    }

    // Thực hiện xóa vật lý các file ảnh trên ổ cứng
    imagesToDelete.forEach((imgPath) => {
      const fullPath = path.resolve(process.cwd(), 'public', imgPath.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error('Không thể xóa file ảnh:', fullPath);
        }
      }
    });

    // Xóa bài viết khỏi mảng dữ liệu và ghi đè lại file JSON
    posts.splice(postIndex, 1);
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, message: 'Đã xóa bài viết và dọn dẹp hình ảnh liên quan thành công!' }), {
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
