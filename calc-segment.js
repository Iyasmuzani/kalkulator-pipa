// ===== SEGMEN APLIKASI HDPE — MATERIAL PROPERTIES GUIDE =====

// --- All Material Property Parameters ---
const segmentParams = {
  tensile_yield: {
    name: 'Tensile Strength at Yield',
    explain: 'Seberapa kuat pipa menahan tarikan sebelum mulai berubah bentuk permanen — seperti karet gelang yang ditarik sampai mulai melar. Jika gaya tarik melebihi nilai ini, pipa akan cacat permanen.',
    testStd: 'ISO 527-2 / ASTM D638',
    typical: '22 – 26',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M7 11H6a3 3 0 0 0 0 6h1"/><path d="M7 14h10"/></svg>'
  },
  tensile_break: {
    name: 'Tensile Strength at Break',
    explain: 'Seberapa kuat tarikan yang dibutuhkan sampai pipa benar-benar putus. Angka ini selalu lebih tinggi dari tensile yield karena material PE akan meregang dulu sebelum putus.',
    testStd: 'ISO 527-2 / ASTM D638',
    typical: '≥ 35',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M7 11H6a3 3 0 0 0 0 6h1"/><path d="M7 14h10"/></svg>'
  },
  elongation: {
    name: 'Elongation at Break',
    explain: 'Seberapa jauh pipa bisa diregangkan sebelum putus, dinyatakan dalam persen (%). Pipa HDPE PE100 bisa meregang hingga 600% — artinya sangat lentur dan tidak mudah patah, berbeda dengan PVC yang getas.',
    testStd: 'ISO 527-2 / ASTM D638',
    typical: '≥ 600',
    unit: '%',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/></svg>'
  },
  flexural_modulus: {
    name: 'Flexural Modulus (Modulus Lentur)',
    explain: 'Seberapa kaku pipa saat ditekuk — seperti membandingkan tongkat bambu (kaku, modulus tinggi) vs selang taman (lentur, modulus rendah). Nilai ini menentukan radius minimum pipa bisa dilengkungkan di lapangan.',
    testStd: 'ISO 178 / ASTM D790',
    typical: '900 – 1100',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c1-3 3-8 8-8s6 5 7 8"/><circle cx="18" cy="8" r="2"/></svg>'
  },
  mrs: {
    name: 'MRS (Minimum Required Strength)',
    explain: 'Kekuatan minimum yang dijamin pabrikan selama 50 tahun pada suhu 20°C. Ini adalah "identitas" kelas pipa: PE80 berarti MRS = 8 MPa, PE100 berarti MRS = 10 MPa. Semakin tinggi MRS, semakin tinggi tekanan kerja yang bisa ditahan.',
    testStd: 'ISO 9080 / ISO 12162',
    typical: '10 (PE100) / 8 (PE80)',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  },
  lths: {
    name: 'LTHS (Long-Term Hydrostatic Strength)',
    explain: 'Tekanan air dari dalam yang mampu ditahan pipa selama 50 tahun tanpa pecah. Nilai ini diekstrapolasi dari uji tekanan ribuan jam di laboratorium. Dari LTHS inilah dihitung tekanan nominal (PN) pipa.',
    testStd: 'ISO 9080',
    typical: '≥ 12.4 (PE100)',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M12 22a8 8 0 0 0 8-8"/><path d="M12 22a8 8 0 0 1-8-8"/></svg>'
  },
  hydrostatic_test: {
    name: 'Hydrostatic Pressure Test',
    explain: 'Uji tekanan air untuk memastikan pipa tidak bocor. Pipa diisi air bertekanan tinggi (biasanya 1.5x tekanan nominal) dan ditahan selama 1-1000 jam. Jika tidak bocor atau pecah, pipa lolos uji. Ini adalah uji QC wajib di pabrik.',
    testStd: 'ISO 1167-1 / ISO 1167-2',
    typical: '100 jam @ 12.4 MPa (80°C), 1000 jam @ 5.5 MPa (80°C)',
    unit: 'jam @ tekanan',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12V6"/><path d="M12 2v0"/></svg>'
  },
  scg_fnct: {
    name: 'SCG — Slow Crack Growth (FNCT)',
    explain: 'Ketahanan pipa terhadap retakan yang tumbuh perlahan-lahan. Bayangkan goresan kecil di permukaan pipa — apakah goresan itu akan membesar seiring waktu? Semakin lama waktu FNCT, semakin tahan pipa terhadap retakan lambat. PE100-RC dirancang khusus untuk ketahanan ini.',
    testStd: 'ISO 16770 (FNCT)',
    typical: '≥ 8760 jam (PE100-RC)',
    unit: 'jam',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>'
  },
  rcp: {
    name: 'RCP — Rapid Crack Propagation (S4 Test)',
    explain: 'Ketahanan pipa terhadap retakan yang menjalar sangat cepat — bayangkan retakan pada kaca yang menyebar seketika. Pada pipa gas diameter besar, jika terjadi retakan, ia bisa menjalar ratusan meter dalam hitungan detik. Uji S4 memastikan pipa aman dari fenomena ini.',
    testStd: 'ISO 13477 (S4) / ISO 13478',
    typical: 'Tc < 0°C (harus di bawah suhu operasi)',
    unit: '°C (suhu kritis)',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  },
  oit: {
    name: 'OIT (Oxidation Induction Time)',
    explain: 'Berapa lama antioksidan dalam pipa bertahan sebelum material mulai teroksidasi (rusak). Bayangkan buah apel yang dipotong — semakin lama ia tidak berubah warna (teroksidasi), semakin baik "antioksidannya". Semakin tinggi OIT, semakin awet umur pipa.',
    testStd: 'ISO 11357-6 / ASTM D3895',
    typical: '≥ 20 menit (210°C)',
    unit: 'menit',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
  },
  carbon_black: {
    name: 'Carbon Black Content',
    explain: 'Kadar jelaga hitam (carbon black) dalam pipa. Fungsinya seperti "sunblock" — melindungi plastik dari kerusakan akibat sinar UV matahari. Pipa HDPE hitam wajib mengandung minimal 2% carbon black. Tanpa ini, pipa yang terpapar matahari akan cepat rapuh.',
    testStd: 'ISO 6964',
    typical: '2.0 – 2.5',
    unit: '%',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>'
  },
  carbon_dispersion: {
    name: 'Carbon Black Dispersion',
    explain: 'Seberapa merata jelaga hitam tersebar di dalam material pipa. Jika tidak merata (menggumpal), ada titik-titik lemah yang bisa menjadi awal retakan. Diperiksa dengan memotong sampel tipis pipa dan dilihat di bawah mikroskop.',
    testStd: 'ISO 18553',
    typical: 'Grade ≤ 3',
    unit: 'Grade (1–3)',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12"/></svg>'
  },
  density: {
    name: 'Density (Massa Jenis)',
    explain: 'Berat jenis material pipa — menentukan apakah pipa tenggelam atau mengapung di air. PE100 memiliki densitas ~0.95 g/cm3 (lebih ringan dari air = 1.0), sehingga pipa HDPE kosong akan mengapung. Ini penting untuk desain pipa bawah air.',
    testStd: 'ISO 1183-1 / ASTM D792',
    typical: '0.940 – 0.965',
    unit: 'g/cm3',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
  },
  mfr: {
    name: 'MFR (Melt Flow Rate)',
    explain: 'Seberapa mudah material plastik mengalir saat dipanaskan (leleh). Ini seperti "kekentalan" material saat cair. MFR rendah = kental (cocok untuk pipa dinding tebal), MFR tinggi = encer (cocok untuk injection molding fitting). Digunakan untuk identifikasi resin dan QC.',
    testStd: 'ISO 1133 (190°C/5kg)',
    typical: '0.2 – 1.2',
    unit: 'g/10min',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6l3 3-3 3v6"/><path d="M8 8l-4 4 4 4"/></svg>'
  },
  abrasion: {
    name: 'Abrasion Resistance (Ketahanan Abrasi)',
    explain: 'Ketahanan terhadap pengikisan/gesekan. Bayangkan aliran pasir atau lumpur di dalam pipa — semakin tahan abrasi, semakin lama pipa bertahan. HDPE memiliki ketahanan abrasi 3-5x lebih baik dari baja, sehingga sangat cocok untuk slurry pipeline di tambang.',
    testStd: 'ASTM G65 / Darmstadt Rig Test',
    typical: 'Volume loss < 50 mm3 (ASTM G65)',
    unit: 'mm3 volume loss',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4"/><path d="M18 12h4"/><path d="M12 2v4"/><path d="M12 18v4"/><circle cx="12" cy="12" r="4"/></svg>'
  },
  shore_hardness: {
    name: 'Shore Hardness (Kekerasan)',
    explain: 'Kekerasan permukaan pipa — diukur dengan menekan jarum ke permukaan material. Semakin tinggi angkanya, semakin keras dan tahan goresan. Penting untuk pipa yang ditarik dalam tanah (HDD) atau pipa tambang yang kontak dengan batuan.',
    testStd: 'ISO 868 (Shore D)',
    typical: '60 – 65',
    unit: 'Shore D',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10l4 4"/><circle cx="12" cy="18" r="4"/></svg>'
  },
  impact_charpy: {
    name: 'Impact Strength (Charpy)',
    explain: 'Ketahanan terhadap benturan — diuji dengan memukul sampel pipa menggunakan pendulum. Bayangkan pipa jatuh dari truk atau tertimpa batu besar — apakah pecah atau hanya penyok? HDPE memiliki ketahanan benturan yang sangat tinggi, bahkan di suhu dingin.',
    testStd: 'ISO 179 / ISO 180',
    typical: 'No break pada suhu ruang',
    unit: 'kJ/m2',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  },
  escr: {
    name: 'ESCR (Environmental Stress Crack Resistance)',
    explain: 'Ketahanan terhadap retakan akibat paparan bahan kimia bersamaan dengan tegangan mekanik. Contoh: pipa yang ditekuk (ada tegangan) lalu terkena deterjen atau pelarut — apakah akan retak? Nilai ESCR tinggi berarti pipa tahan terhadap kombinasi kimia + tekanan.',
    testStd: 'ASTM D1693 / ISO 22088',
    typical: '≥ 1500 jam (F50)',
    unit: 'jam',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/></svg>'
  },
  butt_fusion_tensile: {
    name: 'Butt Fusion Tensile Test',
    explain: 'Kekuatan sambungan las butt fusion — diuji dengan menarik sambungan sampai putus. Sambungan yang baik harus putus di luar area las (ductile failure), bukan di sambungannya. Jika putus di sambungan (brittle failure), berarti pengelasan gagal.',
    testStd: 'ISO 13953',
    typical: 'Ductile failure (putus di luar las)',
    unit: 'MPa / Mode gagal',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"/><path d="M18 3v18"/><path d="M6 12h12"/></svg>'
  },
  ef_peel: {
    name: 'Electrofusion Peel Test',
    explain: 'Kekuatan sambungan electrofusion — diuji dengan cara mengupas/melepas sambungan secara paksa. Sambungan yang baik seharusnya tidak bisa dilepas (material di sekitar las yang robek, bukan sambungannya sendiri). Ini uji wajib untuk QC sambungan EF di lapangan.',
    testStd: 'ISO 13954 / ISO 13955',
    typical: 'Ductile peel (material robek, bukan las)',
    unit: 'N/mm / Mode gagal',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
  },
  thermal_stability: {
    name: 'Thermal Stability (Stabilitas Termal)',
    explain: 'Ketahanan material terhadap panas tinggi saat proses pengelasan. Material dipanaskan di oven pada 200°C — semakin lama bertahan tanpa degradasi (berubah warna/berbau), semakin stabil. Ini memastikan material tidak rusak saat proses butt fusion atau electrofusion.',
    testStd: 'ISO 12176 Annex / EN 728',
    typical: '≥ 20 menit @ 200°C',
    unit: 'menit',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>'
  },
  ring_stiffness: {
    name: 'Ring Stiffness (SN — Kekakuan Cincin)',
    explain: 'Kekakuan pipa menahan tekanan tanah dari luar (bukan dari dalam). Bayangkan Anda menginjak selang — ring stiffness menentukan seberapa kuat pipa menahan tekanan itu. Untuk pipa drainase, SN minimal 4 kN/m2 agar pipa tidak gepeng di bawah tanah.',
    testStd: 'ISO 9969',
    typical: 'SN 4 – SN 16 (tergantung SDR)',
    unit: 'kN/m2',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/></svg>'
  },
  compressive: {
    name: 'Compressive Strength (Kuat Tekan)',
    explain: 'Kekuatan menahan tekanan dari luar — penting untuk pipa bawah air yang mendapat tekanan hidrostatik dari kedalaman. Semakin dalam pipa ditenggelamkan, semakin besar tekanan luar yang harus ditahan agar pipa tidak kolaps (gepeng).',
    testStd: 'ISO 604 / ASTM D695',
    typical: '18 – 25',
    unit: 'MPa',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 18 4-4 4 4"/><path d="m8 6 4 4 4-4"/></svg>'
  },
  vicat: {
    name: 'Vicat Softening Temperature',
    explain: 'Suhu di mana pipa mulai melunak — diukur dengan menekan jarum ke permukaan material sambil dipanaskan perlahan. Ketika jarum masuk 1 mm, itulah suhu Vicat. Ini menunjukkan batas atas suhu operasi material.',
    testStd: 'ISO 306 (Method A)',
    typical: '≥ 124',
    unit: '°C',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>'
  }
};

