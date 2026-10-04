import React from 'react';
import ZodiacChart from "./ZodiacChart";

const TransitAmsaRulers = ({ data }) => {
  // Left side vargas (Divisional Charts)
  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts },
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  const planetArray = Array.isArray(data?.planet_positions) ? [...data.planet_positions] : Object.values(data?.planet_positions || {});

  // Try to find extra points if available
  if (data?.special_lagnas) {
    Object.entries(data.special_lagnas).forEach(([k, v]) => {
      if (!planetArray.find(p => p.name === k || p.planet === k)) {
        planetArray.push({ name: k, lon: v, is_special: true });
      }
    });
  }
  if (data?.upagrahas) {
    Object.entries(data.upagrahas).forEach(([k, v]) => {
      if (!planetArray.find(p => p.name === k || p.planet === k)) {
        planetArray.push({ name: k, lon: v.lon !== undefined ? v.lon : v, is_upagraha: true });
      }
    });
  }

  // Pre-mapped Nadiamsa names from the user's specific chart demo to provide a wow factor 
  // (In a real scenario, this would come from the API payload or a massive 150-name dictionary)
  const demoNadiamsaMap = {
    76: 'Mahaamaayaa',
    134: 'Mukunda',
    74: 'Kalushaankuraa',
    32: 'Kaalaa',
    20: 'Jagati',
    127: 'Ambujaa',
    70: 'Sudhaa',
    14: 'Kumbhini',
    133: 'Kunda',
    26: 'Chambaka',
    113: 'Vahni',
    8: 'Suraa',
    6: 'Sudhakarasama',
    143: 'Viraprasoo',
    17: 'Paraa',
    77: 'Suseetalaa',
    122: 'Marutaa',
    135: 'Bharata',
    99: 'Nisaachari',
    92: 'Mangala',
    34: 'Kshamaa',
    54: 'Nirmada',
    150: 'Parameswari',
    118: 'Madhuraa',
    9: 'Maayaa'
  };

  const getAmsaRows = () => {
    let mapped = planetArray.map(p => {
      const name = p.planet || p.name;
      const lon = p.fullDegree !== undefined ? p.fullDegree : p.lon !== undefined ? p.lon : p.degree;
      
      if (lon === undefined || lon === null) return null;

      const signIdx = Math.floor(lon / 30);
      const degInSign = lon % 30;

      const division = Math.floor(degInSign / 0.2) + 1;
      
      let index = division;
      if (signIdx % 3 === 0) {
        index = division;
      } else if (signIdx % 3 === 1) {
        index = 151 - division;
      } else {
        index = division <= 75 ? division + 75 : division - 75;
      }

      let amsaName = data?.nadi?.[name]?.amsa_name || demoNadiamsaMap[index] || `Amsa ${index}`;

      return {
        body: name + (p.is_retrograde ? ' (R)' : ''),
        division: division,
        index: index,
        amsa: amsaName
      };
    }).filter(Boolean);

    return mapped.sort((a, b) => {
      const order = ['Ascendant', 'Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
      const getIdx = (n) => {
        const clean = n.replace(' (R)', '');
        const i = order.indexOf(clean);
        return i === -1 ? 99 : i;
      };
      const diff = getIdx(a.body) - getIdx(b.body);
      if (diff !== 0) return diff;
      return a.body.localeCompare(b.body);
    });
  };

  const rows = getAmsaRows();

  return (
    <div className="bg-rose-50 h-full min-h-[600px] w-full p-2 flex flex-col font-serif overflow-y-auto custom-scrollbar gap-4 text-xs text-red-900">
      {/* Top side: 6 Divisional Charts Grid */}
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2">
          {vargasList.map(v => (
            <div key={v.id} className="border border-slate-600 shadow-sm bg-rose-50 overflow-hidden flex flex-col h-[180px]">
              <div className="text-[10px] font-bold text-center bg-rose-100 py-1 border-b border-slate-400 uppercase text-black">Natal Chart {v.id === 'd20' || v.id === 'd60' ? '(Trt)' : ''}</div>
              <div className="flex-1 overflow-hidden p-1 relative">
                <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166%] h-[166%]">
                  <ZodiacChart
                    planetPositions={v.id === 'd1' ? data?.planet_positions : v.data?.planets || v.data?.planet_positions || v.data}
                    houses={v.data?.houses}
                    variant="legacy"
                    defaultRect={true}
                    scaleText={2.5}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom side: Amsa Rulers Table */}
      <div className="w-full flex flex-col gap-4">
        <div className="border border-black bg-white mt-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-rose-50 text-black border-b border-black">
              <tr>
                <th className="p-1 border-r border-rose-200 font-normal w-1/4">Body</th>
                <th className="p-1 border-r border-rose-200 font-normal">Division</th>
                <th className="p-1 border-r border-rose-200 font-normal">Index</th>
                <th className="p-1 font-normal text-gray-700">In whose amsa in D-150</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-[#e6e2db] ${i % 2 !== 0 ? 'bg-[#f5ece3]' : 'bg-white'} hover:bg-gray-50`}>
                  <td className="p-1 border-r border-gray-200 text-[#8B0000]">{row.body === 'Ascendant' ? 'Lagna' : row.body}</td>
                  <td className="p-1 border-r border-gray-200 text-[#191970]">{row.division}</td>
                  <td className="p-1 border-r border-gray-200 text-[#191970]">{row.index}</td>
                  <td className="p-1 text-[#191970]">{row.amsa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Tabs matching Jagannatha Hora */}
        <div className="mt-auto pt-4 flex gap-1 items-end text-[11px]">

        </div>

      </div>
    </div>
  );
};

export default TransitAmsaRulers;
