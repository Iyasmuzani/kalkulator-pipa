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

// ==================== SYSTEM SWITCHING ====================
function switchSystem(sys) {
  currentSystem = sys;
  document.documentElement.setAttribute('data-system', sys);
  // Hide eng and library tools, show normal UI
  document.getElementById('eng-panel').style.display = 'none';
  if (document.getElementById('library-panel')) document.getElementById('library-panel').style.display = 'none';
  document.querySelector('.tabs').style.display = '';
  document.querySelector('.content').style.display = '';
  
  // Handle active states for new dropdown structure
  document.querySelectorAll('.sys-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sys-dropdown-item').forEach(b => b.classList.remove('active'));
  
  document.getElementById('sys-main-btn').classList.add('active');
  document.getElementById('sys-' + sys).classList.add('active');
  
  // Close dropdown
  document.getElementById('sys-dropdown-content').classList.remove('show');
  const chevron = document.getElementById('sys-main-chevron');
  if(chevron) chevron.style.transform = 'rotate(0deg)';

  const cfg = systemConfig[sys];
  document.getElementById('hdr-title').textContent = cfg.title;
  document.getElementById('hdr-sub').textContent = cfg.sub;
  document.getElementById('hdr-badge').textContent = cfg.badge;
  document.getElementById('hdr-icon').innerHTML = cfg.icon;
  document.getElementById('viz-label').textContent = cfg.vizLabel;
  document.getElementById('guide-intro-text').innerHTML = cfg.guideIntro;

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
  document.querySelectorAll('.sys-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sys-dropdown-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sys-engineering').classList.add('active');
  document.querySelector('.tabs').style.display = 'none';
  document.querySelector('.content').style.display = 'none';
  if (document.getElementById('library-panel')) document.getElementById('library-panel').style.display = 'none';
  document.getElementById('eng-panel').style.display = 'block';
  document.getElementById('hdr-title').textContent = 'Engineering Tools';
  document.getElementById('hdr-sub').textContent = 'Butt fusion HDPE · Pressure loss · Buoyancy · Water hammer · Friction · Pipe load · Curah Hujan';
  document.getElementById('hdr-badge').textContent = '';
  document.getElementById('hdr-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>';
  switchEngTool(currentEngTool);
}

function exitEngTools() {
  document.getElementById('eng-panel').style.display = 'none';
  document.querySelector('.tabs').style.display = '';
  document.querySelector('.content').style.display = '';
  switchSystem(currentSystem);
}

function switchEngTool(tool) {
  currentEngTool = tool;
  document.querySelectorAll('.eng-tab').forEach((b, i) => {
    const tools = ['fusion', 'pressloss', 'buoyancy', 'waterhammer', 'friction', 'pipeload', 'rainfall', 'tensile', 'unitconv', 'matguide'];
    b.classList.toggle('active', tools[i] === tool);
  });
  const builders = {
    fusion: buildFusionForm,
    pressloss: buildPressLossForm,
    buoyancy: buildBuoyancyForm,
    waterhammer: buildWaterHammerForm,
    friction: buildFrictionForm,
    pipeload: buildPipeLoadForm,
    rainfall: buildRainfallForm,
    tensile: buildTensileForm,
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
  document.querySelectorAll('.sys-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sys-dropdown-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sys-library').classList.add('active');
  document.querySelector('.tabs').style.display = 'none';
  document.querySelector('.content').style.display = 'none';
  document.getElementById('eng-panel').style.display = 'none';
  if (document.getElementById('library-panel')) document.getElementById('library-panel').style.display = 'block';
  
  document.getElementById('hdr-title').textContent = 'Library & Form';
  document.getElementById('hdr-sub').textContent = 'Kumpulan dokumen, checklist, dan form standar';
  document.getElementById('hdr-badge').textContent = '';
  document.getElementById('hdr-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>';
  
  switchLibraryForm('siphonic');
}

function switchLibraryForm(formId) {
  document.querySelectorAll('#library-subtabs .eng-tab').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector('#library-subtabs .eng-tab[data-lib="' + formId + '"]');
  if (activeBtn) activeBtn.classList.add('active');

  const iframeWrap = document.getElementById('library-content');
  const standarWrap = document.getElementById('library-standar');

  if (formId === 'siphonic') {
    iframeWrap.style.display = 'block';
    standarWrap.style.display = 'none';
    document.getElementById('library-iframe').src = 'form-siphonic.html';
  } else if (formId === 'standar') {
    iframeWrap.style.display = 'none';
    standarWrap.style.display = 'block';
    renderStandarAcuan();
  }
}

// ==================== STANDAR ACUAN PIPA PLASTIK ====================
const pipeStandards = {
  'HDPE (High-Density Polyethylene)': {
    color: '#00bcd4',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/></svg>',
    items: [
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

function renderStandarAcuan(filterKey) {
  const container = document.getElementById('library-standar');
  const categories = Object.keys(pipeStandards);
  const activeFilter = filterKey || 'all';

  // Header
  let html = '<div style="margin-bottom:16px;font-family:' + "'Space Grotesk'" + ',sans-serif;font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sys-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg> Referensi Standar Acuan — Pipa Plastik</div>';
  html += '<div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.6">Kumpulan standar nasional dan internasional yang menjadi acuan desain, manufaktur, pengujian, dan instalasi pipa plastik.</div>';

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

  // Render categories
  const entriesToRender = activeFilter === 'all' ? Object.entries(pipeStandards) : [[activeFilter, pipeStandards[activeFilter]]];
  for (const [category, data] of entriesToRender) {
    if (!data) continue;
    const rgb = parseInt(data.color.slice(1,3),16)+','+parseInt(data.color.slice(3,5),16)+','+parseInt(data.color.slice(5,7),16);
    html += '<div class="std-category" style="margin-bottom:24px">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 14px;background:rgba('+rgb+',.08);border:1px solid rgba('+rgb+',.2);border-radius:8px">';
    html += '<span style="color:'+data.color+'">'+data.icon+'</span>';
    html += '<span style="font-family:' + "'Space Grotesk'" + ',sans-serif;font-size:15px;font-weight:700;color:'+data.color+'">'+category+'</span>';
    html += '<span style="margin-left:auto;font-size:11px;color:var(--text2);font-family:' + "'JetBrains Mono'" + ',monospace">'+data.items.length+' dokumen</span>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:10px">';

    for (const item of data.items) {
      const typeColors = {
        'SNI':'#ff6d00','ISO':'#00bcd4','JIS':'#e91e63','DVS':'#9c27b0','AWWA':'#2196f3',
        'ASTM':'#ff5722','AS/NZS':'#4caf50','BS EN':'#3f51b5','DIN':'#795548','EN':'#607d8b',
        'PAS':'#ff9800','BS':'#3f51b5','PPI':'#26c6da','WIS':'#ab47bc'
      };
      const tc = typeColors[item.type] || '#888';
      const tcRgb = parseInt(tc.slice(1,3),16)+','+parseInt(tc.slice(3,5),16)+','+parseInt(tc.slice(5,7),16);
      html += '<div class="std-card" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:12px 14px;transition:all .2s;cursor:default" onmouseenter="this.style.borderColor=' + "'rgba("+rgb+',.3)' + "'" + ';this.style.background=' + "'rgba("+rgb+',.04)' + "'" + '" onmouseleave="this.style.borderColor=' + "'rgba(255,255,255,.06)'" + ';this.style.background=' + "'rgba(255,255,255,.03)'" + '">';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
      html += '<span style="font-family:' + "'JetBrains Mono'" + ',monospace;font-size:12px;font-weight:700;color:'+data.color+'">'+item.std+'</span>';
      html += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba('+tcRgb+',.15);color:'+tc+';font-weight:600;letter-spacing:.5px">'+item.type+'</span>';
      html += '</div>';
      html += '<div style="font-size:12.5px;color:#e0e0e0;font-weight:600;margin-bottom:4px;line-height:1.4">'+item.title+'</div>';
      html += '<div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px">'+item.scope+'</div>';
      if (item.pdf) {
        html += '<a href="'+item.pdf+'" target="_blank" class="std-pdf-btn" style="display:inline-flex;align-items:center;gap:5px;font-size:10px;padding:4px 10px;border-radius:5px;background:rgba('+rgb+',.1);border:1px solid rgba('+rgb+',.2);color:'+data.color+';text-decoration:none;font-weight:600;font-family:' + "'Space Grotesk'" + ',sans-serif;transition:all .2s;cursor:pointer" onmouseenter="this.style.background=' + "'rgba("+rgb+",.2)'" + '" onmouseleave="this.style.background=' + "'rgba("+rgb+",.1)'" + '">';
        html += '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
        html += 'Buka PDF</a>';
      }
      html += '</div>';
    }
    html += '</div></div>';
  }

  container.innerHTML = html;
  container.scrollTop = 0;
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
  const tabNames = ['visualisasi', 'komponen', 'panduan', 'kalkulator'];
  document.querySelectorAll('.tab').forEach((el, i) => {
    el.classList.toggle('active', tabNames[i] === t);
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + t).classList.add('active');
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
