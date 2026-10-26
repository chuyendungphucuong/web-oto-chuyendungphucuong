import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Kiến Thức & Tin Tức',
      slugField: 'title',
      path: 'src/data/posts.json',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Tiêu đề bài viết' } }),
        category: fields.select({
          label: 'Chuyên mục',
          options: [
            { label: 'Đánh Giá & So Sánh', value: 'Đánh Giá & So Sánh' },
            { label: 'Thủ Tục & Pháp Lý', value: 'Thủ Tục & Pháp Lý' },
            { label: 'Kinh Nghiệm Vận Tải', value: 'Kinh Nghiệm Vận Tải' },
            { label: 'Tin Tức Showroom', value: 'Tin Tức Showroom' },
          ],
          defaultValue: 'Thủ Tục & Pháp Lý',
        }),
        publishedDate: fields.text({ label: 'Ngày đăng (VD: 17/10/2026)' }),
        author: fields.text({ label: 'Tác giả', defaultValue: 'Chuyên Gia Phú Cường' }),
        image: fields.image({
          label: 'Ảnh đại diện bài viết',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        summary: fields.text({ label: 'Tóm tắt ngắn (Answer-First cho AI Overviews)', multiline: true }),
        content: fields.document({
          label: 'Nội dung chi tiết bài viết',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts/',
          },
        }),
      },
    }),
  },
});
