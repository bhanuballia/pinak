import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';
import ZodiacVrasphalChart from './ZodiacVrasphalChart';

const PLANET_COLORS = {
  Sun: "#dc2626", // red
  Moon: "#000000",
  Mars: "#dc2626", // red
  Mercury: "#16a34a", // green
  Jupiter: "#f59e0b", // yellow-orange
  Venus: "#d946ef", // pink/magenta
  Saturn: "#2563eb", // blue
  Rahu: "#000000",
  Ketu: "#000000"
};

const AnnualVarshaphalaViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startAge, setStartAge] = useState(1);
  const [inputAge, setInputAge] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem('worksheetData');
        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;
        let pName = 'Native';

        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (parsed.basic_details && parsed.basic_details.birth_date) {
            pDate = parsed.basic_details.birth_date;
            pTime = parsed.basic_details.birth_time;
            pLat = parsed.basic_details.lat;
            pLon = parsed.basic_details.lon;
            pName = parsed.basic_details.name;
          } else if (parsed.meta) {
            pDate = parsed.meta.date || '2000-01-01';
            pTime = parsed.meta.time || '12:00:00';
            pLat = parsed.meta.lat || 28.6139;
            pLon = parsed.meta.lon || 77.2090;
            pTz = parsed.meta.tz || 5.5;
            pName = parsed.meta.name || 'Native';
          }
        }

        const requestBody = {
          date: pDate,
          time: pTime,
          lat: pLat,
          lon: pLon,
          tz_offset: pTz,
          years: 6,
          start_age: startAge
        };

        const response = await fetch('http://localhost:8000/api/solar_return/annual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Annual Varshaphala data');
        }

        const result = await response.json();
        setData({ name: pName, charts: result.charts });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startAge]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-serif">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-5xl mb-4 text-red-600">ॐ</span>
          <p className="tracking-[0.2em] uppercase text-black">Calculating Solar Returns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-serif">
        <div className="text-center bg-red-50 p-8 rounded border border-red-300">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl text-red-800 mb-2 tracking-widest uppercase">Engine Error</h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { name, charts } = data;

  const formatDegree = (deg) => {
    const d = Math.floor(deg % 30);
    const m = Math.floor((deg % 1) * 60);
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const VarshaphalaCard = ({ age, return_date_utc, chartsData, planets, muntha }) => {
    // Organize planets for the grid below chart (4 rows, 3 cols)
    const pDict = {};
    planets.forEach(p => pDict[p.planet] = p);

    // Add Ascendant
    pDict["As"] = { degree: chartsData.ascendant || 0 };

    // Inject "Ascendant" into the first house so it renders on the chart as "As"
    const modifiedHouses = JSON.parse(JSON.stringify(chartsData.charts.houses || {}));
    if (modifiedHouses["1"]) {
      if (!modifiedHouses["1"].planets) modifiedHouses["1"].planets = [];
      modifiedHouses["1"].planets.push("Ascendant");
    }

    return (
      <div className="flex flex-col items-center mb-8 px-2">
        <div className="text-center mb-1">
          <p className="text-sm font-serif text-black">Completed : {age} year{age > 1 ? 's' : ''}</p>
          <p className="text-sm font-serif text-black">{return_date_utc}</p>
        </div>

        <div className="w-full max-w-[550px] border-2 border-blue-900 mb-2 relative" style={{ aspectRatio: '1.6/1' }}>
          <div className="absolute inset-0 bg-[#fffff8]">
            <ZodiacVrasphalChart houses={modifiedHouses} hideTitle={true} variant="legacy" defaultRect={true} aspectRatio={1.6} scaleText={1.5} hideOuterRect={false} />
          </div>
        </div>

        <div className="w-full max-w-[600px] border-b border-red-600 pb-1 font-serif text-[14px] leading-tight">
          <div className="grid grid-cols-4 gap-x-2 gap-y-0 text-left">
            <div><span className="text-slate-600">As</span> {formatDegree(pDict["As"]?.degree || 0)}</div>
            <div><span style={{ color: PLANET_COLORS.Mars }}>Ma</span> {formatDegree(pDict["Mars"]?.degree || 0)}</div>
            <div><span style={{ color: PLANET_COLORS.Venus }}>Ve</span> {formatDegree(pDict["Venus"]?.degree || 0)}</div>
            <div><span style={{ color: PLANET_COLORS.Jupiter }}>Ju</span> {formatDegree(pDict["Jupiter"]?.degree || 0)}</div>

            <div><span style={{ color: PLANET_COLORS.Sun }}>Su</span> {formatDegree(pDict["Sun"]?.degree || 0)}</div>
            <div><span style={{ color: PLANET_COLORS.Mercury }}>Me</span> {formatDegree(pDict["Mercury"]?.degree || 0)}</div>
            <div><span style={{ color: PLANET_COLORS.Saturn }}>Sa</span> {formatDegree(pDict["Saturn"]?.degree || 0)}</div>
            <div></div>

            <div><span style={{ color: PLANET_COLORS.Moon }}>Mo</span> {formatDegree(pDict["Moon"]?.degree || 0)}</div>
            <div></div>
            <div><span style={{ color: PLANET_COLORS.Rahu }}>Ra</span> {formatDegree(pDict["Rahu"]?.degree || 0)}</div>
            <div></div>

            <div><span className="text-slate-800">YL</span> <span style={{ color: PLANET_COLORS.Sun }}>Pending</span></div>
            <div className="col-span-3"><span className="text-slate-800">Mun</span> {muntha?.sign || ""}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaf5] flex flex-col font-serif px-2 md:px-8 py-4">
      {/* Header matching image */}
      <div className="relative border border-red-500 rounded-xl p-4 bg-white shadow-sm mt-8">

        {/* Om Symbol Top Center */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-2 border-red-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui' }}>ॐ</span>
        </div>
        <div className="absolute -top-[34px] left-1/2 transform -translate-x-1/2 w-[68px] h-[68px] border-b-4 border-red-600 rounded-full opacity-50"></div>

        <div className="bg-white border-b border-gray-300 flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 shadow-sm font-sans mb-6 mt-4">
          <div className="flex items-center text-sm text-black mb-2 md:mb-0">
            <span className="font-semibold text-lg">{data.name}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-600">Varshaphala Charts</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-black ml-0 md:ml-4 bg-gray-50 px-3 py-1.5 rounded border border-gray-200 shadow-inner">
            <label htmlFor="ageInput" className="font-medium whitespace-nowrap text-gray-700">Start Age:</label>
            <input
              id="ageInput"
              type="number"
              min="1"
              max="120"
              className="w-16 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
              value={inputAge}
              onChange={(e) => setInputAge(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(inputAge, 10);
                  if (!isNaN(val) && val > 0) setStartAge(val);
                }
              }}
            />
            <button
              onClick={() => {
                const val = parseInt(inputAge, 10);
                if (!isNaN(val) && val > 0) setStartAge(val);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {charts.map((c, idx) => (
            <VarshaphalaCard
              key={idx}
              age={c.age}
              return_date_utc={c.return_date_utc}
              chartsData={c}
              planets={c.planets}
              muntha={c.muntha}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualVarshaphalaViewer;
