// ===== UNIT CONVERTER =====
const unitData = {
  'Tekanan': {
    units: ['bar','psi','kPa','MPa','atm','mH2O','kgf/cm²'],
    base: [1, 0.0689476, 0.01, 10, 1.01325, 0.0980665, 0.980665]
  },
  'Debit': {
    units: ['L/s','m³/h','m³/s','GPM (US)','L/min','ft³/s'],
    base: [1, 0.277778, 1000, 0.0630902, 0.0166667, 28.3168]
  },
  'Kecepatan': {
    units: ['m/s','km/h','ft/s','mph','knot'],
    base: [1, 0.277778, 0.3048, 0.44704, 0.514444]
  },
  'Panjang': {
    units: ['mm','cm','m','inch','ft','yd'],
    base: [0.001, 0.01, 1, 0.0254, 0.3048, 0.9144]
  },
  'Suhu': { units: ['°C','°F','K'], base: 'temp' },
  'Gaya/Berat': {
    units: ['N','kN','kgf','lbf','ton-f'],
    base: [1, 1000, 9.80665, 4.44822, 9806.65]
  },
  'Massa': {
    units: ['kg','gram','ton','lb','oz'],
    base: [1, 0.001, 1000, 0.453592, 0.0283495]
  }
};

function buildUnitConverterForm() {
  const cats = Object.keys(unitData);
  let opts = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  document.getElementById('eng-form').innerHTML = `
  <div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg> Unit Converter</div>
  <div class="form-group"><label class="form-label">Kategori</label><select id="uc-cat" class="form-control" onchange="ucCatChange()">${opts}</select></div>
  <div class="form-group"><label class="form-label">Dari</label><select id="uc-from" class="form-control"></select></div>
  <div class="form-group"><label class="form-label">Nilai</label><input type="number" id="uc-val" class="form-control" value="1" oninput="calcUnitConvert()"></div>
  <div class="form-group"><label class="form-label">Ke</label><select id="uc-to" class="form-control" onchange="calcUnitConvert()"></select></div>
  <button class="calc-btn" onclick="calcUnitConvert()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Konversi</button>`;
  ucCatChange();
}

function ucCatChange() {
  const cat = document.getElementById('uc-cat').value;
  const d = unitData[cat];
  const opts = d.units.map(u => `<option>${u}</option>`).join('');
  document.getElementById('uc-from').innerHTML = opts;
  document.getElementById('uc-to').innerHTML = opts;
  if (d.units.length > 1) document.getElementById('uc-to').selectedIndex = 1;
  document.getElementById('uc-from').onchange = calcUnitConvert;
  calcUnitConvert();
}

function convertTemp(val, from, to) {
  let c;
  if (from === '°C') c = val;
  else if (from === '°F') c = (val - 32) * 5/9;
  else c = val - 273.15;
  if (to === '°C') return c;
  if (to === '°F') return c * 9/5 + 32;
  return c + 273.15;
}

