import React from 'react';

const YOGINI_COLORS = {
  Mangala: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', planet: 'Mo' },
  Pingala: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', planet: 'Su' },
  Dhanya: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', planet: 'Ju' },
  Bhramari: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', planet: 'Ma' },
  Bhadrika: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', planet: 'Me' },
  Ulka: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', planet: 'Sa' },
  Siddha: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', planet: 'Ve' },
  Sankata: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', planet: 'Ra' },
};

const jdToDateString = (jd) => {
  if (!jd) return '';
  const millis = (jd - 2440587.5) * 86400000;
  const d = new Date(millis);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
};

const getAgeString = (jd, birthJd) => {
  if (!jd || !birthJd) return '';
  const diffDays = jd - birthJd;
  if (diffDays < 0) return '0 yrs';
  
  const totalMonths = Math.round(diffDays / 30.436875);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0 && months === 0) return '0 yrs';
  if (years === 0) return `${months}m`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}m`;
};

const YoginiTable = ({ data }) => {
  if (!data || !data.yogini || !Array.isArray(data.yogini) || data.yogini.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
        <div className="animate-pulse">Calculating Yogini Dasha...</div>
      </div>
    );
  }

  // We are calculating 108 years (3 cycles). Let's group them or just show the first 36 years.
  // The screenshot shows "First Cycle (36 Years)". Let's allow rendering all but separated by cycle.

  // Create a grouped array of cycles (each cycle is 8 mahadashas)
  const cycles = [];
  for (let i = 0; i < data.yogini.length; i += 8) {
    cycles.push(data.yogini.slice(i, i + 8));
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">

      {cycles.map((cycle, cycleIdx) => (
        <div key={`cycle-${cycleIdx}`} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <span className="w-10 h-10 md:w-12 md:h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-sm border border-red-200">ॐ</span>
              Yogini Mahadasha
            </h2>
            <p className="text-sm md:text-base text-indigo-600 font-semibold tracking-wide uppercase">Cycle {cycleIdx + 1}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
            {cycle.map((maha, idx) => {
              const colors = YOGINI_COLORS[maha.lord] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

              return (
                <div key={`maha-${cycleIdx}-${idx}`} className={`rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white group`}>
                  <div className={`${colors.bg} px-4 py-3 border-b border-gray-100 flex flex-col relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-10 -mt-10 opacity-20 bg-current ${colors.text} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                    <h3 className={`text-lg md:text-xl font-bold ${colors.text} flex justify-between items-center relative z-10`}>
                      <span>{maha.lord} <span className="text-sm font-medium opacity-75 ml-1">({colors.planet})</span></span>
                      <span className="text-[18px] font-semibold bg-white/70 text-black px-2 py-1 rounded-md shadow-sm border border-white">{maha.duration_years}y</span>
                    </h3>
                    <div className="text-[13px] text-black/70 font-semibold mt-0.5 relative z-10">
                      Age: {getAgeString(maha.start_jd, data.jd_ut)} <span className="mx-1 opacity-50">→</span> {getAgeString(maha.end_jd, data.jd_ut)}
                    </div>
                    <div className="text-[16px] text-black mt-1 font-mono relative z-10">
                      {jdToDateString(maha.start_jd)} <span className="text-black mx-1">→</span> {jdToDateString(maha.end_jd)}
                    </div>
                  </div>

                  <div className="bg-white p-1">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50/50 text-black">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider">Antar</th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider">Beginning</th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider">Ending</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maha.antardashas?.map((antar, aidx) => {
                          const antarColors = YOGINI_COLORS[antar.lord] || { text: 'text-black', planet: '' };
                          return (
                            <tr key={`antar-${cycleIdx}-${aidx}`} className="hover:bg-indigo-50/50 transition-colors border-b border-gray-50 last:border-0">
                              <td className="px-3 py-1.5 font-medium whitespace-nowrap">
                                <span className="text-black mr-1 text-[14px]">{antar.lord.substring(0, 4)}</span>
                                <span className={`${antarColors.text} text-[13px] font-semibold`}>{antarColors.planet}</span>
                              </td>
                              <td className="px-3 py-1.5 text-black font-mono text-[14px]">{jdToDateString(antar.start_jd)}</td>
                              <td className="px-3 py-1.5 text-black font-mono text-[14px]">{jdToDateString(antar.end_jd)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YoginiTable;
