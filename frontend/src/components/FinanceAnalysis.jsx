import React, { useState, useEffect } from 'react';
import { FINANCE_HOUSE_INTERPRETATIONS, FINANCE_YOGAS, SIGN_LORDS } from '../data/financeData';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';


export default function FinanceAnalysis() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYoga, setSelectedYoga] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-[#d4af37]">Loading Financial Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-400">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const planets = data.planet_positions || [];

    const getPlanetHouse = (p) => planets.find(item => item.planet === p)?.house;

    // Calculate 2nd Lord Placement
    const h2Sign = houses["2"]?.sign_name;
    const lord2 = SIGN_LORDS[h2Sign];
    const pos2 = getPlanetHouse(lord2) || null;


    // Simple Yoga Checkers
    const hasYoga = (yogaId) => {
        if (yogaId === 'budh_aditya') {
            const sunHouse = getPlanetHouse('Sun');
            const mercHouse = getPlanetHouse('Mercury');
            return sunHouse && mercHouse && sunHouse === mercHouse;
        }
        if (yogaId === 'chandra_mangal') {
            const moonHouse = getPlanetHouse('Moon');
            const marsHouse = getPlanetHouse('Mars');
            return moonHouse && marsHouse && moonHouse === marsHouse;
        }
        if (yogaId === 'gajkesari') {
            const jupHouse = getPlanetHouse('Jupiter');
            const moonHouse = getPlanetHouse('Moon');
            if (!jupHouse || !moonHouse) return false;
            const diff = Math.abs(jupHouse - moonHouse);
            return [0, 3, 6, 9].includes(diff); // 1, 4, 7, 10 distance
        }
        if (yogaId === 'dhan_yoga') {
            const h2Sign = houses["2"]?.sign_name;
            const h11Sign = houses["11"]?.sign_name;
            const lord2 = SIGN_LORDS[h2Sign];
            const lord11 = SIGN_LORDS[h11Sign];
            const pos2 = getPlanetHouse(lord2);
            const pos11 = getPlanetHouse(lord11);
            return (pos2 && [1, 2, 5, 9, 11].includes(pos2)) || (pos11 && [1, 2, 5, 9, 11].includes(pos11));
        }
        if (yogaId === 'panch_mahapurush') {
            const planetsToCheck = ['Mars', 'Jupiter', 'Mercury', 'Venus', 'Saturn'];
            return planetsToCheck.some(p => [1, 4, 7, 10].includes(getPlanetHouse(p)));
        }
        if (yogaId === 'raj_yoga') {
            // Simplified: Kendra lord in Trikona or vice versa
            const kendraHouses = [1, 4, 7, 10];
            const trikonaHouses = [1, 5, 9];

            // Get lords of kendra
            const kendraLords = kendraHouses.map(h => SIGN_LORDS[houses[h]?.sign_name]);
            // Check if any kendra lord is in a trikona house
            return kendraLords.some(lord => trikonaHouses.includes(getPlanetHouse(lord)));
        }
        if (yogaId === 'laxmi_yoga') {
            const h1Sign = houses["1"]?.sign_name;
            const h9Sign = houses["9"]?.sign_name;
            const l1 = SIGN_LORDS[h1Sign];
            const l9 = SIGN_LORDS[h9Sign];
            const pos1 = getPlanetHouse(l1);
            const pos9 = getPlanetHouse(l9);
            const venusPos = getPlanetHouse('Venus');

            const isKendraTrikona = (h) => [1, 4, 7, 10, 5, 9].includes(h);
            const isDusthana = (h) => [6, 8, 12].includes(h);

            // Standard Laxmi Yoga: L1 and L9 in Kendra/Trikona + L1 not in Dusthana
            if (pos1 && pos9 && isKendraTrikona(pos1) && isKendraTrikona(pos9) && !isDusthana(pos1)) return true;

            // Variation: Venus + L9 in Kendra/Trikona
            if (pos9 && venusPos && isKendraTrikona(pos9) && isKendraTrikona(venusPos)) return true;

            return false;
        }
        return false;
    };

    const getYogaHouse = (yogaId) => {
        if (yogaId === 'budh_aditya') return getPlanetHouse('Sun');
        return null;
    };

    return (
            <div className={`${isLightMode ? 'light-mode-override' : 'min-h-screen bg-[#020617] text-[#cbd5e1] font-serif p-8'} relative`}>

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
                .light-mode-override .bg-\[\#0f172a\] {
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
                    <div className="text-center space-y-4 border-b border-[#d4af37]/20 pb-12">
                        <div className="text-6xl mb-4">💰</div>
                        <h1 className="text-5xl font-black text-white italic tracking-tighter">Finance & Prosperity Analysis</h1>
                        <p className="text-[#d4af37] uppercase tracking-[0.4em] text-sm font-black">Lagna Chart Diagnostic • Wealth Potential</p>
                    </div>

                    {/* 2nd Lord Placement Section */}
                    {pos2 && BPHS_BHAVA_LORDS_RULES.SecondLord[pos2] && (
                        <div className="bg-[#0f172a] rounded-[3rem] border border-[#d4af37]/20 p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl text-white">💰</div>
                            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                <div className="text-5xl text-[#d4af37]">🏛️</div>
                                <div className="flex-1 space-y-2">
                                    <span className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#d4af37]/20">
                                        Second Lord House Placement (BPHS Ch. 24)
                                    </span>
                                    <h4 className="text-2xl font-black text-white italic">
                                        Wealth Lord ({lord2}) in the {pos2 === 1 ? "1st" : pos2 === 2 ? "2nd" : pos2 === 3 ? "3rd" : pos2 + "th"} House
                                    </h4>
                                    <p className="text-sm text-stone-300 leading-relaxed italic">
                                        "{BPHS_BHAVA_LORDS_RULES.SecondLord[pos2].result}"
                                    </p>
                                    <div className="text-xs text-stone-400 font-serif border-t border-[#d4af37]/10 pt-2 italic">
                                        <span className="font-bold block text-white not-italic mb-1">Sastra Notes:</span>
                                        {BPHS_BHAVA_LORDS_RULES.SecondLord[pos2].notes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* House Analysis Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[2, 5, 9, 10, 11].map(hNum => {
                            const hInfo = FINANCE_HOUSE_INTERPRETATIONS[hNum];
                            const houseData = houses[hNum] || houses[hNum.toString()];
                            const housePlanets = houseData?.planets || [];
                            const signName = houseData?.sign_name;

                            return (
                                <div key={hNum} className="bg-[#0f172a] rounded-[3rem] border border-[#d4af37]/10 p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -right-8 -top-8 text-[12rem] text-white/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                    <h3 className="text-2xl font-black text-[#d4af37] mb-2">{hInfo.title}</h3>
                                    <p className="text-sm opacity-60 mb-6 font-sans uppercase tracking-widest">Sign: {signName}</p>
                                    <p className="text-lg italic mb-8 border-l-4 border-[#d4af37] pl-4">{hInfo.description}</p>

                                    <div className="space-y-4 relative z-10">
                                        <h4 className="text-xs font-black uppercase text-white/40 tracking-widest">Planetary Influences</h4>
                                        {housePlanets.length > 0 ? (
                                            housePlanets.map((p, i) => {
                                                const pName = typeof p === 'object' ? p.name : p;
                                                const interpretation = hInfo.placements[pName];
                                                const isObject = typeof interpretation === 'object' && interpretation !== null;

                                                return (
                                                    <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-[#d4af37]/30 transition-all group/planet">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl">✨</span>
                                                                <span className="font-bold text-white text-lg">{pName}</span>
                                                            </div>
                                                            {isObject && <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-tighter opacity-0 group-hover/planet:opacity-100 transition-opacity">Deep Analysis available</span>}
                                                        </div>

                                                        {!isObject ? (
                                                            <p className="text-sm italic opacity-80 leading-relaxed">{interpretation || "This planet's presence brings specialized energy to your financial sector."}</p>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <p className="text-sm italic text-[#d4af37] leading-relaxed">{interpretation.intro}</p>

                                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                                    {Object.entries(interpretation.effects_on_wealth).slice(0, 2).map(([key, val], idx) => (
                                                                        <div key={idx} className="bg-black/20 p-2 rounded-lg">
                                                                            <p className="text-[10px] font-bold text-white/40 uppercase">{key}</p>
                                                                            <p className="text-[11px] text-white/70">{val}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <button
                                                                    onClick={() => setSelectedYoga({
                                                                        id: 'planet_detail',
                                                                        name: `${pName} in ${hInfo.title}`,
                                                                        details: interpretation
                                                                    })}
                                                                    className="w-full mt-4 py-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/20 rounded-xl text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] transition-all"
                                                                >
                                                                    View Full Diagnostic
                                                                </button>
                                                            </div>
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

                    {/* Yogas Section */}
                    <div className="bg-[#0f172a] rounded-[4rem] border border-[#d4af37]/20 p-12 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/20"></div>
                                <h2 className="text-3xl font-black text-[#d4af37] italic">Special Wealth Yogas</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/20"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {FINANCE_YOGAS.map(yoga => {
                                    const active = hasYoga(yoga.id);
                                    return (
                                        <div
                                            key={yoga.id}
                                            onClick={() => active && yoga.details && setSelectedYoga(yoga)}
                                            className={`p-6 rounded-3xl border transition-all cursor-pointer ${active ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 opacity-40'}`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-xl font-bold text-white">{yoga.name}</h4>
                                                {active && <span className="text-xs bg-[#d4af37] text-black px-2 py-1 rounded-full font-black uppercase tracking-tighter">Active</span>}
                                            </div>
                                            <p className="text-sm italic opacity-80 leading-snug">{yoga.description}</p>
                                            {active && yoga.details && <p className="text-[10px] text-[#d4af37] mt-4 uppercase font-black tracking-widest">Click for deep analysis ↗</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Yoga Details Modal */}
                    {selectedYoga && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] overflow-y-auto p-4 md:p-12 flex justify-center">
                            <div className="w-full max-w-4xl bg-[#0f172a] rounded-[3rem] border border-[#d4af37]/30 shadow-2xl p-10 relative h-fit">
                                <button
                                    onClick={() => setSelectedYoga(null)}
                                    className="absolute top-8 right-8 text-white/40 hover:text-white text-2xl transition-colors"
                                >
                                    ✕
                                </button>

                                <div className="space-y-10">
                                    <header className="border-b border-white/10 pb-8">
                                        <h2 className="text-4xl font-black text-[#d4af37] italic mb-4">{selectedYoga.name}</h2>
                                        <p className="text-xl text-[#cbd5e1] leading-relaxed italic">{selectedYoga.description}</p>
                                    </header>

                                    {selectedYoga.id === 'budh_aditya' && (
                                        <div className="space-y-12">
                                            {/* Dynamic House Check */}
                                            <section className="bg-[#d4af37]/5 p-8 rounded-3xl border border-[#d4af37]/20">
                                                <h4 className="text-[#d4af37] uppercase font-black tracking-[0.2em] mb-4 text-sm text-center">Specific House Impact</h4>
                                                {(() => {
                                                    const hNum = getYogaHouse('budh_aditya');
                                                    const houseKey = `${hNum}${hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} house`;
                                                    const impact = selectedYoga.details.results_in_different_houses[houseKey];
                                                    return (
                                                        <div className="text-center">
                                                            <p className="text-white text-2xl font-bold mb-2">Formed in your {hNum}{hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} House</p>
                                                            <p className="text-xl italic text-amber-100/90">This {impact || "formation brings powerful financial and intellectual clarity."}</p>
                                                        </div>
                                                    );
                                                })()}
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Formation Conditions</h4>
                                                    <ul className="space-y-3">
                                                        {selectedYoga.details.conditions.map((c, i) => (
                                                            <li key={i} className="text-sm opacity-80 pl-4 border-l-2 border-[#d4af37]/30 leading-relaxed">{c}</li>
                                                        ))}
                                                    </ul>
                                                </section>
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Positive Effects</h4>
                                                    <ul className="space-y-3">
                                                        {selectedYoga.details.effects.map((e, i) => (
                                                            <li key={i} className="text-sm opacity-80 flex items-start gap-3">
                                                                <span className="text-[#d4af37]">✧</span>
                                                                {e}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            </div>

                                            <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
                                                <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Nullification Warning</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details.nullification.map((n, i) => (
                                                        <li key={i} className="text-sm opacity-80 text-center italic">{n}</li>
                                                    ))}
                                                </ul>
                                            </section>

                                            <section className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20">
                                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Amplification Remedies</h4>
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {selectedYoga.details.remedies.map((r, i) => (
                                                        <span key={i} className="bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20">{r}</span>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {selectedYoga.id === 'gajkesari' && (
                                        <div className="space-y-12">
                                            <section className="bg-[#d4af37]/5 p-8 rounded-3xl border border-[#d4af37]/20">
                                                <h4 className="text-[#d4af37] uppercase font-black tracking-[0.2em] mb-4 text-sm text-center">Specific House Impact</h4>
                                                {(() => {
                                                    const hNum = getPlanetHouse('Jupiter');
                                                    const houseKey = `${hNum}${hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} house`;
                                                    const impact = selectedYoga.details.house_results[houseKey];
                                                    return (
                                                        <div className="text-center">
                                                            <p className="text-white text-2xl font-bold mb-2">Formed in your {hNum}{hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} House</p>
                                                            <p className="text-xl italic text-amber-100/90">{impact || "This placement ensures divine protection and expansion of assets."}</p>
                                                        </div>
                                                    );
                                                })()}
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                    <p className="text-sm opacity-80 italic leading-relaxed">{selectedYoga.details.formation}</p>
                                                </section>
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Prosperity Effects</h4>
                                                    <ul className="space-y-3">
                                                        {selectedYoga.details.effects.map((e, i) => (
                                                            <li key={i} className="text-sm opacity-80 flex items-start gap-3">
                                                                <span className="text-[#d4af37]">✧</span>
                                                                {e}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            </div>

                                            <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
                                                <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Negative Combinations</h4>
                                                <ul className="space-y-2">
                                                    {selectedYoga.details.negative_combinations.map((n, i) => (
                                                        <li key={i} className="text-sm opacity-60 text-center italic">{n}</li>
                                                    ))}
                                                </ul>
                                            </section>

                                            <section className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20">
                                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Yoga Amplification</h4>
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {selectedYoga.details.remedies.map((r, i) => (
                                                        <span key={i} className="bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20">{r}</span>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {selectedYoga.id === 'raj_yoga' && (
                                        <div className="space-y-12">
                                            <section className="bg-gradient-to-br from-[#d4af37]/20 to-transparent p-10 rounded-[3rem] border border-[#d4af37]/30 text-center">
                                                <h4 className="text-[#d4af37] uppercase font-black tracking-[0.3em] mb-4 text-xs">Royal Authority</h4>
                                                <p className="text-3xl font-black text-white italic mb-4">Emperor's Presence Detected</p>
                                                <p className="text-lg opacity-80 max-w-2xl mx-auto">Your chart possesses the alignment of Kendra and Trikona lords, the hallmark of leadership and generational fame.</p>
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                    <p className="text-sm opacity-80 leading-relaxed italic border-l-2 border-[#d4af37]/20 pl-4">{selectedYoga.details.formation}</p>

                                                    <div className="mt-8">
                                                        <h5 className="text-white text-xs font-bold uppercase mb-4 tracking-tighter">Special Rajyoga Variants</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedYoga.details.special_types.map((t, i) => (
                                                                <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-md text-white/60">{t}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </section>
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Success Indicators</h4>
                                                    <ul className="space-y-4">
                                                        {selectedYoga.details.effects.map((e, i) => (
                                                            <li key={i} className="text-sm opacity-80 flex items-start gap-4">
                                                                <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-1.5 shadow-[0_0_10px_#d4af37]"></div>
                                                                {e}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            </div>

                                            <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
                                                <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-6 text-center">Factors of Nullification</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedYoga.details.nullification.map((n, i) => (
                                                        <div key={i} className="text-[11px] opacity-60 flex items-center gap-2">
                                                            <span className="text-red-500">✕</span> {n}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20 text-center">
                                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-6">Amplify Royal Power</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {selectedYoga.details.remedies.map((r, i) => (
                                                        <div key={i} className="bg-white/5 p-4 rounded-xl text-xs italic opacity-80">{r}</div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {selectedYoga.id === 'dhan_yoga' && (
                                        <div className="space-y-12">
                                            <section className="bg-[#d4af37]/5 p-10 rounded-[3rem] border border-[#d4af37]/30 text-center">
                                                <h4 className="text-[#d4af37] uppercase font-black tracking-[0.3em] mb-4 text-xs">Wealth Abundance</h4>
                                                <p className="text-3xl font-black text-white italic mb-4">Financial Flow Activation</p>
                                                <p className="text-lg opacity-80 max-w-2xl mx-auto">Your chart shows a powerful synergy between the houses of resources (2nd), intelligence (5th), fortune (9th), and gains (11th).</p>
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Formation Principles</h4>
                                                    <p className="text-sm opacity-80 leading-relaxed italic border-l-2 border-[#d4af37]/20 pl-4">{selectedYoga.details.formation}</p>

                                                    <div className="mt-8 space-y-4">
                                                        <h5 className="text-white text-xs font-bold uppercase mb-4 tracking-tighter">Core Rules</h5>
                                                        {selectedYoga.details.logic.map((l, i) => (
                                                            <div key={i} className="text-[11px] bg-white/5 border border-white/10 p-3 rounded-lg text-white/60">
                                                                • {l}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Legendary Wealth Combinations</h4>
                                                    <div className="space-y-6">
                                                        {selectedYoga.details.special_combinations.map((c, i) => (
                                                            <div key={i} className="bg-gradient-to-r from-white/5 to-transparent p-5 rounded-2xl border-l-2 border-[#d4af37]">
                                                                <h5 className="text-white font-bold text-sm mb-2">{c.title}</h5>
                                                                <p className="text-xs italic opacity-70 leading-relaxed">{c.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>

                                            <section className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20 text-center">
                                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-4">Prosperity Insight</h4>
                                                <p className="text-sm italic opacity-80">"When the 2nd (Wealth) and 11th (Gains) lords connect with the 9th (Luck) lord, wealth is achieved through divine grace and minimal struggle."</p>
                                            </section>
                                        </div>
                                    )}

                                    {selectedYoga.id === 'laxmi_yoga' && (
                                        <div className="space-y-12">
                                            <section className="bg-[#d4af37]/5 p-8 rounded-3xl border border-[#d4af37]/20">
                                                <h4 className="text-[#d4af37] uppercase font-black tracking-[0.2em] mb-4 text-sm text-center">Fortune Indicator</h4>
                                                {(() => {
                                                    const h9Sign = houses["9"]?.sign_name;
                                                    const l9 = SIGN_LORDS[h9Sign];
                                                    const pos9 = getPlanetHouse(l9);
                                                    return (
                                                        <div className="text-center">
                                                            <p className="text-white text-2xl font-bold mb-2">Lord of 9th ({l9}) in your {pos9}{pos9 === 1 ? 'st' : pos9 === 2 ? 'nd' : pos9 === 3 ? 'rd' : 'th'} House</p>
                                                            <p className="text-xl italic text-amber-100/90">This position anchors the Laxmi Yoga, ensuring that fortune flows through your life with divine support.</p>
                                                        </div>
                                                    );
                                                })()}
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                    <p className="text-sm opacity-80 italic leading-relaxed">{selectedYoga.details.formation}</p>
                                                </section>
                                                <section>
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Wealth & Life Effects</h4>
                                                    <ul className="space-y-3">
                                                        {selectedYoga.details.effects.map((e, i) => (
                                                            <li key={i} className="text-sm opacity-80 flex items-start gap-3">
                                                                <span className="text-[#d4af37]">✧</span>
                                                                {e}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>
                                            </div>

                                            <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
                                                <h4 className="text-red-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Partial & Negative Combinations</h4>
                                                <ul className="space-y-2">
                                                    {selectedYoga.details.negative_combinations.map((n, i) => (
                                                        <li key={i} className="text-sm opacity-60 text-center italic">{n}</li>
                                                    ))}
                                                </ul>
                                            </section>

                                            <section className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/20 text-center">
                                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-6">Amplify Prosperity</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {selectedYoga.details.remedies.map((r, i) => (
                                                        <div key={i} className="bg-white/5 p-4 rounded-xl text-xs italic opacity-80">{r}</div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {selectedYoga.id === 'planet_detail' && (
                                        <div className="space-y-12">
                                            <section className="border-b border-white/10 pb-10">
                                                <p className="text-sm opacity-60 mb-8 leading-relaxed italic">{selectedYoga.details.intro}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(selectedYoga.details.effects_on_wealth).map(([key, val], i) => (
                                                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                            <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest mb-1">{key}</p>
                                                            <p className="text-white text-sm font-medium">{val}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <section className="space-y-6">
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest">Strength Analysis</h4>
                                                    <div className="space-y-4">
                                                        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                                                            <p className="text-emerald-400 text-[10px] font-black uppercase mb-2">When Strong</p>
                                                            <p className="text-xs text-emerald-100/80 leading-relaxed italic">{selectedYoga.details.strong_vs_weak.Strong}</p>
                                                        </div>
                                                        <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20">
                                                            <p className="text-red-400 text-[10px] font-black uppercase mb-2">When Weak</p>
                                                            <p className="text-xs text-red-100/80 leading-relaxed italic">{selectedYoga.details.strong_vs_weak.Weak}</p>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section className="space-y-6">
                                                    <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest">Wealth Creation Areas</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedYoga.details.areas_for_gaining_wealth.map((area, i) => (
                                                            <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-white/80">{area}</span>
                                                        ))}
                                                    </div>

                                                    <div className="pt-6">
                                                        <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-widest mb-6">Financial Remedies</h4>
                                                        <ul className="space-y-3">
                                                            {selectedYoga.details.remedies.map((r, i) => (
                                                                <li key={i} className="text-sm opacity-80 flex items-center gap-3">
                                                                    <span className="text-[#d4af37] text-xs">◆</span>
                                                                    {r}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="text-center py-12">
                        <button
                            onClick={() => window.close()}
                            className="px-12 py-4 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition-all text-[#d4af37] font-black uppercase tracking-[0.5em] text-xs shadow-2xl"
                        >
                            Return to Workstation
                        </button>
                    </div>
                </div>
            </div>
        );
}

