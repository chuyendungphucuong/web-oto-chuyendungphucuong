import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'default',
  title: 'Phu Cuong Auto Admin',

  projectId: 'xm3mri9y',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      {
        name: 'vehicle',
        title: 'Sản Phẩm Xe',
        type: 'document',
        fields: [
          {name: 'name', title: 'Tên xe', type: 'string'},
          {name: 'slug', title: 'Đường dẫn (Slug)', type: 'slug', options: {source: 'name'}},
          {
            name: 'category',
            title: 'Danh mục lớn',
            type: 'string',
            options: {
              list: [
                {title: 'Xe Tải Chuyên Dùng', value: 'xe-tai-chuyen-dung'},
                {title: 'Ô Tô Khách', value: 'xe-khach'}
              ]
            }
          },
          {name: 'subCategory', title: 'Danh mục chi tiết', type: 'string'},
          {name: 'brand', title: 'Hãng xe', type: 'string'},
          {name: 'price', title: 'Giá niêm yết (VNĐ)', type: 'number'},
          {name: 'promo', title: 'Khuyến mãi', type: 'text'},
          {name: 'images', title: 'Thư viện hình ảnh', type: 'array', of: [{type: 'image'}]},
          {name: 'summary', title: 'Tóm tắt ngắn', type: 'text'},
          {name: 'description', title: 'Bài viết đánh giá chi tiết', type: 'text'}
        ]
      },
      {
        name: 'post',
        title: 'Kiến Thức & Tin Tức',
        type: 'document',
        fields: [
          {name: 'title', title: 'Tiêu đề bài viết', type: 'string'},
          {name: 'slug', title: 'Đường dẫn (Slug)', type: 'slug', options: {source: 'title'}},
          {name: 'category', title: 'Chuyên mục', type: 'string'},
          {name: 'publishedDate', title: 'Ngày đăng', type: 'string'},
          {name: 'author', title: 'Tác giả', type: 'string'},
          {name: 'image', title: 'Ảnh đại diện', type: 'image'},
          {name: 'summary', title: 'Tóm tắt ngắn', type: 'text'},
          {name: 'content', title: 'Nội dung chi tiết', type: 'text'}
        ]
      }
    ],
  },
})
