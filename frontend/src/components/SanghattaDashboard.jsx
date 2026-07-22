import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function SanghattaDashboard() {
    const [sanghattaData, setSanghattaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(err => console.error("Video play error:", err));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        const fetchSanghatta = async () => {
            setLoading(true);
            try {
                // Try to get transit planets from the local worksheet data if available
                let transitPlanets = null;
                const localData = JSON.parse(localStorage.getItem('worksheetData'));
                if (localData?.transitData) {
                    const planetsArray = Array.isArray(localData.transitData)
                        ? localData.transitData
                        : (localData.transitData.planets || []);

                    if (planetsArray.length > 0) {
                        transitPlanets = {};
                        planetsArray.forEach(p => {
                            transitPlanets[p.name] = p.fullDegree;
                        });
                    }
                }

                // Call the API (if transitPlanets is null, backend uses current live transits)
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/sanghatta-chakra`, {
                    transit_planets: transitPlanets
                });

                setSanghattaData(response.data);
            } catch (err) {
                console.error("Sanghatta Error:", err);
                setError("Failed to generate Sanghatta Chakra.");
            } finally {
                setLoading(false);
            }
        };

        fetchSanghatta();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-900"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-slate-900 min-h-screen">{error}</div>;
    if (!sanghattaData) return null;

    // Constants for SVG Drawing
    const SVGCenter = { x: 400, y: 400 };
    const Radius = 340;
    const nakshatras_28 = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
        "Abhijit", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati"
    ];

    const nakshatra_hi = {
        "Ashwini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका", "Rohini": "रोहिणी",
        "Mrigashira": "मृगशिरा", "Ardra": "आर्द्रा", "Punarvasu": "पुनर्वसु", "Pushya": "पुष्य",
        "Ashlesha": "अश्लेषा", "Magha": "मघा", "Purva Phalguni": "पूर्वा फाल्गुनी",
        "Uttara Phalguni": "उत्तरा फाल्गुनी", "Hasta": "हस्त", "Chitra": "चित्रा",
        "Swati": "स्वाती", "Vishakha": "विशाखा", "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा",
        "Mula": "मूल", "Purva Ashadha": "पूर्वाषाढ़ा", "Uttara Ashadha": "उत्तराषाढ़ा",
        "Abhijit": "अभिजित", "Shravana": "श्रवण", "Dhanishta": "धनिष्ठा",
        "Shatabhisha": "शतभिषा", "Purva Bhadrapada": "पूर्व भाद्रपद",
        "Uttara Bhadrapada": "उत्तर भाद्रपद", "Revati": "रेवती"
    };

    const planet_hi = {
        "Sun": "सूर्य", "Moon": "चन्द्र", "Mars": "मंगल", "Mercury": "बुध",
        "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
    };

    const tNakshatra = (name) => language === 'hi' ? (nakshatra_hi[name] || name) : name;
    const tPlanet = (name) => language === 'hi' ? (planet_hi[name] || name) : name;

    // Helper to get coordinates for a specific Nakshatra index (1 to 28)
    const getCoords = (index) => {
        // -90 degrees so Ashwini (index 1) starts at the top
        const angle = (index - 1) * (360 / 28) - 90;
        const rad = (angle * Math.PI) / 180;
        return {
            x: SVGCenter.x + Radius * Math.cos(rad),
            y: SVGCenter.y + Radius * Math.sin(rad)
        };
    };

    return (
        <div className="w-full h-screen bg-slate-100 text-white flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            <div className="bg-slate-900 border-b border-slate-800 p-5 shrink-0 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-indigo-100">
                        <span className="text-3xl">⚔️</span> Sanghatta Chakra (28 Nakshatras)
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Advanced Mundane distress index tracking stock markets, commodities, and political shifts via planetary Vedha (Affliction).
                    </p>
                </div>
                <button
                    onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-all shadow-md flex items-center gap-2"
                >
                    <span>🌍</span> {language === 'en' ? 'View in Hindi' : 'View in English'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row p-6 gap-6">
                {/* SVG Visualizer */}
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl relative flex items-center justify-center min-h-[600px] overflow-hidden">
                    <video
                        ref={videoRef}
                        src="/deities/starts.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
                    />
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 border border-slate-700"
                    >
                        <span>{isPlaying ? '⏸️ Pause Background' : '▶️ Play Background'}</span>
                    </button>
                    <svg viewBox="0 0 800 800" className="w-full h-full max-h-[700px] max-w-[700px] z-10 relative">
                        {/* Draw the Outer Circle */}
                        <circle cx={SVGCenter.x} cy={SVGCenter.y} r={Radius} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />

                        {/* Draw the Vedha (Affliction) Lines */}
                        {sanghattaData.vedhas.map((vedha, idx) => {
                            const sourceIdx = nakshatras_28.indexOf(vedha.source_nakshatra) + 1;
                            const targetIdx = nakshatras_28.indexOf(vedha.target_nakshatra) + 1;
                            const sourceCoords = getCoords(sourceIdx);
                            const targetCoords = getCoords(targetIdx);

                            // If there's an actual collision (target nakshatra also has planets), make it glow bright red
                            const isCollision = vedha.affected_planets.length > 0;

                            return (
                                <line
                                    key={`vedha-${idx}`}
                                    x1={sourceCoords.x} y1={sourceCoords.y}
                                    x2={targetCoords.x} y2={targetCoords.y}
                                    stroke={isCollision ? "#ef4444" : "rgba(239, 68, 68, 0.3)"}
                                    strokeWidth={isCollision ? "4" : "2"}
                                    strokeDasharray={isCollision ? "none" : "8,4"}
                                />
                            );
                        })}

                        {/* Draw the 28 Nakshatras */}
                        {nakshatras_28.map((nakName, idx) => {
                            const nIndex = idx + 1;
                            const coords = getCoords(nIndex);

                            // Check if planets are here
                            const planetsHere = sanghattaData.planet_positions.filter(p => p.nakshatra === nakName);
                            const isAfflictedTarget = sanghattaData.vedhas.some(v => v.target_nakshatra === nakName);
                            const isMaleficSource = sanghattaData.vedhas.some(v => v.source_nakshatra === nakName);

                            let dotColor = "#475569"; // Neutral
                            if (isMaleficSource) dotColor = "#ef4444"; // Red for Malefic Source
                            else if (planetsHere.length > 0) dotColor = "#10b981"; // Green for Benefics
                            else if (isAfflictedTarget) dotColor = "#f59e0b"; // Orange for Afflicted empty space

                            return (
                                <g key={nakName} transform={`translate(${coords.x}, ${coords.y})`}>
                                    <circle r="12" fill={dotColor} stroke="#1e293b" strokeWidth="2" />

                                    <text
                                        x="0" y="-22"
                                        textAnchor="middle"
                                        fill={isAfflictedTarget ? "#fca5a5" : "#94a3b8"}
                                        fontSize="18"
                                        fontWeight="bold"
                                    >
                                        {tNakshatra(nakName)}
                                    </text>

                                    {/* Draw Planet Names if present */}
                                    {planetsHere.map((p, pIdx) => (
                                        <text
                                            key={p.planet}
                                            x="0" y={22 + (pIdx * 16)}
                                            textAnchor="middle"
                                            fill={p.is_malefic ? "#ef4444" : "#10b981"}
                                            fontSize="16"
                                            fontWeight="black"
                                        >
                                            {tPlanet(p.planet)}
                                        </text>
                                    ))}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Analytical Panel */}
                <div className="w-full lg:w-1/3 flex flex-col gap-5">
                    {/* Market Risk Assessment */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xl font-black text-indigo-400 mb-6 uppercase tracking-widest border-b border-slate-700 pb-3">Market Risk Assessment</h3>

                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-slate-300 font-bold text-lg">Overall Risk Level:</span>
                            <span className={`px-4 py-1.5 rounded-full font-black tracking-wider text-sm
                                ${sanghattaData.risk_assessment.level === "HIGH" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                    sanghattaData.risk_assessment.level === "MODERATE" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}>
                                {sanghattaData.risk_assessment.level} ({sanghattaData.risk_assessment.score}/100)
                            </span>
                        </div>

                        <div className="space-y-3">
                            {sanghattaData.risk_assessment.analysis.map((insight, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex gap-3">
                                    <span className="text-indigo-400 mt-0.5">▪</span>
                                    <p className="text-slate-300 leading-relaxed text-sm">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Vedhas (Afflictions) */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xl font-black text-red-400 mb-6 uppercase tracking-widest border-b border-slate-700 pb-3">Active Malefic Vedhas</h3>

                        {sanghattaData.vedhas.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No significant malefic Vedhas active.</p>
                        ) : (
                            <div className="space-y-4">
                                {sanghattaData.vedhas.map((vedha, idx) => (
                                    <div key={idx} className="bg-red-950/20 p-4 rounded-xl border border-red-900/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-red-400 font-bold">{vedha.source_planet}</span>
                                            <span className="text-slate-500 text-xs">PIERCES ➔</span>
                                            <span className="text-orange-400 font-bold">{vedha.target_nakshatra}</span>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Source: {vedha.source_nakshatra}
                                            {vedha.affected_planets.length > 0 && (
                                                <div className="mt-2 text-red-300 bg-red-950/50 px-3 py-2 rounded border border-red-900/50">
                                                    <strong>COLLISION:</strong> Hits {vedha.affected_planets.join(", ")} at target!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
