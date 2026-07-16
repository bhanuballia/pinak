import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function MedicalAstrologyDashboard() {
    const [medicalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
                <p className="text-xl font-bold animate-pulse">Calculating Tridosha & Health Vulnerabilities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="bg-red-900/50 p-8 rounded-xl border border-red-500 max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-red-200 mb-4">Ayur Jyotish Error</h2>
                    <p className="text-red-100">{error}</p>
                </div>
            </div>
        );
    }

    const { tridosha, recommendations, vulnerability_timing } = medicalData;
    const { scores, dominant, secondary, prakriti } = tridosha;
    const vuln = vulnerability_timing;

    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
            <header className="mb-8 border-b-2 border-teal-600 pb-4">
                <h1 className="text-4xl font-black text-teal-800 flex items-center gap-3">
                    🌿 Ayur Jyotish (Medical Astrology)
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                    Ayurvedic Tridosha balance and Astrological disease onset vulnerability tracking.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TRIDOSHA ANALYSIS */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                    <h2 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
                        <span className="text-3xl">⚖️</span> Tridosha Prakriti Analysis
                    </h2>
                    
                    <div className="mb-6 p-4 bg-teal-50 rounded-xl text-center">
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Dominant Prakriti (Constitution)</p>
                        <h3 className="text-3xl font-black text-teal-900 mt-1">{prakriti.toUpperCase()}</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Vata */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sky-700">VATA (Air & Space)</span>
                                <span className="font-bold">{scores.Vata}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div className="bg-sky-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${scores.Vata}%` }}></div>
                            </div>
                        </div>

                        {/* Pitta */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-orange-600">PITTA (Fire & Water)</span>
                                <span className="font-bold">{scores.Pitta}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div className="bg-orange-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${scores.Pitta}%` }}></div>
                            </div>
                        </div>

                        {/* Kapha */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-emerald-700">KAPHA (Earth & Water)</span>
                                <span className="font-bold">{scores.Kapha}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div className="bg-emerald-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${scores.Kapha}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Diet & Lifestyle Recommendations</h3>
                        <ul className="space-y-3">
                            {recommendations.map((rec, i) => (
                                <li key={i} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span>👉</span> {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* VULNERABILITY TIMING */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 flex flex-col">
                    <h2 className="text-2xl font-bold text-rose-700 mb-6 flex items-center gap-2">
                        <span className="text-3xl">⚕️</span> Disease Vulnerability (Transits)
                    </h2>

                    <div className={`mb-6 p-6 rounded-xl text-center border-2 ${vuln.risk_level === 'High' ? 'bg-red-50 border-red-500' : vuln.risk_level === 'Moderate' ? 'bg-orange-50 border-orange-400' : 'bg-green-50 border-green-500'}`}>
                        <p className="text-slate-600 uppercase tracking-widest text-sm font-bold mb-2">Current Health Risk Level</p>
                        <h3 className={`text-4xl font-black ${vuln.risk_level === 'High' ? 'text-red-700' : vuln.risk_level === 'Moderate' ? 'text-orange-600' : 'text-green-700'}`}>
                            {vuln.risk_level.toUpperCase()}
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg border text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Khara Lord (22nd Drek)</p>
                            <p className="font-black text-slate-800">{vuln.khara_lord}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">6th Lord (Acute)</p>
                            <p className="font-black text-slate-800">{vuln.sixth_lord}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">8th Lord (Chronic)</p>
                            <p className="font-black text-slate-800">{vuln.eighth_lord}</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-xl p-6 shadow-inner text-white">
                        <h3 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2 mb-4">Active Transit Afflictions</h3>
                        {vuln.active_vulnerabilities.length === 0 ? (
                            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-900/30 p-4 rounded-lg">
                                <span>✅</span>
                                <p>No major malefic transits currently afflicting your critical health lords. Health should be stable.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {vuln.active_vulnerabilities.map((v, i) => (
                                    <li key={i} className="flex gap-3 text-red-200 bg-red-950/50 p-3 rounded-lg border border-red-900/50">
                                        <span>⚠️</span> {v}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        <p className="text-xs text-slate-500 mt-6 italic text-center">
                            Based on transits of Saturn, Mars, Rahu, and Ketu over the critical natal lords.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
