const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/InteractiveWorksheet.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /\/\/ Keyboard navigation for toggling views\s+useEffect\(\(\) => \{[\s\S]*?return \(\) => window\.removeEventListener\('keydown', handleKeyDown\);\s+\}, \[\]\);/;

if (regex.test(content)) {
    content = content.replace(regex, '// Legacy keyboard navigation removed');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Legacy listener removed successfully.');
} else {
    console.log('Could not find the listener block.');
}
