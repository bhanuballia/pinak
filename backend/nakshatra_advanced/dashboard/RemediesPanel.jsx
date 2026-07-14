// nakshatra_advanced/dashboard/RemediesPanel.jsx

import React from "react";

export default function RemediesPanel({ weakPlanet, gemstone }) {
    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Recommended Remedies</h3>
            <div className="mt-2 text-sm">
                <div>Weak Planet: <span className="font-semibold text-rose-500">{weakPlanet}</span></div>
                <div>Suggested Gemstone: <span className="font-semibold text-emerald-600">{gemstone}</span></div>
            </div>
        </div>
    );
}
