import React, { useState, useEffect } from 'react';

const PLANET_COLORS = {
  Sun: "#dc2626",
  Moon: "#111827",
  Mars: "#ef4444",
  Mercury: "#16a34a",
  Jupiter: "#d97706",
  Venus: "#db2777",
  Saturn: "#2563eb",
  Rahu: "#4b5563",
  Ketu: "#92400e",
  Uranus: "#0891b2",
  Neptune: "#4f46e5",
  Pluto: "#7c3aed"
};

const formatDeg = (deg) => {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor((((deg - d) * 60) - m) * 60);
  return `${d} ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const dToDms = (deg) => {
  const signIdx = Math.floor(deg / 30);
  const signs = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
  const sign = signs[signIdx];
  const rem = deg % 30;
  const d = Math.floor(rem);
  const m = Math.floor((rem - d) * 60);
  const s = Math.floor((((rem - d) * 60) - m) * 60);
  return `${sign} ${d}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatAyanamsha = (deg) => {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor((((deg - d) * 60) - m) * 60);
  return `-${d}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function KrishanaMurthySignificators({ formData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData) {
      fetchData();
    }
  }, [formData]);

  const fetchData = async () => {
    try {
      let pDate = '2000-01-01';
      let pTime = '12:00:00';
      let pLat = 28.6139;
      let pLon = 77.2090;
      let pTz = 5.5;

      if (formData.basic_details && formData.basic_details.birth_date) {
        pDate = formData.basic_details.birth_date;
        pTime = formData.basic_details.birth_time;
        pLat = formData.basic_details.lat;
        pLon = formData.basic_details.lon;
      } else if (formData.meta) {
        pDate = formData.meta.date || formData.meta.birth_date || pDate;
        pTime = formData.meta.time || formData.meta.birth_time || pTime;
        pLat = formData.meta.lat || pLat;
        pLon = formData.meta.lon || pLon;
        pTz = formData.meta.tz || pTz;
      }

      const payload = {
        birth_date: pDate,
        birth_time: pTime.includes(":") && pTime.split(":").length === 2 ? pTime + ":00" : pTime,
        lat: parseFloat(pLat),
        lon: parseFloat(pLon),
        tz_offset: parseFloat(pTz),
      };

      const response = await fetch('/api/kp/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Loading KP Significators...</div>;
  }

  if (!data || !data.significators) return null;

  const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"];

  const renderPlanetList = (list) => {
    if (!list || list.length === 0) return "";
    return list.map(p => p.substring(0,2)).join(",");
  };
  
  const getPlanetColor = (pName) => {
    // If it's a short name, find full name
    const fullPlanet = data.planets.find(x => x.short_name === pName || x.planet === pName);
    return fullPlanet ? PLANET_COLORS[fullPlanet.planet] : "#000";
  };

  const getPlanetShort = (pName) => {
    const fullPlanet = data.planets.find(x => x.planet === pName);
    return fullPlanet ? fullPlanet.short_name : pName.substring(0, 2);
  };

  // Find Balance of Dasha from formData if possible
  let balDasha = "-";
  if (formData?.dasha?.vimshottari) {
      // Very basic extraction of the first period from the dasha report
      // If we don't have it, we'll just show the string
      balDasha = "Available in Dasha section";
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 md:p-8 border font-serif text-black">
      <h2 className="text-xl md:text-2xl text-red-700 text-center mb-6 pb-2 border-b-2 border-red-700 font-bold">
        Krishnamurti Paddhati
      </h2>

      {/* House Significators */}
      <h3 className="text-center text-red-700 font-bold mb-4 text-lg">Significations of the Houses</h3>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-t-2 border-b-2 border-red-700 text-center">
          <thead>
            <tr className="border-b border-gray-400 bg-orange-100">
              <th className="py-2 px-2 text-left w-24">House</th>
              <th className="py-2 px-2">Planets in nak.<br/>of occupants</th>
              <th className="py-2 px-2">Occupants</th>
              <th className="py-2 px-2">Planets in nak.<br/>of cusp sign lord</th>
              <th className="py-2 px-2">Cusp sign lord</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => {
              const sig = data.significators[h] || { A: [], B: [], C: [], D: [] };
              
              return (
                <tr key={h} className="">
                  <td className="py-1 px-2 text-left">{h}. {ordinals[h-1]}</td>
                  <td className="py-1 px-2">{sig.A.map((p,i) => <span key={i} style={{color: getPlanetColor(p)}}>{getPlanetShort(p)}{i < sig.A.length-1 ? ',' : ''}</span>)}</td>
                  <td className="py-1 px-2">{sig.B.map((p,i) => <span key={i} style={{color: getPlanetColor(p)}}>{getPlanetShort(p)}{i < sig.B.length-1 ? ',' : ''}</span>)}</td>
                  <td className="py-1 px-2">{sig.C.map((p,i) => <span key={i} style={{color: getPlanetColor(p)}}>{getPlanetShort(p)}{i < sig.C.length-1 ? ',' : ''}</span>)}</td>
                  <td className="py-1 px-2">{sig.D.map((p,i) => <span key={i} style={{color: getPlanetColor(p)}}>{getPlanetShort(p)}{i < sig.D.length-1 ? ',' : ''}</span>)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Planet Significators */}
      <h3 className="text-center text-red-700 font-bold mb-4 text-lg">Houses Signified by Planets</h3>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-t-2 border-b-2 border-red-700 text-center">
          <thead>
            <tr className="border-b border-gray-400 bg-orange-100">
              <th className="py-2 px-2 text-left w-24">Planet</th>
              <th colSpan="4" className="py-1 border-b border-gray-400">Planets as significators of houses</th>
            </tr>
            <tr className="border-b border-gray-400 bg-orange-100">
              <th className="py-2 px-2"></th>
              <th className="py-2 px-2 w-1/4">Very strong<br/>significator</th>
              <th className="py-2 px-2 w-1/4">Strong<br/>significator</th>
              <th className="py-2 px-2 w-1/4">Normal<br/>significator</th>
              <th className="py-2 px-2 w-1/4">Weak<br/>significator</th>
            </tr>
          </thead>
          <tbody>
            {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map(p => {
              const sig = data.planet_significators[p] || { A: [], B: [], C: [], D: [] };
              return (
                <tr key={p}>
                  <td className="py-1 px-2 text-left font-bold" style={{color: PLANET_COLORS[p]}}>{p}</td>
                  <td className="py-1 px-2">{sig.A.join(" ")}</td>
                  <td className="py-1 px-2">{sig.B.join(" ")}</td>
                  <td className="py-1 px-2">{sig.C.join(" ")}</td>
                  <td className="py-1 px-2">{sig.D.join(" ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ruling Planets & Info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-center text-red-700 font-bold mb-2 border-b border-red-700 pb-1">Ruling Planets</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1">Day lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.day_lord)}}>{data.ruling_planets.day_lord}</span></td></tr>
              <tr><td className="py-1">Lagna lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.lagna_lord)}}>{data.ruling_planets.lagna_lord}</span></td></tr>
              <tr><td className="py-1">Lagna Nak Lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.lagna_nak_lord)}}>{data.ruling_planets.lagna_nak_lord}</span></td></tr>
              <tr><td className="py-1">Lagna Sub Lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.lagna_sub_lord)}}>{data.ruling_planets.lagna_sub_lord}</span></td></tr>
              <tr><td className="py-1">Moon Rashi lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.moon_rashi_lord)}}>{data.ruling_planets.moon_rashi_lord}</span></td></tr>
              <tr><td className="py-1">Moon Nak. lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.moon_nak_lord)}}>{data.ruling_planets.moon_nak_lord}</span></td></tr>
              <tr><td className="py-1">Moon Sub lord</td><td className="py-1">: <span className="font-bold" style={{color: getPlanetColor(data.ruling_planets.moon_sub_lord)}}>{data.ruling_planets.moon_sub_lord}</span></td></tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1 mt-6 md:mt-0 md:pl-8">
            <div className="border-t border-red-700 md:border-none pt-4 md:pt-8 h-full flex flex-col justify-end">
                <table className="w-full text-sm">
                    <tbody>
                    <tr><td className="py-1">Fortuna</td><td className="py-1">: {dToDms(data.fortuna)}</td></tr>
                    <tr><td className="py-1">Bal. of dasha</td><td className="py-1">: {balDasha}</td></tr>
                    <tr><td className="py-1">KP Ayanamsha</td><td className="py-1">: {formatAyanamsha(data.ayanamsha)}</td></tr>
                    </tbody>
                </table>
                <div className="border-b border-red-700 mt-2"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
