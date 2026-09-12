import React, { useState, useEffect, useRef } from 'react';
import { fetchAshtamangala, fetchCurrentAscendant } from '../services/api';
import PrasnaChakra from './PrasnaChakra';

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ASHTAMANGALA_SYMBOLS = {
    1: { deity: "Sun (Surya)", symbol: "Garuda / Eagle", icon: "🦅", nature: "Auspicious", desc: "Success, royal favor, vitality & high energy" },
    2: { deity: "Mars (Kuja)", symbol: "Tiger (Vyaghra)", icon: "🐅", nature: "Fierce / Caution", desc: "Conflict, tension, haste & courageous action" },
    3: { deity: "Jupiter (Guru)", symbol: "Lion (Simha)", icon: "🦁", nature: "Highly Auspicious", desc: "Victory, divine blessings, righteousness & wisdom" },
    4: { deity: "Mercury (Budha)", symbol: "Snake (Sarpa)", icon: "🐍", nature: "Challenging", desc: "Deceit, unexpected twists, concealed motives" },
    5: { deity: "Moon (Chandra)", symbol: "Bow (Dhanus)", icon: "🏹", nature: "Auspicious", desc: "Target achieved, peace of mind & emotional fulfillment" },
    6: { deity: "Venus (Shukra)", symbol: "Elephant (Gaja)", icon: "🐘", nature: "Very Auspicious", desc: "Prosperity, high status, wealth gain & auspicious alliances" },
    7: { deity: "Saturn (Sani)", symbol: "Pot / Pitcher (Kumbha)", icon: "🏺", nature: "Challenging", desc: "Depletion, sorrow, delay & purification through patience" },
    8: { deity: "Rahu", symbol: "Dragon / Conch (Shankha)", icon: "🐚", nature: "Karmic Shift", desc: "Mystical turn, illusions unmasked & spiritual intervention" },
};

const TAMBULA_PLANETS_PREVIEW = {
    1: { planet: "Sun (Surya)", icon: "☀️", nature: "Auspicious", desc: "Vitality, authority, leadership & high clarity" },
    2: { planet: "Moon (Chandra)", icon: "🌙", nature: "Auspicious", desc: "Domestic peace, motherly grace, fluidity & emotional relief" },
    3: { planet: "Mars (Mangala)", icon: "⚡", nature: "Challenging", desc: "Friction, urgency, disputes, land matters & bold action" },
    4: { planet: "Mercury (Budha)", icon: "💬", nature: "Benefic", desc: "Intellectual trade, accounting, communications & agility" },
    5: { planet: "Jupiter (Guru)", icon: "🪷", nature: "Benefic", desc: "Wisdom, expansion, guidance, ethical prosperity" },
    6: { planet: "Venus (Shukra)", icon: "💎", nature: "Benefic", desc: "Pleasure, assets, artistic refinement & partnerships" },
    7: { planet: "Saturn (Sani)", icon: "🪐", nature: "Challenging", desc: "Delays, structural duty, sobriety & endurance" }
};

const NIMITTA_DIRECTIONS_LIST = [
    { id: "East", label: "East", sanskrit: "Purva", icon: "🌅", desc: "Solar favor, clarity & success", score: "+1" },
    { id: "North", label: "North", sanskrit: "Uttara", icon: "❄️", desc: "Kubera wealth & mental growth", score: "+1" },
    { id: "West", label: "West", sanskrit: "Paschima", icon: "🌇", desc: "Varuna delays & contemplation", score: "0" },
    { id: "South", label: "South", sanskrit: "Dakshina", icon: "🧭", desc: "Yama trials & ancestral debts", score: "-1" },
];

const NIMITTA_MOODS_LIST = [
    { id: "Calm", label: "Calm", sanskrit: "Prasanna", icon: "🧘", desc: "Sattvic balance & divine receptivity", score: "+2" },
    { id: "Anxious", label: "Anxious", sanskrit: "Vyathita", icon: "😰", desc: "Rajasic agitation & nervous tension", score: "-1" },
    { id: "Rushing", label: "Rushing", sanskrit: "Twarita", icon: "🏃", desc: "Impulsive haste & error-proneness", score: "-1" },
    { id: "Tearful", label: "Tearful", sanskrit: "Rodana", icon: "😢", desc: "Tamasic sorrow & emotional grief", score: "-2" },
];

const NIMITTA_SOUNDS_LIST = [
    { id: "Temple bell", label: "Temple Bell", icon: "🔔", score: "+2", nature: "Auspicious" },
    { id: "Sacred chant", label: "Sacred Chant", icon: "🪷", score: "+2", nature: "Auspicious" },
    { id: "Birds singing", label: "Birds Singing", icon: "🐦", score: "+1", nature: "Auspicious" },
    { id: "Dog barking", label: "Dog Barking", icon: "🐕", score: "-1", nature: "Adverse" },
    { id: "Crying child", label: "Crying Child", icon: "👶", score: "-2", nature: "Adverse" },
    { id: "Thunderstorm", label: "Thunderstorm", icon: "⚡", score: "-2", nature: "Adverse" },
];

const NIMITTA_DIRECTIONS = NIMITTA_DIRECTIONS_LIST;
const NIMITTA_MOODS = NIMITTA_MOODS_LIST;
const NIMITTA_SOUNDS = NIMITTA_SOUNDS_LIST;

function getMod8(num) {
    const r = num % 8;
    return r === 0 ? 8 : r;
}

export const QUICK_DIAGNOSTICS = [
    {
        id: "all",
        label: "🌟 Full Prasna (All Sections)",
        shortLabel: "All Analysis",
        question: "What are the divine omens, root-cause blockages, and remedial solutions for this query?",
        icon: "🌟",
        doshaIds: ["deva_dosha", "pitru_dosha", "sarpa_dosha", "drishti_badha", "vastu_dosha"],
        title: "Comprehensive Daivajna Prasna Report",
        desc: "Complete 360° Kerala Prasna reading across all omens, timing, sphutas, and doshas."
    },
    {
        id: "deva_pitru",
        label: "🛕 Deva & Pitru Dosha Scan",
        shortLabel: "Deva & Pitru Dosha",
        question: "Why are my current initiatives facing hidden blocks? Reveal active Deva & Pitru doshas.",
        icon: "🛕",
        doshaIds: ["deva_dosha", "pitru_dosha"],
        title: "Deva & Pitru Dosha Diagnostic Scan",
        desc: "Specialized scan for ancestral karmic debts (Pitru Rina), unfulfilled temple vows (Vazhipadu), and family deity (Kuladevata) displeasure."
    },
    {
        id: "sarpa",
        label: "🐍 Sarpa Shapa Scan",
        shortLabel: "Sarpa Shapa",
        question: "Are there any Sarpa Dosha or Naga Shapa afflictions hindering health, land, or family harmony?",
        icon: "🐍",
        doshaIds: ["sarpa_dosha"],
        title: "Sarpa Dosha / Naga Shapa Diagnostic Scan",
        desc: "Specialized scan for serpent curses (Naga Shapa), Rahu/Ketu Arudha afflictions, and sacred grove (Sarpa Kavu) disturbances."
    },
    {
        id: "drishti",
        label: "👁️ Drishti & Shatru Badha",
        shortLabel: "Drishti & Shatru",
        question: "Am I affected by Drishti Badha (evil eye), competitor envy, or hostile adversary energies?",
        icon: "👁️",
        doshaIds: ["drishti_badha"],
        title: "Drishti & Shatru Badha Diagnostic Scan",
        desc: "Specialized scan for evil eye (Drishti Badha), fierce competitor jealousy, covert hostility, and 6th/7th house adversary gaze."
    },
    {
        id: "vastu",
        label: "🏡 Vastu & Land Energy",
        shortLabel: "Vastu & Land",
        question: "Is there Vastu Dosha or geopathic land affliction obstructing domestic peace or prosperity?",
        icon: "🏡",
        doshaIds: ["vastu_dosha"],
        title: "Vastu & Land Energy Diagnostic Scan",
        desc: "Specialized scan for geopathic land afflictions, 4th house residence corruptions, and Bhoomi/Shalya doshas."
    }
];

