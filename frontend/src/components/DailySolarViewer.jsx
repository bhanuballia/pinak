import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const DailySolarViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('worksheetData');
        let requestBody = {
          date: '2000-01-01',
          time: '12:00:00',
          lat: 28.6139,
          lon: 77.2090,
          tz_offset: 5.5,
          location_name: 'Delhi',
          name: 'bhanu'
        };

        if (storedData) {
          const parsed = JSON.parse(storedData);

          let pDate = '2000-01-01';
          let pTime = '12:00:00';
          let pLat = 28.6139;
          let pLon = 77.2090;
          let pTz = 5.5;
          let pLoc = 'Delhi';
          let pName = 'Native';

          if (parsed.basic_details && parsed.basic_details.birth_date) {
            pDate = parsed.basic_details.birth_date;
            pTime = parsed.basic_details.birth_time;
            pLat = parsed.basic_details.lat;
            pLon = parsed.basic_details.lon;
            pName = parsed.basic_details.name;
            pLoc = parsed.basic_details.birth_place;
          } else if (parsed.meta) {
            pDate = parsed.meta.date || parsed.meta.birth_date || '2000-01-01';
            pTime = parsed.meta.time || parsed.meta.birth_time || '12:00:00';
            pLat = parsed.meta.lat || 28.6139;
            pLon = parsed.meta.lon || 77.2090;
            pTz = parsed.meta.tz || 5.5;
            pName = parsed.meta.name || 'Native';
            pLoc = parsed.meta.location_name || parsed.meta.location || 'Delhi';
          } else if (parsed.basic) {
            pDate = parsed.basic.birth_date || '2000-01-01';
            pTime = parsed.basic.birth_time || '12:00:00';
            pLat = parsed.basic.lat || 28.6139;
            pLon = parsed.basic.lon || 77.2090;
            pTz = parsed.basic.tz_offset || 5.5;
            pLoc = parsed.basic.location || 'Delhi';
            pName = parsed.basic.name || 'Native';
          }

          requestBody = {
            date: pDate,
            time: pTime,
            lat: pLat,
            lon: pLon,
            tz_offset: pTz,
            location_name: pLoc,
            name: pName
          };
        }

        const response = await fetch('/api/solar_return/calculate_daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Daily Solar data');
        }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffcccc] text-black flex items-center justify-center font-serif">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-5xl mb-4">☀️</span>
          <p className="tracking-[0.2em] uppercase text-black">Initializing Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ffcccc] text-black flex items-center justify-center font-serif">
        <div className="text-center bg-red-100 p-8 rounded-2xl border border-red-300">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl text-red-800 mb-2 tracking-widest uppercase">Engine Error</h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { birth_chart, progression_charts, local_charts, user_info } = data;

  // Render a tiny title bar for each chart to match the image
  const ChartWrapper = ({ title, houses }) => (
    <div className="flex flex-col h-full bg-transparent p-1">
      {/* Pill-shaped title overlapping the chart border */}
      <div className="relative z-10 flex justify-start -mb-2.5 ml-2">
        <div className="bg-white border-[1.5px] border-[#0066cc] rounded-full px-3 py-0.5 text-[#0066cc] text-[10px] md:text-xs font-bold font-sans whitespace-nowrap overflow-hidden text-ellipsis shadow-sm">
          {title}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 bg-[#ffffe6] border-[1.5px] border-[#0066cc] p-1 pt-3 min-h-[200px] md:min-h-[180px] relative">
        <div className="absolute inset-0 pt-3 pb-1 px-1 z-0">
          <ZodiacChart houses={houses} hideTitle={true} variant="legacy" defaultRect={true} scaleText={1.8} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffcccc] flex flex-col font-sans">
      {/* Header matching Parashara Light style */}
      <div className="bg-white border-b border-black flex justify-between items-center px-2 py-0.5 text-[18px] text-black shadow-sm font-sans">
        <span>{user_info}</span>
        <span>Daily Solar Return </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-2 flex flex-col gap-2 max-w-[1400px] w-full mx-auto">

        {/* Row 1: Birth Chart */}
        <div className="flex w-full md:w-1/3">
          <div className="w-full">
            <ChartWrapper title={birth_chart.title} houses={birth_chart.houses} />
          </div>
        </div>

        {/* Row 2: Progression Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          {progression_charts.map((c, idx) => (
            <ChartWrapper key={idx} title={c.title} houses={c.houses} />
          ))}
        </div>

        {/* Row 3: Local Progression Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          {local_charts.map((c, idx) => (
            <ChartWrapper key={idx} title={c.title} houses={c.houses} />
          ))}
        </div>
      </div>

      {/* Footer matching Parashara Light style */}
      <div className="bg-[#ffffcc] border-t border-black px-2 py-1 text-xs text-black font-sans mt-auto">
        This worksheet shows the Daily progression chart and Local daily progression chart for yesterday, today and tomorrow.
      </div>
    </div>
  );
};

export default DailySolarViewer;
