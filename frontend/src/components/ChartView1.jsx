import React from "react";
import ZodiacChart from "./ZodiacChart";

export default function ChartView1({ data }) {
    if (!data) return null;

    const birthDataString = `${data.meta?.name || "Native"}   |   DOB: ${data.meta?.date || data.meta?.dob || ""}   |   TOB: ${data.meta?.time || data.meta?.tob || ""}   |   LOC: ${data.meta?.location || data.meta?.loc || ""}`;

    const getHouses = (chart) => {
        if (chart === 'd1') return data.charts?.houses || data.charts?.D1?.houses;
        return data.vargas?.[chart]?.houses || data.charts?.[chart.toUpperCase()]?.houses;
    };

    const chartsToRender = [
        { id: 'd1', title: 'Birth Chart' },
        { id: 'd9', title: 'D9 Navamsha' },
        { id: 'd10', title: 'D10 Dashamsha' },
        { id: 'd60', title: 'D60 Shashtiamsha' },
        { id: 'd27', title: 'D27 Nakshatramsha' },
        { id: 'd4', title: 'D4 Chaturthamsha' },
        { id: 'd45', title: 'D45 Akshavedamsha' },
        { id: 'd3', title: 'D3 Dreshkana' },
        { id: 'd24', title: 'D24 Chaturvimshamsha' },
    ];

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] font-serif p-2 flex flex-col overflow-y-auto text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-indigo-900/80 pb-1 mb-2 px-2 text-[11px] font-black uppercase tracking-wider text-indigo-950 shrink-0">
                <span>{birthDataString}</span>
                <span>Astro Consult - Chart View 1</span>
            </div>

            <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2 pb-2 min-h-[900px]">
                {chartsToRender.map((chart) => (
                    <div key={chart.id} className="bg-[#fbf9f1] border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm overflow-hidden h-full">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 flex items-center justify-center p-0">
                                <ZodiacChart houses={getHouses(chart.id)} variant="legacy" defaultRect={true} scaleText={1.8} title={chart.title} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
