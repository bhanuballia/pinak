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

const formatDegree = (lon) => {
  if (typeof lon !== 'number') return "00:00";
  const signDeg = lon % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  return `${d.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Formats a degree as total degree "XXX:MM" or just XXX:MM
const formatTotalDegree = (lon) => {
  if (typeof lon !== 'number') return "000:00";
  const d = Math.floor(lon);
  const m = Math.floor((lon - d) * 60);
  return `${d.toString().padStart(3, '0')}:${m.toString().padStart(2, '0')}`;
};

export default function AspectsSummary({ data }) {
  const aspects = data?.aspects_data;
  if (!aspects || !aspects.planets || !aspects.bhavas) return null;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-3xl border shadow-xl font-serif">
      <h2 className="text-3xl text-red-800 text-center mb-8">Aspects on Planets & Bhavas</h2>
      
      {/* Table 1: Aspects on Planets */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-red-800 mb-2 text-center">Aspects on Planets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-center">
            <thead>
              <tr className="bg-[#fef3c7] border-t-2 border-red-800">
                <th rowSpan="2" className="py-2 px-2 text-left border-b-2 border-red-800">Aspected<br/>Planets</th>
                <th rowSpan="2" className="py-2 px-2 border-b-2 border-red-800">Degree</th>
                <th colSpan="9" className="py-2 px-2 border-b border-red-800">Aspecting Planets</th>
              </tr>
              <tr className="bg-[#fef3c7] border-b-2 border-red-800">
                {PLANETS.map(p => (
                  <th key={p} className="py-2 px-2 font-bold" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aspects.planets.map((row) => (
                <tr key={row.aspected} className="border-b border-red-600">
                  <td className="py-3 px-2 text-left font-bold" style={{ color: PLANET_COLORS[row.aspected] }}>{row.aspected}</td>
                  <td className="py-3 px-2">{formatTotalDegree(row.lon)}</td>
                  {PLANETS.map(p => {
                    const aspect = row.aspects[p];
                    if (!aspect || aspect.virupa === 0) {
                      return <td key={p} className="py-3 px-2">-</td>;
                    }
                    return (
                      <td key={p} className="py-3 px-2">
                        {aspect.fraction && aspect.fraction !== "-" ? (
                          <div>
                            <div>{aspect.fraction}</div>
                            <div className="text-xs">({aspect.virupa})</div>
                          </div>
                        ) : (
                          <div>({aspect.virupa})</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Aspects on Bhavas */}
      <div>
        <h3 className="text-xl font-bold text-red-800 mb-2 text-center">Aspects on Bhavas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-center border-2 border-red-800">
            <thead>
              <tr className="bg-[#fef3c7] border-b-2 border-red-800">
                <th rowSpan="2" className="py-2 px-2 text-left border-r border-red-800 w-24">Aspected<br/>Bhava</th>
                <th rowSpan="2" className="py-2 px-2 border-r border-red-800 w-24">Degree</th>
                <th colSpan="9" className="py-2 px-2">Aspecting Planets</th>
              </tr>
              <tr className="bg-[#fef3c7] border-b-2 border-red-800">
                {PLANETS.map(p => (
                  <th key={p} className="py-2 px-2 font-bold" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aspects.bhavas.map((row) => (
                <tr key={row.aspected} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-2 px-2 text-left">{row.aspected}</td>
                  <td className="py-2 px-2">{formatTotalDegree(row.lon)}</td>
                  {PLANETS.map(p => {
                    const aspect = row.aspects[p];
                    if (!aspect || aspect.virupa === 0) {
                      return <td key={p} className="py-2 px-2">-</td>;
                    }
                    return (
                      <td key={p} className="py-2 px-2">
                        {aspect.virupa}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
