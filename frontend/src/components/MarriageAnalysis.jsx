import React, { useState, useEffect } from 'react';
import { MARRIAGE_HOUSE_INTERPRETATIONS, MARRIAGE_YOGAS, MARRIAGE_CONJUNCTIONS, SIGN_LORDS, predictMarriageYears } from '../data/marriageData';

export default function MarriageAnalysis() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYoga, setSelectedYoga] = useState(null);
    const [isHindi, setIsHindi] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-[#fb7185]">Loading Marriage Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-400">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const basic = data.basic_details || {};
    
    // Ultra-robust date extraction
    let day = basic.day || basic.date;
    let month = basic.month;
    let year = basic.year;
    
    if (!day || !month || !year) {
        const fullDate = basic.birth_date || (basic.birth_datetime && basic.birth_datetime.split(' ')[0]);
        if (fullDate) {
            if (fullDate.includes('-')) {
                const parts = fullDate.split('-');
                if (parts[0].length === 4) { [year, month, day] = parts; }
                else { [day, month, year] = parts; }
            } else if (fullDate.includes('/')) {
                const parts = fullDate.split('/');
                if (parts[0].length === 4) { [year, month, day] = parts; }
                else { [day, month, year] = parts; }
            }
        }
    }
    
    const dobStr = `${day}/${month}/${year}`;
    console.log("Numerology Debug - DOB String:", dobStr);
    const numerology = predictMarriageYears(dobStr);
    console.log("Numerology Debug - Result:", numerology);

    const getPlanetHouse = (pName) => {
        const hNum = Object.keys(houses).find(h => 
            houses[h].planets?.some(p => (typeof p === 'object' ? p.name : p) === pName)
        );
        return hNum ? parseInt(hNum) : null;
    };

    const hasYoga = (yogaId) => {
        const yoga = MARRIAGE_YOGAS.find(y => y.id === yogaId);
        if (!yoga) return false;
        return yoga.condition(houses);
    };

    const getActiveConjunctions = () => {
        const detected = [];
        Object.keys(houses).forEach(hNum => {
            const planets = houses[hNum].planets?.map(p => typeof p === 'object' ? p.name : p) || [];
            MARRIAGE_CONJUNCTIONS.forEach(conj => {
                if (conj.planets.every(p => planets.includes(p))) {
                    detected.push({ ...conj, house: hNum });
                }
            });
        });
        return detected;
    };

    const activeConjunctions = getActiveConjunctions();

    return (
        <div className="min-h-screen bg-[#020617] text-[#cbd5e1] font-serif p-8 relative">
            {/* Language Toggle Button */}
            <button 
                onClick={() => setIsHindi(!isHindi)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'black',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                A / अ
            </button>
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-[#fb7185]/20 pb-12">
                    <div className="text-6xl mb-4">💍</div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter">Marriage & Relationship Analysis</h1>
                    <p className="text-[#fb7185] uppercase tracking-[0.4em] text-sm font-black">Lagna Chart Diagnostic • Marital Harmony</p>
                </div>

                {/* Numerology Timeline Section */}
                {numerology && (
                    <div className="bg-[#0f172a] rounded-[3rem] border border-amber-500/20 p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-amber-500 pointer-events-none">123</div>
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-amber-500/30">🔢</div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter">Numerology Timeline</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1">Birth Number (Moolank)</p>
                                        <p className="text-4xl font-black text-white">{numerology.birthNumber}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1">Life Path Number (Bhagyank)</p>
                                        <p className="text-4xl font-black text-white">{numerology.lifePathNumber}</p>
                                    </div>
                                </div>
                                <p className="text-sm italic opacity-70 leading-relaxed border-l-2 border-amber-500/40 pl-4">
                                    {numerology.rules.intro}
                                </p>
                            </div>
                            
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Predicted Marriage Yoga Years</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {numerology.predictions.map((p, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 text-center hover:scale-105 transition-transform">
                                            <p className="text-2xl font-black text-amber-500 mb-1">{p.year}</p>
                                            <p className="text-[8px] font-black uppercase text-white tracking-widest opacity-60">{p.type}</p>
                                            <div className="mt-2 h-1 w-8 bg-amber-500 mx-auto rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 mt-6">
                                    <p className="text-[9px] font-bold text-amber-200 uppercase mb-2">💡 Numerology Tip</p>
                                    <p className="text-xs opacity-60 leading-relaxed">
                                        According to numerology, your strongest years for union are those that reduce to <b>{numerology.rules.marriage_years.join(', ')}</b>. 
                                        Planning ceremonies on dates that reduce to 1 or 9 is generally considered highly auspicious.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* House Analysis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[7, 8, 2, 4].map(hNum => {
                        const hInfo = MARRIAGE_HOUSE_INTERPRETATIONS[hNum];
                        if (!hInfo) return null;
                        const houseData = houses[hNum] || houses[hNum.toString()];
                        const housePlanets = houseData?.planets || [];
                        const signName = houseData?.sign_name;

                        return (
                            <div key={hNum} className="bg-[#0f172a] rounded-[3rem] border border-[#fb7185]/10 p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 text-[12rem] text-white/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                <h3 className="text-2xl font-black text-[#fb7185] mb-2">{hInfo.title}</h3>
                                <p className="text-sm opacity-60 mb-6 font-sans uppercase tracking-widest">Sign: {signName}</p>
                                <p className="text-lg italic mb-8 border-l-4 border-[#fb7185] pl-4">{hInfo.description}</p>
                                
                                <div className="space-y-4 relative z-10">
                                    {housePlanets.length > 0 ? (
                                        housePlanets.map((p, idx) => {
                                            const pName = typeof p === 'object' ? p.name : p;
                                            if (pName === 'Ascendant' || pName === 'L') return null;
                                            const interpretation = hInfo.placements?.[pName];
                                            const isObject = typeof interpretation === 'object';

                                            return (
                                                <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">{interpretation?.emoji}</span>
                                                            <span className="text-xl font-bold text-white uppercase">{pName}</span>
                                                            {interpretation?.rating && (
                                                                <span className="text-[10px] text-amber-400 font-bold ml-2">{interpretation.rating}</span>
                                                            )}
                                                        </div>
                                                        {isObject && (
                                                            <span className="text-[10px] bg-[#fb7185]/10 text-[#fb7185] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-[#fb7185]/20 animate-pulse">
                                                                Deep Analysis available
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm leading-relaxed mb-4 italic opacity-80">
                                                        {isObject ? interpretation.intro : (interpretation || "Influence analysis in progress...")}
                                                    </p>
                                                    {isObject && interpretation.effects && (
                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            {Object.entries(interpretation.effects).slice(0, 4).map(([key, val], idx) => (
                                                                <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                                                    <p className="text-[8px] font-black uppercase text-[#fb7185] mb-1">{key}</p>
                                                                    <p className="text-[10px] opacity-70 line-clamp-2">{val}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isObject && (
                                                        <button 
                                                            onClick={() => setSelectedYoga({ 
                                                                name: `${pName} in ${hInfo.title}`, 
                                                                details: interpretation,
                                                                type: 'planet_detail'
                                                            })}
                                                            className="w-full py-3 bg-[#fb7185]/10 hover:bg-[#fb7185] hover:text-white text-[#fb7185] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-[#fb7185]/30"
                                                        >
                                                            View Full Diagnostic
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm italic opacity-40">No planets occupy this house. Its results are governed by the Lord of {signName}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Conjunctions Section */}
                {activeConjunctions.length > 0 && (
                    <div className="bg-gradient-to-br from-[#1e1b4b] to-[#020617] rounded-[4rem] border border-indigo-500/20 p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-indigo-500/20"></div>
                                <h2 className="text-3xl font-black text-indigo-300 italic tracking-tighter">Active Relationship Conjunctions</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-indigo-500/20"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeConjunctions.map((conj, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] hover:border-indigo-500/40 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-2xl font-black text-white italic tracking-tighter">
                                                {conj.planets.join(' + ')}
                                            </div>
                                            {conj.rating && <span className="text-[10px] text-amber-400 font-bold">{conj.rating}</span>}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-indigo-400">Marital Type</p>
                                                <p className="text-sm text-white/90 italic">{conj.marriage_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-rose-400">Risk Profile</p>
                                                <p className="text-xs text-rose-300 opacity-80">{conj.risk}</p>
                                            </div>
                                            <div className="pt-3 border-t border-white/5">
                                                <p className="text-[10px] text-white/60 leading-relaxed">{conj.effects}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-[7px] text-white/20 uppercase font-black tracking-widest">Detected in House {conj.house}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Yogas Section */}
                <div className="bg-[#0f172a] rounded-[4rem] border border-[#fb7185]/20 p-12 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fb7185]/5 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fb7185]/20"></div>
                            <h2 className="text-3xl font-black text-[#fb7185] italic">Marriage & Relationship Yogas</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fb7185]/20"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {MARRIAGE_YOGAS.map(yoga => {
                                const active = hasYoga(yoga.id);
                                return (
                                    <div 
                                        key={yoga.id} 
                                        className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                            active ? 'bg-[#fb7185]/10 border-[#fb7185]/40 shadow-[0_0_30px_rgba(251,113,133,0.1)]' : 'bg-white/5 border-white/5 opacity-40 grayscale'
                                        }`}
                                        onClick={() => active && setSelectedYoga(yoga)}
                                    >
                                        <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:scale-125 transition-transform">
                                            {active ? '✨' : '🔒'}
                                        </div>
                                        <h4 className={`text-xl font-black mb-3 ${active ? 'text-white' : 'text-gray-500'}`}>{yoga.name}</h4>
                                        <p className="text-xs leading-relaxed opacity-60 mb-6 line-clamp-3 italic">
                                            {yoga.description}
                                        </p>
                                        {active && (
                                            <div className="text-[9px] font-black uppercase text-[#fb7185] tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                Active Placement • Explore Details →
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            {selectedYoga && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedYoga(null)}></div>
                    <div className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setSelectedYoga(null)} className="text-white/40 hover:text-white text-4xl font-light">&times;</button>
                        </div>
                        
                        <div className="p-12 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-[1px] w-12 bg-[#fb7185]"></div>
                                <p className="text-[#fb7185] text-xs font-black uppercase tracking-[0.4em]">Detailed Diagnostic Report</p>
                            </div>
                            <h2 className="text-5xl font-black text-white italic mb-10 tracking-tighter">{selectedYoga.name}</h2>
                            
                            {selectedYoga.type === 'planet_detail' ? (
                                <div className="space-y-12">
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-sm font-black uppercase text-[#fb7185] mb-4 tracking-widest">Diagnostic Overview</h4>
                                        <p className="text-xl leading-relaxed italic text-white/90">{selectedYoga.details.intro}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase text-[#fb7185] tracking-[0.2em] border-b border-white/10 pb-2">Marital Effects</h4>
                                            {Object.entries(selectedYoga.details.effects).map(([key, val], idx) => (
                                                <div key={idx} className="flex gap-4 items-start">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#fb7185] mt-2 shrink-0"></div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-white uppercase">{key}</p>
                                                        <p className="text-sm opacity-60">{val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-black/20 p-8 rounded-[2rem] border border-[#fb7185]/20 h-full">
                                            <h4 className="text-[10px] font-black uppercase text-[#fb7185] tracking-[0.2em] mb-6">Strength & Dignity Analysis</h4>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">When Strong</p>
                                                    <p className="text-xs opacity-70 italic">{selectedYoga.details.strong_vs_weak.Strong}</p>
                                                </div>
                                                <div className="h-[1px] bg-white/5"></div>
                                                <div>
                                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">When Weak / Afflicted</p>
                                                    <p className="text-xs opacity-70 italic">{selectedYoga.details.strong_vs_weak.Weak}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase text-[#fb7185] tracking-[0.2em] mb-6">Harmony & Growth Tips</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedYoga.details.harmony_tips?.map((area, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-[#fb7185]/10 text-[#fb7185] text-[10px] font-black rounded-lg border border-[#fb7185]/20 italic">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase text-[#fb7185] tracking-[0.2em] mb-6">Actionable Remedies</h4>
                                            <ul className="space-y-3">
                                                {selectedYoga.details.remedies?.map((rem, idx) => (
                                                    <li key={idx} className="text-xs opacity-70 flex gap-3">
                                                        <span className="text-[#fb7185]">●</span> {rem}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-xl leading-relaxed italic text-white/80">{selectedYoga.description}</p>
                                    {selectedYoga.details && (
                                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                            <h4 className="text-sm font-black uppercase text-[#fb7185] mb-6 tracking-widest">Formation Logic</h4>
                                            <p className="text-lg mb-8 leading-relaxed opacity-90">{selectedYoga.details.formation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
