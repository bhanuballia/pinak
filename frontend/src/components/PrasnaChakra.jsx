import React, { useState, useMemo } from 'react';

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_SHORT = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

// South Indian (Kerala) Grid cell layout: 4x4 matrix
// [row, col] for each sign (fixed signs):
// Pisces: [0,0], Aries: [0,1], Taurus: [0,2], Gemini: [0,3]
// Cancer: [1,3], Leo: [2,3], Virgo: [3,3], Libra: [3,2]
// Scorpio: [3,1], Sagittarius: [3,0], Capricorn: [2,0], Aquarius: [1,0]
const SOUTH_INDIAN_SIGN_COORDS = {
    "Pisces": { r: 0, c: 0, x: 12.5, y: 12.5 },
    "Aries": { r: 0, c: 1, x: 37.5, y: 12.5 },
    "Taurus": { r: 0, c: 2, x: 62.5, y: 12.5 },
    "Gemini": { r: 0, c: 3, x: 87.5, y: 12.5 },
    "Cancer": { r: 1, c: 3, x: 87.5, y: 37.5 },
    "Leo": { r: 2, c: 3, x: 87.5, y: 62.5 },
    "Virgo": { r: 3, c: 3, x: 87.5, y: 87.5 },
    "Libra": { r: 3, c: 2, x: 62.5, y: 87.5 },
    "Scorpio": { r: 3, c: 1, x: 37.5, y: 87.5 },
    "Sagittarius": { r: 3, c: 0, x: 12.5, y: 87.5 },
    "Capricorn": { r: 2, c: 0, x: 12.5, y: 62.5 },
    "Aquarius": { r: 1, c: 0, x: 12.5, y: 37.5 }
};

// North Indian fixed house geometric centers (0-100 coordinate space)
const NORTH_HOUSE_CENTERS = {
    1: { x: 50, y: 26 },    // Top center diamond
    2: { x: 26, y: 13 },    // Top-left triangle
    3: { x: 13, y: 26 },    // Left-top triangle
    4: { x: 26, y: 50 },    // Left center diamond
    5: { x: 13, y: 74 },    // Left-bottom triangle
    6: { x: 26, y: 87 },    // Bottom-left triangle
    7: { x: 50, y: 74 },    // Bottom center diamond
    8: { x: 74, y: 87 },    // Bottom-right triangle
    9: { x: 87, y: 74 },    // Right-bottom triangle
    10: { x: 74, y: 50 },   // Right center diamond
    11: { x: 87, y: 26 },   // Right-top triangle
    12: { x: 74, y: 13 }    // Top-right triangle
};

