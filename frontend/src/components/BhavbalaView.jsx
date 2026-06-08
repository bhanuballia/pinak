import React from "react";

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

// Mock data for Samudaya Ashtakavarga based on the image's bar heights
// Let's say max value is 50, Auspicious > 30, Neutral 20-30, Inauspicious < 20
// The bars visually:
// 1(Gem): ~25 (Gray)
// 2(Can): ~35 (Blue)
// 3(Leo): ~25 (Gray)
// 4(Vir): ~25 (Gray)
// 5(Lib): ~24 (Gray)
// 6(Sco): ~37 (Blue)
// 7(Sag): ~23 (Gray)
// 8(Cap): ~23 (Gray)
// 9(Aqu): ~33 (Blue)
// 10(Pis): ~24 (Gray)
// 11(Ari): ~28 (Gray)
// 12(Tau): ~15 (Red)
const ashtakavargaData = [
    { sign: "Gem", house: 1, val: 25 },
    { sign: "Can", house: 2, val: 35 },
    { sign: "Leo", house: 3, val: 25 },
    { sign: "Vir", house: 4, val: 25 },
    { sign: "Lib", house: 5, val: 24 },
    { sign: "Sco", house: 6, val: 37 },
    { sign: "Sag", house: 7, val: 23 },
    { sign: "Cap", house: 8, val: 23 },
    { sign: "Aqu", house: 9, val: 33 },
    { sign: "Pis", house: 10, val: 24 },
    { sign: "Ari", house: 11, val: 28 },
    { sign: "Tau", house: 12, val: 15 },
];

export default function BhavbalaView({ data }) {

    const renderBhavaBalaTable = () => {
        const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return (
            <div className="bg-[#ffffea] border border-[#005c99] rounded-sm shadow-sm font-serif text-[13px] flex flex-col w-full">
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

    const renderAshtakavargaChart = () => {
        const AUSPICIOUS_LINE = 30;
        const NEUTRAL_LINE = 20;
        const MAX_VAL = 50;

        return (
            <div className="bg-[#ffffea] border border-[#005c99] rounded-sm shadow-sm font-serif text-[13px] flex flex-col w-full h-[350px]">
                <div className="border-b border-[#005c99] px-2 py-0.5 text-xl text-[#005c99] font-medium rounded-t-sm bg-white" style={{ borderRadius: '15px', margin: '2px', border: '1px solid #005c99' }}>
                    Samudaya Ashtakavarga
                </div>
                <div className="flex-1 relative m-2 border-l border-r border-[#00008b] flex flex-col justify-end pt-8">
                    {/* Horizontal Threshold Lines */}
                    <div className="absolute left-0 right-0 border-t border-[#00008b] z-0" style={{ bottom: `${(AUSPICIOUS_LINE / MAX_VAL) * 100}%` }}></div>
                    <div className="absolute left-0 right-0 border-t border-[#00008b] z-0" style={{ bottom: `${(NEUTRAL_LINE / MAX_VAL) * 100}%` }}></div>
                    <div className="absolute left-0 right-0 border-t border-[#00008b] z-0" style={{ bottom: '0%' }}></div>

                    {/* Labels */}
                    <div className="absolute left-1 text-[#00008b]" style={{ bottom: `${(AUSPICIOUS_LINE / MAX_VAL) * 100 + 3}%` }}>Auspicious</div>
                    <div className="absolute left-1 text-[#00008b]" style={{ bottom: `${(NEUTRAL_LINE / MAX_VAL) * 100 + 1}%` }}>Neutral</div>
                    <div className="absolute left-1 text-[#00008b]" style={{ bottom: `${(NEUTRAL_LINE / MAX_VAL) * 100 - 6}%` }}>Inauspicious</div>

                    {/* Bars Container */}
                    <div className="flex h-full items-end z-10 mx-[15%]">
                        {ashtakavargaData.map((d, i) => {
                            let barColor = "#c0c0c0"; // Gray (Neutral)
                            if (d.val >= AUSPICIOUS_LINE) barColor = "#8b8bff"; // Blue (Auspicious)
                            if (d.val < NEUTRAL_LINE) barColor = "#ff4d4d"; // Red (Inauspicious)

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    {/* The Bar */}
                                    <div
                                        className="w-full border-t border-l border-r border-black shadow-sm"
                                        style={{ height: `${(d.val / MAX_VAL) * 100}%`, backgroundColor: barColor, opacity: 0.9 }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex mb-2 text-[#00008b] mx-[15%] px-2">
                    <div className="absolute left-4 flex flex-col text-left">
                        <div>Sign</div>
                        <div>House</div>
                    </div>
                    {ashtakavargaData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div>{d.sign}</div>
                            <div>{d.house}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col gap-4 overflow-y-auto">
            {renderBhavaBalaTable()}
            {renderAshtakavargaChart()}
        </div>
    );
}
