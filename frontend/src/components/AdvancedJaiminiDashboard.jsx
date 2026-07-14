import React, { useEffect, useState } from 'react';
import ZodiacRectSign from './ZodiacRectSign'; // Can reuse for chart if needed

export default function AdvancedJaiminiDashboard({ data }) {
    const [jaiminiData, setJaiminiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('chara_dasha');

    useEffect(() => {
        async function fetchJaiminiData() {
            if (!data?.chart?.jd_ut) {
                setError("Incomplete chart data. Cannot calculate Jaimini techniques.");
                setLoading(false);
                return;
            }
            try {
                const lagnaSign = data.chart.houses?.[1]?.sign_name || "Aries";
                
                const response = await fetch("http://localhost:8000/api/jaimini_advanced/advanced", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jd_ut: data.chart.jd_ut,
                        lat: 28.6, // Fallback coords if missing from core data (since jd_ut is primary)
                        lon: 77.2,
                        lagna_sign: lagnaSign
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    setJaiminiData(result);
                } else {
                    setError(result.detail || "Failed to fetch Jaimini data");
                }
            } catch (err) {
                setError("Server error.");
            } finally {
                setLoading(false);
            }
        }
        fetchJaiminiData();
    }, [data]);

    if (loading) return <div className="p-8 text-center text-amber-500 animate-pulse">Calculating Advanced Jaimini Techniques...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const renderCharaDasha = () => {
        if (!jaiminiData?.chara_dasha) return null;
        return (
            <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Chara Dasha (K.N. Rao Method)</h3>
                <div className="overflow-x-auto border border-slate-700 rounded-lg">
                    <table className="min-w-full text-sm text-left text-slate-300">
                        <thead className="bg-slate-800 text-slate-200">
                            <tr>
                                <th className="px-4 py-3">Mahadasha Sign</th>
                                <th className="px-4 py-3">Duration (Years)</th>
                                <th className="px-4 py-3">Start (Julian Day)</th>
                                <th className="px-4 py-3">End (Julian Day)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jaiminiData.chara_dasha.map((dasha, idx) => (
                                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-semibold text-amber-300">{dasha.sign}</td>
                                    <td className="px-4 py-3">{dasha.duration_years} Years</td>
                                    <td className="px-4 py-3">{Math.floor(dasha.start_jd)}</td>
                                    <td className="px-4 py-3">{Math.floor(dasha.end_jd)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">Dates are in Julian Days. Note: To convert Julian Days to standard calendar dates, you can use the standard Astrological Time Machine.</p>
            </div>
        );
    };

    const renderRashiDrishti = () => {
        if (!jaiminiData?.rashi_drishti) return null;
        return (
            <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Rashi Drishti (Sign Aspects)</h3>
                <p className="text-sm text-slate-400 mb-4">In Jaimini astrology, signs aspect each other (not just planets). Moveable signs aspect Fixed signs, Fixed aspect Moveable, and Dual aspect Dual.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(jaiminiData.rashi_drishti).map(([sign, aspects], idx) => (
                        <div key={idx} className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                            <div className="font-bold text-white mb-2">{sign}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Aspects:</div>
                            <div className="flex flex-wrap gap-1">
                                {aspects.map((asp, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-amber-200">{asp}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderArgalas = () => {
        if (!jaiminiData?.argalas) return null;
        return (
            <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Argala Engine</h3>
                <p className="text-sm text-slate-400 mb-4">Argalas are planetary interventions. Virodha Argalas are obstructions to those interventions.</p>
                <div className="space-y-4">
                    {Object.entries(jaiminiData.argalas).map(([sign, argalaData], idx) => {
                        const eff = argalaData.effective_argala_planets;
                        if (!eff || eff.length === 0) return null;
                        
                        return (
                            <div key={idx} className="p-4 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-white">{sign}</span> is receiving Argala (Intervention) from:
                                </div>
                                <div className="flex gap-2">
                                    {eff.map((p, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-900/50 border border-indigo-500/50 text-indigo-300 rounded font-semibold text-sm">{p}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center gap-3">
                        <span className="text-emerald-400">🌀</span> Advanced Jaimini Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Explore deeper predictive layers including Chara Dasha, Argalas, and Rashi Drishti.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-2">
                    <button onClick={() => setActiveTab('chara_dasha')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'chara_dasha' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Chara Dasha</button>
                    <button onClick={() => setActiveTab('rashi_drishti')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'rashi_drishti' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Rashi Drishti</button>
                    <button onClick={() => setActiveTab('argalas')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'argalas' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Argalas</button>
                    <button onClick={() => setActiveTab('special_lagnas')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'special_lagnas' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Special Lagnas</button>
                    <button onClick={() => setActiveTab('mandook')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'mandook' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Mandook Dasha</button>
                    <button onClick={() => setActiveTab('navamsha_dasha')} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'navamsha_dasha' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>Navamsha Dasha</button>
                </div>

                {/* Content */}
                <div className="bg-slate-900 rounded-b-xl min-h-[50vh]">
                    {activeTab === 'chara_dasha' && renderCharaDasha()}
                    {activeTab === 'rashi_drishti' && renderRashiDrishti()}
                    {activeTab === 'argalas' && renderArgalas()}
                    
                    {activeTab === 'special_lagnas' && (
                        <div className="p-8 border border-dashed border-slate-700 rounded-lg text-center text-slate-400">
                            Special Lagnas (Hora Lagna & Ghatika Lagna) module requires precise sunset calculations.
                            <br />Currently available via the standard Astro Charts dashboard under "Special Lagnas".
                        </div>
                    )}
                    {activeTab === 'mandook' && (
                        <div className="p-8 border border-dashed border-slate-700 rounded-lg text-center text-slate-400">
                            Mandook Dasha is a conditional Dasha in Jaimini. It applies when specific planetary alignments occur involving the 6th, 8th, or 11th houses.
                            <br /><br />
                            <span className="text-amber-500 font-bold">Status: Awaiting conditional trigger logic.</span>
                        </div>
                    )}
                    {activeTab === 'navamsha_dasha' && (
                        <div className="p-8 border border-dashed border-slate-700 rounded-lg text-center text-slate-400">
                            Navamsha Dasha relies on D9 exact degrees. 
                            <br /><br />
                            <span className="text-amber-500 font-bold">Status: Awaiting Navamsha degree synchronization module.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
