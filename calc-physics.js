// ==================== PIPE PHYSICS CALCULATORS ====================
var E = document.getElementById.bind(document);
var Vf = function (id) { return parseFloat(E(id).value) || 0; };

// ===== 1. PRESSURE LOSS (Hazen-Williams) =====
function buildPressLossForm() {
  E('eng-form').innerHTML = `
  <div class="form-title">📉 Pressure Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Hazen-Williams</span></div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="pl-mat" onchange="updateCfactor()">
    <option value="150">HDPE (C=150)</option><option value="150">PVC (C=150)</option>
    <option value="140">PPR (C=140)</option><option value="120">Baja Galvanis (C=120)</option>
    <option value="130">Ductile Iron (C=130)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="pl-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="pl-l" min="1" max="50000" value="100"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)</label><input type="number" class="form-control" id="pl-q" min="0.1" max="5000" step="0.1" value="5"></div>
  <div class="form-group"><label class="form-label">C-Factor</label><input type="number" class="form-control" id="pl-c" min="50" max="160" value="150"></div>
  
  <div class="form-title" style="margin-top:15px; font-size:12px; margin-bottom:8px">🔧 Komponen Minor Losses</div>
  
  <div id="pl-hdpe-minor">
    <div class="form-group"><label class="form-label">Panjang per Batang Pipa (m)</label><input type="number" class="form-control" id="pl-pipe-len" min="1" max="250" value="12" title="Untuk menghitung jumlah sambungan butt fusion otomatis"></div>
    <div class="form-group"><label class="form-label">K-Factor Butt Fusion / Sambungan</label><input type="number" class="form-control" id="pl-k-weld" min="0" max="1" step="0.01" value="0.05" title="Koefisien rugi-rugi minor akibat bead di dalam pipa. Tipikal ~0.05"></div>
  </div>

  <div class="form-group"><label class="form-label">Total K-Factor Fitting & Katup (Opsional)</label><input type="number" class="form-control" id="pl-k-fittings" min="0" max="1000" step="0.1" value="0" title="Total akumulasi K dari semua fitting. Cth: 2 Elbow 90° (K=0.3) = 0.6">
  <div style="font-size:10.5px; color:var(--text2); margin-top:4px">Referensi K: Elbow 90°=0.3 | Tee Lurus=0.2 | Tee Belok=1.0 | Gate Valve=0.2</div>
  </div>

  <button class="calc-btn" onclick="calcPressLoss()">⚡ Hitung Pressure Loss</button>`;
}
function updateCfactor() { 
  E('pl-c').value = E('pl-mat').value; 
  var sel = E('pl-mat');
  var isHDPE = sel.options[sel.selectedIndex].text.includes('HDPE');
  E('pl-hdpe-minor').style.display = isHDPE ? 'block' : 'none';
}
function calcPressLoss() {
  var d = Vf('pl-d') / 1000, L = Vf('pl-l'), Q = Vf('pl-q') / 1000, C = Vf('pl-c');
  
  var sel = E('pl-mat');
  var isHDPE = sel ? sel.options[sel.selectedIndex].text.includes('HDPE') : true;

  var pipeLen = isHDPE ? Vf('pl-pipe-len') : 0;
  var kWeld = isHDPE ? Vf('pl-k-weld') : 0;
  var kFittings = Vf('pl-k-fittings');

  var v = 4 * Q / (Math.PI * d * d);
  var hf_major = 10.67 * Math.pow(Q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.87)) * L;
  
  var joints = (pipeLen > 0 && isHDPE) ? Math.floor(L / pipeLen) : 0;
  var hf_minor_weld = joints * kWeld * (v * v) / (2 * 9.81);
  var hf_minor_fittings = kFittings * (v * v) / (2 * 9.81);
  var hf_minor_total = hf_minor_weld + hf_minor_fittings;
  
  var hf = hf_major + hf_minor_total;

  var pBar = hf * 9.81 / 100;
  var hfPer100 = hf / L * 100;
  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title">📉 Hasil Pressure Loss</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Kecepatan Aliran</div><div class="rv">${v.toFixed(2)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Head Loss Mayor (Gesekan)</div><div class="rv">${hf_major.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="background:rgba(255,140,66,0.1);border-color:var(--warn)"><div class="rk">Head Loss Minor Total</div><div class="rv">${hf_minor_total.toFixed(3)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="grid-column: span 2;"><div class="rk">Head Loss Total</div><div class="rv" style="font-size:24px">${hf.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Pressure Drop Total</div><div class="rv">${pBar.toFixed(3)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Head Loss /100m</div><div class="rv">${hfPer100.toFixed(3)}<span class="ru"> m/100m</span></div></div>
  </div>
  ${isHDPE ? `<div style="font-size:11px;color:var(--text2);margin-top:8px"><em>*Minor loss termasuk ${joints} sambungan butt-fusion</em></div>` : ''}
  ${v > 2.5 ? '<div class="fusion-warn">⚠️ Kecepatan > 2.5 m/s — pertimbangkan diameter lebih besar</div>' : ''}
  ${v < 0.5 ? '<div class="fusion-warn">⚠️ Kecepatan < 0.5 m/s — risiko sedimentasi</div>' : ''}
  </div>`;
}

// ===== 2. BUOYANCY =====
function buildBuoyancyForm() {
  E('eng-form').innerHTML = `
  <div class="form-title">🌊 Buoyancy Pipa HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">Instalasi Underwater</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar (OD) mm</label><input type="number" class="form-control" id="by-od" min="50" max="2000" value="315"></div>
  <div class="form-group"><label class="form-label">SDR</label>
  <select class="form-control" id="by-sdr"><option value="11">SDR 11</option><option value="17" selected>SDR 17</option><option value="21">SDR 21</option><option value="26">SDR 26</option></select></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="by-len" min="1" max="10000" value="100"></div>
  <div class="form-group"><label class="form-label">Densitas Air (kg/m³)</label>
  <select class="form-control" id="by-rho"><option value="1000">Air Tawar (1000)</option><option value="1025">Air Laut (1025)</option></select></div>
  <div class="form-group"><label class="form-label">Kondisi Pipa</label>
  <select class="form-control" id="by-cond"><option value="empty">Kosong (tanpa air)</option><option value="full">Penuh air</option></select></div>
  <div class="form-group"><label class="form-label">Safety Factor Ballast</label><input type="number" class="form-control" id="by-sf" min="1" max="2" step="0.05" value="1.1"></div>
  <button class="calc-btn" onclick="calcBuoyancy()">⚡ Hitung Buoyancy</button>`;
}
function calcBuoyancy() {
  var od = Vf('by-od') / 1000, sdr = Vf('by-sdr'), len = Vf('by-len'), rhoW = Vf('by-rho'), sf = Vf('by-sf');
  var en = od / sdr, id = od - 2 * en;
  var rhoPE = 950; // kg/m³ HDPE
  var Apipe = Math.PI / 4 * (od * od - id * id);
  var Awater = Math.PI / 4 * id * id;
  var Adisplaced = Math.PI / 4 * od * od;
  var full = E('by-cond').value === 'full';
  var wPipe = rhoPE * Apipe; // kg/m
  var wWater = full ? 1000 * Awater : 0;
  var wTotal = wPipe + wWater; // kg/m
  var Fb = rhoW * Adisplaced; // kg/m (buoyancy force)
  var netUp = Fb - wTotal;
  var needBallast = netUp > 0;
  var ballast = needBallast ? netUp * sf : 0;
  var ballastTotal = ballast * len;
  var spacing = needBallast ? Math.min(Math.floor(1 / (ballast / 50)), 5) : 0; // concrete block every N m
  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">OD / en</div><div class="rv">${(od * 1000).toFixed(0)} / ${(en * 1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(id * 1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Berat Pipa</div><div class="rv">${wPipe.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Kondisi</div><div class="rv">${full ? 'Penuh air' : 'Kosong'}</div></div>
  </div></div>
  <div class="eng-section"><div class="eng-section-title">🌊 Analisis Buoyancy</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Gaya Apung</div><div class="rv">${Fb.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Berat Total</div><div class="rv">${wTotal.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Net Uplift</div><div class="rv" style="color:${needBallast ? '#ff5555' : '#00ff9d'}">${netUp.toFixed(2)}<span class="ru"> kg/m ${needBallast ? '↑ FLOAT' : '↓ SINK'}</span></div></div>
    <div class="result-item"><div class="rk">Ballast /m</div><div class="rv">${ballast.toFixed(2)}<span class="ru"> kg/m (SF=${sf})</span></div></div>
  </div>
  ${needBallast ? `<div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Ballast Total</div><div class="rv">${(ballastTotal / 1000).toFixed(1)}<span class="ru"> ton (${len}m)</span></div></div>
    <div class="result-item"><div class="rk">Spacing ±50kg blok</div><div class="rv">setiap ${spacing > 0 ? spacing : 1}<span class="ru"> m</span></div></div>
  </div>`: ''}
  </div>`;
}

