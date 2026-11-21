import fs from 'fs';

// 1. Tạo tệp dữ liệu chuẩn src/data/financial-settings.json
const defaultFinancialSettings = {
  registrationFeeRate: 0.02,
  plateFeeProvince: 100000,
  plateFeeCity: 350000,
  serviceAndInspectionFee: 4100000,
  defaultAnnualInterestRate: 0.095,
  roadTaxTruck: {
    under4t: 2160000,
    from4to8_5t: 3240000,
    from8_5to13t: 4680000,
    from13to19t: 7080000,
    from19to27t: 8640000,
    over27t: 12480000
  },
  roadTaxBus: {
    under10: 1560000,
    from10to24: 3240000,
    from25to39: 4680000,
    over40: 7080000
  },
  insuranceTruckBase: {
    under3t: 853000,
    from3to8t: 1660000,
    from8to15t: 2746000,
    over15t: 3200000,
    specializedMultiplier: 1.2,
    perSeatFee: 10000
  },
  insuranceBusBase: {
    under6: 437000,
    from6to11: 794000,
    from12to16: 3054000,
    from17to24: 4632000,
    seat25: 4813000,
    extraPerSeatOver25: 30000
  }
};

fs.writeFileSync('src/data/financial-settings.json', JSON.stringify(defaultFinancialSettings, null, 2), 'utf8');

