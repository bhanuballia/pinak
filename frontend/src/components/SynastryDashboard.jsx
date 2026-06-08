import React, { useState, useEffect } from 'react';

export default function SynastryDashboard({ p1Data, p2Data, standalone = true }) {
    const [loading, setLoading] = useState(false);
    const [synastryResult, setSynastryResult] = useState(null);
    const [error, setError] = useState(null);
    const [savedProfiles, setSavedProfiles] = useState([]);
    
    // For standalone mode: selecting a partner
    const [selectedProfileId, setSelectedProfileId] = useState("");

    const fetchProfiles = async () => {
        try {
            const res = await fetch("/api/profiles");
            const data = await res.json();
            setSavedProfiles(data);
        } catch (e) {
            console.error("Failed to load profiles", e);
        }
    };

    useEffect(() => {
        if (standalone) {
            fetchProfiles();
        }
        
        // If we are embedded in matchmaking and already have both profiles, run analysis automatically
        if (!standalone && p1Data && p2Data) {
            runSynastry(p1Data, p2Data);
        }
    }, [standalone, p1Data, p2Data]);

    const handleProfileSelect = async (e) => {
        const profileId = e.target.value;
        setSelectedProfileId(profileId);
        if (!profileId) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/profiles/${profileId}`);
            const profile = await res.json();
            // Run analysis with p1 (current user) and p2 (selected profile)
            runSynastry(p1Data, profile);
        } catch (err) {
            setError("Failed to load selected profile data.");
            setLoading(false);
        }
    };

    const runSynastry = async (person1, person2) => {
        setLoading(true);
        setError(null);
        try {
            // Check if we have planet_positions directly
            const payload = {
                p1_name: person1.name || person1.title + " " + person1.name || "Person 1",
                p2_name: person2.name || person2.title + " " + person2.name || "Person 2",
            };
            
            if (person1.planet_positions) payload.p1_positions = person1.planet_positions;
            else payload.p1_data = person1;
            
            if (person2.planet_positions) payload.p2_positions = person2.planet_positions;
            else payload.p2_data = person2;

            const response = await fetch("/api/synastry/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const resultData = await response.json();
            if (response.ok) {
                setSynastryResult(resultData);
            } else {
                setError(resultData.detail || "Failed to analyze synastry.");
            }
        } catch (err) {
            console.error("Synastry fetch error:", err);
            setError(`Error: ${err.message || "Is the backend running?"}`);
        }
        setLoading(false);
    };

    const formatReading = (text) => {
        const sections = text.split("###");
        return sections.map((sec, idx) => {
            if (!sec.trim()) return null;
            const lines = sec.split("\n");
            const title = lines[0].trim();
            const body = lines.slice(1).join("\n").trim();
            
            return (
                <div key={idx} className="mb-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                    {title && <h3 className="text-xl font-bold text-indigo-400 mb-3 border-b border-indigo-900/50 pb-2 flex items-center gap-2"><span>✨</span> {title}</h3>}
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{body}</div>
                </div>
            );
        });
    };

    const bodies = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    return (
        <div className={`${standalone ? "min-h-screen bg-slate-950 text-slate-200 p-8" : "w-full text-slate-200 mt-12 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-2xl"}`}>
            <div className="max-w-6xl mx-auto">
                {standalone && (
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-500 flex items-center gap-3">
                                <span className="text-4xl">🔮</span> Relationship Matrix (Synastry)
                            </h1>
                            <p className="text-slate-400 mt-1">Exact geometric planetary alignments between two people.</p>
                        </div>
                        <button onClick={() => window.close()} className="text-slate-400 hover:text-white">✕ Close</button>
                    </div>
                )}
                
                {!standalone && (
                    <div className="text-center mb-12">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-2">Advanced Synchronization</h3>
                        <h2 className="text-4xl font-serif italic text-white">Planetary Relationship Matrix</h2>
                    </div>
                )}

                {standalone && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <div className="text-sm font-bold text-slate-400 mb-1">Anchor Profile (You)</div>
                            <div className="text-lg font-serif italic text-slate-200 bg-slate-800 p-3 rounded-xl border border-slate-700">{p1Data?.name || "Current User"}</div>
                        </div>
                        <div className="text-2xl text-slate-500 font-serif italic">vs</div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-slate-400 mb-1">Select Partner/Friend</div>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                                value={selectedProfileId}
                                onChange={handleProfileSelect}
                                disabled={loading}
                            >
                                <option value="">-- Choose from saved profiles --</option>
                                {savedProfiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.date})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="py-20 text-center text-slate-500 animate-pulse">
                        <div className="text-6xl mb-4">✨</div>
                        <h2 className="text-xl font-bold text-indigo-400">Calculating Geometric Inter-Aspects...</h2>
                    </div>
                )}
                
                {error && (
                    <div className="bg-rose-900/30 border border-rose-500/50 p-6 rounded-xl text-center text-rose-200">
                        <h3 className="font-bold text-lg mb-2">Error</h3>
                        <p>{error}</p>
                    </div>
                )}

                {synastryResult && !loading && (
                    <div className="space-y-12">
                        
                        {/* THE 10x10 MATRIX GRID */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 overflow-x-auto">
                            <h3 className="text-lg font-bold text-slate-300 mb-4 flex justify-between">
                                <span>The Inter-Aspect Grid</span>
                                <span className="text-xs font-normal text-slate-500 flex gap-4">
                                    <span><span className="text-blue-400">☌</span> Conjunction (0°)</span>
                                    <span><span className="text-emerald-400">△</span> Trine (120°)</span>
                                    <span><span className="text-rose-400">☍</span> Opposition (180°)</span>
                                    <span><span className="text-amber-400">□</span> Square (90°)</span>
                                    <span><span className="text-teal-400">⚹</span> Sextile (60°)</span>
                                </span>
                            </h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-2 border border-slate-800 bg-slate-950/50 text-[10px] font-black uppercase text-slate-500 w-24">
                                            {synastryResult.p1_name} ↓ \ {synastryResult.p2_name} →
                                        </th>
                                        {bodies.map(b => (
                                            <th key={b} className="p-2 border border-slate-800 bg-slate-950/50 text-xs font-bold text-slate-300 text-center w-12 truncate" title={b}>
                                                {b.substring(0,3)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bodies.map(b1 => (
                                        <tr key={b1}>
                                            <th className="p-2 border border-slate-800 bg-slate-950/50 text-xs font-bold text-slate-300 text-right truncate" title={b1}>
                                                {b1}
                                            </th>
                                            {bodies.map(b2 => {
                                                const aspect = synastryResult.matrix[b1]?.[b2];
                                                let cellClass = "p-2 border border-slate-800 text-center text-lg transition-colors cursor-default hover:bg-slate-800 h-12";
                                                let content = "";
                                                let color = "text-slate-600";
                                                let tooltip = "";
                                                
                                                if (aspect) {
                                                    content = aspect.symbol;
                                                    tooltip = `${synastryResult.p1_name}'s ${b1} ${aspect.aspect_name} ${synastryResult.p2_name}'s ${b2} (Orb: ${aspect.orb_distance}°)`;
                                                    
                                                    if (aspect.type === "intense") { cellClass += " bg-blue-900/10"; color = "text-blue-400 font-bold"; }
                                                    else if (aspect.type === "flow") { cellClass += " bg-emerald-900/10"; color = "text-emerald-400 font-bold"; }
                                                    else if (aspect.type === "challenge") { cellClass += " bg-rose-900/10"; color = "text-rose-400 font-bold"; }
                                                    else if (aspect.type === "friction") { cellClass += " bg-amber-900/10"; color = "text-amber-400 font-bold"; }
                                                    else if (aspect.type === "opportunity") { cellClass += " bg-teal-900/10"; color = "text-teal-400 font-bold"; }
                                                    
                                                    if (aspect.is_exact) color += " drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]";
                                                }
                                                
                                                return (
                                                    <td key={b2} className={cellClass} title={tooltip}>
                                                        <span className={color}>{content}</span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* How to Read the Matrix */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-xl border border-indigo-900/50">
                            <h4 className="text-md font-bold text-indigo-400 mb-2 flex items-center gap-2">
                                <span>ℹ️</span> How to Read This Matrix
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                The Planetary Relationship Matrix (or Synastry Grid) shows the geometric angles (aspects) between the planets in your chart and your partner's chart. 
                                The rows represent your planets, and the columns represent your partner's planets. 
                                When two planets are separated by a specific angle, they form an aspect that influences the relationship dynamics.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
                                <div><strong className="text-blue-400">☌ Conjunction (0°)</strong>: Intense merging of energies. Can be very harmonious or challenging.</div>
                                <div><strong className="text-emerald-400">△ Trine (120°)</strong>: Natural flow, harmony, and easy compatibility.</div>
                                <div><strong className="text-rose-400">☍ Opposition (180°)</strong>: Polarity and magnetism. Brings tension but also balance.</div>
                                <div><strong className="text-amber-400">□ Square (90°)</strong>: Friction and challenges that require compromise and bring growth.</div>
                                <div className="md:col-span-2"><strong className="text-teal-400">⚹ Sextile (60°)</strong>: Opportunities for cooperation and pleasant interactions.</div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 italic">
                                Tip: Hover over any symbol in the grid to see the exact planets involved and the "orb" (how exact the angle is). A smaller orb means a stronger effect! Glowing symbols indicate exact aspects.
                            </p>
                        </div>

                        {/* Top Aspects List */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800">
                            <h3 className="text-lg font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Tightest Planetary Connections</h3>
                            <div className="flex flex-wrap gap-3">
                                {synastryResult.top_hits.map((hit, i) => (
                                    <div key={i} className={`px-4 py-2 rounded-xl border text-sm font-medium ${hit.is_exact ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                        {hit.p1_body} <span className="mx-2 text-lg">{hit.symbol}</span> {hit.p2_body}
                                        <span className="text-[10px] ml-2 opacity-50 uppercase">{hit.orb_distance}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Reading */}
                        <div className="prose prose-invert max-w-none">
                            {formatReading(synastryResult.reading)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
