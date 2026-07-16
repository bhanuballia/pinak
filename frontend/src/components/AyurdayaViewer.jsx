import React, { useEffect, useState } from 'react';

export default function AyurdayaViewer({ data }) {
    const [ayurdayaData, setAyurdayaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAyurdayaData() {
            if (!data?.chart?.jd_ut) {
                setError("Incomplete chart data. Cannot calculate Ayurdaya.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("/api/ayurdaya/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jd_ut: data.chart.jd_ut,
                        lat: 28.6, // Fallback if missing
                        lon: 77.2
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    setAyurdayaData(result);
                } else {
                    setError(result.detail || "Failed to fetch Ayurdaya data");
                }
            } catch (err) {
                setError("Server error.");
            } finally {
                setLoading(false);
            }
        }
        fetchAyurdayaData();
    }, [data]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-teal-400 font-bold animate-pulse text-2xl">Calculating Prana (Life Force)...</div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-slate-900 min-h-screen">{error}</div>;

    const renderGauge = () => {
        const score = ayurdayaData.composite_score;
        let color = 'text-green-500';
        if (score < 40) color = 'text-red-500';
        else if (score < 75) color = 'text-amber-500';
        
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🧬</div>
                <h2 className="text-xl font-bold text-slate-300 mb-6">Composite Vitality Gauge</h2>
                
                <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-slate-700">
                    {/* Fake gauge fill */}
                    <div className="absolute inset-0 rounded-full border-8 border-t-teal-500 border-r-teal-500 border-b-transparent border-l-transparent" 
                         style={{ transform: `rotate(${(score / 100) * 360 - 45}deg)`, transition: 'transform 1s ease-out' }}></div>
                    
                    <div className="text-center z-10">
                        <div className={`text-5xl font-black ${color}`}>{score}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</div>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Vitality Band</div>
                    <div className={`text-2xl font-bold ${color}`}>{ayurdayaData.vitality_band} Capacity</div>
                </div>
            </div>
        );
    };

    const renderJaimini = () => {
        const j = ayurdayaData.jaimini_pairs;
        return (
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
                    <span>⚖️</span> Jaimini Three-Pair Method
                </h3>
                <p className="text-sm text-slate-400 mb-6">Classical Jaimini astrology evaluates longevity based on the elemental nature (Moveable, Fixed, Dual) of three key planetary pairs.</p>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 font-medium">Lagna & Hora Lagna</span>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${j.lagna_and_hora === 'Long' ? 'bg-green-900/50 text-green-400' : j.lagna_and_hora === 'Short' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>{j.lagna_and_hora}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 font-medium">Lagna Lord & 8th Lord</span>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${j.lords_1_and_8 === 'Long' ? 'bg-green-900/50 text-green-400' : j.lords_1_and_8 === 'Short' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>{j.lords_1_and_8}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                        <span className="text-slate-300 font-medium">Moon & Saturn</span>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${j.moon_and_saturn === 'Long' ? 'bg-green-900/50 text-green-400' : j.moon_and_saturn === 'Short' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>{j.moon_and_saturn}</span>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="text-center">
                        <span className="text-slate-400 text-sm">Final Consensus: </span>
                        <span className="text-lg font-bold text-white ml-2">{j.final_consensus} Vitality</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderPindayu = () => {
        const p = ayurdayaData.pindayu;
        return (
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 md:col-span-2">
                <h3 className="text-lg font-bold text-teal-400 mb-4">Pindayu Contributions (Sri Pati Method)</h3>
                <p className="text-sm text-slate-400 mb-6">Planets grant life force points based on their distance from their point of deep debilitation. Planets in exaltation grant maximum vitality.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.entries(p.planet_contributions).map(([planet, years]) => (
                        <div key={planet} className="bg-slate-900 p-4 rounded-xl text-center border border-slate-700/50 hover:border-teal-500/50 transition-colors">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{planet}</div>
                            <div className="text-xl font-bold text-slate-200">{years} <span className="text-xs text-slate-500 font-normal">pts</span></div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-teal-900/20 border border-teal-500/30 rounded-lg flex justify-between items-center">
                    <span className="text-teal-200 font-medium">Total Pindayu Base Score</span>
                    <span className="text-2xl font-black text-teal-400">{p.total_pindayu_years}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-2">
                        Ayurdaya (Life Force)
                    </h1>
                    <p className="text-slate-400">Advanced mathematical vitality calculations combining Pindayu, Nisargayu, and Jaimini methodologies.</p>
                </div>

                {/* Disclaimer Alert */}
                <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-amber-500 text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-400">Ethical Disclaimer</h3>
                            <div className="mt-1 text-sm text-amber-200/80">
                                <p>Astrological longevity calculations measure <em>mathematical vitality reserves</em>, not a fatalistic lifespan. Medical science, lifestyle, and environment supersede these calculations. Use this data strictly as a guide to understand baseline resilience.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderGauge()}
                    {renderJaimini()}
                    {renderPindayu()}
                </div>

            </div>
        </div>
    );
}
