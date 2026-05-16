const fs = require('fs');

// SVG prefix helper
const S = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const E = '</svg>';

// UNIQUE icons for every component, mapped by key (not code, to avoid duplicates)
const iconMap = {
  // ============ DATA-SIPHONIC ============
  'siphonic-outlet': S + '<path d="M3 9l4-4 4 4"/><path d="M7 5v8"/><circle cx="7" cy="17" r="3"/><path d="M21 12h-4l-3 9"/>' + E,
  'anti-vortex': S + '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>' + E,
  'tail-pipe': S + '<path d="M12 2v20"/><path d="M8 6h8"/><path d="M8 18h8"/><path d="M9 22l3-4 3 4"/>' + E,
  'collecting-pipe': S + '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>' + E,
  'downpipe': S + '<path d="M12 2v14"/><path d="M5 10l7 7 7-7"/><path d="M12 16v6"/>' + E,
  'transition-fitting': S + '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 21V9a9 9 0 0 1 9 9v3"/><path d="M6 3v3"/>' + E,
  'clamp-bracket': S + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>' + E,
  'overflow-system': S + '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' + E,
  'pipe-material': S + '<path d="M8 3v18"/><path d="M12 3v18"/><path d="M16 3v18"/><path d="M4 8h16"/><path d="M4 16h16"/>' + E,
  'discharge-point': S + '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>' + E,

  // ============ DATA-BANGUNAN ============
  'roof-tank': S + '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' + E,
  'ground-tank': S + '<rect x="3" y="10" width="18" height="12" rx="2"/><path d="M3 14h18"/><path d="M12 6v4"/><path d="M9 6h6"/>' + E,
  'pump': S + '<circle cx="12" cy="12" r="7"/><path d="M12 5v14"/><path d="M5 12h14"/><path d="M2 12h2"/><path d="M20 12h2"/>' + E,
  'pressure-tank': S + '<rect x="6" y="4" width="12" height="18" rx="3"/><path d="M6 10h12"/><circle cx="12" cy="15" r="1"/><path d="M10 4V2"/><path d="M14 4V2"/>' + E,
  'prv': S + '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>' + E,
  'gate-valve': S + '<path d="M12 2v6"/><rect x="4" y="8" width="16" height="8" rx="1"/><path d="M4 12h16"/><path d="M8 16v4"/><path d="M16 16v4"/>' + E,
  'check-valve': S + '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' + E,
  'pressure-gauge': S + '<circle cx="12" cy="14" r="8"/><path d="M12 14l4-6"/><path d="M12 6V2"/><path d="M4.93 10l-1-1"/><path d="M19.07 10l1-1"/>' + E,
  'water-meter': S + '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/><path d="M12 3V1"/><path d="M12 23v-2"/>' + E,
  'floor-drain': S + '<circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M6 12h12"/><circle cx="12" cy="12" r="3"/>' + E,

  // ============ DATA-DISTRIBUSI ============
  'intake': S + '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>' + E,
  'reservoir': S + '<path d="M4 22h16a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M8 18v-6"/>' + E,
  'booster-pump': S + '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' + E,
  'pipa-transmisi': S + '<path d="M2 10h6l2-4h4l2 4h6"/><path d="M2 14h6l2 4h4l2-4h6"/>' + E,
  'pipa-distribusi': S + '<path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-5 5"/>' + E,
  'gate-valve-net': S + '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' + E,
  'air-valve': S + '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>' + E,
  'prv-net': S + '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' + E,
  'water-meter-bulk': S + '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="8" y1="10" x2="8" y2="15"/><line x1="12" y1="8" x2="12" y2="15"/><line x1="16" y1="11" x2="16" y2="15"/>' + E,
  'hydrant': S + '<path d="M8 22v-6"/><path d="M16 22v-6"/><path d="M6 16h12"/><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M4 12h2"/><path d="M18 12h2"/><path d="M12 2v6"/>' + E,

  // ============ DATA-TAMBANG ============
  'dewater-pump': S + '<circle cx="12" cy="10" r="7"/><path d="M8.56 2.75a7 7 0 0 1 6.88 0"/><path d="M12 17v5"/><path d="M8 22h8"/>' + E,
  'slurry-pump': S + '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' + E,
  'hdpe-pipe': S + '<rect x="2" y="6" width="20" height="12" rx="6"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/>' + E,
  'steel-pipe': S + '<path d="M2 10h20v4H2z"/><path d="M6 10v4"/><path d="M10 10v4"/><path d="M14 10v4"/><path d="M18 10v4"/>' + E,
  'settling-pond': S + '<path d="M2 13h20"/><path d="M4 13v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M7 9v4"/><path d="M12 7v6"/><path d="M17 10v3"/>' + E,
  'butterfly-valve': S + '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><ellipse cx="12" cy="12" rx="3" ry="9"/>' + E,
  'knife-gate': S + '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' + E,
  'flow-meter': S + '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' + E,
  'expansion-joint': S + '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' + E,
  'wear-liner': S + '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' + E,
};

// Process each file, replacing based on the OBJECT KEY (not the code)
function processFile(filePath, objName) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [key, svg] of Object.entries(iconMap)) {
    // Match patterns like:  'key-name':{name:'...',code:'...',icon: '...',
    const regex = new RegExp("'" + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "':\\{([^}]*?)icon:\\s*'[^']*'", 'g');
    content = content.replace(regex, "'" + key + "':{$1icon: '" + svg + "'");
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated: ' + filePath);
}

processFile('data-siphonic.js', 'siphonicCompData');
processFile('data-bangunan.js', 'bangunanCompData');
processFile('data-distribusi.js', 'distribusiCompData');
processFile('data-tambang.js', 'tambangCompData');

// Verify
['data-siphonic.js', 'data-bangunan.js', 'data-distribusi.js', 'data-tambang.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const genericCount = (content.match(/rect x="3" y="3" width="18" height="18"/g) || []).length;
  const pipeGenCount = (content.match(/M2 14h20v4H2.*M2 6h20v4H2/g) || []).length;
  console.log(f + ' -> generic rect icons: ' + genericCount + ', generic pipe icons: ' + pipeGenCount);
});
