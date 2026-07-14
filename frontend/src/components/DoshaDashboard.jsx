import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function DoshaDashboard() {
    const [doshaData, setDoshaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoshaData = async () => {
            setLoading(true);
            try {
                const localData = JSON.parse(localStorage.getItem('worksheetData'));
                if (!localData || !localData.planet_positions) {
                    throw new Error("No natal chart data found. Please generate a chart first.");
                }

                const moonPos = localData.planet_positions.find(p => p.planet === "Moon");
                if (!moonPos) {
                    throw new Error("Moon position not found in chart data.");
                }

                const moon_degree = moonPos.degree;
                const moon_sign = Math.floor(moon_degree / 30) + 1;
                
                // Calculate Nakshatra and Pada directly from Moon degree for accuracy
                const NAKSHATRAS = [
                    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
                    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
                    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
                    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
                    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
                ];
                
                const total_minutes = moon_degree * 60;
                const nak_index = Math.floor(total_minutes / 800); // 800 minutes = 13deg 20min
                const nakshatra = NAKSHATRAS[nak_index];
                const minutes_in_nak = total_minutes % 800;
                const pada = Math.floor(minutes_in_nak / 200) + 1; // 200 minutes = 3deg 20min

                // Get Karana from Panchang data if available
                let karana = "Unknown";
                if (localData.panchang && localData.panchang.karana && localData.panchang.karana.karana_name) {
                    karana = localData.panchang.karana.karana_name;
                }

                const response = await axios.post("http://localhost:8000/api/panchang-doshas", {
                    moon_sign: moon_sign,
                    karana: karana,
                    nakshatra: nakshatra,
                    pada: pada
                });

                setDoshaData(response.data);
            } catch (err) {
                console.error("Error fetching Dosha data:", err);
                setError(err.response?.data?.detail || err.message || "Failed to load Advanced Dosha data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoshaData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white flex-col gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                <p className="text-xl font-bold animate-pulse">Analyzing Panchang Doshas & Exceptions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="bg-red-900/50 p-8 rounded-xl border border-red-500 max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-red-200 mb-4">Dosha Analysis Error</h2>
                    <p className="text-red-100">{error}</p>
                </div>
            </div>
        );
    }

    const renderDoshaCard = (title, data, icon) => {
        let bgColor = "bg-slate-800 border-slate-700";
        let titleColor = "text-slate-300";
        let statusBadge = "";
        
        if (data.status === "Clear") {
            bgColor = "bg-emerald-950/30 border-emerald-900";
            titleColor = "text-emerald-400";
            statusBadge = <span className="px-3 py-1 bg-emerald-900/50 text-emerald-400 rounded-full text-xs font-bold border border-emerald-800">CLEAR</span>;
        } else if (data.status === "Cancelled") {
            bgColor = "bg-blue-950/30 border-blue-900";
            titleColor = "text-blue-400";
            statusBadge = <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-xs font-bold border border-blue-800">BHANGA (CANCELLED)</span>;
        } else if (data.status === "Active") {
            bgColor = "bg-red-950/30 border-red-900";
            titleColor = "text-red-400";
            statusBadge = <span className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-xs font-bold border border-red-800">ACTIVE DOSHA</span>;
        }

        return (
            <div className={`p-6 rounded-2xl border shadow-xl ${bgColor} flex flex-col`}>
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                    <h2 className={`text-2xl font-bold flex items-center gap-3 ${titleColor}`}>
                        <span className="text-3xl">{icon}</span> {title}
                    </h2>
                    {statusBadge}
                </div>
                
                <div className="flex-1">
                    <p className="text-slate-300 leading-relaxed mb-4">{data.description}</p>
                    
                    {data.bhanga_reason && (
                        <div className={`p-4 rounded-xl border mt-auto ${data.status === 'Cancelled' ? 'bg-blue-900/20 border-blue-800 text-blue-200' : 'bg-red-900/20 border-red-800 text-red-200'}`}>
                            <p className="font-bold mb-1 uppercase tracking-wider text-xs opacity-75">
                                {data.status === 'Cancelled' ? 'Exception (Bhanga) Triggered' : 'Severity Note'}
                            </p>
                            <p>{data.bhanga_reason}</p>
                        </div>
                    )}

                    {data.remedies && data.remedies.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl border bg-slate-900/50 border-slate-700">
                            <p className="font-bold mb-2 uppercase tracking-wider text-xs text-slate-400">Recommendations</p>
                            <ul className="space-y-2">
                                {data.remedies.map((rem, idx) => (
                                    <li key={idx} className="text-sm text-slate-300">{rem}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
            <header className="mb-8 border-b border-purple-900 pb-4">
                <h1 className="text-4xl font-black text-purple-400 flex items-center gap-3">
                    🧿 Advanced Doshas & Exceptions
                </h1>
                <p className="text-slate-400 mt-2 text-lg">
                    Deep Panchang analysis tracking Panchaka, Bhadra, Gandamoola, and their specific astrological cancellations (Bhanga).
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {renderDoshaCard("Panchaka", doshaData.panchaka, "⭐")}
                {renderDoshaCard("Bhadra (Vishti)", doshaData.bhadra, "🦂")}
                {renderDoshaCard("Gandamoola", doshaData.gandamoola, "🌀")}
            </div>
        </div>
    );
}
