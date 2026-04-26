function buildSVG(){
  const w=document.getElementById('viz-svg-wrap');
  if(currentSystem==='bangunan') w.innerHTML=svgBangunan();
  else if(currentSystem==='tambang') w.innerHTML=svgTambang();
  else w.innerHTML=svgDistribusi();
}
function svgBangunan(){
return `<svg viewBox="0 0 580 620" width="100%" style="max-height:560px">
<defs><pattern id="bp" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="rgba(0,100,160,0.15)" stroke-width=".5"/></pattern>
<linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,136,204,.4)"/><stop offset="1" stop-color="rgba(0,60,120,.8)"/></linearGradient></defs>
<rect width="580" height="620" fill="url(#bp)"/>
<text x="14" y="84" fill="#3a6a8b" font-size="9" font-family="monospace">ATAP</text>
<text x="14" y="164" fill="#3a6a8b" font-size="9" font-family="monospace">LT.3</text>
<text x="14" y="244" fill="#3a6a8b" font-size="9" font-family="monospace">LT.2</text>
<text x="14" y="324" fill="#3a6a8b" font-size="9" font-family="monospace">LT.1</text>
<text x="14" y="404" fill="#3a6a8b" font-size="9" font-family="monospace">GND</text>
<text x="14" y="484" fill="#3a6a8b" font-size="9" font-family="monospace">BSMT</text>
<line x1="45" y1="90" x2="545" y2="90" stroke="rgba(0,212,255,.12)"/>
<line x1="45" y1="170" x2="545" y2="170" stroke="rgba(0,212,255,.12)"/>
<line x1="45" y1="250" x2="545" y2="250" stroke="rgba(0,212,255,.12)"/>
<line x1="45" y1="330" x2="545" y2="330" stroke="rgba(0,212,255,.12)"/>
<line x1="45" y1="410" x2="545" y2="410" stroke="rgba(0,212,255,.12)"/>
<line x1="45" y1="490" x2="545" y2="490" stroke="rgba(0,212,255,.12)"/>
<rect x="50" y="50" width="480" height="540" fill="none" stroke="rgba(0,212,255,.25)" stroke-width="1.5" rx="2"/>
<rect x="50" y="30" width="480" height="22" fill="rgba(0,212,255,.06)" stroke="rgba(0,212,255,.2)"/>
<rect x="50" y="490" width="480" height="100" fill="rgba(0,40,80,.25)"/>
<line x1="320" y1="68" x2="320" y2="418" stroke="rgba(0,170,255,.3)" stroke-width="8"/>
<line x1="320" y1="68" x2="320" y2="418" stroke="#00aaff" stroke-width="3.5" opacity=".85"/>
<line x1="355" y1="68" x2="355" y2="490" stroke="rgba(100,180,100,.4)" stroke-width="2" stroke-dasharray="5,3"/>
<line x1="50" y1="388" x2="148" y2="388" stroke="#4488ff" stroke-width="2" stroke-dasharray="6,3" opacity=".8"/>
<text x="96" y="380" text-anchor="middle" fill="#4488ff" font-size="8" font-family="monospace">PDAM</text>
<line x1="215" y1="500" x2="215" y2="418" stroke="#0088cc" stroke-width="2.5" opacity=".8"/>
<line x1="175" y1="418" x2="215" y2="418" stroke="#0088cc" stroke-width="2.5" opacity=".8"/>
<line x1="175" y1="365" x2="175" y2="418" stroke="#0088cc" stroke-width="2.5" opacity=".8"/>
<line x1="205" y1="382" x2="320" y2="382" stroke="#00ff9d" stroke-width="3" opacity=".8"/>
<line x1="320" y1="382" x2="320" y2="418" stroke="#00ff9d" stroke-width="3" opacity=".8"/>
<line x1="390" y1="360" x2="390" y2="382" stroke="#ffaa00" stroke-width="1.8" opacity=".6"/>
<line x1="320" y1="382" x2="390" y2="382" stroke="#ffaa00" stroke-width="1.8" opacity=".6"/>
<line x1="210" y1="77" x2="210" y2="90" stroke="#00aaff" stroke-width="2" opacity=".6"/>
<line x1="210" y1="90" x2="320" y2="90" stroke="#00aaff" stroke-width="2" opacity=".6"/>
<line x1="105" y1="152" x2="320" y2="152" stroke="#00aaff" stroke-width="2.5" opacity=".7"/>
<line x1="105" y1="232" x2="320" y2="232" stroke="#00aaff" stroke-width="2.5" opacity=".7"/>
<line x1="105" y1="312" x2="320" y2="312" stroke="#00aaff" stroke-width="2.5" opacity=".7"/>
${[152,232,312].map(y=>[125,165,205,245,285].map(x=>`<circle cx="${x}" cy="${y}" r="4.5" fill="#00d4ff" opacity=".55"/>`).join('')).join('')}
<line x1="460" y1="152" x2="460" y2="490" stroke="rgba(255,80,60,.4)" stroke-width="1.8" stroke-dasharray="4,3"/>
${[152,232,312,392].map(y=>`<circle cx="460" cy="${y}" r="5" fill="#1a0800" stroke="#ff6644" stroke-width="1.5" opacity=".7"/>`).join('')}
<g class="hotspot" id="hp-roof-tank" onclick="selectComp('roof-tank')"><rect x="155" y="36" width="110" height="42" rx="4" fill="#062040" stroke="#00d4ff" stroke-width="1.5"/><text x="210" y="50" text-anchor="middle" fill="#00d4ff" font-size="8.5" font-family="monospace" font-weight="bold">TANGKI ATAS</text><text x="210" y="73" text-anchor="middle" fill="#3a6a8b" font-size="7.5" font-family="monospace">GWT · Gravitasi</text></g>
<g class="hotspot" id="hp-prv" onclick="selectComp('prv')"><rect x="293" y="140" width="30" height="22" rx="3" fill="#12082a" stroke="#aa66ff" stroke-width="1.5"/><text x="308" y="176" text-anchor="middle" fill="#aa66ff" font-size="7.5" font-family="monospace">PRV</text></g>
<g class="hotspot" id="hp-gate-valve" onclick="selectComp('gate-valve')"><polygon points="308,306 332,306 332,316 320,322 308,316" fill="#081a08" stroke="#00ff9d" stroke-width="1.5"/><text x="320" y="335" text-anchor="middle" fill="#3a6a8b" font-size="7" font-family="monospace">GATE</text></g>
<g class="hotspot" id="hp-check-valve" onclick="selectComp('check-valve')"><circle cx="265" cy="382" r="11" fill="#081818" stroke="#00ffaa" stroke-width="1.5"/><text x="265" y="400" text-anchor="middle" fill="#00ffaa" font-size="7.5" font-family="monospace">CKV</text></g>
<g class="hotspot" id="hp-pressure-gauge" onclick="selectComp('pressure-gauge')"><circle cx="320" cy="270" r="13" fill="#141200" stroke="#ffaa00" stroke-width="1.5"/><circle cx="320" cy="270" r="8" fill="none" stroke="rgba(255,170,0,.35)"/><line x1="320" y1="262" x2="325" y2="273" stroke="#ffaa00" stroke-width="1.5"/><text x="320" y="291" text-anchor="middle" fill="#ffaa00" font-size="7.5" font-family="monospace">P/G</text></g>
<g class="hotspot" id="hp-pump" onclick="selectComp('pump')"><rect x="145" y="355" width="60" height="52" rx="7" fill="#061806" stroke="#00ff9d" stroke-width="2"/><circle cx="175" cy="374" r="12" fill="rgba(0,255,157,.08)" stroke="#00ff9d" stroke-width="1.5"/><text x="175" y="398" text-anchor="middle" fill="#00ff9d" font-size="8" font-family="monospace" font-weight="bold">POMPA</text></g>
<g class="hotspot" id="hp-pressure-tank" onclick="selectComp('pressure-tank')"><rect x="366" y="348" width="48" height="65" rx="5" fill="#141200" stroke="#ffaa00" stroke-width="1.5"/><ellipse cx="390" cy="348" rx="24" ry="9" fill="#141200" stroke="#ffaa00" stroke-width="1.5"/><text x="390" y="407" text-anchor="middle" fill="#ffaa00" font-size="7.5" font-family="monospace" font-weight="bold">TANGKI</text><text x="390" y="418" text-anchor="middle" fill="#3a6a8b" font-size="7" font-family="monospace">TEKAN</text></g>
<g class="hotspot" id="hp-water-meter" onclick="selectComp('water-meter')"><rect x="440" y="374" width="46" height="26" rx="3.5" fill="#060e1a" stroke="#4488ff" stroke-width="1.5"/><circle cx="463" cy="387" r="7" fill="none" stroke="#4488ff" stroke-width="1.2"/><text x="463" y="411" text-anchor="middle" fill="#4488ff" font-size="7.5" font-family="monospace">METER</text></g>
<line x1="440" y1="387" x2="205" y2="387" stroke="#4488ff" stroke-width="1.5" stroke-dasharray="5,3" opacity=".45"/>
<g class="hotspot" id="hp-ground-tank" onclick="selectComp('ground-tank')"><rect x="95" y="496" width="230" height="72" rx="4" fill="#030d1a" stroke="#0088cc" stroke-width="2"/><rect x="100" y="510" width="220" height="52" rx="2" fill="url(#waterGrad)" opacity=".7"/><text x="210" y="510" text-anchor="middle" fill="#0088cc" font-size="9" font-family="monospace" font-weight="bold">TANGKI BAWAH</text></g>
<g class="hotspot" id="hp-floor-drain" onclick="selectComp('floor-drain')"><circle cx="460" cy="152" r="9" fill="#1a0800" stroke="#ff6644" stroke-width="1.8"/><line x1="454" y1="152" x2="466" y2="152" stroke="#ff6644" stroke-width="1.5"/><line x1="460" y1="146" x2="460" y2="158" stroke="#ff6644" stroke-width="1.5"/><text x="460" y="170" text-anchor="middle" fill="#ff6644" font-size="7.5" font-family="monospace">DRAIN</text></g>
</svg>`;}

