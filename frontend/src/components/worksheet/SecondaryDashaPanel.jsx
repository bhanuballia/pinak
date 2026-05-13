import React from 'react';

const SecondaryDashaPanel = ({ data, type }) => {
  const list = data?.[type] || [];
  const title = type === 'shodashottari' ? 'Shodashottari' : 'Chaturshitisama';
  const totalYears = type === 'shodashottari' ? 116 : 84;

  if (!list.length) {
    return (
      <div className="flex flex-col h-full bg-white font-serif">
        <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-teal-100 to-white border-teal-200 text-teal-900 font-serif font-black text-[9px] uppercase italic tracking-widest">
          ⏳ {title} Dasha
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">⏳</span>
          <p className="text-[10px] text-gray-400 italic">{title} Dasha data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load this dasha ({totalYears}-year cycle).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white font-serif">
      <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-teal-100 to-white border-teal-200 text-teal-900 font-serif font-black text-[9px] uppercase italic tracking-widest">
        ⏳ {title} Dasha
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <tbody>
            {list.map((d, i) => (
              <tr key={i} className="border-b border-gray-50 text-[9px]">
                <td className="p-1 px-2 font-bold text-gray-700">{d.lord}</td>
                <td className="p-1 text-gray-400 font-mono italic">{(d.start ?? 0).toFixed(1)}y - {(d.end ?? 0).toFixed(1)}y</td>
                <td className="p-1 text-right text-teal-600 font-bold px-2">{d.duration}y</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecondaryDashaPanel;
