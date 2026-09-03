import React, { useEffect, useState } from 'react';
import TransitTimeControl from './worksheet/TransitTimeControl';
import { fetchReportData } from '../services/api';

export default function GlobalTransitTimeControl() {
    const [isOpen, setIsOpen] = useState(false);
    const [lat, setLat] = useState(28.6139);
    const [lon, setLon] = useState(77.2090);
    const [worksheetData, setLocalData] = useState(null);

    useEffect(() => {
        const handleOpen = () => {
            const dataStr = localStorage.getItem('worksheetData');
            if (dataStr) {
                try {
                    const data = JSON.parse(dataStr);
                    setLocalData(data);
                    if (data?.basic_details) {
                        setLat(data.basic_details.lat || 28.6139);
                        setLon(data.basic_details.lon || 77.2090);
                    }
                } catch(e) {}
            }
            setIsOpen(true);
        };
        window.addEventListener('open-time-machine', handleOpen);
        return () => window.removeEventListener('open-time-machine', handleOpen);
    }, []);

    if (!isOpen) return null;

    const handleTransitChange = async (positions, newDateObj) => {
        if (!worksheetData || !worksheetData.basic_details) return;
        
        try {
            const dateStr = newDateObj.toISOString().split("T")[0];
            const timeStr = newDateObj.toTimeString().split(" ")[0];
            const bd = worksheetData.basic_details;

            const payload = {
                name: bd.name || "Time Traveler",
                date: dateStr,
                time: timeStr,
                tz_offset: bd.tz_offset || 5.5,
                lat: bd.lat || 28.6139,
                lon: bd.lon || 77.2090,
                style: "minimal",
                language: "english",
                gender: bd.gender || "Male",
                location_name: bd.location_name || "Birth Place"
            };

            const newReportData = await fetchReportData(payload);
            window.dispatchEvent(new CustomEvent('update-worksheet-data', { detail: newReportData }));
        } catch (e) {
            console.error("Failed to fetch new report data for time machine:", e);
        }
    };

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] max-w-lg">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-indigo-500 overflow-hidden relative">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 z-[10000] bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                >
                    ✕
                </button>
                <div className="p-1 pt-6 bg-[#fdfbf7]">
                    <TransitTimeControl 
                        lat={lat} 
                        lon={lon} 
                        onTransitChange={handleTransitChange} 
                    />
                </div>
            </div>
        </div>
    );
}
