import React, { useState, useEffect } from "react";
import axios from "axios";
import ZodiacChart from "./ZodiacChart";

const ChartWithBorders = ({ title, formattedDeg, houses, borderData, onCellClick }) => (
    <div className="bg-[#fdfbf7] border-2 border-[#00008b] rounded-sm relative flex flex-col shadow-sm overflow-hidden h-full w-full">
        <div className="border-b border-[#00008b] px-2 py-0.5 text-lg text-[#00008b] font-serif font-semibold bg-white rounded-t-sm flex justify-between items-center z-10 flex-shrink-0">
            <span>{title}</span>
            {formattedDeg && <span className="text-sm font-sans font-bold text-[#00008b]">{formattedDeg}</span>}
        </div>
        <div className="flex-1 relative bg-[#ffffea] p-1 flex flex-col min-h-0">
            <div className="relative flex-1 w-full h-full">
                {/* SVG Outer Border with 12 Cusp Degree Cells */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Outer Frame Lines */}
                    <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="rgba(126, 126, 241, 1)" strokeWidth="0.6" />
                    <rect x="4.5" y="4.5" width="91" height="91" fill="none" stroke="rgba(114, 114, 235, 1)" strokeWidth="0.6" />

                    {/* Cell Divider Lines */}
                    <line x1="27.5" y1="0.5" x2="27.5" y2="4.5" stroke="rgba(165, 165, 253, 1)" strokeWidth="0.2" />
                    <line x1="72.5" y1="0.5" x2="72.5" y2="4.5" stroke="rgba(159, 159, 253, 1)" strokeWidth="0.2" />
                    <line x1="27.5" y1="95.5" x2="27.5" y2="99.5" stroke="rgba(153, 153, 251, 1)" strokeWidth="0.2" />
                    <line x1="72.5" y1="95.5" x2="72.5" y2="99.5" stroke="rgba(155, 155, 254, 1)" strokeWidth="0.2" />

                    <line x1="0.5" y1="27.5" x2="4.5" y2="27.5" stroke="rgba(148, 148, 250, 1)" strokeWidth="0.2" />
                    <line x1="0.5" y1="72.5" x2="4.5" y2="72.5" stroke="rgba(146, 146, 251, 1)" strokeWidth="0.2" />
                    <line x1="95.5" y1="27.5" x2="99.5" y2="27.5" stroke="rgba(147, 147, 252, 1)" strokeWidth="0.2" />
                    <line x1="95.5" y1="72.5" x2="99.5" y2="72.5" stroke="rgba(141, 141, 241, 1)" strokeWidth="0.2" />

                    {/* Clickable Rectangles for the 12 Border Cells */}
                    {/* Top Row: H2 (tl), H1 (t), H12 (tr) */}
                    <rect x="0.5" y="0.5" width="27" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.tl)} />
                    <rect x="27.5" y="0.5" width="45" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.t)} />
                    <rect x="72.5" y="0.5" width="27" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.tr)} />

                    {/* Right Col: H11 (rt), H10 (r), H9 (rb) */}
                    <rect x="95.5" y="0.5" width="4" height="27" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.rt)} />
                    <rect x="95.5" y="27.5" width="4" height="45" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.r)} />
                    <rect x="95.5" y="72.5" width="4" height="27" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.rb)} />

                    {/* Bottom Row: H6 (bl), H7 (b), H8 (br) */}
                    <rect x="0.5" y="95.5" width="27" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.bl)} />
                    <rect x="27.5" y="95.5" width="45" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.b)} />
                    <rect x="72.5" y="95.5" width="27" height="4" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.br)} />

                    {/* Left Col: H3 (lt), H4 (l), H5 (lb) */}
                    <rect x="0.5" y="0.5" width="4" height="27" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.lt)} />
                    <rect x="0.5" y="27.5" width="4" height="45" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.l)} />
                    <rect x="0.5" y="72.5" width="4" height="27" fill="transparent" className="cursor-pointer hover:fill-blue-500/20" onClick={() => onCellClick && onCellClick(title, borderData.lb)} />

                    {/* 12 Cusp Degree Texts in Border Cells */}
                    {/* Top Row: H2 (tl), H1 (t), H12 (tr) */}
                    <text x="16.25" y="2.7" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.tl?.shortStr || ''}</text>
                    <text x="50" y="2.7" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.t?.shortStr || ''}</text>
                    <text x="83.75" y="2.7" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.tr?.shortStr || ''}</text>

                    {/* Right Col: H11 (rt), H10 (r), H9 (rb) */}
                    <text x="97.3" y="16.25" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(90, 97.3, 16.25)" className="pointer-events-none">{borderData.rt?.shortStr || ''}</text>
                    <text x="97.3" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(90, 97.3, 50)" className="pointer-events-none">{borderData.r?.shortStr || ''}</text>
                    <text x="97.3" y="83.75" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(90, 97.3, 83.75)" className="pointer-events-none">{borderData.rb?.shortStr || ''}</text>

                    {/* Bottom Row: H6 (bl), H7 (b), H8 (br) */}
                    <text x="16.25" y="97.3" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.bl?.shortStr || ''}</text>
                    <text x="50" y="97.3" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.b?.shortStr || ''}</text>
                    <text x="83.75" y="97.3" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" className="pointer-events-none">{borderData.br?.shortStr || ''}</text>

                    {/* Left Col: H3 (lt), H4 (l), H5 (lb) */}
                    <text x="2.7" y="16.25" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(-90, 2.7, 16.25)" className="pointer-events-none">{borderData.lt?.shortStr || ''}</text>
                    <text x="2.7" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(-90, 2.7, 50)" className="pointer-events-none">{borderData.l?.shortStr || ''}</text>
                    <text x="2.7" y="83.75" textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="#ec3629ff" fontWeight="medium" transform="rotate(-90, 2.7, 83.75)" className="pointer-events-none">{borderData.lb?.shortStr || ''}</text>
                </svg>

                {/* Inner Chart Area */}
                <div className="absolute inset-[4.5%] flex items-center justify-center pointer-events-auto">
                    <ZodiacChart houses={houses} variant="legacy" defaultRect={true} scaleText={1.6} hideOuterRect={true} />
                </div>
            </div>
        </div>
    </div>
);

