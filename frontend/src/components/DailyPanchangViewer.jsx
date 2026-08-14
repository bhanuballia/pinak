import React, { useState, useEffect } from 'react';
import { fetchDailyPanchang } from '../services/api';

const ProfessionalRoyaleClock = ({ time }) => {
    const ghatiRotation = (time.total_ghati % 60) * 6;
    const muhurtaRotation = (time.total_ghati / 2 % 30) * 12;

    const symptoms = ["♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"];
    const rashis = ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];

    return (
        <div style={{
            position: 'relative',
            width: '480px',
            height: '480px',
            margin: '0 auto 50px',
            userSelect: 'none'
        }}>
            {/* 3D Rose-Gold Brass Case */}
            <div style={{
                position: 'absolute',
                inset: '-20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fecdd3 0%, #ffe4e6 45%, #fda4af 100%)',
                boxShadow: '0 20px 50px rgba(136, 19, 55, 0.15), inset 0 2px 5px rgba(255,255,255,0.8)',
                border: '4px solid #be123c'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '1px solid rgba(136, 19, 55, 0.2)',
                    boxShadow: 'inset 0 0 10px rgba(136, 19, 55, 0.1)'
                }}></div>
            </div>

            {/* Main Dial Surface */}
            <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(136, 19, 55, 0.1))' }}>
                <defs>
                    <radialGradient id="royalDial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="70%" stopColor="#fff1f2" />
                        <stop offset="100%" stopColor="#ffe4e6" />
                    </radialGradient>
                    <linearGradient id="solidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#be123c" />
                        <stop offset="45%" stopColor="#e11d48" />
                        <stop offset="100%" stopColor="#881337" />
                    </linearGradient>
                </defs>

                <circle cx="200" cy="200" r="195" fill="url(#royalDial)" stroke="#fecdd3" strokeWidth="2" />

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
                            stroke={i % 5 === 0 ? "#be123c" : "#fecdd3"}
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
                                fill="#881337"
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
                                fill="#be123c"
                                fontSize="28"
                            >
                                {symptoms[i]}
                            </text>
                        </g>
                    );
                })}

                <circle cx="200" cy="200" r="30" fill="#fff1f2" stroke="#be123c" strokeWidth="2" />
                <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fill="#881337" fontSize="20" fontWeight="bold">ॐ</text>

                <g style={{ transform: `rotate(${muhurtaRotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <path d="M 192,200 L 200,60 L 208,200 Z" fill="url(#solidGold)" />
                    <circle cx="200" cy="200" r="10" fill="#be123c" />
                </g>

                <g style={{ transform: `rotate(${ghatiRotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 0.5s ease-out' }}>
                    <path d="M 197,200 L 200,45 L 203,200 Z" fill="#e11d48" stroke="#be123c" strokeWidth="0.5" />
                    <circle cx="200" cy="200" r="6" fill="#e11d48" />
                </g>
            </svg>

            <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '240px',
                background: '#ffffff',
                padding: '12px 20px',
                borderRadius: '16px',
                border: '1px solid #fecdd3',
                boxShadow: '0 10px 25px rgba(136, 19, 55, 0.1)',
                textAlign: 'center',
                zIndex: 50
            }}>
                <div style={{ fontSize: '12px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>
                    Vedic Chronology
                </div>
                <div style={{ color: '#881337', fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, letterSpacing: '2px' }}>
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
    if (cleanName.includes('amrit')) return '#15803d'; // green-700
    if (cleanName.includes('shubh')) return '#052285ff'; // deep navy
    if (cleanName.includes('labh')) return '#be123c'; // dark rose-700
    return '#475569';
};

export default function DailyPanchangViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [transitForecast, setTransitForecast] = useState([]);
    const [forecastLoading, setForecastLoading] = useState(false);

    // Oracle State
    const [oracleQuestion, setOracleQuestion] = useState("");
    const [oracleResponse, setOracleResponse] = useState(null);
    const [oracleLoading, setOracleLoading] = useState(false);
    const [activeOracleCategory, setActiveOracleCategory] = useState("General");

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

    const handleDateChange = (daysToAdd) => {
        const currentDate = selectedDate ? new Date(selectedDate) : new Date();
        currentDate.setDate(currentDate.getDate() + daysToAdd);
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
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

    const loadTransitForecast = async (dateVal) => {
        setForecastLoading(true);
        try {
            const queryParam = dateVal ? `?date=${dateVal}` : '';
            const response = await fetch(`/api/transit/predictions_advanced${queryParam}`);
            const json = await response.json();
            if (json.success) {
                setTransitForecast(json.forecast);
            }
        } catch (err) {
            console.error("Failed to load transit forecast:", err);
        } finally {
            setForecastLoading(false);
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
        loadTransitForecast(selectedDate);

        let interval;
        if (!selectedDate) {
            interval = setInterval(loadPanchang, 10000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [selectedDate]);

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', border: `8px solid ${theme.borderColor}`, borderRadius: '50%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-8px', border: '8px solid #e11d48', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
            <p style={{ marginTop: '40px', color: '#881337', fontFamily: 'serif', letterSpacing: '4px', fontStyle: 'italic', fontWeight: 900, fontSize: '24px' }}>CALIBRATING PANCHANG...</p>
            <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
        </div>
    );

    if (error) return <div style={{ minHeight: '100vh', padding: '40px', color: '#be123c', backgroundColor: theme.bg, fontFamily: 'serif', textAlign: 'center', fontSize: '24px', fontWeight: 900 }}>Error: {error}</div>;

    const interpretation = getInterpretation(
        data.vedic_time.muhurta_index,
        data.vedic_time.total_ghati
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'serif', padding: '40px 20px' }}>
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
                        background: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
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
                        background: '#e11d48',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 10,
                        boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Click To Know Auspicious Time Advisor (शुभ समय परामर्श)
                </button>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'flex-start', paddingTop: '60px' }}>

                    <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
                        <div style={{ padding: '50px 20px', background: theme.cardBg, borderRadius: '40px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                            <h4 style={{ color: '#be123c', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>Ujjain Royal Observatory</h4>
                            <h1 style={{ color: '#881337', fontSize: '42px', fontWeight: 900, fontStyle: 'italic', marginBottom: '40px' }}>Vikramaditya Watch</h1>

                            <ProfessionalRoyaleClock time={data.vedic_time} />

                            <div style={{ marginTop: '50px', padding: '30px', background: '#fff1f2', borderRadius: '30px', border: `1px solid ${theme.borderColor}`, textAlign: 'left' }}>
                                <div style={{ color: '#be123c', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '10px' }}>Cosmic Proclamation</div>
                                <div style={{ color: '#881337', fontSize: '22px', fontWeight: 900, marginBottom: '10px' }}>Current: {interpretation.name} Muhurta</div>
                                <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#1e293b' }}>
                                    <p style={{ marginBottom: '8px' }}>We are presently in the <strong>{interpretation.stage}</strong> cycle. {interpretation.ghatiDesc}.</p>
                                    <p style={{ color: '#be123c', fontWeight: 900 }}>Divine Advice: {interpretation.advice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Educational Glossary Section */}
                        <div style={{ marginTop: '30px', padding: '30px', background: theme.cardBg, borderRadius: '30px', border: `1px solid ${theme.borderColor}`, textAlign: 'left', boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                            <div style={{ color: '#881337', fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Divine Glossary</div>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: '#be123c', fontSize: '18px', fontWeight: 900, marginBottom: '4px' }}>What is a Muhurta?</div>
                                <div style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.5' }}>A Muhurta is a unit of 48 minutes. There are exactly 30 Muhurtas in a Vedic day (sunrise to sunrise). Each Muhurta is ruled by a specific Deity and carries a unique energetic vibration.</div>
                            </div>
                            <div>
                                <div style={{ color: '#be123c', fontSize: '18px', fontWeight: 900, marginBottom: '4px' }}>What does Ghati Progress mean?</div>
                                <div style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.5' }}>A 'Ghati' is 24 minutes. The clock tracks 60 Ghatis per day. 'Progress' shows how far we have traveled since the last Sunrise—the ultimate anchor of Vedic time.</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px', paddingTop: '30px', borderTop: `1px solid ${theme.borderColor}` }}>
                            <div>
                                <div style={{ fontSize: '16px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase' }}>Current Muhurta</div>
                                <div style={{ fontSize: '32px', color: '#881337', fontWeight: 900 }}>#{data.vedic_time.muhurta_index}</div>
                            </div>
                            <div style={{ borderLeft: `1px solid ${theme.borderColor}` }}>
                                <div style={{ fontSize: '16px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase' }}>Ghati Progress</div>
                                <div style={{ fontSize: '32px', color: '#881337', fontWeight: 900 }}>{data.vedic_time.total_ghati}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '40px' }}>
                    <div style={{ background: theme.headerGradient, padding: '45px 35px', borderRadius: '40px', border: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                            <button onClick={() => handleDateChange(-1)} style={{ background: 'transparent', border: 'none', color: '#881337', fontSize: '32px', cursor: 'pointer', transition: 'transform 0.2s', padding: '10px' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>◀</button>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ fontSize: '56px', color: '#881337', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>{data.date}</h1>
                                <p style={{ fontSize: '22px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', margin: '5px 0 0 0' }}>
                                    {data.day}
                                </p>
                                {data.monthly_sankranti && (
                                    <div style={{ marginTop: '15px', color: '#15803d', fontSize: '18px', fontWeight: 900, letterSpacing: '1px', background: '#f0fdf4', padding: '6px 18px', borderRadius: '20px', display: 'inline-block', border: '1px solid #bbf7d0' }}>
                                        {data.monthly_sankranti.name} • {data.monthly_sankranti.date}, {data.monthly_sankranti.exact_time}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleDateChange(1)} style={{ background: 'transparent', border: 'none', color: '#881337', fontSize: '32px', cursor: 'pointer', transition: 'transform 0.2s', padding: '10px' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>▶</button>
                        </div>
                        {data.is_adhik_maas && (
                            <div style={{ background: '#ffe4e6', color: '#881337', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', border: `1px solid ${theme.borderColor}` }}>Adhik Maas</div>
                        )}
                        {data.sankranti && (
                            <div style={{ background: '#ffe4e6', color: '#be123c', padding: '12px 25px', borderRadius: '20px', border: `1px solid ${theme.borderColor}`, textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>{data.sankranti.name}</div>
                                <div style={{ fontSize: '16px', color: '#881337', fontWeight: 700 }}>Transit at {data.sankranti.exact_time}</div>
                            </div>
                        )}
                        <div style={{ background: '#ffffff', padding: '20px 40px', borderRadius: '30px', border: `1px solid ${theme.borderColor}`, display: 'flex', gap: '40px', boxShadow: '0 4px 15px rgba(136, 19, 55, 0.05)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Sunrise</span>
                                <span style={{ fontSize: '22px', color: '#881337', fontWeight: 900 }}>{data.sun_rise}</span>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '14px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>Sunset</span>
                                <span style={{ fontSize: '22px', color: '#881337', fontWeight: 900 }}>{data.sun_set}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {[
                            { label: "Tithi", value: data.tithi.tithi_name, icon: "🌓", color: "#881337" },
                            { label: "Nakshatra", value: data.nakshatra.nakshatra_name, icon: "🪐", color: "#052285ff" },
                            { label: "Yoga", value: data.yoga.yoga_name, icon: "🌀", color: "rgba(180, 93, 12, 1)" },
                            { label: "Karana", value: data.karana.karana_name, icon: "🛡️", color: "#be123c" }
                        ].map((item, i) => (
                            <div key={i} style={{ background: theme.cardBg, padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                                    <span style={{ fontSize: '18px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase' }}>{item.label}</span>
                                </div>
                                <h3 style={{ fontSize: '28px', color: item.color, fontWeight: 900, margin: 0, fontStyle: 'italic' }}>{item.value}</h3>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ background: '#f0fdf4', padding: '35px', borderRadius: '35px', border: '1px solid #bbf7d0', boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                            <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>Auspicious Hour</span>
                            <h2 style={{ fontSize: '32px', color: '#14532d', fontWeight: 900, margin: '10px 0' }}>Abhijit Muhurta</h2>
                            <p style={{ fontSize: '28px', color: '#15803d', fontWeight: 900, margin: 0 }}>{data.muhurtas.abhijit.start} - {data.muhurtas.abhijit.end}</p>
                        </div>
                        <div style={{ background: '#fff1f2', padding: '35px', borderRadius: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                            <span style={{ fontSize: '12px', color: '#be123c', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>Inauspicious Rahu</span>
                            <h2 style={{ fontSize: '32px', color: '#881337', fontWeight: 900, margin: '10px 0' }}>Rahu Kaal</h2>
                            <p style={{ fontSize: '28px', color: '#be123c', fontWeight: 900, margin: 0 }}>{data.muhurtas.rahu_kaal.start} - {data.muhurtas.rahu_kaal.end}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => {
                                const popupSettings = 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no';
                                window.open('/?dosha=true', 'DoshaDashboard', popupSettings);
                            }}
                            style={{
                                background: '#e11d48',
                                color: '#ffffff',
                                border: 'none',
                                padding: '16px 36px',
                                borderRadius: '50px',
                                fontSize: '16px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>🧿</span> Advanced Doshas & Exceptions
                        </button>
                    </div>

                    {data.choghadiya && (
                        <>
                            {/* Shubh Chaughadiya Muhurt Card */}
                            <div id="shubh-chaughadiya-muhurt-section" style={{
                                backgroundColor: theme.cardBg,
                                color: theme.text,
                                borderRadius: '35px',
                                padding: '40px',
                                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                                border: `1px solid ${theme.borderColor}`,
                                marginTop: '30px',
                                textAlign: 'left'
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '14px',
                                        backgroundColor: '#ffe4e6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#be123c',
                                        fontSize: '22px',
                                        fontWeight: 900
                                    }}>
                                        ☆
                                    </div>
                                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#881337', fontFamily: 'serif' }}>
                                        Shubh Chaughadiya Muhurt for <span style={{ color: '#be123c' }}>{data.day}</span>
                                    </h2>
                                </div>

                                <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px', fontFamily: 'serif' }}>
                                    Most auspicious periods for today (<span style={{ color: '#be123c', fontWeight: 900 }}>{data.day}</span>):
                                </p>

                                {/* Table Container */}
                                <div style={{
                                    border: `1px solid ${theme.borderColor}`,
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    marginBottom: '25px'
                                }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'serif' }}>
                                        <thead>
                                            <tr style={{ borderBottom: `1px solid ${theme.borderColor}`, backgroundColor: '#ffe4e6' }}>
                                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '14px', fontWeight: '900', color: '#881337', letterSpacing: '1px', textTransform: 'uppercase' }}>Time</th>
                                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '14px', fontWeight: '900', color: '#881337', letterSpacing: '1px', textTransform: 'uppercase' }}>Type</th>
                                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '14px', fontWeight: '900', color: '#881337', letterSpacing: '1px', textTransform: 'uppercase' }}>Ruler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.choghadiya.day
                                                .filter(c => ['amrit', 'shubh', 'labh'].includes(c.name.trim().toLowerCase()))
                                                .map((c, idx, arr) => {
                                                    const ruler = getChoghadiyaRuler(c.name);
                                                    const textColor = getChoghadiyaColor(c.name);
                                                    return (
                                                        <tr key={idx} style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${theme.borderColor}` : 'none' }}>
                                                            <td style={{ padding: '16px 20px', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                                                {c.start} - {c.end}
                                                            </td>
                                                            <td style={{ padding: '16px 20px', fontSize: '18px', fontWeight: '900', color: textColor }}>
                                                                {c.name}
                                                            </td>
                                                            <td style={{ padding: '16px 20px', fontSize: '18px', fontWeight: '700', color: '#052285ff' }}>
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
                                    backgroundColor: '#fff1f2',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    border: `1px solid ${theme.borderColor}`,
                                    fontFamily: 'serif'
                                }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#881337', margin: '0 0 12px 0' }}>
                                        About These Auspicious Periods:
                                    </h4>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '17px', color: '#1e293b' }}>
                                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#15803d', fontWeight: '900' }}>•</span>
                                            <span><strong>Amrit</strong> - Most auspicious time ruled by Moon, excellent for all activities</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#052285ff', fontWeight: '900' }}>•</span>
                                            <span><strong>Shubh</strong> - Auspicious time ruled by Jupiter, ideal for religious ceremonies</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ color: '#be123c', fontWeight: '900' }}>•</span>
                                            <span><strong>Labh</strong> - Auspicious time ruled by Mercury, good for business and education</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <h3 style={{ color: '#881337', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '24px', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>Choghadiya (Day & Night)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    <div style={{ background: theme.cardBg, borderRadius: '35px', padding: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                        <h4 style={{ color: '#881337', textAlign: 'center', marginBottom: '20px', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>Day Choghadiya</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {data.choghadiya.day.map((c, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', background: c.quality === 'Good' ? '#f0fdf4' : c.quality === 'Bad' ? '#fff1f2' : '#fefce8', borderRadius: '14px', borderLeft: `5px solid ${c.quality === 'Good' ? '#15803d' : c.quality === 'Bad' ? '#be123c' : '#854d0e'}`, border: `1px solid ${theme.borderColor}` }}>
                                                    <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: c.quality === 'Good' ? '#15803d' : c.quality === 'Bad' ? '#be123c' : '#854d0e', fontSize: '16px' }}>{c.name}</span>
                                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{c.start} - {c.end}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: theme.cardBg, borderRadius: '35px', padding: '35px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                        <h4 style={{ color: '#881337', textAlign: 'center', marginBottom: '20px', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>Night Choghadiya</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {data.choghadiya.night.map((c, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', background: c.quality === 'Good' ? '#f0fdf4' : c.quality === 'Bad' ? '#fff1f2' : '#fefce8', borderRadius: '14px', borderLeft: `5px solid ${c.quality === 'Good' ? '#15803d' : c.quality === 'Bad' ? '#be123c' : '#854d0e'}`, border: `1px solid ${theme.borderColor}` }}>
                                                    <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: c.quality === 'Good' ? '#15803d' : c.quality === 'Bad' ? '#be123c' : '#854d0e', fontSize: '16px' }}>{c.name}</span>
                                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{c.start} - {c.end}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Choghadiya Oracle Section */}
                                <div id="auspicious-time-advisor-section" style={{ marginTop: '40px', background: theme.cardBg, borderRadius: '35px', padding: '40px', border: `1px solid ${theme.borderColor}`, boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)' }}>
                                    <h4 style={{ color: '#881337', textAlign: 'center', marginBottom: '15px', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 900 }}>Auspicious Time Advisor (शुभ समय परामर्श)</h4>
                                    <p style={{ color: '#be123c', textAlign: 'center', fontSize: '18px', marginBottom: '25px' }}>Ask a question about travel, business, health, or ceremonies. The Oracle will look at the *currently active* Choghadiya and guide you.</p>

                                    <form onSubmit={handleOracleSubmit} style={{ display: 'flex', gap: '15px', maxWidth: '650px', margin: '0 auto' }}>
                                        <input
                                            type="text"
                                            value={oracleQuestion}
                                            onChange={(e) => setOracleQuestion(e.target.value)}
                                            placeholder="e.g. Is this a good time to travel?"
                                            style={{ flex: 1, padding: '16px 25px', borderRadius: '30px', background: '#fff1f2', border: `1px solid ${theme.borderColor}`, color: '#1e293b', fontSize: '18px', outline: 'none', fontWeight: 700 }}
                                            disabled={oracleLoading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={oracleLoading || !oracleQuestion.trim()}
                                            style={{ padding: '16px 32px', borderRadius: '30px', background: oracleLoading ? '#cbd5e1' : '#e11d48', color: 'white', border: 'none', fontWeight: 900, textTransform: 'uppercase', cursor: oracleLoading ? 'not-allowed' : 'pointer', transition: 'background 0.3s', fontSize: '16px', boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)' }}
                                        >
                                            {oracleLoading ? "Consulting..." : "Ask"}
                                        </button>
                                    </form>

                                    {oracleResponse && (
                                        <div style={{ marginTop: '25px', padding: '25px', borderRadius: '25px', background: '#fff1f2', borderLeft: `6px solid ${oracleResponse.quality === 'Inauspicious' ? '#be123c' : oracleResponse.quality === 'Extremely Auspicious' || oracleResponse.quality === 'Auspicious' ? '#15803d' : '#854d0e'}`, border: `1px solid ${theme.borderColor}`, color: '#1e293b', maxWidth: '650px', margin: '25px auto 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '24px' }}>🔮</span>
                                                <span style={{ fontWeight: 900, letterSpacing: '1px', color: '#881337', textTransform: 'uppercase', fontSize: '16px' }}>Oracle Insight</span>
                                            </div>
                                            <div style={{ lineHeight: '1.6', color: '#1e293b', fontSize: '18px', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                                                {oracleResponse.response}
                                            </div>
                                        </div>
                                    )}

                                    {/* Category Tabs and Questions Grid */}
                                    <div style={{ marginTop: '35px' }}>
                                        {/* Category Buttons */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '25px' }}>
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
                                                        padding: '10px 20px',
                                                        borderRadius: '20px',
                                                        border: `1px solid ${activeOracleCategory === cat.id ? '#be123c' : theme.borderColor}`,
                                                        background: activeOracleCategory === cat.id ? '#e11d48' : '#ffffff',
                                                        color: activeOracleCategory === cat.id ? '#ffffff' : '#881337',
                                                        fontSize: '16px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        fontWeight: 900
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
                                                        style={{ background: '#fff1f2', border: `1px solid ${theme.borderColor}`, borderRadius: '15px', padding: '10px 16px', color: '#881337', fontSize: '16px', cursor: oracleLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', textAlign: 'left', fontWeight: 700 }}
                                                        onMouseOver={(e) => { if (!oracleLoading) { e.target.style.background = '#ffe4e6'; e.target.style.color = '#be123c'; } }}
                                                        onMouseOut={(e) => { if (!oracleLoading) { e.target.style.background = '#fff1f2'; e.target.style.color = '#881337'; } }}
                                                    >
                                                        {q}
                                                    </button>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Transit Forecast Section */}
                            <div style={{ marginTop: '40px', padding: '40px', background: theme.cardBg, borderRadius: '35px', border: `1px solid ${theme.borderColor}`, textAlign: 'left', boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)', width: '100%', maxWidth: '1200px', margin: '30px auto 0 auto' }}>
                                <div style={{ color: '#881337', fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🪐</span> Advanced Transit Forecast (पारगमन गोचर)
                                </div>
                                <p style={{ color: '#be123c', fontSize: '16px', marginBottom: '25px', lineHeight: '1.4', fontWeight: 700 }}>
                                    Upcoming astrological transits, alignments, and their direct impact on zodiac signs.
                                </p>

                                {forecastLoading ? (
                                    <p style={{ color: '#881337', fontSize: '18px', fontStyle: 'italic', fontWeight: 900 }}>Calculating alignments...</p>
                                ) : transitForecast.length === 0 ? (
                                    <p style={{ color: '#475569', fontSize: '16px' }}>No major transit alignments active in the near future.</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                                        {transitForecast.map((ev, idx) => {
                                            const cautions = Object.values(ev.rashi_impacts).filter(r => r.status === 'Caution');
                                            const favorables = Object.values(ev.rashi_impacts).filter(r => r.status === 'Favorable');

                                            return (
                                                <div key={idx} style={{ background: '#fff1f2', padding: '25px', borderRadius: '25px', border: `1px solid ${theme.borderColor}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '4px 12px',
                                                            borderRadius: '10px',
                                                            fontSize: '12px',
                                                            fontWeight: '900',
                                                            textTransform: 'uppercase',
                                                            backgroundColor: ev.is_benefic ? '#f0fdf4' : '#ffe4e6',
                                                            color: ev.is_benefic ? '#15803d' : '#be123c',
                                                            border: ev.is_benefic ? '1px solid #bbf7d0' : '1px solid #fecdd3',
                                                            marginBottom: '10px'
                                                        }}>
                                                            {ev.is_benefic ? 'Auspicious (शुभ)' : 'Cautionary (सतर्कता)'}
                                                        </span>
                                                        <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#881337', margin: '0 0 6px 0' }}>
                                                            {ev.name_hi} / {ev.name_en}
                                                        </h3>
                                                        <p style={{ fontSize: '15px', color: '#be123c', fontWeight: '900', margin: '0 0 12px 0' }}>
                                                            📅 {new Date(ev.start_date).toLocaleDateString('hi-IN', { month: 'long', day: 'numeric' })} से {new Date(ev.end_date).toLocaleDateString('hi-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p style={{ fontSize: '16px', color: '#1e293b', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                                            {ev.desc_hi} <br />
                                                            <span style={{ fontSize: '14px', color: '#475569' }}>{ev.desc_en}</span>
                                                        </p>
                                                    </div>

                                                    {/* Impacted Signs */}
                                                    <div style={{ borderTop: `1px solid ${theme.borderColor}`, paddingTop: '15px' }}>
                                                        {cautions.length > 0 && (
                                                            <div style={{ marginBottom: '15px' }}>
                                                                <span style={{ fontSize: '14px', color: '#be123c', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                                                    ⚠️ Warning / सावधान रहें:
                                                                </span>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                    {cautions.map(c => (
                                                                        <div key={c.rashi_name_en} style={{ padding: '6px 12px', background: '#ffe4e6', border: '1px solid #fecdd3', borderRadius: '12px' }}>
                                                                            <span style={{ color: '#881337', fontWeight: '900', fontSize: '14px' }}>{c.rashi_name_hi} ({c.rashi_name_en})</span>
                                                                            <div style={{ fontSize: '12px', color: '#be123c', marginTop: '2px', fontWeight: 700 }}>
                                                                                {c.areas.map(a => a.hi).join(', ')} मामले
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {favorables.length > 0 && (
                                                            <div>
                                                                <span style={{ fontSize: '14px', color: '#15803d', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                                                    🌟 Auspicious / शुभ परिणाम:
                                                                </span>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                    {favorables.map(f => (
                                                                        <div key={f.rashi_name_en} style={{ padding: '6px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
                                                                            <span style={{ color: '#15803d', fontWeight: '900', fontSize: '14px' }}>{f.rashi_name_hi} ({f.rashi_name_en})</span>
                                                                            <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px', fontWeight: 700 }}>
                                                                                {f.areas.map(a => a.hi).join(', ')} लाभ
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: 'center', padding: '40px 0 60px 0' }}>
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
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};
