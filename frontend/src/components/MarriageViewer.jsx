import React, { useState, useEffect } from 'react';
import { fetchMarriageInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function MarriageViewer() {
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [isLightMode, setIsLightMode] = useState(false);
    const [fontScale, setFontScale] = useState(1);

    const increaseFont = () => setFontScale(prev => Math.min(prev + 0.1, 1.5));
    const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.1, 0.7));
    const resetFont = () => setFontScale(1);

    const theme = {
        bg: isLightMode ? '#fff1f2' : '#020617',
        text: isLightMode ? '#334155' : '#cbd5e1',
        heading: isLightMode ? '#4c0519' : 'white',
        headerGradient: isLightMode ? 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)' : 'linear-gradient(135deg, #4c0519 0%, #020617 100%)',
        cardBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
        cardGeneralBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.6)',
        filterBg: isLightMode ? 'rgba(255, 241, 242, 0.8)' : 'rgba(2, 6, 23, 0.8)',
        borderColor: isLightMode ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.05)',
        buttonBg: isLightMode ? 'rgba(244, 63, 94, 0.05)' : 'rgba(255,255,255,0.05)',
        filterInactiveText: isLightMode ? '#475569' : '#94a3b8',
        accentText: isLightMode ? '#e11d48' : 'rgba(202, 17, 48, 1)'
    };

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
                    fetchMarriageInsights().catch(e => {
                        console.error("General marriage insights fetch failed", e);
                        return [];
                    })
                ]);

                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.marriage) {
                            setPersonalData(parsed.life_oracle.marriage);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for marriage", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Marriage insights fetch error:", err);
                setError(`Connection Error: ${err.message || "Unknown Error"}`);
            } finally {
                setLoading(false);
            }
        };
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: `${64 * fontScale}px`, marginBottom: '30px', animation: 'bounce 2s infinite' }}>💍</div>
                <p style={{ color: theme.accentText, fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: `${24 * fontScale}px`, textTransform: 'uppercase' }}>Aligning Destinies...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>
            
            {/* Control Panel: Font Size & Theme Toggle */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '80px',
                zIndex: 1000,
                display: 'flex',
                gap: '10px'
            }}>
                <div style={{
                    display: 'flex',
                    background: isLightMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid #ccc',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    <button onClick={decreaseFont} style={{ background: 'transparent', border: 'none', borderRight: '1px solid #ccc', padding: '6px 12px', color: isLightMode ? 'white' : 'black', cursor: 'pointer', fontWeight: 'bold' }}>A-</button>
                    <button onClick={resetFont} style={{ background: 'transparent', border: 'none', borderRight: '1px solid #ccc', padding: '6px 12px', color: isLightMode ? 'white' : 'black', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
                    <button onClick={increaseFont} style={{ background: 'transparent', border: 'none', padding: '6px 12px', color: isLightMode ? 'white' : 'black', cursor: 'pointer', fontWeight: 'bold' }}>A+</button>
                </div>

                <button
                    onClick={() => setIsLightMode(!isLightMode)}
                    style={{
                        background: isLightMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: isLightMode ? 'white' : 'black',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                >
                    {isLightMode ? '🌙 Dark' : '☀️ Light'}
                </button>
            </div>

            {/* Premium Header */}
            <div style={{
                padding: '80px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '35px',
                        background: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: `${60 * fontScale}px`,
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>💑</div>
                    <div>
                        <h1 style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Marriage & Relationship Guide</h1>
                        <p style={{ color: theme.accentText, textTransform: 'uppercase', letterSpacing: '6px', fontSize: `${14 * fontScale}px`, fontWeight: 900, marginTop: '10px' }}>
                            Vedic Union Analysis • Marital Harmony Diagnostic
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: theme.filterBg,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${theme.borderColor}`,
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
                                background: filter === cat ? theme.accentText : theme.buttonBg,
                                color: filter === cat ? (isLightMode ? 'white' : '#020617') : theme.filterInactiveText,
                                border: filter === cat ? 'none' : `1px solid ${theme.borderColor}`,
                                fontSize: `${11 * fontScale}px`,
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
                        <h3 style={{ fontSize: `${24 * fontScale}px`, fontWeight: 900, color: '#ef4444', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: theme.filterInactiveText, fontSize: `${16 * fontScale}px` }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {personalData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                            <h2 style={{ fontSize: `${32 * fontScale}px`, color: theme.accentText, fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Personal Marital Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: `linear-gradient(to left, transparent, ${theme.borderColor})` }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Marriage Age Card */}
                            <div style={{
                                background: theme.headerGradient,
                                padding: '40px',
                                borderRadius: '50px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: `${10 * fontScale}px`, textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: theme.accentText, marginBottom: '15px' }}>Predicted Marriage Window</p>
                                <p style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: '10px 0' }}>{personalData.age}</p>
                                <p style={{ fontSize: `${16 * fontScale}px`, fontWeight: 700, color: theme.accentText, fontStyle: 'italic' }}>{personalData.age_en}</p>
                            </div>

                            {/* Harmony Score Card */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '50px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: `${10 * fontScale}px`, textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: theme.filterInactiveText, marginBottom: '15px' }}>Harmony Index</p>
                                <p style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: '10px 0' }}>{personalData.harmony_index}</p>
                                <p style={{ fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: isLightMode ? '#d97706' : '#fbbf24' }}>{personalData.label}</p>
                            </div>

                            {/* 7th House Insights */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '50px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)',
                                gridColumn: 'span 2'
                            }}>
                                <p style={{ fontSize: `${10 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: theme.filterInactiveText, marginBottom: '25px' }}>7th House & Lord Analysis</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <h4 style={{ color: theme.accentText, fontSize: `${12 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Planetary Influences</h4>
                                        {personalData.seventh_house_notes?.map((n, i) => (
                                            <p key={i} style={{ fontSize: `${15 * fontScale}px`, color: theme.text, marginBottom: '8px', fontStyle: 'italic' }}>• {n}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 style={{ color: isLightMode ? '#4f46e5' : '#6366f1', fontSize: `${12 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Placement Impact</h4>
                                        <p style={{ fontSize: `${15 * fontScale}px`, color: theme.text, fontStyle: 'italic' }}>• {personalData.lord_placement}</p>
                                        <p style={{ fontSize: `${15 * fontScale}px`, color: theme.text, marginTop: '10px', fontStyle: 'italic' }}>• Matches: {personalData.matching_signs}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {worksheetData && (
                            <DiagnosticDetails domain="marriage" worksheetData={worksheetData} isLightMode={isLightMode} />
                        )}
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: `${32 * fontScale}px`, color: theme.heading, fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Relationship Wisdom</h2>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to left, transparent, ${theme.borderColor})` }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredInsights.map((item, idx) => (
                            <div key={idx} style={{
                                background: theme.cardGeneralBg,
                                padding: '40px',
                                borderRadius: '50px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 40px 100px rgba(0,0,0,0.4)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: theme.buttonBg, fontSize: `${10 * fontScale}px`, color: theme.accentText, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${theme.borderColor}` }}>{item.category}</span>
                                    <span style={{ fontSize: `${24 * fontScale}px` }}>{item.icon || '💖'}</span>
                                </div>
                                <h3 style={{ fontSize: `${24 * fontScale}px`, fontWeight: 900, color: theme.heading, marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: theme.accentText, fontSize: `${24 * fontScale}px`, fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Mangalyam Tantu Nanena</p>
                <p style={{ color: theme.filterInactiveText, fontSize: `${16 * fontScale}px`, maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"This sacred bond is woven by the threads of destiny. Use these insights to nurture understanding, patience, and mutual growth."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '24px 80px',
                        borderRadius: '100px',
                        background: theme.buttonBg,
                        color: theme.heading,
                        border: `1px solid ${theme.borderColor}`,
                        fontSize: `${11 * fontScale}px`,
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
