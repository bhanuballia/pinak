import React, { useState, useEffect } from "react";
import ZodiacChart from "./ZodiacChart";
import CompactTransitControl from "./worksheet/CompactTransitControl";

const PLANET_COLORS = {
    "Sun": "#dc2626", // Red
    "Moon": "#1e293b", // Dark
    "Mars": "#dc2626", // Red
    "Mercury": "#15803d", // Green
    "Jupiter": "#b45309", // Orange
    "Venus": "#be185d", // Pink
    "Saturn": "#1d4ed8", // Blue
    "Rahu": "#374151",
    "Ketu": "#374151",
    "Ascendant": "#000000"
};

const PLANET_ABBREV = {
    "Ascendant": "As",
    "Sun": "Su",
    "Moon": "Mo",
    "Mars": "Ma",
    "Mercury": "Me",
    "Jupiter": "Ju",
    "Venus": "Ve",
    "Saturn": "Sa",
    "Rahu": "Ra",
    "Ketu": "Ke"
};

const getPName = (pAbbrev) => {
    switch (pAbbrev.substring(0, 2)) {
        case "As": return "Ascendant";
        case "Su": return "Sun";
        case "Mo": return "Moon";
        case "Ma": return "Mars";
        case "Me": return "Mercury";
        case "Ju": return "Jupiter";
        case "Ve": return "Venus";
        case "Sa": return "Saturn";
        case "Ra": return "Rahu";
        case "Ke": return "Ketu";
        default: return "Sun";
    }
};

