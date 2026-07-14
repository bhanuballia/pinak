const fullData = [
  { d: "Aries", start: 0, duration: 10, date: "Sat 01-01-2000" },
  { d: "Taurus", start: 10, duration: 10, date: "Sat 01-01-2010" }
];

const generateSubPeriods = (parentItem, fullData) => {
    const level1Data = fullData.filter(item => !item.d.includes('-'));
    const totalDuration = level1Data.reduce((sum, item) => sum + item.duration, 0) || 120;
    
    let currentStart = parentItem.start;
    const parentDur = parentItem.duration;
    const subPeriods = [];
    
    let startIdx = level1Data.findIndex(item => item.d === parentItem.d.split('-').pop());
    if (startIdx === -1) startIdx = 0;
    
    for (let i = 0; i < level1Data.length; i++) {
        const childBase = level1Data[(startIdx + i) % level1Data.length];
        const childDur = (childBase.duration / totalDuration) * parentDur;
        
        let dateStr = parentItem.date;
        if (parentItem.date_iso) {
            const dt = new Date(parentItem.date_iso);
            dt.setDate(dt.getDate() + (currentStart - parentItem.start) * 365.2425);
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const pad = (n) => n.toString().padStart(2, '0');
            dateStr = `${days[dt.getDay()]} \u00A0\u00A0 ${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${dt.getFullYear()}`;
        }
        
        subPeriods.push({
            d: `${parentItem.d}-${childBase.d}`,
            start: currentStart,
            duration: childDur,
            date: dateStr,
            date_iso: parentItem.date_iso
        });
        
        currentStart += childDur;
    }
    return subPeriods;
};

const parent = fullData[0];
console.log(generateSubPeriods(parent, fullData));
