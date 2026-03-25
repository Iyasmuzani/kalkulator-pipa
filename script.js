// ==================== DATA ====================
const compData = {
  'roof-tank':{name:'Tangki Air Atas',code:'GWT-01',icon:'🏗️',bg:'#062040',ac:'#00d4ff',
    desc:'Tangki penampung air di rooftop yang memanfaatkan gravitasi untuk mendistribusikan air ke seluruh lantai (sistem down-feed). Dipasang minimal 0.5 m di atas lantai tertinggi untuk tekanan minimum.',
    specs:[['Material','Polyethylene / GRP / Beton'],['Kapasitas Tipikal','500 – 5.000 L'],['Tekanan Kerja','≤ 0.5 bar (gravity)'],['Elevasi Min.','0.5 m di atas lantai teratas'],['Ventilasi','Lubang udara + wire screen'],['Pembersihan','Setiap 6 bulan sekali']],
    tips:['Pasang tutup rapat, kunci, dan segel anti-kontaminasi','Tambahkan pelampung (float valve) untuk kontrol level otomatis','Buat manhole 60×60 cm untuk inspeksi dan pembersihan','Beri lapisan cat food-grade pada bagian dalam tangki','Pasang overflow pipe setinggi 10 cm dari tutup tangki']},

  'ground-tank':{name:'Tangki Bawah (Ground Reservoir)',code:'GRT-01',icon:'💧',bg:'#030d1a',ac:'#0088cc',
    desc:'Tangki penampung utama di bawah tanah / basement. Menerima air dari PDAM atau sumber lain sebagai buffer sebelum dipompa ke sistem distribusi bangunan.',
    specs:[['Material','Beton Bertulang / HDPE / FRP'],['Kapasitas','1–2 hari kebutuhan air'],['Kedalaman Min.','1.5 m dari permukaan tanah'],['Ventilasi','Pipa ventilasi DN50 minimum'],['Overflow','Ke saluran drainase kota'],['Inlet','Ball float valve otomatis']],
    tips:['Pisahkan menjadi 2 kompartemen untuk perawatan bergantian','Pasang manhole dan tangga akses yang ergonomis','Buat kemiringan dasar 1–2% menuju sumpit pembuangan','Waterproofing dua sisi (dalam dan luar) dengan produk bersertifikat','Jaga jarak minimum 3 meter dari septic tank atau sumur resapan']},

  'pump':{name:'Pompa Transfer (Centrifugal)',code:'PWP-01',icon:'⚙️',bg:'#061806',ac:'#00ff9d',
    desc:'Pompa sentrifugal yang memindahkan air dari tangki bawah ke tangki atas atau langsung ke distribusi. Merupakan jantung sistem perpipaan — pilih pompa berkualitas dengan efisiensi tinggi.',
    specs:[['Tipe','Centrifugal multi-stage / inline'],['Debit','0.5 – 15 m³/jam'],['Total Head','10 – 100 m'],['Daya Motor','0.25 – 11 kW'],['Tegangan','220V / 380V 3-phase, 50Hz'],['IP Rating','Min. IP54 (pump room)']],
    tips:['Selalu pasang 2 unit (1 operasi + 1 standby) dengan ATS otomatis','Pasang isolasi getaran (anti-vibration pad) pada dudukan pompa','Arahkan pipa discharge ke atas untuk memudahkan priming','Pasang pressure gauge di sisi suction dan discharge','Cek alignment pompa-motor minimal setahun sekali']},

  'pressure-tank':{name:'Tangki Tekan (Pressure Tank)',code:'PTK-01',icon:'🔋',bg:'#141200',ac:'#ffaa00',
    desc:'Tangki bertekanan dengan membran diafragma yang menyimpan energi hidrolik. Mengurangi start/stop pompa yang berlebihan dan menstabilkan tekanan sistem agar tidak berfluktuasi.',
    specs:[['Volume','20 – 500 L'],['Pre-charge','0.8 × tekanan cut-in (bar)'],['Tekanan Kerja Max.','8 – 10 bar'],['Material','Carbon steel / SS304'],['Membran','EPDM / Butyl rubber'],['Sertifikasi','SNI / ASME / PED']],
    tips:['Pasang sedekat mungkin dengan pompa, hulu check valve','Cek tekanan pre-charge nitrogen setiap 6 bulan','Pasang safety relief valve (PRV keamanan) wajib','Gunakan pressure switch untuk kontrol cut-in/cut-out pompa','Setting pressure switch: cut-in 2 bar, cut-out 3.5–4 bar (tipikal)']},

  'prv':{name:'Pressure Reducing Valve (PRV)',code:'PRV-01',icon:'🔧',bg:'#12082a',ac:'#aa66ff',
    desc:'Katup pereduksi tekanan otomatis yang menurunkan tekanan hulu yang tinggi ke tekanan outlet yang konstan sesuai kebutuhan. Wajib dipasang pada bangunan tinggi untuk mencegah kerusakan fitting dan kebocoran.',
    specs:[['Range Reduksi','8 bar → 2.5–3.5 bar'],['Diameter','DN15 – DN100'],['Tipe','Pilot-operated / Direct-acting'],['Material Body','Brass / Ductile Iron'],['Setting Outlet','2–4 bar (adjustable)'],['Dipasang Pada','Zona dengan head > 35 m']],
    tips:['Selalu pasang strainer/saringan di sisi upstream PRV','Sediakan bypass line untuk maintenance tanpa henti suplai','Pasang pressure gauge upstream DAN downstream','Setting outlet 2.5–3 bar untuk kenyamanan pengguna','Pada bangunan tinggi, bagi menjadi zona per 4 lantai']},

  'gate-valve':{name:'Katup Gate (Gate Valve)',code:'GTV-01',icon:'🚰',bg:'#081a08',ac:'#00ff9d',
    desc:'Katup isolasi utama yang berfungsi membuka atau menutup aliran sepenuhnya. Dipasang di setiap titik strategis untuk kemudahan isolasi zona saat perbaikan atau darurat.',
    specs:[['Fungsi','Isolasi total (full open/close)'],['Diameter','DN15 – DN200'],['Material','Brass / Cast Iron / SS'],['Tekanan Nominal','PN10 – PN16'],['Operasi','Manual (handwheel/gearbox)'],['Posisi Normal','Fully Open (NO)']],
    tips:['HANYA gunakan full open atau full close, jangan throttling','Beri tag nomor identifikasi pada setiap valve','Pasang di setiap cabang utama, inlet/outlet pompa, dan tangki','Operasikan minimal sekali per bulan untuk mencegah macet','Untuk pipa besar DN100+, gunakan gate valve dengan gearbox']},

  'check-valve':{name:'Katup Searah (Check Valve)',code:'CKV-01',icon:'✅',bg:'#081818',ac:'#00ffaa',
    desc:'Katup otomatis yang hanya mengizinkan aliran satu arah. Mencegah aliran balik (backflow) yang dapat merusak impeller pompa atau mencemari sistem distribusi.',
    specs:[['Tipe','Swing / Spring-loaded / Dual-plate'],['Diameter','DN15 – DN200'],['Material','Brass / Cast Iron / SS'],['Cracking Pressure','0.02 – 0.05 bar'],['Pemasangan','Sisi discharge (tekan) pompa'],['Orientasi','Sesuai tanda panah body']],
    tips:['Wajib dipasang di sisi tekan (discharge) setiap pompa','Gunakan spring-loaded type untuk instalasi vertikal (aliran ke atas)','Pada sistem pompa paralel, setiap pompa butuh check valve sendiri','Periksa kondisi disk dan seat setiap maintenance rutin','Jangan pasang di jalur yang sering ber-waterham']},

  'pressure-gauge':{name:'Pressure Gauge (Manometer)',code:'PGG-01',icon:'📊',bg:'#141200',ac:'#ffaa00',
    desc:'Instrumen pengukur tekanan real-time pada sistem perpipaan. Sangat penting untuk monitoring kondisi operasi, troubleshooting, dan memastikan sistem bekerja dalam rentang aman.',
    specs:[['Range','0 – 10 bar (tipikal sistem)'],['Dial','Ø63 mm atau Ø100 mm'],['Koneksi','¼" BSP atau ½" BSP'],['Akurasi','Kelas 1.6 (±1.6% FS)'],['Pengisi','Glycerin (untuk getaran)'],['Kalibrasi','Setiap 1–2 tahun']],
    tips:['Gunakan glycerin-filled di dekat pompa untuk meredam getaran','Pasang needle valve (siphon cock) untuk isolasi saat gauge rusak','Minimal 4 titik: suction pompa, discharge pompa, pressure tank, ujung distribusi','Pilih range gauge 2× tekanan kerja maksimum','Ganti gauge jika jarum tidak kembali ke nol atau kaca retak']},

  'water-meter':{name:'Water Meter (Meteran Air)',code:'WMT-01',icon:'💦',bg:'#060e1a',ac:'#4488ff',
    desc:'Alat pengukur volume air yang mengalir. Digunakan untuk monitoring konsumsi, penagihan per unit, dan deteksi kebocoran tersembunyi (melalui analisis konsumsi anomali).',
    specs:[['Tipe','Single-jet / Multi-jet / Magnetic'],['Diameter','DN15 – DN50 (unit); DN50+ (induk)'],['Akurasi','ISO 4064 Kelas B atau C'],['Tekanan Kerja','0 – 10 bar'],['Suhu Air','Maks. 30°C (cold water)'],['Kalibrasi','Setiap 5 tahun (SNI)']],
    tips:['Pasang dengan arah aliran sesuai tanda panah di body meter','Beri ruang lurus minimal 5×D upstream dan 3×D downstream','Untuk smart building, gunakan digital/pulse output meter','Pasang gate valve di kedua sisi untuk kemudahan penggantian','Catat pembacaan bulanan dan buat grafik untuk deteksi kebocoran']},

  'floor-drain':{name:'Floor Drain / Drainase Lantai',code:'FDR-01',icon:'🕳️',bg:'#1a0800',ac:'#ff6644',
    desc:'Titik pembuangan air di permukaan lantai yang terhubung ke sistem drainase vertikal. Dilengkapi perangkap air (P-trap/water seal) untuk mencegah gas dan bau dari pipa drainase naik ke ruangan.',
    specs:[['Ukuran Grating','100×100 / 150×150 / 200×200 mm'],['Material','SS304 / Cast Iron / ABS'],['Diameter Pipa','DN50 – DN100'],['Kemiringan Lantai','Min. 1–2% menuju drain'],['P-trap Depth','Min. 50 mm water seal'],['Standar','SNI 03-6481-2000']],
    tips:['Pasang saringan (strainer) halus untuk mencegah penyumbatan','Isi water trap secara berkala jika drain jarang digunakan','Gunakan floor drain bertutup untuk area kering atau mekanikal','Pisahkan sistem drainase grey water dan black water (air limbah WC)','Beri akses cleanout di setiap belokan 45° atau 90° pada pipa horizontal']}
};

