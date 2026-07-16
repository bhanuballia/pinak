import React, { useState, useEffect } from 'react';
import ZodiacVrasphalChart from './ZodiacVrasphalChart';

const PLANET_COLORS = {
  Sun: "#dc2626", // red
  Moon: "#000000",
  Mars: "#dc2626", // red
  Mercury: "#16a34a", // green
  Jupiter: "#f59e0b", // yellow-orange
  Venus: "#d946ef", // pink/magenta
  Saturn: "#2563eb", // blue
  Rahu: "#000000",
  Ketu: "#000000",
  Lagna: "#a52a2a" // brown/red for Ascendant
};

const VarshaphalaDetailedCharts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem('worksheetData');
        if (!storedData) throw new Error("No worksheet data found.");

        const parsedData = JSON.parse(storedData);

        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;
        let pName = 'Native';

        if (parsedData.basic_details && parsedData.basic_details.birth_date) {
          pDate = parsedData.basic_details.birth_date;
          pTime = parsedData.basic_details.birth_time;
          pLat = parsedData.basic_details.lat;
          pLon = parsedData.basic_details.lon;
          pName = parsedData.basic_details.name;
        } else if (parsedData.meta) {
          pDate = parsedData.meta.date || '2000-01-01';
          pTime = parsedData.meta.time || '12:00:00';
          pLat = parsedData.meta.lat || 28.6139;
          pLon = parsedData.meta.lon || 77.2090;
          pTz = parsedData.meta.tz || 5.5;
          pName = parsedData.meta.name || 'Native';
        }

        const payload = {
          date: pDate,
          time: pTime,
          lat: parseFloat(pLat),
          lon: parseFloat(pLon),
          tz_offset: parseFloat(pTz),
          age: startAge
        };

        const response = await fetch('/api/solar_return/detailed_year', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Detailed Varshaphala data');
        }

        const result = await response.json();

        // Find birth year
        const bYear = parseInt(pDate.split("-")[0]);
        const runYear = bYear + startAge - 1;

        setData({
          name: pName,
          yearStr: `${runYear}-${runYear + 1}`,
          location: "Local", // Could reverse geocode if needed
          ...result
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startAge]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffef5] flex items-center justify-center font-serif">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-6xl mb-4 text-red-700">ॐ</span>
          <p className="tracking-[0.2em] uppercase text-red-900 font-bold">Calculating Detailed Charts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-serif">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded">
          <h2 className="text-2xl text-red-700 mb-2 font-bold">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.close()}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffef5] py-8 px-4 font-serif text-black print:bg-white print:p-0">

      {/* Controls */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center bg-white p-4 shadow-sm border border-[#e5d5b5] print:hidden rounded">
        <div className="flex items-center gap-4">
          <span className="font-bold text-red-800">Age:</span>
          <input
            type="number"
            value={inputAge}
            onChange={(e) => setInputAge(e.target.value)}
            className="w-20 border border-gray-300 p-1 text-center outline-none focus:border-red-500 rounded"
            min="1"
          />
          <button
            onClick={() => setStartAge(parseInt(inputAge) || 1)}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded transition shadow-sm font-semibold text-sm tracking-wider"
          >
            Load Year
          </button>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded transition shadow-sm font-semibold text-sm tracking-wider"
        >
          Print PDF
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white border border-[#d4af37] shadow-xl p-8 print:shadow-none print:border-none print:p-0 relative">

        {/* Border styling matching classical charts */}
        <div className="absolute inset-2 border-2 border-red-700 opacity-20 pointer-events-none print:inset-0"></div>
        <div className="absolute inset-3 border border-red-700 opacity-40 pointer-events-none print:inset-1"></div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="text-5xl text-red-700 mb-2 drop-shadow-sm font-bold mt-4">ॐ</div>
          <h1 className="text-3xl text-red-800 font-bold mb-2">Varshaphala {data.yearStr}</h1>
          <p className="text-sm italic text-gray-700 font-semibold">
            *Varsha Pravesha based on True solar return: {data.return_time}
          </p>
        </div>

        {/* Detailed Planetary Table */}
        <div className="mb-10 relative z-10 overflow-x-auto">
          <table className="w-full text-sm border-t-2 border-b-2 border-red-700 text-center">
            <thead>
              <tr className="border-b border-red-700 font-bold text-red-900 bg-[#fffbf0]">
                <th className="py-2 px-1 text-left">Planet</th>
                <th className="py-2 px-1">R/C</th>
                <th className="py-2 px-1">Sign</th>
                <th className="py-2 px-1">Degree</th>
                <th className="py-2 px-1">Speed</th>
                <th className="py-2 px-1">Nakshatra</th>
                <th className="py-2 px-1">Pada</th>
                <th className="py-2 px-1">Sign lord</th>
                <th className="py-2 px-1">Nak. lord</th>
                <th className="py-2 px-1">Status</th>
                <th className="py-2 px-1">SB</th>
              </tr>
            </thead>
            <tbody>
              {data.table.map((row, idx) => (
                <tr key={idx} className="border-b border-dashed border-gray-300 last:border-none hover:bg-red-50 transition-colors">
                  <td className="py-1.5 px-1 text-left font-semibold" style={{ color: PLANET_COLORS[row.planet] || "#000" }}>{row.planet}</td>
                  <td className="py-1.5 px-1">{row.rc}</td>
                  <td className="py-1.5 px-1 text-gray-700">{row.sign}</td>
                  <td className="py-1.5 px-1">{row.degree}</td>
                  <td className="py-1.5 px-1">{row.speed}</td>
                  <td className="py-1.5 px-1 text-gray-700">{row.nakshatra}</td>
                  <td className="py-1.5 px-1">{row.pada}</td>
                  <td className="py-1.5 px-1 font-semibold" style={{ color: PLANET_COLORS[row.sign_lord === "Lagna" ? "Mars" : row.sign_lord] || "#dc2626" }}>{row.sign_lord}</td>
                  <td className="py-1.5 px-1 font-semibold" style={{ color: PLANET_COLORS[row.nak_lord] || "#dc2626" }}>{row.nak_lord}</td>
                  <td className="py-1.5 px-1 text-gray-700">{row.status}</td>
                  <td className="py-1.5 px-1">{row.sb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2x2 Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">

          {/* Chart 1: Varshaphala Chart */}
          <div>
            <h3 className="text-[16px] text-red-800 font-bold mb-3 text-center">Varshaphala Chart</h3>
            <div className="aspect-square w-full">
              <ZodiacVrasphalChart
                houses={data.charts.varshaphala.houses}
                hideOuterRect={false}
                variant="legacy"
                scaleText={1.7}
                fontFactor={2}
              />
            </div>
          </div>

          {/* Chart 2: Bhava Chart */}
          <div>
            <h3 className="text-xl text-red-800 font-bold mb-3 text-center">Bhava Chart</h3>
            <div className="aspect-square w-full">
              <ZodiacVrasphalChart
                houses={data.charts.bhava.houses}
                hideOuterRect={false}
                variant="legacy"
                scaleText={1.4}
              />
            </div>
          </div>

          {/* Chart 3: Moon Chart */}
          <div>
            <h3 className="text-xl text-red-800 font-bold mb-3 text-center">Moon Chart</h3>
            <div className="aspect-square w-full">
              <ZodiacVrasphalChart
                houses={data.charts.moon.houses}
                hideOuterRect={false}
                variant="legacy"
                scaleText={1.4}
              />
            </div>
          </div>

          {/* Chart 4: Navamsha */}
          <div>
            <h3 className="text-xl text-red-800 font-bold mb-3 text-center">Navamsha</h3>
            <div className="aspect-square w-full">
              <ZodiacVrasphalChart
                houses={data.charts.navamsha.houses}
                hideOuterRect={false}
                variant="legacy"
                scaleText={1.4}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VarshaphalaDetailedCharts;
