import React, { useState, useEffect } from 'react';
import { fetchHealthInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function HealthViewer() {
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const uData = {
                    name: params.get('name') || 'Native',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general] = await Promise.all([
                    fetchHealthInsights().catch(e => {
                        console.error("General health insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.health) {
                            setPersonalData(parsed.life_oracle.health);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for health", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Health insights fetch error:", err);
                setError(`Connection Error: ${err.message || "Unknown Error"}`);
            } finally {
                setLoading(false);
            }
        };
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>🌿</div>
                <p style={{ color: '#10b981', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Synchronizing Life Force...</p>
                <style>{` @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.1); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#cbd5e1', fontFamily: 'serif', paddingBottom: '100px' }}>
            {/* Premium Header */}
            <div style={{
                padding: '80px 40px',
                background: 'linear-gradient(135deg, #064e3b 0%, #020617 100%)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '35px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>🏥</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Health & Vitality Guide</h1>
                        <p style={{ color: '#10b981', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '14px', fontWeight: 900, marginTop: '10px' }}>
                            Physical Blueprint • Ayurvedic Wellness Diagnostic
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                padding: '20px 0'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '15px', padding: '0 40px', overflowX: 'auto' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '100px',
                                background: filter === cat ? '#10b981' : 'rgba(255,255,255,0.05)',
                                color: filter === cat ? 'white' : '#94a3b8',
                                border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                fontSize: '11px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 40px' }}>
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '40px', borderRadius: '40px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#ef4444', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: '#94a3b8' }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {personalData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: '#10b981', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vitality Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(16,185,129,0.3))' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Health Score Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #064e3b 0%, #020617 100%)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(16,185,129,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '18px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#10b981', marginBottom: '15px' }}>Physical Vitality Index</p>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '72px', fontWeight: 300, color: 'white' }}>{personalData.score}</span>
                                    <span style={{ fontSize: '24px', fontWeight: 300, color: '#065f46' }}>/100</span>
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#fbbf24' }}>{personalData.label}</p>
                            </div>

                            {/* Key Indicators Card */}
                            <div style={{
                                background: 'rgba(30,41,59,0.4)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                            }}>
                                <p style={{ fontSize: '18px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: 'rgba(3, 35, 78, 1)', marginBottom: '25px' }}>Planetary Health Markers</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {personalData.notes?.map((n, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                            <span style={{ color: '#10b981', fontSize: '18px' }}>✦</span>
                                            <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>{n}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Wellness Tips */}
                            <div style={{
                                background: 'rgba(30,41,59,0.4)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                gridColumn: 'span 2'
                            }}>
                                <p style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '25px' }}>Auspicious Wellness Remedies</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    {personalData.remedies?.map((r, i) => (
                                        <div key={i} style={{ padding: '20px', borderRadius: '25px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                            <p style={{ fontSize: '18px', color: '#6ee7b7', margin: 0, fontStyle: 'italic' }}>{r}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {worksheetData && (
                            <DiagnosticDetails domain="health" worksheetData={worksheetData} />
                        )}
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                        <h2 style={{ fontSize: '32px', color: 'white', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Wellness Principles</h2>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredInsights.map((item, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: 'rgba(16, 185, 129, 0.05)', fontSize: '18px', color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>{item.category}</span>
                                    <span style={{ fontSize: '24px' }}>{item.icon || '🧘'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '24px', color: '#94a3b8', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#10b981', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Arogyam Dhansampada</p>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Health is the greatest wealth. A balanced soul in a strong body is the foundation of all spiritual and material success."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '24px 80px',
                        borderRadius: '100px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Return to Workstation
                </button>
            </div>
        </div>
    );
}
