import React, { useState, useEffect } from 'react';

export default function NadiViewer({ data }) {
    const [loading, setLoading] = useState(true);
    const [nadiResult, setNadiResult] = useState(null);
    const [error, setError] = useState(null);
    const [gender, setGender] = useState("Male");

    const fetchNadiReading = async (selectedGender) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8000/api/nadi/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planet_positions: data.planet_positions,
                    gender: selectedGender
                })
            });
            const resultData = await response.json();
            if (response.ok) {
                setNadiResult(resultData);
            } else {
                setError(resultData.detail || "Failed to load Nadi reading.");
            }
        } catch (err) {
            setError("Network error. Is the backend running?");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (data && data.planet_positions) {
            fetchNadiReading(gender);
        }
    }, [data]);

    const handleGenderChange = (newGender) => {
        setGender(newGender);
        fetchNadiReading(newGender);
    };

    if (loading && !nadiResult) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                <div className="text-center animate-pulse">
                    <div className="text-6xl mb-4">📜</div>
                    <h2 className="text-2xl font-bold text-amber-400">Consulting the Bhrigu Nandi Nadi...</h2>
                    <p className="text-slate-400 mt-2">Calculating planetary trines and conjunctions</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8">
                <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl max-w-lg text-center text-red-200">
                    <h3 className="font-bold text-lg mb-2">Error</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.close()}
                        className="mt-4 px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    if (!nadiResult) return null;

    const trines = nadiResult.nadi_data.elemental_trines;

    // Formatting the AI text nicely
    const formatReading = (text) => {
        const sections = text.split("###");
        return sections.map((sec, idx) => {
            if (!sec.trim()) return null;
            const lines = sec.split("\n");
            const title = lines[0].trim();
            const body = lines.slice(1).join("\n").trim();

            return (
                <div key={idx} className="mb-8">
                    {title && <h3 className="text-2xl font-bold text-amber-400 mb-3 border-b border-amber-900/50 pb-2">{title}</h3>}
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{body}</div>
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-white text-slate-200 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
                            <span className="text-4xl">📜</span> Bhrigu Nandi Nadi Reading
                        </h1>
                        <p className="text-slate-400 mt-1">Based entirely on Planetary Conjunctions and Trines</p>
                    </div>
                    <button
                        onClick={() => window.close()}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕ Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-200">The Native's Soul (Jiva)</h2>
                                <p className="text-sm text-slate-400">In BNN, Jiva changes based on gender.</p>
                            </div>
                            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                                <button
                                    onClick={() => handleGenderChange("Male")}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${gender === "Male" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    Male (Jupiter)
                                </button>
                                <button
                                    onClick={() => handleGenderChange("Female")}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${gender === "Female" ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                                >
                                    Female (Venus)
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center text-slate-500 animate-pulse">Consulting the Nadi Granthas...</div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                {formatReading(nadiResult.reading)}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
                            <h3 className="font-bold text-lg text-slate-200 mb-4 border-b border-slate-700 pb-2">Elemental Trines (1, 5, 9)</h3>
                            <p className="text-xs text-slate-400 mb-4">Planets in the same element support each other 100%.</p>

                            <div className="space-y-3">
                                <div className="bg-orange-950/30 p-3 rounded-lg border border-orange-900/50">
                                    <div className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Fire (Action)</div>
                                    <div className="font-medium">{trines["Fire (1,5,9)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Earth (Wealth)</div>
                                    <div className="font-medium">{trines["Earth (2,6,10)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-sky-950/30 p-3 rounded-lg border border-sky-900/50">
                                    <div className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">Air (Intellect)</div>
                                    <div className="font-medium">{trines["Air (3,7,11)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50">
                                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Water (Emotion)</div>
                                    <div className="font-medium">{trines["Water (4,8,12)"].join(", ") || "Empty"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
                            <h3 className="font-bold text-lg text-slate-200 mb-2">BNN Principles</h3>
                            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                                <li><strong>Conjunctions:</strong> Planets in same sign blend completely.</li>
                                <li><strong>Trines (1,5,9):</strong> Strongest supportive aspect.</li>
                                <li><strong>2nd Sign:</strong> Future events, moving towards this energy.</li>
                                <li><strong>12th Sign:</strong> Past karma, foundation, or letting go.</li>
                                <li><strong>7th Sign:</strong> Opposition or partners.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
