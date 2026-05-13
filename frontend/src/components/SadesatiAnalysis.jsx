import React, { useEffect, useState } from 'react';
import { sadesatiData } from '../data/sadesatiData';

const SadesatiAnalysis = () => {
    const [worksheetData, setWorksheetData] = useState(null);
    const [apiReport, setApiReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('worksheetData');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setWorksheetData(parsed);
                fetchSadeSatiApi(parsed);
            } catch (e) {
                console.error(e);
                setError("Failed to parse worksheet data.");
                setLoading(false);
            }
        } else {
            setError("No profile data found. Please open the worksheet first.");
            setLoading(false);
        }
    }, []);

    const fetchSadeSatiApi = async (data) => {
        try {
            const basic = data.basic_details || {};
            const meta = data.meta || {};
            
            // Construct date string (YYYY-MM-DD)
            let date = basic.date || basic.birth_date;
            if (!date && basic.year && basic.month && basic.day) {
                date = `${basic.year}-${String(basic.month).padStart(2, '0')}-${String(basic.day).padStart(2, '0')}`;
            }
            
            // Construct time string (HH:mm)
            let time = basic.time || basic.birth_time;
            if (!time && (basic.hour !== undefined && basic.hour !== null)) {
                time = `${String(basic.hour || 0).padStart(2, '0')}:${String(basic.minute || 0).padStart(2, '0')}`;
            }
            
            const place = meta.location || basic.place || meta.city || basic.birth_place;

            console.log("[SADESATI DEBUG] Sending payload:", { date, time, place });

            if (!date || !time || !place || place === "Unknown") {
                throw new Error("Birth details (Date, Time, or Place) are incomplete or 'Unknown' in your profile.");
            }

            const response = await fetch('/api/sade-sati', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, time, place })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "API computation failed");
            }
            const result = await response.json();
            setApiReport(result);
        } catch (error) {
            console.error("API Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper for rendering bullet points
    const BulletList = ({ text }) => {
        if (!text) return null;
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        return (
            <div className="space-y-4">
                {paragraphs.map((para, i) => (
                    <p key={i} className="text-sm md:text-base leading-relaxed text-slate-700 font-serif">
                        {para}
                    </p>
                ))}
            </div>
        );
    };

    const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    if (loading) return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
                <p className="text-indigo-900 font-bold uppercase tracking-widest text-xs">Computing Saturn Cycle...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto">⚠️</div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">Computation Error</h2>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{error}</p>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                >
                    Retry Calculation
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f1f5f9] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
                            ♄
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-900">Advanced Sade Sati Engine</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">System Architecture V2.0</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
                
                {apiReport && (
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Risk Meter & Status */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-serif">♄</div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <span className="bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block">Risk Detection Engine</span>
                                        <h2 className="text-3xl font-black text-white">{apiReport.currentPhase}</h2>
                                        <p className="text-indigo-300 text-xs font-bold uppercase mt-1">Current Saturn Status</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-amber-400">{apiReport.riskScore}%</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${apiReport.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                                            Risk: {apiReport.riskLevel}
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Bar */}
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/5">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${apiReport.riskScore > 75 ? 'bg-red-500' : apiReport.riskScore > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${apiReport.riskScore}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className={`p-4 rounded-2xl border transition-all ${apiReport.ashtamaShani ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'}`}>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">Ashtama</p>
                                        <p className="text-xs font-bold">{apiReport.ashtamaShani ? "ACTIVE" : "Stable"}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all ${apiReport.ardhaAshtama ? 'bg-orange-500/20 border-orange-500/50' : 'bg-white/5 border-white/10'}`}>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">Ardha Ashtama</p>
                                        <p className="text-xs font-bold">{apiReport.ardhaAshtama ? "ACTIVE" : "Stable"}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all ${apiReport.kantakaShani ? 'bg-amber-500/20 border-amber-500/50' : 'bg-white/5 border-white/10'}`}>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">Kantaka Shani</p>
                                        <p className="text-xs font-bold">{apiReport.kantakaShani ? "DETECTED" : "Stable"}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all ${apiReport.peakTrigger ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/10'}`}>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">Degree Peak</p>
                                        <p className="text-xs font-bold">{apiReport.peakTrigger ? "TRIGGERED" : "Safe"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Major Life Cycles</h3>
                            <div className="space-y-10">
                                {apiReport.allCycles?.map((cycle, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{cycle.cycle}</span>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Cycle {cycle.cycle} ({cycle.summary})</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 pl-9">
                                            {cycle.phases.map((p, pIdx) => (
                                                <div key={pIdx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${p.phase === 'Peak' ? 'bg-red-500' : p.phase === 'Rising' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{p.phase}</p>
                                                            <p className="text-xs font-bold text-slate-800">{p.start} — {p.end}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-black text-indigo-400 uppercase">Age {p.age}+</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <p className="text-[9px] font-bold text-indigo-900 leading-tight">Timeline is approximate based on Saturn's 29.5-year tropical-sidereal cycle.</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Remedies Section */}
                {apiReport && (
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🛡️</div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Mitigation & Remedies</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Remedies Engine Output</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {apiReport?.remedies?.map((rem, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{i+1}</div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{rem}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technical Specs Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="space-y-6">
                            <div>
                                <span className="block font-black uppercase tracking-widest text-[10px] text-indigo-600 mb-2">Technical Engine</span>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Calculation Formula</h2>
                                <div className="w-12 h-1 bg-indigo-600 mt-4"></div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl font-mono text-sm text-slate-800 whitespace-pre-wrap border border-slate-100">
                                {sadesatiData.calculation_formula}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="space-y-6">
                            <div>
                                <span className="block font-black uppercase tracking-widest text-[10px] text-indigo-600 mb-2">Advanced Metrics</span>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Peak & Depth Diagnostics</h2>
                                <div className="w-12 h-1 bg-indigo-600 mt-4"></div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl font-mono text-sm text-slate-800 whitespace-pre-wrap border border-slate-100">
                                {sadesatiData.peak_and_advanced}
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
        </div>
    );
};

export default SadesatiAnalysis;
