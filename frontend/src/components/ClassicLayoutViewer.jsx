import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ZodiacChart from "./ZodiacChart";

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

const formatDeg = (deg) => {
    if (typeof deg !== 'number') return '';
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor(((deg - d) * 60 - m) * 60);
    return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
};

export default function ClassicLayoutViewer({ data }) {
    if (!data) return null;

    const birthDataString = `${data.meta?.name || "Native"}   |   DOB: ${data.meta?.date || data.meta?.dob || ""}   |   TOB: ${data.meta?.time || data.meta?.tob || ""}   |   LOC: ${data.meta?.location || data.meta?.loc || ""}`;

    // Fallbacks for data structures
    const [selectedMiddleChart, setSelectedMiddleChart] = useState('d9');

    const d1Houses = data.charts?.houses || data.charts?.D1?.houses;

    // Dynamically resolve houses for the middle chart
    const middleHouses = selectedMiddleChart === 'd1'
        ? d1Houses
        : (data.vargas?.[selectedMiddleChart]?.houses || data.charts?.[selectedMiddleChart.toUpperCase()]?.houses);

    const dashaList = data.dasha?.list || data.dashas || [];

    const positions = data.planet_positions || {};


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
            pdf.save('ClassicLayoutViewer.pdf');
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <div id="pdf-classic-content" className="h-screen w-screen bg-[#fdfbf7] font-serif p-2 flex flex-col overflow-hidden text-slate-800">
            <button onClick={handleExportPDF} className="absolute top-2 right-2 z-[100] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase shadow-lg border border-emerald-500/30 transition-all cursor-pointer">Export PDF</button>
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-indigo-900/80 pb-1 mb-2 px-2 text-[11px] font-black uppercase tracking-wider text-indigo-950 shrink-0">
                <span>{birthDataString}</span>
                <span>Astro Consult - Classic Workspace</span>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-0">
                {/* Top Row: 50% Height */}
                <div className="flex gap-2 flex-1 min-[300px]">

                    {/* Left: Birth Chart */}
                    <div className="flex-1 bg-[#fbf9f1] border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm overflow-hidden">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 flex items-center justify-center p-0">
                                <ZodiacChart houses={d1Houses} variant="legacy" defaultRect={true} scaleText={1.5} title="Birth Chart (Lagna)" />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Dynamic Varga Chart */}
                    <div className="flex-1 bg-[#fbf9f1] border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm overflow-hidden">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 flex items-center justify-center p-0">
                                <ZodiacChart houses={middleHouses} variant="legacy" defaultRect={true} scaleText={1.5} title={selectedMiddleChart === 'd1' ? 'D1 Lagna' : `${selectedMiddleChart.toUpperCase()} Chart`} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Vimshottari Dashas */}
                    <div className="flex-[0.8] bg-white border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm">
                        <div className="bg-white border-b border-indigo-900/30 px-3 absolute top-0 left-0 -translate-y-1/2 translate-x-4 text-indigo-900 font-bold text-[10px] uppercase tracking-widest z-10 flex items-center justify-between w-[85%] rounded-full shadow-sm">
                            <span>Vimshottari Dasha</span>
                        </div>
                        <div className="flex-1 mt-3 overflow-y-auto text-[10px] px-2 custom-scrollbar">
                            <table className="w-full mt-1">
                                <tbody>
                                    {(dashaList || []).slice(0, 15).map((d, i) => {
                                        const lordStr = `Maha: ${d.lord}`;
                                        let dateStr = d.start_date || d.start || "";
                                        return (
                                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                <td className="py-0.5 font-bold w-20" style={{ color: getPlanetColor(d.lord) }}>{lordStr}</td>
                                                <td className="text-black text-center w-6">→</td>
                                                <td className="py-0.5 text-right font-mono text-black">{dateStr}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Varga Chart Controls */}
                        <div className="mt-2 pt-3 border-t border-indigo-900/20 flex flex-wrap gap-2 justify-center shrink-0">
                            {['d1', 'd2', 'd3', 'd4', 'd7', 'd9', 'd10', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSelectedMiddleChart(v)}
                                    className={`px-3 py-1.5 text-[10px] md:text-xs font-black uppercase rounded shadow-sm transition-colors border ${selectedMiddleChart === v ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 border-slate-200'}`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: 50% Height */}
                <div className="flex gap-2 flex-1 min-h-0">

                    {/* Left Table: Nakshatras */}
                    <div className="flex-1 bg-white border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm">
                        <div className="bg-white border border-indigo-900/30 rounded-full px-3 absolute top-0 left-0 -translate-y-1/2 translate-x-4 text-indigo-900 font-bold text-[12px] uppercase tracking-widest shadow-sm z-10">
                            Planetary Positions & Nakshatras
                        </div>
                        <div className="mt-3 flex-1 overflow-y-auto px-1 custom-scrollbar">
                            <table className="w-full text-left text-[12px]">
                                <thead className="border-b border-indigo-900/10 text-black sticky top-0 bg-white">
                                    <tr>
                                        <th className="font-semibold pb-1">Planet</th>
                                        <th className="font-semibold pb-1">Longitude</th>
                                        <th className="font-semibold pb-1">Nakshatra</th>
                                        <th className="font-semibold pb-1 text-center">Pada</th>
                                        <th className="font-semibold pb-1">Lord</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLANETS.map(pName => {
                                        const positionArray = Array.isArray(data.planet_positions) ? data.planet_positions : (Object.values(data.planet_positions || {}));
                                        const p = positionArray.find(pos => pos.planet === pName || pos.name === pName);
                                        if (!p) return null;

                                        let abbrev = PLANET_ABBREV[pName];
                                        const color = getPlanetColor(pName);
                                        const nakshatra = p.nakshatra || "";
                                        const pada = p.nakshatra_pada || "";
                                        const lord = p.nakshatra_lord || "";

                                        return (
                                            <tr key={pName} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                                <td className="py-0.5 font-bold" style={{ color }}>{pName}</td>
                                                <td className="py-0.5 font-mono text-black">{formatDeg(p.normDegree || p.degree || 0)}</td>
                                                <td className="py-0.5 text-black">{nakshatra}</td>
                                                <td className="py-0.5 text-center font-mono text-black">{pada}</td>
                                                <td className="py-0.5 text-black">{lord}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Table: Dignity & Ashtakavarga */}
                    <div className="flex-[1.2] bg-white border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm">
                        <div className="bg-white border border-indigo-900/30 rounded-full px-3 absolute top-0 left-0 -translate-y-1/2 translate-x-4 text-indigo-900 font-bold text-[10px] uppercase tracking-widest shadow-sm z-10">
                            Dignity & Shadbala
                        </div>
                        <div className="mt-3 flex-1 overflow-y-auto px-1 custom-scrollbar">
                            <table className="w-full text-left text-[12px]">
                                <thead className="border-b border-indigo-900/10 text-black sticky top-0 bg-white">
                                    <tr>
                                        <th className="font-semibold pb-1">Pl</th>
                                        <th className="font-semibold pb-1">Dignity</th>
                                        <th className="font-semibold pb-1">SB Ratio</th>
                                        <th className="font-semibold pb-1">SB Rank</th>
                                        <th className="font-semibold pb-1">Vimso</th>
                                        <th className="font-semibold pb-1">AV</th>
                                        <th className="font-semibold pb-1">Avastha</th>
                                        <th className="font-semibold pb-1">Age</th>
                                        <th className="font-semibold pb-1">Karak</th>
                                        <th className="font-semibold pb-1">Nature</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLANETS.filter(p => p !== "Ascendant" && p !== "Rahu" && p !== "Ketu").map(pName => {
                                        const positionArray = Array.isArray(data.planet_positions) ? data.planet_positions : (Object.values(data.planet_positions || {}));
                                        const p = positionArray.find(pos => pos.planet === pName || pos.name === pName);
                                        if (!p) return null;

                                        let abbrev = PLANET_ABBREV[pName];
                                        const color = getPlanetColor(pName);
                                        const dignity = p.dignity || "Neutral";
                                        const sbPct = p.shadbala_pct ? p.shadbala_pct.toFixed(2) : "1.00";
                                        const av = p.ashtakavarga || "4";

                                        return (
                                            <tr key={pName} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                                <td className="py-0.5 font-bold" style={{ color }}>{abbrev}</td>
                                                <td className="py-0.5 text-black truncate max-w-[50px]">{dignity}</td>
                                                <td className="py-0.5 font-mono text-black">{sbPct}</td>
                                                <td className="py-0.5 font-mono text-black">3</td>
                                                <td className="py-0.5 font-mono text-black">15</td>
                                                <td className="py-0.5 font-mono text-indigo-600 font-bold">{av}</td>
                                                <td className="py-0.5 text-black">Sleep</td>
                                                <td className="py-0.5 text-black">Youth</td>
                                                <td className="py-0.5 text-black">AmK</td>
                                                <td className="py-0.5 text-red-700/80">Malefic</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(49, 46, 129, 0.2);
                    border-radius: 4px;
                }
            `}} />
        </div>
    );
}
