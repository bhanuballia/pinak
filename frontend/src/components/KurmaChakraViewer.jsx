import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function KurmaChakraViewer() {
    const [chakraData, setChakraData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKurmaData = async () => {
            setLoading(true);
            try {
                const localData = JSON.parse(localStorage.getItem('worksheetData'));
                const transitData = localData?.transitData || localData?.chart || {};

                const transitPlanets = {};
                if (Array.isArray(transitData)) {
                    transitData.forEach(p => { transitPlanets[p.name] = p.fullDegree; });
                } else if (transitData.planets) {
                    transitData.planets.forEach(p => { transitPlanets[p.name] = p.fullDegree; });
                } else if (localData?.chart?.planets) {
                    localData.chart.planets.forEach(p => { transitPlanets[p.name] = p.fullDegree; });
                }

                // If transitPlanets is empty, the backend will calculate current live transits using swisseph.

                const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
                const response = await axios.post(`${baseUrl}/api/kurma-chakra`, {
                    transit_planets: transitPlanets
                });

                setChakraData(response.data);
            } catch (err) {
                console.error("Kurma Chakra Error:", err);
                setError("Failed to generate Kurma Chakra.");
            } finally {
                setLoading(false);
            }
        };

        fetchKurmaData();
    }, []);

    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;
    if (!chakraData) return null;

    // SVG coordinates for the 9 regions of the Tortoise
    const regions = {
        "East (Face)": { x: 200, y: 50 },
        "South-East (Right Front Leg)": { x: 300, y: 100 },
        "South (Right Side)": { x: 350, y: 200 },
        "South-West (Right Hind Leg)": { x: 300, y: 300 },
        "West (Tail)": { x: 200, y: 350 },
        "North-West (Left Hind Leg)": { x: 100, y: 300 },
        "North (Left Side)": { x: 50, y: 200 },
        "North-East (Left Front Leg)": { x: 100, y: 100 },
        "Central (Belly)": { x: 200, y: 200 }
    };

    const getMundaneInterpretation = (planet, isDanger) => {
        const dict = {
            "Sun": isDanger ? "Government instability, friction with authorities, or leadership crises." : "Strong leadership, national pride, and successful government initiatives.",
            "Moon": isDanger ? "Public unrest, emotional volatility, or water-related issues (floods)." : "Public contentment, good agricultural yield, and peace.",
            "Mars": isDanger ? "Military conflict, fires, violence, political unrest, or accidents." : "Strong defense forces, decisive action, and rapid infrastructure development.",
            "Mercury": isDanger ? "Economic fluctuation, communication breakdowns, or trade disputes." : "Thriving trade, technological advancement, and clear media communication.",
            "Jupiter": isDanger ? "Legal disputes, religious friction, or issues in the education sector." : "Economic prosperity, good diplomacy, religious harmony, and justice.",
            "Venus": isDanger ? "Scandals, women's issues, or excessive indulgence affecting society." : "Flourishing arts, cultural harmony, diplomatic success, and luxury.",
            "Saturn": isDanger ? "Hardship for the working class, delays, natural disasters, or resource shortages." : "Structural stability, perseverance, and long-term industrial growth.",
            "Rahu": isDanger ? "Sudden shocks, riots, epidemics, confusion, or foreign interference." : "Technological breakthroughs, foreign investments, and unconventional growth.",
            "Ketu": isDanger ? "Mysterious diseases, hidden plots, isolation, or sudden losses." : "Spiritual shifts, deep introspection, and uncovering of hidden truths."
        };
        return dict[planet] || "";
    };

    return (
        <div className="w-full h-full min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-amber-50 text-slate-800 flex flex-col overflow-hidden font-sans">
            <div className="bg-white/90 backdrop-blur-md border-b border-rose-200 p-4 shrink-0 shadow-sm">
                <h2 className="text-xl font-extrabold flex items-center gap-3 text-rose-950 font-serif">
                    <span className="text-2xl">🐢</span> Kurma Chakra (Mundane Astrology)
                    <span className="bg-rose-900 text-rose-100 text-xs font-bold px-3 py-1 rounded-full shadow-sm ml-auto border border-rose-800">
                        Global / Standard View
                    </span>
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* SVG Panel */}
                <div className="flex-1 flex items-start justify-center p-8 bg-white/70 border border-rose-200/80 shadow-md rounded-3xl m-6 relative">
                    <svg viewBox="0 0 400 400" className="w-full max-w-[550px] aspect-square drop-shadow-xl select-none">
                        {/* Simple Tortoise Shape Outline */}
                        {/* Shell */}
                        <ellipse cx="200" cy="200" rx="130" ry="150" fill="#f0e584ff" stroke="#fda4af" strokeWidth="4" />
                        {/* Face */}
                        <circle cx="200" cy="50" r="30" fill="#dff18aff" stroke="#f43f5e" strokeWidth="2" />
                        {/* Tail */}
                        <polygon points="190,345 210,345 200,380" fill="rgba(198, 223, 247, 1)" stroke="#f43f5e" strokeWidth="2" />
                        {/* Legs */}
                        <circle cx="100" cy="100" r="25" fill="#f7b4b9ff" stroke="#f43f5e" strokeWidth="2" />
                        <circle cx="300" cy="100" r="25" fill="rgba(164, 245, 218, 1)" stroke="#f43f5e" strokeWidth="2" />
                        <circle cx="100" cy="300" r="25" fill="rgba(218, 174, 238, 1)" stroke="#f43f5e" strokeWidth="2" />
                        <circle cx="300" cy="300" r="25" fill="#a7f8c2ff" stroke="#f43f5e" strokeWidth="2" />

                        {/* Regions Labels & Planets */}
                        {Object.entries(regions).map(([name, coords]) => {
                            const score = chakraData.region_scores[name];
                            const isDanger = score < 0;
                            const isGood = score > 0;
                            const isNeutral = score === 0;

                            // Get planets in this region
                            const planetsHere = chakraData.planet_positions.filter(p => p.region === name);

                            return (
                                <g key={name} transform={`translate(${coords.x}, ${coords.y})`}>
                                    <circle r="35" fill={isDanger ? "rgba(239, 68, 68, 0.08)" : isGood ? "rgba(16, 185, 129, 0.08)" : "rgba(234, 179, 8, 0.05)"}
                                        stroke={isDanger ? "#f43f5e" : isGood ? "#10b981" : "#eab308"} strokeWidth="2" strokeDasharray="4,4" />

                                    <text x="0" y="-15" textAnchor="middle" fill="rgba(1, 3, 5, 1)" fontSize="10" fontWeight="bold" fontFamily="serif">
                                        {name.split(' (')[0]}
                                    </text>

                                    {/* If Neutral and no planets, show a yellow center dot */}
                                    {isNeutral && planetsHere.length === 0 && (
                                        <g transform="translate(0, 5)">
                                            <circle r="6" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                                        </g>
                                    )}

                                    {/* Plot planets */}
                                    {planetsHere.map((p, idx) => {
                                        const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet);
                                        const pColor = isMalefic ? "#e11d48" : "#059669";
                                        const offset = (idx - (planetsHere.length - 1) / 2) * 15;
                                        return (
                                            <g key={p.planet} transform={`translate(${offset}, 5)`}>
                                                <circle r="6" fill={pColor} stroke="#fff" strokeWidth="1" />
                                                <text y="15" textAnchor="middle" fill="#0f0101ff" fontSize="10" fontWeight="bold">
                                                    {p.planet.substring(0, 2).toUpperCase()}
                                                </text>
                                            </g>
                                        )
                                    })}
                                </g>
                            )
                        })}
                    </svg>
                </div>

                {/* Info Panel */}
                <div className="w-full lg:w-96 bg-white/95 backdrop-blur-md border-l border-rose-200 flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-rose-100 bg-rose-50/50">
                        <h3 className="font-bold text-rose-950 font-serif">Regional Impact Analysis</h3>
                        <p className="text-[16px] text-slate-900 mt-1">Based on Brihat Samhita Nakshatra mappings.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {Object.entries(chakraData.region_scores).map(([region, score]) => {
                            const planetsHere = chakraData.planet_positions.filter(p => p.region === region);
                            if (planetsHere.length === 0) {
                                return (
                                    <div key={region} className="p-3 rounded-xl border bg-slate-50/50 border-slate-200/80 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-slate-900">{region}</h4>
                                            <span className="text-[14px] tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                                NEUTRAL
                                            </span>
                                        </div>
                                        <p className="text-[14px] text-slate-900 mt-2">No significant planetary transits.</p>
                                    </div>
                                );
                            }

                            const isDanger = score < 0;
                            const isNeutral = score === 0;

                            return (
                                <div key={region} className={`p-3 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md ${isDanger ? 'bg-rose-50 border-rose-200 text-rose-950' : isNeutral ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-[14px] text-slate-800 font-serif">{region}</h4>
                                        <span className={`text-[14px] tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow-sm ${isDanger ? 'bg-rose-600 text-white' : isNeutral ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                            {isDanger ? 'STRESS' : isNeutral ? 'MIXED/NEUTRAL' : 'PROSPERITY'}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {planetsHere.map(p => {
                                            const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet);
                                            const interp = getMundaneInterpretation(p.planet, isMalefic);
                                            return (
                                                <div key={p.planet} className="text-xs bg-white/80 backdrop-blur-sm p-2.5 rounded-lg border border-slate-200 shadow-sm">
                                                    <div className="flex justify-between text-slate-800 font-bold mb-1">
                                                        <span className="flex items-center gap-1">
                                                            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isMalefic ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                                            {p.planet} (in {p.nakshatra})
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-900 text-[14px] leading-relaxed font-sans">{interp}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {chakraData.planet_positions.length === 0 && (
                            <div className="text-center text-slate-400 py-8 text-sm font-sans">
                                No planetary transits active.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
