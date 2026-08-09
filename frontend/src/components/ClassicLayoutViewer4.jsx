import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ZodiacChart from "./ZodiacChart";
import VimshottariTable from "./VimshottariTable";
import { RelationshipTable } from "./PlanetaryRelationshipsViewer";
import { TransitPanel } from "./InteractiveWorksheet";

const PLANETS = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const PLANET_ABBREV = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
    "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
};

const getPlanetColor = (planet) => {
    const colors = {
        "Sun": "#b91c1c", "Moon": "#334155", "Mars": "#b91c1c",
        "Mercury": "#15803d", "Jupiter": "#b45309", "Venus": "#be185d",
        "Saturn": "#1d4ed8", "Rahu": "#0f766e", "Ketu": "#92400e", "Ascendant": "#000"
    };
    return colors[planet] || "#333";
};



// Component for Vargavimshopaka
const VargavimshopakaTable = ({ vimsopakaData, data }) => {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const vargas = [
        { keys: ["shadvarga", "shad_varga"], label: "Shad Varga" },
        { keys: ["saptavarga", "saptha_varga", "saptavarga"], label: "Saptha Varga" },
        { keys: ["dasavarga", "dasa_varga", "dashavarga"], label: "Dasa Varga" },
        { keys: ["shodashvarga", "shodasavarga", "shodashavarga", "shodasa_varga"], label: "Shodasa Varga" }
    ];

    const getScore = (vKeys, planetName) => {
        if (vimsopakaData) {
            for (const k of vKeys) {
                if (vimsopakaData[k] && vimsopakaData[k][planetName] !== undefined) {
                    return Number(vimsopakaData[k][planetName]);
                }
            }
        }
        // Fallback: estimate from planet strength/dignity in chart data
        const positionArray = Array.isArray(data?.planet_positions) ? data.planet_positions : Object.values(data?.planet_positions || {});
        const pObj = positionArray.find(pos => pos.planet === planetName || pos.name === planetName);
        const pStrength = data?.strength?.planets?.[planetName];

        let baseScore = 14.0;
        const dignity = pObj?.dignity || pStrength?.dignity || "";
        if (dignity.includes("EXALTED") || dignity.includes("Exalted") || dignity.includes("Moolatrikona")) baseScore = 18.0;
        else if (dignity.includes("OWN") || dignity.includes("Own")) baseScore = 16.0;
        else if (dignity.includes("FRIEND") || dignity.includes("Friend")) baseScore = 14.5;
        else if (dignity.includes("ENEMY") || dignity.includes("Enemy")) baseScore = 10.5;
        else if (dignity.includes("DEBILITATED") || dignity.includes("Debilitated")) baseScore = 7.5;

        return baseScore;
    };

    return (
        <div className="w-full bg-[#ffffe0] border-2 border-green-700/50 flex flex-col h-full rounded-sm shadow-sm mt-1">
            <div className="bg-white/80 border-b border-green-700/30 px-2 py-0.5 text-sm font-bold text-slate-800 flex justify-between">
                <span>Vargavimshopaka</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-1">
                <table className="w-full text-center text-xs">
                    <thead>
                        <tr className="border-b border-green-700/20">
                            <th className="font-normal text-left pl-2"></th>
                            {planets.map(p => (
                                <th key={p} style={{ color: getPlanetColor(p) }} className="font-semibold py-1">{PLANET_ABBREV[p] || p}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vargas.map(v => (
                            <tr key={v.label} className="border-b border-green-700/10 last:border-0 hover:bg-white/40">
                                <td className="font-medium text-slate-700 text-left pl-2 py-1">{v.label}</td>
                                {planets.map(p => {
                                    const score = getScore(v.keys, p);
                                    let scoreColor = "#333";
                                    if (score >= 15) scoreColor = "#16a34a"; // Green for high
                                    else if (score <= 10) scoreColor = "#dc2626"; // Red for low

                                    return (
                                        <td key={p} style={{ color: scoreColor }} className="font-medium">
                                            {score.toFixed(1)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



const NAISARGIKA_RELATIONS = {
    Sun: { friend: ["Moon", "Mars", "Jupiter"], enemy: ["Venus", "Saturn", "Rahu", "Ketu"] },
    Moon: { friend: ["Sun", "Mercury"], enemy: [] },
    Mars: { friend: ["Sun", "Moon", "Jupiter"], enemy: ["Mercury", "Rahu", "Ketu"] },
    Mercury: { friend: ["Sun", "Venus"], enemy: ["Moon"] },
    Jupiter: { friend: ["Sun", "Moon", "Mars"], enemy: ["Mercury", "Venus"] },
    Venus: { friend: ["Mercury", "Saturn"], enemy: ["Sun", "Moon"] },
    Saturn: { friend: ["Mercury", "Venus"], enemy: ["Sun", "Moon", "Mars"] },
    Rahu: { friend: ["Venus", "Saturn", "Mercury"], enemy: ["Sun", "Moon", "Mars"] },
    Ketu: { friend: ["Venus", "Saturn", "Mercury"], enemy: ["Sun", "Moon", "Mars"] }
};

const calculateCompoundRelationships = (data) => {
    const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const positionArray = Array.isArray(data.planet_positions) ? data.planet_positions : Object.values(data.planet_positions || {});

    const planetHouseMap = {};
    PLANET_NAMES.forEach(pName => {
        const found = positionArray.find(p => p.planet === pName || p.name === pName);
        if (found) {
            let houseNum = found.house;
            if (!houseNum && found.degree !== undefined) {
                const ascDeg = data.charts?.houses?.[1]?.cusp_deg ?? data.charts?.houses?.["1"]?.cusp_deg ?? 0;
                houseNum = Math.floor(((found.degree - ascDeg + 360) % 360) / 30) + 1;
            }
            planetHouseMap[pName] = houseNum || 1;
        } else {
            let houseNum = 1;
            const houses = data.charts?.houses || data.charts?.D1?.houses || {};
            for (const [hNum, hData] of Object.entries(houses)) {
                const pList = (hData.planets || []).map(p => typeof p === 'object' ? p.name || p.planet : p);
                if (pList.includes(pName)) {
                    houseNum = parseInt(hNum);
                    break;
                }
            }
            planetHouseMap[pName] = houseNum;
        }
    });

    const compoundMatrix = {};
    PLANET_NAMES.forEach(p1 => {
        compoundMatrix[p1] = {};
        PLANET_NAMES.forEach(p2 => {
            if (p1 === p2) {
                compoundMatrix[p1][p2] = "-";
                return;
            }
            let natScore = 0;
            const p1Nat = NAISARGIKA_RELATIONS[p1] || { friend: [], enemy: [] };
            if (p1Nat.friend.includes(p2)) natScore = 1;
            else if (p1Nat.enemy.includes(p2)) natScore = -1;

            const h1 = planetHouseMap[p1] || 1;
            const h2 = planetHouseMap[p2] || 1;
            let diff = (h2 - h1 + 12) % 12;
            if (diff === 0) diff = 12;

            const tempScore = [2, 3, 4, 10, 11, 12].includes(diff) ? 1 : -1;

            const totalScore = natScore + tempScore;
            let relText = "Neutral";
            if (totalScore >= 2) relText = "Grt. Friend";
            else if (totalScore === 1) relText = "Friend";
            else if (totalScore === 0) relText = "Neutral";
            else if (totalScore === -1) relText = "Enemy";
            else if (totalScore <= -2) relText = "Grt. Enemy";

            compoundMatrix[p1][p2] = relText;
        });
    });

    return compoundMatrix;
};

export default function ClassicLayoutViewer4({ data }) {
    if (!data) return null;

    const [transitPositions, setTransitPositions] = useState(null);

    // Fetch transit positions
    useEffect(() => {
        if (!transitPositions && !data.transit) {
            const fetchTransit = async () => {
                try {
                    const dateStr = new Date().toISOString().split('T')[0];
                    const timeStr = new Date().toTimeString().split(' ')[0].substring(0, 5);
                    const tz_offset = -(new Date().getTimezoneOffset() / 60);
                    const lat = data.meta?.lat || 0;
                    const lon = data.meta?.lon || 0;

                    const res = await fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat}&lon=${lon}`);
                    const json = await res.json();
                    if (json.positions) setTransitPositions(json.positions);
                } catch (e) {
                    console.error("Failed to fetch transits", e);
                }
            };
            fetchTransit();
        } else if (data.transit) {
            setTransitPositions(data.transit);
        }
    }, [data, transitPositions]);

    const d1Houses = data.charts?.houses || data.charts?.D1?.houses || [];
    const friendshipData = data.friendship_matrix || data.planetary_relationships || {};
    let compound = friendshipData.compound !== undefined ? friendshipData.compound : (Object.keys(friendshipData).length > 0 ? friendshipData : null);

    if (!compound || Object.keys(compound).length === 0) {
        compound = calculateCompoundRelationships(data);
    }

    const vimsopakaData = data.vimsopaka_bala || data.vimsopaka_assessment?.vimsopaka_bala || data.vimsopaka || {};


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
            pdf.save('ClassicLayoutViewer4.pdf');
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <div id="pdf-classic-content" className="h-screen w-screen bg-[#fff0d6] font-sans flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar text-[#333]">
            <button onClick={handleExportPDF} className="absolute top-2 right-2 z-[100] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase shadow-lg border border-emerald-500/30 transition-all cursor-pointer">Export PDF</button>
            <div className="flex-1 flex flex-col gap-1 p-2 h-full w-full min-h-[900px]">

                {/* Top Row: Compound Relationships */}
                <div className="flex-[3] min-h-0 bg-white">
                    <RelationshipTable title="Compound Relationships (Panchadha)" matrixData={compound} />
                </div>

                {/* Middle Row: Vargavimshopaka */}
                <div className="flex-[2] min-h-0 mt-1">
                    <VargavimshopakaTable vimsopakaData={vimsopakaData} data={data} />
                </div>

                {/* Bottom Row: Vimshottari | D1 | Transit */}
                <div className="flex-[5] flex gap-1 min-h-0 mt-1">
                    {/* Left: Vimshottari Table */}
                    <div className="flex-1 border-2 border-green-700/50 shadow-sm flex flex-col overflow-hidden rounded-sm bg-white min-w-0">
                        <VimshottariTable data={data} hideMarriageDasha={true} />
                    </div>

                    {/* Middle: Birth Chart */}
                    <div className="flex-1 bg-[#ffffe0] border border-green-700/50 shadow-sm flex flex-col overflow-hidden rounded-sm min-h-0">
                        <div className="flex-1 p-0 flex items-center justify-center bg-white/50 min-h-0">
                            <ZodiacChart houses={d1Houses} variant="legacy" title="Birth Chart" />
                        </div>
                    </div>

                    {/* Right: Transit Chart */}
                    <div className="flex-1 flex flex-col min-h-0 border border-green-700/50 bg-[#ffffe0] overflow-hidden">
                        <TransitPanel data={data} transitPositions={transitPositions} fullSize={true} />
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
