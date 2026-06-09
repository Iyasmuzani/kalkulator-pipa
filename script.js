// ==================== STATE ====================
let currentSystem = 'bangunan';
let totalChecks = 0, doneChecks = 0;

// ==================== SYSTEM CONFIG ====================
const systemConfig = {
  bangunan: {
    title: 'Sistem Perpipaan & Pompa Bangunan',
    sub: 'Panduan instalasi interaktif · Visualisasi komponen · Kalkulator',
    badge: 'SNI 8153:2025 · v2.1',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    vizLabel: 'Diagram Potongan Bangunan — Klik komponen untuk detail',
    guideIntro: 'Ikuti 8 tahap instalasi ini secara berurutan. Panduan mengacu pada <strong style="color:var(--sys-accent)">SNI 8153:2025</strong> tentang Tata Cara Perencanaan Sistem Plambing.',
    compData: () => bangunanCompData,
    guideData: () => bangunanGuideData,
    tagMap: { 'roof-tank': 'Tangki', 'ground-tank': 'Tangki', 'pump': 'Pompa', 'pressure-tank': 'Tangki Tekan', 'prv': 'Valve', 'gate-valve': 'Valve', 'check-valve': 'Valve', 'pressure-gauge': 'Instrumen', 'water-meter': 'Instrumen', 'floor-drain': 'Drainase' }
  },
  tambang: {
    title: 'Sistem Perpipaan Tambang',
    sub: 'Dewatering · Slurry transport · Settling pond · Kalkulator',
    badge: 'ASME B31.3 · B31.11',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-1.414-1.414l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
    vizLabel: 'Diagram Potongan Pit Tambang — Klik komponen untuk detail',
    guideIntro: 'Ikuti 7 tahap instalasi sistem perpipaan tambang. Panduan mengacu pada <strong style="color:var(--sys-accent)">Permen ESDM No. 26/2018</strong>, <strong style="color:var(--sys-accent)">ASME B31.3</strong> (Process Piping), dan <strong style="color:var(--sys-accent)">ASME B31.11</strong> (Slurry Transportation).',
    compData: () => tambangCompData,
    guideData: () => tambangGuideData,
    tagMap: { 'dewater-pump': 'Pompa', 'slurry-pump': 'Pompa', 'hdpe-pipe': 'Pipa', 'steel-pipe': 'Pipa', 'settling-pond': 'Kolam', 'butterfly-valve': 'Valve', 'knife-gate': 'Valve', 'flow-meter': 'Instrumen', 'expansion-joint': 'Fitting', 'wear-liner': 'Pelindung' }
  },
  distribusi: {
    title: 'Sistem Perpipaan Jaringan Distribusi Air',
    sub: 'Transmisi · Distribusi · DMA · NRW management · Kalkulator',
    badge: 'SNI 7511 · v1.0',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
    vizLabel: 'Layout Jaringan Distribusi Air — Klik komponen untuk detail',
    guideIntro: 'Ikuti 8 tahap instalasi jaringan distribusi air. Panduan mengacu pada <strong style="color:var(--sys-accent)">SNI 7511:2011</strong> dan <strong style="color:var(--sys-accent)">BS EN 805:2025</strong>.',
    compData: () => distribusiCompData,
    guideData: () => distribusiGuideData,
    tagMap: { 'intake': 'Sumber', 'reservoir': 'Penampung', 'booster-pump': 'Pompa', 'pipa-transmisi': 'Pipa', 'pipa-distribusi': 'Pipa', 'gate-valve-net': 'Valve', 'air-valve': 'Valve', 'prv-net': 'Valve', 'water-meter-bulk': 'Instrumen', 'hydrant': 'Hidran' }
  },
  siphonic: {
    title: 'Sistem Drainase Atap Siphonic',
    sub: 'Sistem Siphonic · Visualisasi · Komponen · Kalkulator',
    badge: 'BS 8490 · EN 1253-2',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
    vizLabel: 'Diagram Sistem Siphonic Roof Drain — Klik komponen untuk detail',
    guideIntro: 'Ikuti 8 tahap instalasi sistem drainase siphonic. Panduan mengacu pada <strong style="color:var(--sys-accent)">BS 8490:2007</strong> (Siphonic Roof Drainage) dan <strong style="color:var(--sys-accent)">EN 1253-2</strong> (Roof Outlets).',
    compData: () => siphonicCompData,
    guideData: () => siphonicGuideData,
    tagMap: { 'siphonic-outlet': 'Outlet', 'anti-vortex': 'Outlet', 'tail-pipe': 'Pipa', 'collecting-pipe': 'Pipa', 'downpipe': 'Pipa', 'transition-fitting': 'Fitting', 'clamp-bracket': 'Support', 'overflow-system': 'Safety', 'pipe-material': 'Material', 'discharge-point': 'Outlet' }
  }
};

// ==================== SIDEBAR NAVIGATION ====================

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  sb.classList.toggle('open');
  overlay.classList.toggle('open');
}

function toggleSidebarGroup(groupId) {
  var el = document.getElementById(groupId);
  if (!el) return;
  el.classList.toggle('open');
  // Rotate chevron of parent label
  var label = el.previousElementSibling;
  if (label) {
    var chev = label.querySelector('.sidebar-chevron');
    if (chev) chev.style.transform = el.classList.contains('open') ? 'rotate(0)' : 'rotate(-90deg)';
  }
}

function filterSidebar(val) {
  var items = document.querySelectorAll('.sidebar-item');
  var q = val.toLowerCase().trim();
  items.forEach(function(it) {
    if (!q) { it.style.display = ''; return; }
    var text = it.textContent.toLowerCase();
    it.style.display = text.indexOf(q) >= 0 ? '' : 'none';
  });
  // Also open all groups if searching
  if (q) {
    document.querySelectorAll('.sidebar-group-items').forEach(function(g) { g.classList.add('open'); });
  }
}

function sidebarNav(type, id) {
  if (type === 'system') {
    switchSystem(id);
  } else if (type === 'eng') {
    switchToEngTools();
    switchEngTool(id);
    // Mark active in sidebar
    document.querySelectorAll('.sidebar-item').forEach(function(el) { el.classList.remove('active'); });
    var target = document.querySelector('.sidebar-item[data-nav="eng"][data-id="' + id + '"]');
    if (target) target.classList.add('active');
  } else if (type === 'lib') {
    switchToLibrary();
    switchLibraryForm(id);
    // Mark active in sidebar
    document.querySelectorAll('.sidebar-item').forEach(function(el) { el.classList.remove('active'); });
    var target = document.querySelector('.sidebar-item[data-nav="lib"][data-id="' + id + '"]');
    if (target) target.classList.add('active');
  }
  // Close sidebar on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
  }
}

function sidebarSwitchTab(tab) {
  switchTab(tab);
  // Update sidebar sub-tabs
  document.querySelectorAll('.sidebar-sub').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-tab') === tab);
  });
}

function updateSidebarActive(type, id) {
  // Clear all sidebar items active
  document.querySelectorAll('.sidebar-item').forEach(function(el) { el.classList.remove('active'); });
  // Set new active
  var target = document.querySelector('.sidebar-item[data-nav="' + type + '"][data-id="' + id + '"]');
  if (target) target.classList.add('active');
  // Move subtabs under the active system item
  if (type === 'system') {
    var subtabs = document.getElementById('sidebar-systabs');
    if (subtabs && target) {
      target.insertAdjacentElement('afterend', subtabs);
    }
  }
}

// ==================== SYSTEM SWITCHING ====================
function switchSystem(sys) {
  currentSystem = sys;
  document.documentElement.setAttribute('data-system', sys);
  
  // Show system content, hide others
  document.getElementById('content-body').style.display = '';
  document.getElementById('eng-content').style.display = 'none';
  document.getElementById('lib-content').style.display = 'none';

  const cfg = systemConfig[sys];
  document.getElementById('hdr-title').textContent = cfg.title;
  document.getElementById('hdr-sub').textContent = cfg.sub;
  if (document.getElementById('hdr-badge')) document.getElementById('hdr-badge').textContent = cfg.badge;
  document.getElementById('viz-label').textContent = cfg.vizLabel;
  document.getElementById('guide-intro-text').innerHTML = cfg.guideIntro;

  // Update sidebar active
  updateSidebarActive('system', sys);

  // Ensure eng group is closed, modul group is open
  var grpModul = document.getElementById('grp-modul');
  if (grpModul) grpModul.classList.add('open');

  // Rebuild all content
  buildSVG();
  resetCompPanel();
  buildCompGrid();
  buildGuide();
  buildCalcForm();
  resetCalcResults();
}

// ==================== ENGINEERING TOOLS ====================
let currentEngTool = 'fusion';

function switchToEngTools() {
  document.getElementById('content-body').style.display = 'none';
  document.getElementById('eng-content').style.display = '';
  document.getElementById('lib-content').style.display = 'none';

  document.getElementById('hdr-title').textContent = 'Engineering Tools';
  document.getElementById('hdr-sub').textContent = 'Kalkulator teknis perpipaan';

  // Ensure eng group is open
  var grpEng = document.getElementById('grp-eng');
  if (grpEng) grpEng.classList.add('open');

  switchEngTool(currentEngTool);
}

function exitEngTools() {
  document.getElementById('eng-content').style.display = 'none';
  document.getElementById('content-body').style.display = '';
  switchSystem(currentSystem);
}

