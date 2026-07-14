import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import ZodiacChart from './ZodiacChart';

export default function ChaitraChartViewer() {
    const [chaitraData, setChaitraData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchChaitraData = async () => {
            setLoading(true);
            try {
                // Default coordinates (User's location if available)
                let lat = 28.6139; // Default to New Delhi
                let lon = 77.2090;

                const localData = JSON.parse(localStorage.getItem('worksheetData'));
                if (localData?.birth_details) {
                    if (localData.birth_details.lat) lat = parseFloat(localData.birth_details.lat);
                    if (localData.birth_details.lon) lon = parseFloat(localData.birth_details.lon);
                }

                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chaitra-chart`, {
                    year: year,
                    lat: lat,
                    lon: lon
                });

                setChaitraData(response.data);
            } catch (err) {
                console.error("Chaitra Chart Error:", err);
                setError("Failed to generate Chaitra Chart.");
            } finally {
                setLoading(false);
            }
        };

        fetchChaitraData();
    }, [year]);

    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>;
    if (!chaitraData) return null;

    const getCabinetInterpretation = (role, planet) => {
        const interpretations = {
            "King": {
                "Sun": "A strong, dominant government enforcing authority. High focus on nationalism and administrative power.",
                "Moon": "A people-centric government focusing on welfare, public emotions, and agriculture.",
                "Mars": "Aggressive policies, focus on defense and military. Potential for conflicts, fires, or political unrest.",
                "Mercury": "Focus on trade, economy, communications, and technological advancements.",
                "Jupiter": "A year of justice, religious/spiritual growth, sound economic policies, and diplomacy.",
                "Venus": "Emphasis on culture, arts, women's welfare, luxury, and diplomatic relations.",
                "Saturn": "Slow, methodical governance. Challenges for the working class, but long-term structural reforms."
            },
            "Minister": {
                "Sun": "Strong enforcement of laws, bureaucratic efficiency.",
                "Moon": "Welfare schemes, public-friendly policies.",
                "Mars": "Harsh law enforcement, focus on security and defense.",
                "Mercury": "Economic reforms, trade treaties, intellectual growth.",
                "Jupiter": "Fair legislation, ethical governance, and prosperity.",
                "Venus": "Diplomatic success, focus on social harmony.",
                "Saturn": "Strict policies, delays in execution, focus on labor rights."
            }
        };
        return interpretations[role]?.[planet] || "";
    };

    // Calculate Houses for ZodiacChart
    // Lagna degree -> Sign
    const ascPlanet = chaitraData.planet_positions.find(p => p.planet === 'Ascendant');
    const lagnaSign = ascPlanet ? Math.floor(ascPlanet.fullDegree / 30) + 1 : 1;

    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseSign = ((lagnaSign + i - 1) % 12) + 1;
        const planetsInHouse = chaitraData.planet_positions
            .filter(p => p.planet !== 'Ascendant')
            .filter(p => Math.floor(p.fullDegree / 30) + 1 === houseSign)
            .map(p => p.planet);
        return {
            sign: houseSign,
            planets: planetsInHouse
        };
    });

    return (
        <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            <div className="bg-slate-800 border-b border-slate-700 p-4 shrink-0 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="text-2xl">👑</span> Chaitra Shukla Pratipada Chart (Hindu New Year)
                </h2>
                <div className="flex items-center gap-2">
                    <label className="text-slate-400 font-bold text-sm">Year:</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 outline-none font-bold"
                    >
                        {[...Array(10)].map((_, i) => {
                            const y = new Date().getFullYear() - 2 + i;
                            return <option key={y} value={y}>{y}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 p-6 gap-6 overflow-hidden">
                {/* Kundali Diagram */}
                <div className="flex-1 max-w-2xl bg-[#ffffea] rounded-xl border-4 border-[#00008b] p-6 shadow-2xl relative flex flex-col items-center">
                    <div className="absolute top-2 left-4 text-[#00008b] font-bold text-sm">
                        New Moon: {new Date(chaitraData.csp_datetime_utc + "Z").toLocaleString()}
                    </div>
                    {/* The size of the chart is controlled by the w-full max-w-[500px] aspect-square container */}
                    <div className="w-full max-w-[550px] aspect-square flex items-center justify-center mt-6">
                        <ZodiacChart houses={houses} variant="legacy" defaultRect={true} scaleText={1.5} />
                    </div>
                </div>

                {/* Analytical Dashboard */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                        <h3 className="text-[20px] font-black text-amber-400 mb-4 uppercase tracking-widest border-b border-slate-700 pb-2">Planetary Cabinet</h3>

                        <div className="space-y-3">
                            {Object.entries(chaitraData.cabinet).map(([role, planet]) => {
                                let colorClass = "border-slate-700/50";
                                let titleColor = "text-slate-300 text-lg";
                                let badgeColor = "bg-slate-700/50 text-slate-300 text-[16px] px-3 py-1";

                                if (role.includes("King")) {
                                    colorClass = "border-amber-900/50 bg-amber-900/10";
                                    titleColor = "text-amber-300 text-2xl";
                                    badgeColor = "bg-amber-500/20 text-amber-400 text-xl px-4 py-1.5";
                                } else if (role.includes("Minister")) {
                                    colorClass = "border-indigo-900/50 bg-indigo-900/10";
                                    titleColor = "text-indigo-300 text-xl";
                                    badgeColor = "bg-indigo-500/20 text-indigo-400 text-lg px-3 py-1.5";
                                }

                                return (
                                    <div key={role} className={`p-4 rounded-lg border ${colorClass}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className={`font-bold ${titleColor}`}>{role}</h4>
                                            <span className={`font-black rounded ${badgeColor}`}>
                                                {planet}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                        <h3 className="text-lg font-black text-slate-200 mb-2 uppercase tracking-widest border-b border-slate-700 pb-2">Mundane Details</h3>
                        <div className="space-y-2 mt-3 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Hindu New Year Starts:</span>
                                <span className="text-slate-200 font-bold">{new Date(chaitraData.csp_datetime_utc + "Z").toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mesha Sankranti:</span>
                                <span className="text-slate-200 font-bold">{new Date(chaitraData.mesha_sankranti_utc + "Z").toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