// 2. Cập nhật src/data/config.js để đọc động từ financial-settings.json nhưng giữ nguyên 100% logic cũ
const configContent = `import settingsData from './financial-settings.json';

export const FINANCIAL_CONFIG = {
  registrationFeeRate: Number(settingsData.registrationFeeRate ?? 0.02),
  plateFeeProvince: Number(settingsData.plateFeeProvince ?? 100000),
  plateFeeCity: Number(settingsData.plateFeeCity ?? 350000),
  serviceAndInspectionFee: Number(settingsData.serviceAndInspectionFee ?? 4100000),
  defaultAnnualInterestRate: Number(settingsData.defaultAnnualInterestRate ?? 0.095),

  parseNumberFromSpec(str, defaultVal = 0) {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return defaultVal;

    const slashMatch = str.match(/([\\d.,]+)\\s*\\/\\s*([\\d.,]+)\\s*kg/i);
    if (slashMatch) {
      let allowedStr = slashMatch[2];
      if (/\\.\\d{3}/.test(allowedStr)) allowedStr = allowedStr.replace(/\\./g, '');
      allowedStr = allowedStr.replace(/,/g, '.');
      const allowedVal = parseFloat(allowedStr);
      if (!isNaN(allowedVal) && allowedVal > 100) return allowedVal;
    }

    const match = str.match(/[\\d.,]+/);
    if (!match) return defaultVal;
    let numStr = match[0];
    if (/\\.\\d{3}/.test(numStr)) {
      numStr = numStr.replace(/\\./g, '');
    }
    numStr = numStr.replace(/,/g, '.');
    const val = parseFloat(numStr);
    return isNaN(val) ? defaultVal : val;
  },

  extractVehicleMetrics(vehicle) {
    const specs = { ...(vehicle?.chassisSpecs || vehicle?.chassis_specs || {}), ...(vehicle?.specialSpecs || vehicle?.special_specs || {}) };
    const nameLower = String(vehicle?.name || '').toLowerCase();
    const subCatLower = String(vehicle?.subCategory || '').toLowerCase();

    const isPassengerCar7Seats = /xl7|carnival|xpander|innova|fortuner|veloz|7 chỗ/i.test(nameLower);
    const isBus =
      vehicle?.category === 'xe-khach' ||
      subCatLower.includes('khách') ||
      nameLower.includes('khách') ||
      isPassengerCar7Seats;

    let payloadKg = 0;
    let totalWeightKg = 0;
    let curbWeightKg = 0;
    let seats = isPassengerCar7Seats ? 7 : (isBus ? 16 : 2);

    for (const [key, val] of Object.entries(specs)) {
      const k = key.toLowerCase();
      const vStr = String(val);

      if ((k.includes('bản thân') || k.includes('tự trọng')) && (k.includes('toàn tải') || k.includes('tổng tải') || k.includes('toàn bộ'))) {
        const parts = vStr.split('/');
        if (parts.length >= 2) {
          curbWeightKg = this.parseNumberFromSpec(parts[0], curbWeightKg);
          totalWeightKg = this.parseNumberFromSpec(parts[1], totalWeightKg);
        }
        continue;
      }

      if (k.includes('toàn bộ') || k.includes('tổng tải') || k.includes('toàn tải')) {
        if (totalWeightKg === 0) {
          const firstMatch = vStr.match(/[\\d.,]+/);
          if (firstMatch) {
            let s = firstMatch[0];
            if (/\\.\\d{3}/.test(s)) s = s.replace(/\\./g, '');
            s = s.replace(/,/g, '.');
            totalWeightKg = parseFloat(s) || 0;
          }
          if (totalWeightKg > 0 && totalWeightKg < 100 && vStr.toLowerCase().includes('tấn')) {
            totalWeightKg = totalWeightKg * 1000;
          }
        }
      } else if (k.includes('bản thân') || k.includes('tự trọng')) {
        if (curbWeightKg === 0) {
          curbWeightKg = this.parseNumberFromSpec(vStr, 0);
        }
      } else if (
        (k.includes('tải trọng') || k.includes('chuyên chở') || k.includes('mâm kéo') || k.includes('cơ cấu kéo')) &&
        !k.includes('bản thân') &&
        !k.includes('vừa kéo vừa chở') &&
        !k.includes('chỉ kéo') &&
        !k.includes('kéo theo') &&
        !k.includes('riêng')
      ) {
        if (payloadKg === 0) {
          let parsed = this.parseNumberFromSpec(vStr, 0);
          if (parsed > 0 && parsed <= 60) {
            parsed = parsed * 1000;
          }
          payloadKg = parsed;
        }
      } else if (k.includes('chỗ') || k.includes('ghế') || k.includes('số người')) {
        const totalSeatMatch = vStr.match(/tổng cộng\\s*(\\d+)\\s*chỗ/i) || vStr.match(/(\\d+)\\s*chỗ/i);
        if (totalSeatMatch) {
          seats = parseInt(totalSeatMatch[1], 10);
        } else {
          const parsedSeat = this.parseNumberFromSpec(vStr, seats);
          if (k.includes('không kể người lái') && parsedSeat <= 3) {
            seats = parsedSeat + 1;
          } else if (parsedSeat > 0 && parsedSeat <= 60) {
            seats = parsedSeat;
          }
        }
      }
    }

    if (!isBus && payloadKg === 0) {
      const nameMatch = (vehicle?.name || '').match(/(\\d+(?:[.,]\\d+)?)\\s*(?:tấn|tan|t\\b)/i);
      if (nameMatch) {
        payloadKg = Math.round(parseFloat(nameMatch[1].replace(',', '.')) * 1000);
      } else if (totalWeightKg > 0 && curbWeightKg > 0 && totalWeightKg > curbWeightKg) {
        payloadKg = Math.max(1000, totalWeightKg - curbWeightKg - 130);
      } else {
        payloadKg = 8000;
      }
    }

    if (!isBus && totalWeightKg === 0) {
      if (payloadKg >= 15000) totalWeightKg = 30000;
      else if (payloadKg >= 10000) totalWeightKg = 24000;
      else if (payloadKg >= 6000) totalWeightKg = 16000;
      else if (payloadKg >= 3000) totalWeightKg = 8500;
      else totalWeightKg = 4990;
    }

    if (isBus && seats <= 3 && !isPassengerCar7Seats) {
      const seatMatch = (vehicle?.name || '').match(/(\\d+)\\s*chỗ/i);
      if (seatMatch) seats = parseInt(seatMatch[1], 10);
      else seats = 16;
    }

    return { isBus, payloadKg, totalWeightKg, seats };
  },

  getRoadTax(totalWeightKg, isBus = false, seats = 2) {
    const rtBus = settingsData.roadTaxBus || {};
    const rtTruck = settingsData.roadTaxTruck || {};
    if (isBus) {
      if (seats < 10) return Number(rtBus.under10 ?? 1560000);
      if (seats < 25) return Number(rtBus.from10to24 ?? 3240000);
      if (seats < 40) return Number(rtBus.from25to39 ?? 4680000);
      return Number(rtBus.over40 ?? 7080000);
    }

    if (totalWeightKg < 4000) return Number(rtTruck.under4t ?? 2160000);
    if (totalWeightKg < 8500) return Number(rtTruck.from4to8_5t ?? 3240000);
    if (totalWeightKg < 13000) return Number(rtTruck.from8_5to13t ?? 4680000);
    if (totalWeightKg < 19000) return Number(rtTruck.from13to19t ?? 7080000);
    if (totalWeightKg < 27000) return Number(rtTruck.from19to27t ?? 8640000);
    return Number(rtTruck.over27t ?? 12480000);
  },

  getInsuranceTNDS(payloadKg, seats = 2, isBus = false) {
    const insBus = settingsData.insuranceBusBase || {};
    const insTruck = settingsData.insuranceTruckBase || {};
    let baseInsurance = 0;

    if (isBus) {
      if (seats < 6) baseInsurance = Number(insBus.under6 ?? 437000);
      else if (seats <= 11) baseInsurance = Number(insBus.from6to11 ?? 794000);
      else if (seats <= 16) baseInsurance = Number(insBus.from12to16 ?? 3054000);
      else if (seats <= 24) baseInsurance = Number(insBus.from17to24 ?? 4632000);
      else if (seats <= 25) baseInsurance = Number(insBus.seat25 ?? 4813000);
      else baseInsurance = Number(insBus.seat25 ?? 4813000) + (seats - 25) * Number(insBus.extraPerSeatOver25 ?? 30000);
    } else {
      let baseTruck = Number(insTruck.under3t ?? 853000);
      if (payloadKg >= 3000 && payloadKg < 8000) {
        baseTruck = Number(insTruck.from3to8t ?? 1660000);
      } else if (payloadKg >= 8000 && payloadKg <= 15000) {
        baseTruck = Number(insTruck.from8to15t ?? 2746000);
      } else if (payloadKg > 15000) {
        baseTruck = Number(insTruck.over15t ?? 3200000);
      }
      const mult = Number(insTruck.specializedMultiplier ?? 1.2);
      baseInsurance = Math.round(baseTruck * mult);
    }

    const perSeat = Number(insTruck.perSeatFee ?? 10000);
    const seatInsurance = seats * perSeat;
    const totalWithVAT = Math.round(baseInsurance * 1.1) + seatInsurance;
    return totalWithVAT;
  }
};
`;
fs.writeFileSync('src/data/config.js', configContent, 'utf8');

