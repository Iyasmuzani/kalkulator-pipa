// ==================== PIPE PHYSICS CALCULATORS ====================
var E=document.getElementById.bind(document);
var Vf=function(id){return parseFloat(E(id).value)||0;};

// ===== 1. PRESSURE LOSS (Hazen-Williams) =====
function buildPressLossForm(){
  E('eng-form').innerHTML=`
  <div class="form-title">📉 Pressure Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Hazen-Williams</span></div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="pl-mat" onchange="updateCfactor()">
    <option value="150">HDPE (C=150)</option><option value="150">PVC (C=150)</option>
    <option value="140">PPR (C=140)</option><option value="120">Baja Galvanis (C=120)</option>
    <option value="130">Ductile Iron (C=130)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="pl-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="pl-l" min="1" max="50000" value="100"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)</label><input type="number" class="form-control" id="pl-q" min="0.1" max="5000" step="0.1" value="5"></div>
  <div class="form-group"><label class="form-label">C-Factor</label><input type="number" class="form-control" id="pl-c" min="50" max="160" value="150"></div>
  <button class="calc-btn" onclick="calcPressLoss()">⚡ Hitung Pressure Loss</button>`;
}
function updateCfactor(){E('pl-c').value=E('pl-mat').value;}
function calcPressLoss(){
  var d=Vf('pl-d')/1000,L=Vf('pl-l'),Q=Vf('pl-q')/1000,C=Vf('pl-c');
  var v=4*Q/(Math.PI*d*d);
  var hf=10.67*Math.pow(Q,1.852)/(Math.pow(C,1.852)*Math.pow(d,4.87))*L;
  var pBar=hf*9.81/100;
  var hfPer100=hf/L*100;
  E('eng-results').innerHTML=`
  <div class="eng-section"><div class="eng-section-title">📉 Hasil Pressure Loss</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Kecepatan Aliran</div><div class="rv">${v.toFixed(2)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Head Loss Total</div><div class="rv">${hf.toFixed(2)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Pressure Loss</div><div class="rv">${pBar.toFixed(3)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Head Loss /100m</div><div class="rv">${hfPer100.toFixed(3)}<span class="ru"> m/100m</span></div></div>
  </div>
  ${v>2.5?'<div class="fusion-warn">⚠️ Kecepatan > 2.5 m/s — pertimbangkan diameter lebih besar</div>':''}
  ${v<0.5?'<div class="fusion-warn">⚠️ Kecepatan < 0.5 m/s — risiko sedimentasi</div>':''}
  </div>`;
}

// ===== 2. BUOYANCY =====
function buildBuoyancyForm(){
  E('eng-form').innerHTML=`
  <div class="form-title">🌊 Buoyancy Pipa HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">Instalasi Underwater</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar (OD) mm</label><input type="number" class="form-control" id="by-od" min="50" max="2000" value="315"></div>
  <div class="form-group"><label class="form-label">SDR</label>
  <select class="form-control" id="by-sdr"><option value="11">SDR 11</option><option value="17" selected>SDR 17</option><option value="21">SDR 21</option><option value="26">SDR 26</option></select></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="by-len" min="1" max="10000" value="100"></div>
  <div class="form-group"><label class="form-label">Densitas Air (kg/m³)</label>
  <select class="form-control" id="by-rho"><option value="1000">Air Tawar (1000)</option><option value="1025">Air Laut (1025)</option></select></div>
  <div class="form-group"><label class="form-label">Kondisi Pipa</label>
  <select class="form-control" id="by-cond"><option value="empty">Kosong (tanpa air)</option><option value="full">Penuh air</option></select></div>
  <div class="form-group"><label class="form-label">Safety Factor Ballast</label><input type="number" class="form-control" id="by-sf" min="1" max="2" step="0.05" value="1.1"></div>
  <button class="calc-btn" onclick="calcBuoyancy()">⚡ Hitung Buoyancy</button>`;
}
function calcBuoyancy(){
  var od=Vf('by-od')/1000,sdr=Vf('by-sdr'),len=Vf('by-len'),rhoW=Vf('by-rho'),sf=Vf('by-sf');
  var en=od/sdr,id=od-2*en;
  var rhoPE=950; // kg/m³ HDPE
  var Apipe=Math.PI/4*(od*od-id*id);
  var Awater=Math.PI/4*id*id;
  var Adisplaced=Math.PI/4*od*od;
  var full=E('by-cond').value==='full';
  var wPipe=rhoPE*Apipe; // kg/m
  var wWater=full?1000*Awater:0;
  var wTotal=wPipe+wWater; // kg/m
  var Fb=rhoW*Adisplaced; // kg/m (buoyancy force)
  var netUp=Fb-wTotal;
  var needBallast=netUp>0;
  var ballast=needBallast?netUp*sf:0;
  var ballastTotal=ballast*len;
  var spacing=needBallast?Math.min(Math.floor(1/(ballast/50)),5):0; // concrete block every N m
  E('eng-results').innerHTML=`
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">OD / en</div><div class="rv">${(od*1000).toFixed(0)} / ${(en*1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(id*1000).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Berat Pipa</div><div class="rv">${wPipe.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Kondisi</div><div class="rv">${full?'Penuh air':'Kosong'}</div></div>
  </div></div>
  <div class="eng-section"><div class="eng-section-title">🌊 Analisis Buoyancy</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Gaya Apung</div><div class="rv">${Fb.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Berat Total</div><div class="rv">${wTotal.toFixed(2)}<span class="ru"> kg/m</span></div></div>
    <div class="result-item"><div class="rk">Net Uplift</div><div class="rv" style="color:${needBallast?'#ff5555':'#00ff9d'}">${netUp.toFixed(2)}<span class="ru"> kg/m ${needBallast?'↑ FLOAT':'↓ SINK'}</span></div></div>
    <div class="result-item"><div class="rk">Ballast /m</div><div class="rv">${ballast.toFixed(2)}<span class="ru"> kg/m (SF=${sf})</span></div></div>
  </div>
  ${needBallast?`<div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Ballast Total</div><div class="rv">${(ballastTotal/1000).toFixed(1)}<span class="ru"> ton (${len}m)</span></div></div>
    <div class="result-item"><div class="rk">Spacing ±50kg blok</div><div class="rv">setiap ${spacing>0?spacing:1}<span class="ru"> m</span></div></div>
  </div>`:''}
  </div>`;
}

