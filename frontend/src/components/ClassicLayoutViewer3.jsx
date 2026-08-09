import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ZodiacChart from "./ZodiacChart";
import VimshottariTable from "./VimshottariTable";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const ABBREV = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" };
const PLANET_COLORS_CLASSIC = { Sun: "#cc0000", Moon: "#000000", Mars: "#cc0000", Mercury: "#008000", Jupiter: "#ff8c00", Venus: "#ff00ff", Saturn: "#0000ff", Rahu: "#888888", Ketu: "#888888" };

const ShadbalaRatioChart = ({ title, data }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-[#8ec5e6] overflow-hidden">
            <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 text-[11px] font-bold tracking-tight text-[#0a4d7a] flex justify-between items-center">
                <span>{title}</span>
            </div>
            <div className="flex-1 relative border-x border-b border-black overflow-hidden m-2 shadow-sm">
                <div className="absolute inset-0 top-0 h-1/2 bg-[#009900]"></div>
                <div className="absolute inset-0 top-1/2 h-1/2 bg-[#ff0000]"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-10"></div>
                <div className="absolute inset-0 flex flex-row items-end gap-1 px-1">
                    {data.slice(0, 7).map(s => {
                        const ratio = s.shadbala;
                        const clampedRatio = Math.min(Math.max(ratio, 0), 2.0);
                        const barHeightPct = (clampedRatio / 2.0) * 100;
                        return (
                            <div key={s.name} className="relative flex-1 border-r border-black last:border-r-0 flex flex-col justify-end items-center" style={{ height: `${barHeightPct}%`, backgroundColor: "#fffff0", borderTop: "1px solid #000", borderLeft: "1px solid #000" }}>
                                <span className="text-[12px] font-bold font-serif leading-none mb-0.5" style={{ color: PLANET_COLORS_CLASSIC[s.name] }}>{ABBREV[s.name]}</span>
                                <span className="text-[10px] font-serif leading-none mb-2 text-black">{ratio.toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshta",
    "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const NAKSHATRA_LORDS_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const NAKSHATRA_NAMA_AKSHARAS = [
    ["Chu", "Che", "Cho", "La"],      // Ashwini
    ["Lee", "Loo", "Lay", "Lo"],      // Bharani
    ["A", "Ee", "Oo", "Ea"],          // Krittika
    ["O", "Va", "Vi", "Vu"],          // Rohini
    ["Ve", "Vo", "Ka", "Ki"],         // Mrigashira
    ["Ku", "Gha", "Ng", "Chha"],      // Ardra
    ["Ke", "Ko", "Ha", "Hi"],         // Punarvasu
    ["Hu", "He", "Ho", "Da"],         // Pushya
    ["De", "Do", "De", "Do"],         // Ashlesha
    ["Ma", "Mi", "Mu", "Me"],         // Magha
    ["Mo", "Ta", "Ti", "Tu"],         // Purva Phalguni
    ["Te", "To", "Pa", "Pee"],        // Uttara Phalguni
    ["Pu", "Sha", "Na", "Tha"],       // Hasta
    ["Pe", "Po", "Ra", "Re"],         // Chitra
    ["Ru", "Re", "Ro", "Ta"],         // Swati
    ["Ti", "Tu", "Te", "To"],         // Vishakha
    ["Na", "Ni", "Nu", "Ne"],         // Anuradha
    ["No", "Ya", "Yi", "Yu"],         // Jyeshta
    ["Ye", "Yo", "Bha", "Bhi"],       // Moola
    ["Bhu", "Dha", "Pha", "Dha"],     // Purva Ashadha
    ["Bhe", "Bho", "Ja", "Ji"],       // Uttara Ashadha
    ["Ju", "Khe", "Kho", "Ga"],       // Shravana
    ["Ga", "Gi", "Gu", "Ge"],         // Dhanishta
    ["Go", "Sa", "Si", "Su"],         // Shatabhisha
    ["Se", "So", "Da", "Di"],         // Purva Bhadrapada
    ["Du", "Tha", "Jha", "Da"],       // Uttara Bhadrapada
    ["De", "Do", "Cha", "Chi"]        // Revati
];

const formatDegInSign = (absDeg) => {
    if (typeof absDeg !== 'number') return '00°00\'00"';
    const degInSign = (absDeg % 30 + 30) % 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign - d) * 60);
    const s = Math.floor(((degInSign - d) * 60 - m) * 60);
    return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

const DegreeTable = ({ pPos, worksheetData }) => {
    const lagnaSignIndex = getLagnaSignIndex(worksheetData || {});
    const ascendantDeg = worksheetData?.charts?.houses?.[1]?.cusp_deg ?? worksheetData?.charts?.houses?.["1"]?.cusp_deg ?? pPos.find(x => x.is_ascendant || x.planet === "Ascendant" || x.name === "Ascendant")?.degree ?? 0;

    const rows = [
        { id: "As", name: "Ascendant", isLagna: true, color: "#ff8c00" },
        ...PLANETS.map(p => ({ id: p, name: p, color: PLANET_COLORS_CLASSIC[p] }))
    ];

    return (
        <div className="flex-1 overflow-auto custom-scrollbar bg-[#ffffe0]">
            <table className="w-full text-[11px] font-serif text-left border-collapse">
                <thead className="bg-[#f0f0f0] border-b border-[#cccccc] shadow-sm sticky top-0 z-10">
                    <tr>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]"></th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Degree</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">RC</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Nakshatra</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Nama</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">p#,lrd/sb/ssb</th>
                        <th className="font-normal px-2 py-1">Func.</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => {
                        let absDeg = 0;
                        let found = null;
                        let isRetro = false;
                        let isCombust = false;

                        if (r.isLagna) {
                            absDeg = ascendantDeg;
                        } else {
                            found = pPos.find(x => x.name === r.id || x.planet === r.id);
                            absDeg = found?.degree ?? found?.normDegree ?? 0;
                            isRetro = !!(found?.is_retrograde || found?.retrograde);
                            isCombust = !!(found?.is_combust || found?.combust);
                        }

                        let rc = "";
                        if (isRetro && isCombust) rc = "RC";
                        else if (isRetro) rc = "R";
                        else if (isCombust) rc = "C";

                        const nakIdx = Math.floor(((absDeg % 360 + 360) % 360) / (360 / 27));
                        const degInNak = ((absDeg % 360 + 360) % 360) % (360 / 27);
                        const pada = Math.floor(degInNak / ((360 / 27) / 4)) + 1;

                        const nakName = found?.nakshatra || NAKSHATRA_NAMES[nakIdx] || "Ashwini";
                        const namaAkshara = found?.nama_akshara || found?.nama || NAKSHATRA_NAMA_AKSHARAS[nakIdx]?.[pada - 1] || "-";

                        const starLord = found?.nakshatra_lord || found?.star_lord || NAKSHATRA_LORDS_ORDER[nakIdx % 9];
                        const starLordAbbrev = ABBREV[starLord] || starLord.substring(0, 2);

                        const subLord = found?.sub_lord || found?.sub || NAKSHATRA_LORDS_ORDER[(nakIdx + pada) % 9];
                        const subLordAbbrev = ABBREV[subLord] || subLord.substring(0, 2);

                        const ssb = found?.sub_sub_lord || found?.ssb || NAKSHATRA_LORDS_ORDER[(nakIdx + pada + 1) % 9];
                        const ssbAbbrev = ABBREV[ssb] || ssb.substring(0, 2);

                        const pLrdStr = `${pada},${starLordAbbrev}/${subLordAbbrev}/${ssbAbbrev}`;
                        const funcStr = getFunctionalNature(lagnaSignIndex, r.id);
                        const funcColor = funcStr === "Benefic" ? "text-emerald-700 font-semibold" : funcStr === "Malefic" ? "text-red-700 font-semibold" : "text-amber-700 font-semibold";

                        return (
                            <tr key={r.id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fffacd] transition-colors">
                                <td className="px-2 py-1 font-bold border-r border-[#eeeeee]" style={{ color: r.color }}>{r.name}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] font-mono">{formatDegInSign(absDeg)}</td>
                                <td className="px-2 py-1 text-red-700 font-bold border-r border-[#eeeeee]">{rc}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{nakName}</td>
                                <td className="px-2 py-1 text-indigo-900 font-bold border-r border-[#eeeeee]">{namaAkshara}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] font-mono">{pLrdStr}</td>
                                <td className={`px-2 py-1 ${funcColor}`}>{funcStr}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const getLagnaSignIndex = (data) => {
    const lagnaHouse = data?.charts?.houses?.[1] || data?.charts?.houses?.["1"] || {};
    let idx = lagnaHouse.sign_index;
    if (idx === undefined && lagnaHouse.cusp_deg !== undefined) {
        idx = Math.floor(lagnaHouse.cusp_deg / 30);
    }
    if (idx === undefined) {
        idx = data?.charts?.ascendant_sign_index || 0;
    }
    return idx;
};

const getFunctionalNature = (lagnaIdx, planetName) => {
    const lagnaMap = {
        0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
        2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
        3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
        5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
        6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
        7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
        9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
        10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
        11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
    };
    const lagnaData = lagnaMap[lagnaIdx] || { benefic: [], malefic: [] };
    if (planetName === "Rahu" || planetName === "Ketu") return "Malefic";
    if (lagnaData.benefic.includes(planetName)) return "Benefic";
    if (lagnaData.malefic.includes(planetName)) return "Malefic";
    return "Neutral";
};

const calculateJaiminiKarakas = (planetPositions) => {
    if (!planetPositions || !Array.isArray(planetPositions)) return {};
    const planetsFor7 = planetPositions.filter(p => !["Rahu", "Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet || p.name));
    const sorted7 = [...planetsFor7].sort((a, b) => ((b.degree || b.normDegree || 0) % 30) - ((a.degree || a.normDegree || 0) % 30));
    const k7Names = ["AK", "AmK", "BK", "MK", "PiK", "GK", "DK"];
    const k7 = {};
    sorted7.forEach((p, idx) => {
        if (idx < 7) k7[p.planet || p.name] = k7Names[idx];
    });
    return k7;
};

const getSBRanks = (strengthPlanets) => {
    if (!strengthPlanets) return {};
    const validPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const sbList = validPlanets.map(p => ({
        planet: p,
        sb: strengthPlanets[p]?.total || strengthPlanets[p]?.ratio_data?.ratio || 0
    }));
    sbList.sort((a, b) => b.sb - a.sb);
    const ranks = {};
    sbList.forEach((item, idx) => {
        if (item.sb > 0) ranks[item.planet] = idx + 1;
    });
    return ranks;
};

const getBaladiAge = (deg, signIdx) => {
    const degInSign = (deg || 0) % 30;
    const isOddSign = (signIdx || 0) % 2 === 0;
    if (isOddSign) {
        if (degInSign < 6) return "Infant";
        if (degInSign < 12) return "Youth";
        if (degInSign < 18) return "Adult";
        if (degInSign < 24) return "Old";
        return "Dead";
    } else {
        if (degInSign < 6) return "Dead";
        if (degInSign < 12) return "Old";
        if (degInSign < 18) return "Adult";
        if (degInSign < 24) return "Youth";
        return "Infant";
    }
};

const DignityTable = ({ shadbalaData, worksheetData }) => {
    const rows = PLANETS.map(p => ({ id: p, name: p, color: PLANET_COLORS_CLASSIC[p] }));
    const positionArray = Array.isArray(worksheetData?.planet_positions) ? worksheetData.planet_positions : Object.values(worksheetData?.planet_positions || {});
    const lagnaSignIndex = getLagnaSignIndex(worksheetData || {});
    const k7 = calculateJaiminiKarakas(positionArray);
    const sbRanks = getSBRanks(worksheetData?.strength?.planets);
    const avasthas = worksheetData?.planetary_avasthas || {};

    return (
        <div className="flex-1 overflow-auto custom-scrollbar bg-[#ffffe0]">
            <table className="w-full text-[11px] font-serif text-left border-collapse">
                <thead className="bg-[#f0f0f0] border-b border-[#cccccc] shadow-sm sticky top-0 z-10">
                    <tr>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]"></th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Dignity</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">SB%</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">SB#</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">VB</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">AV</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Av3</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">Av5</th>
                        <th className="font-normal px-2 py-1 border-r border-[#cccccc]">K7</th>
                        <th className="font-normal px-2 py-1">Func.</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => {
                        const pName = r.id;
                        const p = positionArray.find(pos => pos.planet === pName || pos.name === pName) || {};
                        const pStrength = worksheetData?.strength?.planets?.[pName];
                        let dignity = p.dignity || pStrength?.dignity || "Neutral";
                        if (["Rahu", "Ketu"].includes(pName) && (dignity === "Unknown" || !dignity)) {
                            dignity = "Neutral";
                        }
                        dignity = dignity.replace(/[★↓◆♥✕]/g, '').trim();

                        const sbTotal = pStrength?.total || pStrength?.ratio_data?.ratio || p.shadbala_pct || p.shadbala || 1.0;
                        const sbPct = typeof sbTotal === 'number' ? sbTotal.toFixed(2) : "1.00";
                        const sbRank = ["Rahu", "Ketu"].includes(pName) ? "-" : (sbRanks[pName] || "-");

                        const vbScore = worksheetData?.vimsopaka_bala?.shodashvarga?.[pName] ??
                            worksheetData?.vimsopaka_assessment?.vimsopaka_bala?.dasavarga?.[pName] ??
                            worksheetData?.vimsopaka_assessment?.vimsopaka_bala?.shodashvarga?.[pName] ??
                            (worksheetData?.vimsopaka?.[pName] !== undefined ? worksheetData.vimsopaka[pName] : 15);
                        const vbDisplay = typeof vbScore === 'number' ? vbScore.toFixed(1) : (vbScore || "15");

                        const av = p.ashtakavarga || worksheetData?.ashtakavarga?.binnashtakavarga?.[pName]?.total || worksheetData?.ashtakavarga?.[pName] || "4";

                        const pAv = avasthas[pName] || {};
                        const shyanadiParts = pAv.shyanadi ? pAv.shyanadi.split('\n') : [];
                        const avasthaStr = shyanadiParts[1] ? shyanadiParts[1].replace(/[()]/g, '').trim() : (shyanadiParts[0] || p.avastha || "Awake");

                        const baladiParts = pAv.baladi ? pAv.baladi.split('\n') : [];
                        const ageStr = baladiParts[1] ? baladiParts[1].replace(/[()]/g, '').trim() : (baladiParts[0] || getBaladiAge(p.degree || p.normDegree, Math.floor((p.degree || p.normDegree || 0) / 30)));

                        const karakStr = ["Rahu", "Ketu"].includes(pName) ? "-" : (k7[pName] || "-");
                        const natureStr = getFunctionalNature(lagnaSignIndex, pName);
                        const natureColor = natureStr === "Benefic" ? "text-emerald-700 font-semibold" : natureStr === "Malefic" ? "text-red-700 font-semibold" : "text-amber-700 font-semibold";

                        return (
                            <tr key={r.id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fffacd] transition-colors">
                                <td className="px-2 py-1 font-bold border-r border-[#eeeeee]" style={{ color: r.color }}>{r.name}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] truncate max-w-[55px]">{dignity}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] font-mono">{sbPct}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] font-mono">{sbRank}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee] font-mono">{vbDisplay}</td>
                                <td className="px-2 py-1 text-indigo-700 font-bold border-r border-[#eeeeee] font-mono">{av}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{avasthaStr}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{ageStr}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{karakStr}</td>
                                <td className={`px-2 py-1 ${natureColor}`}>{natureStr}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default function ClassicLayoutViewer3({ data: worksheetData }) {
    if (!worksheetData) return null;

    const d1Houses = worksheetData.charts?.houses || worksheetData.charts?.D1?.houses || [];
    const d9Houses = worksheetData.charts?.D9?.houses || [];

    const planetPositions = Array.isArray(worksheetData.planet_positions) ? worksheetData.planet_positions : Object.values(worksheetData.planet_positions || {});

    const shadbalaData = PLANETS.slice(0, 7).map(pName => {
        const p = planetPositions.find(pos => pos.name === pName || pos.planet === pName);
        return {
            name: pName,
            shadbala: worksheetData.strength?.planets?.[pName]?.ratio_data?.ratio || p?.shadbala_pct || 1.0,
            vimshopaka: worksheetData.vimsopaka_assessment?.vimsopaka_bala?.dasavarga?.[pName] || 10
        };
    });


    const handleExportPDF = async () => {
        const element = document.getElementById('pdf-classic-content');
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('ClassicLayoutViewer3.pdf');
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <div id="pdf-classic-content" className="h-screen w-screen bg-[#fff0d6] font-sans flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar text-[#333]">
            <button onClick={handleExportPDF} className="absolute top-2 right-2 z-[100] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase shadow-lg border border-emerald-500/30 transition-all cursor-pointer">Export PDF</button>
            {/* Main Container: Left Block and Right Block */}
            <div className="flex-1 flex gap-2 bg-[#f0f0f0] p-1 h-full w-full min-h-[900px]">

                {/* Left Block: Fixed Width (54rem) for D1, D9, and Tables */}
                <div className="w-[54rem] shrink-0 flex flex-col gap-1">

                    {/* Top Row: D1 (Full Width of Left Block) */}
                    <div className="flex-[5.5] flex min-h-0 w-full">
                        {/* Birth Chart */}
                        <div className="flex-1 bg-[#ffffe0] border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm min-h-0">
                            <div className="flex-1 p-0 flex items-center justify-center bg-white/50 min-h-0">
                                <ZodiacChart houses={d1Houses} variant="legacy" title="Birth Chart" defaultRect={true} scaleText={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Data Tables */}
                    <div className="flex-[4.5] flex gap-1 min-h-0 w-full">
                        <div className="flex-1 border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm bg-white min-w-0">
                            <div className="bg-[#e6f3f7] border-b border-[#8ec5e6] px-3 py-1 text-[12px] text-[#0a4d7a] font-bold tracking-tight shrink-0">Birth Chart (Degrees)</div>
                            <DegreeTable pPos={planetPositions} worksheetData={worksheetData} />
                        </div>
                        <div className="flex-1 border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm bg-white min-w-0">
                            <div className="bg-[#e6f3f7] border-b border-[#8ec5e6] px-3 py-1 text-[12px] text-[#0a4d7a] font-bold tracking-tight shrink-0">Birth Chart (Dignity)</div>
                            <DignityTable shadbalaData={shadbalaData} worksheetData={worksheetData} />
                        </div>
                    </div>

                </div>

                {/* Right Block: D9, Vimshottari & Shadbala */}
                <div className="flex-1 flex flex-col gap-1 min-[220px] min-w-0">
                    <div className="flex-1 bg-[#ffffe0] border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm min-h-0">
                        <div className="flex-1 p-0 flex items-center justify-center bg-white/50 min-h-0">
                            <ZodiacChart houses={d9Houses.length > 0 ? d9Houses : d1Houses} variant="legacy" title="D9 Navamsha (spouse)" defaultRect={true} scaleText={2.0} />
                        </div>
                    </div>
                    <div className="flex-1 bg-white border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm min-h-0">
                        <VimshottariTable data={worksheetData} hideMarriageDasha={true} />
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden shadow-sm rounded-sm min-h-0">
                        <ShadbalaRatioChart title="Shad Bala" data={shadbalaData} />
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 4px; }
            `}} />
        </div>
    );
}
