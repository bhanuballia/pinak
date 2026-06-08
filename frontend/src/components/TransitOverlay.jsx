// frontend/src/components/TransitOverlay.jsx

import React from "react";

export default function TransitOverlay({
  overlays
}) {
  return (
    <svg
      width="100%"
      height="400"
      viewBox="0 0 800 800"
    >
      <rect width="800" height="800" fill="#f8fafc" rx="20" />
      <text x="400" y="40" textAnchor="middle" fill="#475569" fontWeight="bold">Transit Overlay Visualizer</text>
      {overlays.map((o, idx) => (
        <g key={idx}>
            <circle
            cx={o.x}
            cy={o.y}
            r="20"
            fill="rgba(239, 68, 68, 0.6)"
            />
            <text x={o.x} y={o.y} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="10">{o.planet}</text>
        </g>
      ))}
    </svg>
  );
}
