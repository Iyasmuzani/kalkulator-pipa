// ==================== CALCULATOR FORMS & LOGIC ====================
function buildCalcForm() {
  if (currentSystem === 'bangunan') buildCalcBangunan();
  else if (currentSystem === 'tambang') buildCalcTambang();
  else if (currentSystem === 'siphonic') buildCalcSiphonic();
  else buildCalcDistribusi();
}

function buildCalcBangunan() {
  document.getElementById('calc-form').innerHTML = `
  <div class="form-title">📐 Data Bangunan <span style="font-size:10px;color:var(--text2);font-weight:400">(SNI 8153:2025)</span></div>
  <div class="form-group"><label class="form-label">Tipe Bangunan</label>
  <select class="form-control" id="f-type"><option value="rumah">Rumah Tinggal</option><option value="apartemen">Apartemen / Rusun</option><option value="hotel">Hotel / Penginapan</option><option value="kantor">Gedung Kantor</option><option value="rumahsakit">Rumah Sakit</option><option value="puskesmas">Puskesmas / Klinik</option><option value="sekolah">Sekolah / Kampus</option><option value="masjid">Masjid / Tempat Ibadah</option><option value="restoran">Restoran / Food Court</option></select></div>
  <div class="form-group"><label class="form-label">Jumlah Lantai</label><input type="number" class="form-control" id="f-floors" min="1" max="50" value="4"></div>
  <div class="form-group"><label class="form-label">Jumlah Pengguna per hari</label><input type="number" class="form-control" id="f-users" min="1" value="30"></div>
  <div class="form-group"><label class="form-label">Tinggi per Lantai (m)</label><input type="number" class="form-control" id="f-height" min="2.5" max="8" step="0.1" value="3.5"></div>
  <div class="form-group"><label class="form-label">Sumber Air</label><select class="form-control" id="f-source"><option value="pdam">PDAM</option><option value="sumur">Sumur Bor</option><option value="keduanya">PDAM + Sumur</option></select></div>
  <div class="form-group"><label class="form-label">Sistem Distribusi</label><select class="form-control" id="f-system"><option value="downfeed">Down-feed (Gravitasi)</option><option value="upfeed">Up-feed (Booster)</option><option value="hybrid">Hybrid</option></select></div>
  <div class="form-group"><label class="form-label">Material Pipa</label><select class="form-control" id="f-pipe"><option value="ppr10">PPR PN10 (Cold water)</option><option value="ppr16">PPR PN16 (Cold/warm)</option><option value="ppr20">PPR PN20 (Cold + Hot)</option><option value="pvc">uPVC Class AW</option><option value="galvanis">Baja Galvanis</option><option value="hdpe">HDPE</option></select></div>
  <div class="form-group"><label class="form-label">Kecepatan Aliran (m/s)</label><input type="number" class="form-control" id="f-velocity" min="0.6" max="2.0" step="0.1" value="1.5"></div>
  <button class="calc-btn" onclick="calcBangunan()">⚡ Hitung Rekomendasi</button>`;
}

function buildCalcTambang() {
  document.getElementById('calc-form').innerHTML = `
  <div class="form-title">⛏️ Data Sistem Tambang</div>
  <div class="mode-toggle"><button class="mode-btn active" id="mb-dw" onclick="setMiningMode('dewatering')">💧 Dewatering</button><button class="mode-btn" id="mb-sl" onclick="setMiningMode('slurry')">🔄 Slurry Transport</button></div>
  <div id="mining-form-dw">
  <div class="form-group"><label class="form-label">Kedalaman Pit (m)</label><input type="number" class="form-control" id="m-depth" min="10" max="500" value="80"></div>
  <div class="form-group"><label class="form-label">Debit Inflow Air Tanah (m³/jam)</label><input type="number" class="form-control" id="m-inflow" min="10" max="5000" value="200"></div>
  <div class="form-group"><label class="form-label">Jarak Horizontal Pit ke Settling Pond (m)</label><input type="number" class="form-control" id="m-dist" min="50" max="5000" value="500"></div>
  <div class="form-group"><label class="form-label">Material Pipa</label><select class="form-control" id="m-pipe"><option value="hdpe">HDPE PE100</option><option value="steel">Baja Karbon</option></select></div>
  <button class="calc-btn" onclick="calcMiningDW()">⚡ Hitung Dewatering</button></div>
  <div id="mining-form-sl" style="display:none">
  <div class="form-group"><label class="form-label">Debit Slurry (m³/jam)</label><input type="number" class="form-control" id="s-flow" min="10" max="2000" value="150"></div>
  <div class="form-group"><label class="form-label">Konsentrasi Solid (%berat)</label><input type="number" class="form-control" id="s-conc" min="5" max="65" value="30"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="s-len" min="100" max="10000" value="1000"></div>
  <div class="form-group"><label class="form-label">Beda Elevasi (m, + = naik)</label><input type="number" class="form-control" id="s-elev" min="-100" max="200" value="20"></div>
  <div class="form-group"><label class="form-label">Ukuran Partikel d50 (mm)</label><input type="number" class="form-control" id="s-d50" min="0.05" max="50" step="0.1" value="2"></div>
  <button class="calc-btn" onclick="calcMiningSlurry()">⚡ Hitung Slurry</button></div>`;
}

