import React, { useState, useMemo } from 'react';
import explanationData from '../data/vimshottariExplanation.json';

const PLANET_DISPLAY_NAMES = ['Sūrya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Śhani', 'Budh', 'Ketu', 'Śukra'];

const PLANET_BILINGUAL_MAP = {
  'Sūrya': 'Surya - सूर्य',
  'Chandra': 'Chandra - चन्द्र',
  'Mangal': 'Mangal - मंगल',
  'Rahu': 'Rahu - राहू',
  'Guru': 'Guru - गुरू',
  'Śhani': 'Shani - शनि',
  'Budh': 'Budh - बुध',
  'Ketu': 'Ketu - केतु',
  'Śukra': 'Shukra - शुक्र'
};

const mapToMajorKey = (planet) => {
  if (planet === 'Chandra') return 'Chandra';
  if (planet === 'Śhani') return 'Śani';
  if (planet === 'Śukra') return 'Śukr';
  return planet;
};

const mapToSubKey = (planet) => {
  if (planet === 'Chandra') return 'Candr';
  if (planet === 'Śhani') return 'Śani';
  if (planet === 'Śukra') return 'Śukr';
  return planet;
};

const getDisplayPlanetName = (key) => {
  if (key === 'Candr') return 'Chandra';
  if (key === 'Śani') return 'Śhani';
  if (key === 'Śukr') return 'Śukra';
  return key;
};

const getBilingualName = (planet) => {
  if (planet === 'All') return 'All / सभी';
  const norm = getDisplayPlanetName(planet);
  return PLANET_BILINGUAL_MAP[norm] || planet;
};

