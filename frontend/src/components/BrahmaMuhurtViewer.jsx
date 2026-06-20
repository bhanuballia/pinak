import React, { useState, useEffect } from 'react';
import { fetchDailyPanchang } from '../services/api';

export default function BrahmaMuhurtViewer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAlarms, setSelectedAlarms] = useState([]);
    const [customAlarm, setCustomAlarm] = useState("");
    const [locationName, setLocationName] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
    });
    const [currentLocation, setCurrentLocation] = useState(null);

    const loadPanchangData = async (lat, lon, tz, locName = "", targetDate = "") => {
        try {
            setLoading(true);
            if (locName) setLocationName(locName);
            setCurrentLocation({ lat, lon, tz, name: locName });

            const res = await fetchDailyPanchang(lat, lon, tz, targetDate);
            setData(res);

            // Pre-calculate suggested alarms based on next brahma muhurta
            if (res?.muhurtas?.next_brahma_muhurta) {
                const bm = res.muhurtas.next_brahma_muhurta;
                const startTime = parseTimeStr(bm.start, targetDate);
                const endTime = parseTimeStr(bm.end, targetDate);
                if (startTime && endTime) {
                    const intervals = [];
                    let curr = new Date(startTime);
                    while (curr <= endTime) {
                        intervals.push(formatTimeObj(curr));
                        curr = new Date(curr.getTime() + 12 * 60000); // add 12 mins
                    }
                    setSelectedAlarms([formatTimeObj(startTime)]); // select first by default
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const getFallbackLocation = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const urlLat = urlParams.get('lat');
            const urlLon = urlParams.get('lon');
            const urlTz = urlParams.get('tz');

            let name = "";
            let lat = urlLat ? parseFloat(urlLat) : NaN;
            let lon = urlLon ? parseFloat(urlLon) : NaN;
            let tz = urlTz ? parseFloat(urlTz) : 5.5;

            if (Number.isNaN(lat) || Number.isNaN(lon)) {
                lat = 28.6139; lon = 77.2090; tz = 5.5; name = "New Delhi, India"; // Default New Delhi
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    if (parsed.basic_details) {
                        lat = parsed.basic_details.lat || lat;
                        lon = parsed.basic_details.lon || lon;
                        tz = (new Date().getTimezoneOffset() / -60.0);
                        name = parsed.basic_details.location_name || name;
                    }
                }
            } else {
                name = "Report Location";
            }
            return { lat, lon, tz, name };
        };

        const initPanchang = () => {
            if (!currentLocation) {
                const fallback = getFallbackLocation();
                loadPanchangData(fallback.lat, fallback.lon, fallback.tz, fallback.name, selectedDate);
            } else {
                loadPanchangData(currentLocation.lat, currentLocation.lon, currentLocation.tz, currentLocation.name, selectedDate);
            }
        };

        initPanchang();

        return () => { isMounted = false; };
    }, [selectedDate]);

    const parseTimeStr = (timeStr, baseDateStr = "") => {
        // timeStr format: "04:32 AM"
        if (!timeStr) return null;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (hours === 12 && modifier === 'AM') hours = 0;
        if (hours < 12 && modifier === 'PM') hours += 12;

        const d = baseDateStr ? new Date(baseDateStr) : new Date(); // Tomorrow relative to baseDateStr
        d.setDate(d.getDate() + 1);
        d.setHours(hours, parseInt(minutes, 10), 0, 0);
        return d;
    };

    const formatTimeObj = (dateObj) => {
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    const handleToggleAlarm = (time) => {
        if (selectedAlarms.includes(time)) {
            setSelectedAlarms(selectedAlarms.filter(t => t !== time));
        } else {
            setSelectedAlarms([...selectedAlarms, time]);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    let locName = "Current Device Location";
                    try {
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
                        const geoData = await geoRes.json();
                        if (geoData && geoData.display_name) {
                            locName = geoData.display_name;
                        }
                    } catch (e) {
                        console.warn("Reverse geocoding failed", e);
                    }

                    setLocationName(locName);

                    const currentTz = (new Date().getTimezoneOffset() / -60.0);
                    loadPanchangData(lat, lon, currentTz, locName, selectedDate);
                } catch (err) {
                    setError(err.message);
                }
            },
            (err) => {
                setLoading(false);
                alert("Could not get your location. Please ensure location services are enabled.");
                console.error(err);
            },
            { timeout: 10000 }
        );
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const handleAddCustomAlarm = () => {
        if (customAlarm) {
            // Basic validation
            const match = customAlarm.match(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i);
            if (!match) {
                alert("Please use format HH:MM AM/PM");
                return;
            }

            // Format string neatly
            let [timePart, modifier] = customAlarm.toUpperCase().split(/\s+/);
            if (!modifier) {
                // In case there was no space, the regex still matched because of \s*
                const ampmMatch = customAlarm.toUpperCase().match(/(AM|PM)/);
                if (ampmMatch) {
                    modifier = ampmMatch[0];
                    timePart = customAlarm.toUpperCase().replace(modifier, '').trim();
                }
            }
            // Add leading zero to hour if needed
            let [hh, mm] = timePart.split(':');
            hh = hh.padStart(2, '0');
            const timeStr = `${hh}:${mm} ${modifier}`;

            // Validate against Brahma Muhurta window
            const bmNext = data?.muhurtas?.next_brahma_muhurta;
            if (bmNext) {
                const startObj = parseTimeStr(bmNext.start, selectedDate);
                const endObj = parseTimeStr(bmNext.end, selectedDate);
                const customObj = parseTimeStr(timeStr, selectedDate);

                if (startObj && endObj && customObj) {
                    if (customObj < startObj || customObj > endObj) {
                        alert("Select a Time Between Braham Muhurt Time");
                        return;
                    }
                }
            }

            if (!selectedAlarms.includes(timeStr)) {
                setSelectedAlarms([...selectedAlarms, timeStr]);
            }
            setCustomAlarm("");
        }
    };

    const generateICS = () => {
        if (selectedAlarms.length === 0) {
            alert("Please select at least one time for the alarm.");
            return;
        }

        let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//VedicAstrologyApp//BrahmaMuhurta//EN\n";

        selectedAlarms.forEach((timeStr, idx) => {
            const dateObj = parseTimeStr(timeStr);
            if (!dateObj) return;

            const dtstart = dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const dtend = new Date(dateObj.getTime() + 10 * 60000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 10 min duration

            icsData += "BEGIN:VEVENT\n";
            icsData += `UID:brahmamuhurta-${idx}-${Date.now()}@vedic.app\n`;
            icsData += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
            icsData += `DTSTART:${dtstart}\n`;
            icsData += `DTEND:${dtend}\n`;
            icsData += `SUMMARY:Brahma Muhurta Awakening\n`;
            icsData += `DESCRIPTION:It's time for Brahma Muhurta. Spiritual practice is highly recommended now.\n`;
            icsData += "BEGIN:VALARM\n";
            icsData += "ACTION:DISPLAY\n";
            icsData += "DESCRIPTION:Brahma Muhurta Reminder\n";
            icsData += "TRIGGER:-PT0M\n";
            icsData += "END:VALARM\n";
            icsData += "END:VEVENT\n";
        });

        icsData += "END:VCALENDAR";

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'BrahmaMuhurta_Alarms.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
            <div className="text-orange-500 animate-pulse text-2xl font-serif">Calculating Brahma Muhurta...</div>
        </div>
    );

    if (error) return <div className="min-h-screen p-8 text-red-500">Error: {error}</div>;

    const bmToday = data?.muhurtas?.brahma_muhurta;
    const bmNext = data?.muhurtas?.next_brahma_muhurta;

    const suggestedTimes = [];
    if (bmNext) {
        const start = parseTimeStr(bmNext.start, selectedDate);
        const end = parseTimeStr(bmNext.end, selectedDate);
        if (start && end) {
            let curr = new Date(start);
            while (curr <= end) {
                suggestedTimes.push(formatTimeObj(curr));
                curr = new Date(curr.getTime() + 12 * 60000); // 12 mins intervals
            }
        }
    }

    // Add any custom alarms that aren't in suggestedTimes so they display as buttons
    const allDisplayTimes = [...suggestedTimes];
    selectedAlarms.forEach(t => {
        if (!allDisplayTimes.includes(t)) {
            allDisplayTimes.push(t);
        }
    });
    // Sort times
    allDisplayTimes.sort((a, b) => parseTimeStr(a, selectedDate) - parseTimeStr(b, selectedDate));

    const isToday = selectedDate === (new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-white font-serif relative overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/deities/brahammuhurt1.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay to ensure text remains readable over the video */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-0"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="absolute top-8 left-8 flex items-center gap-3 bg-slate-800/80 p-2 pl-4 rounded-full border border-orange-500/30 shadow-lg">
                    <label className="text-orange-200 text-sm font-bold uppercase tracking-widest cursor-pointer" htmlFor="datePicker">Date</label>
                    <input
                        id="datePicker"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="bg-transparent text-orange-400 font-bold text-sm outline-none cursor-pointer"
                    />
                </div>

                <div className="absolute top-8 right-8">
                    <button
                        onClick={handleUseCurrentLocation}
                        className="bg-slate-800/80 hover:bg-slate-700 text-orange-100 border border-orange-500/30 px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                    >
                        <span>📍</span> Use Device Location
                    </button>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-orange-400 mb-4 italic">Brahma Muhurta</h1>
                    <p className="text-xl text-orange-200/70">The Creator's Hour for Spiritual Awakening</p>
                    {locationName && (
                        <p className="mt-4 text-xl text-orange-100 bg-slate-800/50 inline-block px-4 py-1.5 rounded-full border border-slate-700">
                            📍 {locationName}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-orange-500/20 shadow-2xl backdrop-blur-sm">
                        <div className="text-orange-100 text-sm font-bold uppercase tracking-widest mb-2">
                            {isToday ? "Today's Window" : "Selected Date"}
                        </div>
                        <div className="text-4xl font-black text-white mb-2">
                            {bmToday ? `${bmToday.start} - ${bmToday.end}` : 'N/A'}
                        </div>
                        <div className="text-slate-400 text-sm">{isToday ? "Ended for today" : selectedDate}</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600/20 to-red-900/40 p-8 rounded-3xl border border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.2)] backdrop-blur-sm">
                        <div className="text-orange-200 text-sm font-bold uppercase tracking-widest mb-2">
                            {isToday ? "Tomorrow's Window" : "Next Day"}
                        </div>
                        <div className="text-4xl font-black text-white mb-2">
                            {bmNext ? `${bmNext.start} - ${bmNext.end}` : 'N/A'}
                        </div>
                        <div className="text-orange-200/80 text-sm">Upcoming Morning</div>
                    </div>
                </div>

                <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-xl">
                    <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                        <span>⏰</span> Set Awakening Alarms
                    </h2>
                    <p className="text-slate-300 mb-6">
                        Select multiple times within the {isToday ? "tomorrow's" : "next day's"} Brahma Muhurta to create a calendar event with alarms.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        {allDisplayTimes.map((time, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleToggleAlarm(time)}
                                className={`px-6 py-3 rounded-full font-bold transition-all ${selectedAlarms.includes(time)
                                    ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                                    : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="e.g. 04:45 AM"
                            value={customAlarm}
                            onChange={(e) => setCustomAlarm(e.target.value)}
                            className="bg-slate-900 border border-slate-600 rounded-full px-6 py-3 text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={handleAddCustomAlarm}
                            className="bg-slate-700 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-600"
                        >
                            Add Custom Time
                        </button>
                    </div>

                    <div className="border-t border-slate-700 pt-8 flex justify-between items-center">
                        <div className="text-slate-400">
                            Selected Alarms: <span className="text-orange-400 font-bold">{selectedAlarms.length}</span>
                        </div>
                        <button
                            onClick={generateICS}
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105 active:scale-95"
                        >
                            Download Alarms (.ics)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
