import React from 'react';

const KPChart = ({ cusps, planets }) => {
  if (!cusps || !planets) return null;

  const getPlanetColor = (planet) => {
    const colors = {
      "Sun": "#cc0000",
      "Moon": "#333333",
      "Mars": "#ff0000",
      "Mercury": "#009900",
      "Jupiter": "#ff8c00",
      "Venus": "#cc00cc",
      "Saturn": "#0000ff",
      "Rahu": "#666666",
      "Ketu": "#666666",
      "Ascendant": "#b8860b"
    };
    return colors[planet] || "#333";
  };

  const SIGN_NAMES = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

  // SVG dimensions
  const SVG_SIZE = 400;
  const CENTER = SVG_SIZE / 2;
  const OUTER_RADIUS = 150;
  const INNER_RADIUS = 50;
  const SIGN_RADIUS = OUTER_RADIUS + 15;

  // We rotate everything so Ascendant (Cusp 1) is exactly at the left side (180 degrees)
  const ascLon = cusps[0].longitude;

  // Maps a zodiac longitude (0-360) to SVG angle (where Asc is at 180, and increasing zodiac goes counter-clockwise)
  const getAngle = (lon) => {
    // Difference from Ascendant
    let diff = lon - ascLon;
    if (diff < 0) diff += 360;

    // Asc is at 180 SVG degrees. Increasing longitude goes counter-clockwise (which means SUBTRACTING from SVG angle)
    // SVG standard: 0 is right, 90 is bottom, 180 is left, 270 is top
    let svgAngle = 180 - diff;
    if (svgAngle < 0) svgAngle += 360;

    return svgAngle;
  };

  // Convert polar to cartesian
  const getPoint = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad)
    };
  };

  const drawHouseSector = (startLon, endLon, idx) => {
    const startAngle = getAngle(startLon);
    let endAngle = getAngle(endLon);

    // To draw arc correctly, need to account for wrapping
    // Since we go counter-clockwise, startAngle > endAngle usually
    let sweep = 0; // counter-clockwise
    let diff = startAngle - endAngle;
    if (diff < 0) diff += 360;
    const largeArc = diff > 180 ? 1 : 0;

    const p1Out = getPoint(startAngle, OUTER_RADIUS);
    const p2Out = getPoint(endAngle, OUTER_RADIUS);
    const p1In = getPoint(startAngle, INNER_RADIUS);
    const p2In = getPoint(endAngle, INNER_RADIUS);

    const midLon = startLon + (endLon - startLon + (endLon < startLon ? 360 : 0)) / 2;
    const midAngle = getAngle(midLon);
    const textPoint = getPoint(midAngle, OUTER_RADIUS - 15);

    return (
      <g key={`house-${idx}`}>
        <path
          d={`M ${p1In.x} ${p1In.y} L ${p1Out.x} ${p1Out.y} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} ${sweep} ${p2Out.x} ${p2Out.y} L ${p2In.x} ${p2In.y} A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 1 ${p1In.x} ${p1In.y}`}
          fill="none"
          stroke="#0000aa"
          strokeWidth="1"
        />
        {/* House Number inside outer edge */}
        <text
          x={textPoint.x}
          y={textPoint.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="rgba(9, 9, 22, 1)"
        >
          {idx + 1}
        </text>
      </g>
    );
  };

  const drawSigns = () => {
    return Array.from({ length: 12 }).map((_, i) => {
      const signStartLon = i * 30;
      const signAngle = getAngle(signStartLon);
      const midAngle = signAngle - 15; // 15 degrees counter-clockwise
      const textPoint = getPoint(midAngle, SIGN_RADIUS);

      return (
        <text
          key={`sign-${i}`}
          x={textPoint.x}
          y={textPoint.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="rgba(13, 13, 17, 1)"
          fontFamily="serif"
        >
          {SIGN_NAMES[i]}
        </text>
      );
    });
  };

  const drawPlanets = () => {
    // Group planets by approximate longitude to avoid overlapping text
    const groups = [];

    planets.forEach(p => {
      const angle = getAngle(p.longitude);
      let placed = false;
      for (let g of groups) {
        if (Math.abs(g.angle - angle) < 5 || Math.abs(g.angle - angle) > 355) {
          g.planets.push(p);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groups.push({ angle, planets: [p] });
      }
    });

    return groups.map((g, idx) => {
      // Offset multiple planets inwards
      return g.planets.map((p, pIdx) => {
        const rad = OUTER_RADIUS - 30 - (pIdx * 12);
        const pt = getPoint(g.angle, rad);
        return (
          <text
            key={`p-${idx}-${pIdx}`}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="medium"
            fill={getPlanetColor(p.planet)}
            fontFamily="serif"
          >
            {p.short_name}
          </text>
        );
      });
    });
  };

  return (
    <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="w-full h-full max-h-full">
      <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} fill="none" stroke="#0000aa" strokeWidth="1" />
      <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="none" stroke="#0000aa" strokeWidth="1" />
      <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 50} fill="none" stroke="#0000aa" strokeWidth="1" />

      {/* Draw House Sectors */}
      {cusps.map((c, i) => {
        const nextCusp = i === 11 ? cusps[0] : cusps[i + 1];
        return drawHouseSector(c.longitude, nextCusp.longitude, i);
      })}

      {/* Draw Outer Sign Labels */}
      {drawSigns()}

      {/* Draw Planets */}
      {drawPlanets()}

      {/* Draw 30 degree marks on outer ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = getAngle(i * 30);
        const p1 = getPoint(angle, OUTER_RADIUS);
        const p2 = getPoint(angle, OUTER_RADIUS + 50);
        return <line key={`tick-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#0000aa" strokeWidth="1" />;
      })}
    </svg>
  );
};

export default KPChart;
