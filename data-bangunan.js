// ==================== DATA BANGUNAN ====================
const bangunanCompData = {
  'roof-tank':{name:'Tangki Air Atas',code:'GWT-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M12 4v4"/></svg>',bg:'#062040',ac:'#00d4ff',
    desc:'Tangki penampung air di rooftop yang memanfaatkan gravitasi untuk mendistribusikan air ke seluruh lantai (sistem down-feed). Dipasang minimal 0.5 m di atas lantai tertinggi untuk tekanan minimum.',
    specs:[['Material','Polyethylene / GRP / Beton'],['Kapasitas Tipikal','500 – 5.000 L'],['Tekanan Kerja','≤ 0.5 bar (gravity)'],['Elevasi Min.','0.5 m di atas lantai teratas'],['Ventilasi','Lubang udara + wire screen'],['Pembersihan','Setiap 6 bulan sekali']],
    tips:['Pasang tutup rapat, kunci, dan segel anti-kontaminasi','Tambahkan pelampung (float valve) untuk kontrol level otomatis','Buat manhole 60×60 cm untuk inspeksi dan pembersihan','Beri lapisan cat food-grade pada bagian dalam tangki','Pasang overflow pipe setinggi 10 cm dari tutup tangki']},

  'ground-tank':{name:'Tangki Bawah (Ground Reservoir)',code:'GRT-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M12 4v4"/></svg>',bg:'#030d1a',ac:'#0088cc',
    desc:'Tangki penampung utama di bawah tanah / basement. Menerima air dari PDAM atau sumber lain sebagai buffer sebelum dipompa ke sistem distribusi bangunan.',
    specs:[['Material','Beton Bertulang / HDPE / FRP'],['Kapasitas','1–2 hari kebutuhan air'],['Kedalaman Min.','1.5 m dari permukaan tanah'],['Ventilasi','Pipa ventilasi DN50 minimum'],['Overflow','Ke saluran drainase kota'],['Inlet','Ball float valve otomatis']],
    tips:['Pisahkan menjadi 2 kompartemen untuk perawatan bergantian','Pasang manhole dan tangga akses yang ergonomis','Buat kemiringan dasar 1–2% menuju sumpit pembuangan','Waterproofing dua sisi (dalam dan luar) dengan produk bersertifikat','Jaga jarak minimum 3 meter dari septic tank atau sumur resapan']},

  'pump':{name:'Pompa Transfer (Centrifugal)',code:'PWP-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M4 12h16"/></svg>',bg:'#061806',ac:'#00ff9d',
    desc:'Pompa sentrifugal yang memindahkan air dari tangki bawah ke tangki atas atau langsung ke distribusi. Merupakan jantung sistem perpipaan.',
    specs:[['Tipe','Centrifugal multi-stage / inline'],['Debit','0.5 – 15 m³/jam'],['Total Head','10 – 100 m'],['Daya Motor','0.25 – 11 kW'],['Tegangan','220V / 380V 3-phase, 50Hz'],['IP Rating','Min. IP54 (pump room)']],
    tips:['Selalu pasang 2 unit (1 operasi + 1 standby) dengan ATS otomatis','Pasang isolasi getaran (anti-vibration pad) pada dudukan pompa','Arahkan pipa discharge ke atas untuk memudahkan priming','Pasang pressure gauge di sisi suction dan discharge','Cek alignment pompa-motor minimal setahun sekali']},

  'pressure-tank':{name:'Tangki Tekan (Pressure Tank)',code:'PTK-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M12 4v4"/></svg>',bg:'#141200',ac:'#ffaa00',
    desc:'Tangki bertekanan dengan membran diafragma yang menyimpan energi hidrolik. Mengurangi start/stop pompa yang berlebihan dan menstabilkan tekanan sistem.',
    specs:[['Volume','20 – 500 L'],['Pre-charge','0.8 × tekanan cut-in (bar)'],['Tekanan Kerja Max.','8 – 10 bar'],['Material','Carbon steel / SS304'],['Membran','EPDM / Butyl rubber'],['Sertifikasi','SNI / ASME / PED']],
    tips:['Pasang sedekat mungkin dengan pompa, hulu check valve','Cek tekanan pre-charge nitrogen setiap 6 bulan','Pasang safety relief valve (PRV keamanan) wajib','Gunakan pressure switch untuk kontrol cut-in/cut-out pompa','Setting pressure switch: cut-in 2 bar, cut-out 3.5–4 bar (tipikal)']},

  'prv':{name:'Pressure Reducing Valve (PRV)',code:'PRV-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12h-4"/><path d="M7 12H3"/><path d="M11 8v8"/><path d="M15 8L9 16"/><path d="M15 16L9 8"/></svg>',bg:'#12082a',ac:'#aa66ff',
    desc:'Katup pereduksi tekanan otomatis yang menurunkan tekanan hulu yang tinggi ke tekanan outlet yang konstan sesuai kebutuhan.',
    specs:[['Range Reduksi','8 bar → 2.5–3.5 bar'],['Diameter','DN15 – DN100'],['Tipe','Pilot-operated / Direct-acting'],['Material Body','Brass / Ductile Iron'],['Setting Outlet','2–4 bar (adjustable)'],['Dipasang Pada','Zona dengan head > 35 m']],
    tips:['Selalu pasang strainer/saringan di sisi upstream PRV','Sediakan bypass line untuk maintenance tanpa henti suplai','Pasang pressure gauge upstream DAN downstream','Setting outlet 2.5–3 bar untuk kenyamanan pengguna','Pada bangunan tinggi, bagi menjadi zona per 4 lantai']},

  'gate-valve':{name:'Katup Gate (Gate Valve)',code:'GTV-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12h-4"/><path d="M7 12H3"/><path d="M11 8v8"/><path d="M15 8L9 16"/><path d="M15 16L9 8"/></svg>',bg:'#081a08',ac:'#00ff9d',
    desc:'Katup isolasi utama yang berfungsi membuka atau menutup aliran sepenuhnya. Dipasang di setiap titik strategis.',
    specs:[['Fungsi','Isolasi total (full open/close)'],['Diameter','DN15 – DN200'],['Material','Brass / Cast Iron / SS'],['Tekanan Nominal','PN10 – PN16'],['Operasi','Manual (handwheel/gearbox)'],['Posisi Normal','Fully Open (NO)']],
    tips:['HANYA gunakan full open atau full close, jangan throttling','Beri tag nomor identifikasi pada setiap valve','Pasang di setiap cabang utama, inlet/outlet pompa, dan tangki','Operasikan minimal sekali per bulan untuk mencegah macet','Untuk pipa besar DN100+, gunakan gate valve dengan gearbox']},

  'check-valve':{name:'Katup Searah (Check Valve)',code:'CKV-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12h-4"/><path d="M7 12H3"/><path d="M11 8v8"/><path d="M15 8L9 16"/><path d="M15 16L9 8"/></svg>',bg:'#081818',ac:'#00ffaa',
    desc:'Katup otomatis yang hanya mengizinkan aliran satu arah. Mencegah aliran balik (backflow) yang dapat merusak impeller pompa.',
    specs:[['Tipe','Swing / Spring-loaded / Dual-plate'],['Diameter','DN15 – DN200'],['Material','Brass / Cast Iron / SS'],['Cracking Pressure','0.02 – 0.05 bar'],['Pemasangan','Sisi discharge (tekan) pompa'],['Orientasi','Sesuai tanda panah body']],
    tips:['Wajib dipasang di sisi tekan (discharge) setiap pompa','Gunakan spring-loaded type untuk instalasi vertikal','Pada sistem pompa paralel, setiap pompa butuh check valve sendiri','Periksa kondisi disk dan seat setiap maintenance rutin','Jangan pasang di jalur yang sering ber-waterhammer']},

  'pressure-gauge':{name:'Pressure Gauge (Manometer)',code:'PGG-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 12l3-3"/><path d="M12 16v.01"/></svg>',bg:'#141200',ac:'#ffaa00',
    desc:'Instrumen pengukur tekanan real-time pada sistem perpipaan. Penting untuk monitoring kondisi operasi dan troubleshooting.',
    specs:[['Range','0 – 10 bar (tipikal sistem)'],['Dial','Ø63 mm atau Ø100 mm'],['Koneksi','¼" BSP atau ½" BSP'],['Akurasi','Kelas 1.6 (±1.6% FS)'],['Pengisi','Glycerin (untuk getaran)'],['Kalibrasi','Setiap 1–2 tahun']],
    tips:['Gunakan glycerin-filled di dekat pompa untuk meredam getaran','Pasang needle valve untuk isolasi saat gauge rusak','Minimal 4 titik: suction, discharge, pressure tank, ujung distribusi','Pilih range gauge 2× tekanan kerja maksimum','Ganti gauge jika jarum tidak kembali ke nol atau kaca retak']},

  'water-meter':{name:'Water Meter (Meteran Air)',code:'WMT-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 12l3-3"/><path d="M12 16v.01"/></svg>',bg:'#060e1a',ac:'#4488ff',
    desc:'Alat pengukur volume air yang mengalir. Digunakan untuk monitoring konsumsi, penagihan per unit, dan deteksi kebocoran.',
    specs:[['Tipe','Single-jet / Multi-jet / Magnetic'],['Diameter','DN15 – DN50 (unit); DN50+ (induk)'],['Akurasi','ISO 4064 Kelas B atau C'],['Tekanan Kerja','0 – 10 bar'],['Suhu Air','Maks. 30°C (cold water)'],['Kalibrasi','Setiap 5 tahun (SNI)']],
    tips:['Pasang dengan arah aliran sesuai tanda panah di body meter','Beri ruang lurus minimal 5×D upstream dan 3×D downstream','Untuk smart building, gunakan digital/pulse output meter','Pasang gate valve di kedua sisi untuk kemudahan penggantian','Catat pembacaan bulanan dan buat grafik untuk deteksi kebocoran']},

  'floor-drain':{name:'Floor Drain / Drainase Lantai',code:'FDR-01',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',bg:'#1a0800',ac:'#ff6644',
    desc:'Titik pembuangan air di permukaan lantai yang terhubung ke sistem drainase vertikal. Dilengkapi perangkap air (P-trap).',
    specs:[['Ukuran Grating','100×100 / 150×150 / 200×200 mm'],['Material','SS304 / Cast Iron / ABS'],['Diameter Pipa','DN50 – DN100'],['Kemiringan Lantai','Min. 1–2% menuju drain'],['P-trap Depth','Min. 50 mm water seal'],['Standar','SNI 03-6481-2000']],
    tips:['Pasang saringan halus untuk mencegah penyumbatan','Isi water trap berkala jika drain jarang digunakan','Gunakan floor drain bertutup untuk area kering','Pisahkan sistem drainase grey water dan black water','Beri akses cleanout di setiap belokan 45° atau 90°']}
};

