// ==================== DATA SIPHONIC ROOF DRAIN ====================
// Acuan: Rucika Syfon System · BS 8490:2007 · EN 1253-2
const siphonicCompData = {
  'siphonic-outlet':{name:'Roof Outlet Siphonic',code:'SRO-01',icon:'🌧️',bg:'#041828',ac:'#00bcd4',
    desc:'Outlet atap khusus siphonic dengan desain anti-vortex terintegrasi. Komponen kritis yang mencegah masuknya udara ke dalam sistem perpipaan sehingga tercapai aliran full-bore (100% terisi air). Diproduksi sesuai EN 1253-2 untuk performa hidraulik optimal.',
    specs:[['Material Body','PP / Cast Iron dengan dome SS304'],['Standar','EN 1253-2'],['Diameter Outlet','DN56 / DN75 / DN90 / DN110'],['Anti-Vortex','Terintegrasi — air baffle plate'],['Flow Capacity','Hingga 12 L/s per outlet (DN110)'],['Leaf Guard','Dome stainless steel, removable']],
    tips:['Pastikan outlet terpasang rata (level) dengan permukaan atap waterproofing','Gunakan flange clamp untuk koneksi ke membran waterproofing atap','Bersihkan leaf guard secara berkala, terutama musim gugur daun','Jumlah outlet minimum 2 per zona — jangan pernah hanya 1 outlet','Verifikasi kesesuaian diameter outlet dengan perhitungan hidraulik']},

  'anti-vortex':{name:'Anti-Vortex Plate (Air Baffle)',code:'AVP-01',icon:'🔄',bg:'#0a1a2a',ac:'#26c6da',
    desc:'Plat anti-vortex yang dipasang di dalam roof outlet untuk memblokir masuknya udara ke sistem perpipaan. Desain khusus menciptakan aliran laminar masuk tanpa pusaran (vortex) sehingga pipa terisi penuh air tanpa gelembung udara.',
    specs:[['Fungsi','Memblokir air entrainment ke pipa'],['Material','Polypropylene / Stainless Steel'],['Desain','Multi-fin radial baffle'],['Efek','Full-bore flow (100% pipe fill)'],['Maintenance','Inspeksi visual setiap 6 bulan'],['Kompatibilitas','Terintegrasi dengan outlet SRO series']],
    tips:['Jangan pernah memodifikasi atau melepas anti-vortex plate — sistem akan gagal','Periksa kondisi fin/sirip tidak patah saat inspeksi rutin','Pastikan tidak ada debris yang menyumbat celah antar fin','Anti-vortex adalah pembeda utama siphonic vs gravity drain','Jika plate rusak, ganti keseluruhan unit outlet']},

  'tail-pipe':{name:'Tail Pipe',code:'TPP-01',icon:'📏',bg:'#071520',ac:'#0097a7',
    desc:'Pipa pendek vertikal yang menghubungkan langsung dari roof outlet ke collecting pipe horizontal. Panjang tail pipe sangat kritis terhadap performa priming sistem siphonic.',
    specs:[['Material','PVC JIS VP / AW (Rucika)'],['Diameter','Sama dengan outlet (DN56–DN110)'],['Panjang Tipikal','200–500 mm dari outlet'],['Orientasi','Vertikal ke bawah dari outlet'],['Sambungan Atas','Solvent cement ke outlet adaptor'],['Sambungan Bawah','Ke tee/elbow collecting pipe']],
    tips:['Panjang tail pipe harus seragam untuk semua outlet dalam satu sistem','Pastikan sambungan ke outlet rapat dan bebas kebocoran udara','Gunakan solvent cement PVC yang sesuai standar — jangan lem biasa','Tail pipe terlalu panjang akan menambah head loss berlebih','Support/klem tail pipe di titik dekat sambungan atas dan bawah']},

  'collecting-pipe':{name:'Collecting Pipe (Horizontal)',code:'CLP-01',icon:'➡️',bg:'#0a2030',ac:'#00acc1',
    desc:'Pipa horizontal yang mengumpulkan air dari beberapa roof outlet menuju downpipe. Keunggulan utama siphonic: collecting pipe dipasang TANPA KEMIRINGAN (level/datar), memberikan fleksibilitas routing dan penghematan ruang ceiling.',
    specs:[['Material','PVC JIS AW (Rucika)'],['Diameter','DN50 – DN150 (tergantung debit)'],['Kemiringan','TANPA SLOPE — 100% horizontal'],['Kecepatan Aliran','1.0 – 6.0 m/s (full-bore)'],['Self-Cleaning','Otomatis pada v ≥ 1.0 m/s'],['Panjang Maks','Sesuai perhitungan head loss']],
    tips:['JANGAN beri kemiringan — collecting pipe HARUS dipasang datar (level)','Gunakan waterpass/laser level untuk memastikan kerataan instalasi','Semua sambungan HARUS kedap udara — kebocoran udara akan merusak efek siphonic','Support bracket setiap 1.0–1.5 m sesuai diameter pipa','Perhatikan ekspansi termal PVC: tambahkan expansion coupling tiap 6 m']},

  'downpipe':{name:'Downpipe (Vertikal)',code:'DWP-01',icon:'⬇️',bg:'#041a28',ac:'#0288d1',
    desc:'Pipa vertikal yang membawa air dari collecting pipe turun ke titik pembuangan di ground level. Tinggi downpipe menciptakan hydraulic head yang menjadi driving force utama efek siphonic.',
    specs:[['Material','PVC JIS AW (Rucika)'],['Diameter','DN75 – DN150'],['Kecepatan Aliran','2.2 – 6.0 m/s'],['Hydraulic Head','= Tinggi bangunan (driving force)'],['Support','Clamp bracket tiap 2.0 m'],['Sambungan Bawah','Transition ke gravity drainage']],
    tips:['Downpipe adalah sumber hydraulic head — tinggi bangunan = kapasitas sistem','Pasang fire collar di setiap penetrasi lantai (floor slab)','Support clamp di setiap 2.0 m dan di dekat setiap sambungan','Pastikan jalur downpipe lurus vertikal — hindari offset jika mungkin','Jika perlu offset, hitung tambahan head loss dan sesuaikan desain']},

  'transition-fitting':{name:'Transition Fitting (Siphonic → Gravity)',code:'TRF-01',icon:'🔀',bg:'#0c1e30',ac:'#039be5',
    desc:'Fitting transisi yang menghubungkan sistem siphonic (full-bore, bertekanan negatif) ke sistem drainase gravity konvensional. Biasanya berupa reducer atau tee khusus yang memungkinkan udara masuk untuk memutus efek siphonic.',
    specs:[['Fungsi','Break siphonic → open-channel gravity flow'],['Tipe','Reducer / Atmospheric break'],['Lokasi','Bagian bawah downpipe, sebelum ground drain'],['Material','PVC JIS / Cast Iron'],['Desain','Pembesaran diameter + ventilasi udara'],['Standar','BS 8490 Clause 6.4']],
    tips:['Transition WAJIB dipasang sebelum air masuk ke sistem gravity konvensional','Jangan sambung langsung downpipe siphonic ke pipa drainase tanah','Pastikan ada atmospheric break untuk mencegah siphonic effect menjalar','Lokasi transisi harus mudah diakses untuk inspeksi','Desain transisi mengacu pada rekomendasi produsen (Rucika)']},

  'clamp-bracket':{name:'Clamp & Bracket Support',code:'CLB-01',icon:'🔩',bg:'#101828',ac:'#546e7a',
    desc:'Sistem penopang pipa yang menjaga posisi dan alignment collecting pipe dan downpipe. Kualitas support sangat menentukan performa jangka panjang karena pipa harus tetap rata (untuk collecting pipe) dan lurus (untuk downpipe).',
    specs:[['Material','Stainless Steel SS304 / Galvanized Steel'],['Tipe','Pipe clamp, U-bolt, clevis hanger'],['Jarak Collecting Pipe','Setiap 1.0–1.5 m'],['Jarak Downpipe','Setiap 2.0 m'],['Insulasi','Rubber liner untuk anti-getaran'],['Beban','Hitung berat pipa + air penuh']],
    tips:['Hitung beban support: berat pipa kosong + berat air saat pipa terisi penuh','Gunakan rubber insert pada clamp untuk meredam getaran dan noise','Pastikan bracket tertanam kuat di struktur beton/baja — bukan gypsum/plafon','Semua support harus dilapisi anti-karat untuk lingkungan lembab','Cek kerataan collecting pipe setelah pemasangan semua support']},

  'overflow-system':{name:'Overflow / Secondary Drainage',code:'OVF-01',icon:'⚠️',bg:'#1a1008',ac:'#ff8f00',
    desc:'Sistem drainase cadangan (secondary/overflow) yang menggunakan prinsip gravitasi konvensional. WAJIB ada sebagai backup jika sistem siphonic tidak mampu menangani curah hujan ekstrem atau mengalami penyumbatan.',
    specs:[['Fungsi','Backup drainage saat siphonic overloaded'],['Prinsip','Gravity flow konvensional'],['Kapasitas','Min. 50% kapasitas sistem primer'],['Tipe','Scupper, side outlet, atau gravity drain'],['Elevasi','Lebih tinggi dari siphonic outlet'],['Standar','BS 8490 Clause 7 — mandatory']],
    tips:['Overflow bukan opsional — WAJIB ada sesuai BS 8490','Elevasi overflow harus lebih tinggi dari outlet siphonic (10–25 mm)','Kapasitas overflow minimal 50% dari kapasitas siphonic primer','Pastikan overflow terhubung ke sistem drainase terpisah dari siphonic','Inspeksi overflow berkala — jangan sampai tersumbat saat dibutuhkan']},

  'pipe-material':{name:'Material Pipa PVC JIS',code:'PVC-JIS',icon:'🔵',bg:'#061830',ac:'#1565c0',
    desc:'Pipa PVC JIS VP/AW produksi Rucika yang digunakan untuk seluruh jalur perpipaan siphonic (tail pipe, collecting pipe, downpipe). Dipilih karena permukaan dalam yang halus (low roughness), ringan, tahan korosi, dan mudah diinstalasi dengan solvent cement.',
    specs:[['Produk','Rucika JIS VP / AW'],['Material','uPVC (Unplasticized PVC)'],['Standar','JIS K 6741'],['Roughness (k)','0.007 mm (sangat halus)'],['Tekanan Kerja','VP: 10 kgf/cm² / AW: 6 kgf/cm²'],['Diameter','DN40 – DN200']],
    tips:['Gunakan HANYA solvent cement yang sesuai standar JIS — bukan lem PVC biasa','Bersihkan dan prime permukaan pipa sebelum aplikasi solvent cement','Biarkan sambungan curing minimal 24 jam sebelum uji tekan','Simpan pipa di tempat teduh — PVC degradasi jika terpapar UV langsung','Potong pipa tegak lurus menggunakan pipe cutter, BUKAN gergaji']},

  'discharge-point':{name:'Discharge Point / Outlet',code:'DSC-01',icon:'🏁',bg:'#0a1a10',ac:'#2e7d32',
    desc:'Titik pembuangan akhir air hujan dari sistem siphonic ke saluran drainase gedung, saluran kota, atau bak kontrol. Desain discharge harus mencegah backflow dan memungkinkan inspeksi.',
    specs:[['Lokasi','Ground level / basement'],['Koneksi','Ke saluran drainase gedung / kota'],['Anti-Backflow','Non-return valve atau air gap'],['Inspeksi','Access chamber / cleanout'],['Material','PVC / Cast Iron'],['Kapasitas','≥ kapasitas total sistem siphonic']],
    tips:['Pastikan kapasitas saluran penerima CUKUP untuk debit siphonic yang tinggi','Pasang non-return valve untuk mencegah backflow dari saluran kota','Buat access chamber di titik discharge untuk inspeksi dan cleanout','Jarak discharge ke pondasi bangunan minimal 1.5 m','Discharge HARUS visible dan mudah dipantau saat hujan lebat']}
};

