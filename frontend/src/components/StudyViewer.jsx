import React, { useState, useEffect } from 'react';
import { fetchStudyInsights, fetchPersonalStudyInsights } from '../services/api';

export default function StudyViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [govtJobActivationData, setGovtJobActivationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [isHindi, setIsHindi] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);

    const theme = {
        bg: isLightMode ? '#f8fafc' : '#020617',
        text: isLightMode ? '#a51e0dbd' : '#cbd5e1',
        heading: isLightMode ? '#0f172a' : 'white',
        headerGradient: isLightMode ? 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        cardBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
        cardGeneralBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.6)',
        filterBg: isLightMode ? 'rgba(248, 250, 252, 0.8)' : 'rgba(2, 6, 23, 0.8)',
        borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)',
        buttonBg: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        filterInactiveText: isLightMode ? '#64748b' : '#94a3b8'
    };

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

                const localData = localStorage.getItem('worksheetData');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    const pos = parsed.planet_positions || parsed.positions || parsed.planets || [];
                    let moonObj = pos.find(p => p.planet === 'Moon' || p.name === 'Moon');
                    let ascObj = pos.find(p => p.planet === 'Lagna' || p.planet === 'Ascendant' || p.name === 'Lagna' || p.name === 'Ascendant');
                    let moon_lon = moonObj ? (moonObj.sidereal_longitude ?? moonObj.longitude ?? moonObj.degree ?? 0) : 0;
                    let ascendant = ascObj ? (ascObj.sidereal_longitude ?? ascObj.longitude ?? ascObj.degree ?? 0) : (parsed.ascendant || 0);

                    fetch('/api/dasha/govt-job-activation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jd_ut: parsed.jd_ut || parsed.basic_details?.jd_ut || 2451545.0,
                            moon_lon: moon_lon,
                            ascendant: ascendant,
                            house_lords: parsed.house_lords || null,
                            years: 80.0
                        })
                    }).then(res => res.json()).then(data => setGovtJobActivationData(data)).catch(e => console.error("Govt job activation fetch failed", e));
                }
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
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>📚</div>
                <p style={{ color: '#d4af37', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Analyzing Wisdom...</p>
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
                    right: '100px',
                    zIndex: 1000,
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
            {/* Language Toggle Button */}
            <button
                onClick={() => setIsHindi(!isHindi)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
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
                A / अ
            </button>
            {/* Premium Header */}
            <div style={{
                padding: '80px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
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
                        background: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>🎓</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Vedic Study Guide</h1>
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
                                background: filter === cat ? '#4f46e5' : theme.buttonBg,
                                color: filter === cat ? 'white' : theme.filterInactiveText,
                                border: filter === cat ? 'none' : `1px solid ${theme.borderColor}`,
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
                        <p style={{ color: theme.filterInactiveText }}>{error}</p>
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
                        <p style={{ color: theme.filterInactiveText, fontSize: '16px', marginBottom: '40px', textAlign: 'center' }}>Based on {userData.name}'s Birth Details • Verified Calculation</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {personalInsights.map((item, idx) => (
                                <div key={idx} style={{
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '50px',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon || '🌟'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: theme.heading, marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '18px', color: theme.text, lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Classical Priority Hierarchy for Selecting Field of Study */}
                        <div style={{
                            marginTop: '60px',
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '40px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.05)' : '0 20px 50px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#d4af37' }}>
                                    📜 Parashari & Jaimini Sastra Principles
                                </span>
                                <h3 style={{ fontSize: '28px', fontWeight: 900, color: theme.heading, marginTop: '8px' }}>
                                    🏆 Classical Priority Hierarchy for Selecting Field of Study
                                </h3>
                                <p style={{ fontSize: '16px', color: theme.filterInactiveText, fontStyle: 'italic', marginTop: '6px' }}>
                                    How to evaluate your educational factors in order of astrological importance
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'rgba(212,175,55,0.08)', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #d4af37' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        1st Priority (Rank #1)
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, color: theme.heading, marginBottom: '8px' }}>
                                        🥇 5th Lord & Planets in 5th House
                                    </h4>
                                    <p style={{ fontSize: '18px', color: theme.text, lineHeight: '1.6' }}>
                                        <b>Core Stream & Intellect:</b> Governs your primary mental capacity, learning style, and undergraduate stream (STEM, Law, Commerce, Arts).
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #3b82f6' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        2nd Priority (Rank #2)
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, color: theme.heading, marginBottom: '8px' }}>
                                        🥈 Birth Nakshatra Analysis
                                    </h4>
                                    <p style={{ fontSize: '18px', color: theme.text, lineHeight: '1.6' }}>
                                        <b>Inborn Talent & Work Style:</b> Reveals your subconscious mind, natural dexterity, craftsmanship, and hands-on specialization skills.
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #10b981' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        3rd Priority (Rank #3)
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, color: theme.heading, marginBottom: '8px' }}>
                                        🥉 Planet Acting as 5th Lord
                                    </h4>
                                    <p style={{ fontSize: '18px', color: theme.text, lineHeight: '1.6' }}>
                                        <b>Intellectual Temperament:</b> Determines your competitive disposition (e.g., Jupiter $\rightarrow$ Wisdom/Finance; Mars $\rightarrow$ Technical/Engineering).
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #a855f7' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        4th Priority (Rank #4)
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, color: theme.heading, marginBottom: '8px' }}>
                                        🏅 9th Lord & Planets in 9th House
                                    </h4>
                                    <p style={{ fontSize: '18px', color: theme.text, lineHeight: '1.6' }}>
                                        <b>Higher Degrees & Doctorate:</b> Governs Master's degrees, Ph.D. specialization, university reputation, and foreign university studies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Government Job Activation (Vimshottari Dasha Timing) Section */}
                {govtJobActivationData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(239, 68, 68, 0.4))' }}></div>
                            <h2 style={{ fontSize: '32px', color: '#ef4444', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>🏛️ Government Job Activation (Vimshottari Dasha Timing)</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(239, 68, 68, 0.4))' }}></div>
                        </div>

                        {/* Goverment Lords & Career Domains Summary Badges */}
                        {govtJobActivationData.govt_lords && (
                            <div style={{ marginBottom: '40px' }}>
                                <p style={{ color: theme.filterInactiveText, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
                                    👑 Government Service Karakas & Career Domain Mapping
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                                    {govtJobActivationData.govt_lords.slice(0, 6).map((gl, i) => (
                                        <div key={i} style={{
                                            background: theme.cardBg,
                                            border: `1px solid ${theme.borderColor}`,
                                            padding: '20px 24px',
                                            borderRadius: '24px',
                                            boxShadow: isLightMode ? '0 8px 20px rgba(0,0,0,0.05)' : '0 15px 35px rgba(0,0,0,0.3)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 900, color: theme.heading }}>
                                                    👑 {gl.title}
                                                </span>
                                                <span style={{ fontSize: '14px', fontWeight: 900, padding: '4px 12px', borderRadius: '100px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                                                    Score: {gl.score}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24', marginBottom: '8px', lineHeight: '1.4' }}>
                                                🏢 {gl.domains}
                                            </p>
                                            <p style={{ fontSize: '14px', color: theme.filterInactiveText, margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                                {gl.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Government Job Activation Timeline */}
                        <div>
                            <p style={{ color: theme.filterInactiveText, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
                                📅 Active & Peak Government Selection Years
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                                {(govtJobActivationData.timeline || []).slice(0, 10).map((period, idx) => (
                                    <div key={idx} style={{
                                        background: theme.cardBg,
                                        padding: '24px 30px',
                                        borderRadius: '30px',
                                        borderLeft: `6px solid ${period.badge_color || '#ef4444'}`,
                                        borderTop: `1px solid ${theme.borderColor}`,
                                        borderRight: `1px solid ${theme.borderColor}`,
                                        borderBottom: `1px solid ${theme.borderColor}`,
                                        boxShadow: isLightMode ? '0 10px 25px rgba(0,0,0,0.05)' : '0 20px 40px rgba(0,0,0,0.3)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: theme.heading }}>
                                                {period.mahadasha} (MD) - {period.antardasha} (AD)
                                            </span>
                                            <span style={{
                                                fontSize: '18px',
                                                color: '#fbbf24',
                                                fontWeight: 900,
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                background: 'rgba(239, 68, 68, 0.2)'
                                            }}>
                                                {period.intensity.includes("Pinnacle") || period.intensity.includes("High") ? "High" : period.intensity.includes("Favorable") || period.intensity.includes("Average") ? "Average" : "Low"}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444', marginBottom: '10px' }}>
                                            🎯 Recommended Posts: {period.suggested_careers}
                                        </p>
                                        <p style={{ fontSize: '18px', color: theme.filterInactiveText, marginBottom: '15px', lineHeight: '1.6', fontStyle: 'italic' }}>
                                            {period.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${theme.borderColor}` }}>
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>
                                                📅 {period.start_date} to {period.end_date}
                                            </span>
                                            <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: 900 }}>
                                                Score: {period.score}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: theme.heading, fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Wisdom</h2>
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
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: theme.buttonBg, fontSize: '10px', color: theme.filterInactiveText, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${theme.borderColor}` }}>{item.category}</span>
                                    <span style={{ fontSize: '24px' }}>{item.icon || '✨'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: theme.heading, marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '18px', color: theme.filterInactiveText, lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#d4af37', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Vidya Param Balam</p>
                <p style={{ color: theme.filterInactiveText, fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Knowledge is the ultimate strength. Use these sacred insights as a complement to your earthly dedication."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '24px 80px',
                        borderRadius: '100px',
                        background: theme.buttonBg,
                        color: theme.heading,
                        border: `1px solid ${theme.borderColor}`,
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
