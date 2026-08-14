import React, { useState, useEffect } from 'react';
import { fetchParentsHealthInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { this.setState({ error, errorInfo }); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: '#be123c', background: '#fff1f2', minHeight: '100vh' }}>
                    <h2>Something went wrong in Parents Health Viewer.</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
                        <summary>Click for error details</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function ParentsHealthViewerWithErrorBoundary(props) {
    return <ErrorBoundary><ParentsHealthViewer {...props} /></ErrorBoundary>;
}

function ParentsHealthViewer() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'mother' | 'father' | 'remedies'
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
                    fetchParentsHealthInsights().catch(e => {
                        console.error("General parents health insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.parents_health) {
                            setPersonalData(parsed.life_oracle.parents_health);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for parents health", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Parents health insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'float 3s ease-in-out infinite' }}>👨‍👩‍👧</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Tracing Ancestral Vitality...</p>
                <style>{` @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } } `}</style>
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

    const motherData = personalData?.mother || {};
    const fatherData = personalData?.father || {};

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
                    }}>👨‍👩‍👧</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Parents Health Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Lineage Vitality • Parental Well-being & Vedic Remedies
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Overview / Mother / Father / Remedies) */}
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
                        { id: 'overview', label: '📊 Overview', desc: 'Summary & Risk Status' },
                        { id: 'mother', label: "👩 Mother's Health", desc: '4th House & Moon' },
                        { id: 'father', label: "👨 Father's Health", desc: '9th House & Sun' },
                        { id: 'remedies', label: '🌿 Vedic Remedies', desc: 'Mantras & Charity' }
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                            {/* Mother Card Summary */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '35px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#be123c' }}>👩 Mother (4th House)</span>
                                    {motherData.risk_level && (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '16px',
                                            fontWeight: 900,
                                            backgroundColor: '#ffe4e6',
                                            color: getRiskColor(motherData.risk_level),
                                            border: `1px solid ${theme.borderColor}`,
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {motherData.risk_level} Sensitivity
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '42px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>
                                    {motherData.score !== undefined ? `${motherData.score}/100` : 'N/A'}
                                    <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.7, marginLeft: '10px', color: '#be123c' }}>Vitality Index</span>
                                </div>

                                <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                                    {Array.isArray(motherData.notes) ? motherData.notes.join(' ') : (motherData.notes || 'Analyzed via 4th House & Moon placement.')}
                                </p>

                                <button
                                    onClick={() => setActiveTab('mother')}
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
                                    Explore Mother's Diagnostics →
                                </button>
                            </div>

                            {/* Father Card Summary */}
                            <div style={{
                                background: theme.cardBg,
                                padding: '35px',
                                borderRadius: '35px',
                                border: `1px solid ${theme.borderColor}`,
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#be123c' }}>👨 Father (9th House)</span>
                                    {fatherData.risk_level && (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '16px',
                                            fontWeight: 900,
                                            backgroundColor: '#ffe4e6',
                                            color: getRiskColor(fatherData.risk_level),
                                            border: `1px solid ${theme.borderColor}`,
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {fatherData.risk_level} Sensitivity
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '42px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>
                                    {fatherData.score !== undefined ? `${fatherData.score}/100` : 'N/A'}
                                    <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.7, marginLeft: '10px', color: '#be123c' }}>Vitality Index</span>
                                </div>

                                <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                                    {Array.isArray(fatherData.notes) ? fatherData.notes.join(' ') : (fatherData.notes || 'Analyzed via 9th House & Sun placement.')}
                                </p>

                                <button
                                    onClick={() => setActiveTab('father')}
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
                                    Explore Father's Diagnostics →
                                </button>
                            </div>
                        </div>

                        {worksheetData && (
                            <div style={{ marginTop: '40px' }}>
                                <DiagnosticDetails domain="parents_health" worksheetData={worksheetData} isLightMode={isLightMode} />
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: MOTHER'S HEALTH */}
                {activeTab === 'mother' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>👩 Mother's Health Diagnostic (4th House & Moon)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Primary Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Moon (Matru Karaka)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Governs emotional serenity, mind, and liquid balance.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Key Anatomical Focus</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{motherData.organs || 'Chest, Lungs, Stomach & Blood'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Regions governed by 4th house and Cancer zodiac sign.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>4th Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{motherData.lord_4 || '4th Lord'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Ruler of home peace and physical resilience for mother.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Planetary Influences & Strengths</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(motherData.planets || [
                                    { name: 'Moon', role: 'Matru Karaka', strength: '60/150' },
                                    { name: 'Venus', role: 'Comfort Karaka', strength: '60/150' }
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
                                {(motherData.notes || ["4th house receives supportive aspects."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 3: FATHER'S HEALTH */}
                {activeTab === 'father' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>👨 Father's Health Diagnostic (9th House & Sun)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Primary Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Sun (Pitru Karaka)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Governs vitality, soul, heart, and bone structure.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Key Anatomical Focus</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{fatherData.organs || 'Thighs, Spine, Bones & Heart'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Regions governed by 9th house and Sagittarius zodiac sign.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>9th Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{fatherData.lord_9 || '9th Lord'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Ruler of fortune, longevity and vitality for father.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Planetary Influences & Strengths</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(fatherData.planets || [
                                    { name: 'Sun', role: 'Pitru Karaka', strength: '60/150' },
                                    { name: 'Jupiter', role: 'Protective Shield', strength: '60/150' }
                                ]).map((p, idx) => (
                                    <div key={idx} style={{ padding: '15px 20px', borderRadius: '16px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: '#be123c' }}>
                                            <span>{p.name}</span>
                                            <span>{p.strength}</span>
                                        </div>
                                        <div style={{ fontSize: '18px', color: '#1e293b', marginTop: '4px', fontStyle: 'italic' }}>{p.role}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Astrological Observations</h3>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                {(fatherData.notes || ["9th house receives supportive aspects."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 4: VEDIC REMEDIES */}
                {activeTab === 'remedies' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                            {/* Mother Remedies */}
                            <div style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: 0, marginBottom: '20px' }}>👩 Remedies for Mother</h3>
                                <div style={{ padding: '15px', background: '#ffe4e6', borderRadius: '15px', marginBottom: '20px', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '16px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantra</p>
                                    <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#881337' }}>{motherData.mantra || 'Om Som Somaya Namah & Om Namah Shivaya'}</p>
                                </div>
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                    {(motherData.remedies || [
                                        "Respect Mother and seek her daily blessings.",
                                        "Donate Milk, Rice, White clothes on Mondays.",
                                        "Keep silver square piece in pocket or wear silver ring.",
                                        "Chant Om Som Somaya Namah for her well-being."
                                    ]).map((rem, idx) => (
                                        <li key={idx}>{rem}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Father Remedies */}
                            <div style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: 0, marginBottom: '20px' }}>👨 Remedies for Father</h3>
                                <div style={{ padding: '15px', background: '#ffe4e6', borderRadius: '15px', marginBottom: '20px', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '16px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantra</p>
                                    <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#881337' }}>{fatherData.mantra || 'Om Suryaya Namah & Gayatri Mantra'}</p>
                                </div>
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                    {(fatherData.remedies || [
                                        "Respect Father and touch his feet daily.",
                                        "Offer water (Arghya) to Sun in a copper vessel every morning.",
                                        "Donate Wheat, Jaggery & Copper on Sundays.",
                                        "Chant Aditya Hrudaya Stotram for Father's longevity."
                                    ]).map((rem, idx) => (
                                        <li key={idx}>{rem}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* General Educational Insights */}
                        <div style={{ marginTop: '40px' }}>
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
                                            <span style={{ fontSize: '22px' }}>{item.icon || '👨‍👩‍👧'}</span>
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
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Matru Devo Bhava • Pitru Devo Bhava</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '24px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Parents are the living representatives of the Divine. Their health and happiness are the foundation of your own life's stability."</p>
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