function buildCalcDistribusi() {
  document.getElementById('calc-form').innerHTML = `
  <div class="form-title">🌐 Data Jaringan Distribusi</div>
  <div class="form-group"><label class="form-label">Jumlah Sambungan Rumah (SR)</label><input type="number" class="form-control" id="d-sr" min="50" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Jiwa per SR</label><input type="number" class="form-control" id="d-jpsr" min="3" max="8" value="5"></div>
  <div class="form-group"><label class="form-label">Kebutuhan Air (L/org/hari)</label><input type="number" class="form-control" id="d-liter" min="60" max="250" value="120"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa Transmisi (m)</label><input type="number" class="form-control" id="d-trans" min="100" max="50000" value="3000"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa Distribusi (m)</label><input type="number" class="form-control" id="d-dist" min="500" max="100000" value="8000"></div>
  <div class="form-group"><label class="form-label">Beda Elevasi Maks (m)</label><input type="number" class="form-control" id="d-elev" min="0" max="200" value="30"></div>
  <div class="form-group"><label class="form-label">Tekanan Layanan Min (bar)</label><input type="number" class="form-control" id="d-pmin" min="0.5" max="5" step="0.1" value="1.5"></div>
  <button class="calc-btn" onclick="calcDistribusi()">⚡ Hitung Jaringan</button>`;
}

function setMiningMode(m) {
  document.getElementById('mining-form-dw').style.display = m === 'dewatering' ? 'block' : 'none';
  document.getElementById('mining-form-sl').style.display = m === 'slurry' ? 'block' : 'none';
  document.getElementById('mb-dw').classList.toggle('active', m === 'dewatering');
  document.getElementById('mb-sl').classList.toggle('active', m === 'slurry');
}

function fmt(n) { if (n >= 1e6) return (n / 1e6).toFixed(2) + ' m³'; if (n >= 1000) return (n / 1000).toFixed(1) + ' m³'; return Math.round(n) + ' L'; }
function findPipe(d, sizes) { return sizes.find(s => s >= d) || sizes[sizes.length - 1]; }
var stdPipes = [50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200];
var pwStd = [0.25, 0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 400, 500];

function R(id) { return document.getElementById(id); }
function V(id) { return parseFloat(R(id).value) || 0; }

