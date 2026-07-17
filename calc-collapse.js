// ==========================================
// KALKULATOR COLLAPSE RESISTANCE
// Mode: Vakum & Well Casing
// ==========================================

var collapseMode = 'vacuum'; // 'vacuum' or 'well'

function renderCalcCollapse() {
  var container = document.getElementById('eng-form');
  container.innerHTML = '<div class="form-title">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg> ' +
    'Kalkulator Collapse Resistance</div>' +

    // ===== MODE SELECTOR =====
    '<div class="form-group"><label class="form-label">Mode Aplikasi</label>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="calc-btn" id="col-mode-vacuum" onclick="switchCollapseMode(\'vacuum\')" ' +
    'style="flex:1;font-size:12px;padding:8px 12px;">Tekanan Vakum</button>' +
    '<button class="calc-btn" id="col-mode-well" onclick="switchCollapseMode(\'well\')" ' +
    'style="flex:1;font-size:12px;padding:8px 12px;opacity:0.5;">Well Casing</button>' +
    '</div></div>' +

    // ===== MATERIAL =====
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

    // ===== SDR & OVALITY =====
    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">SDR Pipa</label>' +
    '<select class="form-control" id="col-sdr">' +
    '<option value="13.6">SDR 13.6</option>' +
    '<option value="17">SDR 17</option>' +
    '<option value="21">SDR 21</option>' +
    '<option value="26">SDR 26</option>' +
    '<option value="33">SDR 33</option>' +
    '<option value="41" selected>SDR 41</option>' +
    '<option value="51">SDR 51</option>' +
    '<option value="custom_sdr">Input Manual</option>' +
    '</select></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Ovalitas Awal, q (%)</label>' +
    '<input type="number" class="form-control" id="col-ovality" value="1.0" step="0.1"></div>' +
    '</div>' +

    // ===== SDR manual (hidden by default) =====
    '<div class="form-group" id="col-sdr-manual-wrap" style="display:none">' +
    '<label class="form-label">SDR Manual</label>' +
    '<input type="number" class="form-control" id="col-sdr-manual" value="41" step="0.5"></div>' +

    // ===== VACUUM MODE INPUTS =====
    '<div id="col-vacuum-inputs">' +
    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">Tekanan Vakum Target (bar)</label>' +
    '<input type="number" class="form-control" id="col-vacuum" value="-0.8" step="0.1"></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Safety Factor (SF)</label>' +
    '<input type="number" class="form-control" id="col-sf" value="1.5" step="0.1"></div>' +
    '</div></div>' +

    // ===== WELL CASING MODE INPUTS =====
    '<div id="col-well-inputs" style="display:none">' +
    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">Kedalaman Sumur (m)</label>' +
    '<input type="number" class="form-control" id="col-depth" value="50" step="1" onchange="updateWellPressure()"></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Densitas Fluida (kg/m\u00B3)</label>' +
    '<select class="form-control" id="col-fluid" onchange="updateWellPressure()">' +
    '<option value="1000" selected>Air Bersih (1000)</option>' +
    '<option value="1025">Air Laut (1025)</option>' +
    '<option value="1100">Lumpur Bor Ringan (1100)</option>' +
    '<option value="1200">Lumpur Bor Sedang (1200)</option>' +
    '<option value="1300">Lumpur Bor Berat (1300)</option>' +
    '<option value="custom_fluid">Input Manual</option>' +
    '</select></div>' +
    '</div>' +

    '<div id="col-fluid-manual-wrap" style="display:none">' +
    '<div class="form-group"><label class="form-label">Densitas Manual (kg/m\u00B3)</label>' +
    '<input type="number" class="form-control" id="col-fluid-manual" value="1000" step="10" onchange="updateWellPressure()"></div></div>' +

    '<div style="display:flex;gap:16px">' +
    '<div class="form-group" style="flex:1"><label class="form-label">Tekanan Eksternal Hidrostatik (bar)</label>' +
    '<input type="number" class="form-control" id="col-hydro" value="4.905" step="0.01" style="color:#00e5ff" readonly></div>' +
    '<div class="form-group" style="flex:1"><label class="form-label">Safety Factor (SF)</label>' +
    '<input type="number" class="form-control" id="col-sf-well" value="2.0" step="0.1"></div>' +
    '</div>' +

    '<div class="form-group"><label class="form-label">Kondisi Pipa Saat Pemasangan</label>' +
    '<select class="form-control" id="col-condition">' +
    '<option value="empty" selected>Pipa Kosong (Worst Case)</option>' +
    '<option value="partial">Terisi Sebagian Air</option>' +
    '</select></div>' +

    '<div id="col-partial-wrap" style="display:none">' +
    '<div class="form-group"><label class="form-label">Level Air di Dalam Pipa (m dari dasar)</label>' +
    '<input type="number" class="form-control" id="col-internal-level" value="10" step="1" onchange="updateWellPressure()"></div></div>' +
    '</div>' +

    // ===== BUTTON =====
    '<button class="calc-btn" onclick="calculateCollapse()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ' +
    'Hitung Collapse Resistance</button>';

  // Setup SDR dropdown listener
  document.getElementById('col-sdr').addEventListener('change', function() {
    var wrap = document.getElementById('col-sdr-manual-wrap');
    wrap.style.display = this.value === 'custom_sdr' ? '' : 'none';
  });

  // Setup fluid dropdown listener
  document.getElementById('col-fluid').addEventListener('change', function() {
    var wrap = document.getElementById('col-fluid-manual-wrap');
    wrap.style.display = this.value === 'custom_fluid' ? '' : 'none';
    updateWellPressure();
  });

  // Setup condition dropdown listener
  document.getElementById('col-condition').addEventListener('change', function() {
    var wrap = document.getElementById('col-partial-wrap');
    wrap.style.display = this.value === 'partial' ? '' : 'none';
    updateWellPressure();
  });

  // Set initial mode styling
  switchCollapseMode('vacuum');
}

