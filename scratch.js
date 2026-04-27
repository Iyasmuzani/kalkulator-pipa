const SDRs = [26, 21, 17, 13.6, 11, 9, 7.4];
const ODs = [20, 25, 32, 40, 50, 63, 75, 90, 110, 125, 140, 160, 180, 200, 225, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000];

let obj = {};
for (let od of ODs) {
  obj[od] = {};
  for (let sdr of SDRs) {
    let e = od / sdr;
    // rule: round up to next 0.1mm. but let's check standard tables.
    // Actually standard rule: P_n = ... e_n = D_n / SDR. 
    // Wait, ISO 4427: round up to nearest 0.1, but in fact it uses specific standard rounding.
    // e = ceil(e * 10) / 10.
    // Let's use standard table generation or use approximate 1 decimal round
    let val = Math.ceil(e * 1000) / 1000;
    // to match standard, typically it's rounded to 1 dec digit upwards
    let en = Math.ceil(val * 10) / 10;
    
    // ISO 4427 minimum wall thickness is 2.0 mm (sometimes 3.0 for water? no, 2.0)
    if (en < 2.0) en = 2.0;

    // Filter out some unrealistic small pipes with high SDR
    // like OD 20 SDR 26 would be en 2.0 anyway.
    // Usually tables don't list SDR 26 for OD < 50.
    // Let's just include it and let en=2.0
    // Wait, let's filter:
    if (od < 50 && sdr > 17) continue;
    if (od < 32 && sdr > 13.6) continue;
    
    // For ISO 4427, 75/11 = 6.81 -> 6.9 according to formula. Let's see.
    obj[od][sdr] = en;
  }
}
console.log(JSON.stringify(obj, null, 2));
