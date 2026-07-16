import React, { useState, useEffect, useRef } from 'react';
import CompactTransitControl from './worksheet/CompactTransitControl';

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

const PLANET_ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke", Lagna: "As", Pluto: "Pl", Neptune: "Ne", Uranus: "Ur"
};

const KalachakraViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransitControl, setShowTransitControl] = useState(false);
  const [transitDateLabel, setTransitDateLabel] = useState(null);
  const locationRef = useRef({ lat: 28.6139, lon: 77.2090, tz: 5.5 });

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
        }
        locationRef.current = { lat: parseFloat(pLat), lon: parseFloat(pLon), tz: parseFloat(pTz) };

        const payload = {
          date: pDate,
          time: pTime,
          lat: locationRef.current.lat,
          lon: locationRef.current.lon,
          tz_offset: locationRef.current.tz,
        };

        const response = await fetch('/api/kalachakra/kalachakra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Kalachakra data.");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-800 text-lg font-serif">Computing Kalachakra Diagram...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-serif">Error: {error}</div>;
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTransitChange = async (positions, dt) => {
    try {
      const dateStr = dt.toISOString().split("T")[0];
      const pad = n => String(n).padStart(2, "0");
      const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
      
      const payload = {
        date: dateStr,
        time: timeStr,
        lat: locationRef.current.lat,
        lon: locationRef.current.lon,
        tz_offset: locationRef.current.tz,
      };

      const response = await fetch('/api/kalachakra/kalachakra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setTransitDateLabel(`${dateStr} ${timeStr}`);
      }
    } catch (e) {
      console.error("Failed to fetch transit Kalachakra", e);
    }
  };

  const cx = 400;
  const cy = 400;
  const innerRadius = 100;
  const spokeLength = 180;

  const DIRECTIONS = [
    { label: "East", angle: -90, desc: "EAST: Indra (power)" },
    { label: "SE", angle: -45, desc: "SE: Agni (prosperity)" },
    { label: "South", angle: 0, desc: "S: Yama (death)" },
    { label: "SW", angle: 45, desc: "SW: Nirriti (curses of gods)" },
    { label: "West", angle: 90, desc: "WEST: Varuna (water)" },
    { label: "NW", angle: 135, desc: "NW: Vayu (wandering)" },
    { label: "North", angle: 180, desc: "N: Kubera (money)" },
    { label: "NE", angle: 225, desc: "NE: Isana (blessings of gods)" }
  ];

  const NAK_MAPPING = {
    "East": ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"], // Outer to inner
    "SE": ["Bharani", "Ashwini", "Revati"],
    "South": ["Krittika", "Rohini", "Mrigashira"],
    "SW": ["Ashlesha", "Pushya", "Punarvasu"],
    "West": ["Magha", "Purva Phalguni", "Uttara Phalguni"],
    "NW": ["Vishakha", "Swati", "Chitra"],
    "North": ["Anuradha", "Jyeshtha", "Mula"],
    "NE": ["Shravana", "Abhijit", "Uttara Ashadha"]
  };

  const INNER_NAKS = [
    { name: "Purva Ashadha", x: cx - 40, y: cy - 40, label: "PSha" },
    { name: "Uttara Bhadrapada", x: cx + 40, y: cy - 40, label: "UBha" },
    { name: "Hasta", x: cx - 40, y: cy + 40, label: "Hast" },
    { name: "Ardra", x: cx + 40, y: cy + 40, label: "Ardr" },
  ];

  const renderPlanets = (nakName, x, y) => {
    const planets = data.nakshatra_planets[nakName] || [];
    if (planets.length === 0) return null;

    const text = planets.map(p => PLANET_ABBR[p] || p.substring(0, 2)).join(",");
    const rectWidth = text.length * 7 + 10;

    return (
      <g transform={`translate(${x - rectWidth / 2}, ${y + 5})`}>
        <rect width={rectWidth} height="16" rx="4" fill="#3b82f6" />
        <text x={rectWidth / 2} y="12" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{text}</text>
      </g>
    );
  };

  const getAbbr = (name) => {
    if (name === "Purva Bhadrapada") return "PBha";
    if (name === "Uttara Bhadrapada") return "UBha";
    if (name === "Purva Ashadha") return "PSha";
    if (name === "Uttara Ashadha") return "USha";
    if (name === "Purva Phalguni") return "PPha";
    if (name === "Uttara Phalguni") return "UPha";
    return name.substring(0, 4);
  };

  const renderWheel = () => {
    const segments = [];
    const wheelColor = "hsla(26, 17%, 92%, 1.00)"; // Terracotta / Wood color
    const wheelDark = "#ffffffff";

    // 1. Draw intricate center hub
    segments.push(<circle key="hub-outer" cx={cx} cy={cy} r={innerRadius} fill={wheelColor} stroke={wheelDark} strokeWidth="2" />);
    segments.push(<circle key="hub-mid" cx={cx} cy={cy} r={innerRadius - 20} fill="none" stroke={wheelDark} strokeWidth="4" strokeDasharray="6,4" />);
    segments.push(<circle key="hub-inner1" cx={cx} cy={cy} r={innerRadius - 40} fill="#f8fafc" stroke={wheelDark} strokeWidth="2" />);
    segments.push(<circle key="hub-center" cx={cx} cy={cy} r={30} fill={wheelColor} stroke={wheelDark} strokeWidth="3" />);
    segments.push(<circle key="hub-center-dot" cx={cx} cy={cy} r={10} fill={wheelDark} />);

    // 2. Draw thick spokes and outer rim
    const outerRad = innerRadius + spokeLength * 0.9;
    const midRad = innerRadius + spokeLength * 0.55;
    const innerSpokeRad = innerRadius + spokeLength * 0.2;

    // Thick Outer Rim
    segments.push(<circle key="rim-base" cx={cx} cy={cy} r={outerRad + 10} fill="none" stroke={wheelColor} strokeWidth="30" />);
    segments.push(<circle key="rim-inner-border" cx={cx} cy={cy} r={outerRad - 5} fill="none" stroke={wheelDark} strokeWidth="2" />);
    segments.push(<circle key="rim-outer-border" cx={cx} cy={cy} r={outerRad + 25} fill="none" stroke={wheelDark} strokeWidth="2" />);

    // Decorative Studs on the rim
    const numStuds = 48;
    for (let i = 0; i < numStuds; i++) {
      const studAngle = (i * 2 * Math.PI) / numStuds;
      const sx = cx + (outerRad + 10) * Math.cos(studAngle);
      const sy = cy + (outerRad + 10) * Math.sin(studAngle);
      segments.push(<circle key={`stud-${i}`} cx={sx} cy={sy} r={4} fill={wheelDark} />);
    }

    // Inner connecting thin circles (decorative rings inside the spokes)
    segments.push(<circle key="circle-mid" cx={cx} cy={cy} r={midRad} fill="none" stroke={wheelColor} strokeWidth="2" strokeDasharray="10,6" opacity="0.5" />);
    segments.push(<circle key="circle-inner-spoke" cx={cx} cy={cy} r={innerSpokeRad} fill="none" stroke={wheelColor} strokeWidth="2" strokeDasharray="10,6" opacity="0.5" />);

    // Draw inner Nakshatras (positioned inside the hub's white area)
    INNER_NAKS.forEach((nak, i) => {
      segments.push(
        <g key={`inner-${i}`}>
          <text x={nak.x} y={nak.y} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">{nak.label}</text>
          {renderPlanets(nak.name, nak.x, nak.y)}
        </g>
      );
    });

    DIRECTIONS.forEach((dir, i) => {
      const angleRad = (dir.angle * Math.PI) / 180;
      const x1 = cx + innerRadius * Math.cos(angleRad);
      const y1 = cy + innerRadius * Math.sin(angleRad);
      const x2 = cx + (outerRad - 5) * Math.cos(angleRad);
      const y2 = cy + (outerRad - 5) * Math.sin(angleRad);

      // Draw thick spoke line
      segments.push(<line key={`thick-spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wheelColor} strokeWidth="20" strokeLinecap="round" />);
      segments.push(<line key={`thick-spoke-border-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wheelDark} strokeWidth="2" strokeDasharray="10,10" />);

      // Decorative outward pin for the spoke
      const px = cx + (outerRad + 35) * Math.cos(angleRad);
      const py = cy + (outerRad + 35) * Math.sin(angleRad);
      segments.push(<line key={`pin-${i}`} x1={cx + (outerRad + 25) * Math.cos(angleRad)} y1={cy + (outerRad + 25) * Math.sin(angleRad)} x2={px} y2={py} stroke={wheelColor} strokeWidth="10" strokeLinecap="round" />);

      // Direction text at the end of the spoke (pushed out slightly to clear the pins)
      const dirTextX = cx + (outerRad + 60) * Math.cos(angleRad);
      const dirTextY = cy + (outerRad + 60) * Math.sin(angleRad);

      let textAnchor = "middle";
      if (dir.angle === 0) textAnchor = "start";
      if (dir.angle === 180) textAnchor = "end";

      segments.push(
        <text key={`dir-${i}`} x={dirTextX} y={dirTextY} textAnchor={textAnchor} fontWeight="bold" fontSize="12" fill="#af0707ff" alignmentBaseline="middle">
          {dir.desc}
        </text>
      );

      // Draw the 3 Nakshatras on the spoke
      const naks = NAK_MAPPING[dir.label]; // Outer to inner
      const positions = [
        innerRadius + spokeLength * 0.9, // Outer
        innerRadius + spokeLength * 0.55, // Mid
        innerRadius + spokeLength * 0.2   // Inner
      ];

      naks.forEach((nakName, idx) => {
        const radPos = positions[idx];
        const nx = cx + radPos * Math.cos(angleRad);
        const ny = cy + radPos * Math.sin(angleRad);

        segments.push(
          <g key={`nak-${dir.label}-${idx}`}>
            <rect x={nx - 15} y={ny - 10} width="30" height="15" fill="#f1f5f9" opacity="0.8" />
            <text x={nx} y={ny} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">{getAbbr(nakName)}</text>
            {renderPlanets(nakName, nx, ny)}
          </g>
        );
      });
    });

    return segments;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 font-sans flex justify-center">
      <div className="w-full max-w-5xl bg-white shadow-xl flex flex-col print:shadow-none overflow-hidden">

        {/* Header Actions */}
        <div className="bg-white border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 font-sans print:hidden">
          <div className="flex items-center text-sm text-black mb-2 md:mb-0">
            <span className="font-bold text-slate-800 text-lg">Kalachakra (Wheel of Time)</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowTransitControl(!showTransitControl)} 
              className={`text-sm px-4 py-2 rounded-lg border transition-colors font-semibold ${showTransitControl ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
            >
              {showTransitControl ? 'Hide Transit Control' : 'Open Transit Control'}
            </button>
            <button onClick={handlePrint} className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 transition-colors font-semibold">
              Print Diagram
            </button>
          </div>
        </div>

        {showTransitControl && (
          <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-center print:hidden">
            <CompactTransitControl 
              lat={locationRef.current.lat} 
              lon={locationRef.current.lon} 
              onTransitChange={handleTransitChange} 
            />
          </div>
        )}

        <div className="w-full p-8 bg-[#f8fafc] flex flex-col items-center relative">
          
          {transitDateLabel && (
            <div className="text-rose-700 font-bold text-lg mb-2 bg-rose-50 px-4 py-1 rounded shadow-sm">
               Transit Time: {transitDateLabel}
            </div>
          )}

          <div className="flex w-full mb-8 justify-around px-8 max-w-3xl">
            <div className="bg-white border border-gray-200 p-4 rounded-xl text-center w-48 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Deha (Body)</p>
              <p className="text-xl font-black text-rose-700">{data.deha_sign}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs font-bold text-black uppercase tracking-widest mb-1">Direction</p>
              <p className="text-lg font-black text-indigo-700">{data.direction}</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-xl text-center w-48 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Jiva (Soul)</p>
              <p className="text-xl font-black text-indigo-700">{data.jiva_sign}</p>
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="relative w-full flex justify-center overflow-visible my-10">
            <svg width="900" height="800" viewBox="0 0 800 800" style={{ backgroundColor: "hsla(0, 0%, 96%, 1.00)" }}>
              {renderWheel()}
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KalachakraViewer;
