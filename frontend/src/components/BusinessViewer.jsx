import React, { useState, useEffect } from 'react';
import { fetchBusinessInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

const ASCENDANT_BUSINESS_DATA = {
    "Aries": {
        "ascendant": "Aries",
        "ruler": "Mars",
        "traits": "Confident and Brave",
        "description": "Aries have a reserve source of boundless energy and extreme focus towards life's ambition and goals. Spontaneous and fast decision makers.",
        "fields": ["Real Estate", "Spare Parts", "Hardware", "Hotel or Restaurant"]
    },
    "Taurus": {
        "ascendant": "Taurus",
        "ruler": "Venus",
        "traits": "Reliable and Responsible",
        "description": "Known for a no-nonsense perspective, Taurus natives are cautious, methodical, and solution-oriented under tough situations.",
        "fields": ["Ladies Apparels & Accessories", "Jewelry", "Hotel / Café / Bistro", "Construction & Building Materials", "Women's Clothing", "Cosmetics"]
    },
    "Gemini": {
        "ascendant": "Gemini",
        "ruler": "Mercury",
        "traits": "Tactful and Adaptive",
        "description": "Highly adaptive, smart, and masters of tactful communication. Drawn to intellect, education, and polished presentations.",
        "fields": ["Stationery & School Supplies", "Jewelry", "Commission & Consultancy Business Firm", "Accountancy Firm", "Law Firm"]
    },
    "Cancer": {
        "ascendant": "Cancer",
        "ruler": "Moon",
        "traits": "Empathetic and Intuitive",
        "description": "Extraordinary intuitive skill to provide crucial solutions at right moments, sensitive, caring, and protective nature.",
        "fields": ["Weaponry, Ammunition & Artillery", "Water Plant", "Beverage Manufacturing", "Hotel or Restaurant", "Real Estate"]
    },
    "Leo": {
        "ascendant": "Leo",
        "ruler": "Sun",
        "traits": "Skillful and Leadership",
        "description": "Dynamic, royal, and creative. Exceptionally skilled in managing large social circles and commanding leadership in commercial ventures.",
        "fields": ["Fashion Apparels & Accessories", "Women Apparels", "Cosmetics", "Jewelry", "Photography", "Hotel & Restaurant"]
    },
    "Virgo": {
        "ascendant": "Virgo",
        "ruler": "Mercury",
        "traits": "Perfectionist yet Critical",
        "description": "Level-headed, sensible, blessed with high logical reasoning, and flexible towards strategic business changes.",
        "fields": ["Stationery & School Supplies", "Commission & Consultancy Business Firm", "Accountancy Firm", "Jewelry Business"]
    },
    "Libra": {
        "ascendant": "Libra",
        "ruler": "Venus",
        "traits": "Tactful and Balanced",
        "description": "Natural troubleshooters who excel at finding harmonious middle ground. Multi-angle evaluators ensuring balanced growth.",
        "fields": ["Construction & Building Materials", "Women's Clothing", "Cosmetics", "Ladies Apparels & Accessories", "Jewelry", "Hotel / Café / Bistro"]
    },
    "Scorpio": {
        "ascendant": "Scorpio",
        "ruler": "Mars",
        "traits": "Intuitive and Bold",
        "description": "Excellent decision-making abilities, secretive, risk-taking attitude, brave, and deeply intuitive under market volatility.",
        "fields": ["Spare Parts", "Hotel or Restaurant", "Hardware", "Real Estate"]
    },
    "Sagittarius": {
        "ascendant": "Sagittarius",
        "ruler": "Jupiter",
        "traits": "Free-spirited yet Hard-working",
        "description": "Independent and ambitious. While generally inclined toward service, when Sagittarius enters business, they achieve high integrity and growth.",
        "fields": ["Stationery & School Supply", "Hardware", "Real Estate", "Publication of Religious Books", "Lender's Firm or Agency"]
    },
    "Capricorn": {
        "ascendant": "Capricorn",
        "ruler": "Saturn",
        "traits": "Goal-oriented and Traditional",
        "description": "Workaholics with a practical, cautious, and methodical approach. Conduct thorough background checks before taking final decisions.",
        "fields": ["Share Market Business", "Cosmetics", "Women's Clothing", "Female Accessories", "Jewelry", "Civil Engineering Consultancy"]
    },
    "Aquarius": {
        "ascendant": "Aquarius",
        "ruler": "Saturn",
        "traits": "Optimistic and Intelligent",
        "description": "Independent soul with great wit, wisdom, and level-headedness. Highly innovative in market opportunities.",
        "fields": ["Construction & Building Materials", "Artillery & Ammunition Supply", "Iron-Related Business", "Real Estate", "Hotel", "Wood-Related Business"]
    },
    "Pisces": {
        "ascendant": "Pisces",
        "ruler": "Jupiter",
        "traits": "Creative and Empathetic",
        "description": "Highly intuitive, creative, adaptable, and flexible. Blessed with high emotional intelligence and customer empathy.",
        "fields": ["Publication of Religious Books", "Hardware", "Lender's Firm or Agency", "Real Estate", "Stationery & School Supply"]
    }
};

export default function BusinessViewer() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [isHindi, setIsHindi] = useState(false);
    const [selectedAscendant, setSelectedAscendant] = useState('Aries');

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const uData = {
                    name: params.get('name') || 'Entrepreneur',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general] = await Promise.all([
                    fetchBusinessInsights().catch(e => {
                        console.error("General business insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.business) {
                            setPersonalData(parsed.life_oracle.business);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for business", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Business insights fetch error:", err);
                setError(`Connection Error: ${err.message || "Unknown Error"}`);
            } finally {
                setLoading(false);
            }
        };
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'spin 4s linear infinite' }}>💹</div>
                <p style={{ color: '#fbbf24', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Calculating Market Favor...</p>
                <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: isLightMode ? '#f8fafc' : '#020617', color: isLightMode ? '#a51e0dbd' : '#cbd5e1', fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>

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
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'black',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                A / अ
            </button>
            {/* Premium Header */}
            <div style={{
                padding: '80px 40px',
                background: isLightMode ? 'linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #451a03 0%, #020617 100%)',
                borderBottom: '1px solid rgba(251, 191, 36, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '35px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>💼</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Business & Trade Strategy</h1>
                        <p style={{ color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '14px', fontWeight: 900, marginTop: '10px' }}>
                            Mercury Alignment • Entrepreneurial Blueprint
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(251, 191, 36, 0.1)',
                padding: '20px 0'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '15px', padding: '0 40px', overflowX: 'auto' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setFilter(cat);
                                const section = document.getElementById('vedic-business-wisdom');
                                if (section) {
                                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '100px',
                                background: filter === cat ? '#fbbf24' : 'rgba(255,255,255,0.05)',
                                color: filter === cat ? 'black' : '#94a3b8',
                                border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                fontSize: '12px',
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
                        <p style={{ color: isLightMode ? '#475569' : '#94a3b8' }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {personalData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: '#fbbf24', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Entrepreneurial Blueprint</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.3))' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Business Path Card */}
                            <div style={{
                                background: isLightMode ? 'linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #451a03 0%, #020617 100%)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(251,191,36,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#fbbf24', marginBottom: '15px' }}>Recommended Path</p>
                                <p style={{ fontSize: '42px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '10px 0' }}>{personalData.path_label}</p>
                                <p style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24', fontStyle: 'italic' }}>{personalData.path_note}</p>
                            </div>

                            {/* Acumen Score Card */}
                            <div style={{
                                background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: isLightMode ? '#475569' : '#94a3b8', marginBottom: '15px' }}>Business Acumen</p>
                                <p style={{ fontSize: '64px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '10px 0' }}>{personalData.business_acumen}</p>
                                <p style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#10b981' }}>{personalData.label}</p>
                            </div>

                            {/* Deep Insights */}
                            <div style={{
                                background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                gridColumn: 'span 2'
                            }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: isLightMode ? '#475569' : '#94a3b8', marginBottom: '25px' }}>Planetary Trade Indicators</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <h4 style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Mercury Power</h4>
                                        <p style={{ fontSize: '32px', color: isLightMode ? '#0f172a' : 'white', fontWeight: 900 }}>{personalData.mercury_power}</p>
                                        <p style={{ fontSize: '14px', color: isLightMode ? '#475569' : '#94a3b8', marginTop: '10px' }}>Intelligence & Trading intellect strength.</p>
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#6366f1', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Market Favor</h4>
                                        <p style={{ fontSize: '32px', color: isLightMode ? '#0f172a' : 'white', fontWeight: 900 }}>{personalData.market_favor}</p>
                                        <p style={{ fontSize: '14px', color: isLightMode ? '#475569' : '#94a3b8', marginTop: '10px' }}>Potential for success in the open market.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Classical Jyotish Business Combinations Section */}
                        {personalData.classical_business_combinations && personalData.classical_business_combinations.length > 0 && (
                            <div style={{ marginTop: '50px', marginBottom: '50px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3))' }}></div>
                                    <h3 style={{ fontSize: '28px', color: '#fbbf24', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                        Classical Jyotish Business Combinations
                                    </h3>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.3))' }}></div>
                                </div>
                                <p style={{ textAlign: 'center', color: isLightMode ? '#475569' : 'rgba(235, 157, 215, 1)', fontSize: '22px', marginBottom: '30px', fontStyle: 'italic' }}>
                                    Core Houses: 1, 2, 3, 5, 7, 10, 11 • Core Planets: Saturn, Mercury, Rahu & Lagna Lord • D-10 (Dasamsa) Alignment
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                                    {personalData.classical_business_combinations.map(combo => (
                                        <div
                                            key={combo.id}
                                            style={{
                                                background: combo.satisfied
                                                    ? (isLightMode ? 'rgba(236, 253, 245, 0.9)' : 'rgba(6, 78, 59, 0.3)')
                                                    : (isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.3)'),
                                                border: combo.satisfied
                                                    ? '1px solid rgba(16, 185, 129, 0.4)'
                                                    : '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '24px',
                                                padding: '25px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                    {combo.title}
                                                </h4>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    fontSize: '18px',
                                                    fontWeight: 300,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    background: combo.satisfied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                                                    color: combo.satisfied ? '#10b981' : '#94a3b8',
                                                    border: combo.satisfied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(148, 163, 184, 0.2)'
                                                }}>
                                                    {combo.satisfied ? '✓ Satisfied' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.5', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                {combo.rule}
                                            </p>
                                            <div style={{
                                                fontSize: '18px',
                                                fontFamily: 'monospace',
                                                color: combo.satisfied ? '#10b981' : '#fbbf24',
                                                background: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                <strong>Calculation:</strong> {combo.detail}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Powerful Business Yogas Section */}
                        <div style={{ marginTop: '50px', marginBottom: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3))' }}></div>
                                <h3 style={{ fontSize: '28px', color: '#fbbf24', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                    Powerful Business Yogas in Vedic Astrology
                                </h3>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.3))' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', color: isLightMode ? '#475569' : 'rgba(241, 155, 230, 1)', fontSize: '18px', marginBottom: '30px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 30px' }}>
                                Specific planetary combinations (Yogas) in your birth chart indicate strong business potential, brand goodwill, and financial drive.
                            </p>

                            {(() => {
                                const personalYogas = personalData?.powerful_business_yogas;
                                const activeYogas = personalYogas ? personalYogas.filter(y => y.satisfied) : null;

                                if (personalYogas) {
                                    if (activeYogas && activeYogas.length > 0) {
                                        return (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                                                {activeYogas.map(yoga => (
                                                    <div
                                                        key={yoga.id}
                                                        style={{
                                                            background: isLightMode ? 'rgba(254, 243, 199, 0.9)' : 'rgba(120, 53, 15, 0.35)',
                                                            border: '1px solid rgba(251, 191, 36, 0.5)',
                                                            borderRadius: '24px',
                                                            padding: '25px',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                            <h4 style={{ fontSize: '18px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                                ✨ {yoga.title || yoga.name}
                                                            </h4>
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '100px',
                                                                fontSize: '18px',
                                                                fontWeight: 300,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                background: 'rgba(251, 191, 36, 0.25)',
                                                                color: '#fbbf24',
                                                                border: '1px solid rgba(251, 191, 36, 0.4)'
                                                            }}>
                                                                ★ Active Yoga
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.5', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                                                            <strong>Rule:</strong> {yoga.rule_desc}
                                                        </p>
                                                        <p style={{ fontSize: '18px', color: '#fbbf24', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: 300 }}>
                                                            <strong>Commercial Effect:</strong> {yoga.meaning}
                                                        </p>
                                                        <div style={{
                                                            fontSize: '18px',
                                                            fontFamily: 'monospace',
                                                            color: '#fbbf24',
                                                            background: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            border: '1px solid rgba(255,255,255,0.05)'
                                                        }}>
                                                            <strong>Kundali Diagnostic:</strong> {yoga.detail}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div style={{
                                                background: isLightMode ? 'rgba(241, 245, 249, 0.9)' : 'rgba(30, 41, 59, 0.5)',
                                                border: '1px dashed rgba(251, 191, 36, 0.4)',
                                                borderRadius: '24px',
                                                padding: '40px',
                                                textAlign: 'center',
                                                maxWidth: '700px',
                                                margin: '0 auto'
                                            }}>
                                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏛️</div>
                                                <h4 style={{ fontSize: '20px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '10px' }}>
                                                    No powerful business yogas found in Lagna chart
                                                </h4>
                                                <p style={{ fontSize: '14px', color: isLightMode ? '#64748b' : '#94a3b8', lineHeight: '1.6', margin: 0 }}>
                                                    While none of the 8 major classical business Yogas are currently active in your primary Lagna chart, commercial success can still be achieved through overall house lord strength, Dasha timing, and divisional D-10 Dasamsa chart alignments.
                                                </p>
                                            </div>
                                        );
                                    }
                                } else {
                                    // General Wisdom Reference View
                                    const defaultYogas = [
                                        { id: "y1", title: "Dhana Yoga (Wealth Generation Foundation)", rule_desc: "2nd Lord + 11th Lord conjunction or mutual aspect creates wealth-generating capacity.", meaning: "Foundation of commercial success and high wealth accumulation.", detail: "2nd lord & 11th lord connection." },
                                        { id: "y2", title: "Lakshmi Yoga (Luxurious Prosperity & Brand Wealth)", rule_desc: "Venus in own/exalted sign in a Kendra house (1, 4, 7, 10), with strong 9th Lord.", meaning: "Brings luxurious business success, high brand prestige, and grand prosperity.", detail: "Venus in Kendra + strong 9th lord." },
                                        { id: "y3", title: "Chandra-Mangal Yoga (Commercial Instinct & Financial Drive)", rule_desc: "Moon + Mars conjunction or mutual aspect.", meaning: "Creates sharp commercial instincts, bold risk-taking ability, and high financial drive.", detail: "Moon + Mars connection." },
                                        { id: "y4", title: "Budh-Aditya Yoga (Executive Authority & Business Acumen)", rule_desc: "Mercury + Sun conjunction in the same house.", meaning: "Gives sharp trading intellect combined with executive authority, leadership, and public reputation.", detail: "Mercury + Sun conjunction." },
                                        { id: "y5", title: "7th Lord in 10th House (Trade Career & Partnership Success)", rule_desc: "7th Lord (market & partnerships) placed in the 10th House (career & status).", meaning: "Partnership business succeeds; career is built directly through business dealings.", detail: "7th lord in 10th house." },
                                        { id: "y6", title: "10th Lord in 11th House (Consistent Profits & High ROI)", rule_desc: "10th Lord (profession) placed in the 11th House (gains).", meaning: "Professional efforts consistently convert into massive financial gains and high ROI.", detail: "10th lord in 11th house." },
                                        { id: "y7", title: "Amala Yoga (Ethical Reputation & Brand Goodwill)", rule_desc: "Benefic planet (Jupiter, Venus, Mercury, Moon) in 10th House without malefic affliction.", meaning: "Grants spotless business reputation, strong brand goodwill, and enduring public trust.", detail: "Benefic in 10th house." },
                                        { id: "y8", title: "11th Lord Strong in Kendra (Commercial Scale & Aspirations)", rule_desc: "11th Lord placed in a Kendra house (1, 4, 7, 10) with strong Shadbala.", meaning: "Ensures consistent commercial profit, business scaling capacity, and fulfilled aspirations.", detail: "11th lord in Kendra (1,4,7,10)." }
                                    ];
                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                                            {defaultYogas.map(yoga => (
                                                <div
                                                    key={yoga.id}
                                                    style={{
                                                        background: isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.3)',
                                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                                        borderRadius: '24px',
                                                        padding: '25px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                        <h4 style={{ fontSize: '16px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                            ✨ {yoga.title}
                                                        </h4>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '100px',
                                                            fontSize: '10px',
                                                            fontWeight: 900,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px',
                                                            background: 'rgba(148, 163, 184, 0.1)',
                                                            color: '#94a3b8',
                                                            border: '1px solid rgba(148, 163, 184, 0.2)'
                                                        }}>
                                                            Reference
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '13px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.5', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                                                        <strong>Rule:</strong> {yoga.rule_desc}
                                                    </p>
                                                    <p style={{ fontSize: '13px', color: '#fbbf24', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: 700 }}>
                                                        <strong>Commercial Effect:</strong> {yoga.meaning}
                                                    </p>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        fontFamily: 'monospace',
                                                        color: '#94a3b8',
                                                        background: isLightMode ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.05)'
                                                    }}>
                                                        <strong>Rule Condition:</strong> {yoga.detail}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                            })()}
                        </div>

                        {/* Timing Business Launch via Dasha System Section */}
                        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3))' }}></div>
                                <h3 style={{ fontSize: '28px', color: '#fbbf24', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                    Timing Business Launch via Dasha System
                                </h3>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.3))' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', color: isLightMode ? '#475569' : '#94a3b8', fontSize: '14px', marginBottom: '35px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 35px' }}>
                                The Vimshottari Dasha System identifies the precise planetary operating period (Mahadasha & Antardasha) to transition from employment into commercial enterprise.
                            </p>

                            {/* Personal Dasha Timing Highlight */}
                            {personalData && (personalData.dasha_note || personalData.biz_age) && (
                                <div style={{
                                    background: isLightMode ? 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)' : 'linear-gradient(135deg, #451a03 0%, #0f172a 100%)',
                                    border: '1px solid rgba(251, 191, 36, 0.4)',
                                    borderRadius: '30px',
                                    padding: '35px',
                                    marginBottom: '40px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                                        <div>
                                            <span style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900, color: '#fbbf24' }}>Your Kundali Dasha Timing Diagnostic</span>
                                            <h4 style={{ fontSize: '26px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', margin: '5px 0 0 0' }}>
                                                Commercial Dasha Operating Window
                                            </h4>
                                        </div>
                                        <div style={{ background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '10px 20px', borderRadius: '100px' }}>
                                            <span style={{ fontSize: '18px', color: '#fbbf24', fontWeight: 300 }}>
                                                Optimal Age Window: {personalData.biz_age || "27 - 35 Years"}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                        <div style={{ background: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '18px', color: '#fbbf24', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Dasha Period</span>
                                            <p style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', margin: '8px 0 0 0' }}>
                                                {personalData.dasha_note || "Dasha evaluation completed"}
                                            </p>
                                        </div>

                                        {(personalData.dasha_start_time || personalData.dasha_end_time || personalData.mahadasha_start_time) && (
                                            <div style={{ background: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                                <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Dasha Start & End Window</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: 300, color: isLightMode ? '#0f172a' : '#f1f5f9' }}>
                                                        ⏳ <strong>Start:</strong> {personalData.dasha_start_time || personalData.mahadasha_start_time || "N/A"}
                                                    </span>
                                                    <span style={{ fontSize: '18px', fontWeight: 300, color: isLightMode ? '#0f172a' : '#f1f5f9' }}>
                                                        🏁 <strong>End:</strong> {personalData.dasha_end_time || personalData.mahadasha_end_time || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ background: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '18px', color: '#10b981', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '1px' }}>Transition Recommendation</span>
                                            <p style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#334155' : '#cbd5e1', margin: '8px 0 0 0' }}>
                                                {personalData.transition_note || personalData.path_note || "Watch for 7th / 10th / 11th Lord sub-periods to launch enterprise."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4-Card Dasha Timing Framework */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                {/* Step 1: Mahadasha */}
                                <div style={{
                                    background: isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>🌌</span>
                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0 }}>
                                            Step 1: Mahadasha (Macro Era)
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Sets the 7 to 20-year broad operating theme of life.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>7th Lord Dasha:</strong> Primary window for business & trade partnerships.</li>
                                        <li><strong>10th / 11th Lord Dasha:</strong> Activates career authority & high profits.</li>
                                        <li><strong>Mercury Dasha:</strong> Grants trading intellect & commerce acumen.</li>
                                        <li><strong>Rahu Dasha:</strong> Pushes towards startups & unconventional growth.</li>
                                    </ul>
                                </div>

                                {/* Step 2: Antardasha */}
                                <div style={{
                                    background: isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>🎯</span>
                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0 }}>
                                            Step 2: Antardasha (Strategic Trigger)
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Activates the 1 to 3-year specific launch trigger.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>7th AD during 10th MD:</strong> Ideal combination for opening trade.</li>
                                        <li><strong>11th AD during 7th MD:</strong> Rapid profit realization & expansion.</li>
                                        <li><strong>Mercury / Venus AD:</strong> Drives sales, client acquisition & marketing.</li>
                                        <li><strong>3rd Lord AD:</strong> Gives the initiative & courage to launch.</li>
                                    </ul>
                                </div>

                                {/* Step 3: Transit Trigger */}
                                <div style={{
                                    background: isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>⚡</span>
                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0 }}>
                                            Step 3: Double Transit Trigger
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Pinpoints the exact launch date & month (Gochar).
                                    </p>
                                    <ul style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>Jupiter Transit:</strong> Must aspect 7th, 10th, or 11th House to bless commercial growth.</li>
                                        <li><strong>Saturn Transit:</strong> Must aspect 10th or 7th House to ground legal & physical foundation.</li>
                                        <li><strong>Pratyantardasha:</strong> Benefic sub-sub period for actual registration date.</li>
                                    </ul>
                                </div>

                                {/* Step 4: Job-to-Business Shift */}
                                <div style={{
                                    background: isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>💼</span>
                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0 }}>
                                            Job to Business Shift Rule
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        How the Dasha system governs leaving employment.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>6th Lord Dasha:</strong> Governs salaried employment & job service.</li>
                                        <li><strong>Transition Event:</strong> As 6th Lord AD ends and 7th / 11th Lord AD starts, job is left to launch business.</li>
                                        <li><strong>Caution Window:</strong> Avoid launching during 6th + 8th + 12th Lord heavy periods without 11th Lord support.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        {worksheetData && (
                            <DiagnosticDetails domain="business" worksheetData={worksheetData} />
                        )}
                    </section>
                )}

                {/* Ascendant-Based Profit-Making Business Fields Section */}
                <section style={{ marginBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.3))' }}></div>
                        <h2 style={{ fontSize: '32px', color: '#fbbf24', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                            Profit-Making Business Fields as per Ascendant
                        </h2>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.3))' }}></div>
                    </div>
                    <p style={{ textAlign: 'center', color: isLightMode ? '#475569' : '#94a3b8', fontSize: '14px', marginBottom: '40px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 40px' }}>
                        In Vedic Astrology, your Ascendant (Lagna) reveals your inherent temperament, energy reserves, and the specific trade sectors where your natural strengths yield maximum commercial profit.
                    </p>

                    {/* Personal Chart Highlight */}
                    {personalData && personalData.ascendant_business_recommendations && (
                        <div style={{
                            background: isLightMode ? 'linear-gradient(135deg, #fef3c7 0%, #fff 100%)' : 'linear-gradient(135deg, #451a03 0%, #0f172a 100%)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            borderRadius: '35px',
                            padding: '40px',
                            marginBottom: '40px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900, color: '#fbbf24' }}>Your Chart Ascendant Diagnostic</span>
                                    <h3 style={{ fontSize: '32px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '5px 0 0 0' }}>
                                        {personalData.ascendant_business_recommendations.ascendant} Ascendant
                                    </h3>
                                </div>
                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '10px 20px', borderRadius: '100px' }}>
                                    <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 900 }}>
                                        Ruler: {personalData.ascendant_business_recommendations.ruler} • {personalData.ascendant_business_recommendations.traits}
                                    </span>
                                </div>
                            </div>

                            <p style={{ fontSize: '15px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData.ascendant_business_recommendations.description}
                            </p>

                            <h4 style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                                Top Profit-Making Business Fields for You:
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                                {personalData.ascendant_business_recommendations.recommended_fields.map((field, fIdx) => (
                                    <span key={fIdx} style={{
                                        background: 'rgba(251, 191, 36, 0.15)',
                                        border: '1px solid rgba(251, 191, 36, 0.4)',
                                        color: isLightMode ? '#78350f' : '#fef08a',
                                        padding: '10px 22px',
                                        borderRadius: '100px',
                                        fontSize: '13px',
                                        fontWeight: 800,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}>
                                        💼 {field}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '12px', color: isLightMode ? '#64748b' : '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                                * {personalData.ascendant_business_recommendations.note}
                            </p>
                        </div>
                    )}

                    {/* Interactive 12-Ascendant Selector */}
                    <div style={{ background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.6)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '20px', textAlign: 'center' }}>
                            Explore Profit-Making Fields for All 12 Ascendants
                        </h3>

                        {/* Ascendant Tabs */}
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '30px' }}>
                            {Object.keys(ASCENDANT_BUSINESS_DATA).map(sign => (
                                <button
                                    key={sign}
                                    onClick={() => setSelectedAscendant(sign)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '100px',
                                        background: selectedAscendant === sign ? '#fbbf24' : 'rgba(255,255,255,0.05)',
                                        color: selectedAscendant === sign ? 'black' : (isLightMode ? '#475569' : '#94a3b8'),
                                        border: selectedAscendant === sign ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {sign}
                                </button>
                            ))}
                        </div>

                        {/* Selected Ascendant Card */}
                        {ASCENDANT_BUSINESS_DATA[selectedAscendant] && (
                            <div style={{
                                background: isLightMode ? '#f8fafc' : 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid rgba(251, 191, 36, 0.2)',
                                borderRadius: '30px',
                                padding: '35px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                    <h4 style={{ fontSize: '26px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0 }}>
                                        {ASCENDANT_BUSINESS_DATA[selectedAscendant].ascendant} Ascendant
                                    </h4>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                        Ruling Planet: {ASCENDANT_BUSINESS_DATA[selectedAscendant].ruler} • {ASCENDANT_BUSINESS_DATA[selectedAscendant].traits}
                                    </span>
                                </div>
                                <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '25px' }}>
                                    {ASCENDANT_BUSINESS_DATA[selectedAscendant].description}
                                </p>
                                <h5 style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                                    Most Auspicious & Profit-Making Business Fields:
                                </h5>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {ASCENDANT_BUSINESS_DATA[selectedAscendant].fields.map((f, idx) => (
                                        <span key={idx} style={{
                                            background: isLightMode ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                                            color: isLightMode ? '#0f172a' : '#f1f5f9',
                                            padding: '8px 18px',
                                            borderRadius: '100px',
                                            fontSize: '20px',
                                            fontWeight: 300,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            ✨ {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* General Insights */}
                <section id="vedic-business-wisdom">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                        <h2 style={{ fontSize: '32px', color: isLightMode ? '#0f172a' : 'white', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Business Wisdom</h2>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {filteredInsights.map((item, idx) => (
                            <div key={idx} style={{
                                background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.6)',
                                padding: '40px',
                                borderRadius: '50px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: 'rgba(251, 191, 36, 0.05)', fontSize: '10px', color: '#fbbf24', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(251, 191, 36, 0.1)' }}>{item.category}</span>
                                    <span style={{ fontSize: '24px' }}>{item.icon || '📊'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '24px', color: isLightMode ? '#475569' : 'rgba(185, 228, 184, 1)', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Shubh Labh</p>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Trade is not just exchange of goods, but exchange of energy. May your ventures bring prosperity and purpose to all."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '24px 80px',
                        borderRadius: '100px',
                        background: 'rgba(251, 191, 36, 0.05)',
                        color: '#fbbf24',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
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
