// ==================== CHART HELPERS (Chart.js) ====================
// Shared chart instance tracker to prevent memory leaks
var _chartInstances = {};
function destroyChart(id) {
  if (_chartInstances[id]) { _chartInstances[id].destroy(); delete _chartInstances[id]; }
}

// Default dark theme options matching app design
var chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 800, easing: 'easeOutQuart' },
  plugins: {
    legend: { labels: { color: '#7a9ab8', font: { size: 11, family: "'Inter','Fira Code',monospace" }, boxWidth: 12, padding: 10 } },
    tooltip: { backgroundColor: 'rgba(6,14,26,.95)', titleColor: '#00e5ff', bodyColor: '#c8d6e5', borderColor: 'rgba(0,229,255,.15)', borderWidth: 1, cornerRadius: 6, padding: 10, titleFont: { size: 12, weight: '600' }, bodyFont: { size: 11 } }
  },
  scales: {
    x: { ticks: { color: '#5a7a96', font: { size: 10 } }, grid: { color: 'rgba(0,212,255,.06)' }, border: { color: 'rgba(0,212,255,.12)' } },
    y: { ticks: { color: '#5a7a96', font: { size: 10 } }, grid: { color: 'rgba(0,212,255,.06)' }, border: { color: 'rgba(0,212,255,.12)' } }
  }
};

function mergeOpts(custom) {
  var o = JSON.parse(JSON.stringify(chartDefaults));
  if (custom.plugins) {
    if (custom.plugins.legend) Object.assign(o.plugins.legend, custom.plugins.legend);
    if (custom.plugins.tooltip) Object.assign(o.plugins.tooltip, custom.plugins.tooltip);
    if (custom.plugins.title) o.plugins.title = custom.plugins.title;
  }
  if (custom.scales) {
    if (custom.scales.x) Object.assign(o.scales.x, custom.scales.x);
    if (custom.scales.y) Object.assign(o.scales.y, custom.scales.y);
    if (custom.scales.y1) o.scales.y1 = custom.scales.y1;
  }
  if (custom.indexAxis) o.indexAxis = custom.indexAxis;
  return o;
}

// ==================== 1. PRESSURE LOSS — Pressure Profile Chart ====================
function chartPressureProfile(containerId, L, hf_major, hf_minor_total, v) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var nPoints = 10;
  var labels = [];
  var dataHL = [];
  var dataPressure = [];
  var hf_total_per_m = (hf_major + hf_minor_total) / L;
  var pStart = hf_major + hf_minor_total; // available head at start

  for (var i = 0; i <= nPoints; i++) {
    var x = (L / nPoints) * i;
    labels.push(x.toFixed(0) + 'm');
    var hl = hf_total_per_m * x;
    dataHL.push(parseFloat(hl.toFixed(3)));
    dataPressure.push(parseFloat((pStart - hl).toFixed(3)));
  }

  var opts = mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Jarak (m)', color: '#7a9ab8', font: { size: 11 } } },
      y: { title: { display: true, text: 'Head (m)', color: '#7a9ab8', font: { size: 11 } }, beginAtZero: true }
    }
  });
  opts.scales.y.beginAtZero = true;

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Head Loss Kumulatif (m)', data: dataHL, borderColor: '#ff8c42', backgroundColor: 'rgba(255,140,66,.1)', fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: '#ff8c42', borderWidth: 2 },
        { label: 'Sisa Tekanan (m)', data: dataPressure, borderColor: '#00e5ff', backgroundColor: 'rgba(0,229,255,.08)', fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: '#00e5ff', borderWidth: 2 }
      ]
    },
    options: opts
  });
}

