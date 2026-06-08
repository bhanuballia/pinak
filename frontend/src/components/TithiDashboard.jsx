import React, { useEffect, useState } from "react";
import ZodiacChart from "./ZodiacChart";

export default function TithiDashboard({ data: inputData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inputData) {
      setLoading(false);
      return;
    }

    const b = inputData.basic_details || {};
    let tzOffset = inputData.tz_offset || 0;
    if (inputData.meta?.timezone && !inputData.tz_offset) {
      const match = inputData.meta.timezone.match(/UTC([+-])(\d+):(\d+)/);
      if (match) {
        tzOffset = parseFloat(match[2]) + parseFloat(match[3]) / 60.0;
        if (match[1] === '-') tzOffset = -tzOffset;
      }
    }

    const payload = {
      date: b.birth_date || inputData.date,
      time: b.birth_time || inputData.time,
      lat: b.lat || inputData.lat,
      lon: b.lon || inputData.lon,
      tz_offset: tzOffset,
      target_year: new Date().getFullYear() // Or a specific selected year
    };

    fetch("http://localhost:8000/api/tithi-pravesha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching Tithi Pravesha data:", err);
        setLoading(false);
      });
  }, [inputData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Calculating exact Tithi Pravesh moment...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <h3 className="text-lg font-bold text-red-700 mb-2">Missing Profile Data</h3>
        <p className="text-red-500">Please provide your birth details to generate the Tithi Pravesha report.</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-y-auto font-sans">

      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center mb-16 relative">
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl -z-10 opacity-70"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <span>{data.month_phase}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
          Your True Birthday for {new Date().getFullYear()} <br />
          <span className="text-orange-600 font-serif italic font-normal">falls on {data.true_birthday_display}</span>
        </h1>
        <p className="text-blue-500 mt-4 text-lg max-w-2xl">
          The exact moment the Sun and Moon return to the exact angular distance they held at your birth.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <div className="w-full flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-white px-8 py-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">
                Your Tithi Pravesh Report for This Year
              </h2>
            </div>

            <div className="p-8 pb-4 flex flex-col items-center border-b border-slate-100">
              <div className="w-full max-w-3xl bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Your Annual Tithi Return Chart</h3>
                <div className="flex-1 w-full relative min-h-[300px]">
                  <ZodiacChart houses={data.houses} variant="modern" hideLegend={true} scaleText={1.7} defaultRect={true} defaultLang="hi" />
                </div>
              </div>
            </div>

            <div className="p-8 pt-4">
              <div className="space-y-0 divide-y divide-orange-500">

                <DetailRow
                  label="Nakshatra"
                  value={data.nakshatra}
                  subtext="Lunar mansion at the exact moment of your annual return."
                />

                <DetailRow
                  label="Vedic Year (Samvatsara)"
                  value={data.samvatsara}
                  subtext="The cosmic cycle assigned to this particular year."
                />

                <DetailRow
                  label="Vaaresh (Lord of the Year)"
                  value={data.vaaresh}
                  highlight={true}
                  subtext="The ruler of the weekday. Controls the primary thematic energy of your year."
                />

                <DetailRow
                  label="Hora Lord at Tithi Pravesh"
                  value={data.hora_lord}
                  subtext="The planetary hour lord. Indicates where your focus and fortune will flow."
                />

                <DetailRow
                  label="Your Lagna Sign (This year)"
                  value={data.lagna_sign}
                  subtext="Your rising sign for the year, defining your physical self and new beginnings."
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, subtext, highlight = false }) {
  return (
    <div className={`py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${highlight ? 'bg-indigo-50/30 rounded-lg -mx-4 px-4' : ''}`}>
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-orange-500 uppercase tracking-wider">{label}</h3>
        {subtext && <p className="text-[12px] text-black mt-1">{subtext}</p>}
      </div>
      <div className="text-lg font-bold text-slate-800 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 min-w-[120px] text-center shadow-sm">
        {value}
      </div>
    </div>
  );
}
