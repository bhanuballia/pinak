import React, { useState, useEffect } from 'react';

const CONDITIONS = {
  1: "Planets placed in the kendras or Aploklimas.",
  2: "All planets in Apoklimas.",
  3: "Two planets aspect each other within range of their Deeptamsa (orb of influence) and the faster moving planet is behind the slower.",
  4: "Two planets aspect each other within range of their Deeptamsa (orb of influence) and the faster moving planet is ahead of the slower.",
  5: "No aspect between two planets. A faster moving planet is aspecting both the other planets within the range of their Deeptamsa.",
  6: "No aspect between two planets. A slower moving planet is aspecting both the other planets within the range of their Deeptamsa.",
  7: "Two planets in Ithasala. Saturn or Mars inimically aspect (1,4,7,10) the faster moving planet.",
  8: "Two planets in Ithasala. The Moon aspects one or both the planets from within their Deeptamsa and is behind the planet in question.",
  9: "Two planets in Ithasala. An unqualified Moon on the last degree of sign, on entering the next sign establishes Ithasala with one of the two planets and some other powerful planet.",
  10: "Two planets in Ithasala. An unqualified Moon neither associates with nor in Ithasala with either planet.",
  11: "Two planets in Ithasala. Either of the two is retrograde, combust, debilitated, in the 6th, 8th, or 12th house, in an inimical house, or aspected by a malefic.",
  12: "Two planets in Ithasala. The slower planet is exalted, in its own house or otherwise strong. The faster moving planet is weak, not exalted, and not in its own house.",
  13: "Two planets weak. One of them is in Ithasala with a strong planet which is either exalted or in its own house.",
  14: "The Lagnesh and Karyesh are not in aspect or in Ithasala. The Karyesh is in Rashyanta (last degree of a sign). On entering the next sign the Karyesh establishes Ithasala with a strong planet and with another planet which is strong or in its own house.",
  15: "Lagnesh and Karyesh powerful and in the Kendras or panapharas. Presence of benefic aspects and absence of malefic aspects.",
  16: "Lagnesh and Karyesh are weak and in the 6th, 8th, or 12th houses, and combust and retrograde."
};

const TajikaYogasViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

        const response = await fetch('/api/solar_return/tajika_yogas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Tajika Yogas.");

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-rose-800 text-lg font-serif">Calculating Tajika Yogas...</div>;
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
            <span>Tajika Yogas</span>
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
          
          <h2 className="text-center text-red-700 text-2xl mb-4 font-bold">Tajika Yogas</h2>
          
          {/* Debug Info
          <div className="mb-4 text-sm text-gray-600 text-center">
             Lagnesh: <span className="font-bold">{data.lagnesh}</span> | Karyesh: <span className="font-bold">{data.karyesh}</span>
          </div> */}

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-t-2 border-b-2 border-red-600 text-left">
                <th className="py-2 pl-2 w-12 text-red-800 font-bold">No.</th>
                <th className="py-2 w-48 text-red-800 font-bold">Yoga Name</th>
                <th className="py-2 text-red-800 font-bold">Condition for Formation of Yoga</th>
                <th className="py-2 w-32 text-center text-red-800 font-bold">Presence in Chart</th>
              </tr>
            </thead>
            <tbody>
              {data.yogas.map((yoga, idx) => (
                <tr key={yoga.no} className="border-b border-red-600 text-gray-800">
                  <td className="py-2 pl-2 align-top">{yoga.no}.</td>
                  <td className="py-2 align-top pr-2">{yoga.name}</td>
                  <td className="py-2 align-top pr-4 text-xs leading-tight">
                    {CONDITIONS[yoga.no]}
                  </td>
                  <td className="py-2 text-center align-middle">
                    {yoga.present ? (
                      <span className="text-green-500 font-bold text-lg">✔</span>
                    ) : (
                      <span className="text-red-500 font-bold text-lg">✖</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default TajikaYogasViewer;
