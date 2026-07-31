import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { createReport } from '../services/api';
import LanguageSwitcher from "./LanguageSwitcher";
import ZodiacChart from "./ZodiacChart";
import ShadbalaChart from "./ShadbalaChart";
import AshtakavargaViewer from "./AshtakavargaViewer";
import PlanetaryRemediesViewer from "./PlanetaryRemediesViewer";
import VimsopakaAssessment from "./VimsopakaAssessment";
import DashaDashboard from "../pages/DashaDashboard";
import BhavbalaView from "./BhavbalaView";
import VimshottariTable from "./VimshottariTable";
import VimshottariLifeTable from "./VimshottariLifeTable";
import VimshottariGridTimeline from "./VimshottariGridTimeline";
import { PLANET_IN_SIGN_EFFECTS } from '../data/planetInSign';
import { D2_INTERPRETATIONS } from '../data/d2HouseInterpretations';
import { D3_INTERPRETATIONS } from '../data/d3HouseInterpretations';
import { D4_INTERPRETATIONS } from '../data/d4HouseInterpretations';
import { D5_INTERPRETATIONS } from '../data/d5HouseInterpretations';
import { D6_INTERPRETATIONS } from '../data/d6HouseInterpretations';
import { D7_INTERPRETATIONS } from '../data/d7HouseInterpretations';
import { D8_INTERPRETATIONS } from '../data/d8HouseInterpretations';
import { D9_INTERPRETATIONS } from '../data/d9HouseInterpretations';
import { D10_INTERPRETATIONS } from '../data/d10HouseInterpretations';
import { D12_INTERPRETATIONS } from '../data/d12HouseInterpretations';
import { D16_INTERPRETATIONS } from '../data/d16HouseInterpretations';
import { D20_INTERPRETATIONS } from '../data/d20HouseInterpretations';
import { D24_INTERPRETATIONS } from '../data/d24HouseInterpretations';
import { D27_INTERPRETATIONS } from '../data/d27HouseInterpretations';
import { D30_INTERPRETATIONS } from '../data/d30HouseInterpretations';
import { D40_INTERPRETATIONS } from '../data/d40HouseInterpretations';
import { D45_INTERPRETATIONS } from '../data/d45HouseInterpretations';
import { D60_INTERPRETATIONS } from '../data/d60HouseInterpretations';
import CareerHeatmap from './d10/CareerHeatmap';
import PromotionMeter from './d10/PromotionMeter';
import CareerAlerts from './d10/CareerAlerts';
import WealthActivation from './d10/WealthActivation';
import TransitTimeControl from './worksheet/TransitTimeControl';
import CompactTransitControl from './worksheet/CompactTransitControl';
import PanchPakshiTable from './PanchPakshiTable';
import PlanetaryRelationshipsViewer from "./PlanetaryRelationshipsViewer";
import KPChartViewer from "./KPChartViewer";
import AsthavargaReduction from "./AsthavargaReduction";
import BhinnastaVarga from "./BhinnastaVarga";
import AspectsSummary from "./AspectsSummary";
import KrishanaMurthyChart from "./KrishanaMurthyChart";
import KrishanaMurthySignificators from "./KrishanaMurthySignificators";
import ShodashvargaSummary from "./ShodashvargaSummary";
import BhriguBinduAnalysis from "./BhriguBinduAnalysis";
import AIOraclePanel from "./AIOraclePanel";
import DynamicVargaAnalysis from "./DynamicVargaAnalysis";
import SphutaDrishtiViewer from "./SphutaDrishtiViewer";

const BulletInterpretation = ({ text, colorClass = "text-slate-600" }) => {
  if (!text) return null;
  const points = text.split(/(?<=\.)\s+|\n+/).filter(p => p.trim());
  return (
    <ul className="space-y-3 relative z-10">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 items-start group/point">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colorClass.replace('text-', 'bg-')} opacity-40 group-hover/point:opacity-100 transition-opacity`}></span>
          <span className={`text-lg text-black text-opacity-100 leading-relaxed font-medium font-serif`}>{point.trim()}</span>
        </li>
      ))}
    </ul>
  );
};

const ConjunctionAnalysis = ({ houses }) => {
  const [conjunctions, setConjunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseConjunctionDetail = (detail) => {
    let good = [];
    let bad = [];

    let posText = detail.positiveConjunction || detail.positive_conjunction || (detail.effects && detail.effects.positiveConjunction);
    let negText = detail.negativeConjunction || detail.negative_conjunction || (detail.effects && detail.effects.negativeConjunction);

    if (!posText && !negText) {
      const textToParse = detail.description || detail.interpretation || detail.results || "";
      const sentences = textToParse.match(/[^.!?]+[.!?]+(\s+|$)/g) || [textToParse];

      let posSentences = [];
      let negSentences = [];

      sentences.forEach(s => {
        const trimmed = s.trim();
        if (!trimmed) return;
        const lower = trimmed.toLowerCase();
        if (
          lower.includes("negative") || lower.includes("bad") || lower.includes("afflict") ||
          lower.includes("overthinking") || lower.includes("anger") || lower.includes("accident") ||
          lower.includes("struggle") || lower.includes("loss") || lower.includes("anxiety") ||
          lower.includes("deception") || lower.includes("conflict") || lower.includes("hinder") ||
          lower.includes("clash") || lower.includes("ego") || lower.includes("ritual") ||
          lower.includes("blindly") || lower.includes("noise") || lower.includes("problems") ||
          lower.includes("exaggeration") || lower.includes("false")
        ) {
          negSentences.push(trimmed);
        } else if (
          lower.includes("positive") || lower.includes("good") || lower.includes("success") ||
          lower.includes("benefit") || lower.includes("gain") || lower.includes("bless") ||
          lower.includes("creative") || lower.includes("wealth") || lower.includes("intelligence") ||
          lower.includes("mind") || lower.includes("spiritual") || lower.includes("authority") ||
          lower.includes("logic") || lower.includes("wisdom")
        ) {
          posSentences.push(trimmed);
        } else {
          posSentences.push(trimmed);
        }
      });

      posText = posSentences.join(" ");
      negText = negSentences.join(" ");
    }

    if (posText) {
      const sentences = posText.match(/[^.!?]+[.!?]+(\s+|$)/g) || [posText];
      sentences.forEach(s => {
        const trimmed = s.trim();
        if (!trimmed) return;

        let label = "Strength";
        const lower = trimmed.toLowerCase();
        if (lower.includes("mind") || lower.includes("think") || lower.includes("intellect") || lower.includes("logic")) {
          label = "Sharp Mind";
        } else if (lower.includes("success") || lower.includes("fortune") || lower.includes("wealth") || lower.includes("gain") || lower.includes("rich")) {
          label = "Big Successes";
        } else if (lower.includes("foreign") || lower.includes("travel") || lower.includes("abroad") || lower.includes("culture") || lower.includes("birthplace") || lower.includes("connection")) {
          label = "Foreign Connections";
        } else if (lower.includes("speech") || lower.includes("speak") || lower.includes("express") || lower.includes("eloquent")) {
          label = "Eloquent Expression";
        } else if (lower.includes("lead") || lower.includes("authority") || lower.includes("power") || lower.includes("ruler")) {
          label = "Leadership Authority";
        } else if (lower.includes("spiritual") || lower.includes("god") || lower.includes("faith") || lower.includes("wise") || lower.includes("wisdom")) {
          label = "Spiritual Wisdom";
        }
        good.push({ label, text: trimmed });
      });
    }

    if (negText) {
      const sentences = negText.match(/[^.!?]+[.!?]+(\s+|$)/g) || [negText];
      sentences.forEach(s => {
        const trimmed = s.trim();
        if (!trimmed) return;

        let label = "Challenge";
        const lower = trimmed.toLowerCase();
        if (lower.includes("faith") || lower.includes("religion") || lower.includes("ritual") || lower.includes("teachings") || lower.includes("blindly")) {
          label = "Questioning Faith";
        } else if (lower.includes("overthinking") || lower.includes("worry") || lower.includes("mental noise") || lower.includes("noise") || lower.includes("confused")) {
          label = "Overthinking";
        } else if (lower.includes("anger") || lower.includes("temper") || lower.includes("aggression") || lower.includes("fight")) {
          label = "Anger & Aggression";
        } else if (lower.includes("health") || lower.includes("disease") || lower.includes("accident") || lower.includes("pain")) {
          label = "Health Risks";
        } else if (lower.includes("cheat") || lower.includes("deception") || lower.includes("lie") || lower.includes("dishonest")) {
          label = "Risk of Deception";
        } else if (lower.includes("clash") || lower.includes("egotism") || lower.includes("ego") || lower.includes("proud")) {
          label = "Ego Clashes";
        }
        bad.push({ label, text: trimmed });
      });
    }

    return { good, bad };
  };

  useEffect(() => {
    if (!houses) return;

    const detected = [];
    Object.keys(houses).forEach(houseNum => {
      const houseData = houses[houseNum];
      const planets = houseData.planets || [];
      const cleanPlanets = planets.map(p => {
        if (!p) return null;
        if (typeof p === "object") {
          return p.planet || p.name;
        }
        return p;
      }).filter(p => p && p !== "Ascendant" && p !== "L");

      if (cleanPlanets.length >= 2 && cleanPlanets.length <= 4) {
        detected.push({
          house: houseNum,
          planets: cleanPlanets
        });
      }
    });

    if (detected.length > 0) {
      setLoading(true);
      Promise.all(detected.map(async (conj) => {
        try {
          let url = "";
          if (conj.planets.length === 2) {
            url = `/api/conjunction/detail/${conj.planets[0]}/${conj.planets[1]}`;
          } else if (conj.planets.length === 3) {
            url = `/api/conjunction/triple/detail/${conj.planets[0]}/${conj.planets[1]}/${conj.planets[2]}`;
          } else if (conj.planets.length === 4) {
            url = `/api/conjunction/four/detail/${conj.planets[0]}/${conj.planets[1]}/${conj.planets[2]}/${conj.planets[3]}`;
          }

          if (!url) return null;
          const res = await fetch(url);
          if (res.ok) {
            const detail = await res.json();
            return { ...conj, detail };
          }
        } catch (err) {
          console.error(`Failed to fetch conjunction for ${conj.planets.join("-")}`, err);
        }
        return null;
      })).then(results => {
        setConjunctions(results.filter(r => r !== null));
        setLoading(false);
      });
    } else {
      setConjunctions([]);
    }
  }, [houses]);

  if (loading) return <div className="p-4 text-center text-[10px] text-gray-400 italic">Exploring House Conjunctions...</div>;
  if (conjunctions.length === 0) return null;

  return (
    <div className="space-y-12 mt-12 border-t border-indigo-200 pt-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">💠</div>
        <div>
          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">House Conjunction Analysis</h4>
          <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Diagnostic Pairing Insights</div>
        </div>
      </div>

      {conjunctions.map((conj, idx) => {
        const parsed = parseConjunctionDetail(conj.detail);
        return (
          <section key={idx} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl shadow-md border border-white/10">✨</div>
              <div>
                <h4 className="text-lg font-black text-slate-700 uppercase tracking-tight leading-none">{conj.planets.join(" + ")}</h4>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">House {conj.house} Resonance</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/item space-y-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black text-indigo-900 pointer-events-none">{conj.house}</div>

              {/* The Good Section */}
              {parsed.good.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <span>🟢</span> The Good Analysis of Conjunction
                  </h5>
                  <ul className="space-y-2 pl-4">
                    {parsed.good.map((item, idx) => (
                      <li key={idx} className="text-base text-slate-700 leading-relaxed font-serif flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>
                          <span className="font-bold text-slate-900">{item.label}:</span> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* The Bad Section */}
              {parsed.bad.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h5 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                    <span>🔴</span> The Bad Analysis of Conjunction
                  </h5>
                  <ul className="space-y-2 pl-4">
                    {parsed.bad.map((item, idx) => (
                      <li key={idx} className="text-base text-slate-700 leading-relaxed font-serif flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span>
                          <span className="font-bold text-slate-900">{item.label}:</span> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const PLANET_COLORS = {
  "Sun": "#ef4444", "Moon": "#475569", "Mars": "#dc2626", "Mercury": "#16a34a",
  "Jupiter": "#d97706", "Venus": "#db2777", "Saturn": "#4338ca", "Rahu": "#0d9488",
  "Ketu": "#92400e", "Ascendant": "#000000"
};

const getPlanetPositionsFromHouses = (houses) => {
  if (!houses) return [];
  const positions = [];
  Object.entries(houses).forEach(([hNum, hData]) => {
    (hData.planets || []).forEach(p => {
      const name = typeof p === 'string' ? p : (p.planet || p.name);
      if (name === "Ascendant" || name === "Lagna") return;
      positions.push({
        planet: name,
        house: parseInt(hNum),
        is_retrograde: p.is_retrograde,
        is_combust: p.is_combust
      });
    });
  });
  return positions;
};

const parseInterpretationString = (text) => {
  if (!text) return { general: "", positive: "", negative: "", neutral: "" };
  if (typeof text === "object") return text;

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];

  let general = [];
  let positive = [];
  let negative = [];
  let neutral = [];

  sentences.forEach(sentence => {
    const s = sentence.trim();
    if (!s) return;

    const lower = s.toLowerCase();

    if (
      lower.includes("positive") ||
      lower.includes("well-placed") ||
      lower.includes("favorable") ||
      lower.includes("gains") ||
      lower.includes("blesses you") ||
      lower.includes("benefit")
    ) {
      positive.push(s);
    } else if (
      lower.includes("afflicted") ||
      lower.includes("negative") ||
      lower.includes("unfavorable") ||
      lower.includes("combust") ||
      lower.includes("retrograde") ||
      lower.includes("isolation") ||
      lower.includes("depression") ||
      lower.includes("discord") ||
      lower.includes("harms") ||
      lower.includes("losses") ||
      lower.includes("challenges") ||
      lower.includes("hurdles") ||
      lower.includes("problems") ||
      lower.includes("illness") ||
      lower.includes("accidents") ||
      lower.includes("disappointment") ||
      lower.includes("anxiety") ||
      lower.includes("fear") ||
      lower.includes("struggle")
    ) {
      negative.push(s);
    } else if (
      lower.includes("neutral") ||
      lower.includes("average") ||
      lower.includes("moderate") ||
      lower.includes("typical")
    ) {
      neutral.push(s);
    } else {
      general.push(s);
    }
  });

  return {
    general: general.join(" ") || text,
    positive: positive.join(" ") || "Constructive and favorable alignment qualities manifest standard positive energy.",
    negative: negative.join(" ") || "Afflictions or imbalances can trigger standard blockages and challenges.",
    neutral: neutral.join(" ") || "Balanced placement qualities manifest steady, moderate influence."
  };
};

const HouseEffectTable = ({ data, planetEffects, customPositions = null }) => {
  const positions = customPositions || data?.planet_positions || [];
  const interpMap = {
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

  return (
    <div className="mt-12 space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">🏠</div>
        <div>
          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">House-by-House Interpretations</h4>
          <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Lagna Chart Placements</div>
        </div>
      </div>
      <div className="space-y-12">
        {positions.filter(p => interpMap[p.planet]).map((p) => {
          const houseData = interpMap[p.planet]?.[p.house];
          if (!houseData) return null;
          const status = planetEffects[p.planet] || "neutral";

          const parsedData = typeof houseData === "object" ? houseData : parseInterpretationString(houseData);
          const generalText = parsedData.general;
          const statusText = parsedData[status];

          const statusColor = status === "positive" ? "bg-green-100 text-green-700" : status === "negative" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
          const statusBoxBg = status === "positive" ? "bg-green-50/50 border-green-200 text-green-900" : status === "negative" ? "bg-red-50/50 border-red-200 text-red-900" : "bg-amber-50/50 border-amber-200 text-amber-900";

          return (
            <section key={p.planet} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl shadow-md border border-white/10">✨</div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[p.planet] || "#000" }}>
                      {p.planet}{p.is_retrograde ? '*' : ''}{p.is_combust ? '#' : ''} Placement
                    </h4>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">House {p.house} Analysis</div>
                  </div>
                  <span className={`text-[7px] px-2 py-1 rounded font-black uppercase tracking-widest ${statusColor} shadow-sm`}>
                    {status}
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/item space-y-4">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-8xl font-black text-indigo-900 pointer-events-none">{p.house}</div>

                {generalText && (
                  <div>
                    <BulletInterpretation
                      text={generalText}
                      colorClass="text-slate-700"
                    />
                  </div>
                )}

                {statusText && (
                  <div className={`p-4 rounded-lg border ${statusBoxBg} mt-3`}>
                    <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-75">
                      {status} Manifestation Analysis
                    </div>
                    <BulletInterpretation
                      text={statusText}
                      colorClass={status === "positive" ? "text-green-800" : status === "negative" ? "text-red-800" : "text-amber-800"}
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const GEMSTONES = {
  "Sun": { name: "Ruby", hindi: "Manik", color: "#f87171", bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-800" },
  "Moon": { name: "Pearl", hindi: "Moti", color: "#94a3b8", bg: "from-slate-50 to-slate-100", border: "border-slate-200", text: "text-slate-800" },
  "Mars": { name: "Red Coral", hindi: "Moonga", color: "#dc2626", bg: "from-red-50 to-red-600", border: "border-red-700", text: "text-red-900" },
  "Mercury": { name: "Emerald", hindi: "Panna", color: "#10b981", bg: "from-emerald-50 to-emerald-100", border: "border-emerald-200", text: "text-emerald-800" },
  "Jupiter": { name: "Yellow Sapphire", hindi: "Pukhraj", color: "#fbbf24", bg: "from-amber-50 to-amber-100", border: "border-amber-200", text: "text-amber-800" },
  "Venus": { name: "Diamond", hindi: "Heera", color: "#db2777", bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-800" },
  "Saturn": { name: "Blue Sapphire", hindi: "Neelam", color: "#3b82f6", bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-800" },
};

export const SUN_HOUSE_INTERPRETATIONS = {
  1: {
    general: "Sun in 1st house gives you a bright personality and a brilliant mind. Considering the Sun is the actual soul significator, you feel it is your right to be on the throne and deserve the power and the top-spot. When Sun is in 1st house, you feel like it is must for you to be on the top spot and that you deserve to own it without making any efforts. In the professional space, you shall feel as if you are victorious and should be respected for it. You will feel that you can be successful as a self-employed individual and would rule your kingdom. You will know how to impress others and control their actions. You like to lead others and show them the best path for their journey. You may become a politician or hold a high position in the government.",
    positive: "Positive Manifestation: High self-esteem, natural leadership capabilities, glowing charisma, strong vitality, and high moral values. You naturally command respect in public.",
    negative: "Negative Manifestation: Promotes extreme ego, pride, arrogance, difficulty accepting criticism, and conflicts with superiors or partners due to a domineering nature.",
    neutral: "Neutral Manifestation: Gives a stable sense of self, strong willpower, and steady efforts to gain authority and status."
  },
  2: {
    general: "Your Sun is placed in the 2nd house, you tend to flaunt your family history with pride. You have a lean physique, and your speech becomes authoritative and royal. You will be blessed with financial success and become fond of collecting gold and jewelry. A well-placed Sun will make you support your family. It helps you achieve your desired goals, so that you and your family flourish with prosperity and abundance. It will also give you a magnetic voice that influences the crowds, and make you fond of food and politics.",
    positive: "Positive Manifestation: Accumulation of ancestral wealth, high financial success, commanding and persuasive speech, and strong support for family welfare.",
    negative: "Negative Manifestation: Arrogant speech, ego clashes within the family, potential losses in speculations, and strained relations with children or in-laws.",
    neutral: "Neutral Manifestation: Steady income growth, typical family ties, and average involvement in financial/political spheres."
  },
  3: "The Sun in the 3rd house makes you extremely courageous and empowered. Your ego lies in your communication, and you have a lot of physical and mental strength. This placement of the Sun makes you inquisitive, and gives you an inclination toward creative fields, such as becoming a writer, singer, a fitness coach, or a politician. A well-placed Sun makes you fond of travelling and the performing arts. It grants you wisdom and courage and will keep you kind and supportive toward your siblings. However, if the Sun is afflicted, it will make you distant from your siblings and could give you a loose character.",
  4: "The placement of the Sun in the 4th house gives you a lavish house with all kinds of comforts. Your mother is the one leading the family, and both your parents will be strict and disciplinary. Your early life could be tough, but you will achieve success after your mid-30s. A well-placed Sun makes you sensitive, gentle, and shy. It will bless you with a guiding light in the form of good mentors. You will be able to secure a high status in society and have a prosperous profession. However, if the Sun is afflicted, you may lose your motivation and strength. You could become oversensitive and face troubles with your boss, seniors, and authorities.",
  5: "When in the 5th house, the Sun tends to give favorable results, as the 5th house is its natural zodiac, that is, Leo. It will make you the center of attention in your school and college. Your main goal will be making your children leaders of the community. This placement makes you accomplished and successful at a very early age. A well-placed Sun makes you devoted to your family and children, and your family becomes your pride. It gives you courage and a keen interest in adventure activities. However, if the Sun is afflicted, you could become arrogant and annoying. You may become manipulative and overconfident and that could get you into trouble. Your children may also take shortcuts and cheat others.",
  6: "The Sun in the 6th house gives you the ability to win against your enemies and resolve conflicts. This position of the Sun can make you a successful lawyer, politician, doctor, or a businessman. A well-placed Sun gives you immense strength and a strong bond with your mother and siblings. It will make you a perfectionist and give you a desire to serve others. However, if the Sun is afflicted, it makes you vulnerable and spoils your relationships, especially your married life. It could also cause a drain on finances, and excessive debts.",
  7: "The 7th house placement of the Sun gives you the attitude of a king. It is hard for you to enter business partnerships, since you like to be the sole decision maker. You are likely to run into people who do not respect you, as the Sun becomes debilitated in the 7th zodiac. A well-placed Sun gives you a supportive life partner and a successful business. Your life partner will be wealthy and from a reputable family. You may secure a government job, and you are likely to become rich post marriage. However, if the Sun is afflicted, it could make you pessimistic about life and also make you rude and egoistic. You may face stiff competition in government jobs, and face differences in your married life.",
  8: {
    general: "The Sun in the 8th house gives you a natural power of making things popular. You will do very well in government jobs, as a surgeon, and in the financial sector. Your professional life will be more fruitful post the age of 30. The Sun also grants you fame and a magnetic personality. You will have a belief in astrology and other occult sciences.",
    positive: "Positive Manifestation: A well-placed Sun will give you wealth from property or marriage through inheritance. You will have a spiritual bent, strong interest in occult sciences, and will never face financial crises.",
    negative: "Negative Manifestation: If afflicted, your love life will be hampered and it may cause sadness and pain. It can also push you toward underworld or illegal activities, and sudden ups and downs in life.",
    neutral: "Neutral Manifestation: Average career gains after age 30, moderate interest in mystery or spiritual sciences, and stable joint assets."
  },
  9: "The Sun in the 9th house elevates your ego level and also makes you highly religious. You will travel overseas and might settle there. You will be significantly influenced by your father and teachers. A well-placed Sun will make you fulfill your responsibilities with unconditional love. Your intellectual qualities will aid your success. You will have mass followers, and people will respect you for your wisdom. It will also grant you a greater share of ancestral properties. However, if the Sun is afflicted, it will affect your father's health and you may face serious financial losses.",
  10: "The Sun in the 10th house gives you immense willpower and determination. Presidents, politicians and CEO's often have the Sun in the 10th house. You will also have a supportive father who could help you professionally. This placement of the Sun gives you a bright career and you could also become a powerful politician. A well-placed Sun gives you leadership qualities and grants you fame through your work. You will generate a good income and could secure a government job. However, if the Sun is afflicted, it will hinder your professional growth and give you enormous anger, aggression, and ego.",
  11: "The Sun in the 11th house could affect your social life negatively. Your main focus in life will be to earn money and you may not have many friends; also, you may not be a good listener. However, a well-placed Sun in this house shows immense gains and highly influential contacts. You will win everyone's heart and will enjoy a long and healthy life. However, if the Sun is afflicted, it could affect your children's education and make them feel worthless. You may also be humiliated because of your children. You will make more enemies than friends, and will not be able to capitalize on the gains that are meant for you.",
  12: "The placement of the Sun in the 12th house may grant you enlightenment. It elevates your imagination, and gives you psychic powers. You make a lot of political connections and might work and settle abroad. Your relationship with your father will be somewhat strained, and you could have a big ego. A well-placed Sun can make you a successful politician, or a leading businessman dealing in foreign goods. However, if the Sun is afflicted, it can lead to difficult situations like a jail sentence, hospitalization, insomnia, addiction, and separation in relationships.",
};

export const MARS_HOUSE_INTERPRETATIONS = {
  1: {
    general: "Mars in 1st house makes you highly energetic as well as aggressive. It puts you in leadership positions and gives you a lot of responsibilities. It gives you a strong physique with a reddish skin tone.",
    positive: "Positive Manifestation: Makes you action-oriented, providing excellent endurance, high stamina, and strategic out-of-the-box thinking.",
    negative: "Negative Manifestation: If afflicted, it ignites jealousy, promotes anger without any purpose, triggers blood- and skin-related issues, and can channelize aggression inwards creating frustration if combust.",
    neutral: "Neutral Manifestation: Gives average vitality, moderate assertiveness, and standard leadership drive."
  },
  2: {
    general: "Mars in 2nd house gives you a passion to accumulate wealth and possessions by hook or crook. This placement is not ideal for family harmony and could give you a harsh speech, which may disturb your relationships.",
    positive: "Positive Manifestation: Enhances your professional network, widens your business, and provides multiple sources of income.",
    negative: "Negative Manifestation: Strains family harmony, gives harsh speech, triggers anger towards family, and can cause indigestion, acidity, or difficulty conceiving. If combust, it may lead to dishonesty and public humiliation.",
    neutral: "Neutral Manifestation: Average wealth accumulation, moderate speech delivery, and typical family dynamics."
  },
  3: {
    general: "Mars in 3rd house brings you immense energy to multitask and makes your communication filterless. It makes you courageous, but also gives you an aggressive nature and an impatient attitude. It could also disturb your relationship with your siblings.",
    positive: "Positive Manifestation: Grants courage, capacity to think out of the box (benefiting you professionally), and a love for traveling and adventure.",
    negative: "Negative Manifestation: Promotes an aggressive nature and impatient attitude, distorts relationship with siblings, increases risk of accidents/controversies, and creates inner anger/resentment if combust.",
    neutral: "Neutral Manifestation: Balanced sibling relations, moderate communication style, and standard multitasking habits."
  },
  4: {
    general: "Mars in 4th house makes you creative, enthusiastic, and charming. It will give you a short temper and strain your relationship with your family, especially your mother.",
    positive: "Positive Manifestation: Makes you hardworking and strong, helping you acquire real estate through inheritance or hard work.",
    negative: "Negative Manifestation: Gives a short temper, strains relationships with family (especially mother), deprives of satisfaction, delays education/career, and creates struggles for a comfortable life if combust.",
    neutral: "Neutral Manifestation: Standard domestic environment, average interest in real estate, and typical emotional expression."
  },
  5: {
    general: "Mars in 5th house will make you manipulative and wealthy. It will enhance your creativity and hidden talents, and may give you multiple love affairs. It will give you conflicts and disagreements in relationships, which could be why your relationships could be short lived.",
    positive: "Positive Manifestation: Gears you toward success, helps discover hidden talents, sparks interest in sports, and gives a healthy body with good digestion.",
    negative: "Negative Manifestation: Causes conflicts/disagreements in relationships, makes love life short-lived, causes miscarriages, creates issues with children, and hampers success due to short temper or authoritative nature.",
    neutral: "Neutral Manifestation: Average creative output, typical relationship stability, and normal digestion."
  },
  6: {
    general: "Mars in 6th house makes you highly competitive at your workplace. You will always compete with your colleagues and want to win against them. It may also give you envy, jealousy, and arrogance.",
    positive: "Positive Manifestation: Helps you become a successful lawyer, remarkable politician, and invincible against opponents.",
    negative: "Negative Manifestation: Triggers envy, jealousy, arrogance, blood-related health issues, vulnerability to accidents, weakened immune system, and high debts leading to financial crises.",
    neutral: "Neutral Manifestation: Standard workplace competition, average immunity, and manageable financial status."
  },
  7: {
    general: "Mars in 7th house directly impacts the longevity of your spouse and the quality of your married life. You will be able to run a successful business if you are the sole owner, but may not do well in partnership because of your dominating nature.",
    positive: "Positive Manifestation: Can make you a successful lawyer or government leader, bringing immense passion, romance, mutual support, and respect in marriage.",
    negative: "Negative Manifestation: Leads to dominating behavior, high expectations, reduced fertility (or queer orientation if associated with eunuch planets), marital differences, and physical inability to fulfill desires if combust.",
    neutral: "Neutral Manifestation: Standard marriage longevity, moderate business partnerships, and average expectations from spouse."
  },
  8: {
    general: "Mars in 8th house will make you highly intuitive and you will easily sense other people's motives. It will make you passionate and ambitious to attain huge success.",
    positive: "Positive Manifestation: Sparks deep interest in research and occult sciences. You can excel as a healer, spy, or medical representative.",
    negative: "Negative Manifestation: Causes body inflammation/diseases, sudden accidents, poor marital longevity, sour relations with in-laws, and projects jealousy due to low energy if combust.",
    neutral: "Neutral Manifestation: Average joint resources, moderate intuition levels, and standard health conditions."
  },
  9: {
    general: "Mars in 9th house will motivate you to break social and religious rules. It expands your imagination power and gives you an opportunity to travel abroad and earn in foreign currency.",
    positive: "Positive Manifestation: Can make you a renowned writer or energetic salesperson. Helps you acquire substantial land and real estate.",
    negative: "Negative Manifestation: Makes you rigid about religious beliefs, prompts grudges, adversely affects father's health, and promotes earning through fraud/deception if combust.",
    neutral: "Neutral Manifestation: Normal religious beliefs, average travel opportunities, and typical career stability."
  },
  10: {
    general: "Mars in 10th house will give you a dynamic personality and make you a leader in your profession. You will act like a courageous warrior who can overcome all obstacles.",
    positive: "Positive Manifestation: Highly ambitious, driven toward luxury, quick and effective job completion, and powerful leadership qualities.",
    negative: "Negative Manifestation: Creates workplace struggles, professional rivalries, high anxiety, arrogance, and prompts taking shortcuts if combust.",
    neutral: "Neutral Manifestation: Average career growth, moderate professional authority, and standard work pace."
  },
  11: {
    general: "Mars in 11th house gives you the brilliance to make gains out of your desires. It will facilitate a big network and you will spend a lot of time in goal setting and give your best to achieve these.",
    positive: "Positive Manifestation: Can make you a successful political leader with a huge following. Promotes a reliable, supportive friend circle and contentment.",
    negative: "Negative Manifestation: Makes you seek gains from anything, turning you into a spendthrift with overwhelming imagination and ideas.",
    neutral: "Neutral Manifestation: Average gains, typical social circle size, and standard goal-setting activities."
  },
  12: {
    general: "Mars in 12th house will give you a secretive nature, and you will try to suppress your emotions. You may constantly travel abroad for work where your energy will be more productive.",
    positive: "Positive Manifestation: Enables you to achieve success in foreign careers as well as in spiritual goals.",
    negative: "Negative Manifestation: Wastes energy in job hopping, causes delays in marriage, triggers accidents, and prompts a lack of commitment to your partner if combust.",
    neutral: "Neutral Manifestation: Moderate spiritual inclination, average travel frequency, and typical emotional balance."
  }
};

export const MERCURY_HOUSE_INTERPRETATIONS = {
  1: "Mercury in the first house helps you reveal your communication skills to the world and makes you fluent in multiple languages. It also blesses you with an artistic and philosophical mind. However, even though you are clever and intelligent, you will be restless and hop on from one thing to another multiple times a day. You will be a multitasker and can become a successful businessman or a salesperson. A well-placed Mercury keeps you thrilled and excited. It will make you attractive, flexible, and fun loving. If Mercury is afflicted, it will make you self-centered and fickle-minded. It will also give relationship issues.",
  2: "Mercury in the second house blesses you with humor, intelligence, and knowledge. It makes you efficient when it comes to public speaking and influencing the masses. You will be an excellent salesman and will also have a melodious voice. A well-placed Mercury will make you clever and intelligent and give you excellent marketing skills. However, if Mercury is afflicted, it will make you stubborn and egoistic. It may also bring financial losses in business, as you may not be able to deliver as per the demands of customers.",
  3: "Mercury in the third house makes you multi-talented and highly efficient when it comes to work. You have excellent communication skills, which make you successful in various fields, including counseling, marketing, and singing. Being a natural motivational speaker, you can inspire crowds and, thus, run a successful business by keeping your employees motivated. A well-placed Mercury will give you exceptional writing skills and the ability to express yourself skillfully. You may even have multiple careers at a time. You will apply your logical thinking and be successful in your profession. However, if Mercury is afflicted, you will become calculative and will think only about your monetary benefits all the time. You will make relations with people in order to gain from them, and may not have any emotional attachment with your friends.",
  4: "Mercury in the fourth house will make you family oriented and highly influenced by your mother. You will enjoy a comfortable life and a luxurious home in childhood. Your mother might be very talkative and fun-loving and could be running a successful business. This placement of Mercury can make you a successful real estate agent or a politician who serves their homeland. A well-placed Mercury will make you extremely imaginative and creative. Your memory will also be sharp, and you will receive a prestigious education. However, if Mercury is afflicted, you will become rigid and not accept other’s opinions easily. You may often have outbursts if things don't go your way.",
  5: "Mercury in the fifth house blesses you with a creative mindset and a wonderful sense of humor. It makes you skilled at acting, singing, writing poetry, understanding religious texts, speculation, and performing comedy shows. You love talking to your children and will relive your childhood with them. A well-placed Mercury will give you the confidence to express your love in a creative way. It will make you witty and humorous and you will love playing tricks, making jokes, and mimicking others. However, if Mercury is afflicted, you will have a strong ego, and your words might be hurtful to others. You will make an excellent liar and will try to manipulate others.",
  6: "When Mercury is placed in the sixth house, you will be able to resolve conflicts and avoid fights with the help of your communication skills. You use your intelligence to serve others and can become a successful lawyer or a chartered accountant. You are intelligent enough to save money in taxes and keep calculating your losses and gains. A well-placed Mercury supports your married life and you will be able to gain the confidence of your subordinates at work. However, if Mercury is afflicted, you may be prone to overthinking and end up with nervous disorders. This position will also give rise to increased debts and make you a spendthrift.",
  7: "Mercury in the seventh house can make you a successful businessperson or a good marriage counselor. Your life partner may also help you with your business and could be your business partner as well. You will be a romantic person, but may not be able to spare enough time for your partner. Your communication with your life partner will be the strength of your relationship. If Mercury is well placed, it will bless you with financial gains, wealth, and fortune. Your married life will also be contented and blissful. However, if Mercury is afflicted, it gives you a feeling of emptiness whenever you are not with your spouse. You will become speculative about your relationships, which will leave you dissatisfied.",
  8: "Mercury in the eighth house can make you an excellent researcher and will also give you a keen interest in and knowledge of occult sciences. You will be interested in esoteric studies, and would like to dig up the facts. You have a curious nature and an interesting personality. A well-placed Mercury may help you settle abroad and gather a good amount of liquid wealth in savings. You will have the power to convince and control others as per your will. However, if Mercury is afflicted, it could make you shrewd and harsh. Your arrogance will hinder your growth, and you might face problems related to your skin and respiratory system.",
  9: "Mercury in the ninth house influences you to try to find reason and logic behind religious beliefs. You can write about philosophy and publish your content to monetize it. You will also travel long distances, and will keep on looking for opportunities to earn money by any means. A well-placed Mercury will make you financially sound and curious to acquire knowledge. You will also be able to make money from your knowledge and spiritualism. However, if Mercury is afflicted, you will try to acquire knowledge through shortcuts and you will lose your respect and credibility at work. This position makes you lack righteousness and morality.",
  10: "Mercury in the tenth house can make you a successful journalist, novelist, writer, counselor, public speaker, mathematician, accountant or an entrepreneur. Your flawless communication skills will help you excel in your career. You will enjoy a fun relationship with your father and treat him like a friend. A well-placed Mercury will help you achieve recognition at work because of your exceptional articulation skills and creative ways of presenting new ideas. You will also be a very good negotiator. However, if Mercury is afflicted, you will not be a team player and would also want to control others always. Your overall personality could be rude, harsh, and selfish, which will leave you a Lone Ranger.",
  11: "Mercury in the eleventh house makes you clever and learned, and helps you gain from speculative businesses. You have a good social network because of your excellent social skills. A well-placed Mercury will enhance your profits and can help you fulfill your dreams. Your personality will be pleasant and charming, and you will have a knack for impressions. However, if Mercury is afflicted, you will not be able to focus on one thing, and keep hopping from one profession to another. Your friends might betray you and you will always be busy with backbiting and gossip.",
  12: "Mercury in the twelfth house makes you well educated and gives you a philosophical mindset. It also sparks your interest in esoteric learning. You will have a strong psychic ability and will be able to communicate with supernatural entities. This position of Mercury will make you secretive, shy and an introvert. A well-placed Mercury will help you travel a lot and settle abroad. You will also be wealthy and will be able to spend lavishly. However, if Mercury is afflicted, it will make you arrogant and tobacco. You will have scarcity of money, and your decisions could be hasty and immature, leading to huge losses. Your fertility and love life will also be adversely affected.",
};

export const VENUS_HOUSE_INTERPRETATIONS = {
  1: "Venus in the first house gives you a sensuous and magnetic personality. You look much younger than your actual age and your libido is high. You care a lot about your appearance, and will be a fitness freak. You may also have artistic talents and a caring nature. A well-placed Venus will give you pleasant speech and make you popular with the opposite sex. However, if Venus is afflicted, it may cause fertility issues, your self-love could turn into selfishness, and you will likely become materialistic.",
  2: "Venus in the second house makes you fond of collecting jewelry and clothes. You will also be conscious about your savings. Your speech will be elegant and you're likely to become a profound singer, public speaker, or a cosmetologist. A well-placed Venus will bless you with good family relationships, and grant you wealth through family businesses. You will have an exclusive palate and will be fond of trying new delicacies. Your wealth will multiply post marriage. However, if Venus is afflicted, you could lose your ancestral wealth and may face infertility issues. You will also become greedy for material possessions.",
  3: "Venus in the third house blesses you with mesmerizing communication skills and an attractive personality. It also makes you a miser and makes you average-looking. You will not be determined and hardworking, which could make you suffer professionally as well as in personal life. A well-placed Venus will give you the opportunity to travel a lot. It will make you presentable and well dressed. However, if Venus is afflicted, it will give you sudden ups and downs in personal as well as professional life. You may become very dramatic, and your life could be full of trauma.",
  4: "Venus in the fourth house makes you family-oriented and domestic in nature. Women are highly valued in your family. You enjoy pleasures and comfort through real estate and your family house will be esthetic and beautiful. You have a special bond with your mother and you may follow her blindly. If Venus is well placed, you will gain from your inheritance and have a long and happy married life. Your spouse will also have a warm relationship with your family. You will be satisfied with your life and will enjoy all kinds of luxuries. However, if Venus is afflicted, it may deprive you of luxury and happiness. You may not be blessed with your mother's affection and may also be deprived of your property, and face domestic crises and quarrels about inheritance.",
  5: "Venus in the fifth house makes you academically sound and gives you multiple talents. It will give you a big social circle and unexpected gains. You are playful, sensual, and simply in love with love. You thrive and flourish on romantic attention, and you will have a beautiful heart. You will be fertile, and your children will be talented just like you. A well-placed Venus will make you wealthy, and your children will bring you happiness. It will also enhance your fertility as well as vitality. However, if Venus is afflicted, it will create relationship issues, and your education might get adversely affected. Also, you may not be able to opt for your desired career and may lose money in speculation.",
  6: "Venus in the sixth house gives you noble qualities. You will be helpful and kind toward others. This placement is not ideal for your marriage and may indicate separation. Your fertility will also not be up to the mark and you may indulge in romantic relationships with your colleagues. However, a well-placed Venus will bless you with a good immune system and help you accumulate wealth through your job. You will also have a witty nature and good comic timing. However, if Venus is afflicted, you will experience strain in your relationships due to a lack of trust. You will not be committed and responsible in your marriage, and your spouse will be unhealthy.",
  7: "Venus in the seventh house grants you an attractive personality and blesses you with abundance and wealth. The whole idea of love and romance excites you and gives you several crushes and infatuations before marriage. You will be easy-going and flexible and will not have many conflicts in life. A well-placed Venus will bless you with a great-looking spouse who will be understanding and cultured. You will be sensuous, famous, and may even live abroad. However, if Venus is afflicted, your marital relationship will be unpleasant and may lead to separation.",
  8: "Venus in the eighth house makes you a secretive lover. Your spouse will be shrewd and will manage finances on behalf of both of you. Your combined assets will flourish after marriage. You will have a deep interest in the occult sciences, and may have healing powers. A well-placed Venus will make you committed to your spouse and fill your life with romance and immense love. However, if Venus is afflicted, you could face a lot of heart breaks and disappointment on the relationship front. You will also become lazy and not be appreciated by others.",
  9: "Venus in the ninth house inclines you toward spiritual learning and makes you philosophical. Your life is filled with joy and pleasures, and you can consider yourself very lucky. A well-placed Venus makes you excel in studies and grants you knowledge about spirituality, religion, and history. You can become a successful teacher and inspire others through your achievements. However, if Venus is afflicted, your relationships will become long distance and there will be misunderstandings between you and your spouse. You will become overwhelmed while trying to balance your career as well as your domestic life.",
  10: "Venus in tenth house represents authority, passion, compassion, and public image. You can become a successful social worker or a philanthropist. You will opt for a career that enhances your creativity, and you may discover your spouse in the workplace or professional area. A well-placed Venus will give you influential connections and open doors to elevate you and help others with love and compassion. However, if Venus is afflicted, it will make you self-centered and greedy. You will become overloaded with debts, and you will crave for limelight and attention but will not get it.",
  11: "Venus in the eleventh house will give you opportunities to explore the world and you will use these opportunities to make money. Socially, you have a very soothing and jovial personality, which is why you attract many friends. People find comfort while having conversations with you and you give them great advice. You will become financially stronger after you get married and will be more inclined toward business rather than being employed in a 9 to 5. If Venus is well placed, then your personality will become more attractive, and you will be able to connect and communicate easily with anyone. However, if Venus is afflicted, it will make you highly materialistic and possessive. Your friends will also be self-centered and not loyal to you.",
  12: "Venus in twelfth house will grant you imaginative powers and can help you become a renowned artist. You will have high expectations from your spouse and never be satisfied in one relationship. This placement of Venus gives you utmost bed pleasures and happiness through intimacy from a very early age. A well-placed Venus will give you an attractive personality and make your life pleasurable. You will also live a long life with your spouse. However, if Venus is afflicted, you will be dissatisfied with your spouse and may not be loyal to them. You will also be a spendthrift and take loans to fulfill yourexport",
};

export const MOON_HOUSE_INTERPRETATIONS = {
  1: "Moon in the 1st house gives you a royal personality and an attractive aura that draws people. Your social circle will be wide and you have natural artistic talent along with emotional stability. Your life revolves around your mother, and you are affectionate and nurturing by nature. You are emotionally intelligent and enjoy wealth and comforts. However, a negative Moon can cause isolation, depression, and mental health issues. A combust Moon leads to confusion, mood swings, and emotional exhaustion, and may indicate poor health for your mother. Madonna and Raj Kapoor were born with Moon in the 1st house.",
  2: "Moon in the 2nd house brings financial independence, emotional attachment, and a strong inclination toward family values and traditions, often driving you to carry forward your family lineage. It gives you an artistic personality, interest in mysticism, and strong intuitive ability. You have good savings and are a clever investor. You like cold drinks and are a foodie. You share a deep emotional bond with your family. Your spouse may keep some things secret. However, an afflicted Moon can cause financial instability, materialism, emotional turmoil, and marital problems. A combust Moon leads to financial insecurity and wealth crisis. Mukesh Ambani and Jay-Z were born with Moon in the 2nd house.",
  3: "Moon in the 3rd house generally gives you an active and curious mind, a strong desire to travel, and harmonious relations with neighbors and siblings. You often enjoy multiple sources of income and excel in writing, communication, and marketing skills. A well-placed Moon makes you fortunate and influential, giving you the potential to become a spiritual guru or yogi. However, a negative Moon can lead to restlessness, distraction, frequent job changes, financial instability, and marital issues. A combust Moon can make you lazy, create negative thinking, and lead to trust issues. Elon Musk and Akshay Kumar were born with Moon in the 3rd house.",
  4: "Moon in the 4th house gives you all kinds of luxury, real estate, and close family bonds. You will have a positive personality with a strong sense of motherly care and affection. Your appearance and habits will resemble your mother's. A positive Moon guides you toward careers related to serving others. Your family is your first priority, and you enjoy charity and wealth. However, an afflicted Moon makes you emotionally turbulent, dissatisfied, and deprived of mother's love. A combust Moon fills your life with struggles and deprives you of maternal inheritance. Donald Trump and Siddharth Roy Kapur were born with Moon in the 4th house.",
  5: "Moon in the 5th house makes you highly creative and an eloquent speaker. You attract people easily and have a deep interest in politics. You share a strong emotional bond with your children and remain loyal in relationships. A favorable Moon makes you courageous, noble, and loyal. You have deep spiritual interests and enjoy wealth. However, an unfavorable Moon distracts you from studies, causing workplace conflicts, anxiety, health issues, and unnecessary expenses. A combust Moon brings disharmony in child-related matters and love life. JRD Tata and Steven Spielberg were born with Moon in the 5th house.",
  6: "Moon in the 6th house is highly beneficial for lawyers and police officers as it gives you many enemies and the capacity to deal with them. You do well in medical and health services, and have a strong affection for animals. It makes you conscious of your diet and grants business acumen. A well-placed Moon gives a helpful nature, healthy lifestyle, and intuitive, hardworking character. However, an unfavorable Moon makes you over-sensitive about minor health issues, causing confusion and insecurity. A combust Moon makes you feel depressed and lonely, leading to trust issues with your spouse. Shah Rukh Khan and Aishwarya Rai Bachchan were born with Moon in the 6th house.",
  7: "Moon in the 7th house ensures unconditional support from your spouse, balancing your emotions and creating harmonious relationships. You earn wealth and fame from business, and get a beautiful spouse. A positive Moon grants all kinds of pleasures, a successful business, and a happy married life. However, an unfavorable Moon causes suffocating relationships and disharmony in business and marriage, making it hard to settle abroad. A combust Moon leads to dissatisfaction in marriage and hinders financial growth. Michael Jackson and PT Usha were born with Moon in the 7th house.",
  8: "Moon in the 8th house gives a deep interest in occult sciences, making you a successful astrologer or healer. It provides a nurturing nature but an uncertain fortune. Emotional ups and downs make you mature and balanced. A positive Moon brings peace, achievements, good communication, and travel opportunities. However, an unfavorable Moon causes discord with in-laws and a fear of physical harm, mood swings, low libido, and obesity. A combust Moon causes chronic diseases, relationship issues, and fear of water. Sadhguru and Osho were born with Moon in the 8th house.",
  9: "Moon in the 9th house brings name, fame, wealth, and recognition, granting mental strength and good fortune. It sparks interest in philosophy and religion, raising chances of foreign travel and settlement. A positive Moon keeps you content and connects you to spiritual mentors. It helps you think creatively. An afflicted Moon causes conflict with family traditions and marital instability. Unplanned expenses can push you into financial crisis. A combust Moon can make you superstitious, exposing you to exploitation by fake gurus. Amitabh Bachchan and Amit Shah were born with Moon in the 9th house.",
  10: "Moon in the 10th house makes you authoritative yet compassionate and generous. You choose diplomacy over violence. It is favorable for government leaders. A strict mother makes you closer to your father. You are both career-oriented and family-oriented. A well-placed Moon gives an attractive personality, leadership qualities, and strong intuition. An afflicted Moon makes you obsessed with success, neglecting personal relationships, causing low self-esteem and anxiety. A combust Moon leads to job changes and challenges to social norms. Hillary Clinton and Bill Gates were born with Moon in the 10th house.",
};

export const JUPITER_HOUSE_INTERPRETATIONS = {
  1: "Jupiter in the 1st house brings respect and popularity in society, making people appreciate your good deeds, honesty, and selfless nature. A well-placed Jupiter makes you stand out, providing deep mental strength, confidence, compassion, and spiritual inclinations. However, if Jupiter is afflicted, you may unintentionally hurt others or become overly helpful. A combust Jupiter brings a lack of luck and makes acquiring knowledge challenging. MS Dhoni and Barack Obama were born with Jupiter in the 1st house.",
  2: "Jupiter in the 2nd house gives an influential personality and charming speech, bringing prosperity and suitability for leadership roles. Your enemies weaken, and you gain from the government. A well-placed Jupiter makes you a good writer or a sweet-tongued astrologer, ensuring steady wealth. An afflicted Jupiter makes you speak harshly, creating family discord. A combust Jupiter leads to financial stagnation. Rajesh Khanna and Abraham Lincoln were born with Jupiter in the 2nd house.",
  4: "Jupiter in the 4th house is highly auspicious, bringing inherited property and abundant comforts. You share a close bond with your family, especially your mother, who supports you emotionally and financially. A favorable Jupiter helps in profitable real estate deals and grants strong intuition. An afflicted Jupiter makes you harsh, cunning, or overly talkative. A combust Jupiter slows down progress and reduces luck. Narendra Modi and Salman Khan were born with Jupiter in the 4th house.",
  5: "Jupiter in the 5th house creates a deep bond with your children, granting multiple talents and happiness in love life with a divine connection. It provides ample career opportunities using your hobbies and talents. A well-placed Jupiter makes you kind and affectionate. An afflicted Jupiter causes child-related issues and a dominating nature. A combust Jupiter reduces romance and dims creative potential. Isaac Newton and Justin Bieber were born with Jupiter in the 5th house.",
  6: "Jupiter in the 6th house brings mixed results. It offers good career opportunities and help in clearing debts, but can pose health challenges. A well-placed Jupiter brings positive outcomes in legal matters and protection from enemies. An afflicted Jupiter can cause liver issues and workplace challenges. A combust Jupiter allows enemies to harm you and makes clearing debts difficult. Amitabh Bachchan and Sachin Tendulkar were born with Jupiter in the 6th house.",
  7: "Jupiter in the 7th house blesses you with a happy married life, providing a spiritual, loyal, and highly learned spouse. It grants honesty, spirituality, and wealth. A well-placed Jupiter supports business ventures, especially in counseling, teaching, or astrology. An afflicted Jupiter brings marriage and business challenges. A combust Jupiter leads to low self-esteem and isolation. Priyanka Chopra and Mahatma Gandhi were born with Jupiter in the 7th house.",
  8: "Jupiter in the 8th house drives you toward deep research, investigation, and occult sciences, granting intimacy with your partner. A positive Jupiter brings sudden wealth from inheritance or in-laws, along with spiritual interest. An afflicted Jupiter causes sudden losses and short-lived relationships. A combust Jupiter brings issues due to secretive actions. Joe Biden and Imran Khan were born with Jupiter in the 8th house.",
  9: "Jupiter in the 9th house builds a strong bond with your father and deep faith in religion, bringing mental peace, stability, and foreign travel opportunities. A well-placed Jupiter grants higher education and positive life outcomes. An afflicted Jupiter can alienate you from family due to excessive religious indulgence. A combust Jupiter brings disappointment in educational goals. Albert Einstein and Akshay Kumar were born with Jupiter in the 9th house.",
  10: "Jupiter in the 10th house brings special recognition at work, granting foresight, moral values, and righteousness. It gives a positive social reputation and makes you generous. A well-placed Jupiter brings a successful career, fame, and wealth while keeping you humble. An afflicted Jupiter causes overconfidence and ego at work. A combust Jupiter leads to lack of confidence and less effective initiatives. Angelina Jolie and Mukesh Ambani were born with Jupiter in the 10th house.",
  11: "Jupiter in the 11th house brings gains and prosperity, improving relationships with siblings and expanding your social circle. A well-placed Jupiter increases income through multiple sources. An afflicted Jupiter causes irregular income and sibling discord. A combust Jupiter leads to irritability and low confidence. Kapil Sharma and Indira Gandhi were born with Jupiter in the 11th house.",
  12: "Jupiter in the 12th house brings opportunities from abroad and makes you deeply spiritual, sometimes leading to moksha. It increases overall expenses, including medical ones. A well-placed Jupiter expands spiritual knowledge. An afflicted Jupiter brings losses, health issues, and harm from enemies. A combust Jupiter disrupts your connection with the divine, leaving you disappointed.",
};

export const RAHU_HOUSE_INTERPRETATIONS = {
  1: "Rahu in the 1st house enhances your intellect and makes you quick-witted, bringing quick wealth. However, it can give unwanted habits and a sense of disorder. A well-placed Rahu sharpens intuition and brings instant new ideas, giving an attractive personality. An afflicted Rahu leads to unethical success methods, irritability, and condescension. Nikola Tesla and Charles Dickens were born with Rahu in the 1st house.",
  2: "Rahu in the 2nd house ensures wealth through career and inheritance. You share a deep bond with family but may stay distant due to work commitments. A well-placed Rahu brings excellent social connections and ancestral reverence. An afflicted Rahu makes you a spendthrift, leading to legal troubles. Salman Khan and Ravi Shankar were born with Rahu in the 2nd house.",
  3: "Rahu in the 3rd house points to a career in media due to excellent communication skills, bringing growth through short travels. A well-placed Rahu makes you focused, dedicated, and courageous. An afflicted Rahu makes you selfish, prone to accidents or injuries, and causes financial losses. Virat Kohli and Michael Jackson were born with Rahu in the 3rd house.",
  4: "Rahu in the 4th house creates deep attachment to home and motherland, prompting real estate growth and domestic happiness. A well-placed Rahu brings sudden wealth and power, keeping you loyal and emotionally attached to your mother. An afflicted Rahu brings sudden downfalls in wealth and property, harming relationships. Aamir Khan and Serena Williams were born with Rahu in the 4th house.",
  5: "Rahu in the 5th house brings multiple love affairs and highlights romance. You gain from speculation and possess versatile talents. A well-placed Rahu strengthens bonds with children and raises social status. An afflicted Rahu harms married life and causes speculative losses. Narendra Modi and Steve Jobs were born with Rahu in the 5th house.",
  6: "Rahu in the 6th house provides a fighting spirit and victory in competitions, giving resilience against illness. You prefer jobs over business. A well-placed Rahu brings good health, material comforts, and career growth. An afflicted Rahu demands caution in investments and can cause chronic health issues. Hardik Pandya and Angelina Jolie were born with Rahu in the 6th house.",
  7: "Rahu in the 7th house makes married life happy, building a strong relationship with your spouse. It brings good business opportunities and partner relations. A well-placed Rahu brings wealth and marital affection. An afflicted Rahu causes career hurdles and spouse misunderstandings. Amitabh Bachchan and David Beckham were born with Rahu in the 7th house.",
  8: "Rahu in the 8th house makes you secretive, drawing you to occult sciences and research. You will be innovative and wealthy, gaining fame through creativity. A well-placed Rahu makes you a skilled researcher. An afflicted Rahu can pull you into illegal wealth creation, causing marital discord. Ranbir Kapoor and Winston Churchill were born with Rahu in the 8th house.",
  9: "Rahu in the 9th house promotes religious tendencies, making you a religious preacher, and brings financial gains. It offers foreign travel and cultural exposure. A well-placed Rahu helps in asset accumulation and fatherly guidance. An afflicted Rahu causes misunderstandings with father and children, bringing disappointment. Charlie Chaplin and Megan Fox were born with Rahu in the 9th house.",
  10: "Rahu in the 10th house drives you to earn name and wealth, making you ambitious. It encourages learning, bringing career advancement. A well-placed Rahu brings foreign gains and corporate or government success. An afflicted Rahu brings relationship strain and temptation for illegal means. Chris Gayle and Neha Kakkar were born with Rahu in the 10th house.",
  11: "Rahu in the 11th house grants immense courage, determination, and a strong friend circle with influential contacts. A well-placed Rahu brings government gains, foreign travels, and exceptional communication skills. An afflicted Rahu leads to manipulating friends for selfish goals and strained relation with father. Arvind Kejriwal and Abraham Lincoln were born with Rahu in the 11th house.",
  12: "Rahu in the 12th house accelerates career growth through foreign contacts. Your love life remains good, but small issues can disturb marriage. You tend to spend more than you earn. A well-placed Rahu inspires charity and selflessness. An afflicted Rahu leads to financial problems due to unnecessary spending and health concerns.",
};

export const KETU_HOUSE_INTERPRETATIONS = {
  1: "Ketu in the 1st house brings an attractive personality and mysterious aura, making you popular yet introverted. You love adventure and new activities. A strong spiritual side gives you moral strength. A well-placed Ketu makes you truthful and powerful, maintaining a good social image. An afflicted Ketu brings spouse health issues and self-centeredness. Nita Ambani and the Dalai Lama were born with Ketu in the 1st house.",
  2: "Ketu in the 2nd house draws you to occult sciences, giving excellent communication. You can be harsh when things don't go your way. You earn good wealth and high workplace respect. A well-placed Ketu brings career growth and wisdom. An afflicted Ketu makes you rude, harming your social image, and causes family issues. Princess Diana and Rajinikanth were born with Ketu in the 2nd house.",
  3: "Ketu in the 3rd house makes you hardworking, brave, and adventurous. Spiritual activities bring peace, and you may marry someone from another religion. A well-placed Ketu brings high career status and media-related opportunities. An afflicted Ketu causes child-related and marital challenges. Kim Jong-un and Richard Wilson were born with Ketu in the 3rd house.",
  4: "Ketu in the 4th house drives you to a spiritual lifestyle. It provides wealth and comforts even if you prefer simplicity. A favorable Ketu brings unexpected gains and a respected social image. An afflicted Ketu causes career and family pressure, distancing you from family. Rahul Dravid and Amit Shah were born with Ketu in the 4th house.",
  5: "Ketu in the 5th house inclines you toward philosophy and occult sciences. You get drawn to religious activities. As you age, you may detach from family. A well-placed Ketu brings luck, speculative gains, and protection from enemies. An afflicted Ketu distances you from friends and causes child-related issues. Katrina Kaif and Baba Ramdev were born with Ketu in the 5th house.",
  6: "Ketu in the 6th house makes you highly motivational and physically strong, helping you defeat enemies. However, it can bring painful illnesses. A positive Ketu brings spiritual wisdom visible in your speech. An afflicted Ketu causes workplace accidents or injuries, and aggression. Isaac Newton and Marilyn Monroe were born with Ketu in the 6th house.",
  7: "Ketu in the 7th house brings spiritual inclination and transforms your life. You enjoy good prosperity and a happy life. A well-placed Ketu ensures a peaceful life.",
  8: "Ketu in the 8th house leads you to occult sciences and research, giving deep interest in mysterious subjects.",
  9: "Ketu in the 9th house sparks interest in religious and spiritual journeys, motivating you toward higher wisdom.",
  10: "Ketu in the 10th house can bring career fluctuations but ultimately gives spiritual success and mental peace.",
  11: "Ketu in the 11th house brings sudden gains and support from spiritual friends, fulfilling your desires.",
  12: "Ketu in the 12th house is excellent for moksha and spiritual awakening, freeing you from worldly bonds.",
};

export const SATURN_HOUSE_INTERPRETATIONS = {
  1: "Saturn in the 1st house makes you disciplined and mature at a young age. You are responsible and reliable, and can excel as a lawyer or judge. Marriage is delayed, but your spouse is wise and loyal. A favorable Saturn brings a practical approach and duty toward parents. An afflicted Saturn makes you lazy or depressed, causing marital discord. Britney Spears and Akbar were born with Saturn in the 1st house.",
  2: "Saturn in the 2nd house supports finances after the age of 35, though it may limit early childhood comforts. Life's ups and downs make you wise and practical. A well-placed Saturn makes you ambitious and hardworking, preventing hasty financial decisions. An afflicted Saturn deprives you of parental warmth due to strictness, causing career frustration. Rajinikanth and Mukesh Ambani were born with Saturn in the 2nd house.",
  3: "Saturn in the 3rd house brings mixed relations with siblings and makes focusing difficult. It makes you shy and introverted, favoring arranged marriage. A well-placed Saturn gives a professional attitude, keeping you calm and a good listener. An afflicted Saturn brings negative thinking and unnecessary fears. Steve Jobs and Brad Pitt were born with Saturn in the 3rd house.",
  4: "Saturn in the 4th house indicates a strict mother, but grants good education, leading to careers in real estate, law, or industry. A well-placed Saturn brings unexpected gains and mature responsibility, maintaining family harmony. An afflicted Saturn makes you self-centered or depressed, causing property losses or spouse separation. Tom Cruise and Barack Obama were born with Saturn in the 4th house.",
  5: "Saturn in the 5th house brings discipline and maturity from childhood, making you prefer meaningful discussions with elders. A positive Saturn teaches work-life balance and charity. An afflicted Saturn makes you unsocial or depressed, hindering progress and causing psychological issues. Bill Gates and Winston Churchill were born with Saturn in the 5th house.",
  6: "Saturn in the 6th house makes you hardworking and determined to resolve conflicts, leading to success as a counselor, doctor, lawyer, or judge. It can delay success and favor settling abroad. A well-placed Saturn brings excellent management skills. An afflicted Saturn causes chronic back pain and harsh speech. Isaac Newton and Deepika Padukone were born with Saturn in the 6th house.",
  7: "Saturn in the 7th house delays marriage; early marriage leads to hurdles. You marry a mature, responsible, and older spouse. A well-placed Saturn keeps you dedicated, disciplined, and work-oriented. An afflicted Saturn causes marital misunderstandings, laziness, and joint pains. Johnny Depp and Shah Rukh Khan were born with Saturn in the 7th house.",
  8: "Saturn in the 8th house brings major life transformations, testing your faith. You can succeed as a healer or in politics. A well-placed Saturn brings inheritance, research excellence, and good relations with in-laws. An afflicted Saturn brings career frustration, spouse betrayal, and discord with in-laws. Kristen Stewart and Robert Downey Jr. were born with Saturn in the 8th house.",
  9: "Saturn in the 9th house makes you philosophical and religious, keeping you focused on higher education or law. A well-placed Saturn keeps you loyal, affectionate, and wealthy. An afflicted Saturn makes you rigid, causing poor sibling relations. Julia Roberts and Rihanna were born with Saturn in the 9th house.",
  10: "Saturn in the 10th house helps achieve goals through hard work, bringing authority and recognition. A favorable Saturn brings patience and steady growth, making you highly disciplined after 35. An afflicted Saturn can tempt you toward illegal activities, harming marital interest. Leonardo DiCaprio and Muhammad Ali were born with Saturn in the 10th house.",
  11: "Saturn in the 11th house fills your social circle with mature people. Hard work fulfills your desires, making you a successful politician or businessman. A well-placed Saturn brings wealth, power, and respect. An afflicted Saturn associates you with bad company and causes joint issues. Kim Kardashian and Anil Kapoor were born with Saturn in the 11th house.",
  12: "Saturn in the 12th house disturbs peace of mind, driving you toward spiritual search and charity. It brings financial gains from abroad. A favorable Saturn brings spouse support and delayed but sure success. An afflicted Saturn hinders stable relationships, causing anxiety and depression.",
};


const CELL_CONTENTS = [

  { id: "d1", label: "D1 - Rashi Chart", category: "Charts" },
  { id: "d2", label: "D2 - Hora Chart", category: "Charts" },
  { id: "d3", label: "D3 - Drekkana Chart", category: "Charts" },
  { id: "d4", label: "D4 - Chaturthamsha", category: "Charts" },
  { id: "d5", label: "D5 - Panchamsha Chart", category: "Charts" },
  { id: "d6", label: "D6 - Shashtamsha Chart", category: "Charts" },
  { id: "d7", label: "D7 - Saptamsha Chart", category: "Charts" },
  { id: "d8", label: "D8 - Ashtamsha Chart", category: "Charts" },
  { id: "d9", label: "D9 - Navamsha Chart", category: "Charts" },
  { id: "d10", label: "D10 - Dashamsha Chart", category: "Charts" },
  { id: "d11", label: "D11 - Rudramsha Chart", category: "Charts" },
  { id: "d12", label: "D12 - Dwadashamsha", category: "Charts" },
  { id: "d16", label: "D16 - Shodashamsha", category: "Charts" },
  { id: "d20", label: "D20 - Vimsamsa Chart", category: "Charts" },
  { id: "d24", label: "D24 - Chaturvimshamsha", category: "Charts" },
  { id: "d27", label: "D27 - Bhamsa Chart", category: "Charts" },
  { id: "d30", label: "D30 - Trimshamsha", category: "Charts" },
  { id: "d40", label: "D40 - Khavedamsa Chart", category: "Charts" },
  { id: "d45", label: "D45 - Akshavedamsa", category: "Charts" },
  { id: "d60", label: "D60 - Shashtiamsha", category: "Charts" },
  { id: "advanced_nakshatra", label: "ADV. Nakshatra", category: "Misc" },
  { id: "shadbala", label: "Shadbala Chart", category: "Charts" },
  { id: "vimshottari", label: "Vimshottari", category: "Dasha" },
  { id: "vimsopaka", label: "Vimsopaka Bala", category: "Tables" },
  { id: "bhavbala", label: "Bhavbala", category: "Tables" },
  { id: "shodashvarga_summary", label: "Shodashvarga Summary", category: "Tables" },
  { id: "relationships", label: "Relationships", category: "Misc" },
  { id: "planets_table", label: "Pl-Tables", category: "Tables" },
  { id: "shodashottari", label: "Shodashottari", category: "Dasha" },
  { id: "chaturshitisama", label: "Chaturshitisama", category: "Dasha" },
  { id: "ashtottari", label: "Ashtottari", category: "Dasha" },
  { id: "dwisaptatisama", label: "Dwisaptatisama", category: "Dasha" },
  { id: "dwadashottari", label: "Dwadashottari", category: "Dasha" },
  { id: "panchottari", label: "Panchottari", category: "Dasha" },
  { id: "shatabdika", label: "Shatabdika", category: "Dasha" },
  { id: "shashtihayani", label: "Shashtihayani", category: "Dasha" },
  { id: "chara", label: "Chara Dasha", category: "Dasha" },
  { id: "sthira", label: "Sthira Dasha", category: "Dasha" },
  { id: "shoola", label: "Shoola Dasha", category: "Dasha" },
  { id: "niryaana_shoola", label: "Niryana Shoola", category: "Dasha" },
  { id: "mandooka", label: "Mandooka Dasha", category: "Dasha" },
  { id: "drig", label: "Drig Dasha", category: "Dasha" },
  { id: "sudasha", label: "Sudasha", category: "Dasha" },
  { id: "panchang", label: "Panchang", category: "Tables" },
  { id: "dignity", label: "Dignity", category: "Tables" },
  { id: "numerical", label: "Numerology", category: "Misc" },
  { id: "ashtakavarga", label: "Ashtakavarga", category: "Charts" },
  { id: "ashtakavarga_reduction", label: "Asthakavarga Reduction", category: "Charts" },
  { id: "krishnamurthy_chart", label: "Krishana Murthy Chart", category: "Charts" },
  { id: "krishnamurthy_significators", label: "KP Significators", category: "Tables" },
  { id: "aspects_summary", label: "Aspects Summary", category: "Tables" },
  { id: "gemstones", label: "Ratna", category: "Misc" },
  { id: "transit_gemstones", label: "Gochar Ratna", category: "Misc" },
  { id: "panch_pakshi", label: "Panch Pakshi", category: "Misc" },
  { id: "kp", label: "Krishnamurti Chart", category: "Misc" },
  { id: "empty", label: "Empty Cell", category: "System" }
];


const calculatePlanetEffects = (data) => {
  const effects = {};
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  let lagnaSignIndex = 0;
  const lagnaHouse = data?.charts?.houses?.[1] || data?.charts?.houses?.["1"];
  if (lagnaHouse) {
    lagnaSignIndex = lagnaHouse.sign_index !== undefined ? lagnaHouse.sign_index : Math.floor(lagnaHouse.cusp_deg / 30);
  } else if (data?.charts?.ascendant_sign_index !== undefined) {
    lagnaSignIndex = data.charts.ascendant_sign_index;
  }

  const lagnaMap = {
    0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
    1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
    2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
    3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
    4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
    5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
    6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
    7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
    8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
    9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
    10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
    11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
  };
  const lagnaData = lagnaMap[lagnaSignIndex] || { benefic: [], malefic: [] };

  planets.forEach(p => {
    if (p === "Rahu" || p === "Ketu") {
      effects[p] = "negative";
    } else if (lagnaData.benefic.includes(p)) {
      effects[p] = "positive";
    } else if (lagnaData.malefic.includes(p)) {
      effects[p] = "negative";
    } else {
      effects[p] = "neutral";
    }
  });

  effects["Ascendant"] = "neutral";
  return effects;
};

const NAVAMSA_INTRO = `Marriage can be the most essential part of ones life where there can be the most rewarding or sometimes challenging scenario. Whether you are dealing with marital issues or want to know your life’s changes after marriage, then Navamsa or D9 Chart is your one stop solution. In Vedic astrology, Navamsa chart gets deep into relationship ology and gives you clarity over how you should approach your marriage and want changes you will experience after marriage.

  D - 9 or Navamsa chart reveals strengths, karmic patterns and potential challenges that may not be visible in the birth chart or horoscope individually.This chart plays a crucial role in shaping your relationship, navigating challenges, and compatibility and personal growth through marriage.


This chart is basically used for relationship and marriage analysis, but it also gives an insight into career, fortune, professional life, and spiritual progress.Through this chart you can also come to know about your karma and past life connections.Each planet in Navamsa chart reveals your partner, and how you will experience your marriage and relationship on career front.`;

const NAVAMSA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Navamsa Chart",
    description: "Sun is a source of courage and strength and plays a vital role in maintaining your physical and mental health. It has an utmost good status as it shapes one’s wealth, life, and learning abilities. The status of Sun in Navamsa/D-9 chart gives you clarity over the strength of love with your spouse or partner. Strong Sun in D9 will give you courage to deal with challenges on relationship front and live a happy and successful life. The placement of the Sun in different houses shapes your career and relationship, based on its strengths and weakness.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Navamsa Chart",
    description: "Moon leads emotional sensitivity and psyche of an individual. When Moon is placed in Navamsa chart it clears your perspective of finding hope, love, and loyalty. Moon has a leading role in biological forces, which is also called Dosha in Ayurveda, and deals with our health. Moon controls the Kapha Dosha among the three biological forces/Dosha- Vata, Pitta, and Kapha. It gives the ability to maintain strong emotional health and makes you expressive in sharing your feelings. When the Moon is afflicted, it will cause health issues whereas a well-placed Moon in Navamsa/D9 Chart gives a stable mindset and a clear vision that leads towards success and growth. It has various effects on your life depending on its placement in different houses.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Navamsa Chart",
    description: "Mars rules competitiveness, confidence, effort, determination, flirty, romantic, security and a technical mindset. Mars in D9 chart ensures that you will find your ambition in life and feel motivated to do well on a personal and professional front. Strong Mars in Navamsa/D9 chart makes you capable of creating new and innovative ideas, and Master of Science and engineering work with a clear vision, leading towards success and growth. An afflicted Mars causes aggressiveness and creates challenges in your relationship. There are various effects and influences of Mars on you based on its placement in different houses in Navamsa chart.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Navamsa Chart",
    description: "Mercury makes you curious, analytical, friendly and talkative and when it is placed in Navamsa Chart, it will give you a personality that matches with your maternal family. Mercury has a crucial role in shaping your relationship and has a good command over your sense of humor. Mercury’s placement in divisional chart Navamsa clears your perspective to present yourself, building a good relationship on personal and professional front, and what should be your next move while dealing with tough situations. Afflicted Mercury in Navamsa chart causes major health issues like constipation, gas, and abdominal distension.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Navamsa Chart",
    description: "The placement of Jupiter in Navamsa Chart introduces you to a spouse who will help you make wise decisions, in gaining wealth. Your spouse will be supportive, and always give you hope in your low time. When Jupiter is afflicted or is low in strength, it will cause health issues like diabetes, edema, phlegm, or asthma as it plays a crucial role in biological forces, known as Dosha in Ayurveda. Strong Jupiter in D9 Chart will give you courage to deal with relationship challenges and make wise investment plans. The placement of Jupiter in different houses will influence your life in various ways.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Navamsa Chart",
    description: "Venus’s placement in Navamsa chart ensures that you will get suggestions and tips over your love, finance, marriage, and happiness. Venus makes you caring and emotional due to feminine energy and it will help you protect your married life by implementing and putting in creative efforts. Venus will bless you with a spouse with attractive eyes, charismatic look, and an attractive personality when it is well-placed. Afflicted Venus in D9 chart will cause health concerns like weak eyesight, dull skin, and detachment from sexual activity in married life. There are various effects and influences of Venus on a person’s life, depending on its placement in different houses.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Navamsa Chart",
    description: "Saturn indicates long-term commitment, compromise and a realistic approach to one’s relationship and other aspects of life. Saturn in D9 chart will give you a supportive spouse for your career. It will also bless you with inheritance gains after marriage. Strong Saturn will make you patient, approachable, and saves you from chronic health concerns. On the opposite side, an afflicted Saturn in the D9 chart will cause health issues like acidity, constipation and abdominal distension. Apart from this, there are some ups and downs Saturn creates when it is placed in different houses in Navamsa chart.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Navamsa Chart",
    description: "The combination of Rahu and Navamsa chart rewards you with fulfillment of desires, and manifest dreams and imagination of your spouse. Rahu will make you wealthy after marriage and it will also reveal the honesty and commitment of your partner in the relationship. Rahu affliction in D9 chart will cause health concerns and create diseases that may not be easily diagnosed, and inherited health problems. In addition, Ketu influences your life based on its placement in 12 different houses in D9 chart.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Navamsa Chart",
    description: "Ketu will give you a personality and is expert in observing the surroundings with a strong sense of intuition. It will make you capable of making correct decisions at the right time. Ketu in Navamsa will make you expert in guessing the right thing, good at research field, and quick to make decisions. There will be a lot of challenges and issues due to the placement of Ketu which will make you detached, unable to express your feelings to others, and which will be a reason of challenge in married life or relationship. There might be some health concerns due to the afflicted Ketu in Navamsa chart like sensitivity to cold, acidity, and dryness to skin. Ketu’s placement in different houses will have various impacts and influences on an individual’s life.",
    icon: "💥",
    color: "orange"
  }
};

const DASHAMSHA_INTRO = `The Dashamsha (D10) chart is the ultimate engine for Professional Career Karma and Success analysis. Our system uses the authentic "Iyer Method" (Seshadri Iyer style) where counting for even signs starts from the 9th house, providing high-precision Parashari results. 

Dashamsha reveals not just your job title, but your authority, reputation, and professional destiny. Whether you are built for Corporate Leadership (Job) or Entrepreneurship (Business), D10 uncovers the "Natal Promise" that transits and dashas then activate.`;

const DASHAMSHA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in D10: Authority & Rank",
    description: "Sun in D10 represents your 'Professional Identity' and recognition. A strong Sun suggests leadership roles, government connections, and the ability to command respect. It indicates whether you possess the executive aura required for high-level management or administrative authority.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in D10: Emotional Growth",
    description: "The Moon reveals your 'Workplace Intelligence' and mental satisfaction in your career. It shows how you adapt to professional changes and your relationship with colleagues. A well-placed Moon indicates a profession involving public care, hospitality, or creative visualization.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in D10: Professional Drive",
    description: "Mars is the engine of 'Professional Ambition'. It shows your competitive spirit and ability to handle high-pressure environments. In D10, Mars indicates technical skills, engineering potential, and the courage to take independent initiatives in business.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in D10: Business Acumen",
    description: "Mercury governs your 'Professional Strategy' and communication skills. It reveals your aptitude for business, trade, and technology. A strong Mercury in Dashamsha is the hallmark of a successful entrepreneur or a high-performing consultant.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in D10: Professional Wisdom",
    description: "Jupiter represents 'Career Growth' and guidance. It reveals whether you will have supportive mentors and if your career will expand through righteous means. It indicates success in teaching, advisory roles, and large-scale corporate expansion.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in D10: Creative Luxury",
    description: "Venus governs 'Professional Status' and creative industries. It reveals your ability to manage luxury, design, and high-end sectors. A benefic Venus indicates a career that brings not just money, but prestige and artistic satisfaction.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in D10: Discipline & Duty",
    description: "Saturn is the 'Karaka of Profession'. It reveals the amount of hard work and persistence required for success. It indicates long-term stability and whether you will achieve authority through patient climbing of the professional ladder.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in D10: Unconventional Success",
    description: "Rahu indicates 'Sudden Gains' and foreign professional connections. It shows the ability to think out of the box and dominate unconventional or modern industries. It represents an intense drive for professional influence.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in D10: Spiritual Mastery",
    description: "Ketu indicates 'Intuitive Excellence' and detachment in work. It often reveals hidden skills or the ability to work in research and spiritual fields. Ketu encourages mastering one's craft through quiet, deep focus.",
    icon: "💥",
    color: "orange"
  },
  Ascendant: {
    title: "D10 Lagna: Professional Soul",
    description: "The D10 Ascendant (Lagna) represents your innate professional orientation. It defines the environment where you feel most natural and effective. A strong D10 Lagna indicates a clear sense of career direction and the foundational vitality required to sustain long-term professional growth and authority.",
    icon: "🧘",
    color: "indigo"
  }
};

const HORA_INTRO = `D2, also known as Hora Chart, provides clarity on financial matters, financial gains, property gains, and investment returns. It is used to analyze wealth strategies through concepts like Dhan Yoga, Indu Lagna (for wealth), and Shree Lagna (for assets, luxury, and happiness). This chart helps in deciding the timing of investments and defining how earnings are converted into assets.

In Vedic Astrology, the Hora chart is designed by dividing the zodiac into two parts. It primarily features three key houses:
- 1st House: Represents self-awareness regarding finances.
- 2nd House: Represents savings and accumulated wealth.
- 12th House: Indicates losses or long-term investments.

The Hora chart clarifies whether your income will rise, if you will achieve expected growth in investments, and whether you will enjoy inherited wealth or face financial challenges. Each planet linked with the D2 chart indicates a specific influence on your financial status.`;

const HORA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in D2 Hora Chart",
    description: "Sun in Hora Chart gives you financial benefits through a disciplined approach towards savings. Clarity over investment plans will give you expected outcomes. Sun makes you capable of managing your finances with a persistent approach. You will get major shifts in your finances and achieve financial status through your skills. Sun helps you overcome financial burden and make wise investment in property and government bonds. There will be financial gains in foreign shores, legal or medical work. You will have good gain from heritage properties, but make sure to manage your expenses.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in D2 Hora Chart",
    description: "Moon will give you an emotional bent towards your finances. You will earn money from government sectors and gain strength to manage your finances. By implementing creative and innovative ideas, you will make good wealth. You will get courage to overcome financial challenges and earn from jewels, medicine and food related areas. Moon in D2 chart will give you strength to make savings, expenses and investments in the right assets. Your powerful sense of intuition will help you make wise investments, boosting your finances.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in D2 Hora Chart",
    description: "Mars will give you inheritance benefits and make you motivated to earn from your hard work and efforts. Strong Mars in D2 chart will clear your perspective to take the right decisions. You will make a strong foundation for your wealth and gain strength for property investments. Mars in Hora Chart will give insight into making the right investment. Mars in D2 Chart will bless you with support and guidance from mother to make the right investment at the right time. It will reward you with financial gain far from your present place. Mars will give you benefits from maternal property and financial support from maternal family. It will give you a powerful sense of intuition to grab the right opportunity to overcome financial challenges.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in D2 Hora Chart",
    description: "You will make the right decisions on the professional front through the available information, knowledge, and references. Mercury will bless you with good knowledge and strategies that will help you attract good wealth, and your great communication skills will give you good friends and siblings who will help you in making the right investments. You will be more attentive towards minimizing your expenses and focus on savings. Mercury in Hora Chart/D2 Chart will give you a broader perspective of wealth and money management. However, afflicted Mercury in D2 chart, will create obstacles in building your assets and accumulating wealth. Whereas strong Mercury will bring you success in career, wealth, and business.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in D2 Hora Chart",
    description: "Jupiter makes you optimistic towards your finances, helping in building assets and a good financial standing. It will give you clarity in your opinions that will aid you in executing your plans even in worse circumstances. Jupiter in Hora Chart boosts your wealth and gives you financial growth. You can deal with challenges and financial risks and overcome the worse scenario with your courage and wisdom. Jupiter in D2 gives you the perspective to make a wise investment plan in long-term assets. Share market with securities and bonds related investments will give you expected return, boosting your income.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in D2 Hora Chart",
    description: "Through an active approach towards your finances, you will gain a good income and wealth. You will make wise decisions in partnership investment and create new sources of income. With Venus in D2 Chart, there will be good success on the professional front, related to cosmetics, food business, creativity, arts and crafts, and it will reward you with good income. Afflicted Venus will create challenges on relationship front and ego clashes with family, which will lead to financial crisis. However, Strong Venus will clear your perspective to look at the issue from a different angle and work upon it for a quick resolution. It will also bring support from elders, seniors or grandparents, helping you achieve financial stability in your life.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in D2 Hora Chart",
    description: "Saturn will give you the support of elders or seniors in the family and on the professional front. In D2 Chart, the placement of Saturn will make you disciplined in financial matters with a priority-based plan, relieving you from loan and debt. Saturn will also reward you with inheritance gain and gain from gold and property. Saturn in D2 Chart gives insight into financial challenges, like loss, loan or debt. This will bless you with maturity, patience, and a broader perspective to stabilize your finances and wealth. You will achieve success and gains in career related to NGO, Job, Yoga, religious work or meditation center.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in D2 Hora Chart",
    description: "Your ambition and disciplined approach towards financial management will reward you with savings and gaining of wealth as per the placement of Rahu in D2/Hora Chart. Strong Rahu in Hora chart will make you courageous to deal with the worse situation on the financial front and achieve success in it. You will see a sudden rise in your income that will boost your finances. Through creative ideas, blessed with Rahu, you will get expected success and growth. You will have a good sense of humor which will give you achievement on the professional front. This position will make you inclined towards religion and have a good command over multiple language.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in D2 Hora Chart",
    description: "Ketu will give you financial gain and make you wealthy in the second phase of your life. In the first phase, it will create ups and downs and make you mature while dealing with such situations. You will have the power and authority to lead the family, team, career, and business due to the placement of Ketu in D2 Chart. Your powerful sense of intuition will bless you with good financial gains with the right decisions. Through the guidance of your elders and family, you will manage your financial responsibilities in an effective way and will refrain from spending on a luxurious lifestyle.",
    icon: "💥",
    color: "orange"
  }
};

const D4_INTRO = `The D4 (Chaturthamsa) chart is the primary divisional chart for analyzing immovable property, residences, land, and overall happiness (Sukha). It reveals your property karma, potential for real estate success, and the emotional security derived from your home environment.

According to classical texts like Brihat Parashara Hora Shastra, while the birth chart (D1) shows the general potential for owning property, the D4 chart provides the granular detail regarding the quality, timing, and source of these assets. 

Key Houses in D4:
- 1st House: Your inherent approach to property and general fortune in real estate.
- 4th House: The primary indicator of residence, connection to land, and happiness from assets.
- 7th House: Property through partnerships, marriage, or joint business associations.
- 10th House: Commercial real estate, professional properties, and career-related assets.
- 11th House: Financial gains, rental income, and accumulation through real estate activity.`;

const D4_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Chaturthamsa (D4)",
    description: "The Sun relates to property through authority, government allocations, and inherited ancestral lands connected to the paternal lineage. Strong Sun placement indicates potential for acquiring property through official channels or government allotments. Challenged Sun placements often correlate with disputes over inherited property or complications involving government clearances.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Chaturthamsa (D4)",
    description: "The Moon governs your emotional connection to property and happiness from residences. As the natural 4th house significator, it is crucial in D4 analysis. Favorable Moon suggests a harmonious home environment and success with properties near water sources. Difficult placement may indicate frequent relocations or emotional attachments that create complications.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Chaturthamsa (D4)",
    description: "Mars is the 'Bhumi Karaka' (indicator of land) and strongly influences real estate. Well-placed Mars indicates success in property acquisition and the ability to handle construction projects. Challenged Mars warns of property disputes, construction delays, or boundary conflicts.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Chaturthamsa (D4)",
    description: "Mercury governs documentation, contracts, and property negotiations. Strong Mercury suggests clear paperwork and smooth legal processes in real estate dealings. Challenged Mercury warns of paperwork problems, contract disputes, or miscommunications during transactions.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Chaturthamsa (D4)",
    description: "Jupiter reveals overall fortune and expansion in property matters. Favorable placement blesses the native with legitimate gains, appreciating property values, and access to favorable financing. Weak Jupiter may indicate struggles with financing or properties that fail to grow in value over time.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Chaturthamsa (D4)",
    description: "Venus brings aesthetic consideration and luxury to property matters. It indicates beautiful homes, comfortable residences, and properties valued for their visual appeal and comfort. Luxury apartments and well-designed residences align with strong Venus influence.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Chaturthamsa (D4)",
    description: "Saturn indicates older properties, inherited ancestral homes, and matters involving delays. It often manifests as property that arrives later in life. Strong Saturn brings eventual success through patience and systematic development, while difficult placement warns of legal encumbrances or financial burdens.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Chaturthamsa (D4)",
    description: "Rahu indicates property acquired in foreign lands or unconventional residences. It encourages thinking 'out of the box' for property challenges. If afflicted, it can create sudden obstacles or illusions in real estate dealings, requiring honest effort and clarity.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Chaturthamsa (D4)",
    description: "Ketu provides a creative approach to property decisions but may lead to a detached or 'lazy' approach if not well-placed. It helps in learning from past experiences to achieve property growth, though it can sometimes indicate unexpected changes in residence.",
    icon: "💥",
    color: "orange"
  }
};

const D7_INTRO = `The D7 (Saptamsa) chart is the primary divisional chart for analyzing children (progeny), fertility, and the continuation of lineage. It reveals your "Santana Sukha" (happiness from children) and the specific karmic patterns involving your offspring.

According to classical texts like Saravali and Uttara Kalamrita, while the 5th house of the birth chart shows the potential for children, the D7 chart provides the detailed narrative of their well-being, character, and your emotional experience as a parent.

Key Houses in D7:
- 1st House: Overall approach to parenthood and innate fertility constitution.
- 5th House: The "house within the house"—directly influences fertility and children's lifelong well-being.
- 7th House: Partner's contribution to progeny and marital support for fertility.
- 9th House: Grandchildren and the long-term prosperity of your lineage.
- 11th House: Gains through children and the fulfillment they bring in later life.`;

const D7_PLANET_DESCRIPTIONS = {
  Jupiter: {
    title: "Jupiter in Saptamsa (D7)",
    description: "Jupiter is the 'Santana Karaka' (primary significator of children). Its strength in D7 determines whether parenthood feels like a blessing or a burden. Strong Jupiter indicates fertility blessings, wisdom, and dharmic fulfillment through offspring. Saravali notes that Jupiter's strength is the key to 'Santana Sukha' (happiness through children).",
    icon: "🟡",
    color: "amber"
  },
  Sun: {
    title: "Sun in Saptamsa (D7)",
    description: "The Sun relates particularly to firstborn children and sons. A well-placed Sun indicates offspring who achieve recognition, honor, and authority in society. Challenged Sun placement may suggest that the firstborn requires extra parental support or faces hurdles in achieving social status.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Saptamsa (D7)",
    description: "The Moon governs daughters and the emotional connection with all children. Favorable Moon indicates strong emotional bonds and children who are emotionally secure. Afflicted Moon may suggest emotional distance or daughters facing emotional challenges, as it affects how you *experience* parenthood.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Saptamsa (D7)",
    description: "Mars influences children's energy levels, courage, and competitive abilities. Well-placed Mars indicates active, brave offspring who succeed through their own initiative. Challenged Mars may suggest conflicts with children or offspring prone to accidents and impulsive behavior.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Saptamsa (D7)",
    description: "Mercury governs the intellectual development and communication of children. Favorable placement indicates clever, witty, and communicative offspring. It also suggests a logical and balanced approach to parenting, facilitating a better understanding between parent and child.",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Saptamsa (D7)",
    description: "Venus affects the pleasure derived from children and often influences daughters. Strong Venus indicates beautiful, graceful, and artistic children who bring joy to the family. It determines whether children bring pleasure and comfort or anxiety into your life.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Saptamsa (D7)",
    description: "Saturn indicates discipline, delays, and karmic lessons related to children. It may suggest fewer children but ones who develop strong character through persistent effort. Challenged Saturn often indicates fertility delays or parenting challenges requiring great maturity and patience.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Saptamsa (D7)",
    description: "Rahu creates unconventional progeny circumstances. It may indicate children through unusual means, foreign connections regarding offspring, or children with unconventional lifestyles. It brings intense desires but can also introduce complex karmic patterns.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Saptamsa (D7)",
    description: "Ketu indicates a spiritual or detached connection to progeny. It can suggest children with a spiritual bent of mind or periods of detachment from children matters. It encourages learning from past-life progeny karma to achieve maturity as a parent.",
    icon: "💥",
    color: "orange"
  }
};

const D12_INTRO = `The D12 (Dwadasamsa) chart is the primary divisional chart for analyzing parents, maternal and paternal lineages, and inherited ancestral karma. It reveals the foundational influences that shaped your early identity and the spiritual debts or blessings passed down through generations.

According to classical texts like Jataka Parijata and Brihat Parashara Hora Shastra, while the birth chart (D1) shows the general relationship with parents, the D12 chart provides deep insights into the character of your parents and the specific evolutionary direction of your family karma.

Key Houses in D12:
- 1st House: Overall family influence on your identity and core personality.
- 2nd House: Family values, collective resources, and inherited wealth.
- 4th House: The primary indicator of the mother, emotional security, and maternal lineage.
- 9th House: Paternal relationship, father's blessings, and dharmic values from the paternal side.
- 10th House: Family reputation, social standing, and how parental legacy affects your public path.
- 12th House: Hidden family patterns, ancestral debts, and spiritual inheritance requiring resolution.`;

const D12_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Dwadasamsa (D12)",
    description: "The Sun represents the father and paternal lineage. A strong Sun indicates a positive relationship with the father, inherited leadership qualities, and blessings from the paternal side. A challenged Sun may suggest difficulties with the father, absence of guidance, or paternal karmic burdens requiring conscious healing.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Dwadasamsa (D12)",
    description: "The Moon governs the mother and maternal inheritance. Well-placed Moon indicates a nurturing relationship and emotional support from the maternal lineage. A difficult Moon placement may suggest relationship challenges or emotional patterns inherited from the mother's side that require transformation.",
    icon: "🌙",
    color: "blue"
  },
  Jupiter: {
    title: "Jupiter in Dwadasamsa (D12)",
    description: "Jupiter reveals the wisdom and moral guidance inherited from parents. Strong Jupiter indicates parents who provide genuine direction and families with strong dharmic traditions. Challenged Jupiter may indicate a lack of parental guidance or ancestral patterns disconnected from spiritual foundations.",
    icon: "🟡",
    color: "amber"
  },
  Saturn: {
    title: "Saturn in Dwadasamsa (D12)",
    description: "Saturn reveals karmic debts and serious family responsibilities. It indicates genuine obligations, such as caring for aging parents or managing family properties. Its challenges in D12 often become the crucible for profound family healing and the fulfillment of ancestral commitments.",
    icon: "⏳",
    color: "slate"
  },
  Mars: {
    title: "Mars in Dwadasamsa (D12)",
    description: "Mars indicates assertive family dynamics or inheritance of courage and determination. Strong Mars shows protective parental energy. Challenged Mars suggests arguments, discord in parental relationships, or inheritance of anger patterns requiring conscious transformation.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Dwadasamsa (D12)",
    description: "Mercury relates to communication patterns with parents and intellectual inheritance. Strong Mercury indicates good dialogue and inherited intelligence. Challenged Mercury may indicate family secrets, miscommunication, or intellectual patterns that require refinement.",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Dwadasamsa (D12)",
    description: "Venus indicates comfort, harmony, and material inheritance (wealth/property) in family life. Strong Venus suggests a loving environment and aesthetic sensitivity passed down from parents. Weak Venus may indicate family discord or limited affection during upbringing.",
    icon: "💖",
    color: "pink"
  },
  Rahu: {
    title: "Rahu in Dwadasamsa (D12)",
    description: "Rahu indicates unfulfilled ancestral ambitions and new directions the family seeks through you. It reveals evolutionary possibilities and the drive to break old family patterns to establish new directions.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Dwadasamsa (D12)",
    description: "Ketu shows what the family lineage has already mastered through previous generations—ancestral achievements, talents, and karmic completions. It represents the spiritual dimension and spiritual wealth of your inheritance.",
    icon: "💥",
    color: "orange"
  }
};

const D16_INTRO = `The D16 (Shodashamsa) chart is the specialized divisional chart for analyzing vehicles (conveyances), luxuries, and overall material comforts (Sukha). It reveals your "transportation karma" and the specific quality of life derived from material possessions.

According to classical texts like Saravali and Brihat Jataka, while the 4th house of the birth chart shows the general potential for comforts, the D16 chart provides precise details about vehicle ownership, mechanical success, and the emotional satisfaction derived from material assets.

Key Houses in D16:
- 1st House: Overall relationship with vehicles and general approach to material comforts.
- 4th House: The primary indicator of vehicle quality, ownership probability, and happiness from transportation.
- 6th House: Vehicle-related problems—repairs, mechanical failures, and potential risks.
- 11th House: Financial gains through vehicles or the capacity for high-end acquisitions.
- 12th House: Expenses, losses, or drains related to vehicles and luxury maintenance.`;

const D16_PLANET_DESCRIPTIONS = {
  Venus: {
    title: "Venus in Shodashamsa (D16)",
    description: "Venus is the 'Vahana Karaka' (natural significator of vehicles and luxuries). Its strength in D16 is the foundation for material pleasure. Strong Venus indicates success with high-end vehicles and the potential for a lifestyle of comfort. Challenged Venus may suggest an inability to fully enjoy luxuries despite possession.",
    icon: "💖",
    color: "pink"
  },
  Mars: {
    title: "Mars in Shodashamsa (D16)",
    description: "Mars governs the mechanical and engineering aspects of transportation. Well-placed Mars indicates success with machinery, engineering, and the physical skill of driving. Challenged Mars warns of mechanical issues, accident risks, or conflicts involving vehicles that require vigilance.",
    icon: "🔴",
    color: "red"
  },
  Moon: {
    title: "Moon in Shodashamsa (D16)",
    description: "The Moon governs emotional satisfaction from possessions. It determines the actual enjoyment of vehicles rather than mere ownership. Strong Moon brings genuine happiness from your assets, while a weak Moon may lead to persistent dissatisfaction regardless of the quality of the vehicle.",
    icon: "🌙",
    color: "blue"
  },
  Jupiter: {
    title: "Jupiter in Shodashamsa (D16)",
    description: "Jupiter influences vehicles through expansion and high quality. Favorable Jupiter suggests spacious, premium, or high-capacity vehicles and expanding ownership over time. It provides good judgment in vehicle decisions and generally supports material prosperity when strong.",
    icon: "🟡",
    color: "amber"
  },
  Saturn: {
    title: "Saturn in Shodashamsa (D16)",
    description: "Saturn indicates practical, durable vehicles and potentially older or inherited conveyances. It favors longevity and function over form. Challenged Saturn may cause delays in ownership, vehicle-related burdens, or the need for sustained effort to acquire transportation.",
    icon: "⏳",
    color: "slate"
  },
  Mercury: {
    title: "Mercury in Shodashamsa (D16)",
    description: "Mercury points toward versatile, efficient, and technologically advanced vehicles. It favors smart designs, good fuel economy, and vehicles that serve multiple practical purposes. Strong Mercury suggests success in negotiations and thorough research during acquisitions.",
    icon: "🟢",
    color: "emerald"
  },
  Sun: {
    title: "Sun in Shodashamsa (D16)",
    description: "The Sun represents authority and status derived from vehicles. It indicates vehicles that carry a sense of power or are connected to official status and government. A strong Sun suggests the use of high-status transportation as a reflection of one's social standing.",
    icon: "☀️",
    color: "orange"
  },
  Rahu: {
    title: "Rahu in Shodashamsa (D16)",
    description: "Rahu often leads to unconventional vehicle choices or the desire for high-tech, futuristic transportation. It can bring sudden acquisitions but may also lead to hidden mechanical problems or unusual legal circumstances regarding material comforts.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Shodashamsa (D16)",
    description: "Ketu indicates a detached approach to material comforts or the use of vehicles for spiritual/secluded travels. It may lead to unexpected changes in vehicle ownership or a preference for simple, understated transportation despite the capacity for luxury.",
    icon: "💥",
    color: "orange"
  }
};

const D24_INTRO = `The D24 (Siddhamsa or Chaturvimshamsa) chart is the specialized divisional chart for analyzing education, learning, higher knowledge, and intellectual accomplishments. It reveals your academic path, deep wisdom, and specialized skills.

In Vedic astrology, while the 4th house shows basic schooling and the 5th house shows intelligence, the D24 chart provides the complete picture of your lifelong learning journey and the specific fields where you will achieve mastery.

Key Houses in D24:
- 4th House: Formal early education, school environment, and academic foundation.
- 5th House: Higher intelligence, learning capacity, and success in examinations.
- 9th House: University education, higher learning, and wisdom from teachers/Gurus.
- 10th House: Application of knowledge and professional training.
- 1st House: Overall aptitude for learning and intellectual identity.`;

const D24_PLANET_DESCRIPTIONS = {
  Mercury: {
    title: "Mercury in Siddhamsa (D24)",
    description: "Mercury is the natural significator of learning and logical skills. Its D24 position determines your capacity for communication-based education, including mathematics, writing, languages, and business. Strong Mercury grants quick learning and effective academic skill.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Siddhamsa (D24)",
    description: "Jupiter is the significator of higher wisdom and traditional learning. It governs advanced degrees, philosophical depth, and advisory fields. Strong Jupiter indicates success in law, religion, philosophy, and receiving profound guidance from enlightened teachers.",
    icon: "🟡",
    color: "amber"
  },
  Sun: {
    title: "Sun in Siddhamsa (D24)",
    description: "The Sun represents intellectual confidence and leadership in learning. It governs government training, executive education, and the capacity for original contribution. A strong Sun suggests someone who achieves recognition through their specialized knowledge.",
    icon: "☀️",
    color: "orange"
  },
  Mars: {
    title: "Mars in Siddhamsa (D24)",
    description: "Mars indicates technical and action-oriented learning. It favors success in engineering, medicine (especially surgery), military training, and sports sciences. It provides the drive and focus needed for intensive technical studies.",
    icon: "🔴",
    color: "red"
  },
  Venus: {
    title: "Venus in Siddhamsa (D24)",
    description: "Venus influences learning in the arts, aesthetics, and design. It favors success in music, fine arts, architecture, and luxury-related education. It indicates that your learning process will be driven by a love for beauty and harmony.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Siddhamsa (D24)",
    description: "Saturn indicates traditional, disciplined, and long-form research. It favors classical studies, history, and structured academic work that requires great patience. Strong Saturn grants the ability to achieve mastery through persistent, long-term effort.",
    icon: "⏳",
    color: "slate"
  },
  Moon: {
    title: "Moon in Siddhamsa (D24)",
    description: "The Moon governs the emotional aptitude for learning and psychological depth. It influences success in humanities, nursing, psychology, and fields requiring deep empathy. A well-placed Moon indicates a mind that is receptive and intuitive in its learning process.",
    icon: "🌙",
    color: "blue"
  },
  Rahu: {
    title: "Rahu in Siddhamsa (D24)",
    description: "Rahu creates interest in unconventional or foreign knowledge systems. It favors success in modern technology, electronics, foreign languages, and research into mysterious or hidden subjects. It can lead to sudden intellectual breakthroughs.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Siddhamsa (D24)",
    description: "Ketu indicates a spiritual or intuitive approach to knowledge. It favors mastery in metaphysics, occult sciences, and deep meditation-based wisdom. It can sometimes indicate detachment from formal academic structures in favor of self-taught spiritual mastery.",
    icon: "💥",
    color: "orange"
  }
};

const D30_INTRO = `The D30 (Trimshamsa) chart is the specialized divisional chart for analyzing misfortunes, health risks, hidden vulnerabilities, and the capacity for resilience. It reveals the "karmic friction" and the specific challenges that may arise throughout life.


In Vedic astrology, the D30 is crucial for determining the source of obstacles and the strength of your "karmic cushion" against adversity. It is used to identify vulnerabilities to illness (Roga), conflicts, and transformative crises.

Key Houses in D30:
- 1st House: Overall resilience, constitution, and inherent capacity to recover from adversity.
- 6th House: Health problems, enemies, obstacles, and workplace conflicts.
- 8th House: Sudden changes, profound transformations, chronic illness, and deep crises.
- 12th House: Losses, isolation, self-undoing patterns, and hidden enemies.
- 4th House: Domestic peace, property disputes, and emotional disturbances affecting inner stability.
- 7th House: Relationship misfortunes, legal troubles, and conflicts with others.`;

const D30_PLANET_DESCRIPTIONS = {
  Mars: {
    title: "Mars in Trimshamsa (D30)",
    description: "Mars relates to misfortunes through aggression, accidents, and acute crises. A strong D30 Mars allows you to handle crises with courage. However, a challenged Mars suggests vulnerability to injuries, surgical interventions, or aggressive confrontations that can be overwhelming.",
    icon: "🔴",
    color: "red"
  },
  Saturn: {
    title: "Saturn in Trimshamsa (D30)",
    description: "Saturn governs misfortunes through delay, chronic illness, and restriction. It reveals long-term, grinding difficulties. Strong Saturn grants remarkable resilience through hardship, while an afflicted Saturn suggests overwhelming burdens or prolonged health issues requiring sustained endurance.",
    icon: "⏳",
    color: "slate"
  },
  Jupiter: {
    title: "Jupiter in Trimshamsa (D30)",
    description: "Jupiter reveals the level of divine protection and grace against misfortune. It acts as the 'great protector.' Strong Jupiter provides a 'karmic cushion' so that difficulties never fully overwhelm you. Weak Jupiter indicates reduced protective grace and greater exposure to adversity.",
    icon: "🟡",
    color: "amber"
  },
  Mercury: {
    title: "Mercury in Trimshamsa (D30)",
    description: "Mercury relates to misfortunes through communication, mental health, and business dealings. Challenged Mercury suggests vulnerability to fraud, nervous disorders, or losses through miscommunication. It also points to intellectual faults or documentation errors (Buddhi Dosha).",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Trimshamsa (D30)",
    description: "Venus governs misfortunes in relationships, reproductive health, and excessive pleasure-seeking. Challenged Venus indicates relationship tragedies or health vulnerabilities in Venus-governed body areas. Classical texts associate its affliction with 'Kama Dosha' (desire-related faults).",
    icon: "💖",
    color: "pink"
  },
  Moon: {
    title: "Moon in Trimshamsa (D30)",
    description: "The Moon's condition determines your mental resilience during difficult times. Afflicted Moon suggests deep emotional vulnerability when misfortunes occur. A strong Moon provides the psychological stability needed to navigate challenges without being emotionally overwhelmed.",
    icon: "🌙",
    color: "blue"
  },
  Sun: {
    title: "Sun in Trimshamsa (D30)",
    description: "The Sun represents your vitality and the strength of your physical ego against crises. While not a primary ruler of Trimshamsa divisions, its strength indicates how well your core identity survives through misfortune and whether you retain your 'inner light' during dark periods.",
    icon: "☀️",
    color: "orange"
  },
  Rahu: {
    title: "Rahu in Trimshamsa (D30)",
    description: "Rahu indicates unusual or unconventional misfortunes and obsessive patterns. It often reveals where unexpected difficulties arise, potentially through foreign connections or sudden illusions. It represents intense karma that can be difficult to predict.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Trimshamsa (D30)",
    description: "Ketu indicates losses through neglect, spiritual crises, or detachment-related problems. It represents past-life karma manifesting as sudden separations or a sense of isolation. It encourages using misfortune as a path toward spiritual detachment and maturity.",
    icon: "💥",
    color: "orange"
  }
};

const D20_INTRO = `The D-20 (Vimsamsa) chart is the primary divisional chart for spiritual growth, religious inclinations, and meditative practices. It reveals the native's spiritual maturity and the path of their soul towards enlightenment and divine connection. It is used to assess the native's devotion, religious merit (Punya), and the success of their spiritual endeavors.`;
const D27_INTRO = `The D-27 (Bhamsa or Nakshatramsha) chart represents the strength and weaknesses of the native's inner nature and physical constitution. It provides a detailed view of the native's inherent vitality and the overall strength of their planetary signatures. Classical texts recommend analyzing D-27 to understand the soul's power and its ability to withstand life's pressures.`;
const D40_INTRO = `The D-40 (Khavedamsa) chart is used to analyze the auspicious and inauspicious results in the native's life, specifically relating to the maternal lineage and general prosperity. It uncovers deeper layers of karmic fruits that manifest as sudden luck or misfortune, tracing back to the virtues of the maternal side.`;
const D45_INTRO = `The D-45 (Akshavedamsa) chart provides a comprehensive look at the native's character, conduct, and all-around prosperity, with a focus on paternal lineage. It is one of the most refined divisional charts for assessing the overall quality of a person's life and destiny, revealing the blessings inherited from ancestors.`;

const D60_INTRO = `The D60 (Shashtiamsa) chart is the deepest and most profound divisional chart in Vedic astrology. It reveals the accumulated past-life karma that forms the foundation of your current incarnation. Sage Parashara gives D60 the highest weight among all divisional charts because it explains the "why" behind your birth blueprint.

According to classical texts like Saravali and Jataka Parijata, D60 reveals the hidden roots of persistent life patterns that resist change. It is the final word in determining whether a planet's promise in the birth chart will fully manifest or face deep-seated karmic resistance.

Key Applications of D60:
- Past-Life Karma: The specific actions from previous lives that influence current identity, health, and fortune.
- Persistent Patterns: Explains recurring relationship, career, or financial struggles that defy logical solutions.
- Chart Hierarchy: Provides the foundational layer that supports or restricts the potential seen in D1, D9, and D10.
- Spiritual Potential: Reveals the accumulated spiritual credit and the obstacles to current dharmic growth.`;

const D60_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Shashtiamsa (D60)",
    description: "The Sun's D60 position reveals karma related to ego, authority, and father relationships from past lives. Benefic placement suggests past-life righteous leadership that blesses your current identity. Challenging placement indicates past-life ego issues or misuse of authority requiring resolution through humility.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Shashtiamsa (D60)",
    description: "The Moon in D60 shows emotional and mental karma from previous incarnations. A benefic division indicates past-life emotional intelligence and nurturing that supports current mental peace. Challenging placement may reveal past-life emotional manipulation or failures in providing support.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Shashtiamsa (D60)",
    description: "Mars reveals karma related to action, courage, and the use of power. Benefic placement suggests past-life protection of the innocent or righteous battle. Challenging placement may indicate past-life aggression or violence now manifesting as current conflicts or accident-prone tendencies.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Shashtiamsa (D60)",
    description: "Mercury shows intellectual and communication karma. Benefic placement indicates past-life honest communication and beneficial use of intelligence. Challenging placement points to past-life deception or misuse of intellectual gifts, often tracing to current learning or communication difficulties.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Shashtiamsa (D60)",
    description: "Jupiter indicates spiritual merit, wisdom accumulation, and teacher relationships from past lives. Benefic placement suggests accumulated credit from devotion and teaching. Challenging placement may indicate past-life religious hypocrisy or corruption of wisdom traditions requiring rectification.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Shashtiamsa (D60)",
    description: "Venus reveals relationship and pleasure karma from previous incarnations. Benefic placement supports harmonious current relationships. Challenging placement may indicate past-life betrayal or excessive indulgence at others' expense, explaining persistent relationship hurdles.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Shashtiamsa (D60)",
    description: "Saturn's D60 position shows karma related to duty, service, and endurance. Benefic placement suggests past-life diligent service and patient endurance. Challenging placement may indicate past-life cruelty or neglect of duty now creating current obligations or restrictions.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Shashtiamsa (D60)",
    description: "Rahu's D60 position reveals the quality of past-life desires and obsessions that still pull on your consciousness. It indicates unconventional karmic directions and the evolutionary pressure to resolve intense past-life desires.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Shashtiamsa (D60)",
    description: "Ketu's placement reveals the genuineness of past-life spiritual renunciation. It shows what was truly transcended versus what was merely abandoned through escapism, guiding your current-life path toward genuine spiritual liberation.",
    icon: "💥",
    color: "orange"
  }
};

const DREKKANA_INTRO = `Drekkana or D3 Chart is the harmonic division of a sign into three parts, primarily used to analyze siblings (co-borns), courage, and the native's ability to execute initiatives. 

In Vedic astrology, this chart reveals your "bhratri sukha" (happiness from siblings) and your "parakrama" (prowess/courage). While the birth chart shows the general potential for courage, the D3 chart specifies how you utilize your physical and mental strength to overcome obstacles and lead your siblings or teammates.`;


const DREKKANA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "The Authoritative Brother",
    icon: "☀️",
    color: "orange",
    description: "Sun in D3 indicates a courageous and protective influence over siblings. You may take a leadership role among your co-borns or team members, often acting as a father-figure. It bestows an innate sense of duty and authority in all your initiatives."
  },
  Moon: {
    title: "The Emotional Protector",
    icon: "🌙",
    color: "blue",
    description: "Moon in D3 reflects an emotional and nurturing bond with siblings. Your courage is driven by your feelings and intuition. You take initiatives that bring emotional security to those around you, though your physical energy may fluctuate with your mood."
  },
  Mars: {
    title: "The Natural Warrior",
    icon: "⚔️",
    color: "red",
    description: "Mars is the natural karaka (significator) of D3. Its placement here is crucial for physical strength and raw courage. A strong Mars in D3 creates a formidable individual who never backs down from a challenge and possesses a deep, competitive spirit in all ventures."
  },
  Mercury: {
    title: "The Strategic Thinker",
    icon: "☿",
    color: "emerald",
    description: "Mercury in D3 emphasizes intelligence and communication in your initiatives. You rely on strategy rather than brute force. Your relationship with siblings is characterized by intellectual exchange, shared learning, and frequent communication."
  },
  Jupiter: {
    title: "The Wise Counselor",
    icon: "🕉️",
    color: "amber",
    description: "Jupiter in D3 brings wisdom and righteousness to your actions. You are seen as a guide by your siblings. Your initiatives are often for the greater good, and you possess a steady, philosophical courage that remains calm under pressure."
  },
  Venus: {
    title: "The Harmonious Initiator",
    icon: "💖",
    color: "pink",
    description: "Venus in D3 indicates harmony and shared pleasures with siblings. Your courage is refined and often channeled into artistic or social pursuits. You prefer diplomacy over confrontation but possess great stamina for the things you love."
  },
  Saturn: {
    title: "The Disciplined Worker",
    icon: "⚓",
    color: "slate",
    description: "Saturn in D3 suggests a serious or burdensome relationship with siblings. You possess immense patience and a disciplined approach to work. Your courage is 'silent resilience'—the ability to endure long hardships without complaining."
  },
  Rahu: {
    title: "The Unconventional Leader",
    icon: "🌀",
    color: "teal",
    description: "Rahu in D3 indicates unusual or intense initiatives. You may have an unconventional approach to challenges that surprises others. Sibling relationships could be complex, involving foreigners, outcasts, or highly ambitious dynamics."
  },
  Ketu: {
    title: "The Spiritual Brave",
    icon: "☄️",
    color: "orange",
    description: "Ketu in D3 suggests a detached or spiritual attitude towards courage and siblings. You may not feel a strong physical ego, yet you possess the bravery of a renounced soul. Initiatives are often pursued for spiritual liberation rather than material gain."
  }
};

const PlanetTable = ({ data, onPlanetClick }) => (
  <div className="flex flex-col h-full bg-[#fdfbf7]">
    <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase">Birth Chart Details</div>
    <div className="overflow-auto flex-1 text-[18px] font-mono leading-tight">
      <table className="w-full">
        <thead className="bg-[#f1f5f9] sticky top-0">
          <tr className="border-b border-[#cbd5e1]">
            <th className="p-1 text-left">Planet</th>
            <th className="p-1 text-left">Degree</th>
            <th className="p-1 text-left">Nakshatra</th>
            <th className="p-1 text-left">Pada</th>
            <th className="p-1 text-left">Lord</th>
          </tr>
        </thead>
        <tbody>
          {(data.planet_positions || []).map(p => {
            const color = PLANET_COLORS[p.planet] || "#000";
            const nameWithStatus = `${p.planet}${p.is_retrograde ? '*' : ''}${p.is_combust ? '#' : ''}`;
            const displayDegree = p.degree % 30;
            const displayPada = p.nakshatra_pada || p.pada || (typeof p.nakshatra === 'object' ? p.nakshatra?.pada : null) || 1;
            return (
              <tr key={p.planet} className="border-b border-[#f1f5f9] hover:bg-white transition-colors cursor-pointer" onClick={() => onPlanetClick?.(p.planet, p.house)}>
                <td className="p-1 font-bold" style={{ color: color }}>{nameWithStatus}</td>
                <td className="p-1">{displayDegree.toFixed(2)}°</td>
                <td className="p-1">{typeof p.nakshatra === 'object' ? p.nakshatra?.name : p.nakshatra}</td>
                <td className="p-1">{displayPada}</td>
                <td className="p-1">{p.sign_lord}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-2 border-t border-[#cbd5e1] text-[14px] italic text-slate-900 bg-[#f8fafc]">
        * = Vakri (Retrograde), # = Asth (Combust)
      </div>
    </div>
  </div>
);

const DrishtiTable = ({ houses, reportData, hideGraha = false, hideJaimini = false, hideSphuta = false }) => {
  if (!houses) return null;

  const positions = [];
  Object.entries(houses).forEach(([hNum, hData]) => {
    (hData.planets || []).forEach(p => {
      const name = typeof p === 'string' ? p : (p.planet || p.name);
      if (name === "Ascendant" || name === "Lagna" || name === "L") return;
      positions.push({
        planet: name,
        house: parseInt(hNum),
        is_retrograde: p.is_retrograde,
        is_combust: p.is_combust
      });
    });
  });

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  positions.sort((a, b) => planetOrder.indexOf(a.planet) - planetOrder.indexOf(b.planet));

  const getPlanetRelationshipBadge = (aspecting, target) => {
    const friendships = {
      "Sun": { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"], neutral: ["Mercury"] },
      "Moon": { friends: ["Sun", "Mercury"], enemies: [], neutral: ["Mars", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] },
      "Mars": { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"], neutral: ["Venus", "Saturn", "Rahu", "Ketu"] },
      "Mercury": { friends: ["Sun", "Venus"], enemies: ["Moon"], neutral: ["Mars", "Jupiter", "Saturn", "Rahu", "Ketu"] },
      "Jupiter": { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"], neutral: ["Saturn", "Rahu", "Ketu"] },
      "Venus": { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"], neutral: ["Mars", "Jupiter", "Rahu", "Ketu"] },
      "Saturn": { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"], neutral: ["Jupiter", "Rahu", "Ketu"] },
      "Rahu": { friends: ["Venus", "Saturn", "Mercury"], enemies: ["Sun", "Moon", "Mars", "Jupiter"], neutral: ["Ketu"] },
      "Ketu": { friends: ["Venus", "Saturn", "Mercury"], enemies: ["Sun", "Moon", "Mars", "Jupiter"], neutral: ["Rahu"] }
    };

    const list = friendships[aspecting];
    if (!list) return { label: "Neutral", bg: "bg-slate-100 text-slate-800 border-slate-300" };
    if (list.friends.includes(target)) {
      return { label: "Good (Friendly)", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    }
    if (list.enemies.includes(target)) {
      return { label: "Bad (Inimical)", bg: "bg-rose-100 text-rose-800 border-rose-300" };
    }
    return { label: "Neutral", bg: "bg-slate-100 text-slate-800 border-slate-300" };
  };

  const getAspectDetails = (planet, occupiedHouse, relativeAspect) => {
    const targetHouse = ((occupiedHouse + relativeAspect - 2) % 12) + 1;
    let nature = "Benefic";
    let description = "";

    if (planet === "Jupiter") {
      nature = "Benefic";
      if (relativeAspect === 5) {
        description = `5th Aspect (Dharma Drishti) on House ${targetHouse}: Blesses with past-life merit, intelligence, creative success, and spiritual progress.`;
      } else if (relativeAspect === 7) {
        description = `7th Aspect on House ${targetHouse}: Directly projects expansive grace, wisdom, protection, and balanced growth to this house.`;
      } else if (relativeAspect === 9) {
        description = `9th Aspect (Bhagya Drishti) on House ${targetHouse}: Bestows divine protection, luck, fortune, and higher guidance.`;
      }
    } else if (planet === "Mars") {
      nature = "Malefic";
      if (relativeAspect === 4) {
        description = `4th Aspect on House ${targetHouse}: Directs a protective, high-energy focus. Can bring conflicts or dynamic drive in domestic/foundation matters.`;
      } else if (relativeAspect === 7) {
        description = `7th Aspect on House ${targetHouse}: Directs active drive, passion, competitive energy, or potential friction directly to the opposite house.`;
      } else if (relativeAspect === 8) {
        description = `8th Aspect on House ${targetHouse}: Casts an intense, sudden, transformational force. Can cause sudden changes or intense focus.`;
      }
    } else if (planet === "Saturn") {
      nature = "Malefic";
      if (relativeAspect === 3) {
        description = `3rd Aspect on House ${targetHouse}: Enforces effort, hard work, struggles, and calls for self-reliance and patience.`;
      } else if (relativeAspect === 7) {
        description = `7th Aspect on House ${targetHouse}: Imposes discipline, duty, restrictions, and tests of commitment directly opposite.`;
      } else if (relativeAspect === 10) {
        description = `10th Aspect on House ${targetHouse}: Demands duty, karma, professional responsibility, and long-term ambition.`;
      }
    } else if (planet === "Rahu") {
      nature = "Malefic";
      if (relativeAspect === 5) {
        description = `5th Aspect on House ${targetHouse}: Triggers strong ambition, desires, and intense analytical/intellectual drive.`;
      } else if (relativeAspect === 7) {
        description = `7th Aspect on House ${targetHouse}: Directs projection, material desire, or unusual connections/illusions opposite.`;
      } else if (relativeAspect === 9) {
        description = `9th Aspect on House ${targetHouse}: Promotes unconventional wisdom, wanderlust, and unorthodox beliefs.`;
      }
    } else if (planet === "Ketu") {
      nature = "Malefic";
      if (relativeAspect === 5) {
        description = `5th Aspect on House ${targetHouse}: Connects to intuitive wisdom, detachment from worldly intellect, and spiritual insights.`;
      } else if (relativeAspect === 7) {
        description = `7th Aspect on House ${targetHouse}: Brings distance, detachment, or foreign connections/separation in partnerships.`;
      } else if (relativeAspect === 9) {
        description = `9th Aspect on House ${targetHouse}: Promotes detachment from dogmas, inclination toward occult sciences and liberation.`;
      }
    } else if (planet === "Sun") {
      nature = "Malefic";
      description = `7th Aspect on House ${targetHouse}: Projects warmth, focus, and authority, but can also cause separation or ego tension directly opposite.`;
    } else if (planet === "Moon") {
      nature = "Benefic";
      description = `7th Aspect on House ${targetHouse}: Projects emotional sensitivity, nurturing thoughts, empathy, and social connection directly opposite.`;
    } else if (planet === "Mercury") {
      nature = "Benefic";
      description = `7th Aspect on House ${targetHouse}: Casts an intellectual, logical, communicative, and trade-focused gaze directly opposite.`;
    } else if (planet === "Venus") {
      nature = "Benefic";
      description = `7th Aspect on House ${targetHouse}: Casts romantic grace, aesthetic appreciation, comfort, and harmonious relationships directly opposite.`;
    }

    return {
      targetHouse,
      nature,
      description
    };
  };

  // Build rows for each individual aspect
  const tableRows = [];
  positions.forEach(pos => {
    let relativeAspects = [7];
    if (pos.planet === "Jupiter" || pos.planet === "Rahu" || pos.planet === "Ketu") {
      relativeAspects = [5, 7, 9];
    } else if (pos.planet === "Mars") {
      relativeAspects = [4, 7, 8];
    } else if (pos.planet === "Saturn") {
      relativeAspects = [3, 7, 10];
    }

    relativeAspects.forEach(offset => {
      const details = getAspectDetails(pos.planet, pos.house, offset);
      tableRows.push({
        planet: pos.planet,
        occupiedHouse: pos.house,
        is_retrograde: pos.is_retrograde,
        is_combust: pos.is_combust,
        relativeAspect: offset,
        targetHouse: details.targetHouse,
        nature: details.nature,
        description: details.description
      });
    });
  });

  // --- Jaimini Rasi Drishti Calculation ---
  const SIGNS_LIST = [
    { name: "Aries", type: "Movable" },
    { name: "Taurus", type: "Fixed" },
    { name: "Gemini", type: "Dual" },
    { name: "Cancer", type: "Movable" },
    { name: "Leo", type: "Fixed" },
    { name: "Virgo", type: "Dual" },
    { name: "Libra", type: "Movable" },
    { name: "Scorpio", type: "Fixed" },
    { name: "Sagittarius", type: "Dual" },
    { name: "Capricorn", type: "Movable" },
    { name: "Aquarius", type: "Fixed" },
    { name: "Pisces", type: "Dual" }
  ];

  const getRasiDrishtiRows = () => {
    const lagnaHouse = houses[1] || houses["1"] || {};
    let lagnaSignIdx = lagnaHouse.sign_index;
    if (lagnaSignIdx === undefined && lagnaHouse.cusp_deg !== undefined) {
      lagnaSignIdx = Math.floor(lagnaHouse.cusp_deg / 30);
    }
    if (lagnaSignIdx === undefined) {
      lagnaSignIdx = 0;
    }

    const rows = [];
    for (let h = 1; h <= 12; h++) {
      const signIdx = (lagnaSignIdx + h - 1) % 12;
      const currentSign = SIGNS_LIST[signIdx];

      const aspectedIndices = [];
      if (currentSign.type === "Movable") {
        const fixedIndices = [1, 4, 7, 10];
        fixedIndices.forEach(idx => {
          const diff = Math.abs(signIdx - idx);
          if (diff !== 1 && diff !== 11) {
            aspectedIndices.push(idx);
          }
        });
      } else if (currentSign.type === "Fixed") {
        const movableIndices = [0, 3, 6, 9];
        movableIndices.forEach(idx => {
          const diff = Math.abs(signIdx - idx);
          if (diff !== 1 && diff !== 11) {
            aspectedIndices.push(idx);
          }
        });
      } else if (currentSign.type === "Dual") {
        const dualIndices = [2, 5, 8, 11];
        dualIndices.forEach(idx => {
          if (idx !== signIdx) {
            aspectedIndices.push(idx);
          }
        });
      }

      const aspectedDetails = aspectedIndices.map(targetIdx => {
        const targetHouse = ((targetIdx - lagnaSignIdx + 12) % 12) + 1;
        const targetHouseData = houses[targetHouse] || {};
        const planets = (targetHouseData.planets || [])
          .map(p => typeof p === 'string' ? p : (p.planet || p.name))
          .filter(p => p !== "Ascendant" && p !== "Lagna" && p !== "L");

        return {
          signName: SIGNS_LIST[targetIdx].name,
          houseNum: targetHouse,
          planets: planets
        };
      });

      const sourceHouseData = houses[h] || {};
      const sourcePlanets = (sourceHouseData.planets || [])
        .map(p => typeof p === 'string' ? p : (p.planet || p.name))
        .filter(p => p !== "Ascendant" && p !== "Lagna" && p !== "L");

      rows.push({
        houseNum: h,
        signName: currentSign.name,
        signType: currentSign.type,
        sourcePlanets: sourcePlanets,
        aspects: aspectedDetails
      });
    }

    return rows;
  };

  const rasiRows = getRasiDrishtiRows();

  return (
    <div className="flex flex-col gap-12">
      {/* Planetary Graha Drishti Table */}
      {!hideGraha && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">👁️</div>
            <div>
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Planetary Drishti (Aspects)</h4>
              <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Sight of Influence & Karma</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl overflow-hidden font-sans">
            <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-900 text-white text-xs uppercase tracking-wider font-bold sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">ग्रह</div>
                      <div>Planet</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">स्थित भाव</div>
                      <div>Occupied House</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">दृष्टि</div>
                      <div>Aspect</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">दृष्ट भाव</div>
                      <div>Aspect House</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">स्थित ग्रह</div>
                      <div>Occupying Planets</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">दृष्टि गुणवत्ता</div>
                      <div>Drishti Quality</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">ज्योतिषीय व्याख्या</div>
                      <div>Astrological Interpretation</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[14px] divide-y divide-indigo-50">
                  {tableRows.map((row, idx) => {
                    const color = PLANET_COLORS[row.planet] || "#000";
                    const targetHouseData = houses[row.targetHouse] || {};
                    const residingPlanets = (targetHouseData.planets || [])
                      .map(p => typeof p === 'string' ? p : (p.planet || p.name))
                      .filter(p => p !== "Ascendant" && p !== "Lagna" && p !== "L");

                    // --- Dynamic Quality and Interpretation Computation ---
                    const getDynamicDetails = () => {
                      let baseNature = row.nature;
                      let desc = row.description;

                      if (residingPlanets.length === 0) {
                        return {
                          label: baseNature === "Benefic" ? "🟢 Positive (Benefic)" : "🔴 Challenging (Malefic)",
                          badgeClass: baseNature === "Benefic" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200",
                          text: desc
                        };
                      }

                      const relations = residingPlanets.map(planet => {
                        const rel = getPlanetRelationshipBadge(row.planet, planet);
                        return { planet, rel };
                      });

                      const hasFriends = relations.some(r => r.rel.label.includes("Friendly"));
                      const hasEnemies = relations.some(r => r.rel.label.includes("Inimical"));

                      let label = "";
                      let badgeClass = "";

                      if (baseNature === "Benefic") {
                        if (hasEnemies && hasFriends) {
                          label = "🟡 Mixed Benefic";
                          badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                        } else if (hasFriends) {
                          label = "🟢 Highly Positive (Benefic & Friendly)";
                          badgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold";
                        } else if (hasEnemies) {
                          label = "🟡 Weakened Benefic (Inimical Target)";
                          badgeClass = "bg-amber-100 text-amber-800 border-amber-300";
                        } else {
                          label = "🟢 Positive (Benefic & Neutral)";
                          badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        }
                      } else {
                        // Malefic
                        if (hasFriends) {
                          label = "🟡 Softened Malefic (Friendly Target)";
                          badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                        } else if (hasEnemies) {
                          label = "🔴 Highly Challenging (Malefic & Inimical)";
                          badgeClass = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
                        } else {
                          label = "🔴 Challenging (Malefic & Neutral)";
                          badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                        }
                      }

                      let relDescriptions = [];
                      relations.forEach(r => {
                        const isFriend = r.rel.label.includes("Friendly");
                        const isEnemy = r.rel.label.includes("Inimical");
                        const relStatus = isFriend ? "Mitra (Friendly)" : isEnemy ? "Shatru (Inimical)" : "Sama (Neutral)";

                        relDescriptions.push(`aspecting the residing planet ${r.planet} (${relStatus})`);
                      });

                      const relationshipSummary = `${row.planet}'s energy is modified because it is ${relDescriptions.join(" and ")}.`;
                      const fullDesc = `${desc} ${relationshipSummary}`;

                      return { label, badgeClass, text: fullDesc };
                    };

                    const dynamicInfo = getDynamicDetails();

                    return (
                      <tr key={`${row.planet}-${row.relativeAspect}-${idx}`} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-2" style={{ color: color }}>
                          <span>✨</span> {row.planet} {row.is_retrograde ? '*' : ''}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          House {row.occupiedHouse}
                        </td>
                        <td className="p-4 text-[16px] font-mono font-bold text-slate-900">
                          {row.relativeAspect}th Aspect
                        </td>
                        <td className="p-4 font-bold text-indigo-900">
                          House {row.targetHouse}
                        </td>
                        <td className="p-4">
                          {residingPlanets.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {residingPlanets.map(planet => {
                                const rel = getPlanetRelationshipBadge(row.planet, planet);
                                const planetColor = PLANET_COLORS[planet] || "#000";
                                return (
                                  <div key={planet} className="flex items-center justify-between gap-2 text-xs border border-indigo-50 bg-indigo-50/10 p-1 rounded">
                                    <span className="font-bold text-[14px]" style={{ color: planetColor }}>{planet}</span>
                                    <span className={`px-1 py-0.5 border text-[7px] font-black uppercase rounded ${rel.bg}`}>
                                      {rel.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-900">Empty House</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 border text-[11px] font-black uppercase tracking-wider rounded-full whitespace-nowrap inline-block ${dynamicInfo.badgeClass}`}>
                            {dynamicInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-[14px] text-slate-900 leading-relaxed max-w-sm font-medium">
                          {dynamicInfo.text}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-indigo-50/20 text-xs text-slate-500 border-t border-indigo-50">
              * = Vakri (Retrograde). Aspects are counted in clockwise order starting from the occupied house as 1st.
            </div>
          </div>
        </div>
      )}

      {/* Jaimini Rasi Drishti Table */}
      {!hideJaimini && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">📐</div>
            <div>
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Jaimini Rasi Drishti (Sign Aspects)</h4>
              <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Constant Sign-to-Sign Gaze of Jaimini</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl overflow-hidden font-sans">
            <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-900 text-white text-xs uppercase tracking-wider font-bold sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">स्रोत भाव</div>
                      <div>Source House</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">राशि</div>
                      <div>Zodiac Sign</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">राशि प्रकार</div>
                      <div>Sign Type</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">स्थित ग्रह</div>
                      <div>Occupying Planets</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">दृष्ट राशियां और भाव</div>
                      <div>Aspected Signs & Houses</div>
                    </th>
                    <th className="p-4 bg-indigo-900">
                      <div className="text-[14px] text-white font-medium lowercase italic">दृष्टि से प्रभावित ग्रह</div>
                      <div>Planets Influenced by Aspect</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[16px] divide-y divide-indigo-50">
                  {rasiRows.map((row) => {
                    let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
                    if (row.signType === "Movable") badgeColor = "bg-sky-50 text-sky-700 border-sky-200";
                    else if (row.signType === "Fixed") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                    else if (row.signType === "Dual") badgeColor = "bg-purple-50 text-purple-700 border-purple-200";

                    const aspectedText = row.aspects.map(a => `${a.signName} (House ${a.houseNum})`).join(", ");

                    const allAspectedPlanets = [];
                    row.aspects.forEach(a => {
                      a.planets.forEach(p => {
                        allAspectedPlanets.push({ planet: p, house: a.houseNum, sign: a.signName });
                      });
                    });

                    return (
                      <tr key={row.houseNum} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-800 text-[16px]">
                          House {row.houseNum}
                        </td>
                        <td className="p-4 font-bold text-indigo-950 text-[18px]">
                          {row.signName}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 border text-[13px] font-black uppercase tracking-wider rounded-full ${badgeColor}`}>
                            {row.signType}
                          </span>
                        </td>
                        <td className="p-4">
                          {row.sourcePlanets.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {row.sourcePlanets.map(p => (
                                <span key={p} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded text-[14px] font-bold" style={{ color: PLANET_COLORS[p] || "#000" }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[14px] italic text-slate-900">Empty</span>
                          )}
                        </td>
                        <td className="p-4 font-medium text-indigo-900 leading-normal max-w-xs text-[16px]">
                          {aspectedText}
                        </td>
                        <td className="p-4">
                          {allAspectedPlanets.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {allAspectedPlanets.map((ap, idx) => (
                                <div key={`${ap.planet}-${idx}`} className="flex items-center gap-2 text-[14px] border border-indigo-50 bg-indigo-50/10 p-1.5 rounded">
                                  <span className="font-bold text-[14px]" style={{ color: PLANET_COLORS[ap.planet] || "#000" }}>{ap.planet}</span>
                                  <span className="text-[12px] text-slate-900 font-semibold">in House {ap.house} ({ap.sign})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[14px] italic text-slate-900">No planets aspected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sphuta Drishti (Mathematical Aspect Strength Heatmap) */}
      {!hideSphuta && (
        <div className="space-y-6">
          <SphutaDrishtiViewer
            sphutaDrishtiData={reportData?.sphuta_drishti}
            planetPositions={reportData?.planet_positions || reportData?.chart?.planet_positions}
          />
        </div>
      )}
    </div>
  );
};

const DignityTable = ({ data, planetEffects }) => {
  const [lang, setLang] = useState('en');
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index || 0;
  }

  const getFunctionalNature = (lagnaIdx, planetName) => {
    const lagnaMap = {
      0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
      2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
      3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
      5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
      6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
      7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
      9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
      10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
      11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
    };

    const lagnaData = lagnaMap[lagnaIdx] || { benefic: [], malefic: [] };
    if (planetName === "Rahu" || planetName === "Ketu") return "malefic";
    if (lagnaData.benefic.includes(planetName)) return "benefic";
    if (lagnaData.malefic.includes(planetName)) return "malefic";
    return "neutral";
  };
  const PLANET_ABBREV = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
    "Rahu": "Ra", "Ketu": "Ke"
  };
  const calculateJaiminiKarakas = (planetPositions) => {
    if (!planetPositions || !Array.isArray(planetPositions)) return { k7: {} };
    const planetsFor7 = planetPositions.filter(p => !["Rahu", "Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet));
    const sorted7 = [...planetsFor7].sort((a, b) => (b.degree % 30) - (a.degree % 30));
    const k7Names = ["AK", "AmK", "BK", "MK", "PiK", "GK", "DK"];
    const k7 = {};
    sorted7.forEach((p, idx) => {
      if (idx < 7) k7[p.planet] = k7Names[idx];
    });
    return { k7 };
  };
  const getSBRanks = (strengthPlanets) => {
    if (!strengthPlanets) return {};
    const validPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const sbList = validPlanets.map(p => ({ planet: p, sb: strengthPlanets[p]?.total || 0 }));
    sbList.sort((a, b) => b.sb - a.sb);
    const ranks = {};
    sbList.forEach((item, idx) => {
      ranks[item.planet] = idx + 1;
    });
    return ranks;
  };
  const { k7 } = calculateJaiminiKarakas(data.planet_positions);
  const sbRanks = getSBRanks(data?.strength?.planets);
  const avasthas = data?.planetary_avasthas || {};
  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-300 shadow-inner flex flex-col overflow-hidden h-full">
      <div className="bg-indigo-900 py-1.5 px-3 flex justify-between items-center shrink-0">
        <span className="text-[12px] font-black uppercase text-white tracking-widest">Dignity & Shadbala</span>
        <button
          onClick={(e) => { e.stopPropagation(); setLang(l => l === 'en' ? 'hi' : 'en'); }}
          className="px-2 py-0.5 bg-amber-500 text-slate-900 font-bold rounded shadow-sm hover:bg-amber-400 transition text-[9px] uppercase tracking-wide"
        >
          {lang === 'en' ? 'A ➔ अ (Hindi)' : 'अ ➔ A (English)'}
        </button>
      </div>
      <div className="mt-2 flex-1 overflow-y-auto px-1 custom-scrollbar">
        <table className="w-full text-left text-[12px] mb-6">
          <thead className="border-b border-indigo-900/10 text-black sticky top-0 bg-white z-10">
            <tr>
              <th className="font-semibold py-2">Pl</th>
              <th className="font-semibold py-2">Dignity</th>
              <th className="font-semibold py-2">SB Ratio</th>
              <th className="font-semibold py-2">SB Rank</th>
              <th className="font-semibold py-2">Vimso</th>
              <th className="font-semibold py-2">AV</th>
              <th className="font-semibold py-2">Avastha</th>
              <th className="font-semibold py-2">Age</th>
              <th className="font-semibold py-2">Karak</th>
              <th className="font-semibold py-2">Nature</th>
            </tr>
          </thead>
          <tbody>
            {(data.planet_positions || []).map(p => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(p.planet)) return null;
              let abbrev = PLANET_ABBREV[p.planet] || p.planet;
              const color = PLANET_COLORS[p.planet] || "#000";
              const pStrength = data?.strength?.planets?.[p.planet];
              const sb = pStrength?.total || 1.1;
              const sbPct = sb.toFixed(2);
              const sbRank = ["Rahu", "Ketu"].includes(p.planet) ? "-" : (sbRanks[p.planet] || "-");
              const nature = getFunctionalNature(lagnaSignIndex, p.planet);
              const statusText = nature === "benefic" ? "Benefic" : nature === "malefic" ? "Malefic" : "Neutral";
              const statusColor = nature === "benefic" ? "text-green-700" : nature === "malefic" ? "text-red-700" : "text-amber-700";
              const SIGNS_LOCAL = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
              const signIdx = Math.floor(p.degree / 30);
              const signName = SIGNS_LOCAL[signIdx];
              const dignityObj = typeof getDignityStatus === "function" ? getDignityStatus(p.planet, signName) : null;
              let backendDignity = pStrength?.dignity;
              if (["Rahu", "Ketu"].includes(p.planet) && (!backendDignity || backendDignity === "Neutral" || backendDignity === "Unknown")) {
                backendDignity = "";
              }


              const dignityDisplay = backendDignity || (dignityObj ? dignityObj.label.replace(/[★↓◆♥✕]/g, '').trim() : "Own");
              const vbScore = data?.vimsopaka_bala?.shodashvarga?.[p.planet];
              const vbDisplay = vbScore !== undefined ? (typeof vbScore === 'number' ? vbScore.toFixed(1) : vbScore) : "-";
              const av = p.ashtakavarga || data?.ashtakavarga?.binnashtakavarga?.[p.planet]?.total || 4;
              const pAv = avasthas[p.planet] || {};
              const baladiParts = pAv.baladi ? pAv.baladi.split('\n') : [];
              const ageHi = baladiParts[0] ? baladiParts[0].trim() : "-";
              const ageEn = baladiParts[1] ? baladiParts[1].replace(/[()]/g, '').trim() : ageHi;
              const shyanadiParts = pAv.shyanadi ? pAv.shyanadi.split('\n') : [];
              const avasthaHi = shyanadiParts[0] ? shyanadiParts[0].trim() : "-";
              const avasthaEn = shyanadiParts[1] ? shyanadiParts[1].replace(/[()]/g, '').trim() : avasthaHi;
              const karakAbbrev = k7[p.planet] || "-";
              const KARAK_HI = { "AK": "आत्मा (AK)", "AmK": "अमात्य (AmK)", "BK": "भ्रातृ (BK)", "MK": "मातृ (MK)", "PiK": "पितृ (PiK)", "GK": "ज्ञाति (GK)", "DK": "दारा (DK)" };
              const KARAK_EN = { "AK": "Soul", "AmK": "Career", "BK": "Sibling", "MK": "Mother", "PiK": "Father", "GK": "Rival", "DK": "Spouse" };
              const karakHi = KARAK_HI[karakAbbrev] || karakAbbrev;
              const karakEn = KARAK_EN[karakAbbrev] || karakAbbrev;
              const DIGNITY_HI = {
                "EXALTED": "उच्च", "MOOLATRIKONA": "मूलत्रिकोण", "OWN_SIGN": "स्व",
                "GREAT_FRIEND": "अधि मित्र", "FRIEND": "मित्र", "NEUTRAL": "सम",
                "ENEMY": "शत्रु", "GREAT_ENEMY": "अधि शत्रु", "DEBILITATED": "नीच",
                "Exalt.": "उच्च", "Exalted": "उच्च", "Moolt.": "मूलत्रिकोण", "Own": "स्व", "Own Sign": "स्व",
                "Grt.Fr.": "अधि मित्र", "Great Friend": "अधि मित्र", "Frnd.": "मित्र", "Friend": "मित्र",
                "Neutr.": "सम", "Neutral": "सम", "Enemy": "शत्रु", "Grt.En.": "अधि शत्रु",
                "Great Enemy": "अधि शत्रु", "Debil.": "नीच", "Debilitated": "नीच"
              };
              const DIG_EN_MAP = {
                "EXALTED": "Exalted", "MOOLATRIKONA": "Moolatrikona", "OWN_SIGN": "Own Sign",
                "GREAT_FRIEND": "Great Friend", "FRIEND": "Friend", "NEUTRAL": "Neutral",
                "ENEMY": "Enemy", "GREAT_ENEMY": "Great Enemy", "DEBILITATED": "Debilitated",
                "Exalt.": "Exalted", "Moolt.": "Moolatrikona", "Own": "Own Sign",
                "Grt.Fr.": "Great Friend", "Frnd.": "Friend", "Neutr.": "Neutral",
                "Grt.En.": "Great Enemy", "Debil.": "Debilitated"
              };
              const digHi = DIGNITY_HI[dignityDisplay] || dignityDisplay;
              const digEn = DIG_EN_MAP[dignityDisplay] || dignityDisplay;
              const finalAvastha = lang === 'en' ? avasthaEn : avasthaHi;
              const finalAge = lang === 'en' ? ageEn : ageHi;
              const finalKarak = lang === 'en' ? karakEn : karakHi;
              const finalDig = lang === 'en' ? digEn : digHi;
              const PLANET_HI = {
                "Sun": "सूर्य", "Moon": "चन्द्र", "Mars": "मंगल", "Mercury": "बुध",
                "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
              };
              const finalPlanet = lang === 'en' ? p.planet : (PLANET_HI[p.planet] || p.planet);
              return (
                <tr key={p.planet} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-2 font-bold" style={{ color }}>{finalPlanet}</td>
                  <td className="py-2 text-black truncate max-w-[50px]" title={finalDig}>{finalDig}</td>
                  <td className="py-2 font-mono text-black">{sbPct}</td>
                  <td className="py-2 font-mono text-black">{sbRank}</td>
                  <td className="py-2 font-mono text-black">{vbDisplay}</td>
                  <td className="py-2 font-mono text-indigo-600 font-bold">{av}</td>
                  <td className="py-2 text-black truncate max-w-[60px]" title={pAv.shyanadi || finalAvastha}>{finalAvastha}</td>
                  <td className="py-2 text-black truncate max-w-[50px]" title={pAv.baladi || finalAge}>{finalAge}</td>
                  <td className="py-2 text-black">{finalKarak}</td>
                  <td className={`py-2 ${statusColor}`}>{statusText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Detailed Planetary Analysis */}
        <div className="p-3 border-t border-[#cbd5e1] bg-slate-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-4 text-center">Detailed Planetary Analysis</h3>
          <div className="flex flex-col gap-6">
            {(data.planet_positions || []).map(p => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(p.planet)) return null;

              const nature = getFunctionalNature(lagnaSignIndex, p.planet);
              return (
                <PlanetaryRemediesViewer key={`rem-${p.planet}`} planet={p.planet} initialNature={nature} />
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-[#cbd5e1] text-[8px] italic text-slate-500 bg-[#f8fafc] flex-shrink-0">
        * = Vakri (Retrograde), # = Asth (Combust) | Analysis uses Parashari principles for current Lagna.
      </div>
    </div>
  );
};

const PanchangPanel = ({ data }) => {
  const p = data?.panchang || {};
  // Check if we have any actual data beyond just the keys
  const hasPanchang = !!(p.tithi?.tithi_name || p.nakshatra?.nakshatra_name || p.yoga?.yoga_name || p.karana?.karana_name);

  if (!hasPanchang) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🗞️ Panchang & Solar data
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">📅</span>
          <p className="text-[10px] text-gray-400 italic">Panchang data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load Tithi, Nakshatra & Yoga.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Tithi", value: p.tithi?.tithi_name, icon: "🌑" },
    { label: "Nakshatra", value: p.nakshatra?.nakshatra_name, icon: "⭐" },
    { label: "Yoga", value: p.yoga?.yoga_name, icon: "🌀" },
    { label: "Karana", value: p.karana?.karana_name, icon: "🐘" },
    { label: "Sunrise", value: data.meta?.sunrise || "N/A", icon: "🌅" },
    { label: "Sunset", value: data.meta?.sunset || "N/A", icon: "🌇" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🗞️ Panchang & Solar data
      </div>
      <div className="flex-1 p-2 grid grid-cols-2 gap-2 overflow-auto custom-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-2 rounded border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{item.icon}</span>
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-800 truncate">{item.value || "---"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NumericalPanel = ({ data }) => {
  const n = data?.favourable?.numerology || {};
  const hasData = n.radical_number != null || n.destiny_number != null || n.life_path_number != null;

  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-[#f8fbff]">
        <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🔢 Numerology Insights
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">🔢</span>
          <p className="text-[10px] text-gray-400 italic">Numerology data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load numerology insights.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Radical", val: n.radical_number, color: "text-blue-600" },
    { label: "Destiny", val: n.destiny_number, color: "text-purple-600" },
    { label: "Life Path", val: n.life_path_number, color: "text-indigo-600" },
    { label: "Lucky Day", val: n.lucky_day?.[0], color: "text-green-600" },
    { label: "Mantra", val: n.lucky_mantra, color: "text-amber-600", full: true },
    { label: "Lucky Stone", val: n.lucky_stone, color: "text-rose-600" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fbff]">
      <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🔢 Numerology Insights
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-2">
          {items.filter(i => !i.full).map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-blue-50/50 shadow-sm">
              <div className="text-[7px] font-black text-gray-400 uppercase mb-0.5">{item.label}</div>
              <div className={`text-[11px] font-black ${item.color}`}>{item.val || "---"}</div>
            </div>
          ))}
        </div>
        {items.filter(i => i.full).map((item, idx) => (
          <div key={idx} className="bg-indigo-50/50 p-2 rounded border border-indigo-100">
            <div className="text-[7px] font-black text-indigo-400 uppercase mb-1">{item.label}</div>
            <div className="text-[9px] font-serif italic text-indigo-900 leading-tight">"{item.val}"</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecondaryDashaPanel = ({ data, type }) => {
  const [expanded, setExpanded] = useState(null);
  const list = data?.[type] || [];
  const planetStrengths = data?.strength?.planets || {};
  const maraka = data?.maraka || { signs: [], planets: [] };

  const DASHA_META = {
    shodashottari: { title: "Shodashottari", years: 116 },
    chaturshitisama: { title: "Chaturshitisama", years: 84 },
    ashtottari: { title: "Ashtottari", years: 108 },
    dwisaptatisama: { title: "Dwisaptatisama", years: 72 },
    dwadashottari: { title: "Dwadashottari", years: 112 },
    panchottari: { title: "Panchottari", years: 105 },
    shatabdika: { title: "Shatabdika", years: 100 },
    shashtihayani: { title: "Shashtihayani", years: 60 },
    chara: { title: "Chara", years: 120 },
    sthira: { title: "Sthira", years: 120 },
    shoola: { title: "Shoola", years: 120 },
    niryaana_shoola: { title: "Niryana Shoola", years: 120 },
    mandooka: { title: "Mandooka", years: 120 },
    drig: { title: "Drig", years: 120 },
    sudasha: { title: "Sudasha", years: 120 },
    panch_pakshi: { title: "Panch Pakshi", years: 120 }
  };

  const ITEM_META = {
    Sun: { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', symbol: '☀️' },
    Moon: { color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', symbol: '🌙' },
    Mars: { color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', symbol: '🔴' },
    Rahu: { color: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', symbol: '🌑' },
    Jupiter: { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', symbol: '🟡' },
    Saturn: { color: '#64748b', bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700', symbol: '⏳' },
    Mercury: { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', symbol: '🟢' },
    Ketu: { color: '#8b5cf6', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', symbol: '💥' },
    Venus: { color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', symbol: '💖' },
    Aries: { color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', symbol: '♈' },
    Taurus: { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', symbol: '♉' },
    Gemini: { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', symbol: '♊' },
    Cancer: { color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', symbol: '♋' },
    Leo: { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', symbol: '♌' },
    Virgo: { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', symbol: '♍' },
    Libra: { color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', symbol: '♎' },
    Scorpio: { color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', symbol: '♏' },
    Sagittarius: { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', symbol: '♐' },
    Capricorn: { color: '#64748b', bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700', symbol: '♑' },
    Aquarius: { color: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', symbol: '♒' },
    Pisces: { color: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', symbol: '♓' },
  };

  const metaInfo = DASHA_META[type] || { title: type.charAt(0).toUpperCase() + type.slice(1), years: 120 };
  const title = metaInfo.title;
  const totalYears = metaInfo.years;

  const basic = data?.basic_details || {};
  const metaData = data?.meta || {};
  const birthDateStr = basic.birth_date || metaData.date || null;

  let birthDateObj = null;
  if (birthDateStr) {
    let y, m, d;
    if (birthDateStr.includes('/')) {
      [d, m, y] = birthDateStr.split('/').map(Number);
      birthDateObj = new Date(y, m - 1, d);
    } else {
      [y, m, d] = birthDateStr.split('-').map(Number);
      birthDateObj = new Date(y, m - 1, d);
    }
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const calculateDate = (years) => {
    if (!birthDateObj || isNaN(birthDateObj.getTime())) return "—";
    const d = new Date(birthDateObj.getTime() + years * 365.2425 * 24 * 60 * 60 * 1000);
    return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  };

  const currentDateObj = new Date();
  const currentAgeAsFloat = birthDateObj && !isNaN(birthDateObj.getTime())
    ? (currentDateObj.getTime() - birthDateObj.getTime()) / (365.2425 * 24 * 60 * 60 * 1000)
    : null;

  const calculateExactDate = (years) => {
    if (!birthDateObj || isNaN(birthDateObj.getTime())) return "—";
    const d = new Date(birthDateObj.getTime() + years * 365.2425 * 24 * 60 * 60 * 1000);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const UDU_DASHAS = ['shodashottari', 'chaturshitisama', 'ashtottari', 'dwisaptatisama', 'dwadashottari', 'panchottari', 'shatabdika', 'shashtihayani'];
  const SIGN_DASHAS = ['chara', 'sthira', 'shoola', 'niryaana_shoola', 'drig', 'mandooka', 'sudasha'];
  const ZODIAC = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const AAYU_DASHAS = ['shoola', 'niryaana_shoola', 'sthira'];

  const isMaraka = (name) => {
    if (!AAYU_DASHAS.includes(type) || !name) return false;
    return maraka.signs.includes(name) || maraka.planets.includes(name);
  };

  const getAntardashas = (md) => {
    if (UDU_DASHAS.includes(type)) {
      const seq = [];
      const seen = new Set();
      let totalYears = 0;
      for (const d of list) {
        const name = d.lord || d.sign || d.item;
        if (name && !seen.has(name)) {
          seen.add(name);
          seq.push({ name, duration: parseFloat(d.duration) });
          totalYears += parseFloat(d.duration);
        }
      }
      const mdName = md.lord || md.sign || md.item;
      const startIndex = seq.findIndex(s => s.name === mdName);
      if (startIndex === -1 || totalYears === 0) return [];

      const antardashas = [];
      let currentStart = parseFloat(md.start);
      for (let i = 0; i < seq.length; i++) {
        const adItem = seq[(startIndex + i) % seq.length];
        const adDur = (parseFloat(md.duration) * adItem.duration) / totalYears;
        antardashas.push({ name: adItem.name, start: currentStart, end: currentStart + adDur });
        currentStart += adDur;
      }
      return antardashas;
    }

    if (SIGN_DASHAS.includes(type)) {
      const mdName = md.lord || md.sign || md.item;
      const startIndex = ZODIAC.indexOf(mdName);
      if (startIndex === -1) return [];

      const antardashas = [];
      const adDur = parseFloat(md.duration) / 12;
      let currentStart = parseFloat(md.start);
      for (let i = 0; i < 12; i++) {
        const adName = ZODIAC[(startIndex + i) % 12];
        antardashas.push({ name: adName, start: currentStart, end: currentStart + adDur });
        currentStart += adDur;
      }
      return antardashas;
    }
    return [];
  };

  if (!list.length) {
    return (
      <div className="flex flex-col h-full bg-white font-serif">
        <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-slate-200 to-slate-50 border-[#94a3b8] text-[#1e293b] font-serif font-black text-xs uppercase italic tracking-widest shadow-sm">
          ⏳ {title} Mahadasha
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">⏳</span>
          <p className="text-[10px] text-gray-400 italic">{title} Dasha data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load this dasha ({totalYears}-year cycle).</p>
        </div>
      </div>
    );
  }

  const toggleRow = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div className="bg-white font-serif flex flex-col h-full">
      <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center gap-3 shrink-0">
        <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-black font-black text-sm">⏳</div>
        <div>
          <h2 className="text-white text-sm font-black uppercase tracking-widest leading-none">{title} Mahadasha</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-wider mt-0.5">Conditional Dasha System</p>
        </div>
        <div className="ml-auto text-[9px] text-slate-400 font-sans">{totalYears} Year Cycle</div>
      </div>

      <div className="grid grid-cols-[2fr_0.5fr_0.5fr_0.5fr_1.1fr_1.1fr] border-b-2 border-slate-800 bg-slate-100 shrink-0">
        <div className="px-4 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">Mahadasha</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">Yrs</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">From Age</div>
        <div className="px-1 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">To Age</div>
        <div className="px-3 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">Start</div>
        <div className="px-3 py-2 text-[9px] font-black text-slate-700 uppercase tracking-widest">End</div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar divide-y divide-slate-100">
        {list.map((d, i) => {
          const itemName = d.lord || d.sign || d.item || "Unknown";
          const itemMeta = ITEM_META[itemName] || { color: '#666', bg: 'bg-white', border: 'border-slate-100', badge: 'bg-slate-100 text-slate-700', symbol: '⭐' };

          const strength = planetStrengths[itemName];
          const isStrong = strength ? (strength.total_score >= 5.5) : null;
          const isOpen = expanded === i;
          const isCurrentDasha = currentAgeAsFloat !== null && d.start <= currentAgeAsFloat && currentAgeAsFloat < d.end;
          const isMarakaDasha = isMaraka(itemName);

          const startAge = Math.floor(d.start ?? 0);
          const endAge = Math.floor(d.end ?? 0);

          return (
            <div key={i} className={`transition-all ${isOpen ? itemMeta.bg : (isCurrentDasha ? 'bg-indigo-50/30' : '')} ${isMarakaDasha ? 'bg-red-50/30 border-l-red-500' : ''}`}>
              <div
                className={`grid grid-cols-[2fr_0.5fr_0.5fr_0.5fr_1.1fr_1.1fr] cursor-pointer hover:bg-slate-50 transition-colors group border-l-4`}
                style={{ borderLeftColor: isMarakaDasha ? '#dc2626' : (isCurrentDasha ? itemMeta.color : (isOpen ? itemMeta.color : 'transparent')) }}
                onClick={() => toggleRow(i)}
              >
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-lg leading-none">{itemMeta.symbol}</span>
                  <div>
                    <span className="font-black text-sm text-slate-800">{itemName}</span>
                    <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${itemMeta.badge}`}>
                      {parseFloat(d.duration).toFixed(1)} yrs
                    </span>
                    {isStrong !== null && (
                      <span className={`ml-1 text-[8px] font-bold px-1 py-0.5 rounded ${isStrong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {isStrong ? '▲ Strong' : '▼ Weak'}
                      </span>
                    )}
                    {isMarakaDasha && (
                      <span className="ml-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white shadow-sm border border-red-800 animate-pulse">
                        💀 MARAKA
                      </span>
                    )}
                    {isCurrentDasha && (
                      <span className="ml-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white animate-pulse shadow-sm">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-slate-300 group-hover:text-slate-500 text-[10px] transition-all">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-black" style={{ color: itemMeta.color }}>{parseFloat(d.duration).toFixed(1)}</span>
                </div>
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {startAge}
                  </span>
                </div>
                <div className="px-1 py-3 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {endAge}
                  </span>
                </div>
                <div className="px-3 py-3 flex items-center">
                  <span className="text-xs font-semibold text-indigo-600">{calculateDate(d.start ?? 0)}</span>
                </div>
                <div className="px-3 py-3 flex items-center">
                  <span className="text-xs font-semibold text-rose-600">{calculateDate(d.end ?? 0)}</span>
                </div>
              </div>

              {isOpen && (
                <div className="px-6 py-4 bg-amber-50/20 border-t border-slate-100 animate-fade-in font-serif">
                  <table className="w-full text-[13px] border-collapse">
                    <thead>
                      <tr className="border-t border-b border-red-600 bg-amber-100/50">
                        <th className="text-left py-1.5 font-bold px-2 text-black">Antar</th>
                        <th className="text-left py-1.5 font-bold px-2 text-black">Beginning</th>
                        <th className="text-left py-1.5 font-bold px-2 text-black">Ending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAntardashas(d).map((ad, j) => {
                        const adMetaInfo = ITEM_META[ad.name] || { color: '#000' };
                        const isMarakaAd = isMaraka(ad.name);
                        return (
                          <tr key={j} className={`border-b border-gray-100 last:border-b-2 last:border-red-600 ${isMarakaAd ? 'bg-red-100/50' : ''}`}>
                            <td className="py-1 px-2 font-bold flex items-center gap-2" style={{ color: adMetaInfo.color }}>
                              {ad.name}
                              {isMarakaAd && <span className="text-[8px] font-black tracking-wider px-1 py-0.5 bg-red-600 text-white rounded">⚠️ DANGER</span>}
                            </td>
                            <td className="py-1 px-2 text-black">{calculateExactDate(ad.start)}</td>
                            <td className="py-1 px-2 text-black">{calculateExactDate(ad.end)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VimshottariPanel = ({ data }) => {
  const list = data.dasha?.list || [];
  const planetStrengths = data.strength?.planets || {};

  return (
    <div className="flex flex-col h-full bg-white font-serif">
      <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-slate-200 to-slate-50 border-[#94a3b8] text-[#1e293b] font-serif font-black text-xs uppercase italic tracking-widest shadow-sm">
        ⏳ Vimshottari Mahadasha
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="bg-[#f8fafc] sticky top-0 z-10 shadow-sm border-b border-gray-200">
            <tr className="text-[8px] uppercase text-gray-500 font-black">
              <th className="p-2 text-left">Lord</th>
              <th className="p-2 text-left">Period (Start - End)</th>
              <th className="p-2 text-right">Age/Year</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).slice(0, 25).map((d, i) => {
              const strength = planetStrengths[d.lord]?.total;
              const nextD = list[i + 1];
              const endDate = d.end_date || (nextD ? nextD.start_date : "Ongoing");

              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLANET_COLORS[d.lord] || '#000' }}></div>
                      <span className="text-[10px] font-black uppercase text-gray-700" style={{ color: PLANET_COLORS[d.lord] }}>{d.lord}</span>
                    </div>
                  </td>
                  <td className="p-2 text-[9px] text-gray-500 font-mono tracking-tighter">
                    <span className="text-indigo-600 font-semibold">{d.start_date}</span>
                    <span className="mx-1 text-gray-300">to</span>
                    <span className="text-rose-600 font-semibold">{endDate}</span>
                  </td>
                  <td className="p-2 text-right">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">{d.start_date.split("/")[2]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-1.5 px-3 bg-slate-50 border-t border-gray-100">
        <p className="text-[7.5px] text-gray-400 italic leading-tight">Timeline shows the primary (Mahadasha) cycles. Each period activates the specific results of its lord in your chart.</p>
      </div>
    </div>
  );
};

export const GemstonePanel = ({ data }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};

  // Robustly find the Lagna Sign Index
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Ratna Suggestions</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">Sign data unavailable for calculation</div>
      </div>
    );
  }

  const suggest = (houseIdx) => {
    // Standard Vedic House offset from Lagna
    const signIdx = (lagnaSignIndex + houseIdx - 1) % 12;
    const lord = SIGN_LORDS[signIdx];
    return { ...GEMSTONES[lord], lord, sign: SIGNS[signIdx], house: houseIdx };
  };

  const stones = [
    { label: "Life Stone (Tanu Lord)", ...suggest(1) },
    { label: "Lucky Stone (Putra Lord)", ...suggest(5) },
    { label: "Fortune Stone (Bhagya Lord)", ...suggest(9) }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Ratna Suggestions (Gemstones)</div>
      <div className="flex-1 overflow-auto p-2 space-y-2 custom-scrollbar">
        {stones.map((s, idx) => (
          <div key={idx} className={`p-2 rounded-lg border bg-gradient-to-br ${s.bg} ${s.border} shadow-sm transition-all hover:shadow-md cursor-default`}
            onPointerDown={(e) => {
              e.stopPropagation();
              setBlankSheetItems([
                ...blankSheetItems,
                {
                  uniqueId: Date.now(),
                  contentId: pendingChartSelection,
                  size: size,
                  x: 20 + (blankSheetItems.length * 40),
                  y: 20 + (blankSheetItems.length * 40)
                }
              ]);
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] uppercase font-bold text-gray-500 tracking-wider bg-white/40 px-1 rounded">{s.label}</span>
              <span className="text-[8px] font-mono font-black text-gray-700">{s.lord}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded shadow-inner flex items-center justify-center text-lg bg-white/30 backdrop-blur-sm" style={{ border: `1px solid ${s.color}44` }}>
                {s.name === 'Ruby' && '💎'}
                {s.name === 'Pearl' && '⚪'}
                {s.name === 'Red Coral' && '🏮'}
                {s.name === 'Emerald' && '💚'}
                {s.name === 'Yellow Sapphire' && '🟡'}
                {s.name === 'Diamond' && '💍'}
                {s.name === 'Blue Sapphire' && '💙'}
              </div>
              <div className="flex-1">
                <div className={`text-[11px] font-black ${s.text} uppercase tracking-tighter`}>{s.name}</div>
                <div className="text-[9px] text-gray-500 font-serif italic">{s.hindi}</div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[8px] text-gray-500 bg-white/20 px-1 rounded">House {s.house}</span>
                <span className="text-[8px] font-bold text-gray-600">{s.sign}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-100 p-1.5 rounded text-[8px] text-amber-800 leading-tight">
          <b>Note:</b> These are primary stones based on lagna lordship. Verify planet strength (Shadbala) and position (Dignity) before wearing.
        </div>
      </div>
    </div>
  );
};

// Dignity lookup for all 9 planets
const PLANET_DIGNITY = {
  Sun: { exaltation: ['Aries'], debilitation: ['Libra'], own: ['Leo'], friendly: ['Aries', 'Sagittarius', 'Cancer', 'Scorpio', 'Pisces'], enemy: ['Aquarius', 'Capricorn', 'Libra', 'Virgo'] },
  Moon: { exaltation: ['Taurus'], debilitation: ['Scorpio'], own: ['Cancer'], friendly: ['Aries', 'Leo', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'], enemy: [] },
  Mars: { exaltation: ['Capricorn'], debilitation: ['Cancer'], own: ['Aries', 'Scorpio'], friendly: ['Leo', 'Sagittarius', 'Pisces'], enemy: ['Gemini', 'Virgo'] },
  Mercury: { exaltation: ['Virgo'], debilitation: ['Pisces'], own: ['Gemini', 'Virgo'], friendly: ['Aries', 'Taurus', 'Libra', 'Capricorn'], enemy: ['Cancer', 'Scorpio'] },
  Jupiter: { exaltation: ['Cancer'], debilitation: ['Capricorn'], own: ['Sagittarius', 'Pisces'], friendly: ['Aries', 'Leo', 'Scorpio'], enemy: ['Gemini', 'Virgo', 'Libra', 'Capricorn'] },
  Venus: { exaltation: ['Pisces'], debilitation: ['Virgo'], own: ['Taurus', 'Libra'], friendly: ['Gemini', 'Virgo', 'Capricorn', 'Aquarius'], enemy: ['Aries', 'Scorpio', 'Cancer', 'Leo'] },
  Saturn: { exaltation: ['Libra'], debilitation: ['Aries'], own: ['Capricorn', 'Aquarius'], friendly: ['Gemini', 'Virgo', 'Taurus', 'Libra'], enemy: ['Aries', 'Cancer', 'Leo', 'Scorpio'] },
  Rahu: { exaltation: ['Gemini'], debilitation: ['Sagittarius'], own: ['Gemini'], friendly: ['Libra', 'Taurus', 'Virgo', 'Capricorn', 'Pisces', 'Aries', 'Aquarius'], enemy: ['Leo', 'Cancer'] },
  Ketu: { exaltation: ['Sagittarius'], debilitation: ['Gemini'], own: ['Scorpio'], friendly: ['Libra', 'Taurus', 'Virgo', 'Capricorn', 'Pisces', 'Aries', 'Aquarius'], enemy: ['Leo', 'Cancer'] },
};

const getDignityStatus = (planet, signName) => {
  const d = PLANET_DIGNITY[planet];
  if (!d) return null;
  if (d.exaltation.includes(signName)) return { label: 'Exalted ★', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
  if (d.debilitation.includes(signName)) return { label: 'Debilitated ↓', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (d.own.includes(signName)) return { label: 'Own Sign ◆', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  if (d.friendly.includes(signName)) return { label: 'Friendly ♥', bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' };
  if (d.enemy.includes(signName)) return { label: 'Enemy ✕', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  return { label: 'Neutral', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
};

export const TransitPanel = ({ data, transitPositions, baseChartKey = 'charts', fullSize = false, onChartClick }) => {
  const [language, setLanguage] = useState('en');
  const chartData = baseChartKey === 'charts' ? data.charts : (data.vargas?.[baseChartKey] || data.charts);
  const lagnaHouse = chartData?.houses?.[1] || chartData?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = chartData?.ascendant_sign_index || data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined || !transitPositions) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Today's Transit</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">
          {!transitPositions ? "Fetching Transit Data..." : "Lagna data unavailable"}
        </div>
      </div>
    );
  }

  // Map transits to houses relative to Natal Lagna
  const transitHouses = {};
  const transitEffects = {}; // Add transitEffects object
  for (let i = 1; i <= 12; i++) {
    const signIdx = (lagnaSignIndex + i - 1) % 12;
    transitHouses[i] = {
      house_number: i,
      sign_index: signIdx,
      planets: []
    };
  }

  Object.entries(transitPositions).forEach(([planet, pos]) => {
    // Basic Vedic planets only for transit chart usually
    const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    if (!valid.includes(planet)) return;

    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
    const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
    if (transitHouses[houseNum]) {
      const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
      const isCombust = pos.is_combust || pos.sidereal?.is_combust;

      transitHouses[houseNum].planets.push({
        name: planet,
        is_retrograde: isRetro,
        is_combust: isCombust
      });
      // Determine effect based on house position relative to Lagna
      // Kendra (1,4,7,10) and Kon (1,5,9) are generally considered positive in transit apps
      if ([1, 4, 5, 7, 9, 10].includes(houseNum)) {
        transitEffects[planet] = "positive";
      } else if ([6, 8, 12].includes(houseNum)) {
        transitEffects[planet] = "negative";
      } else {
        transitEffects[planet] = "neutral";
      }
    }
  });

  // Add Natal Lagna (L) to House 1 as a reference
  if (transitHouses[1]) {
    transitHouses[1].planets.unshift("Ascendant");
    transitEffects["Ascendant"] = "neutral";
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="flex-1 p-0 bg-white overflow-auto custom-scrollbar flex flex-col min-h-0">
        <div
          className={(fullSize ? "flex-1 w-full h-full min-h-0 flex items-center justify-center cursor-pointer " : "mb-4 w-[550px] h-[550px] mx-auto shrink-0 cursor-pointer ") + "relative"}
          onClick={onChartClick}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLanguage(l => l === 'en' ? 'hi' : 'en'); }}
            className="absolute top-2 right-2 z-50 px-3 py-1.5 bg-amber-500 text-slate-900 font-bold rounded shadow-sm hover:bg-amber-400 transition text-[10px] uppercase tracking-wide"
          >
            {language === 'en' ? 'A → अ (Hindi)' : 'अ → A (English)'}
          </button>
          <ZodiacChart planetPositions={chartData?.planet_positions || data?.planet_positions}
            houses={chartData?.houses || data.charts?.houses}
            transitHouses={transitHouses}
            title="Today Transit Gochar"
            variant="legacy"
            defaultLang={language}
            key={`transit-chart-${language}`}
            planetEffects={transitEffects} scaleText={1.5} />
        </div>

        {/* Planet in Sign & House Analysis Section */}
        {!fullSize && (
          <div className="p-2 bg-slate-50 border-t border-slate-200 mt-2">
            <h3 className="text-[10px] font-black uppercase tracking-tight mb-3 text-slate-800 text-center">Transit Planet in Sign & House Analysis</h3>
            <div className="space-y-3">
              {Object.entries(transitPositions).map(([planet, pos]) => {
                const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                if (!valid.includes(planet)) return null;

                const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
                const transitHouse = ((signIdx - lagnaSignIndex + 12) % 12) + 1;
                const signName = SIGNS[signIdx];
                const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
                const isCombust = pos.is_combust || pos.sidereal?.is_combust;

                // Look up planet-in-sign data from database
                const planetData = PLANET_IN_SIGN_EFFECTS[planet];
                const signData = planetData?.signs?.[signName];
                const signEffect = signData?.effect;
                const houseEffect = signData?.houses?.[String(transitHouse)];

                const houseLabel = transitHouse === 1 ? '1st' : transitHouse === 2 ? '2nd' : transitHouse === 3 ? '3rd' : `${transitHouse}th`;
                const houseBorderColor = [1, 4, 5, 9, 10].includes(transitHouse) ? 'border-l-green-400' :
                  [6, 8, 12].includes(transitHouse) ? 'border-l-red-400' :
                    'border-l-indigo-300';

                // Dignity status
                const dignity = getDignityStatus(planet, signName);

                return (
                  <section key={planet} className={`bg-white rounded-xl border border-indigo-100 shadow-sm border-l-4 ${houseBorderColor} overflow-hidden relative`}>
                    {/* Watermark house number */}
                    <div className="absolute top-0 right-0 p-3 opacity-[0.04] text-6xl font-black text-indigo-900 pointer-events-none select-none">{transitHouse}</div>

                    {/* Planet header — matches Lagna HouseEffectTable style */}
                    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm shadow-md border border-white/10 flex-shrink-0">✨</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[planet] || '#1e293b' }}>
                            {planet}{isRetro ? '*' : ''}{isCombust ? '#' : ''} Transit
                          </h4>
                          {dignity && (
                            <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase border ${dignity.bg} ${dignity.text} ${dignity.border}`}>
                              {dignity.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{signName} · House {houseLabel}</span>
                          {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase">Vakri ℞</span>}
                          {isCombust && <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded font-black uppercase">Combust</span>}
                        </div>
                      </div>
                    </div>

                    {/* Body — font-serif text-sm matching BulletInterpretation */}
                    <div className="px-4 pb-4 space-y-3">
                      {signEffect ? (
                        <div>
                          <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {signName}</p>
                          <p className="text-sm leading-relaxed text-slate-700 font-serif">
                            {signEffect}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic font-serif">Sign interpretation coming soon.</p>
                      )}
                      {houseEffect && (
                        <div className="pt-3 border-t border-indigo-50">
                          <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {houseLabel} House (Transiting)</p>
                          <p className="text-sm leading-relaxed text-slate-700 font-serif">
                            {houseEffect}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
            <p className="text-[7.5px] text-center text-slate-400 italic mt-3">House colors: 🟢 Kendra/Trikona · 🔴 Dusthana · Dignity: <span className="text-emerald-700 font-bold">Exalted★</span> · <span className="text-red-700 font-bold">Debilitated↓</span> · <span className="text-blue-700 font-bold">Own◆</span> · <span className="text-sky-600 font-bold">Friendly♥</span> · <span className="text-orange-700 font-bold">Enemy✕</span></p>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 p-1 px-2 bg-[#f1f5f9] border-t border-gray-300 flex justify-between items-center text-[7px] text-gray-500 uppercase font-black">
        <span>From Natal Lagna</span>
        <span className="text-blue-600 font-bold">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const RETROGRADE_DATABASE = {
  Saturn: {
    nameHindi: "शनि (Saturn)",
    startDate: "July 27, 2026",
    expiryDate: "December 11, 2026",
    durationDays: 138,
    signDefault: "Pisces",
    overview: "Saturn retrograde (reverse movement of Saturn) is currently in effect in Pisces for a total of 138 days, starting from July 27, 2026, until December 11, 2026. This period is a time for career, discipline, review of past deeds, and re-examination of stalled tasks in life.",
    influences: [
      { title: "Karma and Truth", desc: "This is the time for introspection and correcting your past mistakes." },
      { title: "Workplace", desc: "More caution is needed in job, business and financial matters." },
      { title: "Mental State", desc: "People of some zodiac signs get results only after hard work and mental stress may increase." }
    ],
    remedies: [
      "Donate to the poor on Saturday.",
      'Chant Shani Mantra: "Om Pran Preen Pran Sa: Shanaishcharaya Namah".',
      "Before taking any major decision, check the documents thoroughly."
    ]
  },
  Jupiter: {
    nameHindi: "गुरु (Jupiter)",
    startDate: "October 9, 2026",
    expiryDate: "February 4, 2027",
    durationDays: 118,
    signDefault: "Taurus",
    overview: "Jupiter retrograde is a sacred phase for re-evaluating higher knowledge, spiritual ethics, investments, and long-term mentorship.",
    influences: [
      { title: "Wisdom & Ethics", desc: "Re-align personal values and seek inner spiritual clarity." },
      { title: "Finance & Wealth", desc: "Review investment strategies; avoid speculative financial bets." },
      { title: "Education & Guidance", desc: "Excellent time to revise study material and reconnect with mentors." }
    ],
    remedies: [
      "Offer yellow sweets or gram dal to cows or priests on Thursdays.",
      'Chant Jupiter Mantra: "Om Gram Greem Graum Sah Gurave Namah".',
      "Maintain respect towards teachers, elders, and gurus."
    ]
  },
  Mars: {
    nameHindi: "मंगल (Mars)",
    startDate: "January 10, 2027",
    expiryDate: "April 1, 2027",
    durationDays: 81,
    signDefault: "Cancer",
    overview: "Mars retrograde (reverse movement of Mars) is in effect from January 10, 2027, until April 1, 2027 for a total of 81 days. This period prompts an internal audit of physical energy, ambition, anger control, and real estate projects.",
    influences: [
      { title: "Energy & Courage", desc: "Channel physical strength into constructive projects; avoid aggressive conflicts." },
      { title: "Property & Machinery", desc: "Delay purchase of land or heavy vehicles during deep retrograde peak." },
      { title: "Patience", desc: "Drive carefully and practice breathwork to manage impulse." }
    ],
    remedies: [
      "Recite Hanuman Chalisa daily, especially on Tuesdays.",
      'Chant Mars Mantra: "Om Kram Kreem Kraum Sah Bhaumaya Namah".',
      "Donate red lentils (Masoor dal) to those in need."
    ]
  },
  Mercury: {
    nameHindi: "बुध (Mercury)",
    startDate: "August 12, 2026",
    expiryDate: "September 5, 2026",
    durationDays: 24,
    signDefault: "Leo",
    overview: "Mercury retrograde invites careful communication, review of digital contracts, software code, and travel schedules.",
    influences: [
      { title: "Communication", desc: "Double check emails, texts, and speech to avoid misunderstandings." },
      { title: "Business Contracts", desc: "Thoroughly review fine print in legal agreements before signing." },
      { title: "Technology", desc: "Backup important data and verify travel itineraries." }
    ],
    remedies: [
      "Feed green fodder or spinach to cows on Wednesdays.",
      'Chant Mercury Mantra: "Om Bram Breem Braum Sah Budhaya Namah".',
      "Keep green plants in your workspace."
    ]
  },
  Venus: {
    nameHindi: "शुक्र (Venus)",
    startDate: "March 2, 2027",
    expiryDate: "April 13, 2027",
    durationDays: 42,
    signDefault: "Aries",
    overview: "Venus retrograde focuses on inner harmony, artistic refinement, relationship boundary reviews, and luxury budgets.",
    influences: [
      { title: "Relationships", desc: "Reflect on mutual respect and relationship expectations." },
      { title: "Finances & Aesthetics", desc: "Avoid impulse luxury purchases; focus on budgeting." },
      { title: "Creative Arts", desc: "Revisit past artistic projects and refine creative skills." }
    ],
    remedies: [
      "Donate white clothes or sweets to underprivileged women on Fridays.",
      'Chant Venus Mantra: "Om Dram Dreem Draum Sah Shukraya Namah".',
      "Practice gratitude and artistic self-expression."
    ]
  }
};

const RETROGRADE_EVENTS = [
  // Historical 1426 - 1427 Ephemeris Data (Exact Timestamps & Nakshatras)
  { planet: "Saturn", startDate: "Feb 28, 1426 (Tue at 02:03 AM)", expiryDate: "July 16, 1426", durationDays: 138, sign: "Libra / Scorpio", startMs: new Date("1426-02-28T02:03:00").getTime(), endMs: new Date("1426-07-16").getTime() },
  { planet: "Jupiter", startDate: "Mar 28, 1426 (Tue at 05:15 AM)", expiryDate: "July 26, 1426", durationDays: 120, sign: "Virgo", startMs: new Date("1426-03-28T05:15:00").getTime(), endMs: new Date("1426-07-26").getTime() },
  { planet: "Mars", startDate: "Dec 18, 1426 (Mon at 07:10 PM)", expiryDate: "March 8, 1427", durationDays: 80, sign: "Simha Rashi (Magha Nakshatra)", startMs: new Date("1426-12-18T19:10:00").getTime(), endMs: new Date("1427-03-08").getTime() },
  { planet: "Mercury", startDate: "Mar 11, 1426 (Sat at 03:44 AM)", expiryDate: "April 2, 1426", durationDays: 22, sign: "Pisces / Aries", startMs: new Date("1426-03-11T03:44:00").getTime(), endMs: new Date("1426-04-02").getTime() },
  { planet: "Mercury", startDate: "Jul 14, 1426 (Fri at 09:59 AM)", expiryDate: "August 5, 1426", durationDays: 22, sign: "Cancer / Leo", startMs: new Date("1426-07-14T09:59:00").getTime(), endMs: new Date("1426-08-05").getTime() },
  { planet: "Mercury", startDate: "Nov 04, 1426 (Sat at 06:29 PM)", expiryDate: "November 26, 1426", durationDays: 22, sign: "Scorpio", startMs: new Date("1426-11-04T18:29:00").getTime(), endMs: new Date("1426-11-26").getTime() },
  { planet: "Venus", startDate: "Mar 22, 1427 (Thu at 12:03 AM)", expiryDate: "May 3, 1427", durationDays: 42, sign: "Taurus / Aries", startMs: new Date("1427-03-22T00:03:00").getTime(), endMs: new Date("1427-05-03").getTime() },

  // Saturn
  { planet: "Saturn", startDate: "June 29, 2024", expiryDate: "November 15, 2024", durationDays: 139, sign: "Aquarius", startMs: new Date("2024-06-29").getTime(), endMs: new Date("2024-11-15").getTime() },
  { planet: "Saturn", startDate: "July 13, 2025", expiryDate: "November 28, 2025", durationDays: 138, sign: "Pisces", startMs: new Date("2025-07-13").getTime(), endMs: new Date("2025-11-28").getTime() },
  { planet: "Saturn", startDate: "July 27, 2026", expiryDate: "December 11, 2026", durationDays: 138, sign: "Pisces", startMs: new Date("2026-07-27").getTime(), endMs: new Date("2026-12-11").getTime() },
  { planet: "Saturn", startDate: "August 10, 2027", expiryDate: "December 24, 2027", durationDays: 136, sign: "Aries", startMs: new Date("2027-08-10").getTime(), endMs: new Date("2027-12-24").getTime() },
  { planet: "Saturn", startDate: "August 23, 2028", expiryDate: "January 6, 2029", durationDays: 136, sign: "Aries", startMs: new Date("2028-08-23").getTime(), endMs: new Date("2029-01-06").getTime() },
  { planet: "Saturn", startDate: "August 23, 2029", expiryDate: "January 6, 2030", durationDays: 136, sign: "Aries / Taurus", startMs: new Date("2029-08-23").getTime(), endMs: new Date("2030-01-06").getTime() },
  { planet: "Saturn", startDate: "September 5, 2030", expiryDate: "January 19, 2031", durationDays: 136, sign: "Taurus", startMs: new Date("2030-09-05").getTime(), endMs: new Date("2031-01-19").getTime() },

  // Jupiter
  { planet: "Jupiter", startDate: "October 9, 2024", expiryDate: "February 4, 2025", durationDays: 118, sign: "Taurus", startMs: new Date("2024-10-09").getTime(), endMs: new Date("2025-02-04").getTime() },
  { planet: "Jupiter", startDate: "November 11, 2025", expiryDate: "March 11, 2026", durationDays: 120, sign: "Gemini", startMs: new Date("2025-11-11").getTime(), endMs: new Date("2026-03-11").getTime() },
  { planet: "Jupiter", startDate: "December 13, 2026", expiryDate: "April 12, 2027", durationDays: 120, sign: "Cancer", startMs: new Date("2026-12-13").getTime(), endMs: new Date("2027-04-12").getTime() },

  // Mars
  { planet: "Mars", startDate: "December 6, 2024", expiryDate: "February 24, 2025", durationDays: 80, sign: "Cancer / Gemini", startMs: new Date("2024-12-06").getTime(), endMs: new Date("2025-02-24").getTime() },
  { planet: "Mars", startDate: "January 10, 2027", expiryDate: "April 1, 2027", durationDays: 81, sign: "Leo / Cancer", startMs: new Date("2027-01-10").getTime(), endMs: new Date("2027-04-01").getTime() },

  // Mercury
  { planet: "Mercury", startDate: "April 1, 2024", expiryDate: "April 25, 2024", durationDays: 24, sign: "Aries", startMs: new Date("2024-04-01").getTime(), endMs: new Date("2024-04-25").getTime() },
  { planet: "Mercury", startDate: "August 5, 2024", expiryDate: "August 28, 2024", durationDays: 23, sign: "Leo / Virgo", startMs: new Date("2024-08-05").getTime(), endMs: new Date("2024-08-28").getTime() },
  { planet: "Mercury", startDate: "November 25, 2024", expiryDate: "December 15, 2024", durationDays: 20, sign: "Sagittarius", startMs: new Date("2024-11-25").getTime(), endMs: new Date("2024-12-15").getTime() },

  { planet: "Mercury", startDate: "March 15, 2025", expiryDate: "April 7, 2025", durationDays: 23, sign: "Aries / Pisces", startMs: new Date("2025-03-15").getTime(), endMs: new Date("2025-04-07").getTime() },
  { planet: "Mercury", startDate: "July 18, 2025", expiryDate: "August 11, 2025", durationDays: 24, sign: "Cancer / Leo", startMs: new Date("2025-07-18").getTime(), endMs: new Date("2025-08-11").getTime() },
  { planet: "Mercury", startDate: "November 9, 2025", expiryDate: "November 29, 2025", durationDays: 20, sign: "Scorpio", startMs: new Date("2025-11-09").getTime(), endMs: new Date("2025-11-29").getTime() },

  { planet: "Mercury", startDate: "February 26, 2026", expiryDate: "March 20, 2026", durationDays: 22, sign: "Pisces / Aquarius", startMs: new Date("2026-02-26").getTime(), endMs: new Date("2026-03-20").getTime() },
  { planet: "Mercury", startDate: "June 29, 2026", expiryDate: "July 23, 2026", durationDays: 24, sign: "Gemini / Cancer", startMs: new Date("2026-06-29").getTime(), endMs: new Date("2026-07-23").getTime() },
  { planet: "Mercury", startDate: "October 24, 2026", expiryDate: "November 13, 2026", durationDays: 20, sign: "Libra / Scorpio", startMs: new Date("2026-10-24").getTime(), endMs: new Date("2026-11-13").getTime() },

  { planet: "Mercury", startDate: "February 9, 2027", expiryDate: "March 3, 2027", durationDays: 22, sign: "Aquarius", startMs: new Date("2027-02-09").getTime(), endMs: new Date("2027-03-03").getTime() },
  { planet: "Mercury", startDate: "June 10, 2027", expiryDate: "July 4, 2027", durationDays: 24, sign: "Taurus / Gemini", startMs: new Date("2027-06-10").getTime(), endMs: new Date("2027-07-04").getTime() },
  { planet: "Mercury", startDate: "October 7, 2027", expiryDate: "October 28, 2027", durationDays: 21, sign: "Virgo / Libra", startMs: new Date("2027-10-07").getTime(), endMs: new Date("2027-10-28").getTime() },

  // Venus
  { planet: "Venus", startDate: "March 2, 2025", expiryDate: "April 13, 2025", durationDays: 42, sign: "Aries / Pisces", startMs: new Date("2025-03-02").getTime(), endMs: new Date("2025-04-13").getTime() },
  { planet: "Venus", startDate: "October 3, 2026", expiryDate: "November 14, 2026", durationDays: 42, sign: "Scorpio / Libra", startMs: new Date("2026-10-03").getTime(), endMs: new Date("2026-11-14").getTime() }
];

const getRetrogradeEventsForYear = (selectedYear) => {
  const exactEvents = RETROGRADE_EVENTS.filter(e => {
    const startY = new Date(e.startMs).getFullYear();
    const endY = new Date(e.endMs).getFullYear();
    return startY === selectedYear || endY === selectedYear;
  });

  const planetsToInclude = ["Saturn", "Jupiter", "Mars", "Venus", "Mercury"];
  const finalEvents = [];

  planetsToInclude.forEach(planet => {
    const pEvents = exactEvents.filter(e => e.planet === planet);
    if (pEvents.length > 0) {
      pEvents.forEach(pe => finalEvents.push(pe));
    } else {
      // Dynamic ephemeris calculation with 1426 as the base calculation anchor year
      const diffY = selectedYear - 1426;

      if (planet === "Saturn") {
        // Anchor to modern base: August 23, 2029
        const diffY2029 = selectedYear - 2029;
        const sStart = new Date(2029, 7, 23);
        sStart.setDate(sStart.getDate() + Math.round(diffY2029 * 378.09));
        const sEnd = new Date(sStart);
        sEnd.setDate(sEnd.getDate() + 136);
        const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const signIdx = (Math.floor(diffY2029 / 2.5) + 1200) % 12;
        finalEvents.push({
          planet: "Saturn",
          startDate: sStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          expiryDate: sEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          durationDays: 136,
          sign: signs[signIdx],
          startMs: sStart.getTime(),
          endMs: sEnd.getTime()
        });
      } else if (planet === "Jupiter") {
        // Base Jupiter 2026: Dec 13, 2026
        const diffY2026 = selectedYear - 2026;
        const jStart = new Date(2026, 11, 13);
        jStart.setDate(jStart.getDate() + Math.round(diffY2026 * 398.88));
        const jEnd = new Date(jStart);
        jEnd.setDate(jEnd.getDate() + 120);
        const signs = ["Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini"];
        const signIdx = (diffY2026 + 1200) % 12;
        finalEvents.push({
          planet: "Jupiter",
          startDate: jStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          expiryDate: jEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          durationDays: 120,
          sign: signs[signIdx],
          startMs: jStart.getTime(),
          endMs: jEnd.getTime()
        });
      } else if (planet === "Mars") {
        // Base Mars 1426: Dec 18, 1426 (Simha Rashi)
        if (Math.abs(diffY) % 2 === 0) {
          const mStart = new Date(selectedYear, 11, 18);
          const mEnd = new Date(mStart);
          mEnd.setDate(mEnd.getDate() + 80);
          finalEvents.push({
            planet: "Mars",
            startDate: mStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            expiryDate: mEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            durationDays: 80,
            sign: "Simha (Leo) / Cancer",
            startMs: mStart.getTime(),
            endMs: mEnd.getTime()
          });
        }
      } else if (planet === "Venus") {
        // Base Venus 1427: Mar 22, 1427
        if (Math.abs(selectedYear - 1427) % 3 !== 1) {
          const vStart = new Date(selectedYear, 2, 22);
          const vEnd = new Date(vStart);
          vEnd.setDate(vEnd.getDate() + 42);
          finalEvents.push({
            planet: "Venus",
            startDate: vStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            expiryDate: vEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            durationDays: 42,
            sign: "Taurus / Aries",
            startMs: vStart.getTime(),
            endMs: vEnd.getTime()
          });
        }
      } else if (planet === "Mercury") {
        // Base Mercury 1426: Mar 11, Jul 14, Nov 04
        [
          { m: 2, d: 11, sign: "Pisces / Aries" },
          { m: 6, d: 14, sign: "Cancer / Leo" },
          { m: 10, d: 4, sign: "Scorpio / Sagittarius" }
        ].forEach((cycle) => {
          const mStart = new Date(selectedYear, cycle.m, cycle.d);
          const mEnd = new Date(mStart);
          mEnd.setDate(mEnd.getDate() + 22);
          finalEvents.push({
            planet: "Mercury",
            startDate: mStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            expiryDate: mEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            durationDays: 22,
            sign: cycle.sign,
            startMs: mStart.getTime(),
            endMs: mEnd.getTime()
          });
        });
      }
    }
  });

  return finalEvents;
};

const RETROGRADE_BENEFIT_SIGN_DATABASE = {
  "Saturn": {
    benefitedSigns: [
      { sign: "Capricorn (मकर)", reason: "Swakshetra (Own Sign) – Provides stability, discipline & karmic rewards." },
      { sign: "Aquarius (कुंभ)", reason: "Moolatrikona (Own Sign) – High executive power & financial endurance." },
      { sign: "Libra (तुला)", reason: "Uchha Rashi (Exaltation) – Justice, career elevation & public recognition." },
      { sign: "Taurus (वृषभ) & Gemini (मिथुन)", reason: "Mitra Rashi (Friendly Signs) – Upachaya house gains." }
    ],
    challengedSigns: [
      { sign: "Aries (मेष)", reason: "Neecha Rashi (Debilitation) – Extreme delays, physical fatigue & frustration." },
      { sign: "Leo (सिंह) & Cancer (कर्क)", reason: "Shatru Rashi (Enemy Signs) – Heavy emotional stress & workplace friction." }
    ]
  },
  "Jupiter": {
    benefitedSigns: [
      { sign: "Sagittarius (धनु)", reason: "Swakshetra (Own Sign) – Wisdom, luck, higher learning & spiritual grace." },
      { sign: "Pisces (मीन)", reason: "Swakshetra (Own Sign) – Financial recovery, peace & mentor support." },
      { sign: "Cancer (कर्क)", reason: "Uchha Rashi (Exaltation) – Family happiness, wealth & emotional fulfillment." },
      { sign: "Aries (मेष) & Scorpio (वृश्चिक)", reason: "Mitra Rashi – Auspicious 5th/9th house trine blessings." }
    ],
    challengedSigns: [
      { sign: "Capricorn (मकर)", reason: "Neecha Rashi (Debilitation) – Misjudgment in investments & health neglect." },
      { sign: "Gemini (मिथुन) & Virgo (कन्या)", reason: "Shatru Rashi – Overthinking & intellectual fatigue." }
    ]
  },
  "Mars": {
    benefitedSigns: [
      { sign: "Aries (मेष) & Scorpio (वृश्चिक)", reason: "Swakshetra (Own Signs) – High energy, courage & physical strength." },
      { sign: "Capricorn (मकर)", reason: "Uchha Rashi (Exaltation) – Victory in competitions & property/land gains." }
    ],
    challengedSigns: [
      { sign: "Cancer (कर्क)", reason: "Neecha Rashi (Debilitation) – Restlessness, rash decisions & minor injuries." },
      { sign: "Gemini (मिथुन) & Virgo (कन्या)", reason: "Shatru Rashi – Arguments & impatience in partnerships." }
    ]
  },
  "Venus": {
    benefitedSigns: [
      { sign: "Taurus (वृषभ) & Libra (तुला)", reason: "Swakshetra (Own Signs) – Relationship harmony, creative luxury & wealth." },
      { sign: "Pisces (मीन)", reason: "Uchha Rashi (Exaltation) – Spiritual love, sudden luck & artistic breakthroughs." }
    ],
    challengedSigns: [
      { sign: "Virgo (कन्या)", reason: "Neecha Rashi (Debilitation) – Relationship friction & financial overspending." }
    ]
  },
  "Mercury": {
    benefitedSigns: [
      { sign: "Gemini (मिथुन)", reason: "Swakshetra (Own Sign) – Analytical clarity & business contract success." },
      { sign: "Virgo (कन्या)", reason: "Uchha Rashi (Exaltation) – Financial acumen & strategic intelligence." }
    ],
    challengedSigns: [
      { sign: "Pisces (मीन)", reason: "Neecha Rashi (Debilitation) – Communication errors & electronic glitches." }
    ]
  }
};

const VakriMargiInsightPanel = ({ transitPositions, currentDate }) => {
  if (!transitPositions) return null;

  const validPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const retrogradeList = [];
  const directList = [];

  Object.entries(transitPositions).forEach(([planet, pos]) => {
    if (!validPlanets.includes(planet)) return;
    const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor((pos.sidereal?.lon || pos.lon || 0) / 30);
    const signName = SIGNS[signIdx] || "Pisces";

    if (isRetro && planet !== "Rahu" && planet !== "Ketu") {
      retrogradeList.push({ planet, signName, pos });
    } else {
      directList.push({ planet, signName, pos });
    }
  });

  const initialYear = currentDate ? new Date(currentDate).getFullYear() : 2026;
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedPlanet, setSelectedPlanet] = useState(retrogradeList.length > 0 ? retrogradeList[0].planet : "Saturn");
  const [backendEvents, setBackendEvents] = useState([]);
  const [backendBenefitData, setBackendBenefitData] = useState(null);

  // Year options dropdown starting from 1426 up to 2050
  const yearOptions = Array.from({ length: 625 }, (_, i) => 1426 + i);

  useEffect(() => {
    if (retrogradeList.length > 0) {
      const isSelectedRetro = retrogradeList.some(r => r.planet === selectedPlanet);
      if (!isSelectedRetro) {
        setSelectedPlanet(retrogradeList[0].planet);
      }
    }
  }, [currentDate, transitPositions]);

  // Fetch exact Swiss Ephemeris retrograde start/end dates from Python backend
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/vakri-yearly-explorer?year=${selectedYear}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data && data.events && data.events.length > 0) {
          setBackendEvents(data.events);
        }
      })
      .catch(err => console.log("Backend vakri fetch fallback:", err));

    return () => { isMounted = false; };
  }, [selectedYear]);

  // Fetch Parashara Benefited vs Challenged Zodiac Signs calculation from Python backend
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/vakri-benefited-challenged-signs?planet=${selectedPlanet}&year=${selectedYear}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data) {
          setBackendBenefitData(data);
        }
      })
      .catch(err => console.error("Backend benefit signs fetch error:", err));

    return () => { isMounted = false; };
  }, [selectedPlanet, selectedYear]);

  const activePlanetInfo = RETROGRADE_DATABASE[selectedPlanet] || RETROGRADE_DATABASE["Saturn"];
  const targetDateObj = currentDate ? new Date(currentDate) : new Date();
  const targetMs = targetDateObj.getTime();

  // Prefer backend calculated events (Swiss Ephemeris), with fallback to local ephemeris engine
  const yearAllEvents = backendEvents.length > 0 ? backendEvents : getRetrogradeEventsForYear(selectedYear);

  // Find retrograde events for selected planet matching selectedYear
  let matchedEvent = yearAllEvents.find(e => e.planet === selectedPlanet);
  if (!matchedEvent) {
    const planetEvents = RETROGRADE_EVENTS.filter(e => e.planet === selectedPlanet);
    matchedEvent = planetEvents.find(e => targetMs >= (e.startMs - 86400000) && targetMs <= (e.endMs + 86400000)) || planetEvents[0];
  }

  const startDate = matchedEvent?.startDate || activePlanetInfo.startDate;
  const expiryDate = matchedEvent?.expiryDate || activePlanetInfo.expiryDate;
  const durationDays = matchedEvent?.durationDays || activePlanetInfo.durationDays;

  const currentTransitData = transitPositions[selectedPlanet] || {};
  const currentSignIdx = currentTransitData.sidereal?.sign_index !== undefined
    ? currentTransitData.sidereal.sign_index
    : Math.floor((currentTransitData.sidereal?.lon || currentTransitData.lon || 0) / 30);
  const currentSignName = matchedEvent?.sign || SIGNS[currentSignIdx] || activePlanetInfo.signDefault || "Pisces";
  const isCurrentlyRetrograde = currentTransitData.is_retrograde || currentTransitData.sidereal?.is_retrograde;

  const dynamicOverview = `${selectedPlanet} retrograde (Vakri ℞ movement) for Year ${selectedYear} is in effect from ${startDate} until ${expiryDate} for a total of ${durationDays} days in ${currentSignName}. This period is a key astrological phase for introspection, reviewing past actions, career audit, and refining long-term goals.`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl font-serif">℞</div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3">
              <span>🌀</span> Gochar Transit Intelligence
            </div>
            <h3 className="text-3xl font-black italic tracking-tight text-white uppercase">Vakri & Margi Planetary Movement Insights</h3>
            <p className="text-xs text-amber-200/80 mt-1 max-w-2xl font-serif leading-relaxed">
              Real-time analysis of celestial planetary direction (Vakri / Retrograde & Margi / Direct), sign durations, career impacts, and remedies.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-amber-500/20 border border-amber-400/30 px-4 py-3 rounded-2xl text-center">
              <p className="text-2xl font-black text-amber-300">{retrogradeList.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-200">Vakri Active</p>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 rounded-2xl text-center">
              <p className="text-2xl font-black text-emerald-300">{directList.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">Margi Direct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Year Selector Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-[18px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2">
              <span>📅</span> Dynamic Yearly Vakri (Retrograde) Movement Explorer
            </span>
            <p className="text-[16px] text-slate-300 font-serif mt-0.5">Select any year from the dropdown or click quick year pills to explore planetary Vakri periods.</p>
          </div>

          {/* Dynamic Year Dropdown Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-amber-400/30">
            <label htmlFor="yearSelect" className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Select Year:
            </label>
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-900 text-amber-300 font-black text-sm px-3 py-1.5 rounded-xl border border-amber-500/40 outline-none cursor-pointer focus:ring-2 focus:ring-amber-400"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Year Pills */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick Select:</span>
          {[1426, 1427, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer border ${selectedYear === year
                ? 'bg-amber-500 text-black border-amber-300 shadow-lg scale-105 ring-2 ring-amber-300/50'
                : 'bg-white/10 text-slate-200 border-white/10 hover:bg-amber-500/20 hover:text-white'
                }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Yearly Vakri Events Summary Grid */}
        {yearAllEvents.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-[16px] font-black uppercase tracking-widest text-amber-400 mb-2">
              Planets in Vakri (Retrograde) Motion during Year {selectedYear} ({yearAllEvents.length} Events):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {yearAllEvents.map((ev, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPlanet(ev.planet)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedPlanet === ev.planet
                    ? 'bg-amber-500/20 border-amber-400/60 shadow-md ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-bold text-orange-400">{ev.planet}</span>
                    <span className="text-[14px] font-bold px-1.5 py-0.5 bg-white text-black rounded border border-amber-500/30 uppercase">
                      {ev.durationDays} Days
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold text-emerald-200 mt-1">
                    {ev.startDate} → {ev.expiryDate}
                  </p>
                  <p className="text-[14px] text-yellow-200 font-serif mt-0.5 italic">
                    Sign: {ev.sign}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Planet Selector Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md space-y-3">
        <p className="text-[18px] font-black uppercase tracking-wider text-slate-900 text-center">Select Planet for Retrograde & Transit Analysis</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Saturn", "Jupiter", "Mars", "Mercury", "Venus"].map((p) => {
            const pData = transitPositions[p] || {};
            const pRetro = pData.is_retrograde || pData.sidereal?.is_retrograde;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlanet(p)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${selectedPlanet === p
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
              >
                <span>{p}</span>
                {pRetro ? (
                  <span className="px-1.5 py-0.5 bg-amber-900 text-amber-200 text-[8px] rounded font-extrabold">Vakri ℞</span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] rounded font-extrabold">Margi</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Planet Retrograde Card */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-amber-200 shadow-xl space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-100 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {isCurrentlyRetrograde ? '℞' : '🪐'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activePlanetInfo.nameHindi || selectedPlanet} Retrograde Analysis</h4>
                {isCurrentlyRetrograde ? (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">Vakri ℞ Currently Active</span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider">Currently Margi (Direct)</span>
                )}
              </div>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mt-1">Position: {currentSignName}</p>
            </div>
          </div>
        </div>

        {/* Overview Text */}
        <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80">
          <p className="text-[16px] font-serif italic text-slate-900 leading-relaxed">
            "{dynamicOverview}"
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <p className="text-[14px] font-black uppercase tracking-wider text-orange-400">Start Date</p>
            <p className="text-[14px] font-bold text-slate-800 mt-1">{startDate}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <p className="text-[14px] font-black uppercase tracking-wider text-orange-400">Expiry Date</p>
            <p className="text-[14px] font-bold text-slate-800 mt-1">{expiryDate}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <p className="text-[14px] font-black uppercase tracking-wider text-orange-400">Zodiac Sign</p>
            <p className="text-[14px] font-bold text-indigo-900 mt-1">{currentSignName}</p>
          </div>
          <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200 text-center">
            <p className="text-[14px] font-black uppercase tracking-wider text-amber-800">Total Duration</p>
            <p className="text-[14px] font-black text-amber-900 mt-1">{durationDays} Days</p>
          </div>
        </div>

        {/* Benefited (शुभ), Neutral (सम) & Challenged (अशुभ) Zodiac Signs Analysis for Selected Retrograde Planet */}
        {(() => {
          const benefitInfo = backendBenefitData || RETROGRADE_BENEFIT_SIGN_DATABASE[selectedPlanet] || RETROGRADE_BENEFIT_SIGN_DATABASE["Saturn"];
          const neutralSigns = benefitInfo.neutralSigns || [];
          return (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white space-y-6 border border-amber-500/30 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-1.5">
                    <span>⚖️</span> Vedic Astrology Principles (पराशर सिद्धांत)
                  </span>
                  <h5 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1">
                    {selectedPlanet} Vakri Impact in Year {selectedYear}: Benefited, Neutral & Challenged Signs
                  </h5>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black uppercase tracking-wider">
                  Cheshta Bala Active
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Benefited Signs */}
                <div className="bg-emerald-950/50 p-5 rounded-2xl border border-emerald-500/40 space-y-4">
                  <h6 className="text-base font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                    <span>✨</span> Benefited Signs (शुभ प्रभाव)
                  </h6>
                  <div className="space-y-3">
                    {benefitInfo.benefitedSigns && benefitInfo.benefitedSigns.map((item, idx) => (
                      <div key={idx} className="bg-emerald-900 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                        <p className="text-[18px] font-bold text-emerald-100 uppercase tracking-tight">{item.sign}</p>
                        <p className="text-[16px] text-emerald-100 font-serif leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Effect Signs */}
                <div className="bg-amber-950/50 p-5 rounded-2xl border border-amber-500/40 space-y-4">
                  <h6 className="text-base font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 border-b border-amber-500/30 pb-2">
                    <span>⚖️</span> Neutral Effect Signs (सम प्रभाव)
                  </h6>
                  <div className="space-y-3">
                    {neutralSigns.length > 0 ? (
                      neutralSigns.map((item, idx) => (
                        <div key={idx} className="bg-amber-900/40 p-3.5 rounded-xl border border-amber-500/30 space-y-1">
                          <p className="text-[18px] font-bold text-amber-200 uppercase tracking-tight">{item.sign}</p>
                          <p className="text-[16px] text-amber-100 font-serif leading-relaxed">{item.reason}</p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-amber-900/30 p-3.5 rounded-xl border border-amber-500/20 text-xs text-amber-200/80 font-serif italic">
                        All 12 signs fall cleanly into Benefited or Challenged categories for this transit.
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenged Signs */}
                <div className="bg-rose-950/50 p-5 rounded-2xl border border-rose-500/40 space-y-4">
                  <h6 className="text-base font-black uppercase tracking-wider text-rose-300 flex items-center gap-2 border-b border-rose-500/30 pb-2">
                    <span>⚠️</span> Challenged Signs (अशुभ / सावधानी)
                  </h6>
                  <div className="space-y-3">
                    {benefitInfo.challengedSigns && benefitInfo.challengedSigns.map((item, idx) => (
                      <div key={idx} className="bg-rose-900/40 p-3.5 rounded-xl border border-rose-500/30 space-y-1">
                        <p className="text-[18px] font-bold text-rose-200 uppercase tracking-tight">{item.sign}</p>
                        <p className="text-[16px] text-rose-100 font-serif leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-amber-200 font-serif italic leading-relaxed">
                💡 <strong>Vedic Classification:</strong> Benefited signs experience growth through Upachaya/Trine house alignment; Neutral signs experience balanced, steady progress; Challenged signs require extra patience & health awareness.
              </div>
            </div>
          );
        })()}

        {/* Astrological Influences */}
        <div>
          <h5 className="text-lg font-black uppercase text-slate-800 tracking-tight mb-4 flex items-center gap-2">
            <span>🌟</span> Astrological Influences (ज्योतिषीय प्रभाव)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePlanetInfo.influences.map((inf, idx) => (
              <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors space-y-2">
                <p className="text-[18px] font-black uppercase tracking-wider text-indigo-900">{inf.title}</p>
                <p className="text-[16px] text-slate-900 font-serif leading-relaxed">{inf.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention & Measures */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white space-y-4 border border-slate-800">
          <h5 className="text-lg font-black uppercase text-amber-400 tracking-tight flex items-center gap-2">
            <span>🛡️</span> Prevention & Measures (निवारण एवं उपाय)
          </h5>
          <ul className="space-y-3 text-[16px] font-serif leading-relaxed text-orange-400">
            {activePlanetInfo.remedies.map((rem, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-amber-400 font-bold">✦</span>
                <span>{rem}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Direct Planets (Margi) Summary Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
        <h4 className="text-xl font-black uppercase tracking-tight text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
          <span>🌿</span> Live Transit Motion Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {validPlanets.map((planet) => {
            if (planet === "Rahu" || planet === "Ketu") return null;
            const pData = transitPositions[planet] || {};
            const isRetro = pData.is_retrograde || pData.sidereal?.is_retrograde;
            const signIdx = pData.sidereal?.sign_index !== undefined ? pData.sidereal.sign_index : Math.floor((pData.sidereal?.lon || pData.lon || 0) / 30);
            const signName = SIGNS[signIdx] || "Pisces";

            return (
              <div key={planet} className={`p-3.5 rounded-2xl border flex items-center justify-between ${isRetro ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'}`}>
                <div>
                  <p className="text-xs font-black uppercase text-slate-800">{planet}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isRetro ? 'text-amber-800' : 'text-emerald-800'}`}>{signName}</p>
                </div>
                {isRetro ? (
                  <span className="px-2 py-0.5 bg-amber-600 text-white rounded-md text-[8px] font-black uppercase tracking-widest">Vakri ℞</span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[8px] font-black uppercase tracking-widest">Margi</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const calculateTransitSphutaDrishti = (transitPositions) => {
  if (!transitPositions) return null;

  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const longitudes = {};

  planets.forEach(p => {
    const data = transitPositions[p];
    if (data) {
      longitudes[p] = data.degree !== undefined ? data.degree : (data.sidereal?.fullDegree || data.sidereal?.lon || data.lon || 0);
    }
  });

  const specialAspectTargets = {
    "Saturn": [60.0, 270.0],
    "Mars": [90.0, 210.0],
    "Jupiter": [120.0, 240.0],
    "Rahu": [120.0, 240.0],
    "Ketu": [120.0, 240.0]
  };

  const calculateSingleAspect = (lon1, lon2, planet) => {
    let diff = (lon2 - lon1) % 360.0;
    if (diff < 0) diff += 360.0;

    let genAspect = 0.0;
    if (diff >= 30.0 && diff < 60.0) genAspect = (diff - 30.0) / 2.0;
    else if (diff >= 60.0 && diff < 90.0) genAspect = 15.0 + (diff - 60.0) / 2.0;
    else if (diff >= 90.0 && diff < 120.0) genAspect = 30.0 + (diff - 90.0) / 2.0;
    else if (diff >= 120.0 && diff < 150.0) genAspect = 45.0 - (diff - 120.0) / 2.0;
    else if (diff >= 150.0 && diff < 180.0) genAspect = 30.0 + (diff - 150.0);
    else if (diff >= 180.0 && diff < 210.0) genAspect = 60.0 - (diff - 180.0) * 2.0;
    else if (diff >= 270.0 && diff < 300.0) genAspect = (diff - 270.0) / 2.0;
    else if (diff >= 300.0 && diff < 330.0) genAspect = 15.0 - (diff - 300.0) / 2.0;

    genAspect = Math.max(0.0, genAspect);

    let specialAspect = 0.0;
    if (specialAspectTargets[planet]) {
      for (const target of specialAspectTargets[planet]) {
        const dist = Math.abs(diff - target);
        if (dist < 15.0) {
          const val = 60.0 * (1.0 - (dist / 15.0));
          specialAspect = Math.max(specialAspect, val);
        }
      }
    }

    return Math.round(Math.max(genAspect, specialAspect));
  };

  const matrix = {};
  planets.forEach(p1 => {
    matrix[p1] = {};
    planets.forEach(p2 => {
      if (p1 === p2 || longitudes[p1] === undefined || longitudes[p2] === undefined) {
        matrix[p1][p2] = 0;
      } else {
        matrix[p1][p2] = calculateSingleAspect(longitudes[p1], longitudes[p2], p1);
      }
    });
  });

  return matrix;
};

const AsthUdayAnalysisPanel = ({ transitPositions }) => {
  if (!transitPositions) return null;

  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!transitPositions) return;

    fetch('/api/calculate-asth-uday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transitPositions })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data && data.results) {
          setBackendData(data);
        }
      })
      .catch(err => console.log("Backend Asth Uday fetch fallback:", err));

    return () => { isMounted = false; };
  }, [transitPositions]);

  const sunData = transitPositions["Sun"] || {};
  const sunLon = sunData.sidereal?.lon !== undefined ? sunData.sidereal.lon : (sunData.lon || 0);

  const COMBUSTION_THRESHOLDS = {
    "Mars": 17.0,
    "Mercury": 14.0, // 12.0 if retrograde
    "Jupiter": 11.0,
    "Venus": 10.0,   // 8.0 if retrograde
    "Saturn": 15.0,
    "Moon": 12.0
  };

  const planetsToAnalyze = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const localAnalysisResults = planetsToAnalyze.map(planet => {
    const pData = transitPositions[planet] || {};
    const planetLon = pData.sidereal?.lon !== undefined ? pData.sidereal.lon : (pData.lon || 0);
    const isRetro = pData.is_retrograde || pData.sidereal?.is_retrograde || false;
    const signIdx = pData.sidereal?.sign_index !== undefined ? pData.sidereal.sign_index : Math.floor(planetLon / 30);
    const signName = SIGNS[signIdx] || "Pisces";

    let rawDiff = Math.abs(planetLon - sunLon) % 360.0;
    let angularDistance = Math.min(rawDiff, 360.0 - rawDiff);

    let threshold = COMBUSTION_THRESHOLDS[planet] || null;
    if (planet === "Mercury" && isRetro) threshold = 12.0;
    if (planet === "Venus" && isRetro) threshold = 8.0;

    let isAsth = false;
    let statusText = "Uday (Risen / उदय ✨)";
    let statusColor = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";

    if (planet === "Rahu" || planet === "Ketu") {
      statusText = "Shadow Node (N/A)";
      statusColor = "bg-slate-100 text-slate-700 border-slate-300";
    } else if (threshold !== null && angularDistance <= threshold) {
      isAsth = true;
      statusText = "Asth (Combust / अस्तागत 💥)";
      statusColor = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
    }

    return {
      planet,
      signName,
      planetDegree: (planetLon % 30).toFixed(2),
      angularDistance: angularDistance.toFixed(2),
      threshold: threshold ? `${threshold}°` : "N/A",
      isRetro,
      isAsth,
      statusText,
      statusColor
    };
  });

  const localSunSignName = SIGNS[Math.floor(sunLon / 30)] || "Aries";
  const localSunDegree = (sunLon % 30).toFixed(2);

  const analysisResults = backendData?.results || localAnalysisResults;
  const sunSignName = backendData?.sunSign || localSunSignName;
  const sunDegree = backendData?.sunDegree || localSunDegree;

  return (
    <div className="space-y-8 max-w-5xl mx-auto my-6 animate-in fade-in duration-500">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl font-serif">☀️</div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-black uppercase tracking-widest text-amber-300 mb-3">
            <span>✨</span> Surya Siddhanta Classical Principles
          </div>
          <h3 className="text-3xl font-black italic tracking-tight text-white uppercase">Planetary Asth & Uday Analysis (अस्त एवं उदय)</h3>
          <p className="text-sm text-amber-200/80 mt-1 max-w-2xl font-serif leading-relaxed">
            Real-time evaluation of planetary combustion (Asth) and rising (Uday) status based on exact angular distance from the Sun.
          </p>
        </div>
      </div>

      {/* Asth & Uday Table */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-amber-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Planetary Asth (Combust) & Uday (Risen) Status Table</h4>
            <p className="text-[18px] text-slate-600 font-serif mt-0.5">
              Sun Reference Position: <strong className="text-amber-700">{sunSignName} ({sunDegree}°)</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-black uppercase border border-rose-300">
              Combust: {analysisResults.filter(r => r.isAsth).length} Planets
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase border border-emerald-300">
              Risen (Uday): {analysisResults.filter(r => !r.isAsth && r.planet !== "Rahu" && r.planet !== "Ketu").length} Planets
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-amber-300 text-xs uppercase font-black tracking-wider border-b border-slate-700">
                <th className="p-3.5 rounded-tl-2xl">Planet</th>
                <th className="p-3.5">Zodiac Sign & Degree</th>
                <th className="p-3.5">Dist. from Sun (°)|Δλ|</th>
                <th className="p-3.5">Asth Orb Threshold</th>
                <th className="p-3.5">Motion State</th>
                <th className="p-3.5 rounded-tr-2xl">Calculated Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-serif">
              {analysisResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 font-sans flex items-center gap-2">
                    <span className="text-lg">🪐</span>
                    <span className="text-[15px]">{row.planet}</span>
                  </td>
                  <td className="p-3.5 font-sans font-semibold text-[14px] text-indigo-950">
                    {row.signName} ({row.planetDegree}°)
                  </td>
                  <td className="p-3.5 font-sans font-bold text-[14px] text-slate-900">
                    {row.angularDistance}°
                  </td>
                  <td className="p-3.5 font-sans font-semibold text-[14px] text-emerald-600">
                    {row.threshold}
                  </td>
                  <td className="p-3.5 font-sans">
                    {row.isRetro ? (
                      <span className="px-2 py-0.5 bg-amber-900 text-amber-200 text-[14px] font-black uppercase rounded">Vakri ℞</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[14px] font-black uppercase rounded">Margi</span>
                    )}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${row.statusColor}`}>
                      {row.statusText}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PlanetaryRashiTransitTimelinePanel = ({ currentDate, transitPositions, initialData }) => {
  const initialYear = currentDate ? new Date(currentDate).getFullYear() : 2026;
  const [selectedPlanet, setSelectedPlanet] = useState("Mercury");
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(false);

  const yearOptions = Array.from({ length: 625 }, (_, i) => 1426 + i);
  const planetsList = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  // Calculate Natal Lagna (Ascendant) Sign Index (0-indexed: 0=Mesha, 1=Vrishabha ... 11=Meena)
  const ascSignIdx = (() => {
    if (initialData?.planet_positions) {
      const asc = initialData.planet_positions.find(p => p.planet === "Ascendant" || p.name === "Ascendant" || p.planet === "Lagna" || p.name === "Lagna");
      if (asc && asc.sign_index !== undefined) return asc.sign_index;
      if (asc && (asc.degree !== undefined || asc.lon !== undefined)) return Math.floor((asc.degree || asc.lon) / 30);
    }
    if (initialData?.charts?.houses && initialData.charts.houses[0]) {
      const h0 = initialData.charts.houses[0];
      if (h0.sign_index !== undefined) return h0.sign_index;
      if (h0.longitude !== undefined) return Math.floor(h0.longitude / 30);
    }
    if (transitPositions) {
      const asc = Object.values(transitPositions).find(p => p.planet === "Ascendant" || p.name === "Ascendant" || p.planet === "Lagna" || p.name === "Lagna");
      if (asc && asc.sidereal?.sign_index !== undefined) return asc.sidereal.sign_index;
      if (asc && (asc.sidereal?.lon !== undefined || asc.lon !== undefined)) return Math.floor((asc.sidereal?.lon || asc.lon) / 30);
    }
    return 0; // Default Mesha
  })();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/planetary-rashi-transit-timeline?planet=${selectedPlanet}&year=${selectedYear}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data) {
          setTimelineData(data);
        }
      })
      .catch(err => console.error("Transit timeline fetch error:", err))
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [selectedPlanet, selectedYear]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto my-6 animate-in fade-in duration-500 font-sans">
      {/* Controls Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-widest flex items-center gap-2">
              <span>📅</span> Annual Rashi Transit Calendar & Movement Grid
            </span>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight text-white uppercase mt-1">
              {selectedPlanet} Rashi Transit Timeline ({selectedYear})
            </h3>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-amber-400/30">
            <label htmlFor="timelineYear" className="text-xs font-bold text-amber-300 uppercase tracking-wider">Year:</label>
            <select
              id="timelineYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-900 text-amber-300 font-black text-sm px-3 py-1.5 rounded-xl border border-amber-500/40 focus:outline-none cursor-pointer"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Planet Select Pills */}
        <div className="space-y-2">
          <p className="text-[18spx] font-medium uppercase tracking-widest text-amber-400">Select Planet to View Signs & Entry Timestamps:</p>
          <div className="flex flex-wrap gap-2">
            {planetsList.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlanet(p)}
                className={`px-4 py-1.5 rounded-xl text-[16px] font-medium tracking-wider transition-all cursor-pointer border ${selectedPlanet === p
                  ? 'bg-amber-500 text-black border-amber-300 shadow-lg scale-105 ring-2 ring-amber-300/50'
                  : 'bg-white  text-slate-900 border-white/10 hover:bg-amber-500/20 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-12 text-center bg-amber-500/10 rounded-3xl border border-amber-500/30">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-amber-700 font-bold text-sm mt-3 animate-pulse">Calculating Gochar (गोचर गणना) {selectedPlanet} ({selectedYear})...</p>
        </div>
      )}

      {/* Transit Card Grid - Exact Visual Aesthetic Matching User Image */}
      {!loading && timelineData && timelineData.transits && (
        <div className="bg-rose-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-[#e6b453] shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timelineData.transits.map((item, idx) => {
              const isCurrentActive = item.isActive;
              const rashiIdx = item.rashiNumber !== undefined ? item.rashiNumber - 1 : 0;
              const houseNumber = (((rashiIdx - ascSignIdx + 12) % 12) + 1);

              return (
                <div
                  key={idx}
                  className={`relative p-5 rounded-xl transition-all border ${isCurrentActive
                    ? 'bg-[#f7c873] border-red-600 ring-2 ring-red-500 shadow-xl scale-[1.01]'
                    : 'bg-[#f5cf82] border-[#dfaf55] hover:border-amber-600'
                    }`}
                >
                  {/* Circle Step Number Badge displaying Zodiac Sign Number (1 to 12) */}
                  <div
                    className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-black text-[14px] text-black shadow-md border-2 border-white ${isCurrentActive ? 'bg-[#b81d1d]' : 'bg-[#7ba33c]'
                      }`}
                  >
                    {item.rashiNumber !== undefined ? item.rashiNumber : item.step}
                  </div>

                  {/* Sign Name, Symbol & House Number */}
                  <div className="ml-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[20px] font-bold text-orange-900 tracking-tight">
                        {item.sign}
                      </h4>
                      <span className="text-lg text-[#7a1c06]">{item.symbol}</span>
                    </div>

                    {/* House Number Badge */}
                    <span className="px-3 py-1 bg-white text-slate-900 rounded-xl text-[13px] font-medium uppercase border border-amber-500/40 shadow-sm">
                      House {houseNumber} ({houseNumber}वां भाव)
                    </span>
                  </div>

                  {/* Exact Timestamp */}
                  <p className="ml-3 text-[16px] font-semibold text-black mt-1">
                    {item.dateStr}
                  </p>

                  {/* Active Transit Indicator */}
                  {isCurrentActive && (
                    <div className="ml-3 mt-2 text-[16px] font-extrabold text-black flex items-center gap-1.5 animate-pulse">
                      <span>📌</span>
                      <span>{selectedPlanet} is transiting in {item.sign} Rashi (House {houseNumber})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const CurrentPositionsDashboard = ({ initialData }) => {
  const [transitPositions, setTransitPositions] = useState(null);
  const [transitHouses, setTransitHouses] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFetching, setIsFetching] = useState(false);
  const [currentTab, setCurrentTab] = useState('map');

  const addTime = (amount, unit) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (unit === 'day') d.setDate(d.getDate() + amount);
      if (unit === 'month') d.setMonth(d.getMonth() + amount);
      if (unit === 'year') d.setFullYear(d.getFullYear() + amount);
      if (unit === 'hour') d.setHours(d.getHours() + amount);
      return d;
    });
  };
  const resetToNow = () => setCurrentDate(new Date());
  useEffect(() => {
    const fetchTransit = () => {
      setIsFetching(true);
      const now = currentDate;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const timeStr = now.toTimeString().split(' ')[0];
      const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);
      const lat = initialData?.basic_details?.lat || 28.6;
      const lon = initialData?.basic_details?.lon || 77.2;
      fetch(`/api/kundali`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Current Transit",
          date: dateStr,
          time: timeStr,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          tz_offset: parseFloat(tz_offset)
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.planet_positions) {
            const posObj = Array.isArray(json.planet_positions)
              ? json.planet_positions.reduce((acc, p) => ({ ...acc, [p.planet || p.name]: p }), {})
              : json.planet_positions;
            setTransitPositions(posObj);
            if (json.houses) setTransitHouses(json.houses);
            else if (json.charts && json.charts.houses) setTransitHouses(json.charts.houses);
          }
        })
        .catch(err => console.error("Transit fetch failed", err))
        .finally(() => setIsFetching(false));
    };
    fetchTransit();
  }, [currentDate]);

  if (!transitPositions) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-300 font-serif italic text-lg animate-pulse">Calculating Celestial Positions...</p>
        </div>
      </div>
    );
  }

  let formattedTransitPositions = initialData?.planet_positions;
  if (transitPositions) {
    formattedTransitPositions = Object.entries(transitPositions).map(([k, v]) => ({
      planet: k,
      degree: v.sidereal?.lon || v.lon,
      is_retrograde: v.is_retrograde || v.sidereal?.is_retrograde,
      is_combust: v.is_combust || v.sidereal?.is_combust,
      nakshatra: v.nakshatra || v.sidereal?.nakshatra
    }));
  }

  const activeHouses = transitHouses || initialData?.charts?.houses;
  const calculatedSphuta = calculateTransitSphutaDrishti(transitPositions) || initialData?.sphuta_drishti;

  const transitReportData = {
    ...initialData,
    planet_positions: formattedTransitPositions,
    sphuta_drishti: calculatedSphuta,
    charts: {
      ...(initialData?.charts || {}),
      houses: activeHouses
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-10 font-serif overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-slate-200 p-8 md:p-10 rounded-[3rem] text-amber-600 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[10rem] font-serif pointer-events-none group-hover:scale-110 transition-transform duration-1000 uppercase">NOW</div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-1">Transit Analysis</h2>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                <span>Planetary Movements</span>
                <span className="w-6 h-[1px] bg-indigo-800"></span>
                <span>{currentDate.toLocaleString()}</span>
              </div>
            </div>

            {/* Navigation Sub-Tabs displayed directly adjacent to Transit Analysis */}
            <div className="flex flex-wrap gap-2 items-center bg-white/70 p-2 rounded-2xl border border-slate-300 shadow-sm backdrop-blur-sm">
              <button
                onClick={() => setCurrentTab('map')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'map'
                  ? 'bg-indigo-300 text-white shadow-md scale-105'
                  : 'text-slate-700 hover:text-indigo-900 hover:bg-white'
                  }`}
              >
                <span>🗺️</span> Gochar Map & Coordinates
              </button>

              <button
                onClick={() => setCurrentTab('planetary_drishti')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'planetary_drishti'
                  ? 'bg-indigo-900 text-white shadow-md scale-105'
                  : 'text-slate-700 hover:text-indigo-900 hover:bg-white'
                  }`}
              >
                <span>🪐</span> Planetary Drishti (Graha)
              </button>

              <button
                onClick={() => setCurrentTab('jaimini_drishti')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'jaimini_drishti'
                  ? 'bg-indigo-900 text-white shadow-md scale-105'
                  : 'text-slate-700 hover:text-indigo-900 hover:bg-white'
                  }`}
              >
                <span>♈</span> Jaimini Rasi Drishti
              </button>

              <button
                onClick={() => setCurrentTab('sphuta_drishti')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'sphuta_drishti'
                  ? 'bg-indigo-900 text-white shadow-md scale-105'
                  : 'text-slate-700 hover:text-indigo-900 hover:bg-white'
                  }`}
              >
                <span>🔮</span> Sphuta Drishti Matrix
              </button>

              <button
                onClick={() => setCurrentTab('rashi_timeline')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'rashi_timeline'
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
              >
                <span>📅</span> Rashi Transit Timeline
              </button>

              <button
                onClick={() => setCurrentTab('asth_uday')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'asth_uday'
                  ? 'bg-rose-900 text-white shadow-md scale-105'
                  : 'text-rose-900 hover:bg-rose-100/60'
                  }`}
              >
                <span>☀️</span> Asth & Uday Analysis
              </button>

              <button
                onClick={() => setCurrentTab('vakri_insights')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'vakri_insights'
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
              >
                <span>🌀</span> Vakri & Margi Insights
              </button>

              <button
                onClick={() => setCurrentTab('all_aspects')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'all_aspects'
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'text-amber-800 hover:bg-amber-100/60'
                  }`}
              >
                <span>✨</span> All Aspect Analytics
              </button>
            </div>
          </div>

          {/* Time Controls Row */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-4 items-center bg-slate-800/10 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <button onClick={resetToNow} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg">Live Now</button>
            <div className="w-px h-8 bg-amber-400 mx-2 hidden sm:block"></div>
            <div className="flex gap-2 items-center">
              <span className="text-black text-[14px] font-bold uppercase tracking-widest mr-1">Hour</span>
              <button onClick={() => addTime(-1, 'hour')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'hour')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-black text-[14px] font-bold uppercase tracking-widest mr-1 ml-2">Day</span>
              <button onClick={() => addTime(-1, 'day')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'day')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-black text-[14px] font-bold uppercase tracking-widest mr-1 ml-2">Month</span>
              <button onClick={() => addTime(-1, 'month')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'month')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-black text-[14px] font-bold uppercase tracking-widest mr-1 ml-2">Year</span>
              <button onClick={() => addTime(-1, 'year')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'year')} className="w-7 h-7 flex items-center justify-center bg-rose-100 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
          </div>
        </div>



        <button
          onClick={() => setCurrentTab('all_aspects')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${currentTab === 'all_aspects'
            ? 'bg-amber-600 text-white shadow-lg scale-105'
            : 'text-amber-800 hover:bg-amber-100/60'
            }`}
        >
          <span>✨</span> All Aspect Analytics
        </button>
      </div>


      {/* Tab 1: Gochar Map & Coordinates */}
      {currentTab === 'map' && (
        <div className={`flex flex-col gap-8 max-w-4xl mx-auto transition-opacity duration-500 ${isFetching ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 left-6 z-20 px-4 py-1.5 bg-indigo-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Current Gochar Map</div>
            <div className="mt-8">
              <ZodiacChart
                planetPositions={formattedTransitPositions}
                houses={activeHouses}
                title="Current Planet Positions"
                variant="legacy"
                defaultRect={true}
                scaleText={1.5}
                showNakshatra={true}
                showDegree={true}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Planetary Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(transitPositions).map(([planet, pos]) => {
                  const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                  if (!valid.includes(planet)) return null;
                  const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);

                  const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
                  const isCombust = pos.is_combust || pos.sidereal?.is_combust;

                  return (
                    <div key={planet} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{planet}</p>
                          {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase tracking-tighter">Vakri</span>}
                          {isCombust && <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded font-black uppercase tracking-tighter">Asth</span>}
                        </div>
                        <p className="text-xs font-bold text-slate-800 uppercase group-hover:text-indigo-900 transition-colors">{SIGNS[signIdx]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-indigo-600">{(pos.sidereal?.fullDegree || pos.sidereal?.lon || 0).toFixed(2)}°</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="relative z-10 text-center space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-300 opacity-60">Diagnostic Insight</p>
                <p className="text-sm font-serif italic leading-relaxed">
                  Transit analysis shows how current planetary movements interact with your Natal Lagna.
                  The chart on the left illustrates the real-time position of planets relative to your birth signature.
                </p>
              </div>
            </div>

            {/* Inline Planetary Rashi Transit Timeline Panel */}
            <div className="mt-8">
              <PlanetaryRashiTransitTimelinePanel currentDate={currentDate} transitPositions={transitPositions} initialData={initialData} />
            </div>

            {/* Inline Asth & Uday Analysis Panel */}
            <div className="mt-8">
              <AsthUdayAnalysisPanel transitPositions={transitPositions} />
            </div>

            {/* Inline Vakri & Margi Insights Panel */}
            <div className="mt-8">
              <VakriMargiInsightPanel transitPositions={transitPositions} currentDate={currentDate} />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Planetary Rashi Transit Timeline */}
      {currentTab === 'rashi_timeline' && (
        <PlanetaryRashiTransitTimelinePanel currentDate={currentDate} transitPositions={transitPositions} initialData={initialData} />
      )}

      {/* Tab: Asth & Uday Analysis */}
      {currentTab === 'asth_uday' && (
        <AsthUdayAnalysisPanel transitPositions={transitPositions} />
      )}

      {/* Tab 2: Planetary Drishti (Graha) */}
      {currentTab === 'planetary_drishti' && (
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-2xl font-black uppercase text-slate-800 border-b border-slate-100 pb-3">Transit Planetary Drishti (Graha Aspects)</h3>
          <DrishtiTable houses={activeHouses} reportData={transitReportData} hideJaimini={true} hideSphuta={true} />
        </div>
      )}

      {/* Tab 3: Jaimini Rasi Drishti */}
      {currentTab === 'jaimini_drishti' && (
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-2xl font-black uppercase text-slate-800 border-b border-slate-100 pb-3">Transit Jaimini Rasi Drishti (Sign Aspects)</h3>
          <DrishtiTable houses={activeHouses} reportData={transitReportData} hideGraha={true} hideSphuta={true} />
        </div>
      )}

      {/* Tab 4: Sphuta Drishti Matrix */}
      {currentTab === 'sphuta_drishti' && (
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-2xl font-black uppercase text-slate-800 border-b border-slate-100 pb-3">Transit Sphuta Drishti Matrix (Shashtiamsa Aspect Strengths)</h3>
          <SphutaDrishtiViewer sphutaDrishtiData={calculatedSphuta} planetPositions={formattedTransitPositions} />
        </div>
      )}

      {/* Tab 5: Vakri & Margi Insights */}
      {currentTab === 'vakri_insights' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <VakriMargiInsightPanel transitPositions={transitPositions} currentDate={currentDate} />
        </div>
      )}

      {/* Tab 6: All Aspect Analytics */}
      {currentTab === 'all_aspects' && (
        <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-2xl font-black uppercase text-slate-800 border-b border-slate-100 pb-3">All Transit Aspect Analytics</h3>
          <DrishtiTable houses={activeHouses} reportData={transitReportData} />
        </div>
      )}

      {/* Detailed Gochar Analysis Section */}
      <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Detailed Gochar Analysis (गोचर फल)</h3>
        <div className="space-y-6">
          {Object.entries(transitPositions).map(([planet, pos]) => {
            const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
            if (!valid.includes(planet)) return null;

            const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
            let moonSignIndex = 0;
            if (initialData?.planet_positions) {
              const moonPos = Array.isArray(initialData.planet_positions)
                ? initialData.planet_positions.find(p => p.planet === "Moon" || p.name === "Moon")
                : Object.values(initialData.planet_positions).find(p => p.planet === "Moon" || p.name === "Moon");
              if (moonPos) {
                moonSignIndex = moonPos.sidereal?.sign_index !== undefined
                  ? moonPos.sidereal.sign_index
                  : Math.floor((moonPos.sidereal?.lon || moonPos.lon || 0) / 30);
              }
            }
            const transitHouse = ((signIdx - moonSignIndex + 12) % 12) + 1;
            const HINDI_PLANETS = {
              "Sun": "सूर्य", "Moon": "चंद्र", "Mars": "मंगल", "Mercury": "बुध", "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
            };
            const HINDI_SIGNS = [
              "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
            ];
            const getGocharText = (pName, house) => {
              const auspicious = {
                "Sun": [3, 6, 10, 11],
                "Moon": [1, 3, 6, 7, 10, 11],
                "Mars": [3, 6, 11],
                "Mercury": [2, 4, 6, 8, 10, 11],
                "Jupiter": [2, 5, 7, 9, 11],
                "Venus": [1, 2, 3, 4, 5, 8, 9, 11, 12],
                "Saturn": [3, 6, 11],
                "Rahu": [3, 6, 10, 11],
                "Ketu": [3, 6, 11]
              };
              const isGood = auspicious[pName]?.includes(house);
              const hindiP = HINDI_PLANETS[pName] || pName;
              if (isGood) {
                return `आपकी जन्म चंद्र राशि से ${house}वें भाव में ${hindiP} का गोचर अत्यंत शुभ फलदायक माना जाता है। इस अवधि में आपको अपने प्रयासों में सफलता, आर्थिक लाभ, और स्वास्थ्य में सुधार देखने को मिलेगा। रुके हुए कार्य संपन्न होंगे और सामाजिक मान-सम्मान में वृद्धि होगी। सकारात्मक ऊर्जा का संचार होगा।`;
              } else {
                return `आपकी जन्म चंद्र राशि से ${house}वें भाव में ${hindiP} का गोचर संघर्ष और कुछ चुनौतियों का संकेत देता है। इस अवधि में आपको स्वास्थ्य के प्रति सावधान रहना चाहिए, व्यर्थ के वाद-विवाद से बचना चाहिए, और आर्थिक मामलों में अत्यधिक सतर्कता बरतनी चाहिए। धैर्य और संयम से काम लें।`;
              }
            };
            const pName = HINDI_PLANETS[planet] || planet;
            const sName = HINDI_SIGNS[signIdx] || "";

            return (
              <div key={planet} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="text-xl font-bold text-indigo-900 mb-3 border-b border-slate-200 pb-2">
                  {pName} {sName} राशि में आपकी चंद्र राशि से भाव {transitHouse} में गोचर कर रहा है
                </h4>
                <p className="text-gray-700 leading-relaxed font-serif text-lg">
                  {getGocharText(planet, transitHouse)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}


const TransitGemstonePanel = ({ data, transitPositions }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined || !transitPositions) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Gochar Suggestions</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">
          {!transitPositions ? "Fetching Transit Data..." : "Lagna data unavailable"}
        </div>
      </div>
    );
  }

  const getTransitHouse = (lord) => {
    const pos = transitPositions[lord];
    if (!pos) return null;
    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
    return (signIdx - lagnaSignIndex + 12) % 12 + 1;
  };

  const suggestions = [
    { label: "Life Stone (1st Lord)", lord: SIGN_LORDS[lagnaSignIndex], role: "Health & Vitality" },
    { label: "Lucky Stone (5th Lord)", lord: SIGN_LORDS[(lagnaSignIndex + 4) % 12], role: "Knowledge & Luck" },
    { label: "Fortune Stone (9th Lord)", lord: SIGN_LORDS[(lagnaSignIndex + 8) % 12], role: "Fortune & Faith" },
  ].map(s => {
    const transitHouse = getTransitHouse(s.lord);
    const info = GEMSTONES[s.lord];
    let advice = "";
    let status = "neutral";

    if (transitHouse === 1 || transitHouse === 4 || transitHouse === 5 || transitHouse === 7 || transitHouse === 9 || transitHouse === 10) {
      advice = `Auspicious transit in House ${transitHouse}. Highly effective now.`;
      status = "positive";
    } else if (transitHouse === 6 || transitHouse === 8 || transitHouse === 12) {
      advice = `Critical transit in House ${transitHouse}. Strengthen lord now.`;
      status = "warning";
    } else {
      advice = `Stable transit in House ${transitHouse}. Good for consistent flow.`;
      status = "neutral";
    }

    return { ...s, ...info, transitHouse, advice, status };
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fbff]">
      <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-bold text-xs uppercase italic tracking-widest flex items-center justify-center gap-2">
        ✨ Live Transit Ratna Guide
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2 custom-scrollbar">
        {suggestions.map((s, idx) => (
          <div key={idx} className={`p-2 rounded border bg-white shadow-sm transition-all border-l-4 ${s.status === 'positive' ? 'border-green-400' : s.status === 'warning' ? 'border-amber-400' : 'border-blue-400'}`}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[7px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded">{s.label}</span>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono font-black text-gray-700">{s.lord}</span>
                <span className="text-[6px] text-gray-400 italic">Transiting H{s.transitHouse}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded shadow-inner flex items-center justify-center text-md bg-gray-50 border border-gray-100">
                {s.name === 'Ruby' && '💎'}
                {s.name === 'Pearl' && '⚪'}
                {s.name === 'Red Coral' && '🏮'}
                {s.name === 'Emerald' && '💚'}
                {s.name === 'Yellow Sapphire' && '🟡'}
                {s.name === 'Diamond' && '💍'}
                {s.name === 'Blue Sapphire' && '💙'}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-gray-800">{s.name}</div>
                <div className="text-[7.5px] text-gray-500 font-serif leading-none mt-0.5">{s.advice}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-[7.5px] text-blue-800 italic text-center p-1 bg-blue-50/50 rounded leading-tight">
          Current transits change planetary effectiveness. Check daily for optimal stone selection.
        </div>
      </div>
    </div>
  );







};
const WorksheetCell = ({ contentId, data, transitPositions, dashaSimDate, onSelectContent, onPlanetClick, onFullScreen, onTransitChange, isBlankSheet }) => {
  const [showSelector, setShowSelector] = useState(false);
  const planetEffects = calculatePlanetEffects(data);

  const renderContent = () => {
    if (!data) return <div className="p-4 text-xs text-gray-400">No data</div>;

    if (contentId === 'd10') {
      const vData = data.vargas?.d10;
      return (
        <div className="h-full flex flex-col bg-slate-50/50">
          <div className="shrink-0 relative">
            <ZodiacChart planetPositions={data?.planet_positions} houses={vData?.houses} onPlanetClick={onPlanetClick} title="D10 Dashamsha" variant="legacy" planetEffects={planetEffects} scaleText={1.5} defaultRect={isBlankSheet} />
            <div className="absolute top-6 right-2 px-1.5 py-0.5 bg-indigo-600 text-[6px] font-black text-white rounded-full shadow-sm uppercase tracking-tighter">Iyer Method</div>
          </div>
          <div className="px-2 pb-2 mt-auto">
            <div className="p-1.5 bg-white rounded-lg border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[7px] font-bold text-slate-500 uppercase">Success Potential</span>
                <span className="text-[7px] font-black text-indigo-600">Pro</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (contentId.startsWith('d') && contentId !== 'dignity' && contentId !== 'dasha') {
      const vData = (contentId === 'd1') ? data.charts : data.vargas?.[contentId];
      const title = CELL_CONTENTS.find(c => c.id === contentId)?.label || contentId.toUpperCase();
      return <ZodiacChart planetPositions={data?.planet_positions} houses={vData?.houses} onPlanetClick={onPlanetClick} title={title} variant="legacy" planetEffects={planetEffects} scaleText={1.5} defaultRect={isBlankSheet} />;
    }

    switch (contentId) {
      case "lagna": {
        const lagnaSignIndex = data?.charts?.ascendant_sign_index !== undefined ? data.charts.ascendant_sign_index :
          (data?.charts?.houses?.[1]?.sign_index !== undefined ? data.charts.houses[1].sign_index : Math.floor((data?.charts?.houses?.[1]?.cusp_deg || 0) / 30));

        let computedTransitHouses = null;
        let formattedTransitPositions = data?.planet_positions;
        if (transitPositions) {
          computedTransitHouses = {};
          const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
          Object.entries(transitPositions).forEach(([planet, pos]) => {
            if (!valid.includes(planet)) return;
            const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor((pos.sidereal?.lon || pos.lon) / 30);
            const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
            if (!computedTransitHouses[houseNum]) computedTransitHouses[houseNum] = { planets: [] };
            computedTransitHouses[houseNum].planets.push(planet);
          });

          formattedTransitPositions = Object.entries(transitPositions).map(([k, v]) => ({
            planet: k,
            degree: v.sidereal?.lon || v.lon,
            is_retrograde: v.is_retrograde || v.sidereal?.is_retrograde,
            is_combust: v.is_combust || v.sidereal?.is_combust
          }));
        }

        return (
          <div className="h-full flex flex-col overflow-auto custom-scrollbar">
            {onTransitChange && (
              <div className="shrink-0 border-b border-gray-200 bg-indigo-50/50 p-2">
                <div className="text-xs font-bold text-indigo-800 mb-1">Transit Control (Over Natal Lagna)</div>
                <CompactTransitControl lat={data?.basic_details?.lat} lon={data?.basic_details?.lon} onTransitChange={onTransitChange} />
              </div>
            )}
            <div className="shrink-0">
              <ZodiacChart
                planetPositions={transitPositions ? formattedTransitPositions : data?.planet_positions}
                houses={data.charts?.houses}
                transitHouses={computedTransitHouses}
                onPlanetClick={onPlanetClick}
                title="Lagna Chart"
                variant="legacy"
                defaultRect={true}
                planetEffects={planetEffects}
                scaleText={1.5}
              />
            </div>
            <div className="px-2 pb-4">
              <HouseEffectTable data={data} planetEffects={planetEffects} />
              <ConjunctionAnalysis houses={data.charts?.houses} />
            </div>
          </div>
        );
      }
      case "planets_table":
        return <PlanetTable data={data} onPlanetClick={onPlanetClick} />;
      case "panchang":
        return <PanchangPanel data={data} />;
      case "numerical":
        return <NumericalPanel data={data} />;
      case "shodashottari": return <SecondaryDashaPanel data={data} type="shodashottari" />;
      case "chaturshitisama": return <SecondaryDashaPanel data={data} type="chaturshitisama" />;
      case "ashtottari": return <SecondaryDashaPanel data={data} type="ashtottari" />;
      case "dwisaptatisama": return <SecondaryDashaPanel data={data} type="dwisaptatisama" />;
      case "dwadashottari": return <SecondaryDashaPanel data={data} type="dwadashottari" />;
      case "panchottari": return <SecondaryDashaPanel data={data} type="panchottari" />;
      case "shatabdika": return <SecondaryDashaPanel data={data} type="shatabdika" />;
      case "shashtihayani": return <SecondaryDashaPanel data={data} type="shashtihayani" />;
      case "chara": return <SecondaryDashaPanel data={data} type="chara" />;
      case "sthira": return <SecondaryDashaPanel data={data} type="sthira" />;
      case "shoola": return <SecondaryDashaPanel data={data} type="shoola" />;
      case "niryaana_shoola": return <SecondaryDashaPanel data={data} type="niryaana_shoola" />;
      case "mandooka": return <SecondaryDashaPanel data={data} type="mandooka" />;
      case "drig": return <SecondaryDashaPanel data={data} type="drig" />;
      case "sudasha": return <SecondaryDashaPanel data={data} type="sudasha" />;
      case "dignity":
        return <DignityTable data={data} planetEffects={planetEffects} />;
      case "vimsopaka":
        return <VimsopakaAssessment data={data} onlyMatrix={!isBlankSheet} />;
      case "bhavbala":
        return <BhavbalaView data={data} onlyTable={!isBlankSheet} />;
      case "panch_pakshi":
        return <PanchPakshiTable data={data} />;
      case "kp":
        return <div className="h-full overflow-y-auto"><KPChartViewer formData={data} /></div>;
      case "vimshottari":
        if (isBlankSheet) {
          return (
            <div className="flex flex-col h-full overflow-auto custom-scrollbar">
              <div className="flex-1 min-h-[280px]">
                <VimshottariTable data={data} transitDate={dashaSimDate} />
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col h-full overflow-auto custom-scrollbar">
            <div className="shrink-0" style={{ minHeight: '280px' }}>
              <VimshottariTable data={data} transitDate={dashaSimDate} />
            </div>
            <div className="shrink-0 border-t-2 border-indigo-200 bg-slate-50">
              <DashaDashboard data={data} />
            </div>
            <div className="shrink-0 border-t-4 border-amber-300">
              <VimshottariLifeTable data={data} />
            </div>
            <div className="shrink-0 border-t-4 border-emerald-300">
              <VimshottariGridTimeline data={data} />
            </div>
          </div>
        );
      case "shadbala":
        return <ShadbalaChart data={data.strength} title="Shad Bala" onlyRatio={true} />;
      case "ashtakavarga":
        return <AshtakavargaViewer data={data} />;
      case "ashtakavarga_reduction":
        return <div className="h-full overflow-y-auto"><AsthavargaReduction data={data} /></div>;
      case "bhinnastavarga":
        return <div className="h-full overflow-y-auto"><BhinnastaVarga data={data} /></div>;
      case "krishnamurthy_chart":
        return <div className="h-full overflow-y-auto"><KrishanaMurthyChart formData={data} /></div>;
      case "krishnamurthy_significators":
        return <div className="h-full overflow-y-auto"><KrishanaMurthySignificators formData={data} /></div>;
      case "shodashvarga_summary":
        return <div className="h-full overflow-y-auto"><ShodashvargaSummary data={data} /></div>;
      case "aspects_summary":
        return <div className="h-full overflow-y-auto"><AspectsSummary data={data} /></div>;
      case "gemstones":
        return <GemstonePanel data={data} />;
      case "transit":
        return <TransitPanel data={data} transitPositions={transitPositions} />;
      case "transit_gemstones":
        return <TransitGemstonePanel data={data} transitPositions={transitPositions} />;
      default:
        // Handle Oracle categories in the grid
        const oracleItem = oracle_items.find(item => item.id === contentId);
        if (oracleItem) {
          return (
            <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50 text-center gap-3">
              <div className="text-4xl">{oracleItem.icon}</div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{oracleItem.label}</h4>
              <button
                onClick={() => handleOracleClick(contentId)}
                className="px-4 py-1.5 bg-indigo-600 text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-md hover:bg-indigo-700 transition-all active:scale-95"
              >
                Open Premium Report
              </button>
            </div>
          );
        }
        return <div className="flex items-center justify-center min-h-[100px] text-gray-300 italic border-dashed border-2 m-2">Empty Cell ({contentId})</div>;
    }
  };

  return (
    <div className="relative group border border-gray-400 bg-white shadow-sm overflow-hidden h-full flex flex-col p-0.5 min-h-[150px]">
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
        {/* for select content button */}
      </div>

      {showSelector ? (
        <div className="absolute inset-0 bg-white z-20 overflow-hidden p-3 flex flex-col border-2 border-indigo-100 rounded-lg shadow-inner">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h4 className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.2em]">Select Content</h4>
            <span className="text-[8px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">2-LINE GRID</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {CELL_CONTENTS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onSelectContent(c.id); setShowSelector(false); }}
                  className={`text-[9px] text-left p-2 rounded-lg border transition-all uppercase font-bold tracking-tight leading-none h-[40px] flex items-center justify-center text-center ${contentId === c.id
                    ? 'bg-indigo-600 text-black border-indigo-700 shadow-md ring-2 ring-indigo-200'
                    : 'bg-slate-50 text-black border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                    }`}
                >
                  {c.label.split(' - ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      )}
    </div>
  );
};



const InteractiveWorksheet = ({ data: incomingData, fullScreenInitial = null, isBlankSheet = false }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [blankSheetItems, setBlankSheetItems] = useState([]);
  const [pendingChartSelection, setPendingChartSelection] = useState(null);
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 7) {
      if (isAdmin) {
        localStorage.removeItem('isAdmin');
        setIsAdmin(false);
        alert("Admin mode locked!");
      } else {
        localStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        alert("Admin mode unlocked!");
      }
      setClickCount(0); // Reset count so it can be toggled again
    }
  };

  const [transitCompareBaseChart, setTransitCompareBaseChart] = useState('charts');
  const [data, setData] = useState(incomingData);
  const [showAstroCharts, setShowAstroCharts] = useState(true);
  const [showExternalApps, setShowExternalApps] = useState(true);
  const [showOracleTools, setShowOracleTools] = useState(true);

  const processVedicData = (incoming) => {
    if (!incoming) return null;

    // 1. Calculate and map planetary status
    const sunPos = incoming.planet_positions?.find(p => p.planet === "Sun")?.degree;
    const COMBUSTION_LIMITS = {
      "Moon": 12, "Mars": 17, "Mercury": 14, "Jupiter": 11, "Venus": 10, "Saturn": 15
    };

    const NAKSHATRAS = [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
      "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
      "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
      "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    const normalizedPositions = (incoming.planet_positions || []).map(p => {
      const is_retrograde = p.is_retrograde !== undefined ? p.is_retrograde : (p.retrograde || false);
      let is_combust = p.is_combust || false;

      if (sunPos !== undefined && COMBUSTION_LIMITS[p.planet] && p.planet !== "Sun") {
        let diff = Math.abs(p.degree - sunPos);
        if (diff > 180) diff = 360 - diff;
        const limit = (p.planet === "Mercury" && is_retrograde) ? 12 :
          (p.planet === "Venus" && is_retrograde) ? 8 :
            COMBUSTION_LIMITS[p.planet];
        if (diff <= limit) is_combust = true;
      }

      let nakshatra = p.nakshatra;
      if (!nakshatra && p.degree !== undefined) {
        const nakIndex = Math.floor(p.degree / 13.3333333333);
        if (nakIndex >= 0 && nakIndex < NAKSHATRAS.length) {
          nakshatra = NAKSHATRAS[nakIndex];
        }
      }

      return { ...p, is_retrograde, is_combust, nakshatra };
    });

    const posMap = normalizedPositions.reduce((acc, p) => {
      acc[p.planet] = p;
      return acc;
    }, {});

    // 2. Helper to enrich house data
    const enrichHouses = (houses) => {
      if (!houses) return houses;
      const enriched = { ...houses };
      Object.keys(enriched).forEach(h => {
        if (enriched[h].planets) {
          enriched[h].planets = enriched[h].planets.map(p => {
            const name = typeof p === 'string' ? p : (p.planet || p.name);
            const pos = posMap[name];
            return pos ? {
              ...(typeof p === 'object' ? p : {}),
              name,
              is_retrograde: pos.is_retrograde,
              is_combust: pos.is_combust,
              nakshatra: pos.nakshatra || p?.nakshatra
            } : p;
          });
        }
      });
      return enriched;
    };

    // 3. Deep copy and enrich charts
    const processed = { ...incoming, planet_positions: normalizedPositions };
    if (processed.charts) {
      processed.charts = { ...processed.charts, houses: enrichHouses(processed.charts.houses) };
    }
    if (processed.vargas) {
      const enrichedVargas = {};
      Object.keys(processed.vargas).forEach(vKey => {
        enrichedVargas[vKey] = {
          ...processed.vargas[vKey],
          houses: enrichHouses(processed.vargas[vKey].houses)
        };
      });
      processed.vargas = enrichedVargas;
    }

    return processed;
  };

  useEffect(() => {
    if (incomingData) {
      const processed = processVedicData(incomingData);
      setData(processed);
      localStorage.setItem('worksheetData', JSON.stringify(processed));
    } else if (!data) {
      const saved = localStorage.getItem('worksheetData');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to restore worksheet data", e);
        }
      }
    }
  }, [incomingData]);

  // Debug log to help identify missing fields in local development
  useEffect(() => {
    if (data) {
      console.log("Worksheet Data received:", {
        id: data.meta?.name,
        panchang: !!data.panchang,
        shodashottari: data.shodashottari?.length,
        chaturshitisama: data.chaturshitisama?.length,
        favourable: !!data.favourable?.numerology
      });
    }
  }, [data]);

  const [upperRightChart, setUpperRightChart] = useState("d9");
  const [rightCell, setRightCell] = useState("vimshottari");
  const [lowerCells, setLowerCells] = useState(["dignity", "vimsopaka"]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [transitPositions, setTransitPositions] = useState(null);
  const [timeControlledPositions, setTimeControlledPositions] = useState(null);
  const [timeControlledDate, setTimeControlledDate] = useState(null);
  const [dashaSimDate, setDashaSimDate] = useState(null);
  const [showStandaloneTransit, setShowStandaloneTransit] = useState(false);
  const [showVimshottariTransitControl, setShowVimshottariTransitControl] = useState(false);

  const handleTransitChange = (positions, dt) => {
    setTimeControlledPositions(positions);
    setTimeControlledDate(dt);
  };

  const oracle_items = [
    { id: "ascendant", label: "Ascendant", icon: "👤", color: "from-stone-500 to-stone-700" },
    { id: "study", label: "Study", icon: "📚", color: "from-red-500 to-black-600" },
    { id: "career", label: "Career", icon: "💼", color: "from-slate-700 to-slate-900" },
    { id: "finance", label: "Finance", icon: "💰", color: "from-emerald-500 to-teal-700" },
    { id: "marriage", label: "Marriage", icon: "💍", color: "from-rose-400 to-pink-600" },
    { id: "business", label: "Business", icon: "💹", color: "from-amber-500 to-orange-700" },
    { id: "business_naming", label: "Business Naming", icon: "🏢", color: "from-blue-500 to-indigo-700" },
    { id: "health", label: "Health", icon: "🏥", color: "from-red-500 to-red-700" },
    { id: "parents_health", label: "Parents Health", icon: "👨‍👩‍👧", color: "from-sky-500 to-blue-700" },
    { id: "spouse_health", label: "Spouse Health", icon: "💑", color: "from-fuchsia-500 to-purple-700" },
    { id: "children_health", label: "Childrens Health", icon: "👶", color: "from-lime-500 to-green-700" },
    { id: "mental_peace", label: "Mental Peace", icon: "🧘", color: "from-violet-500 to-purple-800" },
    { id: "home_peace", label: "Ghar me Sukh Shanti", icon: "🏡", color: "from-orange-400 to-red-600" },
    { id: "manglik", label: "Manglik", icon: "🔴", color: "from-red-600 to-red-800" },
    { id: "kalsarp", label: "Kalsarp Dosha", icon: "🐍", color: "from-slate-800 to-black" },
    { id: "pitra", label: "Pitra Dosha", icon: "🕯️", color: "from-amber-700 to-amber-900" },
    { id: "sadesati", label: "Sadesati", icon: "⚖️", color: "from-blue-900 to-slate-900" },
    { id: "rahu", label: "Rahu Dosha", icon: "🌑", color: "from-teal-800 to-emerald-900" },
    { id: "ketu", label: "Ketu Dosha", icon: "💥", color: "from-orange-800 to-red-900" },
    { id: "loshu", label: "Lo Shu Grid", icon: "🔢", color: "from-indigo-500 to-blue-700" },
    { id: "lalkitab", label: "Lal Kitab", icon: "📖", color: "from-orange-500 to-red-600" },
    { id: "daily_panchang", label: "Daily Panchang", icon: "🗞️", color: "from-amber-600 to-orange-800" },
    { id: "monthly_panchang", label: "Monthly Calendar", icon: "📅", color: "from-amber-700 to-orange-900" },
    { id: "dosha", label: "Advanced Doshas & Exceptions", icon: "🧿", color: "from-purple-500 to-purple-900" },
    { id: "digbala", label: "Digbala Compass (Directions)", icon: "🧭", color: "from-amber-500 to-amber-700" },
    { id: "horary", label: "Horary Astrology", icon: "🕒", color: "from-blue-600 to-indigo-800" },
    { id: "chakra", label: "Sudarshan Chakra", icon: "☸️", color: "from-purple-600 to-indigo-900" },
    { id: "yantra", label: "Yantra Suggestion", icon: "🔱", color: "from-red-600 to-amber-800" },
  ];

  useEffect(() => {
    if (data) {
      localStorage.setItem('worksheetData', JSON.stringify(data));

      if (!transitPositions) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];
        const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);
        const lat = data?.basic_details?.lat || 28.6;
        const lon = data?.basic_details?.lon || 77.2;

        fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(json => {
            if (json.positions) setTransitPositions(json.positions);
          })
          .catch(err => console.error("Transit fetch failed", err));
      }
    }
  }, [data]);

  const handleMaximizeInNewWindow = (id) => {
    if (isBlankSheet) {
      setPendingChartSelection(id);
      return;
    }
    const oracleIds = [
      'ascendant', 'study', 'career', 'marriage', 'finance', 'business', 'business_naming', 'health',
      'parents_health', 'spouse_health', 'children_health', 'mental_peace',
      'home_peace', 'manglik', 'kalsarp', 'pitra', 'sadesati', 'rahu', 'ketu', 'loshu',
      'lalkitab', 'daily_panchang', 'monthly_panchang', 'horary', 'chakra', 'yantra'
    ];
    if (oracleIds.includes(id)) {
      handleOracleClick(id);
      return;
    }

    // If we're not in blank sheet mode and the chart isn't an oracle item, standard full screen logic applies.
    localStorage.setItem('worksheetData', JSON.stringify(data));
    window.open(`/?worksheet=true&fullScreen=${id}`, `Full_${id}_${Date.now()}`, 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no');
  };

  const handleAddGridItem = (size) => {
    if (pendingChartSelection) {
      setBlankSheetItems([
        ...blankSheetItems,
        {
          uniqueId: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          contentId: pendingChartSelection,
          size: size
        }
      ]);
      setPendingChartSelection(null);
    }
  };

  const handleRemoveGridItem = (uniqueId) => {
    setBlankSheetItems(blankSheetItems.filter(item => item.uniqueId !== uniqueId));
  };
  const handlePointerDown = (e, uniqueId) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const itemIndex = blankSheetItems.findIndex(i => i.uniqueId === uniqueId);
    if (itemIndex < 0) return;
    const startItemX = blankSheetItems[itemIndex].x || 0;
    const startItemY = blankSheetItems[itemIndex].y || 0;
    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setBlankSheetItems(prev => prev.map(item => {
        if (item.uniqueId === uniqueId) {
          return { ...item, x: Math.max(0, startItemX + deltaX), y: Math.max(0, startItemY + deltaY) };
        }
        return item;
      }));
    };
    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };
  const getDefaultSize = (size) => {
    switch (size) {
      case '1x1': return { w: 320, h: 350 };
      case '1x2': return { w: 320, h: 720 };
      case '2x1': return { w: 660, h: 350 };
      case '2x2': return { w: 660, h: 720 };
      case '3x1': return { w: 1000, h: 350 };
      case '3x2': return { w: 1000, h: 720 };
      case '4x1': return { w: 1340, h: 350 };
      case '4x2': return { w: 1340, h: 720 };
      default: return { w: 320, h: 350 };
    }
  };
  const handleResizeDown = (e, uniqueId, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const itemIndex = blankSheetItems.findIndex(i => i.uniqueId === uniqueId);
    if (itemIndex < 0) return;
    const startItemX = blankSheetItems[itemIndex].x || 0;
    const startItemY = blankSheetItems[itemIndex].y || 0;
    const defaultSize = getDefaultSize(blankSheetItems[itemIndex].size);
    const startW = blankSheetItems[itemIndex].w || defaultSize.w;
    const startH = blankSheetItems[itemIndex].h || defaultSize.h;
    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setBlankSheetItems(prev => prev.map(item => {
        if (item.uniqueId === uniqueId) {
          let newX = startItemX;
          let newY = startItemY;
          let newW = startW;
          let newH = startH;
          if (direction.includes('e')) newW = Math.max(250, startW + deltaX);
          if (direction.includes('s')) newH = Math.max(250, startH + deltaY);
          if (direction.includes('w')) {
            const possibleW = startW - deltaX;
            if (possibleW >= 250) {
              newW = possibleW;
              newX = startItemX + deltaX;
            }
          }
          if (direction.includes('n')) {
            const possibleH = startH - deltaY;
            if (possibleH >= 250) {
              newH = possibleH;
              newY = startItemY + deltaY;
            }
          }
          return { ...item, x: newX, y: newY, w: newW, h: newH };
        }
        return item;
      }));
    };
    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };
  const handlePlanetClick = (planet, house) => {
    const pos = (data?.planet_positions || []).find(p => p.planet === planet) || {};
    setSelectedPlanet({ name: planet, house, ...pos });
  };

  const handleOracleClick = (id) => {
    const popupSettings = 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no';
    const basic = data?.basic_details || {};
    const meta = data?.meta || {};
    const params = new URLSearchParams({
      name: (meta.name || basic.name) || '',
      date: (basic.birth_date) || '',
      time: (basic.birth_time) || '',
      lat: (basic.lat) || '',
      lon: (basic.lon) || '',
      tz: (basic.tz_offset) || '0',
      lang: 'hindi'
    });
    if (id === 'lalkitab') params.set('lalkitab', 'true');
    else if (id === 'daily_panchang') params.set('panchang', 'true');
    else if (id === 'monthly_panchang') params.set('monthly_panchang', 'true');
    else if (id === 'horary') params.set('horary', 'true');
    else if (id === 'chakra') params.set('chakra', 'true');
    else if (id === 'yantra') params.set('yantra', 'true');
    else params.set(id, 'true');

    localStorage.setItem('worksheetData', JSON.stringify(data));
    window.open(`/?${params.toString()}`, `Oracle_${id}_${Date.now()}`, popupSettings);
  };

  const urlCid = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fullScreen') : null;
  const cid = fullScreenInitial || urlCid;

  const handleStandaloneExportPDF = async () => {
    const element = document.getElementById('pdf-content-standalone');
    if (!element) return;
    // Temporarily remove height restrictions for PDF export
    const originalH = element.style.height;
    const originalOverflow = element.style.overflow;
    element.style.height = 'auto';
    element.style.overflow = 'visible';
    const originalClassName = element.className;
    element.className = originalClassName.replace('h-screen', 'h-auto').replace('overflow-hidden', 'overflow-visible');
    const innerScroll = element.querySelector('.overflow-auto');
    let originalInnerOverflow = '';
    let originalInnerClassName = '';
    if (innerScroll) {
      originalInnerOverflow = innerScroll.style.overflow;
      innerScroll.style.overflow = 'visible';
      originalInnerClassName = innerScroll.className;
      innerScroll.className = originalInnerClassName.replace('overflow-auto', 'overflow-visible');
    }
    try {
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, logging: false, windowHeight: element.scrollHeight });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Astro_Chart_${cid}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF.");
    } finally {
      // Restore styles and classes
      element.style.height = originalH;
      element.style.overflow = originalOverflow;
      element.className = originalClassName;
      if (innerScroll) {
        innerScroll.style.overflow = originalInnerOverflow;
        innerScroll.className = originalInnerClassName;
      }
    }
  };
  if (cid) {
    const effects = calculatePlanetEffects(data);

    return (
      <div id="pdf-content-standalone" className="h-screen w-screen bg-[#fdfbf7] flex flex-col overflow-hidden">
        <style>{`
          button, button span, button div, button p, button h4 {
            color: black !important;
          }
        `}</style>

        <div className="bg-white px-6 py-3 flex justify-between items-center shrink-0 shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-black font-bold">✨</div>
            <div>
              <h2 className="text-slate-900 text-[15px] font-bold font-serif italic tracking-widest uppercase leading-none">
                {CELL_CONTENTS.find(c => c.id === cid)?.label || cid.toUpperCase()}
              </h2>
              <p className="text-[10px] text-black font-black uppercase tracking-[0.3em] mt-0.5">Standalone Diagnostic View</p>
            </div>
          </div>

          {(cid === 'lagna' || cid === 'd1') && (
            <div className="flex-1 px-4 flex justify-center">
              <div className="flex flex-row items-center gap-4 bg-indigo-50/50 px-5 py-1 rounded-full border border-indigo-100 shadow-inner h-[50px]">
                <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <span className="text-sm">⏱️</span> Transit
                </div>
                <button
                  onClick={() => setShowStandaloneTransit(!showStandaloneTransit)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm shrink-0 ${showStandaloneTransit ? 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100' : 'bg-white text-black border-indigo-700 hover:bg-indigo-700'}`}
                >
                  {showStandaloneTransit ? "Birth Chart" : "Transit Chart"}
                </button>
                <div className={`flex items-center justify-center transform scale-[0.8] origin-left transition-opacity duration-300 ${showStandaloneTransit ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <CompactTransitControl lat={data?.basic_details?.lat} lon={data?.basic_details?.lon} onTransitChange={handleTransitChange} />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStandaloneExportPDF}
            className="bg-rose-100 hover:bg-indigo-700 text-black px-4 py-1.5 rounded-lg text-[14px] font-black uppercase tracking-widest transition-all border border-emerald-500/30 shrink-0 mr-2"
          >
            Export PDF
          </button>
          <button
            onClick={() => window.close()}
            className="bg-white/75 hover:bg-white/20 text-black px-4 py-1.5 rounded-lg text-[14px] font-black uppercase tracking-widest transition-all border border-white/10 shrink-0"
          >
            Close Window
          </button>
        </div>

        <div className={`flex-1 overflow-auto custom-scrollbar ${(cid === 'transit_compare' || cid === 'vimshottari') ? '' : 'p-4 md:p-8 flex flex-col items-center'}`}>
          <div className={(cid === 'transit_compare' || cid === 'vimshottari') ? 'w-full h-full' : 'w-full max-w-full mx-auto'}>
            {(cid === 'lagna' || cid === 'd1') && (() => {
              const lagnaSignIndex = data?.charts?.ascendant_sign_index !== undefined ? data.charts.ascendant_sign_index :
                (data?.charts?.houses?.[1]?.sign_index !== undefined ? data.charts.houses[1].sign_index : Math.floor((data?.charts?.houses?.[1]?.cusp_deg || 0) / 30));

              let computedTransitHouses = null;
              let formattedTransitPositions = data?.planet_positions;
              if ((timeControlledPositions || transitPositions) && showStandaloneTransit) {
                const positionsToUse = timeControlledPositions || transitPositions;

                // Deep copy natal houses to preserve signs, but clear their planets
                computedTransitHouses = JSON.parse(JSON.stringify(data.charts?.houses || {}));
                Object.keys(computedTransitHouses).forEach(h => {
                  computedTransitHouses[h].planets = [];
                });

                const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                Object.entries(positionsToUse).forEach(([planet, pos]) => {
                  if (!valid.includes(planet)) return;
                  const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor((pos.sidereal?.lon || pos.lon) / 30);
                  const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
                  if (!computedTransitHouses[houseNum]) computedTransitHouses[houseNum] = { planets: [] };
                  computedTransitHouses[houseNum].planets.push(planet);
                });

                // Ensure Ascendant stays in house 1
                if (computedTransitHouses[1]) {
                  computedTransitHouses[1].planets.unshift("Ascendant");
                }

                formattedTransitPositions = Object.entries(positionsToUse).filter(([k]) => valid.includes(k)).map(([k, v]) => {
                  const signIdx = v.sidereal?.sign_index !== undefined ? v.sidereal.sign_index : Math.floor((v.sidereal?.lon || v.lon) / 30);
                  const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;

                  let nakStr = "Unknown";
                  const rawNak = v.sidereal?.nakshatra || v.nakshatra;
                  let padaNum = v.nakshatra_pada || v.pada || 1;
                  if (typeof rawNak === 'string') {
                    nakStr = rawNak;
                  } else if (rawNak && typeof rawNak === 'object') {
                    nakStr = rawNak.name || "Unknown";
                    padaNum = rawNak.pada || padaNum;
                  }

                  return {
                    planet: k,
                    degree: Number(v.sidereal?.lon || v.lon || 0),
                    nakshatra: nakStr,
                    nakshatra_pada: padaNum,
                    house: houseNum,
                    sign: v.sidereal?.sign || v.sign || "Unknown",
                    sign_lord: v.sidereal?.sign_lord || v.sign_lord || "Unknown",
                    is_retrograde: v.is_retrograde || v.sidereal?.is_retrograde,
                    is_combust: v.is_combust || v.sidereal?.is_combust
                  };
                });
              }

              return (
                <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700 w-full">
                  <div className="w-full max-w-full bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[15rem] font-serif pointer-events-none -mr-10 -mt-10">D1</div>

                    <ZodiacChart
                      planetPositions={formattedTransitPositions}
                      houses={((timeControlledPositions || transitPositions) && showStandaloneTransit) ? computedTransitHouses : data.charts?.houses}
                      transitHouses={null}
                      onPlanetClick={handlePlanetClick}
                      title={(timeControlledDate && showStandaloneTransit) ? `Birth Chart (Lagna) + Transit (${new Date(timeControlledDate).toLocaleDateString()})` : "Birth Chart (Lagna)"}
                      variant="legacy"
                      defaultRect={true}
                      planetEffects={effects}
                      scaleText={1.5}
                    />
                  </div>

                  <div className="w-full bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-200">
                    <PlanetTable data={{ ...data, planet_positions: formattedTransitPositions }} onPlanetClick={handlePlanetClick} />
                  </div>

                  <div className="w-full">
                    <DrishtiTable houses={((timeControlledPositions || transitPositions) && showStandaloneTransit) ? computedTransitHouses : data.charts?.houses} reportData={data} />
                    <HouseEffectTable data={data} planetEffects={effects} customPositions={formattedTransitPositions} />
                    <ConjunctionAnalysis houses={((timeControlledPositions || transitPositions) && showStandaloneTransit) ? computedTransitHouses : data.charts?.houses} />
                  </div>
                </div>
              );
            })()}

            {cid === 'bhrigu_bindu' && (
              <div className="w-full max-w-5xl mx-auto">
                <BhriguBinduAnalysis data={data} />
              </div>
            )}

            {cid === 'rahu' && (
              <div className="w-full max-w-full mx-auto animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl mb-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 font-serif text-[12rem] -bottom-10 -right-10 pointer-events-none">RAHU</div>
                  <h3 className="text-4xl font-serif italic tracking-[0.2em] uppercase mb-2">North Node Diagnostic</h3>
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.4em]">Shadow Planet & Karmic Desires Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {(() => {
                    const rahuInfo = (data.planet_positions || []).find(p => p.planet === 'Rahu');
                    const houseNum = rahuInfo?.house;
                    const interpretation = RAHU_HOUSE_INTERPRETATIONS[houseNum];
                    return (
                      <div className="bg-white p-10 rounded-3xl border border-teal-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-teal-800">{houseNum}</div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🌑</div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Rahu in House {houseNum}</h4>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest mt-1 inline-block">Karmic Obsession</span>
                          </div>
                        </div>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-700" />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {cid === 'relationships' && (
              <PlanetaryRelationshipsViewer data={data} />
            )}

            {cid === 'ketu' && (
              <div className="w-full max-w-full mx-auto animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-r from-orange-900 to-red-950 p-10 rounded-[2.5rem] text-white shadow-2xl mb-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 font-serif text-[12rem] -bottom-10 -right-10 pointer-events-none">KETU</div>
                  <h3 className="text-4xl font-serif italic tracking-[0.2em] uppercase mb-2">South Node Diagnostic</h3>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.4em]">The Liberator & Past Life Detachment Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {(() => {
                    const ketuInfo = (data.planet_positions || []).find(p => p.planet === 'Ketu');
                    const houseNum = ketuInfo?.house;
                    const interpretation = KETU_HOUSE_INTERPRETATIONS[houseNum];
                    return (
                      <div className="bg-white p-10 rounded-3xl border border-orange-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-orange-800">{houseNum}</div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-orange-800 rounded-2xl flex items-center justify-center text-3xl shadow-lg">💥</div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Ketu in House {houseNum}</h4>
                            <span className="text-[10px] font-bold text-orange-900 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mt-1 inline-block">Moksha & Spirituality</span>
                          </div>
                        </div>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-700" />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {cid === 'd3' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-blue-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Drekkana Analysis (D3)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d3?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d3" />
                <p className="text-sm text-blue-900 italic mb-8">The D3 (Drekkana) chart is used to analyze siblings, courage, initiative, and short journeys. It reveals your inner drive, physical stamina, and how you exert your willpower.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d3?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D3_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd9' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Navamsha Analysis (D9)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d9?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d9" />
                <p className="text-[15px] text-amber-900 italic mb-8">The D-9 (Navamsha) chart is the most important divisional chart, representing the soul's true potential, destiny, marriage, and the second half of life. It acts as the microscopic view of the birth chart, revealing the ultimate strength or weakness of planets.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d9?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D9_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd10' && (
              <div className="w-full max-w-full mx-auto bg-zinc-200 p-10 rounded-3xl border border-indigo-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Dashamsha Analysis (D10)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d10?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <p className="text-[15px] text-amber-900 italic mb-8">{DASHAMSHA_INTRO}</p>
                <div className="w-full flex flex-col gap-10 mb-12">
                  {/* Iyer Method Branding */}
                  <div className="bg-indigo-900/5 p-6 rounded-[2rem] border-2 border-indigo-200 border-dashed text-center">
                    <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-[0.3em]">Precision Methodology</span>
                    <h4 className="text-2xl font-serif italic text-indigo-900 mt-3">Professional Iyer Dashamsha Engine</h4>
                    <p className="text-[11px] text-indigo-700/60 max-w-lg mx-auto mt-2 italic font-serif">
                      Utilizing the authentic Seshadri Iyer style for professional karma diagnostics.
                      Even sign offsets are calculated from the 9th house to ensure high-precision Parashari alignment.
                    </p>
                  </div>

                  {/* Career Heatmap Visualization */}
                  <CareerHeatmap data={[
                    { month: 1, score: 82, color: 'green' },
                    { month: 2, score: 78, color: 'green' },
                    { month: 3, score: 45, color: 'yellow' },
                    { month: 4, score: 91, color: 'green' },
                    { month: 5, score: 32, color: 'red' },
                    { month: 6, score: 64, color: 'yellow' },
                    { month: 7, score: 88, color: 'green' },
                    { month: 8, score: 72, color: 'green' },
                    { month: 9, score: 15, color: 'red' },
                    { month: 10, score: 55, color: 'yellow' },
                    { month: 11, score: 79, color: 'green' },
                    { month: 12, score: 84, color: 'green' },
                  ]} />

                  {/* Professional AI Diagnostics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PromotionMeter probability={74} />
                    <WealthActivation score={68} />
                    <CareerAlerts alerts={[
                      { type: 'activation', title: 'Promotion Window', message: 'Jupiter transiting 10H in D10 activates major professional growth.' },
                      { type: 'warning', title: 'Operational Friction', message: 'Saturn aspects D10 Lagna, suggesting temporary delays in execution.' },
                      { type: 'trigger', title: 'Dhan Yoga Trigger', message: 'Current dasha activates 2nd lord in D10, signaling financial gains.' }
                    ]} />
                  </div>
                </div>
                <DynamicVargaAnalysis data={data} cid="d10" />
                <p className="text-[15px] text-indigo-900 italic mb-8">The D-10 (Dashamsha) chart reveals your karma, career trajectory, power, and professional reputation. It acts as the microscopic view of the 10th house of your birth chart, detailing what you will achieve in the world and how you handle authority.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d10?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D10_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    const pInfo = p.planet === 'Ascendant' ? data.vargas?.d10 : data.vargas?.d10?.varga_positions?.[p.planet];
                    const deity = p.planet === 'Ascendant' ? data.vargas?.d10?.ascendant_deity : pInfo?.deity;
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200 group relative">
                        {deity && (
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Dashamsha Deity</span>
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-md">{deity}</span>
                          </div>
                        )}
                        <h4 className="text-lg font-black uppercase text-indigo-900 mb-2">{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-indigo-800" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd2' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Hora Analysis (D2)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d2?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d2" />
                <p className="text-sm text-amber-900 italic mb-8">{HORA_INTRO}</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d2?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D2_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd4' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-emerald-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Chaturthamsa Analysis (D4)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d4?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d4" />
                <p className="text-sm text-emerald-900 italic mb-8">The D4 (Chaturthamsha) chart is used to analyze destiny, fortune, happiness, properties, and home environment.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d4?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D4_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd5' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-purple-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Panchamsha Analysis (D5)</h3>
                <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mb-6">Fame · Power · Authority · Recognition</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d5?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d5" />
                <p className="text-sm text-purple-900 italic mb-8">The D-5 (Panchamsha) chart reveals one's capacity for fame, authority, and power. It uncovers the karmic merits accumulated in past lives that now manifest as recognition, status, or political influence. Planets placed powerfully here indicate areas where the native commands respect and authority in this lifetime.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d5?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D5_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd6' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-orange-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Shashtamsha Analysis (D6)</h3>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-6">Health · Diseases · Debts · Enemies</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d6?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d6" />
                <p className="text-[15px] text-orange-900 italic mb-8">The D-6 (Shashtamsha) chart is the primary divisional chart for diagnosing health vulnerabilities, chronic diseases, debts, and enemies. Afflicted planets in this chart can indicate areas of the body or aspects of life that require special attention and remedial measures.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d6?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D6_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd7' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-rose-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Saptamsa Analysis (D7)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d7?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d7" />
                <p className="text-sm text-rose-900 italic mb-8">The D7 (Saptamsha) chart is the primary divisional chart for analyzing progeny (children), creativity, and the legacy you leave behind. It reveals your nurturing capacity and creative intelligence.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d7?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D7_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd8' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-gray-300 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Ashtamsha Analysis (D8)</h3>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-6">Longevity · Obstacles · Hidden Matters · Transformation</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d8?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d8" />
                <p className="text-[15px] text-gray-900 italic mb-8">The D-8 (Ashtamsha) chart examines longevity, obstacles, chronic difficulties, and transformative events in the native's life. Planets afflicted here can indicate areas of prolonged struggle or sudden reversals, while strong planets suggest the ability to overcome impediments and achieve breakthrough transformations.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d8?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D8_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd11' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-teal-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Rudramsha Analysis (D11)</h3>
                <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-6">Gains · Fortune · Elder Siblings · Fulfillment of Desires</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d11?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} scaleText={1.5} />
                </div>
                <p className="text-sm text-teal-900 italic mb-8">The D-11 (Rudramsha or Ekadashamsha) chart governs gains, income, elder siblings, and the fulfillment of desires. It reveals the native's capacity to accumulate wealth and benefit from social networks. Powerful planets here enhance the ability to receive fortune and recognition through one's efforts.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d11?.houses).map((p) => (
                    <section key={p.planet} className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                      <h4 className="text-lg font-black uppercase text-teal-900 mb-2">{p.planet} · House {p.house}</h4>
                      <p className="text-sm text-slate-700 italic">{p.planet} in House {p.house} of the Rudramsha chart shapes the native's capacity for gains, fulfillment of aspirations, and relationships with elder siblings.</p>
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd12' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Dwadasamsa Analysis (D12)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d12?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d12" />
                <p className="text-[15px] text-slate-900 italic mb-8">The D-12 (Dwadasamsa) chart analyzes parents, ancestry, lineage, and the psychological heritage you inherit. It reveals your relationship with authority figures and your capacity to carry forward your family's legacy.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d12?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D12_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd16' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-indigo-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Shodasamsa Analysis (D16)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d16?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d16" />
                <p className="text-[15px] text-indigo-900 italic mb-8">The D-16 (Shodasamsa) chart represents vehicles, conveyances, inner peace, and the comforts of life. It reveals your deep psychological happiness, emotional stability, and the level of luxury or peace of mind you are destined to enjoy.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d16?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D16_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd24' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-violet-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Chaturvimshamsa Analysis (D24)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d24?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d24" />
                <p className="text-[15px] text-violet-900 italic mb-8">The D-24 (Chaturvimshamsha) chart represents education, intellect, abstract learning, and the acquisition of skills. It reveals your capacity for deep study, academic success, and the mastery of specialized knowledge.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d24?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D24_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd30' && (

              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-red-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Trimshamsa Analysis (D30)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d30?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>

                <DynamicVargaAnalysis data={data} cid="d30" />

                <p className="text-[15px] text-red-900 italic mb-8">The D-30 (Trimshamsa) chart reveals your subconscious fears, psychological shadows, hidden enemies, and susceptibility to misfortunes or diseases. It exposes how you handle deep adversity and karmic punishments.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d30?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D30_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];

                    if (!interpretation) return null;

                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd60' && (
              <div className="w-full max-w-full mx-auto bg-zinc-200 p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Shashtiamsa Analysis (D60)</h3>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d60?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <p className="text-[15px] text-amber-900 italic mb-8">{D60_INTRO}</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d60?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D60_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];

                    if (!interpretation) return null;

                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd20' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-indigo-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Vimsamsa Analysis (D20)</h3>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mb-6">Spiritual Growth · Meditation · Worship · Religious Merit</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d20?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d20" />
                <p className="text-[15px] text-indigo-900 italic mb-8">The D-20 (Vimshamsha) chart is the ultimate map of your spiritual progress, religious devotion, meditative capacity, and esoteric knowledge. It reveals your soul's capacity for true enlightenment and deep worship.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d20?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D20_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd27' && (
              <div className="w-full max-w-full mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Bhamsa Analysis (D27)</h3>
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-6">Inner Strength · Vitality · Soul Power · General Well-being</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d27?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <DynamicVargaAnalysis data={data} cid="d27" />
                <p className="text-[15px] text-amber-900 italic mb-8">The D-27 (Bhamsa) chart is the ultimate map of your inner strength, subconscious vitality, and soul power. It acts as the microscopic view of your spiritual resilience, detailing how you overcome deep psychological or physical vulnerabilities.</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d27?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D27_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];
                    if (!interpretation) return null;
                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd40' && (
              <div className="w-full max-w-full mx-auto bg-zinc-200 p-10 rounded-3xl border border-teal-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Khavedamsa Analysis (D40)</h3>
                <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-6">Auspicious Results · Maternal Lineage · General Prosperity · Luck</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d40?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <p className="text-[15px] text-amber-900 italic mb-8">{D40_INTRO}</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d40?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D40_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];

                    if (!interpretation) return null;

                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {cid === 'd45' && (
              <div className="w-full max-w-full mx-auto bg-zinc-200 p-10 rounded-3xl border border-slate-300 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Akshavedamsa Analysis (D45)</h3>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mb-6">Character · Destiny · Paternal Lineage · All-around Prosperity</p>
                <div className="w-full max-w-full mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.vargas?.d45?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={effects} scaleText={1.5} />
                </div>
                <p className="text-[15px] text-amber-900 italic mb-8">{D45_INTRO}</p>
                <div className="space-y-6">
                  {getPlanetPositionsFromHouses(data.vargas?.d45?.houses).map((p) => {
                    const status = effects && effects[p.planet] ? effects[p.planet] : "neutral";
                    const statusKey = status === "positive" ? "positive" : status === "negative" ? "negative" : "neutral";
                    const interpretation = D45_INTERPRETATIONS[p.planet]?.[p.house]?.[statusKey];

                    if (!interpretation) return null;

                    return (
                      <section key={p.planet} className={`rounded-2xl p-6 border ${statusKey === 'positive' ? 'bg-green-50 border-green-200' : statusKey === 'negative' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className={`text-lg font-black uppercase mb-2 ${statusKey === 'positive' ? 'text-green-900' : statusKey === 'negative' ? 'text-red-900' : 'text-blue-900'}`}>{p.planet} · House {p.house} <span className="text-xs ml-2 opacity-60">({statusKey})</span></h4>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-900" />
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {(cid === 'transit_compare' || cid === 'transit_compare2') && (
              <div style={{ width: '100%', maxWidth: '100%', display: 'flex', gap: 0, height: 'calc(100vh - 56px)', alignItems: 'stretch' }}>
                {/* ── Left sidebar: Time Control Engine ── */}
                {(cid === 'transit_compare' || cid === 'transit_compare2') && (
                  <div
                    onClick={() => {
                      if (!showVimshottariTransitControl) setShowVimshottariTransitControl(true);
                    }}
                    style={{
                      width: showVimshottariTransitControl ? 260 : 40, flexShrink: 0,
                      background: 'linear-gradient(180deg, hsla(220, 71%, 24%, 1.00) 0%, hsla(245, 83%, 36%, 1.00) 100%)',
                      borderRight: '0.2px solid rgba(99,102,241,0.25)',
                      padding: showVimshottariTransitControl ? '12px 10px' : '12px 4px',
                      overflowY: 'auto',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      cursor: showVimshottariTransitControl ? 'default' : 'pointer'
                    }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVimshottariTransitControl(!showVimshottariTransitControl);
                      }}
                      className="w-full bg-rose-200 hover:bg-white/20 text-white rounded py-2 mb-4 text-[14px] font-bold flex items-center justify-center gap-2"
                      title={showVimshottariTransitControl ? "Close Time Control" : "Open Time Control"}
                    >
                      {showVimshottariTransitControl ? "◀ Close" : "⏱️"}
                    </button>
                    {!showVimshottariTransitControl && (
                      <div className="flex-1 flex flex-col items-center justify-center opacity-70 pointer-events-none pb-20">
                        <span style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          color: 'hsla(354, 55%, 83%, 1.00)',
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          fontSize: '18px',
                          fontWeight: '900',
                          whiteSpace: 'nowrap'
                        }}>
                          Transit Time Control
                        </span>
                      </div>
                    )}
                    {showVimshottariTransitControl && (
                      <div className="w-full animate-in slide-in-from-left duration-300">
                        <TransitTimeControl
                          lat={data?.basic_details?.lat || 28.6}
                          lon={data?.basic_details?.lon || 77.2}
                          onTransitChange={(positions, dt) => {
                            setTimeControlledPositions(positions);
                            setTimeControlledDate(dt);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Right: Combined chart + analysis ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                  {/* Header strip */}
                  <div style={{
                    background: 'linear-gradient(135deg, hsla(30, 57%, 97%, 1.00) 0%, hsla(30, 7%, 94%, 1.00) 100%)',
                    borderRadius: 14, padding: '14px 20px', marginBottom: 16,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                  }}>
                    <div>
                      <h3 style={{ color: '#1031a0ff', fontSize: 18, fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                        Transit Diagnostic Matrix
                      </h3>
                      <p style={{ color: 'rgba(1, 1, 15, 0.84)', fontSize: 14, fontWeight: 700, letterSpacing: '0.2em', margin: '3px 0 0', textTransform: 'uppercase' }}>
                        Inner: Janma (Birth) · Outer: Gochar (Transit)
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'rgba(187, 38, 18, 1)' }}>
                        {timeControlledDate ? timeControlledDate.toLocaleDateString('hi-IN') : new Date().toLocaleDateString('hi-IN')}
                      </div>
                      <p style={{ fontSize: 12, color: '#475569', margin: '2px 0 0' }}>
                        {timeControlledDate ? timeControlledDate.toLocaleTimeString() : 'Real-time'}
                      </p>
                    </div>
                  </div>

                  {/* Combined Janma + Gochar double-ring chart */}
                  <div style={{
                    background: '#fff', borderRadius: 20, padding: 20,
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    marginBottom: 16,
                    position: 'relative'
                  }}>
                    {cid === 'transit_compare2' && (
                      <div className="absolute top-16 right-4 flex items-center gap-2 z-10">
                        <label className="text-indigo-900 text-[10px] font-black uppercase tracking-widest">Base Chart:</label>
                        <select
                          className="bg-indigo-50 text-indigo-900 text-[11px] font-bold py-1 px-2 rounded-md border border-indigo-200 outline-none shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors"
                          value={transitCompareBaseChart}
                          onChange={(e) => setTransitCompareBaseChart(e.target.value)}
                        >
                          <option value="charts">D1 (Lagna)</option>
                          <option value="d2">D2 (Hora)</option>
                          <option value="d3">D3 (Drekkana)</option>
                          <option value="d4">D4 (Chaturthamsha)</option>
                          <option value="d5">D5 (Panchamsha)</option>
                          <option value="d7">D7 (Saptamsha)</option>
                          <option value="d9">D9 (Navamsha)</option>
                          <option value="d10">D10 (Dashamsha)</option>
                          <option value="d12">D12 (Dwadashamsha)</option>
                          <option value="d16">D16 (Shodashamsha)</option>
                          <option value="d20">D20 (Vimshamsha)</option>
                          <option value="d24">D24 (Chaturvimshamsha)</option>
                          <option value="d27">D27 (Saptavimshamsha)</option>
                          <option value="d30">D30 (Trimshamsha)</option>
                          <option value="d40">D40 (Khavedamsha)</option>
                          <option value="d45">D45 (Akshavedamsha)</option>
                          <option value="d60">D60 (Shashtiamsha)</option>
                        </select>
                      </div>
                    )}
                    <TransitPanel
                      data={data}
                      transitPositions={timeControlledPositions || transitPositions}
                      baseChartKey={cid === 'transit_compare2' ? transitCompareBaseChart : 'charts'}
                      onChartClick={() => setShowVimshottariTransitControl(true)}
                    />
                  </div>
                </div>
              </div>
            )}

            {(() => {
              if (cid === 'current_positions') return <CurrentPositionsDashboard initialData={data} />;
              if (cid === 'planets_table') return <div className="p-10"><PlanetTable data={data} /></div>;
              if (cid === 'panchang') return <div className="p-10"><PanchangPanel data={data} /></div>;
              if (cid === 'numerical') return <div className="p-10"><NumericalPanel data={data} /></div>;
              if (cid === 'shodashottari') return <div className="p-10"><SecondaryDashaPanel data={data} type="shodashottari" /></div>;
              if (cid === 'chaturshitisama') return <div className="p-10"><SecondaryDashaPanel data={data} type="chaturshitisama" /></div>;
              if (cid === 'ashtottari') return <div className="p-10"><SecondaryDashaPanel data={data} type="ashtottari" /></div>;
              if (cid === 'dwisaptatisama') return <div className="p-10"><SecondaryDashaPanel data={data} type="dwisaptatisama" /></div>;
              if (cid === 'dwadashottari') return <div className="p-10"><SecondaryDashaPanel data={data} type="dwadashottari" /></div>;
              if (cid === 'panchottari') return <div className="p-10"><SecondaryDashaPanel data={data} type="panchottari" /></div>;
              if (cid === 'shatabdika') return <div className="p-10"><SecondaryDashaPanel data={data} type="shatabdika" /></div>;
              if (cid === 'shashtihayani') return <div className="p-10"><SecondaryDashaPanel data={data} type="shashtihayani" /></div>;
              if (cid === 'chara') return <div className="p-10"><SecondaryDashaPanel data={data} type="chara" /></div>;
              if (cid === 'sthira') return <div className="p-10"><SecondaryDashaPanel data={data} type="sthira" /></div>;
              if (cid === 'shoola') return <div className="p-10"><SecondaryDashaPanel data={data} type="shoola" /></div>;
              if (cid === 'niryaana_shoola') return <div className="p-10"><SecondaryDashaPanel data={data} type="niryaana_shoola" /></div>;
              if (cid === 'mandooka') return <div className="p-10"><SecondaryDashaPanel data={data} type="mandooka" /></div>;
              if (cid === 'drig') return <div className="p-10"><SecondaryDashaPanel data={data} type="drig" /></div>;
              if (cid === 'sudasha') return <div className="p-10"><SecondaryDashaPanel data={data} type="sudasha" /></div>;
              if (cid === 'dignity') return <div className="p-10"><DignityTable data={data} planetEffects={effects} /></div>;
              if (cid === 'drishti') return <div className="p-10"><DrishtiTable houses={data.charts?.houses} reportData={data} /></div>;
              if (cid === 'ai_oracle') return <div className="w-full h-full overflow-y-auto"><AIOraclePanel data={data} /></div>;
              if (cid === 'vimshottari') return (
                <div style={{ width: '100%', maxWidth: '100%', display: 'flex', gap: 0, height: 'calc(100vh - 56px)', alignItems: 'stretch' }}>
                  {/* ── Left sidebar: Time Control Engine ── */}
                  <div
                    onClick={() => {
                      if (!showVimshottariTransitControl) setShowVimshottariTransitControl(true);
                    }}
                    style={{
                      width: showVimshottariTransitControl ? 260 : 40, flexShrink: 0,
                      background: 'linear-gradient(180deg, hsla(220, 71%, 24%, 1.00) 0%, hsla(245, 83%, 36%, 1.00) 100%)',
                      borderRight: '0.2px solid rgba(99,102,241,0.25)',
                      padding: showVimshottariTransitControl ? '12px 10px' : '12px 4px',
                      overflowY: 'auto',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      cursor: showVimshottariTransitControl ? 'default' : 'pointer'
                    }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVimshottariTransitControl(!showVimshottariTransitControl);
                      }}
                      className="w-full bg-rose-200 hover:bg-white/20 text-white rounded py-2 mb-4 text-[14px] font-bold flex items-center justify-center gap-2"
                      title={showVimshottariTransitControl ? "Close Time Control" : "Open Time Control"}
                    >
                      {showVimshottariTransitControl ? "◀ Close" : "⏱️"}
                    </button>
                    {!showVimshottariTransitControl && (
                      <div className="flex-1 flex flex-col items-center justify-center opacity-70 pointer-events-none pb-20">
                        <span style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          color: 'hsla(354, 55%, 83%, 1.00)',
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          fontSize: '18px',
                          fontWeight: '900',
                          whiteSpace: 'nowrap'
                        }}>
                          Transit Time Control
                        </span>
                      </div>
                    )}
                    {showVimshottariTransitControl && (
                      <div className="w-full animate-in slide-in-from-left duration-300">
                        <TransitTimeControl
                          lat={data?.basic_details?.lat || 28.6}
                          lon={data?.basic_details?.lon || 77.2}
                          onTransitChange={(positions, dt) => {
                            setDashaSimDate(dt);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* ── Right side: Vimshottari Table/Dashboard ── */}
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                    <div className="shrink-0" style={{ minHeight: '420px', flex: 1 }}>
                      <VimshottariTable data={data} transitDate={dashaSimDate} />
                    </div>
                    <div className="shrink-0 border-t-4 border-indigo-300">
                      <DashaDashboard data={data} />
                    </div>
                    <div className="shrink-0 border-t-4 border-amber-300">
                      <VimshottariLifeTable data={data} />
                    </div>
                    <div className="shrink-0 border-t-4 border-emerald-300">
                      <VimshottariGridTimeline data={data} />
                    </div>
                  </div>
                </div>
              );
              if (cid === 'shadbala') return <div className="p-10"><ShadbalaChart data={data.strength} onlyRatio={false} /></div>;
              if (cid === 'ashtakavarga') return <div className="h-[600px] overflow-hidden"><AshtakavargaViewer data={data} /></div>;
              if (cid === 'ashtakavarga_reduction') return <div className="w-full h-full overflow-y-auto bg-white p-4"><AsthavargaReduction data={data} /></div>;
              if (cid === 'bhinnastavarga') return <div className="w-full h-full overflow-y-auto bg-white p-4"><BhinnastaVarga data={data} /></div>;
              if (cid === 'krishnamurthy_chart') return <div className="w-full h-full overflow-y-auto bg-white p-4"><KrishanaMurthyChart formData={data} /></div>;
              if (cid === 'krishnamurthy_significators') return <div className="w-full h-full overflow-y-auto bg-white p-4"><KrishanaMurthySignificators formData={data} /></div>;
              if (cid === 'shodashvarga_summary') return <div className="w-full h-full overflow-y-auto bg-white p-4"><ShodashvargaSummary data={data} /></div>;
              if (cid === 'aspects_summary') return <div className="w-full h-full overflow-y-auto bg-white p-4"><AspectsSummary data={data} /></div>;
              if (cid === 'gemstones') return <div className="p-10"><GemstonePanel data={data} /></div>;
              if (cid === 'transit_gemstones') return <div className="p-10"><TransitGemstonePanel data={data} transitPositions={transitPositions} /></div>;
              if (cid === 'transit') return <div className="p-10"><TransitPanel data={data} transitPositions={transitPositions} /></div>;
              if (cid === 'vimsopaka') return <div className="p-10 w-full max-w-full mx-auto"><VimsopakaAssessment data={data} /></div>;
              if (cid === 'bhavbala') return <div className="p-10 w-full max-w-full mx-auto"><BhavbalaView data={data} /></div>;
              if (cid === 'panch_pakshi') return <div className="p-8 w-full max-w-[95%] mx-auto"><PanchPakshiTable data={data} /></div>;
              if (cid === 'kp') return <div className="w-full h-full overflow-y-auto bg-white"><KPChartViewer formData={data} /></div>;
              return null;
            })()}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-500 italic uppercase">Astro Consult : Independent Viewport Mode</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center font-serif text-slate-400 italic">Preparing Worksheet...</div>;

  const meta = data.meta || {};
  const basic = data.basic_details || {};
  const planetEffects = calculatePlanetEffects(data);

  // Profile Information Extraction
  const moonData = (data.planet_positions || []).find(p => p.planet === "Moon") || {};
  const sunData = (data.planet_positions || []).find(p => p.planet === "Sun") || {};

  let dobString = "Unknown";
  if (basic.birth_datetime) {
    dobString = basic.birth_datetime;
  } else if (basic.day) {
    dobString = `${basic.day}/${basic.month}/${basic.year} ${basic.hour || '00'}:${basic.minute || '00'}`;
  } else if (meta.date) {
    dobString = meta.date;
  }

  const profileInfo = {
    name: meta.name || basic.name || "Astro Native",
    dob: dobString,
    location: meta.location || basic.place || "Unknown",
    moonSign: moonData.sign || "Unknown",
    sunSign: sunData.sign || "Unknown",
    nakshatra: moonData.nakshatra || "Unknown"
  };

  const handleOpenMatchmaking = () => {
    window.open('/?matchmaking=true', 'DivineCompatibility', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
  };
  const handleOpenBiodata = () => {
    window.open('/?biodata=true', 'MarriageBiodata', 'width=1000,height=900,menubar=no,toolbar=no,location=no,status=no');
  };
  const handleExportPDF = async () => {
    try {
      let tzOffset = 5.5; // default to IST
      if (meta?.timezone) {
        const tzStr = meta.timezone; // format: UTC+05:30
        const match = tzStr.match(/UTC([+-])(\d+):(\d+)/);
        if (match) {
          const sign = match[1] === '+' ? 1 : -1;
          const hours = parseInt(match[2], 10);
          const mins = parseInt(match[3], 10);
          tzOffset = sign * (hours + mins / 60);
        }
      }
      const payload = {
        name: profileInfo.name,
        date: data?.basic_details?.birth_date || "1990-01-01",
        time: data?.basic_details?.birth_time || "12:00:00",
        tz_offset: tzOffset,
        lat: data?.basic_details?.lat || 28.6139,
        lon: data?.basic_details?.lon || 77.2090,
        style: "premium",
        language: "english",
        gender: meta?.gender || "",
        location_name: profileInfo.location,
        active_sections: null,
      };
      const fileUrl = await createReport(payload);
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.target = '_blank';
        a.download = `Astro_Report_${profileInfo.name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to get PDF URL from backend");
      }
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF.");
    }
  };

  return (
    <div id="pdf-content" className="flex flex-col min-h-screen h-auto bg-[#f1f5f9] font-serif overflow-y-auto overflow-x-hidden w-full">
      <style>{`
        button, button span, button div, button p, button h4 {
          color: black !important;
        }
      `}</style>


      <div className="bg-[#fffcf5] border-b border-amber-100 py-1.5 shadow-sm shrink-0 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-serif italic text-amber-900 tracking-widest">
              ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-indigo-50 text-Red shadow-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div onClick={handleSecretClick} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg cursor-pointer select-none">✨</div>
          <div>
            <h2 className="text-md font-serif italic font-black uppercase tracking-widest leading-none">Interactive Vedic Worksheet</h2>
            <p className="text-[9px] opacity-70 uppercase font-sans tracking-tighter mt-1">Astro Consult : Legacy Workstation</p>
          </div>

          <div className="ml-8 hidden lg:flex items-center gap-4 z-[100]">
            <div className="relative group/varga">
              <button className="bg-rose-100 hover:bg-indigo-200 text-black px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30 outline-none cursor-pointer flex items-center gap-2">
                VARGA CHARTS <span className="text-[10px]">▼</span>
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/varga:opacity-100 group-hover/varga:visible transition-all duration-200 py-2">
                <button onClick={() => window.open('/?chart_view_1=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Chart View 1</button>
                <button onClick={() => window.open('/?chart_view_2=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Chart View 2</button>
                <button onClick={() => window.open('/?chart_view_3=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Chart View 3</button>
                {['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60'].map(v => (
                  <button
                    key={v}
                    onClick={() => handleMaximizeInNewWindow(v)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                  >
                    {v.toUpperCase()} Chart
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group/other">
              <button className="bg-rose-100 hover:bg-indigo-200 text-black px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30 outline-none cursor-pointer flex items-center gap-2">
                ASTRO REPORTS <span className="text-[10px]">▼</span>
              </button>






              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/other:opacity-100 group-hover/other:visible transition-all duration-200 py-2">
                {/* Readings Subcategory */}
                <div className="relative group/readings">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Readings <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/readings:opacity-100 group-hover/readings:visible transition-all duration-200 py-2">
                    <button onClick={() => window.open('/?advanced_nakshatra=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">ADV. Nakshatra</button>
                    <button onClick={() => window.open('/?astro_tm=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Astro TM</button>
                    <button onClick={() => window.open('/?dasa_timeline=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Dasha Time</button>
                    <button onClick={() => window.open('/?longevity=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Longevity Analysis</button>
                    <button onClick={() => window.open('/?ayurdaya=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors uppercase tracking-tight">Ayurdaya (Life Force)</button>
                    <button onClick={() => window.open('/?medical_astrology=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors uppercase tracking-tight">Ayur Jyotish (Medical Astrology)</button>
                    <button onClick={() => window.open('/?naming=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Naming</button>
                    <button onClick={() => window.open('/?solarsystem3d=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">3D Solar System</button>
                    <button onClick={() => handleMaximizeInNewWindow('ai_oracle')} className="w-full text-left px-4 py-2 text-xs font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text animate-pulse hover:bg-indigo-50 transition-all uppercase tracking-widest flex items-center justify-between">
                      <span>AI Oracle</span>
                      <span className="text-pink-500 animate-bounce">✨</span>
                    </button>
                    {CELL_CONTENTS.filter(c => ["planets_table", "panchang", "numerical", "gemstones", "transit_gemstones", "d11"].includes(c.id)).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleMaximizeInNewWindow(c.id)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                      >
                        {c.label.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evaluation Subcategory */}
                <div className="relative group/evaluation">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Evaluation <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/evaluation:opacity-100 group-hover/evaluation:visible transition-all duration-200 py-2">
                    <button onClick={() => window.open('/?bala_strengths=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Bala Strengths</button>
                    {CELL_CONTENTS.filter(c => ["shadbala", "bhavbala", "vimsopaka", "shodashvarga_summary", "dignity", "relationships", "aspects_summary", "ashtakavarga", "ashtakavarga_reduction", "krishnamurthy_chart", "krishnamurthy_significators"].includes(c.id)).map(c => (
                      <React.Fragment key={c.id}>
                        <button
                          onClick={() => handleMaximizeInNewWindow(c.id)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                        >
                          {c.label.split(' - ')[0]}
                        </button>
                        {c.id === 'relationships' && (
                          <button onClick={() => window.open('/?navamsha_ages=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Navamsha Ages</button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Graha Dasha Subcategory */}
                <div className="relative group/grahadasha">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Graha Dasha <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/grahadasha:opacity-100 group-hover/grahadasha:visible transition-all duration-200 py-2 z-50">
                    {CELL_CONTENTS.filter(c => ["vimshottari", "panch_pakshi", "shodashottari", "chaturshitisama", "ashtottari", "dwisaptatisama", "dwadashottari", "panchottari", "shatabdika", "shashtihayani"].includes(c.id)).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleMaximizeInNewWindow(c.id)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                      >
                        {c.label.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rashi Dasha Subcategory */}
                <div className="relative group/rashidasha">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Rashi Dasha <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/rashidasha:opacity-100 group-hover/rashidasha:visible transition-all duration-200 py-2 z-50">
                    {CELL_CONTENTS.filter(c => ["chara", "mandooka", "drig", "sudasha"].includes(c.id)).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleMaximizeInNewWindow(c.id)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                      >
                        {c.label.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aayu Dasha (Longevity) Subcategory */}
                <div className="relative group/aayudasha">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-red-900 hover:bg-red-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Aayu Dasha (Longevity) <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-red-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/aayudasha:opacity-100 group-hover/aayudasha:visible transition-all duration-200 py-2 z-50">
                    {CELL_CONTENTS.filter(c => ["shoola", "niryaana_shoola", "sthira"].includes(c.id)).map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleMaximizeInNewWindow(c.id)}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors uppercase tracking-tight"
                      >
                        {c.label.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vrasphal Subcategory */}
                <div className="relative group/vrasphal">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-indigo-900 hover:bg-indigo-50 flex items-center justify-between border-b border-indigo-50 transition-colors">
                    Vrasphal <span className="text-[10px]">▶</span>
                  </button>
                  <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/vrasphal:opacity-100 group-hover/vrasphal:visible transition-all duration-200 py-2">
                    <button onClick={() => window.open('/?annual_varshaphala=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Annual Varshaphala</button>
                    <button onClick={() => window.open('/?varshaphala_details=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Varshaphala Details</button>
                    <button onClick={() => window.open('/?detailed_charts=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Detailed Charts</button>
                    <button onClick={() => window.open('/?harsha_bala=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Harsh Bala</button>
                    <button onClick={() => window.open('/?tajika_yogas=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Tajika Yogas</button>
                    <button onClick={() => window.open('/?tripataki_chakra=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Tripataki Chakra</button>
                  </div>
                </div>

                {CELL_CONTENTS.filter(c => c.category !== "System" && c.id !== "transit_compare" && !['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60', 'shadbala', 'bhavbala', 'vimsopaka', 'shodashvarga_summary', 'dignity', 'relationships', 'aspects_summary', 'ashtakavarga', 'ashtakavarga_reduction', 'krishnamurthy_chart', 'krishnamurthy_significators', 'planets_table', 'panchang', 'numerical', 'gemstones', 'transit_gemstones', 'vimshottari', 'shodashottari', 'chaturshitisama', 'ashtottari', 'dwisaptatisama', 'dwadashottari', 'panchottari', 'shatabdika', 'shashtihayani', 'chara', 'sthira', 'shoola', 'niryaana_shoola', 'mandooka', 'drig', 'sudasha', 'panch_pakshi', 'advanced_nakshatra', 'd11'].includes(c.id)).map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (c.id === 'advanced_nakshatra') {
                        window.open('/?advanced_nakshatra=true', '_blank');
                      } else {
                        handleMaximizeInNewWindow(c.id);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight"
                  >
                    {c.label.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group/astro">
              <button className="bg-rose-100 hover:bg-indigo-200 text-black px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30 outline-none cursor-pointer flex items-center gap-2">
                ASTRO CHARTS <span className="text-[10px]">▼</span>
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/astro:opacity-100 group-hover/astro:visible transition-all duration-200 py-2">
                <button onClick={() => handleMaximizeInNewWindow('lagna')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Lagna</button>
                <button onClick={() => window.open('/?classic_layout=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Classic View</button>
                <button onClick={() => window.open('/?classic_layout_2=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Classic View 2</button>
                <button onClick={() => window.open('/?kalachakra=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Kalachakra Diagram</button>
                <button onClick={() => window.open('/?classic_layout_3=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Classic View 3</button>
                <button onClick={() => window.open('/?classic_layout_4=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Classic View 4</button>
                <button onClick={() => window.open('/?transit_compare=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Compare Transit</button>
                <button onClick={() => window.open('/?transit_compare2=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Compare Transit 2</button>
                <button onClick={() => window.open('/?animated_transits=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Animated Transit</button>
                <button onClick={() => window.open('/?sunrise_chart=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Sunrise Chart</button>
                <button onClick={() => window.open('/?solar_return=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Solar Return</button>
                <button onClick={() => window.open('/?daily_solar=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Daily Solar</button>
                <button onClick={() => window.open('/?kp_chart=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">KP Chart</button>
                <button onClick={() => handleMaximizeInNewWindow('transit')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Today Gochar</button>
                <button onClick={() => handleMaximizeInNewWindow('current_positions')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Current Planet Position</button>
                <button onClick={() => handleMaximizeInNewWindow('bhinnastavarga')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Bhinnashtavarga</button>
                <button onClick={() => window.open('/?lordships=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Lordships</button>
                <button onClick={() => window.open('/?varga_sign_chart=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Varga Sign Chart</button>
                <button onClick={() => window.open('/?gochara_wheel=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Gochar Wheel</button>
                <button onClick={() => window.open('/?gochara_wheel_1=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Gochar Wheel 1</button>
                <button onClick={() => window.open('/?nakshatra_dasha=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Nakshatra Dasha</button>
                <button onClick={() => window.open('/?rashi_dashas=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Rashi Dashas</button>
                <button onClick={() => window.open('/?lagnas=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Lagnas</button>
                <button onClick={() => window.open('/?jaimini_karakas=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Jaimini Karakas</button>
                <button onClick={() => window.open('/?jaimini_advanced=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight flex justify-between items-center">
                  Advanced Jaimini <span className="text-emerald-500">🌀</span>
                </button>
                <button onClick={() => window.open('/?sbc_dashboard=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Sarvatobhadra Dashboard</button>
                <button onClick={() => window.open('/?bhrigu_bindu=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Bhrigu Bindu</button>
                <button onClick={() => window.open('/?d108=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">D108</button>
                <button onClick={() => window.open('/?ayanamsha=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Ayanamsha</button>
                <button onClick={() => window.open('/?sanghatta=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Sanghatta</button>
                <button onClick={() => window.open('/?karaka=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Karakas</button>
                <button onClick={() => window.open('/?tithi=true', '_blank')} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Tithi Pravesha</button>
                <button onClick={() => {
                  localStorage.setItem('worksheetData', JSON.stringify(data));
                  window.open('/?kota_chakra=true', '_blank');
                }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight">Kota Chakra</button>
              </div>
            </div>

            <div className="relative group/oracle">
              <button className="bg-rose-100 hover:bg-indigo-200 text-black px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30 outline-none cursor-pointer flex items-center gap-2">
                ORACLE TOOLS <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white border border-indigo-100 rounded-xl shadow-2xl opacity-0 invisible group-hover/oracle:opacity-100 group-hover/oracle:visible transition-all duration-200 py-2">
                {oracle_items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleOracleClick(item.id)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors uppercase tracking-tight flex items-center gap-2"
                  >
                    <span className="text-sm">{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>


          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4 border-r border-white/20 pr-4">
            <span className="text-[10px] uppercase opacity-60">Native</span>
            <span className="text-xs font-black text-amber-400">{meta.name || basic.name || "Astro Native"}</span>
          </div>
          <button onClick={handleExportPDF} className="bg-rose-100 hover:bg-emerald-700 text-black px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30">
            Export Report PDF
          </button>
        </div>
      </div>

      <div className="w-full flex-1 p-4 bg-rose-100 flex flex-col gap-4 min-h-[650px] overflow-y-auto">
        {isBlankSheet ? (
          <div className="flex-1 w-full flex flex-col relative">
            {blankSheetItems.length > 0 ? (
              <div className="relative w-full min-h-[1200px] h-full pb-20 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                {blankSheetItems.map((item, index) => {
                  const defaultSize = getDefaultSize(item.size);
                  const w = item.w || defaultSize.w;
                  const h = item.h || defaultSize.h;
                  return (
                    <div
                      key={item.uniqueId}
                      className={`absolute bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] border border-indigo-100 flex flex-col overflow-auto group`}
                      style={{ left: item.x || 0, top: item.y || 0, width: w, height: h, zIndex: 10 + index }}
                    >
                      {/* Resize Handles */}
                      <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'nw')} />
                      <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'ne')} />
                      <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'sw')} />
                      <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'se')} />
                      <div className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-40" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'n')} />
                      <div className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-40" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 's')} />
                      <div className="absolute left-0 top-3 bottom-3 w-2 cursor-ew-resize z-40" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'w')} />
                      <div className="absolute right-0 top-3 bottom-3 w-2 cursor-ew-resize z-40" onPointerDown={(e) => handleResizeDown(e, item.uniqueId, 'e')} />
                      {/* Drag Handle */}
                      <div
                        className="w-full h-8 bg-slate-100 border-b border-slate-200 cursor-move flex items-center justify-center shrink-0 z-10 hover:bg-slate-200 transition-colors"
                        title="Drag to move freely"
                        onPointerDown={(e) => handlePointerDown(e, item.uniqueId)}
                      >
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                          <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                          <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveGridItem(item.uniqueId)}
                        className="absolute top-1 right-2 z-50 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Chart"
                      >
                        ✖
                      </button>
                      <div className="flex-1 w-full relative pt-2">
                        <WorksheetCell
                          contentId={item.contentId}
                          data={data}
                          transitPositions={transitPositions}
                          dashaSimDate={dashaSimDate}
                          planetEffects={planetEffects}
                          onSelectContent={(newCid) => {
                            setBlankSheetItems(items => items.map(i => i.uniqueId === item.uniqueId ? { ...i, contentId: newCid } : i));
                          }}
                          onPlanetClick={handlePlanetClick}
                          onFullScreen={() => { }}
                          isBlankSheet={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border-2 border-dashed border-slate-300">
                <span className="text-6xl mb-4">✨</span>
                <h2 className="text-2xl font-serif italic mb-2">Dashboard Builder</h2>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Select any chart from the menu below to add to grid</p>
              </div>
            )}

            {/* Size Selection Modal */}
            {pendingChartSelection && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-indigo-100">
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h3 className="text-xl font-serif font-black text-indigo-900">Select Grid Size</h3>
                    <button onClick={() => setPendingChartSelection(null)} className="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
                  </div>


                  <p className="text-sm text-slate-600 mb-4">Choose how much space this chart should occupy on your 4-column dashboard.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleAddGridItem('1x1')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-200 rounded"></div>
                      <span className="text-xs font-bold text-indigo-900">1x1 (Small)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('2x1')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-16 h-8 bg-indigo-200 rounded"></div>
                      <span className="text-xs font-bold text-indigo-900">2x1 (Wide)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('2x2')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-indigo-200 rounded"></div>
                      <span className="text-xs font-bold text-indigo-900">2x2 (Large Square)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('1x2')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-8 h-16 bg-indigo-200 rounded"></div>
                      <span className="text-xs font-bold text-indigo-900">1x2 (Tall)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('3x1')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-24 h-8 bg-indigo-200 rounded"></div>
                      <span className="text-xs font-bold text-indigo-900">3x1 (Extra Wide)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('4x1')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2">
                      <div className="w-full h-8 bg-indigo-200 rounded border border-indigo-300"></div>
                      <span className="text-xs font-bold text-indigo-900">4x1 (Full Width Banner)</span>
                    </button>
                    <button onClick={() => handleAddGridItem('4x2')} className="p-3 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 col-span-2">
                      <div className="w-full h-16 bg-indigo-200 rounded border border-indigo-300"></div>
                      <span className="text-xs font-bold text-indigo-900">4x2 (Full Width Huge)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-4 h-[400px] shrink-0">
              {/* User Profile Column */}
              <div className="w-[30%] bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner flex flex-col overflow-hidden shrink-0">
                <div className="bg-indigo-900 py-1.5 px-3">
                  <span className="text-[12px] font-black uppercase text-white tracking-widest">User Profile</span>
                </div>
                <div className="flex-1 p-3 flex flex-col gap-3.5 bg-gradient-to-b from-white to-indigo-50/30 overflow-y-auto custom-scrollbar">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-black uppercase text-black tracking-tighter">Full Name</p>
                    <p className="text-[14px] font-bold text-indigo-950 truncate leading-none">{profileInfo.name}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-black uppercase text-black tracking-tighter">Date of Birth</p>
                    <p className="text-[14px] font-bold text-slate-800 leading-none">{profileInfo.dob}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-black uppercase text-black tracking-tighter">Birth Location</p>
                    <p className="text-[14px] font-bold text-slate-800 leading-none truncate">{profileInfo.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="space-y-0.5 group relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[12px] font-black uppercase text-black tracking-tighter">Moon Sign</p>
                          <p className="text-[14px] font-bold text-blue-700 leading-none mt-0.5">{profileInfo.moonSign}</p>
                        </div>
                        <button
                          onClick={() => window.open('/?moonSign=true', '_blank')}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-blue-200 shadow-sm transition-colors"
                        >
                          Analyze
                        </button>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-black uppercase text-black tracking-tighter">Sun Sign</p>
                      <p className="text-[14px] font-bold text-red-600 leading-none">{profileInfo.sunSign}</p>
                    </div>
                  </div>
                  <div className="space-y-0.5 border-t border-indigo-100 pt-2">
                    <p className="text-[12px] font-black uppercase text-black tracking-tighter">Birth Nakshatra</p>
                    <p className="text-[14px] font-black text-emerald-700 leading-none uppercase tracking-tighter">{profileInfo.nakshatra}</p>
                  </div>
                  <div className="space-y-0.5 border-t border-indigo-100 pt-2 flex justify-between items-center">
                    <div>
                      <p className="text-[12px] font-black uppercase text-black tracking-tighter">Sade Sati Status</p>
                      {(() => {
                        const SIGNS_LIST = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                        const moonIdx = SIGNS_LIST.indexOf(profileInfo.moonSign);
                        const saturnPos = transitPositions?.["Saturn"];
                        if (moonIdx !== -1 && saturnPos) {
                          const saturnSignIdx = saturnPos.sidereal?.sign_index !== undefined ? saturnPos.sidereal.sign_index : Math.floor(saturnPos.sidereal.lon / 30);
                          const s12 = (moonIdx - 1 + 12) % 12;
                          const s1 = moonIdx;
                          const s2 = (moonIdx + 1) % 12;

                          let status = "Inactive";
                          let phase = "";
                          let color = "text-emeral-600";

                          if (saturnSignIdx === s12) { status = "Active"; phase = "Rising"; color = "text-amber-600"; }
                          else if (saturnSignIdx === s1) { status = "Active"; phase = "Peak"; color = "text-red-600"; }
                          else if (saturnSignIdx === s2) { status = "Active"; phase = "Setting"; color = "text-orange-600"; }

                          return (
                            <div className="flex flex-col">
                              <span className={`text-[13px] font-black ${color} leading-none`}>{status}</span>
                              {phase && <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">{phase} Phase</span>}
                            </div>
                          );
                        }
                        return <p className="text-[9px] font-bold text-slate-600 leading-none mt-0.5">Calculating...</p>;
                      })()}
                    </div>
                    <button
                      onClick={() => window.open('/?sadesati_report=true', '_blank')}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-indigo-200 shadow-sm transition-colors"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner overflow-hidden relative group">
                <div className="h-full flex flex-col overflow-auto custom-scrollbar">
                  <ZodiacChart planetPositions={data?.planet_positions} houses={data.charts?.houses} onPlanetClick={handlePlanetClick} variant="legacy" title="Main Birth Chart (D1)" defaultRect={true} planetEffects={planetEffects} scaleText={1.5} hideLegend={true} showFullscreenButton={true} onPopOut={() => handleMaximizeInNewWindow('d1')} />
                  <div className="px-4 pb-4">
                    <DynamicVargaAnalysis data={data} cid="d1" />
                    <DrishtiTable houses={data.charts?.houses} reportData={data} />
                    <HouseEffectTable data={data} planetEffects={planetEffects} />
                    <ConjunctionAnalysis houses={data.charts?.houses} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 h-[400px] shrink-0">
              <div className="w-[50%]  bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner overflow-hidden relative group flex flex-col">
                <div className="absolute top-2 left-2 z-20 px-3 py-1 bg-white/80 backdrop-blur rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-indigo-900">Alternative Vargas View</span>
                  <select
                    value={upperRightChart}
                    onChange={(e) => setUpperRightChart(e.target.value)}
                    className="bg-transparent text-[10px] font-bold border-none focus:ring-0 cursor-pointer text-black"
                  >
                    {CELL_CONTENTS.filter(c => c.id.startsWith('d') && c.id !== 'dignity').map(c => (
                      <option key={c.id} value={c.id} className="text-black">{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                  <button onClick={() => handleMaximizeInNewWindow(upperRightChart)} className="bg-gray-800/80 text-black rounded p-1 text-[10px] shadow hover:bg-black hover:text-white">⛶</button>
                </div>
                <div className="flex-1 flex flex-col pt-8 pb-2 px-2 overflow-hidden justify-center items-center h-full">
                  {(() => {
                    const vData = (upperRightChart === 'd1') ? data.charts : data.vargas?.[upperRightChart];

                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <ZodiacChart planetPositions={data?.planet_positions} houses={vData?.houses} onPlanetClick={handlePlanetClick} variant="legacy" defaultRect={true} planetEffects={planetEffects} scaleText={1.8} />
                      </div>
                    );
                  })()}
                </div>
                <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                  <button
                    onClick={() => handleMaximizeInNewWindow(upperRightChart)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Full Screen View</span>
                    <span className="text-xs font-bold text-black">⛶</span>
                  </button>
                </div>
              </div>
              {/* Vimshottari / Right Cell */}
              <div className="w-[50%] flex flex-col shrink-0">
                <WorksheetCell
                  contentId={rightCell}
                  data={data}
                  transitPositions={transitPositions}
                  dashaSimDate={dashaSimDate}
                  planetEffects={planetEffects}
                  onSelectContent={setRightCell}
                  onPlanetClick={handlePlanetClick}
                  onFullScreen={handleMaximizeInNewWindow}
                />
              </div>
            </div>
            <div className={`grid gap-2 h-[400px] shrink-0 ${lowerCells.length === 3 ? 'grid-cols-3' : lowerCells.length === 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
              {lowerCells.map((cid, idx) => (
                <WorksheetCell
                  key={idx}
                  contentId={cid}
                  data={data}
                  transitPositions={transitPositions}
                  dashaSimDate={dashaSimDate}
                  planetEffects={planetEffects}
                  onSelectContent={(newCid) => {
                    const newCells = [...lowerCells];
                    newCells[idx] = newCid;
                    setLowerCells(newCells);
                  }}
                  onPlanetClick={handlePlanetClick}
                  onFullScreen={handleMaximizeInNewWindow}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- UNIFIED CONTROL DASHBOARD (BOTTOM) --- */}
      <div className="bg-slate-100 shrink-0 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] border-t border-slate-700 flex flex-col z-50">

        {isAdmin && (
          <>
            {/* Row 1: Astro Charts */}
            <div className="px-4 py-2 border-b border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-200/50 p-1 rounded-md transition-colors w-full" onClick={() => setShowAstroCharts(!showAstroCharts)}>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{t('astro_charts')}</span>
                <span className="text-[9px] font-bold text-slate-500 ml-auto">{showAstroCharts ? `▼ ${t('hide')}` : `▶ ${t('show')}`}</span>
              </div>
              {showAstroCharts && (
                <div className="flex flex-wrap items-center gap-3 pt-1 pb-2">
                  <button onClick={() => window.open('/?annual_varshaphala=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">☀️</span> {t('annual_vrasphal')}
                  </button>
                  <button onClick={() => window.open('/?classic_layout=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🏛️</span> {t('classic_view')}
                  </button>
                  <button onClick={() => window.open('/?classic_layout_2=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🖥️</span> {t('classic_view_2')}
                  </button>
                  <button onClick={() => window.open('/?classic_layout_3=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📊</span> {t('classic_view_3')}
                  </button>
                  <button onClick={() => window.open('/?classic_layout_4=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🔮</span> {t('classic_view_4')}
                  </button>
                  <button onClick={() => window.open('/?chart_view_1=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📐</span> {t('chart_view_1')}
                  </button>
                  <button onClick={() => window.open('/?chart_view_2=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📐</span> {t('chart_view_2')}
                  </button>
                  <button onClick={() => window.open('/?chart_view_3=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📐</span> {t('chart_view_3')}
                  </button>
                  <button onClick={() => window.open('/?lordships=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">👑</span> {t('lordship')}
                  </button>
                  <button onClick={() => window.open('/?varga_sign_chart=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📊</span> {t('varga_sign_chart')}
                  </button>
                  <button onClick={() => window.open('/?bala_strengths=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">💪</span> {t('bala_strengths')}
                  </button>
                  <button onClick={() => window.open('/?bhavbala=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">📈</span> {t('bhavbala')}
                  </button>
                  <button onClick={() => window.open('/?gochara_wheel=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🎡</span> {t('gochara_wheel')}
                  </button>
                  <button onClick={() => window.open('/?gochara_wheel_1=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🎡</span> {t('gochara_wheel_1')}
                  </button>
                  <button onClick={() => window.open('/?nakshatra_dasha=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🌟</span> {t('nakshatra_dasha')}
                  </button>
                  <button onClick={() => window.open('/?rashi_dashas=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">♈</span> {t('rashi_dashas')}
                  </button>
                  <button onClick={() => window.open('/?lagnas=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🔺</span> {t('lagnas')}
                  </button>
                  <button onClick={() => window.open('/?jaimini_karakas=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">✨</span> {t('jaimini_karakas')}
                  </button>
                  <button onClick={() => window.open('/?sbc=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">☸️</span> {t('sarvatobhadra_chakra')}
                  </button>
                  <button onClick={() => window.open('/?sbc_dashboard=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🚀</span> {t('sarvatobhadra_dashboard')}
                  </button>
                  <button onClick={() => {
                    localStorage.setItem('worksheetData', JSON.stringify(data));
                    window.open('/?worksheet=true&fullScreen=bhrigu_bindu', '_blank', 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no');
                  }} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🌟</span> {t('bhrigu_bindu')}
                  </button>
                  <button onClick={() => window.open('/?d108=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🔮</span> {t('d108')}
                  </button>
                  <button onClick={() => window.open('/?ayanamsha=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">⚙️</span> {t('ayanamsha')}
                  </button>
                  <button onClick={() => window.open('/?sanghatta=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🔥</span> {t('sanghatta')}
                  </button>
                  <button onClick={() => window.open('/?karaka=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🧘</span> {t('karakas')}
                  </button>
                  <button onClick={() => window.open('/?tithi=true', '_blank')} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🌙</span> {t('tithi_pravesha')}
                  </button>
                  <button onClick={() => {
                    localStorage.setItem('worksheetData', JSON.stringify(data));
                    window.open('/?kota_chakra=true', '_blank');
                  }} className="shrink-0 bg-indigo-900 hover:bg-orange-400 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-indigo-700">
                    <span className="text-base leading-none">🏰</span> Kota Chakra
                  </button>
                </div>

              )}

            </div>
            {/* Row 2: External Apps Popouts */}
            <div className="px-4 py-2 border-b border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-200/50 p-1 rounded-md transition-colors w-full" onClick={() => setShowExternalApps(!showExternalApps)}>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{t('external_apps_popouts')}</span>
                <span className="text-[9px] font-bold text-slate-500 ml-auto">{showExternalApps ? `▼ ${t('hide')}` : `▶ ${t('show')}`}</span>
              </div>
              {showExternalApps && (


                <div className="flex flex-wrap items-center gap-3 pt-1 pb-2">
                  <button onClick={() => window.open('/?transit_compare=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-sky-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🔄</span> {t('compare_transit')}
                  </button>
                  <button onClick={() => window.open('/?transit_compare2=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-sky-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🔄</span> {t('compare_transit_2')}
                  </button>
                  <button onClick={() => window.open('/?solar_return=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">☀️</span> {t('solar_return')}
                  </button>
                  <button onClick={() => window.open('/?daily_solar=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-yellow-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🌞</span> {t('daily_solar')}
                  </button>
                  <button onClick={() => window.open('/?annual_varshaphala=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🌍</span> {t('annual_varshaphala')}
                  </button>
                  <button onClick={() => window.open('/?varshaphala_details=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-amber-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">📜</span> {t('varshaphala_detail')}
                  </button>
                  <button onClick={() => window.open('/?detailed_charts=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">📊</span> {t('varshaphala_detailed_charts')}
                  </button>
                  <button onClick={() => window.open('/?advanced_nakshatra=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🌌</span> {t('adv_nakshatra')}
                  </button>
                  <button onClick={() => window.open('/?animated_transits=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-pink-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🔄</span> {t('animated_transits')}
                  </button>
                  <button onClick={() => window.open('/?navamsha_ages=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🔢</span> {t('navamsha_ages')}
                  </button>
                  <button onClick={() => window.open('/?kp_chart=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🔮</span> {t('kp_chart')}
                  </button>
                  <button onClick={() => window.open('/?sunrise_chart=true', '_blank')} className="shrink-0 bg-slate-200 hover:bg-slate-700 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-slate-700">
                    <span className="text-base leading-none">🌅</span> {t('sunrise_chart')}
                  </button>
                  <button onClick={handleOpenMatchmaking} className="shrink-0 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-rose-500/30">
                    <span className="text-base leading-none">💏</span> {t('match_making')}
                  </button>
                  <button onClick={handleOpenBiodata} className="shrink-0 bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-amber-500/30">
                    <span className="text-base leading-none">📜</span> Bio Data
                  </button>
                </div>
              )}
              {/* Row 2: Oracle & In-page Tools */}
              <div className="px-4 py-2 flex flex-col gap-2">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-200/50 p-1 rounded-md transition-colors w-full" onClick={() => setShowOracleTools(!showOracleTools)}>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{t('oracle_in_page_tools')}</span>
                  <span className="text-[9px] font-bold text-slate-500 ml-auto">{showOracleTools ? `▼ ${t('hide')}` : `▶ ${t('show')}`}</span>
                </div>
                {showOracleTools && (
                  <div className="flex flex-wrap items-center gap-4 pt-1 pb-2">
                    {oracle_items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleOracleClick(item.id)}
                        className="flex items-center gap-2 group transition-all shrink-0 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50 hover:border-slate-500"
                        title={item.label}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform filter drop-shadow-md">{item.icon}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white">{item.label}</span>
                      </button>
                    ))}


                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {selectedPlanet && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-[#1a237e] text-white">
                <h4 className="text-lg font-serif italic">{selectedPlanet.name} {t('details')}</h4>
                <button onClick={() => setSelectedPlanet(null)} className="text-black hover:text-white text-2xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-3 font-serif">
                <div className="flex justify-between border-b pb-1"><span>{t('house_placement')}</span> <b>{selectedPlanet.house}</b></div>
                <div className="flex justify-between border-b pb-1"><span>{t('zodiac_sign')}</span> <b>{selectedPlanet.sign}</b></div>
                <div className="flex justify-between border-b pb-1"><span>{t('precise_degree')}</span> <b>{selectedPlanet.degree?.toFixed(4)}°</b></div>
                <div className="flex justify-between border-b pb-1"><span>{t('nakshatra_label')}</span> <b>{selectedPlanet.nakshatra}</b></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveWorksheet;




