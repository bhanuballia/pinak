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
                <div style={{ padding: '20px', color: 'red', background: 'white', minHeight: '100vh' }}>
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
    const [isLightMode, setIsLightMode] = useState(false);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'mother' | 'father' | 'remedies'
    const [userData, setUserData] = useState(null);
    const [worksheetData, setWorksheetData] = useState(null);

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
            <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'float 3s ease-in-out infinite' }}>👨‍👩‍👧</div>
                <p style={{ color: '#0ea5e9', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Tracing Ancestral Vitality...</p>
                <style>{` @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } } `}</style>
            </div>
        );
    }

    const categories = ['All', ...new Set(insights.map(item => item.category))];
    const filteredInsights = filter === 'All' ? insights : insights.filter(item => item.category === filter);

    const getRiskColor = (level) => {
        if (level === 'High') return '#ef4444';
        if (level === 'Moderate') return '#f59e0b';
        return '#10b981';
    };

    const motherData = personalData?.mother || {};
    const fatherData = personalData?.father || {};

    return (
        <div style={{ minHeight: '100vh', backgroundColor: isLightMode ? '#f8fafc' : '#020617', color: isLightMode ? '#1e293b' : '#cbd5e1', fontFamily: 'serif', paddingBottom: '100px', position: 'relative' }}>

            <button
                onClick={() => setIsLightMode(!isLightMode)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '40px',
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

            {/* Premium Header */}
            <div style={{
                padding: '70px 40px',
                background: isLightMode ? 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #0c4a6e 0%, #020617 100%)',
                borderBottom: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '30px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '56px',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>👨‍👩‍👧</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Parents Health Guide</h1>
                        <p style={{ color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '13px', fontWeight: 900, marginTop: '10px' }}>
                            Lineage Vitality • Parental Well-being & Vedic Remedies
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Overview / Mother / Father / Remedies) */}
            <div style={{
                backgroundColor: isLightMode ? 'rgba(241, 245, 249, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(14, 165, 233, 0.2)',
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
                                    ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                                    : (isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)'),
                                color: activeTab === tab.id ? 'white' : (isLightMode ? '#334155' : 'rgba(228, 241, 170, 1)'),
                                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span style={{ fontSize: '20px', fontWeight: 900 }}>{tab.label}</span>
                            <span style={{ fontSize: '14px', opacity: 0.8, marginTop: '2px' }}>{tab.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 40px' }}>
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '30px', borderRadius: '30px', textAlign: 'center', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ef4444', fontStyle: 'italic', marginBottom: '10px' }}>Connection Notice</h3>
                        <p style={{ color: isLightMode ? '#475569' : 'rgba(248, 235, 49, 1)' }}>{error}</p>
                    </div>
                )}

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                            {/* Mother Card Summary */}
                            <div style={{
                                background: isLightMode ? 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)' : 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
                                padding: '35px',
                                borderRadius: '30px',
                                border: '1px solid rgba(14,165,233,0.3)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#38bdf8' }}>👩 Mother (4th House)</span>
                                    {motherData.risk_level && (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '18px',
                                            fontWeight: 300,
                                            backgroundColor: getRiskColor(motherData.risk_level),
                                            color: 'white',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {motherData.risk_level} Sensitivity
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '42px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>
                                    {motherData.score !== undefined ? `${motherData.score}/100` : 'N/A'}
                                    <span style={{ fontSize: '18px', fontWeight: 400, opacity: 0.7, marginLeft: '10px' }}>Vitality Index</span>
                                </div>

                                <p style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                                    {Array.isArray(motherData.notes) ? motherData.notes.join(' ') : (motherData.notes || 'Analyzed via 4th House & Moon placement.')}
                                </p>

                                <button
                                    onClick={() => setActiveTab('mother')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        background: '#0ea5e9',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '18px',
                                        fontWeight: 300,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Explore Mother's Diagnostics →
                                </button>
                            </div>

                            {/* Father Card Summary */}
                            <div style={{
                                background: isLightMode ? 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)' : 'linear-gradient(135deg, #78350f 0%, #0f172a 100%)',
                                padding: '35px',
                                borderRadius: '30px',
                                border: '1px solid rgba(245,158,11,0.3)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '18px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#fbbf24' }}>👨 Father (9th House)</span>
                                    {fatherData.risk_level && (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '18px',
                                            fontWeight: 300,
                                            backgroundColor: getRiskColor(fatherData.risk_level),
                                            color: 'white',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {fatherData.risk_level} Sensitivity
                                        </span>
                                    )}
                                </div>

                                <div style={{ fontSize: '42px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>
                                    {fatherData.score !== undefined ? `${fatherData.score}/100` : 'N/A'}
                                    <span style={{ fontSize: '18px', fontWeight: 400, opacity: 0.7, marginLeft: '10px' }}>Vitality Index</span>
                                </div>

                                <p style={{ fontSize: '18px', color: isLightMode ? '#334155' : '#cbd5e1', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                                    {Array.isArray(fatherData.notes) ? fatherData.notes.join(' ') : (fatherData.notes || 'Analyzed via 9th House & Sun placement.')}
                                </p>

                                <button
                                    onClick={() => setActiveTab('father')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        background: '#d97706',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '18px',
                                        fontWeight: 300,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Explore Father's Diagnostics →
                                </button>
                            </div>
                        </div>

                        {worksheetData && (
                            <div style={{ marginTop: '40px' }}>
                                <DiagnosticDetails domain="parents_health" worksheetData={worksheetData} />
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: MOTHER'S HEALTH */}
                {activeTab === 'mother' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                            padding: '40px',
                            borderRadius: '30px',
                            border: '1px solid rgba(14, 165, 233, 0.2)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#0ea5e9', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>👩 Mother's Health Diagnostic (4th House & Moon)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0f9ff' : 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 900, margin: '0 0 5px 0' }}>Primary Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>Moon (Matru Karaka)</p>
                                    <p style={{ fontSize: '22px', color: 'hsla(12, 56%, 83%, 1.00)', marginTop: '5px' }}>Governs emotional serenity, mind, and liquid balance.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0f9ff' : 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 900, margin: '0 0 5px 0' }}>Key Anatomical Focus</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{motherData.organs || 'Chest, Lungs, Stomach & Blood'}</p>
                                    <p style={{ fontSize: '22px', color: 'hsla(12, 56%, 83%, 1.00)', marginTop: '5px' }}>Regions governed by 4th house and Cancer zodiac sign.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0f9ff' : 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 900, margin: '0 0 5px 0' }}>4th Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{motherData.lord_4 || '4th Lord'}</p>
                                    <p style={{ fontSize: '22px', color: 'hsla(12, 56%, 83%, 1.00)', marginTop: '5px' }}>Ruler of home peace and physical resilience for mother.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Planetary Influences & Strengths</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(motherData.planets || [
                                    { name: 'Moon', role: 'Matru Karaka', strength: '60/150' },
                                    { name: 'Venus', role: 'Comfort Karaka', strength: '60/150' }
                                ]).map((p, idx) => (
                                    <div key={idx} style={{ padding: '15px 20px', borderRadius: '16px', background: isLightMode ? '#f8fafc' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: '#38bdf8' }}>
                                            <span>{p.name}</span>
                                            <span>{p.strength}</span>
                                        </div>
                                        <div style={{ fontSize: '22px', color: 'hsla(12, 56%, 83%, 1.00)', marginTop: '5px' }}>{p.role}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Astrological Observations</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '18px', lineHeight: '1.8', color: isLightMode ? '#334155' : 'rgba(241, 201, 185, 1)' }}>
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
                            background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
                            padding: '40px',
                            borderRadius: '30px',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#f59e0b', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>👨 Father's Health Diagnostic (9th House & Sun)</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#fffbeb' : 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 900, margin: '0 0 5px 0' }}>Primary Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>Sun (Pitru Karaka)</p>
                                    <p style={{ fontSize: '22px', color: 'rgba(250, 203, 159, 1)', marginTop: '5px' }}>Governs vitality, soul, heart, and bone structure.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#fffbeb' : 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 900, margin: '0 0 5px 0' }}>Key Anatomical Focus</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{fatherData.organs || 'Thighs, Spine, Bones & Heart'}</p>
                                    <p style={{ fontSize: '22px', color: 'rgba(250, 203, 159, 1)', marginTop: '5px' }}>Regions governed by 9th house and Sagittarius zodiac sign.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#fffbeb' : 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 900, margin: '0 0 5px 0' }}>9th Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{fatherData.lord_9 || '9th Lord'}</p>
                                    <p style={{ fontSize: '22px', color: 'rgba(250, 203, 159, 1)', marginTop: '5px' }}>Ruler of fortune, longevity and vitality for father.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Planetary Influences & Strengths</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(fatherData.planets || [
                                    { name: 'Sun', role: 'Pitru Karaka', strength: '60/150' },
                                    { name: 'Jupiter', role: 'Protective Shield', strength: '60/150' }
                                ]).map((p, idx) => (
                                    <div key={idx} style={{ padding: '15px 20px', borderRadius: '16px', background: isLightMode ? '#f8fafc' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: '#fbbf24' }}>
                                            <span>{p.name}</span>
                                            <span>{p.strength}</span>
                                        </div>
                                        <div style={{ fontSize: '18px', color: isLightMode ? '#64748b' : '#94a3b8', marginTop: '4px' }}>{p.role}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Astrological Observations</h3>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '18px', color: isLightMode ? '#334155' : 'rgba(245, 198, 167, 1)' }}>
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
                            <div style={{ background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)', padding: '35px', borderRadius: '30px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#0ea5e9', marginTop: 0 }}>👩 Remedies for Mother</h3>
                                <div style={{ padding: '15px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '15px', marginBottom: '20px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantra</p>
                                    <p style={{ fontSize: '18px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{motherData.mantra || 'Om Som Somaya Namah & Om Namah Shivaya'}</p>
                                </div>
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '22px', color: isLightMode ? '#334155' : 'rgba(245, 198, 167, 1)' }}>
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
                            <div style={{ background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)', padding: '35px', borderRadius: '30px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: 300, color: '#f59e0b', marginTop: 0 }}>👨 Remedies for Father</h3>
                                <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '15px', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantra</p>
                                    <p style={{ fontSize: '18px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{fatherData.mantra || 'Om Suryaya Namah & Gayatri Mantra'}</p>
                                </div>
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '22px', color: isLightMode ? '#334155' : 'rgba(245, 198, 167, 1)' }}>
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
                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '25px' }}>Vedic Guidance & Transits</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {filteredInsights.map((item, idx) => (
                                    <div key={idx} style={{
                                        background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.6)',
                                        padding: '25px',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <span style={{ fontSize: '18px', color: '#0ea5e9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{item.category}</span>
                                            <span style={{ fontSize: '22px' }}>{item.icon || '👨‍👩‍👧'}</span>
                                        </div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '300', color: isLightMode ? '#0f172a' : 'white', margin: '0 0 10px 0' }}>{item.title}</h4>
                                        <p style={{ fontSize: '20px', color: isLightMode ? '#475569' : 'rgba(244, 247, 95, 1)', lineHeight: '1.6', margin: 0 }}>{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <p style={{ color: '#0ea5e9', fontSize: '22px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Matru Devo Bhava • Pitru Devo Bhava</p>
                <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Parents are the living representatives of the Divine. Their health and happiness are the foundation of your own life's stability."</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '16px 50px',
                        borderRadius: '100px',
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: '#0ea5e9',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
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

