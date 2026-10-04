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

const EN_PLANET_MAP = {
  'Sūrya': 'Sun',
  'Chandra': 'Moon',
  'Mangal': 'Mars',
  'Rahu': 'Rahu',
  'Guru': 'Jupiter',
  'Śhani': 'Saturn',
  'Budh': 'Mercury',
  'Ketu': 'Ketu',
  'Śukra': 'Venus'
};

const EN_TO_HINDI_MAP = {
  'Sun': 'Sūrya',
  'Moon': 'Chandra',
  'Mars': 'Mangal',
  'Rahu': 'Rahu',
  'Jupiter': 'Guru',
  'Saturn': 'Śhani',
  'Mercury': 'Budh',
  'Ketu': 'Ketu',
  'Venus': 'Śukra'
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
  let norm = getDisplayPlanetName(planet);
  if (EN_TO_HINDI_MAP[norm]) {
    norm = EN_TO_HINDI_MAP[norm];
  }
  return PLANET_BILINGUAL_MAP[norm] || planet;
};

const getAspectingPlanets = (targetHouse, placements) => {
  const aspectingPlanets = [];
  placements.forEach(p => {
    const H = p.house;
    const aspects = [(H + 6) % 12 || 12]; // 7th aspect is universal

    if (p.planet === 'Mars') {
      aspects.push((H + 3) % 12 || 12); // 4th
      aspects.push((H + 7) % 12 || 12); // 8th
    }
    if (p.planet === 'Jupiter' || p.planet === 'Rahu' || p.planet === 'Ketu') {
      aspects.push((H + 4) % 12 || 12); // 5th
      aspects.push((H + 8) % 12 || 12); // 9th
    }
    if (p.planet === 'Saturn') {
      aspects.push((H + 2) % 12 || 12); // 3rd
      aspects.push((H + 9) % 12 || 12); // 10th
    }

    if (aspects.includes(targetHouse)) {
      aspectingPlanets.push(p.planet);
    }
  });
  return aspectingPlanets;
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
  const [userPlanetPlacements, setUserPlanetPlacements] = useState([]);
  const [transitPlacements, setTransitPlacements] = useState(null);
  const [evalMode, setEvalMode] = useState('birth'); // 'birth' or 'transit'
  const [lagnaSignIndex, setLagnaSignIndex] = useState(0);

  // Auto-detect and sync user's running dasha from saved birth chart data or active table event

  useEffect(() => {
    const loadActiveDasha = () => {
      try {
        const activeTableItem = localStorage.getItem('activeVimshottariDasha');
        let activeRow = activeTableItem ? JSON.parse(activeTableItem) : null;

        const saved = localStorage.getItem('worksheetData');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.planet_positions && Array.isArray(parsed.planet_positions)) {
            setUserPlanetPlacements(parsed.planet_positions);
          }
          
          let lsi = 0;
          if (parsed.charts?.ascendant_sign_index !== undefined) {
            lsi = parsed.charts.ascendant_sign_index;
          } else if (parsed.charts?.houses?.[1]?.sign_index !== undefined) {
            lsi = parsed.charts.houses[1].sign_index;
          } else if (parsed.charts?.houses?.[1]?.cusp_deg !== undefined) {
            lsi = Math.floor(parsed.charts.houses[1].cusp_deg / 30);
          } else if (parsed.planet_positions) {
            const asc = parsed.planet_positions.find(p => p.planet === 'Ascendant' || p.planet === 'Lagna');
            if (asc && asc.degree !== undefined) lsi = Math.floor(asc.degree / 30);
          }
          setLagnaSignIndex(lsi);

          if (!activeRow) {
            const vims = parsed?.vimshottari_dasha || parsed?.vimsottari_dasha || parsed?.dashas?.vimshottari || parsed?.current_dasha;
            if (Array.isArray(vims)) {
              activeRow = vims.find(r => r.is_current || r.isCurrent);
            } else if (vims && vims.rows && Array.isArray(vims.rows)) {
              activeRow = vims.rows.find(r => r.is_current || r.isCurrent);
            }
          }
        }

        // Fetch current transit placements
        if (saved) {
          const parsed = JSON.parse(saved);
          const bd = parsed?.basic_details || {};
          const meta = parsed?.meta || {};
          const birthDate = bd.birth_date || meta.date;
          const birthTime = bd.birth_time || meta.time;

          if (birthDate && birthTime) {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            const h = String(now.getHours()).padStart(2, '0');
            const mi = String(now.getMinutes()).padStart(2, '0');

            fetch('/api/transit/time_machine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                birth_date: birthDate,
                birth_time: birthTime,
                lat: bd.lat || meta.lat || 28.6,
                lon: bd.lon || meta.lon || 77.2,
                tz_offset: bd.tz_offset || meta.tz || 5.5,
                transit_date: `${y}-${m}-${d}`,
                transit_time: `${h}:${mi}:00`
              })
            })
              .then(res => res.json())
              .then(data => {
                if (data.transit_planets) {
                  let lagnaSignIndex = 0;
                  if (parsed.charts?.ascendant_sign_index !== undefined) {
                    lagnaSignIndex = parsed.charts.ascendant_sign_index;
                  } else if (parsed.charts?.houses?.[1]?.sign_index !== undefined) {
                    lagnaSignIndex = parsed.charts.houses[1].sign_index;
                  } else if (parsed.charts?.houses?.[1]?.cusp_deg !== undefined) {
                    lagnaSignIndex = Math.floor(parsed.charts.houses[1].cusp_deg / 30);
                  } else if (parsed.planet_positions) {
                    const asc = parsed.planet_positions.find(p => p.planet === 'Ascendant' || p.planet === 'Lagna');
                    if (asc && asc.degree !== undefined) lagnaSignIndex = Math.floor(asc.degree / 30);
                  }

                  const mappedTransits = [];
                  const ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

                  Object.entries(data.transit_planets).forEach(([planet, pos]) => {
                    if (!pos || !pos.sidereal) return;
                    const signIdx = Math.floor(pos.sidereal.lon / 30);
                    const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;

                    mappedTransits.push({
                      planet: planet,
                      house: houseNum,
                      sign: ZODIAC_SIGNS[signIdx]
                    });
                  });
                  setTransitPlacements(mappedTransits);
                }
              })
              .catch(console.error);
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
            <div className="flex flex-col border-b border-slate-100 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <h4 className="text-xl font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-orange-900 text-[20px] font-bold">1-2</span>
                  Mahadasha & Antardasha Combination
                </h4>
                <span className="text-[20px] font-semibold text-slate-900 text-right md:text-left">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.antardasha)}</span>
              </div>

              {(() => {
                const mdPlanetEn = EN_PLANET_MAP[multiPath.mahadasha];
                const adPlanetEn = EN_PLANET_MAP[multiPath.antardasha];
                const mdPosGlobal = userPlanetPlacements.find(p => p.planet === mdPlanetEn);
                const adPosGlobal = userPlanetPlacements.find(p => p.planet === adPlanetEn);

                const mdTransit = transitPlacements ? transitPlacements.find(p => p.planet === mdPlanetEn) : null;
                const adTransit = transitPlacements ? transitPlacements.find(p => p.planet === adPlanetEn) : null;

                if (!mdPosGlobal && !adPosGlobal) return null;

                return (
                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                    {mdPosGlobal && (
                      <div className="flex-1 bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800/70 mb-1">Mahadasha Lord ({getBilingualName(multiPath.mahadasha)})</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-white/60 p-2 rounded-lg border border-amber-100/50">
                            <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Birth Chart</div>
                            <div className="text-[14px] font-bold text-amber-900">House {mdPosGlobal.house}</div>
                            <div className="text-[14px] text-amber-700">{mdPosGlobal.sign}</div>
                          </div>
                          <div className="bg-white/60 p-2 rounded-lg border border-amber-100/50">
                            <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Current Transit</div>
                            {mdTransit ? (
                              <>
                                <div className="text-[14px] font-bold text-blue-900">House {mdTransit.house}</div>
                                <div className="text-[14px] text-blue-700">{mdTransit.sign}</div>
                              </>
                            ) : <div className="text-[14px] text-slate-400 mt-1">Loading...</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    {adPosGlobal && (
                      <div className="flex-1 bg-orange-50/50 border border-orange-100 rounded-xl p-3">
                        <div className="text-[14px] font-bold uppercase tracking-wider text-orange-800/70 mb-1">Antardasha Lord ({getBilingualName(multiPath.antardasha)})</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-white/60 p-2 rounded-lg border border-orange-100/50">
                            <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Birth Chart</div>
                            <div className="text-[14px] font-bold text-orange-900">House {adPosGlobal.house}</div>
                            <div className="text-[14px] text-orange-700">{adPosGlobal.sign}</div>
                          </div>
                          <div className="bg-white/60 p-2 rounded-lg border border-orange-100/50">
                            <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Current Transit</div>
                            {adTransit ? (
                              <>
                                <div className="text-[14px] font-bold text-blue-900">House {adTransit.house}</div>
                                <div className="text-[14px] text-blue-700">{adTransit.sign}</div>
                              </>
                            ) : <div className="text-[14px] text-slate-900 mt-1">Loading...</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            {multiLevelResults.antar.length === 0 ? (
              <p className="text-slate-400 italic">No specific combination text found in scriptures.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-2">
                  <div className="inline-flex flex-col sm:flex-row bg-slate-100 p-1 rounded-xl items-center sm:gap-0 gap-1">
                    <button
                      onClick={() => setEvalMode('birth')}
                      className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${evalMode === 'birth' ? 'bg-white text-orange-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Analyze Birth Chart
                    </button>
                    <button
                      onClick={() => setEvalMode('transit')}
                      className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${evalMode === 'transit' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      disabled={!transitPlacements}
                    >
                      Analyze Transit
                    </button>
                  </div>
                </div>
                {(() => {
                  const processedAntar = [];
                  multiLevelResults.antar.forEach((item, idx) => {
                    let isMatch = false;
                    let matchReasons = [];
                    let hasConditions = !!item.conditions;

                    const activePlacements = evalMode === 'transit' && transitPlacements ? transitPlacements : userPlanetPlacements;

                    if (hasConditions && activePlacements.length > 0) {
                      const adPlanetEn = EN_PLANET_MAP[multiPath.antardasha];
                      const mdPlanetEn = EN_PLANET_MAP[multiPath.mahadasha];
                      const adPos = activePlacements.find(p => p.planet === adPlanetEn);
                      const mdPos = activePlacements.find(p => p.planet === mdPlanetEn);

                      if (adPos) {
                        if (item.conditions.adHouse && item.conditions.adHouse.includes(adPos.house)) {
                          isMatch = true;
                          matchReasons.push(`${getBilingualName(adPos.planet)} is placed in House ${adPos.house}`);
                        }
                        if (item.conditions.adHouseFromMd && mdPos) {
                          let distance = ((adPos.house - mdPos.house + 12) % 12) + 1;
                          if (item.conditions.adHouseFromMd.includes(distance)) {
                            isMatch = true;
                            matchReasons.push(`${getBilingualName(adPos.planet)} is placed ${distance} houses away from ${getBilingualName(mdPos.planet)}`);
                          }
                        }

                        const aspectingPlanets = getAspectingPlanets(adPos.house, activePlacements);
                        const conjunctPlanets = activePlacements.filter(p => p.house === adPos.house && p.planet !== adPos.planet).map(p => p.planet);

                        const isBenefic = (p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p);
                        const isMalefic = (p) => ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p);

                        if (item.conditions.drishtiFrom) {
                          item.conditions.drishtiFrom.forEach(dPlanet => {
                            if (aspectingPlanets.includes(dPlanet)) {
                              isMatch = true;
                              matchReasons.push(`${getBilingualName(adPos.planet)} receives a Drishti (Aspect) from ${getBilingualName(dPlanet)}`);
                            }
                            if (dPlanet === 'Benefic' && aspectingPlanets.some(isBenefic)) {
                              isMatch = true;
                              const benefics = aspectingPlanets.filter(isBenefic).map(getBilingualName).join(", ");
                              matchReasons.push(`${getBilingualName(adPos.planet)} receives a Drishti from Benefic planet(s): ${benefics}`);
                            }
                            if (dPlanet === 'Malefic' && aspectingPlanets.some(isMalefic)) {
                              isMatch = true;
                              const malefics = aspectingPlanets.filter(isMalefic).map(getBilingualName).join(", ");
                              matchReasons.push(`${getBilingualName(adPos.planet)} receives a Drishti from Malefic planet(s): ${malefics}`);
                            }
                          });
                        }

                        if (item.conditions.conjunctWith) {
                          item.conditions.conjunctWith.forEach(cPlanet => {
                            if (conjunctPlanets.includes(cPlanet)) {
                              isMatch = true;
                              matchReasons.push(`${getBilingualName(adPos.planet)} is Conjunct with ${getBilingualName(cPlanet)} in House ${adPos.house}`);
                            }
                            if (cPlanet === 'Benefic' && conjunctPlanets.some(isBenefic)) {
                              isMatch = true;
                              const benefics = conjunctPlanets.filter(isBenefic).map(getBilingualName).join(", ");
                              matchReasons.push(`${getBilingualName(adPos.planet)} is Conjunct with Benefic planet(s): ${benefics}`);
                            }
                            if (cPlanet === 'Malefic' && conjunctPlanets.some(isMalefic)) {
                              isMatch = true;
                              const malefics = conjunctPlanets.filter(isMalefic).map(getBilingualName).join(", ");
                              matchReasons.push(`${getBilingualName(adPos.planet)} is Conjunct with Malefic planet(s): ${malefics}`);
                            }
                          });
                        }
                      }
                    }

                    if (hasConditions && !isMatch && activePlacements.length > 0) {
                      return; // Hide verses that have conditions but don't match the chart
                    }

                    const adPlanetEn = EN_PLANET_MAP[multiPath.antardasha];
                    const adPos = activePlacements.find(p => p.planet === adPlanetEn);
                    const house2Sign = (lagnaSignIndex + 1) % 12;
                    const house7Sign = (lagnaSignIndex + 6) % 12;
                    const SIGN_LORDS = {
                      0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 
                      4: 'Sun', 5: 'Mercury', 6: 'Venus', 7: 'Mars', 
                      8: 'Jupiter', 9: 'Saturn', 10: 'Saturn', 11: 'Jupiter'
                    };
                    const isMarakaLord = SIGN_LORDS[house2Sign] === adPlanetEn || SIGN_LORDS[house7Sign] === adPlanetEn;
                    const isInMarakaHouse = adPos && (adPos.house === 2 || adPos.house === 7);
                    const isMaraka = isMarakaLord || isInMarakaHouse;

                    const processedItem = { ...item, isMatch, matchReasons, reasonKey: matchReasons.slice().sort().join('|') };
                    if (!isMaraka && processedItem.deathEffects && (processedItem.deathEffects.includes("Dhan's") || processedItem.deathEffects.includes("Yuvati's") || processedItem.deathEffects.includes("Dhan, or Yuvati"))) {
                      processedItem.deathEffects = null;
                      if (!processedItem.general && !processedItem.adverse && processedItem.remedial) {
                        processedItem.remedial = null; // Remove remedial if it was only for deathEffects
                      }
                    }

                    if (processedItem.isMatch && processedItem.reasonKey) {
                      const existingGroup = processedAntar.find(g => g.isMatch && g.reasonKey === processedItem.reasonKey);
                      if (existingGroup) {
                        if (processedItem.verses) existingGroup.verses = existingGroup.verses ? existingGroup.verses + ", " + processedItem.verses : processedItem.verses;
                        if (processedItem.general) existingGroup.general = (existingGroup.general ? existingGroup.general + "\n\n" : "") + processedItem.general;
                        if (processedItem.adverse) existingGroup.adverse = (existingGroup.adverse ? existingGroup.adverse + "\n\n" : "") + processedItem.adverse;
                        if (processedItem.deathEffects) existingGroup.deathEffects = (existingGroup.deathEffects ? existingGroup.deathEffects + "\n\n" : "") + processedItem.deathEffects;
                        if (processedItem.remedial) existingGroup.remedial = (existingGroup.remedial ? existingGroup.remedial + "\n\n" : "") + processedItem.remedial;
                        return; // Successfully merged, skip push
                      }
                    }

                    processedAntar.push(processedItem);
                  });

                  return processedAntar.map((item, idx) => (
                    <div key={item.id || idx} className={`space-y-3 p-4 rounded-xl transition-all ${item.isMatch ? (evalMode === 'transit' ? 'bg-blue-50 border-2 border-blue-300 shadow-sm' : 'bg-green-50 border-2 border-green-300 shadow-sm') : 'border border-transparent'}`}>
                      {item.isMatch && (
                        <div className={`mb-4 ${evalMode === 'transit' ? 'bg-blue-50/50 border-blue-200' : 'bg-green-50/50 border-green-200'} border rounded-xl p-3 shadow-sm`}>
                          <div className={`inline-flex items-center px-3 py-1 ${evalMode === 'transit' ? 'bg-blue-500' : 'bg-green-500'} text-white text-xs font-bold rounded-full shadow-sm uppercase tracking-wider mb-2`}>
                            ✨ Matches Your {evalMode === 'transit' ? 'Current Transit' : 'Birth Chart'}
                          </div>
                          <div className={`text-sm ${evalMode === 'transit' ? 'text-blue-800' : 'text-green-800'} space-y-1`}>
                            {item.matchReasons.map((reason, reasonIdx) => (
                              <div key={reasonIdx} className="flex items-start gap-2">
                                <span className={`${evalMode === 'transit' ? 'text-blue-500' : 'text-green-500'} mt-0.5 font-bold`}>✓</span>
                                <span className="font-medium">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {showVerses && item.verses && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-bold text-[18px]">Verses {item.verses}</span>
                        </div>
                      )}
                      {item.general && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Auspicious & General Effects</h5>
                          <p className="text-[18px] text-black leading-relaxed whitespace-pre-line">{item.general}</p>
                        </div>
                      )}
                      {item.adverse && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-rose-800 mb-1">Adverse Results</h5>
                          <p className="text-[18px] text-black leading-relaxed whitespace-pre-line">{item.adverse}</p>
                        </div>
                      )}
                      {item.deathEffects && (
                        <div>
                          <h5 className="text-[18px] font-bold uppercase tracking-wider text-purple-900 mb-1">Maraka / Severe Concerns</h5>
                          <p className="text-[18px] text-black leading-relaxed whitespace-pre-line">{item.deathEffects}</p>
                        </div>
                      )}
                      {item.remedial && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                          <div className="text-amber-600 text-[18px]">🕉️</div>
                          <div>
                            <h5 className="text-[18px] font-bold uppercase text-amber-800">Remedial Measures</h5>
                            <p className="text-black text-[18px] whitespace-pre-line">{item.remedial}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* Level 3: Pratyantardasha (Shown if dashaDepth >= 3) */}
          {dashaDepth >= 3 && (
            <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-black text-[20px] font-medium">3</span>
                  Pratyantar Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900 text-right md:text-left">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.pratyantar)}</span>
              </div>
              {(() => {
                const pPlanetEn = EN_PLANET_MAP[multiPath.pratyantar];
                const pPosGlobal = userPlanetPlacements.find(p => p.planet === pPlanetEn);
                const pTransit = transitPlacements ? transitPlacements.find(p => p.planet === pPlanetEn) : null;
                if (!pPosGlobal) return null;
                return (
                  <div className="flex flex-col md:flex-row gap-4 mt-2 mb-4">
                    <div className="flex-1 bg-yellow-50/50 border border-yellow-100 rounded-xl p-3">
                      <div className="text-[14px] font-bold uppercase tracking-wider text-yellow-800/70 mb-1">Pratyantar Lord ({getBilingualName(multiPath.pratyantar)})</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/60 p-2 rounded-lg border border-yellow-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Birth Chart</div>
                          <div className="text-[14px] font-bold text-yellow-900">House {pPosGlobal.house}</div>
                          <div className="text-[14px] text-yellow-700">{pPosGlobal.sign}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg border border-yellow-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Current Transit</div>
                          {pTransit ? (
                            <>
                              <div className="text-[14px] font-bold text-blue-900">House {pTransit.house}</div>
                              <div className="text-[14px] text-blue-700">{pTransit.sign}</div>
                            </>
                          ) : <div className="text-[14px] text-slate-900 mt-1">Loading...</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-black text-[20px] font-medium">4</span>
                  Sookshma Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900 text-right md:text-left">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.sookshma)}</span>
              </div>
              {(() => {
                const sPlanetEn = EN_PLANET_MAP[multiPath.sookshma];
                const sPosGlobal = userPlanetPlacements.find(p => p.planet === sPlanetEn);
                const sTransit = transitPlacements ? transitPlacements.find(p => p.planet === sPlanetEn) : null;
                if (!sPosGlobal) return null;
                return (
                  <div className="flex flex-col md:flex-row gap-4 mt-2 mb-4">
                    <div className="flex-1 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                      <div className="text-[14px] font-bold uppercase tracking-wider text-emerald-800/70 mb-1">Sookshma Lord ({getBilingualName(multiPath.sookshma)})</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/60 p-2 rounded-lg border border-emerald-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Birth Chart</div>
                          <div className="text-[14px] font-bold text-emerald-900">House {sPosGlobal.house}</div>
                          <div className="text-[14px] text-emerald-700">{sPosGlobal.sign}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg border border-emerald-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Current Transit</div>
                          {sTransit ? (
                            <>
                              <div className="text-[14px] font-bold text-blue-900">House {sTransit.house}</div>
                              <div className="text-[14px] text-blue-700">{sTransit.sign}</div>
                            </>
                          ) : <div className="text-[14px] text-slate-900 mt-1">Loading...</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="text-[20px] font-bold text-orange-950 flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-orange-900 text-[20px] font-black">5</span>
                  Prana Dasha Effects
                </h4>
                <span className="text-[20px] font-semibold text-slate-900 text-right md:text-left">{getBilingualName(multiPath.mahadasha)} - {getBilingualName(multiPath.prana)}</span>
              </div>
              {(() => {
                const prPlanetEn = EN_PLANET_MAP[multiPath.prana];
                const prPosGlobal = userPlanetPlacements.find(p => p.planet === prPlanetEn);
                const prTransit = transitPlacements ? transitPlacements.find(p => p.planet === prPlanetEn) : null;
                if (!prPosGlobal) return null;
                return (
                  <div className="flex flex-col md:flex-row gap-4 mt-2 mb-4">
                    <div className="flex-1 bg-purple-50/50 border border-purple-100 rounded-xl p-3">
                      <div className="text-[14px] font-bold uppercase tracking-wider text-purple-800/70 mb-1">Prana Lord ({getBilingualName(multiPath.prana)})</div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/60 p-2 rounded-lg border border-purple-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Birth Chart</div>
                          <div className="text-[14px] font-bold text-purple-900">House {prPosGlobal.house}</div>
                          <div className="text-[14px] text-purple-700">{prPosGlobal.sign}</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg border border-purple-100/50">
                          <div className="text-[14px] uppercase font-bold text-slate-900 mb-0.5">Current Transit</div>
                          {prTransit ? (
                            <>
                              <div className="text-[14px] font-bold text-blue-900">House {prTransit.house}</div>
                              <div className="text-[14px] text-blue-700">{prTransit.sign}</div>
                            </>
                          ) : <div className="text-[14px] text-slate-900 mt-1">Loading...</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
