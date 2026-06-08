import React, { useState, useEffect } from 'react';
import { fetchMonthlyPanchang } from '../services/api';

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthlyPanchangViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

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

        loadPanchang();
    }, [currentDate]);

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

        // Empty cells for offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            gridCells.push(<div key={`empty-${i}`} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = data.data.find(d => d.day_number === day);
            const isToday = (year === new Date().getFullYear() && month === new Date().getMonth() && day === new Date().getDate());
            const isAmavasya = dayData && dayData.tithi.tithi_name.includes("Amavasya");
            const isPurnima = dayData && dayData.tithi.tithi_name.includes("Purnima");
            
            gridCells.push(
                <div key={day} style={{ 
                    border: isToday ? '3px solid #22c55e' : '1px solid rgba(212,175,55,0.2)', 
                    background: isToday ? 'rgba(34,197,94,0.05)' : 'rgba(0,0,0,0.6)', 
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    minHeight: '160px',
                    boxShadow: isToday ? '0 0 15px rgba(34,197,94,0.3) inset' : 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ color: '#d4af37', fontSize: '11px', display: 'flex', gap: '5px' }}>
                            <span>☀️ {dayData?.sun_rise}</span>
                            <span>🌙 {dayData?.sun_set}</span>
                        </div>
                        <div style={{ color: '#ef4444', fontSize: '24px', fontWeight: 900, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isAmavasya && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} title="Amavasya (New Moon)">🌑</span>}
                            {isPurnima && <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }} title="Purnima (Full Moon)">🌕</span>}
                            {day}
                        </div>
                    </div>
                    {dayData ? (
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ color: 'white' }}><strong>Tithi:</strong> {dayData.tithi.tithi_name}</div>
                            <div><strong>Nakshatra:</strong> {dayData.nakshatra.nakshatra_name}</div>
                            <div><strong>Yoga:</strong> {dayData.yoga.yoga_name}</div>
                            <div><strong>Karana:</strong> {dayData.karana.karana_name}</div>
                            <div style={{ color: '#ef4444', marginTop: '4px' }}><strong>Rahu Kaal:</strong><br/>{dayData.muhurtas.rahu_kaal.start} - {dayData.muhurtas.rahu_kaal.end}</div>
                            <div style={{ color: '#22c55e', marginTop: '2px' }}><strong>Abhijit Muhurta:</strong><br/>{dayData.muhurtas.abhijit.start} - {dayData.muhurtas.abhijit.end}</div>
                        </div>
                    ) : (
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>Loading...</div>
                    )}
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', textAlign: 'center', padding: '10px 0', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                <h1 style={{ color: '#d4af37', fontSize: '24px', fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Monthly Panchang Calendar</h1>
                <button onClick={() => window.close()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Close Window</button>
            </div>

            {/* Navigation */}
            <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
                <button onClick={handlePrevMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(212,175,55,0.1)'}>&laquo;</button>
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
                <button onClick={handleNextMonth} style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(212,175,55,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(212,175,55,0.1)'}>&raquo;</button>
            </div>

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
