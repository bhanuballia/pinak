import React from 'react';
import ZodiacChart from "./ZodiacChart";

const TransitHousesResults = ({ data }) => {
  // Left side vargas (Divisional Charts)
  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts },
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  const toDMS = (decimalDegrees) => {
    if (decimalDegrees === undefined || decimalDegrees === null) return '-';
    let deg = decimalDegrees;
    while (deg < 0) deg += 360;
    deg = deg % 360;

    const signs = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
    const signIdx = Math.floor(deg / 30);
    const signName = signs[signIdx];

    const remainingDeg = deg % 30;
    const d = Math.floor(remainingDeg);
    const m = Math.floor((remainingDeg - d) * 60);
    const s = Math.round(((remainingDeg - d) * 60 - m) * 60 * 100) / 100;

    return `${d} ${signName} ${String(m).padStart(2, '0')}' ${s.toFixed(2)}"`;
  };

  const planetArray = Array.isArray(data?.planet_positions) ? data.planet_positions : Object.values(data?.planet_positions || {});

  // Calculate House Table Data
  const getHouseRows = () => {
    const defaultRows = Array.from({ length: 12 }, (_, i) => ({
      house: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}`,
      start: '-',
      cusp: '-',
      end: '-',
      planets: '-'
    }));

    const housesObj = data?.charts?.houses || data?.kp_data?.houses;
    
    // Find Ascendant sign
    const asc = planetArray.find(p => p.planet === 'Ascendant' || p.name === 'Ascendant');
    const ascSignIdx = asc && asc.lon !== undefined ? Math.floor(asc.lon / 30) : 0;
    
    // Convert to 1-indexed object if it's a 0-indexed array
    let normalizedHouses = {};
    if (housesObj) {
      if (Array.isArray(housesObj)) {
        if (housesObj.length === 12) {
          housesObj.forEach((h, idx) => {
            normalizedHouses[idx + 1] = h;
          });
        } else {
          normalizedHouses = housesObj;
        }
      } else {
        normalizedHouses = housesObj;
      }
    }

    const rows = [];
    for (let i = 1; i <= 12; i++) {
      const hData = normalizedHouses[i] || normalizedHouses[String(i)] || {};
      
      let cuspDeg = hData.cusp_deg;
      let startDeg = hData.start_deg;
      let endDeg = hData.end_deg;

      // Fallback to Whole Sign houses if no explicit house data
      if (cuspDeg === undefined && startDeg === undefined && endDeg === undefined) {
        const hSignIdx = (ascSignIdx + i - 1) % 12;
        startDeg = hSignIdx * 30;
        cuspDeg = startDeg + 15;
        endDeg = startDeg + 30;
        if (endDeg === 360) endDeg = 0;
      }
      
      // Calculate Sripati midpoints if only cusp is provided
      if (startDeg === undefined && cuspDeg !== undefined) {
        const prevH = i === 1 ? 12 : i - 1;
        const prevCusp = (normalizedHouses[prevH] || normalizedHouses[String(prevH)])?.cusp_deg;
        if (prevCusp !== undefined) {
          let diff = cuspDeg - prevCusp;
          if (diff < 0) diff += 360;
          startDeg = prevCusp + (diff / 2);
          if (startDeg >= 360) startDeg -= 360;
        } else {
          startDeg = cuspDeg - 15;
          if (startDeg < 0) startDeg += 360;
        }
      }
      
      if (endDeg === undefined && cuspDeg !== undefined) {
        const nextH = i === 12 ? 1 : i + 1;
        const nextCusp = (normalizedHouses[nextH] || normalizedHouses[String(nextH)])?.cusp_deg;
        if (nextCusp !== undefined) {
          let diff = nextCusp - cuspDeg;
          if (diff < 0) diff += 360;
          endDeg = cuspDeg + (diff / 2);
          if (endDeg >= 360) endDeg -= 360;
        } else {
          endDeg = cuspDeg + 15;
          if (endDeg >= 360) endDeg -= 360;
        }
      }

      // Find planets in this house (from startDeg to endDeg)
      const planetsInHouse = planetArray.filter(p => {
        // Exclude specific invisible points if needed, but include outer planets and standard 9
        if (['Ascendant', 'Lagna', 'Maandi', 'Gulika', 'Bhava Lagna', 'Hora Lagna', 'Ghati Lagna'].includes(p.planet || p.name)) return false;

        const plon = p.fullDegree !== undefined ? p.fullDegree : p.lon !== undefined ? p.lon : p.degree;
        if (plon === undefined || plon === null) return false;
        
        if (startDeg !== undefined && endDeg !== undefined) {
          if (startDeg < endDeg) {
            return plon >= startDeg && plon <= endDeg;
          } else {
            // crosses 360
            return plon >= startDeg || plon <= endDeg;
          }
        }
        return false;
      }).map(p => {
        const n = p.planet || p.name;
        // Map names to short abbreviations like Jagannatha Hora
        const abbrevMap = {
          'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
          'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
          'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
        };
        return abbrevMap[n] || n.substring(0, 2);
      });

      // Also include Ascendant in the first house manually if it's there
      if (i === 1) {
        planetsInHouse.unshift('As');
      }

      rows.push({
        house: `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'}`,
        start: startDeg !== undefined ? toDMS(startDeg) : '-',
        cusp: cuspDeg !== undefined ? toDMS(cuspDeg) : '-',
        end: endDeg !== undefined ? toDMS(endDeg) : '-',
        planets: planetsInHouse.join(', ')
      });
    }

    return rows.length === 12 ? rows : defaultRows;
  };

  const houseRows = getHouseRows();

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

      {/* Bottom side: Houses Table */}
      <div className="w-full flex flex-col gap-4">

        <div className="border border-black bg-white mt-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-rose-50 text-black border-b border-black">
              <tr>
                <th className="p-1 border-r border-rose-200 font-normal w-12">House</th>
                <th className="p-1 border-r border-rose-200 font-normal">Start</th>
                <th className="p-1 border-r border-rose-200 font-normal">Cusp</th>
                <th className="p-1 border-r border-rose-200 font-normal">End</th>
                <th className="p-1 font-normal text-gray-700">Planets in it</th>
              </tr>
            </thead>
            <tbody>
              {houseRows.map((row, i) => (
                <tr key={i} className="border-b border-indigo-50 hover:bg-gray-50">
                  <td className="p-1 border-r border-gray-200 text-red-900 font-bold">{row.house}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.start}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.cusp}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.end}</td>
                  <td className="p-1 text-blue-900 font-semibold">{row.planets}</td>
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

export default TransitHousesResults;
