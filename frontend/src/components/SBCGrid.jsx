import React, { useEffect, useState } from "react";

export default function SBCGrid() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch initial grid data from our new API
    fetch("/api/sarvatobhadra/sbc")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error fetching SBC data:", err));
  }, []);

  if (!data) {
    return <div className="p-4 text-center">Loading Sarvatobhadra Chakra...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full">
      <h2 className="text-2xl font-bold">Sarvatobhadra Chakra</h2>

      {/* Basic Grid */}
      <div className="grid grid-cols-7 gap-1 w-full max-w-4xl">
        {data.grid.map((cell, idx) => (
          <div
            key={idx}
            className="border p-3 text-center bg-yellow-50 text-sm font-medium rounded-md shadow-sm"
          >
            {cell.nakshatra}
          </div>
        ))}
      </div>

      {/* Advanced SVG Chakra Frontend */}
      <div className="w-full max-w-2xl mt-8">
        <svg viewBox="0 0 800 800" className="w-full h-auto drop-shadow-lg">
          <rect
            x="100"
            y="100"
            width="600"
            height="600"
            fill="#f5f0d0"
            stroke="blue"
            strokeWidth="4"
            rx="15"
          />
          <text x="400" y="400" textAnchor="middle" alignmentBaseline="middle" fontSize="24" fill="#333">
            Advanced SVG Visualizer Placeholder
          </text>
        </svg>
      </div>

      {/* AI Report Section */}
      {data.report && (
        <div className="w-full max-w-2xl mt-6 bg-slate-800 text-slate-100 p-6 rounded-2xl shadow-lg border border-slate-700">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wider flex items-center gap-2 font-serif">
            <span>✨</span> Vedha Analysis & Predictions
          </h3>
          <div className="text-sm whitespace-pre-wrap leading-relaxed opacity-90 font-sans">
            {data.report}
          </div>
        </div>
      )}
    </div>
  );
}
