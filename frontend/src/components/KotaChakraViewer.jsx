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

        const fetchKotaData = async () => {
            setLoading(true);
            try {
                // Extract Moon longitude for Janma Nakshatra
                let moonLon = 45.0; // Default fallback to Rohini/Taurus
                if (birthData?.chart?.planets) {
                    const moon = birthData.chart.planets.find(p => p.name === 'Moon' || p.planet === 'Moon');
                    if (moon) {
                        moonLon = moon.fullDegree || moon.degree || moon.longitude || 45.0;
                    }
                } else if (birthData?.planet_positions) {
                    const moon = birthData.planet_positions.find(p => p.planet === 'Moon');
                    if (moon) {
                        moonLon = moon.degree || moon.longitude || 45.0;
                    }
                }

                // Prepare transit planets map
                const transitPlanets = {
                    Sun: 120.5, Moon: 45.0, Mars: 95.2, Mercury: 110.4,
                    Jupiter: 135.8, Venus: 142.1, Saturn: 320.6, Rahu: 25.4, Ketu: 205.4
                };

                if (Array.isArray(transitData)) {
                    transitData.forEach(p => {
                        const name = p.name || p.planet;
                        if (name) transitPlanets[name] = p.fullDegree || p.degree || p.longitude || 0;
                    });
                } else if (transitData.planets) {
                    transitData.planets.forEach(p => {
                        const name = p.name || p.planet;
                        if (name) transitPlanets[name] = p.fullDegree || p.degree || p.longitude || 0;
                    });
                }

                const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
                const response = await axios.post(`${baseUrl}/api/kota-chakra`, {
                    moon_longitude: moonLon,
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

    if (loading) return <div className="flex items-center justify-center p-8 bg-slate-900 min-h-screen text-white"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;
    if (!chakraData) return <div className="p-8 text-center bg-slate-900 min-h-screen text-slate-400">Loading Kota Chakra data...</div>;

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
                    <span className="bg-slate-700 text-orange-400 text-[20px] font-medium px-2.5 py-0.5 rounded border border-slate-600">
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

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1 overflow-y-auto max-h-[320px]">
                            <h3 className="text-lg font-bold mb-4">Planet Impacts (Transit)</h3>
                            <div className="space-y-3">
                                {chakraData.vulnerability?.planet_positions?.map((p, idx) => {
                                    const isNegative = p.impact.includes("Negative");
                                    return (
                                        <div key={idx} className="flex flex-col space-y-1 pb-3 border-b border-slate-700 last:border-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-200">{p.planet}</span>
                                                <span className={`text-[16px] font-medium px-2.5 py-0.5 rounded border ${isNegative ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
                                                    {p.impact}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[16px] text-slate-400">
                                                <span>{p.nakshatra} ({p.path})</span>
                                                <span>Section: <strong className="text-slate-300">{p.section}</strong></span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Detailed Kota Fortress Analytical Insights */}
                        <div className="bg-slate-800/90 p-4 rounded-lg border border-indigo-500/30 text-xs space-y-2">
                            <h4 className="font-bold text-amber-400 text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                                🏰 Kota Fortress Analytical Interpretation
                            </h4>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Stambha (Inner Pillar):</strong> {chakraData.vulnerability?.vulnerability_score < 0 ? "Malefic transits breaching the central pillar indicate heightened vulnerability. Maintain caution." : "Benefic protective rays safeguard the central pillar, ensuring inner resilience and mental fortitude."}
                            </p>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Kota Swami & Kota Pala:</strong> Monitoring the lord of the fortress (Kota Swami) and guardian (Kota Pala) ensures defense against sudden opposition or challenges.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sectional Effects Breakdown: Stambha, Madhya, Prakara, Bahya */}
                <div className="mt-8 border-t border-slate-700/80 pt-6">
                    <h3 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span>🏛️</span> Planetary Effects by Kota Fortress Quadrants (Stambha, Madhya, Prakara, Bahya)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[14px]">
                        {/* Stambha (Inner Pillar) */}
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-sky-500/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-sky-500/30 pb-2">
                                <h4 className="font-bold text-sky-400 text-[16px]">1. Stambha (Pillar / Core)</h4>
                                <span className="text-[18px] px-2 py-0.5 bg-sky-950 text-sky-300 rounded font-bold">Center</span>
                            </div>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Core Impact:</strong> Represents the vital energy, health, and soul stability of the native.
                            </p>
                            <div className="text-[18px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700">
                                <span className="text-rose-400 font-bold">Malefics Here:</span> Severe distress, physical illness, high anxiety.<br />
                                <span className="text-emerald-400 font-bold">Benefics Here:</span> Complete protection, high vitality & divine grace.
                            </div>
                        </div>

                        {/* Madhya (Middle Wall) */}
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-indigo-500/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                                <h4 className="font-bold text-indigo-400 text-[16px]">2. Madhya (Inner Ring)</h4>
                                <span className="text-[18px] px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded font-bold">Inner Wall</span>
                            </div>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Core Impact:</strong> Governs mental peace, emotional stability, family, and internal security.
                            </p>
                            <div className="text-[18px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700">
                                <span className="text-rose-400 font-bold">Malefics Here:</span> Domestic friction, emotional disturbance.<br />
                                <span className="text-emerald-400 font-bold">Benefics Here:</span> Family harmony, mental peace & support.
                            </div>
                        </div>

                        {/* Prakara (Ramparts) */}
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-purple-500/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                                <h4 className="font-bold text-purple-400 text-[16px]">3. Prakara (Ramparts)</h4>
                                <span className="text-[18px] px-2 py-0.5 bg-purple-950 text-purple-300 rounded font-bold">Defensive Line</span>
                            </div>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Core Impact:</strong> Governs active defense, career status, social reputation, and competitors.
                            </p>
                            <div className="text-[18px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700">
                                <span className="text-rose-400 font-bold">Malefics Here:</span> Public scrutiny, rivalry, career pressure.<br />
                                <span className="text-emerald-400 font-bold">Benefics Here:</span> Victory over rivals, professional success.
                            </div>
                        </div>

                        {/* Bahya (Outer Boundary) */}
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-500/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-500/30 pb-2">
                                <h4 className="font-bold text-slate-300 text-[16px]">4. Bahya (Outer Perimeter)</h4>
                                <span className="text-[18px] px-2 py-0.5 bg-slate-950 text-slate-300 rounded font-bold">Outer Zone</span>
                            </div>
                            <p className="text-slate-300 text-[18px] leading-relaxed">
                                <strong>Core Impact:</strong> External travel, distant relations, public affairs, and foreign interactions.
                            </p>
                            <div className="text-[18px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-700">
                                <span className="text-rose-400 font-bold">Malefics Here:</span> Minor external delays, distant travel friction.<br />
                                <span className="text-emerald-400 font-bold">Benefics Here:</span> External gains, smooth travel & expansion.
                            </div>
                        </div>
                    </div>
                </div>

                {/* How Kota Chakra Works Explanation Section */}
                <div className="mt-8 border-t border-slate-700/80 pt-6 bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 space-y-4">
                    <h3 className="text-[18px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <span>❓</span> How Kota Chakra Works (कोटा चक्र कार्यविधि)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[16px] text-slate-200">
                        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 space-y-1.5">
                            <h4 className="font-bold text-indigo-300 text-[16px] flex items-center gap-1.5">
                                <span>1️⃣</span> 28-Nakshatra Grid Mapping
                            </h4>
                            <p className="text-slate-300 text-[15px] leading-relaxed">
                                The Kota Chakra maps all 28 Nakshatras (including <strong>Abhijit</strong>) into 4 concentric fortress rings arranged in 8 directional pathways (N, NE, E, SE, S, SW, W, NW).
                            </p>
                        </div>

                        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 space-y-1.5">
                            <h4 className="font-bold text-emerald-300 text-[16px] flex items-center gap-1.5">
                                <span>2️⃣</span> Entry (Pravesha) vs Exit (Nirgana)
                            </h4>
                            <p className="text-slate-300 text-[15px] leading-relaxed">
                                Transiting planets move along entry roads toward the central pillar (<strong>Pravesha</strong>) or exit roads away from the core (<strong>Nirgana</strong>). Malefics entering create risk; benefics entering bring strength.
                            </p>
                        </div>

                        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 space-y-1.5">
                            <h4 className="font-bold text-amber-300 text-[16px] flex items-center gap-1.5">
                                <span>3️⃣</span> Kota Swami & Kota Pala Roles
                            </h4>
                            <p className="text-slate-300 text-[15px] leading-relaxed">
                                <strong>Kota Swami</strong> (Lord of the Fort, based on Moon sign lord) and <strong>Kota Pala</strong> (Guardian planet) protect the fortress when well-placed in transit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}