function calcUnitConvert() {
  const cat = document.getElementById('uc-cat').value;
  const d = unitData[cat];
  const val = parseFloat(document.getElementById('uc-val').value) || 0;
  const from = document.getElementById('uc-from').value;
  const to = document.getElementById('uc-to').value;

  let results = [];
  if (d.base === 'temp') {
    const r = convertTemp(val, from, to);
    results.push({u: to, v: r});
    d.units.filter(u => u !== from).forEach(u => {
      results.push({u, v: convertTemp(val, from, u)});
    });
  } else {
    const fi = d.units.indexOf(from), ti = d.units.indexOf(to);
    const baseVal = val * d.base[fi];
    const r = baseVal / d.base[ti];
    results.push({u: to, v: r});
    d.units.filter(u => u !== from).forEach(u => {
      const i = d.units.indexOf(u);
      results.push({u, v: baseVal / d.base[i]});
    });
  }

  const main = results[0];
  const fmt = (v) => Math.abs(v) >= 1000 ? v.toFixed(2) : (Math.abs(v) < 0.001 && v !== 0 ? v.toExponential(4) : v.toPrecision(6));

  let html = `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg> Hasil Konversi — ${cat}</div>`;
  html += `<div style="text-align:center;padding:20px 0;background:rgba(0,229,255,.05);border-radius:8px;margin-bottom:16px">`;
  html += `<div style="font-size:14px;color:var(--text2);margin-bottom:4px">${val} ${from} =</div>`;
  html += `<div style="font-size:32px;font-weight:700;color:var(--sys-accent);font-family:'JetBrains Mono',monospace">${fmt(main.v)}<span style="font-size:14px;margin-left:6px;color:var(--text2)">${main.u}</span></div></div>`;
  html += `<div class="result-grid">`;
  const unique = [];
  results.forEach(r => { if (!unique.find(x => x.u === r.u)) unique.push(r); });
  unique.forEach(r => {
    html += `<div class="result-item"><div class="rk">${r.u}</div><div class="rv" style="font-family:'JetBrains Mono',monospace">${fmt(r.v)}</div></div>`;
  });
  html += `</div></div>`;
  document.getElementById('eng-results').innerHTML = html;
}

// ===== MATERIAL SELECTION GUIDE =====
const matGuide = {
  questions: [
    { id:'app', label:'Aplikasi Utama', options:[
      {v:'air_minum', l:'Air Minum / Distribusi'},
      {v:'air_panas', l:'Air Panas & Dingin (Gedung)'},
      {v:'drainase', l:'Drainase / Air Buangan'},
      {v:'irigasi', l:'Irigasi / Pertanian'},
      {v:'tambang', l:'Pertambangan / Slurry'},
      {v:'gas', l:'Gas / Udara Bertekanan'},
    ]},
    { id:'temp', label:'Suhu Operasi Maksimum', options:[
      {v:'cold', l:'< 25°C (Air dingin normal)'},
      {v:'ambient', l:'25°C – 45°C'},
      {v:'warm', l:'45°C – 60°C'},
      {v:'hot', l:'60°C – 80°C'},
      {v:'vhot', l:'80°C – 95°C'},
    ]},
    { id:'pres', label:'Tekanan Operasi', options:[
      {v:'gravity', l:'Non-tekanan (Gravitasi)'},
      {v:'low', l:'≤ PN 6 (6 bar)'},
      {v:'pn10', l:'PN 8 – PN 10'},
      {v:'pn16', l:'PN 12.5 – PN 16'},
      {v:'pn25', l:'PN 20 – PN 25'},
      {v:'vhigh', l:'> PN 25'},
    ]},
    { id:'size', label:'Rentang Diameter', options:[
      {v:'small', l:'≤ DN 110'},
      {v:'medium', l:'DN 110 – DN 315'},
      {v:'large', l:'DN 315 – DN 630'},
      {v:'vlarge', l:'> DN 630'},
    ]},
    { id:'join', label:'Metode Sambungan Disukai', options:[
      {v:'any', l:'Fleksibel / Semua'},
      {v:'solvent', l:'Solvent Cement (Lem)'},
      {v:'rubber', l:'Rubber Ring Joint (Push-Fit)'},
      {v:'fusion', l:'Butt Fusion / Electrofusion'},
      {v:'socket', l:'Socket Fusion (Heat)'},
      {v:'mechanical', l:'Mekanikal (Flange/Compression)'},
    ]},
    { id:'ground', label:'Kondisi Instalasi', options:[
      {v:'above', l:'Di Atas Tanah / Dalam Gedung'},
      {v:'buried', l:'Tertanam dalam Tanah (galian)'},
      {v:'trenchless', l:'Trenchless (HDD/Pipe Jacking)'},
      {v:'submerged', l:'Terendam Air / Bawah Laut'},
    ]},
    { id:'terrain', label:'Kontur & Kondisi Tanah', options:[
      {v:'flat', l:'Datar / Stabil'},
      {v:'rocky', l:'Berbatu / Kasar'},
      {v:'clay', l:'Tanah Lempung Ekspansif'},
      {v:'sandy', l:'Berpasir / Berkerikil'},
      {v:'swamp', l:'Rawa / Muka Air Tinggi'},
      {v:'slope', l:'Berlereng / Berbukit'},
      {v:'seismic', l:'Zona Gempa / Rawan Gerak Tanah'},
    ]},
  ]
};