// ==================== 2. FRICTION LOSS — Head Loss vs Diameter Chart ====================
function chartFrictionVsDiameter(containerId, Q_Ls, L, eps, T) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var nu = 1.78e-6 / (1 + 0.0337 * T + 0.00022 * T * T);
  var Q = Q_Ls / 1000; // m³/s
  var diameters = [50, 75, 100, 125, 150, 200, 250, 300, 400, 500];
  var labels = diameters.map(function(d) { return 'DN' + d; });
  var dataHL = [];
  var dataV = [];

  diameters.forEach(function(dmm) {
    var d = dmm / 1000;
    var v = 4 * Q / (Math.PI * d * d);
    var Re = v * d / nu;
    var epsM = eps / 1000;
    var f = 0.02;
    for (var i = 0; i < 50; i++) {
      var rhs = -2 * Math.log10(epsM / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)));
      f = 1 / (rhs * rhs);
    }
    var hf = f * (L / d) * v * v / (2 * 9.81);
    dataHL.push(parseFloat(hf.toFixed(2)));
    dataV.push(parseFloat(v.toFixed(2)));
  });

  var opts = mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Diameter Pipa', color: '#7a9ab8', font: { size: 11 } } },
      y: { title: { display: true, text: 'Head Loss (m)', color: '#7a9ab8', font: { size: 11 } }, type: 'logarithmic' },
      y1: { position: 'right', title: { display: true, text: 'Kecepatan (m/s)', color: '#00e676', font: { size: 11 } }, ticks: { color: '#00e676', font: { size: 10 } }, grid: { display: false }, border: { color: 'rgba(0,230,118,.12)' } }
    }
  });

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Head Loss (m)', data: dataHL, backgroundColor: dataHL.map(function(h) { return h > 50 ? 'rgba(255,85,85,.6)' : h > 10 ? 'rgba(255,170,0,.5)' : 'rgba(0,229,255,.4)'; }), borderColor: dataHL.map(function(h) { return h > 50 ? '#ff5555' : h > 10 ? '#ffaa00' : '#00e5ff'; }), borderWidth: 1, yAxisID: 'y', borderRadius: 4 },
        { label: 'Kecepatan (m/s)', data: dataV, type: 'line', borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,.08)', tension: 0.3, pointRadius: 4, pointBackgroundColor: '#00e676', borderWidth: 2, yAxisID: 'y1' }
      ]
    },
    options: opts
  });
}

// ==================== 3. DISTRIBUSI — Debit vs Diameter ====================
function chartDistribusiPipe(containerId, QpkLs, QdLs, pDT, pDD) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var sizes = [50, 75, 100, 125, 150, 200, 250, 300, 400, 500];
  var labels = sizes.map(function(s) { return 'DN' + s; });
  // Capacity at 1.5 m/s (for transmission) and 1.0 m/s (distribution)
  var capTrans = sizes.map(function(d) {
    var dm = d / 1000;
    return parseFloat((Math.PI / 4 * dm * dm * 1.5 * 1000).toFixed(1)); // L/s
  });
  var capDist = sizes.map(function(d) {
    var dm = d / 1000;
    return parseFloat((Math.PI / 4 * dm * dm * 1.0 * 1000).toFixed(1)); // L/s
  });

  var opts = mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Diameter Pipa (DN)', color: '#7a9ab8', font: { size: 11 } } },
      y: { title: { display: true, text: 'Kapasitas (L/s)', color: '#7a9ab8', font: { size: 11 } }, type: 'logarithmic' }
    }
  });

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Kapasitas @1.5m/s (Transmisi)', data: capTrans, backgroundColor: capTrans.map(function(c) { return c >= QpkLs ? 'rgba(0,170,204,.45)' : 'rgba(0,170,204,.15)'; }), borderColor: '#00aacc', borderWidth: 1, borderRadius: 3 },
        { label: 'Kapasitas @1.0m/s (Distribusi)', data: capDist, backgroundColor: capDist.map(function(c) { return c >= QdLs ? 'rgba(102,119,221,.45)' : 'rgba(102,119,221,.15)'; }), borderColor: '#6677dd', borderWidth: 1, borderRadius: 3 },
        { label: 'Debit Puncak (' + QpkLs.toFixed(1) + ' L/s)', data: sizes.map(function() { return QpkLs; }), type: 'line', borderColor: '#ff8c42', borderWidth: 2, borderDash: [6, 3], pointRadius: 0, fill: false },
        { label: 'Debit Distribusi (' + QdLs.toFixed(1) + ' L/s)', data: sizes.map(function() { return QdLs; }), type: 'line', borderColor: '#00e676', borderWidth: 2, borderDash: [6, 3], pointRadius: 0, fill: false }
      ]
    },
    options: opts
  });
}

