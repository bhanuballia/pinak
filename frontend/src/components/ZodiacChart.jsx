import React, { useState } from "react";
import ZodiacRectSign from "./ZodiacRectSign";
// North Indian chart — SVG 0-100 coordinate space.
// House 1 = top-center diamond; houses go clockwise.

// True geometric centroids for standard single chart sections (5 to 95 coordinate bounds)
const HOUSE_CENTER = {
  1: { x: 50, y: 27.5 },  // top diamond
  2: { x: 27.5, y: 12.5 },// top-left triangle
  3: { x: 12.5, y: 27.5 },// left-upper triangle
  4: { x: 27.5, y: 50 },  // left diamond
  5: { x: 12.5, y: 72.5 },// left-lower triangle
  6: { x: 27.5, y: 87.5 },// bottom-left triangle
  7: { x: 50, y: 72.5 },  // bottom diamond
  8: { x: 72.5, y: 87.5 },// bottom-right triangle
  9: { x: 87.5, y: 72.5 },// right-lower triangle
  10: { x: 72.5, y: 50 }, // right diamond
  11: { x: 87.5, y: 27.5 },// right-upper triangle
  12: { x: 72.5, y: 12.5 },// top-right triangle
};

// True geometric centroids for inner natal chart sections (20 to 80 coordinate bounds)
const INNER_HOUSE_CENTER = {
  1: { x: 50, y: 35 },     // top diamond
  2: { x: 35, y: 25 },     // top-left triangle
  3: { x: 25, y: 35 },     // left-upper triangle
  4: { x: 35, y: 50 },     // left diamond
  5: { x: 25, y: 65 },     // left-lower triangle
  6: { x: 35, y: 75 },     // bottom-left triangle
  7: { x: 50, y: 65 },     // bottom diamond
  8: { x: 65, y: 75 },     // bottom-right triangle
  9: { x: 75, y: 65 },     // right-lower triangle
  10: { x: 65, y: 50 },    // right diamond
  11: { x: 75, y: 35 },    // right-upper triangle
  12: { x: 65, y: 25 },    // top-right triangle
};

// Polygons for standard single chart sections (5 to 95 coordinate bounds)
const HOUSE_POLYGON = {
  1: "50,5 72.5,27.5 50,50 27.5,27.5",
  2: "5,5 50,5 27.5,27.5",
  3: "5,5 5,50 27.5,27.5",
  4: "5,50 27.5,27.5 50,50 27.5,72.5",
  5: "5,50 5,95 27.5,72.5",
  6: "5,95 50,95 27.5,72.5",
  7: "50,95 72.5,72.5 50,50 27.5,72.5",
  8: "50,95 95,95 72.5,72.5",
  9: "95,50 95,95 72.5,72.5",
  10: "95,50 72.5,72.5 50,50 72.5,27.5",
  11: "95,5 95,50 72.5,27.5",
  12: "50,5 95,5 72.5,27.5"
};

// Polygons for inner natal chart sections (20 to 80 coordinate bounds)
const INNER_HOUSE_POLYGON = {
  1: "50,20 65,35 50,50 35,35",
  2: "20,20 50,20 35,35",
  3: "20,20 20,50 35,35",
  4: "20,50 35,35 50,50 35,65",
  5: "20,50 20,80 35,65",
  6: "20,80 50,80 35,65",
  7: "50,80 65,65 50,50 35,65",
  8: "50,80 80,80 65,65",
  9: "80,50 80,80 65,65",
  10: "80,50 65,65 50,50 65,35",
  11: "80,20 80,50 65,35",
  12: "50,20 80,20 65,35"
};

