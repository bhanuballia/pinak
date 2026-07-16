// frontend/src/components/KarakaDashboard.jsx

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function KarakaDashboard() {
  const [karakas, setKarakas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/karakas", { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setKarakas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching karakas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Jaimini Karakas...</div>;
  }

  if (!karakas) {
    return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="p-8 w-full max-w-full mx-auto bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-y-auto">
      <h1 className="text-3xl font-serif italic uppercase mb-6 text-indigo-900">
        7 Karaka Report
      </h1>
      <p className="text-sm text-indigo-700 italic mb-8">
        Jaimini analysis indicating strong karmic evolution across soul destiny and life path.
      </p>

      {/* Chart Section */}
      <div className="mb-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Illustrative 7 Karaka planetary ranking</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={Object.entries(karakas).map(([karaka, data]) => ({
                planet: data.planet,
                degree: data.degree,
                karaka: karaka
              }))}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
              <XAxis type="number" domain={[0, 32]} ticks={[0, 8, 16, 24, 32]} />
              <YAxis type="category" dataKey="planet" />
              <Tooltip formatter={(value) => `${value}°`} />
              <Bar dataKey="degree" fill="#4dabf5" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(karakas).map(([name, data]) => (
          <div
            key={name}
            className="border border-indigo-100 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-black text-indigo-900 mb-4 uppercase">
              {name}
            </h2>
            <div className="text-slate-700 mb-1">
              Planet: <span className="font-bold text-slate-900">{data.planet}</span>
            </div>
            <div className="text-slate-700">
              Degree: <span className="font-bold text-amber-600">{data.degree}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
