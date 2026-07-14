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

                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/kurma-chakra`, {
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
        <div className="w-full h-full min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            <div className="bg-slate-800 border-b border-slate-700 p-4 shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-2xl">🐢</span> Kurma Chakra (Mundane Astrology)
                    <span className="bg-indigo-900 text-indigo-200 text-xs font-bold px-2 py-1 rounded-md border border-indigo-700 ml-auto">
                        Global / Standard View
                    </span>
                </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* SVG Panel */}
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-900/50 relative">
                    <svg viewBox="0 0 400 400" className="w-full max-w-[600px] aspect-square drop-shadow-2xl">
                        {/* Simple Tortoise Shape Outline */}
                        {/* Shell */}
                        <ellipse cx="200" cy="200" rx="130" ry="150" fill="#1e293b" stroke="#334155" strokeWidth="4" />
                        {/* Face */}
                        <circle cx="200" cy="50" r="30" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        {/* Tail */}
                        <polygon points="190,345 210,345 200,380" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        {/* Legs */}
                        <circle cx="100" cy="100" r="25" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        <circle cx="300" cy="100" r="25" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        <circle cx="100" cy="300" r="25" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        <circle cx="300" cy="300" r="25" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                        
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
                                    <circle r="35" fill={isDanger ? "rgba(239, 68, 68, 0.2)" : isGood ? "rgba(16, 185, 129, 0.2)" : "rgba(234, 179, 8, 0.1)"} 
                                        stroke={isDanger ? "#ef4444" : isGood ? "#10b981" : "#eab308"} strokeWidth="2" strokeDasharray="4,4" />
                                    
                                    <text x="0" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                                        {name.split(' (')[0]}
                                    </text>

                                    {/* If Neutral and no planets, show a yellow center dot */}
                                    {isNeutral && planetsHere.length === 0 && (
                                        <g transform="translate(0, 5)">
                                            <circle r="6" fill="#eab308" stroke="#fff" strokeWidth="1" />
                                        </g>
                                    )}

                                    {/* Plot planets */}
                                    {planetsHere.map((p, idx) => {
                                        const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet);
                                        const pColor = isMalefic ? "#ef4444" : "#10b981";
                                        const offset = (idx - (planetsHere.length-1)/2) * 15;
                                        return (
                                            <g key={p.planet} transform={`translate(${offset}, 5)`}>
                                                <circle r="6" fill={pColor} stroke="#fff" strokeWidth="1" />
                                                <text y="15" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
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
                <div className="w-full lg:w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
                    <div className="p-4 border-b border-slate-700">
                        <h3 className="font-bold text-slate-200">Regional Impact Analysis</h3>
                        <p className="text-xs text-slate-400 mt-1">Based on Brihat Samhita Nakshatra mappings.</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {Object.entries(chakraData.region_scores).map(([region, score]) => {
                            const planetsHere = chakraData.planet_positions.filter(p => p.region === region);
                            if (planetsHere.length === 0) {
                                return (
                                    <div key={region} className="p-3 rounded-lg border bg-slate-800/50 border-slate-700">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-slate-400">{region}</h4>
                                            <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-700 text-slate-400">
                                                NEUTRAL
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">No significant planetary transits.</p>
                                    </div>
                                );
                            }

                            const isDanger = score < 0;
                            const isNeutral = score === 0;
                            
                            return (
                                <div key={region} className={`p-3 rounded-lg border ${isDanger ? 'bg-red-500/10 border-red-500/30' : isNeutral ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-sm text-slate-200">{region}</h4>
                                        <span className={`text-xs font-black px-2 py-0.5 rounded ${isDanger ? 'bg-red-500 text-white' : isNeutral ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                            {isDanger ? 'STRESS' : isNeutral ? 'MIXED/NEUTRAL' : 'PROSPERITY'}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {planetsHere.map(p => {
                                            const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet);
                                            const interp = getMundaneInterpretation(p.planet, isMalefic);
                                            return (
                                                <div key={p.planet} className="text-xs bg-slate-900/40 p-2 rounded border border-slate-700/50">
                                                    <div className="flex justify-between text-slate-200 font-bold mb-1">
                                                        <span className="flex items-center gap-1">
                                                            <div className={`w-2 h-2 rounded-full ${isMalefic ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                                                            {p.planet} (in {p.nakshatra})
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 leading-snug">{interp}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {chakraData.planet_positions.length === 0 && (
                            <div className="text-center text-slate-400 py-8 text-sm">
                                No planetary transits active.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
