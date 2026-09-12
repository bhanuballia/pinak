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
export default function NadiViewer({ data }) {
    const [currentData, setCurrentData] = useState(data);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [nadiResult, setNadiResult] = useState(null);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("Other");
    const [question, setQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [qaResult, setQaResult] = useState(null);
    const [qaError, setQaError] = useState(null);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const [locationDetecting, setLocationDetecting] = useState(false);

    // Initial inputs from data or URL params
    const initialParams = new URLSearchParams(window.location.search);
    const initialDobOnly = Boolean(
        data?.is_dob_only ||
        data?.calculation_basis === "dob_only" ||
        initialParams.get("dob_only") === "true" ||
        (!data?.basic_details?.birth_time && !initialParams.get("time"))
    );

    const [isDobOnly, setIsDobOnly] = useState(initialDobOnly);
    const [userName, setUserName] = useState(
        data?.basic_details?.name || data?.meta?.name || initialParams.get("name") || ""
    );
    const [gender, setGender] = useState(
        data?.basic_details?.gender || data?.meta?.gender || initialParams.get("gender") || "Male"
    );
    const [userDob, setUserDob] = useState(
        data?.basic_details?.birth_date || data?.basic_details?.dob || data?.birth_date || initialParams.get("date") || ""
    );
    const [userTime, setUserTime] = useState(
        data?.basic_details?.birth_time || data?.birth_time || initialParams.get("time") || ""
    );
    const [userLat, setUserLat] = useState(
        data?.basic_details?.lat || (initialParams.get("lat") ? parseFloat(initialParams.get("lat")) : 28.6139)
    );
    const [userLon, setUserLon] = useState(
        data?.basic_details?.lon || (initialParams.get("lon") ? parseFloat(initialParams.get("lon")) : 77.2090)
    );
    const [userTz, setUserTz] = useState(
        data?.basic_details?.tz_offset || (initialParams.get("tz") ? parseFloat(initialParams.get("tz")) : 5.5)
    );
    const [userLocationName, setUserLocationName] = useState(
        data?.basic_details?.birth_place || data?.meta?.location || initialParams.get("loc") || ""
    );

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

    const fetchNadiReading = async (selectedGender, planetPositionsToUse = null, activeBirthDate = null) => {
        setLoading(true);
        setError(null);
        try {
            const activePlanets = planetPositionsToUse || currentData?.planet_positions || data?.planet_positions;
            if (!activePlanets || activePlanets.length === 0) {
                setError("No planetary positions available to analyze.");
                setLoading(false);
                return;
            }

            let userAge = 30; // default
            const dStr = activeBirthDate || userDob || currentData?.basic_details?.birth_date || data?.basic_details?.birth_date;
            if (dStr && typeof dStr === 'string' && dStr.includes('-')) {
                const y = parseInt(dStr.split('-')[0]);
                if (!isNaN(y)) userAge = Math.max(1, new Date().getFullYear() - y);
            }

            const response = await fetch("/api/nadi/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planet_positions: activePlanets,
                    gender: selectedGender,
                    age: userAge
                })
            });
            const resultData = await response.json();
            if (response.ok) {
                setNadiResult(resultData);
            } else {
                setError(resultData.detail || "Failed to load Nadi reading.");
            }
        } catch (err) {
            setError("Network error. Is the backend running?");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (data) {
            setCurrentData(data);
            if (data.is_dob_only !== undefined) {
                setIsDobOnly(Boolean(data.is_dob_only));
            }
            if (data.planet_positions) {
                fetchNadiReading(gender, data.planet_positions);
            }
        }
    }, [data]);

    const handleGenderChange = (newGender) => {
        setGender(newGender);
        fetchNadiReading(newGender, currentData?.planet_positions || data?.planet_positions, userDob);
    };

    const handleRecalculate = async (targetDobOnly = isDobOnly) => {
        if (!userDob) {
            alert("Please enter Date of Birth.");
            return;
        }
        setRecalculating(true);
        setError(null);

        const finalTime = targetDobOnly ? "12:00" : (userTime || "12:00");
        const finalLat = targetDobOnly ? 28.6139 : (parseFloat(userLat) || 28.6139);
        const finalLon = targetDobOnly ? 77.2090 : (parseFloat(userLon) || 77.2090);
        const finalTz = targetDobOnly ? 5.5 : (parseFloat(userTz) || 5.5);
        const locName = userLocationName || (targetDobOnly ? "Standard (12:00 Noon Ephemeris)" : "Birth Location");

        const payload = {
            name: userName || (targetDobOnly ? "Nadi Chart (DOB Only)" : "Nadi Chart"),
            date: userDob,
            time: finalTime,
            tz_offset: finalTz,
            lat: finalLat,
            lon: finalLon,
            style: "minimal",
            language: "english",
            gender: gender,
            location_name: locName,
            is_approximate: targetDobOnly
        };

        try {
            const repRes = await fetch("/api/report/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (repRes.ok) {
                const repData = await repRes.json();
                repData.is_dob_only = targetDobOnly;
                repData.calculation_basis = targetDobOnly ? "dob_only" : "full";
                setCurrentData(repData);
                setIsDobOnly(targetDobOnly);
                await fetchNadiReading(gender, repData.planet_positions, userDob);
                setShowEditDrawer(false);
            } else {
                const errData = await repRes.json().catch(() => ({}));
                alert(errData.detail || "Failed to recalculate chart data.");
            }
        } catch (e) {
            alert("Error communicating with backend server.");
        }
        setRecalculating(false);
    };

    const handleAutoFillFromKundaliForm = async () => {
        let loaded = null;
        try {
            const stored = localStorage.getItem('kundaliFormData');
            if (stored) {
                loaded = JSON.parse(stored);
            } else {
                const ws = localStorage.getItem('worksheetData');
                if (ws) {
                    const parsedWs = JSON.parse(ws);
                    const bd = parsedWs.basic_details || parsedWs;
                    if (bd && (bd.birth_date || bd.date || bd.Date)) {
                        loaded = {
                            name: bd.name || bd.Name || '',
                            date: bd.birth_date || bd.date || bd.Date,
                            time: bd.birth_time || bd.time || bd.Time || '',
                            lat: bd.lat || bd.Latitude || '',
                            lon: bd.lon || bd.Longitude || '',
                            location_name: bd.birth_place || '',
                            tz: bd.tz_offset || bd.Timezone || 5.5,
                            gender: bd.gender || 'Male',
                            is_dob_only: Boolean(!bd.birth_time && !bd.time)
                        };
                    }
                }
            }
        } catch (e) { }

        if (loaded && loaded.date) {
            setUserName(loaded.name || '');
            setUserDob(loaded.date);
            setUserTime(loaded.time || '');
            setUserLat(loaded.lat || 28.6139);
            setUserLon(loaded.lon || 77.2090);
            setUserLocationName(loaded.location_name || '');
            setUserTz(loaded.tz || 5.5);
            if (loaded.gender) setGender(loaded.gender);
            const dobOnlyMode = loaded.is_dob_only !== undefined ? loaded.is_dob_only : (!loaded.time || !loaded.lat);
            setIsDobOnly(dobOnlyMode);

            // Trigger immediate recalculation
            setRecalculating(true);
            try {
                const finalTime = dobOnlyMode ? "12:00" : (loaded.time || "12:00");
                const finalLat = dobOnlyMode ? 28.6139 : (parseFloat(loaded.lat) || 28.6139);
                const finalLon = dobOnlyMode ? 77.2090 : (parseFloat(loaded.lon) || 77.2090);
                const finalTz = dobOnlyMode ? 5.5 : (parseFloat(loaded.tz) || 5.5);

                const repRes = await fetch("/api/report/data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: loaded.name || "Kundali Form Native",
                        date: loaded.date,
                        time: finalTime,
                        tz_offset: finalTz,
                        lat: finalLat,
                        lon: finalLon,
                        style: "minimal",
                        language: "english",
                        gender: loaded.gender || "Male",
                        location_name: loaded.location_name || (dobOnlyMode ? "Standard (12:00 Noon Ephemeris)" : ""),
                        is_approximate: dobOnlyMode
                    })
                });

                if (repRes.ok) {
                    const repData = await repRes.json();
                    repData.is_dob_only = dobOnlyMode;
                    repData.calculation_basis = dobOnlyMode ? "dob_only" : "full";
                    setCurrentData(repData);
                    await fetchNadiReading(loaded.gender || "Male", repData.planet_positions, loaded.date);
                    setShowEditDrawer(false);
                }
            } catch (err) {
                console.warn("Auto-fill recalculation failed:", err);
            }
            setRecalculating(false);
        } else {
            alert("No saved birth data found in Kundali form.");
        }
    };

    const handleDetectLocation = () => {
        if ("geolocation" in navigator) {
            setLocationDetecting(true);
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const latVal = parseFloat(pos.coords.latitude.toFixed(4));
                    const lonVal = parseFloat(pos.coords.longitude.toFixed(4));
                    setUserLat(latVal);
                    setUserLon(lonVal);
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
                                if (cityStr && countryStr) {
                                    setUserLocationName(`${cityStr}, ${countryStr}`);
                                } else if (geoData.display_name) {
                                    setUserLocationName(geoData.display_name.split(',').slice(0, 3).join(', ').trim());
                                } else {
                                    setUserLocationName(`Lat: ${latVal}, Lon: ${lonVal}`);
                                }
                            }
                        }
                    } catch (e) {
                        setUserLocationName(`Lat: ${latVal}, Lon: ${lonVal}`);
                    }
                    setLocationDetecting(false);
                },
                () => {
                    setLocationDetecting(false);
                    alert("Could not detect location. Please enter coordinates manually.");
                }
            );
        }
    };

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        setAsking(true);
        setQaError(null);
        try {
            let userAge = 30;
            const dStr = userDob || currentData?.basic_details?.birth_date || data?.basic_details?.birth_date;
            if (dStr && typeof dStr === 'string' && dStr.includes('-')) {
                const y = parseInt(dStr.split('-')[0]);
                if (!isNaN(y)) userAge = Math.max(1, new Date().getFullYear() - y);
            }

            const activePlanets = currentData?.planet_positions || data?.planet_positions;

            const response = await fetch("/api/nadi/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planet_positions: activePlanets,
                    gender: gender,
                    question: question,
                    age: userAge
                })
            });
            const resultData = await response.json();
            if (response.ok) {
                setQaResult(resultData.answer);
            } else {
                setQaError(resultData.detail || "Failed to get answer.");
            }
        } catch (err) {
            setQaError("Network error. Is the backend running?");
        }
        setAsking(false);
    };

    if (loading && !nadiResult) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8">
                <div className="text-center animate-pulse">
                    <div className="text-6xl mb-4">📜</div>
                    <h2 className="text-2xl font-bold text-amber-400">Consulting the Bhrigu Nandi Nadi...</h2>
                    <p className="text-slate-600 mt-2">Calculating planetary trines and conjunctions</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8">
                <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl max-w-lg text-center text-red-200">
                    <h3 className="font-bold text-lg mb-2">Error</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => window.close()}
                        className="mt-4 px-4 py-2 bg-white rounded hover:bg-rose-100 transition-colors"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    if (!nadiResult) return null;

    const trines = nadiResult.nadi_data.elemental_trines;

    // Formatting the AI text nicely for QA responses
    const formatReading = (text) => {
        if (!text) return null;
        if (typeof text !== 'string') return null;
        const sections = text.split("###");
        return sections.map((sec, idx) => {
            if (!sec.trim()) return null;
            const lines = sec.split("\n");
            const title = lines[0].trim();
            const body = lines.slice(1).join("\n").trim();

            return (
                <div key={idx} className="mb-8">
                    {title && <h3 className="text-2xl font-bold text-amber-400 mb-3 border-b border-amber-200 pb-2">{title}</h3>}
                    <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">{body}</div>
                </div>
            );
        });
    };

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

    const SIGN_INFO = {
        1: { name: "Aries", sanskrit: "Mesha", element: "Fire", symbol: "♈", lord: "Mars" },
        2: { name: "Taurus", sanskrit: "Vrishabha", element: "Earth", symbol: "♉", lord: "Venus" },
        3: { name: "Gemini", sanskrit: "Mithuna", element: "Air", symbol: "♊", lord: "Mercury" },
        4: { name: "Cancer", sanskrit: "Karka", element: "Water", symbol: "♋", lord: "Moon" },
        5: { name: "Leo", sanskrit: "Simha", element: "Fire", symbol: "♌", lord: "Sun" },
        6: { name: "Virgo", sanskrit: "Kanya", element: "Earth", symbol: "♍", lord: "Mercury" },
        7: { name: "Libra", sanskrit: "Tula", element: "Air", symbol: "♎", lord: "Venus" },
        8: { name: "Scorpio", sanskrit: "Vrishchika", element: "Water", symbol: "♏", lord: "Mars" },
        9: { name: "Sagittarius", sanskrit: "Dhanu", element: "Fire", symbol: "♐", lord: "Jupiter" },
        10: { name: "Capricorn", sanskrit: "Makara", element: "Earth", symbol: "♑", lord: "Saturn" },
        11: { name: "Aquarius", sanskrit: "Kumbha", element: "Air", symbol: "♒", lord: "Saturn" },
        12: { name: "Pisces", sanskrit: "Meena", element: "Water", symbol: "♓", lord: "Jupiter" }
    };

    const ELEMENT_COLORS = {
        "Fire": { bg: "bg-orange-100 text-orange-950 border-orange-300", badge: "bg-orange-600 text-white", stroke: "#ea580c" },
        "Earth": { bg: "bg-emerald-100 text-emerald-950 border-emerald-300", badge: "bg-emerald-600 text-white", stroke: "#059669" },
        "Air": { bg: "bg-sky-100 text-sky-950 border-sky-300", badge: "bg-sky-600 text-white", stroke: "#0284c7" },
        "Water": { bg: "bg-blue-100 text-blue-950 border-blue-300", badge: "bg-blue-600 text-white", stroke: "#2563eb" }
    };

    function getNadiPlanetColor(planet) {
        if (planet === "Lagna" || planet === "Ascendant") return "#dc2626";
        if (planet === "Jupiter") return "#b45309"; // Amber (Guru / Jeeva Karaka in Male)
        if (planet === "Venus") return "#be185d";   // Pink/Rose (Shukra / Female Jeeva)
        if (planet === "Saturn") return "#1d4ed8";  // Blue (Karma Karaka)
        if (planet === "Rahu" || planet === "Ketu") return "#991b1b"; // Deep Red (Karmic Nodes)
        if (planet === "Sun") return "#c2410c";     // Orange (Atma Karaka / Father)
        if (planet === "Moon") return "#1e293b";    // Dark Slate (Mind / Mother)
        if (planet === "Mars") return "#991b1b";    // Crimson (Brothers / Energy)
        if (planet === "Mercury") return "#15803d"; // Emerald (Buddhi / Business)
        return "#0f172a";
    }

    const NadiChartGrid = ({ planetsBySign, retrogradePlanets, planetPositions, isDobOnly }) => {
        const [chartStyle, setChartStyle] = useState("north"); // 'north' (Rectangle) | 'south' (Grid)
        const [hoveredHouse, setHoveredHouse] = useState(null);

        // Find Lagna / Ascendant only if full birth details (DOB + Time + Location) were provided
        const ascObj = !isDobOnly && (planetPositions || []).find(p =>
            (p.planet && (p.planet.toLowerCase() === 'ascendant' || p.planet.toLowerCase() === 'lagna')) ||
            (p.name && (p.name.toLowerCase() === 'ascendant' || p.name.toLowerCase() === 'lagna'))
        );
        let lagnaSign = null;
        if (ascObj) {
            if (typeof ascObj.sign === 'number') lagnaSign = ascObj.sign;
            else if (ascObj.sign) lagnaSign = parseInt(ascObj.sign);
            else if (ascObj.lon !== undefined) lagnaSign = Math.floor(ascObj.lon / 30) + 1;
            else if (ascObj.degree !== undefined) lagnaSign = Math.floor(ascObj.degree / 30) + 1;
        }

        const hasLagna = !isDobOnly && !!lagnaSign;
        const [orientation, setOrientation] = useState(hasLagna ? "lagna" : "aries"); // 'lagna' | 'aries'
        const startSign = (hasLagna && orientation === "lagna") ? lagnaSign : 1;

        // Mapping of 4x4 grid indices to Zodiac Sign Numbers (1-12) for South Indian
        const southGridToSign = [
            12, 1, 2, 3,
            11, null, null, 4,
            10, null, null, 5,
            9, 8, 7, 6
        ];

        // North Indian SVG house text coordinates - using geometric centroids for balance
        const northHouseLayout = [
            { house: 1, sNumPos: { x: 250, y: 158 }, center: { x: 250, y: 95 } },
            { house: 2, sNumPos: { x: 195, y: 38 }, center: { x: 135, y: 65 } },
            { house: 3, sNumPos: { x: 42, y: 150 }, center: { x: 65, y: 105 } },
            { house: 4, sNumPos: { x: 215, y: 190 }, center: { x: 135, y: 190 } },
            { house: 5, sNumPos: { x: 42, y: 230 }, center: { x: 65, y: 275 } },
            { house: 6, sNumPos: { x: 195, y: 345 }, center: { x: 135, y: 315 } },
            { house: 7, sNumPos: { x: 250, y: 222 }, center: { x: 250, y: 285 } },
            { house: 8, sNumPos: { x: 305, y: 345 }, center: { x: 365, y: 315 } },
            { house: 9, sNumPos: { x: 458, y: 230 }, center: { x: 435, y: 275 } },
            { house: 10, sNumPos: { x: 285, y: 190 }, center: { x: 365, y: 190 } },
            { house: 11, sNumPos: { x: 458, y: 150 }, center: { x: 435, y: 105 } },
            { house: 12, sNumPos: { x: 305, y: 38 }, center: { x: 365, y: 65 } }
        ];

        return (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-rose-200 mb-8 space-y-5">
                {/* Header & Style Switcher */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-rose-200 pb-4">
                    <div>
                        <h3 className="font-bold text-xl text-rose-800 flex items-center gap-2">
                            <span>🧭</span> Nadi Planetary Chart
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                            {chartStyle === "north" ? "North Indian (Rectangle) Layout with Elemental Trines" : "Traditional South Indian Grid Layout"}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Orientation Toggle (if Lagna exists and in North Indian style) */}
                        {hasLagna && chartStyle === "north" && (
                            <div className="flex bg-rose-50 p-1 rounded-xl border border-rose-200 text-xs">
                                <button
                                    onClick={() => setOrientation("lagna")}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${orientation === "lagna" ? "bg-rose-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"}`}
                                >
                                    Lagna-Centric
                                </button>
                                <button
                                    onClick={() => setOrientation("aries")}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${orientation === "aries" ? "bg-rose-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"}`}
                                >
                                    Natural Zodiac (Aries=1)
                                </button>
                            </div>
                        )}

                        {/* Chart Style Switcher */}
                        <div className="flex bg-rose-100/70 p-1 rounded-xl border border-rose-200 text-xs">
                            <button
                                onClick={() => setChartStyle("north")}
                                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${chartStyle === "north" ? "bg-rose-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"}`}
                            >
                                🔷 North Indian (Rectangle)
                            </button>
                            <button
                                onClick={() => setChartStyle("south")}
                                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${chartStyle === "south" ? "bg-rose-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"}`}
                            >
                                🔶 South Indian (Grid)
                            </button>
                        </div>
                    </div>
                </div>

                {chartStyle === "north" ? (
                    /* North Indian Style Rectangle SVG Diagram */
                    <div className="space-y-4">
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
                                {northHouseLayout.map(({ house, sNumPos, center }) => {
                                    const signNum = ((startSign - 1 + house - 1) % 12) + 1;
                                    const sign = SIGN_INFO[signNum];
                                    const basePlanets = planetsBySign[signNum] || planetsBySign[String(signNum)] || [];
                                    const rawPlanets = isDobOnly 
                                        ? basePlanets.filter(p => p !== "Lagna" && p !== "Ascendant")
                                        : basePlanets;
                                    const isLagnaHere = hasLagna && signNum === lagnaSign;
                                    const allPlanets = isLagnaHere && !rawPlanets.includes("Lagna") && !rawPlanets.includes("Ascendant")
                                        ? ["Lagna", ...rawPlanets]
                                        : rawPlanets;

                                    const isHovered = hoveredHouse === house;
                                    const count = allPlanets.length;
                                    const fontSize = count > 3 ? "11" : "12.5";
                                    const lineSpacing = count > 3 ? 13 : 15;
                                    const startY = center.y - ((count - 1) * lineSpacing) / 2;

                                    return (
                                        <g
                                            key={house}
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredHouse(house)}
                                            onMouseLeave={() => setHoveredHouse(null)}
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
                                                fontSize="13"
                                                fontWeight="800"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                pointerEvents="none"
                                            >
                                                {signNum}
                                            </text>

                                            {/* Planets inside Sign - Centered around house centroid */}
                                            {allPlanets.map((p, pIdx) => {
                                                const isRetro = retrogradePlanets && retrogradePlanets.includes(p);
                                                const color = getNadiPlanetColor(p);

                                                return (
                                                    <text
                                                        key={p + pIdx}
                                                        x={center.x}
                                                        y={startY + (pIdx * lineSpacing)}
                                                        fill={color}
                                                        fontSize={fontSize}
                                                        fontWeight="bold"
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        pointerEvents="none"
                                                    >
                                                        {p}{isRetro ? ' (R)' : ''}
                                                    </text>
                                                );
                                            })}
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Floating Pop-up Window on House Hover */}
                            {hoveredHouse && (() => {
                                const signNum = ((startSign - 1 + hoveredHouse - 1) % 12) + 1;
                                const sign = SIGN_INFO[signNum];
                                const elementStyle = ELEMENT_COLORS[sign.element];
                                const basePlanets = planetsBySign[signNum] || planetsBySign[String(signNum)] || [];
                                const rawPlanets = isDobOnly 
                                    ? basePlanets.filter(p => p !== "Lagna" && p !== "Ascendant")
                                    : basePlanets;
                                const isLagnaHere = hasLagna && signNum === lagnaSign;
                                const occupants = isLagnaHere && !rawPlanets.includes("Lagna") && !rawPlanets.includes("Ascendant")
                                    ? ["Lagna", ...rawPlanets]
                                    : rawPlanets;

                                // Nadi Trines (1, 5, 9 from this sign)
                                const trine5Num = ((signNum - 1 + 4) % 12) + 1;
                                const trine9Num = ((signNum - 1 + 8) % 12) + 1;
                                const trine5Planets = planetsBySign[trine5Num] || planetsBySign[String(trine5Num)] || [];
                                const trine9Planets = planetsBySign[trine9Num] || planetsBySign[String(trine9Num)] || [];

                                // 2nd (Next / Future) & 12th (Past karma / Roots)
                                const nextNum = (signNum % 12) + 1;
                                const prevNum = signNum === 1 ? 12 : signNum - 1;
                                const nextPlanets = planetsBySign[nextNum] || planetsBySign[String(nextNum)] || [];
                                const prevPlanets = planetsBySign[prevNum] || planetsBySign[String(prevNum)] || [];

                                // Smart positioning away from cursor
                                let positionClass = "left-4 top-4";
                                if ([2, 3, 4, 5, 6].includes(hoveredHouse)) positionClass = "right-4 top-4";
                                else if ([8, 9, 10, 11, 12].includes(hoveredHouse)) positionClass = "left-4 top-4";
                                else if (hoveredHouse === 1) positionClass = "left-1/2 -translate-x-1/2 bottom-4";
                                else if (hoveredHouse === 7) positionClass = "left-1/2 -translate-x-1/2 top-4";

                                return (
                                    <div className={`absolute z-30 w-72 sm:w-80 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-rose-400 shadow-2xl space-y-2.5 pointer-events-none transition-all duration-200 animate-fadeIn ${positionClass}`}>
                                        <div className="flex items-start justify-between gap-2 border-b border-rose-200 pb-2">
                                            <div>
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
                                                    House {hoveredHouse} (Sign {signNum})
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                                                    {sign.name} ({sign.sanskrit}) {sign.symbol}
                                                </h4>
                                            </div>
                                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${elementStyle.bg}`}>
                                                {sign.element}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-rose-50/80 p-2 rounded-lg border border-rose-100">
                                                <span className="text-slate-500 font-semibold block text-[10px]">Sign Lord</span>
                                                <span className="font-bold text-rose-700">{sign.lord}</span>
                                            </div>
                                            <div className="bg-rose-50/80 p-2 rounded-lg border border-rose-100">
                                                <span className="text-slate-500 font-semibold block text-[10px]">Occupants</span>
                                                <span className="font-bold text-slate-900">{occupants.join(', ') || 'None'}</span>
                                            </div>
                                        </div>

                                        {/* Nadi Trine Support (100% Shared Elemental Impact) */}
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                                            <span className="text-[11px] font-bold text-slate-800 block">
                                                🔥 BNN Elemental Trine (1, 5, 9):
                                            </span>
                                            <div className="text-slate-600 text-[11px]">
                                                <span>5th ({SIGN_INFO[trine5Num].name}): <strong>{trine5Planets.join(', ') || 'Empty'}</strong></span>
                                            </div>
                                            <div className="text-slate-600 text-[11px]">
                                                <span>9th ({SIGN_INFO[trine9Num].name}): <strong>{trine9Planets.join(', ') || 'Empty'}</strong></span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] text-slate-600 border-t border-rose-100 pt-1.5">
                                            <span>2nd (Next): <strong>{SIGN_INFO[nextNum].name}</strong></span>
                                            <span>12th (Past Karma): <strong>{SIGN_INFO[prevNum].name}</strong></span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Elemental Trine Legend */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="bg-orange-50 border border-orange-200 p-2.5 rounded-xl text-center">
                                <span className="font-bold text-orange-900 block">🔥 Fire (1, 5, 9)</span>
                                <span className="text-[11px] text-orange-800">Aries, Leo, Sag</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
                                <span className="font-bold text-emerald-900 block">🌍 Earth (2, 6, 10)</span>
                                <span className="text-[11px] text-emerald-800">Taurus, Virgo, Cap</span>
                            </div>
                            <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl text-center">
                                <span className="font-bold text-sky-900 block">💨 Air (3, 7, 11)</span>
                                <span className="text-[11px] text-sky-800">Gemini, Libra, Aqu</span>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-center">
                                <span className="font-bold text-blue-900 block">🌊 Water (4, 8, 12)</span>
                                <span className="text-[11px] text-blue-800">Cancer, Scor, Pis</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* South Indian Style Grid Diagram */
                    <div className="flex justify-center">
                        <div className="grid grid-cols-4 border-l border-t border-black w-full max-w-md">
                            {southGridToSign.map((signNum, idx) => {
                                if (signNum === null) {
                                    return <div key={idx} className="bg-white border-r border-b border-black"></div>;
                                }

                                const basePlanets = planetsBySign[signNum] || [];
                                const planets = isDobOnly 
                                    ? basePlanets.filter(p => p !== "Lagna" && p !== "Ascendant")
                                    : basePlanets;
                                const isLagnaHere = hasLagna && signNum === lagnaSign;
                                const displayPlanets = isLagnaHere && !planets.includes("Lagna") && !planets.includes("Ascendant")
                                    ? ["Lagna", ...planets]
                                    : planets;

                                return (
                                    <div key={idx} className="bg-yellow-200 p-2 h-24 border-r border-b border-black flex flex-col relative overflow-hidden group hover:bg-rose-100 transition-colors">
                                        <div className="text-[16px] text-black uppercase font-medium absolute top-1 left-1">
                                            {signNum}
                                        </div>
                                        <div className="mt-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                                            {displayPlanets.map((p, pIdx) => {
                                                const isRetro = retrogradePlanets && retrogradePlanets.includes(p);
                                                return (
                                                    <div key={pIdx} className={`text-[16px] font-semibold truncate ${p === "Jupiter" || p === "Venus" ? "text-blue-900" :
                                                        p === "Saturn" ? "text-blue-900" :
                                                            p === "Rahu" || p === "Ketu" || p === "Lagna" ? "text-rose-900 font-bold" : "text-slate-900"
                                                        }`}>
                                                        {p} {isRetro && <span className="text-red-500 text-[10px] ml-0.5">(R)</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <p className="text-xs text-slate-600 text-center">
                    Planets marked with <span className="text-red-500 font-bold">(R)</span> are retrograde and in BNN also influence the previous sign. Move mouse over houses in the North Indian chart to view elemental trine connections.
                </p>
            </div>
        );
    };

    const StructuredReadingRender = ({ data }) => {
        const [selectedTopic, setSelectedTopic] = useState("all");

        if (!data) return null;
        if (typeof data === 'string') {
            return (
                <div className="prose prose-invert max-w-none text-slate-800">
                    {formatReading(data)}
                </div>
            );
        }
        if (data.error) {
            return (
                <div className="bg-amber-100/50 border border-amber-200 text-amber-800 p-6 rounded-xl">
                    <p className="font-semibold">{data.error}</p>
                    <p className="text-sm mt-2 opacity-80">The system needs a valid Gemini API Key to generate the detailed narrative reading. For now, you can explore the technical BNN combinations above.</p>
                </div>
            );
        }

        const topics = [
            { id: "all", label: "Show All Topics" },
            { id: "health", label: "Health" },
            { id: "marriageTiming", label: "Marriage Timing" },
            { id: "marriageLife", label: "Marriage Life" },
            { id: "financialSuccess", label: "Financial Success" },
            { id: "businessVsJob", label: "Business vs Job" },
            { id: "badPhaseTiming", label: "Bad Phase Timing" },
            { id: "abroadSettlement", label: "Abroad Settlement" },
            { id: "soulmateTiming", label: "Soulmate Timing" },
            { id: "spirituality", label: "Spirituality" },
            { id: "lifeStagnation", label: "Life Stagnation" },
            { id: "careerSuggestions", label: "Career Suggestions" },
            { id: "lifePeriods", label: "Life Periods" },
            { id: "rajYogas", label: "Raj Yogas" }
        ];

        return (
            <div className="space-y-6">
                {/* Topic Selector Dropdown */}
                <div className="bg-white/80 p-4 rounded-xl border border-rose-200 mb-6 flex flex-col sm:flex-row items-center gap-4">
                    <label className="text-[16px] font-bold text-slate-900 whitespace-nowrap">Select Analysis Topic:</label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full bg-rose-50 border border-rose-200 rounded-lg p-2 text-black focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-semibold"
                    >
                        {topics.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-10">
                    {/* Marriage Timing */}
                    {data.marriageTiming && (selectedTopic === "all" || selectedTopic === "marriageTiming") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-pink-900 mb-4 flex items-center gap-2">💒 Marriage Timing</h3>
                            <p className="text-slate-900 mb-4">{data.marriageTiming.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold">Probable Age Range</div>
                                    <div className="font-semibold text-black">{data.marriageTiming.probableAgeRange}</div>
                                </div>
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold">Marriage Type</div>
                                    <div className="font-semibold text-black">{data.marriageTiming.type}</div>
                                </div>
                                {data.marriageTiming.religion && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold">Religion / Background</div>
                                        <div className="font-semibold text-black">{data.marriageTiming.religion}</div>
                                    </div>
                                )}
                            </div>
                            {data.marriageTiming.favorablePeriods && data.marriageTiming.favorablePeriods.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Favorable Periods:</div>
                                    <ul className="space-y-1">
                                        {data.marriageTiming.favorablePeriods.map((p, i) => <li key={i} className="text-slate-800">✦ {p}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Financial Success */}
                    {data.financialSuccess && (selectedTopic === "all" || selectedTopic === "financialSuccess") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">💰 Financial Success</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold">Wealth Potential</div>
                                    <div className="font-semibold text-black">{data.financialSuccess.potential}</div>
                                </div>
                                {data.financialSuccess.wealthGainAge && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold">Wealth Gain Age</div>
                                        <div className="font-semibold text-black">{data.financialSuccess.wealthGainAge}</div>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold mb-1">Wealth Sources:</div>
                                <div className="text-slate-800">{data.financialSuccess.sources}</div>
                            </div>
                            <p className="text-slate-900 italic">{data.financialSuccess.focus}</p>
                        </div>
                    )}

                    {/* Business vs Job */}
                    {data.businessVsJob && (selectedTopic === "all" || selectedTopic === "businessVsJob") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">🏢 Business vs Job</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Recommendation</div>
                                <div className="font-semibold text-black text-lg">{data.businessVsJob.recommendation}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.businessVsJob.description}</p>
                            <div className="mb-4">
                                <span className="text-slate-900 font-bold">Best Timing: </span>
                                <span className="text-black">{data.businessVsJob.bestTiming}</span>
                            </div>
                            {data.businessVsJob.prepSteps && data.businessVsJob.prepSteps.length > 0 && (
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Preparation Steps:</div>
                                    <ul className="space-y-2">
                                        {data.businessVsJob.prepSteps.map((p, i) => (
                                            <li key={i} className="flex gap-2 text-slate-800">
                                                <span className="text-amber-500">✦</span> <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bad Phase Timing (formerly Current Phase) */}
                    {data.currentPhase && (selectedTopic === "all" || selectedTopic === "badPhaseTiming") && (
                        <div className="bg-white p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-[#6B21A8] mb-4 flex items-center gap-2">⏳ Bad Phase Timing</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-[#F3E8FF] p-4 rounded-lg">
                                    <div className="text-sm text-slate-500 mb-1">Current Phase</div>
                                    <div className="font-bold text-[#4C1D95]">{data.currentPhase.type}</div>
                                </div>
                                <div className="bg-[#F3E8FF] p-4 rounded-lg">
                                    <div className="text-sm text-slate-500 mb-1">End Timing</div>
                                    <div className="font-bold text-[#4C1D95]">{data.currentPhase.endTiming}. Next major period: {data.currentPhase.nextMajor}</div>
                                </div>
                            </div>

                            <p className="text-slate-800 mb-6 leading-relaxed border-b border-rose-100 pb-6">{data.currentPhase.description}</p>

                            {data.currentPhase.remedies && data.currentPhase.remedies.length > 0 && (
                                <div>
                                    <div className="text-sm text-slate-500 mb-2">Remedies:</div>
                                    <ul className="space-y-2">
                                        {data.currentPhase.remedies.map((r, i) => (
                                            <li key={i} className="flex gap-2 text-slate-800">
                                                <span className="text-[#8B5CF6]">✦</span> <span>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Abroad Settlement */}
                    {data.abroadSettlement && (selectedTopic === "all" || selectedTopic === "abroadSettlement") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">✈️ Abroad Settlement</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold">Probability</div>
                                    <div className="font-semibold text-black">{data.abroadSettlement.probability}</div>
                                </div>
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold">Favorable Timing</div>
                                    <div className="font-semibold text-black">{data.abroadSettlement.favorableTiming}</div>
                                </div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.abroadSettlement.description}</p>
                            {data.abroadSettlement.destinations && data.abroadSettlement.destinations.length > 0 && (
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Favorable Destinations:</div>
                                    <ul className="list-disc pl-5 text-slate-900">
                                        {data.abroadSettlement.destinations.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Soulmate Timing */}
                    {data.soulmateTiming && (selectedTopic === "all" || selectedTopic === "soulmateTiming") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-rose-500 mb-4 flex items-center gap-2">❤️ Soulmate Timing</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Probable Timing</div>
                                <div className="font-semibold text-black">{data.soulmateTiming.probableTiming}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.soulmateTiming.description}</p>
                            {data.soulmateTiming.recognitionSigns && data.soulmateTiming.recognitionSigns.length > 0 && (
                                <div>
                                    <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Recognition Signs:</div>
                                    <ul className="space-y-2">
                                        {data.soulmateTiming.recognitionSigns.map((s, i) => (
                                            <li key={i} className="flex gap-2 text-slate-900">
                                                <span className="text-rose-900">✦</span> <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Life Stagnation */}
                    {data.lifeStagnation && (selectedTopic === "all" || selectedTopic === "lifeStagnation") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">🔄 Life Stagnation</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Breakthrough Timing</div>
                                <div className="font-semibold text-black">{data.lifeStagnation.breakthroughTiming}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.lifeStagnation.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.lifeStagnation.causes && data.lifeStagnation.causes.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Causes:</div>
                                        <ul className="space-y-2">
                                            {data.lifeStagnation.causes.map((c, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-purple-900">✦</span> <span>{c}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {data.lifeStagnation.actionSteps && data.lifeStagnation.actionSteps.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Action Steps:</div>
                                        <ul className="space-y-2">
                                            {data.lifeStagnation.actionSteps.map((a, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-amber-900">✦</span> <span>{a}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Health */}
                    {data.health && (selectedTopic === "all" || selectedTopic === "health") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-teal-600 mb-4 flex items-center gap-2">⚕️ Health Status</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Overall Status</div>
                                <div className="font-semibold text-black">{data.health.status}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.health.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.health.proneDiseases && data.health.proneDiseases.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Prone to:</div>
                                        <ul className="space-y-2">
                                            {data.health.proneDiseases.map((d, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-teal-800">✦</span> <span>{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {data.health.remedies && data.health.remedies.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Remedies/Precautions:</div>
                                        <ul className="space-y-2">
                                            {data.health.remedies.map((r, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-amber-600">✦</span> <span>{r}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Marriage Life */}
                    {data.marriageLife && (selectedTopic === "all" || selectedTopic === "marriageLife") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">💍 Marriage Life Quality</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Overall Quality</div>
                                <div className="font-semibold text-black">{data.marriageLife.quality}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.marriageLife.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.marriageLife.strengths && data.marriageLife.strengths.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Strengths:</div>
                                        <ul className="space-y-2">
                                            {data.marriageLife.strengths.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-green-600">✦</span> <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {data.marriageLife.issues && data.marriageLife.issues.length > 0 && (
                                    <div>
                                        <div className="text-[16px] text-slate-900 uppercase font-bold mb-2">Potential Issues:</div>
                                        <ul className="space-y-2">
                                            {data.marriageLife.issues.map((issue, i) => (
                                                <li key={i} className="flex gap-2 text-slate-900">
                                                    <span className="text-red-500">✦</span> <span>{issue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Spirituality */}
                    {data.spirituality && (selectedTopic === "all" || selectedTopic === "spirituality") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">🧘 Spirituality & Karmic Path</h3>
                            <div className="mb-4">
                                <div className="text-[16px] text-slate-900 uppercase font-bold">Spiritual Level</div>
                                <div className="font-semibold text-black">{data.spirituality.level}</div>
                            </div>
                            <p className="text-slate-900 mb-4">{data.spirituality.description}</p>
                            <div className="mb-4">
                                <span className="text-[16px] text-slate-900 uppercase font-bold block mb-1">Karmic Path:</span>
                                <span className="text-slate-900 leading-relaxed">{data.spirituality.karmicPath}</span>
                            </div>
                        </div>
                    )}

                    {/* Career Suggestions */}
                    {data.careerSuggestions && data.careerSuggestions.length > 0 && (selectedTopic === "all" || selectedTopic === "careerSuggestions") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-sky-900 mb-2 flex items-center gap-2">💼 Career Suggestions</h3>
                            <p className="text-slate-900 text-[16px] mb-6">Based on your planetary positions and BNN combinations, these career paths align with your cosmic blueprint. Higher ratings (8-10) are your natural calling.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.careerSuggestions.map((c, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-rose-200 hover:border-sky-500/50 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-black">{c.title}</h4>
                                            <span className="bg-emerald-900/50 text-emerald-900 text-[16px] px-2 py-1 rounded font-bold border border-emerald-500/30">
                                                {c.rating}
                                            </span>
                                        </div>
                                        <p className="text-slate-900 text-[16px] mb-3">{c.subtitle}</p>

                                        {c.influencedBy && c.influencedBy.length > 0 && (
                                            <div className="mb-3">
                                                <div className="text-[16px] text-slate-900 uppercase font-bold mb-1">Influenced by:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {c.influencedBy.map((p, idx) => (
                                                        <span key={idx} className="bg-rose-100 text-slate-900 text-[16px] px-2 py-0.5 rounded">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-slate-900 text-[16px] leading-relaxed"><span className="text-slate-900">Why this suits you:</span> {c.why}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Life Periods */}
                    {data.lifePeriods && data.lifePeriods.length > 0 && (selectedTopic === "all" || selectedTopic === "lifePeriods") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">⏳ Life Periods (Favorable Timings)</h3>
                            <p className="text-slate-900 text-sm mb-6">Based on your BNN planetary positions, these periods indicate favorable timings for different life areas.</p>

                            <div className="space-y-6">
                                {data.lifePeriods.map((lp, i) => {
                                    let icon = "⏳";
                                    let colorClass = "text-slate-900";
                                    let bgClass = "bg-slate-900";
                                    if (lp.area?.toLowerCase().includes("career")) { icon = "💼"; colorClass = "text-blue-900"; bgClass = "bg-blue-900"; }
                                    else if (lp.area?.toLowerCase().includes("wealth")) { icon = "💰"; colorClass = "text-emerald-900"; bgClass = "bg-emerald-900"; }
                                    else if (lp.area?.toLowerCase().includes("love")) { icon = "❤️"; colorClass = "text-rose-900"; bgClass = "bg-rose-900"; }
                                    else if (lp.area?.toLowerCase().includes("marriage")) { icon = "💒"; colorClass = "text-pink-900"; bgClass = "bg-pink-900"; }

                                    let percent = 50;
                                    if (lp.strength?.toLowerCase() === "strong") percent = 100;
                                    else if (lp.strength?.toLowerCase() === "moderate") percent = 65;
                                    else if (lp.strength?.toLowerCase() === "weak") percent = 30;

                                    return (
                                        <div key={i} className="bg-white p-4 rounded-lg border border-rose-200">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`text-2xl ${colorClass}`}>{icon}</div>
                                                    <div>
                                                        <div className={`font-bold ${colorClass}`}>{lp.area}</div>
                                                        <div className="text-[16px] text-slate-900 uppercase">{lp.strength}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-black">Ages {lp.ageStart} — {lp.ageEnd}</div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden relative">
                                                    <div className={`absolute top-0 left-0 h-full ${bgClass} rounded-full`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                                <div className="flex justify-between text-[16px] text-slate-900 mt-1 font-mono">
                                                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                                                </div>
                                            </div>

                                            <p className="text-[16px] text-slate-900 mb-3">{lp.description}</p>

                                            <div className="bg-white/80 p-3 rounded text-[16px] text-slate-900 border border-rose-200">
                                                <div className="mb-1"><span className="text-slate-900">Activated by: </span><span className="font-semibold text-slate-900">{lp.activatedBy?.join(", ")}</span></div>
                                                <div><span className="text-slate-900">Maximize this period: </span><span className="text-slate-900">{lp.maximize}</span></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Raj Yogas */}
                    {data.rajYogas && data.rajYogas.length > 0 && (selectedTopic === "all" || selectedTopic === "rajYogas") && (
                        <div className="bg-white/80 p-6 rounded-xl border border-rose-200">
                            <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2">✨ BNN Raj Yogas</h3>
                            <p className="text-slate-900 text-sm mb-6">Raj Yogas are powerful planetary combinations that bring success, prosperity, and elevated status.</p>

                            <div className="space-y-4">
                                {data.rajYogas.map((ry, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-rose-200">
                                        <h4 className="font-bold text-yellow-900 text-lg mb-1">{ry.name}</h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="bg-rose-100 text-slate-900 text-xs px-2 py-1 rounded">{ry.type} Combination</span>
                                            <span className="bg-rose-100 text-slate-900 text-xs px-2 py-1 rounded">Direction: {ry.direction}</span>
                                        </div>
                                        <p className="text-slate-900 text-[16px] mb-4">{ry.description}</p>

                                        {ry.specificEffects && ry.specificEffects.length > 0 && (
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-1">🎯 Specific Effects:</div>
                                                <ul className="space-y-1 pl-2">
                                                    {ry.specificEffects.map((e, idx) => (
                                                        <li key={idx} className="flex gap-2 text-slate-900 text-[16px]">
                                                            <span className="text-yellow-500">✦</span> <span>{e}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-rose-50 text-black p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-3">
                            <span className="text-4xl">📜</span> Bhrigu Nandi Nadi Reading
                        </h1>
                        <p className="text-slate-900 mt-1">Based entirely on Planetary Conjunctions and Trines</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-sky-200 text-black px-4 py-2 rounded-lg font-semibold hover:bg-sky-300 transition-colors"
                        >
                            Analysis
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('qa-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-amber-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-200 transition-colors"
                        >
                            Ask Question
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* Chart Basis Info Banner & Interactive Controls */}
                <div className={`p-4 rounded-2xl border transition-all mb-6 ${
                    isDobOnly 
                        ? "bg-amber-50/90 border-amber-300 text-amber-950 shadow-sm" 
                        : "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm"
                }`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-start gap-3">
                            <span className="text-3xl mt-0.5">{isDobOnly ? "📅" : "🌟"}</span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                        isDobOnly ? "bg-amber-200/80 border-amber-400 text-amber-900" : "bg-emerald-200/80 border-emerald-400 text-emerald-900"
                                    }`}>
                                        {isDobOnly ? "Date of Birth Only Mode" : "Complete Natal Chart"}
                                    </span>
                                    {userName && (
                                        <span className="text-xs font-bold text-slate-700">
                                            Native: <strong className="text-black">{userName}</strong>
                                        </span>
                                    )}
                                    <span className="text-[11px] text-slate-500 font-medium">
                                        • Gender: {gender === "Female" ? "Female (Shukra/Venus)" : "Male (Guru/Jupiter)"}
                                    </span>
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                                    {isDobOnly 
                                        ? `Bhrigu Nandi Nadi Karaka Chart — DOB: ${userDob || "Not Provided"} (12:00 PM Standard Ephemeris)`
                                        : `Full Birth Chart — DOB: ${userDob || "-"} • Time: ${userTime || "-"} • ${userLocationName || (userLat ? `${userLat}, ${userLon}` : "Birth Location")}`
                                    }
                                </h4>
                                <p className="text-xs text-slate-700 mt-0.5 max-w-3xl leading-relaxed">
                                    {isDobOnly
                                        ? "Classical Bhrigu Nandi Nadi (BNN) operates primarily on planetary Karakas (Jupiter=Jeeva, Venus=Female Jeeva, Saturn=Karma) and their 1-5-9 elemental trine aspects on the day of birth. Exact birth time & Ascendant (Lagna) are not required."
                                        : "Calculated with exact birth time and geographic coordinates. Exact Ascendant (Lagna), houses, and precise planetary & Moon degrees are fully activated."
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowEditDrawer(!showEditDrawer)}
                            className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center"
                        >
                            <span>{showEditDrawer ? "▲ Hide Controls" : "✏️ Modify Birth Details / Switch Basis"}</span>
                        </button>
                    </div>

                    {/* Collapsible Edit / Basis Switcher Drawer */}
                    {showEditDrawer && (
                        <div className="mt-4 pt-4 border-t border-rose-200/80 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-800">Chart Basis:</span>
                                    <div className="flex bg-white p-1 rounded-xl border border-rose-200 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setIsDobOnly(true)}
                                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                                isDobOnly ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 hover:text-black"
                                            }`}
                                        >
                                            📅 Date of Birth Only
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsDobOnly(false)}
                                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                                !isDobOnly ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-black"
                                            }`}
                                        >
                                            🌟 Full (DOB + Time + Location)
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAutoFillFromKundaliForm}
                                    className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-lg border border-rose-300 text-xs transition-all flex items-center gap-1.5 shadow-2xs"
                                    title="Load birth details from Generate Kundali Form"
                                >
                                    📥 Auto-Fill from Kundali Form
                                </button>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Native Name"
                                        className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Gender (Karaka)</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                    >
                                        <option value="Male">Male (Guru / Jupiter)</option>
                                        <option value="Female">Female (Shukra / Venus)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={userDob}
                                        onChange={(e) => setUserDob(e.target.value)}
                                        className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                    />
                                </div>
                                {!isDobOnly ? (
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Time of Birth *</label>
                                        <input
                                            type="time"
                                            value={userTime}
                                            onChange={(e) => setUserTime(e.target.value)}
                                            className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center pt-5 text-slate-500 font-semibold italic text-[11px]">
                                        ℹ️ 12:00 PM standard ephemeris used in DOB-only mode.
                                    </div>
                                )}
                            </div>

                            {!isDobOnly && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Location Name</label>
                                        <input
                                            type="text"
                                            value={userLocationName}
                                            onChange={(e) => setUserLocationName(e.target.value)}
                                            placeholder="e.g. New Delhi, India"
                                            className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={userLat}
                                            onChange={(e) => setUserLat(parseFloat(e.target.value))}
                                            placeholder="28.6139"
                                            className="w-full bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                step="0.0001"
                                                value={userLon}
                                                onChange={(e) => setUserLon(parseFloat(e.target.value))}
                                                placeholder="77.2090"
                                                className="flex-1 bg-white border border-rose-200 rounded-lg p-2 font-medium text-slate-900 outline-none focus:ring-1 focus:ring-rose-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleDetectLocation}
                                                disabled={locationDetecting}
                                                className="px-2.5 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-bold rounded-lg border border-yellow-300 text-[11px] whitespace-nowrap disabled:opacity-50"
                                                title="Detect Current Location"
                                            >
                                                {locationDetecting ? "Detecting..." : "📍 Detect"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleRecalculate(isDobOnly)}
                                    disabled={recalculating}
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                                >
                                    {recalculating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Recalculating Nadi Chart...
                                        </>
                                    ) : (
                                        <>🔄 Recalculate Nadi Chart</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <NadiChartGrid
                    planetsBySign={nadiResult.nadi_data.planets_by_sign}
                    retrogradePlanets={nadiResult.nadi_data.retrograde_planets}
                    planetPositions={currentData?.planet_positions || data?.planet_positions}
                    isDobOnly={isDobOnly}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div id="analysis-section" className="md:col-span-2 bg-white rounded-xl shadow-xl p-6 border border-rose-200">
                        <div className="flex items-center justify-between mb-6 border-b border-rose-200 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-black">Comprehensive Nadi Analysis</h2>
                                <p className="text-[16px] text-slate-900">Detailed breakdown based on BNN principles.</p>
                            </div>
                            <div className="flex bg-rose-50 rounded-lg p-1 border border-rose-200">
                                <button
                                    onClick={() => handleGenderChange("Male")}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${gender === "Male" ? "bg-indigo-600 text-black shadow" : "text-slate-600 hover:text-black"}`}
                                >
                                    Male (Jupiter)
                                </button>
                                <button
                                    onClick={() => handleGenderChange("Female")}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded-md text-[16px] font-medium transition-all ${gender === "Female" ? "bg-rose-600 text-black shadow" : "text-slate-600 hover:text-black"}`}
                                >
                                    Female (Venus)
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center text-slate-900 animate-pulse">Consulting the Nadi Granthas...</div>
                        ) : (
                            <StructuredReadingRender data={nadiResult.reading} />
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-xl p-6 border border-rose-200">
                            <h3 className="font-bold text-lg text-black mb-4 border-b border-rose-200 pb-2">Elemental Trines (1, 5, 9)</h3>
                            <p className="text-[16px] text-slate-900 mb-4">Planets in the same element support each other 100%.</p>

                            <div className="space-y-3">
                                <div className="bg-orange-950/30 p-3 rounded-lg border border-orange-900/50">
                                    <div className="text-[16px] text-orange-900 font-bold uppercase tracking-wider mb-1">Fire (Action)</div>
                                    <div className="font-medium">{trines["Fire (1,5,9)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                                    <div className="text-[16px] text-emerald-900 font-bold uppercase tracking-wider mb-1">Earth (Wealth)</div>
                                    <div className="font-medium">{trines["Earth (2,6,10)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-sky-950/30 p-3 rounded-lg border border-sky-900/50">
                                    <div className="text-[16px] text-sky-900 font-bold uppercase tracking-wider mb-1">Air (Intellect)</div>
                                    <div className="font-medium">{trines["Air (3,7,11)"].join(", ") || "Empty"}</div>
                                </div>
                                <div className="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50">
                                    <div className="text-[16px] text-blue-900 font-bold uppercase tracking-wider mb-1">Water (Emotion)</div>
                                    <div className="font-medium">{trines["Water (4,8,12)"].join(", ") || "Empty"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl p-6 border border-rose-200">
                            <h3 className="font-bold text-lg text-black mb-2">BNN Principles</h3>
                            <ul className="text-[16px] text-slate-900 space-y-2 list-disc pl-4">
                                <li><strong>Conjunctions:</strong> Planets in same sign blend completely.</li>
                                <li><strong>Trines (1,5,9):</strong> Strongest supportive aspect.</li>
                                <li><strong>2nd Sign:</strong> Future events, moving towards this energy.</li>
                                <li><strong>12th Sign:</strong> Past karma, foundation, or letting go.</li>
                                <li><strong>7th Sign:</strong> Opposition or partners.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Advanced Nadi Insights */}
                {nadiResult?.nadi_data && (
                    <div className="mb-8 bg-white rounded-xl shadow-xl p-6 border border-rose-200">
                        <h2 className="text-xl font-bold text-black mb-4 border-b border-rose-200 pb-2 flex items-center gap-2">
                            <span>🔮</span> Advanced Nadi Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Special Yogas */}
                            {nadiResult.nadi_data.special_yogas && nadiResult.nadi_data.special_yogas.length > 0 && (
                                <div className="bg-white/80 rounded-lg p-4 border border-rose-200 lg:col-span-2">
                                    <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">🌟 Special Yogas (Blessings & Clashes)</h3>
                                    <ul className="space-y-2">
                                        {nadiResult.nadi_data.special_yogas.map((yoga, idx) => (
                                            <li key={idx} className="text-[16px] text-slate-900 bg-white p-2 rounded border border-rose-200/50">
                                                {yoga}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* D9 Dignities */}
                            {nadiResult.nadi_data.d9_dignities && Object.keys(nadiResult.nadi_data.d9_dignities).length > 0 && (
                                <div className="bg-white/80 rounded-lg p-4 border border-rose-200">
                                    <h3 className="text-[16px] font-bold text-emerald-900 mb-3 flex items-center gap-2">💎 D9 Navamsha</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(nadiResult.nadi_data.d9_dignities).map(([planet, status], idx) => (
                                            <div key={idx} className="text-[16px] bg-emerald-950/30 text-emerald-900 p-2 rounded border border-emerald-900/50 text-center">
                                                <div className="font-bold">{planet}</div>
                                                <div className="opacity-80">{status}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Current Transits */}
                            {nadiResult.nadi_data.current_transits && (
                                <div className="bg-white/80 rounded-lg p-4 border border-rose-200">
                                    <h3 className="text-[16px] font-bold text-sky-900 mb-3 flex items-center gap-2">⏱️ Transits (Gochar)</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(nadiResult.nadi_data.current_transits).map(([planet, sign], idx) => (
                                            <div key={idx} className="text-[16px] bg-sky-950/30 text-sky-900 p-2 rounded border border-sky-900/50 text-center">
                                                <div className="font-bold">{planet}</div>
                                                <div className="opacity-80">{sign}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Retrograde & Parivartana */}
                            <div className="bg-white/80 rounded-lg p-4 border border-rose-200 lg:col-span-2 flex flex-col gap-4">
                                <div>
                                    <h3 className="text-[16px] font-bold text-rose-900 mb-2 flex items-center gap-2">🔁 Retrograde Planets (Vakri)</h3>
                                    {nadiResult.nadi_data.retrograde_planets && nadiResult.nadi_data.retrograde_planets.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {nadiResult.nadi_data.retrograde_planets.map((p, idx) => (
                                                <span key={idx} className="text-[16px] bg-rose-950/30 text-rose-900 px-3 py-1.5 rounded border border-rose-900/50">{p} gives effects from previous house</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[16px] text-slate-900">None</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">🔄 Sign Exchanges (Parivartana)</h3>
                                    {nadiResult.nadi_data.sign_exchanges && nadiResult.nadi_data.sign_exchanges.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {nadiResult.nadi_data.sign_exchanges.map((ex, idx) => (
                                                <span key={idx} className="text-[16px] bg-purple-950/30 text-purple-900 px-3 py-1.5 rounded border border-purple-900/50">{ex}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[16px] text-slate-900">None</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Q&A Section */}
                <div id="qa-section" className="mt-8 bg-white rounded-xl shadow-xl p-6 border border-rose-200">
                    <h2 className="text-xl font-bold text-black mb-2">Ask a Question based on your Nadi Chart</h2>
                    <p className="text-[16px] text-slate-900 mb-4">Have a specific question? The AI will interpret it using strict Bhrigu Nandi Nadi rules based on your chart.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[16px] font-bold text-slate-900 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-rose-50 border border-rose-200 rounded-lg p-3 text-black focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            {category !== "Other" && PREDEFINED_QUESTIONS[category] && (
                                <div className="mt-3 bg-white/80 rounded-lg border border-rose-200/50 p-3">
                                    <label className="block text-[16px] font-bold text-slate-900 mb-2 uppercase tracking-wider">Suggested Questions</label>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {PREDEFINED_QUESTIONS[category].map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setQuestion(q)}
                                                className="text-[16px] bg-white hover:bg-rose-100 text-slate-900 hover:text-slate-900 px-3 py-1.5 rounded-full border border-slate-600 transition-colors text-left shadow-sm"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[16px] font-bold text-slate-900 mb-1">Your Question</label>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g. Will I get married this year?"
                                rows="3"
                                className="w-full bg-rose-50 border border-rose-200 rounded-lg p-3 text-black focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            onClick={handleAskQuestion}
                            disabled={asking}
                            className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${asking ? 'bg-rose-100 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black hover:shadow-amber-500/25'}`}
                        >
                            {asking ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Consulting the Nadi...
                                </>
                            ) : (
                                <>Ask Question</>
                            )}
                        </button>

                        {qaError && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg text-[16px] mt-4">
                                {qaError}
                            </div>
                        )}
                    </div>
                </div>

                {qaResult && (
                    <div className="mt-6 bg-gradient-to-br from-amber-900/40 to-slate-800 rounded-xl shadow-2xl p-6 border border-amber-500/30 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📜</div>
                        <h2 className="text-2xl font-bold text-amber-300 mb-4 border-b border-amber-500/30 pb-2">Nadi Interpretation</h2>
                        <div className="prose prose-invert prose-amber max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {qaResult}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