const guideData=[
  {n:1,title:'Perencanaan & Desain Sistem',sub:'Perhitungan kebutuhan air, tata letak pipa, spesifikasi komponen',
   detail:'Tahap perencanaan adalah fondasi keberhasilan instalasi. Lakukan perhitungan kebutuhan air berdasarkan jumlah penghuni, pilih sistem distribusi, dan buat gambar kerja lengkap (shop drawing). Konsultasikan dengan konsultan MEP bersertifikat untuk proyek di atas 2 lantai.',
   checks:['Hitung kebutuhan air harian total (Qd) dalam liter/hari','Tentukan sistem distribusi: down-feed / up-feed / hybrid','Buat layout jalur pipa pada gambar denah dan potongan bangunan','Hitung kapasitas tangki bawah dan tangki atas','Tentukan spesifikasi pompa: debit (Q), head (H), dan daya (P)','Pilih diameter pipa utama dan cabang per lantai','Identifikasi lokasi shaft pipa vertikal (riser)','Verifikasi desain dengan SNI 03-7065-2005'],
   warn:'Pastikan desain disetujui konsultan MEP dan mendapat ijin teknis dari PDAM setempat sebelum pekerjaan dimulai.'},

  {n:2,title:'Persiapan Material & Alat',sub:'Pengadaan komponen sesuai spesifikasi BQ yang telah disetujui',
   detail:'Siapkan semua material sesuai spesifikasi. Pastikan semua produk bersertifikat SNI dan dari distributor resmi. Simpan material pipa di tempat teduh dan hindari paparan sinar UV berkepanjangan (terutama PVC).',
   checks:['Pipa dan fitting: PVC/PPR/GIP sesuai spesifikasi','Pompa transfer (2 unit: 1 operasi + 1 standby)','Tangki air atas dan bawah sesuai kapasitas','Pressure tank dan pressure switch','Valve: gate valve, check valve, ball valve, PRV, solenoid','Instrumen: pressure gauge, water meter, level sensor','Panel kontrol pompa dengan ATS dan overload protection','Material pendukung: gantungan pipa, sealant, compound thread'],
   warn:'Tolak material yang tidak ada sertifikat SNI-nya. Untuk proyek pemerintah, minta MSDS dan sertifikat uji dari laboratorium terakreditasi.'},

  {n:3,title:'Instalasi Tangki Bawah',sub:'Pekerjaan sipil, waterproofing, dan pemasangan ground reservoir',
   detail:'Kualitas konstruksi tangki bawah sangat menentukan daya tahan sistem. Kebocoran tangki bawah sulit dideteksi dan dapat mencemari tanah. Lakukan pengerjaan waterproofing dengan teliti.',
   checks:['Gali tanah sesuai dimensi tangki ditambah clearance 50 cm','Buat lantai kerja beton 5 cm sebelum cor pondasi','Lakukan waterproofing integral pada campuran beton','Cor dinding beton bertulang atau install tangki prefab HDPE/FRP','Pasang inlet dengan float valve otomatis (dari PDAM)','Pasang outlet di bagian terbawah dinding menuju suction pompa','Pasang pipa overflow ke saluran drainase kota','Buat manhole akses 60×60 cm minimum + tangga stainless','Uji kebocoran: isi penuh, amati penurunan level selama 24 jam'],
   warn:'Jaga jarak MINIMUM 3 meter dari sumur resapan atau septic tank. Lapisi permukaan dalam dengan cat food-grade setelah beton benar-benar kering.'},

  {n:4,title:'Instalasi Pompa & Panel Kontrol',sub:'Pemasangan pompa, pressure tank, perpipaan, dan panel listrik',
   detail:'Ruang pompa harus bersih, berventilasi baik, tidak bocor, dan mudah diakses. Instalasi listrik panel kontrol HARUS dilakukan teknisi listrik berlisensi SLO (Sertifikat Laik Operasi).',
   checks:['Buat pondasi beton anti-getaran untuk dudukan pompa','Pasang pompa dan kencangkan dengan anchor bolt ke pondasi','Pasang anti-vibration pad antara pompa dan pondasi','Hubungkan suction pipe dari tangki bawah (dengan flexible joint)','Hubungkan discharge pipe ke riser atau tangki atas','Pasang check valve di sisi discharge tiap pompa','Hubungkan pressure tank ke manifold discharge','Pasang pressure switch sesuai setting (misal: 2–4 bar)','Instalasi panel listrik + MCB + overload + ATS switching','Grounding panel, body pompa, dan pressure tank','Test run: jalankan tanpa beban, cek arah putaran, suara, getaran'],
   warn:'WAJIB: Grounding semua bagian konduktif. Panel listrik HARUS bersertifikat SLO dari PLN/instansi berwenang. Jangan operasikan pompa tanpa air (dry run).'},

  {n:5,title:'Instalasi Pipa Riser & Distribusi',sub:'Pipa vertikal utama dan jaringan distribusi horizontal per lantai',
   detail:'Pekerjaan perpipaan adalah volume kerja terbesar. Kualitas sambungan (joint) dan support pipa menentukan keandalan jangka panjang. Koordinasikan jalur pipa dengan MEP lain (AC, listrik, struktur).',
   checks:['Pasang shaft pipa vertikal (riser) dengan clevis hanger tiap 1.5 m','Pasang expansion joint pada riser baja GIP setiap 20 m','Pasang gate valve isolasi di setiap cabang lantai (riser tapping)','Pasang pipa distribusi horizontal per lantai','Beri kemiringan 0.5–1% ke arah drain pada pipa horizontal','Pasang PRV di zona yang tekanannya melebihi 3.5 bar','Instalasi water meter per unit/zona sesuai desain','Pasang pipa insulation pada jalur lembab / cold water exterior','Beri support/gantungan pipa setiap 1–2 m sesuai berat pipa','Tandai setiap pipa dengan label warna dan arah aliran'],
   warn:'Hindari melubangi balok atau kolom struktur tanpa sleeve yang disetujui konsultan struktur. Koordinasi wajib sebelum bor atau bobok.'},

  {n:6,title:'Instalasi Tangki Atas',sub:'Elevated water tank di rooftop — kalkulasi beban struktur wajib',
   detail:'Tangki atas berisi air bisa sangat berat (1 ton per 1000 liter). Verifikasi kapasitas beban struktur atap oleh konsultan struktur sebelum pemasangan. Jangan asumsikan struktur kuat tanpa kalkulasi.',
   checks:['Dapatkan clearance dari konsultan struktur (load calculation)','Buat platform baja atau pondasi beton sesuai gambar struktur','Pasang tangki dengan anchor bolt ke platform','Hubungkan inlet dari discharge pompa transfer','Pasang solenoid valve atau float valve otomatis di inlet','Hubungkan outlet ke pipa riser distribusi','Pasang level sensor / indicator (untuk kontrol pompa otomatis)','Pasang pipa overflow dan pipa drain (bottom drain)','Pasang tutup bertekunci dan vent screen (kasa anti-serangga/debu)'],
   warn:'Kapasitas tangki atas JANGAN berlebihan. Air yang terlalu lama tersimpan (> 12 jam) turun kualitasnya. Target 20–30% kebutuhan harian agar siklus air tetap segar.'},

  {n:7,title:'Uji Tekan, Flushing & Commissioning',sub:'Hydrostatic test, pembersihan, dan uji fungsi seluruh sistem',
   detail:'Tahap commissioning adalah pembuktian bahwa sistem telah terpasang dengan benar dan siap beroperasi. Jangan lewatkan satu pun pengujian. Dokumentasikan semua hasil uji.',
   checks:['Hydrostatic pressure test: 1.5× tekanan kerja selama minimum 2 jam','Tandai semua titik bocor, perbaiki, dan uji ulang','Flushing sistem dengan air bersih selama minimal 30 menit','Uji fungsi pompa: start/stop, tekanan, debit, noise, temperature','Setting dan verifikasi pressure switch (cut-in dan cut-out)','Uji float valve / solenoid control tangki atas dan bawah','Uji PRV: ukur tekanan upstream dan downstream, bandingkan dengan setting','Test semua gate valve, check valve, dan ball valve','Verifikasi pembacaan semua water meter dan pressure gauge','Ambil sampel air dari beberapa titik untuk uji bakteriologi (lab terakreditasi)'],
   warn:'JANGAN operasikan sistem ke penghuni sebelum hasil uji bakteriologis LULUS. Air yang baru dipasang sering terkontaminasi selama proses konstruksi.'},

  {n:8,title:'Operasi & Pemeliharaan Berkala',sub:'SOP operasional, jadwal maintenance, dan dokumentasi teknis',
   detail:'Sistem yang bagus sekalipun akan gagal tanpa maintenance rutin. Buat jadwal tertulis, training operator, dan dokumentasikan semua pekerjaan. Log maintenance adalah bukti perawatan dan penting untuk garansi.',
   checks:['Buat SOP tertulis: prosedur operasi normal dan darurat','Latih operator bangunan untuk operasi pompa dan respon darurat','Inspeksi visual pompa, valve, dan fitting setiap minggu','Service pompa (seal, bearing, impeller) setiap 3–6 bulan','Bersihkan tangki bawah dan atas setiap 6 bulan (uji bakteriologi)','Ganti mechanical seal pompa setiap 2 tahun atau sesuai manual','Kalibrasi pressure gauge dan water meter sesuai jadwal','Cek dan isi tekanan nitrogen pressure tank setiap 6 bulan','Analisis tagihan air bulanan untuk deteksi kebocoran tersembunyi','Dokumentasikan semua temuan, penggantian part, dan hasil uji'],
   warn:'Log maintenance yang lengkap sangat penting untuk klaim garansi, audit bangunan, dan diagnosa kerusakan di masa depan. Simpan semua dokumentasi minimal 10 tahun.'}
];

