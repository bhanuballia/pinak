// frontend/src/components/TransitOverlay.jsx

import React from "react";

export default function TransitOverlay({ overlays }) {
  // Exact North Indian chart 12-house center coordinates (800x800 SVG canvas)
  const defaultPlacements = [
    { planet: "Jupiter", house: "1", sign: "Aries", x: 400, y: 220 },       // 1st House (Top Diamond)
    { planet: "Mars", house: "2", sign: "Taurus", x: 230, y: 140 },          // 2nd House (Top-Left Triangle)
    { planet: "Venus", house: "3", sign: "Gemini", x: 140, y: 230 },         // 3rd House (Left-Top Triangle)
    { planet: "Sun", house: "4", sign: "Cancer", x: 220, y: 400 },           // 4th House (Left Diamond)
    { planet: "Mercury", house: "5", sign: "Leo", x: 140, y: 570 },          // 5th House (Left-Bottom Triangle)
    { planet: "Moon", house: "6", sign: "Virgo", x: 230, y: 660 },           // 6th House (Bottom-Left Triangle)
    { planet: "Rahu", house: "7", sign: "Libra", x: 400, y: 580 },           // 7th House (Bottom Diamond)
    { planet: "Ketu", house: "8", sign: "Scorpio", x: 570, y: 660 },         // 8th House (Bottom-Right Triangle)
    { planet: "Saturn", house: "9", sign: "Sagittarius", x: 660, y: 570 },    // 9th House (Right-Bottom Triangle)
    { planet: "Jupiter", house: "10", sign: "Capricorn", x: 580, y: 400 },   // 10th House (Right Diamond)
    { planet: "Sun", house: "11", sign: "Aquarius", x: 660, y: 230 },        // 11th House (Right-Top Triangle)
    { planet: "Mars", house: "12", sign: "Pisces", x: 570, y: 140 }          // 12th House (Top-Right Triangle)
  ];

  const items = overlays && overlays.length > 0 ? overlays : defaultPlacements;

  const houseNumbers = [
    { num: 1, x: 400, y: 120 },
    { num: 2, x: 280, y: 80 },
    { num: 3, x: 80, y: 280 },
    { num: 4, x: 120, y: 400 },
    { num: 5, x: 80, y: 520 },
    { num: 6, x: 280, y: 720 },
    { num: 7, x: 400, y: 680 },
    { num: 8, x: 520, y: 720 },
    { num: 9, x: 720, y: 520 },
    { num: 10, x: 680, y: 400 },
    { num: 11, x: 720, y: 280 },
    { num: 12, x: 520, y: 80 }
  ];

  return (
    <svg width="100%" height="450" viewBox="0 0 800 800" className="w-full h-auto border border-slate-200 rounded-xl bg-[#fdfbf7]">
      {/* Outer Rectangle Box */}
      <rect x="50" y="50" width="700" height="700" fill="none" stroke="#1e3a8a" strokeWidth="4" />

      {/* Main Diagonals */}
      <line x1="50" y1="50" x2="750" y2="750" stroke="#1e3a8a" strokeWidth="2.5" />
      <line x1="750" y1="50" x2="50" y2="750" stroke="#1e3a8a" strokeWidth="2.5" />

      {/* Inner Diamond */}
      <polygon points="400,50 750,400 400,750 50,400" fill="none" stroke="#1e3a8a" strokeWidth="2.5" />

      {/* House Numbers */}
      {houseNumbers.map(h => (
        <text key={h.num} x={h.x} y={h.y} textAnchor="middle" alignmentBaseline="middle" fill="#1e3a8a" fontWeight="bold" fontSize="18">
          {h.num}
        </text>
      ))}

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fill="#1e3a8a" fontWeight="bold" fontSize="22">
        D108 Transit Overlay & Astottaramsa Chart
      </text>

      {/* Render Planets */}
      {items.map((o, idx) => (
        <g key={idx}>
          <circle cx={o.x} cy={o.y} r="26" fill="rgba(242, 244, 247, 1)" stroke="#fbbf24" strokeWidth="2" />
          <text x={o.x} y={o.y - 2} textAnchor="middle" alignmentBaseline="middle" fill="rgba(7, 1, 1, 1)" fontWeight="bold" fontSize="13">
            {o.planet ? o.planet.substring(0, 3) : "Pl"}
          </text>
          <text x={o.x} y={o.y + 13} textAnchor="middle" alignmentBaseline="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
            {o.sign ? o.sign.substring(0, 3) : ""}
          </text>
        </g>
      ))}
    </svg>
  );
}
