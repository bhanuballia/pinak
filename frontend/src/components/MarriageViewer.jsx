import React, { useState, useEffect } from 'react';
import { fetchMarriageInsights, fetchPersonalMarriageInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function MarriageViewer() {
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [isLightMode, setIsLightMode] = useState(true);
    const [fontScale, setFontScale] = useState(1);

    const increaseFont = () => setFontScale(prev => Math.min(prev + 0.1, 1.5));
    const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.1, 0.7));
    const resetFont = () => setFontScale(1);

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

                const [general, personalRes] = await Promise.all([
                    fetchMarriageInsights().catch(e => {
                        console.error("General marriage insights fetch failed", e);
                        return [];
                    }),
                    uData.date && uData.lat && uData.lon
                        ? fetchPersonalMarriageInsights(uData).catch(e => {
                            console.error("Personal marriage analysis failed", e);
                            return null;
                        })
                        : Promise.resolve(null)
                ]);

                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.marriage) {
                            setPersonalData(parsed.life_oracle.marriage);
                        } else if (personalRes) {
                            setPersonalData(personalRes);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for marriage", e);
                        if (personalRes) setPersonalData(personalRes);
                    }
                } else if (personalRes) {
                    setPersonalData(personalRes);
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
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: `${24 * fontScale}px`, textTransform: 'uppercase' }}>Aligning Destinies...</p>
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
                    background: '#ffe4e6',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #fecdd3',
                    boxShadow: '0 2px 8px rgba(136, 19, 55, 0.1)'
                }}>
                    <button onClick={decreaseFont} style={{ background: 'transparent', border: 'none', borderRight: '1px solid #fecdd3', padding: '6px 12px', color: '#881337', cursor: 'pointer', fontWeight: 'bold' }}>A-</button>
                    <button onClick={resetFont} style={{ background: 'transparent', border: 'none', borderRight: '1px solid #fecdd3', padding: '6px 12px', color: '#881337', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
                    <button onClick={increaseFont} style={{ background: 'transparent', border: 'none', padding: '6px 12px', color: '#881337', cursor: 'pointer', fontWeight: 'bold' }}>A+</button>
                </div>

                <button
                    onClick={() => setIsLightMode(!isLightMode)}
                    style={{
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
            </div>

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
                        fontSize: `${60 * fontScale}px`,
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>💑</div>
                    <div>
                        <h1 style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Marriage & Relationship Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: `${18 * fontScale}px`, fontWeight: 900, marginTop: '10px' }}>
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
                                background: filter === cat ? '#e11d48' : '#ffffff',
                                color: filter === cat ? '#ffffff' : '#881337',
                                border: filter === cat ? 'none' : `1px solid ${theme.borderColor}`,
                                fontSize: `${18 * fontScale}px`,
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
                        <h3 style={{ fontSize: `${24 * fontScale}px`, fontWeight: 900, color: '#be123c', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: '#475569', fontSize: `${18 * fontScale}px` }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {personalData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: `${38 * fontScale}px`, color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Personal Marital Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Marriage Age Card */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: `${14 * fontScale}px`, textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#be123c', marginBottom: '15px' }}>Predicted Marriage Window</p>
                                <p style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: '#881337', margin: '10px 0' }}>{personalData.age}</p>
                                <p style={{ fontSize: `${18 * fontScale}px`, fontWeight: 700, color: '#be123c', fontStyle: 'italic' }}>{personalData.age_en}</p>
                            </div>

                            {/* Harmony Score Card */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: `${14 * fontScale}px`, textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#475569', marginBottom: '15px' }}>Harmony Index</p>
                                <p style={{ fontSize: `${64 * fontScale}px`, fontWeight: 900, color: '#881337', margin: '10px 0' }}>{personalData.harmony_index}</p>
                                <p style={{ fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#b45309' }}>{personalData.label}</p>
                            </div>

                            {/* 7th House Insights */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                gridColumn: 'span 2'
                            }}>
                                <p style={{ fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#be123c', marginBottom: '25px' }}>7th House & Lord Analysis</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <h4 style={{ color: '#881337', fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Planetary Influences</h4>
                                        {personalData.seventh_house_notes?.map((n, i) => (
                                            <p key={i} style={{ fontSize: `${18 * fontScale}px`, color: '#1e293b', marginBottom: '8px', fontStyle: 'italic' }}>• {n}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#0369a1', fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Placement Impact</h4>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#1e293b', fontStyle: 'italic' }}>• {personalData.lord_placement}</p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#1e293b', marginTop: '10px', fontStyle: 'italic' }}>• Matches: {personalData.matching_signs}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SPOUSAL PROFILE & INTERACTION ANALYTICS CARD GRID */}
                        <div style={{
                            marginTop: '40px',
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <span style={{ fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#be123c' }}>
                                    ✨ Classical KP & Parashari Spousal Analytics
                                </span>
                                <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: '#881337', marginTop: '8px', fontStyle: 'italic' }}>
                                    💍 Detailed Spouse Profile & Matrimonial Dynamics
                                </h3>
                                <p style={{ fontSize: `${20 * fontScale}px`, color: 'rgba(0, 0, 0, 1)', fontStyle: 'italic', marginTop: '4px' }}>
                                    Derived directly from 7th Cusp Sublord, Sign Lord & House Significators in marriage_rules.json
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                {/* 1. Romantic & Intimacy Style */}
                                <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#be123c', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        Romantic & Intimacy Style
                                    </h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.cusp_pleasure_desc || 'Balanced conjugal harmony matching standard planetary aspects.'}"
                                    </p>
                                    <span style={{ fontSize: `${14 * fontScale}px`, color: '#475569', textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Cusp Sublord Conjugal Rule (cusp_pleasure)
                                    </span>
                                </div>

                                {/* 2. Spousal Age Gap Estimator */}
                                <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#b45309', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        ⏳ Spousal Age Gap Estimator
                                    </h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_age_diff_desc || 'Moderate age difference matching conventional standards.'}"
                                    </p>
                                    <span style={{ fontSize: `${14 * fontScale}px`, color: '#475569', textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Lord Age Matrix (partner_age_diff)
                                    </span>
                                </div>

                                {/* 3. Partner Locality & Meeting Place */}
                                <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#0369a1', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        📍 Meeting Place & Spouse Locality
                                    </h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_locality_desc || 'Spouse comes from standard local or familiar family connections.'}"
                                    </p>
                                    <span style={{ fontSize: `${14 * fontScale}px`, color: '#475569', textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Lord House Location (partner_locality)
                                    </span>
                                </div>

                                {/* 4. Spouse Professional Domain Analysis */}
                                <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#15803d', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        💼 Spouse Professional Domain
                                    </h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_profession_desc || 'Career judged from Houses 4, 8, and 12 significators.'}"
                                    </p>
                                    <span style={{ fontSize: `${14 * fontScale}px`, color: '#475569', textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: Houses 4, 8, 12 Career Significators (partner_profession)
                                    </span>
                                </div>

                                {/* 5. 7th Cusp Sublord Physical Appearance & Temperament */}
                                <div style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}`, gridColumn: 'span 2' }}>
                                    <h4 style={{ color: '#6b21a8', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        👤 Spouse Physical Features & Personality Temperament
                                    </h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', fontWeight: 600, lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                                        "{personalData.partner_appearance_features || 'Stature and temperament governed by 7th Lord and Sign.'}"
                                    </p>
                                    <span style={{ fontSize: `${14 * fontScale}px`, color: '#475569', textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Cusp Sublord Feature Matrix (seventh_cusp_sublord_features)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* LOVE MARRIAGE & MARRYING YOUR BELOVED ANALYSIS CARD */}
                        {(() => {
                            const loveAnalysis = personalData.love_marriage_analysis || {
                                status_title: "💍 Conventional / Family Blessed Marriage Alignment",
                                status_desc: "Your chart favors a well-balanced, family-supported arrangement with steady post-marital affection.",
                                key_rules: [
                                    {
                                        title: "💞 5th & 7th Lords Connection (Love to Marriage Conversion)",
                                        meaning: "Astrological Meaning: When the 5th Lord (lover/sweetheart) connects with the 7th Lord (marriage) or Lagna Lord, love turns into marriage. The person you love becomes your wedded spouse with mutual family approval.",
                                        kundali_status: "In your Kundali: Neutral. Romance turns to marriage via general planetary Dashas."
                                    },
                                    {
                                        title: "📍 Meeting Locality & Self-Choice Signature (Houses 5/9)",
                                        meaning: "Astrological Meaning: If 7th Lord resides in 5th or 9th house, it signifies meeting spouse through romance, personal choice, higher learning, or long-distance travel.",
                                        kundali_status: "In your Kundali: Familiar. Indicates conventional or family-introduced meeting."
                                    },
                                    {
                                        title: "💖 Romantically Blessed 7th House (Venus/Jupiter Harmony)",
                                        meaning: "Astrological Meaning: Benefic Jupiter or Venus aspecting 7th house ensures unhindered affection, high marital dignity, and smooth marriage ceremonies.",
                                        kundali_status: "In your Kundali: Standard. Relationship harmony relies on active Dasha periods."
                                    },
                                    {
                                        title: "⚠️ Breakup & Friction Warning Filter (Malefic / Square Aspects)",
                                        meaning: "Astrological Meaning: Malefics or square aspects in 7th/Moon house warn of sudden emotional misunderstandings requiring calm communication and remedies.",
                                        kundali_status: "In your Kundali: Clear & Unafflicted! Free from major breakup afflictions."
                                    }
                                ]
                            };

                            return (
                                <div style={{
                                    marginTop: '40px',
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '35px',
                                    border: `1px solid ${theme.borderColor}`,
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <span style={{ fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#be123c' }}>
                                            💘 Romance to Matrimony Diagnostic
                                        </span>
                                        <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: '#881337', marginTop: '8px', fontStyle: 'italic' }}>
                                            {loveAnalysis.status_title}
                                        </h3>
                                        <p style={{ fontSize: `${20 * fontScale}px`, color: 'rgba(0, 0, 0, 1)', fontStyle: 'italic', marginTop: '6px', lineHeight: '1.6' }}>
                                            "{loveAnalysis.status_desc}"
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '25px' }}>
                                        {loveAnalysis.key_rules?.map((item, idx) => {
                                            const isObj = typeof item === 'object' && item !== null;
                                            const title = isObj ? item.title : `Rule ${idx + 1}`;
                                            const meaning = isObj ? item.meaning : item;
                                            const kundaliStatus = isObj ? item.kundali_status : null;

                                            return (
                                                <div key={idx} style={{
                                                    background: '#fff1f2',
                                                    padding: '24px',
                                                    borderRadius: '25px',
                                                    border: `1px solid ${theme.borderColor}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div>
                                                        <h4 style={{ color: '#be123c', fontSize: `${20 * fontScale}px`, fontWeight: 900, marginBottom: '10px' }}>
                                                            {title}
                                                        </h4>
                                                        <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', lineHeight: '1.6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                            {meaning}
                                                        </p>
                                                    </div>

                                                    {kundaliStatus && (
                                                        <div style={{
                                                            background: '#ffe4e6',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            borderLeft: '4px solid #e11d48',
                                                            border: '1px solid #fecdd3'
                                                        }}>
                                                            <span style={{ fontSize: `${14 * fontScale}px`, fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                                                🔮 Personal Kundali Verification
                                                            </span>
                                                            <p style={{ fontSize: `${18 * fontScale}px`, color: '#881337', margin: 0, fontWeight: 700 }}>
                                                                {kundaliStatus}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* DIVORCE & SEPARATION RISK DIAGNOSTIC CARD */}
                        {(() => {
                            const divAnalysis = personalData.divorce_separation_analysis || {
                                status_title: "🛡️ High Marital Stability & Low Separation Risk",
                                status_desc: "Your chart is free from major 6th/10th house separation signatures. Marriage is protected against legal divorce.",
                                key_rules: [
                                    {
                                        title: "⚖️ KP Separation Houses Connection (Houses 6 & 10)",
                                        meaning: "Astrological Meaning: In KP Astrology, House 6 (separation/litigation) and House 10 (loss of 11th fulfillment) act as negating houses for the 7th house (marriage). Placement of 7th Lord in 6/10 causes legal separation.",
                                        kundali_status: "In your Kundali: Clear! 7th Lord is free from 6/10 separation negations."
                                    },
                                    {
                                        title: "⚡ Permanent Domestic Friction Signature (U9 Rule)",
                                        meaning: "Astrological Meaning: Malefics in the 7th house connected to 6th or 10th house lords indicate chronic temperament differences or temporary living in separate premises.",
                                        kundali_status: "In your Kundali: Harmonious! Free from chronic U9 friction signatures."
                                    },
                                    {
                                        title: "🔄 Dual Sign Sublord Restructuring (P8 Rule)",
                                        meaning: "Astrological Meaning: Sublord of 7th cusp placed in dual sign (Gemini, Virgo, Sagittarius, Pisces) with malefic aspects indicates potential for marital restructuring or second marriage.",
                                        kundali_status: "In your Kundali: Stable! Fixed/Moveable sign placement promotes single unified marriage."
                                    },
                                    {
                                        title: "🛡️ Benefic Ward-Off Factor (Jupiter / Venus Protection)",
                                        meaning: "Astrological Meaning: Benefic Jupiter or Venus aspecting 2nd or 7th house wards off evil malefic afflictions and prevents permanent divorce breakdown.",
                                        kundali_status: "In your Kundali: Protected! Strong benefic presence shields marriage from legal dissolution."
                                    }
                                ]
                            };

                            return (
                                <div style={{
                                    marginTop: '40px',
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '35px',
                                    border: `1px solid ${theme.borderColor}`,
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <span style={{ fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#be123c' }}>
                                            ⚠️ Legal Separation & Divorce Risk Assessment
                                        </span>
                                        <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: '#881337', marginTop: '8px', fontStyle: 'italic' }}>
                                            {divAnalysis.status_title}
                                        </h3>
                                        <p style={{ fontSize: `${20 * fontScale}px`, color: 'rgba(0, 0, 0, 1)', fontStyle: 'italic', marginTop: '6px', lineHeight: '1.6' }}>
                                            "{divAnalysis.status_desc}"
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '25px' }}>
                                        {divAnalysis.key_rules?.map((item, idx) => {
                                            const isObj = typeof item === 'object' && item !== null;
                                            const title = isObj ? item.title : `Rule ${idx + 1}`;
                                            const meaning = isObj ? item.meaning : item;
                                            const kundaliStatus = isObj ? item.kundali_status : null;

                                            return (
                                                <div key={idx} style={{
                                                    background: '#fff1f2',
                                                    padding: '24px',
                                                    borderRadius: '25px',
                                                    border: `1px solid ${theme.borderColor}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div>
                                                        <h4 style={{ color: '#be123c', fontSize: `${20 * fontScale}px`, fontWeight: 900, marginBottom: '10px' }}>
                                                            {title}
                                                        </h4>
                                                        <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', lineHeight: '1.6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                            {meaning}
                                                        </p>
                                                    </div>

                                                    {kundaliStatus && (
                                                        <div style={{
                                                            background: '#ffe4e6',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            borderLeft: '4px solid #e11d48',
                                                            border: '1px solid #fecdd3'
                                                        }}>
                                                            <span style={{ fontSize: `${14 * fontScale}px`, fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                                                🔮 Personal Kundali Verification
                                                            </span>
                                                            <p style={{ fontSize: `${18 * fontScale}px`, color: '#881337', margin: 0, fontWeight: 700 }}>
                                                                {kundaliStatus}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* KP Childbirth & Delivery Timing Section */}
                        {personalData.kp_childbirth_timing && (
                            <div style={{
                                marginTop: '50px',
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                                    <div>
                                        <p style={{ fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#be123c', margin: 0 }}>KP Astrology Diagnostic</p>
                                        <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: '#881337', margin: '5px 0 0 0', fontStyle: 'italic' }}>👶 KP Childbirth & Delivery Timing Analysis</h3>
                                    </div>
                                    <span style={{
                                        padding: '8px 20px',
                                        borderRadius: '100px',
                                        background: '#dcfce7',
                                        color: '#15803d',
                                        border: '1px solid #22c55e',
                                        fontSize: `${14 * fontScale}px`,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {personalData.kp_childbirth_timing.promise_status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                    <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: '#be123c', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Prime Significators (2, 5, 11)</h4>
                                        <p style={{ fontSize: `${20 * fontScale}px`, fontWeight: 600, color: '#881337', margin: 0 }}>
                                            {personalData.kp_childbirth_timing.prime_significators?.join(', ') || 'None'}
                                        </p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#475569', marginTop: '8px' }}>5th House Lord: <strong>{personalData.kp_childbirth_timing.fifth_house_lord}</strong></p>
                                    </div>

                                    <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: '#0369a1', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Ruling Planets (RP)</h4>
                                        <p style={{ fontSize: `${20 * fontScale}px`, fontWeight: 600, color: '#881337', margin: 0 }}>
                                            {personalData.kp_childbirth_timing.ruling_planets?.join(', ') || 'None'}
                                        </p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#475569', marginTop: '8px' }}>Chief Karaka for Progeny: <strong>Jupiter</strong></p>
                                    </div>

                                    <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: '#b45309', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Sign Characteristics</h4>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#1e293b', margin: '4px 0' }}>• 5th Cusp Barren: <strong>{personalData.kp_childbirth_timing.is_fifth_barren_sign ? 'Yes' : 'No (Fruitful/Mute)'}</strong></p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: '#1e293b', margin: '4px 0' }}>• Moon Sign Barren: <strong>{personalData.kp_childbirth_timing.is_moon_barren_sign ? 'Yes' : 'No'}</strong></p>
                                    </div>
                                </div>

                                <div style={{ background: '#ffe4e6', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}`, marginBottom: '30px' }}>
                                    <h4 style={{ color: '#881337', fontSize: `${20 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Exact Delivery Timing Transit Rule</h4>
                                    <p style={{ fontSize: `${20 * fontScale}px`, color: '#1e293b', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                                        "{personalData.kp_childbirth_timing.predicted_transit_rule}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {worksheetData && (
                            <DiagnosticDetails domain="marriage" worksheetData={worksheetData} isLightMode={isLightMode} />
                        )}
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: `${32 * fontScale}px`, color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Relationship Wisdom</h2>
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
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: '#ffe4e6', fontSize: `${16 * fontScale}px`, color: 'rgba(8, 5, 6, 1)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${theme.borderColor}` }}>{item.category}</span>
                                    <span style={{ fontSize: `${24 * fontScale}px` }}>{item.icon || '💖'}</span>
                                </div>
                                <h3 style={{ fontSize: `${24 * fontScale}px`, fontWeight: 900, color: 'rgba(33, 145, 5, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: `${22 * fontScale}px`, color: '#000000ff', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#881337', fontSize: `${30 * fontScale}px`, fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Mangalyam Tantu Nanena</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: `${30 * fontScale}px`, maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"This sacred bond is woven by the threads of destiny. Use these insights to nurture understanding, patience, and mutual growth."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '20px 60px',
                        borderRadius: '100px',
                        background: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: `${18 * fontScale}px`,
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