// Centers for the 12 outer boxes in the combined natal + transit double chart
const OUTER_BOX_CENTER = {
  1: { x: 50, y: 12.5 },   // House 1: Top-mid box (perfectly centered directly above House 1)
  2: { x: 24, y: 12.5 },   // House 2: Top-left box (directly above House 2)
  3: { x: 12.5, y: 25 },   // House 3: Left-mid-top box (perfectly horizontally next to House 3)
  4: { x: 12.5, y: 50 },   // House 4: Left-mid box (perfectly centered horizontally next to House 4)
  5: { x: 12.5, y: 75 },   // House 5: Left-mid-bottom box (perfectly horizontally next to House 5)
  6: { x: 25, y: 87.5 },   // House 6: Bottom-mid-left box (directly below House 6)
  7: { x: 50, y: 87.5 },   // House 7: Bottom-mid box (perfectly centered directly below House 7)
  8: { x: 75, y: 87.5 },   // House 8: Bottom-mid-right box (directly below House 8)
  9: { x: 87.5, y: 75 },   // House 9: Right-mid-bottom box (perfectly horizontally next to House 9)
  10: { x: 87.5, y: 50 },  // House 10: Right-mid box (perfectly centered horizontally next to House 10)
  11: { x: 87.5, y: 25 },  // House 11: Right-mid-top box (perfectly horizontally next to House 11)
  12: { x: 76, y: 12.5 }   // House 12: Top-mid-right box (directly above House 12)
};

