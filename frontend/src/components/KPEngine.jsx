import React, { useState, useEffect } from 'react';

const PREDEFINED_QUESTIONS = {
    "Marriage / Relationship": [
        "Will I get married soon?",
        "When will I get married?",
        "Is this the right time for marriage?",
        "Will my marriage be delayed?",
        "Will I have a love marriage or arranged marriage?",
        "Will my marriage proposal succeed?",
        "Is the current relationship leading to marriage?",
        "Will I marry the person I love?",
        "Is there another marriage indication in my chart?",
        "Will there be obstacles to my marriage?",
        "Does my partner truly love me?",
        "Is my partner loyal and faithful?",
        "Will reconciliation happen after separation?",
        "Will my ex return?",
        "Is my current relationship stable?",
        "Are hidden problems present in this relationship?",
        "Should I continue this relationship?",
        "Will our families approve?",
        "Is there a third person involved?",
        "Will this relationship end in commitment?"
    ],
    "Career / Job": [
        "Will I get a job soon?",
        "When will I receive employment?",
        "Will I clear my interview?",
        "Should I change my current job?",
        "Will I receive a promotion?",
        "Will my salary increase?",
        "Should I continue in my present company?",
        "Will I get a government job?",
        "Is business better than service for me?",
        "Will I get an overseas job opportunity?",
        "Should I start my own business?",
        "Will my startup succeed?",
        "Will my career improve this year?",
        "Is job loss indicated?",
        "Will I be transferred?"
    ],
    "Wealth / Finance": [
        "Will my financial condition improve?",
        "Will I recover my blocked money?",
        "Will I receive an inheritance?",
        "Is this the right time to invest?",
        "Will I gain profit from this business?",
        "Should I purchase shares or mutual funds?",
        "Will I be able to repay my debts?",
        "Will I receive the expected payment?",
        "Is there a chance of sudden wealth?",
        "Will I buy a house this year?",
        "Will I purchase a vehicle?",
        "Is this property investment favorable?",
        "Will my loan be approved?",
        "Is there a risk of financial loss?",
        "Will legal disputes affect my finances?"
    ],
    "Health / Disease": [
        "Will I recover from my illness?",
        "Is the disease serious?",
        "What is the likely duration of this illness?",
        "Will surgery be successful?",
        "Should surgery be avoided?",
        "Is hospitalization indicated?",
        "Will medical treatment work?",
        "Is there a hidden disease?",
        "Will the patient regain full health?",
        "Is this health condition temporary?",
        "Are there chances of relapse?",
        "Is stress affecting my health?",
        "Should I seek a second medical opinion?",
        "Is this the right time for treatment?",
        "Will alternative therapies help?"
    ],
    "Missing Item / Property": [
        "Will my lost item be recovered?",
        "Where is the missing object located?",
        "Was the item stolen or misplaced?",
        "Who took the missing item?",
        "Will the missing person return safely?",
        "Will I recover my lost documents?",
        "Is the property dispute resolvable?",
        "Will I regain possession of my property?",
        "Is the item nearby or far away?",
        "How long will it take to recover it?",
        "Is the missing item permanently lost?",
        "Can legal action help recover it?",
        "Was the loss caused by negligence?",
        "Is someone hiding the object?",
        "What direction should I search?"
    ],
    "Children": [
        "Will I have children?",
        "When will childbirth occur?",
        "Is there delay in childbirth?",
        "Will fertility treatment succeed?",
        "Will I have a healthy child?",
        "Is adoption indicated?",
        "Will I have more than one child?",
        "Is there a possibility of miscarriage?",
        "Will the pregnancy proceed safely?",
        "Will my child be successful?",
        "Are there obstacles in conception?",
        "Will I have a son or daughter?",
        "Should medical intervention be pursued?",
        "Will the child be born this year?",
        "Is progeny yoga active?"
    ],
    "Travel / Education": [
        "Will my planned journey be successful?",
        "Is foreign travel indicated?",
        "When will I travel abroad?",
        "Will my visa be approved?",
        "Is relocation favorable?",
        "Should I postpone this trip?",
        "Will my pilgrimage be successful?",
        "Will business travel bring gains?",
        "Is there risk during travel?",
        "Will I settle overseas?",
        "Will I pass my examinations?",
        "Will I gain admission to my desired institution?",
        "Should I pursue higher studies?",
        "Will I complete my education successfully?",
        "Is studying abroad favorable?",
        "Will I receive a scholarship?",
        "Which field of study suits me?",
        "Will competitive exams be successful?",
        "Should I change my academic path?",
        "Will this educational investment benefit me?"
    ],
    "Litigation / Enemies": [
        "Will I win the court case?",
        "How long will the litigation continue?",
        "Should I settle outside court?",
        "Is compromise advisable?",
        "Will my enemies succeed against me?",
        "Will hidden enemies be exposed?",
        "Will I face legal penalties?",
        "Is imprisonment indicated?",
        "Will I receive justice?",
        "Will the dispute resolve peacefully?",
        "Is the opposing party stronger?",
        "Will I recover losses from litigation?",
        "Should I proceed with the lawsuit?",
        "Is arbitration favorable?",
        "Will government authorities support me?"
    ],
    "Other": []
};

const SOUTH_INDIAN_BOXES = [
    { signIdx: 11, label: "Pisces", row: 0, col: 0 },
    { signIdx: 0, label: "Aries", row: 0, col: 1 },
    { signIdx: 1, label: "Taurus", row: 0, col: 2 },
    { signIdx: 2, label: "Gemini", row: 0, col: 3 },
    { signIdx: 10, label: "Aquarius", row: 1, col: 0 },
    { signIdx: 3, label: "Cancer", row: 1, col: 3 },
    { signIdx: 9, label: "Capricorn", row: 2, col: 0 },
    { signIdx: 4, label: "Leo", row: 2, col: 3 },
    { signIdx: 8, label: "Sagittarius", row: 3, col: 0 },
    { signIdx: 7, label: "Scorpio", row: 3, col: 1 },
    { signIdx: 6, label: "Libra", row: 3, col: 2 },
    { signIdx: 5, label: "Virgo", row: 3, col: 3 }
];

const NORTH_HOUSE_POLYGONS = {
    1: "250,20 135,105 250,190 365,105",
    2: "20,20 250,20 135,105",
    3: "20,20 20,190 135,105",
    4: "20,190 135,105 250,190 135,275",
    5: "20,190 20,360 135,275",
    6: "20,360 250,360 135,275",
    7: "250,360 135,275 250,190 365,275",
    8: "250,360 480,360 365,275",
    9: "480,360 480,190 365,275",
    10: "480,190 365,275 250,190 365,105",
    11: "480,190 480,20 365,105",
    12: "480,20 250,20 365,105"
};