function buildMaterialGuideForm() {
  let html = `<div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Material Selection Guide</div>`;
  matGuide.questions.forEach(q => {
    html += `<div class="form-group"><label class="form-label">${q.label}</label><select id="mg-${q.id}" class="form-control">`;
    q.options.forEach(o => { html += `<option value="${o.v}">${o.l}</option>`; });
    html += `</select></div>`;
  });
  html += `<button class="calc-btn" onclick="calcMaterialGuide()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Analisis Rekomendasi</button>`;
  document.getElementById('eng-form').innerHTML = html;
}

function calcMaterialGuide() {
  const g = id => document.getElementById('mg-'+id).value;
  const app=g('app'), temp=g('temp'), pres=g('pres'), size=g('size'), join=g('join'), ground=g('ground'), terrain=g('terrain');

  // Scoring system — based on actual material capabilities
  const scores = {hdpe:0, pvc:0, pvco:0, ppr:0};
  const notes = {hdpe:[], pvc:[], pvco:[], ppr:[]};
  const warns = {hdpe:[], pvc:[], pvco:[], ppr:[]};

  // Application
  if (app==='air_minum') { scores.hdpe+=3; scores.pvc+=3; scores.pvco+=3; scores.ppr+=1; }
  if (app==='air_panas') { scores.ppr+=5; notes.ppr.push('PPR adalah pilihan utama untuk air panas'); scores.hdpe-=2; scores.pvc-=3; scores.pvco-=3; warns.pvc.push('PVC tidak cocok untuk air panas'); warns.pvco.push('PVC-O tidak cocok untuk air panas'); }
  if (app==='drainase') { scores.pvc+=4; scores.hdpe+=2; notes.pvc.push('PVC dominan untuk drainase gedung'); }
  if (app==='irigasi') { scores.pvc+=3; scores.hdpe+=3; scores.pvco+=2; }
  if (app==='tambang') { scores.hdpe+=5; notes.hdpe.push('HDPE unggul untuk tambang — fleksibel, tahan abrasi & kimia'); scores.pvc-=1; }
  if (app==='gas') { scores.hdpe+=4; notes.hdpe.push('HDPE PE100 standar untuk jaringan gas (ISO 4437)'); scores.pvc-=2; scores.pvco-=1; }

  // Temperature — actual material limits per standar:
  // HDPE PE100: maks 40°C (SNI 4829:2015)
  // PVC-U: maks 45°C (derating mulai 25°C)
  // PVC-O: maks 45°C
  // PPR: kontinu 70°C, short-term 95°C (ISO 10508)
  if (temp==='cold') { scores.hdpe+=3; scores.pvc+=3; scores.pvco+=3; scores.ppr+=2; }
  if (temp==='ambient') {
    scores.hdpe+=1; scores.pvc+=2; scores.pvco+=2; scores.ppr+=2;
    notes.pvc.push('PVC-U: derating tekanan mulai berlaku di atas 25°C');
    warns.hdpe.push('HDPE: suhu maks 40°C per SNI 4829:2015 — pastikan suhu operasi tidak melebihi batas');
  }
  if (temp==='warm') {
    scores.ppr+=5;
    scores.hdpe-=5; scores.pvc-=5; scores.pvco-=5;
    warns.hdpe.push('⚠ HDPE TIDAK BOLEH digunakan > 40°C (SNI 4829:2015)');
    warns.pvc.push('⚠ PVC-U TIDAK BOLEH digunakan > 45°C — risiko deformasi');
    warns.pvco.push('⚠ PVC-O TIDAK BOLEH digunakan > 45°C');
    notes.ppr.push('PPR mampu beroperasi kontinu pada 45–70°C');
  }
  if (temp==='hot') {
    scores.ppr+=5;
    scores.hdpe-=10; scores.pvc-=10; scores.pvco-=10;
    warns.hdpe.push('⚠ HDPE TIDAK BOLEH — maks 40°C (SNI 4829:2015)');
    warns.pvc.push('⚠ PVC-U TIDAK BOLEH — maks 45°C');
    warns.pvco.push('⚠ PVC-O TIDAK BOLEH — maks 45°C');
    notes.ppr.push('PPR dapat beroperasi kontinu hingga 70°C');
  }
  if (temp==='vhot') {
    scores.ppr+=5;
    scores.hdpe-=10; scores.pvc-=10; scores.pvco-=10;
    warns.hdpe.push('⚠ HDPE TIDAK BOLEH — maks 40°C (SNI 4829:2015)');
    warns.pvc.push('⚠ PVC-U TIDAK BOLEH — maks 45°C');
    warns.pvco.push('⚠ PVC-O TIDAK BOLEH — maks 45°C');
    notes.ppr.push('PPR tahan short-term hingga 95°C (PN berdasarkan ISO 10508)');
  }

  // Pressure — actual PN ratings:
  // PVC-U: PN 6 – PN 16 (PN 20 terbatas)
  // PVC-O: PN 12.5 – PN 25 (kelas 315–500)
  // HDPE PE100: PN 4 – PN 25 (SDR 7.4–41)
  // PPR: PN 10 – PN 25
  if (pres==='gravity') { scores.pvc+=3; scores.hdpe+=1; scores.pvco-=1; }
  if (pres==='low') { scores.hdpe+=2; scores.pvc+=3; scores.pvco+=1; scores.ppr+=2; }
  if (pres==='pn10') { scores.hdpe+=3; scores.pvc+=2; scores.pvco+=2; scores.ppr+=3; }
  if (pres==='pn16') {
    scores.hdpe+=3; scores.pvco+=4; scores.ppr+=2; scores.pvc+=1;
    notes.pvco.push('PVC-O unggul pada PN 12.5–16 — dinding lebih tipis dari PVC-U');
    notes.pvc.push('PVC-U: PN 16 tersedia namun dinding tebal, kurang efisien');
  }
  if (pres==='pn25') {
    scores.hdpe+=3; scores.pvco+=4; scores.ppr+=3;
    scores.pvc-=2;
    notes.pvco.push('PVC-O kelas 500 mampu PN 25 dengan dinding tipis');
    notes.hdpe.push('HDPE PE100 SDR 7.4 = PN 25');
    warns.pvc.push('PVC-U PN 25 sangat terbatas dan tidak umum');
  }
  if (pres==='vhigh') {
    scores.hdpe+=2; scores.pvco+=2;
    scores.pvc-=5; scores.ppr-=1;
    warns.pvc.push('⚠ PVC-U tidak tersedia > PN 20');
    notes.hdpe.push('HDPE: pertimbangkan steel-reinforced PE atau PE100-RC');
  }

  // Size
  if (size==='small') { scores.ppr+=2; scores.pvc+=2; scores.hdpe+=1; }
  if (size==='medium') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=2; }
  if (size==='large') { scores.hdpe+=3; scores.pvco+=3; notes.pvco.push('PVC-O efisien untuk diameter besar'); scores.ppr-=2; }
  if (size==='vlarge') { scores.hdpe+=4; notes.hdpe.push('HDPE tersedia hingga DN2000'); scores.ppr-=3; scores.pvco-=1; }

  // Jointing
  if (join==='solvent') { scores.pvc+=3; scores.pvco+=1; scores.hdpe-=2; scores.ppr-=2; }
  if (join==='rubber') {
    scores.pvc+=3; scores.pvco+=4; scores.hdpe+=1;
    notes.pvco.push('PVC-O dirancang optimal untuk sambungan rubber ring joint');
    notes.pvc.push('PVC-U dengan rubber ring joint — instalasi cepat tanpa alat khusus');
    notes.hdpe.push('HDPE tersedia rubber ring joint untuk diameter besar, namun fusion lebih disarankan');
    scores.ppr-=2;
  }
  if (join==='fusion') { scores.hdpe+=3; notes.hdpe.push('Butt fusion menghasilkan sambungan monolitik'); scores.pvc-=2; }
  if (join==='socket') { scores.ppr+=3; scores.hdpe+=1; scores.pvc-=1; }
  if (join==='mechanical') { scores.hdpe+=1; scores.pvc+=1; scores.pvco+=1; scores.ppr+=1; }

  // Ground condition
  if (ground==='above') { scores.ppr+=2; scores.pvc+=1; }
  if (ground==='buried') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=3; }
  if (ground==='trenchless') { scores.hdpe+=5; notes.hdpe.push('HDPE ideal untuk HDD — fleksibel dan sambungan leak-free'); scores.pvc-=3; scores.ppr-=3; warns.pvc.push('PVC-U terlalu kaku untuk trenchless'); }
  if (ground==='submerged') { scores.hdpe+=4; notes.hdpe.push('HDPE tahan korosi dan ringan untuk aplikasi terendam'); scores.pvc+=1; }

  // Terrain / Soil condition (NEW)
  if (terrain==='flat') { scores.hdpe+=1; scores.pvc+=2; scores.pvco+=2; scores.ppr+=1; }
  if (terrain==='rocky') {
    scores.hdpe+=4; scores.pvc-=2; scores.pvco-=1;
    notes.hdpe.push('HDPE fleksibel & tahan impak — ideal untuk tanah berbatu');
    warns.pvc.push('PVC-U getas — risiko retak pada tanah berbatu tanpa padding pasir');
  }
  if (terrain==='clay') {
    scores.hdpe+=4; scores.pvco+=2; scores.pvc-=1;
    notes.hdpe.push('HDPE menyerap pergerakan tanah lempung ekspansif (fleksibel)');
    notes.pvco.push('PVC-O lebih tahan impak dibanding PVC-U pada tanah lempung');
  }
  if (terrain==='sandy') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=2; scores.ppr+=1; }
  if (terrain==='swamp') {
    scores.hdpe+=4;
    notes.hdpe.push('HDPE: sambungan fusion leak-free, tahan pada muka air tinggi');
    warns.pvc.push('PVC-U: sambungan rubber ring berisiko bocor pada tanah rawa');
    scores.pvc-=1;
  }
  if (terrain==='slope') {
    scores.hdpe+=4; scores.pvco+=2;
    notes.hdpe.push('HDPE fleksibel — mampu mengikuti kontur lereng tanpa banyak fitting');
    scores.pvc-=1; scores.ppr-=2;
  }
  if (terrain==='seismic') {
    scores.hdpe+=5;
    notes.hdpe.push('HDPE unggul di zona gempa — sambungan monolitik tahan pergeseran tanah');
    warns.pvc.push('PVC-U getas — berisiko patah saat gempa');
    warns.pvco.push('PVC-O: rubber ring joint berisiko lepas saat pergeseran tanah besar');
    scores.pvc-=3; scores.pvco-=1; scores.ppr-=1;
  }

  // Sort results
  const matInfo = {
    hdpe: {name:'HDPE (PE100)', color:'#00bcd4', snr:'SNI 4829:2015 / ISO 4427:2019', pros:['Fleksibel & tahan impak','Sambungan leak-free (fusion)','Tahan korosi & kimia','Tersedia DN20–DN2000','Cocok untuk HDD/trenchless'], cons:['Suhu maks 40°C (SNI 4829:2015)','Perlu mesin fusion','Koefisien muai besar','Tidak tahan UV tanpa proteksi']},
    pvc: {name:'PVC-U', color:'#7c4dff', snr:'SNI 9324:2024 / JIS K 6741 / ISO 1452:2009', pros:['Harga ekonomis','Instalasi mudah (solvent cement)','Kaku — baik untuk gravitasi','Tahan korosi'], cons:['Getas pada suhu rendah','Tidak untuk air panas (maks 45°C)','Tidak fleksibel']},
    pvco: {name:'PVC-O', color:'#ff6d00', snr:'ISO 16422:2024 / EN 17176:2019', pros:['Kuat tarik sangat tinggi','Dinding tipis — kapasitas lebih besar','Tahan impak lebih baik dari PVC-U','Ringan dan efisien'], cons:['Ketersediaan terbatas','Hanya untuk air dingin','Diameter terbatas (DN90–DN600)']},
    ppr: {name:'PPR (PP-R)', color:'#00e676', snr:'SNI ISO 15874:2012 / ISO 15874:2013', pros:['Tahan air panas hingga 95°C','Sambungan socket fusion cepat','Tidak korosi & food grade','Umur pakai 50+ tahun'], cons:['Diameter terbatas (maks DN160)','Koefisien muai tinggi','Perlu support lebih rapat']}
  };

  const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  const maxScore = sorted[0][1];

  let html = `<div class="eng-section"><div class="eng-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Rekomendasi Material</div>`;

  sorted.forEach((item, idx) => {
    const [key, score] = item;
    const m = matInfo[key];
    const pct = Math.max(0, Math.round((score / maxScore) * 100));
    const isTop = idx === 0;
    const border = isTop ? `border:2px solid ${m.color}` : 'border:1px solid rgba(255,255,255,.06)';
    const bg = isTop ? `background:rgba(${parseInt(m.color.slice(1,3),16)},${parseInt(m.color.slice(3,5),16)},${parseInt(m.color.slice(5,7),16)},.06)` : 'background:rgba(255,255,255,.02)';

    html += `<div style="${bg};${border};border-radius:10px;padding:16px;margin-bottom:12px">`;
    html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">`;
    if (isTop) html += `<span style="background:${m.color};color:#000;font-size:9px;padding:3px 8px;border-radius:4px;font-weight:700">REKOMENDASI UTAMA</span>`;
    html += `<span style="font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:${m.color}">${m.name}</span>`;
    html += `<span style="margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text2)">${pct}%</span></div>`;

    // Progress bar
    html += `<div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-bottom:10px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${m.color};border-radius:2px;transition:width .3s"></div></div>`;

    // Standard reference
    html += `<div style="font-size:10px;color:var(--text2);margin-bottom:8px;font-family:'JetBrains Mono',monospace">${m.snr}</div>`;

    // Notes
    const n = notes[key];
    if (n.length) {
      n.forEach(note => {
        html += `<div style="font-size:11px;color:${m.color};margin-bottom:4px;display:flex;align-items:start;gap:6px"><span style="margin-top:2px">▸</span> ${note}</div>`;
      });
    }

    // Warnings
    const w = warns[key];
    if (w.length) {
      html += `<div style="margin-top:6px;padding:8px;background:rgba(255,85,85,.08);border:1px solid rgba(255,85,85,.2);border-radius:6px">`;
      w.forEach(warn => {
        html += `<div style="font-size:11px;color:#ff5555;margin-bottom:3px;display:flex;align-items:start;gap:6px"><span style="margin-top:1px">⚠</span> ${warn}</div>`;
      });
      html += `</div>`;
    }

    // Pros/Cons
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">`;
    html += `<div><div style="font-size:10px;color:var(--sys-accent);margin-bottom:4px;font-weight:600">KEUNGGULAN</div>`;
    m.pros.forEach(p => { html += `<div style="font-size:10px;color:var(--text2);margin-bottom:2px">✓ ${p}</div>`; });
    html += `</div><div><div style="font-size:10px;color:#ff5555;margin-bottom:4px;font-weight:600">KETERBATASAN</div>`;
    m.cons.forEach(c => { html += `<div style="font-size:10px;color:var(--text2);margin-bottom:2px">✗ ${c}</div>`; });
    html += `</div></div></div>`;
  });

  html += `</div>`;
  document.getElementById('eng-results').innerHTML = html;
}