function calcBangunan() {
  // Kebutuhan air per SNI 8153:2025 Tabel 1
  var ws = {
    rumah: { l: 120, p: 2.5, name: 'Rumah Tinggal', unit: 'L/org/hari' },
    apartemen: { l: 150, p: 3.0, name: 'Apartemen/Rusun', unit: 'L/org/hari' },
    hotel: { l: 250, p: 3.5, name: 'Hotel/Penginapan', unit: 'L/tamu/hari' },
    kantor: { l: 50, p: 5.0, name: 'Gedung Kantor', unit: 'L/org/hari' },
    rumahsakit: { l: 400, p: 4.0, name: 'Rumah Sakit', unit: 'L/TT/hari' },
    puskesmas: { l: 200, p: 3.5, name: 'Puskesmas/Klinik', unit: 'L/org/hari' },
    sekolah: { l: 40, p: 4.0, name: 'Sekolah/Kampus', unit: 'L/siswa/hari' },
    masjid: { l: 35, p: 6.0, name: 'Masjid/T.Ibadah', unit: 'L/jamaah/hari' },
    restoran: { l: 80, p: 5.0, name: 'Restoran/Food Court', unit: 'L/kursi/hari' }
  };
  var t = R('f-type').value, fl = V('f-floors'), us = V('f-users'), hf = V('f-height'), src = R('f-source').value, sys = R('f-system').value, pp = R('f-pipe').value;
  var s = ws[t], Qd = us * s.l, gt = Math.ceil(Qd * 1.5 / 100) * 100, rt = Math.ceil(Qd * 0.3 / 100) * 100;
  var Qls = Qd * s.p / 86400, Qm3h = Qls * 3.6, Qm3s = Qls / 1000;
  var tH = fl * hf + 8, fr = tH * 0.22, H = Math.ceil(tH + fr + 10);
  var pw = (1000 * 9.81 * Qm3s * H) / (650), pwF = pwStd.find(p => p >= pw) || Math.ceil(pw);
  // Kecepatan aliran desain (SNI 8153:2025: 0.6–2.0 m/s)
  var vDes = V('f-velocity') || 1.5;
  var Dm = Math.sqrt(4 * Qm3s / (Math.PI * vDes)) * 1000;
  var pSpecs = {
    'ppr10': { s: [20, 25, 32, 40, 50, 63, 75, 90, 110, 160], id: [15.6, 20.4, 26.2, 32.6, 40.8, 51.4, 61.4, 73.6, 90, 128], l: 'OD' },
    'ppr16': { s: [20, 25, 32, 40, 50, 63, 75, 90, 110, 160], id: [14.4, 18, 23.2, 29, 36.2, 45.8, 54.4, 65.4, 79.8, 114.2], l: 'OD' },
    'ppr20': { s: [20, 25, 32, 40, 50, 63, 75, 90, 110, 160], id: [13.2, 16.6, 21.2, 26.6, 33.4, 42, 50, 60, 73.4, 106.6], l: 'OD' },
    'hdpe': { s: [20, 25, 32, 40, 50, 63, 75, 90, 110, 160, 200], id: [16.0, 21.0, 27.2, 34.0, 42.6, 53.6, 63.8, 76.6, 93.8, 136.4, 170.6], l: 'OD' },
    'pvc': { s: [16, 20, 25, 35, 40, 50, 65, 75, 100, 125, 150, 200, 250, 300], id: [19, 22.4, 28, 37.4, 43.4, 55.4, 70.8, 82.8, 105.8, 129.2, 152.2, 199.4, 246.4, 293.6], l: 'DN' },
    'galvanis': { s: [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300], id: [16.1, 21.6, 27.3, 36.0, 41.9, 53.0, 68.7, 80.8, 105.3, 130.0, 155.4, 202.7, 254.5, 304.7], l: 'DN' }
  };
  var spec = pSpecs[pp];
  var pD, bD;
  if (spec.id) {
    var iP = spec.id.findIndex(v => v >= Dm), iB = spec.id.findIndex(v => v >= Dm * 0.6);
    pD = spec.s[iP >= 0 ? iP : spec.s.length - 1];
    bD = spec.s[iB >= 0 ? iB : spec.s.length - 1];
  } else {
    pD = findPipe(Dm / spec.r, spec.s);
    bD = findPipe((Dm * 0.6) / spec.r, spec.s);
  }
  var pt = Math.ceil(Qls * 360 / 10) * 10, wP = H / 10, prv = wP > 3.5, z = Math.ceil(fl / 4);
  var pm = { 'ppr10': 'PPR PN10', 'ppr16': 'PPR PN16', 'ppr20': 'PPR PN20', 'pvc': 'uPVC Class AW', 'galvanis': 'Baja Galvanis', 'hdpe': 'HDPE PN12.5' };
  R('rec-results').innerHTML = `
  <div class="result-sec"><div class="result-sec-title">📊 Kebutuhan Air — ${us} pengguna</div><div class="result-grid">
  <div class="result-item"><div class="rk">Konsumsi Harian</div><div class="rv">${(Qd / 1000).toFixed(2)}<span class="ru"> m³/hari</span></div></div>
  <div class="result-item"><div class="rk">Debit Puncak</div><div class="rv">${Qls.toFixed(2)}<span class="ru"> L/s</span></div></div>
  <div class="result-item"><div class="rk">Tangki Bawah</div><div class="rv">${fmt(gt)}</div></div>
  <div class="result-item"><div class="rk">Tangki Atas</div><div class="rv">${fmt(rt)}</div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">⚙️ Spesifikasi Pompa</div><div class="result-grid">
  <div class="result-item"><div class="rk">Total Head</div><div class="rv">${H}<span class="ru"> m</span></div></div>
  <div class="result-item"><div class="rk">Debit Pompa</div><div class="rv">${Qm3h.toFixed(1)}<span class="ru"> m³/jam</span></div></div>
  <div class="result-item"><div class="rk">Daya Motor</div><div class="rv">${pwF}<span class="ru"> kW</span></div></div>
  <div class="result-item"><div class="rk">Tekanan Kerja</div><div class="rv">${wP.toFixed(1)}<span class="ru"> bar</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">🔧 Perpipaan</div><div class="result-grid">
  <div class="result-item"><div class="rk">Pipa Utama</div><div class="rv">${spec.l}${pD}<span class="ru"> mm</span></div></div>
  <div class="result-item"><div class="rk">Pipa Cabang</div><div class="rv">${spec.l}${bD}<span class="ru"> mm</span></div></div>
  <div class="result-item"><div class="rk">PRV Diperlukan</div><div class="rv" style="color:${prv ? '#ffaa00' : '#00ff9d'}">${prv ? 'YA - ' + z + ' zona' : 'TIDAK'}</div></div>
  <div class="result-item"><div class="rk">Material</div><div class="rv" style="font-size:13px">${pm[pp]}</div></div></div></div>`;
}

