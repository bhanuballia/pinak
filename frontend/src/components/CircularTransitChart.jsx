import React from 'react';

const CircularTransitChart = ({ birthPlanets, transitPlanets, ascendantSignIndex, currentDate, currentTime }) => {
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  
  // Radii for the different rings
  const rOuterText = 230;
  const rOuter = 210; // Outer edge of transit ring
  const rMiddle = 150; // Boundary between transit and birth rings
  const rInner = 90; // Boundary of center text area
  
  // We place the Ascendant sign at the top (90 degrees / 12 o'clock in SVG is -90)
  // Let's rotate so that Ascendant's sign is at top.
  // The signs are drawn counter-clockwise.
  // SVG angle starts at 3 o'clock (0 rad) and goes clockwise.
  // Top is -PI/2.
  // If Ascendant sign is at top, its slice goes from -PI/2 - (PI/12) to -PI/2 + (PI/12) ?
  // Actually, standard is 12 slices of 30 degrees (PI/6 radians).
  
  const signs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Group planets by sign
  const getPlanetsBySign = (planets) => {
    const map = {};
    for (let i=1; i<=12; i++) map[i] = [];
    if (!planets) return map;
    
    planets.forEach(p => {
      // Find sign index based on degree or rashi string
      // For simplicity, we assume 'degree' passed is absolute (0-360)
      if (p.absolute_degree !== undefined) {
        const signNum = Math.floor(p.absolute_degree / 30) + 1;
        if (map[signNum]) map[signNum].push(p);
      }
    });
    return map;
  };

  const birthBySign = getPlanetsBySign(birthPlanets);
  const transitBySign = getPlanetsBySign(transitPlanets);

  // Ascendant sign number (1-12)
  const ascSign = (ascendantSignIndex !== undefined ? ascendantSignIndex : 0) + 1;

  // We want ascSign to be at the top (-90 degrees in SVG, which is 270).
  // Slices go counter-clockwise.
  const getSliceRotation = (signNum) => {
    // Difference between this sign and ascendant sign
    let diff = signNum - ascSign;
    if (diff < 0) diff += 12;
    // Ascendant is at top (-90 deg). We subtract diff * 30 to go counter-clockwise
    let angleDeg = -90 - (diff * 30);
    return angleDeg;
  };

  const drawSliceLine = (signNum) => {
    // Line at the START of the slice
    const angleDeg = getSliceRotation(signNum) + 15; // +15 to get to the boundary of the slice
    const angleRad = (angleDeg * Math.PI) / 180;
    const x1 = cx + rInner * Math.cos(angleRad);
    const y1 = cy + rInner * Math.sin(angleRad);
    const x2 = cx + rOuter * Math.cos(angleRad);
    const y2 = cy + rOuter * Math.sin(angleRad);
    return <line key={`line-${signNum}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="1" />;
  };

  const renderPlanetText = (planets, radius, signNum, isInner) => {
    if (!planets || planets.length === 0) return null;
    const angleDeg = getSliceRotation(signNum);
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Position text
    const textX = cx + radius * Math.cos(angleRad);
    const textY = cy + radius * Math.sin(angleRad);
    
    // Format planets string, e.g., "Su Me" or "Su(R)"
    const colors = {
      "Su": "#ff9900", "Mo": "#cccccc", "Ma": "#ff3333", "Me": "#33cc33",
      "Ju": "#ffcc00", "Ve": "#ff66ff", "Sa": "#6666ff", "Ra": "#999999", "Ke": "#999999", "As": "#ffffff"
    };

    return (
      <g key={`p-${isInner}-${signNum}`} transform={`translate(${textX}, ${textY})`}>
        {planets.map((p, i) => {
          // Stagger if many planets
          const yOff = (i - (planets.length-1)/2) * 12;
          return (
            <text 
              key={i} 
              x={0} 
              y={yOff} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="11" 
              fontWeight="bold"
              fill={colors[p.planet] || "#fff"}
            >
              {p.planet}{p.rc === "R" ? "R" : ""}
            </text>
          );
        })}
      </g>
    );
  };

  return (
    <div className="flex justify-center items-center bg-[#f7d6e0] p-4 rounded-lg shadow-inner" style={{ background: '#f8d0dc' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={rOuter} fill="#ffffe0" stroke="#0000aa" strokeWidth="2" />
        
        {/* Middle divider */}
        <circle cx={cx} cy={cy} r={rMiddle} fill="none" stroke="#0000aa" strokeWidth="1" />
        
        {/* Inner circle (date/time) */}
        <circle cx={cx} cy={cy} r={rInner} fill="#ffffff" stroke="#0000aa" strokeWidth="2" />

        {/* Draw 12 slice dividers */}
        {signs.map(s => drawSliceLine(s))}

        {/* Draw Sign Numbers on the outside */}
        {signs.map(s => {
          const angleDeg = getSliceRotation(s);
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = cx + rOuterText * Math.cos(angleRad);
          const y = cy + rOuterText * Math.sin(angleRad);
          return (
            <text key={`num-${s}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#0000aa" fontWeight="bold">
              {s}
            </text>
          );
        })}

        {/* Draw Planets */}
        {signs.map(s => renderPlanetText(birthBySign[s], rInner + 30, s, true))}
        {signs.map(s => renderPlanetText(transitBySign[s], rMiddle + 30, s, false))}

        {/* Center Text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="14" fill="#000" fontWeight="bold">
          {currentDate}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="12" fill="#000">
          {currentTime}
        </text>
      </svg>
    </div>
  );
};

export default CircularTransitChart;
