import React, { useState } from 'react';

const PREDEFINED_QUESTIONS = {
    "Marriage / Relationship": [
        "Will I get married soon?",
        "When will I get married?",
        "Is this the right time for marriage?",
        "Will my marriage be delayed?",
        "Will I have a love marriage or arranged marriage?",
        "Will my marriage proposal succeed?",
        "Is the current relationship leading to marriage?",
        "Will I marry the person I love?",
        "Is there another marriage indication in my chart?",
        "Will there be obstacles to my marriage?",
        "Does my partner truly love me?",
        "Is my partner loyal and faithful?",
        "Will reconciliation happen after separation?",
        "Will my ex return?",
        "Is my current relationship stable?",
        "Are hidden problems present in this relationship?",
        "Should I continue this relationship?",
        "Will our families approve?",
        "Is there a third person involved?",
        "Will this relationship end in commitment?"
    ],
    "Career / Job": [
        "Will I get a job soon?",
        "When will I receive employment?",
        "Will I clear my interview?",
        "Should I change my current job?",
        "Will I receive a promotion?",
        "Will my salary increase?",
        "Should I continue in my present company?",
        "Will I get a government job?",
        "Is business better than service for me?",
        "Will I get an overseas job opportunity?",
        "Should I start my own business?",
        "Will my startup succeed?",
        "Will my career improve this year?",
        "Is job loss indicated?",
        "Will I be transferred?"
    ],
    "Wealth / Finance": [
        "Will my financial condition improve?",
        "Will I recover my blocked money?",
        "Will I receive an inheritance?",
        "Is this the right time to invest?",
        "Will I gain profit from this business?",
        "Should I purchase shares or mutual funds?",
        "Will I be able to repay my debts?",
        "Will I receive the expected payment?",
        "Is there a chance of sudden wealth?",
        "Will I buy a house this year?",
        "Will I purchase a vehicle?",
        "Is this property investment favorable?",
        "Will my loan be approved?",
        "Is there a risk of financial loss?",
        "Will legal disputes affect my finances?"
    ],
    "Health / Disease": [
        "Will I recover from my illness?",
        "Is the disease serious?",
        "What is the likely duration of this illness?",
        "Will surgery be successful?",
        "Should surgery be avoided?",
        "Is hospitalization indicated?",
        "Will medical treatment work?",
        "Is there a hidden disease?",
        "Will the patient regain full health?",
        "Is this health condition temporary?",
        "Are there chances of relapse?",
        "Is stress affecting my health?",
        "Should I seek a second medical opinion?",
        "Is this the right time for treatment?",
        "Will alternative therapies help?"
    ],
    "Missing Item / Property": [
        "Will my lost item be recovered?",
        "Where is the missing object located?",
        "Was the item stolen or misplaced?",
        "Who took the missing item?",
        "Will the missing person return safely?",
        "Will I recover my lost documents?",
        "Is the property dispute resolvable?",
        "Will I regain possession of my property?",
        "Is the item nearby or far away?",
        "How long will it take to recover it?",
        "Is the missing item permanently lost?",
        "Can legal action help recover it?",
        "Was the loss caused by negligence?",
        "Is someone hiding the object?",
        "What direction should I search?"
    ],
    "Children": [
        "Will I have children?",
        "When will childbirth occur?",
        "Is there delay in childbirth?",
        "Will fertility treatment succeed?",
        "Will I have a healthy child?",
        "Is adoption indicated?",
        "Will I have more than one child?",
        "Is there a possibility of miscarriage?",
        "Will the pregnancy proceed safely?",
        "Will my child be successful?",
        "Are there obstacles in conception?",
        "Will I have a son or daughter?",
        "Should medical intervention be pursued?",
        "Will the child be born this year?",
        "Is progeny yoga active?"
    ],
    "Travel / Education": [
        "Will my planned journey be successful?",
        "Is foreign travel indicated?",
        "When will I travel abroad?",
        "Will my visa be approved?",
        "Is relocation favorable?",
        "Should I postpone this trip?",
        "Will my pilgrimage be successful?",
        "Will business travel bring gains?",
        "Is there risk during travel?",
        "Will I settle overseas?",
        "Will I pass my examinations?",
        "Will I gain admission to my desired institution?",
        "Should I pursue higher studies?",
        "Will I complete my education successfully?",
        "Is studying abroad favorable?",
        "Will I receive a scholarship?",
        "Which field of study suits me?",
        "Will competitive exams be successful?",
        "Should I change my academic path?",
        "Will this educational investment benefit me?"
    ],
    "Litigation / Enemies": [
        "Will I win the court case?",
        "How long will the litigation continue?",
        "Should I settle outside court?",
        "Is compromise advisable?",
        "Will my enemies succeed against me?",
        "Will hidden enemies be exposed?",
        "Will I face legal penalties?",
        "Is imprisonment indicated?",
        "Will I receive justice?",
        "Will the dispute resolve peacefully?",
        "Is the opposing party stronger?",
        "Will I recover losses from litigation?",
        "Should I proceed with the lawsuit?",
        "Is arbitration favorable?",
        "Will government authorities support me?"
    ],
    "Other": []
};

export default function KPEngine() {
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
                        const response = await fetch("/api/prashna/kp-ask", {
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
                    setError("Location access is required for astrology. Please allow it in your browser.");
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
                    <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
                        <span className="text-4xl">⭐</span> KP Astrology Engine
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
                        Krishnamurti Paddhati (KP) uses the exact Ascendant Nakshatra and Sub-Lord at this very moment to read the signs and give a specific answer to your query.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            
                            {category !== "Other" && PREDEFINED_QUESTIONS[category] && (
                                <div className="mt-3 bg-slate-900/50 rounded-lg border border-slate-700/50 p-3">
                                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Suggested Questions</label>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {PREDEFINED_QUESTIONS[category].map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setQuestion(q)}
                                                className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-100/90 hover:text-teal-400 px-3 py-1.5 rounded-full border border-slate-600 transition-colors text-left shadow-sm"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Your Question</label>
                            <textarea 
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g. Will I get the job offer this week?"
                                rows="3"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        
                        <button 
                            onClick={askPrashna}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white hover:shadow-teal-500/25'}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Consulting the KP Charts...
                                </>
                            ) : (
                                <>⭐ Ask the Stars</>
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
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⭐</div>
                            <h2 className="text-2xl font-bold text-teal-300 mb-4 border-b border-indigo-500/30 pb-2">KP Interpretation</h2>
                            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {result.reading}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ascendant</div>
                                <div className="font-bold text-teal-400">{result.ascendant_degree.toFixed(2)}°</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nakshatra</div>
                                <div className="font-bold text-amber-400">{result.nakshatra}</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sub-Lord</div>
                                <div className="font-bold text-emerald-400">{result.sub_lord}</div>
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
