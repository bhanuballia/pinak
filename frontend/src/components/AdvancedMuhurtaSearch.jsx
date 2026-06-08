import React, { useState } from 'react';

export default function AdvancedMuhurtaSearch({ data }) {
    const [ceremony, setCeremony] = useState("Marriage");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Extract natal moon longitude from provided data if available
    const natalMoonLon = data?.planets?.find(p => p.name === 'Moon')?.normDegree || null;

    const ceremonies = [
        "Marriage", "Namkaran", "Anna Prashan", "Mundan", "Upnayan", "Sagai", "Tilak", "Vadhu Pravesh", "Grih Pravesh", "Bhoomi Pujan", "Vehicle Purchase"
    ].sort();

    const calculate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/muhurt/search_advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate || undefined,
                    days: endDate ? undefined : 30,
                    ceremony: ceremony,
                    user_profile: {
                        moon_lon: natalMoonLon
                    }
                })
            });
            if (!res.ok) throw new Error("Advanced timing search failed.");
            const resData = await res.json();
            setResults(resData.top_muhurtas || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 800, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Muhurta Search Engine
                    </h1>
                    <p style={{ opacity: 0.7, fontSize: '18px', marginTop: '10px' }}>
                        Scanning thousands of planetary alignments to find the exact perfect moment for you.
                    </p>
                    {natalMoonLon !== null && (
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#10b981', display: 'inline-block', background: 'rgba(16,185,129,0.1)', padding: '5px 15px', borderRadius: '20px' }}>
                            ✓ Natal Chart Linked (Personalized Search)
                        </div>
                    )}
                </header>

                <div style={{ background: 'rgba(30,41,59,0.5)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Event</label>
                            <select
                                value={ceremony}
                                onChange={(e) => setCeremony(e.target.value)}
                                style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px' }}
                            >
                                {ceremonies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>End Date (Max 60 days)</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px' }}
                            />
                        </div>
                    </div>
                    
                    <button
                        onClick={calculate}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '16px',
                            background: loading ? '#475569' : 'linear-gradient(to right, #38bdf8, #818cf8)',
                            color: 'white', fontWeight: 800, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                        }}
                    >
                        {loading ? 'Analyzing Ephemeris Data...' : 'Find Top 3 Exact Times'}
                    </button>
                </div>

                {error && <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>{error}</div>}

                {results && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#f8fafc' }}>Top Recommended Windows:</h3>
                        {results.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {results.map((r, i) => (
                                    <div key={i} style={{ 
                                        background: i === 0 ? 'linear-gradient(145deg, rgba(56,189,248,0.1), rgba(129,140,248,0.05))' : 'rgba(30,41,59,0.3)', 
                                        border: i === 0 ? '1px solid rgba(56,189,248,0.4)' : '1px solid rgba(255,255,255,0.05)', 
                                        padding: '24px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center' 
                                    }}>
                                        <div style={{ 
                                            background: i === 0 ? '#38bdf8' : '#475569', 
                                            color: i === 0 ? '#0f172a' : 'white', 
                                            width: '40px', height: '40px', borderRadius: '50%', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                            fontWeight: 800, fontSize: '20px', flexShrink: 0
                                        }}>
                                            #{i + 1}
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                                                {new Date(r.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '12px' }}>
                                                {new Date(r.start_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} 
                                                {' - '} 
                                                {new Date(r.end_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {r.nakshatra && (
                                                    <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                        🌙 {r.nakshatra}
                                                    </span>
                                                )}
                                                {r.tithi && (
                                                    <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                        📅 {r.tithi}
                                                    </span>
                                                )}
                                                {r.reasons.map((rsn, idx) => (
                                                    <span key={idx} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                        ✓ {rsn}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</div>
                                            <div style={{ fontSize: '32px', fontWeight: 900, color: i === 0 ? '#38bdf8' : '#f8fafc' }}>{r.score}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(30,41,59,0.3)', borderRadius: '20px', color: '#94a3b8' }}>
                                No optimal time windows found in this date range. Try expanding your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
