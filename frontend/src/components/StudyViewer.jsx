import React, { useState, useEffect } from 'react';
import { fetchStudyInsights, fetchPersonalStudyInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function StudyViewer({ worksheetData: propWorksheetData }) {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [govtJobActivationData, setGovtJobActivationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(propWorksheetData || null);
    const [isHindi, setIsHindi] = useState(false);
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
        filterInactiveText: '#475569' // dark slate-600
    };

    useEffect(() => {
        const loadInsights = async () => {
            try {
                let parsed = propWorksheetData;
                if (!parsed) {
                    const localData = localStorage.getItem('worksheetData');
                    if (localData) {
                        try { parsed = JSON.parse(localData); } catch (e) { }
                    }
                }
                if (parsed) setWorksheetData(parsed);

                const params = new URLSearchParams(window.location.search);
                const basic = parsed?.basic_details || {};
                const meta = parsed?.meta || {};

                const uData = {
                    name: params.get('name') || meta.name || basic.name || 'Student',
                    date: params.get('date') || basic.birth_date || basic.date,
                    time: params.get('time') || basic.birth_time || basic.time,
                    lat: params.get('lat') || basic.lat,
                    lon: params.get('lon') || basic.lon,
                    tz_offset: params.get('tz') || basic.tz_offset,
                    charts: parsed?.charts,
                    chart: parsed?.chart,
                    planet_positions: parsed?.planet_positions || parsed?.positions || parsed?.planets,
                    panchang: parsed?.panchang,
                    vargas: parsed?.vargas
                };

                const [general, personalRes] = await Promise.all([
                    fetchStudyInsights().catch(e => {
                        console.error("General study insights fetch failed", e);
                        return [];
                    }),
                    (uData.date || (parsed && (parsed.charts || parsed.chart)))
                        ? fetchPersonalStudyInsights(uData).catch(e => {
                            console.error("Personal study analysis failed", e);
                            return [];
                        })
                        : Promise.resolve([])
                ]);

                setInsights(general);
                setPersonalInsights(personalRes);
                if (uData.date || uData.name) setUserData(uData);

                if (parsed) {
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
    }, [propWorksheetData]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>📚</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Analyzing Wisdom...</p>
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
            {/* Language Toggle Button */}
            <button
                onClick={() => setIsHindi(!isHindi)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
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
                A / अ
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
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>🎓</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Vedic Study Guide</h1>
                        <p style={{ color: 'rgba(2, 1, 1, 1)', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
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
                    <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '40px', borderRadius: '40px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#be123c', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: '#475569' }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {(userData || worksheetData) && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: '38px', color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Your Personal Analysis</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>
                        <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '24px', marginBottom: '40px', textAlign: 'center', fontWeight: 600 }}>Based on {userData.name}'s Birth Details • Verified Calculation</p>

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
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon || '🌟'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(180, 93, 12, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 1)', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Lagna Kundali House Diagnostics Component */}
                        {worksheetData && (
                            <section style={{ marginBottom: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(136, 19, 55, 0.3))' }}></div>
                                    <h2 style={{ fontSize: '36px', color: '#881337', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>
                                        📊 Lagna Kundali Education & Academic Diagnostic
                                    </h2>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(136, 19, 55, 0.3))' }}></div>
                                </div>
                                <DiagnosticDetails domain="study" worksheetData={worksheetData} />
                            </section>
                        )}

                        {/* Classical Priority Hierarchy for Selecting Field of Study */}
                        <div style={{
                            marginTop: '60px',
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: '1px solid #fecdd3',
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <span style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#080203ff' }}>
                                    📜 Parashari & Jaimini Sastra Principles
                                </span>
                                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#881337', marginTop: '8px' }}>
                                    🏆 Classical Priority Hierarchy for Selecting Field of Study
                                </h3>
                                <p style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 1)', fontStyle: 'italic', marginTop: '6px' }}>
                                    How to evaluate your educational factors in order of astrological importance
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                                <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #e11d48', border: '1px solid #fecdd3', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        1st Priority (Rank #1)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#881337', marginBottom: '8px' }}>
                                        🥇 5th Lord & Planets in 5th House
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Core Stream & Intellect:</b> Governs your primary mental capacity, learning style, and undergraduate stream (STEM, Law, Commerce, Arts).
                                    </p>
                                </div>

                                <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #0284c7', border: '1px solid #bae6fd', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        2nd Priority (Rank #2)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#0c4a6e', marginBottom: '8px' }}>
                                        🥈 Birth Nakshatra Analysis
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Inborn Talent & Work Style:</b> Reveals your subconscious mind, natural dexterity, craftsmanship, and hands-on specialization skills.
                                    </p>
                                </div>

                                <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #16a34a', border: '1px solid #bbf7d0', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        3rd Priority (Rank #3)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#14532d', marginBottom: '8px' }}>
                                        🥉 Planet Acting as 5th Lord
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Intellectual Temperament:</b> Determines your competitive disposition (e.g., Jupiter $\rightarrow$ Wisdom/Finance; Mars $\rightarrow$ Technical/Engineering).
                                    </p>
                                </div>

                                <div style={{ background: '#faf5ff', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #9333ea', border: '1px solid #e9d5ff', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        4th Priority (Rank #4)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#581c87', marginBottom: '8px' }}>
                                        🏅 9th Lord & Planets in 9th House
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
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
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>🏛️ Government Job Activation (Vimshottari Dasha Timing)</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        </div>

                        {/* Goverment Lords & Career Domains Summary Badges */}
                        {govtJobActivationData.govt_lords && (
                            <div style={{ marginBottom: '40px' }}>
                                <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
                                    👑 Government Service Karakas & Career Domain Mapping
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                                    {govtJobActivationData.govt_lords.slice(0, 6).map((gl, i) => (
                                        <div key={i} style={{
                                            background: theme.cardBg,
                                            border: `1px solid ${theme.borderColor}`,
                                            padding: '20px 24px',
                                            borderRadius: '24px',
                                            boxShadow: '0 8px 20px rgba(136, 19, 55, 0.05)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '22px', fontWeight: 900, color: 'rgba(6, 25, 107, 1)' }}>
                                                    👑 {gl.title}
                                                </span>
                                                <span style={{ fontSize: '16px', fontWeight: 900, padding: '4px 12px', borderRadius: '100px', background: '#ffe4e6', color: '#be123c' }}>
                                                    Score: {gl.score}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '20px', fontWeight: 800, color: 'rgba(41, 99, 3, 1)', marginBottom: '8px', lineHeight: '1.4' }}>
                                                🏢 {gl.domains}
                                            </p>
                                            <p style={{ fontSize: '20px', color: 'rgba(10, 11, 12, 1)', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                                {gl.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Government Job Activation Timeline */}
                        <div>
                            <p style={{ color: 'rgba(5, 7, 133, 1)', fontSize: '22px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
                                📅 Active & Peak Government Selection Years
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                                {(govtJobActivationData.timeline || []).slice(0, 10).map((period, idx) => (
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
                                                fontSize: '14px',
                                                color: '#be123c',
                                                fontWeight: 900,
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                background: '#ffe4e6'
                                            }}>
                                                {period.intensity.includes("Pinnacle") || period.intensity.includes("High") ? "High" : period.intensity.includes("Favorable") || period.intensity.includes("Average") ? "Average" : "Low"}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '20px', fontWeight: 800, color: 'hsla(96, 48%, 38%, 1.00)', marginBottom: '10px' }}>
                                            🎯 Recommended Posts: {period.suggested_careers}
                                        </p>
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
                        </div>
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Wisdom</h2>
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
                                    <span style={{ fontSize: '24px' }}>{item.icon || '✨'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(33, 145, 5, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '22px', color: '#000000ff', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#881337', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Vidya Param Balam</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '30px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Knowledge is the ultimate strength. Use these sacred insights as a complement to your earthly dedication."</p>
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
