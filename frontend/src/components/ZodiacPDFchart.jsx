import React, { useState } from "react";

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
    1: { x: 50, y: 44 },  // bottom of top diamond
    2: { x: 29, y: 23 },  // bottom-right of top-left triangle
    3: { x: 23, y: 29 },  // top-right of left-upper triangle
    4: { x: 44, y: 50 },  // right of left diamond
    5: { x: 23, y: 71 },  // bottom-right of left-lower triangle
    6: { x: 29, y: 77 },  // top-right of bottom-left triangle
    7: { x: 50, y: 56 },  // top of bottom diamond
    8: { x: 71, y: 77 },  // top-left of bottom-right triangle
    9: { x: 77, y: 71 },  // bottom-left of right-lower triangle
    10: { x: 56, y: 50 }, // left of right diamond
    11: { x: 77, y: 29 }, // top-left of right-upper triangle
    12: { x: 71, y: 23 }, // bottom-left of top-right triangle
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
    "Sun": "hsla(0, 63%, 5%, 1.00)",  // Red
    "Moon": "#0a1013ff",  // Slate
    "Mars": "hsla(0, 52%, 5%, 1.00)",  // Dark Red
    "Mercury": "rgba(8, 15, 11, 1)",  // Green
    "Jupiter": "hsla(26, 30%, 5%, 1.00)",  // Amber
    "Venus": "hsla(336, 56%, 4%, 1.00)",  // Pink
    "Saturn": "rgba(5, 4, 19, 1)",  // Indigo
    "Rahu": "hsla(180, 43%, 6%, 1.00)",  // Teal
    "Ketu": "hsla(278, 65%, 3%, 1.00)",  // Brown
    "Ascendant": "#000000"   // Black
};

const PLANET_HINDI = {
    "Sun": "सू", "Moon": "चं", "Mars": "मं", "Mercury": "बु",
    "Jupiter": "गु", "Venus": "शु", "Saturn": "श", "Rahu": "रा",
    "Ketu": "के", "Ascendant": "ल", "Uranus": "अरु", "Neptune": "वरु", "Pluto": "यम"
};

const NAKSHATRA_HINDI = {
    "Ashwini": "अश्", "Bharani": "भर", "Krittika": "कृत्", "Rohini": "रोहि",
    "Mrigashira": "मृग", "Ardra": "आर्", "Punarvasu": "पुन", "Pushya": "पुष",
    "Ashlesha": "आश्", "Magha": "मघा", "Purva Phalguni": "पू.फा", "Uttara Phalguni": "उ.फा",
    "Hasta": "हस्", "Chitra": "चित", "Swati": "स्वा", "Vishakha": "विश",
    "Anuradha": "अनु", "Jyeshtha": "ज्ये", "Mula": "मूल", "Purva Ashadha": "पू.षा",
    "Uttara Ashadha": "उ.षा", "Shravana": "श्रव", "Dhanishta": "धनि",
    "Shatabhisha": "शत", "Purva Bhadrapada": "पू.भा", "Uttara Bhadrapada": "उ.भा",
    "Revati": "रेव"
};

