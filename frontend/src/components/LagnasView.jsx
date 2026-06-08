import React, { useState, useEffect } from "react";
import axios from "axios";
import ZodiacChart from "./ZodiacChart";

const ChartWithBorders = ({ title, houses, borderData }) => (
    <div className="bg-[#fdfbf7] border-2 border-[#00008b] rounded-sm relative flex flex-col shadow-sm overflow-hidden h-full w-full">
        <div className="border-b border-[#00008b] px-2 py-0 text-xl text-[#00008b] font-medium bg-white rounded-t-sm flex items-center">
            {title}
        </div>
        <div className="flex-1 relative bg-[#ffffea] p-4">
            <div className="absolute inset-0 top-6 left-6 right-6 bottom-6 border border-[#00008b] flex items-center justify-center bg-[#ffffea]">
                <ZodiacChart houses={houses} variant="legacy" defaultRect={true} scaleText={1.6} />
            </div>

            {/* Top Border Texts */}
            <div className="absolute top-1 left-[20%] text-[10px] text-[#00008b] -rotate-90 origin-left font-bold">{borderData.tl}</div>
            <div className="absolute top-1 left-[50%] -translate-x-1/2 text-[10px] text-[#00008b] font-bold">{borderData.t}</div>
            <div className="absolute top-1 right-[20%] text-[10px] text-[#00008b] rotate-90 origin-right font-bold">{borderData.tr}</div>

            {/* Bottom Border Texts */}
            <div className="absolute bottom-1 left-[20%] text-[10px] text-[#00008b] -rotate-90 origin-left font-bold">{borderData.bl}</div>
            <div className="absolute bottom-1 left-[50%] -translate-x-1/2 text-[10px] text-[#00008b] font-bold">{borderData.b}</div>
            <div className="absolute bottom-1 right-[20%] text-[10px] text-[#00008b] rotate-90 origin-right font-bold">{borderData.br}</div>

            {/* Left Border Texts */}
            <div className="absolute left-1 top-[25%] -translate-y-1/2 text-[10px] text-[#00008b] -rotate-90 font-bold">{borderData.lt}</div>
            <div className="absolute left-1 top-[50%] -translate-y-1/2 text-[10px] text-[#00008b] -rotate-90 font-bold">{borderData.l}</div>
            <div className="absolute left-1 top-[75%] -translate-y-1/2 text-[10px] text-[#00008b] -rotate-90 font-bold">{borderData.lb}</div>

            {/* Right Border Texts */}
            <div className="absolute right-1 top-[25%] -translate-y-1/2 text-[10px] text-[#00008b] rotate-90 font-bold">{borderData.rt}</div>
            <div className="absolute right-1 top-[50%] -translate-y-1/2 text-[10px] text-[#00008b] rotate-90 font-bold">{borderData.r}</div>
            <div className="absolute right-1 top-[75%] -translate-y-1/2 text-[10px] text-[#00008b] rotate-90 font-bold">{borderData.rb}</div>
        </div>
    </div>
);

export default function LagnasView({ data }) {
    const [specialLagnas, setSpecialLagnas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLagnas = async () => {
            if (!data) return;
            setLoading(true);
            try {
                // Safely extract birth details with fallbacks
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
            } finally {
                setLoading(false);
            }
        };
        fetchLagnas();
    }, [data]);

    const getHouses = () => {
        if (!data) return {};
        return data.charts?.houses || data.charts?.D1?.houses || {};
    };

    const generateBorders = (deg) => {
        const signs = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
        const signIdx = Math.floor(deg / 30) % 12;
        const rem = deg % 30;
        const d = Math.floor(rem).toString().padStart(2, '0');
        const m = Math.floor((rem - d) * 60).toString().padStart(2, '0');
        
        const getStr = (offset) => `${d}${signs[(signIdx + offset) % 12]}${m}`;
        
        // Follow North Indian houses counter-clockwise starting from t (House 1)
        return {
            t: getStr(0),
            tl: getStr(1),
            lt: getStr(2),
            l: getStr(3),
            lb: getStr(4),
            bl: getStr(5),
            b: getStr(6),
            br: getStr(7),
            rb: getStr(8),
            r: getStr(9),
            rt: getStr(10),
            tr: getStr(11)
        };
    };

    if (loading) {
        return <div className="p-4 text-center">Loading Lagnas...</div>;
    }

    const bhavaBorders = specialLagnas ? generateBorders(specialLagnas.bhava.deg) : {};
    const horaBorders = specialLagnas ? generateBorders(specialLagnas.hora.deg) : {};
    const ghatikaBorders = specialLagnas ? generateBorders(specialLagnas.ghatika.deg) : {};

    return (
        <div className="min-h-screen w-full bg-[#fff0d6] p-2 flex flex-col font-serif overflow-y-auto gap-2">
            {/* Top Row */}
            <div className="h-[400px] flex gap-2">
                <div className="w-3/4 bg-[#fdfbf7] border-2 border-[#00008b] rounded-sm relative flex flex-col shadow-sm overflow-hidden h-full">
                    <div className="border-b border-[#00008b] px-2 py-0 text-xl text-[#00008b] font-medium bg-white rounded-t-sm">
                        Birth Chart
                    </div>
                    <div className="flex-1 relative bg-[#ffffea]">
                        <div className="absolute inset-0 p-1 flex items-center justify-center">
                            <ZodiacChart houses={getHouses()} variant="legacy" defaultRect={true} scaleText={1.6} />
                        </div>
                    </div>
                </div>
                <div className="w-2/3"></div>
            </div>

            {/* Bottom Row */}
            <div className="h-[400px] flex gap-2">
                <div className="flex-1">
                    <ChartWithBorders 
                        title={`Bhava Lagna ${specialLagnas ? specialLagnas.bhava.formatted : ''}`} 
                        houses={specialLagnas ? specialLagnas.bhava.chart.houses : getHouses()} 
                        borderData={bhavaBorders} 
                    />
                </div>
                <div className="flex-1">
                    <ChartWithBorders 
                        title={`Hora Lagna ${specialLagnas ? specialLagnas.hora.formatted : ''}`} 
                        houses={specialLagnas ? specialLagnas.hora.chart.houses : getHouses()} 
                        borderData={horaBorders} 
                    />
                </div>
                <div className="flex-1">
                    <ChartWithBorders 
                        title={`Ghatika Lagna ${specialLagnas ? specialLagnas.ghatika.formatted : ''}`} 
                        houses={specialLagnas ? specialLagnas.ghatika.chart.houses : getHouses()} 
                        borderData={ghatikaBorders} 
                    />
                </div>
            </div>
        </div>
    );
}
