import React, { useState, useMemo, useEffect } from 'react';
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

const HINDI_SHORT_CODE_MAP = {
  'सू': 'Sūrya',
  'सु': 'Sūrya',
  'च': 'Chandra',
  'चं': 'Chandra',
  'मं': 'Mangal',
  'म': 'Mangal',
  'बु': 'Budh',
  'गु': 'Guru',
  'शु': 'Śukra',
  'श': 'Śhani',
  'नि': 'Śhani',
  'रा': 'Rahu',
  'के': 'Ketu'
};

const normalizePlanetForState = (name) => {
  if (!name) return 'Sūrya';
  const raw = String(name).trim();
  if (HINDI_SHORT_CODE_MAP[raw]) return HINDI_SHORT_CODE_MAP[raw];

  const s = raw.toLowerCase();
  if (s.includes('surya') || s.includes('sūrya') || s.includes('sun') || s.startsWith('सू') || s.startsWith('सु')) return 'Sūrya';
  if (s.includes('candr') || s.includes('chandra') || s.includes('moon') || s.startsWith('च')) return 'Chandra';
  if (s.includes('mangal') || s.includes('mars') || s.startsWith('म')) return 'Mangal';
  if (s.includes('rahu') || s.startsWith('रा')) return 'Rahu';
  if (s.includes('guru') || s.includes('jupiter') || s.startsWith('गु')) return 'Guru';
  if (s.includes('sani') || s.includes('śani') || s.includes('shani') || s.includes('saturn') || s.startsWith('श')) return 'Śhani';
  if (s.includes('budh') || s.includes('mercury') || s.startsWith('बु')) return 'Budh';
  if (s.includes('ketu') || s.startsWith('के')) return 'Ketu';
  if (s.includes('sukr') || s.includes('śukr') || s.includes('shukra') || s.includes('venus') || s.startsWith('शु')) return 'Śukra';
  return 'Sūrya';
};

const normalizeForCompare = (name) => {
  if (!name) return '';
  const raw = String(name).trim();
  if (HINDI_SHORT_CODE_MAP[raw]) return HINDI_SHORT_CODE_MAP[raw].toLowerCase();

  const s = raw.toLowerCase();
  if (s.includes('surya') || s.includes('sūrya') || s.startsWith('सू') || s.startsWith('सु')) return 'surya';
  if (s.includes('candr') || s.includes('chandra') || s.startsWith('च')) return 'chandra';
  if (s.includes('mangal') || s.startsWith('म')) return 'mangal';
  if (s.includes('rahu') || s.startsWith('रा')) return 'rahu';
  if (s.includes('guru') || s.startsWith('गु')) return 'guru';
  if (s.includes('sani') || s.includes('śani') || s.includes('shani') || s.startsWith('श') || s.startsWith('नि')) return 'shani';
  if (s.includes('budh') || s.startsWith('बु')) return 'budh';
  if (s.includes('ketu') || s.startsWith('के')) return 'ketu';
  if (s.includes('sukr') || s.includes('śukr') || s.includes('shukra') || s.startsWith('शु')) return 'shukra';
  return s;
};

const matchPlanet = (p1, p2) => normalizeForCompare(p1) === normalizeForCompare(p2);

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

const VIMSHOTTARI_PLANET_CYCLE = ['Sūrya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Śhani', 'Budh', 'Ketu', 'Śukra'];