function calcMiningDW() {
  var dep = V('m-depth'), inf = V('m-inflow'), dist = V('m-dist'), pp = R('m-pipe').value;
  var Qm3s = inf / 3600, Qls = inf / 3.6;
  // Friction loss per ASME B31.3: ~3% of equivalent length
  var Hs = dep, Hf = (dist + dep) * 0.03, Hm = 15, H = Math.ceil((Hs + Hf + Hm) * 1.15); // 15% safety factor per ASME B31.3
  var pw = (1000 * 9.81 * Qm3s * H) / 650, pwF = pwStd.find(p => p >= pw) || Math.ceil(pw); // η=0.65 submersible pump
  var v = 2.5, Dm = Math.sqrt(4 * Qm3s / (Math.PI * v)) * 1000;
  var pD = findPipe(Dm, stdPipes);
  var vAct = (4 * Qm3s / (Math.PI * Math.pow(pD / 1000, 2))).toFixed(2);
  var vWarn = parseFloat(vAct) > 4.5; // ASME B31.3 max erosional velocity
  var spVol = Math.ceil(inf * 4), spArea = Math.ceil(spVol / 2.5);
  R('rec-results').innerHTML = `
  <div class="result-sec"><div class="result-sec-title">💧 Sistem Dewatering</div><div class="result-grid">
  <div class="result-item"><div class="rk">Debit Inflow</div><div class="rv">${inf}<span class="ru"> m³/jam</span></div></div>
  <div class="result-item"><div class="rk">Debit Pompa</div><div class="rv">${Qls.toFixed(1)}<span class="ru"> L/s</span></div></div>
  <div class="result-item"><div class="rk">Total Dynamic Head</div><div class="rv">${H}<span class="ru"> m</span></div></div>
  <div class="result-item"><div class="rk">Static Head</div><div class="rv">${dep}<span class="ru"> m</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">⚙️ Spesifikasi Pompa Submersible</div><div class="result-grid">
  <div class="result-item"><div class="rk">Daya Motor Min.</div><div class="rv">${pwF}<span class="ru"> kW</span></div></div>
  <div class="result-item"><div class="rk">Jumlah Pompa</div><div class="rv">2<span class="ru"> (1+1 standby)</span></div></div>
  <div class="result-item"><div class="rk">Diameter Pipa</div><div class="rv">DN${pD}<span class="ru"> mm (${pp.toUpperCase()})</span></div></div>
  <div class="result-item"><div class="rk">Kecepatan Aliran</div><div class="rv" style="color:${vWarn ? '#ff5555' : 'var(--sys-accent)'}">${vAct}<span class="ru"> m/s ${vWarn ? '⚠️ EROSIF' : ''}</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">🏊 Settling Pond</div><div class="result-grid">
  <div class="result-item"><div class="rk">Volume Min. (4 jam)</div><div class="rv">${spVol}<span class="ru"> m³</span></div></div>
  <div class="result-item"><div class="rk">Luas @2.5m depth</div><div class="rv">${spArea}<span class="ru"> m²</span></div></div>
  <div class="result-item"><div class="rk">Jumlah Kolam</div><div class="rv">2<span class="ru"> (paralel)</span></div></div>
  <div class="result-item"><div class="rk">Jarak Discharge</div><div class="rv">${dist}<span class="ru"> m</span></div></div></div></div>`;
}