// ===== 3. WATER HAMMER (Joukowsky) =====
function buildWaterHammerForm(){
  E('eng-form').innerHTML=`
  <div class="form-title">💥 Water Hammer <span style="font-size:10px;color:var(--text2);font-weight:400">Joukowsky</span></div>
  <div class="form-group"><label class="form-label">Material Pipa</label>
  <select class="form-control" id="wh-mat"><option value="pvc">PVC (E=3 GPa)</option><option value="hdpe" selected>HDPE (E=0.8 GPa)</option><option value="ppr">PPR (E=0.9 GPa)</option><option value="steel">Baja (E=200 GPa)</option><option value="di">Ductile Iron (E=170 GPa)</option></select></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="wh-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Tebal Dinding (mm)</label><input type="number" class="form-control" id="wh-en" min="1" max="100" value="18.5"></div>
  <div class="form-group"><label class="form-label">Kecepatan Aliran (m/s)</label><input type="number" class="form-control" id="wh-v" min="0.1" max="10" step="0.1" value="1.5"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="wh-l" min="10" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Tekanan Kerja (bar)</label><input type="number" class="form-control" id="wh-pw" min="1" max="50" step="0.5" value="10"></div>
  <button class="calc-btn" onclick="calcWaterHammer()">⚡ Hitung Water Hammer</button>`;
}
function calcWaterHammer(){
  var matE={'pvc':3e9,'hdpe':0.8e9,'ppr':0.9e9,'steel':200e9,'di':170e9};
  var mat=E('wh-mat').value,d=Vf('wh-d')/1000,en=Vf('wh-en')/1000;
  var v=Vf('wh-v'),L=Vf('wh-l'),Pw=Vf('wh-pw');
  var Ep=matE[mat],K=2.2e9,rho=998;
  // Celerity
  var a=Math.sqrt(K/rho)/Math.sqrt(1+(K*d)/(Ep*en));
  // Pressure surge
  var dP=rho*a*v; // Pa
  var dPbar=dP/1e5;
  var Ptotal=Pw+dPbar;
  // Reflection time
  var Tr=2*L/a;
  var matNames={'pvc':'PVC','hdpe':'HDPE','ppr':'PPR','steel':'Baja','di':'Ductile Iron'};
  E('eng-results').innerHTML=`
  <div class="eng-section"><div class="eng-section-title">💥 Hasil Water Hammer — Joukowsky</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Wave Celerity (a)</div><div class="rv">${a.toFixed(1)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Pressure Surge (ΔP)</div><div class="rv" style="color:#ff8c42">${dPbar.toFixed(2)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Kerja</div><div class="rv">${Pw}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Tekanan Maks.</div><div class="rv" style="color:${Ptotal>Pw*1.5?'#ff5555':'#00e5ff'}">${Ptotal.toFixed(2)}<span class="ru"> bar</span></div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Reflection Time</div><div class="rv">${Tr.toFixed(2)}<span class="ru"> detik</span></div></div>
    <div class="result-item"><div class="rk">Material</div><div class="rv">${matNames[mat]}<span class="ru"> E=${(Ep/1e9).toFixed(1)} GPa</span></div></div>
  </div></div>
  ${Ptotal>Pw*1.5?'<div class="fusion-warn">⚠️ Surge pressure > 150% tekanan kerja! Pasang surge anticipator, air valve, atau slow-closing valve.</div>':''}
  ${mat==='hdpe'?'<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed">💡 HDPE memiliki elastisitas tinggi — wave celerity lebih rendah dan meredam water hammer lebih baik dibanding pipa kaku.</div>':''}`;
}

