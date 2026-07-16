import React, { useState, useEffect } from 'react';
import KPChart from './KPChart';

const KPChartViewer = ({ formData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [formData]);

  const fetchData = async () => {
    if (!formData) return;
    setLoading(true);

    let pDate = '2000-01-01';
    let pTime = '12:00:00';
    let pLat = 28.6139;
    let pLon = 77.2090;
    let pTz = 5.5;
    let pName = 'Native';
    let pLoc = 'Delhi, India';

    if (formData.basic_details && formData.basic_details.birth_date) {
      pDate = formData.basic_details.birth_date;
      pTime = formData.basic_details.birth_time;
      pLat = formData.basic_details.lat;
      pLon = formData.basic_details.lon;
      pName = formData.basic_details.name || 'Native';
      pLoc = formData.basic_details.birth_place || pLoc;
    } else if (formData.meta) {
      pDate = formData.meta.date || formData.meta.birth_date || '2000-01-01';
      pTime = formData.meta.time || formData.meta.birth_time || '12:00:00';
      pLat = formData.meta.lat || 28.6139;
      pLon = formData.meta.lon || 77.2090;
      pTz = formData.meta.tz || 5.5;
      pName = formData.meta.name || 'Native';
      pLoc = formData.meta.location_name || pLoc;
    } else if (formData.basic) {
      pDate = formData.basic.birth_date || '2000-01-01';
      pTime = formData.basic.birth_time || '12:00:00';
      pLat = formData.basic.lat || 28.6139;
      pLon = formData.basic.lon || 77.2090;
      pTz = formData.basic.tz_offset || 5.5;
      pName = formData.basic.name || 'Native';
      pLoc = formData.basic.location || pLoc;
    } else if (formData.dob) {
      pDate = formData.dob;
      pTime = formData.tob || "00:00:00";
      pLat = formData.lat;
      pLon = formData.lon;
      pTz = formData.tz || 5.5;
      pName = formData.name || 'Native';
    } else {
      setLoading(false);
      return;
    }

    try {
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

      if (!response.ok) throw new Error("Failed to fetch KP data");
      const result = await response.json();
      result.name = pName;
      result.dob = pDate;
      result.tob = pTime;
      result.lat = pLat;
      result.lon = pLon;
      result.tz = pTz;
      result.loc = pLoc;
      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error calculating KP chart. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData || (!formData.dob && !formData.basic_details && !formData.meta && !formData.basic)) {
    return <div className="bg-white min-h-screen text-black p-6 font-sans">Please fill out the birth details form first to view the KP Chart.</div>;
  }

  const formatDeg = (deg) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor((((deg - d) * 60) - m) * 60);
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatDegOnly = (deg) => {
    const signRem = deg % 30;
    return formatDeg(signRem);
  };

  const getPlanetColor = (planet) => {
    const colors = {
      "Sun": "#cc0000", "Su": "#cc0000",
      "Moon": "#333333", "Mo": "#333333",
      "Mars": "#ff0000", "Ma": "#ff0000",
      "Mercury": "#009900", "Me": "#009900",
      "Jupiter": "#ff8c00", "Ju": "#ff8c00",
      "Venus": "#cc00cc", "Ve": "#cc00cc",
      "Saturn": "#0000ff", "Sa": "#0000ff",
      "Rahu": "#666666", "Ra": "#666666",
      "Ketu": "#666666", "Ke": "#666666"
    };
    return colors[planet] || "#333";
  };

  return (
    <div className="bg-[#ffcccc] min-h-screen font-sans flex flex-col p-2 gap-2 text-xs">
      {error && <div className="bg-red-100 text-red-800 p-4 border border-red-300">{error}</div>}

      {!data && loading && (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <span className="text-4xl">⏳</span>
            <span className="mt-4 text-black font-serif">Calculating Placidus Houses...</span>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="flex flex-col md:flex-row gap-2 h-[700px]">
            {/* Top Left: Chart */}
            <div className="w-full md:w-2/3 bg-[#ffffe6] border-2 border-[#0000aa] rounded flex flex-col relative overflow-hidden p-2">
              <div className="absolute top-0 left-0 bg-white border border-[#0000aa] rounded-br px-2 py-0.5 text-[#0000aa] font-serif font-bold text-sm">
                Krishnamurti chart
              </div>
              <div className="flex-1 flex justify-center items-center mt-6">
                <KPChart cusps={data.cusps} planets={data.planets} />
              </div>
            </div>

            {/* Top Right: Tables */}
            <div className="w-full md:w-2/3 flex flex-col gap-2">
              {/* Basic Planet Table */}
              <div className="bg-[#ffffe6] border-2 border-[#0000aa] rounded flex flex-col relative overflow-hidden flex-1">
                <div className="bg-white border-b border-[#0000aa] px-2 py-0.5 text-[#0000aa] font-serif font-bold text-sm">
                  Krishnamurti chart
                </div>
                <div className="p-2 overflow-auto">
                  <table className="w-full text-left font-serif">
                    <tbody>
                      {data.planets.map((p, i) => {
                        if (p.planet === "Ascendant") return null;
                        return (
                          <tr key={i}>
                            <td style={{ color: getPlanetColor(p.short_name) }} className="font-bold w-6">{p.short_name}</td>
                            <td className="w-20">{formatDegOnly(p.longitude)}</td>
                            <td className="w-10">{p.sign_name.substring(0, 3)}</td>
                            <td className="w-16">{p.nak_name.substring(0, 7)}.</td>
                            <td className="w-10">...</td>
                            <td className="w-24">1.{p.sign_lord.substring(0, 2)}/{p.star_lord.substring(0, 2)}/{p.sub_lord.substring(0, 2)}</td>
                            <td>Neutr.</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KP Grahas Table */}
              <div className="bg-[#ffffe6] border-2 border-[#0000aa] rounded flex flex-col relative overflow-hidden flex-1">
                <div className="bg-white border-b border-[#0000aa] px-2 py-0.5 text-[#0000aa] font-serif font-bold text-sm">
                  Krishnamurti chart KP Grahas
                </div>
                <div className="p-1 overflow-auto">
                  <table className="w-full text-left font-serif text-[11px]">
                    <thead>
                      <tr className="border-b border-[#0000aa]">
                        <th className="text-[16px] fontweight-medium py-1">Graha</th>
                        <th className="text-[14px] fontweight-medium py-1">Lord/Sub/SS</th>
                        <th className="text-[14px] fontweight-medium py-1">V.Strong</th>
                        <th className="text-[14px] fontweight-medium py-1 text-center">Strong Sig.</th>
                        <th className="text-[14px] fontweight-medium py-1 text-center">Normal Sig.</th>
                        <th className="text-[14px] fontweight-medium py-1 text-center">Weak Sig.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.planets.map((p, i) => {
                        if (p.planet === "Ascendant") return null;
                        // Mocking significator strength mapping based on standard KP logic for UI
                        // Usually: V.Strong = Tenant of House, Strong = Occupant, etc.
                        return (
                          <tr key={i}>
                            <td style={{ color: getPlanetColor(p.short_name) }} className="font-bold">{p.short_name}</td>
                            <td>
                              <span style={{ color: getPlanetColor(p.sign_lord.substring(0, 2)) }}>{p.sign_lord.substring(0, 2)}</span> / <span style={{ color: getPlanetColor(p.star_lord.substring(0, 2)) }}>{p.star_lord.substring(0, 2)}</span> / <span style={{ color: getPlanetColor(p.sub_lord.substring(0, 2)) }}>{p.sub_lord.substring(0, 2)}</span>
                            </td>
                            <td></td>
                            <td className="text-center text-[#0000aa]">6</td>
                            <td className="text-center text-[#0000aa]">9</td>
                            <td className="text-center text-[#0000aa]">4</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 mt-2">
            {/* Bottom Left: Birth Data */}
            <div className="w-full md:w-1/4 bg-[#ffffe6] border-2 border-[#0000aa] rounded flex flex-col relative overflow-hidden min-h-[150px]">
              <div className="bg-white border-b border-[#0000aa] px-2 py-0.5 text-[#0000aa] font-serif font-bold text-sm">
                Birth data
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center font-serif leading-tight">
                <span className="font-bold">{data.name}</span>
                <span>{data.dob}</span>
                <span>{data.tob}</span>
                <span>{data.loc}</span>
                <span>Timezone: {data.tz}</span>
                <span>Latitude: {data.lat}</span>
                <span>Longitude: {data.lon}</span>
              </div>
            </div>

            {/* Bottom Right: KP Significators */}
            <div className="w-full md:w-3/4 bg-[#ffffe6] border-2 border-[#0000aa] rounded flex flex-col relative overflow-hidden">
              <div className="bg-white border-b border-[#0000aa] px-2 py-0.5 text-[#0000aa] font-serif font-bold text-sm">
                Krishnamurti chart KP significators
              </div>
              <div className="p-1 overflow-auto">
                <table className="w-full text-left font-serif text-[11px]">
                  <thead>
                    <tr className="border-b border-[#0000aa]">
                      <th className="py-1">Bhava</th>
                      <th className="py-1">Cusp</th>
                      <th className="py-1">Lord/Sub/SS</th>
                      <th className="py-1 text-center">Tenants (Occupants)</th>
                      <th className="py-1 text-center">Occupants</th>
                      <th className="py-1 text-center">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cusps.map((c, i) => {
                      const occupants = data.occupants[c.house] || [];
                      return (
                        <tr key={i}>
                          <td className="text-[#0000aa] font-bold">{c.house}st h.</td>
                          <td>{formatDegOnly(c.longitude)} {c.sign_name.substring(0, 3)}</td>
                          <td>
                            <span style={{ color: getPlanetColor(c.sign_lord.substring(0, 2)) }}>{c.sign_lord.substring(0, 2)}</span> / <span style={{ color: getPlanetColor(c.star_lord.substring(0, 2)) }}>{c.star_lord.substring(0, 2)}</span> / <span style={{ color: getPlanetColor(c.sub_lord.substring(0, 2)) }}>{c.sub_lord.substring(0, 2)}</span>
                          </td>
                          <td className="text-center">{occupants.join(", ")}</td>
                          <td className="text-center">{occupants.join(", ")}</td>
                          <td className="text-center font-bold" style={{ color: getPlanetColor(c.sign_lord.substring(0, 2)) }}>{c.sign_lord.substring(0, 2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="bg-[#ffff99] border-t border-black p-2 text-xs text-black font-sans mt-auto">
        The Krishnamurti chart is based on the Placidius house system. Because of the importance of the cusps and Nakshatras, the chart is shown in this unique circular format. On the next worksheet you can see the same chart in the traditional chart style.
      </div>
    </div>
  );
};

export default KPChartViewer;
