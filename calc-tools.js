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
      {v:'ambient', l:'< 45°C (Ambient)'},
      {v:'warm', l:'45°C – 70°C'},
      {v:'hot', l:'70°C – 95°C'},
    ]},
    { id:'pres', label:'Tekanan Operasi', options:[
      {v:'gravity', l:'Non-tekanan (Gravitasi)'},
      {v:'low', l:'≤ PN 10 (10 bar)'},
      {v:'med', l:'PN 10 – PN 16'},
      {v:'high', l:'PN 16 – PN 25'},
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
      {v:'fusion', l:'Butt Fusion / Electrofusion'},
      {v:'socket', l:'Socket Fusion (Heat)'},
      {v:'mechanical', l:'Mekanikal (Flange/Compression)'},
    ]},
    { id:'ground', label:'Kondisi Instalasi', options:[
      {v:'above', l:'Di Atas Tanah / Dalam Gedung'},
      {v:'buried', l:'Tertanam dalam Tanah'},
      {v:'trenchless', l:'Trenchless (HDD/Pipe Jacking)'},
      {v:'submerged', l:'Terendam Air / Bawah Laut'},
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
  const app=g('app'), temp=g('temp'), pres=g('pres'), size=g('size'), join=g('join'), ground=g('ground');

  // Scoring system
  const scores = {hdpe:0, pvc:0, pvco:0, ppr:0};
  const notes = {hdpe:[], pvc:[], pvco:[], ppr:[]};

  // Application
  if (app==='air_minum') { scores.hdpe+=3; scores.pvc+=3; scores.pvco+=3; scores.ppr+=1; }
  if (app==='air_panas') { scores.ppr+=5; notes.ppr.push('PPR adalah pilihan utama untuk air panas'); scores.hdpe-=2; scores.pvc-=3; scores.pvco-=3; }
  if (app==='drainase') { scores.pvc+=4; scores.hdpe+=2; notes.pvc.push('PVC dominan untuk drainase gedung'); }
  if (app==='irigasi') { scores.pvc+=3; scores.hdpe+=3; scores.pvco+=2; }
  if (app==='tambang') { scores.hdpe+=5; notes.hdpe.push('HDPE unggul untuk tambang (fleksibel, tahan abrasi, tahan kimia)'); scores.pvc-=1; }
  if (app==='gas') { scores.hdpe+=4; notes.hdpe.push('HDPE PE100 standar untuk jaringan gas'); scores.pvc-=2; scores.pvco-=1; }

  // Temperature
  if (temp==='ambient') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=2; scores.ppr+=2; }
  if (temp==='warm') { scores.ppr+=3; scores.hdpe+=1; scores.pvc-=2; scores.pvco-=2; notes.pvc.push('PVC tidak direkomendasikan > 45°C'); }
  if (temp==='hot') { scores.ppr+=4; scores.hdpe-=1; scores.pvc-=5; scores.pvco-=5; notes.ppr.push('PPR tahan hingga 95°C'); }

  // Pressure
  if (pres==='gravity') { scores.pvc+=3; scores.hdpe+=1; }
  if (pres==='low') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=2; scores.ppr+=2; }
  if (pres==='med') { scores.hdpe+=3; scores.pvco+=3; scores.ppr+=2; scores.pvc+=1; }
  if (pres==='high') { scores.hdpe+=3; scores.pvco+=4; notes.pvco.push('PVC-O unggul pada tekanan tinggi dengan dinding tipis'); scores.pvc-=1; }
  if (pres==='vhigh') { scores.hdpe+=2; scores.pvco+=3; scores.pvc-=3; }

  // Size
  if (size==='small') { scores.ppr+=2; scores.pvc+=2; scores.hdpe+=1; }
  if (size==='medium') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=2; }
  if (size==='large') { scores.hdpe+=3; scores.pvco+=3; notes.pvco.push('PVC-O efisien untuk diameter besar'); scores.ppr-=2; }
  if (size==='vlarge') { scores.hdpe+=4; notes.hdpe.push('HDPE tersedia hingga DN2000'); scores.ppr-=3; scores.pvco-=1; }

  // Jointing
  if (join==='solvent') { scores.pvc+=3; scores.pvco+=1; scores.hdpe-=2; scores.ppr-=2; }
  if (join==='fusion') { scores.hdpe+=3; notes.hdpe.push('Butt fusion menghasilkan sambungan monolitik'); scores.pvc-=2; }
  if (join==='socket') { scores.ppr+=3; scores.hdpe+=1; scores.pvc-=1; }
  if (join==='mechanical') { scores.hdpe+=1; scores.pvc+=1; scores.pvco+=1; scores.ppr+=1; }

  // Ground condition
  if (ground==='above') { scores.ppr+=2; scores.pvc+=1; }
  if (ground==='buried') { scores.hdpe+=2; scores.pvc+=2; scores.pvco+=3; }
  if (ground==='trenchless') { scores.hdpe+=5; notes.hdpe.push('HDPE ideal untuk HDD — fleksibel dan sambungan leak-free'); scores.pvc-=3; scores.ppr-=3; }
  if (ground==='submerged') { scores.hdpe+=4; notes.hdpe.push('HDPE tahan korosi dan ringan untuk aplikasi terendam'); scores.pvc+=1; }

  // Sort results
  const matInfo = {
    hdpe: {name:'HDPE (PE100)', color:'#00bcd4', snr:'SNI 4829:2015 / ISO 4427:2019', pros:['Fleksibel & tahan impak','Sambungan leak-free (fusion)','Tahan korosi & kimia','Tersedia DN20–DN2000','Cocok untuk HDD/trenchless'], cons:['Perlu mesin fusion','Koefisien muai besar','Tidak tahan UV tanpa proteksi']},
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
