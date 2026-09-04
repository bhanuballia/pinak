import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NameMarriagePredictor from './NameMarriagePredictor';

export default function GargaSutrasViewer({ data }) {
    const { t } = useTranslation();
    const [sutras, setSutras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!data || !data.basic_details) return;

        const fetchSutras = async () => {
            setLoading(true);
            setError(null);
            try {
                // Post the natal chart data to the new endpoint
                const response = await fetch("/api/prediction/garga-sutras", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Garga Sutras");
                }

                const result = await response.json();
                setSutras(result.sutras || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSutras();
    }, [data]);

    if (!data) return <div className="text-white p-8">No chart data available.</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 border-b border-purple-500/30 pb-4">
                    <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
                        <span className="text-4xl">🕉️</span>
                        Garga Muni Sutras
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Insights based on the ancient teachings of Sage Garga.
                    </p>
                </header>

                {loading ? (
                    <div className="py-20 text-center text-purple-400 animate-pulse">
                        Evaluating Planetary Combinations based on Garga Samhita...
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                ) : sutras.length > 0 ? (
                    <div className="space-y-4">
                        {sutras.map((sutra, idx) => (
                            <div key={idx} className="bg-slate-800 rounded-xl p-5 border border-purple-500/20 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                    <span className="text-6xl">📜</span>
                                </div>
                                <h3 className="text-xl font-bold text-purple-300 mb-2">{sutra.name}</h3>
                                {sutra.condition && (
                                    <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">
                                        Condition: {sutra.condition}
                                    </p>
                                )}
                                <div className="text-slate-300 leading-relaxed border-l-2 border-purple-500/50 pl-4 py-1 italic">
                                    {sutra.interpretation}
                                </div>
                                {sutra.category && (
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-2 py-1 bg-purple-900/40 text-purple-200 text-[10px] rounded uppercase tracking-wider font-bold">
                                            {sutra.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
                        <span className="text-4xl mb-4 block">🌌</span>
                        <p className="text-slate-400">No specific Garga Sutras are strongly prominent in this chart based on the current ruleset.</p>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-purple-500/30">
                    <NameMarriagePredictor />
                </div>
            </div>
        </div>
    );
}
