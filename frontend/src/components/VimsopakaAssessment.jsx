import React from 'react';

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_INFO = {
  "Sun": { header: "Sun (सू)", icon: "☀️" },
  "Moon": { header: "Moon (चं)", icon: "🌙" },
  "Mars": { header: "Mars (मं)", icon: "♂️" },
  "Mercury": { header: "Mercury (बु)", icon: "☿" },
  "Jupiter": { header: "Jupiter (गु)", icon: "♃" },
  "Venus": { header: "Venus (शु)", icon: "♀️" },
  "Saturn": { header: "Saturn (शा)", icon: "♄" },
  "Rahu": { header: "Rahu (रा)", icon: "☊" },
  "Ketu": { header: "Ketu (के)", icon: "☋" }
};

const VARGA_COLUMNS = [
  { key: "shadvarga", label: "Shadvarga" },
  { key: "saptavarga", label: "Saptavarga" },
  { key: "dasavarga", label: "Dashavarga" },
  { key: "shodashvarga", label: "Shodashavarga" }
];

const VimsopakaAssessment = ({ data }) => {
  const assessment = data?.vimsopaka_assessment || {};
  const vb = assessment.vimsopaka_bala || {};
  const classification = assessment.classification || {};
  const wealthCareer = assessment.wealth_career || {};
  const mental = assessment.mental_pattern || {};
  const relation = assessment.relationship || {};
  const remedies = assessment.remedies || [];
  const summary = assessment.summary || {};

  const getStatusColor = (status) => {
    switch (status) {
      case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Good": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Average": return "text-slate-600 bg-slate-50 border-slate-100";
      case "Inauspicious": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-full flex flex-col font-sans">
      <div className="bg-slate-900 p-6 text-white shrink-0 flex justify-between items-end">
          <div>
              <h2 className="text-xl font-serif italic tracking-widest uppercase">Vimsopaka Bala Assessment</h2>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-1">Professional 20-Point Strength Report</p>
          </div>
          <div className="text-right">
              <span className="text-[9px] font-black uppercase text-slate-500 block">Calculation Basis</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Lahiri Ayanamsa</span>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Step 5: Professional Scores Table (Flipped View) */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-4 h-px bg-slate-200"></span> 01. Varga Strength Matrix
          </h3>
          <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-left text-[12px] text-slate-800">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-tighter">Planet</th>
                  {VARGA_COLUMNS.map(col => (
                    <th key={col.key} className="py-3 px-4 font-bold text-slate-700 text-center">
                      {col.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 font-bold text-indigo-600 uppercase text-center tracking-widest">Strength</th>
                </tr>
              </thead>
              <tbody>
                {PLANETS.map((p) => {
                  // Determine final strength from Dashavarga (primary standard) or overall summary
                  const finalStatus = classification.dasavarga?.[p] || classification.shadvarga?.[p] || "Average";
                  
                  return (
                    <tr key={p} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{PLANET_INFO[p].icon}</span>
                          <div>
                            <div className="font-bold text-slate-900">{PLANET_INFO[p].header}</div>
                            <div className="text-slate-400 text-[9px] font-bold">Vimsopaka Path</div>
                          </div>
                        </div>
                      </td>
                      {VARGA_COLUMNS.map(col => {
                        const score = vb[col.key]?.[p] || 0;
                        return (
                          <td key={col.key} className="py-3 px-4 text-center">
                            <div className="font-mono font-bold text-base text-slate-700">{score}</div>
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border inline-block ${getStatusColor(finalStatus)}`}>
                          {finalStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Life Area Engines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Wealth & Career Engine</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Wealth Potential</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusColor(wealthCareer.wealth_status)}`}>
                    {wealthCareer.wealth_status} ({wealthCareer.wealth_score})
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Career Strength</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusColor(wealthCareer.career_status)}`}>
                    {wealthCareer.career_status} ({wealthCareer.career_score})
                  </span>
               </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Psyche & Social Engine</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Mental Pattern</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusColor(mental.status)}`}>
                    {mental.status} ({mental.score})
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Relationship Quality</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusColor(relation.status)}`}>
                    {relation.status} ({relation.score})
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Step 7: Detailed Diagnostics */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-4 h-px bg-slate-200"></span> 02. Planetary Diagnostics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANETS.map(p => {
              const interpretation = assessment.interpretations?.[p] || {};
              const status = interpretation.strength || "Average";
              return (
                <div key={p} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-slate-900">{PLANET_INFO[p].header}</div>
                    <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${getStatusColor(status)}`}>
                      {status}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                    House {interpretation.house} • Score: {interpretation.vimsopaka_score}
                  </div>
                  <p className="text-[12px] leading-relaxed text-slate-600 italic">
                    "{interpretation.effect}"
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 11: Weak Planet Remedies */}
        {remedies.length > 0 && (
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-slate-200"></span> 03. Weak Planet Remedies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {remedies.map((rem, i) => (
                <div key={i} className="p-4 rounded-2xl border border-red-50 bg-red-50/30 flex flex-col">
                   <div className="font-black text-red-800 text-xs uppercase mb-1">{rem.planet} Remedy</div>
                   <div className="text-sm font-serif italic text-slate-800 mb-2">"{rem.remedy}"</div>
                   <div className="mt-auto text-[9px] font-bold text-red-600 uppercase tracking-tighter">Benefit: {rem.benefit}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step 12: Final Summary & Ratna Suggestion */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
           
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-6">Final Summary Engine</h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Strongest Pillars</div>
                <div className="text-lg font-serif italic">{summary.strongest_planets?.join(", ")}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Wealth Stability</div>
                <div className="text-lg font-serif italic">{summary.wealth_potential}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Career Path</div>
                <div className="text-lg font-serif italic">{summary.career_potential}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Relationships</div>
                <div className="text-lg font-serif italic">{summary.relationship_pattern}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Mental Health</div>
                <div className="text-lg font-serif italic">{summary.mental_stability}</div>
              </div>
           </div>

           {summary.top_gemstone && (
             <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                   <div className="w-8 h-8 border-2 border-white/30 rotate-45 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/50 rounded-full"></div>
                   </div>
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Professional Ratna Suggestion</div>
                   <div className="text-xl font-serif italic text-white mb-1">
                      {summary.top_gemstone.stone} ({summary.top_gemstone.planet})
                   </div>
                   <div className="text-[11px] text-slate-400 leading-relaxed">
                      {summary.top_gemstone.reason} (Vimsopaka Strength: {summary.top_gemstone.score}/20)
                   </div>
                </div>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default VimsopakaAssessment;
