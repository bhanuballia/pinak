import React, { useState, useEffect } from "react";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Daily Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-white hover:border-indigo-200 transition-all group">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📅</div>
            <h2 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">Daily Horoscope</h2>
            <div className="h-px w-12 bg-amber-200 mb-4"></div>
            <p className="text-slate-700 leading-relaxed font-serif italic text-lg">
              {predictions?.daily?.prediction}
            </p>
            <div className="mt-6 text-[10px] font-mono text-slate-400 uppercase">
              Moon at Sign Index {predictions?.current_transits?.Moon}
            </div>
          </div>

          {/* Monthly Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-white hover:border-indigo-200 transition-all group">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🌙</div>
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Monthly Prediction</h2>
            <div className="h-px w-12 bg-indigo-200 mb-4"></div>
            <p className="text-slate-700 leading-relaxed font-serif italic text-lg">
              {predictions?.monthly?.prediction}
            </p>
            <div className="mt-6 text-[10px] font-mono text-slate-400 uppercase">
              Sun at Sign Index {predictions?.current_transits?.Sun}
            </div>
          </div>

          {/* Yearly Card */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-white hover:border-indigo-200 transition-all group">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🪐</div>
            <h2 className="text-xs font-black uppercase tracking-widest text-purple-600 mb-2">Yearly Forecast</h2>
            <div className="h-px w-12 bg-purple-200 mb-4"></div>
            <p className="text-slate-700 leading-relaxed font-serif italic text-lg">
              {predictions?.yearly?.prediction}
            </p>
            <div className="mt-6 text-[10px] font-mono text-slate-400 uppercase">
              Jupiter at Sign Index {predictions?.current_transits?.Jupiter}
            </div>
          </div>
        </div>

        {/* Daily Horoscope Guide */}
        {predictions?.daily?.categories && (
          <div className="mt-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white hover:border-amber-200 transition-all">
            <h2 className="text-3xl font-serif italic text-slate-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">✨</span> Your Daily Horoscope Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {predictions.daily.categories.map((cat, idx) => (
                <div key={idx} className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-2">{cat.name}</h3>
                  <p className="text-slate-700 font-serif italic leading-relaxed">{cat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <div className="mt-12 text-center">
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
