import React from "react";

// North Indian chart — SVG 0-100 coordinate space.
// House 1 = top-center diamond; houses go clockwise.
//
// Each house has three independent anchor points:
//   signAnchor  — where the red sign-number (zodiac index) is drawn (outer corner)
//   houseAnchor — where the small gray house-number is drawn (just inside, below sign)
//   planetAnchor — centre of the triangle body where planet abbreviations stack
//
// Keeping these three points separate prevents planets from spilling into
// neighbouring triangles.

// Standard North Indian (Parashari) chart goes COUNTER-CLOCKWISE:
// H1=top-center, H2=top-LEFT corner, H3=left-upper, H4=left-center,
// H5=left-lower, H6=bottom-left, H7=bottom-center, H8=bottom-right,
// H9=right-lower, H10=right-center, H11=right-upper, H12=top-right corner.
//
// Sign anchor: outermost point of each triangle (outer edge / corner).
// Mathematically derived from the chart's geometry (SVG 0-100 space,
// outer square 5-95, inner diamond at midpoints, diagonals corner-to-corner).

const HOUSE_SIGN_ANCHOR = {
  1: { x: 50, y: 7 },  // top midpoint
  2: { x: 10, y: 7 },  // top-left corner
  3: { x: 7, y: 28 },  // left edge upper half
  4: { x: 7, y: 50 },  // left midpoint
  5: { x: 7, y: 72 },  // left edge lower half
  6: { x: 10, y: 93 },  // bottom-left corner
  7: { x: 50, y: 93 },  // bottom midpoint
  8: { x: 90, y: 93 },  // bottom-right corner
  9: { x: 93, y: 72 },  // right edge lower half
  10: { x: 93, y: 50 },  // right midpoint
  11: { x: 93, y: 28 },  // right edge upper half
  12: { x: 90, y: 7 },  // top-right corner
};

// True geometric centers (centroids) for North Indian chart sections
// Calculated for the 25-25-25-25 diamond grid based on SVG 0-100 coords.
const HOUSE_CENTER = {
  1: { x: 50, y: 27.5 }, // top diamond
  2: { x: 27.5, y: 12.5 }, // top-left triangle
  3: { x: 12.5, y: 27.5 }, // left-upper triangle
  4: { x: 27.5, y: 50 }, // left diamond
  5: { x: 12.5, y: 72.5 }, // left-lower triangle
  6: { x: 27.5, y: 87.5 }, // bottom-left triangle
  7: { x: 50, y: 72.5 }, // bottom diamond
  8: { x: 72.5, y: 87.5 }, // bottom-right triangle
  9: { x: 87.5, y: 72.5 }, // right-lower triangle
  10: { x: 72.5, y: 50 }, // right diamond
  11: { x: 87.5, y: 27.5 }, // right-upper triangle
  12: { x: 72.5, y: 12.5 }, // top-right triangle
};

const PLANET_ABBREV = {
  "Sun": "सू.", "Moon": "च.", "Mars": "म.", "Mercury": "बु.",
  "Jupiter": "गु.", "Venus": "शु.", "Saturn": "श.",
  "Rahu": "रा.", "Ketu": "के.", "Ascendant": "ल."
};

const PLANET_COLORS = {
  "Sun": "#dc2626",  // Red
  "Moon": "#475569",  // Slate
  "Mars": "#b91c1c",  // Dark Red
  "Mercury": "#15803d",  // Green
  "Jupiter": "#b45309",  // Amber
  "Venus": "#be185d",  // Pink
  "Saturn": "#3730a3",  // Indigo
  "Rahu": "#0f766e",  // Teal
  "Ketu": "#92400e",  // Brown
  "Ascendant": "#000000"   // Black
};

