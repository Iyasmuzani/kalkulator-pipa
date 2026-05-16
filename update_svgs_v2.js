const fs = require('fs');

const createSvg = (path) => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';

const iconDict = {
  // TANKS & RESERVOIRS (database / cylinder)
  'GWT-01': createSvg('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>'),
  'GRT-01': createSvg('<path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M12 4v4"/>'),
  'PTK-01': createSvg('<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>'),
  'RSV-01': createSvg('<path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M8 18v-6"/>'),
  'SPD-01': createSvg('<path d="M2 12h20"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M12 16v.01"/>'),
  
  // PUMPS (fan / motor)
  'PWP-01': createSvg('<circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M4 12h16"/>'),
  'BPS-01': createSvg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  'DWP-01': createSvg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/><path d="M8 12h8"/>'), // Note: downpipe has same code, will fix in script loop based on name
  'SLP-01': createSvg('<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),

  // VALVES (sliders / switches)
  'PRV-01': createSvg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>'),
  'GTV-01': createSvg('<path d="M17 12h-4"/><path d="M7 12H3"/><path d="M11 8v8"/><path d="M15 8L9 16"/><path d="M15 16L9 8"/>'),
  'CKV-01': createSvg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  'GVN-01': createSvg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  'AVV-01': createSvg('<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>'),
  'PRN-01': createSvg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  'BFV-01': createSvg('<path d="M20.2 7.8l-7.7 7.7"/><path d="M6.8 11l6.4-6.4a2.2 2.2 0 0 1 3.1 3.1l-6.4 6.4a2.2 2.2 0 0 1-3.1-3.1z"/>'),
  'KGV-01': createSvg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),

  // METERS & GAUGES
  'PGG-01': createSvg('<circle cx="12" cy="12" r="10"/><path d="M12 12l4-4"/><path d="M12 18h.01"/><path d="M8 12h.01"/><path d="M16 12h.01"/>'),
  'WMT-01': createSvg('<circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/>'),
  'WMI-01': createSvg('<rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="16" y1="10" x2="16" y2="14"/>'),
  'FLM-01': createSvg('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="M8 16l4 4 4-4"/>'),

  // DRAINS / OUTLETS
  'FDR-01': createSvg('<circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12l4 4 4-4"/>'),
  'SRO-01': createSvg('<path d="M3 15h18"/><path d="M12 15v6"/><path d="M8 21h8"/><path d="M12 3v6"/><path d="M9 6h6"/>'), // specific roof outlet

  // PIPES
  'PTH-01': createSvg('<path d="M2 14h20v4H2z"/><path d="M2 6h20v4H2z"/><path d="M12 10v4"/>'),
  'PDV-01': createSvg('<path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-5 5"/>'),
  'HPL-01': createSvg('<rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="18"/>'),
  'STP-01': createSvg('<path d="M2 10h20v4H2z"/><path d="M6 10L4 14"/><path d="M10 10L8 14"/><path d="M14 10l-2 4"/><path d="M18 10l-2 4"/>'),
  'PIP-SF': createSvg('<path d="M12 3v18"/><path d="M16 3v18"/><path d="M8 3v18"/>'), // multiple pipes

  // MISC
  'ITK-01': createSvg('<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>'),
  'HYD-01': createSvg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.2-.6-3.8-2.6-3.8-5C7.2 4.6 9 2.4 12 2c2.8-.4 5.2 1.6 5.8 4.2.2.8.2 1.6 0 2.4"/><path d="M12 22v-6"/>'),
  'EXJ-01': createSvg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  'WLR-01': createSvg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  'AVP-01': createSvg('<path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>'), // vortex/hurricane
  'CLP-01': createSvg('<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>'), // arrow-right
  'TRF-01': createSvg('<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>'), // git-merge
  'CLB-01': createSvg('<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>'), // paperclip
  'OVF-01': createSvg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'), // alert-triangle
  'DSC-01': createSvg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>') // log-out
};

const genericSvg = createSvg('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>');

function updateIconsInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\\n');
  let newContent = lines.map(line => {
    if (line.includes('icon:')) {
      let iconMatch = line.match(/icon\\s*:\\s*'.*?'/);
      let codeMatch = line.match(/code\\s*:\\s*'([^']+)'/);
      let nameMatch = line.match(/name\\s*:\\s*'([^']+)'/);
      
      if (iconMatch && codeMatch) {
        let code = codeMatch[1];
        let name = nameMatch ? nameMatch[1] : '';
        let svg = iconDict[code];
        
        // Handle DWP-01 clash (Pompa Dewatering vs Downpipe)
        if (code === 'DWP-01') {
          if (name.includes('Downpipe')) {
             svg = createSvg('<path d="M7 7l10 10"/><path d="M17 7v10H7"/>'); // arrow-down-right
          } else {
             svg = iconDict['DWP-01']; // pump
          }
        }
        
        // Handle TPP-01 (Tail Pipe)
        if (code === 'TPP-01') {
          svg = createSvg('<path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/>'); // arrow-down
        }

        if (!svg) svg = genericSvg;

        return line.replace(iconMatch[0], "icon: '" + svg + "'");
      }
    }
    return line;
  }).join('\\n');
  fs.writeFileSync(file, newContent);
  console.log('Updated ' + file);
}

['data-bangunan.js', 'data-distribusi.js', 'data-tambang.js', 'data-siphonic.js'].forEach(updateIconsInFile);
