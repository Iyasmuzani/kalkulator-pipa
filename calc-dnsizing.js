// ==================== DN SIZING PIPE CALCULATOR ====================
// Determines pipe DN from flow data + calculates pump motor power
// References: ISO 4427-2:2019, PPI Handbook Ch.6, AWWA M55

// ===== SDR-to-PN mapping for PE100 =====
var SDR_PN_MAP = {
  26:   { pn: 6,    label: 'PN 6'   },
  21:   { pn: 8,    label: 'PN 8'   },
  17:   { pn: 10,   label: 'PN 10'  },
  13.6: { pn: 12.5, label: 'PN 12.5'},
  11:   { pn: 16,   label: 'PN 16'  },
  9:    { pn: 20,   label: 'PN 20'  },
  7.4:  { pn: 25,   label: 'PN 25'  }
};

// ===== C-Factor data per material =====
var DN_MATERIAL_DATA = {
  'hdpe':  { label: 'HDPE PE100',        C: 150, epsilon: 0.0015, density: 950 },
  'pvc':   { label: 'PVC-U / PVC-O',     C: 150, epsilon: 0.0015, density: 1400 },
  'ppr':   { label: 'PPR (PP-R)',         C: 140, epsilon: 0.007,  density: 900 },
  'steel': { label: 'Baja Galvanis',      C: 120, epsilon: 0.15,   density: 7850 },
  'di':    { label: 'Ductile Iron',       C: 130, epsilon: 0.12,   density: 7100 }
};

// ===== Standard motor sizes (kW) =====
var STD_MOTOR_SIZES = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3.0, 4.0, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 400, 500, 630, 800];

// ===== Build Form =====
function buildDNSizingForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> DN Sizing Pipe <span style="font-size:10px;color:var(--text2);font-weight:400">+ Daya Motor Pompa</span></div>

  <div class="form-group"><label class="form-label">Jenis Fluida / Keterangan${infoTip('Keterangan fluida yang dialirkan. Data ini akan dicetak di dalam laporan PDF.')}</label>
  <input type="text" class="form-control" id="dns-fluid" value="Air Bersih (Clean Water)" placeholder="Contoh: Air Bersih, Lumpur, dll"></div>

  <div class="form-group"><label class="form-label">Specific Gravity (SG)${infoTip('Rasio densitas fluida terhadap air murni.\\nAir = 1.0 | Air Laut = 1.03 | Lumpur = 1.1 - 1.4\\nSG mempengaruhi daya motor pompa.')}</label>
  <input type="number" class="form-control" id="dns-sg" min="0.1" max="5.0" step="0.01" value="1.0"></div>

  <div class="form-group" id="dns-visc-wrap"><label class="form-label">Viskositas Kinematik (cSt)${infoTip('Kekentalan fluida (1 cSt = 1 mm²/s = 10⁻⁶ m²/s).\\nAir 20°C = 1.0 cSt | Air 40°C = 0.66 cSt | Lumpur/Minyak = 5 - 50+ cSt.\\nSangat berpengaruh pada metode Darcy-Weisbach & Bilangan Reynolds.')}</label>
  <input type="number" class="form-control" id="dns-visc" min="0.1" max="1000" step="0.01" value="1.0"></div>

  <div class="form-group"><label class="form-label">Material Pipa${infoTip('Material menentukan C-Factor (Hazen-Williams) dan kekasaran pipa.\\nHDPE/PVC: C=150 (sangat halus)\\nBaja: C=120\\nSumber: PPI Handbook Ch.6')}</label>
  <select class="form-control" id="dns-mat" onchange="dnUpdateMaterial()">
    <option value="hdpe" selected>HDPE PE100</option>
    <option value="pvc">PVC-U / PVC-O</option>
    <option value="ppr">PPR (PP-R)</option>
    <option value="steel">Baja Galvanis</option>
    <option value="di">Ductile Iron</option>
  </select></div>

  <div id="dns-sdr-wrap">
  <div class="form-group"><label class="form-label">Tekanan Kerja (SDR/PN)${infoTip('SDR menentukan tebal dinding pipa.\\nSDR rendah = dinding tebal = tekanan lebih tinggi.\\nContoh: SDR 11 = PN 16 bar\\nSumber: ISO 4427-2:2019')}</label>
  <select class="form-control" id="dns-sdr">
    <option value="21">SDR 21 — PN 8</option>
    <option value="17" selected>SDR 17 — PN 10</option>
    <option value="13.6">SDR 13.6 — PN 12.5</option>
    <option value="11">SDR 11 — PN 16</option>
    <option value="9">SDR 9 — PN 20</option>
  </select></div>
  </div>

  <div class="form-group" id="dns-temp-wrap" style="display:none"><label class="form-label">Suhu Operasional Pipa (°C)${infoTip('Suhu fluida / operasional.\\nPipa plastik mengalami penurunan rating tekanan (derating) pada suhu >20°C.\\nBatas maks HDPE: 40°C.')}</label>
  <input type="number" class="form-control" id="dns-temp" min="20" max="60" value="20"></div>

  <div class="form-title" style="margin-top:15px; font-size:12px; margin-bottom:8px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> Data Hidrolika</div>

  <div class="form-group"><label class="form-label">Metode Perhitungan Head Loss${infoTip('Pilih rumus hidrolika:\\n• Hazen-Williams: Standar empiris air bersih suhu normal (cepat & akurat untuk jaringan air minum).\\n• Darcy-Weisbach: Universal untuk semua fluida & temperatur (memperhitungkan viskositas kinematik & kekasaran mutlak dinding pipa).\\nSumber: AWWA M55 / Crane TP 410')}</label>
  <select class="form-control" id="dns-eq">
    <option value="hw" selected>Hazen-Williams (Standar Air Bersih)</option>
    <option value="dw">Darcy-Weisbach (Universal Fluida / Kental)</option>
  </select></div>

  <div class="form-group"><label class="form-label">Debit Aliran (Q)${infoTip('Debit desain aliran air.\\nKonversi: 1 L/s = 3.6 m³/jam\\nSumber: PPI Handbook Ch.6')}</label>
  <div style="display:flex;gap:6px">
    <input type="number" class="form-control" id="dns-q" min="0.1" max="10000" step="0.1" value="10" style="flex:1">
    <select class="form-control" id="dns-q-unit" style="width:90px" onchange="dnConvertQ()">
      <option value="ls" selected>L/s</option>
      <option value="m3h">m³/jam</option>
    </select>
  </div></div>

  <div class="form-group"><label class="form-label">Kecepatan Aliran Target (v)${infoTip('Kecepatan aliran di dalam pipa.\\nOptimal: 0.6–1.5 m/s (water supply)\\nMaks: 3.0 m/s\\nSumber: AWWA M55 §5.4 | PPI Handbook Ch.6')}</label>
  <input type="number" class="form-control" id="dns-v" min="0.3" max="5.0" step="0.1" value="1.5">
  <div style="font-size:10.5px; color:var(--text2); margin-top:3px">Optimal: 0.6–1.5 m/s · Maks: 3.0 m/s (AWWA M55)</div></div>

  <div class="form-group"><label class="form-label">Panjang Pipa Total (m)${infoTip('Panjang total jalur pipa dari sumber ke tujuan.\\nTermasuk jalur horizontal dan vertikal.')}</label>
  <input type="number" class="form-control" id="dns-l" min="1" max="100000" value="500"></div>

  <div class="form-group"><label class="form-label">Beda Elevasi / Static Head (m)${infoTip('Perbedaan tinggi antara titik awal dan titik akhir.\\nPositif = aliran naik (perlu pompa)\\nNegatif = aliran turun (gravitasi)\\nSumber: AWWA M55 §5.2')}</label>
  <input type="number" class="form-control" id="dns-hstatic" min="-500" max="500" value="20"></div>

  <div class="form-group"><label class="form-label">Faktor Minor Loss (% dari head loss mayor)${infoTip('Persentase tambahan head loss dari fitting, valve, dll.\\nTipikal: 10–20% dari head loss mayor\\nUntuk desain awal yang belum detail fitting.\\nSumber: Crane TP 410')}</label>
  <input type="number" class="form-control" id="dns-minor" min="0" max="100" step="5" value="15">
  <div style="font-size:10.5px; color:var(--text2); margin-top:3px">Tipikal: 10–20% · Banyak fitting: 20–30%</div></div>

  <div class="form-title" style="margin-top:15px; font-size:12px; margin-bottom:8px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/></svg> Parameter Pompa</div>

  <div class="form-group"><label class="form-label">Efisiensi Pompa (%)${infoTip('Efisiensi pompa sentrifugal tipikal.\\nPompa kecil: 50–65%\\nPompa sedang: 65–80%\\nPompa besar: 75–85%\\nSumber: ISO 9906')}</label>
  <input type="number" class="form-control" id="dns-eff-pump" min="30" max="95" value="70"></div>

  <div class="form-group"><label class="form-label">Efisiensi Motor (%)${infoTip('Efisiensi motor listrik.\\nMotor IE2: 85–90%\\nMotor IE3: 90–93%\\nMotor IE4: 93–96%\\nSumber: IEC 60034-30-1')}</label>
  <input type="number" class="form-control" id="dns-eff-motor" min="70" max="99" value="90"></div>

  <button class="calc-btn" onclick="calcDNSizing()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung DN & Daya Pompa</button>`;

  dnUpdateMaterial();
}

