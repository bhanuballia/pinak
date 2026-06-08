import React, { useState, useEffect } from "react";
import ZodiacChart from "./ZodiacChart";
import AshtakavargaChart from "./AshtakavargaChart";
import VimshottariTable from "./VimshottariTable";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const ABBREV = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa" };
const PLANET_COLORS_CLASSIC = { Sun: "#cc0000", Moon: "#000000", Mars: "#cc0000", Mercury: "#008000", Jupiter: "#ff8c00", Venus: "#ff00ff", Saturn: "#0000ff" };

const MiniBarChart = ({ title, data, dataKey, isPercent, reqKey }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-[#8ec5e6] overflow-hidden">
            <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 text-[11px] font-bold tracking-tight text-[#0a4d7a] flex justify-between items-center">
                <span>{title}</span>
            </div>
            <div className="flex-1 relative border-x border-b border-black overflow-hidden mx-1.5 mt-1.5 mb-1.5 shadow-sm bg-white">
                {/* Background: green top half, red bottom half */}
                <div className="absolute inset-0 top-0 h-1/2 bg-[#32cd32]"></div>
                <div className="absolute inset-0 top-1/2 h-1/2 bg-[#ff0000]"></div>
                {/* Midline at required */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black z-10"></div>

                <div className="absolute inset-0 flex flex-row items-end px-0 gap-1">
                    {data.map(p => {
                        const val = p[dataKey] || 0;
                        const req = p[reqKey] || (isPercent ? 50 : 10);
                        const max = req * 2;
                        const heightPct = Math.min((val / max) * 100, 100);
                        return (
                            <div key={p.name} className="relative flex-1 border-r border-black last:border-r-0 flex flex-col items-center justify-end z-20" style={{ height: `${heightPct}%`, backgroundColor: "#ffffe0", borderTop: "1px solid #000" }}>
                                <span className="text-[12px] font-bold font-serif leading-none mb-1" style={{ color: PLANET_COLORS_CLASSIC[p.name] }}>
                                    {ABBREV[p.name]}
                                </span>
                                <span className="text-[11px] font-serif leading-none mb-1.5 text-black">
                                    {val.toFixed(1)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ShadbalaRatioChart = ({ title, data }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-[#8ec5e6] overflow-hidden">
            <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 text-[11px] font-bold tracking-tight text-[#0a4d7a] flex justify-between items-center">
                <span>{title}</span>
            </div>
            <div className="flex-1 relative border-x border-b border-black overflow-hidden m-2 shadow-sm">
                {/* Background: green top half (ratio > 1.0), red bottom half (ratio < 1.0) */}
                <div className="absolute inset-0 top-0 h-1/2 bg-[#009900]"></div>
                <div className="absolute inset-0 top-1/2 h-1/2 bg-[#ff0000]"></div>
                {/* Midline at ratio = 1.0 (exactly 50% from top) */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-10"></div>

                {/* Bars container */}
                <div className="absolute inset-0 flex flex-row items-end gap-1 px-1">
                    {data.map(s => {
                        const ratio = s.shadbala;
                        const clampedRatio = Math.min(Math.max(ratio, 0), 2.0);
                        const barHeightPct = (clampedRatio / 2.0) * 100;

                        return (
                            <div
                                key={s.name}
                                className="relative flex-1 border-r border-black last:border-r-0 flex flex-col justify-end items-center"
                                style={{
                                    height: `${barHeightPct}%`,
                                    backgroundColor: "#fffff0",
                                    borderTop: "1px solid #000",
                                    borderLeft: "1px solid #000"
                                }}
                            >
                                <span className="text-[12px] font-bold font-serif leading-none mb-0.5" style={{ color: s.color }}>
                                    {ABBREV[s.name]}
                                </span>
                                <span className="text-[10px] font-serif leading-none mb-2" style={{ color: "#111" }}>
                                    {ratio.toFixed(2)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function ClassicLayoutViewer2({ data: worksheetData }) {
    const [avData, setAvData] = useState(null);
    const [transitData, setTransitData] = useState(null);

    useEffect(() => {
        let bd = null;
        if (worksheetData && worksheetData.basic_details) {
            bd = worksheetData.basic_details;
        } else {
            try {
                const stored = localStorage.getItem('worksheetData');
                if (stored) {
                    bd = JSON.parse(stored).basic_details;
                }
            } catch (e) { }
        }

        if (bd) {
            // Format for AV (expects date, time, lat, lon)
            const avPayload = {
                date: bd.birth_date,
                time: bd.birth_time,
                lat: bd.lat,
                lon: bd.lon,
                tz_offset: bd.tz_offset || 5.5
            };
            fetch('/api/ashtakavarga', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(avPayload)
            }).then(r => r.ok ? r.json() : null).then(data => {
                if (data && !data.error) setAvData(data);
            }).catch(console.error);

            // Fetch Transit
            const d = new Date();
            const transitPayload = {
                birth_date: bd.birth_date,
                birth_time: bd.birth_time,
                lat: bd.lat,
                lon: bd.lon,
                tz_offset: bd.tz_offset || 5.5,
                transit_date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
                transit_time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`
            };
            fetch('http://localhost:8000/api/transit/animated', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transitPayload)
            }).then(r => r.ok ? r.json() : null).then(data => {
                if (data && !data.error) setTransitData(data);
            }).catch(console.error);
        }
    }, [worksheetData]);

    if (!worksheetData) return null;

    const d1Houses = worksheetData.charts?.houses || worksheetData.charts?.D1?.houses || [];

    // Prepare AV houses
    let marsBhinna = [];
    let samAstavarga = [];
    if (avData && avData.house_analytics) {
        marsBhinna = avData.house_analytics.map(ha => ({
            house: ha.house,
            signIndex: ha.sign_index,
            points: avData.bhinna?.Mars?.[ha.sign_index] || 0
        }));
        samAstavarga = avData.house_analytics.map(ha => ({
            house: ha.house,
            signIndex: ha.sign_index,
            points: ha.points
        }));
    }

    // Prepare Strengths
    const planetPositions = Array.isArray(worksheetData.planet_positions) ? worksheetData.planet_positions : Object.values(worksheetData.planet_positions || {});
    const shadbalaData = PLANETS.map(pName => {
        const p = planetPositions.find(pos => pos.name === pName || pos.planet === pName);
        return {
            name: pName,
            shadbala: worksheetData.strength?.planets?.[pName]?.ratio_data?.ratio || p?.shadbala_pct || 1.0,
            vimshopaka: worksheetData.vimsopaka_assessment?.vimsopaka_bala?.dasavarga?.[pName] || 10,
            color: pName === 'Sun' || pName === 'Mars' ? '#b91c1c' : (pName === 'Moon' ? '#334155' : '#15803d')
        };
    });

    const dashaList = worksheetData.dasha?.list || worksheetData.dashas || [];

    // Header info
    const bName = worksheetData.meta?.name || "Native";
    const bDate = worksheetData.meta?.date || worksheetData.meta?.dob || worksheetData.basic_details?.birth_date || "";
    const bTime = worksheetData.meta?.time || worksheetData.meta?.tob || worksheetData.basic_details?.birth_time || "";
    const bLoc = worksheetData.meta?.location || worksheetData.meta?.loc || worksheetData.basic_details?.city || "";

    return (
        <div className="h-screen w-screen bg-[#f3f3f3] font-sans flex flex-col overflow-y-auto overflow-x-hidden text-[#333]">
            {/* Top Toolbar Replica */}


            {/* Main Grid */}
            <div className="flex-1 flex flex-col p-1 gap-1 min-h-[850px] bg-[#fff0d6]">

                {/* Row 1: Birth Chart & Transits */}
                <div className="flex gap-1 h-[45%] min-h-[500px]">
                    {/* Left: Birth Chart */}
                    <div className="flex-[2] bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                            <ZodiacChart houses={d1Houses} variant="legacy" defaultRect={true} title="Birth Chart" />
                        </div>
                    </div>

                    {/* Middle: Transits */}
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                            <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                                {transitData ? (
                                    <ZodiacChart houses={d1Houses} variant="legacy" defaultRect={true} scaleText={2.0} title="Today From Lagna" />
                                ) : (
                                    <div className="flex flex-col h-full w-full">
                                        <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 text-[11px] text-[#0a4d7a] font-bold">Today From Lagna</div>
                                        <div className="flex h-full items-center justify-center text-[14px] text-gray-400">Loading Transit...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                            <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                                <ZodiacChart houses={d1Houses} variant="legacy" defaultRect={true} scaleText={2.0} title="Today From Moon" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Ashtakavarga and Today */}
                <div className="flex gap-1 h-[25%] min-h-[300px]">
                    {/* Bhinnashtaka */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        {avData ? <AshtakavargaChart title="Bhinnashtaka Varga for Mars" housesData={marsBhinna} defaultRect={true} scaleText={2.0} /> : <div className="p-2 text-xs">Loading AV...</div>}
                    </div>
                    {/* Samudaya */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        {avData ? <AshtakavargaChart title="Samudaya Ashtakavarga" housesData={samAstavarga} defaultRect={true} scaleText={2.0} /> : <div className="p-2 text-xs">Loading AV...</div>}
                    </div>
                    {/* Today Chart */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                            <ZodiacChart houses={d1Houses} variant="legacy" defaultRect={true} scaleText={2.0} title="Today" />
                        </div>
                    </div>
                </div>

                {/* Row 3: Bar Charts and Vimshottari Table */}
                <div className="flex gap-1 h-[30%] min-h-[400px]">
                    <div className="flex-[1.2] flex gap-1">
                        <div className="flex-1 overflow-hidden">
                            <MiniBarChart title="Vimshopaka" data={shadbalaData} dataKey="vimshopaka" isPercent={false} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ShadbalaRatioChart title="Shad Bala" data={shadbalaData} />
                        </div>
                    </div>

                    <div className="flex-[1.8] flex gap-1">
                        {/* Vimshottari Table */}
                        <div className="flex-1 bg-white border border-[#8ec5e6] overflow-hidden flex flex-col">
                            <VimshottariTable data={worksheetData} />
                        </div>
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
