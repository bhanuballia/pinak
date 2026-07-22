import React, { useState, useEffect } from "react";
import { BulletInterpretation } from "./WorksheetUtils";

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
                    <span>🟢</span> The Good
                  </h5>
                  <ul className="space-y-2 pl-4">
                    {parsed.good.map((item, idx) => (
                      <li key={idx} className="text-base text-slate-700 leading-relaxed font-serif flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>
                          <span className="font-bold text-slate-900">{item.label}:</span> <span className='text-[14px] text-slate-900'>{item.text}</span>
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
                    <span>🔴</span> The Bad
                  </h5>
                  <ul className="space-y-2 pl-4">
                    {parsed.bad.map((item, idx) => (
                      <li key={idx} className="text-base text-slate-700 leading-relaxed font-serif flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span>
                          <span className="font-bold text-slate-900">{item.label}:</span> <span className="font-serif text-[14px] text-slate-900">{item.text}</span>
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

export default ConjunctionAnalysis;