const bangunanGuideData=[
  {n:1,title:'Perencanaan & Desain Sistem',sub:'Perhitungan kebutuhan air, tata letak pipa, spesifikasi komponen',
   detail:'Tahap perencanaan adalah fondasi keberhasilan instalasi. Lakukan perhitungan kebutuhan air berdasarkan jumlah penghuni, pilih sistem distribusi, dan buat gambar kerja lengkap.',
   checks:['Hitung kebutuhan air harian total (Qd) dalam liter/hari','Tentukan sistem distribusi: down-feed / up-feed / hybrid','Buat layout jalur pipa pada gambar denah dan potongan','Hitung kapasitas tangki bawah dan tangki atas','Tentukan spesifikasi pompa: debit (Q), head (H), daya (P)','Pilih diameter pipa utama dan cabang per lantai','Identifikasi lokasi shaft pipa vertikal (riser)','Verifikasi desain dengan SNI 8153:2025'],
   warn:'Pastikan desain disetujui konsultan MEP dan mendapat ijin teknis dari PDAM setempat.'},
  {n:2,title:'Persiapan Material & Alat',sub:'Pengadaan komponen sesuai spesifikasi BQ',
   detail:'Siapkan semua material sesuai spesifikasi. Pastikan semua produk bersertifikat SNI dan dari distributor resmi.',
   checks:['Pipa dan fitting: PVC/PPR/GIP sesuai spesifikasi','Pompa transfer (2 unit: 1 operasi + 1 standby)','Tangki air atas dan bawah sesuai kapasitas','Pressure tank dan pressure switch','Valve: gate, check, ball, PRV, solenoid','Instrumen: pressure gauge, water meter, level sensor','Panel kontrol pompa dengan ATS dan overload protection','Material pendukung: gantungan pipa, sealant, compound thread'],
   warn:'Tolak material yang tidak ada sertifikat SNI-nya.'},
  {n:3,title:'Instalasi Tangki Bawah',sub:'Pekerjaan sipil, waterproofing, dan pemasangan ground reservoir',
   detail:'Kualitas konstruksi tangki bawah sangat menentukan daya tahan sistem. Kebocoran tangki bawah sulit dideteksi.',
   checks:['Gali tanah sesuai dimensi tangki ditambah clearance 50 cm','Buat lantai kerja beton 5 cm sebelum cor pondasi','Lakukan waterproofing integral pada campuran beton','Cor dinding beton bertulang atau install tangki prefab','Pasang inlet dengan float valve otomatis','Pasang outlet di bagian terbawah menuju suction pompa','Pasang pipa overflow ke saluran drainase kota','Buat manhole akses 60×60 cm minimum','Uji kebocoran: isi penuh, amati 24 jam'],
   warn:'Jaga jarak MINIMUM 3 meter dari sumur resapan atau septic tank.'},
  {n:4,title:'Instalasi Pompa & Panel Kontrol',sub:'Pemasangan pompa, pressure tank, perpipaan, dan panel listrik',
   detail:'Ruang pompa harus bersih, berventilasi baik, dan mudah diakses. Instalasi listrik HARUS oleh teknisi berlisensi SLO.',
   checks:['Buat pondasi beton anti-getaran untuk dudukan pompa','Pasang pompa dan kencangkan dengan anchor bolt','Pasang anti-vibration pad antara pompa dan pondasi','Hubungkan suction pipe dari tangki bawah','Hubungkan discharge pipe ke riser atau tangki atas','Pasang check valve di sisi discharge tiap pompa','Hubungkan pressure tank ke manifold discharge','Pasang pressure switch sesuai setting','Instalasi panel listrik + MCB + overload + ATS','Grounding panel, body pompa, dan pressure tank','Test run: jalankan tanpa beban, cek arah putaran'],
   warn:'WAJIB: Grounding semua bagian konduktif. Jangan operasikan pompa tanpa air (dry run).'},
  {n:5,title:'Instalasi Pipa Riser & Distribusi',sub:'Pipa vertikal utama dan jaringan distribusi horizontal per lantai',
   detail:'Pekerjaan perpipaan adalah volume kerja terbesar. Kualitas sambungan menentukan keandalan jangka panjang.',
   checks:['Pasang shaft pipa vertikal (riser) dengan clevis hanger tiap 1.5 m','Pasang expansion joint pada riser baja tiap 20 m','Pasang gate valve isolasi di setiap cabang lantai','Pasang pipa distribusi horizontal per lantai','Beri kemiringan 0.5–1% ke arah drain','Pasang PRV di zona tekanan > 3.5 bar','Instalasi water meter per unit/zona','Pasang pipa insulation pada jalur lembab','Beri support/gantungan pipa setiap 1–2 m','Tandai pipa dengan label warna dan arah aliran'],
   warn:'Hindari melubangi balok atau kolom struktur tanpa sleeve yang disetujui konsultan struktur.'},
  {n:6,title:'Instalasi Tangki Atas',sub:'Elevated water tank di rooftop',
   detail:'Tangki atas berisi air bisa sangat berat (1 ton per 1000 liter). Verifikasi kapasitas beban struktur atap.',
   checks:['Dapatkan clearance dari konsultan struktur','Buat platform baja atau pondasi beton','Pasang tangki dengan anchor bolt ke platform','Hubungkan inlet dari discharge pompa transfer','Pasang solenoid valve atau float valve otomatis','Hubungkan outlet ke pipa riser distribusi','Pasang level sensor untuk kontrol pompa otomatis','Pasang pipa overflow dan bottom drain','Pasang tutup bertekunci dan vent screen'],
   warn:'Kapasitas tangki atas JANGAN berlebihan. Target 20–30% kebutuhan harian.'},
  {n:7,title:'Uji Tekan, Flushing & Commissioning',sub:'Hydrostatic test, pembersihan, dan uji fungsi seluruh sistem',
   detail:'Tahap commissioning adalah pembuktian bahwa sistem telah terpasang dengan benar dan siap beroperasi.',
   checks:['Hydrostatic test: 1.5× tekanan kerja selama min. 2 jam','Tandai semua titik bocor, perbaiki, dan uji ulang','Flushing sistem dengan air bersih min. 30 menit','Uji fungsi pompa: start/stop, tekanan, debit, noise','Setting dan verifikasi pressure switch','Uji float valve / solenoid control tangki','Uji PRV: ukur tekanan upstream dan downstream','Test semua gate valve, check valve, dan ball valve','Verifikasi pembacaan water meter dan pressure gauge','Ambil sampel air untuk uji bakteriologi'],
   warn:'JANGAN operasikan ke penghuni sebelum hasil uji bakteriologis LULUS.'},
  {n:8,title:'Operasi & Pemeliharaan Berkala',sub:'SOP operasional, jadwal maintenance, dan dokumentasi teknis',
   detail:'Sistem yang bagus akan gagal tanpa maintenance rutin. Buat jadwal tertulis dan training operator.',
   checks:['Buat SOP tertulis: prosedur operasi normal dan darurat','Latih operator bangunan untuk operasi pompa','Inspeksi visual pompa, valve, fitting setiap minggu','Service pompa setiap 3–6 bulan','Bersihkan tangki setiap 6 bulan','Ganti mechanical seal pompa setiap 2 tahun','Kalibrasi pressure gauge dan water meter','Cek tekanan nitrogen pressure tank tiap 6 bulan','Analisis tagihan air bulanan untuk deteksi kebocoran','Dokumentasikan semua temuan dan penggantian part'],
   warn:'Log maintenance yang lengkap penting untuk klaim garansi dan audit bangunan.'}
];