const ZodiacChart = ({ houses, onPlanetClick, title, variant = "modern", planetEffects = {} }) => {
  const isLegacy = variant === "legacy";

  const entries = Array.from({ length: 12 }, (_, idx) => {
    const houseNum = idx + 1;
    const info = houses?.[houseNum] || houses?.[String(houseNum)] || {};
    const signIndex =
      info.sign_index !== undefined
        ? info.sign_index
        : info.cusp_deg !== undefined
          ? Math.floor(info.cusp_deg / 30)
          : null;
    const signDisplay = signIndex !== null ? signIndex + 1 : "";
    const planets = info.planets || [];
    return { houseNum, signDisplay, planets };
  });

  const getPlanetColor = (planet) => {
    const effect = planetEffects[planet];
    if (effect === "positive") return "#16a34a"; // Green
    if (effect === "negative") return "#dc2626"; // Red
    if (effect === "neutral") return "#2563eb";  // Blue
    return PLANET_COLORS[planet] || "#374151";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: isLegacy ? '#fdfbf7' : 'white' }}>
      {title && (
        <div style={{
          textAlign: 'center',
          padding: '2px 4px',
          borderBottom: '1px solid #94a3b8',
          background: isLegacy ? '#e2e8f0' : 'transparent',
          fontSize: '10px',
          fontWeight: 'bold',
          fontFamily: 'serif',
          color: '#1e293b',
          flexShrink: 0
        }}>
          {title}
        </div>
      )}
      <div style={{ flex: 1, padding: '2px', minHeight: 0, minWidth: 0 }}>
        <svg
          viewBox="0 0 100 100"
          style={{ display: 'block', width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill={isLegacy ? "#fdfbf7" : "white"} />

          {/* Outer square */}
          <rect
            x="5" y="5" width="90" height="90"
            fill="none"
            stroke="#000"
            strokeWidth={isLegacy ? "0.8" : "1.2"}
          />

          {/* Inner diamond connecting midpoints */}
          <polygon
            points="50,5 95,50 50,95 5,50"
            fill="none"
            stroke="#000"
            strokeWidth={isLegacy ? "0.6" : "1"}
          />

          {/* Centre cross lines */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="#f7f1f1ff" strokeWidth="0.5" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#faf2f2ff" strokeWidth="0.5" />

          {/* Diagonal corner lines (corners to opposite midpoints) */}
          <line x1="5" y1="5" x2="95" y2="95" stroke="#f04d4dff" strokeWidth="0.5" />
          <line x1="95" y1="5" x2="5" y2="95" stroke="#e25555ff" strokeWidth="0.5" />

          {/* House labels + planets */}
          {entries.map(({ houseNum, signDisplay, planets }) => {
            const signAnchor = HOUSE_SIGN_ANCHOR[houseNum];
            const center = HOUSE_CENTER[houseNum];
            if (!signAnchor || !center) return null;

            // Prepare the stack items: House index (gray) + Planets (colored)
            const displayedPlanets = planets.slice(0, 4);
            const lineH = 4.5;
            const totalItems = 1 + displayedPlanets.length;
            const startY = center.y - ((totalItems - 1) * lineH) / 2;

            return (
              <g key={houseNum}>
                {/* Sign number (Standard North Indian format) — centered vertically in the stack */}
                <text
                  x={center.x}
                  y={startY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5"
                  fill="#0a0808ff"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {signDisplay}
                </text>

                {/* 3. Planet abbreviations — stacked below the house number at centroid */}
                {displayedPlanets.map((p, idx) => {
                  const pName = typeof p === 'object' ? p.name : p;
                  const isRetro = typeof p === 'object' ? p.is_retrograde : false;
                  const isCombust = typeof p === 'object' ? p.is_combust : false;

                  let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);
                  if (isRetro) abbrev += '*';
                  if (isCombust) abbrev += '#';

                  const color = getPlanetColor(pName);
                  return (
                    <text
                      key={idx}
                      x={center.x}
                      y={startY + (idx + 1) * lineH}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="4.2"
                      fill={color}
                      fontWeight="bold"
                      fontFamily="Arial, sans-serif"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlanetClick?.(pName, houseNum);
                      }}
                    >
                      {abbrev}
                    </text>
                  );
                })}
              </g>
            );
          })}

          {/* Legend Hint */}
          <text
            x="50"
            y="98"
            textAnchor="middle"
            fontSize="3"
            fill="#64748b"
            fontWeight="500"
            fontFamily="Arial, sans-serif"
            fontStyle="italic"
          >
            * = Vakri (Retrograde), # = Asth (Combust)
          </text>
        </svg>
      </div>
    </div>
  );
};

export default ZodiacChart;