// ===== Material change handler =====
function dnUpdateMaterial() {
  var mat = E('dns-mat').value;
  var isHDPE = (mat === 'hdpe');
  var isPlastic = (mat === 'hdpe' || mat === 'pvc' || mat === 'ppr');
  
  E('dns-sdr-wrap').style.display = isHDPE ? 'block' : 'none';
  E('dns-temp-wrap').style.display = isPlastic ? 'block' : 'none';
  
  if (!isPlastic) {
    E('dns-temp').value = 20; // reset
  }
}

// ===== Q unit conversion =====
function dnConvertQ() {
  // Just a visual helper — actual conversion in calcDNSizing
}

// ===== Get available pipe sizes for material =====
function dnGetPipeSizes(mat, sdr) {
  var sdrNum = parseFloat(sdr);

  if (mat === 'hdpe') {
    // Standard HDPE PE100 pipe dimensions (ISO 4427 / SNI 4829)
    var hdpeTable = {
      20: { 11: 2.0, 9: 2.3, 7.4: 2.8 },
      25: { 13.6: 2.0, 11: 2.3, 9: 2.8, 7.4: 3.4 },
      32: { 17: 2.0, 13.6: 2.4, 11: 3.0, 9: 3.6, 7.4: 4.4 },
      40: { 21: 2.0, 17: 2.4, 13.6: 3.0, 11: 3.7, 9: 4.5, 7.4: 5.5 },
      50: { 26: 2.0, 21: 2.4, 17: 3.0, 13.6: 3.7, 11: 4.6, 9: 5.6, 7.4: 6.8 },
      63: { 26: 2.5, 21: 3.0, 17: 3.8, 13.6: 4.7, 11: 5.8, 9: 7.0, 7.4: 8.6 },
      75: { 26: 2.9, 21: 3.6, 17: 4.5, 13.6: 5.6, 11: 6.8, 9: 8.4, 7.4: 10.2 },
      90: { 26: 3.5, 21: 4.3, 17: 5.4, 13.6: 6.7, 11: 8.2, 9: 10.0, 7.4: 12.2 },
      110: { 26: 4.2, 21: 5.3, 17: 6.6, 13.6: 8.1, 11: 10.0, 9: 12.3, 7.4: 14.9 },
      125: { 26: 4.8, 21: 6.0, 17: 7.4, 13.6: 9.2, 11: 11.4, 9: 13.9, 7.4: 16.9 },
      140: { 26: 5.4, 21: 6.7, 17: 8.3, 13.6: 10.3, 11: 12.7, 9: 15.6, 7.4: 19.0 },
      160: { 26: 6.2, 21: 7.7, 17: 9.5, 13.6: 11.8, 11: 14.6, 9: 17.8, 7.4: 21.7 },
      180: { 26: 6.9, 21: 8.6, 17: 10.7, 13.6: 13.3, 11: 16.4, 9: 20.0, 7.4: 24.4 },
      200: { 26: 7.7, 21: 9.6, 17: 11.9, 13.6: 14.7, 11: 18.2, 9: 22.3, 7.4: 27.1 },
      225: { 26: 8.6, 21: 10.8, 17: 13.4, 13.6: 16.6, 11: 20.5, 9: 25.0, 7.4: 30.5 },
      250: { 26: 9.6, 21: 11.9, 17: 14.8, 13.6: 18.4, 11: 22.7, 9: 27.8, 7.4: 33.8 },
      280: { 26: 10.7, 21: 13.4, 17: 16.6, 13.6: 20.6, 11: 25.4, 9: 31.2, 7.4: 37.9 },
      315: { 26: 12.1, 21: 15.0, 17: 18.7, 13.6: 23.2, 11: 28.6, 9: 35.0, 7.4: 42.6 },
      355: { 26: 13.6, 21: 16.9, 17: 21.1, 13.6: 26.1, 11: 32.3, 9: 39.5, 7.4: 48.0 },
      400: { 26: 15.3, 21: 19.1, 17: 23.7, 13.6: 29.4, 11: 36.4, 9: 44.5, 7.4: 54.1 },
      450: { 26: 17.2, 21: 21.5, 17: 26.7, 13.6: 33.1, 11: 40.9, 9: 50.0, 7.4: 60.9 },
      500: { 26: 19.1, 21: 23.9, 17: 29.7, 13.6: 36.8, 11: 45.5, 9: 55.6, 7.4: 67.6 },
      560: { 26: 21.4, 21: 26.7, 17: 33.2, 13.6: 41.2, 11: 50.8, 9: 62.3, 7.4: 75.7 },
      630: { 26: 24.1, 21: 30.0, 17: 37.4, 13.6: 46.3, 11: 57.2, 9: 70.0, 7.4: 85.2 },
      710: { 26: 27.2, 21: 33.9, 17: 42.1, 13.6: 52.2, 11: 64.5, 9: 78.9, 7.4: 96.0 },
      800: { 26: 30.6, 21: 38.1, 17: 47.4, 13.6: 58.8, 11: 72.6, 9: 88.9, 7.4: 108.2 },
      900: { 26: 34.4, 21: 42.9, 17: 53.3, 13.6: 66.1, 11: 81.7, 9: 100.0, 7.4: 121.7 },
      1000: { 26: 38.2, 21: 47.7, 17: 59.3, 13.6: 73.5, 11: 90.8, 9: 111.2, 7.4: 135.2 },
      1200: { 26: 45.9, 21: 57.2, 17: 71.1, 13.6: 88.2, 11: 109.0, 9: 133.4, 7.4: 162.2 }
    };
    
    var sizes = [];
    Object.keys(hdpeTable).forEach(function(odStr) {
      var od = parseFloat(odStr);
      var en = hdpeTable[odStr][sdrNum];
      if (en) {
        sizes.push({ od: od, en: en, id: od - 2 * en });
      }
    });
    sizes.sort(function(a, b) { return a.od - b.od; });
    return sizes;
  }

  // Generic pipe sizes for non-HDPE materials
  var genericSizes = {
    'pvc': [
      { od: 20, en: 1.5 }, { od: 25, en: 1.5 }, { od: 32, en: 1.8 }, { od: 40, en: 2.0 },
      { od: 50, en: 2.4 }, { od: 63, en: 3.0 }, { od: 75, en: 3.6 }, { od: 90, en: 4.3 },
      { od: 110, en: 5.3 }, { od: 125, en: 6.0 }, { od: 140, en: 6.7 }, { od: 160, en: 7.7 },
      { od: 200, en: 9.6 }, { od: 225, en: 10.8 }, { od: 250, en: 11.9 }, { od: 315, en: 15.0 },
      { od: 355, en: 16.9 }, { od: 400, en: 19.1 }, { od: 450, en: 21.5 }, { od: 500, en: 23.9 }
    ],
    'ppr': [
      { od: 20, en: 3.4 }, { od: 25, en: 4.2 }, { od: 32, en: 5.4 }, { od: 40, en: 6.7 },
      { od: 50, en: 8.3 }, { od: 63, en: 10.5 }, { od: 75, en: 12.5 }, { od: 90, en: 15.0 },
      { od: 110, en: 18.3 }, { od: 125, en: 20.8 }, { od: 160, en: 26.6 }
    ],
    'steel': [
      { od: 21.3, en: 2.8, dn: 15 }, { od: 26.7, en: 2.9, dn: 20 }, { od: 33.4, en: 3.4, dn: 25 },
      { od: 42.2, en: 3.6, dn: 32 }, { od: 48.3, en: 3.7, dn: 40 }, { od: 60.3, en: 3.9, dn: 50 },
      { od: 76.1, en: 5.2, dn: 65 }, { od: 88.9, en: 5.5, dn: 80 }, { od: 114.3, en: 6.0, dn: 100 },
      { od: 139.7, en: 6.6, dn: 125 }, { od: 168.3, en: 7.1, dn: 150 }, { od: 219.1, en: 8.2, dn: 200 },
      { od: 273.0, en: 9.3, dn: 250 }, { od: 323.9, en: 10.3, dn: 300 }, { od: 355.6, en: 11.1, dn: 350 },
      { od: 406.4, en: 12.7, dn: 400 }, { od: 508.0, en: 12.7, dn: 500 }, { od: 610.0, en: 14.3, dn: 600 }
    ],
    'di': [
      { od: 77, en: 6.0, dn: 60 }, { od: 98, en: 6.0, dn: 80 }, { od: 118, en: 6.1, dn: 100 },
      { od: 144, en: 6.3, dn: 125 }, { od: 170, en: 6.0, dn: 150 }, { od: 222, en: 6.4, dn: 200 },
      { od: 274, en: 6.8, dn: 250 }, { od: 326, en: 7.2, dn: 300 }, { od: 378, en: 7.7, dn: 350 },
      { od: 429, en: 8.1, dn: 400 }, { od: 532, en: 9.0, dn: 500 }, { od: 635, en: 9.9, dn: 600 }
    ]
  };

  var table = genericSizes[mat] || genericSizes['pvc'];
  return table.map(function(p) {
    return { od: p.od, en: p.en, id: p.od - 2 * p.en, dn: p.dn || null };
  });
}

