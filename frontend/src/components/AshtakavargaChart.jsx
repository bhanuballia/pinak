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

const AshtakavargaChart = ({ title, housesData, defaultRect = false }) => {
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
    <div className="flex flex-col bg-white border-2 border-sky-400 rounded-md overflow-hidden shadow-sm h-full w-full">
      <div className="bg-sky-50 text-sky-900 px-3 py-1 text-sm font-bold border-b border-sky-200 flex justify-between items-center">
        <span className="truncate flex-1">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRect(!isRect)}
            className="bg-sky-200 hover:bg-sky-300 text-sky-800 px-1.5 py-0.5 rounded text-[10px] font-bold"
            title="Toggle Shape"
          >
            ▭
          </button>
          {totalPoints > 0 && (
            <span className="text-xs font-black bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded shrink-0">
              {totalPoints}
            </span>
          )}
        </div>
      </div>
      <div className="p-2 flex items-center justify-center bg-yellow-50/30 flex-1 min-h-0">
        <svg viewBox={`0 0 ${100 * aspectRatio} 100`} preserveAspectRatio="none" className={`w-full h-full drop-shadow-sm ${isRect ? 'max-w-full' : 'max-w-[250px] aspect-square'}`}>
          {/* Background and border */}
          <rect x={5 * aspectRatio} y="5" width={90 * aspectRatio} height="90" fill="#fcfcfc" stroke="#475569" strokeWidth="0.5" />
          
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
                  stroke="#475569" 
                  strokeWidth="0.5" 
                />
                
                {/* Bindu points */}
                <text 
                  x={center.x * aspectRatio} 
                  y={center.y + 1.5} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="text-[6px] font-bold fill-slate-800"
                >
                  {hData.points}
                </text>
                
                {/* Sign number */}
                {signNum && (
                  <text
                    x={center.x * aspectRatio}
                    y={center.y - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[3px] fill-slate-500 font-medium"
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
