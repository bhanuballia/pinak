import React, { useState, useEffect } from 'react';
import AshtakavargaChart from './AshtakavargaChart';
import BhinnaTable from './BhinnaTable';
import SarvaChanchaChakra from './SarvaChanchaChakra';

const AshtakavargaViewer = ({ data: worksheetData }) => {
  const [avData, setAvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('summary');

  useEffect(() => {
    // Try to get birth details from the passed worksheetData prop first,
    // then fall back to localStorage (same pattern as other worksheet cells)
    let birthDetails = null;

    if (worksheetData && worksheetData.basic_details) {
      const bd = worksheetData.basic_details;
      birthDetails = {
        date: bd.birth_date,
        time: bd.birth_time,
        lat: bd.lat,
        lon: bd.lon,
        tz_offset: bd.tz_offset || 0,
      };
    } else {
      // Fallback: read from localStorage
      try {
        const stored = localStorage.getItem('worksheetData');
        if (stored) {
          const parsed = JSON.parse(stored);
          const bd = parsed.basic_details;
          if (bd) {
            birthDetails = {
              date: bd.birth_date,
              time: bd.birth_time,
              lat: bd.lat,
              lon: bd.lon,
              tz_offset: bd.tz_offset || 0,
            };
          }
        }
      } catch (e) { /* ignore */ }
    }

    if (!birthDetails || !birthDetails.date || !birthDetails.lat) {
      setError('No birth data found. Please generate a report first.');
      return;
    }

    const fetchAshtakavarga = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ashtakavarga', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(birthDetails),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API error: ${errText}`);
        }

        const result = await res.json();
        setAvData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAshtakavarga();
  }, [worksheetData]);

  if (loading) return <div className="p-10 flex items-center justify-center text-indigo-500 font-medium">Calculating Ashtakavarga...</div>;
  if (error) return <div className="p-10 text-red-500 font-medium">Error: {error}</div>;
  if (!avData) return <div className="p-10 text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* HEADER */}
      <div className="shrink-0 p-5 border-b border-indigo-100 flex justify-between items-end bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Ashtakavarga</h2>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
            Samudaya & House Strength Analysis
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-indigo-700">{avData.total_bindus}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Bindus</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-5">
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 mb-6">
          <button 
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${viewMode === 'summary' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            onClick={() => setViewMode('summary')}
          >
            Summary & Analysis
          </button>
          <button 
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${viewMode === 'charts' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            onClick={() => setViewMode('charts')}
          >
            Bhinnashtakavarga Charts
          </button>
          <button 
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${viewMode === 'tables' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            onClick={() => setViewMode('tables')}
          >
            Detailed Tables
          </button>
          <button 
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${viewMode === 'chakra' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            onClick={() => setViewMode('chakra')}
          >
            Sarva Chancha Chakra
          </button>
        </div>

        {viewMode === 'summary' && (
          <div className="space-y-8">
            {/* Heatmap Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Samudaya Bindus (All 12 Signs)</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {avData.visual_data.map((signData, idx) => {
                  const points = signData.points;
                  // Heatmap logic
                  let colorClass = "bg-slate-100 border-slate-200 text-slate-600";
                  if (points >= 30) colorClass = "bg-green-100 border-green-300 text-green-800";
                  else if (points >= 25) colorClass = "bg-yellow-100 border-yellow-300 text-yellow-800";
                  else colorClass = "bg-red-50 border-red-200 text-red-700";

                  return (
                    <div key={idx} className={`p-3 rounded-lg border ${colorClass} flex flex-col items-center justify-center`}>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{signData.sign}</div>
                      <div className="text-2xl font-black">{points}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Analysis */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">House Activation</h3>
              <div className="space-y-3">
                {avData.house_analytics.map((house, idx) => {
                  const points = house.points;
                  let strengthBadge = "bg-slate-200 text-slate-700";
                  if (house.strength === "Powerful") strengthBadge = "bg-indigo-100 text-indigo-800 border border-indigo-200";
                  if (house.strength === "Strong") strengthBadge = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                  if (house.strength === "Weak") strengthBadge = "bg-rose-100 text-rose-800 border border-rose-200";

                  return (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">House</span>
                        <span className="text-lg font-black text-slate-700 leading-none">{house.house}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-slate-700 text-sm">{house.sign} <span className="text-slate-400 font-normal">({points} Bindus)</span></div>
                          <div className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${strengthBadge}`}>
                            {house.strength}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{house.interpretation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sodhya Pinda */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tighter">Sodhya Pinda</h4>
                <p className="text-xs text-indigo-600 font-medium">Average bindu strength across the zodiac</p>
              </div>
              <div className="text-2xl font-black text-indigo-700">{avData.sodhya_pinda}</div>
            </div>
          </div>
        )}

        {viewMode === 'charts' && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6 min-w-[600px] pb-4">
            {/* 7 Planets */}
            {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map(planet => {
              if (!avData.bhinna[planet]) return null;
              
              const housesData = avData.house_analytics.map(ha => ({
                house: ha.house,
                signIndex: ha.sign_index,
                points: avData.bhinna[planet][ha.sign_index] || 0
              }));

              return (
                <AshtakavargaChart 
                  key={planet}
                  title={`Bhinnashtakavarga for ${planet}`} 
                  housesData={housesData} 
                />
              );
            })}

            {/* Lagna Ashtakavarga */}
            {avData.bhinna["Ascendant"] ? (
              <AshtakavargaChart 
                title="Lagna Ashtakavarga" 
                housesData={avData.house_analytics.map(ha => ({
                  house: ha.house,
                  signIndex: ha.sign_index,
                  points: avData.bhinna["Ascendant"][ha.sign_index] || 0
                }))} 
              />
            ) : (
              <div className="flex flex-col bg-slate-50 border-2 border-dashed border-slate-200 rounded-md items-center justify-center text-slate-400 p-4">
                <span className="text-sm font-bold uppercase tracking-widest mb-2">Lagna BAV</span>
                <span className="text-xs text-center">(Loading...)</span>
              </div>
            )}

            {/* Samudaya Ashtakavarga */}
            <AshtakavargaChart 
              title="Samudaya Ashtakavarga" 
              housesData={avData.house_analytics.map(ha => ({
                house: ha.house,
                signIndex: ha.sign_index,
                points: ha.points
              }))} 
            />
            </div>
          </div>
        )}

        {viewMode === 'tables' && (
          <div className="max-w-4xl mx-auto w-full">
            {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Ascendant'].map(planet => {
              if (!avData.bhinna_breakdown?.[planet]) return null;
              return (
                <BhinnaTable 
                  key={planet}
                  planet={planet}
                  breakdown={avData.bhinna_breakdown[planet]}
                />
              );
            })}
          </div>
        )}

        {viewMode === 'chakra' && (
          <div className="w-full">
            <SarvaChanchaChakra avData={avData} />
          </div>
        )}

      </div>
    </div>
  );
};

export default AshtakavargaViewer;
