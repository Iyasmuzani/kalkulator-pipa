// ==================== ANIMASI CARA KERJA SIPHONIC SYSTEM ====================
// Embedded animation engine for siphonic system visualization tab

let siphonicAnimState = null;

function initSiphonicAnim(container) {
  // Cleanup previous
  if (siphonicAnimState) {
    siphonicAnimState.running = false;
    if (siphonicAnimState.rafId) cancelAnimationFrame(siphonicAnimState.rafId);
  }

  // Build UI
  container.innerHTML = `
    <div style="position:relative;background:#0b1120;border-radius:10px;overflow:hidden;">
      <!-- Phase controls -->
      <div style="display:flex;align-items:center;gap:6px;padding:10px 12px;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(0,229,255,0.1);flex-wrap:wrap;">
        <button class="sa-play" id="sa-play" title="Play/Pause" style="width:30px;height:30px;border-radius:50%;border:1px solid #00e5ff;background:rgba(0,229,255,0.1);color:#00e5ff;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">▶</button>
        <button class="sa-phase active" data-p="0" style="flex-shrink:0;">❶ Hujan</button>
        <button class="sa-phase" data-p="1" style="flex-shrink:0;">❷ Priming</button>
        <button class="sa-phase" data-p="2" style="flex-shrink:0;">❸ Full Siphonic</button>
        <button class="sa-phase" data-p="3" style="flex-shrink:0;">❹ Self-Cleaning</button>
        <button class="sa-auto" id="sa-auto" title="Auto-play" style="margin-left:auto;flex-shrink:0;">⟳ Auto</button>
      </div>
      <canvas id="sa-canvas" width="620" height="440"></canvas>
      <!-- Info bar -->
      <div id="sa-info" style="padding:10px 14px;background:rgba(0,0,0,0.3);border-top:1px solid rgba(0,229,255,0.08);display:flex;gap:12px;align-items:flex-start;min-height:52px;">
        <span id="sa-icon" style="font-size:22px;flex-shrink:0;">🌧️</span>
        <div>
          <div id="sa-title" style="font-size:12px;font-weight:700;color:#00e5ff;margin-bottom:2px;">Fase 1: Hujan & Pengumpulan Air</div>
          <div id="sa-desc" style="font-size:11px;color:#8e9bb0;line-height:1.5;">Air hujan jatuh ke atap dan mengalir menuju roof outlet siphonic. Anti-vortex plate mencegah udara masuk ke sistem.</div>
        </div>
      </div>
    </div>
    <style>
      .sa-phase{padding:5px 10px;border-radius:8px;border:1px solid rgba(0,229,255,0.15);background:rgba(0,229,255,0.04);color:#8e9bb0;font-family:'Inter',system-ui,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;}
      .sa-phase:hover{border-color:rgba(0,229,255,0.3);color:#e2e8f0;}
      .sa-phase.active{border-color:#00e5ff;color:#00e5ff;background:rgba(0,229,255,0.1);box-shadow:0 0 12px rgba(0,229,255,0.15);}
      .sa-auto{padding:5px 10px;border-radius:8px;border:1px solid rgba(0,230,118,0.2);background:rgba(0,230,118,0.05);color:#8e9bb0;font-family:'Inter',system-ui,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;}
      .sa-auto:hover{border-color:rgba(0,230,118,0.4);color:#00e676;}
      .sa-auto.on{border-color:#00e676;color:#00e676;background:rgba(0,230,118,0.12);}
    </style>`;

  const canvas = document.getElementById('sa-canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Scale canvas
  const cW = container.clientWidth - 2; // border
  const aspect = 440 / 620;
  const displayW = Math.min(cW, 920);
  const displayH = displayW * aspect;
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  canvas.style.width = displayW + 'px';
  canvas.style.height = displayH + 'px';
  ctx.scale(dpr, dpr);

  const W = displayW;
  const H = displayH;

  // Geometry (proportional)
  const s = W / 620; // scale factor
  const ROOF_Y = 68 * s;
  const ROOF_LEFT = 50 * s;
  const ROOF_RIGHT = 570 * s;
  const ROOF_THICK = 14 * s;
  const BLDG_LEFT = 70 * s;
  const BLDG_RIGHT = 550 * s;
  const OUTLET_1X = 180 * s;
  const OUTLET_2X = 390 * s;
  const OUTLET_W = 24 * s;
  const TAIL_TOP = ROOF_Y + ROOF_THICK;
  const TAIL_BOT = ROOF_Y + ROOF_THICK + 52 * s;
  const PIPE_R = 9 * s;
  const COLLECT_Y = TAIL_BOT;
  const COLLECT_L = 140 * s;
  const COLLECT_R = 470 * s;
  const DOWN_X = 470 * s;
  const DOWN_TOP = COLLECT_Y;
  const DOWN_BOT = 340 * s;
  const DISCH_Y = DOWN_BOT;
  const DISCH_R = 560 * s;
  const GROUND_Y = 360 * s;

  // State
  const state = {
    running: true,
    phase: 0,
    animTime: 0,
    paused: true,
    autoPlay: false,
    autoTimer: 0,
    particles: [],
    rain: [],
    bubbles: [],
    rafId: null,
    lastTime: 0
  };
  siphonicAnimState = state;

  const phaseInfo = [
    { icon:'🌧️', title:'Fase 1: Hujan & Pengumpulan Air', desc:'Air hujan jatuh ke atap dan mengalir menuju roof outlet siphonic. Anti-vortex plate mencegah udara masuk ke sistem perpipaan.' },
    { icon:'🔄', title:'Fase 2: Priming — Pembentukan Siphon', desc:'Air mengisi penuh pipa (full-bore). Udara terdesak keluar. Tekanan negatif mulai terbentuk di collecting pipe horizontal.' },
    { icon:'⚡', title:'Fase 3: Full Siphonic Flow', desc:'Efek siphonic aktif! Air mengalir v = 2–6 m/s melalui pipa 100% terisi. Tekanan negatif menarik air dari outlet tanpa kemiringan.' },
    { icon:'🧹', title:'Fase 4: Self-Cleaning', desc:'Hujan mereda. Kecepatan tinggi terakhir membersihkan debris (self-cleaning). Sistem kembali kosong, siap hujan berikutnya.' }
  ];

  // Helpers
  function mkRain() {
    return { x: ROOF_LEFT + Math.random() * (ROOF_RIGHT - ROOF_LEFT), y: -5 - Math.random() * 30, vy: (2.5 + Math.random() * 2.5) * s, vx: (-0.4 + Math.random() * 0.15) * s, sz: (0.8 + Math.random() * 1.5) * s, a: 0.25 + Math.random() * 0.45 };
  }
  function mkPart(x, y, seg) {
    return { x, y, seg, spd: (0.25 + Math.random() * 0.35) * s, sz: (2.5 + Math.random() * 2.5) * s, a: 0.5 + Math.random() * 0.4, hue: 190 + Math.random() * 20 };
  }
  function mkBubble(x, y) {
    return { x: x + (Math.random()-0.5)*8*s, y, vy: (-0.4 - Math.random()*1.2)*s, sz: (1.5+Math.random()*3)*s, a: 0.4+Math.random()*0.3, life:1 };
  }

  // Drawing
  function drawBg() {
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#060a14'); g.addColorStop(1,'#0d1526');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(0,229,255,0.025)'; ctx.lineWidth = 0.5;
    for(let x=0;x<W;x+=20*s){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=20*s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  function drawBuilding() {
    ctx.fillStyle='#111b2c'; ctx.strokeStyle='rgba(0,229,255,0.05)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.rect(BLDG_LEFT,ROOF_Y,BLDG_RIGHT-BLDG_LEFT,GROUND_Y-ROOF_Y); ctx.fill(); ctx.stroke();
    // Windows
    ctx.fillStyle='rgba(0,229,255,0.03)';
    for(let r=0;r<4;r++) for(let c=0;c<7;c++){
      const wx=BLDG_LEFT+22*s+c*65*s, wy=ROOF_Y+55*s+r*55*s;
      if(Math.abs(wx-DOWN_X)<25*s) continue;
      ctx.fillRect(wx,wy,22*s,14*s);
    }
    // Roof
    const rg=ctx.createLinearGradient(0,ROOF_Y-6*s,0,ROOF_Y+ROOF_THICK);
    rg.addColorStop(0,'#546e7a'); rg.addColorStop(1,'#37474f');
    ctx.fillStyle=rg;
    ctx.beginPath();
    ctx.moveTo(ROOF_LEFT-10*s,ROOF_Y); ctx.lineTo(ROOF_RIGHT+10*s,ROOF_Y);
    ctx.lineTo(ROOF_RIGHT+4*s,ROOF_Y+ROOF_THICK); ctx.lineTo(ROOF_LEFT-4*s,ROOF_Y+ROOF_THICK);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#607d8b'; ctx.lineWidth=1; ctx.stroke();
    // Ground
    const gg=ctx.createLinearGradient(0,GROUND_Y-3,0,H);
    gg.addColorStop(0,'#1a2e1a'); gg.addColorStop(1,'#0f1a0f');
    ctx.fillStyle=gg; ctx.fillRect(0,GROUND_Y,W,H-GROUND_Y);
    ctx.strokeStyle='rgba(0,230,118,0.08)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,GROUND_Y); ctx.lineTo(W,GROUND_Y); ctx.stroke();
  }

  function drawPipe(x1,y1,x2,y2,r,fill) {
    const horiz=Math.abs(y2-y1)<Math.abs(x2-x1);
    ctx.fillStyle='#1e2d3a'; ctx.strokeStyle='#37474f'; ctx.lineWidth=1.5;
    if(horiz){
      ctx.beginPath(); ctx.rect(Math.min(x1,x2),y1-r,Math.abs(x2-x1),r*2); ctx.fill(); ctx.stroke();
      if(fill>0){
        const wg=ctx.createLinearGradient(x1,y1-r,x1,y1+r);
        wg.addColorStop(0,`rgba(0,176,255,${0.12*fill})`);
        wg.addColorStop(0.5,`rgba(0,176,255,${0.45*fill})`);
        wg.addColorStop(1,`rgba(0,119,182,${0.55*fill})`);
        ctx.fillStyle=wg;
        const fh=r*2*fill;
        ctx.fillRect(Math.min(x1,x2)+1.5,y1+r-fh,Math.abs(x2-x1)-3,fh-1.5);
      }
    } else {
      ctx.beginPath(); ctx.rect(x1-r,Math.min(y1,y2),r*2,Math.abs(y2-y1)); ctx.fill(); ctx.stroke();
      if(fill>0){
        const wg=ctx.createLinearGradient(x1-r,0,x1+r,0);
        wg.addColorStop(0,`rgba(0,119,182,${0.45*fill})`);
        wg.addColorStop(0.5,`rgba(0,176,255,${0.55*fill})`);
        wg.addColorStop(1,`rgba(0,119,182,${0.45*fill})`);
        ctx.fillStyle=wg;
        ctx.fillRect(x1-r+1.5,Math.min(y1,y2)+1.5,r*2-3,Math.abs(y2-y1)-3);
      }
    }
  }

  function drawOutlet(x,y) {
    ctx.fillStyle='#1a2d3a'; ctx.strokeStyle='#00e5ff'; ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.roundRect?ctx.roundRect(x-OUTLET_W/2,y-4*s,OUTLET_W,10*s,2*s):ctx.rect(x-OUTLET_W/2,y-4*s,OUTLET_W,10*s);
    ctx.fill(); ctx.stroke();
    // Anti-vortex fins
    ctx.strokeStyle='#00e676'; ctx.lineWidth=1.2;
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x+i*3.5*s,y-3*s);ctx.lineTo(x+i*3.5*s,y+4*s);ctx.stroke();}
    // Dome
    ctx.beginPath(); ctx.arc(x,y-4*s,6*s,Math.PI,0);
    ctx.strokeStyle='rgba(0,230,118,0.5)'; ctx.lineWidth=1.2; ctx.stroke();
  }

  function drawTransition(x,y) {
    ctx.fillStyle='#ff8a65'; ctx.strokeStyle='#ff7043'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x-6*s,y-14*s); ctx.lineTo(x+6*s,y-14*s);
    ctx.lineTo(x+10*s,y+6*s); ctx.lineTo(x-10*s,y+6*s);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  function drawPipes(fill) {
    drawPipe(OUTLET_1X,TAIL_TOP,OUTLET_1X,TAIL_BOT,PIPE_R,fill);
    drawPipe(OUTLET_2X,TAIL_TOP,OUTLET_2X,TAIL_BOT,PIPE_R,fill);
    drawPipe(COLLECT_L,COLLECT_Y,COLLECT_R,COLLECT_Y,PIPE_R,fill);
    drawPipe(DOWN_X,DOWN_TOP,DOWN_X,DOWN_BOT,PIPE_R,fill);
    drawPipe(DOWN_X,DISCH_Y,DISCH_R,DISCH_Y,PIPE_R,fill*0.7);
  }

  function drawLabels(phase,t) {
    ctx.font=`600 ${8*s}px Inter,system-ui`; ctx.textAlign='center';
    const lbl=[
      {t:'ROOF OUTLET',x:OUTLET_1X,y:ROOF_Y-14*s,c:'#00e676'},
      {t:'ROOF OUTLET',x:OUTLET_2X,y:ROOF_Y-14*s,c:'#00e676'},
      {t:'TAIL PIPE',x:OUTLET_1X-36*s,y:(TAIL_TOP+TAIL_BOT)/2,c:'#4dd0e1'},
      {t:'COLLECTING PIPE (TANPA SLOPE)',x:(COLLECT_L+COLLECT_R)/2,y:COLLECT_Y+22*s,c:'#00b0ff'},
      {t:'DOWNPIPE',x:DOWN_X+34*s,y:(DOWN_TOP+DOWN_BOT)/2,c:'#0288d1'},
      {t:'TRANSITION',x:DOWN_X,y:DOWN_BOT+22*s,c:'#ff8a65'},
      {t:'DISCHARGE →',x:DISCH_R-30*s,y:DISCH_Y-14*s,c:'#2e7d32'},
    ];
    lbl.forEach(l=>{ctx.fillStyle=l.c;ctx.fillText(l.t,l.x,l.y);});

    // Phase-specific
    if(phase>=1){
      ctx.strokeStyle='rgba(0,229,255,0.35)'; ctx.lineWidth=1;
      const n=phase>=2?7:3;
      for(let i=0;i<n;i++){
        const ax=COLLECT_L+25*s+i*((COLLECT_R-COLLECT_L-50*s)/n);
        const off=Math.sin(t*3+i)*2*s;
        ctx.beginPath();ctx.moveTo(ax+7*s,COLLECT_Y+off);ctx.lineTo(ax,COLLECT_Y+off);
        ctx.lineTo(ax+3*s,COLLECT_Y-3*s+off);ctx.stroke();
      }
    }
    if(phase>=2){
      ctx.font=`700 ${10*s}px Inter,system-ui`; ctx.fillStyle='#00e5ff';
      // Velocity oscillates 2.0 – 6.0 m/s
      const v=(4.0+Math.sin(t*2)*2.0).toFixed(1);
      ctx.fillText('v = '+v+' m/s',DOWN_X+42*s,(DOWN_TOP+DOWN_BOT)/2+16*s);
      ctx.font=`600 ${7.5*s}px Inter,system-ui`; ctx.fillStyle='rgba(0,229,255,0.6)';
      ctx.fillText('ΔP < 0 (vakum)',(COLLECT_L+COLLECT_R)/2,COLLECT_Y-16*s);
      // Vacuum glow
      ctx.fillStyle=`rgba(0,229,255,${0.025+Math.sin(t*4)*0.015})`;
      ctx.fillRect(COLLECT_L,COLLECT_Y-PIPE_R-5*s,COLLECT_R-COLLECT_L,PIPE_R*2+10*s);
    }
    if(phase===2){
      ctx.font=`800 ${11*s}px Inter,system-ui`; ctx.fillStyle='#00e5ff';
      ctx.fillText('⚡ FULL SIPHONIC ACTIVE',W/2,35*s);
      // Hydraulic head
      ctx.strokeStyle='rgba(255,171,0,0.4)'; ctx.setLineDash([3*s,3*s]); ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(DOWN_X+55*s,DOWN_TOP);ctx.lineTo(DOWN_X+55*s,DOWN_BOT);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#ffab00'; ctx.font=`600 ${8*s}px Inter`;
      ctx.fillText('H',DOWN_X+62*s,(DOWN_TOP+DOWN_BOT)/2);
      ctx.font=`500 ${6.5*s}px Inter`; ctx.fillStyle='rgba(255,171,0,0.5)';
      ctx.fillText('Hydraulic Head',DOWN_X+65*s,(DOWN_TOP+DOWN_BOT)/2+12*s);
    }
    if(phase===3){
      ctx.font=`800 ${11*s}px Inter,system-ui`; ctx.fillStyle='#00e676';
      ctx.fillText('🧹 SELF-CLEANING',W/2,35*s);
    }
  }

  function drawRain(intensity) {
    const cnt=Math.floor(intensity*3);
    for(let i=0;i<cnt;i++) state.rain.push(mkRain());
    ctx.strokeStyle='rgba(129,212,250,0.25)'; ctx.lineWidth=0.8;
    for(let i=state.rain.length-1;i>=0;i--){
      const d=state.rain[i]; d.y+=d.vy; d.x+=d.vx;
      if(d.y>ROOF_Y-1){
        if(Math.random()<0.2){ctx.fillStyle=`rgba(129,212,250,${d.a*0.4})`;ctx.beginPath();ctx.arc(d.x,ROOF_Y-1,2*s,0,Math.PI*2);ctx.fill();}
        state.rain.splice(i,1); continue;
      }
      ctx.globalAlpha=d.a; ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+d.vx*2,d.y+d.vy*1.5);ctx.stroke();
    }
    ctx.globalAlpha=1;
    if(intensity>0.3){ctx.fillStyle=`rgba(0,176,255,${0.04*intensity})`;ctx.fillRect(ROOF_LEFT,ROOF_Y-1.5,ROOF_RIGHT-ROOF_LEFT,2.5);}
  }

  function updateParticles(phase) {
    const cfg=[
      {rate:0.12,max:30,sm:0.5},
      {rate:0.35,max:60,sm:0.9},
      {rate:0.7,max:120,sm:2.0},
      {rate:0.25,max:40,sm:1.3}
    ][phase];
    if(Math.random()<cfg.rate && state.particles.length<cfg.max){
      state.particles.push(mkPart(OUTLET_1X,TAIL_TOP+3*s,'t1'));
      if(Math.random()<0.75) state.particles.push(mkPart(OUTLET_2X,TAIL_TOP+3*s,'t2'));
    }
    for(let i=state.particles.length-1;i>=0;i--){
      const p=state.particles[i]; const sp=p.spd*cfg.sm;
      switch(p.seg){
        case 't1': p.y+=sp*2; if(p.y>=TAIL_BOT){p.seg='cr';p.x=OUTLET_1X;p.y=COLLECT_Y;} break;
        case 't2': p.y+=sp*2; if(p.y>=TAIL_BOT){p.seg='cl';p.x=OUTLET_2X;p.y=COLLECT_Y;} break;
        case 'cr': p.x+=sp*2.2; if(p.x>=DOWN_X){p.seg='dw';p.x=DOWN_X;p.y=DOWN_TOP;} break;
        case 'cl': p.x+=sp*2.2; if(p.x>=DOWN_X){p.seg='dw';p.x=DOWN_X;p.y=DOWN_TOP;} break;
        case 'dw': p.y+=sp*2.8; if(p.y>=DOWN_BOT){p.seg='dc';p.y=DISCH_Y;} break;
        case 'dc': p.x+=sp*2; if(p.x>=DISCH_R+15*s){state.particles.splice(i,1);continue;} break;
      }
      const gw=phase>=2?6*s:3*s;
      ctx.fillStyle=`rgba(0,176,255,${p.a*0.12})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.sz+gw,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`hsla(${p.hue},80%,60%,${p.a})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(255,255,255,${p.a*0.35})`;
      ctx.beginPath();ctx.arc(p.x-0.8*s,p.y-0.8*s,p.sz*0.35,0,Math.PI*2);ctx.fill();
    }
  }

  function drawBubbles(phase,t) {
    if(phase!==1){state.bubbles=[];return;}
    if(Math.random()<0.12) state.bubbles.push(mkBubble(COLLECT_L+30*s+Math.random()*(COLLECT_R-COLLECT_L-60*s),COLLECT_Y+4*s));
    for(let i=state.bubbles.length-1;i>=0;i--){
      const b=state.bubbles[i]; b.y+=b.vy; b.life-=0.007; b.x+=Math.sin(t*8+i)*0.25*s;
      if(b.life<=0||b.y<COLLECT_Y-22*s){state.bubbles.splice(i,1);continue;}
      ctx.strokeStyle=`rgba(255,255,255,${b.a*b.life*0.45})`;ctx.lineWidth=0.7;
      ctx.beginPath();ctx.arc(b.x,b.y,b.sz*b.life,0,Math.PI*2);ctx.stroke();
    }
  }

  function drawVacuum(phase,t) {
    if(phase<2) return;
    const vi=phase===2?1:0.25;
    ctx.strokeStyle=`rgba(0,229,255,${0.08*vi+Math.sin(t*6)*0.04})`;
    ctx.lineWidth=0.8; ctx.setLineDash([2.5*s,5*s]);
    for(let i=0;i<3;i++){const yo=(i-1)*4.5*s;ctx.beginPath();ctx.moveTo(COLLECT_L+8*s,COLLECT_Y+yo);ctx.lineTo(COLLECT_R-8*s,COLLECT_Y+yo);ctx.stroke();}
    ctx.setLineDash([]);
    if(phase===2){
      [OUTLET_1X,OUTLET_2X].forEach(ox=>{
        ctx.strokeStyle='rgba(0,229,255,0.25)';ctx.lineWidth=0.8;
        for(let j=0;j<3;j++){
          const sy=TAIL_TOP+10*s+j*14*s+Math.sin(t*5)*2.5*s;
          ctx.beginPath();ctx.moveTo(ox-5*s,sy-3*s);ctx.lineTo(ox,sy+1.5*s);ctx.lineTo(ox+5*s,sy-3*s);ctx.stroke();
        }
      });
    }
  }

  function getParams(phase,t) {
    switch(phase){
      case 0:return{rain:1,fill:0.18+Math.sin(t)*0.04};
      case 1:return{rain:1.4,fill:0.45+Math.sin(t*0.5)*0.12};
      case 2:return{rain:1.8,fill:1.0};
      case 3:return{rain:0.08*Math.max(0,1-t*0.08),fill:Math.max(0.04,0.55-t*0.025)};
      default:return{rain:1,fill:0.25};
    }
  }

  // Phase switch
  function setPhase(idx) {
    state.phase=idx; state.animTime=0; state.particles=[]; state.rain=[]; state.bubbles=[];
    container.querySelectorAll('.sa-phase').forEach((b,i)=>b.classList.toggle('active',i===idx));
    const info=phaseInfo[idx];
    document.getElementById('sa-icon').textContent=info.icon;
    document.getElementById('sa-title').textContent=info.title;
    document.getElementById('sa-desc').textContent=info.desc;
  }

  // Controls
  container.querySelectorAll('.sa-phase').forEach(b=>{
    b.addEventListener('click',()=>{state.autoPlay=false;document.getElementById('sa-auto').classList.remove('on');setPhase(parseInt(b.dataset.p));
      if(state.paused){state.paused=false;document.getElementById('sa-play').textContent='⏸';}
    });
  });
  document.getElementById('sa-play').addEventListener('click',()=>{
    state.paused=!state.paused;
    document.getElementById('sa-play').textContent=state.paused?'▶':'⏸';
  });
  document.getElementById('sa-auto').addEventListener('click',()=>{
    state.autoPlay=!state.autoPlay; state.autoTimer=0;
    document.getElementById('sa-auto').classList.toggle('on',state.autoPlay);
    if(state.autoPlay&&state.paused){state.paused=false;document.getElementById('sa-play').textContent='⏸';}
  });

  // Animation loop
  function frame(ts) {
    if(!state.running) return;
    if(!state.lastTime) state.lastTime=ts;
    const dt=(ts-state.lastTime)/1000;
    state.lastTime=ts;

    if(!state.paused){
      state.animTime+=dt;
      if(state.autoPlay){
        state.autoTimer+=dt*1000;
        if(state.autoTimer>=5500){state.autoTimer=0;setPhase((state.phase+1)%4);}
      }
    }

    const p=getParams(state.phase,state.animTime);
    ctx.clearRect(0,0,W,H);
    drawBg();
    drawBuilding();
    drawPipes(p.fill);
    drawOutlet(OUTLET_1X,ROOF_Y+ROOF_THICK/2);
    drawOutlet(OUTLET_2X,ROOF_Y+ROOF_THICK/2);
    drawTransition(DOWN_X,DOWN_BOT);
    if(!state.paused){
      drawRain(p.rain);
      updateParticles(state.phase);
      drawBubbles(state.phase,state.animTime);
      drawVacuum(state.phase,state.animTime);
    } else {
      state.particles.forEach(pt=>{
        ctx.fillStyle=`hsla(${pt.hue},80%,60%,${pt.a})`;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.sz,0,Math.PI*2);ctx.fill();
      });
    }
    drawLabels(state.phase,state.animTime);

    state.rafId=requestAnimationFrame(frame);
  }
  state.rafId=requestAnimationFrame(frame);
}

function destroySiphonicAnim() {
  if(siphonicAnimState){
    siphonicAnimState.running=false;
    if(siphonicAnimState.rafId) cancelAnimationFrame(siphonicAnimState.rafId);
    siphonicAnimState=null;
  }
}