export default function VimshottariExplanation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [useMultiLevel, setUseMultiLevel] = useState(false);
  const [dashaLevel, setDashaLevel] = useState('antardasha'); // 'antardasha', 'pratyantar', 'sookshma', or 'prana'
  const [activeDasha, setActiveDasha] = useState('Sūrya');
  const [activePlanetFilter, setActivePlanetFilter] = useState('All');
  const [expandedIds, setExpandedIds] = useState({});

  // Multi-level selection state
  const [multiPath, setMultiPath] = useState({
    mahadasha: 'Sūrya',
    antardasha: 'Chandra',
    pratyantar: 'Budh',
    sookshma: 'Śukra',
    prana: 'Rahu'
  });

  // Normalize dasha level source data
  const antardashas = useMemo(() => explanationData.antardashas || [], []);
  const pratyantardashas = useMemo(() => explanationData.pratyantardashas || [], []);
  const sukshmantardashas = useMemo(() => explanationData.sukshmantardashas || [], []);
  const pranadashas = useMemo(() => explanationData.pranadashas || [], []);

  const planetsList = useMemo(() => {
    const planets = new Set();
    if (dashaLevel === 'antardasha') {
      antardashas
        .filter(item => item.dasha === activeDasha)
        .forEach(item => planets.add(item.antarDasha));
    } else if (dashaLevel === 'pratyantar') {
      pratyantardashas
        .filter(item => item.major === activeDasha)
        .forEach(item => planets.add(item.sub));
    } else if (dashaLevel === 'sookshma') {
      sukshmantardashas
        .filter(item => item.major === activeDasha)
        .forEach(item => planets.add(item.sub));
    } else {
      pranadashas
        .filter(item => item.major === activeDasha)
        .forEach(item => planets.add(item.sub));
    }
    return ['All', ...Array.from(planets).map(p => getDisplayPlanetName(p))];
  }, [dashaLevel, activeDasha, antardashas, pratyantardashas, sukshmantardashas, pranadashas]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();

    if (dashaLevel === 'antardasha') {
      return antardashas.filter(item => {
        const matchesDasha = item.dasha === activeDasha;
        const matchesPlanet = activePlanetFilter === 'All' || getDisplayPlanetName(item.antarDasha) === activePlanetFilter;
        const matchesSearch =
          item.antarDasha.toLowerCase().includes(term) ||
          item.general.toLowerCase().includes(term) ||
          item.adverse.toLowerCase().includes(term) ||
          item.deathEffects.toLowerCase().includes(term) ||
          item.remedial.toLowerCase().includes(term) ||
          item.verses.includes(term);
        return matchesDasha && matchesPlanet && matchesSearch;
      });
    } else if (dashaLevel === 'pratyantar') {
      return pratyantardashas.filter(item => {
        const matchesDasha = item.major === activeDasha;
        const matchesPlanet = activePlanetFilter === 'All' || getDisplayPlanetName(item.sub) === activePlanetFilter;
        const matchesSearch =
          item.sub.toLowerCase().includes(term) ||
          item.effects.toLowerCase().includes(term) ||
          item.verses.includes(term);
        return matchesDasha && matchesPlanet && matchesSearch;
      });
    } else if (dashaLevel === 'sookshma') {
      return sukshmantardashas.filter(item => {
        const matchesDasha = item.major === activeDasha;
        const matchesPlanet = activePlanetFilter === 'All' || getDisplayPlanetName(item.sub) === activePlanetFilter;
        const matchesSearch =
          item.sub.toLowerCase().includes(term) ||
          item.effects.toLowerCase().includes(term) ||
          item.verses.includes(term);
        return matchesDasha && matchesPlanet && matchesSearch;
      });
    } else {
      return pranadashas.filter(item => {
        const matchesDasha = item.major === activeDasha;
        const matchesPlanet = activePlanetFilter === 'All' || getDisplayPlanetName(item.sub) === activePlanetFilter;
        const matchesSearch =
          item.sub.toLowerCase().includes(term) ||
          item.effects.toLowerCase().includes(term) ||
          item.verses.includes(term);
        return matchesDasha && matchesPlanet && matchesSearch;
      });
    }
  }, [dashaLevel, searchTerm, activeDasha, activePlanetFilter, antardashas, pratyantardashas, sukshmantardashas, pranadashas]);

  // Retrieve multi-level data records based on selections
  const multiLevelResults = useMemo(() => {
    if (!useMultiLevel) return null;

    const majorKey = mapToMajorKey(multiPath.mahadasha);
    const antarKey = mapToSubKey(multiPath.antardasha);
    const pratyantarKey = mapToSubKey(multiPath.pratyantar);
    const sookshmaKey = mapToSubKey(multiPath.sookshma);
    const pranaKey = mapToSubKey(multiPath.prana);

    const matchAntar = antardashas.filter(item => item.dasha === majorKey && item.antarDasha === antarKey);
    const matchPratyantar = pratyantardashas.filter(item => item.major === majorKey && item.sub === pratyantarKey);
    const matchSookshma = sukshmantardashas.filter(item => item.major === majorKey && item.sub === sookshmaKey);
    const matchPrana = pranadashas.filter(item => item.major === majorKey && item.sub === pranaKey);

    return {
      antar: matchAntar,
      pratyantar: matchPratyantar,
      sookshma: matchSookshma,
      prana: matchPrana
    };
  }, [useMultiLevel, multiPath, antardashas, pratyantardashas, sukshmantardashas, pranadashas]);

  const planetColors = {
    'Sūrya': 'from-amber-500 to-orange-600 border-amber-200 text-amber-900 bg-amber-50',
    'Chandra': 'from-blue-400 to-indigo-500 border-blue-200 text-blue-900 bg-blue-50',
    'Mangal': 'from-rose-500 to-red-600 border-rose-200 text-rose-900 bg-rose-50',
    'Rahu': 'from-purple-600 to-slate-800 border-purple-200 text-purple-900 bg-purple-50',
    'Guru': 'from-yellow-400 to-amber-500 border-yellow-200 text-yellow-900 bg-yellow-50',
    'Śhani': 'from-slate-700 to-slate-900 border-slate-400 text-slate-900 bg-slate-100',
    'Budh': 'from-emerald-400 to-teal-600 border-emerald-200 text-emerald-900 bg-emerald-50',
    'Ketu': 'from-indigo-600 to-purple-800 border-indigo-200 text-indigo-900 bg-indigo-50',
    'Śukra': 'from-pink-400 to-purple-500 border-pink-200 text-pink-900 bg-pink-50'
  };

  const handleMultiSelectChange = (level, value) => {
    setMultiPath(prev => ({
      ...prev,
      [level]: value
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Vimshottari Dasha Reference
          </h2>
          <p className="text-orange-900 text-[22px] font-bold mt-1">
            {!useMultiLevel ? (
              <>
                {dashaLevel === 'antardasha' && `Effects of the Antar Dashas in the Dasha of ${getBilingualName(activeDasha)}`}
                {dashaLevel === 'pratyantar' && `Effects of the Pratyantar Dashas in the Dasha of ${getBilingualName(activeDasha)}`}
                {dashaLevel === 'sookshma' && `Effects of the Sookshma Dashas in the Dasha of ${getBilingualName(activeDasha)}`}
                {dashaLevel === 'prana' && `Effects of the Prana Dashas in the Dasha of ${getBilingualName(activeDasha)}`}
              </>
            ) : (
              'Panchastariya Path Analyzer (Combined Levels)'
            )}
          </p>
        </div>

        {/* Search - only visible in single explorer */}
        {!useMultiLevel && (
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search keywords, remedies, or verses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-orange-900 rounded-2xl text-[16px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <div>
          <h3 className="text-lg font-bold text-orange-900">Analysis Mode</h3>
          <p className="text-[14px] text-black">Choose between browsing a single level or configuring a full 5-level Dasha path simultaneously.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setUseMultiLevel(false)}
            className={`px-4 py-2 rounded-xl text-[15px] font-bold transition-all ${!useMultiLevel
              ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
              : 'bg-white text-orange-900 border border-orange-200 hover:bg-orange-100/50'
              }`}
          >
            Single Level Explorer
          </button>
          <button
            onClick={() => setUseMultiLevel(true)}
            className={`px-4 py-2 rounded-xl text-[15px] font-bold transition-all ${useMultiLevel
              ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
              : 'bg-white text-orange-900 border border-orange-200 hover:bg-orange-100/50'
              }`}
          >
            Panchastariya Path Analyzer
          </button>
        </div>
      </div>

      {!useMultiLevel ? (
        <>
          {/* Dasha Level Toggle (Panchastariya Subdivisions) */}
          <div className="flex border-b border-slate-100 pb-4">
            <div className="bg-slate-100 p-1 rounded-xl flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setDashaLevel('antardasha');
                  setActivePlanetFilter('All');
                }}
                className={`px-4 py-2 rounded-lg text-[20px] font-bold transition-all ${dashaLevel === 'antardasha'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-emerald-700 hover:text-yellow-600'
                  }`}
              >
                Antardasha (Bhukti)
              </button>
              <button
                onClick={() => {
                  setDashaLevel('pratyantar');
                  setActivePlanetFilter('All');
                }}
                className={`px-4 py-2 rounded-lg text-[20px] font-bold transition-all ${dashaLevel === 'pratyantar'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-emerald-700 hover:text-yellow-600'
                  }`}
              >
                Pratyantar Dasha
              </button>
              <button
                onClick={() => {
                  setDashaLevel('sookshma');
                  setActivePlanetFilter('All');
                }}
                className={`px-4 py-2 rounded-lg text-[20px] font-bold transition-all ${dashaLevel === 'sookshma'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-emerald-700 hover:text-yellow-600'
                  }`}
              >
                Sookshma Dasha (4th Level)
              </button>
              <button
                onClick={() => {
                  setDashaLevel('prana');
                  setActivePlanetFilter('All');
                }}
                className={`px-4 py-2 rounded-lg text-[20px] font-bold transition-all ${dashaLevel === 'prana'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-emerald-700 hover:text-yellow-600'
                  }`}
              >
                Prana Dasha (5th Level)
              </button>
            </div>
          </div>

          {/* Main Dasha Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-100 pb-6">
            <span className="text-[20px] font-bold text-orange-600 uppercase tracking-widest">Main Dasha:</span>
            <div className="flex flex-wrap gap-2">
              {['Sūrya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Śhani', 'Budh', 'Ketu', 'Śukra'].map(dasha => {
                const normDasha = mapToMajorKey(dasha);
                return (
                  <button
                    key={dasha}
                    onClick={() => {
                      setActiveDasha(normDasha);
                      setActivePlanetFilter('All');
                    }}
                    className={`px-4 py-2 rounded-xl text-[18px] font-bold transition-all border ${activeDasha === normDasha
                      ? 'bg-yellow-200 text-slate-900 border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {getBilingualName(dasha)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Planet Filters */}
          <div className="flex flex-wrap gap-2">
            {planetsList.map(planet => (
              <button
                key={planet}
                onClick={() => setActivePlanetFilter(planet)}
                className={`px-4 py-2 rounded-xl text-[18px] font-bold transition-all ${activePlanetFilter === planet
                  ? 'bg-emerald-200 text-slate-900 shadow-md'
                  : 'bg-yellow-100 text-slate-900 hover:bg-slate-200'
                  }`}
              >
                {getBilingualName(planet)}
              </button>
            ))}
          </div>

          {/* Accordion / Content Area */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No records match your filters or search terms.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map(item => {
                const isOpen = !!expandedIds[item.id];
                const subPlanet = dashaLevel === 'antardasha' ? item.antarDasha : item.sub;
                const displaySubPlanet = getDisplayPlanetName(subPlanet);
                const colorClass = planetColors[displaySubPlanet] || 'from-indigo-500 to-purple-600 border-indigo-200 text-indigo-900 bg-indigo-50';

                return (
                  <div
                    key={item.id}
                    className="border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Header Row */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[22px] font-bold text-orange-900 border-2 border-orange-600  ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
                          Verses {item.verses}
                        </span>
                        <span className="font-bold  text-[22px] text-slate-900">
                          {dashaLevel === 'antardasha' && `${getBilingualName(displaySubPlanet)} Antardasha`}
                          {dashaLevel === 'pratyantar' && `${getBilingualName(activeDasha)} - ${getBilingualName(displaySubPlanet)} Pratyantar`}
                          {dashaLevel === 'sookshma' && `${getBilingualName(activeDasha)} - ${getBilingualName(displaySubPlanet)} Sookshma`}
                          {dashaLevel === 'prana' && `${getBilingualName(activeDasha)} - ${getBilingualName(displaySubPlanet)} Prana`}
                        </span>
                      </div>
                      <span className="text-red-500 font-bold text-[20px] transition-transform duration-300">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Body Content */}
                    {isOpen && (
                      <div className="p-5 md:p-6 bg-white border-t border-slate-100 space-y-4 text-[18px] leading-relaxed text-slate-900">
                        {dashaLevel === 'antardasha' ? (
                          <>
                            {item.general && (
                              <div>
                                <h4 className="text-[18px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Auspicious & General Effects</h4>
                                <p>{item.general}</p>
                              </div>
                            )}

                            {item.adverse && (
                              <div className="pt-2 border-t border-slate-50">
                                <h4 className="text-[20px] font-bold uppercase tracking-wider text-rose-800 mb-1">Adverse Results</h4>
                                <p className="text-[18px] text-slate-900">{item.adverse}</p>
                              </div>
                            )}

                            {item.deathEffects && (
                              <div className="pt-2 border-t border-slate-50">
                                <h4 className="text-[20px] font-bold uppercase tracking-wider text-purple-900 mb-1">Maraka / Severe Concerns</h4>
                                <p className="text-[18px] text-slate-900">{item.deathEffects}</p>
                              </div>
                            )}

                            {item.remedial && (
                              <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                                <div className="text-amber-600 text-[22px] mt-0.5">🕉️</div>
                                <div>
                                  <h4 className="text-[20px] font-black uppercase tracking-widest text-amber-800 mb-1">Remedial Measures</h4>
                                  <p className="text-black font-medium text-[18px]">{item.remedial}</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <h4 className="text-[20px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                              {dashaLevel === 'pratyantar' && 'Pratyantar Dasha Effects'}
                              {dashaLevel === 'sookshma' && 'Sookshma Dasha Effects'}
                              {dashaLevel === 'prana' && 'Prana Dasha Effects'}
                            </h4>
                            <p className="text-[18px] text-slate-900">{item.effects}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-8">
          {/* 5-Level Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            {/* Mahadasha Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-orange-800 uppercase tracking-wider">1. Mahadasha</label>
              <select
                value={multiPath.mahadasha}
                onChange={(e) => handleMultiSelectChange('mahadasha', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-[16px]"
              >
                {PLANET_DISPLAY_NAMES.map(p => (
                  <option key={p} value={p}>{getBilingualName(p)}</option>
                ))}
              </select>
            </div>

            {/* Antardasha Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-orange-800 uppercase tracking-wider">2. Antardasha</label>
              <select
                value={multiPath.antardasha}
                onChange={(e) => handleMultiSelectChange('antardasha', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-[16px]"
              >
                {PLANET_DISPLAY_NAMES.map(p => (
                  <option key={p} value={p}>{getBilingualName(p)}</option>
                ))}
              </select>
            </div>

            {/* Pratyantar Dasha Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-orange-800 uppercase tracking-wider">3. Pratyantar</label>
              <select
                value={multiPath.pratyantar}
                onChange={(e) => handleMultiSelectChange('pratyantar', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-[16px]"
              >
                {PLANET_DISPLAY_NAMES.map(p => (
                  <option key={p} value={p}>{getBilingualName(p)}</option>
                ))}
              </select>
            </div>

            {/* Sookshma Dasha Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-orange-800 uppercase tracking-wider">4. Sookshma</label>
              <select
                value={multiPath.sookshma}
                onChange={(e) => handleMultiSelectChange('sookshma', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-[16px]"
              >
                {PLANET_DISPLAY_NAMES.map(p => (
                  <option key={p} value={p}>{getBilingualName(p)}</option>
                ))}
              </select>
            </div>

            {/* Prana Dasha Selector */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-orange-800 uppercase tracking-wider">5. Prana Dasha</label>
              <select
                value={multiPath.prana}
                onChange={(e) => handleMultiSelectChange('prana', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-[16px]"
              >
                {PLANET_DISPLAY_NAMES.map(p => (
                  <option key={p} value={p}>{getBilingualName(p)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dasha Path Visualization Flow */}
          <div className="flex flex-wrap items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl justify-center">
            {Object.entries(multiPath).map(([key, value], idx) => {
              const colorClass = planetColors[value] || 'from-indigo-500 to-purple-600 border-indigo-200 text-indigo-900 bg-indigo-50';
              return (
                <React.Fragment key={key}>
                  <div className="flex flex-col items-center">
                    <span className="text-[16px] uppercase font-bold text-slate-900 mb-1">
                      {key === 'mahadasha' && 'Mahadasha'}
                      {key === 'antardasha' && 'Antardasha'}
                      {key === 'pratyantar' && 'Pratyantar'}
                      {key === 'sookshma' && 'Sookshma'}
                      {key === 'prana' && 'Prana'}
                    </span>
                    <div className={`px-4 py-1.5 rounded-full text-[20px] font-bold text-orange-800 bg-white ${colorClass.split(' ').slice(0, 2).join(' ')} shadow-sm`}>
                      {getBilingualName(value)}
                    </div>
                  </div>
                  {idx < 4 && <span className="text-zinc-600 font-extrabold text-[18px] pt-4">➔</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Results Timeline/List */}
          <div className="space-y-6">
            {/* Level 1 & 2: Mahadasha & Antardasha Combination */}
            <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xl font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-200 text-orange-900 text-[20px] font-bold">1-2</span>
                  Mahadasha & Antardasha Combination
                </h4>
                <span className="text-[20px] font-semibold text-slate-900">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.antardasha)}</span>
              </div>
              {multiLevelResults.antar.length === 0 ? (
                <p className="text-slate-400 italic">No specific combination text found in scriptures.</p>
              ) : (
                <div className="space-y-6">
                  {multiLevelResults.antar.map((item, idx) => (
                    <div key={item.id || idx} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                      </div>
                      {item.general && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Auspicious & General Effects</h5>
                          <p className="text-[18px] text-black leading-relaxed">{item.general}</p>
                        </div>
                      )}
                      {item.adverse && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-rose-800 mb-1">Adverse Results</h5>
                          <p className="text-[18px] text-black leading-relaxed">{item.adverse}</p>
                        </div>
                      )}
                      {item.deathEffects && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-purple-900 mb-1">Maraka / Severe Concerns</h5>
                          <p className="text-[18px] text-black leading-relaxed">{item.deathEffects}</p>
                        </div>
                      )}
                      {item.remedial && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                          <div className="text-amber-600 text-[18px]">🕉️</div>
                          <div>
                            <h5 className="text-[18px] font-bold uppercase text-amber-800">Remedial Measures</h5>
                            <p className="text-black text-[18px]">{item.remedial}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level 3: Pratyantardasha */}
            <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-200 text-black text-[20px] font-medium">3</span>
                  Pratyantar Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.pratyantar)}</span>
              </div>
              {multiLevelResults.pratyantar.length === 0 ? (
                <p className=" text-[18px] text-slate-900 italic">No specific combination text found in scriptures.</p>
              ) : (
                <div className="space-y-4">
                  {multiLevelResults.pratyantar.map((item, idx) => (
                    <div key={item.id || idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                      </div>
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level 4: Sookshmadasha */}
            <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-200 text-black text-[20px] font-medium">4</span>
                  Sookshma Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.sookshma)}</span>
              </div>
              {multiLevelResults.sookshma.length === 0 ? (
                <p className="text-[18px] text-slate-900 italic">No specific combination text found in scriptures.</p>
              ) : (
                <div className="space-y-4">
                  {multiLevelResults.sookshma.map((item, idx) => (
                    <div key={item.id || idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-200 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                      </div>
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level 5: Pranadasha */}
            <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-200 text-orange-900 text-[20px] font-black">5</span>
                  Prana Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.prana)}</span>
              </div>
              {multiLevelResults.prana.length === 0 ? (
                <p className="text-[18px] text-slate-900 italic">No specific combination text found in scriptures.</p>
              ) : (
                <div className="space-y-4">
                  {multiLevelResults.prana.map((item, idx) => (
                    <div key={item.id || idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                      </div>
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
