import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import ReportPreview from "../components/ReportPreview";
import LanguageSwitcher from "../components/LanguageSwitcher";

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
  const [showPreview, setShowPreview] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showWelcomePoster, setShowWelcomePoster] = useState(true);
  const [onlyNameAndDate, setOnlyNameAndDate] = useState(false);

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
    if (!onlyNameAndDate) {
      if (!time) {
        setError("Please enter a valid Time of Birth.");
        return;
      }
      if (!latLon) {
        setError("Please search for a Birth Place and select a location from the dropdown suggestions.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const finalTime = onlyNameAndDate ? "12:00" : time;
      const finalLatLon = onlyNameAndDate
        ? { lat: 28.6139, lon: 77.2090, display_name: "New Delhi, Delhi, India" }
        : latLon;
      const finalTzOffset = onlyNameAndDate ? 5.5 : tzOffset;

      const payload = {
        name,
        date,
        time: finalTime,
        tz_offset: finalTzOffset,
        lat: finalLatLon.lat,
        lon: finalLatLon.lon,
        style,
        language: languageMode,
        gender,
        location_name: finalLatLon.display_name,
        is_approximate: onlyNameAndDate
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

      // Show success toast
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 4000);


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

  const handleOpenBlankSheet = () => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      localStorage.setItem('worksheetData', JSON.stringify(reportData));
      const win = window.open('/?blank_sheet=true', 'BlankSheetViewer', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes('blank_sheet=true')) {
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

  const handleOpenBiodata = () => {
    window.open('/?biodata=true', 'BiodataGenerator', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
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

  const handleOpenDeepHoroscope = (type) => {
    if (!reportData) {
      setError("Please generate a report first.");
      return;
    }
    try {
      localStorage.setItem('deepHoroscopeData', JSON.stringify(reportData));
      const win = window.open(`/?deep_horoscope=${type}`, 'DeepHoroscopeViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (win) {
        win.focus();
        if (win.location.search.includes(`deep_horoscope=${type}`)) {
          win.location.reload();
        }
      }
    } catch (e) {
      console.error("LocalStorage save failed for Deep Horoscope:", e);
      setError("Failed to open the Deep Horoscope window.");
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

  const handleOpenAshtamangala = () => {
    const win = window.open('/?ashtamangala=true', 'AshtamangalaPrasna', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenBTR = () => {
    const win = window.open('/?btr=true', 'BTRWizard', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenKPAstrology = () => {
    const win = window.open('/?kp_astrology=true', 'KPEngine', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
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

  const handleOpenBrahmaMuhurt = () => {
    const win = window.open('/?brahma_muhurt=true', 'BrahmaMuhurtViewer', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no');
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

  const handleOpenMentalPeace = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      mental_peace: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'MentalPeaceViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenHomePeace = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      home_peace: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '0'
    });
    const win = window.open(`/?${params.toString()}`, 'HomePeaceViewer', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenVastu = () => {
    const params = new URLSearchParams({
      vastu: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'VastuAnalyzer', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenNumerology = () => {
    const params = new URLSearchParams({
      numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'NumerologyDashboard', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenPredictionNumerology = () => {
    const params = new URLSearchParams({
      prediction_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'PredictionNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenDailyNumerology = () => {
    const params = new URLSearchParams({
      daily_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'DailyNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenRemedyNumerology = () => {
    const params = new URLSearchParams({
      remedy_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'RemedyNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenMedicalNumerology = () => {
    const params = new URLSearchParams({
      medical_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'MedicalNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenPersonalityNumerology = () => {
    const params = new URLSearchParams({
      personality_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'PersonalityNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenMarriageNumerology = () => {
    const params = new URLSearchParams({
      marriage_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'MarriageNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenCarrierNumerology = () => {
    const params = new URLSearchParams({
      carrier_numerology: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'CarrierNumerology', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const handleOpenRemedies = () => {
    if (reportData) {
      try { localStorage.setItem('worksheetData', JSON.stringify(reportData)); } catch (e) { }
    }
    const params = new URLSearchParams({
      remedy: 'true',
      name: name || '',
      date: date || '',
      time: time || '',
      lat: latLon?.lat || '',
      lon: latLon?.lon || '',
      tz: tzOffset || '5.5',
      loc: latLon?.display_name || ''
    });
    const win = window.open(`/?${params.toString()}`, 'RemedyViewer', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Welcome Poster Modal */}
      {showWelcomePoster && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-transparent animate-in zoom-in-95 duration-300 mt-16">

            {/* Overlapping Circular Video Badge (Ganesh Ji position) */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-amber-500 bg-white overflow-hidden shadow-2xl z-20 flex items-center justify-center">
              <video
                src="/deities/navgrah.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main Poster Content */}
            <div className="relative rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl bg-white flex flex-col">
              <button
                onClick={() => setShowWelcomePoster(false)}
                className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
                title="Close"
              >
                ✖
              </button>
              <img
                src="/deities/shekar4.png"
                alt="Welcome Poster"
                className="w-full h-auto object-contain"
              />
              <div className="w-full bg-amber-500 py-1 text-center text-black text-[20px] font-black uppercase tracking-widest border-t border-amber-600 shadow-inner">
                " शेखर "
              </div>
              <div className="w-full bg-amber-500 py-1 text-center text-black text-[20px] font-black uppercase tracking-widest border-t border-amber-600 shadow-inner">
                "ज्योतिषाचार्य"
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Success Toast */}
      {reportSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-lg font-bold border-2 border-green-400">
            <span className="text-2xl">✅</span> Reports Generated
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif italic font-black text-indigo-900 tracking-wide">{t('generate_kundali', 'Generate Kundali')}</h1>
          <div className="flex items-center gap-4">
            {dbStatus && <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded animate-pulse">{dbStatus}</div>}

            <button
              onClick={() => setShowProfilesModal(true)}
              className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-100 flex items-center gap-2"
            >
              <span>🗄️</span> {t('database')} ({savedProfiles.length})
            </button>
          </div>
        </div>

        {/* Database Modal */}
        {showProfilesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-indigo-100 max-h-[80vh] overflow-auto relative">
              <button onClick={() => setShowProfilesModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✖</button>
              <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-2">{t('saved_profiles')}</h2>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">{t('mongodb_archive')}</p>

              {savedProfiles.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-xl">{t('no_profiles_found')}</div>
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
          <div className="flex items-center gap-2 mb-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
            <input
              type="checkbox"
              id="approximateMode"
              checked={onlyNameAndDate}
              onChange={(e) => setOnlyNameAndDate(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="approximateMode" className="text-sm font-semibold text-indigo-900 cursor-pointer">
              I don't know my exact birth time or location (Use default time & location)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="col-span-1">
              <div className="text-sm text-gray-600">{t('full_name')}</div>
              <input
                className="mt-1 w-full border rounded p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('eg_name')}
              />
            </label>

            <label>
              <div className="text-sm text-gray-600">{t('gender')}</div>
              <select
                className="mt-1 w-full border rounded p-2"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </label>

            <label>
              <div className="text-sm text-gray-600">{t('date_of_birth')}</div>
              <input
                type="date"
                className="mt-1 w-full border rounded p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            {!onlyNameAndDate && (
              <label>
                <div className="text-sm text-gray-600">{t('time_of_birth')}</div>
                <input
                  type="time"
                  className="mt-1 w-full border rounded p-2"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            )}
          </div>

          {!onlyNameAndDate && (
            <>
              <div>
                <div className="text-sm text-gray-600">{t('birth_place')}</div>
                <PlaceAutocomplete value={latLon?.display_name || ""} onSelect={onPlaceSelected} />
                {latLon && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div>
                      {t('selected')}: {latLon.display_name} ({latLon.lat.toFixed(4)}, {latLon.lon.toFixed(4)})
                    </div>
                    {(latLon.timezone || typeof latLon.tz_offset_hours === "number") && (
                      <div>
                        {t('timezone')}: {latLon.timezone || "Unknown"}{" "}
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
                  <div className="text-sm text-gray-600">{t('timezone_offset')}</div>
                  <input
                    type="number"
                    step="0.25"
                    className="mt-1 w-full border rounded p-2"
                    value={tzOffset}
                    onChange={(e) => setTzOffset(parseFloat(e.target.value))}
                  />
                </label>

                <label className="md:col-span-2">
                  <div className="text-sm text-gray-600">{t('timezone_override')}</div>
                  <select
                    className="mt-1 w-full border rounded p-2"
                    value={customTimezone}
                    onChange={handleTimezoneSelect}
                    disabled={timezonesLoading || !timezones.length}
                  >
                    <option value="">
                      {timezonesLoading
                        ? t('loading_timezones')
                        : timezones.length
                          ? t('select_timezone')
                          : t('timezone_unavailable')}
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
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label>
              <div className="text-sm text-gray-600">{t('report_style')}</div>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="minimal">{t('minimal_report')}</option>
                <option value="premium">{t('premium_report')}</option>
              </select>
            </label>

            <label>
              <div className="text-sm text-gray-600">{t('language')}</div>
              <select
                value={languageMode}
                onChange={(e) => setLanguageMode(e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="english">{t('english_default', 'English (Default)')}</option>
                <option value="hi">{t('hindi', 'Hindi (Native)')}</option>
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


          </div>
        </form>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 border-b pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">{t('preview_results')}</h2>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={handleOpenWorksheet}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-purple-100 text-black shadow hover:bg-purple-700 flex items-center gap-2"
                >
                  <span>✨</span> {t('open_worksheet')}
                </button>
                <button
                  onClick={handleOpenBlankSheet}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-slate-200 text-black shadow hover:bg-slate-300 flex items-center gap-2"
                >
                  <span>📝</span> {t('blank_sheet', 'Blank Sheet')}
                </button>
                <button
                  onClick={handleOpenHTMLReport}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-50 text-rose-950 border border-rose-200 shadow hover:bg-rose-600 hover:text-white flex items-center gap-2"
                >
                  <span>🌐</span> {t('detailed_report')}
                </button>
                <button
                  onClick={handleOpenRemedies}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-amber-100 text-black shadow hover:bg-amber-600 flex items-center gap-2"
                >
                  <span>📿</span> Remedy
                </button>
                <div className="flex bg-amber-100 rounded-full border border-amber-300 shadow overflow-hidden">
                  <div className="px-3 py-1.5 bg-amber-100 text-black font-bold border-r border-amber-300 flex items-center text-[13px] tracking-tight">
                    Detailed Horoscopes:
                  </div>
                  <button
                    onClick={() => handleOpenDeepHoroscope('daily')}
                    className="px-3 py-1.5 text-[14px] font-bold transition-all bg-amber-50 text-amber-900 hover:bg-amber-500 hover:text-black border-r border-amber-200 flex items-center gap-1"
                  >
                    <span>🌟</span> Daily
                  </button>
                  <button
                    onClick={() => handleOpenDeepHoroscope('monthly')}
                    className="px-3 py-1.5 text-[14px] font-bold transition-all bg-amber-50 text-amber-900 hover:bg-amber-500 hover:text-black border-r border-amber-200 flex items-center gap-1"
                  >
                    <span>🌙</span> Monthly
                  </button>
                  <button
                    onClick={() => handleOpenDeepHoroscope('yearly')}
                    className="px-3 py-1.5 text-[14px] font-bold transition-all bg-amber-50 text-amber-900 hover:bg-amber-500 hover:text-black flex items-center gap-1"
                  >
                    <span>☀️</span> Yearly
                  </button>
                </div>
                <button
                  onClick={handleKnowIshtaDev}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-indigo-100 text-black shadow hover:bg-indigo-700 flex items-center gap-2"
                >
                  <span>🖥️</span> {t('ishta_dev')}
                </button>
                <button
                  onClick={handleOpenMatchmaking}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-pink-100 text-black shadow hover:bg-pink-700 flex items-center gap-2"
                >
                  <span>💏</span> {t('match_making')}
                </button>
                <button
                  onClick={() => window.open('/?compatibility-hub=true&calculator=weekly-relationship', 'WeeklyRelationshipHoroscope', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no')}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-100 text-black shadow hover:bg-rose-700 flex items-center gap-2"
                >
                  <span>💑</span> Weekly Relationship Horoscope
                </button>
                <button
                  onClick={() => window.open('/?compatibility-hub=true', 'LoveCalculator', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no')}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-100 text-black shadow hover:bg-rose-700 flex items-center gap-2"
                >
                  <span>💖</span> Love Calculator
                </button>
                <button
                  onClick={handleOpenBiodata}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-emerald-100 text-black shadow hover:bg-emerald-600 flex items-center gap-2"
                >
                  <span>📋</span> Bio Data
                </button>
                <button
                  onClick={handleOpenAdvancedMuhurt}
                  className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-teal-100 text-black shadow hover:bg-teal-700 flex items-center gap-2"
                >
                  <span>✨</span> {t('muhurt_calculator')}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={handleOpenPrashna}
                className="px-4 py-1.5 rounded-full text-[15px]  font-bold transition-all bg-amber-100 text-black shadow hover:bg-amber-600 flex items-center gap-2"
              >
                <span>🔮</span> {t('ask_prashna')}
              </button>
              <button
                onClick={handleOpenAshtamangala}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-red-100 text-black shadow hover:bg-red-700 flex items-center gap-2"
              >
                <span>🐚</span> Astamangala Prasna
              </button>
              <button
                onClick={handleOpenBTR}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-indigo-100 text-black shadow hover:bg-indigo-700 flex items-center gap-2"
              >
                <span>⏱️</span> Birth Time Rectification
              </button>
              <button
                onClick={handleOpenKPAstrology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-teal-100 text-black shadow hover:bg-teal-700 flex items-center gap-2"
              >
                <span>⭐</span> KP Astrology
              </button>
              <button
                onClick={handleOpenNadi}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-blue-100 text-black shadow hover:bg-blue-700 flex items-center gap-2"
              >
                <span>📜</span> {t('nadi_astrology')}
              </button>
              <button
                onClick={handleOpenMantra}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-teal-100 text-black shadow hover:bg-teal-700 flex items-center gap-2"
              >
                <span>📿</span> {t('japa_mala')}
              </button>
              <button
                onClick={handleOpenBrahmaMuhurt}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-orange-100 text-black shadow hover:bg-orange-700 flex items-center gap-2"
              >
                <span>🌅</span> {t('brahma_muhurt')}
              </button>
              <button
                onClick={() => {
                  const win = window.open('/?kurma_chakra=true', 'KurmaChakraViewer', 'width=1100,height=800,menubar=no,toolbar=no,location=no,status=no');
                  if (win) win.focus();
                }}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-indigo-100 text-black shadow hover:bg-indigo-700 flex items-center gap-2"
              >
                <span>🐢</span> Kurma Chakra
              </button>
              <button
                onClick={() => {
                  const win = window.open('/?chaitra_chart=true', 'ChaitraChartViewer', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
                  if (win) win.focus();
                }}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-amber-100 text-black shadow hover:bg-amber-600 flex items-center gap-2"
              >
                <span>👑</span> Chaitra Chart (Yearly)
              </button>
              <button
                onClick={() => {
                  const win = window.open('/?sanghatta=true', 'SanghattaDashboard', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes');
                  if (win) win.focus();
                }}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-100 text-black shadow hover:bg-rose-600 flex items-center gap-2"
              >
                <span>⚔️</span> Sanghatta Chakra
              </button>
              <button
                onClick={handleOpenVastu}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-50 text-black shadow hover:bg-rose-600 flex items-center gap-2"
              >
                <span>🏡</span> Vastu Shastra
              </button>
              <button
                onClick={handleOpenNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-50 text-black shadow hover:bg-rose-600 flex items-center gap-2"
              >
                <span>🔮</span> Numerology
              </button>
              <button
                onClick={handleOpenPredictionNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-amber-100 text-amber-950 shadow hover:bg-amber-600 hover:text-white flex items-center gap-2 border border-amber-300"
              >
                <span>⭐</span> Special Yogas & Numerology Prediction Page
              </button>
              <button
                onClick={handleOpenDailyNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-rose-100 text-rose-950 shadow hover:bg-rose-600 hover:text-white flex items-center gap-2 border border-rose-300"
              >
                <span>☀️</span> Daily Numerology Forecast
              </button>
              <button
                onClick={handleOpenRemedyNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-purple-100 text-purple-950 shadow hover:bg-purple-600 hover:text-white flex items-center gap-2 border border-purple-300"
              >
                <span>💎</span> Powerful Numerology Remedies
              </button>
              <button
                onClick={handleOpenMedicalNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-emerald-100 text-emerald-950 shadow hover:bg-emerald-600 hover:text-white flex items-center gap-2 border border-emerald-300"
              >
                <span>🏥</span> Medical Numerology Diagnostics
              </button>
              <button
                onClick={handleOpenPersonalityNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-sky-100 text-sky-950 shadow hover:bg-sky-600 hover:text-white flex items-center gap-2 border border-sky-300"
              >
                <span>🧠</span> Personality & Decision Numerology Matrix
              </button>
              <button
                onClick={handleOpenMarriageNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-pink-100 text-pink-950 shadow hover:bg-pink-600 hover:text-white flex items-center gap-2 border border-pink-300"
              >
                <span>💖</span> Marriage & Love Numerology Prediction
              </button>
              <button
                onClick={handleOpenCarrierNumerology}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-blue-100 text-blue-950 shadow hover:bg-blue-600 hover:text-white flex items-center gap-2 border border-blue-300"
              >
                <span>💼</span> Career & Wealth Numerology Prediction
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    numerology: 'true',
                    tab: 'quantum',
                    name: name || '',
                    date: date || '',
                    time: time || '',
                    lat: latLon?.lat || '',
                    lon: latLon?.lon || '',
                    tz: tzOffset || '5.5',
                    loc: latLon?.display_name || ''
                  });
                  const win = window.open(`/?${params.toString()}`, 'QuantumNumerologyDashboard', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
                  if (win) win.focus();
                }}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-purple-100 text-purple-950 shadow hover:bg-purple-600 hover:text-white flex items-center gap-2 border border-purple-300"
              >
                <span>⚛️</span> Quantum Numerology
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    numerology: 'true',
                    tab: 'mobile',
                    name: name || '',
                    date: date || '',
                    time: time || '',
                    lat: latLon?.lat || '',
                    lon: latLon?.lon || '',
                    tz: tzOffset || '5.5',
                    loc: latLon?.display_name || ''
                  });
                  const win = window.open(`/?${params.toString()}`, 'MobileNumerologyDashboard', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
                  if (win) win.focus();
                }}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-all bg-emerald-100 text-emerald-950 shadow hover:bg-emerald-600 hover:text-white flex items-center gap-2 border border-emerald-300"
              >
                <span>📱</span> Mobile Numerology
              </button>

            </div>
          </div>

          {showPreview && (
            <div className="space-y-4 animate-in fade-in duration-500 mt-6 border-t pt-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">{t('pdf_preview')}</h3>
                <ReportPreview fileUrl={reportFileUrl} />
              </div>
            </div>
          )}

          <footer className="w-full text-center py-8 text-slate-500 text-xs font-semibold mt-12 border-t border-slate-100">
            Copyright © 2026 Phanom Technologies. All Rights Reserved
          </footer>
        </div>
      </div>
    </div>
  );
}
