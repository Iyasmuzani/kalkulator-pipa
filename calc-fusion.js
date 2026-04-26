// ==================== BUTT FUSION CALCULATOR ====================
// ISO 21307:2017 (SHP/SLP/DLP) + DVS 2207-1

function buildFusionForm(){
  document.getElementById('eng-form').innerHTML=`
  <div class="form-title">🔗 Kalkulator Butt Fusion HDPE <span style="font-size:10px;color:var(--text2);font-weight:400">ISO 21307 / DVS 2207</span></div>
  <div class="form-group"><label class="form-label">Diameter Luar Pipa (OD) — mm</label>
  <select class="form-control" id="bf-od">
    <option value="63">DN63</option><option value="75">DN75</option><option value="90">DN90</option>
    <option value="110">DN110</option><option value="125">DN125</option><option value="140">DN140</option>
    <option value="160">DN160</option><option value="180">DN180</option><option value="200">DN200</option>
    <option value="225">DN225</option><option value="250">DN250</option><option value="280">DN280</option>
    <option value="315" selected>DN315</option><option value="355">DN355</option><option value="400">DN400</option>
    <option value="450">DN450</option><option value="500">DN500</option><option value="560">DN560</option>
    <option value="630">DN630</option><option value="710">DN710</option><option value="800">DN800</option>
    <option value="900">DN900</option><option value="1000">DN1000</option><option value="1200">DN1200</option>
  </select></div>
  <div class="form-group"><label class="form-label">SDR</label>
  <select class="form-control" id="bf-sdr">
    <option value="7.4">SDR 7.4 (PN25)</option><option value="9">SDR 9 (PN20)</option>
    <option value="11">SDR 11 (PN16)</option><option value="13.6">SDR 13.6 (PN12.5)</option>
    <option value="17" selected>SDR 17 (PN10)</option><option value="21">SDR 21 (PN8)</option>
    <option value="26">SDR 26 (PN6)</option>
  </select></div>
  <div class="form-group"><label class="form-label">Material</label>
  <select class="form-control" id="bf-mat"><option value="PE100" selected>PE100</option><option value="PE100RC">PE100-RC</option><option value="PE80">PE80</option></select></div>
  <div class="form-group"><label class="form-label">Standar Acuan</label>
  <select class="form-control" id="bf-std" onchange="toggleFusionMode()"><option value="iso" selected>ISO 21307:2017</option><option value="dvs">DVS 2207-1</option></select></div>
  <div id="bf-mode-wrap">
  <div class="form-group"><label class="form-label">Mode Fusion (ISO 21307)</label>
  <select class="form-control" id="bf-mode"><option value="SLP">Single Low Pressure (SLP)</option><option value="SHP">Single High Pressure (SHP)</option><option value="DLP">Dual Low Pressure (DLP)</option></select></div>
  </div>
  <div class="form-group"><label class="form-label">Drag Pressure Mesin (bar)</label>
  <input type="number" class="form-control" id="bf-drag" min="0" max="5" step="0.1" value="0.5"></div>
  <button class="calc-btn" onclick="calcFusion()">⚡ Hitung Parameter Fusion</button>`;
}

function toggleFusionMode(){
  document.getElementById('bf-mode-wrap').style.display=
    document.getElementById('bf-std').value==='iso'?'block':'none';
}

function calcFusion(){
  var od=parseFloat(document.getElementById('bf-od').value);
  var sdr=parseFloat(document.getElementById('bf-sdr').value);
  var mat=document.getElementById('bf-mat').value;
  var std=document.getElementById('bf-std').value;
  var mode=document.getElementById('bf-mode').value;
  var drag=parseFloat(document.getElementById('bf-drag').value)||0;

  // Wall thickness
  var en=Math.round(od/sdr*10)/10;
  // Cross-section area mm²
  var id=od-2*en;
  var A=Math.PI/4*(od*od-id*id);
  // Bead height
  var bead=Math.round(en*0.1+0.5);
  if(bead<0.5)bead=0.5;

  var res;
  if(std==='iso') res=calcISO21307(en,od,A,mode,drag,bead,mat);
  else res=calcDVS2207(en,od,A,drag,bead,mat);

  document.getElementById('eng-results').innerHTML=res;
}