export default function AshtamangalaPrasna() {
    const [question, setQuestion] = useState("");
    const [arudhaSign, setArudhaSign] = useState("Aries");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDiagnostic, setSelectedDiagnostic] = useState("all");
    const [isDetectingAscendant, setIsDetectingAscendant] = useState(false);
    const [arudhaMethodNote, setArudhaMethodNote] = useState("");

    // Refs for smooth navigation to Question & Arudha Form
    const questionFormRef = useRef(null);
    const questionInputRef = useRef(null);

    const scrollToQuestionForm = () => {
        if (questionFormRef.current) {
            questionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                if (questionInputRef.current) {
                    questionInputRef.current.focus();
                }
            }, 400);
        } else {
            const el = document.getElementById('question-arudha-form');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const input = document.getElementById('divine-question-input');
                if (input) {
                    setTimeout(() => input.focus(), 400);
                }
            }
        }
    };

    // 108 Kavadi Shell Casting State
    const [kavadiPiles, setKavadiPiles] = useState(null);
    const [isCastingKavadi, setIsCastingKavadi] = useState(false);

    // Tambula (Betel Leaf) & Nimitta (Omens) State
    const [tambulaCount, setTambulaCount] = useState(12);
    const [direction, setDirection] = useState("East");
    const [mood, setMood] = useState("Calm");
    const [selectedSounds, setSelectedSounds] = useState(["Temple bell"]);
    const [activeReportTab, setActiveReportTab] = useState("verdict");

    // Optional Janma Kundali (Birth Chart) State (Auto-synced from Generate Kundali Form)
    const [compareWithBirthChart, setCompareWithBirthChart] = useState(false);
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("12:00");
    const [birthCity, setBirthCity] = useState("");
    const [birthLat, setBirthLat] = useState(null);
    const [birthLon, setBirthLon] = useState(null);
    const [birthTz, setBirthTz] = useState(null);
    const [kundaliAutoLoaded, setKundaliAutoLoaded] = useState(false);

    // Automatically load birth data from Generate Kundali form (localStorage)
    const loadBirthDataFromKundaliForm = (force = false) => {
        try {
            let loaded = null;
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
                            date: bd.birth_date || bd.date || bd.Date,
                            time: bd.birth_time || bd.time || bd.Time || '12:00',
                            lat: bd.latitude || bd.lat || bd.Latitude || '',
                            lon: bd.longitude || bd.lon || bd.Longitude || '',
                            location_name: bd.birth_place || bd.place || bd.Place || bd.Location || '',
                            tz: bd.tz_offset || bd.Timezone || 5.5,
                        };
                    }
                }
            }

            if (loaded && (loaded.date || loaded.birth_date)) {
                const d = loaded.date || loaded.birth_date;
                const t = loaded.time || loaded.birth_time || '12:00';
                const loc = loaded.location_name || loaded.birth_place || loaded.city || 'Kundali Location';
                const latVal = loaded.lat ? parseFloat(loaded.lat) : null;
                const lonVal = loaded.lon ? parseFloat(loaded.lon) : null;
                const tzVal = loaded.tz !== undefined && loaded.tz !== null ? parseFloat(loaded.tz) : null;

                if (force || !birthDate) {
                    setBirthDate(d);
                    if (t) setBirthTime(t);
                    if (loc) setBirthCity(loc);
                    if (latVal && !isNaN(latVal)) setBirthLat(latVal);
                    if (lonVal && !isNaN(lonVal)) setBirthLon(lonVal);
                    if (tzVal !== null && !isNaN(tzVal)) setBirthTz(tzVal);
                }
                setKundaliAutoLoaded(true);
                return true;
            }
        } catch (e) {
            console.error("Error auto-loading from Kundali form:", e);
        }
        return false;
    };

    useEffect(() => {
        // Pre-check and load saved Kundali on component mount
        loadBirthDataFromKundaliForm(false);
    }, []);

    // Arudha Lagna Auto-Assist Handlers
    const handleAutoUdayaLagna = async () => {
        setIsDetectingAscendant(true);
        setArudhaMethodNote("");
        try {
            const data = await fetchCurrentAscendant(birthLat, birthLon);
            if (data && data.sign) {
                setArudhaSign(data.sign);
                const degText = (data.degree !== undefined && data.degree !== null) ? `${data.degree.toFixed(1)}°` : '';
                setArudhaMethodNote(`🎯 Set to Current Real-time Udaya Lagna (${data.sign} ${degText})`);
            }
        } catch (err) {
            console.error("Failed to detect current ascendant:", err);
            setArudhaMethodNote("⚠️ Could not calculate real-time ascendant. Please pick manually.");
        } finally {
            setIsDetectingAscendant(false);
        }
    };

    const handleAutoMoonSign = () => {
        try {
            const ws = localStorage.getItem('worksheetData');
            if (ws) {
                const parsed = JSON.parse(ws);
                const positions = parsed.planet_positions || [];
                const moonPos = positions.find(p => p.planet === "Moon" || p.name === "Moon");
                if (moonPos && moonPos.sign) {
                    setArudhaSign(moonPos.sign);
                    setArudhaMethodNote(`🌙 Set to Natal Moon Sign (Janma Rasi: ${moonPos.sign}) from saved Kundali.`);
                    return;
                }
                const mSign = parsed.moon_sign || parsed.basic_details?.moon_sign;
                if (mSign) {
                    setArudhaSign(mSign);
                    setArudhaMethodNote(`🌙 Set to Natal Moon Sign (Janma Rasi: ${mSign}) from saved Kundali.`);
                    return;
                }
            }
            setArudhaMethodNote("ℹ️ No saved Kundali found with Moon sign. Please generate a Kundali or choose manually.");
        } catch (e) {
            console.error("Error retrieving Moon sign:", e);
            setArudhaMethodNote("⚠️ Error reading saved birth chart.");
        }
    };

    const handleAutoBirthLagna = () => {
        try {
            const ws = localStorage.getItem('worksheetData');
            if (ws) {
                const parsed = JSON.parse(ws);
                const houses = parsed.charts?.houses || {};
                const asc1 = houses[1]?.sign_name || houses['1']?.sign_name || parsed.charts?.houses?.d1?.[1]?.sign_name;
                if (asc1) {
                    setArudhaSign(asc1);
                    setArudhaMethodNote(`🌅 Set to Natal Birth Lagna (${asc1} Ascendant) from saved Kundali.`);
                    return;
                }
                const positions = parsed.planet_positions || [];
                const ascPos = positions.find(p => p.planet === "Ascendant" || p.name === "Ascendant" || p.planet === "Lagna");
                if (ascPos && ascPos.sign) {
                    setArudhaSign(ascPos.sign);
                    setArudhaMethodNote(`🌅 Set to Natal Birth Lagna (${ascPos.sign} Ascendant) from saved Kundali.`);
                    return;
                }
                const aSign = parsed.ascendant_sign || parsed.basic_details?.ascendant_sign;
                if (aSign) {
                    setArudhaSign(aSign);
                    setArudhaMethodNote(`🌅 Set to Natal Birth Lagna (${aSign} Ascendant) from saved Kundali.`);
                    return;
                }
            }
            setArudhaMethodNote("ℹ️ No saved Kundali found with Natal Lagna. Please generate a Kundali or choose manually.");
        } catch (e) {
            console.error("Error retrieving Natal Lagna:", e);
            setArudhaMethodNote("⚠️ Error reading saved birth chart.");
        }
    };

    const handleDivinePlatterTouch = () => {
        const randomSign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
        setArudhaSign(randomSign);
        setArudhaMethodNote(`🎲 Swarna Arudha (Divine Touch): 12-chamber brass platter landed on ${randomSign}!`);
    };


    const toggleSound = (soundId) => {
        setSelectedSounds(prev =>
            prev.includes(soundId)
                ? prev.filter(s => s !== soundId)
                : [...prev, soundId]
        );
    };

    const tambulaRem = ((tambulaCount * 10) % 7) === 0 ? 7 : ((tambulaCount * 10) % 7);
    const tambulaPlanetPreview = TAMBULA_PLANETS_PREVIEW[tambulaRem] || TAMBULA_PLANETS_PREVIEW[5];
    const isOddTambula = tambulaCount % 2 !== 0;

    const cast108Kavadi = () => {
        setIsCastingKavadi(true);
        setTimeout(() => {
            // Authentic random split of 108 shells into 3 heaps (Past, Present, Future)
            const pastCount = Math.floor(Math.random() * (46 - 22 + 1)) + 22;
            const maxPresent = 108 - pastCount - 20;
            const presentCount = Math.floor(Math.random() * (maxPresent - 22 + 1)) + 22;
            const futureCount = 108 - (pastCount + presentCount);

            const pastRem = getMod8(pastCount);
            const presentRem = getMod8(presentCount);
            const futureRem = getMod8(futureCount);

            setKavadiPiles({
                past: { count: pastCount, rem: pastRem, ...ASHTAMANGALA_SYMBOLS[pastRem] },
                present: { count: presentCount, rem: presentRem, ...ASHTAMANGALA_SYMBOLS[presentRem] },
                future: { count: futureCount, rem: futureRem, ...ASHTAMANGALA_SYMBOLS[futureRem] }
            });
            setIsCastingKavadi(false);
        }, 1100);
    };

    const handleSelectDiagnostic = (diagId, autoTrigger = false) => {
        setSelectedDiagnostic(diagId);
        const diag = QUICK_DIAGNOSTICS.find(d => d.id === diagId);
        if (diag && diag.id !== "all") {
            setQuestion(diag.question);
        }
        if (!result || autoTrigger) {
            calculatePrasna(diag ? diag.question : null, diagId);
        }
    };

    const calculatePrasna = async (forcedQuestion = null, forcedDiagId = null) => {
        if (forcedDiagId) {
            setSelectedDiagnostic(forcedDiagId);
        }
        const queryText = (forcedQuestion || question).trim() || "What are the divine omens, root-cause blockages, and remedial solutions for this query?";
        if (forcedQuestion) {
            setQuestion(forcedQuestion);
        }
        setLoading(true);
        try {
            let lat = 19.0760, lon = 72.8777;
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.basic_details) {
                    lat = parsed.basic_details.lat || lat;
                    lon = parsed.basic_details.lon || lon;
                }
            }

            // If user hasn't cast cowries yet, cast automatically
            let currentKavadi = kavadiPiles;
            if (!currentKavadi) {
                const p = Math.floor(Math.random() * (46 - 22 + 1)) + 22;
                const pr = Math.floor(Math.random() * (108 - p - 20 - 22 + 1)) + 22;
                const f = 108 - (p + pr);
                currentKavadi = {
                    past: { count: p, rem: getMod8(p), ...ASHTAMANGALA_SYMBOLS[getMod8(p)] },
                    present: { count: pr, rem: getMod8(pr), ...ASHTAMANGALA_SYMBOLS[getMod8(pr)] },
                    future: { count: f, rem: getMod8(f), ...ASHTAMANGALA_SYMBOLS[getMod8(f)] }
                };
                setKavadiPiles(currentKavadi);
            }

            const payload = {
                latitude: lat,
                longitude: lon,
                question: queryText,
                arudha_sign: arudhaSign,
                kavadi: {
                    past: currentKavadi.past.count,
                    present: currentKavadi.present.count,
                    future: currentKavadi.future.count
                },
                tambula: {
                    count: tambulaCount
                },
                nimitta: {
                    direction: direction,
                    mood: mood,
                    sounds: selectedSounds
                },
                birth_data: compareWithBirthChart && birthDate ? {
                    dob: birthDate,
                    tob: birthTime || "12:00",
                    city: birthCity || "Querent Place",
                    lat: (birthLat !== null && !isNaN(birthLat)) ? birthLat : lat,
                    lon: (birthLon !== null && !isNaN(birthLon)) ? birthLon : lon,
                    tz_offset: (birthTz !== null && !isNaN(birthTz)) ? birthTz : (lon / 15.0)
                } : null
            };

            const res = await fetchAshtamangala(payload);
            console.log("Ashtamangala Response:", res);
            setResult(res.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rose-50 text-slate-900 font-sans p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-rose-200">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
                            🐚 Kerala Vedic Astrology • Prasna Marga
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span>🐚</span> Ashtamangala Prasna
                        </h1>
                        <p className="text-[18px] sm:text-base text-slate-900 mt-1 font-medium">
                            108 Sacred Cowries (Varatika), Arudha Lagna & Divine Planetary Omens
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                        <button
                            type="button"
                            onClick={scrollToQuestionForm}
                            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 text-sm cursor-pointer active:scale-98"
                            title="Jump directly to Question & Arudha Form"
                        >
                            <span>✍️</span>
                            <span>Ask Question</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => window.close()}
                            className="px-4 py-2 bg-white hover:bg-rose-100 text-slate-900 border border-rose-200 font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-sm cursor-pointer"
                        >
                            <span>✕ Close</span>
                        </button>
                    </div>
                </header>

                <div className="space-y-8">
                    {/* SECTION 1: 108 SACRED COWRIES (KAVADI) RITUAL */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-rose-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <span>🪬</span> 108 Sacred Cowrie (Kavadi) Casting
                                </h2>
                                <p className="text-[16px] sm:text-[16px] text-slate-900 mt-0.5">
                                    The querent casts 108 sanctified cowrie shells, divided into Tri-Bhaga (Past, Present, and Future heaps) modulo 8.
                                </p>
                            </div>
                            <button
                                onClick={cast108Kavadi}
                                disabled={isCastingKavadi}
                                className="px-5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isCastingKavadi ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-amber-700" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Tossing Shells...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🐚</span>
                                        <span>{kavadiPiles ? "Re-cast 108 Cowries" : "Cast 108 Cowries"}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Cowrie Animation or Visual Brass Platter Display */}
                        {isCastingKavadi ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center bg-rose-50/50 rounded-2xl border border-dashed border-rose-200 animate-pulse">
                                <div className="text-5xl animate-bounce mb-3">🐚 ✨ 🐚</div>
                                <h3 className="text-base font-bold text-slate-900">Shuffling 108 Sacred Varatikas...</h3>
                                <p className="text-[16px] text-slate-900 mt-1">Invoking Ganesha and Astrological Deities across the 3 heaps</p>
                            </div>
                        ) : kavadiPiles ? (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Past Heap */}
                                    <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200 shadow-2xs relative overflow-hidden">
                                        <div className="absolute top-2 right-2 text-2xl opacity-20">⌛</div>
                                        <span className="text-[12px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-2">
                                            Bhuta (Past / Origin)
                                        </span>
                                        <div className="flex items-baseline justify-between mb-1">
                                            <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                                                <span>{kavadiPiles.past.icon}</span>
                                                <span>{kavadiPiles.past.symbol}</span>
                                            </div>
                                            <span className="text-[14px] font-bold text-slate-900">{kavadiPiles.past.count} shells</span>
                                        </div>
                                        <div className="text-[14px] font-bold text-rose-900 mb-1">
                                            Deity: {kavadiPiles.past.deity} (Rem: {kavadiPiles.past.rem})
                                        </div>
                                        <p className="text-[16px] text-slate-900 leading-snug">
                                            {kavadiPiles.past.desc}
                                        </p>
                                    </div>

                                    {/* Present Heap */}
                                    <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200 shadow-2xs relative overflow-hidden">
                                        <div className="absolute top-2 right-2 text-2xl opacity-20">⚡</div>
                                        <span className="text-[14px] font-black uppercase tracking-wider text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-2">
                                            Vartamana (Present State)
                                        </span>
                                        <div className="flex items-baseline justify-between mb-1">
                                            <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                                                <span>{kavadiPiles.present.icon}</span>
                                                <span>{kavadiPiles.present.symbol}</span>
                                            </div>
                                            <span className="text-[16px] font-bold text-slate-900">{kavadiPiles.present.count} shells</span>
                                        </div>
                                        <div className="text-[16px] font-bold text-rose-900 mb-1">
                                            Deity: {kavadiPiles.present.deity} (Rem: {kavadiPiles.present.rem})
                                        </div>
                                        <p className="text-[6px] text-slate-900 leading-snug">
                                            {kavadiPiles.present.desc}
                                        </p>
                                    </div>

                                    {/* Future Heap */}
                                    <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200 shadow-2xs relative overflow-hidden">
                                        <div className="absolute top-2 right-2 text-2xl opacity-20">🌟</div>
                                        <span className="text-[12px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-2">
                                            Bhavishyat (Future Outcome)
                                        </span>
                                        <div className="flex items-baseline justify-between mb-1">
                                            <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                                                <span>{kavadiPiles.future.icon}</span>
                                                <span>{kavadiPiles.future.symbol}</span>
                                            </div>
                                            <span className="text-[16px] font-bold text-slate-900">{kavadiPiles.future.count} shells</span>
                                        </div>
                                        <div className="text-[16px] font-bold text-rose-900 mb-1">
                                            Deity: {kavadiPiles.future.deity} (Rem: {kavadiPiles.future.rem})
                                        </div>
                                        <p className="text-[16px] text-slate-900 leading-snug">
                                            {kavadiPiles.future.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center bg-rose-50/60 p-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2">
                                    <span>☸️ Karmic Trajectory:</span>
                                    <span className="font-bold text-slate-900">
                                        {kavadiPiles.past.symbol} ➔ {kavadiPiles.present.symbol} ➔ {kavadiPiles.future.symbol}
                                    </span>
                                    <span className="text-[16px] text-slate-900">(Sum: 108 Shells)</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-50/40 p-6 rounded-2xl border border-dashed border-rose-200 text-center">
                                <div className="text-3xl mb-2">🐚</div>
                                <h4 className="text-[16px] font-bold text-slate-900">Cast the 108 Sacred Cowries</h4>
                                <p className="text-[16px] text-slate-900 max-w-lg mx-auto mt-1">
                                    Click the button above to cast the shells into the 3 sacred piles of Ashtamangala, or submit your divine question directly to auto-cast.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: TAMBULA (BETEL LEAVES) & NIMITTA (OMENS AT CONSULTATION MOMENT) */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200">
                        <div className="mb-6 pb-4 border-b border-rose-100">
                            <span className="text-[12px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
                                🍃 Traditional Kerala Prasna Ritual • Step 2
                            </span>
                            <h2 className="text-[16px] font-black text-slate-900 flex items-center gap-2">
                                <span>🍃</span> Tambula (Betel Leaves) & <span>🕊️</span> Nimitta (Omens)
                            </h2>
                            <p className="text-xs sm:text-[16px] text-slate-900 mt-1">
                                In authentic Kerala Prasna Marga, the Daivajna begins by examining the Tambula (betel leaves offered by the querent) and interpreting spontaneous omens of direction, posture, and ambient sounds.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* PART A: TAMBULA COUNT INPUT */}
                            <div className="bg-rose-50/40 p-5 sm:p-6 rounded-2xl border border-rose-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                            <span>🍃</span> Tambula Count (Betel Leaves)
                                        </label>
                                        <span className={`text-[14px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${isOddTambula
                                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                                            : 'bg-indigo-100 text-indigo-900 border-indigo-200'
                                            }`}>
                                            {isOddTambula ? '⚡ Jeeva (Dynamic / Ayugma)' : '🏛️ Dhatu (Stable / Yugma)'}
                                        </span>
                                    </div>

                                    {/* Stepper + Counter Display */}
                                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setTambulaCount(prev => Math.max(5, prev - 1))}
                                            className="w-10 h-10 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-lg flex items-center justify-center transition-all cursor-pointer"
                                            title="Decrease leaf count"
                                        >
                                            -
                                        </button>
                                        <div className="text-center">
                                            <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                                                <span>🍃</span>
                                                <span>{tambulaCount}</span>
                                            </div>
                                            <span className="text-[16px] font-bold text-slate-500 uppercase tracking-wider">Betel Leaves Offered</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setTambulaCount(prev => Math.min(21, prev + 1))}
                                            className="w-10 h-10 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-lg flex items-center justify-center transition-all cursor-pointer"
                                            title="Increase leaf count"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Quick Selection Buttons */}
                                    <div className="mb-4">
                                        <span className="text-[16px] font-extrabold uppercase tracking-wider text-slate-900 block mb-1.5">
                                            Quick Presets (5 to 21 leaves):
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[5, 7, 9, 11, 12, 15, 21].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setTambulaCount(val)}
                                                    className={`px-3 py-1 rounded-xl text-[16px] font-bold border transition-all cursor-pointer ${tambulaCount === val
                                                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                        : 'bg-white hover:bg-rose-100/70 text-slate-700 border-rose-200'
                                                        }`}
                                                >
                                                    {val} leaves
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Live Mathematical Significator Preview */}
                                <div className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs">
                                    <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-rose-100">
                                        <span className="text-[16px] font-extrabold uppercase text-slate-900">
                                            Planetary Significator
                                        </span>
                                        <span className="text-[16px] font-bold text-rose-900 font-mono">
                                            ({tambulaCount} × 10) mod 7 = {tambulaRem}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl">{tambulaPlanetPreview.icon}</span>
                                        <span className="font-black text-slate-900 text-[16px]">
                                            {tambulaPlanetPreview.planet}
                                        </span>
                                        <span className="text-[16px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                                            {tambulaPlanetPreview.nature}
                                        </span>
                                    </div>
                                    <p className="text-slate-900 text-[16px] leading-snug">
                                        {tambulaPlanetPreview.desc}. Significator points to the <strong className="text-slate-900">{((tambulaCount % 12) + 1)}th House</strong> from Arudha.
                                    </p>
                                </div>
                            </div>

                            {/* PART B: NIMITTA (OMENS AT MOMENT OF QUESTION) */}
                            <div className="space-y-4">
                                {/* 1. Direction Facing */}
                                <div>
                                    <label className="text-[18px] font-black uppercase tracking-wider text-slate-900 block mb-1.5 flex items-center justify-between">
                                        <span>🧭 Direction Facing</span>
                                        <span className="text-[16px] text-slate-500 font-semibold lowercase">Select querent orientation</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {NIMITTA_DIRECTIONS_LIST.map(d => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => setDirection(d.id)}
                                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${direction === d.id
                                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                    : 'bg-rose-50/50 hover:bg-rose-100/70 text-slate-800 border-rose-200'
                                                    }`}
                                            >
                                                <div className="text-base mb-0.5">{d.icon}</div>
                                                <div className="text-[16px] font-black">{d.label}</div>
                                                <div className={`text-[16px] font-medium ${direction === d.id ? 'text-rose-100' : 'text-slate-500'}`}>
                                                    {d.sanskrit} • {d.score}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Mood / Posture */}
                                <div>
                                    <label className="text-[16px] font-black uppercase tracking-wider text-slate-900 block mb-1.5 flex items-center justify-between">
                                        <span>🧘 Current Mood / Posture</span>
                                        <span className="text-[16px] text-slate-500 font-semibold lowercase">Querent psychic disposition</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {NIMITTA_MOODS_LIST.map(m => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => setMood(m.id)}
                                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${mood === m.id
                                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                                    : 'bg-rose-50/50 hover:bg-rose-100/70 text-slate-800 border-rose-200'
                                                    }`}
                                            >
                                                <div className="text-[16px] mb-0.5">{m.icon}</div>
                                                <div className="text-[16px] font-black">{m.label}</div>
                                                <div className={`text-[16px] font-medium ${mood === m.id ? 'text-rose-100' : 'text-slate-500'}`}>
                                                    {m.sanskrit} • {m.score}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Surrounding Sounds */}
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-900 block mb-1.5 flex items-center justify-between">
                                        <span>🔔 Surrounding Sounds (Acoustic Omens)</span>
                                        <span className="text-[16px] text-slate-900 font-semibold lowercase">Select observed sounds</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {NIMITTA_SOUNDS_LIST.map(s => {
                                            const isChecked = selectedSounds.includes(s.id);
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => toggleSound(s.id)}
                                                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${isChecked
                                                        ? 'bg-rose-100/80 text-rose-950 border-rose-400 font-bold shadow-2xs'
                                                        : 'bg-white hover:bg-rose-50/50 text-slate-700 border-rose-200'
                                                        }`}
                                                >
                                                    <span className="text-lg">{s.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[16px] truncate">{s.label}</div>
                                                        <div className={`text-[16px] font-bold ${s.score.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'
                                                            }`}>
                                                            {s.score} Omen
                                                        </div>
                                                    </div>
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[16px] border ${isChecked
                                                        ? 'bg-rose-600 text-white border-rose-600'
                                                        : 'border-slate-300 text-transparent'
                                                        }`}>
                                                        ✓
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: QUESTION & ARUDHA FORM */}
                    <div id="question-arudha-form" ref={questionFormRef} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200 scroll-mt-6">
                        <div className="space-y-6">
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                    <label className="block text-[18px] uppercase font-extrabold text-slate-900 tracking-wider">
                                        Select Arudha Lagna (Querent Sign)
                                    </label>
                                    <span className="text-[16px] font-semibold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 w-fit">
                                        Selected: <strong className="text-rose-950 font-black">{arudhaSign}</strong>
                                    </span>
                                </div>

                                <p className="text-[16px] text-slate-900 mb-3">
                                    Don&apos;t know your Arudha? Pick manually or click any 1-click auto-assist button below:
                                </p>

                                {/* One-Click Auto-Assist Action Buttons */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                                    <button
                                        type="button"
                                        onClick={handleAutoUdayaLagna}
                                        disabled={isDetectingAscendant}
                                        title="Calculate the real-time sidereal ascendant at this very moment (Udaya Lagna)"
                                        className="group relative flex flex-col items-start p-3 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 hover:border-amber-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-base">{isDetectingAscendant ? "⏳" : "🎯"}</span>
                                            <span className="text-[16px] font-black text-amber-950 group-hover:text-amber-900">
                                                {isDetectingAscendant ? "Calculating..." : "Current Udaya"}
                                            </span>
                                        </div>
                                        <span className="text-[16px] text-amber-800 font-medium leading-tight">
                                            Real-time sky Lagna
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAutoMoonSign}
                                        title="Auto-fill your Natal Moon sign (Janma Rasi) from saved birth chart"
                                        className="group relative flex flex-col items-start p-3 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 hover:border-indigo-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-base">🌙</span>
                                            <span className="text-[16px] font-black text-indigo-950 group-hover:text-indigo-900">
                                                Janma Rasi
                                            </span>
                                        </div>
                                        <span className="text-[16px] text-indigo-800 font-medium leading-tight">
                                            My Natal Moon sign
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAutoBirthLagna}
                                        title="Auto-fill your Natal Ascendant (Birth Lagna) from saved birth chart"
                                        className="group relative flex flex-col items-start p-3 bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 hover:border-rose-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-base">🌅</span>
                                            <span className="text-[16px] font-black text-rose-950 group-hover:text-rose-900">
                                                Birth Lagna
                                            </span>
                                        </div>
                                        <span className="text-[16px] text-rose-800 font-medium leading-tight">
                                            My Natal Ascendant
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDivinePlatterTouch}
                                        title="Simulate traditional Kerala Swarna Arudha brass platter random touch"
                                        className="group relative flex flex-col items-start p-3 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 hover:border-emerald-400 rounded-2xl transition-all shadow-2xs hover:shadow-xs active:scale-98 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[16px]">🎲</span>
                                            <span className="text-[16px] font-black text-emerald-950 group-hover:text-emerald-900">
                                                Divine Touch
                                            </span>
                                        </div>
                                        <span className="text-[16px] text-emerald-800 font-medium leading-tight">
                                            Kerala Swarna Platter
                                        </span>
                                    </button>
                                </div>

                                {arudhaMethodNote && (
                                    <div className="flex items-center justify-between gap-2 p-2.5 px-3.5 mb-3 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs font-semibold animate-fadeIn shadow-2xs">
                                        <div className="flex items-center gap-2">
                                            <span>✨</span>
                                            <span>{arudhaMethodNote}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setArudhaMethodNote("")}
                                            className="text-amber-700 hover:text-amber-950 text-[16px] font-bold px-1.5 py-0.5 rounded hover:bg-amber-100 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}

                                <select
                                    value={arudhaSign}
                                    onChange={e => {
                                        setArudhaSign(e.target.value);
                                        setArudhaMethodNote(`✍️ Manually selected ${e.target.value}`);
                                    }}
                                    className="w-full bg-rose-50/60 border border-rose-200 rounded-2xl p-4 text-slate-900 font-bold text-lg focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all shadow-xs"
                                >
                                    {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* OPTIONAL: Compare with Janma Kundali (Birth Chart) Toggle */}
                            <div className="pt-2 border-t border-rose-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50/60 hover:bg-rose-50/90 rounded-2xl border border-rose-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-xs shrink-0">
                                            📜
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-extrabold text-slate-900">Compare with Janma Kundali (Birth Chart)</span>
                                                <span className="text-[16px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">Optional</span>
                                            </div>
                                            <p className="text-[16px] text-slate-900">Cross-examine your Natal Moon (Janma Rasi) and Lagna against current Horary Arudha (Janma-Prasna Samvada).</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextState = !compareWithBirthChart;
                                            setCompareWithBirthChart(nextState);
                                            if (nextState) {
                                                loadBirthDataFromKundaliForm(true);
                                            }
                                        }}
                                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${compareWithBirthChart ? 'bg-rose-600' : 'bg-slate-300'
                                            }`}
                                        role="switch"
                                        aria-checked={compareWithBirthChart}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${compareWithBirthChart ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {compareWithBirthChart && (
                                    <div className="mt-3 p-4 sm:p-5 bg-white rounded-2xl border-2 border-dashed border-rose-300 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 text-[16px] font-bold text-rose-900">
                                                <span>⭐ Birth Details for Janma-Prasna Cross Examination</span>
                                            </div>
                                            {kundaliAutoLoaded ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[16px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                                                        <span className="text-emerald-900 font-black">✓</span> Auto-synced from Kundali Form
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => loadBirthDataFromKundaliForm(true)}
                                                        className="text-[16px] uppercase tracking-wider font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                                        title="Re-read localStorage from Generate Kundali Form"
                                                    >
                                                        🔄 Re-sync
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const success = loadBirthDataFromKundaliForm(true);
                                                        if (!success) {
                                                            alert("No saved Kundali form found in localStorage. Please enter your birth details manually or generate a Kundali chart first.");
                                                        }
                                                    }}
                                                    className="text-[16px] uppercase tracking-wider font-extrabold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <span>⚡ Fetch from Kundali Form</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[16px] uppercase font-extrabold text-slate-700 mb-1">
                                                    Date of Birth <span className="text-rose-900">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={birthDate}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                    className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-[16px] font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-400 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[16px] uppercase font-extrabold text-slate-900 mb-1">
                                                    Time of Birth (24h)
                                                </label>
                                                <input
                                                    type="time"
                                                    value={birthTime}
                                                    onChange={(e) => setBirthTime(e.target.value)}
                                                    className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-400 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[16px] uppercase font-extrabold text-slate-900 mb-1">
                                                    Birth City / Place
                                                </label>
                                                <input
                                                    type="text"
                                                    value={birthCity}
                                                    onChange={(e) => setBirthCity(e.target.value)}
                                                    placeholder="e.g. Bangalore, Mumbai"
                                                    className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-[16px] font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-400 outline-none placeholder-slate-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[16px] text-slate-900 italic">
                                            <span>* If exact birth time is unknown, 12:00 PM is used to derive your Janma Rasi (Moon Sign) and Nakshatra accurately.</span>
                                            {birthLat && birthLon && (
                                                <span className="not-italic font-semibold text-slate-900">
                                                    📍 Coords: {birthLat.toFixed(2)}°, {birthLon.toFixed(2)}°
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[16px] uppercase font-extrabold text-slate-900 tracking-wider">
                                        Your Divine Question
                                    </label>
                                    <span className="text-[16px] text-slate-500 font-medium">
                                        Type a question or select a preset diagnostic
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        id="divine-question-input"
                                        ref={questionInputRef}
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g., Why is my endeavor blocked? What are the karmic impediments?"
                                        className="flex-1 bg-rose-50/60 border border-rose-200 rounded-2xl p-4 text-slate-900 font-medium text-base placeholder-slate-400 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all shadow-inner"
                                    />
                                    <button
                                        onClick={() => calculatePrasna()}
                                        disabled={loading}
                                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-[16px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                <span>Synthesizing Prasna...</span>
                                            </>
                                        ) : (
                                            <span>✨ Cast Prasna & Scan Doshas</span>
                                        )}
                                    </button>
                                </div>

                                {/* Quick Diagnostic Presets */}
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="text-[16px] font-bold text-slate-900">Quick Diagnostics:</span>
                                    {QUICK_DIAGNOSTICS.filter(d => d.id !== "all").map(diag => {
                                        const isSelected = selectedDiagnostic === diag.id;
                                        return (
                                            <button
                                                key={diag.id}
                                                type="button"
                                                onClick={() => handleSelectDiagnostic(diag.id, !result)}
                                                className={`text-[16px] font-black px-3 py-1 rounded-full transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${isSelected
                                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-300'
                                                    : 'text-rose-900 bg-rose-100/70 hover:bg-rose-200 border border-rose-200'
                                                    }`}
                                                title={diag.desc}
                                            >
                                                <span>{diag.icon}</span>
                                                <span>{diag.shortLabel} Scan</span>
                                            </button>
                                        );
                                    })}
                                    {selectedDiagnostic !== "all" && (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectDiagnostic("all", false)}
                                            className="text-[16px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                                            title="View All Sections without filtering"
                                        >
                                            ✕ Reset Filter (All)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: COMPREHENSIVE DAIVAJNA RESULTS */}
                    {result && (
                        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-rose-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* DIAGNOSTIC MODE TAB BAR */}
                            <div className="mb-8 bg-gradient-to-r from-rose-50 via-white to-rose-50 p-3.5 sm:p-4 rounded-3xl border border-rose-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px] font-black uppercase tracking-widest text-rose-900 bg-rose-200/70 px-2.5 py-1 rounded-full border border-rose-300">
                                        🔍 Diagnostic View
                                    </span>
                                    <span className="text-[16px] font-bold text-slate-800">
                                        {selectedDiagnostic === 'all'
                                            ? '🌟 Comprehensive Horary Analysis (All Sections)'
                                            : `${QUICK_DIAGNOSTICS.find(d => d.id === selectedDiagnostic)?.icon} ${QUICK_DIAGNOSTICS.find(d => d.id === selectedDiagnostic)?.title}`}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                                    {QUICK_DIAGNOSTICS.map((diag) => {
                                        const isActive = selectedDiagnostic === diag.id;
                                        return (
                                            <button
                                                key={diag.id}
                                                type="button"
                                                onClick={() => handleSelectDiagnostic(diag.id, false)}
                                                className={`px-3.5 py-1.5 rounded-xl font-black text-[16px] transition-all flex items-center gap-1.5 cursor-pointer border ${isActive
                                                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-200 scale-102'
                                                    : 'bg-white hover:bg-rose-100 text-slate-900 border-rose-200'
                                                    }`}
                                            >
                                                <span>{diag.icon}</span>
                                                <span>{diag.shortLabel}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedDiagnostic !== "all" ? (
                                /* FOCUSED DIAGNOSTIC VIEW (DISPLAYS ONLY THE RELATED CONTENT OF THE TAB) */
                                (() => {
                                    const currentDiag = QUICK_DIAGNOSTICS.find(d => d.id === selectedDiagnostic) || QUICK_DIAGNOSTICS[1];
                                    const relevantDoshas = (result.doshas?.items || []).filter(d => currentDiag.doshaIds.includes(d.id));
                                    const activeAfflictions = relevantDoshas.filter(d => d.detected);
                                    const hasActiveAffliction = activeAfflictions.length > 0;

                                    return (
                                        <div className="space-y-8 animate-in fade-in duration-500">
                                            {/* 1. Focused Diagnostic Spotlight Header */}
                                            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${hasActiveAffliction
                                                ? 'bg-gradient-to-br from-rose-50 via-white to-rose-50/70 border-rose-300'
                                                : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 border-emerald-300'
                                                }`}>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-rose-100">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[16px] font-black uppercase tracking-widest text-rose-800 bg-rose-200/70 px-3 py-1 rounded-full border border-rose-300 inline-block">
                                                                {currentDiag.icon} Focused Diagnostic Result
                                                            </span>
                                                            <span className={`text-[16px] font-black uppercase px-2.5 py-0.5 rounded-full border ${hasActiveAffliction
                                                                ? 'bg-rose-100 text-rose-900 border-rose-300'
                                                                : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                                                }`}>
                                                                {hasActiveAffliction ? `⚠️ ${activeAfflictions.length} Active Affliction(s)` : '✨ Nir-dosha (Clear)'}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                                            {currentDiag.title}
                                                        </h2>
                                                        <p className="text-xs sm:text-[16px] text-slate-900 mt-1 font-medium">
                                                            {currentDiag.desc}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => calculatePrasna(currentDiag.question, currentDiag.id)}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                        >
                                                            <span>⚡</span> Re-Scan Query
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedDiagnostic("all")}
                                                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                        >
                                                            <span>🌟</span> Full Report
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Query & Verdict Callout */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                    <div className="md:col-span-2 bg-white/90 p-4 rounded-2xl border border-rose-100 shadow-2xs">
                                                        <span className="text-[16px] font-extrabold uppercase text-slate-500 block mb-1">
                                                            Evaluated Horary Query
                                                        </span>
                                                        <p className="text-[16px] font-bold text-slate-900 italic">
                                                            "{question || currentDiag.question}"
                                                        </p>
                                                        <p className="text-[16px] text-slate-900 mt-2 leading-relaxed">
                                                            {hasActiveAffliction
                                                                ? `The horary chart reveals root-cause resistance in: ${activeAfflictions.map(a => a.name).join(', ')}. Review the prescribed Kerala Pariharas below to dissolve these impediments.`
                                                                : `The horary configuration confirms that ${currentDiag.shortLabel} pathways are completely free of karmic afflictions. Progress is unencumbered.`}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/90 p-4 rounded-2xl border border-rose-100 shadow-2xs flex flex-col justify-center text-center">
                                                        <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-0.5">
                                                            Astrological Verdict
                                                        </span>
                                                        <span className="text-[16px] font-black text-slate-900 block">
                                                            {result.verdict}
                                                        </span>
                                                        <span className={`text-[16px] font-bold mt-1 ${result.score >= 2 ? 'text-emerald-700' : result.score >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                                                            Omen Score: {result.score > 0 ? `+${result.score}` : result.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Specific Dosha Cards (ONLY Relevant to this Diagnostic) */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-200">
                                                    <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                                        <span>🔍</span> {currentDiag.shortLabel} Affliction Status
                                                    </h3>
                                                    <span className="text-[16px] text-slate-900 font-bold">
                                                        Showing {relevantDoshas.length} relevant indicator{relevantDoshas.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <div className="space-y-4">
                                                    {relevantDoshas.map((dosha) => (
                                                        <div
                                                            key={dosha.id}
                                                            className={`p-5 sm:p-6 rounded-3xl border transition-all ${dosha.detected
                                                                ? dosha.severity === 'High'
                                                                    ? 'bg-rose-50/70 border-rose-300 shadow-sm'
                                                                    : 'bg-amber-50/60 border-amber-300 shadow-sm'
                                                                : 'bg-emerald-50/30 border-emerald-200'
                                                                }`}
                                                        >
                                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-rose-100">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">{dosha.icon}</span>
                                                                    <div>
                                                                        <h4 className="text-[16px] sm:text-lg font-black text-slate-900">
                                                                            {dosha.name}
                                                                        </h4>
                                                                        <span className="text-[16px] text-slate-500 font-medium">
                                                                            {dosha.signification}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[16px] font-black uppercase px-3 py-1 rounded-full border self-start sm:self-center ${dosha.detected
                                                                    ? dosha.severity === 'High'
                                                                        ? 'bg-rose-200 text-rose-950 border-rose-300'
                                                                        : 'bg-amber-200 text-amber-950 border-amber-300'
                                                                    : 'bg-emerald-100 text-emerald-950 border-emerald-200'
                                                                    }`}>
                                                                    {dosha.detected ? `⚠️ ${dosha.severity} Severity Affliction` : '✅ Unblemished (Clear)'}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                                <div className="bg-white/90 p-4 rounded-2xl border border-rose-100">
                                                                    <span className="text-[16px] font-extrabold uppercase text-slate-900 block mb-1">
                                                                        Astrological Trigger & Verification
                                                                    </span>
                                                                    <p className="text-slate-900 font-bold leading-relaxed">
                                                                        {dosha.trigger}
                                                                    </p>
                                                                </div>
                                                                <div className="bg-rose-100/50 p-4 rounded-2xl border border-rose-200">
                                                                    <span className="text-[16px] font-bold uppercase text-rose-900 block mb-1">
                                                                        🪷 Prescribed Kerala Parihara (Immediate Antidote)
                                                                    </span>
                                                                    <p className="text-rose-950 font-bold leading-relaxed">
                                                                        {dosha.remedy}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 3. Targeted Kerala Parihara Protocol for this Diagnostic */}
                                            {result.parihara && (
                                                <div className="pt-6 border-t border-rose-200">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-2 border-b border-rose-200">
                                                        <div>
                                                            <span className="text-[16px] font-bold uppercase tracking-widest text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-1">
                                                                🪔 Targeted Kerala Remedies
                                                            </span>
                                                            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                                                <span>🪷</span> Prescribed Parihara Protocol for {currentDiag.shortLabel}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                                        {/* Sacred Fire Ritual (Homam) */}
                                                        <div className="bg-amber-50/50 p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-2xs">
                                                            <span className="text-[16px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-2">
                                                                🔥 Prescribed Sacred Fire Ritual
                                                            </span>
                                                            <h4 className="text-base sm:text-[16px] font-black text-slate-900 mb-1">
                                                                {currentDiag.id === 'deva_pitru'
                                                                    ? (activeAfflictions.some(a => a.id === 'pitru_dosha') ? 'Tila Homam & Maha Ganapathi Homam' : 'Maha Ganapathi & Kuladevata Homam')
                                                                    : currentDiag.id === 'sarpa'
                                                                        ? 'Sarpa Bali & Rahu-Ketu Shanti Homam'
                                                                        : currentDiag.id === 'drishti'
                                                                            ? 'Sudarshana & Maha Ganapathi Homam'
                                                                            : 'Vastu Purusha Pooja & Premises Ganapathi Homam'}
                                                            </h4>
                                                            <p className="text-[16px] text-slate-900 leading-relaxed mb-3">
                                                                {currentDiag.id === 'deva_pitru'
                                                                    ? 'Conducted at sunrise with black sesame (Tila), 8 coconuts, Modakas, pure ghee, and sacred Samidha to appease departed souls and invite Kuladevata grace.'
                                                                    : currentDiag.id === 'sarpa'
                                                                        ? 'Traditional Kerala serpent propitiation neutralizing Rahu/Ketu Arudha afflictions and dissolving generational Naga Shapa.'
                                                                        : currentDiag.id === 'drishti'
                                                                            ? '108 Sudarshana herbs, white mustard seeds, dried red chilies, and Guggulu to dismantle envious competitor gazes.'
                                                                            : 'Conducted on the premises to align geopathic energies and sanctify the 4th house residence.'}
                                                            </p>
                                                            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-1">
                                                                <div><strong>Timing:</strong> {currentDiag.id === 'deva_pitru' ? 'Sunrise on Amavasya or Saturday' : currentDiag.id === 'sarpa' ? 'Ayilyam (Ashlesha) Nakshatra or Tuesday' : currentDiag.id === 'drishti' ? 'Tuesday or Friday evening twilight (Pradosha)' : 'Thursday or Friday morning during Shukla Paksha'}</div>
                                                                <div><strong>Target Force:</strong> {currentDiag.id === 'deva_pitru' ? 'Pitrus, Kuladevata, Mandi & Lord Ganesha' : currentDiag.id === 'sarpa' ? 'Nagaraja, Nagayakshi, Rahu & Ketu' : currentDiag.id === 'drishti' ? 'Sudarshana Chakra, Lord Narasimha & Malefic Gaze' : 'Vastu Purusha, Bhoomi Devi & Ganapathi'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Dedicated Sacred Offerings & Shrines */}
                                                        <div className="bg-rose-50/50 p-5 sm:p-6 rounded-3xl border border-rose-200 shadow-2xs">
                                                            <span className="text-[16px] font-black uppercase tracking-wider text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-2">
                                                                🛕 Dedicated Sacred Offerings & Shrines
                                                            </span>
                                                            <h4 className="text-base sm:text-[16px] font-black text-slate-900 mb-1">
                                                                {currentDiag.id === 'deva_pitru'
                                                                    ? 'Kuladevata Pooja & Nilavilakku Akhanda Deepam'
                                                                    : currentDiag.id === 'sarpa'
                                                                        ? 'Noorum Palum Offering at Sarpa Kavu'
                                                                        : currentDiag.id === 'drishti'
                                                                            ? 'Sudarshana Raksha Kavacha & Twilight Deepam'
                                                                            : 'Consecrated Copper Vastu Yantra Installation'}
                                                            </h4>
                                                            <p className="text-[16px] text-slate-900 leading-relaxed mb-3">
                                                                {currentDiag.id === 'deva_pitru'
                                                                    ? 'Light a brass Nilavilakku ghee lamp facing East at twilight daily. Offer raw rice, jaggery, and flowers at your family Kuladevata temple.'
                                                                    : currentDiag.id === 'sarpa'
                                                                        ? 'Offer Noorum Palum (sacred raw rice flour, fresh milk, and turmeric powder) at an authentic Sarpa Kavu or consecrated serpent temple.'
                                                                        : currentDiag.id === 'drishti'
                                                                            ? 'Wear a consecrated Sudarshana Raksha thread and recite Sudarshana Ashtakam or Narasimha Kavacha at sunset.'
                                                                            : 'Install a consecrated copper Vastu Purusha Yantra at the Brahmasthana (central space) or North-East corner of the premises.'}
                                                            </p>
                                                            <div className="bg-white/80 p-3 rounded-xl border border-rose-200 text-[16px] text-slate-800 space-y-1">
                                                                <div><strong>Sacred Shrines:</strong> {currentDiag.id === 'deva_pitru' ? 'Rameshwaram, Thirunavaya, or Family Kuladevata Temple' : currentDiag.id === 'sarpa' ? 'Mannarasala, Vettikkode, or Kukke Subramanya' : currentDiag.id === 'drishti' ? 'Sudarshana Temple, Ahobilam, or Lord Narasimha Shrine' : 'Local Ganapathi & Shiva/Durga Kshetram'}</div>
                                                                <div className="font-mono text-[16px] text-rose-900"><strong>Mantra:</strong> {currentDiag.id === 'deva_pitru' ? 'Om Pitrabhyah Devatabhyah Mahayogibhyech Cha Namah Swaha' : currentDiag.id === 'sarpa' ? 'Om Namostu Sarpebhyo Ye Ke Cha Prithiveemanu Ye Antarikshe Ye Divi Tebhyah' : currentDiag.id === 'drishti' ? 'Om Namo Bhagavate Maha Sudarshanaya Dheemahi' : 'Om Namo Bhagavate Vastu Purushaya Swaha'}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actionable Checklist */}
                                                    <div className="bg-white p-5 rounded-2xl border border-rose-200">
                                                        <h4 className="text-[16px] font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                                            <span>📋</span> Step-by-Step Action Plan for {currentDiag.shortLabel}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[16px]">
                                                            {(currentDiag.id === 'deva_pitru' ? [
                                                                "Light a Nilavilakku ghee lamp facing East every evening with prayer to Kuladevata.",
                                                                "Perform Pinda Daanam / Tarpanam on next Amavasya (New Moon) at sacred water.",
                                                                "Donate black sesame (Tila) and jaggery to cows or elders on Saturday morning.",
                                                                "Settle any unresolved vows (Vazhipadu) made in family memory."
                                                            ] : currentDiag.id === 'sarpa' ? [
                                                                "Visit a consecrated Naga shrine or Sarpa Kavu on Ashlesha Nakshatra.",
                                                                "Offer Noorum Palum (milk, rice powder, turmeric) to appease serpent energies.",
                                                                "Donate black gram (Urad dal) and bronze vessel to needy recipients.",
                                                                "Protect environment and avoid disturbing natural habitats or ancient trees."
                                                            ] : currentDiag.id === 'drishti' ? [
                                                                "Recite Sudarshana Ashtakam or Narasimha Kavacha daily at twilight.",
                                                                "Cleanse premises by burning white mustard, dry chili, and Guggulu dhoop.",
                                                                "Maintain strict confidentiality regarding personal and business progress.",
                                                                "Donate red lentils (Masoor dal) or copper coins on Tuesday."
                                                            ] : [
                                                                "Perform Ganapathi Homam on the home or business premises.",
                                                                "Install a consecrated copper Vastu Purusha Yantra at North-East or center.",
                                                                "Sprinkle holy water with turmeric throughout all corners of the building.",
                                                                "Keep the North-East light and uncluttered; place heavier objects in South-West."
                                                            ]).map((step, idx) => (
                                                                <div key={idx} className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 flex items-start gap-2.5">
                                                                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[16px] flex items-center justify-center shrink-0 mt-0.5">
                                                                        {idx + 1}
                                                                    </span>
                                                                    <span className="text-slate-900 font-semibold leading-snug">
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 4. Related Sphutas & Astrological Correlations */}
                                            {result.sphutas && (
                                                <div className="pt-6 border-t border-rose-200">
                                                    <h3 className="text-[16px] font-black uppercase text-slate-900 tracking-wider mb-3 flex items-center gap-2">
                                                        <span>🔮</span> Related Prasna Sphutas & Astrological Factors
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {currentDiag.id === 'deva_pitru' ? (
                                                            <>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-[16px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                                                                            Father & Lineage Indicator
                                                                        </span>
                                                                        <span className="text-[16px] text-slate-900 font-mono">
                                                                            {result.sphutas?.chatusphuta?.formula}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-[16px] font-bold text-slate-900 mt-1">
                                                                        Chatusphuta: {result.sphutas?.chatusphuta?.deg_str}
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        {result.sphutas?.chatusphuta?.nakshatra} (Pada {result.sphutas?.chatusphuta?.pada}) • {result.sphutas?.chatusphuta?.house_from_arudha}th from Arudha. Governs state honor and lineage vitality.
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-[16px] font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                                                                            Ancestral Debt (Rina Anubandha)
                                                                        </span>
                                                                        <span className="text-[16px] text-slate-900 font-mono">
                                                                            {result.sphutas?.panchasphuta?.formula}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-[16px] font-black text-slate-900 mt-1">
                                                                        Panchasphuta: {result.sphutas?.panchasphuta?.deg_str}
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        {result.sphutas?.panchasphuta?.nakshatra} (Pada {result.sphutas?.panchasphuta?.pada}) • {result.sphutas?.panchasphuta?.house_from_arudha}th from Arudha. Detects unfulfilled ancestral rites and karmic ties.
                                                                    </p>
                                                                </div>
                                                            </>
                                                        ) : currentDiag.id === 'sarpa' ? (
                                                            <>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-[16px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                                                                            Rahu Composite Indicator
                                                                        </span>
                                                                        <span className="text-[16px] text-slate-900 font-mono">
                                                                            {result.sphutas?.panchasphuta?.formula}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-[16px] font-black text-slate-900 mt-1">
                                                                        Panchasphuta: {result.sphutas?.panchasphuta?.deg_str}
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        {result.sphutas?.panchasphuta?.nakshatra} (Pada {result.sphutas?.panchasphuta?.pada}) • {result.sphutas?.panchasphuta?.house_from_arudha}th from Arudha. Detects serpent curses (Naga Shapa) and karmic locks.
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <span className="text-[16px] font-bold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md block mb-1">
                                                                        Nodal Arudha Axis
                                                                    </span>
                                                                    <h4 className="text-[16px] font-black text-slate-900">
                                                                        Rahu in {result.chart_planets?.Rahu?.sign || 'Sensitive Position'}
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        Examines whether the serpent nodes afflict the 4th, 8th, or Arudha Lagna axis.
                                                                    </p>
                                                                </div>
                                                            </>
                                                        ) : currentDiag.id === 'drishti' ? (
                                                            <>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <span className="text-[16px] font-black uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md block mb-1">
                                                                        6th & 7th House Malefic Gaze
                                                                    </span>
                                                                    <h4 className="text-[16px] font-bold text-slate-900">
                                                                        Adversary & Competitor Houses
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        Mars and Saturn aspect rays cast upon the 6th house (enemies) and 7th house (public competitors) trigger acute Drishti Badha.
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <span className="text-[16px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md block mb-1">
                                                                        Badhaka Sthana Influence
                                                                    </span>
                                                                    <h4 className="text-[16px] font-black text-slate-900">
                                                                        Unseen Obstruction Point
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        Evaluates the Badhaka planet's relationship to Arudha to prevent competitor sabotage.
                                                                    </p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <span className="text-[16px] font-black uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md block mb-1">
                                                                        4th House Residence Status
                                                                    </span>
                                                                    <h4 className="text-[16px] font-black text-slate-900">
                                                                        Dwelling & Hearth (Sukha Sthana)
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        4th house from Arudha governs dwelling tranquility. Clean condition ensures steady family prosperity.
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
                                                                    <span className="text-[16px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md block mb-1">
                                                                        Bhoomi-Karaka (Mars) & Gulika
                                                                    </span>
                                                                    <h4 className="text-[16px] font-bold text-slate-900">
                                                                        Land Energy & Upagraha
                                                                    </h4>
                                                                    <p className="text-[16px] text-slate-900 mt-1">
                                                                        Gulika in {result.gulika_sign} | Mandi in {result.mandi_sign}. When connected to 4th house, it triggers Shalya Dosha (disturbed land matter).
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 5. Quick Link to Full Report */}
                                            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div>
                                                    <span className="text-[16px] font-black uppercase text-rose-900 block">
                                                        Need Comprehensive Kerala Prasna Details?
                                                    </span>
                                                    <p className="text-[16px] text-slate-900">
                                                        Switch to Full Report to view exact timing (Phala Kala Nirnaya), 108 cowries trajectory, wheel chakra, and full consultation synthesis.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDiagnostic("all")}
                                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[16px] font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-xs"
                                                >
                                                    🌟 View Full Prasna Report
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                /* COMPREHENSIVE FULL REPORT (ALL SECTIONS) */
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    {/* Verdict Header Banner */}
                                    <div className="bg-rose-50 p-6 sm:p-8 rounded-3xl border border-rose-200 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <span className="text-[16px] font-black uppercase tracking-widest text-rose-800 bg-rose-200/70 px-3 py-1 rounded-full border border-rose-300 inline-block mb-2">
                                                ⚖️ Astrological Verdict
                                            </span>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                                {result.verdict || "Prasna Analysis Complete"}
                                            </h2>
                                            <p className="text-[16px] text-slate-900 mt-1 font-medium">
                                                {result.verdict_desc || "Evaluation based on Ashtamangala omens and planetary geometry."}
                                            </p>
                                        </div>
                                        <div className="bg-white px-5 py-3 rounded-2xl border border-rose-200 text-center min-w-[130px] shadow-2xs">
                                            <span className="text-[16px] font-extrabold uppercase tracking-wider text-slate-900 block">Omen Score</span>
                                            <span className={`text-2xl font-black ${result.score >= 2 ? 'text-emerald-700' : result.score >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                                                {result.score > 0 ? `+${result.score}` : result.score}
                                            </span>
                                        </div>
                                    </div>

                                    {/* SECTION: PHALA KALA NIRNAYA (EXACT TIMING OF FULFILLMENT) */}
                                    {result.phala_kala && (
                                        <div className="mb-8 bg-gradient-to-br from-white via-rose-50/50 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm relative overflow-hidden">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-rose-100">
                                                <div>
                                                    <span className="text-[16px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-1.5">
                                                        ⏳ Classical Prasna Marga Timing • Phala Kala Nirnaya
                                                    </span>
                                                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                        <span>⏳</span> Phala Kala Nirnaya (Exact Timing of Fulfillment)
                                                    </h3>
                                                </div>
                                                <span className={`text-[16px] font-black uppercase px-3 py-1 rounded-full border shadow-2xs self-start sm:self-center ${result.phala_kala.arudha_code === 'Chara'
                                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                                    : result.phala_kala.arudha_code === 'Dvisvabhava'
                                                        ? 'bg-amber-100 text-amber-950 border-amber-300'
                                                        : 'bg-rose-100 text-rose-950 border-rose-300'
                                                    }`}>
                                                    {result.phala_kala.timeframe_badge}
                                                </span>
                                            </div>

                                            {/* Main Timeframe Spotlight */}
                                            <div className="bg-rose-50/80 p-5 sm:p-6 rounded-2xl border border-rose-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-wider text-rose-800 block mb-1">
                                                        Predicted Realization Timeframe
                                                    </span>
                                                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                                                        Expected Fruit: {result.phala_kala.expected_fruit}
                                                    </div>
                                                    <div className="text-[16px] sm:text-sm font-bold text-slate-600 mt-1 flex items-center gap-2">
                                                        <span>🗓️ Concrete Window:</span>
                                                        <span className="text-rose-900 font-extrabold">{result.phala_kala.calendar_window}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white px-4 py-3 rounded-xl border border-rose-200 text-center min-w-[150px] shadow-2xs">
                                                    <span className="text-[16px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                                        Manifestation Velocity
                                                    </span>
                                                    <span className="text-[16px] font-black text-slate-900 block mt-0.5">
                                                        {result.phala_kala.speed_category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 4 Timing Metrics Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                {/* Metric 1: Arudha Mobility */}
                                                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                        1. Arudha Mobility (Gati)
                                                    </span>
                                                    <div className="text-base font-black text-slate-900">
                                                        {result.phala_kala.arudha_mobility}
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                                                        {result.phala_kala.mobility_desc}
                                                    </p>
                                                </div>

                                                {/* Metric 2: Degrees to Favorable Cusp */}
                                                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                        2. Degrees to Cusp
                                                    </span>
                                                    <div className="text-base font-black text-slate-900 flex items-baseline gap-1">
                                                        <span>{result.phala_kala.degrees_remaining}°</span>
                                                        <span className="text-xs font-normal text-slate-500">remaining</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                                                        Moon needs <strong>{result.phala_kala.degrees_remaining}°</strong> to reach the <strong>{result.phala_kala.target_house}</strong>.
                                                    </p>
                                                </div>

                                                {/* Metric 3: Significators Distance */}
                                                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                        3. Planetary Significators
                                                    </span>
                                                    <div className="text-xs font-bold text-slate-800 space-y-1 mt-1">
                                                        <div className="flex justify-between">
                                                            <span>🌙 Moon Exit:</span>
                                                            <span className="font-black text-slate-900">{result.phala_kala.moon_degrees_remaining}°</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>👑 Lord ({result.phala_kala.lagna_lord}):</span>
                                                            <span className="font-black text-slate-900">{result.phala_kala.lord_degrees_remaining}°</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Metric 4: Lunar Phase (Paksha) */}
                                                <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                        4. Lunar Phase (Paksha)
                                                    </span>
                                                    <div className="text-xs font-black text-slate-900">
                                                        {result.phala_kala.paksha}
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                                                        {result.phala_kala.is_shukla
                                                            ? 'Waxing illumination favors accelerated fruition.'
                                                            : 'Waning light advises internal preparation prior to launch.'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Daivajna Timing Reasoning */}
                                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-xs sm:text-sm text-slate-800 font-serif italic leading-relaxed">
                                                "{result.phala_kala.reasoning}"
                                            </div>
                                        </div>
                                    )}

                                    {/* 108 Kavadi Omen Trajectory (If available in result) */}
                                    {result.kavadi && (
                                        <div className="mb-8">
                                            <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider mb-4 flex items-center gap-2">
                                                <span>🐚</span> 108 Cowries Trajectory Analysis
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200">
                                                    <span className="text-[10px] font-black uppercase text-amber-800 block mb-1">
                                                        {result.kavadi.past.name}
                                                    </span>
                                                    <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                                                        <span>{result.kavadi.past.icon}</span>
                                                        <span>{result.kavadi.past.symbol}</span>
                                                    </div>
                                                    <span className="text-xs text-rose-800 font-bold block mb-1">
                                                        {result.kavadi.past.planet} • {result.kavadi.past.count} shells
                                                    </span>
                                                    <p className="text-xs text-slate-700">{result.kavadi.past.meaning}</p>
                                                </div>

                                                <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200">
                                                    <span className="text-[10px] font-black uppercase text-rose-800 block mb-1">
                                                        {result.kavadi.present.name}
                                                    </span>
                                                    <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                                                        <span>{result.kavadi.present.icon}</span>
                                                        <span>{result.kavadi.present.symbol}</span>
                                                    </div>
                                                    <span className="text-xs text-rose-800 font-bold block mb-1">
                                                        {result.kavadi.present.planet} • {result.kavadi.present.count} shells
                                                    </span>
                                                    <p className="text-xs text-slate-700">{result.kavadi.present.meaning}</p>
                                                </div>

                                                <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200">
                                                    <span className="text-[10px] font-black uppercase text-emerald-800 block mb-1">
                                                        {result.kavadi.future.name}
                                                    </span>
                                                    <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                                                        <span>{result.kavadi.future.icon}</span>
                                                        <span>{result.kavadi.future.symbol}</span>
                                                    </div>
                                                    <span className="text-xs text-rose-800 font-bold block mb-1">
                                                        {result.kavadi.future.planet} • {result.kavadi.future.count} shells
                                                    </span>
                                                    <p className="text-xs text-slate-700">{result.kavadi.future.meaning}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SECTION: TAMBULA & NIMITTA OMEN MATRIX */}
                                    {(result.tambula || result.nimitta) && (
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-200">
                                                <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider flex items-center gap-2">
                                                    <span>🍃</span> Tambula (Betel Leaves) & <span>🕊️</span> Nimitta Omen Matrix
                                                </h3>
                                                {result.nimitta && (
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${result.nimitta.score_contribution > 0
                                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                                        : result.nimitta.score_contribution < 0
                                                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                                                            : 'bg-slate-100 text-slate-700 border-slate-300'
                                                        }`}>
                                                        Nimitta Delta: {result.nimitta.score_contribution > 0 ? `+${result.nimitta.score_contribution}` : result.nimitta.score_contribution}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Tambula Card */}
                                                {result.tambula && (
                                                    <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                                                                🍃 Tambula Pariksha
                                                            </span>
                                                            <span className="text-xs font-mono font-bold text-slate-500">
                                                                {result.tambula.formula}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-baseline justify-between mb-2">
                                                            <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                                                                <span>{result.tambula.icon}</span>
                                                                <span>{result.tambula.planet}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-rose-800">
                                                                {result.tambula.count} Leaves ({result.tambula.parity})
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1.5 text-xs text-slate-700">
                                                            <div className="flex items-center justify-between bg-white/70 px-3 py-1.5 rounded-lg border border-rose-100">
                                                                <span className="font-bold text-slate-600">Presiding Element:</span>
                                                                <span className="font-black text-slate-900">{result.tambula.element}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between bg-white/70 px-3 py-1.5 rounded-lg border border-rose-100">
                                                                <span className="font-bold text-slate-600">House from Arudha:</span>
                                                                <span className="font-black text-slate-900">{result.tambula.house_from_arudha}th Bhava</span>
                                                            </div>
                                                            <p className="mt-2 text-slate-800 text-xs font-medium leading-relaxed bg-white/50 p-2 rounded-lg border border-rose-100">
                                                                {result.tambula.environment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Nimitta Card */}
                                                {result.nimitta && (
                                                    <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                                                                    🕊️ Ambient Nimitta Omens
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-500">
                                                                    Moment of Query
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-0.5">Facing Direction</span>
                                                                    <div className="text-xs font-black text-slate-900">
                                                                        {result.nimitta.direction.name} ({result.nimitta.direction.score > 0 ? `+${result.nimitta.direction.score}` : result.nimitta.direction.score})
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-600">{result.nimitta.direction.signification}</span>
                                                                </div>

                                                                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                                                                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-0.5">Querent Posture</span>
                                                                    <div className="text-xs font-black text-slate-900">
                                                                        {result.nimitta.mood.name} ({result.nimitta.mood.score > 0 ? `+${result.nimitta.mood.score}` : result.nimitta.mood.score})
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-600">{result.nimitta.mood.signification}</span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Observed Acoustic Omens:</span>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {result.nimitta.sounds.map((snd, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${snd.score > 0
                                                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                                : snd.score < 0
                                                                                    ? 'bg-rose-100/60 text-rose-900 border-rose-200'
                                                                                    : 'bg-white text-slate-700 border-rose-100'
                                                                                }`}
                                                                        >
                                                                            <span>{snd.name}</span>
                                                                            <span className="text-[9px] opacity-75">({snd.score > 0 ? `+${snd.score}` : snd.score})</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 pt-2 border-t border-rose-100 text-[11px] text-slate-600 font-medium">
                                                            ☸️ Nimitta Influence: {result.nimitta.direction.indication}. {result.nimitta.mood.indication}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* SECTION: INTERACTIVE VISUAL PRASNA CHAKRA (SOUTH & NORTH INDIAN STYLES) */}
                                    <div className="mb-8">
                                        <PrasnaChakra result={result} />
                                    </div>

                                    {/* Key Astrological Reference Points */}
                                    <div className="mb-8">
                                        <h3 className="text-xs uppercase font-black text-slate-900 tracking-wider mb-4 pb-2 border-b border-rose-200 flex items-center gap-2">
                                            <span>🧭</span> Key Astrological Reference Points
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-center sm:text-left">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Arudha Lagna</span>
                                                <span className="text-xl font-black text-slate-900">{result.arudha_sign}</span>
                                            </div>
                                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-center sm:text-left">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Udaya Lagna (Asc)</span>
                                                <span className="text-xl font-black text-slate-900">{result.udaya_sign}</span>
                                            </div>
                                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-center sm:text-left">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Chhatra (Umbrella)</span>
                                                <span className="text-xl font-black text-slate-900">{result.chhatra_sign}</span>
                                            </div>
                                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-center sm:text-left">
                                                <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Sun Sign</span>
                                                <span className="text-xl font-black text-slate-900">{result.sun_sign}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: HIGH-PRECISION SPECIAL SPHUTAS (PRASNA MARGA SECRETS) */}
                                    {result.sphutas && (
                                        <div className="mb-8 pt-6 border-t border-rose-100">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-2 border-b border-rose-200">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-1">
                                                        ⚡ Prasna Marga Secrets
                                                    </span>
                                                    <h3 className="text-sm sm:text-base uppercase font-black text-slate-900 tracking-wider flex items-center gap-2">
                                                        <span>🔯</span> High-Precision Special Sphutas
                                                    </h3>
                                                </div>
                                                <span className="text-xs text-slate-600 font-medium">
                                                    Sensitive Astronomical Sensitive Degrees
                                                </span>
                                            </div>

                                            {/* Prana vs Mrityu Balance Banner */}
                                            <div className={`p-5 rounded-2xl border mb-6 ${result.sphutas.prana_mrityu_balance.status === 'Auspicious'
                                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                                : result.sphutas.prana_mrityu_balance.status === 'Challenging'
                                                    ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                                                    : 'bg-amber-50/60 border-amber-200 text-amber-950'
                                                }`}>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-current">
                                                        ⚖️ {result.sphutas.prana_mrityu_balance.verdict}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        Classical Kerala Horary Rule
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                                                    {result.sphutas.prana_mrityu_balance.description}
                                                </p>
                                            </div>

                                            {/* The Vital Triad: Prana, Deha, Mrityu Sphutas */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                {/* Prana Sphuta */}
                                                <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-200">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                                                            Life Breath
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {result.sphutas.prana.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900">
                                                        {result.sphutas.prana.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-emerald-800 my-1">
                                                        {result.sphutas.prana.deg_str}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-700">
                                                        {result.sphutas.prana.nakshatra} (Pada {result.sphutas.prana.pada})
                                                    </div>
                                                    <div className="text-[11px] text-slate-600 mt-1">
                                                        House from Arudha: <span className="font-bold text-slate-900">{result.sphutas.prana.house_from_arudha}th</span>
                                                    </div>
                                                </div>

                                                {/* Deha Sphuta */}
                                                <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-200">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-extrabold uppercase text-amber-800">
                                                            Physical Manifestation
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {result.sphutas.deha.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900">
                                                        {result.sphutas.deha.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-amber-800 my-1">
                                                        {result.sphutas.deha.deg_str}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-700">
                                                        {result.sphutas.deha.nakshatra} (Pada {result.sphutas.deha.pada})
                                                    </div>
                                                    <div className="text-[11px] text-slate-600 mt-1">
                                                        House from Arudha: <span className="font-bold text-slate-900">{result.sphutas.deha.house_from_arudha}th</span>
                                                    </div>
                                                </div>

                                                {/* Mrityu Sphuta */}
                                                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-extrabold uppercase text-rose-800">
                                                            Point of Obstruction
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {result.sphutas.mrityu.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900">
                                                        {result.sphutas.mrityu.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-rose-800 my-1">
                                                        {result.sphutas.mrityu.deg_str}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-700">
                                                        {result.sphutas.mrityu.nakshatra} (Pada {result.sphutas.mrityu.pada})
                                                    </div>
                                                    <div className="text-[11px] text-slate-600 mt-1">
                                                        House from Arudha: <span className="font-bold text-slate-900">{result.sphutas.mrityu.house_from_arudha}th</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Composite Sphutas: Trisphuta, Chatusphuta, Panchasphuta */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Trisphuta Card */}
                                                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                                                            Core Indicator
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {result.sphutas.trisphuta.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900 mt-1">
                                                        {result.sphutas.trisphuta.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-slate-900 my-1">
                                                        {result.sphutas.trisphuta.deg_str}
                                                    </div>
                                                    <div className="text-xs text-slate-700 font-semibold mb-2">
                                                        {result.sphutas.trisphuta.nakshatra} • Pada {result.sphutas.trisphuta.pada} • {result.sphutas.trisphuta.house_from_arudha}th from Arudha
                                                    </div>

                                                    {/* Trisphuta Alerts */}
                                                    {result.sphutas.trisphuta.alerts && result.sphutas.trisphuta.alerts.length > 0 ? (
                                                        <div className="space-y-1 mt-2">
                                                            {result.sphutas.trisphuta.alerts.map((alert, idx) => (
                                                                <div key={idx} className="text-[11px] font-bold text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                                                                    {alert}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-2">
                                                            ✨ Trisphuta is serene and free of Gandanta or Visha Ghati afflictions.
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Chatusphuta Card */}
                                                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                                                            Sun Composite
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {result.sphutas.chatusphuta.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900 mt-1">
                                                        {result.sphutas.chatusphuta.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-slate-900 my-1">
                                                        {result.sphutas.chatusphuta.deg_str}
                                                    </div>
                                                    <div className="text-xs text-slate-700 font-semibold mb-2">
                                                        {result.sphutas.chatusphuta.nakshatra} • Pada {result.sphutas.chatusphuta.pada} • {result.sphutas.chatusphuta.house_from_arudha}th from Arudha
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mt-2 bg-rose-50/40 p-2.5 rounded-xl border border-rose-100 leading-snug">
                                                        Governs state/governmental interactions, father/lineage status, and vitality of the initiative.
                                                    </p>
                                                </div>

                                                {/* Panchasphuta Card */}
                                                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                                                            Rahu Composite
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {result.sphutas.panchasphuta.formula}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-black text-slate-900 mt-1">
                                                        {result.sphutas.panchasphuta.name}
                                                    </h4>
                                                    <div className="text-lg font-black text-slate-900 my-1">
                                                        {result.sphutas.panchasphuta.deg_str}
                                                    </div>
                                                    <div className="text-xs text-slate-700 font-semibold mb-2">
                                                        {result.sphutas.panchasphuta.nakshatra} • Pada {result.sphutas.panchasphuta.pada} • {result.sphutas.panchasphuta.house_from_arudha}th from Arudha
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 mt-2 bg-rose-50/40 p-2.5 rounded-xl border border-rose-100 leading-snug">
                                                        Detects ancestral karmic debts (Rina Anubandha), serpent curses, and unseen spiritual influences.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SECTION: ROOT-CAUSE DOSHA DIAGNOSTICS (DEVA PRASNA INSIGHTS) */}
                                    {result.doshas && (
                                        <div className="mb-8 pt-6 border-t border-rose-100">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-2 border-b border-rose-200">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mb-1">
                                                        🛕 Deva Prasna Insights
                                                    </span>
                                                    <h3 className="text-sm sm:text-base uppercase font-black text-slate-900 tracking-wider flex items-center gap-2">
                                                        <span>🔍</span> Root-Cause Dosha Diagnostics
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${result.doshas.active_count === 0
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                        : 'bg-rose-100 text-rose-900 border-rose-300'
                                                        }`}>
                                                        {result.doshas.active_count === 0 ? '✨ Nir-dosha (Clear)' : `⚠️ ${result.doshas.active_count} Active Blockage(s)`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Overall Karmic Diagnostic Banner */}
                                            <div className={`p-5 rounded-2xl border mb-6 ${result.doshas.active_count === 0
                                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                                : 'bg-rose-50/70 border-rose-300 text-rose-950'
                                                }`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-base">
                                                        {result.doshas.active_count === 0 ? '🕊️' : '⚠️'}
                                                    </span>
                                                    <h4 className="text-sm font-black uppercase tracking-wide">
                                                        {result.doshas.active_count === 0
                                                            ? 'Nir-dosha (निर्दोष) — Unimpeded Karmic Pathway'
                                                            : `${result.doshas.active_count} Root-Cause Affliction(s) Detected`}
                                                    </h4>
                                                </div>
                                                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                                                    {result.doshas.active_count === 0
                                                        ? 'The query is free from Deva, Pitru, Sarpa, Drishti, and Vastu afflictions. External setbacks are purely temporal and will resolve with methodical effort.'
                                                        : 'In Kerala Deva Prasna tradition, uncovering why progress is obstructed is paramount. The chart reveals the following karmic friction points with prescribed remedial actions (Parihara):'}
                                                </p>
                                            </div>

                                            {/* 5 Doshas Diagnostic Cards */}
                                            <div className="space-y-4">
                                                {result.doshas.items.map((dosha) => (
                                                    <div
                                                        key={dosha.id}
                                                        className={`p-5 rounded-2xl border transition-all ${dosha.detected
                                                            ? dosha.severity === 'High'
                                                                ? 'bg-rose-50/60 border-rose-300 shadow-2xs'
                                                                : 'bg-amber-50/50 border-amber-200 shadow-2xs'
                                                            : 'bg-white border-rose-100 opacity-80'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 pb-2 border-b border-rose-100">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-xl">{dosha.icon}</span>
                                                                <div>
                                                                    <h5 className="text-sm sm:text-base font-black text-slate-900">
                                                                        {dosha.name}
                                                                    </h5>
                                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                                        {dosha.signification}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border self-start sm:self-center ${dosha.detected
                                                                ? dosha.severity === 'High'
                                                                    ? 'bg-rose-200 text-rose-900 border-rose-300'
                                                                    : 'bg-amber-200 text-amber-900 border-amber-300'
                                                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                                }`}>
                                                                {dosha.detected ? `⚠️ ${dosha.severity} Severity` : '✅ Clear'}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                                                            <div className="bg-white/80 p-3 rounded-xl border border-rose-100">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                                    Astrological Trigger
                                                                </span>
                                                                <p className="text-slate-800 font-semibold leading-snug">
                                                                    {dosha.trigger}
                                                                </p>
                                                            </div>
                                                            <div className="bg-rose-100/40 p-3 rounded-xl border border-rose-200">
                                                                <span className="text-[10px] font-extrabold uppercase text-rose-800 block mb-1">
                                                                    🪷 Prescribed Kerala Parihara (Remedy)
                                                                </span>
                                                                <p className="text-rose-950 font-bold leading-snug">
                                                                    {dosha.remedy}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SECTION: AUTHENTIC KERALA PARIHARA (PRESCRIBED REMEDIES) */}
                                    {result.parihara && (
                                        <div className="mb-8 pt-6 border-t border-rose-100">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-rose-200">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-1.5">
                                                        🪷 Prasna Marga Parihara • Kerala Shanti Protocol
                                                    </span>
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                        <span>🪔</span> Authentic Kerala Parihara (Prescribed Remedies)
                                                    </h3>
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        Prescribed remedial actions tailored to the query's root causes, afflicted planets, and Mandi/Gulika placements.
                                                    </p>
                                                </div>
                                                <span className="text-[11px] font-black uppercase text-rose-900 bg-rose-100/80 px-3 py-1 rounded-full border border-rose-300 shadow-2xs self-start sm:self-center">
                                                    Focus: {result.parihara.query_theme}
                                                </span>
                                            </div>

                                            {/* 4 Pillars of Kerala Parihara */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                {/* 1. Ganapathi Homam / Tila Homam */}
                                                <div className="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                                                                🔥 Sacred Fire Ritual (Homam / Yajna)
                                                            </span>
                                                            <span className="text-xs font-bold text-amber-800">
                                                                {result.parihara.homam.timing}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-black text-slate-900 mb-1">
                                                            {result.parihara.homam.title}
                                                        </h4>
                                                        <span className="text-xs font-bold text-rose-800 block mb-3">
                                                            {result.parihara.homam.subtitle}
                                                        </span>
                                                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                                            {result.parihara.homam.purpose}
                                                        </p>
                                                        <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 space-y-1.5 text-xs text-slate-700 mb-3">
                                                            <div>
                                                                <strong className="text-slate-900">Dravya (Offerings):</strong> {result.parihara.homam.dravya}
                                                            </div>
                                                            <div>
                                                                <strong className="text-slate-900">Targets:</strong> {result.parihara.homam.target}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 text-[11px] font-mono text-amber-950 font-bold">
                                                        Mantra: {result.parihara.homam.mantra}
                                                    </div>
                                                </div>

                                                {/* 2. Deepa Samarpanam (Ghee Lamp) */}
                                                <div className="bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30 p-6 rounded-3xl border border-rose-200 shadow-sm flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                                                                🪔 Deepa Samarpanam (Twilight Lamp)
                                                            </span>
                                                            <span className="text-xs font-bold text-rose-800">
                                                                At Sunset (Sandhya)
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-black text-slate-900 mb-1">
                                                            Nilavilakku Ghee Lamp Offering
                                                        </h4>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-xs font-extrabold text-slate-600">Prescribed Direction:</span>
                                                            <span className="text-xs font-black text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                                                                {result.parihara.deepam.direction}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                                            {result.parihara.deepam.direction_reason}
                                                        </p>
                                                        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100 space-y-1.5 text-xs text-slate-700 mb-3">
                                                            <div>
                                                                <strong className="text-slate-900">Lamp Vessel:</strong> {result.parihara.deepam.lamp_type}
                                                            </div>
                                                            <div>
                                                                <strong className="text-slate-900">Timing & Duration:</strong> {result.parihara.deepam.timing} ({result.parihara.deepam.duration})
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-rose-100/50 p-2.5 rounded-xl border border-rose-200 text-[11px] font-mono text-rose-950 font-bold">
                                                        Sloka: "{result.parihara.deepam.sloka}"
                                                    </div>
                                                </div>

                                                {/* 3. Charity / Daanam (Specific offerings for afflicted planet) */}
                                                <div className="bg-gradient-to-br from-blue-50/40 via-white to-blue-50/20 p-6 rounded-3xl border border-blue-200 shadow-sm flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                                                                🤲 Charity & Sacred Daanam
                                                            </span>
                                                            <span className="text-xs font-bold text-blue-800">
                                                                {result.parihara.daanam.planet}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-black text-slate-900 mb-1">
                                                            {result.parihara.daanam.title}
                                                        </h4>
                                                        <span className="text-xs font-medium text-slate-500 block mb-3">
                                                            Reason: {result.parihara.daanam.trigger_reason}
                                                        </span>
                                                        <div className="bg-white/80 p-3.5 rounded-2xl border border-blue-100 space-y-2 text-xs text-slate-700 mb-3">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="font-bold text-slate-600 min-w-[100px]">Grain Offering:</span>
                                                                <span className="font-black text-slate-900 text-right">{result.parihara.daanam.grain}</span>
                                                            </div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="font-bold text-slate-600 min-w-[100px]">Cloth & Dravya:</span>
                                                                <span className="font-semibold text-slate-800 text-right">{result.parihara.daanam.cloth}, {result.parihara.daanam.dravya}</span>
                                                            </div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="font-bold text-slate-600 min-w-[100px]">Recipient & Time:</span>
                                                                <span className="font-bold text-blue-900 text-right">{result.parihara.daanam.recipient} ({result.parihara.daanam.timing})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-100/50 p-2.5 rounded-xl border border-blue-200 text-[11px] text-blue-950 font-semibold">
                                                        Karmic Effect: {result.parihara.daanam.significance}
                                                    </div>
                                                </div>

                                                {/* 4. Deity Propitiation (Prasna Karyesh & Query Theme Adhidevata) */}
                                                <div className="bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-6 rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                                🛕 Primary Deity Propitiation
                                                            </span>
                                                            <span className="text-xs font-bold text-emerald-800">
                                                                {result.parihara.deity.query_context}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-black text-slate-900 mb-1">
                                                            {result.parihara.deity.deity_name}
                                                        </h4>
                                                        <span className="text-xs font-bold text-emerald-800 block mb-3">
                                                            {result.parihara.deity.title}
                                                        </span>
                                                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                                            {result.parihara.deity.significance}
                                                        </p>
                                                        <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 space-y-1.5 text-xs text-slate-700 mb-3">
                                                            <div>
                                                                <strong className="text-slate-900">Prescribed Archana & Offerings:</strong> {result.parihara.deity.offerings}
                                                            </div>
                                                            <div>
                                                                <strong className="text-slate-900">Temple Archetype:</strong> {result.parihara.deity.kshethram}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-emerald-100/50 p-2.5 rounded-xl border border-emerald-200 text-[11px] font-mono text-emerald-950 font-bold">
                                                        Mantra: {result.parihara.deity.mantra}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Querent Take-Home Actionable Checklist */}
                                            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200">
                                                <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2">
                                                    <span>📋</span> Daivajna Prescribed Remedial Action Plan (Parihara Krama)
                                                </h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                    {result.parihara.checklist.map((step, idx) => (
                                                        <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100 flex items-start gap-2.5 shadow-2xs">
                                                            <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="text-slate-800 font-medium leading-snug">
                                                                {step}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upagrahas Affliction Diagnostic */}
                                    <div className="mb-8 bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200">
                                        <span className="text-[11px] font-bold text-rose-800 uppercase block mb-1">
                                            ⚠️ Upagraha Placements (Mandi & Gulika)
                                        </span>
                                        <span className="text-base sm:text-lg font-black text-rose-900">
                                            Gulika in {result.gulika_sign} | Mandi in {result.mandi_sign}
                                        </span>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Mandi & Gulika represent the fiery sons of Saturn. When residing in Arudha or Udaya, they signify subconscious delays and hidden karmic blocks.
                                        </p>
                                    </div>

                                    {/* SECTION: STRUCTURED DAIVAJNA CONSULTATION REPORT (SUMMARY LAYOUT) */}
                                    {result.consultation_report ? (
                                        <div className="mt-10 pt-8 border-t-2 border-rose-200">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-rose-100">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-1.5">
                                                        📜 Traditional Kerala Horary Reading • Daivajna Sasthra
                                                    </span>
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                        <span>📜</span> Structured Daivajna Consultation Report
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                                        Comprehensive reading structured across the 5 core analytical pillars of Kerala Prasna Marga.
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-rose-50/80 p-1.5 rounded-2xl border border-rose-200 text-xs self-start sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveReportTab("all")}
                                                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${activeReportTab === "all"
                                                            ? 'bg-rose-600 text-white shadow-xs'
                                                            : 'text-slate-600 hover:text-slate-900'
                                                            }`}
                                                    >
                                                        📄 All Sections
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveReportTab("verdict")}
                                                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${activeReportTab !== "all"
                                                            ? 'bg-rose-600 text-white shadow-xs'
                                                            : 'text-slate-600 hover:text-slate-900'
                                                            }`}
                                                    >
                                                        📑 Tabbed View
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Navigation Tabs (if tabbed view) */}
                                            {activeReportTab !== "all" && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {[
                                                        { id: "verdict", label: "The Verdict", icon: "⚖️" },
                                                        ...(result.janma_samvada ? [{ id: "janma_samvada", label: "Janma Samvada", icon: "🌌" }] : []),
                                                        { id: "hindrances", label: "Current Hindrances", icon: "⚠️" },
                                                        { id: "karmic", label: "Karmic Origin", icon: "☸️" },
                                                        { id: "timing", label: "Time of Resolution", icon: "⏳" },
                                                        { id: "parihara", label: "Prescribed Parihara", icon: "🪔" }
                                                    ].map(t => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setActiveReportTab(t.id)}
                                                            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${activeReportTab === t.id
                                                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                                                : 'bg-white hover:bg-rose-50 text-slate-700 border-rose-200'
                                                                }`}
                                                        >
                                                            <span>{t.icon}</span>
                                                            <span>{t.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* TAB CONTENT / CONTINUOUS VIEW */}
                                            <div className="space-y-6">
                                                {/* SECTION 1: THE VERDICT & SUCCESS PROBABILITY METER */}
                                                {(activeReportTab === "verdict" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                                                                Pillar 1: Astrological Verdict
                                                            </span>
                                                            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${result.consultation_report.probability_percent >= 75
                                                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                                                : result.consultation_report.probability_percent >= 50
                                                                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                                                                    : 'bg-rose-100 text-rose-950 border-rose-300'
                                                                }`}>
                                                                {result.consultation_report.verdict_tone}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                                            <div>
                                                                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                                                                    {result.consultation_report.verdict_sanskrit}
                                                                </h4>
                                                                <p className="text-xs sm:text-sm text-slate-600">
                                                                    Evaluation based on Ashtamangala omens, Prana vs Mrityu balance, and Arudha planetary geometry.
                                                                </p>
                                                            </div>

                                                            {/* Success Probability Meter Box */}
                                                            <div className="bg-white p-4 rounded-2xl border border-rose-200 min-w-[220px] text-center shadow-xs">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                                                                    Success Probability Meter
                                                                </span>
                                                                <div className="text-3xl font-black text-slate-900 mb-2">
                                                                    {result.consultation_report.probability_percent}%
                                                                    <span className="text-xs text-slate-500 font-semibold ml-1">Favorable</span>
                                                                </div>
                                                                {/* Animated Bar */}
                                                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 p-0.5">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-1000 ${result.consultation_report.probability_percent >= 75
                                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                                                                            : result.consultation_report.probability_percent >= 50
                                                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                                                : 'bg-gradient-to-r from-rose-500 to-red-600'
                                                                            }`}
                                                                        style={{ width: `${result.consultation_report.probability_percent}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                                                            <strong>Daivajna Reading: </strong>
                                                            {result.consultation_report.probability_percent >= 75 ? (
                                                                <span>The divine pathway is clear (*Sadhya*). Auspicious planetary rays converge to resolve your question with direct success once the timing window opens.</span>
                                                            ) : result.consultation_report.probability_percent >= 50 ? (
                                                                <span>The objective is attainable (*Kashta-Sadhya*), but demands conscious perseverance, strategic adjustments, and performing the prescribed Kerala Pariharas to dissolve latent friction.</span>
                                                            ) : (
                                                                <span>Significant planetary and karmic resistance (*Asadhya*) is indicated. Direct head-on push may exhaust energy; prioritize remedial propitiation and patient spiritual realignment before forceful action.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* JANMA-PRASNA SAMVADA (NATAL KUNDALI CROSS-EXAMINATION) */}
                                                {result.janma_samvada && (activeReportTab === "janma_samvada" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-sm">
                                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                                                                Natal Cross-Examination: Janma-Prasna Samvada (जन्म-प्रश्न संवाद)
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${result.janma_samvada.samvada_analysis.badge_color === 'emerald'
                                                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                                                    : result.janma_samvada.samvada_analysis.badge_color === 'amber'
                                                                        ? 'bg-amber-100 text-amber-950 border-amber-300'
                                                                        : 'bg-rose-100 text-rose-950 border-rose-300'
                                                                    }`}>
                                                                    {result.janma_samvada.samvada_analysis.resonance_tone}
                                                                </span>
                                                                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-xs">
                                                                    Alignment: {result.janma_samvada.samvada_analysis.resonance_score > 0 ? `+${result.janma_samvada.samvada_analysis.resonance_score}` : result.janma_samvada.samvada_analysis.resonance_score}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-6">
                                                            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
                                                                <span>🌌</span> Janma Rasi & Lagna vs Prasna Arudha
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-slate-600">
                                                                Cross-examining your natal birth karma against the cosmic moment of your inquiry (*Prasna Marga Chapters 14 & 15*).
                                                            </p>
                                                        </div>

                                                        {/* Natal Identity Cards */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                                            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Janma Rasi (Moon)</span>
                                                                <div className="text-base font-black text-slate-900">{result.janma_samvada.janma_rasi.sign}</div>
                                                                <div className="text-[11px] font-semibold text-indigo-700">
                                                                    {result.janma_samvada.janma_rasi.nakshatra} (P{result.janma_samvada.janma_rasi.pada})
                                                                </div>
                                                            </div>
                                                            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Janma Lagna (Ascendant)</span>
                                                                <div className="text-base font-black text-slate-900">{result.janma_samvada.natal_ascendant.sign}</div>
                                                                <div className="text-[11px] font-semibold text-indigo-700">{result.janma_samvada.natal_ascendant.deg_str}</div>
                                                            </div>
                                                            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Natal Sun (Surya)</span>
                                                                <div className="text-base font-black text-slate-900">{result.janma_samvada.janma_sun.sign}</div>
                                                                <div className="text-[11px] font-semibold text-slate-500">{result.janma_samvada.janma_sun.degree}°</div>
                                                            </div>
                                                            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Birth Details</span>
                                                                <div className="text-xs font-black text-slate-900">{result.janma_samvada.birth_details.dob}</div>
                                                                <div className="text-[11px] font-semibold text-slate-500">{result.janma_samvada.birth_details.tob} • {result.janma_samvada.birth_details.city}</div>
                                                            </div>
                                                        </div>

                                                        {/* 3 Core Horary Cross-Exams */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-[11px] font-extrabold uppercase text-slate-600">Arudha from Moon</span>
                                                                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200">
                                                                        {result.janma_samvada.samvada_analysis.arudha_from_moon_house}th House
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-900 leading-snug">
                                                                    {result.janma_samvada.samvada_analysis.arudha_from_moon_text}
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-[11px] font-extrabold uppercase text-slate-600">Arudha from Lagna</span>
                                                                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200">
                                                                        {result.janma_samvada.samvada_analysis.arudha_from_lagna_house}th House
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-900 leading-snug">
                                                                    {result.janma_samvada.samvada_analysis.arudha_from_lagna_text}
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-[11px] font-extrabold uppercase text-slate-600">Active Natal Transits</span>
                                                                    <span className="text-xs">🪐</span>
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-900 leading-snug">
                                                                    {result.janma_samvada.samvada_analysis.saturn_gochar_status || "Saturn transit neutral to Janma Moon"}
                                                                </p>
                                                                {result.janma_samvada.samvada_analysis.mandi_affliction && (
                                                                    <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                                                                        ⚠️ Janma Mandi Vedha
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Bullet Insights */}
                                                        {result.janma_samvada.samvada_analysis.samvada_points && result.janma_samvada.samvada_analysis.samvada_points.length > 0 && (
                                                            <div className="space-y-2 mb-4">
                                                                <span className="text-[11px] font-extrabold uppercase text-slate-600 block">Classical Prasna Marga Observations:</span>
                                                                {result.janma_samvada.samvada_analysis.samvada_points.map((pt, pIdx) => (
                                                                    <div key={pIdx} className="bg-white p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                                                                        <span className="text-indigo-600 text-sm">✦</span>
                                                                        <span>{pt}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Synthesis Commentary */}
                                                        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 text-xs text-indigo-950 font-medium leading-relaxed">
                                                            <strong>Daivajna Synthesis: </strong>
                                                            {result.janma_samvada.samvada_analysis.summary_status}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* SECTION 2: CURRENT SITUATION & HINDRANCES */}
                                                {(activeReportTab === "hindrances" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
                                                            Pillar 2: Current Situation & Obstacles
                                                        </span>
                                                        <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                                            <span>⚠️</span> What is Obstructing Progress Right Now
                                                        </h4>
                                                        <p className="text-xs text-slate-600 mb-4">
                                                            Kerala Prasna Marga identifies the exact astral pressure points impeding immediate manifestation:
                                                        </p>
                                                        <div className="space-y-3">
                                                            {result.consultation_report.current_hindrances.map((item, idx) => (
                                                                <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-200 flex items-start gap-3 shadow-2xs">
                                                                    <span className="text-lg">📌</span>
                                                                    <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                                                                        {item}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* SECTION 3: THE KARMIC ORIGIN (GENESIS) */}
                                                {(activeReportTab === "karmic" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
                                                            Pillar 3: Karmic Genesis
                                                        </span>
                                                        <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                                            <span>☸️</span> The Karmic Origin (Why This Situation Exists)
                                                        </h4>
                                                        <p className="text-xs text-slate-600 mb-4">
                                                            In Deva Prasna philosophy, no event occurs in isolation; circumstances arise from three converging streams:
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {result.consultation_report.karmic_origins.map((k, idx) => (
                                                                <div key={idx} className="bg-white p-5 rounded-2xl border border-rose-100 flex flex-col justify-between shadow-2xs">
                                                                    <div>
                                                                        <div className="text-2xl mb-2">{k.icon}</div>
                                                                        <span className="text-[10px] font-black uppercase text-rose-800 block mb-1">
                                                                            {k.title}
                                                                        </span>
                                                                        <h5 className="text-sm font-black text-slate-900 mb-2">
                                                                            {k.category}
                                                                        </h5>
                                                                        <p className="text-xs text-slate-700 leading-relaxed">
                                                                            {k.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* SECTION 4: TIME OF RESOLUTION */}
                                                {(activeReportTab === "timing" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
                                                            Pillar 4: Horary Realization Window
                                                        </span>
                                                        <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                                            <span>⏳</span> Time of Resolution (Phala Kala Nirnaya)
                                                        </h4>
                                                        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-2xs mb-4">
                                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-rose-100">
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                                        Projected Fruit Window
                                                                    </span>
                                                                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                                                                        {result.consultation_report.time_of_resolution.expected_fruit}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 text-center">
                                                                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Calendar Window</span>
                                                                    <span className="text-sm font-black text-rose-900">{result.consultation_report.time_of_resolution.calendar_window}</span>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                                                                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                                                                    <span className="text-slate-500 block">Arudha Gati (Mobility):</span>
                                                                    <strong className="text-slate-900 text-sm">{result.consultation_report.time_of_resolution.mobility}</strong>
                                                                </div>
                                                                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                                                                    <span className="text-slate-500 block">Velocity Category:</span>
                                                                    <strong className="text-slate-900 text-sm">{result.consultation_report.time_of_resolution.speed}</strong>
                                                                </div>
                                                                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                                                                    <span className="text-slate-500 block">Degrees to Cusp:</span>
                                                                    <strong className="text-slate-900 text-sm">{result.consultation_report.time_of_resolution.degrees_remaining}° remaining</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-700 leading-relaxed italic">
                                                            {result.consultation_report.time_of_resolution.summary}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* SECTION 5: PRESCRIBED SANTHI & PARIHARA */}
                                                {(activeReportTab === "parihara" || activeReportTab === "all") && (
                                                    <div className="bg-gradient-to-br from-white via-rose-50/40 to-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
                                                            Pillar 5: Prescribed Santhi & Parihara
                                                        </span>
                                                        <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                                            <span>🪔</span> Clear Remedial Protocol (Action Plan)
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                            <div className="bg-white p-4 rounded-2xl border border-amber-200">
                                                                <span className="text-[10px] font-black uppercase text-amber-900 block mb-1">🔥 Yajna / Homam</span>
                                                                <div className="text-sm font-black text-slate-900">{result.consultation_report.prescribed_remedies.homam}</div>
                                                            </div>
                                                            <div className="bg-white p-4 rounded-2xl border border-rose-200">
                                                                <span className="text-[10px] font-black uppercase text-rose-900 block mb-1">🪔 Deepam</span>
                                                                <div className="text-sm font-black text-slate-900">{result.consultation_report.prescribed_remedies.deepam}</div>
                                                            </div>
                                                            <div className="bg-white p-4 rounded-2xl border border-blue-200">
                                                                <span className="text-[10px] font-black uppercase text-blue-900 block mb-1">🤲 Daanam (Charity)</span>
                                                                <div className="text-sm font-black text-slate-900">{result.consultation_report.prescribed_remedies.daanam}</div>
                                                            </div>
                                                            <div className="bg-white p-4 rounded-2xl border border-emerald-200">
                                                                <span className="text-[10px] font-black uppercase text-emerald-900 block mb-1">🛕 Deity Propitiation</span>
                                                                <div className="text-sm font-black text-slate-900">{result.consultation_report.prescribed_remedies.deity}</div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
                                                            <span className="text-[11px] font-bold text-rose-900 uppercase block mb-2">Sequential Checklist:</span>
                                                            <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                                                                {result.consultation_report.prescribed_remedies.checklist.map((c, i) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-rose-600 font-bold">✓</span>
                                                                        <span>{c}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Daivajna Final Benediction */}
                                            <div className="mt-8 bg-gradient-to-r from-rose-100/70 via-rose-50 to-pink-100/60 p-6 rounded-3xl border border-rose-200 shadow-2xs text-center">
                                                <div className="text-2xl mb-1.5">🪷 🕉️ 🪷</div>
                                                <h4 className="text-xs uppercase font-black text-slate-900 tracking-wider mb-2">
                                                    Daivajna Vedic Benediction (Ashirvada)
                                                </h4>
                                                <p className="text-sm sm:text-base font-serif italic text-slate-900 max-w-2xl mx-auto leading-relaxed">
                                                    "{result.consultation_report.daivajna_benediction}"
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <h4 className="text-xs uppercase font-black text-slate-900 tracking-wider mb-2 flex items-center gap-1.5">
                                                <span>📜</span> Daivajna Divine Synthesis
                                            </h4>
                                            <div className="text-base sm:text-lg font-serif italic leading-relaxed text-slate-900 bg-rose-50/30 p-6 rounded-2xl border border-rose-200 shadow-2xs">
                                                "{result.reasoning}"
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={scrollToQuestionForm}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs uppercase font-black tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2 active:scale-98"
                    >
                        <span>✍️</span>
                        <span>Ask Question</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => window.close()}
                        className="px-6 py-2.5 rounded-full border border-rose-300 bg-white hover:bg-rose-100 text-slate-900 text-xs uppercase font-bold tracking-widest transition-all shadow-xs cursor-pointer"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
