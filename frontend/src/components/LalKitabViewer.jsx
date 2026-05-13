import React, { useState, useEffect } from 'react';
import { fetchLalKitabRemedies } from '../services/api';

const PLANETS = [
    { name: "Sun", hindi: "Surya", color: "#f59e0b" },
    { name: "Moon", hindi: "Chandra", color: "#e2e8f0" },
    { name: "Mars", hindi: "Mangal", color: "#ef4444" },
    { name: "Mercury", hindi: "Budha", color: "#10b981" },
    { name: "Jupiter", hindi: "Guru", color: "#facc15" },
    { name: "Venus", hindi: "Shukra", color: "#ec4899" },
    { name: "Saturn", hindi: "Shani", color: "#3b82f6" },
    { name: "Rahu", hindi: "Rahu", color: "#06b6d4" },
    { name: "Ketu", hindi: "Ketu", color: "#f97316" }
];

export default function LalKitabViewer() {
    const [data, setData] = useState(null);
    const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
    const [lalKitabData, setLalKitabData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse worksheet data", e);
            }
        }
    }, []);

    useEffect(() => {
        const loadRemedies = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchLalKitabRemedies(selectedPlanet.name);
                setLalKitabData(res?.data || null);
            } catch (err) {
                setError("Failed to fetch remedies from the cloud database.");
            }
            setLoading(false);
        };
        loadRemedies();
    }, [selectedPlanet]);

    if (!data) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'serif', fontStyle: 'italic', fontSize: '24px' }}>
                No Worksheet Data Found
            </div>
        );
    }

    const pData = data.planet_positions?.find(p => p.planet === selectedPlanet.name);
    const houseNum = pData?.house;

    let generalDesc = null;
    let houseSections = [];
    let isFallback = false;

    if (lalKitabData && lalKitabData.length > 0) {
        const doc = lalKitabData[0];
        if (doc.sections) {
            generalDesc = doc.content;
            if (houseNum) {
                houseSections = doc.sections.filter(sec => {
                    const lower = (sec.house || "").toLowerCase();
                    const rMap = { "1": "ist", "2": "2nd", "3": "3rd", "4": "4th", "5": "5th", "6": "6th", "7": "7th", "8": "8th", "9": "9th", "10": "10th", "11": "11th", "12": "12th" };
                    return lower.includes(`${houseNum} house`) || 
                           lower.includes(`${houseNum}th house`) || 
                           lower.includes(`${houseNum}st house`) || 
                           lower.includes(`${houseNum}nd house`) || 
                           lower.includes(`${houseNum}rd house`) || 
                           lower.includes(`${rMap[houseNum]} house`);
                });
            }
        } else {
            // Fallback logic
            isFallback = true;
            const generalDoc = lalKitabData.find(d => d.chapter && !d.chapter.toLowerCase().includes("house"));
            if (generalDoc) generalDesc = generalDoc.content;
            
            const houseDoc = lalKitabData.find(d => d.chapter && d.chapter.toLowerCase().includes("house"));
            if (houseDoc && houseNum) {
                houseSections = [{
                    type: "General",
                    description: houseDoc.content
                }];
            }
        }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', border: '8px solid rgba(255,255,255,0.05)', borderRadius: '50%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-8px', border: '8px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
            <p style={{ marginTop: '40px', color: '#d4af37', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px' }}>DECODING TEXTS...</p>
            <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
        </div>
    );

    if (error) return <div style={{ minHeight: '100vh', padding: '40px', color: '#ef4444', backgroundColor: '#020617', fontFamily: 'serif', textAlign: 'center', fontSize: '24px' }}>Error: {error}</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#cbd5e1', fontFamily: 'serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start' }}>
                    
                    {/* Sidebar Area */}
                    <div style={{ flex: '1 1 350px', textAlign: 'center' }}>
                        <div style={{ padding: '60px 20px', background: 'rgba(15,23,42,0.6)', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                            <h4 style={{ color: '#d4af37', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '10px' }}>Ancient Repository</h4>
                            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 900, fontStyle: 'italic', marginBottom: '40px' }}>Lal Kitab Secrets</h1>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                {PLANETS.map((p) => {
                                    const isSelected = selectedPlanet.name === p.name;
                                    const chartInfo = data.planet_positions?.find(x => x.planet === p.name);
                                    return (
                                        <button
                                            key={p.name}
                                            onClick={() => setSelectedPlanet(p)}
                                            style={{
                                                padding: '18px 25px',
                                                background: isSelected ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${isSelected ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.05)'}`,
                                                borderRadius: '25px',
                                                color: isSelected ? '#d4af37' : '#94a3b8',
                                                fontSize: '18px',
                                                fontWeight: 900,
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                textAlign: 'left'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                    e.currentTarget.style.color = 'white';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                    e.currentTarget.style.color = '#94a3b8';
                                                }
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <span>{p.name}</span>
                                                <span style={{ fontSize: '11px', opacity: 0.7, background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '12px' }}>{p.hindi}</span>
                                            </div>
                                            {chartInfo && (
                                                <div style={{ fontSize: '11px', color: isSelected ? '#fef3c7' : '#64748b', fontWeight: 700, letterSpacing: '1px' }}>
                                                    HOUSE {chartInfo.house} • {chartInfo.sign.toUpperCase()}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        
                        {/* Header Box */}
                        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', padding: '50px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '54px', color: '#d4af37', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{selectedPlanet.name}</h1>
                                <p style={{ fontSize: '18px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '10px' }}>General Nature & Effects</p>
                            </div>
                            {houseNum && (
                                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px 40px', borderRadius: '30px', border: '1px solid rgba(255,191,0,0.1)', textAlign: 'center' }}>
                                    <span style={{ fontSize: '10px', color: '#f97316', fontWeight: 900, textTransform: 'uppercase', display: 'block', letterSpacing: '2px' }}>Current Placement</span>
                                    <span style={{ fontSize: '28px', color: 'white', fontWeight: 900 }}>House {houseNum}</span>
                                </div>
                            )}
                        </div>

                        {/* General Description Box */}
                        <div style={{ background: 'rgba(30,41,59,0.4)', padding: '50px', borderRadius: '50px', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <div style={{ color: '#d4af37', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '24px' }}>📜</span> Sacred Interpretations
                            </div>
                            {generalDesc ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'white', fontSize: '20px', lineHeight: '1.8', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {generalDesc.split('\n').filter(p => p.trim()).map((p, i) => (
                                        <p key={i} style={{ margin: 0 }}>{p.trim()}</p>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '18px' }}>No generalized interpretation found in the sacred texts.</div>
                            )}
                        </div>

                        {/* Specific House Interpretation Box */}
                        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '50px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '24px' }}>🔮</span> Targeted Karmic Remedies
                            </div>
                            {houseSections && houseSections.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    {houseSections.map((sec, i) => (
                                        <div key={i}>
                                            <div style={{ 
                                                color: '#ef4444', 
                                                fontSize: '26px', 
                                                fontWeight: 900, 
                                                marginBottom: '15px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                borderBottom: '2px solid rgba(239, 68, 68, 0.3)',
                                                paddingBottom: '10px'
                                            }}>
                                                {sec.type || "General"}
                                            </div>
                                            {sec.points ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    {sec.points.map((pt, j) => (
                                                        <div key={j} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '20px', borderLeft: '4px solid #ef4444' }}>
                                                            <div style={{ color: '#e2e8f0', fontSize: '20px', lineHeight: '1.8' }}>{pt}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '20px', borderLeft: '4px solid #ef4444' }}>
                                                    <div style={{ color: '#e2e8f0', fontSize: '20px', lineHeight: '1.8' }}>{sec.description}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '18px' }}>The ancient records do not hold a specific remedy for this placement.</div>
                            )}
                        </div>

                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <button 
                                onClick={() => window.close()} 
                                style={{ padding: '24px 80px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '5px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >
                                Return to Workstation
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
