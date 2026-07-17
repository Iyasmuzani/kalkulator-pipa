// ==========================================
// KALKULATOR COLLAPSE RESISTANCE (VACUUM)
// ==========================================

function renderCalcCollapse() {
  var container = document.getElementById('eng-form');
  container.innerHTML = '<div class="form-title">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg> ' +
    'Kalkulator Collapse (Vakum)</div>' +

    '<div class="form-group"><label class="form-label">Material &amp; Kelas Pipa</label>' +
    '<select class="form-control" id="col-material" onchange="updateCollapseMaterial()">' +
    '<option value="pvco315">PVC-O Kelas 315 (E = 3150 MPa)</option>' +
    '<option value="pvco400">PVC-O Kelas 400 (E = 4000 MPa)</option>' +
    '<option value="pvco450">PVC-O Kelas 450 (E = 4500 MPa)</option>' +
    '<option value="pvco500" selected>PVC-O Kelas 500 (E = 5000 MPa)</option>' +
    '<option value="pvcu">PVC-U / uPVC (E = 3000 MPa)</option>' +
    '<option value="hdpe100">HDPE PE100 (E = 1000 MPa)</option>' +
    '<option value="custom">Custom Modulus</option>' +
    '</select></div>' +

    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">Modulus Elastisitas, E (MPa)</label>' +
    '<input type="number" class="form-control" id="col-modulus" value="5000" step="10" disabled></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Poisson\'s Ratio (\u03BD)</label>' +
    '<input type="number" class="form-control" id="col-poisson" value="0.4" step="0.01" disabled></div>' +
    '</div>' +

    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">SDR Pipa</label>' +
    '<input type="number" class="form-control" id="col-sdr" value="41" step="0.5"></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Ovalitas Awal, q (%)</label>' +
    '<input type="number" class="form-control" id="col-ovality" value="1.0" step="0.1"></div>' +
    '</div>' +

    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">Tekanan Vakum Target (bar)</label>' +
    '<input type="number" class="form-control" id="col-vacuum" value="-0.8" step="0.1"></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Safety Factor (SF)</label>' +
    '<input type="number" class="form-control" id="col-sf" value="1.5" step="0.1"></div>' +
    '</div>' +

    '<button class="calc-btn" onclick="calculateCollapse()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ' +
    'Hitung Collapse Resistance</button>';
}

function updateCollapseMaterial() {
  var mat = document.getElementById('col-material').value;
  var modInput = document.getElementById('col-modulus');
  var poiInput = document.getElementById('col-poisson');

  modInput.disabled = false;
  poiInput.disabled = false;

  switch(mat) {
    case 'pvco315': modInput.value = 3150; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco400': modInput.value = 4000; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco450': modInput.value = 4500; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvco500': modInput.value = 5000; poiInput.value = 0.4; modInput.disabled = true; poiInput.disabled = true; break;
    case 'pvcu':    modInput.value = 3000; poiInput.value = 0.38; modInput.disabled = true; poiInput.disabled = true; break;
    case 'hdpe100': modInput.value = 1000; poiInput.value = 0.45; modInput.disabled = true; poiInput.disabled = true; break;
    case 'custom':
      modInput.disabled = false;
      poiInput.disabled = false;
      break;
  }
}