// ===== 3. WATER HAMMER (Joukowsky) =====
function buildWaterHammerForm() {
  E('eng-form').innerHTML = `
  <div class="form-title">💥 Water Hammer <span style="font-size:10px;color:var(--text2);font-weight:400">Joukowsky</span></div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="wh-mat"><option value="pvc">PVC (E=3 GPa)</option><option value="hdpe" selected>HDPE (E=0.8 GPa)</option><option value="ppr">PPR (E=0.9 GPa)</option><option value="steel">Baja (E=200 GPa)</option><option value="di">Ductile Iron (E=170 GPa)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="wh-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Tebal Dinding (mm)</label><input type="number" class="form-control" id="wh-en" min="1" max="100" value="18.5"></div>
  <div class="form-group"><label class="form-label">Kecepatan Aliran (m/s)</label><input type="number" class="form-control" id="wh-v" min="0.1" max="10" step="0.1" value="1.5"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="wh-l" min="10" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Tekanan Kerja (bar)</label><input type="number" class="form-control" id="wh-pw" min="1" max="50" step="0.5" value="10"></div>
  <button class="calc-btn" onclick="calcWaterHammer()">⚡ Hitung Water Hammer</button>`;
}
function calcWaterHammer() {
  var matE = { 'pvc': 3e9, 'hdpe': 0.8e9, 'ppr': 0.9e9, 'steel': 200e9, 'di': 170e9 };
  var mat = E('wh-mat').value, d = Vf('wh-d') / 1000, en = Vf('wh-en') / 1000;
  var v = Vf('wh-v'), L = Vf('wh-l'), Pw = Vf('wh-pw');
  var Ep = matE[mat], K = 2.2e9, rho = 998;
  // Celerity
  var a = Math.sqrt(K / rho) / Math.sqrt(1 + (K * d) / (Ep * en));
  // Pressure surge
  var dP = rho * a * v; // Pa
  var dPbar = dP / 1e5;
  var Ptotal = Pw + dPbar;
  // Reflection time
  var Tr = 2 * L / a;
  var matNames = { 'pvc': 'PVC', 'hdpe': 'HDPE', 'ppr': 'PPR', 'steel': 'Baja', 'di': 'Ductile Iron' };
  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title">💥 Hasil Water Hammer — Joukowsky</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Wave Celerity (a)</div><div class="rv">${a.toFixed(1)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Pressure Surge (ΔP)</div><div class="rv" style="color:#ff8c42">${dPbar.toFixed(2)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Kerja</div><div class="rv">${Pw}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Maks.</div><div class="rv" style="color:${Ptotal > Pw * 1.5 ? '#ff5555' : '#00e5ff'}">${Ptotal.toFixed(2)}<span class="ru"> bar</span></div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Reflection Time</div><div class="rv">${Tr.toFixed(2)}<span class="ru"> detik</span></div></div>
    <div class="result-item"><div class="rk">Material</div><div class="rv">${matNames[mat]}<span class="ru"> E=${(Ep / 1e9).toFixed(1)} GPa</span></div></div>
  </div></div>
  ${Ptotal > Pw * 1.5 ? '<div class="fusion-warn">⚠️ Surge pressure > 150% tekanan kerja! Pasang surge anticipator, air valve, atau slow-closing valve.</div>' : ''}
  ${mat === 'hdpe' ? '<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed">💡 HDPE memiliki elastisitas tinggi — wave celerity lebih rendah dan meredam water hammer lebih baik dibanding pipa kaku.</div>' : ''}`;
}

// ===== 4. FRICTION LOSS (Darcy-Weisbach) =====
function buildFrictionForm() {
  E('eng-form').innerHTML = `
  <div class="form-title">🔧 Friction Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Darcy-Weisbach + Colebrook-White</span></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="fr-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="fr-l" min="1" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)</label><input type="number" class="form-control" id="fr-q" min="0.1" max="5000" step="0.1" value="10"></div>
  <div class="form-group"><label class="form-label">Kekasaran Pipa ε (mm)</label>
  <select class="form-control" id="fr-e"><option value="0.0015">HDPE (0.0015 mm)</option><option value="0.0015">PVC (0.0015 mm)</option><option value="0.007">PPR (0.007 mm)</option><option value="0.15">Baja Galvanis (0.15 mm)</option><option value="0.26">Baja Karbon (0.26 mm)</option><option value="0.12">Ductile Iron (0.12 mm)</option></select></div>
  <div class="form-group"><label class="form-label">Suhu Air (°C)</label><input type="number" class="form-control" id="fr-t" min="5" max="80" value="25"></div>
  <button class="calc-btn" onclick="calcFriction()">⚡ Hitung Friction Loss</button>`;
}
function calcFriction() {
  // Kinematic viscosity of water (m²/s) based on empirical Poiseuille formula
  var nu = 1.78e-6 / (1 + 0.0337 * T + 0.00022 * T * T);
  var v = 4 * Q / (Math.PI * d * d);
  var Re = v * d / nu;
  var regime = Re < 2300 ? 'Laminar' : Re < 4000 ? 'Transisi' : 'Turbulen';
  // Colebrook-White iterative
  var f = 0.02;
  for (var i = 0; i < 50; i++) {
    var rhs = -2 * Math.log10(eps / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)));
    f = 1 / (rhs * rhs);
  }
  var hf = f * (L / d) * v * v / (2 * 9.81);
  var pBar = hf * 9.81 / 100;
  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title">🔧 Hasil Friction Loss — Darcy-Weisbach</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Kecepatan</div><div class="rv">${v.toFixed(3)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Reynolds (Re)</div><div class="rv">${Math.round(Re).toLocaleString()}</div></div>
    <div class="result-item"><div class="rk">Regime Aliran</div><div class="rv" style="color:${Re > 4000 ? '#00e5ff' : '#ffaa00'}">${regime}</div></div>
    <div class="result-item"><div class="rk">Friction Factor (f)</div><div class="rv">${f.toFixed(6)}</div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Head Loss</div><div class="rv">${hf.toFixed(3)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Pressure Drop</div><div class="rv">${pBar.toFixed(4)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Gradient</div><div class="rv">${(hf / L * 1000).toFixed(2)}<span class="ru"> m/km</span></div></div>
    <div class="result-item"><div class="rk">Kekasaran ε</div><div class="rv">${(eps * 1000).toFixed(4)}<span class="ru"> mm</span></div></div>
  </div></div>`;
}

