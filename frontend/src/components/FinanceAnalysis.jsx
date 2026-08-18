import React, { useState, useEffect } from 'react';
import { FINANCE_HOUSE_INTERPRETATIONS, FINANCE_YOGAS, SIGN_LORDS } from '../data/financeData';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';
import { FINANCE_QUESTIONS_LIST } from '../data/financeQuestionsData';

export default function FinanceAnalysis() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYoga, setSelectedYoga] = useState(null);
    const [questionSearch, setQuestionSearch] = useState('');

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="p-10 text-center italic text-[#881337] bg-[#fff1f2] min-h-screen">Loading Financial Analysis...</div>;
    if (!data) return <div className="p-10 text-center italic text-red-600 bg-[#fff1f2] min-h-screen">No data found. Please generate a report.</div>;

    const houses = data.charts?.houses || {};
    const planets = data.planet_positions || [];

    const getPlanetHouse = (p) => planets.find(item => item.planet === p)?.house;

    // Calculate House Lords map
    const lords = {};
    for (let h = 1; h <= 12; h++) {
        const sign = houses[h]?.sign_name;
        lords[h] = SIGN_LORDS[sign] || null;
    }

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
            return [0, 3, 6, 9].includes(diff);
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
            const rules = [
                { planet: 'Mars', signs: ['Aries', 'Scorpio', 'Capricorn'] },
                { planet: 'Mercury', signs: ['Gemini', 'Virgo'] },
                { planet: 'Jupiter', signs: ['Sagittarius', 'Pisces', 'Cancer'] },
                { planet: 'Venus', signs: ['Taurus', 'Libra', 'Pisces'] },
                { planet: 'Saturn', signs: ['Capricorn', 'Aquarius', 'Libra'] }
            ];
            return rules.some(r => {
                const hNum = getPlanetHouse(r.planet);
                if (!hNum || ![1, 4, 7, 10].includes(hNum)) return false;
                const sign = houses[hNum]?.sign_name;
                return r.signs.includes(sign);
            });
        }
        if (yogaId === 'raj_yoga') {
            const kendraHouses = [1, 4, 7, 10];
            const trikonaHouses = [1, 5, 9];
            const kendraLords = kendraHouses.map(h => SIGN_LORDS[houses[h]?.sign_name]);
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

            if (pos1 && pos9 && isKendraTrikona(pos1) && isKendraTrikona(pos9) && !isDusthana(pos1)) return true;
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

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-[#fecdd3] pb-12">
                    <div className="text-6xl mb-4">💰</div>
                    <h1 className="text-5xl font-black text-[#881337] italic tracking-tighter">Finance & Prosperity Analysis</h1>
                    <p className="text-[#be123c] uppercase tracking-[0.4em] text-sm font-black">Lagna Chart Diagnostic • Wealth Potential</p>
                </div>

                {/* 2nd Lord Placement Section */}
                {pos2 && BPHS_BHAVA_LORDS_RULES.SecondLord[pos2] && (
                    <div className="bg-white rounded-[3rem] border border-[#fecdd3] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="text-5xl text-[#be123c]">🏛️</div>
                            <div className="flex-1 space-y-2">
                                <span className="px-3 py-1 bg-[#ffe4e6] text-[#be123c] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#fecdd3]">
                                    Second Lord House Placement (BPHS Ch. 24)
                                </span>
                                <h4 className="text-2xl font-black text-[#881337] italic">
                                    Wealth Lord ({lord2}) in the {pos2 === 1 ? "1st" : pos2 === 2 ? "2nd" : pos2 === 3 ? "3rd" : pos2 + "th"} House
                                </h4>
                                <p className="text-[18px] text-[#1e293b] leading-relaxed italic">
                                    "{BPHS_BHAVA_LORDS_RULES.SecondLord[pos2].result}"
                                </p>
                                <div className="text-[18px] text-[#475569] font-serif border-t border-[#fecdd3] pt-2 italic">
                                    <span className="font-bold block text-[#881337] not-italic mb-1">Sastra Notes:</span>
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
                            <div key={hNum} className="bg-white rounded-[3rem] border border-[#fecdd3] p-8 shadow-lg relative overflow-hidden group">
                                <div className="absolute -right-8 -top-8 text-[12rem] text-rose-900/5 font-serif group-hover:scale-110 transition-transform">{hNum}</div>
                                <h3 className="text-2xl font-black text-[#be123c] mb-2">{hInfo.title}</h3>
                                <p className="text-[20px] text-[#881337] mb-6 font-sans uppercase tracking-widest font-bold">Sign: {signName}</p>
                                <p className="text-[20px] italic mb-8 border-l-4 border-[#e11d48] pl-4 text-[#1e293b]">{hInfo.description}</p>

                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-[20px] font-black uppercase text-[#881337] tracking-widest">Planetary Influences</h4>
                                    {housePlanets.length > 0 ? (
                                        housePlanets.map((p, i) => {
                                            const pName = typeof p === 'object' ? p.name : p;
                                            const interpretation = hInfo.placements[pName];
                                            const isObject = typeof interpretation === 'object' && interpretation !== null;

                                            return (
                                                <div key={i} className="bg-[#fff1f2] p-5 rounded-2xl border border-[#fecdd3] hover:border-[#e11d48]/40 transition-all group/planet">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl">✨</span>
                                                            <span className="font-bold text-[#881337] text-[20px]">{pName}</span>
                                                        </div>
                                                        {isObject && <span className="text-[16px] text-[#be123c] font-bold uppercase tracking-tighter opacity-0 group-hover/planet:opacity-100 transition-opacity">Deep Analysis available</span>}
                                                    </div>

                                                    {!isObject ? (
                                                        <p className="text-[20px] italic text-[#1e293b] leading-relaxed">{interpretation || "This planet's presence brings specialized energy to your financial sector."}</p>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <p className="text-[20px] italic text-[#881337] leading-relaxed">{interpretation.intro}</p>

                                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                                {Object.entries(interpretation.effects_on_wealth).slice(0, 2).map(([key, val], idx) => (
                                                                    <div key={idx} className="bg-white p-2 rounded-lg border border-[#fecdd3]">
                                                                        <p className="text-[16px] font-bold text-[#be123c] uppercase">{key}</p>
                                                                        <p className="text-[16px] text-[#1e293b]">{val}</p>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <button
                                                                onClick={() => setSelectedYoga({
                                                                    id: 'planet_detail',
                                                                    name: `${pName} in ${hInfo.title}`,
                                                                    details: interpretation
                                                                })}
                                                                className="w-full mt-4 py-2 bg-[#ffe4e6] hover:bg-[#fecdd3] border border-[#fecdd3] rounded-xl text-[12px] font-black text-[#881337] uppercase tracking-[0.2em] transition-all"
                                                            >
                                                                View Full Diagnostic
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[20px] italic text-[#475569]">No planets occupy this house. Its results are governed by the Lord of {signName}.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Yogas Section */}
                <div className="bg-white rounded-[4rem] border border-[#fecdd3] p-12 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fecdd3]"></div>
                            <h2 className="text-3xl font-black text-[#881337] italic">Special Wealth Yogas</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fecdd3]"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {FINANCE_YOGAS.map(yoga => {
                                const active = hasYoga(yoga.id);
                                return (
                                    <div
                                        key={yoga.id}
                                        onClick={() => active && yoga.details && setSelectedYoga(yoga)}
                                        className={`p-6 rounded-3xl border transition-all cursor-pointer ${active ? 'bg-[#fff1f2] border-[#e11d48] shadow-md' : 'bg-white border-[#fecdd3] opacity-60'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-[20px] font-bold text-[#881337]">{yoga.name}</h4>
                                            {active && <span className="text-xs bg-[#e11d48] text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">Active</span>}
                                        </div>
                                        <p className="text-[20px] text-[#475569] italic leading-snug">{yoga.description}</p>
                                        {active && yoga.id === 'panch_mahapurush' && (() => {
                                            const rules = [
                                                { name: 'Ruchaka', planet: 'Mars', signs: ['Aries', 'Scorpio', 'Capricorn'] },
                                                { name: 'Bhadra', planet: 'Mercury', signs: ['Gemini', 'Virgo'] },
                                                { name: 'Hamsa', planet: 'Jupiter', signs: ['Sagittarius', 'Pisces', 'Cancer'] },
                                                { name: 'Malavya', planet: 'Venus', signs: ['Taurus', 'Libra', 'Pisces'] },
                                                { name: 'Sasa', planet: 'Saturn', signs: ['Capricorn', 'Aquarius', 'Libra'] }
                                            ];
                                            const activeYogas = rules.filter(r => {
                                                const hNum = getPlanetHouse(r.planet);
                                                if (!hNum || ![1, 4, 7, 10].includes(hNum)) return false;
                                                return r.signs.includes(houses[hNum]?.sign_name);
                                            });
                                            return (
                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                    {activeYogas.map((ay, i) => (
                                                        <span key={i} className="bg-[#ffe4e6] border border-[#fecdd3] text-[#881337] text-[18px] font-bold px-2 py-0.5 rounded-md">
                                                            ✨ {ay.name} Yoga
                                                        </span>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                        {active && yoga.details && <p className="text-[16px] text-[#be123c] mt-4 uppercase font-black tracking-widest">Click for deep analysis ↗</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Yoga Details Modal */}
                {selectedYoga && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] overflow-y-auto p-4 md:p-12 flex justify-center">
                        <div className="w-full max-w-4xl bg-white rounded-[3rem] border border-[#fecdd3] shadow-2xl p-10 relative h-fit text-[#1e293b]">
                            <button
                                onClick={() => setSelectedYoga(null)}
                                className="absolute top-8 right-8 text-[#881337] hover:text-[#be123c] text-2xl font-bold transition-colors"
                            >
                                ✕
                            </button>

                            <div className="space-y-10">
                                <header className="border-b border-[#fecdd3] pb-8">
                                    <h2 className="text-4xl font-black text-[#881337] italic mb-4">{selectedYoga.name}</h2>
                                    <p className="text-xl text-[#1e293b] leading-relaxed italic">{selectedYoga.description}</p>
                                </header>

                                {selectedYoga.id === 'budh_aditya' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.2em] mb-4 text-[18px] text-center">Specific House Impact</h4>
                                            {(() => {
                                                const hNum = getYogaHouse('budh_aditya');
                                                const houseKey = `${hNum}${hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} house`;
                                                const impact = selectedYoga.details.results_in_different_houses[houseKey];
                                                return (
                                                    <div className="text-center">
                                                        <p className="text-[#881337] text-2xl font-bold mb-2">Formed in your {hNum}{hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} House</p>
                                                        <p className="text-xl italic text-[#1e293b]">{impact || "This formation brings powerful financial and intellectual clarity."}</p>
                                                    </div>
                                                );
                                            })()}
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Formation Conditions</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details.conditions.map((c, i) => (
                                                        <li key={i} className="text-sm text-[#1e293b] pl-4 border-l-2 border-[#e11d48] leading-relaxed">{c}</li>
                                                    ))}
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Positive Effects</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details.effects.map((e, i) => (
                                                        <li key={i} className="text-sm text-[#1e293b] flex items-start gap-3">
                                                            <span className="text-[#be123c]">✧</span>
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <section className="bg-red-50 p-8 rounded-3xl border border-red-200">
                                            <h4 className="text-red-700 font-black uppercase text-xs tracking-widest mb-4 text-center">Nullification Warning</h4>
                                            <ul className="space-y-3">
                                                {selectedYoga.details.nullification.map((n, i) => (
                                                    <li key={i} className="text-sm text-red-900 text-center italic">{n}</li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200">
                                            <h4 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-4 text-center">Amplification Remedies</h4>
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {selectedYoga.details.remedies.map((r, i) => (
                                                    <span key={i} className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full text-xs font-bold border border-emerald-300">{r}</span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'panch_mahapurush' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.2em] mb-6 text-sm text-center">Activated Mahapurush Yogas in Your Chart</h4>
                                            {(() => {
                                                const rules = [
                                                    { name: 'Ruchaka Yoga', planet: 'Mars', signs: ['Aries', 'Scorpio', 'Capricorn'] },
                                                    { name: 'Bhadra Yoga', planet: 'Mercury', signs: ['Gemini', 'Virgo'] },
                                                    { name: 'Hamsa Yoga', planet: 'Jupiter', signs: ['Sagittarius', 'Pisces', 'Cancer'] },
                                                    { name: 'Malavya Yoga', planet: 'Venus', signs: ['Taurus', 'Libra', 'Pisces'] },
                                                    { name: 'Sasa Yoga', planet: 'Saturn', signs: ['Capricorn', 'Aquarius', 'Libra'] }
                                                ];
                                                const activated = rules.filter(r => {
                                                    const hNum = getPlanetHouse(r.planet);
                                                    if (!hNum || ![1, 4, 7, 10].includes(hNum)) return false;
                                                    const sign = houses[hNum]?.sign_name;
                                                    return r.signs.includes(sign);
                                                });

                                                if (activated.length === 0) {
                                                    return (
                                                        <p className="text-center text-sm italic text-[#881337]">No Panch Mahapurush Yoga is active in the Kendra houses of your Lagna chart.</p>
                                                    );
                                                }

                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {activated.map((y, idx) => {
                                                            const hNum = getPlanetHouse(y.planet);
                                                            const sign = houses[hNum]?.sign_name;
                                                            const details = selectedYoga.details?.yogas?.[y.name];
                                                            return (
                                                                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#fecdd3] shadow-sm flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-[20px] font-bold text-[#881337]">{y.name}</span>
                                                                            <span className="bg-[#e11d48] text-white text-[18px] font-black uppercase px-2.5 py-0.5 rounded-full">Active</span>
                                                                        </div>
                                                                        <p className="text-[18px] text-[#be123c] font-bold mb-3">
                                                                            Formed by <span className="underline">{y.planet}</span> in <span className="underline">{sign}</span> ({hNum}{hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} House)
                                                                        </p>
                                                                        <p className="text-[18px] italic text-[#1e293b] leading-relaxed">{details?.meaning}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-[18px] tracking-widest mb-6">Formation Principles</h4>
                                                <p className="text-[18px] text-[#1e293b] italic leading-relaxed pl-4 border-l-2 border-[#e11d48]">{selectedYoga.details?.formation}</p>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-[18px] tracking-widest mb-6">Key Stature & Wealth Blessings</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details?.effects?.map((e, i) => (
                                                        <li key={i} className="text-[18px] text-[#1e293b] flex items-start gap-3">
                                                            <span className="text-[#be123c]">✧</span>
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <section className="bg-red-50 p-8 rounded-3xl border border-red-200">
                                            <h4 className="text-red-700 font-black uppercase text-[18px] tracking-widest mb-4 text-center">Factors of Cancellation or Weakening</h4>
                                            <ul className="space-y-3">
                                                {selectedYoga.details?.nullification?.map((n, i) => (
                                                    <li key={i} className="text-[18px] text-red-900 text-center italic">{n}</li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200">
                                            <h4 className="text-emerald-800 font-black uppercase text-[18px] tracking-widest mb-4 text-center">Amplification & Dharmic Remedies</h4>
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {selectedYoga.details?.remedies?.map((r, i) => (
                                                    <span key={i} className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full text-[18px] font-bold border border-emerald-300">{r}</span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'gajkesari' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.2em] mb-4 text-sm text-center">Specific House Impact</h4>
                                            {(() => {
                                                const hNum = getPlanetHouse('Jupiter');
                                                const houseKey = `${hNum}${hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} house`;
                                                const impact = selectedYoga.details.house_results[houseKey];
                                                return (
                                                    <div className="text-center">
                                                        <p className="text-[#881337] text-2xl font-bold mb-2">Formed in your {hNum}{hNum === 1 ? 'st' : hNum === 2 ? 'nd' : hNum === 3 ? 'rd' : 'th'} House</p>
                                                        <p className="text-xl italic text-[#1e293b]">{impact || "This placement ensures divine protection and expansion of assets."}</p>
                                                    </div>
                                                );
                                            })()}
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                <p className="text-sm text-[#1e293b] italic leading-relaxed">{selectedYoga.details.formation}</p>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Prosperity Effects</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details.effects.map((e, i) => (
                                                        <li key={i} className="text-sm text-[#1e293b] flex items-start gap-3">
                                                            <span className="text-[#be123c]">✧</span>
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <section className="bg-red-50 p-8 rounded-3xl border border-red-200">
                                            <h4 className="text-red-700 font-black uppercase text-xs tracking-widest mb-4 text-center">Negative Combinations</h4>
                                            <ul className="space-y-2">
                                                {selectedYoga.details.negative_combinations.map((n, i) => (
                                                    <li key={i} className="text-sm text-red-900 text-center italic">{n}</li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200">
                                            <h4 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-4 text-center">Yoga Amplification</h4>
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {selectedYoga.details.remedies.map((r, i) => (
                                                    <span key={i} className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full text-xs font-bold border border-emerald-300">{r}</span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'raj_yoga' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-10 rounded-[3rem] border border-[#fecdd3] text-center">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.3em] mb-4 text-xs">Royal Authority</h4>
                                            <p className="text-3xl font-black text-[#881337] italic mb-4">Emperor's Presence Detected</p>
                                            <p className="text-lg text-[#1e293b] max-w-2xl mx-auto">Your chart possesses the alignment of Kendra and Trikona lords, the hallmark of leadership and generational fame.</p>
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                <p className="text-sm text-[#1e293b] leading-relaxed italic border-l-2 border-[#e11d48] pl-4">{selectedYoga.details.formation}</p>

                                                <div className="mt-8">
                                                    <h5 className="text-[#881337] text-xs font-bold uppercase mb-4 tracking-tighter">Special Rajyoga Variants</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedYoga.details.special_types.map((t, i) => (
                                                            <span key={i} className="text-[11px] bg-[#fff1f2] border border-[#fecdd3] px-3 py-1 rounded-md text-[#881337] font-bold">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Success Indicators</h4>
                                                <ul className="space-y-4">
                                                    {selectedYoga.details.effects.map((e, i) => (
                                                        <li key={i} className="text-sm text-[#1e293b] flex items-start gap-4">
                                                            <div className="w-2 h-2 rounded-full bg-[#e11d48] mt-1.5"></div>
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <section className="bg-red-50 p-8 rounded-3xl border border-red-200">
                                            <h4 className="text-red-700 font-black uppercase text-xs tracking-widest mb-6 text-center">Factors of Nullification</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedYoga.details.nullification.map((n, i) => (
                                                    <div key={i} className="text-[12px] text-red-900 flex items-center gap-2">
                                                        <span className="text-red-600 font-bold">✕</span> {n}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center">
                                            <h4 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-6">Amplify Royal Power</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {selectedYoga.details.remedies.map((r, i) => (
                                                    <div key={i} className="bg-white p-4 rounded-xl text-xs italic text-emerald-900 border border-emerald-200 font-semibold">{r}</div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'dhan_yoga' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-10 rounded-[3rem] border border-[#fecdd3] text-center">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.3em] mb-4 text-xs">Wealth Abundance</h4>
                                            <p className="text-3xl font-black text-[#881337] italic mb-4">Financial Flow Activation</p>
                                            <p className="text-lg text-[#1e293b] max-w-2xl mx-auto">Your chart shows a powerful synergy between the houses of resources (2nd), intelligence (5th), fortune (9th), and gains (11th).</p>
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Formation Principles</h4>
                                                <p className="text-sm text-[#1e293b] leading-relaxed italic border-l-2 border-[#e11d48] pl-4">{selectedYoga.details.formation}</p>

                                                <div className="mt-8 space-y-4">
                                                    <h5 className="text-[#881337] text-xs font-bold uppercase mb-4 tracking-tighter">Core Rules</h5>
                                                    {selectedYoga.details.logic.map((l, i) => (
                                                        <div key={i} className="text-[12px] bg-[#fff1f2] border border-[#fecdd3] p-3 rounded-lg text-[#1e293b] font-medium">
                                                            • {l}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Legendary Wealth Combinations</h4>
                                                <div className="space-y-6">
                                                    {selectedYoga.details.special_combinations.map((c, i) => (
                                                        <div key={i} className="bg-[#fff1f2] p-5 rounded-2xl border-l-4 border-[#e11d48]">
                                                            <h5 className="text-[#881337] font-bold text-sm mb-2">{c.title}</h5>
                                                            <p className="text-xs italic text-[#1e293b] leading-relaxed">{c.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center">
                                            <h4 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-4">Prosperity Insight</h4>
                                            <p className="text-sm italic text-emerald-950 font-medium">"When the 2nd (Wealth) and 11th (Gains) lords connect with the 9th (Luck) lord, wealth is achieved through divine grace and minimal struggle."</p>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'laxmi_yoga' && (
                                    <div className="space-y-12">
                                        <section className="bg-[#fff1f2] p-8 rounded-3xl border border-[#fecdd3]">
                                            <h4 className="text-[#be123c] uppercase font-black tracking-[0.2em] mb-4 text-sm text-center">Fortune Indicator</h4>
                                            {(() => {
                                                const h9Sign = houses["9"]?.sign_name;
                                                const l9 = SIGN_LORDS[h9Sign];
                                                const pos9 = getPlanetHouse(l9);
                                                return (
                                                    <div className="text-center">
                                                        <p className="text-[#881337] text-2xl font-bold mb-2">Lord of 9th ({l9}) in your {pos9}{pos9 === 1 ? 'st' : pos9 === 2 ? 'nd' : pos9 === 3 ? 'rd' : 'th'} House</p>
                                                        <p className="text-xl italic text-[#1e293b]">This position anchors the Laxmi Yoga, ensuring that fortune flows through your life with divine support.</p>
                                                    </div>
                                                );
                                            })()}
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Formation Logic</h4>
                                                <p className="text-sm text-[#1e293b] italic leading-relaxed">{selectedYoga.details.formation}</p>
                                            </section>
                                            <section>
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Wealth & Life Effects</h4>
                                                <ul className="space-y-3">
                                                    {selectedYoga.details.effects.map((e, i) => (
                                                        <li key={i} className="text-sm text-[#1e293b] flex items-start gap-3">
                                                            <span className="text-[#be123c]">✧</span>
                                                            {e}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>

                                        <section className="bg-red-50 p-8 rounded-3xl border border-red-200">
                                            <h4 className="text-red-700 font-black uppercase text-xs tracking-widest mb-4 text-center">Partial & Negative Combinations</h4>
                                            <ul className="space-y-2">
                                                {selectedYoga.details.negative_combinations.map((n, i) => (
                                                    <li key={i} className="text-sm text-red-900 text-center italic">{n}</li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center">
                                            <h4 className="text-emerald-800 font-black uppercase text-xs tracking-widest mb-6">Amplify Prosperity</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {selectedYoga.details.remedies.map((r, i) => (
                                                    <div key={i} className="bg-white p-4 rounded-xl text-xs italic text-emerald-900 border border-emerald-200 font-semibold">{r}</div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {selectedYoga.id === 'planet_detail' && (
                                    <div className="space-y-12">
                                        <section className="border-b border-[#fecdd3] pb-10">
                                            <p className="text-sm text-[#1e293b] mb-8 leading-relaxed italic">{selectedYoga.details.intro}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(selectedYoga.details.effects_on_wealth).map(([key, val], i) => (
                                                    <div key={i} className="bg-[#fff1f2] p-4 rounded-2xl border border-[#fecdd3]">
                                                        <p className="text-[#be123c] text-[12px] font-black uppercase tracking-widest mb-1">{key}</p>
                                                        <p className="text-[#1e293b] text-sm font-medium">{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <section className="space-y-6">
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest">Strength Analysis</h4>
                                                <div className="space-y-4">
                                                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
                                                        <p className="text-emerald-800 text-[12px] font-black uppercase mb-2">When Strong</p>
                                                        <p className="text-xs text-emerald-950 leading-relaxed italic">{selectedYoga.details.strong_vs_weak.Strong}</p>
                                                    </div>
                                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                                                        <p className="text-red-800 text-[12px] font-black uppercase mb-2">When Weak</p>
                                                        <p className="text-xs text-red-950 leading-relaxed italic">{selectedYoga.details.strong_vs_weak.Weak}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section className="space-y-6">
                                                <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest">Wealth Creation Areas</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedYoga.details.areas_for_gaining_wealth.map((area, i) => (
                                                        <span key={i} className="bg-[#fff1f2] border border-[#fecdd3] px-4 py-2 rounded-full text-xs text-[#881337] font-bold">{area}</span>
                                                    ))}
                                                </div>

                                                <div className="pt-6">
                                                    <h4 className="text-[#be123c] font-black uppercase text-xs tracking-widest mb-6">Financial Remedies</h4>
                                                    <ul className="space-y-3">
                                                        {selectedYoga.details.remedies.map((r, i) => (
                                                            <li key={i} className="text-sm text-[#1e293b] flex items-center gap-3">
                                                                <span className="text-[#be123c] text-xs">◆</span>
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

                {/* 20 Financial Questions Diagnostic Table */}
                <div className="bg-white rounded-[4rem] border border-[#fecdd3] p-8 md:p-12 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-[#fecdd3]">
                            <div>
                                <h2 className="text-3xl font-black text-[#881337] italic">Lagna Chart Financial Diagnostic Guide</h2>
                                <p className="text-[#be123c] uppercase tracking-[0.2em] text-xs font-black mt-1">20 Core Financial Queries • Evaluated on Native's Chart</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Search financial question (e.g. income, property, inheritance)..."
                                value={questionSearch}
                                onChange={(e) => setQuestionSearch(e.target.value)}
                                className="px-5 py-3 rounded-full border border-[#fecdd3] text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d48] w-full md:w-96 bg-[#fff1f2] text-[#881337] font-semibold"
                            />
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#fff1f2] border-b border-[#fecdd3] text-[#881337] uppercase font-black text-[12px] tracking-wider">
                                        <th className="p-4 w-12 text-center">#</th>
                                        <th className="p-4 w-1/4">Financial Question</th>
                                        <th className="p-4 w-1/3">Chart Diagnostic Result</th>
                                        <th className="p-4">Astrological Analysis Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#fecdd3]/50 text-sm">
                                    {FINANCE_QUESTIONS_LIST
                                        .filter(q => q.question.toLowerCase().includes(questionSearch.toLowerCase()))
                                        .map((q, idx) => {
                                            const dashaData = data.dasha?.list || data.dasha || [];
                                            const evaluation = q.evaluate(houses, planets, lords, dashaData);
                                            return (
                                                <tr key={q.id} className="hover:bg-[#fff1f2]/40 transition-colors">
                                                    <td className="p-4 font-black text-[#be123c] text-center">{idx + 1}</td>
                                                    <td className="p-4">
                                                        <p className="font-bold text-[#881337] text-[18px] leading-snug">{q.question}</p>
                                                        <div className="flex gap-1.5 flex-wrap mt-2">
                                                            {q.housesNeeded.map(h => (
                                                                <span key={h} className="bg-[#ffe4e6] text-[#be123c] border border-[#fecdd3] text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                                                                    House {h}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 bg-[#fff1f2]/20">
                                                        <p className="font-bold text-[#881337] text-[16px] mb-1">{evaluation.summary}</p>
                                                        <p className="text-[16px] italic text-stone-900 leading-relaxed">{evaluation.details}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[11px] font-black uppercase tracking-wider text-[#be123c] block mb-1">Computation Rule:</span>
                                                        <p className="text-[16px] font-medium text-stone-900 leading-relaxed italic">{evaluation.astrologicalRule}</p>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="text-center py-12">
                    <button
                        onClick={() => window.close()}
                        className="px-12 py-4 rounded-full bg-[#e11d48] hover:bg-[#be123c] transition-all text-white font-black uppercase tracking-[0.5em] text-xs shadow-xl"
                    >
                        Return to Workstation
                    </button>
                </div>
            </div>
        </div>
    );
}
