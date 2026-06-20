import React, { useState, useEffect } from 'react';

const PLANET_COLORS = {
  Sun: "#dc2626", // red
  Moon: "#000000",
  Mars: "#dc2626", // red
  Mercury: "#16a34a", // green
  Jupiter: "#f59e0b", // yellow-orange
  Venus: "#d946ef", // pink/magenta
  Saturn: "#2563eb", // blue
  Rahu: "#4b5563", // gray
  Ketu: "#4b5563", // gray
};

const TripatakiChakraViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem('worksheetData');
        if (!storedData) throw new Error("No worksheet data found.");

        const parsedData = JSON.parse(storedData);
        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;

        if (parsedData.basic_details && parsedData.basic_details.birth_date) {
          pDate = parsedData.basic_details.birth_date;
          pTime = parsedData.basic_details.birth_time;
          pLat = parsedData.basic_details.lat;
          pLon = parsedData.basic_details.lon;
        } else if (parsedData.meta) {
          pDate = parsedData.meta.date || '2000-01-01';
          pTime = parsedData.meta.time || '12:00:00';
          pLat = parsedData.meta.lat || 28.6139;
          pLon = parsedData.meta.lon || 77.2090;
          pTz = parsedData.meta.tz || 5.5;
        }

        const payload = {
          date: pDate,
          time: pTime,
          lat: parseFloat(pLat),
          lon: parseFloat(pLon),
          tz_offset: parseFloat(pTz),
          start_age: startAge
        };

        const response = await fetch('http://localhost:8000/api/solar_return/tripataki_chakra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Tripataki Chakra data.");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startAge]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-rose-800 text-lg font-serif">Calculating Tripataki Chakra...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-serif">Error: {error}</div>;
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  // Node coordinates on a [-2, 2] grid
  const gridScale = 60;
  const cx = 300;
  const cy = 250;

  const getPos = (x, y) => ({ cx: cx + x * gridScale, cy: cy + y * gridScale });

  const nodes = {
    12: getPos(-1, -2),
    11: getPos(0, -2),
    10: getPos(1, -2),
    9: getPos(2, -1),
    8: getPos(2, 0),
    7: getPos(2, 1),
    6: getPos(1, 2),
    5: getPos(0, 2),
    4: getPos(-1, 2),
    3: getPos(-2, 1),
    2: getPos(-2, 0),
    1: getPos(-2, -1),
  };

  // Assign planets to nodes
  const nodePlanets = {};
  for (let i = 1; i <= 12; i++) nodePlanets[i] = [];
  
  Object.keys(data.planet_signs).forEach(p => {
    const sign = data.planet_signs[p];
    nodePlanets[sign].push(p);
  });
  nodePlanets[data.lagna_sign].push("Lagna");

  // SVG Lines
  const lines = [
    // Verticals
    { start: getPos(-1, -2), end: getPos(-1, 2) },
    { start: getPos(0, -2), end: getPos(0, 2) },
    { start: getPos(1, -2), end: getPos(1, 2) },
    // Horizontals
    { start: getPos(-2, -1), end: getPos(2, -1) },
    { start: getPos(-2, 0), end: getPos(2, 0) },
    { start: getPos(-2, 1), end: getPos(2, 1) },
    // Long Diagonals
    { start: getPos(-1, -2), end: getPos(2, 1) },
    { start: getPos(-2, -1), end: getPos(1, 2) },
    { start: getPos(1, -2), end: getPos(-2, 1) },
    { start: getPos(2, -1), end: getPos(-1, 2) },
    // Medium Diagonals (Diamond)
    { start: getPos(-2, 0), end: getPos(0, -2) },
    { start: getPos(0, -2), end: getPos(2, 0) },
    { start: getPos(2, 0), end: getPos(0, 2) },
    { start: getPos(0, 2), end: getPos(-2, 0) },
    // Corner Caps
    { start: getPos(-2, -1), end: getPos(-1, -2) },
    { start: getPos(1, -2), end: getPos(2, -1) },
    { start: getPos(2, 1), end: getPos(1, 2) },
    { start: getPos(-1, 2), end: getPos(-2, 1) },
  ];

  // Draw Flags
  const flags = [
    { base: getPos(-1, -2), peak: getPos(-1.3, -2.2) },
    { base: getPos(0, -2), peak: getPos(-0.3, -2.2) },
    { base: getPos(1, -2), peak: getPos(0.7, -2.2) },
  ];

  const renderPlanetsList = (planets) => {
    if (planets.length === 0) return null;
    // Format: Mar Jup Ket
    return planets.map((p, idx) => (
      <span key={idx} style={{ color: p === "Lagna" ? "#000" : PLANET_COLORS[p], marginRight: '4px' }}>
        {p === "Lagna" ? "Lagna" : p.substring(0, 3)}
      </span>
    ));
  };

  const entitiesList = ["Moon", "Lagna", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl flex flex-col print:shadow-none">
        
        {/* Header Actions */}
        <div className="bg-white border-b border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 shadow-sm font-sans mb-4 print:hidden">
          <div className="flex items-center text-sm text-black mb-2 md:mb-0">
            <span className="font-semibold text-rose-800">Native</span>
            <span className="mx-2 text-gray-400">|</span>
            <span>Tripataki Chakra</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-rose-50 border border-rose-200 rounded px-2 py-1">
              <span className="text-xs text-rose-800 font-semibold mr-2">Start Age:</span>
              <input
                type="number"
                value={inputAge}
                onChange={(e) => setInputAge(e.target.value)}
                className="w-16 text-sm border border-gray-300 rounded px-1 outline-none focus:border-rose-500"
                min="1"
              />
              <button
                onClick={() => setStartAge(parseInt(inputAge) || 1)}
                className="ml-2 bg-rose-700 hover:bg-rose-800 text-white text-xs px-3 py-1 rounded transition-colors"
              >
                Load
              </button>
            </div>
            <button onClick={handlePrint} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded border border-blue-200 transition-colors">
              Print
            </button>
          </div>
        </div>

        <div className="w-full border-2 border-red-600 p-8 shadow-sm font-serif bg-white flex flex-col items-center">
          
          <h2 className="text-center text-red-700 text-2xl mb-8 font-bold">Tripataki Chakra</h2>
          
          {/* SVG Diagram */}
          <div className="relative w-full flex justify-center mb-10">
            <svg width="600" height="400" viewBox="0 0 600 400">
              {/* Lines */}
              {lines.map((line, idx) => (
                <line key={idx} x1={line.start.cx} y1={line.start.cy} x2={line.end.cx} y2={line.end.cy} stroke="#b91c1c" strokeWidth="1.5" />
              ))}
              
              {/* Flags */}
              {[12, 11, 10].map((id) => {
                const pos = nodes[id];
                return (
                  <path 
                    key={`flag-${id}`} 
                    d={`M ${pos.cx} ${pos.cy} L ${pos.cx} ${pos.cy - 20} L ${pos.cx - 25} ${pos.cy - 20} Z`} 
                    fill="none" 
                    stroke="#b91c1c" 
                    strokeWidth="1.5" 
                  />
                );
              })}

              {/* OM Symbol */}
              <text x={cx} y={cy + 8} textAnchor="middle" fontSize="24" fill="#b91c1c" fontWeight="bold">ॐ</text>

              {/* Node Numbers and Planets */}
              {Object.keys(nodes).map(nodeId => {
                const pos = nodes[nodeId];
                const nid = parseInt(nodeId);
                
                let numX, numY, planX, planY, anchor;
                if (nid >= 10 && nid <= 12) {
                  numX = pos.cx; numY = pos.cy - 28; planX = pos.cx; planY = pos.cy - 44; anchor = "middle";
                } else if (nid >= 7 && nid <= 9) {
                  numX = pos.cx + 15; numY = pos.cy + 4; planX = pos.cx + 35; planY = pos.cy + 4; anchor = "start";
                } else if (nid >= 4 && nid <= 6) {
                  numX = pos.cx; numY = pos.cy + 22; planX = pos.cx; planY = pos.cy + 38; anchor = "middle";
                } else if (nid >= 1 && nid <= 3) {
                  numX = pos.cx - 15; numY = pos.cy + 4; planX = pos.cx - 35; planY = pos.cy + 4; anchor = "end";
                }

                const planets = nodePlanets[nodeId];

                return (
                  <g key={`node-${nodeId}`}>
                    {/* Node Number */}
                    <text x={numX} y={numY} textAnchor="middle" fontSize="13" fill="#000" fontWeight="bold">
                      {nodeId}
                    </text>
                    {/* Planets */}
                    {planets.length > 0 && (
                      <text x={planX} y={planY} textAnchor={anchor} fontSize="13" fontWeight="bold">
                        {planets.map((p, i) => (
                          <tspan key={i} fill={p === "Lagna" ? "#000" : PLANET_COLORS[p]}>
                            {p === "Lagna" ? "Lagna" : p.substring(0, 3)}
                            {i < planets.length - 1 ? " " : ""}
                          </tspan>
                        ))}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Vedhas Table */}
          <div className="w-full max-w-3xl mb-10">
            <h3 className="text-center text-red-700 text-lg mb-2 font-bold">Vedhas in Tripataki Chakra</h3>
            <div className="border-t border-b border-red-600 py-2 flex justify-between px-8 text-sm">
              <div className="w-1/2 flex flex-col gap-1">
                {entitiesList.slice(0, 4).map(e => (
                  <div key={e} className="flex">
                    <div className="w-20 font-bold" style={{ color: e === "Lagna" ? "#000" : PLANET_COLORS[e] }}>{e}</div>
                    <div className="mr-2">:</div>
                    <div className="flex-1 font-bold">{renderPlanetsList(data.vedhas[e])}</div>
                  </div>
                ))}
              </div>
              <div className="w-1/2 flex flex-col gap-1 pl-4">
                {entitiesList.slice(4, 8).map(e => (
                  <div key={e} className="flex">
                    <div className="w-20 font-bold" style={{ color: e === "Lagna" ? "#000" : PLANET_COLORS[e] }}>{e}</div>
                    <div className="mr-2">:</div>
                    <div className="flex-1 font-bold">{renderPlanetsList(data.vedhas[e])}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results of Vedhas */}
          <div className="w-full max-w-3xl">
            <h3 className="text-center text-red-700 text-lg mb-4 font-bold">Results of Vedhas to the Moon</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-800">
              {data.moon_results.map((res, idx) => (
                <div key={idx} className="flex">
                  <div className="w-24 font-bold shrink-0" style={{ color: PLANET_COLORS[res.planet] }}>{res.planet}</div>
                  <div className="mr-2">:</div>
                  <div className="flex-1 leading-tight">{res.result}</div>
                </div>
              ))}
              {data.moon_results.length === 0 && (
                <div className="text-center text-gray-500 italic">No Vedhas to the Moon in this chart.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripatakiChakraViewer;
