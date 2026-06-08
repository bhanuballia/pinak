import React from 'react';

const VARGA_NAMES = {
  d1: "Janma",
  d2: "Hora",
  d3: "Dreshkana",
  d4: "Chaturthamsha",
  d7: "Saptamsha",
  d9: "Navamsha",
  d10: "Dashamsha",
  d12: "Dwadashamsha",
  d16: "Shodashamsha",
  d20: "Vimshamsha",
  d24: "Chaturvimshamsha",
  d27: "Saptavimshamsha",
  d30: "Trimshamsha",
  d40: "Khavedamsha",
  d45: "Akshavedamsha",
  d60: "Shashtiamsha"
};

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_COLORS = {
  Lagna: "#b45309",
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

export default function ShodashvargaSummary({ data }) {
  const summary = data?.shodashvarga_summary;
  if (!summary) return null;

  const vargaKeys = Object.keys(VARGA_NAMES);

  const getSignAbbr = (sign) => {
    if (!sign) return "";
    return sign.substring(0, 3);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-3xl border shadow-xl font-serif">
      <h2 className="text-3xl text-red-800 text-center mb-8">Shodashvarga Summary</h2>
      
      {/* Table 1: Signs */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-red-800 mb-2">Signs occupied by planets in Shodashvargas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-red-800 bg-orange-50/50">
                <th className="py-2 px-2 text-left w-40"></th>
                <th className="py-2 px-2 text-left" style={{ color: PLANET_COLORS.Lagna }}>Lagna</th>
                {PLANETS.map(p => (
                  <th key={p} className="py-2 px-2 text-left" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vargaKeys.map((v_id) => {
                const vData = summary[v_id] || { signs: {} };
                return (
                  <tr key={v_id} className="border-b border-gray-100 last:border-b-2 last:border-red-800">
                    <td className="py-1.5 px-2">{VARGA_NAMES[v_id]}</td>
                    <td className="py-1.5 px-2 text-gray-800">{getSignAbbr(vData.signs?.Lagna)}</td>
                    {PLANETS.map(p => (
                      <td key={p} className="py-1.5 px-2 text-gray-800">{getSignAbbr(vData.signs?.[p])}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Dignities */}
      <div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Dignities of planets in Shodashvargas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-red-800 bg-orange-50/50">
                <th className="py-2 px-2 text-left w-40"></th>
                {PLANETS.map(p => (
                  <th key={p} className="py-2 px-2 text-left" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vargaKeys.map((v_id) => {
                const vData = summary[v_id] || { dignities: {} };
                return (
                  <tr key={v_id} className="border-b border-gray-100 last:border-b-2 last:border-red-800">
                    <td className="py-1.5 px-2">{VARGA_NAMES[v_id]}</td>
                    {PLANETS.map(p => (
                      <td key={p} className="py-1.5 px-2 text-gray-800">{vData.dignities?.[p] || ""}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