// ===== 4. FRICTION LOSS (Darcy-Weisbach) =====
function buildFrictionForm(){
  E('eng-form').innerHTML=`
  <div class="form-title">🔧 Friction Loss <span style="font-size:10px;color:var(--text2);font-weight:400">Darcy-Weisbach + Colebrook-White</span></div>
  <div class="form-group"><label class="form-label">Diameter Dalam (mm)</label><input type="number" class="form-control" id="fr-d" min="10" max="2000" value="200"></div>
  <div class="form-group"><label class="form-label">Panjang Pipa (m)</label><input type="number" class="form-control" id="fr-l" min="1" max="50000" value="500"></div>
  <div class="form-group"><label class="form-label">Debit (L/s)</label><input type="number" class="form-control" id="fr-q" min="0.1" max="5000" step="0.1" value="10"></div>
  <div class="form-group"><label class="form-label">Kekasaran Pipa ε (mm)</label>
  <select class="form-control" id="fr-e"><option value="0.0015">HDPE (0.0015 mm)</option><option value="0.0015">PVC (0.0015 mm)</option><option value="0.007">PPR (0.007 mm)</option><option value="0.15">Baja Galvanis (0.15 mm)</option><option value="0.26">Baja Karbon (0.26 mm)</option><option value="0.12">Ductile Iron (0.12 mm)</option></select></div>
  <div class="form-group"><label class="form-label">Suhu Air (°C)</label><input type="number" class="form-control" id="fr-t" min="5" max="80" value="25"></div>
  <button class="calc-btn" onclick="calcFriction()">⚡ Hitung Friction Loss</button>`;
}
function calcFriction(){
  var d=Vf('fr-d')/1000,L=Vf('fr-l'),Q=Vf('fr-q')/1000,eps=Vf('fr-e')/1000,T=Vf('fr-t');
  var nu=1.004e-6*Math.pow(20/T,0.5); // simplified viscosity
  var v=4*Q/(Math.PI*d*d);
  var Re=v*d/nu;
  var regime=Re<2300?'Laminar':Re<4000?'Transisi':'Turbulen';
  // Colebrook-White iterative
  var f=0.02;
  for(var i=0;i<50;i++){
    var rhs=-2*Math.log10(eps/(3.7*d)+2.51/(Re*Math.sqrt(f)));
    f=1/(rhs*rhs);
  }
  var hf=f*(L/d)*v*v/(2*9.81);
  var pBar=hf*9.81/100;
  E('eng-results').innerHTML=`
  <div class="eng-section"><div class="eng-section-title">🔧 Hasil Friction Loss — Darcy-Weisbach</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Kecepatan</div><div class="rv">${v.toFixed(3)}<span class="ru"> m/s</span></div></div>
    <div class="result-item"><div class="rk">Reynolds (Re)</div><div class="rv">${Math.round(Re).toLocaleString()}</div></div>
    <div class="result-item"><div class="rk">Regime Aliran</div><div class="rv" style="color:${Re>4000?'#00e5ff':'#ffaa00'}">${regime}</div></div>
    <div class="result-item"><div class="rk">Friction Factor (f)</div><div class="rv">${f.toFixed(6)}</div></div>
  </div>
  <div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Head Loss</div><div class="rv">${hf.toFixed(3)}<span class="ru"> m</span></div></div>
    <div class="result-item"><div class="rk">Pressure Drop</div><div class="rv">${pBar.toFixed(4)}<span class="ru"> bar</span></div></div>
    <div class="result-item"><div class="rk">Gradient</div><div class="rv">${(hf/L*1000).toFixed(2)}<span class="ru"> m/km</span></div></div>
    <div class="result-item"><div class="rk">Kekasaran ε</div><div class="rv">${(eps*1000).toFixed(4)}<span class="ru"> mm</span></div></div>
  </div></div>`;
}

