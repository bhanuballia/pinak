import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const VARGA_NAMES = {
  d1: "Janma (D1 - Main Chart)",
  d2: "Hora (D2 - Wealth)",
  d3: "Dreshkana (D3 - Siblings)",
  d4: "Chaturthamsha (D4 - Property)",
  d7: "Saptamsha (D7 - Children)",
  d9: "Navamsha (D9 - Marriage/Soul)",
  d10: "Dashamsha (D10 - Career)",
  d12: "Dwadashamsha (D12 - Parents)",
  d16: "Shodashamsha (D16 - Luxuries)",
  d20: "Vimshamsha (D20 - Spiritual)",
  d24: "Chaturvimshamsha (D24 - Education)",
  d27: "Saptavimshamsha (D27 - Strength)",
  d30: "Trimshamsha (D30 - Challenges)",
  d40: "Khavedamsha (D40 - Auspiciousness)",
  d45: "Akshavedamsha (D45 - Character)",
  d60: "Shashtiamsha (D60 - Past Life/Karma)"
};

const DASHA_SYSTEMS = {
  graha: [
    { key: 'vimshottari', name: 'Vimshottari Dasha' },
    { key: 'shodashottari', name: 'Shodashottari Dasha' },
    { key: 'chaturshitisama', name: 'Chaturshitisama Dasha' },
    { key: 'ashtottari', name: 'Ashtottari Dasha' },
    { key: 'dwisaptatisama', name: 'Dwisaptatisama Dasha' },
    { key: 'dwadashottari', name: 'Dwadashottari Dasha' },
    { key: 'panchottari', name: 'Panchottari Dasha' },
    { key: 'shatabdika', name: 'Shatabdika Dasha' },
    { key: 'shashtihayani', name: 'Shashtihayani Dasha' }
  ],
  rashi: [
    { key: 'chara', name: 'Chara Dasha' },
    { key: 'mandooka', name: 'Mandooka Dasha' },
    { key: 'drig', name: 'Drig Dasha' },
    { key: 'sudasha', name: 'Sudasha Dasha' }
  ],
  aayu: [
    { key: 'shoola', name: 'Shoola Dasha' },
    { key: 'niryaana_shoola', name: 'Niryana Shoola Dasha' },
    { key: 'sthira', name: 'Sthira Dasha' }
  ]
};

const getDashaFriendlyName = (key) => {
  for (const category in DASHA_SYSTEMS) {
    const found = DASHA_SYSTEMS[category].find(d => d.key === key);
    if (found) return found.name;
  }
  return 'Dasha';
};

const PLANETS_LIST = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_ABBREVIATIONS = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
  "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
};

const getPlanetColorHex = (planet) => {
  const colors = {
    "Sun": "#f59e0b", "Moon": "#e2e8f0", "Mars": "#ef4444",
    "Mercury": "#10b981", "Jupiter": "#fbbf24", "Venus": "#f472b6",
    "Saturn": "#6366f1", "Rahu": "#14b8a6", "Ketu": "#a78bfa", "Ascendant": "#38bdf8"
  };
  return colors[planet] || "#94a3b8";
};

const formatDecimalDegree = (deg) => {
  if (typeof deg !== 'number') return '';
  const degInSign = deg % 30;
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60);
  const s = Math.floor(((degInSign - d) * 60 - m) * 60);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

