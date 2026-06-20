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
    const [isLightMode, setIsLightMode] = useState(false);

    const theme = {
        bg: isLightMode ? '#f8fafc' : '#0f172a',
        text: isLightMode ? '#334155' : '#cbd5e1',
        heading: isLightMode ? '#0f172a' : 'white',
        headerGradient: isLightMode ? 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        cardBg: isLightMode ? 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(241,245,249,0.8))' : 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))',
        cardGeneralBg: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.02)',
        filterBg: isLightMode ? 'rgba(248, 250, 252, 0.9)' : 'rgba(15, 23, 42, 0.9)',
        borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)',
        buttonBg: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        filterInactiveText: isLightMode ? '#64748b' : '#94a3b8',
        accentColor: isLightMode ? '#d97706' : '#fbbf24',
        accentBg: isLightMode ? 'rgba(217,119,6,0.1)' : 'rgba(251,191,36,0.1)'
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
                <p style={{ color: theme.accentColor, fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>
                    {isHindi ? "पेशेवर नियति..." : "Calculating Destiny..."}
                </p>
                <style>{` @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } } `}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif', paddingBottom: '100px', position: 'relative' }}>
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
                padding: '100px 40px', 
                background: theme.headerGradient, 
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px' }}>
                    <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '40px', 
                        background: 'linear-gradient(to br, #fbbf24, #d97706)', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        boxShadow: '0 0 50px rgba(217,119,6,0.3)',
                        border: '1px solid rgba(251,191,36,0.5)'
                    }}>💼</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, tracking: '-1px' }}>
                            {isHindi ? "वैदिक करियर मार्गदर्शक" : "Vedic Career Oracle"}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                            <div style={{ width: '40px', height: '2px', background: theme.accentColor }}></div>
                            <p style={{ color: theme.accentColor, textTransform: 'uppercase', letterSpacing: '8px', fontSize: '14px', fontWeight: 900 }}>
                                {isHindi ? "व्यवसाय एवं सफलता ज्योतिष" : "Professional Karma • Success Mapping"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ backgroundColor: theme.filterBg, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${theme.borderColor}`, padding: '25px 0', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '15px', padding: '0 40px', overflowX: 'auto' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '15px',
                                background: filter === cat ? theme.accentColor : theme.buttonBg,
                                color: filter === cat ? (isLightMode ? '#fff' : '#78350f') : theme.filterInactiveText,
                                border: `1px solid ${theme.borderColor}`,
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
                {personalInsights.length > 0 && (
                    <section style={{ marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '32px', color: theme.heading, fontWeight: 900, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ width: '10px', height: '40px', background: theme.accentColor, borderRadius: '5px' }}></span>
                            {isHindi ? "आपका व्यक्तिगत विश्लेषण" : "Your Personal Analysis"}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {personalInsights.map((item, idx) => (
                                <div key={idx} style={{ 
                                    background: theme.cardBg, 
                                    padding: '40px', 
                                    borderRadius: '40px', 
                                    border: `1px solid ${isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(251,191,36,0.1)'}`,
                                    boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.05)' : '0 20px 40px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '40px', marginBottom: '20px' }}>{item.icon || '🚀'}</div>
                                    <h3 style={{ fontSize: '22px', fontWeight: 900, color: theme.heading, marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '17px', color: theme.text, lineHeight: '1.8' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 style={{ fontSize: '32px', color: theme.heading, fontWeight: 900, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span style={{ width: '10px', height: '40px', background: theme.borderColor, borderRadius: '5px' }}></span>
                        {isHindi ? "करियर मार्गदर्शन" : "Career Insights"}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredInsights.map((item, idx) => (
                            <div key={idx} style={{ 
                                background: theme.cardGeneralBg, 
                                padding: '40px', 
                                borderRadius: '40px', 
                                border: `1px solid ${theme.borderColor}`,
                                transition: 'all 0.3s ease',
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
                            }}>
                                <span style={{ padding: '5px 12px', borderRadius: '10px', background: theme.accentBg, color: theme.accentColor, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', display: 'inline-block', marginBottom: '20px' }}>{item.category}</span>
                                <h3 style={{ fontSize: '22px', fontWeight: 900, color: theme.heading, marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '17px', color: theme.filterInactiveText, lineHeight: '1.8' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ maxWidth: '800px', margin: '150px auto 0', textAlign: 'center', background: `linear-gradient(to bottom, ${theme.accentBg}, transparent)`, padding: '80px 40px', borderRadius: '60px' }}>
                <h3 style={{ fontSize: '28px', color: theme.heading, fontWeight: 900, marginBottom: '20px' }}>
                    {isHindi ? "अपने कर्म का सम्मान करें" : "Respect Your Karma"}
                </h3>
                <p style={{ color: theme.filterInactiveText, fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '40px' }}>
                    {isHindi 
                      ? "\"ज्योतिष केवल संभावनाओं को दर्शाता है। आपकी सफलता आपके पुरुषार्थ और नैतिकता पर निर्भर करती है।\""
                      : "\"Astrology map possibilities, but your effort (Purushartha) and ethics (Dharma) determine the final result.\""}
                </p>
                <button 
                    onClick={() => window.close()} 
                    style={{ 
                        padding: '24px 80px', 
                        borderRadius: '20px', 
                        background: isLightMode ? theme.heading : 'white', 
                        color: isLightMode ? 'white' : '#0f172a', 
                        border: 'none', 
                        fontSize: '12px', 
                        fontWeight: 900, 
                        textTransform: 'uppercase', 
                        letterSpacing: '4px', 
                        cursor: 'pointer',
                        boxShadow: isLightMode ? '0 10px 20px rgba(0,0,0,0.2)' : '0 20px 40px rgba(0,0,0,0.4)'
                    }}
                >
                    {isHindi ? "वर्कस्टेशन पर लौटें" : "Return to Workstation"}
                </button>
            </div>
        </div>
    );
}
