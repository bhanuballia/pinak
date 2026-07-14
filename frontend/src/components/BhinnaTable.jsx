import React from 'react';

const BASE_SIGN_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SOURCES = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Ascendant"];

const PLANET_COLORS = {
  Saturn: "text-blue-700",
  Jupiter: "text-amber-600",
  Mars: "text-red-600",
  Sun: "text-rose-700",
  Venus: "text-fuchsia-600",
  Mercury: "text-emerald-700",
  Moon: "text-slate-800",
  Ascendant: "text-amber-800"
};

const BhinnaTable = ({ planet, breakdown, startSign = 1 }) => {
  // breakdown structure: { signIndex: { sourcePlanet: 1|0 } }

  if (!breakdown) return null;

  const displaySigns = [...BASE_SIGN_NUMBERS.slice(startSign - 1), ...BASE_SIGN_NUMBERS.slice(0, startSign - 1)];

  // Calculate row totals (Totals for each Source)
  const rowTotals = {};
  SOURCES.forEach(source => {
    rowTotals[source] = 0;
    for (let sign = 0; sign < 12; sign++) {
      rowTotals[source] += breakdown[sign]?.[source] || 0;
    }
  });

  // Calculate column totals (Totals for each Sign)
  const columnTotals = {};
  displaySigns.forEach((num) => {
    const signIndex = num - 1;
    columnTotals[signIndex] = 0;
    SOURCES.forEach(source => {
      columnTotals[signIndex] += breakdown[signIndex]?.[source] || 0;
    });
  });

  // Calculate grand total
  const grandTotal = Object.values(rowTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white overflow-hidden mb-8 text-xs font-serif">
      <div className="text-center mb-1">
        <h3 className="font-bold text-red-700 text-base">
          {planet}
        </h3>
      </div>

      <div className="overflow-x-auto print:overflow-visible flex">
        <table className="w-[700px] h-[300px] text-center table-auto border-collapse border-2 border-black">
          <thead>
            <tr>
              <th className="py-1 px-1 text-left font-normal border border-black w-24 align-top">
                <div className="leading-tight">
                  <div>{planet}</div>
                  <div>Sign</div>
                </div>
              </th>
              {displaySigns.map(num => (
                <th key={num} className="py-1 px-1 font-normal border border-black w-6 text-black">
                  {num}
                </th>
              ))}
              <th className="py-1 px-1 font-normal border border-black w-8"></th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(source => {
              const colorClass = PLANET_COLORS[source] || "text-black";
              return (
                <tr key={source}>
                  <td className={`py-0.5 px-2 text-left border-r border-black font-medium ${colorClass}`}>
                    {source === "Ascendant" ? "Lagna" : source}
                  </td>
                  {displaySigns.map(num => {
                    const sIdx = num - 1;
                    const val = breakdown[sIdx]?.[source] || 0;
                    return (
                      <td key={num} className="py-1 px-1 border border-black text-slate-900">
                        {val}
                      </td>
                    );
                  })}
                  <td className="py-0.5 px-1 border-r border-black text-black">
                    {rowTotals[source]}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-bold border-t-2 border-black">
              <td className="py-1 px-2 text-left border-r border-black text-black">Totals</td>
              {displaySigns.map(num => (
                <td key={num} className="py-1 px-1 font-bold border border-black text-black">
                  {columnTotals[num - 1]}
                </td>
              ))}
              <td className="py-1 px-1 border-l-2 border-black text-black">
                {grandTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BhinnaTable;