// ==================== FUNCTIONS ====================
function switchTab(t){
  document.querySelectorAll('.tab').forEach((el,i)=>{
    el.classList.toggle('active',['visualisasi','komponen','panduan','rekomendasi'][i]===t);
  });
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+t).classList.add('active');
}

function selectComp(id){
  const d=compData[id];if(!d)return;
  document.querySelectorAll('.hotspot').forEach(h=>h.classList.remove('selected'));
  const el=document.getElementById('hp-'+id);
  if(el)el.classList.add('selected');
  document.getElementById('comp-panel').innerHTML=`
    <div class="cp-header">
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac}">${d.icon}</div>
      <div>
        <div class="cp-name">${d.name}</div>
        <div class="cp-code" style="color:${d.ac}">${d.code}</div>
      </div>
    </div>
    <div class="cp-desc">${d.desc}</div>
    <div class="section-label">Spesifikasi Teknis</div>
    ${d.specs.map(([k,v])=>`<div class="spec-row"><span class="sk">${k}</span><span class="sv" style="color:${d.ac}">${v}</span></div>`).join('')}
    <div class="tips-box">
      <div class="tips-title">Tips Instalasi</div>
      <ul class="tips-list">${d.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
    </div>`;
}

function buildCompGrid(){
  const tagMap={
    'roof-tank':'Tangki','ground-tank':'Tangki','pump':'Pompa',
    'pressure-tank':'Tangki Tekan','prv':'Valve','gate-valve':'Valve',
    'check-valve':'Valve','pressure-gauge':'Instrumen',
    'water-meter':'Instrumen','floor-drain':'Drainase'
  };
  const acMap={
    'roof-tank':'#00d4ff','ground-tank':'#0088cc','pump':'#00ff9d',
    'pressure-tank':'#ffaa00','prv':'#aa66ff','gate-valve':'#00ff9d',
    'check-valve':'#00ffaa','pressure-gauge':'#ffaa00',
    'water-meter':'#4488ff','floor-drain':'#ff6644'
  };
  document.getElementById('comp-grid').innerHTML=Object.entries(compData).map(([id,d])=>{
    const ac=acMap[id]||d.ac;
    const rgb=parseInt(ac.slice(1,3),16)+','+parseInt(ac.slice(3,5),16)+','+parseInt(ac.slice(5,7),16);
    return`<div class="comp-card" onclick="openModal('${id}')">
      <div class="cc-icon">${d.icon}</div>
      <div class="cc-name">${d.name}</div>
      <div class="cc-code" style="color:${ac}">${d.code}</div>
      <div class="cc-desc">${d.desc.slice(0,110)}...</div>
      <div class="cc-tag" style="background:rgba(${rgb},.1);color:${ac};border:1px solid rgba(${rgb},.25)">${tagMap[id]||'Komponen'}</div>
    </div>`;
  }).join('');
}