function svgTambang(){
return `<svg viewBox="0 0 580 520" width="100%" style="max-height:500px">
<defs><linearGradient id="pitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(80,60,30,.2)"/><stop offset="1" stop-color="rgba(40,30,10,.6)"/></linearGradient>
<linearGradient id="sumpGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,100,180,.3)"/><stop offset="1" stop-color="rgba(0,50,100,.7)"/></linearGradient></defs>
<rect width="580" height="520" fill="rgba(10,8,4,.3)"/>
<text x="290" y="20" text-anchor="middle" fill="rgba(255,140,66,.3)" font-size="9" font-family="monospace">PERMUKAAN TANAH (GL+0)</text>
<line x1="20" y1="30" x2="560" y2="30" stroke="rgba(255,140,66,.3)" stroke-width="1.5"/>
<line x1="20" y1="30" x2="100" y2="30" stroke="#66cc66" stroke-width="3"/>
<text x="60" y="45" text-anchor="middle" fill="#66cc66" font-size="7" font-family="monospace">VEGETASI</text>
<polygon points="100,30 180,180 400,180 480,30" fill="url(#pitGrad)" stroke="rgba(255,140,66,.25)" stroke-width="1.5"/>
<text x="290" y="70" text-anchor="middle" fill="rgba(255,140,66,.2)" font-size="8" font-family="monospace">OPEN PIT MINE</text>
<line x1="130" y1="100" x2="450" y2="100" stroke="rgba(255,140,66,.1)" stroke-dasharray="4,4"/>
<text x="460" y="104" fill="rgba(255,140,66,.2)" font-size="7" font-family="monospace">BENCH 1</text>
<line x1="155" y1="140" x2="425" y2="140" stroke="rgba(255,140,66,.1)" stroke-dasharray="4,4"/>
<text x="435" y="144" fill="rgba(255,140,66,.2)" font-size="7" font-family="monospace">BENCH 2</text>
<rect x="230" y="155" width="120" height="30" rx="3" fill="url(#sumpGrad)" stroke="rgba(0,150,255,.3)" stroke-width="1"/>
<line x1="235" y1="165" x2="345" y2="165" stroke="rgba(0,200,255,.4)" stroke-width="1"/>
<line x1="235" y1="172" x2="345" y2="172" stroke="rgba(0,200,255,.2)" stroke-width="1"/>
<text x="290" y="195" text-anchor="middle" fill="rgba(0,150,255,.4)" font-size="7" font-family="monospace">SUMP PIT</text>
<g class="hotspot" id="hp-dewater-pump" onclick="selectComp('dewater-pump')"><rect x="265" y="150" width="50" height="35" rx="5" fill="#1a0e00" stroke="#ff8c42" stroke-width="1.5"/><circle cx="290" cy="163" r="8" fill="rgba(255,140,66,.1)" stroke="#ff8c42" stroke-width="1.2"/><text x="290" y="180" text-anchor="middle" fill="#ff8c42" font-size="7" font-family="monospace" font-weight="bold">DW PUMP</text></g>
<line x1="290" y1="150" x2="290" y2="60" stroke="#4da6ff" stroke-width="3" opacity=".8"/>
<line x1="290" y1="60" x2="480" y2="60" stroke="#4da6ff" stroke-width="3" opacity=".8"/>
<line x1="480" y1="30" x2="480" y2="60" stroke="#4da6ff" stroke-width="3" opacity=".8"/>
<text x="385" y="55" text-anchor="middle" fill="#4da6ff" font-size="7" font-family="monospace">DISCHARGE LINE (HDPE)</text>
<g class="hotspot" id="hp-hdpe-pipe" onclick="selectComp('hdpe-pipe')"><rect x="355" y="42" width="60" height="16" rx="3" fill="#001a2e" stroke="#4da6ff" stroke-width="1.2"/><text x="385" y="53" text-anchor="middle" fill="#4da6ff" font-size="6.5" font-family="monospace">HDPE PIPE</text></g>
<g class="hotspot" id="hp-butterfly-valve" onclick="selectComp('butterfly-valve')"><circle cx="330" cy="60" r="9" fill="#0a0a1a" stroke="#7788ff" stroke-width="1.5"/><text x="330" y="64" text-anchor="middle" fill="#7788ff" font-size="6" font-family="monospace">BFV</text></g>
<g class="hotspot" id="hp-flow-meter" onclick="selectComp('flow-meter')"><rect x="430" y="50" width="30" height="18" rx="3" fill="#001a1a" stroke="#00cccc" stroke-width="1.2"/><text x="445" y="62" text-anchor="middle" fill="#00cccc" font-size="6" font-family="monospace">FM</text></g>
<g class="hotspot" id="hp-expansion-joint" onclick="selectComp('expansion-joint')"><rect x="305" y="95" width="30" height="14" rx="2" fill="#1a1a00" stroke="#cccc00" stroke-width="1.2"/><text x="320" y="105" text-anchor="middle" fill="#cccc00" font-size="5.5" font-family="monospace">EXP.J</text></g>
<line x1="290" y1="95" x2="290" y2="110" stroke="#4da6ff" stroke-width="2" stroke-dasharray="3,2"/>
<rect x="485" y="25" width="90" height="80" rx="4" fill="rgba(10,26,10,.7)" stroke="#66cc66" stroke-width="1.5"/>
<rect x="490" y="55" width="80" height="45" rx="2" fill="rgba(0,100,180,.15)" stroke="rgba(102,204,102,.3)"/>
<line x1="495" y1="68" x2="565" y2="68" stroke="rgba(102,204,102,.3)" stroke-width="1"/>
<g class="hotspot" id="hp-settling-pond" onclick="selectComp('settling-pond')"><rect x="485" y="25" width="90" height="80" rx="4" fill="none" stroke="#66cc66" stroke-width="1.5" opacity="0"/><text x="530" y="42" text-anchor="middle" fill="#66cc66" font-size="7.5" font-family="monospace" font-weight="bold">SETTLING</text><text x="530" y="52" text-anchor="middle" fill="#66cc66" font-size="7.5" font-family="monospace" font-weight="bold">POND</text></g>
<line x1="100" y1="240" x2="480" y2="240" stroke="rgba(255,140,66,.15)" stroke-width="1"/>
<text x="290" y="235" text-anchor="middle" fill="rgba(255,140,66,.2)" font-size="8" font-family="monospace">── SLURRY TRANSPORT SYSTEM ──</text>
<rect x="60" y="260" width="80" height="50" rx="5" fill="rgba(26,16,0,.8)" stroke="#ffb347" stroke-width="1.5"/>
<g class="hotspot" id="hp-slurry-pump" onclick="selectComp('slurry-pump')"><rect x="60" y="260" width="80" height="50" rx="5" fill="none" stroke="#ffb347" stroke-width="1.5" opacity="0"/><circle cx="100" cy="278" r="10" fill="rgba(255,179,71,.08)" stroke="#ffb347" stroke-width="1.2"/><text x="100" y="300" text-anchor="middle" fill="#ffb347" font-size="7" font-family="monospace" font-weight="bold">SLURRY</text><text x="100" y="310" text-anchor="middle" fill="#ffb347" font-size="6" font-family="monospace">PUMP</text></g>
<line x1="140" y1="285" x2="430" y2="285" stroke="#aaaaaa" stroke-width="4" opacity=".5"/>
<line x1="140" y1="285" x2="430" y2="285" stroke="#aaaaaa" stroke-width="2.5" opacity=".8"/>
<text x="290" y="280" text-anchor="middle" fill="#aaaaaa" font-size="7" font-family="monospace">SLURRY PIPELINE (STEEL LINED)</text>
<g class="hotspot" id="hp-steel-pipe" onclick="selectComp('steel-pipe')"><rect x="240" y="275" width="55" height="14" rx="3" fill="#1a1a1a" stroke="#aaaaaa" stroke-width="1.2"/><text x="267" y="285" text-anchor="middle" fill="#ccc" font-size="6" font-family="monospace">STEEL</text></g>
<g class="hotspot" id="hp-knife-gate" onclick="selectComp('knife-gate')"><rect x="185" y="276" width="28" height="18" rx="2" fill="#1a0a0a" stroke="#ff6666" stroke-width="1.2"/><text x="199" y="289" text-anchor="middle" fill="#ff6666" font-size="6" font-family="monospace">KGV</text></g>
<g class="hotspot" id="hp-wear-liner" onclick="selectComp('wear-liner')"><rect x="350" y="275" width="50" height="14" rx="3" fill="#1a0a00" stroke="#cc6633" stroke-width="1.2"/><text x="375" y="285" text-anchor="middle" fill="#cc6633" font-size="6" font-family="monospace">LINER</text></g>
<rect x="430" y="260" width="130" height="70" rx="5" fill="rgba(10,26,10,.5)" stroke="#66cc66" stroke-width="1.5"/>
<rect x="435" y="290" width="120" height="35" rx="2" fill="rgba(80,60,30,.3)"/>
<text x="495" y="280" text-anchor="middle" fill="#66cc66" font-size="8" font-family="monospace" font-weight="bold">TAILING DAM</text>
<text x="495" y="318" text-anchor="middle" fill="rgba(102,204,102,.4)" font-size="7" font-family="monospace">Endapan Tailing</text>
<g transform="translate(20,370)"><rect x="0" y="0" width="180" height="80" rx="5" fill="rgba(6,14,26,.9)" stroke="rgba(255,140,66,.18)"/>
<text x="90" y="14" text-anchor="middle" fill="rgba(255,140,66,.5)" font-size="8" font-family="monospace">LEGENDA</text>
<line x1="8" y1="28" x2="35" y2="28" stroke="#4da6ff" stroke-width="3"/><text x="41" y="31" fill="#7a9ab8" font-size="7" font-family="monospace">Dewatering line</text>
<line x1="8" y1="42" x2="35" y2="42" stroke="#aaaaaa" stroke-width="3"/><text x="41" y="45" fill="#7a9ab8" font-size="7" font-family="monospace">Slurry pipeline</text>
<line x1="8" y1="56" x2="35" y2="56" stroke="#66cc66" stroke-width="1.5"/><text x="41" y="59" fill="#7a9ab8" font-size="7" font-family="monospace">Settling/Tailing</text>
<line x1="8" y1="70" x2="35" y2="70" stroke="#ff8c42" stroke-width="1.5"/><text x="41" y="73" fill="#7a9ab8" font-size="7" font-family="monospace">Pompa/Equipment</text>
</g>
</svg>`;}