function calcISO21307(en,od,A,mode,drag,bead,mat){
  // Heater plate temperature
  var Thp=221; // ±10°C

  // Pressures in MPa
  var P_bead, P_heat, P_fuse, P_cool;
  var heatSoakTime, changeoverMax, coolingTime, fuseLabel;

  // Heat soak time (seconds) — all modes
  if(mode==='SHP'){
    heatSoakTime=Math.round(10*en); // SHP uses shorter soak
    P_bead=0.15; P_heat=0.02; P_fuse=0.517; P_cool=0.517;
    fuseLabel='Single High Pressure';
    changeoverMax=en<=20?8:en<=30?10:12;
    coolingTime=Math.round(11*en+5);
  } else if(mode==='SLP'){
    heatSoakTime=Math.round(10*en+60);
    P_bead=0.15; P_heat=0.02; P_fuse=0.15; P_cool=0.15;
    fuseLabel='Single Low Pressure';
    changeoverMax=en<=20?8:en<=30?10:12;
    coolingTime=Math.round(11*en+10);
  } else { // DLP
    if(en<22) return `<div class="fusion-warn">⚠️ DLP hanya untuk wall thickness > 22mm. Ketebalan saat ini: ${en}mm. Gunakan SLP atau SHP.</div>`;
    heatSoakTime=Math.round(10*en+60);
    P_bead=0.15; P_heat=0.02; P_fuse=0.15; P_cool=0.025;
    fuseLabel='Dual Low Pressure';
    changeoverMax=en<=30?10:en<=40?12:15;
    coolingTime=Math.round(13*en+10);
  }

  // Convert MPa to bar for display & add drag
  var pb=(P_bead*10+drag).toFixed(1);
  var ph=(P_heat*10+drag).toFixed(1);
  var pf=(P_fuse*10+drag).toFixed(1);
  var pc=(P_cool*10+drag).toFixed(1);

  // Force in kN
  var F_bead=((P_bead*1e6)*A/1e6/1000).toFixed(1);
  var F_fuse=((P_fuse*1e6)*A/1e6/1000).toFixed(1);

  var beadTime=Math.round(en*0.5+5);
  var pressBuildup=en<=20?5:en<=40?8:10;
  var heatMin=Math.floor(heatSoakTime/60), heatSec=heatSoakTime%60;
  var coolMin=Math.floor(coolingTime/60), coolSec=coolingTime%60;

  return `
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Diameter (OD)</div><div class="rv">${od}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Wall Thickness (en)</div><div class="rv">${en}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(od-2*en).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Cross-section</div><div class="rv">${Math.round(A)}<span class="ru"> mm²</span></div></div>
  </div></div>
  <div class="eng-section"><div class="eng-section-title">🔗 ISO 21307:2017 — ${fuseLabel} (${mode})</div>
  <table class="fusion-table">
  <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>
  <tr><td>Suhu Heater Plate</td><td class="fusion-val">${Thp}°C ± 10</td><td>Cek dengan pyrometer</td></tr>
  <tr><td>Bead Height Min.</td><td class="fusion-val">${bead} mm</td><td>Sekeliling circumference</td></tr>
  <tr><td>Bead-up Time</td><td class="fusion-val">~${beadTime} detik</td><td>Hingga bead terbentuk rata</td></tr>
  <tr><td>Bead-up Pressure</td><td class="fusion-val">${pb} bar</td><td>${P_bead} MPa + drag ${drag} bar</td></tr>
  <tr><td>Heat Soak Time</td><td class="fusion-val">${heatMin}m ${heatSec}s (${heatSoakTime}s)</td><td>Tekanan dikurangi</td></tr>
  <tr><td>Heat Soak Pressure</td><td class="fusion-val">${ph} bar</td><td>${P_heat} MPa + drag</td></tr>
  <tr><td>Changeover Time Max.</td><td class="fusion-val">${changeoverMax} detik</td><td>Lepas heater + gabung</td></tr>
  <tr><td>Fusion Pressure</td><td class="fusion-val" style="color:${mode==='SHP'?'#ff8c42':'#00e5ff'}">${pf} bar</td><td>${P_fuse} MPa + drag (Force: ${F_fuse} kN)</td></tr>
  ${mode==='DLP'?`<tr><td>Cooling Pressure (tahap 2)</td><td class="fusion-val">${pc} bar</td><td>${P_cool} MPa + drag</td></tr>`:''}
  <tr><td>Pressure Build-up Time</td><td class="fusion-val">${pressBuildup} detik</td><td>Gradual increase</td></tr>
  <tr><td>Cooling Time Min.</td><td class="fusion-val">${coolMin}m ${coolSec}s (${coolingTime}s)</td><td>Jangan lepas clamp!</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Parameter ini berdasarkan estimasi ISO 21307:2017. Selalu verifikasi dengan tabel resmi standar dan rekomendasi pabrikan mesin fusion untuk OD ${od}mm SDR${Math.round(parseFloat(document.getElementById('bf-sdr').value))} ${mat}.</div>
  </div>`;
}

