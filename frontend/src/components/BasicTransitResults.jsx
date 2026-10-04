import React from 'react';
import ZodiacChart from "./ZodiacChart";

const BasicTransitResults = ({ data, transitPositions }) => {
  // Left side vargas (Divisional Charts)
  const vargasList = [
    { id: 'd1', label: 'Rasi', data: data?.charts },
    { id: 'd9', label: 'Navamsa', data: data?.vargas?.d9 },
    { id: 'd10', label: 'Dasamsa', data: data?.vargas?.d10 },
    { id: 'd20', label: 'Vimsamsa', data: data?.vargas?.d20 },
    { id: 'd7', label: 'Saptamsa', data: data?.vargas?.d7 },
    { id: 'd60', label: 'Shashtiamsa', data: data?.vargas?.d60 }
  ];

  // Helper functions for astronomical calculations
  const getHouse = (natalRasi, transitRasi) => {
    let h = transitRasi - natalRasi + 1;
    if (h <= 0) h += 12;
    return h;
  };

  const getNakshatraNumber = (lon) => Math.floor(lon / (360 / 27)) + 1;

  const TARA_NAMES = [
    "Janma (Birth)", "Sampat (Wealth)", "Vipat (Danger)",
    "Kshema (Well-being)", "Pratyak (Obstacles)", "Sadhana (Achievement)",
    "Naidhana (Death)", "Mitra (Friend)", "Parama Mitra (Good friend)"
  ];

  const getTara = (natalNak, transitNak) => {
    const diff = (transitNak - natalNak + 27) % 9;
    return TARA_NAMES[diff];
  };

  const getMurthi = (natalMoonRasi, transitMoonRasi) => {
    const h = getHouse(natalMoonRasi, transitMoonRasi);
    if ([1, 6, 11].includes(h)) return "Swarna - golden";
    if ([2, 5, 9].includes(h)) return "Rajata - silver";
    if ([3, 7, 10].includes(h)) return "Taamra - copper";
    if ([4, 8, 12].includes(h)) return "Loha - iron";
    return "-";
  };

  const vedhaTable = {
    'Sun': { good: [3, 6, 10, 11], vedhaMap: { 3: 9, 6: 12, 10: 4, 11: 5 } },
    'Moon': { good: [1, 3, 6, 7, 10, 11], vedhaMap: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 } },
    'Mars': { good: [3, 6, 11], vedhaMap: { 3: 12, 6: 9, 11: 5 } },
    'Mercury': { good: [2, 4, 6, 8, 10, 11], vedhaMap: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 } },
    'Jupiter': { good: [2, 5, 7, 9, 11], vedhaMap: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 } },
    'Venus': { good: [1, 2, 3, 4, 5, 8, 9, 11, 12], vedhaMap: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 } },
    'Saturn': { good: [3, 6, 11], vedhaMap: { 3: 12, 6: 9, 11: 5 } },
    'Rahu': { good: [3, 6, 11], vedhaMap: { 3: 12, 6: 9, 11: 5 } },
    'Ketu': { good: [3, 6, 11], vedhaMap: { 3: 12, 6: 9, 11: 5 } }
  };

  const isVedhaException = (p1, p2) => {
    if ((p1 === 'Sun' && p2 === 'Saturn') || (p1 === 'Saturn' && p2 === 'Sun')) return true;
    if ((p1 === 'Moon' && p2 === 'Mercury') || (p1 === 'Mercury' && p2 === 'Moon')) return true;
    return false;
  };

  const getHouseSuffix = (num) => {
    if (num === 1) return '1st';
    if (num === 2) return '2nd';
    if (num === 3) return '3rd';
    return `${num}th`;
  };

  const getTransitData = () => {
    const defaultData = [
      { planet: 'Sun', tara: 'Vipat (Danger)', murthi: 'Loha - iron', house: '6th (Good)', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Moon', tara: 'Janma (Birth)', murthi: '-', house: '1st (Good)', vedhaFrom: 'Ketu', vedhaTo: '-' },
      { planet: 'Mars', tara: 'Naidhana (Death)', murthi: 'Loha - iron', house: '4th', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Mercury', tara: 'Kshema (Well-being)', murthi: 'Loha - iron', house: '7th', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Jupiter', tara: 'Mitra (Friend)', murthi: 'Rajata - silver', house: '4th', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Venus', tara: 'Pratyak (Obstacles)', murthi: 'Swarna - golden', house: '7th', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Saturn', tara: 'Mitra (Friend)', murthi: 'Loha - iron', house: '12th', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Rahu', tara: 'Kshema (Well-being)', murthi: 'Taamra - copper', house: '11th (Good)', vedhaFrom: '-', vedhaTo: '-' },
      { planet: 'Ketu', tara: 'Parama Mitra (Good friend)', murthi: 'Taamra - copper', house: '5th', vedhaFrom: '-', vedhaTo: 'Moon' }
    ];

    const planetArray = Array.isArray(data?.planet_positions) ? data.planet_positions : Object.values(data?.planet_positions || {});
    const natalMoon = planetArray.find(p => p.planet === 'Moon' || p.name === 'Moon');

    if (!transitPositions || !planetArray.length || !natalMoon) return defaultData;

    const natalMoonRasi = natalMoon.rasi_number || Math.floor(natalMoon.lon / 30) + 1;
    const natalMoonNak = natalMoon.nakshatra_number || getNakshatraNumber(natalMoon.lon);

    const transitPosArray = Array.isArray(transitPositions) ? transitPositions : Object.values(transitPositions);
    const transitMoon = transitPosArray.find(p => p.planet === 'Moon' || p.name === 'Moon');
    const transitMoonRasi = transitMoon ? (transitMoon.rasi_number || Math.floor(transitMoon.lon / 30) + 1) : natalMoonRasi;
    const currentMurthi = getMurthi(natalMoonRasi, transitMoonRasi);

    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    // First pass: collect basic house info for all planets
    const tData = planets.map(p => {
      const tPos = transitPosArray.find(x => x.planet === p || x.name === p);
      if (!tPos) return null;

      const tRasi = tPos.rasi_number || Math.floor(tPos.lon / 30) + 1;
      const tNak = tPos.nakshatra_number || getNakshatraNumber(tPos.lon);
      const houseNum = getHouse(natalMoonRasi, tRasi);

      const vRule = vedhaTable[p];
      const isGood = vRule.good.includes(houseNum);
      const houseStr = `${getHouseSuffix(houseNum)}${isGood ? ' (Good)' : ''}`;

      return {
        planet: p,
        tara: getTara(natalMoonNak, tNak),
        murthi: p === 'Moon' ? '-' : currentMurthi,
        houseNum,
        house: houseStr,
        isGood,
        vedhaFrom: '-',
        vedhaTo: '-'
      };
    }).filter(Boolean);

    if (tData.length < 9) return defaultData;

    // Second pass: Calculate Vedha
    tData.forEach(p1 => {
      if (p1.isGood) {
        const vRule = vedhaTable[p1.planet];
        const vHouse = vRule.vedhaMap[p1.houseNum];

        if (vHouse) {
          // Find if any OTHER planet is in vHouse
          const obstructors = tData.filter(p2 =>
            p2.planet !== p1.planet &&
            p2.houseNum === vHouse &&
            !isVedhaException(p1.planet, p2.planet)
          ).map(p2 => p2.planet);

          if (obstructors.length > 0) {
            p1.vedhaFrom = obstructors.join(', ');
            // Update the obstructing planets' vedhaTo
            obstructors.forEach(obsPlanet => {
              const obsObj = tData.find(x => x.planet === obsPlanet);
              if (obsObj) {
                obsObj.vedhaTo = obsObj.vedhaTo === '-' ? p1.planet : `${obsObj.vedhaTo}, ${p1.planet}`;
              }
            });
          }
        }
      }
    });

    return tData;
  };

  const transitRows = getTransitData();

  // Map real planet positions for the bottom-right table
  const planetArray = Array.isArray(data?.planet_positions) ? data.planet_positions : Object.values(data?.planet_positions || {});
  const bodies = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Maandi', 'Gulika', 'Bhava Lagna'];

  const toDMS = (decimalDegrees) => {
    if (!decimalDegrees) return '-';
    const d = Math.floor(decimalDegrees);
    const m = Math.floor((decimalDegrees - d) * 60);
    const s = Math.round(((decimalDegrees - d) * 60 - m) * 60 * 100) / 100;
    return `${d}° ${m}' ${s.toFixed(2)}"`;
  };

  const getBodyRow = (bodyName) => {
    let searchNames = [bodyName];
    if (bodyName === 'Lagna') searchNames = ['Ascendant', 'Lagna'];

    const info = planetArray.find(p => searchNames.includes(p.planet) || searchNames.includes(p.name));
    if (info) {
      return {
        body: bodyName,
        longitude: toDMS(info.lon),
        nakshatra: info.nakshatra || '-',
        pada: info.pada || '-',
        rasi: info.rasi || '-',
        navamsa: info.navamsa || '-'
      };
    }
    // Fallback Dummy Data if planet not found
    return {
      body: bodyName,
      longitude: '-',
      nakshatra: '-',
      pada: '-',
      rasi: '-',
      navamsa: '-'
    };
  };

  const longitudeRows = bodies.map(getBodyRow);

  return (
    <div className="bg-rose-50 h-full min-h-[600px] w-full p-2 flex flex-row font-serif overflow-hidden gap-2 text-xs text-red-900">
      {/* Left side: 6 Divisional Charts Grid */}
      <div className="w-[30%] lg:w-[35%] xl:w-[45%] flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 border-r-2 border-gray-400">
        <div className="grid grid-cols-2 gap-2">
          {vargasList.map(v => (
            <div key={v.id} className="border border-slate-600 shadow-sm bg-[#e6e2db] overflow-hidden flex flex-col h-[180px]">
              <div className="text-[10px] font-bold text-center bg-[#dcd7d0] py-1 border-b border-slate-400 uppercase text-black">{v.label} ({v.id.toUpperCase()})</div>
              <div className="flex-1 overflow-hidden p-1 relative">
                <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166%] h-[166%]">
                  <ZodiacChart
                    planetPositions={data?.planet_positions}
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

      {/* Right side: Transit Info and Tables */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-4">

        <div className="flex flex-col items-start gap-1">

        </div>

        {/* Top Transit Table */}
        <div className="border border-black bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-rose-50 text-black border-b border-black">
              <tr>
                <th className="p-1 border-r border-gray-300 font-normal">Planet</th>
                <th className="p-1 border-r border-gray-300 font-normal">Tara</th>
                <th className="p-1 border-r border-gray-300 font-normal">Murthi</th>
                <th className="p-1 border-r border-gray-300 font-normal">House</th>
                <th className="p-1 border-r border-gray-300 font-normal">Under vedha from</th>
                <th className="p-1 font-normal">Causing vedha to</th>
              </tr>
            </thead>
            <tbody>
              {transitRows.map((row, i) => (
                <tr key={i} className="border-b border-indigo-50 hover:bg-gray-50">
                  <td className="p-1 border-r border-gray-200 font-bold">{row.planet}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.tara}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.murthi}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.house}</td>
                  <td className="p-1 border-r border-gray-200 text-blue-900">{row.vedhaFrom}</td>
                  <td className="p-1 text-blue-900">{row.vedhaTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm font-bold text-pink-600">
          Reference: <span className="text-blue-600 ml-4">Moon of natal D-1</span>
        </div>

        {/* Bottom Split Section */}
        <div className="flex flex-row gap-4 h-[250px]">
          {/* Bottom Left: Natal Chart Details */}
          <div className="w-[45%] border border-blue-600 bg-white p-2">
            <h4 className="text-blue-800 font-bold text-sm mb-4">Natal Chart:</h4>
            <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
              <span className="text-green-700">Date:</span>
              <span className="text-red-700">
                {data?.basic ? `${data.basic.day}/${data.basic.month}/${data.basic.year}` : "September 29, 2026"}
              </span>

              <span className="text-green-700">Time:</span>
              <span className="text-red-700">
                {data?.basic ? `${String(data.basic.hour).padStart(2, '0')}:${String(data.basic.minute).padStart(2, '0')}:${String(data.basic.second || 0).padStart(2, '0')}` : "11:08:40"}
              </span>

              <span className="text-green-700">Time Zone:</span>
              <span className="text-red-700">
                {data?.meta?.timezone ? `${data.meta.timezone} (East of GMT)` : "5:30:00 (East of GMT)"}
              </span>

              <span className="text-green-700">Place:</span>
              <span className="text-red-700">
                {data?.meta?.location || data?.basic?.place || data?.meta?.city || data?.basic?.birth_place || "Delhi Paharganj, India"}
              </span>

              <span className="text-green-700 mt-2">Lunar Yr-Mo:</span>
              <span className="text-red-700 mt-2">{data?.panchang?.lunar_month_name || "Parabhava - Bhadrapada"}</span>

              <span className="text-green-700">Tithi:</span>
              <span className="text-red-700">{data?.panchang?.tithi?.name || "Krishna Tritiya (Ma) [Nitya]"}</span>

              <span className="text-green-700">Vedic Weekday:</span>
              <span className="text-red-700">{data?.panchang?.vaar || "Tuesday (Ma)"}</span>
            </div>
          </div>

          {/* Bottom Right: Longitude Table */}
          <div className="flex-1 border border-blue-600 bg-white overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#e6e2db] text-black border-b border-gray-400 sticky top-0">
                <tr>
                  <th className="p-1 border-r border-gray-300 font-normal">Body</th>
                  <th className="p-1 border-r border-gray-300 font-normal">Longitude</th>
                  <th className="p-1 border-r border-gray-300 font-normal">Nakshatra</th>
                  <th className="p-1 border-r border-gray-300 font-normal">Pada</th>
                  <th className="p-1 border-r border-gray-300 font-normal">Rasi</th>
                  <th className="p-1 font-normal">Nava...</th>
                </tr>
              </thead>
              <tbody>
                {longitudeRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-1 border-r border-gray-200 text-red-900">{row.body}</td>
                    <td className="p-1 border-r border-gray-200 text-blue-900">{row.longitude}</td>
                    <td className="p-1 border-r border-gray-200 text-blue-900">{row.nakshatra}</td>
                    <td className="p-1 border-r border-gray-200 text-blue-900">{row.pada}</td>
                    <td className="p-1 border-r border-gray-200 text-blue-900">{row.rasi}</td>
                    <td className="p-1 text-blue-900">{row.navamsa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BasicTransitResults;