const siphonicGuideData=[
  {n:1,title:'Survey Atap & Desain Hidraulik',sub:'Pengukuran catchment area, data curah hujan, dan perhitungan siphonic',
   detail:'Tahap desain adalah fondasi sistem siphonic. Perhitungan hidraulik yang salah akan membuat sistem gagal berfungsi. Sistem siphonic memerlukan analisis yang jauh lebih presisi dibanding gravity drain konvensional.',
   checks:['Ukur luas total catchment area atap yang akan didrainase','Tentukan intensitas hujan desain (mm/jam) berdasarkan data BMG lokal','Identifikasi lokasi dan jumlah titik roof outlet siphonic','Tentukan routing collecting pipe dan posisi downpipe','Hitung debit air hujan: Q = C × I × A / 3600 (L/s)','Lakukan perhitungan head loss menggunakan software siphonic','Pastikan available head (tinggi bangunan) > total head loss','Verifikasi desain oleh engineer berpengalaman siphonic system'],
   warn:'Desain siphonic WAJIB menggunakan software hidraulik khusus. Rule-of-thumb gravity drain TIDAK berlaku untuk siphonic.'},
  {n:2,title:'Persiapan Material & Quality Control',sub:'Pengadaan produk Rucika Syfon System, verifikasi kualitas',
   detail:'Semua komponen siphonic harus dari satu produsen (Rucika Syfon System) untuk menjamin kompatibilitas. Material substitusi atau campuran merek tidak diperbolehkan.',
   checks:['Roof outlet siphonic Rucika — sesuai ukuran desain','Pipa PVC JIS VP/AW Rucika — diameter sesuai perhitungan','Fitting PVC JIS: tee, elbow, reducer — sesuai routing','Solvent cement JIS grade dan primer/cleaner','Clamp & bracket stainless steel — cukup untuk seluruh jalur','Transition fitting siphonic ke gravity','Sealant waterproofing untuk penetrasi atap','Verifikasi sertifikat produk dan kesesuaian dengan BQ'],
   warn:'JANGAN campur komponen dari produsen berbeda. Sistem siphonic hanya berfungsi optimal jika semua komponen kompatibel.'},
  {n:3,title:'Pemasangan Roof Outlet di Atap',sub:'Instalasi outlet siphonic, integrasi waterproofing, dan leaf guard',
   detail:'Pemasangan outlet adalah pekerjaan paling kritis. Outlet harus level, kedap air terhadap membran waterproofing, dan posisi anti-vortex plate harus benar.',
   checks:['Buat bukaan di slab atap sesuai ukuran outlet','Pasang outlet body ke slab dengan flange clamp','Integrasikan collar outlet dengan membran waterproofing atap','Pastikan outlet terpasang LEVEL — gunakan waterpass presisi','Pasang anti-vortex plate/air baffle ke dalam body outlet','Pasang leaf guard dome (stainless steel)','Uji kebocoran di sekeliling outlet — siram air dan amati','Verifikasi elevasi outlet sesuai desain (relative to finished roof level)'],
   warn:'Outlet yang tidak level atau bocor di perimeter waterproofing akan menyebabkan kegagalan TOTAL sistem siphonic.'},
  {n:4,title:'Instalasi Tail Pipe',sub:'Pipa penghubung outlet ke collecting pipe',
   detail:'Tail pipe menghubungkan outlet ke collecting pipe. Panjang dan diameter harus konsisten untuk semua outlet dalam satu sistem.',
   checks:['Potong tail pipe sesuai panjang desain — SERAGAM untuk semua outlet','Bersihkan ujung pipa dan fitting dengan PVC cleaner','Aplikasikan primer lalu solvent cement secara merata','Sambungkan tail pipe ke adaptor outlet — tahan 30 detik','Pastikan tail pipe vertikal sempurna (gunakan plumb bob)','Pasang support clamp di dekat sambungan atas dan bawah','Biarkan curing solvent cement minimal 2 jam sebelum uji','Catat panjang aktual setiap tail pipe untuk as-built drawing'],
   warn:'Perbedaan panjang tail pipe antar outlet akan menyebabkan ketidakseimbangan flow rate — sistem tidak akan priming bersamaan.'},
  {n:5,title:'Instalasi Collecting Pipe (Horizontal)',sub:'Pipa pengumpul horizontal — TANPA KEMIRINGAN',
   detail:'Collecting pipe adalah ciri khas siphonic: dipasang 100% horizontal tanpa slope. Kerataan absolut sangat penting. Semua sambungan harus kedap udara sempurna.',
   checks:['Pasang bracket/hanger support di ceiling sesuai jarak desain (1.0–1.5 m)','Tarik benang/laser level sebagai acuan kerataan','Pasang collecting pipe mulai dari downpipe menuju outlet terjauh','Sambung setiap joint dengan solvent cement — pastikan kedap udara total','Verifikasi kerataan setiap segmen dengan waterpass: HARUS level','Pasang expansion coupling setiap 6 m untuk ekspansi termal','Pastikan semua tee branch ke tail pipe tersambung rapat','Tandai arah aliran pada pipa dengan stiker/cat'],
   warn:'Kebocoran udara sekecil apapun pada collecting pipe akan mencegah pembentukan efek siphonic. SEMUA sambungan harus 100% kedap.'},
  {n:6,title:'Instalasi Downpipe (Vertikal)',sub:'Pipa turun vertikal — hydraulic head utama',
   detail:'Downpipe menyediakan hydraulic head yang menjadi driving force sistem. Harus lurus vertikal dan ter-support dengan baik.',
   checks:['Pasang clamp bracket di dinding/kolom setiap 2.0 m','Instalasi downpipe dari bawah ke atas (bottom-up)','Sambung setiap segmen dengan solvent cement','Pasang fire collar di setiap penetrasi floor slab','Pastikan downpipe tegak lurus — gunakan plumb bob','Jika ada offset, hitung ulang head loss dan sesuaikan','Pasang transition fitting di bagian bawah downpipe','Sambungkan transition ke sistem gravity / discharge point'],
   warn:'Offset pada downpipe menambah head loss signifikan. Konsultasikan dengan designer jika harus ada perubahan routing.'},
  {n:7,title:'Testing, Flushing & Commissioning',sub:'Uji sistem, flushing, dan verifikasi priming siphonic',
   detail:'Commissioning siphonic lebih kompleks dari gravity drain. Sistem harus dibuktikan mampu priming (membentuk efek siphonic) pada kondisi hujan desain.',
   checks:['Air pressure test seluruh sistem: 0.5 bar selama 15 menit','Periksa semua sambungan — TIDAK BOLEH ada kebocoran udara','Flushing sistem dengan air bersih selama minimum 30 menit','Uji priming: alirkan air dengan debit desain, amati full-bore flow','Verifikasi: air di semua outlet tertarik secara bersamaan','Ukur waktu priming: harus sesuai target desain','Uji overflow/secondary drainage — pastikan berfungsi','Dokumentasi hasil test: foto, video, dan catatan tertulis'],
   warn:'Jika sistem tidak mampu priming pada debit desain, ada kesalahan instalasi (biasanya kebocoran udara). JANGAN operasikan sebelum diperbaiki.'},
  {n:8,title:'Operasi & Pemeliharaan Berkala',sub:'SOP operasional, jadwal maintenance, dan inspeksi rutin',
   detail:'Sistem siphonic memerlukan maintenance preventif yang konsisten untuk menjaga performa jangka panjang. Kebersihan outlet dan keutuhan sambungan adalah prioritas utama.',
   checks:['Bersihkan leaf guard dan outlet dari debris setiap 3 bulan','Inspeksi visual outlet saat/setelah hujan besar — amati drainase','Periksa kondisi anti-vortex plate setiap 6 bulan','Cek kekencangan clamp dan bracket support setiap 6 bulan','Inspeksi sambungan pipa di area accessible setiap 1 tahun','Bersihkan saluran collecting pipe jika ada penurunan performa','Periksa overflow/secondary system berfungsi baik','Dokumentasikan semua temuan inspeksi dan tindakan perbaikan'],
   warn:'Log maintenance yang lengkap penting untuk klaim garansi produsen dan audit bangunan.'}
];
