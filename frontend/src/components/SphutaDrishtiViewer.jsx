import React, { useState } from 'react';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_COLORS = {
  Sun: "#dc2626",
  Moon: "#1e293b",
  Mars: "#b91c1c",
  Mercury: "#047857",
  Jupiter: "#b45309",
  Venus: "#be185d",
  Saturn: "#1d4ed8",
  Rahu: "#0f766e",
  Ketu: "#c2410c"
};

const BENEFICS = new Set(["Jupiter", "Venus", "Moon", "Mercury"]);

export default function SphutaDrishtiViewer({ sphutaDrishtiData, planetPositions }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!sphutaDrishtiData || typeof sphutaDrishtiData !== 'object') {
    return (
      <div className="p-6 text-center text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-200">
        Sphuta Drishti matrix calculation data unavailable.
      </div>
    );
  }

  const getCellStyling = (value, aspectingPlanet) => {
    if (value === 0 || !value) {
      return {
        bg: "bg-slate-50/50 text-slate-400",
        border: "border-slate-100"
      };
    }

    const isBenefic = BENEFICS.has(aspectingPlanet);

    if (value >= 45) {
      return {
        bg: isBenefic
          ? "bg-emerald-600 text-white font-bold shadow-sm"
          : "bg-rose-600 text-white font-bold shadow-sm",
        border: isBenefic ? "border-emerald-700" : "border-rose-700"
      };
    } else if (value >= 25) {
      return {
        bg: isBenefic
          ? "bg-emerald-100 text-emerald-900 font-semibold"
          : "bg-amber-100 text-amber-900 font-semibold",
        border: isBenefic ? "border-emerald-200" : "border-amber-200"
      };
    } else {
      return {
        bg: "bg-slate-100/80 text-slate-700 font-medium",
        border: "border-slate-200"
      };
    }
  };

  const getLongitude = (planetName) => {
    if (!planetPositions) return null;
    if (Array.isArray(planetPositions)) {
      const p = planetPositions.find(item => item.planet === planetName);
      return p ? p.degree : null;
    } else if (typeof planetPositions === 'object') {
      const p = planetPositions[planetName];
      return p?.sidereal?.lon ?? p?.degree ?? null;
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl shadow-md">
        <div>
          <h4 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">✨</span> Sphuta Drishti Matrix (Shashtiamsa Aspect Strengths)
          </h4>
          <p className="text-xs text-slate-300">
            Degree-based aspect power (0 to 60 Shashtiamsas). 60 Shashtiamsas = 100% full aspect power.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block"></span>
            <span className="text-slate-200">Strong Benefic (&ge;45)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-rose-600 inline-block"></span>
            <span className="text-slate-200">Strong Malefic (&ge;45)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block border border-slate-400"></span>
            <span className="text-slate-300">Partial/Weak (&lt;25)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-md bg-white">
        <table className="w-full text-center border-collapse text-sm">
          <thead>
            <tr className="bg-rose-100 text-slate-900 font-bold tracking-wider uppercase border-b border-rose-200">
              <th className="p-3 text-left bg-rose-100 min-w-[130px] border-r border-rose-200">
                <div className="text-[11px] text-slate-600 font-normal">Aspecting &rarr;</div>
                <div className="text-indigo-700 font-bold text-sm">Aspected &darr;</div>
              </th>
              {PLANETS.map(p => (
                <th key={p} className="p-3 border-r border-rose-200 bg-rose-100 min-w-[75px]" style={{ color: PLANET_COLORS[p] || "#000000" }}>
                  <div className="text-sm md:text-base font-black">{p}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANETS.map(aspectedPlanet => (
              <tr key={aspectedPlanet} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-3 text-left font-bold text-sm md:text-base border-r border-slate-200 bg-slate-50 flex items-center justify-between" style={{ color: PLANET_COLORS[aspectedPlanet] }}>
                  <span>{aspectedPlanet}</span>
                  {getLongitude(aspectedPlanet) !== null && (
                    <span className="text-xs font-mono text-slate-500 font-normal">
                      {getLongitude(aspectedPlanet).toFixed(1)}&deg;
                    </span>
                  )}
                </td>
                {PLANETS.map(aspectingPlanet => {
                  if (aspectingPlanet === aspectedPlanet) {
                    return (
                      <td key={aspectingPlanet} className="p-3 bg-slate-100/60 border-r border-slate-200 text-slate-300 italic select-none text-sm md:text-base">
                        -
                      </td>
                    );
                  }

                  const value = sphutaDrishtiData[aspectingPlanet]?.[aspectedPlanet] ?? 0;
                  const percentage = ((value / 60) * 100).toFixed(0);
                  const style = getCellStyling(value, aspectingPlanet);
                  const isHovered = hoveredCell?.aspecting === aspectingPlanet && hoveredCell?.aspected === aspectedPlanet;

                  return (
                    <td
                      key={aspectingPlanet}
                      className={`p-2.5 border-r border-slate-200 relative transition-all cursor-pointer ${style.bg}`}
                      onMouseEnter={() => setHoveredCell({ aspecting: aspectingPlanet, aspected: aspectedPlanet, value, percentage })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="text-sm md:text-base font-bold">{value.toFixed(1)}</span>
                        <span className="text-xs opacity-80">{percentage}%</span>
                      </div>

                      {isHovered && (
                        <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-white rounded-lg shadow-2xl text-left border border-slate-700 pointer-events-none">
                          <div className="text-[11px] font-bold text-amber-300 border-b border-slate-700 pb-1 mb-1">
                            {aspectingPlanet} &rarr; {aspectedPlanet}
                          </div>
                          <div className="text-[10px] space-y-0.5 text-slate-200">
                            <div><strong className="text-indigo-300">Aspect Strength:</strong> {value} / 60 Shashtiamsas</div>
                            <div><strong className="text-indigo-300">Percentage:</strong> {percentage}%</div>
                            <div><strong className="text-indigo-300">Nature:</strong> {BENEFICS.has(aspectingPlanet) ? "Benefic Aspect" : "Malefic Aspect"}</div>
                          </div>
                        </div>
                      )}
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
}
