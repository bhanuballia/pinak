import React, { useState } from 'react';

export default function PrashnaEngine() {
    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("Other");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    
    const categories = [
        "Other",
        "Marriage / Relationship",
        "Career / Job",
        "Wealth / Finance",
        "Health / Disease",
        "Missing Item / Property",
        "Children",
        "Travel / Education",
        "Litigation / Enemies"
    ];

    const askPrashna = () => {
        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    try {
                        const response = await fetch("http://localhost:8000/api/prashna/ask", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                latitude: lat,
                                longitude: lon,
                                question: question,
                                category: category
                            })
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                            setResult(data);
                        } else {
                            setError(data.detail || "Failed to analyze Prashna.");
                        }
                    } catch (err) {
                        setError("Network error. Is the backend running?");
                    }
                    setLoading(false);
                },
                (err) => {
                    setError("Location access is required for Prashna astrology. Please allow it in your browser.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-400 flex items-center gap-3">
                        <span className="text-4xl">🔮</span> Prashna Kundali Engine
                    </h1>
                    <button 
                        onClick={() => window.close()}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕ Close
                    </button>
                </div>
                
                <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
                    <p className="text-slate-300 mb-6 text-sm">
                        Horary astrology uses the exact moment and location you ask a question to cast a chart. 
                        Focus your mind on the question, type it below, and the stars will provide guidance.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Your Question</label>
                            <textarea 
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g. Will I get the job offer this week?"
                                rows="3"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        
                        <button 
                            onClick={askPrashna}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white hover:shadow-amber-500/25'}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Consulting the Stars...
                                </>
                            ) : (
                                <>✨ Ask the Stars</>
                            )}
                        </button>
                        
                        {error && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm mt-4">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
                
                {result && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl shadow-2xl p-6 border border-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
                            <h2 className="text-2xl font-bold text-indigo-300 mb-4 border-b border-indigo-500/30 pb-2">Divine Interpretation</h2>
                            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {result.reading}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Querent (You)</div>
                                <div className="font-bold text-amber-400">{result.lagna_sign} ({result.lagna_lord})</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Quesited (Goal)</div>
                                <div className="font-bold text-teal-400">House {result.target_house} ({result.target_lord})</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mathematical Score</div>
                                <div className={`font-bold ${result.score > 0 ? 'text-emerald-400' : result.score < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                    {result.score > 0 ? '+' : ''}{result.score}
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Exact Time</div>
                                <div className="font-bold text-indigo-400 text-sm">{new Date(result.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
