import React from 'react';

const SIGNS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", 
  "Simha", "Kanya", "Tula", "Vrischika", 
  "Dhanu", "Makara", "Kumbha", "Meena"
];

const SOURCES = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant"];

const BhinnaTable = ({ planet, breakdown }) => {
  // breakdown structure: { signIndex: { sourcePlanet: 1|0 } }
  
  if (!breakdown) return null;

  // Calculate column totals
  const columnTotals = {};
  SOURCES.forEach(source => {
    columnTotals[source] = 0;
    for (let sign = 0; sign < 12; sign++) {
      columnTotals[source] += breakdown[sign]?.[source] || 0;
    }
  });
  
  // Calculate grand total
  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h3 className="font-black text-slate-800 text-lg">
          {planet} (Bhinnashtaka Varga)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-white border-b border-slate-200 text-slate-700">
              <th className="py-3 px-4 text-left font-bold border-r border-slate-100">Sign</th>
              {SOURCES.map(source => (
                <th key={source} className="py-3 px-2 font-bold border-r border-slate-100">
                  {source}
                </th>
              ))}
              <th className="py-3 px-4 font-black">Total</th>
            </tr>
          </thead>
          <tbody>
            {SIGNS.map((sign, index) => {
              const signData = breakdown[index] || {};
              // Calculate row total
              const rowTotal = SOURCES.reduce((sum, source) => sum + (signData[source] || 0), 0);
              
              return (
                <tr key={sign} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 text-left font-medium text-slate-600 border-r border-slate-100 bg-white">
                    {sign}
                  </td>
                  {SOURCES.map(source => (
                    <td key={source} className="py-2.5 px-2 border-r border-slate-100 text-slate-700">
                      {signData[source] ? "1" : ""}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 font-bold text-slate-800 bg-slate-50/50">
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
              <td className="py-3 px-4 text-left border-r border-slate-100">Total</td>
              {SOURCES.map(source => (
                <td key={source} className="py-3 px-2 border-r border-slate-100">
                  {columnTotals[source]}
                </td>
              ))}
              <td className="py-3 px-4 font-black text-indigo-700">
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