const calculateJaiminiKarakas = (planetPositions) => {
  if (!planetPositions || !Array.isArray(planetPositions)) return { k7: {}, k8: {} };

  const planetsFor7 = planetPositions.filter(p => !["Rahu", "Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet));
  const sorted7 = [...planetsFor7].sort((a, b) => (b.degree % 30) - (a.degree % 30));

  const k7Names = ["AK", "AmK", "BK", "MK", "PiK", "GK", "DK"];
  const k7 = {};
  sorted7.forEach((p, idx) => {
    if (idx < 7) k7[p.planet] = k7Names[idx];
  });

  const planetsFor8 = planetPositions.filter(p => !["Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet));
  const sorted8 = [...planetsFor8].map(p => {
    let deg = p.degree % 30;
    if (p.planet === "Rahu") deg = 30 - deg;
    return { ...p, degInSign: deg };
  }).sort((a, b) => b.degInSign - a.degInSign);

  const k8Names = ["AK", "AmK", "BK", "MK", "PiK", "PK", "GK", "DK"];
  const k8 = {};
  sorted8.forEach((p, idx) => {
    if (idx < 8) k8[p.planet] = k8Names[idx];
  });

  return { k7, k8 };
};

const AIOraclePanel = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [readingType, setReadingType] = useState('chart'); // 'chart' or 'dasha'
  const [selectedChart, setSelectedChart] = useState('d1');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const [selectedDashaSystem, setSelectedDashaSystem] = useState('vimshottari');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [md, setMd] = useState('Jupiter');
  const [ad, setAd] = useState('Saturn');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const endpoint = readingType === 'chart'
        ? '/api/ai/chart-reading'
        : readingType === 'dasha'
          ? '/api/ai/dasha-reading'
          : readingType === 'vimsopaka'
            ? '/api/ai/vimsopaka-reading'
            : readingType === 'shadbala'
              ? '/api/ai/shadbala-reading'
              : '/api/ai/planets-reading';

      const payload = {
        chart_data: data
      };

      if (readingType === 'chart') {
        payload.selected_chart = selectedChart;
      } else if (readingType === 'dasha') {
        payload.dasha_system = selectedDashaSystem;
        if (selectedDashaSystem === 'vimshottari') {
          payload.mahadasha = md;
          payload.antardasha = ad;
        } else {
          const list = data?.[selectedDashaSystem] || [];
          const periodObj = list[selectedPeriodIndex];
          if (!periodObj) {
            throw new Error(`No period data available for ${getDashaFriendlyName(selectedDashaSystem)}.`);
          }
          payload.dasha_name = getDashaFriendlyName(selectedDashaSystem);
          payload.selected_period = periodObj;
          payload.dasha_list = list;
        }
      }

      // Use full URL to hit FastAPI backend (assuming proxy is setup or running on same port locally)
      const res = await fetch(`${window.location.hostname === 'localhost' ? 'http://localhost:8000' : ''}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const resultData = await res.json();
      setResponse(resultData.result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate reading. Please ensure the backend is running and GEMINI_API_KEY is set in .env.');
    } finally {
      setLoading(false);
    }
  };

  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  return (
    <div className="w-full h-full min-h-[600px] bg-rose-50 p-8 text-indigo-100 flex flex-col font-serif">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-500/30">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-800 tracking-widest uppercase font-serif animate-pulse">
            ✨Vedic Astro Analysis
          </h2>
          <p className="text-[14px] text-black mt-1 uppercase tracking-widest">Powered by Vedic Astrology</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setReadingType('chart')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${readingType === 'chart' ? 'bg-amber-300 text-indigo-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black' : 'bg-rose-100 hover:bg-indigo-700/50 text-indigo-200'}`}
        >
          Full Life Reading
        </button>
        <button
          onClick={() => setReadingType('dasha')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${readingType === 'dasha' ? 'bg-amber-300 text-indigo-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black' : 'bg-rose-100 hover:bg-indigo-700/50 text-indigo-200'}`}
        >
          Specific Dasha Reading
        </button>
        <button
          onClick={() => setReadingType('vimsopaka')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${readingType === 'vimsopaka' ? 'bg-amber-300 text-indigo-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black' : 'bg-rose-100 hover:bg-indigo-700/50 text-indigo-200'}`}
        >
          Vimshopaka Strength Reading
        </button>
        <button
          onClick={() => setReadingType('shadbala')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${readingType === 'shadbala' ? 'bg-amber-300 text-indigo-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black' : 'bg-rose-100 hover:bg-indigo-700/50 text-indigo-200'}`}
        >
          Shadbala Strength Reading
        </button>
        <button
          onClick={() => setReadingType('planets')}
          className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${readingType === 'planets' ? 'bg-amber-300 text-indigo-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black' : 'bg-rose-100 hover:bg-indigo-700/50 text-indigo-200'}`}
        >
          Planet Tables Reading
        </button>
      </div>

      {readingType === 'chart' && (
        <div className="flex flex-col gap-1 mb-6 p-4 bg-indigo-950/10 rounded-xl border border-indigo-500/30 w-full md:w-80">
          <label className="text-xs uppercase tracking-widest text-black mb-1 font-bold">Select Chart to Analyze</label>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="bg-indigo-900 text-white p-2.5 rounded-lg outline-none border border-indigo-700 font-serif font-semibold"
          >
            {Object.entries(VARGA_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      )}

      {readingType === 'dasha' && (
        <div className="flex flex-col gap-4 mb-6 p-6 bg-indigo-950/50 rounded-xl border border-indigo-500/30 w-full md:w-[500px]">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs uppercase tracking-widest text-indigo-300 mb-1 font-bold">Dasha System</label>
            <select
              value={selectedDashaSystem}
              onChange={(e) => {
                setSelectedDashaSystem(e.target.value);
                setSelectedPeriodIndex(0);
              }}
              className="bg-indigo-900 text-white p-2.5 rounded-lg outline-none border border-indigo-700 font-sans font-bold"
            >
              <optgroup label="Graha Dasha (Planetary)">
                {DASHA_SYSTEMS.graha.map(sys => (
                  <option key={sys.key} value={sys.key}>{sys.name}</option>
                ))}
              </optgroup>
              <optgroup label="Rashi Dasha (Sign-based)">
                {DASHA_SYSTEMS.rashi.map(sys => (
                  <option key={sys.key} value={sys.key}>{sys.name}</option>
                ))}
              </optgroup>
              <optgroup label="Aayu Dasha (Longevity)">
                {DASHA_SYSTEMS.aayu.map(sys => (
                  <option key={sys.key} value={sys.key}>{sys.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {selectedDashaSystem === 'vimshottari' ? (
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-indigo-300 mb-1 font-bold">Mahadasha Lord</label>
                <select value={md} onChange={(e) => setMd(e.target.value)} className="bg-indigo-900 text-white p-2.5 rounded-lg outline-none border border-indigo-700 font-semibold">
                  {planets.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest text-indigo-300 mb-1 font-bold">Antardasha Lord</label>
                <select value={ad} onChange={(e) => setAd(e.target.value)} className="bg-indigo-900 text-white p-2.5 rounded-lg outline-none border border-indigo-700 font-semibold">
                  {planets.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {(() => {
                const list = data?.[selectedDashaSystem] || [];
                if (!list.length) {
                  return (
                    <p className="text-xs text-amber-400 italic font-semibold">
                      ⚠️ No calculated dasha periods found for {getDashaFriendlyName(selectedDashaSystem)}.
                    </p>
                  );
                }
                return (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs uppercase tracking-widest text-indigo-300 mb-1 font-bold">Select Dasha Period</label>
                    <select
                      value={selectedPeriodIndex}
                      onChange={(e) => setSelectedPeriodIndex(Number(e.target.value))}
                      className="bg-indigo-900 text-white p-2.5 rounded-lg outline-none border border-indigo-700 font-serif"
                    >
                      {list.map((d, index) => {
                        const name = d.lord || d.sign || d.item || 'Unknown';
                        const start = d.start !== undefined ? d.start.toFixed(1) : '0';
                        const end = d.end !== undefined ? d.end.toFixed(1) : '0';
                        return (
                          <option key={index} value={index}>
                            {name} ({start}y - {end}y)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {readingType === 'vimsopaka' && (
        <div className="flex flex-col gap-6 mb-6 p-6 bg-indigo-950/50 rounded-xl border border-indigo-500/30 w-full md:w-[600px]">
          <div>
            <h3 className="text-lg font-bold text-amber-300 font-serif mb-2">Vimshopaka Bala Overview</h3>
            <p className="text-xs text-indigo-300">
              Vimshopaka Bala measures the aggregate strength of planets across divisional (Varga) charts. Here is a summary of your strengths:
            </p>
          </div>

          {(() => {
            const assessment = data?.vimsopaka_assessment || {};
            const interpretations = assessment.interpretations || {};
            const summary = assessment.summary || {};

            if (!Object.keys(interpretations).length) {
              return (
                <p className="text-xs text-amber-400 italic font-semibold">
                  ⚠️ Vimshopaka assessment data not calculated for this chart.
                </p>
              );
            }

            return (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">Wealth Potential</div>
                    <div className="text-sm font-black text-amber-400 mt-1">{summary.wealth_potential}</div>
                  </div>
                  <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">Career Potential</div>
                    <div className="text-sm font-black text-amber-400 mt-1">{summary.career_potential}</div>
                  </div>
                  <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">Relationships</div>
                    <div className="text-sm font-black text-amber-400 mt-1">{summary.relationship_pattern}</div>
                  </div>
                  <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">Mental Balance</div>
                    <div className="text-sm font-black text-amber-400 mt-1">{summary.mental_stability}</div>
                  </div>
                </div>

                <div className="overflow-x-auto bg-indigo-950/70 rounded-lg border border-indigo-800/50 p-2 max-h-60 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-indigo-800 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-3">Planet</th>
                        <th className="py-2 px-3 text-center">Score (Max 20)</th>
                        <th className="py-2 px-3">Strength Class</th>
                        <th className="py-2 px-3">D1 House</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900/30">
                      {Object.entries(interpretations).map(([p, pData]) => (
                        <tr key={p} className="hover:bg-indigo-900/20">
                          <td className="py-2 px-3 font-bold text-white">{p}</td>
                          <td className="py-2 px-3 text-center font-bold font-mono text-amber-300">
                            {pData.vimsopaka_score}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${pData.strength === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                              pData.strength === 'Good' ? 'bg-sky-500/20 text-sky-300' :
                                pData.strength === 'Average' ? 'bg-indigo-500/20 text-indigo-300' :
                                  'bg-rose-500/20 text-rose-300'
                              }`}>
                              {pData.strength}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-indigo-300">House {pData.house || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {readingType === 'shadbala' && (
        <div className="flex flex-col gap-6 mb-6 p-6 bg-indigo-950/50 rounded-xl border border-indigo-500/30 w-full md:w-[600px]">
          <div>
            <h3 className="text-lg font-bold text-amber-300 font-serif mb-2">Shadbala Strength Overview</h3>
            <p className="text-xs text-indigo-300">
              Shadbala measures the sixfold planetary strength index in classical Rupas. Below is a summary of your planetary potency:
            </p>
          </div>

          {(() => {
            const strength = data?.strength || {};
            const planetsStrength = strength.planets || {};

            if (!Object.keys(planetsStrength).length) {
              return (
                <p className="text-xs text-amber-400 italic font-semibold">
                  ⚠️ Shadbala strength data not calculated for this chart.
                </p>
              );
            }

            const PLANET_CONFIGS = {
              "Sun": { hindi: "Surya", min: 5.0, icon: "☀️" },
              "Moon": { hindi: "Chandra", min: 6.0, icon: "🌙" },
              "Mars": { hindi: "Mangal", min: 5.0, icon: "⚔️" },
              "Mercury": { hindi: "Budha", min: 7.0, icon: "🌱" },
              "Jupiter": { hindi: "Guru", min: 6.5, icon: "☸️" },
              "Venus": { hindi: "Shukra", min: 5.5, icon: "💎" },
              "Saturn": { hindi: "Shani", min: 5.0, icon: "🪐" }
            };

            return (
              <div className="overflow-x-auto bg-indigo-950/70 rounded-lg border border-indigo-800/50 p-2">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-indigo-800 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Planet</th>
                      <th className="py-2 px-3 text-center">Score (Rupa)</th>
                      <th className="py-2 px-3 text-center">Required Min</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-center">BPHS Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/30">
                    {Object.entries(PLANET_CONFIGS).map(([p, config]) => {
                      const pData = planetsStrength[p] || {};
                      const total = pData.total || 0;
                      const isSufficient = total >= config.min;
                      const ratio = pData.ratio_data?.ratio || (total / config.min);

                      return (
                        <tr key={p} className="hover:bg-indigo-900/20">
                          <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{p}</span>
                            <span className="text-[9px] text-indigo-400 italic">({config.hindi})</span>
                          </td>
                          <td className="py-2 px-3 text-center font-bold font-mono text-amber-300">
                            {total.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-indigo-300 font-mono">
                            {config.min.toFixed(1)}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isSufficient ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}>
                              {isSufficient ? 'Sufficient' : 'Weak'}
                            </span>
                          </td>
                          <td className={`py-2 px-3 text-center font-bold font-mono ${ratio >= 1.0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            {ratio.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {readingType === 'planets' && (
        <div className="flex flex-col gap-6 mb-6 p-6 bg-indigo-950/50 rounded-xl border border-indigo-500/30 w-full md:w-[800px]">
          <div>
            <h3 className="text-lg font-bold text-amber-300 font-serif mb-2">Planetary Positions & Dignities</h3>
            <p className="text-xs text-indigo-300">
              Complete catalog of planetary positions, longitudes, nakshatras, dignities, avasthas, and Jaimini Karakas.
            </p>
          </div>

          {(() => {
            const planetPositions = data?.planet_positions || [];
            if (!planetPositions.length) {
              return (
                <p className="text-xs text-amber-400 italic font-semibold">
                  ⚠️ Planetary position data not available for this chart.
                </p>
              );
            }

            const { k7, k8 } = calculateJaiminiKarakas(planetPositions);
            const avasthas = data?.planetary_avasthas || {};
            const strengthPlanets = data?.strength?.planets || {};
            const ashtakavarga = data?.ashtakavarga?.planets || {};

            return (
              <div className="flex flex-col gap-6 w-full">
                {/* Table 1: Longitude & Nakshatras */}
                <div className="overflow-x-auto bg-indigo-950/70 rounded-lg border border-indigo-800/50 p-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 border-b border-indigo-900/50 pb-1 flex items-center gap-1.5">
                    <span>🌌</span> Longitudes & Nakshatras
                  </div>
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-indigo-800 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-3">Planet</th>
                        <th className="py-2 px-3">Longitude</th>
                        <th className="py-2 px-3">Sign</th>
                        <th className="py-2 px-3 text-center">House</th>
                        <th className="py-2 px-3">Nakshatra</th>
                        <th className="py-2 px-3 text-center">Pada</th>
                        <th className="py-2 px-3">Lord</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900/30">
                      {PLANETS_LIST.map(pName => {
                        const p = planetPositions.find(pos => pos.planet === pName || pos.name === pName);
                        if (!p) return null;

                        const color = getPlanetColorHex(pName);
                        const deg = p.degree;
                        const nakshatra = p.nakshatra || "";
                        const pada = p.nakshatra_pada || p.pada || "-";
                        const lord = p.nakshatra_lord || p.lord || "";
                        const retro = p.retrograde;

                        return (
                          <tr key={pName} className="hover:bg-indigo-900/20">
                            <td className="py-2 px-3 font-bold flex items-center gap-1.5" style={{ color }}>
                              <span>{pName}</span>
                              {retro && <span className="text-[9px] px-1 py-0.2 bg-rose-500/20 text-rose-300 rounded font-black">R</span>}
                            </td>
                            <td className="py-2 px-3 font-mono text-indigo-200">{formatDecimalDegree(deg)}</td>
                            <td className="py-2 px-3 text-white font-medium">{p.sign}</td>
                            <td className="py-2 px-3 text-center text-indigo-300 font-mono">H{p.house}</td>
                            <td className="py-2 px-3 text-indigo-100">{nakshatra}</td>
                            <td className="py-2 px-3 text-center font-mono text-indigo-300">{pada}</td>
                            <td className="py-2 px-3 text-indigo-300" style={{ color: getPlanetColorHex(lord) }}>{lord}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table 2: Dignity, Shadbala & Avastha */}
                <div className="overflow-x-auto bg-indigo-950/70 rounded-lg border border-indigo-800/50 p-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 border-b border-indigo-900/50 pb-1 flex items-center gap-1.5">
                    <span>💎</span> Dignity, Shadbala & Avasthas
                  </div>
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-indigo-800 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-3">Planet</th>
                        <th className="py-2 px-3">Dignity</th>
                        <th className="py-2 px-3 text-center">SB Ratio</th>
                        <th className="py-2 px-3 text-center">AV Pts</th>
                        <th className="py-2 px-3">Baladi Avastha</th>
                        <th className="py-2 px-3">Shyanadi Avastha</th>
                        <th className="py-2 px-3 text-center">JK7</th>
                        <th className="py-2 px-3 text-center">JK8</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-900/30">
                      {PLANETS_LIST.filter(pName => pName !== "Ascendant").map(pName => {
                        const p = planetPositions.find(pos => pos.planet === pName || pos.name === pName);
                        if (!p) return null;

                        const color = getPlanetColorHex(pName);
                        const dignity = p.dignity || "Neutral";
                        const sbData = strengthPlanets[pName] || {};
                        const sbRatio = sbData.ratio_data?.ratio || (p.shadbala_pct || 1.0);
                        const av = ashtakavarga[pName] || p.ashtakavarga || 4;

                        // Avasthas
                        const pAv = avasthas[pName] || {};
                        const baladi = pAv.baladi ? pAv.baladi.replace('\n', ' ') : "-";
                        const shyanadi = pAv.shyanadi ? pAv.shyanadi.replace('\n', ' ') : "-";

                        // Jaimini Karakas
                        const jk7 = k7[pName] || "-";
                        const jk8 = k8[pName] || "-";

                        return (
                          <tr key={pName} className="hover:bg-indigo-900/20">
                            <td className="py-2 px-3 font-bold" style={{ color }}>
                              {PLANET_ABBREVIATIONS[pName] || pName}
                            </td>
                            <td className="py-2 px-3 font-semibold text-indigo-100">{dignity}</td>
                            <td className={`py-2 px-3 text-center font-bold font-mono ${sbRatio >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {sbRatio.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-center font-bold font-mono text-indigo-300">{av}</td>
                            <td className="py-2 px-3 text-indigo-200 text-[11px]">{baladi}</td>
                            <td className="py-2 px-3 text-indigo-200 text-[11px]">{shyanadi}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-amber-300 text-[11px]" title="Jaimini 7 Karaka">{jk7}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-amber-400 text-[11px]" title="Jaimini 8 Karaka">{jk8}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full md:w-auto self-start bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mb-8"
      >
        {loading ? (
          <span className="animate-spin text-xl">⏳</span>
        ) : (
          <span className="text-xl">🔮</span>
        )}
        {loading ? 'Consulting the Cosmos...' : 'Consult the Oracle'}
      </button>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6 font-serif">
          {error}
        </div>
      )}

      {response && (
        <div className="flex-1 bg-slate-900/10 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-8 overflow-y-auto custom-scrollbar shadow-2xl">
          <div className="prose max-w-none prose-headings:font-serif prose-headings:text-red-700 prose-a:text-pink-500 prose-strong:text-black leading-relaxed prose-p:my-4 text-black prose-p:text-black prose-li:text-black">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}

      {!response && !loading && !error && (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-indigo-500/20 rounded-2xl p-6">
          <p className="text-black text-lg font-serif italic text-center max-w-md">
            Click the button above to generate a profound cosmological reading based on the native's birth chart and selected parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIOraclePanel;