function calculateCollapse() {
  var E_val = parseFloat(document.getElementById('col-modulus').value);
  var v = parseFloat(document.getElementById('col-poisson').value);
  var SDR = parseFloat(document.getElementById('col-sdr').value);
  var q = parseFloat(document.getElementById('col-ovality').value);
  var targetVac = parseFloat(document.getElementById('col-vacuum').value);
  var SF = parseFloat(document.getElementById('col-sf').value);

  if (!E_val || !v || !SDR || isNaN(q) || isNaN(targetVac) || !SF) {
    alert("Mohon lengkapi semua input dengan nilai numerik yang valid.");
    return;
  }

  if (targetVac > 0) {
    targetVac = -targetVac;
    document.getElementById('col-vacuum').value = targetVac;
  }

  // Ovality reduction factor (Timoshenko)
  var q_dec = q / 100;
  var Co = Math.pow((1 - q_dec) / Math.pow(1 + q_dec, 2), 3);

  // Critical Buckling Pressure: Pc = [2E / (1 - v^2)] * [1/(SDR-1)]^3 * Co
  var term1 = (2 * E_val) / (1 - Math.pow(v, 2));
  var term2 = Math.pow(1 / (SDR - 1), 3);
  var Pc_MPa = term1 * term2 * Co;
  var Pc_bar = Pc_MPa * 10; // 1 MPa = 10 bar

  // Allowable pressure
  var Pa_bar = Pc_bar / SF;

  // Determine status
  var statusHtml = '';
  if (Math.abs(targetVac) <= Pa_bar) {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(0,230,118,.3);background:rgba(0,230,118,.05);color:#00e676;margin-bottom:12px;">' +
      '<strong>\u2705 AMAN (TIDAK BUCKLING)</strong><br>Tekanan vakum target (' + targetVac + ' bar) masih dalam batas tekanan aman yang diizinkan (' + (-Pa_bar).toFixed(3) + ' bar).</div>';
  } else if (Math.abs(targetVac) <= Pc_bar) {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(255,193,7,.4);background:rgba(255,193,7,.05);color:#ffc107;margin-bottom:12px;">' +
      '<strong>\u26A0\uFE0F PERINGATAN (DI BAWAH SAFETY FACTOR)</strong><br>Pipa tidak akan kolaps secara teori, namun batas keamanan (SF ' + SF + ') terlanggar.</div>';
  } else {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(255,82,82,.4);background:rgba(255,82,82,.05);color:#ff5252;margin-bottom:12px;">' +
      '<strong>\u274C TIDAK AMAN (KOLAPS / BUCKLING)</strong><br>Tekanan vakum target melebihi batas kritis (' + (-Pc_bar).toFixed(3) + ' bar). Pipa akan penyok/kolaps!</div>';
  }

  var html = '<div class="eng-section"><div class="eng-section-title">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg> ' +
    'Hasil Analisis Buckling</div>' +

    refBadges(['ISO 16422-2', 'Timoshenko / Levy']) +

    statusHtml +

    '<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">' +
    'P<sub>c</sub> = [2E / (1 - \u03BD\u00B2)] \u00D7 [1 / (SDR - 1)]\u00B3 \u00D7 C<sub>o</sub></div>' +

    '<div class="result-grid">' +
    '<div class="result-item"><div class="rk">Modulus Elastisitas (E)</div><div class="rv">' + E_val + '<span class="ru"> MPa</span></div></div>' +
    '<div class="result-item"><div class="rk">Poisson\'s Ratio (\u03BD)</div><div class="rv">' + v + '</div></div>' +
    '<div class="result-item"><div class="rk">SDR Pipa</div><div class="rv">' + SDR + '</div></div>' +
    '<div class="result-item"><div class="rk">Faktor Koreksi Ovalitas (C<sub>o</sub>)</div><div class="rv">' + Co.toFixed(4) + '<span class="ru"> (q=' + q + '%)</span></div></div>' +
    '<div class="result-item"><div class="rk">Critical Buckling (P<sub>c</sub>)</div><div class="rv" style="color:var(--text)">' + (-Pc_bar).toFixed(3) + '<span class="ru"> bar</span></div></div>' +
    '<div class="result-item"><div class="rk">Allowable Vacuum (P<sub>a</sub>)</div><div class="rv" style="color:#00e5ff">' + (-Pa_bar).toFixed(3) + '<span class="ru"> bar</span></div></div>' +
    '</div>' +

    '<div style="margin-top:16px;font-size:12px;color:var(--text2);line-height:1.5;">' +
    '<em>Catatan: Perhitungan ini berlaku untuk pipa unconstrained (di atas tanah/dalam air). ' +
    'Untuk pipa yang ditanam dalam tanah (buried), dukungan modulus reaksi tanah (E\') akan secara signifikan meningkatkan ketahanan pipa terhadap buckling.</em></div>' +
    '</div>';

  document.getElementById('eng-results').innerHTML = html;
  if (typeof animateValues === 'function') animateValues();
}
