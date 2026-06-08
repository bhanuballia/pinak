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
      fetch("http://localhost:8000/api/sarvatobhadra/sbc")
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
    
    fetch(`http://localhost:8000/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=28.6&lon=77.2`)
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
    <div className="flex h-[600px] bg-gray-100 p-4 gap-4 overflow-hidden">
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

        {/* AI Report Section Moved Below Chakra */}
        {report && (
          <div className="mt-6 bg-slate-800 text-slate-100 p-4 rounded-xl shadow-lg border border-slate-700 max-h-48 overflow-y-auto shrink-0">
            <h3 className="text-md font-bold text-yellow-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span>✨</span> AI Vedha Analysis from Current Position
            </h3>
            <div className="text-sm whitespace-pre-wrap leading-relaxed opacity-90">
              {report}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Dual Ring Chart (Transit Panel) */}
      <div className="w-[500px] shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200 overflow-y-auto custom-scrollbar">
          <h2 className="text-lg font-bold text-center mb-4 text-emerald-800">
            अंदर: जन्म कुण्डली - बाहर: गोचर कुण्डली
          </h2>
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
