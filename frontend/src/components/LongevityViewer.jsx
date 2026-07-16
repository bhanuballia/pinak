import React, { useState, useEffect } from 'react';

const LongevityViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        };

        const response = await fetch('/api/longevity/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Longevity data.");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-800 text-lg font-serif">Analyzing Longevity Factors...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-serif">Error: {error}</div>;
  if (!data) return null;

  const getBracketDescription = (bracket) => {
    if (bracket === "Alpayu") return "Short Life (Typically 0-32 years). Indicates weaker longevity factors in the Jaimini or Parashari systems.";
    if (bracket === "Madhyayu") return "Medium Life (Typically 32-70 years). Indicates a mix of benefic and malefic influences on longevity.";
    if (bracket === "Purnayu") return "Long Life (Typically 70+ years). Indicates strong longevity factors and robust health indicators.";
    return "Unknown Bracket";
  };

  const getBracketColor = (bracket) => {
    if (bracket === "Alpayu") return "text-red-700 bg-red-50 border-red-200";
    if (bracket === "Madhyayu") return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (bracket === "Purnayu") return "text-green-700 bg-green-50 border-green-200";
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Longevity Analysis (Aayu Nirnaya)</h1>
        <p className="text-slate-600 mb-6">
          Evaluation of life span categories using classical Vedic Astrology principles including the Jaimini Three-Pair method and Parashari Balarishta checks.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-sm mb-8">
          <p className="text-yellow-800 text-sm font-medium">
            <span className="font-bold uppercase tracking-wider text-xs">Note:</span> This analysis is for astrologers' reference and serves as basic data for detailed calculations. There are several other astrological factors that can override these results. If you see terms like "Alpayu" (short life) or similar predictions, please do not worry - these are preliminary indicators that require comprehensive analysis by a qualified astrologer.
          </p>
        </div>

        {/* Balarishta Alert */}
        {data.balarishta && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded shadow-sm mb-8">
            <h2 className="text-red-800 font-bold text-lg mb-2 flex items-center">
              <span className="text-2xl mr-2">⚠️</span> Balarishta Warning (Infant Mortality Risk)
            </h2>
            <p className="text-red-700 mb-3">Classical texts indicate potential early life health risks based on lunar afflictions.</p>
            <ul className="list-disc pl-6 text-red-700 space-y-1">
              {data.balarishta_warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}
        {!data.balarishta && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded shadow-sm mb-8">
            <h2 className="text-emerald-800 font-bold text-md flex items-center">
              <span className="text-xl mr-2">✅</span> No prominent Balarishta (infant mortality) yogas detected.
            </h2>
          </div>
        )}

        {/* Jaimini Method Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Jaimini Three-Pair Method</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.jaimini_pairs.map((pair, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pair {idx + 1}</p>
                    <p className="font-semibold text-slate-800 mb-2">{pair.name}</p>
                    <p className="text-sm text-slate-600 mb-4">{pair.entities}</p>
                  </div>
                  <div className={`px-3 py-2 rounded font-bold text-center border ${getBracketColor(pair.result)}`}>
                    {pair.result}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-blue-800"><span className="font-bold">Base Assessment:</span> By majority rule of the 3 pairs above, the base Jaimini longevity bracket is <strong>{data.base_bracket}</strong>.</p>
            </div>
          </div>
        </div>

        {/* Kakshya Adjustments Section */}
        {(data.kakshya_vriddhi || data.kakshya_hrasa) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Kakshya Adjustments (Modifications)</h2>
            </div>
            <div className="p-6">
              {data.kakshya_vriddhi && (
                <div className="mb-4">
                  <h3 className="font-bold text-green-700 flex items-center mb-2"><span className="mr-2">⬆️</span> Kakshya Vriddhi (Increase)</h3>
                  <ul className="list-disc pl-6 text-slate-700">
                    {data.vriddhi_reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                  <p className="text-sm text-slate-600 mt-2 italic">Strong benefics in Kendra push the longevity bracket up by one level.</p>
                </div>
              )}
              {data.kakshya_hrasa && (
                <div>
                  <h3 className="font-bold text-orange-700 flex items-center mb-2"><span className="mr-2">⬇️</span> Kakshya Hrasa (Decrease)</h3>
                  <ul className="list-disc pl-6 text-slate-700">
                    {data.hrasa_reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                  <p className="text-sm text-slate-600 mt-2 italic">Strong malefics in Lagna or 7th push the longevity bracket down by one level.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Verdict Section */}
        <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${getBracketColor(data.final_bracket)}`}>
          <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Final Estimated Longevity</p>
              <h2 className="text-4xl font-black">{data.final_bracket}</h2>
            </div>
            <div className="max-w-md text-right md:text-left text-sm font-medium opacity-90">
              {getBracketDescription(data.final_bracket)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LongevityViewer;
