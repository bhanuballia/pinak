import React, { useState, useEffect } from 'react';
import { MARRIAGE_HOUSE_INTERPRETATIONS, MARRIAGE_YOGAS, MARRIAGE_CONJUNCTIONS, SIGN_LORDS, predictMarriageYears } from '../data/marriageData';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';

export default function MarriageAnalysis() {
    const [isLightMode, setIsLightMode] = useState(true);
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

    if (loading) return <div className="p-10 text-center italic text-[#881337] bg-[#fff1f2] min-h-screen">Loading Marriage Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-600 bg-[#fff1f2] min-h-screen">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const basic = data.basic_details || {};

    const getPlanetHouse = (pName) => {
        const hNum = Object.keys(houses).find(h =>
            houses[h].planets?.some(p => (typeof p === 'object' ? p.name : p) === pName)
        );
        return hNum ? parseInt(hNum) : null;
    };

    // Calculate 7th Lord and its placement
    const h7Sign = houses["7"]?.sign_name;
    const lord7 = h7Sign ? SIGN_LORDS[h7Sign] : null;
    const pos7 = lord7 ? getPlanetHouse(lord7) : null;

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
    const numerology = predictMarriageYears(dobStr);

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
        <div className="min-h-screen bg-[#fff1f2] text-[#1e293b] font-serif p-8 relative">
            <button
                onClick={() => setIsLightMode(!isLightMode)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '80px',
                    zIndex: 1000,
                    background: '#ffe4e6',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#881337',
                    boxShadow: '0 2px 8px rgba(136, 19, 55, 0.1)'
                }}
            >
                {isLightMode ? '🌹 Light Rose' : '🌙 Dark'}
            </button>

            {/* Language Toggle Button */}
            <button
                onClick={() => setIsHindi(!isHindi)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    background: '#ffe4e6',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#881337',
                    boxShadow: '0 2px 8px rgba(136, 19, 55, 0.1)'
                }}
            >
                A / अ
            </button>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-[#fecdd3] pb-12">
                    <div className="text-6xl mb-4">💍</div>
                    <h1 className="text-5xl font-black text-[#881337] italic tracking-tighter">Marriage & Relationship Analysis</h1>
                    <p className="text-[#be123c] uppercase tracking-[0.4em] text-sm font-black">Lagna Chart Diagnostic • Marital Harmony</p>
                </div>

                {/* 7th Lord Placement Scroll (BPHS Ch. 24) */}
                {pos7 && BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7] && (
                    <div className="bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="text-5xl text-[#be123c]">🏛️</div>
                            <div className="flex-1 space-y-2">
                                <span className="px-3 py-1 bg-[#ffe4e6] text-[#be123c] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                    Seventh Lord House Placement (BPHS Ch. 24)
                                </span>
                                <h4 className="text-2xl font-black text-[#881337] italic">
                                    Marriage Lord ({lord7}) in the {pos7 === 1 ? "1st" : pos7 === 2 ? "2nd" : pos7 === 3 ? "3rd" : pos7 + "th"} House
                                </h4>
                                <p className="text-sm text-[#1e293b] leading-relaxed italic">
                                    "{BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7].result}"
                                </p>
                                <div className="text-xs text-[#475569] font-serif border-t border-[#fecdd3] pt-2 italic">
                                    <span className="font-bold block text-[#881337] not-italic mb-1">Sastra Notes:</span>
                                    {BPHS_BHAVA_LORDS_RULES.SeventhLord[pos7].notes}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Numerology Timeline Section */}
                {numerology && (
                    <div className="bg-white rounded-[3rem] border border-[#fecdd3] p-10 shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#ffe4e6] rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#fecdd3]">🔢</div>
                                    <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter">Numerology Timeline</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-[#fff1f2] p-4 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">Birth Number (Moolank)</p>
                                        <p className="text-4xl font-black text-[#881337]">{numerology.birthNumber}</p>
                                    </div>
                                    <div className="bg-[#fff1f2] p-4 rounded-2xl border border-[#fecdd3]">
                                        <p className="text-[10px] font-black uppercase text-[#be123c] tracking-widest mb-1">Life Path Number (Bhagyank)</p>
                                        <p className="text-4xl font-black text-[#881337]">{numerology.lifePathNumber}</p>
                                    </div>
                                </div>
                                <p className="text-sm italic text-[#475569] leading-relaxed border-l-2 border-[#e11d48] pl-4">
                                    {numerology.rules.intro}
                                </p>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-[#881337] uppercase tracking-tight mb-4">Predicted Marriage Yoga Years</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {numerology.predictions.map((p, idx) => (
                                        <div key={idx} className="bg-[#fff1f2] p-5 rounded-2xl border border-[#fecdd3] text-center hover:scale-105 transition-transform">
                                            <p className="text-2xl font-black text-[#be123c] mb-1">{p.year}</p>
                                            <p className="text-[10px] font-black uppercase text-[#881337] tracking-widest">{p.type}</p>
                                            <div className="mt-2 h-1 w-8 bg-[#e11d48] mx-auto rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#ffe4e6] p-4 rounded-xl border border-[#fecdd3] mt-6">
                                    <p className="text-[10px] font-bold text-[#be123c] uppercase mb-2">💡 Numerology Tip</p>
                                    <p className="text-xs text-[#1e293b] leading-relaxed font-medium">
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
                            <div key={hNum} className="bg-white rounded-[3rem] border border-[#fecdd3] p-8 shadow-lg relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 text-[12rem] text-rose-900/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                <h3 className="text-2xl font-black text-[#be123c] mb-2">{hInfo.title}</h3>
                                <p className="text-sm text-[#881337] mb-6 font-sans uppercase tracking-widest font-bold">Sign: {signName}</p>
                                <p className="text-lg italic mb-8 border-l-4 border-[#e11d48] pl-4 text-[#1e293b]">{hInfo.description}</p>

                                <div className="space-y-4 relative z-10">
                                    {housePlanets.length > 0 ? (
                                        housePlanets.map((p, idx) => {
                                            const pName = typeof p === 'object' ? p.name : p;
                                            if (pName === 'Ascendant' || pName === 'L') return null;
                                            const interpretation = hInfo.placements?.[pName];
                                            const isObject = typeof interpretation === 'object';

                                            return (
                                                <div key={idx} className="bg-[#fff1f2] rounded-2xl p-6 border border-[#fecdd3] hover:border-[#e11d48]/40 transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">{interpretation?.emoji}</span>
                                                            <span className="text-xl font-bold text-[#881337] uppercase">{pName}</span>
                                                            {interpretation?.rating && (
                                                                <span className="text-[12px] text-[#be123c] font-bold ml-2">{interpretation.rating}</span>
                                                            )}
                                                        </div>
                                                        {isObject && (
                                                            <span className="text-[12px] bg-[#ffe4e6] text-[#be123c] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-[#fecdd3]">
                                                                Deep Analysis available
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[15px] leading-relaxed mb-4 italic text-[#1e293b]">
                                                        {isObject ? interpretation.intro : (interpretation || "Influence analysis in progress...")}
                                                    </p>
                                                    {isObject && interpretation.effects && (
                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            {Object.entries(interpretation.effects).slice(0, 4).map(([key, val], idx) => (
                                                                <div key={idx} className="bg-white p-3 rounded-xl border border-[#fecdd3]">
                                                                    <p className="text-[13px] font-black uppercase text-[#be123c] mb-1">{key}</p>
                                                                    <p className="text-[13px] text-[#1e293b] line-clamp-3">{val}</p>
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
                                                            className="w-full py-3 bg-[#ffe4e6] hover:bg-[#fecdd3] text-[#881337] rounded-xl text-[14px] font-black uppercase tracking-[0.2em] transition-all border border-[#fecdd3]"
                                                        >
                                                            View Full Diagnostic
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm italic text-[#475569]">No planets occupy this house. Its results are governed by the Lord of {signName}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Conjunctions Section */}
                {activeConjunctions.length > 0 && (
                    <div className="bg-white rounded-[4rem] border border-[#fecdd3] p-12 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fecdd3]"></div>
                                <h2 className="text-3xl font-black text-[#881337] italic tracking-tighter">Active Relationship Conjunctions</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fecdd3]"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeConjunctions.map((conj, idx) => (
                                    <div key={idx} className="bg-[#fff1f2] border border-[#fecdd3] p-6 rounded-[2.5rem] hover:border-[#e11d48]/40 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-2xl font-black text-[#881337] italic tracking-tighter">
                                                {conj.planets.join(' + ')}
                                            </div>
                                            {conj.rating && <span className="text-[12px] text-[#be123c] font-bold">{conj.rating}</span>}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-[#be123c]">Marital Type</p>
                                                <p className="text-sm text-[#1e293b] italic font-medium">{conj.marriage_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-red-700">Risk Profile</p>
                                                <p className="text-xs text-red-900 font-medium">{conj.risk}</p>
                                            </div>
                                            <div className="pt-3 border-t border-[#fecdd3]">
                                                <p className="text-[12px] text-[#1e293b] leading-relaxed">{conj.effects}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-[10px] text-[#881337] uppercase font-black tracking-widest">Detected in House {conj.house}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Yogas Section */}
                <div className="bg-white rounded-[4rem] border border-[#fecdd3] p-12 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fecdd3]"></div>
                            <h2 className="text-3xl font-black text-[#881337] italic">Marriage & Relationship Yogas</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fecdd3]"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {MARRIAGE_YOGAS.map(yoga => {
                                const active = hasYoga(yoga.id);
                                return (
                                    <div
                                        key={yoga.id}
                                        className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${active ? 'bg-[#fff1f2] border-[#e11d48] shadow-md' : 'bg-white border-[#fecdd3] opacity-60'
                                            }`}
                                        onClick={() => active && setSelectedYoga(yoga)}
                                    >
                                        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:scale-125 transition-transform">
                                            {active ? '✨' : '🔒'}
                                        </div>
                                        <h4 className={`text-xl font-black mb-3 ${active ? 'text-[#881337]' : 'text-[#475569]'}`}>{yoga.name}</h4>
                                        <p className="text-[15px] leading-relaxed text-[#475569] mb-6 line-clamp-3 italic">
                                            {yoga.description}
                                        </p>
                                        {active && (
                                            <div className="text-[14px] font-black uppercase text-[#be123c] tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
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
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedYoga(null)}></div>
                    <div className="relative w-full max-w-4xl bg-white border border-[#fecdd3] rounded-[3rem] shadow-2xl overflow-hidden text-[#1e293b]">
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setSelectedYoga(null)} className="text-[#881337] hover:text-[#be123c] text-4xl font-bold">&times;</button>
                        </div>

                        <div className="p-12 md:p-16 overflow-y-auto max-h-[90vh] custom-scrollbar">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-[2px] w-12 bg-[#e11d48]"></div>
                                <p className="text-[#be123c] text-xs font-black uppercase tracking-[0.4em]">Detailed Diagnostic Report</p>
                            </div>
                            <h2 className="text-5xl font-black text-[#881337] italic mb-10 tracking-tighter">{selectedYoga.name}</h2>

                            {selectedYoga.type === 'planet_detail' ? (
                                <div className="space-y-12">
                                    <div className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                        <h4 className="text-sm font-black uppercase text-[#be123c] mb-4 tracking-widest">Diagnostic Overview</h4>
                                        <p className="text-xl leading-relaxed italic text-[#1e293b]">{selectedYoga.details.intro}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] border-b border-[#fecdd3] pb-2">Marital Effects</h4>
                                            {Object.entries(selectedYoga.details.effects).map(([key, val], idx) => (
                                                <div key={idx} className="flex gap-4 items-start">
                                                    <div className="w-2 h-2 rounded-full bg-[#e11d48] mt-2 shrink-0"></div>
                                                    <div>
                                                        <p className="text-[12px] font-black text-[#881337] uppercase">{key}</p>
                                                        <p className="text-sm text-[#1e293b]">{val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[#fff1f2] p-8 rounded-[2rem] border border-[#fecdd3] h-full">
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Strength & Dignity Analysis</h4>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest mb-1">When Strong</p>
                                                    <p className="text-xs text-emerald-950 italic font-medium">{selectedYoga.details.strong_vs_weak.Strong}</p>
                                                </div>
                                                <div className="h-[1px] bg-[#fecdd3]"></div>
                                                <div>
                                                    <p className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-1">When Weak / Afflicted</p>
                                                    <p className="text-xs text-rose-950 italic font-medium">{selectedYoga.details.strong_vs_weak.Weak}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#fecdd3]">
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Harmony & Growth Tips</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedYoga.details.harmony_tips?.map((area, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-[#ffe4e6] text-[#be123c] text-[12px] font-black rounded-lg border border-[#fecdd3] italic">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black uppercase text-[#be123c] tracking-[0.2em] mb-6">Actionable Remedies</h4>
                                            <ul className="space-y-3">
                                                {selectedYoga.details.remedies?.map((rem, idx) => (
                                                    <li key={idx} className="text-xs text-[#1e293b] flex gap-3 font-medium">
                                                        <span className="text-[#e11d48]">●</span> {rem}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <p className="text-xl leading-relaxed italic text-[#1e293b]">{selectedYoga.description}</p>
                                    {selectedYoga.details && (
                                        <div className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-sm font-black uppercase text-[#be123c] mb-6 tracking-widest">Formation Logic</h4>
                                            <p className="text-lg mb-8 leading-relaxed text-[#1e293b]">{selectedYoga.details.formation}</p>
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