function switchEngTool(tool) {
  currentEngTool = tool;
  // Update sidebar active state
  document.querySelectorAll('.sidebar-item[data-nav="eng"]').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-id') === tool);
  });

  // ===== Tool descriptions =====
  const engToolDescriptions = {
    fusion: {
      title: 'Butt Fusion HDPE',
      desc: 'Menghitung parameter pengelasan butt fusion pipa HDPE PE100 berdasarkan diameter dan SDR pipa. Meliputi <strong>tekanan pengelasan</strong>, <strong>suhu heater plate</strong>, <strong>waktu pemanasan & pendinginan</strong>, serta <strong>tinggi bead</strong> yang sesuai standar.',
      standards: ['ISO 21307:2017', 'DVS 2207-1:2015', 'SNI 4829:2015'],
      useCase: 'Digunakan oleh teknisi fusion welding di lapangan untuk menentukan setting mesin butt fusion yang benar, memastikan kualitas sambungan memenuhi standar.'
    },
    pressloss: {
      title: 'Pressure Loss (Hazen-Williams)',
      desc: 'Menghitung <strong>kehilangan tekanan (head loss)</strong> sepanjang pipa akibat gesekan aliran air menggunakan metode empiris <strong>Hazen-Williams</strong>. Termasuk perhitungan <em>minor losses</em> dari sambungan butt fusion dan fitting.',
      formula: 'h<sub>f</sub> = 10.67 × Q<sup>1.852</sup> / (C<sup>1.852</sup> × D<sup>4.87</sup>) × L',
      standards: ['PPI Handbook Ch.6', 'AWWA M55 §5.4', 'Crane TP 410'],
      useCase: 'Untuk mendesain sistem perpipaan: memastikan tekanan di ujung pipa masih cukup, menentukan ukuran pipa optimal, dan menghitung kebutuhan daya pompa.'
    },
    buoyancy: {
      title: 'Buoyancy Pipa HDPE',
      desc: 'Menganalisis <strong>gaya apung (buoyancy)</strong> pada pipa HDPE yang diinstal di bawah air atau di daerah muka air tanah tinggi. Menghitung apakah pipa akan mengapung atau tenggelam, serta kebutuhan <strong>ballast/pemberat</strong>.',
      formula: 'F<sub>buoyancy</sub> = ρ<sub>air</sub> × A<sub>displaced</sub> — Net uplift = F<sub>b</sub> - W<sub>pipa</sub>',
      standards: ['Archimedes Principle', 'AWWA M55 Ch.11', 'ISO 4427-5:2019'],
      useCase: 'Wajib dihitung untuk pipa yang melintasi sungai, rawa, area muka air tanah tinggi, atau pipa underwater crossing untuk menentukan jenis dan jarak pemasangan pemberat.'
    },
    waterhammer: {
      title: 'Water Hammer (Joukowsky)',
      desc: 'Menghitung <strong>lonjakan tekanan (pressure surge)</strong> yang terjadi saat katup ditutup mendadak atau pompa berhenti tiba-tiba. Fenomena ini disebut <em>water hammer</em> dan dapat merusak pipa jika tekanan total melebihi batas material.',
      formula: 'ΔP = ρ × a × ΔV — dimana a = √(K/ρ) / √(1 + K×D/(E×e))',
      standards: ['Joukowsky Equation', 'ISO 4427-5:2019 §6.2', 'AWWA M55 Ch.7'],
      useCase: 'Untuk memverifikasi apakah pipa mampu menahan lonjakan tekanan transien, menentukan kebutuhan surge vessel/air valve, dan mendesain waktu penutupan katup yang aman.'
    },
    friction: {
      title: 'Friction Loss (Darcy-Weisbach)',
      desc: 'Menghitung <strong>head loss</strong> akibat gesekan menggunakan persamaan <strong>Darcy-Weisbach</strong> yang lebih akurat secara fisik. Friction factor dihitung secara iteratif dengan <strong>Colebrook-White equation</strong> berdasarkan Reynolds number dan kekasaran pipa.',
      formula: 'h<sub>f</sub> = f × (L/D) × V²/(2g) — f dari 1/√f = -2 log(ε/3.7D + 2.51/Re√f)',
      standards: ['Darcy-Weisbach', 'Colebrook-White', 'Moody Chart'],
      useCase: 'Alternatif Hazen-Williams yang lebih akurat untuk semua jenis fluida dan semua regime aliran (laminar & turbulen). Penting untuk desain presisi dan fluida non-air.'
    },
    pipeload: {
      title: 'Pipe Load & Defleksi',
      desc: 'Menganalisis <strong>beban tanah (dead load)</strong> dan <strong>beban lalu lintas (live load)</strong> yang bekerja pada pipa tanam, serta memprediksi <strong>defleksi (perubahan bentuk)</strong> pipa fleksibel menggunakan <strong>Modified Iowa Equation</strong>.',
      formula: 'ΔX = (D<sub>l</sub> × K × W<sub>c</sub>) / (8EI/D³ + 0.061 × E\')',
      standards: ['AWWA M23 / M55', 'Modified Iowa Eq.', 'Boussinesq', 'AASHTO H-20'],
      useCase: 'Menentukan SDR/kekakuan pipa yang tepat, kedalaman tanam minimum, jenis bedding yang diperlukan, dan apakah pipa aman dipasang di bawah jalan raya.'
    },
    rainfall: {
      title: 'Intensitas Curah Hujan & Runoff',
      desc: 'Menghitung <strong>intensitas curah hujan desain</strong> dari data R₂₄ (curah hujan harian) menggunakan <strong>Metode Mononobe</strong>, kemudian menghitung <strong>debit limpasan (runoff)</strong> menggunakan <strong>Metode Rasional</strong> (Q = CIA).',
      formula: 'I = (R₂₄/24) × (24/t)<sup>2/3</sup> — Q = C × I × A / 3600',
      standards: ['SNI 8153:2025 Tabel 8', 'Metode Mononobe', 'Rasional Q=CIA'],
      useCase: 'Menentukan ukuran pipa drainase atap (vertical leader), talang, dan saluran pembuangan air hujan berdasarkan debit limpasan puncak yang harus ditampung.'
    },
    tensile: {
      title: 'Tensile Yield HDPE',
      desc: 'Menghitung <strong>gaya tarik maksimum</strong> yang mampu ditahan pipa HDPE PE100 pada berbagai SDR/PN berdasarkan tegangan yield material. Penting untuk proses <strong>penarikan pipa</strong> saat instalasi, terutama pada metode <em>trenchless</em>.',
      formula: 'F = A<sub>cross-section</sub> × σ<sub>yield</sub> / 10000 (ton)',
      standards: ['SNI 4829:2015', 'ISO 4427-2:2019', 'ASTM F1962 (HDD)'],
      useCase: 'Menentukan batas aman gaya tarik saat penarikan pipa dalam Horizontal Directional Drilling (HDD), pipe bursting, atau penarikan pipa dalam conduit/selongsong.'
    },
    thermal: {
      title: 'Pemuaian Termal Pipa',
      desc: 'Menghitung <strong>pertambahan panjang (ekspansi)</strong> dan <strong>penyusutan (kontraksi)</strong> pipa akibat perubahan suhu. Termasuk dimensi <strong>expansion loop</strong>, <strong>gaya pada fixed point</strong>, dan jarak support/guide yang direkomendasikan.',
      formula: 'ΔL = α × L × ΔT — L<sub>loop</sub> = √(3 × D × ΔL)',
      standards: ['ISO 15874 (PPR)', 'ISO 4427 (HDPE)', 'SNI 9324:2024 (PVC)'],
      useCase: 'Mendesain expansion loop/compensator pada jalur pipa lurus panjang, terutama untuk sistem air panas (PPR) dan pipa above-ground yang terpapar perubahan suhu signifikan.'
    },
    bending: {
      title: 'Radius Bending HDPE',
      desc: 'Menghitung <strong>radius minimum pelengkungan (bending)</strong> pipa HDPE di lapangan. Pipa PE fleksibel dapat ditekuk tanpa fitting, namun menekuk melebihi batas dapat memicu kinking atau stress jangka panjang.',
      formula: 'R<sub>min</sub> = OD × Factor (tergantung SDR dan Suhu)',
      standards: ['ISO 4427-5:2019', 'AWWA M55 Ch.7', 'PPI Handbook'],
      useCase: 'Menentukan radius kelengkungan jalur pipa di lapangan untuk menghindari penggunaan fitting elbow (menghemat biaya dan menekan head loss).'
    },
    sdrpn: {
      title: 'SDR & PN Converter',
      desc: 'Konversi interaktif antara <strong>SDR (Standard Dimension Ratio)</strong>, <strong>S (Pipe Series)</strong>, dan <strong>PN (Nominal Pressure)</strong>. Membantu menerjemahkan spesifikasi pipa dari berbagai standar (ISO, ASTM, SNI).',
      formula: 'SDR = 2S + 1 — PN = (20 × MRS) / (C × (SDR - 1))',
      standards: ['ISO 4065:2018', 'ISO 4427-2:2019', 'SNI 4829:2015'],
      useCase: 'Menerjemahkan spesifikasi teknis dari proyek yang memakai referensi standar berbeda-beda agar tidak salah beli material.'
    },
    derating: {
      title: 'Derating Factor Suhu',
      desc: 'Menghitung <strong>penurunan tekanan kerja maksimal (MAOP)</strong> pada pipa plastik ketika beroperasi pada suhu di atas suhu referensi standar (20°C). Tekanan nominal pipa harus diturunkan saat dialiri air hangat/panas.',
      formula: 'MAOP = PN × f<sub>T</sub> (Faktor Reduksi Suhu)',
      standards: ['ISO 13760:1998', 'ISO 4427-1:2019', 'SNI 9324:2024'],
      useCase: 'Mendesain sistem perpipaan di area industri atau terpapar sinar matahari langsung (above ground) agar pipa tidak pecah akibat melemahnya material.'
    },
    flange: {
      title: 'Flange Tightening Torque',
      desc: 'Memberikan panduan spesifikasi baut dan <strong>torsi pengencangan (torque)</strong> untuk sambungan Flange Adaptor HDPE dengan Backing Ring. Mengencangkan terlalu keras bisa mematahkan stub end plastik.',
      formula: 'Torsi dihitung berdasar kelas tekanan flange, jumlah baut, dan material gasket',
      standards: ['ASME B16.5', 'EN 1092-1', 'PPI TN-38'],
      useCase: 'Digunakan oleh teknisi instalasi di lapangan saat menyambung pipa HDPE ke katup (valve) atau ke pipa baja menggunakan kunci torsi (torque wrench).'
    },
    trench: {
      title: 'Kedalaman Galian (Trench)',
      desc: 'Memberikan rekomendasi <strong>kedalaman parit (trench depth) minimum</strong> untuk instalasi pipa plastik tanam (underground), dengan mempertimbangkan beban tanah dan beban lalu lintas (live load) di atasnya.',
      formula: 'Kedalaman aman agar defleksi pipa < 5% (Metode Spangler)',
      standards: ['AWWA M55', 'AWWA M23', 'AASHTO H-20'],
      useCase: 'Perencanaan galian (excavation) di proyek infrastruktur jalan atau drainase bawah tanah agar pipa aman saat dilindas kendaraan berat.'
    },
    unitconv: {
      title: 'Unit Converter',
      desc: 'Konversi satuan teknis antar unit yang umum digunakan dalam bidang perpipaan, meliputi kategori: <strong>Tekanan</strong> (bar, psi, kPa, atm, mH₂O), <strong>Debit</strong> (L/s, m³/h, GPM), <strong>Kecepatan</strong>, <strong>Panjang</strong>, <strong>Suhu</strong>, <strong>Gaya</strong>, dan <strong>Massa</strong>.',
      formula: 'Konversi linear: Nilai × Faktor — Suhu: rumus khusus (°C ↔ °F ↔ K)',
      standards: ['SI Units', 'ASTM E380'],
      useCase: 'Alat bantu cepat untuk mengonversi satuan saat membaca spesifikasi teknis dari berbagai standar (SNI vs ISO vs ASTM) yang menggunakan sistem satuan berbeda.'
    },
    matguide: {
      title: 'Material Selection Guide',
      desc: 'Sistem rekomendasi pemilihan material pipa plastik (<strong>HDPE, PVC-U, PVC-O, PPR</strong>) berdasarkan 7 kriteria: aplikasi, suhu, tekanan, diameter, metode sambungan, kondisi instalasi, dan kontur tanah. Menggunakan <strong>scoring system</strong> untuk membandingkan kesesuaian masing-masing material.',
      formula: 'Skor = Σ(bobot kriteria) — Ranking berdasarkan akumulasi skor tertinggi',
      standards: ['SNI 4829:2015 (HDPE)', 'SNI 9324:2024 (PVC)', 'ISO 16422 (PVC-O)', 'ISO 15874 (PPR)'],
      useCase: 'Membantu engineer dan perencana memilih material pipa yang paling sesuai berdasarkan kondisi proyek spesifik, mengurangi risiko salah pilih material.'
    }
  };

  const descData = engToolDescriptions[tool];
  const descEl = document.getElementById('eng-tool-desc');
  if (descData && descEl) {
    const stdBadges = descData.standards.map(s => 
      `<span style="display:inline-block;background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.15);color:#6dd5ed;font-size:9px;padding:2px 8px;border-radius:10px;font-family:'JetBrains Mono',monospace;white-space:nowrap">${s}</span>`
    ).join(' ');
    
    descEl.innerHTML = `
      <div class="eng-desc-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:#00e5ff"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span class="eng-desc-title">${descData.title}</span>
        <button class="eng-desc-toggle" onclick="this.closest('.eng-tool-desc').classList.toggle('collapsed')" title="Tutup/Buka penjelasan">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
      <div class="eng-desc-body">
        <div class="eng-desc-text">${descData.desc}</div>
        ${descData.formula ? `<div class="eng-desc-formula">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span><strong>Rumus:</strong> ${descData.formula}</span>
        </div>` : ''}
        <div class="eng-desc-usecase">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
          <span>${descData.useCase}</span>
        </div>
        <div class="eng-desc-standards">${stdBadges}</div>
      </div>`;
    descEl.classList.remove('collapsed');
  }

  const builders = {
    fusion: buildFusionForm,
    pressloss: buildPressLossForm,
    buoyancy: buildBuoyancyForm,
    waterhammer: buildWaterHammerForm,
    friction: buildFrictionForm,
    pipeload: buildPipeLoadForm,
    rainfall: buildRainfallForm,
    tensile: buildTensileForm,
    thermal: buildThermalExpForm,
    bending: buildBendingForm,
    sdrpn: buildSDRPNForm,
    derating: buildDeratingForm,
    flange: buildFlangeTorqueForm,
    trench: buildTrenchDepthForm,
    unitconv: buildUnitConverterForm,
    matguide: buildMaterialGuideForm
  };
  if (builders[tool]) builders[tool]();
  document.getElementById('eng-results').innerHTML = `
    <div class="rec-placeholder">
      <div><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.2; margin-bottom: 10px;"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg></div>
      <div style="font-size:13px;color:var(--text2);max-width:220px;line-height:1.7;text-align:center">
        Isi parameter di panel kiri, lalu klik <strong style="color:#00e5ff">Hitung</strong>
      </div>
    </div>`;
}

