import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Gem, ShieldAlert, Heart, Sun, Flame, Droplets, Wind, Mountain, RefreshCw, Palette, Calendar, Layers, Compass, Triangle, Leaf, Moon, Printer, FileText } from 'lucide-react';
import remediesData from '../data/encyclopediaRemedies.json';

export default function EncyclopediaRemediesViewer() {
  const [selectedTab, setSelectedTab] = useState('personalizedReport'); // Default to Personalized Report
  const [selectedLagna, setSelectedLagna] = useState('Aries');
  const [selectedPlanet, setSelectedPlanet] = useState('Sun');
  const [selectedHouse, setSelectedHouse] = useState('H1');
  const [userAscendant, setUserAscendant] = useState(null);
  const [reportFontSize, setReportFontSize] = useState(18);
  const [transitList, setTransitList] = useState([]);
  const [transitLoading, setTransitLoading] = useState(false);
  const [transitError, setTransitError] = useState(null);
  
  const [nakshatraRemedies, setNakshatraRemedies] = useState(null);
  const [nakshatraLoading, setNakshatraLoading] = useState(false);
  const [nakshatraError, setNakshatraError] = useState(null);
  
  const [currentNakshatraRemedies, setCurrentNakshatraRemedies] = useState(null);
  const [currentNakshatraLoading, setCurrentNakshatraLoading] = useState(false);

  useEffect(() => {
    // Try auto-detecting user's Lagna/Ascendant from worksheetData
    try {
      const savedData = localStorage.getItem('worksheetData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const asc = parsed.chart?.ascendant_sign || parsed.basic?.ascendant || parsed.ascendant;
        if (asc && remediesData.lagnaGemMatrix[asc]) {
          setUserAscendant(asc);
          setSelectedLagna(asc);
        }
      }
    } catch (e) {
      console.warn("Could not parse user ascendant:", e);
    }

    const fetchTransitData = async () => {
      setTransitLoading(true);
      try {
        let bDate = '1990-01-01';
        let bTime = '12:00:00';
        let lat = 28.6139;
        let lon = 77.2090;
        let tz = 5.5;

        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          const bd = parsed.basic_details || parsed.basic || {};
          const meta = parsed.meta || {};
          bDate = bd.birth_date || meta.date || meta.dob || bDate;
          bTime = bd.birth_time || meta.time || meta.tob || bTime;
          if (bTime && bTime.split(':').length === 2) bTime += ':00';
          lat = Number(bd.lat || parsed.lat || lat);
          lon = Number(bd.lon || parsed.lon || lon);
          tz = Number(bd.tz_offset || parsed.tz_offset || tz);
        }

        const now = new Date();
        const transitDateStr = now.toISOString().split('T')[0];
        const transitTimeStr = now.toTimeString().split(' ')[0];

        const response = await fetch('/api/transit/animated', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            birth_date: bDate,
            birth_time: bTime,
            lat: lat,
            lon: lon,
            tz_offset: tz,
            transit_date: transitDateStr,
            transit_time: transitTimeStr,
            transit_tz_offset: tz
          })
        });

        if (!response.ok) throw new Error("Failed to fetch transit data");
        const resJson = await response.json();
        if (resJson.transit_chart) {
          setTransitList(resJson.transit_chart);
        }
      } catch (err) {
        console.error("Error fetching transit data:", err);
        setTransitError(err.message);
      } finally {
        setTransitLoading(false);
      }
    };

    const fetchNakshatraRemedies = async () => {
      setNakshatraLoading(true);
      try {
        const savedData = localStorage.getItem('worksheetData');
        let nakName = null;
        let payload = {};
        if (savedData) {
          const parsed = JSON.parse(savedData);
          nakName = parsed.nakshatra?.nakshatra || parsed.basic?.nakshatra || parsed.basic_details?.nakshatra || parsed.meta?.nakshatra;
          if (nakName) {
            payload.nakshatra_name = nakName;
          } else {
            const bd = parsed.basic_details || parsed.basic || {};
            const meta = parsed.meta || {};
            payload.birth_date = bd.birth_date || meta.date || meta.dob;
            payload.birth_time = bd.birth_time || meta.time || meta.tob;
            if (payload.birth_time && payload.birth_time.split(':').length === 2) payload.birth_time += ':00';
            payload.lat = Number(bd.lat || parsed.lat || 28.6139);
            payload.lon = Number(bd.lon || parsed.lon || 77.2090);
            payload.tz_offset = Number(bd.tz_offset || parsed.tz_offset || 5.5);
          }
        }
        
        if (!payload.nakshatra_name && !payload.birth_date) {
          payload.nakshatra_name = "Ashwini";
        }

        const response = await fetch('/api/remedies/nakshatra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Nakshatra remedies");
        const resJson = await response.json();
        setNakshatraRemedies(resJson);
      } catch (err) {
        console.error("Error fetching Nakshatra remedies:", err);
        setNakshatraError(err.message);
      } finally {
        setNakshatraLoading(false);
      }
    };

    fetchTransitData();
    fetchNakshatraRemedies();
  }, []);

  useEffect(() => {
    if (transitList && transitList.length > 0) {
      const moonTransit = transitList.find(p => p.planet === 'Mo' || p.planet === 'Moon');
      if (moonTransit && moonTransit.nakshatra) {
        const fetchCurrentNakshatraRemedies = async () => {
          setCurrentNakshatraLoading(true);
          try {
            const response = await fetch('/api/remedies/nakshatra', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nakshatra_name: moonTransit.nakshatra })
            });
            if (response.ok) {
              const resJson = await response.json();
              setCurrentNakshatraRemedies(resJson);
            }
          } catch (err) {
            console.error("Error fetching current transit Nakshatra remedies:", err);
          } finally {
            setCurrentNakshatraLoading(false);
          }
        };
        fetchCurrentNakshatraRemedies();
      }
    }
  }, [transitList]);

  const lagnaInfo = remediesData.lagnaGemMatrix[selectedLagna] || remediesData.lagnaGemMatrix['Aries'];
  const deityInfo = remediesData.presidingDeities[selectedPlanet] || remediesData.presidingDeities['Sun'];
  const gemInfo = remediesData.ninePrimaryGems.find(g => g.planet === selectedPlanet) || remediesData.ninePrimaryGems[0];

  const getPlanetFromGem = (gemName) => {
    if (!gemName) return null;
    const name = gemName.toLowerCase();
    if (name.includes('ruby')) return 'Sun';
    if (name.includes('pearl')) return 'Moon';
    if (name.includes('coral')) return 'Mars';
    if (name.includes('emerald')) return 'Mercury';
    if (name.includes('yellow sapphire') || name.includes('pukhraj')) return 'Jupiter';
    if (name.includes('diamond')) return 'Venus';
    if (name.includes('blue sapphire') || name.includes('neelam')) return 'Saturn';
    if (name.includes('hessonite') || name.includes('gomed')) return 'Rahu';
    if (name.includes('cat\'s eye') || name.includes('lehsuniya')) return 'Ketu';
    return null;
  };

  const auspiciousPlanets = [];
  if (lagnaInfo) {
    const p1 = getPlanetFromGem(lagnaInfo.lifeStone);
    const p2 = getPlanetFromGem(lagnaInfo.karakaStone);
    const p3 = getPlanetFromGem(lagnaInfo.luckyStone);
    if (p1) auspiciousPlanets.push(p1);
    if (p2) auspiciousPlanets.push(p2);
    if (p3) auspiciousPlanets.push(p3);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/20 text-amber-400 p-3.5 rounded-2xl border border-amber-500/30">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-amber-300 tracking-tight flex items-center gap-2">
                  Encyclopedia of Astrological Remedies
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Authentic Remedies from Maharishi Parasara, Jaimini, Lal Kitab & Tantra Shastra •
                </p>
              </div>
            </div>
            {userAscendant && (
              <div className="hidden lg:flex flex-col items-end bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
                <span className="text-[16px] text-amber-400 font-semibold uppercase">Auto Detected Lagna</span>
                <span className="text-[20px] font-bold text-amber-200">{userAscendant}</span>
              </div>
            )}
          </div>
        </div>

        {/* General Principles Alert */}
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-[20px] text-orange-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[18px] text-amber-400 shrink-0" />
            <span><strong>43-Day Rule:</strong> Pujas, Mantras, Gems & Rudrakshas show results after 43 days of continuous practice.</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-[18px] text-amber-400 shrink-0" />
            <span><strong>Ring vs Locket:</strong> Rings touch skin nerves connected to brain. Lockets require 2x weight.</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[18px] text-amber-400 shrink-0" />
            <span><strong>3-Year Rule:</strong> Re-charge or replace gems every 3 years (except Diamond).</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'personalizedReport', label: '📋 My Personalized Report', icon: FileText },
            { id: 'lagnaGems', label: '👑 Ascendant Gem Matrix', icon: Gem },
            { id: 'allGems', label: '💎 9 Primary Gems & Substitutes', icon: Sparkles },
            { id: 'rudraksha', label: '📿 Rudraksha (1 to 21 Mukhi)', icon: Layers },
            { id: 'yantras', label: '☸️ Yantras & Sacred Geometries', icon: Compass },
            { id: 'navagrahaPlants', label: '🌿 Navagraha Plant Remedies', icon: Leaf },
            { id: 'planetaryRelief', label: '🪐 Planetary Relief Remedies', icon: Sun },
            { id: 'zodiacRemedies', label: '♈️ Zodiac Sign Remedies', icon: Moon },
            { id: 'lalKitabHouses', label: '📜 Lal Kitab House Remedies', icon: Heart },
            { id: 'deities', label: '🕉️ Presiding Deities & Avatars', icon: BookOpen },
            { id: 'vratas', label: '🚩 Vratas & Fasting Protocol', icon: Calendar },
            { id: 'colorTherapy', label: '🎨 Color Therapy & Dress Guide', icon: Palette },
            { id: 'crystals', label: '🔮 Sacred Crystals & Lockets', icon: Sparkles },
            { id: 'rosaries', label: '📿 Holy Rosaries (Mala)', icon: Layers },
            { id: 'fengshui', label: '🪄 Fengshui Products', icon: Wind },
            { id: 'pyramids', label: '🔺 Pyramids', icon: Triangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold text-[20px] md:text-[20px] transition-all flex items-center gap-2 ${selectedTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-100 text-slate-900 hover:text-white hover:bg-slate-800 border border-slate-800'}`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 0: Personalized Remedies Report */}
        {selectedTab === 'personalizedReport' && (
          <div className="space-y-6">
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-report-container, .print-report-container * {
                  visibility: visible;
                  color: black !important;
                  text-shadow: none !important;
                  border-color: #cbd5e1 !important;
                  font-size: ${reportFontSize}px !important;
                }
                .print-report-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  background: white !important;
                  color: black !important;
                  padding: 20px;
                }
                .print-report-container select, .print-report-container button {
                  display: none !important;
                }
                .print-report-container .bg-slate-955, 
                .print-report-container .bg-slate-950,
                .print-report-container .bg-slate-900\/40,
                .print-report-container .bg-emerald-950\/30,
                .print-report-container .bg-rose-950\/20,
                .print-report-container .bg-amber-500\/10 {
                  background: #f8fafc !important;
                  border: 1px solid #cbd5e1 !important;
                }
              }
            `}</style>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-[22px] font-bold text-amber-300">📋 Personalized Kundali Remedies Report</h3>
                <p className="text-[20px] text-slate-400 mt-1">
                  Synthesized automatically based on your <strong>{selectedLagna}</strong> Ascendant (Lagna) and beneficial planetary rulers:
                  <span className="text-amber-400 font-bold ml-1">{auspiciousPlanets.join(', ')}</span>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Font Size Adjuster Controls */}
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-[14px] text-slate-300 font-bold uppercase">Size:</span>
                  <button
                    onClick={() => setReportFontSize(prev => Math.max(12, prev - 2))}
                    className="bg-slate-700 hover:bg-slate-600 text-amber-300 px-2 py-0.5 rounded font-black text-[16px] transition-all"
                    title="Decrease Font Size"
                  >
                    A-
                  </button>
                  <span className="text-white font-bold text-[15px] px-1">{reportFontSize}px</span>
                  <button
                    onClick={() => setReportFontSize(prev => Math.min(28, prev + 2))}
                    className="bg-slate-700 hover:bg-slate-600 text-amber-300 px-2 py-0.5 rounded font-black text-[16px] transition-all"
                    title="Increase Font Size"
                  >
                    A+
                  </button>
                </div>

                <select
                  value={selectedLagna}
                  onChange={(e) => setSelectedLagna(e.target.value)}
                  className="bg-emerald-400 border border-amber-500/40 text-black px-4 py-2 rounded-xl text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.keys(remediesData.lagnaGemMatrix).map(lagna => (
                    <option key={lagna} value={lagna} className="text-black bg-white">
                      {lagna} Lagna
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-[18px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Printer className="w-5 h-5" /> Print Report
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-xl text-[18px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <FileText className="w-5 h-5" /> Export as PDF
                </button>
              </div>
            </div>

            {/* Printable Report Container */}
            <div className="print-report-container space-y-8 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800" style={{ fontSize: `${reportFontSize}px` }}>
              {/* Header inside report */}
              <div className="text-center pb-6 border-b border-slate-800 space-y-2">
                <h2 className="text-[22px] font-bold text-amber-300 uppercase tracking-wider">Astro Remedies Prescription</h2>
                <p className="text-[20px] text-slate-300">Customized for <strong>{selectedLagna} Lagna</strong> • Generated on {new Date().toLocaleDateString()}</p>
                <div className="flex flex-wrap justify-center gap-4 text-[20px] font-mono pt-1 text-orange-400">
                  <span>Life Lord Gem: {lagnaInfo.lifeStone}</span>
                  <span>•</span>
                  <span>Karaka Lord Gem: {lagnaInfo.karakaStone}</span>
                  <span>•</span>
                  <span>Lucky Lord Gem: {lagnaInfo.luckyStone}</span>
                </div>
              </div>

              {/* 1. Auspicious Gemstones Section */}
              <div className="space-y-4">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Gem className="w-5 h-5 text-amber-400" /> 1. Prescribed Auspicious Gemstones (Ratna)
                </h3>
                <p className="text-[18px] text-slate-300">
                  These gemstones reinforce your beneficial house lords (Lagna, 5th, and 9th houses) to enhance health, wisdom, and fortune.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'Life Stone (1st Lord)', name: lagnaInfo.lifeStone, desc: 'Strengthens vitality, general health, immunity, self-confidence, and longevity.' },
                    { type: 'Karaka Stone (5th Lord)', name: lagnaInfo.karakaStone, desc: 'Enhances intelligence, education, creative talents, memory, and mantra sadhana.' },
                    { type: 'Lucky Stone (9th Lord)', name: lagnaInfo.luckyStone, desc: 'Attracts fortune, spiritual growth, divine grace, higher wisdom, and prosperity.' }
                  ].map(stone => {
                    const detailedGem = remediesData.ninePrimaryGems.find(g => g.gem.toLowerCase().includes(stone.name.split(' ')[0].toLowerCase()));
                    return (
                      <div key={stone.type} className="bg-slate-955 p-4 rounded-2xl border border-slate-850 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[18px] font-bold text-amber-400 uppercase tracking-widest block">{stone.type}</span>
                          <h4 className="text-[18px] font-bold text-slate-200 mt-1">{stone.name}</h4>
                          <p className="text-[18px] text-slate-400 leading-relaxed mt-1">{stone.desc}</p>
                        </div>
                        {detailedGem && (
                          <div className="pt-2 border-t border-slate-800 text-[18px] text-slate-300 space-y-1">
                            <p><strong>Metal:</strong> {detailedGem.metal} • <strong>Finger:</strong> {detailedGem.finger}</p>
                            <p><strong>Day:</strong> {detailedGem.day} • <strong>Weight:</strong> {detailedGem.caratWeight}</p>
                            {detailedGem.substitutes && detailedGem.substitutes.length > 0 && (
                              <p className="text-[18px] text-amber-300"><strong>Upratna (Substitutes):</strong> {detailedGem.substitutes.join(', ')}</p>
                            )}
                            <p className="text-emerald-300 font-mono text-[18px] bg-emerald-950/30 p-1.5 rounded mt-1 border border-emerald-500/10">
                              Mantra: {detailedGem.mantra}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Incompatible Alert */}
                <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-[20px] text-rose-300">
                    <strong>Critical Prohibitions:</strong> Do NOT wear <strong>{lagnaInfo.incompatible.join(', ')}</strong>. These gemstones rule malefic houses for your chart and can trigger severe setbacks.
                  </p>
                </div>
              </div>

              {/* 2. Presiding Deities & Invocation Mantras */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <BookOpen className="w-5 h-5 text-amber-400" /> 2. Beneficial Deities & Vedic Invocation Mantras
                </h3>
                <p className="text-[18px] text-slate-300">
                  Propitiating these specific deities brings alignment with your chart's positive planetary rulers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {auspiciousPlanets.map(planet => {
                    const deity = remediesData.presidingDeities[planet];
                    if (!deity) return null;
                    return (
                      <div key={planet} className="bg-slate-955 p-4 rounded-2xl border border-slate-850 space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                          <span className="text-[18px] font-bold text-amber-300">{planet} Lord Deity</span>
                          <span className="text-[18px] text-slate-400 font-mono">Parasara & Jaimini</span>
                        </div>
                        <p className="text-[18px] text-slate-200"><strong>Presiding Deity:</strong> {deity.presidingDeity}</p>
                        <p className="text-[18px] text-slate-200"><strong>Vishnu Avatar:</strong> {deity.vishnuAvatar}</p>
                        <p className="text-[18px] text-slate-200"><strong>Tantrik Deity:</strong> {deity.tantrikDeity}</p>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800/80 mt-2">
                          <span className="text-[18px] text-amber-400 block font-mono uppercase">Vedic Mantra:</span>
                          <p className="text-[18px] font-mono text-amber-200 leading-snug mt-0.5">{deity.vedicMantra}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Recommended Rudrakshas */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Layers className="w-5 h-5 text-amber-400" /> 3. Recommended Rudraksha Beads
                </h3>
                <p className="text-[18px] text-slate-300">
                  Beads ruled by your auspicious planets will resonate with your energy pathways and balance your mind, body, and chart.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {remediesData.rudrakshaDetails
                    .filter(r => auspiciousPlanets.some(ap => r.planet.toLowerCase().includes(ap.toLowerCase())))
                    .map(item => (
                      <div key={item.mukhi} className="bg-slate-955 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-amber-500/20 transition-all">
                        <div>
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                            <span className="text-[18px] font-bold text-amber-300">{item.mukhi}</span>
                            <span className="text-[18px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                              {item.planet.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[18px] text-slate-300"><strong>Deity:</strong> {item.deity}</p>
                          <p className="text-[18px] text-slate-300 mt-1"><strong>Benefits:</strong> {item.benefits}</p>
                          <p className="text-[18px] text-emerald-300 mt-1"><strong>Health:</strong> {item.healthEffect}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 mt-2">
                          <span className="text-[18px] text-amber-400 font-mono block">Japa Mantra:</span>
                          <span className="text-[18px] font-mono text-slate-200">{item.mantra}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 4. Navagraha Plant Remedies */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Leaf className="w-5 h-5 text-amber-400" /> 4. Navagraha Plant Remedies
                </h3>
                <p className="text-[18px] text-slate-300">
                  Using, watering, or carrying roots of these plants strengthens your primary planets naturally.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(remediesData.navagrahaPlantRemedies)
                    .filter(([pl]) => auspiciousPlanets.includes(pl))
                    .map(([planet, item]) => (
                      <div key={planet} className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                        <div className="border-b border-slate-800 pb-1.5">
                          <strong className="text-[18px] text-amber-300 block">{item.sacredPlant}</strong>
                          <span className="text-[18px] text-slate-400">Rules {planet} ({item.physicalGovernance.split(',')[0]})</span>
                        </div>
                        <p className="text-[18px] text-slate-300"><strong>Medicinal Parts:</strong> {item.medicinalComponents}</p>
                        <p className="text-[18px] text-slate-300"><strong>Therapeutic Profile:</strong> {item.therapeuticProfile}</p>
                        <p className="text-[18px] text-emerald-300 bg-emerald-950/20 p-2 rounded mt-1 border border-emerald-500/10">
                          <strong>Remedy:</strong> {item.practicalRemedies?.[Object.keys(item.practicalRemedies)[0]] || "Worship the tree daily."}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* 5. Planetary Relief Remedies */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Calendar className="w-5 h-5 text-amber-400" /> 5. Planetary Relief Remedies
                </h3>
                <p className="text-[18px] text-slate-300">
                  Fasting and charity resolve planetary afflictions and invoke positive energies for your Lagna.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(remediesData.planetaryReliefRemedies)
                    .filter(([pl]) => auspiciousPlanets.includes(pl))
                    .map(([planet, item]) => (
                      <div key={planet} className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                        <div className="border-b border-slate-800 pb-1.5 flex justify-between items-center">
                          <strong className="text-[18px] text-amber-300">{planet} Fast & Daan</strong>
                          <span className="text-[18px] text-amber-400 font-bold font-mono">Count: {item.invocationCount}</span>
                        </div>
                        <p className="text-[18px] text-slate-300"><strong>Duration:</strong> {item.fastingDuration}</p>
                        <p className="text-[18px] text-slate-300 leading-relaxed"><strong>Fasting Diet:</strong> {item.fastingProtocol}</p>
                        <p className="text-[18px] text-amber-200"><strong>Donations:</strong> {item.donationItems}</p>
                        <p className="text-[18px] text-slate-300"><strong>Root Amulet:</strong> {item.amuletRemedy} (Time: {item.amuletRitualTiming})</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* 6. Color Therapy & Clothing Guide */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Palette className="w-5 h-5 text-amber-400" /> 6. Color Therapy & Lifestyle Guide
                </h3>
                <p className="text-[18px] text-slate-300">
                  Surrounding yourself with these colors balances your body's energy nodes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {auspiciousPlanets.map(planet => {
                    const colorDetails = remediesData.colorTherapy.planetColors[planet];
                    if (!colorDetails) return null;
                    return (
                      <div key={planet} className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-1">
                        <strong className="text-[18px] text-amber-300 block">{planet}'s Color</strong>
                        <p className="text-[18px] text-slate-200"><strong>Color:</strong> {colorDetails.color}</p>
                        <p className="text-[18px] text-slate-300 leading-relaxed"><strong>Quality:</strong> {colorDetails.quality}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7. Yantras & Sacred Geometries */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Compass className="w-5 h-5 text-amber-400" /> 7. Prescribed Yantras & Sacred Geometries
                </h3>
                <p className="text-[18px] text-slate-300">
                  These geometric yantras channel cosmic energy to balance the elements and houses associated with your Lagna chart.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {remediesData.yantraDetails
                    .filter(y => {
                      if (y.name.includes("Sri Yantra") || y.name.includes("Vastu") || y.name.includes("Navgrah")) return true;
                      return auspiciousPlanets.some(ap => {
                        const text = `${y.name} ${y.deity} ${y.benefits}`.toLowerCase();
                        return text.includes(ap.toLowerCase()) || (ap === 'Sun' && text.includes('surya')) || (ap === 'Jupiter' && text.includes('guru'));
                      });
                    })
                    .map(y => (
                      <div key={y.name} className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start border-b border-slate-800 pb-1">
                            <strong className="text-[18px] text-amber-300">{y.name}</strong>
                            <span className="text-[18px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                              {y.direction}
                            </span>
                          </div>
                          <p className="text-[18px] text-slate-300 mt-1"><strong>Presiding Deity:</strong> {y.deity}</p>
                          <p className="text-[18px] text-slate-300 leading-relaxed"><strong>Benefits:</strong> {y.benefits}</p>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800/80 mt-2">
                          <span className="text-[18px] text-amber-400 block font-mono uppercase">Mantra:</span>
                          <p className="text-[18px] font-mono text-amber-200 mt-0.5 leading-snug">{y.mantra}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 8. Zodiac Sign (Lagna) Specific Remedies */}
              {remediesData.zodiacSignRemedies[selectedLagna] && (() => {
                const signData = remediesData.zodiacSignRemedies[selectedLagna];
                return (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Moon className="w-5 h-5 text-amber-400" /> 8. Zodiac Sign ({selectedLagna}) Specific Remedies
                    </h3>
                    <div className="bg-slate-955 p-5 rounded-2xl border border-slate-855 space-y-3">
                      <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[18px] font-bold text-slate-200">Lagna Sign: {selectedLagna}</span>
                        <span className="text-[18px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
                          Ruling Planet: {signData.rulingPlanet}
                        </span>
                      </div>
                      <p className="text-[18px] text-slate-300"><strong>Astrological Profile:</strong> {signData.physicalAstrologicalProperties}</p>
                      <p className="text-[18px] text-slate-300"><strong>Sacred Tree Root:</strong> {signData.sacredRootTree} (Wear wrapped in {signData.talismanWrapCloth || 'Yellow Fabric'})</p>
                      <p className="text-[18px] text-slate-300"><strong>Harvesting Alignment:</strong> {signData.harvestingAlignment}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[18px] text-amber-400 font-bold uppercase">Activation Beej Mantra:</span>
                          <p className="text-[18px] font-mono text-slate-200 mt-1"><strong>Mantra:</strong> {signData.activationBeejMantra?.mantra} (Direction: {signData.activationBeejMantra?.direction})</p>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[18px] text-amber-400 font-bold uppercase">Fasting & Donations:</span>
                          <p className="text-[18px] text-slate-200 mt-1"><strong>Fasting:</strong> {signData.fastingRules?.duration} ({signData.fastingRules?.protocol})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 9. Lal Kitab House Remedies, Debts & Prohibitions */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Heart className="w-5 h-5 text-amber-400" /> 9. Lal Kitab House Remedies, Debts & Warnings
                </h3>
                <p className="text-[18px] text-slate-300">
                  Lal Kitab focuses on specific house placement remedies, ancestral karmic debts (Pitru Rina), and strict donation prohibitions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1st House Remedies for auspicious planets */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Lagna (1st House) Remedies</strong>
                    <div className="space-y-2 text-[18px]">
                      {auspiciousPlanets.map(planet => {
                        const h1Remedy = remediesData.lalKitabHouseRemedies[planet]?.H1;
                        if (!h1Remedy) return null;
                        return (
                          <div key={planet} className="bg-slate-950 p-2 rounded border border-slate-800/80">
                            <span className=" text-amber-400 font-bold block">{planet} in H1:</span>
                            <p className="  text-slate-300 mt-0.5">{h1Remedy}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Relevant Debts */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Auspicious Planetary Debts</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.lalKitabSystem?.ninePlanetaryDebts
                        ?.filter(d => auspiciousPlanets.some(ap => d.debt.includes(ap)))
                        .map(d => (
                          <div key={d.debt} className="bg-slate-955 p-2 rounded border border-slate-800/80">
                            <span className="text-[18px] text-amber-400 font-bold block">{d.debt}:</span>
                            <p className="text-[18px] text-slate-400 leading-tight"><strong>Cause:</strong> {d.cause}</p>
                            <p className="text-[18px] text-emerald-300 mt-0.5"><strong>Remedy:</strong> {d.remedy}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Donation Warnings */}
                  <div className="bg-rose-950/10 border border-rose-500/10 p-4 rounded-2xl space-y-2">
                    <strong className="text-[20px] text-rose-300 block border-b border-rose-900/30 pb-1.5 uppercase">Strict Prohibitions</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.lalKitabSystem?.strictDonationWarnings
                        ?.filter(w => auspiciousPlanets.some(ap => w.condition.includes(ap)))
                        .map((w, idx) => (
                          <div key={idx} className="bg-slate-950/80 p-2 rounded border border-rose-500/10">
                            <span className="text-[18px] text-rose-400 font-bold block">{w.condition}:</span>
                            <p className="text-[18px] text-slate-300 mt-0.5">{w.warning}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 10. Element-Based Vastu, Fengshui & Pyramids */}
              {(() => {
                const SIGN_ELEMENTS = {
                  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
                  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
                  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
                  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
                };
                const lagnaElement = SIGN_ELEMENTS[selectedLagna] || 'Fire';

                // Filter items based on element affinity
                let recommendedFengshui = [];
                let recommendedPyramids = [];

                if (remediesData.lalKitabSystem?.fengshui?.products && remediesData.lalKitabSystem?.pyramids?.items) {
                  if (lagnaElement === 'Fire') {
                    recommendedFengshui = remediesData.lalKitabSystem.fengshui.products.filter(p => p.name.includes("Buddha") || p.name.includes("Mirror"));
                    recommendedPyramids = remediesData.lalKitabSystem.pyramids.items.filter(it => it.name.includes("Brass") || it.name.includes("Set") || it.name.includes("Sriyantra"));
                  } else if (lagnaElement === 'Water') {
                    recommendedFengshui = remediesData.lalKitabSystem.fengshui.products.filter(p => p.name.includes("Fish") || p.name.includes("Duck") || p.name.includes("Buddha"));
                    recommendedPyramids = remediesData.lalKitabSystem.pyramids.items.filter(it => it.name.includes("Metal") || it.name.includes("Sriyantra"));
                  } else if (lagnaElement === 'Air') {
                    recommendedFengshui = remediesData.lalKitabSystem.fengshui.products.filter(p => p.name.includes("Chimes") || p.name.includes("Coins") || p.name.includes("Tree"));
                    recommendedPyramids = remediesData.lalKitabSystem.pyramids.items.filter(it => it.name.includes("Locket") || it.name.includes("Eight Metals"));
                  } else { // Earth
                    recommendedFengshui = remediesData.lalKitabSystem.fengshui.products.filter(p => p.name.includes("Tortoise") || p.name.includes("Duck"));
                    recommendedPyramids = remediesData.lalKitabSystem.pyramids.items.filter(it => it.name.includes("Set") || it.name.includes("Sriyantra"));
                  }
                }

                return (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-[18px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Wind className="w-5 h-5 text-amber-400" /> 10. Vastu, Fengshui & Pyramid Recommendations (Element: {lagnaElement})
                    </h3>
                    <p className="text-[18px] text-slate-300">
                      Since your Lagna belongs to the <strong>{lagnaElement} Element</strong>, the following Vastu products are highly recommended to balance spatial energies.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Fengshui */}
                      <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                        <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Compatible Fengshui Products</strong>
                        <div className="space-y-2 text-[18px]">
                          {recommendedFengshui.map(p => (
                            <div key={p.name} className="bg-slate-950 p-2.5 rounded border border-slate-800">
                              <strong className="text-amber-400 font-bold block">{p.name}</strong>
                              <p className="text-slate-300 mt-0.5">{p.purpose}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pyramids */}
                      <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                        <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Compatible Pyramids & Yantras</strong>
                        <div className="space-y-2 text-[18px]">
                          {recommendedPyramids.map(it => (
                            <div key={it.name} className="bg-slate-950 p-2.5 rounded border border-slate-800">
                              <strong className="text-amber-400 font-bold block">{it.name}</strong>
                              <p className="text-slate-300 mt-0.5">{it.purpose}</p>
                              {it.mantra && <p className="text-[18px] text-emerald-300 font-mono mt-1">Mantra: {it.mantra}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 11. Prescribed Crystals, Lockets & Rosaries */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> 11. Prescribed Crystals, Lockets & Rosaries (Mala)
                </h3>
                <p className="text-[18px] text-slate-300">
                  These sacred energy conductors are selected specifically to align with your auspicious house rulers and planetary element.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crystals & Lockets */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Recommended Crystals & Lockets</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.lalKitabSystem?.crystals?.items
                        ?.filter(c => {
                          if (c.name.includes("Sriyantra") || c.name.includes("Ganesha") || c.name.includes("Tortoise") || c.name.includes("Ball") || c.name.includes("Pyramid")) return true;
                          return auspiciousPlanets.some(ap => c.name.toLowerCase().includes(ap.toLowerCase()));
                        })
                        .map(c => (
                          <div key={c.name} className="bg-slate-950 p-2.5 rounded border border-slate-800">
                            <strong className="text-amber-400 font-bold block">{c.name}</strong>
                            <p className="text-slate-300 mt-0.5">{c.purpose}</p>
                            {c.mantra && <p className="text-[18px] text-emerald-300 font-mono mt-1">Mantra: {c.mantra}</p>}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Rosaries & Mala */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Recommended Holy Rosaries (Mala)</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.lalKitabSystem?.rosaries?.items
                        ?.filter(r => {
                          if (r.name.includes("Navratna") || r.name.includes("Kaya Kalpa") || r.name.includes("Crystal and Rudraksha")) return true;
                          return auspiciousPlanets.some(ap => {
                            const name = r.name.toLowerCase();
                            const purp = r.purpose.toLowerCase();
                            if (ap === 'Sun' && (name.includes('sun') || name.includes('sandalwood') || name.includes('putra'))) return true;
                            if (ap === 'Moon' && (name.includes('pearl') || name.includes('crystal'))) return true;
                            if (ap === 'Mars' && (name.includes('coral') || name.includes('sandalwood'))) return true;
                            if (ap === 'Mercury' && (name.includes('emerald') || name.includes('saraswati') || name.includes('ganesh'))) return true;
                            if (ap === 'Jupiter' && (name.includes('sandalwood') || name.includes('turmeric') || name.includes('tulsi') || name.includes('putra'))) return true;
                            if (ap === 'Venus' && (name.includes('pearl') || name.includes('agate') || name.includes('lotus') || name.includes('turquoise'))) return true;
                            if (ap === 'Saturn' && (name.includes('rudraksha') || name.includes('quicksilver') || name.includes('parad') || name.includes('agate'))) return true;
                            return name.includes(ap.toLowerCase()) || purp.includes(ap.toLowerCase());
                          });
                        })
                        .map(r => (
                          <div key={r.name} className="bg-slate-955 p-2.5 rounded border border-slate-800">
                            <strong className="text-amber-400 font-bold block">{r.name}</strong>
                            <p className="text-slate-300 mt-0.5">{r.purpose}</p>
                            {r.mantra && <p className="text-[18px] text-emerald-300 font-mono mt-1">Mantra: {r.mantra}</p>}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 12. Sacred Mantra Sadhana & Code of Conduct */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <BookOpen className="w-5 h-5 text-amber-400" /> 12. Sacred Mantra Sadhana & Code of Conduct
                </h3>
                <p className="text-[18px] text-slate-300">
                  Follow these scriptural Japa methods, chakra alignments, and guidelines to activate your remedies successfully.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Sadhaka Code of Conduct & Japa Rules */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-3">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase font-bold">Japa Methods & Sadhaka Rules</strong>
                    <div className="text-[18px] text-slate-300 space-y-2">
                      <p><strong>Japa Methods:</strong></p>
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        {remediesData.meditationAndMantras?.japaMethodsAndRules?.japaMethods?.map(m => (
                          <li key={m.type}><strong>{m.type}</strong>: {m.description}</li>
                        ))}
                      </ul>
                      <p className="text-emerald-400 mt-2"><strong>Mantra Siddhi Rule:</strong> {remediesData.meditationAndMantras?.japaMethodsAndRules?.mantraSiddhiRule}</p>
                      <p className="text-orange-400 mt-2"><strong>Sadhaka Codes:</strong></p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                        {remediesData.meditationAndMantras?.japaMethodsAndRules?.sadhakaCodes?.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Chakras & Seed Mantras */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Auspicious Chakras & Seed Mantras</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.meditationAndMantras?.chakrasAndSeedMantras?.map(c => {
                        const isAuspicious = auspiciousPlanets.some(ap => c.planet && c.planet.toLowerCase().includes(ap.toLowerCase()));
                        return (
                          <div key={c.chakra} className={`p-2 rounded border ${isAuspicious ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'}`}>
                            <div className="flex justify-between font-bold">
                              <span className={isAuspicious ? 'text-amber-400' : 'text-slate-300'}>{c.chakra}</span>
                              <span className="text-emerald-300 font-mono">Seed: {c.seedMantra}</span>
                            </div>
                            <p className="text-[16px] text-slate-400">Planet: {c.planet} • Position: {c.position}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Gayatri & Dashavtar Mantras */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                  {/* Gayatri Mantras */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Your Auspicious Gayatri Mantras</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.meditationAndMantras?.keyGayatriMantras?.map(g => {
                        const isAuspicious = auspiciousPlanets.some(ap => g.name.toLowerCase().includes(ap.toLowerCase()) || g.purpose.toLowerCase().includes(ap.toLowerCase()));
                        return (
                          <div key={g.name} className={`p-2.5 rounded border ${isAuspicious ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'}`}>
                            <span className={`font-bold block ${isAuspicious ? 'text-amber-400' : 'text-slate-300'}`}>
                              {g.name} Gayatri {isAuspicious ? '🌟' : ''}
                            </span>
                            <p className="font-mono text-[18px] text-slate-200 mt-1">{g.mantra}</p>
                            <p className="text-[18px] text-slate-400 mt-0.5">Purpose: {g.purpose}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dashavtar Mantras */}
                  <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                    <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase">Beneficial Vishnu Dashavtar Mantras</strong>
                    <div className="space-y-2 text-[18px]">
                      {remediesData.meditationAndMantras?.dashavtarMantras
                        ?.filter(d => auspiciousPlanets.includes(d.planet))
                        .map(d => (
                          <div key={d.avatar} className="bg-slate-955 p-2 rounded border border-slate-800">
                            <div className="flex justify-between">
                              <span className="text-amber-400 font-bold">{d.avatar} Avatar</span>
                              <span className="text-[18px] text-slate-400">({d.planet} Lord)</span>
                            </div>
                            <p className="font-mono text-[18px] text-slate-200 mt-1">{d.mantra}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Special Purpose Mantras */}
                <div className="bg-slate-955 p-4 rounded-2xl border border-slate-855 space-y-2">
                  <strong className="text-[18px] text-amber-300 block border-b border-slate-800 pb-1.5 uppercase font-bold">Special Purpose Mantras</strong>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[18px]">
                    {remediesData.meditationAndMantras?.specialPurposeMantras?.map(sp => (
                      <div key={sp.purpose} className="bg-slate-955 p-2.5 rounded border border-slate-800">
                        <strong className="text-amber-400">{sp.purpose}</strong> ({sp.deity})
                        <p className="font-mono text-[18px] text-slate-300 mt-1">{sp.mantra}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 13. Real-Time Transit-Based Remedies (Gochar Remedial Guide) */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> 13. Real-Time Transit-Based Remedies (Gochar Remedial Guide)
                </h3>
                <p className="text-[18px] text-slate-300">
                  Planetary transits (Gochar) represent the current movement of planets and how they affect your natal houses. Below is your live remedial guidelines:
                </p>

                {/* Birth Nakshatra Remedies Card */}
                {nakshatraLoading && (
                  <div className="text-[18px] text-amber-400 font-mono animate-pulse py-2">
                    Calculating Birth Nakshatra Remedies...
                  </div>
                )}
                {nakshatraError && (
                  <div className="text-[18px] text-rose-400 bg-rose-950/20 p-4 rounded-xl border border-rose-500/20">
                    Failed to load Birth Nakshatra remedies: {nakshatraError}
                  </div>
                )}
                {nakshatraRemedies && (
                  <div className="bg-gradient-to-r from-slate-900 to-amber-950/40 border border-amber-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                      <h4 className="text-[20px] font-bold text-amber-300 flex items-center gap-2">
                        🌟 Birth Nakshatra Remedies (जन्म नक्षत्र उपाय): <span className="text-white font-extrabold">{nakshatraRemedies.nakshatra}</span>
                      </h4>
                      <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 font-mono text-[14px]">
                        Ruling Lord: {nakshatraRemedies.lord}
                      </span>
                    </div>
                    
                    <p className="text-[16px] text-slate-300 leading-relaxed italic">
                      <strong>Stellar Profile:</strong> {nakshatraRemedies.profile}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[16px]">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850">
                        <strong className="text-amber-400 block mb-1">🕉️ Presiding Deity</strong>
                        <span className="text-slate-200">{nakshatraRemedies.deity}</span>
                      </div>
                      
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-855">
                        <strong className="text-amber-400 block mb-1">📿 Seeding Beej Mantra</strong>
                        <span className="text-emerald-300 font-mono">{nakshatraRemedies.seeding_mantra}</span>
                      </div>
                      
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-855">
                        <strong className="text-amber-400 block mb-1">🌿 Sacred Tree / Plant</strong>
                        <span className="text-slate-200">{nakshatraRemedies.sacred_tree}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[16px] border-t border-amber-500/10 pt-3">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-855">
                        <strong className="text-amber-400 block mb-1">🎁 Recommended Donations (दान)</strong>
                        <span className="text-slate-300 leading-relaxed">{nakshatraRemedies.donation}</span>
                      </div>
                      
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-855">
                        <strong className="text-amber-400 block mb-1">⚡ Primary Ritual Remedy</strong>
                        <span className="text-slate-300 leading-relaxed">{nakshatraRemedies.remedy}</span>
                      </div>
                    </div>
                  </div>
                )}

                {transitLoading && (
                  <div className="text-[18px] text-amber-400 font-mono animate-pulse py-4">
                    Fetching current cosmic transits...
                  </div>
                )}

                {transitError && (
                  <div className="text-[18px] text-rose-400 bg-rose-950/20 p-4 rounded-xl border border-rose-500/20">
                    Failed to load real-time transits: {transitError}. Showing general guidelines.
                  </div>
                )}

                {!transitLoading && !transitError && transitList.length > 0 && (() => {
                  const planetMapping = {
                    'Su': 'Sun',
                    'Mo': 'Moon',
                    'Ma': 'Mars',
                    'Me': 'Mercury',
                    'Ju': 'Jupiter',
                    'Ve': 'Venus',
                    'Sa': 'Saturn',
                    'Ra': 'Rahu',
                    'Ke': 'Ketu'
                  };

                  const zodiacFullNames = {
                    'Ari': 'Aries',
                    'Tau': 'Taurus',
                    'Gem': 'Gemini',
                    'Can': 'Cancer',
                    'Leo': 'Leo',
                    'Vir': 'Virgo',
                    'Lib': 'Libra',
                    'Sco': 'Scorpio',
                    'Sag': 'Sagittarius',
                    'Cap': 'Capricorn',
                    'Aqu': 'Aquarius',
                    'Pis': 'Pisces'
                  };

                  const zodiacOrder = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                  const lagnaIdx = zodiacOrder.indexOf(selectedLagna);

                  // Helper function to resolve transit remedy
                  const getTransitRemedy = (planet, house, rashi) => {
                    const p = planetMapping[planet] || planet;

                    if (p === 'Saturn') {
                      if (house === 12 || house === 1 || house === 2) {
                        return {
                          type: 'Afflicted (Sade Sati Phase)',
                          severity: 'High',
                          severityScore: 3,
                          color: 'text-rose-400 border-rose-500/20 bg-rose-950/10',
                          remedy: 'Donate black sesame seeds or black gram (urad dal) on Saturdays. Light a mustard oil lamp under a Peepal tree in the evening. Chant Saturn Gayatri or Beej Mantra: "Om Pram Preem Prom Sah Shaneshcharaay Namah" 108 times daily.'
                        };
                      }
                      if (house === 4 || house === 8) {
                        return {
                          type: 'Afflicted (Shani Dhaiya Phase)',
                          severity: 'Medium',
                          severityScore: 2,
                          color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
                          remedy: 'Avoid risky property deals and investments. Read Hanuman Chalisa daily. Chant the Mahamrityunjay Mantra to protect health and peace of mind.'
                        };
                      }
                    }

                    if (p === 'Rahu') {
                      if (house === 1 || house === 5 || house === 9) {
                        return {
                          type: 'Afflicted (Mental/Spiritual Illusion)',
                          severity: 'Medium',
                          severityScore: 2,
                          color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
                          remedy: 'Worship Goddess Durga. Feed birds with mixed grains (Saptadhanya) in the morning. Avoid making quick, impulsive life choices under current transit.'
                        };
                      }
                    }

                    if (p === 'Ketu') {
                      if (house === 1 || house === 8 || house === 12) {
                        return {
                          type: 'Afflicted (Spiritual Purge / Anxiety)',
                          severity: 'Medium',
                          severityScore: 2,
                          color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
                          remedy: 'Worship Lord Ganesha regularly. Feed stray dogs with bread/roti. Wear or carry a silver object to ground your thoughts.'
                        };
                      }
                    }

                    if (p === 'Mars' && (house === 8 || house === 12)) {
                      return {
                        type: 'Afflicted (High Expense & Injury Risk)',
                        severity: 'Medium',
                        severityScore: 2,
                        color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
                        remedy: 'Chant Hanuman Chalisa or Mangal Beej Mantra. Donate red lentils (masoor dal) or copper on Tuesdays. Practice patience and avoid driving fast.'
                      };
                    }

                    if (p === 'Sun' && house === 12) {
                      return {
                        type: 'Weakened (Energy Drain & Eye Strain)',
                        severity: 'Low',
                        severityScore: 1,
                        color: 'text-blue-300 border-slate-800 bg-slate-900/40',
                        remedy: 'Offer Arghya (water) to the Sun in a copper vessel at sunrise. Chant the Aditya Hridaya Stotra on Sundays.'
                      };
                    }

                    if (p === 'Jupiter' && (rashi === 'Cap' || house === 6 || house === 8 || house === 12)) {
                      return {
                        type: 'Weakened (Expansion Blocks)',
                        severity: 'Low',
                        severityScore: 1,
                        color: 'text-blue-300 border-slate-800 bg-slate-900/40',
                        remedy: 'Apply yellow sandalwood or saffron tilak on the forehead. Worship the Banana tree on Thursdays. Donate yellow garments or chickpeas to elders.'
                      };
                    }

                    if (p === 'Mercury' && (house === 6 || house === 8 || house === 12)) {
                      return {
                        type: 'Weakened (Communication hurdles)',
                        severity: 'Low',
                        severityScore: 1,
                        color: 'text-blue-300 border-slate-800 bg-slate-900/40',
                        remedy: 'Feed green grass or green leafy vegetables to cows on Wednesdays. Worship Goddess Saraswati or Lord Ganesha.'
                      };
                    }

                    if (p === 'Venus' && (rashi === 'Vir' || house === 6 || house === 8)) {
                      return {
                        type: 'Weakened (Relationship/Luxury hurdles)',
                        severity: 'Low',
                        severityScore: 1,
                        color: 'text-blue-300 border-slate-800 bg-slate-900/40',
                        remedy: 'Donate white sweets or milk to girls on Fridays. Wear light-colored clean clothes. Chant Venus Beej Mantra.'
                      };
                    }

                    // Favorable combinations
                    if (p === 'Jupiter' && (house === 1 || house === 5 || house === 9 || house === 11)) {
                      return {
                        type: 'Highly Auspicious (Divine Grace)',
                        severity: 'None',
                        severityScore: 0,
                        isFavorable: true,
                        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
                        remedy: 'This is an excellent transit for wealth, wisdom, and career. Chant Guru Stotra and participate in spiritual learning to amplify benefits.'
                      };
                    }

                    if (p === 'Sun' && (house === 3 || house === 6 || house === 10 || house === 11)) {
                      return {
                        type: 'Highly Auspicious (Power & Recognition)',
                        severity: 'None',
                        severityScore: 0,
                        isFavorable: true,
                        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
                        remedy: 'Excellent for success in exams, job promotions, and health recovery. Chant Gayatri Mantra daily.'
                      };
                    }

                    return {
                      type: 'Neutral / Favorable Transit',
                      severity: 'None',
                      severityScore: 0,
                      color: 'text-slate-300 border-slate-800 bg-slate-955',
                      remedy: 'Planetary alignment is stable. Continue daily meditation and maintain positive lifestyle habits.'
                    };
                  };

                  // Map each planet to its transit details and severity
                  const mappedPlanets = transitList
                    .filter(item => item.planet !== 'Asc')
                    .map(item => {
                      const fullName = planetMapping[item.planet] || item.planet;
                      const rashiFull = zodiacFullNames[item.rashi] || item.rashi;
                      const transitSignIdx = zodiacOrder.indexOf(rashiFull);
                      const house = lagnaIdx !== -1 && transitSignIdx !== -1
                        ? ((transitSignIdx - lagnaIdx + 12) % 12) + 1
                        : 1;

                      const details = getTransitRemedy(item.planet, house, item.rashi);
                      return {
                        ...item,
                        fullName,
                        rashiFull,
                        house,
                        details
                      };
                    });

                  // Sort planets by severity score descending or putting favorable ones next
                  mappedPlanets.sort((a, b) => b.details.severityScore - a.details.severityScore);

                  const highAfflicted = mappedPlanets.filter(p => p.details.severity === 'High');
                  const mediumAfflicted = mappedPlanets.filter(p => p.details.severity === 'Medium');
                  const lowAfflicted = mappedPlanets.filter(p => p.details.severity === 'Low');
                  const favorablePlanets = mappedPlanets.filter(p => p.details.isFavorable);

                  return (
                    <div className="space-y-6">
                      {/* Transit Summary Banner */}
                      {(highAfflicted.length > 0 || mediumAfflicted.length > 0 || lowAfflicted.length > 0 || favorablePlanets.length > 0) && (
                        <div className="bg-slate-900 border border-amber-500/20 p-5 rounded-2xl space-y-3">
                          <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-400" /> Cosmic Transit & Affliction Analysis
                          </h4>
                          <p className="text-[16px] text-slate-300">
                            Based on your {selectedLagna} Lagna chart, the planets are classified by current transit status:
                          </p>
                          <div className="flex flex-wrap gap-4 text-[16px] font-medium">
                            {(() => {
                              if (favorablePlanets.length > 0) {
                                return (
                                  <div className="bg-emerald-950/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-300">
                                    🌟 <strong>Highly Favorable ({favorablePlanets.length}):</strong> {favorablePlanets.map(p => p.fullName).join(', ')}
                                  </div>
                                );
                              }

                              const lagnaLord = lagnaInfo ? getPlanetFromGem(lagnaInfo.lifeStone) : null;
                              const luckyLord = lagnaInfo ? getPlanetFromGem(lagnaInfo.luckyStone) : null;

                              const lagnaLordTransit = mappedPlanets.find(p => p.fullName === lagnaLord);
                              const luckyLordTransit = mappedPlanets.find(p => p.fullName === luckyLord);

                              let text = "No Highly Favorable Planets for Current";
                              let supportivePlanet = null;
                              let activeHouse = 1;

                              if (lagnaLordTransit && lagnaLordTransit.details.severityScore === 0) {
                                text = `No Highly Favorable transits. Most Supportive: ${lagnaLordTransit.fullName} (Lagna Lord transiting House ${lagnaLordTransit.house} affliction-free)`;
                                supportivePlanet = lagnaLordTransit.fullName;
                                activeHouse = lagnaLordTransit.house;
                              } else if (luckyLordTransit && luckyLordTransit.details.severityScore === 0) {
                                text = `No Highly Favorable transits. Most Supportive: ${luckyLordTransit.fullName} (Lucky Lord transiting House ${luckyLordTransit.house} affliction-free)`;
                                supportivePlanet = luckyLordTransit.fullName;
                                activeHouse = luckyLordTransit.house;
                              } else {
                                const anyNonAfflicted = mappedPlanets.find(p => p.details.severityScore === 0 && p.fullName !== 'Moon');
                                if (anyNonAfflicted) {
                                  text = `No Highly Favorable transits. Most Supportive: ${anyNonAfflicted.fullName} (Transiting House ${anyNonAfflicted.house} affliction-free)`;
                                  supportivePlanet = anyNonAfflicted.fullName;
                                  activeHouse = anyNonAfflicted.house;
                                }
                              }

                              const deity = supportivePlanet ? remediesData.presidingDeities?.[supportivePlanet] : null;
                              const mantra = deity?.vedicMantra;
                              const lalKitabRemedy = (supportivePlanet && activeHouse)
                                ? remediesData.lalKitabHouseRemedies?.[supportivePlanet]?.[`H${activeHouse}`]
                                : null;
                              const relief = supportivePlanet ? remediesData.planetaryReliefRemedies?.[supportivePlanet] : null;
                              const planetaryRemedy = relief && relief.fastingDuration
                                ? `Fasting: ${relief.fastingDuration} (${relief.fastingProtocol}). Donations: ${relief.donationItems}.`
                                : null;

                              const gayatriTargetMap = {
                                'Sun': 'Brahma',
                                'Moon': 'Shiv',
                                'Mars': 'Ganesh',
                                'Mercury': 'Saraswati',
                                'Jupiter': 'Brahma',
                                'Venus': 'Laxmi',
                                'Saturn': 'Shiv',
                                'Rahu': 'Laxmi',
                                'Ketu': 'Ganesh'
                              };
                              const targetName = gayatriTargetMap[supportivePlanet] || supportivePlanet;
                              const gayatris = supportivePlanet
                                ? remediesData.meditationAndMantras?.keyGayatriMantras?.filter(g =>
                                  g.name.toLowerCase().includes(targetName.toLowerCase()) || g.name.toLowerCase().includes(supportivePlanet.toLowerCase())
                                ) || []
                                : [];
                              const gayatriText = gayatris.map(g => `${g.name}: ${g.mantra}`).join(' | ');

                              const deityDetails = deity
                                ? `Presiding: ${deity.presidingDeity || 'N/A'}, Vishnu Avatar: ${deity.vishnuAvatar || 'N/A'}, Jaimini: ${deity.jaiminiDeity || 'N/A'}, Tantrik: ${deity.tantrikDeity || 'N/A'}`
                                : null;

                              return (
                                <div className="bg-slate-800/40 border border-slate-750 px-4 py-3 rounded-xl text-[20px] text-orange-400 space-y-2 w-full animate-fade-in">
                                  <div>🌟 <strong>Highly Favorable Status:</strong> {text}</div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/60 pt-2 mt-2 text-[18px]">
                                    {mantra && (
                                      <div className="text-amber-300 font-mono">
                                        <strong>Activation Mantra:</strong> "{mantra}" (Chant daily to empower {supportivePlanet}).
                                      </div>
                                    )}
                                    {lalKitabRemedy && (
                                      <div className="text-blue-300">
                                        <strong>Lal Kitab House Remedy:</strong> {lalKitabRemedy} (Practiced to capture transit benefits).
                                      </div>
                                    )}
                                    {planetaryRemedy && (
                                      <div className="text-emerald-300">
                                        <strong>Planetary Relief:</strong> {planetaryRemedy}
                                      </div>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/40 pt-2 mt-2 text-[18px]">
                                    {deityDetails && (
                                      <div className="text-pink-300">
                                        <strong>Beneficial Deities & Vedic Invocation:</strong> {deityDetails}
                                      </div>
                                    )}
                                    <div className="text-orange-300 font-mono">
                                      <strong>Sacred Mantra Sadhana & Code of Conduct:</strong> {gayatriText ? `Gayatri: ${gayatriText}. ` : ''}Rule: Practice with clean attire, face East, maintain constant daily Japa counts.
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                            {highAfflicted.length > 0 && (
                              <div className="bg-rose-950/20 border border-rose-500/30 px-3 py-1.5 rounded-xl text-rose-300">
                                🚨 <strong>Highest Afflicted ({highAfflicted.length}):</strong> {highAfflicted.map(p => p.fullName).join(', ')}
                              </div>
                            )}
                            {mediumAfflicted.length > 0 && (
                              <div className="bg-amber-950/20 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300">
                                ⚠️ <strong>Medium Afflicted ({mediumAfflicted.length}):</strong> {mediumAfflicted.map(p => p.fullName).join(', ')}
                              </div>
                            )}
                            {lowAfflicted.length > 0 && (
                              <div className="bg-blue-950/20 border border-blue-500/30 px-3 py-1.5 rounded-xl text-blue-300">
                                📉 <strong>Low Afflicted ({lowAfflicted.length}):</strong> {lowAfflicted.map(p => p.fullName).join(', ')}
                              </div>
                            )}
                          </div>

                          {/* Current Transiting Nakshatra Remedies */}
                          {currentNakshatraRemedies && (
                            <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-2 text-[16px]">
                              <div className="flex items-center gap-2 text-amber-300 font-extrabold uppercase tracking-wide">
                                🌙 Today's Transiting Moon Nakshatra (वर्तमान नक्षत्र उपाय): {currentNakshatraRemedies.nakshatra}
                              </div>
                              <p className="text-slate-300 leading-relaxed text-[15px]">
                                <strong>Stellar Profile:</strong> {currentNakshatraRemedies.profile}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[14px] pt-1">
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                  <strong className="text-amber-400 block mb-0.5">🕉️ Deity</strong>
                                  <span className="text-slate-200">{currentNakshatraRemedies.deity}</span>
                                </div>
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                  <strong className="text-amber-400 block mb-0.5">📿 Seeding Mantra</strong>
                                  <span className="text-emerald-300 font-mono">{currentNakshatraRemedies.seeding_mantra}</span>
                                </div>
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                  <strong className="text-amber-400 block mb-0.5">🌿 Sacred Tree</strong>
                                  <span className="text-slate-200">{currentNakshatraRemedies.sacred_tree}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[14px] pt-1">
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                  <strong className="text-amber-400 block mb-0.5">🎁 Today's Donation (दान)</strong>
                                  <span className="text-slate-300">{currentNakshatraRemedies.donation}</span>
                                </div>
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                  <strong className="text-amber-400 block mb-0.5">⚡ Daily Ritual Remedy</strong>
                                  <span className="text-slate-300">{currentNakshatraRemedies.remedy}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Grid of planets */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mappedPlanets.map(item => {
                          let badgeText = '';
                          let badgeClass = '';

                          if (item.details.severity === 'High') {
                            badgeText = '🚨 Highest Affliction';
                            badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
                          } else if (item.details.severity === 'Medium') {
                            badgeText = '⚠️ Moderate Affliction';
                            badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                          } else if (item.details.severity === 'Low') {
                            badgeText = '📉 Low Affliction';
                            badgeClass = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
                          } else if (item.details.isFavorable) {
                            badgeText = '🌟 Highly Favorable';
                            badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                          }

                          const getDetailedTransitRemedies = (planetName, house) => {
                            const p = planetName;
                            const details = {};

                            // 1. Recommended Rudraksha Beads
                            const rudrakshas = remediesData.rudrakshaDetails?.filter(r =>
                              r.planet && r.planet.toLowerCase().includes(p.toLowerCase())
                            ) || [];
                            details.rudraksha = rudrakshas.map(r => `${r.mukhi} (Deity: ${r.deity}, Mantra: ${r.mantra}) - Benefit: ${r.benefits}`).join('\n') || 'No specific bead listed.';

                            // 2. Navgrah Plant Remedies
                            const plant = remediesData.navagrahaPlantRemedies?.[p];
                            details.plant = plant
                              ? `Sacred Plant: ${plant.sacredPlant} (${plant.physicalGovernance})\nMedicinal Components: ${plant.medicinalComponents}\nTherapeutic Profile: ${plant.therapeuticProfile}\nPractical Remedy: ${plant.practicalRemedies ? Object.values(plant.practicalRemedies)[0] : 'Worship tree daily'}`
                              : 'No specific plant remedy.';

                            // 3. Planetary Relief Remedies
                            const relief = remediesData.planetaryReliefRemedies?.[p];
                            details.relief = relief
                              ? `Fasting Protocol: ${relief.fastingDuration} (${relief.fastingProtocol})\nDonation Items: ${relief.donationItems}\nAmulet: ${relief.amuletRemedy} (Timing: ${relief.amuletRitualTiming})\nInvocation Count: ${relief.invocationCount}`
                              : 'No specific planetary relief fasts listed.';

                            // 4. Color Therapy & Life Cycle Guide
                            const color = remediesData.colorTherapy?.planetColors?.[p];
                            details.colorTherapy = color
                              ? `Recommended Color: ${color.color} (Quality: ${color.quality})`
                              : 'No specific color therapy details.';

                            // 5. Lal Kitab House Remedies
                            const lkHouse = remediesData.lalKitabHouseRemedies?.[p]?.[`H${house}`];
                            details.lalKitab = lkHouse || 'No specific Lal Kitab remedy for this house placement.';

                            // 6. Prescribed Crystal, Lockets & Rosaries
                            const crystals = remediesData.lalKitabSystem?.crystals?.items?.filter(c =>
                              c.name.toLowerCase().includes(p.toLowerCase())
                            ) || [];
                            const rosaries = remediesData.lalKitabSystem?.rosaries?.items?.filter(r =>
                              r.name.toLowerCase().includes(p.toLowerCase())
                            ) || [];

                            const crystalList = crystals.map(c => `${c.name} (${c.purpose})`).join(', ');
                            const rosaryList = rosaries.map(r => `${r.name} (${r.purpose})`).join(', ');
                            details.crystalsRosaries = `Crystals: ${crystalList || 'None'}\nRosaries: ${rosaryList || 'None'}`;

                            // 7. Sacred Mantra
                            const deity = remediesData.presidingDeities?.[p];
                            const gayatris = remediesData.meditationAndMantras?.keyGayatriMantras?.filter(g =>
                              g.name.toLowerCase().includes(p.toLowerCase()) || g.purpose.toLowerCase().includes(p.toLowerCase())
                            ) || [];
                            const gayatriList = gayatris.map(g => `${g.name}: ${g.mantra}`).join('\n');

                            details.mantra = `Vedic Mantra: ${deity?.vedicMantra || 'Om Namo Narayanaya'}\nGayatri Mantra:\n${gayatriList || 'None'}`;

                            return details;
                          };

                          return (
                            <div key={item.planet} className={`p-6 rounded-3xl border ${item.details.color} flex flex-col justify-between space-y-4 ${item.details.severity === 'High' ? 'col-span-full' : (item.details.severity === 'Medium' || item.details.severity === 'Low') ? 'col-span-1 md:col-span-2' : ''}`}>
                              <div>
                                <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-2">
                                  <span className="text-[20px] font-extrabold uppercase tracking-wider">{item.fullName}</span>
                                  <span className="text-[14px] bg-slate-800/60 px-2.5 py-0.5 rounded font-mono text-slate-300">
                                    {item.rashiFull} ({item.degree.toFixed(1)}°)
                                  </span>
                                </div>
                                {badgeText && (
                                  <div className="mb-2">
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                                      {badgeText}
                                    </span>
                                  </div>
                                )}
                                <div className="text-[16px] space-y-1">
                                  <p><strong>Transit Status:</strong> {item.details.type}</p>
                                  <p><strong>Transit House:</strong> House {item.house} (Gochar)</p>
                                </div>
                                <p className="text-[16px] text-slate-300 leading-relaxed mt-2">
                                  <strong>Primary Remedy:</strong> {item.details.remedy}
                                </p>

                                {item.details.severity === 'High' && (() => {
                                  const detailedRemedies = getDetailedTransitRemedies(item.fullName, item.house);
                                  return (
                                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 text-[16px]">
                                      <h4 className="text-[16px] font-bold text-amber-300 uppercase tracking-widest">
                                        Comprehensive Scriptural Remedial Protocol
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">📿 Recommended Rudraksha Beads</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.rudraksha}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🌿 Navgrah Plant Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.plant}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🚩 Planetary Relief Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.relief}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🎨 Color Therapy & Life Cycle Guide</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.colorTherapy}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">📜 Lal Kitab House Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.lalKitab}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">💎 Prescribed Crystal, Lockets & Rosaries</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.crystalsRosaries}</p>
                                        </div>
                                      </div>
                                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                        <strong className="text-amber-400 block mb-1">🕉️ Sacred Mantra</strong>
                                        <p className="text-slate-300 font-mono whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.mantra}</p>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {item.details.severity === 'Medium' && (() => {
                                  const detailedRemedies = getDetailedTransitRemedies(item.fullName, item.house);
                                  return (
                                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 text-[16px]">
                                      <h4 className="text-[16px] font-bold text-amber-300 uppercase tracking-widest">
                                        Moderate Scriptural Remedial Protocol
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🌿 Navgrah Plant Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.plant}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🚩 Planetary Relief Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.relief}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🎨 Color Therapy & Life Cycle Guide</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.colorTherapy}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">📜 Lal Kitab House Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.lalKitab}</p>
                                        </div>
                                      </div>
                                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                        <strong className="text-amber-400 block mb-1">🕉️ Sacred Mantra</strong>
                                        <p className="text-slate-300 font-mono whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.mantra}</p>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {item.details.severity === 'Low' && (() => {
                                  const detailedRemedies = getDetailedTransitRemedies(item.fullName, item.house);
                                  return (
                                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 text-[16px]">
                                      <h4 className="text-[16px] font-bold text-amber-300 uppercase tracking-widest">
                                        Minor Scriptural Remedial Protocol
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🌿 Navgrah Plant Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.plant}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🚩 Planetary Relief Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.relief}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">📜 Lal Kitab House Remedies</strong>
                                          <p className="text-slate-300 whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.lalKitab}</p>
                                        </div>
                                        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
                                          <strong className="text-amber-400 block mb-1">🕉️ Sacred Mantra</strong>
                                          <p className="text-slate-300 font-mono whitespace-pre-line leading-relaxed text-[15px]">{detailedRemedies.mantra}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 14. Kundali Dosha Remedies (कुण्डली दोष निवारण उपाय) */}
              {(() => {
                const detectDoshas = () => {
                  const saved = localStorage.getItem('worksheetData');
                  if (!saved) return [];
                  try {
                    const parsed = JSON.parse(saved);
                    const active = [];

                    const isPresent = (val) => {
                      if (val === true) return true;
                      if (val && typeof val === 'object') {
                        return val.present === true || val.is_present === true || val.active === true || val.status === 'Active' || val.is_manglik === true;
                      }
                      if (typeof val === 'string') {
                        const lower = val.toLowerCase();
                        return lower.includes('present') || lower.includes('active') || lower.includes('yes') || lower.includes('detected') || lower.includes('manglik');
                      }
                      return false;
                    };

                    // 1. Kalsarp
                    const kalsarpVal = parsed.kalsarp || parsed.kalsarpa || parsed.doshas?.kalsarp || parsed.doshas?.kalsarpa || parsed.dosha?.kalsarp || parsed.dosha?.kalsarpa;
                    if (isPresent(kalsarpVal)) {
                      active.push({ id: 'kalsarp', label: 'Kaal Sarp Dosha (कालसर्प दोष)', key: 'kalsarpRemedies' });
                    }

                    // 2. Pitra
                    const pitraVal = parsed.pitra || parsed.pitru || parsed.doshas?.pitra || parsed.doshas?.pitru || parsed.dosha?.pitra || parsed.dosha?.pitru;
                    if (isPresent(pitraVal)) {
                      active.push({ id: 'pitra', label: 'Pitra Dosha (पितृ दोष)', key: 'pitruDoshRemedies' });
                    }

                    // 3. Sadesati
                    const sadesatiVal = parsed.sadesati || parsed.sade_sati || parsed.doshas?.sadesati || parsed.dosha?.sadesati;
                    if (isPresent(sadesatiVal)) {
                      active.push({ id: 'sadesati', label: 'Sade Sati (साढ़ेसाती)', key: 'sadeSatiRemedies' });
                    }

                    // 4. Rahu
                    const rahuVal = parsed.rahu || parsed.doshas?.rahu || parsed.dosha?.rahu;
                    if (isPresent(rahuVal)) {
                      active.push({ id: 'rahu', label: 'Rahu Dosha (राहू दोष)', key: 'rahuDoshaRemedies' });
                    }

                    // 5. Ketu
                    const ketuVal = parsed.ketu || parsed.doshas?.ketu || parsed.dosha?.ketu;
                    if (isPresent(ketuVal)) {
                      active.push({ id: 'ketu', label: 'Ketu Dosha (केतु दोष)', key: 'ketuDoshaRemedies' });
                    }

                    // 6. Manglik
                    const manglikVal = parsed.manglik || parsed.mangalik || parsed.doshas?.manglik || parsed.dosha?.manglik;
                    if (isPresent(manglikVal)) {
                      active.push({ id: 'manglik', label: 'Manglik Dosha (मांगलिक दोष)', key: 'manglikDoshaRemedies' });
                    }

                    return active;
                  } catch (e) {
                    console.error("Error parsing worksheetData for doshas:", e);
                    return [];
                  }
                };

                const activeDoshas = detectDoshas();
                if (activeDoshas.length === 0) return null;

                return (
                  <div className="space-y-6 pt-4 border-t border-slate-800">
                    <h3 className="text-[20px] font-bold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <ShieldAlert className="w-5 h-5 text-amber-400" /> 14. Kundali Dosha Remedies (कुण्डली दोष निवारण उपाय)
                    </h3>
                    <p className="text-[18px] text-slate-300">
                      Astrological analysis of your Lagna Kundali reveals the presence of specific doshas. Below are the scriptural and modern remedies from the Vedic Encyclopedia to neutralize their adverse effects:
                    </p>

                    <div className="space-y-6">
                      {activeDoshas.map(dosha => {
                        const data = remediesData[dosha.key];
                        if (!data) return null;

                        return (
                          <div key={dosha.id} className="bg-gradient-to-b from-slate-900 to-red-950/20 border border-red-500/20 p-6 rounded-3xl space-y-4 shadow-xl">
                            <div className="flex justify-between items-center border-b border-red-500/20 pb-3">
                              <h4 className="text-[20px] font-bold text-red-400 flex items-center gap-2">
                                🧿 {dosha.label} Detected
                              </h4>
                            </div>

                            {data.title && (
                              <p className="text-[18px] text-amber-300 font-bold leading-relaxed">
                                {data.title}
                              </p>
                            )}

                            {data.description && (
                              <p className="text-[16px] text-slate-300 leading-relaxed italic">
                                {data.description}
                              </p>
                            )}

                            {/* If it's a simple list like generalRemedies or remedies array */}
                            {data.generalRemedies && (
                              <div className="space-y-2">
                                <strong className="text-[16px] text-amber-400 block">Main Scriptural Remedies (मुख्य उपाय):</strong>
                                <ul className="list-disc list-inside space-y-1.5 text-[15px] text-slate-300 leading-relaxed pl-2">
                                  {data.generalRemedies.map((rem, i) => (
                                    <li key={i}>{rem}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {data.remedies && Array.isArray(data.remedies) && typeof data.remedies[0] === 'string' && (
                              <div className="space-y-2">
                                <strong className="text-[16px] text-amber-400 block">Main Scriptural Remedies (मुख्य उपाय):</strong>
                                <ul className="list-disc list-inside space-y-1.5 text-[15px] text-slate-300 leading-relaxed pl-2">
                                  {data.remedies.map((rem, i) => (
                                    <li key={i}>{rem}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* If it has structured remedies array (for Rahu, Ketu, Manglik, Sade Sati) */}
                            {data.remedies && Array.isArray(data.remedies) && typeof data.remedies[0] === 'object' && (
                              <div className="space-y-4">
                                <strong className="text-[16px] text-amber-400 block">Structured Planetary Alignments & Remedies:</strong>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {data.remedies.map((rem, i) => (
                                    <div key={i} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-2">
                                      <strong className="text-amber-300 block text-[16px]">✨ {rem.name}</strong>
                                      {rem.mantra && (
                                        <p className="text-emerald-300 font-mono text-[14px]">
                                          <strong>Mantra:</strong> "{rem.mantra}"
                                        </p>
                                      )}
                                      <p className="text-slate-300 text-[14px] leading-relaxed">
                                        <strong>Practice:</strong> {rem.practice}
                                      </p>
                                      <p className="text-slate-400 text-[13px] leading-relaxed italic border-t border-slate-800/40 pt-1.5 mt-1.5">
                                        <strong>Spiritual Science:</strong> {rem.spiritualScience}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {data.mantra && typeof data.mantra === 'string' && (
                              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                                <strong className="text-emerald-400 block mb-1 text-[16px]">📿 Potent Nivaran Mantra</strong>
                                <p className="text-emerald-300 font-mono text-[16px]">{data.mantra}</p>
                              </div>
                            )}

                            {data.notes && (
                              <p className="text-[14px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3 mt-2">
                                <strong>Important Note:</strong> {data.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Footer inside report */}
              <div className="text-center pt-8 border-t border-slate-800 text-[18px] text-orange-400 space-y-1">
                <p>© Vedic Astrology Remedies Encyclopedia • Authentic Vedic Remedies Manual</p>
                <p>Always practice Pujas and fasts with clear intentions, clean body, and devotion.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Lagna Gem Matrix */}
        {selectedTab === 'lagnaGems' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <label className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">Select Your Ascendant / Lagna:</label>
              <select
                value={selectedLagna}
                onChange={(e) => setSelectedLagna(e.target.value)}
                className="bg-emerald-400 border border-amber-500/40 text-black px-4 py-2 rounded-xl text-[18px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Object.keys(remediesData.lagnaGemMatrix).map(lagna => (
                  <option key={lagna} value={lagna}>
                    {lagna} Ascendant {userAscendant === lagna ? '(Your Chart)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Life Stone */}
              <div className="bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl text-center space-y-3">
                <span className="text-[18px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
                  Life Stone (1st Lord)
                </span>
                <h3 className="text-[24px] font-bold text-emerald-200">{lagnaInfo.lifeStone}</h3>
                <p className="text-[18px] text-slate-300 leading-relaxed">
                  Strengthens vitality, general health, immunity, self-confidence, and longevity.
                </p>
              </div>

              {/* Karaka Stone */}
              <div className="bg-gradient-to-b from-blue-950/60 to-slate-900 border border-blue-500/30 p-6 rounded-3xl text-center space-y-3">
                <span className="text-[18px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block">
                  Karaka Stone (5th Lord)
                </span>
                <h3 className="text-[24px] font-bold text-blue-200">{lagnaInfo.karakaStone}</h3>
                <p className="text-[18px] text-slate-300 leading-relaxed">
                  Enhances intelligence, education, creative talents, memory, and mantra sadhana.
                </p>
              </div>

              {/* Lucky Stone */}
              <div className="bg-gradient-to-b from-amber-950/60 to-slate-900 border border-amber-500/30 p-6 rounded-3xl text-center space-y-3">
                <span className="text-[18px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                  Lucky Stone (9th Lord)
                </span>
                <h3 className="text-[24px] font-bold text-amber-200">{lagnaInfo.luckyStone}</h3>
                <p className="text-[18px] text-slate-300 leading-relaxed">
                  Attracts fortune, spiritual growth, divine grace, higher wisdom, and prosperity.
                </p>
              </div>
            </div>

            {/* Incompatible Gems Warning */}
            <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[18px] font-bold text-rose-300">Incompatible Gemstones for {selectedLagna} Ascendant</h4>
                <p className="text-[18px] text-slate-300 mt-1">
                  <strong>Do NOT wear:</strong> {lagnaInfo.incompatible.join(', ')}. Wearing malefic or enemy gemstones will strengthen hostile house lords and trigger obstacles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: All 9 Primary Gems */}
        {selectedTab === 'allGems' && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {remediesData.ninePrimaryGems.map(g => (
                <button
                  key={g.planet}
                  onClick={() => setSelectedPlanet(g.planet)}
                  className={`px-4 py-2 rounded-xl text-[15px] font-bold shrink-0 transition-all border ${selectedPlanet === g.planet
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-white text-slate-900 border-slate-800 hover:bg-slate-800'
                    }`}
                >
                  {g.planet}: {g.gem.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[16px] text-amber-400 font-semibold uppercase">{gemInfo.planet}'s Primary Ratna</span>
                  <h3 className="text-3xl font-bold text-amber-300 mt-1">{gemInfo.gem}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[18px] text-yellow-400 block">Substitutes (Upratna):</span>
                  <span className="text-[20px] font-bold text-red-400">{gemInfo.substitutes.join(', ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[20px]">
                <div className="bg-yellow-50 p-3 rounded-xl border border-slate-800">
                  <span className="text-orange-950 block font-bold text-[18px] ">Carat Weight</span>
                  <strong className=" text-slate-900">{gemInfo.caratWeight}</strong>
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl border border-slate-800">
                  <span className="text-orange-950 block font-bold text-[18px]">Suitable Metal</span>
                  <strong className="text-slate-900">{gemInfo.metal}</strong>
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl border border-slate-800">
                  <span className="text-orange-950 block font-bold text-[18px]">Wearing Finger</span>
                  <strong className="text-slate-900">{gemInfo.finger}</strong>
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl border border-slate-800">
                  <span className="text-orange-950 block font-bold text-[18px]">Auspicious Day</span>
                  <strong className="text-slate-900">{gemInfo.day}</strong>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-1">
                <span className="text-[18px] text-amber-400 font-bold uppercase tracking-wider">Activation Mantra (Chant 108 Times Before Wearing):</span>
                <p className="text-[20px] font-mono font-bold text-emerald-200">{gemInfo.mantra}</p>
              </div>

              <div className="bg-slate-955 p-4 rounded-xl border border-slate-800">
                <span className="text-[18px] font-bold text-orange-400 uppercase">Key Astrological Benefits & Cures:</span>
                <p className="text-[20px] text-emerald-200 mt-1 leading-relaxed">{gemInfo.benefits}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Rudraksha Directory (1 to 21 Mukhi) */}
        {selectedTab === 'rudraksha' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <span>📿</span> Rudraksha Beads (1 to 21 Mukhi)
            </h3>
            <p className="text-xs text-slate-300">{remediesData.rudraksha?.description}</p>
            {remediesData.rudraksha?.benefits && (
              <ul className="list-disc list-inside text-xs text-slate-300">
                {remediesData.rudraksha.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
            {remediesData.rudraksha?.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {remediesData.rudraksha.items.map(item => (
                  <div key={item.name} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                    <div>
                      <h4 className="text-lg font-bold text-amber-400">{item.name}</h4>
                      <p className="text-xs text-slate-300">{item.purpose}</p>
                    </div>
                    {item.mantra && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-amber-400 font-mono block">Mantra:</span>
                        <span className="text-xs font-mono font-semibold text-slate-200">{item.mantra}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {remediesData.rudrakshaDetails && (
              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                  <span>📿</span> Complete Rudraksha Directory (1 to 21 Mukhi + Combination Beads)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {remediesData.rudrakshaDetails.map(item => (
                    <div key={item.mukhi} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                          <span className="text-[20px] font-bold text-amber-400">{item.mukhi}</span>
                          <span className="text-[20px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {item.planet}
                          </span>
                        </div>
                        <p className="text-[18px] text-slate-300"><strong>Presiding Deity:</strong> {item.deity}</p>
                        <p className="text-[18px] text-slate-300 mt-1"><strong>Primary Benefits:</strong> {item.benefits}</p>
                        <p className="text-[18px] text-emerald-300 mt-1"><strong>Health Cures:</strong> {item.healthEffect}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[18px] text-amber-400 font-mono block">Mantra:</span>
                        <span className="text-[18px] font-mono font-semibold text-slate-200">{item.mantra}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* TAB 4: Yantras & Sacred Geometries */}
        {selectedTab === 'yantras' && (
          <div className="space-y-6">
            <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
              <span>☸️</span> Sacred Yantras & Cosmic Geometries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remediesData.yantraDetails.map(item => (
                <div key={item.name} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <h4 className="text-[18px] font-bold text-amber-300">{item.name}</h4>
                    <span className="text-[18px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                      Direction: {item.direction}
                    </span>
                  </div>
                  <p className="text-[18px] text-slate-300"><strong>Presiding Deity:</strong> {item.deity}</p>
                  <p className="text-[18px] text-slate-300"><strong>Benefits & Powers:</strong> {item.benefits}</p>
                  <div className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <span className="text-[18px] text-amber-400 font-mono block uppercase">Consecration & Activation Mantra:</span>
                    <p className="text-[18px] font-sans font-medium text-orange-400 mt-0.5">{item.mantra}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Navagraha Plant Remedies */}
        {selectedTab === 'navagrahaPlants' && (
          <div className="space-y-6">
            <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
              <span>🌿</span> Navagraha Plant Remedies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(remediesData.navagrahaPlantRemedies).map(([planet, item]) => (
                <div key={planet} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/40 transition-all">
                  <h4 className="text-[18px] font-bold text-amber-300">{item.sacredPlant} ({planet})</h4>
                  <p className="text-[18px] text-orange-400"><strong>Benefits:</strong> {item.therapeuticProfile}</p>
                  <p className="text-[18px] text-slate-300"><strong>Usage:</strong> {item.practicalRemedies?.[Object.keys(item.practicalRemedies)[0]]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Planetary Relief Remedies */}
        {selectedTab === 'planetaryRelief' && (
          <div className="space-y-6">
            <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
              <span>🪐</span> Planetary Relief Remedies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(remediesData.planetaryReliefRemedies).map(([planet, item]) => (
                <div key={planet} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/40 transition-all">
                  <h4 className="text-[18px] font-bold text-amber-300">{planet}</h4>
                  <p className="text-[18px] text-slate-300"><strong>Fasting:</strong> {item.fastingDuration}</p>
                  <p className="text-[18px] text-slate-300"><strong>Donation:</strong> {item.donationItems}</p>
                  <p className="text-[18px] text-orange-300"><strong>Mantra:</strong> {item.vedicInvocation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Zodiac Sign Remedies */}
        {selectedTab === 'zodiacRemedies' && (
          <div className="space-y-6">
            <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
              <span>♈️</span> Zodiac Sign Remedies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(remediesData.zodiacSignRemedies).map(([sign, data]) => (
                <div key={sign} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-amber-500/40 transition-all">
                  <h4 className="text-[18px] font-bold text-amber-300">{sign} (Ruling: {data.rulingPlanet})</h4>
                  <p className="text-[18px] text-slate-300"><strong>Benefits:</strong> {data.physicalAstrologicalProperties}</p>
                  <p className="text-[18px] text-slate-300"><strong>Fasting:</strong> {data.fastingRules?.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Lal Kitab House Remedies & System */}
        {selectedTab === 'lalKitabHouses' && (
          <div className="space-y-6">
            {/* System Overview */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <span>📜</span> Lal Kitab System, Astro-Palmistry & Age Milestones
              </h3>
              <p className="text-[18px] text-slate-300 leading-relaxed">
                {remediesData.lalKitabSystem?.introduction}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                {remediesData.lalKitabSystem?.ageMilestones && Object.entries(remediesData.lalKitabSystem.ageMilestones).map(([pl, age]) => (
                  <div key={pl} className="bg-slate-955 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[18px] font-bold text-amber-400 block uppercase">{pl} Activation</span>
                    <strong className="text-[18px] text-slate-100">{age}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 9 Planetary Debts */}
            {remediesData.lalKitabSystem?.ninePlanetaryDebts && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">
                  9 Planetary Debts (Pitru Rina) & Relative Remedies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {remediesData.lalKitabSystem.ninePlanetaryDebts.map(d => (
                    <div key={d.debt} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <strong className="text-[18px] text-amber-300 block">{d.debt}</strong>
                      <p className="text-[18px] text-slate-400"><strong>Cause:</strong> {d.cause}</p>
                      <p className="text-[18px] text-emerald-300 pt-1"><strong>Remedy:</strong> {d.remedy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strict Donation Warnings */}
            {remediesData.lalKitabSystem?.strictDonationWarnings && (
              <div className="bg-rose-950/40 border border-rose-500/30 p-6 rounded-3xl space-y-3">
                <h4 className="text-[18px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" /> Strict Lal Kitab Prohibitions & Donation Warnings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {remediesData.lalKitabSystem.strictDonationWarnings.map((w, idx) => (
                    <div key={idx} className="bg-slate-955/90 p-3 rounded-xl border border-rose-500/20">
                      <span className="text-[18px] font-bold text-rose-400 block">{w.condition}</span>
                      <p className="text-[18px] text-slate-300 mt-1">{w.warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive House-by-House Remedies */}
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 flex-wrap gap-4">
              <div>
                <label className="text-[18px] font-bold text-amber-400 uppercase tracking-wider block">Select Planet for House 1 to 12 Remedies:</label>
                <div className="flex gap-2 overflow-x-auto pt-1">
                  {Object.keys(remediesData.lalKitabHouseRemedies).map(planet => (
                    <button
                      key={planet}
                      onClick={() => setSelectedPlanet(planet)}
                      className={`px-3 py-1 rounded-lg text-[18px] font-bold transition-all border ${selectedPlanet === planet ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                    >
                      {planet}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }, (_, i) => `H${i + 1}`).map(hKey => {
                const remedyText = remediesData.lalKitabHouseRemedies[selectedPlanet]?.[hKey] || "No specific house affliction remedy listed.";
                return (
                  <div key={hKey} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[18px] font-bold text-amber-400">{selectedPlanet} in House {hKey.replace('H', '')}</span>
                      <span className="text-[16px] text-emerald-300 font-mono">Lal Kitab</span>
                    </div>
                    <p className="text-[18px] text-slate-200 leading-relaxed">{remedyText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: Presiding Deities & Avatars */}
        {selectedTab === 'deities' && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.keys(remediesData.presidingDeities).map(planet => (
                <button
                  key={planet}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`px-4 py-2 rounded-xl text-[18px] font-bold shrink-0 transition-all border ${selectedPlanet === planet
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                >
                  {planet}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
              <h3 className="text-[18px] font-bold text-amber-300 border-b border-slate-800 pb-3">
                Deities & Avatars for {deityInfo.planet}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[18px] font-bold text-amber-400 uppercase">Maharishi Parasara View</span>
                  <p className="text-[18px] font-bold text-slate-100">Sri Vishnu Avatar: {deityInfo.vishnuAvatar}</p>
                  <p className="text-[18px] text-slate-300">Presiding Deity: {deityInfo.presidingDeity}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[18px] font-bold text-amber-400 uppercase">Maharishi Jaimini View</span>
                  <p className="text-[18px] font-bold text-slate-100">Jaimini Deity: {deityInfo.jaiminiDeity}</p>
                  <p className="text-[18px] text-slate-300">Tantrik Deity: {deityInfo.tantrikDeity}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[18px] font-bold text-amber-400 uppercase">Lal Kitab Presiding Deity</span>
                  <p className="text-[18px] font-bold text-slate-100">{deityInfo.lalKitabDeity}</p>
                  <p className="text-[18px] text-slate-300">Propitiation: Offer worship & Daan</p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <span className="text-[18px] text-amber-400 font-bold uppercase">Vedic Planet Mantra:</span>
                <p className="text-[18px] font-mono font-medium text-orange-300 mt-1">{deityInfo.vedicMantra}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Vratas & Fasting Protocol */}
        {selectedTab === 'vratas' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <span>🚩</span> Philosophy of Fasting (Upa-vaas) & Universal Vratas
              </h3>
              <p className="text-[18px] text-slate-300 leading-relaxed">
                {remediesData.fastingPhilosophy?.etymology}
              </p>
            </div>

            {/* Great Sayings on Fasting */}
            {remediesData.fastingPhilosophy?.greatSayings && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">Great Sayings on Fasting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remediesData.fastingPhilosophy.greatSayings.map((s, idx) => (
                    <div key={idx} className="bg-slate-955 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <p className="text-[18px] text-slate-200 italic">"{s.quote}"</p>
                      <span className="text-[18px] font-bold text-amber-400 mt-2 text-right">— {s.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Global Traditions */}
            {remediesData.fastingPhilosophy?.globalTraditions && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">Fasting in Global Traditions & Medicine</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(remediesData.fastingPhilosophy.globalTraditions).map(([trad, desc]) => (
                    <div key={trad} className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                      <strong className="text-[18px] text-amber-300 block">{trad} Tradition</strong>
                      <p className="text-[18px] text-slate-300 mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Vratas */}
            <h4 className="text-[18px] font-bold text-amber-300 uppercase tracking-wider pt-2">Primary Weekly & Festival Vratas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remediesData.vratasAndFasts.map(item => (
                <div key={item.name} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition-all">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="text-[18px] font-bold text-amber-400">{item.name}</h4>
                    <span className="text-[18px] bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {item.day}
                    </span>
                  </div>
                  <p className="text-[18px] text-slate-300"><strong>Presiding Deity:</strong> {item.deity}</p>
                  <p className="text-[18px] text-slate-300"><strong>Purpose & Benefits:</strong> {item.purpose}</p>
                  <p className="text-[18px] text-slate-400 leading-relaxed bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <strong>Auspicious Method (Vidhi):</strong> {item.method}
                  </p>
                </div>
              ))}
            </div>

            {/* Directory of All 67 Vratas */}
            {remediesData.fastingPhilosophy?.all67VratasDirectory && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h4 className="text-[18px] font-bold text-amber-300 uppercase tracking-wider">
                  Complete Index of All 67 Sacred Vratas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remediesData.fastingPhilosophy.all67VratasDirectory.map(vr => (
                    <div key={vr.id} className="bg-slate-955 p-3 rounded-xl border border-slate-800 flex gap-2">
                      <span className="text-[18px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 h-fit shrink-0">
                        #{vr.id}
                      </span>
                      <div>
                        <strong className="text-[18px] text-orange-400 block">{vr.name}</strong>
                        <p className="text-[18px] text-slate-400 leading-tight mt-0.5">{vr.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: Color Therapy & Dress Guide */}
        {selectedTab === 'colorTherapy' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <Palette className="w-6 h-6 text-amber-400" /> Color Therapy, VIBGYOR & Solarized Water Healing
              </h3>
              <p className="text-[18px] text-slate-300 leading-relaxed">{remediesData.colorTherapy.description}</p>
              {remediesData.lalKitabSystem?.colorTherapyExtended?.conceptAndVibgyor && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <strong className="text-[18px] text-amber-400 block">Prism & VIBGYOR Science</strong>
                    <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.colorTherapyExtended.conceptAndVibgyor.concentratedColor}</p>
                  </div>
                  <div className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <strong className="text-[18px] text-amber-400 block">Solarized Water Tonic</strong>
                    <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.colorTherapyExtended.conceptAndVibgyor.solarizedWater}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Dress Guide */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">Day-Wise Clothing & Gemstone Color Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {Object.entries(remediesData.colorTherapy.dailyDressGuide).map(([day, guide]) => (
                  <div key={day} className="bg-slate-955 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[18px] text-amber-300 font-bold block mb-1">{day}</span>
                    <p className="text-[18px] text-slate-300 leading-relaxed">{guide}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Color Properties & Cures */}
            {remediesData.lalKitabSystem?.colorTherapyExtended?.colorPropertiesAndCures && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">
                  VIBGYOR Color Properties, Psychology & Health Cures
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(remediesData.lalKitabSystem.colorTherapyExtended.colorPropertiesAndCures).map(([colName, info]) => (
                    <div key={colName} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <strong className="text-[18px] text-amber-300 block">{colName}</strong>
                      <p className="text-[18px] text-slate-300"><strong>Qualities:</strong> {info.qualities}</p>
                      <p className="text-[18px] text-slate-400"><strong>Psychology:</strong> {info.psychology}</p>
                      <p className="text-[18px] text-emerald-300 pt-1"><strong>Health Cures:</strong> {info.healthCures}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Colored Rosaries (Mala) Guide */}
            {remediesData.lalKitabSystem?.colorTherapyExtended?.coloredRosariesMalaGuide && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">
                  Colored Rosaries (Mala) Therapy Guide
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {remediesData.lalKitabSystem.colorTherapyExtended.coloredRosariesMalaGuide.map(ros => (
                    <div key={ros.rosary} className="bg-slate-955 p-3.5 rounded-xl border border-slate-800">
                      <strong className="text-[18px] text-amber-300 block">{ros.rosary}</strong>
                      <p className="text-[18px] text-slate-300 mt-0.5">{ros.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Meditation & Mantras */}
        {selectedTab === 'meditation' && remediesData.meditationAndMantras && (
          <div className="space-y-6">

            {/* Concept Header */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                <span>🧘</span> Science of Meditation, Sound Vibrations & Kundalini
              </h3>
              <p className="text-[18px] text-slate-300 leading-relaxed">
                {remediesData.meditationAndMantras.meditationConcept.definition}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {remediesData.meditationAndMantras.meditationConcept.stages.map(stg => (
                  <div key={stg.stage} className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <span className="text-[18px] text-amber-400 font-bold block">{stg.stage}</span>
                    <span className="text-[18px] text-slate-300">{stg.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7 Chakras & Seed Mantras Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider">
                7 Chakras, Governing Planets & Seed Mantras
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {remediesData.meditationAndMantras.chakrasAndSeedMantras.map(ch => (
                  <div key={ch.chakra} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[18px] font-bold text-amber-300">{ch.chakra}</span>
                      <span className="text-[18px] text-slate-400 block">{ch.position}</span>
                      <span className="text-[18px] text-slate-300 mt-1 block">Planet: <strong>{ch.planet}</strong></span>
                    </div>
                    <div className="text-right bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      <span className="text-[18px] text-amber-400 font-mono block uppercase">Seed</span>
                      <span className="text-[18px] font-mono font-black text-amber-200">{ch.seedMantra}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Japa Methods & Sadhaka Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Japa Methods */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h4 className="text-base font-bold text-amber-400 uppercase">3 Methods of Japa (Recitation)</h4>
                {remediesData.meditationAndMantras.japaMethodsAndRules.japaMethods.map(m => (
                  <div key={m.type} className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <strong className="text-[18px] text-amber-300 block">{m.type} Japa</strong>
                    <p className="text-[18px] text-slate-300">{m.description}</p>
                  </div>
                ))}
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200">
                  <strong>Mantra Siddhi Rule:</strong> {remediesData.meditationAndMantras.japaMethodsAndRules.mantraSiddhiRule}
                </div>
              </div>

              {/* Sadhaka Code of Conduct */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h4 className="text-[18px] font-bold text-amber-400 uppercase">16 Codes for Mantra Sadhaka</h4>
                <div className="space-y-1 text-[18px] text-slate-300">
                  {remediesData.meditationAndMantras.japaMethodsAndRules.sadhakaCodes.map((code, idx) => (
                    <p key={idx} className="bg-slate-955 p-2 rounded-lg border border-slate-800/60">
                      {code}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Gayatri Mantras */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-[18px] font-bold text-amber-400 uppercase">Key Gayatri Mantras</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {remediesData.meditationAndMantras.keyGayatriMantras.map(g => (
                  <div key={g.name} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                      <span className="text-[18px] text-amber-300">{g.name}</span>
                      <span className="text-[18px] text-amber-400 ">{g.purpose}</span>
                    </div>
                    <p className="text-[18px] text-slate-200 pt-1">{g.mantra}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashavtar Mantras */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-[18px] font-bold text-amber-400 uppercase">Vishnu Dashavtar Mantras</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {remediesData.meditationAndMantras.dashavtarMantras.map(d => (
                  <div key={d.avatar} className="bg-slate-955 p-3.5 rounded-xl border border-slate-800 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-[18px] text-amber-300">{d.avatar}</strong>
                      <span className="text-[18px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                        Planet: {d.planet}
                      </span>
                    </div>
                    <p className="text-[18px] font-mono text-slate-200 pt-1">{d.mantra}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Purpose Mantras */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h4 className="text-[18px] font-bold text-amber-400 uppercase">Special Purpose Mantras</h4>
              <div className="space-y-3">
                {remediesData.meditationAndMantras.specialPurposeMantras.map(sp => (
                  <div key={sp.purpose} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                      <span className="text-[18px] font-bold text-amber-300">{sp.purpose}</span>
                      <span className="text-[18px] text-amber-400">{sp.deity}</span>
                    </div>
                    <p className="text-[18px] font-mono font-bold text-amber-200 pt-1">{sp.mantra}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Crystals */}
        {selectedTab === 'crystals' && remediesData.lalKitabSystem?.crystals && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" /> Sacred Crystals & Lockets
              </h3>
              <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.crystals.description}</p>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
                <strong className="text-[18px] text-amber-400 font-bold uppercase tracking-wider">Key Benefits of Crystals:</strong>
                <ul className="list-disc list-inside text-[18px] text-slate-300 space-y-1">
                  {remediesData.lalKitabSystem.crystals.benefits.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[18px] mt-4">
                {remediesData.lalKitabSystem.crystals.items.map(p => (
                  <div key={p.name} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                    <div>
                      <strong className="text-amber-400 font-bold block">{p.name}</strong>
                      <p className="text-slate-300 mt-1">{p.purpose}</p>
                    </div>
                    {p.mantra && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-800/80 mt-2">
                        <span className="text-[14px] text-amber-400 block font-mono uppercase">Mantra:</span>
                        <p className="text-[16px] font-mono text-emerald-200 mt-0.5 leading-snug">{p.mantra}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Rosaries */}
        {selectedTab === 'rosaries' && remediesData.lalKitabSystem?.rosaries && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <Layers className="w-6 h-6 text-amber-400" /> Holy Rosaries (Mala)
              </h3>
              <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.rosaries.description}</p>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
                <strong className="text-[18px] text-amber-400 font-bold uppercase tracking-wider">Key Benefits of Rosaries:</strong>
                <ul className="list-disc list-inside text-[18px] text-slate-300 space-y-1">
                  {remediesData.lalKitabSystem.rosaries.benefits.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[18px] mt-4">
                {remediesData.lalKitabSystem.rosaries.items.map(p => (
                  <div key={p.name} className="bg-slate-955 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                    <div>
                      <strong className="text-amber-400 font-bold block">{p.name}</strong>
                      <p className="text-slate-300 mt-1">{p.purpose}</p>
                    </div>
                    {p.mantra && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-800/80 mt-2">
                        <span className="text-[14px] text-amber-400 block font-mono uppercase">Mantra:</span>
                        <p className="text-[16px] font-mono text-emerald-200 mt-0.5 leading-snug">{p.mantra}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: Fengshui Products */}
        {selectedTab === 'fengshui' && remediesData.lalKitabSystem?.fengshui && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <Wind className="w-6 h-6 text-amber-400" /> Fengshui Products & Remedies
              </h3>
              <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.fengshui.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[18px]">
                {remediesData.lalKitabSystem.fengshui.products.map(p => (
                  <div key={p.name} className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <span className=" text-amber-400 font-bold block">{p.name}</span>
                    <p className=" text-slate-300">{p.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: Pyramids */}
        {selectedTab === 'pyramids' && remediesData.lalKitabSystem?.pyramids && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-[22px] font-bold text-amber-300 flex items-center gap-2">
                <Triangle className="w-6 h-6 text-amber-400" /> Pyramids
              </h3>
              <p className="text-[18px] text-slate-300">{remediesData.lalKitabSystem.pyramids.description}</p>
              <ul className="list-disc list-inside text-[18px] text-slate-300 space-y-2">
                {remediesData.lalKitabSystem.pyramids.benefits.map(b => <li key={b}>{b}</li>)}
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[18px] mt-4">
                {remediesData.lalKitabSystem.pyramids.items.map(it => (
                  <div key={it.name} className="bg-slate-955 p-3 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold block">{it.name}</span>
                    <p className="text-slate-300">{it.purpose}</p>
                    {it.mantra && <p className="text-slate-400 italic mt-1">{it.mantra}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



