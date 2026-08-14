import React, { useState, useEffect } from 'react';
import { fetchSpouseHealthInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function SpouseHealthViewer() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vitality' | 'organs' | 'remedies'
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
                    fetchSpouseHealthInsights().catch(e => {
                        console.error("General spouse health insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.spouse_health) {
                            setPersonalData(parsed.life_oracle.spouse_health);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for spouse health", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Spouse health insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'heartbeat 1.5s ease-in-out infinite' }}>💖</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Aligning Partner Energies...</p>
                <style>{` @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } } `}</style>
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

    const sScore = personalData?.score !== undefined ? personalData.score : 'N/A';
    const sRisk = personalData?.risk_level || (sScore !== 'N/A' ? (sScore >= 70 ? 'Low' : sScore >= 50 ? 'Moderate' : 'High') : null);

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
                    }}>💍</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Spouse Health Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Partner Vitality • Marital Wellness & Vedic Protection
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
                        { id: 'overview', label: '📊 Overview', desc: 'Summary & Vitality Index' },
                        { id: 'vitality', label: '💖 Partner Vitality', desc: '7th House & Karakas' },
                        { id: 'organs', label: '🏥 Health & Organs', desc: 'Anatomy & Disease Axes' },
                        { id: 'remedies', label: '🌿 Vedic Remedies', desc: 'Mantras & Fasting Seva' }
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
                                <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#be123c' }}>💍 Partner Health Index (7th House)</span>
                                {sRisk && (
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                        fontWeight: 900,
                                        backgroundColor: '#ffe4e6',
                                        color: getRiskColor(sRisk),
                                        border: `1px solid ${theme.borderColor}`,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {sRisk} Sensitivity
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '48px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>
                                {sScore !== 'N/A' ? `${sScore}/100` : 'N/A'}
                                <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.7, marginLeft: '10px', color: '#be123c' }}>Vitality Index</span>
                            </div>

                            <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData ? (Array.isArray(personalData.notes) ? personalData.notes.join(' ') : (personalData.notes || 'Analyzed via 7th House, 7th Lord & Karakas.')) : 'Partner health analysis extracts 7th house, Venus/Jupiter karakas, and disease/longevity house dynamics.'}
                            </p>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    onClick={() => setActiveTab('vitality')}
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
                                    Explore Vitality Diagnostics →
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
                                <DiagnosticDetails domain="spouse_health" worksheetData={worksheetData} isLightMode={isLightMode} />
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: PARTNER VITALITY */}
                {activeTab === 'vitality' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>💖 Partner Vitality & Karaka Analysis</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Female Spouse Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Venus (Shukra)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Governs harmony, physical grace, and reproductive health.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Male Spouse Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Jupiter (Guru)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Governs husband's wisdom, protection, and vital organs.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>7th House Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{personalData?.lord_7 || '7th Lord'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Ruler of spouse body, vitality & marital longevity.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Planetary Strengths & Roles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(personalData?.planets || [
                                    { name: 'Venus', role: 'Wife / Harmony & Hormones', strength: '60/150' },
                                    { name: 'Jupiter', role: 'Husband / Protection & Longevity', strength: '60/150' }
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

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Astrological Observations</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '20px', lineHeight: '1.8', color: '#1e293b' }}>
                                {(personalData?.notes || ["7th house receives supportive aspects."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 3: HEALTH & ORGAN FOCUS */}
                {activeTab === 'organs' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🏥 Anatomical & Disease House Diagnostics</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🎯 Anatomical Focus</h4>
                                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#881337', margin: '0 0 10px 0' }}>{personalData?.organs || 'Kidneys, Lower Back, Reproductive Organs & Hormones'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, fontStyle: 'italic' }}>Governed by 7th house and Libra zodiac sign.</p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>⚡ 12th House Axis (6th from 7th)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        The 12th house represents acute illnesses or fatigue for your partner. Malefics here warrant timely medical checkups and low-stress lifestyles.
                                    </p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>⏳ 2nd House Axis (8th from 7th)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        The 2nd house acts as the longevity engine for the spouse. Benefic aspects to the 2nd house promote long-term vitality and fast recovery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* TAB 4: VEDIC REMEDIES */}
                {activeTab === 'remedies' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: 0, marginBottom: '20px' }}>🌿 Vedic Remedies & Partner Protection</h3>

                            <div style={{ padding: '20px', background: '#ffe4e6', borderRadius: '20px', marginBottom: '25px', border: `1px solid ${theme.borderColor}` }}>
                                <p style={{ fontSize: '16px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantras</p>
                                <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#881337' }}>
                                    {personalData?.mantra || 'Om Shukraya Namah (for Wife) & Om Gram Greem Groum Sah Gurave Namah (for Husband)'}
                                </p>
                            </div>

                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                {(personalData?.remedies || [
                                    "Maintain deep mutual respect and avoid unnecessary domestic friction.",
                                    "Donate White sweets, Milk, or Silver on Fridays for Venus (Wife's health).",
                                    "Donate Yellow Chana Dal, Turmeric, or Gold/Copper on Thursdays for Jupiter (Husband's health).",
                                    "Chant Swayamvara Parvathi Mantra or Maha Mrityunjaya Jaap for partner's longevity.",
                                    "Perform Gauri Shankar Pooja for long-term marital health & bliss."
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
                                            <span style={{ fontSize: '22px' }}>{item.icon || '💍'}</span>
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
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Dharmo Rakshati Rakshitah • Gauri Shankar Kripa</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '24px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Spouse is the equal half (Ardhangini/Ardhanga). Mutual care, respect, and spiritual alignment foster enduring physical vitality."</p>
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
