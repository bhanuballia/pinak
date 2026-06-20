import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, Plus, Trash2, List, Layout, Target } from 'lucide-react';

const PLANET_COLORS = {
  Sun: 'bg-orange-500 hover:bg-orange-400',
  Moon: 'bg-slate-300 hover:bg-slate-200 text-slate-800',
  Mars: 'bg-red-600 hover:bg-red-500',
  Rahu: 'bg-gray-800 hover:bg-gray-700',
  Jupiter: 'bg-yellow-500 hover:bg-yellow-400',
  Saturn: 'bg-blue-900 hover:bg-blue-800',
  Mercury: 'bg-emerald-500 hover:bg-emerald-400',
  Ketu: 'bg-stone-600 hover:bg-stone-500',
  Venus: 'bg-pink-400 hover:bg-pink-300',
};

const TEXT_COLORS = {
  Moon: 'text-slate-800',
  default: 'text-white'
};

const TOTAL_YEARS = 120;

// Helper to format Julian Date to short date string
const jdToDateString = (jd) => {
  if (!jd) return "";
  const ts = (jd - 2440587.5) * 86400000;
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
};

// Helper to convert standard date string YYYY-MM-DD to Julian Date
const dateToJD = (dateStr) => {
  const d = new Date(dateStr);
  return (d.getTime() / 86400000) + 2440587.5;
};

