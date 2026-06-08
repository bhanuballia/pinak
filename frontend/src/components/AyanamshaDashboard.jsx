// frontend/src/components/AyanamshaDashboard.jsx

import React, { useEffect, useState } from "react";

export default function AyanamshaDashboard() {
  const [systems, setSystems] = useState([
    { system: "Lahiri", ayanamsha: 24.12 },
    { system: "Raman", ayanamsha: 22.84 },
    { system: "Krishnamurti", ayanamsha: 23.95 },
    { system: "Fagan-Bradley", ayanamsha: 25.04 },
    { system: "True Chitra", ayanamsha: "Loading..." }
  ]);

  useEffect(() => {
    fetch("http://localhost:8000/api/ayanamsha")
      .then(res => res.json())
      .then(data => {
        setSystems(prev => prev.map(s => 
          s.system === "True Chitra" 
            ? { ...s, ayanamsha: parseFloat(data.true_chitra).toFixed(4) } 
            : s
        ));
      })
      .catch(err => console.error("Error fetching ayanamsha:", err));
  }, []);

  return (
    <div className="p-8 w-full max-w-full mx-auto bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-y-auto">
      <h1 className="text-3xl font-serif italic uppercase mb-6 text-indigo-900">
        Professional Ayanamsha Engine
      </h1>
      <p className="text-sm text-indigo-700 italic mb-8">
        Compare true sidereal shifts calculated across multiple precise astrological frameworks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((s, idx) => (
          <div
            key={idx}
            className="border border-indigo-100 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-black text-indigo-900 mb-2 uppercase">
              {s.system}
            </h2>
            <div className="text-slate-700 font-bold">
              Shift: <span className="text-red-600 font-black">{s.ayanamsha}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
