// ==================== PIPE PHYSICS CALCULATORS ====================
var E = document.getElementById.bind(document);
var Vf = function (id) { return parseFloat(E(id).value) || 0; };

// ===== 1. PRESSURE LOSS (Hazen-Williams) =====
function buildPressLossForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Pressure Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Hazen-Williams</span></div>
  <div class="form-group"><label class="form-label">Material Pipa${infoTip('Material menentukan C-Factor (koefisien kekasaran Hazen-Williams).\nSemakin tinggi C, semakin halus permukaan pipa.\nSumber: PPI Handbook Ch.6 | Uni-Bell Handbook')}</label>
  <select class="form-control" id="pl-mat" onchange="updateCfactor()">
    <option value="150">HDPE (C=150)</option><option value="150">PVC (C=150)</option>
    <option value="140">PPR (C=140)</option><option value="120">Baja Galvanis (C=120)</option>
    <option value="130">Ductile Iron (C=130)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)${infoTip('Diameter internal pipa (ID), bukan OD.\nID = OD - 2×en (tebal dinding).\nUntuk HDPE: lihat tabel ISO 4427-2:2019')}</label><input type="number" class="form-control" id="pl-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)${infoTip('Panjang total jalur pipa dari sumber ke ujung.\nTidak termasuk equivalent length dari fitting (dihitung terpisah via K-Factor).')}</label><input type="number" class="form-control" id="pl-l" min="1" max="50000" value="100"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)${infoTip('Debit aliran desain.\nKecepatan optimal: 0.6–1.5 m/s\nSumber: PPI Handbook Ch.6 | AWWA M55 §5.4')}</label><input type="number" class="form-control" id="pl-q" min="0.1" max="5000" step="0.1" value="5"></div>
  <div class="form-group"><label class="form-label">C-Factor${infoTip('Koefisien Hazen-Williams.\nHDPE/PVC baru: 150\nBaja galvanis baru: 120\nNilai menurun seiring usia pipa.\nSumber: PPI Handbook | AWWA M55')}</label><input type="number" class="form-control" id="pl-c" min="50" max="160" value="150"></div>
  
  <div class="form-title" style="margin-top:15px; font-size:12px; margin-bottom:8px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Komponen Minor Losses</div>
  
  <div id="pl-hdpe-minor">
    <div class="form-group"><label class="form-label">Panjang per Batang Pipa (m)${infoTip('Panjang tiap batang pipa untuk menghitung jumlah sambungan butt fusion otomatis.\nHDPE standar: 6m atau 12m.\nSumber: ISO 4427-2:2019 §8.1')}</label><input type="number" class="form-control" id="pl-pipe-len" min="1" max="250" value="12"></div>
    <div class="form-group"><label class="form-label">K-Factor Butt Fusion${infoTip('Koefisien rugi minor per sambungan butt fusion.\nTipikal: K = 0.05 (bead internal).\nSumber: PPI Handbook Ch.6 | Crane TP 410')}</label><input type="number" class="form-control" id="pl-k-weld" min="0" max="1" step="0.01" value="0.05"></div>
  </div>

  <div class="form-group"><label class="form-label">Total K-Factor Fitting & Katup${infoTip('Akumulasi K dari semua fitting & katup.\nContoh: 2× Elbow 90° (K=0.3) + 1× Gate Valve (K=0.2) = 0.8\nSumber: Crane TP 410 | AWWA M55')}</label><input type="number" class="form-control" id="pl-k-fittings" min="0" max="1000" step="0.1" value="0">
  <div style="font-size:10.5px; color:var(--text2); margin-top:4px">Referensi K: Elbow 90°=0.3 | Tee Lurus=0.2 | Tee Belok=1.0 | Gate Valve=0.2</div>
  </div>

  <button class="calc-btn" onclick="calcPressLoss()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Pressure Loss</button>`;
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
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Hasil Pressure Loss</div>
  ${refBadges(['Hazen-Williams', 'PPI Handbook Ch.6', 'AWWA M55 §5.4'])}
  <div class="result-grid">
    <div class="result-item"><div class="rk">Kecepatan Aliran</div><div class="rv">${v.toFixed(2)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Head Loss Mayor (Gesekan)</div><div class="rv">${hf_major.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="background:rgba(255,140,66,0.1);border-color:var(--warn)"><div class="rk">Head Loss Minor Total</div><div class="rv">${hf_minor_total.toFixed(3)}<span class="ru"> m</span></div></div>
    <div class="result-item" style="grid-column: span 2;"><div class="rk">Head Loss Total</div><div class="rv" style="font-size:24px">${hf.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Pressure Drop Total</div><div class="rv">${pBar.toFixed(3)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Head Loss /100m</div><div class="rv">${hfPer100.toFixed(3)}<span class="ru"> m/100m</span></div></div>
  </div>
  ${isHDPE ? `<div style="font-size:11px;color:var(--text2);margin-top:8px"><em>*Minor loss termasuk ${joints} sambungan butt-fusion</em></div>` : ''}
  ${velocityWarnings(v, 'pressure')}
  </div>
  ${getRefTable('cFactor')}
  ${getRefTable('kFitting')}
  <div class="chart-wrap"><div class="chart-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> Profil Tekanan Sepanjang Pipa</div><div style="height:220px"><canvas id="chart-pressloss"></canvas></div></div>`;
  if (typeof animateValues === 'function') animateValues();
  if (typeof chartPressureProfile === 'function') chartPressureProfile('chart-pressloss', L, hf_major, hf_minor_total, v);
}

// ===== 2. BUOYANCY =====
function buildBuoyancyForm() {
  var odOpts = Object.keys(rucikaPipes).map(function (od) {
    return '<option value="' + od + '"' + (od === '315' ? ' selected' : '') + '>DN' + od + ' mm</option>';
  }).join('');

  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg> Buoyancy Pipa HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">Instalasi Underwater</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar Pipa (OD) mm${infoTip('Outer Diameter pipa HDPE PE100.\nPilih dari tabel ISO 4427-2:2019.\nData tebal dinding otomatis terisi.')}</label>
  <select class="form-control" id="by-od" onchange="updateBuoyancySDR()">${odOpts}</select></div>
  <div class="form-group"><label class="form-label">SDR / PN${infoTip('Standard Dimension Ratio = OD/en.\nSDR kecil = dinding tebal = tekanan tinggi.\nSumber: ISO 4427-2:2019')}</label>
  <select class="form-control" id="by-sdr"></select></div>
  <div class="form-group"><label class="form-label">Tebal Dinding (en) — mm</label>
  <input type="number" class="form-control" id="by-en" readonly style="background:rgba(0,229,255,.05);color:#00e5ff;font-weight:700"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="by-len" min="1" max="10000" value="100"></div>
  <div class="form-group"><label class="form-label">Densitas Air (kg/m³)${infoTip('Air tawar: 998–1000 kg/m³\nAir laut: 1020–1030 kg/m³\nAir payau: 1005–1015 kg/m³\nSumber: CRC Handbook')}</label>
  <select class="form-control" id="by-rho"><option value="1000">Air Tawar (1000)</option><option value="1025">Air Laut (1025)</option></select></div>
  <div class="form-group"><label class="form-label">Kondisi Pipa${infoTip('Pipa kosong: skenario terburuk untuk buoyancy.\nPipa penuh: berat air di dalam mengurangi gaya apung.\nDesain ballast selalu berdasarkan kondisi kosong.')}</label>
  <select class="form-control" id="by-cond"><option value="empty">Kosong (tanpa air)</option><option value="full">Penuh air</option></select></div>
  <div class="form-group"><label class="form-label">Safety Factor Ballast${infoTip('Faktor keamanan untuk berat ballast.\nMinimum 1.1 (10% lebih berat).\nUntuk kondisi arus kuat: gunakan 1.2–1.5\nSumber: AWWA M55 Ch.11')}</label><input type="number" class="form-control" id="by-sf" min="1" max="2" step="0.05" value="1.1"></div>
  <button class="calc-btn" onclick="calcBuoyancy()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Buoyancy</button>`;
  updateBuoyancySDR();
}

function updateBuoyancySDR() {
  var od = document.getElementById('by-od').value;
  var pipe = rucikaPipes[od];
  if (!pipe) return;
  var sel = document.getElementById('by-sdr');
  var pnMap = { 7.4: 'PN25', 9: 'PN20', 11: 'PN16', 13.6: 'PN12.5', 17: 'PN10', 21: 'PN8', 26: 'PN6.3' };
  sel.innerHTML = Object.keys(pipe).map(function (sdr) {
    return '<option value="' + sdr + '"' + (sdr === '17' ? ' selected' : '') + '>SDR ' + sdr + ' (' + pnMap[sdr] + ')</option>';
  }).join('');
  updateBuoyancyEN();
}

function updateBuoyancyEN() {
  var od = document.getElementById('by-od').value;
  var sdr = document.getElementById('by-sdr').value;
  var pipe = rucikaPipes[od];
  if (pipe && pipe[sdr]) {
    document.getElementById('by-en').value = pipe[sdr];
  } else {
    document.getElementById('by-en').value = (od / sdr).toFixed(1);
  }
}

document.addEventListener('change', function (e) {
  if (e.target.id === 'by-sdr') updateBuoyancyEN();
});

function calcBuoyancy() {
  var od = Vf('by-od') / 1000, sdr = parseFloat(E('by-sdr').value), len = Vf('by-len'), rhoW = Vf('by-rho'), sf = Vf('by-sf');
  var en = Vf('by-en') / 1000;
  var id = od - 2 * en;
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
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Data Pipa</div>
  ${refBadges(['Archimedes Principle', 'AWWA M55 Ch.11', 'ISO 4427-5:2019'])}
  <div class="result-grid">
    <div class="result-item"><div class="rk">OD / en</div><div class="rv">${(od * 1000).toFixed(0)} / ${(en * 1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(id * 1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Berat Pipa</div><div class="rv">${wPipe.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Kondisi</div><div class="rv">${full ? 'Penuh air' : 'Kosong'}</div></div>
  </div></div>
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg> Analisis Buoyancy</div>
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
  ${needBallast ? smartWarn('caution', 'Pipa <strong>MENGAPUNG</strong> — membutuhkan ballast ' + ballast.toFixed(2) + ' kg/m. Pasang concrete saddle weight atau continuous concrete coating.', 'AWWA M55 Ch.11 | ISO 4427-5:2019 Annex A') : smartWarn('ok', 'Pipa <strong>TENGGELAM</strong> secara alami — ballast tidak diperlukan.', 'AWWA M55 Ch.11: Net downward force = ' + Math.abs(netUp).toFixed(2) + ' kg/m')}
  </div>`;
  if (typeof animateValues === 'function') animateValues();
}

// ===== 3. WATER HAMMER (Joukowsky) =====
function buildWaterHammerForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Water Hammer <span style="font-size:10px;color:var(--text2);font-weight:400">Joukowsky</span></div>
  <div class="form-group"><label class="form-label">Material Pipa${infoTip('Modulus elastisitas (E) material menentukan wave celerity.\nPipa fleksibel (HDPE) meredam water hammer lebih baik.\nSumber: ISO 4427-5:2019 | PPI Handbook Ch.6')}</label>
  <select class="form-control" id="wh-mat"><option value="pvc">PVC (E=3 GPa)</option><option value="hdpe" selected>HDPE (E=0.8 GPa)</option><option value="ppr">PPR (E=0.9 GPa)</option><option value="steel">Baja (E=200 GPa)</option><option value="di">Ductile Iron (E=170 GPa)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)${infoTip('Diameter internal pipa.\nID = OD - 2×en')}</label><input type="number" class="form-control" id="wh-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Tebal Dinding (mm)${infoTip('Ketebalan dinding pipa (en).\nLihat tabel ISO 4427-2:2019 per SDR.')}</label><input type="number" class="form-control" id="wh-en" min="1" max="100" value="18.5"></div>
  <div class="form-group"><label class="form-label">Kecepatan Aliran (m/s)${infoTip('Kecepatan sesaat sebelum penutupan katup.\nDP = ρ × a × ΔV (Joukowsky)\nSumber: AWWA M55 Ch.7')}</label><input type="number" class="form-control" id="wh-v" min="0.1" max="10" step="0.1" value="1.5"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)${infoTip('Panjang jalur pipa — menentukan reflection time.\nTr = 2L/a (waktu refleksi gelombang)')}</label><input type="number" class="form-control" id="wh-l" min="10" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Tekanan Kerja (bar)${infoTip('Maximum Operating Pressure (MOP).\nISO 4427-5: Ptotal ≤ 1.5× MOP (occasional)\nSumber: ISO 4427-5:2019 §6.2')}</label><input type="number" class="form-control" id="wh-pw" min="1" max="50" step="0.5" value="10"></div>
  <button class="calc-btn" onclick="calcWaterHammer()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Water Hammer</button>`;
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
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hasil Water Hammer — Joukowsky</div>
  ${refBadges(['Joukowsky Equation', 'ISO 4427-5:2019 §6.2', 'AWWA M55 Ch.7'])}
  <div class="result-grid">
    <div class="result-item"><div class="rk">Wave Celerity (a)</div><div class="rv">${a.toFixed(1)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Pressure Surge (ΔP)</div><div class="rv" style="color:#ff8c42">${dPbar.toFixed(2)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Kerja</div><div class="rv">${Pw}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Maks.</div><div class="rv" style="color:${Ptotal > Pw * 1.5 ? '#ff5555' : '#00e5ff'}">${Ptotal.toFixed(2)}<span class="ru"> bar</span></div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Reflection Time</div><div class="rv">${Tr.toFixed(2)}<span class="ru"> detik</span></div></div>
    <div class="result-item"><div class="rk">Material</div><div class="rv">${matNames[mat]}<span class="ru"> E=${(Ep / 1e9).toFixed(1)} GPa</span></div></div>
  </div>
  ${waterHammerWarnings(Ptotal, Pw, dPbar, mat)}
  </div>
  ${getRefTable('elasticity')}`;
  if (typeof animateValues === 'function') animateValues();
}

// ===== 4. FRICTION LOSS (Darcy-Weisbach) =====
function buildFrictionForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Friction Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Darcy-Weisbach + Colebrook-White</span></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)${infoTip('Diameter internal pipa (ID).\nID = OD - 2×en\nSumber: ISO 4427-2:2019')}</label><input type="number" class="form-control" id="fr-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="fr-l" min="1" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)</label><input type="number" class="form-control" id="fr-q" min="0.1" max="5000" step="0.1" value="10"></div>
  <div class="form-group"><label class="form-label">Kekasaran Pipa ε (mm)${infoTip('Roughness absolut permukaan dalam pipa.\nHDPE/PVC: 0.0015 mm (sangat halus)\nBaja: 0.15–0.26 mm\nNilai meningkat seiring korosi.\nSumber: Moody Chart | PPI Handbook Ch.6')}</label>
  <select class="form-control" id="fr-e"><option value="0.0015">HDPE (0.0015 mm)</option><option value="0.0015">PVC (0.0015 mm)</option><option value="0.007">PPR (0.007 mm)</option><option value="0.15">Baja Galvanis (0.15 mm)</option><option value="0.26">Baja Karbon (0.26 mm)</option><option value="0.12">Ductile Iron (0.12 mm)</option></select></div>
  <div class="form-group"><label class="form-label">Suhu Air (°C)${infoTip('Suhu air mempengaruhi viskositas kinematik.\nAir 20°C: ν = 1.003×10⁻⁶ m²/s\nAir 40°C: ν = 0.658×10⁻⁶ m²/s\nSumber: CRC Handbook of Chemistry')}</label><input type="number" class="form-control" id="fr-t" min="5" max="80" value="25"></div>
  <button class="calc-btn" onclick="calcFriction()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Friction Loss</button>`;
}
function calcFriction() {
  var d = Vf('fr-d') / 1000;
  var L = Vf('fr-l');
  var Q = Vf('fr-q') / 1000;
  var eps = Vf('fr-e') / 1000;
  var T = Vf('fr-t');

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
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> Hasil Friction Loss — Darcy-Weisbach</div>
  ${refBadges(['Darcy-Weisbach', 'Colebrook-White', 'Moody Chart'])}
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
  </div>
  ${velocityWarnings(v, 'pressure')}
  </div>
  ${getRefTable('roughness')}
  <div class="chart-wrap"><div class="chart-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> Head Loss vs Diameter Pipa (Q=${(Q * 1000).toFixed(1)} L/s, L=${L}m)</div><div style="height:240px"><canvas id="chart-friction"></canvas></div></div>`;
  if (typeof animateValues === 'function') animateValues();
  if (typeof chartFrictionVsDiameter === 'function') chartFrictionVsDiameter('chart-friction', Q * 1000, L, eps * 1000, T);
}

// ===== 5. PIPE LOAD & DEFLECTION (AWWA M23) =====
function buildPipeLoadForm() {
  var sdrOpts = [7.4, 9, 11, 13.6, 17, 21, 26].map(s => `<option value="${s}" ${s === 17 ? 'selected' : ''}>SDR ${s}</option>`).join('');
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg> Pipe Load & Defleksi <span style="font-size:10px;color:var(--text2);font-weight:400">AWWA M23 / Modified Iowa</span></div>
  <div class="form-group"><label class="form-label">Tipe Pipa${infoTip('Flexible (HDPE/PVC): Defleksi dihitung via Modified Iowa.\nRigid (Beton/Baja): Marston load theory, defleksi tidak dihitung.\nSumber: AWWA M23 / M55')}</label>
  <select class="form-control" id="ld-type" onchange="toggleLdSDR()"><option value="flexible" selected>Flexible (HDPE)</option><option value="rigid">Rigid (Beton/Baja)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Luar (OD) mm</label><input type="number" class="form-control" id="ld-od" min="50" max="2000" value="315"></div>
  <div class="form-group" id="ld-sdr-wrap"><label class="form-label">SDR Pipa (Kekakuan)${infoTip('SDR menentukan pipe stiffness (EI/D³).\nSDR rendah = dinding tebal = lebih kaku.\nSumber: AWWA M23 §4.3')}</label>
  <select class="form-control" id="ld-sdr">${sdrOpts}</select></div>
  <div class="form-group"><label class="form-label">Kedalaman Tanam (H) m${infoTip('Kedalaman dari permukaan tanah ke mahkota pipa.\nMin 0.6m di bawah jalan (AASHTO).\nMin 0.3m di taman/lahan kosong.')}</label><input type="number" class="form-control" id="ld-h" min="0.3" max="15" step="0.1" value="1.5"></div>
  <div class="form-group"><label class="form-label">Lebar Galian (Bd) m${infoTip('Lebar trench di atas pipa.\nMin OD + 30cm (tiap sisi 15cm).\nMempengaruhi Marston load coefficient (Cd).\nSumber: AWWA M23 §4.2')}</label><input type="number" class="form-control" id="ld-bd" min="0.3" max="5" step="0.1" value="0.8"></div>
  
  <div class="form-group"><label class="form-label">Kepadatan Tanah Sekeliling (E\')${infoTip('Modulus reaksi tanah sekeliling pipa.\nSemakin padat dan berbutir kasar, E\' semakin besar.\nPengaruh sangat besar terhadap defleksi.\nSumber: AWWA M23 Table 4-5')}</label>
  <select class="form-control" id="ld-soil-e">
    <option value="2000">Ringan / Uncompacted (E' = 2 MPa)</option>
    <option value="7000" selected>Sedang / 85% Proctor (E' = 7 MPa)</option>
    <option value="14000">Padat / >90% Proctor (E' = 14 MPa)</option>
    <option value="20000">Sangat Padat / Kerikil (E' = 20 MPa)</option>
  </select></div>
  <div class="form-group"><label class="form-label">Beban Lalu Lintas (Live Load)${infoTip('Beban roda kendaraan di atas jalur pipa.\nDihitung dengan distribusi Boussinesq.\nSumber: AASHTO H-20 | AWWA M23')}</label>
  <select class="form-control" id="ld-live">
    <option value="0">Tanpa beban (Taman/Lahan kosong)</option>
    <option value="10">Pedestrian / Ringan (10 kN)</option>
    <option value="72">Truk H-20 (72 kN / roda belakang)</option>
    <option value="100">Alat Berat (100 kN)</option>
  </select></div>
  <div class="form-group"><label class="form-label">Deflection Lag Factor (Dl)${infoTip('Faktor yang memperhitungkan creep jangka panjang.\n1.0 = beban sesaat (instalasi).\n1.5 = beban jangka panjang (operasi).\nSumber: AWWA M23 §4.4')}</label>
  <select class="form-control" id="ld-dl"><option value="1.0">1.0 (Jangka Pendek)</option><option value="1.5" selected>1.5 (Jangka Panjang / Creep)</option></select></div>
  <button class="calc-btn" onclick="calcPipeLoad()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Pipe Load & Defleksi</button>`;
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
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg> Analisis Beban Tanah & Lalin</div>
  ${refBadges(['AWWA M23 / M55', 'Modified Iowa Eq.', 'Boussinesq'])}
  <div class="result-grid">
    <div class="result-item"><div class="rk">Beban Mati (Dead Load)</div><div class="rv">${Wd.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Beban Lalin (Live Load)</div><div class="rv">${Wl.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Total Beban ($W_c$)</div><div class="rv" style="color:#00e5ff">${Wtotal.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Lalin Ekivalen</div><div class="rv">${Pl_kPa.toFixed(1)}<span class="ru"> kPa</span></div></div>
  </div></div>

  ${type === 'flexible' ? `
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Prediksi Defleksi (Modified Iowa)</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    ΔX = (Dl × K × Wc) / (8 EI/D³ + 0.061 E')
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Modulus Tanah (E')</div><div class="rv">${(E_soil / 1000).toFixed(1)}<span class="ru"> MPa</span></div></div>
    <div class="result-item"><div class="rk">Kekakuan Pipa (8EI/D³)</div><div class="rv">${PS_kpa.toFixed(1)}<span class="ru"> kPa</span></div></div>
    <div class="result-item"><div class="rk">Lag Factor (Dl)</div><div class="rv">${Dl}</div></div>
    <div class="result-item"><div class="rk">Est. Defleksi (ΔX/D)</div><div class="rv" style="color:${deflPct > 5 ? '#ff5555' : '#00ff9d'};font-weight:700">${deflPct.toFixed(2)}<span class="ru"> %</span></div></div>
  </div>
  ${deflectionWarnings(deflPct)}
  </div>` :
      `${smartWarn('info', 'Pipa Rigid (beton/baja) dihitung berdasarkan Marston (Cd = ' + Cd.toFixed(2) + '). Bandingkan Total Beban ' + Wtotal.toFixed(2) + ' kN/m dengan kuat hancur (Crushing Strength) dari pabrikan. Defleksi tidak dihitung.', 'AWWA M9 | ASCE Manual 37')}`}
  ${getRefTable('soilModulus')}
  ${getRefTable('liveLoad')}
  `;
  if (typeof animateValues === 'function') animateValues();
}

// ===== 6. RAINFALL INTENSITY & RUNOFF (SNI 8153:2025) =====
function buildRainfallForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg> Curah Hujan & Runoff <span style="font-size:10px;color:var(--text2);font-weight:400">SNI 8153:2025</span></div>
  <div class="form-group"><label class="form-label">Curah Hujan Maks. Harian (R₂₄) mm</label><input type="number" class="form-control" id="rf-r24" min="10" max="1000" value="130" title="Contoh data BMKG: 130 mm/hari"></div>
  <div class="form-group"><label class="form-label">Durasi / Waktu Konsentrasi (menit)</label><input type="number" class="form-control" id="rf-t" min="1" max="1440" value="60" title="Standar SNI: Untuk atap biasanya 5-15 menit, luas besar bisa >60 menit"></div>
  <div class="form-group"><label class="form-label">Luas Area Tangkapan (m²)</label><input type="number" class="form-control" id="rf-a" min="1" max="1000000" value="500"></div>
  <div class="form-group"><label class="form-label">Koefisien Limpasan (C)</label>
  <select class="form-control" id="rf-c">
    <option value="1.0" selected>Atap Miring (> 3°) - 1.0</option>
    <option value="0.8">Atap Rata (0° s.d. 3°) - 0.8</option>
    <option value="0.6">Atap Gravel - 0.6</option>
    <option value="0.3">Green roof - 0.3</option>
  </select></div>
  <div class="form-group"><label class="form-label">Custom Koefisien (Opsional)</label><input type="number" class="form-control" id="rf-c-custom" min="0" max="1" step="0.01" value="" placeholder="Isi untuk override dropdown di atas"></div>
  <button class="calc-btn" onclick="calcRainfall()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Debit Hujan</button>`;
}

function calcRainfall() {
  var R24 = Vf('rf-r24');
  var t_menit = Vf('rf-t');
  var A_m2 = Vf('rf-a');
  var C_drop = parseFloat(E('rf-c').value);
  var C_cust = E('rf-c-custom').value;
  var C = (C_cust && !isNaN(parseFloat(C_cust))) ? parseFloat(C_cust) : C_drop;

  var t_jam = t_menit / 60;
  var I = (R24 / 24) * Math.pow(24 / t_jam, 2 / 3); // mm/jam
  var Q_Ls = (C * I * A_m2) / 3600;
  var Q_m3h = Q_Ls * 3.6;

  E('eng-results').innerHTML = `
  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg> Hasil Intensitas Curah Hujan</div>
  ${refBadges(['SNI 8153:2025 Tabel 8', 'Metode Mononobe', 'Rasional Q=CIA'])}
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    I = (R₂₄ / 24) × (24 / t)^(2/3)
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Intensitas Hujan (I)</div><div class="rv">${I.toFixed(2)}<span class="ru"> mm/jam</span></div></div>
    <div class="result-item"><div class="rk">Durasi Hujan (t)</div><div class="rv">${t_jam.toFixed(2)}<span class="ru"> jam</span></div></div>
  </div></div>

  <div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg> Debit Limpasan (Runoff)</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    Q = (C × I × A) / 3600
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Debit Max (Q)</div><div class="rv" style="color:#00e5ff;font-size:24px">${Q_Ls.toFixed(2)}<span class="ru"> L/s</span></div></div>
    <div class="result-item"><div class="rk">Debit Volumetrik</div><div class="rv">${Q_m3h.toFixed(2)}<span class="ru"> m³/jam</span></div></div>
    <div class="result-item"><div class="rk">Koef. Limpasan (C)</div><div class="rv">${C}</div></div>
    <div class="result-item"><div class="rk">Luas Area (A)</div><div class="rv">${A_m2.toLocaleString()}<span class="ru"> m²</span></div></div>
  </div>
  ${smartWarn('info', '<strong>Tips SNI 8153:2025</strong> — Debit limpasan ini menentukan dimensi pipa talang (vertical leader) dan drainase mendatar. Pastikan memilih pipa dengan kapasitas aliran yang > <strong>' + Q_Ls.toFixed(2) + ' L/s</strong>.', 'SNI 8153:2025 §8.4 | BS EN 12056-3')}
  </div>
  ${getRefTable('runoffCoeff')}`;
  if (typeof animateValues === 'function') animateValues();
}

function buildTensileForm() {
  var dOpts = [20,25,32,40,50,63,75,90,110,125,140,160,180,200,225,250,280,315,355,400,450,500,560,630,710,800,900,1000,1200];
  E('eng-form').innerHTML = `
  <div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 8h2"/><path d="M9 12h2"/></svg> Tensile Yield HDPE Rucika</div>
  <div class="form-group"><label class="form-label">Tegangan (Tensile Strength) (MPa)</label><input type="number" class="form-control" id="ts-sigma" min="1" max="100" value="20" title="Kuat tarik (Tensile strength at yield). Standar untuk HDPE PE100 umumnya 20 MPa"></div>
  <div class="form-group"><label class="form-label">Diameter Pipa (OD) (mm)</label>
  <select class="form-control" id="ts-od">
    ${dOpts.map(d => `<option value="${d}" ${d==90?'selected':''}>DN ${d} mm</option>`).join('')}
  </select></div>
  <button class="calc-btn" onclick="calcTensile()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Gaya Tarik</button>`;
}

function calcTensile() {
  var sigma = parseFloat(E('ts-sigma').value);
  var od = parseFloat(E('ts-od').value);
  
  var sdrList = [
    { sdr: 9, pn: 'PN20' },
    { sdr: 11, pn: 'PN16' },
    { sdr: 13.6, pn: 'PN12.5' },
    { sdr: 17, pn: 'PN10' },
    { sdr: 21, pn: 'PN8' },
    { sdr: 26, pn: 'PN6.3' }
  ];

  function getThickness(od, sdr) {
    const e = {
      '11': {20:1.9, 25:2.3, 32:2.9, 40:3.7, 50:4.6, 63:5.8, 75:6.8, 90:8.2, 110:10.0, 125:11.4, 140:12.7, 160:14.6, 180:16.4, 200:18.2, 225:20.5, 250:22.7, 280:25.4, 315:28.6, 355:32.2, 400:36.3, 450:40.9, 500:45.4, 560:50.8, 630:57.2, 710:64.5, 800:72.6, 900:81.7, 1000:90.2, 1200:99.4},
      '9': {20:2.3, 25:2.8, 32:3.6, 40:4.5, 50:5.6, 63:7.1, 75:8.4, 90:10.1, 110:12.3, 125:14.0, 140:15.7, 160:17.9, 180:20.1, 200:22.4, 225:25.2, 250:27.9, 280:31.3, 315:35.2, 355:39.7, 400:44.7, 450:50.3, 500:55.8, 560:62.2, 630:70.0, 710:79.3, 800:89.3, 900:100.4, 1000:111.5, 1200:133.8},
      '13.6': {50:3.7, 63:4.7, 75:5.5, 90:6.6, 110:8.1, 125:9.2, 140:10.3, 160:11.8, 180:13.3, 200:14.7, 225:16.6, 250:18.4, 280:20.5, 315:23.2, 355:26.1, 400:29.4, 450:33.1, 500:36.8, 560:41.2, 630:46.3, 710:52.2, 800:58.8, 900:66.2, 1000:72.5, 1200:88.2},
      '17': {50:3.0, 63:3.8, 75:4.5, 90:5.4, 110:6.6, 125:7.4, 140:8.3, 160:9.5, 180:10.7, 200:11.9, 225:13.4, 250:14.8, 280:16.6, 315:18.7, 355:21.1, 400:23.7, 450:26.7, 500:29.6, 560:33.2, 630:37.3, 710:42.1, 800:47.4, 900:53.3, 1000:59.3, 1200:67.9},
      '21': {75:3.6, 90:4.3, 110:5.3, 125:6.0, 140:6.7, 160:7.7, 180:8.6, 200:9.6, 225:10.8, 250:11.9, 280:13.4, 315:15.0, 355:16.9, 400:19.1, 450:21.5, 500:23.9, 560:26.7, 630:30.0, 710:33.9, 800:38.1, 900:42.9, 1000:47.7, 1200:57.2},
      '26': {90:3.5, 110:4.3, 125:4.8, 140:5.4, 160:6.2, 180:6.9, 200:7.7, 225:8.6, 250:9.6, 280:10.7, 315:12.1, 355:13.6, 400:15.3, 450:17.2, 500:19.1, 560:21.4, 630:24.1, 710:27.2, 800:30.6, 900:34.4, 1000:38.2, 1200:45.9}
    };
    if(e[sdr] && e[sdr][od]) return e[sdr][od];
    return Math.ceil((od/sdr)*10)/10;
  }

  let html = `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> Gaya Tarik Maksimum (ton)</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    σ = ${sigma} MPa | Pipa OD ${od} mm<br>
    F = A × σ / 10000 (ton)
  </div>
  <table style="width:100%; border-collapse:collapse; color:#fff; font-size:12px; text-align:center; margin-top:10px">
    <tr style="background:rgba(255,255,255,0.1); border-bottom:1px solid #4da6ff">
      <th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">SDR (PN)</th>
      <th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">Tebal e (mm)</th>
      <th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">Gaya Tarik (ton)</th>
    </tr>`;

  sdrList.forEach(item => {
    if (item.sdr === 21 && od < 75) return;
    if (item.sdr === 26 && od < 90) return;
    if (item.sdr === 17 && od < 50) return;
    if (item.sdr === 13.6 && od < 50) return;

    let e = getThickness(od, item.sdr);
    let id = od - 2 * e;
    let area = (Math.PI / 4) * (Math.pow(od, 2) - Math.pow(id, 2));
    
    let force_ton = (area * sigma) / 10000;
    let force_display = force_ton < 100 ? force_ton.toFixed(1) : Math.round(force_ton);

    html += `<tr>
      <td style="padding:8px; border:1px solid rgba(255,255,255,0.1)">SDR ${item.sdr} (${item.pn})</td>
      <td style="padding:8px; border:1px solid rgba(255,255,255,0.1)">${e.toFixed(1)}</td>
      <td style="padding:8px; border:1px solid rgba(255,255,255,0.1); color:#00e5ff; font-weight:bold">${force_display}</td>
    </tr>`;
  });

  html += `</table></div>
  <div class="fusion-warn" style="margin-top:10px"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg> <strong>Catatan Teknis:</strong><br>
  Tabel ini digunakan untuk mengetahui beban tarik maksimum saat proses penarikan pipa (misal: <em>Horizontal Directional Drilling (HDD)</em>). Ketebalan mengacu pada standar minimum pipa PE100 SNI 4829:2015.</div>`;
  
  E('eng-results').innerHTML = html;
  if (typeof animateValues === 'function') animateValues();
}

// ===== 8. THERMAL EXPANSION =====
function buildThermalExpForm() {
  E('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> Pemuaian Termal Pipa <span style="font-size:10px;color:var(--text2);font-weight:400">Thermal Expansion</span></div>
  <div style="background:rgba(0,229,255,.05);border:1px solid rgba(0,229,255,.12);border-radius:7px;padding:8px 10px;margin-bottom:12px;font-size:10px;color:#7a9ab8;line-height:1.6">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    ΔL = α × L × ΔT — Koefisien pemuaian sesuai <strong style="color:#00e5ff">ISO 15874</strong> (PPR), <strong style="color:#00e5ff">ISO 4427</strong> (HDPE), <strong style="color:#00e5ff">ISO 1452</strong> (PVC).
  </div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="te-mat" onchange="updateThermalOD()">
    <option value="ppr">PPR (Polypropylene Random) — α = 0.15 mm/m/°C</option>
    <option value="hdpe">HDPE PE100 — α = 0.20 mm/m/°C</option>
    <option value="pvc">PVC-U (uPVC) — α = 0.06 mm/m/°C</option>
  </select></div>
  <div class="form-group"><label class="form-label">Diameter Luar Pipa (OD) mm</label>
  <select class="form-control" id="te-od"></select></div>
  <div class="form-group"><label class="form-label">Panjang Pipa Lurus (m)</label><input type="number" class="form-control" id="te-length" min="1" max="1000" step="0.5" value="30"></div>
  <div class="form-group"><label class="form-label">Suhu Instalasi / Awal (°C)</label><input type="number" class="form-control" id="te-t1" min="-10" max="60" step="0.5" value="28" placeholder="Suhu saat pipa dipasang"></div>
  <div class="form-group"><label class="form-label">Suhu Operasi Maks. (°C)</label><input type="number" class="form-control" id="te-t2" min="-10" max="95" step="0.5" value="60" placeholder="Suhu air panas / paparan matahari"></div>
  <div class="form-group"><label class="form-label">Suhu Operasi Min. (°C) — Opsional</label><input type="number" class="form-control" id="te-t3" min="-10" max="60" step="0.5" value="" placeholder="Isi jika ingin hitung kontraksi juga"></div>
  <button class="calc-btn" onclick="calcThermalExp()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hitung Pemuaian</button>`;
  updateThermalOD();
}

function updateThermalOD() {
  var mat = E('te-mat').value;
  var sizes = {
    ppr:  [20, 25, 32, 40, 50, 63, 75, 90, 110, 160],
    hdpe: [20, 25, 32, 40, 50, 63, 75, 90, 110, 125, 160, 200, 250, 315, 400, 500, 630],
    pvc:  [20, 25, 32, 40, 50, 63, 75, 90, 110, 125, 160, 200, 250, 315, 400]
  };
  var list = sizes[mat] || sizes.ppr;
  var sel = E('te-od');
  sel.innerHTML = list.map(function(d) {
    return '<option value="' + d + '"' + (d === 63 ? ' selected' : '') + '>DN ' + d + ' mm</option>';
  }).join('');
}

function calcThermalExp() {
  var mat = E('te-mat').value;
  var od = Vf('te-od');
  var L = Vf('te-length');
  var T1 = Vf('te-t1');
  var T2 = Vf('te-t2');
  var T3input = E('te-t3').value;
  var hasContraction = T3input !== '' && !isNaN(parseFloat(T3input));
  var T3 = hasContraction ? parseFloat(T3input) : T1;

  // Material properties
  var props = {
    ppr:  { alpha: 0.15, name: 'PPR', E_mpa: 800,  color: '#00e676', maxTemp: 70, sdrWall: {20:3.4, 25:4.2, 32:5.4, 40:6.7, 50:8.4, 63:10.5, 75:12.5, 90:15.0, 110:18.3, 160:26.6} },
    hdpe: { alpha: 0.20, name: 'HDPE PE100', E_mpa: 800,  color: '#00bcd4', maxTemp: 60, sdrWall: {20:1.9, 25:2.3, 32:2.9, 40:3.7, 50:4.6, 63:5.8, 75:6.8, 90:8.2, 110:10.0, 125:11.4, 160:14.6, 200:18.2, 250:22.7, 315:28.6, 400:36.3, 500:45.4, 630:57.2} },
    pvc:  { alpha: 0.06, name: 'PVC-U', E_mpa: 3000, color: '#aa66ff', maxTemp: 45, sdrWall: {20:1.5, 25:1.9, 32:2.4, 40:3.0, 50:3.7, 63:4.7, 75:5.6, 90:6.7, 110:8.2, 125:9.2, 160:11.8, 200:14.7, 250:18.4, 315:23.2, 400:29.4} }
  };
  var p = props[mat];
  var alpha = p.alpha; // mm/m/°C

  // ΔT calculations
  var dT_exp = T2 - T1;      // expansion
  var dT_con = T1 - T3;      // contraction
  var dT_total = T2 - T3;    // total range

  // Thermal expansion: ΔL = α × L × ΔT (mm)
  var dL_exp = alpha * L * Math.abs(dT_exp);
  var dL_con = hasContraction ? alpha * L * Math.abs(dT_con) : 0;
  var dL_total = alpha * L * Math.abs(dT_total);
  var dL_per_m = alpha * Math.abs(dT_exp); // mm per meter

  // Wall thickness for force calculation (use PN16/SDR11 for PPR/HDPE, standard for PVC)
  var en = p.sdrWall[od] || (od / 11);
  var id_mm = od - 2 * en;
  var A_mm2 = Math.PI / 4 * (od * od - id_mm * id_mm); // cross section area (mm²)

  // Fixed point force: F = E × A × α × ΔT (convert units)
  // E in MPa (N/mm²), A in mm², alpha in /°C (need to convert from mm/m/°C to 1/°C = ×1e-3)
  var alpha_per_c = alpha / 1000; // 1/°C
  var F_exp_N = p.E_mpa * A_mm2 * alpha_per_c * Math.abs(dT_exp); // Newton
  var F_exp_kN = F_exp_N / 1000;
  var F_exp_kg = F_exp_N / 9.81;

  // Expansion loop sizing: L_loop = √(3 × D × ΔL)
  // Where D = OD in mm, ΔL in mm → L_loop in mm
  var Lloop_exp = Math.sqrt(3 * od * dL_exp); // mm
  var Lloop_total = Math.sqrt(3 * od * dL_total);

  // Guide/support spacing recommendations
  var guideSpacing = { ppr: {h: 0.7, v: 1.0}, hdpe: {h: 1.0, v: 1.2}, pvc: {h: 1.0, v: 1.5} };
  var baseSpacing = guideSpacing[mat];
  // Adjust for larger diameters
  var spacingFactor = od <= 32 ? 1.0 : od <= 63 ? 1.2 : od <= 110 ? 1.4 : 1.6;
  var hSpacing = (baseSpacing.h * spacingFactor).toFixed(1);
  var vSpacing = (baseSpacing.v * spacingFactor).toFixed(1);

  // Max distance between fixed points (practical: 6-8m for PPR, 10-15m for HDPE, 8-10m for PVC)
  var maxFixedDist = { ppr: 6, hdpe: 12, pvc: 8 };
  var fixedDist = maxFixedDist[mat];
  var nFixedPoints = Math.ceil(L / fixedDist) + 1;
  var nExpDevices = Math.ceil(L / fixedDist);

  // Icons
  var icoThermo = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>';
  var icoRuler = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>';
  var icoForce = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>';
  var icoLoop = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M17 18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2"/><path d="m15 6-3-3-3 3"/><path d="M7 18v-1a2 2 0 0 1 2-2h6"/></svg>';
  var icoTool = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

  // Severity color
  var sevColor = dL_exp < 5 ? '#00e676' : dL_exp < 15 ? '#6dd5ed' : dL_exp < 30 ? '#ffaa00' : '#ff5555';

  var html = `
  <div class="eng-section"><div class="eng-section-title">${icoThermo} Pemuaian Termal — ${p.name} DN${od}</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    ΔL = α × L × ΔT = ${alpha} × ${L} × ${Math.abs(dT_exp).toFixed(1)} = <strong>${dL_exp.toFixed(1)} mm</strong>
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Koef. Pemuaian (α)</div><div class="rv">${alpha}<span class="ru"> mm/m/°C</span></div></div>
    <div class="result-item"><div class="rk">ΔT (Ekspansi)</div><div class="rv" style="color:${dT_exp > 0 ? '#ff8c42' : '#6dd5ed'}">${dT_exp > 0 ? '+' : ''}${dT_exp.toFixed(1)}<span class="ru"> °C</span></div></div>
    <div class="result-item"><div class="rk">Pemuaian Total</div><div class="rv" style="color:${sevColor};font-size:22px">${dL_exp.toFixed(1)}<span class="ru"> mm</span></div>
    <div class="gauge-wrap"><div class="gauge-bar"><div class="gauge-fill" style="width:${Math.min(dL_exp / 50 * 100, 100)}%;background:linear-gradient(90deg,#00e676,${sevColor})"></div></div></div></div>
    <div class="result-item"><div class="rk">Pemuaian /meter</div><div class="rv">${dL_per_m.toFixed(2)}<span class="ru"> mm/m</span></div></div>
  </div>`;

  // Contraction section
  if (hasContraction) {
    html += `<div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">ΔT (Kontraksi)</div><div class="rv" style="color:#6dd5ed">-${dT_con.toFixed(1)}<span class="ru"> °C</span></div></div>
    <div class="result-item"><div class="rk">Kontraksi</div><div class="rv" style="color:#6dd5ed">${dL_con.toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item" style="grid-column:span 2"><div class="rk">Rentang Total (Ekspansi + Kontraksi)</div><div class="rv" style="color:#ffaa00">${dL_total.toFixed(1)}<span class="ru"> mm (T<sub>min</sub> ${T3}°C → T<sub>max</sub> ${T2}°C)</span></div></div>
    </div>`;
  }
  html += `</div>`;

  // Expansion Loop
  html += `
  <div class="eng-section"><div class="eng-section-title">${icoLoop} Dimensi Expansion Loop / Offset</div>
  <div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">
    L<sub>loop</sub> = √(3 × D × ΔL) = √(3 × ${od} × ${(hasContraction ? dL_total : dL_exp).toFixed(1)}) = <strong>${(hasContraction ? Lloop_total : Lloop_exp).toFixed(0)} mm</strong>
  </div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Panjang Lengan Loop</div><div class="rv" style="color:#00e5ff;font-size:20px">${((hasContraction ? Lloop_total : Lloop_exp) / 1000).toFixed(2)}<span class="ru"> m (${(hasContraction ? Lloop_total : Lloop_exp).toFixed(0)} mm)</span></div></div>
    <div class="result-item"><div class="rk">Diameter Pipa</div><div class="rv">DN ${od}<span class="ru"> mm (OD)</span></div></div>
    <div class="result-item"><div class="rk">Jarak Antar Fixed Point</div><div class="rv">${fixedDist}<span class="ru"> m (maks.)</span></div></div>
    <div class="result-item"><div class="rk">Jumlah Expansion Device</div><div class="rv">${nExpDevices}<span class="ru"> buah (untuk ${L} m)</span></div></div>
  </div></div>`;

  // Fixed Point Force
  html += `
  <div class="eng-section"><div class="eng-section-title">${icoForce} Gaya pada Fixed Point</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Modulus Elastisitas (E)</div><div class="rv">${p.E_mpa}<span class="ru"> MPa</span></div></div>
    <div class="result-item"><div class="rk">Luas Penampang Pipa</div><div class="rv">${A_mm2.toFixed(0)}<span class="ru"> mm²</span></div></div>
    <div class="result-item"><div class="rk">Gaya Aksial Ekspansi</div><div class="rv" style="color:#ff8c42">${F_exp_kN.toFixed(1)}<span class="ru"> kN (${F_exp_kg.toFixed(0)} kgf)</span></div></div>
    <div class="result-item"><div class="rk">Tebal Dinding (en)</div><div class="rv">${en.toFixed(1)}<span class="ru"> mm</span></div></div>
  </div></div>`;

  // Guide Spacing
  html += `
  <div class="eng-section"><div class="eng-section-title">${icoRuler} Jarak Support & Guide</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Jarak Guide (Horizontal)</div><div class="rv">${hSpacing}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Jarak Guide (Vertikal)</div><div class="rv">${vSpacing}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Jml Fixed Point (est.)</div><div class="rv">${nFixedPoints}<span class="ru"> titik</span></div></div>
    <div class="result-item"><div class="rk">Material</div><div class="rv" style="color:${p.color}">${p.name}</div></div>
  </div></div>`;

  // Recommendations
  html += `<div class="eng-section"><div class="eng-section-title">${icoTool} Rekomendasi</div><div style="display:flex;flex-direction:column;gap:8px">`;

  if (mat === 'ppr') {
    html += `<div class="rec-card"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></div><div class="rec-text"><strong>PPR memiliki pemuaian tinggi (0.15 mm/m/°C).</strong> Untuk sistem air panas, WAJIB gunakan expansion loop atau compensator pada setiap perubahan arah dan setiap ${fixedDist}m jalur lurus.</div></div>`;
    if (T2 > 60) {
      html += `<div class="rec-card rec-warn"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="rec-text"><strong>Suhu operasi ${T2}°C mendekati batas PPR.</strong> Pastikan menggunakan PPR PN20 (SDR 6) untuk suhu >60°C. Suhu maks kontinu PPR: 70°C, intermiten: 95°C.</div></div>`;
    }
    html += `<div class="rec-card"><div class="rec-text">Gunakan <strong>PPR-CT (PPR Fiber Composite)</strong> untuk mengurangi pemuaian hingga ~70% dibanding PPR standar (α ≈ 0.05 mm/m/°C).</div></div>`;
  }

  if (mat === 'hdpe') {
    html += `<div class="rec-card"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6v4"/><path d="M10 6v2"/><path d="M14 6v4"/><path d="M18 6v2"/></svg></div><div class="rec-text"><strong>HDPE memiliki pemuaian tertinggi (0.20 mm/m/°C)</strong> di antara pipa plastik. Untuk instalasi above-ground, expansion loop atau snake-lay pattern WAJIB direncanakan.</div></div>`;
    html += `<div class="rec-card"><div class="rec-text">Untuk instalasi <strong>underground (buried)</strong>, pemuaian termal biasanya ditahan oleh gesekan tanah. Pastikan tanah urug dipadatkan dengan baik. Pre-stressing sebelum penimbunan dapat mengurangi tegangan sisa.</div></div>`;
    if (T2 > 45) {
      html += `<div class="rec-card rec-warn"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="rec-text"><strong>Suhu ${T2}°C:</strong> Perhatikan derating factor tekanan kerja HDPE. Pada 50°C, kapasitas tekanan turun ~50% dari rating 20°C.</div></div>`;
    }
  }

  if (mat === 'pvc') {
    html += `<div class="rec-card"><div class="rec-icon">✅</div><div class="rec-text"><strong>PVC-U memiliki pemuaian paling rendah (0.06 mm/m/°C)</strong> di antara pipa plastik. Namun PVC bersifat <strong>rigid/getas</strong> — tegangan termal TIDAK boleh diabaikan.</div></div>`;
    if (T2 > 40) {
      html += `<div class="rec-card rec-warn"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="rec-text"><strong>PVC-U TIDAK untuk air panas!</strong> Suhu maks operasi: 45°C. Untuk suhu lebih tinggi gunakan PVC-C (CPVC) atau PPR.</div></div>`;
    }
    html += `<div class="rec-card"><div class="rec-text">Gunakan <strong>rubber ring joint</strong> (solvent-free) pada jalur panjang. Rubber ring memungkinkan gerakan aksial sehingga berfungsi sebagai expansion joint alami.</div></div>`;
  }

  // General tips
  html += `<div class="rec-card"><div class="rec-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="rec-text"><strong>Layout Fixed Point:</strong> Pasang di kedua sisi belokan, percabangan tee, di dekat valve/equipment, dan di ujung pipa. Jarak maks antar fixed point: ~${fixedDist}m.</div></div>`;
  html += `<div class="rec-card"><div class="rec-text"><strong>Sliding Support:</strong> Pastikan support/clamp memungkinkan gerakan aksial (sliding), jangan jepit pipa terlalu kencang di antara fixed point.</div></div>`;

  html += `</div></div>`;

  // Comparison table
  html += `<div class="eng-section"><div class="eng-section-title">${icoThermo} Perbandingan Pemuaian per Material</div>
  <table style="width:100%;border-collapse:collapse;font-size:11px;color:#fff;text-align:center;margin-top:8px">
  <tr style="background:rgba(255,255,255,.08);border-bottom:1px solid rgba(0,229,255,.15)">
    <th style="padding:7px;border:1px solid rgba(255,255,255,.06)">Material</th>
    <th style="padding:7px;border:1px solid rgba(255,255,255,.06)">α (mm/m/°C)</th>
    <th style="padding:7px;border:1px solid rgba(255,255,255,.06)">ΔL untuk ${L}m, ΔT=${Math.abs(dT_exp).toFixed(0)}°C</th>
    <th style="padding:7px;border:1px solid rgba(255,255,255,.06)">Loop (mm)</th>
  </tr>`;

  var compMats = [
    { name: 'PPR', alpha: 0.15, color: '#00e676' },
    { name: 'PPR-CT (Fiber)', alpha: 0.05, color: '#66bb6a' },
    { name: 'HDPE PE100', alpha: 0.20, color: '#00bcd4' },
    { name: 'PVC-U', alpha: 0.06, color: '#aa66ff' },
    { name: 'Baja Karbon', alpha: 0.012, color: '#aaaaaa' },
    { name: 'Tembaga', alpha: 0.017, color: '#ff8a65' }
  ];
  compMats.forEach(function(m) {
    var dl = m.alpha * L * Math.abs(dT_exp);
    var ll = Math.sqrt(3 * od * dl);
    var isActive = m.name.toLowerCase().indexOf(p.name.toLowerCase().split(' ')[0].toLowerCase()) >= 0 && m.name.indexOf('CT') < 0;
    if (mat === 'ppr' && m.name === 'PPR') isActive = true;
    html += '<tr style="' + (isActive ? 'background:rgba(0,229,255,.08);' : '') + '">' +
      '<td style="padding:6px;border:1px solid rgba(255,255,255,.06);color:' + m.color + ';font-weight:' + (isActive ? '700' : '400') + '">' + m.name + (isActive ? ' ◄' : '') + '</td>' +
      '<td style="padding:6px;border:1px solid rgba(255,255,255,.06);font-family:monospace">' + m.alpha + '</td>' +
      '<td style="padding:6px;border:1px solid rgba(255,255,255,.06);font-family:monospace;color:' + (dl > 20 ? '#ffaa00' : '#00e676') + ';font-weight:700">' + dl.toFixed(1) + ' mm</td>' +
      '<td style="padding:6px;border:1px solid rgba(255,255,255,.06);font-family:monospace">' + ll.toFixed(0) + '</td></tr>';
  });
  html += '</table></div>';

  html += '<div class="chart-wrap"><div class="chart-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> Perbandingan Pemuaian per Material (L=' + L + 'm, ΔT=' + Math.abs(dT_exp).toFixed(0) + '°C)</div><div style="height:220px"><canvas id="chart-thermal"></canvas></div></div>';

  E('eng-results').innerHTML = html;
  if (typeof animateValues === 'function') animateValues();
  if (typeof chartThermalComparison === 'function') chartThermalComparison('chart-thermal', L, dT_exp, od);
}
