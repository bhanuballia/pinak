import React, { useState, useEffect } from 'react';
import { fetchHoroscope } from '../services/api';
import ZodiacChart from './ZodiacChart';

export default function Prashna() {
    const [question, setQuestion] = useState("");
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);

    const calculateHorary = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            // Horary uses current moment
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0];
            const tz = (now.getTimezoneOffset() / -60.0);

            // We'll use Mumbai (Ujjain proxy) or the user's last coordinates if available
            let lat = 19.0760, lon = 72.8777;
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.basic_details) {
                    lat = parsed.basic_details.lat || lat;
                    lon = parsed.basic_details.lon || lon;
                }
            }

            const res = await fetchHoroscope("Horary Query", date, time, lat, lon, tz);
            console.log("Horary Response:", res);
            setChartData(res);

            // Corrected property access based on backend structure
            const mainChart = res.chart || res.charts?.d1 || res.charts;
            if (!mainChart || !mainChart.houses) {
                throw new Error("Invalid chart data received from heavens.");
            }

            const house1 = mainChart.houses[1] || mainChart.houses["1"];
            const ascendant = house1?.sign_name || "Unknown";

            const moonPos = res.planet_positions?.find(p => p.planet === 'Moon');
            const moonSign = moonPos?.sign || "Unknown";
            const moonNak = moonPos?.nakshatra || "Unknown";

            setInsight({
                ascendant,
                moonSign,
                moonNak,
                verdict: "The cosmic alignment for this query is " + (["Aries", "Leo", "Sagittarius"].includes(ascendant) ? "Dynamic & Fast-moving" : "Stable & Deliberate")
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'hsla(234, 83%, 5%, 1.00)', color: 'white', fontFamily: 'serif', padding: '40px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '12px' }}>Prashna Shastra</h4>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, fontStyle: 'italic', marginTop: '10px' }}>Horary Astrology</h1>
                    <p style={{ opacity: 0.6, fontSize: '14px' }}>The Birth of a Question</p>
                </header>

                <div style={{ background: 'rgba(30,41,59,0.5)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#d4af37', textTransform: 'uppercase', fontWeight: 900, marginBottom: '10px' }}>Your Divine Question</label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., Will I succeed in this venture?"
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '15px 25px',
                                    borderRadius: '15px',
                                    color: 'white',
                                    fontSize: '18px',
                                    fontFamily: 'serif'
                                }}
                            />
                            <button
                                onClick={calculateHorary}
                                disabled={loading || !question.trim()}
                                style={{
                                    padding: '0 40px',
                                    borderRadius: '15px',
                                    background: '#d4af37',
                                    color: '#020720ff',
                                    fontWeight: 900,
                                    fontSize: '14px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    border: 'none',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                {loading ? 'Casting...' : 'Cast Horary Chart'}
                            </button>
                        </div>
                    </div>

                    {chartData && (
                        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', marginTop: '60px', paddingTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ flex: '1 1 400px' }}>
                                <ZodiacChart
                                    houses={chartData.chart?.houses || chartData.charts?.houses}
                                    title="Prashna Chart"
                                    variant="legacy"
                                />
                            </div>
                            <div style={{ flex: '1 1 400px' }}>
                                <div style={{ background: 'rgba(212,175,55,0.05)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.1)' }}>
                                    <h3 style={{ color: '#d4af37', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>Divine Insight</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Query Moment Ascendant</span>
                                            <span style={{ fontSize: '24px', fontWeight: 900 }}>{insight.ascendant}</span>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Moon Position</span>
                                            <span style={{ fontSize: '24px', fontWeight: 900 }}>{insight.moonSign} ({insight.moonNak})</span>
                                        </div>
                                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: '1.6', color: '#e2e8f0' }}>"{insight.verdict}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <button
                        onClick={() => window.close()}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.4)',
                            padding: '15px 40px',
                            borderRadius: '100px',
                            textTransform: 'uppercase',
                            fontSize: '10px',
                            fontWeight: 900,
                            letterSpacing: '3px',
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
