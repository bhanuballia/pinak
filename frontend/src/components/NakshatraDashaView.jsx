import React, { useState, useEffect } from "react";
import ZodiacChart from "./ZodiacChart";

const PLANET_COLORS = {
    "Sun": "#dc2626", // Red
    "Moon": "#1e293b", // Dark
    "Mars": "#dc2626", // Red
    "Mercury": "#15803d", // Green
    "Jupiter": "#b45309", // Orange
    "Venus": "#be185d", // Pink
    "Saturn": "#1d4ed8", // Blue
    "Rahu": "#374151",
    "Ketu": "#374151"
};

const getPlanetColor = (pStr) => {
    switch (pStr.substring(0, 2)) {
        case "Su": return PLANET_COLORS.Sun;
        case "Mo": return PLANET_COLORS.Moon;
        case "Ma": return PLANET_COLORS.Mars;
        case "Me": return PLANET_COLORS.Mercury;
        case "Ju": return PLANET_COLORS.Jupiter;
        case "Ve": return PLANET_COLORS.Venus;
        case "Sa": return PLANET_COLORS.Saturn;
        case "Ra": return PLANET_COLORS.Rahu;
        case "Ke": return PLANET_COLORS.Ketu;
        default: return "#000";
    }
}

// Helper to format dasha string with colors
const formatDashaString = (str) => {
    const parts = str.split("-");
    return parts.map((part, index) => (
        <span key={index}>
            {index > 0 && <span>-</span>}
            <span style={{ color: getPlanetColor(part) }}>{part}</span>
        </span>
    ));
};

