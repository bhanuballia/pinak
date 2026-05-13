import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

export default function Chakra() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedData = localStorage.getItem('worksheetData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    if (loading || !data) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#d4af37', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '24px' }}>Loading Sudarshan Data...</div>;
    }

    // Helper to rotate houses based on a planet's sign
    const rotateChart = (originalHouses, planetSearch) => {
        if (!originalHouses) return {};
        const planetPos = (data.planet_positions || []).find(p => p.planet === planetSearch);
        if (!planetPos) return originalHouses;
        
        const targetSign = planetPos.sign;
        
        // Find which house number has the target sign
        // We iterate through keys 1-12 to be safe
        let pivotHouseNum = null;
        for (let hNum = 1; hNum <= 12; hNum++) {
            const hData = originalHouses[hNum] || originalHouses[String(hNum)];
            if (hData && hData.sign_name === targetSign) {
                pivotHouseNum = hNum;
                break;
            }
        }

        if (!pivotHouseNum) return originalHouses;
        
        const offset = pivotHouseNum - 1; // how many houses to shift
        
        const newHouses = {};
        for (let i = 1; i <= 12; i++) {
            // Calculate which old house becomes the new house 'i'
            // For i=1, it should be the pivotHouseNum
            let oldHouseNum = i + offset;
            if (oldHouseNum > 12) oldHouseNum -= 12;
            
            const oldHouseData = originalHouses[oldHouseNum] || originalHouses[String(oldHouseNum)];
            newHouses[i] = { ...oldHouseData, house: i };
        }
        return newHouses;
    };

    const lagnaHouses = data.chart?.houses || data.charts?.houses;
    const chandraHouses = rotateChart(lagnaHouses, 'Moon');
    const suryaHouses = rotateChart(lagnaHouses, 'Sun');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white', fontFamily: 'serif', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '8px', fontSize: '14px', fontWeight: 900 }}>The Triple Vision</h4>
                    <h1 style={{ fontSize: '64px', fontWeight: 900, fontStyle: 'italic', marginTop: '10px', background: 'linear-gradient(to right, #d4af37, #fde68a, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Sudarshan Chakra Method
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '18px', maxWidth: '700px', margin: '20px auto' }}>
                        Synthesizing the Body (Lagna), the Mind (Moon), and the Soul (Sun) into one unified astrological perspective.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                    {/* Lagna Chart Section */}
                    <div style={{ background: 'rgba(30,41,59,0.4)', padding: '30px', borderRadius: '40px', border: '1px solid rgba(255,191,0,0.1)', textAlign: 'center' }}>
                        <div style={{ color: '#d4af37', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px' }}>Inner Realm: Physical</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '30px' }}>Lagna Kundali</h2>
                        <ZodiacChart houses={lagnaHouses} variant="legacy" title="Body" />
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', lineHeight: '1.6' }}>Represents outward personality, health, and how the world perceives your physical presence.</p>
                    </div>

                    {/* Chandra Chart Section */}
                    <div style={{ background: 'rgba(30,41,59,0.4)', padding: '30px', borderRadius: '40px', border: '1px solid rgba(59,130,246,0.1)', textAlign: 'center' }}>
                        <div style={{ color: '#60a5fa', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px' }}>Middle Realm: Emotional</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '30px' }}>Chandra Kundali</h2>
                        <ZodiacChart houses={chandraHouses} variant="legacy" title="Mind" />
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', lineHeight: '1.6' }}>Reflects inner happiness, emotional patterns, and the intuitive mind's reaction to events.</p>
                    </div>

                    {/* Surya Chart Section */}
                    <div style={{ background: 'rgba(30,41,59,0.4)', padding: '30px', borderRadius: '40px', border: '1px solid rgba(245,158,11,0.1)', textAlign: 'center' }}>
                        <div style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px' }}>Outer Realm: Spiritual</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '30px' }}>Surya Kundali</h2>
                        <ZodiacChart houses={suryaHouses} variant="legacy" title="Soul" />
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', lineHeight: '1.6' }}>The Soul's vitality. Represents the fundamental power of self-expression and spiritual energy.</p>
                    </div>
                </div>

                {/* Synthesis Section */}
                <div style={{ marginTop: '80px', padding: '60px', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#d4af37', fontSize: '32px', fontWeight: 900, fontStyle: 'italic', marginBottom: '30px' }}>The Harmonic Synthesis</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}>
                            <p style={{ marginBottom: '20px' }}>The Sudarshan Chakra allows us to judge an event by its promise across three levels. We look at the <strong>House overlap</strong>.</p>
                            <p>For example, if you are analyzing the 10th house of Career, you must check the 10th house from the Lagna, the 10th from the Moon, and the 10th from the Sun. If all three points show strength, the success is absolute.</p>
                        </div>
                        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}>
                            <p style={{ marginBottom: '20px' }}><strong>The Body (Lagna)</strong> provides the opportunity. <br/> <strong>The Mind (Moon)</strong> provides the endurance. <br/> <strong>The Soul (Sun)</strong> provides the divine sanction.</p>
                            <p>This triple chart configuration is considered the ultimate validator in Vedic Astrology—bypassing temporary transits to reveal the core reality.</p>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '60px' }}>
                    <button 
                        onClick={() => window.close()}
                        style={{
                            padding: '20px 60px',
                            background: 'rgba(255,255,255,0.02)',
                            color: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            textTransform: 'uppercase',
                            fontSize: '11px',
                            fontWeight: 900,
                            letterSpacing: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Workstation
                    </button>
                </div>
            </div>
        </div>
    );
}
