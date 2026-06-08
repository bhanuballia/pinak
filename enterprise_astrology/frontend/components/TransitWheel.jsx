// frontend/components/TransitWheel.jsx
import React, { useState } from 'react';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function TransitWheel({ planets = [] }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  // SVG dimensions
  const size = 500;
  const center = size / 2;
  const radius = 200;
  const outerRadius = 230;

  // Calculate coordinates (X, Y) for a given angle in degrees
  const getCoordinates = (angleDeg, r = radius) => {
    // 0 degrees corresponds to East (3 o'clock). We subtract 90 to make 0 degrees start at North (12 o'clock)
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  return (
    <div style={{
      background: 'radial-gradient(circle, #1a1a36 0%, #0d0d1e 100%)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 12px 40px rgba(0, 243, 255, 0.1)',
      border: '1px solid #2e2e5c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      fontFamily: 'Outfit, Inter, sans-serif'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        background: 'linear-gradient(90deg, #00f3ff, #ff007f)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '24px',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        Real-Time Astronomical Transit Wheel
      </h3>
      
      <div style={{ position: 'relative' }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Background Outer Glow */}
          <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#2e2e5c" strokeWidth="2" />
          <circle cx={center} cy={center} r={radius} fill="rgba(13, 13, 30, 0.6)" stroke="#00f3ff" strokeWidth="1.5" style={{ filter: 'drop-shadow(0px 0px 10px rgba(0,243,255,0.3))' }} />

          {/* Draw 12 Zodiac Houses spokes and signs */}
          {ZODIAC_SIGNS.map((sign, index) => {
            const startAngle = index * 30;
            const textAngle = startAngle + 15;
            
            // Draw sector divider spoke
            const spokeCoords = getCoordinates(startAngle, outerRadius);
            
            // Get label coordinate
            const labelCoords = getCoordinates(textAngle, radius + 15);

            return (
              <g key={sign}>
                {/* Spoke */}
                <line
                  x1={center}
                  y1={center}
                  x2={spokeCoords.x}
                  y2={spokeCoords.y}
                  stroke="rgba(107, 107, 191, 0.4)"
                  strokeWidth="1"
                />
                {/* Sign Text */}
                <text
                  x={labelCoords.x}
                  y={labelCoords.y}
                  fill="#6b6bbf"
                  fontSize="11"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${labelCoords.x}, ${labelCoords.y})`}
                  style={{ userSelect: 'none', fontWeight: '500' }}
                >
                  {sign.slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Draw inner circle aspect lines or decorations */}
          <circle cx={center} cy={center} r={radius - 60} fill="none" stroke="rgba(107, 107, 191, 0.2)" strokeDasharray="5,5" />
          <circle cx={center} cy={center} r={radius - 120} fill="none" stroke="rgba(0, 243, 255, 0.15)" />

          {/* Draw planets */}
          {planets.map((p) => {
            const angle = p.longitude || 0;
            const coords = getCoordinates(angle, radius - 30);
            const isHovered = hoveredPlanet && hoveredPlanet.name === p.name;

            return (
              <g
                key={p.name}
                onMouseEnter={() => setHoveredPlanet(p)}
                onMouseLeave={() => setHoveredPlanet(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Planet pulse glow */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 16 : 10}
                  fill={p.color || '#ff007f'}
                  opacity={isHovered ? 0.4 : 0.2}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Core Planet Dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="6"
                  fill="#ffffff"
                  stroke={p.color || '#ff007f'}
                  strokeWidth="2.5"
                />
                {/* Label text */}
                <text
                  x={coords.x}
                  y={coords.y - 12}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{
                    filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.8))',
                    userSelect: 'none'
                  }}
                >
                  {p.name.slice(0, 2)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip overlay */}
        {hoveredPlanet && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(13, 13, 30, 0.95)',
            border: `2px solid ${hoveredPlanet.color || '#00f3ff'}`,
            borderRadius: '12px',
            padding: '12px 18px',
            pointerEvents: 'none',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: hoveredPlanet.color || '#fff', marginBottom: '4px' }}>
              {hoveredPlanet.name}
            </div>
            <div style={{ fontSize: '13px', color: '#c0c0d5' }}>
              Longitude: <span style={{ color: '#00f3ff', fontWeight: '600' }}>{Number(hoveredPlanet.longitude).toFixed(2)}°</span>
            </div>
            <div style={{ fontSize: '13px', color: '#c0c0d5' }}>
              Sign: <span style={{ color: '#ff007f', fontWeight: '600' }}>{hoveredPlanet.sign || 'Aries'}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#c0c0d5' }}>
              House: <span style={{ color: '#ffb300', fontWeight: '600' }}>{hoveredPlanet.house || 1}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
