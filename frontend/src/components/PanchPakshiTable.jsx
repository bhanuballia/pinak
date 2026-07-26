import React, { useState, useEffect } from 'react';

const PanchPakshiVisualTimeline = ({ timeline, cycleStart, cycleEnd, currentTime }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const startMs = new Date(cycleStart).getTime();
  const endMs = new Date(cycleEnd).getTime();
  const totalDuration = endMs - startMs;

  const getActivityMeta = (activity) => {
    switch (activity) {
      case "Ruling":
        return {
          bg: "bg-emerald-500 hover:bg-emerald-400",
          color: "#10b981",
          label: "Ruling (Inspirational / Start Business)",
          status: "Excellent",
          textColor: "text-emerald-300"
        };
      case "Eating":
        return {
          bg: "bg-teal-500 hover:bg-teal-400",
          color: "#14b8a6",
          label: "Eating (Prosperous / Execute Tasks)",
          status: "Very Good",
          textColor: "text-teal-300"
        };
      case "Walking":
        return {
          bg: "bg-amber-400 hover:bg-amber-300",
          color: "#fbbf24",
          label: "Walking (Mundane / General Work)",
          status: "Neutral",
          textColor: "text-amber-300"
        };
      case "Sleeping":
        return {
          bg: "bg-indigo-300/60 hover:bg-indigo-300/80",
          color: "#a5b4fc",
          label: "Sleeping (Passive / Avoid Major Starts)",
          status: "Resting",
          textColor: "text-indigo-200"
        };
      case "Dying":
        return {
          bg: "bg-rose-600 hover:bg-rose-500",
          color: "#e11d48",
          label: "Dying (Critical / Avoid Travel & Contracts)",
          status: "Inauspicious",
          textColor: "text-rose-300"
        };
      default:
        return { bg: "bg-slate-400", color: "#94a3b8", label: activity, status: "Unknown", textColor: "text-slate-300" };
    }
  };

  const formatTimeStr = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const refTimeMs = new Date(currentTime).getTime();
  const showCursor = refTimeMs >= startMs && refTimeMs <= endMs;
  const cursorLeftPercent = showCursor ? ((refTimeMs - startMs) / totalDuration) * 100 : 0;

  return (
    <div className="relative w-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg select-none">
      <div className="flex justify-between items-center mb-3 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
        <span>🌅 {formatTimeStr(cycleStart)}</span>
        <span className="text-amber-500 font-bold">Progress Timeline</span>
        <span>🌌 {formatTimeStr(cycleEnd)}</span>
      </div>

      <div className="relative h-12 w-full bg-slate-900 rounded-xl overflow-hidden flex shadow-inner border border-slate-800">
        {timeline.map((item, idx) => {
          const itemStart = new Date(item.start).getTime();
          const itemEnd = new Date(item.end).getTime();
          const itemDuration = itemEnd - itemStart;
          const widthPercent = (itemDuration / totalDuration) * 100;
          const meta = getActivityMeta(item.activity);

          return (
            <div
              key={idx}
              className={`h-full relative cursor-pointer transition-all duration-200 border-r border-slate-950/20 ${meta.bg}`}
              style={{ width: `${widthPercent}%` }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            />
          );
        })}

        {showCursor && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10 pointer-events-none"
            style={{ left: `${cursorLeftPercent}%` }}
          >
            <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-yellow-400 border-2 border-slate-950 rounded-full animate-bounce shadow-md" />
            <div className="absolute -bottom-1 -left-1.5 bg-yellow-400 px-1 py-0.5 rounded text-[8px] font-black text-slate-950 font-mono tracking-tighter">
              LIVE
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 min-h-[90px] bg-slate-900/60 rounded-xl p-4 border border-slate-850 flex flex-col justify-center">
        {hoveredItem ? (
          (() => {
            const meta = getActivityMeta(hoveredItem.activity);
            return (
              <div className="animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-400">Yama {hoveredItem.yama}.{hoveredItem.apahara}</span>
                    <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                      ⏱️ {formatTimeStr(hoveredItem.start)} - {formatTimeStr(hoveredItem.end)}
                    </span>
                  </div>
                  <div className="text-base font-black tracking-wide mt-1" style={{ color: meta.color }}>
                    {meta.label}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-850 text-center min-w-[90px]">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Sub Bird</div>
                    <div className="text-xs font-bold text-white mt-0.5">{hoveredItem.sub_bird}</div>
                  </div>
                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-850 text-center min-w-[90px]">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Relation</div>
                    <div className="text-xs font-bold text-indigo-300 mt-0.5">{hoveredItem.relationship}</div>
                  </div>
                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-850 text-center min-w-[70px]">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Score</div>
                    <div className="text-xs font-black text-amber-400 mt-0.5">{hoveredItem.score}</div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-slate-400 text-xs italic text-center font-serif">
            Hover over the color-coded blocks on the bar to inspect details and plan schedules.
          </div>
        )}
      </div>
    </div>
  );
};

const PanchPakshiTable = ({ data }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup current time state to support live highlight updates if transit is today
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // Selected Transit Date/Time states to allow direct in-panel selection and clear display
  const [transitDate, setTransitDate] = useState("");
  const [transitTime, setTransitTime] = useState("");

  useEffect(() => {
    // 1. Extract selected/transit date and time from incoming horoscope data
    let dateStr = data?.meta?.date || data?.basic?.birth_date;
    let timeStr = data?.meta?.time || data?.basic?.birth_time;

    if (!dateStr || !timeStr) {
      if (data?.meta?.birth_datetime) {
        try {
          const parts = data.meta.birth_datetime.split(" | ");
          if (parts.length >= 2) {
            const dParts = parts[0].trim().split("/");
            if (dParts.length === 3) {
              dateStr = `${dParts[2]}-${dParts[1]}-${dParts[0]}`; // YYYY-MM-DD
            }
            const tParts = parts[1].trim().split(" ");
            let hm = tParts[0].split(":");
            if (hm.length >= 2) {
              let h = parseInt(hm[0], 10);
              let m = hm[1];
              if (tParts[1] && tParts[1].toUpperCase() === "PM" && h < 12) h += 12;
              if (tParts[1] && tParts[1].toUpperCase() === "AM" && h === 12) h = 0;
              timeStr = `${h.toString().padStart(2, '0')}:${m}:00`;
            }
          }
        } catch (e) {
          console.error("Error parsing birth_datetime", e);
        }
      }
    }

    if (dateStr) setTransitDate(dateStr);
    if (timeStr) {
      // Ensure HH:MM formatting for the HTML time input
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        setTransitTime(`${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`);
      } else {
        setTransitTime(timeStr);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!transitDate || !transitTime) return;

    // 2. Extract native birth details to calculate correct Birth Bird
    let birthDateStr = "";
    let birthTimeStr = "";

    const basic = data?.basic_details || {};
    if (basic.birth_datetime) {
      try {
        const parts = basic.birth_datetime.split(" | ");
        if (parts.length >= 2) {
          const dParts = parts[0].trim().split("/");
          if (dParts.length === 3) {
            birthDateStr = `${dParts[2]}-${dParts[1]}-${dParts[0]}`; // YYYY-MM-DD
          }
          const tParts = parts[1].trim().split(" ");
          let hm = tParts[0].split(":");
          if (hm.length >= 2) {
            let h = parseInt(hm[0], 10);
            let m = hm[1];
            if (tParts[1] && tParts[1].toUpperCase() === "PM" && h < 12) h += 12;
            if (tParts[1] && tParts[1].toUpperCase() === "AM" && h === 12) h = 0;
            birthTimeStr = `${h.toString().padStart(2, '0')}:${m}:00`;
          }
        }
      } catch (e) {
        console.error("Error parsing birth birth_datetime", e);
      }
    }

    if (!birthDateStr && basic.year && basic.month && basic.day) {
      birthDateStr = `${basic.year}-${basic.month.toString().padStart(2, '0')}-${basic.day.toString().padStart(2, '0')}`;
      birthTimeStr = `${(basic.hour || 0).toString().padStart(2, '0')}:${(basic.minute || 0).toString().padStart(2, '0')}:00`;
    }

    // Fallbacks
    if (!birthDateStr) {
      birthDateStr = transitDate;
      birthTimeStr = `${transitTime}:00`;
    }

    const lat = basic.lat || data?.meta?.lat || 28.6139;
    const lon = basic.lon || data?.meta?.lon || 77.2090;
    const tz_offset = basic.tz_offset || data?.meta?.tz_offset || 5.5;
    const birth_tz_offset = basic.tz_offset || tz_offset;

    const fetchPanchPakshi = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          date: transitDate,
          time: `${transitTime}:00`,
          tz_offset: tz_offset,
          lat: lat,
          lon: lon,
          birth_date: birthDateStr,
          birth_time: birthTimeStr,
          birth_tz_offset: birth_tz_offset
        };

        const res = await fetch('/api/panch-pakshi/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Failed to fetch Panch Pakshi data");
        }

        const result = await res.json();
        setResponse(result);
      } catch (err) {
        console.error(err);
        setError("Error loading Panch Pakshi calculations.");
      } finally {
        setLoading(false);
      }
    };

    fetchPanchPakshi();
  }, [transitDate, transitTime, data]);

  // Format datetimes to local string beautifully
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateBeautiful = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 30) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getRelationshipColor = (rel) => {
    if (rel === "Self") return "text-indigo-700 bg-indigo-50 border-indigo-200";
    if (rel === "Friend") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  const getActivityColor = (act) => {
    switch (act) {
      case "Ruling": return "text-amber-700 font-black uppercase text-[15px] tracking-wider";
      case "Eating": return "text-emerald-700 font-bold text-[15px]";
      case "Walking": return "text-sky-700 font-bold text-[15px]";
      case "Sleeping": return "text-slate-500 font-medium text-[15px]";
      case "Dying": return "text-rose-700 font-extrabold uppercase tracking-widest text-[15px]";
      default: return "text-slate-700 text-[15px]";
    }
  };

  // Helper to check if a row is active based on simulated/current time
  const checkIsActive = (startStr, endStr) => {
    if (!startStr || !endStr) return false;
    const start = new Date(startStr);
    const end = new Date(endStr);

    // Use simulated transit time as the reference if it represents a different date than today
    // Otherwise, check against real current clock time
    let refTime = currentTime;
    if (response?.query_date && response?.query_time) {
      const simDt = new Date(`${response.query_date}T${response.query_time}`);
      // If simulated date is different from today, highlight the simulated slot!
      const todayStr = new Date().toISOString().split('T')[0];
      if (response.query_date !== todayStr) {
        refTime = simDt;
      }
    }

    return refTime >= start && refTime < end;
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="font-serif italic text-sm text-slate-500">Calculating Gochara Panch Pakshi Cycles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100">
        <span className="text-2xl text-rose-500">⚠️</span>
        <p className="mt-2 font-serif text-rose-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
        <span className="text-2xl text-slate-400">🦅</span>
        <p className="mt-2 font-serif italic text-slate-500 text-sm">Please specify a birth record to load Panch Pakshi worksheet.</p>
      </div>
    );
  }

  const {
    birth_bird,
    nakshatra_name,
    birth_paksha,
    query_paksha,
    query_date,
    query_time,
    query_weekday,
    sunrise,
    sunset,
    sunrise_next,
    day_ruling_bird,
    day_dying_bird,
    night_ruling_bird,
    night_dying_bird,
    day_timeline,
    night_timeline
  } = response;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[95%] mx-auto font-sans text-slate-800">

      {/* Astro Metadata Summary Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif italic tracking-wide text-amber-400 font-black">
            Interactive Panch Pakshi Gochara Worksheet
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-2">
            Dynamic astronomical cycles based on NOAA precise solar calculation
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-3.5 py-1.5 rounded-lg border border-amber-500/30">
              📅 Active: <strong className="text-white uppercase font-black">{query_weekday}</strong>, <strong className="text-white">{formatDateBeautiful(query_date)}</strong>
            </span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-3.5 py-1.5 rounded-lg border border-indigo-500/30">
              ⏰ Time: <strong className="text-white">{transitTime}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Day & Date Picker */}
          <div className="flex flex-col gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <label className="text-[10px] text-slate-300 uppercase tracking-wider font-mono font-black">Change Transit Day & Date</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={transitDate}
                onChange={(e) => setTransitDate(e.target.value)}
                className="bg-slate-950 text-white border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono focus:border-amber-500 focus:outline-none"
              />
              <input
                type="time"
                value={transitTime}
                onChange={(e) => setTransitTime(e.target.value)}
                className="bg-slate-950 text-white border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Birth Bird</div>
            <div className="text-base font-black text-amber-400 uppercase tracking-widest mt-1">{birth_bird}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Birth Nakshatra</div>
            <div className="text-base font-black text-indigo-300 mt-1">{nakshatra_name}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Transit Weekday</div>
            <div className="text-base font-black text-sky-300 mt-1">{query_weekday}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-5 py-3 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Transit Paksha</div>
            <div className="text-base font-black text-rose-300 mt-1">{query_paksha} Paksha</div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">🌅 Diurnal (Day) Timeline Bar</h4>
          <PanchPakshiVisualTimeline
            timeline={day_timeline}
            cycleStart={sunrise}
            cycleEnd={sunset}
            currentTime={currentTime}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">🌙 Nocturnal (Night) Timeline Bar</h4>
          <PanchPakshiVisualTimeline
            timeline={night_timeline}
            cycleStart={sunset}
            cycleEnd={sunrise_next}
            currentTime={currentTime}
          />
        </div>
      </div>

      {/* Parallel Side-by-Side Day and Night columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Left Column: DAY CYCLE */}
        <div className="bg-white border-2 border-rose-100 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-black uppercase tracking-widest text-rose-100/90 font-mono">Transit Day Cycle</span>
                <h3 className="text-3xl font-serif italic font-black mt-1.5">🌅 Diurnal Panch Pakshi (Day)</h3>
              </div>
              <div className="bg-white/20 px-6 py-2 rounded-full text-sm font-mono font-bold border border-white/30 shadow-inner">
                {formatTime(sunrise)} - {formatTime(sunset)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-xs text-rose-100 uppercase tracking-widest font-mono">Ruling Bird of Day</div>
                <div className="text-xl font-black text-yellow-300 uppercase tracking-wider mt-1.5">👑 {day_ruling_bird}</div>
              </div>
              <div>
                <div className="text-xs text-rose-100 uppercase tracking-widest font-mono">Dying Bird of Day</div>
                <div className="text-xl font-black text-rose-100 uppercase tracking-wider mt-1.5">☠️ {day_dying_bird}</div>
              </div>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto p-6 max-h-[850px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-sm text-slate-600 font-black uppercase tracking-wider">
                  <th className="py-5 px-5 w-[280px]">Time Interval</th>
                  <th className="py-5 px-4 text-center w-[130px]">Cycle ID</th>
                  <th className="py-5 px-4 w-[140px]">Sub Bird</th>
                  <th className="py-5 px-4 w-[240px]">Your Bird's Activity</th>
                  <th className="py-5 px-4 text-center w-[150px]">Relationship</th>
                  <th className="py-5 px-4 text-center w-[120px]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {day_timeline.map((item, idx) => {
                  const isActive = checkIsActive(item.start, item.end);
                  return (
                    <tr
                      key={`day-${idx}`}
                      className={`transition-all duration-350 border-l-4 ${isActive
                        ? "bg-amber-100/50 border-l-amber-500 font-extrabold text-slate-900 shadow-md border-y-2 border-y-amber-200"
                        : "border-l-transparent hover:bg-slate-50/80 text-slate-700"
                        }`}
                    >
                      <td className="py-5 px-5 font-mono text-sm text-slate-800 whitespace-nowrap">
                        <div className="flex items-center">
                          {isActive && (
                            <span className="relative flex h-3.5 w-3.5 mr-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                            </span>
                          )}
                          <span className={isActive ? "text-slate-900 font-black text-[15px]" : "text-sm text-slate-700"}>
                            {formatTime(item.start)} - {formatTime(item.end)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center font-mono text-sm text-indigo-700 font-bold">
                        Y{item.yama}.A{item.apahara}
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-900 text-[15px]">{item.sub_bird}</td>
                      <td className="py-5 px-4">
                        <span className={`${getActivityColor(item.activity)}`}>{item.activity}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`text-sm font-black px-3.5 py-1.5 rounded-lg border inline-block ${getRelationshipColor(item.relationship)}`}>
                          {item.relationship}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`text-sm font-black px-4 py-1.5 rounded-lg border inline-block ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: NIGHT CYCLE */}
        <div className="bg-white border-2 border-indigo-100 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-black uppercase tracking-widest text-indigo-200/90 font-mono">Transit Night Cycle</span>
                <h3 className="text-3xl font-serif italic font-black mt-1.5">🌙 Nocturnal Panch Pakshi (Night)</h3>
              </div>
              <div className="bg-white/20 px-6 py-2 rounded-full text-sm font-mono font-bold border border-white/30 shadow-inner">
                {formatTime(sunset)} - {formatTime(sunrise_next)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-xs text-indigo-200 uppercase tracking-widest font-mono">Ruling Bird of Night</div>
                <div className="text-xl font-black text-yellow-300 uppercase tracking-wider mt-1.5">👑 {night_ruling_bird}</div>
              </div>
              <div>
                <div className="text-xs text-indigo-200 uppercase tracking-widest font-mono">Dying Bird of Night</div>
                <div className="text-xl font-black text-rose-200 uppercase tracking-wider mt-1.5">☠️ {night_dying_bird}</div>
              </div>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto p-6 max-h-[850px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-sm text-slate-600 font-black uppercase tracking-wider">
                  <th className="py-5 px-5 w-[280px]">Time Interval</th>
                  <th className="py-5 px-4 text-center w-[130px]">Cycle ID</th>
                  <th className="py-5 px-4 w-[140px]">Sub Bird</th>
                  <th className="py-5 px-4 w-[240px]">Your Bird's Activity</th>
                  <th className="py-5 px-4 text-center w-[150px]">Relationship</th>
                  <th className="py-5 px-4 text-center w-[120px]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {night_timeline.map((item, idx) => {
                  const isActive = checkIsActive(item.start, item.end);
                  return (
                    <tr
                      key={`night-${idx}`}
                      className={`transition-all duration-350 border-l-4 ${isActive
                        ? "bg-amber-100/50 border-l-amber-500 font-extrabold text-slate-900 shadow-md border-y-2 border-y-amber-200"
                        : "border-l-transparent hover:bg-slate-50/80 text-slate-700"
                        }`}
                    >
                      <td className="py-5 px-5 font-mono text-sm text-slate-800 whitespace-nowrap">
                        <div className="flex items-center">
                          {isActive && (
                            <span className="relative flex h-3.5 w-3.5 mr-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                            </span>
                          )}
                          <span className={isActive ? "text-slate-900 font-black text-[15px]" : "text-sm text-slate-700"}>
                            {formatTime(item.start)} - {formatTime(item.end)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center font-mono text-sm text-indigo-700 font-bold">
                        Y{item.yama}.A{item.apahara}
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-900 text-[15px]">{item.sub_bird}</td>
                      <td className="py-5 px-4">
                        <span className={`${getActivityColor(item.activity)}`}>{item.activity}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`text-sm font-black px-3.5 py-1.5 rounded-lg border inline-block ${getRelationshipColor(item.relationship)}`}>
                          {item.relationship}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`text-sm font-black px-4 py-1.5 rounded-lg border inline-block ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Educational Footer explaining Activities */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-2 grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Ruling (👑)", desc: "Most favorable time. Suitable for starting critical projects, meetings, and major decisions.", color: "text-amber-700 border-amber-200 bg-amber-50" },
          { label: "Eating (🥗)", desc: "Highly positive and energetic time. Favorable for wealth accumulation, financial activities, and execution.", color: "text-emerald-700 border-emerald-200 bg-emerald-50" },
          { label: "Walking (🚶)", desc: "Moderately active and mobile period. Good for short travels, documentation, and routine works.", color: "text-sky-700 border-sky-200 bg-sky-50" },
          { label: "Sleeping (💤)", desc: "Passive time with lower energy. Keep details light, avoid heavy negotiations or starts.", color: "text-slate-600 border-slate-200 bg-slate-100" },
          { label: "Dying (⚠️)", desc: "Extremely inauspicious timing. Avoid starting anything new; ideal only for quiet rest and inner contemplation.", color: "text-rose-700 border-rose-200 bg-rose-50" }
        ].map((act, i) => (
          <div key={i} className={`p-4 border rounded-xl flex flex-col gap-1.5 ${act.color}`}>
            <span className="font-serif font-black text-sm">{act.label}</span>
            <span className="text-xs leading-relaxed opacity-90">{act.desc}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PanchPakshiTable;

