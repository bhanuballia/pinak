import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Flame, Droplets, Wind, Mountain, Globe, Activity, Heart, ShieldAlert, Sparkles, BookOpen, Clock } from "lucide-react";

export default function MedicalAstrologyDashboard() {
    const [medicalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // "all", "elements", "body", "diagnostics", "remedies"
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [activeRemedyTab, setActiveRemedyTab] = useState("herbs"); // "herbs", "mantras", "colors", "lifestyle"

    useEffect(() => {
        const fetchMedicalData = async () => {
            setLoading(true);
            try {
                const localData = JSON.parse(localStorage.getItem('worksheetData'));
                if (!localData || !localData.planet_positions) {
                    throw new Error("No natal chart data found. Please generate a chart first.");
                }

                // Map natal positions
                const natalPositions = {};
                localData.planet_positions.forEach(p => {
                    natalPositions[p.planet] = p.degree;
                });

                // Try to find Ascendant degree
                let ascDeg = 0;
                if (localData.charts && localData.charts.ascendant_degree !== undefined) {
                    ascDeg = localData.charts.ascendant_degree;
                } else if (localData.planet_positions.find(p => p.planet === 'Ascendant')) {
                    ascDeg = localData.planet_positions.find(p => p.planet === 'Ascendant').degree;
                }
                natalPositions["Ascendant"] = ascDeg;

                const response = await axios.post("/api/medical-analysis", {
                    natal_positions: natalPositions,
                    transit_positions: null
                });

                setMedicalData(response.data);
            } catch (err) {
                console.error("Error fetching medical astrology data:", err);
                setError(err.response?.data?.detail || err.message || "Failed to load Ayur Jyotish data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white flex-col gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-xl font-bold animate-pulse">Calculating Tridosha & Health Vulnerabilities...</p>
                <p className="text-slate-400 text-sm">Parsing Kaal Purusha anatomy and transit alignments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="bg-red-900/30 p-8 rounded-xl border border-red-500 max-w-lg text-center backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-red-200 mb-4 flex items-center justify-center gap-2">
                        <ShieldAlert className="w-8 h-8 text-red-400" /> Ayur Jyotish Error
                    </h2>
                    <p className="text-red-100">{error}</p>
                </div>
            </div>
        );
    }

    const { tridosha, panchamahabhuta, vulnerability_timing, body_parts, diagnostics, remedies } = medicalData;
    const { scores: doshaScores, dominant: dominantDosha, secondary: secondaryDosha, prakriti } = tridosha;
    const vuln = vulnerability_timing;

    const elementIcons = {
        Fire: <Flame className="w-5 h-5 text-orange-500" />,
        Water: <Droplets className="w-5 h-5 text-blue-500" />,
        Air: <Wind className="w-5 h-5 text-sky-400" />,
        Earth: <Mountain className="w-5 h-5 text-amber-600" />,
        Space: <Globe className="w-5 h-5 text-purple-400" />
    };

    const elementColors = {
        Fire: "from-orange-500 to-red-600",
        Water: "from-blue-500 to-indigo-600",
        Air: "from-sky-400 to-teal-500",
        Earth: "from-amber-600 to-amber-800",
        Space: "from-purple-500 to-violet-700"
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans transition-colors duration-300">
            {/* Header */}
            <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 flex items-center gap-3">
                        🌿 Ayur Jyotish (Medical Astrology)
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Explore your Ayurvedic Tridosha balance, elemental makeup, body vulnerabilities, and healing remedies.
                    </p>
                </div>
                {/* Risk Level Badge */}
                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 self-start md:self-auto ${vuln.risk_level === 'High' ? 'bg-red-950/40 border-red-500/50 text-red-300' :
                    vuln.risk_level === 'Moderate' ? 'bg-amber-950/40 border-amber-500/50 text-amber-300' :
                        'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    }`}>
                    <Activity className={`w-6 h-6 animate-pulse ${vuln.risk_level === 'High' ? 'text-red-400' : vuln.risk_level === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Transit Health Risk</p>
                        <p className="text-base font-black uppercase tracking-wider">{vuln.risk_level} Risk</p>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-2">
                {[
                    { id: "all", label: "Dashboard Overview" },
                    { id: "elements", label: "Elements & Tridoshas" },
                    { id: "body", label: "Kaal Purusha Body Mapping" },
                    { id: "diagnostics", label: "Planet Organ Diagnostics" },
                    { id: "remedies", label: "Vedic Remedies" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-[20px] font-bold border-b-2 whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                            ? "border-emerald-500 text-emerald-400 bg-slate-900/50"
                            : "border-transparent text-orange-400 hover:text-slate-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                {/* 1. OVERVIEW DASHBOARD */}
                {(activeTab === "all" || activeTab === "elements") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* TRIDOSHA ANALYSIS */}
                        <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-emerald-400" /> Tridosha Prakriti Analysis
                            </h2>

                            <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-center">
                                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">Dominant Prakriti (Constitution)</p>
                                <h3 className="text-3xl font-black text-emerald-300 mt-1">{prakriti.toUpperCase()}</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Vata */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-sky-400 flex items-center gap-2">
                                            <Wind className="w-4 h-4" /> VATA (Air & Space)
                                        </span>
                                        <span className="font-bold text-sky-300">{doshaScores.Vata}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                        <div className="bg-sky-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${doshaScores.Vata}%` }}></div>
                                    </div>
                                </div>

                                {/* Pitta */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-orange-400 flex items-center gap-2">
                                            <Flame className="w-4 h-4" /> PITTA (Fire & Water)
                                        </span>
                                        <span className="font-bold text-orange-300">{doshaScores.Pitta}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                        <div className="bg-orange-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${doshaScores.Pitta}%` }}></div>
                                    </div>
                                </div>

                                {/* Kapha */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-emerald-400 flex items-center gap-2">
                                            <Droplets className="w-4 h-4" /> KAPHA (Earth & Water)
                                        </span>
                                        <span className="font-bold text-emerald-300">{doshaScores.Kapha}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                        <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${doshaScores.Kapha}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PANCHAMAHABHUTA ANALYSIS */}
                        <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                                <Globe className="w-6 h-6 text-purple-400" /> Panchamahabhuta (Elemental Balance)
                            </h2>

                            <div className="space-y-5">
                                {Object.entries(panchamahabhuta).map(([element, pct]) => (
                                    <div key={element}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold flex items-center gap-2 text-slate-200">
                                                {elementIcons[element]}
                                                {element.toUpperCase()}
                                            </span>
                                            <span className="font-bold text-slate-300">{pct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                            <div className={`bg-gradient-to-r ${elementColors[element]} h-3 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. BODY PART MAPPING */}
                {(activeTab === "all" || activeTab === "body") && (
                    <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                            <h2 className="text-[22px] font-bold text-rose-400 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-rose-400" /> Kaal Purusha Anatomical Vulnerabilities
                            </h2>
                            <span className="text-[16px] text-orange-400 italic">Click on any region to see details</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {body_parts.map((bp) => (
                                <button
                                    key={bp.organ}
                                    onClick={() => setSelectedBodyPart(selectedBodyPart?.organ === bp.organ ? null : bp)}
                                    className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${selectedBodyPart?.organ === bp.organ
                                        ? "bg-slate-850 border-teal-500 shadow-md shadow-teal-950/20 scale-[1.02]"
                                        : "bg-slate-950/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                                        }`}
                                >
                                    <div className="flex justify-between items-start w-full gap-2">
                                        <div>
                                            <span className="text-orange-400 font-medium text-[16px] uppercase tracking-wider">Rashi {bp.sign_num}</span>
                                            <h3 className="font-bold text-yellow-200 mt-0.5">{bp.organ}</h3>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[16px] uppercase font-bold rounded-md ${bp.risk_level === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                            bp.risk_level === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            }`}>
                                            {bp.risk_level}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between w-full">
                                        <span className="text-[16px] text-slate-400">Vulnerability Score</span>
                                        <span className="font-bold text-[18px] text-slate-300">{bp.score}/100</span>
                                    </div>
                                    <div className="w-full bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-1.5 rounded-full ${bp.risk_level === 'High' ? 'bg-red-500' :
                                            bp.risk_level === 'Moderate' ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                            }`} style={{ width: `${bp.score}%` }}></div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Body Part Detail Modal/Box */}
                        {selectedBodyPart && (
                            <div className="mt-6 p-5 bg-slate-950 rounded-xl border border-teal-500/30 animate-fade-in">
                                <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2 mb-2">
                                    🔍 Vulnerability Details: {selectedBodyPart.organ} (Zodiac Sign {selectedBodyPart.sign_num})
                                </h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    Calculated vulnerability factor: <span className="font-bold text-slate-200">{selectedBodyPart.score}/100</span>
                                </p>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Contributing Afflictions:</p>
                                    {!selectedBodyPart.reasons || selectedBodyPart.reasons.length === 0 ? (
                                        <p className="text-sm text-emerald-400">Stable. No malefic planets in transit or birth chart affecting this region.</p>
                                    ) : (
                                        <ul className="space-y-1.5">
                                            {selectedBodyPart.reasons.map((reason, idx) => (
                                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-red-400 mt-1">⚠️</span> {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. SYMPTOM & ORGAN DIAGNOSTIC TABLE */}
                {(activeTab === "all" || activeTab === "diagnostics") && (
                    <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-amber-400" /> Planet & Organ Diagnostic Analysis
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-4 font-bold">Planet</th>
                                        <th className="py-3 px-4 font-bold">Affliction Detail</th>
                                        <th className="py-3 px-4 font-bold">Governed Organs</th>
                                        <th className="py-3 px-4 font-bold">Potential Symptoms</th>
                                        <th className="py-3 px-4 font-bold text-center">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-850">
                                    {diagnostics.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-emerald-400 font-semibold bg-emerald-950/10">
                                                ✅ No significant planetary health afflictions found. Planetary systems show balanced energy.
                                            </td>
                                        </tr>
                                    ) : (
                                        diagnostics.map((diag, index) => (
                                            <tr key={index} className="hover:bg-slate-850/50 transition-colors">
                                                <td className="py-4 px-4 font-extrabold text-slate-200 flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                                    {diag.planet}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-300 font-medium">
                                                    {diag.affliction}
                                                </td>
                                                <td className="py-4 px-4 text-[16px] text-yellow-400">
                                                    {diag.organs}
                                                </td>
                                                <td className="py-4 px-4 text-[16px] text-orange-400">
                                                    {diag.symptoms}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[16px] font-bold ${diag.severity === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        }`}>
                                                        {diag.severity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 4. VEDIC REMEDIAL ACTIONS */}
                {(activeTab === "all" || activeTab === "remedies") && (
                    <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-teal-400 mb-6 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-teal-400" /> Vedic & Ayurvedic Health Remedies
                        </h2>

                        {/* Remedy Subtabs */}
                        <div className="flex border-b border-slate-800 mb-6 gap-2">
                            {[
                                { id: "herbs", label: "Herbs & Spices" },
                                { id: "mantras", label: "Healing Mantras" },
                                { id: "colors", label: "Color & Light Therapy" },
                                { id: "lifestyle", label: "Lifestyle & Routines" }
                            ].map((subtab) => (
                                <button
                                    key={subtab.id}
                                    onClick={() => setActiveRemedyTab(subtab.id)}
                                    className={`px-3 py-1.5 text-[18px] font-bold border-b-2 transition-all duration-300 ${activeRemedyTab === subtab.id
                                        ? "border-teal-500 text-teal-400"
                                        : "border-transparent text-slate-400 hover:text-slate-200"
                                        }`}
                                >
                                    {subtab.label}
                                </button>
                            ))}
                        </div>

                        {/* Remedy Content */}
                        <div className="space-y-4">
                            {activeRemedyTab === "herbs" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {remedies.herbs.map((herb, idx) => (
                                        <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex gap-3">
                                            <span className="text-emerald-400 text-[18px">🌿</span>
                                            <p className="text-[18px] text-slate-300">{herb}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeRemedyTab === "mantras" && (
                                <div className="space-y-3">
                                    {remedies.mantras.length === 0 ? (
                                        <p className="text-slate-400 italic text-[18px]">No critical mantras necessary. Standard meditation will suffice.</p>
                                    ) : (
                                        remedies.mantras.map((mantra, idx) => (
                                            <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-3">
                                                <span className="text-teal-400 text-lg">🕉️</span>
                                                <p className="text-[18px] text-slate-200 font-mono italic">{mantra}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeRemedyTab === "colors" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {remedies.color_therapy.map((col, idx) => (
                                        <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex gap-3">
                                            <span className="text-purple-400 text-[18px]">🎨</span>
                                            <p className="text-[18px] text-slate-300">{col}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeRemedyTab === "lifestyle" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {remedies.lifestyle.map((life, idx) => (
                                        <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex gap-3">
                                            <span className="text-sky-400 text-[18px]">🧘</span>
                                            <p className="text-[18px] text-slate-300">{life}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Disclaimer Section */}
            <footer className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-4 max-w-5xl mx-auto">
                <h4 className="font-extrabold text-slate-300 text-sm tracking-wider uppercase flex items-center gap-2">
                    ⚠️ Medical Astrology Disclaimer
                </h4>
                <p>
                    The information presented on this page is based on traditional principles of Medical Astrology as described in various ancient astrological texts, commentaries, and research studies. The content is provided solely for educational, historical, cultural, and research purposes.
                </p>
                <p>
                    Medical Astrology is a traditional astrological discipline that attempts to explore possible relationships between planetary positions and human health. The interpretations, indications, and astrological combinations discussed on this page should not be regarded as scientifically established medical facts, medical diagnoses, or medical advice.
                </p>
                <p>
                    The presence of any planetary combination, yoga, house placement, or astrological indication does not guarantee the occurrence, absence, severity, or outcome of any disease, medical condition, or health-related issue. Astrological indications must never be interpreted as a substitute for professional medical evaluation.
                </p>
                <p>
                    Readers should not use the information on this page to diagnose, treat, prevent, or manage any medical condition. If you have concerns regarding your health, symptoms, medical treatment, medications, or physical or mental well-being, please consult a qualified physician, healthcare professional, or licensed medical practitioner.
                </p>
                <p>
                    Astroshastra does not claim that Medical Astrology can replace modern medicine, clinical diagnosis, laboratory testing, psychological evaluation, emergency care, or professional healthcare services. Any astrological observations should be considered complementary perspectives only and not a replacement for evidence-based medical care.
                </p>
                <p>
                    By using this page, readers acknowledge that the content is intended solely for educational study of traditional astrological literature and that all health-related decisions should be made in consultation with qualified healthcare professionals.
                </p>
            </footer>
        </div>
    );
}
