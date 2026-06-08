import React, { useState, useEffect } from "react";

const SectionalForecast = ({ title, icon, data, colorClass }) => {
  if (!data) return null;
  
  return (
    <div className="mt-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white hover:border-indigo-200 transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center text-4xl shadow-sm`}>
          {icon}
        </div>
        <div>
          <h2 className="text-3xl font-serif italic text-slate-900">{title}</h2>
          <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">Detailed Analysis</div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overall & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Overall Horoscope</h3>
            <p className="text-slate-700 font-serif italic leading-relaxed">{data.overall}</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-emerald-800 text-sm uppercase tracking-wider mb-2">Opportunities</h3>
            <p className="text-emerald-700 font-serif italic leading-relaxed">{data.opportunities}</p>
          </div>
        </div>

        {/* Cautioned */}
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-rose-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>⚠️</span> Things Should Be Cautioned
          </h3>
          <p className="text-rose-700 font-serif italic leading-relaxed">{data.cautioned}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Career */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><span>💼</span> Career Horoscope</h3>
            <p className="text-blue-900 font-serif italic mb-4 leading-relaxed">{data.career?.prediction}</p>
            <div className="space-y-3 text-sm bg-white/60 p-4 rounded-xl">
              <div className="flex items-start gap-2"><span className="text-emerald-600 font-black mt-0.5">✓ DO:</span> <span className="text-blue-800 leading-relaxed">{data.career?.dos}</span></div>
              <div className="flex items-start gap-2"><span className="text-rose-600 font-black mt-0.5">✗ DON'T:</span> <span className="text-blue-800 leading-relaxed">{data.career?.donts}</span></div>
            </div>
          </div>

          {/* Money */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><span>💰</span> Money Horoscope</h3>
            <p className="text-amber-900 font-serif italic mb-4 leading-relaxed">{data.money?.prediction}</p>
            <div className="space-y-3 text-sm bg-white/60 p-4 rounded-xl">
              <div className="flex items-start gap-2"><span className="text-emerald-600 font-black mt-0.5">✓ DO:</span> <span className="text-amber-800 leading-relaxed">{data.money?.dos}</span></div>
              <div className="flex items-start gap-2"><span className="text-rose-600 font-black mt-0.5">✗ DON'T:</span> <span className="text-amber-800 leading-relaxed">{data.money?.donts}</span></div>
            </div>
          </div>

          {/* Love */}
          <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-pink-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><span>❤️</span> Love Horoscope</h3>
            <p className="text-pink-900 font-serif italic mb-4 leading-relaxed">{data.love?.prediction}</p>
            <div className="space-y-3 text-sm bg-white/60 p-4 rounded-xl">
              <div className="flex items-start gap-2"><span className="text-emerald-600 font-black mt-0.5">✨ BEST TIME:</span> <span className="text-pink-800 leading-relaxed">{data.love?.best_time}</span></div>
              <div className="flex items-start gap-2"><span className="text-rose-600 font-black mt-0.5">⚡ CHALLENGING:</span> <span className="text-pink-800 leading-relaxed">{data.love?.challenging_time}</span></div>
            </div>
          </div>

          {/* Family */}
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-purple-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><span>👨‍👩‍👧</span> Family and Children</h3>
            <p className="text-purple-900 font-serif italic mb-4 leading-relaxed">{data.family?.prediction}</p>
            <div className="space-y-3 text-sm bg-white/60 p-4 rounded-xl">
              <div className="flex items-start gap-2"><span className="text-emerald-600 font-black mt-0.5">✓ DO:</span> <span className="text-purple-800 leading-relaxed">{data.family?.dos}</span></div>
              <div className="flex items-start gap-2"><span className="text-rose-600 font-black mt-0.5">✗ DON'T:</span> <span className="text-purple-800 leading-relaxed">{data.family?.donts}</span></div>
            </div>
          </div>

          {/* Health */}
          <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <h3 className="font-bold text-teal-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><span>🌿</span> Health Horoscope</h3>
            <p className="text-teal-900 font-serif italic mb-4 leading-relaxed">{data.health?.prediction}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white/60 p-4 rounded-xl">
              <div className="flex items-start gap-2"><span className="text-emerald-600 font-black mt-0.5">✓ DO:</span> <span className="text-teal-800 leading-relaxed">{data.health?.dos}</span></div>
              <div className="flex items-start gap-2"><span className="text-rose-600 font-black mt-0.5">✗ DON'T:</span> <span className="text-teal-800 leading-relaxed">{data.health?.donts}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HoroscopeViewer({ data }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const positions = data?.chart?.planet_positions || data?.planet_positions;
    if (!positions || !positions.Moon || !positions.Moon.sidereal) {
      setError("Moon position not found in natal chart.");
      setLoading(false);
      return;
    }

    const natalMoonLon = positions.Moon.sidereal.lon;

    fetch("/api/horoscope/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ natal_moon_lon: natalMoonLon })
    })
      .then(res => res.json())
      .then(json => {
        if (json.daily) {
          setPredictions(json);
        } else {
          setError("Failed to fetch predictions.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Prediction fetch failed:", err);
        setError("Error connecting to prediction engine.");
        setLoading(false);
      });
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">🌟</div>
        <div className="text-indigo-600 font-serif italic text-2xl">Consulting the Cosmic Oracle...</div>
      </div>
    </div>
  );

  if (error) return <div className="p-20 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-serif italic text-slate-900 mb-2">Celestial Forecast</h1>
          <p className="text-indigo-400 uppercase tracking-[0.4em] font-bold text-xs">Prophecy based on your Birth Chart</p>
        </header>

        {/* Daily Card Only at Top now */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-white hover:border-indigo-200 transition-all group max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
             <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📅</div>
             <div className="text-right">
                <h2 className="text-xs font-black uppercase tracking-widest text-amber-600">Daily Horoscope</h2>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">
                  Moon at Sign Index {predictions?.current_transits?.Moon}
                </div>
             </div>
          </div>
          <div className="h-px w-full bg-amber-100 mb-6"></div>
          <p className="text-slate-700 leading-relaxed font-serif italic text-xl text-center">
            "{predictions?.daily?.prediction}"
          </p>
        </div>

        {/* Daily Horoscope Guide */}
        {predictions?.daily?.categories && (
          <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-white hover:border-amber-200 transition-all max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif italic text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">✨</span> Daily Guide Details
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {predictions.daily.categories.map((cat, idx) => (
                <div key={idx} className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/3 font-bold text-amber-800 text-xs uppercase tracking-wider">{cat.name}</div>
                  <div className="md:w-2/3 text-slate-700 font-serif italic text-sm">{cat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Forecast Section */}
        <SectionalForecast 
          title="Monthly Prediction" 
          icon="🌙" 
          colorClass="bg-indigo-100 text-indigo-600" 
          data={predictions?.monthly?.sections} 
        />

        {/* Yearly Forecast Section */}
        <SectionalForecast 
          title="Yearly Forecast" 
          icon="🪐" 
          colorClass="bg-purple-100 text-purple-600" 
          data={predictions?.yearly?.sections} 
        />

        <div className="mt-16 bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-serif italic">Guide</div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif italic mb-4">A Note on Your Predictions</h3>
            <p className="text-slate-400 leading-relaxed max-w-2xl">
              These forecasts are calculated in real-time by analyzing the current transit (Gochar) of celestial bodies across your Natal Moon position (Chandra Rashi). 
              Daily updates are driven by the Moon's 2.25-day cycle per sign, while Monthly patterns follow the Sun's transit. 
              Your Yearly outlook is governed by Jupiter (Guru), the planet of expansion and wisdom.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center pb-12">
           <button 
             onClick={() => window.close()}
             className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest transition-colors"
           >
             Close Forecast
           </button>
        </div>
      </div>
    </div>
  );
}