// ==================== LIBRARY & FORMS ====================
function switchToLibrary() {
  document.getElementById('content-body').style.display = 'none';
  document.getElementById('eng-content').style.display = 'none';
  document.getElementById('lib-content').style.display = '';

  document.getElementById('hdr-title').textContent = 'Library';
  document.getElementById('hdr-sub').textContent = 'Kumpulan dokumen dan standar acuan perpipaan';

  // Ensure lib group is open
  var grpLib = document.getElementById('grp-lib');
  if (grpLib) grpLib.classList.add('open');
  
  switchLibraryForm('standar');
}

function switchLibraryForm(formId) {
  const iframeWrap = document.getElementById('library-content');
  const standarWrap = document.getElementById('library-standar');
  const pustakaWrap = document.getElementById('library-pustaka');

  iframeWrap.style.display = 'none';
  standarWrap.style.display = 'none';
  pustakaWrap.style.display = 'none';

  if (formId === 'siphonic') {
    iframeWrap.style.display = 'block';
    document.getElementById('library-iframe').src = 'form-siphonic.html';
  } else if (formId === 'standar') {
    standarWrap.style.display = 'block';
    renderStandarAcuan();
  } else if (formId === 'pustaka') {
    pustakaWrap.style.display = 'block';
    renderPustakaTeknis();
  }
}

