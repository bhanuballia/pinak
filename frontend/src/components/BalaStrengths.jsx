import React from "react";

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
};

const PLANET_ABBREV = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
    "Rahu": "Ra", "Ketu": "Ke"
};

// Mock data based on the image
const birthChartData = [
    { p: "Sun", sbPct: 1.41, sbNum: 3, war: "", ishKas: "119/137", domin: 0.75, func: "Malef" },
    { p: "Moon", sbPct: 1.09, sbNum: 3, war: "", ishKas: "89/131", domin: 0.88, func: "Neutr" },
    { p: "Mars", sbPct: 1.32, sbNum: 2, war: "", ishKas: "200/74", domin: 1.94, func: "Malef" },
    { p: "Mercury", sbPct: 0.91, sbNum: 4, war: "", ishKas: "121/130", domin: 2.68, func: "Neutr" },
    { p: "Jupiter", sbPct: 1.19, sbNum: 4, war: "", ishKas: "146/153", domin: 0.94, func: "Malef" },
    { p: "Venus", sbPct: 1.20, sbNum: 3, war: "", ishKas: "103/209", domin: 1.50, func: "Benef" },
    { p: "Saturn", sbPct: 1.59, sbNum: 4, war: "", ishKas: "186/155", domin: 3.47, func: "Benef" },
    { p: "Rahu", sbPct: null, sbNum: null, war: "", ishKas: "", domin: 2.47, func: "Neutr" },
    { p: "Ketu", sbPct: null, sbNum: null, war: "", ishKas: "", domin: 0.59, func: "Neutr" },
];

const bhavaBalaData = {
    rashi: ["Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis", "Ari", "Tau"],
    degree: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    fromLord: [382, 392, 548, 382, 396, 397, 463, 478, 478, 463, 397, 396],
    digBala: [60, 10, 10, 30, 20, 50, 0, 40, 20, 0, 50, 40],
    drishti: [-34, 16, -29, -45, 34, 36, 49, 2, -24, -38, -49, -59],
    planetsIn: [0, 0, 0, 0, 0, -60, -60, -60, 60, 0, 60, 0],
    dayNight: [15, 0, 15, 15, 15, 15, 0, 0, 15, 0, 0, 0],
    total: [7, 7, 9, 6, 8, 7, 8, 8, 9, 7, 8, 6],
};

export default function BalaStrengths({ data }) {

    // Renders the left table
    const renderBirthChartTable = () => (
        <div className="flex-1 bg-white border border-[#005c99] rounded-sm shadow-sm font-serif text-[13px] flex flex-col">
            <div className="border-b border-[#005c99] px-2 py-0.5 text-xl text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                Birth Chart
            </div>
            <div className="p-2 flex-1">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-400 italic">
                            <th className="font-normal px-1 w-8"></th>
                            <th className="font-normal px-1">SB%</th>
                            <th className="font-normal px-1">SB#</th>
                            <th className="font-normal px-1">War</th>
                            <th className="font-normal px-1">IshKas</th>
                            <th className="font-normal px-1">Domin.</th>
                            <th className="font-normal px-1">Func.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {birthChartData.map((row, idx) => (
                            <tr key={idx}>
                                <td className="px-1" style={{ color: PLANET_COLORS[row.p] }}>{PLANET_ABBREV[row.p]}</td>
                                <td className="px-1">{row.sbPct !== null ? row.sbPct.toFixed(2) : ""}</td>
                                <td className="px-1">{row.sbNum !== null ? row.sbNum : ""}</td>
                                <td className="px-1">{row.war}</td>
                                <td className="px-1">{row.ishKas}</td>
                                <td className="px-1">{row.domin.toFixed(2)}</td>
                                <td className="px-1">{row.func}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Renders the right bar chart
    const renderShadBalaChart = () => {
        const chartPlanets = birthChartData.filter(p => p.sbPct !== null);
        // Let's assume height 100% = max val (e.g. 2.0). 
        // 1.0 is the dividing line (50% height).
        const maxVal = 2.0;
        const threshold = 1.0;

        return (
            <div className="flex-[1.2] bg-white border border-[#005c99] rounded-sm shadow-sm font-serif flex flex-col">
                <div className="border-b border-[#005c99] px-2 py-0.5 text-xl text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                    Shad Bala
                </div>
                <div className="flex-1 relative m-1 border border-black overflow-hidden flex items-end justify-around px-2 pb-0 pt-4" style={{ minHeight: '200px' }}>
                    {/* Background split: Top Green, Bottom Red */}
                    <div className="absolute top-0 left-0 right-0 bottom-1/2 bg-[#009900]"></div>
                    <div className="absolute top-1/2 left-0 right-0 bottom-0 bg-[#ff0000] border-t border-black"></div>

                    {/* Bars */}
                    {chartPlanets.map((p, idx) => {
                        const heightPct = (p.sbPct / maxVal) * 100;
                        return (
                            <div key={idx} className="relative w-12 bg-[#ffffea] border border-black flex flex-col justify-end pb-2 items-center z-10" style={{ height: `${heightPct}%` }}>
                                <div style={{ color: PLANET_COLORS[p.p] }} className="font-semibold">{PLANET_ABBREV[p.p]}</div>
                                <div className="text-xs">{p.sbPct.toFixed(2)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Renders the bottom table
    const renderBhavaBalaTable = () => {
        const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return (
            <div className="bg-[#ffffea] border border-[#005c99] rounded-sm shadow-sm font-serif text-[13px] flex flex-col mt-4">
                <div className="border-b border-[#005c99] px-2 py-0.5 text-xl text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                    Bhava Bala
                </div>
                <div className="p-2 overflow-x-auto">
                    <table className="w-full text-center text-[#00008b]">
                        <thead>
                            <tr className="border-b-2 border-double border-[#005c99]">
                                <th className="text-left font-normal px-2 pb-1">Bhava Bala</th>
                                {houses.map(h => (
                                    <th key={h} className="font-normal px-2 pb-1">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="text-left px-2 py-0.5">Rashi</td>{bhavaBalaData.rashi.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5">Degree</td>{bhavaBalaData.degree.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5">From Lord</td>{bhavaBalaData.fromLord.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5">Dig Bala</td>{bhavaBalaData.digBala.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5">Drishti</td>{bhavaBalaData.drishti.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5">Planets in</td>{bhavaBalaData.planetsIn.map((v, i) => <td key={i}>{v}</td>)}</tr>
                            <tr><td className="text-left px-2 py-0.5 border-b border-gray-400">Day-Night</td>{bhavaBalaData.dayNight.map((v, i) => <td key={i} className="border-b border-gray-400">{v}</td>)}</tr>
                            <tr className="font-bold">
                                <td className="text-left px-2 py-1">Total</td>
                                {bhavaBalaData.total.map((v, i) => <td key={i}>{v}</td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-2">
                {renderBirthChartTable()}
                {renderShadBalaChart()}
            </div>
            {renderBhavaBalaTable()}
        </div>
    );
}
