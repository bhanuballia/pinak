import React, { useState, useEffect } from 'react';
import { fetchMonthlyPanchang, fetchNextAdhikMaas } from '../services/api';

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EKADASHI_NAMES = {
    "Chaitra": { Krishna: "Papmochani", Shukla: "Kamada" },
    "Vaishakha": { Krishna: "Varuthini", Shukla: "Mohini" },
    "Jyeshtha": { Krishna: "Apara", Shukla: "Nirjala" },
    "Ashadha": { Krishna: "Yogini", Shukla: "Devshayani" },
    "Shravana": { Krishna: "Kamika", Shukla: "Shravana Putrada" },
    "Bhadrapada": { Krishna: "Aja", Shukla: "Parivartini" },
    "Ashvina": { Krishna: "Indira", Shukla: "Papankusha" },
    "Kartika": { Krishna: "Rama", Shukla: "Prabodhini" },
    "Margashirsha": { Krishna: "Utpanna", Shukla: "Mokshada" },
    "Pausha": { Krishna: "Saphala", Shukla: "Pausha Putrada" },
    "Magha": { Krishna: "Shattila", Shukla: "Jaya" },
    "Phalguna": { Krishna: "Vijaya", Shukla: "Amalaki" },
    "Adhik": { Krishna: "Parama", Shukla: "Padmini" }
};

const calculateHinduYears = (gregorianYear, gregorianMonthIndex) => {
    // Chaitra roughly starts around March/April. 
    // We use index 3 (April) as a simple heuristic for the new year having started
    const isNewYearStarted = gregorianMonthIndex >= 3;
    return {
        vikramSamvat: isNewYearStarted ? gregorianYear + 57 : gregorianYear + 56,
        shakaSamvat: isNewYearStarted ? gregorianYear - 78 : gregorianYear - 79
    };
};

const getHinduMonthFromNakshatra = (nakshatraName) => {
    if (!nakshatraName) return "Unknown";
    const name = nakshatraName.toLowerCase();

    if (name.includes("chitra") || name.includes("swati")) return "Chaitra";
    if (name.includes("vishakha") || name.includes("anuradha")) return "Vaishakha";
    if (name.includes("jyeshtha") || name.includes("mula")) return "Jyeshtha";
    if (name.includes("ashadha")) return "Ashadha"; // Purva/Uttara Ashadha
    if (name.includes("shravana") || name.includes("dhanishta")) return "Shravana";
    if (name.includes("shatabhisha") || name.includes("bhadrapada")) return "Bhadrapada"; // Purva/Uttara Bhadrapada
    if (name.includes("revati") || name.includes("ashwini") || name.includes("bharani")) return "Ashvina";
    if (name.includes("krittika") || name.includes("rohini")) return "Kartika";
    if (name.includes("mrigashira") || name.includes("ardra")) return "Margashirsha";
    if (name.includes("punarvasu") || name.includes("pushya")) return "Pausha";
    if (name.includes("ashlesha") || name.includes("magha")) return "Magha";
    if (name.includes("phalguni") || name.includes("hasta")) return "Phalguna"; // Purva/Uttara Phalguni

    return "Unknown";
};


