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

      {/* Detailed Astottaramsa (D108) Analytical Interpretations Card */}
      <div className="mt-8 bg-rose-100 to-slate-950 p-6 rounded-2xl border border-indigo-500/40 text-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
          <h2 className="text-[18px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <span>🔮</span> Astottaramsa (D108) Comprehensive Karmic Analysis
          </h2>
          <span className="px-3 py-1 bg-amber-950/80 text-amber-300 text-[16px] font-bold rounded-full border border-amber-500/50">
            Micro-Divisional Refinement (0°16'40" per Arc)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-[16px] text-indigo-300 flex items-center gap-1.5">
              <span>🌟</span> High Spiritual & Executive Activation
            </h3>
            <p className="text-orange-400 text-[16px] leading-relaxed">
              D108 alignment indicates elevated spiritual awareness and refined decision-making capacity. Planetary strengths in Mercury (91) and Moon (88) highlight exceptional intellectual foresight and intuitive clarity.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-[16px] text-emerald-300 flex items-center gap-1.5">
              <span>🚀</span> Destiny Refinement & Career Peak
            </h3>
            <p className="text-orange-400 text-[16px] leading-relaxed">
              D108 vs D144 comparison reveals peak karmic activation in Spirituality (93%) and Career (85%). Transiting Jupiter in Leo aspecting D108 Lagna provides sudden opportunities and recognition.
            </p>
          </div>
        </div>

        {/* Detailed Analytical Breakdown Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-[18px] text-left text-slate-200">
            <thead className="bg-slate-900 text-amber-300 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3 border-r border-slate-800">Karmic Sector</th>
                <th className="p-3 border-r border-slate-800 w-24 text-center">Score</th>
                <th className="p-3">Astottaramsa D108 Analytical Insights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-indigo-900 border-r border-slate-800">Spirituality & Higher Purpose</td>
                <td className="p-3 text-center border-r border-slate-800"><span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-bold border border-emerald-600">93%</span></td>
                <td className="p-3 text-slate-900">Exceptional spiritual alignment. Deep connection with ancient wisdom, mantra practice, and higher philosophical pursuits.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-indigo-900 border-r border-slate-800">Career & Life Purpose</td>
                <td className="p-3 text-center border-r border-slate-800"><span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-bold border border-emerald-600">85%</span></td>
                <td className="p-3 text-slate-900">Strong executive authority and creative leadership. High potential for professional breakthroughs under current dasha activations.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-indigo-900 border-r border-slate-800">Marriage & Relationships</td>
                <td className="p-3 text-center border-r border-slate-800"><span className="px-2 py-0.5 bg-sky-950 text-sky-300 rounded font-bold border border-sky-600">76%</span></td>
                <td className="p-3 text-slate-900">Harmonious partnership potential with refined mutual understanding and shared values.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-indigo-900 border-r border-slate-800">Wealth & Prosperity</td>
                <td className="p-3 text-center border-r border-slate-800"><span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded font-bold border border-amber-600">73%</span></td>
                <td className="p-3 text-slate-900">Steady financial accumulation through intellectual and advisory endeavors.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-indigo-900 border-r border-slate-800">Health & Physical Vitality</td>
                <td className="p-3 text-center border-r border-slate-800"><span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded font-bold border border-amber-600">69%</span></td>
                <td className="p-3 text-slate-900">Good overall vitality; maintain balanced routines and stress management during high transit activity.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TRANSIT OVERLAY (D108) Card & Dedicated Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner flex flex-col justify-between">
          <div>
            <h2 className="text-[18px] font-bold uppercase mb-4 text-slate-800">TRANSIT OVERLAY (D108)</h2>
            <TransitOverlay overlays={overlayData} />
          </div>
          <div className="mt-4 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 text-[18px]">
            <h3 className="font-bold text-indigo-900 text-[18px] flex items-center gap-1.5">
              <span>🌐</span> Transit Overlay Analytical Interpretation
            </h3>
            <p className="text-slate-700 leading-relaxed text-[18px]">
              <strong>1st House (Lagna) Overlay:</strong> Transiting Jupiter in 1st house brings wisdom, auspicious timing, and personal expansion.
            </p>
            <p className="text-slate-700 leading-relaxed text-[18px]">
              <strong>10th & 7th House Overlays:</strong> Saturn in 10th and Rahu in 7th highlight heightened professional accountability and relationship dynamics requiring mature alignment.
            </p>
          </div>
        </div>

        {/* Karmic Density Heatmap Card & Dedicated Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner flex flex-col justify-between overflow-hidden">
          <div>
            <h2 className="text-xl font-bold uppercase mb-4 text-slate-800">Karmic Density Heatmap</h2>
            <div className="overflow-x-auto">
              <KarmaHeatmap data={heatmapData} />
            </div>
          </div>
          <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-[18px]">
            <h3 className="font-bold text-emerald-900 text-[18px] flex items-center gap-1.5">
              <span>🔥</span> Heatmap Density Analytical Interpretation
            </h3>
            <p className="text-slate-700 leading-relaxed text-[18px]">
              <strong>High-Density Zones (Phafal Clusters):</strong> Darker color intensity indicates concentrated karmic resolution points across 9th (Dharma) and 10th (Karma) divisions.
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong>Karmic Balance:</strong> Favorable distribution across major centers indicates smooth energy flow with minimal unblocked karmic resistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
