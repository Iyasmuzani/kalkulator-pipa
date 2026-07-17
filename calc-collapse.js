// ==========================================
// KALKULATOR COLLAPSE RESISTANCE (VACUUM)
// ==========================================

function renderCalcCollapse() {
  const container = document.getElementById('eng-form');
  container.innerHTML = `
    <div class="form-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4l3 3"></path>
      </svg> 
      Kalkulator Collapse (Vakum)
    </div>

    <!-- PARAMETER MATERIAL -->
    <div class="form-group">
      <label class="form-label">Material & Kelas Pipa</label>
      <select class="form-control" id="col-material" onchange="updateCollapseMaterial()">
        <option value="pvco315">PVC-O Kelas 315 (E = 3150 MPa)</option>
        <option value="pvco400">PVC-O Kelas 400 (E = 4000 MPa)</option>
        <option value="pvco450">PVC-O Kelas 450 (E = 4500 MPa)</option>
        <option value="pvco500" selected>PVC-O Kelas 500 (E = 5000 MPa)</option>
        <option value="pvcu">PVC-U / uPVC (E = 3000 MPa)</option>
        <option value="hdpe100">HDPE PE100 (E = 1000 MPa)</option>
        <option value="custom">Custom Modulus</option>
      </select>
    </div>

    <div style="display:flex;gap:16px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Modulus Elastisitas, E (MPa)</label>
        <input type="number" class="form-control" id="col-modulus" value="5000" step="10" disabled>
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Poisson's Ratio (ν)</label>
        <input type="number" class="form-control" id="col-poisson" value="0.4" step="0.01" disabled>
      </div>
    </div>

    <!-- PARAMETER PIPA -->
    <div style="display:flex;gap:16px">
      <div class="form-group" style="flex:1">
        <label class="form-label">SDR Pipa</label>
        <input type="number" class="form-control" id="col-sdr" value="41" step="0.5">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Ovalitas Awal, q (%)</label>
        <input type="number" class="form-control" id="col-ovality" value="1.0" step="0.1" placeholder="Contoh: 1.0">
      </div>
    </div>

    <!-- PARAMETER OPERASIONAL -->
    <div style="display:flex;gap:16px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Tekanan Vakum Target (bar)</label>
        <input type="number" class="form-control" id="col-vacuum" value="-0.8" step="0.1">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Safety Factor (SF)</label>
        <input type="number" class="form-control" id="col-sf" value="1.5" step="0.1">
      </div>
    </div>

    <button class="calc-btn" onclick="calculateCollapse()">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg> 
      Hitung Collapse Resistance
    </button>
  `;
}

function updateCollapseMaterial() {
  const mat = document.getElementById('col-material').value;
  const modInput = document.getElementById('col-modulus');
  const poiInput = document.getElementById('col-poisson');
  
  modInput.disabled = false;
  poiInput.disabled = false;

  switch(mat) {
    case 'pvco315': modInput.value = 3150; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco400': modInput.value = 4000; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco450': modInput.value = 4500; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco500': modInput.value = 5000; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvcu': modInput.value = 3000; poiInput.value = 0.38; modInput.disabled = true; poiInput.disabled = true; break;
    case 'hdpe100': modInput.value = 1000; poiInput.value = 0.45; modInput.disabled = true; poiInput.disabled = true; break;
    case 'custom': 
      modInput.disabled = false;
      poiInput.disabled = false;
      break;
  }
}

function calculateCollapse() {
  const E = parseFloat(document.getElementById('col-modulus').value);
  const v = parseFloat(document.getElementById('col-poisson').value);
  const SDR = parseFloat(document.getElementById('col-sdr').value);
  let q = parseFloat(document.getElementById('col-ovality').value);
  let targetVac = parseFloat(document.getElementById('col-vacuum').value);
  const SF = parseFloat(document.getElementById('col-sf').value);

  if (!E || !v || !SDR || isNaN(q) || isNaN(targetVac) || !SF) {
    alert("Mohon lengkapi semua input dengan nilai numerik yang valid.");
    return;
  }

  if (targetVac > 0) {
    targetVac = -targetVac;
    document.getElementById('col-vacuum').value = targetVac;
  }

  const q_dec = q / 100;
  const Co = Math.pow( (1 - q_dec) / Math.pow(1 + q_dec, 2), 3 );

  const term1 = (2 * E) / (1 - Math.pow(v, 2));
  const term2 = Math.pow(1 / (SDR - 1), 3);
  const Pc_MPa = term1 * term2 * Co;
  const Pc_bar = Pc_MPa * 10;
  
  const Pa_bar = Pc_bar / SF;

  let statusHtml = '';
  if (Math.abs(targetVac) <= Pa_bar) {
    statusHtml = \`<div class="fusion-warn" style="border-color:rgba(0,230,118,.3);background:rgba(0,230,118,.05);color:#00e676;margin-bottom:12px;">
      <strong>✅ AMAN (TIDAK BUCKLING)</strong><br>Tekanan vakum target (\${targetVac} bar) masih dalam batas tekanan aman yang diizinkan (\${-Pa_bar.toFixed(3)} bar).
    </div>\`;
  } else if (Math.abs(targetVac) <= Pc_bar) {
    statusHtml = \`<div class="fusion-warn" style="border-color:rgba(255,193,7,.4);background:rgba(255,193,7,.05);color:#ffc107;margin-bottom:12px;">
      <strong>⚠️ PERINGATAN (DI BAWAH SAFETY FACTOR)</strong><br>Pipa tidak akan kolaps secara teori, namun batas keamanan (SF \${SF}) terlanggar.
    </div>\`;
  } else {
    statusHtml = \`<div class="fusion-warn" style="border-color:rgba(255,82,82,.4);background:rgba(255,82,82,.05);color:#ff5252;margin-bottom:12px;">
      <strong>❌ TIDAK AMAN (KOLAPS / BUCKLING)</strong><br>Tekanan vakum target melebihi batas kritis (\${-Pc_bar.toFixed(3)} bar). Pipa akan penyok/kolaps!
    </div>\`;
  }

  let html = \`
  <div class="eng-section">
    <div class="eng-section-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">
        <path d="M21 16.5A8.5 8.5 0 0 0 12.5 8H3"></path><path d="M21 16.5A8.5 8.5 0 0 1 12.5 25H3"></path><path d="M21 16.5V22"></path>
      </svg> Hasil Analisis Buckling
    </div>
    
    \${statusHtml}

    <div class="result-grid">
      <div class="result-item"><div class="rk">Faktor Koreksi Ovalitas ($C_o$)</div><div class="rv">\${Co.toFixed(3)} <span class="ru">(q=\${q}%)</span></div></div>
      <div class="result-item"><div class="rk">Critical Buckling ($P_c$)</div><div class="rv" style="color:var(--text)">\${-Pc_bar.toFixed(3)}<span class="ru"> bar</span></div></div>
      <div class="result-item"><div class="rk">Allowable Vacuum ($P_a$)</div><div class="rv" style="color:#00e5ff">\${-Pa_bar.toFixed(3)}<span class="ru"> bar</span></div></div>
    </div>
    
    <div style="margin-top:16px;font-size:12px;color:var(--text2);line-height:1.5;">
      <em>Catatan: Perhitungan ini berlaku untuk pipa unconstrained (di atas tanah/dalam air). Untuk pipa yang ditanam dalam tanah (buried), dukungan modulus reaksi tanah (E') akan secara signifikan meningkatkan ketahanan pipa terhadap buckling.</em>
    </div>
  </div>\`;

  document.getElementById('eng-results').innerHTML = html;
}
