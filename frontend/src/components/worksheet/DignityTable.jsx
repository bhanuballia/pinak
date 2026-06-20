import React from "react";
import { PLANET_COLORS, getDignityStatus } from "./WorksheetUtils";
import PlanetaryRemediesViewer from "../PlanetaryRemediesViewer";

const DignityTable = ({ data, planetEffects }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index || 0;
  }

  const getFunctionalNature = (lagnaIdx, planetName) => {
    const lagnaMap = {
      0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
      2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
      3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
      5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
      6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
      7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
      9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
      10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
      11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
    };

    const lagnaData = lagnaMap[lagnaIdx] || { benefic: [], malefic: [] };
    if (planetName === "Rahu" || planetName === "Ketu") return "malefic";
    if (lagnaData.benefic.includes(planetName)) return "benefic";
    if (lagnaData.malefic.includes(planetName)) return "malefic";
    return "neutral";
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase flex-shrink-0">Birth Chart Dignity</div>
      <div className="overflow-auto flex-1 text-[10px] font-mono leading-tight custom-scrollbar">
        <table className="w-full border-collapse mb-6">
          <thead className="bg-[#f1f5f9] sticky top-0 border-b border-[#cbd5e1] z-10">
            <tr>
              <th className="p-1 text-left">Pl.</th>
              <th className="p-1 text-left">Dignity</th>
              <th className="p-1 text-left">SB%</th>
              <th className="p-1 text-left">VB</th>
              <th className="p-1 text-left">Func</th>
            </tr>
          </thead>
          <tbody>
            {(data.planet_positions || []).map(p => {
              const color = PLANET_COLORS[p.planet] || "#000";
              const pStrength = data?.strength?.planets?.[p.planet];
              const sb = pStrength?.total || 1.1;
              
              const nature = getFunctionalNature(lagnaSignIndex, p.planet);
              const statusText = nature === "benefic" ? "Benefic" : nature === "malefic" ? "Malefic" : "Neutral";
              const statusColor = nature === "benefic" ? "text-green-600" : nature === "malefic" ? "text-red-600" : "text-amber-600";

              const SIGNS_LOCAL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
              const signIdx = Math.floor(p.degree / 30);
              const signName = SIGNS_LOCAL[signIdx];
              const dignityObj = typeof getDignityStatus === "function" ? getDignityStatus(p.planet, signName) : null;
              let backendDignity = pStrength?.dignity;
              if (["Rahu", "Ketu"].includes(p.planet) && (!backendDignity || backendDignity === "Neutral" || backendDignity === "Unknown")) {
                  backendDignity = "";
              }
              const dignityDisplay = backendDignity || (dignityObj ? dignityObj.label.replace(/[★↓◆♥✕]/g, '').trim() : "Own");
              
              const vbScore = data?.vimsopaka_bala?.shodashvarga?.[p.planet];
              const vbDisplay = vbScore !== undefined ? (typeof vbScore === 'number' ? vbScore.toFixed(1) : vbScore) : "-";

              return (
                <tr key={p.planet} className="border-b border-[#f1f5f9] hover:bg-white transition-colors">
                  <td className="p-1 font-bold" style={{ color: color }}>
                    {p.planet}{p.is_retrograde ? '*' : ''}{p.is_combust ? '#' : ''}
                  </td>
                  <td className="p-1">{dignityDisplay}</td>
                  <td className="p-1">{(sb * 10).toFixed(0)}</td>
                  <td className="p-1">{vbDisplay}</td>
                  <td className={`p-1 font-bold ${statusColor}`}>{statusText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Detailed Planetary Analysis */}
        <div className="p-3 border-t border-[#cbd5e1] bg-slate-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-4 text-center">Detailed Planetary Analysis</h3>
          <div className="flex flex-col gap-6">
            {(data.planet_positions || []).map(p => {
               const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
               if (!valid.includes(p.planet)) return null;
               
               const nature = getFunctionalNature(lagnaSignIndex, p.planet);
               return (
                 <PlanetaryRemediesViewer key={`rem-${p.planet}`} planet={p.planet} initialNature={nature} />
               );
            })}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-[#cbd5e1] text-[8px] italic text-slate-500 bg-[#f8fafc] flex-shrink-0">
        * = Vakri (Retrograde), # = Asth (Combust) | Analysis uses Parashari principles for current Lagna.
      </div>
    </div>
  );
};

export default DignityTable;
