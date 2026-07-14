// nakshatra_advanced/dashboard/DashaSyncPanel.jsx

import React from "react";

export default function DashaSyncPanel({ syncScore }) {
    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Dasha-Transit Nakshatra Sync</h3>
            <div className="flex items-center space-x-4 mt-2">
                <div className="text-3xl font-black text-emerald-600">{syncScore}%</div>
                <div className="text-sm text-slate-500">Alignment Score with Natal Chart</div>
            </div>
        </div>
    );
}
