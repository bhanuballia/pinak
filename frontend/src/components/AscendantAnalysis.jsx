import React, { useState, useEffect } from 'react';
import { ASCENDANT_INTERPRETATIONS, ASCENDANT_PLANETS_1ST_HOUSE, ASCENDANT_INTRO } from '../data/ascendantData';

export default function AscendantAnalysis() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-indigo-600">Loading Ascendant Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-400">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const ascendantSign = houses[1]?.sign_name || "Aries";
    const interpretation = ASCENDANT_INTERPRETATIONS[ascendantSign] || ASCENDANT_INTERPRETATIONS["Aries"];
    const planetsInFirst = houses[1]?.planets?.map(p => typeof p === 'object' ? p.name : p).filter(p => p !== 'Ascendant' && p !== 'L') || [];

    return (
        <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-serif p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4 border-b border-stone-200 pb-16 relative">
                    <div className="text-8xl mb-6 animate-bounce-slow">{interpretation.emoji}</div>
                    <h1 className="text-6xl font-black text-[#44403c] italic tracking-tighter uppercase">
                        The {ascendantSign} Ascendant
                    </h1>
                    <p className="text-stone-500 uppercase tracking-[0.5em] text-sm font-black">
                        Identity • Vitality • Life Path • Soul Purpose
                    </p>
                    <div className="max-w-3xl mx-auto mt-6 p-6 bg-stone-50 rounded-3xl border border-stone-100 text-stone-500 text-[11px] leading-relaxed italic text-center">
                        <span className="block font-black uppercase tracking-widest text-[9px] text-stone-400 mb-2">Technical Insight</span>
                        {ASCENDANT_INTRO}
                    </div>
                    <div className="max-w-2xl mx-auto mt-6 text-stone-500 text-sm leading-relaxed italic">
                        {interpretation.description}
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <span className="px-6 py-2 bg-stone-100 rounded-full text-xs font-black uppercase tracking-widest text-stone-600 border border-stone-200">
                            Element: {interpretation.element}
                        </span>
                        <span className="px-6 py-2 bg-stone-100 rounded-full text-xs font-black uppercase tracking-widest text-stone-600 border border-stone-200">
                            Ruling Planet: {interpretation.ruler}
                        </span>
                        {interpretation.ruler_info && (
                            <div className="w-full mt-4 text-[10px] text-stone-400 uppercase tracking-widest">
                                Ruler Dynamics: {interpretation.ruler_info}
                            </div>
                        )}
                    </div>
                </div>

                {/* Core Personality & Gender Traits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-stone-100 relative overflow-hidden group hover:shadow-2xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-stone-900 pointer-events-none">✨</div>
                            <h3 className="text-3xl font-black italic mb-8 text-[#44403c]">Soul Personality</h3>
                            <p className="text-lg leading-relaxed italic text-stone-600 border-l-4 border-stone-400 pl-8 mb-10">
                                "{interpretation.personality}"
                            </p>
                            {interpretation.detailed_personality && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(interpretation.detailed_personality).map(([key, val], i) => (
                                        <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                            <p className="text-[9px] font-black text-stone-400 uppercase mb-1 tracking-tighter">{key}</p>
                                            <p className="text-[11px] text-stone-700 leading-tight italic">{val}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {interpretation.gender_traits && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                                    <div className="absolute -top-2 -right-2 text-4xl opacity-10">♂️</div>
                                    <h4 className="text-[10px] font-black uppercase text-blue-700 mb-4 tracking-widest">Male Traits</h4>
                                    <p className="text-xs text-blue-800 leading-relaxed italic">{interpretation.gender_traits.Male}</p>
                                </div>
                                <div className="bg-pink-50 p-8 rounded-[2.5rem] border border-pink-100 relative overflow-hidden">
                                    <div className="absolute -top-2 -right-2 text-4xl opacity-10">♀️</div>
                                    <h4 className="text-[10px] font-black uppercase text-pink-700 mb-4 tracking-widest">Female Traits</h4>
                                    <p className="text-xs text-pink-800 leading-relaxed italic">{interpretation.gender_traits.Female}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#44403c] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                            <h3 className="text-2xl font-black italic mb-8 relative z-10">Physical & Vitality Markers</h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-stone-400 mb-2 tracking-widest">Physical Traits</p>
                                    <p className="text-sm opacity-90 leading-relaxed italic">{interpretation.physical_traits}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-stone-400 mb-2 tracking-widest">Health & Constitution</p>
                                    <p className="text-sm opacity-90 leading-relaxed italic">{interpretation.health_vitality}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                                <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-4 tracking-widest">Core Strengths</h4>
                                <ul className="space-y-2">
                                    {interpretation.strengths.map((s, i) => (
                                        <li key={i} className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
                                <h4 className="text-[10px] font-black uppercase text-rose-700 mb-4 tracking-widest">Growth Areas</h4>
                                <ul className="space-y-2">
                                    {interpretation.challenges.map((c, i) => (
                                        <li key={i} className="text-xs font-bold text-rose-800 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Love, Career & Psychology */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {interpretation.love_life && (
                        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-lg">
                            <h4 className="text-xl font-black italic text-[#44403c] mb-4">Love & Relations</h4>
                            <p className="text-xs text-stone-600 leading-relaxed italic mb-6">{interpretation.love_life.Description}</p>
                            <div className="flex flex-wrap gap-2">
                                {interpretation.love_life.Compatibility.map((c, i) => (
                                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-100">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {interpretation.career && (
                        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-lg">
                            <h4 className="text-xl font-black italic text-[#44403c] mb-4">Career Prospects</h4>
                            <p className="text-xs text-stone-600 leading-relaxed italic">{interpretation.career}</p>
                        </div>
                    )}
                    {interpretation.psychological_traits && (
                        <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-lg">
                            <h4 className="text-xl font-black italic text-[#44403c] mb-4">Psychology</h4>
                            <div className="space-y-4">
                                {Object.entries(interpretation.psychological_traits).map(([key, val], i) => (
                                    <div key={i}>
                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{key}</p>
                                        <p className="text-[11px] text-stone-600 italic leading-tight">{val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Planetary Impacts Specific to Sign */}
                {interpretation.planetary_impacts && (
                    <div className="bg-stone-900 rounded-[4rem] p-16 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 p-12 opacity-5 text-9xl">🔭</div>
                        <h3 className="text-3xl font-black italic mb-12 text-stone-200 text-center">Planetary Dynamics for {ascendantSign}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(interpretation.planetary_impacts).map(([pName, pDesc], idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                                    <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">{pName}</p>
                                    <p className="text-[11px] text-stone-300 italic leading-relaxed">{pDesc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Planets in 1st House */}
                {planetsInFirst.length > 0 && (
                    <div className="bg-white rounded-[4rem] p-16 border border-stone-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl">🪐</div>
                        <h3 className="text-3xl font-black italic mb-12 text-[#44403c] text-center">Chart-Specific Influences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {planetsInFirst.map((pName, idx) => {
                                const pData = ASCENDANT_PLANETS_1ST_HOUSE[pName];
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedPlanet({ name: pName, ...pData })}
                                        className="cursor-pointer bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 hover:bg-stone-100 hover:-translate-y-2 transition-all group"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-black text-stone-800 uppercase tracking-tighter">{pName}</span>
                                            <span className="text-[10px] text-stone-400 group-hover:text-stone-800 transition-colors">READ MORE →</span>
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 italic">
                                            {pData?.effect || "Complex influence on the Ascendant... Analysis required."}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Remedies Section */}
                <div className="bg-amber-50 rounded-[3rem] p-12 border border-amber-100 shadow-inner">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-6xl">📿</div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-black italic text-amber-900 mb-2">Empowerment Remedies</h3>
                            <p className="text-xs uppercase font-black text-amber-700 tracking-[0.3em] mb-6 opacity-70">Alignment & Harmonization</p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                {interpretation.remedies.map((rem, idx) => (
                                    <div key={idx} className="bg-white/80 px-6 py-3 rounded-full border border-amber-200 text-xs font-bold text-amber-900 shadow-sm">
                                        {rem}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center opacity-30 py-8">
                    <p className="text-[10px] uppercase font-black tracking-widest">Astro Consult • Ascendant Diagnostic Engine v1.0</p>
                </div>
            </div>

            {/* Planet Modal */}
            {selectedPlanet && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={() => setSelectedPlanet(null)}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-12 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black text-[#44403c] italic tracking-tighter">{selectedPlanet.name} in 1st House</h2>
                                <button onClick={() => setSelectedPlanet(null)} className="text-stone-300 hover:text-stone-800 text-5xl font-light leading-none">&times;</button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] mb-3">Core Influence</h4>
                                    <p className="text-lg text-stone-700 italic leading-relaxed">{selectedPlanet.effect}</p>
                                </div>
                                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                                    <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] mb-3">Impact on Vitality</h4>
                                    <p className="text-sm text-stone-600 italic">{selectedPlanet.vitality}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
