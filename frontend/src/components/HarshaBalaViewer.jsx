import React, { useState, useEffect } from 'react';

const PLANET_COLORS = {
  Sun: "#dc2626", // red
  Moon: "#000000",
  Mars: "#dc2626", // red
  Mercury: "#16a34a", // green
  Jupiter: "#f59e0b", // yellow-orange
  Venus: "#d946ef", // pink/magenta
  Saturn: "#2563eb", // blue
};

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const HarshaBalaViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('worksheetData');
        if (!storedData) throw new Error("No worksheet data found.");

        const parsedData = JSON.parse(storedData);
        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;

        if (parsedData.basic_details && parsedData.basic_details.birth_date) {
          pDate = parsedData.basic_details.birth_date;
          pTime = parsedData.basic_details.birth_time;
          pLat = parsedData.basic_details.lat;
          pLon = parsedData.basic_details.lon;
        } else if (parsedData.meta) {
          pDate = parsedData.meta.date || '2000-01-01';
          pTime = parsedData.meta.time || '12:00:00';
          pLat = parsedData.meta.lat || 28.6139;
          pLon = parsedData.meta.lon || 77.2090;
          pTz = parsedData.meta.tz || 5.5;
        }

        const payload = {
          date: pDate,
          time: pTime,
          lat: parseFloat(pLat),
          lon: parseFloat(pLon),
          tz_offset: parseFloat(pTz),
          start_age: startAge
        };

        const response = await fetch('http://localhost:8000/api/solar_return/varshaphala_strengths', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Harsha Bala details.");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startAge]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-rose-800 text-lg font-serif">Calculating Varshaphala Strengths...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-serif">Error: {error}</div>;
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl flex flex-col print:shadow-none">

        {/* Header Actions */}
        <div className="bg-white border-b border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 shadow-sm font-sans mb-4 print:hidden">
          <div className="flex items-center text-sm text-black mb-2 md:mb-0">
            <span className="font-semibold text-rose-800">Native</span>
            <span className="mx-2 text-gray-400">|</span>
            <span>Varshaphala Strengths</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-rose-50 border border-rose-200 rounded px-2 py-1">
              <span className="text-xs text-rose-800 font-semibold mr-2">Start Age:</span>
              <input
                type="number"
                value={inputAge}
                onChange={(e) => setInputAge(e.target.value)}
                className="w-16 text-sm border border-gray-300 rounded px-1 outline-none focus:border-rose-500"
                min="1"
              />
              <button
                onClick={() => setStartAge(parseInt(inputAge) || 1)}
                className="ml-2 bg-rose-700 hover:bg-rose-800 text-white text-xs px-3 py-1 rounded transition-colors"
              >
                Load
              </button>
            </div>
            <button onClick={handlePrint} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded border border-blue-200 transition-colors">
              Print
            </button>
          </div>
        </div>

        <div className="w-full border-2 border-red-600 p-8 shadow-sm font-serif">

          {/* Harsha Bala */}
          <div className="mb-10">
            <h2 className="text-center text-red-700 text-xl mb-4 font-bold">Harsha Bala</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t border-b border-red-600 text-center">
                  <th className="py-1 text-left font-normal pl-2 w-1/4"></th>
                  {PLANETS.map(p => (
                    <th key={p} className="py-1 font-bold" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["First", "Second", "Third", "Fourth"].map((bala, idx) => (
                  <tr key={idx} className="text-center text-gray-800">
                    <td className="py-1 text-left pl-2">{bala} Bala</td>
                    {PLANETS.map(p => (
                      <td key={p} className="py-1">{data.harsha_bala[p][bala.toLowerCase()]}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-b border-red-600 text-center text-gray-800">
                  <td className="py-1 text-left pl-2">Total</td>
                  {PLANETS.map(p => (
                    <td key={p} className="py-1">{data.harsha_total[p]}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Panchavargeeya Bala */}
          <div className="mb-10">
            <h2 className="text-center text-red-700 text-xl mb-4 font-bold">Panchavargeeya Bala</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t border-b border-red-600 text-center">
                  <th className="py-1 text-left font-normal pl-2 w-1/4"></th>
                  {PLANETS.map(p => (
                    <th key={p} className="py-1 font-bold" style={{ color: PLANET_COLORS[p] }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Graha Bala", key: "graha" },
                  { label: "Uchcha Bala", key: "uchcha" },
                  { label: "Hudda Bala", key: "hudda" },
                  { label: "Drekkana Bala", key: "drekkana" },
                  { label: "Navamsha Bala", key: "navamsha" },
                ].map((row, idx) => (
                  <tr key={idx} className="text-center text-gray-800">
                    <td className="py-1 text-left pl-2">{row.label}</td>
                    {PLANETS.map(p => (
                      <td key={p} className="py-1">{data.panchavargeeya_bala[p][row.key].toFixed(2)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-b border-red-600 text-center text-gray-800">
                  <td className="py-1 text-left pl-2">Total</td>
                  {PLANETS.map(p => (
                    <td key={p} className="py-1">{data.panchavargeeya_total[p].toFixed(2)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Panchadhikari */}
          <div className="mb-10 flex justify-center">
            <div className="w-full max-w-lg">
              <h2 className="text-center text-red-700 text-xl mb-4 font-bold">Panchadhikari</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-t border-b border-red-600 text-left">
                    <th className="py-1 pl-2 w-1/2 font-bold text-black">Lordship</th>
                    <th className="py-1 font-bold text-black w-1/4">Planet</th>
                    <th className="py-1 font-bold text-black text-center">Strength</th>
                  </tr>
                </thead>
                <tbody>
                  {data.panchadhikari.map((officer, idx) => (
                    <tr key={idx} className="text-gray-800">
                      <td className="py-1 pl-2">{officer.lordship}</td>
                      <td className="py-1" style={{ color: PLANET_COLORS[officer.planet] }}>{officer.planet}</td>
                      <td className="py-1 text-center">{officer.strength.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-red-600">
                    <td colSpan="3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Varshesha and Muntha */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <h2 className="text-center text-red-700 text-xl mb-4 font-bold">Varshesha and Muntha</h2>
              <table className="w-full text-sm border-collapse">
                <tbody className="border-t border-red-600">
                  <tr className="border-b border-red-600 text-gray-800">
                    <td className="py-1 pl-2 w-1/2">Year Lord</td>
                    <td className="py-1 w-8 text-center">:</td>
                    <td className="py-1 font-bold" style={{ color: PLANET_COLORS[data.year_lord] }}>{data.year_lord}</td>
                  </tr>
                  <tr className="border-b border-red-600 text-gray-800">
                    <td className="py-1 pl-2">Muntha in sign</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{data.muntha.sign}</td>
                  </tr>
                  <tr className="border-b border-red-600 text-gray-800">
                    <td className="py-1 pl-2">Muntha in house</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{data.muntha.house}</td>
                  </tr>
                  <tr className="border-b border-red-600 text-gray-800">
                    <td className="py-1 pl-2">Muntha Lord</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1" style={{ color: PLANET_COLORS[data.panchadhikari[0].planet] }}>{data.panchadhikari[0].planet}</td>
                  </tr>
                  <tr className="border-b border-red-600 text-gray-800">
                    <td className="py-1 pl-2">Muntha Lord in house</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HarshaBalaViewer;
// End of HarshaBalaViewer.jsx
