import React, { useState, useEffect } from 'react';

const MuhurtHeatmap = ({ data }) => {
  const [ceremony, setCeremony] = useState("Marriage");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(30);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected day detail view state
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [detailTab, setDetailTab] = useState('choghadiya'); // 'choghadiya' or 'horas'

  const ceremonies = [
    "Marriage", "Namkaran", "Anna Prashan", "Mundan", "Upnayan", "Sagai", "Tilak", "Vadhu Pravesh", "Grih Pravesh", "Bhoomi Pujan", "Vehicle Purchase"
  ].sort();

  // Extract location and natal Moon parameters
  const basic = data?.basic_details || {};
  const lat = basic.lat || data?.meta?.lat || 28.6139;
  const lon = basic.lon || data?.meta?.lon || 77.2090;
  const tz = basic.tz_offset || data?.meta?.tz_offset || 5.5;

  // Search natal Moon longitude
  let natalMoonLon = null;
  if (data?.planet_positions) {
    const moonObj = data.planet_positions.find(p => p.planet === "Moon" || p.name === "Moon");
    if (moonObj) natalMoonLon = moonObj.degree;
  }
  if (natalMoonLon === null && data?.meta?.moon_lon !== undefined) {
    natalMoonLon = data.meta.moon_lon;
  }

  const fetchHeatmap = async () => {
    setLoading(true);
    setError(null);
    setSelectedDayIdx(null);
    try {
      const payload = {
        start_date: startDate,
        days: parseInt(days, 10),
        tz: tz,
        lat: lat,
        lon: lon,
        ceremony: ceremony,
        user_profile: natalMoonLon !== null ? { moon_lon: natalMoonLon } : {}
      };

      const res = await fetch('http://localhost:8000/api/muhurt/heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Divine heatmap calculation failed.");
      }

      const result = await res.json();
      setHeatmapData(result.heatmap || []);
      if (result.heatmap && result.heatmap.length > 0) {
        setSelectedDayIdx(0); // auto-select first day
      }
    } catch (err) {
      console.error(err);
      setError("Failed to resolve cosmic timeline. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, [ceremony, startDate, days, data]);

  // Color mapping functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Highly Auspicious":
        return "bg-white border-2 border-emerald-500 hover:border-emerald-600 text-emerald-800 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
      case "Auspicious":
        return "bg-white border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700";
      case "Neutral":
        return "bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-700";
      case "Inauspicious":
        return "bg-white border-2 border-rose-400 hover:border-rose-500 text-rose-700";
      default:
        return "bg-white border-2 border-slate-200 text-slate-500";
    }
  };

  const getChoghadiyaQualityColor = (quality) => {
    switch (quality) {
      case "Good": return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "Neutral": return "bg-amber-50 border-amber-200 text-amber-800";
      default: return "bg-rose-50 border-rose-200 text-rose-800";
    }
  };

  // Check if Hora Lord is generally auspicious
  const isAuspiciousHoraLord = (lord) => {
    return ["Jupiter", "Venus", "Mercury", "Moon"].includes(lord);
  };

  const selectedDay = selectedDayIdx !== null ? heatmapData[selectedDayIdx] : null;

  return (
    <div className="w-full flex flex-col gap-8 bg-rose-100 border border-slate-900 p-8 rounded-3xl shadow-2xl text-slate-900 font-serif">

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-100 border border-slate-850 p-6 rounded-2xl">
        <div>
          <label className="block text-[14px] text-black uppercase tracking-widest font-mono font-bold mb-2">Auspicious Ceremony</label>
          <select
            value={ceremony}
            onChange={(e) => setCeremony(e.target.value)}
            className="w-full bg-white border border-slate-800 text-black px-3.5 py-2.5 rounded-xl text-sm font-sans font-bold focus:border-emerald-400 outline-none"
          >
            {ceremonies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[14px] text-black uppercase tracking-widest font-mono font-bold mb-2"> Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white border border-slate-800 text-black px-3.5 py-2 rounded-xl text-sm font-sans font-bold focus:border-emerald-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-[14px] text-black uppercase tracking-widest font-mono font-bold mb-2">Days to Scan</label>
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full bg-white border border-slate-800 text-black px-3.5 py-2.5 rounded-xl text-sm font-sans font-bold focus:border-emerald-400 outline-none"
          >
            <option value={15}>15 Days</option>
            <option value={30}>30 Days (Recommended)</option>
            <option value={45}>45 Days</option>
            <option value={60}>60 Days</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchHeatmap}
            disabled={loading}
            className="w-full bg-white hover:rose-100 text-slate-950 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[14px] shadow-lg hover:shadow-emerald-500/20 transition-all font-mono"
          >
            {loading ? 'Synthesizing Muhurtas...' : 'Calculate Heatmap'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-xl text-sm italic">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="font-serif italic text-sm text-slate-700">Scanning Tithi, Nakshatra, Chandra Bala, and Hora transits...</p>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* Calendar Heatmap Grid */}
          <div className="w-full xl:w-[55%] flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-amber-700">30-Day Auspiciousness Map</h3>
              <p className="text-[14px] text-slate-900 mt-1 leading-relaxed">
                Scores incorporate weekday constraints, Tara Bala, Chandra Bala, and solar boundary combustions. Click any day block to inspect hourly Hora & Choghadiya slots.
              </p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 mt-2">
              {heatmapData.map((d, index) => {
                const dateObj = new Date(d.date);
                const dayNum = dateObj.getDate();
                const monthFull = dateObj.toLocaleDateString([], { month: 'long' });
                const isSelected = selectedDayIdx === index;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDayIdx(index)}
                    className={`cursor-pointer p-3.5 rounded-xl flex flex-col items-center justify-between text-center transition-all ${getStatusColor(d.status)} ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-100 transform scale-105' : ''
                      }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest font-black opacity-80">
                      {d.weekday}
                    </span>
                    <span className="text-2xl font-black font-sans my-1">{dayNum}</span>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold opacity-60">
                      {monthFull}
                    </span>

                    <div className="mt-2 text-[10px] font-mono font-black bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                      {d.score}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Heatmap Legend */}
            <div className="mt-3 bg-white/80 p-4 border border-slate-300 rounded-xl flex flex-wrap justify-between items-center gap-3">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-700">Heatmap Legend:</span>
              <div className="flex gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 bg-white" /> Highly Auspicious
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-300 bg-white" /> Auspicious
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white" /> Neutral
                </span>
                <span className="flex items-center gap-1.5 text-rose-800">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-rose-400 bg-white" /> Avoid
                </span>
              </div>
            </div>
          </div>

          {/* Day Breakdown Details */}
          <div className="w-full xl:w-[45%] bg-white border border-slate-850 p-6 rounded-2xl flex flex-col gap-6">
            {selectedDay ? (
              <div className="flex flex-col gap-6">

                {/* Day Header */}
                <div className="border-b border-slate-850 pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-700 italic">
                      {new Date(selectedDay.date).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-mono text-slate-600">
                      <span>📅 Tithi: <strong>{selectedDay.tithi}</strong></span>
                      <span>🌙 Star: <strong>{selectedDay.nakshatra}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] uppercase font-mono tracking-wider font-bold block text-black">Kaala Score</span>
                    <span className="text-3xl font-black font-sans text-amber-400 mt-1 block">{selectedDay.score}/100</span>
                  </div>
                </div>

                {/* Score Reasons Explanation list */}
                <div>
                  <h4 className="text-[14px] uppercase font-mono font-bold tracking-wider text-black mb-2">Astrometric Calculations</h4>
                  <ul className="flex flex-col gap-1.5 pl-1.5">
                    {selectedDay.reasons.map((r, idx) => (
                      <li key={idx} className="text-[14px] flex items-center gap-2 text-black font-sans leading-relaxed">
                        <span className={`text-[12px] ${r.toLowerCase().includes('inauspicious') || r.toLowerCase().includes('combustion') || r.toLowerCase().includes('mismatch') ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ●
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Segment Tabs for Choghadiya vs Horas */}
                <div className="flex border-b border-slate-800">
                  <button
                    onClick={() => setDetailTab('choghadiya')}
                    className={`flex-1 text-center py-2.5 text-[16px] font-bold font-mono tracking-widest uppercase border-b-2 transition-all ${detailTab === 'choghadiya' ? 'border-amber-400 text-amber-700' : 'border-transparent text-slate-450 hover:text-black'
                      }`}
                  >
                    ⏰ Choghadiya Muhurtas
                  </button>
                  <button
                    onClick={() => setDetailTab('horas')}
                    className={`flex-1 text-center py-2.5 text-[16px] font-bold font-mono tracking-widest uppercase border-b-2 transition-all ${detailTab === 'horas' ? 'border-amber-400 text-black' : 'border-transparent text-black hover:text-black'
                      }`}
                  >
                    🪐 Hourly Vedic Horas
                  </button>
                </div>

                {/* Tab content 1: Choghadiya */}
                {detailTab === 'choghadiya' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-[14px] uppercase font-mono font-bold tracking-widest text-black">☀️ Day Choghadiya</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedDay.choghadiya?.day?.map((ch, idx) => (
                          <div key={idx} className={`p-2.5 border rounded-lg flex items-center justify-between text-xs font-sans ${getChoghadiyaQualityColor(ch.quality)}`}>
                            <div>
                              <div className="font-bold">{ch.name}</div>
                              <div className="text-[15px] opacity-75 font-mono mt-0.5">{ch.start} - {ch.end}</div>
                            </div>
                            <span className="text-[13px] font-black uppercase tracking-wider font-mono bg-black/5 px-1.5 py-0.5 rounded">
                              {ch.quality}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2">
                      <h4 className="text-[18px] uppercase font-mono font-bold tracking-widest text-indigo-700">🌙 Night Choghadiya</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedDay.choghadiya?.night?.map((ch, idx) => (
                          <div key={idx} className={`p-2.5 border rounded-lg flex items-center justify-between text-xs font-sans ${getChoghadiyaQualityColor(ch.quality)}`}>
                            <div>
                              <div className="font-bold">{ch.name}</div>
                              <div className="text-[15px] opacity-75 font-mono mt-0.5">{ch.start} - {ch.end}</div>
                            </div>
                            <span className="text-[13px] font-black uppercase tracking-wider font-mono bg-black/5 px-1.5 py-0.5 rounded">
                              {ch.quality}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 2: Horas */}
                {detailTab === 'horas' && (
                  <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                    <div>
                      <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-700 border-b border-slate-300 pb-1 mb-2">☀️ Diurnal (Day) Horas</h4>
                      <div className="flex flex-col gap-1.5">
                        {selectedDay.horas?.day?.map((hr, idx) => {
                          const isAuspicious = isAuspiciousHoraLord(hr.lord);
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-100 border border-slate-200 font-sans hover:bg-slate-200 transition-all">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-600 text-[10px]">{hr.index.toString().padStart(2, '0')}.</span>
                                <span className={`font-black tracking-wide ${isAuspicious ? 'text-emerald-700' : 'text-slate-700'}`}>
                                  {hr.lord} Hora
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-slate-600">{hr.start} - {hr.end}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-black uppercase ${isAuspicious ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                  {isAuspicious ? 'Auspicious' : 'Neutral/Malefic'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-700 border-b border-slate-300 pb-1 mb-2">🌙 Nocturnal (Night) Horas</h4>
                      <div className="flex flex-col gap-1.5">
                        {selectedDay.horas?.night?.map((hr, idx) => {
                          const isAuspicious = isAuspiciousHoraLord(hr.lord);
                          return (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-100 border border-slate-200 font-sans hover:bg-slate-200 transition-all">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-600 text-[10px]">{hr.index.toString().padStart(2, '0')}.</span>
                                <span className={`font-black tracking-wide ${isAuspicious ? 'text-emerald-700' : 'text-slate-700'}`}>
                                  {hr.lord} Hora
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-slate-600">{hr.start} - {hr.end}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-black uppercase ${isAuspicious ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                  {isAuspicious ? 'Auspicious' : 'Neutral/Malefic'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-16 text-slate-600 italic font-serif">
                Select a day from the calendar grid on the left to inspect hourly breakdowns.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default MuhurtHeatmap;
