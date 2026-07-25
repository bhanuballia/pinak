import React, { useState, useEffect } from 'react';
import { fetchDailyPanchang } from '../services/api';

const ProfessionalRoyaleClock = ({ time }) => {
    const ghatiRotation = (time.total_ghati % 60) * 6;
    const muhurtaRotation = (time.total_ghati / 2 % 30) * 12;

    const symptoms = ["♈\uFE0E", "♉\uFE0E", "♊\uFE0E", "♋\uFE0E", "♌\uFE0E", "♍\uFE0E", "♎\uFE0E", "♏\uFE0E", "♐\uFE0E", "♑\uFE0E", "♒\uFE0E", "♓\uFE0E"];
    const rashis = ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];

    const swordPath = "polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)";

    return (
        <div style={{
            position: 'relative',
            width: '480px',
            height: '480px',
            margin: '0 auto 50px',
            userSelect: 'none'
        }}>
            {/* 3D Golden Brass Case */}
            <div style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af37 0%, #f9f295 45%, #b8860b 100%)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.5)',
                border: '4px solid #5c4033'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.2)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}></div>
            </div>

            {/* Main Dial Surface */}
            <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
                <defs>
                    <radialGradient id="royalDial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="70%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                    </radialGradient>
                    <linearGradient id="solidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" />
                        <stop offset="45%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                    <filter id="goldGlow">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <circle cx="200" cy="200" r="195" fill="url(#royalDial)" stroke="#1e293b" strokeWidth="2" />

                {[...Array(60)].map((_, i) => {
                    const angle = (i * 6 * Math.PI) / 180;
                    const rInner = i % 5 === 0 ? 172 : 182;
                    const rOuter = 192;
                    return (
                        <line
                            key={i}
                            x1={200 + rInner * Math.sin(angle)}
                            y1={200 - rInner * Math.cos(angle)}
                            x2={200 + rOuter * Math.sin(angle)}
                            y2={200 - rOuter * Math.cos(angle)}
                            stroke={i % 5 === 0 ? "#d4af37" : "#334155"}
                            strokeWidth={i % 5 === 0 ? 3 : 1}
                        />
                    );
                })}

                {rashis.map((r, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const rText = 145;
                    const rIcon = 115;
                    return (
                        <g key={r}>
                            <text
                                x={200 + rText * Math.sin(angle)}
                                y={200 - rText * Math.cos(angle)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="rgba(243, 202, 21, 1)"
                                fontSize="12"
                                fontWeight="900"
                                transform={`rotate(${i * 30}, ${200 + rText * Math.sin(angle)}, ${200 - rText * Math.cos(angle)})`}
                                style={{ fontFamily: 'serif', letterSpacing: '1px' }}
                            >
                                {r.toUpperCase()}
                            </text>
                            <text
                                x={200 + rIcon * Math.sin(angle)}
                                y={200 - rIcon * Math.cos(angle)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#d4af37"
                                fontSize="28"
                                filter="url(#goldGlow)"
                            >
                                {symptoms[i]}
                            </text>
                        </g>
                    );
                })}

                <circle cx="200" cy="200" r="30" fill="#020617" stroke="#d4af37" strokeWidth="2" />
                <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fill="#d4af37" fontSize="20" fontWeight="bold">ॐ</text>

                <g style={{ transform: `rotate(${muhurtaRotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <path d="M 192,200 L 200,60 L 208,200 Z" fill="url(#solidGold)" filter="url(#goldGlow)" />
                    <circle cx="200" cy="200" r="10" fill="#d4af37" />
                </g>

                <g style={{ transform: `rotate(${ghatiRotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 0.5s ease-out' }}>
                    <path d="M 197,200 L 200,45 L 203,200 Z" fill="#ff4d00" stroke="#fcd34d" strokeWidth="0.5" />
                    <circle cx="200" cy="200" r="6" fill="#ff4d00" />
                </g>
            </svg>

            <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '220px',
                background: 'linear-gradient(to bottom, #1e293b, #020617)',
                padding: '12px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(212,175,55,0.4)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                textAlign: 'center',
                zIndex: 50
            }}>
                <div style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
                    Vedic Chronology
                </div>
                <div style={{ color: 'white', fontFamily: 'monospace', fontSize: '20px', fontWeight: 900, letterSpacing: '2px' }}>
                    {String(time.ghati).padStart(2, '0')} : {String(time.pala).padStart(2, '0')} : {String(time.vipala).padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

const muhurtaNames = [
    "Rudra", "Ahi", "Mitra", "Pitri", "Vasu", "Varaha", "Visvedeva", "Vidhi (Abhijit)",
    "Sutamukhi", "Puruhuta", "Vahini", "Naktanakara", "Varuna", "Aryaman", "Bhaga",
    "Girisa", "Ajapada", "Ahir-Budhnya", "Pushya", "Aswini", "Yama", "Agni",
    "Vidhatr", "Kanda", "Aditi", "Jiva", "Visnu", "Dyumadgadyuti", "Samudra", "Brahma"
];

const getInterpretation = (mi, ghati, tithi, nak) => {
    const name = muhurtaNames[mi - 1] || "Unknown";
    let advice = "A neutral time for standard activities.";

    if (mi === 8) advice = "The highly auspicious Mid-day Peak. Success in most ventures is likely.";
    if (mi > 28) advice = "The sacred pre-dawn window. Ideal for spiritual practice and deep planning.";
    if (mi >= 20 && mi <= 22) advice = "Yama/Agni Muhurtas. Exercise caution in communications and avoid conflicts.";

    return {
        name,
        stage: mi <= 15 ? "Solar Ascendancy (Day)" : "Lunar Dominance (Night)",
        ghatiDesc: ghati < 30 ? "Day is Waxing towards Peak" : "Day is Waning towards Rest",
        advice
    };
};

const getChoghadiyaRuler = (name) => {
    const cleanName = name.trim().toLowerCase();
    if (cleanName.includes('amrit')) return 'Moon';
    if (cleanName.includes('shubh')) return 'Jupiter';
    if (cleanName.includes('labh')) return 'Mercury';
    if (cleanName.includes('char') || cleanName.includes('chanchal')) return 'Venus';
    if (cleanName.includes('udveg')) return 'Sun';
    if (cleanName.includes('rog')) return 'Mars';
    if (cleanName.includes('kaal')) return 'Saturn';
    return 'Unknown';
};

const getChoghadiyaColor = (name) => {
    const cleanName = name.trim().toLowerCase();
    if (cleanName.includes('amrit')) return '#10b981'; // emerald-500
    if (cleanName.includes('shubh')) return '#3b82f6'; // blue-500
    if (cleanName.includes('labh')) return '#a855f7'; // purple-500
    return '#cbd5e1';
};

export default function DailyPanchangViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    // Oracle State
    const [oracleQuestion, setOracleQuestion] = useState("");
    const [oracleResponse, setOracleResponse] = useState(null);
    const [oracleLoading, setOracleLoading] = useState(false);
    const [activeOracleCategory, setActiveOracleCategory] = useState("General");

    const handleDateChange = (daysToAdd) => {
        const currentDate = selectedDate ? new Date(selectedDate) : new Date();
        currentDate.setDate(currentDate.getDate() + daysToAdd);
        // Format to YYYY-MM-DD local time correctly
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
        // Reset oracle
        setOracleResponse(null);
        setOracleQuestion("");
    };

    const handleOracleSubmit = async (eOrQuestion) => {
        if (eOrQuestion?.preventDefault) eOrQuestion.preventDefault();

        const q = typeof eOrQuestion === 'string' ? eOrQuestion : oracleQuestion;
        if (!q.trim() || !data || !data.choghadiya) return;

        if (typeof eOrQuestion === 'string') {
            setOracleQuestion(q);
        }

        setOracleLoading(true);
        try {
            const res = await fetch('/api/panchang/choghadiya-oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q,
                    current_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    choghadiya_data: data.choghadiya
                })
            });
            if (!res.ok) throw new Error("Failed to consult Oracle");
            const result = await res.json();
            setOracleResponse(result);
        } catch (err) {
            console.error(err);
            setOracleResponse({ response: "The Oracle is currently silent. Try again later." });
        } finally {
            setOracleLoading(false);
            setOracleQuestion("");
        }
    };

    useEffect(() => {
        const loadPanchang = async () => {
            try {
                let lat = 19.0760, lon = 72.8777, tz = 5.5;
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    if (parsed.basic_details) {
                        lat = parsed.basic_details.lat || lat;
                        lon = parsed.basic_details.lon || lon;
                        tz = (new Date().getTimezoneOffset() / -60.0);
                    }
                }
                const res = await fetchDailyPanchang(lat, lon, tz, selectedDate);
                setData(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        loadPanchang();

        let interval;
        // Only auto-refresh if looking at today's panchang
        if (!selectedDate) {
            interval = setInterval(loadPanchang, 10000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [selectedDate]);

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', border: '8px solid rgba(255,255,255,0.05)', borderRadius: '50%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-8px', border: '8px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
            <p style={{ marginTop: '40px', color: '#d4af37', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px' }}>CALIBRATING...</p>
            <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
        </div>
    );

    if (error) return <div style={{ minHeight: '100vh', padding: '40px', color: 'red' }}>Error: {error}</div>;

    const interpretation = getInterpretation(
        data.vedic_time.muhurta_index,
        data.vedic_time.total_ghati
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#cbd5e1', fontFamily: 'serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
                <button
                    onClick={() => {
                        const element = document.getElementById('shubh-chaughadiya-muhurt-section');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        background: 'linear-gradient(135deg, rgba(230, 210, 33, 0.2) 0%, rgba(245, 200, 51, 0.2) 100%)',
                        color: 'rgba(230, 210, 33, 1)',
                        border: '1px solid rgba(230, 210, 33, 0.4)',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '18px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Click To Know Shubh Chaughadiya Muhurt (शुभ चौघड़िया मुहूर्त)
                </button>
                <button
                    onClick={() => {
                        const element = document.getElementById('auspicious-time-advisor-section');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'linear-gradient(135deg, rgba(230, 210, 33, 0.2) 0%, rgba(245, 200, 51, 0.2) 100%)',
                        color: 'rgba(230, 210, 33, 1)',
                        border: '1px solid rgba(230, 210, 33, 0.4)',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '18px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Click To Know Auspicious Time Advisor (शुभ समय परामर्श)
                </button>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start', paddingTop: '60px' }}>

                    <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
                        <div style={{ padding: '60px 20px', background: 'rgba(15,23,42,0.6)', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                            <h4 style={{ color: '#d4af37', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '10px' }}>Ujjain Royal Observatory</h4>
                            <h1 style={{ color: 'white', fontSize: '42px', fontWeight: 900, fontStyle: 'italic', marginBottom: '50px' }}>Vikramaditya Watch</h1>

                            <ProfessionalRoyaleClock time={data.vedic_time} />

                            <div style={{ marginTop: '60px', padding: '30px', background: 'rgba(212,175,55,0.05)', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.1)', textAlign: 'left' }}>
                                <div style={{ color: '#d4af37', fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '10px' }}>Cosmic Proclamation</div>
                                <div style={{ color: 'white', fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>Current: {interpretation.name} Muhurta</div>
                                <div style={{ fontSize: '20px', lineHeight: '1.6', color: 'rgba(241, 211, 36, 1)' }}>
                                    <p style={{ marginBottom: '8px' }}>We are presently in the <strong>{interpretation.stage}</strong> cycle. {interpretation.ghatiDesc}.</p>
                                    <p style={{ color: 'rgba(241, 211, 36, 1)', fontWeight: 700 }}>Divine Advice: {interpretation.advice}</p>
                                </div>
                            </div>
                        </div>


                        {/* New Educational Section */}
                        <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(30,41,59,0.3)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <div style={{ color: 'rgba(233, 216, 216, 1)', fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Divine Glossary</div>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: 'rgb(230, 221, 221)', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>What is a Muhurta?</div>
                                <div style={{ fontSize: '16px', color: 'rgba(212, 203, 73, 1)', lineHeight: '1.5' }}>A Muhurta is a unit of 48 minutes. There are exactly 30 Muhurtas in a Vedic day (sunrise to sunrise). Each Muhurta is ruled by a specific Deity and carries a unique energetic vibration.</div>
                            </div>
                            <div>
                                <div style={{ color: 'rgb(230, 221, 221)', fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>What does Ghati Progress mean?</div>
                                <div style={{ fontSize: '16px', color: 'rgba(212, 203, 73, 1)', lineHeight: '1.5' }}>A 'Ghati' is 24 minutes. The clock tracks 60 Ghatis per day. 'Progress' shows how far we have traveled since the last Sunrise—the ultimate anchor of Vedic time.</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <div style={{ fontSize: '22px', color: 'rgba(233, 209, 209, 1)', fontWeight: 900, textTransform: 'uppercase' }}>Current Muhurta</div>
                                <div style={{ fontSize: '32px', color: 'white', fontWeight: 900 }}>#{data.vedic_time.muhurta_index}</div>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '22px', color: 'rgba(233, 209, 209, 1)', fontWeight: 900, textTransform: 'uppercase' }}>Ghati Progress</div>
                                <div style={{ fontSize: '32px', color: '#d4af37', fontWeight: 900 }}>{data.vedic_time.total_ghati}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', padding: '50px', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                            <button onClick={() => handleDateChange(-1)} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontSize: '28px', cursor: 'pointer', transition: 'transform 0.2s', padding: '10px' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>◀</button>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ fontSize: '64px', color: '#d4af37', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{data.date}</h1>
                                <p style={{ fontSize: '24px', color: '#eec2c0ff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', margin: '5px 0 0 0' }}>
                                    {data.day}
                                </p>
                                {data.monthly_sankranti && (
                                    <div style={{ marginTop: '15px', color: '#29e018ff', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', background: 'rgba(212,175,55,0.1)', padding: '6px 15px', borderRadius: '20px', display: 'inline-block' }}>
                                        {data.monthly_sankranti.name} • {data.monthly_sankranti.date}, {data.monthly_sankranti.exact_time}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleDateChange(1)} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontSize: '28px', cursor: 'pointer', transition: 'transform 0.2s', padding: '10px' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>▶</button>
                        </div>
                        {data.is_adhik_maas && (
                            <div style={{ background: 'rgba(212,175,55,0.2)', color: '#d4af37', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Adhik Maas</div>
                        )}
                        {data.sankranti && (
                            <div style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px 25px', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.4)', textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>{data.sankranti.name}</div>
                                <div style={{ fontSize: '18px', color: '#fca5a5' }}>Transit at {data.sankranti.exact_time}</div>
                            </div>
                        )}
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px 40px', borderRadius: '30px', border: '1px solid rgba(255,191,0,0.1)', display: 'flex', gap: '40px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#f97316', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Sunrise</span>
                                <span style={{ fontSize: '20px', color: 'white', fontWeight: 900 }}>{data.sun_rise}</span>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '14px', color: 'rgba(243, 54, 29, 1)', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Sunset</span>
                                <span style={{ fontSize: '20px', color: 'white', fontWeight: 900 }}>{data.sun_set}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            { label: "Tithi", value: data.tithi.tithi_name, icon: "🌓", color: "#60a5fa" },
                            { label: "Nakshatra", value: data.nakshatra.nakshatra_name, icon: "🪐", color: "#a78bfa" },
                            { label: "Yoga", value: data.yoga.yoga_name, icon: "🌀", color: "#34d399" },
                            { label: "Karana", value: data.karana.karana_name, icon: "🛡️", color: "#fbbf24" }
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(30,41,59,0.4)', padding: '40px', borderRadius: '50px', border: `1px solid ${item.color}22` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                                    <span style={{ fontSize: '22px', color: 'hsla(0, 42%, 90%, 0.99)', fontWeight: 900, textTransform: 'uppercase' }}>{item.label}</span>
                                </div>
                                <h3 style={{ fontSize: '32px', color: item.color, fontWeight: 900, margin: 0, fontStyle: 'italic' }}>{item.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(52,211,153,0.3)' }}>
                            <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>Auspicious Hour</span>
                            <h2 style={{ fontSize: '42px', color: 'white', fontWeight: 900, margin: '10px 0' }}>Abhijit Muhurta</h2>
                            <p style={{ fontSize: '32px', color: '#10b981', fontWeight: 900 }}>{data.muhurtas.abhijit.start} - {data.muhurtas.abhijit.end}</p>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', padding: '40px', borderRadius: '50px', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <span style={{ fontSize: '10px', color: '#f87171', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>Inauspicious Rahu</span>
                            <h2 style={{ fontSize: '42px', color: 'white', fontWeight: 900, margin: '10px 0' }}>Rahu Kaal</h2>
                            <p style={{ fontSize: '32px', color: '#ef4444', fontWeight: 900 }}>{data.muhurtas.rahu_kaal.start} - {data.muhurtas.rahu_kaal.end}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                const popupSettings = 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no';
                                window.open('/?dosha=true', 'DoshaDashboard', popupSettings);
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #6b21a8 0%, #3b0764 100%)',
                                color: 'white',
                                border: '1px solid rgba(168, 85, 247, 0.5)',
                                padding: '15px 30px',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 25px rgba(107, 33, 168, 0.5)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🧿</span> Advanced Doshas & Exceptions
                        </button>
                    </div>

                    {data.choghadiya && (
                        <>
                            {/* Shubh Chaughadiya Muhurt Card */}
                            <div id="shubh-chaughadiya-muhurt-section" style={{
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                borderRadius: '24px',
                                padding: '30px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                border: '1px solid #e2e8f0',
                                marginTop: '30px',
                                textAlign: 'left'
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        backgroundColor: '#fef3c7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#d97706',
                                        fontSize: '20px'
                                    }}>
                                        ☆
                                    </div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#0f172a', fontFamily: 'sans-serif' }}>
                                        Shubh Chaughadiya Muhurt for <span style={{ color: '#d97706' }}>{data.day}</span>
                                    </h2>
                                </div>

                                <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 1)', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                                    Most auspicious periods for today (<span style={{ color: '#d97706' }}>{data.day}</span>):
                                </p>

                                {/* Table Container */}
                                <div style={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    marginBottom: '25px'
                                }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                                <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '14px', fontWeight: '800', color: '#040207ff', letterSpacing: '1px', textTransform: 'uppercase' }}>Time</th>
                                                <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '14px', fontWeight: '800', color: '#000000ff', letterSpacing: '1px', textTransform: 'uppercase' }}>Type</th>
                                                <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '14px', fontWeight: '800', color: '#040207ff', letterSpacing: '1px', textTransform: 'uppercase' }}>Ruler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.choghadiya.day
                                                .filter(c => ['amrit', 'shubh', 'labh'].includes(c.name.trim().toLowerCase()))
                                                .map((c, idx, arr) => {
                                                    const ruler = getChoghadiyaRuler(c.name);
                                                    const textColor = getChoghadiyaColor(c.name);
                                                    return (
                                                        <tr key={idx} style={{ borderBottom: idx < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                                            <td style={{ padding: '16px 20px', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                                                                {c.start} - {c.end}
                                                            </td>
                                                            <td style={{ padding: '16px 20px', fontSize: '16px', fontWeight: '700', color: textColor }}>
                                                                {c.name}
                                                            </td>
                                                            <td style={{ padding: '16px 20px', fontSize: '16px', fontWeight: '600', color: 'hsla(241, 85%, 44%, 1.00)' }}>
                                                                {ruler}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* About Box */}
                                <div style={{
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: '1px solid #dbeafe',
                                    fontFamily: 'sans-serif'
                                }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', margin: '0 0 10px 0' }}>
                                        About These Auspicious Periods:
                                    </h4>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '16px', color: '#1e293b' }}>
                                        <li style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span>
                                            <span><strong>Amrit</strong> - Most auspicious time ruled by Moon, excellent for all activities</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>•</span>
                                            <span><strong>Shubh</strong> - Auspicious time ruled by Jupiter, ideal for religious ceremonies</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '8px' }}>
                                            <span style={{ color: '#a855f7', fontWeight: 'bold' }}>•</span>
                                            <span><strong>Labh</strong> - Auspicious time ruled by Mercury, good for business and education</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <h3 style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '20px', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Choghadiya (Day & Night)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px' }}>Day Choghadiya</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {data.choghadiya.day.map((c, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', borderLeft: `4px solid ${c.quality === 'Good' ? '#34d399' : c.quality === 'Bad' ? '#f87171' : '#fbbf24'}`, color: c.quality === 'Good' ? '#34d399' : c.quality === 'Bad' ? '#f87171' : '#fbbf24' }}>
                                                    <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{c.name}</span>
                                                    <span style={{ fontSize: '18px', opacity: 0.9 }}>{c.start} - {c.end}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px' }}>Night Choghadiya</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {data.choghadiya.night.map((c, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', borderLeft: `4px solid ${c.quality === 'Good' ? '#34d399' : c.quality === 'Bad' ? '#f87171' : '#fbbf24'}`, color: c.quality === 'Good' ? '#34d399' : c.quality === 'Bad' ? '#f87171' : '#fbbf24' }}>
                                                    <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{c.name}</span>
                                                    <span style={{ fontSize: '18px', opacity: 0.9 }}>{c.start} - {c.end}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Choghadiya Oracle Section */}
                                <div id="auspicious-time-advisor-section" style={{ marginTop: '30px', background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(167,139,250,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                    <h4 style={{ color: 'rgba(230, 210, 33, 1)', textAlign: 'center', marginBottom: '15px', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900 }}>Auspicious Time Advisor (शुभ समय परामर्श)</h4>
                                    <p style={{ color: 'rgba(245, 200, 51, 1)', textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>Ask a question about travel, business, health, or ceremonies. The Oracle will look at the *currently active* Choghadiya and guide you.</p>

                                    <form onSubmit={handleOracleSubmit} style={{ display: 'flex', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
                                        <input
                                            type="text"
                                            value={oracleQuestion}
                                            onChange={(e) => setOracleQuestion(e.target.value)}
                                            placeholder="e.g. Is this a good time to travel?"
                                            style={{ flex: 1, padding: '15px 25px', borderRadius: '30px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(167,139,250,0.3)', color: 'hsla(0, 45%, 86%, 1.00)', fontSize: '18px', outline: 'none' }}
                                            disabled={oracleLoading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={oracleLoading || !oracleQuestion.trim()}
                                            style={{ padding: '15px 30px', borderRadius: '30px', background: oracleLoading ? '#64748b' : '#8b5cf6', color: 'white', border: 'none', fontWeight: 900, textTransform: 'uppercase', cursor: oracleLoading ? 'not-allowed' : 'pointer', transition: 'background 0.3s', fontSize: '16px' }}
                                        >
                                            {oracleLoading ? "Consulting..." : "Ask"}
                                        </button>
                                    </form>

                                    {oracleResponse && (
                                        <div style={{ marginTop: '25px', padding: '25px', borderRadius: '20px', background: 'rgba(0,0,0,0.4)', borderLeft: `5px solid ${oracleResponse.quality === 'Inauspicious' ? '#ef4444' : oracleResponse.quality === 'Extremely Auspicious' || oracleResponse.quality === 'Auspicious' ? '#10b981' : '#f59e0b'}`, color: 'white', maxWidth: '600px', margin: '25px auto 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '24px' }}>🔮</span>
                                                <span style={{ fontWeight: 900, letterSpacing: '1px', color: '#e2e8f0', textTransform: 'uppercase', fontSize: '14px' }}>Oracle Insight</span>
                                            </div>
                                            <div style={{ lineHeight: '1.6', color: '#cbd5e1', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                                {oracleResponse.response}
                                            </div>
                                        </div>
                                    )}

                                    {/* Category Tabs and Questions Grid */}
                                    <div style={{ marginTop: '30px' }}>
                                        {/* Category Buttons */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                                            {[
                                                { id: "General", label: "General" },
                                                { id: "Night", label: "🌙 Night" },
                                                { id: "Business", label: "💼 Business" },
                                                { id: "Marriage", label: "💍 Marriage" },
                                                { id: "Travel", label: "✈️ Travel" },
                                                { id: "Health", label: "🏥 Health" },
                                                { id: "Property", label: "🏠 Property" },
                                                { id: "Spiritual", label: "🕉️ Spiritual" },
                                                { id: "AI", label: "🤖 AI Assistant" }
                                            ].map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveOracleCategory(cat.id)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        borderRadius: '20px',
                                                        border: `1px solid ${activeOracleCategory === cat.id ? '#a78bfa' : 'rgba(167,139,250,0.3)'}`,
                                                        background: activeOracleCategory === cat.id ? 'rgba(167,139,250,0.2)' : 'transparent',
                                                        color: activeOracleCategory === cat.id ? 'rgba(243, 189, 189, 1)' : 'rgba(238, 199, 23, 1)',
                                                        fontSize: '18px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        fontWeight: activeOracleCategory === cat.id ? 700 : 400
                                                    }}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Question Chips */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                            {(() => {
                                                const questions = {
                                                    "General": [
                                                        "What is today's Day Chaughadiya?", "Which Chaughadiya is running right now during the day?", "Is the current Day Chaughadiya auspicious?", "What time does today's Day Chaughadiya start and end?", "Which Day Chaughadiya is best for starting new work?", "Which Day Chaughadiya should be avoided?", "How many Day Chaughadiya periods are there?", "What is the sequence of today's Day Chaughadiya?", "What is the ruling planet of the current Day Chaughadiya?", "Which Day Chaughadiya is most favorable?"
                                                    ],
                                                    "Night": [
                                                        "What is tonight's Night Chaughadiya?", "Which Night Chaughadiya is currently active?", "Is the present Night Chaughadiya auspicious?", "What are today's Night Chaughadiya timings?", "Which Night Chaughadiya is best for travel?", "Which Night Chaughadiya should be avoided?", "How many Night Chaughadiya periods are there?", "Which Night Chaughadiya is considered lucky?", "What planet rules the current Night Chaughadiya?", "What time does the next Night Chaughadiya begin?"
                                                    ],
                                                    "Business": [
                                                        "Is this a good Chaughadiya to start a business?", "Can I sign a contract during this Chaughadiya?", "Is Labh Chaughadiya good for investments?", "Is Amrit Chaughadiya suitable for launching a new venture?", "Should I avoid Rog Chaughadiya for business meetings?", "Which Chaughadiya is best for financial transactions?", "Can I open a new bank account during this Chaughadiya?", "Is this Chaughadiya favorable for stock market investments?", "Which Chaughadiya is ideal for property registration?", "Can I initiate legal proceedings during this period?"
                                                    ],
                                                    "Marriage": [
                                                        "Is today's Chaughadiya favorable for engagement?", "Can marriage talks begin during this Chaughadiya?", "Which Chaughadiya is best for proposing marriage?", "Is Amrit Chaughadiya suitable for wedding ceremonies?", "Should Rog Chaughadiya be avoided for relationship discussions?", "Can I meet my prospective partner during this Chaughadiya?", "Is this Chaughadiya favorable for family meetings?", "Which Chaughadiya supports harmony and love?", "Is Labh Chaughadiya good for matrimonial alliances?", "Can I finalize wedding dates during this period?"
                                                    ],
                                                    "Travel": [
                                                        "Is this Chaughadiya good for travel?", "Which Chaughadiya is best to start a journey?", "Should I avoid Kal Chaughadiya before traveling?", "Is Amrit Chaughadiya favorable for international travel?", "Can I begin a pilgrimage during this Chaughadiya?", "Which Chaughadiya supports safe journeys?", "Is Labh Chaughadiya suitable for business travel?", "Can I book tickets during this Chaughadiya?", "Is Rog Chaughadiya unfavorable for travel?", "What is the next auspicious travel Chaughadiya?"
                                                    ],
                                                    "Health": [
                                                        "Is this Chaughadiya suitable for surgery?", "Can I start medical treatment now?", "Which Chaughadiya is best for taking medicines?", "Should surgeries be avoided during Rog Chaughadiya?", "Is Amrit Chaughadiya favorable for healing?", "Can I schedule a doctor's appointment now?", "Which Chaughadiya is suitable for therapy sessions?", "Is this a good time for health check-ups?", "Should I avoid Kal Chaughadiya for medical procedures?", "What is the next favorable Chaughadiya for treatment?"
                                                    ],
                                                    "Property": [
                                                        "Is this Chaughadiya good for buying property?", "Can I register land during this Chaughadiya?", "Which Chaughadiya is best for Griha Pravesh?", "Is Amrit Chaughadiya suitable for housewarming ceremonies?", "Can I sign property documents now?", "Should Rog Chaughadiya be avoided for property matters?", "Which Chaughadiya supports construction work?", "Is Labh Chaughadiya favorable for real estate investments?", "Can I finalize home loans during this period?", "What is the next auspicious Chaughadiya for property purchase?"
                                                    ],
                                                    "Spiritual": [
                                                        "Is this Chaughadiya good for mantra initiation?", "Can I begin a spiritual practice now?", "Which Chaughadiya is best for meditation?", "Is Amrit Chaughadiya suitable for worship?", "Can I perform a Havan during this Chaughadiya?", "Which Chaughadiya is ideal for pilgrimage?", "Is this period favorable for charity?", "Can I start a fast during this Chaughadiya?", "Which Chaughadiya supports spiritual growth?", "Is Labh Chaughadiya auspicious for religious ceremonies?"
                                                    ],
                                                    "AI": [
                                                        "Which Chaughadiya is active right now in my city?", "What is the next Amrit Chaughadiya today?", "Notify me when Labh Chaughadiya begins.", "Is this Chaughadiya favorable for my Kundali?", "Which Chaughadiya aligns with my Dasha?", "Should I postpone my work until the next auspicious Chaughadiya?", "Which Chaughadiya is best according to my Moon sign?", "How does today's Chaughadiya affect my career?", "Is this Chaughadiya favorable for marriage activities in my chart?", "Give me personalized Chaughadiya recommendations based on my horoscope."
                                                    ]
                                                };

                                                return questions[activeOracleCategory].map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.preventDefault(); handleOracleSubmit(q); }}
                                                        disabled={oracleLoading}
                                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '10px 15px', color: 'rgba(241, 201, 22, 1)', fontSize: '18px', cursor: oracleLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                                                        onMouseOver={(e) => { if (!oracleLoading) e.target.style.background = 'rgba(167,139,250,0.2)' }}
                                                        onMouseOut={(e) => { if (!oracleLoading) e.target.style.background = 'rgba(255,255,255,0.05)' }}
                                                    >
                                                        {q}
                                                    </button>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*  */}

                            <div style={{ textAlign: 'center', padding: '40px 0 20px 0' }}>



                            </div>

                            <div style={{ textAlign: 'center', padding: '20px 0 60px 0' }}>
                                <button onClick={() => window.close()} style={{ padding: '24px 80px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '5px' }}>Return to Workstation</button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>

    );
};

