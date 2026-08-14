import React, { useState, useEffect } from 'react';
import { fetchHomePeaceInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function HomePeaceViewer() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'kalesh' | 'vastu' | 'remedies'
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
                    fetchHomePeaceInsights().catch(e => {
                        console.error("General home peace insights fetch failed", e);
                        return [];
                    })
                ]);

                // Pull deep analysis from localStorage (worksheetData)
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.home_peace) {
                            setPersonalData(parsed.life_oracle.home_peace);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for home peace", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Home peace insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>🏡</div>
                <p style={{ color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Harmonizing Domestic Energies...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
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

    const hScore = personalData?.score !== undefined ? personalData.score : 'N/A';
    const hRisk = personalData?.risk_level || (hScore !== 'N/A' ? (hScore >= 70 ? 'Low' : hScore >= 50 ? 'Moderate' : 'High') : null);

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
                    }}>🏡</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: theme.heading, margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Ghar Me Sukh Shanti Guide</h1>
                        <p style={{ color: '#be123c', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: 900, marginTop: '10px' }}>
                            Domestic Peace • Griha Sukha Diagnostic • Vastu Alignment
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Header */}
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
                        { id: 'overview', label: '📊 Overview', desc: 'Summary & Harmony Index' },
                        { id: 'kalesh', label: '🏡 4th H & Kalesh', desc: '4th Lord, Mars & Saturn' },
                        { id: 'vastu', label: '☸️ Vastu & Energy', desc: 'Ishaan Kon & Brahmasthan' },
                        { id: 'remedies', label: '🌿 Vedic Remedies', desc: 'Ghee Lamp & Cleansing' }
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
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#be123c' }}>🏡 Domestic Harmony Index (4th House)</span>
                                {hRisk && (
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                        fontWeight: 900,
                                        backgroundColor: '#ffe4e6',
                                        color: getRiskColor(hRisk),
                                        border: `1px solid ${theme.borderColor}`,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {hRisk} Domestic Friction
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '48px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>
                                {hScore !== 'N/A' ? `${hScore}/100` : 'N/A'}
                                <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.7, marginLeft: '10px', color: '#be123c' }}>Harmony Rating ({personalData?.label || 'Peaceful'})</span>
                            </div>

                            <p style={{ fontSize: '20px', color: '#1e293b', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData ? (Array.isArray(personalData.notes) ? personalData.notes.join(' ') : (personalData.notes || 'Analyzed via 4th House, 4th Lord, Moon, Venus & Jupiter.')) : 'Ghar Me Sukh Shanti diagnostic analyzes 4th house (Griha Bhava), Moon (Emotional environment), Venus (Comforts), and Vastu energy alignment.'}
                            </p>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button
                                    onClick={() => setActiveTab('kalesh')}
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
                                    Explore Domestic Diagnostics →
                                </button>
                                <button
                                    onClick={() => setActiveTab('remedies')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '100px',
                                        background: '#ffe4e6',
                                        color: '#881337',
                                        border: `1px solid ${theme.borderColor}`,
                                        fontSize: '18px',
                                        fontWeight: 900,
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Vedic & Vastu Remedies 🌿
                                </button>
                            </div>
                        </div>

                        {worksheetData && (
                            <div style={{ marginTop: '40px' }}>
                                <DiagnosticDetails domain="home_peace" worksheetData={worksheetData} isLightMode={isLightMode} />
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: 4TH HOUSE & GRAH KALESH */}
                {activeTab === 'kalesh' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🏡 4th House & Grah Kalesh Diagnostics</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Griha Sukha Karaka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Venus (Shukra)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Rules domestic luxury, aesthetic harmony, and residential comfort.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Elder Blessings & Wisdom</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>Jupiter (Guru)</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Brings divine grace, wisdom of elders, and conflict resolution.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>4th House Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#881337' }}>{personalData?.lord_4 || '4th Lord'}</p>
                                    <p style={{ fontSize: '18px', color: '#1e293b', marginTop: '5px', fontStyle: 'italic' }}>Governs overall domestic stability and property matters.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Planetary Strengths & Roles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(personalData?.planets || [
                                    { name: 'Venus', role: 'Griha Sukha & Comfort', strength: '60/150' },
                                    { name: 'Jupiter', role: 'Elder Blessings & Harmony', strength: '60/150' },
                                    { name: 'Moon', role: 'Emotional Atmosphere', strength: '60/150' }
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

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Domestic Observations</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '20px', lineHeight: '1.8', color: '#1e293b' }}>
                                {(personalData?.notes || ["4th house receives supportive aspects."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 3: VASTU & HOUSE ENERGY */}
                {activeTab === 'vastu' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{
                            background: theme.cardBg,
                            padding: '40px',
                            borderRadius: '35px',
                            border: `1px solid ${theme.borderColor}`,
                            boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>☸️ Vastu Shastra & Directional Energies</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🌊 North-East (Ishaan Kon)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        Sacred zone governed by Jupiter & Water element. Keep clean, light, and place a pure Ghee lamp or altar here to preserve peaceful vibrations.
                                    </p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🔥 South-East (Agneya Kon)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        Fire element zone (Kitchen). Ensure no water leakage or blue colors here to prevent friction between household members.
                                    </p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: '#fff1f2', border: `1px solid ${theme.borderColor}` }}>
                                    <h4 style={{ fontSize: '20px', color: '#be123c', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🌌 Brahmasthan (Center)</h4>
                                    <p style={{ fontSize: '18px', color: '#1e293b', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                                        Central space of the home. Must remain unburdened by heavy furniture to allow cosmic prana energy to circulate seamlessly.
                                    </p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginBottom: '15px' }}>Vastu Guidelines for Domestic Peace</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '20px', lineHeight: '1.8', color: '#1e293b' }}>
                                {(personalData?.vastu_tips || [
                                    "North-East (Ishaan Kon): Keep light, clean & dedicated for water fountain or altar.",
                                    "South-East (Agneya Kon): Maintain kitchen fire element balance; avoid water leakage here.",
                                    "Brahmasthan (Center): Keep central room space completely clutter-free and open."
                                ]).map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* TAB 4: VEDIC REMEDIES */}
                {activeTab === 'remedies' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#881337', marginTop: 0, marginBottom: '20px' }}>🌿 Vedic & Vastu Remedies for Home Peace</h3>

                            <div style={{ padding: '20px', background: '#ffe4e6', borderRadius: '20px', marginBottom: '25px', border: `1px solid ${theme.borderColor}` }}>
                                <p style={{ fontSize: '16px', textTransform: 'uppercase', color: '#be123c', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantras</p>
                                <p style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#881337' }}>
                                    {personalData?.mantra || 'Om Namo Bhagavate Vasudevaya & Shri Suktam'}
                                </p>
                            </div>

                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '20px', color: '#1e293b' }}>
                                {(personalData?.remedies || [
                                    "Light a pure Cow Ghee lamp in North-East (Ishaan Kon) every evening during dusk.",
                                    "Sprinkle Ganga-jal with Camphor (Kapoor) water in all rooms to remove domestic tension.",
                                    "Recite Satyanarayan Katha or Vishnu Sahasranama on Purnima (Full Moon) days.",
                                    "Touch the feet of parents & household elders daily to seek divine domestic blessings.",
                                    "Avoid intense arguments or loud shouting in the dining space & central hall."
                                ]).map((rem, idx) => (
                                    <li key={idx}>{rem}</li>
                                ))}
                            </ul>
                        </div>

                        {/* General Educational Insights */}
                        <div>
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
                                            <span style={{ fontSize: '22px' }}>{item.icon || '🏡'}</span>
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
                <p style={{ color: '#881337', fontSize: '30px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Griha Shanti • Shubham Bhavatu</p>
                <p style={{ color: 'rgba(114, 45, 6, 1)', fontSize: '24px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Home is where the soul finds rest. Cultivating love, respect, and Vastu purity fills every room with divine happiness."</p>
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
