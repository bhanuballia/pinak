import React from "react";
import ZodiacChart from "../ZodiacChart";
import { PLANET_COLORS, SIGNS, getDignityStatus } from "./WorksheetUtils";
import { PLANET_IN_SIGN_EFFECTS } from "../../data/planetInSign";

const TransitPanel = ({ data, transitPositions }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined || !transitPositions) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Today's Transit</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">
          {!transitPositions ? "Fetching Transit Data..." : "Lagna data unavailable"}
        </div>
      </div>
    );
  }

  // Map transits to houses relative to Natal Lagna
  const transitHouses = {};
  const transitEffects = {};
  for (let i = 1; i <= 12; i++) {
    const signIdx = (lagnaSignIndex + i - 1) % 12;
    transitHouses[i] = {
      house_number: i,
      sign_index: signIdx,
      planets: []
    };
  }

  Object.entries(transitPositions).forEach(([planet, pos]) => {
    const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    if (!valid.includes(planet)) return;

    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
    const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
    if (transitHouses[houseNum]) {
      const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
      const isCombust = pos.is_combust || pos.sidereal?.is_combust;

      transitHouses[houseNum].planets.push({
        name: planet,
        is_retrograde: isRetro,
        is_combust: isCombust
      });
      if ([1, 4, 5, 7, 9, 10].includes(houseNum)) {
        transitEffects[planet] = "positive";
      } else if ([6, 8, 12].includes(houseNum)) {
        transitEffects[planet] = "negative";
      } else {
        transitEffects[planet] = "neutral";
      }
    }
  });

  if (transitHouses[1]) {
    transitHouses[1].planets.unshift("Ascendant");
    transitEffects["Ascendant"] = "neutral";
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest flex-shrink-0">
        Today's Transit (Gochar)
      </div>
      <div className="flex-1 p-1 bg-white overflow-auto custom-scrollbar">
        <div className="mb-4">
          <ZodiacChart houses={transitHouses} title="" variant="legacy" planetEffects={transitEffects} />
        </div>
        
        <div className="p-2 bg-slate-50 border-t border-slate-200 mt-2">
          <h3 className="text-[10px] font-black uppercase tracking-tight mb-3 text-slate-800 text-center">Transit Planet in Sign & House Analysis</h3>
          <div className="space-y-3">
            {Object.entries(transitPositions).map(([planet, pos]) => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(planet)) return null;

              const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
              const transitHouse = ((signIdx - lagnaSignIndex + 12) % 12) + 1;
              const signName = SIGNS[signIdx];
              const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
              const isCombust = pos.is_combust || pos.sidereal?.is_combust;

              const planetData = PLANET_IN_SIGN_EFFECTS[planet];
              const signData = planetData?.signs?.[signName];
              const signEffect = signData?.effect;
              const houseEffect = signData?.houses?.[String(transitHouse)];

              const houseLabel = transitHouse === 1 ? '1st' : transitHouse === 2 ? '2nd' : transitHouse === 3 ? '3rd' : `${transitHouse}th`;
              const houseBorderColor = [1,4,5,9,10].includes(transitHouse) ? 'border-l-green-400' :
                                       [6,8,12].includes(transitHouse)    ? 'border-l-red-400'   :
                                       'border-l-indigo-300';

              const dignity = getDignityStatus(planet, signName);

              return (
                <section key={planet} className={`bg-white rounded-xl border border-indigo-100 shadow-sm border-l-4 ${houseBorderColor} overflow-hidden relative`}>
                  <div className="absolute top-0 right-0 p-3 opacity-[0.04] text-6xl font-black text-indigo-900 pointer-events-none select-none">{transitHouse}</div>

                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm shadow-md border border-white/10 flex-shrink-0">✨</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[planet] || '#1e293b' }}>
                          {planet}{isRetro ? '*' : ''}{isCombust ? '#' : ''} Transit
                        </h4>
                        {dignity && (
                          <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase border ${dignity.bg} ${dignity.text} ${dignity.border}`}>
                            {dignity.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{signName} · House {houseLabel}</span>
                        {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase">Vakri ℞</span>}
                        {isCombust && <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded font-black uppercase">Combust</span>}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 space-y-3">
                    {signEffect ? (
                      <div>
                        <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {signName}</p>
                        <p className="text-sm leading-relaxed text-slate-700 font-serif">
                          {signEffect.length > 300 ? signEffect.slice(0, 300) + '…' : signEffect}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic font-serif">Sign interpretation coming soon.</p>
                    )}
                    {houseEffect && (
                      <div className="pt-3 border-t border-indigo-50">
                        <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {houseLabel} House (Transiting)</p>
                        <p className="text-sm leading-relaxed text-slate-700 font-serif">
                          {houseEffect.length > 350 ? houseEffect.slice(0, 350) + '…' : houseEffect}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          <p className="text-[7.5px] text-center text-slate-400 italic mt-3">House colors: 🟢 Kendra/Trikona · 🔴 Dusthana · Dignity: <span className="text-emerald-700 font-bold">Exalted★</span> · <span className="text-red-700 font-bold">Debilitated↓</span> · <span className="text-blue-700 font-bold">Own◆</span> · <span className="text-sky-600 font-bold">Friendly♥</span> · <span className="text-orange-700 font-bold">Enemy✕</span></p>
        </div>
      </div>
      <div className="flex-shrink-0 p-1 px-2 bg-[#f1f5f9] border-t border-gray-300 flex justify-between items-center text-[7px] text-gray-500 uppercase font-black">
        <span>From Natal Lagna</span>
        <span className="text-blue-600 font-bold">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TransitPanel;
