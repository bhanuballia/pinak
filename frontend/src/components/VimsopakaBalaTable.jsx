import React from 'react';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_HEADERS = {
  "Sun": "Sun (सू)", "Moon": "Moon (चं)", "Mars": "Mars (मं)", "Mercury": "Mercury (बु)",
  "Jupiter": "Jupiter (गु)", "Venus": "Venus (शु)", "Saturn": "Saturn (शा)", "Rahu": "Rahu (रा)", "Ketu": "Ketu (के)"
};

const ROWS = [
  { key: "shadvarga", hindi: "षड्वर्ग", english: "Shadvarga" },
  { key: "saptavarga", hindi: "सप्तवर्ग", english: "Saptavarga" },
  { key: "dasavarga", hindi: "दशवर्ग", english: "Dashavarga" },
  { key: "shodashvarga", hindi: "षोडशवर्ग", english: "Shodashavarga" }
];

const VimsopakaBalaTable = ({ data }) => {
  const vimsopaka = data?.vimsopaka_bala || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex justify-between items-center">
          <span>Vimsopaka Bala (20-Point Dignity)</span>
          <span className="text-[10px] text-indigo-600 font-black tracking-widest">LAHIRI AYANAMSA</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-4 font-black uppercase text-slate-400 text-[10px]">Varga Category</th>
              {PLANETS.map(p => (
                <th key={p} className="py-3 px-2 font-bold text-slate-600 whitespace-nowrap text-center">
                  {PLANET_HEADERS[p]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-bold text-slate-900">{row.hindi}</div>
                  <div className="text-slate-400 text-[9px] uppercase font-black tracking-widest">{row.english}</div>
                </td>
                {PLANETS.map(p => {
                  const score = vimsopaka[row.key]?.[p] || 0;
                  const isStrong = score >= 15;
                  const isWeak = score < 10;
                  
                  return (
                    <td key={p} className="py-3 px-2 text-center">
                      <div className={`font-mono font-bold text-[14px] ${isStrong ? 'text-emerald-600' : isWeak ? 'text-red-500' : 'text-slate-800'}`}>
                        {typeof score === 'number' ? score.toFixed(2) : score}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VimsopakaBalaTable;
