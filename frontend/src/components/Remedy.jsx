import React, { useState, useEffect } from 'react';
import EncyclopediaRemediesViewer from './EncyclopediaRemediesViewer';

export default function Remedy() {
    const [data, setData] = useState(null);
    const [allYantras, setAllYantras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        
        const fetchYantras = async () => {
            try {
                const res = await fetch('/api/yantras');
                if (!res.ok) throw new Error("Failed to fetch yantra database.");
                const yDocs = await res.json();
                setAllYantras(yDocs);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchYantras();
    }, []);

    if (loading) return <div style={{ height: '100vh', background: '#020617', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>Querying Divine Library...</div>;

    const getSuggestions = () => {
        if (!data) return [];
        
        const suggestions = [];
        
        // 1. Planetary Strength Logic
        const planetStrengths = data.strength?.planets || {};
        const weakPlanets = Object.entries(planetStrengths)
            .filter(([p, s]) => s.total < 400) // Assuming < 400 is relatively low
            .map(([p]) => p);

        // Map planets to yantras
        weakPlanets.forEach(p => {
            const match = allYantras.find(y => y.name.toLowerCase().includes(p.toLowerCase()));
            if (match) {
                suggestions.push({
                    ...match,
                    reason: `Suggested due to low energy of ${p} in your chart.`
                });
            }
        });

        // 2. Special Doshas (if any)
        if (data.doshas?.includes('Kalsarp')) {
            const ks = allYantras.find(y => y.name.toLowerCase().includes('kaalsarp'));
            if (ks) suggestions.push({ ...ks, reason: "Suggested to mitigate the effects of Kaal Sarp Dosha." });
        }

        // 3. General Luck (Always suggest Shree Yantra)
        const shree = allYantras.find(y => y.name.toLowerCase().includes('sri yantra'));
        if (shree) suggestions.push({ ...shree, reason: "The supreme yantra for overall prosperity, abundance, and divine harmony." });

        // 4. Career/Wealth (Mahalaxmi)
        const laxmi = allYantras.find(y => y.name.toLowerCase().includes('mahalaxmi'));
        if (laxmi) suggestions.push({ ...laxmi, reason: "To ensure consistent financial growth and professional success." });

        // Remove duplicates
        const unique = [];
        const seen = new Set();
        suggestions.forEach(s => {
            if (!seen.has(s.name)) {
                unique.push(s);
                seen.add(s.name);
            }
        });

        return unique;
    };

    const suggestions = getSuggestions();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <EncyclopediaRemediesViewer />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 60px 40px' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '8px', fontSize: '14px', fontWeight: 900 }}>Sacred Yantras</h4>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, fontStyle: 'italic', marginTop: '10px', background: 'linear-gradient(to right, #dc2626, #fde68a, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Personalized Yantra Prescriptions
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '16px', maxWidth: '700px', margin: '15px auto' }}>
                        Sacred geometry prescriptions based on your unique planetary configuration and cosmic alignments.
                    </p>
                </header>

                {suggestions.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
                        {suggestions.map((y, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(30,41,59,0.3)', 
                                borderRadius: '40px', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                padding: '40px', 
                                display: 'flex', 
                                gap: '30px', 
                                alignItems: 'flex-start',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ flexShrink: 0, width: '180px', height: '180px', borderRadius: '30px', overflow: 'hidden', border: '5px solid rgba(212,175,55,0.2)' }}>
                                    <img 
                                        src={y.image_url} 
                                        alt={y.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/180?text=Yantra'}
                                    />
                                </div>
                                <div>
                                    <h3 style={{ color: '#d4af37', fontSize: '24px', fontWeight: 900, marginBottom: '10px' }}>{y.name}</h3>
                                    <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontStyle: 'italic' }}>
                                        {y.reason}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                        {y.benefits || "The precise geometry of this yantra clears negative energies and balances the divine elements in your environment."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>
                        No specific afflictions found. The Shree Yantra is recommended for general well-being.
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '60px' }}>
                    <button 
                        onClick={() => window.close()}
                        style={{
                            padding: '15px 40px',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            fontWeight: 900,
                            letterSpacing: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Workstation
                    </button>
                </div>
            </div>
        </div>
    );
}
