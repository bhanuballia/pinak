import React, { useState, useEffect } from 'react';
import { fetchCareerInsights, fetchPersonalCareerInsights } from '../services/api';

export default function CareerViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [isHindi, setIsHindi] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('lang') === 'hindi';
    });
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
        accentColor: '#be123c',
        accentBg: '#ffe4e6'
    };

    useEffect(() => {
        setLoading(true);
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);

                const uData = {
                    name: params.get('name') || 'User',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz'),
                    lang: isHindi ? 'hindi' : 'english'
                };

                const [general, personalRes] = await Promise.all([
                    fetchCareerInsights(),
                    uData.date && uData.lat && uData.lon
                        ? fetchPersonalCareerInsights(uData).catch(e => {
                            console.error("Personal career analysis failed", e);
                            return [];
                        })
                        : Promise.resolve([])
                ]);

                setInsights(general);
                setPersonalInsights(personalRes);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Career insights fetch error:", err);
                setError(`Connection Error: ${err.message || "Unknown Error"}`);
            } finally {
                setLoading(false);
            }
        };
        loadInsights();
    }, [isHindi]);

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'pulse 2s infinite' }}>💼</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>
                    {isHindi ? "पेशेवर नियति..." : "Calculating Destiny..."}
                </p>
                <style>{` @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } } `}</style>
            </div>
        );
    }

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
                <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '50%', filter: 'blur(120px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '35px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)',
                        border: '1px solid #fecdd3'
                    }}>💼</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, letterSpacing: '-1px' }}>
                            {isHindi ? "वैदिक करियर मार्गदर्शक" : "Vedic Career Oracle"}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                            <div style={{ width: '40px', height: '3px', background: '#be123c' }}></div>
                            <p style={{ color: 'rgba(2, 1, 1, 1)', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, margin: 0 }}>
                                {isHindi ? "व्यवसाय एवं सफलता ज्योतिष" : "Professional Karma • Success Mapping"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ backgroundColor: theme.filterBg, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${theme.borderColor}`, padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }}>
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

                {personalInsights.length > 0 && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: '38px', color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>
                                {isHindi ? "आपका व्यक्तिगत विश्लेषण" : "Your Personal Analysis"}
                            </h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {personalInsights.map((item, idx) => (
                                <div key={idx} style={{
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '35px',
                                    border: '1px solid #fecdd3',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ fontSize: '40px', marginBottom: '20px' }}>{item.icon || '🚀'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(180, 93, 12, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 1)', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Classical Priority Hierarchy for Selecting Career / Profession */}
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
                                    📜 Parashari & Jaimini Karma Sastra
                                </span>
                                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#881337', marginTop: '8px' }}>
                                    🏆 {isHindi ? "करियर चयन की शास्त्रीय प्राथमिकता सूची" : "Classical Priority Hierarchy for Selecting Career Field"}
                                </h3>
                                <p style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 1)', fontStyle: 'italic', marginTop: '6px' }}>
                                    {isHindi ? "ज्योतिषीय महत्व के अनुसार पेशेवर कारकों का मूल्यांकन" : "How to evaluate professional astrological factors in order of classical importance"}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                                <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #e11d48', border: '1px solid #fecdd3', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        1st Priority (Rank #1)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#881337', marginBottom: '8px' }}>
                                        🥇 10th Lord Placement & 10th House Sign
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Core Karma & Primary Profession:</b> 10th Lord (e.g. Venus in 8th) + 10th Sign (Taurus) dictates core field (Finance, Audit, Taxation, Research, Luxury, Risk Management).
                                    </p>
                                </div>

                                <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #0284c7', border: '1px solid #bae6fd', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        2nd Priority (Rank #2)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#0c4a6e', marginBottom: '8px' }}>
                                        🥈 Dashamsha (D-10) Lagna
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Real-World Execution & Status:</b> Reveals your physical work environment, leadership capacity, corporate standing, and career execution power.
                                    </p>
                                </div>

                                <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #16a34a', border: '1px solid #bbf7d0', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        3rd Priority (Rank #3)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#14532d', marginBottom: '8px' }}>
                                        🥉 Birth Nakshatra (Hasta)
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Inherent Skill & Work Style:</b> Hasta Nakshatra grants natural dexterity, hands-on craftsmanship, analytical precision, and negotiation skills.
                                    </p>
                                </div>

                                <div style={{ background: '#faf5ff', padding: '24px', borderRadius: '24px', borderLeft: '5px solid #9333ea', border: '1px solid #e9d5ff', borderLeftWidth: '5px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        4th Priority (Rank #4)
                                    </div>
                                    <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#581c87', marginBottom: '8px' }}>
                                        🏅 Venus & Mercury Significations
                                    </h4>
                                    <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6' }}>
                                        <b>Domain & Communication Catalyst:</b> Venus provides financial/aesthetic direction, while Mercury fuels commercial intellect, trading, and data analysis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>
                            {isHindi ? "करियर मार्गदर्शन" : "Career Insights"}
                        </h2>
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
                <h3 style={{ fontSize: '28px', color: '#881337', fontWeight: 900, marginBottom: '20px' }}>
                    {isHindi ? "अपने कर्म का सम्मान करें" : "Respect Your Karma"}
                </h3>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '30px', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '40px' }}>
                    {isHindi
                        ? "\"ज्योतिष केवल संभावनाओं को दर्शाता है। आपकी सफलता आपके पुरुषार्थ और नैतिकता पर निर्भर करती है।\""
                        : "\"Astrology maps possibilities, but your effort (Purushartha) and ethics (Dharma) determine the final result.\""}
                </p>
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
                    {isHindi ? "वर्कस्टेशन पर लौटें" : "Return to Workstation"}
                </button>
            </div>
        </div>
    );
}
