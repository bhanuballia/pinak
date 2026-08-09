import React, { useState, useEffect } from "react";
import { PLANET_IN_SIGN_EFFECTS } from "../data/planetInSign";
import { getDignityStatus, SIGNS } from "./worksheet/WorksheetUtils";
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

export default function GocharaWheelView({ data }) {
    const [transitPositions, setTransitPositions] = useState(null);
    const [timeControlledDate, setTimeControlledDate] = useState(null);
    const [wheelOverlay, setWheelOverlay] = useState(null);
    const [startFrom, setStartFrom] = useState("Ascendant");
    const [direction, setDirection] = useState("Anti-Clockwise");
    const [avData, setAvData] = useState(null);
    const theme = "Classic";

    // Fetch transit positions
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
                } catch (e) {
                    console.error("Failed to fetch transits", e);
                }
            };
            fetchTransit();
        } else if (data?.transit) {
            setTransitPositions(data.transit);
        }
    }, [data, transitPositions]);

    // Fetch Ashtakavarga data for transits
    useEffect(() => {
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
    }, [data]);

    const birthArr = Array.isArray(data?.planet_positions) ? [...data.planet_positions] : (data?.planet_positions ? Object.entries(data.planet_positions).map(([k, v]) => ({ planet: k, ...v })) : []);
    const transitArr = Array.isArray(transitPositions) ? [...transitPositions] : (transitPositions ? Object.entries(transitPositions).map(([k, v]) => ({ planet: k, ...v })) : []);

    const ascDegree = data?.charts?.ascendant_degree !== undefined ? data.charts.ascendant_degree :
        (data?.charts?.houses?.[1]?.cusp_deg !== undefined ? data.charts.houses[1].cusp_deg :
            (data?.charts?.houses?.["1"]?.cusp_deg !== undefined ? data.charts.houses["1"].cusp_deg : undefined));
    if (ascDegree !== undefined) {
        if (!birthArr.some(p => p.planet && p.planet.startsWith("Asc"))) {
            birthArr.push({ planet: "Ascendant", degree: ascDegree });
        }
    }

    const isAnti = direction === "Anti-Clockwise";
    const dirMult = isAnti ? -1 : 1;
    const baseOffset = startFrom === "Ascendant" && ascDegree !== undefined ? Math.floor(ascDegree / 30) * 30 : 0;
    const offset = isAnti ? -baseOffset : baseOffset;
    const ascSignIndex = startFrom === "Ascendant" && ascDegree !== undefined ? Math.floor(ascDegree / 30) : 0;

    const extractPlanetData = (p) => {
        const full_deg = p.sidereal?.lon !== undefined ? p.sidereal.lon : (p.full_degree !== undefined ? p.full_degree : p.degree);
        const norm_deg = full_deg !== undefined ? full_deg % 30 : p.norm_degree;
        const rc = (p.is_retrograde || p.retrograde || (p.sidereal?.speed_lon !== undefined && p.sidereal.speed_lon < 0)) ? "Rc" : "";
        const rashiIdx = full_deg !== undefined ? Math.floor(full_deg / 30) : undefined;
        const rashiNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const rashi = rashiIdx !== undefined ? rashiNames[rashiIdx] : (p.zodiac_sign_name || p.sign);
        const nakStr = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.name : p.nakshatra;
        const nakLord = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.lord : p.nakshatra_lord;
        const nama = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.pada_sound || p.nama || "" : p.nama || "";
        const pada = p.nakshatra && typeof p.nakshatra === "object" ? p.nakshatra.pada || "" : "";
        const subLord = p.sub_lord || "";
        const subSubLord = p.sub_sub_lord || "";

        const nakLordAbbr = nakLord ? String(nakLord).substring(0, 2) : "";
        const subLordAbbr = subLord ? String(subLord).substring(0, 2) : "";
        const subSubLordAbbr = subSubLord ? String(subSubLord).substring(0, 2) : "";

        let pldFull = nakLordAbbr;
        if (pada || subLordAbbr || subSubLordAbbr) {
            pldFull = `${pada ? pada + ',' : ''}${nakLordAbbr}${subLordAbbr ? '/' + subLordAbbr : ''}${subSubLordAbbr ? '/' + subSubLordAbbr : ''}`;
        }

        return {
            full_deg,
            norm_deg,
            rc,
            rashi: rashi ? String(rashi).substring(0, 3) : "",
            nakStr: nakStr ? String(nakStr).substring(0, 8) : "",
            nakLord: nakLordAbbr,
            nama: nama,
            pldFull: pldFull
        };
    };

    // Map birth chart data
    const birthChartData = birthArr.map(p => {
        const ext = extractPlanetData(p);
        const pStrength = data?.strength?.planets?.[p.planet];
        const dignity = pStrength?.dignity || p.dignity || "";
        const sbValue = pStrength?.total !== undefined ? (pStrength.total * 10).toFixed(0) : (p.shadbala ? p.shadbala.toFixed(2) : "");

        return {
            p: PLANET_ABBREV[p.planet] || (p.planet ? p.planet.substring(0, 2) : "Un"),
            full_deg: ext.full_deg,
            deg: formatDegree(ext.norm_deg),
            rc: ext.rc,
            rashi: ext.rashi,
            nak: ext.nakStr,
            nama: ext.nama,
            pld: ext.pldFull,
            dig: dignity,
            sb: sbValue
        };
    });

    // Map gochara data
    const gocharaData = transitArr.map(p => {
        const ext = extractPlanetData(p);
        const planetName = p.planet;
        let dignityLabel = p.dignity || "";
        if (!dignityLabel && planetName && ext.full_deg !== undefined) {
            const fullSignIdx = Math.floor(ext.full_deg / 30);
            const fullSignName = SIGNS[fullSignIdx];
            const digStat = getDignityStatus(planetName, fullSignName);
            if (digStat) dignityLabel = digStat.label;
        }

        return {
            p: PLANET_ABBREV[p.planet] || (p.planet ? p.planet.substring(0, 2) : "Un"),
            full_deg: ext.full_deg,
            deg: formatDegree(ext.norm_deg),
            rc: ext.rc,
            rashi: ext.rashi,
            nak: ext.nakStr,
            nama: ext.nama,
            pld: ext.pldFull,
            dig: dignityLabel,
            sb: "-"
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

    // Calculate Kaksha for transiting planets
    const KAKSHA_LORDS = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Ascendant"];

    const kakshaData = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"].map(planetAbbrev => {
        const transitingPlanet = gocharaData.find(p => p.p === planetAbbrev);
        let lord = "-";
        let ash = "-";
        let sarv = "-";

        if (transitingPlanet && transitingPlanet.full_deg !== undefined) {
            const degInSign = transitingPlanet.full_deg % 30;
            const index = Math.floor(degInSign / 3.75);
            // Convert to 2-letter abbreviation for display or keep full name
            lord = KAKSHA_LORDS[index] ? KAKSHA_LORDS[index].substring(0, 3) : "-";

            // Map transiting sign index
            const signIndex = Math.floor(transitingPlanet.full_deg / 30);

            // Fetch Ash and Sarv from avData using signIndex
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


    const renderTable = (title, dataArray) => {
        if (theme === "Classic") {
            return (
                <div className="bg-white border border-[#005c99] rounded-sm shadow-sm font-serif text-[12px] flex flex-col w-full mb-2">
                    <div className="border-b border-[#005c99] px-2 py-0 text-lg text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                        {title}
                    </div>
                    <div className="p-1 overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-400 italic">
                                    <th className="font-normal px-1 w-6"></th>
                                    <th className="font-normal px-1">Degree</th>
                                    <th className="font-normal px-1">RC</th>
                                    <th className="font-normal px-1">Rashi</th>
                                    <th className="font-normal px-1">Nakshatra</th>
                                    <th className="font-normal px-1">Nama</th>
                                    <th className="font-normal px-1">p#,lrd/sb/ssb</th>
                                    <th className="font-normal px-1">Dignity</th>
                                    {title !== "Gochara (Transits)" && <th className="font-normal px-1">SB%</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {dataArray.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="px-1" style={{ color: PLANET_COLORS[getPName(row.p)] }}>{row.p}</td>
                                        <td className="px-1">{row.deg}</td>
                                        <td className="px-1">{row.rc}</td>
                                        <td className="px-1">{row.rashi}</td>
                                        <td className="px-1">{row.nak}</td>
                                        <td className="px-1">{row.nama}</td>
                                        <td className="px-1">{row.pld}</td>
                                        <td className="px-1">{row.dig}</td>
                                        {title !== "Gochara (Transits)" && <td className="px-1">{row.sb}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="mb-8 relative z-10">
                <div className="text-xl font-bold mb-3 text-[#8B6914] flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full inline-block shadow-[0_0_8px_#D4AF37]"></span>
                    {title}
                </div>
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(139,105,20,0.1)] overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-[#D4AF37]/30 text-[#8B6914]">
                            <tr>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Planet</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Degree</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Sign</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Nakshatra</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataArray.map((row, idx) => (
                                <tr key={idx} className="border-b border-[#D4AF37]/10 hover:bg-white/50 transition-colors duration-200">
                                    <td className="py-3 px-2 font-medium flex items-center gap-2">
                                        <span className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-white" style={{ color: PLANET_COLORS[getPName(row.p)] || '#333' }}>
                                            {row.p}
                                        </span>
                                        {row.rc && <span className="text-[10px] font-bold tracking-wider bg-red-100/80 text-red-700 px-1.5 py-0.5 rounded border border-red-200">Rx</span>}
                                    </td>
                                    <td className="py-3 px-2 text-gray-800 font-medium">{formatDegree(row.norm_deg)}</td>
                                    <td className="py-3 px-2 text-black medium">{row.rashi}</td>
                                    <td className="py-3 px-2 text-gray-700">
                                        {row.nakStr} <span className="text-xs text-[#8B6914] ml-1">({row.nakLord})</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderKakshaTable = () => {
        if (theme === "Classic") {
            return (
                <div className="bg-white border border-[#005c99] rounded-sm shadow-sm font-serif text-[12px] flex flex-col w-full">
                    <div className="border-b border-[#005c99] px-2 py-0 text-lg text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                        Kakshas
                    </div>
                    <div className="p-1 overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-400 italic">
                                    <th className="font-normal px-1 w-6"></th>
                                    <th className="font-normal px-1">Kaks.</th>
                                    <th className="font-normal px-1">Ash.</th>
                                    <th className="font-normal px-1">Sarv.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kakshaData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="px-1" style={{ color: PLANET_COLORS[getPName(row.p)] }}>{row.p}</td>
                                        <td className="px-1">{row.kaks}</td>
                                        <td className="px-1">{row.ash}</td>
                                        <td className="px-1">{row.sarv}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="mb-8 relative z-10">
                <div className="text-xl font-bold mb-3 text-[#8B6914] flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full inline-block shadow-[0_0_8px_#D4AF37]"></span>
                    Kaksha Data (Mock)
                </div>
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(139,105,20,0.1)] overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-[#D4AF37]/30 text-[#8B6914]">
                            <tr>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">P</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Kaks</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Ash</th>
                                <th className="pb-3 px-2 font-semibold uppercase tracking-wider text-xs">Sarv</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kakshaData.map((row, idx) => (
                                <tr key={idx} className="border-b border-[#D4AF37]/10 hover:bg-white/50 transition-colors duration-200">
                                    <td className="py-2.5 px-2 font-medium text-gray-800 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs border border-white" style={{ color: PLANET_COLORS[getPName(row.p)] || '#333' }}>
                                            {row.p}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-2 text-gray-700">{row.kaks}</td>
                                    <td className="py-2.5 px-2 text-gray-700">{row.ash}</td>
                                    <td className="py-2.5 px-2 text-gray-700">{row.sarv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Creates an SVG double wheel
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
            lines.push(<line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="segment-line" />);

            // House numbers (placed on the very outside edge)
            const numAngle = ((dirMult * ((i * 30) + 15)) - 90) * (Math.PI / 180);
            const nx = cx + (rOuter + 22) * Math.cos(numAngle);
            const ny = cy + (rOuter + 22) * Math.sin(numAngle);

            // Map 0 deg = Aries (1). At 3 o'clock, that is angle 0. We'll put Aries at 3 o'clock for now.
            // If i=0 (0 to 30 deg), number = 1
            const displayNum = ((ascSignIndex + i) % 12) + 1; // 1 to 12
            if (theme === "Classic") {
                lines.push(
                    <text key={`num-${i}`} x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" fill="rgba(15, 15, 17, 1)" fontSize="30" fontWeight="bold" fontFamily="Arial, sans-serif">
                        {displayNum}
                    </text>
                );
            } else {
                lines.push(
                    <text key={`num-${i}`} x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" fill="#8B6914" fontSize="22" fontWeight="bold" className="cinzel-text drop-shadow-sm">
                        {displayNum}
                    </text>
                );
            }
        }

        // Current Date formatting
        const displayDate = timeControlledDate || new Date();
        const dateString = displayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeString = displayDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return (
            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                <div className="absolute top-0 left-0 bg-white/40 backdrop-blur-md border border-white/60 px-5 py-3 rounded-2xl shadow-[0_8px_32px_rgba(139,105,20,0.1)] z-10 flex flex-col gap-2">
                    <div className="text-[#8B6914] font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full inline-block"></span>
                        Chart Controls


                    </div>

                </div>

                {theme === "Classic" ? (
                    <div className="flex-1 flex flex-col justify-top max-w-[100%] items-top mr-2 mt-16">
                        <svg width="500" height="500" viewBox="-40 -40 1080 1080" style={{ overflow: 'visible' }}>
                            {/* Circles */}
                            <circle cx={cx} cy={cy} r={rOuter + 70} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                            <circle cx={cx} cy={cy} r={rOuter} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                            <circle cx={cx} cy={cy} r={rMid} fill="#fffbf2" stroke="#000080" strokeWidth="2" />
                            <circle cx={cx} cy={cy} r={rInner} fill="#fdfaf3" stroke="#000080" strokeWidth="2" />
                            <circle cx={cx} cy={cy} r={cx - 15} fill="none" stroke="#000080" strokeWidth="2" />

                            {/* Lines */}
                            {lines.map((el, idx) => {
                                if (el.type === 'line') return React.cloneElement(el, { stroke: 'rgba(14, 14, 17, 1)', strokeWidth: '1', opacity: '1', strokeDasharray: 'none' });
                                return el;
                            })}

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
                ) : (
                    <div className="flex-1 flex flex-col justify-center max-w-[100%] items-center mt-2 drop-shadow-2xl">
                        <svg width="600" height="600" viewBox="0 0 1000 1000">
                            <defs>
                                <style>
                                    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
                                    {`
                                    .cinzel-text { font-family: 'Cinzel', serif; }
                                    .planet-node { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                                    .planet-node:hover { transform: scale(1.2); cursor: pointer; }
                                    .wheel-bg { fill: #FFFCF7; }
                                    .wheel-stroke { stroke: url(#goldGradient); stroke-width: 4; }
                                    .segment-line { stroke: url(#goldGradient); stroke-width: 2; opacity: 0.5; stroke-dasharray: 4 4; }
                                `}
                                </style>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#BF953F" />
                                    <stop offset="25%" stopColor="#FCF6BA" />
                                    <stop offset="50%" stopColor="#B38728" />
                                    <stop offset="75%" stopColor="#FBF5B7" />
                                    <stop offset="100%" stopColor="#AA771C" />
                                </linearGradient>
                                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.15" floodColor="#8B6914" />
                                </filter>
                            </defs>

                            {/* Circles */}
                            <circle cx={cx} cy={cy} r={rOuter} className="wheel-bg" filter="url(#dropShadow)" />
                            <circle cx={cx} cy={cy} r={rOuter} fill="none" className="wheel-stroke" />
                            <circle cx={cx} cy={cy} r={rMid} fill="none" className="wheel-stroke" opacity="0.6" strokeDasharray="8 4" />
                            <circle cx={cx} cy={cy} r={rInner} fill="#FFF9EF" filter="url(#dropShadow)" />
                            <circle cx={cx} cy={cy} r={rInner} fill="none" className="wheel-stroke" />
                            <circle cx={cx} cy={cy} r={cx - 15} fill="none" className="wheel-stroke" strokeWidth="8" opacity="0.3" />

                            {/* Lines */}
                            {lines}

                            {/* Center Text */}
                            <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fill="#8B6914" fontSize="26" fontWeight="bold" className="cinzel-text">{dateString}</text>
                            <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="middle" fill="#8B6914" fontSize="16" fontWeight="600" className="cinzel-text" opacity="0.8">{timeString}</text>

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
                                const lx2 = cx + (rInner + 20) * Math.cos(angle);
                                const ly2 = cy + (rInner + 20) * Math.sin(angle);
                                const transformStr = `translate(${px}, ${py})`;
                                return (
                                    <g key={`ip-${i}`}>
                                        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="url(#goldGradient)" strokeWidth="2" opacity="0.6" />
                                        <g transform={transformStr}>
                                            <g className="planet-node">
                                                <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="url(#goldGradient)" strokeWidth="2" filter="url(#dropShadow)" />
                                                <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="20" fontWeight="bold" className="cinzel-text">
                                                    {p.p}{p.rc ? <tspan fontSize="12" dy="-8" fill="#e53e3e">R</tspan> : ""}
                                                </text>
                                            </g>
                                        </g>
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
                                const lx2 = cx + (rMid - 20) * Math.cos(angle);
                                const ly2 = cy + (rMid - 20) * Math.sin(angle);
                                const transformStr = `translate(${px}, ${py})`;
                                return (
                                    <g key={`op-${i}`}>
                                        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="url(#goldGradient)" strokeWidth="2" opacity="0.6" />
                                        <g transform={transformStr}>
                                            <g className="planet-node">
                                                <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="url(#goldGradient)" strokeWidth="2" filter="url(#dropShadow)" />
                                                <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="20" fontWeight="bold" className="cinzel-text">
                                                    {p.p}{p.rc ? <tspan fontSize="12" dy="-8" fill="#e53e3e">R</tspan> : ""}
                                                </text>
                                            </g>
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    const renderAnalysisPanel = (title, planetDataArray, isTransit) => {
        if (!planetDataArray || planetDataArray.length === 0) return null;

        return (
            <div className="mt-8 mb-8 relative z-10 w-full">
                <div className="text-[15x] font-bold mb-3 text-[#8B6914] flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full inline-block shadow-[0_0_8px_#D4AF37]"></span>
                    {title}
                </div>
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(139,105,20,0.1)] overflow-hidden space-y-4">
                    {planetDataArray.map((row, idx) => {
                        const planet = getPName(row.p);
                        const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                        if (!valid.includes(planet)) return null;

                        const full_deg = row.full_deg;
                        if (full_deg === undefined) return null;

                        const signIdx = Math.floor(full_deg / 30);
                        const houseNum = ((signIdx - ascSignIndex + 12) % 12) + 1;
                        const signName = SIGNS[signIdx] || row.rashi;
                        const isRetro = row.rc === "Rc";

                        const planetData = PLANET_IN_SIGN_EFFECTS[planet];
                        const signData = planetData?.signs?.[signName];
                        const signEffect = signData?.effect;
                        const houseEffect = signData?.houses?.[String(houseNum)];

                        const houseLabel = houseNum === 1 ? '1st' : houseNum === 2 ? '2nd' : houseNum === 3 ? '3rd' : `${houseNum}th`;
                        const dignity = getDignityStatus(planet, signName);

                        return (
                            <section key={idx} className={`bg-white/80 rounded-xl border border-indigo-100 shadow-sm border-l-4 border-l-indigo-400 overflow-hidden relative`}>
                                <div className="absolute top-0 right-0 p-3 opacity-[0.05] text-6xl font-black text-indigo-900 pointer-events-none select-none">{houseNum}</div>

                                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm shadow-md border border-white/10 flex-shrink-0">✨</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[planet] || '#1e293b' }}>
                                                {planet}{isRetro ? '*' : ''} {isTransit ? 'Transit' : 'Natal'}
                                            </h4>
                                            {dignity && (
                                                <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase border ${dignity.bg} ${dignity.text} ${dignity.border}`}>
                                                    {dignity.label}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-[20px] font-bold text-black uppercase tracking-widest">{signName} · House {houseLabel}</span>
                                            {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase">Vakri ℞</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 pb-4 space-y-3">
                                    {signEffect && (
                                        <div>
                                            <p className="text-[15px] font-bold text-black case tracking-widest mb-1">In {signName} (Sign)</p>
                                            <p className="text-sm leading-relaxed text-slate-700 font-serif">
                                                {signEffect}
                                            </p>
                                        </div>
                                    )}

                                    {houseEffect && (
                                        <div className="pt-3 border-t border-indigo-50/50">
                                            <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {houseLabel} House ({isTransit ? 'Transiting' : 'Natal'})</p>
                                            <p className="text-sm leading-relaxed text-slate-700 font-serif">
                                                {houseEffect}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen w-full flex flex-col font-serif overflow-y-auto ${theme === 'Classic' ? 'bg-[#ffc0cb]' : 'bg-[#fff0d6]'}`}>
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
            <div className="flex-1 flex p-4 w-full">
                {/* Left: Wheel */}
                <div className="flex-1 flex flex-col relative">
                    {theme === "Classic" && (
                        <div className="absolute top-0 left-0 bg-white border-2 border-[#00008b] rounded-[15px] px-4 py-2 font-serif text-[#00008b] text-[14px] z-20 shadow-md">
                            Inner: Birth Chart - Outer: Gochara<br />(Transits)
                        </div>
                    )}
                    {renderWheel()}
                </div>

                {/* Right: Tables */}
                <div className={`flex-1 flex flex-col max-w-[45%] ml-auto ${theme === 'Classic' ? 'gap-2' : ''}`}>
                    {renderTable("Birth Chart", birthChartData)}
                    {renderTable("Gochara (Transits)", gocharaData)}
                    {renderKakshaTable()}

                </div>
            </div>
        </div>
    );
}
