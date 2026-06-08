import React from 'react';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_COLORS = {
  Sun: "#dc2626",
  Moon: "#111827",
  Mars: "#ef4444",
  Mercury: "#16a34a",
  Jupiter: "#d97706",
  Venus: "#db2777",
  Saturn: "#2563eb",
  Rahu: "#4b5563",
  Ketu: "#92400e"
};

export default function PlanetaryAvastha({ data }) {
  const avasthas = data?.planetary_avasthas;
  
  if (!avasthas) {
    return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Loading Avasthas...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-3xl border shadow-xl font-serif">
      <h2 className="text-2xl md:text-3xl text-red-800 text-center mb-6 pb-2 border-b-2 border-red-800">
        Graha Avasthas - Planets and their Moods
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base border-collapse">
          <thead>
            <tr className="border-b-2 border-red-800 bg-[#fee2e2] text-black">
              <th className="py-3 px-4 font-bold">Planet</th>
              <th className="py-3 px-4 font-bold">Jagradadi<br/>Avastha<br/>(set of 3)</th>
              <th className="py-3 px-4 font-bold">Baladi<br/>Avastha<br/>(set of 5)</th>
              <th className="py-3 px-4 font-bold">Lajjitadi Avastha<br/><br/>(set of 6)</th>
              <th className="py-3 px-4 font-bold">Deeptadi<br/>Avastha<br/>(set of 9)</th>
              <th className="py-3 px-4 font-bold">Shyanadi<br/>Avastha<br/>(set of 12)</th>
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((planet) => {
              const res = avasthas[planet];
              if (!res) return null;

              return (
                <tr key={planet} className="border-b border-red-600 last:border-b-2 last:border-red-800">
                  <td className="py-4 px-4 font-bold whitespace-nowrap" style={{ color: PLANET_COLORS[planet] }}>
                    {planet}
                  </td>
                  <td className="py-4 px-4 whitespace-pre-line">
                    {res.jagradadi}
                  </td>
                  <td className="py-4 px-4 whitespace-pre-line">
                    {res.baladi}
                  </td>
                  <td className="py-4 px-4 whitespace-pre-line">
                    {res.lajjitadi}
                  </td>
                  <td className="py-4 px-4 whitespace-pre-line">
                    {res.deeptadi}
                  </td>
                  <td className="py-4 px-4 whitespace-pre-line">
                    {res.shyanadi}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
