import React, { useState, useEffect } from "react";
import axios from "axios";
import ZodiacChart from "./ZodiacChart";
import KarmaDashboard from "./KarmaDashboard";

export default function RashiDashasView({ data }) {
    const [dashaData, setDashaData] = useState({
        kalachakraData: [],
        charaData: [],
        sthiraData: [],
        niryaanaShoolaData: [],
        drigData: [],
        narayanaData: [],
        lagnaKendradiData: [],
        sreeLagnaKendradiData: [],
    });

    // State to track the drill-down path for each table. 
    // Key is the table key (e.g. "charaData"), Value is an array of selected indices or lords representing the path.
    const [drillPaths, setDrillPaths] = useState({
        kalachakraData: [],
        charaData: [],
        sthiraData: [],
        niryaanaShoolaData: [],
        drigData: [],
        narayanaData: [],
        lagnaKendradiData: [],
        sreeLagnaKendradiData: [],
    });

    // Selected row index for drilling down
    const [selectedRows, setSelectedRows] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashaData = async () => {
            setLoading(true);
            try {
                // Determine date and time from props
                let dateStr = "2000-01-01";
                let timeStr = "12:00:00";

                if (data && data.birth_details) {
                    dateStr = data.birth_details.date || dateStr;
                    timeStr = data.birth_details.time || timeStr;
                }

                // Create payload
                const payload = {
                    date: dateStr,
                    time: timeStr,
                    tz_offset: 5.5,
                    offsets: {}
                };

                // Adjust for localhost vs production if needed. Assuming proxy in vite setup.
                const response = await axios.post('/api/dasha/rashi', payload, {
                    baseURL: window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : ''
                });
                setDashaData(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching Rashi dashas:", err);
                setError("Failed to load Rashi Dashas.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashaData();
    }, [data]);

    const handleRowClick = (dataKey, idx) => {
        setSelectedRows(prev => ({
            ...prev,
            [dataKey]: idx
        }));
    };

    const handleDrillDown = (dataKey) => {
        // If no row is selected, default to the first row (index 0)
        const selectedIdx = selectedRows[dataKey] !== undefined && selectedRows[dataKey] !== null
            ? selectedRows[dataKey]
            : 0;

        // Find current level data
        const currentData = getCurrentLevelData(dataKey);
        if (!currentData || !currentData[selectedIdx]) return;

        const selectedLord = currentData[selectedIdx].d;

        setDrillPaths(prev => ({
            ...prev,
            [dataKey]: [...prev[dataKey], selectedLord]
        }));

        // Reset selected row for the new level
        setSelectedRows(prev => ({
            ...prev,
            [dataKey]: null
        }));
    };

    const handleReset = (dataKey) => {
        setDrillPaths(prev => ({
            ...prev,
            [dataKey]: []
        }));
        setSelectedRows(prev => ({
            ...prev,
            [dataKey]: null
        }));
    };

    const handleDrillUp = (dataKey) => {
        setDrillPaths(prev => {
            const currentPath = prev[dataKey];
            if (currentPath.length === 0) return prev;
            return {
                ...prev,
                [dataKey]: currentPath.slice(0, -1)
            };
        });

        // Reset selected row
        setSelectedRows(prev => ({
            ...prev,
            [dataKey]: null
        }));
    };
    // Helper to generate proportional sub-periods on the fly
    const generateSubPeriods = (parentItem, fullData) => {
        // Find total duration of all level-1 items to find proportions
        const level1Data = fullData.filter(item => !item.d.includes('-'));
        const totalDuration = level1Data.reduce((sum, item) => sum + item.duration, 0) || 120;

        let currentStart = parentItem.start;
        const parentDur = parentItem.duration;
        const subPeriods = [];

        // Start sub-periods from the same sign as parent (simplified)
        let startIdx = level1Data.findIndex(item => item.d === parentItem.d.split('-').pop());
        if (startIdx === -1) startIdx = 0;

        for (let i = 0; i < level1Data.length; i++) {
            const childBase = level1Data[(startIdx + i) % level1Data.length];
            const childDur = (childBase.duration / totalDuration) * parentDur;

            // Format date for sub-period
            let dateStr = parentItem.date;
            if (parentItem.date_iso) {
                const dt = new Date(parentItem.date_iso);
                // Add proportional days
                dt.setDate(dt.getDate() + (currentStart - parentItem.start) * 365.2425);
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const pad = (n) => n.toString().padStart(2, '0');
                dateStr = `${days[dt.getDay()]} \u00A0\u00A0 ${pad(dt.getDate())}-${pad(dt.getMonth() + 1)}-${dt.getFullYear()}`;
            }

            subPeriods.push({
                d: `${parentItem.d}-${childBase.d}`,
                start: currentStart,
                duration: childDur,
                date: dateStr,
                date_iso: parentItem.date_iso // Simplified
            });

            currentStart += childDur;
        }
        return subPeriods;
    };

    // Helper to filter or generate the current level data based on the drill path
    const getCurrentLevelData = (dataKey) => {
        const path = drillPaths[dataKey];
        const fullData = dashaData[dataKey] || [];

        const level1Data = fullData.filter(item => !item.d.includes('-'));

        if (!path || path.length === 0) {
            return level1Data;
        }

        // To find current level, we traverse down from level 1
        let currentLevel = level1Data;

        for (let i = 0; i < path.length; i++) {
            const targetLord = path[i]; // e.g. "Aries-Taurus"
            const parentItem = currentLevel.find(item => item.d === targetLord);
            if (!parentItem) return []; // Should not happen

            // Generate next level from parent
            currentLevel = generateSubPeriods(parentItem, fullData);
        }

        return currentLevel;
    };

    const renderDashaTable = (title, dataKey) => {
        const rowData = getCurrentLevelData(dataKey);
        const selectedIdx = selectedRows[dataKey];
        const canDrillUp = drillPaths[dataKey] && drillPaths[dataKey].length > 0;
        const canDrillDown = selectedIdx !== undefined && selectedIdx !== null;

        return (
            <div className="bg-[#ffffea] border border-[#005c99] rounded-sm shadow-sm flex flex-col font-serif overflow-hidden h-full">
                <div className="border-b border-[#005c99] px-2 py-0.5 text-[15px] text-[#00008b] font-medium bg-white rounded-t-[10px] mx-[2px] mt-[2px] border-[1px] flex justify-between items-center">
                    <span className="truncate" title={title}>{title}</span>
                    <div className="flex gap-1 text-[10px] opacity-70">
                        <button
                            onClick={() => handleDrillUp(dataKey)}
                            disabled={!canDrillUp}
                            className={`px-1 rounded ${canDrillUp ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
                            title="Go Up Level"
                        >◀</button>
                        <button
                            onClick={() => handleDrillDown(dataKey)}
                            className="px-1 hover:bg-gray-200 cursor-pointer rounded"
                            title="Drill Down (Defaults to 1st row if none selected)"
                        >▶</button>
                        <button
                            onClick={() => handleReset(dataKey)}
                            disabled={!canDrillUp}
                            className={`px-1 rounded ${canDrillUp ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
                            title="Reset to Top"
                        >⌂</button>
                    </div>
                </div>
                <div className="p-1 pl-3 overflow-y-auto flex-1 leading-tight text-[12px]">
                    {loading ? (
                        <div className="text-center text-gray-500 mt-4">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 mt-4">Error loading</div>
                    ) : rowData.length === 0 ? (
                        <div className="text-center text-gray-500 mt-4">No data</div>
                    ) : (
                        <table className="w-full text-left">
                            <tbody>
                                {rowData.map((row, idx) => {
                                    // Extract just the last part of the path for display
                                    const parts = row.d.split('-');
                                    const displayName = parts[parts.length - 1];
                                    const isSelected = selectedIdx === idx;

                                    return (
                                        <tr
                                            key={idx}
                                            onClick={() => handleRowClick(dataKey, idx)}
                                            onDoubleClick={() => {
                                                handleRowClick(dataKey, idx);
                                                // We use setTimeout to let the state update before drilling
                                                setTimeout(() => handleDrillDown(dataKey), 0);
                                            }}
                                            className={`cursor-pointer ${isSelected ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
                                        >
                                            <td className="pr-4 w-20 text-gray-800" title={row.d}>{displayName}</td>
                                            <td className="text-gray-800">{row.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const getHouses = () => {
        if (!data) return {};
        return data.charts?.houses || data.charts?.D1?.houses || {};
    };

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col font-serif overflow-y-auto">

            <KarmaDashboard />

            <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2 pb-2 min-h-[750px]">

                {/* Row 1, Col 1: Birth Chart */}
                <div className="bg-[#fdfbf7] border border-[#005c99] rounded-sm relative flex flex-col shadow-sm overflow-hidden h-full">
                    <div className="border-b border-[#005c99] px-2 py-0.5 text-[15px] text-[#00008b] font-medium bg-white rounded-t-[10px] mx-[2px] mt-[2px] border-[1px]">
                        Birth Chart
                    </div>
                    <div className="flex-1 relative bg-[#ffffea]">
                        <div className="absolute inset-0 p-1 flex items-center justify-center">
                            <ZodiacChart houses={getHouses()} variant="legacy" defaultRect={true} scaleText={1.6} />
                        </div>
                    </div>
                </div>

                {/* Row 1, Col 2 & 3 */}
                {renderDashaTable("Kalachakra(As)", "kalachakraData")}
                {renderDashaTable("Chara(As)", "charaData")}

                {/* Row 2 */}
                {renderDashaTable("Sthira(As)", "sthiraData")}
                {renderDashaTable("Niryaana Shoola(As)", "niryaanaShoolaData")}
                {renderDashaTable("Drig(As)", "drigData")}

                {/* Row 3 */}
                {renderDashaTable("Narayana(As)", "narayanaData")}
                {renderDashaTable("Lagna Kendradi Rashi(As)", "lagnaKendradiData")}
                {renderDashaTable("Sree Lagna Kendradi Rashi(As)", "sreeLagnaKendradiData")}

            </div>

            <div className="text-xs text-center text-gray-800 mt-2 bg-[#ffffea] p-1 rounded border border-gray-400">
                This worksheet shows the major Rashi based Dasha systems together. Click a row and press ▶ to view sub-periods. Press ◀ to return.
            </div>
        </div>
    );
}
