import React, { useState, useEffect } from 'react';
import { fetchFinanceInsights, fetchPersonalFinanceInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';
import FinanceAnalysis from './FinanceAnalysis';
import { getPersonalizedWealthRemedies } from '../data/financeQuestionsData';
import financeDashaAnalysis from '../data/financeDashaCombinations.json';
export default function FinanceViewer() {
    const [insights, setInsights] = useState([]);
    const [personalInsights, setPersonalInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);
    const [wealthActivationData, setWealthActivationData] = useState(null);
    const [timelineFilter, setTimelineFilter] = useState('Present'); // 'Past', 'Present', 'Future'
    const [pastQualityFilter, setPastQualityFilter] = useState('All'); // 'All', 'Good', 'Bad'
    const [futureQualityFilter, setFutureQualityFilter] = useState('All'); // 'All', 'Good', 'Bad'
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
        accentText: '#be123c'
    };

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const uData = {
                    name: params.get('name') || 'Valued Client',
                    date: params.get('date'),
                    time: params.get('time'),
                    lat: params.get('lat'),
                    lon: params.get('lon'),
                    tz_offset: params.get('tz')
                };

                const [general, personalRes] = await Promise.all([
                    fetchFinanceInsights().catch(e => {
                        console.error("General finance insights fetch failed", e);
                        return [];
                    }),
                    uData.date && uData.lat && uData.lon
                        ? fetchPersonalFinanceInsights(uData).catch(e => {
                            console.error("Personal finance analysis failed", e);
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
                    setWorksheetData(parsed);

                    // Fetch Wealth Activation Timeline
                    const pos = parsed.planet_positions || parsed.positions || parsed.planets || [];
                    let moonObj = pos.find(p => p.planet === 'Moon' || p.name === 'Moon');
                    let ascObj = pos.find(p => p.planet === 'Lagna' || p.planet === 'Ascendant' || p.name === 'Lagna' || p.name === 'Ascendant');
                    let moon_lon = moonObj ? (moonObj.sidereal_longitude ?? moonObj.longitude ?? moonObj.degree ?? 0) : 0;
                    let ascendant = ascObj ? (ascObj.sidereal_longitude ?? ascObj.longitude ?? ascObj.degree ?? 0) : (parsed.ascendant || 0);

                    fetch('/api/dasha/wealth-activation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jd_ut: parsed.jd_ut || parsed.basic_details?.jd_ut || 2451545.0,
                            moon_lon: moon_lon,
                            ascendant: ascendant,
                            house_lords: parsed.house_lords || null,
                            years: 80.0
                        })
                    }).then(res => res.json()).then(data => setWealthActivationData(data)).catch(e => console.error("Wealth activation fetch failed", e));
                }
            } catch (err) {
                console.error("Finance insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>💰</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Calculating Prosperity...</p>
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
                    right: '80px',
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
                padding: '15px 40px',
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
                        fontSize: '35px',
                        border: `1px solid ${theme.borderColor}`,
                        boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)'
                    }}>🏦</div>
                    <div>
                        <h1 style={{ fontSize: '35px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Wealth & Finance Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Vedic Economic Insights • Prosperity Diagnostic
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
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '0 40px', alignItems: 'center' }}>
                    {/* Section Direct Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                        <button
                            onClick={() => document.getElementById('wealth-activation-sec')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: '#fff1f2',
                                color: '#881337',
                                border: '1px solid #fecdd3',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            💰 Wealth Activation
                        </button>

                        <button
                            onClick={() => document.getElementById('classical-dhana-sec')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: '#fff1f2',
                                color: '#881337',
                                border: '1px solid #fecdd3',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            📊 Classical Financial & Dhana Analysis
                        </button>

                        <button
                            onClick={() => document.getElementById('special-yogas-sec')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: '#fff1f2',
                                color: '#881337',
                                border: '1px solid #fecdd3',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            ✨ Special Wealth Yogas
                        </button>

                        <button
                            onClick={() => document.getElementById('lagna-diagnostic-sec')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: '#fff1f2',
                                color: '#881337',
                                border: '1px solid #fecdd3',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            📋 Lagna Financial Diagnostic Guide
                        </button>

                        <button
                            onClick={() => document.getElementById('financial-remedies-sec')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '100px',
                                background: '#be123c',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(190, 18, 60, 0.3)'
                            }}
                        >
                            🙏 Financial Remedies
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '25px auto', padding: '0 40px' }}>
                {error && (
                    <div style={{ background: '#ffe4e6', border: '1px solid #fecdd3', padding: '30px', borderRadius: '30px', textAlign: 'center', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#be123c', fontStyle: 'italic', marginBottom: '10px' }}>Connection Error</h3>
                        <p style={{ color: '#475569' }}>{error}</p>
                    </div>
                )}

                {/* Personal Analysis Section */}
                {userData && personalInsights.length > 0 && (
                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                            <h2 style={{ fontSize: '38px', color: '#052285ff', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Personal Wealth Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(190, 18, 60, 0.3))' }}></div>
                        </div>
                        <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '24px', marginBottom: '25px', textAlign: 'center', fontWeight: 600 }}>Based on {userData.name}'s Financial Houses • Verified Calculation</p>

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
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{item.icon || '💰'}</div>
                                    <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(180, 93, 12, 1)', marginBottom: '15px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '22px', color: '#000000ff', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                                </div>
                            ))}
                        </div>

                        {worksheetData && (
                            <DiagnosticDetails domain="finance" worksheetData={worksheetData} isLightMode={isLightMode} />
                        )}
                    </section>
                )}

                {/* Wealth Activation (Vimshottari Dasha Timing) Section */}
                {wealthActivationData && (
                    <section id="wealth-activation-sec" style={{ marginBottom: '40px', scrollMarginTop: '70px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: 'rgba(7, 17, 156, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>💰 Wealth Activation (Vimshottari Dasha Timing)</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                        </div>

                        {/* Wealth Lords Summary */}
                        {wealthActivationData.wealth_lords && (
                            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, marginBottom: '15px' }}>
                                    👑 Identified Wealth Lords & Karaka Scores
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
                                    {wealthActivationData.wealth_lords.map((wl, i) => (
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
                        {wealthActivationData.current_gochar && wealthActivationData.current_gochar.length > 0 && (
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
                                    {wealthActivationData.current_gochar.map((g, gi) => (
                                        <div key={gi} style={{
                                            background: g.is_wealth_house ? '#fff1f2' : '#ffffff',
                                            border: `1.5px solid ${g.is_wealth_house ? '#e11d48' : '#cbd5e1'}`,
                                            borderRadius: '16px',
                                            padding: '12px 18px',
                                            minWidth: '150px',
                                            textAlign: 'center',
                                            boxShadow: g.is_wealth_house ? '0 4px 12px rgba(225, 29, 72, 0.12)' : 'none'
                                        }}>
                                            <div style={{ fontSize: '18px', fontWeight: 900, color: g.is_wealth_house ? '#be123c' : '#1e293b' }}>
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
                                                {g.degree_in_sign}° {g.is_wealth_house ? '• 💰 Wealth House' : ''}
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

                            const allTimeline = wealthActivationData?.timeline || [];
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
                                                                ? `High compatibility between ${period.mahadasha} and ${period.antardasha} activating core wealth houses.`
                                                                : `Operating planets (${period.mahadasha}-${period.antardasha}) do not hold high Dhanakaraka weight in Lagna chart.`
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Deep Financial Dasha Analysis */}
                                                    {financeDashaAnalysis[period.mahadasha]?.[period.antardasha] && (
                                                        <div style={{ marginBottom: '15px' }}>
                                                            {financeDashaAnalysis[period.mahadasha][period.antardasha].map((paragraph, idx) => (
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

                {/* Classical Financial Analysis Section (from FinanceAnalysis.jsx) */}
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

                {/* Financial Remedies Section */}
                {(() => {
                    const ascSign = worksheetData?.charts?.houses?.[1]?.sign_name || userData?.ascendant || "Aries";
                    const remedyData = getPersonalizedWealthRemedies(ascSign);

                    return (
                        <section id="financial-remedies-sec" style={{ marginBottom: '80px', scrollMarginTop: '120px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                                <h2 style={{ fontSize: '32px', color: '#be123c', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>🙏 Lagna Chart Financial & Wealth Remedies</h2>
                                <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(225, 29, 72, 0.3))' }}></div>
                            </div>

                            <div style={{
                                background: theme.cardBg,
                                padding: '40px',
                                borderRadius: '35px',
                                border: '1px solid #fecdd3',
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <span style={{ background: '#ffe4e6', color: '#be123c', padding: '6px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid #fecdd3' }}>
                                        Chart Lagna: {ascSign} Ascendant
                                    </span>
                                    <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#881337', marginTop: '15px', fontStyle: 'italic' }}>
                                        Customized Wealth Preservation & Expansion Practices
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                                    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '20px', borderRadius: '20px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Deities of Wealth</p>
                                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#881337', margin: 0 }}>{remedyData.deity}</p>
                                    </div>
                                    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '20px', borderRadius: '20px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Key Wealth Lords</p>
                                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#881337', margin: 0 }}>{remedyData.wealthLords}</p>
                                    </div>

                                </div>

                                <div style={{ background: '#ffffff', border: '1px solid #fecdd3', padding: '25px', borderRadius: '25px', marginBottom: '30px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 900, color: '#be123c', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>📿 Potent Wealth Mantra Activation</p>
                                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#881337', fontStyle: 'italic', fontFamily: 'serif', margin: 0 }}>"{remedyData.mantra}"</p>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#881337', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px', textAlign: 'center' }}>
                                        🌟 Direct Actionable Remedies & Dharmic Actions
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                        {remedyData.remedies.map((rem, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#fff1f2', padding: '16px 20px', borderRadius: '18px', border: '1px solid #fecdd3' }}>
                                                <span style={{ color: '#e11d48', fontSize: '18px' }}>✦</span>
                                                <p style={{ fontSize: '20px', color: '#000307ff', fontStyle: 'italic', margin: 0, lineHeight: '1.5' }}>{rem}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })()}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: `linear-gradient(to right, transparent, ${theme.borderColor})` }}></div>
                        <h2 style={{ fontSize: '32px', color: 'rgba(8, 29, 100, 1)', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Economic Wisdom</h2>
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
                                    <span style={{ fontSize: '20px' }}>{item.icon || '✨'}</span>
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
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Lakshmi Kripa</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '30px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"May the divine grace of Mahalakshmi bring stability and abundance to your life. Align your efforts with cosmic timing."</p>
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
