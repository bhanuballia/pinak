import React from "react";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const SIGNS = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const PLANET_ABBREV = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
    "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
};

const PLANET_COLORS = {
    "Sun": "#dc2626",
    "Moon": "#1e293b",
    "Mars": "#b91c1c",
    "Mercury": "#15803d",
    "Jupiter": "#b45309",
    "Venus": "#be185d",
    "Saturn": "#1d4ed8",
    "Rahu": "#7e22ce",
    "Ketu": "#451a03",
};

const DIVISIONS = [
    { id: 'd1', name: 'Janma' },
    { id: 'd2', name: 'Hora' },
    { id: 'd3', name: 'Dreshkana' },
    { id: 'd4', name: 'Chaturthamsha' },
    { id: 'd7', name: 'Saptamsha' },
    { id: 'd9', name: 'Navamsha' },
    { id: 'd10', name: 'Dashamsha' },
    { id: 'd12', name: 'Dwadashamsha' },
    { id: 'd16', name: 'Shodashamsha' },
    { id: 'd20', name: 'Vimshamsha' },
    { id: 'd24', name: 'Chaturvimshamsha' },
    { id: 'd27', name: 'Saptavimshamsha' },
    { id: 'd30', name: 'Trimshamsha' },
    { id: 'd40', name: 'Khavedamsha' },
    { id: 'd45', name: 'Akshavedamsha' },
    { id: 'd60', name: 'Shashtiamsha' }
];

const SHAD_VARGA = ['d1', 'd2', 'd3', 'd9', 'd12', 'd30'];

export default function VargaSignChart({ data }) {
    if (!data) return null;

    const getHouses = (chart) => {
        if (chart === 'd1') return data.charts?.houses || data.charts?.D1?.houses;
        return data.vargas?.[chart]?.houses || data.charts?.[chart.toUpperCase()]?.houses;
    };

    const getSignForPlanet = (houses, planetName) => {
        if (!houses) return null;
        for (let h = 1; h <= 12; h++) {
            const info = houses[h] || houses[String(h)] || {};
            const planets = info.planets || [];
            const found = planets.find(p => {
                const name = typeof p === 'object' ? p.name : p;
                return name === planetName;
            });
            if (found) {
                const signIndex = info.sign_index !== undefined
                    ? info.sign_index
                    : info.cusp_deg !== undefined ? Math.floor(info.cusp_deg / 30) : null;
                return signIndex;
            }
        }
        return null;
    };

    // Calculate Signs Occupied in 16 divisions
    const signsInDivisions = DIVISIONS.map(div => {
        const houses = getHouses(div.id);
        const row = { name: div.name };
        PLANETS.forEach(planet => {
            const signIndex = getSignForPlanet(houses, planet);
            row[planet] = signIndex !== null ? SIGNS[signIndex] : '-';
        });
        return row;
    });

    // Calculate Dispositors in Shad Varga
    const dispositorCounts = {}; // { Planet: { Dispositor: Count } }
    PLANETS.forEach(p => { dispositorCounts[p] = {}; });

    SHAD_VARGA.forEach(chartId => {
        const houses = getHouses(chartId);
        if (houses) {
            PLANETS.forEach(planet => {
                const signIndex = getSignForPlanet(houses, planet);
                if (signIndex !== null) {
                    const dispositor = SIGN_LORDS[signIndex];
                    if (!dispositorCounts[planet][dispositor]) {
                        dispositorCounts[planet][dispositor] = 0;
                    }
                    dispositorCounts[planet][dispositor]++;
                }
            });
        }
    });

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-4 flex flex-col font-serif overflow-y-auto gap-4 text-sm">

            {/* Table 1: Signs occupied in 16 divisions */}
            <div className="bg-[#ffffea] border border-[#005c99] rounded-md shadow-md">
                <div className="bg-white border-b border-[#005c99] px-4 py-1 text-xl font-medium rounded-t-md text-black flex items-center shadow-sm" style={{ borderRadius: '50px', margin: '4px', border: '2px solid #005c99' }}>
                    Signs occupied in the 16 divisions
                </div>
                <div className="p-2 overflow-x-auto">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="border-b border-gray-400">
                                <th className="text-left font-normal px-2"></th>
                                {PLANETS.map(p => (
                                    <th key={p} className="font-bold px-2 py-1" style={{ color: PLANET_COLORS[p] || '#000' }}>
                                        {p === 'Mercury' ? 'Mer' : p === 'Jupiter' ? 'Jup' : p.substring(0, 3)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {signsInDivisions.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="text-left px-2 py-0.5 text-gray-800">{row.name}</td>
                                    {PLANETS.map(p => (
                                        <td key={p} className="px-2 py-0.5 text-gray-800">{row[p]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table 2: Dispositors in 6 divisions (Shad Varga) */}
            <div className="bg-[#ffffea] border border-[#005c99] rounded-md shadow-md">
                <div className="bg-white border-b border-[#005c99] px-4 py-1 text-xl font-medium rounded-t-md text-black flex items-center shadow-sm" style={{ borderRadius: '50px', margin: '4px', border: '2px solid #005c99' }}>
                    Dispositors in 6 divisions (Shad Varga)
                </div>
                <div className="p-2 overflow-x-auto">
                    <table className="w-full text-center" style={{ verticalAlign: 'top' }}>
                        <thead>
                            <tr className="border-b border-gray-400">
                                {PLANETS.map(p => (
                                    <th key={p} className="font-bold px-2 py-2 italic" style={{ color: PLANET_COLORS[p] || '#000' }}>
                                        {p}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {PLANETS.map(p => {
                                    const counts = dispositorCounts[p];
                                    // Sort by count descending, then by name
                                    const sortedDispositors = Object.keys(counts).sort((a, b) => {
                                        if (counts[b] !== counts[a]) return counts[b] - counts[a];
                                        return a.localeCompare(b);
                                    });

                                    return (
                                        <td key={p} className="px-2 py-2 align-top">
                                            <div className="flex flex-col gap-1 items-center">
                                                {sortedDispositors.map(disp => (
                                                    <div key={disp} className="font-semibold" style={{ color: PLANET_COLORS[disp] || '#000' }}>
                                                        {PLANET_ABBREV[disp]}({counts[disp]})
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
