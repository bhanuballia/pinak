import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function KotaChakraViewer({ birthData: propBirthData, transitData: propTransitData }) {
    const [chakraData, setChakraData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fallback to localStorage if props are missing
    const getLocalData = () => {
        try {
            const data = JSON.parse(localStorage.getItem('worksheetData'));
            return data;
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const localData = getLocalData();
        const birthData = propBirthData || localData;
        const transitData = propTransitData || localData?.chart || {}; // fallback for transit logic

        if (!birthData?.chart?.planets) return;

        const fetchKotaData = async () => {
            setLoading(true);
            try {
                // Extract Moon longitude for Janma Nakshatra
                const moon = birthData.chart.planets.find(p => p.name === 'Moon');
                if (!moon) throw new Error("Moon longitude not found in birth data");

                // Prepare transit planets map
                const transitPlanets = {};
                if (Array.isArray(transitData)) {
                    transitData.forEach(p => {
                        transitPlanets[p.name] = p.fullDegree;
                    });
                } else if (transitData.planets) {
                    transitData.planets.forEach(p => {
                        transitPlanets[p.name] = p.fullDegree;
                    });
                }

                const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
                const response = await axios.post(`${baseUrl}/api/kota-chakra`, {
                    moon_longitude: moon.fullDegree || moon.longitude || 0,
                    transit_planets: transitPlanets
                });
                
                setChakraData(response.data);
            } catch (err) {
                console.error("Kota Chakra Error:", err);
                setError("Failed to generate Kota Chakra.");
            } finally {
                setLoading(false);
            }
        };

        fetchKotaData();
    }, [propBirthData, propTransitData]);

    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;
    if (!chakraData) return null;

    // Fortress Drawing Math
    // 4 Concentric Squares: 
    // Bahya (Outer)
    // Prakara
    // Madhya
    // Stambha (Inner)
    
    // Simplistic visual representation
    return (
        <div className="w-full bg-slate-900 text-white border border-slate-700 shadow-xl overflow-hidden rounded-xl">
            <div className="bg-slate-800 border-b border-slate-700 p-6">
                <h2 className="text-xl font-bold flex items-center justify-between">
                    Kota Chakra (Fortress)
                    <span className="bg-slate-700 text-slate-300 text-sm font-medium px-2.5 py-0.5 rounded border border-slate-600">
                        Janma Nakshatra: {chakraData.janma_nakshatra}
                    </span>
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Fortress */}
                    <div className="flex flex-col items-center justify-center relative w-full aspect-square max-w-md mx-auto">
                        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <radialGradient id="stambhaGrad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
                                </radialGradient>
                            </defs>

                            {/* Squares */}
                            <rect x="20" y="20" width="360" height="360" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
                            <text x="25" y="40" fill="#94a3b8" fontSize="12">Bahya (Outer)</text>

                            <rect x="70" y="70" width="260" height="260" fill="none" stroke="#64748b" strokeWidth="2" />
                            <text x="75" y="90" fill="#cbd5e1" fontSize="12">Prakara</text>

                            <rect x="120" y="120" width="160" height="160" fill="none" stroke="#94a3b8" strokeWidth="2" />
                            <text x="125" y="140" fill="#f8fafc" fontSize="12">Madhya</text>

                            <rect x="160" y="160" width="80" height="80" fill="url(#stambhaGrad)" stroke="#38bdf8" strokeWidth="2" />
                            <text x="175" y="205" fill="#ffffff" fontSize="14" fontWeight="bold">Stambha</text>
                            
                            {/* Diagonals */}
                            <line x1="20" y1="20" x2="380" y2="380" stroke="#475569" strokeWidth="1" />
                            <line x1="380" y1="20" x2="20" y2="380" stroke="#475569" strokeWidth="1" />
                            <line x1="200" y1="20" x2="200" y2="380" stroke="#475569" strokeWidth="1" />
                            <line x1="20" y1="200" x2="380" y2="200" stroke="#475569" strokeWidth="1" />

                            {/* Render Planets on the grid (Simplistic plotting) */}
                            {chakraData.vulnerability?.planet_positions?.map((p, idx) => {
                                // Simple mapping for visual demo
                                let r = 0;
                                if (p.section === "Bahya") r = 180;
                                else if (p.section === "Prakara") r = 130;
                                else if (p.section === "Madhya") r = 80;
                                else if (p.section === "Stambha") r = 30;

                                // Randomize angle slightly based on idx to avoid overlap
                                const angle = (idx * 45) * (Math.PI / 180);
                                const x = 200 + r * Math.cos(angle);
                                const y = 200 + r * Math.sin(angle);

                                const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(p.planet);
                                const color = isMalefic ? "#ef4444" : "#10b981"; // Red for Malefic, Green for Benefic

                                return (
                                    <g key={idx} transform={`translate(${x},${y})`}>
                                        <circle r="12" fill={color} stroke="#fff" strokeWidth="1" className="shadow-lg" />
                                        <text x="-7" y="4" fill="#fff" fontSize="10" fontWeight="bold">
                                            {p.planet.substring(0, 2).toUpperCase()}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Data Panel */}
                    <div className="flex flex-col space-y-4">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <h3 className="text-lg font-bold mb-2">Vulnerability Score</h3>
                            <div className="flex items-center space-x-4">
                                <span className={`text-4xl font-black ${chakraData.vulnerability?.vulnerability_score < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {chakraData.vulnerability?.vulnerability_score}
                                </span>
                                <span className="text-sm text-slate-400">
                                    (Negative scores indicate entering malefics / higher risk)
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1 overflow-y-auto max-h-[300px]">
                            <h3 className="text-lg font-bold mb-4">Planet Impacts (Transit)</h3>
                            <div className="space-y-3">
                                {chakraData.vulnerability?.planet_positions?.map((p, idx) => {
                                    const isNegative = p.impact.includes("Negative");
                                    return (
                                        <div key={idx} className="flex flex-col space-y-1 pb-3 border-b border-slate-700 last:border-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-200">{p.planet}</span>
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${isNegative ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
                                                    {p.impact}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>{p.nakshatra} ({p.path})</span>
                                                <span>Section: <strong className="text-slate-300">{p.section}</strong></span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