// --- HDPE Application Segments ---
const hdpeSegments = {
  water: {
    name: 'Water Supply (Air Minum)',
    desc: 'Distribusi air minum bertekanan dari sumber (WTP) ke konsumen. Pipa harus food-grade, tahan tekanan jangka panjang 50 tahun, dan memiliki sambungan leak-free.',
    color: '#2196f3',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    standards: ['ISO 4427:2019', 'SNI 4829:2015', 'SNI 9362:2025'],
    required: ['mrs', 'lths', 'hydrostatic_test', 'oit', 'carbon_black', 'carbon_dispersion', 'density'],
    important: ['tensile_yield', 'elongation', 'scg_fnct', 'mfr', 'butt_fusion_tensile'],
    optional: ['tensile_break', 'flexural_modulus', 'ef_peel', 'thermal_stability', 'shore_hardness'],
    notes: [
      'PE100 adalah standar minimum untuk jaringan distribusi air minum bertekanan',
      'Pipa harus lolos uji migrasi (ISO 8795) untuk memastikan food-grade',
      'OIT wajib diuji untuk memastikan umur pakai 50 tahun',
      'Sambungan butt fusion atau EF menghasilkan joint monolitik leak-free'
    ]
  },
  gas: {
    name: 'Gas Distribution',
    desc: 'Penyaluran gas bumi bertekanan rendah-menengah (MOP ≤ 10 bar). Keamanan adalah prioritas utama — pipa harus tahan retakan dan sambungan wajib 100% leak-free.',
    color: '#ff9800',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-4-4-4-6a4 4 0 0 1 8 0c0 2-2 3.33-4 6z"/><path d="M12 21a8 8 0 0 0 4-15"/><path d="M12 21a8 8 0 0 1-4-15"/></svg>',
    standards: ['ISO 4437:2014', 'SNI 8884:2020', 'AS/NZS 4130:2018'],
    required: ['mrs', 'lths', 'hydrostatic_test', 'scg_fnct', 'rcp', 'oit', 'carbon_black', 'density'],
    important: ['carbon_dispersion', 'mfr', 'tensile_yield', 'butt_fusion_tensile', 'ef_peel', 'thermal_stability'],
    optional: ['elongation', 'flexural_modulus', 'impact_charpy', 'shore_hardness'],
    notes: [
      'RCP (S4 test) WAJIB untuk diameter >= DN250 — retakan tidak boleh menjalar',
      'PE100-RC sangat disarankan untuk jaringan gas baru (SCG >= 8760 jam)',
      'Semua sambungan harus fusion (butt atau EF) — mekanik tidak diperbolehkan',
      'Uji kebocoran 100% wajib sebelum commissioning (ISO 12007)'
    ]
  },
  mining: {
    name: 'Mining & Tailing',
    desc: 'Pipa untuk pertambangan: mengalirkan slurry (campuran air + mineral/pasir/lumpur), tailing disposal, dewatering, dan suplai air proses. Ketahanan abrasi dan fleksibilitas adalah kunci.',
    color: '#795548',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="m5 20 3-12h8l3 12"/><path d="M12 4v4"/><path d="M10 4h4"/></svg>',
    standards: ['ISO 4427:2019', 'ASTM F714', 'AS/NZS 4130:2018'],
    required: ['abrasion', 'tensile_yield', 'tensile_break', 'elongation', 'scg_fnct', 'hydrostatic_test'],
    important: ['shore_hardness', 'impact_charpy', 'density', 'mrs', 'flexural_modulus', 'escr'],
    optional: ['oit', 'carbon_black', 'mfr', 'butt_fusion_tensile', 'thermal_stability'],
    notes: [
      'HDPE memiliki ketahanan abrasi 3-5x lebih baik dari baja karbon',
      'PE100-RC memberikan perlindungan tambahan terhadap SCG akibat goresan batu',
      'Konsentrasi solid dalam slurry menentukan kecepatan aliran minimum (anti-settling)',
      'Pipa sering dipindah-pindah — fleksibilitas dan ketahanan benturan sangat penting'
    ]
  },
  hdd: {
    name: 'HDD (Horizontal Directional Drilling)',
    desc: 'Pemasangan pipa bawah tanah tanpa galian terbuka — pipa ditarik melalui lubang bor di bawah jalan, sungai, atau rintangan. Pipa harus kuat ditarik dan tahan goresan dari tanah.',
    color: '#4caf50',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    standards: ['ASTM F1962', 'ISO 4427:2019', 'PPI TN-48', 'DVS 2207-1'],
    required: ['tensile_yield', 'tensile_break', 'elongation', 'flexural_modulus', 'scg_fnct', 'butt_fusion_tensile'],
    important: ['shore_hardness', 'mrs', 'hydrostatic_test', 'density', 'impact_charpy', 'carbon_black'],
    optional: ['abrasion', 'oit', 'mfr', 'ef_peel', 'thermal_stability', 'carbon_dispersion'],
    notes: [
      'Gaya tarik saat pull-back TIDAK BOLEH melebihi tensile yield x cross-section area',
      'PE100-RC WAJIB untuk HDD — pipa tergores batu/tanah saat ditarik',
      'Flexural modulus menentukan radius minimum boring path',
      'Semua sambungan harus butt fusion — tidak boleh ada titik lemah saat penarikan'
    ]
  },
  marine: {
    name: 'Marine / Subaqueous',
    desc: 'Pipa bawah air: sea outfall, water intake, river crossing, lake crossing. Pipa menghadapi tekanan luar dari kedalaman, arus, dan beban penambatan (ballasting).',
    color: '#00bcd4',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
    standards: ['ISO 4427:2019', 'AWWA M55 Ch.11', 'ASTM F1962'],
    required: ['density', 'tensile_yield', 'elongation', 'compressive', 'hydrostatic_test', 'mrs'],
    important: ['flexural_modulus', 'butt_fusion_tensile', 'scg_fnct', 'oit', 'carbon_black'],
    optional: ['tensile_break', 'impact_charpy', 'shore_hardness', 'mfr', 'thermal_stability'],
    notes: [
      'Densitas PE (0.95) < air (1.0) - pipa kosong AKAN mengapung — perlu ballast',
      'Tekanan eksternal dari kedalaman harus dihitung: P = rho.g.z (setiap 10m = ~1 bar)',
      'SDR rendah (dinding tebal) diperlukan untuk menahan external collapse pressure',
      'Sambungan 100% butt fusion — tidak boleh ada kebocoran di bawah air'
    ]
  },
  sewerage: {
    name: 'Sewerage & Drainage',
    desc: 'Saluran air limbah dan drainase gravitasi. Pipa bekerja tanpa tekanan internal (gravitasi), sehingga yang kritis adalah kekakuan menahan beban tanah dan lalu lintas di atasnya.',
    color: '#607d8b',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m3 21 9-9"/><path d="M21 3 3 21"/></svg>',
    standards: ['ISO 21138:2007', 'EN 13476', 'SNI 7588:2010'],
    required: ['ring_stiffness', 'density', 'impact_charpy', 'oit', 'carbon_black'],
    important: ['elongation', 'tensile_yield', 'flexural_modulus', 'escr', 'hydrostatic_test'],
    optional: ['mrs', 'mfr', 'shore_hardness', 'carbon_dispersion', 'butt_fusion_tensile'],
    notes: [
      'Ring Stiffness (SN) adalah parameter terpenting — menentukan kedalaman tanam maksimum',
      'SN 4 untuk kedalaman <= 2m, SN 8 untuk <= 4m, SN 16 untuk di bawah jalan raya',
      'Defleksi pipa fleksibel tidak boleh melebihi 5% dari diameter',
      'Ketahanan benturan penting untuk handling di lokasi proyek'
    ]
  },
  industrial: {
    name: 'Industrial (Proses Kimia)',
    desc: 'Pipa untuk proses industri: air pendingin, bahan kimia, limbah industri. Ketahanan terhadap bahan kimia dan suhu operasi adalah kunci.',
    color: '#9c27b0',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>',
    standards: ['ISO 15494:2015', 'DVS 2205-1', 'EN 12201'],
    required: ['escr', 'vicat', 'hydrostatic_test', 'mrs', 'tensile_yield'],
    important: ['oit', 'density', 'mfr', 'elongation', 'butt_fusion_tensile', 'thermal_stability'],
    optional: ['carbon_black', 'flexural_modulus', 'impact_charpy', 'shore_hardness', 'scg_fnct'],
    notes: [
      'Ketahanan kimia HDPE sangat baik terhadap asam, basa, dan garam — namun LEMAH terhadap pelarut organik (aromatic hydrocarbon)',
      'Vicat softening temperature menentukan batas suhu operasi',
      'Derating factor harus diterapkan jika suhu operasi > 20°C',
      'Untuk aplikasi kimia kuat, pertimbangkan PVDF atau PP sebagai alternatif'
    ]
  },
  landfill: {
    name: 'Landfill / Leachate',
    desc: 'Pipa untuk TPA (tempat pembuangan akhir): pengumpulan gas metana, pengaliran lindi (leachate), dan sistem drainase bawah tumpukan sampah. Pipa terpapar campuran kimia agresif.',
    color: '#4e342e',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M3 22V6l9-4 9 4v16"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    standards: ['ISO 4427:2019', 'GRI-GM13', 'ASTM D3350'],
    required: ['escr', 'scg_fnct', 'oit', 'carbon_black', 'hydrostatic_test', 'density'],
    important: ['tensile_yield', 'elongation', 'mrs', 'carbon_dispersion', 'impact_charpy'],
    optional: ['flexural_modulus', 'mfr', 'butt_fusion_tensile', 'shore_hardness', 'thermal_stability'],
    notes: [
      'Lindi (leachate) adalah campuran kimia agresif — ESCR harus sangat tinggi',
      'PE100-RC WAJIB untuk ketahanan SCG jangka panjang di lingkungan kimia agresif',
      'OIT tinggi diperlukan karena paparan kimia mempercepat degradasi antioksidan',
      'Pipa gas metana harus tahan terhadap hydrocarbon ringan'
    ]
  }
};