// ==================== STANDAR ACUAN PIPA PLASTIK ====================
const pipeStandards = {
  'HDPE (High-Density Polyethylene)': {
    color: '#00bcd4',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/></svg>',
    items: [
      { std: 'SNI 9383:2025', pdf: 'standards/hdpe/sni_93832025.pdf', title: 'Resin Polietilena (PE) untuk Pipa dan Fiting', scope: 'Standar resin PE untuk sistem perpipaan air minum bertekanan. Mengacu pada ISO 4427-1:2019. Menggantikan SNI 06-4829:2005.', type: 'SNI' },
      { std: 'SNI 9362:2025', pdf: 'standards/hdpe/sni_93622025.pdf', title: 'Pipa Polietilena (PE) untuk Air Minum & Drainase', scope: 'Standar pipa PE sistem perpipaan bertekanan. Mengacu pada ISO 4427-2:2019. Menggantikan SNI 06-4829:2005.', type: 'SNI' },
      { std: 'SNI 9363:2025', pdf: 'standards/hdpe/sni_93632025.pdf', title: 'Fiting Polietilena (PE) untuk Air Minum & Drainase', scope: 'Standar fiting PE untuk air minum bertekanan. Melengkapi spesifikasi teknis SNI 9362:2025.', type: 'SNI' },
      { std: 'SNI 8884-1:2020', pdf: '#', title: 'Sistem Perpipaan Plastik — PE untuk Gas — Bagian 1: Umum', scope: 'Standar umum pipa PE untuk penyaluran bahan bakar gas. Adopsi ISO 4437-1:2014 (MOD).', type: 'SNI' },
      { std: 'SNI 8884-2:2020', pdf: 'standards/hdpe/sni_8884.22020.pdf', title: 'Sistem Perpipaan Plastik — PE untuk Gas — Bagian 2: Pipa', scope: 'Spesifikasi dimensi dan pengujian pipa PE untuk penyaluran bahan bakar gas. Adopsi ISO 4437-2:2014 (MOD).', type: 'SNI' },
      { std: 'SNI 8884-3:2020', pdf: '#', title: 'Sistem Perpipaan Plastik — PE untuk Gas — Bagian 3: Fiting', scope: 'Spesifikasi fiting PE (electrofusion, butt fusion, spigot) untuk gas. Adopsi ISO 4437-3:2014 (MOD).', type: 'SNI' },
      { std: 'SNI 4829.1:2015', pdf: 'standards/hdpe/sni_4829.12015.pdf', title: 'Sistem Perpipaan Plastik — PE untuk Air Minum — Bagian 1: Umum', scope: 'Klasifikasi, terminologi, dan persyaratan umum pipa PE untuk transportasi air minum. Adopsi ISO 4427-1:2007 (MOD).', type: 'SNI' },
      { std: 'SNI 4829.2:2015', pdf: 'standards/hdpe/sni_4829.22015.pdf', title: 'Sistem Perpipaan Plastik — PE untuk Air Minum — Bagian 2: Pipa', scope: 'Spesifikasi pipa PE100/PE80 (dimensi, tekanan, toleransi). Adopsi ISO 4427-2:2007 (MOD).', type: 'SNI' },
      { std: 'SNI 4829.3:2015', pdf: 'standards/hdpe/sni_4829.32015.pdf', title: 'Sistem Perpipaan Plastik — PE untuk Air Minum — Bagian 3: Fitting', scope: 'Spesifikasi fitting compression, butt fusion, electrofusion, dan spigot end.', type: 'SNI' },
      { std: 'SNI 4829.5:2015', pdf: 'standards/hdpe/sni_4829.52015.pdf', title: 'Sistem Perpipaan Plastik — PE untuk Air Minum — Bagian 5: Fitness for Purpose', scope: 'Persyaratan kesesuaian penggunaan, ketahanan tekanan jangka panjang (MRS/LPL).', type: 'SNI' },
      { std: 'ISO 4427-1:2019', pdf: 'standards/hdpe/iso_4427-12019.pdf', title: 'PE Piping Systems — Part 1: General', scope: 'Standar internasional acuan untuk sistem perpipaan PE untuk air minum.', type: 'ISO' },
      { std: 'ISO 4427-2:2019', pdf: 'standards/hdpe/iso_4427-22019.pdf', title: 'PE Piping Systems — Part 2: Pipes', scope: 'Dimensi pipa PE DN10–DN2000, ketebalan dinding minimum per SDR.', type: 'ISO' },
      { std: 'ISO 4427-3:2019', pdf: 'standards/hdpe/iso_4427-32019.pdf', title: 'PE Piping Systems — Part 3: Fittings', scope: 'Spesifikasi fitting PE untuk sambungan mekanis dan fusion.', type: 'ISO' },
      { std: 'ISO 4427-5:2019', pdf: 'standards/hdpe/iso_4427-52019.pdf', title: 'PE Piping Systems — Part 5: Fitness for Purpose', scope: 'Uji kesesuaian jangka panjang: hydrostatic pressure, slow crack growth, RCP.', type: 'ISO' },
      { std: 'ISO 21307:2017', pdf: 'standards/hdpe/iso_213072017.pdf', title: 'Plastics Pipes — Butt Fusion Jointing Procedures', scope: 'Parameter butt fusion (suhu, tekanan, waktu) untuk pipa PE. Acuan utama installer.', type: 'ISO' },
      { std: 'DVS 2207-1:2015', pdf: 'standards/hdpe/dvs_2207-12015.pdf', title: 'Welding of Thermoplastics — Heated Tool Butt Welding (PE)', scope: 'Standar Jerman untuk pengelasan butt fusion PE100. Parameter detail per ketebalan dinding.', type: 'DVS' },
      { std: 'ISO 12176-1:2017', pdf: 'standards/hdpe/iso_12176-12017.pdf', title: 'Plastics Pipes — Equipment for Fusion Jointing — Part 1: Butt Fusion', scope: 'Spesifikasi alat butt fusion (mesin, heater plate, facing tool).', type: 'ISO' },
      { std: 'ISO 12176-2:2008', pdf: 'standards/hdpe/iso_12176-22008.pdf', title: 'Plastics Pipes — Equipment for Fusion Jointing — Part 2: Electrofusion', scope: 'Spesifikasi alat electrofusion (kontrol unit, barcode scanner).', type: 'ISO' },
      { std: 'ISO 13953:2001', pdf: 'standards/hdpe/iso_139532001.pdf', title: 'PE Pipes — Determination of Tensile Strength', scope: 'Metode uji kuat tarik sambungan butt fusion (Tensile Test).', type: 'ISO' },
      { std: 'ISO 13954:1997', pdf: 'standards/hdpe/iso_139541997.pdf', title: 'PE Pipes — Peel Decohesion Test for Electrofusion', scope: 'Metode uji kekuatan sambungan electrofusion.', type: 'ISO' },
      { std: 'AWWA M55', pdf: 'standards/hdpe/awwa_m55.pdf', title: 'PE Pipe — Design and Installation', scope: 'Manual desain dan instalasi pipa PE untuk air (flotation, deflection, thrust restraint).', type: 'AWWA' },
      { std: 'AWWA C906', pdf: 'standards/hdpe/awwa_c906.pdf', title: 'PE Pressure Pipe and Fittings, 4 in. through 65 in.', scope: 'Standar material dan pengujian pipa PE bertekanan diameter besar.', type: 'AWWA' },
      { std: 'AS/NZS 4130:2018', pdf: 'standards/hdpe/asnzs_41302018.pdf', title: 'PE Pipes for Pressure Applications', scope: 'Standar Australia/NZ untuk pipa PE bertekanan (series 1 & 2).', type: 'AS/NZS' },
    ]
  },
  'PVC (Polyvinyl Chloride)': {
    color: '#7c4dff',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h20v4H2z"/><path d="M2 6h20v4H2z"/><path d="M12 10v4"/></svg>',
    items: [
      { std: 'SNI 9324:2024', pdf: 'standards/pvc/sni_93242024.pdf', title: 'Pipa uPVC untuk Air Minum, Drainase, dan Saluran Pembuangan', scope: 'Standar terbaru pipa uPVC untuk air minum, drainase, dan sewerage di luar bangunan/dalam galian. Menggabungkan dan menggantikan SNI 06-0084-2002, SNI 06-0162-1987, dan SNI 06-6419-2000.', type: 'SNI' },
      { std: 'JIS K 6741:2016', pdf: 'standards/pvc/jis_k_67412016.pdf', title: 'Unplasticized PVC Pipes (VP, VU)', scope: 'Standar Jepang untuk pipa PVC-U. VP = tekanan, VU = non-tekanan. Banyak digunakan di Indonesia.', type: 'JIS' },
      { std: 'JIS K 6742:2016', pdf: 'standards/pvc/jis_k_67422016.pdf', title: 'Unplasticized PVC Pipes Fittings', scope: 'Fitting PVC-U (elbow, tee, socket) sesuai standar JIS.', type: 'JIS' },
      { std: 'JIS K 6743:2016', pdf: 'standards/pvc/jis_k_67432016.pdf', title: 'Unplasticized PVC Valves', scope: 'Katup PVC-U (ball valve, check valve) standar JIS.', type: 'JIS' },
      { std: 'ISO 1452-1:2009', pdf: 'standards/pvc/iso_1452-12009.pdf', title: 'PVC-U Piping Systems for Water Supply — Part 1: General', scope: 'Standar internasional sistem perpipaan PVC-U untuk suplai air.', type: 'ISO' },
      { std: 'ISO 1452-2:2009', pdf: 'standards/pvc/iso_1452-22009.pdf', title: 'PVC-U Piping Systems for Water Supply — Part 2: Pipes', scope: 'Dimensi, ketebalan, dan pengujian pipa PVC-U bertekanan.', type: 'ISO' },
      { std: 'ISO 1452-3:2009', pdf: 'standards/pvc/iso_1452-32009.pdf', title: 'PVC-U Piping Systems for Water Supply — Part 3: Fittings', scope: 'Spesifikasi fitting PVC-U injection moulded dan fabricated.', type: 'ISO' },
      { std: 'ASTM D1785', pdf: 'standards/pvc/astm_d1785.pdf', title: 'PVC Plastic Pipe, Schedule 40, 80, 120', scope: 'Standar AS untuk pipa PVC jadwal/schedule. Tekanan & dimensi.', type: 'ASTM' },
      { std: 'ASTM D2241', pdf: 'standards/pvc/astm_d2241.pdf', title: 'PVC Pressure-Rated Pipe (SDR Series)', scope: 'Pipa PVC berdasarkan SDR (Standard Dimension Ratio).', type: 'ASTM' },
      { std: 'AS/NZS 1477:2017', pdf: 'standards/pvc/asnzs_14772017.pdf', title: 'PVC Pipes and Fittings for Pressure Applications', scope: 'Standar Australia/NZ untuk pipa PVC bertekanan (Series 1 & 2, DN15–DN750).', type: 'AS/NZS' },
      { std: 'BS EN 1401-1:2019', pdf: 'standards/pvc/bs_en_1401-12019.pdf', title: 'PVC-U Piping Systems for Non-Pressure Underground Drainage', scope: 'Sistem perpipaan PVC-U non-tekanan untuk drainase bawah tanah.', type: 'BS EN' },
      { std: 'ISO/TR 4191:2014', pdf: 'standards/pvc/iso_tr_4191_2014.pdf', title: 'Plastics piping systems for water supply — PVC-U and PVC-O — Guidance for installation', scope: 'Panduan instalasi sistem perpipaan plastik untuk suplai air, khusus untuk pipa PVC-U dan PVC-O.', type: 'ISO' },
    ]
  },
  'PVC-O (Oriented PVC)': {
    color: '#ff6d00',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M6 12h12"/></svg>',
    items: [
      { std: 'ISO 16422-1:2024', pdf: 'standards/pvc-o/iso_16422-12024.pdf', title: 'PVC-O Piping Systems — Part 1: General', scope: 'Standar utama pipa PVC-O (oriented). Klasifikasi kelas 315, 400, 450, 500. Menggantikan ISO 16422:2014.', type: 'ISO' },
      { std: 'ISO 16422-2:2023', pdf: 'standards/pvc-o/iso_16422-22023.pdf', title: 'PVC-O Piping Systems — Part 2: Pipes', scope: 'Spesifikasi dimensi, tekanan kerja, dan pengujian pipa PVC-O.', type: 'ISO' },
      { std: 'ISO 16422-5:2024', pdf: 'standards/pvc-o/iso_16422-52024.pdf', title: 'PVC-O Piping Systems — Part 5: Fitness for Purpose', scope: 'Pengujian jangka panjang pipa PVC-O termasuk ketahanan impak dan fatigue.', type: 'ISO' },
      { std: 'AS/NZS 4441:2019', pdf: 'standards/pvc-o/asnzs_44412019.pdf', title: 'Oriented PVC-O Pipes for Pressure Applications', scope: 'Standar Australia/NZ untuk pipa PVC-O, DN100–DN600.', type: 'AS/NZS' },
      { std: 'EN 17176-1:2019', pdf: 'standards/pvc-o/en_17176-12019.pdf', title: 'PVC-O Piping Systems for Water Supply — Part 1: General', scope: 'Standar Eropa untuk PVC-O: terminologi, klasifikasi, persyaratan umum.', type: 'EN' },
      { std: 'EN 17176-2:2019+A1:2022', pdf: 'standards/pvc-o/en_17176-22019a12022.pdf', title: 'PVC-O Piping Systems for Water Supply — Part 2: Pipes', scope: 'Dimensi, tekanan kerja, dan pengujian pipa PVC-O kelas 315–500. Termasuk Amendment 1:2022.', type: 'EN' },
      { std: 'PAS 27:2017 (UK)', pdf: 'standards/pvc-o/pas_272017_uk.pdf', title: 'Oriented PVC Pipes — Specification', scope: 'Spesifikasi publik Inggris untuk pipa PVC-O dalam aplikasi air bertekanan.', type: 'PAS' },
      { std: 'ISO/TR 4191:2014', pdf: 'standards/pvc-o/iso_tr_4191_2014.pdf', title: 'Plastics piping systems for water supply — PVC-U and PVC-O — Guidance for installation', scope: 'Panduan instalasi sistem perpipaan plastik untuk suplai air, khusus untuk pipa PVC-U dan PVC-O.', type: 'ISO' },
    ]
  },
  'PPR (Polypropylene Random Copolymer)': {
    color: '#00e676',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
    items: [
      { std: 'SNI ISO 15874-1:2012', pdf: 'standards/ppr/sni_iso_15874-12012.pdf', title: 'Sistem Perpipaan Plastik untuk Air Panas dan Dingin — PP — Bagian 1: Umum', scope: 'Adopsi ISO 15874-1 untuk persyaratan umum sistem perpipaan PP-R di Indonesia.', type: 'SNI' },
      { std: 'SNI ISO 15874-2:2012', pdf: 'standards/ppr/sni_iso_15874-22012.pdf', title: 'Sistem Perpipaan Plastik untuk Air Panas dan Dingin — PP — Bagian 2: Pipa', scope: 'Adopsi ISO 15874-2 untuk spesifikasi pipa PP-R di Indonesia.', type: 'SNI' },
      { std: 'SNI ISO 15874-3:2012', pdf: 'standards/ppr/sni_iso_15874-32012.pdf', title: 'Sistem Perpipaan Plastik untuk Air Panas dan Dingin — PP — Bagian 3: Fitting', scope: 'Adopsi ISO 15874-3 untuk spesifikasi fitting PP-R di Indonesia.', type: 'SNI' },
      { std: 'ISO 15874-1:2013', pdf: 'standards/ppr/iso_15874-12013.pdf', title: 'PP Piping Systems for Hot and Cold Water — Part 1: General', scope: 'Standar internasional sistem perpipaan PP-R untuk air panas/dingin. Termasuk Amd 1:2022.', type: 'ISO' },
      { std: 'ISO 15874-2:2013', pdf: 'standards/ppr/iso_15874-22013.pdf', title: 'PP Piping Systems — Part 2: Pipes', scope: 'Spesifikasi dimensi dan pengujian pipa PP-R (PN10, PN16, PN20, PN25).', type: 'ISO' },
      { std: 'ISO 15874-3:2013', pdf: 'standards/ppr/iso_15874-32013.pdf', title: 'PP Piping Systems — Part 3: Fittings', scope: 'Spesifikasi fitting PP-R (elbow, tee, socket fusion, butt fusion).', type: 'ISO' },
      { std: 'ISO 15874-5:2013', pdf: 'standards/ppr/iso_15874-52013.pdf', title: 'PP Piping Systems — Part 5: Fitness for Purpose', scope: 'Pengujian kesesuaian: ketahanan tekanan pada suhu tinggi, bending, dll.', type: 'ISO' },
      { std: 'ISO 7-1:1994', pdf: '#', title: 'Pipe threads where pressure-tight joints are made on the threads', scope: 'Standar ulir (taper/parallel) untuk fitting transisi PPR (brass insert) dengan sambungan kedap tekanan.', type: 'ISO' },
      { std: 'ISO 228-1:2000', pdf: '#', title: 'Pipe threads where pressure-tight joints are not made on the threads', scope: 'Standar ulir paralel untuk fitting PPR/aksesoris di mana kekedapan tekanan tidak mengandalkan ulir itu sendiri.', type: 'ISO' },
      { std: 'DIN 8077:2008', pdf: 'standards/ppr/din_80772008.pdf', title: 'PP Pipes — General Quality Requirements and Testing', scope: 'Standar Jerman untuk persyaratan mutu umum dan pengujian pipa PP.', type: 'DIN' },
      { std: 'DIN 8078:2008', pdf: 'standards/ppr/din_80782008.pdf', title: 'PP Pipes — Dimensions', scope: 'Dimensi standar pipa PP-R menurut DIN (DN20 – DN160).', type: 'DIN' },
      { std: 'DVS 2207-11:2008', pdf: 'standards/ppr/dvs_2207-112008.pdf', title: 'Welding of Thermoplastics — PP Socket Fusion', scope: 'Parameter socket fusion untuk pipa PP-R (suhu, waktu, kedalaman insersi).', type: 'DVS' },
      { std: 'DVS 2207-1', pdf: 'standards/ppr/dvs_2207-1.pdf', title: 'Welding of Thermoplastics — Heated Tool Butt Welding', scope: 'Parameter butt fusion untuk PP-R diameter besar. Direvisi berkala oleh DVS.', type: 'DVS' },
    ]
  },
  'Standar Sistem & Perencanaan': {
    color: '#ffd740',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    items: [
      { std: 'SNI 8153:2025', pdf: 'standards/sistem/sni_81532025.pdf', title: 'Tata Cara Perencanaan Sistem Plambing', scope: 'Standar terbaru tata cara perencanaan dan pemasangan sistem plambing bangunan gedung. Mencakup semua material pipa (PVC, PPR, HDPE, tembaga, baja). Revisi dari SNI 8153:2015.', type: 'SNI' },
      { std: 'SNI 7511:2011', pdf: 'standards/sistem/sni_75112011.pdf', title: 'Tata Cara Pemasangan Pipa Transmisi dan Distribusi serta Sambungan Rumah', scope: 'Panduan pemasangan pipa transmisi dan distribusi air minum (semua material) termasuk sambungan rumah. Acuan utama untuk jaringan PDAM.', type: 'SNI' },
      { std: 'BS 8490:2007', pdf: 'standards/sistem/bs_84902007.pdf', title: 'Guide to Siphonic Roof Drainage Systems', scope: 'Panduan desain dan instalasi sistem drainase atap siphonic. Berlaku untuk semua material pipa siphonic (PVC, HDPE).', type: 'BS' },
    ]
  },
  'Uji Komisioning & Pressure Test': {
    color: '#e040fb',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
    items: [
      { std: 'SNI 8153:2025', pdf: 'standards/komisioning/sni_81532025.pdf', title: 'Tata Cara Perencanaan Sistem Plambing (termasuk Uji Komisioning)', scope: 'Mengatur uji komisioning dan uji hidrostatik sistem plambing bangunan gedung. Mencakup prosedur pressure test pipa air bersih, air buangan, dan vent sebelum sistem dioperasikan.', type: 'SNI' },
      { std: 'BS EN 805:2025', pdf: 'standards/komisioning/bs_en_8052025.pdf', title: 'Water Supply — Requirements for Systems Outside Buildings', scope: 'Standar utama komisioning jaringan air minum di luar gedung. Mencakup uji tekanan hidrostatis, prosedur flushing, dan disinfeksi sebelum operasional. Revisi dari BS EN 805:2000.', type: 'BS EN' },
      { std: 'SNI 7629:2008', pdf: 'standards/komisioning/sni_76292008.pdf', title: 'Tata Cara Komisioning Instalasi Pengolahan Air', scope: 'Panduan komisioning instalasi pengolahan air minum di Indonesia, termasuk uji kinerja dan serah terima sistem.', type: 'SNI' },
      { std: 'ASTM F2164', pdf: 'standards/komisioning/astm_f2164.pdf', title: 'Field Leak Testing of PE Pressure Piping Systems', scope: 'Prosedur uji kebocoran lapangan untuk sistem pipa PE bertekanan menggunakan metode hidrostatis. Memperhitungkan sifat viskoelastis PE.', type: 'ASTM' },
      { std: 'ASTM F2263', pdf: 'standards/komisioning/astm_f2263.pdf', title: 'Standard Test Method for Evaluating the Oxidative Resistance of PE Pipe to Chlorinated Water', scope: 'Metode uji ketahanan pipa PE terhadap air berklorin — penting untuk komisioning jaringan air minum.', type: 'ASTM' },
      { std: 'ISO 10802:2020', pdf: 'standards/komisioning/iso_108022020.pdf', title: 'Ductile Iron Pipelines — Hydrostatic Testing After Installation', scope: 'Prosedur uji hidrostatis paska instalasi. Tiga fase: persiapan, uji pendahuluan (stabilisasi), dan uji tekanan utama.', type: 'ISO' },
      { std: 'AWWA C600', pdf: 'standards/komisioning/awwa_c600.pdf', title: 'Installation of Ductile-Iron Mains and Their Appurtenances', scope: 'Panduan instalasi dan uji komisioning pipa ductile iron termasuk prosedur hydrostatic test dan disinfeksi.', type: 'AWWA' },
      { std: 'AWWA C605', pdf: 'standards/komisioning/awwa_c605.pdf', title: 'Underground Installation of PVC and PVCO Pressure Pipe', scope: 'Panduan instalasi bawah tanah dan uji tekanan pipa PVC dan PVC-O, termasuk prosedur field pressure test.', type: 'AWWA' },
      { std: 'AWWA M41', pdf: 'standards/komisioning/awwa_m41.pdf', title: 'Ductile-Iron Pipe and Fittings — Manual of Water Supply Practices', scope: 'Manual praktik uji dan komisioning pipa ductile iron untuk jaringan air minum.', type: 'AWWA' },
      { std: 'PPI TN-46', pdf: 'standards/komisioning/ppi_tn-46.pdf', title: 'Guidance for Field Hydrostatic Testing of HDPE Pressure Pipelines', scope: 'Panduan teknis dari Plastics Pipe Institute untuk uji hidrostatis lapangan pipa HDPE. Memperhitungkan creep dan stress relaxation material PE.', type: 'PPI' },
      { std: 'WIS 4-01-03', pdf: 'standards/komisioning/wis_4-01-03.pdf', title: 'Site Pressure Testing of Pressure Pipelines (UK Water Industry)', scope: 'Spesifikasi industri air Inggris untuk uji tekanan lapangan, termasuk prosedur khusus untuk pipa PE viskoelastis.', type: 'WIS' },
    ]
  },
  'Pengujian Kualitas Pipa': {
    color: '#26a69a',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>',
    items: [
      { std: 'ISO 1167-1:2006', pdf: 'standards/pengujian-kualitas/iso_1167-12006.pdf', title: 'Thermoplastics Pipes — Resistance to Internal Pressure — Part 1: General Method', scope: 'Metode umum uji ketahanan tekanan internal pipa termoplastik. Menentukan waktu gagal pada tekanan dan suhu tertentu (hydrostatic stress rupture test).', type: 'ISO' },
      { std: 'ISO 1167-2:2006', pdf: 'standards/pengujian-kualitas/iso_1167-22006.pdf', title: 'Thermoplastics Pipes — Resistance to Internal Pressure — Part 2: Preparation of Pipe Test Pieces', scope: 'Prosedur penyiapan benda uji pipa untuk pengujian tekanan internal jangka panjang.', type: 'ISO' },
      { std: 'ISO 6259-1:2015', pdf: 'standards/pengujian-kualitas/iso_6259-12015.pdf', title: 'Thermoplastics Pipes — Determination of Tensile Properties — Part 1: General Test Method', scope: 'Metode uji sifat tarik (tensile test) pipa termoplastik: kuat tarik, elongation at break, dan stress at yield.', type: 'ISO' },
      { std: 'ISO 6259-3:2015', pdf: 'standards/pengujian-kualitas/iso_6259-32015.pdf', title: 'Thermoplastics Pipes — Determination of Tensile Properties — Part 3: Polyolefin Pipes', scope: 'Uji tarik spesifik untuk pipa polyolefin (PE, PP). Parameter sesuai jenis material dan diameter.', type: 'ISO' },
      { std: 'ISO 3126:2005', pdf: 'standards/pengujian-kualitas/iso_31262005.pdf', title: 'Plastics Piping Systems — Plastics Components — Determination of Dimensions', scope: 'Metode pengukuran dimensi pipa dan fitting plastik: diameter, ketebalan dinding, panjang, dan kesikuan.', type: 'ISO' },
      { std: 'ISO 3127:2016', pdf: 'standards/pengujian-kualitas/iso_31272016.pdf', title: 'Thermoplastics Pipes — Determination of Resistance to External Blows (Drop Impact)', scope: 'Uji ketahanan pipa termoplastik terhadap benturan eksternal (drop-weight impact test/TIR test).', type: 'ISO' },
      { std: 'ISO 2505:2005', pdf: 'standards/pengujian-kualitas/iso_25052005.pdf', title: 'Thermoplastics Pipes — Longitudinal Reversion', scope: 'Uji perubahan dimensi longitudinal pipa setelah dipanaskan (reversion test). Indikator kualitas proses ekstrusi.', type: 'ISO' },
      { std: 'ISO 9969:2016', pdf: 'standards/pengujian-kualitas/iso_99692016.pdf', title: 'Thermoplastics Pipes — Determination of Ring Stiffness', scope: 'Pengujian kekakuan cincin (ring stiffness) pipa termoplastik. Penting untuk pipa non-tekanan yang ditanam dalam tanah (SN2, SN4, SN8).', type: 'ISO' },
      { std: 'ISO 1133-1:2022', pdf: 'standards/pengujian-kualitas/iso_1133-12022.pdf', title: 'Plastics — Determination of Melt Mass-Flow Rate (MFR) and Melt Volume-Flow Rate (MVR)', scope: 'Pengujian MFR/MVR material termoplastik. Digunakan untuk kontrol kualitas bahan baku pipa (PE, PP, PVC).', type: 'ISO' },
      { std: 'ISO 306:2022', pdf: 'standards/pengujian-kualitas/iso_3062022.pdf', title: 'Plastics — Thermoplastic Materials — Determination of Vicat Softening Temperature (VST)', scope: 'Pengujian suhu pelunakan Vicat material termoplastik. Indikator ketahanan panas material pipa.', type: 'ISO' },
      { std: 'ISO 6964:2019', pdf: 'standards/pengujian-kualitas/iso_69642019.pdf', title: 'Polyolefin Pipes and Fittings — Determination of Carbon Black Content by Calcination and Pyrolysis', scope: 'Pengujian kandungan carbon black pada pipa PE/PP. Penting untuk memastikan ketahanan UV pipa HDPE hitam (min. 2%).', type: 'ISO' },
      { std: 'ISO 13953:2001', pdf: 'standards/pengujian-kualitas/iso_139532001.pdf', title: 'PE Pipes — Determination of Tensile Strength of Butt Fusion Joint', scope: 'Metode uji kuat tarik sambungan butt fusion pipa PE. Menentukan kualitas pengelasan.', type: 'ISO' },
      { std: 'ISO 13954:1997', pdf: 'standards/pengujian-kualitas/iso_139541997.pdf', title: 'PE Pipes — Peel Decohesion Test for Electrofusion Joints', scope: 'Metode uji kekuatan sambungan electrofusion pipa PE dengan metode peel decohesion.', type: 'ISO' },
      { std: 'ASTM D2122', pdf: 'standards/pengujian-kualitas/astm_d2122.pdf', title: 'Standard Test Method for Determining Dimensions of Thermoplastic Pipe and Fittings', scope: 'Metode ASTM untuk pengukuran dimensi pipa dan fitting termoplastik.', type: 'ASTM' },
      { std: 'ASTM D2837', pdf: 'standards/pengujian-kualitas/astm_d2837.pdf', title: 'Standard Test Method for Obtaining Hydrostatic Design Basis (HDB) for Thermoplastic Pipe Materials', scope: 'Metode penentuan Hydrostatic Design Basis (HDB) material pipa termoplastik melalui uji regresi tekanan jangka panjang.', type: 'ASTM' },
      { std: 'ISO 11357-6:2018', pdf: 'standards/pengujian-kualitas/iso_11357-62018.pdf', title: 'Plastics — DSC — Part 6: Determination of Oxidation Induction Time (OIT)', scope: 'Pengujian OIT (Oxidation Induction Time) menggunakan DSC. Mengukur stabilitas oksidatif material pipa PE — indikator utama daya tahan jangka panjang terhadap degradasi termal.', type: 'ISO' },
      { std: 'ISO 188:2023', pdf: 'standards/pengujian-kualitas/iso_1882023.pdf', title: 'Rubber, Vulcanized or Thermoplastic — Accelerated Ageing and Heat Resistance Tests', scope: 'Uji penuaan dipercepat dan ketahanan panas karet vulkanisasi/termoplastik. Relevan untuk pengujian gasket dan seal karet pada sambungan pipa (rubber ring joint).', type: 'ISO' },
      { std: 'ISO 9352:2012', pdf: 'standards/pengujian-kualitas/iso_93522012.pdf', title: 'Plastics — Determination of Resistance to Wear by Abrasive Wheels', scope: 'Uji ketahanan gesek/abrasi material plastik menggunakan Taber Abraser. Penting untuk pipa yang mengalirkan fluida abrasif (slurry, pasir, tailing).', type: 'ISO' },
    ]
  }
};

