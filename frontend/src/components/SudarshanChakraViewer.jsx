import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Sun, Moon, Sparkles, Layers } from 'lucide-react';

export default function SudarshanChakraViewer({ birthData: propBirthData }) {
    const [sudarshanData, setSudarshanData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('circular'); // 'circular' | 'synthesis' | 'all_charts'

    const getLocalData = () => {
        try {
            return JSON.parse(localStorage.getItem('worksheetData'));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const localData = getLocalData();
        const birthData = propBirthData || localData;

        const fetchSudarshanData = async () => {
            setLoading(true);
            setError(null);
            try {
                let planetPositions = [];
                let ascDeg = 0.0;

                if (birthData?.chart?.planets) {
                    planetPositions = birthData.chart.planets;
                } else if (birthData?.planet_positions) {
                    planetPositions = birthData.planet_positions;
                }

                if (birthData?.chart?.ascendant) {
                    ascDeg = birthData.chart.ascendant;
                } else if (birthData?.ascendant_deg) {
                    ascDeg = birthData.ascendant_deg;
                } else if (birthData?.ascendant) {
                    ascDeg = birthData.ascendant;
                }

                const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');
                const response = await axios.post(`${baseUrl}/api/sudarshan-chakra`, {
                    planet_positions: planetPositions,
                    ascendant_deg: ascDeg
                });

                setSudarshanData(response.data);
            } catch (err) {
                console.error("Sudarshan Chakra Fetch Error:", err);
                setError("Failed to calculate Sudarshan Chakra.");
            } finally {
                setLoading(false);
            }
        };

        fetchSudarshanData();
    }, [propBirthData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-[#ffc0cb] min-h-screen text-slate-800">
                <Loader2 className="w-12 h-12 animate-spin text-blue-700 mb-4" />
                <p className="text-lg font-bold text-blue-900">Constructing Circular Sudarshan Chakra...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-[#ffc0cb] min-h-screen text-red-700 flex flex-col items-center justify-center">
                <div className="bg-white border border-red-300 p-6 rounded-xl max-w-md shadow-md">
                    <p className="font-bold text-lg mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!sudarshanData) {
        return (
            <div className="p-8 text-center bg-[#ffc0cb] min-h-screen text-slate-700">
                No birth chart data available for Sudarshan Chakra analysis.
            </div>
        );
    }

    const { lagna_reference, chandra_reference, surya_reference, synthesis } = sudarshanData;

    // Helper for rendering sign number + planets inside each sector cell matching reference image layout
    const renderSectorCell = (signName, planets, signFontSize = 'text-[12px]') => {
        const signNum = signName ? (ZODIAC_NAMES_INDEX[signName] || '') : '';
        const planetStyles = {
            'Sun': 'text-red-600 font-bold',
            'Moon': 'text-sky-600 font-bold',
            'Mars': 'text-red-500 font-bold',
            'Mercury': 'text-emerald-600 font-bold',
            'Jupiter': 'text-amber-600 font-bold',
            'Venus': 'text-pink-600 font-bold',
            'Saturn': 'text-blue-800 font-bold',
            'Rahu': 'text-slate-700 font-bold',
            'Ketu': 'text-fuchsia-600 font-bold',
            'Ascendant': 'text-slate-900 font-bold'
        };
        const abbrev = {
            'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'MeR',
            'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
            'Ascendant': 'As'
        };

        return (
            <div className="flex items-center justify-center gap-1.5 w-full">
                {/* Sign Number on the left */}
                {signNum && (
                    <span className={`${signFontSize} font-serif text-stone-900 select-none mr-0.5`}>
                        {signNum}
                    </span>
                )}

                {/* Planets stacked vertically with clear spacing when two or more planets exist */}
                {planets && planets.length > 0 && (
                    <div className="flex flex-col items-center justify-center gap-y-1">
                        {planets.map((p, idx) => (
                            <span
                                key={idx}
                                className={`${planetStyles[p] || 'text-slate-900 font-bold'} text-[16px] leading-tight select-none`}
                                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                            >
                                {abbrev[p] || p}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render 3 Concentric Circular Sudarshan Wheel matching reference image design pattern exactly
    const renderCircularChart = () => {
        const getHouseData = (hNo) => synthesis.find(s => s.house === hNo) || {};

        const renderRingSectors = () => {
            const spokes = [];
            const textLabels = [];

            for (let i = 0; i < 12; i++) {
                const houseNo = i + 1;
                const hData = getHouseData(houseNo);

                const startAngleDeg = -105 - (i * 30);
                const midAngleDeg = -90 - (i * 30);

                const midRad = (midAngleDeg * Math.PI) / 180;

                const radStart = (startAngleDeg * Math.PI) / 180;
                const x1 = 300 + 90 * Math.cos(radStart);
                const y1 = 300 + 90 * Math.sin(radStart);
                const x2 = 300 + 270 * Math.cos(radStart);
                const y2 = 300 + 270 * Math.sin(radStart);

                spokes.push(
                    <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e3a8a" strokeWidth="1.5" />
                );

                const rInner = 120;
                const xInner = 300 + rInner * Math.cos(midRad);
                const yInner = 300 + rInner * Math.sin(midRad);

                const rMid = 180;
                const xMid = 300 + rMid * Math.cos(midRad);
                const yMid = 300 + rMid * Math.sin(midRad);

                const rOuter = 240;
                const xOuter = 300 + rOuter * Math.cos(midRad);
                const yOuter = 300 + rOuter * Math.sin(midRad);

                textLabels.push({
                    house: houseNo,
                    inner: { x: xInner, y: yInner, sign: hData.lagna_sign, planets: hData.lagna_planets },
                    middle: { x: xMid, y: yMid, sign: hData.chandra_sign, planets: hData.chandra_planets },
                    outer: { x: xOuter, y: yOuter, sign: hData.surya_sign, planets: hData.surya_planets }
                });
            }

            return { spokes, textLabels };
        };

        const { spokes, textLabels } = renderRingSectors();

        return (
            <div className="w-full max-w-5xl mx-auto bg-[#ffc0cb] p-4 sm:p-6 rounded-2xl font-serif">
                {/* Top Outer Card Container */}
                <div className="bg-[#ffffe6] border-2 border-[#3b82f6] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                    {/* Header Banner Button */}
                    <div className="border-2 border-[#1d4ed8] rounded-full px-6 py-1.5 inline-block bg-white shadow-sm mb-6">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-wide">
                            Sudarshan Chakra
                        </h2>
                    </div>

                    {/* Circular Chart Container */}
                    <div className="relative w-full aspect-square max-w-[580px] mx-auto my-4">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
                            {/* Inner Ring (Lagna): r = 90 */}
                            <circle cx="300" cy="300" r="90" fill="#ffffe6" stroke="#1e3a8a" strokeWidth="1" />
                            {/* Ring 2 (Chandra): r = 150 */}
                            <circle cx="300" cy="300" r="150" fill="none" stroke="#1e3a8a" strokeWidth="1" />
                            {/* Ring 3 (Surya): r = 210 */}
                            <circle cx="300" cy="300" r="210" fill="none" stroke="#1e3a8a" strokeWidth="1" />
                            {/* Outer Circle: r = 270 */}
                            <circle cx="300" cy="300" r="270" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />

                            {/* 12 Radial Sector Spokes */}
                            {spokes}
                        </svg>

                        {/* Sector Text Overlay Labels */}
                        {textLabels.map((lbl) => (
                            <React.Fragment key={lbl.house}>
                                {/* Ring 1: Inner (Lagna) */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-[65px]"
                                    style={{ left: `${(lbl.inner.x / 600) * 100}%`, top: `${(lbl.inner.y / 600) * 100}%` }}
                                >
                                    {renderSectorCell(lbl.inner.sign, lbl.inner.planets, 'text-[12px]')}
                                </div>

                                {/* Ring 2: Middle (Chandra) */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-[75px]"
                                    style={{ left: `${(lbl.middle.x / 600) * 100}%`, top: `${(lbl.middle.y / 600) * 100}%` }}
                                >
                                    {renderSectorCell(lbl.middle.sign, lbl.middle.planets, 'text-[13px]')}
                                </div>

                                {/* Ring 3: Outer (Surya) */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-[85px]"
                                    style={{ left: `${(lbl.outer.x / 600) * 100}%`, top: `${(lbl.outer.y / 600) * 100}%` }}
                                >
                                    {renderSectorCell(lbl.outer.sign, lbl.outer.planets, 'text-[14px]')}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Bottom Explanation Footer */}
                <div className="mt-3 text-[18px] sm:text-[18px] text-stone-900 font-sans leading-relaxed px-2">
                    The Sudarshan Chakra display shows birth chart from the Ascendant, from the Moon and from the Sun.
                </div>
            </div>
        );
    };

    // Sign name to index map (1-12)
    const ZODIAC_NAMES_INDEX = {
        "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
        "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
        "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
    };

    // Helper for rendering individual chart boxes
    const renderSingleChart = (title, icon, colorTheme, refData) => {
        return (
            <div className={`p-5 rounded-2xl border ${colorTheme.border} ${colorTheme.bg} shadow-2xl backdrop-blur-md`}>
                <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${colorTheme.titleText}`}>
                        {icon} {title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-black rounded-full border ${colorTheme.badge}`}>
                        1st House: {refData.sign}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {refData.houses.map((h) => (
                        <div
                            key={h.house}
                            className={`p-3 rounded-xl border transition-all ${h.planets.length > 0
                                ? `${colorTheme.activeHouseBg} ${colorTheme.activeHouseBorder}`
                                : 'bg-slate-900/10 border-slate-800/80'
                                }`}
                        >
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-orange-900">H{h.house}</span>
                                <span className="text-[16px] font-semibold text-orange-900">{h.sign_name}</span>
                            </div>
                            {h.planets.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {h.planets.map((p, idx) => (
                                        <span
                                            key={idx}
                                            className={`text-xs px-2 py-0.5 rounded font-bold shadow-sm ${colorTheme.planetTag}`}
                                        >
                                            {p.name}
                                            {p.is_retrograde ? ' (R)' : ''}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-[16px] text-stone-900 italic">Empty</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#ffc0cb] text-slate-900 p-4 md:p-8 font-sans">
            {/* Header Navigation */}
            <div className="max-w-7xl mx-auto mb-6 bg-white border border-pink-300 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-blue-900 flex items-center gap-3">
                        <Layers className="w-8 h-8 text-blue-700" />
                        Sudarshan Chakra (सुदर्शन चक्र)
                    </h1>
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                        3-in-1 Concentric Circular Sudarshan Wheel (Inner: Lagna, Middle: Chandra, Outer: Surya).
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
                    <button
                        onClick={() => setActiveTab('circular')}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'circular'
                            ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg font-black'
                            : 'text-slate-700 hover:text-blue-900 hover:bg-slate-200'
                            }`}
                    >
                        ⭕ Circular Wheel Chart
                    </button>
                    <button
                        onClick={() => setActiveTab('synthesis')}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'synthesis'
                            ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg font-black'
                            : 'text-slate-700 hover:text-blue-900 hover:bg-slate-200'
                            }`}
                    >
                        ⚡ House Synthesis
                    </button>
                    <button
                        onClick={() => setActiveTab('all_charts')}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'all_charts'
                            ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg font-black'
                            : 'text-slate-700 hover:text-blue-900 hover:bg-slate-200'
                            }`}
                    >
                        🏛️ Individual Charts
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {activeTab === 'circular' && renderCircularChart()}

                {activeTab === 'synthesis' && (
                    <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-300 text-slate-700 text-xs uppercase font-bold bg-slate-100">
                                    <th className="py-4 px-4">House</th>
                                    <th className="py-4 px-4 text-emerald-800">Lagna (Inner Ring)</th>
                                    <th className="py-4 px-4 text-sky-800">Chandra (Middle Ring)</th>
                                    <th className="py-4 px-4 text-amber-800">Surya (Outer Ring)</th>
                                    <th className="py-4 px-4 text-center">Combined Focus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {synthesis.map((h) => (
                                    <tr key={h.house} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-1.5 px-4 font-black text-blue-900">
                                            House {h.house}
                                        </td>
                                        <td className="py-1.5 px-4">
                                            <div className="font-medium text-slate-800">{h.lagna_sign}</div>
                                            <div className="text-[14px] text-emerald-700 font-bold">{h.lagna_planets.join(', ') || '-'}</div>
                                        </td>
                                        <td className="py-1.5 px-4">
                                            <div className="font-medium text-slate-800">{h.chandra_sign}</div>
                                            <div className="text-[14px] text-sky-700 font-bold">{h.chandra_planets.join(', ') || '-'}</div>
                                        </td>
                                        <td className="py-1.5 px-4">
                                            <div className="font-medium text-slate-800">{h.surya_sign}</div>
                                            <div className="text-[14px] text-amber-700 font-bold">{h.surya_planets.join(', ') || '-'}</div>
                                        </td>
                                        <td className="py-1.5 px-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-black ${h.impact_score >= 4
                                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                                    : h.impact_score >= 2
                                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                {h.impact_score} Planets Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'all_charts' && (
                    <div className="space-y-6">
                        {renderSingleChart('Lagna Kundali (Inner Ring)', <Sparkles className="w-5 h-5 text-emerald-600" />, {
                            bg: 'bg-emerald-50/50', border: 'border-emerald-300', titleText: 'text-stone-900',
                            badge: 'bg-emerald-100 text-stone-900 border-emerald-400', activeHouseBg: 'bg-emerald-100/10',
                            activeHouseBorder: 'border-emerald-400', planetTag: 'bg-emerald-200 text-stone-900 border border-emerald-400'
                        }, lagna_reference)}

                        {renderSingleChart('Chandra Kundali (Middle Ring)', <Moon className="w-5 h-5 text-sky-600" />, {
                            bg: 'bg-sky-50/50', border: 'border-sky-300', titleText: 'text-stone-900',
                            badge: 'bg-sky-100 text-stone-900 border-sky-400', activeHouseBg: 'bg-sky-100/70',
                            activeHouseBorder: 'border-sky-400', planetTag: 'bg-sky-200 text-stone-900 border border-sky-400'
                        }, chandra_reference)}

                        {renderSingleChart('Surya Kundali (Outer Ring)', <Sun className="w-5 h-5 text-amber-600" />, {
                            bg: 'bg-amber-50/50', border: 'border-amber-300', titleText: 'text-amber-900',
                            badge: 'bg-amber-100 text-amber-900 border-amber-400', activeHouseBg: 'bg-amber-100/70',
                            activeHouseBorder: 'border-amber-400', planetTag: 'bg-amber-200 text-amber-900 border border-amber-400'
                        }, surya_reference)}
                    </div>
                )}
            </div>
        </div>
    );
}