function getDisplayDateFromJD(jd) {
    if (!jd) return '';
    const jsDate = new Date((jd - 2440587.5) * 86400000);
    return jsDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function KPEngine() {
    // Modes: 'prashna' | 'birth'
    const [calcMode, setCalcMode] = useState("prashna");

    // Form inputs for Prashna
    const [question, setQuestion] = useState("");
    const [horaryNumber, setHoraryNumber] = useState("");
    const [category, setCategory] = useState("Other");

    // Form inputs for Birth Chart
    const [birthDate, setBirthDate] = useState("1995-05-15");
    const [birthTime, setBirthTime] = useState("10:30:00");
    const [lat, setLat] = useState(28.6139);
    const [lon, setLon] = useState(77.2090);
    const [tzOffset, setTzOffset] = useState(5.5);
    const [locationName, setLocationName] = useState("New Delhi, India");

    // Results state
    const [loading, setLoading] = useState(false);
    const [prashnaResult, setPrashnaResult] = useState(null);
    const [kpChartData, setKpChartData] = useState(null);
    const [dashaData, setDashaData] = useState(null);
    const [selectedDashaLord, setSelectedDashaLord] = useState(null);
    const [modalSubLord, setModalSubLord] = useState(null);
    const [hoveredHouse, setHoveredHouse] = useState(null);
    const [selectedHousePromise, setSelectedHousePromise] = useState(null);
    const [positiveHouses, setPositiveHouses] = useState("");
    const [negativeHouses, setNegativeHouses] = useState("");
    const [activeTab, setActiveTab] = useState("chart"); // 'chart' | 'rules' | 'details' | 'significators' | 'aspects' | 'dasha'
    const [chartStyle, setChartStyle] = useState("north"); // 'north' (Rectangle Diamond) | 'south' (Grid)
    const [showPunarphooDetails, setShowPunarphooDetails] = useState(true);
    const [error, setError] = useState(null);

    const posArr = positiveHouses.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const negArr = negativeHouses.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

    const fetchKPForDetails = async (dDate, dTime, dLat, dLon, dTz) => {
        setLoading(true);
        setError(null);
        setPrashnaResult(null);
        setKpChartData(null);
        setDashaData(null);
        setSelectedDashaLord(null);

        try {
            const kpRes = await fetch("/api/kp/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: dDate,
                    time: dTime,
                    lat: dLat,
                    lon: dLon,
                    tz_offset: dTz
                })
            });

            if (kpRes.ok) {
                const kpData = await kpRes.json();
                setKpChartData(kpData);

                const dashaRes = await fetch(`/api/dasha/vimshottari?date=${dDate}&time=${dTime}&tz_offset=${dTz}`);
                if (dashaRes.ok) {
                    setDashaData(await dashaRes.json());
                }
            } else {
                const errData = await kpRes.json();
                setError(errData.detail || "Failed to calculate KP Birth Chart.");
            }
        } catch (e) {
            setError("Error processing request. Is backend running?");
        }
        setLoading(false);
    };

    const loadFromKundaliForm = (autoCalculate = false) => {
        let loadedData = null;

        // 1. Check URL parameters
        const params = new URLSearchParams(window.location.search);
        const urlDate = params.get("date");
        const urlTime = params.get("time");
        const urlLat = params.get("lat");
        const urlLon = params.get("lon");
        const urlTz = params.get("tz");
        const urlName = params.get("name");

        if (urlDate && urlTime && urlLat && urlLon) {
            loadedData = {
                date: urlDate,
                time: urlTime,
                lat: parseFloat(urlLat),
                lon: parseFloat(urlLon),
                tz: urlTz ? parseFloat(urlTz) : 5.5,
                name: urlName || "Kundali Form Person"
            };
        } else {
            // 2. Check localStorage 'worksheetData'
            try {
                const storedStr = localStorage.getItem("worksheetData");
                if (storedStr) {
                    const ws = JSON.parse(storedStr);
                    const bd = ws.basic_details || ws;
                    if (bd && (bd.Date || bd.date) && (bd.Time || bd.time)) {
                        loadedData = {
                            date: bd.Date || bd.date,
                            time: bd.Time || bd.time,
                            lat: parseFloat(bd.Latitude || bd.lat || bd.lat_deg || 28.6139),
                            lon: parseFloat(bd.Longitude || bd.lon || bd.lon_deg || 77.2090),
                            tz: parseFloat(bd.Timezone || bd.tz || bd.tz_offset || 5.5),
                            name: bd.Name || bd.name || "Kundali Form Person"
                        };
                    }
                }
            } catch (e) {
                console.warn("[KP Engine] Failed to parse worksheetData:", e);
            }
        }

        if (loadedData) {
            setBirthDate(loadedData.date);
            setBirthTime(loadedData.time);
            setLat(loadedData.lat);
            setLon(loadedData.lon);
            setTzOffset(loadedData.tz);
            setLocationName(loadedData.name);
            setCalcMode("birth");

            if (autoCalculate) {
                fetchKPForDetails(loadedData.date, loadedData.time, loadedData.lat, loadedData.lon, loadedData.tz);
            }
            return true;
        }
        return false;
    };

    useEffect(() => {
        // Automatically load birth details from Kundali Form / URL params when component mounts
        loadFromKundaliForm(true);
    }, []);

    const renderHouses = (housesArray) => {
        if (!housesArray || housesArray.length === 0) return '-';
        return housesArray.map((h, i) => {
            let colorClass = "";
            if (posArr.includes(h)) colorClass = "text-emerald-800 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded";
            else if (negArr.includes(h)) colorClass = "text-rose-800 font-extrabold bg-rose-100 px-1.5 py-0.5 rounded";
            return (
                <span key={i}>
                    <span className={colorClass}>{h}</span>
                    {i < housesArray.length - 1 ? ', ' : ''}
                </span>
            );
        });
    };

    const categories = [
        "Other",
        "Marriage / Relationship",
        "Career / Job",
        "Wealth / Finance",
        "Health / Disease",
        "Missing Item / Property",
        "Children",
        "Travel / Education",
        "Litigation / Enemies"
    ];

    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleUseCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setLoadingLocation(true);
            setError(null);
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const latVal = parseFloat(pos.coords.latitude.toFixed(4));
                    const lonVal = parseFloat(pos.coords.longitude.toFixed(4));
                    setLat(latVal);
                    setLon(lonVal);

                    try {
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latVal}&lon=${lonVal}&zoom=10`, {
                            headers: { 'Accept-Language': 'en' }
                        });
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            if (geoData) {
                                const addr = geoData.address || {};
                                const cityStr = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || "";
                                const countryStr = addr.country || "";

                                let formattedName = "";
                                if (cityStr && countryStr) {
                                    formattedName = `${cityStr}, ${countryStr}`;
                                } else if (geoData.display_name) {
                                    formattedName = geoData.display_name.split(',').slice(0, 3).join(', ').trim();
                                } else {
                                    formattedName = `Lat: ${latVal}, Lon: ${lonVal}`;
                                }
                                setLocationName(formattedName);
                            } else {
                                setLocationName(`Lat: ${latVal}, Lon: ${lonVal}`);
                            }
                        } else {
                            setLocationName(`Lat: ${latVal}, Lon: ${lonVal}`);
                        }
                    } catch (e) {
                        console.warn("Reverse geocoding failed:", e);
                        setLocationName(`Lat: ${latVal}, Lon: ${lonVal}`);
                    }
                    setLoadingLocation(false);
                },
                (err) => {
                    setError("Could not fetch location automatically. Please allow location permissions or enter coordinates manually.");
                    setLoadingLocation(false);
                },
                { timeout: 10000 }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    const calculateKP = async () => {
        setLoading(true);
        setError(null);
        setPrashnaResult(null);
        setKpChartData(null);
        setDashaData(null);
        setSelectedDashaLord(null);

        try {
            if (calcMode === "prashna") {
                if (!question.trim()) {
                    setError("Please enter a question for Prashna.");
                    setLoading(false);
                    return;
                }

                const curLat = lat || 28.6139;
                const curLon = lon || 77.2090;

                try {
                    const response = await fetch("/api/prashna/kp-ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            latitude: curLat,
                            longitude: curLon,
                            question: question,
                            category: category,
                            horary_number: horaryNumber ? parseInt(horaryNumber) : null
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setPrashnaResult(data);
                    } else {
                        const errData = await response.json().catch(() => ({}));
                        setError(errData.detail || "Failed to retrieve Prashna interpretation.");
                    }

                    const now = new Date();
                    const dateStr = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, '0') + "-" + String(now.getDate()).padStart(2, '0');
                    const timeStr = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0') + ":" + String(now.getSeconds()).padStart(2, '0');
                    const tz = -now.getTimezoneOffset() / 60;

                    const kpRes = await fetch("/api/kp/calculate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            date: dateStr,
                            time: timeStr,
                            lat: curLat,
                            lon: curLon,
                            tz_offset: tz,
                            horary_number: horaryNumber ? parseInt(horaryNumber) : null
                        })
                    });

                    if (kpRes.ok) {
                        const kpData = await kpRes.json();
                        setKpChartData(kpData);

                        const dashaRes = await fetch(`/api/dasha/vimshottari?date=${dateStr}&time=${timeStr}&tz_offset=${tz}`);
                        if (dashaRes.ok) {
                            setDashaData(await dashaRes.json());
                        }
                    } else {
                        const errData = await kpRes.json().catch(() => ({}));
                        setError(errData.detail || "Failed to calculate KP chart.");
                    }
                } catch (err) {
                    setError("Network error connecting to backend API.");
                }
                setLoading(false);
            } else {
                // Birth Chart Mode
                const kpRes = await fetch("/api/kp/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: birthDate,
                        time: birthTime,
                        lat: lat,
                        lon: lon,
                        tz_offset: tzOffset
                    })
                });

                if (kpRes.ok) {
                    const kpData = await kpRes.json();
                    setKpChartData(kpData);

                    const dashaRes = await fetch(`/api/dasha/vimshottari?date=${birthDate}&time=${birthTime}&tz_offset=${tzOffset}`);
                    if (dashaRes.ok) {
                        setDashaData(await dashaRes.json());
                    }
                } else {
                    const errData = await kpRes.json();
                    setError(errData.detail || "Failed to calculate KP Birth Chart.");
                }
                setLoading(false);
            }
        } catch (e) {
            setError("Error processing request. Is backend running?");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rose-50 text-slate-900 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-rose-200 shadow-lg gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-rose-700 flex items-center gap-3">
                            <span className="text-4xl">⭐</span> KP Astrology Engine
                        </h1>
                        <p className="text-slate-600 text-sm mt-1 font-medium">
                            Krishnamurti Paddhati (KP) System & Stellar Significators
                        </p>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="flex bg-rose-100/60 p-1.5 rounded-xl border border-rose-200">
                        <button
                            onClick={() => setCalcMode("prashna")}
                            className={`px-5 py-2.5 rounded-lg font-bold text-[16px] transition-all flex items-center gap-2 ${calcMode === 'prashna' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900 hover:bg-rose-200/50'}`}
                        >
                            Ask Question
                        </button>
                        <button
                            onClick={() => setCalcMode("birth")}
                            className={`px-5 py-2.5 rounded-lg font-bold text-[16px] transition-all flex items-center gap-2 ${calcMode === 'birth' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900 hover:bg-rose-200/50'}`}
                        >
                            🎂 Birth Nativity Mode
                        </button>
                    </div>
                </div>

                {/* Form Input Container */}
                <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-5">
                    {calcMode === "prashna" ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[18px] font-bold text-slate-800 mb-1">Question Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[18px] font-bold text-slate-800 mb-1">Horary Number (1 - 249) <span className="text-slate-500 font-normal">[Optional]</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="249"
                                        value={horaryNumber}
                                        onChange={(e) => setHoraryNumber(e.target.value)}
                                        placeholder="Leave empty for current time Ascendant"
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {category !== "Other" && PREDEFINED_QUESTIONS[category] && (
                                <div className="bg-rose-50 rounded-xl border border-rose-100 p-4">
                                    <label className="block text-[16px] font-bold text-rose-900 uppercase tracking-wider mb-2">Suggested Prashna Queries</label>
                                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                                        {PREDEFINED_QUESTIONS[category].map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setQuestion(q)}
                                                className="text-[16px] bg-white hover:bg-rose-100 text-slate-800 hover:text-rose-900 px-3 py-1.5 rounded-full border border-rose-200 transition-colors text-left shadow-sm font-medium"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-1">Your Question</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g. Will I get selected in this job interview?"
                                    rows="2"
                                    className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none resize-none transition-all"
                                ></textarea>
                            </div>

                            {/* Horary Location Status & Detection */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
                                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <span className="text-lg">📍</span>
                                    <span>
                                        Horary Location: <strong className="text-rose-900">{locationName || "New Delhi, India"}</strong>
                                        <span className="text-slate-500 font-normal ml-1">({lat}°N, {lon}°E)</span>
                                    </span>
                                </div>
                                <button
                                    onClick={handleUseCurrentLocation}
                                    type="button"
                                    disabled={loadingLocation}
                                    className="px-4 py-2 bg-yellow-100 hover:bg-rose-200 text-rose-900 font-bold rounded-lg transition-all border border-rose-300 text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                                >
                                    {loadingLocation ? (
                                        <>
                                            <svg className="animate-spin h-3.5 w-3.5 text-rose-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Detecting...
                                        </>
                                    ) : (
                                        <>📍 Detect Current Location</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Time of Birth (24h)</label>
                                    <input
                                        type="time"
                                        step="1"
                                        value={birthTime}
                                        onChange={(e) => setBirthTime(e.target.value)}
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Timezone Offset (Hours)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={tzOffset}
                                        onChange={(e) => setTzOffset(parseFloat(e.target.value))}
                                        placeholder="e.g. 5.5 for IST"
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Location / Place Name</label>
                                    <input
                                        type="text"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                        placeholder="e.g. New Delhi, India"
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Latitude (°N)</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={lat}
                                        onChange={(e) => setLat(parseFloat(e.target.value))}
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-800 mb-1">Longitude (°E)</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={lon}
                                        onChange={(e) => setLon(parseFloat(e.target.value))}
                                        className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                <button
                                    onClick={() => loadFromKundaliForm(true)}
                                    type="button"
                                    className="flex-1 py-3 px-4 bg-rose-100 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all border border-amber-400 text-[16px] shadow-sm flex items-center justify-center gap-1.5"
                                    title="Load birth details from Generate Kundali Form"
                                >
                                    📥 Auto-Fill from Kundali Form
                                </button>
                                <button
                                    onClick={handleUseCurrentLocation}
                                    type="button"
                                    disabled={loadingLocation}
                                    className="flex-1 py-3 px-4 bg-yellow-100 hover:bg-rose-200 text-rose-900 font-bold rounded-xl transition-all border border-rose-200 text-[16px] flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    {loadingLocation ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-rose-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Detecting Location...
                                        </>
                                    ) : (
                                        <>📍 Detect Current Location</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={calculateKP}
                            disabled={loading}
                            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/25'}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Calculating KP Placidus Chart...
                                </>
                            ) : (
                                <>{calcMode === "prashna" ? "⭐ Ask KP Lords" : "⭐ Generate KP Chart & Significators"}</>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 bg-rose-100 border border-rose-300 text-rose-900 p-4 rounded-xl text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Prashna Reading & Simple Analysis Interpretation Box */}
                {prashnaResult && (
                    <div className="bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden">
                        {/* Header Banner with Outcome Badge */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-rose-100">
                                    🔮 Prashna Horary Verdict
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold mt-2 flex items-center gap-2">
                                    <span>"{prashnaResult.question}"</span>
                                </h2>
                                <div className="text-rose-100 text-xs mt-1 flex flex-wrap gap-2 font-medium">
                                    <span>Category: <strong>{prashnaResult.category}</strong></span>
                                    {prashnaResult.target_house && (
                                        <span>• Target House: <strong>House {prashnaResult.target_house}</strong></span>
                                    )}
                                </div>
                            </div>

                            {prashnaResult.outcome && (
                                <div className={`px-4 py-2 rounded-xl text-sm font-extrabold shadow-md flex items-center gap-2 ${prashnaResult.outcome.includes("YES") || prashnaResult.outcome.includes("FAVORABLE")
                                    ? "bg-emerald-500 text-white"
                                    : prashnaResult.outcome.includes("NO") || prashnaResult.outcome.includes("OBSTACLE")
                                        ? "bg-rose-700 text-white"
                                        : "bg-amber-500 text-white"
                                    }`}>
                                    <span>{prashnaResult.outcome.includes("YES") ? "✅" : prashnaResult.outcome.includes("NO") ? "❌" : "⏳"}</span>
                                    <span>{prashnaResult.outcome}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Key Astrological Influences Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                    <div className="text-[11px] text-slate-600 uppercase font-bold mb-0.5">Querent (Lagna)</div>
                                    <div className="font-bold text-rose-900 text-base">{prashnaResult.lagna_lord || "Ascendant"}</div>
                                    <div className="text-[11px] text-slate-500 font-medium">{prashnaResult.lagna_sign}</div>
                                </div>
                                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                    <div className="text-[11px] text-slate-600 uppercase font-bold mb-0.5">Quesited (Target)</div>
                                    <div className="font-bold text-slate-900 text-base">{prashnaResult.target_lord || `House ${prashnaResult.target_house || 1}`}</div>
                                    <div className="text-[11px] text-slate-500 font-medium">Target House {prashnaResult.target_house || 1}</div>
                                </div>
                                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                    <div className="text-[11px] text-slate-600 uppercase font-bold mb-0.5">KP Star (Nakshatra)</div>
                                    <div className="font-bold text-rose-700 text-base">{prashnaResult.nakshatra}</div>
                                    <div className="text-[11px] text-slate-500 font-medium">{prashnaResult.ascendant_degree?.toFixed(2)}°</div>
                                </div>
                                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                    <div className="text-[11px] text-slate-600 uppercase font-bold mb-0.5">KP Sub-Lord</div>
                                    <div className="font-bold text-rose-800 text-base">{prashnaResult.sub_lord}</div>
                                    <div className="text-[11px] text-slate-500 font-medium">Deciding Factor</div>
                                </div>
                            </div>

                            {/* Simple Words Astrological Analysis Box */}
                            {prashnaResult.simple_analysis && (
                                <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white rounded-xl p-5 border border-amber-200/80 shadow-sm space-y-3">
                                    <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                                        <span>🎯</span>
                                        <span>Astrological Analysis (In Simple Words):</span>
                                    </h3>
                                    <div className="space-y-2 text-slate-800 text-sm md:text-base font-medium leading-relaxed">
                                        {prashnaResult.simple_analysis.split(/(?<=\.)\s+/).filter(s => s.trim()).map((sentence, sIdx) => {
                                            let icon = "🪐";
                                            if (sentence.toLowerCase().includes("malefic") || sentence.toLowerCase().includes("obstacle") || sentence.toLowerCase().includes("difficult")) {
                                                icon = "⚠️";
                                            } else if (sentence.toLowerCase().includes("moon")) {
                                                icon = "🌙";
                                            } else if (sentence.toLowerCase().includes("benefic") || sentence.toLowerCase().includes("same planet") || sentence.toLowerCase().includes("manifestation") || sentence.toLowerCase().includes("success")) {
                                                icon = "✨";
                                            }
                                            return (
                                                <div key={sIdx} className="flex items-start gap-2.5 bg-white/90 p-3 rounded-lg border border-amber-100 shadow-xs">
                                                    <span className="text-lg leading-none mt-0.5">{icon}</span>
                                                    <span className="text-slate-900">{sentence.trim()}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Detailed AI Reading & Guidance */}
                            {prashnaResult.reading && (
                                <div className="space-y-2 pt-2 border-t border-rose-100">
                                    <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
                                        <span>📜</span>
                                        <span>Detailed Astrological Interpretation & Guidance:</span>
                                    </h3>
                                    <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm md:text-base font-medium bg-rose-50/30 p-4 rounded-xl border border-rose-100">
                                        {prashnaResult.reading}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* KP Results Container */}
                {kpChartData && (
                    <div className="space-y-6">

                        {/* Results Navigation Bar */}
                        <div className="flex bg-white p-2 rounded-2xl border border-rose-200 shadow-sm overflow-x-auto gap-2">
                            <button
                                onClick={() => setActiveTab("chart")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'chart' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                🗺️ Visual KP Chart
                            </button>
                            <button
                                onClick={() => setActiveTab("rules")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'rules' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                ⚡ KP Rule Promises
                            </button>
                            <button
                                onClick={() => setActiveTab("details")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'details' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                📜 Cusps & Planets
                            </button>
                            <button
                                onClick={() => setActiveTab("significators")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'significators' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                🎯 4-Level Significators
                            </button>
                            <button
                                onClick={() => setActiveTab("aspects")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'aspects' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                📐 KP Aspects
                            </button>
                            <button
                                onClick={() => setActiveTab("dasha")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-[16px] whitespace-nowrap transition-all ${activeTab === 'dasha' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-900 hover:text-rose-900 hover:bg-rose-50'}`}
                            >
                                ⏳ Dasha & Ruling Planets
                            </button>
                        </div>

                        {/* TAB 1: Visual KP Chart */}
                        {activeTab === "chart" && (
                            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-rose-200 pb-4 gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold text-rose-700">Visual KP House Chart</h3>
                                        <span className="text-[18px] bg-rose-100 text-rose-900 px-3 py-1 rounded-full font-mono font-bold">
                                            KP Ayanamsha: {kpChartData.ayanamsha ? kpChartData.ayanamsha.toFixed(4) : "N/A"}°
                                        </span>
                                        {locationName && (
                                            <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                                                📍 {locationName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Style Switcher */}
                                    <div className="flex bg-rose-100/70 p-1 rounded-xl border border-rose-200">
                                        <button
                                            onClick={() => setChartStyle("north")}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartStyle === 'north' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'}`}
                                        >
                                            🔷 North Indian (Rectangle)
                                        </button>

                                    </div>
                                </div>

                                {/* Instruction Banner */}
                                <div className="bg-rose-50/80 border border-rose-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-rose-900 shadow-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">✨</span>
                                        <span>
                                            <strong>Interactive Chart:</strong> Move mouse over any house to inspect its <strong>KP House Sub-Lord Promise Analyzer</strong> popup (or click house for details).
                                        </span>
                                    </div>
                                    {hoveredHouse ? (
                                        <span className="bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-xs animate-pulse">
                                            House {hoveredHouse} Active
                                        </span>
                                    ) : (
                                        <span className="text-rose-500 italic text-xs">
                                            Hover over House 1 to 12
                                        </span>
                                    )}
                                </div>

                                {chartStyle === "north" ? (
                                    /* North Indian Style Rectangle SVG Diagram */
                                    <div className="relative max-w-2xl mx-auto bg-rose-50/40 p-4 rounded-2xl border border-rose-200 shadow-md">
                                        <svg viewBox="0 0 500 380" className="w-full h-auto font-sans select-none">
                                            {/* Outer Rectangle Box */}
                                            <rect x="20" y="20" width="460" height="340" fill="#ffffff" stroke="#f43f5e" strokeWidth="2.5" rx="8" />

                                            {/* Diagonal Lines */}
                                            <line x1="20" y1="20" x2="480" y2="360" stroke="#fda4af" strokeWidth="1.5" />
                                            <line x1="480" y1="20" x2="20" y2="360" stroke="#fda4af" strokeWidth="1.5" />

                                            {/* Inner Diamond Rhombus */}
                                            <line x1="250" y1="20" x2="20" y2="190" stroke="#fda4af" strokeWidth="1.5" />
                                            <line x1="20" y1="190" x2="250" y2="360" stroke="#fda4af" strokeWidth="1.5" />
                                            <line x1="250" y1="360" x2="480" y2="190" stroke="#fda4af" strokeWidth="1.5" />
                                            <line x1="480" y1="190" x2="250" y2="20" stroke="#fda4af" strokeWidth="1.5" />

                                            {/* Render 12 Houses */}
                                            {[
                                                { house: 1, sNumPos: { x: 250, y: 168 }, cuspPos: { x: 250, y: 42 }, planetStart: { x: 250, y: 72 } },
                                                { house: 2, sNumPos: { x: 185, y: 38 }, cuspPos: { x: 95, y: 38 }, planetStart: { x: 115, y: 65 } },
                                                { house: 3, sNumPos: { x: 40, y: 150 }, cuspPos: { x: 65, y: 68 }, planetStart: { x: 65, y: 95 } },
                                                { house: 4, sNumPos: { x: 225, y: 190 }, cuspPos: { x: 135, y: 130 }, planetStart: { x: 135, y: 155 } },
                                                { house: 5, sNumPos: { x: 40, y: 230 }, cuspPos: { x: 65, y: 255 }, planetStart: { x: 65, y: 280 } },
                                                { house: 6, sNumPos: { x: 185, y: 345 }, cuspPos: { x: 80, y: 345 }, planetStart: { x: 125, y: 295 } },
                                                { house: 7, sNumPos: { x: 250, y: 212 }, cuspPos: { x: 250, y: 342 }, planetStart: { x: 250, y: 245 } },
                                                { house: 8, sNumPos: { x: 315, y: 345 }, cuspPos: { x: 420, y: 345 }, planetStart: { x: 375, y: 295 } },
                                                { house: 9, sNumPos: { x: 460, y: 230 }, cuspPos: { x: 435, y: 255 }, planetStart: { x: 435, y: 280 } },
                                                { house: 10, sNumPos: { x: 275, y: 190 }, cuspPos: { x: 365, y: 130 }, planetStart: { x: 365, y: 155 } },
                                                { house: 11, sNumPos: { x: 460, y: 150 }, cuspPos: { x: 435, y: 68 }, planetStart: { x: 435, y: 95 } },
                                                { house: 12, sNumPos: { x: 315, y: 38 }, cuspPos: { x: 405, y: 38 }, planetStart: { x: 385, y: 65 } }
                                            ].map(({ house, sNumPos, cuspPos, planetStart }) => {
                                                const ascSignIdx = Math.floor(kpChartData.cusps[0].longitude / 30);
                                                const signNum = ((ascSignIdx + house - 1) % 12) + 1;
                                                const cuspObj = kpChartData.cusps[house - 1];
                                                const cuspDeg = cuspObj ? (cuspObj.longitude % 30).toFixed(1) : '0.0';

                                                // Determine occupants of this house
                                                const occNames = kpChartData.occupants[house] || [];
                                                const planetsInHouse = kpChartData.planets.filter(p => occNames.includes(p.short_name) || (p.planet === 'Ascendant' && house === 1));
                                                const isHovered = hoveredHouse === house;

                                                return (
                                                    <g 
                                                        key={house} 
                                                        className="cursor-pointer"
                                                        onMouseEnter={() => setHoveredHouse(house)}
                                                        onMouseLeave={() => setHoveredHouse(null)}
                                                        onClick={() => setSelectedHousePromise(house)}
                                                    >
                                                        {/* Interactive House Boundary Polygon */}
                                                        <polygon
                                                            points={NORTH_HOUSE_POLYGONS[house]}
                                                            fill={isHovered ? "rgba(244, 63, 94, 0.22)" : "rgba(255, 255, 255, 0.001)"}
                                                            stroke={isHovered ? "#e11d48" : "transparent"}
                                                            strokeWidth={isHovered ? "2.5" : "0"}
                                                            className="transition-all duration-150"
                                                        />

                                                        {/* Zodiac Sign Number */}
                                                        <text
                                                            x={sNumPos.x}
                                                            y={sNumPos.y}
                                                            fill={isHovered ? "#9f1239" : "#b45309"}
                                                            fontSize={isHovered ? "14" : "13"}
                                                            fontWeight="800"
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            pointerEvents="none"
                                                        >
                                                            {signNum}
                                                        </text>

                                                        {/* Cusp Degree Badge */}
                                                        <text
                                                            x={cuspPos.x}
                                                            y={cuspPos.y}
                                                            fill={isHovered ? "#9f1239" : "#be123c"}
                                                            fontSize={isHovered ? "12" : "11"}
                                                            fontWeight="bold"
                                                            textAnchor="middle"
                                                            pointerEvents="none"
                                                        >
                                                            C{house}: {cuspDeg}°
                                                        </text>

                                                        {/* Planets inside House */}
                                                        {planetsInHouse.map((p, pIdx) => (
                                                            <text
                                                                key={p.planet}
                                                                x={planetStart.x}
                                                                y={planetStart.y + (pIdx * 14)}
                                                                fill={p.planet === 'Ascendant' ? '#b91c1c' : '#0f172a'}
                                                                fontSize="12"
                                                                fontWeight="bold"
                                                                textAnchor="middle"
                                                                pointerEvents="none"
                                                            >
                                                                {p.short_name || p.planet.slice(0, 2)} {(p.longitude % 30).toFixed(0)}°
                                                            </text>
                                                        ))}
                                                    </g>
                                                );
                                            })}
                                        </svg>

                                        {/* Floating Pop-up Window for KP House Sub-Lord Promise on House Hover */}
                                        {hoveredHouse && kpChartData?.rule_analyzer?.[hoveredHouse] && (() => {
                                            const rule = kpChartData.rule_analyzer[hoveredHouse];
                                            const cusp = kpChartData.cusps?.[hoveredHouse - 1];
                                            let statusBadgeClass = "bg-emerald-100 border-emerald-300 text-emerald-900";
                                            let statusIcon = "✓";
                                            let verdictDesc = "Sub-lord signifies favorable houses without severe negation, indicating positive manifestation and fulfillment.";
                                            
                                            if (rule.status.includes("Unfavorable")) {
                                                statusBadgeClass = "bg-rose-100 border-rose-300 text-rose-900";
                                                statusIcon = "✕";
                                                verdictDesc = "Sub-lord connects to negating houses, indicating obstacles, denial, or delay for this house.";
                                            } else if (rule.status.includes("Mixed")) {
                                                statusBadgeClass = "bg-amber-100 border-amber-300 text-amber-900";
                                                statusIcon = "⚠";
                                                verdictDesc = "Sub-lord connects to both favorable and negating houses, indicating initial delays or mixed results.";
                                            }

                                            // Smart positioning: popup displays away from cursor so it doesn't obstruct view
                                            let positionClass = "left-4 top-4";
                                            if ([2, 3, 4, 5, 6].includes(hoveredHouse)) {
                                                positionClass = "right-4 top-4";
                                            } else if ([8, 9, 10, 11, 12].includes(hoveredHouse)) {
                                                positionClass = "left-4 top-4";
                                            } else if (hoveredHouse === 1) {
                                                positionClass = "left-1/2 -translate-x-1/2 bottom-4";
                                            } else if (hoveredHouse === 7) {
                                                positionClass = "left-1/2 -translate-x-1/2 top-4";
                                            }

                                            const occupants = kpChartData.occupants?.[hoveredHouse] || [];

                                            return (
                                                <div 
                                                    className={`absolute z-30 w-72 sm:w-84 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-rose-400 shadow-2xl space-y-3 pointer-events-none transition-all duration-200 animate-fadeIn ${positionClass}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 border-b border-rose-200 pb-2">
                                                        <div>
                                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 block">
                                                                KP Sub-Lord Promise
                                                            </span>
                                                            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                                                                House {hoveredHouse}: {rule.topic}
                                                            </h4>
                                                        </div>
                                                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold whitespace-nowrap shadow-xs ${statusBadgeClass}`}>
                                                            {statusIcon} {rule.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="bg-rose-50/80 p-2 rounded-lg border border-rose-100">
                                                            <span className="text-slate-500 font-semibold block text-[11px]">Cusp Sub-Lord</span>
                                                            <span className="font-bold text-rose-700 text-sm">{rule.sub_lord}</span>
                                                        </div>
                                                        <div className="bg-rose-50/80 p-2 rounded-lg border border-rose-100">
                                                            <span className="text-slate-500 font-semibold block text-[11px]">Sub-Lord Star</span>
                                                            <span className="font-bold text-slate-800 text-sm">{rule.star_lord}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-xs space-y-1 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 font-medium">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-slate-600">Signified Houses:</span>
                                                            <span className="font-mono font-bold text-slate-900">{rule.signified_houses.join(', ') || 'None'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-emerald-700 font-bold">Favorable Houses:</span>
                                                            <span className="font-mono font-bold text-emerald-800">{rule.positive_houses.join(', ')}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-rose-700 font-bold">Negating Houses:</span>
                                                            <span className="font-mono font-bold text-rose-800">{rule.negating_houses.join(', ')}</span>
                                                        </div>
                                                    </div>

                                                    {cusp && (
                                                        <div className="flex justify-between items-center text-[11px] text-slate-600 px-1">
                                                            <span>Cusp Sign: <strong>{cusp.sign_name}</strong></span>
                                                            <span>Degree: <strong>{(cusp.longitude % 30).toFixed(2)}°</strong></span>
                                                        </div>
                                                    )}

                                                    {occupants.length > 0 && (
                                                        <div className="text-[11px] text-slate-600 px-1">
                                                            <span>Occupants: </span>
                                                            <strong className="text-slate-900">{occupants.join(', ')}</strong>
                                                        </div>
                                                    )}

                                                    <p className="text-[11px] text-slate-600 leading-relaxed italic border-t border-rose-100 pt-1.5">
                                                        {verdictDesc}
                                                    </p>

                                                    <div className="text-[10px] text-center font-bold text-rose-600 bg-rose-50 py-1 rounded-md">
                                                        👆 Click house polygon for complete analysis
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    /* South Indian Style Grid Diagram */
                                    <div className="grid grid-cols-4 gap-2 aspect-square max-w-2xl mx-auto bg-rose-50/50 p-2 rounded-2xl border border-rose-200 shadow-md">
                                    </div>
                                )}

                                {/* Interactive KP House Sub-Lord Promise Inspector Card below Chart */}
                                {kpChartData?.rule_analyzer && (() => {
                                    const inspectHouse = hoveredHouse || 1;
                                    const rule = kpChartData.rule_analyzer[inspectHouse];
                                    if (!rule) return null;

                                    let statusColor = "bg-emerald-100 border-emerald-300 text-emerald-900";
                                    if (rule.status.includes("Unfavorable")) statusColor = "bg-rose-100 border-rose-300 text-rose-900";
                                    else if (rule.status.includes("Mixed")) statusColor = "bg-amber-100 border-amber-300 text-amber-900";

                                    return (
                                        <div className="bg-gradient-to-r from-rose-50 to-pink-50/40 p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">⚡</span>
                                                    <div>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                                                            KP House Sub-Lord Promise Analyzer (House {inspectHouse})
                                                        </span>
                                                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                                                            House {inspectHouse}: {rule.topic}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs sm:text-sm px-3 py-1 rounded-full border font-bold ${statusColor}`}>
                                                        {rule.status}
                                                    </span>
                                                    <button 
                                                        onClick={() => setSelectedHousePromise(inspectHouse)}
                                                        className="text-xs font-bold bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1 rounded-lg transition-colors shadow-xs"
                                                    >
                                                        Full Details ↗
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                                                <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                                                    <span className="text-slate-500 font-semibold block text-[11px]">Cusp Sub-Lord</span>
                                                    <span className="font-bold text-rose-700 text-sm sm:text-base">{rule.sub_lord}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                                                    <span className="text-slate-500 font-semibold block text-[11px]">Sub-Lord Star Lord</span>
                                                    <span className="font-bold text-slate-800 text-sm sm:text-base">{rule.star_lord}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                                                    <span className="text-emerald-700 font-bold block text-[11px]">Favorable Houses</span>
                                                    <span className="font-mono font-bold text-emerald-800 text-sm sm:text-base">{rule.positive_houses.join(', ')}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-xs">
                                                    <span className="text-rose-700 font-bold block text-[11px]">Negating Houses</span>
                                                    <span className="font-mono font-bold text-rose-800 text-sm sm:text-base">{rule.negating_houses.join(', ')}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 pt-1">
                                                <span>Houses Signified: <strong className="font-mono text-slate-900">{rule.signified_houses.join(', ') || 'None'}</strong></span>
                                                <span className="text-slate-500 italic">Hover any house in the chart above to inspect instantly</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* TAB 2: KP Rule Analyzer */}
                        {activeTab === "rules" && (
                            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-6">
                                <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-3">
                                    ⚡ KP House Sub-Lord Promise Analyzer
                                </h3>
                                <p className="text-slate-700 text-sm font-medium">
                                    In KP Astrology, the <strong>Sub-Lord of a House Cusp</strong> determines whether the matter of that house is promised or denied in life.
                                </p>

                                {kpChartData.rule_analyzer ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(kpChartData.rule_analyzer).map(([hNum, item]) => {
                                            let statusColor = "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold";
                                            if (item.status.includes("Unfavorable")) statusColor = "bg-rose-100 border-rose-300 text-rose-900 font-bold";
                                            else if (item.status.includes("Mixed")) statusColor = "bg-amber-100 border-amber-300 text-amber-900 font-bold";

                                            return (
                                                <div key={hNum} className="bg-rose-50/40 border border-rose-200 p-4 rounded-xl space-y-3 shadow-sm">
                                                    <div className="flex justify-between items-center border-b border-rose-200 pb-2">
                                                        <span className="font-bold text-slate-900 text-[16px]">
                                                            House {hNum}: {item.topic}
                                                        </span>
                                                        <span className={`text-[16px] px-2.5 py-1 rounded-full border ${statusColor}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-[16px]">
                                                        <div className="bg-white p-2 rounded-lg border border-rose-100 shadow-sm">
                                                            <span className="text-slate-600 font-semibold block">Cusp Sub-Lord:</span>
                                                            <span className="font-bold text-rose-700 text-[16px]">{item.sub_lord}</span>
                                                        </div>
                                                        <div className="bg-white p-2 rounded-lg border border-rose-100 shadow-sm">
                                                            <span className="text-slate-600 font-semibold block">Sub-Lord Star Lord:</span>
                                                            <span className="font-bold text-slate-900 text-[16px]">{item.star_lord}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-[16px] space-y-1 font-medium">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Signified Houses:</span>
                                                            <span className="font-mono text-slate-900 font-bold text-[16px]">{item.signified_houses.join(', ') || 'None'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-emerald-700 font-bold">Favorable Houses:</span>
                                                            <span className="font-mono text-emerald-800 font-bold text-[16px]">{item.positive_houses.join(', ')}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-rose-700 font-bold">Negating Houses:</span>
                                                            <span className="font-mono text-rose-800 font-bold text-[16px]">{item.negating_houses.join(', ')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-slate-600 text-[16px] italic">Rule analyzer calculation complete.</div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: Cusps & Planets Details */}
                        {activeTab === "details" && (
                            <div className="space-y-6">
                                {/* Cuspal Table */}
                                <div className="bg-white rounded-2xl overflow-hidden border border-rose-200 shadow-lg">
                                    <div className="bg-rose-100/60 px-6 py-4 border-b border-rose-200 font-bold text-rose-900 text-lg">
                                        House Cusps (Placidus System)
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-800">
                                            <thead className="bg-rose-50 uppercase text-xs text-slate-700 font-bold border-b border-rose-200">
                                                <tr>
                                                    <th className="px-4 py-3">House Cusp</th>
                                                    <th className="px-4 py-3">Longitude</th>
                                                    <th className="px-4 py-3">Zodiac Sign</th>
                                                    <th className="px-4 py-3">Sign Lord</th>
                                                    <th className="px-4 py-3">Star Lord</th>
                                                    <th className="px-4 py-3 text-rose-700 font-bold">Sub Lord</th>
                                                    <th className="px-4 py-3 text-slate-600">Sub-Sub Lord</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-rose-100">
                                                {kpChartData.cusps.map(c => (
                                                    <tr key={c.house} className="hover:bg-rose-50/60 transition-colors font-medium">
                                                        <td className="px-4 py-3 font-bold text-rose-900">Cusp {c.house}</td>
                                                        <td className="px-4 py-3 font-mono">{c.longitude.toFixed(2)}°</td>
                                                        <td className="px-4 py-3">{c.sign_name}</td>
                                                        <td className="px-4 py-3">{c.sign_lord}</td>
                                                        <td className="px-4 py-3 text-slate-900 font-semibold">{c.star_lord}</td>
                                                        <td className="px-4 py-3 font-bold text-rose-700">
                                                            <button onClick={() => setModalSubLord(c.sub_lord)} className="underline hover:text-pink-600">
                                                                {c.sub_lord}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">{c.sub_sub_lord}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Planetary Table */}
                                <div className="bg-white rounded-2xl overflow-hidden border border-rose-200 shadow-lg">
                                    <div className="bg-rose-100/60 px-6 py-4 border-b border-rose-200 font-bold text-rose-900 text-lg">
                                        Planetary Longitudes & KP Lords
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-800">
                                            <thead className="bg-rose-50 uppercase text-xs text-slate-700 font-bold border-b border-rose-200">
                                                <tr>
                                                    <th className="px-4 py-3">Planet</th>
                                                    <th className="px-4 py-3">Longitude</th>
                                                    <th className="px-4 py-3">Sign</th>
                                                    <th className="px-4 py-3">Sign Lord</th>
                                                    <th className="px-4 py-3">Star Lord</th>
                                                    <th className="px-4 py-3 text-rose-700 font-bold">Sub Lord</th>
                                                    <th className="px-4 py-3 text-slate-600">Sub-Sub Lord</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-rose-100">
                                                {kpChartData.planets.map(p => (
                                                    <tr key={p.planet} className="hover:bg-rose-50/60 transition-colors font-medium">
                                                        <td className="px-4 py-3 font-bold text-rose-900">{p.planet}</td>
                                                        <td className="px-4 py-3 font-mono">{p.longitude.toFixed(2)}°</td>
                                                        <td className="px-4 py-3">{p.sign_name}</td>
                                                        <td className="px-4 py-3">{p.sign_lord}</td>
                                                        <td className="px-4 py-3 text-slate-900 font-semibold">{p.star_lord}</td>
                                                        <td className="px-4 py-3 font-bold text-rose-700">
                                                            <button onClick={() => setModalSubLord(p.sub_lord)} className="underline hover:text-pink-600">
                                                                {p.sub_lord}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">{p.sub_sub_lord}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: 4-Level Significators */}
                        {activeTab === "significators" && (
                            <div className="space-y-6">
                                {/* Positive/Negating Highlighter Controls */}
                                <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-emerald-800 mb-1">Highlight Positive Houses (e.g. 2,7,11)</label>
                                        <input
                                            type="text"
                                            value={positiveHouses}
                                            onChange={e => setPositiveHouses(e.target.value)}
                                            placeholder="Comma separated house numbers"
                                            className="w-full bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-rose-800 mb-1">Highlight Negating Houses (e.g. 1,6,10)</label>
                                        <input
                                            type="text"
                                            value={negativeHouses}
                                            onChange={e => setNegativeHouses(e.target.value)}
                                            placeholder="Comma separated house numbers"
                                            className="w-full bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-400"
                                        />
                                    </div>
                                </div>

                                {/* Planet Significators Table */}
                                <div className="bg-white rounded-2xl overflow-hidden border border-rose-200 shadow-lg">
                                    <div className="bg-rose-100/60 px-6 py-4 border-b border-rose-200 font-bold text-rose-900 text-lg">
                                        Planet Significations (4-Tier Strength)
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-800">
                                            <thead className="bg-rose-50 uppercase text-xs text-slate-700 font-bold border-b border-rose-200">
                                                <tr>
                                                    <th className="px-4 py-3">Planet</th>
                                                    <th className="px-4 py-3">Level A (Star of Occ)</th>
                                                    <th className="px-4 py-3">Level B (Occupant)</th>
                                                    <th className="px-4 py-3">Level C (Star of Owner)</th>
                                                    <th className="px-4 py-3">Level D (Owner)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-rose-100">
                                                {Object.entries(kpChartData.planet_significators).map(([planet, sigs]) => (
                                                    <tr key={planet} className={`hover:bg-rose-50/60 transition-colors font-medium ${selectedDashaLord === planet ? 'bg-rose-100/80 border-l-4 border-rose-600 font-bold' : ''}`}>
                                                        <td className="px-4 py-3 font-bold text-rose-900">{planet}</td>
                                                        <td className="px-4 py-3 text-rose-700 font-bold">{renderHouses(sigs.A)}</td>
                                                        <td className="px-4 py-3">{renderHouses(sigs.B)}</td>
                                                        <td className="px-4 py-3 text-slate-900 font-semibold">{renderHouses(sigs.C)}</td>
                                                        <td className="px-4 py-3">{renderHouses(sigs.D)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: Aspects Matrix */}
                        {activeTab === "aspects" && (
                            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-6">
                                <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-3">
                                    📐 Major KP Planetary & Cuspal Aspects
                                </h3>

                                {kpChartData.aspects && kpChartData.aspects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                                        {kpChartData.aspects.map((asp, i) => {
                                            let badgeColor = "bg-slate-100 text-slate-800 border-slate-300";
                                            if (asp.nature === 'benefic') badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
                                            else if (asp.nature === 'malefic') badgeColor = "bg-rose-100 text-rose-900 border-rose-300 font-bold";

                                            return (
                                                <div key={i} className="bg-rose-50/40 border border-rose-200 p-3 rounded-xl flex justify-between items-center text-sm font-medium shadow-sm">
                                                    <div>
                                                        <span className="font-bold text-rose-900">{asp.body1}</span>
                                                        <span className="text-slate-400 mx-2">➔</span>
                                                        <span className="font-bold text-slate-900">{asp.body2}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor}`}>
                                                            {asp.type} ({asp.angle}°)
                                                        </span>
                                                        <span className="text-[11px] text-slate-500 font-mono">
                                                            Orb: {asp.orb}°
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-slate-600 text-sm italic">No major KP aspects detected within orb limits.</div>
                                )}
                            </div>
                        )}

                        {/* TAB 6: Dasha & Ruling Planets */}
                        {activeTab === "dasha" && (
                            <div className="space-y-6">
                                {/* Ruling Planets Card */}
                                <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-4">
                                    <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-3">👑 Ruling Planets (RPs)</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                            <div className="text-[14px] text-slate-900 uppercase font-bold mb-1">Lagna Star Lord</div>
                                            <div className="font-bold text-rose-700 text-lg">{kpChartData.ruling_planets.lagna_nak_lord}</div>
                                        </div>
                                        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                            <div className="text-[14px] text-slate-900 uppercase font-bold mb-1">Lagna Sign Lord</div>
                                            <div className="font-bold text-slate-900 text-lg">{kpChartData.ruling_planets.lagna_lord}</div>
                                        </div>
                                        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                            <div className="text-[14px] text-slate-900 uppercase font-bold mb-1">Moon Star Lord</div>
                                            <div className="font-bold text-rose-700 text-lg">{kpChartData.ruling_planets.moon_nak_lord}</div>
                                        </div>
                                        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                            <div className="text-[14px] text-slate-900 uppercase font-bold mb-1">Moon Sign Lord</div>
                                            <div className="font-bold text-slate-900 text-lg">{kpChartData.ruling_planets.moon_rashi_lord}</div>
                                        </div>
                                        <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-center">
                                            <div className="text-[14px] text-slate-900 uppercase font-bold mb-1">Day Lord</div>
                                            <div className="font-bold text-amber-800 text-lg">{kpChartData.ruling_planets.day_lord}</div>
                                        </div>
                                    </div>

                                    {kpChartData.punarphoo_present && (
                                        <div className="bg-gradient-to-br from-rose-100/90 via-rose-50 to-amber-50/60 border-2 border-rose-300 p-5 rounded-2xl shadow-md text-slate-900 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/80 pb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">⚠️</span>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <strong className="text-lg font-bold text-rose-950">Punarphoo Dosha Detected</strong>
                                                            <span className="text-xs bg-rose-200 text-rose-900 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300">
                                                                Saturn-Moon Connection
                                                            </span>
                                                        </div>
                                                        <p className="text-[18px] text-black font-semibold mt-0.5">
                                                            Astrological Cause: {kpChartData.punarphoo_reason}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowPunarphooDetails(!showPunarphooDetails)}
                                                    className="self-start sm:self-auto text-[16px] font-bold bg-white hover:bg-rose-100 text-rose-900 px-3.5 py-1.5 rounded-lg border border-rose-300 shadow-xs transition-all flex items-center gap-1.5"
                                                >
                                                    <span>{showPunarphooDetails ? "▲ Hide Impact Details" : "📖 How It Affects Your Life & Remedies ▼"}</span>
                                                </button>
                                            </div>

                                            {showPunarphooDetails && (
                                                <div className="space-y-4 text-sm font-medium animate-fadeIn">
                                                    {/* What is Punarphoo */}
                                                    <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200/80 shadow-xs">
                                                        <p className="text-slate-800 leading-relaxed text-[16px]">
                                                            In classical Krishnamurti Paddhati (KP) astrology, <strong>Punarphoo</strong> is a karmic pattern formed when <strong>Saturn</strong> (the planet of restriction and delays) connects with the <strong>Moon</strong> (the mind and cosmic receptivity). The word <em>"Punar"</em> means <em>repetition</em> or <em>again</em>. It indicates that major endeavors rarely consummate smoothly on the initial attempt; they often pause or stall, requiring a second attempt or perseverance to bear lasting fruit.
                                                        </p>
                                                    </div>

                                                    {/* How It Affects User Life Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="bg-white/90 p-4 rounded-xl border border-rose-200 shadow-xs space-y-1.5">
                                                            <div className="flex items-center gap-2 text-rose-900 font-bold text-[16px]">
                                                                <span className="text-base">💍</span>
                                                                <span>Marriage & Alliances</span>
                                                            </div>
                                                            <p className="text-[16px] text-slate-900 leading-relaxed">
                                                                Causes noticeable delays in marriage timing, hesitation, or initial proposals stalling at the final moment before settlement. Alliances finalize successfully after renegotiation or a second attempt.
                                                            </p>
                                                        </div>

                                                        <div className="bg-white/90 p-4 rounded-xl border border-rose-200 shadow-xs space-y-1.5">
                                                            <div className="flex items-center gap-2 text-rose-900 font-bold text-[16px]">
                                                                <span className="text-base">💼</span>
                                                                <span>Career & Financial Goals</span>
                                                            </div>
                                                            <p className="text-[16px] text-slate-900 leading-relaxed">
                                                                Expected payments, contract approvals, or job promotions face unexpected postponements. Progress requires persistent follow-up and materializes upon re-application.
                                                            </p>
                                                        </div>

                                                        <div className="bg-white/90 p-4 rounded-xl border border-rose-200 shadow-xs space-y-1.5">
                                                            <div className="flex items-center gap-2 text-rose-900 font-bold text-[16px]">
                                                                <span className="text-base">🧠</span>
                                                                <span>Mind & Emotional State</span>
                                                            </div>
                                                            <p className="text-[16px] text-slate-900 leading-relaxed">
                                                                Prone to overthinking, emotional heaviness, anxiety, or self-doubt when plans stall. The mind feels heavy or second-guesses decisions under Saturn’s restrictive influence.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Golden Rule / Silver Lining */}
                                                    <div className="bg-emerald-50/90 border border-emerald-300 p-3.5 rounded-xl flex items-start gap-2.5">
                                                        <span className="text-[16px]">✨</span>
                                                        <div className="text-[16px] text-slate-900">
                                                            <strong className="font-bold block text-emerald-900 mb-0.5">The Golden KP Rule: Delay is NOT Denial</strong>
                                                            Punarphoo builds immense mental endurance, depth of character, and emotional maturity. When achievements and relationships finally solidify under Punarphoo, they prove exceptionally stable and enduring.
                                                        </div>
                                                    </div>

                                                    {/* Remedies Box */}
                                                    <div className="bg-amber-50/90 border border-amber-200 p-3.5 rounded-xl space-y-2">
                                                        <div className="flex items-center gap-2 text-[16px] font-extrabold text-amber-950 uppercase tracking-wide">
                                                            <span>🪔</span>
                                                            <span>Recommended Astrological Remedies & Lifestyle Guidance</span>
                                                        </div>
                                                        <ul className="text-[16px] text-slate-900 space-y-1 list-disc list-inside leading-relaxed font-medium">
                                                            <li><strong>Worship Lord Shiva:</strong> Perform water or milk abhishek on Shivling every Monday to soothe and balance the Moon.</li>
                                                            <li><strong>Recite Hanuman Chalisa:</strong> Reciting on Tuesdays and Saturdays eases Saturn's restrictive pressure and imparts mental courage.</li>
                                                            <li><strong>Stay Calm on Initial Stalls:</strong> Never abandon an important endeavor or negotiation when the first attempt pauses—the second attempt is destined to succeed.</li>
                                                            <li><strong>Avoid Hasty Reactions:</strong> Refrain from reactive decisions or bitter words during moments of delay; maintain patience and emotional equilibrium.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Vimshottari Dasha Explorer */}
                                {dashaData && dashaData.vimshottari && (
                                    <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg space-y-4">
                                        <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-3">⏳ Vimshottari Dasha Sequence</h3>
                                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
                                            {dashaData.vimshottari.slice(0, 7).map((maha, i) => (
                                                <div key={i} className="flex-none w-64 bg-rose-50/50 border border-rose-200 rounded-xl overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => setSelectedDashaLord(maha.lord)}
                                                        className={`w-full text-left px-4 py-3 font-bold text-base border-b transition-colors ${selectedDashaLord === maha.lord ? 'bg-rose-600 text-white border-rose-500' : 'bg-rose-100 text-rose-900 border-rose-200 hover:bg-rose-200'}`}
                                                    >
                                                        {maha.lord} Mahadasha
                                                        <div className="text-[16px] font-normal opacity-80 mt-0.5">
                                                            {getDisplayDateFromJD(maha.start_jd)} - {getDisplayDateFromJD(maha.end_jd)}
                                                        </div>
                                                    </button>
                                                    <div className="max-h-52 overflow-y-auto">
                                                        {maha.antardashas && maha.antardashas.map((ad, j) => (
                                                            <button
                                                                key={j}
                                                                onClick={() => setSelectedDashaLord(ad.lord)}
                                                                className={`w-full text-left px-4 py-2 text-[16px] flex justify-between items-center border-b border-rose-100 last:border-0 transition-colors ${selectedDashaLord === ad.lord ? 'bg-rose-200 text-rose-950 font-bold' : 'text-slate-900 hover:bg-white'}`}
                                                            >
                                                                <span>{ad.lord} AD</span>
                                                                <span className="text-slate-900 font-mono">{getDisplayDateFromJD(ad.start_jd)}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal for Sub Lord Signification Detail */}
            {modalSubLord && kpChartData && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border-t-4 border-rose-500 text-slate-900 space-y-4">
                        <div className="flex justify-between items-center border-b border-rose-100 pb-3">
                            <h3 className="text-2xl font-bold text-rose-800">Significations of Sub-Lord: {modalSubLord}</h3>
                            <button onClick={() => setModalSubLord(null)} className="text-slate-400 hover:text-slate-800 text-2xl font-bold">&times;</button>
                        </div>
                        {kpChartData.planet_significators[modalSubLord] ? (
                            <div className="space-y-3">
                                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                                    <div className="text-xs text-rose-700 font-bold uppercase mb-1">Level A (Star of Occupant)</div>
                                    <div className="text-slate-900 font-bold text-base">
                                        {renderHouses(kpChartData.planet_significators[modalSubLord].A)}
                                    </div>
                                </div>
                                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                                    <div className="text-xs text-amber-800 font-bold uppercase mb-1">Level B (Occupant of House)</div>
                                    <div className="text-slate-900 font-bold text-base">
                                        {renderHouses(kpChartData.planet_significators[modalSubLord].B)}
                                    </div>
                                </div>
                                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                                    <div className="text-xs text-amber-800 font-bold uppercase mb-1">Level C (Star of Owner)</div>
                                    <div className="text-slate-900 font-bold text-base">
                                        {renderHouses(kpChartData.planet_significators[modalSubLord].C)}
                                    </div>
                                </div>
                                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                                    <div className="text-xs text-slate-600 font-bold uppercase mb-1">Level D (Owner of House)</div>
                                    <div className="text-slate-900 font-bold text-base">
                                        {renderHouses(kpChartData.planet_significators[modalSubLord].D)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 text-sm font-medium">No specific planet significations found.</p>
                        )}
                        <button
                            onClick={() => setModalSubLord(null)}
                            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for House Promise Analyzer Detail */}
            {selectedHousePromise && kpChartData?.rule_analyzer?.[selectedHousePromise] && (() => {
                const rule = kpChartData.rule_analyzer[selectedHousePromise];
                const cusp = kpChartData.cusps?.[selectedHousePromise - 1];
                let statusBadgeClass = "bg-emerald-100 border-emerald-300 text-emerald-900";
                if (rule.status.includes("Unfavorable")) statusBadgeClass = "bg-rose-100 border-rose-300 text-rose-900";
                else if (rule.status.includes("Mixed")) statusBadgeClass = "bg-amber-100 border-amber-300 text-amber-900";

                return (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-t-4 border-rose-600 text-slate-900 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start border-b border-rose-100 pb-3">
                                <div>
                                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                                        KP House Sub-Lord Promise Analyzer
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        House {selectedHousePromise}: {rule.topic}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedHousePromise(null)} 
                                    className="text-slate-400 hover:text-rose-600 text-2xl font-bold p-1 leading-none"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200">
                                <span className="text-sm font-semibold text-slate-700">Sub-Lord Promise Status:</span>
                                <span className={`text-sm px-3 py-1 rounded-full border font-bold ${statusBadgeClass}`}>
                                    {rule.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-200 shadow-xs">
                                    <span className="text-xs text-slate-500 font-semibold block">Cusp Sub-Lord</span>
                                    <span className="font-bold text-rose-700 text-lg">{rule.sub_lord}</span>
                                </div>
                                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-200 shadow-xs">
                                    <span className="text-xs text-slate-500 font-semibold block">Sub-Lord Star Lord</span>
                                    <span className="font-bold text-slate-900 text-lg">{rule.star_lord}</span>
                                </div>
                                {cusp && (
                                    <>
                                        <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-200 shadow-xs">
                                            <span className="text-xs text-slate-500 font-semibold block">Cusp Sign & Degree</span>
                                            <span className="font-bold text-slate-800 text-sm">{cusp.sign_name} ({(cusp.longitude % 30).toFixed(2)}°)</span>
                                        </div>
                                        <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-200 shadow-xs">
                                            <span className="text-xs text-slate-500 font-semibold block">Cusp Sign Lord</span>
                                            <span className="font-bold text-slate-800 text-sm">{cusp.sign_lord}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 font-medium">Houses Signified by Sub-Lord:</span>
                                    <span className="font-mono font-bold text-slate-900">{rule.signified_houses.join(', ') || 'None'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-700 font-bold">Favorable Houses for {rule.topic}:</span>
                                    <span className="font-mono font-bold text-emerald-800">{rule.positive_houses.join(', ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-rose-700 font-bold">Negating / Obstructive Houses:</span>
                                    <span className="font-mono font-bold text-rose-800">{rule.negating_houses.join(', ')}</span>
                                </div>
                            </div>

                            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                                <strong className="font-bold block text-amber-900">KP Astrological Principle:</strong>
                                <p className="leading-relaxed">
                                    In KP Astrology, the sub-lord of a cusp acts as the ultimate decider for that house. If the sub-lord is deposited in the star of a planet that signifies favorable houses, the matter of the house is promised to manifest successfully. If it connects to negating houses (like the 12th from the primary house), the matter is denied or delayed.
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedHousePromise(null)}
                                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