let _standarSearchQuery = '';
let _standarSearchRaw = '';
let _standarSearchTimeout = null;

function _standarSearchHandler(value) {
  clearTimeout(_standarSearchTimeout);
  _standarSearchRaw = value;
  _standarSearchTimeout = setTimeout(function() {
    _standarSearchQuery = value.toLowerCase();
    renderStandarAcuan(_standarActiveFilter || 'all');
  }, 250);
}

let _standarActiveFilter = 'all';

function _highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text;
  return text.slice(0, idx) + '<mark style="background:rgba(0,229,255,.25);color:#fff;border-radius:2px;padding:0 1px">' + text.slice(idx, idx + query.length) + '</mark>' + text.slice(idx + query.length);
}

function renderStandarAcuan(filterKey) {
  const container = document.getElementById('library-standar');
  const categories = Object.keys(pipeStandards);
  const activeFilter = filterKey || 'all';
  _standarActiveFilter = activeFilter;
  const searchQuery = _standarSearchQuery;

  // Header
  let html = '<div style="margin-bottom:16px;font-family:' + "'Space Grotesk'" + ',sans-serif;font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sys-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg> Referensi Standar Acuan — Pipa Plastik</div>';
  html += '<div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.6">Kumpulan standar nasional dan internasional yang menjadi acuan desain, manufaktur, pengujian, dan instalasi pipa plastik.</div>';

  // Search bar
  html += '<div id="standar-search-wrap" style="position:relative;margin-bottom:16px">';
  html += '<div style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);pointer-events:none;display:flex;align-items:center;transition:color .2s" id="standar-search-icon">';
  html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  html += '</div>';
  html += '<input type="text" id="standar-search-input" placeholder="Cari standar (SNI, ISO, HDPE, butt fusion, tekanan, ...)" value="' + (_standarSearchRaw ? _standarSearchRaw.replace(/"/g, '&quot;') : '') + '" ';
  html += 'oninput="_standarSearchHandler(this.value)" ';
  html += 'onfocus="document.getElementById(\'standar-search-icon\').style.color=\'#00e5ff\';this.parentElement.style.boxShadow=\'0 0 0 2px rgba(0,229,255,.2)\'" ';
  html += 'onblur="document.getElementById(\'standar-search-icon\').style.color=\'var(--text2)\';this.parentElement.style.boxShadow=\'none\'" ';
  html += 'style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 40px 12px 42px;color:#fff;font-size:13px;font-family:\'Inter\',sans-serif;outline:none;transition:all .25s" />';
  if (searchQuery) {
    html += '<button onclick="_standarSearchQuery=\'\';_standarSearchRaw=\'\';document.getElementById(\'standar-search-input\').value=\'\';renderStandarAcuan(\'' + activeFilter.replace(/'/g, "\\'") + '\')" ';
    html += 'style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:var(--text2);width:24px;height:24px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s" ';
    html += 'onmouseenter="this.style.background=\'rgba(255,100,100,.15)\';this.style.borderColor=\'rgba(255,100,100,.3)\';this.style.color=\'#ff6b6b\'" ';
    html += 'onmouseleave="this.style.background=\'rgba(255,255,255,.08)\';this.style.borderColor=\'rgba(255,255,255,.1)\';this.style.color=\'var(--text2)\'">';
    html += '&times;</button>';
  }
  html += '</div>';

  // Dropdown filter
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap">';
  html += '<span style="font-size:12px;color:var(--text2)">Filter kategori:</span>';
  const allActive = activeFilter === 'all' ? 'background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.25)' : 'background:rgba(255,255,255,.03);color:var(--text2);border-color:rgba(255,255,255,.08)';
  html += '<button onclick="renderStandarAcuan(' + "'all'" + ')" style="' + allActive + ';border:1px solid;padding:5px 14px;border-radius:20px;font-size:11px;font-family:' + "'Space Grotesk'" + ',sans-serif;cursor:pointer;transition:all .2s;font-weight:600">Semua Kategori</button>';
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const d = pipeStandards[cat];
    const rgb = parseInt(d.color.slice(1,3),16)+','+parseInt(d.color.slice(3,5),16)+','+parseInt(d.color.slice(5,7),16);
    const isActive = activeFilter === cat;
    const btnStyle = isActive ? 'background:rgba('+rgb+',.15);color:'+d.color+';border-color:rgba('+rgb+',.4)' : 'background:rgba(255,255,255,.03);color:var(--text2);border-color:rgba(255,255,255,.08)';
    html += '<button onclick="renderStandarAcuan(' + "'" + cat.replace(/'/g,"\\'") + "'" + ')" style="' + btnStyle + ';border:1px solid;padding:5px 14px;border-radius:20px;font-size:11px;font-family:' + "'Space Grotesk'" + ',sans-serif;cursor:pointer;transition:all .2s;font-weight:600">' + d.icon + ' ' + cat.split(' (')[0] + '</button>';
  }
  html += '</div>';

  // Render categories (with search filtering)
  const entriesToRender = activeFilter === 'all' ? Object.entries(pipeStandards) : [[activeFilter, pipeStandards[activeFilter]]];
  let totalMatchCount = 0;

  let contentHtml = '';
  for (const [category, data] of entriesToRender) {
    if (!data) continue;

    // Filter items by search query
    let filteredItems = data.items;
    if (searchQuery) {
      filteredItems = data.items.filter(function(item) {
        const haystack = (item.std + ' ' + item.title + ' ' + item.scope + ' ' + item.type + ' ' + category).toLowerCase();
        return haystack.indexOf(searchQuery) !== -1;
      });
      if (filteredItems.length === 0) continue;
    }
    totalMatchCount += filteredItems.length;

    const rgb = parseInt(data.color.slice(1,3),16)+','+parseInt(data.color.slice(3,5),16)+','+parseInt(data.color.slice(5,7),16);
    contentHtml += '<div class="std-category" style="margin-bottom:24px">';
    contentHtml += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 14px;background:rgba('+rgb+',.08);border:1px solid rgba('+rgb+',.2);border-radius:8px">';
    contentHtml += '<span style="color:'+data.color+'">'+data.icon+'</span>';
    contentHtml += '<span style="font-family:' + "'Space Grotesk'" + ',sans-serif;font-size:15px;font-weight:700;color:'+data.color+'">'+category+'</span>';
    contentHtml += '<span style="margin-left:auto;font-size:11px;color:var(--text2);font-family:' + "'JetBrains Mono'" + ',monospace">'+filteredItems.length+' dokumen</span>';
    contentHtml += '</div>';
    contentHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:10px">';

    for (const item of filteredItems) {
      const typeColors = {
        'SNI':'#ff6d00','ISO':'#00bcd4','JIS':'#e91e63','DVS':'#9c27b0','AWWA':'#2196f3',
        'ASTM':'#ff5722','AS/NZS':'#4caf50','BS EN':'#3f51b5','DIN':'#795548','EN':'#607d8b',
        'PAS':'#ff9800','BS':'#3f51b5','PPI':'#26c6da','WIS':'#ab47bc'
      };
      const tc = typeColors[item.type] || '#888';
      const tcRgb = parseInt(tc.slice(1,3),16)+','+parseInt(tc.slice(3,5),16)+','+parseInt(tc.slice(5,7),16);

      const displayStd = searchQuery ? _highlightMatch(item.std, searchQuery) : item.std;
      const displayTitle = searchQuery ? _highlightMatch(item.title, searchQuery) : item.title;
      const displayScope = searchQuery ? _highlightMatch(item.scope, searchQuery) : item.scope;

      contentHtml += '<div class="std-card" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:12px 14px;transition:all .2s;cursor:default' + (searchQuery ? ';animation:fadeUp .3s ease-out' : '') + '" onmouseenter="this.style.borderColor=' + "'rgba("+rgb+',.3)' + "'" + ';this.style.background=' + "'rgba("+rgb+',.04)' + "'" + '" onmouseleave="this.style.borderColor=' + "'rgba(255,255,255,.06)'" + ';this.style.background=' + "'rgba(255,255,255,.03)'" + '">';
      contentHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
      contentHtml += '<span style="font-family:' + "'JetBrains Mono'" + ',monospace;font-size:12px;font-weight:700;color:'+data.color+'">'+displayStd+'</span>';
      contentHtml += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba('+tcRgb+',.15);color:'+tc+';font-weight:600;letter-spacing:.5px">'+item.type+'</span>';
      contentHtml += '</div>';
      contentHtml += '<div style="font-size:12.5px;color:#e0e0e0;font-weight:600;margin-bottom:4px;line-height:1.4">'+displayTitle+'</div>';
      contentHtml += '<div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px">'+displayScope+'</div>';
      if (item.pdf) {
        contentHtml += '<a href="'+item.pdf+'" target="_blank" class="std-pdf-btn" style="display:inline-flex;align-items:center;gap:5px;font-size:10px;padding:4px 10px;border-radius:5px;background:rgba('+rgb+',.1);border:1px solid rgba('+rgb+',.2);color:'+data.color+';text-decoration:none;font-weight:600;font-family:' + "'Space Grotesk'" + ',sans-serif;transition:all .2s;cursor:pointer" onmouseenter="this.style.background=' + "'rgba("+rgb+",.2)'" + '" onmouseleave="this.style.background=' + "'rgba("+rgb+",.1)'" + '">';
        contentHtml += '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
        contentHtml += 'Buka PDF</a>';
      }
      contentHtml += '</div>';
    }
    contentHtml += '</div></div>';
  }

  // Search results summary
  if (searchQuery) {
    if (totalMatchCount > 0) {
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:8px 14px;background:rgba(0,229,255,.05);border:1px solid rgba(0,229,255,.12);border-radius:8px;animation:fadeUp .2s ease-out">';
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
      html += '<span style="font-size:12px;color:var(--text2)">Ditemukan <strong style="color:#00e5ff">' + totalMatchCount + '</strong> standar untuk "<strong style="color:#fff">' + searchQuery.replace(/</g,'&lt;') + '</strong>"</span>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;text-align:center;animation:fadeUp .3s ease-out">';
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.25;margin-bottom:16px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="8" x2="14" y2="14"/><line x1="14" y1="8" x2="8" y2="14"/></svg>';
      html += '<div style="font-size:14px;color:var(--text2);font-weight:600;margin-bottom:6px">Tidak ditemukan standar untuk "<span style="color:#fff">' + searchQuery.replace(/</g,'&lt;') + '</span>"</div>';
      html += '<div style="font-size:12px;color:rgba(142,155,176,.6);line-height:1.6;max-width:320px">Coba kata kunci lain, misalnya: <span style="color:var(--text2);cursor:pointer;text-decoration:underline" onclick="document.getElementById(\'standar-search-input\').value=\'HDPE\';_standarSearchHandler(\'HDPE\')">HDPE</span>, <span style="color:var(--text2);cursor:pointer;text-decoration:underline" onclick="document.getElementById(\'standar-search-input\').value=\'fusion\';_standarSearchHandler(\'fusion\')">fusion</span>, <span style="color:var(--text2);cursor:pointer;text-decoration:underline" onclick="document.getElementById(\'standar-search-input\').value=\'tekanan\';_standarSearchHandler(\'tekanan\')">tekanan</span>, atau <span style="color:var(--text2);cursor:pointer;text-decoration:underline" onclick="document.getElementById(\'standar-search-input\').value=\'SNI\';_standarSearchHandler(\'SNI\')">SNI</span></div>';
      html += '</div>';
    }
  }

  html += contentHtml;

  container.innerHTML = html;

  // Restore focus to search input if there's a query
  if (searchQuery) {
    const input = document.getElementById('standar-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  if (!searchQuery) container.scrollTop = 0;
}

// ==================== PUSTAKA TEKNIS ====================
let _pustakaSearchQuery = '';
let _pustakaSearchRaw = '';
let _pustakaSearchTimeout = null;
let _pustakaActiveCat = 'all';
let _pustakaActiveMat = 'all';

function _pustakaSearchHandler(value) {
  clearTimeout(_pustakaSearchTimeout);
  _pustakaSearchRaw = value;
  _pustakaSearchTimeout = setTimeout(function() {
    _pustakaSearchQuery = value.toLowerCase();
    renderPustakaTeknis();
  }, 250);
}

function renderPustakaTeknis(catFilter, matFilter) {
  const container = document.getElementById('library-pustaka');
  if (catFilter !== undefined) _pustakaActiveCat = catFilter;
  if (matFilter !== undefined) _pustakaActiveMat = matFilter;
  const activeCat = _pustakaActiveCat;
  const activeMat = _pustakaActiveMat;
  const sq = _pustakaSearchQuery;

  // Filter data
  let items = pustakaData.filter(function(item) {
    if (activeCat !== 'all' && item.cat !== activeCat) return false;
    if (activeMat !== 'all' && item.material !== activeMat) return false;
    if (sq) {
      const h = (item.title + ' ' + item.author + ' ' + item.summary + ' ' + item.tags.join(' ') + ' ' + item.material + ' ' + item.id).toLowerCase();
      if (h.indexOf(sq) === -1) return false;
    }
    return true;
  });

  // Header
  let html = '<div style="margin-bottom:16px;font-family:\'Space Grotesk\',sans-serif;font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px">';
  html += '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sys-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>';
  html += ' Pustaka Teknis — Handbook, Jurnal & Panduan Pipa Plastik</div>';
  html += '<div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.6">Koleksi handbook, technical notes, jurnal riset, panduan teknis, dan regulasi terkait pipa plastik (HDPE, PVC, PVC-O, PPR).</div>';

  // Search bar
  html += '<div style="position:relative;margin-bottom:14px">';
  html += '<div style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text2);pointer-events:none;display:flex;align-items:center" id="pustaka-search-icon">';
  html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>';
  html += '<input type="text" id="pustaka-search-input" placeholder="Cari handbook, jurnal, panduan teknis..." value="' + (_pustakaSearchRaw || '').replace(/"/g,'&quot;') + '" ';
  html += 'oninput="_pustakaSearchHandler(this.value)" ';
  html += 'onfocus="document.getElementById(\'pustaka-search-icon\').style.color=\'#00e5ff\';this.parentElement.style.boxShadow=\'0 0 0 2px rgba(0,229,255,.2)\'" ';
  html += 'onblur="document.getElementById(\'pustaka-search-icon\').style.color=\'var(--text2)\';this.parentElement.style.boxShadow=\'none\'" ';
  html += 'style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 40px 12px 42px;color:#fff;font-size:13px;font-family:\'Inter\',sans-serif;outline:none;transition:all .25s" />';
  if (sq) {
    html += '<button onclick="_pustakaSearchQuery=\'\';_pustakaSearchRaw=\'\';renderPustakaTeknis()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:var(--text2);width:24px;height:24px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s" onmouseenter="this.style.color=\'#ff6b6b\'" onmouseleave="this.style.color=\'var(--text2)\'">&times;</button>';
  }
  html += '</div>';

  // Category filter
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">';
  html += '<span style="font-size:11px;color:var(--text2)">Kategori:</span>';
  var catBtnStyle = function(isActive, color) {
    return isActive ? 'background:rgba(' + color + ',.15);color:rgb(' + color + ');border-color:rgba(' + color + ',.4)' : 'background:rgba(255,255,255,.03);color:var(--text2);border-color:rgba(255,255,255,.08)';
  };
  html += '<button onclick="renderPustakaTeknis(\'all\')" style="' + catBtnStyle(activeCat==='all','255,255,255') + ';border:1px solid;padding:4px 12px;border-radius:20px;font-size:10px;font-family:\'Space Grotesk\',sans-serif;cursor:pointer;font-weight:600">Semua</button>';
  Object.keys(pustakaCategoryMeta).forEach(function(key) {
    var m = pustakaCategoryMeta[key];
    var r = parseInt(m.color.slice(1,3),16), g = parseInt(m.color.slice(3,5),16), b = parseInt(m.color.slice(5,7),16);
    html += '<button onclick="renderPustakaTeknis(\'' + key + '\')" style="' + catBtnStyle(activeCat===key, r+','+g+','+b) + ';border:1px solid;padding:4px 12px;border-radius:20px;font-size:10px;font-family:\'Space Grotesk\',sans-serif;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:4px">' + m.icon + ' ' + m.label + '</button>';
  });
  html += '</div>';

  // Material filter
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap">';
  html += '<span style="font-size:11px;color:var(--text2)">Material:</span>';
  html += '<button onclick="renderPustakaTeknis(undefined,\'all\')" style="' + catBtnStyle(activeMat==='all','255,255,255') + ';border:1px solid;padding:4px 12px;border-radius:20px;font-size:10px;font-family:\'Space Grotesk\',sans-serif;cursor:pointer;font-weight:600">Semua</button>';
  Object.keys(pustakaMatColors).forEach(function(mat) {
    var c = pustakaMatColors[mat];
    var r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
    html += '<button onclick="renderPustakaTeknis(undefined,\'' + mat + '\')" style="' + catBtnStyle(activeMat===mat, r+','+g+','+b) + ';border:1px solid;padding:4px 12px;border-radius:20px;font-size:10px;font-family:\'Space Grotesk\',sans-serif;cursor:pointer;font-weight:600">' + mat + '</button>';
  });
  html += '</div>';

  // Results count
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  html += '<span style="font-size:12px;color:var(--text2)">' + (sq ? 'Hasil pencarian: ' : 'Total: ') + '<strong style="color:#00e5ff">' + items.length + '</strong> dokumen</span>';
  html += '</div>';

  if (items.length === 0) {
    html += '<div style="text-align:center;padding:48px 20px;color:var(--text2)">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.2;margin-bottom:12px"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>';
    html += '<div style="font-size:13px;font-weight:600">Tidak ada dokumen ditemukan</div>';
    html += '<div style="font-size:11px;color:rgba(142,155,176,.6);margin-top:4px">Coba ubah filter atau kata kunci pencarian</div></div>';
  } else {
    // Table header
    html += '<div style="display:grid;grid-template-columns:minmax(0,2.5fr) minmax(0,1.2fr) 70px 70px 80px 90px;gap:0;border:1px solid rgba(255,255,255,.08);border-radius:8px;overflow:hidden;font-size:11px">';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px">JUDUL</div>';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px">PENERBIT</div>';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px;text-align:center">TAHUN</div>';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px;text-align:center">MATERIAL</div>';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px;text-align:center">KATEGORI</div>';
    html += '<div style="background:rgba(0,229,255,.06);padding:10px 14px;color:#00e5ff;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px;text-align:center">AKSES</div>';

    items.forEach(function(item, idx) {
      var catM = pustakaCategoryMeta[item.cat] || { label:item.cat, color:'#888' };
      var matC = pustakaMatColors[item.material] || '#888';
      var catR = parseInt(catM.color.slice(1,3),16), catG = parseInt(catM.color.slice(3,5),16), catB = parseInt(catM.color.slice(5,7),16);
      var matR = parseInt(matC.slice(1,3),16), matG = parseInt(matC.slice(3,5),16), matB = parseInt(matC.slice(5,7),16);
      var rowBg = idx % 2 === 0 ? 'rgba(255,255,255,.015)' : 'rgba(255,255,255,.035)';
      var bdr = 'border-bottom:1px solid rgba(255,255,255,.04)';
      var hoverAttr = 'onmouseenter="this.parentElement.querySelectorAll(\'[data-row=row' + idx + ']\').forEach(function(e){e.style.background=\'rgba(0,229,255,.04)\'})" onmouseleave="this.parentElement.querySelectorAll(\'[data-row=row' + idx + ']\').forEach(function(e){e.style.background=\'' + rowBg + '\'})"';

      // Title cell with expandable summary
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';cursor:pointer" ' + hoverAttr + ' onclick="var el=document.getElementById(\'pst-sum-' + idx + '\');el.style.display=el.style.display===\'block\'?\'none\':\'block\'">';
      html += '<div style="font-weight:600;color:#e0e0e0;line-height:1.4;font-size:12px">' + item.title + '</div>';
      html += '<div id="pst-sum-' + idx + '" style="display:none;margin-top:6px;font-size:11px;color:var(--text2);line-height:1.5;padding:6px 8px;background:rgba(255,255,255,.03);border-radius:4px;border-left:2px solid ' + catM.color + '">' + item.summary;
      if (item.tags.length) {
        html += '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">';
        item.tags.forEach(function(t) { html += '<span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(255,255,255,.06);color:var(--text2)">' + t + '</span>'; });
        html += '</div>';
      }
      html += '</div></div>';

      // Author
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';color:var(--text2);font-size:11px;line-height:1.4" ' + hoverAttr + '>' + item.author + '</div>';

      // Year
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';text-align:center;color:var(--text2);font-family:\'JetBrains Mono\',monospace;font-size:11px" ' + hoverAttr + '>' + item.year + '</div>';

      // Material badge
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';text-align:center" ' + hoverAttr + '>';
      html += '<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(' + matR + ',' + matG + ',' + matB + ',.12);color:' + matC + ';font-weight:600">' + item.material + '</span></div>';

      // Category badge
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';text-align:center" ' + hoverAttr + '>';
      html += '<span style="font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(' + catR + ',' + catG + ',' + catB + ',.12);color:' + catM.color + ';font-weight:600">' + catM.label.split(' ')[0] + '</span></div>';

      // Access link
      var accessColor = item.access === 'open' ? '#00e676' : item.access === 'purchase' ? '#ffd740' : '#ff9800';
      var accessLabel = item.access === 'open' ? 'Open' : item.access === 'purchase' ? 'Beli' : 'Member';
      html += '<div data-row="row' + idx + '" style="padding:10px 14px;background:' + rowBg + ';' + bdr + ';text-align:center;display:flex;align-items:center;justify-content:center;gap:6px" ' + hoverAttr + '>';
      if (item.url) {
        html += '<a href="' + item.url + '" target="_blank" style="display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:3px 8px;border-radius:4px;background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.2);color:#00e5ff;text-decoration:none;font-weight:600;transition:all .2s" onmouseenter="this.style.background=\'rgba(0,229,255,.15)\'" onmouseleave="this.style.background=\'rgba(0,229,255,.08)\'">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
        html += accessLabel + '</a>';
      }
      html += '</div>';
    });
    html += '</div>';
  }

  // Stats footer
  var stats = {};
  pustakaData.forEach(function(d) { stats[d.cat] = (stats[d.cat]||0) + 1; });
  html += '<div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap">';
  Object.keys(pustakaCategoryMeta).forEach(function(k) {
    var m = pustakaCategoryMeta[k];
    var r = parseInt(m.color.slice(1,3),16)+','+parseInt(m.color.slice(3,5),16)+','+parseInt(m.color.slice(5,7),16);
    html += '<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba('+r+',.06);border:1px solid rgba('+r+',.12);border-radius:6px">';
    html += '<span style="color:'+m.color+'">'+m.icon+'</span>';
    html += '<span style="font-size:11px;color:var(--text2)">' + m.label + '</span>';
    html += '<span style="font-size:12px;font-weight:700;color:'+m.color+';font-family:\'JetBrains Mono\',monospace">' + (stats[k]||0) + '</span>';
    html += '</div>';
  });
  html += '</div>';

  container.innerHTML = html;

  if (sq) {
    var inp = document.getElementById('pustaka-search-input');
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  }
  if (!sq) container.scrollTop = 0;
}

function resetCompPanel() {
  const count = Object.keys(systemConfig[currentSystem].compData()).length;
  document.getElementById('comp-panel').innerHTML = `
    <div class="placeholder">
      <div class="ph-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.2"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg></div>
      <div class="ph-text">Klik salah satu komponen pada diagram di sebelah kiri</div>
      <div class="ph-hint">${count} KOMPONEN TERSEDIA</div>
    </div>`;
  document.getElementById('comp-count').textContent = count + ' komponen';
}

function resetCalcResults() {
  document.getElementById('rec-results').innerHTML = `
    <div class="rec-placeholder">
      <div><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.2; margin-bottom: 10px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
      <div style="font-size:13px;color:var(--text2);max-width:220px;line-height:1.7;text-align:center">
        Isi data di panel kiri, lalu klik <strong style="color:var(--sys-accent)">Hitung</strong>
        untuk mendapatkan spesifikasi teknis otomatis
      </div>
    </div>`;
}

// ==================== TAB SWITCHING ====================
function switchTab(t) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + t).classList.add('active');
  // Update sidebar sub active state
  document.querySelectorAll('.sidebar-sub').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-tab') === t);
  });
}

// ==================== COMPONENT INTERACTION ====================
function selectComp(id) {
  const d = systemConfig[currentSystem].compData()[id];
  if (!d) return;
  document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('selected'));
  const el = document.getElementById('hp-' + id);
  if (el) el.classList.add('selected');
  document.getElementById('comp-panel').innerHTML = `
    <div class="cp-header">
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac};color:${d.ac}">${d.icon}</div>
      <div>
        <div class="cp-name">${d.name}</div>
        <div class="cp-code" style="color:${d.ac}">${d.code}</div>
      </div>
    </div>
    <div class="cp-desc">${d.desc}</div>
    <div class="section-label">Spesifikasi Teknis</div>
    ${d.specs.map(([k, v]) => `<div class="spec-row"><span class="sk">${k}</span><span class="sv" style="color:${d.ac}">${v}</span></div>`).join('')}
    <div class="tips-box">
      <div class="tips-title">Tips Instalasi</div>
      <ul class="tips-list">${d.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>`;
}

