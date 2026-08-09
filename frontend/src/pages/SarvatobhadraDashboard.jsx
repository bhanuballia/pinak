import React, { useEffect, useState } from "react";
import { TransitPanel } from "../components/InteractiveWorksheet";
import ChakraSVGOverlay from "../components/ChakraSVGOverlay";
import RealtimeAlerts from "../components/RealtimeAlerts";

export default function SarvatobhadraDashboard({ data = null, grid: initialGrid = [], activations: initialActivations = [] }) {
  const [grid, setGrid] = useState(initialGrid);
  const [activations, setActivations] = useState(initialActivations);
  const [vedha, setVedha] = useState([]);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(!initialGrid.length);

  const [transitPositions, setTransitPositions] = useState(null);

  useEffect(() => {
    if (!initialGrid.length) {
      fetch("/api/sarvatobhadra/sbc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data || {})
      })
        .then(res => res.json())
        .then(json => {
          if (json.grid) setGrid(json.grid);
          if (json.activations) setActivations(json.activations);
          if (json.vedha) setVedha(json.vedha);
          if (json.report) setReport(json.report);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching SBC data:", err);
          setLoading(false);
        });
    }

    // Fetch live planetary positions for the Transit Panel dual ring chart
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);

    fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=28.6&lon=77.2`)
      .then(res => res.json())
      .then(json => {
        if (json.positions) {
          setTransitPositions(json.positions);
        }
      })
      .catch(err => console.error("Error fetching transit positions:", err));
  }, [initialGrid]);

  if (loading) {
    return <div className="p-4 text-center">Loading Dashboard...</div>;
  }

  // A helper function to get cell colors based on type
  const getCellColor = (type) => {
    switch (type) {
      case "swara": return "bg-red-100 border-red-300 text-red-900";
      case "nakshatra": return "bg-blue-100 border-blue-300 text-blue-900";
      case "rashi": return "bg-yellow-100 border-yellow-300 text-yellow-900";
      case "akshara": return "bg-pink-50 border-pink-200 text-pink-800";
      case "tithi": return "bg-emerald-100 border-emerald-300 text-emerald-900";
      case "day": return "bg-orange-100 border-orange-300 text-orange-900";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  // Helper to find planets in a cell
  const getPlanetsInCell = (cellLabel) => {
    return activations.filter(a => a.nakshatra === cellLabel);
  };

  return (
    <div className="flex items-start bg-gray-100 p-4 gap-4 min-h-screen overflow-y-auto">
      {/* Left Column: Sarvatobhadra Chakra 9x9 Grid */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col min-w-[800px] max-w-[800px] mx-auto">
        <h1 className="text-xl font-bold text-center mb-4 text-indigo-900">
          Sarvatobhadra Chakra (सर्वतोभद्र चक्र)
        </h1>
        <div className="flex-1 flex items-center justify-center relative">
          <div
            className="grid grid-cols-9 grid-rows-9 gap-0 border-2 border-indigo-900 w-[750px] h-[500px]"
          >
            {grid.map((cell, idx) => {
              const planets = cell.type === 'nakshatra' ? getPlanetsInCell(cell.label) : [];
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center text-[14px] font-medium text-center p-1 relative ${getCellColor(cell.type)} 
                    ${cell.affliction_type === 'malefic' ? 'border-red-500 border-2 shadow-[inset_0_0_8px_rgba(239,68,68,0.3)]' :
                      cell.affliction_type === 'benefic' ? 'border-green-500 border-2 shadow-[inset_0_0_8px_rgba(34,197,94,0.3)]' :
                        'border border-slate-300'}`}
                >
                  <span className="z-10">{cell.label || cell.nakshatra}</span>
                  {cell.index && <span className="z-10 text-[10px] text-gray-700 mt-0.5">{cell.index}</span>}

                  {/* Render Planet Badges */}
                  {planets.length > 0 && (
                    <div className="absolute top-0 right-0 flex gap-1 p-1">
                      {planets.map((p, i) => (
                        <div key={i} className="w-3 h-3    flex items-center justify-center text-black text-[14px] z-20" title={p.planet}>
                          {p.planet.substring(0, 2)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <ChakraSVGOverlay vedhas={vedha} />
        </div>

        {/* Enhanced Vedha Analysis Section */}
        {report && (
          <div className="mt-4 bg-slate-900/90 text-slate-100 p-4 rounded-xl shadow-xl border border-amber-500/40 shrink-0 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span>✨</span> Vedha Analysis from Current Position
              </h3>
              <div className="flex items-center gap-2">
                {(() => {
                  const benefics = (vedha || []).filter(v => ["Moon", "Mercury", "Jupiter", "Venus"].includes(v.planet)).length;
                  const malefics = (vedha || []).filter(v => ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(v.planet)).length;
                  const total = benefics + malefics;
                  const pct = total > 0 ? Math.round((benefics / total) * 100) : 100;
                  return (
                    <span className={`px-2.5 py-0.5 rounded-full text-[18px] font-bold border ${pct >= 50 ? 'bg-emerald-100 text-emerald-600 border-emerald-500' : 'bg-rose-100 text-orange-600 border-rose-500'}`}>
                      Vedha Balance: {pct}% Favorable ({benefics} Benefic / {malefics} Malefic)
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Categorized Vedha Breakdown Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className="p-2 bg-slate-800/90 border border-indigo-500/40 rounded-lg hover:border-indigo-400 transition-all cursor-pointer">
                <div className="text-indigo-300 text-[16px] font-medium flex items-center gap-1.5 mb-0.5">
                  <span>🌙</span> Janma Nakshatra Vedhas
                </div>
                <div className="text-[16px] text-slate-300">
                  Direct impact on health, mind, and overall wellbeing.
                </div>
              </div>

              <div className="p-2 bg-slate-800/90 border border-emerald-500/40 rounded-lg hover:border-emerald-400 transition-all cursor-pointer">
                <div className="text-emerald-300  text-[16px] font-medium flex items-center gap-1.5 mb-0.5">
                  <span>♈</span> Janma Rashi (Zodiac Sign) Vedhas
                </div>
                <div className="text-[16px] text-slate-300">
                  Impact on emotional balance and key decisions.
                </div>
              </div>

              <div className="p-2 bg-slate-800/90 border border-amber-500/40 rounded-lg hover:border-amber-400 transition-all cursor-pointer">
                <div className="text-amber-300 font-medium text-[16px] flex items-center gap-1.5 mb-0.5">
                  <span>🌅</span> Lagna (Ascendant) Vedhas
                </div>
                <div className="text-[16px] text-slate-300">
                  Physical vitality, stamina, and public reputation.
                </div>
              </div>

              <div className="p-2 bg-slate-800/90 border border-purple-500/40 rounded-lg hover:border-purple-400 transition-all cursor-pointer">
                <div className="text-purple-300 text-[16px] font-medium flex items-center gap-1.5 mb-0.5">
                  <span>🔤</span> Special Name / Swara Vedhas
                </div>
                <div className="text-[16px] text-slate-300">
                  Impact on personal name initials and sound phonetics.
                </div>
              </div>
            </div>

            {/* Vedha Aspect Direction Indicators */}
            <div className="space-y-1 bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
              <div className="text-[16px] font-medium text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>🧭</span> Vedha Aspect Direction Indicators
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-slate-900/80 border border-emerald-500/30 rounded flex flex-col justify-between">
                  <span className="font-medium text-[16px] text-emerald-300">⬆️ Straight / Frontal (Samamukh Vedha)</span>
                  <span className="text-[16px] text-slate-300 mt-0.5">100% full direct intensity.</span>
                </div>
                <div className="p-2 bg-slate-900/80 border border-sky-500/30 rounded flex flex-col justify-between">
                  <span className="font-medium text-[16px] text-sky-300">↖️ Left / Counter-Clockwise (Vama Vedha)</span>
                  <span className="text-[16px] text-slate-300 mt-0.5">Retrograde / oblique influence.</span>
                </div>
                <div className="p-2 bg-slate-900/80 border border-amber-500/30 rounded flex flex-col justify-between">
                  <span className="font-medium text-[16px] text-amber-300">↗️ Right / Clockwise (Dakshina Vedha)</span>
                  <span className="text-[16px] text-slate-300 mt-0.5">Forward / progressive influence.</span>
                </div>
              </div>
            </div>

            {/* Latta (Planetary Kick) & Counter-Vedha Indicators */}
            <div className="space-y-1 bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
              <div className="text-[16px] font-medium text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>⚡</span> Latta (Planetary Kick) & Counter-Vedha Protection
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Counter-Vedha Protection Status */}
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded flex items-start gap-2">
                  <span className="text-base">🛡️</span>
                  <div>
                    <span className="font-medium text-[16px] text-emerald-300">Counter-Vedha Neutralization (Pancha-Shala / Saptapadi)</span>
                    <p className="text-[16px] text-slate-300 mt-0.5">
                      {(() => {
                        const benefics = (vedha || []).filter(v => ["Moon", "Mercury", "Jupiter", "Venus"].includes(v.planet));
                        const malefics = (vedha || []).filter(v => ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(v.planet));
                        if (benefics.length > 0 && malefics.length > 0) {
                          return `Active: ${benefics[0].planet} Vedha provides counter-protection, absorbing malefic impact from ${malefics[0].planet}.`;
                        } else if (benefics.length > 0) {
                          return "Fully Protected: Strong benefic Vedhas are active without unblocked malefic obstructions.";
                        } else {
                          return "Neutral: No direct Counter-Vedha collisions active on natal sensitive points.";
                        }
                      })()}
                    </p>
                  </div>
                </div>

                {/* Latta Alert Status */}
                <div className="p-2 bg-amber-950/60 border border-amber-500/40 rounded flex items-start gap-2">
                  <span className="text-base">🦵</span>
                  <div>
                    <span className="font-medium text-[16px] text-amber-300">Latta (Planetary Kick) Alert</span>
                    <p className="text-[16px] text-slate-300 mt-0.5">
                      Fast-moving planet transits (Sun, Mars, Mercury, Venus) monitored across Pancha-Shala sensitive Nakshatras.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Classical Sarvatobhadra Predictive Analysis Table */}
            <div className="space-y-2 bg-slate-800/80 p-3 rounded-lg border border-slate-700/70">
              <div className="text-[16px] font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📋</span> Sarvatobhadra Predictive Analysis Table
              </div>
              <div className="overflow-x-auto border border-slate-700/60 rounded-lg">
                <table className="w-full text-[16px] text-left text-slate-200">
                  <thead className="bg-slate-900/90 text-amber-300 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-700">Prediction Topic</th>
                      <th className="p-2 border-r border-slate-700 w-28 text-center">Result</th>
                      <th className="p-2">Analytical Rationale & SBC Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(() => {
                      const benefics = (vedha || []).filter(v => ["Moon", "Mercury", "Jupiter", "Venus"].includes(v.planet));
                      const malefics = (vedha || []).filter(v => ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(v.planet));
                      const bNames = benefics.map(b => b.planet).join(", ") || "Benefics";
                      const mNames = malefics.map(m => m.planet).join(", ") || "Malefics";

                      const topics = [
                        {
                          title: "Health, Longevity & Physical Wellbeing",
                          result: malefics.length === 0 ? "Good" : (benefics.length >= malefics.length ? "Neutral" : "Bad"),
                          badgeClass: malefics.length === 0 ? "bg-emerald-950 text-emerald-300 border-emerald-500" : (benefics.length >= malefics.length ? "bg-amber-950 text-amber-300 border-amber-500" : "bg-rose-950 text-rose-300 border-rose-500"),
                          analysis: malefics.length === 0 ? "Janma Nakshatra is free from unblocked malefic rays. Physical vitality, mental calmness, and energy levels remain strong." : `Transit ${mNames} casting direct/oblique Vedha on Janma Nakshatra. Focus on health routine, adequate rest, and avoiding unnecessary physical strain.`
                        },
                        {
                          title: "Career, Finances & Professional Fortunes",
                          result: benefics.length > 0 ? "Good" : (malefics.length > 0 ? "Bad" : "Neutral"),
                          badgeClass: benefics.length > 0 ? "bg-emerald-950 text-emerald-300 border-emerald-500" : (malefics.length > 0 ? "bg-rose-950 text-rose-300 border-rose-500" : "bg-amber-950 text-amber-300 border-amber-500"),
                          analysis: benefics.length > 0 ? `Supportive rays from transit ${bNames} aspect Karma & Adhana Nakshatras, favoring professional growth, financial gains, and new ventures.` : "Slight friction in career pursuits due to active transit aspects. Maintain steady focus on ongoing responsibilities."
                        },
                        {
                          title: "Stock Market, Financial Markets & Commodity Trends",
                          result: benefics.length > malefics.length ? "Good" : (malefics.length > benefics.length ? "Bad" : "Neutral"),
                          badgeClass: benefics.length > malefics.length ? "bg-emerald-950 text-emerald-300 border-emerald-500" : (malefics.length > benefics.length ? "bg-rose-950 text-rose-300 border-rose-500" : "bg-amber-950 text-amber-300 border-amber-500"),
                          analysis: benefics.length > malefics.length ? "Benefic transit overlays exceed malefic obstructions, favoring market confidence, trading gains, and asset appreciation." : "High market volatility indicated by malefic transit overlays across financial Nakshatra sectors. Exercise caution in speculative investments."
                        },
                        {
                          title: "Personal Reputation & Name (Swara) Predictions",
                          result: malefics.length === 0 ? "Good" : "Neutral",
                          badgeClass: malefics.length === 0 ? "bg-emerald-950 text-emerald-300 border-emerald-500" : "bg-amber-950 text-amber-300 border-amber-500",
                          analysis: malefics.length === 0 ? "Outer rim Swara (vowel/consonant) initial grid cells are clear of malefic rays, protecting personal honor, brand name, and public goodwill." : "Minor Swara ray intersections present. Maintain clear communication to avoid misunderstandings."
                        },
                        {
                          title: "Precise Timing of Events (Pancha-Shala / Saptapadi)",
                          result: benefics.length > 0 ? "Good" : "Neutral",
                          badgeClass: benefics.length > 0 ? "bg-emerald-950 text-emerald-300 border-emerald-500" : "bg-amber-950 text-amber-300 border-amber-500",
                          analysis: benefics.length > 0 ? `Counter-Vedha protection active (${bNames}), offering auspicious timing windows for executing key decisions and new beginnings.` : "Timing window is balanced. Proceed with planned actions under standard astrological guidance."
                        }
                      ];

                      return topics.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60">
                          <td className="p-2 font-medium text-amber-200 border-r border-slate-700/60">{t.title}</td>
                          <td className="p-2 text-center border-r border-slate-700/60">
                            <span className={`px-2.5 py-0.5 rounded-full text-[13px] font-bold border ${t.badgeClass}`}>
                              {t.result}
                            </span>
                          </td>
                          <td className="p-2 text-slate-300 leading-relaxed">{t.analysis}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Text Report */}
            <div className="text-[18px] whitespace-pre-wrap leading-relaxed opacity-95 text-slate-200 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 max-h-36 overflow-y-auto custom-scrollbar">
              {report}
            </div>

            {/* Actionable Vedic Remedial Note */}
            <div className="text-[18px] text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg flex items-center gap-2">
              <span className="text-[18px]">🛡️</span>
              <span><strong>Remedial Note:</strong> If facing active malefic Vedha during this period, regular recitation of Vishnu Sahasranama or Hanuman Chalisa provides protective counter-balance.</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Dual Ring Chart (Today Transit Gochar Chart - Pinned Top) */}
      <div className="w-[500px] shrink-0 flex flex-col gap-4 overflow-hidden sticky top-4">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-emerald-600/30 overflow-y-auto custom-scrollbar">
          <div className="bg-emerald-800 text-white py-2 px-3 rounded-lg text-center mb-3 shadow-md">
            <h2 className="text-md font-bold uppercase tracking-wide">
              Today Transit Gochar Chart (आज का गोचर चक्र)
            </h2>
            <div className="text-xs text-emerald-100 mt-0.5 font-medium">
              अंदर: जन्म कुण्डली • बाहर: गोचर कुण्डली
            </div>
          </div>
          {data ? (
            <TransitPanel data={data} transitPositions={transitPositions} fullSize={true} />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500 italic">
              No chart data available. Please generate a report first.
            </div>
          )}
        </div>
      </div>

      {/* Live Alerts */}
      <RealtimeAlerts />
    </div>
  );
}