// Derating factor untuk HDPE berdasarkan kurva standar
function getHDPE_DeratingFactor(T) {
  if (T <= 20) return 1.0;
  if (T <= 25) return 1.0 - (T - 20) * 0.015;        // 1.0 -> 0.925
  if (T <= 30) return 0.925 - (T - 25) * 0.015;      // 0.925 -> 0.85
  if (T <= 35) return 0.85 - (T - 30) * 0.012;       // 0.85 -> 0.79
  if (T <= 40) return 0.79 - (T - 35) * 0.012;       // 0.79 -> 0.73
  return 0; // >40C (Maximum exceeded)
}

// ===== Main Calculation =====
function calcDNSizing() {
  var fluidType = E('dns-fluid') ? E('dns-fluid').value : 'Air Bersih (Clean Water)';
  var sg = E('dns-sg') ? parseFloat(E('dns-sg').value) || 1.0 : 1.0;
  var eqMethod = E('dns-eq') ? E('dns-eq').value : 'hw';
  var visc_cSt = E('dns-visc') ? parseFloat(E('dns-visc').value) || 1.0 : 1.0;
  var nu = visc_cSt * 1e-6; // convert cSt (mm²/s) to m²/s
  var mat = E('dns-mat').value;
  var matData = DN_MATERIAL_DATA[mat];
  var C = matData.C;
  var sdr = (mat === 'hdpe') ? parseFloat(E('dns-sdr').value) : null;
  var temp = parseFloat(E('dns-temp').value) || 20;

  // Parse inputs
  var qUnit = E('dns-q-unit').value;
  var qRaw = Vf('dns-q');
  var Q_ls = (qUnit === 'm3h') ? qRaw / 3.6 : qRaw;   // convert to L/s
  var Q_m3s = Q_ls / 1000;                               // m³/s
  var Q_m3h = Q_ls * 3.6;                                // m³/jam

  var vTarget = Vf('dns-v');
  var L = Vf('dns-l');
  var Hstatic = Vf('dns-hstatic');
  var minorPct = Vf('dns-minor') / 100;
  var effPump = Vf('dns-eff-pump') / 100;
  var effMotor = Vf('dns-eff-motor') / 100;

  // 1. Calculate minimum diameter from Q and v
  var D_min_m = Math.sqrt(4 * Q_m3s / (Math.PI * vTarget));
  var D_min_mm = D_min_m * 1000;

  // 2. Get available pipe sizes
  var sizes = dnGetPipeSizes(mat, sdr);
  if (sizes.length === 0) {
    E('eng-results').innerHTML = smartWarn('danger', 'Data dimensi pipa tidak tersedia untuk material dan SDR yang dipilih.', '');
    return;
  }

  // 3. Find all candidates and calculate hydraulics for each
  var candidates = [];
  sizes.forEach(function(pipe) {
    var id_m = pipe.id / 1000;
    var A = Math.PI * id_m * id_m / 4;
    var v_actual = Q_m3s / A;

    // Reynolds number (using dynamic kinematic viscosity nu)
    var Re = v_actual * id_m / nu;
    var regime = Re < 2300 ? 'Laminar' : (Re < 4000 ? 'Transisi' : 'Turbulen');

    // Head loss calculation
    var hf_major = 0;
    var f = 0;
    if (eqMethod === 'dw') {
      var epsilon_m = matData.epsilon / 1000; // convert mm to m
      var relRough = epsilon_m / id_m;
      if (Re < 2300) {
        f = 64 / Math.max(Re, 1);
      } else {
        // Swamee-Jain equation for friction factor f in Colebrook-White approximation
        var term = relRough / 3.7 + 5.74 / Math.pow(Math.max(Re, 1), 0.9);
        f = 0.25 / Math.pow(Math.log10(term), 2);
      }
      hf_major = f * (L / id_m) * (v_actual * v_actual / (2 * 9.81));
    } else {
      hf_major = 10.67 * Math.pow(Q_m3s, 1.852) / (Math.pow(C, 1.852) * Math.pow(id_m, 4.87)) * L;
    }

    var hf_minor = hf_major * minorPct;
    var hf_total = hf_major + hf_minor;

    // Total Dynamic Head
    var TDH = Math.max(0, Hstatic) + hf_total;

    // Pump power
    var P_water = 9.81 * (1000 * sg) * Q_m3s * TDH; // Watt (ρ×g×Q×H)
    var P_pump = P_water / effPump;
    var P_motor = P_pump / effMotor;
    var P_motor_kW = P_motor / 1000;
    var P_motor_HP = P_motor_kW * 1.341;

    // Find nearest standard motor size
    var P_std_kW = STD_MOTOR_SIZES[STD_MOTOR_SIZES.length - 1];
    for (var i = 0; i < STD_MOTOR_SIZES.length; i++) {
      if (STD_MOTOR_SIZES[i] >= P_motor_kW) {
        P_std_kW = STD_MOTOR_SIZES[i];
        break;
      }
    }

    // Head loss per 100m
    var hfPer100 = hf_total / L * 100;

    candidates.push({
      od: pipe.od,
      en: pipe.en,
      id: pipe.id,
      dn: pipe.dn || pipe.od,
      v: v_actual,
      hf_major: hf_major,
      hf_minor: hf_minor,
      hf_total: hf_total,
      hfPer100: hfPer100,
      TDH: TDH,
      f: f,
      Re: Re,
      regime: regime,
      P_water_kW: P_water / 1000,
      P_pump_kW: P_pump / 1000,
      P_motor_kW: P_motor_kW,
      P_motor_HP: P_motor_HP,
      P_std_kW: P_std_kW,
      P_std_HP: P_std_kW * 1.341
    });
  });

  // 4. Select optimal pipe: smallest ID >= D_min_mm with v <= vTarget×1.2
  var selected = null;
  var selectedIdx = -1;
  for (var i = 0; i < candidates.length; i++) {
    if (candidates[i].id >= D_min_mm * 0.95) { // 5% tolerance
      selected = candidates[i];
      selectedIdx = i;
      break;
    }
  }

  // Fallback to largest available if none fits
  if (!selected) {
    selected = candidates[candidates.length - 1];
    selectedIdx = candidates.length - 1;
  }

  // 5. Get comparison candidates (one below, selected, one above)
  var compareList = [];
  if (selectedIdx > 0) compareList.push({ pipe: candidates[selectedIdx - 1], label: 'Lebih Kecil', tag: 'small' });
  compareList.push({ pipe: selected, label: 'Rekomendasi', tag: 'rec' });
  if (selectedIdx < candidates.length - 1) compareList.push({ pipe: candidates[selectedIdx + 1], label: 'Lebih Besar', tag: 'large' });

  // SDR/PN label for HDPE
  var sdrLabel = '';
  if (mat === 'hdpe' && sdr) {
    var pnData = SDR_PN_MAP[sdr];
    sdrLabel = 'SDR ' + sdr + ' / ' + (pnData ? pnData.label : '');
  }

  // 6. Build results HTML
  var dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  var html = '<div class="screen-only">';
  
  html += `<button class="export-pdf-btn" onclick="window.print()" style="float:right; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; background:rgba(0,229,255,0.1); border:1px solid rgba(0,229,255,0.3); color:#00e5ff; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; margin-bottom:10px; transition:all 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF / Cetak</button><div style="clear:both"></div>`;

  // --- Section 1: Selected Pipe ---
  html += `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Rekomendasi Ukuran Pipa</div>
  ${refBadges([eqMethod === 'dw' ? 'Darcy-Weisbach (Colebrook-White)' : 'Hazen-Williams', 'ISO 4427-2:2019', 'PPI Handbook Ch.6'])}
  <div class="result-grid">
    <div class="result-item" style="grid-column:span 2;background:rgba(0,229,255,.08);border-color:var(--sys-accent)">
      <div class="rk">Rekomendasi Diameter Pipa</div>
      <div class="rv" style="font-size:28px;color:#00e5ff">DN${selected.dn}<span class="ru"> mm</span></div>
    </div>
    <div class="result-item"><div class="rk">OD × en</div><div class="rv">${selected.od} × ${selected.en.toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Diameter Dalam (ID)</div><div class="rv">${selected.id.toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Material</div><div class="rv" style="font-size:13px">${matData.label}</div></div>
    <div class="result-item"><div class="rk">${mat === 'hdpe' ? 'SDR / PN' : (eqMethod === 'dw' ? 'Kekasaran (ε)' : 'C-Factor')}</div><div class="rv" style="font-size:13px">${mat === 'hdpe' ? sdrLabel : (eqMethod === 'dw' ? matData.epsilon + ' mm' : 'C = ' + C)}</div></div>
  </div>
  <div style="font-size:11px;color:var(--text2);margin-top:6px"><em>*Diameter minimum teoritis: ${D_min_mm.toFixed(1)} mm ID (dari Q=${Q_ls.toFixed(1)} L/s, v=${vTarget} m/s)</em></div>
  </div>`;

  // --- Section 2: Hydraulic Results ---
  html += `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> Analisis Hidrolika</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Flow Rate (Q)</div><div class="rv">${Q_ls.toFixed(2)}<span class="ru"> L/s</span></div></div>
    <div class="result-item"><div class="rk">Volumetric Flow</div><div class="rv">${Q_m3h.toFixed(1)}<span class="ru"> m³/h</span></div></div>
    <div class="result-item"><div class="rk">Flow Velocity (v)</div><div class="rv">${selected.v.toFixed(2)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Reynolds Number (Re)</div><div class="rv">${selected.Re > 1e6 ? (selected.Re / 1e6).toFixed(2) + '<span class="ru"> ×10⁶</span>' : Math.round(selected.Re).toLocaleString()}<span class="ru" style="display:${selected.Re > 1e6 ? 'none' : 'inline'}"> (${selected.regime})</span></div></div>
    <div class="result-item"><div class="rk">Major Head Loss</div><div class="rv">${selected.hf_major.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="background:rgba(255,140,66,0.1);border-color:var(--warn)"><div class="rk">Minor Head Loss (${(minorPct*100).toFixed(0)}%)</div><div class="rv">${selected.hf_minor.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Total Head Loss</div><div class="rv">${selected.hf_total.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Friction Loss / 100m</div><div class="rv">${selected.hfPer100.toFixed(3)}<span class="ru"> m/100m</span></div></div>
    <div class="result-item"><div class="rk">Static Head</div><div class="rv">${Hstatic.toFixed(1)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="grid-column:span 2;background:rgba(0,229,255,.06);border-color:rgba(0,229,255,.3)"><div class="rk">Total Dynamic Head (TDH)</div><div class="rv" style="font-size:24px">${selected.TDH.toFixed(2)}<span class="ru"> m</span></div></div>
  </div>
  ${velocityWarnings(selected.v, 'pressure')}`;

  // Operating Pressure vs PN Warning
  var printWarnings = [];

  if (mat === 'hdpe' && sdr) {
    var pnData = SDR_PN_MAP[sdr];
    var derating = getHDPE_DeratingFactor(temp);
    
    if (derating === 0) {
      html += smartWarn('danger', 
        'Suhu operasional (' + temp + ' °C) melebihi batas maksimal pipa HDPE (40 °C)!', 
        'Pipa HDPE akan kehilangan kekuatan struktural secara drastis pada suhu ini. Gunakan material lain (misal PPR atau Baja).');
      printWarnings.push('<li><strong style="color:#d32f2f">Suhu Ekstrem:</strong> Suhu operasional (' + temp + ' °C) melebihi batas maksimal pipa HDPE (40 °C)! Pipa HDPE akan kehilangan kekuatan struktural secara drastis pada suhu ini.</li>');
    } else {
      var pnDerated = pnData.pn * derating;
      var operatingPressureBar = selected.TDH / 10.197; // 1 bar = 10.197 mH2O
      var derateText = derating < 1.0 ? ' (setelah derating suhu ' + temp + '°C = ' + pnDerated.toFixed(2) + ' bar)' : '';
      
      if (pnData && operatingPressureBar > pnDerated) {
        html += smartWarn('danger', 
          'Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) <strong>melebihi kapasitas tekanan pipa' + derateText + '!</strong>', 
          'Bahaya pecah! Pilih SDR/PN yang lebih tinggi.');
        printWarnings.push('<li><strong style="color:#d32f2f">Overpressure:</strong> Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) melebihi batas aman tekanan pipa' + derateText + '! Bahaya pecah, gunakan kelas PN yang lebih tinggi.</li>');
      } else if (pnData && operatingPressureBar > pnDerated * 0.8) {
        html += smartWarn('caution', 
          'Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) mendekati batas kapasitas tekanan pipa' + derateText + '.', 
          'Sisakan safety margin minimal 20% untuk surge/water hammer.');
        printWarnings.push('<li><strong style="color:#e65100">Batas Tekanan:</strong> Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) mendekati batas kapasitas tekanan pipa' + derateText + '. Sisakan margin aman 20% untuk water hammer.</li>');
      } else if (pnData) {
        html += smartWarn('ok', 
          'Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) aman di bawah kapasitas pipa' + derateText + '.', 
          '');
        printWarnings.push('<li><strong>Operating Pressure:</strong> Total tekanan aliran (' + operatingPressureBar.toFixed(1) + ' bar) terkonfirmasi aman di bawah batas kapasitas pipa' + derateText + '.</li>');
      }
    }
  }

  // Head loss per 100m warning
  if (selected.hfPer100 > 10) {
    html += smartWarn('caution', 'Head loss ' + selected.hfPer100.toFixed(2) + ' m/100m cukup tinggi. Pertimbangkan diameter lebih besar untuk mengurangi friction loss.', 'AWWA M55 §5.4');
    printWarnings.push('<li><strong style="color:#e65100">Head Loss Tinggi:</strong> Head loss (' + selected.hfPer100.toFixed(2) + ' m/100m) cukup tinggi. Pertimbangkan diameter lebih besar untuk mengurangi pressure loss.</li>');
  } else if (selected.hfPer100 <= 5) {
    html += smartWarn('ok', 'Head loss ' + selected.hfPer100.toFixed(2) + ' m/100m — dalam rentang efisien.', 'AWWA M55: Tipikal ≤ 5 m/100m');
    printWarnings.push('<li><strong>Head Loss Optimal:</strong> Kehilangan tekanan berada dalam rentang efisien (' + selected.hfPer100.toFixed(2) + ' m/100m).</li>');
  }

  // Velocity warning for print
  if (selected.v > 3.0) {
    printWarnings.push('<li><strong style="color:#d32f2f">Kecepatan Ekstrem:</strong> Kecepatan aliran ' + selected.v.toFixed(2) + ' m/s berpotensi merusak pipa akibat abrasi dan water hammer.</li>');
  } else if (selected.v < 0.6) {
    printWarnings.push('<li><strong style="color:#e65100">Kecepatan Rendah:</strong> Kecepatan aliran ' + selected.v.toFixed(2) + ' m/s dapat menyebabkan pengendapan partikel (silting).</li>');
  }

  html += '</div>';

  // --- Section 3: Pump Power ---
  html += `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7-7h6m6 0h6"/></svg> Daya Motor Pompa</div>
  ${refBadges(['P = ρ×g×Q×H / η', 'ISO 9906', 'IEC 60034-30-1'])}
  <div class="result-grid">
    <div class="result-item"><div class="rk">Hydraulic Power (P<sub>water</sub>)</div><div class="rv">${selected.P_water_kW.toFixed(2)}<span class="ru"> kW</span></div></div>
    <div class="result-item"><div class="rk">Pump Shaft Power (η=${(effPump*100).toFixed(0)}%)</div><div class="rv">${selected.P_pump_kW.toFixed(2)}<span class="ru"> kW</span></div></div>
    <div class="result-item" style="grid-column:span 2;background:rgba(0,229,255,.08);border-color:var(--sys-accent)">
      <div class="rk">Motor Power Req. (η=${(effMotor*100).toFixed(0)}%)</div>
      <div class="rv" style="font-size:22px;color:#00e5ff">${selected.P_motor_kW.toFixed(2)}<span class="ru"> kW</span> <span style="font-size:14px;color:var(--text2)">(${selected.P_motor_HP.toFixed(1)} HP)</span></div>
    </div>
    <div class="result-item" style="grid-column:span 2;background:rgba(0,230,118,.08);border-color:rgba(0,230,118,.3)">
      <div class="rk">Standard Motor Size</div>
      <div class="rv" style="font-size:22px;color:#00e676">${selected.P_std_kW}<span class="ru"> kW</span> <span style="font-size:14px;color:var(--text2)">(${selected.P_std_HP.toFixed(1)} HP)</span></div>
    </div>
  </div>`;

  // Pump power formula breakdown
  html += `<div style="margin-top:10px;padding:10px 12px;background:rgba(0,229,255,.04);border:1px solid rgba(0,229,255,.1);border-radius:8px;font-size:11px;color:var(--text2);line-height:1.8">
    <div style="color:#6dd5ed;font-weight:600;margin-bottom:4px">Rincian Perhitungan Total Dynamic Head (TDH):</div>
    <div>h<sub>mayor</sub> = ${eqMethod === 'dw' ? `Darcy-Weisbach (f=${selected.f.toFixed(4)}, ε=${matData.epsilon}mm, ν=${visc_cSt}cSt)` : `Hazen-Williams (L=${L}m, C=${C}, ID=${selected.id.toFixed(1)}mm)`} = <strong>${selected.hf_major.toFixed(2)} m</strong></div>
    <div>h<sub>minor</sub> = ${(minorPct*100).toFixed(0)}% × h<sub>mayor</sub> = <strong>${selected.hf_minor.toFixed(2)} m</strong></div>
    <div>TDH = Static Head + h<sub>mayor</sub> + h<sub>minor</sub> = ${Hstatic.toFixed(1)} + ${selected.hf_major.toFixed(2)} + ${selected.hf_minor.toFixed(2)} = <strong>${selected.TDH.toFixed(2)} m</strong></div>
    
    <div style="color:#6dd5ed;font-weight:600;margin-top:8px;margin-bottom:4px">Rincian Perhitungan Daya Motor Pompa:</div>
    <div>P<sub>water</sub> = ρ × g × Q × TDH = ${Math.round(1000*sg)} × 9.81 × ${Q_m3s.toFixed(4)} × ${selected.TDH.toFixed(2)} = <strong>${(selected.P_water_kW * 1000).toFixed(1)} W</strong></div>
    <div>P<sub>pump</sub> = P<sub>water</sub> / η<sub>pump</sub> = ${(selected.P_water_kW * 1000).toFixed(1)} / ${effPump.toFixed(2)} = <strong>${(selected.P_pump_kW * 1000).toFixed(1)} W</strong></div>
    <div>P<sub>motor</sub> = P<sub>pump</sub> / η<sub>motor</sub> = ${(selected.P_pump_kW * 1000).toFixed(1)} / ${effMotor.toFixed(2)} = <strong>${(selected.P_motor_kW * 1000).toFixed(1)} W = ${selected.P_motor_kW.toFixed(2)} kW</strong></div>
  </div>`;

  html += '</div>';

  // --- Section 4: Comparison Table ---
  html += `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg> Perbandingan Ukuran Pipa</div>
  <div style="overflow-x:auto">
  <table class="ref-table" style="width:100%;margin-top:6px">
    <tr>
      <th style="min-width:110px">Parameter</th>`;

  compareList.forEach(function(c) {
    var isRec = c.tag === 'rec';
    html += '<th style="min-width:100px;' + (isRec ? 'background:rgba(0,229,255,.12);color:#00e5ff' : '') + '">' + 
      (isRec ? '⭐ ' : '') + 'DN' + c.pipe.dn + '<br><span style="font-size:9px;opacity:0.7">' + c.label + '</span></th>';
  });

  html += '</tr>';

  // Table rows
  var rows = [
    { label: 'OD × en (mm)',    fn: function(p) { return p.od + ' × ' + p.en.toFixed(1); } },
    { label: 'ID (mm)',          fn: function(p) { return p.id.toFixed(1); } },
    { label: 'Kecepatan (m/s)', fn: function(p) { 
      var color = p.v >= 0.6 && p.v <= 1.5 ? '#00e676' : (p.v > 3.0 ? '#ff5555' : '#ffaa00');
      return '<span style="color:' + color + '">' + p.v.toFixed(2) + '</span>'; 
    }},
    { label: 'Head Loss (m)',    fn: function(p) { return p.hf_total.toFixed(2); } },
    { label: 'HL/100m (m)',      fn: function(p) { return p.hfPer100.toFixed(3); } },
    { label: 'TDH (m)',          fn: function(p) { return p.TDH.toFixed(2); } },
    { label: 'P Motor (kW)',     fn: function(p) { return p.P_motor_kW.toFixed(2); } },
    { label: 'Motor Std (kW)',   fn: function(p) { return '<strong>' + p.P_std_kW + '</strong>'; } },
    { label: 'P Motor (HP)',     fn: function(p) { return p.P_std_HP.toFixed(1); } }
  ];

  rows.forEach(function(row) {
    html += '<tr><td style="font-weight:500">' + row.label + '</td>';
    compareList.forEach(function(c) {
      var isRec = c.tag === 'rec';
      html += '<td style="text-align:center;' + (isRec ? 'background:rgba(0,229,255,.06)' : '') + '">' + row.fn(c.pipe) + '</td>';
    });
    html += '</tr>';
  });

  html += '</table></div></div>';

  // --- Section 5: Chart ---
  html += `<div class="chart-wrap"><div class="chart-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> DN vs Head Loss vs Daya Motor</div><div style="height:280px"><canvas id="chart-dnsizing"></canvas></div></div>`;
  
  html += '</div>'; // End screen-only

  // === PRINT ONLY REPORT ===
  html += `
    <div class="print-report-only">
      <div class="pr-header">
        <div class="pr-logo">Kalkulator Pipa Pro</div>
        <div class="pr-title">HYDRAULIC CALCULATION SHEET</div>
        <div class="pr-subtitle">Pipe Sizing & Pump Power Recommendation</div>
      </div>
      
      <div class="pr-info-grid">
        <div class="pr-info-col">
          <div class="pr-info-row"><span class="pr-label">Sistem Pipa:</span> <span class="pr-val">Jaringan Pemompaan Air</span></div>
          <div class="pr-info-row"><span class="pr-label">Jenis Fluida:</span> <span class="pr-val">${fluidType} (SG: ${sg.toFixed(2)})</span></div>
          <div class="pr-info-row"><span class="pr-label">Material Pipa:</span> <span class="pr-val">${matData.label} ${mat === 'hdpe' ? sdrLabel : ''}</span></div>
          <div class="pr-info-row"><span class="pr-label">${eqMethod === 'dw' ? 'Metode & Viskositas:' : 'Hazen-Williams C:'}</span> <span class="pr-val">${eqMethod === 'dw' ? `Darcy-Weisbach (ν=${visc_cSt} cSt, ε=${matData.epsilon}mm)` : C}</span></div>
        </div>
        <div class="pr-info-col">
          <div class="pr-info-row"><span class="pr-label">Tanggal Cetak:</span> <span class="pr-val">${dateStr}</span></div>
          <div class="pr-info-row"><span class="pr-label">Suhu Operasional:</span> <span class="pr-val">${temp} °C</span></div>
          <div class="pr-info-row"><span class="pr-label">Standar Acuan:</span> <span class="pr-val">${mat === 'hdpe' ? 'ISO 4427-2 / SNI 4829-2' : '-'}${eqMethod === 'dw' ? ' / Crane TP 410' : ''}</span></div>
          <div class="pr-info-row"><span class="pr-label">Dibuat Oleh:</span> <span class="pr-val">Kalkulator Pipa Pro</span></div>
        </div>
      </div>
      
      <h3 class="pr-section-title">1. INPUT PARAMETER</h3>
      <table class="pr-table">
        <tr>
          <td>Flow Rate (Q)</td><td><strong>${Q_ls.toFixed(2)}</strong> L/s <em>(${Q_m3h.toFixed(1)} m³/h)</em></td>
          <td>Target Velocity</td><td><strong>${vTarget}</strong> m/s</td>
        </tr>
        <tr>
          <td>Pipe Length (L)</td><td><strong>${L}</strong> m</td>
          <td>Static Head</td><td><strong>${Hstatic.toFixed(1)}</strong> m</td>
        </tr>
        <tr>
          <td>Minor Loss Factor</td><td><strong>${(minorPct*100).toFixed(0)}%</strong> dari Major Head Loss</td>
          <td>Pump / Motor Efficiency</td><td><strong>${(effPump*100).toFixed(0)}%</strong> / <strong>${(effMotor*100).toFixed(0)}%</strong></td>
        </tr>
      </table>

      <h3 class="pr-section-title">2. HASIL ANALISIS HIDROLIKA</h3>
      <table class="pr-table">
        <tr class="pr-highlight">
          <td>Rekomendasi Pipa</td><td colspan="3"><strong style="font-size:13px">DN${selected.dn}</strong> (OD ${selected.od} × en ${selected.en.toFixed(1)} mm)</td>
        </tr>
        <tr>
          <td>Inside Diameter (ID)</td><td><strong>${selected.id.toFixed(1)}</strong> mm</td>
          <td>Flow Velocity (v)</td><td><strong>${selected.v.toFixed(2)}</strong> m/s</td>
        </tr>
        <tr>
          <td>Reynolds Number (Re)</td><td><strong>${Math.round(selected.Re).toLocaleString()}</strong> <em>(${selected.regime})</em></td>
          <td>Friction Loss per 100m</td><td><strong>${selected.hfPer100.toFixed(3)}</strong> m / 100m</td>
        </tr>
        <tr>
          <td>Major Head Loss</td><td><strong>${selected.hf_major.toFixed(2)}</strong> m</td>
          <td>Minor Head Loss</td><td><strong>${selected.hf_minor.toFixed(2)}</strong> m</td>
        </tr>
        <tr class="pr-highlight">
          <td>Total Dynamic Head (TDH)</td><td colspan="3"><strong style="font-size:14px; color:#1a365d">${selected.TDH.toFixed(2)}</strong> m</td>
        </tr>
      </table>

      <h3 class="pr-section-title">3. KEBUTUHAN DAYA POMPA</h3>
      <table class="pr-table">
        <tr>
          <td>Hydraulic Power</td><td><strong>${selected.P_water_kW.toFixed(2)}</strong> kW</td>
          <td>Pump Shaft Power (BHP)</td><td><strong>${selected.P_pump_kW.toFixed(2)}</strong> kW</td>
        </tr>
        <tr class="pr-highlight">
          <td>Motor Power Req.</td><td><strong>${selected.P_motor_kW.toFixed(2)}</strong> kW <em>(${selected.P_motor_HP.toFixed(1)} HP)</em></td>
          <td>Standard Motor Size</td><td><strong style="font-size:14px; color:#1a365d">${selected.P_std_kW}</strong> kW <em>(${selected.P_std_HP.toFixed(1)} HP)</em></td>
        </tr>
      </table>

      <h3 class="pr-section-title">4. KESIMPULAN & PERINGATAN</h3>
      <div class="pr-notes">
        <ul style="margin:0; padding-left:15px; color:#333;">
          ${printWarnings.length > 0 ? printWarnings.join('\n          ') : '<li><strong>Status Aman:</strong> Seluruh parameter operasional berada dalam batas desain yang direkomendasikan.</li>'}
        </ul>
      </div>
      
      <div class="pr-footer">
        <p>Dokumen ini dihasilkan secara otomatis oleh <strong>Kalkulator Pipa Pro</strong>.</p>
        <p style="opacity:0.7">Gunakan sebagai panduan kalkulasi awal (preliminary calculation) dan pastikan untuk divalidasi oleh Engineer yang berwenang.</p>
      </div>
    </div>
  `;

  E('eng-results').innerHTML = html;

  // Animate values
  if (typeof animateValues === 'function') animateValues();

  // Render chart
  dnRenderChart(candidates, selectedIdx);
}

