import React, { useState, useEffect } from 'react';
import { fetchMentalPeaceInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function MentalPeaceViewer() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'lunar' | 'sleep' | 'remedies'
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);

    const theme = {
        bg: '#fff1f2', // rose-50
        text: '#1e293b', // dark slate text
        heading: '#881337', // dark rose heading
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
                    name: params.get('name') || 'Native',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general] = await Promise.all([
                    fetchMentalPeaceInsights().catch(e => {
                        console.error("General mental peace insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.mental_peace) {
                            setPersonalData(parsed.life_oracle.mental_peace);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for mental peace", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Mental peace insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>🧘</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Harmonizing Mind & Subconscious...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    const getRiskColor = (level) => {
        if (level === 'High') return '#be123c';
        if (level === 'Moderate') return '#b45309';
        return '#15803d';
    };

    const mScore = personalData?.score !== undefined ? personalData.score : 'N/A';
    const mRisk = personalData?.risk_level || (mScore !== 'N/A' ? (mScore >= 70 ? 'Low' : mScore >= 50 ? 'Moderate' : 'High') : null);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>

            <button
                onClick={() => setIsLightMode(!isLightMode)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '40px',
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
                padding: '70px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '30px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '56px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>🧘</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Mental Peace & Tranquility</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Manas Diagnostic • Lunar Yogas • Subconscious Serenity
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Header */}
            <div style={{
                backgroundColor: theme.filterBg,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'sticky',
                top: 0,
                zIndex: 90
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', padding: '15px 40px', overflowX: 'auto' }}>
                    {[
                        { id: 'overview', label: '📊 Overview', desc: 'Summary & Tranquility Index' },
                        { id: 'lunar', label: '🧘 Lunar & Mind', desc: 'Moon, Mercury & Yogas' },
                        { id: 'sleep', label: '🌙 Sleep & Subconscious', desc: '12th House & Rest' },
                        { id: 'remedies', label: '🌿 Vedic Remedies', desc: 'Mantras, Silver & Pranayama' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                background: activeTab === tab.id
                                    ? '#e11d48'
                                    : '#ffffff',
                                color: activeTab === tab.id ? '#ffffff' : '#881337',
                                border: activeTab === tab.id ? 'none' : `1px solid ${theme.borderColor}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                whiteSpace: 'nowrap',
                                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none'
                            }}
                        >
                            <span style={{ fontSize: '20px', fontWeight: 900 }}>{tab.label}</span>
                            <span style={{ fontSize: '14px', opacity: 0.9, marginTop: '2px', color: activeTab === tab.id ? '#ffe4e6' : '#be123c' }}>{tab.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 40px' }}>
                {error && (
                    <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '30px', borderRadius: '30px', textAlign: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#be123c', fontStyle: 'italic', marginBottom: '10px' }}>Connection Notice</h3>
                        <p style={{ color: '#475569' }}>{error}</p>
                    </div>
                )}

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#be123c' }}>🧘 Mental Tranquility Index (Moon & 4th H)</span>
                                {mRisk && (
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                        fontWeight: 900,
                                        backgroundColor: '#ffe4e6',
                                        color: getRiskColor(mRisk),
                                        border: `1px solid ${theme.borderColor}`,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {mRisk} Emotional Stress
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '48px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>
                                {mScore !== 'N/A' ? `${mScore}/100` : 'N/A'}
                                <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.7, marginLeft: '10px', color: '#be123c' }}>Serenity Rating ({personalData?.label || 'Stable'})</span>
                            </div>

                            <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData ? (Array.isArray(personalData.notes) ? personalData.notes.join(' ') : (personalData.notes || 'Analyzed via Moon, Mercury, 4th House & 12th House Subconscious.')) : 'Mental peace diagnostic analyzes Moon (Manas), Mercury (Cognition), 4th house (Emotional base), and 12th house (Sleep & Subconscious).'}
                            </p>

                            {personalData?.dasha_note && (
                                <div style={{ padding: '15px 20px', borderRadius: '14px', background: '#ffe4e6', border: `1px solid ${theme.borderColor}`, marginBottom: '25px', color: '#881337', fontSize: '18px', fontWeight: 900 }}>
                                    ⏳ Transit & Dasha Cycle: {personalData.dasha_note}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    onClick={() => setActiveTab('lunar')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '100px',
                                        background: '#e11d48',
                                        color: '#ffffff',
                                        border: 'none',
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)'
                                    }}
                                >
                                    Explore Lunar Diagnostics →
                                </button>
                                <button
                                    onClick={() => setActiveTab('remedies')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '100px',
                                        background: '#ffe4e6',
                                        color: '#881337',
                                        border: `1px solid ${theme.borderColor}`,
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Vedic Remedies 🌿
                                </button>
                            </div>
                        </div>

                        {worksheetData && (
                            <div style={{ marginTop: '40px' }}>
                                <DiagnosticDetails domain="mental_peace" worksheetData={worksheetData} isLightMode={isLightMode} />
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: LUNAR & MIND ANALYSIS */}
                {activeTab === 'lunar' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🧘 Manas & Buddhi (Moon & Mercury) Diagnostics</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Manas Karaka (Mind & Emotions)</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Moon (Chandra)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Rules emotional equilibrium, mood stability, and internal peace.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Buddhi Karaka (Intellect & Nervous System)</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Mercury (Budha)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Rules thought processing, logical reasoning, and nerve calmness.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>4th House (Heart Peace)</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Emotional Foundation</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>House of inner happiness, domestic tranquility, and security.</p>
                                </div>
                            </div>

                            {/* Yoga Alerts */}
                            {personalData?.yoga_alerts && personalData.yoga_alerts.length > 0 && (
                                <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '20px', background: '#ffe4e6', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#be123c', fontSize: '20px', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>⚡ Lunar Yogas & Sensitivity Alerts</h4>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '18px', color: '#881337', lineHeight: '1.7', fontWeight: 700 }}>
                                        {personalData.yoga_alerts.map((y, i) => (
                                            <li key={i}>{y}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Planetary Strengths & Roles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(personalData?.planets || [
                                    { name: 'Moon', role: 'Mind & Emotional Serenity', strength: '60/150' },
                                    { name: 'Mercury', role: 'Thought Processing & Logic', strength: '60/150' }
                                ]).map((p, idx) => (
                                    <div key={idx} style={{ padding: '15px 20px', borderRadius: '16px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: '#be123c' }}>
                                            <span>{p.name}</span>
                                            <span>{p.strength}</span>
                                        </div>
                                        <div style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>{p.role}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Mindset & Emotional Observations</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '20px', lineHeight: '1.8', color: '#1e293b' }}>
                                {(personalData?.notes || ["Moon and 4th house show balanced emotional foundation."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 3: SLEEP & SUBCONSCIOUS */}
                {activeTab === 'sleep' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🌙 Sleep, Subconscious & Shayana Sukha</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🎯 Sleep & Bed Comforts (12th House)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        The 12th house rules deep REM sleep, subconscious healing, and freedom from nocturnal anxiety. Benefics here promote serene rest.
                                    </p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🧠 Subconscious & Brain Focus</h4>
                                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#881337', margin: '0 0 10px 0' }}>{personalData?.organs || 'Brain, Nervous System, Subconscious Mind & Sleep Quality'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, fontStyle: 'italic' }}>Governed by Moon, Mercury & 12th House.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Lifestyle & Sleep Practices</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '20px', lineHeight: '1.8', color: '#1e293b' }}>
                                {(personalData?.lifestyle || [
                                    "Early morning sunlight exposure to harmonize Sun-Moon circadian rhythm.",
                                    "Barefoot walking on grass (Grounding) to pacify Ketu detachment.",
                                    "Maintain a soothing bedroom environment free of clutter for sound sleep."
                                ]).map((ls, idx) => (
                                    <li key={idx}>{ls}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 4: VEDIC REMEDIES */}
                {activeTab === 'remedies' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: 0, marginBottom: '20px' }}>🌿 Vedic Remedies & Emotional Grounding</h3>

                            <div style={{ padding: '20px', background: '#ffe4e6', borderRadius: '20px', marginBottom: '25px', border: `1px solid ${theme.borderColor}` }}>
                                <p style={{ fontSize: '16px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantras</p>
                                <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#881337' }}>
                                    {personalData?.mantra || 'Om Shram Shreem Shroum Sah Chandramase Namah & Om Namah Shivaya'}
                                </p>
                            </div>

                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                {(personalData?.remedies || [
                                    "Practice Anulom Vilom Pranayama & 15 minutes of daily mindfulness meditation.",
                                    "Drink water stored in a clean Silver Cup to strengthen Moon's calming water element.",
                                    "Chant Om Namah Shivaya or Chandra Beej Mantra during evening hours.",
                                    "Donate Milk, White Sweets, Rice, or Silver items on Mondays.",
                                    "Practice a strict digital detox 1 hour before sleep to calm Rahu overstimulation."
                                ]).map((rem, idx) => (
                                    <li key={idx}>{rem}</li>
                                ))}
                            </ul>
                        </div>

                        {/* General Educational Insights */}
                        <div>
                            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#052285ff', marginBottom: '25px', fontStyle: 'italic' }}>Vedic Guidance & Transits</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {filteredInsights.map((item, idx) => (
                                    <div key={idx} style={{
                                        background: theme.cardGeneralBg,
                                        padding: '25px',
                                        borderRadius: '25px',
                                        border: `1px solid ${theme.borderColor}`,
                                        boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <span style={{ fontSize: '16px', color: 'rgba(8, 5, 6, 1)', background: '#ffe4e6', padding: '4px 12px', borderRadius: '100px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${theme.borderColor}` }}>{item.category}</span>
                                            <span style={{ fontSize: '22px' }}>{item.icon || '🧘'}</span>
                                        </div>
                                        <h4 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(33, 145, 5, 1)', margin: '0 0 10px 0' }}>{item.title}</h4>
                                        <p style={{ fontSize: '22px', color: '#000000ff', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div style={{ maxWidth: '800px', margin: '80px auto 0', textAlign: 'center', background: '#ffe4e6', padding: '60px 40px', borderRadius: '40px', border: '1px solid #fecdd3' }}>
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Manas Shanti • Om Shanti Shanti Shanti</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '24px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Mental peace is the quiet reflection of the pure Moon within. Through meditation and devotion, internal serenity is restored."</p>
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

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
