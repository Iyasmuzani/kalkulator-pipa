const fs = require('fs');

// Define inline SVG icons to replace emojis in calculators & engineering tools
// Each maps: emoji -> inline SVG (small, for use inside text)
const svgI = (d) => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px">' + d + '</svg>';

const replacements = [
  // calc-physics.js
  ['📉', svgI('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>')],           // Pressure Loss -> activity line
  ['🌊', svgI('<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>')],  // Buoyancy -> waves
  ['💥', svgI('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>')],      // Water Hammer -> zap
  ['🔧', svgI('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>')],  // Friction/Wrench
  ['⚖️', svgI('<path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>')],  // Pipe Load -> scale
  ['📐', svgI('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>')],  // Deflection -> hexagon
  ['🌧️', svgI('<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>')],  // Rainfall -> cloud-rain
  ['💪', svgI('<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 8h2"/><path d="M9 12h2"/>')],  // Tensile -> bicep/strength
  ['📊', svgI('<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>')],  // Chart -> bar-chart
  ['📋', svgI('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>')],  // Clipboard
  ['🔗', svgI('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>')],  // Fusion -> link
  ['🛡️', svgI('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>')],  // Shield
  ['📌', svgI('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')],  // Map-pin
  ['⚠️', svgI('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>')],  // Alert triangle
  ['💡', svgI('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>')],  // Lightbulb
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

replaceEmojis('calc-physics.js');
replaceEmojis('calc-fusion.js');
replaceEmojis('calculators.js');

// Final verification - any remaining emojis?
['calc-physics.js', 'calc-fusion.js', 'calculators.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Check for common emojis
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]/gu;
  const found = content.match(emojiPattern);
  if (found) {
    console.log('WARNING: ' + f + ' still has emojis: ' + [...new Set(found)].join(' '));
  } else {
    console.log(f + ' -> CLEAN (no emojis)');
  }
});