function openModal(id){
  const d=compData[id];
  document.getElementById('modal-content').innerHTML=`
    <button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('open')">✕</button>
    <div class="cp-header" style="margin-top:4px">
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac}">${d.icon}</div>
      <div><div class="cp-name">${d.name}</div><div class="cp-code" style="color:${d.ac}">${d.code}</div></div>
    </div>
    <div class="cp-desc">${d.desc}</div>
    <div class="section-label">Spesifikasi Teknis</div>
    ${d.specs.map(([k,v])=>`<div class="spec-row"><span class="sk">${k}</span><span class="sv" style="color:${d.ac}">${v}</span></div>`).join('')}
    <div class="tips-box">
      <div class="tips-title">Tips Instalasi</div>
      <ul class="tips-list">${d.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
    </div>`;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e){
  if(e&&e.target===document.getElementById('modal-overlay'))
    document.getElementById('modal-overlay').classList.remove('open');
}

let totalChecks=0,doneChecks=0;
function buildGuide(){
  totalChecks=guideData.reduce((a,s)=>a+s.checks.length,0);
  document.getElementById('prog-label').textContent=`0 / ${totalChecks} item selesai`;
  document.getElementById('guide-steps').innerHTML=guideData.map(s=>`
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
          ${s.checks.map((c,i)=>`
            <label class="check-item" id="ci-${s.n}-${i}">
              <input type="checkbox" onchange="onCheck(${s.n},${i},this)">
              <span>${c}</span>
            </label>`).join('')}
        </div>
        <div class="step-warning">⚠️ <span>${s.warn}</span></div>
      </div>
    </div>`).join('');
}