function calcMiningSlurry() {
  var fl = V('s-flow'), co = V('s-conc'), ln = V('s-len'), el = V('s-elev'), d50 = V('s-d50');
  var Qm3s = fl / 3600, rhoS = 2650, rhoW = 1000, Cv = co / (100 * (rhoS / rhoW)), rhoM = rhoW * (1 + Cv * (rhoS / rhoW - 1));
  var Ss = rhoS / rhoW;
  var FL = d50 < 0.2 ? 0.9 : (d50 < 1.0 ? 1.1 : (d50 < 2.0 ? 1.2 : 1.35));
  var K = FL * Math.sqrt(2 * 9.81 * (Ss - 1));
  var Dm = Math.pow(4 * Qm3s / (Math.PI * K), 0.4) * 1000;
  var validPipes = stdPipes.filter(p => p <= Dm);
  var pD = validPipes.length > 0 ? validPipes[validPipes.length - 1] : stdPipes[0];
  var Vc = K * Math.sqrt(pD / 1000);
  var vAct = (4 * Qm3s / (Math.PI * Math.pow(pD / 1000, 2))).toFixed(2);
  var vWarn = parseFloat(vAct) > 4.5; // ASME B31.11 erosion velocity limit
  var fSl = 0.025 * (1 + co / 30), Hf = fSl * (ln / ((pD / 1000))) * Math.pow(parseFloat(vAct), 2) / (2 * 9.81);
  // ASME B31.11: higher minor losses for slurry (+20m) and lower pump efficiency (η=0.55)
  var Hs = Math.max(el, 0), H = Math.ceil(Hs + Hf + 20);
  var pw = (rhoM * 9.81 * Qm3s * H) / 550, pwF = pwStd.find(p => p >= pw) || Math.ceil(pw);
  R('rec-results').innerHTML = `
  <div class="result-sec"><div class="result-sec-title">🔄 Sistem Slurry Transport</div><div class="result-grid">
  <div class="result-item"><div class="rk">Debit Slurry</div><div class="rv">${fl}<span class="ru"> m³/jam</span></div></div>
  <div class="result-item"><div class="rk">Konsentrasi Solid</div><div class="rv">${co}<span class="ru"> %berat</span></div></div>
  <div class="result-item"><div class="rk">Densitas Campuran</div><div class="rv">${Math.round(rhoM)}<span class="ru"> kg/m³</span></div></div>
  <div class="result-item"><div class="rk">Critical Velocity</div><div class="rv">${Vc.toFixed(1)}<span class="ru"> m/s</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">⚙️ Spesifikasi Pompa Slurry</div><div class="result-grid">
  <div class="result-item"><div class="rk">Total Dynamic Head</div><div class="rv">${H}<span class="ru"> m slurry</span></div></div>
  <div class="result-item"><div class="rk">Daya Motor Min.</div><div class="rv">${pwF}<span class="ru"> kW</span></div></div>
  <div class="result-item"><div class="rk">Diameter Pipa</div><div class="rv">DN${pD}<span class="ru"> mm (Steel Lined)</span></div></div>
  <div class="result-item"><div class="rk">Kecepatan Aktual</div><div class="rv" style="color:${vWarn ? '#ff5555' : 'var(--sys-accent)'}">${vAct}<span class="ru"> m/s ${vWarn ? '⚠️ EROSIF' : ''}</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">🛡️ Rekomendasi</div><div style="display:flex;flex-direction:column;gap:8px">
  <div class="rec-card"><div class="rec-icon">🔧</div><div class="rec-text">Panjang jalur <strong>${ln}m</strong>, beda elevasi <strong>${el}m</strong>. Friction loss ${Hf.toFixed(1)}m. ${parseFloat(vAct) < Vc ? '<strong style="color:#ff5555">⚠️ KECEPATAN DI BAWAH Vc — RISIKO SEDIMENTASI!</strong>' : 'Kecepatan aman di atas critical velocity.'}</div></div>
  <div class="rec-card"><div class="rec-icon">🛡️</div><div class="rec-text">Material liner: ${d50 > 5 ? '<strong>Ceramic tile</strong> (partikel kasar >5mm)' : '<strong>Rubber lining</strong> (partikel halus ≤5mm)'}. Inspeksi UT setiap 3–6 bulan.</div></div></div></div>`;
}

