import React, { useState, useEffect } from "react";
import { BulletInterpretation } from "./WorksheetUtils";

const ConjunctionAnalysis = ({ houses }) => {
  const [conjunctions, setConjunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTextFromDetail = (detail) => {
    if (detail.description) return detail.description;
    if (detail.interpretation) return detail.interpretation;
    if (detail.results) return detail.results;

    if (detail.effects && typeof detail.effects === "object") {
      return Object.entries(detail.effects)
        .map(([key, points]) => {
          const title = key.replace(/([A-Z])/g, " $1").toUpperCase();
          const content = Array.isArray(points) ? points.join(". ") : points;
          return `${title}: ${content}`;
        })
        .join("\n\n");
    }

    return "Detailed diagnostic insights are available for this planetary alignment.";
  };

  useEffect(() => {
    if (!houses) return;

    const detected = [];
    Object.keys(houses).forEach(houseNum => {
      const houseData = houses[houseNum];
      const planets = houseData.planets || [];
      const cleanPlanets = planets.map(p => typeof p === "object" ? p.name : p)
        .filter(p => p !== "Ascendant" && p !== "L");

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

      {conjunctions.map((conj, idx) => (
        <section key={idx} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl shadow-md border border-white/10">✨</div>
            <div>
              <h4 className="text-lg font-black text-slate-700 uppercase tracking-tight leading-none">{conj.planets.join(" + ")}</h4>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">House {conj.house} Resonance</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/item">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black text-indigo-900">{conj.house}</div>
            <BulletInterpretation
              text={getTextFromDetail(conj.detail)}
              colorClass="text-slate-700"
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default ConjunctionAnalysis;