function buildCompGrid() {
  const data = systemConfig[currentSystem].compData();
  const tags = systemConfig[currentSystem].tagMap;
  document.getElementById('comp-grid').innerHTML = Object.entries(data).map(([id, d]) => {
    const rgb = parseInt(d.ac.slice(1, 3), 16) + ',' + parseInt(d.ac.slice(3, 5), 16) + ',' + parseInt(d.ac.slice(5, 7), 16);
    return `<div class="comp-card" onclick="openModal('${id}')">
      <div class="cc-icon" style="color:${d.ac}">${d.icon}</div>
      <div class="cc-name">${d.name}</div>
      <div class="cc-code" style="color:${d.ac}">${d.code}</div>
      <div class="cc-desc">${d.desc.slice(0, 110)}...</div>
      <div class="cc-tag" style="background:rgba(${rgb},.1);color:${d.ac};border:1px solid rgba(${rgb},.25)">${tags[id] || 'Komponen'}</div>
    </div>`;
  }).join('');
}

function openModal(id) {
  const d = systemConfig[currentSystem].compData()[id];
  document.getElementById('modal-content').innerHTML = `
    <button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('open')">×</button>
    <div class="cp-header" style="margin-top:4px">
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac};color:${d.ac}">${d.icon}</div>
      <div><div class="cp-name">${d.name}</div><div class="cp-code" style="color:${d.ac}">${d.code}</div></div>
    </div>
    <div class="cp-desc">${d.desc}</div>
    <div class="section-label">Spesifikasi Teknis</div>
    ${d.specs.map(([k, v]) => `<div class="spec-row"><span class="sk">${k}</span><span class="sv" style="color:${d.ac}">${v}</span></div>`).join('')}
    <div class="tips-box">
      <div class="tips-title">Tips Instalasi</div>
      <ul class="tips-list">${d.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>`;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e && e.target === document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').classList.remove('open');
}

