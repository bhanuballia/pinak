import React, { useState, useEffect } from 'react';
import { fetchStudyInsights, fetchPersonalStudyInsights } from '../services/api';

export default function StudyViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [isHindi, setIsHindi] = useState(false);

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const uData = {
                    name: params.get('name') || 'Student',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general, personalRes] = await Promise.all([
                    fetchStudyInsights().catch(e => {
                        console.error("General study insights fetch failed", e);
                        return [];
                    }),
                    uData.date && uData.lat && uData.lon 
                      ? fetchPersonalStudyInsights(uData).catch(e => {
                          console.error("Personal study analysis failed", e);
                          return [];
                        }) 
                      : Promise.resolve([])
                ]);

                setInsights(general);
                setPersonalInsights(personalRes);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Study insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>📚</div>
                <p style={{ color: '#d4af37', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Analyzing Wisdom...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#cbd5e1', fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>
            {/* Language Toggle Button */}
            <button 
                onClick={() => setIsHindi(!isHindi)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'black',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                A / अ
            </button>
            {/* Premium Header */}
            <div style={{ 
                padding: '80px 40px', 
                background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
                
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
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>🎓</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Vedic Study Guide</h1>
                        <p style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '14px', fontWeight: 900, marginTop: '10px' }}>
                            Educational Astrology • Academic Success Diagnostic
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
                borderBottom: '1px solid rgba(255,255,255,0.05)',
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
                                background: filter === cat ? '#4f46e5' : 'rgba(255,255,255,0.05)',
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
                {userData && personalInsights.length > 0 && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: '#d4af37', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Your Personal Analysis</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.3))' }}></div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px', textAlign: 'center' }}>Based on {userData.name}'s Birth Details • Verified Calculation</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {personalInsights.map((item, idx) => (
                                <div key={idx} style={{ 
                                    background: 'rgba(30,41,59,0.4)', 
                                    padding: '40px', 
                                    borderRadius: '50px', 
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon || '🌟'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                        <h2 style={{ fontSize: '32px', color: 'white', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Wisdom</h2>
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
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>{item.category}</span>
                                    <span style={{ fontSize: '24px' }}>{item.icon || '✨'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#d4af37', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Vidya Param Balam</p>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Knowledge is the ultimate strength. Use these sacred insights as a complement to your earthly dedication."</p>
                <button 
                    onClick={() => window.close()} 
                    style={{ 
                        padding: '24px 80px', 
                        borderRadius: '100px', 
                        background: 'rgba(255,255,255,0.05)', 
                        color: 'white', 
                        border: '1px solid rgba(255,255,255,0.1)', 
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
