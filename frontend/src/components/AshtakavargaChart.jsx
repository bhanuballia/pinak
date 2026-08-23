import React, { useState } from 'react';

const HOUSE_POLYGON = {
  1: "50,5 72.5,27.5 50,50 27.5,27.5",
  2: "5,5 50,5 27.5,27.5",
  3: "5,5 5,50 27.5,27.5",
  4: "5,50 27.5,27.5 50,50 27.5,72.5",
  5: "5,50 5,95 27.5,72.5",
  6: "5,95 50,95 27.5,72.5",
  7: "50,95 72.5,72.5 50,50 27.5,72.5",
  8: "50,95 95,95 72.5,72.5",
  9: "95,50 95,95 72.5,72.5",
  10: "95,50 72.5,72.5 50,50 72.5,27.5",
  11: "95,5 95,50 72.5,27.5",
  12: "50,5 95,5 72.5,27.5"
};

const HOUSE_CENTER = {
  1: { x: 50, y: 27.5 },
  2: { x: 27.5, y: 12.5 },
  3: { x: 12.5, y: 27.5 },
  4: { x: 27.5, y: 50 },
  5: { x: 12.5, y: 72.5 },
  6: { x: 27.5, y: 87.5 },
  7: { x: 50, y: 72.5 },
  8: { x: 72.5, y: 87.5 },
  9: { x: 87.5, y: 72.5 },
  10: { x: 72.5, y: 50 },
  11: { x: 87.5, y: 27.5 },
  12: { x: 72.5, y: 12.5 }
};

const AshtakavargaChart = ({ title, housesData, defaultRect = false, hideOuterFrame = false, scaleText = 1.0 }) => {
  const [isRect, setIsRect] = useState(defaultRect);
  const aspectRatio = isRect ? 2.5 : 1;

  // housesData: array of { house: 1..12, signIndex: 0..11, points: number }
  const totalPoints = housesData.reduce((sum, h) => sum + (h.points || 0), 0);

  const scalePolygon = (poly, scaleX) => {
    return poly.split(' ').map(point => {
      const [x, y] = point.split(',').map(Number);
      return `${x * scaleX},${y}`;
    }).join(' ');
  };

  return (
    <div className={`flex flex-col bg-white h-full w-full ${hideOuterFrame ? '' : 'border-2 border-sky-400 rounded-md overflow-hidden shadow-sm'}`}>
      <div className={`font-bold flex justify-between items-center ${hideOuterFrame ? 'bg-[#f0f8fc] text-[#0a4d7a] px-2 py-1 text-[11px] border-b border-[#8ec5e6]' : 'bg-sky-50 text-sky-900 px-3 py-1 text-sm border-b border-sky-200'}`}>
        <span className="truncate flex-1">{title}</span>
        <div className="flex items-center gap-1">

          {totalPoints > 0 && (
            <span className={`font-black rounded shrink-0 ${hideOuterFrame ? 'bg-[#d0e5f5] text-[#0a4d7a] px-1.5 py-0.5 text-[14px]' : 'text-[14px] bg-sky-200 text-stone-900 px-1.5 py-0.5'}`}>
              {totalPoints}
            </span>
          )}
        </div>
      </div>
      <div className={`flex items-center justify-center flex-1 min-h-0 ${hideOuterFrame ? 'bg-white p-0' : 'bg-yellow-50/30 p-2'}`}>
        <svg viewBox={hideOuterFrame ? `${5 * aspectRatio} 5 ${90 * aspectRatio} 90` : `0 0 ${100 * aspectRatio} 100`} preserveAspectRatio="none" className={`w-full h-full drop-shadow-sm ${isRect ? 'max-w-full' : 'w-full max-w-full aspect-square'}`}>
          {/* Background and border */}
          <rect x={5 * aspectRatio} y="5" width={90 * aspectRatio} height="90" fill="#fcfcfc" stroke="#475569" strokeWidth={hideOuterFrame ? "0" : "0.5"} />

          {/* Draw all 12 houses */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const hData = housesData.find(h => h.house === houseNum) || {};
            const center = HOUSE_CENTER[houseNum];

            // Sign number (1 for Aries, etc)
            const signNum = (hData.signIndex !== undefined) ? (hData.signIndex + 1) : "";

            return (
              <g key={houseNum}>
                <polygon
                  points={scalePolygon(HOUSE_POLYGON[houseNum], aspectRatio)}
                  fill="none"
                  stroke="rgba(72, 105, 151, 0.86)"
                  strokeWidth="0.5"
                />

                {/* Bindu points */}
                <text
                  x={center.x * aspectRatio}
                  y={center.y + (2.5 + (0.5 * scaleText))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={4 * scaleText}
                  className="font-black fill-slate-800"
                >
                  {hData.points}
                </text>

                {/* Sign number */}
                {signNum && (
                  <text
                    x={center.x * aspectRatio}
                    y={center.y - (2.0 + (0.5 * scaleText))}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={3.5 * scaleText}
                    className="fill-amber-900 font-bold"
                  >
                    {signNum}
                  </text>
                )}
              </g>
            );
          })}

          {/* Outer Border thicker */}
          <rect x={5 * aspectRatio} y="5" width={90 * aspectRatio} height="90" fill="none" stroke="#334155" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default AshtakavargaChart;