// ==================== 4. THERMAL EXPANSION — Material Comparison Bar ====================
function chartThermalComparison(containerId, L, dT, od) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var mats = [
    { name: 'HDPE', alpha: 0.20, color: 'rgba(0,188,212,.7)', border: '#00bcd4' },
    { name: 'PPR', alpha: 0.15, color: 'rgba(0,230,118,.7)', border: '#00e676' },
    { name: 'PVC-U', alpha: 0.06, color: 'rgba(170,102,255,.7)', border: '#aa66ff' },
    { name: 'PPR-CT', alpha: 0.05, color: 'rgba(102,187,106,.7)', border: '#66bb6a' },
    { name: 'Tembaga', alpha: 0.017, color: 'rgba(255,138,101,.7)', border: '#ff8a65' },
    { name: 'Baja', alpha: 0.012, color: 'rgba(170,170,170,.7)', border: '#aaaaaa' }
  ];
  var labels = mats.map(function(m) { return m.name; });
  var dataExp = mats.map(function(m) { return parseFloat((m.alpha * L * Math.abs(dT)).toFixed(1)); });
  var colors = mats.map(function(m) { return m.color; });
  var borders = mats.map(function(m) { return m.border; });

  var opts = mergeOpts({
    indexAxis: 'y',
    scales: {
      x: { title: { display: true, text: 'Pemuaian ΔL (mm)', color: '#7a9ab8', font: { size: 11 } }, beginAtZero: true },
      y: {}
    },
    plugins: { legend: { display: false } }
  });
  opts.indexAxis = 'y';
  opts.scales.x.beginAtZero = true;

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pemuaian (mm)',
        data: dataExp,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: opts
  });
}

// ==================== 5. NRW — Water Balance Doughnut ====================
function chartNRWBalance(containerId, billed, unbilledAuth, apparentLoss, realLoss) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var opts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    cutout: '55%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#7a9ab8', font: { size: 10, family: "'Inter','Fira Code',monospace" }, boxWidth: 10, padding: 8 } },
      tooltip: { backgroundColor: 'rgba(6,14,26,.95)', titleColor: '#00e5ff', bodyColor: '#c8d6e5', borderColor: 'rgba(0,229,255,.15)', borderWidth: 1, cornerRadius: 6, callbacks: {
        label: function(ctx) {
          var total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
          var pct = (ctx.raw / total * 100).toFixed(1);
          return ctx.label + ': ' + (ctx.raw / 1000).toFixed(1) + '×10³ m³ (' + pct + '%)';
        }
      }}
    }
  };

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Air Terjual (Billed)', 'Konsumsi Resmi Tak Billed', 'Kehilangan Semu', 'Kehilangan Nyata'],
      datasets: [{
        data: [billed, unbilledAuth, apparentLoss, realLoss],
        backgroundColor: ['rgba(0,230,118,.7)', 'rgba(109,213,237,.5)', 'rgba(255,170,0,.6)', 'rgba(255,85,85,.7)'],
        borderColor: ['#00e676', '#6dd5ed', '#ffaa00', '#ff5555'],
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: opts
  });
}