function toggleStep(n){
  document.getElementById('sc-'+n).classList.toggle('open');
}

function onCheck(step,item,cb){
  document.getElementById(`ci-${step}-${item}`).classList.toggle('checked',cb.checked);
  doneChecks=document.querySelectorAll('.step-checklist input:checked').length;
  const pct=Math.round((doneChecks/totalChecks)*100);
  document.getElementById('prog-bar').style.width=pct+'%';
  document.getElementById('prog-label').textContent=`${doneChecks} / ${totalChecks} item selesai`;
  // Check if step complete
  const stepChecks=document.querySelectorAll(`#sc-${step} input`);
  const stepDone=[...stepChecks].every(x=>x.checked);
  document.getElementById('sn-'+step).classList.toggle('done',stepDone);
}

// ==================== CALCULATION ====================
const waterStd={
  rumah:{lpr:150,pk:3,name:'Rumah Tinggal'},
  apartemen:{lpr:200,pk:3.5,name:'Apartemen'},
  hotel:{lpr:300,pk:4,name:'Hotel'},
  kantor:{lpr:50,pk:5,name:'Gedung Kantor'},
  rumahsakit:{lpr:500,pk:5,name:'Rumah Sakit'},
  sekolah:{lpr:40,pk:4,name:'Sekolah/Kampus'},
  restoran:{lpr:100,pk:6,name:'Restoran'}
};

