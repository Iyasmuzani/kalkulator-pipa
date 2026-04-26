// ==================== BUTT FUSION CALCULATOR ====================
// ISO 21307:2017 (SHP/SLP/DLP) + DVS 2207-1
// Corrected formulas per official standard

// Rucika Black HDPE PE100 wall thickness table (mm) — ISO 4427 / SNI 4829
// Format: {OD: {SDR: wall_thickness}}
var rucikaPipes = {
  20:  {11:2.0},
  25:  {11:2.3, 13.6:2.0},
  32:  {11:3.0, 13.6:2.4, 17:2.0},
  40:  {11:3.7, 13.6:3.0, 17:2.4, 21:2.0},
  50:  {11:4.6, 13.6:3.7, 17:3.0, 21:2.4, 26:2.0},
  63:  {11:5.8, 13.6:4.7, 17:3.8, 21:3.0, 26:2.5},
  75:  {11:6.8, 13.6:5.6, 17:4.5, 21:3.6, 26:2.9},
  90:  {11:8.2, 13.6:6.7, 17:5.4, 21:4.3, 26:3.5},
  110: {11:10.0, 13.6:8.1, 17:6.6, 21:5.3, 26:4.2},
  125: {11:11.4, 13.6:9.2, 17:7.4, 21:6.0, 26:4.8},
  140: {11:12.7, 13.6:10.3, 17:8.3, 21:6.7, 26:5.4},
  160: {11:14.6, 13.6:11.8, 17:9.5, 21:7.7, 26:6.2},
  180: {11:16.4, 13.6:13.3, 17:10.7, 21:8.6, 26:6.9},
  200: {11:18.2, 13.6:14.7, 17:11.9, 21:9.6, 26:7.7},
  225: {11:20.5, 13.6:16.6, 17:13.4, 21:10.8, 26:8.6},
  250: {11:22.7, 13.6:18.4, 17:14.8, 21:11.9, 26:9.6},
  280: {11:25.4, 13.6:20.6, 17:16.6, 21:13.4, 26:10.7},
  315: {11:28.6, 13.6:23.2, 17:18.7, 21:15.0, 26:12.1},
  355: {11:32.3, 13.6:26.1, 17:21.1, 21:16.9, 26:13.6},
  400: {11:36.4, 13.6:29.4, 17:23.7, 21:19.1, 26:15.3},
  450: {11:40.9, 13.6:33.1, 17:26.7, 21:21.5, 26:17.2},
  500: {11:45.5, 13.6:36.8, 17:29.7, 21:23.9, 26:19.1},
  560: {11:50.8, 13.6:41.2, 17:33.2, 21:26.7, 26:21.4},
  630: {11:57.2, 13.6:46.3, 17:37.4, 21:30.0, 26:24.1}
};

function buildFusionForm(){
  // Build OD options from Rucika catalog
  var odOpts = Object.keys(rucikaPipes).map(function(od){
    return '<option value="'+od+'"'+(od==='315'?' selected':'')+'>DN'+od+' (Rucika)</option>';
  }).join('');

  document.getElementById('eng-form').innerHTML=`
  <div class="form-title">🔗 Kalkulator Butt Fusion HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">ISO 21307 / DVS 2207</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar Pipa (OD) — Rucika Black PE100</label>
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
  <div class="form-group"><label class="form-label">Cylinder Area Mesin — Ac (mm²)</label>
  <input type="number" class="form-control" id="bf-ac" min="100" max="100000" value="4418" placeholder="Lihat spesifikasi mesin fusion"></div>
  <div class="form-group"><label class="form-label">Drag Pressure — DP (bar)</label>
  <input type="number" class="form-control" id="bf-drag" min="0" max="10" step="0.1" value="0.5"></div>
  <button class="calc-btn" onclick="calcFusion()">⚡ Hitung Parameter Fusion</button>`;
  updateSDRoptions();
}

function updateSDRoptions(){
  var od = document.getElementById('bf-od').value;
  var pipe = rucikaPipes[od];
  if(!pipe) return;
  var sel = document.getElementById('bf-sdr');
  var pnMap = {11:'PN16', 13.6:'PN12.5', 17:'PN10', 21:'PN8', 26:'PN6.3'};
  sel.innerHTML = Object.keys(pipe).map(function(sdr){
    return '<option value="'+sdr+'"'+(sdr==='17'?' selected':'')+'>SDR '+sdr+' ('+pnMap[sdr]+') — en '+pipe[sdr]+' mm</option>';
  }).join('');
  updateWallThickness();
}