// ===== Chart rendering =====
function dnRenderChart(candidates, selectedIdx) {
  if (typeof Chart === 'undefined') return;
  if (typeof destroyChart === 'function') destroyChart('chart-dnsizing');
  var canvas = document.getElementById('chart-dnsizing');
  if (!canvas) return;

  // Take a subset around the selected index for readability
  var startIdx = Math.max(0, selectedIdx - 4);
  var endIdx = Math.min(candidates.length, selectedIdx + 5);
  var subset = candidates.slice(startIdx, endIdx);
  var adjustedSelIdx = selectedIdx - startIdx;

  var labels = subset.map(function(c) { return 'DN' + c.dn; });
  var dataHL = subset.map(function(c) { return c.hf_total; });
  var dataPower = subset.map(function(c) { return c.P_motor_kW; });

  // Color bars by selection
  var bgHL = dataHL.map(function(h, i) {
    return i === adjustedSelIdx ? 'rgba(0,229,255,.5)' : 'rgba(0,229,255,.15)';
  });
  var borderHL = dataHL.map(function(h, i) {
    return i === adjustedSelIdx ? '#00e5ff' : 'rgba(0,229,255,.3)';
  });

  var opts = typeof mergeOpts === 'function' ? mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Diameter Pipa', color: '#7a9ab8', font: { size: 11 } } },
      y: { title: { display: true, text: 'Head Loss (m)', color: '#7a9ab8', font: { size: 11 } }, position: 'left' },
      y1: {
        title: { display: true, text: 'Daya Motor (kW)', color: '#ff8c42', font: { size: 11 } },
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#ff8c42', font: { size: 10 } },
        border: { color: 'rgba(255,140,66,.2)' }
      }
    }
  }) : {};

  _chartInstances['chart-dnsizing'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Head Loss Total (m)',
          data: dataHL,
          backgroundColor: bgHL,
          borderColor: borderHL,
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y',
          order: 2
        },
        {
          label: 'Daya Motor (kW)',
          data: dataPower,
          type: 'line',
          borderColor: '#ff8c42',
          backgroundColor: 'rgba(255,140,66,.1)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: dataPower.map(function(p, i) { return i === adjustedSelIdx ? '#ff8c42' : 'rgba(255,140,66,.4)'; }),
          borderWidth: 2,
          yAxisID: 'y1',
          order: 1
        }
      ]
    },
    options: opts
  });
}
