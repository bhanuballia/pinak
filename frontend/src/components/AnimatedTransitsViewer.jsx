import React, { useState, useEffect } from 'react';
import CircularTransitChart from './CircularTransitChart';

const AnimatedTransitsViewer = ({ formData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Animation state
  const [transitDate, setTransitDate] = useState(new Date());
  const [stepUnit, setStepUnit] = useState('day');
  const [stepValue, setStepValue] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [transitDate]);

  useEffect(() => {
    let interval = null;
    if (isAnimating) {
      interval = setInterval(() => {
        handleStep(1);
      }, 1500); // Step every 1.5s while animating
    } else if (!isAnimating && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAnimating, transitDate, stepUnit, stepValue]);

  const fetchData = async () => {
    if (!formData) return;
    setLoading(true);
    
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
      pDate = formData.meta.date || formData.meta.birth_date || '2000-01-01';
      pTime = formData.meta.time || formData.meta.birth_time || '12:00:00';
      pLat = formData.meta.lat || 28.6139;
      pLon = formData.meta.lon || 77.2090;
      pTz = formData.meta.tz || 5.5;
    } else if (formData.basic) {
      pDate = formData.basic.birth_date || '2000-01-01';
      pTime = formData.basic.birth_time || '12:00:00';
      pLat = formData.basic.lat || 28.6139;
      pLon = formData.basic.lon || 77.2090;
      pTz = formData.basic.tz_offset || 5.5;
    } else if (formData.dob) {
      pDate = formData.dob;
      pTime = formData.tob || "00:00:00";
      pLat = formData.lat;
      pLon = formData.lon;
      pTz = formData.tz || 5.5;
    } else {
      setLoading(false);
      return; // Cannot parse
    }
    
    try {
      const year = transitDate.getFullYear();
      const month = String(transitDate.getMonth() + 1).padStart(2, '0');
      const day = String(transitDate.getDate()).padStart(2, '0');
      const t_date = `${year}-${month}-${day}`;
      
      const hours = String(transitDate.getHours()).padStart(2, '0');
      const mins = String(transitDate.getMinutes()).padStart(2, '0');
      const secs = String(transitDate.getSeconds()).padStart(2, '0');
      const t_time = `${hours}:${mins}:${secs}`;
      
      const payload = {
        birth_date: pDate,
        birth_time: pTime.includes(":") && pTime.split(":").length === 2 ? pTime + ":00" : pTime,
        lat: parseFloat(pLat),
        lon: parseFloat(pLon),
        tz_offset: parseFloat(pTz),
        transit_date: t_date,
        transit_time: t_time
      };

      const response = await fetch('/api/transit/animated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error("Failed to fetch transit data");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error calculating transits. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep = (direction) => {
    setTransitDate(prevDate => {
      const newDate = new Date(prevDate);
      const amount = direction * stepValue;
      if (stepUnit === 'day') newDate.setDate(newDate.getDate() + amount);
      if (stepUnit === 'month') newDate.setMonth(newDate.getMonth() + amount);
      if (stepUnit === 'year') newDate.setFullYear(newDate.getFullYear() + amount);
      return newDate;
    });
  };

  if (!formData || (!formData.dob && !formData.basic_details && !formData.meta && !formData.basic)) {
    return <div className="bg-[#0f0f1a] min-h-screen text-white p-6 font-sans">Please fill out the birth details form first to view Animated Transits.</div>;
  }

  // Find Ascendant index
  const asc = data?.birth_chart?.find(p => p.planet === "As");
  const ascSignStr = asc?.rashi;
  const signs = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
  const ascIndex = signs.indexOf(ascSignStr);

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white p-6 font-sans">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center bg-[#1a1a2e] p-4 rounded-lg border border-[#333]">
        <div>
          <h1 className="text-2xl font-bold text-[#00ffcc]">Animated Transits (Gochara)</h1>
          <p className="text-gray-400 text-sm">Inner: Birth Chart • Outer: Transits</p>
        </div>
        
        {/* Animation Controls */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={() => handleStep(-1)}
            className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-white text-lg font-bold"
          >
            -
          </button>
          
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-4 py-1 rounded text-white font-bold ${isAnimating ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isAnimating ? 'Stop' : 'Animate'}
          </button>
          
          <button 
            onClick={() => handleStep(1)}
            className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-white text-lg font-bold"
          >
            +
          </button>
          
          <select 
            className="bg-[#222] border border-[#444] text-white px-2 py-1 rounded outline-none"
            value={stepValue}
            onChange={(e) => setStepValue(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 10].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select 
            className="bg-[#222] border border-[#444] text-white px-2 py-1 rounded outline-none"
            value={stepUnit}
            onChange={(e) => setStepUnit(e.target.value)}
          >
            <option value="day">Day(s)</option>
            <option value="month">Month(s)</option>
            <option value="year">Year(s)</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-900/50 text-red-300 p-4 rounded mb-4">{error}</div>}

      {!data && loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffcc]"></div>
        </div>
      )}

      {data && (
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Chart Section */}
          <div className="flex-1 flex justify-center items-start">
             <div className="relative">
               <CircularTransitChart 
                 birthPlanets={data.birth_chart}
                 transitPlanets={data.transit_chart}
                 ascendantSignIndex={ascIndex >= 0 ? ascIndex : 0}
                 currentDate={data.transit_date_formatted}
                 currentTime={data.transit_time_formatted}
               />
               {loading && (
                 <div className="absolute top-2 right-2 flex items-center gap-2">
                   <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                   <span className="text-xs text-yellow-400 font-bold">Calculating...</span>
                 </div>
               )}
             </div>
          </div>

          {/* Tables Section */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Birth Chart Table */}
            <div className="bg-[#f8d0dc] text-black border border-[#0000aa] rounded overflow-hidden shadow-lg">
              <div className="bg-[#ffffff] text-[#0000aa] font-bold p-1 px-3 border-b border-[#0000aa] flex justify-between">
                <span>Birth Chart</span>
              </div>
              <div className="overflow-x-auto text-xs font-mono p-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#0000aa]/30">
                      <th className="py-1 px-2">Planet</th><th className="py-1 px-1">RC</th>
                      <th className="py-1 px-2">Rashi</th><th className="py-1 px-2">Nakshatra</th>
                      <th className="py-1 px-1">p#</th><th className="py-1 px-2">Degree</th>
                      <th className="py-1 px-2">Dignity</th><th className="py-1 px-2">SB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.birth_chart.map((p, i) => (
                      <tr key={i} className="border-b border-[#0000aa]/10 hover:bg-white/40">
                        <td className="py-1 px-2 font-bold">{p.planet}</td><td className="py-1 px-1">{p.rc}</td>
                        <td className="py-1 px-2">{p.rashi}</td><td className="py-1 px-2">{p.nakshatra}</td>
                        <td className="py-1 px-1">{p.pada}</td><td className="py-1 px-2">{p.degree.toFixed(4)}°</td>
                        <td className="py-1 px-2">{p.dignity}</td><td className="py-1 px-2">{p.sb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gochara Table */}
            <div className="bg-[#f8d0dc] text-black border border-[#0000aa] rounded overflow-hidden shadow-lg">
              <div className="bg-[#ffffff] text-[#0000aa] font-bold p-1 px-3 border-b border-[#0000aa] flex justify-between">
                <span>Gochara (Transits)</span>
              </div>
              <div className="overflow-x-auto text-xs font-mono p-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#0000aa]/30">
                      <th className="py-1 px-2">Planet</th><th className="py-1 px-1">RC</th>
                      <th className="py-1 px-2">Rashi</th><th className="py-1 px-2">Nakshatra</th>
                      <th className="py-1 px-1">p#</th><th className="py-1 px-2">Degree</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transit_chart.map((p, i) => (
                      <tr key={i} className="border-b border-[#0000aa]/10 hover:bg-white/40">
                        <td className="py-1 px-2 font-bold">{p.planet}</td><td className="py-1 px-1">{p.rc}</td>
                        <td className="py-1 px-2">{p.rashi}</td><td className="py-1 px-2">{p.nakshatra}</td>
                        <td className="py-1 px-1">{p.pada}</td><td className="py-1 px-2">{p.degree.toFixed(4)}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kakshas Table */}
            <div className="bg-[#f8d0dc] text-black border border-[#0000aa] rounded overflow-hidden shadow-lg">
              <div className="bg-[#ffffff] text-[#0000aa] font-bold p-1 px-3 border-b border-[#0000aa] flex justify-between">
                <span>Kakshas</span>
              </div>
              <div className="overflow-x-auto text-xs font-mono p-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#0000aa]/30">
                      <th className="py-1 px-2">Planet</th>
                      <th className="py-1 px-2">Kaks.</th>
                      <th className="py-1 px-2">Ash.</th>
                      <th className="py-1 px-2">Sarv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kakshas.map((k, i) => (
                      <tr key={i} className="border-b border-[#0000aa]/10 hover:bg-white/40">
                        <td className="py-1 px-2 font-bold">{k.planet}</td>
                        <td className="py-1 px-2">{k.kaks}</td>
                        <td className="py-1 px-2">{k.ash}</td>
                        <td className="py-1 px-2">{k.sarv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedTransitsViewer;
