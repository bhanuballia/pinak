import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import ReportPreview from "../components/ReportPreview";

import { createReport, fetchTimezones, fetchReportData, fetchShodashottari, fetchChaturshitisama, saveProfileToDB, fetchSavedProfiles, fetchProfileById } from "../services/api";

const formatOffset = (offset) => {
  if (typeof offset !== "number" || Number.isNaN(offset)) return "";
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
};

export default function GenerateReport() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:MM
  const [tzOffset, setTzOffset] = useState(5.5); // default IST
  const [latLon, setLatLon] = useState(null); // { lat, lon, display_name, timezone, tz_offset_hours }
  const [style, setStyle] = useState("minimal"); // legacy, mapped to detailed backend
  const [languageMode, setLanguageMode] = useState("english"); // "english"|"hindi"|"bilingual"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFileUrl, setReportFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState("Male");
  const [reportData, setReportData] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [customTimezone, setCustomTimezone] = useState("");
  const [timezonesLoading, setTimezonesLoading] = useState(false);
  const [timezonesError, setTimezonesError] = useState(null);

  // MongoDB state
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showProfilesModal, setShowProfilesModal] = useState(false);
  const [dbStatus, setDbStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function loadTimezones() {
      try {
        setTimezonesLoading(true);
        const tzList = await fetchTimezones();
        if (!active) return;
        setTimezones(tzList);
      } catch (err) {
        if (!active) return;
        setTimezonesError(err?.message || "Failed to load timezones");
      } finally {
        if (active) {
          setTimezonesLoading(false);
        }
      }
    }
    loadTimezones();
    loadProfiles(); // also try to load profiles initially
    return () => {
      active = false;
    };
  }, []);

  const loadProfiles = async () => {
    try {
      const p = await fetchSavedProfiles();
      setSavedProfiles(p || []);
    } catch (e) {
      console.error("Failed to load profiles", e);
    }
  };

  const loadSpecificProfile = async (id) => {
    try {
      setDbStatus("Loading from database...");
      setShowProfilesModal(false);
      const fullProfile = await fetchProfileById(id);

      // Populate form
      setName(fullProfile.name || "");
      setDate(fullProfile.date || "");
      setTime(fullProfile.time || "");
      setGender(fullProfile.gender || "Male");
      if (fullProfile.lat && fullProfile.lon) {
        setLatLon({
          lat: fullProfile.lat,
          lon: fullProfile.lon,
          display_name: fullProfile.location_name || "",
        });
      }
      setTzOffset(fullProfile.tz_offset || 5.5);

      // Auto-load report data if intact
      if (fullProfile.reportData) {
        setReportData(fullProfile.reportData);
      }
      setDbStatus("Loaded profile from database successfully!");
      setTimeout(() => setDbStatus(""), 3000);
    } catch (e) {
      setDbStatus("Error loading profile.");
      console.error(e);
      setTimeout(() => setDbStatus(""), 3000);
    }
  };

  const onPlaceSelected = (place) => {
    setLatLon(place);
    setCustomTimezone(place?.timezone || "");
    if (typeof place?.tz_offset_hours === "number" && !Number.isNaN(place.tz_offset_hours)) {
      setTzOffset(place.tz_offset_hours);
    }
  };

  const handleTimezoneSelect = (e) => {
    const value = e.target.value;
    setCustomTimezone(value);
    if (!value) return;
    const tz = timezones.find((t) => t.name === value);
    if (tz && typeof tz.tz_offset_hours === "number" && !Number.isNaN(tz.tz_offset_hours)) {
      setTzOffset(tz.tz_offset_hours);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setReportData(null);
    setReportFileUrl(null);

    if (!date) {
      setError("Please enter a valid Date of Birth.");
      return;
    }
    if (!time) {
      setError("Please enter a valid Time of Birth.");
      return;
    }
    if (!latLon) {
      setError("Please search for a Birth Place and select a location from the dropdown suggestions.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        date,
        time,
        tz_offset: tzOffset,
        lat: latLon.lat,
        lon: latLon.lon,
        style,
        language: languageMode,
        gender,
        location_name: latLon.display_name,
      };

      const detailedData = await fetchReportData(payload);

      // These are now handled within assemble_report_data on the backend
      // So we don't need to fetch them separately and risk overwriting with empty defaults
      console.log("Detailed report data received:", {
        hasPanchang: !!detailedData.panchang,
        hasShodashottari: !!(detailedData.shodashottari && detailedData.shodashottari.length),
        hasChaturshitisama: !!(detailedData.chaturshitisama && detailedData.chaturshitisama.length),
        hasNumerology: !!detailedData.favourable?.numerology
      });

      setReportData(detailedData);

      // Save to MongoDB
      setDbStatus("Archiving to MongoDB...");
      try {
        await saveProfileToDB({
          ...payload,
          reportData: detailedData
        });
        await loadProfiles(); // refresh the list
        setDbStatus("Saved securely to database!");
        setTimeout(() => setDbStatus(""), 3000);
      } catch (dbErr) {
        setDbStatus("Generated, but could not save to DB.");
        setTimeout(() => setDbStatus(""), 3000);
        console.warn("DB save warn:", dbErr);
      }

      const fileUrl = await createReport(payload);
      setReportFileUrl(fileUrl);
    } catch (err) {
      console.error("Report generation error:", err);
      setError(err?.message || "Failed to generate report. Check backend logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWorksheet = () => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      localStorage.setItem('worksheetData', JSON.stringify(reportData));
      const win = window.open('/?worksheet=true', 'InteractiveWorksheet', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes('worksheet=true')) {
          win.location.reload();
        }
      }
    } catch (e) {
      console.error("LocalStorage save failed:", e);
      setError("Failed to save worksheet data. The data may be too large for your browser's local storage.");
    }
  };

  const handleOpenMatchmaking = () => {
    window.open('/?matchmaking=true', 'DivineCompatibility', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
  };

  const handleKnowIshtaDev = () => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      const combinedData = {
        ishta_devata: reportData.ishta_devata,
        numerology: reportData.numerology || (reportData.favourable ? reportData.favourable.numerology : null)
      };
      localStorage.setItem('ishtaDevData', JSON.stringify(combinedData));
      const win = window.open('/?ishtaDev=true', 'IshtaDevViewer', 'width=800,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes('ishtaDev=true')) {
          win.location.reload();
        }
      }
    } catch (e) {
      console.error("LocalStorage save failed for Ishta Dev:", e);
      setError("Failed to open the Ishta Dev window.");
    }
  };

  const handleOpenHTMLReport = () => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      localStorage.setItem('htmlReportData', JSON.stringify(reportData));
      const win = window.open('/?html_report=true', 'HTMLReportViewer', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes('html_report=true')) {
          win.location.reload();
        }
      }
    } catch (e) {
      console.error("LocalStorage save failed:", e);
      setError("Failed to save report data. The data may be too large for your browser's local storage.");
    }
  };

  const handleOpenHoroscope = () => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      localStorage.setItem('horoscopeData', JSON.stringify(reportData));
      const win = window.open('/?horoscope=true', 'HoroscopePrediction', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes('horoscope=true')) {
          win.location.reload();
        }
      }
    } catch (e) {
      console.error("LocalStorage save failed for Horoscope:", e);
      setError("Failed to open the Horoscope window.");
    }
  };

  const handleOpenAdvancedMuhurt = () => {
    const win = window.open('/?advanced_muhurt=true', 'AdvancedMuhurtaSearch', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenPrashna = () => {
    const win = window.open('/?prashna=true', 'PrashnaEngine', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenNadi = () => {
    const win = window.open('/?nadi=true', 'NadiViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenMantra = () => {
    const win = window.open('/?mantra=true', 'MantraTracker', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenSynastry = () => {
    const win = window.open('/?synastry=true', 'SynastryDashboard', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenStudy = () => {
    const params = new URLSearchParams({
      study: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'StudyViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenFinance = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      finance: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'FinanceViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenMarriage = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      marriage: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'MarriageViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenBusiness = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      business: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'BusinessViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenHealth = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      health: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'HealthViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenParentsHealth = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      parents_health: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'ParentsHealthViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenSpouseHealth = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      spouse_health: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'SpouseHealthViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenChildrenHealth = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      children_health: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'ChildrenHealthViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif italic font-black text-indigo-900 tracking-wide">{t('generate_kundali', 'Generate Kundali')}</h1>
          <div className="flex items-center gap-4">
            {dbStatus && <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded animate-pulse">{dbStatus}</div>}

            <button
              onClick={() => setShowProfilesModal(true)}
              className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-100 flex items-center gap-2"
            >
              <span>🗄️</span> Database ({savedProfiles.length})
            </button>
          </div>
        </div>

        {/* Database Modal */}
        {showProfilesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-indigo-100 max-h-[80vh] overflow-auto relative">
              <button onClick={() => setShowProfilesModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✖</button>
              <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-2">Saved Profiles</h2>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">MongoDB Archive</p>

              {savedProfiles.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-xl">No profiles found in the database.</div>
              ) : (
                <div className="space-y-3">
                  {savedProfiles.map(p => (
                    <button key={p.id} onClick={() => loadSpecificProfile(p.id)} className="w-full text-left p-4 rounded-xl border border-indigo-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group flex justify-between items-center bg-white shadow-sm">
                      <div>
                        <div className="font-bold text-gray-800 text-lg group-hover:text-indigo-800">{p.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500 mt-1">{p.date} • {p.time} • {p.location_name?.split(',')[0]}</div>
                      </div>
                      <div className="text-2xl opacity-10 group-hover:opacity-100 transition-opacity">☁️</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="col-span-1">
              <div className="text-sm text-gray-600">Full name</div>
              <input
                className="mt-1 w-full border rounded p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rahul Sharma"
              />
            </label>

            <label>
              <div className="text-sm text-gray-600">Gender</div>
              <select
                className="mt-1 w-full border rounded p-2"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              <div className="text-sm text-gray-600">Date of birth</div>
              <input
                type="date"
                className="mt-1 w-full border rounded p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label>
              <div className="text-sm text-gray-600">Time of birth</div>
              <input
                type="time"
                className="mt-1 w-full border rounded p-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>

          <div>
            <div className="text-sm text-gray-600">Birth place</div>
            <PlaceAutocomplete value={latLon?.display_name || ""} onSelect={onPlaceSelected} />
            {latLon && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div>
                  Selected: {latLon.display_name} ({latLon.lat.toFixed(4)}, {latLon.lon.toFixed(4)})
                </div>
                {(latLon.timezone || typeof latLon.tz_offset_hours === "number") && (
                  <div>
                    Timezone: {latLon.timezone || "Unknown"}{" "}
                    {typeof latLon.tz_offset_hours === "number"
                      ? `(UTC${latLon.tz_offset_hours >= 0 ? "+" : ""}${latLon.tz_offset_hours})`
                      : ""}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label>
              <div className="text-sm text-gray-600">Timezone offset (hrs)</div>
              <input
                type="number"
                step="0.25"
                className="mt-1 w-full border rounded p-2"
                value={tzOffset}
                onChange={(e) => setTzOffset(parseFloat(e.target.value))}
              />
            </label>

            <label className="md:col-span-2">
              <div className="text-sm text-gray-600">Timezone (optional override)</div>
              <select
                className="mt-1 w-full border rounded p-2"
                value={customTimezone}
                onChange={handleTimezoneSelect}
                disabled={timezonesLoading || !timezones.length}
              >
                <option value="">
                  {timezonesLoading
                    ? "Loading timezones..."
                    : timezones.length
                      ? "Select timezone"
                      : "Timezone list unavailable"}
                </option>
                {timezones.map((tz) => (
                  <option key={tz.name} value={tz.name}>
                    {tz.name}
                    {typeof tz.tz_offset_hours === "number"
                      ? ` (${formatOffset(tz.tz_offset_hours)})`
                      : ""}
                  </option>
                ))}
              </select>
              {timezonesError && <div className="text-xs text-red-500 mt-1">{timezonesError}</div>}
            </label>

            <label>
              <div className="text-sm text-gray-600">Report style</div>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="minimal">Minimal (10–12 pages)</option>
                <option value="premium">Premium (40+ pages)</option>
              </select>
            </label>

            <label>
              <div className="text-sm text-gray-600">Language</div>
              <select
                value={languageMode}
                onChange={(e) => setLanguageMode(e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="english">English (Default)</option>
              </select>
            </label>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? t('generating', 'Generating...') : t('generate_pdf', 'Generate & Download PDF')}
            </button>

            {reportFileUrl && (
              <a
                href={reportFileUrl}
                download
                className="text-indigo-600 underline ml-2"
                target="_blank"
                rel="noreferrer"
              >
                Open latest report
              </a>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 border-b pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">Preview Results</h2>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={handleOpenWorksheet}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-purple-600 text-black shadow hover:bg-purple-700 flex items-center gap-2"
                >
                  <span>✨</span> Open Interactive Worksheet
                </button>
                <button
                  onClick={handleOpenHTMLReport}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-blue-600 text-black shadow hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>🌐</span> Your Kundali (Detailed Report)
                </button>
                <button
                  onClick={handleOpenHoroscope}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-amber-500 text-black shadow hover:bg-amber-600 flex items-center gap-2"
                >
                  <span>🌟</span> Daily/Monthly/Yearly Horoscope
                </button>
                <button
                  onClick={handleKnowIshtaDev}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-indigo-600 text-black shadow hover:bg-indigo-700 flex items-center gap-2"
                >
                  <span>🖥️</span> Know Your Ishta Dev
                </button>
                <button
                  onClick={handleOpenMatchmaking}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-pink-600 text-black shadow hover:bg-pink-700 flex items-center gap-2"
                >
                  <span>💏</span> Match Making
                </button>
                <button
                  onClick={handleOpenAdvancedMuhurt}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-teal-600 text-black shadow hover:bg-teal-700 flex items-center gap-2"
                >
                  <span>✨</span> Advanced Muhurt Calculator
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={handleOpenPrashna}
                className="px-4 py-1.5 rounded-full text-[15px]  font-bold transition-all bg-amber-500 text-black shadow hover:bg-amber-600 flex items-center gap-2"
              >
                <span>🔮</span> Ask Prashna
              </button>
              <button
                onClick={handleOpenNadi}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-blue-600 text-black shadow hover:bg-blue-700 flex items-center gap-2"
              >
                <span>📜</span> Nadi Astrology
              </button>
              <button
                onClick={handleOpenMantra}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-teal-600 text-black shadow hover:bg-teal-700 flex items-center gap-2"
              >
                <span>📿</span> Japa Mala (Mantras)
              </button>
              <button
                onClick={handleOpenSynastry}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-pink-600 text-black shadow hover:bg-pink-700 flex items-center gap-2"
              >
                <span>🔮</span> Synastry Matrix
              </button>

            </div>
          </div>

          <div className="space-y-4 animate-in fade-in duration-500">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">PDF Document Preview</h3>
              <ReportPreview fileUrl={reportFileUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
