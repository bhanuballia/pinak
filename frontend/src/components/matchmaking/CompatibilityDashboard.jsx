import React from 'react';
import ZodiacChart from '../ZodiacChart';

const CompatibilityDashboard = ({ bride, groom, brideFullData, groomFullData, report }) => {
  if (!report) return <div className="p-8 text-slate-500 font-serif italic text-center">Awaiting birth data for final compatibility synthesis...</div>;

  // Defensive destructuring with fallbacks
  const guna_milan = report.guna_milan || { total_score: 0, interpretation: "N/A", scores: {} };
  const manglik = report.manglik || { bride: {}, groom: {}, analysis: {} };
  const success_probability = report.success_probability ?? 0;
  const summary = report.summary || { recommendation: "Analysis Pending" };
  const navamsa = report.navamsa || { spiritual_bond: "N/A", long_term_prospect: "N/A", description: "" };
  const risk = report.risk_analysis || { divorce: { risk_level: "Low", risk_score: 0 }, toxic_warnings: [] };
  const timing = report.timing || { favorable_years: [] };
  const remedies = report.remedies || [];
  const ai = report.ai_narrative || { summary: "", strengths: [], weaknesses: [] };

  const gunaTotal = guna_milan.total_score || 0;

  const getStatusColor = (status) => {
    if (status.includes("Excellent")) return "text-emerald-600";
    if (status.includes("Very Good")) return "text-emerald-500";
    if (status.includes("Acceptable")) return "text-amber-500";
    if (status.includes("Not Compatible")) return "text-rose-500";
    return "text-slate-500";
  };

  const KOOTA_DESCRIPTIONS = {
    "Varna": "Represents spiritual compatibility. It exhibits the ego level and personalities. Matching ensures mutual love and comfort.",
    "Vashya": "Measures mutual attraction and influence. It calculates the power equation between the two partners.",
    "Tara": "Indicates wellbeing and longevity. Ensures the couple remains disease-free and enjoys a happy conjugal life.",
    "Yoni": "Measures intimacy levels and sexual compatibility. Matches the sensuous nature and characteristics of both.",
    "Graha Maitri": "Reflects mental compatibility and natural friendship. Denotes how inimical or friendly the partners are.",
    "Gana": "Indicates mutual behaviors and temperaments. A vital factor impacting overall compatibility levels.",
    "Bhakoot": "Represents emotional compatibility. Shows relative influence and capability of mutual understanding.",
    "Nadi": "Measures Vata, Pitta, and Kapha levels. Impacts progeny, child-birth, and general health metabolism."
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-12 font-sans pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Step 1: Royal Header */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="text-center md:text-left flex-1">
             <h1 className="text-5xl font-serif italic tracking-tight text-slate-900 mb-3">Divine Compatibility</h1>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full inline-block">ULTRA PRO Engine Synthesis</p>
          </div>
          
          <div className="flex items-center gap-16 shrink-0">
             <div className="text-center group">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-indigo-100">👰</div>
                <div className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{bride || 'Bride'}</div>
             </div>
             <div className="text-5xl font-serif italic text-slate-200">vs</div>
             <div className="text-center group">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-indigo-100">🤵</div>
                <div className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{groom || 'Groom'}</div>
             </div>
          </div>
        </div>

        {/* Step 2: AI Narrative Summary */}
        <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300 mb-6">AI Master Synthesis</h3>
                 <p className="text-3xl md:text-4xl font-serif italic leading-tight text-indigo-50 mb-8">"{ai.summary || summary.recommendation}"</p>
                 <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                       <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Success Probability</div>
                       <div className="text-2xl font-bold">{Math.round(success_probability)}%</div>
                    </div>
                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                       <div className="text-[9px] font-black uppercase text-indigo-300 mb-1">Guna Score</div>
                       <div className="text-2xl font-bold">{gunaTotal}/36</div>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                    <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-widest">Core Strengths</h4>
                    <ul className="space-y-3">
                       {ai.strengths.map((s, i) => <li key={i} className="text-sm flex gap-2"><span className="text-emerald-400">✓</span> {s}</li>)}
                    </ul>
                 </div>
                 <div className="bg-rose-500/10 p-6 rounded-3xl border border-rose-500/20">
                    <h4 className="text-[10px] font-black uppercase text-rose-400 mb-4 tracking-widest">Primary Challenges</h4>
                    <ul className="space-y-3">
                       {ai.weaknesses.map((w, i) => <li key={i} className="text-sm flex gap-2"><span className="text-rose-400">!</span> {w}</li>)}
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* Step 3: Celestial Map Synchronization (Lagna Charts) */}
        <section className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100">
           <div className="text-center mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-2">Destiny Blueprint Visualization</h3>
              <h2 className="text-3xl font-serif italic text-slate-800">Lagna Chart Synchronization</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Bride Chart Column */}
              <div className="space-y-6">
                 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 text-center">Bride's Birth Profile</div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Full Name</div>
                          <div className="text-sm font-serif italic text-slate-800">{brideFullData?.title} {brideFullData?.name}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Birth Date</div>
                          <div className="text-sm font-bold text-slate-700">{brideFullData?.birth_date}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Birth Time</div>
                          <div className="text-sm font-bold text-slate-700">{brideFullData?.birth_time}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Location</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate" title={brideFullData?.location_name}>{brideFullData?.location_name}</div>
                       </div>
                    </div>
                 </div>
                 <div className="aspect-square bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner">
                    <ZodiacChart houses={report.bride_chart?.houses} title={`${bride}'s Lagna`} variant="modern" />
                 </div>
              </div>
              
              {/* Groom Chart Column */}
              <div className="space-y-6">
                 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 text-center">Groom's Birth Profile</div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Full Name</div>
                          <div className="text-sm font-serif italic text-slate-800">{groomFullData?.title} {groomFullData?.name}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Birth Date</div>
                          <div className="text-sm font-bold text-slate-700">{groomFullData?.birth_date}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Birth Time</div>
                          <div className="text-sm font-bold text-slate-700">{groomFullData?.birth_time}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Location</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate" title={groomFullData?.location_name}>{groomFullData?.location_name}</div>
                       </div>
                    </div>
                 </div>
                 <div className="aspect-square bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner">
                    <ZodiacChart houses={report.groom_chart?.houses} title={`${groom}'s Lagna`} variant="modern" />
                 </div>
              </div>
           </div>
        </section>

        {/* Step 4: Ashta Koota Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100">
              <div className="flex justify-between items-end mb-10">
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ashta Koota Scoring</h3>
                    <div className={`text-4xl font-serif italic ${getStatusColor(guna_milan.interpretation)}`}>
                       {gunaTotal} <span className="text-sm text-slate-300 font-sans not-italic">/ 36 Gunas</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</div>
                    <div className={`text-xl font-bold uppercase tracking-widest ${getStatusColor(guna_milan.interpretation)}`}>{guna_milan.interpretation}</div>
                 </div>
              </div>
              {/* Professional Ashta Koota Matrix Table */}
              <div className="overflow-x-auto mt-8">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b-2 border-amber-100 bg-amber-50/20">
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800">Guna</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800">Boy</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800">Girl</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800 text-center">Maximum Obtained</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800 text-center">Obtained Point</th>
                          <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-amber-800">Area Of Life</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                          { name: "Varna", max: 1 },
                          { name: "Vashya", max: 2 },
                          { name: "Tara", max: 3 },
                          { name: "Yoni", max: 4 },
                          { name: "Graha Maitri", max: 5 },
                          { name: "Gana", max: 6 },
                          { name: "Bhakoot", max: 7 },
                          { name: "Nadi", max: 8 }
                       ].map((koota) => {
                          const score = guna_milan.scores?.[koota.name] || 0;
                          const detail = guna_milan.details?.[koota.name] || {};
                          return (
                             <tr key={koota.name} className="hover:bg-slate-50 transition-colors">
                                <td className="py-5 px-4 text-sm font-bold text-red-500 font-serif italic">{koota.name}</td>
                                <td className="py-5 px-4 text-sm text-slate-700 font-medium">{detail.boy || "—"}</td>
                                <td className="py-5 px-4 text-sm text-slate-700 font-medium">{detail.girl || "—"}</td>
                                <td className="py-5 px-4 text-sm text-slate-400 font-mono text-center font-bold">{koota.max}</td>
                                <td className="py-5 px-4 text-lg font-black text-slate-900 text-center">{score}</td>
                                <td className="py-5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{detail.area}</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Planetary Afflictions Card */}
           <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100 flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Planetary Afflictions</h3>
              <div className="space-y-6 flex-1">
                 {risk.afflictions?.length > 0 ? (
                    risk.afflictions.map((a, i) => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                          <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">{a.title}</h4>
                             <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${a.impact === 'Severe' ? 'bg-rose-100 text-rose-600' : a.impact === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {a.impact} Impact
                             </span>
                          </div>
                          <p className="text-[10px] leading-relaxed text-slate-500">{a.description}</p>
                       </div>
                    ))
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                       <div className="text-4xl mb-2">✨</div>
                       <p className="text-[10px] font-black uppercase tracking-widest">No Major Afflictions</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Divorce Risk Diagnostic Card */}
           <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100 flex flex-col justify-between">
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Risk Diagnostic</h3>
                 <div className="text-center mb-8">
                    <div className="inline-block p-8 rounded-full bg-rose-50 text-rose-500 text-4xl mb-4 relative shadow-inner">
                       ⚖️
                       <div className="absolute inset-0 border-4 border-rose-200 border-t-rose-500 rounded-full animate-[spin_3s_linear_infinite]"></div>
                    </div>
                    <div className="text-3xl font-serif italic text-slate-900">{risk.divorce.risk_level} Risk</div>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Divorce & Separation Factor</p>
                 </div>
              </div>
              <div className="bg-rose-50/30 p-4 rounded-2xl border border-rose-100/50">
                 <p className="text-[10px] text-rose-600 font-medium leading-relaxed italic text-center">
                    "{risk.divorce.reasons?.[0] || 'Chart stability is within acceptable Vedic thresholds.'}"
                 </p>
              </div>
           </div>
        </div>

        {/* Knowledge Base Section */}
        <section className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 shadow-inner">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 text-center">Vedic Compatibility Encyclopedia</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Object.entries(KOOTA_DESCRIPTIONS).map(([name, desc]) => (
                 <div key={name} className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-indigo-600 tracking-widest">{name}</h4>
                    <p className="text-[11px] leading-relaxed text-slate-500">{desc}</p>
                 </div>
              ))}
           </div>
           
           <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Scoring Interpretation Scale</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                       <span className="font-bold text-emerald-700">33 to 36 Points</span>
                       <span className="uppercase font-black text-[10px] text-emerald-500">Excellent Match</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                       <span className="font-bold text-emerald-600">25 to 32 Points</span>
                       <span className="uppercase font-black text-[10px] text-emerald-500">Very Good Match</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-amber-50 rounded-xl border border-amber-100">
                       <span className="font-bold text-amber-700">18 to 24 Points</span>
                       <span className="uppercase font-black text-[10px] text-amber-500 text-right leading-tight max-w-[150px]">Acceptable; but need to consider other factors minutely</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-rose-50 rounded-xl border border-rose-100">
                       <span className="font-bold text-rose-700">Below 18 Points</span>
                       <span className="uppercase font-black text-[10px] text-rose-500">Not Compatible Match</span>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col justify-center bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
                 <h4 className="text-xl font-serif italic mb-4">A Note on Compatibility</h4>
                 <p className="text-xs leading-relaxed text-indigo-100 opacity-80">
                    While Ashta Koota is the primary metric for Vedic matching, a high score alone does not guarantee success. Our ULTRA PRO engine also considers Manglik Dosha, Navamsa Stability, and Planetary Afflictions to provide this synthesized Success Probability.
                 </p>
              </div>
           </div>
        </section>

        {/* Step 4: Timing & Stability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Timing Card */}
           <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Marriage Timing</h3>
              <div className="space-y-6">
                 {timing.favorable_years.map(year => (
                    <div key={year} className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                       <span className="text-lg font-bold text-indigo-900">{year}</span>
                       <span className="text-[9px] font-black uppercase text-indigo-500 bg-white px-3 py-1 rounded-full shadow-sm">High Probability</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Manglik Section */}
           <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Manglik Sync</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600 uppercase">Bride</span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${manglik.bride?.is_manglik ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{manglik.bride?.is_manglik ? 'Manglik' : 'Clear'}</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600 uppercase">Groom</span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${manglik.groom?.is_manglik ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{manglik.groom?.is_manglik ? 'Manglik' : 'Clear'}</span>
                 </div>
                 <p className="text-[11px] text-slate-500 italic mt-4 pt-4 border-t border-slate-100 text-center leading-relaxed">"{manglik.analysis?.reason}"</p>
              </div>
           </div>

           {/* Navamsa D9 Section */}
           <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Spiritual Stability (D9)</h3>
              <div className="flex items-center gap-6 mb-8">
                 <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🧘</div>
                 <div>
                    <div className="text-lg font-bold text-slate-800">{navamsa.spiritual_bond} Bond</div>
                    <div className="text-[10px] font-black uppercase text-purple-600">{navamsa.long_term_prospect} Prospect</div>
                 </div>
              </div>
              <p className="text-[12px] text-slate-600 italic leading-relaxed">"{navamsa.description}"</p>
           </div>
        </div>

        {/* Step 5: Professional Remedies Panel */}
        <section className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-full bg-slate-50/50 -skew-x-12"></div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-10 text-center">Destiny Balancing Protocol</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {remedies.map((r, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group hover:shadow-md">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                       {r.type === "Gemstone" ? "💎" : r.type === "Mantra" ? "📿" : "🔥"}
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{r.type}</h4>
                    <h5 className="text-xl font-serif italic text-slate-800 mb-3">{r.title}</h5>
                    <p className="text-[13px] leading-relaxed text-slate-500">{r.description}</p>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default CompatibilityDashboard;
