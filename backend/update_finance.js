const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/FinanceViewer.jsx', 'utf8');

content = content.replace(
    /const \[isLightMode, setIsLightMode\] = useState\(false\);/,
    `const [isLightMode, setIsLightMode] = useState(false);

    const theme = {
        bg: isLightMode ? '#f8fafc' : '#020617',
        text: isLightMode ? '#334155' : '#cbd5e1',
        heading: isLightMode ? '#0f172a' : 'white',
        headerGradient: isLightMode ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' : 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        cardBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
        cardGeneralBg: isLightMode ? 'rgba(255, 255, 255, 1)' : 'rgba(15, 23, 42, 0.6)',
        filterBg: isLightMode ? 'rgba(248, 250, 252, 0.8)' : 'rgba(2, 6, 23, 0.8)',
        borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)',
        buttonBg: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        filterInactiveText: isLightMode ? '#475569' : '#94a3b8',
        accentText: isLightMode ? '#b45309' : '#d4af37'
    };`
);

content = content.replace(/backgroundColor: isLightMode \? '#f8fafc' : '#020617'/g, `backgroundColor: theme.bg`);
content = content.replace(/color: isLightMode \? '#b45309' : '#d4af37'/g, `color: theme.accentText`);
content = content.replace(/color: isLightMode \? '#334155' : '#cbd5e1'/g, `color: theme.text`);
content = content.replace(/background: isLightMode \? 'linear-gradient\\(135deg, #f1f5f9 0%, #e2e8f0 100%\\)' : 'linear-gradient\\(135deg, #0f172a 0%, #020617 100%\\)'/g, `background: theme.headerGradient`);
content = content.replace(/color: isLightMode \? '#0f172a' : 'white'/g, `color: theme.heading`);
content = content.replace(/backgroundColor: isLightMode \? 'rgba\\(248, 250, 252, 0\\.8\\)' : 'rgba\\(2, 6, 23, 0\\.8\\)'/g, `backgroundColor: theme.filterBg`);
content = content.replace(/background: filter === cat \? \\(isLightMode \? '#b45309' : '#d4af37'\\) : \\(isLightMode \? 'rgba\\(0,0,0,0\\.05\\)' : 'rgba\\(255,255,255,0\\.05\\'\\)'/g, `background: filter === cat ? theme.accentText : theme.buttonBg`);
content = content.replace(/color: filter === cat \? \\(isLightMode \? '#ffffff' : '#020617'\\) : \\(isLightMode \? '#475569' : '#94a3b8'\\)/g, `color: filter === cat ? (isLightMode ? '#ffffff' : '#020617') : theme.filterInactiveText`);
content = content.replace(/border: filter === cat \? 'none' : \\(isLightMode \? '1px solid rgba\\(0,0,0,0\\.1\\)' : '1px solid rgba\\(255,255,255,0\\.1\\'\\)'/g, `border: filter === cat ? 'none' : \`1px solid \${theme.borderColor}\``);
content = content.replace(/color: isLightMode \? '#475569' : '#94a3b8'/g, `color: theme.filterInactiveText`);
content = content.replace(/color: isLightMode \? '#475569' : '#64748b'/g, `color: theme.filterInactiveText`);
content = content.replace(/background: isLightMode \? 'rgba\\(255,255,255,0\\.8\\)' : 'rgba\\(30,41,59,0\\.4\\)'/g, `background: theme.cardBg`);
content = content.replace(/boxShadow: isLightMode \? '0 10px 30px rgba\\(0,0,0,0\\.1\\)' : '0 20px 50px rgba\\(0,0,0,0\\.3\\)'/g, `boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'`);
content = content.replace(/background: isLightMode \? 'rgba\\(255, 255, 255, 1\\)' : 'rgba\\(15, 23, 42, 0\\.6\\)'/g, `background: theme.cardGeneralBg`);
content = content.replace(/border: isLightMode \? '1px solid rgba\\(0,0,0,0\\.05\\)' : '1px solid rgba\\(255,255,255,0\\.05\\)'/g, `border: \`1px solid \${theme.borderColor}\``);
content = content.replace(/borderBottom: isLightMode \? '1px solid rgba\\(0,0,0,0\\.1\\)' : '1px solid rgba\\(212, 175, 55, 0\\.1\\)'/g, `borderBottom: \`1px solid \${theme.borderColor}\``);

fs.writeFileSync('frontend/src/components/FinanceViewer.jsx', content);
