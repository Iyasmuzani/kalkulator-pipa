const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

// Map category keys to folder names
const catFolderMap = {
  'HDPE': 'hdpe',
  'PVC (': 'pvc',
  'PVC-O': 'pvc-o',
  'PPR': 'ppr',
  'Standar Sistem': 'sistem'
};

// For each item, add a pdf field based on sanitized std name
// Pattern: { std: 'XXX', title: ... -> { std: 'XXX', pdf: 'standards/folder/xxx.pdf', title: ...
// We need to determine which category each item belongs to

// Strategy: find all items and their category context
let currentFolder = '';
const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect category
  for (const [key, folder] of Object.entries(catFolderMap)) {
    if (line.includes("'" + key) && line.includes(':')) {
      currentFolder = folder;
    }
  }
  
  // Add pdf field to items
  const match = line.match(/\{\s*std:\s*'([^']+)',\s*title:/);
  if (match && currentFolder) {
    const stdName = match[1];
    // Sanitize: replace special chars with underscore, lowercase
    const pdfName = stdName
      .replace(/[/:+()]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
    const pdfPath = 'standards/' + currentFolder + '/' + pdfName + '.pdf';
    
    // Insert pdf field after std field
    const newLine = line.replace(
      "std: '" + stdName + "', title:",
      "std: '" + stdName + "', pdf: '" + pdfPath + "', title:"
    );
    newLines.push(newLine);
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync('script.js', newLines.join('\n'));
console.log('Added pdf fields to all standard items');

// Verify
const updated = fs.readFileSync('script.js', 'utf8');
const pdfCount = (updated.match(/pdf: 'standards\//g) || []).length;
console.log('Total pdf fields added: ' + pdfCount);
