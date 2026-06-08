import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const SunriseChartViewer = ({ formData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [formData]);

  const fetchData = async () => {
    if (!formData) return;
    setLoading(true);

    let pDate = '2000-01-01';
    let pTime = '12:00:00';
    let pLat = 28.6139;
    let pLon = 77.2090;
    let pTz = 5.5;
    let pName = 'Native';
    let pLoc = 'Delhi, India';
    let pAyanamsha = 'Lahiri'; // Note: Usually handled on backend, but good for display

    // Resolve formData structure differences
    if (formData.basic_details && formData.basic_details.birth_date) {
      pDate = formData.basic_details.birth_date;
      pTime = formData.basic_details.birth_time;
      pLat = formData.basic_details.lat;
      pLon = formData.basic_details.lon;
      pName = formData.basic_details.name || 'Native';
      pLoc = formData.basic_details.birth_place || pLoc;
    } else if (formData.meta) {
      pDate = formData.meta.date || formData.meta.birth_date || '2000-01-01';
      pTime = formData.meta.time || formData.meta.birth_time || '12:00:00';
      pLat = formData.meta.lat || 28.6139;
      pLon = formData.meta.lon || 77.2090;
      pTz = formData.meta.tz || 5.5;
      pName = formData.meta.name || 'Native';
      pLoc = formData.meta.location_name || pLoc;
    } else if (formData.basic) {
      pDate = formData.basic.birth_date || '2000-01-01';
      pTime = formData.basic.birth_time || '12:00:00';
      pLat = formData.basic.lat || 28.6139;
      pLon = formData.basic.lon || 77.2090;
      pTz = formData.basic.tz_offset || 5.5;
      pName = formData.basic.name || 'Native';
      pLoc = formData.basic.location || pLoc;
    } else if (formData.dob) {
      pDate = formData.dob;
      pTime = formData.tob || "00:00:00";
      pLat = formData.lat;
      pLon = formData.lon;
      pTz = formData.tz || 5.5;
      pName = formData.name || 'Native';
    } else {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        birth_date: pDate,
        birth_time: pTime.includes(":") && pTime.split(":").length === 2 ? pTime + ":00" : pTime,
        lat: parseFloat(pLat),
        lon: parseFloat(pLon),
        tz_offset: parseFloat(pTz),
      };

      const response = await fetch('http://localhost:8000/api/sunrise/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to fetch Sunrise Chart data");
      const result = await response.json();

      // We also need standard D1 for the top left birth chart. We can just use formData.charts.D1 if available.
      let standardD1 = null;
      if (formData.charts && formData.charts.D1) {
        standardD1 = formData.charts.D1;
      }

      result.name = pName;
      result.dob = pDate;
      result.tob = pTime;
      result.lat = pLat;
      result.lon = pLon;
      result.tz = pTz;
      result.loc = pLoc;
      result.standardD1 = standardD1;

      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error calculating Sunrise chart. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData || (!formData.dob && !formData.basic_details && !formData.meta && !formData.basic)) {
    return <div className="bg-[#ffcccc] min-h-screen text-black p-6 font-sans">Please fill out the birth details form first to view the Sunrise Chart.</div>;
  }

  const formatDeg = (deg) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor((((deg - d) * 60) - m) * 60);
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getPlanetColor = (planet) => {
    const colors = {
      "Sun": "#cc0000", "Su": "#cc0000",
      "Moon": "#333333", "Mo": "#333333",
      "Mars": "#ff0000", "Ma": "#ff0000",
      "Mercury": "#009900", "Me": "#009900",
      "Jupiter": "#ff8c00", "Ju": "#ff8c00",
      "Venus": "#cc00cc", "Ve": "#cc00cc",
      "Saturn": "#0000ff", "Sa": "#0000ff",
      "Rahu": "#666666", "Ra": "#666666",
      "Ketu": "#666666", "Ke": "#666666"
    };
    return colors[planet] || "#333";
  };

  // Format Date for Dashas
  const formatDate = (jd) => {
    // A very rough JD to date formatter for simple table display, or if backend returns a string, use it directly.
    // In Vedic astrology app backend, vimshottari sequence usually provides 'start_date' string or similar.
    return jd;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans p-4 md:p-8 text-slate-100 flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/20 backdrop-blur-md text-red-200 p-4 rounded-xl border border-red-500/50 shadow-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-indigo-500/30 pb-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-2xl">🌅</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif text-white tracking-wide">Sunrise Chart</h1>
            <p className="text-indigo-300 text-xs uppercase tracking-[0.2em] font-medium">Surya Lagna & Dashas</p>
          </div>
        </div>
        <button onClick={() => window.close()} className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      {!data && loading && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-amber-500 rounded-full animate-spin mb-6 shadow-lg shadow-amber-500/20"></div>
          <p className="text-indigo-200 font-serif italic text-xl animate-pulse">Computing Astronomical Sunrise...</p>
        </div>
      )}

      {data && (
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
            {/* Top Left: Birth Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl flex flex-col hover:border-indigo-500/50 transition-colors">
              <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Natal Chart
              </h2>
              <div className="flex-1 min-h-[250px] bg-slate-900/50 rounded-xl overflow-hidden p-2 ring-1 ring-white/5 relative">
                {data.standardD1 ? (
                  <div className="absolute inset-0 p-2 mix-blend-screen invert hue-rotate-180 brightness-150 saturate-0 opacity-80"><ZodiacChart houses={data.standardD1.houses} variant="modern" /></div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 italic font-serif">Birth chart not available</div>
                )}
              </div>
            </div>

            {/* Top Right: Birth Data */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-10 -top-10 text-9xl opacity-5 pointer-events-none">🌞</div>
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Astronomical Data
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 z-10">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Native</div>
                  <div className="text-base font-serif text-white">{data.name}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Date of Birth</div>
                  <div className="text-base font-serif text-white">{data.dob}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Time of Birth</div>
                  <div className="text-base font-serif text-white">{data.tob}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Location</div>
                  <div className="text-base font-serif text-white truncate" title={data.loc}>{data.loc}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Latitude</div>
                  <div className="text-sm font-mono text-indigo-200">{formatDeg(data.lat)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Longitude</div>
                  <div className="text-sm font-mono text-indigo-200">{formatDeg(data.lon)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70 mb-1">Timezone</div>
                  <div className="text-sm font-mono text-indigo-200">UTC {data.tz > 0 ? '+' + data.tz : data.tz}:00</div>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 -mt-2">
                  <div className="text-[10px] uppercase tracking-wider text-amber-500/70 mb-1">True Apparent Sunrise</div>
                  <div className="text-base font-bold font-mono text-amber-400">{new Date(data.sunrise_local).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
            {/* Bottom Left: Sunrise D1 Chart */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl flex flex-col hover:border-amber-500/50 transition-colors">
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Sunrise Chart (Surya Lagna)
              </h2>
              <div className="flex-1 bg-amber-900/10 rounded-xl p-1 ring-1 ring-amber-500/10 flex items-start justify-center">
                <div className="w-full max-w-[650px] aspect-square mix-blend-screen invert hue-rotate-180 brightness-150 opacity-90"><ZodiacChart houses={data.d1_chart?.houses} variant="modern" /></div>
              </div>
            </div>

            {/* Bottom Right: Sunrise D9 and Dasha */}
            <div className="flex flex-col gap-6">

              {/* Sunrise D9 Chart */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl flex flex-col flex-1 hover:border-purple-500/50 transition-colors">
                <h2 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Sunrise Navamsha (D9)
                </h2>
                <div className="flex-1 bg-purple-900/10 rounded-xl p-2 ring-1 ring-purple-500/10 flex items-start justify-center">
                  <div className="w-full max-w-[350px] aspect-square mix-blend-screen invert hue-rotate-180 brightness-150 opacity-80"><ZodiacChart houses={data.d9_chart?.houses} variant="modern" /></div>
                </div>
              </div>

              {/* Sunrise Vimshottari Table */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl flex flex-col flex-1 h-[250px] overflow-hidden">
                <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Sunrise Dashas
                </h2>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-800 text-slate-400 text-[16px] uppercase tracking-widest z-10">
                      <tr>
                        <th className="pb-2 font-medium">Period</th>
                        <th className="pb-2 font-medium">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 font-mono">
                      {data.dashas && data.dashas.slice(0, 10).map((md, i) => (
                        <React.Fragment key={i}>
                          {md.antardashas && md.antardashas.slice(0, 9).map((ad, j) => {
                            const convertJdToDate = (jd) => {
                              const ms = (jd - 2440587.5) * 86400000;
                              return new Date(ms);
                            };
                            const dDate = convertJdToDate(ad.start_jd);
                            return (
                              <tr key={`ad-${i}-${j}`} className="hover:bg-slate-700/30 transition-colors group">
                                <td className="py-2.5 px-1">
                                  <span className="text-slate-300 group-hover:text-white transition-colors">{md.lord.substring(0, 2)}</span>
                                  <span className="text-slate-600 mx-1">-</span>
                                  <span className="text-slate-400 group-hover:text-emerald-400 transition-colors">{ad.lord.substring(0, 2)}</span>
                                </td>
                                <td className="py-2.5 px-1 text-slate-400">
                                  {dDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                              </tr>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto text-center border-t border-indigo-500/20 pt-6 pb-2">
            <p className="text-[10px] text-indigo-300/50 uppercase tracking-[0.2em] font-medium">
              Calculations based on True Apparent Sunrise (Upper Limb) • Surya Lagna System
            </p>
          </footer>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}} />
    </div>
  );
};

export default SunriseChartViewer;