function svgDistribusi(){
return `<svg viewBox="0 0 620 480" width="100%" style="max-height:460px">
<rect width="620" height="480" fill="rgba(4,12,20,.3)"/>
<text x="310" y="18" text-anchor="middle" fill="rgba(109,213,237,.3)" font-size="9" font-family="monospace">SKEMA JARINGAN DISTRIBUSI AIR BERSIH</text>
<g class="hotspot" id="hp-intake" onclick="selectComp('intake')"><path d="M30,80 Q50,50 70,80 Q90,50 110,80 L110,120 L30,120 Z" fill="rgba(0,40,80,.4)" stroke="#6dd5ed" stroke-width="1.5"/><text x="70" y="105" text-anchor="middle" fill="#6dd5ed" font-size="8" font-family="monospace" font-weight="bold">INTAKE</text><text x="70" y="115" text-anchor="middle" fill="#3a6a8b" font-size="6.5" font-family="monospace">Sumber Air</text></g>
<line x1="110" y1="100" x2="155" y2="100" stroke="#6dd5ed" stroke-width="2.5" opacity=".7"/>
<rect x="155" y="80" width="65" height="40" rx="5" fill="rgba(0,40,60,.5)" stroke="#00aacc" stroke-width="1.2"/>
<text x="187" y="98" text-anchor="middle" fill="#00aacc" font-size="7.5" font-family="monospace" font-weight="bold">WTP</text>
<text x="187" y="110" text-anchor="middle" fill="#3a6a8b" font-size="6.5" font-family="monospace">Pengolahan</text>
<line x1="220" y1="100" x2="270" y2="100" stroke="#00aacc" stroke-width="3" opacity=".7"/>
<text x="245" y="95" text-anchor="middle" fill="rgba(0,170,204,.4)" font-size="6" font-family="monospace">TRANSMISI</text>
<g class="hotspot" id="hp-pipa-transmisi" onclick="selectComp('pipa-transmisi')"><rect x="228" y="91" width="35" height="12" rx="2" fill="#001a1a" stroke="#00aacc" stroke-width="1" opacity=".8"/><text x="245" y="100" text-anchor="middle" fill="#00aacc" font-size="5.5" font-family="monospace">HDPE</text></g>
<g class="hotspot" id="hp-reservoir" onclick="selectComp('reservoir')"><rect x="270" y="70" width="90" height="60" rx="6" fill="rgba(10,26,46,.8)" stroke="#4da6ff" stroke-width="2"/><rect x="275" y="90" width="80" height="35" rx="2" fill="rgba(0,100,200,.15)"/><line x1="280" y1="100" x2="350" y2="100" stroke="rgba(77,166,255,.3)" stroke-width="1"/><line x1="280" y1="108" x2="350" y2="108" stroke="rgba(77,166,255,.2)" stroke-width="1"/><text x="315" y="85" text-anchor="middle" fill="#4da6ff" font-size="8" font-family="monospace" font-weight="bold">RESERVOIR</text><text x="315" y="120" text-anchor="middle" fill="#3a6a8b" font-size="6.5" font-family="monospace">Ground Tank</text></g>
<g class="hotspot" id="hp-booster-pump" onclick="selectComp('booster-pump')"><rect x="375" y="78" width="55" height="44" rx="5" fill="rgba(0,26,10,.8)" stroke="#00cc66" stroke-width="1.5"/><circle cx="402" cy="95" r="10" fill="rgba(0,204,102,.08)" stroke="#00cc66" stroke-width="1.2"/><text x="402" y="115" text-anchor="middle" fill="#00cc66" font-size="7" font-family="monospace" font-weight="bold">BOOSTER</text></g>
<line x1="360" y1="100" x2="375" y2="100" stroke="#4da6ff" stroke-width="2.5"/>
<line x1="430" y1="100" x2="460" y2="100" stroke="#00cc66" stroke-width="3" opacity=".8"/>
<line x1="460" y1="100" x2="460" y2="180" stroke="#6677dd" stroke-width="3" opacity=".7"/>
<text x="470" y="145" fill="#6677dd" font-size="7" font-family="monospace" transform="rotate(90,470,145)">PIPA UTAMA</text>
<line x1="460" y1="180" x2="460" y2="420" stroke="#6677dd" stroke-width="3" opacity=".5"/>
<line x1="200" y1="200" x2="460" y2="200" stroke="#6677dd" stroke-width="2.5" opacity=".6"/>
<line x1="200" y1="280" x2="460" y2="280" stroke="#6677dd" stroke-width="2" opacity=".5"/>
<line x1="200" y1="360" x2="460" y2="360" stroke="#6677dd" stroke-width="2" opacity=".4"/>
<text x="195" y="196" text-anchor="end" fill="rgba(102,119,221,.5)" font-size="8" font-family="monospace">DMA-1</text>
<text x="195" y="276" text-anchor="end" fill="rgba(102,119,221,.4)" font-size="8" font-family="monospace">DMA-2</text>
<text x="195" y="356" text-anchor="end" fill="rgba(102,119,221,.3)" font-size="8" font-family="monospace">DMA-3</text>
<g class="hotspot" id="hp-pipa-distribusi" onclick="selectComp('pipa-distribusi')"><rect x="290" y="191" width="55" height="14" rx="3" fill="#0a0a1a" stroke="#6677dd" stroke-width="1.2"/><text x="317" y="201" text-anchor="middle" fill="#6677dd" font-size="6" font-family="monospace">DISTRIBUSI</text></g>
<g class="hotspot" id="hp-gate-valve-net" onclick="selectComp('gate-valve-net')"><polygon points="225,195 245,195 245,205 235,210 225,205" fill="#1a1a00" stroke="#ccaa00" stroke-width="1.2"/><text x="235" y="222" text-anchor="middle" fill="#ccaa00" font-size="6.5" font-family="monospace">GV</text></g>
<g class="hotspot" id="hp-air-valve" onclick="selectComp('air-valve')"><circle cx="370" cy="200" r="8" fill="#001a0a" stroke="#33cc99" stroke-width="1.2"/><line x1="370" y1="193" x2="370" y2="188" stroke="#33cc99" stroke-width="1.5"/><text x="370" y="222" text-anchor="middle" fill="#33cc99" font-size="6.5" font-family="monospace">AIR V</text></g>
<g class="hotspot" id="hp-prv-net" onclick="selectComp('prv-net')"><rect x="415" y="271" width="28" height="18" rx="3" fill="#1a001a" stroke="#cc66cc" stroke-width="1.2"/><text x="429" y="283" text-anchor="middle" fill="#cc66cc" font-size="6" font-family="monospace">PRV</text></g>
<g class="hotspot" id="hp-water-meter-bulk" onclick="selectComp('water-meter-bulk')"><rect x="440" y="191" width="40" height="18" rx="3" fill="#0a0a2e" stroke="#5566ff" stroke-width="1.2"/><circle cx="460" cy="200" r="5" fill="none" stroke="#5566ff"/><text x="460" y="222" text-anchor="middle" fill="#5566ff" font-size="6.5" font-family="monospace">METER</text></g>
${[200,280,360].map(y=>[260,300,340,380,420].map(x=>`<rect x="${x-3}" y="${y+15}" width="6" height="8" rx="1" fill="rgba(109,213,237,.15)" stroke="rgba(109,213,237,.2)" stroke-width=".5"/>`).join('')).join('')}
<text x="340" y="230" text-anchor="middle" fill="rgba(109,213,237,.2)" font-size="6.5" font-family="monospace">▪ ▪ ▪ Sambungan Rumah ▪ ▪ ▪</text>
<g class="hotspot" id="hp-hydrant" onclick="selectComp('hydrant')"><rect x="490" y="265" width="30" height="40" rx="3" fill="#2e0a0a" stroke="#ff4444" stroke-width="1.5"/><circle cx="505" cy="280" r="6" fill="rgba(255,68,68,.15)" stroke="#ff4444" stroke-width="1"/><text x="505" y="298" text-anchor="middle" fill="#ff4444" font-size="6.5" font-family="monospace" font-weight="bold">🔴</text><text x="505" y="315" text-anchor="middle" fill="#ff4444" font-size="6.5" font-family="monospace">HIDRAN</text></g>
<g transform="translate(20,400)"><rect x="0" y="0" width="200" height="70" rx="5" fill="rgba(6,14,26,.9)" stroke="rgba(109,213,237,.18)"/>
<text x="100" y="14" text-anchor="middle" fill="rgba(109,213,237,.5)" font-size="8" font-family="monospace">LEGENDA</text>
<line x1="8" y1="28" x2="35" y2="28" stroke="#00aacc" stroke-width="3"/><text x="41" y="31" fill="#7a9ab8" font-size="7" font-family="monospace">Pipa transmisi</text>
<line x1="8" y1="42" x2="35" y2="42" stroke="#6677dd" stroke-width="2.5"/><text x="41" y="45" fill="#7a9ab8" font-size="7" font-family="monospace">Pipa distribusi</text>
<line x1="8" y1="56" x2="35" y2="56" stroke="#00cc66" stroke-width="2"/><text x="41" y="59" fill="#7a9ab8" font-size="7" font-family="monospace">Discharge pompa</text>
</g>
</svg>`;}
