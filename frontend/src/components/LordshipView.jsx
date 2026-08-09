import React from "react";
import ZodiacChart from "./ZodiacChart";

const SIGN_LORDS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const PLANET_ABBREV = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
    "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
};

const getLordships = (houses) => {
    if (!houses) return [];
    const lordships = [];
    const planetPlacements = {};

    for (let h = 1; h <= 12; h++) {
        const info = houses[h] || houses[String(h)] || {};
        const planets = info.planets || [];
        planets.forEach(p => {
            const pName = typeof p === 'object' ? p.name : p;
            planetPlacements[pName] = h;
        });
    }

    for (let h = 1; h <= 12; h++) {
        const info = houses[h] || houses[String(h)] || {};
        const signIndex = info.sign_index !== undefined
            ? info.sign_index
            : info.cusp_deg !== undefined ? Math.floor(info.cusp_deg / 30) : null;

        if (signIndex !== null && signIndex >= 0 && signIndex < 12) {
            const lordPlanet = SIGN_LORDS[signIndex];
            const placedIn = planetPlacements[lordPlanet];
            lordships.push({
                house: h,
                placedIn: placedIn ? placedIn : '?',
                planet: PLANET_ABBREV[lordPlanet] || lordPlanet,
                planetName: lordPlanet
            });
        }
    }
    return lordships;
};

const PLANET_COLORS = {
    "Sun": "#dc2626",
    "Moon": "#475569",
    "Mars": "#b91c1c",
    "Mercury": "#15803d",
    "Jupiter": "#b45309",
    "Venus": "#be185d",
    "Saturn": "#3730a3",
};

export default function LordshipView({ data }) {
    if (!data) return null;

    const getHouses = (chart) => {
        if (chart === 'd1') return data.charts?.houses || data.charts?.D1?.houses;
        return data.vargas?.[chart]?.houses || data.charts?.[chart.toUpperCase()]?.houses;
    };

    const d1Houses = getHouses('d1');
    const d9Houses = getHouses('d9');
    const d10Houses = getHouses('d10');

    const renderLordshipBox = (houses, title) => {
        const lordships = getLordships(houses);
        if (lordships.length === 0) return null;

        const leftCol = lordships.slice(0, 6);
        const rightCol = lordships.slice(6, 12);

        return (
            <div className="flex-1 border-2 border-[#005c99] rounded-lg bg-[#ffffea] ml-2 flex flex-col shadow-sm">
                <div className="bg-white border-b-2 border-[#005c99] px-2 py-0.5 text-[#005c99] font-bold text-sm tracking-wide rounded-t-md">
                    {title}
                </div>
                <div className="flex-1 flex p-2 text-[16px] font-serif">
                    <div className="flex-1 flex flex-col gap-1 pr-2">
                        {leftCol.map((l, idx) => (
                            <div key={idx} className="flex whitespace-nowrap" style={{ color: PLANET_COLORS[l.planetName] || '#000' }}>
                                <span className="w-[85px]">Lord of {l.house} in</span>
                                <span className="w-[20px]">{l.placedIn}</span>
                                <span>- {l.planet}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 pl-2">
                        {rightCol.map((l, idx) => (
                            <div key={idx} className="flex whitespace-nowrap" style={{ color: PLANET_COLORS[l.planetName] || '#000' }}>
                                <span className="w-[85px]">Lord of {l.house} in</span>
                                <span className="w-[20px]">{l.placedIn}</span>
                                <span>- {l.planet}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderRow = (chartId, title, subTitle, titleSuffix = "Lordships") => {
        const houses = getHouses(chartId);
        return (
            <div className="flex w-full min-h-[200px]">
                {/* Left: Chart */}
                <div className="flex-1 border-2 border-[#005c99] rounded-lg bg-white relative flex flex-col shadow-sm max-w-[50%]">
                    <div className="absolute inset-0 flex items-center justify-center p-0 pt-0">
                        <ZodiacChart houses={houses} variant="legacy" defaultRect={true} scaleText={1.6} title={`${title} ${subTitle}`} hideTranslation={true} hideLegend={true} hideOuterRect={true} />
                    </div>
                </div>
                {/* Right: Lordships */}
                {renderLordshipBox(houses, `${title} ${titleSuffix}`)}
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col font-serif overflow-y-auto">
            <div className="flex flex-col gap-2 flex-1 pb-16">
                {renderRow('d1', 'Birth Chart', '', 'Lordships')}
                {renderRow('d9', 'D9 Navamsha', '(spouse)')}
                {renderRow('d10', 'D10 Dashamsha', '(great successes)')}
            </div>


        </div>
    );
}
