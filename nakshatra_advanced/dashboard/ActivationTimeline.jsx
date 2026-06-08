// nakshatra_advanced/dashboard/ActivationTimeline.jsx

import React from "react";

export default function ActivationTimeline({ events }) {
    return (
        <div className="p-4 border rounded shadow bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Activation Timeline</h3>
            <div className="space-y-2 mt-2">
                {events && events.map((ev, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b">
                        <span>{ev.name}</span>
                        <span className="font-semibold text-indigo-600">{ev.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
