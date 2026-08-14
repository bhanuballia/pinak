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

const getLalKitabPlacement = (data, planetName) => {
    if (!data?.lalkitab?.chart?.houses) return null;
    const houses = data.lalkitab.chart.houses;
    for (let i = 1; i <= 12; i++) {
        const houseData = houses[i] || houses[i.toString()];
        if (houseData && houseData.planets) {
            const planet = houseData.planets.find(p => p.name === planetName);
            if (planet) return { house: houseData.house_number, sign: houseData.sign_name };
        }
    }
    return null;
};

export default function LalKitabViewer() {
    const [isLightMode, setIsLightMode] = useState(true);
    const [data, setData] = useState(null);
    const [viewMode, setViewMode] = useState("planets"); // "planets" or "debts"
    const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
    const [lalKitabData, setLalKitabData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const theme = {
        bg: '#fff1f2', // rose-50
        text: '#1e293b', // dark slate
        heading: '#881337', // dark rose heading
        headerGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)',
        cardBg: '#ffffff',
        borderColor: '#fecdd3', // rose-200 border
        buttonBg: '#ffe4e6',
        accentText: '#be123c'
    };

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
        if (viewMode !== "planets") return;
        
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
    }, [selectedPlanet, viewMode]);

    if (!data) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#881337', fontFamily: 'serif', fontStyle: 'italic', fontSize: '24px', fontWeight: 900 }}>
                No Worksheet Data Found
            </div>
        );
    }

    const chartInfo = getLalKitabPlacement(data, selectedPlanet.name);
    const houseNum = chartInfo?.house;

    let generalDesc = null;
    let houseSections = [];

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

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', border: `8px solid ${theme.borderColor}`, borderRadius: '50%', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-8px', border: '8px solid #e11d48', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                    <p style={{ marginTop: '40px', color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px' }}>DECODING LAL KITAB TEXTS...</p>
                    <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
                </div>
            );
        }

        if (viewMode === "debts") {
            const debts = data?.lalkitab?.debts || [];
            return (
                <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ background: theme.headerGradient, padding: '50px', borderRadius: '40px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                        <h1 style={{ fontSize: '54px', color: '#881337', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>Pitra Rin</h1>
                        <p style={{ fontSize: '18px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '10px' }}>Ancestral Planetary Debts</p>
                    </div>

                    {debts.length === 0 ? (
                        <div style={{ background: theme.cardBg, padding: '50px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, color: '#1e293b', fontSize: '20px', textAlign: 'center', fontStyle: 'italic' }}>
                            You have no active Lal Kitab Planetary Debts (Pitra Rin) detected in your chart.
                        </div>
                    ) : (
                        debts.map((debt, i) => (
                            <div key={i} style={{ background: theme.cardBg, padding: '40px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                <div style={{ color: '#881337', fontSize: '26px', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    {debt.name}
                                </div>
                                <div style={{ color: '#be123c', fontSize: '16px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 900 }}>
                                    Cause: {debt.cause}
                                </div>
                                <div style={{ color: '#1e293b', fontSize: '20px', lineHeight: '1.6', marginBottom: '30px' }}>
                                    {debt.description}
                                </div>
                                <div style={{ background: '#ffe4e6', padding: '25px', borderRadius: '20px', borderLeft: '6px solid #e11d48', border: `1px solid ${theme.borderColor}` }}>
                                    <div style={{ color: '#881337', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Remedy</div>
                                    <div style={{ color: '#1e293b', fontSize: '18px', lineHeight: '1.6', fontStyle: 'italic' }}>{debt.remedy}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        return (
            <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ background: theme.headerGradient, padding: '50px', borderRadius: '40px', border: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                    <div>
                        <h1 style={{ fontSize: '54px', color: '#881337', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{selectedPlanet.name}</h1>
                        <p style={{ fontSize: '18px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '10px' }}>General Nature & Effects</p>
                    </div>
                    {houseNum && (
                        <div style={{ background: '#ffffff', padding: '20px 40px', borderRadius: '30px', border: `1px solid ${theme.borderColor}`, textAlign: 'center', boxShadow: '0 4px 15px rgba(136, 19, 55, 0.05)' }}>
                            <span style={{ fontSize: '12px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', display: 'block', letterSpacing: '2px' }}>Lal Kitab Placement</span>
                            <span style={{ fontSize: '28px', color: '#881337', fontWeight: 900 }}>House {houseNum}</span>
                        </div>
                    )}
                </div>

                <div style={{ background: theme.cardBg, padding: '50px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                    <div style={{ color: '#be123c', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '24px' }}>📜</span> Sacred Interpretations
                    </div>
                    {generalDesc ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#1e293b', fontSize: '20px', lineHeight: '1.8' }}>
                            {generalDesc.split('\n').filter(p => p.trim()).map((p, i) => (
                                <p key={i} style={{ margin: 0 }}>{p.trim()}</p>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: '#475569', fontStyle: 'italic', fontSize: '18px' }}>No generalized interpretation found in the sacred texts.</div>
                    )}
                </div>

                <div style={{ background: theme.cardBg, padding: '50px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                    <div style={{ color: '#881337', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '24px' }}>🔮</span> Targeted Karmic Remedies
                    </div>
                    {houseSections && houseSections.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {houseSections.map((sec, i) => (
                                <div key={i}>
                                    <div style={{ color: '#be123c', fontSize: '24px', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `2px solid ${theme.borderColor}`, paddingBottom: '10px' }}>
                                        {sec.type || "General"}
                                    </div>
                                    {sec.points ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {sec.points.map((pt, j) => (
                                                <div key={j} style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px', borderLeft: '4px solid #be123c', border: `1px solid ${theme.borderColor}` }}>
                                                    <div style={{ color: '#1e293b', fontSize: '20px', lineHeight: '1.8', fontStyle: 'italic' }}>{pt}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '20px', borderLeft: '4px solid #be123c', border: `1px solid ${theme.borderColor}` }}>
                                            <div style={{ color: '#1e293b', fontSize: '20px', lineHeight: '1.8', fontStyle: 'italic' }}>{sec.description}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: '#475569', fontStyle: 'italic', fontSize: '18px' }}>The ancient records do not hold a specific remedy for this placement.</div>
                    )}
                </div>
            </div>
        );
    };

    if (error) return <div style={{ minHeight: '100vh', padding: '40px', color: '#be123c', backgroundColor: theme.bg, fontFamily: 'serif', textAlign: 'center', fontSize: '24px', fontWeight: 900 }}>Error: {error}</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', padding: '40px 20px', position: 'relative' }}>
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

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start' }}>
                    
                    {/* Sidebar Area */}
                    <div style={{ flex: '1 1 350px', textAlign: 'center' }}>
                        <div style={{ padding: '45px 25px', background: theme.cardBg, borderRadius: '40px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                            <h4 style={{ color: '#be123c', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>Ancient Repository</h4>
                            <h1 style={{ color: '#881337', fontSize: '36px', fontWeight: 900, fontStyle: 'italic', marginBottom: '30px' }}>Lal Kitab Secrets</h1>
                            
                            <button
                                onClick={() => setViewMode("debts")}
                                style={{
                                    width: '100%',
                                    padding: '18px 25px',
                                    background: viewMode === "debts" ? '#e11d48' : '#ffffff',
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '20px',
                                    color: viewMode === "debts" ? '#ffffff' : '#881337',
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    textAlign: 'center',
                                    marginBottom: '25px',
                                    boxShadow: viewMode === "debts" ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none'
                                }}
                            >
                                <span style={{ width: '100%' }}>Pitra Rin (Debts)</span>
                                {data?.lalkitab?.debts?.length > 0 && (
                                    <span style={{ fontSize: '13px', color: viewMode === "debts" ? '#ffe4e6' : '#be123c', fontWeight: 900 }}>
                                        {data.lalkitab.debts.length} ACTIVE DEBTS
                                    </span>
                                )}
                            </button>

                            <div style={{ height: '1px', background: theme.borderColor, margin: '0 20px 25px' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {PLANETS.map((p) => {
                                    const isSelected = viewMode === "planets" && selectedPlanet.name === p.name;
                                    const pChartInfo = getLalKitabPlacement(data, p.name);
                                    
                                    return (
                                        <button
                                            key={p.name}
                                            onClick={() => { setViewMode("planets"); setSelectedPlanet(p); }}
                                            style={{
                                                padding: '16px 22px',
                                                background: isSelected ? '#e11d48' : '#ffffff',
                                                border: `1px solid ${theme.borderColor}`,
                                                borderRadius: '20px',
                                                color: isSelected ? '#ffffff' : '#881337',
                                                fontSize: '18px',
                                                fontWeight: 900,
                                                letterSpacing: '2px',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                textAlign: 'left',
                                                boxShadow: isSelected ? '0 4px 14px rgba(225, 29, 72, 0.3)' : 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <span>{p.name}</span>
                                                <span style={{ fontSize: '12px', opacity: 0.9, background: isSelected ? 'rgba(255,255,255,0.2)' : '#ffe4e6', color: isSelected ? '#ffffff' : '#be123c', padding: '4px 10px', borderRadius: '12px', fontWeight: 900 }}>{p.hindi}</span>
                                            </div>
                                            {pChartInfo && (
                                                <div style={{ fontSize: '13px', color: isSelected ? '#ffe4e6' : '#be123c', fontWeight: 900, letterSpacing: '1px' }}>
                                                    HOUSE {pChartInfo.house} • {pChartInfo.sign.toUpperCase()}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {renderContent()}
                        
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
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
                </div>
            </div>
        </div>
    );
}