const formatDegree = (deg) => {
    if (deg === undefined || deg === null) return "";
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor((((deg - d) * 60) - m) * 60);
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function GocharaWheel1View({ data }) {
    const [transitPositions, setTransitPositions] = useState(null);
    const [timeControlledDate, setTimeControlledDate] = useState(null);
    const [transitPanchang, setTransitPanchang] = useState(null);
    const [avData, setAvData] = useState(null);
    const [wheelOverlay, setWheelOverlay] = useState(null);
    const [startFrom, setStartFrom] = useState("Ascendant");
    const [direction, setDirection] = useState("Anti-Clockwise");

    useEffect(() => {
        if (!transitPositions && !data?.transit) {
            const fetchTransit = async () => {
                try {
                    const dateStr = new Date().toISOString().split('T')[0];
                    const timeStr = new Date().toTimeString().split(' ')[0].substring(0, 5);
                    const tz_offset = -(new Date().getTimezoneOffset() / 60);
                    const lat = data?.basic_details?.lat || data?.meta?.lat || 0;
                    const lon = data?.basic_details?.lon || data?.meta?.lon || 0;

                    const res = await fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat}&lon=${lon}`);
                    const json = await res.json();
                    if (json.positions) setTransitPositions(json.positions);

                    const pRes = await fetch(`/api/panchang`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date: dateStr, time: timeStr, tz_offset, lat, lon })
                    });
                    const pJson = await pRes.json();
                    setTransitPanchang(pJson);

                } catch (e) {
                    console.error("Failed to fetch transits or panchang", e);
                }
            };
            fetchTransit();
        } else if (data?.transit) {
            setTransitPositions(data.transit);
        }

        // Fetch AV data for Kakshas
        let birthDetails = null;
        if (data && data.basic_details) {
            const bd = data.basic_details;
            birthDetails = { date: bd.birth_date, time: bd.birth_time, lat: bd.lat, lon: bd.lon, tz_offset: (bd.tz_offset !== undefined && bd.tz_offset !== null && bd.tz_offset !== "") ? parseFloat(bd.tz_offset) : 5.5 };
        } else {
            try {
                const stored = localStorage.getItem('worksheetData');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.basic_details) {
                        const bd = parsed.basic_details;
                        birthDetails = { date: bd.birth_date, time: bd.birth_time, lat: bd.lat, lon: bd.lon, tz_offset: (bd.tz_offset !== undefined && bd.tz_offset !== null && bd.tz_offset !== "") ? parseFloat(bd.tz_offset) : 5.5 };
                    }
                }
            } catch (e) { /* ignore */ }
        }

        if (birthDetails && birthDetails.date && birthDetails.lat !== undefined) {
            fetch('/api/ashtakavarga', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(birthDetails),
            })
                .then(res => res.json())
                .then(json => setAvData(json))
                .catch(e => console.error("AV API Error:", e));
        }

    }, [data, transitPositions]);

    const getHouses = () => {
        if (!data) return {};
        // Re-use d1 houses for the North Indian chart
        return data.charts?.houses || data.charts?.D1?.houses || {};
    };

    const getTransitHouses = () => {
        if (!data) return {};
        const baseHouses = data.charts?.houses || data.charts?.D1?.houses || {};
        const transitHouses = JSON.parse(JSON.stringify(baseHouses));

        // Clear all birth planets, but keep Ascendant
        Object.keys(transitHouses).forEach(h => {
            const hasAsc = baseHouses[h].planets?.some(p => {
                const name = typeof p === 'object' ? p.name : p;
                return name?.startsWith('As');
            });
            transitHouses[h].planets = hasAsc ? ['Ascendant'] : [];
        });

        // Add transit planets to their respective signs
        if (transitPositions) {
            const tArr = Array.isArray(transitPositions) ? transitPositions : Object.entries(transitPositions).map(([k, v]) => ({ planet: k, ...v }));
            tArr.forEach(p => {
                const pName = p.planet;
                if (pName?.startsWith('As')) return; // Skip transit ascendant

                const full_deg = p.sidereal?.lon !== undefined ? p.sidereal.lon : (p.full_degree !== undefined ? p.full_degree : p.degree);
                if (full_deg === undefined) return;

                const signIndex = p.sidereal?.sign_id !== undefined ? p.sidereal.sign_id - 1 : (p.sign_id !== undefined ? p.sign_id - 1 : Math.floor(full_deg / 30));
                const signNum = signIndex + 1;

                Object.keys(transitHouses).forEach(h => {
                    const info = transitHouses[h];
                    const hSign = info.sign !== undefined ? info.sign : (info.sign_index !== undefined ? info.sign_index + 1 : (info.cusp_deg !== undefined ? Math.floor(info.cusp_deg / 30) + 1 : null));

                    if (hSign === signNum) {
                        // Include the degree if available
                        const formattedDeg = formatDegree(full_deg);
                        // Let's just push the planet name, ZodiacChart handles abbreviations
                        // If we want degrees in the chart, ZodiacChart might need to be customized, 
                        // but let's at least get the planets displaying first.
                        transitHouses[h].planets.push(pName);
                    }
                });
            });
        }
        return transitHouses;
    };

    const displayDate = timeControlledDate || new Date();
    const dateString = displayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeString = displayDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const birthArr = Array.isArray(data?.planet_positions) ? [...data.planet_positions] : (data?.planet_positions ? Object.entries(data.planet_positions).map(([k, v]) => ({ planet: k, ...v })) : []);

    const ascDegree = data?.charts?.ascendant_degree !== undefined ? data.charts.ascendant_degree :
        (data?.charts?.houses?.[1]?.cusp_deg !== undefined ? data.charts.houses[1].cusp_deg :
            (data?.charts?.houses?.["1"]?.cusp_deg !== undefined ? data.charts.houses["1"].cusp_deg : undefined));
    if (ascDegree !== undefined) {
        if (!birthArr.some(p => p.planet && p.planet.startsWith("Asc"))) {
            birthArr.push({ planet: "Ascendant", degree: ascDegree });
        }
    }

    const transitArr = Array.isArray(transitPositions) ? transitPositions : (transitPositions ? Object.entries(transitPositions).map(([k, v]) => ({ planet: k, ...v })) : []);

    // Calculate Tarabala and Chandrabala if we have birth and transit moon
    let tarabalaStr = "-";
    let chandrabalaStr = "-";
    const birthMoon = birthArr.find(p => p.planet === "Moon");
    const transitMoon = transitArr.find(p => p.planet === "Moon");

    if (birthMoon && transitMoon) {
        const bMoonDeg = birthMoon.degree !== undefined ? birthMoon.degree : (birthMoon.full_degree !== undefined ? birthMoon.full_degree : 0);
        const tMoonDeg = transitMoon.degree !== undefined ? transitMoon.degree : (transitMoon.full_degree !== undefined ? transitMoon.full_degree : 0);

        const bNak = Math.floor(bMoonDeg / 13.333333);
        const tNak = Math.floor(tMoonDeg / 13.333333);
        const taraIdx = (tNak - bNak + 27) % 9 + 1;
        const taraNames = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyak", "Sadhana", "Naidhana", "Mitra", "Parama Mitra"];
        tarabalaStr = `${taraIdx} (${taraNames[taraIdx - 1]})`;

        const bSign = Math.floor(bMoonDeg / 30);
        const tSign = Math.floor(tMoonDeg / 30);
        const chandraIdx = (tSign - bSign + 12) % 12 + 1;
        const goodChandra = [1, 3, 6, 7, 10, 11].includes(chandraIdx) ? "Auspicious" : "Inauspicious";
        chandrabalaStr = `${chandraIdx} (${goodChandra})`;
    }

    const gocharaDataList = [
        { label: "Gochara (Transits)", val: `${dateString} ${timeString}` },
        { label: "Tarabala", val: tarabalaStr },
        { label: "Chandrabala", val: chandrabalaStr },
        { label: "Tithi", val: transitPanchang?.tithi?.tithi_name || "-" },
        { label: "Karana", val: transitPanchang?.karana?.karana_name || "-" },
        { label: "Yoga", val: transitPanchang?.yoga?.yoga_name || "-" },
        { label: "Nakshatra", val: transitPanchang?.nakshatra?.nakshatra_name || "-" },
        { label: "Vimshottari", val: "-" },
        { label: "Narayana", val: "-" },
        { label: "Ashtottari", val: "-" }
    ];

    const extractPlanetData = (p) => {
        const full_deg = p.sidereal?.lon !== undefined ? p.sidereal.lon : (p.full_degree !== undefined ? p.full_degree : p.degree);
        const norm_deg = full_deg !== undefined ? full_deg % 30 : p.norm_degree;
        const rc = (p.is_retrograde || p.retrograde || (p.sidereal?.speed_lon !== undefined && p.sidereal.speed_lon < 0)) ? "Rc" : "";
        const rashiIdx = full_deg !== undefined ? Math.floor(full_deg / 30) : undefined;
        const rashiNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const rashi = rashiIdx !== undefined ? rashiNames[rashiIdx] : (p.zodiac_sign_name || p.sign);
        const nakStr = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.name : p.nakshatra;
        const nakLord = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.lord : p.nakshatra_lord;

        return {
            full_deg,
            norm_deg,
            rc,
            rashi: rashi ? String(rashi).substring(0, 3) : "",
            nakStr: nakStr ? String(nakStr).substring(0, 8) : "",
            nakLord: nakLord ? String(nakLord).substring(0, 2) : ""
        };
    };

    const transitsPlanetsList = transitArr.map(p => {
        const ext = extractPlanetData(p);
        return {
            p: PLANET_ABBREV[p.planet] || (p.planet ? p.planet.substring(0, 2) : "Un"),
            full_deg: ext.full_deg,
            deg: formatDegree(ext.norm_deg),
            nak: ext.nakStr,
            val: p.shadbala ? p.shadbala.toFixed(2) : ""
        };
    });



    const bDate = data?.basic_details?.birth_date || data?.meta?.dob || "-";
    const bTime = data?.basic_details?.birth_time || data?.meta?.tob || "-";
    const bLat = data?.basic_details?.lat || data?.meta?.lat || "-";
    const bLon = data?.basic_details?.lon || data?.meta?.lon || "-";
    const bTz = data?.meta?.timezone || data?.meta?.tz || "-";

    const birthInfo = [
        "Birth Chart",
        bDate,
        bTime,
        `Lat: ${bLat}`,
        `Lon: ${bLon}`,
        `Timezone: ${bTz}`,
        "Ayanamsha : Lahiri"
    ];



    const isAnti = direction === "Anti-Clockwise";
    const dirMult = isAnti ? -1 : 1;
    const baseOffset = startFrom === "Ascendant" && ascDegree !== undefined ? Math.floor(ascDegree / 30) * 30 : 0;
    const offset = isAnti ? -baseOffset : baseOffset;
    const ascSignIndex = startFrom === "Ascendant" && ascDegree !== undefined ? Math.floor(ascDegree / 30) : 0;

    const birthChartData = birthArr.map(p => {
        const ext = extractPlanetData(p);
        return {
            p: PLANET_ABBREV[p.planet] || (p.planet ? p.planet.substring(0, 2) : "Un"),
            full_deg: ext.full_deg,
            rc: ext.rc
        };
    });

    const gocharaData = transitArr.map(p => {
        const ext = extractPlanetData(p);
        return {
            p: PLANET_ABBREV[p.planet] || (p.planet ? p.planet.substring(0, 2) : "Un"),
            full_deg: ext.full_deg,
            rc: ext.rc
        };
    });

    const KAKSHA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Ascendant"];

    const kakshaData = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"].map(planetAbbrev => {
        const transitingPlanet = gocharaData.find(p => p.p === planetAbbrev);
        let lord = "-";
        let ash = "-";
        let sarv = "-";

        if (transitingPlanet && transitingPlanet.full_deg !== undefined) {
            const degInSign = transitingPlanet.full_deg % 30;
            const index = Math.floor(degInSign / 3.75);
            lord = KAKSHA_LORDS[index] ? KAKSHA_LORDS[index].substring(0, 3) : "-";

            const signIndex = Math.floor(transitingPlanet.full_deg / 30);

            if (avData) {
                const fullPlanetName = getPName(planetAbbrev);
                if (avData.bhinna && avData.bhinna[fullPlanetName]) {
                    ash = avData.bhinna[fullPlanetName][signIndex];
                }
                if (avData.samudaya && avData.samudaya[signIndex] !== undefined) {
                    sarv = avData.samudaya[signIndex];
                }
            }
        }
        return {
            p: planetAbbrev,
            kaks: lord,
            ash: ash,
            sarv: sarv
        };
    });

    useEffect(() => {
        if (birthChartData.length > 0 && gocharaData.length > 0) {
            const natal = {};
            birthChartData.forEach(p => { if (p.full_deg !== undefined) natal[getPName(p.p)] = p.full_deg; });
            const transit = {};
            gocharaData.forEach(p => { if (p.full_deg !== undefined) transit[getPName(p.p)] = p.full_deg; });

            fetch('/api/wheel/overlay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ natal_positions: natal, transit_positions: transit, offset: offset, is_anticlockwise: isAnti })
            })
                .then(res => res.json())
                .then(json => setWheelOverlay(json))
                .catch(e => console.error("Wheel API Error:", e));
        }
    }, [birthArr.length, transitPositions, offset, isAnti]);

    const renderWheel = () => {
        const cx = 500;
        const cy = 500;
        const rOuter = 480;
        const rMid = 360;
        const rInner = 200;

        // 12 segments
        const lines = [];
        for (let i = 0; i < 12; i++) {
            const angle = ((dirMult * i * 30) - 90) * (Math.PI / 180);
            const x1 = cx + rInner * Math.cos(angle);
            const y1 = cy + rInner * Math.sin(angle);
            const x2 = cx + (rOuter + 45) * Math.cos(angle);
            const y2 = cy + (rOuter + 45) * Math.sin(angle);
            lines.push(<line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#09090aff" strokeWidth="1" opacity="1" strokeDasharray="none" />);

            const numAngle = ((dirMult * ((i * 30) + 15)) - 90) * (Math.PI / 180);
            const nx = cx + (rOuter + 22) * Math.cos(numAngle);
            const ny = cy + (rOuter + 22) * Math.sin(numAngle);
            const displayNum = ((ascSignIndex + i) % 12) + 1; // 1 to 12
            lines.push(
                <text key={`num-${i}`} x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" fill="rgba(15, 15, 17, 1)" fontSize="30" fontWeight="bold" fontFamily="Arial, sans-serif">
                    {displayNum}
                </text>
            );
        }

        const displayDate = timeControlledDate || new Date();
        const dateString = displayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeString = displayDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return (
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full min-h-[500px]">
                <div className="absolute top-0 flex justify-center w-full z-20">
                    <div className="bg-white border-2 border-[#005c99] rounded-[15px] px-4 py-2 font-serif text-[#005c99] text-[14px] shadow-sm whitespace-nowrap">
                        Inner: Birth Chart - Outer: Gochara<br />(Transits)
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-[100%] items-center mt-12 w-full drop-shadow-sm">
                    <svg width="100%" height="100%" viewBox="-40 -40 1080 1080" style={{ overflow: 'visible', maxWidth: '500px', maxHeight: '500px' }}>
                        {/* Circles */}
                        <circle cx={cx} cy={cy} r={rOuter + 70} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r={rOuter} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r={rMid} fill="#fffbf2" stroke="#000080" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r={rInner} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r={cx - 15} fill="none" stroke="#000080" strokeWidth="2" />

                        {lines}

                        {/* Center Text */}
                        <text x={cx} y={cy - 25} textAnchor="middle" dominantBaseline="middle" fill="#000000" fontSize="40" fontWeight="bold" fontFamily="serif">{dateString}</text>
                        <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle" fill="#000000" fontSize="35" fontWeight="bold" fontFamily="serif">{timeString}</text>

                        {/* Birth Chart Planets (Inner Wheel) */}
                        {birthChartData.map((p, i) => {
                            if (p.full_deg === undefined) return null;
                            const angle = (((p.full_deg - offset) * dirMult) - 90) * (Math.PI / 180);
                            const pName = getPName(p.p);
                            const backendPos = wheelOverlay?.natal?.[pName];

                            const px = backendPos ? backendPos.x : cx + (250 + (i % 3) * 20) * Math.cos(angle);
                            const py = backendPos ? backendPos.y : cy + (250 + (i % 3) * 20) * Math.sin(angle);

                            const color = PLANET_COLORS[pName] || "#000000";
                            const lx1 = cx + rInner * Math.cos(angle);
                            const ly1 = cy + rInner * Math.sin(angle);
                            const lx2 = cx + (rInner + 10) * Math.cos(angle);
                            const ly2 = cy + (rInner + 10) * Math.sin(angle);
                            return (
                                <g key={`ip-${i}`}>
                                    <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#09090aff" strokeWidth="2" />
                                    <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold">
                                        {p.p}{p.rc ? <tspan fontSize="10" dy="-5" fill="#000000">R</tspan> : ""}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Gochara Planets (Outer Wheel) */}
                        {gocharaData.map((p, i) => {
                            if (p.full_deg === undefined) return null;
                            const angle = (((p.full_deg - offset) * dirMult) - 90) * (Math.PI / 180);
                            const pName = getPName(p.p);
                            const backendPos = wheelOverlay?.transit?.[pName];

                            const px = backendPos ? backendPos.x : cx + (390 + (i % 2) * 20) * Math.cos(angle);
                            const py = backendPos ? backendPos.y : cy + (390 + (i % 2) * 20) * Math.sin(angle);

                            const color = PLANET_COLORS[pName] || "#000000";
                            const lx1 = cx + rMid * Math.cos(angle);
                            const ly1 = cy + rMid * Math.sin(angle);
                            const lx2 = cx + (rMid - 10) * Math.cos(angle);
                            const ly2 = cy + (rMid - 10) * Math.sin(angle);
                            return (
                                <g key={`op-${i}`}>
                                    <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#000080" strokeWidth="1" />
                                    <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold">
                                        {p.p}{p.rc ? <tspan fontSize="10" dy="-5" fill="#000000">R</tspan> : ""}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-serif overflow-y-auto bg-[#ffc0cb]">
            {/* Top row: Time Control Engine */}
            <div className="w-full p-2 flex justify-center bg-[#1a1a2e] border-b border-[#333]">
                <CompactTransitControl
                    lat={data?.basic_details?.lat || 28.6}
                    lon={data?.basic_details?.lon || 77.2}
                    onTransitChange={(positions, dt) => {
                        setTransitPositions(positions);
                        setTimeControlledDate(dt);
                    }}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col p-2 w-full">
                {/* Top Row */}
                <div className="flex flex-row flex-1 min-h-[450px] mb-2 gap-2">

                    <div className="flex-[1.2] flex flex-col h-[500px]">
                        <div className="px-2 py-0 text-lg text-[#00008b] font-medium bg-white mb-1" style={{ borderRadius: '15px', border: '2px solid #005c99' }}>
                            Gochara (Transits)
                        </div>
                        <div className="flex-1 relative bg-[#fdfbf7] border-2 border-[#00008b]">
                            <div className="absolute inset-0 p-1">
                                {/* We use getTransitHouses() so the chart plots Transiting planets inside Natal houses */}
                                <ZodiacChart houses={getTransitHouses()} variant="legacy" defaultRect={true} scaleText={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Wheel Chart */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {renderWheel()}
                    </div>
                </div>

                {/* Bottom Row: 4 Data Boxes */}
                <div className="flex flex-row justify-between h-[250px] gap-2">

                    {/* Box 1: Gochara Data */}
                    <div className="flex-1 bg-white border border-[#005c99] rounded-sm shadow-sm flex flex-col text-[11px] overflow-hidden">
                        <div className="border-b border-[#005c99] px-2 py-0 text-base text-[#005c99] font-medium bg-white text-center" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                            Gochara (Transits) Gochara data
                        </div>
                        <div className="p-1 overflow-y-auto flex-1 leading-tight">
                            <table className="w-full text-left">
                                <tbody>
                                    {gocharaDataList.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="pr-2 w-24 align-top text-[14px]">{row.label}</td>
                                            <td className="truncate text-[14px]">{row.val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Box 2: Transits Planets */}
                    <div className="flex-1 bg-white border border-[#005c99] rounded-sm shadow-sm flex flex-col text-[11px] overflow-hidden">
                        <div className="border-b border-[#005c99] px-2 py-0 text-base text-[#005c99] font-medium bg-white text-center" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                            Gochara (Transits)
                        </div>
                        <div className="p-1 overflow-y-auto flex-1 leading-tight">
                            <table className="w-full text-left">
                                <tbody>
                                    {transitsPlanetsList.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-1 text-[14px]" style={{ color: PLANET_COLORS[getPName(row.p)] }}>{row.p}</td>
                                            <td className="px-1 text-[14px]">{row.deg}</td>
                                            <td className="px-1 text-[14px]">{row.nak}</td>
                                            <td className="px-1 text-[14px]">{row.val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Box 3: Kakshas */}
                    <div className="flex-1 bg-white border border-[#005c99] rounded-sm shadow-sm flex flex-col text-[11px] overflow-hidden">
                        <div className="border-b border-[#005c99] px-2 py-0 text-base text-[#005c99] font-medium bg-white text-center" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                            Gochara (Transits) Kakshas
                        </div>
                        <div className="p-1 overflow-y-auto flex-1 leading-tight">
                            <table className="w-full text-left text-[#00008b]">
                                <thead>
                                    <tr className="border-b border-gray-400 italic">
                                        <th className="font-normal px-1"></th>
                                        <th className="font-normal text-[14px]">Kaks.</th>
                                        <th className="font-normal text-[14px]">Ash.</th>
                                        <th className="font-normal text-[14px]">Sarv.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kakshaData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-1 text-[14px]" style={{ color: PLANET_COLORS[getPName(row.p)] }}>{row.p}</td>
                                            <td className="px-1 text-[14px]">{row.kaks}</td>
                                            <td className="px-1 text-[14px]">{row.ash}</td>
                                            <td className="px-1 text-[14px]">{row.sarv}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Box 4: Birth data */}
                    <div className="flex-1 bg-white border border-[#005c99] rounded-sm shadow-sm flex flex-col text-[11px] overflow-hidden">
                        <div className="border-b border-[#005c99] px-2 py-0 text-base text-[#005c99] font-medium bg-white text-center" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                            Gochara (Transits) Birth data
                        </div>
                        <div className="p-1 overflow-y-auto flex-1 flex flex-col items-center justify-center leading-tight text-center sm:text-[12px] md:text-[14px] text-[#00008b]">
                            {birthInfo.map((line, idx) => (
                                <div key={idx}>{line}</div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
