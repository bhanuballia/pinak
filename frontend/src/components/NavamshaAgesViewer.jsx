import React, { useState, useEffect } from 'react';
import NavamshaAgesChart from './NavamshaAgesChart';

const NavamshaAgesViewer = ({ formData }) => {
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

    if (formData.basic_details && formData.basic_details.birth_date) {
      pDate = formData.basic_details.birth_date;
      pTime = formData.basic_details.birth_time;
      pLat = formData.basic_details.lat;
      pLon = formData.basic_details.lon;
      pName = formData.basic_details.name || 'Native';
    } else if (formData.meta) {
      pDate = formData.meta.date || formData.meta.birth_date || '2000-01-01';
      pTime = formData.meta.time || formData.meta.birth_time || '12:00:00';
      pLat = formData.meta.lat || 28.6139;
      pLon = formData.meta.lon || 77.2090;
      pTz = formData.meta.tz || 5.5;
      pName = formData.meta.name || 'Native';
    } else if (formData.basic) {
      pDate = formData.basic.birth_date || '2000-01-01';
      pTime = formData.basic.birth_time || '12:00:00';
      pLat = formData.basic.lat || 28.6139;
      pLon = formData.basic.lon || 77.2090;
      pTz = formData.basic.tz_offset || 5.5;
      pName = formData.basic.name || 'Native';
    } else if (formData.dob) {
      pDate = formData.dob;
      pTime = formData.tob || "00:00:00";
      pLat = formData.lat;
      pLon = formData.lon;
      pTz = formData.tz || 5.5;
      pName = formData.name || 'Native';
    } else {
      setLoading(false);
      return; // Cannot parse
    }

    try {
      const payload = {
        birth_date: pDate,
        birth_time: pTime.includes(":") && pTime.split(":").length === 2 ? pTime + ":00" : pTime,
        lat: parseFloat(pLat),
        lon: parseFloat(pLon),
        tz_offset: parseFloat(pTz),
        name: pName
      };

      const response = await fetch('http://localhost:8000/api/navamsha_ages/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to fetch navamsha ages data");
      const result = await response.json();
      result.name = pName;
      result.dob = pDate;
      result.tob = pTime;
      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error calculating navamsha ages. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData || (!formData.dob && !formData.basic_details && !formData.meta && !formData.basic)) {
    return <div className="bg-white min-h-screen text-black p-6 font-sans">Please fill out the birth details form first to view Navamsha Ages.</div>;
  }

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      {/* Top Header Bar */}
      <div className="border-b border-[#0000aa] flex justify-between px-2 py-0.5 text-xs">
        <div className="flex gap-4 text-black">
          <span className="font-serif">{data?.name || 'Loading...'}</span>
          <span className="font-serif">{data ? `${data.dob} ${data.tob}` : ''}</span>
        </div>
        <div className="text-black font-serif">
          Navamsha ages Chart
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-800 p-4 m-4 border border-red-300">{error}</div>}

      {!data && loading && (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <span className="text-4xl">⏳</span>
            <span className="mt-4 text-gray-500">Calculating Navamsha Subdivisions...</span>
          </div>
        </div>
      )}

      {data && (
        <div className="flex-1 p-2 md:p-6 bg-pink-50/30">
          <NavamshaAgesChart gridData={data.grid} />
        </div>
      )}

      {/* Footer */}
      <div className="bg-[#ffff99] border-t border-black p-2 text-xs text-black font-sans mt-auto">
        [1 of 2] This worksheet show the Navamsha positions of the planets drawn inside the Rashi chart. Each Navamsha is marked with the number of its sign (i.e. R1 stands for the 1st Rashi, Aries), as well as the corresponding age. &gt;&gt;
      </div>
    </div>
  );
};

export default NavamshaAgesViewer;