function updateWallThickness(){
  var od = document.getElementById('bf-od').value;
  var sdr = document.getElementById('bf-sdr').value;
  var pipe = rucikaPipes[od];
  if(pipe && pipe[sdr]){
    document.getElementById('bf-en').value = pipe[sdr];
  } else {
    document.getElementById('bf-en').value = (od/sdr).toFixed(1);
  }
}
// Listen for SDR changes
document.addEventListener('change', function(e){
  if(e.target.id === 'bf-sdr') updateWallThickness();
});

function toggleFusionMode(){
  document.getElementById('bf-mode-wrap').style.display=
    document.getElementById('bf-std').value==='iso'?'block':'none';
}

function calcFusion(){
  var od = parseFloat(document.getElementById('bf-od').value);
  var sdr = parseFloat(document.getElementById('bf-sdr').value);
  var en = parseFloat(document.getElementById('bf-en').value);
  var std = document.getElementById('bf-std').value;
  var mode = document.getElementById('bf-mode').value;
  var Ac = parseFloat(document.getElementById('bf-ac').value) || 4418;
  var DP = parseFloat(document.getElementById('bf-drag').value) || 0;

  // Interfacial surface area — ISO 21307 formula: As = π × (dn - en) × en
  var As = Math.PI * (od - en) * en; // mm²
  // Bead height — ISO 21307: 0.5 + 0.1 × en
  var bead = Math.round((0.5 + 0.1 * en) * 10) / 10;

  var res;
  if(std === 'iso') res = calcISO21307(en, od, As, Ac, DP, mode, bead);
  else res = calcDVS2207(en, od, As, Ac, DP, bead);

  document.getElementById('eng-results').innerHTML = res;
}

// Gauge Pressure formula: GP = (IP × As / Ac) + DP
function gaugeP(IP_mpa, As, Ac, DP){
  return (IP_mpa * 10 * As / Ac) + DP; // result in bar
}

function calcISO21307(en, od, As, Ac, DP, mode, bead){
  var Thp, IP_bead, IP_heat, IP_fuse, IP_cool;
  var heatSoakTime, changeoverMax, coolingTime, fuseLabel;
  var pressBuildup;

  if(mode === 'SLP'){
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
    if(en < 18){
      coolingTime = Math.round((en + 3) * 60); // (en+3) minutes → seconds
    } else {
      coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60); // minutes → seconds
    }
  } else if(mode === 'SHP'){
    Thp = 221; // ±10°C
    IP_bead = 0.17;
    IP_heat = 0.02;
    IP_fuse = 0.517; // High pressure
    fuseLabel = 'Single High Pressure';
    heatSoakTime = Math.round(13.5 * en);
    changeoverMax = Math.round(3 + 0.03 * od);
    pressBuildup = Math.round(3 + 0.03 * od);
    if(en < 18){
      coolingTime = Math.round((en + 3) * 60);
    } else {
      coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60);
    }
  } else { // DLP
    if(en < 22) return '<div class="fusion-warn">⚠️ DLP hanya untuk wall thickness > 22mm. Ketebalan saat ini: '+en+'mm. Gunakan SLP atau SHP.</div>';
    Thp = 225;
    IP_bead = 0.17;
    IP_heat = 0.02;
    IP_fuse = 0.17;
    IP_cool = 0.025; // reduced cooling pressure
    fuseLabel = 'Dual Low Pressure';
    heatSoakTime = Math.round(13.5 * en);
    changeoverMax = Math.round(3 + 0.03 * od);
    pressBuildup = Math.round(3 + 0.03 * od);
    coolingTime = Math.round((0.015 * en * en - 0.47 * en + 20) * 60);
  }

  // Calculate gauge pressures
  var GP_bead = gaugeP(IP_bead, As, Ac, DP);
  var GP_heat = gaugeP(IP_heat, As, Ac, DP);
  var GP_fuse = gaugeP(IP_fuse, As, Ac, DP);
  var GP_cool = mode === 'DLP' ? gaugeP(IP_cool, As, Ac, DP) : GP_fuse;

  // Force calculations
  var F_bead = (IP_bead * As / 1000).toFixed(1); // kN
  var F_fuse = (IP_fuse * As / 1000).toFixed(1); // kN

  var beadTime = Math.round(en * 0.5 + 5);
  var heatMin = Math.floor(heatSoakTime / 60), heatSec = heatSoakTime % 60;
  var coolSec_total = coolingTime;
  var coolMin = Math.floor(coolSec_total / 60), coolSec = coolSec_total % 60;

  return `
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa — Rucika Black PE100</div>
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
  <tr><td>🔴 Bead-up</td><td class="fusion-val">0.17 ±0.02</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">~${beadTime}s</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td>🟡 Heat Soak</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>13.5 × en = ${heatSoakTime}s</td></tr>
  <tr><td>⚡ Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>3 + 0.03×dn</td></tr>
  <tr><td>🟢 Fusion Join</td><td class="fusion-val" style="color:${mode==='SHP'?'#ff8c42':'#00e5ff'}">${IP_fuse}</td><td class="fusion-val" style="color:${mode==='SHP'?'#ff8c42':'#00e5ff'}">${GP_fuse.toFixed(1)}</td><td class="fusion-val">${pressBuildup}s buildup</td><td>Force: ${F_fuse} kN</td></tr>
  ${mode==='DLP'?`<tr><td>🔵 Cooling P2</td><td class="fusion-val">${IP_cool}</td><td class="fusion-val">${GP_cool.toFixed(1)}</td><td>—</td><td>Reduced pressure phase</td></tr>`:''}
  <tr><td>❄️ Cooling</td><td colspan="2">Pertahankan tekanan join</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>${en<18?'(en+3) min':'0.015en²−0.47en+20 min'}</td></tr>
  <tr><td>🌡️ Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C ± 10</td><td>—</td><td>Cek dengan pyrometer</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Selalu verifikasi dengan tabel resmi ISO 21307:2017 dan rekomendasi pabrikan mesin. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
  </div>`;
}