export default function PrasnaChakra({ result }) {
    const [chartStyle, setChartStyle] = useState("south"); // "south" | "north"
    const [aspectFilter, setAspectFilter] = useState("all"); // "all" | "benefic" | "malefic" | "off"
    const [hoveredSign, setHoveredSign] = useState(null);

    if (!result) return null;

    const {
        arudha_sign = "Aries",
        udaya_sign = "Aries",
        chhatra_sign = "Aries",
        gulika_sign = "Aries",
        mandi_sign = "Aries",
        chart_planets = {},
        chart_special_points = [],
        aspect_rays = []
    } = result;

    const arudha_idx = SIGNS.indexOf(arudha_sign);

    // Group items (planets & special points) by sign
    const signContents = useMemo(() => {
        const map = {};
        SIGNS.forEach(s => {
            map[s] = {
                sign: s,
                sign_idx: SIGNS.indexOf(s),
                specialPoints: [],
                planets: []
            };
        });

        // 1. Add Special Pinned Badges
        // A (Arudha Lagna - Gold), U (Udaya Lagna - Blue), Ch (Chhatra Lagna - Green),
        // Gu (Gulika - Crimson), Ma (Mandi - Crimson), Mo (Chandra - Silver)
        const badges = [
            { code: "A", name: "Arudha Lagna", sign: arudha_sign, color: "gold", bg: "bg-amber-400 text-amber-950 border-amber-600" },
            { code: "U", name: "Udaya Lagna", sign: udaya_sign, color: "blue", bg: "bg-sky-500 text-white border-sky-700" },
            { code: "Ch", name: "Chhatra Lagna", sign: chhatra_sign, color: "green", bg: "bg-emerald-600 text-white border-emerald-800" },
            { code: "Gu", name: "Gulika", sign: gulika_sign, color: "crimson", bg: "bg-rose-700 text-white border-rose-900" },
            { code: "Ma", name: "Mandi", sign: mandi_sign, color: "crimson", bg: "bg-red-800 text-white border-red-950" }
        ];

        badges.forEach(b => {
            if (map[b.sign]) {
                map[b.sign].specialPoints.push(b);
            }
        });

        // 2. Add Planets
        Object.entries(chart_planets).forEach(([pName, pData]) => {
            if (map[pData.sign]) {
                if (pName === "Moon") {
                    // Chandra also has special silver Mo badge
                    map[pData.sign].specialPoints.push({
                        code: "Mo",
                        name: "Chandra (Moon)",
                        sign: pData.sign,
                        color: "silver",
                        bg: "bg-slate-200 text-slate-800 border-slate-400"
                    });
                }
                map[pData.sign].planets.push({
                    name: pName,
                    short: pName.slice(0, 2),
                    deg: pData.deg,
                    min: pData.min
                });
            }
        });

        return map;
    }, [result, arudha_sign, udaya_sign, chhatra_sign, gulika_sign, mandi_sign, chart_planets]);

    // Filter active aspect rays
    const filteredRays = useMemo(() => {
        if (aspectFilter === "off") return [];
        return aspect_rays.filter(ray => {
            if (aspectFilter === "benefic") return ray.type === "benefic";
            if (aspectFilter === "malefic") return ray.type === "malefic";
            return true;
        });
    }, [aspect_rays, aspectFilter]);

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200">
            {/* Header & Style Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-rose-200">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-1">
                        🪐 Visual Astrology Interface
                    </span>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <span>☸️</span> Interactive Prasna Chakra
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                        Kerala 12-house horary chart with pinned vital lagnas and live planetary aspect rays.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
                    {/* Chart Style Switcher */}
                    <div className="bg-rose-50 p-1 rounded-xl border border-rose-200 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setChartStyle("south")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                chartStyle === "south"
                                    ? "bg-white text-slate-900 shadow-xs border border-rose-200 font-black"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            🌴 South Indian (Kerala)
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartStyle("north")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                chartStyle === "north"
                                    ? "bg-white text-slate-900 shadow-xs border border-rose-200 font-black"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            💎 North Indian
                        </button>
                    </div>

                    {/* Aspect Rays Filter */}
                    <div className="bg-rose-50 p-1 rounded-xl border border-rose-200 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setAspectFilter("all")}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                aspectFilter === "all" ? "bg-white text-slate-900 font-black shadow-xs" : "text-slate-600"
                            }`}
                        >
                            All Rays
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspectFilter("benefic")}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                aspectFilter === "benefic" ? "bg-emerald-100 text-emerald-900 font-black shadow-xs border border-emerald-300" : "text-emerald-700"
                            }`}
                        >
                            Benefic (Guru/Venus)
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspectFilter("malefic")}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                aspectFilter === "malefic" ? "bg-rose-100 text-rose-900 font-black shadow-xs border border-rose-300" : "text-rose-700"
                            }`}
                        >
                            Malefic (Sat/Mars/Rahu)
                        </button>
                        <button
                            type="button"
                            onClick={() => setAspectFilter("off")}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                aspectFilter === "off" ? "bg-white text-slate-900 font-black shadow-xs" : "text-slate-500"
                            }`}
                        >
                            Off
                        </button>
                    </div>
                </div>
            </div>

            {/* Pinned Badges Legend Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-rose-50/60 p-3 sm:p-4 rounded-2xl border border-rose-200 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-700 uppercase text-[10px] tracking-wider">Pinned Badges:</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-amber-950 font-black text-[11px] border border-amber-600 shadow-2xs">
                        A <span className="font-medium text-[10px]">Arudha Lagna</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500 text-white font-black text-[11px] border border-sky-700 shadow-2xs">
                        U <span className="font-medium text-[10px]">Udaya Lagna</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[11px] border border-emerald-800 shadow-2xs">
                        Ch <span className="font-medium text-[10px]">Chhatra</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-700 text-white font-black text-[11px] border border-rose-900 shadow-2xs">
                        Gu <span className="font-medium text-[10px]">Gulika</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-800 text-white font-black text-[11px] border border-red-950 shadow-2xs">
                        Ma <span className="font-medium text-[10px]">Mandi</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 font-black text-[11px] border border-slate-400 shadow-2xs">
                        Mo <span className="font-medium text-[10px]">Chandra</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-emerald-500 inline-block"></span> Benefic Aspect
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Malefic Aspect
                    </span>
                </div>
            </div>

            {/* CHART RENDER CONTAINER */}
            <div className="flex justify-center items-center py-4 overflow-x-auto">
                <div className="w-full max-w-[580px] aspect-square relative select-none">
                    {chartStyle === "south" ? (
                        /* ================= SOUTH INDIAN / KERALA STYLE ================= */
                        <div className="w-full h-full border-2 border-rose-900/40 rounded-2xl bg-white shadow-md relative grid grid-cols-4 grid-rows-4 overflow-hidden">
                            {/* SVG Overlay for Aspect Rays */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100">
                                <defs>
                                    <marker id="arrow-benefic" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                                    </marker>
                                    <marker id="arrow-malefic" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                                    </marker>
                                </defs>
                                {filteredRays.map((ray, idx) => {
                                    const fromSign = SIGNS[ray.from_sign_idx];
                                    const toSign = SIGNS[ray.to_sign_idx];
                                    const p1 = SOUTH_INDIAN_SIGN_COORDS[fromSign];
                                    const p2 = SOUTH_INDIAN_SIGN_COORDS[toSign];
                                    if (!p1 || !p2) return null;

                                    const isBenefic = ray.type === "benefic";
                                    const strokeColor = isBenefic ? "#059669" : "#e11d48";
                                    const marker = isBenefic ? "url(#arrow-benefic)" : "url(#arrow-malefic)";
                                    
                                    // Slight curve for visual elegance
                                    const dx = p2.x - p1.x;
                                    const dy = p2.y - p1.y;
                                    const cx = (p1.x + p2.x) / 2 - dy * 0.12;
                                    const cy = (p1.y + p2.y) / 2 + dx * 0.12;

                                    return (
                                        <path
                                            key={idx}
                                            d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                                            fill="none"
                                            stroke={strokeColor}
                                            strokeWidth="1.2"
                                            strokeDasharray="2 1.5"
                                            strokeOpacity="0.75"
                                            markerEnd={marker}
                                        />
                                    );
                                })}
                            </svg>

                            {/* 4x4 Grid Boxes */}
                            {Array.from({ length: 4 }).map((_, r) => (
                                Array.from({ length: 4 }).map((_, c) => {
                                    // Center 2x2 area
                                    if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
                                        if (r === 1 && c === 1) {
                                            return (
                                                <div
                                                    key="center"
                                                    className="col-span-2 row-span-2 bg-gradient-to-br from-rose-50 via-rose-100/60 to-rose-50 border border-rose-200/80 flex flex-col items-center justify-center p-4 text-center z-10"
                                                >
                                                    <span className="text-2xl mb-1">🐚</span>
                                                    <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                                                        Prasna Chakra
                                                    </h4>
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-full border border-rose-300 mt-1">
                                                        Arudha: {arudha_sign}
                                                    </span>
                                                    <span className="text-[10px] text-slate-600 font-semibold mt-1">
                                                        Udaya: {udaya_sign}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }

                                    // Find matching sign for [r, c]
                                    const signEntry = Object.entries(SOUTH_INDIAN_SIGN_COORDS).find(
                                        ([_, coord]) => coord.r === r && coord.c === c
                                    );
                                    if (!signEntry) return null;
                                    const signName = signEntry[0];
                                    const content = signContents[signName];
                                    const houseFromArudha = ((content.sign_idx - arudha_idx + 12) % 12) + 1;
                                    const isArudha = signName === arudha_sign;

                                    return (
                                        <div
                                            key={signName}
                                            onMouseEnter={() => setHoveredSign(signName)}
                                            onMouseLeave={() => setHoveredSign(null)}
                                            className={`p-1.5 sm:p-2 border border-rose-200/90 flex flex-col justify-between transition-all relative ${
                                                isArudha ? 'bg-amber-50/70 font-black' : 'bg-white hover:bg-rose-50/50'
                                            }`}
                                        >
                                            {/* Top row: Sign name & House number */}
                                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-b border-rose-100 pb-0.5">
                                                <span className={isArudha ? 'text-amber-900 font-black' : 'text-slate-700 font-extrabold'}>
                                                    {SIGN_SHORT[content.sign_idx]}
                                                </span>
                                                <span className="text-[9px] text-slate-400 bg-rose-50 px-1 rounded">
                                                    H{houseFromArudha}
                                                </span>
                                            </div>

                                            {/* Pinned Badges Row */}
                                            <div className="flex flex-wrap gap-1 my-1">
                                                {content.specialPoints.map((pt, pIdx) => (
                                                    <span
                                                        key={pIdx}
                                                        title={pt.name}
                                                        className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs border ${pt.bg}`}
                                                    >
                                                        {pt.code}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Planetary Placements */}
                                            <div className="flex flex-wrap gap-1 text-[9px] sm:text-[10px] font-bold text-slate-800">
                                                {content.planets.map((pl, plIdx) => (
                                                    <span key={plIdx} className="bg-slate-100 px-1 rounded text-slate-900">
                                                        {pl.short} {pl.deg}°
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    ) : (
                        /* ================= NORTH INDIAN DIAMOND STYLE ================= */
                        <div className="w-full h-full relative">
                            <svg className="w-full h-full border-2 border-rose-900/40 rounded-2xl bg-white shadow-md" viewBox="0 0 100 100">
                                <defs>
                                    <marker id="arrow-benefic-n" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                                    </marker>
                                    <marker id="arrow-malefic-n" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                                    </marker>
                                </defs>

                                {/* Diamond Outlines & Partitions */}
                                <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#be123c" strokeWidth="1.5" />
                                <line x1="5" y1="5" x2="95" y2="95" stroke="#be123c" strokeWidth="1.5" />
                                <line x1="95" y1="5" x2="5" y2="95" stroke="#be123c" strokeWidth="1.5" />
                                <rect x="5" y="5" width="90" height="90" fill="none" stroke="#be123c" strokeWidth="1.8" />

                                {/* Draw Aspect Rays in North Indian Chart */}
                                {filteredRays.map((ray, idx) => {
                                    // In North Indian, houses are counted from Arudha or Udaya (let House 1 = Arudha Lagna)
                                    const fromHouse = ((ray.from_sign_idx - arudha_idx + 12) % 12) + 1;
                                    const toHouse = ((ray.to_sign_idx - arudha_idx + 12) % 12) + 1;
                                    const p1 = NORTH_HOUSE_CENTERS[fromHouse];
                                    const p2 = NORTH_HOUSE_CENTERS[toHouse];
                                    if (!p1 || !p2) return null;

                                    const isBenefic = ray.type === "benefic";
                                    const strokeColor = isBenefic ? "#059669" : "#e11d48";
                                    const marker = isBenefic ? "url(#arrow-benefic-n)" : "url(#arrow-malefic-n)";

                                    return (
                                        <line
                                            key={idx}
                                            x1={p1.x}
                                            y1={p1.y}
                                            x2={p2.x}
                                            y2={p2.y}
                                            stroke={strokeColor}
                                            strokeWidth="1.2"
                                            strokeDasharray="2 1.5"
                                            strokeOpacity="0.75"
                                            markerEnd={marker}
                                        />
                                    );
                                })}

                                {/* House Numbers & Contents */}
                                {Array.from({ length: 12 }).map((_, hIdx) => {
                                    const houseNum = hIdx + 1;
                                    const center = NORTH_HOUSE_CENTERS[houseNum];
                                    const signIdx = (arudha_idx + hIdx) % 12;
                                    const signName = SIGNS[signIdx];
                                    const content = signContents[signName];

                                    return (
                                        <g key={houseNum}>
                                            {/* Sign Number / House marker */}
                                            <text
                                                x={center.x}
                                                y={center.y - 7}
                                                textAnchor="middle"
                                                fontSize="3.8"
                                                fill="#64748b"
                                                fontWeight="bold"
                                            >
                                                {signIdx + 1} ({SIGN_SHORT[signIdx]})
                                            </text>

                                            {/* Pinned Badges in House */}
                                            {content.specialPoints.map((pt, pIdx) => {
                                                const xOffset = (pIdx - (content.specialPoints.length - 1) / 2) * 5.2;
                                                const fillColor = pt.color === "gold" ? "#f59e0b" : pt.color === "blue" ? "#0284c7" : pt.color === "green" ? "#059669" : pt.color === "silver" ? "#cbd5e1" : "#be123c";
                                                const textColor = (pt.color === "gold" || pt.color === "silver") ? "#0f172a" : "#ffffff";
                                                return (
                                                    <g key={pIdx} transform={`translate(${center.x + xOffset}, ${center.y - 1})`}>
                                                        <rect x="-2.4" y="-2.2" width="4.8" height="4.4" rx="1" fill={fillColor} stroke="#000" strokeWidth="0.3" />
                                                        <text x="0" y="1" textAnchor="middle" fontSize="2.8" fontWeight="bold" fill={textColor}>
                                                            {pt.code}
                                                        </text>
                                                    </g>
                                                );
                                            })}

                                            {/* Planets in House */}
                                            <text
                                                x={center.x}
                                                y={center.y + 6}
                                                textAnchor="middle"
                                                fontSize="3.2"
                                                fill="#0f172a"
                                                fontWeight="bold"
                                            >
                                                {content.planets.map(p => p.short).join(" ")}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Inspection Guide */}
            <div className="mt-4 pt-4 border-t border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Aspect Rays Active:</span>
                    <span className="text-emerald-700 font-semibold">
                        Guru (Jupiter) 5th, 7th, 9th • Shukra (Venus) 7th
                    </span>
                    <span>|</span>
                    <span className="text-rose-700 font-semibold">
                        Sani (Saturn) 3rd, 7th, 10th • Kuja (Mars) 4th, 7th, 8th • Rahu 5th, 7th, 9th
                    </span>
                </div>
                <span className="text-[11px] text-slate-500 italic">
                    Hover over chart elements for dynamic reading
                </span>
            </div>
        </div>
    );
}
