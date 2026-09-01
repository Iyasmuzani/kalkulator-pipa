// ==========================================
// ANIMASI COLLAPSE RESISTANCE
// Visualisasi pipa cross-section yang terdeformasi
// oleh tekanan eksternal (vakum / well casing)
// ==========================================

let collapseAnimState = null;

function initCollapseAnim(container, params) {
  // params: { mode, OD, t, Pc_bar, Pa_bar, targetPressure, SDR, status }
  // status: 'safe', 'warning', 'danger'

  // Cleanup previous
  if (collapseAnimState) {
    collapseAnimState.running = false;
    if (collapseAnimState.rafId) cancelAnimationFrame(collapseAnimState.rafId);
  }

  var mode = params.mode || 'vacuum';
  var status = params.status || 'safe';

  // Status colors
  var statusColors = {
    safe:    { main: '#00e676', bg: 'rgba(0,230,118,0.08)', glow: 'rgba(0,230,118,0.3)' },
    warning: { main: '#ffc107', bg: 'rgba(255,193,7,0.08)',  glow: 'rgba(255,193,7,0.3)' },
    danger:  { main: '#ff5252', bg: 'rgba(255,82,82,0.08)',  glow: 'rgba(255,82,82,0.3)' }
  };
  var sc = statusColors[status];

  var statusLabels = {
    safe:    '✅ AMAN — Tidak Buckling',
    warning: '⚠️ PERINGATAN — Di Bawah SF',
    danger:  '❌ KOLAPS / BUCKLING'
  };

  // Build UI
  container.innerHTML =
    '<div style="position:relative;background:#0b1120;border-radius:10px;overflow:hidden;border:1px solid ' + sc.glow + '">' +
      '<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(0,0,0,0.3);border-bottom:1px solid ' + sc.glow + '">' +
        '<button id="ca-play" title="Play/Pause" style="width:30px;height:30px;border-radius:50%;border:1px solid ' + sc.main + ';background:rgba(0,0,0,0.2);color:' + sc.main + ';cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0">▶</button>' +
        '<div style="flex:1;font-size:11px;font-weight:700;color:' + sc.main + ';font-family:\'Inter\',system-ui,sans-serif">' + statusLabels[status] + '</div>' +
        '<div style="font-size:10px;color:#8e9bb0;font-family:\'JetBrains Mono\',monospace">' +
          (mode === 'vacuum' ? 'MODE: VAKUM' : 'MODE: WELL CASING') +
        '</div>' +
      '</div>' +
      '<canvas id="ca-canvas" width="620" height="400"></canvas>' +
      '<div style="padding:10px 14px;background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.04);display:flex;gap:14px;flex-wrap:wrap;align-items:center">' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:' + sc.main + '"></div>' +
          '<span style="font-size:10px;color:#8e9bb0;font-family:\'JetBrains Mono\',monospace">P<sub>target</sub> = ' + params.targetPressure.toFixed(3) + ' bar</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:#00e5ff"></div>' +
          '<span style="font-size:10px;color:#8e9bb0;font-family:\'JetBrains Mono\',monospace">P<sub>c</sub> = ' + params.Pc_bar.toFixed(3) + ' bar</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:#7c4dff"></div>' +
          '<span style="font-size:10px;color:#8e9bb0;font-family:\'JetBrains Mono\',monospace">P<sub>a</sub> = ' + params.Pa_bar.toFixed(3) + ' bar</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="width:8px;height:8px;border-radius:2px;background:#4dd0e1"></div>' +
          '<span style="font-size:10px;color:#8e9bb0;font-family:\'JetBrains Mono\',monospace">SDR = ' + params.SDR.toFixed(1) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  var canvas = document.getElementById('ca-canvas');
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;

  // Scale canvas
  var cW = container.clientWidth - 4;
  var aspect = 400 / 620;
  var displayW = Math.min(cW, 920);
  var displayH = displayW * aspect;
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  canvas.style.width = displayW + 'px';
  canvas.style.height = displayH + 'px';
  ctx.scale(dpr, dpr);

  var W = displayW;
  var H = displayH;
  var s = W / 620; // scale factor

  // Geometry
  var CX = W * 0.5;
  var CY = H * 0.48;
  var pipeRadius = 100 * s;    // outer radius
  var wallThick = Math.max(5 * s, pipeRadius * (params.t / (params.OD / 2)));

  // State
  var state = {
    running: true,
    paused: true,
    animTime: 0,
    deformPhase: 0,       // 0 = intact, 1 = fully deformed
    particles: [],
    pressureArrows: [],
    rafId: null,
    lastTime: 0
  };
  collapseAnimState = state;

  // Deformation target based on status
  var deformTarget = status === 'safe' ? 0.0 : (status === 'warning' ? 0.35 : 0.85);

  // ====== DRAWING FUNCTIONS ======

  function drawBg() {
    var g = ctx.createRadialGradient(CX, CY, 0, CX, CY, W * 0.7);
    if (mode === 'vacuum') {
      g.addColorStop(0, '#0d1526');
      g.addColorStop(1, '#060a14');
    } else {
      g.addColorStop(0, '#0d1a26');
      g.addColorStop(1, '#050c14');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,229,255,0.018)';
    ctx.lineWidth = 0.5;
    for (var x = 0; x < W; x += 20 * s) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += 20 * s) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawWellCasingBg(t) {
    if (mode !== 'well') return;
    // Draw soil/ground layers
    var soilTop = 30 * s;
    // Soil gradient
    var sg = ctx.createLinearGradient(0, soilTop, 0, H);
    sg.addColorStop(0, 'rgba(60,40,20,0.15)');
    sg.addColorStop(0.5, 'rgba(40,30,15,0.1)');
    sg.addColorStop(1, 'rgba(20,15,10,0.08)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, soilTop, W, H - soilTop);

    // Soil layers
    ctx.strokeStyle = 'rgba(120,80,40,0.06)';
    ctx.lineWidth = 1;
    for (var ly = soilTop + 40 * s; ly < H; ly += 35 * s) {
      ctx.beginPath();
      ctx.moveTo(0, ly);
      for (var lx = 0; lx < W; lx += 10 * s) {
        ctx.lineTo(lx, ly + Math.sin(lx * 0.03 + t) * 2 * s);
      }
      ctx.stroke();
    }

    // Water table indicator
    var wtY = 45 * s;
    ctx.strokeStyle = 'rgba(0,176,255,0.12)';
    ctx.setLineDash([4 * s, 4 * s]);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(10 * s, wtY); ctx.lineTo(W - 10 * s, wtY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = 600 + ' ' + (8 * s) + 'px Inter,system-ui';
    ctx.fillStyle = 'rgba(0,176,255,0.35)';
    ctx.textAlign = 'left';
    ctx.fillText('▼ WATER TABLE', 14 * s, wtY - 5 * s);
  }

  // Draw the pipe cross-section with optional deformation
  function drawPipeCrossSection(deform, t) {
    var outerR = pipeRadius;
    var innerR = pipeRadius - wallThick;

    // Draw outer wall
    ctx.save();
    ctx.translate(CX, CY);

    // Deformation: use elliptical distortion
    // When deform > 0, the pipe becomes an oval (compressed vertically, wider horizontally)
    var scaleX = 1 + deform * 0.45;
    var scaleY = 1 - deform * 0.4;

    // Additional buckling wobble for danger state
    var buckleAmp = 0;
    if (status === 'danger' && deform > 0.5) {
      buckleAmp = (deform - 0.5) * 12 * s * Math.sin(t * 3);
    }

    // OUTER PIPE WALL
    ctx.beginPath();
    for (var a = 0; a <= Math.PI * 2 + 0.1; a += 0.02) {
      var r = outerR;
      // Add buckling lobes for danger
      if (status === 'danger' && deform > 0.3) {
        var lobeN = 2; // 2-lobe buckling mode
        r += (deform - 0.3) * 8 * s * Math.sin(lobeN * a + t * 1.5);
      }
      var px = r * Math.cos(a) * scaleX + Math.sin(a * 3 + t * 2) * buckleAmp * 0.3;
      var py = r * Math.sin(a) * scaleY + Math.cos(a * 2 + t * 1.5) * buckleAmp * 0.2;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Pipe wall gradient
    var pg = ctx.createRadialGradient(0, 0, innerR * 0.8, 0, 0, outerR * 1.1);
    if (status === 'danger') {
      pg.addColorStop(0, 'rgba(255,82,82,0.15)');
      pg.addColorStop(0.5, '#2a1a1a');
      pg.addColorStop(1, '#1a0f0f');
    } else if (status === 'warning') {
      pg.addColorStop(0, 'rgba(255,193,7,0.1)');
      pg.addColorStop(0.5, '#2a2214');
      pg.addColorStop(1, '#1a1608');
    } else {
      pg.addColorStop(0, 'rgba(0,229,255,0.08)');
      pg.addColorStop(0.5, '#1a2d3a');
      pg.addColorStop(1, '#0f1e2a');
    }
    ctx.fillStyle = pg;
    ctx.fill();

    // Outer stroke
    ctx.strokeStyle = sc.main;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7 + Math.sin(t * 2) * 0.15;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Glow effect
    ctx.shadowColor = sc.main;
    ctx.shadowBlur = 10 * s;
    ctx.strokeStyle = sc.glow;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // INNER PIPE WALL (hole)
    ctx.beginPath();
    for (var a2 = 0; a2 <= Math.PI * 2 + 0.1; a2 += 0.02) {
      var r2 = innerR;
      if (status === 'danger' && deform > 0.3) {
        r2 += (deform - 0.3) * 6 * s * Math.sin(2 * a2 + t * 1.5);
      }
      var px2 = r2 * Math.cos(a2) * scaleX + Math.sin(a2 * 3 + t * 2) * buckleAmp * 0.25;
      var py2 = r2 * Math.sin(a2) * scaleY + Math.cos(a2 * 2 + t * 1.5) * buckleAmp * 0.15;
      if (a2 === 0) ctx.moveTo(px2, py2);
      else ctx.lineTo(px2, py2);
    }
    ctx.closePath();

    // Inner void
    var ig = ctx.createRadialGradient(0, 0, 0, 0, 0, innerR);
    ig.addColorStop(0, '#060a14');
    ig.addColorStop(1, '#0a1020');
    ctx.fillStyle = ig;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Dimension lines for wall thickness
    if (deform < 0.3) {
      var dimAngle = Math.PI * 0.25;
      var ox = outerR * Math.cos(dimAngle) * scaleX;
      var oy = outerR * Math.sin(dimAngle) * scaleY;
      var ix = innerR * Math.cos(dimAngle) * scaleX;
      var iy = innerR * Math.sin(dimAngle) * scaleY;

      ctx.strokeStyle = 'rgba(0,229,255,0.3)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2 * s, 2 * s]);
      ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ox + 20 * s, oy + 20 * s); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 600 + ' ' + (8 * s) + 'px JetBrains Mono,monospace';
      ctx.fillStyle = '#4dd0e1';
      ctx.textAlign = 'left';
      ctx.fillText('t = ' + params.t + ' mm', ox + 24 * s, oy + 22 * s);
    }

    // OD dimension
    if (deform < 0.5) {
      ctx.strokeStyle = 'rgba(0,229,255,0.15)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3 * s, 3 * s]);
      var odYoff = outerR * scaleY + 25 * s;
      ctx.beginPath();
      ctx.moveTo(-outerR * scaleX, odYoff);
      ctx.lineTo(outerR * scaleX, odYoff);
      ctx.stroke();
      // End ticks
      ctx.beginPath();
      ctx.moveTo(-outerR * scaleX, odYoff - 4 * s);
      ctx.lineTo(-outerR * scaleX, odYoff + 4 * s);
      ctx.moveTo(outerR * scaleX, odYoff - 4 * s);
      ctx.lineTo(outerR * scaleX, odYoff + 4 * s);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 600 + ' ' + (8 * s) + 'px JetBrains Mono,monospace';
      ctx.fillStyle = '#4dd0e1';
      ctx.textAlign = 'center';
      ctx.fillText('OD = ' + params.OD + ' mm', 0, odYoff + 14 * s);
    }

    ctx.restore();
  }

  // Draw pressure arrows pointing inward around the pipe
  function drawPressureArrows(t, deform) {
    var nArrows = 12;
    var arrowDist = pipeRadius + 45 * s;
    var arrowLen = 18 * s + deform * 12 * s;

    for (var i = 0; i < nArrows; i++) {
      var angle = (i / nArrows) * Math.PI * 2 + t * 0.3;
      var pulse = 0.7 + Math.sin(t * 3 + i * 1.2) * 0.3;

      var ax = CX + Math.cos(angle) * arrowDist;
      var ay = CY + Math.sin(angle) * arrowDist;
      var dx = -Math.cos(angle);
      var dy = -Math.sin(angle);

      // Arrow shaft
      ctx.strokeStyle = sc.main;
      ctx.globalAlpha = 0.25 * pulse + deform * 0.25;
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + dx * arrowLen, ay + dy * arrowLen);
      ctx.stroke();

      // Arrow head
      var hx = ax + dx * arrowLen;
      var hy = ay + dy * arrowLen;
      var headSize = 5 * s;
      var perpX = -dy;
      var perpY = dx;
      ctx.fillStyle = sc.main;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - dx * headSize + perpX * headSize * 0.5, hy - dy * headSize + perpY * headSize * 0.5);
      ctx.lineTo(hx - dx * headSize - perpX * headSize * 0.5, hy - dy * headSize - perpY * headSize * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
    }

    // Label: "P ext" at top
    ctx.font = 700 + ' ' + (10 * s) + 'px Inter,system-ui';
    ctx.fillStyle = sc.main;
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.6 + Math.sin(t * 2) * 0.2;
    if (mode === 'vacuum') {
      ctx.fillText('P atm (tekanan luar)', CX, CY - pipeRadius - 65 * s);
    } else {
      ctx.fillText('P hidrostatik (tekanan tanah/air)', CX, CY - pipeRadius - 65 * s);
    }
    ctx.globalAlpha = 1;
  }

  // Draw floating particles (pressure visualization)
  function updatePressureParticles(t) {
    // Generate particles moving inward
    var maxParts = status === 'danger' ? 60 : (status === 'warning' ? 35 : 15);
    var spawnRate = status === 'danger' ? 0.4 : (status === 'warning' ? 0.2 : 0.08);

    if (Math.random() < spawnRate && state.particles.length < maxParts) {
      var ang = Math.random() * Math.PI * 2;
      var dist = pipeRadius + 50 * s + Math.random() * 80 * s;
      state.particles.push({
        x: CX + Math.cos(ang) * dist,
        y: CY + Math.sin(ang) * dist,
        ang: ang,
        speed: (0.3 + Math.random() * 0.6) * s,
        size: (1 + Math.random() * 2.5) * s,
        alpha: 0.3 + Math.random() * 0.5,
        life: 1
      });
    }

    for (var i = state.particles.length - 1; i >= 0; i--) {
      var p = state.particles[i];
      // Move inward
      p.x -= Math.cos(p.ang) * p.speed;
      p.y -= Math.sin(p.ang) * p.speed;

      // Check if reached pipe wall
      var dx = p.x - CX;
      var dy = p.y - CY;
      var dist2 = Math.sqrt(dx * dx + dy * dy);
      if (dist2 < pipeRadius + 5 * s) {
        // Splash effect
        if (status !== 'safe') {
          ctx.fillStyle = sc.glow;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        state.particles.splice(i, 1);
        continue;
      }

      p.life -= 0.003;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }

      // Draw
      var clr = mode === 'vacuum' ? '129,212,250' : '100,180,120';
      ctx.fillStyle = 'rgba(' + clr + ',' + (p.alpha * p.life * 0.15) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + 3 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(' + clr + ',' + (p.alpha * p.life) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw stress concentration zones for danger/warning
  function drawStressZones(t, deform) {
    if (deform < 0.15) return;

    var intensity = (deform - 0.15) / 0.85;
    // Stress at top and bottom of pipe (compression zones)
    var zones = [
      { angle: Math.PI / 2, label: 'KOMPRES' },
      { angle: -Math.PI / 2, label: 'KOMPRES' },
      { angle: 0, label: 'TARIK' },
      { angle: Math.PI, label: 'TARIK' }
    ];

    ctx.save();
    ctx.translate(CX, CY);

    for (var zi = 0; zi < zones.length; zi++) {
      var z = zones[zi];
      var zr = pipeRadius - wallThick / 2;
      var zx = Math.cos(z.angle) * zr * (1 + (z.angle === 0 || z.angle === Math.PI ? deform * 0.45 : 0));
      var zy = Math.sin(z.angle) * zr * (1 - (z.angle === Math.PI / 2 || z.angle === -Math.PI / 2 ? deform * 0.4 : 0));

      var stressColor = zi < 2 ? 'rgba(255,82,82,' : 'rgba(255,171,0,';

      // Pulsing stress hotspot
      var pulseR = (8 + Math.sin(t * 4 + zi) * 3) * s * intensity;
      ctx.fillStyle = stressColor + (0.15 * intensity + Math.sin(t * 3 + zi * 1.5) * 0.05) + ')';
      ctx.beginPath();
      ctx.arc(zx, zy, pulseR * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = stressColor + (0.35 * intensity) + ')';
      ctx.beginPath();
      ctx.arc(zx, zy, pulseR, 0, Math.PI * 2);
      ctx.fill();

      // Label
      if (intensity > 0.3) {
        ctx.font = 600 + ' ' + (7 * s) + 'px Inter,system-ui';
        ctx.fillStyle = stressColor + (0.6 * intensity) + ')';
        ctx.textAlign = 'center';
        ctx.fillText(z.label, zx, zy - pulseR - 4 * s);
      }
    }

    ctx.restore();
  }

  // Draw crack lines for danger state
  function drawCracks(t, deform) {
    if (status !== 'danger' || deform < 0.6) return;

    var crackIntensity = (deform - 0.6) / 0.4;
    ctx.save();
    ctx.translate(CX, CY);

    var crackAngles = [Math.PI / 2 + 0.15, -Math.PI / 2 - 0.1, Math.PI / 2 - 0.2, -Math.PI / 2 + 0.25];
    for (var ci = 0; ci < crackAngles.length; ci++) {
      var ca = crackAngles[ci];
      var scaleXc = 1 + deform * 0.45;
      var scaleYc = 1 - deform * 0.4;
      var crX = Math.cos(ca) * pipeRadius * (ca === Math.PI / 2 || ca === -Math.PI / 2 ? scaleXc : 1);
      var crY = Math.sin(ca) * pipeRadius * scaleYc;

      ctx.strokeStyle = 'rgba(255,82,82,' + (0.4 * crackIntensity + Math.sin(t * 5 + ci) * 0.15) + ')';
      ctx.lineWidth = 1 + crackIntensity;
      ctx.beginPath();
      ctx.moveTo(crX - 6 * s * crackIntensity, crY - 4 * s * crackIntensity);
      ctx.lineTo(crX, crY);
      ctx.lineTo(crX + 4 * s * crackIntensity, crY + 7 * s * crackIntensity);
      ctx.lineTo(crX + 2 * s, crY + 10 * s * crackIntensity);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw info labels
  function drawLabels(t, deform) {
    // Title
    ctx.font = 800 + ' ' + (12 * s) + 'px Inter,system-ui';
    ctx.textAlign = 'center';

    if (status === 'danger') {
      ctx.fillStyle = '#ff5252';
      ctx.globalAlpha = 0.7 + Math.sin(t * 4) * 0.3;
      ctx.fillText('⚠ PIPE COLLAPSE / BUCKLING', CX, 22 * s);
      ctx.globalAlpha = 1;
    } else if (status === 'warning') {
      ctx.fillStyle = '#ffc107';
      ctx.fillText('DEFORMASI DI BAWAH SAFETY FACTOR', CX, 22 * s);
    } else {
      ctx.fillStyle = '#00e676';
      ctx.fillText('PIPA STABIL — TEKANAN AMAN', CX, 22 * s);
    }

    // Pressure gauge visualization at bottom-left
    var gaugeX = 55 * s;
    var gaugeY = H - 55 * s;
    var gaugeR = 30 * s;

    // Gauge circle
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Gauge sectors: green, yellow, red
    var sectors = [
      { start: 0.75, end: 1.25, color: 'rgba(0,230,118,0.3)' },
      { start: 1.25, end: 1.75, color: 'rgba(255,193,7,0.3)' },
      { start: 1.75, end: 2.25, color: 'rgba(255,82,82,0.3)' }
    ];
    for (var si = 0; si < sectors.length; si++) {
      var sec = sectors[si];
      ctx.strokeStyle = sec.color;
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR - 3 * s, Math.PI * sec.start, Math.PI * sec.end);
      ctx.stroke();
    }

    // Gauge needle
    var ratio = params.targetPressure / params.Pc_bar;
    if (ratio > 1) ratio = 1;
    var needleAngle = Math.PI * 0.75 + ratio * Math.PI * 1.5;
    needleAngle += Math.sin(t * 2) * 0.02; // slight tremor
    ctx.strokeStyle = sc.main;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gaugeX, gaugeY);
    ctx.lineTo(gaugeX + Math.cos(needleAngle) * (gaugeR - 6 * s), gaugeY + Math.sin(needleAngle) * (gaugeR - 6 * s));
    ctx.stroke();

    // Gauge center dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 600 + ' ' + (7 * s) + 'px Inter,system-ui';
    ctx.fillStyle = '#8e9bb0';
    ctx.textAlign = 'center';
    ctx.fillText('P / Pc', gaugeX, gaugeY + gaugeR + 12 * s);
    ctx.fillStyle = sc.main;
    ctx.fillText((ratio * 100).toFixed(0) + '%', gaugeX, gaugeY + 12 * s);

    // Deformation percentage at bottom-right
    if (deform > 0.01) {
      var defPercent = (deform * 100).toFixed(1);
      ctx.font = 700 + ' ' + (11 * s) + 'px JetBrains Mono,monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = sc.main;
      ctx.globalAlpha = 0.5 + Math.sin(t * 2) * 0.2;
      ctx.fillText('Deformasi: ' + defPercent + '%', W - 20 * s, H - 35 * s);
      ctx.globalAlpha = 1;
    }

    // Mode-specific labels
    if (mode === 'vacuum') {
      ctx.font = 600 + ' ' + (8 * s) + 'px Inter,system-ui';
      ctx.fillStyle = 'rgba(129,212,250,0.35)';
      ctx.textAlign = 'right';
      ctx.fillText('Tekanan vakum internal', W - 20 * s, 22 * s);
      ctx.fillText('menyebabkan tekanan nett ke dalam', W - 20 * s, 34 * s);
    } else {
      ctx.font = 600 + ' ' + (8 * s) + 'px Inter,system-ui';
      ctx.fillStyle = 'rgba(100,180,120,0.35)';
      ctx.textAlign = 'right';
      ctx.fillText('Tekanan hidrostatik tanah', W - 20 * s, 22 * s);
      ctx.fillText('& air pada kedalaman sumur', W - 20 * s, 34 * s);
    }

    // Cross-section label
    ctx.font = 600 + ' ' + (9 * s) + 'px Inter,system-ui';
    ctx.fillStyle = 'rgba(0,229,255,0.3)';
    ctx.textAlign = 'left';
    ctx.fillText('TAMPAK PENAMPANG', 14 * s, H - 14 * s);
    ctx.fillText('(CROSS-SECTION)', 14 * s, H - 3 * s);
  }

  // Draw vacuum/pressure wave effect
  function drawPressureWaves(t) {
    var nWaves = 3;
    for (var w = 0; w < nWaves; w++) {
      var phase = (t * 0.5 + w * 0.33) % 1;
      var waveR = pipeRadius + 60 * s + phase * 100 * s;
      var waveAlpha = (1 - phase) * 0.08;

      ctx.strokeStyle = 'rgba(' + (mode === 'vacuum' ? '0,229,255' : '100,200,120') + ',' + waveAlpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, waveR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Controls
  document.getElementById('ca-play').addEventListener('click', function() {
    state.paused = !state.paused;
    this.textContent = state.paused ? '▶' : '⏸';
  });

  // Animation loop
  function frame(ts) {
    if (!state.running) return;
    if (!state.lastTime) state.lastTime = ts;
    var dt = (ts - state.lastTime) / 1000;
    state.lastTime = ts;

    if (!state.paused) {
      state.animTime += dt;

      // Smoothly approach deformation target
      var speed = 0.3;
      state.deformPhase += (deformTarget - state.deformPhase) * speed * dt * 2;
      if (Math.abs(state.deformPhase - deformTarget) < 0.001) {
        state.deformPhase = deformTarget;
      }
    }

    var tVal = state.animTime;
    var def = state.deformPhase;

    ctx.clearRect(0, 0, W, H);
    drawBg();
    drawWellCasingBg(tVal);
    drawPressureWaves(tVal);

    if (!state.paused) {
      updatePressureParticles(tVal);
    } else {
      // Still draw existing particles
      for (var pi = 0; pi < state.particles.length; pi++) {
        var pp = state.particles[pi];
        var clr2 = mode === 'vacuum' ? '129,212,250' : '100,180,120';
        ctx.fillStyle = 'rgba(' + clr2 + ',' + (pp.alpha * pp.life) + ')';
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, pp.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawPressureArrows(tVal, def);
    drawPipeCrossSection(def, tVal);
    drawStressZones(tVal, def);
    drawCracks(tVal, def);
    drawLabels(tVal, def);

    state.rafId = requestAnimationFrame(frame);
  }

  state.rafId = requestAnimationFrame(frame);

  // Auto-play after short delay
  setTimeout(function() {
    state.paused = false;
    var playBtn = document.getElementById('ca-play');
    if (playBtn) playBtn.textContent = '⏸';
  }, 300);
}

function destroyCollapseAnim() {
  if (collapseAnimState) {
    collapseAnimState.running = false;
    if (collapseAnimState.rafId) cancelAnimationFrame(collapseAnimState.rafId);
    collapseAnimState = null;
  }
}
