import React, { useState, useEffect } from 'react';
import { HEALTH_HOUSE_INTERPRETATIONS, HEALTH_TIPS, DOSHA_TYPES, HEALTH_CONJUNCTIONS, HEALTH_INSIGHTS } from '../data/healthData';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';

const SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

export default function HealthAnalysis() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-emerald-600">Loading Health Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-400">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const ascendantSign = houses[1]?.sign_name || "Aries";

    // Calculate 6th Lord and its placement
    const planetPlacements = {};
    Object.keys(houses).forEach(hNum => {
        const planetsInH = houses[hNum]?.planets?.map(p => typeof p === 'object' ? p.name : p) || [];
        planetsInH.forEach(p => {
            planetPlacements[p] = Number(hNum);
        });
    });

    const h6Sign = houses["6"]?.sign_name;
    const lord6 = h6Sign ? SIGN_LORDS[h6Sign] : null;
    const pos6 = lord6 ? planetPlacements[lord6] : null;


    const getDosha = (sign) => {
        if (DOSHA_TYPES.Vata.signs.includes(sign)) return { type: "Vata", ...DOSHA_TYPES.Vata };
        if (DOSHA_TYPES.Pitta.signs.includes(sign)) return { type: "Pitta", ...DOSHA_TYPES.Pitta };
        return { type: "Kapha", ...DOSHA_TYPES.Kapha };
    };

    const userDosha = getDosha(ascendantSign);

    const getActiveConjunctions = () => {
        const detected = [];
        Object.keys(houses).forEach(hNum => {
            const planets = houses[hNum].planets?.map(p => typeof p === 'object' ? p.name : p) || [];
            HEALTH_CONJUNCTIONS.forEach(conj => {
                if (conj.planets.every(p => planets.includes(p))) {
                    detected.push({ ...conj, house: hNum });
                }
            });
        });
        return detected;
    };

    const activeConjunctions = getActiveConjunctions();

    return (
        <div className={`${isLightMode ? 'light-mode-override relative' : 'min-h-screen bg-[#f0f9ff] text-[#0f172a] font-serif p-8'} relative`}>

            <button 
                onClick={() => setIsLightMode(!isLightMode)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '80px',
                    zIndex: 1000,
                    background: isLightMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: isLightMode ? 'white' : 'black',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                {isLightMode ? '🌙 Dark' : '☀️ Light'}
            </button>


            <style>{`
                .light-mode-override {
                    background-color: #f8fafc !important;
                    color: #a51e0dbd !important;
                }
                .light-mode-override .bg-\[\#0f172a\],
                .light-mode-override .bg-\[\#1e293b\],
                .light-mode-override .bg-\[\#020617\] {
                    background-color: #ffffff !important;
                    border-color: rgba(0,0,0,0.1) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                }
                .light-mode-override .text-white {
                    color: #0f172a !important;
                }
                .light-mode-override .text-\[\#cbd5e1\] {
                    color: #a51e0dbd !important;
                }
                .light-mode-override .bg-white\/5 {
                    background-color: rgba(0,0,0,0.03) !important;
                    border-color: rgba(0,0,0,0.05) !important;
                }
                .light-mode-override .from-\[\#1e1b4b\] {
                    --tw-gradient-from: #f1f5f9 var(--tw-gradient-from-position) !important;
                }
                .light-mode-override .to-\[\#020617\] {
                    --tw-gradient-to: #e2e8f0 var(--tw-gradient-to-position) !important;
                }
            `}</style>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-emerald-500/20 pb-12">
                    <div className="text-6xl mb-4">🏥</div>
                    <h1 className="text-5xl font-black text-[#065f46] italic tracking-tighter">Holistic Health Analysis</h1>
                    <p className="text-emerald-600 uppercase tracking-[0.4em] text-sm font-black">Vitality • Constitution • Healing Diagnostic</p>
                </div>

                {/* Dosha & Constitution Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white rounded-[3rem] p-8 shadow-xl border border-emerald-100 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black text-emerald-900">☯️</div>
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Primary Constitution</p>
                        <h2 className="text-4xl font-black text-[#065f46] mb-4">{userDosha.type} Prakriti</h2>
                        <p className="text-sm italic opacity-70 leading-relaxed mb-6">{userDosha.description}</p>
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 w-full">
                            <p className="text-[10px] font-bold text-emerald-800 uppercase mb-1">Common Imbalances</p>
                            <p className="text-xs text-emerald-700 italic">{userDosha.imbalance}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#065f46] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                        <h3 className="text-2xl font-black italic mb-8 relative z-10">Essential Wellness Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {HEALTH_TIPS.map((tip, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-all">
                                    <div className="text-3xl mb-4">{tip.icon}</div>
                                    <p className="text-[10px] font-black uppercase text-emerald-300 mb-2">{tip.category}</p>
                                    <p className="text-xs leading-relaxed opacity-80">{tip.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Health Insights / Special Rules */}
                <div className="bg-white rounded-[2rem] p-6 border-l-8 border-amber-500 shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <p className="text-[10px] font-black uppercase text-amber-600">Expert Astrological Insight</p>
                            <p className="text-sm italic text-slate-700">{HEALTH_INSIGHTS.sixth_house_rule}</p>
                        </div>
                    </div>
                </div>

                {/* 6th Lord Placement Scroll (BPHS Ch. 24) */}
                {pos6 && BPHS_BHAVA_LORDS_RULES.SixthLord[pos6] && (
                    <div className="bg-white border-2 border-emerald-100 p-8 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl text-emerald-900">🏥</div>
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="text-5xl text-emerald-600">🏛️</div>
                            <div className="flex-1 space-y-2">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                                    Sixth Lord House Placement (BPHS Ch. 24)
                                </span>
                                <h4 className="text-2xl font-black text-emerald-950 italic">
                                    Disease Lord ({lord6}) in the {pos6 === 1 ? "1st" : pos6 === 2 ? "2nd" : pos6 === 3 ? "3rd" : pos6 + "th"} House
                                </h4>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{BPHS_BHAVA_LORDS_RULES.SixthLord[pos6].result}"
                                </p>
                                <div className="text-xs text-slate-500 font-serif border-t border-emerald-100 pt-2 italic">
                                    <span className="font-bold block text-emerald-900 not-italic mb-1">Sastra Notes:</span>
                                    {BPHS_BHAVA_LORDS_RULES.SixthLord[pos6].notes}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conjunctions Section */}
                {activeConjunctions.length > 0 && (
                    <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🧬</div>
                        <h3 className="text-2xl font-black italic mb-8 relative z-10">Detected Health Combinations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                            {activeConjunctions.map((conj, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-lg font-black text-emerald-300 uppercase tracking-tight">{conj.planets.join(' + ')}</div>
                                        {conj.rating && <span className="text-xs">{conj.rating}</span>}
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-white/40">Risk Profile</p>
                                            <p className="text-xs leading-relaxed italic">{conj.effects}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-white/40">Lifestyle Focus</p>
                                            <p className="text-xs text-emerald-200">{conj.lifestyle}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[7px] opacity-30 uppercase font-black">House {conj.house}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* House Analysis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 6, 8].map(hNum => {
                        const hInfo = HEALTH_HOUSE_INTERPRETATIONS[hNum];
                        if (!hInfo) return null;
                        const houseData = houses[hNum] || houses[hNum.toString()];
                        const housePlanets = houseData?.planets || [];
                        const signName = houseData?.sign_name;

                        return (
                            <div key={hNum} className="bg-white rounded-[2.5rem] border border-emerald-100 p-8 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-[8rem] text-emerald-500/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                <h3 className="text-xl font-black text-[#065f46] mb-1">{hInfo.title}</h3>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Sign: {signName}</p>
                                <p className="text-sm italic mb-8 border-l-2 border-emerald-500 pl-4 opacity-70">{hInfo.description}</p>
                                
                                <div className="space-y-4 relative z-10">
                                    {housePlanets.length > 0 ? (
                                        housePlanets.map((p, idx) => {
                                            const pName = typeof p === 'object' ? p.name : p;
                                            if (pName === 'Ascendant' || pName === 'L') return null;
                                            const interpretation = hInfo.placements?.[pName];

                                            return (
                                                <div key={idx} className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 hover:bg-emerald-100/50 transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {interpretation?.emoji && <span className="text-lg">{interpretation.emoji}</span>}
                                                            <span className="text-sm font-black text-[#065f46] uppercase">{pName}</span>
                                                            {interpretation?.rating && <span className="text-[10px] ml-1">{interpretation.rating}</span>}
                                                        </div>
                                                        {interpretation && (
                                                            <button 
                                                                onClick={() => setSelectedDetail({ 
                                                                    name: `${pName} in ${hInfo.title}`, 
                                                                    ...interpretation 
                                                                })}
                                                                className="text-[9px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest"
                                                            >
                                                                Details →
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs leading-relaxed opacity-70 italic">
                                                        {interpretation ? interpretation.intro : "Influence analysis in progress..."}
                                                    </p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs italic opacity-40">No planets occupy this house. Its results are governed by the Lord of {signName}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#064e3b]/80 backdrop-blur-sm" onClick={() => setSelectedDetail(null)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setSelectedDetail(null)} className="text-slate-400 hover:text-slate-800 text-4xl font-light">&times;</button>
                        </div>
                        
                        <div className="p-12 space-y-8">
                            <h2 className="text-4xl font-black text-[#065f46] italic tracking-tighter">{selectedDetail.name}</h2>
                            <p className="text-lg leading-relaxed italic text-slate-600 border-l-4 border-emerald-500 pl-6">{selectedDetail.intro}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-4">Physiological Effects</h4>
                                    {Object.entries(selectedDetail.effects).map(([key, val], idx) => (
                                        <div key={idx} className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <p className="text-[9px] font-black text-emerald-800 uppercase mb-1">{key}</p>
                                            <p className="text-xs opacity-70">{val}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-4">Holistic Remedies</h4>
                                    <div className="space-y-2">
                                        {selectedDetail.remedies.map((rem, idx) => (
                                            <div key={idx} className="flex gap-3 items-center text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                                {rem}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
