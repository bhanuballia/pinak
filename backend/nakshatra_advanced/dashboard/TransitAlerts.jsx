// nakshatra_advanced/dashboard/TransitAlerts.jsx

import React from "react";

export default function TransitAlerts({ alerts }) {
    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Transit Alerts</h3>
            <div className="space-y-2 mt-2">
                {alerts && alerts.map((al, idx) => (
                    <div key={idx} className={`p-2 rounded text-sm ${al.severity === "HIGH" ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'}`}>
                        <div className="font-bold">{al.severity} Severity</div>
                        <div>{al.alert}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