const PLANET_ABBREV = {
  "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
  "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
  "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
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

const ZodiacChart = ({ houses, transitHouses = null, onPlanetClick, title, variant = "modern", planetEffects = {}, scaleText = 1, planetPositions = [], defaultRect = false, hideLegend = false, defaultLang = "en" }) => {
  const [lang, setLang] = useState(defaultLang);
  const [isRect, setIsRect] = useState(defaultRect);
  const [zoom, setZoom] = useState(1);
  const [useOriginalColors, setUseOriginalColors] = useState(false);

  const isLegacy = variant === "legacy";
  const isDoubleChart = transitHouses !== null;

  if (isRect) {
    return <ZodiacRectSign houses={houses} transitHouses={transitHouses} onPlanetClick={onPlanetClick} title={title} variant={variant} planetEffects={planetEffects} planetPositions={planetPositions} isRect={isRect} setIsRect={setIsRect} scaleText={scaleText} hideLegend={hideLegend} defaultLang={lang} />;
  }

  const getPlanetColor = (planet, isTransit = false) => {
    if (useOriginalColors) {
      return PLANET_COLORS[planet] || "#727e96ff";
    }
    if (isTransit) {
      const effect = planetEffects[planet];
      if (effect === "positive") return "#16a34a"; // Green
      if (effect === "negative") return "#dc2626"; // Red
      return "#4f46e5"; // Indigo for transits
    }
    const effect = planetEffects[planet];
    if (effect === "positive") return "#077e2fff"; // Green
    if (effect === "negative") return "rgba(199, 20, 20, 1)"; // Red
    if (effect === "neutral") return "rgba(216, 203, 15, 1)";  // Blue
    return PLANET_COLORS[planet] || "#727e96ff";
  };

  // 1-indexed helper for aspect targeting
  const getTarget = (fromHouse, offset) => {
    const val = (fromHouse + offset - 1) % 12;
    return val === 0 ? 12 : val;
  };

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

    let transitPlanets = [];
    let transitSignDisplay = "";
    if (isDoubleChart) {
      const tInfo = transitHouses?.[houseNum] || transitHouses?.[String(houseNum)] || {};
      transitPlanets = tInfo.planets || [];
      const tSignIndex =
        tInfo.sign_index !== undefined
          ? tInfo.sign_index
          : tInfo.cusp_deg !== undefined
            ? Math.floor(tInfo.cusp_deg / 30)
            : null;
      transitSignDisplay = tSignIndex !== null ? tSignIndex + 1 : "";
    }

    return { houseNum, signDisplay, planets, transitPlanets, transitSignDisplay };
  });

  // Calculate dynamic planetary Drishti (aspect) lines inside central natal chart
  const aspectLines = [];
  entries.forEach(({ houseNum, planets }) => {
    planets.forEach((p) => {
      const pName = typeof p === 'object' ? p.name : p;
      const origin = isDoubleChart ? INNER_HOUSE_CENTER[houseNum] : HOUSE_CENTER[houseNum];

      if (pName === "Mars") {
        [4, 7, 8].forEach((asp) => {
          const targetNum = getTarget(houseNum, asp);
          const dest = isDoubleChart ? INNER_HOUSE_CENTER[targetNum] : HOUSE_CENTER[targetNum];
          aspectLines.push({ key: `mars-${houseNum}-${targetNum}-${pName}`, x1: origin.x, y1: origin.y, x2: dest.x, y2: dest.y, color: "rgba(185, 28, 28, 0.25)", style: "2,2" });
        });
      } else if (pName === "Jupiter") {
        [5, 7, 9].forEach((asp) => {
          const targetNum = getTarget(houseNum, asp);
          const dest = isDoubleChart ? INNER_HOUSE_CENTER[targetNum] : HOUSE_CENTER[targetNum];
          aspectLines.push({ key: `jupiter-${houseNum}-${targetNum}-${pName}`, x1: origin.x, y1: origin.y, x2: dest.x, y2: dest.y, color: "rgba(217, 119, 6, 0.25)", style: "2,2" });
        });
      } else if (pName === "Saturn") {
        [3, 7, 10].forEach((asp) => {
          const targetNum = getTarget(houseNum, asp);
          const dest = isDoubleChart ? INNER_HOUSE_CENTER[targetNum] : HOUSE_CENTER[targetNum];
          aspectLines.push({ key: `saturn-${houseNum}-${targetNum}-${pName}`, x1: origin.x, y1: origin.y, x2: dest.x, y2: dest.y, color: "rgba(55, 48, 163, 0.25)", style: "2,2" });
        });
      } else if (pName !== "Ascendant") {
        // All other planets aspect the 7th house
        const targetNum = getTarget(houseNum, 7);
        const dest = isDoubleChart ? INNER_HOUSE_CENTER[targetNum] : HOUSE_CENTER[targetNum];
        aspectLines.push({ key: `std-${houseNum}-${targetNum}-${pName}`, x1: origin.x, y1: origin.y, x2: dest.x, y2: dest.y, color: "rgba(71, 85, 105, 0.12)", style: "1,2" });
      }
    });
  });

  // Adaptive Symmetrical & Radial Layout Engine to avoid planet text collisions
  const renderPlanetsWithLayout = (cx, cy, signDisplay, planets, isDouble) => {
    const displayedPlanets = planets.slice(0, 7); // Handle up to 7 items cleanly
    const totalItems = 1 + displayedPlanets.length;

    // Layout 1: Symmetrical vertical stack (up to 3 items)
    if (totalItems <= 3) {
      const lineH = isDouble ? 3.8 : 4.5;
      const startY = cy - ((totalItems - 1) * lineH) / 2;

      return (
        <>
          <text
            x={cx}
            y={startY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={(isDouble ? 2.5 : 5.5) * scaleText}
            fill="#000"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {signDisplay}
          </text>
          {displayedPlanets.map((p, idx) => {
            const pName = typeof p === 'object' ? p.name : p;
            const isRetro = typeof p === 'object' ? p.is_retrograde : false;
            const isCombust = typeof p === 'object' ? p.is_combust : false;

            let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);
            if (isRetro) abbrev += 'R';
            if (isCombust) abbrev += '#';
            const nakshatra = typeof p === 'object' ? p.nakshatra : null;
            if (nakshatra && !isDouble) {
              abbrev += ` (${nakshatra.substring(0, 3)})`;
            }

            return (
              <text
                key={idx}
                x={cx}
                y={startY + (idx + 1) * lineH}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={(isDouble ? 2.5 : 3.2) * scaleText}
                fill={getPlanetColor(pName)}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlanetClick?.(pName, idx);
                }}
              >
                {abbrev}
              </text>
            );
          })}
        </>
      );
    }

    // Layout 2: Symmetrical Diamond/Radial layout (4 to 5 items)
    if (totalItems <= 5) {
      const dx = isDouble ? 4.2 : 5.2;
      const dy = isDouble ? 3.8 : 4.8;

      const coords = [
        { x: cx, y: cy - dy },     // Sign (Top)
        { x: cx - dx, y: cy },     // Planet 1 (Left)
        { x: cx + dx, y: cy },     // Planet 2 (Right)
        { x: cx, y: cy + dy },     // Planet 3 (Bottom)
        { x: cx, y: cy }           // Planet 4 (Center)
      ];

      return (
        <>
          <text
            x={coords[0].x}
            y={coords[0].y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={(isDouble ? 2.5 : 5.5) * scaleText}
            fill="#000"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {signDisplay}
          </text>
          {displayedPlanets.map((p, idx) => {
            const pName = typeof p === 'object' ? p.name : p;
            const isRetro = typeof p === 'object' ? p.is_retrograde : false;
            const isCombust = typeof p === 'object' ? p.is_combust : false;

            let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);
            if (isRetro) abbrev += 'R';
            if (isCombust) abbrev += '#';
            const nakshatra = typeof p === 'object' ? p.nakshatra : null;
            if (nakshatra && !isDouble) {
              abbrev += ` (${nakshatra.substring(0, 3)})`;
            }

            const coord = coords[idx + 1] || { x: cx, y: cy };

            return (
              <text
                key={idx}
                x={coord.x}
                y={coord.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={(isDouble ? 2.5 : 4.2) * scaleText}
                fill={getPlanetColor(pName)}
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlanetClick?.(pName, idx);
                }}
              >
                {abbrev}
              </text>
            );
          })}
        </>
      );
    }

    // Layout 3: Compact Grid layout (6+ items)
    const dx = isDouble ? 4.2 : 5.2;
    const dy = isDouble ? 3.8 : 4.8;
    const coords = [
      { x: cx, y: cy - dy * 1.2 },     // Sign (Top)
      // Row 1
      { x: cx - dx, y: cy - dy * 0.2 },
      { x: cx, y: cy - dy * 0.2 },
      { x: cx + dx, y: cy - dy * 0.2 },
      // Row 2
      { x: cx - dx, y: cy + dy * 0.8 },
      { x: cx, y: cy + dy * 0.8 },
      { x: cx + dx, y: cy + dy * 0.8 }
    ];

    return (
      <>
        <text
          x={coords[0].x}
          y={coords[0].y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={(isDouble ? 2.4 : 5.0) * scaleText}
          fill="#000"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {signDisplay}
        </text>
        {displayedPlanets.map((p, idx) => {
          const pName = typeof p === 'object' ? p.name : p;
          const isRetro = typeof p === 'object' ? p.is_retrograde : false;
          const isCombust = typeof p === 'object' ? p.is_combust : false;

          let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);
          if (isRetro) abbrev += 'R';
          if (isCombust) abbrev += '#';
          const nakshatra = typeof p === 'object' ? p.nakshatra : null;
          if (nakshatra && !isDouble) {
            abbrev += ` (${nakshatra.substring(0, 3)})`;
          }

          const coord = coords[idx + 1] || { x: cx, y: cy };

          return (
            <text
              key={idx}
              x={coord.x}
              y={coord.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={(isDouble ? 2.5 : 3.6) * scaleText}
              fill={getPlanetColor(pName)}
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onPlanetClick?.(pName, idx);
              }}
            >
              {abbrev}
            </text>
          );
        })}
      </>
    );
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: isLegacy ? '#fdfbf7' : 'white',
      transform: `scale(${zoom})`,
      transformOrigin: 'center center',
      zIndex: zoom > 1 ? 50 : 1,
      position: zoom > 1 ? 'relative' : 'static',
      transition: 'transform 0.2s ease-in-out',
      boxShadow: zoom > 1 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'
    }}>
      {title && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 8px',
          borderBottom: '1px solid #8ec5e6',
          background: isLegacy ? '#e6f3f7' : 'transparent',
          flexShrink: 0
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#0a4d7a',
          }}>
            {title}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setLang(lang === 'en' ? 'hi' : 'en'); }}
              style={{
                background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              title="Toggle Language (English/Hindi)"
            >
              {lang === 'en' ? 'अ' : 'A'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsRect(!isRect); }}
              style={{
                background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              title="Toggle Shape (Square/Rectangular)"
            >
              ▭
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.25, 3)); }}
              style={{
                background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.25, 1)); }}
              style={{
                background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              title="Zoom Out (-)"
            >
              -
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setUseOriginalColors(c => !c); }}
              style={{
                background: useOriginalColors ? '#cbd5e1' : '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              title="Toggle Original Colors"
            >
              🎨
            </button>
          </div>
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', padding: '2px', flex: 1, minHeight: 0 }}>

        <svg
          viewBox="0 0 100 100"
          style={{ display: 'block', width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Pulse animation for active houses */}
          <defs>
            <style>{`
              @keyframes pulse-highlight {
                0% { fill-opacity: 0.03; }
                50% { fill-opacity: 0.07; }
                100% { fill-opacity: 0.03; }
              }
              .active-house-pulse {
                animation: pulse-highlight 3s infinite ease-in-out;
              }
            `}</style>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill={isLegacy ? "rgba(235, 210, 161, 1)" : "white"} />

          {/* Dynamic House Activation Highlighting */}
          {entries.map(({ houseNum, planets, transitPlanets }) => {
            const natalCount = planets.length;
            const transitCount = transitPlanets.length;
            const activationScore = natalCount * 1.0 + transitCount * 1.5;

            if (activationScore > 0) {
              const polyPoints = isDoubleChart ? INNER_HOUSE_POLYGON[houseNum] : HOUSE_POLYGON[houseNum];
              if (polyPoints) {
                // Gold color for ascendant/lagna, teal/green/orange depending on planetary weight
                const highlightColor = houseNum === 1 ? "hsla(34, 62%, 41%, 1.00)" : natalCount > 2 ? "#ea580c" : "#16b39bff";
                return (
                  <polygon
                    key={`highlight-${houseNum}`}
                    points={polyPoints}
                    fill={highlightColor}
                    fillOpacity="0.04"
                    className="active-house-pulse"
                  />
                );
              }
            }
            return null;
          })}

          {/* Outer square */}
          <rect
            x="5" y="5" width="90" height="90"
            fill="none"
            stroke="#000"
            strokeWidth={isLegacy ? "1.0" : "1.8"}
          />

          {isDoubleChart ? (
            <>
              {/* Inner square for Combined Birth + Transit chart */}
              <rect
                x="20" y="20" width="60" height="60"
                fill="none"
                stroke="#000"
                strokeWidth="1.2"
              />

              {/* Outer grid boundary lines for the 12 transit boxes */}
              {/* Perpendicular midlines */}
              {/* Top-edge dividers */}
              <line x1="40" y1="5" x2="40" y2="20" stroke="#000" strokeWidth="0.8" />
              <line x1="60" y1="5" x2="60" y2="20" stroke="#000" strokeWidth="0.8" />

              {/* Bottom-edge dividers */}
              <line x1="40" y1="80" x2="40" y2="95" stroke="#000" strokeWidth="0.8" />
              <line x1="60" y1="80" x2="60" y2="95" stroke="#000" strokeWidth="0.8" />

              {/* Left-edge dividers */}
              <line x1="5" y1="40" x2="20" y2="40" stroke="#000" strokeWidth="0.8" />
              <line x1="5" y1="60" x2="20" y2="60" stroke="#000" strokeWidth="0.8" />

              {/* Right-edge dividers */}
              <line x1="80" y1="40" x2="95" y2="40" stroke="#000" strokeWidth="0.8" />
              <line x1="80" y1="60" x2="95" y2="60" stroke="#000" strokeWidth="0.8" />



              {/* Corner diagonal lines */}
              <line x1="5" y1="5" x2="20" y2="20" stroke="#000" strokeWidth="0.8" />
              <line x1="80" y1="20" x2="95" y2="5" stroke="#000" strokeWidth="0.8" />
              <line x1="5" y1="95" x2="20" y2="80" stroke="#000" strokeWidth="0.8" />
              <line x1="80" y1="80" x2="95" y2="95" stroke="#000" strokeWidth="0.8" />

              {/* Inner Diamond (scaled) */}
              <polygon
                points="50,20 80,50 50,80 20,50"
                fill="none"
                stroke="#000"
                strokeWidth="1.0"
              />

              {/* Diagonals extending from outermost corners (5,5) to (95,95) for authentic style */}
              <line x1="5" y1="5" x2="95" y2="95" stroke="rgba(26, 3, 3, 1)" strokeWidth="0.8" />
              <line x1="95" y1="5" x2="5" y2="95" stroke="#0e0b0bff" strokeWidth="0.8" />
            </>
          ) : (
            <>
              {/* Standard single diamond connecting midpoints */}
              <polygon
                points="50,5 95,50 50,95 5,50"
                fill="none"
                stroke="#000"
                strokeWidth={isLegacy ? "1.0" : "1.6"}
              />
              {/* Center cross lines */}



              {/* Diagonal corner lines */}
              <line x1="5" y1="5" x2="95" y2="95" stroke="#000" strokeWidth="0.8" />
              <line x1="95" y1="5" x2="5" y2="95" stroke="#000" strokeWidth="0.8" />
            </>
          )}

          {/* Drishti (Aspect) Lines between inner house centroids */}

          {/* House labels + planets */}
          {entries.map(({ houseNum, signDisplay, planets, transitPlanets, transitSignDisplay }) => {
            const center = isDoubleChart ? INNER_HOUSE_CENTER[houseNum] : HOUSE_CENTER[houseNum];

            // Render inner natal planets using the Adaptive Layout Engine
            const natalGroup = (
              <g key={`natal-${houseNum}`}>
                {renderPlanetsWithLayout(center.x, center.y, signDisplay, planets, isDoubleChart)}
              </g>
            );

            // Render outer transit planets
            let transitGroup = null;
            if (isDoubleChart) {
              const outerCenter = OUTER_BOX_CENTER[houseNum];
              if (outerCenter) {
                const tPlanets = transitPlanets.slice(0, 4);
                const tLineH = 3.6;
                const tTotalItems = 1 + tPlanets.length;
                const tStartY = outerCenter.y - ((tTotalItems - 1) * tLineH) / 2;

                transitGroup = (
                  <g key={`transit-${houseNum}`}>
                    {/* Transit Sign display in outer box */}
                    <text
                      x={outerCenter.x}
                      y={tStartY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="3.2"
                      fill="#78350f" // Muted brownish red
                      fontWeight="bold"
                      fontFamily="Arial, sans-serif"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                      {transitSignDisplay}
                    </text>

                    {/* Transit planets stacked below the sign display */}
                    {tPlanets.map((p, idx) => {
                      const pName = typeof p === 'object' ? p.name : p;
                      const isRetro = typeof p === 'object' ? p.is_retrograde : false;
                      const isCombust = typeof p === 'object' ? p.is_combust : false;

                      let abbrev = PLANET_ABBREV[pName] || pName.substring(0, 2);
                      if (isRetro) abbrev += '*';
                      if (isCombust) abbrev += '#';
                      const nakshatra = typeof p === 'object' ? p.nakshatra : null;
                      if (nakshatra && !isDoubleChart) {
                        abbrev += ` (${nakshatra.substring(0, 3)})`;
                      }

                      const color = getPlanetColor(pName, true);

                      return (
                        <text
                          key={idx}
                          x={outerCenter.x}
                          y={tStartY + (idx + 1) * tLineH}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="3.0"
                          fill={color}
                          fontWeight="black"
                          fontFamily="Arial, sans-serif"
                        >
                          {abbrev}
                        </text>
                      );
                    })}
                  </g>
                );
              }
            }

            return (
              <React.Fragment key={houseNum}>
                {natalGroup}
                {transitGroup}
              </React.Fragment>
            );
          })}

          {/* Legend Hint */}
          {!hideLegend && (
            <text
              x="50"
              y="98"
              textAnchor="middle"
              fontSize="3"
              fill="#0e438dff"
              fontWeight="500"
              fontFamily="Arial, sans-serif"
              fontStyle="italic"
            >
              {isDoubleChart ? "Inner: Janma (Birth) · Outer: Gochar (Transit)" : "* = Vakri (Retrograde), # = Asth (Combust)"}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ZodiacChart;
