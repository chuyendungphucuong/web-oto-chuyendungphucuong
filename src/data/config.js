export const FINANCIAL_CONFIG = {
  registrationFeeRate: 0.02, // Trước bạ 2%
  plateFeeProvince: 150000,   // Biển số tỉnh
  plateFeeCity: 500000,       // Biển số TP.HCM
  serviceAndInspectionFee: 6000000, // Đăng kiểm + Dịch vụ đăng ký trọn gói
  defaultAnnualInterestRate: 0.095, // Lãi suất mặc định 9.5%/năm

  // Tự động bóc tách con số từ chuỗi thông số (VD: "16.530 kg" -> 16530, "29 chỗ" -> 29)
  parseNumberFromSpec(str, defaultVal = 0) {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return defaultVal;
    const match = str.match(/[\d.,]+/);
    if (!match) return defaultVal;
    let numStr = match[0];
    // Nếu có dạng 16.500 hoặc 12.100 (dấu chấm phân cách hàng nghìn)
    if (/\.\d{3}/.test(numStr)) {
      numStr = numStr.replace(/\./g, '');
    }
    numStr = numStr.replace(/,/g, '.');
    const val = parseFloat(numStr);
    return isNaN(val) ? defaultVal : val;
  },

  // Tự động quét thông số kỹ thuật của 1 chiếc xe để lấy: Tải trọng, Tổng tải, Số chỗ
  extractVehicleMetrics(vehicle) {
    const specs = vehicle?.chassisSpecs || vehicle?.chassis_specs || {};
    const isBus = vehicle?.category === 'xe-khach' || (vehicle?.subCategory || '').toLowerCase().includes('khách') || (vehicle?.name || '').toLowerCase().includes('khách');

    let payloadKg = 0;
    let totalWeightKg = 0;
    let seats = isBus ? 16 : 2;

    for (const [key, val] of Object.entries(specs)) {
      const k = key.toLowerCase();
      const vStr = String(val);
      if (k.includes('tải trọng') || k.includes('chuyên chở')) {
        payloadKg = this.parseNumberFromSpec(vStr, payloadKg);
        if (payloadKg > 0 && payloadKg < 100 && vStr.toLowerCase().includes('tấn')) {
          payloadKg = payloadKg * 1000;
        }
      } else if (k.includes('toàn bộ') || k.includes('tổng tải')) {
        totalWeightKg = this.parseNumberFromSpec(vStr, totalWeightKg);
        if (totalWeightKg > 0 && totalWeightKg < 100 && vStr.toLowerCase().includes('tấn')) {
          totalWeightKg = totalWeightKg * 1000;
        }
      } else if (k.includes('chỗ') || k.includes('ghế')) {
        seats = this.parseNumberFromSpec(vStr, seats);
      }
    }

    // Nếu không ghi rõ trong bảng thông số, suy luận thông minh từ tên xe / loại xe
    if (!isBus && payloadKg === 0) {
      const nameMatch = (vehicle?.name || '').match(/(\d+(?:[.,]\d+)?)\s*tấn/i);
      if (nameMatch) {
        payloadKg = parseFloat(nameMatch[1].replace(',', '.')) * 1000;
      } else {
        payloadKg = 8000; // Mặc định 8 tấn nếu chưa nhập
      }
    }

    if (!isBus && totalWeightKg === 0) {
      // Tổng tải ước tính từ tải trọng hàng hóa
      if (payloadKg >= 15000) totalWeightKg = 30000;
      else if (payloadKg >= 10000) totalWeightKg = 24000;
      else if (payloadKg >= 6000) totalWeightKg = 16000;
      else if (payloadKg >= 3000) totalWeightKg = 8500;
      else totalWeightKg = 4990;
    }

    if (isBus && seats <= 3) {
      const seatMatch = (vehicle?.name || '').match(/(\d+)\s*chỗ/i);
      if (seatMatch) seats = parseInt(seatMatch[1]);
      else seats = 16;
    }

    return { isBus, payloadKg, totalWeightKg, seats };
  },

  // 1. Tính Phí sử dụng đường bộ (1 năm) theo biểu phí Nhà nước
  getRoadTax(totalWeightKg, isBus = false, seats = 2) {
    if (isBus) {
      if (seats < 10) return 3240000;
      if (seats < 25) return 3240000;      // Xe khách dưới 25 chỗ (16 chỗ): 270.000đ/tháng
      if (seats < 40) return 4680000;      // Xe khách 25 - dưới 40 chỗ (29-34 chỗ): 390.000đ/tháng
      return 7080000;                      // Xe khách từ 40 chỗ trở lên (47 chỗ): 590.000đ/tháng
    }

    if (totalWeightKg < 4000) return 2160000;       // Dưới 4 tấn
    if (totalWeightKg < 8500) return 3240000;       // 4 - dưới 8.5 tấn
    if (totalWeightKg < 13000) return 4680000;      // 8.5 - dưới 13 tấn
    if (totalWeightKg < 19000) return 7080000;      // 13 - dưới 19 tấn
    if (totalWeightKg < 27000) return 8640000;      // 19 - dưới 27 tấn
    return 12480000;                                // Từ 27 tấn trở lên
  },

  // 2. Tính Bảo hiểm TNDS bắt buộc (+20% cho xe chuyên dùng + 10.000đ/chỗ ngồi + 10% VAT)
  getInsuranceTNDS(payloadKg, seats = 2, isBus = false) {
    let baseInsurance = 0;

    if (isBus) {
      // Biểu phí xe khách kinh doanh vận tải (chưa VAT)
      if (seats < 6) baseInsurance = 756000;
      else if (seats <= 11) baseInsurance = 1266000;
      else if (seats <= 16) baseInsurance = 3054000;
      else if (seats <= 24) baseInsurance = 4632000;
      else if (seats <= 25) baseInsurance = 4813000;
      else baseInsurance = 4813000 + (seats - 25) * 30000;
    } else {
      // Biểu phí xe tải cơ sở theo tải trọng (chưa VAT)
      let baseTruck = 853000; // Dưới 3 tấn
      if (payloadKg >= 3000 && payloadKg < 8000) {
        baseTruck = 1660000;  // Từ 3 đến 8 tấn
      } else if (payloadKg >= 8000 && payloadKg <= 15000) {
        baseTruck = 2746000;  // Trên 8 đến 15 tấn
      } else if (payloadKg > 15000) {
        baseTruck = 3200000;  // Trên 15 tấn
      }
      // Ô tô chuyên dùng = 120% phí xe tải cùng tải trọng
      baseInsurance = Math.round(baseTruck * 1.2);
    }

    // Cộng thêm bảo hiểm tai nạn người ngồi trên xe: 10.000đ / ghế
    const seatInsurance = seats * 10000;

    // Cộng 10% thuế VAT cho phần TNDS bắt buộc
    const totalWithVAT = Math.round(baseInsurance * 1.1) + seatInsurance;
    return totalWithVAT;
  }
};