const pipeMat={
  ppr:'PPR PN20 (polypropylene)',
  pvc:'uPVC Class AW',
  galvanis:'Baja Galvanis GIP',
  hdpe:'HDPE PN12.5'
};

function fmt(n){
  if(n>=1000000)return(n/1000000).toFixed(2)+' m³';
  if(n>=1000)return(n/1000).toFixed(1)+' m³';
  return Math.round(n)+' L';
}

function calculate(){
  const type=document.getElementById('f-type').value;
  const floors=parseInt(document.getElementById('f-floors').value)||4;
  const users=parseInt(document.getElementById('f-users').value)||20;
  const hpf=parseFloat(document.getElementById('f-height').value)||3.5;
  const source=document.getElementById('f-source').value;
  const system=document.getElementById('f-system').value;
  const pipe=document.getElementById('f-pipe').value;
  const std=waterStd[type];

  const Qd=users*std.lpr;
  const gtCap=Math.ceil(Qd*1.5/100)*100;
  const rtCap=Math.ceil(Qd*0.3/100)*100;

  const QpLs=(Qd*std.pk)/86400;
  const QpM3h=QpLs*3.6;
  const QpM3s=QpLs/1000;

  const totalH=floors*hpf+8;
  const friction=totalH*0.22;
  const minP=10;
  const H=Math.ceil(totalH+friction+minP);

  const pwKw=(1000*9.81*QpM3s*H)/(0.65*1000);
  const pwStd=[0.25,0.37,0.55,0.75,1.1,1.5,2.2,3,4,5.5,7.5,11,15,18.5,22];
  const pwFinal=pwStd.find(p=>p>=pwKw)||Math.ceil(pwKw);

  const D_m=Math.sqrt((4*QpM3s)/(Math.PI*1.5));
  const D_mm=D_m*1000;
  
  let pipeSizes = [15,20,25,32,40,50,65,80,100,125,150,200];
  if (pipe === 'ppr') {
    pipeSizes = [20, 25, 32, 40, 50, 63, 75, 90, 110, 160];
  }
  
  const pipeD = pipeSizes.find(d => d >= D_mm) || pipeSizes[pipeSizes.length - 1];
  const branchD = pipeSizes.find(d => d >= D_mm * 0.6) || pipeSizes[0];

  const ptVol=Math.ceil(QpLs*60*6/10)*10;
  const workP=H/10;
  const needsPRV=workP>3.5;
  const zones=Math.ceil(floors/4);
  const cutIn=(workP*0.55).toFixed(1);
  const cutOut=(workP*0.85).toFixed(1);

  const sysMap={downfeed:'Down-feed (Gravitasi)',upfeed:'Up-feed (Booster pump)',hybrid:'Hybrid (Tangki atas + booster)'};
  const srcMap={pdam:'PDAM',sumur:'Sumur Bor/Artesis',keduanya:'PDAM + Sumur (dual)'};

  document.getElementById('rec-results').innerHTML=`
    <div class="result-sec">
      <div class="result-sec-title">📊 Kebutuhan Air — ${std.name}, ${users} pengguna</div>
      <div class="result-grid">
        <div class="result-item"><div class="rk">Konsumsi Harian</div><div class="rv">${(Qd/1000).toFixed(2)}<span class="ru"> m³/hari</span></div></div>
        <div class="result-item"><div class="rk">Kebutuhan per Orang</div><div class="rv">${std.lpr}<span class="ru"> L/org/hari</span></div></div>
        <div class="result-item"><div class="rk">Debit Puncak</div><div class="rv">${QpLs.toFixed(2)}<span class="ru"> L/s</span></div></div>
        <div class="result-item"><div class="rk">Faktor Puncak</div><div class="rv">${std.pk}×<span class="ru"> kebutuhan</span></div></div>
      </div>
    </div>

    <div class="result-sec">
      <div class="result-sec-title">🏊 Kapasitas Tangki</div>
      <div class="result-grid">
        <div class="result-item"><div class="rk">Tangki Bawah (1.5 hari)</div><div class="rv">${fmt(gtCap)}</div></div>
        <div class="result-item"><div class="rk">Tangki Atas (30% harian)</div><div class="rv">${fmt(rtCap)}</div></div>
        <div class="result-item"><div class="rk">Tangki Tekan</div><div class="rv">${ptVol}<span class="ru"> L</span></div></div>
        <div class="result-item"><div class="rk">Total Penyimpanan</div><div class="rv">${((gtCap+rtCap)/1000).toFixed(1)}<span class="ru"> m³</span></div></div>
      </div>
    </div>

    <div class="result-sec">
      <div class="result-sec-title">⚙️ Spesifikasi Pompa Transfer</div>
      <div class="result-grid">
        <div class="result-item"><div class="rk">Total Head (H)</div><div class="rv">${H}<span class="ru"> m</span></div></div>
        <div class="result-item"><div class="rk">Debit Pompa (Q)</div><div class="rv">${QpM3h.toFixed(1)}<span class="ru"> m³/jam</span></div></div>
        <div class="result-item"><div class="rk">Daya Motor</div><div class="rv">${pwFinal}<span class="ru"> kW</span></div></div>
        <div class="result-item"><div class="rk">Tekanan Kerja</div><div class="rv">${workP.toFixed(1)}<span class="ru"> bar</span></div></div>
        <div class="result-item"><div class="rk">Pressure Switch Cut-in</div><div class="rv">${cutIn}<span class="ru"> bar</span></div></div>
        <div class="result-item"><div class="rk">Pressure Switch Cut-out</div><div class="rv">${cutOut}<span class="ru"> bar</span></div></div>
      </div>
    </div>

    <div class="result-sec">
      <div class="result-sec-title">🔧 Perpipaan & Aksesori</div>
      <div class="result-grid">
        <div class="result-item"><div class="rk">Diameter Pipa Utama</div><div class="rv">DN${pipeD}<span class="ru"> mm</span></div></div>
        <div class="result-item"><div class="rk">Pipa Distribusi Lantai</div><div class="rv">DN${branchD}<span class="ru"> mm</span></div></div>
        <div class="result-item"><div class="rk">PRV Diperlukan</div><div class="rv" style="color:${needsPRV?'#ffaa00':'#00ff9d'}">${needsPRV?'YA':'TIDAK'}</div></div>
        <div class="result-item"><div class="rk">Jumlah Zona PRV</div><div class="rv">${needsPRV?zones:0}<span class="ru"> zona</span></div></div>
      </div>
    </div>

    <div class="result-sec">
      <div class="result-sec-title">💡 Rekomendasi Sistem</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="rec-card">
          <div class="rec-icon">🏗️</div>
          <div class="rec-text">Sistem <strong>${sysMap[system]}</strong> dipilih untuk bangunan ${floors} lantai.
          ${system==='downfeed'?'Tangki atas wajib ≥ 0.5 m di atas plat lantai tertinggi untuk tekanan minimum 0.05 bar.':
            system==='upfeed'?'Pastikan 2 unit pompa booster (1 operasi + 1 standby) dengan ATS otomatis agar tekanan stabil 24 jam.':
            'Kombinasi terbaik untuk keandalan tinggi — pompa mengisi tangki atas, booster menjaga tekanan di lantai bawah.'}</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">⚙️</div>
          <div class="rec-text">Gunakan <strong>2 unit pompa ${pwFinal} kW, Q = ${QpM3h.toFixed(1)} m³/jam, H = ${H} m</strong> — satu operasi, satu standby. Panel ATS otomatis switching jika pompa utama gagal start.</div>
        </div>
        ${needsPRV?`<div class="rec-card">
          <div class="rec-icon">🔧</div>
          <div class="rec-text">Tekanan di dasar sistem mencapai <strong>${workP.toFixed(1)} bar</strong> — melebihi batas nyaman 3.5 bar. Pasang <strong>PRV di ${zones} zona</strong>, setting outlet 2.5–3.0 bar untuk melindungi fitting dan kenyamanan pengguna.</div>
        </div>`:''}
        <div class="rec-card">
          <div class="rec-icon">🚰</div>
          <div class="rec-text">Pipa rekomendasi: <strong>${pipeMat[pipe]}</strong>. Pipa utama <strong>DN${pipeD}</strong>, distribusi lantai <strong>DN${branchD}</strong>. Kecepatan aliran 1.5 m/s pada kondisi puncak.</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">💧</div>
          <div class="rec-text">Sumber: <strong>${srcMap[source]}</strong>.
          ${source==='keduanya'?'Pasang solenoid valve dengan priority PDAM. Sumur bor aktif otomatis saat PDAM terganggu lebih dari 15 menit.':
            source==='sumur'?'Pasang sand filter, activated carbon filter, dan disinfeksi UV sebelum masuk tangki bawah.':
            'Pasang water meter induk (bulk meter) di inlet PDAM untuk monitoring konsumsi dan deteksi kebocoran.'}</div>
        </div>
        <div class="rec-card ${workP>7?' rec-warn':''}">
          <div class="rec-icon">${workP>7?'⚠️':'📋'}</div>
          <div class="rec-text">
          ${workP>7?`<strong>PERINGATAN:</strong> Tekanan sistem ${workP.toFixed(1)} bar sangat tinggi. Gunakan pipa dan fitting bertekanan tinggi (PN16 minimum). Pasang safety relief valve pada pressure tank.`:
          `Tangki bawah ${fmt(gtCap)} menyediakan cadangan air <strong>1.5 hari</strong> saat PDAM mati. Cukup untuk sebagian besar gangguan suplai di Indonesia.`}
          </div>
        </div>
      </div>
    </div>`;
}

// Init
buildCompGrid();
buildGuide();
