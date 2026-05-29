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
