import React, { useState, useEffect } from 'react';

const VarshaphalaDetailsViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('worksheetData');
        if (!storedData) throw new Error("No worksheet data found.");

        const parsedData = JSON.parse(storedData);
        
        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;
        let pName = 'Native';

        if (parsedData.basic_details && parsedData.basic_details.birth_date) {
            pDate = parsedData.basic_details.birth_date;
            pTime = parsedData.basic_details.birth_time;
            pLat = parsedData.basic_details.lat;
            pLon = parsedData.basic_details.lon;
            pName = parsedData.basic_details.name;
        } else if (parsedData.meta) {
            pDate = parsedData.meta.date || '2000-01-01';
            pTime = parsedData.meta.time || '12:00:00';
            pLat = parsedData.meta.lat || 28.6139;
            pLon = parsedData.meta.lon || 77.2090;
            pTz = parsedData.meta.tz || 5.5;
            pName = parsedData.meta.name || 'Native';
        }

        const payload = {
          date: pDate,
          time: pTime,
          lat: parseFloat(pLat),
          lon: parseFloat(pLon),
          tz_offset: parseFloat(pTz),
          years: 1,
          start_age: startAge
        };

        const response = await fetch('http://localhost:8000/api/solar_return/annual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to fetch Varshaphala details.");

        const result = await response.json();
        if (!result.charts || result.charts.length === 0) {
          throw new Error("No data returned from server.");
        }

        setData({
          name: pName,
          birth_details: result.birth_details,
          varshaphala_details: result.charts[0].varshaphala_details,
          running_year: startAge,
          passed_year: startAge - 1
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startAge]);

  const handleDownload = () => {
    const el = document.getElementById('varshaphala-table-capture');
    html2canvas(el, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Varshaphala_Details_Age_${startAge}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-rose-800 text-lg">Calculating Astronomical Details...</div>;
  if (error) return <div className="p-8 text-center text-red-600 text-lg">Error: {error}</div>;
  if (!data) return null;

  const b = data.birth_details;
  const v = data.varshaphala_details;

  const rows = [
    { label: "Sex", birth: "Male", varsh: "" },
    { label: "Date of birth", birth: b.date_of_birth, varsh: v.date_of_birth },
    { label: "Day of birth", birth: b.day_of_birth, varsh: v.day_of_birth },
    { label: "Time of birth", birth: b.time_of_birth, varsh: v.time_of_birth },
    { label: "Ishtkaal", birth: b.ishtkaal, varsh: v.ishtkaal },
    { label: "Latitude", birth: b.latitude, varsh: v.latitude },
    { label: "Longitude", birth: b.longitude, varsh: v.longitude },
    { label: "Time zone", birth: b.time_zone, varsh: v.time_zone },
    { label: "War/daylight corr.", birth: b.war_daylight_corr, varsh: v.war_daylight_corr },
    { label: "Ayanamsha", birth: b.ayanamsha, varsh: v.ayanamsha },
    { label: "Sunrise time", birth: b.sunrise_time, varsh: v.sunrise_time },
    { label: "Sunset time", birth: b.sunset_time, varsh: v.sunset_time },
    { label: "spacer", birth: "", varsh: "" },
    { label: "Lagna (Ascendant)", birth: b.lagna, varsh: v.lagna },
    { label: "Lagnesh (Asc. lord)", birth: b.lagnesh, varsh: v.lagnesh, bColor: "text-green-600", vColor: "text-blue-600" },
    { label: "Rashi (Moon's sign)", birth: b.rashi, varsh: v.rashi },
    { label: "Rashish (Moon sign lord)", birth: b.rashish, varsh: v.rashish, bColor: "text-green-600", vColor: "text-green-600" },
    { label: "Nakshatra", birth: b.nakshatra, varsh: v.nakshatra },
    { label: "Nakshatra lord", birth: b.nakshatra_lord, varsh: v.nakshatra_lord, vColor: "text-red-600" },
    { label: "Pada", birth: b.pada, varsh: v.pada },
    { label: "Yoga", birth: b.yoga, varsh: v.yoga },
    { label: "Tithi", birth: b.tithi, varsh: v.tithi },
    { label: "Karana", birth: b.karana, varsh: v.karana },
    { label: "spacer", birth: "", varsh: "" },
    { label: "Varna", birth: b.varna, varsh: v.varna },
    { label: "Vashya", birth: b.vashya, varsh: v.vashya },
    { label: "Yoni", birth: b.yoni, varsh: v.yoni },
    { label: "Gana", birth: b.gana, varsh: v.gana },
    { label: "Nadi", birth: b.nadi, varsh: v.nadi },
    { label: "Varga", birth: b.varga, varsh: v.varga },
    { label: "spacer", birth: "", varsh: "" },
    { label: "Naamakshar", birth: b.naamakshar, varsh: v.naamakshar },
    { label: "Paya(Rashi)", birth: b.paya_rashi, varsh: v.paya_rashi },
    { label: "Paya(Nakshatra)", birth: b.paya_nakshatra, varsh: v.paya_nakshatra },
    { label: "Sunsign(western)", birth: b.sunsign_western, varsh: v.sunsign_western },
    { label: "spacer", birth: "", varsh: "" },
    { label: "Balance of dasha", birth: b.balance_of_dasha, varsh: "" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl flex flex-col print:shadow-none">
        {/* Header Actions */}
        <div className="bg-white border-b border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 shadow-sm font-sans mb-4 print:hidden">
          <div className="flex items-center text-sm text-black mb-2 md:mb-0">
            <span className="font-semibold text-rose-800">{data.name}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span>Varshaphala Details</span>
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
            <button onClick={handleDownload} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded border border-slate-300 transition-colors">
              Save PNG
            </button>
            <button onClick={handlePrint} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded border border-blue-200 transition-colors">
              Print
            </button>
          </div>
        </div>

        {/* Capture Area */}
        <div id="varshaphala-table-capture" className="bg-white p-6 md:p-10 border-2 border-red-600 m-2 mt-0 relative">

          <h1 className="text-center text-xl text-red-700 font-serif font-bold mb-3 tracking-wide">
            Varshaphala
          </h1>

          <div className="bg-[#fdf0cc] border border-red-600 flex justify-between items-center px-3 py-1 mb-6 text-red-800 font-bold font-serif shadow-sm">
            <span>Varshaphala for {data.running_year === 1 ? v.date_of_birth.split(" ")[2] : `${v.date_of_birth.split(" ")[2]}-${parseInt(v.date_of_birth.split(" ")[2]) + 1}`}</span>
            <span>Passed year : {data.passed_year} • Running year : {data.running_year}</span>
          </div>

          <div className="grid grid-cols-12 gap-4 text-[13px] font-serif leading-tight">

            {/* Headers */}
            <div className="col-span-4 border-b border-red-600 pb-1"></div>
            <div className="col-span-4 border-b border-red-600 pb-1 text-red-700 font-bold text-[15px] text-center">Birth Details</div>
            <div className="col-span-4 border-b border-red-600 pb-1 text-red-700 font-bold text-[15px] text-center">Varshaphala Details*</div>

            <div className="col-span-8 -mt-3 text-[9px] text-right italic text-gray-600 pr-2"></div>
            <div className="col-span-4 -mt-3 text-[9px] italic text-gray-800">*Based on True solar return.</div>

            {/* Rows */}
            {rows.map((r, i) => {
              if (r.label === "spacer") {
                return <div key={i} className="col-span-12 h-4"></div>;
              }
              return (
                <React.Fragment key={i}>
                  <div className="col-span-4 text-gray-900 pr-2">{r.label}</div>
                  <div className="col-span-1 text-center">:</div>
                  <div className={`col-span-3 ${r.bColor || 'text-black'}`}>{r.birth}</div>
                  <div className={`col-span-4 pl-4 ${r.vColor || 'text-black'}`}>{r.varsh}</div>
                </React.Fragment>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
};

export default VarshaphalaDetailsViewer;
