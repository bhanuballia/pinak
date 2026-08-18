import React, { useState, useEffect } from 'react';
import { fetchBusinessInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';
import businessDashaAnalysis from '../data/businessDashaCombinations.json';
import FinanceAnalysis from './FinanceAnalysis';

const THEMES = {
    Aries: { bg: '#fff1f2', text: '#000000', headerGradient: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)', cardBg: '#ffffff', borderColor: '#fecdd3' },
    Taurus: { bg: '#f0fdf4', text: '#000000', headerGradient: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', cardBg: '#ffffff', borderColor: '#bbf7d0' },
    Gemini: { bg: '#fdf4ff', text: '#000000', headerGradient: 'linear-gradient(135deg, #a21caf 0%, #d946ef 100%)', cardBg: '#ffffff', borderColor: '#fbcfe8' },
    Cancer: { bg: '#f0f9ff', text: '#000000', headerGradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)', cardBg: '#ffffff', borderColor: '#bae6fd' },
    Leo: { bg: '#fffbeb', text: '#000000', headerGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)', cardBg: '#ffffff', borderColor: '#fde68a' },
    Virgo: { bg: '#f0fdfa', text: '#000000', headerGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', cardBg: '#ffffff', borderColor: '#a7f3d0' },
    Libra: { bg: '#f5f3ff', text: '#000000', headerGradient: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)', cardBg: '#ffffff', borderColor: '#ddd6fe' },
    Scorpio: { bg: '#fef2f2', text: '#000000', headerGradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)', cardBg: '#ffffff', borderColor: '#fca5a5' },
    Sagittarius: { bg: '#fff7ed', text: '#000000', headerGradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 100%)', cardBg: '#ffffff', borderColor: '#fed7aa' },
    Capricorn: { bg: '#f8fafc', text: '#000000', headerGradient: 'linear-gradient(135deg, #334155 0%, #64748b 100%)', cardBg: '#ffffff', borderColor: '#cbd5e1' },
    Aquarius: { bg: '#f0fdf4', text: '#000000', headerGradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)', cardBg: '#ffffff', borderColor: '#a7f3d0' },
    Pisces: { bg: '#eff6ff', text: '#000000', headerGradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', cardBg: '#ffffff', borderColor: '#bfdbfe' },
};

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
    const [isLightMode, setIsLightMode] = useState(true);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [isHindi, setIsHindi] = useState(false);
    const [selectedAscendant, setSelectedAscendant] = useState('Aries');
    const [businessActivationData, setBusinessActivationData] = useState({});
    const [timelineFilter, setTimelineFilter] = useState('Present');
    const [pastQualityFilter, setPastQualityFilter] = useState('All');
    const [futureQualityFilter, setFutureQualityFilter] = useState('Good');

    const theme = THEMES[selectedAscendant] || THEMES['Aries'];

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

                        // Fetch Business Activation Timeline
                        const pos = parsed.planet_positions || parsed.positions || parsed.planets || [];
                        let moonObj = pos.find(p => p.planet === 'Moon' || p.name === 'Moon');
                        let ascObj = pos.find(p => p.planet === 'Lagna' || p.planet === 'Ascendant' || p.name === 'Lagna' || p.name === 'Ascendant');
                        let moon_lon = moonObj ? (moonObj.sidereal_longitude ?? moonObj.longitude ?? moonObj.degree ?? 0) : 0;
                        let ascendant = ascObj ? (ascObj.sidereal_longitude ?? ascObj.longitude ?? ascObj.degree ?? 0) : (parsed.ascendant || 0);

                        fetch('/api/dasha/business-activation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                jd_ut: parsed.jd_ut || parsed.basic_details?.jd_ut || 2451545.0,
                                moon_lon: moon_lon,
                                ascendant: ascendant,
                                house_lords: parsed.house_lords || null,
                                years: 80.0
                            })
                        }).then(res => res.json()).then(data => setBusinessActivationData(data)).catch(e => console.error("Business activation fetch failed", e));
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
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'spin 4s linear infinite' }}>💹</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Calculating Market Favor...</p>
                <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>

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
                padding: '25px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '35px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '60px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>💼</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Business & Trade Strategy</h1>
                        <p style={{ color: 'rgba(235, 171, 187, 1)', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
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
                backgroundColor: theme.filterBg,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${theme.borderColor}`,
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
                                background: filter === cat ? 'rgba(221, 178, 187, 1)' : '#ffffff',
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
                {personalData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: '38px', color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Entrepreneurial Blueprint</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Business Path Card */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#be123c', marginBottom: '15px' }}>Recommended Path</p>
                                <p style={{ fontSize: '42px', fontWeight: 900, color: '#881337', margin: '10px 0' }}>{personalData.path_label}</p>
                                <p style={{ fontSize: '18px', fontWeight: 700, color: '#be123c', fontStyle: 'italic' }}>{personalData.path_note}</p>
                            </div>

                            {/* Acumen Score Card */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#475569', marginBottom: '15px' }}>Business Acumen</p>
                                <p style={{ fontSize: '64px', fontWeight: 900, color: '#881337', margin: '10px 0' }}>{personalData.business_acumen}</p>
                                <p style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#15803d' }}>{personalData.label}</p>
                            </div>

                            {/* Deep Insights */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                gridColumn: 'span 2'
                            }}>
                                <p style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#be123c', marginBottom: '25px' }}>Planetary Trade Indicators</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div>
                                        <h4 style={{ color: '#881337', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Mercury Power</h4>
                                        <p style={{ fontSize: '32px', color: '#881337', fontWeight: 900 }}>{personalData.mercury_power}</p>
                                        <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '10px', fontStyle: 'italic' }}>Intelligence & Trading intellect strength.</p>
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#0369a1', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>Market Favor</h4>
                                        <p style={{ fontSize: '32px', color: '#881337', fontWeight: 900 }}>{personalData.market_favor}</p>
                                        <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '10px', fontStyle: 'italic' }}>Potential for success in the open market.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Classical Jyotish Business Combinations Section */}
                        {personalData.classical_business_combinations && personalData.classical_business_combinations.length > 0 && (
                            <div style={{ marginTop: '50px', marginBottom: '50px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                                    <h3 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                        Classical Jyotish Business Combinations
                                    </h3>
                                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                                </div>
                                <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 1)', fontSize: '22px', marginBottom: '30px', fontStyle: 'italic', fontWeight: 600 }}>
                                    Core Houses: 1, 2, 3, 5, 7, 10, 11 • Core Planets: Saturn, Mercury, Rahu & Lagna Lord • D-10 (Dasamsa) Alignment
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                                    {personalData.classical_business_combinations.map(combo => (
                                        <div
                                            key={combo.id}
                                            style={{
                                                background: theme.cardBg,
                                                border: combo.satisfied
                                                    ? '1px solid #10b981'
                                                    : `1px solid ${theme.borderColor}`,
                                                borderRadius: '24px',
                                                padding: '25px',
                                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                    {combo.title}
                                                </h4>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '100px',
                                                    fontSize: '14px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    background: combo.satisfied ? '#dcfce7' : '#ffe4e6',
                                                    color: combo.satisfied ? '#15803d' : '#be123c',
                                                    border: combo.satisfied ? '1px solid #22c55e' : '1px solid #fecdd3'
                                                }}>
                                                    {combo.satisfied ? '✓ Satisfied' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.5', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                                                {combo.rule}
                                            </p>
                                            <div style={{
                                                fontSize: '16px',
                                                fontFamily: 'monospace',
                                                color: combo.satisfied ? '#15803d' : '#be123c',
                                                background: '#fff1f2',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #fecdd3'
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
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                                <h3 style={{ fontSize: '32px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                    Powerful Business Yogas in Vedic Astrology
                                </h3>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 1)', fontSize: '20px', marginBottom: '30px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 30px', fontWeight: 600 }}>
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
                                                            background: theme.cardBg,
                                                            border: '1px solid #e11d48',
                                                            borderRadius: '24px',
                                                            padding: '25px',
                                                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                            <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                                ✨ {yoga.title || yoga.name}
                                                            </h4>
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '100px',
                                                                fontSize: '14px',
                                                                fontWeight: 900,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                background: '#ffe4e6',
                                                                color: '#be123c',
                                                                border: '1px solid #fecdd3'
                                                            }}>
                                                                ★ Active Yoga
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.5', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                                                            <strong>Rule:</strong> {yoga.rule_desc}
                                                        </p>
                                                        <p style={{ fontSize: '18px', color: '#be123c', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: 700 }}>
                                                            <strong>Commercial Effect:</strong> {yoga.meaning}
                                                        </p>
                                                        <div style={{
                                                            fontSize: '16px',
                                                            fontFamily: 'monospace',
                                                            color: '#881337',
                                                            background: '#fff1f2',
                                                            padding: '8px 12px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #fecdd3'
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
                                                background: theme.cardBg,
                                                border: '1px dashed #fecdd3',
                                                borderRadius: '24px',
                                                padding: '40px',
                                                textAlign: 'center',
                                                maxWidth: '700px',
                                                margin: '0 auto'
                                            }}>
                                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏛️</div>
                                                <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', marginBottom: '10px' }}>
                                                    No powerful business yogas found in Lagna chart
                                                </h4>
                                                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
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
                                                        background: theme.cardBg,
                                                        border: `1px solid ${theme.borderColor}`,
                                                        borderRadius: '24px',
                                                        padding: '25px',
                                                        boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#881337', margin: 0, flex: 1, paddingRight: '10px' }}>
                                                            ✨ {yoga.title}
                                                        </h4>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '100px',
                                                            fontSize: '12px',
                                                            fontWeight: 900,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px',
                                                            background: '#ffe4e6',
                                                            color: '#be123c',
                                                            border: '1px solid #fecdd3'
                                                        }}>
                                                            Reference
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.5', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                                                        <strong>Rule:</strong> {yoga.rule_desc}
                                                    </p>
                                                    <p style={{ fontSize: '16px', color: '#be123c', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: 700 }}>
                                                        <strong>Commercial Effect:</strong> {yoga.meaning}
                                                    </p>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontFamily: 'monospace',
                                                        color: '#475569',
                                                        background: '#fff1f2',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #fecdd3'
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
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                                <h3 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                    Timing Business Launch via Dasha System
                                </h3>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 1)', fontSize: '20px', marginBottom: '35px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 35px', fontWeight: 600 }}>
                                The Vimshottari Dasha System identifies the precise planetary operating period (Mahadasha & Antardasha) to transition from employment into commercial enterprise.
                            </p>

                            {/* Personal Dasha Timing Highlight */}
                            {personalData && (personalData.dasha_note || personalData.biz_age) && (
                                <div style={{
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '30px',
                                    padding: '35px',
                                    marginBottom: '40px',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                                        <div>
                                            <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900, color: '#be123c' }}>Your Kundali Dasha Timing Diagnostic</span>
                                            <h4 style={{ fontSize: '26px', fontWeight: 900, color: '#881337', margin: '5px 0 0 0' }}>
                                                Commercial Dasha Operating Window
                                            </h4>
                                        </div>
                                        <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '10px 20px', borderRadius: '100px' }}>
                                            <span style={{ fontSize: '18px', color: '#be123c', fontWeight: 900 }}>
                                                Optimal Age Window: {personalData.biz_age || "27 - 35 Years"}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                        <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px', border: `1px solid ${theme.borderColor}` }}>
                                            <span style={{ fontSize: '14px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Dasha Period</span>
                                            <p style={{ fontSize: '22px', fontWeight: 900, color: '#881337', margin: '8px 0 0 0' }}>
                                                {personalData.dasha_note || "Dasha evaluation completed"}
                                            </p>
                                        </div>

                                        {(personalData.dasha_start_time || personalData.dasha_end_time || personalData.mahadasha_start_time) && (
                                            <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px', border: `1px solid ${theme.borderColor}` }}>
                                                <span style={{ fontSize: '14px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Dasha Start & End Window</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                                                        ⏳ <strong>Start:</strong> {personalData.dasha_start_time || personalData.mahadasha_start_time || "N/A"}
                                                    </span>
                                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                                                        🏁 <strong>End:</strong> {personalData.dasha_end_time || personalData.mahadasha_end_time || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px', border: `1px solid ${theme.borderColor}` }}>
                                            <span style={{ fontSize: '14px', color: '#15803d', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Transition Recommendation</span>
                                            <p style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '8px 0 0 0' }}>
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
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>🌌</span>
                                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0 }}>
                                            Step 1: Mahadasha (Macro Era)
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Sets the 7 to 20-year broad operating theme of life.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>7th Lord Dasha:</strong> Primary window for business & trade partnerships.</li>
                                        <li><strong>10th / 11th Lord Dasha:</strong> Activates career authority & high profits.</li>
                                        <li><strong>Mercury Dasha:</strong> Grants trading intellect & commerce acumen.</li>
                                        <li><strong>Rahu Dasha:</strong> Pushes towards startups & unconventional growth.</li>
                                    </ul>
                                </div>

                                {/* Step 2: Antardasha */}
                                <div style={{
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>🎯</span>
                                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0 }}>
                                            Step 2: Antardasha (Strategic Trigger)
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Activates the 1 to 3-year specific launch trigger.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>7th AD during 10th MD:</strong> Ideal combination for opening trade.</li>
                                        <li><strong>11th AD during 7th MD:</strong> Rapid profit realization & expansion.</li>
                                        <li><strong>Mercury / Venus AD:</strong> Drives sales, client acquisition & marketing.</li>
                                        <li><strong>3rd Lord AD:</strong> Gives the initiative & courage to launch.</li>
                                    </ul>
                                </div>

                                {/* Step 3: Transit Trigger */}
                                <div style={{
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>⚡</span>
                                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0 }}>
                                            Step 3: Double Transit Trigger
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        Pinpoints the exact launch date & month (Gochar).
                                    </p>
                                    <ul style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>Jupiter Transit:</strong> Must aspect 7th, 10th, or 11th House to bless commercial growth.</li>
                                        <li><strong>Saturn Transit:</strong> Must aspect 10th or 7th House to ground legal & physical foundation.</li>
                                        <li><strong>Pratyantardasha:</strong> Benefic sub-sub period for actual registration date.</li>
                                    </ul>
                                </div>

                                {/* Step 4: Job-to-Business Shift */}
                                <div style={{
                                    background: theme.cardBg,
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '24px',
                                    padding: '30px',
                                    boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>💼</span>
                                        <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#881337', margin: 0 }}>
                                            Job to Business Shift Rule
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                                        How the Dasha system governs leaving employment.
                                    </p>
                                    <ul style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
                                        <li><strong>6th Lord Dasha:</strong> Governs salaried employment & job service.</li>
                                        <li><strong>Transition Event:</strong> As 6th Lord AD ends and 7th / 11th Lord AD starts, job is left to launch business.</li>
                                        <li><strong>Caution Window:</strong> Avoid launching during 6th + 8th + 12th Lord heavy periods without 11th Lord support.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {worksheetData && (
                            <DiagnosticDetails domain="business" worksheetData={worksheetData} isLightMode={isLightMode} />
                        )}
                    </section>
                )}

                {/* Business Activation (Vimshottari Dasha Timing) Section */}
                {businessActivationData && (
                    <section id="business-activation-sec" style={{ marginBottom: '40px', scrollMarginTop: '70px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>💼 Business Activation (Vimshottari Dasha Timing)</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        </div>

                        {/* Business Lords Summary */}
                        {businessActivationData.business_lords && (
                            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '15px' }}>
                                    👑 Identified Business Lords & Karaka Scores
                                </p>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    overflow: 'hidden',
                                    maxWidth: '100%'
                                }}>
                                    {businessActivationData.business_lords.map((wl, i) => (
                                        <div key={i} style={{
                                            background: theme.cardBg,
                                            border: '1px solid #fecdd3',
                                            padding: '6px 12px',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            fontWeight: 800,
                                            color: '#881337',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            👑 {wl.planet}: <span style={{ color: '#15803d' }}>Score {wl.score}</span> {wl.houses.length > 0 && `(Lords ${wl.houses.join(',')})`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Current Gochar Transits relative to Lagna Chart */}
                        {businessActivationData.current_gochar && businessActivationData.current_gochar.length > 0 && (
                            <div style={{
                                marginBottom: '35px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
                                border: '2px solid #fecdd3',
                                borderRadius: '24px',
                                padding: '24px 30px',
                                boxShadow: '0 10px 25px rgba(225, 29, 72, 0.06)'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '22px', color: '#881337', fontWeight: 900, margin: '0 0 6px 0' }}>
                                        🪐 Current Planetary Gochar (Real-Time Transits in Your Lagna Chart)
                                    </h3>
                                    <p style={{ fontSize: '15px', color: '#475569', margin: 0, fontStyle: 'italic' }}>
                                        Shows which house each transiting planet occupies right now from your 1st House (Lagna / Ascendant)
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
                                    {businessActivationData.current_gochar.map((g, gi) => (
                                        <div key={gi} style={{
                                            background: g.is_business_house ? '#fff1f2' : '#ffffff',
                                            border: `1.5px solid ${g.is_business_house ? '#e11d48' : '#cbd5e1'}`,
                                            borderRadius: '16px',
                                            padding: '12px 18px',
                                            minWidth: '150px',
                                            textAlign: 'center',
                                            boxShadow: g.is_business_house ? '0 4px 12px rgba(225, 29, 72, 0.12)' : 'none'
                                        }}>
                                            <div style={{ fontSize: '18px', fontWeight: 900, color: g.is_business_house ? '#be123c' : '#1e293b' }}>
                                                {g.planet} {g.is_retrograde && <span style={{ color: '#d97706', fontSize: '13px' }}>(R)</span>}
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0369a1', margin: '4px 0' }}>
                                                📍 House {g.house_from_lagna} ({g.sign})
                                            </div>
                                            {g.nakshatra && (
                                                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#6d28d9', background: '#f3e8ff', borderRadius: '8px', padding: '2px 8px', margin: '4px 0', display: 'inline-block' }}>
                                                    ✨ {g.nakshatra} {g.pada ? `Pada ${g.pada}` : ''}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                                {g.degree_in_sign}° {g.is_business_house ? '• 💼 Business House' : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Current Age & Activation Filter Note */}
                        {(() => {
                            const birthDateStr = userData?.date || worksheetData?.basic_details?.date || worksheetData?.date;
                            let currentAge = null;
                            if (birthDateStr) {
                                const birthDate = new Date(birthDateStr);
                                const today = new Date();
                                currentAge = (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
                            }

                            const parseDateStr = (str) => {
                                if (!str) return null;
                                if (str.includes('-') && str.split('-')[0].length === 2) {
                                    const [dd, mm, yyyy] = str.split('-');
                                    return new Date(`${yyyy}-${mm}-${dd}`);
                                }
                                return new Date(str);
                            };

                            const calculateAgeAtDate = (dateStr) => {
                                if (!birthDateStr || !dateStr) return null;
                                const bDate = parseDateStr(birthDateStr);
                                const targetDate = parseDateStr(dateStr);
                                if (!bDate || isNaN(bDate.getTime()) || !targetDate || isNaN(targetDate.getTime())) return null;
                                const diffYears = (targetDate - bDate) / (365.25 * 24 * 60 * 60 * 1000);
                                return diffYears >= 0 ? Math.floor(diffYears) : 0;
                            };

                            const allTimeline = businessActivationData?.timeline || [];
                            const filteredTimeline = allTimeline.filter(period => {
                                const startAge = calculateAgeAtDate(period.start_date);
                                const endAge = calculateAgeAtDate(period.end_date);
                                const isPast = endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                const isPresent = currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;
                                const isFuture = startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                const isGoodPeriod = period.status_type === 'Good' || period.score >= 3.0;

                                if (timelineFilter === 'Past') {
                                    if (!isPast) return false;
                                    if (pastQualityFilter === 'Good') return isGoodPeriod;
                                    if (pastQualityFilter === 'Bad') return !isGoodPeriod;
                                    return true;
                                }
                                if (timelineFilter === 'Present') return isPresent;
                                if (timelineFilter === 'Future') {
                                    if (!isFuture) return false;
                                    if (futureQualityFilter === 'Good') return isGoodPeriod;
                                    if (futureQualityFilter === 'Bad') return !isGoodPeriod;
                                    return true;
                                }
                                return isPresent;
                            }).sort((a, b) => {
                                const ageA = calculateAgeAtDate(a.start_date);
                                const ageB = calculateAgeAtDate(b.start_date);
                                const dateA = parseDateStr(a.start_date);
                                const dateB = parseDateStr(b.start_date);

                                if (timelineFilter === 'Past') {
                                    if (ageA !== null && ageB !== null && ageA !== ageB) {
                                        return ageB - ageA;
                                    }
                                    return (dateA && dateB) ? dateB - dateA : 0;
                                }

                                if (ageA !== null && ageB !== null && ageA !== ageB) {
                                    return ageA - ageB;
                                }
                                return (dateA && dateB) ? dateA - dateB : 0;
                            });

                            return (
                                <>
                                    {/* Age & Interactive Timeline Category Buttons */}
                                    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                                        {currentAge !== null && (
                                            <div style={{
                                                margin: '0 auto 20px auto',
                                                maxWidth: '500px',
                                                background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                                                border: '2px solid #fecdd3',
                                                borderRadius: '20px',
                                                padding: '10px 20px',
                                                textAlign: 'center',
                                                boxShadow: '0 4px 15px rgba(225, 29, 72, 0.08)'
                                            }}>
                                                <span style={{ fontSize: '18px', fontWeight: 800, color: '#881337' }}>
                                                    👤 Native's Current Age: <span style={{ color: '#be123c', fontSize: '22px' }}>{Math.floor(currentAge)} yrs</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Exactly 3 Filter Buttons: Past, Present, Future */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                                            <button
                                                onClick={() => setTimelineFilter('Past')}
                                                style={{
                                                    padding: '12px 30px',
                                                    borderRadius: '100px',
                                                    background: timelineFilter === 'Past' ? '#0284c7' : '#ffffff',
                                                    color: timelineFilter === 'Past' ? '#ffffff' : '#0369a1',
                                                    border: timelineFilter === 'Past' ? 'none' : '1.5px solid #bae6fd',
                                                    fontSize: '16px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: timelineFilter === 'Past' ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none'
                                                }}
                                            >
                                                📜 Past Dasha Periods ({allTimeline.filter(p => {
                                                    const endAge = calculateAgeAtDate(p.end_date);
                                                    return endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                                }).length})
                                            </button>

                                            <button
                                                onClick={() => setTimelineFilter('Present')}
                                                style={{
                                                    padding: '12px 30px',
                                                    borderRadius: '100px',
                                                    background: timelineFilter === 'Present' ? '#16a34a' : '#ffffff',
                                                    color: timelineFilter === 'Present' ? '#ffffff' : '#15803d',
                                                    border: timelineFilter === 'Present' ? 'none' : '1.5px solid #bbf7d0',
                                                    fontSize: '16px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: timelineFilter === 'Present' ? '0 4px 14px rgba(22, 163, 74, 0.3)' : 'none'
                                                }}
                                            >
                                                🟢 Present Ongoing Dasha ({allTimeline.filter(p => {
                                                    const startAge = calculateAgeAtDate(p.start_date);
                                                    const endAge = calculateAgeAtDate(p.end_date);
                                                    return currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;
                                                }).length})
                                            </button>

                                            <button
                                                onClick={() => setTimelineFilter('Future')}
                                                style={{
                                                    padding: '12px 30px',
                                                    borderRadius: '100px',
                                                    background: timelineFilter === 'Future' ? '#7c3aed' : '#ffffff',
                                                    color: timelineFilter === 'Future' ? '#ffffff' : '#6d28d9',
                                                    border: timelineFilter === 'Future' ? 'none' : '1.5px solid #ddd6fe',
                                                    fontSize: '16px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: timelineFilter === 'Future' ? '0 4px 14px rgba(124, 58, 237, 0.3)' : 'none'
                                                }}

                                            >
                                                🚀 Future Dasha Periods ({allTimeline.filter(p => {
                                                    const startAge = calculateAgeAtDate(p.start_date);
                                                    return startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                                }).length})
                                            </button>
                                        </div>

                                        {/* Good / Bad Sub-filters when Past Dasha Periods is selected */}
                                        {timelineFilter === 'Past' && (
                                            <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                                                <button
                                                    onClick={() => setPastQualityFilter('All')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: pastQualityFilter === 'All' ? '#0284c7' : '#ffffff',
                                                        color: pastQualityFilter === 'All' ? '#ffffff' : '#0369a1',
                                                        border: '1.5px solid #0284c7',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: pastQualityFilter === 'All' ? '0 4px 10px rgba(2, 132, 199, 0.2)' : 'none'
                                                    }}
                                                >
                                                    📊 All Past Years ({allTimeline.filter(p => {
                                                        const endAge = calculateAgeAtDate(p.end_date);
                                                        return endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                                    }).length})
                                                </button>

                                                <button
                                                    onClick={() => setPastQualityFilter('Good')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: pastQualityFilter === 'Good' ? '#16a34a' : '#ffffff',
                                                        color: pastQualityFilter === 'Good' ? '#ffffff' : '#15803d',
                                                        border: '1.5px solid #16a34a',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: pastQualityFilter === 'Good' ? '0 4px 10px rgba(22, 163, 74, 0.2)' : 'none'
                                                    }}
                                                >
                                                    🟢 Good Financial Years ({allTimeline.filter(p => {
                                                        const endAge = calculateAgeAtDate(p.end_date);
                                                        const isPast = endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                                        const isGood = p.status_type === 'Good' || p.score >= 3.0;
                                                        return isPast && isGood;
                                                    }).length})
                                                </button>

                                                <button
                                                    onClick={() => setPastQualityFilter('Bad')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: pastQualityFilter === 'Bad' ? '#dc2626' : '#ffffff',
                                                        color: pastQualityFilter === 'Bad' ? '#ffffff' : '#b91c1c',
                                                        border: '1.5px solid #dc2626',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: pastQualityFilter === 'Bad' ? '0 4px 10px rgba(220, 38, 38, 0.2)' : 'none'
                                                    }}
                                                >
                                                    🔴 Bad Financial Years ({allTimeline.filter(p => {
                                                        const endAge = calculateAgeAtDate(p.end_date);
                                                        const isPast = endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                                        const isGood = p.status_type === 'Good' || p.score >= 3.0;
                                                        return isPast && !isGood;
                                                    }).length})
                                                </button>
                                            </div>
                                        )}

                                        {/* Good / Bad Sub-filters when Future Dasha Periods is selected */}
                                        {timelineFilter === 'Future' && (
                                            <div style={{ marginTop: '18px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                                                <button
                                                    onClick={() => setFutureQualityFilter('All')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: futureQualityFilter === 'All' ? '#7c3aed' : '#ffffff',
                                                        color: futureQualityFilter === 'All' ? '#ffffff' : '#6d28d9',
                                                        border: '1.5px solid #7c3aed',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: futureQualityFilter === 'All' ? '0 4px 10px rgba(124, 58, 237, 0.2)' : 'none'
                                                    }}
                                                >
                                                    📊 All Future Years ({allTimeline.filter(p => {
                                                        const startAge = calculateAgeAtDate(p.start_date);
                                                        return startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                                    }).length})
                                                </button>

                                                <button
                                                    onClick={() => setFutureQualityFilter('Good')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: futureQualityFilter === 'Good' ? '#16a34a' : '#ffffff',
                                                        color: futureQualityFilter === 'Good' ? '#ffffff' : '#15803d',
                                                        border: '1.5px solid #16a34a',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: futureQualityFilter === 'Good' ? '0 4px 10px rgba(22, 163, 74, 0.2)' : 'none'
                                                    }}
                                                >
                                                    🟢 Good Financial Years ({allTimeline.filter(p => {
                                                        const startAge = calculateAgeAtDate(p.start_date);
                                                        const isFuture = startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                                        const isGood = p.status_type === 'Good' || p.score >= 3.0;
                                                        return isFuture && isGood;
                                                    }).length})
                                                </button>

                                                <button
                                                    onClick={() => setFutureQualityFilter('Bad')}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '50px',
                                                        background: futureQualityFilter === 'Bad' ? '#dc2626' : '#ffffff',
                                                        color: futureQualityFilter === 'Bad' ? '#ffffff' : '#b91c1c',
                                                        border: '1.5px solid #dc2626',
                                                        fontSize: '14px',
                                                        fontWeight: 800,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: futureQualityFilter === 'Bad' ? '0 4px 10px rgba(220, 38, 38, 0.2)' : 'none'
                                                    }}
                                                >
                                                    🔴 Bad Financial Years ({allTimeline.filter(p => {
                                                        const startAge = calculateAgeAtDate(p.start_date);
                                                        const isFuture = startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                                        const isGood = p.status_type === 'Good' || p.score >= 3.0;
                                                        return isFuture && !isGood;
                                                    }).length})
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Activation Timeline */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                                        {filteredTimeline.slice(0, 16).map((period, idx) => {
                                            const startAge = calculateAgeAtDate(period.start_date);
                                            const endAge = calculateAgeAtDate(period.end_date);
                                            const isCurrentPeriod = currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;
                                            const isGoodPeriod = period.status_type === 'Good' || period.score >= 3.0;

                                            return (
                                                <div key={idx} style={{
                                                    background: theme.cardBg,
                                                    padding: '24px 30px',
                                                    borderRadius: '30px',
                                                    borderLeft: `6px solid ${isCurrentPeriod ? '#16a34a' : isGoodPeriod ? '#10b981' : '#ef4444'}`,
                                                    borderTop: `1px solid ${theme.borderColor}`,
                                                    borderRight: `1px solid ${theme.borderColor}`,
                                                    borderBottom: `1px solid ${theme.borderColor}`,
                                                    boxShadow: isCurrentPeriod ? '0 10px 25px rgba(22, 163, 74, 0.15)' : '0 10px 25px rgba(136, 19, 55, 0.05)',
                                                    position: 'relative'
                                                }}>
                                                    {isCurrentPeriod && (
                                                        <span style={{
                                                            position: 'absolute',
                                                            top: '-12px',
                                                            right: '20px',
                                                            background: '#16a34a',
                                                            color: '#ffffff',
                                                            fontSize: '12px',
                                                            fontWeight: 900,
                                                            padding: '2px 10px',
                                                            borderRadius: '12px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            CURRENT OPERATING PERIOD
                                                        </span>
                                                    )}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#000000' }}>
                                                            {period.mahadasha} (MD) - {period.antardasha} (AD)
                                                        </span>
                                                        <span style={{
                                                            fontSize: '14px',
                                                            color: isGoodPeriod ? '#15803d' : '#b91c1c',
                                                            fontWeight: 900,
                                                            padding: '4px 12px',
                                                            borderRadius: '100px',
                                                            background: isGoodPeriod ? '#dcfce7' : '#fee2e2'
                                                        }}>
                                                            {period.intensity}
                                                        </span>
                                                    </div>

                                                    <p style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px', lineHeight: '1.5', fontStyle: 'italic' }}>
                                                        {period.description}
                                                    </p>

                                                    {/* Astrological Explanation WHY */}
                                                    <div style={{
                                                        background: isGoodPeriod ? '#f0fdf4' : '#fff5f5',
                                                        border: `1px solid ${isGoodPeriod ? '#bbf7d0' : '#fed7d7'}`,
                                                        padding: '12px 16px',
                                                        borderRadius: '16px',
                                                        marginBottom: '15px'
                                                    }}>
                                                        <p style={{ fontSize: '12px', fontWeight: 900, color: isGoodPeriod ? '#166534' : '#991b1b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                                            {isGoodPeriod ? '💡 Why Good Financial Condition:' : '⚠️ Why Caution Required:'}
                                                        </p>
                                                        <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: '1.4' }}>
                                                            {period.reason || (isGoodPeriod
                                                                ? `High compatibility between ${period.mahadasha} and ${period.antardasha} activating core business houses.`
                                                                : `Operating planets (${period.mahadasha}-${period.antardasha}) do not hold high Dhanakaraka weight in Lagna chart.`
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Deep Financial Dasha Analysis */}
                                                    {businessDashaAnalysis[period.mahadasha]?.[period.antardasha] && (
                                                        <div style={{ marginBottom: '15px' }}>
                                                            {businessDashaAnalysis[period.mahadasha][period.antardasha].map((paragraph, idx) => (
                                                                <div key={idx} style={{ marginBottom: '12px', background: isLightMode ? '#ffffff' : '#1e293b', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.borderColor}` }}>
                                                                    <strong style={{ color: theme.accent1, fontSize: '18px', display: 'block', marginBottom: '4px' }}>{paragraph.title}</strong>
                                                                    <span style={{ color: theme.text, fontSize: '16px', opacity: 1.5 }}>{paragraph.content} </span>
                                                                    {paragraph.links && paragraph.links.map((link, lIdx) => (
                                                                        <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" style={{ color: theme.accent2, textDecoration: 'none', marginLeft: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                                                                            {link.text}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${theme.borderColor}` }}>
                                                        <div>
                                                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#000000' }}>
                                                                📅 {period.start_date} to {period.end_date}
                                                            </div>
                                                            {startAge !== null && endAge !== null && (
                                                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#be123c', marginTop: '3px' }}>
                                                                    ⌛ Age {startAge} to {endAge} yrs {endAge < Math.floor(currentAge) ? '(Past)' : startAge > Math.floor(currentAge) ? '(Future)' : '(Active)'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: '18px', color: '#000000', fontWeight: 900 }}>
                                                            Score: {period.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </section>
                )}

                {/* Classical Financial Analysis Section (from BusinessAnalysis.jsx) */}
                <section id="classical-dhana-sec" style={{ marginBottom: '80px', scrollMarginTop: '120px' }}>
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

                {/* Ascendant-Based Profit-Making Business Fields Section */}
                <section style={{ marginBottom: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                            Profit-Making Business Fields as per Ascendant
                        </h2>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                    </div>
                    <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 1)', fontSize: '20px', marginBottom: '40px', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 40px', fontWeight: 600 }}>
                        In Vedic Astrology, your Ascendant (Lagna) reveals your inherent temperament, energy reserves, and the specific trade sectors where your natural strengths yield maximum commercial profit.
                    </p>

                    {/* Personal Chart Highlight */}
                    {personalData && personalData.ascendant_business_recommendations && (
                        <div style={{
                            background: theme.cardBg,
                            border: `1px solid ${theme.borderColor}`,
                            borderRadius: '35px',
                            padding: '40px',
                            marginBottom: '40px',
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900, color: '#be123c' }}>Your Chart Ascendant Diagnostic</span>
                                    <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#881337', margin: '5px 0 0 0' }}>
                                        {personalData.ascendant_business_recommendations.ascendant} Ascendant
                                    </h3>
                                </div>
                                <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '10px 20px', borderRadius: '100px' }}>
                                    <span style={{ fontSize: '16px', color: '#be123c', fontWeight: 900 }}>
                                        Ruler: {personalData.ascendant_business_recommendations.ruler} • {personalData.ascendant_business_recommendations.traits}
                                    </span>
                                </div>
                            </div>

                            <p style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData.ascendant_business_recommendations.description}
                            </p>

                            <h4 style={{ color: '#be123c', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                                Top Profit-Making Business Fields for You:
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                                {personalData.ascendant_business_recommendations.recommended_fields.map((field, fIdx) => (
                                    <span key={fIdx} style={{
                                        background: '#ffe4e6',
                                        border: '1px solid #fecdd3',
                                        color: '#881337',
                                        padding: '10px 22px',
                                        borderRadius: '100px',
                                        fontSize: '18px',
                                        fontWeight: 800,
                                        boxShadow: '0 4px 12px rgba(136, 19, 55, 0.05)'
                                    }}>
                                        💼 {field}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                                * {personalData.ascendant_business_recommendations.note}
                            </p>
                        </div>
                    )}

                    {/* Interactive 12-Ascendant Selector */}
                    <div style={{ background: theme.cardBg, padding: '40px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                        <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#881337', marginBottom: '20px', textAlign: 'center' }}>
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
                                        background: selectedAscendant === sign ? '#e11d48' : '#ffffff',
                                        color: selectedAscendant === sign ? '#ffffff' : '#881337',
                                        border: selectedAscendant === sign ? 'none' : `1px solid ${theme.borderColor}`,
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s ease',
                                        boxShadow: selectedAscendant === sign ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none'
                                    }}
                                >
                                    {sign}
                                </button>
                            ))}
                        </div>

                        {/* Selected Ascendant Card */}
                        {ASCENDANT_BUSINESS_DATA[selectedAscendant] && (
                            <div style={{
                                background: '#fff1f2',
                                border: `1px solid ${theme.borderColor}`,
                                borderRadius: '30px',
                                padding: '35px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                    <h4 style={{ fontSize: '26px', fontWeight: 900, color: '#881337', margin: 0 }}>
                                        {ASCENDANT_BUSINESS_DATA[selectedAscendant].ascendant} Ascendant
                                    </h4>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#be123c', background: '#ffe4e6', padding: '6px 16px', borderRadius: '100px', border: '1px solid #fecdd3' }}>
                                        Ruling Planet: {ASCENDANT_BUSINESS_DATA[selectedAscendant].ruler} • {ASCENDANT_BUSINESS_DATA[selectedAscendant].traits}
                                    </span>
                                </div>
                                <p style={{ fontSize: '18px', color: '#1e293b', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '25px' }}>
                                    {ASCENDANT_BUSINESS_DATA[selectedAscendant].description}
                                </p>
                                <h5 style={{ color: '#be123c', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                                    Most Auspicious & Profit-Making Business Fields:
                                </h5>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {ASCENDANT_BUSINESS_DATA[selectedAscendant].fields.map((f, idx) => (
                                        <span key={idx} style={{
                                            background: '#ffffff',
                                            color: '#881337',
                                            padding: '8px 18px',
                                            borderRadius: '100px',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            border: '1px solid #fecdd3'
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
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Vedic Business Wisdom</h2>
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
                                    <span style={{ fontSize: '24px' }}>{item.icon || '📊'}</span>
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
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Shubh Labh</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '30px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Trade is not just exchange of goods, but exchange of energy. May your ventures bring prosperity and purpose to all."</p>
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