// ===== 5. PIPE LOAD & DEFLECTION (AWWA M23) =====
function buildPipeLoadForm() {
  var sdrOpts = [7.4, 9, 11, 13.6, 17, 21, 26].map(s => `<option value="${s}" ${s === 17 ? 'selected' : ''}>SDR ${s}</option>`).join('');
  E('eng-form').innerHTML = `
  <div class="form-title">⚖️ Pipe Load & Defleksi <span style="font-size:10px;color:var(--text2);font-weight:400">AWWA M23 / Modified Iowa</span></div>
  <div class="form-group"><label class="form-label">Tipe Pipa</label>
  <select class="form-control" id="ld-type" onchange="toggleLdSDR()"><option value="flexible" selected>Flexible (HDPE)</option><option value="rigid">Rigid (Beton/Baja)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Luar (OD) mm</label><input type="number" class="form-control" id="ld-od" min="50" max="2000" value="315"></div>
  <div class="form-group" id="ld-sdr-wrap"><label class="form-label">SDR Pipa (Kekakuan)</label>
  <select class="form-control" id="ld-sdr">${sdrOpts}</select></div>
  <div class="form-group"><label class="form-label">Kedalaman Tanam (H) m</label><input type="number" class="form-control" id="ld-h" min="0.3" max="15" step="0.1" value="1.5"></div>
  <div class="form-group"><label class="form-label">Lebar Galian (Bd) m</label><input type="number" class="form-control" id="ld-bd" min="0.3" max="5" step="0.1" value="0.8"></div>
  
  <div class="form-group"><label class="form-label">Kepadatan Tanah Sekeliling (E')</label>
  <select class="form-control" id="ld-soil-e">
    <option value="2000">Ringan / Uncompacted (E' = 2 MPa)</option>
    <option value="7000" selected>Sedang / 85% Proctor (E' = 7 MPa)</option>
    <option value="14000">Padat / >90% Proctor (E' = 14 MPa)</option>
    <option value="20000">Sangat Padat / Kerikil (E' = 20 MPa)</option>
  </select></div>
  <div class="form-group"><label class="form-label">Beban Lalu Lintas (Live Load)</label>
  <select class="form-control" id="ld-live">
    <option value="0">Tanpa beban (Taman/Lahan kosong)</option>
    <option value="10">Pedestrian / Ringan (10 kN)</option>
    <option value="72">Truk H-20 (72 kN / roda belakang)</option>
    <option value="100">Alat Berat (100 kN)</option>
  </select></div>
  <div class="form-group"><label class="form-label">Deflection Lag Factor (Dl)</label>
  <select class="form-control" id="ld-dl"><option value="1.0">1.0 (Jangka Pendek)</option><option value="1.5" selected>1.5 (Jangka Panjang / Creep)</option></select></div>
  <button class="calc-btn" onclick="calcPipeLoad()">⚡ Hitung Pipe Load & Defleksi</button>`;
}

