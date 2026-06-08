const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/InteractiveWorksheet.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
const imports = `import { WINDOW_SEQUENCE, getWindowIndexById } from '../utils/windowSequence';\nimport { openAstroWindow } from '../hooks/useWindowNavigation';\n`;
content = content.replace('import React, { useState, useEffect } from "react";\n', 'import React, { useState, useEffect } from "react";\n' + imports);

// 2. Modify handleMaximizeInNewWindow
const maximizeRegex = /const handleMaximizeInNewWindow = \(id\) => \{[\s\S]*?window\.open\([^)]+\);\n  \};/;
const newMaximize = `const handleMaximizeInNewWindow = (id) => {
    const winConfig = WINDOW_SEQUENCE.find(w => w.id === id);
    if (winConfig) {
      openAstroWindow(winConfig, data);
      return;
    }
    const oracleIds = [
      'ascendant', 'study', 'career', 'marriage', 'finance', 'business', 'health',
      'parents_health', 'spouse_health', 'children_health', 'mental_peace',
      'home_peace', 'manglik', 'kalsarp', 'pitra', 'sadesati', 'rahu', 'ketu', 'loshu',
      'lalkitab', 'daily_panchang', 'horary', 'chakra', 'yantra'
    ];
    if (oracleIds.includes(id)) {
      handleOracleClick(id);
      return;
    }
    localStorage.setItem('worksheetData', JSON.stringify(data));
    window.open(\`/?worksheet=true&fullScreen=\${id}\`, \`Full_\${id}_\${Date.now()}\`, 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no');
  };`;
content = content.replace(maximizeRegex, newMaximize);

// 3. Modify handleOracleClick
const oracleRegex = /const handleOracleClick = \(id\) => \{/;
const newOracle = `const handleOracleClick = (id) => {
    const winConfig = WINDOW_SEQUENCE.find(w => w.id === id);
    if (winConfig) {
      openAstroWindow(winConfig, data);
      return;
    }`;
content = content.replace(oracleRegex, newOracle);

// 4. Update hardcoded top buttons
const topButtons = [
  { id: 'transit_compare', label: '🔄 Compare Transit', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-amber-500.*?">[\s\S]*?Compare Transit/ },
  { id: 'solar_return', label: '☀️ SOLAR RETURN', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-amber-400.*?">[\s\S]*?SOLAR RETURN/ },
  { id: 'daily_solar', label: '🌞 DAILY SOLAR', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-yellow-300.*?">[\s\S]*?DAILY SOLAR/ },
  { id: 'annual_varshaphala', label: '🌍 ANNUAL VARSHAPHALA', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-cyan-400.*?">[\s\S]*?ANNUAL VARSHAPHALA/ },
  { id: 'advanced_nakshatra', label: '🌌 ADVANCED NAKSHATRA', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-indigo-500.*?">[\s\S]*?ADVANCED NAKSHATRA/ },
  { id: 'animated_transits', label: '🔄 ANIMATED TRANSITS', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-pink-600.*?">[\s\S]*?ANIMATED TRANSITS/ },
  { id: 'navamsha_ages', label: '🔢 NAVAMSHA AGES', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-emerald-500.*?">[\s\S]*?NAVAMSHA AGES/ },
  { id: 'kp_chart', label: '🔮 KP CHART', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-purple-600.*?">[\s\S]*?KP CHART/ },
  { id: 'sunrise_chart', label: '🌅 SUNRISE CHART', match: /onClick=\{.*?\}\s*className="bg-gradient-to-r from-amber-500.*?">[\s\S]*?SUNRISE CHART/ },
  { id: 'classic_view', label: '📜 CLASSIC VIEW', match: /onClick=\{[\s\S]*?\}\s*className="bg-purple-600 hover:bg-purple-700.*?">[\s\S]*?CLASSIC VIEW/ }
];

topButtons.forEach(btn => {
  content = content.replace(btn.match, (match) => {
    // Replace onClick
    let replaced = match.replace(/onClick=\{.*?\}/s, `onClick={() => openAstroWindow(WINDOW_SEQUENCE.find(w => w.id === '${btn.id}'), data)}`);
    // Replace the label inside the button tag
    // Since the label is at the end of the match string (we matched up to the label text),
    // we just replace the exact text with the numbered text
    replaced = replaced.replace(btn.label.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), `{getWindowIndexById('${btn.id}') + 1}. ${btn.label}`);
    // Wait, the match text in regex has newlines and spaces, so standard replace works on the last part
    // Let's just do a specific string replace for the label inside the `replaced` string
    return replaced;
  });
});

// 5. Update CELL_CONTENTS buttons (the dynamic ones)
// Currently: {c.label.split(' - ')[0]}
content = content.replace(
  /\{c\.label\.split\(' - '\)\[0\]\}/g,
  `{getWindowIndexById(c.id) > -1 ? \`\${getWindowIndexById(c.id) + 1}. \${c.label.split(' - ')[0]}\` : c.label.split(' - ')[0]}`
);

// 6. Update oracle_items buttons
// Currently: <span className="text-[8px] font-black uppercase text-white/60 group-hover:text-amber-400 whitespace-nowrap">{item.label}</span>
content = content.replace(
  /<span className="text-\[8px\] font-black uppercase text-white\/60 group-hover:text-amber-400 whitespace-nowrap">\{item\.label\}<\/span>/g,
  `<span className="text-[8px] font-black uppercase text-white/60 group-hover:text-amber-400 whitespace-nowrap">{getWindowIndexById(item.id) > -1 ? \`\${getWindowIndexById(item.id) + 1}. \${item.label}\` : item.label}</span>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated InteractiveWorksheet.jsx');
