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

                        {/* ── SPOUSAL PROFILE & INTERACTION ANALYTICS CARD GRID ── */}
                        <div style={{
                            marginTop: '40px',
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '50px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <span style={{ fontSize: `${11 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: theme.accentText }}>
                                    ✨ Classical KP & Parashari Spousal Analytics
                                </span>
                                <h3 style={{ fontSize: `${26 * fontScale}px`, fontWeight: 900, color: theme.heading, marginTop: '8px', fontStyle: 'italic' }}>
                                    💍 Detailed Spouse Profile & Matrimonial Dynamics
                                </h3>
                                <p style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, fontStyle: 'italic', marginTop: '4px' }}>
                                    Derived directly from 7th Cusp Sublord, Sign Lord & House Significators in marriage_rules.json
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                {/* 1. Sexual & Romantic Pleasure Style */}
                                <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#fb7185', fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        Romantic & Intimacy Style
                                    </h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.cusp_pleasure_desc || 'Balanced conjugal harmony matching standard planetary aspects.'}"
                                    </p>
                                    <span style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Cusp Sublord Conjugal Rule (cusp_pleasure)
                                    </span>
                                </div>

                                {/* 2. Spousal Age Difference Estimator */}
                                <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#f59e0b', fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        ⏳ Spousal Age Gap Estimator
                                    </h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_age_diff_desc || 'Moderate age difference matching conventional standards.'}"
                                    </p>
                                    <span style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Lord Age Matrix (partner_age_diff)
                                    </span>
                                </div>

                                {/* 3. Partner Locality & Meeting Place */}
                                <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#3b82f6', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        📍 Meeting Place & Spouse Locality
                                    </h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_locality_desc || 'Spouse comes from standard local or familiar family connections.'}"
                                    </p>
                                    <span style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Lord House Location (partner_locality)
                                    </span>
                                </div>

                                {/* 4. Spouse Professional Domain Analysis */}
                                <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ color: '#10b981', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        💼 Spouse Professional Domain
                                    </h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        "{personalData.partner_profession_desc || 'Career judged from Houses 4, 8, and 12 significators.'}"
                                    </p>
                                    <span style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: Houses 4, 8, 12 Career Significator (partner_profession)
                                    </span>
                                </div>

                                {/* 5. 7th Cusp Sublord Physical Appearance & Temperament */}
                                <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}`, gridColumn: 'span 2' }}>
                                    <h4 style={{ color: '#a855f7', fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                                        👤 Spouse Physical Features & Personality Temperament
                                    </h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, fontWeight: 600, lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                                        "{personalData.partner_appearance_features || 'Stature and temperament governed by 7th Lord and Sign.'}"
                                    </p>
                                    <span style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, textTransform: 'uppercase', display: 'block', marginTop: '10px', fontWeight: 900 }}>
                                        Source: 7th Cusp Sublord Feature Matrix (seventh_cusp_sublord_features)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── LOVE MARRIAGE & MARRYING YOUR BELOVED ANALYSIS CARD ── */}
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
                                    borderRadius: '50px',
                                    border: `1px solid ${theme.borderColor}`,
                                    boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <span style={{ fontSize: `${12 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#fb7185' }}>
                                            💘 Romance to Matrimony Diagnostic
                                        </span>
                                        <h3 style={{ fontSize: `${26 * fontScale}px`, fontWeight: 900, color: theme.heading, marginTop: '8px', fontStyle: 'italic' }}>
                                            {loveAnalysis.status_title}
                                        </h3>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, fontStyle: 'italic', marginTop: '6px', lineHeight: '1.6' }}>
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
                                                    background: theme.buttonBg,
                                                    padding: '24px',
                                                    borderRadius: '25px',
                                                    border: `1px solid ${theme.borderColor}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justify: 'space-between'
                                                }}>
                                                    <div>
                                                        <h4 style={{ color: '#fb7185', fontSize: `${18 * fontScale}px`, fontWeight: 900, marginBottom: '10px' }}>
                                                            {title}
                                                        </h4>
                                                        <p style={{ fontSize: `${22 * fontScale}px`, color: theme.text, lineHeight: '1.6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                            {meaning}
                                                        </p>
                                                    </div>

                                                    {kundaliStatus && (
                                                        <div style={{
                                                            background: isLightMode ? 'rgba(251, 113, 133, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            borderLeft: '4px solid #fb7185',
                                                            border: `1px solid ${theme.borderColor}`
                                                        }}>
                                                            <span style={{ fontSize: `${16 * fontScale}px`, fontWeight: 300, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                                                🔮 Personal Kundali Verification
                                                            </span>
                                                            <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, margin: 0, fontWeight: 300 }}>
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

                        {/* ── DIVORCE & SEPARATION RISK DIAGNOSTIC CARD ── */}
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
                                    borderRadius: '50px',
                                    border: `1px solid ${theme.borderColor}`,
                                    boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <span style={{ fontSize: `${12 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#ef4444' }}>
                                            ⚠️ Legal Separation & Divorce Risk Assessment
                                        </span>
                                        <h3 style={{ fontSize: `${26 * fontScale}px`, fontWeight: 900, color: theme.heading, marginTop: '8px', fontStyle: 'italic' }}>
                                            {divAnalysis.status_title}
                                        </h3>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, fontStyle: 'italic', marginTop: '6px', lineHeight: '1.6' }}>
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
                                                    background: theme.buttonBg,
                                                    padding: '24px',
                                                    borderRadius: '25px',
                                                    border: `1px solid ${theme.borderColor}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justify: 'space-between'
                                                }}>
                                                    <div>
                                                        <h4 style={{ color: '#ef4444', fontSize: `${18 * fontScale}px`, fontWeight: 900, marginBottom: '10px' }}>
                                                            {title}
                                                        </h4>
                                                        <p style={{ fontSize: `${22 * fontScale}px`, color: theme.text, lineHeight: '1.6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                            {meaning}
                                                        </p>
                                                    </div>

                                                    {kundaliStatus && (
                                                        <div style={{
                                                            background: isLightMode ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                                                            padding: '12px 16px',
                                                            borderRadius: '16px',
                                                            borderLeft: '4px solid #ef4444',
                                                            border: `1px solid ${theme.borderColor}`
                                                        }}>
                                                            <span style={{ fontSize: `${16 * fontScale}px`, fontWeight: 300, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                                                🔮 Personal Kundali Verification
                                                            </span>
                                                            <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, margin: 0, fontWeight: 300 }}>
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

                        {/* Activated Marriage Rules from marriage_rules.json Separated by Chart */}
                        {(() => {
                            const allRules = [
                                ...(personalData.jataka_rules || []),
                                ...(personalData.happy_rules || []),
                                ...(personalData.delay_rules || []),
                                ...(personalData.unhappy_rules || []),
                                ...(personalData.partner_traits || []),
                                ...(personalData.plurality_rules || [])
                            ].filter(r => r.satisfied);

                            const d1Rules = allRules.filter(r => (r.chart || '').includes('Lagna (D1)') || (r.chart || '').includes('Lagna & D9'));
                            const d9Rules = allRules.filter(r => (r.chart || '').includes('Navamsha (D9)') || (r.chart || '').includes('Lagna & D9'));

                            if (allRules.length === 0) return null;

                            const getRuleEffectExplanation = (r) => {
                                if (r.effect) return r.effect;
                                const id = (r.id || '').toLowerCase();
                                const effectsMap = {
                                    "j1": "Fructification of Union: It brings strong marital harmony, deep emotional fulfillment, emotional richness, and high potential for a happy, fertile, and prosperous family life.",
                                    "j2": "Wealth & Family Blessings: Benefic Jupiter or Venus in 2nd, 7th, or 11th promises post-marital prosperity and strong spousal bonding.",
                                    "j3": "Gaja-Kesari Marital Dignity: Jupiter-Moon alignment in Trikona houses brings a noble, respected, and intellectual life partner.",
                                    "j4": "Passionate Domestic Stability: Strong Venus-Moon conjunction in key Kendra/Kona houses ensures lasting affection and aesthetic comfort.",
                                    "j5": "Lagnadhipati Marriage Alignment: 1st and 7th Lords conjoined in good houses indicates a soulmate connection with mutual life goals.",
                                    "j6": "Triple House Protection: Benefics in 2, 7, 11 from Lagna/Moon insulate the marriage against external conflicts and family friction.",
                                    "j7": "Favorable Financial Growth: Benefic connections to wealth and gain houses ensure marriage expands career and financial standing.",
                                    "j8": "Divinely Blessed Match: Strong 1st and 7th Lords with benefic 7th house placement guarantees a stable, dignified, and happy union.",
                                    "j9": "High Dignity Partner: Exalted/Own sign Venus ensures a refined, charming spouse and high material standard of living.",
                                    "j10": "Witty & Intelligent Union: Mercury in 7th with Venus-7th Lord connection brings deep intellectual companionship and joyful dialogue.",
                                    "j11": "Gain Through Marriage: 7th Lord in 11th with Venus in 2nd indicates sudden financial gains and business success after marriage.",
                                    "j12": "Spousal Devotion: Venus in Lagna with Lagna Lord in 7th creates strong mutual physical and emotional attraction.",
                                    "j13": "Parivartana Royal Bond: Mutual exchange of 1st and 7th Lords signifies an unbreakable bond where partners uplift each other.",
                                    "j14": "Sacred Conjugal Happiness: Exalted Jupiter in 7th with benefics bestows righteous partner, high social honor, and pious family life.",
                                    "j15": "Family Addition & Harmony: 7th Lord or Venus in 2nd house ensures smooth integration with in-laws and early marital stability.",
                                    "j16": "Status Elevation: Lagna Lord in 10th and 2nd Lord in 11th indicates rising career status and social prestige after union.",
                                    "j17": "Auspicious Domestic Environment: Benefics in 1, 2, or 7 create a peaceful household atmosphere free from chronic disputes.",
                                    "j18": "Continuous Financial Inflow: 2nd and 11th Lords exchange ensures steady wealth accumulation through combined matrimonial efforts.",
                                    "j19": "Joint Enterprise Wealth: 2nd and 7th Lords in 11th house signifies profitable joint ventures and prosperity through spouse.",

                                    "h1": "Sublord Protection: Benefic 7th sublord connection brings lifelong emotional satisfaction and effortless compatibility.",
                                    "h2": "Social Success & Popularity: 7th significators aspected by 11th house grant wide social acceptance and happy celebrations.",
                                    "h3": "Luminaries Balance: Mutual aspect between Sun and Moon in 1st/7th balances ego and emotions, fostering deep mutual respect.",
                                    "h4": "Divine Guidance: Sun or Moon in 7th aspected by Jupiter/Venus shields relationship from misunderstandings and ego clashes.",
                                    "h5": "Harmonious Attraction: Well-aspected Venus and Mars inspire passionate yet balanced intimacy and healthy romance.",
                                    "h6": "Emotional Resilience: Moon blessed by Saturn, Venus, and Jupiter grants emotional maturity, patience, and lasting fidelity.",
                                    "h7": "Pure Benefic Influence: 7th house supported by benefic lordships ensures high moral values, kindness, and marital peace.",
                                    "h8": "Unhindered Romance: Unafflicted Venus outside 6/10/12 houses allows love to blossom without career or health interruptions.",

                                    "d1": "Patience Required: Saturn in key houses delays marriage fructification until maturity (often post age 27-30) for stability.",
                                    "d2": "Obstacle Overcoming: Malefics in 7th require conscious patience, tolerance, and careful astrological remedies.",
                                    "d3": "Manglik Energy Alignment: Mars in 8th indicates intense fiery energy needing matched partner or Manglik remedies.",
                                    "d4": "Punarphoo Caution: Moon-Saturn connection requires re-checking match details to avoid last-minute engagement delays.",
                                    "d5": "Tempered Expectations: Mars-Venus afflicted in 5/7/9 requires managing emotional impulsiveness and realistic relationship standards.",
                                    "d6": "Saturnian Discipline: Saturn afflicting 7th Lord/Venus signals gradual trust-building and slow-burning romantic development.",
                                    "d7": "Adjustment Phase: Square aspect between Moon and Venus indicates minor differences in aesthetic tastes needing mutual compromise.",

                                    "u1": "Ego vs Feeling Challenge: Sun-Moon tension requires separating personal pride from emotional relationship needs.",
                                    "u2": "Dusthana Pressure: Malefics connected to 6/10/12 call for clear communication to avoid work stress impacting home life.",
                                    "u3": "Unpredictability Warning: Mars-Uranus tension highlights need for calm anger management and avoiding impulsive arguments.",
                                    "u4": "Aspect Alignment Required: Adverse planetary aspects to 7th significators suggest seeking elders' advice during conflicts.",
                                    "u5": "Serious Temperament: Saturn in 7th brings a serious, dutiful partner; requires adding humor and warmth to daily routine.",
                                    "u6": "Expectation Calibration: Moon-Jupiter disharmony alerts against setting unrealistically high expectations from partner.",
                                    "u7": "Financial & Domestic Balance: Mars-Venus tension reminds to manage household budgets cooperatively without blame.",
                                    "u8": "Water Sign Sensitivity: Mars in Moon sub requires emotional gentleness and avoiding harsh words during disagreements.",
                                    "u9": "Friction Resolution: Affliction to 7th and 11th cusps emphasizes regular spiritual remedies to dissolve stubborn misunderstandings.",

                                    "t1": "Unconventional Attraction: Venus-Uranus aspect indicates attraction to unique, independent, or non-traditional partners.",
                                    "t2": "Sensitive Emotional Style: Moon-Venus aspect reflects a partner with artistic sensitivity needing gentle emotional handling.",
                                    "t3": "Pleasure & Luxury Seeking: Luminaries/Venus in pleasure houses indicates a partner who loves luxury, travel, and fine dining.",
                                    "t4": "Dynamic Romance: Mars-Venus combination indicates a fiery, passionate, hands-on partner who takes bold relationship initiatives.",
                                    "t5": "Intellectual Companion: Venus-Mercury connection in 7/8/10 promises a witty, communicative, business-minded spouse.",
                                    "t6": "High Energy Career Spouse: Mars-Venus in 7/10 brings an ambitious, career-driven partner with strong leadership traits.",
                                    "t7": "Mature & Wise Partner: Saturn in 7th with Venus in 9th from Moon indicates a mature, traditional, and highly responsible spouse.",
                                    "t8": "Independent Career Path: 6th Lord placement indicates a spouse involved in competitive fields, health, or independent service.",
                                    "t9": "Wealthy Business Spouse: 2nd, 7th, 10th Lords in 10th brings a spouse deeply engaged in lucrative commerce or executive leadership.",
                                    "t10": "Tri-Planetary Complexity: Mars-Venus-Saturn connection brings a complex, disciplined partner with deep artistic/craft skills.",
                                    "t11": "Close Family Circle: 2nd Lord in 3rd/4th indicates a partner introduced through siblings, relatives, or close neighbors.",
                                    "t12": "Familiar Social Circle: 7th Lord in 1st/7th indicates spouse comes from known circles or similar social background.",
                                    "t13": "Foreign / Extended Circle: 7th Lord in 8th/12th indicates spouse from a distant location, different culture, or foreign land.",
                                    "t14": "Equal Partner Bond: 1st and 7th Lords Parivartana indicates spouse who acts as an equal partner and true best friend.",
                                    "t15": "Protective & Disciplined Spouse: Saturn-Mars-Moon in 7th brings a strong-willed, protective partner needing emotional warmth.",
                                    "t16": "Authoritative Spouse: Sun in 7th brings a dignified, executive partner with strong self-respect and leadership qualities.",
                                    "t17": "Bold & Courageous Spouse: Mars in 7th brings a courageous, sporty, and energetic partner with high vitality.",
                                    "t18": "Smart & Verbal Spouse: Mercury in 7th brings a youthful, highly intelligent partner who excels in analytical & verbal skills.",
                                    "t19": "Wise & Moral Spouse: Jupiter in 7th brings a spiritual, benevolent, and highly educated partner with noble principles.",
                                    "t20": "Charming & Unique Spouse: Venus/Rahu in 7th brings an extraordinarily attractive, glamorous, or culturally distinct spouse.",
                                    "t21": "Senior & Responsible Spouse: Saturn in 7th brings a mature, grounded partner who prioritizes long-term security.",
                                    "t22": "Nurturing & Sensitive Spouse: Moon in 7th/9th brings a deeply caring, intuitive partner attached to home and spirituality.",

                                    "p1": "Multiple Options Encountered: Weak Lagna/7th Lord alerts to carefully evaluate relationship commitments before finalizing.",
                                    "p2": "Remarriage Signature: 2nd Lord in 8th indicates significant transformation in relationship status or second marriage potential.",
                                    "p3": "Transformational Unions: 8th Lord in 1st/7th suggests deep psychological transformation through marriage or multiple life chapters.",
                                    "p4": "High Activity 7th House: Multiple malefics in 7th require conscious effort, tolerance, and spiritual matching to ensure stability.",
                                    "p5": "Diverse Relationship Connections: Multiple planets in 7th signify diverse social opportunities and high interpersonal interactions.",
                                    "p6": "Strong Individual Identity: Exalted Lagna Lord with 7th house activity suggests balancing individual freedom with partnership.",
                                    "p7": "Complex Tri-House Signature: 1st, 2nd, 6th Lords connected with 7th house calls for clear pre-marital legal & financial clarity.",
                                    "p8": "Dual Sign Sublord Signature: Sublord in dual sign indicates potential for dual relationship chapters or multi-faceted partner connection."
                                };
                                return effectsMap[id] || "Promotes positive planetary blessings, spousal dignity, and relationship harmony.";
                            };

                            const renderRuleCard = (r, idx, color) => (
                                <div key={idx} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid ' + theme.borderColor }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: `${14 * fontScale}px`, fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>Rule {r.id.toUpperCase()}</span>
                                        <span style={{ fontSize: `${11 * fontScale}px`, fontWeight: 900, padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', color: theme.heading, border: `1px solid ${theme.borderColor}`, textTransform: 'uppercase' }}>
                                            {r.chart || 'Lagna (D1) Chart'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, margin: '0 0 10px 0', lineHeight: '1.6', fontStyle: 'italic', fontWeight: 500 }}>"{r.text}"</p>

                                    {/* Astrological Effect Explanation Box */}
                                    <div style={{
                                        background: isLightMode ? 'rgba(244, 63, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        borderLeft: `4px solid ${color}`,
                                        border: `1px solid ${theme.borderColor}`,
                                        marginTop: '10px'
                                    }}>
                                        <span style={{ fontSize: `${10 * fontScale}px`, fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>
                                            💡 Astrological Effect & Interpretation
                                        </span>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.heading, margin: 0, lineHeight: '1.5', fontWeight: 300 }}>
                                            {getRuleEffectExplanation(r)}
                                        </p>
                                    </div>
                                </div>
                            );

                            return (
                                <div style={{
                                    marginTop: '50px',
                                    background: theme.cardBg,
                                    padding: '40px',
                                    borderRadius: '50px',
                                    border: `1px solid ${theme.borderColor}`,
                                    boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <span style={{ fontSize: `${11 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: theme.accentText }}>
                                            📜 Verifiable Chart Combinations (marriage_rules.json)
                                        </span>
                                        <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: theme.heading, marginTop: '8px', fontStyle: 'italic' }}>
                                            ⚡ Active Marriage Combinations (Separated by Chart)
                                        </h3>
                                        <p style={{ fontSize: `${15 * fontScale}px`, color: theme.filterInactiveText, fontStyle: 'italic', marginTop: '6px' }}>
                                            Grouped into Lagna (D1) Primary Birth Chart and Navamsha (D9) Soul / Spousal Chart
                                        </p>
                                    </div>

                                    {/* ── SECTION 1: LAGNA (D1) CHART ACTIVATED RULES ── */}
                                    {d1Rules.length > 0 && (
                                        <div style={{ marginBottom: '50px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                                                <h4 style={{ fontSize: `${20 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    👑 Lagna (D1) Chart Activated Rules ({d1Rules.length})
                                                </h4>
                                                <div style={{ height: '1px', flex: 1, background: `linear-gradient(to right, ${theme.borderColor}, transparent)` }}></div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                                {/* D1 Classical Yogas */}
                                                {d1Rules.filter(r => r.id.startsWith('j')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#10b981', fontSize: `${16 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ✨ Classical Marriage Yogas ({d1Rules.filter(r => r.id.startsWith('j')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('j')).map((r, i) => renderRuleCard(r, i, '#10b981'))}
                                                    </div>
                                                )}

                                                {/* D1 Harmony */}
                                                {d1Rules.filter(r => r.id.startsWith('h')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#fb7185', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            💖 Marital Bliss & Harmony ({d1Rules.filter(r => r.id.startsWith('h')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('h')).map((r, i) => renderRuleCard(r, i, '#fb7185'))}
                                                    </div>
                                                )}

                                                {/* D1 Traits */}
                                                {d1Rules.filter(r => r.id.startsWith('t')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#3b82f6', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            👤 Spouse & Partner Traits ({d1Rules.filter(r => r.id.startsWith('t')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('t')).map((r, i) => renderRuleCard(r, i, '#3b82f6'))}
                                                    </div>
                                                )}

                                                {/* D1 Delays */}
                                                {d1Rules.filter(r => r.id.startsWith('d')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#f59e0b', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ⏳ Timing & Delay Influences ({d1Rules.filter(r => r.id.startsWith('d')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('d')).map((r, i) => renderRuleCard(r, i, '#f59e0b'))}
                                                    </div>
                                                )}

                                                {/* D1 Caution */}
                                                {d1Rules.filter(r => r.id.startsWith('u')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#ef4444', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ⚠️ Friction & Caution Points ({d1Rules.filter(r => r.id.startsWith('u')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('u')).map((r, i) => renderRuleCard(r, i, '#ef4444'))}
                                                    </div>
                                                )}

                                                {/* D1 Plurality */}
                                                {d1Rules.filter(r => r.id.startsWith('p')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#a855f7', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            🔄 Dual Union Signatures ({d1Rules.filter(r => r.id.startsWith('p')).length})
                                                        </h5>
                                                        {d1Rules.filter(r => r.id.startsWith('p')).map((r, i) => renderRuleCard(r, i, '#a855f7'))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── SECTION 2: NAVAMSHA (D9) CHART ACTIVATED RULES ── */}
                                    {d9Rules.length > 0 && (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }}></div>
                                                <h4 style={{ fontSize: `${20 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    🔮 Navamsha (D9) Chart Activated Rules ({d9Rules.length})
                                                </h4>
                                                <div style={{ height: '1px', flex: 1, background: `linear-gradient(to right, ${theme.borderColor}, transparent)` }}></div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                                {/* D9 Classical Yogas */}
                                                {d9Rules.filter(r => r.id.startsWith('j')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#10b981', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ✨ Classical Marriage Yogas ({d9Rules.filter(r => r.id.startsWith('j')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('j')).map((r, i) => renderRuleCard(r, i, '#10b981'))}
                                                    </div>
                                                )}

                                                {/* D9 Harmony */}
                                                {d9Rules.filter(r => r.id.startsWith('h')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#fb7185', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            💖 Marital Bliss & Harmony ({d9Rules.filter(r => r.id.startsWith('h')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('h')).map((r, i) => renderRuleCard(r, i, '#fb7185'))}
                                                    </div>
                                                )}

                                                {/* D9 Traits */}
                                                {d9Rules.filter(r => r.id.startsWith('t')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#3b82f6', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            👤 Spouse & Partner Traits ({d9Rules.filter(r => r.id.startsWith('t')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('t')).map((r, i) => renderRuleCard(r, i, '#3b82f6'))}
                                                    </div>
                                                )}

                                                {/* D9 Delays */}
                                                {d9Rules.filter(r => r.id.startsWith('d')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#f59e0b', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ⏳ Timing & Delay Influences ({d9Rules.filter(r => r.id.startsWith('d')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('d')).map((r, i) => renderRuleCard(r, i, '#f59e0b'))}
                                                    </div>
                                                )}

                                                {/* D9 Caution */}
                                                {d9Rules.filter(r => r.id.startsWith('u')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#ef4444', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            ⚠️ Friction & Caution Points ({d9Rules.filter(r => r.id.startsWith('u')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('u')).map((r, i) => renderRuleCard(r, i, '#ef4444'))}
                                                    </div>
                                                )}

                                                {/* D9 Plurality */}
                                                {d9Rules.filter(r => r.id.startsWith('p')).length > 0 && (
                                                    <div style={{ background: theme.buttonBg, padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                                        <h5 style={{ color: '#a855f7', fontSize: `${14 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
                                                            🔄 Dual Union Signatures ({d9Rules.filter(r => r.id.startsWith('p')).length})
                                                        </h5>
                                                        {d9Rules.filter(r => r.id.startsWith('p')).map((r, i) => renderRuleCard(r, i, '#a855f7'))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* KP Childbirth & Delivery Timing Section */}
                        {personalData.kp_childbirth_timing && (
                            <div style={{
                                marginTop: '50px',
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '50px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: isLightMode ? '0 10px 30px rgba(0,0,0,0.1)' : '0 20px 50px rgba(0,0,0,0.3)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                                    <div>
                                        <p style={{ fontSize: `${10 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: theme.accentText, margin: 0 }}>KP Astrology Diagnostic</p>
                                        <h3 style={{ fontSize: `${28 * fontScale}px`, fontWeight: 900, color: theme.heading, margin: '5px 0 0 0', fontStyle: 'italic' }}>👶 KP Childbirth & Delivery Timing Analysis</h3>
                                    </div>
                                    <span style={{
                                        padding: '8px 20px',
                                        borderRadius: '100px',
                                        background: personalData.kp_childbirth_timing.promise_code === 'PROMISED' ? (isLightMode ? '#dcfce7' : 'rgba(34, 197, 94, 0.2)') : (isLightMode ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)'),
                                        color: personalData.kp_childbirth_timing.promise_code === 'PROMISED' ? (isLightMode ? '#15803d' : '#4ade80') : (isLightMode ? '#b91c1c' : '#f87171'),
                                        border: `1px solid ${personalData.kp_childbirth_timing.promise_code === 'PROMISED' ? '#22c55e' : '#ef4444'}`,
                                        fontSize: `${11 * fontScale}px`,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {personalData.kp_childbirth_timing.promise_status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                    <div style={{ background: theme.buttonBg, padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: theme.accentText, fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Prime Significators (2, 5, 11)</h4>
                                        <p style={{ fontSize: `${18 * fontScale}px`, fontWeight: 300, color: theme.heading, margin: 0 }}>
                                            {personalData.kp_childbirth_timing.prime_significators?.join(', ') || 'None'}
                                        </p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, marginTop: '8px' }}>5th House Lord: <strong>{personalData.kp_childbirth_timing.fifth_house_lord}</strong></p>
                                    </div>

                                    <div style={{ background: theme.buttonBg, padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: isLightMode ? '#4f46e5' : '#818cf8', fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Ruling Planets (RP)</h4>
                                        <p style={{ fontSize: `${18 * fontScale}px`, fontWeight: 300, color: theme.heading, margin: 0 }}>
                                            {personalData.kp_childbirth_timing.ruling_planets?.join(', ') || 'None'}
                                        </p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.filterInactiveText, marginTop: '8px' }}>Chief Karaka for Progeny: <strong>Jupiter</strong></p>
                                    </div>

                                    <div style={{ background: theme.buttonBg, padding: '20px', borderRadius: '25px', border: `1px solid ${theme.borderColor}` }}>
                                        <h4 style={{ color: isLightMode ? '#d97706' : '#fbbf24', fontSize: `${12 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Sign Characteristics</h4>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, margin: '4px 0' }}>• 5th Cusp Barren: <strong>{personalData.kp_childbirth_timing.is_fifth_barren_sign ? 'Yes' : 'No (Fruitful/Mute)'}</strong></p>
                                        <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, margin: '4px 0' }}>• Moon Sign Barren: <strong>{personalData.kp_childbirth_timing.is_moon_barren_sign ? 'Yes' : 'No'}</strong></p>
                                    </div>
                                </div>

                                <div style={{ background: isLightMode ? 'rgba(244, 63, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}`, marginBottom: '30px' }}>
                                    <h4 style={{ color: theme.heading, fontSize: `${18 * fontScale}px`, fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Exact Delivery Timing Transit Rule</h4>
                                    <p style={{ fontSize: `${18 * fontScale}px`, color: theme.text, lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                                        "{personalData.kp_childbirth_timing.predicted_transit_rule}"
                                    </p>
                                </div>

                                {personalData.kp_childbirth_timing.sivapatham_delivery_case_study && personalData.kp_childbirth_timing.sivapatham_delivery_case_study.title && (
                                    <details style={{ background: theme.buttonBg, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.borderColor}` }}>
                                        <summary style={{ cursor: 'pointer', fontWeight: 900, fontSize: `${14 * fontScale}px`, color: theme.accentText }}>
                                            📖 Reference KP Case Study: Exact Delivery Hour Calculation (Sri Sivapathanam)
                                        </summary>
                                        <div style={{ marginTop: '15px', fontSize: `${13 * fontScale}px`, lineHeight: '1.7', color: theme.text }}>
                                            <p style={{ fontWeight: 'bold' }}>{personalData.kp_childbirth_timing.sivapatham_delivery_case_study.title}</p>
                                            <p>{personalData.kp_childbirth_timing.sivapatham_delivery_case_study.astrologer_and_context}</p>
                                            <p><strong>Predicted Transit Pinpoint:</strong> {personalData.kp_childbirth_timing.sivapatham_delivery_case_study.exact_transit_pinpoint?.pinpointed_transit}</p>
                                            <p><strong>Actual Outcome:</strong> {personalData.kp_childbirth_timing.sivapatham_delivery_case_study.exact_transit_pinpoint?.outcome}</p>
                                        </div>
                                    </details>
                                )}
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