function calcDVS2207(en, od, As, Ac, DP, bead){
  var mat = 'PE100';
  var Thp = 220; // DVS 2207-1: 220°C for PE100

  // DVS 2207-1 pressures (N/mm² = MPa)
  var IP_bead = 0.15, IP_heat = 0.02, IP_join = 0.15;

  // Times based on wall thickness (DVS tables)
  var heatSoakTime = Math.round(10 * en);
  var changeoverMax;
  if(en <= 4.5) changeoverMax = 5;
  else if(en <= 7) changeoverMax = 6;
  else if(en <= 12) changeoverMax = 8;
  else if(en <= 19) changeoverMax = 10;
  else if(en <= 26) changeoverMax = 12;
  else if(en <= 37) changeoverMax = 16;
  else if(en <= 50) changeoverMax = 20;
  else changeoverMax = 25;

  var coolingTime = Math.round(10 * en + 10);
  var pressBuildup;
  if(en <= 4.5) pressBuildup = 5;
  else if(en <= 7) pressBuildup = 6;
  else if(en <= 12) pressBuildup = 7;
  else if(en <= 19) pressBuildup = 9;
  else if(en <= 26) pressBuildup = 11;
  else pressBuildup = 14;

  // Calculate gauge pressures using GP formula
  var GP_bead = gaugeP(IP_bead, As, Ac, DP);
  var GP_heat = gaugeP(IP_heat, As, Ac, DP);
  var GP_join = gaugeP(IP_join, As, Ac, DP);

  var F_join = (IP_join * As / 1000).toFixed(1); // kN
  var beadTime = Math.round(en * 0.5 + 5);
  var heatMin = Math.floor(heatSoakTime / 60), heatSec = heatSoakTime % 60;
  var coolMin = Math.floor(coolingTime / 60), coolSec = coolingTime % 60;

  return `
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa — Rucika Black PE100</div>
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
  <tr><td>🔴 Alignment</td><td class="fusion-val">0.15</td><td class="fusion-val">${GP_bead.toFixed(1)}</td><td class="fusion-val">~${beadTime}s</td><td>Bead terbentuk ≥${bead}mm</td></tr>
  <tr><td>🟡 Heating</td><td class="fusion-val">≤ 0.02</td><td class="fusion-val">${GP_heat.toFixed(1)}</td><td class="fusion-val">${heatMin}m ${heatSec}s</td><td>10 × en = ${heatSoakTime}s</td></tr>
  <tr><td>⚡ Changeover</td><td colspan="2" style="color:var(--warn)">Secepat mungkin</td><td class="fusion-val">≤ ${changeoverMax}s</td><td>Per DVS tabel</td></tr>
  <tr><td>🟢 Joining</td><td class="fusion-val">0.15 ±0.01</td><td class="fusion-val">${GP_join.toFixed(1)}</td><td class="fusion-val">${pressBuildup}s buildup</td><td>Force: ${F_join} kN</td></tr>
  <tr><td>❄️ Cooling</td><td colspan="2">Pertahankan tekanan join</td><td class="fusion-val">${coolMin}m ${coolSec}s</td><td>10×en+10 = ${coolingTime}s</td></tr>
  <tr><td>🌡️ Heater Plate</td><td colspan="2" class="fusion-val">${Thp}°C</td><td>—</td><td>PE100: 220°C</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Selalu verifikasi dengan tabel resmi DVS 2207-1 dan WPS yang disetujui. Parameter untuk OD ${od}mm, en ${en}mm, Ac ${Ac} mm².</div>
  </div>`;
}
