import React, { useState, useEffect } from 'react';
import { fetchFinanceInsights, fetchPersonalFinanceInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';
import FinanceAnalysis from './FinanceAnalysis';

export default function FinanceViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [wealthActivationData, setWealthActivationData] = useState(null);
    const [isLightMode, setIsLightMode] = useState(true);

    const theme = {
        bg: '#fff1f2', // rose-50
        text: '#1e293b', // dark slate text
        heading: '#881337', // dark rose-900 heading
        headerGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)',
        cardBg: '#ffffff',
        cardGeneralBg: '#ffffff',
        filterBg: 'rgba(255, 241, 242, 0.95)',
        borderColor: '#fecdd3', // rose-200 border
        buttonBg: '#ffe4e6', // rose-100 button
        filterInactiveText: '#475569',
        accentText: '#be123c'
    };

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const uData = {
                    name: params.get('name') || 'Valued Client',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general, personalRes] = await Promise.all([
                    fetchFinanceInsights().catch(e => {
                        console.error("General finance insights fetch failed", e);
                        return [];
                    }),
                    uData.date && uData.lat && uData.lon
                        ? fetchPersonalFinanceInsights(uData).catch(e => {
                            console.error("Personal finance analysis failed", e);
                            return [];
                        })
                        : Promise.resolve([])
                ]);

                setInsights(general);
                setPersonalInsights(personalRes);
                if (uData.date) setUserData(uData);

                const localData = localStorage.getItem('worksheetData');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    setWorksheetData(parsed);

                    // Fetch Wealth Activation Timeline
                    const pos = parsed.planet_positions || parsed.positions || parsed.planets || [];
                    let moonObj = pos.find(p => p.planet === 'Moon' || p.name === 'Moon');
                    let ascObj = pos.find(p => p.planet === 'Lagna' || p.planet === 'Ascendant' || p.name === 'Lagna' || p.name === 'Ascendant');
                    let moon_lon = moonObj ? (moonObj.sidereal_longitude ?? moonObj.longitude ?? moonObj.degree ?? 0) : 0;
                    let ascendant = ascObj ? (ascObj.sidereal_longitude ?? ascObj.longitude ?? ascObj.degree ?? 0) : (parsed.ascendant || 0);

                    fetch('/api/dasha/wealth-activation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jd_ut: parsed.jd_ut || parsed.basic_details?.jd_ut || 2451545.0,
                            moon_lon: moon_lon,
                            ascendant: ascendant,
                            house_lords: parsed.house_lords || null,
                            years: 80.0
                        })
                    }).then(res => res.json()).then(data => setWealthActivationData(data)).catch(e => console.error("Wealth activation fetch failed", e));
                }
            } catch (err) {
                console.error("Finance insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>💰</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Calculating Prosperity...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>
            {/* Theme Toggle Button */}
            <button
                onClick={() => setIsLightMode(!isLightMode)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '80px',
                    zIndex: 1000,
                    background: '#ffe4e6',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#881337',
                    boxShadow: '0 2px 8px rgba(136, 19, 55, 0.1)'
                }}
            >
                {isLightMode ? '🌹 Light Rose' : '🌙 Dark'}
            </button>

            {/* Premium Header */}
            <div style={{
                padding: '80px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '35px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>🏦</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Wealth & Finance Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Vedic Economic Insights • Prosperity Diagnostic
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
                                background: filter === cat ? '#e11d48' : '#ffffff',
                                color: filter === cat ? '#ffffff' : '#881337',
                                border: filter === cat ? 'none' : `1px solid ${theme.borderColor}`,
                                fontSize: '18px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                boxShadow: filter === cat ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 40px' }}>
                {error && (
                    <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '40px', borderRadius: '40px', textAlign: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#be123c', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: '#475569' }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {userData && personalInsights.length > 0 && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: '38px', color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Personal Wealth Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>
                        <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '24px', marginBottom: '40px', textAlign: 'center', fontWeight: 600 }}>Based on {userData.name}'s Financial Houses • Verified Calculation</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {personalInsights.map((item, idx) => (
                                <div key={idx} style={{
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '35px',
                                    border: '1px solid #fecdd3',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon || '💰'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(180, 93, 12, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '22px', color: '#000000ff', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>

                        {worksheetData && (
                            <DiagnosticDetails domain="finance" worksheetData={worksheetData} isLightMode={isLightMode} />
                        )}
                    </section>
                )}

                {/* Wealth Activation (Vimshottari Dasha Timing) Section */}
                {wealthActivationData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>💰 Wealth Activation (Vimshottari Dasha Timing)</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        </div>

                        {/* Wealth Lords Summary */}
                        {wealthActivationData.wealth_lords && (
                            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '15px' }}>
                                    👑 Identified Wealth Lords & Karaka Scores
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                                    {wealthActivationData.wealth_lords.map((wl, i) => (
                                        <div key={i} style={{
                                            background: theme.cardBg,
                                            border: '1px solid #fecdd3',
                                            padding: '10px 20px',
                                            borderRadius: '16px',
                                            fontSize: '20px',
                                            fontWeight: 800,
                                            color: '#881337'
                                        }}>
                                            👑 {wl.planet}: <span style={{ color: '#15803d' }}>Score {wl.score}</span> {wl.houses.length > 0 && `(Lords ${wl.houses.join(',')})`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Activation Timeline */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                            {(wealthActivationData.timeline || []).slice(0, 10).map((period, idx) => (
                                <div key={idx} style={{
                                    background: theme.cardBg,
                                    padding: '24px 30px',
                                    borderRadius: '30px',
                                    borderLeft: `6px solid #e11d48`,
                                    borderTop: `1px solid ${theme.borderColor}`,
                                    borderRight: `1px solid ${theme.borderColor}`,
                                    borderBottom: `1px solid ${theme.borderColor}`,
                                    boxShadow: '0 10px 25px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: 'hsla(0, 0%, 0%, 1.00)' }}>
                                            {period.mahadasha} (MD) - {period.antardasha} (AD)
                                        </span>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#be123c',
                                            fontWeight: 900,
                                            padding: '4px 12px',
                                            borderRadius: '100px',
                                            background: '#ffe4e6'
                                        }}>
                                            {period.intensity}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '18px', color: 'rgba(7, 8, 8, 1)', marginBottom: '15px', lineHeight: '1.6', fontStyle: 'italic' }}>
                                        {period.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${theme.borderColor}` }}>
                                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(0, 0, 0, 1)' }}>
                                            📅 {period.start_date} to {period.end_date}
                                        </span>
                                        <span style={{ fontSize: '18px', color: '#000000ff', fontWeight: 900 }}>
                                            Score: {period.score}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Classical Financial Analysis Section (from FinanceAnalysis.jsx) */}
                <section style={{ marginBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>📊 Classical Financial & Dhana Yoga Analysis</h2>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                    </div>
                    <div style={{
                        background: theme.cardBg,
                        padding: '30px',
                        borderRadius: '30px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                    }}>
                        <FinanceAnalysis />
                    </div>
                </section>

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Economic Wisdom</h2>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to left, transparent, ${theme.borderColor})` }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredInsights.map((item, idx) => (
                            <div key={idx} style={{
                                background: theme.cardGeneralBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: '#ffe4e6', fontSize: '16px', color: 'rgba(8, 5, 6, 1)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${theme.borderColor}` }}>{item.category}</span>
                                    <span style={{ fontSize: '20px' }}>{item.icon || '✨'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(33, 145, 5, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '22px', color: '#000000ff', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ maxWidth: '800px', margin: '100px auto 0', textAlign: 'center', background: '#ffe4e6', padding: '60px 40px', borderRadius: '40px', border: '1px solid #fecdd3' }}>
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Lakshmi Kripa</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '30px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"May the divine grace of Mahalakshmi bring stability and abundance to your life. Align your efforts with cosmic timing."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '20px 60px',
                        borderRadius: '100px',
                        background: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)'
                    }}
                >
                    Return to Workstation
                </button>
            </div>
        </div>
    );
}