export default function MonthlyPanchangViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [nextAdhik, setNextAdhik] = useState(null);

    useEffect(() => {
        const loadPanchang = async () => {
            try {
                setLoading(true);
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
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; // 1-12
                const res = await fetchMonthlyPanchang(lat, lon, tz, year, month);
                setData(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const loadNextAdhikMaas = async () => {
            try {
                const res = await fetchNextAdhikMaas();
                if (res.found) {
                    setNextAdhik(res);
                }
            } catch (err) {
                console.error("Failed to fetch next Adhik Maas:", err);
            }
        };

        loadPanchang();
        if (!nextAdhik) {
            loadNextAdhikMaas();
        }
    }, [currentDate]);

    const monthInfo = React.useMemo(() => {
        if (!data || !data.data) return null;
        // tithi_index 29 is Amavasya, 14 is Purnima
        const amavasyaDay = data.data.find(d => d.tithi.tithi_index === 29);
        const purnimaDay = data.data.find(d => d.tithi.tithi_index === 14);
        const { vikramSamvat, shakaSamvat } = calculateHinduYears(currentDate.getFullYear(), currentDate.getMonth());

        let hinduMonth = "N/A";
        if (purnimaDay) {
            hinduMonth = getHinduMonthFromNakshatra(purnimaDay.nakshatra.nakshatra_name);
            if (purnimaDay.is_adhik_maas) {
                hinduMonth += " (Adhik)";
            }
        } else {
            const gregorianMonth = currentDate.getMonth();
            const fallbackMonths = [
                "Pausha/Magha", "Magha/Phalguna", "Phalguna/Chaitra", "Chaitra/Vaishakha",
                "Vaishakha/Jyeshtha", "Jyeshtha/Ashadha", "Ashadha/Shravana", "Shravana/Bhadrapada",
                "Bhadrapada/Ashvina", "Ashvina/Kartika", "Kartika/Margashirsha", "Margashirsha/Pausha"
            ];
            hinduMonth = fallbackMonths[gregorianMonth] + " (Approx)";
            // Approximate check using the first day if Purnima is missing
            if (data.data[0] && data.data[0].is_adhik_maas) {
                hinduMonth += " (Adhik)";
            }
        }

        return {
            vikramSamvat,
            shakaSamvat,
            hinduMonth,
            amavasyaDate: amavasyaDay ? `${amavasyaDay.day_number} ${MONTHS[currentDate.getMonth()]}` : 'N/A',
            purnimaDate: purnimaDay ? `${purnimaDay.day_number} ${MONTHS[currentDate.getMonth()]}` : 'N/A'
        };
    }, [data, currentDate]);

    const ekadashisList = React.useMemo(() => {
        if (!data || !data.data) return [];
        const baseMonth = monthInfo?.hinduMonth ? monthInfo.hinduMonth.replace(" (Adhik)", "").replace(" (Approx)", "") : "Unknown";
        const isAdhik = monthInfo?.hinduMonth ? monthInfo.hinduMonth.includes("(Adhik)") : false;

        const list = [];
        data.data.forEach(d => {
            if (d.ekadashi_vrat_type) {
                let eName = isAdhik ? EKADASHI_NAMES["Adhik"]?.[d.ekadashi_vrat_type] : EKADASHI_NAMES[baseMonth]?.[d.ekadashi_vrat_type];
                eName = eName ? `${eName} Ekadashi` : "Ekadashi";

                const dateParts = d.date.split('-');
                const formattedDate = `${parseInt(dateParts[2])} ${MONTHS[parseInt(dateParts[1]) - 1]} ${dateParts[0]} (${d.day})`;

                list.push({
                    dateString: formattedDate,
                    name: eName,
                    timing: `${d.ekadashi_start} – ${d.ekadashi_end}`
                });
            }
        });
        return list;
    }, [data, monthInfo]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderGrid = () => {
        if (!data || !data.data) return null;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const gridCells = [];

        const baseMonth = monthInfo?.hinduMonth ? monthInfo.hinduMonth.replace(" (Adhik)", "").replace(" (Approx)", "") : "Unknown";
        const isAdhik = monthInfo?.hinduMonth ? monthInfo.hinduMonth.includes("(Adhik)") : false;

        // Empty cells for offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            gridCells.push(<div key={`empty-${i}`} style={{ background: 'hsla(0, 31%, 94%, 1.00)', border: '1px solid rgba(255,255,255,0.05)' }}></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = data.data.find(d => d.day_number === day);
            const isToday = (year === new Date().getFullYear() && month === new Date().getMonth() && day === new Date().getDate());
            const isAmavasya = dayData && dayData.tithi.tithi_index === 29;
            const isPurnima = dayData && dayData.tithi.tithi_index === 14;
            const isShuklaEkadashi = dayData && dayData.ekadashi_vrat_type === "Shukla";
            const isKrishnaEkadashi = dayData && dayData.ekadashi_vrat_type === "Krishna";

            let ekadashiName = null;
            if (isShuklaEkadashi) {
                ekadashiName = isAdhik ? EKADASHI_NAMES["Adhik"]?.Shukla : EKADASHI_NAMES[baseMonth]?.Shukla;
                if (ekadashiName) ekadashiName += " Ekadashi";
            } else if (isKrishnaEkadashi) {
                ekadashiName = isAdhik ? EKADASHI_NAMES["Adhik"]?.Krishna : EKADASHI_NAMES[baseMonth]?.Krishna;
                if (ekadashiName) ekadashiName += " Ekadashi";
            }

            let nakshatraFestival = null;
            if (dayData && dayData.nakshatra) {
                const naksName = dayData.nakshatra.nakshatra_name.toLowerCase();
                if (naksName.includes("ardra") || naksName.includes("thiruvathirai")) {
                    nakshatraFestival = "Arudra Darisanam";
                } else if (naksName.includes("rohini")) {
                    nakshatraFestival = "Rohini Vrat";
                } else if (naksName.includes("punarvasu")) {
                    nakshatraFestival = "Punarvasu (Rama Birth Star)";
                } else if (naksName.includes("pushya") || naksName.includes("pushyami")) {
                    nakshatraFestival = "Pushya (Auspicious)";
                } else if (naksName.includes("shravana")) {
                    nakshatraFestival = "Shravana (Onam/Vamana)";
                }
            }

            gridCells.push(
                <div key={day} style={{
                    border: isToday ? '3px solid #22c55e' : '1px solid #fcf1faff',
                    background: isToday ? 'hsla(142, 18%, 88%, 1.00)' : 'hsla(311, 52%, 94%, 1.00)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minHeight: '160px',
                    boxShadow: isToday ? '0 0 15px rgba(34,197,94,0.3) inset' : 'inset 0 0 10px hsla(0, 29%, 93%, 0.99)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ color: '#740518ff', fontSize: '13px', display: 'flex', gap: '5px' }}>
                            <span>☀️ {dayData?.sun_rise}</span>
                            <span>🌙 {dayData?.sun_set}</span>
                        </div>
                        <div style={{ color: 'rgba(22, 20, 20, 1)', fontSize: '24px', fontWeight: 900, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isAmavasya && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} title="Amavasya (New Moon)">🌑</span>}
                            {isPurnima && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} title="Purnima (Full Moon)">🌕</span>}
                            {day}
                        </div>
                    </div>
                    {dayData ? (
                        <div style={{ fontSize: '13px', color: 'hsla(0, 16%, 8%, 0.70)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {ekadashiName && (
                                <div style={{ background: 'rgba(212,175,55,0.2)', color: '#92400e', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(212,175,55,0.5)' }}>
                                    🌾 {ekadashiName}
                                </div>
                            )}
                            {nakshatraFestival && (
                                <div style={{ background: 'rgba(147,51,234,0.1)', color: '#6b21a8', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', border: '1px solid rgba(147,51,234,0.3)' }}>
                                    ✨ {nakshatraFestival}
                                </div>
                            )}
                            <div style={{ color: 'black' }}><strong>Tithi:</strong> {dayData.tithi.tithi_name} <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold' }}>(Udaya Tithi)</span></div>
                            <div><strong>Nakshatra:</strong> {dayData.nakshatra.nakshatra_name}</div>
                            <div><strong>Yoga:</strong> {dayData.yoga.yoga_name}</div>
                            <div><strong>Karana:</strong> {dayData.karana.karana_name}</div>
                            <div style={{ color: '#ef4444', marginTop: '4px' }}><strong>Rahu Kaal:</strong><br />{dayData.muhurtas.rahu_kaal.start} - {dayData.muhurtas.rahu_kaal.end}</div>
                            <div style={{ color: '#22c55e', marginTop: '2px' }}><strong>Abhijit Muhurta:</strong><br />{dayData.muhurtas.abhijit.start} - {dayData.muhurtas.abhijit.end}</div>
                        </div>
                    ) : (
                        <div style={{ color: 'hsla(0, 55%, 4%, 0.30)', fontSize: '13px' }}>Loading...</div>
                    )}
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} style={{ background: 'hsla(29, 83%, 55%, 1.00)', color: 'rgba(22, 19, 10, 1)', textAlign: 'center', padding: '10px 0', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {day}
                    </div>
                ))}
                {gridCells}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 40px', background: 'linear-gradient(to right, #020617, rgba(212,175,55,0.1), #020617)', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#d4af37', fontSize: '24px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Monthly Panchang Calendar</h1>
                    {nextAdhik && (
                        <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 900, marginTop: '8px', letterSpacing: '1px' }}>
                            UPCOMING ADHIK MAAS: {getHinduMonthFromNakshatra(nextAdhik.nakshatra_name)} ({nextAdhik.date})
                        </div>
                    )}
                </div>
                <button onClick={() => window.close()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Close Window</button>
            </div>

            {/* Navigation */}
            <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
                <button onClick={handlePrevMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>&laquo;</button>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', minWidth: '350px' }}>
                    <select
                        value={currentDate.getMonth()}
                        onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                        style={{ background: 'rgba(212,175,55,0.05)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '10px 20px', fontSize: '28px', fontWeight: 900, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
                    >
                        {MONTHS.map((m, idx) => <option key={m} value={idx} style={{ background: '#020617', color: '#d4af37', fontSize: '18px' }}>{m}</option>)}
                    </select>

                    <select
                        value={currentDate.getFullYear()}
                        onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', fontSize: '28px', fontWeight: 300, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
                    >
                        {Array.from({ length: 201 }, (_, i) => 1900 + i).map(y => <option key={y} value={y} style={{ background: '#020617', color: 'white', fontSize: '18px' }}>{y}</option>)}
                    </select>
                </div>
                <button onClick={handleNextMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>&raquo;</button>
            </div>

            {/* Info Bar */}
            {monthInfo && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 40px 20px 40px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Hindu Month</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.hinduMonth}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Vikram Samvat</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.vikramSamvat}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Shaka Samvat</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.shakaSamvat}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Amavasya</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.amavasyaDate}</span>
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 20px', borderRadius: '10px', color: '#d4af37', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'medium', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Purnima</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{monthInfo.purnimaDate}</span>
                    </div>
                </div>
            )}

            {/* Ekadashi Summary */}
            {ekadashisList.length > 0 && (
                <div style={{ padding: '0 40px 20px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                    <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', padding: '20px' }}>
                        <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '16px' }}>🌾 Ekadashi Vrat Timings (Udaya Tithi Rules)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {ekadashisList.map((e, idx) => (
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '5px', color: '#fbbf24', fontSize: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{e.dateString}</div>
                                    <div style={{ fontWeight: 'bold', color: '#fcd34d' }}>{e.name}</div>
                                    <div style={{ opacity: 0.9 }}>{e.timing}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar */}
            <div style={{ flex: 1, padding: '0 40px 40px 40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#d4af37', padding: '100px 0', fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
                        Calculating Panchang data...
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: '#ef4444', padding: '100px 0' }}>{error}</div>
                ) : (
                    renderGrid()
                )}
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
