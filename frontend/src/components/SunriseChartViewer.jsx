import React, { useState, useEffect } from 'react';
import ZodiacChart from './ZodiacChart';

const TitlePill = ({ title }) => (
  <div className="border-[3px] border-[#3b82f6] rounded-full bg-white px-3 py-0.5 shadow-sm inline-block mb-1">
    <h2 className="text-[#000080] font-serif text-[14px] font-bold leading-tight m-0 whitespace-nowrap">{title}</h2>
  </div>
);

const SunriseChartViewer = ({ formData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashaPage, setDashaPage] = useState(0);
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [showBirthDataModal, setShowBirthDataModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [formData]);

  const fetchData = async () => {
    if (!formData) return;
    setLoading(true);

    let pDate = '1988-02-07';
    let pTime = '14:09:10';
    let pLat = 26.8633;
    let pLon = 80.9300;
    let pTz = 5.5;
    let pName = 'bhanu';
    let pLoc = 'Lucknow, Uttar Pradesh';
    let pCountry = 'India';

    if (formData.basic_details && formData.basic_details.birth_date) {
      pDate = formData.basic_details.birth_date;
      pTime = formData.basic_details.birth_time;
      pLat = formData.basic_details.lat;
      pLon = formData.basic_details.lon;
      pName = formData.basic_details.name || pName;
      pLoc = formData.basic_details.birth_place || pLoc;
    } else if (formData.meta) {
      pDate = formData.meta.date || formData.meta.birth_date || pDate;
      pTime = formData.meta.time || formData.meta.birth_time || pTime;
      pLat = formData.meta.lat || pLat;
      pLon = formData.meta.lon || pLon;
      pTz = formData.meta.tz || pTz;
      pName = formData.meta.name || pName;
      pLoc = formData.meta.location_name || pLoc;
    } else if (formData.basic) {
      pDate = formData.basic.birth_date || pDate;
      pTime = formData.basic.birth_time || pTime;
      pLat = formData.basic.lat || pLat;
      pLon = formData.basic.lon || pLon;
      pTz = formData.basic.tz_offset || pTz;
      pName = formData.basic.name || pName;
      pLoc = formData.basic.location || pLoc;
    } else if (formData.dob) {
      pDate = formData.dob;
      pTime = formData.tob || "00:00:00";
      pLat = formData.lat;
      pLon = formData.lon;
      pTz = formData.tz || pTz;
      pName = formData.name || pName;
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

      const response = await fetch('/api/sunrise/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to fetch Sunrise Chart data");
      const result = await response.json();

      let standardD1Houses = formData.charts?.D1?.houses || formData.charts?.houses || formData.charts || null;

      result.name = pName;
      result.dob = pDate;
      result.tob = pTime;
      result.lat = pLat;
      result.lon = pLon;
      result.tz = pTz;
      result.loc = pLoc;
      result.country = pCountry;
      result.standardD1Houses = standardD1Houses;

      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error calculating Sunrise chart. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const formatLat = (lat) => {
    if (lat === undefined || lat === null) return "26N51'00";
    const deg = Math.floor(Math.abs(lat));
    const min = Math.floor((Math.abs(lat) - deg) * 60);
    const dir = lat >= 0 ? 'N' : 'S';
    return `${deg}${dir}${String(min).padStart(2, '0')}'00`;
  };

  const formatLon = (lon) => {
    if (lon === undefined || lon === null) return "80E55'00";
    const deg = Math.floor(Math.abs(lon));
    const min = Math.floor((Math.abs(lon) - deg) * 60);
    const dir = lon >= 0 ? 'E' : 'W';
    return `${deg}${dir}${String(min).padStart(2, '0')}'00`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '07-02-1988';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  };

  const getDashaRows = () => {
    if (!data?.dashas) return [];
    const rows = [];

    let birthMs = 0;
    if (data.dob) {
      birthMs = new Date(data.dob + 'T00:00:00Z').getTime();
    }

    data.dashas.forEach(md => {
      if (md.antardashas) {
        md.antardashas.forEach(ad => {
          const startMs = (ad.start_jd - 2440587.5) * 86400000;
          const endMs = (ad.end_jd - 2440587.5) * 86400000;

          // Only include dashas that end on or after birth date
          if (endMs >= birthMs) {
            // Clamping first active dasha start to user's birth date
            const effectiveMs = (startMs < birthMs && birthMs > 0) ? birthMs : startMs;
            const dt = new Date(effectiveMs);
            const dayName = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
            const dateFormatted = dt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).replace(/\//g, '-');
            rows.push({
              chain: `${md.lord.substring(0, 2)}-${ad.lord.substring(0, 2)}`,
              day: dayName,
              date: dateFormatted
            });
          }
        });
      }
    });
    return rows;
  };

  const dashaRows = getDashaRows();
  const pageSize = 9;
  const totalDashaPages = Math.ceil(dashaRows.length / pageSize) || 1;
  const currentDashaRows = dashaRows.slice(dashaPage * pageSize, (dashaPage + 1) * pageSize);

  if (!formData) {
    return <div className="p-4 text-slate-700">No data available</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#ff6b81]/15 font-sans flex flex-col overflow-y-auto custom-scrollbar text-[#000080]">
      {/* Top Header Bar */}
      <div className="bg-white border-b-2 border-[#0000aa] px-3 py-1 flex justify-between items-center text-sm font-serif font-semibold text-[#000080] shrink-0">
        <div>{data?.name || 'bhanu'} {formatDateDisplay(data?.dob)} {data?.tob || '14:09:10'}</div>
        <div>Sunrise chart</div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 m-2 rounded border border-red-300 text-xs">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex-1 flex justify-center items-center font-serif text-lg">
          Calculating Sunrise Chart...
        </div>
      )}

      {data && (
        <div className="flex-1 p-2 flex flex-col gap-2 min-h-[750px]">
          {/* Top Row: Birth Chart & Birth data */}
          <div className="flex gap-2 h-[280px]">
            {/* Birth Chart */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex justify-between items-center px-0.5 mb-1">
                <TitlePill title="Birth Chart" />
                <button
                  onClick={() => setShowBirthModal(true)}
                  title="Expand to Full View"
                  className="text-[10px] font-bold text-[#000080] bg-white border border-[#3b82f6] hover:bg-indigo-50 px-1.5 py-0.5 rounded shadow-xs cursor-pointer"
                >
                  🔍 Full View
                </button>
              </div>
              <div
                className="flex-1 border-[2px] border-[#ff6b81] bg-[#ffffe6] p-1 flex items-center justify-center overflow-hidden rounded-sm shadow-sm min-h-0 w-full h-full cursor-pointer"
                onClick={() => setShowBirthModal(true)}
              >
                {data.standardD1Houses ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <ZodiacChart houses={data.standardD1Houses} variant="legacy" defaultRect={true} scaleText={1.6} hideLegend={true} bgColor="transparent" />
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-xs font-serif">Birth chart not available</div>
                )}
              </div>
            </div>

            {/* D9 Navamsha Sunrise (spouse) */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-0.5 mb-1">
                <TitlePill title="D9 Navamsha Sunrise (spouse)" />
              </div>
              <div className="flex-1 border-[2px] border-[#ff6b81] bg-[#ffffe6] p-1 flex items-center justify-center overflow-hidden rounded-sm shadow-sm min-h-0">
                <ZodiacChart houses={data.d9_chart?.houses} variant="legacy" defaultRect={true} scaleText={1.5} bgColor="transparent" />
              </div>
            </div>
          </div>

          {/* Bottom Row: Sunrise Chart (Left) + Birth Data & Dashas (Right) */}
          <div className="flex-1 flex gap-2 min-h-0">
            {/* Sunrise Chart (Left 65%) */}
            <div className="flex-[1.8] flex flex-col min-w-0">
              <div className="px-0.5 mb-1">
                <TitlePill title="Sunrise" />
              </div>
              <div className="flex-1 border-[2px] border-[#ff6b81] bg-[#ffffe6] p-1.5 flex items-center justify-center overflow-hidden rounded-sm shadow-sm min-h-0">
                <ZodiacChart houses={data.d1_chart?.houses} variant="legacy" defaultRect={true} scaleText={1.8} bgColor="transparent" />
              </div>
            </div>

            {/* Right Stack (35%) */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {/* Birth data Popup Trigger */}
              <div className="flex flex-col min-w-0">
                <div className="flex justify-between items-center px-0.5 mb-1">
                  <TitlePill title="Birth data" />
                  <button
                    onClick={() => setShowBirthDataModal(true)}
                    className="text-[10px] font-bold text-[#000080] bg-white border border-[#3b82f6] hover:bg-indigo-50 px-1.5 py-0.5 rounded shadow-xs cursor-pointer"
                  >
                    ℹ️ View Details
                  </button>
                </div>
                <div
                  onClick={() => setShowBirthDataModal(true)}
                  className="border-[2px] border-[#ff6b81] bg-[#ffffe6] p-2 flex items-center justify-between font-serif text-xs text-[#000080] rounded-sm shadow-sm cursor-pointer hover:bg-pink-50 transition-colors"
                >
                  <div>
                    <span className="font-bold text-sm text-[#000080] mr-2">{data.name}</span>
                    <span className="text-slate-600 font-sans text-[11px]">{formatDateDisplay(data.dob)} ({data.tob})</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#3b82f6] underline">Click for details</span>
                </div>
              </div>

              {/* Sunrise Vimshottari Table */}
              <div className="flex-1 flex flex-col min-h-0 min-w-0">
                <div className="flex justify-between items-center px-0.5 mb-1">
                  <TitlePill title="Sunrise Vimshottari" />
                  {/* Table Controls */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#000080]">
                    <button onClick={() => setDashaPage(p => Math.max(0, p - 1))} className="w-5 h-5 flex items-center justify-center bg-white border border-[#3b82f6] rounded hover:bg-indigo-50 cursor-pointer shadow-2xs text-[11px]" title="Previous Page">◄</button>
                    <button onClick={() => setDashaPage(0)} className="w-5 h-5 flex items-center justify-center bg-white border border-[#3b82f6] rounded hover:bg-indigo-50 cursor-pointer shadow-2xs text-[11px]" title="First Page">▲</button>
                    <button onClick={() => setDashaPage(totalDashaPages - 1)} className="w-5 h-5 flex items-center justify-center bg-white border border-[#3b82f6] rounded hover:bg-indigo-50 cursor-pointer shadow-2xs text-[11px]" title="Last Page">▼</button>
                    <button onClick={() => setDashaPage(p => Math.min(totalDashaPages - 1, p + 1))} className="w-5 h-5 flex items-center justify-center bg-white border border-[#3b82f6] rounded hover:bg-indigo-50 cursor-pointer shadow-2xs text-[11px]" title="Next Page">►</button>
                  </div>
                </div>

                <div className="flex-1 border-[2px] border-[#ff6b81] bg-[#ffffe6] p-1.5 overflow-auto custom-scrollbar rounded-sm shadow-sm min-h-0">
                  <table className="w-full font-mono text-[15px] border-collapse">
                    <tbody>
                      {currentDashaRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-pink-100 last:border-0 hover:bg-pink-50">
                          <td className="py-0.5 px-1 font-bold text-[#b91c1c]">{row.chain}</td>
                          <td className="py-0.5 px-1 text-slate-900">{row.day}</td>
                          <td className="py-0.5 px-1 text-right text-stone-900">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Yellow Footer Banner */}
          <div className="bg-[#ffffe0] border border-[#d97706] p-1.5 text-center text-xs font-serif text-slate-800 shrink-0">
            This worksheet displays the Surya Lagna Chart, Sunrise Navamsha, and Dasha calculations computed at local sunrise time, traditionally evaluated for daily astrological predictions.
          </div>
        </div>
      )}

      {/* Full Screen Birth Chart Modal */}
      {showBirthModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowBirthModal(false)}
        >
          <div
            className="bg-[#ffffe6] border-[3px] border-[#3b82f6] rounded-xl p-4 w-full max-w-2xl aspect-square flex flex-col shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <TitlePill title="Birth Chart (Full View)" />
              <button
                onClick={() => setShowBirthModal(false)}
                className="text-[#000080] font-bold text-sm hover:text-red-600 px-2 py-0.5 rounded border border-[#3b82f6] bg-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 bg-white border border-[#8ec5e6] flex items-center justify-center overflow-hidden p-2 rounded">
              <ZodiacChart houses={data?.standardD1Houses} variant="legacy" defaultRect={true} scaleText={2.2} hideLegend={true} />
            </div>
          </div>
        </div>
      )}

      {/* Birth Data Modal Popup */}
      {showBirthDataModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowBirthDataModal(false)}
        >
          <div
            className="bg-[#ffffe6] border-[3px] border-[#3b82f6] rounded-xl p-5 w-full max-w-md flex flex-col shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#3b82f6]/30 pb-2 mb-3">
              <TitlePill title="Birth Data Details" />
              <button
                onClick={() => setShowBirthDataModal(false)}
                className="text-[#000080] font-bold text-sm hover:text-red-600 px-2.5 py-0.5 rounded border border-[#3b82f6] bg-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex flex-col items-center text-center font-serif text-sm leading-loose text-[#000080] py-3 px-4 bg-white/80 border border-[#8ec5e6] rounded-lg shadow-inner">
              <div className="font-bold text-base text-[#000080] mb-1">{data?.name}</div>
              <div>Date of Birth: <span className="font-semibold">{formatDateDisplay(data?.dob)}</span></div>
              <div>Time of Birth: <span className="font-semibold">{data?.tob}</span></div>
              <div>Location: <span className="font-semibold">{data?.loc}</span></div>
              <div>Country: <span className="font-semibold">{data?.country || 'India'}</span></div>
              <div>Timezone: <span className="font-semibold">-5:30:00 DST: 0</span></div>
              <div>Latitude: <span className="font-semibold">{formatLat(data?.lat)}</span></div>
              <div>Longitude: <span className="font-semibold">{formatLon(data?.lon)}</span></div>
              <div>Ayanamsha: <span className="font-semibold">-23:41:30 Lahiri</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};

export default SunriseChartViewer;
