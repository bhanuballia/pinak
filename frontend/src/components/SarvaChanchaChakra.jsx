import React, { useState } from 'react';

// Target Rings (Outer to Inner as per description)
const TARGET_RINGS = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Ascendant'
];

// Kakshya Rulers (Outer to Inner sub-divisions)
const KAKSHYA_RULERS = [
  'Saturn',
  'Jupiter',
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
  'Ascendant'
];

const PLANET_COLORS = {
  'Sun': 'text-orange-600',
  'Moon': 'text-blue-500',
  'Mars': 'text-red-600',
  'Mercury': 'text-green-600',
  'Jupiter': 'text-yellow-600',
  'Venus': 'text-pink-500',
  'Saturn': 'text-purple-600',
  'Ascendant': 'text-indigo-600'
};

const SIGN_NAMES = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
];

const SarvaChanchaChakra = ({ avData, stacked = false, hideChart = false, onlyChart = false, onlyTable = false }) => {
  const [selectedPlanet, setSelectedPlanet] = useState('Sun');

  if (!avData || !avData.bhinna_breakdown) {
    return <div className="p-4 text-center text-gray-500">No data available for Sarva Chancha Chakra</div>;
  }

  // Chakra dimensions
  const cx = 500;
  const cy = 500;
  const signRadius = 80;
  const innerRingWidth = 20;
  const midRadius = signRadius + 8 * innerRingWidth; // 240
  const outerRingWidth = 25;
  const maxRadius = midRadius + 8 * outerRingWidth; // 440
  const labelRadius = maxRadius + 15; // 455

  const getPoint = (radius, angleDeg) => {
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad)
    };
  };

  const drawChakra = () => {
    const elements = [];
    const breakdown = avData.bhinna_breakdown;

    // Background circle
    elements.push(<circle key="bg" cx={cx} cy={cy} r={maxRadius} fill="#fffdf0" stroke="#333" strokeWidth="2" />);

    // Concentric rings
    // Inner rings (BAV totals)
    for (let i = 0; i <= 8; i++) {
      elements.push(<circle key={`ir-${i}`} cx={cx} cy={cy} r={signRadius + i * innerRingWidth} fill="none" stroke="#666" strokeWidth="1" />);
    }
    // Outer rings (Kakshyas)
    for (let i = 1; i <= 8; i++) {
      elements.push(<circle key={`or-${i}`} cx={cx} cy={cy} r={midRadius + i * outerRingWidth} fill="none" stroke="#333" strokeWidth={i === 8 ? 2 : 1} />);
    }

    // Sectors and contents
    for (let sign = 0; sign < 12; sign++) {
      const startAngle = sign * 30;
      const endAngle = (sign + 1) * 30;
      const midAngle = startAngle + 15;

      // Main sector lines
      const p1 = getPoint(signRadius, startAngle);
      const p2 = getPoint(maxRadius, startAngle);
      elements.push(
        <line key={`line-${sign}`} x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#333" strokeWidth="2" />
      );

      // Sign text in the core
      const textPos = getPoint(signRadius - 35, midAngle);
      elements.push(
        <text key={`sign-num-${sign}`} x={textPos.x} y={textPos.y - 12} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">
          {sign + 1}
        </text>
      );
      elements.push(
        <text key={`sign-name-${sign}`} x={textPos.x} y={textPos.y + 12} textAnchor="middle" dominantBaseline="middle" className="text-xl font-semibold fill-gray-600">
          {SIGN_NAMES[sign]}
        </text>
      );

      // Inner rings (totals)
      for (let ring = 0; ring < 8; ring++) {
        const targetPlanet = TARGET_RINGS[ring];
        const total = Object.values(breakdown[targetPlanet]?.[sign.toString()] || {}).reduce((sum, val) => sum + val, 0);

        // Outer is Sun (ring 0)
        const rMid = midRadius - (ring * innerRingWidth) - (innerRingWidth / 2);
        const tp = getPoint(rMid, midAngle);
        elements.push(
          <text key={`tot-${sign}-${ring}`} x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" className="fill-gray-800 font-bold">
            {total}
          </text>
        );
      }

      // Outer rings (Kakshyas)
      for (let k = 0; k < 8; k++) {
        const kAngle = startAngle + (k * 3.75);
        const kMidAngle = kAngle + (3.75 / 2);

        // Kakshya lines
        if (k > 0) {
          const k1 = getPoint(midRadius, kAngle);
          const k2 = getPoint(maxRadius, kAngle);
          elements.push(
            <line key={`kline-${sign}-${k}`} x1={k1.x} y1={k1.y} x2={k2.x} y2={k2.y} stroke="#999" strokeWidth="0.5" strokeDasharray="2 2" />
          );
        }

        // Kakshya Ruler labels (on the outside edge)
        const kp = getPoint(labelRadius + 5, kMidAngle);
        const sourcePlanet = KAKSHYA_RULERS[k];
        elements.push(
          <text key={`klab-${sign}-${k}`} x={kp.x} y={kp.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" transform={`rotate(${kMidAngle}, ${kp.x}, ${kp.y})`} className="fill-gray-800 font-bold">
            {sourcePlanet === 'Ascendant' ? 'As' : sourcePlanet.substring(0, 2)}
          </text>
        );

        // Dots (Dashes) for each target planet
        for (let ring = 0; ring < 8; ring++) {
          const targetPlanet = TARGET_RINGS[ring];
          const hasPoint = breakdown[targetPlanet]?.[sign.toString()]?.[sourcePlanet] > 0;

          if (hasPoint) {
            // Ring 0 is outermost
            const rMidOuter = maxRadius - (ring * outerRingWidth) - (outerRingWidth / 2);
            const dotP = getPoint(rMidOuter, kMidAngle);

            // Draw a thick horizontal dash at this position, rotated to match the angle
            elements.push(
              <line
                key={`dash-${sign}-${k}-${ring}`}
                x1={dotP.x - 4} y1={dotP.y}
                x2={dotP.x + 4} y2={dotP.y}
                stroke="#1e3a8a" strokeWidth="3"
                transform={`rotate(${kMidAngle}, ${dotP.x}, ${dotP.y})`}
              />
            );
          }
        }
      }
    }

    // Labels for the rings on the X axis
    for (let ring = 0; ring < 8; ring++) {
      const targetPlanet = TARGET_RINGS[ring];

      // Inner Rings (Totals)
      const rMid = midRadius - (ring * innerRingWidth) - (innerRingWidth / 2);
      elements.push(
        <text key={`ilb-${ring}`} x={cx + rMid} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="14" className="fill-blue-800 font-black bg-white" stroke="#fffdf0" strokeWidth="4" paintOrder="stroke">
          {targetPlanet.substring(0, 2)}
        </text>
      );
      // Outer Rings (Kakshyas)
      const rMidOuter = maxRadius - (ring * outerRingWidth) - (outerRingWidth / 2);
      elements.push(
        <text key={`olb-${ring}`} x={cx + rMidOuter} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16" className="fill-blue-800 font-black bg-white" stroke="#fffdf0" strokeWidth="4" paintOrder="stroke">
          {targetPlanet.substring(0, 2)}
        </text>
      );
    }

    return elements;
  };

  const renderPAVTable = () => {
    const targetPlanet = selectedPlanet;
    const breakdown = avData.bhinna_breakdown;

    // Rows: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Ascendant
    const rows = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Ascendant'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return (
      <div className="flex flex-col bg-[#ffe4e1] p-4 rounded-xl shadow-inner border-2 border-indigo-200 h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-serif font-black text-blue-900 bg-white px-6 py-2 rounded-full border border-blue-400 shadow-sm inline-block">
            Prastarashtaka Varga
          </h3>
          <select
            value={selectedPlanet}
            onChange={(e) => setSelectedPlanet(e.target.value)}
            className="px-4 py-2 rounded-full border-2 border-blue-400 font-bold text-blue-900 text-sm shadow-sm bg-white hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {TARGET_RINGS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto print:overflow-visible bg-white border-2 border-blue-600 p-0 shadow-md">
          <table className="w-full text-center border-collapse table-fixed md:table-auto">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-600 px-1 md:px-3 py-2 md:py-3 text-blue-900 text-left min-w-[70px] md:min-w-[100px] print:w-[15%]">
                  <div className="text-sm md:text-base font-bold">{selectedPlanet}</div>
                  <div className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">Kakshyas</div>
                </th>
                {cols.map(c => (
                  <th key={c} className="border border-blue-600 px-1 md:px-2 py-1 md:py-2 font-black text-blue-900 w-6 md:w-10 print:w-auto text-xs md:text-sm">{c}</th>
                ))}
                <th className="border border-blue-600 px-1 md:px-2 py-1 md:py-2 font-black text-blue-900 text-xs md:text-sm print:w-auto">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(sourcePlanet => {
                let rowTotal = 0;
                return (
                  <tr key={sourcePlanet} className="hover:bg-blue-50/50 transition-colors">
                    <td className={`border border-blue-600 px-1 md:px-3 py-1 md:py-2 text-left font-bold ${PLANET_COLORS[sourcePlanet] || 'text-gray-800'} text-xs md:text-sm`}>
                      {sourcePlanet === 'Ascendant' ? 'Lagna' : sourcePlanet}
                    </td>
                    {cols.map(signNum => {
                      const signIdx = signNum - 1;
                      const hasPoint = breakdown[targetPlanet]?.[signIdx.toString()]?.[sourcePlanet] > 0;
                      if (hasPoint) rowTotal++;
                      return (
                        <td key={signNum} className="border border-blue-600 px-1 md:px-2 py-1 md:py-2 text-blue-900 font-semibold text-xs md:text-sm">
                          {hasPoint ? 1 : 0}
                        </td>
                      );
                    })}
                    <td className="border border-blue-600 px-1 md:px-3 py-1 md:py-2 font-black text-blue-900 bg-blue-50 text-xs md:text-sm">{rowTotal}</td>
                  </tr>
                );
              })}
              {/* Grand Total Row */}
              <tr className="bg-blue-100/50">
                <td className="border border-blue-600 px-1 md:px-3 py-2 md:py-3 text-left font-black text-blue-900 text-xs md:text-sm uppercase tracking-wider">Totals</td>
                {cols.map(signNum => {
                  const signIdx = signNum - 1;
                  // Total for this sign across all source planets for the target planet
                  const signTotal = Object.values(breakdown[targetPlanet]?.[signIdx.toString()] || {}).reduce((sum, val) => sum + val, 0);
                  return (
                    <td key={signNum} className="border border-blue-600 px-1 md:px-2 py-2 md:py-3 font-black text-blue-900 text-xs md:text-sm">{signTotal}</td>
                  );
                })}
                <td className="border border-blue-600 px-1 md:px-3 py-2 md:py-3 font-black text-blue-900 text-base md:text-lg bg-blue-100">
                  {cols.reduce((total, signNum) => {
                    const signIdx = signNum - 1;
                    return total + Object.values(breakdown[targetPlanet]?.[signIdx.toString()] || {}).reduce((sum, val) => sum + val, 0);
                  }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full flex ${stacked && !hideChart && !onlyChart && !onlyTable ? 'flex-col' : 'flex-col xl:flex-row'} gap-6 p-4 md:p-8 bg-[#ffb6c1] rounded-2xl shadow-xl border-4 border-pink-300`}>

      {/* Left Panel: Chakra */}
      {!hideChart && !onlyTable && (
        <div className="w-full xl:w-[600px] flex-shrink-0 bg-[#ffe4e1] p-4 md:p-6 rounded-xl shadow-inner border-2 border-indigo-200 flex flex-col items-center">
          <div className="w-full text-left mb-6">
            <h2 className="text-xl md:text-2xl font-serif font-black text-blue-900 bg-white px-6 py-2 rounded-full border border-blue-400 shadow-sm inline-block">
              Sarva Chancha Chakra
            </h2>
          </div>

          <div className="w-full max-w-[1200px] aspect-square relative bg-[#fffdf0] border-2 border-blue-600 p-2 shadow-md">
            <svg viewBox="0 0 1000 1000" className="w-full h-full font-sans">
              {drawChakra()}
            </svg>
          </div>
        </div>
      )}

      {/* Right Panel: PAV Table */}
      {!onlyChart && (
        <div className={`w-full ${stacked || hideChart || onlyTable ? '' : 'xl:w-[600px]'} flex flex-col`}>
          {renderPAVTable()}
        </div>
      )}
    </div>
  );
};

export default SarvaChanchaChakra;
