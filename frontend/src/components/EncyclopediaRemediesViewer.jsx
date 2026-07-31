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
  }, []);

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



