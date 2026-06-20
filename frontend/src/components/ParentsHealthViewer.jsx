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

            {/* Premium Header */}
            <div style={{ 
                padding: '80px 40px', 
                background: isLightMode ? 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #0c4a6e 0%, #020617 100%)', 
                borderBottom: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
                
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
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>👨‍👩‍👧</div>
                    <div>
                        <h1 style={{ fontSize: '64px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: 0, fontStyle: 'italic', letterSpacing: '-2px' }}>Parents Health Guide</h1>
                        <p style={{ color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '14px', fontWeight: 900, marginTop: '10px' }}>
                            Lineage Vitality • Parental Well-being Diagnostic
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
                borderBottom: '1px solid rgba(14, 165, 233, 0.1)',
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
                                background: filter === cat ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                                color: filter === cat ? 'white' : '#94a3b8',
                                border: filter === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                fontSize: '11px',
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
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.3))' }}></div>
                            <h2 style={{ fontSize: '32px', color: '#0ea5e9', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Lineage Health Diagnostic</h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(14,165,233,0.3))' }}></div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {/* Mother Health Card */}
                            <div style={{ 
                                background: isLightMode ? 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #0c4a6e 0%, #020617 100%)', 
                                padding: '40px', 
                                borderRadius: '50px', 
                                border: '1px solid rgba(14,165,233,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#38bdf8', marginBottom: '15px' }}>👩 Mother's Health (4th House)</p>
                                <p style={{ fontSize: '24px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '10px 0', lineHeight: '1.4' }}>{typeof personalData.mother === 'object' ? (Array.isArray(personalData.mother.notes) ? personalData.mother.notes.join(' ') : (personalData.mother.notes || personalData.mother.score)) : personalData.mother}</p>
                            </div>

                            {/* Father Health Card */}
                            <div style={{ 
                                background: isLightMode ? 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)' : 'linear-gradient(135deg, #0c4a6e 0%, #020617 100%)', 
                                padding: '40px', 
                                borderRadius: '50px', 
                                border: '1px solid rgba(14,165,233,0.2)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '4px', color: '#38bdf8', marginBottom: '15px' }}>👨 Father's Health (9th House)</p>
                                <p style={{ fontSize: '24px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', margin: '10px 0', lineHeight: '1.4' }}>{typeof personalData.father === 'object' ? (Array.isArray(personalData.father.notes) ? personalData.father.notes.join(' ') : (personalData.father.notes || personalData.father.score)) : personalData.father}</p>
                            </div>

                            {/* Deep Insights */}
                            <div style={{ 
                                background: isLightMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.4)', 
                                padding: '40px', 
                                borderRadius: '50px', 
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                gridColumn: 'span 2',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: isLightMode ? '#475569' : '#94a3b8', marginBottom: '20px' }}>Diagnostic Summary</p>
                                <p style={{ fontSize: '20px', color: isLightMode ? '#a51e0dbd' : '#cbd5e1', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                                    Your chart indicates that the parental energy is guided by the luminaries (Sun & Moon). Benefic influences on the 4th and 9th houses suggest stability, while any challenges can be mitigated through designated remedies.
                                </p>
                            </div>
                        </div>
                        
                        {worksheetData && (
                            <DiagnosticDetails domain="parents_health" worksheetData={worksheetData} />
                        )}
                    </section>
                )}

                {/* General Insights */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                        <h2 style={{ fontSize: '32px', color: isLightMode ? '#0f172a' : 'white', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Parental Care Wisdom</h2>
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
                                    <span style={{ padding: '6px 15px', borderRadius: '100px', background: 'rgba(14, 165, 233, 0.05)', fontSize: '10px', color: '#0ea5e9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>{item.category}</span>
                                    <span style={{ fontSize: '24px' }}>{item.icon || '👨‍👩‍👧'}</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: 900, color: isLightMode ? '#0f172a' : 'white', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ fontSize: '18px', color: isLightMode ? '#475569' : '#94a3b8', lineHeight: '1.7', fontStyle: 'italic' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: '#0ea5e9', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', marginBottom: '15px' }}>Matru Devo Bhava • Pitru Devo Bhava</p>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>"Parents are the living representatives of the Divine. Their health and happiness are the foundation of your own life's stability."</p>
                <button 
                    onClick={() => window.close()} 
                    style={{ 
                        padding: '24px 80px', 
                        borderRadius: '100px', 
                        background: 'rgba(14, 165, 233, 0.05)', 
                        color: '#0ea5e9', 
                        border: '1px solid rgba(14, 165, 233, 0.2)', 
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
