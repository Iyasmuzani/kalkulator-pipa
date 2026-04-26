// ==================== STATE ====================
let currentSystem = 'bangunan';
let totalChecks = 0, doneChecks = 0;

// ==================== SYSTEM CONFIG ====================
const systemConfig = {
  bangunan: {
    title: 'Sistem Perpipaan & Pompa Bangunan',
    sub: 'Panduan instalasi interaktif · Visualisasi komponen · Kalkulator',
    badge: 'SNI 8153:2025 · v2.1',
    icon: '💧',
    vizLabel: 'Diagram Potongan Bangunan — Klik komponen untuk detail',
    guideIntro: 'Ikuti 8 tahap instalasi ini secara berurutan. Panduan mengacu pada <strong style="color:var(--sys-accent)">SNI 8153:2025</strong> tentang Tata Cara Perencanaan Sistem Plambing.',
    compData: () => bangunanCompData,
    guideData: () => bangunanGuideData,
    tagMap: {'roof-tank':'Tangki','ground-tank':'Tangki','pump':'Pompa','pressure-tank':'Tangki Tekan','prv':'Valve','gate-valve':'Valve','check-valve':'Valve','pressure-gauge':'Instrumen','water-meter':'Instrumen','floor-drain':'Drainase'}
  },
  tambang: {
    title: 'Sistem Perpipaan Tambang',
    sub: 'Dewatering · Slurry transport · Settling pond · Kalkulator',
    badge: 'Kepmen ESDM · v1.0',
    icon: '⛏️',
    vizLabel: 'Diagram Potongan Pit Tambang — Klik komponen untuk detail',
    guideIntro: 'Ikuti 7 tahap instalasi sistem perpipaan tambang. Panduan mengacu pada <strong style="color:var(--sys-accent)">Kepmen ESDM</strong> dan <strong style="color:var(--sys-accent)">ASTM D2241</strong>.',
    compData: () => tambangCompData,
    guideData: () => tambangGuideData,
    tagMap: {'dewater-pump':'Pompa','slurry-pump':'Pompa','hdpe-pipe':'Pipa','steel-pipe':'Pipa','settling-pond':'Kolam','butterfly-valve':'Valve','knife-gate':'Valve','flow-meter':'Instrumen','expansion-joint':'Fitting','wear-liner':'Pelindung'}
  },
  distribusi: {
    title: 'Sistem Perpipaan Jaringan Distribusi Air',
    sub: 'Transmisi · Distribusi · DMA · NRW management · Kalkulator',
    badge: 'SNI 7511 · v1.0',
    icon: '🌐',
    vizLabel: 'Layout Jaringan Distribusi Air — Klik komponen untuk detail',
    guideIntro: 'Ikuti 8 tahap instalasi jaringan distribusi air. Panduan mengacu pada <strong style="color:var(--sys-accent)">SNI 7511:2011</strong> dan <strong style="color:var(--sys-accent)">BS EN 805:2025</strong>.',
    compData: () => distribusiCompData,
    guideData: () => distribusiGuideData,
    tagMap: {'intake':'Sumber','reservoir':'Penampung','booster-pump':'Pompa','pipa-transmisi':'Pipa','pipa-distribusi':'Pipa','gate-valve-net':'Valve','air-valve':'Valve','prv-net':'Valve','water-meter-bulk':'Instrumen','hydrant':'Hidran'}
  }
};

// ==================== SYSTEM SWITCHING ====================
function switchSystem(sys) {
  currentSystem = sys;
  document.documentElement.setAttribute('data-system', sys);
  document.querySelectorAll('.sys-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sys-' + sys).classList.add('active');

  const cfg = systemConfig[sys];
  document.getElementById('hdr-title').textContent = cfg.title;
  document.getElementById('hdr-sub').textContent = cfg.sub;
  document.getElementById('hdr-badge').textContent = cfg.badge;
  document.getElementById('hdr-icon').textContent = cfg.icon;
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

function resetCompPanel() {
  const count = Object.keys(systemConfig[currentSystem].compData()).length;
  document.getElementById('comp-panel').innerHTML = `
    <div class="placeholder">
      <div class="ph-icon">👆</div>
      <div class="ph-text">Klik salah satu komponen pada diagram di sebelah kiri</div>
      <div class="ph-hint">${count} KOMPONEN TERSEDIA</div>
    </div>`;
  document.getElementById('comp-count').textContent = count + ' komponen';
}

function resetCalcResults() {
  document.getElementById('rec-results').innerHTML = `
    <div class="rec-placeholder">
      <div style="font-size:48px;opacity:.2">🎯</div>
      <div style="font-size:13px;color:var(--text2);max-width:220px;line-height:1.7;text-align:center">
        Isi data di panel kiri, lalu klik <strong style="color:var(--sys-accent)">Hitung</strong>
        untuk mendapatkan spesifikasi teknis otomatis
      </div>
    </div>`;
}

// ==================== TAB SWITCHING ====================
function switchTab(t) {
  const tabNames = ['visualisasi','komponen','panduan','kalkulator'];
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
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac}">${d.icon}</div>
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
      <div class="cc-icon">${d.icon}</div>
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
    <button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('open')">✕</button>
    <div class="cp-header" style="margin-top:4px">
      <div class="cp-icon" style="background:${d.bg};border:1.5px solid ${d.ac}">${d.icon}</div>
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
        <div class="step-warning">⚠️ <span>${s.warn}</span></div>
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

// ==================== INIT ====================
buildSVG();
buildCompGrid();
buildGuide();
buildCalcForm();
