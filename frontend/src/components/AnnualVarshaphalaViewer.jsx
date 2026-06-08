import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const AnnualVarshaphalaViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('worksheetData');

        let pDate = '2000-01-01';
        let pTime = '12:00:00';
        let pLat = 28.6139;
        let pLon = 77.2090;
        let pTz = 5.5;
        let pLoc = 'Delhi';
        let pName = 'Native';

        if (storedData) {
          const parsed = JSON.parse(storedData);

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
        }

        let requestBody = {
          date: pDate,
          time: pTime,
          lat: pLat,
          lon: pLon,
          tz_offset: pTz,
          location_name: pLoc,
          name: pName
        };

        const response = await fetch('http://localhost:8000/api/solar_return/calculate_annual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Annual Varshaphala data');
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

  const { birth_chart, annual_charts, user_info } = data;

  const ChartWrapper = ({ title, houses }) => (
    <div className="flex flex-col h-full bg-transparent p-1">
      <div className="relative z-10 flex justify-start -mb-2.5 ml-2">
        <div className="bg-white border-[1.5px] border-[#0066cc] rounded-full px-3 py-0.5 text-[#0066cc] text-[10px] md:text-xs font-bold font-sans whitespace-nowrap overflow-hidden text-ellipsis shadow-sm">
          {title}
        </div>
      </div>

      <div className="flex-1 bg-[#ffffe6] border-[1.5px] border-[#0066cc] p-1 pt-3 min-h-[200px] md:min-h-[240px] relative">
        <div className="absolute inset-0 pt-3 pb-1 px-1 z-0">
          <ZodiacChart houses={houses} hideTitle={true} variant="legacy" />
        </div>
      </div>
    </div>
  );

  const allCharts = [birth_chart, ...annual_charts];

  return (
    <div className="min-h-screen bg-[#ffcccc] flex flex-col font-sans">
      <div className="bg-white border-b border-black flex justify-between items-center px-2 py-0.5 text-xs text-black shadow-sm font-sans">
        <span>{user_info}</span>
        <span> Annual Varshaphala Overview</span>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-2 max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          {allCharts.map((c, idx) => (
            <ChartWrapper key={idx} title={c.title} houses={c.houses} />
          ))}
        </div>
      </div>

      <div className="bg-[#ffffcc] border-t border-black px-2 py-1 text-xs text-black font-sans mt-auto">
        [1 of 2] This worksheet gives an overview of 8 consecutive Local Varshaphala charts, starting with the one from 3 years back, up to the one for 4 years from now &gt;&gt;ws
      </div>
    </div>
  );
};

export default AnnualVarshaphalaViewer;
