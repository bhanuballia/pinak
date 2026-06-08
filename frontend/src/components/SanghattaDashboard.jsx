// frontend/src/components/SanghattaDashboard.jsx

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SanghattaDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/sanghatta")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sanghatta data", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
      return <div className="p-8 text-center text-slate-500">Loading Sanghatta Chakra data...</div>;
  }

  if (!data) {
      return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
  }

  return (
    <div className="p-8 w-full max-w-full mx-auto bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-y-auto">
      <h1 className="text-3xl font-serif italic uppercase mb-6 text-indigo-900">
        Sanghatta Chakra
      </h1>
      <p className="text-sm text-indigo-700 italic mb-8">
        Enterprise event probability, suffering index, and critical planetary vedha detection.
      </p>

      {/* Chart Section */}
      <div className="mb-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Illustrative Sanghatta activation intensity</h2>
        <p className="text-slate-500 mb-6 text-sm">Example severity levels for major Sanghatta affliction factors used in predictive transit analysis.</p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[
                { factor: "Saturn affliction", score: 88 },
                { factor: "Mars collision", score: 82 },
                { factor: "Rahu obstruction", score: 72 },
                { factor: "Vadha Tara", score: 93 },
                { factor: "Maraka activation", score: 84 },
                { factor: "Moon pressure", score: 76 }
              ]}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
              <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <YAxis type="category" dataKey="factor" />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar dataKey="score" fill="#4dabf5" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Chart Section */}
      <div className="mb-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Illustrative Sanghatta transit risk levels</h2>
        <p className="text-slate-500 mb-6 text-sm">Example comparative intensity of difficult transit activations in Sanghatta Chakra analysis.</p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { factor: "Saturn affliction", score: 88 },
                { factor: "Mars collision", score: 79 },
                { factor: "Rahu activation", score: 72 },
                { factor: "Vadha tara", score: 91 },
                { factor: "Pratyari tara", score: 83 },
                { factor: "8th house transit", score: 76 }
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
              <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip formatter={(value) => `${value}`} />
              <Bar dataKey="score" fill="#4dabf5" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tara Box */}
        <div className="border border-red-100 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-white shadow-sm hover:shadow-md transition-all">
          <h2 className="text-lg font-black text-red-900 mb-2 uppercase">
            Tara
          </h2>
          <div className="text-slate-800 font-bold text-2xl">
            {data.tara?.tara}
          </div>
          <div className="text-sm text-red-600 mt-2 font-semibold">Distance: {data.tara?.distance}</div>
        </div>

        {/* Suffering Index Box */}
        <div className="border border-orange-100 p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-all">
          <h2 className="text-lg font-black text-orange-900 mb-2 uppercase">
            Suffering Index
          </h2>
          <div className="text-slate-800 font-bold text-3xl text-orange-600">
            {data.suffering}
          </div>
        </div>

        {/* Probability Box */}
        <div className="border border-rose-100 p-6 rounded-2xl bg-gradient-to-br from-rose-100 to-red-50 shadow-sm hover:shadow-md transition-all">
          <h2 className="text-lg font-black text-rose-900 mb-2 uppercase">
            Probability
          </h2>
          <div className="text-slate-800 font-bold text-3xl uppercase tracking-wider text-rose-700">
            {data.probability}
          </div>
        </div>
      </div>
    </div>
  );
}