export default function VimshottariExplanation({ currentActiveDasha }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [useMultiLevel, setUseMultiLevel] = useState(true);
  const [dashaLevel, setDashaLevel] = useState('antardasha'); // 'antardasha', 'pratyantar', 'sookshma', or 'prana'
  const [activeDasha, setActiveDasha] = useState('Sūrya');
  const [activePlanetFilter, setActivePlanetFilter] = useState('All');
  const [expandedIds, setExpandedIds] = useState({});
  const [dashaDepth, setDashaDepth] = useState(2); // 2: Mahadasha+Antardasha, 3: +Pratyantar, 4: +Sookshma, 5: Full 5-Level
  const [showVerses, setShowVerses] = useState(false); // Toggle scriptural verse numbers display

  const activeDashaPath = useMemo(() => ({
    mahadasha: normalizePlanetForState(currentActiveDasha?.mahadasha || currentActiveDasha?.md || 'Guru'),
    antardasha: normalizePlanetForState(currentActiveDasha?.antardasha || currentActiveDasha?.ad || 'Rahu'),
    pratyantar: normalizePlanetForState(currentActiveDasha?.pratyantar || currentActiveDasha?.pd || 'Budh'),
    sookshma: normalizePlanetForState(currentActiveDasha?.sookshma || currentActiveDasha?.sd || 'Śukra'),
    prana: normalizePlanetForState(currentActiveDasha?.prana || currentActiveDasha?.pad || 'Ketu')
  }), [currentActiveDasha]);

  // Multi-level selection state
  const [multiPath, setMultiPath] = useState(activeDashaPath);

  // Auto-detect and sync user's running dasha from saved birth chart data or active table event
  useEffect(() => {
    const loadActiveDasha = () => {
      try {
        const activeTableItem = localStorage.getItem('activeVimshottariDasha');
        let activeRow = activeTableItem ? JSON.parse(activeTableItem) : null;

        if (!activeRow) {
          const saved = localStorage.getItem('worksheetData');
          if (saved) {
            const parsed = JSON.parse(saved);
            const vims = parsed?.vimshottari_dasha || parsed?.vimsottari_dasha || parsed?.dashas?.vimshottari || parsed?.current_dasha;
            if (Array.isArray(vims)) {
              activeRow = vims.find(r => r.is_current || r.isCurrent);
            } else if (vims && vims.rows && Array.isArray(vims.rows)) {
              activeRow = vims.rows.find(r => r.is_current || r.isCurrent);
            }
          }
        }

        if (activeRow) {
          const chain = activeRow.dasha_chain ? activeRow.dasha_chain.split('-') : [];
          const maha = activeRow.md || chain[0];
          const antar = activeRow.ad || chain[1];
          const praty = activeRow.pd || chain[2];
          const sook = activeRow.sd || chain[3];
          const pran = activeRow.pad || chain[4];

          if (maha && antar) {
            setMultiPath({
              mahadasha: normalizePlanetForState(maha),
              antardasha: normalizePlanetForState(antar),
              pratyantar: normalizePlanetForState(praty || chain[2] || 'Budh'),
              sookshma: normalizePlanetForState(sook || chain[3] || 'Rahu'),
              prana: normalizePlanetForState(pran || chain[4] || 'Rahu')
            });
          }
        }
      } catch (e) {
        console.error('Error auto-loading active dasha:', e);
      }
    };

    loadActiveDasha();

    const handleEvent = (evt) => {
      if (evt?.detail) {
        const row = evt.detail;
        const chain = row.dasha_chain ? row.dasha_chain.split('-') : [];
        const maha = row.md || chain[0];
        const antar = row.ad || chain[1];
        const praty = row.pd || chain[2];
        const sook = row.sd || chain[3];
        const pran = row.pad || chain[4];

        if (maha && antar) {
          setMultiPath({
            mahadasha: normalizePlanetForState(maha),
            antardasha: normalizePlanetForState(antar),
            pratyantar: normalizePlanetForState(praty || chain[2] || 'Budh'),
            sookshma: normalizePlanetForState(sook || chain[3] || 'Rahu'),
            prana: normalizePlanetForState(pran || chain[4] || 'Rahu')
          });
        }
      }
    };

    window.addEventListener('activeDashaChanged', handleEvent);
    return () => window.removeEventListener('activeDashaChanged', handleEvent);
  }, []);

  const [stepUnit, setStepUnit] = useState('PERIOD'); // 'PERIOD', 'DAY', 'WEEK', 'MONTH', 'YEAR'
  const [targetDate, setTargetDate] = useState(new Date());

  const fetchDashaForDate = (tDate) => {
    try {
      const activeTableItem = localStorage.getItem('activeVimshottariDasha');
      const saved = localStorage.getItem('worksheetData');
      if (!saved && !activeTableItem) return;

      const parsed = saved ? JSON.parse(saved) : {};
      const basic = parsed?.basic_details || {};
      const meta = parsed?.meta || {};

      const bDate = basic.birth_date || meta.date || '1990-10-01';
      let bTime = basic.birth_time || meta.time || '12:00:00';
      if (bTime && bTime.split(':').length === 2) bTime = bTime + ':00';

      const tz = parseFloat(basic.tz_offset ?? meta.tz_offset ?? 5.5);
      const lat = parseFloat(basic.lat ?? 28.6);
      const lon = parseFloat(basic.lon ?? 77.2);
      const moonPos = (parsed.planet_positions || []).find(p => p.planet === 'Moon');
      const moon_lon = moonPos?.degree ?? -1;

      fetch('/api/vimshottari-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: bDate,
          time: bTime,
          tz,
          lat,
          lon,
          moon_lon,
          levels: 5,
          transit_date: tDate.toISOString()
        })
      })
        .then(r => r.json())
        .then(json => {
          const rows = json.rows || [];
          const current = rows.find(r => r.is_current) || rows[0];
          if (current) {
            const chain = current.dasha_chain ? current.dasha_chain.split('-') : [];
            const maha = current.md || chain[0];
            const antar = current.ad || chain[1];
            const praty = current.pd || chain[2];
            const sook = current.sd || chain[3];
            const pran = current.pad || chain[4];

            if (maha && antar) {
              setMultiPath({
                mahadasha: normalizePlanetForState(maha),
                antardasha: normalizePlanetForState(antar),
                pratyantar: normalizePlanetForState(praty || chain[2] || 'Budh'),
                sookshma: normalizePlanetForState(sook || chain[3] || 'Rahu'),
                prana: normalizePlanetForState(pran || chain[4] || 'Rahu')
              });
            }
          }
        })
        .catch(err => console.error('Error fetching dasha for target date:', err));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrevDasha = () => {
    const curIdx = VIMSHOTTARI_PLANET_CYCLE.indexOf(multiPath.antardasha);
    const prevIdx = (curIdx - 1 + VIMSHOTTARI_PLANET_CYCLE.length) % VIMSHOTTARI_PLANET_CYCLE.length;
    const newAntar = VIMSHOTTARI_PLANET_CYCLE[prevIdx];
    let newMaha = multiPath.mahadasha;
    if (curIdx === 0) {
      const mahaIdx = VIMSHOTTARI_PLANET_CYCLE.indexOf(multiPath.mahadasha);
      newMaha = VIMSHOTTARI_PLANET_CYCLE[(mahaIdx - 1 + VIMSHOTTARI_PLANET_CYCLE.length) % VIMSHOTTARI_PLANET_CYCLE.length];
    }
    setMultiPath(prev => ({ ...prev, mahadasha: newMaha, antardasha: newAntar }));
  };

  const handleNextDasha = () => {
    const curIdx = VIMSHOTTARI_PLANET_CYCLE.indexOf(multiPath.antardasha);
    const nextIdx = (curIdx + 1) % VIMSHOTTARI_PLANET_CYCLE.length;
    const newAntar = VIMSHOTTARI_PLANET_CYCLE[nextIdx];
    let newMaha = multiPath.mahadasha;
    if (nextIdx === 0) {
      const mahaIdx = VIMSHOTTARI_PLANET_CYCLE.indexOf(multiPath.mahadasha);
      newMaha = VIMSHOTTARI_PLANET_CYCLE[(mahaIdx + 1) % VIMSHOTTARI_PLANET_CYCLE.length];
    }
    setMultiPath(prev => ({ ...prev, mahadasha: newMaha, antardasha: newAntar }));
  };

  const handleStep = (direction) => {
    if (stepUnit === 'PERIOD') {
      if (direction === -1) handlePrevDasha();
      else handleNextDasha();
      return;
    }

    const nextDate = new Date(targetDate);
    if (stepUnit === 'DAY') {
      nextDate.setDate(nextDate.getDate() + (direction * 1));
    } else if (stepUnit === 'WEEK') {
      nextDate.setDate(nextDate.getDate() + (direction * 7));
    } else if (stepUnit === 'MONTH') {
      nextDate.setMonth(nextDate.getMonth() + (direction * 1));
    } else if (stepUnit === 'YEAR') {
      nextDate.setFullYear(nextDate.getFullYear() + (direction * 1));
    }

    setTargetDate(nextDate);
    fetchDashaForDate(nextDate);
  };

  const handleResetCurrentDasha = () => {
    const now = new Date();
    setTargetDate(now);
    if (stepUnit !== 'PERIOD') {
      fetchDashaForDate(now);
    } else {
      setMultiPath(activeDashaPath);
    }
  };

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

    const matchAntar = antardashas.filter(item =>
      matchPlanet(item.dasha, multiPath.mahadasha) && matchPlanet(item.antarDasha, multiPath.antardasha)
    );

    const matchPratyantar = pratyantardashas.filter(item =>
      matchPlanet(item.sub, multiPath.pratyantar) &&
      (matchPlanet(item.major, multiPath.antardasha) || matchPlanet(item.major, multiPath.mahadasha))
    );

    const matchSookshma = sukshmantardashas.filter(item =>
      matchPlanet(item.sub, multiPath.sookshma) &&
      (matchPlanet(item.major, multiPath.pratyantar) || matchPlanet(item.major, multiPath.mahadasha) || matchPlanet(item.major, multiPath.antardasha))
    );

    const matchPrana = pranadashas.filter(item =>
      matchPlanet(item.sub, multiPath.prana) &&
      (matchPlanet(item.major, multiPath.sookshma) || matchPlanet(item.major, multiPath.mahadasha) || matchPlanet(item.major, multiPath.pratyantar))
    );

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
            Panchastariya Path Analyzer (Combined 5-Level Dasha Confluence)
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Active Dasha Timeline Navigation Controller */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-orange-300 p-6 rounded-3xl space-y-4 shadow-xs">
          {/* Step Granularity Mode Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/80 pb-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-orange-200">
              <span className="text-xs font-black uppercase tracking-wider text-orange-950 px-2 flex items-center gap-1">
                ⏱️ Step Granularity:
              </span>
              {[
                { id: 'PERIOD', label: '🪐 Dasha Period' },
                { id: 'DAY', label: '☀️ 1 Day' },
                { id: 'WEEK', label: '📅 1 Week' },
                { id: 'MONTH', label: '📆 1 Month' },
                { id: 'YEAR', label: '🔮 1 Year' }
              ].map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setStepUnit(unit.id)}
                  className={`px-3 py-1 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${stepUnit === unit.id
                    ? 'bg-orange-300 text-black shadow-2xs font-black'
                    : 'bg-white text-slate-900 hover:bg-orange-50 border border-slate-200'
                    }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>

            {stepUnit !== 'PERIOD' && (
              <span className="text-xs font-bold text-orange-950 bg-white px-3 py-1 rounded-full border border-orange-200">
                🗓️ Target Date: {targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-300 text-black font-black text-xs uppercase tracking-widest rounded-full shadow-xs">
                  🟢 DASHA TIMELINE EXPLORER
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-900 bg-white px-3 py-1 rounded-full border border-orange-200">
                  {multiPath.mahadasha === activeDashaPath.mahadasha && multiPath.antardasha === activeDashaPath.antardasha
                    ? '✨ Current Active Dasha'
                    : '🔍 Timeline Stepper'}
                </span>
              </div>
              <h3 className="text-2xl font-black text-orange-950 mt-2 flex items-center gap-2">
                {getBilingualName(multiPath.mahadasha)} ➔ {getBilingualName(multiPath.antardasha)} Dasha Analysis
              </h3>
            </div>

            {/* Stepper Navigation Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleStep(-1)}
                className="px-4 py-2.5 bg-white text-orange-950 border-2 border-orange-300 hover:bg-orange-100/80 rounded-2xl font-black text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title={stepUnit === 'PERIOD' ? 'Previous Dasha Period' : `Previous ${stepUnit.toLowerCase()}`}
              >
                <span>◀</span> Previous {stepUnit === 'PERIOD' ? 'Dasha' : stepUnit.toLowerCase()}
              </button>

              <button
                onClick={handleResetCurrentDasha}
                className="px-4 py-2.5 bg-orange-300 text-black border-2 border-orange-700 hover:bg-orange-700 rounded-2xl font-black text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Load My Current Active Dasha"
              >
                <span>✨</span> Current Active Dasha
              </button>

              <button
                onClick={() => handleStep(1)}
                className="px-4 py-2.5 bg-white text-orange-950 border-2 border-orange-300 hover:bg-orange-100/80 rounded-2xl font-black text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title={stepUnit === 'PERIOD' ? 'Next Dasha Period' : `Next ${stepUnit.toLowerCase()}`}
              >
                Next {stepUnit === 'PERIOD' ? 'Dasha' : stepUnit.toLowerCase()} <span>▶</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dasha Level Depth Selector Bar */}
        <div className="bg-orange-50/80 border border-orange-200 p-6 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/60 pb-3">
            <h3 className="text-[22px] font-bold text-orange-950 flex items-center gap-2">
              <span>🎯</span> Dasha Analysis Depth Selector
            </h3>
            <div className="flex items-center gap-3">
              {/* Show / Hide Verses Toggle Button */}
              <button
                onClick={() => setShowVerses(!showVerses)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${showVerses
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {showVerses ? '📖 Verses: Shown' : '📖 Verses: Hidden'}
              </button>

              <span className="text-[18px] font-bold uppercase tracking-wider text-orange-800 bg-white px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
                Active: {dashaDepth} Levels ({dashaDepth === 2 ? 'Mahadasha + Antardasha' : dashaDepth === 3 ? '+ Pratyantar' : dashaDepth === 4 ? '+ Sookshma' : 'Full 5-Level Path'})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { depth: 2, label: '⚡ 2 Levels (Mahadasha + Antardasha)' },
              { depth: 3, label: '🔮 3 Levels (+ Pratyantar)' },
              { depth: 4, label: '📜 4 Levels (+ Sookshma)' },
              { depth: 5, label: '✨ 5 Levels (Full Panchastariya Path)' }
            ].map(item => (
              <button
                key={item.depth}
                onClick={() => setDashaDepth(item.depth)}
                className={`px-5 py-3 rounded-2xl text-[18px] font-bold transition-all ${dashaDepth === item.depth
                  ? 'bg-orange-300 text-black shadow-md shadow-orange-200 border-2 border-orange-700'
                  : 'bg-white text-black border border-orange-200 hover:bg-orange-100/60 shadow-xs'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Selector Grid based on dashaDepth */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${dashaDepth === 2 ? 'lg:grid-cols-2' : dashaDepth === 3 ? 'lg:grid-cols-3' : dashaDepth === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100`}>
          {/* 1. Mahadasha Selector */}
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

          {/* 2. Antardasha Selector */}
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

          {/* 3. Pratyantar Dasha Selector */}
          {dashaDepth >= 3 && (
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
          )}

          {/* 4. Sookshma Dasha Selector */}
          {dashaDepth >= 4 && (
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
          )}

          {/* 5. Prana Dasha Selector */}
          {dashaDepth >= 5 && (
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
          )}
        </div>

        {/* Dasha Path Visualization Flow */}
        <div className="flex flex-wrap items-center gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl justify-center">
          {Object.entries(multiPath).slice(0, dashaDepth).map(([key, value], idx) => {
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
                {idx < dashaDepth - 1 && <span className="text-zinc-600 font-extrabold text-[18px] pt-4">➔</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Results Timeline/List */}
        <div className="space-y-6">
          {/* Level 1 & 2: Mahadasha & Antardasha Combination (Always shown for depth >= 2) */}
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
                    {showVerses && item.verses && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                      </div>
                    )}
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

          {/* Level 3: Pratyantardasha (Shown if dashaDepth >= 3) */}
          {dashaDepth >= 3 && (
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
                      {showVerses && item.verses && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                        </div>
                      )}
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Level 4: Sookshmadasha (Shown if dashaDepth >= 4) */}
          {dashaDepth >= 4 && (
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
                      {showVerses && item.verses && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-yellow-200 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                        </div>
                      )}
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Level 5: Pranadasha (Shown if dashaDepth >= 5) */}
          {dashaDepth >= 5 && (
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
                      {showVerses && item.verses && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                        </div>
                      )}
                      <p className="text-[18px] text-black leading-relaxed">{item.effects}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
