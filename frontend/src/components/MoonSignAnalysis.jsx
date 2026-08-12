import React, { useState, useEffect } from 'react';
import { MOON_SIGN_INTERPRETATIONS, MOON_SIGN_INTRO } from '../data/moonSignData';

export default function MoonSignAnalysis({ reportData }) {
    const [data, setData] = useState(reportData || null);
    const [loading, setLoading] = useState(!reportData);

    useEffect(() => {
        if (reportData) {
            setData(reportData);
            setLoading(false);
            return;
        }
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, [reportData]);

    if (loading) return <div className="p-10 text-center italic text-indigo-600">Loading Moon Sign Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-400">No data found. Please generate a report.</div>;

    const positions = data.planet_positions || [];
    const moonPos = positions.find(p => p.planet === "Moon");
    const moonSign = moonPos ? moonPos.sign : "Aries";
    const interpretation = MOON_SIGN_INTERPRETATIONS[moonSign] || MOON_SIGN_INTERPRETATIONS["Aries"];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-serif p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4 border-b border-slate-200 pb-16 relative">
                    <div className="text-8xl mb-6 animate-pulse-slow">{interpretation.emoji}</div>
                    <h1 className="text-6xl font-black text-[#334155] italic tracking-tighter uppercase">
                        The {moonSign} Moon
                    </h1>
                    <p className="text-slate-500 uppercase tracking-[0.5em] text-sm font-black">
                        Emotions • Subconscious • Intuition • Inner Peace
                    </p>
                    <div className="max-w-3xl mx-auto mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-500 text-[11px] leading-relaxed italic text-center">
                        <span className="block font-black uppercase tracking-widest text-[9px] text-slate-400 mb-2">Moon Sign Essence</span>
                        {MOON_SIGN_INTRO}
                    </div>
                    <div className="max-w-2xl mx-auto mt-6 text-slate-500 text-sm leading-relaxed italic">
                        {interpretation.description}
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <span className="px-6 py-2 bg-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                            Element: {interpretation.element}
                        </span>
                        <span className="px-6 py-2 bg-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                            Ruling Planet: {interpretation.ruler}
                        </span>
                    </div>
                </div>

                {/* Emotional Nature & Needs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-slate-900 pointer-events-none">🌙</div>
                        <h3 className="text-3xl font-black italic mb-8 text-[#334155]">Emotional Landscape</h3>
                        <p className="text-lg leading-relaxed italic text-slate-600 border-l-4 border-slate-400 pl-8 mb-10">
                            "{interpretation.emotional_nature}"
                        </p>
                        {interpretation.inner_needs && (
                            <div className="space-y-6">
                                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                    <h4 className="text-[10px] font-black uppercase text-indigo-700 mb-2 tracking-widest">Core Inner Needs</h4>
                                    <p className="text-sm text-indigo-900 leading-relaxed italic">{interpretation.inner_needs}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6 h-full">
                            <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 shadow-sm">
                                <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-6 tracking-widest">Emotional Strengths</h4>
                                <ul className="space-y-3">
                                    {interpretation.strengths ? interpretation.strengths.map((s, i) => (
                                        <li key={i} className="text-sm font-bold text-emerald-800 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> {s}
                                        </li>
                                    )) : null}
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 shadow-sm">
                                <h4 className="text-[10px] font-black uppercase text-rose-700 mb-6 tracking-widest">Inner Challenges</h4>
                                <ul className="space-y-3">
                                    {interpretation.challenges ? interpretation.challenges.map((c, i) => (
                                        <li key={i} className="text-sm font-bold text-rose-800 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-rose-500 rounded-full"></span> {c}
                                        </li>
                                    )) : null}
                                </ul>
                            </div>
                        </div>
                        
                        {/* New Aries Fields: Love & Professions */}
                        {(interpretation.love_romance || interpretation.professions) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {interpretation.love_romance && (
                                    <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100 shadow-sm">
                                        <h4 className="text-[10px] font-black uppercase text-pink-700 mb-4 tracking-widest">Love & Romance</h4>
                                        <p className="text-sm text-pink-900 leading-relaxed italic">{interpretation.love_romance}</p>
                                    </div>
                                )}
                                {interpretation.professions && (
                                    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
                                        <h4 className="text-[10px] font-black uppercase text-blue-700 mb-4 tracking-widest">Professions</h4>
                                        <p className="text-sm text-blue-900 leading-relaxed italic">{interpretation.professions}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {(interpretation.suitable_partners || interpretation.family_finances) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {interpretation.suitable_partners && (
                                    <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
                                        <h4 className="text-[10px] font-black uppercase text-purple-700 mb-4 tracking-widest">Suitable Partners</h4>
                                        <p className="text-sm text-purple-900 leading-relaxed italic">{interpretation.suitable_partners}</p>
                                    </div>
                                )}
                                {interpretation.family_finances && (
                                    <div className="bg-green-50 p-8 rounded-3xl border border-green-100 shadow-sm">
                                        <h4 className="text-[10px] font-black uppercase text-green-700 mb-4 tracking-widest">Family & Finances</h4>
                                        <p className="text-sm text-green-900 leading-relaxed italic whitespace-pre-line">{interpretation.family_finances}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Compatibility & Remedies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden print:bg-white print:border-slate-200">
                        <h4 className="text-2xl font-black italic text-[#334155] mb-6">Emotional Alignment</h4>
                        <p className="text-sm text-slate-600 leading-relaxed italic mb-8">
                            Your Moon sign deeply influences how you connect with others on a soul level. You feel most secure with partners who understand your inner world.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {["Compatible Signs:", ...(interpretation.suitable_partners ? interpretation.suitable_partners.split('.')[0].replace(/.*compatible with /i, '').split(/,|\band\b/) : ["Cancer", "Scorpio", "Pisces"])].map((tag, i) => (
                                <span key={i} className={`px-4 py-2 rounded-full text-xs font-bold border ${i === 0 ? 'bg-slate-900 text-white border-slate-900 print:bg-slate-900 print:text-white' : 'bg-white text-slate-800 border-slate-300 shadow-sm print:bg-white print:text-slate-800'}`}>
                                    {typeof tag === 'string' ? tag.trim() : tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {interpretation.remedies && interpretation.remedies.length > 0 && (
                        <div className="bg-amber-50 p-12 rounded-[3rem] border border-amber-100 shadow-inner">
                            <h3 className="text-2xl font-black italic text-amber-900 mb-6">Nurturing the Soul</h3>
                            <div className="space-y-4">
                                {interpretation.remedies.map((rem, idx) => (
                                    <div key={idx} className="flex items-center gap-4 text-amber-800">
                                        <span className="text-xl">✨</span>
                                        <p className="text-sm font-bold italic">{rem}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* House Placements Section */}
                {interpretation.house_placements && (
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-lg relative overflow-hidden">
                        <h4 className="text-2xl font-black italic text-[#334155] mb-8">Notable House Placements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(interpretation.house_placements).map(([house, description]) => (
                                <div key={house} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <h5 className="text-xs font-black uppercase text-indigo-600 mb-3 tracking-widest">In the {house}{[1, 21, 31].includes(Number(house)) ? 'st' : [2, 22].includes(Number(house)) ? 'nd' : [3, 23].includes(Number(house)) ? 'rd' : 'th'} House</h5>
                                    <p className="text-sm text-slate-600 leading-relaxed italic">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center opacity-30 py-8 border-t border-slate-200">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Moon Sign Diagnostic Engine • Inner Self Analysis v1.0</p>
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
