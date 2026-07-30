// ==================== BUTT FUSION CALCULATOR ====================
// ISO 21307:2017 (SHP/SLP/DLP) + DVS 2207-1
// Corrected formulas per official standard

// HDPE PE100 wall thickness table (mm) — ISO 4427 / SNI 4829
// Format: {OD: {SDR: wall_thickness}}
var rucikaPipes = {
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
  1000: { 26: 38.2, 21: 47.7, 17: 59.3, 13.6: 73.5, 11: 90.8, 9: 111.2, 7.4: 135.2 }
};

// Batch collection for multi-pipe PDF export
var fusionBatchData = [];

function buildFusionForm() {
  // Build OD options
  var odOpts = Object.keys(rucikaPipes).map(function (od) {
    return '<option value="' + od + '"' + (od === '315' ? ' selected' : '') + '>DN' + od + '</option>';
  }).join('');

  document.getElementById('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Kalkulator Butt Fusion HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">ISO 21307 / DVS 2207</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar Pipa (OD) — PE100</label>
  <select class="form-control" id="bf-od" onchange="updateSDRoptions()">${odOpts}</select></div>
  <div class="form-group"><label class="form-label">SDR / PN</label>
  <select class="form-control" id="bf-sdr"></select></div>
  <div class="form-group"><label class="form-label">Tebal Dinding Aktual (en) — mm</label>
  <input type="number" class="form-control" id="bf-en" readonly style="background:rgba(0,229,255,.05);color:#00e5ff;font-weight:700"></div>
  <div class="form-group"><label class="form-label">Standar Acuan</label>
  <select class="form-control" id="bf-std" onchange="toggleFusionMode()"><option value="iso" selected>ISO 21307:2017</option><option value="dvs">DVS 2207-1</option></select></div>
  <div id="bf-mode-wrap">
  <div class="form-group"><label class="form-label">Mode Fusion (ISO 21307)</label>
  <select class="form-control" id="bf-mode"><option value="SLP">Single Low Pressure (SLP)</option><option value="SHP">Single High Pressure (SHP)</option><option value="DLP">Dual Low Pressure (DLP)</option></select></div>
  </div>
  <div class="form-group"><label class="form-label">Suhu Ambien (°C)</label>
  <input type="number" class="form-control" id="bf-temp" min="0" max="60" value="25" title="Suhu lingkungan. ISO SLP/DLP: >25°C tambah cooling 1%/1°C"></div>
  <div class="form-group"><label class="form-label">Cylinder Area Mesin — Ac (mm²)</label>
  <input type="number" class="form-control" id="bf-ac" min="100" max="100000" value="4418" placeholder="Lihat spesifikasi mesin fusion"></div>
  <div class="form-group"><label class="form-label">Drag Pressure — DP (bar)</label>
  <input type="number" class="form-control" id="bf-drag" min="0" max="10" step="0.1" value="0.5"></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="calc-btn" onclick="calcFusion()" style="flex:1;min-width:180px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Parameter Fusion</button>
    <button class="calc-btn" onclick="addFusionToBatch()" style="flex:1;min-width:160px;background:rgba(0,255,157,.08);border-color:rgba(0,255,157,.3);color:#00ff9d"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Tambah ke Daftar PDF</button>
  </div>
  <div id="bf-batch-list" style="margin-top:12px"></div>`;
  updateSDRoptions();
  renderFusionBatchList();
}

function updateSDRoptions() {
  var od = document.getElementById('bf-od').value;
  var pipe = rucikaPipes[od];
  if (!pipe) return;
  var sel = document.getElementById('bf-sdr');
  var pnMap = { 7.4: 'PN25', 9: 'PN20', 11: 'PN16', 13.6: 'PN12.5', 17: 'PN10', 21: 'PN8', 26: 'PN6.3' };
  sel.innerHTML = Object.keys(pipe).map(function (sdr) {
    return '<option value="' + sdr + '"' + (sdr === '17' ? ' selected' : '') + '>SDR ' + sdr + ' (' + pnMap[sdr] + ') — en ' + pipe[sdr] + ' mm</option>';
  }).join('');
  updateWallThickness();
}

function updateWallThickness() {
  var od = document.getElementById('bf-od').value;
  var sdr = document.getElementById('bf-sdr').value;
  var pipe = rucikaPipes[od];
  if (pipe && pipe[sdr]) {
    document.getElementById('bf-en').value = pipe[sdr];
  } else {
    document.getElementById('bf-en').value = (od / sdr).toFixed(1);
  }
}
// Listen for SDR changes
document.addEventListener('change', function (e) {
  if (e.target.id === 'bf-sdr') updateWallThickness();
});

function toggleFusionMode() {
  document.getElementById('bf-mode-wrap').style.display =
    document.getElementById('bf-std').value === 'iso' ? 'block' : 'none';
}

// ===== CORE FUSION CALCULATION (returns data object) =====
function computeFusionData() {
  var od = parseFloat(document.getElementById('bf-od').value);
  var sdr = parseFloat(document.getElementById('bf-sdr').value);
  var en = parseFloat(document.getElementById('bf-en').value);
  var std = document.getElementById('bf-std').value;
  var mode = document.getElementById('bf-mode').value;
  var Ac = parseFloat(document.getElementById('bf-ac').value) || 4418;
  var DP = parseFloat(document.getElementById('bf-drag').value) || 0;
  var temp = parseFloat(document.getElementById('bf-temp').value) || 25;

  var pnMap = { 7.4: 'PN25', 9: 'PN20', 11: 'PN16', 13.6: 'PN12.5', 17: 'PN10', 21: 'PN8', 26: 'PN6.3' };

  // Interfacial surface area — ISO 21307 formula: As = π × (dn - en) × en
  var As = Math.PI * (od - en) * en; // mm²
  // Bead height — ISO 21307: 0.5 + 0.1 × en
  var bead = Math.round((0.5 + 0.1 * en) * 10) / 10;

  var data = {
    od: od, sdr: sdr, en: en, std: std, mode: mode, Ac: Ac, DP: DP, temp: temp,
    As: As, bead: bead, id: (od - 2 * en),
    pnLabel: pnMap[sdr] || ('PN?'),
    sdrLabel: 'SDR ' + sdr
  };

  if (std === 'iso') {
    computeISO21307Data(data);
  } else {
    computeDVS2207Data(data);
  }

  return data;
}

function computeISO21307Data(data) {
  var en = data.en, od = data.od, As = data.As, Ac = data.Ac, DP = data.DP, mode = data.mode, temp = data.temp;

  if (mode === 'SLP') {
    data.Thp = 225;
    data.ThpTol = '± 10';
    data.IP_bead = 0.17;
    data.IP_heat = 0.02;
    data.IP_fuse = 0.17;
    data.fuseLabel = 'Single Low Pressure';
    data.heatSoakTime = Math.round(13.5 * en);
    data.heatFormula = '13.5 × en';
    data.changeoverMax = Math.round(3 + 0.03 * od);
    data.pressBuildup = Math.round(3 + 0.03 * od);
    if (en < 18) {
      data.coolingTime = Math.round((en + 3) * 60);
      data.coolFormula = '(en+3) min';
    } else {
      data.coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60);
      data.coolFormula = '0.015en²−0.47en+20 min';
    }
  } else if (mode === 'SHP') {
    data.Thp = 215;
    data.ThpTol = '± 15';
    data.IP_bead = 0.52;
    data.IP_heat = 0.02;
    data.IP_fuse = 0.52;
    data.fuseLabel = 'Single High Pressure';
    data.heatSoakTime = Math.round(11 * en);
    data.heatFormula = '11 × en';
    data.changeoverMax = Math.round(3 + 0.03 * od);
    data.pressBuildup = 'Not Specified';
    data.coolingTime = Math.round((0.43 * en) * 60);
    data.coolFormula = '0.43×en min';
  } else { // DLP
    data.isDLPError = en < 22;
    data.Thp = 232.5;
    data.ThpTol = '± 7.5';
    data.IP_bead = 0.15;
    data.IP_heat = 0.02;
    data.IP_fuse = 0.15;
    data.IP_cool = 0.025;
    data.fuseLabel = 'Dual Low Pressure';
    data.heatSoakTime = Math.round(10 * en + 60);
    data.heatFormula = '10×en+60';
    data.changeoverMax = 10;
    data.pressBuildup = 'Not Specified';
    data.coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60);
    data.coolFormula = '0.015en²−0.47en+20 min';
  }

  // Temperature adjustment for SLP and DLP
  data.tempMultiplier = 1;
  data.tempNotes = '';
  if ((mode === 'SLP' || mode === 'DLP') && temp > 25) {
    data.tempMultiplier = 1 + ((temp - 25) * 0.01);
    data.coolingTime = Math.round(data.coolingTime * data.tempMultiplier);
    data.tempNotes = ' (+' + Math.round((data.tempMultiplier - 1) * 100) + '% by Temp)';
  }

  // Calculate gauge pressures
  data.GP_bead = gaugeP(data.IP_bead, As, Ac, DP);
  data.GP_heat = gaugeP(data.IP_heat, As, Ac, DP);
  data.GP_fuse = gaugeP(data.IP_fuse, As, Ac, DP);
  data.GP_cool = mode === 'DLP' ? gaugeP(data.IP_cool, As, Ac, DP) : data.GP_fuse;

  // Force calculations
  data.F_bead = (data.IP_bead * As / 1000).toFixed(2);
  data.F_fuse = (data.IP_fuse * As / 1000).toFixed(2);
}

function computeDVS2207Data(data) {
  var en = data.en, od = data.od, As = data.As, Ac = data.Ac, DP = data.DP;

  data.Thp = 220;
  data.ThpTol = '';
  data.fuseLabel = 'DVS 2207-1 — PE100';
  data.IP_bead = 0.15;
  data.IP_heat = 0.02;
  data.IP_fuse = 0.15;
  data.heatSoakTime = Math.round(10 * en);
  data.heatFormula = '10 × en';

  if (en <= 4.5) data.changeoverMax = 5;
  else if (en <= 7) data.changeoverMax = 6;
  else if (en <= 12) data.changeoverMax = 8;
  else if (en <= 19) data.changeoverMax = 10;
  else if (en <= 26) data.changeoverMax = 12;
  else if (en <= 37) data.changeoverMax = 16;
  else if (en <= 50) data.changeoverMax = 20;
  else data.changeoverMax = 25;

  data.coolingTime = Math.round(10 * en + 10);
  data.coolFormula = '10×en+10';

  if (en <= 4.5) data.pressBuildup = 5;
  else if (en <= 7) data.pressBuildup = 6;
  else if (en <= 12) data.pressBuildup = 7;
  else if (en <= 19) data.pressBuildup = 9;
  else if (en <= 26) data.pressBuildup = 11;
  else data.pressBuildup = 14;

  data.GP_bead = gaugeP(data.IP_bead, As, Ac, DP);
  data.GP_heat = gaugeP(data.IP_heat, As, Ac, DP);
  data.GP_fuse = gaugeP(data.IP_fuse, As, Ac, DP);

  data.F_fuse = (data.IP_fuse * As / 1000).toFixed(1);
  data.tempNotes = '';
}

function calcFusion() {
  var od = parseFloat(document.getElementById('bf-od').value);
  var sdr = parseFloat(document.getElementById('bf-sdr').value);
  var en = parseFloat(document.getElementById('bf-en').value);
  var std = document.getElementById('bf-std').value;
  var mode = document.getElementById('bf-mode').value;
  var Ac = parseFloat(document.getElementById('bf-ac').value) || 4418;
  var DP = parseFloat(document.getElementById('bf-drag').value) || 0;
  var temp = parseFloat(document.getElementById('bf-temp').value) || 25;

  // Interfacial surface area — ISO 21307 formula: As = π × (dn - en) × en
  var As = Math.PI * (od - en) * en; // mm²
  // Bead height — ISO 21307: 0.5 + 0.1 × en
  var bead = Math.round((0.5 + 0.1 * en) * 10) / 10;

  var res;
  if (std === 'iso') res = calcISO21307(en, od, As, Ac, DP, mode, bead, temp);
  else res = calcDVS2207(en, od, As, Ac, DP, bead);

  document.getElementById('eng-results').innerHTML = res;
}

// Gauge Pressure formula: GP = (IP × As / Ac) + DP
function gaugeP(IP_mpa, As, Ac, DP) {
  return (IP_mpa * 10 * As / Ac) + DP; // result in bar
}

function calcISO21307(en, od, As, Ac, DP, mode, bead, temp) {
  var Thp, IP_bead, IP_heat, IP_fuse, IP_cool;
  var heatSoakTime, changeoverMax, coolingTime, fuseLabel;
  var pressBuildup;

  if (mode === 'SLP') {
    Thp = 225; // ±10°C per ISO 21307 SLP
    IP_bead = 0.17; // ±0.02 MPa
    IP_heat = 0.02; // max
    IP_fuse = 0.17; // ±0.02 MPa
    fuseLabel = 'Single Low Pressure';
    // Heat soak: (13.5 ± 1.5) × en seconds
    heatSoakTime = Math.round(13.5 * en);
    // Changeover: 3 + 0.03 × dn seconds (max)
    changeoverMax = Math.round(3 + 0.03 * od);
    // Pressure buildup: 3 + 0.03 × dn
    pressBuildup = Math.round(3 + 0.03 * od);
    // Cooling time
    if (en < 18) {
      coolingTime = Math.round((en + 3) * 60); // (en+3) minutes → seconds
    } else {
      coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60); // minutes → seconds
    }
  } else if (mode === 'SHP') {
    Thp = 215; // ±15°C per ISO 21307 SHP
    IP_bead = 0.52; // ±0.1 MPa
    IP_heat = 0.02;
    IP_fuse = 0.52; // ±0.1 MPa
    fuseLabel = 'Single High Pressure';
    heatSoakTime = Math.round(11 * en);
    changeoverMax = Math.round(3 + 0.03 * od);
    pressBuildup = 'Not Specified';

    coolingTime = Math.round((0.43 * en) * 60);
  } else { // DLP
    if (en < 22) return '<div class="fusion-warn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> DLP hanya untuk wall thickness > 22mm. Ketebalan saat ini: ' + en + 'mm. Gunakan SLP atau SHP.</div>';
    Thp = 232.5; // ±7,5°C per ISO 21307
    IP_bead = 0.15; // ±0.02 MPa
    IP_heat = 0.02;
    IP_fuse = 0.15; // ±0.02 MPa
    IP_cool = 0.025; // reduced cooling pressure
    fuseLabel = 'Dual Low Pressure';
    heatSoakTime = Math.round(10 * en + 60);
    changeoverMax = 10;
    pressBuildup = 'Not Specified';
    coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60);
  }

  // ISO 21307 Temperature adjustment for SLP and DLP
  var tempMultiplier = 1;
  var tempNotes = '';
  if ((mode === 'SLP' || mode === 'DLP') && temp > 25) {
    tempMultiplier = 1 + ((temp - 25) * 0.01);
    coolingTime = Math.round(coolingTime * tempMultiplier);
    tempNotes = ` (+${Math.round((tempMultiplier - 1) * 100)}% by Temp)`;
  }

  // Calculate gauge pressures
  var GP_bead = gaugeP(IP_bead, As, Ac, DP);
  var GP_heat = gaugeP(IP_heat, As, Ac, DP);
  var GP_fuse = gaugeP(IP_fuse, As, Ac, DP);
  var GP_cool = mode === 'DLP' ? gaugeP(IP_cool, As, Ac, DP) : GP_fuse;

  // Force calculations
  var F_bead = (IP_bead * As / 1000).toFixed(2); // kN
  var F_fuse = (IP_fuse * As / 1000).toFixed(2); // kN

  var heatMin = Math.floor(heatSoakTime / 60), heatSec = heatSoakTime % 60;
  var coolSec_total = coolingTime;
  var coolMin = Math.floor(coolSec_total / 60), coolSec = coolSec_total % 60;

  return `
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Data Pipa — PE100</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Diameter (OD)</div><div class="rv">${od}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Wall Thickness (en)</div><div class="rv">${en}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(od - 2 * en).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Interfacial Area (As)</div><div class="rv">${Math.round(As).toLocaleString()}<span class="ru"> mm²</span></div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Cylinder Area (Ac)</div><div class="rv">${Ac.toLocaleString()}<span class="ru"> mm²</span></div></div>
    <div class="result-item"><div class="rk">Drag Pressure (DP)</div><div class="rv">${DP}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Bead Height Min.</div><div class="rv">${bead}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">SDR</div><div class="rv">${document.getElementById('bf-sdr').value}</div></div>
  </div></div>

  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> ISO 21307:2017 — ${fuseLabel} (${mode})</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Rumus: <strong>GP = (IP × As / Ac) + DP</strong> &nbsp;|&nbsp; As = π × (dn − en) × en &nbsp;|&nbsp; As = ${Math.round(As).toLocaleString()} mm²
  </div>
  <table class="fusion-table">
  <tr><th>Tahap</th><th>IP (MPa)</th><th>Gauge P (bar)</th><th>Waktu</th><th>Keterangan</th></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#ff4444" stroke="none"/></svg> Bead-up</td><td class="fusion-val">${IP_bead} ±0.02</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">—</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#ffaa00" stroke="none"/></svg> Heat Soak</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>13.5 × en = ${heatSoakTime}s</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>3 + 0.03×dn</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#00ff9d" stroke="none"/></svg> Fusion Join</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${IP_fuse}</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${GP_fuse.toFixed(1)}</td><td class="fusion-val">${typeof pressBuildup === 'number' ? pressBuildup + 's buildup' : pressBuildup}</td><td>Force: ${F_fuse} kN</td></tr>
  ${mode === 'DLP' ? `<tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#4488ff" stroke="none"/></svg> Cooling P2</td><td class="fusion-val">${IP_cool}</td><td class="fusion-val">${GP_cool.toFixed(1)}</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>Reduced pressure phase${tempNotes}</td></tr>` : ''}
  ${mode === 'DLP' ? '' : `<tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 16l4-4-4-4"/><path d="M16 4l-4 4-4-4"/><path d="M16 20l-4-4-4 4"/></svg> Cooling</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${IP_fuse}</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${GP_fuse.toFixed(1)}</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>Pertahankan tekanan join. ${en < 18 ? '(en+3) min' : '0.015en²−0.47en+20 min'}${tempNotes}</td></tr>`}
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C ${mode === 'SHP' ? '± 15' : (mode === 'DLP' ? '± 7.5' : '± 10')}</td><td>—</td><td>Cek dengan pyrometer</td></tr>
  </table>
  <div class="fusion-warn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Selalu verifikasi dengan tabel resmi ISO 21307:2017 dan rekomendasi pabrikan mesin. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
  </div>`;
}

function calcDVS2207(en, od, As, Ac, DP, bead) {
  var mat = 'PE100';
  var Thp = 220; // DVS 2207-1: 220°C for PE100

  // DVS 2207-1 pressures (N/mm² = MPa)
  var IP_bead = 0.15, IP_heat = 0.02, IP_join = 0.15;

  // Times based on wall thickness (DVS tables)
  var heatSoakTime = Math.round(10 * en);
  var changeoverMax;
  if (en <= 4.5) changeoverMax = 5;
  else if (en <= 7) changeoverMax = 6;
  else if (en <= 12) changeoverMax = 8;
  else if (en <= 19) changeoverMax = 10;
  else if (en <= 26) changeoverMax = 12;
  else if (en <= 37) changeoverMax = 16;
  else if (en <= 50) changeoverMax = 20;
  else changeoverMax = 25;

  var coolingTime = Math.round(10 * en + 10);
  var pressBuildup;
  if (en <= 4.5) pressBuildup = 5;
  else if (en <= 7) pressBuildup = 6;
  else if (en <= 12) pressBuildup = 7;
  else if (en <= 19) pressBuildup = 9;
  else if (en <= 26) pressBuildup = 11;
  else pressBuildup = 14;

  // Calculate gauge pressures using GP formula
  var GP_bead = gaugeP(IP_bead, As, Ac, DP);
  var GP_heat = gaugeP(IP_heat, As, Ac, DP);
  var GP_join = gaugeP(IP_join, As, Ac, DP);

  var F_join = (IP_join * As / 1000).toFixed(1); // kN
  var heatMin = Math.floor(heatSoakTime / 60), heatSec = heatSoakTime % 60;
  var coolMin = Math.floor(coolingTime / 60), coolSec = coolingTime % 60;

  return `
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Data Pipa — PE100</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Diameter (OD)</div><div class="rv">${od}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Wall Thickness (en)</div><div class="rv">${en}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(od - 2 * en).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Interfacial Area (As)</div><div class="rv">${Math.round(As).toLocaleString()}<span class="ru"> mm²</span></div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Cylinder Area (Ac)</div><div class="rv">${Ac.toLocaleString()}<span class="ru"> mm²</span></div></div>
    <div class="result-item"><div class="rk">Drag Pressure (DP)</div><div class="rv">${DP}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Bead Height Min.</div><div class="rv">${bead}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">SDR</div><div class="rv">${document.getElementById('bf-sdr').value}</div></div>
  </div></div>

  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> DVS 2207-1 — PE100</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Rumus: <strong>GP = (IP × As / Ac) + DP</strong> &nbsp;|&nbsp; As = π × (dn − en) × en &nbsp;|&nbsp; As = ${Math.round(As).toLocaleString()} mm²
  </div>
  <table class="fusion-table">
  <tr><th>Tahap</th><th>IP (N/mm²)</th><th>Gauge P (bar)</th><th>Waktu</th><th>Keterangan</th></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#ff4444" stroke="none"/></svg> Alignment</td><td class="fusion-val">0.15</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">—</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#ffaa00" stroke="none"/></svg> Heating</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>10 × en = ${heatSoakTime}s</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>Per DVS tabel</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10" fill="#00ff9d" stroke="none"/></svg> Joining</td><td class="fusion-val">0.15 ±0.01</td><td class="fusion-val">${GP_join.toFixed(1)}</td><td class="fusion-val">${pressBuildup}s buildup</td><td>Force: ${F_join} kN</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 16l4-4-4-4"/><path d="M16 4l-4 4-4-4"/><path d="M16 20l-4-4-4 4"/></svg> Cooling</td><td class="fusion-val">0.15 ±0.01</td><td class="fusion-val">${GP_join.toFixed(1)}</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>Pertahankan tekanan join. 10×en+10 = ${coolingTime}s</td></tr>
  <tr><td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C</td><td>—</td><td>PE100: 220°C</td></tr>
  </table>
  <div class="fusion-warn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Selalu verifikasi dengan tabel resmi DVS 2207-1 dan WPS yang disetujui. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
  </div>`;
}

// ==================== MULTI-PIPE BATCH & PDF EXPORT ====================

function addFusionToBatch() {
  var data = computeFusionData();
  
  // Check DLP error
  if (data.isDLPError) {
    alert('DLP hanya untuk wall thickness > 22mm. Ketebalan saat ini: ' + data.en + 'mm. Gunakan SLP atau SHP.');
    return;
  }

  // Check for duplicate
  var isDuplicate = fusionBatchData.some(function(item) {
    return item.od === data.od && item.sdr === data.sdr && item.std === data.std && item.mode === data.mode;
  });
  if (isDuplicate) {
    alert('Data DN' + data.od + ' SDR ' + data.sdr + ' (' + (data.std === 'iso' ? data.mode : 'DVS') + ') sudah ada di daftar.');
    return;
  }

  fusionBatchData.push(data);
  renderFusionBatchList();

  // Also calculate and display the current pipe
  calcFusion();
}

function removeFusionBatch(index) {
  fusionBatchData.splice(index, 1);
  renderFusionBatchList();
}

function clearFusionBatch() {
  fusionBatchData = [];
  renderFusionBatchList();
}

function renderFusionBatchList() {
  var el = document.getElementById('bf-batch-list');
  if (!el) return;

  if (fusionBatchData.length === 0) {
    el.innerHTML = '';
    return;
  }

  var html = `
  <div style="background:rgba(0,255,157,.04);border:1px solid rgba(0,255,157,.15);border-radius:10px;padding:12px;margin-top:4px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:12px;font-weight:600;color:#00ff9d;display:flex;align-items:center;gap:6px">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        Daftar Export PDF (${fusionBatchData.length} ukuran)
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button onclick="exportFusionPDF('engineer')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(0,229,255,0.12);border:1px solid rgba(0,229,255,0.3);color:#00e5ff;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(0,229,255,0.25)'" onmouseout="this.style.background='rgba(0,229,255,0.12)'" title="Laporan lengkap dengan rumus, IP, As, dan analisis teknis">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          PDF Engineer
        </button>
        <button onclick="exportFusionPDF('technician')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(255,170,0,0.12);border:1px solid rgba(255,170,0,0.3);color:#ffaa00;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(255,170,0,0.25)'" onmouseout="this.style.background='rgba(255,170,0,0.12)'" title="Kartu parameter praktis untuk teknisi di lapangan">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          PDF Teknisi
        </button>
        <button onclick="clearFusionBatch()" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(255,68,68,0.08);border:1px solid rgba(255,68,68,0.2);color:#ff6b6b;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s" onmouseover="this.style.background='rgba(255,68,68,0.18)'" onmouseout="this.style.background='rgba(255,68,68,0.08)'">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Hapus
        </button>
      </div>
    </div>`;

  fusionBatchData.forEach(function(item, idx) {
    var stdLabel = item.std === 'iso' ? ('ISO ' + item.mode) : 'DVS 2207';
    var heatMin = Math.floor(item.heatSoakTime / 60);
    var heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60);
    var coolSec = item.coolingTime % 60;
    html += `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;margin-bottom:4px;background:rgba(255,255,255,.03);border-radius:6px;border:1px solid rgba(255,255,255,.06);transition:all 0.2s" onmouseover="this.style.background='rgba(255,255,255,.06)'" onmouseout="this.style.background='rgba(255,255,255,.03)'">
      <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
        <div style="font-size:11px;font-weight:700;color:#00e5ff;white-space:nowrap">${idx + 1}.</div>
        <div style="font-size:11px;color:var(--text1);white-space:nowrap">DN<strong>${item.od}</strong></div>
        <div style="font-size:10px;color:var(--text2);white-space:nowrap">${item.sdrLabel} (${item.pnLabel})</div>
        <div style="font-size:10px;color:var(--text2);white-space:nowrap">en ${item.en}mm</div>
        <div style="font-size:10px;padding:2px 6px;background:rgba(0,229,255,.1);border-radius:4px;color:#00e5ff;white-space:nowrap">${stdLabel}</div>
        <div style="font-size:10px;color:var(--text2);white-space:nowrap">GP ${item.GP_fuse.toFixed(1)} bar</div>
        <div style="font-size:10px;color:var(--text2);white-space:nowrap">Heat ${heatMin}m${heatSec}s</div>
        <div style="font-size:10px;color:var(--text2);white-space:nowrap">Cool ${coolMin}m${coolSec}s</div>
      </div>
      <button onclick="removeFusionBatch(${idx})" style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;background:rgba(255,68,68,.08);border:1px solid rgba(255,68,68,.15);color:#ff6b6b;border-radius:4px;font-size:14px;cursor:pointer;flex-shrink:0;transition:all 0.2s" onmouseover="this.style.background='rgba(255,68,68,.2)'" onmouseout="this.style.background='rgba(255,68,68,.08)'" title="Hapus dari daftar">×</button>
    </div>`;
  });

  html += '</div>';
  el.innerHTML = html;
}

// ===== EXPORT FUSION PDF =====
function exportFusionPDF(mode) {
  if (fusionBatchData.length === 0) {
    alert('Belum ada data. Tambahkan ukuran pipa terlebih dahulu.');
    return;
  }

  var dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (mode === 'technician') {
    exportFusionTechnician(dateStr);
  } else {
    exportFusionEngineer(dateStr);
  }
}

// ===== ENGINEER / CONSULTANT VERSION =====
function exportFusionEngineer(dateStr) {
  var html = '<div class="screen-only">';
  html += '<button class="export-pdf-btn" onclick="window.print()" style="float:right; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:rgba(0,229,255,0.12); border:1px solid rgba(0,229,255,0.3); color:#00e5ff; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; margin-bottom:12px; transition:all 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Cetak PDF Engineer</button><div style="clear:both"></div>';

  html += '<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Laporan Engineer — ' + fusionBatchData.length + ' Ukuran Pipa</div>';

  html += '<div style="overflow-x:auto"><table class="fusion-table" style="font-size:11px">';
  html += '<tr><th>No</th><th>OD</th><th>SDR</th><th>PN</th><th>en</th><th>Standar</th><th>Mode</th><th>GP Fuse</th><th>Heat Soak</th><th>Cooling</th><th>Heater</th></tr>';

  fusionBatchData.forEach(function(item, idx) {
    var stdLabel = item.std === 'iso' ? 'ISO 21307' : 'DVS 2207';
    var modeLabel = item.std === 'iso' ? item.mode : '-';
    var heatMin = Math.floor(item.heatSoakTime / 60), heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60), coolSec = item.coolingTime % 60;
    html += '<tr>';
    html += '<td class="fusion-val">' + (idx + 1) + '</td>';
    html += '<td class="fusion-val" style="color:#00e5ff;font-weight:700">DN' + item.od + '</td>';
    html += '<td class="fusion-val">' + item.sdr + '</td>';
    html += '<td class="fusion-val">' + item.pnLabel + '</td>';
    html += '<td class="fusion-val">' + item.en + '</td>';
    html += '<td class="fusion-val">' + stdLabel + '</td>';
    html += '<td class="fusion-val">' + modeLabel + '</td>';
    html += '<td class="fusion-val" style="color:#00e5ff">' + item.GP_fuse.toFixed(1) + ' bar</td>';
    html += '<td class="fusion-val">' + heatMin + 'm ' + heatSec + 's</td>';
    html += '<td class="fusion-val">' + coolMin + 'm ' + coolSec + 's</td>';
    html += '<td class="fusion-val">' + item.Thp + (item.ThpTol ? ' ' + item.ThpTol : '') + '°C</td>';
    html += '</tr>';
  });
  html += '</table></div>';

  var firstItem = fusionBatchData[0];
  html += '<div style="font-size:11px;color:var(--text2);margin-top:8px;padding:8px 12px;background:rgba(0,229,255,.03);border-radius:6px;border:1px solid rgba(0,229,255,.1)">';
  html += '<strong style="color:#6dd5ed">Parameter Mesin:</strong> Ac = ' + firstItem.Ac.toLocaleString() + ' mm² | DP = ' + firstItem.DP + ' bar | Suhu = ' + firstItem.temp + '°C';
  html += '</div></div>';

  // Detail per pipe on screen
  fusionBatchData.forEach(function(item, idx) {
    var heatMin = Math.floor(item.heatSoakTime / 60), heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60), coolSec = item.coolingTime % 60;
    var stdTitle = item.std === 'iso' ? ('ISO 21307 — ' + item.fuseLabel + ' (' + item.mode + ')') : 'DVS 2207-1 — PE100';
    var ipUnit = item.std === 'iso' ? 'MPa' : 'N/mm²';

    html += '<div class="eng-section"><div class="eng-section-title" style="font-size:12px"><span style="background:#00e5ff;color:#0a0f1e;padding:2px 8px;border-radius:4px;font-weight:700;margin-right:8px">' + (idx + 1) + '</span> DN' + item.od + ' — ' + item.sdrLabel + ' (' + item.pnLabel + ') — ' + stdTitle + '</div>';
    html += '<div class="result-grid" style="margin-bottom:8px">';
    html += '<div class="result-item"><div class="rk">OD</div><div class="rv">' + item.od + '<span class="ru"> mm</span></div></div>';
    html += '<div class="result-item"><div class="rk">en</div><div class="rv">' + item.en + '<span class="ru"> mm</span></div></div>';
    html += '<div class="result-item"><div class="rk">ID</div><div class="rv">' + item.id.toFixed(1) + '<span class="ru"> mm</span></div></div>';
    html += '<div class="result-item"><div class="rk">As</div><div class="rv">' + Math.round(item.As).toLocaleString() + '<span class="ru"> mm²</span></div></div>';
    html += '</div>';
    html += '<table class="fusion-table" style="font-size:11px">';
    html += '<tr><th>Tahap</th><th>IP (' + ipUnit + ')</th><th>Gauge P (bar)</th><th>Waktu</th><th>Keterangan</th></tr>';
    html += '<tr><td>Bead-up</td><td class="fusion-val">' + item.IP_bead + '</td><td class="fusion-val">' + item.GP_bead.toFixed(1) + '</td><td class="fusion-val">—</td><td>Bead ≥' + item.bead + 'mm</td></tr>';
    html += '<tr><td>Heat Soak</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">' + item.GP_heat.toFixed(1) + '</td><td class="fusion-val">' + heatMin + 'm ' + heatSec + 's</td><td>' + item.heatFormula + ' = ' + item.heatSoakTime + 's</td></tr>';
    html += '<tr><td>Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ' + item.changeoverMax + 's</td><td></td></tr>';
    html += '<tr><td>' + (item.std === 'iso' ? 'Fusion Join' : 'Joining') + '</td><td class="fusion-val" style="color:#00e5ff">' + item.IP_fuse + '</td><td class="fusion-val" style="color:#00e5ff">' + item.GP_fuse.toFixed(1) + '</td><td class="fusion-val">' + (typeof item.pressBuildup === 'number' ? item.pressBuildup + 's buildup' : (item.pressBuildup || '—')) + '</td><td>Force: ' + item.F_fuse + ' kN</td></tr>';
    if (item.mode === 'DLP' && item.std === 'iso') {
      html += '<tr><td>Cooling P2</td><td class="fusion-val">' + item.IP_cool + '</td><td class="fusion-val">' + item.GP_cool.toFixed(1) + '</td><td class="fusion-val">' + coolMin + 'm ' + coolSec + 's</td><td>Reduced pressure' + item.tempNotes + '</td></tr>';
    } else {
      html += '<tr><td>Cooling</td><td class="fusion-val">' + item.IP_fuse + '</td><td class="fusion-val">' + item.GP_fuse.toFixed(1) + '</td><td class="fusion-val">' + coolMin + 'm ' + coolSec + 's</td><td>' + item.coolFormula + ' = ' + item.coolingTime + 's' + item.tempNotes + '</td></tr>';
    }
    html += '<tr><td>Heater Plate</td><td colspan="2" class="fusion-val">' + item.Thp + '°C' + (item.ThpTol ? ' ' + item.ThpTol : '') + '</td><td>—</td><td></td></tr>';
    html += '</table></div>';
  });

  html += '</div>'; // End screen-only
  html += buildFusionPrintReport(dateStr);
  document.getElementById('eng-results').innerHTML = html;
}

// ===== TECHNICIAN / FIELD VERSION =====
function exportFusionTechnician(dateStr) {
  var firstItem = fusionBatchData[0];

  // Screen-only preview
  var html = '<div class="screen-only">';
  html += '<button class="export-pdf-btn" onclick="window.print()" style="float:right; display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:rgba(255,170,0,0.15); border:1px solid rgba(255,170,0,0.3); color:#ffaa00; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; margin-bottom:12px; transition:all 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Cetak PDF Teknisi</button><div style="clear:both"></div>';

  html += '<div class="eng-section"><div class="eng-section-title" style="color:#ffaa00"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Kartu Kerja Teknisi — ' + fusionBatchData.length + ' Ukuran Pipa</div>';

  html += '<div style="font-size:11px;color:var(--text2);margin-bottom:10px;padding:8px 12px;background:rgba(255,170,0,.05);border-radius:6px;border:1px solid rgba(255,170,0,.15)">';
  html += '<strong style="color:#ffaa00">Mesin:</strong> Ac = ' + firstItem.Ac.toLocaleString() + ' mm² | DP = ' + firstItem.DP + ' bar | Suhu = ' + firstItem.temp + '°C';
  html += '</div>';

  // Simple cards per pipe on screen
  fusionBatchData.forEach(function(item, idx) {
    var heatMin = Math.floor(item.heatSoakTime / 60), heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60), coolSec = item.coolingTime % 60;

    html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:12px;margin-bottom:8px">';
    html += '<div style="font-size:14px;font-weight:700;color:#ffaa00;margin-bottom:8px">' + (idx + 1) + '. DN' + item.od + ' — ' + item.sdrLabel + ' (' + item.pnLabel + ')</div>';
    html += '<div class="result-grid">';
    html += '<div class="result-item"><div class="rk">Tekanan Bead-up</div><div class="rv">' + item.GP_bead.toFixed(1) + '<span class="ru"> bar</span></div></div>';
    html += '<div class="result-item"><div class="rk">Tekanan Heat Soak</div><div class="rv">' + item.GP_heat.toFixed(1) + '<span class="ru"> bar</span></div></div>';
    html += '<div class="result-item" style="background:rgba(0,229,255,.08);border-color:var(--sys-accent)"><div class="rk">Tekanan Fusion</div><div class="rv" style="color:#00e5ff;font-size:18px">' + item.GP_fuse.toFixed(1) + '<span class="ru"> bar</span></div></div>';
    html += '<div class="result-item"><div class="rk">Suhu Heater</div><div class="rv">' + item.Thp + '<span class="ru"> °C</span></div></div>';
    html += '<div class="result-item"><div class="rk">Waktu Heat Soak</div><div class="rv">' + heatMin + 'm ' + heatSec + '<span class="ru">s</span></div></div>';
    html += '<div class="result-item"><div class="rk">Changeover Maks</div><div class="rv">≤ ' + item.changeoverMax + '<span class="ru">s</span></div></div>';
    html += '<div class="result-item"><div class="rk">Waktu Cooling</div><div class="rv">' + coolMin + 'm ' + coolSec + '<span class="ru">s</span></div></div>';
    html += '<div class="result-item"><div class="rk">Bead Min.</div><div class="rv">≥ ' + item.bead + '<span class="ru"> mm</span></div></div>';
    html += '</div></div>';
  });
  html += '</div>';
  html += '</div>'; // End screen-only

  // Print report
  html += buildFusionTechnicianReport(dateStr);
  document.getElementById('eng-results').innerHTML = html;
}

function buildFusionPrintReport(dateStr) {
  var firstItem = fusionBatchData[0];

  var html = '<div class="print-report-only">';

  // Header
  html += '<div class="pr-header">';
  html += '<div class="pr-logo">Kalkulator Pipa Pro</div>';
  html += '<div class="pr-title">BUTT FUSION PARAMETER SHEET</div>';
  html += '<div class="pr-subtitle">HDPE PE100 — Multi-Size Fusion Welding Parameters</div>';
  html += '</div>';

  // Info grid
  html += '<div class="pr-info-grid">';
  html += '<div class="pr-info-col">';
  html += '<div class="pr-info-row"><span class="pr-label">Material Pipa:</span> <span class="pr-val">HDPE PE100</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Cylinder Area (Ac):</span> <span class="pr-val">' + firstItem.Ac.toLocaleString() + ' mm²</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Drag Pressure (DP):</span> <span class="pr-val">' + firstItem.DP + ' bar</span></div>';
  html += '</div>';
  html += '<div class="pr-info-col">';
  html += '<div class="pr-info-row"><span class="pr-label">Tanggal Cetak:</span> <span class="pr-val">' + dateStr + '</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Suhu Ambien:</span> <span class="pr-val">' + firstItem.temp + ' °C</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Jumlah Ukuran:</span> <span class="pr-val">' + fusionBatchData.length + ' ukuran pipa</span></div>';
  html += '</div>';
  html += '</div>';

  // Section 1: Summary Table
  html += '<h3 class="pr-section-title">1. RINGKASAN PARAMETER FUSION (' + fusionBatchData.length + ' UKURAN)</h3>';
  html += '<table class="pr-table" style="margin-bottom:20px">';
  html += '<tr style="background:#1a365d;color:#fff;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:0.5px">';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">No</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">OD (mm)</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">SDR / PN</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">en (mm)</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">Standar</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">GP Fuse (bar)</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">Heat Soak</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">Cooling</td>';
  html += '<td style="background:#1a365d;color:#fff;padding:6px 8px;border:1px solid #2a4a7d">Heater (°C)</td>';
  html += '</tr>';

  fusionBatchData.forEach(function(item, idx) {
    var stdLabel = item.std === 'iso' ? ('ISO ' + item.mode) : 'DVS';
    var heatMin = Math.floor(item.heatSoakTime / 60);
    var heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60);
    var coolSec = item.coolingTime % 60;
    var rowBg = idx % 2 === 0 ? '' : ' style="background:#f5f7fa"';
    html += '<tr' + rowBg + '>';
    html += '<td style="text-align:center;font-weight:600;border:1px solid #ddd;padding:6px 8px">' + (idx + 1) + '</td>';
    html += '<td style="font-weight:700;color:#1a365d;border:1px solid #ddd;padding:6px 8px;font-size:12px">DN' + item.od + '</td>';
    html += '<td style="border:1px solid #ddd;padding:6px 8px">' + item.sdrLabel + ' / ' + item.pnLabel + '</td>';
    html += '<td style="text-align:center;border:1px solid #ddd;padding:6px 8px">' + item.en + '</td>';
    html += '<td style="border:1px solid #ddd;padding:6px 8px">' + stdLabel + '</td>';
    html += '<td style="text-align:center;font-weight:700;color:#1a365d;border:1px solid #ddd;padding:6px 8px;font-size:12px">' + item.GP_fuse.toFixed(1) + '</td>';
    html += '<td style="text-align:center;border:1px solid #ddd;padding:6px 8px">' + heatMin + 'm ' + heatSec + 's</td>';
    html += '<td style="text-align:center;border:1px solid #ddd;padding:6px 8px">' + coolMin + 'm ' + coolSec + 's</td>';
    html += '<td style="text-align:center;border:1px solid #ddd;padding:6px 8px">' + item.Thp + (item.ThpTol ? ' ' + item.ThpTol : '') + '</td>';
    html += '</tr>';
  });
  html += '</table>';

  // Section 2: Detail per pipe
  html += '<h3 class="pr-section-title">2. DETAIL PARAMETER PER UKURAN PIPA</h3>';

  fusionBatchData.forEach(function(item, idx) {
    var heatMin = Math.floor(item.heatSoakTime / 60);
    var heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60);
    var coolSec = item.coolingTime % 60;
    var stdTitle = item.std === 'iso' ? ('ISO 21307 — ' + item.fuseLabel + ' (' + item.mode + ')') : 'DVS 2207-1';
    var ipUnit = item.std === 'iso' ? 'MPa' : 'N/mm²';

    // Wrap each pipe detail in a section that avoids splitting across pages
    html += '<div style="page-break-inside:avoid;margin-top:' + (idx > 0 ? '12' : '0') + 'px">';

    // Sub-header per pipe
    html += '<div style="background:#eef2f6;padding:6px 10px;margin:0 0 8px 0;font-size:11px;font-weight:700;color:#1a365d;border-left:4px solid #1a365d">';
    html += (idx + 1) + '. DN' + item.od + ' — ' + item.sdrLabel + ' (' + item.pnLabel + ') — ' + stdTitle;
    html += '</div>';

    // Pipe data
    html += '<table class="pr-table" style="margin-bottom:8px">';
    html += '<tr><td>Diameter (OD)</td><td><strong>' + item.od + '</strong> mm</td><td>Wall Thickness (en)</td><td><strong>' + item.en + '</strong> mm</td></tr>';
    html += '<tr><td>Inside Diameter (ID)</td><td><strong>' + item.id.toFixed(1) + '</strong> mm</td><td>Interfacial Area (As)</td><td><strong>' + Math.round(item.As).toLocaleString() + '</strong> mm²</td></tr>';
    html += '<tr><td>Bead Height Min.</td><td><strong>' + item.bead + '</strong> mm</td><td>Rumus GP</td><td>GP = (IP × As / Ac) + DP</td></tr>';
    html += '</table>';

    // Phase table
    html += '<table class="pr-table" style="margin-bottom:15px">';
    html += '<tr style="background:#1a365d;color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">';
    html += '<td style="background:#1a365d;color:#fff;border:1px solid #2a4a7d;padding:5px 8px;width:22%">Tahap</td>';
    html += '<td style="background:#1a365d;color:#fff;border:1px solid #2a4a7d;padding:5px 8px;width:15%">IP (' + ipUnit + ')</td>';
    html += '<td style="background:#1a365d;color:#fff;border:1px solid #2a4a7d;padding:5px 8px;width:18%">Gauge P (bar)</td>';
    html += '<td style="background:#1a365d;color:#fff;border:1px solid #2a4a7d;padding:5px 8px;width:15%">Waktu</td>';
    html += '<td style="background:#1a365d;color:#fff;border:1px solid #2a4a7d;padding:5px 8px;width:30%">Keterangan</td>';
    html += '</tr>';

    // Bead-up
    html += '<tr><td style="border:1px solid #ddd;padding:5px 8px">Bead-up</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">' + item.IP_bead + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">' + item.GP_bead.toFixed(1) + '</td><td style="border:1px solid #ddd;padding:5px 8px">—</td><td style="border:1px solid #ddd;padding:5px 8px">Bead ≥' + item.bead + 'mm</td></tr>';
    // Heat Soak
    html += '<tr style="background:#f9f9f9"><td style="border:1px solid #ddd;padding:5px 8px">Heat Soak</td><td style="border:1px solid #ddd;padding:5px 8px">≤ 0.02</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.GP_heat.toFixed(1) + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">' + heatMin + 'm ' + heatSec + 's</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.heatFormula + ' = ' + item.heatSoakTime + 's</td></tr>';
    // Changeover
    html += '<tr><td style="border:1px solid #ddd;padding:5px 8px">Changeover</td><td style="border:1px solid #ddd;padding:5px 8px" colspan="2"><em>Secepat mungkin</em></td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">≤ ' + item.changeoverMax + 's</td><td style="border:1px solid #ddd;padding:5px 8px"></td></tr>';
    // Fusion Join
    html += '<tr style="background:#eef6ff"><td style="border:1px solid #ddd;padding:5px 8px;font-weight:700">' + (item.std === 'iso' ? 'Fusion Join' : 'Joining') + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:700;color:#1a365d">' + item.IP_fuse + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:700;color:#1a365d;font-size:12px">' + item.GP_fuse.toFixed(1) + '</td><td style="border:1px solid #ddd;padding:5px 8px">' + (typeof item.pressBuildup === 'number' ? item.pressBuildup + 's buildup' : (item.pressBuildup || '—')) + '</td><td style="border:1px solid #ddd;padding:5px 8px">Force: ' + item.F_fuse + ' kN</td></tr>';

    // DLP Cooling P2
    if (item.mode === 'DLP' && item.std === 'iso') {
      html += '<tr style="background:#f0f7ff"><td style="border:1px solid #ddd;padding:5px 8px">Cooling P2</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.IP_cool + '</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.GP_cool.toFixed(1) + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">' + coolMin + 'm ' + coolSec + 's</td><td style="border:1px solid #ddd;padding:5px 8px">Reduced pressure' + item.tempNotes + '</td></tr>';
    } else {
      html += '<tr style="background:#f9f9f9"><td style="border:1px solid #ddd;padding:5px 8px">Cooling</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.IP_fuse + '</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.GP_fuse.toFixed(1) + '</td><td style="border:1px solid #ddd;padding:5px 8px;font-weight:600">' + coolMin + 'm ' + coolSec + 's</td><td style="border:1px solid #ddd;padding:5px 8px">' + item.coolFormula + ' = ' + item.coolingTime + 's' + item.tempNotes + '</td></tr>';
    }

    // Heater Plate
    html += '<tr><td style="border:1px solid #ddd;padding:5px 8px">Heater Plate</td><td style="border:1px solid #ddd;padding:5px 8px" colspan="2"><strong>' + item.Thp + '°C' + (item.ThpTol ? ' ' + item.ThpTol : '') + '</strong></td><td style="border:1px solid #ddd;padding:5px 8px">—</td><td style="border:1px solid #ddd;padding:5px 8px">Cek dengan pyrometer</td></tr>';
    html += '</table>';
    html += '</div>'; // End page-break-inside:avoid wrapper
  });

  // Section 3: Notes — keep together on same page
  html += '<div style="page-break-inside:avoid">';
  html += '<h3 class="pr-section-title">3. CATATAN & PERINGATAN</h3>';
  html += '<div class="pr-notes">';
  html += '<ul style="margin:0;padding-left:15px;color:#333">';
  html += '<li><strong>Rumus Gauge Pressure:</strong> GP = (IP × As / Ac) + DP, dimana As = π × (dn − en) × en</li>';
  html += '<li><strong>Verifikasi:</strong> Selalu verifikasi parameter dengan tabel resmi standar acuan (ISO 21307:2017 atau DVS 2207-1) dan rekomendasi pabrikan mesin.</li>';
  html += '<li><strong>Heater Plate:</strong> Periksa suhu heater plate dengan pyrometer sebelum setiap siklus fusion.</li>';
  html += '<li><strong>Changeover:</strong> Lakukan changeover secepat mungkin untuk menghindari pendinginan permukaan yang sudah dipanaskan.</li>';
  html += '<li><strong>Bead:</strong> Pastikan bead terbentuk merata di seluruh keliling pipa sebelum memulai heat soak.</li>';

  // Temperature warning
  if (firstItem.temp > 25) {
    html += '<li style="color:#c62828"><strong>Peringatan Suhu:</strong> Suhu ambien (' + firstItem.temp + '°C) di atas 25°C. Waktu cooling telah disesuaikan (+' + Math.round((firstItem.tempMultiplier - 1) * 100) + '%) untuk SLP/DLP sesuai ISO 21307.</li>';
  }
  html += '</ul>';
  html += '</div>';
  html += '</div>'; // End page-break-inside:avoid for notes

  // Footer
  html += '<div class="pr-footer">';
  html += '<p>Dokumen ini dihasilkan secara otomatis oleh <strong>Kalkulator Pipa Pro</strong>.</p>';
  html += '<p style="opacity:0.7">Gunakan sebagai panduan kalkulasi awal (preliminary calculation) dan pastikan untuk divalidasi oleh Welding Engineer yang berwenang.</p>';
  html += '</div>';

  html += '</div>'; // End print-report-only

  return html;
}

// ===== TECHNICIAN PRINT REPORT =====
function buildFusionTechnicianReport(dateStr) {
  var firstItem = fusionBatchData[0];

  var html = '<div class="print-report-only">';

  // Header
  html += '<div class="pr-header" style="border-bottom-color:#ffaa00">';
  html += '<div class="pr-logo">Kalkulator Pipa Pro</div>';
  html += '<div class="pr-title" style="color:#ffaa00">KARTU KERJA BUTT FUSION</div>';
  html += '<div class="pr-subtitle">Parameter Praktis Lapangan (Teknisi)</div>';
  html += '</div>';

  // Info grid
  html += '<div class="pr-info-grid">';
  html += '<div class="pr-info-col">';
  html += '<div class="pr-info-row"><span class="pr-label">Material Pipa:</span> <span class="pr-val">HDPE PE100</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Cylinder Area (Ac):</span> <span class="pr-val">' + firstItem.Ac.toLocaleString() + ' mm²</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Drag Pressure (DP):</span> <span class="pr-val">' + firstItem.DP + ' bar</span></div>';
  html += '</div>';
  html += '<div class="pr-info-col">';
  html += '<div class="pr-info-row"><span class="pr-label">Tanggal Cetak:</span> <span class="pr-val">' + dateStr + '</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Suhu Ambien:</span> <span class="pr-val">' + firstItem.temp + ' °C</span></div>';
  html += '<div class="pr-info-row"><span class="pr-label">Jumlah Ukuran:</span> <span class="pr-val">' + fusionBatchData.length + ' ukuran pipa</span></div>';
  html += '</div>';
  html += '</div>';

  // Detail per pipe
  fusionBatchData.forEach(function(item, idx) {
    var heatMin = Math.floor(item.heatSoakTime / 60), heatSec = item.heatSoakTime % 60;
    var coolMin = Math.floor(item.coolingTime / 60), coolSec = item.coolingTime % 60;
    var stdTitle = item.std === 'iso' ? ('ISO 21307 (' + item.mode + ')') : 'DVS 2207-1';

    html += '<div style="page-break-inside:avoid; margin-bottom: 20px; border: 2px solid #ddd; border-radius: 8px; overflow: hidden;">';
    
    // Header pipa
    html += '<div style="background:#f5f5f5; padding: 10px 15px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; align-items: center;">';
    html += '<div><span style="font-size: 16px; font-weight: 800; color: #333;">' + (idx + 1) + '. DN' + item.od + '</span> <span style="font-size: 12px; color: #666; margin-left: 10px;">SDR ' + item.sdr + ' / PN ' + item.pnLabel + ' (' + item.en + 'mm)</span></div>';
    html += '<div style="font-size: 11px; background: #eee; padding: 4px 8px; border-radius: 4px; font-weight: bold;">' + stdTitle + '</div>';
    html += '</div>';

    // Grid data
    html += '<table style="width: 100%; border-collapse: collapse; text-align: center; font-family: \'Helvetica Neue\', sans-serif;">';
    
    // Baris 1: Suhu & Bead
    html += '<tr>';
    html += '<td style="width: 33%; padding: 15px 10px; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Suhu Heater</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #000;">' + item.Thp + '°C</div>';
    html += '</td>';
    html += '<td style="width: 33%; padding: 15px 10px; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Tinggi Bead Min.</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #000;">' + item.bead + ' mm</div>';
    html += '</td>';
    html += '<td style="width: 34%; padding: 15px 10px; border-bottom: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Waktu Changeover</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #e53935;">Maks ' + item.changeoverMax + 's</div>';
    html += '</td>';
    html += '</tr>';

    // Baris 2: Tekanan
    html += '<tr style="background: #fafafa;">';
    html += '<td style="padding: 15px 10px; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Tek. Bead-up</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #000;">' + item.GP_bead.toFixed(1) + ' <span style="font-size:12px;font-weight:normal">bar</span></div>';
    html += '</td>';
    html += '<td style="padding: 15px 10px; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Tek. Heat Soak</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #000;">' + item.GP_heat.toFixed(1) + ' <span style="font-size:12px;font-weight:normal">bar</span></div>';
    html += '</td>';
    html += '<td style="padding: 15px 10px; border-bottom: 1px solid #eee; background: #fff8e1;">';
    html += '<div style="font-size: 11px; color: #f57f17; text-transform: uppercase; margin-bottom: 5px; font-weight: bold;">Tekanan Fusion</div>';
    html += '<div style="font-size: 20px; font-weight: 900; color: #f57f17;">' + item.GP_fuse.toFixed(1) + ' <span style="font-size:12px;font-weight:normal">bar</span></div>';
    html += '</td>';
    html += '</tr>';

    // Baris 3: Waktu
    html += '<tr>';
    html += '<td colspan="2" style="padding: 15px 10px; border-right: 1px solid #eee;">';
    html += '<div style="font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Waktu Heat Soak</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #000;">' + heatMin + 'm ' + heatSec + 's</div>';
    html += '</td>';
    html += '<td style="padding: 15px 10px; background: #e3f2fd;">';
    html += '<div style="font-size: 11px; color: #1565c0; text-transform: uppercase; margin-bottom: 5px; font-weight: bold;">Waktu Cooling</div>';
    html += '<div style="font-size: 18px; font-weight: bold; color: #1565c0;">' + coolMin + 'm ' + coolSec + 's</div>';
    html += '</td>';
    html += '</tr>';

    html += '</table>';
    html += '</div>';
  });

  // Footer
  html += '<div class="pr-footer" style="margin-top:30px">';
  html += '<p><strong>Panduan Singkat:</strong> Periksa suhu heater plate, pastikan tekanan terbaca (Gauge Pressure) termasuk Drag Pressure. Lakukan tahapan secepat dan setepat mungkin.</p>';
  html += '<p style="opacity:0.7; margin-top: 5px;">Dihasilkan oleh Kalkulator Pipa Pro.</p>';
  html += '</div>';

  html += '</div>'; // End print-report-only

  return html;
}
