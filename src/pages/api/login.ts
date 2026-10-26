import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { password } = await request.json();
    const cleanPwd = password ? password.trim() : '';
    
    // 🔑 Mật khẩu quản trị chuẩn xác
    const ADMIN_PASSWORD = 'phucuong@2026';

    if (cleanPwd === ADMIN_PASSWORD) {
      cookies.set('admin_logged_in', 'true', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // Lưu phiên đăng nhập 7 ngày
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Mật khẩu quản trị không chính xác!' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