// --- Build Form ---
function buildSegmentGuideForm() {
  var segOpts = '';
  Object.keys(hdpeSegments).forEach(function (key) {
    var s = hdpeSegments[key];
    segOpts += '<option value="' + key + '">' + s.name + '</option>';
  });

  document.getElementById('eng-form').innerHTML =
    '<div class="form-title"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Segmen Aplikasi HDPE</div>' +
    '<div class="form-group"><label class="form-label">Pilih Segmen Aplikasi</label>' +
    '<select id="seg-select" class="form-control">' + segOpts + '</select></div>' +
    '<button class="calc-btn" onclick="showSegmentResult()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
    ' Lihat Parameter</button>';
}

// --- Show Result ---
function showSegmentResult() {
  var segKey = document.getElementById('seg-select').value;
  var seg = hdpeSegments[segKey];
  if (!seg) return;

  var rgb = parseInt(seg.color.slice(1, 3), 16) + ',' + parseInt(seg.color.slice(3, 5), 16) + ',' + parseInt(seg.color.slice(5, 7), 16);

  var html = '';

  // Header
  html += '<div style="background:rgba(' + rgb + ',.08);border:1px solid rgba(' + rgb + ',.25);border-radius:12px;padding:20px;margin-bottom:20px">';
  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">';
  html += '<span style="color:' + seg.color + '">' + seg.icon + '</span>';
  html += '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:20px;font-weight:700;color:' + seg.color + '">' + seg.name + '</span>';
  html += '</div>';
  html += '<div style="font-size:13px;color:#e0e0e0;line-height:1.7;margin-bottom:14px">' + seg.desc + '</div>';

  // Standards badges
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
  seg.standards.forEach(function (s) {
    html += '<span style="display:inline-block;background:rgba(' + rgb + ',.12);border:1px solid rgba(' + rgb + ',.25);color:' + seg.color + ';font-size:10px;padding:3px 10px;border-radius:12px;font-family:\'JetBrains Mono\',monospace;font-weight:600">' + s + '</span>';
  });
  html += '</div></div>';

  // Notes
  if (seg.notes && seg.notes.length) {
    html += '<div style="background:rgba(255,193,7,.06);border:1px solid rgba(255,193,7,.15);border-radius:10px;padding:14px 16px;margin-bottom:20px">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>';
    html += '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:700;color:#ffc107">Catatan Penting</span>';
    html += '</div>';
    seg.notes.forEach(function (n) {
      html += '<div style="font-size:12px;color:#e0e0e0;margin-bottom:6px;display:flex;align-items:start;gap:8px;line-height:1.6"><span style="color:#ffc107;flex-shrink:0;margin-top:2px">&#9656;</span> ' + n + '</div>';
    });
    html += '</div>';
  }

  // Parameter sections
  var sections = [
    { key: 'required', label: 'WAJIB', sublabel: 'Parameter yang harus diuji/diverifikasi', color: '#f44336', bg: 'rgba(244,67,54,.06)', border: 'rgba(244,67,54,.15)' },
    { key: 'important', label: 'PENTING', sublabel: 'Parameter yang sangat disarankan', color: '#ff9800', bg: 'rgba(255,152,0,.06)', border: 'rgba(255,152,0,.15)' },
    { key: 'optional', label: 'OPSIONAL', sublabel: 'Parameter pelengkap', color: '#4caf50', bg: 'rgba(76,175,80,.06)', border: 'rgba(76,175,80,.15)' }
  ];

  sections.forEach(function (sec) {
    var paramKeys = seg[sec.key];
    if (!paramKeys || !paramKeys.length) return;

    html += '<div style="margin-bottom:20px">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">';
    html += '<span style="background:' + sec.color + ';color:#fff;font-size:10px;padding:3px 10px;border-radius:4px;font-weight:700;font-family:\'Space Grotesk\',sans-serif;letter-spacing:.5px">' + sec.label + '</span>';
    html += '<span style="font-size:11px;color:var(--text2)">' + sec.sublabel + '</span>';
    html += '<span style="margin-left:auto;font-size:11px;color:var(--text2);font-family:\'JetBrains Mono\',monospace">' + paramKeys.length + ' parameter</span>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr;gap:10px">';

    paramKeys.forEach(function (pk, idx) {
      var p = segmentParams[pk];
      if (!p) return;

      var secRgb = parseInt(sec.color.slice(1, 3), 16) + ',' + parseInt(sec.color.slice(3, 5), 16) + ',' + parseInt(sec.color.slice(5, 7), 16);
      var cardId = 'seg-card-' + sec.key + '-' + idx;

      html += '<div id="' + cardId + '" style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:10px;overflow:hidden;transition:all .2s" onmouseenter="this.style.borderColor=\'rgba(' + secRgb + ',.3)\';this.style.background=\'rgba(' + secRgb + ',.04)\'" onmouseleave="this.style.borderColor=\'rgba(255,255,255,.06)\';this.style.background=\'rgba(255,255,255,.025)\'">';

      // Card header (always visible)
      html += '<div style="padding:14px 16px;cursor:pointer" onclick="var b=document.getElementById(\'' + cardId + '-body\');b.style.display=b.style.display===\'none\'?\'block\':\'none\'">';
      html += '<div style="display:flex;align-items:center;gap:10px">';
      html += '<span style="color:' + sec.color + ';flex-shrink:0">' + p.icon + '</span>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">';
      html += '<span style="font-family:\'Space Grotesk\',sans-serif;font-size:13px;font-weight:700;color:#fff">' + p.name + '</span>';
      html += '<span style="font-size:9px;padding:2px 8px;border-radius:10px;background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.15);color:#6dd5ed;font-family:\'JetBrains Mono\',monospace;white-space:nowrap">' + p.testStd + '</span>';
      html += '</div>';
      html += '<div style="font-size:11px;color:var(--text2);margin-top:4px">Nilai tipikal PE100: <strong style="color:' + seg.color + '">' + p.typical + ' ' + p.unit + '</strong></div>';
      html += '</div>';
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;transition:transform .2s"><polyline points="6 9 12 15 18 9"/></svg>';
      html += '</div>';
      html += '</div>';

      // Card body (expandable)
      html += '<div id="' + cardId + '-body" style="display:none;padding:0 16px 14px 16px;border-top:1px solid rgba(255,255,255,.04)">';
      html += '<div style="padding-top:12px">';

      // Explanation
      html += '<div style="display:flex;align-items:start;gap:10px;margin-bottom:10px">';
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
      html += '<div style="font-size:12px;color:#e0e0e0;line-height:1.7">' + p.explain + '</div>';
      html += '</div>';

      // Detail grid
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      html += '<div style="background:rgba(255,255,255,.03);border-radius:6px;padding:8px 12px">';
      html += '<div style="font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Standar Uji</div>';
      html += '<div style="font-size:11px;color:#00e5ff;font-family:\'JetBrains Mono\',monospace;font-weight:600">' + p.testStd + '</div>';
      html += '</div>';
      html += '<div style="background:rgba(255,255,255,.03);border-radius:6px;padding:8px 12px">';
      html += '<div style="font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Satuan</div>';
      html += '<div style="font-size:11px;color:#fff;font-weight:600">' + p.unit + '</div>';
      html += '</div>';
      html += '</div>';

      html += '</div></div>';
      html += '</div>';
    });

    html += '</div></div>';
  });

  // Summary stats
  var totalParams = (seg.required ? seg.required.length : 0) + (seg.important ? seg.important.length : 0) + (seg.optional ? seg.optional.length : 0);
  html += '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">';
  sections.forEach(function (sec) {
    var count = seg[sec.key] ? seg[sec.key].length : 0;
    var sr = parseInt(sec.color.slice(1, 3), 16);
    var sg = parseInt(sec.color.slice(3, 5), 16);
    var sb = parseInt(sec.color.slice(5, 7), 16);
    html += '<div style="display:flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(' + sr + ',' + sg + ',' + sb + ',.08);border:1px solid rgba(' + sr + ',' + sg + ',' + sb + ',.15);border-radius:8px">';
    html += '<span style="font-size:11px;color:var(--text2)">' + sec.label + '</span>';
    html += '<span style="font-size:13px;font-weight:700;color:' + sec.color + ';font-family:\'JetBrains Mono\',monospace">' + count + '</span>';
    html += '</div>';
  });
  html += '<div style="display:flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px">';
  html += '<span style="font-size:11px;color:var(--text2)">TOTAL</span>';
  html += '<span style="font-size:13px;font-weight:700;color:#fff;font-family:\'JetBrains Mono\',monospace">' + totalParams + '</span>';
  html += '</div>';
  html += '</div>';

  document.getElementById('eng-results').innerHTML = html;
}