function switchCollapseMode(mode) {
  collapseMode = mode;
  var vacBtn = document.getElementById('col-mode-vacuum');
  var wellBtn = document.getElementById('col-mode-well');
  var vacInputs = document.getElementById('col-vacuum-inputs');
  var wellInputs = document.getElementById('col-well-inputs');

  if (mode === 'vacuum') {
    vacBtn.style.opacity = '1';
    wellBtn.style.opacity = '0.5';
    vacInputs.style.display = '';
    wellInputs.style.display = 'none';
    // Default material for vacuum = PVC-O 500
    document.getElementById('col-material').value = 'pvco500';
    updateCollapseMaterial();
    document.getElementById('col-sdr').value = '41';
  } else {
    vacBtn.style.opacity = '0.5';
    wellBtn.style.opacity = '1';
    vacInputs.style.display = 'none';
    wellInputs.style.display = '';
    // Default material for well casing = PVC-U
    document.getElementById('col-material').value = 'pvcu';
    updateCollapseMaterial();
    document.getElementById('col-sdr').value = '21';
    updateWellPressure();
  }
}

function updateWellPressure() {
  var depth = parseFloat(document.getElementById('col-depth').value) || 0;
  var fluidSel = document.getElementById('col-fluid').value;
  var rho;
  if (fluidSel === 'custom_fluid') {
    rho = parseFloat(document.getElementById('col-fluid-manual').value) || 1000;
  } else {
    rho = parseFloat(fluidSel);
  }

  var condition = document.getElementById('col-condition').value;
  var internalHead = 0;
  if (condition === 'partial') {
    internalHead = parseFloat(document.getElementById('col-internal-level').value) || 0;
  }

  // P_ext = rho * g * depth (Pa) -> convert to bar (1 bar = 100000 Pa)
  var g = 9.81;
  var P_ext = (rho * g * depth) / 100000;
  var P_int = (1000 * g * internalHead) / 100000; // internal always water
  var P_net = P_ext - P_int;
  if (P_net < 0) P_net = 0;

  document.getElementById('col-hydro').value = P_net.toFixed(3);
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

function getCollapseSDR() {
  var sel = document.getElementById('col-sdr').value;
  if (sel === 'custom_sdr') {
    return parseFloat(document.getElementById('col-sdr-manual').value);
  }
  return parseFloat(sel);
}

function calculateCollapse() {
  var E_val = parseFloat(document.getElementById('col-modulus').value);
  var v = parseFloat(document.getElementById('col-poisson').value);
  var SDR = getCollapseSDR();
  var q = parseFloat(document.getElementById('col-ovality').value);
  var SF, targetPressure;

  if (collapseMode === 'vacuum') {
    targetPressure = Math.abs(parseFloat(document.getElementById('col-vacuum').value));
    SF = parseFloat(document.getElementById('col-sf').value);
  } else {
    targetPressure = parseFloat(document.getElementById('col-hydro').value);
    SF = parseFloat(document.getElementById('col-sf-well').value);
  }

  if (!E_val || !v || !SDR || isNaN(q) || isNaN(targetPressure) || !SF) {
    alert("Mohon lengkapi semua input dengan nilai numerik yang valid.");
    return;
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

  // Build status
  var statusHtml = '';
  var pressLabel = collapseMode === 'vacuum' ? 'Tekanan vakum' : 'Tekanan hidrostatik eksternal';

  if (targetPressure <= Pa_bar) {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(0,230,118,.3);background:rgba(0,230,118,.05);color:#00e676;margin-bottom:12px;">' +
      '<strong>\u2705 AMAN (TIDAK BUCKLING)</strong><br>' + pressLabel + ' (' + targetPressure.toFixed(3) + ' bar) masih dalam batas tekanan aman (' + Pa_bar.toFixed(3) + ' bar).</div>';
  } else if (targetPressure <= Pc_bar) {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(255,193,7,.4);background:rgba(255,193,7,.05);color:#ffc107;margin-bottom:12px;">' +
      '<strong>\u26A0\uFE0F PERINGATAN (DI BAWAH SAFETY FACTOR)</strong><br>Pipa tidak akan kolaps secara teori, namun batas keamanan (SF ' + SF + ') terlanggar.</div>';
  } else {
    statusHtml = '<div class="fusion-warn" style="border-color:rgba(255,82,82,.4);background:rgba(255,82,82,.05);color:#ff5252;margin-bottom:12px;">' +
      '<strong>\u274C TIDAK AMAN (KOLAPS / BUCKLING)</strong><br>' + pressLabel + ' (' + targetPressure.toFixed(3) + ' bar) melebihi batas kritis (' + Pc_bar.toFixed(3) + ' bar). Pipa akan penyok/kolaps!</div>';
  }

  // Standards badge
  var stdList = collapseMode === 'vacuum'
    ? ['ISO 16422-2', 'Timoshenko / Levy']
    : ['ASTM F480', 'Timoshenko / Levy'];

  // Build context info for well mode
  var contextHtml = '';
  if (collapseMode === 'well') {
    var depth = parseFloat(document.getElementById('col-depth').value) || 0;
    var maxSafeDepth = (Pa_bar * 100000) / (1000 * 9.81);

    contextHtml = '<div class="result-grid" style="margin-top:12px">' +
      '<div class="result-item"><div class="rk">Kedalaman Sumur</div><div class="rv">' + depth + '<span class="ru"> m</span></div></div>' +
      '<div class="result-item"><div class="rk">Kedalaman Aman Maks (SF ' + SF + ')</div><div class="rv" style="color:#00e5ff">' + maxSafeDepth.toFixed(1) + '<span class="ru"> m</span></div></div>' +
      '</div>';
  }

  // Note text
  var noteHtml = '';
  if (collapseMode === 'vacuum') {
    noteHtml = '<em>Catatan: Perhitungan ini berlaku untuk pipa unconstrained (di atas tanah/dalam air). ' +
      'Untuk pipa yang ditanam dalam tanah (buried), dukungan modulus reaksi tanah (E\') akan secara signifikan meningkatkan ketahanan pipa terhadap buckling.</em>';
  } else {
    noteHtml = '<em>Catatan: Perhitungan ini mengasumsikan pipa casing unconstrained (tanpa dukungan dinding bor / grout). ' +
      'Pada kondisi aktual, dinding borehole dan sementasi (grouting) memberikan dukungan parsial yang meningkatkan ketahanan kolaps. ' +
      'Hasil ini konservatif (worst case). Pastikan pipa casing memenuhi standar ASTM F480 untuk aplikasi sumur.</em>';
  }

  var html = '<div class="eng-section"><div class="eng-section-title">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' +
    '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg> ' +
    'Hasil Analisis Buckling' +
    (collapseMode === 'well' ? ' (Well Casing)' : ' (Vakum)') +
    '</div>' +

    refBadges(stdList) +

    statusHtml +

    '<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed;margin-bottom:12px;font-family:monospace">' +
    'P<sub>c</sub> = [2E / (1 - \u03BD\u00B2)] \u00D7 [1 / (SDR - 1)]\u00B3 \u00D7 C<sub>o</sub></div>' +

    '<div class="result-grid">' +
    '<div class="result-item"><div class="rk">Modulus Elastisitas (E)</div><div class="rv">' + E_val + '<span class="ru"> MPa</span></div></div>' +
    '<div class="result-item"><div class="rk">Poisson\'s Ratio (\u03BD)</div><div class="rv">' + v + '</div></div>' +
    '<div class="result-item"><div class="rk">SDR Pipa</div><div class="rv">' + SDR + '</div></div>' +
    '<div class="result-item"><div class="rk">Faktor Koreksi Ovalitas (C<sub>o</sub>)</div><div class="rv">' + Co.toFixed(4) + '<span class="ru"> (q=' + q + '%)</span></div></div>' +
    '<div class="result-item"><div class="rk">Critical Buckling (P<sub>c</sub>)</div><div class="rv" style="color:var(--text)">' + Pc_bar.toFixed(3) + '<span class="ru"> bar</span></div></div>' +
    '<div class="result-item"><div class="rk">Allowable Pressure (P<sub>a</sub>)</div><div class="rv" style="color:#00e5ff">' + Pa_bar.toFixed(3) + '<span class="ru"> bar</span></div></div>' +
    '</div>' +

    contextHtml +

    '<div style="margin-top:16px;font-size:12px;color:var(--text2);line-height:1.5;">' +
    noteHtml + '</div>' +
    '</div>';

  document.getElementById('eng-results').innerHTML = html;
  if (typeof animateValues === 'function') animateValues();
}