export default function NakshatraDashaView({ data }) {
    const [dashaData, setDashaData] = useState({
        vimshottari: [], ashtottari: [], shodashottari: [], dwadashottari: [],
        panchottari: [], shatabdika: [], chaturshitisama: [], dwisaptatisama: []
    });

    const [offsets, setOffsets] = useState({
        vimshottari: 0, ashtottari: 0, shodashottari: 0, dwadashottari: 0,
        panchottari: 0, shatabdika: 0, chaturshitisama: 0, dwisaptatisama: 0
    });

    useEffect(() => {
        if (!data) return;
        const basic = data.basic_details || {};
        const meta = data.meta || {};

        const dateStr = basic.birth_date || meta.date || '1990-10-01';
        let timeStr = basic.birth_time || meta.time || '12:00:00';
        if (timeStr && timeStr.split(':').length === 2) timeStr = timeStr + ':00';
        const tz = parseFloat(basic.tz_offset ?? meta.tz_offset ?? 5.5);

        const bDate = new Date(`${dateStr}T${timeStr}`);

        fetch("/api/dasha/all-nakshatra", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateStr, time: timeStr, tz_offset: tz, offsets })
        })
        .then(res => res.json())
        .then(res => {
            const formatDashaRow = (row) => {
                const lordAbbr = row.lord ? row.lord.split('-').map(l => l.substring(0, 2)).join('-') : "??";
                const dDate = new Date(bDate.getTime() + (row.start || 0) * 365.2425 * 24 * 60 * 60 * 1000);
                const ds = dDate.toLocaleDateString("en-GB", { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/,/g, '');
                return { d: lordAbbr, date: ds };
            };
            const jdToDate = (jd) => {
                const ts = (jd - 2440587.5) * 86400000;
                const d = new Date(ts);
                return d.toLocaleDateString("en-GB", { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/,/g, '');
            };

            const formatYearsData = (rows) => rows.map(r => formatDashaRow(r)).slice(0, 10);
            const formatJDData = (rows) => rows.map(r => ({ d: r.lord ? r.lord.split('-').map(l => l.substring(0, 2)).join('-') : "??", date: jdToDate(r.start_jd) })).slice(0, 10);
            
            setDashaData({
                vimshottari: res.vimshottari ? formatJDData(res.vimshottari) : [],
                ashtottari: res.ashtottari ? formatYearsData(res.ashtottari) : [],
                shodashottari: res.shodashottari ? formatYearsData(res.shodashottari) : [],
                chaturshitisama: res.chaturshitisama ? formatYearsData(res.chaturshitisama) : [],
                dwadashottari: res.dwadashottari ? formatYearsData(res.dwadashottari) : [],
                shatabdika: res.shatabdika ? formatYearsData(res.shatabdika) : [],
                dwisaptatisama: res.dwisaptatisama ? formatYearsData(res.dwisaptatisama) : [],
                panchottari: res.panchottari ? formatYearsData(res.panchottari) : []
            });
        })
        .catch(err => console.error("Failed to load nakshatra dashas:", err));
    }, [data, offsets]);

    const handleOffsetChange = (sysKey, change) => {
        setOffsets(prev => ({
            ...prev,
            [sysKey]: Math.max(0, prev[sysKey] + change)
        }));
    };

    const renderDashaTable = (title, sysKey, rowData) => (
        <div className="bg-[#ffffea] border-2 border-[#1e3a8a] rounded-lg shadow-sm flex flex-col font-serif overflow-hidden h-full">
            <div className="border-b-2 border-[#1e3a8a] px-2 py-0 text-[14px] text-[#1e3a8a] font-bold bg-white mx-[1px] mt-[1px] flex justify-between items-center rounded-t-[5px]">
                <span>{title}</span>
                <div className="flex gap-2 text-[12px]">
                    <button onClick={() => handleOffsetChange(sysKey, 1)} title="Year Increase" className="hover:text-blue-600 transition-colors">▲</button>
                    <button onClick={() => handleOffsetChange(sysKey, -1)} title="Year Decrease" className="hover:text-blue-600 transition-colors">▼</button>
                </div>
            </div>
            <div className="p-1 pl-2 overflow-y-auto flex-1 leading-tight text-[13px] bg-[#ffffcc]">
                <table className="w-full text-left">
                    <tbody>
                        {rowData.map((row, idx) => (
                            <tr key={idx}>
                                <td className="pr-4 whitespace-nowrap">{formatDashaString(row.d)}</td>
                                <td className="text-gray-800 whitespace-nowrap">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const getHouses = () => {
        if (!data) return {};
        return data.charts?.houses || data.charts?.D1?.houses || {};
    };

    return (
        <div className="min-h-screen w-full bg-[#ffb6c1] p-2 flex flex-col font-serif overflow-y-auto">
            <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2 pb-2 min-h-[750px]">

                {/* Row 1, Col 1: Birth Chart */}
                <div className="bg-[#ffffcc] border-2 border-[#1e3a8a] rounded-lg relative flex flex-col shadow-sm overflow-hidden h-full">
                    <div className="border-b-2 border-[#1e3a8a] px-2 py-0 text-[14px] text-[#1e3a8a] font-bold bg-white mx-[1px] mt-[1px] rounded-t-[5px]">
                        Birth Chart
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 p-1 flex items-center justify-center">
                            <ZodiacChart houses={getHouses()} variant="legacy" defaultRect={true} scaleText={1.6} />
                        </div>
                    </div>
                </div>

                {/* Row 1, Col 2 & 3 */}
                {renderDashaTable("Vimshottari", "vimshottari", dashaData.vimshottari)}
                {renderDashaTable("Ashtottari", "ashtottari", dashaData.ashtottari)}

                {/* Row 2 */}
                {renderDashaTable("Shodashottari", "shodashottari", dashaData.shodashottari)}
                {renderDashaTable("Dwadashottari", "dwadashottari", dashaData.dwadashottari)}
                {renderDashaTable("Panchottari", "panchottari", dashaData.panchottari)}

                {/* Row 3 */}
                {renderDashaTable("Shatabdika", "shatabdika", dashaData.shatabdika)}
                {renderDashaTable("Chaturshitisama", "chaturshitisama", dashaData.chaturshitisama)}
                {renderDashaTable("Dwisaptatisama", "dwisaptatisama", dashaData.dwisaptatisama)}


            </div>

            <div className="text-xs text-center text-gray-800 mt-2 bg-[#ffffea] p-1 rounded border border-gray-400">
                This worksheet shows the major Nakshatra based Dasha systems together. You can change the Dasha system of any of them by clicking on the title...
            </div>
        </div>
    );
}
