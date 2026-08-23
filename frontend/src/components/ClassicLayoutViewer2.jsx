import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ZodiacChart from "./ZodiacChart";
import AshtakavargaChart from "./AshtakavargaChart";
import VimshottariTable from "./VimshottariTable";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const ABBREV = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa" };
const PLANET_COLORS_CLASSIC = { Sun: "#cc0000", Moon: "#000000", Mars: "#cc0000", Mercury: "#008000", Jupiter: "#ff8c00", Venus: "#ff00ff", Saturn: "#0000ff" };

const MiniBarChart = ({ title, data, dataKey, isPercent, reqKey, titleFontSize }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-[#8ec5e6] overflow-hidden">
            <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 font-bold tracking-tight text-[#0a4d7a] flex justify-between items-center" style={{ fontSize: titleFontSize || '11px' }}>
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

const ShadbalaRatioChart = ({ title, data, titleFontSize }) => {
    return (
        <div className="flex flex-col h-full bg-white border border-[#8ec5e6] overflow-hidden">
            <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 font-bold tracking-tight text-[#0a4d7a] flex justify-between items-center" style={{ fontSize: titleFontSize || '11px' }}>
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
    const [isRectLagna, setIsRectLagna] = useState(true);

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
            fetch('/api/transit/animated', {
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

    const todayFromLagnaHouses = React.useMemo(() => {
        if (!d1Houses || !transitData || !transitData.transit_chart || !transitData.transit_chart.houses) return null;
        return d1Houses.map(natalHouse => {
            const transitH = transitData.transit_chart.houses.find(h => h.sign_index === natalHouse.sign_index) || { planets: [] };
            return {
                ...natalHouse,
                planets: transitH.planets
            };
        });
    }, [d1Houses, transitData]);

    const todayFromMoonHouses = React.useMemo(() => {
        if (!d1Houses || !transitData || !transitData.transit_chart || !transitData.transit_chart.houses) return null;
        let moonSignIndex = 0;
        for (let h of d1Houses) {
            if (h.planets && h.planets.some(p => (typeof p === 'string' ? p : p.name) === 'Moon')) {
                moonSignIndex = h.sign_index;
                break;
            }
        }
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(houseNum => {
            const currentSignIndex = (moonSignIndex + houseNum - 1) % 12;
            const transitH = transitData.transit_chart.houses.find(h => h.sign_index === currentSignIndex) || { planets: [] };
            return {
                house: houseNum,
                sign_index: currentSignIndex,
                planets: transitH.planets
            };
        });
    }, [d1Houses, transitData]);

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
            pdf.save('ClassicLayoutViewer2.pdf');
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <div id="pdf-classic-content" className="h-screen w-screen bg-[#f3f3f3] font-sans flex flex-col overflow-y-auto overflow-x-hidden text-[#333]">
            <button onClick={handleExportPDF} className="absolute top-2 right-2 z-[100] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase shadow-lg border border-emerald-500/30 transition-all cursor-pointer">Export PDF</button>
            {/* Top Toolbar Replica */}


            {/* Main Grid */}
            <div className="flex-1 flex flex-col p-1 gap-1 min-h-[850px] bg-[#fff0d6]">

                {/* Row 1: Birth Chart */}
                <div className="flex gap-1 h-[45%] min-h-[400px]">
                    {/* Left: Birth Chart */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden relative">
                        <div className="flex-1 relative p-1 flex items-center justify-center bg-white mt-5">
                            <ZodiacChart key={isRectLagna ? 'rect' : 'diamond'} houses={d1Houses} variant="legacy" defaultRect={isRectLagna} hideOuterRect={true} hideLegend={true} scaleText={1.6} title="D1/Lagna Chart" />
                        </div>
                    </div>
                    {/* Right: Bar Charts and Vimshottari Table */}
                    <div className="flex-1 flex flex-col gap-1 h-full">
                        <div className="h-[40%] min-h-0 flex gap-1">
                            <div className="flex-1 overflow-hidden">
                                <MiniBarChart title="Vimshopaka" data={shadbalaData} dataKey="vimshopaka" isPercent={false} titleFontSize="16px" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <ShadbalaRatioChart title="Shad Bala" data={shadbalaData} titleFontSize="16px" />
                            </div>
                        </div>

                        <div className="h-[60%] min-h-0 flex gap-1">
                            {/* Vimshottari Table */}
                            <div className="flex-1 bg-white border border-[#8ec5e6] overflow-hidden flex flex-col">
                                <VimshottariTable data={worksheetData} hideMarriageDasha={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Transits and Ashtakavarga */}
                <div className="flex gap-1 h-[25%] min-h-[250px]">
                    {/* Today From Lagna */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                            {transitData ? (
                                <div className="w-full h-full flex flex-col [&_text]:!font-['Times_New_Roman'] [&_div]:!font-['Times_New_Roman'] [&_text]:!font-bold">
                                    <ZodiacChart key="today-lagna-rect" houses={todayFromLagnaHouses || d1Houses} variant="legacy" defaultRect={true} hideOuterRect={true} hideLegend={true} showNakshatra={false} scaleText={2.5} title="Today From Lagna" titleFontSize="16px" />
                                </div>
                            ) : (
                                <div className="flex flex-col h-full w-full">
                                    <div className="bg-[#f0f8fc] border-b border-[#8ec5e6] px-2 py-1 text-[16px] text-[#0a4d7a] font-bold">Today From Lagna</div>
                                    <div className="flex h-full items-center justify-center text-[14px] text-gray-400">Loading Transit...</div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Today From Moon */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        <div className="flex-1 relative p-1 flex items-center justify-center bg-white">
                            <div className="w-full h-full flex flex-col [&_text]:!font-['Times_New_Roman'] [&_div]:!font-['Times_New_Roman'] [&_text]:!font-bold">
                                <ZodiacChart key="today-moon-rect" houses={todayFromMoonHouses || d1Houses} variant="legacy" defaultRect={true} hideOuterRect={true} scaleText={2.5} title="Today From Moon" titleFontSize="16px" />
                            </div>
                        </div>
                    </div>
                    {/* Bhinnashtaka */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        {avData ? (
                            <div className="w-full h-full flex flex-col [&_text]:!font-['Times_New_Roman'] [&_div]:!font-['Times_New_Roman'] font-size-[16px]">
                                <AshtakavargaChart title="Bhinnashtaka Varga for Mars" housesData={marsBhinna} defaultRect={false} scaleText={2.0} hideOuterFrame={true} titleFontSize="12px" />
                            </div>
                        ) : <div className="p-2 text-xs">Loading AV...</div>}
                    </div>
                    {/* Samudaya */}
                    <div className="flex-1 bg-white border border-[#8ec5e6] flex flex-col overflow-hidden">
                        {avData ? (
                            <div className="w-full h-full flex flex-col [&_text]:!font-['Times_New_Roman'] [&_div]:!font-['Times_New_Roman']">
                                <AshtakavargaChart title="Samudaya Ashtakavarga" housesData={samAstavarga} defaultRect={false} scaleText={2.0} hideOuterFrame={true} titleFontSize="16px" />
                            </div>
                        ) : <div className="p-2 text-xs">Loading AV...</div>}
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
