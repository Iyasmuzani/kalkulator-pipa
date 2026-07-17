// ==========================================
// KALKULATOR COLLAPSE RESISTANCE (VACUUM)
// ==========================================

function renderCalcCollapse() {
  const container = document.getElementById('calc-form');
  container.innerHTML = `
    <div style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:var(--text);margin-bottom:8px">Kalkulator Collapse Resistance (Vakum)</div>
    <div style="color:var(--text2);margin-bottom:24px;line-height:1.5">
      Menghitung tekanan kritis (collapse/buckling pressure) untuk pipa unconstrained akibat tekanan vakum/negatif, 
      berdasarkan persamaan Levy/Timoshenko dan standar ISO 16422 untuk PVC-O.
    </div>

    <!-- PARAMETER MATERIAL -->
    <div class="input-group">
      <label>Material & Kelas Pipa</label>
      <select id="col-material" onchange="updateCollapseMaterial()">
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
      <div class="input-group" style="flex:1">
        <label>Modulus Elastisitas, E (MPa)</label>
        <input type="number" id="col-modulus" value="5000" step="10" disabled>
      </div>
      <div class="input-group" style="flex:1">
        <label>Poisson's Ratio (ν)</label>
        <input type="number" id="col-poisson" value="0.4" step="0.01" disabled>
      </div>
    </div>

    <!-- PARAMETER PIPA -->
    <div style="display:flex;gap:16px">
      <div class="input-group" style="flex:1">
        <label>Standard Dimension Ratio (SDR)</label>
        <input type="number" id="col-sdr" value="41" step="0.5">
      </div>
      <div class="input-group" style="flex:1">
        <label>Ovalitas Awal, q (%)</label>
        <input type="number" id="col-ovality" value="1.0" step="0.1" placeholder="Contoh: 1.0">
      </div>
    </div>

    <!-- PARAMETER OPERASIONAL -->
    <div style="display:flex;gap:16px">
      <div class="input-group" style="flex:1">
        <label>Target Tekanan Vakum (bar)</label>
        <input type="number" id="col-vacuum" value="-0.8" step="0.1">
        <div style="font-size:12px;color:var(--text2);margin-top:4px">Tekanan operasional negatif (misal: -0.8)</div>
      </div>
      <div class="input-group" style="flex:1">
        <label>Safety Factor (SF)</label>
        <input type="number" id="col-sf" value="1.5" step="0.1">
      </div>
    </div>

    <button class="btn btn-primary" onclick="calculateCollapse()" style="width:100%;margin-top:8px">Hitung Collapse Resistance</button>

    <!-- HASIL PERHITUNGAN -->
    <div id="col-result" class="result-box" style="display:none;margin-top:24px">
      <div style="font-weight:700;margin-bottom:16px;color:var(--primary);font-size:18px">Hasil Analisis Buckling</div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div style="background:var(--bg2);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Critical Buckling Pressure (P<sub>c</sub>)</div>
          <div style="font-size:24px;font-weight:700;color:var(--text)" id="res-pc">-</div>
        </div>
        <div style="background:var(--bg2);padding:16px;border-radius:8px">
          <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Allowable Vacuum Pressure (P<sub>a</sub>)</div>
          <div style="font-size:24px;font-weight:700;color:var(--text)" id="res-pa">-</div>
        </div>
      </div>

      <div id="res-status" style="padding:16px;border-radius:8px;font-weight:700;text-align:center;font-size:18px"></div>
      
      <div style="margin-top:16px;font-size:13px;color:var(--text2);line-height:1.6;padding:12px;background:var(--bg2);border-radius:8px">
        <strong>Faktor Koreksi Ovalitas (C<sub>o</sub>):</strong> <span id="res-co"></span><br>
        <em>Catatan: Perhitungan ini berlaku untuk pipa unconstrained (di atas tanah/dalam air). Untuk pipa yang ditanam dalam tanah (buried), dukungan tanah (soil modulus) akan secara signifikan meningkatkan ketahanan terhadap buckling.</em>
      </div>
    </div>
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
    // Convert positive value to negative if user entered positive vacuum
    targetVac = -targetVac;
    document.getElementById('col-vacuum').value = targetVac;
  }

  // Ovality reduction factor calculation
  // Let's use the standard Timoshenko derived ovality factor:
  const q_dec = q / 100;
  const Co = Math.pow( (1 - q_dec) / Math.pow(1 + q_dec, 2), 3 );

  // Critical Buckling Pressure (Timoshenko)
  // Pc = [ 2 * E / (1 - v^2) ] * [ 1 / (SDR - 1) ]^3 * Co
  const term1 = (2 * E) / (1 - Math.pow(v, 2));
  const term2 = Math.pow(1 / (SDR - 1), 3);
  const Pc_MPa = term1 * term2 * Co;
  
  // Convert MPa to bar (1 MPa = 10 bar)
  const Pc_bar = Pc_MPa * 10;
  
  // Allowable pressure
  const Pa_bar = Pc_bar / SF;

  // Display results
  document.getElementById('col-result').style.display = 'block';
  
  // Format to 3 decimal places
  document.getElementById('res-pc').textContent = "-" + Pc_bar.toFixed(3) + " bar";
  document.getElementById('res-pa').textContent = "-" + Pa_bar.toFixed(3) + " bar";
  document.getElementById('res-co').textContent = Co.toFixed(3) + ` (Dari ovalitas ${q}%)`;

  const statusEl = document.getElementById('res-status');
  // targetVac is negative, Pa_bar is positive magnitude of allowable negative pressure.
  // So absolute targetVac must be <= Pa_bar
  if (Math.abs(targetVac) <= Pa_bar) {
    statusEl.textContent = "✅ AMAN (TIDAK BUCKLING)";
    statusEl.style.backgroundColor = "rgba(0,230,118,0.1)";
    statusEl.style.color = "#00e676";
  } else if (Math.abs(targetVac) <= Pc_bar) {
    statusEl.textContent = "⚠️ PERINGATAN (DI BAWAH SAFETY FACTOR)";
    statusEl.style.backgroundColor = "rgba(255,193,7,0.1)";
    statusEl.style.color = "#ffc107";
  } else {
    statusEl.textContent = "❌ TIDAK AMAN (KOLAPS / BUCKLING)";
    statusEl.style.backgroundColor = "rgba(255,82,82,0.1)";
    statusEl.style.color = "#ff5252";
  }
}
