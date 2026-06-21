// ==================== TECHNICAL REFERENCE SYSTEM ====================
// Implements Recommendations #1-#4: Cross-refs, Tooltips, Ref Tables, Smart Warnings

// ===== HELPER: SVG Icons =====
var _refIco = {
  book: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  warn: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  table: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>'
};

// ===== #1: CROSS-REFERENCE BADGES =====
function refBadges(refs) {
  if (!refs || !refs.length) return '';
  return '<div class="ref-badges">' + refs.map(function(r) {
    return '<span class="ref-badge">' + _refIco.book + ' ' + r + '</span>';
  }).join('') + '</div>';
}

// ===== #2: INFO TOOLTIP HELPER =====
function infoTip(text) {
  return '<span class="info-tip" data-tip="' + text.replace(/"/g, '&quot;') + '">?</span>';
}

// ===== #3: COLLAPSIBLE REFERENCE TABLE =====
var _refPanelCounter = 0;
function refPanel(title, headers, rows) {
  var id = 'ref-panel-' + (++_refPanelCounter);
  var html = '<div class="ref-panel-toggle" onclick="toggleRefPanel(\'' + id + '\',this)">';
  html += _refIco.table + ' ' + title + '<span class="ref-chevron">⌄</span></div>';
  html += '<div class="ref-panel" id="' + id + '"><table class="ref-table"><tr>';
  headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
  html += '</tr>';
  rows.forEach(function(row) {
    html += '<tr>';
    row.forEach(function(cell) { html += '<td>' + cell + '</td>'; });
    html += '</tr>';
  });
  html += '</table></div>';
  return html;
}

function toggleRefPanel(id, btn) {
  var panel = document.getElementById(id);
  if (!panel) return;
  var isOpen = panel.classList.contains('open');
  panel.classList.toggle('open');
  if (btn) btn.classList.toggle('open');
}

// ===== #4: SMART WARNING HELPER =====
function smartWarn(level, msg, ref) {
  var icons = {
    ok: _refIco.check,
    info: _refIco.info,
    caution: _refIco.warn,
    danger: _refIco.warn
  };
  return '<div class="smart-warn smart-warn-' + level + '">' +
    (icons[level] || _refIco.info) +
    '<div>' + msg + (ref ? '<span class="warn-ref">' + _refIco.book + ' ' + ref + '</span>' : '') + '</div></div>';
}

// ===== VELOCITY WARNINGS =====
function velocityWarnings(v, context) {
  var html = '';
  if (context === 'pressure') {
    if (v > 3.0) {
      html += smartWarn('danger',
        'Kecepatan ' + v.toFixed(2) + ' m/s <strong>melebihi batas desain 3.0 m/s</strong> — risiko erosional velocity dan water hammer signifikan.',
        'AWWA M55 §5.4: Maks kecepatan desain 3.0 m/s | PPI Handbook Ch.6');
    } else if (v > 2.5) {
      html += smartWarn('caution',
        'Kecepatan ' + v.toFixed(2) + ' m/s — mendekati batas atas. Pertimbangkan diameter lebih besar untuk mengurangi risiko water hammer.',
        'PPI Handbook Ch.6: Kecepatan disarankan 0.6–1.5 m/s');
    } else if (v < 0.3) {
      html += smartWarn('caution',
        'Kecepatan ' + v.toFixed(2) + ' m/s — <strong>risiko sedimentasi dan biofilm</strong>. Pertimbangkan diameter lebih kecil.',
        'BS EN 805:2025 §8.3: Min kecepatan self-cleaning 0.5 m/s');
    } else if (v < 0.5) {
      html += smartWarn('caution',
        'Kecepatan ' + v.toFixed(2) + ' m/s — di bawah kecepatan self-cleaning minimum. Potensi sedimentasi pada jaringan distribusi.',
        'BS EN 805:2025 §8.3: Min 0.5 m/s untuk self-cleaning');
    } else if (v >= 0.6 && v <= 1.5) {
      html += smartWarn('ok',
        'Kecepatan ' + v.toFixed(2) + ' m/s — berada dalam <strong>rentang optimal desain</strong>.',
        'PPI Handbook Ch.6 | AWWA M55: Kecepatan optimal 0.6–1.5 m/s');
    }
  } else if (context === 'mining') {
    if (v > 4.5) {
      html += smartWarn('danger',
        'Kecepatan ' + v.toFixed(2) + ' m/s — melebihi <strong>batas erosional velocity</strong>.',
        'ASME B31.3: Maks erosional velocity 4.5 m/s');
    }
  }
  return html;
}

// ===== DEFLECTION WARNINGS =====
function deflectionWarnings(deflPct, sdr, type) {
  var html = '';
  
  if (type === 'hdpe' && sdr) {
    var maxDefl = 5;
    if (sdr >= 21) maxDefl = 7.5;
    else if (sdr >= 13.5) maxDefl = 6.0;
    else if (sdr >= 11) maxDefl = 5.0;
    else if (sdr >= 9) maxDefl = 4.0;
    else maxDefl = 3.0;

    if (deflPct > maxDefl) {
      html += smartWarn('danger',
        'Defleksi ' + deflPct.toFixed(2) + '% <strong>melebihi batas aman ' + maxDefl.toFixed(1) + '% untuk SDR ' + sdr + '!</strong> Desain tidak aman. Harus redesign: gunakan SDR lebih rendah atau perbaiki bedding.',
        'AWWA M55 Table 5-11: Batas defleksi pipa tekanan HDPE SDR ' + sdr + ' = ' + maxDefl.toFixed(1) + '%');
    } else if (deflPct > maxDefl * 0.8) {
      html += smartWarn('caution',
        'Defleksi ' + deflPct.toFixed(2) + '% — mendekati batas maksimal ' + maxDefl.toFixed(1) + '%. Pastikan tanah urug dipadatkan dengan baik.',
        'AWWA M55 Table 5-11: Batas defleksi SDR ' + sdr + ' = ' + maxDefl.toFixed(1) + '%');
    } else if (deflPct > 0) {
      html += smartWarn('ok',
        'Defleksi ' + deflPct.toFixed(2) + '% — <strong>aman</strong>, di bawah batas ' + maxDefl.toFixed(1) + '%.',
        'AWWA M55 Table 5-11: Batas defleksi SDR ' + sdr + ' = ' + maxDefl.toFixed(1) + '%');
    }
  } else {
    if (deflPct > 7.5) {
      html += smartWarn('danger',
        'Defleksi ' + deflPct.toFixed(2) + '% <strong>JAUH melebihi batas!</strong> Desain tidak aman. Harus redesign: gunakan SDR lebih kuat atau perbaiki bedding.',
        'AWWA M23 §4.5: Batas defleksi maks 7.5% (tanpa liner)');
    } else if (deflPct > 5) {
      html += smartWarn('caution',
        'Defleksi ' + deflPct.toFixed(2) + '% — melebihi batas aman 5%. Perbaiki tanah urug (E\' lebih besar) dan/atau padatkan >90% Proctor.',
        'AWWA M23 §4.5: Batas defleksi 5% (dengan liner) | ASTM D3034');
    } else if (deflPct <= 5 && deflPct > 0) {
      html += smartWarn('ok',
        'Defleksi ' + deflPct.toFixed(2) + '% — <strong>aman</strong>, di bawah batas 5%.',
        'AWWA M23 §4.5 | ISO 21138-2: Defleksi maks 5%');
    }
  }
  return html;
}

// ===== WATER HAMMER WARNINGS =====
function waterHammerWarnings(Ptotal, Pw, dPbar, mat) {
  var html = '';
  var ratio = Ptotal / Pw;
  if (ratio > 2.0) {
    html += smartWarn('danger',
      'Surge pressure ' + dPbar.toFixed(2) + ' bar — tekanan total ' + Ptotal.toFixed(2) + ' bar <strong>melebihi 2× tekanan kerja!</strong> Wajib pasang surge protection.',
      'ISO 4427-5:2019 §6.2: Ptotal ≤ 1.5×MOP | AWWA M55 Ch.7');
  } else if (ratio > 1.5) {
    html += smartWarn('caution',
      'Surge pressure signifikan — tekanan total ' + Ptotal.toFixed(2) + ' bar. Pasang surge anticipator, air valve, atau slow-closing valve.',
      'ISO 4427-5:2019 §6.2: Occasional surge ≤ 1.5× MOP');
  } else {
    html += smartWarn('ok',
      'Surge pressure ' + dPbar.toFixed(2) + ' bar — tekanan total ' + Ptotal.toFixed(2) + ' bar, <strong>dalam batas aman</strong>.',
      'ISO 4427-5:2019 §6.2 | AWWA M55 Ch.7');
  }
  if (mat === 'hdpe') {
    html += smartWarn('info',
      'HDPE memiliki elastisitas tinggi (E = 0.8 GPa) — wave celerity lebih rendah dan meredam water hammer lebih baik dibanding pipa kaku.',
      'PPI Handbook Ch.6 §6.5 | AWWA M55 §7.3');
  }
  return html;
}

// ===== REFERENCE TABLE DATA =====
var REF_TABLES = {
  cFactor: {
    title: 'Tabel Referensi C-Factor (Hazen-Williams)',
    headers: ['Material', 'C (Baru)', 'C (10 thn)', 'C (20 thn)', 'Sumber'],
    rows: [
      ['HDPE PE100', '150', '150', '145–150', 'PPI Handbook Ch.6'],
      ['PVC-U / PVC-O', '150', '148', '145', 'Uni-Bell Handbook §4.3'],
      ['PPR', '140', '138', '135', 'ISO 15874'],
      ['Ductile Iron (lined)', '140', '130', '120', 'AWWA M41'],
      ['Baja Galvanis', '120', '100', '80–90', 'ASME B31.1'],
      ['Beton', '120', '110', '100', 'ASCE Manual 37'],
    ]
  },
  roughness: {
    title: 'Tabel Kekasaran Absolut ε (Colebrook-White)',
    headers: ['Material', 'ε (mm)', 'Kondisi', 'Sumber'],
    rows: [
      ['HDPE PE100', '0.0015', 'Baru — permukaan sangat halus', 'PPI Handbook Ch.6'],
      ['PVC-U', '0.0015', 'Baru — permukaan halus', 'Uni-Bell Handbook'],
      ['PPR', '0.007', 'Baru', 'ISO 15874 / DIN 8077'],
      ['Baja Galvanis', '0.15', 'Baru, meningkat dgn korosi', 'Moody Chart / ASME'],
      ['Baja Karbon', '0.26', 'Baru, bisa >1mm dgn karat', 'Moody Chart'],
      ['Ductile Iron', '0.12', 'Dengan cement lining', 'AWWA M41'],
      ['Beton', '0.3–3.0', 'Tergantung finishing', 'ASCE Manual'],
    ]
  },
  soilModulus: {
    title: 'Tabel Modulus Tanah E\' (AWWA M23/M55)',
    headers: ['Jenis Tanah', 'Uncompacted', '85% Proctor', '90% Proctor', '>95% Proctor'],
    rows: [
      ['Fine-Grained (Liat/Lanau)', '0.35 MPa', '1.4 MPa', '2.8 MPa', '6.9 MPa'],
      ['Coarse w/ Fines (Pasir Berlanau)', '0.7 MPa', '2.8 MPa', '6.9 MPa', '13.8 MPa'],
      ['Coarse Clean (Pasir/Kerikil)', '1.4 MPa', '6.9 MPa', '13.8 MPa', '20.7 MPa'],
      ['Crushed Rock (Batu Pecah)', '6.9 MPa', '20.7 MPa', '20.7 MPa', '20.7 MPa'],
    ]
  },
  liveLoad: {
    title: 'Tabel Beban Lalu Lintas (Live Load)',
    headers: ['Tipe Beban', 'Beban (kN)', 'H min (m)', 'Sumber'],
    rows: [
      ['Pedestrian', '10', '0.3', 'BS EN 1991-1'],
      ['Mobil penumpang', '30', '0.45', 'AASHTO H-10'],
      ['Truk H-20 (roda belakang)', '72', '0.6', 'AASHTO H-20'],
      ['Alat berat', '100', '0.9', 'ASME B31.1'],
      ['Konstruksi crawler', '150', '1.2', 'AASHTO / AWWA M23'],
    ]
  },
  elasticity: {
    title: 'Tabel Modulus Elastisitas Material Pipa',
    headers: ['Material', 'E (GPa)', 'Wave Celerity ±', 'Sumber'],
    rows: [
      ['HDPE PE100', '0.8', '~200 m/s', 'ISO 4427 / PPI Handbook'],
      ['PVC-U', '3.0', '~400 m/s', 'SNI 9324:2024 / Uni-Bell'],
      ['PPR (PP-R)', '0.9', '~220 m/s', 'ISO 15874 / DIN 8078'],
      ['Baja Karbon', '200', '~1200 m/s', 'ASME B31.3'],
      ['Ductile Iron', '170', '~1100 m/s', 'AWWA M41'],
      ['Beton bertulang', '30', '~1000 m/s', 'ACI 318'],
    ]
  },
  runoffCoeff: {
    title: 'Tabel Koefisien Limpasan (C) — SNI 8153:2025',
    headers: ['Permukaan', 'C', 'Catatan', 'Sumber'],
    rows: [
      ['Atap miring (>3°)', '1.0', 'Termasuk genteng, metal', 'SNI 8153:2025 Tabel 8'],
      ['Atap rata (0°–3°)', '0.8', 'Slab beton, dak', 'SNI 8153:2025 Tabel 8'],
      ['Atap gravel', '0.6', 'Atap dgn lapisan kerikil', 'SNI 8153:2025 Tabel 8'],
      ['Green roof', '0.3', 'Atap dgn vegetasi', 'BS EN 12056-3'],
      ['Aspal/beton jalan', '0.85–0.95', 'Tergantung kemiringan', 'SNI 2415:2016'],
      ['Perkerasan blok', '0.6–0.8', 'Tergantung jenis', 'SNI 2415:2016'],
      ['Taman / rumput', '0.1–0.35', 'Tergantung kemiringan', 'SNI 2415:2016'],
    ]
  },
  kFitting: {
    title: 'Tabel K-Factor Minor Losses (Fitting)',
    headers: ['Komponen', 'K', 'Catatan', 'Sumber'],
    rows: [
      ['Elbow 90° (long radius)', '0.3', 'r/D ≥ 1.5', 'AWWA M55 / Crane TP 410'],
      ['Elbow 90° (short radius)', '0.9', 'r/D = 1.0', 'Crane TP 410'],
      ['Elbow 45°', '0.2', '', 'Crane TP 410'],
      ['Tee (lurus/cabang)', '0.2 / 1.0', 'Thru / Branch', 'Crane TP 410'],
      ['Gate Valve (full open)', '0.2', '', 'AWWA M55'],
      ['Butterfly Valve', '0.3', 'Full open', 'Crane TP 410'],
      ['Check Valve (swing)', '2.0', '', 'Crane TP 410'],
      ['Ball Valve (full open)', '0.05', '', 'Crane TP 410'],
      ['Butt Fusion Joint', '0.05', 'Bead internal', 'PPI Handbook Ch.6'],
      ['Entry (sharp edge)', '0.5', '', 'Moody / AWWA'],
      ['Exit (ke reservoir)', '1.0', '', 'Moody / AWWA'],
    ]
  }
};

function getRefTable(key) {
  var t = REF_TABLES[key];
  if (!t) return '';
  return refPanel(t.title, t.headers, t.rows);
}