// ===== 5. PIPE LOAD (Marston) =====
function buildPipeLoadForm(){
  E('eng-form').innerHTML=`
  <div class="form-title">⚖️ Pipe Load <span style="font-size:10px;color:var(--text2);font-weight:400">Marston + Live Load</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar (OD) mm</label><input type="number" class="form-control" id="ld-od" min="50" max="2000" value="315"></div>
  <div class="form-group"><label class="form-label">Tipe Pipa</label>
  <select class="form-control" id="ld-type"><option value="flexible" selected>Flexible (HDPE/PVC)</option><option value="rigid">Rigid (Beton/DI/Baja)</option></select></div>
  <div class="form-group"><label class="form-label">Kedalaman Tanam (m)</label><input type="number" class="form-control" id="ld-h" min="0.3" max="10" step="0.1" value="1.2"></div>
  <div class="form-group"><label class="form-label">Lebar Galian (m)</label><input type="number" class="form-control" id="ld-bd" min="0.3" max="5" step="0.1" value="0.6"></div>
  <div class="form-group"><label class="form-label">Jenis Tanah</label>
  <select class="form-control" id="ld-soil"><option value="18">Tanah Biasa γ=18 kN/m³</option><option value="20">Tanah Padat γ=20 kN/m³</option><option value="16">Tanah Lunak γ=16 kN/m³</option></select></div>
  <div class="form-group"><label class="form-label">Beban Permukaan</label>
  <select class="form-control" id="ld-live"><option value="0">Tanpa beban lalu lintas</option><option value="10">Pedestrian (10 kN)</option><option value="50">Kendaraan Ringan (50 kN)</option><option value="100">Truk (100 kN)</option><option value="200">Heavy Equipment (200 kN)</option></select></div>
  <button class="calc-btn" onclick="calcPipeLoad()">⚡ Hitung Pipe Load</button>`;
}
function calcPipeLoad(){
  var od=Vf('ld-od')/1000,H=Vf('ld-h'),Bd=Vf('ld-bd'),gamma=Vf('ld-soil'),Pl=Vf('ld-live');
  var type=E('ld-type').value;
  // Marston load coefficient
  var ratio=H/Bd;
  var Cd=1-Math.exp(-2*0.33*ratio)/(2*0.33); // Kμ'=0.33 typical
  if(Cd<0)Cd=0.1;
  // Earth load per meter
  var We=Cd*gamma*Bd*Bd; // kN/m (rigid)
  if(type==='flexible') We=Cd*gamma*od*Bd; // flexible
  // Live load (Boussinesq simplified)
  var Wl=0;
  if(Pl>0){
    var If=1/(1+2*H/Math.sqrt(od*0.6)); // impact factor simplified
    Wl=Pl*If/(Bd*1.5); // kN/m distributed
  }
  var Wtotal=We+Wl;
  // Deflection estimate for flexible pipe
  var deflPct=0;
  if(type==='flexible'){
    var Ep_pipe=0.8; // GPa for HDPE, short term
    var en=od/(17); // assume SDR17
    var EI=Ep_pipe*1e6*en*en*en/12;
    var Es=gamma*100; // soil modulus kPa rough
    deflPct=(0.1*Wtotal*1000)/(EI+0.061*Es*od*1000)*100;
    if(deflPct>10)deflPct=10;
  }
  E('eng-results').innerHTML=`
  <div class="eng-section"><div class="eng-section-title">⚖️ Hasil Pipe Load</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Beban Tanah</div><div class="rv">${We.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Beban Lalu Lintas</div><div class="rv">${Wl.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Beban Total</div><div class="rv" style="color:#00e5ff">${Wtotal.toFixed(2)}<span class="ru"> kN/m</span></div></div>
    <div class="result-item"><div class="rk">Marston Cd</div><div class="rv">${Cd.toFixed(3)}</div></div>
  </div>
  ${type==='flexible'?`<div class="result-grid" style="margin-top:8px">
    <div class="result-item"><div class="rk">Defleksi Estimasi</div><div class="rv" style="color:${deflPct>5?'#ff5555':'#00ff9d'}">${deflPct.toFixed(1)}<span class="ru"> %</span></div></div>
    <div class="result-item"><div class="rk">Batas Max.</div><div class="rv">5<span class="ru"> % (AWWA)</span></div></div>
  </div>
  ${deflPct>5?'<div class="fusion-warn">⚠️ Defleksi > 5%! Perbaiki bedding, compaction, atau gunakan pipa SDR lebih rendah.</div>':''}`:
  `<div class="fusion-warn" style="border-color:rgba(0,229,255,.2);background:rgba(0,229,255,.04);color:#6dd5ed">💡 Pipa rigid: verifikasi kekuatan crushing dengan three-edge bearing test.</div>`}
  </div>`;
}