function calcDVS2207(en,od,A,drag,bead,mat){
  var Thp=mat==='PE80'?210:220; // DVS: 220°C for PE100, 210 for PE80

  // DVS 2207-1 pressures (N/mm² = MPa)
  var P_bead=0.15, P_heat=0.02, P_join=0.15;

  // Times based on wall thickness
  var heatSoakTime=Math.round(10*en);
  var changeoverMax;
  if(en<=4.5) changeoverMax=5;
  else if(en<=7) changeoverMax=6;
  else if(en<=12) changeoverMax=8;
  else if(en<=19) changeoverMax=10;
  else if(en<=26) changeoverMax=12;
  else if(en<=37) changeoverMax=16;
  else if(en<=50) changeoverMax=20;
  else changeoverMax=25;

  var coolingTime=Math.round(10*en+10);
  var pressBuildup;
  if(en<=4.5) pressBuildup=5;
  else if(en<=7) pressBuildup=6;
  else if(en<=12) pressBuildup=7;
  else if(en<=19) pressBuildup=9;
  else if(en<=26) pressBuildup=11;
  else pressBuildup=14;

  var pb=(P_bead*10+drag).toFixed(1);
  var ph=(P_heat*10+drag).toFixed(1);
  var pj=(P_join*10+drag).toFixed(1);
  var F_join=((P_join*1e6)*A/1e6/1000).toFixed(1);

  var beadTime=Math.round(en*0.5+5);
  var heatMin=Math.floor(heatSoakTime/60), heatSec=heatSoakTime%60;
  var coolMin=Math.floor(coolingTime/60), coolSec=coolingTime%60;

  return `
  <div class="eng-section"><div class="eng-section-title">📋 Data Pipa</div>
  <div class="result-grid">
    <div class="result-item"><div class="rk">Diameter (OD)</div><div class="rv">${od}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Wall Thickness (en)</div><div class="rv">${en}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">ID</div><div class="rv">${(od-2*en).toFixed(1)}<span class="ru"> mm</span></div></div>
    <div class="result-item"><div class="rk">Cross-section</div><div class="rv">${Math.round(A)}<span class="ru"> mm²</span></div></div>
  </div></div>
  <div class="eng-section"><div class="eng-section-title">🔗 DVS 2207-1 — ${mat}</div>
  <table class="fusion-table">
  <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>
  <tr><td>Suhu Heater Plate</td><td class="fusion-val">${Thp}°C</td><td>${mat==='PE80'?'PE80: 210°C':'PE100: 220°C'}</td></tr>
  <tr><td>Bead Height Min.</td><td class="fusion-val">${bead} mm</td><td>Sekeliling circumference</td></tr>
  <tr><td>Bead-up Time</td><td class="fusion-val">~${beadTime} detik</td><td>Hingga bead terbentuk rata</td></tr>
  <tr><td>Alignment Pressure</td><td class="fusion-val">${pb} bar</td><td>${P_bead} N/mm² + drag ${drag} bar</td></tr>
  <tr><td>Heat Soak Time</td><td class="fusion-val">${heatMin}m ${heatSec}s (${heatSoakTime}s)</td><td>10 × en = 10 × ${en}</td></tr>
  <tr><td>Heating Pressure</td><td class="fusion-val">${ph} bar</td><td>≤ ${P_heat} N/mm² + drag</td></tr>
  <tr><td>Changeover Time Max.</td><td class="fusion-val">${changeoverMax} detik</td><td>Secepat mungkin!</td></tr>
  <tr><td>Joining Pressure</td><td class="fusion-val">${pj} bar</td><td>${P_join} N/mm² ± 0.01 + drag (Force: ${F_join} kN)</td></tr>
  <tr><td>Pressure Build-up</td><td class="fusion-val">${pressBuildup} detik</td><td>Gradual increase</td></tr>
  <tr><td>Cooling Time Min.</td><td class="fusion-val">${coolMin}m ${coolSec}s (${coolingTime}s)</td><td>Jangan lepas clamp!</td></tr>
  </table>
  <div class="fusion-warn">⚠️ Parameter berdasarkan DVS 2207-1. Selalu verifikasi dengan tabel resmi dan WPS yang disetujui untuk OD ${od}mm en ${en}mm ${mat}.</div>
  </div>`;
}
