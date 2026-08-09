import React, { useState, useEffect } from 'react';
import { fetchChildrenHealthInsights } from '../services/api';
import DiagnosticDetails from './DiagnosticDetails';

export default function ChildrenHealthViewer() {
    const [isLightMode, setIsLightMode] = useState(false);
    const [insights, setInsights] = useState([]);
    const [personalData, setPersonalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'vitality' | 'organs' | 'remedies'
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
                    fetchChildrenHealthInsights().catch(e => {
                        console.error("General childrens health insights fetch failed", e);
                        return [];
                    })
                ]);

                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.life_oracle && parsed.life_oracle.children_health) {
                            setPersonalData(parsed.life_oracle.children_health);
                        }
                        setWorksheetData(parsed);
                    } catch (e) {
                        console.error("Failed to parse worksheet data for childrens health", e);
                    }
                }

                setInsights(general);
                if (uData.date) setUserData(uData);
            } catch (err) {
                console.error("Childrens health insights fetch error:", err);
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
                <div style={{ fontSize: '64px', marginBottom: '30px', animation: 'bounce 2s infinite' }}>🧸</div>
                <p style={{ color: '#10b981', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' }}>Tracing Joyful Progeny Vitality...</p>
                <style>{` @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } `}</style>
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

    const cScore = personalData?.score !== undefined ? personalData.score : 'N/A';
    const cRisk = personalData?.risk_level || (cScore !== 'N/A' ? (cScore >= 70 ? 'Low' : cScore >= 50 ? 'Moderate' : 'High') : null);

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

            <div style={{ 
                padding: '70px 40px', 
                background: isLightMode ? 'linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #064e3b 0%, #020617 100%)', 
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
                
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
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>🧸</div>
                    <div>
                        <h1 style={{ fontSize: '56px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Children's Health Guide</h1>
                        <p style={{ color: '#34d399', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '13px', fontWeight: 900, marginTop: '10px' }}>
                            Progeny Vitality • Growth Diagnostic & Vedic Blessings
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                backgroundColor: isLightMode ? 'rgba(241, 245, 249, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                position: 'sticky',
                top: 0,
                zIndex: 90
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', padding: '15px 40px', overflowX: 'auto' }}>
                    {[
                        { id: 'overview', label: '📊 Overview', desc: 'Summary & Vitality Index' },
                        { id: 'vitality', label: '🧒 Progeny Vitality', desc: '5th House & Jupiter' },
                        { id: 'organs', label: '🏥 Health & Organs', desc: 'Anatomy & Disease Axes' },
                        { id: 'remedies', label: '🌿 Vedic Remedies', desc: 'Santana Gopala & Charity' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                background: activeTab === tab.id 
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                                    : (isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)'),
                                color: activeTab === tab.id ? 'white' : (isLightMode ? '#334155' : 'rgba(209, 250, 229, 1)'),
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

                {activeTab === 'overview' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ 
                            background: isLightMode ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)' : 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)', 
                            padding: '40px', 
                            borderRadius: '35px', 
                            border: '1px solid rgba(16,185,129,0.3)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            marginBottom: '40px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '20px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '3px', color: '#34d399' }}>🧸 Progeny Health Index (5th House)</span>
                                {cRisk && (
                                    <span style={{ 
                                        padding: '6px 16px', 
                                        borderRadius: '20px', 
                                        fontSize: '18px', 
                                        fontWeight: 300, 
                                        backgroundColor: getRiskColor(cRisk), 
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {cRisk} Sensitivity
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '48px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>
                                {cScore !== 'N/A' ? `${cScore}/100` : 'N/A'}
                                <span style={{ fontSize: '18px', fontWeight: 400, opacity: 0.7, marginLeft: '10px' }}>Vitality Index</span>
                            </div>

                            <p style={{ fontSize: '18px', color: isLightMode ? '#334155' : 'rgba(209, 250, 229, 1)', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '25px' }}>
                                {personalData ? (Array.isArray(personalData.notes) ? personalData.notes.join(' ') : (personalData.notes || 'Analyzed via 5th House, 5th Lord & Jupiter placement.')) : 'Children health analysis extracts 5th house, Jupiter (Putrakaraka), Mercury (Intellect), and disease/longevity house dynamics.'}
                            </p>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button 
                                    onClick={() => setActiveTab('vitality')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '14px',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '18px',
                                        fontWeight: 300,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Explore Progeny Diagnostics →
                                </button>
                                <button 
                                    onClick={() => setActiveTab('remedies')}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '14px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: isLightMode ? '#064e3b' : '#a7f3d0',
                                        border: '1px solid rgba(16,185,129,0.3)',
                                        fontSize: '18px',
                                        fontWeight: 300,
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Vedic Remedies 🌿
                                </button>
                            </div>
                        </div>

                        {worksheetData && (
                            <div style={{ marginTop: '40px' }}>
                                <DiagnosticDetails domain="children_health" worksheetData={worksheetData} />
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'vitality' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ 
                            background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)', 
                            padding: '40px', 
                            borderRadius: '30px', 
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#34d399', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🧒 Progeny Vitality & Karaka Analysis</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#34d399', fontWeight: 900, margin: '0 0 5px 0' }}>Primary Putrakaraka</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>Jupiter (Guru)</p>
                                    <p style={{ fontSize: '18px', color: 'rgba(209, 250, 229, 1)', marginTop: '5px' }}>Governs child growth, wisdom, immunity, and liver.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#34d399', fontWeight: 900, margin: '0 0 5px 0' }}>Intellect & Nervous System</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>Mercury (Budha)</p>
                                    <p style={{ fontSize: '18px', color: 'rgba(209, 250, 229, 1)', marginTop: '5px' }}>Governs mental alertness, speech, and nervous balance.</p>
                                </div>

                                <div style={{ padding: '20px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#34d399', fontWeight: 900, margin: '0 0 5px 0' }}>5th House Lord</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>{personalData?.lord_5 || '5th Lord'}</p>
                                    <p style={{ fontSize: '18px', color: 'rgba(209, 250, 229, 1)', marginTop: '5px' }}>Ruler of progeny happiness, health & intelligence.</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Planetary Strengths & Roles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                {(personalData?.planets || [
                                    { name: 'Jupiter', role: 'Putrakaraka (Growth & Immunity)', strength: '60/150' },
                                    { name: 'Mercury', role: 'Intellect & Nervous System', strength: '60/150' }
                                ]).map((p, idx) => (
                                    <div key={idx} style={{ padding: '15px 20px', borderRadius: '16px', background: isLightMode ? '#f8fafc' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: '#34d399' }}>
                                            <span>{p.name}</span>
                                            <span>{p.strength}</span>
                                        </div>
                                        <div style={{ fontSize: '18px', color: isLightMode ? '#64748b' : 'rgba(209, 250, 229, 0.8)', marginTop: '5px' }}>{p.role}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '22px', fontWeight: 300, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>Astrological Observations</h3>
                            <ul style={{ paddingLeft: '20px', fontSize: '18px', lineHeight: '1.8', color: isLightMode ? '#334155' : 'rgba(209, 250, 229, 0.9)' }}>
                                {(personalData?.notes || ["5th house receives supportive aspects."]).map((n, i) => (
                                    <li key={i}>{n}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {activeTab === 'organs' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ 
                            background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)', 
                            padding: '40px', 
                            borderRadius: '30px', 
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            marginBottom: '40px'
                        }}>
                            <h2 style={{ fontSize: '32px', color: '#34d399', fontWeight: 900, fontStyle: 'italic', marginTop: 0, marginBottom: '20px' }}>🏥 Anatomical & Disease House Diagnostics</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
                                <div style={{ padding: '25px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ fontSize: '20px', color: '#34d399', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>🎯 Anatomical Focus</h4>
                                    <p style={{ fontSize: '22px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '0 0 10px 0' }}>{personalData?.organs || 'Stomach, Digestion, Solar Plexus, Liver & Nervous System'}</p>
                                    <p style={{ fontSize: '18px', color: 'rgba(209, 250, 229, 1)', margin: 0 }}>Governed by 5th house and Leo zodiac sign.</p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ fontSize: '20px', color: '#34d399', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>⚡ 10th House Axis (6th from 5th)</h4>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#334155' : 'rgba(209, 250, 229, 1)', margin: 0, lineHeight: '1.6' }}>
                                        The 10th house indicates acute health sensitivity or seasonal fevers for your children. Malefics here warrant timely medical care.
                                    </p>
                                </div>

                                <div style={{ padding: '25px', borderRadius: '20px', background: isLightMode ? '#f0fdf4' : 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h4 style={{ fontSize: '20px', color: '#34d399', fontWeight: 900, marginTop: 0, marginBottom: '10px' }}>⏳ 12th House Axis (8th from 5th)</h4>
                                    <p style={{ fontSize: '18px', color: isLightMode ? '#334155' : 'rgba(209, 250, 229, 1)', margin: 0, lineHeight: '1.6' }}>
                                        The 12th house represents long-term immunity and longevity for children. Benefic aspects to the 12th house grant sound recovery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'remedies' && (
                    <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <div style={{ background: isLightMode ? '#ffffff' : 'rgba(15, 23, 42, 0.8)', padding: '35px', borderRadius: '30px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#34d399', marginTop: 0, marginBottom: '20px' }}>🌿 Vedic Remedies & Child Protection</h3>
                            
                            <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', marginBottom: '25px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <p style={{ fontSize: '18px', textTransform: 'uppercase', color: '#34d399', fontWeight: 900, margin: '0 0 5px 0' }}>Recommended Mantras</p>
                                <p style={{ fontSize: '18px', fontWeight: 300, margin: 0, color: isLightMode ? '#0f172a' : 'white' }}>
                                    {personalData?.mantra || 'Santana Gopala Mantra & Om Gam Ganapataye Namah'}
                                </p>
                            </div>

                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '22px', color: isLightMode ? '#334155' : 'rgba(209, 250, 229, 1)' }}>
                                {(personalData?.remedies || [
                                    "Recite Santana Gopala Mantra or Gayatri Mantra daily for children's well-being.",
                                    "Perform Ganesha Puja & offer Durva grass on Wednesdays for Mercury strength.",
                                    "Donate Yellow fruits, Books, or Chana Dal on Thursdays for Jupiter (Putrakaraka).",
                                    "Ensure nutritious diet and routine digestion/growth checkups for children.",
                                    "Maintain a peaceful learning environment at home to reduce academic stress."
                                ]).map((rem, idx) => (
                                    <li key={idx}>{rem}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
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
                                            <span style={{ fontSize: '18px', color: '#34d399', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{item.category}</span>
                                            <span style={{ fontSize: '22px' }}>{item.icon || '🧸'}</span>
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

            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <p style={{ color: '#34d399', fontSize: '22px', fontWeight: 900, fontStyle: 'italic', marginBottom: '10px' }}>Santana Gopala Kripa • Shubham Bhavatu</p>
                <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>"Children are the divine manifestations of past good karma (Poorva Punya). Nurturing their health and wisdom is the highest duty."</p>
                <button 
                    onClick={() => window.close()} 
                    style={{ 
                        padding: '16px 50px', 
                        borderRadius: '100px', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: '#34d399', 
                        border: '1px solid rgba(16, 185, 129, 0.3)', 
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
