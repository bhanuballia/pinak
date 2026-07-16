import React, { useState, useEffect } from 'react';

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
export default function NadiViewer({ data }) {
    const [loading, setLoading] = useState(true);
    const [nadiResult, setNadiResult] = useState(null);
    const [error, setError] = useState(null);
    const [gender, setGender] = useState("Male");
    const [category, setCategory] = useState("Other");
    const [question, setQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [qaResult, setQaResult] = useState(null);
    const [qaError, setQaError] = useState(null);

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

    const fetchNadiReading = async (selectedGender) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/nadi/analyze", {
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

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        setAsking(true);
        setQaError(null);
        try {
            const response = await fetch("/api/nadi/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planet_positions: data.planet_positions,
                    gender: gender,
                    question: question
                })
            });
            const resultData = await response.json();
            if (response.ok) {
                setQaResult(resultData.answer);
            } else {
                setQaError(resultData.detail || "Failed to get answer.");
            }
        } catch (err) {
            setQaError("Network error. Is the backend running?");
        }
        setAsking(false);
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
                                <h2 className="text-xl font-bold text-slate-200">Comprehensive Nadi Analysis</h2>
                                <p className="text-sm text-slate-400">Detailed breakdown based on BNN principles.</p>
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

                {/* Q&A Section */}
                <div className="mt-8 bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-slate-200 mb-2">Ask a Question based on your Nadi Chart</h2>
                    <p className="text-sm text-slate-400 mb-4">Have a specific question? The AI will interpret it using strict Bhrigu Nandi Nadi rules based on your chart.</p>
                    
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
                            
                            {category !== "Other" && PREDEFINED_QUESTIONS[category] && (
                                <div className="mt-3 bg-slate-900/50 rounded-lg border border-slate-700/50 p-3">
                                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Suggested Questions</label>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {PREDEFINED_QUESTIONS[category].map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setQuestion(q)}
                                                className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-100/90 hover:text-amber-400 px-3 py-1.5 rounded-full border border-slate-600 transition-colors text-left shadow-sm"
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
                                placeholder="e.g. Will I get married this year?"
                                rows="3"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        
                        <button 
                            onClick={handleAskQuestion}
                            disabled={asking}
                            className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${asking ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white hover:shadow-amber-500/25'}`}
                        >
                            {asking ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Consulting the Nadi...
                                </>
                            ) : (
                                <>Ask Question</>
                            )}
                        </button>
                        
                        {qaError && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm mt-4">
                                {qaError}
                            </div>
                        )}
                    </div>
                </div>

                {qaResult && (
                    <div className="mt-6 bg-gradient-to-br from-amber-900/40 to-slate-800 rounded-xl shadow-2xl p-6 border border-amber-500/30 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📜</div>
                        <h2 className="text-2xl font-bold text-amber-300 mb-4 border-b border-amber-500/30 pb-2">Nadi Interpretation</h2>
                        <div className="prose prose-invert prose-amber max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {qaResult}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