// ==================== GUIDE ====================
function buildGuide() {
  const data = systemConfig[currentSystem].guideData();
  totalChecks = data.reduce((a, s) => a + s.checks.length, 0);
  doneChecks = 0;
  document.getElementById('prog-label').textContent = `0 / ${totalChecks} item selesai`;
  document.getElementById('prog-bar').style.width = '0%';
  document.getElementById('guide-steps').innerHTML = data.map(s => `
    <div class="step-card" id="sc-${s.n}">
      <div class="step-header" onclick="toggleStep(${s.n})">
        <div class="step-num" id="sn-${s.n}">${s.n}</div>
        <div class="step-title-wrap">
          <div class="step-title">${s.title}</div>
          <div class="step-sub">${s.sub}</div>
        </div>
        <div class="step-chevron">⌄</div>
      </div>
      <div class="step-body">
        <p class="step-detail">${s.detail}</p>
        <div class="section-label">Checklist Pekerjaan</div>
        <div class="step-checklist">
          ${s.checks.map((c, i) => `
            <label class="check-item" id="ci-${s.n}-${i}">
              <input type="checkbox" onchange="onCheck(${s.n},${i},this)">
              <span>${c}</span>
            </label>`).join('')}
        </div>
        <div class="step-warning"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> <span>${s.warn}</span></div>
      </div>
    </div>`).join('');
}

