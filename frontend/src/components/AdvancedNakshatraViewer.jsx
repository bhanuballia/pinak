import React, { useState, useEffect } from 'react';

const AdvancedNakshatraViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveNakshatra = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/nakshatra_advanced/live');
        if (!response.ok) {
          throw new Error('Failed to fetch live Nakshatra data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveNakshatra();
    
    // Refresh every minute to keep it truly live
    const interval = setInterval(fetchLiveNakshatra, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-5xl mb-4">🌌</span>
          <p className="tracking-widest uppercase">Initializing Live Nakshatra Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center font-sans">
        <div className="text-center bg-red-900/50 p-8 rounded-2xl border border-red-500">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl text-red-300 mb-2 tracking-widest uppercase">Engine Error</h2>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col font-sans">
      <div className="bg-[#0f0f1a] border-b border-[#333] flex justify-between items-center px-4 py-3 text-sm text-gray-300 shadow-md">
        <span>Live Nakshatra Tracking Dashboard</span>
        <span className="text-[#00ffcc]">Last updated: {data.timestamp}</span>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto">
        <div className="bg-[#16213e] rounded-xl shadow-lg border border-[#333] overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-[#00ffcc]">●</span> Live Planetary Positions
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0f1a] border-b border-[#333]">
                    <th className="p-3 text-sm font-semibold text-gray-300">Planet / Point</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Current Sign</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Exact Degree</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Current Nakshatra</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Pada</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Speed (deg/day)</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">RA</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Dec (Kranti)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#333] hover:bg-[#1a264a] transition-colors">
                      <td className="p-3 font-medium text-[#00ffcc]">{item.planet}</td>
                      <td className="p-3 text-gray-300">{item.sign}</td>
                      <td className="p-3 text-gray-300">{item.degree.toFixed(2)}°</td>
                      <td className="p-3 font-semibold text-white">{item.nakshatra}</td>
                      <td className="p-3 text-gray-300">Pada {item.pada}</td>
                      <td className="p-3 text-gray-300">{item.speed !== 0 ? item.speed.toFixed(4) + '°/d' : 'N/A'}</td>
                      <td className="p-3 text-gray-300">{item.ra !== 0 ? item.ra.toFixed(2) + '°' : 'N/A'}</td>
                      <td className="p-3 text-gray-300">{item.dec !== 0 ? item.dec.toFixed(2) + '°' : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>

        {data.muhurat && data.muhurat.nature && (
          <div className="bg-[#16213e] rounded-xl shadow-lg border border-[#333] overflow-hidden mt-2">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-yellow-400">✨</span> Live Muhurat Analysis
              </h2>
              <p className="text-gray-300 mb-6">
                The Moon is currently transiting <strong>{data.muhurat.current_moon_nakshatra}</strong>, which has a <strong>{data.muhurat.nature}</strong> nature.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-green-900/50 rounded-lg p-4">
                  <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">✅</span> Favorable For
                  </h3>
                  <ul className="space-y-2">
                    {data.muhurat.favorable_activities.map((act, i) => (
                      <li key={i} className="text-green-100 flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">◆</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-[#0f172a] border border-red-900/50 rounded-lg p-4">
                  <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">❌</span> Unfavorable For
                  </h3>
                  <ul className="space-y-2">
                    {data.muhurat.unfavorable_activities.map((act, i) => (
                      <li key={i} className="text-red-100 flex items-start gap-2">
                        <span className="text-red-500 mt-1 text-xs">◆</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedNakshatraViewer;
