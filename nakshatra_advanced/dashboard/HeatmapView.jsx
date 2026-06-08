// nakshatra_advanced/dashboard/HeatmapView.jsx

import React from "react";

export default function HeatmapView({ matrix }) {
    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Transit Activation Heatmap</h3>
            <div className="text-sm text-slate-500">27x27 Heatmap Matrix View</div>
            <div className="mt-2 text-xs font-mono bg-slate-50 p-2 rounded">
                Matrix rows: {matrix ? matrix.length : 0}
            </div>
        </div>
    );
}
