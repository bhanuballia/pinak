import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const PLANET_COLORS = {
  Sun: "#dc2626", Moon: "#111827", Mars: "#ef4444", Mercury: "#16a34a",
  Jupiter: "#d97706", Venus: "#db2777", Saturn: "#2563eb", Rahu: "#4b5563",
  Ketu: "#92400e", Uranus: "#0891b2", Neptune: "#4f46e5", Pluto: "#7c3aed",
  Ascendant: "#000000", Lagna: "#000000"
};

export default function KPDataTable({ formData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData) fetchData();
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

  if (loading) return <div className="p-10 flex items-center justify-center text-red-800 font-serif font-bold text-xl">Loading KP Data...</div>;
  if (!data) return null;

  const getPlanetName = (pName) => {
    if (pName === 'Ascendant') return 'As';
    if (pName === 'Uranus') return 'Ur';
    if (pName === 'Neptune') return 'Ne';
    if (pName === 'Pluto') return 'Pl';
    return pName.substring(0, 2);
  }

  const getHouseName = (num) => {
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
    return `${ordinals[num - 1]} house`;
  }

  const renderTableRows = () => {
    const rows = [];

    // Add Planets
    data.planets.forEach((p, i) => {
      rows.push(
        <tr key={`p-${i}`} className={i % 2 === 0 ? "bg-white" : "bg-red-50/10"}>
          <td className="py-1 px-2 border-r text-red-900" style={{ color: PLANET_COLORS[p.planet] || "#7f1d1d" }}>{getPlanetName(p.planet)}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[p.star_lord] }}>{p.star_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[p.sub_lord] }}>{p.sub_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[p.sub_sub_lord] }}>{p.sub_sub_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[p.sookshma_lord] }}>{p.sookshma_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[p.praana_lord] }}>{p.praana_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[p.deha_lord] }}>{p.deha_lord?.substring(0, 2) || "-"}</td>
        </tr>
      );
    });

    // Add Houses
    data.cusps.forEach((c, i) => {
      rows.push(
        <tr key={`c-${i}`} className={(i + data.planets.length) % 2 === 0 ? "bg-white" : "bg-red-50/10"}>
          <td className="py-1 px-2 border-r text-red-900">{getHouseName(c.house)}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[c.star_lord] }}>{c.star_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[c.sub_lord] }}>{c.sub_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium" style={{ color: PLANET_COLORS[c.sub_sub_lord] }}>{c.sub_sub_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[c.sookshma_lord] }}>{c.sookshma_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 border-r text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[c.praana_lord] }}>{c.praana_lord?.substring(0, 2) || "-"}</td>
          <td className="py-1 px-2 text-blue-900 font-medium text-center" style={{ color: PLANET_COLORS[c.deha_lord] }}>{c.deha_lord?.substring(0, 2) || "-"}</td>
        </tr>
      );
    });

    return rows;
  };

  const vargas = formData?.vargas || {};
  const d1Houses = formData?.charts?.houses || formData?.chart?.houses || {};

  return (
    <div className="w-full h-full bg-[#f8f9fa] p-2 flex flex-col md:flex-row gap-2 font-sans text-[11px] overflow-hidden">

      {/* Left side: Charts */}
      <div className="w-full md:w-[45%] grid grid-cols-2 gap-2 h-fit">
        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">Rasi</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={d1Houses} hideTitle scaleText={1.8} /></div>
        </div>
        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">D-9</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={(vargas['d9'] || vargas['D9'])?.houses || {}} hideTitle scaleText={1.8} /></div>
        </div>

        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">D-10 (Trsh)</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={(vargas['d10'] || vargas['D10'])?.houses || {}} hideTitle scaleText={1.8} /></div>
        </div>
        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">D-20 (Trsh)</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={(vargas['d20'] || vargas['D20'])?.houses || {}} hideTitle scaleText={1.8} /></div>
        </div>

        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">D-7 (Trsh)</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={(vargas['d7'] || vargas['D7'])?.houses || {}} hideTitle scaleText={1.8} /></div>
        </div>
        <div className="bg-[#e4dfd3] border border-gray-400 p-1 flex flex-col relative aspect-square">
          <div className="text-[10px] text-gray-700 absolute top-0 left-1 z-10 bg-[#e4dfd3]/80 px-1">Natal Chart</div>
          <div className="text-[11px] text-black font-bold absolute top-0 right-1 z-10 bg-[#e4dfd3]/80 px-1">D-60 (Trsh)</div>
          <div className="flex-1 w-full h-full"><ZodiacChart houses={(vargas['d60'] || vargas['D60'])?.houses || {}} hideTitle scaleText={1.8} /></div>
        </div>
      </div>

      {/* Right side: KP Table */}
      <div className="w-full md:w-[55%] bg-white border border-gray-300 shadow-sm overflow-x-auto h-fit">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b">
              <th className="py-1.5 px-2 border-r font-normal text-black">Body/Cusp</th>
              <th className="py-1.5 px-2 border-r font-normal text-black">Nakshatra lord</th>
              <th className="py-1.5 px-2 border-r font-normal text-black">Sub lord</th>
              <th className="py-1.5 px-2 border-r font-normal text-black">Prati-sub</th>
              <th className="py-1.5 px-2 border-r font-normal text-black">Sookshma-sub</th>
              <th className="py-1.5 px-2 border-r font-normal text-black">Praana-sub</th>
              <th className="py-1.5 px-2 font-normal text-black">Deha-sub</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>

    </div>
  );
}