// ==================== 6. NRW — ILI Benchmark Bar ====================
function chartILIBenchmark(containerId, currentILI) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var labels = ['Band A\n(≤2)', 'Band B\n(2-4)', 'Band C\n(4-8)', 'Band D\n(>8)', 'Saat Ini'];
  var data = [2, 4, 8, 12, parseFloat(currentILI.toFixed(2))];
  var colors = ['rgba(0,230,118,.6)', 'rgba(109,213,237,.6)', 'rgba(255,170,0,.6)', 'rgba(255,85,85,.6)',
    currentILI <= 2 ? 'rgba(0,230,118,.9)' : currentILI <= 4 ? 'rgba(109,213,237,.9)' : currentILI <= 8 ? 'rgba(255,170,0,.9)' : 'rgba(255,85,85,.9)'];
  var borders = ['#00e676', '#6dd5ed', '#ffaa00', '#ff5555',
    currentILI <= 2 ? '#00e676' : currentILI <= 4 ? '#6dd5ed' : currentILI <= 8 ? '#ffaa00' : '#ff5555'];

  var opts = mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Kategori IWA', color: '#7a9ab8', font: { size: 11 } } },
      y: { title: { display: true, text: 'ILI Value', color: '#7a9ab8', font: { size: 11 } }, beginAtZero: true }
    },
    plugins: { legend: { display: false } }
  });
  opts.scales.y.beginAtZero = true;

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: opts
  });
}

// ==================== 7. WATER HAMMER — Pipe Animation ====================
var _whAnimId = null;
var _whAnimParams = null;

function whAnimRestart() {
  if (_whAnimParams) {
    startWaterHammerAnim(_whAnimParams.a, _whAnimParams.v, _whAnimParams.Pw, _whAnimParams.dPbar, _whAnimParams.Ptotal, _whAnimParams.Tr, _whAnimParams.L, _whAnimParams.mat);
  }
}

