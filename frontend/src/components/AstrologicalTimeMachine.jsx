import React, { useState, useEffect, useRef, useCallback } from 'react';
import ZodiacChart from './ZodiacChart';

const AstrologicalTimeMachine = ({ data }) => {
    const basic = data?.basic_details || {};
    const lat = basic.lat || data?.meta?.lat || 28.6139;
    const lon = basic.lon || data?.meta?.lon || 77.2090;
    const tz = basic.tz_offset || data?.meta?.tz_offset || 5.5;

    // Use current date for the very first load
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const [daysOffset, setDaysOffset] = useState(0);

    const [transitData, setTransitData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);
    const [language, setLanguage] = useState('en');

    const fetchTimeoutRef = useRef(null);

    const birthDateObj = new Date(basic.date || "1990-01-01");

    const fetchTransitData = async (targetDate) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                birth_date: basic.date || "1990-01-01",
                birth_time: basic.time || "12:00",
                lat: lat,
                lon: lon,
                tz_offset: tz,
                transit_date: targetDate,
                transit_time: currentTime
            };

            const response = await fetch('/api/transit/time_machine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transit data");
            }

            const result = await response.json();
            setTransitData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounced fetch for when slider is dragged
    const debouncedFetch = useCallback((targetDate) => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        fetchTimeoutRef.current = setTimeout(() => {
            fetchTransitData(targetDate);
        }, 150); // 150ms debounce for smooth slider feel
    }, [basic.date, basic.time, lat, lon, tz, currentTime]);

    // Update derived date from slider
    const handleSliderChange = (e) => {
        const offset = parseInt(e.target.value, 10);
        setDaysOffset(offset);

        const newDate = new Date(birthDateObj.getTime());
        newDate.setDate(birthDateObj.getDate() + offset);

        const newDateStr = newDate.toISOString().split('T')[0];
        setCurrentDate(newDateStr);

        debouncedFetch(newDateStr);
    };

    // Update from exact calendar date picker
    const handleDateChange = (e) => {
        const newDateStr = e.target.value;
        setCurrentDate(newDateStr);

        const newDateObj = new Date(newDateStr);
        const diffTime = Math.abs(newDateObj - birthDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysOffset(newDateObj >= birthDateObj ? diffDays : -diffDays);

        fetchTransitData(newDateStr);
    };

    // Auto-play tick logic
    const handleTick = useCallback(() => {
        const offset = daysOffset + parseInt(playSpeed, 10);
        // Cap it at 100 years max
        if (offset >= 36500) {
            setIsPlaying(false);
            return;
        }
        setDaysOffset(offset);

        const newDate = new Date(birthDateObj.getTime());
        newDate.setDate(birthDateObj.getDate() + offset);

        const newDateStr = newDate.toISOString().split('T')[0];
        setCurrentDate(newDateStr);

        fetchTransitData(newDateStr);
    }, [daysOffset, playSpeed, birthDateObj]);

    useEffect(() => {
        let intervalId;
        if (isPlaying) {
            intervalId = setInterval(handleTick, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, handleTick]);

    // Initial load
    useEffect(() => {
        if (basic.date) {
            const today = new Date();
            const diffTime = Math.abs(today - birthDateObj);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysOffset(today >= birthDateObj ? diffDays : -diffDays);
            fetchTransitData(today.toISOString().split('T')[0]);
        } else {
            fetchTransitData(currentDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helper to format exact display dates nicely
    const formattedDisplayDate = new Date(currentDate).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mt-8">
            {/* Header section */}
            <div className="bg-slate-900 p-6 text-white text-center relative">
                <h2 className="text-2xl font-black uppercase tracking-widest text-amber-400">Astrological Time Machine</h2>
                <p className="text-slate-400 mt-2 font-mono text-sm">Visualize planetary transits and Dasha cycles interactively.</p>
                <button
                    onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                    className="absolute top-6 right-6 px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg shadow-sm hover:bg-amber-400 transition text-sm uppercase tracking-wide"
                >
                    {language === 'en' ? 'A → अ (Hindi)' : 'अ → A (English)'}
                </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">

                {/* Control Panel (Left) */}
                <div className="w-full xl:w-1/3 flex flex-col gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">

                        {/* Selected Date Output */}
                        <div className="mb-6 text-center">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Target Transit Date</h3>
                            <div className="text-xl md:text-2xl font-black text-slate-800">
                                {formattedDisplayDate}
                            </div>
                            {loading && <span className="text-xs text-amber-600 font-bold ml-2 animate-pulse">Calculating...</span>}
                        </div>

                        {/* Date Picker Input */}
                        <div className="mb-6 flex flex-col">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2">Jump to Exact Date</label>
                            <input
                                type="date"
                                value={currentDate}
                                onChange={handleDateChange}
                                className="w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Slider Input */}
                        <div className="flex flex-col mb-4">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                                <span>Timeline Slider</span>
                                <span className="text-slate-400">Days from Birth: {daysOffset}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="36500" /* 100 years */
                                value={daysOffset}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                                <span>Birth</span>
                                <span>100 Years</span>
                            </div>
                        </div>

                        {/* Auto-Play Controls */}
                        <div className="flex items-center gap-4 mb-2">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold uppercase tracking-wide transition-colors ${isPlaying ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 shadow-inner' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'}`}
                            >
                                {isPlaying ? '⏸ Pause' : '▶ Auto-Play'}
                            </button>
                            <div className="flex flex-col">
                                <select
                                    value={playSpeed}
                                    onChange={(e) => setPlaySpeed(parseInt(e.target.value, 10))}
                                    disabled={isPlaying}
                                    className="p-2 bg-white border border-slate-300 rounded-lg shadow-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
                                >
                                    <option value="1">1 Day / sec</option>
                                    <option value="7">1 Week / sec</option>
                                    <option value="30">1 Month / sec</option>
                                    <option value="365">1 Year / sec</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Active Dasha Panel */}
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center shadow-sm">
                        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-3">Active Vimshottari Dasha</h3>
                        <div className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                            {transitData ? transitData.active_dasha : "Loading..."}
                        </div>
                        <p className="text-xs text-amber-700/70 mt-3 font-mono">Maha Dasha — Antar Dasha — Pratyantar</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm italic border border-rose-200 shadow-sm">
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Interactive Chart Container (Right) */}
                <div className="w-full xl:w-2/3 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-center relative min-h-[500px]">
                    {transitData ? (
                        <div className="w-full max-w-[600px] aspect-square relative">
                            <ZodiacChart
                                houses={data?.charts?.houses || transitData.birth_houses}
                                transitHouses={transitData.transit_houses}
                                title={`Birth Chart vs Transits on ${formattedDisplayDate}`}
                                defaultLang={language}
                                key={`chart-${language}`}
                            />
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 font-mono">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                            Warping Time...
                        </div>
                    )}
                </div>
            </div>

            {/* Strength Comparison Table */}
            {transitData && transitData.birth_shadbala && transitData.transit_shadbala && (
                <div className="mt-8 bg-rose-50 rounded-xl border border-slate-200 p-6 relative z-10 overflow-x-auto shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Planetary Strengths (Birth vs Transit)</h3>
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-[14px] text-slate-500 uppercase bg-slate-100/80">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg font-bold">Planet</th>
                                <th className="px-4 py-3 font-bold text-amber-700">Transit Bindus</th>
                                <th className="px-4 py-3 font-bold text-sky-700">Tara Bala</th>
                                <th className="px-4 py-3 font-bold text-indigo-700">Birth Dignity</th>
                                <th className="px-4 py-3 font-bold text-indigo-700">Vimsopaka <span className="text-[14px] text-black font-normal normal-case opacity-70">(Score/20)</span></th>
                                <th className="px-4 py-3 font-bold text-amber-700">Transit Dignity</th>
                                <th className="px-4 py-3 font-bold text-indigo-700">Birth Shadbala <span className="text-[14px] text-black font-normal normal-case opacity-70">(Rupas & Ratio)</span></th>
                                <th className="px-4 py-3 rounded-tr-lg font-bold text-amber-700">Transit Shadbala <span className="text-[14px] text-black font-normal normal-case opacity-70">(Rupas & Ratio)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((planet, idx) => {
                                const b_sb = transitData.birth_shadbala.planets?.[planet] || {};
                                const t_sb = transitData.transit_shadbala.planets?.[planet] || {};

                                const getDignityColor = (d) => {
                                    if (d === 'EXALTED' || d === 'MOOLATRIKONA' || d === 'OWN_SIGN') return 'text-emerald-600 font-semibold';
                                    if (d === 'DEBILITATED' || d === 'GREAT_ENEMY') return 'text-rose-600 font-semibold';
                                    if (d === 'FRIEND') return 'text-amber-900 font-semibold';
                                    if (d === 'GREAT_FRIEND') return 'text-orange-600 font-semibold';
                                    return 'text-black font-semibold';
                                };

                                const getRatioColor = (r) => {
                                    if (r >= 1.0) return 'text-[18px] text-green-500 font-bold';
                                    if (r < 0.75) return 'text-[18px] text-rose-600 font-semibold';
                                    return 'text-[18px] text-red-700 font-medium';
                                };

                                const getVimsopakaColor = (strength) => {
                                    if (strength === 'Excellent') return 'text-[16px] text-green-500 font-bold';
                                    if (strength === 'Good') return 'text-[16px] text-sky-600 font-semibold';
                                    if (strength === 'Inauspicious') return 'text-[16px] text-red-600 font-semibold';
                                    return 'text-[16px] text-red-700 font-medium';
                                };

                                const TARA_NAMES = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyak", "Sadhaka", "Vadha", "Mitra", "Ati Mitra"];
                                let taraBala = "-";
                                let taraColor = 'text-slate-600';
                                let transitBindus = "-";
                                let bindusColor = 'text-slate-600';

                                const birthMoon = transitData.birth_planets?.Moon;
                                const transitPlanet = transitData.transit_planets?.[planet];

                                if (birthMoon && transitPlanet && planet !== "Lagna" && planet !== "Ascendant") {
                                    const birthMoonNakIndex = Math.floor(birthMoon.sidereal.lon / (360 / 27));
                                    const transitPlanetNakIndex = Math.floor(transitPlanet.sidereal.lon / (360 / 27));
                                    const taraIndex = (transitPlanetNakIndex - birthMoonNakIndex + 27) % 9;
                                    taraBala = TARA_NAMES[taraIndex];

                                    if ([2, 4, 6].includes(taraIndex)) taraColor = 'text-rose-600 font-semibold';
                                    else if (taraIndex === 0) taraColor = 'text-sky-600 font-semibold';
                                    else taraColor = 'text-emerald-600 font-semibold';

                                    const transitSignIndex = Math.floor(transitPlanet.sidereal.lon / 30);

                                    // Use Bhinnashtakavarga (0-8 scale) for the transiting planet
                                    const bindus = transitData.birth_av?.bhinnashtakavarga?.[planet]?.[transitSignIndex];
                                    if (bindus !== undefined) {
                                        transitBindus = bindus;
                                        if (bindus >= 4) bindusColor = 'text-emerald-600 font-bold';
                                        else if (bindus <= 3) bindusColor = 'text-rose-600 font-bold';
                                        else bindusColor = 'text-slate-700 font-semibold';
                                    }
                                }

                                const vimsopakaObj = transitData.birth_vimsopaka?.interpretations?.[planet];

                                return (
                                    <tr key={planet} className={`border-b border-slate-100 hover:bg-white transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'}`}>
                                        <td className="px-4 py-3 font-medium text-[16px] text-slate-800">{planet}</td>
                                        <td className={`px-4 py-3 ${bindusColor}`}>{transitBindus}</td>
                                        <td className={`px-4 py-3 ${taraColor}`}>{taraBala}</td>
                                        <td className={`px-4 py-3 ${getDignityColor(b_sb.dignity)}`}>{b_sb.dignity || "-"}</td>
                                        <td className="px-4 py-3">
                                            {vimsopakaObj ? (
                                                <div className={`font-semibold ${getVimsopakaColor(vimsopakaObj.strength)}`}>
                                                    {vimsopakaObj.vimsopaka_score} <span className="text-xs opacity-70">/ 20</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 ${getDignityColor(t_sb.dignity)}`}>{t_sb.dignity || "-"}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-[16px] text-black">{b_sb.total_score?.toFixed(2) || "-"}</span>
                                            {b_sb.ratio_data && <span className={`text-[12px] ml-2 ${getRatioColor(b_sb.ratio_data.ratio)}`}>({b_sb.ratio_data.ratio?.toFixed(2)})</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-[16px] text-black">{t_sb.total_score?.toFixed(2) || "-"}</span>
                                            {t_sb.ratio_data && <span className={`text-[12px] ml-2 ${getRatioColor(t_sb.ratio_data.ratio)}`}>({t_sb.ratio_data.ratio?.toFixed(2)})</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AstrologicalTimeMachine;
