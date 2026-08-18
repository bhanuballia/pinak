import React, { useState, useEffect } from 'react';
import { fetchCareerInsights, fetchPersonalCareerInsights } from '../services/api';
import careerDashaAnalysis from '../data/careerDashaCombinations.json';

export default function CareerViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [jobActivationData, setJobActivationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [timelineFilter, setTimelineFilter] = useState('Present');
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

    const HOUSE_EXPLANATIONS = {
        "1": "1st House (Personal Status & Rank)",
        "2": "2nd House (Income Flow & First Paycheck)",
        "3": "3rd House (Efforts & Exam Execution)",
        "4": "4th House (Workplace Stability)",
        "5": "5th House (Exam Merit & Intelligence)",
        "6": "6th House (Recruitment & Exam Victory)",
        "7": "7th House (Public Status & Posting)",
        "8": "8th House (Research & Hidden Gains)",
        "9": "9th House (Fortune & Higher Rank)",
        "10": "10th House (Career Rank & Power)",
        "11": "11th House (Offer Letter & Salary Start)",
        "12": "12th House (Foreign/Remote Posting)"
    };

    const renderActivatedHouses = (period) => {
        if (period.houses_activated_detailed && period.houses_activated_detailed.length > 0) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {period.houses_activated_detailed.map((hText, hIdx) => (
                        <span key={hIdx} style={{
                            fontSize: '13px',
                            color: '#3730a3',
                            background: '#e0e7ff',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            display: 'inline-block'
                        }}>
                            🎯 {hText}
                        </span>
                    ))}
                </div>
            );
        }

        const rawList = Array.isArray(period.houses_activated)
            ? period.houses_activated
            : (typeof period.houses_activated === 'string' ? period.houses_activated.split(',') : [1, 6, 10, 11]);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {rawList.map((h, hIdx) => {
                    const cleanNum = String(h).replace(/[^0-9]/g, '');
                    const label = HOUSE_EXPLANATIONS[cleanNum] || `${h}th House (Service Activation)`;
                    return (
                        <span key={hIdx} style={{
                            fontSize: '13px',
                            color: '#3730a3',
                            background: '#e0e7ff',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            display: 'inline-block'
                        }}>
                            🎯 {label}
                        </span>
                    );
                })}
            </div>
        );
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
                            name: uData.name,
                            date: uData.date,
                            time: uData.time,
                            lat: uData.lat,
                            lon: uData.lon,
                            tz_offset: uData.tz_offset,
                            jd_ut: parsed.jd_ut || parsed.basic_details?.jd_ut || 2451545.0,
                            moon_lon: moon_lon,
                            ascendant: ascendant,
                            house_lords: parsed.house_lords || null,
                            years: 80.0
                        })
                    })
                        .then(res => res.json())
                        .then(data => setJobActivationData(data))
                        .catch(e => console.error("Job activation timeline fetch error:", e));
                } else if (uData.date && uData.lat && uData.lon) {
                    fetch('/api/dasha/govt-job-activation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: uData.name,
                            date: uData.date,
                            time: uData.time,
                            lat: uData.lat,
                            lon: uData.lon,
                            tz_offset: uData.tz_offset,
                            years: 80.0
                        })
                    })
                        .then(res => res.json())
                        .then(data => setJobActivationData(data))
                        .catch(e => console.error("Job activation timeline fetch error:", e));
                }
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
                padding: '25px 40px',
                background: theme.headerGradient,
                borderBottom: `1px solid ${theme.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
            }}>
                <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'rgba(225, 29, 72, 0.08)', borderRadius: '50%', filter: 'blur(120px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px' }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
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
                        <h1 style={{ fontSize: '35px', fontWeight: 900, color: theme.heading, margin: 0, letterSpacing: '-1px' }}>
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

            {/* Filter Bar (Hidden as requested) 
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
            */}

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
                            {personalInsights.map((item, idx) => {
                                const isSports = item.category === "Sports Career Suitability" || item.category === "खेल करियर उपयुक्तता";
                                const isDomain = item.category === "Specific Career Domain Suitability" || item.category === "विशिष्ट करियर क्षेत्र उपयुक्तता";
                                return (
                                    <div key={idx} style={{
                                        background: isSports ? 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)' : (isDomain ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : theme.cardBg),
                                        padding: '40px',
                                        borderRadius: '35px',
                                        border: isSports ? '2px solid #e11d48' : (isDomain ? '2px solid #16a34a' : '1px solid #fecdd3'),
                                        boxShadow: isSports ? '0 12px 35px rgba(225, 29, 72, 0.15)' : (isDomain ? '0 12px 35px rgba(22, 163, 74, 0.15)' : '0 10px 30px rgba(136, 19, 55, 0.05)'),
                                        position: 'relative'
                                    }}>
                                        {isSports && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '20px',
                                                right: '25px',
                                                padding: '4px 14px',
                                                borderRadius: '100px',
                                                background: '#e11d48',
                                                color: '#ffffff',
                                                fontSize: '13px',
                                                fontWeight: 900,
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase'
                                            }}>
                                                🏆 Athletic Astrological Mapping
                                            </span>
                                        )}
                                        {isDomain && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '20px',
                                                right: '25px',
                                                padding: '4px 14px',
                                                borderRadius: '100px',
                                                background: '#16a34a',
                                                color: '#ffffff',
                                                fontSize: '13px',
                                                fontWeight: 900,
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase'
                                            }}>
                                                🎯 Top Career Path Match
                                            </span>
                                        )}
                                        <div style={{ fontSize: '40px', marginBottom: '20px' }}>{item.icon || '🚀'}</div>
                                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: isSports ? '#be123c' : (isDomain ? '#15803d' : 'rgba(180, 93, 12, 1)'), marginBottom: '15px' }}>{item.title}</h3>
                                        <p style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 1)', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                    </div>
                                );
                            })}
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
                    </section>
                )}

                {/* Active & Peak Job Selection Years (Vimshottari Dasha Timing) Section */}
                {jobActivationData && (
                    <section style={{ marginBottom: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            <h2 style={{ fontSize: '36px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>
                                📅 {isHindi ? "विंशोत्तरी महादशा: सक्रिय एवं शीर्ष नौकरी प्राप्ति वर्ष (कॉर्पोरेट, टेक, बैंकिंग एवं सरकारी)" : "Active & Peak Job Selection Years (Corporate, Tech, Banking & Govt Services)"}
                            </h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 800, padding: '6px 20px', borderRadius: '100px', background: '#e0f2fe', color: '#0369a1', display: 'inline-block' }}>
                                🎯 Filtered: {jobActivationData.age_filter_summary || 'Current Age to Age 55'}
                            </span>
                        </div>

                        {(jobActivationData.timeline && jobActivationData.timeline.length > 0) ? (
                            (() => {
                                const birthDateStr = userData?.date;
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

                                const allTimeline = [...jobActivationData.timeline];

                                const filteredTimeline = allTimeline.filter(p => {
                                    const startAge = calculateAgeAtDate(p.start_date);
                                    const endAge = calculateAgeAtDate(p.end_date);

                                    if (timelineFilter === 'Past') {
                                        return endAge !== null && currentAge !== null && endAge < Math.floor(currentAge);
                                    } else if (timelineFilter === 'Present') {
                                        return currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;
                                    } else if (timelineFilter === 'Future') {
                                        return startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                    }
                                    return true;
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
                                                    📜 Past Dasha ({allTimeline.filter(p => {
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
                                                    🚀 Future Dasha ({allTimeline.filter(p => {
                                                        const startAge = calculateAgeAtDate(p.start_date);
                                                        return startAge !== null && currentAge !== null && startAge > Math.floor(currentAge);
                                                    }).length})
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                                            {filteredTimeline.slice(0, 15).map((period, idx) => {
                                                const startAge = calculateAgeAtDate(period.start_date) || period.age_at_start;
                                                const endAge = calculateAgeAtDate(period.end_date);
                                                const isCurrentPeriod = currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;

                                                return (
                                                    <div key={idx} style={{
                                                        background: isCurrentPeriod ? '#f0fdf4' : theme.cardBg,
                                                        padding: '24px 30px',
                                                        borderRadius: '30px',
                                                        borderLeft: isCurrentPeriod ? '6px solid #16a34a' : `6px solid #e11d48`,
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
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                {period.age_at_start && (
                                                                    <span style={{ fontSize: '13px', color: '#0369a1', fontWeight: 800, padding: '3px 10px', borderRadius: '100px', background: '#e0f2fe' }}>
                                                                        Age ~{period.age_at_start} yrs
                                                                    </span>
                                                                )}
                                                                <span style={{
                                                                    fontSize: '14px',
                                                                    color: period.badge_color || '#be123c',
                                                                    fontWeight: 900,
                                                                    padding: '4px 12px',
                                                                    borderRadius: '100px',
                                                                    background: '#ffe4e6'
                                                                }}>
                                                                    {period.intensity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p style={{ fontSize: '20px', fontWeight: 800, color: 'hsla(96, 48%, 38%, 1.00)', marginBottom: '10px' }}>
                                                            🎯 Recommended Domains: {period.suggested_careers}
                                                        </p>
                                                        <p style={{ fontSize: '18px', color: 'rgba(7, 8, 8, 1)', marginBottom: '15px', lineHeight: '1.6', fontStyle: 'italic' }}>
                                                            {period.description}
                                                        </p>

                                                        {/* Deep Career Dasha Analysis */}
                                                        {careerDashaAnalysis[period.mahadasha]?.[period.antardasha] && (
                                                            <div style={{ marginBottom: '15px' }}>
                                                                {careerDashaAnalysis[period.mahadasha][period.antardasha].map((paragraph, idx) => (
                                                                    <div key={idx} style={{ marginBottom: '12px', background: isLightMode ? '#ffffff' : '#1e293b', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.borderColor}` }}>
                                                                        <strong style={{ color: '#be123c', fontSize: '18px', display: 'block', marginBottom: '4px' }}>{paragraph.title}</strong>
                                                                        <span style={{ color: theme.text, fontSize: '16px', opacity: 1.5 }} dangerouslySetInnerHTML={{ __html: paragraph.content }}></span>
                                                                        {paragraph.links && paragraph.links.length > 0 && (
                                                                            <div style={{ marginTop: '8px' }}>
                                                                                <span style={{ fontSize: '14px', fontStyle: 'italic', color: '#64748b' }}>Sources: </span>
                                                                                {paragraph.links.map((link, lIdx) => (
                                                                                    <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'none', marginLeft: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                                                                                        {link.text}
                                                                                    </a>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${theme.borderColor}` }}>
                                                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'rgba(0, 0, 0, 1)' }}>
                                                                📅 {period.start_date} to {period.end_date}
                                                            </span>
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
                            })()
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.7)', borderRadius: '20px' }}>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#64748b' }}>
                                    ℹ️ Calculating active selection periods... Please refresh or verify birth chart details.
                                </p>
                            </div>
                        )}

                        {/* Age-Wise Vimshottari Job & Career Placement Table */}
                        {jobActivationData.timeline && jobActivationData.timeline.length > 0 && (
                            <div style={{
                                marginTop: '60px',
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: '1px solid #fecdd3',
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                overflowX: 'auto'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#be123c' }}>
                                        📊 Age-Wise Vimshottari Dasha & Lagna Calculation Table
                                    </span>
                                    <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#881337', marginTop: '8px' }}>
                                        🗓️ {isHindi ? "आयु-वार विंशोत्तरी दशा नौकरी एवं करियर प्राप्ति सारणी" : "Age-Wise Job Selection & Career Milestone Timeline Table"}
                                    </h3>
                                    <p style={{ fontSize: '20px', color: '#475569', fontStyle: 'italic', marginTop: '6px' }}>
                                        {isHindi
                                            ? "आपकी आयु के अनुसार प्रतियोगी परीक्षा सफलता, साक्षात्कार चयन, पद, नियुक्ति पत्र एवं प्रथम वेतन प्राप्ति का सटीक कालखंड"
                                            : "Calculated with exact age & dates for exam clearance, recruitment selection, official rank, offer letters, and monthly salary commencement."}
                                    </p>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '20px', overflow: 'hidden', minWidth: '950px' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(233, 210, 216, 1)', color: 'rgba(7, 3, 3, 1)', textAlign: 'left', fontSize: '18px' }}>
                                            <th style={{ padding: '18px 20px', fontWeight: 900 }}>Age & Date Range</th>
                                            <th style={{ padding: '18px 20px', fontWeight: 900 }}>Active Dasha (MD - AD)</th>
                                            <th style={{ padding: '18px 20px', fontWeight: 900 }}>Activated Service Houses</th>
                                            <th style={{ padding: '18px 20px', fontWeight: 900 }}>Calculated Career Milestone</th>
                                            <th style={{ padding: '18px 20px', fontWeight: 900 }}>Selection Intensity</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '17px', color: '#1e293b' }}>
                                        {(() => {
                                            const birthDateStr = userData?.date;
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

                                            // Sort timeline chronologically by start date
                                            const sortedTimeline = [...jobActivationData.timeline].sort((a, b) => {
                                                const dateA = parseDateStr(a.start_date);
                                                const dateB = parseDateStr(b.start_date);
                                                return (dateA && dateB) ? dateA - dateB : 0;
                                            });

                                            return sortedTimeline.slice(0, 15).map((period, pIdx) => {
                                                const startAge = calculateAgeAtDate(period.start_date) || period.age_at_start;
                                                const endAge = calculateAgeAtDate(period.end_date);
                                                const isCurrentPeriod = currentAge !== null && startAge !== null && endAge !== null && Math.floor(currentAge) >= startAge && Math.floor(currentAge) <= endAge;

                                                return (
                                                    <tr key={pIdx} style={{
                                                        background: isCurrentPeriod ? '#f0fdf4' : (pIdx % 2 === 0 ? '#fff1f2' : '#ffffff'),
                                                        borderBottom: '1px solid #fecdd3',
                                                        borderLeft: isCurrentPeriod ? '6px solid #16a34a' : 'none'
                                                    }}>
                                                        <td style={{ padding: '18px 20px', fontWeight: 900, color: '#be123c', position: 'relative' }}>
                                                            {isCurrentPeriod && (
                                                                <div style={{ marginBottom: '8px' }}>
                                                                    <span style={{
                                                                        background: '#16a34a',
                                                                        color: '#ffffff',
                                                                        fontSize: '11px',
                                                                        fontWeight: 900,
                                                                        padding: '4px 10px',
                                                                        borderRadius: '12px',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '1px'
                                                                    }}>
                                                                        🟢 Current Period
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <span style={{ fontSize: '16px', color: '#0369a1', background: '#e0f2fe', padding: '3px 10px', borderRadius: '100px', display: 'inline-block', marginBottom: '4px' }}>
                                                                🎂 Age ~{period.age_at_start} yrs
                                                            </span>
                                                            <br />
                                                            <span style={{ fontSize: '14px', color: '#475569', fontWeight: 700 }}>
                                                                📅 {period.start_date} to {period.end_date}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '18px 20px', fontWeight: 900, color: '#0f172a' }}>
                                                            <b>{period.mahadasha} (MD) - {period.antardasha} (AD)</b>
                                                            <br />
                                                            <span style={{ fontSize: '14px', color: '#64748b' }}>Score: {period.score}</span>
                                                        </td>
                                                        <td style={{ padding: '18px 20px', fontWeight: 800, color: '#4338ca' }}>
                                                            {renderActivatedHouses(period)}
                                                        </td>
                                                        <td style={{ padding: '18px 20px', fontSize: '20px', lineHeight: '1.5' }}>
                                                            <div style={{ color: '#067a29ff', fontStyle: 'italic', fontSize: '22px' }}>
                                                                {period.description}
                                                            </div>
                                                            {/* Deep Career Dasha Analysis (Hidden in table as requested)
                                                            {careerDashaAnalysis[period.mahadasha]?.[period.antardasha] && (
                                                                <div style={{ marginTop: '15px' }}>
                                                                    {careerDashaAnalysis[period.mahadasha][period.antardasha].map((paragraph, idx) => (
                                                                        <div key={idx} style={{ marginBottom: '10px', background: isLightMode ? '#f8fafc' : '#1e293b', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.borderColor}` }}>
                                                                            <strong style={{ color: '#be123c', fontSize: '16px', display: 'block', marginBottom: '4px' }}>{paragraph.title}</strong>
                                                                            <span style={{ color: theme.text, fontSize: '15px', opacity: 1.5 }} dangerouslySetInnerHTML={{ __html: paragraph.content }}></span>
                                                                            {paragraph.links && paragraph.links.length > 0 && (
                                                                                <div style={{ marginTop: '6px' }}>
                                                                                    {paragraph.links.map((link, lIdx) => (
                                                                                        <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'none', marginLeft: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                                                                                            {link.text}
                                                                                        </a>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            */}
                                                        </td>
                                                        <td style={{ padding: '18px 20px', fontWeight: 900 }}>
                                                            <span style={{
                                                                fontSize: '14px',
                                                                color: period.badge_color || '#be123c',
                                                                padding: '6px 14px',
                                                                borderRadius: '100px',
                                                                background: '#ffe4e6',
                                                                display: 'inline-block'
                                                            }}>
                                                                {period.intensity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* Career Insights Section (Hidden as requested)
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
                */}
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
