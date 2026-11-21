import settingsData from './financial-settings.json';

export const FINANCIAL_CONFIG = {
  registrationFeeRate: Number(settingsData.registrationFeeRate ?? 0.02),
  plateFeeProvince: Number(settingsData.plateFeeProvince ?? 100000),
  plateFeeCity: Number(settingsData.plateFeeCity ?? 350000),
  serviceAndInspectionFee: Number(settingsData.serviceAndInspectionFee ?? 4100000),
  defaultAnnualInterestRate: Number(settingsData.defaultAnnualInterestRate ?? 0.095),

  parseNumberFromSpec(str, defaultVal = 0) {
    if (typeof str === 'number') return str;
    if (!str || typeof str !== 'string') return defaultVal;

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
    if (/\.\d{3}/.test(numStr)) {
      numStr = numStr.replace(/\./g, '');
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