function toggleStep(n) { document.getElementById('sc-' + n).classList.toggle('open'); }

function onCheck(step, item, cb) {
  document.getElementById(`ci-${step}-${item}`).classList.toggle('checked', cb.checked);
  doneChecks = document.querySelectorAll('.step-checklist input:checked').length;
  const pct = Math.round((doneChecks / totalChecks) * 100);
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('prog-label').textContent = `${doneChecks} / ${totalChecks} item selesai`;
  const stepChecks = document.querySelectorAll(`#sc-${step} input`);
  const stepDone = [...stepChecks].every(x => x.checked);
  document.getElementById('sn-' + step).classList.toggle('done', stepDone);
}

// ==================== DROPDOWN MENU ====================
function toggleDropdown(e) {
  if (e) e.stopPropagation();
  const content = document.getElementById('sys-dropdown-content');
  const chevron = document.getElementById('sys-main-chevron');
  if (!content) return;
  const isShowing = content.classList.contains('show');
  
  if (isShowing) {
    content.classList.remove('show');
    if(chevron) chevron.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('show');
    if(chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

window.addEventListener('click', function(event) {
  if (!event.target.closest('.sys-dropdown')) {
    const content = document.getElementById('sys-dropdown-content');
    const chevron = document.getElementById('sys-main-chevron');
    if (content && content.classList.contains('show')) {
      content.classList.remove('show');
      if(chevron) chevron.style.transform = 'rotate(0deg)';
    }
  }
});

// ==================== INIT ====================
buildSVG();
buildCompGrid();
buildGuide();
buildCalcForm();
