const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'frontend', 'src', 'components', 'InteractiveWorksheet.jsx');
let content = fs.readFileSync(filepath, 'utf8');

const pattern = /colorClass=\{statusKey === 'positive' \? 'text-green-800' : statusKey === 'negative' \? 'text-red-800' : 'text-blue-800'\}/g;
const replacement = 'colorClass="text-slate-900"';

const newContent = content.replace(pattern, replacement);
fs.writeFileSync(filepath, newContent, 'utf8');
console.log('Done');
