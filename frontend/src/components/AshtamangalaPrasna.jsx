import React, { useState } from 'react';
import { fetchAshtamangala } from '../services/api';
import ZodiacChart from './ZodiacChart';

export default function AshtamangalaPrasna() {
    const [question, setQuestion] = useState("");
    const [arudhaSign, setArudhaSign] = useState("Aries");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const calculatePrasna = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            let lat = 19.0760, lon = 72.8777;
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.basic_details) {
                    lat = parsed.basic_details.lat || lat;
                    lon = parsed.basic_details.lon || lon;
                }
            }

            const payload = {
                latitude: lat,
                longitude: lon,
                question: question,
                arudha_sign: arudhaSign
            };

            const res = await fetchAshtamangala(payload);
            console.log("Ashtamangala Response:", res);
            setResult(res.result);
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
                    <h4 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '12px' }}>Kerala Astrology</h4>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, fontStyle: 'italic', marginTop: '10px' }}>Ashtamangala Prasna</h1>
                    <p style={{ opacity: 0.6, fontSize: '14px' }}>Divine Omens & Planetary Interventions</p>
                </header>

                <div style={{ background: 'rgba(30,41,59,0.5)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#d4af37', textTransform: 'uppercase', fontWeight: 900, marginBottom: '10px' }}>Select Arudha Lagna</label>
                                <select 
                                    value={arudhaSign} 
                                    onChange={e => setArudhaSign(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '15px 25px',
                                        borderRadius: '15px',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontFamily: 'serif'
                                    }}
                                >
                                    {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#d4af37', textTransform: 'uppercase', fontWeight: 900, marginBottom: '10px' }}>Your Divine Question</label>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g., Will I recover from this illness?"
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
                                        onClick={calculatePrasna}
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
                                        {loading ? 'Casting...' : 'Cast Prasna'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', marginTop: '60px', paddingTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ flex: '1 1 400px' }}>
                                <div style={{ background: 'rgba(212,175,55,0.05)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.1)' }}>
                                    <h3 style={{ color: '#d4af37', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>Key Indicators</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Arudha Lagna</span>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0' }}>{result.arudha_sign}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Udaya Lagna (Asc)</span>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0' }}>{result.udaya_sign}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Chhatra (Umbrella)</span>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0' }}>{result.chhatra_sign}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Sun Sign</span>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0' }}>{result.sun_sign}</span>
                                        </div>
                                        <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                            <span style={{ fontSize: '10px', color: '#ff4d4d', textTransform: 'uppercase', display: 'block' }}>Malefic Upagrahas</span>
                                            <span style={{ fontSize: '16px', fontWeight: 900, color: '#ff7675' }}>
                                                Gulika in {result.gulika_sign} | Mandi in {result.mandi_sign}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h3 style={{ color: '#d4af37', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Divine Insight</h3>
                                        <p style={{ fontSize: '16px', fontStyle: 'italic', lineHeight: '1.6', color: '#e2e8f0' }}>"{result.reasoning}"</p>
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
