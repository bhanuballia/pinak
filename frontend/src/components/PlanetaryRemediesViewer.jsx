import React, { useState } from 'react';
import { PLANETARY_EFFECTS } from '../data/planetaryEffects';

export default function PlanetaryRemediesViewer({ planet, initialNature = 'benefic' }) {
  const [nature, setNature] = useState(initialNature); // 'benefic', 'malefic', 'neutral'
  
  const planetData = PLANETARY_EFFECTS[planet];

  if (!planetData) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center text-gray-500 italic">
        Data not available for {planet}
      </div>
    );
  }

  const data = planetData[nature];

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden font-serif">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white text-center">
        <h3 className="text-2xl font-black uppercase tracking-widest">
          {planetData.hindiName} ({planet})
        </h3>
        <p className="text-xs text-indigo-300 tracking-[0.2em] uppercase mt-1">Planetary Influence & Remedies</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setNature('benefic')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
            nature === 'benefic' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          शुभ (Benefic)
        </button>
        <button
          onClick={() => setNature('malefic')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
            nature === 'malefic' ? 'bg-red-50 text-red-700 border-b-2 border-red-500' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          अशुभ (Malefic)
        </button>
        <button
          onClick={() => setNature('neutral')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
            nature === 'neutral' ? 'bg-gray-100 text-gray-700 border-b-2 border-gray-500' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          सम (Neutral)
        </button>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest mb-3 ${
            nature === 'benefic' ? 'text-green-700' : nature === 'malefic' ? 'text-red-700' : 'text-gray-700'
          }`}>
            प्रभाव (Effects)
          </h4>
          <p className="text-slate-700 leading-relaxed text-lg">
            {data.effect}
          </p>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-800 mb-4">
            <span className="text-xl">🌿</span>
            उपाय (Remedies)
          </h4>
          <ul className="space-y-3">
            {data.remedies.map((rem, idx) => (
              <li key={idx} className="flex items-start gap-3 text-amber-900">
                <span className="text-amber-500 mt-1">✦</span>
                <span className="text-base leading-relaxed">{rem}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
