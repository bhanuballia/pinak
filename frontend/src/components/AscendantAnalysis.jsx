import React, { useState, useEffect } from 'react';
import { ASCENDANT_INTERPRETATIONS, ASCENDANT_PLANETS_1ST_HOUSE, ASCENDANT_INTRO } from '../data/ascendantData';
import { BPHS_FIRST_HOUSE_RULES, SIGN_LORDS, SIGN_NAMES, MALEFIC_PLANETS, BENEFIC_PLANETS } from '../data/bphsHouseEffects';
import { BPHS_BHAVA_LORDS_RULES } from '../data/bphsBhavaLords';


export default function AscendantAnalysis() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [isHindi, setIsHindi] = useState(false);

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

    // BPHS Diagnostic Rule Calculations
    const ascSignIndex = SIGN_NAMES.indexOf(ascendantSign);
    const ascLord = ascSignIndex !== -1 ? SIGN_LORDS[ascSignIndex] : "Mars";

    // Track placements of planets in houses
    const planetPlacements = {};
    Object.keys(houses).forEach(hNum => {
        const planets = houses[hNum]?.planets?.map(p => typeof p === 'object' ? p.name : p) || [];
        planets.forEach(p => {
            planetPlacements[p] = Number(hNum);
        });
    });

    const ascLordHouse = planetPlacements[ascLord] || null;

    // Rule 1: Physical Comforts (Slokas 1-2)
    const isLordInDusthana = ascLordHouse === 6 || ascLordHouse === 8 || ascLordHouse === 12;
    const lordConjPlanets = ascLordHouse ? (houses[ascLordHouse]?.planets?.map(p => typeof p === 'object' ? p.name : p).filter(p => p !== ascLord && p !== 'Ascendant' && p !== 'L') || []) : [];
    const hasLordMaleficConj = lordConjPlanets.some(p => MALEFIC_PLANETS.includes(p));
    const physicalComfortsStatus = isLordInDusthana || hasLordMaleficConj ? "diminished" : "favorable";

    // Rule 2: Bodily Health & Aspect Rules (Sloka 3)
    const hasAscMalefic = planetsInFirst.some(p => MALEFIC_PLANETS.includes(p));
    const moonHouse = planetPlacements["Moon"] || null;
    const planetsInMoonHouse = moonHouse ? (houses[moonHouse]?.planets?.map(p => typeof p === 'object' ? p.name : p).filter(p => p !== 'Ascendant' && p !== 'L') || []) : [];
    const hasMoonMalefic = planetsInMoonHouse.some(p => MALEFIC_PLANETS.includes(p));
    const healthAlertActive = hasAscMalefic || hasMoonMalefic;

    // Rule 3: Bodily Beauty & Charm (Sloka 4)
    const hasAscBenefic = planetsInFirst.some(p => BENEFIC_PLANETS.includes(p));

    // Rule 4: Success, Fortune & Longevity (Slokas 5-7)
    const kendraTrikonaHouses = [1, 4, 7, 10, 5, 9];
    const isLordInKendraTrikona = kendraTrikonaHouses.includes(ascLordHouse);
    const mercuryHouse = planetPlacements["Mercury"];
    const jupiterHouse = planetPlacements["Jupiter"];
    const venusHouse = planetPlacements["Venus"];
    const isMercuryKendraTrikona = kendraTrikonaHouses.includes(mercuryHouse);
    const isJupiterKendraTrikona = kendraTrikonaHouses.includes(jupiterHouse);
    const isVenusKendraTrikona = kendraTrikonaHouses.includes(venusHouse);
    const otherBenefitsActive = isLordInKendraTrikona || isMercuryKendraTrikona || isJupiterKendraTrikona || isVenusKendraTrikona;

    // Rule 5: Coiled Birth (Sloka 8)
    const isCoiledSign = ["Aries", "Taurus", "Leo"].includes(ascendantSign);
    const hasSaturnOrMarsInAsc = planetsInFirst.some(p => p === "Saturn" || p === "Mars");
    const coiledBirthActive = isCoiledSign && hasSaturnOrMarsInAsc;

    // Rule 6: Birth of Twins (Sloka 9)
    const sunHouse = planetPlacements["Sun"];
    const sunSign = sunHouse ? houses[sunHouse]?.sign_name : "";
    const quadrupedSigns = ["Aries", "Taurus", "Leo", "Capricorn", "Sagittarius"]; // approx
    const sunInQuadruped = quadrupedSigns.includes(sunSign);
    const otherPlanetsInDual = Object.keys(planetPlacements).filter(p => p !== "Sun" && p !== "Ascendant").every(p => {
        const h = planetPlacements[p];
        const sign = houses[h]?.sign_name;
        return ["Gemini", "Virgo", "Sagittarius", "Pisces"].includes(sign);
    });
    const twinsBirthActive = sunInQuadruped && otherPlanetsInDual;

    // Rule 7: Nurtured by 3 Mothers (Sloka 10)
    const areSunMoonConjunct = sunHouse === moonHouse && sunHouse !== null;
    const nurturedActive = areSunMoonConjunct; // Simplified Navamsa matching to conjunction check

    // Rule 8: Decanate determination
    // Standard Vedic charts provide cusp degree or planet degrees. If degree is missing, we default to decanate 1.
    const ascDegreeInfo = houses[1]?.cusp_deg || 0;
    const decanateNum = ascDegreeInfo < 10 ? 1 : ascDegreeInfo < 20 ? 2 : 3;


    return (
        <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-serif p-8 relative">
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

                {/* Lagna Lord Placement Scroll (BPHS Ch. 24) */}
                {ascLordHouse && BPHS_BHAVA_LORDS_RULES.LagnaLord[ascLordHouse] && (
                    <div className="max-w-4xl mx-auto bg-[#faf7f2] border-2 border-[#e8dfd5] p-8 md:p-10 rounded-[3rem] shadow-md relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">👑</div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="text-5xl text-amber-800">🏛️</div>
                            <div className="flex-1 space-y-2">
                                <span className="px-3 py-1 bg-amber-100/60 text-amber-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                                    Lagna Lord House Placement (BPHS Ch. 24)
                                </span>
                                <h4 className="text-2xl font-black text-stone-800 italic">
                                    Ascendant Lord ({ascLord}) in the {ascLordHouse === 1 ? "1st" : ascLordHouse === 2 ? "2nd" : ascLordHouse === 3 ? "3rd" : ascLordHouse + "th"} House
                                </h4>
                                <p className="text-sm text-stone-600 leading-relaxed italic">
                                    "{BPHS_BHAVA_LORDS_RULES.LagnaLord[ascLordHouse].result}"
                                </p>
                                <div className="text-xs text-stone-500 font-serif border-t border-stone-200/50 pt-2 italic">
                                    <span className="font-bold block text-stone-700 not-italic mb-1">Sastra Notes:</span>
                                    {BPHS_BHAVA_LORDS_RULES.LagnaLord[ascLordHouse].notes}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Classical BPHS Chapter 12 Shloka Analysis */}
                <div className="bg-[#fcfbf9] rounded-[4rem] p-12 md:p-16 border-2 border-stone-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl">📜</div>
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <span className="px-4 py-1.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                                Classic Sastra Diagnostic
                            </span>
                            <h3 className="text-4xl font-black text-stone-800 italic">
                                Brihat Parasara Hora Sastra
                            </h3>
                            <p className="text-stone-500 uppercase tracking-widest text-xs font-black">
                                Chapter 12 • First House (Lagna Bhava) Analysis
                            </p>
                            <div className="h-0.5 w-24 bg-stone-300 mx-auto mt-4"></div>
                        </div>

                        {/* Evaluation Summaries */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Sloka 1-2 Physical Comforts */}
                            <div className={`p-8 rounded-[2.5rem] border transition-all ${
                                physicalComfortsStatus === "diminished" 
                                    ? "bg-rose-50/50 border-rose-100 shadow-sm" 
                                    : "bg-emerald-50/50 border-emerald-100 shadow-sm"
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-black text-stone-800 italic">{BPHS_FIRST_HOUSE_RULES.physicalComforts.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        physicalComfortsStatus === "diminished"
                                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    }`}>
                                        {physicalComfortsStatus === "diminished" ? "Afflicted" : "Fortified"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic font-mono mb-2 whitespace-pre-line">{BPHS_FIRST_HOUSE_RULES.physicalComforts.sanskrit}</p>
                                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">"{BPHS_FIRST_HOUSE_RULES.physicalComforts.english}"</p>
                                <div className="p-4 bg-white/60 rounded-2xl border border-stone-200/50 text-[11px] text-stone-500 italic">
                                    <span className="font-bold block text-stone-700 not-italic mb-1">Dynamic Chart Calculation:</span>
                                    Ascendant Lord ({ascLord}) is placed in House {ascLordHouse || '?'}. 
                                    {isLordInDusthana ? " Since the Lord is in a dusthana house (6th/8th/12th), physical comforts may encounter blockages." : " Placed favorably outside dusthana houses."}
                                    {hasLordMaleficConj ? " It is conjunct malefic planets, indicating physical challenges." : " Safe from malefic conjunctions."}
                                </div>
                            </div>

                            {/* Sloka 3 Bodily Health */}
                            <div className={`p-8 rounded-[2.5rem] border transition-all ${
                                healthAlertActive 
                                    ? "bg-rose-50/50 border-rose-100 shadow-sm" 
                                    : "bg-stone-50 border-stone-200"
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-black text-stone-800 italic">{BPHS_FIRST_HOUSE_RULES.bodilyHealth.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        healthAlertActive ? "bg-rose-100 text-rose-800 border border-rose-200" : "bg-stone-200 text-stone-600"
                                    }`}>
                                        {healthAlertActive ? "Active Alert" : "Neutral"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic font-mono mb-2 whitespace-pre-line">{BPHS_FIRST_HOUSE_RULES.bodilyHealth.sanskrit}</p>
                                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">"{BPHS_FIRST_HOUSE_RULES.bodilyHealth.english}"</p>
                                <div className="p-4 bg-white/60 rounded-2xl border border-stone-200/50 text-[11px] text-stone-500 italic">
                                    <span className="font-bold block text-stone-700 not-italic mb-1">Dynamic Chart Calculation:</span>
                                    {hasAscMalefic ? "Malefics are present in your 1st house." : "No malefics in the 1st house."} 
                                    {hasMoonMalefic ? " Malefics are conjunct your Moon, which requires conscious wellness efforts." : " Moon is free from malefic conjunction."}
                                </div>
                            </div>

                            {/* Sloka 4 Bodily Beauty */}
                            <div className={`p-8 rounded-[2.5rem] border transition-all ${
                                hasAscBenefic 
                                    ? "bg-emerald-50/50 border-emerald-100 shadow-sm" 
                                    : "bg-stone-50 border-stone-200"
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-black text-stone-800 italic">{BPHS_FIRST_HOUSE_RULES.bodilyBeauty.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        hasAscBenefic ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-stone-200 text-stone-600"
                                    }`}>
                                        {hasAscBenefic ? "Charming Aura" : "Standard"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic font-mono mb-2 whitespace-pre-line">{BPHS_FIRST_HOUSE_RULES.bodilyBeauty.sanskrit}</p>
                                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">"{BPHS_FIRST_HOUSE_RULES.bodilyBeauty.english}"</p>
                                <div className="p-4 bg-white/60 rounded-2xl border border-stone-200/50 text-[11px] text-stone-500 italic">
                                    <span className="font-bold block text-stone-700 not-italic mb-1">Dynamic Chart Calculation:</span>
                                    {hasAscBenefic ? "A benefic planet is placed in your Ascendant, conferring bodily charm and dynamic visual grace." : "No major benefic occupies the Ascendant directly."}
                                </div>
                            </div>

                            {/* Slokas 5-7 Success & Longevity */}
                            <div className={`p-8 rounded-[2.5rem] border transition-all ${
                                otherBenefitsActive 
                                    ? "bg-amber-50/50 border-amber-100 shadow-sm" 
                                    : "bg-stone-50 border-stone-200"
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-black text-stone-800 italic">{BPHS_FIRST_HOUSE_RULES.otherBenefits.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        otherBenefitsActive ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-stone-200 text-stone-600"
                                    }`}>
                                        {otherBenefitsActive ? "Royal Marks (Active)" : "Neutral"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-stone-400 italic font-mono mb-2 whitespace-pre-line">{BPHS_FIRST_HOUSE_RULES.otherBenefits.sanskrit}</p>
                                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">"{BPHS_FIRST_HOUSE_RULES.otherBenefits.english}"</p>
                                <div className="p-4 bg-white/60 rounded-2xl border border-stone-200/50 text-[11px] text-stone-500 italic">
                                    <span className="font-bold block text-stone-700 not-italic mb-1">Dynamic Chart Calculation:</span>
                                    {isLordInKendraTrikona ? "Ascendant Lord is in a Kendra/Trikona (Fortunate placement!)." : "Ascendant Lord is in a non-kendra/trikona house."}
                                    {isJupiterKendraTrikona || isVenusKendraTrikona ? " Benefics (Jupiter/Venus) are in Kendra or Trikona, supporting wisdom, wealth and status." : ""}
                                </div>
                            </div>
                        </div>

                        {/* Special Conditions Check */}
                        {(coiledBirthActive || twinsBirthActive || nurturedActive) && (
                            <div className="bg-[#fffbeb] p-8 rounded-[3rem] border border-[#fef3c7] shadow-inner space-y-6">
                                <h4 className="text-lg font-black text-amber-900 italic">Flagged Classical Yoga Combinations</h4>
                                <div className="space-y-4">
                                    {coiledBirthActive && (
                                        <div className="p-4 bg-white rounded-2xl border border-amber-200/60">
                                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">{BPHS_FIRST_HOUSE_RULES.coiledBirth.title}</p>
                                            <p className="text-xs text-stone-600 italic">"{BPHS_FIRST_HOUSE_RULES.coiledBirth.english}"</p>
                                        </div>
                                    )}
                                    {twinsBirthActive && (
                                        <div className="p-4 bg-white rounded-2xl border border-amber-200/60">
                                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">{BPHS_FIRST_HOUSE_RULES.birthOfTwins.title}</p>
                                            <p className="text-xs text-stone-600 italic">"{BPHS_FIRST_HOUSE_RULES.birthOfTwins.english}"</p>
                                        </div>
                                    )}
                                    {nurturedActive && (
                                        <div className="p-4 bg-white rounded-2xl border border-amber-200/60">
                                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">{BPHS_FIRST_HOUSE_RULES.nurturedByThreeMothers.title}</p>
                                            <p className="text-xs text-stone-600 italic">"{BPHS_FIRST_HOUSE_RULES.nurturedByThreeMothers.english}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Decanates & Bodily Limbs Mapping */}
                        <div className="bg-stone-50 rounded-[3rem] p-8 md:p-10 border border-stone-200 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h4 className="text-xl font-black text-stone-800 italic">{BPHS_FIRST_HOUSE_RULES.decanatesAndLimbs.title}</h4>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest font-black">
                                        Based on Ascending Decanate (Dreshkana)
                                    </p>
                                </div>
                                <div className="px-4 py-2 bg-stone-200 text-stone-800 rounded-full text-xs font-black uppercase tracking-wider border border-stone-300">
                                    Ascendant Cusp: {ascDegreeInfo.toFixed(2)}° (Decanate {decanateNum})
                                </div>
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed italic">
                                "{BPHS_FIRST_HOUSE_RULES.decanatesAndLimbs.english}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((dIndex) => {
                                    const decData = BPHS_FIRST_HOUSE_RULES.decanatesAndLimbs.decanateDetails[dIndex];
                                    const isActive = decanateNum === dIndex;
                                    return (
                                        <div key={dIndex} className={`p-6 rounded-[2rem] border transition-all ${
                                            isActive 
                                                ? "bg-stone-900 text-white border-stone-900 shadow-lg scale-105" 
                                                : "bg-white text-stone-700 border-stone-200 opacity-60"
                                        }`}>
                                            <div className="flex justify-between items-center mb-4 border-b pb-2 border-stone-300/30">
                                                <span className="text-xs font-black uppercase tracking-widest">{decData.description}</span>
                                                {isActive && (
                                                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
                                                )}
                                            </div>
                                            <div className="space-y-2 text-[11px] font-mono leading-tight">
                                                {decData.mapping.map((m, mIdx) => (
                                                    <div key={mIdx} className="flex justify-between border-b border-stone-200/10 pb-1">
                                                        <span className={isActive ? "text-stone-300" : "text-stone-500"}>{m.house}</span>
                                                        <span className="font-bold">{m.part}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sloka 15 Scar / Moles interpretation */}
                            <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 text-xs text-stone-600 italic space-y-2">
                                <p className="font-black text-amber-900 not-italic">{BPHS_FIRST_HOUSE_RULES.limbsAffected.title}</p>
                                <p>"{BPHS_FIRST_HOUSE_RULES.limbsAffected.english}"</p>
                                <p className="text-[10px] text-stone-400 font-mono italic">{BPHS_FIRST_HOUSE_RULES.limbsAffected.sanskrit}</p>
                            </div>
                        </div>

                    </div>
                </div>

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