const ZodiacRectSign = ({ houses, onPlanetClick, title, variant = "modern", planetEffects = {}, aspectRatio = 2.5, planetPositions = [], isRect, setIsRect, scaleText = 1, hideLegend = false, hideOuterRect, defaultLang = 'en' }) => {
    const isMainChart = title && (
        title.toLowerCase().includes('birth') ||
        title.toLowerCase().includes('lagna') ||
        title.toLowerCase().includes('d1') ||
        title.toLowerCase().includes('d-1')
    );
    const finalHideOuterRect = hideOuterRect !== undefined ? hideOuterRect : !isMainChart;
    const [lang, setLang] = useState(defaultLang);
    const [zoom, setZoom] = useState(1);
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

    const [useOriginalColors, setUseOriginalColors] = useState(false);

    const getPlanetColor = (planet) => {
        if (useOriginalColors) {
            return PLANET_COLORS[planet] || "#727e96ff";
        }
        if (isMainChart) {
            const effect = planetEffects[planet];
            if (effect === "positive") return "#077e2fff"; // Green
            if (effect === "negative") return "rgba(199, 20, 20, 1)"; // Red
            if (effect === "neutral") return "rgba(14, 5, 95, 1)";  // Blue
        }
        return PLANET_COLORS[planet] || "#727e96ff";
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            width: '100%', height: '100%',
            background: isLegacy ? '#f0ebe3ff' : 'white',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            zIndex: zoom > 1 ? 50 : 1,
            position: zoom > 1 ? 'relative' : 'static',
            transition: 'transform 0.2s ease-in-out',
            boxShadow: zoom > 1 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'
        }}>
            {(title || setIsRect) && (
                <div className="chart-header-bar print:hidden" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderBottom: '1px solid #8ec5e6',
                    background: isLegacy ? '#f0f8fc' : 'transparent',
                    flexShrink: 0
                }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#0a4d7a',
                    }}>
                        {title}
                    </div>

                    <div className="print:hidden" style={{ display: 'flex', gap: '4px' }}>
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
                        {setIsRect && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsRect(!isRect); }}
                                style={{
                                    background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                                    padding: '1px 6px', borderRadius: '4px', fontSize: '9px',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                                title="Toggle Shape (Square/Rectangular)"
                            >
                                ⬛
                            </button>
                        )}
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
            <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                <div style={{ width: '100%', flex: 1, padding: '2px', minHeight: 0 }}>
                    <svg
                        viewBox={finalHideOuterRect ? `${5 * aspectRatio} 5 ${90 * aspectRatio} 90` : `0 0 ${100 * aspectRatio} 100`}
                        style={{ display: 'block', width: `100%`, height: `100%` }}
                        preserveAspectRatio="none"
                    >
                        {/* Background */}
                        <rect x="0" y="0" width={100 * aspectRatio} height="100" fill={isLegacy && isMainChart ? "#eec8dcff" : "white"} />

                        {/* Outer Margin frame */}
                        {!finalHideOuterRect && (
                            <rect
                                x={1 * aspectRatio} y="1" width={98 * aspectRatio} height="98"
                                fill="none"
                                stroke="#1e3a8a"
                                strokeWidth="0.4"
                            />
                        )}

                        {/* Inner square */}
                        <rect
                            x={5 * aspectRatio} y="5" width={90 * aspectRatio} height="90"
                            fill={isLegacy && !isMainChart ? "#f1e8beff" : "none"}
                            stroke="rgba(9, 11, 15, 1)"
                            strokeWidth={isLegacy ? "0.3" : "1.2"}
                        />

                        {/* Margin Dividers */}
                        {!finalHideOuterRect && (
                            <>
                                <line x1={27.5 * aspectRatio} y1="1" x2={27.5 * aspectRatio} y2="5" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={72.5 * aspectRatio} y1="1" x2={72.5 * aspectRatio} y2="5" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={27.5 * aspectRatio} y1="95" x2={27.5 * aspectRatio} y2="99" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={72.5 * aspectRatio} y1="95" x2={72.5 * aspectRatio} y2="99" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={1 * aspectRatio} y1="27.5" x2={5 * aspectRatio} y2="27.5" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={1 * aspectRatio} y1="72.5" x2={5 * aspectRatio} y2="72.5" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={95 * aspectRatio} y1="27.5" x2={99 * aspectRatio} y2="27.5" stroke="#1e3a8a" strokeWidth="0.3" />
                                <line x1={95 * aspectRatio} y1="72.5" x2={99 * aspectRatio} y2="72.5" stroke="#1e3a8a" strokeWidth="0.3" />
                            </>
                        )}

                        {/* Inner diamond connecting midpoints */}
                        <polygon
                            points={`${50 * aspectRatio},5 ${95 * aspectRatio},50 ${50 * aspectRatio},95 ${5 * aspectRatio},50`}
                            fill="none"
                            stroke="rgba(14, 15, 20, 1)"
                            strokeWidth={isLegacy ? "0.3" : "0.3"}
                        />

                        {/* Centre cross lines */}



                        {/* Diagonal corner lines (corners to opposite midpoints) */}
                        <line x1={5 * aspectRatio} y1="5" x2={95 * aspectRatio} y2="95" stroke="#101113ff" strokeWidth="0.3" />
                        <line x1={95 * aspectRatio} y1="5" x2={5 * aspectRatio} y2="95" stroke="#101113ff" strokeWidth="0.3" />
                        {/* Margin Labels */}
                        {!finalHideOuterRect && [
                            { h: 2, x: 16.25, y: 3, r: 0 },
                            { h: 1, x: 50, y: 3, r: 0 },
                            { h: 12, x: 83.75, y: 3, r: 0 },
                            { h: 3, x: 3, y: 16.25, r: -90 },
                            { h: 4, x: 3, y: 50, r: -90 },
                            { h: 5, x: 3, y: 83.75, r: -90 },
                            { h: 6, x: 16.25, y: 97, r: 0 },
                            { h: 7, x: 50, y: 97, r: 0 },
                            { h: 8, x: 83.75, y: 97, r: 0 },
                            { h: 11, x: 97, y: 16.25, r: -90 },
                            { h: 10, x: 97, y: 50, r: -90 },
                            { h: 9, x: 97, y: 83.75, r: -90 },
                        ].map(({ h, x, y, r }) => {
                            const ord = ["", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th"];
                            const info = houses?.[h] || houses?.[String(h)] || {};
                            const savText = info.sav_score !== undefined ? `${info.sav_score}` : '';
                            const bbText = info.bhava_bala !== undefined ? `${info.bhava_bala.toFixed(2)}` : '';
                            const scoreText = (savText && bbText) ? ` ${savText} ${bbText}` : (savText ? ` ${savText}` : '');
                            return (
                                <text
                                    key={`margin-${h}`}
                                    x={x * aspectRatio}
                                    y={y}
                                    transform={r ? `rotate(${r}, ${x * aspectRatio}, ${y})` : undefined}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="2.9"
                                    fill="#3a0000ff"
                                    fontFamily="serif"
                                >
                                    {`${h}${ord[h]} h.${scoreText}`}
                                </text>
                            );
                        })}
                        {/* House labels + planets */}
                        {entries.map(({ houseNum, signDisplay, planets }) => {
                            const signAnchor = HOUSE_SIGN_ANCHOR[houseNum];
                            const center = HOUSE_CENTER[houseNum];
                            if (!signAnchor || !center) return null;

                            // Prepare the stack items: House index (gray) + Planets (colored)
                            // If D1 chart (main), use detailed stack, max 4 planets. 
                            // If not D1, use grid, show up to 9 planets.
                            const displayedPlanets = isMainChart ? planets.slice(0, 4) : planets.slice(0, 9);

                            const lineH = 5.5 * scaleText; // Distance for vertical stack
                            const gridLineH = 5.5 * scaleText; // Distance for grid rows
                            const totalItems = displayedPlanets.length;

                            // Start Y for vertical stack (Main Chart)
                            const startY = totalItems > 0 ? center.y - ((totalItems - 1) * lineH) / 2 : center.y;

                            // Start Y for grid (Non-Main Charts)
                            const totalRows = Math.ceil(totalItems / 2);
                            const gridStartY = totalItems > 0 ? center.y - ((totalRows - 1) * gridLineH) / 2 : center.y;

                            return (
                                <g key={houseNum}>
                                    {/* Sign number (Standard North Indian format) — at inner intersections */}
                                    <text
                                        x={signAnchor.x * aspectRatio}
                                        y={signAnchor.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize={6 * scaleText}
                                        fill="#0e0c0cff"
                                        fontWeight="medium"
                                        fontFamily="serif"
                                        style={{ userSelect: 'none', pointerEvents: 'none' }}
                                    >
                                        {signDisplay}
                                    </text>

                                    {/* Planet abbreviations */}
                                    {displayedPlanets.map((p, idx) => {
                                        const pName = typeof p === 'object' ? p.name : p;
                                        const isRetro = typeof p === 'object' ? p.is_retrograde : false;
                                        const isCombust = typeof p === 'object' ? p.is_combust : false;

                                        let abbrev = lang === 'hi' ? (PLANET_HINDI[pName] || pName.substring(0, 2)) : (PLANET_ABBREV[pName] || pName.substring(0, 2));
                                        if (isRetro) abbrev += '*';
                                        if (isCombust) abbrev += '#';

                                        let color = getPlanetColor(pName);
                                        let positionArray = Array.isArray(planetPositions) ? planetPositions : Object.values(planetPositions || {});
                                        let fullPos = positionArray.find(pos => pos.planet === pName || pos.name === pName) || (typeof p === 'object' ? p : null);

                                        let nakshatra = fullPos?.nakshatra || (typeof p === 'object' ? p.nakshatra : null);
                                        let nakText = nakshatra ? String(nakshatra).substring(0, 3) : "";
                                        if (lang === 'hi' && nakshatra) {
                                            nakText = NAKSHATRA_HINDI[nakshatra] || nakText;
                                        }

                                        let degreeStr = "";
                                        if (fullPos) {
                                            let rawDeg = fullPos.normDegree !== undefined ? fullPos.normDegree : (fullPos.degree !== undefined ? fullPos.degree : null);
                                            if (rawDeg !== null) {
                                                let normDeg = rawDeg % 30;
                                                let d = Math.floor(normDeg);
                                                let m = Math.floor((normDeg - d) * 60);
                                                degreeStr = ` ${d.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} `;
                                            }
                                        }

                                        // Calculate position
                                        let currentX = center.x * aspectRatio;
                                        let currentY = startY + idx * lineH;

                                        if (!isMainChart) {
                                            const col = idx % 2;
                                            const row = Math.floor(idx / 2);
                                            const isLastOdd = (totalItems % 2 !== 0) && (idx === totalItems - 1);

                                            // X offset: 3 units left or right. If last odd, center it.
                                            let xOffset = 0;
                                            if (!isLastOdd) {
                                                xOffset = col === 0 ? -3 : 3;
                                            }

                                            currentX = (center.x + xOffset) * aspectRatio;
                                            currentY = gridStartY + row * gridLineH;
                                        }

                                        return (
                                            <text
                                                key={idx}
                                                x={currentX}
                                                y={currentY}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                style={{ cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onPlanetClick?.(pName, houseNum);
                                                }}
                                            >
                                                <tspan fontSize={5 * scaleText} fill={color} fontWeight="bold" fontFamily="Arial, sans-serif">
                                                    {abbrev}
                                                </tspan>
                                                {isMainChart && degreeStr && (
                                                    <tspan dx="1.5" fontSize={3.8 * scaleText} fill="rgba(87, 6, 53, 1)" fontWeight="normal" fontFamily="Arial, sans-serif">
                                                        {degreeStr}
                                                    </tspan>
                                                )}
                                                {isMainChart && nakshatra && (
                                                    <tspan dx="1.5" fontSize={3.9 * scaleText} fill="#000000" fontWeight="normal" fontFamily="Arial, sans-serif">
                                                        {nakText}
                                                    </tspan>
                                                )}
                                            </text>
                                        );
                                    })}
                                </g>
                            );
                        })}

                    </svg>
                </div>
                {!hideLegend && isMainChart && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4px',
                        fontSize: '11px',
                        color: 'rgba(241, 15, 15, 1)',
                        fontWeight: '500',
                        fontFamily: 'Arial, sans-serif',
                        fontStyle: 'italic',
                        flexShrink: 0
                    }}>
                        * = Vakri (Retrograde), # = Asth (Combust)
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZodiacRectSign;
