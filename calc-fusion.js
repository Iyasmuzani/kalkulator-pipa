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

function buildFusionForm() {
  // Build OD options
  var odOpts = Object.keys(rucikaPipes).map(function (od) {
    return '<option value="' + od + '"' + (od === '315' ? ' selected' : '') + '>DN' + od + '</option>';
  }).join('');

  document.getElementById('eng-form').innerHTML = `
  <div class="form-title">🔗 Kalkulator Butt Fusion HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">ISO 21307 / DVS 2207</span></div>
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
  <button class="calc-btn" onclick="calcFusion()">⚡ Hitung Parameter Fusion</button>`;
  updateSDRoptions();
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
    if (en < 22) return '<div class="fusion-warn">⚠️ DLP hanya untuk wall thickness > 22mm. Ketebalan saat ini: ' + en + 'mm. Gunakan SLP atau SHP.</div>';
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
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa — PE100</div>
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

  <div class="eng-section"><div class="eng-section-title">🔗 ISO 21307:2017 — ${fuseLabel} (${mode})</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px">
    📐 Rumus: <strong>GP = (IP × As / Ac) + DP</strong> &nbsp;|&nbsp; As = π × (dn − en) × en &nbsp;|&nbsp; As = ${Math.round(As).toLocaleString()} mm²
  </div>
  <table class="fusion-table">
  <tr><th>Tahap</th><th>IP (MPa)</th><th>Gauge P (bar)</th><th>Waktu</th><th>Keterangan</th></tr>
  <tr><td>🔴 Bead-up</td><td class="fusion-val">${IP_bead} ±0.02</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">—</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td>🟡 Heat Soak</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>13.5 × en = ${heatSoakTime}s</td></tr>
  <tr><td>⚡ Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>3 + 0.03×dn</td></tr>
  <tr><td>🟢 Fusion Join</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${IP_fuse}</td><td class="fusion-val" style="color:${mode === 'SHP' ? '#ff8c42' : '#00e5ff'}">${GP_fuse.toFixed(1)}</td><td class="fusion-val">${typeof pressBuildup === 'number' ? pressBuildup + 's buildup' : pressBuildup}</td><td>Force: ${F_fuse} kN</td></tr>
  ${mode === 'DLP' ? `<tr><td>🔵 Cooling P2</td><td class="fusion-val">${IP_cool}</td><td class="fusion-val">${GP_cool.toFixed(1)}</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>Reduced pressure phase${tempNotes}</td></tr>` : ''}
  ${mode === 'DLP' ? '' : `<tr><td>❄️ Cooling</td><td colspan="2">Pertahankan tekanan join</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>${en < 18 ? '(en+3) min' : '0.015en²−0.47en+20 min'}${tempNotes}</td></tr>`}
  <tr><td>🌡️ Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C ${mode === 'SHP' ? '± 15' : (mode === 'DLP' ? '± 7.5' : '± 10')}</td><td>—</td><td>Cek dengan pyrometer</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Selalu verifikasi dengan tabel resmi ISO 21307:2017 dan rekomendasi pabrikan mesin. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
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
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa — PE100</div>
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

  <div class="eng-section"><div class="eng-section-title">🔗 DVS 2207-1 — PE100</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px">
    📐 Rumus: <strong>GP = (IP × As / Ac) + DP</strong> &nbsp;|&nbsp; As = π × (dn − en) × en &nbsp;|&nbsp; As = ${Math.round(As).toLocaleString()} mm²
  </div>
  <table class="fusion-table">
  <tr><th>Tahap</th><th>IP (N/mm²)</th><th>Gauge P (bar)</th><th>Waktu</th><th>Keterangan</th></tr>
  <tr><td>🔴 Alignment</td><td class="fusion-val">0.15</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">—</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td>🟡 Heating</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>10 × en = ${heatSoakTime}s</td></tr>
  <tr><td>⚡ Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>Per DVS tabel</td></tr>
  <tr><td>🟢 Joining</td><td class="fusion-val">0.15 ±0.01</td><td class="fusion-val">${GP_join.toFixed(1)}</td><td class="fusion-val">${pressBuildup}s buildup</td><td>Force: ${F_join} kN</td></tr>
  <tr><td>❄️ Cooling</td><td colspan="2">Pertahankan tekanan join</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>10×en+10 = ${coolingTime}s</td></tr>
  <tr><td>🌡️ Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C</td><td>—</td><td>PE100: 220°C</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Selalu verifikasi dengan tabel resmi DVS 2207-1 dan WPS yang disetujui. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
  </div>`;
}
