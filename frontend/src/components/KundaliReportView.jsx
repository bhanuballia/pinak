import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ZodiacRectSign from './ZodiacPDFchart';
import AshtakavargaChart from './AshtakavargaChart';
import VimshottariGridTimeline from './VimshottariGridTimeline';
import SarvaChanchaChakra from './SarvaChanchaChakra';
import BhinnaTable from './BhinnaTable';
import AsthavargaReduction from './AsthavargaReduction';
import { GemstonePanel } from './InteractiveWorksheet';
import VimsopakaAssessment from './VimsopakaAssessment';
import {
  SUN_HOUSE_INTERPRETATIONS,
  MOON_HOUSE_INTERPRETATIONS,
  MARS_HOUSE_INTERPRETATIONS,
  MERCURY_HOUSE_INTERPRETATIONS,
  JUPITER_HOUSE_INTERPRETATIONS,
  VENUS_HOUSE_INTERPRETATIONS,
  SATURN_HOUSE_INTERPRETATIONS,
  RAHU_HOUSE_INTERPRETATIONS,
  KETU_HOUSE_INTERPRETATIONS
} from './InteractiveWorksheet';

const PLANET_INTERP_MAP = {
  "Sun": SUN_HOUSE_INTERPRETATIONS,
  "Moon": MOON_HOUSE_INTERPRETATIONS,
  "Mars": MARS_HOUSE_INTERPRETATIONS,
  "Mercury": MERCURY_HOUSE_INTERPRETATIONS,
  "Jupiter": JUPITER_HOUSE_INTERPRETATIONS,
  "Venus": VENUS_HOUSE_INTERPRETATIONS,
  "Saturn": SATURN_HOUSE_INTERPRETATIONS,
  "Rahu": RAHU_HOUSE_INTERPRETATIONS,
  "Ketu": KETU_HOUSE_INTERPRETATIONS
};

const SAV_INTERPRETATIONS = {
  1: { area: "Self, Physical Body, General Well-being", sig: "Sun" },
  2: { area: "Wealth, Speech, Family", sig: "Jupiter" },
  3: { area: "Courage, Siblings, Short Trips", sig: "Mars" },
  4: { area: "Mother, Property, Happiness", sig: "Moon" },
  5: { area: "Children, Intellect, Speculation", sig: "Jupiter" },
  6: { area: "Enemies, Debt, Diseases", sig: "Mars, Saturn" },
  7: { area: "Marriage, Partnerships", sig: "Venus" },
  8: { area: "Longevity, Obstacles, Hidden matters", sig: "Saturn" },
  9: { area: "Luck, Religion, Father, Long journeys", sig: "Jupiter, Sun" },
  10: { area: "Career, Profession, Status", sig: "Mercury, Jupiter, Sun, Saturn" },
  11: { area: "Gains, Friends, Fulfillment of desires", sig: "Jupiter" },
  12: { area: "Losses, Expenses, Foreign lands", sig: "Saturn" }
};

const LIFE_ANALYSIS_SECTIONS = [
  { key: "character_personality", en: "Personality & Character", icon: "👤" },
  { key: "happiness", en: "Happiness & Fulfillment", icon: "😊" },
  { key: "life_purpose", en: "Life Purpose", icon: "🎯" },
  { key: "career", en: "Career & Profession", icon: "💼" },
  { key: "finance", en: "Wealth & Finance", icon: "💰" },
  { key: "health", en: "Health & Vitality", icon: "⚕️" },
  { key: "relationships", en: "Relationships & Marriage", icon: "❤️" },
  { key: "education", en: "Education & Knowledge", icon: "📚" },
  { key: "hobbies", en: "Creativity & Hobbies", icon: "🎨" },
  { key: "lifestyle", en: "Lifestyle & Routine", icon: "🌅" },
  { key: "spirituality", en: "Spirituality & Soul Journey", icon: "🕉️" },
  { key: "hidden_potential", en: "Latent Potential & Occult", icon: "🔮" },
  { key: "travel", en: "Travel & Global Connections", icon: "✈️" },
  { key: "siblings_and_courage", en: "Siblings, Peers & Valour", icon: "🤝" },
  { key: "parental_heritage", en: "Ancestral Heritage & Blessings", icon: "🌳" },
];

const getSAVBand = (score) => {
  if (score < 21) return { label: "Very Weak", color: "text-red-600", desc: "Requires significant effort and remedies to mitigate challenges." };
  if (score <= 25) return { label: "Weak", color: "text-orange-500", desc: "Area shows some deficiency. May cause delays or frustrations." };
  if (score <= 28) return { label: "Average", color: "text-yellow-600", desc: "Normal functioning. Results depend on planetary transits and dashas." };
  if (score <= 33) return { label: "Strong", color: "text-green-600", desc: "Very supportive. Success comes relatively easily here." };
  return { label: "Very Strong", color: "text-emerald-600", desc: "Exceptional strength. A major pillar of success in life." };
};

const SectionTitle = ({ children }) => (
  <h2 className="section-heading text-2xl font-serif font-bold text-indigo-900 border-b-2 border-indigo-100 pb-2 mb-4 mt-8 print:break-before-page" style={{ pageBreakBefore: 'always', backgroundColor: 'white' }}>
    {children}
  </h2>
);

const SubsectionTitle = ({ children }) => (
  <h3 className="section-heading text-xl font-medium text-indigo-800 mb-3 mt-6 print:mt-2" style={{ backgroundColor: 'white' }}>
    {children}
  </h3>
);

const OPTIONAL_SECTIONS = [
  { id: 'auspicious_factors', label: 'Auspicious Factors' },
  { id: 'yogas', label: 'Classical Yogas' },
  { id: 'dasha', label: 'Current Dasha Periods' },
  { id: 'd2', label: 'D2 Chart (Wealth)' },
  { id: 'd3', label: 'D3 Chart (Siblings)' },
  { id: 'd4', label: 'D4 Chart (Fortune)' },
  { id: 'd5', label: 'D5 Chart (Power)' },
  { id: 'd6', label: 'D6 Chart (Health)' },
  { id: 'd7', label: 'D7 Chart (Children)' },
  { id: 'd8', label: 'D8 Chart (Longevity)' },
  { id: 'd9', label: 'D9 Chart (Marriage)' },
  { id: 'd10', label: 'D10 Chart (Career)' },
  { id: 'd12', label: 'D12 Chart (Parents)' },
  { id: 'd16', label: 'D16 Chart (Vehicles)' },
  { id: 'd20', label: 'D20 Chart (Spiritual)' },
  { id: 'd24', label: 'D24 Chart (Education)' },
  { id: 'd27', label: 'D27 Chart (Strengths)' },
  { id: 'd30', label: 'D30 Chart (Misfortunes)' },
  { id: 'd40', label: 'D40 Chart (Auspicious)' },
  { id: 'd45', label: 'D45 Chart (General)' },
  { id: 'd60', label: 'D60 Chart (Past Life)' },
  { id: 'ashtakavarga', label: 'Sarvashtakavarga' },
  { id: 'destiny_timeline', label: 'Destiny Timeline' },
  { id: 'cosmic_life_map', label: '5D Cosmic Life Map' },
  { id: 'destiny_matrix', label: 'Destiny Matrix Visualizer' },
  { id: 'wealth_analysis', label: 'Wealth Analysis' },
  { id: 'life_events', label: 'Life Event Predictions' },
  { id: 'dosha', label: 'Dosha Summary & Sade Sati' },
  { id: 'remedies', label: 'Recommended Remedies' },
  { id: 'soul_archetype', label: 'Soul Archetype & Destiny' },
  { id: 'akashic', label: 'Akashic Soul Record' },
  { id: 'omniscient', label: 'Omniscient Analysis' },
  { id: 'quantum', label: 'Quantum Forecast Analysis' },
  { id: 'dimensional', label: 'Dimensional Destiny Analysis' },
  { id: 'astral', label: 'Astral Matrix Destiny Analysis' },
  { id: 'cosmic_core', label: 'Cosmic Core Destiny Analysis' },
  { id: 'maharishi', label: 'Maharishi Destiny Analysis' },
  { id: 'brahma', label: 'Brahma Destiny Analysis' },
  { id: 'paramarshi', label: 'Paramarshi Advisor Analysis' },
  { id: 'planetary_wisdom', label: 'Planetary Wisdom' },
  { id: 'oracle', label: 'Sage Insights & Divine Oracle' },
  { id: 'karma_timeline', label: 'Advanced Karma Projection' },
  { id: 'life_events_narrative', label: 'Life Events Narrative' },
  { id: 'probability_matrix', label: 'Probability Matrix Engine' },
  { id: 'neural_summary', label: 'Cosmic Neural Summary' },
  { id: 'destiny_signature', label: 'Destiny Signature' },
  { id: 'life_vector', label: 'AI Life Vector Analysis' },
  { id: 'sarva_chancha', label: 'Sarva Chancha Chakra & Tables' },
  { id: 'ashtakavarga_reduction', label: 'Ashtakavarga Reduction' },
  { id: 'vimsopaka', label: 'Varga Strength Matrix' },
  { id: 'gemstones', label: 'Recommended Gemstones' },
  { id: 'life_analysis', label: 'Detailed Life Analysis' },
  { id: 'rituals', label: 'Detailed Remedial Rituals' },
  { id: 'predictive_logic', label: 'Advanced Predictive Logic' },
  { id: 'universal_wisdom', label: 'Universal Wisdom' },
  { id: 'master_engine', label: 'Premium Cosmic Insights' }
];

