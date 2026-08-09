import React, { useState, useEffect } from "react";
import axios from "axios";
import ZodiacChart from "./ZodiacChart";
import { getDignityStatus } from "./worksheet/WorksheetUtils";

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

// Jaimini Karaka Calculation (7 and 8 schemes)
const calculateKarakas = (planetPositions) => {
    if (!planetPositions) return { k7: {}, k8: {} };

    // Filter out nodes for 7 Karakas
    const planetsFor7 = planetPositions.filter(p => !["Rahu", "Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet));

    // Sort by degree in sign descending
    const sorted7 = [...planetsFor7].sort((a, b) => (b.degree % 30) - (a.degree % 30));

    const k7Names = ["Atma Karaka", "Amatya Karaka", "Bhratru Karaka", "Matru Karaka", "Pitri Karaka", "Gnati Karaka", "Dara Karaka"];
    const k7 = {};
    sorted7.forEach((p, idx) => {
        if (idx < 7) k7[p.planet] = k7Names[idx];
    });

    // For 8 Karakas, Rahu is included. (Degree is usually reversed for Rahu, but we'll use simple sort for now or reverse if needed).
    const planetsFor8 = planetPositions.filter(p => !["Ketu", "Ascendant", "Lagna", "Uranus", "Neptune", "Pluto"].includes(p.planet));
    // Rahu's longitude is calculated from the end of the sign (30 - degree) in some traditions, but let's use the raw degree in sign for simplicity here or calculate properly:
    const sorted8 = [...planetsFor8].map(p => {
        let deg = p.degree % 30;
        if (p.planet === "Rahu") deg = 30 - deg;
        return { ...p, degInSign: deg };
    }).sort((a, b) => b.degInSign - a.degInSign);

    const k8Names = ["Atma Karaka", "Amatya Karaka", "Bhratru Karaka", "Matru Karaka", "Pitri Karaka", "Putra Karaka", "Gnati Karaka", "Dara Karaka"];
    const k8 = {};
    sorted8.forEach((p, idx) => {
        if (idx < 8) k8[p.planet] = k8Names[idx];
    });

    return { k7, k8 };
};

const getFunctionalNature = (lagnaIdx, planetName) => {
    const lagnaMap = {
        0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
        2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
        3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
        5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
        6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
        7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
        8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
        9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
        10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
        11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
    };
    const lagnaData = lagnaMap[lagnaIdx] || { benefic: [], malefic: [] };
    if (planetName === "Rahu" || planetName === "Ketu") return "Malefic";
    if (lagnaData.benefic.includes(planetName)) return "Benefic";
    if (lagnaData.malefic.includes(planetName)) return "Malefic";
    return "Neutral";
};

const calculatePlanetArgala = (planetName, planetPositions, d1Houses) => {
    const lagnaHouse = d1Houses[1] || d1Houses["1"] || {};
    const lagnaSignIdx = lagnaHouse.sign_index !== undefined ? lagnaHouse.sign_index : 0;

    const pObj = planetPositions.find(p => p.planet === planetName);
    if (!pObj) return "None";

    const pSignIdx = pObj.sign_index !== undefined ? pObj.sign_index : Math.floor(pObj.degree / 30);
    const houseFromLagna = ((pSignIdx - lagnaSignIdx + 12) % 12) + 1;

    // Primary Argala houses from Lagna: 2nd, 4th, 11th; Secondary: 5th
    if (houseFromLagna === 2) return "2nd Argala";
    if (houseFromLagna === 4) return "4th Argala";
    if (houseFromLagna === 11) return "11th Argala";
    if (houseFromLagna === 5) return "5th Argala";
    if (houseFromLagna === 12) return "Virodha (12th)";
    if (houseFromLagna === 10) return "Virodha (10th)";
    if (houseFromLagna === 3) return "Virodha (3rd)";
    if (houseFromLagna === 9) return "Virodha (9th)";

    return "Primary";
};

const formatDegree = (decDeg) => {
    if (decDeg === undefined || decDeg === null) return "";
    const degInSign = decDeg % 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign - d) * 60);
    const s = Math.floor((((degInSign - d) * 60) - m) * 60);
    return `${d.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function JaiminiKarakasViewer({ data }) {
    const [specialLagnas, setSpecialLagnas] = useState(null);

    useEffect(() => {
        const fetchLagnas = async () => {
            if (!data) return;
            try {
                const details = data.birth_details || {};
                const dateStr = details.date || "2000-01-01";
                const timeStr = details.time || "12:00:00";

                const payload = {
                    date: dateStr,
                    time: timeStr,
                    tz_offset: details.tz_offset || 5.5,
                    lat: details.lat || 28.6139,
                    lon: details.lon || 77.2090
                };
                const response = await axios.get('/api/special_lagnas', {
                    params: payload,
                    baseURL: window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : ''
                });
                setSpecialLagnas(response.data);
            } catch (err) {
                console.error("Error fetching special lagnas", err);
            }
        };
        fetchLagnas();
    }, [data]);

    if (!data) return <div className="p-4 text-red-500">No data available</div>;

    const d1Houses = data.charts?.houses || data.charts?.D1?.houses || [];
    const planetPositions = data.planet_positions || [];

    // Calculate Karakas
    const { k7, k8 } = calculateKarakas(planetPositions);

    return (
        <div className="h-screen w-screen bg-[#fff0f5] font-serif flex flex-col overflow-y-auto overflow-x-hidden p-1 text-[#333]">
            {/* Header */}
            <div className="flex justify-between items-center px-2 py-1 border-b border-gray-400 bg-white">
                <div className="font-bold uppercase tracking-wider">{data.meta?.name || "Astro Native"} {data.meta?.date}</div>
                <div className="text-sm"> Jaimini karakas</div>
            </div>

            <div className="flex-1 flex gap-1 mt-1 min-h-0">
                {/* Left Column */}
                <div className="flex-[65] flex flex-col gap-1 min-h-0">

                    {/* Top Left: Birth Chart */}
                    <div className="flex-[65] border-[1.5px] border-blue-800 rounded-sm bg-white flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 bg-[#fdfaf6] flex flex-col min-h-0 overflow-hidden">
                            <ZodiacChart houses={d1Houses} variant="legacy" title="Birth Chart" defaultRect={true} hideLegend={true} hideTranslation={true} scaleText={1.7} />
                        </div>
                    </div>

                    {/* Bottom Left: Planet Table */}
                    <div className="flex-[35] border-[1.5px] border-blue-800 rounded-sm bg-white flex flex-col min-h-[150px] overflow-hidden">
                        <div className="bg-blue-50/50 px-2 border-b border-blue-800 text-sm font-bold text-blue-900 shrink-0">
                            Birth Chart
                        </div>
                        <div className="flex-1 overflow-auto bg-white custom-scrollbar min-h-0">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-b border-gray-300 italic">
                                        <th className="font-normal pl-2 py-0.5"></th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Degree</th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Rashi</th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Dignity</th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Arg</th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Karaka7</th>
                                        <th className="font-bold text-[12px] px-1 py-0.5">Karaka8</th>
                                        <th className="font-normal px-1 py-0.5">Func.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planetPositions.map(p => {
                                        const lagnaHouse = d1Houses[1] || d1Houses["1"] || {};
                                        const lagnaSignIdx = lagnaHouse.sign_index !== undefined ? lagnaHouse.sign_index : 0;
                                        const funcNature = getFunctionalNature(lagnaSignIdx, p.planet);
                                        const digObj = getDignityStatus(p.planet, p.sign);
                                        const computedDignity = p.dignity || (digObj ? digObj.label.replace(/ [★↓◆♥✕]/g, '') : "-");
                                        const argalaStatus = calculatePlanetArgala(p.planet, planetPositions, d1Houses);
                                        return (
                                            <tr key={p.planet} className="border-b border-gray-100">
                                                <td className="pl-2 py-0.5 font-semibold" style={{ color: getPlanetColor(p.planet) }}>
                                                    {PLANET_ABBREV[p.planet] || p.planet}
                                                </td>
                                                <td className="font-bold text-[12px] px-1 py-0.5 font-mono">{formatDegree(p.degree)}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{p.sign}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{computedDignity}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{argalaStatus}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{k7[p.planet] || "-"}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{k8[p.planet] || "-"}</td>
                                                <td className="font-bold text-[12px] px-1 py-0.5">{funcNature}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-[35] flex flex-col gap-1 min-h-0">

                    {/* Top Right: Pada Chart */}
                    <div className="flex-[60] border-[1.5px] border-blue-800 rounded-sm bg-white flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 bg-[#fdfaf6] flex flex-col min-h-0 overflow-hidden">
                            {/* Reusing ZodiacChart with D9 houses to show Pada/Navamsha layout */}
                            <ZodiacChart houses={data.vargas?.d9?.houses || {}} variant="legacy" title="Pada" defaultRect={true} hideLegend={true} hideTranslation={true} scaleText={1.8} />
                        </div>
                    </div>

                    {/* Middle Right: Lagnas */}
                    <div className="flex-[35] border-[1.5px] border-blue-800 rounded-sm bg-white flex flex-col min-h-[100px]">
                        <div className="bg-blue-50/50 px-2 border-b border-blue-800 text-sm font-bold text-blue-900">
                            Lagnas
                        </div>
                        <div className="flex-1 overflow-auto bg-white p-2 text-xs custom-scrollbar">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div>Bhava Lagna</div><div>{specialLagnas?.bhava?.formatted || '-'}</div>
                                <div>Hora Lagna</div><div>{specialLagnas?.hora?.formatted || '-'}</div>
                                <div>Ghatika Lagna</div><div>{specialLagnas?.ghatika?.formatted || '-'}</div>
                                <div className="col-span-2 mt-1 font-bold text-gray-500 italic">Jaimini Lagnas:</div>
                                <div>Hora Lagna</div><div>{specialLagnas?.hora?.formatted || '-'}</div>
                                <div>Indu Lagna</div><div>{(() => {
                                    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                                    const moonHouse = (planetPositions.find(p => p.planet === "Moon")?.degree || 0);
                                    const mSignIdx = Math.floor(moonHouse / 30) % 12;
                                    const mDeg = Math.floor(moonHouse % 30).toString().padStart(2, '0');
                                    const mMin = Math.floor(((moonHouse % 30) - mDeg) * 60).toString().padStart(2, '0');
                                    return `${mDeg}${signs[mSignIdx].slice(0, 3)}${mMin}`;
                                })()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right: Jaimini Karakas and aspects (7) */}
                    <div className="flex-[40] border-[1.5px] border-blue-800 rounded-sm bg-white flex flex-col min-h-[100px]">
                        <div className="bg-blue-50/50 px-2 border-b border-blue-800 text-sm font-bold text-blue-900">
                            Jaimini Karakas and aspects (7)
                        </div>
                        <div className="flex-1 overflow-auto bg-white p-1 custom-scrollbar">
                            {(() => {
                                // Find planet assigned to each Karaka role
                                const getKarakaPlanet = (role) => {
                                    const match = Object.entries(k7).find(([planet, kName]) => kName.toLowerCase().includes(role.toLowerCase()));
                                    return match ? PLANET_ABBREV[match[0]] || match[0] : "-";
                                };

                                return (
                                    <table className="w-full text-center text-[10px] sm:text-xs border border-blue-800">
                                        <thead>
                                            <tr className="border-b border-blue-800 text-blue-900 bg-blue-50/30">
                                                <th className="border-r border-blue-800 font-semibold py-0.5">AK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">AmK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">BK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">MK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">PiK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">PK</th>
                                                <th className="border-r border-blue-800 font-semibold py-0.5">GK</th>
                                                <th className="font-semibold py-0.5">DK</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border-r border-blue-800 py-0.5 text-red-600 font-bold">{getKarakaPlanet("Atma")}</td>
                                                <td className="border-r border-blue-800 py-0.5 text-red-600 font-bold">{getKarakaPlanet("Amatya")}</td>
                                                <td className="border-r border-blue-800 py-0.5 text-slate-800 font-bold">{getKarakaPlanet("Bhratru")}</td>
                                                <td className="border-r border-blue-800 py-0.5 text-blue-800 font-bold">{getKarakaPlanet("Matru")}</td>
                                                <td className="border-r border-blue-800 py-0.5 text-pink-600 font-bold">{getKarakaPlanet("Pitri")}</td>
                                                <td className="border-r border-blue-800 py-0.5 font-bold">{getKarakaPlanet("Putra")}</td>
                                                <td className="border-r border-blue-800 py-0.5 text-green-700 font-bold">{getKarakaPlanet("Gnati")}</td>
                                                <td className="py-0.5 text-amber-600 font-bold">{getKarakaPlanet("Dara")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                );
                            })()}
                            <div className="mt-1 text-[10px] sm:text-xs text-blue-900 font-semibold space-y-0.5">
                                <div>Aspects between Planets in dual signs: Gemini ↔ Virgo ↔ Sagittarius ↔ Pisces</div>
                                <div>Aspects between Planets in movable and fixed signs: Active (Movable ↔ Fixed)</div>
                            </div>
                            <div className="mt-1.5 p-1.5 bg-blue-50 border border-blue-200 rounded text-[10px] sm:text-xs text-blue-950 leading-tight space-y-0.5">
                                <div className="font-bold text-blue-900">🔮 Jaimini Karaka Analysis:</div>
                                <div><strong>Atma Karaka (AK):</strong> Directs soul purpose and primary karmic lessons.</div>
                                <div><strong>Amatya Karaka (AmK):</strong> Governs career direction, professional honors, and executive role.</div>
                                <div><strong>Dara Karaka (DK):</strong> Governs spouse characteristics, partnerships, and public relations.</div>
                            </div>
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
