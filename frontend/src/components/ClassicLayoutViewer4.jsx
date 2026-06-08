import React, { useState, useEffect } from "react";
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



// Simplified component for Vargavimshopaka
const VargavimshopakaTable = ({ vimsopakaData }) => {
    if (!vimsopakaData) return <div className="p-4">No data</div>;
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const vargas = [
        { key: "shadvarga", label: "Shad Varga" },
        { key: "saptavarga", label: "Saptha Varga" },
        { key: "dasavarga", label: "Dasa Varga" },
        { key: "shodasavarga", label: "Shodasa Varga" }
    ];

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
                                <th key={p} style={{ color: getPlanetColor(p) }} className="font-semibold py-1">{PLANET_ABBREV[p]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vargas.map(v => (
                            <tr key={v.key} className="border-b border-green-700/10 last:border-0 hover:bg-white/40">
                                <td className="font-medium text-slate-700 text-left pl-2 py-1">{v.label}</td>
                                {planets.map(p => {
                                    let score = vimsopakaData[v.key]?.[p] || 0;
                                    // Make text color based on score
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
    const compound = friendshipData.compound !== undefined ? friendshipData.compound : friendshipData;
    const vimsopakaData = data.vimsopaka_assessment?.vimsopaka_bala || {};

    return (
        <div className="h-screen w-screen bg-[#fff0d6] font-sans flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar text-[#333]">
            <div className="flex-1 flex flex-col gap-1 p-2 h-full w-full min-h-[900px]">

                {/* Top Row: Compound Relationships */}
                <div className="flex-[3] min-h-0 bg-white">
                    <RelationshipTable title="Compound Relationships (Panchadha)" matrixData={compound} />
                </div>

                {/* Middle Row: Vargavimshopaka */}
                <div className="flex-[2] min-h-0 mt-1">
                    <VargavimshopakaTable vimsopakaData={vimsopakaData} />
                </div>

                {/* Bottom Row: Vimshottari | D1 | Transit */}
                <div className="flex-[5] flex gap-1 min-h-0 mt-1">
                    {/* Left: Vimshottari Table */}
                    <div className="flex-1 border-2 border-green-700/50 shadow-sm flex flex-col overflow-hidden rounded-sm bg-white min-w-0">
                        <VimshottariTable data={data} />
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