export default function DasaTimeline({ data }) {
  const [dasaData, setDasaData] = useState([]);
  const [birthJD, setBirthJD] = useState(null);
  const [selectedMahaDasa, setSelectedMahaDasa] = useState(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Events State
  const [events, setEvents] = useState([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  // View State
  const [viewMode, setViewMode] = useState('timeline');
  const timelineRef = useRef(null);

  const getDasaForJD = (jd) => {
    const maha = dasaData.find(d => jd >= d.start_jd && jd <= d.end_jd);
    if (!maha) return { maha: null, antar: null };
    const antar = maha.antardashas?.find(a => jd >= a.start_jd && jd <= a.end_jd);
    return { maha, antar };
  };

  const handleJumpToToday = () => {
    if (!birthJD) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayJD = dateToJD(todayStr);

    const { maha } = getDasaForJD(todayJD);
    if (maha) {
      setSelectedMahaDasa(maha);
      if (viewMode !== 'timeline') setViewMode('timeline');

      setTimeout(() => {
        if (timelineRef.current) {
          const totalDays = 120 * 365.2425;
          const daysSinceBirth = todayJD - birthJD;
          const positionPercent = (daysSinceBirth / totalDays);
          const scrollAmount = (timelineRef.current.scrollWidth * positionPercent) - (timelineRef.current.clientWidth / 2);
          timelineRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 100); // small delay to ensure DOM is updated
    } else {
      alert("Today's date is outside the 120-year timeline.");
    }
  };

  useEffect(() => {
    if (!data) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const basic = data.basic_details || {};
    const meta = data.meta || {};

    const dateStr = basic.birth_date || meta.date || '1990-10-01';
    let timeStr = basic.birth_time || meta.time || '12:00:00';
    if (timeStr && timeStr.split(':').length === 2) timeStr = timeStr + ':00';
    const tz = parseFloat(basic.tz_offset ?? meta.tz_offset ?? 5.5);

    fetch("/api/dasha/timeline", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, time: timeStr, tz_offset: tz })
    })
      .then(res => res.json())
      .then(res => {
        if (res.vimshottari) {
          setDasaData(res.vimshottari);
          setBirthJD(res.jd_ut);
          setSelectedMahaDasa(res.vimshottari[0]); // Select first automatically
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch timeline data:", err);
        setIsLoading(false);
      });
  }, [data]);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate || !birthJD) return;

    const eventJD = dateToJD(newEventDate);
    // Calculate percentage across the 120 year timeline
    // 120 years = 120 * 365.2425 days
    const totalDays = 120 * 365.2425;
    const daysSinceBirth = eventJD - birthJD;
    const positionPercent = (daysSinceBirth / totalDays) * 100;

    if (positionPercent >= 0 && positionPercent <= 100) {
      setEvents([...events, {
        id: Date.now(),
        name: newEventName,
        date: newEventDate,
        positionPercent,
        jd: eventJD
      }]);
      setNewEventName("");
      setNewEventDate("");

      // Automatically select the corresponding Maha Dasa for this event
      const { maha } = getDasaForJD(eventJD);
      if (maha && maha.antardashas?.length > 0) {
        setSelectedMahaDasa(maha);
      }
    } else {
      alert("Event date falls outside the 120-year lifespan of this chart.");
    }
  };

  const removeEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const getClampedDuration = (startJd, endJd, birthJd) => {
    const minJd = birthJd;
    const maxJd = birthJd + (TOTAL_YEARS * 365.2425);
    const actualStart = Math.max(startJd, minJd);
    const actualEnd = Math.min(endJd, maxJd);
    if (actualStart >= actualEnd) return 0;
    return (actualEnd - actualStart) / 365.2425;
  };

  const getWidthPercent = (durationYears) => (durationYears / TOTAL_YEARS) * 100;

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center text-slate-500 animate-pulse font-serif">
        Calculating 120-Year Vimshottari Timeline...
      </div>
    );
  }

  if (!dasaData.length) {
    return (
      <div className="p-10 text-center text-slate-500 italic border border-dashed border-slate-300 rounded-lg">
        Please generate a report first to view your interactive timeline.
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">

      <div className="mb-6 flex justify-between items-start md:items-end flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Interactive Dasa Timeline
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual representation of your 120-year Vimshottari Dasa periods.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleJumpToToday}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Target className="w-3.5 h-3.5" /> Jump to Today
            </button>
            <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-md">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${viewMode === 'timeline' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <Layout className="w-3.5 h-3.5" /> Timeline
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Active Info Panel */}
        <div className="text-left md:text-right h-12 w-full md:w-auto">
          {hoveredBlock ? (
            <div className="animate-fade-in bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-slate-100 dark:border-slate-700 md:bg-transparent md:p-0 md:shadow-none md:border-0 inline-block">
              <p className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${PLANET_COLORS[hoveredBlock.lord]?.split(' ')[0] || 'bg-slate-400'}`}></span>
                {hoveredBlock.lord} {hoveredBlock.type}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 md:justify-end mt-1">
                <Calendar className="w-3 h-3" />
                {jdToDateString(hoveredBlock.start_jd)} to {jdToDateString(hoveredBlock.end_jd)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic hidden md:block">Hover over a timeline block for exact dates</p>
          )}
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div className="relative w-full overflow-x-auto pb-8 custom-scrollbar" ref={timelineRef}>
          {/* We need a min-width to ensure the timeline is scannable and doesn't get infinitely compressed on mobile */}
          <div className="min-w-[1200px]">

            {/* --- EVENT TRACK --- */}
            <div className="relative h-10 w-full mb-1 border-b border-dashed border-slate-200 dark:border-slate-700">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="absolute flex flex-col items-center group -translate-x-1/2 cursor-pointer z-10 hover:z-20"
                  style={{ left: `${event.positionPercent}%`, bottom: 0 }}
                >
                  {/* Event Tooltip */}
                  <div className="absolute bottom-full mb-1 px-3 py-2 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none flex flex-col gap-1 items-center">
                    <p className="font-bold text-sm">{event.name}</p>
                    <p className="text-[10px] text-indigo-200 font-mono mb-1">{jdToDateString(event.jd)}</p>
                    {(() => {
                      const { maha, antar } = getDasaForJD(event.jd);
                      if (maha) {
                        return (
                          <p className="text-[10px] text-indigo-100 bg-indigo-800/50 px-1.5 py-0.5 rounded mb-1">
                            {maha.lord} {antar ? `→ ${antar.lord}` : ''}
                          </p>
                        );
                      }
                      return null;
                    })()}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEvent(event.id); }}
                      className="pointer-events-auto mt-0.5 flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white px-2 py-0.5 rounded text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                    {/* Small triangle pointer */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600"></div>
                  </div>

                  <MapPin className="w-5 h-5 text-indigo-600 drop-shadow-sm group-hover:scale-125 transition-transform" />
                  <div className="w-0.5 h-3 bg-indigo-300"></div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="absolute w-full h-full flex items-end justify-center text-xs text-slate-300 italic pb-1">
                  Use the form below to plot life events here
                </div>
              )}
            </div>

            {/* --- MAHA DASA TRACK --- */}
            <div className="flex h-16 w-full rounded-lg shadow-inner overflow-hidden border border-slate-300 dark:border-slate-700">
              {dasaData.map((dasa, idx) => {
                const clampedYears = getClampedDuration(dasa.start_jd, dasa.end_jd, birthJD);
                if (clampedYears <= 0) return null;

                const isActive = selectedMahaDasa?.lord === dasa.lord;
                const bgColor = PLANET_COLORS[dasa.lord] || 'bg-slate-500';
                const textColor = TEXT_COLORS[dasa.lord] || TEXT_COLORS.default;

                return (
                  <div
                    key={idx}
                    onClick={() => dasa.antardashas?.length > 0 && setSelectedMahaDasa(dasa)}
                    onMouseEnter={() => setHoveredBlock({ ...dasa, type: 'Maha Dasa' })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    className={`
                    ${bgColor} ${textColor}
                    h-full flex items-center justify-center relative cursor-pointer
                    transition-all duration-300 ease-in-out border-r border-black/20 last:border-0
                    ${isActive ? 'ring-2 ring-indigo-500 ring-inset opacity-100 z-10' : 'opacity-90 hover:opacity-100'}
                  `}
                    style={{ width: `${getWidthPercent(clampedYears)}%` }}
                  >
                    {/* Only show text if the block is wide enough */}
                    {dasa.duration_years > 7 ? (
                      <span className="text-sm font-semibold truncate px-1 drop-shadow-sm">
                        {dasa.lord}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold truncate px-1 hidden md:block drop-shadow-sm">
                        {dasa.lord.substring(0, 2)}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-inherit border-b border-r border-black/20 z-20"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* --- ANTAR DASA TRACK --- */}
            <div className="mt-4 h-12 w-full rounded-md overflow-hidden relative">
              {selectedMahaDasa && selectedMahaDasa.antardashas?.length > 0 ? (
                <div className="flex h-full w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-inner">
                  {selectedMahaDasa.antardashas.map((antar, idx) => {
                    const bgColor = PLANET_COLORS[antar.lord] || 'bg-slate-500';
                    const textColor = TEXT_COLORS[antar.lord] || TEXT_COLORS.default;
                    // We calculate width relative to the Maha Dasa duration
                    const relativeWidthPercent = (antar.duration_years / selectedMahaDasa.duration_years) * 100;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredBlock({ ...antar, type: 'Antar Dasa' })}
                        onMouseLeave={() => setHoveredBlock(null)}
                        className={`
                        ${bgColor} ${textColor}
                        h-full flex items-center justify-center border-r border-black/10 last:border-0
                        cursor-help transition-opacity hover:opacity-90
                      `}
                        style={{ width: `${relativeWidthPercent}%` }}
                      >
                        <span className="text-[10px] font-medium truncate px-1 drop-shadow-sm">
                          {antar.lord.substring(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm italic border border-dashed border-slate-300 dark:border-slate-700 rounded-md">
                  No Antar Dasa data available for this period.
                </div>
              )}
            </div>

            {/* Timeline Axis Labels */}
            <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400 px-1">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(age => (
                <span key={age}>Age {age}</span>
              ))}
            </div>

          </div>
        </div>
      ) : (
          <div className="w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm custom-scrollbar max-h-[500px]">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700/50 dark:text-slate-300 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3">Maha Dasa</th>
                  <th className="px-4 py-3">Antar Dasa</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {dasaData.map((maha, i) => (
                  <React.Fragment key={i}>
                    <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-semibold text-slate-800 dark:text-slate-200">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${PLANET_COLORS[maha.lord]?.split(' ')[0] || 'bg-slate-400'}`}></span>
                        {maha.lord}
                      </td>
                      <td className="px-4 py-3">All</td>
                      <td className="px-4 py-3">{jdToDateString(maha.start_jd)}</td>
                      <td className="px-4 py-3">{jdToDateString(maha.end_jd)}</td>
                      <td className="px-4 py-3">{maha.duration_years.toFixed(1)} years</td>
                    </tr>
                    {maha.antardashas?.map((antar, j) => (
                      <tr key={`${i}-${j}`} className="border-b dark:border-slate-700 last:border-0 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800"></td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{antar.lord}</td>
                        <td className="px-4 py-2 font-mono text-xs">{jdToDateString(antar.start_jd)}</td>
                        <td className="px-4 py-2 font-mono text-xs">{jdToDateString(antar.end_jd)}</td>
                        <td className="px-4 py-2 text-xs">{(antar.duration_years * 12).toFixed(1)} months</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* --- ADD EVENT FORM --- */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              Plot Life Events
            </h3>

            <form onSubmit={handleAddEvent} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Event Name (e.g. Marriage, Job Change)</label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  placeholder="Enter event name..."
                  required
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Event Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </form>
          </div>
    </div>
  );
}