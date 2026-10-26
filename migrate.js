import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config'; // Thêm dòng này để đọc file .env

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yicnuqeeywyervqtcps.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function migrate() {
  try {
    const rawData = fs.readFileSync('./src/data/vehicles.json', 'utf-8');
    const vehicles = JSON.parse(rawData);

    console.log(`Đang chuẩn bị đẩy ${vehicles.length} xe lên Supabase...`);

    const formattedVehicles = vehicles.map(v => ({
      slug: v.slug,
      name: v.name,
      category: v.category || 'xe-tai-chuyen-dung',
      category_name: v.categoryName || 'Xe Tải Chuyên Dùng',
      sub_category: v.subCategory || 'Khác',
      sub_key: v.subKey || 'khac',
      brand: v.brand || 'Phú Cường',
      price: v.price || 0,
      promo: v.promo || '',
      images: v.images || [],
      summary: v.summary || '',
      description: v.description || '',
      showrooms: v.showrooms || ['TP. Hồ Chí Minh'],
      road_tax_per_year: v.roadTaxPerYear || 0,
      insurance_tnds: v.insuranceTNDS || 0,
      chassis_specs: v.chassisSpecs || {},
      special_specs: v.specialSpecs || {},
      faqs: v.faqs || []
    }));

    const { data, error } = await supabase
      .from('vehicles')
      .upsert(formattedVehicles, { onConflict: 'slug' });

    if (error) {
      console.error('Lỗi khi đẩy dữ liệu:', error);
    } else {
      console.log('🎉 Đã đồng bộ thành công toàn bộ kho xe lên Supabase!');
    }
  } catch (err) {
    console.error('Lỗi đọc file:', err);
  }
}

migrate();
