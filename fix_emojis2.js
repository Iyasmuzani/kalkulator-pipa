const fs = require('fs');

const svgI = (d) => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' + d + '</svg>';

const replacements = [
  ['🔴', svgI('<circle cx="12" cy="12" r="10" fill="#ff4444" stroke="none"/>')],
  ['🟡', svgI('<circle cx="12" cy="12" r="10" fill="#ffaa00" stroke="none"/>')],
  ['🟢', svgI('<circle cx="12" cy="12" r="10" fill="#00ff9d" stroke="none"/>')],
  ['🔵', svgI('<circle cx="12" cy="12" r="10" fill="#4488ff" stroke="none"/>')],
  ['🌡', svgI('<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>')],
  ['💧', svgI('<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>')],
  ['🔄', svgI('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>')],
  ['🌐', svgI('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>')],
  ['🏊', svgI('<path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M14 11l-2-2m0 0l-2 2m2-2v6"/><circle cx="12" cy="5" r="2"/>')],
  ['🔷', svgI('<rect x="3" y="3" width="18" height="18" rx="2" ry="2" transform="rotate(45 12 12)" fill="none"/>')],
  ['🔶', svgI('<rect x="3" y="3" width="18" height="18" rx="2" ry="2" transform="rotate(45 12 12)" fill="none"/>')],
  ['📍', svgI('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')],
  ['✅', svgI('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>')],
  ['❌', svgI('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>')],
  ['⚡', svgI('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>')],
];

function replaceEmojis(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [emoji, svg] of replacements) {
    const regex = new RegExp(emoji.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      count += matches.length;
      content = content.replace(regex, svg);
    }
  }
  fs.writeFileSync(filePath, content);
  console.log(filePath + ' -> ' + count + ' emoji replaced');
}

replaceEmojis('calc-fusion.js');
replaceEmojis('calculators.js');

// Final check
['calc-physics.js', 'calc-fusion.js', 'calculators.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]/gu;
  const found = content.match(emojiPattern);
  if (found) {
    console.log('WARNING: ' + f + ' still has: ' + [...new Set(found)].join(' '));
  } else {
    console.log(f + ' -> ALL CLEAN');
  }
});