function toggleLdSDR() {
  var isFlex = E('ld-type').value === 'flexible';
  E('ld-sdr-wrap').style.display = isFlex ? 'block' : 'none';
  E('ld-dl').disabled = !isFlex;
  E('ld-soil-e').disabled = !isFlex;
}

function calcPipeLoad() {
  var type = E('ld-type').value;
  var od = Vf('ld-od') / 1000; // meter
  var sdr = Vf('ld-sdr');
  var H = Vf('ld-h');
  var Bd = Vf('ld-bd');
  var E_soil = Vf('ld-soil-e'); // kPa
  var P_live = Vf('ld-live'); // kN (point load)
  var Dl = Vf('ld-dl');

  var gamma = 18; // kN/m³ typical soil weight

  // 1. DEAD LOAD (Wd)
  var Wd = 0;
  var Cd = 0;
  if (type === 'rigid') {
    // Marston equation for rigid ditch condition
    var ratio = H / Bd;
    var K_mu = 0.15; // typical clay/sand
    Cd = (1 - Math.exp(-2 * K_mu * ratio)) / (2 * K_mu);
    Wd = Cd * gamma * Bd * Bd; // kN/m
  } else {
    // AWWA M23 recommends Prism Load for flexible pipes (conservative)
    Wd = gamma * H * od; // kN/m
  }

  // 2. LIVE LOAD (Wl) - Boussinesq point load approximation
  var Wl = 0;
  var Pl_kPa = 0;
  if (P_live > 0) {
    var If = 1.0;
    if (H < 0.6) If = 1.3;
    else if (H < 0.9) If = 1.2;
    else if (H < 1.2) If = 1.1;

    // Boussinesq pressure directly under point load (R=0)
    // Pz = (3 * P * If) / (2 * PI * H^2)
    Pl_kPa = (3 * P_live * If) / (2 * Math.PI * H * H);
    Wl = Pl_kPa * od; // kN/m
  }

  var Wtotal = Wd + Wl; // kN/m

  // 3. DEFLECTION (Modified Iowa Equation)
  var deflPct = 0;
  var K_bed = 0.1; // Bedding constant (typical)
  var PS_kpa = 0; // Pipe stiffness

  if (type === 'flexible') {
    var en = od / sdr; // meter
    var D_mean = od - en; // meter
    var Ep = 800000; // kPa (HDPE Modulus of Elasticity, short-medium term)
    var I_pipe = (en * en * en) / 12; // m^4/m

    // Ring Stiffness (8*E*I / D^3) in kPa
    var ringStiffness = (8 * Ep * I_pipe) / (D_mean * D_mean * D_mean);
    PS_kpa = ringStiffness;

    // Modified Iowa: dX = (Dl * K * Wc) / (RingStiffness + 0.061 * E')
    // Note: Wc in kN/m, Stiffness in kPa. Result in meters.
    var dX = (Dl * K_bed * Wtotal) / (ringStiffness + 0.061 * E_soil);
    deflPct = (dX / D_mean) * 100;
  }

  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title">⚖️ Analisis Beban Tanah & Lalin</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Beban Mati (Dead Load)</div><div class="rv">${Wd.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Beban Lalin (Live Load)</div><div class="rv">${Wl.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Total Beban ($W_c$)</div><div class="rv" style="color:#00e5ff">${Wtotal.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Lalin Ekivalen</div><div class="rv">${Pl_kPa.toFixed(1)}<span class="ru"> kPa</span></div></div>
  </div></div>

  ${type === 'flexible' ? `
  <div class="eng-section"><div class="eng-section-title">📐 Prediksi Defleksi (Modified Iowa)</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    ΔX = (Dl × K × Wc) / (8 EI/D³ + 0.061 E')
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Modulus Tanah (E')</div><div class="rv">${(E_soil / 1000).toFixed(1)}<span class="ru"> MPa</span></div></div>
    <div class="result-item"><div class="rk">Kekakuan Pipa (8EI/D³)</div><div class="rv">${PS_kpa.toFixed(1)}<span class="ru"> kPa</span></div></div>
    <div class="result-item"><div class="rk">Lag Factor (Dl)</div><div class="rv">${Dl}</div></div>
    <div class="result-item"><div class="rk">Est. Defleksi (ΔX/D)</div><div class="rv" style="color:${deflPct > 5 ? '#ff5555' : '#00ff9d'};font-weight:700">${deflPct.toFixed(2)}<span class="ru"> %</span></div></div>
  </div>
  ${deflPct > 5 ? `
  <div class="fusion-warn" style="margin-top:10px">⚠️ <strong>Defleksi > 5%! (Batas aman AWWA)</strong><br>
  Solusi: 1) Gunakan tanah urug yang lebih baik (E' lebih besar) dan padatkan >90% Proctor. 2) Turunkan nilai SDR pipa (dinding lebih tebal). 3) Tambah kedalaman tanam jika beban dominan adalah lalu lintas.</div>`: ''}
  </div>` :
      `<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-top:10px">💡 Pipa Rigid (beton/baja) dihitung berdasarkan Marston (Cd = ${Cd.toFixed(2)}). Bandingkan Total Beban ${Wtotal.toFixed(2)} kN/m dengan kuat hancur (Crushing Strength) dari pabrikan. Defleksi tidak dihitung.</div>`}
  `;
}