export default function LagnasView({ data }) {
    const [specialLagnas, setSpecialLagnas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transitDateStr, setTransitDateStr] = useState(null);
    const [transitTimeStr, setTransitTimeStr] = useState(null);
    const [selectedCellModal, setSelectedCellModal] = useState(null);

    const handleTransitChange = (positions, dt) => {
        const pad = n => String(n).padStart(2, "0");
        const localDateStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
        const localTimeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
        setTransitDateStr(localDateStr);
        setTransitTimeStr(localTimeStr);
    };

    const handleCellClick = (chartTitle, cellObj) => {
        if (!cellObj) return;
        setSelectedCellModal({
            chartTitle,
            ...cellObj
        });
    };

    useEffect(() => {
        const fetchLagnas = async () => {
            if (!data) return;
            setLoading(true);
            try {
                // Safely extract birth details with fallbacks
                const details = data.birth_details || {};
                const baseDateStr = details.date || "2000-01-01";
                const baseTimeStr = details.time || "12:00:00";

                const payload = {
                    date: transitDateStr || baseDateStr,
                    time: transitTimeStr || baseTimeStr,
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
            } finally {
                setLoading(false);
            }
        };
        fetchLagnas();
    }, [data, transitDateStr, transitTimeStr]);

    const getHouses = () => {
        if (!data) return {};
        return data.charts?.houses || data.charts?.D1?.houses || {};
    };

    const generateBorders = (deg) => {
        const fullSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const shortSigns = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
        const signIdx = Math.floor(deg / 30) % 12;
        const rem = deg % 30;
        const d = Math.floor(rem).toString().padStart(2, '0');
        const m = Math.floor((rem - d) * 60).toString().padStart(2, '0');
        const s = Math.floor((((rem - d) * 60) - m) * 60).toString().padStart(2, '0');

        const getObj = (houseNum, offset) => {
            const currentSignIdx = (signIdx + offset) % 12;
            const shortStr = `${d}${shortSigns[currentSignIdx]}${m}`;
            const fullStr = `${d}° ${fullSigns[currentSignIdx]} ${m}' ${s}"`;
            return {
                house: houseNum,
                sign: fullSigns[currentSignIdx],
                shortSign: shortSigns[currentSignIdx],
                deg: d,
                min: m,
                sec: s,
                shortStr,
                fullStr
            };
        };

        // House mapping: t=1, tl=2, lt=3, l=4, lb=5, bl=6, b=7, br=8, rb=9, r=10, rt=11, tr=12
        return {
            t: getObj(1, 0),
            tl: getObj(2, 1),
            lt: getObj(3, 2),
            l: getObj(4, 3),
            lb: getObj(5, 4),
            bl: getObj(6, 5),
            b: getObj(7, 6),
            br: getObj(8, 7),
            rb: getObj(9, 8),
            r: getObj(10, 9),
            rt: getObj(11, 10),
            tr: getObj(12, 11)
        };
    };

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col font-serif overflow-y-auto gap-2 relative">
            {/* Row 1: Birth Chart & Bhava Lagna */}
            <div className="h-[300px] flex gap-2 w-full">
                <div className="flex-1 h-full bg-[#fdfbf7] border-2 border-[#00008b] rounded-sm relative flex flex-col shadow-sm overflow-hidden">
                    <div className="border-b border-[#00008b] px-2 py-0 text-xl text-[#00008b] font-medium bg-white rounded-t-sm">
                        Birth Chart
                    </div>
                    <div className="flex-1 relative bg-[#ffffea]">
                        <div className="absolute inset-0 p-1 flex items-center justify-center">
                            <ZodiacChart houses={getHouses()} variant="legacy" defaultRect={true} scaleText={1.6} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 h-full">
                    {loading && !specialLagnas ? (
                        <div className="p-4 text-center">Loading Lagnas...</div>
                    ) : (
                        <ChartWithBorders
                            title="Bhava Lagna"
                            formattedDeg={specialLagnas ? specialLagnas.bhava.formatted : ''}
                            houses={specialLagnas ? specialLagnas.bhava.chart.houses : getHouses()}
                            borderData={specialLagnas ? generateBorders(specialLagnas.bhava.deg) : {}}
                            onCellClick={handleCellClick}
                        />
                    )}
                </div>
            </div>

            {/* Row 2: Hora Lagna & Ghatika Lagna */}
            <div className="h-[300px] flex gap-2 w-full">
                <div className="flex-1 h-full">
                    {!loading && specialLagnas ? (
                        <ChartWithBorders
                            title="Hora Lagna"
                            formattedDeg={specialLagnas ? specialLagnas.hora.formatted : ''}
                            houses={specialLagnas ? specialLagnas.hora.chart.houses : getHouses()}
                            borderData={specialLagnas ? generateBorders(specialLagnas.hora.deg) : {}}
                            onCellClick={handleCellClick}
                        />
                    ) : (
                        <div className="p-4 text-center">Loading Hora Lagna...</div>
                    )}
                </div>
                <div className="flex-1 h-full">
                    {!loading && specialLagnas ? (
                        <ChartWithBorders
                            title="Ghatika Lagna"
                            formattedDeg={specialLagnas ? specialLagnas.ghatika.formatted : ''}
                            houses={specialLagnas ? specialLagnas.ghatika.chart.houses : getHouses()}
                            borderData={specialLagnas ? generateBorders(specialLagnas.ghatika.deg) : {}}
                            onCellClick={handleCellClick}
                        />
                    ) : (
                        <div className="p-4 text-center">Loading Ghatika Lagna...</div>
                    )}
                </div>
            </div>

            {/* House Cusp Details Modal Pop-Up */}
            {selectedCellModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#fdfbf7] border-2 border-[#00008b] rounded-lg p-6 max-w-md w-full shadow-2xl relative font-serif">
                        <button
                            onClick={() => setSelectedCellModal(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold text-xl px-2 py-0.5 rounded"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold text-[#00008b] border-b border-[#00008b] pb-2 mb-4">
                            {selectedCellModal.chartTitle} - House {selectedCellModal.house} Cusp
                        </h3>
                        <div className="space-y-3 text-base text-gray-800">
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">House Number:</span>
                                <span className="font-bold text-[#00008b]">{selectedCellModal.house}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Zodiac Sign:</span>
                                <span className="font-bold text-[#00008b]">{selectedCellModal.sign} ({selectedCellModal.shortSign})</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Degrees:</span>
                                <span className="font-bold text-gray-900">{selectedCellModal.deg}°</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Minutes:</span>
                                <span className="font-bold text-gray-900">{selectedCellModal.min}'</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Seconds:</span>
                                <span className="font-bold text-gray-900">{selectedCellModal.sec}"</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="font-semibold text-gray-600">Full Cusp Longitude:</span>
                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{selectedCellModal.fullStr}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedCellModal(null)}
                                className="bg-[#00008b] text-white px-5 py-1.5 rounded hover:bg-blue-900 font-sans font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