function calcDistribusi() {
  var sr = V('d-sr'), jp = V('d-jpsr'), lp = V('d-liter'), lt = V('d-trans'), ld = V('d-dist'), el = V('d-elev'), pm = V('d-pmin');
  var pop = sr * jp, Qd = pop * lp, QdM3 = Qd / 1000, fpk = 1.5 + (pop < 5000 ? 1 : pop < 20000 ? 0.5 : 0.2);
  var Qpk = QdM3 * fpk / 24, QpkLs = Qpk * 1000 / 3600;
  var vT = 1.5, DmT = Math.sqrt(4 * (QpkLs / 1000) / (Math.PI * vT)) * 1000;
  var pDT = findPipe(DmT, stdPipes);
  var vD = 1.0, QdLs = QpkLs * 0.6, DmD = Math.sqrt(4 * (QdLs / 1000) / (Math.PI * vD)) * 1000;
  var pDD = findPipe(DmD, stdPipes);
  var resVol = Math.ceil(QdM3 * 0.2), Hf = lt * 0.005 + ld * 0.008, Hs = el, Hp = pm * 10;
  var H = Math.ceil(Hs + Hf + Hp), Qm3s = QpkLs / 1000;
  var pw = (1000 * 9.81 * Qm3s * H) / 650, pwF = pwStd.find(p => p >= pw) || Math.ceil(pw);
  var nGV = Math.ceil(ld / 300), nAV = Math.ceil((lt + ld) / 500), nHyd = Math.ceil(ld / 300);
  var nDMA = Math.ceil(sr / 200);
  R('rec-results').innerHTML = `
  <div class="result-sec"><div class="result-sec-title">📊 Kebutuhan Air — ${pop.toLocaleString()} jiwa</div><div class="result-grid">
  <div class="result-item"><div class="rk">Kebutuhan Harian</div><div class="rv">${QdM3.toFixed(1)}<span class="ru"> m³/hari</span></div></div>
  <div class="result-item"><div class="rk">Debit Puncak</div><div class="rv">${QpkLs.toFixed(1)}<span class="ru"> L/s</span></div></div>
  <div class="result-item"><div class="rk">Faktor Puncak</div><div class="rv">${fpk.toFixed(1)}<span class="ru">×</span></div></div>
  <div class="result-item"><div class="rk">Jumlah SR</div><div class="rv">${sr.toLocaleString()}<span class="ru"> sambungan</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">🔷 Perpipaan</div><div class="result-grid">
  <div class="result-item"><div class="rk">Pipa Transmisi</div><div class="rv">DN${pDT}<span class="ru"> mm HDPE</span></div></div>
  <div class="result-item"><div class="rk">Pipa Distribusi</div><div class="rv">DN${pDD}<span class="ru"> mm PVC</span></div></div>
  <div class="result-item"><div class="rk">Pjg Transmisi</div><div class="rv">${(lt / 1000).toFixed(1)}<span class="ru"> km</span></div></div>
  <div class="result-item"><div class="rk">Pjg Distribusi</div><div class="rv">${(ld / 1000).toFixed(1)}<span class="ru"> km</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">⚡ Pompa & Reservoir</div><div class="result-grid">
  <div class="result-item"><div class="rk">Total Head</div><div class="rv">${H}<span class="ru"> m</span></div></div>
  <div class="result-item"><div class="rk">Daya Pompa</div><div class="rv">${pwF}<span class="ru"> kW</span></div></div>
  <div class="result-item"><div class="rk">Vol. Reservoir</div><div class="rv">${resVol}<span class="ru"> m³</span></div></div>
  <div class="result-item"><div class="rk">Jumlah DMA</div><div class="rv">${nDMA}<span class="ru"> zona</span></div></div></div></div>
  <div class="result-sec"><div class="result-sec-title">🔶 Appurtenances</div><div class="result-grid">
  <div class="result-item"><div class="rk">Gate Valve</div><div class="rv">~${nGV}<span class="ru"> unit</span></div></div>
  <div class="result-item"><div class="rk">Air Valve</div><div class="rv">~${nAV}<span class="ru"> unit</span></div></div>
  <div class="result-item"><div class="rk">Hidran</div><div class="rv">~${nHyd}<span class="ru"> unit</span></div></div>
  <div class="result-item"><div class="rk">Bulk Meter</div><div class="rv">${nDMA}<span class="ru"> unit</span></div></div></div></div>`;
}

// ==================== SIPHONIC ROOF DRAIN CALCULATOR ====================
function buildCalcSiphonic() {
  document.getElementById('calc-form').innerHTML = `
  <div class="form-title">🌧️ Data Siphonic Roof Drain <span style="font-size:10px;color:var(--text2);font-weight:400">(BS 8490 · Preliminary)</span></div>
  <div style="background:rgba(255,170,0,.08);border:1px solid rgba(255,170,0,.2);border-radius:7px;padding:8px 10px;margin-bottom:12px;font-size:10px;color:#ffd080;line-height:1.6">
    ⚠️ <strong>Preliminary sizing only.</strong> Desain final siphonic WAJIB menggunakan software hidraulik khusus produsen sistem siphonic.
  </div>
  <div class="form-group"><label class="form-label">Luas Catchment Atap (m²)</label><input type="number" class="form-control" id="sf-area" min="50" max="50000" value="1000"></div>
  <div class="form-group"><label class="form-label">Intensitas Hujan Desain (mm/jam)</label>
  <select class="form-control" id="sf-rain">
    <option value="150">150 mm/jam — Indonesia Barat (umum)</option>
    <option value="175">175 mm/jam — Indonesia Tengah</option>
    <option value="200" selected>200 mm/jam — Indonesia Timur / kritis</option>
    <option value="250">250 mm/jam — Ekstrem / safety factor tinggi</option>
    <option value="custom">Custom (isi manual)</option>
  </select></div>
  <div class="form-group" id="sf-rain-custom-wrap" style="display:none"><label class="form-label">Intensitas Custom (mm/jam)</label><input type="number" class="form-control" id="sf-rain-custom" min="50" max="500" value="200"></div>
  <div class="form-group"><label class="form-label">Tinggi Bangunan / Available Head (m)</label><input type="number" class="form-control" id="sf-height" min="3" max="100" step="0.5" value="15"></div>
  <div class="form-group"><label class="form-label">Jumlah Titik Roof Outlet</label><input type="number" class="form-control" id="sf-outlets" min="2" max="50" value="4"></div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="sf-pipe">
    <option value="vp">PVC JIS VP/AW PN 10</option>
    <option value="hdpe10">HDPE PN 10</option>
    <option value="hdpe8">HDPE PN 8</option>
  </select></div>
  <div class="form-group"><label class="form-label">Panjang Collecting Pipe (m)</label><input type="number" class="form-control" id="sf-colLen" min="5" max="100" step="1" value="30"></div>
  <button class="calc-btn" onclick="calcSiphonic()">⚡ Hitung Preliminary Sizing</button>`;
  document.getElementById('sf-rain').addEventListener('change', function () {
    document.getElementById('sf-rain-custom-wrap').style.display = this.value === 'custom' ? 'block' : 'none';
  });
}