function startWaterHammerAnim(a, v, Pw, dPbar, Ptotal, Tr, L, mat) {
  if (_whAnimId) { cancelAnimationFrame(_whAnimId); _whAnimId = null; }
  _whAnimParams = { a: a, v: v, Pw: Pw, dPbar: dPbar, Ptotal: Ptotal, Tr: Tr, L: L, mat: mat };

  var canvas = document.getElementById('wh-anim-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // HiDPI setup
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = 180 * dpr;
  ctx.scale(dpr, dpr);
  var W = rect.width, H = 180;

  // Layout
  var pipeY = H * 0.35, pipeH = H * 0.30;
  var pipeX = 40, pipeW = W - 80;
  var valveX = pipeX + pipeW; // valve at right end

  // Particles
  var particles = [];
  var nParticles = 28;
  for (var i = 0; i < nParticles; i++) {
    particles.push({
      x: pipeX + Math.random() * pipeW,
      y: pipeY + 4 + Math.random() * (pipeH - 8),
      r: 1.5 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.4
    });
  }

  // Damping by material: HDPE damps more
  var dampFactor = mat === 'hdpe' ? 0.35 : mat === 'ppr' ? 0.32 : mat === 'pvc' ? 0.25 : 0.15;

  // Animation phases (time in seconds at 60fps simulation speed)
  // Phase 0: Normal flow (0-2s)
  // Phase 1: Valve closing (2-2.5s)
  // Phase 2-7: Pressure waves bouncing (multiple reflections)
  var totalDuration = 12; // seconds of animation
  var fps = 60;
  var totalFrames = totalDuration * fps;
  var frame = 0;
  var valveCloseFrame = 2 * fps;     // valve starts closing at t=2s
  var valveClosedFrame = 2.5 * fps;  // valve fully closed at t=2.5s
  var waveStartFrame = valveClosedFrame;

  // Simulated reflection period (normalized for visual effect, not real Tr)
  var waveReflectFrames = 1.2 * fps; // ~1.2s per reflection visually

  var statusEl = document.getElementById('wh-anim-status');

  function draw() {
    var t = frame / fps;
    ctx.clearRect(0, 0, W, H);

    // ===== Background pipe ======
    // Pipe outline
    ctx.fillStyle = 'rgba(0,20,40,.6)';
    ctx.strokeStyle = 'rgba(0,180,220,.2)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, pipeX - 2, pipeY - 2, pipeW + 4, pipeH + 4, 6);
    ctx.fill();
    ctx.stroke();

    // Pipe interior
    ctx.fillStyle = 'rgba(0,30,50,.8)';
    roundRect(ctx, pipeX, pipeY, pipeW, pipeH, 4);
    ctx.fill();

    // Labels: Source (left) and Valve (right)
    ctx.font = "bold 9px 'Space Grotesk', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(142,155,176,.6)';
    ctx.fillText('SUMBER', pipeX + 20, pipeY - 8);
    ctx.fillText('KATUP', valveX - 15, pipeY - 8);

    // ===== Pressure zones (colored overlay inside pipe) =====
    var valveProgress = 0; // 0=open, 1=closed
    if (frame >= valveCloseFrame && frame < valveClosedFrame) {
      valveProgress = (frame - valveCloseFrame) / (valveClosedFrame - valveCloseFrame);
    } else if (frame >= valveClosedFrame) {
      valveProgress = 1;
    }

    if (frame >= waveStartFrame) {
      var waveT = (frame - waveStartFrame) / waveReflectFrames;
      var nReflections = Math.floor(waveT);
      var waveFrac = waveT - nReflections;
      var direction = (nReflections % 2 === 0) ? -1 : 1; // -1 = going left, +1 = going right
      var intensity = Math.exp(-dampFactor * nReflections) * (1 - waveFrac * 0.2);
      if (intensity < 0.05) intensity = 0;

      // Determine pressure type: even reflections = high pressure going left, odd = low pressure going right
      var isHighPressure = (nReflections % 2 === 0);

      if (intensity > 0) {
        var waveFront;
        if (direction === -1) {
          // Wave going left (from valve to source)
          waveFront = valveX - (waveFrac * pipeW);
          var zoneLeft = waveFront;
          var zoneRight = valveX;
          if (zoneLeft < pipeX) zoneLeft = pipeX;

          ctx.save();
          ctx.beginPath();
          ctx.rect(pipeX, pipeY, pipeW, pipeH);
          ctx.clip();

          var grad = ctx.createLinearGradient(zoneLeft, 0, zoneRight, 0);
          if (isHighPressure) {
            grad.addColorStop(0, 'rgba(255,50,50,' + (0.35 * intensity) + ')');
            grad.addColorStop(0.5, 'rgba(255,80,50,' + (0.25 * intensity) + ')');
            grad.addColorStop(1, 'rgba(255,100,60,' + (0.15 * intensity) + ')');
          } else {
            grad.addColorStop(0, 'rgba(50,100,255,' + (0.3 * intensity) + ')');
            grad.addColorStop(0.5, 'rgba(68,136,255,' + (0.2 * intensity) + ')');
            grad.addColorStop(1, 'rgba(80,150,255,' + (0.1 * intensity) + ')');
          }
          ctx.fillStyle = grad;
          ctx.fillRect(zoneLeft, pipeY, zoneRight - zoneLeft, pipeH);
          ctx.restore();

          // Wave front line
          if (waveFront > pipeX && waveFront < valveX) {
            ctx.strokeStyle = isHighPressure ? 'rgba(255,85,85,' + (0.8 * intensity) + ')' : 'rgba(68,136,255,' + (0.8 * intensity) + ')';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(waveFront, pipeY + 2);
            ctx.lineTo(waveFront, pipeY + pipeH - 2);
            ctx.stroke();
          }
        } else {
          // Wave going right (from source to valve)
          waveFront = pipeX + (waveFrac * pipeW);
          var zoneLeft2 = pipeX;
          var zoneRight2 = waveFront;
          if (zoneRight2 > valveX) zoneRight2 = valveX;

          ctx.save();
          ctx.beginPath();
          ctx.rect(pipeX, pipeY, pipeW, pipeH);
          ctx.clip();

          var grad2 = ctx.createLinearGradient(zoneLeft2, 0, zoneRight2, 0);
          if (isHighPressure) {
            grad2.addColorStop(0, 'rgba(255,100,60,' + (0.15 * intensity) + ')');
            grad2.addColorStop(1, 'rgba(255,50,50,' + (0.3 * intensity) + ')');
          } else {
            grad2.addColorStop(0, 'rgba(80,150,255,' + (0.1 * intensity) + ')');
            grad2.addColorStop(1, 'rgba(50,100,255,' + (0.25 * intensity) + ')');
          }
          ctx.fillStyle = grad2;
          ctx.fillRect(zoneLeft2, pipeY, zoneRight2 - zoneLeft2, pipeH);
          ctx.restore();

          if (waveFront > pipeX && waveFront < valveX) {
            ctx.strokeStyle = isHighPressure ? 'rgba(255,85,85,' + (0.7 * intensity) + ')' : 'rgba(68,136,255,' + (0.7 * intensity) + ')';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(waveFront, pipeY + 2);
            ctx.lineTo(waveFront, pipeY + pipeH - 2);
            ctx.stroke();
          }
        }
      }
    }

    // ===== Particles =====
    for (var p = 0; p < particles.length; p++) {
      var pt = particles[p];
      var pColor = '#00e5ff';
      var pAlpha = 0.7;

      if (frame < valveCloseFrame) {
        // Normal flow: move right
        pt.x += pt.speed * (v / 1.5);
        if (pt.x > valveX - 4) pt.x = pipeX + 4;
      } else if (frame < valveClosedFrame) {
        // Slowing down near valve
        var slowFactor = 1 - valveProgress;
        pt.x += pt.speed * (v / 1.5) * slowFactor;
        if (pt.x > valveX - 8 * valveProgress - 4) {
          pt.x = valveX - 8 * valveProgress - 4 - Math.random() * 10;
        }
      } else {
        // After valve closed: particles vibrate/compress
        var waveT2 = (frame - waveStartFrame) / waveReflectFrames;
        var ampDecay = Math.exp(-dampFactor * waveT2);
        var vibration = Math.sin(waveT2 * Math.PI * 4) * ampDecay * 1.5;
        pt.x += vibration * pt.speed;

        // Clamp inside pipe
        if (pt.x < pipeX + 4) pt.x = pipeX + 4;
        if (pt.x > valveX - 12) pt.x = valveX - 12;

        // Pressure coloring based on position
        if (frame >= waveStartFrame) {
          var nRef = Math.floor(waveT2);
          var wFrac = waveT2 - nRef;
          var dir = (nRef % 2 === 0) ? -1 : 1;
          var highP = (nRef % 2 === 0);
          var wFront2 = dir === -1 ? (valveX - wFrac * pipeW) : (pipeX + wFrac * pipeW);
          var inWave = dir === -1 ? (pt.x > wFront2 && pt.x < valveX) : (pt.x < wFront2 && pt.x > pipeX);

          if (inWave && Math.exp(-dampFactor * nRef) > 0.05) {
            pColor = highP ? '#ff7766' : '#6699ff';
            pAlpha = 0.9;
          }
        }
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = pColor.replace(')', ',' + pAlpha + ')').replace('rgb', 'rgba').replace('##', '#');
      // Simplified: just use globalAlpha
      ctx.globalAlpha = pAlpha;
      ctx.fillStyle = pColor;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ===== Valve drawing =====
    var vAngle = valveProgress * 1; // 0=open(horizontal), 1=closed(vertical)
    ctx.save();
    ctx.translate(valveX, pipeY + pipeH / 2);

    // Valve body
    ctx.fillStyle = '#ff8c42';
    ctx.strokeStyle = '#cc6620';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-5, -pipeH / 2 - 6, 10, pipeH + 12);
    ctx.strokeRect(-5, -pipeH / 2 - 6, 10, pipeH + 12);

    // Valve gate (the closing part)
    var gateH = pipeH * vAngle;
    if (gateH > 2) {
      ctx.fillStyle = 'rgba(255,140,66,.85)';
      ctx.fillRect(-3, -gateH / 2, 6, gateH);
    }

    // Valve handle
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -pipeH / 2 - 6);
    ctx.lineTo(0, -pipeH / 2 - 18);
    ctx.stroke();
    // Handle top
    var handleRotation = -valveProgress * Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(handleRotation) * -8, -pipeH / 2 - 18 + Math.sin(handleRotation) * -8);
    ctx.lineTo(Math.cos(handleRotation) * 8, -pipeH / 2 - 18 + Math.sin(handleRotation) * 8);
    ctx.stroke();

    ctx.restore();

    // ===== Source symbol (left) =====
    ctx.fillStyle = 'rgba(0,229,255,.15)';
    ctx.strokeStyle = 'rgba(0,229,255,.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pipeX - 2, pipeY + pipeH / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,229,255,.6)';
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', pipeX - 2, pipeY + pipeH / 2);

    // ===== Pressure gauge at valve =====
    var currentP = Pw;
    if (frame >= waveStartFrame) {
      var waveT3 = (frame - waveStartFrame) / waveReflectFrames;
      var oscAmp = dPbar * Math.exp(-dampFactor * waveT3);
      currentP = Pw + oscAmp * Math.cos(waveT3 * Math.PI);
    }
    var gaugeX = valveX + 2, gaugeY = pipeY + pipeH + 18;
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    var pColor2 = currentP > Pw * 1.3 ? '#ff5555' : currentP < Pw * 0.7 ? '#4488ff' : '#00e5ff';
    ctx.fillStyle = pColor2;
    ctx.fillText('P = ' + currentP.toFixed(1) + ' bar', gaugeX - 35, gaugeY + 5);

    // ===== Pressure bar at bottom =====
    var barY = pipeY + pipeH + 30;
    var barH = 8;
    var barW = pipeW;
    ctx.fillStyle = 'rgba(0,20,40,.6)';
    roundRect(ctx, pipeX, barY, barW, barH, 3);
    ctx.fill();
    // Fill based on current pressure
    var fillRatio = Math.min(currentP / (Ptotal * 1.1), 1);
    var barColor = currentP > Pw * 1.3 ? '#ff5555' : currentP < Pw * 0.7 ? '#4488ff' : '#00e5ff';
    ctx.fillStyle = barColor;
    roundRect(ctx, pipeX, barY, barW * fillRatio, barH, 3);
    ctx.fill();
    // Bar labels
    ctx.font = "9px 'Space Grotesk', sans-serif";
    ctx.fillStyle = 'rgba(142,155,176,.5)';
    ctx.textAlign = 'left';
    ctx.fillText('0', pipeX, barY + barH + 12);
    ctx.textAlign = 'center';
    ctx.fillText(Pw.toFixed(0) + ' bar (MOP)', pipeX + barW * (Pw / (Ptotal * 1.1)), barY + barH + 12);
    ctx.textAlign = 'right';
    ctx.fillText(Ptotal.toFixed(1) + ' bar', pipeX + barW, barY + barH + 12);

    // ===== Phase status text =====
    if (statusEl) {
      if (frame < valveCloseFrame) {
        statusEl.innerHTML = '▶ Fase 1: <span style="color:#00e5ff">Aliran Normal</span> — v = ' + v.toFixed(1) + ' m/s, P = ' + Pw + ' bar';
      } else if (frame < valveClosedFrame) {
        statusEl.innerHTML = '⚠ Fase 2: <span style="color:#ff8c42">Katup Menutup...</span> (' + (valveProgress * 100).toFixed(0) + '%)';
      } else {
        var waveT4 = (frame - waveStartFrame) / waveReflectFrames;
        var nR = Math.floor(waveT4) + 1;
        var decayPct = (Math.exp(-dampFactor * waveT4) * 100).toFixed(0);
        if (decayPct < 5) {
          statusEl.innerHTML = '✓ <span style="color:#00ff9d">Stabil</span> — Tekanan kembali normal ' + Pw + ' bar';
        } else {
          var phaseLabel = (nR % 2 === 1) ? '<span style="color:#ff5555">Tekanan Tinggi ↑</span>' : '<span style="color:#4488ff">Tekanan Rendah ↓</span>';
          statusEl.innerHTML = '⚡ Fase 3: ' + phaseLabel + ' — Refleksi #' + nR + ' | Intensitas ' + decayPct + '%';
        }
      }
    }

    // ===== Loop =====
    frame++;
    if (frame < totalFrames) {
      _whAnimId = requestAnimationFrame(draw);
    }
  }

  draw();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ==================== 8. WATER HAMMER — Pressure Oscillation Chart ====================
function chartWHOscillation(containerId, Pw, dPbar, Tr, mat) {
  if (typeof Chart === 'undefined') return;
  destroyChart(containerId);
  var canvas = document.getElementById(containerId);
  if (!canvas) return;

  var dampFactor = mat === 'hdpe' ? 0.35 : mat === 'ppr' ? 0.32 : mat === 'pvc' ? 0.25 : 0.15;
  var nCycles = 6;
  var nPoints = 120;
  var labels = [];
  var dataP = [];
  var dataMOP = [];
  var data15MOP = [];

  var totalTime = Tr * nCycles;

  for (var i = 0; i <= nPoints; i++) {
    var t = (i / nPoints) * totalTime;
    labels.push(t.toFixed(2) + 's');
    dataMOP.push(Pw);
    data15MOP.push(Pw * 1.5);

    // Damped oscillation: P(t) = Pw + dPbar * e^(-dampFactor * t/Tr) * cos(pi * t / Tr)
    var cycleT = t / Tr;
    var amplitude = dPbar * Math.exp(-dampFactor * cycleT * 2);
    var pressure = Pw + amplitude * Math.cos(Math.PI * cycleT);
    dataP.push(parseFloat(pressure.toFixed(2)));
  }

  var maxP = Pw + dPbar * 1.1;
  var minP = Math.max(0, Pw - dPbar * 1.1);

  var opts = mergeOpts({
    scales: {
      x: { title: { display: true, text: 'Waktu (detik)', color: '#7a9ab8', font: { size: 11 } },
        ticks: { maxTicksLimit: 10 } },
      y: { title: { display: true, text: 'Tekanan (bar)', color: '#7a9ab8', font: { size: 11 } },
        min: minP, max: maxP }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return ctx.dataset.label + ': ' + ctx.raw.toFixed(2) + ' bar';
          }
        }
      }
    }
  });

  _chartInstances[containerId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Tekanan di Katup',
          data: dataP,
          borderColor: '#00e5ff',
          backgroundColor: function(ctx) {
            var chart = ctx.chart;
            var gCtx = chart.ctx;
            var area = chart.chartArea;
            if (!area) return 'rgba(0,229,255,.1)';
            var gradient = gCtx.createLinearGradient(0, area.top, 0, area.bottom);
            gradient.addColorStop(0, 'rgba(255,85,85,.15)');
            gradient.addColorStop(0.5, 'rgba(0,229,255,.05)');
            gradient.addColorStop(1, 'rgba(68,136,255,.1)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5
        },
        {
          label: 'Tekanan Kerja (MOP)',
          data: dataMOP,
          borderColor: 'rgba(0,230,118,.5)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Batas 1.5× MOP',
          data: data15MOP,
          borderColor: 'rgba(255,85,85,.5)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: opts
  });
}