const KundaliReportView = ({ data }) => {
  const [activeSections, setActiveSections] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [printDropdownOpen, setPrintDropdownOpen] = useState(false);
  const [expandedVargas, setExpandedVargas] = useState({});

  const toggleVarga = (vargaKey) => {
    setExpandedVargas(prev => ({
      ...prev,
      [vargaKey]: !prev[vargaKey]
    }));
  };

  const toggleSection = (id) => {
    setActiveSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAll = () => {
    const all = {};
    OPTIONAL_SECTIONS.forEach(s => all[s.id] = true);
    setActiveSections(all);
  };

  const deselectAll = () => {
    setActiveSections({});
  };

  useEffect(() => {
    document.title = `Kundali_Report_${data?.meta?.name || 'User'}`;

    // --- DRM / Content Protection Logic ---
    const handleKeyDown = (e) => {
      // Attempt to block PrintScreen and basic screenshot shortcuts
      if (e.key === 'PrintScreen' || e.keyCode === 44 || (e.metaKey && e.shiftKey)) {
        navigator.clipboard.writeText('Screenshots are disabled for this confidential report.');
        // Briefly black out the screen
        const overlay = document.createElement('div');
        overlay.id = 'drm-blackout-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '999999';
        document.body.appendChild(overlay);
        setTimeout(() => {
          const el = document.getElementById('drm-blackout-overlay');
          if (el) el.remove();
        }, 1500);
      }
      
      // Block Ctrl+C (Copy), Ctrl+P (Print), Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'p' || e.key === 's' || e.key === 'a')) {
        e.preventDefault();
      }
    };
    
    const handleContextMenu = (e) => {
      e.preventDefault(); // Disable Right Click
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    // Inject global CSS to disable selection and physical printing
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.head.removeChild(style);
    };
  }, [data]);

  if (!data) return <div>No Data</div>;

  const handlePrint = () => {
    window.print();
  };

  const renderPlanetTable = () => {
    if (!data.planet_positions) return null;
    return (
      <div className="overflow-x-auto mb-6 print:mb-2">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Planet</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">R</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Sign</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Degree</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Nakshatra</th>
            </tr>
          </thead>
          <tbody>
            {data.planet_positions.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm">{p.planet}</td>
                <td className="py-2 px-4 border-b text-sm text-red-500 font-bold">{p.retrograde ? 'R' : ''}</td>
                <td className="py-2 px-4 border-b text-sm">{p.sign}</td>
                <td className="py-2 px-4 border-b text-sm">{p.degree}</td>
                <td className="py-2 px-4 border-b text-sm">{p.nakshatra} ({p.nakshatra_lord})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDoshas = () => {
    if (!data.dosha) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {Object.entries(data.dosha).map(([key, info]) => {
          if (key === 'sadesati') {
            return (
              <div key={key} className={`p-4 rounded border ${info.present ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <h4 className="font-bold text-lg capitalize">{key.replace('_', ' ')}</h4>
                <p className={`font-semibold ${info.present ? 'text-red-700' : 'text-green-700'}`}>{info.summary}</p>
                {info.details && info.details.map((d, i) => <p key={i} className="text-sm mt-1 text-gray-700">{d}</p>)}
              </div>
            );
          }
          return (
            <div key={key} className={`p-4 rounded border ${info.present ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <h4 className="font-bold text-lg capitalize">{key.replace('_', ' ')} Dosha</h4>
              <p className={`font-semibold ${info.present ? 'text-red-700' : 'text-green-700'}`}>{info.summary}</p>
              {info.details && info.details.map((d, i) => <p key={i} className="text-sm mt-1 text-gray-700">{d}</p>)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSadeSatiAnalysis = () => {
    if (!data.dosha || !data.dosha.sadesati || !data.dosha.sadesati.all_cycles) return null;
    const cycles = data.dosha.sadesati.all_cycles;

    return (
      <div className="mb-8 print:mb-2 mt-4">
        <h3 className="font-bold text-xl text-indigo-900 mb-2 mt-2 border-b border-indigo-100 pb-2">Detailed Sade Sati Analysis</h3>
        <p className="text-gray-600 mb-6 print:mb-2 italic">Sade Sati is the 7.5-year transit of Saturn over your natal Moon. It represents periods of profound karmic restructuring, challenge, and ultimate growth.</p>
        <p className="text-gray-800 font-medium mb-6 print:mb-2"><strong>Current Status:</strong> {data.dosha.sadesati.summary || 'Sade Sati not active'}</p>

        <h4 className="font-bold text-lg text-indigo-800 mb-4 mt-8">Major Life Cycles & Phase Timeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-2">
          {cycles.map((cycle, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 print:bg-gray-100">
                <h4 className="font-bold text-lg text-indigo-900">Life Cycle {cycle.cycle}</h4>
                <p className="text-sm text-indigo-700 font-medium">{cycle.summary}</p>
              </div>
              <div className="p-4">
                {cycle.phases && cycle.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="mb-4 last:mb-0 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-gray-800">{phase.phase} Phase</p>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Age: ~{phase.age}</span>
                    </div>
                    <p className="text-sm text-gray-600">Years: {phase.start} — {phase.end}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    if (!data.predictions) return null;
    return (
      <div className="space-y-4 mb-6 print:mb-2">
        {Object.entries(data.predictions).map(([key, info]) => (
          <div key={key} className="bg-slate-50 p-4 rounded border border-slate-200">
            <h4 className="font-bold text-lg text-indigo-900 mb-2">{info.title || key.replace('_', ' ').toUpperCase()}</h4>
            <p className="text-gray-800 leading-relaxed">{info.text}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderObjectFields = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object') return <span className="text-gray-800">{String(obj)}</span>;
    if (Array.isArray(obj)) {
      return (
        <ul className="list-disc pl-5 mt-1">
          {obj.map((item, idx) => (
            <li key={idx} className="mb-1">{renderObjectFields(item, depth + 1)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className={`mt-2 space-y-2 ${depth > 0 ? 'pl-4 border-l-2 border-indigo-100' : ''}`}>
        {Object.entries(obj).map(([key, value]) => {
          if (key === 'score' || key.includes('svg') || key === 'present') return null; // Skip some raw technical fields
          const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <div key={key} className="mb-2">
              <strong className="text-gray-700 font-semibold inline-block mr-2">{displayKey}:</strong>
              {typeof value === 'object' ? (
                <div className="mt-1">{renderObjectFields(value, depth + 1)}</div>
              ) : (
                <span className="text-gray-800 leading-relaxed">{String(value)}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDetailedRemedialRituals = () => {
    const remedies = [
      { title: "Mantra Sadhana", desc: "Sound is the ultimate creator. Chanting specific seed mantras (Beeja Mantras) aligns your cellular frequency with planetary archetypes." },
      { title: "Graha Aradhana", desc: "Rituals dedicated to specific planets, performed on auspicious days (like Jupiter rituals on Thursdays) to harmonize their influence." },
      { title: "Gemstone Resonance", desc: "Natural minerals act as conduits for planetary light. Choosing the correct weight, metal, and finger for a ring is essential for effectiveness." },
      { title: "Daan (Sacred Charity)", desc: "Giving specific items (e.g., black sesame for Saturn) helps clear the subconscious impressions that manifest as life obstacles." },
      { title: "Vrat (Conscious Fasting)", desc: "Voluntary abstention from certain foods or distractions to build willpower and purify the mental body." },
      { title: "Tirthayatra (Spiritual Travel)", desc: "Visiting specific power spots (Jyotirlingas, etc.) that have a strong resonance with your chart's needs." },
      { title: "Deepam (Light Rituals)", desc: "Lighting lamps with specific oils (e.g., Ghee for Sun/Jupiter) to symbolize the removal of spiritual darkness." },
      { title: "Vastu Integration", desc: "Aligning your sleep and work directions to minimize the impact of challenging planetary transits." }
    ];

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <SectionTitle>Detailed Remedial Rituals & Cosmic Tuning</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-2 mt-6 print:mt-2">
          {remedies.map((r, idx) => (
            <div key={idx} className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <h4 className="text-lg font-bold text-orange-900 mb-3">{r.title}</h4>
              <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{r.desc}</p>
              <div className="mt-4 pt-4 border-t border-orange-200/50">
                <p className="text-sm text-orange-800/80 italic">
                  Every legacy is built on the foundation of small, consistent actions. By incorporating these {r.title} practices into your lifestyle, you gradually shift the trajectory of your soul's evolution toward its highest potential.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdvancedPredictiveLogic = () => {
    const logic_pieces = [
      { title: "The Principle of Desha-Kaala-Paatra", desc: "Astrological results are filtered through your environment (Desha), the current era (Kaala), and your personal capacity (Paatra)." },
      { title: "Sudarshana Chakra View", desc: "Analyzing the chart from three perspectives: Ascendant, Moon, and Sun for a holistic understanding of body, mind, and soul." },
      { title: "The Role of Transits (Gochara)", desc: "Transits act as the 'trigger' for events already promised by the natal dasha sequence." },
      { title: "The Power of Punya (Merit)", desc: "Positive actions in the present can significantly modify or mitigate difficult karmic promises in the chart." },
      { title: "Cosmic Timing vs Linear Time", desc: "Astrology operates on qualitative time. Some periods are 'ripe' for action, while others are destined for introspection." }
    ];

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <SectionTitle>Advanced Predictive Archetypes & Timing</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:gap-2 mt-6 print:mt-2">
          {logic_pieces.map((r, idx) => (
            <div key={idx} className="bg-sky-50 p-6 rounded-xl border border-sky-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <h4 className="text-lg font-bold text-sky-900 mb-3">{r.title}</h4>
              <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{r.desc}</p>
              <div className="mt-4 pt-4 border-t border-sky-200/50">
                <p className="text-sm text-sky-800/80 italic">
                  Understanding these advanced principles allows you to move from being a passive recipient of fate to becoming a conscious co-creator of your destiny. This report utilizes these time-tested sutras to provide a level of depth that goes beyond traditional analysis.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUniversalWisdom = () => {
    const wisdom_essays = [
      { title: "The Nature of Karma", desc: "Karma is not a system of punishment but a law of equilibrium. Every action performed with intention creates a subtle vibration in the cosmic field. These vibrations eventually return to the source, manifesting as life events that offer opportunities for soul growth." },
      { title: "The Significance of Dasha", desc: "The Vimshottari Dasha system is a unique contribution of Vedic astrology, mapping the progression of the soul through different planetary archetypes. Each period is a classroom where specific lessons are optimized for your evolution." },
      { title: "Planetary Energies as Archetypes", desc: "The planets are not just physical bodies but reflections of universal principles within the human psyche. The Sun reflects the soul, the Moon the mind, Mars the will, and Jupiter the wisdom. By harmonizing these energies, one achieves internal and external balance." },
      { title: "Dharma and Purpose", desc: "Identifying one's Dharma is the ultimate goal of astrological study. Your chart isn't a cage; it's a map. By following the path of least resistance marked by your auspicious planets, you align with the universal flow." },
      { title: "Rituals and Remedies", desc: "Vedic astrology provides tools to refine personal energy. Mantras, gemstones, and charitable acts are not superstitions; they are technologies of consciousness designed to tune the individual to the cosmic frequency." },
      { title: "The Lunar Perspective", desc: "The Moon represents the mind and emotions (Chandra). In Vedic thought, the mind is the lens through which we experience reality. A balanced Moon allows for clarity and resilience in the face of external changes." },
      { title: "Saturn's Grace", desc: "Often feared, Saturn is the great teacher. His influence brings discipline and realism. By embracing the lessons of structure and patience, one transforms Saturn's 'pressure' into solid wisdom." },
      { title: "Jupiter's Guidance", desc: "Jupiter is the Guru of the gods. His placement in your chart indicates where you receive divine grace and expanded understanding. Cultivating gratitude and seeking knowledge are the best ways to honor Jupiter." }
    ];

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <SectionTitle>Universal Wisdom: The Cycle of Time</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-2 mt-6 print:mt-2">
          {wisdom_essays.map((r, idx) => (
            <div key={idx} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <h4 className="text-lg font-bold text-emerald-900 mb-3">{r.title}</h4>
              <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{r.desc}</p>
              <div className="mt-4 pt-4 border-t border-emerald-200/50">
                <p className="text-sm text-emerald-800/80 italic">
                  This ancient wisdom helps us understand that our challenges are not random. They are carefully calibrated milestones on a journey toward total awareness. By aligning with these cosmic rhythms, we move from resistance to flow.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderD1Chart = () => {
    if (!data.chart || !data.chart.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
        <h4 className="font-bold text-[15px] text-amber-900 mb-4 uppercase tracking-widest text-center">Lagna Chart (D1)</h4>
        <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={data.chart.houses} planetPositions={data.planet_positions} title="Lagna Chart (D1)" hideOuterRect={true} />
        </div>
      </div>
    );
  };

  const RichPlanetEffect = ({ p, data }) => {
    const rich = data.rich_planet_effects?.[p.planet]?.[p.house];
    const fallbackText = PLANET_INTERP_MAP[p.planet]?.[p.house];

    if (!rich) {
      if (!fallbackText) return null;
      return (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <h4 className="font-bold text-[12px] text-slate-800 mb-2 uppercase">{p.planet} in House {p.house}</h4>
          <p className="text-gray-800 leading-relaxed font-serif whitespace-pre-line">{fallbackText}</p>
        </div>
      );
    }

    const { summary, key_effects, considerations, area, ordinal } = rich;

    return (
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mb-6 print:mb-2">
        <h4 className="font-bold text-lg text-slate-800 mb-1 uppercase text-amber-600">
          {p.planet} in the {ordinal || p.house} House {area ? `— ${area}` : ''}
        </h4>
        <p className="text-gray-800 leading-relaxed font-serif mb-6 print:mb-2">{summary}</p>

        {key_effects && Object.keys(key_effects).length > 0 && (
          <div className="mb-6 print:mb-2">
            <h5 className="font-bold text-sm text-amber-600 mb-2 uppercase tracking-wide">Key Effects:</h5>
            <div className="overflow-hidden rounded border border-amber-200 bg-amber-50">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {Object.entries(key_effects).map(([key, val], idx) => (
                    <tr key={idx} className="border-b border-amber-100 last:border-0 hover:bg-amber-100/50 transition-colors">
                      <td className="p-3 font-bold text-gray-800 w-1/3 align-top border-r border-amber-100">{key}</td>
                      <td className="p-3 text-gray-700 align-top">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {considerations && Object.keys(considerations).length > 0 && (
          <div>
            <h5 className="font-bold text-sm text-red-800 mb-2 uppercase tracking-wide">Important Considerations:</h5>
            <div className="overflow-hidden rounded border border-orange-200 bg-orange-50/50">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {Object.entries(considerations).map(([key, val], idx) => (
                    <tr key={idx} className="border-b border-orange-100 last:border-0 hover:bg-orange-100/50 transition-colors">
                      <td className="p-3 font-bold text-gray-800 w-1/3 align-top border-r border-orange-100">{key}</td>
                      <td className="p-3 text-gray-700 align-top">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderD1DetailedAnalysis = () => {
    if (!data.planet_positions) return null;
    return (
      <div className="space-y-6 mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        {data.planet_positions.map((p, idx) => {
          if (p.planet === "Ascendant" || p.planet === "Lagna") return null;
          return <RichPlanetEffect key={idx} p={p} data={data} />;
        })}
      </div>
    );
  };

  const VargaAnalysisPanel = ({ vargaKey, vargaNum }) => {
    const expl = data.ai_text?.varga_explanations?.[vargaKey] || data.ai_text?.varga_explanations?.[vargaKey.toLowerCase()] || data.varga_explanations?.[vargaKey];
    const chartData = data.vargas?.[vargaKey] || data.vargas?.[vargaKey.toLowerCase()];
    let planets = Array.isArray(chartData?.planet_positions) ? [...chartData.planet_positions] : [];

    if (planets.length === 0 && chartData && chartData.houses) {
      for (let i = 1; i <= 12; i++) {
        const h = chartData.houses[i];
        if (h && Array.isArray(h.planets)) {
          h.planets.forEach(p => {
            const pStr = typeof p === 'string' ? p : p?.name;
            if (pStr && pStr !== 'Ascendant' && pStr !== 'Lagna' && pStr !== 'As') {
              planets.push({ planet: pStr, house: i });
            }
          });
        }
      }
    }

    // For D9, if planet_positions not in vargas, try d9 root
    if (vargaNum === 9 && planets.length === 0 && data.d9) {
      planets = Array.isArray(data.d9.planet_positions) ? [...data.d9.planet_positions] : [];
    }

    const significance_map = {
      2: "This chart analyzes your wealth, family values, and speech.",
      3: "This chart focuses on your siblings, courage, and creative talents.",
      4: "This chart reveals your destiny regarding property, vehicles, and inner happiness.",
      5: "This chart relates to power, authority, and spiritual inclinations.",
      6: "This chart deals with health, diseases, and enemies.",
      7: "This chart is dedicated to children, legacy, and creative fruits.",
      8: "This chart focuses on longevity, sudden events, and transformations.",
      9: "The most important divisional chart, representing the fruit of your actions and marital life.",
      10: "This chart analyzes your career, professional status, and societal impact.",
      12: "This chart focuses on your parents and your relationship with your ancestry.",
      16: "This chart provides deep insights into your mental happiness and luxury.",
      20: "This chart is used for analyzing spiritual growth and religious inclinations.",
      24: "This chart focused on higher learning, scholarship, and wisdom.",
      27: "This chart represents your inherent strengths and soul's resilience.",
      30: "This chart reveals the sub-conscious flaws and the strength of character.",
      40: "This chart provides a fine-grained analysis of auspicious results in life.",
      45: "This chart focuses on the moral and ethical conduct belonging to your soul.",
      60: "The most subtle chart, showing the results of karma across multiple lifetimes."
    };

    if (!expl && planets.length === 0) return null;
    const isExpanded = !!expandedVargas[vargaKey];

    return (
      <div className="mb-8 print:mb-2 mt-2">
        <div className="flex justify-center mb-6 print:hidden">
          <button
            onClick={() => toggleVarga(vargaKey)}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-2 px-6 rounded-full transition-colors shadow-sm flex items-center gap-2"
          >
            {isExpanded ? 'Hide Analysis 🔼' : 'Show Analysis 🔽'}
          </button>
        </div>

        <div className={isExpanded ? "space-y-6" : "hidden print:block"}>
          {expl?.en && (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <h4 className="font-bold text-lg text-indigo-900 mb-2">Detailed Chart Analysis</h4>
              <p className="text-gray-800 leading-relaxed font-serif whitespace-pre-wrap mb-4">{expl.en}</p>
              {significance_map[vargaNum] && (
                <p className="text-sm font-semibold text-indigo-800 bg-white p-3 rounded border border-indigo-50">
                  <b>Esoteric Significance:</b> {significance_map[vargaNum]}
                </p>
              )}
            </div>
          )}

          {planets.length > 0 && (
            <div className="space-y-6">
              <h4 className="font-bold text-lg text-slate-800 mb-2 mt-4 border-b border-slate-200 pb-2">Planetary Effects in Houses (D{vargaNum})</h4>
              {planets.map((p, idx) => {
                if (p.planet === "Ascendant" || p.planet === "Lagna") return null;
                return <RichPlanetEffect key={idx} p={p} data={data} />;
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderD2Chart = () => {
    if (!data.vargas) return null;
    const d2Data = data.vargas.D2 || data.vargas.d2;
    if (!d2Data || !d2Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d2Data.houses} />
        </div>
      </div>
    );
  };

  const renderD3Chart = () => {
    if (!data.vargas) return null;
    const d3Data = data.vargas.D3 || data.vargas.d3;
    if (!d3Data || !d3Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d3Data.houses} />
        </div>
      </div>
    );
  };

  const renderD4Chart = () => {
    if (!data.vargas) return null;
    const d4Data = data.vargas.D4 || data.vargas.d4;
    if (!d4Data || !d4Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d4Data.houses} />
        </div>
      </div>
    );
  };

  const renderD5Chart = () => {
    if (!data.vargas) return null;
    const d5Data = data.vargas.D5 || data.vargas.d5;
    if (!d5Data || !d5Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d5Data.houses} />
        </div>
      </div>
    );
  };

  const renderD6Chart = () => {
    if (!data.vargas) return null;
    const d6Data = data.vargas.D6 || data.vargas.d6;
    if (!d6Data || !d6Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d6Data.houses} />
        </div>
      </div>
    );
  };

  const renderD7Chart = () => {
    if (!data.vargas) return null;
    const d7Data = data.vargas.D7 || data.vargas.d7;
    if (!d7Data || !d7Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d7Data.houses} />
        </div>
      </div>
    );
  };

  const renderD8Chart = () => {
    if (!data.vargas) return null;
    const d8Data = data.vargas.D8 || data.vargas.d8;
    if (!d8Data || !d8Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d8Data.houses} />
        </div>
      </div>
    );
  };

  const renderD9Chart = () => {
    if (!data.vargas) return null;
    const d9Data = data.vargas.D9 || data.vargas.d9;
    if (!d9Data || !d9Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d9Data.houses} />
        </div>
      </div>
    );
  };

  const renderD10Chart = () => {
    if (!data.vargas) return null;
    const d10Data = data.vargas.D10 || data.vargas.d10;
    if (!d10Data || !d10Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d10Data.houses} />
        </div>
      </div>
    );
  };

  const renderD12Chart = () => {
    if (!data.vargas) return null;
    const d12Data = data.vargas.D12 || data.vargas.d12;
    if (!d12Data || !d12Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d12Data.houses} />
        </div>
      </div>
    );
  };

  const renderD16Chart = () => {
    if (!data.vargas) return null;
    const d16Data = data.vargas.D16 || data.vargas.d16;
    if (!d16Data || !d16Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d16Data.houses} />
        </div>
      </div>
    );
  };

  const renderD20Chart = () => {
    if (!data.vargas) return null;
    const d20Data = data.vargas.D20 || data.vargas.d20;
    if (!d20Data || !d20Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d20Data.houses} />
        </div>
      </div>
    );
  };

  const renderD24Chart = () => {
    if (!data.vargas) return null;
    const d24Data = data.vargas.D24 || data.vargas.d24;
    if (!d24Data || !d24Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d24Data.houses} />
        </div>
      </div>
    );
  };

  const renderD27Chart = () => {
    if (!data.vargas) return null;
    const d27Data = data.vargas.D27 || data.vargas.d27;
    if (!d27Data || !d27Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d27Data.houses} />
        </div>
      </div>
    );
  };

  const renderD30Chart = () => {
    if (!data.vargas) return null;
    const d30Data = data.vargas.D30 || data.vargas.d30;
    if (!d30Data || !d30Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d30Data.houses} />
        </div>
      </div>
    );
  };

  const renderD40Chart = () => {
    if (!data.vargas) return null;
    const d40Data = data.vargas.D40 || data.vargas.d40;
    if (!d40Data || !d40Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d40Data.houses} />
        </div>
      </div>
    );
  };

  const renderD45Chart = () => {
    if (!data.vargas) return null;
    const d45Data = data.vargas.D45 || data.vargas.d45;
    if (!d45Data || !d45Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d45Data.houses} />
        </div>
      </div>
    );
  };

  const renderD60Chart = () => {
    if (!data.vargas) return null;
    const d60Data = data.vargas.D60 || data.vargas.d60;
    if (!d60Data || !d60Data.houses) return null;
    return (
      <div className="mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid mt-8 print:break-inside-avoid">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-amber-100 print:border-none print:shadow-none print:break-inside-avoid" style={{ height: '350px' }}>
          <ZodiacRectSign houses={d60Data.houses} />
        </div>
      </div>
    );
  };

  const renderYogas = () => {
    if (!data.yogas || !data.yogas.yogas) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:mb-2">
        {data.yogas.yogas.map((yoga, idx) => (
          <div key={idx} className="p-4 rounded border bg-amber-50 border-amber-200">
            <h4 className="font-bold text-lg text-amber-900">{yoga.name}</h4>
            <p className="text-sm mt-1 text-gray-800">{yoga.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderFavourable = () => {
    if (!data.favourable || !data.favourable.numerology) return null;
    const num = data.favourable.numerology;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:mb-2 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <div><p className="text-sm text-gray-500 uppercase font-bold">Destiny Number</p><p className="font-medium text-lg">{num.destiny_number}</p></div>
        <div><p className="text-sm text-gray-500 uppercase font-bold">Radical Number</p><p className="font-medium text-lg">{num.radical_number}</p></div>
        <div><p className="text-sm text-gray-500 uppercase font-bold">Lucky Colors</p><p className="font-medium text-lg">{num.lucky_color?.join(', ')}</p></div>
        <div><p className="text-sm text-gray-500 uppercase font-bold">Lucky Stone</p><p className="font-medium text-lg">{num.lucky_stone}</p></div>
      </div>
    );
  };

  const renderStrengths = () => {
    if (!data.strength_analysis || !data.strength_analysis.planets) return null;
    return (
      <div className="overflow-x-auto mb-6 print:mb-2">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Planet</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Total Strength (Rupas)</th>
              <th className="py-2 px-4 border-b text-left text-sm font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.strength_analysis.planets).map(([p, info], idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm font-medium">{p}</td>
                <td className="py-2 px-4 border-b text-sm">{info.total ? info.total.toFixed(2) : '-'}</td>
                <td className="py-2 px-4 border-b text-sm">{info.total > 6 ? 'Strong' : 'Average'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDasha = () => {
    if (!data.dasha || !data.dasha.current) return null;
    const current = data.dasha.current;
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 print:mb-2">
        <h4 className="font-bold text-xl text-indigo-900 mb-2">Current Mahadasha: {current.lord}</h4>
        <p className="text-gray-700 mb-4">From {current.start_date} to {current.end_date}</p>
        {current.antardashas && (
          <div className="mt-4">
            <h5 className="font-bold text-md mb-2">Antardashas (Sub-periods):</h5>
            <ul className="list-disc pl-5">
              {current.antardashas.map((ad, idx) => (
                <li key={idx} className="text-sm text-gray-800">
                  <strong>{ad.lord}:</strong> {ad.start_date} - {ad.end_date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderAshtakavarga = () => {
    if (!data.chart || !data.chart.houses) return null;

    // Check if we have sav_score in houses
    let hasSav = false;
    for (let i = 1; i <= 12; i++) {
      if (data.chart.houses[i] && data.chart.houses[i].sav_score !== undefined) {
        hasSav = true;
        break;
      }
    }

    // If not found in chart.houses, fallback to av_data
    let sarvaScores = [];
    const av_data = data.ashtakavarga || (data.strength && data.strength.ashtakavarga);

    if (hasSav) {
      for (let i = 1; i <= 12; i++) {
        sarvaScores.push(data.chart.houses[i].sav_score || 0);
      }
    } else if (av_data && av_data.sarvashtakavarga && av_data.sarvashtakavarga.length >= 12) {
      sarvaScores = av_data.sarvashtakavarga;
    } else {
      return null;
    }

    // Map to housesData for the chart
    const housesData = sarvaScores.map((points, idx) => {
      const houseNum = idx + 1;
      let signIndex = undefined;
      if (data.chart && data.chart.houses && data.chart.houses[houseNum]) {
        signIndex = data.chart.houses[houseNum].sign_id ? data.chart.houses[houseNum].sign_id - 1 : undefined;
      }
      return { house: houseNum, signIndex, points: points };
    });

    return (
      <div className="mb-8 print:mb-2 mt-8">
        <p className="text-gray-600 mb-6 print:mb-2 italic">Each number in the Ashtakavarga wheel is the total bindu (point) score for that house/sign. Higher bindus indicate stronger planetary support in that life domain. Reference Scale: 0–20 = Very Weak, 21–25 = Weak, 26–28 = Average, 29–33 = Strong, 34+ = Very Strong.</p>

        <div className="w-full max-w-2xl mx-auto mb-8 print:mb-2 bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid" style={{ height: '400px' }}>
          <AshtakavargaChart title="Sarvashtakavarga (Overall Strength)" housesData={housesData} defaultRect={true} />
        </div>

        <h3 className="font-bold text-xl text-indigo-900 mb-4 mt-8 border-b border-indigo-100 pb-2">House-by-House Score Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sarvaScores.map((score, idx) => {
            const hNum = idx + 1;
            const info = SAV_INTERPRETATIONS[hNum];
            const band = getSAVBand(score);
            return (
              <div key={idx} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300">
                <h4 className="font-bold text-lg text-indigo-900">House {hNum} — {info.area}</h4>
                <p className="text-sm text-gray-600 mb-2">Significator: {info.sig}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-800">Score:</span>
                  <span className={`font-bold ${band.color}`}>{score} Bindus ({band.label})</span>
                </div>
                <p className="text-gray-800 leading-relaxed text-sm">{band.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDestinyTimeline = () => {
    const timeline = data.destiny_timeline || data.timeline;
    if (!timeline || !Array.isArray(timeline) || timeline.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">A probabilistic forecast mapping the strength of the cosmic forces acting on your life over the coming years.</p>
        <div className="overflow-x-auto shadow-sm rounded-lg border border-slate-200 print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-900 print:bg-gray-100">
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-24">Year</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-24">Score</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-32">Phase</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm">Summary</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((row, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50 transition-colors`}>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300 font-bold text-gray-800">{row.year}</td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.score >= 70 ? 'bg-green-100 text-green-800' : row.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {row.score}/100
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300 text-sm font-medium text-gray-700">{row.phase}</td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300 text-sm text-gray-700 leading-relaxed">{row.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDestinyGraph = () => {
    const timeline = data.destiny_timeline || data.timeline;
    if (!timeline || !Array.isArray(timeline) || timeline.length === 0) return null;

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const item = timeline.find(t => t.year === label || t.year === Number(label));
        return (
          <div className="bg-white p-3 border border-indigo-200 shadow-lg rounded-lg text-sm max-w-xs z-50">
            <p className="font-bold text-indigo-900 mb-1">{label} {item?.phase ? `— ${item.phase}` : ''}</p>
            <p className="text-gray-800">Score: <span className="font-bold text-indigo-700">{payload[0].value}</span> / 100</p>
            {item?.summary && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.summary}</p>}
          </div>
        );
      }
      return null;
    };

    return (
      <div className="mb-8 print:mb-2 mt-4">
        <h3 className="font-bold text-xl text-indigo-900 mb-4 mt-8 border-b border-indigo-100 pb-2">Destiny Graph (Score Over Time)</h3>
        <p className="text-gray-600 mb-6 print:mb-2 italic">A visual representation of cosmic strength mapping the trajectory of your probabilistic forecast.</p>
        <div className="w-full h-80 bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:break-inside-avoid print:border-gray-300">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} dy={10} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCosmicLifeMap = () => {
    if (!data.life_map) return null;

    const sections = [
      { key: 'marriage', title: 'Marriage & Relationship Windows', icon: '❤️' },
      { key: 'career', title: 'Career & Professional Cycles', icon: '💼' },
      { key: 'wealth', title: 'Wealth & Financial Growth', icon: '💰' },
      { key: 'health', title: 'Health & Vitality Periods', icon: '⚕️' },
      { key: 'spiritual', title: 'Spiritual & Karmic Phases', icon: '🕉️' },
    ];

    // Check if there's actually any data to display across all sections
    const hasAnyData = sections.some(s => data.life_map[s.key] && Array.isArray(data.life_map[s.key]) && data.life_map[s.key].length > 0);
    if (!hasAnyData) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">The 5D Cosmic Life Map calculates highly probable windows for key life events across multiple dimensions based on your planetary periods and strengths.</p>

        <div className="grid grid-cols-1 gap-6 print:gap-2">
          {sections.map(({ key, title, icon }) => {
            const items = data.life_map[key];
            if (!items || !Array.isArray(items) || items.length === 0) return null;

            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:break-inside-avoid print:border-gray-300">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2 print:bg-gray-100">
                  <span className="text-xl">{icon}</span>
                  <h4 className="font-bold text-lg text-indigo-900">{title}</h4>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-200">
                          <th className="pb-2 pr-4 font-semibold w-1/3">Time Window</th>
                          <th className="pb-2 pr-4 font-semibold w-1/4">Confidence</th>
                          <th className="pb-2 font-semibold">Cosmic Indication</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">
                              {item.start} — {item.end}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${item.confidence === 'High' ? 'bg-green-100 text-green-800' :
                                  item.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                                {item.confidence || 'Medium'}
                              </span>
                            </td>
                            <td className="py-3 text-gray-700 leading-relaxed">{item.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDestinyMatrixVisualizer = () => {
    if (!data.destiny_matrix || !data.destiny_matrix.matrix || data.destiny_matrix.matrix.length === 0) return null;
    const matrix = data.destiny_matrix.matrix;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">The Destiny Matrix breaks down specific event probabilities and risk levels for each year, highlighting major life transitions and potential challenges.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matrix.map((item, idx) => {
            // Determine risk level properly (in case it returns numeric or string)
            let riskLevel = item.risk;
            if (typeof riskLevel === 'number') {
              riskLevel = riskLevel > 70 ? 'High' : riskLevel > 40 ? 'Medium' : 'Low';
            }
            const isHighRisk = riskLevel === 'High' || riskLevel > 70;
            const isMedRisk = riskLevel === 'Medium' || riskLevel > 40;

            return (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow print:border-gray-300 print:shadow-none print:break-inside-avoid">
                <div className="flex justify-between items-center border-b border-indigo-50 pb-2 mb-3">
                  <h4 className="font-bold text-2xl text-indigo-900">{item.year}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${isHighRisk ? 'bg-red-100 text-red-800' :
                    isMedRisk ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                    Risk: {item.risk}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Event Probability</p>
                    <p className="text-xs font-bold text-indigo-700">{item.probability}%</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.probability > 70 ? 'bg-indigo-600' : item.probability > 40 ? 'bg-indigo-400' : 'bg-indigo-300'}`} style={{ width: `${item.probability}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Key Events</p>
                  {item.events && item.events.length > 0 ? (
                    <ul className="space-y-1">
                      {item.events.map((ev, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Stable period, no major events.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWealthPrediction = () => {
    const wealthData = data.wealth_prediction;
    if (!wealthData) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden print:border-gray-300 print:shadow-none print:break-inside-avoid">
          {/* Header */}
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-4 print:bg-gray-100 print:border-gray-300">
            <div>
              <h3 className="font-bold text-xl text-emerald-900 m-0">Overall Wealth Score</h3>
              <p className="text-sm text-emerald-700">Favorable Income Stream: <span className="font-bold">{wealthData.income_type || 'Mixed'}</span></p>
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {wealthData.score || 0}<span className="text-xl text-emerald-400">/100</span>
            </div>
          </div>

          <div className="p-6">
            {/* Analysis */}
            {wealthData.analysis && (
              <div className="mb-6 print:mb-2">
                <h4 className="font-bold text-lg text-emerald-800 mb-2">Cosmic Financial Assessment</h4>
                <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  {wealthData.analysis.split('\n\n').map((para, idx) => {
                    if (!para.trim()) return null;
                    return <p key={idx}>{para.trim()}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Yogas */}
            {wealthData.yogas && wealthData.yogas.length > 0 && (
              <div className="mb-6 print:mb-2">
                <h4 className="font-bold text-lg text-emerald-800 mb-3">Active Wealth Yogas (Dhan Yogas)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wealthData.yogas.map((yoga, idx) => (
                    <div key={idx} className="bg-emerald-50/50 p-3 rounded border border-emerald-100 print:border-gray-200">
                      <p className="font-bold text-emerald-900 text-sm">{yoga.name || 'Yoga'}</p>
                      <p className="text-xs text-gray-600 mt-1">{yoga.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {wealthData.timeline && wealthData.timeline.length > 0 && (
              <div>
                <h4 className="font-bold text-lg text-emerald-800 mb-3">10-Year Financial Timeline</h4>
                <div className="overflow-x-auto rounded border border-slate-200 print:border-gray-300">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 print:bg-gray-100">
                        <th className="p-3 border-b border-slate-200 font-semibold w-1/4">Year</th>
                        <th className="p-3 border-b border-slate-200 font-semibold w-1/2">Financial Phase</th>
                        <th className="p-3 border-b border-slate-200 font-semibold w-1/4">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wealthData.timeline.slice(0, 10).map((t, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-medium text-gray-800">{t.year}</td>
                          <td className="p-3 text-gray-700">{t.label || '-'}</td>
                          <td className="p-3 font-bold text-emerald-600">{t.score || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLifeEvents = () => {
    const events = data.life_events;
    if (!events || !Array.isArray(events) || events.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">A targeted timeline of major anticipated life events with their cosmic intensity and specific category.</p>
        <div className="overflow-x-auto shadow-sm rounded-lg border border-slate-200 print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-900 print:bg-gray-100">
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-24">Year</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-40">Category</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm">Event</th>
                <th className="p-4 border-b border-indigo-200 print:border-gray-300 font-bold uppercase text-sm w-32">Intensity</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt, idx) => (
                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50 transition-colors`}>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300 font-bold text-gray-800">{evt.year}</td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300">
                    <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                      {evt.category || 'General'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300 text-sm font-medium text-gray-700">{evt.event}</td>
                  <td className="p-4 border-b border-slate-100 print:border-gray-300">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${(evt.intensity || 0) >= 80 ? 'bg-red-100 text-red-800' :
                        (evt.intensity || 0) >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {evt.intensity || 0}/100
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRemedies = () => {
    if (!data.remedies || !Array.isArray(data.remedies) || data.remedies.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">Vedic astrology provides tools to refine personal energy. Mantras, gemstones, and charitable acts are technologies of consciousness designed to tune the individual to the cosmic frequency.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.remedies.map((remedy, idx) => (
            <div key={idx} className="bg-amber-50 p-5 rounded-lg border border-amber-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-amber-900">{remedy.type || 'General Remedy'}</h4>
                {remedy.conviction && (
                  <span className={`px-2 py-1 text-xs font-bold rounded ${remedy.conviction === 'High' ? 'bg-red-100 text-red-800' :
                    remedy.conviction === 'Medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {remedy.conviction} Priority
                  </span>
                )}
              </div>
              <p className="text-gray-800 leading-relaxed text-sm">{remedy.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSentient = () => {
    const sentient = data.sentient || (data.master_engine && data.master_engine.sentient);
    if (!sentient || !sentient.sentient_story) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{sentient.sentient_story}</p>
        </div>
      </div>
    );
  };

  const renderAkashic = () => {
    const akashic = data.akashic || (data.master_engine && data.master_engine.akashic);
    if (!akashic || !akashic.akashic_story) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{akashic.akashic_story}</p>
        </div>
      </div>
    );
  };

  const renderOmniscient = () => {
    const omniscient = data.omniscient || (data.master_engine && data.master_engine.omniscient);
    if (!omniscient) return null;

    const archetype = omniscient.personality?.archetype || omniscient.archetype;
    const confidence = omniscient.confidence_score || omniscient.confidence;
    const emotion = omniscient.emotion_model || omniscient.emotion;

    if (!archetype && !confidence && !emotion) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-md print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full opacity-10 -mr-10 -mt-10 blur-xl print:hidden"></div>

          <p className="text-slate-400 text-sm mb-4 italic print:text-gray-600 relative z-10">
            The Omniscient Analysis Engine processes thousands of planetary algorithms to derive your core cosmic emotional model and personality archetype.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
            {archetype && (
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 print:bg-gray-50 print:border-gray-200">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-gray-500">Core Archetype</p>
                <p className="text-xl font-bold text-indigo-300 print:text-indigo-800">{archetype}</p>
              </div>
            )}

            {confidence && (
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 print:bg-gray-50 print:border-gray-200">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 print:text-gray-500">AI Confidence Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-xl font-bold text-emerald-400 print:text-emerald-700">{confidence}</p>
                </div>
              </div>
            )}
          </div>

          {emotion && (
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative z-10 print:bg-gray-50 print:border-gray-200">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 print:text-gray-500">Cosmic Emotional Model</p>
              <p className="text-slate-200 leading-relaxed print:text-gray-800">{emotion}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuantum = () => {
    const quantum = data.quantum || (data.master_engine && data.master_engine.quantum);
    if (!quantum || !quantum.narrative) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{quantum.narrative}</p>
        </div>
      </div>
    );
  };

  const renderDimensional = () => {
    const dim = data.dimensional || (data.master_engine && data.master_engine.dimensional);
    if (!dim || !dim.narrative) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border border-teal-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{dim.narrative}</p>
        </div>
      </div>
    );
  };

  const renderAstral = () => {
    const astral = data.astral_matrix || (data.master_engine && data.master_engine.astral_matrix);
    if (!astral || !astral.astral_narrative) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 p-6 rounded-xl border border-fuchsia-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{astral.astral_narrative}</p>
        </div>
      </div>
    );
  };

  const renderCosmicCore = () => {
    const cosmic = data.cosmic_core || (data.master_engine && data.master_engine.cosmic_core);
    if (!cosmic || !cosmic.cosmic_narrative) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{cosmic.cosmic_narrative}</p>
        </div>
      </div>
    );
  };

  const renderMaharishi = () => {
    const maharishi = data.maharishi || (data.master_engine && data.master_engine.maharishi);
    if (!maharishi || !maharishi.maharishi_text) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border border-red-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{maharishi.maharishi_text}</p>
        </div>
      </div>
    );
  };

  const renderBrahma = () => {
    const brahma = data.brahma || (data.master_engine && data.master_engine.brahma);
    if (!brahma || !brahma.brahma_text) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{brahma.brahma_text}</p>
        </div>
      </div>
    );
  };

  const renderParamarshi = () => {
    const paramarshi = data.paramarshi || (data.master_engine && data.master_engine.paramarshi);
    if (!paramarshi || !paramarshi.answer) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-[1.05rem]">{paramarshi.answer}</p>
        </div>
      </div>
    );
  };

  const renderPlanetaryWisdom = () => {
    if (!data.planetary_wisdom || !Array.isArray(data.planetary_wisdom) || data.planetary_wisdom.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">This section provides an advanced, multi-dimensional analysis of your planetary positions. Each planet is examined not just as a celestial body, but as a specific karmic force acting through the houses and signs of your unique cosmic blueprint.</p>

        <div className="space-y-6">
          {data.planetary_wisdom.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
              <h4 className="font-bold text-xl text-indigo-900 mb-4 pb-2 border-b border-indigo-100">{item.title}</h4>
              <div className="space-y-3">
                {item.paragraphs && item.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOracle = () => {
    if (!data.oracle_insights || !Array.isArray(data.oracle_insights) || data.oracle_insights.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">The path to mastery is paved with the wisdom of the ancients. These Oracle questions delve deeply into specific areas of your destiny.</p>

        <div className="space-y-6">
          {data.oracle_insights.map((item, idx) => (
            <div key={idx} className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid shadow-sm">
              <h4 className="font-bold text-lg text-indigo-900 mb-3 leading-relaxed">Q: {item.question}</h4>
              <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderKarmaTimeline = () => {
    if (!data.karma_timeline || !Array.isArray(data.karma_timeline) || data.karma_timeline.length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">Your karmic journey over the next two decades is influenced by major transit cycles and dasha periods. The following analysis breaks down your spiritual and material trajectory year-by-year.</p>

        <div className="space-y-6">
          {data.karma_timeline.map((yearData, idx) => {
            const year = yearData.year;
            const lord = yearData.lord;
            const score = yearData.score || 0.5;
            const phase = yearData.phase || 'Stable';
            const desc = yearData.description || `During ${year}, your life is primarily governed by the energy of ${lord}. Focus on strengthening your ${lord} energy.`;
            const guidance = yearData.guidance || "Cosmic Guidance for this year: Align your intentions with the lunar cycles to maximize your inherent potential.";

            const scoreColor = score > 0.7 ? 'text-green-600' : score > 0.4 ? 'text-yellow-600' : 'text-red-600';
            const scoreBg = score > 0.7 ? 'bg-green-100' : score > 0.4 ? 'bg-yellow-100' : 'bg-red-100';
            const scoreText = score > 0.7 ? 'significant growth' : score < 0.4 ? 'careful navigation' : 'steady progress';

            return (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-indigo-100 pb-3">
                  <h4 className="font-bold text-xl text-indigo-900">Year {year}: {phase} Cycle</h4>
                  <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-bold ${scoreColor} ${scoreBg}`}>
                    Karma Score: {(score * 100).toFixed(1)}/100
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">
                    {desc} This indicates a phase of {scoreText}.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-slate-100 mt-2">
                    <p className="text-gray-800 text-[1.05rem]"><strong>Guidance:</strong> {guidance}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLifeEventsNarrative = () => {
    const events = data.life_events;
    if (!events || !Array.isArray(events) || events.length === 0) return null;

    const isNewFormat = events[0] && Array.isArray(events[0].events);

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">A narrative foresight into the upcoming phases of your life, highlighting the major transitions governed by planetary dashas.</p>

        <div className="space-y-6">
          {isNewFormat ? (
            [...events].sort((a, b) => (a.year || 0) - (b.year || 0)).map((item, idx) => {
              const year = item.year;
              const evts = item.events || [];
              if (evts.length === 0) return null;

              return (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:border-gray-300 print:shadow-none print:break-inside-avoid">
                  <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 print:bg-gray-100">
                    <h4 className="font-bold text-lg text-indigo-900">Transitions in {year}</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    {evts.map((evt, pIdx) => {
                      let category = "General";
                      if (typeof evt === 'string') {
                        if (evt.includes("Marriage")) category = "Relationship";
                        else if (evt.includes("Career")) category = "Career";
                        else if (evt.includes("Wealth")) category = "Finance";
                        else if (evt.includes("Health")) category = "Health";
                      }

                      return (
                        <div key={pIdx} className="border-l-4 border-indigo-200 pl-4 py-1">
                          <p className="text-gray-800 leading-relaxed font-medium italic mb-1">{evt} ({category})</p>
                          <p className="text-sm text-gray-500">Influenced by {item.dasha_lord || 'planets'}.</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            Object.entries(events.reduce((acc, evt) => {
              const y = evt.year || 'Unknown';
              if (!acc[y]) acc[y] = [];
              acc[y].push(evt);
              return acc;
            }, {})).map(([year, evts], idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:border-gray-300 print:shadow-none print:break-inside-avoid">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 print:bg-gray-100">
                  <h4 className="font-bold text-lg text-indigo-900">Transitions in {year}</h4>
                </div>
                <div className="p-4 space-y-4">
                  {evts.map((evt, pIdx) => (
                    <div key={pIdx} className="border-l-4 border-indigo-200 pl-4 py-1">
                      <p className="text-gray-800 leading-relaxed font-medium italic mb-1">{evt.event} ({evt.category || 'General'})</p>
                      <p className="text-sm text-gray-500">Intensity: {evt.intensity || 0}/100.</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProbabilityMatrix = () => {
    if (!data.probability_matrix || Object.keys(data.probability_matrix).length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">This matrix quantifies the cosmic probability across various life dimensions, scoring each area out of 100.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(data.probability_matrix).map(([key, score], idx) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const numericScore = parseFloat(score);
            const scoreColor = numericScore >= 70 ? 'text-emerald-600' : numericScore >= 40 ? 'text-amber-500' : 'text-red-500';

            return (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:border-gray-300 print:shadow-none print:break-inside-avoid flex flex-col items-center text-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{formattedKey}</span>
                <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNeuralSummary = () => {
    if (!data.neural || !data.neural.summary) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-xl border border-indigo-700 shadow-lg print:bg-white print:text-black print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <p className="leading-relaxed font-serif text-[1.05rem] text-indigo-100 print:text-gray-800">{data.neural.summary}</p>
        </div>
      </div>
    );
  };

  const renderDestinySignature = () => {
    if (!data.destiny) return null;

    const { type, power, events } = data.destiny;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 print:mb-2 border-b border-amber-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-1">Destiny Type</p>
              <h4 className="font-bold text-2xl text-amber-900">{type || '-'}</h4>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-1">Destiny Power</p>
              <span className="inline-block bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-lg font-bold border border-amber-200">
                {power || '-'}/100
              </span>
            </div>
          </div>

          {events && events.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-amber-700 font-bold mb-2">Key Events</p>
              {events.map((e, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLifeVectorPredictions = () => {
    const pred = data.life_vector_predictions;
    if (!pred || Object.keys(pred).length === 0) return null;

    return (
      <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
        <p className="text-gray-600 mb-6 print:mb-2 italic">A targeted AI analysis of specific trajectories in your life, providing predictive vectors based on your karmic imprint.</p>

        <div className="space-y-6">
          {Object.entries(pred).map(([key, text], idx) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid shadow-sm">
                <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b border-indigo-100 pb-2">{formattedKey}</h4>
                <p className="text-gray-800 leading-relaxed font-serif text-[1.05rem]">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClassicCoverPage = () => {
    const meta = data.meta || {};
    const panchang = data.panchang || {};
    const favourable = data.favourable || {};

    const NAKSHATRA_DATA = {
      "Ashwini": { "varna": "Vaishya", "vashya": "Chatushpada", "gana": "Deva", "yoni": "Ashwa", "nadi": "Aadi" },
      "Bharani": { "varna": "Mleccha", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Gaja", "nadi": "Madhya" },
      "Krittika": { "varna": "Brahmin", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Mesha", "nadi": "Antya" },
      "Rohini": { "varna": "Shudra", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Sarpa", "nadi": "Antya" },
      "Mrigashira": { "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Sarpa", "nadi": "Madhya" },
      "Ardra": { "varna": "Shudra", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Shwan", "nadi": "Aadi" },
      "Punarvasu": { "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Marjar", "nadi": "Aadi" },
      "Pushya": { "varna": "Kshatriya", "vashya": "Chatushpada", "gana": "Deva", "yoni": "Mesha", "nadi": "Madhya" },
      "Ashlesha": { "varna": "Mleccha", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Marjar", "nadi": "Antya" },
      "Magha": { "varna": "Shudra", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Mushaka", "nadi": "Antya" },
      "Purva Phalguni": { "varna": "Brahmin", "vashya": "Chatushpada", "gana": "Manushya", "yoni": "Mushaka", "nadi": "Madhya" },
      "Uttara Phalguni": { "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Gau", "nadi": "Aadi" },
      "Hasta": { "varna": "Vaishya", "vashya": "Dwipada", "gana": "Deva", "yoni": "Mahisha", "nadi": "Aadi" },
      "Chitra": { "varna": "Shudra", "vashya": "Dwipada", "gana": "Rakshasa", "yoni": "Vyaghra", "nadi": "Madhya" },
      "Swati": { "varna": "Mleccha", "vashya": "Dwipada", "gana": "Deva", "yoni": "Mahisha", "nadi": "Antya" },
      "Vishakha": { "varna": "Brahmin", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Vyaghra", "nadi": "Antya" },
      "Anuradha": { "varna": "Shudra", "vashya": "Keeta", "gana": "Deva", "yoni": "Mriga", "nadi": "Madhya" },
      "Jyeshtha": { "varna": "Vaishya", "vashya": "Keeta", "gana": "Rakshasa", "yoni": "Mriga", "nadi": "Aadi" },
      "Mula": { "varna": "Kshatriya", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Shwan", "nadi": "Aadi" },
      "Purva Ashadha": { "varna": "Vaishya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Vanar", "nadi": "Madhya" },
      "Uttara Ashadha": { "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Nakula", "nadi": "Antya" },
      "Shravana": { "varna": "Mleccha", "vashya": "Dwipada", "gana": "Deva", "yoni": "Vanar", "nadi": "Antya" },
      "Dhanishta": { "varna": "Shudra", "vashya": "Chatushpada", "gana": "Rakshasa", "yoni": "Simha", "nadi": "Madhya" },
      "Shatabhisha": { "varna": "Mleccha", "vashya": "Dwipada", "gana": "Rakshasa", "yoni": "Ashwa", "nadi": "Aadi" },
      "Purva Bhadrapada": { "varna": "Brahmin", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Simha", "nadi": "Aadi" },
      "Uttara Bhadrapada": { "varna": "Kshatriya", "vashya": "Dwipada", "gana": "Manushya", "yoni": "Gau", "nadi": "Madhya" },
      "Revati": { "varna": "Shudra", "vashya": "Dwipada", "gana": "Deva", "yoni": "Gaja", "nadi": "Antya" }
    };

    const getHinduMonthFromNakshatra = (nakshatraName) => {
      if (!nakshatraName) return "-";
      const name = nakshatraName.toLowerCase();
      if (name.includes("chitra") || name.includes("swati")) return "Chaitra";
      if (name.includes("vishakha") || name.includes("anuradha")) return "Vaishakha";
      if (name.includes("jyeshtha") || name.includes("mula")) return "Jyeshtha";
      if (name.includes("ashadha")) return "Ashadha";
      if (name.includes("shravana") || name.includes("dhanishta")) return "Shravana";
      if (name.includes("shatabhisha") || name.includes("bhadrapada")) return "Bhadrapada";
      if (name.includes("revati") || name.includes("ashwini") || name.includes("bharani")) return "Ashvina";
      if (name.includes("krittika") || name.includes("rohini")) return "Kartika";
      if (name.includes("mrigashira") || name.includes("ardra")) return "Margashirsha";
      if (name.includes("punarvasu") || name.includes("pushya")) return "Pausha";
      if (name.includes("ashlesha") || name.includes("magha")) return "Magha";
      if (name.includes("phalguni") || name.includes("hasta")) return "Phalguna";
      return "-";
    };

    // Safely parse date and time
    let displayDate = meta.date || '-';
    let displayTime = meta.time || '-';
    let displayDay = panchang.day_of_week || '-';

    if (meta.birth_datetime) {
      const parts = meta.birth_datetime.split(' ').filter(p => p.trim() && p !== '|');
      if (parts.length > 0) displayDate = parts[0];
      if (parts.length > 1) displayTime = parts[1];

      // Calculate day of week if missing
      if (!panchang.day_of_week || panchang.day_of_week === '-') {
        try {
          let dPart = parts[0];
          let dateObj;
          if (dPart.includes('/')) {
            const [d, m, y] = dPart.split('/');
            if (y && y.length === 4) dateObj = new Date(`${y}-${m}-${d}T12:00:00Z`);
          } else {
            dateObj = new Date(dPart);
          }
          if (dateObj && !isNaN(dateObj)) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            displayDay = days[dateObj.getUTCDay()];
          }
        } catch (e) { }
      }
    }

    const formatCoord = (val, isLat) => {
      if (val === undefined || val === null || val === '-') return '-';
      const num = parseFloat(val);
      if (isNaN(num)) return '-';
      const dir = isLat ? (num >= 0 ? 'N' : 'S') : (num >= 0 ? 'E' : 'W');
      return `${Math.abs(num).toFixed(4)} ${dir}`;
    };

    const displayLat = formatCoord(meta.lat, true);
    const displayLon = formatCoord(meta.lon, false);
    const displayTz = (meta.tz_offset !== undefined && meta.tz_offset !== null && meta.tz_offset !== '-')
      ? `UTC ${meta.tz_offset >= 0 ? '+' : ''}${meta.tz_offset} hrs`
      : '-';

    // Calculate Hindu Calendar
    let displayVikram = panchang.vikram_samvat || '-';
    let displaySaka = '-';
    let displayLunarMonth = panchang.lunar_month || panchang.maasa || '-';

    if (meta.birth_datetime || meta.date) {
      let dPart = meta.birth_datetime ? meta.birth_datetime.split(' ')[0] : meta.date;
      let y = 0, m = 0;
      if (dPart.includes('/')) {
        const [dd, mm, yy] = dPart.split('/');
        y = parseInt(yy);
        m = parseInt(mm);
      } else if (dPart.includes('-')) {
        const [yy, mm, dd] = dPart.split('-');
        y = parseInt(yy);
        m = parseInt(mm);
      }
      if (y > 0 && m > 0) {
        const isNewYearStarted = m >= 4; // Approx Chaitradi starts in March/April
        if (displayVikram === '-') displayVikram = isNewYearStarted ? y + 57 : y + 56;
        displaySaka = isNewYearStarted ? y - 78 : y - 79;
      }
    }

    if (meta.nakshatra && displayLunarMonth === '-') {
      displayLunarMonth = getHinduMonthFromNakshatra(meta.nakshatra);
    }

    // Calculate Avakhada Chakra
    const nData = meta.nakshatra ? (NAKSHATRA_DATA[meta.nakshatra] || {}) : {};
    const displayVarna = favourable.varna || panchang.varna || nData.varna || '-';
    const displayVashya = favourable.vashya || panchang.vashya || nData.vashya || '-';
    const displayYoni = favourable.yoni || panchang.yoni || nData.yoni || '-';
    const displayGana = favourable.gana || panchang.gana || nData.gana || '-';
    const displayNadi = favourable.nadi || panchang.nadi || nData.nadi || '-';

    // Helper for rows
    const Row = ({ label, value }) => (
      <div className="flex text-sm mb-[2px] leading-tight items-start">
        <span className="w-44 font-medium text-gray-800 flex-shrink-0">{label}</span>
        <span className="w-4 text-center text-gray-600">:</span>
        <span className="flex-1 font-bold text-gray-900">{value || '-'}</span>
      </div>
    );

    return (
      <div className="mb-12 print:mb-0 mt-8 print:mt-0 page-break-after" style={{ pageBreakAfter: 'always' }}>
        <div className="bg-white border-[3px] border-gray-800 rounded-xl p-6 font-serif text-black mx-auto max-w-4xl shadow-md print:shadow-none print:border-black relative">

          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <h2 className="border-2 border-gray-800 px-10 py-1 text-lg font-bold text-blue-900 bg-white tracking-widest whitespace-nowrap">
              {meta.name || 'Detailed Kundali Report'}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4">
            {/* Left Column */}
            <div className="space-y-6">

              {/* Birth Particulars */}
              <div>
                <h3 className="text-center text-red-800 font-bold text-[17px] mb-3 border-b-2 border-gray-800 pb-1">Birth Particulars</h3>
                <Row label="Sex" value={meta.gender} />
                <Row label="Date of birth" value={displayDate} />
                <Row label="Day of birth" value={displayDay} />
                <Row label="Time of birth" value={displayTime} />
                <Row label="Place of birth" value={meta.location?.split(',')[0]} />
                <Row label="Country" value={meta.location?.split(',').pop()?.trim()} />
                <div className="h-4 border-b border-gray-400 mb-4"></div>
                <Row label="Latitude" value={displayLat} />
                <Row label="Longitude" value={displayLon} />
                <Row label="Time zone" value={displayTz} />
                <Row label="Lagna (Ascendant)" value={meta.ascendant} />
                <Row label="Sunsign (Western)" value={meta.sun_sign} />
                <div className="h-4 border-b border-gray-400 mb-4"></div>
              </div>

              {/* Family Particulars Placeholder */}
              <div>
                <h3 className="text-center text-red-800 font-bold text-[17px] mb-3 border-b-2 border-gray-800 pb-1">Family Particulars</h3>
                <Row label="Grand Father" value={""} />
                <Row label="Father" value={""} />
                <Row label="Mother" value={""} />
                <Row label="Caste" value={""} />
                <Row label="Gotra" value={""} />
                <div className="h-4 border-b border-gray-400 mb-4"></div>
              </div>

              {/* Avakhada Chakra */}
              <div>
                <h3 className="text-center text-red-800 font-bold text-[17px] mb-3 border-b-2 border-gray-800 pb-1">Avakhada Chakra</h3>
                <Row label="1. Varna" value={displayVarna} />
                <Row label="2. Vashya" value={displayVashya} />
                <Row label="3. Nakshatra - Pada" value={`${meta.nakshatra} ${panchang.pada ? `- ${panchang.pada}` : ''}`} />
                <Row label="4. Yoni" value={displayYoni} />
                <Row label="5. Rashish" value={meta.moon_sign_lord || '-'} />
                <Row label="6. Gana" value={displayGana} />
                <Row label="7. Rashi" value={meta.moon_sign} />
                <Row label="8. Nadi" value={displayNadi} />
                <div className="h-4 border-b border-gray-400 mb-4"></div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Hindu Calendar */}
              <div>
                <h3 className="text-center text-red-800 font-bold text-[17px] mb-3 border-b-2 border-gray-800 pb-1">Hindu Calendar</h3>

                <p className="font-bold underline mb-2 text-sm text-gray-800">Chaitradi System</p>
                <Row label="Vikram Samvat" value={displayVikram} />
                <Row label="Lunar Month" value={displayLunarMonth} />

                <p className="font-bold underline mb-2 mt-4 text-sm text-gray-800">Kartikadi System</p>
                <Row label="Vikram Samvat" value={displayVikram} />
                <Row label="Lunar Month" value={displayLunarMonth} />
                <Row label="Saka Samvat" value={displaySaka} />
                <Row label="Paksha" value={panchang.paksha} />
                <Row label="Hindu Weekday" value={panchang.day_of_week || displayDay} />

                <div className="my-4"></div>
                <Row label="Tithi at birth" value={panchang.tithi?.tithi_name || panchang.tithi} />
                <div className="my-4"></div>
                <Row label="Nak. at birth" value={panchang.nakshatra?.nakshatra_name || panchang.nakshatra} />
                <div className="my-4"></div>
                <Row label="Yoga at birth" value={panchang.yoga?.yoga_name || panchang.yoga} />
                <div className="my-4"></div>
                <Row label="Karana at birth" value={panchang.karana?.karana_name || panchang.karana} />
                <div className="my-4"></div>

                <Row label="Sunrise Time" value={panchang.sunrise || panchang.sun_rise || panchang.sunrise_local || panchang.sunrise_time} />
                <Row label="Sunset Time" value={panchang.sunset || panchang.sun_set || panchang.sunset_local || panchang.sunset_time} />
                <div className="my-4"></div>
                <Row label="Ayanamsha" value={panchang.ayanamsha || meta.ayanamsha || data.ayanamsha} />
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  };
  const renderMasterEngine = () => {
    if (!data.master_engine) return null;

    // Define the premium sections we want to render from the master engine
    const premiumSections = [
      { key: 'quantum', title: 'Quantum Timeline & Probabilities' },
      { key: 'akashic', title: 'Akashic Records & Past Karma' },
      { key: 'sentient', title: 'Sentient Soul Archetype' },
      { key: 'cosmic_core', title: 'Cosmic Core Alignment' },
      { key: 'dimensional', title: 'Multi-Dimensional Destiny' },
      { key: 'brahma', title: 'Brahma Destiny Creation' },
      { key: 'maharishi', title: 'Maharishi Classical Yogas' },
      { key: 'astral_matrix', title: 'Astral Matrix & Subtle Patterns' }
    ];

    return (
      <div className="space-y-8 mb-6 print:mb-2">
        {premiumSections.map(section => {
          const sectionData = data.master_engine[section.key];
          if (!sectionData) return null;
          return (
            <div key={section.key} className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100 print:shadow-none print:break-inside-avoid print:border-gray-300">
              <SubsectionTitle>{section.title}</SubsectionTitle>
              {renderObjectFields(sectionData)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="report-global-style min-h-screen bg-white py-8 print:bg-white print:py-0">
      <style>{`
        body {
          background-color: white !important;
        }
        .report-global-style :not(.section-heading):not(.section-heading *):not(button):not(button *):not(svg):not(svg *):not(select):not(option) {
          color: black !important;
        }
      `}</style>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 print:shadow-none print:break-inside-avoid print:p-0">

        {/* Floating Print & Settings Buttons (Hidden in Print Mode) */}
        <div className="sticky top-4 flex justify-end gap-3 mb-4 print:hidden z-50">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white border-2 border-indigo-600 text-indigo-700 px-4 py-3 rounded-full font-bold shadow-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <span>⚙️</span> Customize Report Sections
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] p-4 text-left flex flex-col">
                <div className="flex justify-between items-center mb-3 border-b pb-2 sticky top-0 bg-white">
                  <h3 className="font-bold text-gray-800">Optional Sections</h3>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2 py-1 rounded">All</button>
                    <button onClick={deselectAll} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded">None</button>
                    <button onClick={() => setDropdownOpen(false)} className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded font-bold">✕ Close</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {OPTIONAL_SECTIONS.map(sec => (
                    <label key={sec.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={!!activeSections[sec.id]}
                        onChange={() => toggleSection(sec.id)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700 select-none">{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setPrintDropdownOpen(!printDropdownOpen)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>🖨️</span> Export Options
            </button>
            {printDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] py-2 text-left flex flex-col">
                <button
                  onClick={() => {
                    setPrintDropdownOpen(false);
                    window.print();
                  }}
                  className="px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 font-bold border-b border-gray-100"
                >
                  🖨️ Print Document
                </button>
                <button
                  onClick={() => {
                    setPrintDropdownOpen(false);
                    alert("To save as a PDF, please select 'Save as PDF' from the Printer/Destination dropdown in the print dialog.");
                    setTimeout(() => window.print(), 500);
                  }}
                  className="px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 font-bold"
                >
                  📄 Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Watermark */}
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.03] print:opacity-[0.05]">
          <div className="transform -rotate-45 text-[150px] font-black text-amber-500 whitespace-nowrap tracking-widest">
            AstroConsult
          </div>
        </div>

        {/* Cover Page */}
        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center mb-16 pb-12 border-b-4 border-indigo-900 relative z-10 print:min-h-[100vh] print:border-b-0 print:mb-0 print:pb-0 page-break-after">

          <div className="w-36 h-36 mx-auto bg-[#ff6347] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-[#ffbeb2] mb-8 print:mb-2 ring-4 ring-[#ff6347]/30">
            <span className="text-7xl font-serif">ॐ</span>
          </div>

          <h2 className="text-3xl font-bold text-amber-600 mb-2">AstroConsult</h2>
          <p className="text-sm font-bold text-slate-800 mb-16">www.astroconsult.com</p>

          <h1 className="text-4xl md:text-5xl font-serif font-black text-amber-500 mb-20 uppercase tracking-widest">Vedic Astrology Report</h1>

          <div className="text-left max-w-lg mx-auto w-full bg-white/80 p-8 rounded-xl border border-slate-200 mb-20 shadow-sm print:bg-transparent print:border-none print:shadow-none print:break-inside-avoid">
            <div className="mb-4 text-lg">
              <span className="font-bold text-slate-900 inline-block w-32">Name:</span>
              <span className="text-slate-800">{data.meta?.name || 'User'}</span>
            </div>
            <div className="mb-4 text-lg">
              <span className="font-bold text-slate-900 inline-block w-32">Date of Birth:</span>
              <span className="text-slate-800">{data.meta?.birth_datetime || '-'}</span>
            </div>
            <div className="text-lg">
              <span className="font-bold text-slate-900 inline-block w-32">Birth Place:</span>
              <span className="text-slate-800">{data.meta?.location || '-'}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-auto">Generated using Vedic Astrology Engine</p>
        </div>

        {/* Classic Cover Page (Page 2) */}
        {renderClassicCoverPage()}

        <div className="relative z-10">

          {/* Basic Details */}
          <SectionTitle>Birth Details & Demographics</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:mb-2 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div><p className="text-sm text-gray-500 uppercase font-bold">Ascendant</p><p className="font-medium text-lg">{data.meta?.ascendant || '-'}</p></div>
            <div><p className="text-sm text-gray-500 uppercase font-bold">Moon Sign</p><p className="font-medium text-lg">{data.meta?.moon_sign || '-'}</p></div>
            <div><p className="text-sm text-gray-500 uppercase font-bold">Nakshatra</p><p className="font-medium text-lg">{data.meta?.nakshatra || '-'}</p></div>
            <div><p className="text-sm text-gray-500 uppercase font-bold">Gender</p><p className="font-medium text-lg">{data.meta?.gender || '-'}</p></div>
          </div>

          {/* Planetary Positions */}
          <SectionTitle>Planetary Positions</SectionTitle>
          {renderPlanetTable()}

          {/* D1 Chart */}
          <SectionTitle>Birth Chart</SectionTitle>
          {renderD1Chart()}

          {/* Detailed Chart Analysis */}
          <SectionTitle>Detailed D1 Planetary Analysis</SectionTitle>
          <p className="text-gray-600 mb-6 print:mb-2 italic">In-depth house-by-house interpretations for your Lagna Chart.</p>
          {renderD1DetailedAnalysis()}

          {/* Chart Analysis & Predictions */}
          <SectionTitle>Chart Analysis & Life Predictions</SectionTitle>
          <p className="text-gray-600 mb-6 print:mb-2 italic">The following analysis is derived from your D1 birth chart placements.</p>
          {renderPredictions()}

          {/* Strengths */}
          <SectionTitle>Planetary Strengths (Shadbala)</SectionTitle>
          {renderStrengths()}



          {/* Vimshottari Dasha Life Timeline */}
          {data.dasha && data.dasha.list && (
            <>
              <SectionTitle>Vimshottari Dasha Life Timeline</SectionTitle>
              <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300">
                <VimshottariGridTimeline data={data} />
              </div>
            </>
          )}

          {activeSections.auspicious_factors && (<>
            {/* Favourable & Numerology */}
            <SectionTitle>Auspicious Factors</SectionTitle>
            {renderFavourable()}
          </>)}

          {/* Moved Strengths */}



          {activeSections.yogas && (<>
            {/* Yogas */}
            <SectionTitle>Classical Yogas</SectionTitle>
            {renderYogas()}
          </>)}

          {activeSections.dasha && (<>
            {/* Dasha Periods */}
            <SectionTitle>Current Dasha (Planetary Periods)</SectionTitle>
            {renderDasha()}
          </>)}

          {activeSections.d2 && (<>
            {/* D2 Chart */}
            <SectionTitle>Hora Chart (D2 - Wealth & Finances)</SectionTitle>
            {renderD2Chart()}
            <VargaAnalysisPanel vargaKey="D2" vargaNum={2} />
          </>)}

          {activeSections.d3 && (<>
            {/* D3 Chart */}
            <SectionTitle>Drekkana Chart (D3 - Siblings & Courage)</SectionTitle>
            {renderD3Chart()}
            <VargaAnalysisPanel vargaKey="D3" vargaNum={3} />
          </>)}

          {activeSections.d4 && (<>
            {/* D4 Chart */}
            <SectionTitle>Chaturthamsha Chart (D4 - Fortune & Properties)</SectionTitle>
            {renderD4Chart()}
            <VargaAnalysisPanel vargaKey="D4" vargaNum={4} />
          </>)}

          {activeSections.d5 && (<>
            {/* D5 Chart */}
            <SectionTitle>Panchamsha Chart (D5 - Power & Authority)</SectionTitle>
            {renderD5Chart()}
            <VargaAnalysisPanel vargaKey="D5" vargaNum={5} />
          </>)}

          {activeSections.d6 && (<>
            {/* D6 Chart */}
            <SectionTitle>Shashthamsha Chart (D6 - Health & Enemies)</SectionTitle>
            {renderD6Chart()}
            <VargaAnalysisPanel vargaKey="D6" vargaNum={6} />
          </>)}

          {activeSections.d7 && (<>
            {/* D7 Chart */}
            <SectionTitle>Saptamsha Chart (D7 - Children & Progeny)</SectionTitle>
            {renderD7Chart()}
            <VargaAnalysisPanel vargaKey="D7" vargaNum={7} />
          </>)}

          {activeSections.d8 && (<>
            {/* D8 Chart */}
            <SectionTitle>Ashtamsha Chart (D8 - Longevity & Unexpected Events)</SectionTitle>
            {renderD8Chart()}
            <VargaAnalysisPanel vargaKey="D8" vargaNum={8} />
          </>)}

          {activeSections.d9 && (<>
            {/* D9 Chart */}
            <SectionTitle>Navamsha Chart (D9 - Marriage & Inner Self)</SectionTitle>
            {renderD9Chart()}
            <VargaAnalysisPanel vargaKey="D9" vargaNum={9} />
          </>)}

          {activeSections.d10 && (<>
            {/* D10 Chart */}
            <SectionTitle>Dashamsha Chart (D10 - Career & Profession)</SectionTitle>
            {renderD10Chart()}
            <VargaAnalysisPanel vargaKey="D10" vargaNum={10} />
          </>)}

          {activeSections.d12 && (<>
            {/* D12 Chart */}
            <SectionTitle>Dwadashamsha Chart (D12 - Parents & Ancestry)</SectionTitle>
            {renderD12Chart()}
            <VargaAnalysisPanel vargaKey="D12" vargaNum={12} />
          </>)}

          {activeSections.d16 && (<>
            {/* D16 Chart */}
            <SectionTitle>Shodashamsha Chart (D16 - Vehicles & Happiness)</SectionTitle>
            {renderD16Chart()}
            <VargaAnalysisPanel vargaKey="D16" vargaNum={16} />
          </>)}

          {activeSections.d20 && (<>
            {/* D20 Chart */}
            <SectionTitle>Vimshamsha Chart (D20 - Spiritual Progress)</SectionTitle>
            {renderD20Chart()}
            <VargaAnalysisPanel vargaKey="D20" vargaNum={20} />
          </>)}

          {activeSections.d24 && (<>
            {/* D24 Chart */}
            <SectionTitle>Chaturvimshamsha Chart (D24 - Education & Knowledge)</SectionTitle>
            {renderD24Chart()}
            <VargaAnalysisPanel vargaKey="D24" vargaNum={24} />
          </>)}

          {activeSections.d27 && (<>
            {/* D27 Chart */}
            <SectionTitle>Saptavimshamsha Chart (D27 - Strengths & Weaknesses)</SectionTitle>
            {renderD27Chart()}
            <VargaAnalysisPanel vargaKey="D27" vargaNum={27} />
          </>)}

          {activeSections.d30 && (<>
            {/* D30 Chart */}
            <SectionTitle>Trimshamsha Chart (D30 - Misfortunes & Evils)</SectionTitle>
            {renderD30Chart()}
            <VargaAnalysisPanel vargaKey="D30" vargaNum={30} />
          </>)}

          {activeSections.d40 && (<>
            {/* D40 Chart */}
            <SectionTitle>Khavedamsha Chart (D40 - Auspicious & Inauspicious Effects)</SectionTitle>
            {renderD40Chart()}
            <VargaAnalysisPanel vargaKey="D40" vargaNum={40} />
          </>)}

          {activeSections.d45 && (<>
            {/* D45 Chart */}
            <SectionTitle>Akshavedamsha Chart (D45 - General Indications)</SectionTitle>
            {renderD45Chart()}
            <VargaAnalysisPanel vargaKey="D45" vargaNum={45} />
          </>)}

          {activeSections.d60 && (<>
            {/* D60 Chart */}
            <SectionTitle>Shashtiamsha Chart (D60 - Past Life Karma & Micro-Level Destiny)</SectionTitle>
            {renderD60Chart()}
            <VargaAnalysisPanel vargaKey="D60" vargaNum={60} />
          </>)}

          {activeSections.ashtakavarga && (<>
            {/* Ashtakavarga */}
            <SectionTitle>Sarvashtakavarga (Overall Strength Wheel)</SectionTitle>
            {renderAshtakavarga()}
          </>)}

          {activeSections.destiny_timeline && (<>
            {/* Destiny Timeline */}
            <SectionTitle>Destiny Timeline (10-Year Forecast)</SectionTitle>
            {renderDestinyTimeline()}
            {renderDestinyGraph()}
          </>)}

          {activeSections.cosmic_life_map && (<>
            {/* Cosmic Life Map */}
            <SectionTitle>5D Cosmic Life Map</SectionTitle>
            {renderCosmicLifeMap()}
          </>)}

          {activeSections.destiny_matrix && (<>
            {/* Destiny Matrix */}
            <SectionTitle>Destiny Matrix Visualizer</SectionTitle>
            {renderDestinyMatrixVisualizer()}
          </>)}

          {activeSections.wealth_analysis && (<>
            {/* Wealth Analysis */}
            <SectionTitle>Wealth & Prosperity Analysis</SectionTitle>
            {renderWealthPrediction()}
          </>)}

          {activeSections.life_events && (<>
            {/* Life Events */}
            <SectionTitle>Life Event Predictions (2025-2035)</SectionTitle>
            {renderLifeEvents()}
          </>)}

          {activeSections.dosha && (<>
            {/* Dosha Analysis */}
            <SectionTitle>Dosha Summary</SectionTitle>
            {renderDoshas()}
            {renderSadeSatiAnalysis()}
          </>)}

          {activeSections.remedies && (<>
            {/* Remedies */}
            <SectionTitle>Recommended Remedies & Mitigation</SectionTitle>
            {renderRemedies()}
          </>)}

          {activeSections.soul_archetype && (<>
            {/* Soul Archetype */}
            <SectionTitle>Soul Archetype & Destiny</SectionTitle>
            {renderSentient()}
          </>)}

          {activeSections.akashic && (<>
            {/* Akashic Soul Record */}
            <SectionTitle>Akashic Soul Record</SectionTitle>
            {renderAkashic()}
          </>)}

          {activeSections.omniscient && (<>
            {/* Omniscient Analysis */}
            <SectionTitle>Omniscient Analysis</SectionTitle>
            {renderOmniscient()}
          </>)}

          {activeSections.quantum && (<>
            {/* Quantum Forecast Analysis */}
            <SectionTitle>Quantum Forecast Analysis</SectionTitle>
            {renderQuantum()}
          </>)}

          {activeSections.dimensional && (<>
            {/* Dimensional Destiny Analysis */}
            <SectionTitle>Dimensional Destiny Analysis</SectionTitle>
            {renderDimensional()}
          </>)}

          {activeSections.astral && (<>
            {/* Astral Matrix */}
            <SectionTitle>Astral Matrix Destiny Analysis</SectionTitle>
            {renderAstral()}
          </>)}

          {activeSections.cosmic_core && (<>
            {/* Cosmic Core */}
            <SectionTitle>Cosmic Core Destiny Analysis</SectionTitle>
            {renderCosmicCore()}
          </>)}

          {activeSections.maharishi && (<>
            {/* Maharishi Destiny Analysis */}
            <SectionTitle>Maharishi Destiny Analysis</SectionTitle>
            {renderMaharishi()}
          </>)}

          {activeSections.brahma && (<>
            {/* Brahma Destiny Analysis */}
            <SectionTitle>Brahma Destiny Analysis</SectionTitle>
            {renderBrahma()}
          </>)}

          {activeSections.paramarshi && (<>
            {/* Paramarshi Advisor Analysis */}
            <SectionTitle>Paramarshi Advisor Analysis</SectionTitle>
            {renderParamarshi()}
          </>)}

          {activeSections.planetary_wisdom && (<>
            {/* Planetary Wisdom */}
            <SectionTitle>Planetary Wisdom: Deep Placement Analysis</SectionTitle>
            {renderPlanetaryWisdom()}
          </>)}

          {activeSections.oracle && (<>
            {/* Oracle Insights */}
            <SectionTitle>Sage Insights & Divine Oracle</SectionTitle>
            {renderOracle()}
          </>)}

          {activeSections.karma_timeline && (<>
            {/* Karma Timeline */}
            <SectionTitle>Advanced Karma Projection (2025-2045)</SectionTitle>
            {renderKarmaTimeline()}
          </>)}

          {activeSections.life_events_narrative && (<>
            {/* Life Events Narrative */}
            <SectionTitle>Life Events Narrative: The Journey Ahead</SectionTitle>
            {renderLifeEventsNarrative()}
          </>)}

          {activeSections.probability_matrix && (<>
            {/* Probability Matrix Engine */}
            <SectionTitle>Probability Matrix Engine</SectionTitle>
            {renderProbabilityMatrix()}
          </>)}

          {activeSections.neural_summary && (<>
            {/* Cosmic Neural Summary */}
            <SectionTitle>Cosmic Neural Summary</SectionTitle>
            {renderNeuralSummary()}
          </>)}

          {activeSections.destiny_signature && (<>
            {/* Destiny Signature */}
            <SectionTitle>Destiny Signature</SectionTitle>
            {renderDestinySignature()}
          </>)}

          {activeSections.life_vector && (<>
            {/* AI Life Vector Analysis */}
            <SectionTitle>AI Life Vector Analysis</SectionTitle>
            {renderLifeVectorPredictions()}
          </>)}

          {/* Moved Vimshottari Dasha Life Timeline */}

          {/* Sarva Chancha Chakra & Detailed Tables */}
          {activeSections.sarva_chancha && (data.ashtakavarga || (data.master_engine && data.master_engine.ashtakavarga)) && (
            <>
              <SectionTitle>Sarva Chancha Chakra</SectionTitle>
              <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300">
                <SarvaChanchaChakra avData={data.ashtakavarga || (data.master_engine && data.master_engine.ashtakavarga)} stacked={true} />
              </div>

              <SectionTitle>Bhinnashtakavarga Detailed Tables</SectionTitle>
              <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 max-w-4xl mx-auto w-full">
                {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Ascendant'].map(planet => {
                  const ashtakavargaData = data.ashtakavarga || (data.master_engine && data.master_engine.ashtakavarga);
                  if (!ashtakavargaData?.bhinna_breakdown?.[planet]) return null;
                  return (
                    <div key={planet} className="mb-6 print:mb-2">
                      <BhinnaTable
                        planet={planet}
                        breakdown={ashtakavargaData.bhinna_breakdown[planet]}
                      />
                    </div>
                  );
                })}
              </div>

              {activeSections.ashtakavarga_reduction && data.av_reductions && Object.keys(data.av_reductions).length > 0 && (
                <>
                  <SectionTitle>Ashtakavarga Reduction</SectionTitle>
                  <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300">
                    <AsthavargaReduction data={data} />
                  </div>
                </>
              )}

              {/* Moved Shadbala Chart */}

              {activeSections.vimsopaka && data.vimsopaka_assessment && (
                <>
                  <SectionTitle>Varga Strength Matrix (Vimsopaka Bala)</SectionTitle>
                  <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300 bg-white min-h-[300px] print:break-inside-avoid">
                    <VimsopakaAssessment data={data} />
                  </div>
                </>
              )}

              {activeSections.gemstones && (<>
                <SectionTitle>Recommended Gemstones (Ratna)</SectionTitle>
                <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm print:shadow-none print:break-inside-avoid print:border-gray-300 bg-white min-h-[300px] print:break-inside-avoid">
                  <GemstonePanel data={data} />
                </div>
              </>)}

              {activeSections.life_analysis && data.ai_life_analysis && Object.keys(data.ai_life_analysis).length > 0 && (
                <>
                  <SectionTitle>Detailed Life Analysis</SectionTitle>
                  <div className="mb-8 print:mb-2 mt-6 print:mt-2 print:my-2">
                    {LIFE_ANALYSIS_SECTIONS.map((sec, idx) => {
                      const content = data.ai_life_analysis[sec.key];
                      if (!content) return null;
                      return (
                        <div key={idx} className="mb-6 print:mb-2 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                          <h4 className="text-xl font-bold text-indigo-900 mb-3 flex items-center gap-3">
                            <span className="text-2xl">{sec.icon}</span> {sec.en}
                          </h4>
                          <p className="text-gray-700 leading-relaxed font-serif text-lg whitespace-pre-wrap">
                            {content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {activeSections.rituals && renderDetailedRemedialRituals()}
              {activeSections.predictive_logic && renderAdvancedPredictiveLogic()}
              {activeSections.universal_wisdom && renderUniversalWisdom()}
            </>
          )}

          {/* Master Engine / Premium Insights */}
          {activeSections.master_engine && data.master_engine && (
            <>
              <SectionTitle>Premium Cosmic Insights</SectionTitle>
              <p className="text-gray-600 mb-6 print:mb-2 italic">The following analysis is generated by advanced astrological AI engines, exploring deep karmic, dimensional, and spiritual patterns.</p>
              {renderMasterEngine()}
            </>
          )}
        </div>

        {/* Back Cover / Thank You */}
        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center mt-20 pt-12 border-t-4 border-indigo-900 relative z-10 print:min-h-[100vh] print:border-t-0 print:mt-0 print:pt-0 page-break-before">

          <div className="w-36 h-36 mx-auto bg-[#ff6347] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-[#ffbeb2] mb-8 print:mb-2 ring-4 ring-[#ff6347]/30">
            <span className="text-7xl font-serif">ॐ</span>
          </div>

          <h2 className="text-3xl font-bold text-amber-600 mb-2">AstroConsult</h2>
          <p className="text-sm font-bold text-slate-800 mb-24">www.astroconsult.com</p>

          <h1 className="text-5xl md:text-6xl font-serif font-black text-amber-500 mb-20 uppercase tracking-widest">Thank You</h1>

          <p className="text-sm text-slate-600 mt-auto">Generated using Vedic Astrology Engine</p>
        </div>

      </div>
    </div>
  );
}

export default KundaliReportView;
