import React, { useState, useEffect } from "react";
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

const DegreeTable = ({ pPos }) => {
    const rows = [
        { id: "As", name: "As", isLagna: true, color: "#ff8c00" },
        ...PLANETS.map(p => ({ id: p, name: ABBREV[p], color: PLANET_COLORS_CLASSIC[p] }))
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
                        let pos = { degree: 0, rc: "", nakshatra: "Unknown", p_lrd: "", func: "" };
                        if (r.isLagna) {
                            pos = { degree: pPos.find(x => x.is_ascendant)?.degree || 0, rc: "", nakshatra: "U.Phalg.", p_lrd: "1,Su/Mo/Mo", func: "Benefic" };
                        } else {
                            const found = pPos.find(x => x.name === r.id || x.planet === r.id);
                            pos = {
                                degree: found?.degree || found?.normDegree || 0,
                                rc: found?.is_retrograde ? "R" : "",
                                nakshatra: found?.nakshatra || "Moola",
                                p_lrd: "1,Ke/Su/Sa", func: "Benefic"
                            };
                        }
                        return (
                            <tr key={r.id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fffacd] transition-colors">
                                <td className="px-2 py-1 font-bold border-r border-[#eeeeee]" style={{ color: r.color }}>{r.name}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{pos.degree.toFixed(4)}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{pos.rc}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{pos.nakshatra}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">Tay</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{pos.p_lrd}</td>
                                <td className="px-2 py-1 text-black">{pos.func}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const DignityTable = ({ shadbalaData }) => {
    const rows = PLANETS.map(p => ({ id: p, name: ABBREV[p], color: PLANET_COLORS_CLASSIC[p] }));
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
                        const sb = shadbalaData.find(x => x.name === r.id);
                        return (
                            <tr key={r.id} className="border-b border-[#eeeeee] last:border-0 hover:bg-[#fffacd] transition-colors">
                                <td className="px-2 py-1 font-bold border-r border-[#eeeeee]" style={{ color: r.color }}>{r.name}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">Neutr.</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{sb?.shadbala?.toFixed(2) || "1.00"}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">1</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">{sb?.vimshopaka || 10}</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">4</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">Drm.</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">Infant</td>
                                <td className="px-2 py-1 text-black border-r border-[#eeeeee]">GK</td>
                                <td className="px-2 py-1 text-black">Benefic</td>
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

    return (
        <div className="h-screen w-screen bg-[#fff0d6] font-sans flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar text-[#333]">
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
                            <DegreeTable pPos={planetPositions} />
                        </div>
                        <div className="flex-1 border border-[#8ec5e6] shadow-sm flex flex-col overflow-hidden rounded-sm bg-white min-w-0">
                            <div className="bg-[#e6f3f7] border-b border-[#8ec5e6] px-3 py-1 text-[12px] text-[#0a4d7a] font-bold tracking-tight shrink-0">Birth Chart (Dignity)</div>
                            <DignityTable shadbalaData={shadbalaData} />
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
                        <VimshottariTable data={worksheetData} />
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
