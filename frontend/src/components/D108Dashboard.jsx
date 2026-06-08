import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import D108ActivationChart from "./D108ActivationChart";
import D108Chart from "./D108Chart";
import KarmaHeatmap from "./KarmaHeatmap";
import TransitOverlay from "./TransitOverlay";
import RealtimeActivation from "./RealtimeActivation";

const activationData = [
  { planet: "Sun", strength: 72 },
  { planet: "Moon", strength: 88 },
  { planet: "Mars", strength: 64 },
  { planet: "Mercury", strength: 91 },
  { planet: "Jupiter", strength: 83 },
  { planet: "Venus", strength: 77 },
  { planet: "Saturn", strength: 69 }
];

export default function D108Dashboard() {
  // Using sample data as requested
  const planets = [
    { name: "Sun", strength: 72, sign: "Aries" },
    { name: "Moon", strength: 88, sign: "Taurus" },
    { name: "Mars", strength: 64, sign: "Gemini" },
    { name: "Mercury", strength: 91, sign: "Cancer" },
    { name: "Jupiter", strength: 83, sign: "Leo" },
    { name: "Venus", strength: 77, sign: "Virgo" },
    { name: "Saturn", strength: 69, sign: "Libra" }
  ];

  // Dummy Heatmap Data (12x12)
  const heatmapData = Array(12).fill(0).map(() => Array(12).fill(0).map(() => Math.floor(Math.random() * 100)));

  // Dummy Overlay Data
  const overlayData = [
    { planet: "Jupiter", x: 200, y: 300 },
    { planet: "Saturn", x: 600, y: 500 },
    { planet: "Rahu", x: 400, y: 200 }
  ];

  return (
    <div className="p-8 w-full max-w-full mx-auto bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-y-auto">
      <h1 className="text-3xl font-serif italic uppercase mb-6 text-indigo-900">
        Astottaramsa Analysis (D108)
      </h1>
      <p className="text-sm text-indigo-700 italic mb-8">
        D108 reveals subtle karmic layers and destiny refinement. Strong spiritual and career activation visible.
      </p>

      {/* Chart Section */}
      <div className="mb-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sample D108 planetary activation</h2>
        <p className="text-slate-500 mb-6 text-sm">Illustrative activation intensity of planets in Astottaramsa analysis.</p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activationData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="planet" tick={{ fontSize: 12 }} />
              <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar dataKey="strength" fill="#4dabf5" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Chart Section */}
      <div className="mb-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">D108 vs D144 karmic activation</h2>
        <p className="text-slate-500 mb-6 text-sm">Illustrative comparison of karmic activation intensity across advanced divisional systems.</p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { category: "Career", D108: 85, D144: 92 },
                { category: "Marriage", D108: 76, D144: 89 },
                { category: "Spirituality", D108: 93, D144: 98 },
                { category: "Wealth", D108: 73, D144: 81 },
                { category: "Health", D108: 69, D144: 80 }
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="D108" fill="#4dabf5" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="D144" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {planets.map((p, idx) => (
          <div key={idx} className="border border-indigo-100 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <div className="font-black text-lg text-indigo-900 mb-2 uppercase">{p.name}</div>
            <div className="text-slate-700 font-bold">Strength: <span className="text-indigo-600">{p.strength}</span></div>
            <div className="text-slate-700 font-bold">Sign: <span className="text-indigo-600">{p.sign}</span></div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-inner">
        <h2 className="text-xl font-bold uppercase mb-4 text-slate-800">Realtime Activation Stream</h2>
        <RealtimeActivation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner">
            <h2 className="text-xl font-bold uppercase mb-4 text-slate-800">Transit Overlay (D144)</h2>
            <TransitOverlay overlays={overlayData} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
            <h2 className="text-xl font-bold uppercase mb-4 text-slate-800">Karmic Density Heatmap</h2>
            <div className="overflow-x-auto">
                <KarmaHeatmap data={heatmapData} />
            </div>
          </div>
      </div>
    </div>
  );
}
