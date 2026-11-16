export const FINANCIAL_CONFIG = {
  registrationFeeRate: 0.02, // Trước bạ 2%
  plateFeeProvince: 100000,  // Biển số tỉnh (Theo biểu phí 11/2026)
  plateFeeCity: 350000,      // Biển số TP.HCM (Theo biểu phí 11/2026)
  serviceAndInspectionFee: 4100000, // Dịch vụ ĐKĐK mặc định
  defaultAnnualInterestRate: 0.095, // Lãi suất mặc định 9.5%/năm

  // Tự động bóc tách con số từ chuỗi thông số (VD: "16.530 kg" -> 16530, "7.570 / 6.570 kg" -> 7570)
  parseNumberFromSpec(str, defaultVal = 0) {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return defaultVal;

    // Ưu tiên nếu chuỗi có dạng "4.720 / 3.950 kg" (TK lớn nhất / Cho phép lớn nhất) -> lấy số cho phép (số thứ 2) nếu hợp lý
    const slashMatch = str.match(/([\d.,]+)\s*\/\s*([\d.,]+)\s*kg/i);
    if (slashMatch) {
      let allowedStr = slashMatch[2];
      if (/\.\d{3}/.test(allowedStr)) allowedStr = allowedStr.replace(/\./g, '');
      allowedStr = allowedStr.replace(/,/g, '.');
      const allowedVal = parseFloat(allowedStr);
      if (!isNaN(allowedVal) && allowedVal > 100) return allowedVal;
    }

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

      // 1. Kiểm tra trường "Bản thân / Toàn tải: 1.175 kg / 1.730 kg"
      if ((k.includes('bản thân') || k.includes('tự trọng')) && (k.includes('toàn tải') || k.includes('tổng tải') || k.includes('toàn bộ'))) {
        const parts = vStr.split('/');
        if (parts.length >= 2) {
          curbWeightKg = this.parseNumberFromSpec(parts[0], curbWeightKg);
          totalWeightKg = this.parseNumberFromSpec(parts[1], totalWeightKg);
        }
        continue;
      }

      // 2. Kiểm tra TỔNG TẢI TRƯỚC (Để từ khóa "Tổng tải trọng" không bị lọt nhầm vào nhánh "tải trọng")
      if (k.includes('toàn bộ') || k.includes('tổng tải') || k.includes('toàn tải')) {
        // Chỉ lấy dòng tổng tải chính đầu tiên
        if (totalWeightKg === 0) {
          // Với dòng "16.000 / 15.230 kg", tổng tải lấy số đầu tiên (16.000 kg)
          const firstMatch = vStr.match(/[\d.,]+/);
          if (firstMatch) {
            let s = firstMatch[0];
            if (/\.\d{3}/.test(s)) s = s.replace(/\./g, '');
            s = s.replace(/,/g, '.');
            totalWeightKg = parseFloat(s) || 0;
          }
          if (totalWeightKg > 0 && totalWeightKg < 100 && vStr.toLowerCase().includes('tấn')) {
            totalWeightKg = totalWeightKg * 1000;
          }
        }
      }
      // 3. Kiểm tra KHỐI LƯỢNG BẢN THÂN
      else if (k.includes('bản thân') || k.includes('tự trọng')) {
        if (curbWeightKg === 0) {
          curbWeightKg = this.parseNumberFromSpec(vStr, 0);
        }
      }
      // 4. Kiểm tra TẢI TRỌNG CHO PHÉP CHỞ / MÂM KÉO
      else if (
        (k.includes('tải trọng') || k.includes('chuyên chở') || k.includes('mâm kéo') || k.includes('cơ cấu kéo')) &&
        !k.includes('bản thân') &&
        !k.includes('vừa kéo vừa chở') &&
        !k.includes('chỉ kéo') &&
        !k.includes('kéo theo') &&
        !k.includes('riêng')
      ) {
        if (payloadKg === 0) {
          let parsed = this.parseNumberFromSpec(vStr, 0);
          // Nếu ghi "15.00 kg" hoặc "16 tấn" (số <= 60) -> đổi sang kg
          if (parsed > 0 && parsed <= 60) {
            parsed = parsed * 1000;
          }
          payloadKg = parsed;
        }
      }
      // 5. Kiểm tra SỐ CHỖ NGỒI / SỐ NGƯỜI
      else if (k.includes('chỗ') || k.includes('ghế') || k.includes('số người')) {
        const totalSeatMatch = vStr.match(/tổng cộng\s*(\d+)\s*chỗ/i) || vStr.match(/(\d+)\s*chỗ/i);
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

    // Nếu không ghi rõ trong bảng thông số, suy luận từ tên xe
    if (!isBus && payloadKg === 0) {
      const nameMatch = (vehicle?.name || '').match(/(\d+(?:[.,]\d+)?)\s*(?:tấn|tan|t\b)/i);
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
      const seatMatch = (vehicle?.name || '').match(/(\d+)\s*chỗ/i);
      if (seatMatch) seats = parseInt(seatMatch[1], 10);
      else seats = 16;
    }

    return { isBus, payloadKg, totalWeightKg, seats };
  },

  // 1. Tính Phí sử dụng đường bộ (1 năm) theo biểu phí Nhà nước
  getRoadTax(totalWeightKg, isBus = false, seats = 2) {
    if (isBus) {
      if (seats < 10) return 1560000;      // Xe dưới 10 chỗ cá nhân (130.000đ/tháng)
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
      if (seats < 6) baseInsurance = 437000;
      else if (seats <= 11) baseInsurance = 794000;
      else if (seats <= 16) baseInsurance = 3054000;
      else if (seats <= 24) baseInsurance = 4632000;
      else if (seats <= 25) baseInsurance = 4813000;
      else baseInsurance = 4813000 + (seats - 25) * 30000;
    } else {
      let baseTruck = 853000; // Dưới 3 tấn
      if (payloadKg >= 3000 && payloadKg < 8000) {
        baseTruck = 1660000;  // Từ 3 đến 8 tấn
      } else if (payloadKg >= 8000 && payloadKg <= 15000) {
        baseTruck = 2746000;  // Trên 8 đến 15 tấn
      } else if (payloadKg > 15000) {
        baseTruck = 3200000;  // Trên 15 tấn
      }
      baseInsurance = Math.round(baseTruck * 1.2);
    }

    const seatInsurance = seats * 10000;
    const totalWithVAT = Math.round(baseInsurance * 1.1) + seatInsurance;
    return totalWithVAT;
  }
};
