import React, { createContext, useContext, useState } from 'react';
import { fetchReportData } from '../services/api';

const GlobalTimeContext = createContext();

export const useGlobalTime = () => useContext(GlobalTimeContext);

export const GlobalTimeProvider = ({ children, worksheetData, setWorksheetData }) => {
    const [isTransitControlOpen, setIsTransitControlOpen] = useState(false);
    const [isLoadingGlobalTime, setIsLoadingGlobalTime] = useState(false);

    const updateGlobalTime = async (newDateObj) => {
        if (!worksheetData || !worksheetData.basic_details) return;
        
        setIsLoadingGlobalTime(true);
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
            // Append original transit flag or other metadata if necessary
            setWorksheetData({ ...newReportData, isTimeMachine: true });
            // Do NOT overwrite localStorage with time machine data so refresh restores original birth chart
        } catch (e) {
            console.error("Failed to fetch new report data for time machine:", e);
        } finally {
            setIsLoadingGlobalTime(false);
        }
    };

    return (
        <GlobalTimeContext.Provider value={{
            isTransitControlOpen,
            setIsTransitControlOpen,
            updateGlobalTime,
            isLoadingGlobalTime,
            worksheetData
        }}>
            {children}
        </GlobalTimeContext.Provider>
    );
};
