import React from "react";

export const PLANET_COLORS = {
  "Sun": "#ef4444", "Moon": "#475569", "Mars": "#dc2626", "Mercury": "#16a34a",
  "Jupiter": "#d97706", "Venus": "#db2777", "Saturn": "#4338ca", "Rahu": "#0d9488",
  "Ketu": "#92400e", "Ascendant": "#000000"
};

export const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const BulletInterpretation = ({ text, colorClass = "text-slate-600" }) => {
  if (!text) return null;
  const points = text.split(/(?<=\.)\s+|\n+/).filter(p => p.trim());
  return (
    <ul className="space-y-3 relative z-10">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 items-start group/point">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colorClass.replace('text-', 'bg-')} opacity-40 group-hover/point:opacity-100 transition-opacity`}></span>
          <span className={`text-md leading-relaxed ${colorClass} font-serif`}>{point.trim()}</span>
        </li>
      ))}
    </ul>
  );
};

export const calculatePlanetEffects = (data) => {
  const strengths = data?.strength?.planets || {};
  const effects = {};
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  planets.forEach(p => {
    const s = strengths[p];
    if (s) {
      const ishta = s.ishta_phala || 0;
      const kashta = s.kashta_phala || 0;
      if (ishta > kashta + 3) {
        effects[p] = "positive";
      } else if (kashta > ishta + 3) {
        effects[p] = "negative";
      } else {
        effects[p] = "neutral";
      }
    } else {
      const malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];
      effects[p] = malefics.includes(p) ? "negative" : "positive";
    }
  });
  effects["Ascendant"] = "neutral";
  return effects;
};

export const PLANET_DIGNITY = {
  Sun:     { exaltation: ['Aries'], debilitation: ['Libra'], own: ['Leo'], friendly: ['Aries','Sagittarius','Cancer','Scorpio','Pisces'], enemy: ['Aquarius','Capricorn','Libra','Virgo'] },
  Moon:    { exaltation: ['Taurus'], debilitation: ['Scorpio'], own: ['Cancer'], friendly: ['Aries','Leo','Sagittarius','Gemini','Libra','Aquarius'], enemy: [] },
  Mars:    { exaltation: ['Capricorn'], debilitation: ['Cancer'], own: ['Aries','Scorpio'], friendly: ['Leo','Sagittarius','Pisces'], enemy: ['Gemini','Virgo'] },
  Mercury: { exaltation: ['Virgo'], debilitation: ['Pisces'], own: ['Gemini','Virgo'], friendly: ['Aries','Taurus','Libra','Capricorn'], enemy: ['Cancer','Scorpio'] },
  Jupiter: { exaltation: ['Cancer'], debilitation: ['Capricorn'], own: ['Sagittarius','Pisces'], friendly: ['Aries','Leo','Scorpio'], enemy: ['Gemini','Virgo','Libra','Capricorn'] },
  Venus:   { exaltation: ['Pisces'], debilitation: ['Virgo'], own: ['Taurus','Libra'], friendly: ['Gemini','Virgo','Capricorn','Aquarius'], enemy: ['Aries','Scorpio','Cancer','Leo'] },
  Saturn:  { exaltation: ['Libra'], debilitation: ['Aries'], own: ['Capricorn','Aquarius'], friendly: ['Gemini','Virgo','Taurus','Libra'], enemy: ['Aries','Cancer','Leo','Scorpio'] },
  Rahu:    { exaltation: ['Gemini'], debilitation: ['Sagittarius'], own: ['Gemini'], friendly: ['Libra','Taurus','Virgo','Capricorn','Pisces','Aries','Aquarius'], enemy: ['Leo','Cancer'] },
  Ketu:    { exaltation: ['Sagittarius'], debilitation: ['Gemini'], own: ['Scorpio'], friendly: ['Libra','Taurus','Virgo','Capricorn','Pisces','Aries','Aquarius'], enemy: ['Leo','Cancer'] },
};

export const getDignityStatus = (planet, signName) => {
  const d = PLANET_DIGNITY[planet];
  if (!d) return null;
  if (d.exaltation.includes(signName)) return { label: 'Exalted ★', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
  if (d.debilitation.includes(signName)) return { label: 'Debilitated ↓', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (d.own.includes(signName)) return { label: 'Own Sign ◆', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  if (d.friendly.includes(signName)) return { label: 'Friendly ♥', bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' };
  if (d.enemy.includes(signName)) return { label: 'Enemy ✕', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  return null;
};