function calcSiphonic() {
  var A = V('sf-area');
  var rainSel = R('sf-rain').value;
  var I = rainSel === 'custom' ? V('sf-rain-custom') : parseFloat(rainSel);
  var H = V('sf-height'), nOut = V('sf-outlets'), colLen = V('sf-colLen');
  var pipeType = R('sf-pipe').value;

  // Runoff coefficient C=1.0 for impervious roof
  var C = 1.0;
  // Q = C × I × A / 3600 (L/s)
  var Qtotal = C * I * A / 3600;
  var Qperout = Qtotal / nOut;
  var Qm3s = Qtotal / 1000;

  // Siphonic target velocity: 3.0 m/s for collecting, 4.0 m/s for downpipe
  var vCol = 3.0, vDown = 4.0;

  // Collecting pipe diameter: D = sqrt(4Q / πv) × 1000
  var DcolCalc = Math.sqrt(4 * Qm3s / (Math.PI * vCol)) * 1000;
  // Downpipe diameter
  var DdnCalc = Math.sqrt(4 * Qm3s / (Math.PI * vDown)) * 1000;

  // PVC JIS and HDPE standard sizes (OD mm)
  var pvcSizes = [40, 50, 65, 75, 100, 125, 150, 200, 250, 300];
  var hdpeSizes = [50, 63, 75, 90, 110, 160, 200, 250, 315];
  var sizes = pipeType === 'vp' ? pvcSizes : hdpeSizes;

  // Approximate ID ratio based on material and PN
  var idRatio = pipeType === 'hdpe8' ? 0.90 : 0.88;

  var DcolOD = sizes.find(s => s * idRatio >= DcolCalc) || sizes[sizes.length - 1];
  var DdnOD = sizes.find(s => s * idRatio >= DdnCalc) || sizes[sizes.length - 1];
  var DcolID = DcolOD * idRatio;
  var DdnID = DdnOD * idRatio;

  // Actual velocities
  var vColAct = (4 * Qm3s / (Math.PI * Math.pow(DcolID / 1000, 2))).toFixed(2);
  var vDnAct = (4 * Qm3s / (Math.PI * Math.pow(DdnID / 1000, 2))).toFixed(2);

  // Head loss estimation (simplified Darcy-Weisbach)
  // f ≈ 0.02 for PVC (smooth pipe), k = 0.007mm
  var f = 0.02;
  var hfCol = f * (colLen / (DcolID / 1000)) * Math.pow(parseFloat(vColAct), 2) / (2 * 9.81);
  var hfDown = f * (H / (DdnID / 1000)) * Math.pow(parseFloat(vDnAct), 2) / (2 * 9.81);
  // Minor losses: ~30% of friction losses for siphonic systems
  var hMinor = (hfCol + hfDown) * 0.3;
  // Outlet loss: ~0.5 m per outlet head loss (typical siphonic outlet)
  var hOutlet = 0.5;
  var hTotal = hfCol + hfDown + hMinor + hOutlet;
  var headOK = H > hTotal;
  var headMargin = H - hTotal;

  // Velocity checks
  var vColWarn = parseFloat(vColAct) < 1.0 || parseFloat(vColAct) > 6.0;
  var vDnWarn = parseFloat(vDnAct) < 2.2 || parseFloat(vDnAct) > 6.0;

  // Number of downpipes recommendation
  var nDown = Qtotal > 25 ? Math.ceil(Qtotal / 25) : 1;
  // Max area per outlet (typical: 200-350 m² per outlet)
  var areaPerOut = A / nOut;
  var outletWarn = areaPerOut > 350;

  var pipeName = pipeType === 'vp' ? 'PVC JIS VP/AW PN 10' : (pipeType === 'hdpe10' ? 'HDPE PN 10' : 'HDPE PN 8');

  R('rec-results').innerHTML = `
  <div class="result-sec"><div class="result-sec-title">🌧️ Debit Air Hujan — ${A.toLocaleString()} m² atap</div><div class="result-grid">
  <div class="result-item"><div class="rk">Debit Total (Q)</div><div class="rv">${Qtotal.toFixed(2)}<span class="ru"> L/s</span></div></div>
  <div class="result-item"><div class="rk">Debit per Outlet</div><div class="rv">${Qperout.toFixed(2)}<span class="ru"> L/s</span></div></div>
  <div class="result-item"><div class="rk">Intensitas Hujan</div><div class="rv">${I}<span class="ru"> mm/jam</span></div></div>
  <div class="result-item"><div class="rk">Jumlah Outlet</div><div class="rv">${nOut}<span class="ru"> titik</span></div></div></div></div>

  <div class="result-sec"><div class="result-sec-title">🔧 Dimensi Pipa Siphonic</div><div class="result-grid">
  <div class="result-item"><div class="rk">Collecting Pipe</div><div class="rv">OD${DcolOD}<span class="ru"> mm ${pipeName.split(' ')[0]}</span></div></div>
  <div class="result-item"><div class="rk">Downpipe</div><div class="rv">OD${DdnOD}<span class="ru"> mm ${pipeName.split(' ')[0]}</span></div></div>
  <div class="result-item"><div class="rk">V. Collecting</div><div class="rv" style="color:${vColWarn ? '#ff5555' : 'var(--sys-accent)'}">${vColAct}<span class="ru"> m/s ${vColWarn ? '⚠️' : ''}</span></div></div>
  <div class="result-item"><div class="rk">V. Downpipe</div><div class="rv" style="color:${vDnWarn ? '#ff5555' : 'var(--sys-accent)'}">${vDnAct}<span class="ru"> m/s ${vDnWarn ? '⚠️' : ''}</span></div></div></div></div>

  <div class="result-sec"><div class="result-sec-title">📐 Head Loss Check</div><div class="result-grid">
  <div class="result-item"><div class="rk">Available Head</div><div class="rv">${H}<span class="ru"> m</span></div></div>
  <div class="result-item"><div class="rk">Total Head Loss</div><div class="rv" style="color:${headOK ? 'var(--sys-accent)' : '#ff5555'}">${hTotal.toFixed(2)}<span class="ru"> m</span></div></div>
  <div class="result-item"><div class="rk">Status</div><div class="rv" style="color:${headOK ? '#00ff9d' : '#ff5555'};font-size:13px">${headOK ? '✅ OK — CUKUP' : '❌ HEAD KURANG'}</div></div>
  <div class="result-item"><div class="rk">Margin</div><div class="rv" style="color:${headMargin > 2 ? '#00ff9d' : headMargin > 0 ? '#ffaa00' : '#ff5555'}">${headMargin.toFixed(2)}<span class="ru"> m</span></div></div></div></div>

  <div class="result-sec"><div class="result-sec-title">📋 Rekomendasi Sistem</div><div style="display:flex;flex-direction:column;gap:8px">
  <div class="rec-card"><div class="rec-icon">🔵</div><div class="rec-text">Material: <strong>${pipeName}</strong>. Roughness k=0.007mm. Jumlah downpipe rekomendasi: <strong>${nDown}</strong>. ${nDown > 1 ? 'Bagi collecting pipe menjadi ' + nDown + ' zona, masing-masing ke 1 downpipe.' : ''}</div></div>
  ${outletWarn ? '<div class="rec-card rec-warn"><div class="rec-icon">⚠️</div><div class="rec-text">Area per outlet <strong>' + Math.round(areaPerOut) + ' m²</strong> melebihi rekomendasi 350 m²/outlet. Tambahkan outlet untuk performa optimal.</div></div>' : ''}
  ${!headOK ? '<div class="rec-card rec-warn"><div class="rec-icon">⚠️</div><div class="rec-text"><strong>Available head tidak cukup!</strong> Perbesar diameter pipa, kurangi panjang collecting pipe, atau tambah downpipe untuk mengurangi head loss.</div></div>' : ''}
  <div class="rec-card"><div class="rec-icon">📌</div><div class="rec-text">Hasil ini bersifat <strong>preliminary sizing</strong>. Desain final WAJIB diverifikasi menggunakan software hidraulik khusus dari <strong>produsen siphonic system</strong> dan engineer berpengalaman.</div></div>
  </div></div>`;
}
