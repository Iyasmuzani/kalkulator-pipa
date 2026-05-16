const fs = require('fs');

const icons = {
  pump: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M4 12h16"/></svg>`,
  tank: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M2 8h20"/><path d="M12 4v4"/></svg>`,
  valve: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 12h-4"/><path d="M7 12H3"/><path d="M11 8v8"/><path d="M15 8L9 16"/><path d="M15 16L9 8"/></svg>`,
  pipe: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14h20v4H2z"/><path d="M2 6h20v4H2z"/></svg>`,
  meter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 12l3-3"/><path d="M12 16v.01"/></svg>`,
  generic: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
};

function getIconType(nameCode) {
  let str = nameCode.toLowerCase();
  if (str.includes('pump') || str.includes('pompa')) return 'pump';
  if (str.includes('tank') || str.includes('tangki') || str.includes('reservoir') || str.includes('pond')) return 'tank';
  if (str.includes('valve') || str.includes('katup') || str.includes('prv')) return 'valve';
  if (str.includes('pipe') || str.includes('pipa') || str.includes('transmisi') || str.includes('distribusi')) return 'pipe';
  if (str.includes('meter') || str.includes('gauge')) return 'meter';
  return 'generic';
}

['data-bangunan.js', 'data-distribusi.js', 'data-tambang.js', 'data-siphonic.js'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  let newContent = lines.map(line => {
    if (line.includes('icon:')) {
      let iconMatch = line.match(/icon\s*:\s*'.*?'/);
      let nameMatch = line.match(/name\s*:\s*'(.*?)'/);
      if (iconMatch && nameMatch) {
        let type = getIconType(nameMatch[1]);
        return line.replace(iconMatch[0], "icon: '" + icons[type] + "'");
      }
    }
    return line;
  }).join('\n');
  fs.writeFileSync(file, newContent);
  console.log('Updated ' + file);
});