// 3. Tạo API src/pages/api/update-financial.js để lưu cấu hình biểu phí lăn bánh
const apiContent = `import fs from 'node:fs';
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
`;
fs.writeFileSync('src/pages/api/update-financial.js', apiContent, 'utf8');

// 4. Nâng cấp trang src/pages/admin/settings.astro tích hợp Quản lý Biểu Phí Lăn Bánh & Đổi mật khẩu
const settingsAstroContent = \`---
import AdminLayout from '../../layouts/AdminLayout.astro';
import financialData from '../../data/financial-settings.json';
---

<AdminLayout title="Cấu Hình Biểu Phí Lăn Bánh & Bảo Mật" activeTab="settings">
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- FORM CẤU HÌNH BIỂU PHÍ LĂN BÁNH & TRẢ GÓP -->
    <form id="financialConfigForm" class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-700">Đồng Bộ Toàn Hệ Thống Tính Giá Lăn Bánh</span>
          <h2 class="text-xl font-extrabold text-slate-900 mt-0.5">⚙️ Cấu Hình Biểu Phí Đăng Ký, Đăng Kiểm &amp; Bảo Hiểm Mặc Định</h2>
          <p class="text-xs text-slate-500 mt-1">Các thông số dưới đây áp dụng tự động cho trang <strong>/tinh-lan-banh</strong> và bảng dự toán trên từng trang sản phẩm.</p>
        </div>
        <button type="submit" id="btnSaveFinancial" class="shrink-0 bg-blue-700 hover:bg-blue-800 text-white font-extrabold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer text-sm">
          💾 Lưu Biểu Phí Mới
        </button>
      </div>

      <div id="finStatusAlert" class="hidden p-3.5 rounded-xl text-xs font-bold"></div>

      <!-- NHÓM 1: CHI PHÍ CỐ ĐỊNH & LÃI SUẤT -->
      <div class="space-y-4">
        <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span class="w-2 h-5 bg-blue-700 rounded-full inline-block"></span>
          1. Lệ Phí Trước Bạ, Biển Số, Dịch Vụ ĐKĐK &amp; Lãi Suất Vay
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Lệ phí trước bạ (%):</label>
            <input type="number" step="0.1" id="regRatePct" value={(financialData.registrationFeeRate * 100).toFixed(1)} class="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900" required />
            <span class="text-[11px] text-slate-400 mt-1 block">Mặc định xe tải/chuyên dùng: 2%</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Biển số TP.HCM / HN (VNĐ):</label>
            <input type="number" step="1000" id="plateCity" value={financialData.plateFeeCity} class="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900" required />
            <span class="text-[11px] text-slate-400 mt-1 block">Hiện hành: 350.000 đ</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Biển số Tỉnh khác (VNĐ):</label>
            <input type="number" step="1000" id="plateProvince" value={financialData.plateFeeProvince} class="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900" required />
            <span class="text-[11px] text-slate-400 mt-1 block">Hiện hành: 100.000 đ</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Dịch vụ ĐKĐK &amp; Lưu hành (VNĐ):</label>
            <input type="number" step="10000" id="serviceFee" value={financialData.serviceAndInspectionFee} class="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900" required />
            <span class="text-[11px] text-slate-400 mt-1 block">Cà số, khám lưu hành, hồ sơ</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Lãi suất vay mặc định (%/năm):</label>
            <input type="number" step="0.1" id="interestRatePct" value={(financialData.defaultAnnualInterestRate * 100).toFixed(1)} class="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900" required />
            <span class="text-[11px] text-slate-400 mt-1 block">Dùng tính trả góp tham khảo</span>
          </div>
        </div>
      </div>

      <!-- NHÓM 2: PHÍ BẢO TRÌ ĐƯỜNG BỘ 1 NĂM -->
      <div class="space-y-4 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span class="w-2 h-5 bg-emerald-600 rounded-full inline-block"></span>
          2. Phí Sử Dụng Đường Bộ (1 Năm — VNĐ)
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Xe tải & Chuyên dùng -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs font-extrabold text-blue-800 uppercase">A. Xe Tải &amp; Xe Chuyên Dùng (Theo Tổng Tải Trọng)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Dưới 4 tấn:</label>
                <input type="number" step="1000" id="rt_under4t" value={financialData.roadTaxTruck.under4t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 4 đến dưới 8.5 tấn:</label>
                <input type="number" step="1000" id="rt_from4to8_5t" value={financialData.roadTaxTruck.from4to8_5t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 8.5 đến dưới 13 tấn:</label>
                <input type="number" step="1000" id="rt_from8_5to13t" value={financialData.roadTaxTruck.from8_5to13t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 13 đến dưới 19 tấn:</label>
                <input type="number" step="1000" id="rt_from13to19t" value={financialData.roadTaxTruck.from13to19t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 19 đến dưới 27 tấn:</label>
                <input type="number" step="1000" id="rt_from19to27t" value={financialData.roadTaxTruck.from19to27t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 27 tấn trở lên:</label>
                <input type="number" step="1000" id="rt_over27t" value={financialData.roadTaxTruck.over27t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
            </div>
          </div>

          <!-- Xe khách -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs font-extrabold text-blue-800 uppercase">B. Xe Ô Tô Khách (Theo Số Chỗ Ngồi)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Dưới 10 chỗ ngồi:</label>
                <input type="number" step="1000" id="rt_bus_under10" value={financialData.roadTaxBus.under10} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 10 đến 24 chỗ (16 chỗ):</label>
                <input type="number" step="1000" id="rt_bus_10_24" value={financialData.roadTaxBus.from10to24} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 25 đến 39 chỗ (29-34 chỗ):</label>
                <input type="number" step="1000" id="rt_bus_25_39" value={financialData.roadTaxBus.from25to39} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 40 chỗ trở lên (47 chỗ):</label>
                <input type="number" step="1000" id="rt_bus_over40" value={financialData.roadTaxBus.over40} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NHÓM 3: BẢO HIỂM TNDS BẮT BUỘC -->
      <div class="space-y-4 pt-2 border-t border-slate-100">
        <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span class="w-2 h-5 bg-red-600 rounded-full inline-block"></span>
          3. Bảo Hiểm Trách Nhiệm Dân Sự Bắt Buộc (Giá Gốc Chưa VAT — VNĐ/Năm)
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs font-extrabold text-blue-800 uppercase">A. Xe Tải &amp; Hệ Số Xe Chuyên Dùng</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Dưới 3 tấn (gốc):</label>
                <input type="number" step="1000" id="ins_under3t" value={financialData.insuranceTruckBase.under3t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 3 đến 8 tấn (gốc):</label>
                <input type="number" step="1000" id="ins_3to8t" value={financialData.insuranceTruckBase.from3to8t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Trên 8 đến 15 tấn (gốc):</label>
                <input type="number" step="1000" id="ins_8to15t" value={financialData.insuranceTruckBase.from8to15t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Trên 15 tấn (gốc):</label>
                <input type="number" step="1000" id="ins_over15t" value={financialData.insuranceTruckBase.over15t} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Hệ số nhân xe chuyên dùng:</label>
                <input type="number" step="0.05" id="ins_spec_mult" value={financialData.insuranceTruckBase.specializedMultiplier} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Phí bảo hiểm phụ xe / chỗ (VNĐ):</label>
                <input type="number" step="1000" id="ins_per_seat" value={financialData.insuranceTruckBase.perSeatFee} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="text-xs font-extrabold text-blue-800 uppercase">B. Xe Ô Tô Khách Kinh Doanh Vận Tải</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="font-bold text-slate-700 block mb-1">Dưới 6 chỗ:</label>
                <input type="number" step="1000" id="ins_bus_u6" value={financialData.insuranceBusBase.under6} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 6 đến 11 chỗ:</label>
                <input type="number" step="1000" id="ins_bus_6_11" value={financialData.insuranceBusBase.from6to11} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 12 đến 16 chỗ:</label>
                <input type="number" step="1000" id="ins_bus_12_16" value={financialData.insuranceBusBase.from12to16} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Từ 17 đến 24 chỗ:</label>
                <input type="number" step="1000" id="ins_bus_17_24" value={financialData.insuranceBusBase.from17to24} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Xe 25 chỗ:</label>
                <input type="number" step="1000" id="ins_bus_25" value={financialData.insuranceBusBase.seat25} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">Cộng thêm mỗi chỗ &gt; 25:</label>
                <input type="number" step="1000" id="ins_bus_extra" value={financialData.insuranceBusBase.extraPerSeatOver25} class="w-full p-2 bg-white border rounded-lg font-semibold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200 flex justify-end">
        <button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white font-extrabold px-8 py-3.5 rounded-xl transition shadow-sm cursor-pointer text-sm">
          💾 Lưu Toàn Bộ Biểu Phí Lăn Bánh
        </button>
      </div>
    </form>

    <!-- KHUNG ĐỔI MẬT KHẨU QUẢN TRỊ -->
    <div class="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <h2 class="text-base font-bold text-slate-900 border-b pb-3">🔑 Thay Đổi Mật Khẩu Quản Lý Chung</h2>
      
      <form id="changePassForm" class="space-y-4 text-sm">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Mật khẩu hiện tại:</label>
          <input type="password" id="oldPass" class="w-full p-3 border rounded-xl" required />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Mật khẩu mới:</label>
          <input type="password" id="newPass" class="w-full p-3 border rounded-xl" required />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Nhập lại mật khẩu mới:</label>
          <input type="password" id="confirmPass" class="w-full p-3 border rounded-xl" required />
        </div>
        <p id="msgStatus" class="text-xs font-bold hidden"></p>
        <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3 rounded-xl transition cursor-pointer">
          Cập Nhật Mật Khẩu Mới
        </button>
      </form>
    </div>

  </div>

  <script is:inline>
    document.getElementById('financialConfigForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertBox = document.getElementById('finStatusAlert');
      const payload = {
        registrationFeeRate: parseFloat(document.getElementById('regRatePct').value) / 100,
        plateFeeCity: Number(document.getElementById('plateCity').value),
        plateFeeProvince: Number(document.getElementById('plateProvince').value),
        serviceAndInspectionFee: Number(document.getElementById('serviceFee').value),
        defaultAnnualInterestRate: parseFloat(document.getElementById('interestRatePct').value) / 100,
        roadTaxTruck: {
          under4t: Number(document.getElementById('rt_under4t').value),
          from4to8_5t: Number(document.getElementById('rt_from4to8_5t').value),
          from8_5to13t: Number(document.getElementById('rt_from8_5to13t').value),
          from13to19t: Number(document.getElementById('rt_from13to19t').value),
          from19to27t: Number(document.getElementById('rt_from19to27t').value),
          over27t: Number(document.getElementById('rt_over27t').value)
        },
        roadTaxBus: {
          under10: Number(document.getElementById('rt_bus_under10').value),
          from10to24: Number(document.getElementById('rt_bus_10_24').value),
          from25to39: Number(document.getElementById('rt_bus_25_39').value),
          over40: Number(document.getElementById('rt_bus_over40').value)
        },
        insuranceTruckBase: {
          under3t: Number(document.getElementById('ins_under3t').value),
          from3to8t: Number(document.getElementById('ins_3to8t').value),
          from8to15t: Number(document.getElementById('ins_8to15t').value),
          over15t: Number(document.getElementById('ins_over15t').value),
          specializedMultiplier: parseFloat(document.getElementById('ins_spec_mult').value),
          perSeatFee: Number(document.getElementById('ins_per_seat').value)
        },
        insuranceBusBase: {
          under6: Number(document.getElementById('ins_bus_u6').value),
          from6to11: Number(document.getElementById('ins_bus_6_11').value),
          from12to16: Number(document.getElementById('ins_bus_12_16').value),
          from17to24: Number(document.getElementById('ins_bus_17_24').value),
          seat25: Number(document.getElementById('ins_bus_25').value),
          extraPerSeatOver25: Number(document.getElementById('ins_bus_extra').value)
        }
      };

      try {
        const res = await fetch('/api/update-financial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-emerald-50', 'text-emerald-700');
        if (data.success) {
          alertBox.innerText = '✅ ' + data.message + ' (Dữ liệu đã lưu vào src/data/financial-settings.json)';
          alertBox.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200');
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alertBox.innerText = '❌ Lỗi lưu dữ liệu: ' + (data.error || 'Không xác định');
          alertBox.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
        }
      } catch (err) {
        alertBox.classList.remove('hidden');
        alertBox.innerText = '❌ Lỗi kết nối máy chủ cục bộ: ' + err.message;
        alertBox.classList.add('bg-red-50', 'text-red-700');
      }
    });

    document.getElementById('changePassForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const oldP = document.getElementById('oldPass').value;
      const newP = document.getElementById('newPass').value;
      const confP = document.getElementById('confirmPass').value;
      const msg = document.getElementById('msgStatus');
      const currentSaved = localStorage.getItem('pc_admin_pass') || 'phucuong@2026';

      msg.classList.remove('hidden', 'text-red-600', 'text-emerald-600');

      if (oldP !== currentSaved) {
        msg.innerText = '❌ Mật khẩu hiện tại không đúng!';
        msg.classList.add('text-red-600');
        return;
      }
      if (newP !== confP) {
        msg.innerText = '❌ Mật khẩu mới nhập lại không khớp!';
        msg.classList.add('text-red-600');
        return;
      }

      localStorage.setItem('pc_admin_pass', newP);
      msg.innerText = '✅ Đã đổi mật khẩu quản trị thành công!';
      msg.classList.add('text-emerald-600');
      document.getElementById('changePassForm').reset();
    });
  </script>
</AdminLayout>
\`;
fs.writeFileSync('src/pages/admin/settings.astro', settingsAstroContent, 'utf8');
console.log('✅ Đã nâng cấp trang /admin/settings quản lý toàn bộ biểu phí lăn bánh!');
