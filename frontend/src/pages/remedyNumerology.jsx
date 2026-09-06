import React, { useState, useEffect } from "react";
import { Star, Calendar, User, ArrowLeft, RefreshCw, Sparkles, Shield, Zap, CheckCircle, ShieldAlert, Award, Compass, Heart, Activity, Gem, Disc, Radio, Play, Square, Volume2, BookOpen, Sun, Flame, Droplets, Wind, Mountain } from "lucide-react";

// Planet names for 1 to 9
const PLANET_NAMES = {
  1: "Sun (Surya)",
  2: "Moon (Chandra)",
  3: "Jupiter (Guru)",
  4: "Rahu",
  5: "Mercury (Budh)",
  6: "Venus (Shukra)",
  7: "Ketu",
  8: "Saturn (Shani)",
  9: "Mars (Mangal)"
};

// Full Planetary Data Matrix (1 to 9)
const PLANETARY_ROLE_MATRIX = {
  1: {
    planet: "Sun (Surya)",
    deva: "Agni Deva / King of Planets",
    role: "Soul, Vitality, Leadership, Ego & Authority",
    element: "Fire / Agni",
    friendly: "2, 3, 5, 9",
    hostile: "8 (Saturn)",
    traits: "Commanding presence, self-reliance, high ambition, executive decision making.",
    bg: "bg-amber-50 border-amber-200 text-amber-950",
    badge: "bg-amber-500 text-white"
  },
  2: {
    planet: "Moon (Chandra)",
    deva: "Varuna Deva / Queen of Planets",
    role: "Mind, Emotions, Peace, Intuition & Care",
    element: "Water / Jala",
    friendly: "1, 3, 7",
    hostile: "4, 8, 9",
    traits: "Gentle nature, artistic imagination, emotional sensitivity, empathy.",
    bg: "bg-pink-50 border-pink-200 text-pink-950",
    badge: "bg-pink-500 text-white"
  },
  3: {
    planet: "Guru (Jupiter)",
    deva: "Lord Brahma / Preceptor of Devas",
    role: "Wisdom, Spirituality, Expansion & Knowledge",
    element: "Wood / Ether",
    friendly: "1, 5, 7, 9",
    hostile: "6 (Venus)",
    traits: "Counseling ability, moral integrity, academic brilliance, spiritual growth.",
    bg: "bg-yellow-50 border-yellow-200 text-yellow-950",
    badge: "bg-yellow-500 text-slate-900"
  },
  4: {
    planet: "Rahu (North Node)",
    deva: "Asura / Shadow Planet",
    role: "Structure, Technology & Out-of-Box Genius",
    element: "Wood / Shadow",
    friendly: "1, 5, 6, 7",
    hostile: "2, 4, 8, 9",
    traits: "Digital innovation, unconventional problem solving, sudden wealth expansion.",
    bg: "bg-indigo-50 border-indigo-200 text-indigo-950",
    badge: "bg-indigo-600 text-white"
  },
  5: {
    planet: "Budh (Mercury)",
    deva: "Lord Vishnu / Prince of Planets",
    role: "Intelligence, Trading, Communication & Balance",
    element: "Earth (Center)",
    friendly: "1, 3, 6 (Neutral to all)",
    hostile: "None",
    traits: "Commercial agility, quick calculations, networking, diplomatic speech.",
    bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
    badge: "bg-emerald-600 text-white"
  },
  6: {
    planet: "Venus (Shukra)",
    deva: "Goddess Lakshmi / Guru of Asuras",
    role: "Luxury, Beauty, Romance & Family Harmony",
    element: "Metal / Luxury",
    friendly: "1, 5, 9",
    hostile: "3 (Jupiter)",
    traits: "Aesthetics, financial luxury, domestic happiness, fine arts.",
    bg: "bg-purple-50 border-purple-200 text-purple-950",
    badge: "bg-purple-600 text-white"
  },
  7: {
    planet: "Ketu (South Node)",
    deva: "Lord Ganesha / Shadow Planet",
    role: "Research, Occult, Intuition & Liberation",
    element: "Metal / Spiritual",
    friendly: "1, 2, 3, 5",
    hostile: "8, 9",
    traits: "Sixth sense, deep introspection, research sharpness, detachment.",
    bg: "bg-slate-100 border-slate-300 text-slate-950",
    badge: "bg-slate-700 text-white"
  },
  8: {
    planet: "Shani (Saturn)",
    deva: "Yama Deva / Cosmic Judge",
    role: "Karma, Discipline, Justice & Perseverance",
    element: "Earth / Practical",
    friendly: "3, 5, 6",
    hostile: "1, 2, 4, 8",
    traits: "Corporate authority, real estate, endurance, financial discipline.",
    bg: "bg-blue-50 border-blue-200 text-blue-950",
    badge: "bg-blue-800 text-white"
  },
  9: {
    planet: "Mangal (Mars)",
    deva: "Lord Hanuman / Commander of Army",
    role: "Courage, Vitality, Action & Technical Power",
    element: "Fire / Energy",
    friendly: "1, 3, 5",
    hostile: "2, 7",
    traits: "Physical strength, sportsmanship, technical execution, fearlessness.",
    bg: "bg-rose-50 border-rose-200 text-rose-950",
    badge: "bg-rose-600 text-white"
  }
};

// Full Master Remedies Matrix (1 to 9)
const MASTER_REMEDIES = {
  1: {
    planet: "Sun (Surya)",
    element: "Fire / Water",
    challenge: "Low confidence, career delays, authority struggles, weak willpower",
    crystal: "Ruby, Sunstone, Pyrite",
    mantra: "Om Hram Hrim Hrom Sah Suryaya Namah",
    solfeggio: 528,
    switchwords: "COUNT-NOW-GOLD",
    circleColor: "border-amber-500 bg-amber-50/40 text-amber-950",
    badgeBg: "bg-amber-500 text-white",
    direction: "East Zone"
  },
  2: {
    planet: "Moon (Chandra)",
    element: "Water / Earth",
    challenge: "Mood swings, emotional anxiety, lack of peace, relationship stress",
    crystal: "Moonstone, Rose Quartz, Natural Pearl",
    mantra: "Om Shram Shrim Shrom Sah Chandraya Namah",
    solfeggio: 432,
    switchwords: "LOVE-TOGETHER-SWEET",
    circleColor: "border-pink-300 bg-pink-50/40 text-pink-950",
    badgeBg: "bg-pink-500 text-white",
    direction: "Northwest Zone"
  },
  3: {
    planet: "Guru (Jupiter)",
    element: "Wood / Ether",
    challenge: "Higher education obstacles, lack of mentors/guidance, financial growth friction",
    crystal: "Yellow Topaz, Citrine, Yellow Sapphire",
    mantra: "Om Gram Grim Grom Sah Gurave Namah",
    solfeggio: 639,
    switchwords: "REACH-DIVINE-WISDOM",
    circleColor: "border-yellow-400 bg-yellow-50/40 text-yellow-950",
    badgeBg: "bg-yellow-500 text-slate-900",
    direction: "Northeast Zone"
  },
  4: {
    planet: "Rahu",
    element: "Wood / Shadow",
    challenge: "Lack of discipline, structural delays, disorganized life, unexpected losses",
    crystal: "Hessonite (Gomed), Tiger's Eye",
    mantra: "Om Bhram Bhrim Bhrom Sah Rahave Namah",
    solfeggio: 396,
    switchwords: "CLEAR-SCHEME-ORDER",
    circleColor: "border-indigo-400 bg-indigo-50/40 text-indigo-950",
    badgeBg: "bg-indigo-600 text-white",
    direction: "Southeast Zone"
  },
  5: {
    planet: "Mercury (Budh)",
    element: "Earth (Center Balance)",
    challenge: "Financial instability, poor communication, lack of life balance",
    crystal: "Green Emerald, Green Aventurine, Malachite",
    mantra: "Om Bram Brim Brom Sah Budhaya Namah",
    solfeggio: 852,
    switchwords: "FIND-COUNT-DIVINE-COUNT",
    circleColor: "border-emerald-500 bg-emerald-50/40 text-emerald-950",
    badgeBg: "bg-emerald-600 text-white",
    direction: "Brahmasthan (Center)"
  },
  6: {
    planet: "Venus (Shukra)",
    element: "Metal / Luxury",
    challenge: "Relationship friction, luxury delays, lack of domestic family support",
    crystal: "Diamond, Clear Quartz, Opal, Selenite",
    mantra: "Om Dram Drim Drom Sah Shukraya Namah",
    solfeggio: 963,
    switchwords: "CHARM-LOVE-SHINE-NOW",
    circleColor: "border-purple-400 bg-purple-50/40 text-purple-950",
    badgeBg: "bg-purple-600 text-white",
    direction: "Northwest Zone"
  },
  7: {
    planet: "Ketu",
    element: "Metal / Spiritual",
    challenge: "Disconnection from gut intuition, overthinking, anxiety, trust issues",
    crystal: "Cat's Eye (Lahsuniya), Smokey Quartz",
    mantra: "Om Stram Strim Strom Sah Ketave Namah",
    solfeggio: 741,
    switchwords: "REACH-POINT-SECRET",
    circleColor: "border-slate-400 bg-slate-100/60 text-slate-950",
    badgeBg: "bg-slate-700 text-white",
    direction: "West Zone"
  },
  8: {
    planet: "Saturn (Shani)",
    element: "Earth / Practical",
    challenge: "Money leaks, legal/contractual delays, lack of perseverance",
    crystal: "Blue Sapphire, Amethyst, Black Tourmaline",
    mantra: "Om Pram Prim Prom Sah Shanaishcharaya Namah",
    solfeggio: 285,
    switchwords: "SLOW-STATION-STABILITY",
    circleColor: "border-blue-600 bg-blue-50/40 text-blue-950",
    badgeBg: "bg-blue-800 text-white",
    direction: "West Zone"
  },
  9: {
    planet: "Mars (Mangal)",
    element: "Fire / Energy",
    challenge: "Procrastination, fear of taking action, low vitality, anger spikes",
    crystal: "Red Coral, Carnelian, Red Jasper",
    mantra: "Om Kram Krim Krom Sah Bhaumaya Namah",
    solfeggio: 174,
    switchwords: "VICTORY-FORCE-NOW",
    circleColor: "border-rose-500 bg-rose-50/40 text-rose-950",
    badgeBg: "bg-rose-600 text-white",
    direction: "South Zone"
  }
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

export default function RemedyNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mulank, setMulank] = useState(null);
  const [bhagyank, setBhagyank] = useState(null);
  const [presentNumbers, setPresentNumbers] = useState(new Set());
  const [missingNumbers, setMissingNumbers] = useState([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingFreq, setPlayingFreq] = useState(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [oscillator, setOscillator] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computeRemedies(urlName || "", urlDob);
    }
  }, []);

  const computeRemedies = (inputName, inputDob) => {
    if (!inputDob) return;
    const parts = inputDob.split("-");
    if (parts.length < 3) return;

    const day = parseInt(parts[2], 10);
    const m = reduceToSingleDigit(day);

    const digits = inputDob.replace(/\D/g, "").split("").map(Number);
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const b = reduceToSingleDigit(sum);

    const pSet = new Set(digits);
    pSet.add(m);
    pSet.add(b);

    const missing = [];
    for (let i = 1; i <= 9; i++) {
      if (!pSet.has(i)) {
        missing.push(i);
      }
    }

    setMulank(m);
    setBhagyank(b);
    setPresentNumbers(pSet);
    setMissingNumbers(missing);
    setHasCalculated(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computeRemedies(name, dob);
  };

  // Web Audio Synthesizer Tone Generator
  const playSolfeggioTone = (freq) => {
    stopAudio();
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setOscillator(osc);
      setIsPlayingAudio(true);
      setPlayingFreq(freq);
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  };

  const stopAudio = () => {
    if (oscillator) {
      try { oscillator.stop(); } catch (e) { }
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) { }
    }
    setIsPlayingAudio(false);
    setPlayingFreq(null);
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-rose-200 pb-5 gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => window.history.back()}
              className="p-2.5 bg-white border border-rose-200 hover:bg-rose-100 rounded-2xl transition-all text-slate-800 shadow-xs"
            >
              <ArrowLeft className="w-5 h-5 text-rose-700" />
            </button>
            <div className="bg-gradient-to-r from-purple-600 to-rose-600 p-3 rounded-2xl shadow-md shadow-purple-200">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Vedic Numerology Powerful Remedies & Planetary Roles
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Navagraha Planetary Roles, Crystals, Bija Mantras, Solfeggio Sound Therapy & Energy Circles
              </p>
            </div>
          </div>


          <div className="w-full md:w-auto min-w-[250px] ml-auto">
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                const urlParams = new URLSearchParams(window.location.search);
                const nameParam = urlParams.get('name') || '';
                const dobParam = urlParams.get('date') || urlParams.get('dob') || '';
                
                const newParams = new URLSearchParams({
                  name: nameParam,
                  date: dobParam
                });

                if (val.startsWith('ext_')) {
                  switch (val) {
                    case 'ext_remedy':
                      newParams.append('remedy_numerology', 'true');
                      break;
                    case 'ext_medical':
                      newParams.append('medical_numerology', 'true');
                      break;
                    case 'ext_personality':
                      newParams.append('personality_numerology', 'true');
                      break;
                    case 'ext_career':
                      newParams.append('carrier_numerology', 'true');
                      break;
                    case 'ext_prediction':
                      newParams.append('prediction_numerology', 'true');
                      break;
                    case 'ext_daily':
                      newParams.append('daily_numerology', 'true');
                      break;
                    default:
                      break;
                  }
                  window.location.href = '/?' + newParams.toString();
                } else {
                  newParams.append('numerology', 'true');
                  newParams.append('tab', val);
                  window.location.href = '/?' + newParams.toString();
                }
              }}
              className="w-full bg-white border border-rose-300 text-rose-950 font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-[14px] md:text-[16px] shadow-sm appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23881337\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em' }}
            >
              <option value="" disabled>Navigate Numerology...</option>
              <optgroup label="Dashboard Views">
                <option value="report">⭐ Detailed Report</option>
                <option value="prediction">✨ Special Yogas</option>
                <option value="correction">🖋️ Name Correction</option>
                <option value="compatibility">💍 Marriage Match</option>
                <option value="vastu">🧭 Vastu & Yogas</option>
                <option value="analytics">📊 Numerology Grid</option>
                <option value="cycles">📅 Life Cycles</option>
                <option value="quantum">🌌 Quantum Sync</option>
                <option value="mobile">📱 Mobile Numerology</option>
              </optgroup>
              <optgroup label="Advanced External Reports">
                <option value="ext_remedy">💎 Powerful Remedies</option>
                <option value="ext_medical">🏥 Medical Diagnostics</option>
                <option value="ext_personality">🧠 Personality Matrix</option>
                <option value="ext_career">💼 Career & Wealth</option>
                <option value="ext_prediction">⭐ Car & Home Prediction</option>
                <option value="ext_daily">☀️ Daily Forecast</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Input Form Card */}
        {!hasCalculated ? (
          <div className="max-w-md mx-auto bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50">
            <h2 className="text-[18px] font-bold text-rose-955 text-center mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" /> Diagnose Missing Voids & Remedies
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[18px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-600" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium text-[18px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[18px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" /> Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium text-[18px]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 text-[18px]"
              >
                Diagnose Sacred Remedies
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Gem className="w-4 h-4 text-purple-300" /> Sacred Vibration Healing Matrix
                </span>
                <h2 className="text-2xl md:text-[30px] font-bold text-white">
                  Missing Grid Voids & Remedy Diagnostics
                </h2>
                <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                  Calculated for <strong className="text-purple-200">{name || "Your Profile"}</strong> (DOB: {dob}). Mulank (Psychic): <strong className="text-purple-200">{mulank}</strong> | Bhagyank (Destiny): <strong className="text-purple-200">{bhagyank}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[18px]">
                  <span className="font-bold text-purple-300">Missing Voids Diagnosed:</span>
                  {missingNumbers.length > 0 ? (
                    missingNumbers.map(n => (
                      <span key={n} className="px-3 py-0.5 rounded-full bg-rose-600 text-white font-black">
                        Void {n} ({PLANET_NAMES[n]})
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black">
                      All 9 Numbers Present (Fully Balanced Chart!)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Synthesizer Banner */}
            {isPlayingAudio && (
              <div className="p-4 bg-purple-900 text-white rounded-2xl border border-purple-700 flex items-center justify-between shadow-lg animate-bounce">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-cyan-300 animate-pulse" />
                  <div>
                    <span className="font-extrabold text-[18px] block text-cyan-200">
                      Now Playing Solfeggio Healing Frequency: {playingFreq} Hz
                    </span>
                    <span className="text-xs text-purple-200">Web Audio API Pure Sine Carrier Wave Active</span>
                  </div>
                </div>
                <button
                  onClick={stopAudio}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Audio</span>
                </button>
              </div>
            )}

            {/* Role of Planets in Numerology Guide Card */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-rose-600" /> Role of Navagraha Planets in Numerology (Numbers 1 to 9)
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Every number represents the physical conduit for planetary electromagnetic frequencies.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-200">
                  Navagraha Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(PLANETARY_ROLE_MATRIX).map(([num, info]) => {
                  const isPresent = presentNumbers.has(parseInt(num, 10));
                  return (
                    <div
                      key={num}
                      className={`p-5 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${isPresent
                        ? "bg-white border-rose-200 shadow-2xs"
                        : "bg-rose-50/50 border-rose-200/80"
                        }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-rose-950 text-[18px]">Number {num}</span>
                          <span className={`text-[18px] font-bold px-2.5 py-0.5 rounded-full ${info.badge}`}>
                            {info.planet}
                          </span>
                        </div>
                        <p className="text-[18px] font-bold text-purple-900"><strong>Cosmic Force:</strong> {info.deva}</p>
                        <p className="text-[18px] font-bold text-slate-900"><strong>Core Role:</strong> {info.role}</p>
                        <p className="text-[18px] text-slate-700 font-semibold leading-relaxed"><strong>Traits:</strong> {info.traits}</p>
                      </div>

                      <div className="pt-2 border-t border-rose-100 text-[18px] font-bold flex justify-between items-center">
                        <span className="text-emerald-700">Friendly: {info.friendly}</span>
                        <span className="text-rose-700">Hostile: {info.hostile}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnosed Remedies List Card */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" /> Prescribed Remedies For Your Missing Voids
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Crystals, Bija Mantras, Solfeggio sound tones, and Energy Circles to balance missing numbers.
                  </p>
                </div>
                <span className="text-[18px] font-black text-purple-900 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200">
                  {missingNumbers.length} Active Voids
                </span>
              </div>

              {missingNumbers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {missingNumbers.map(num => {
                    const rem = MASTER_REMEDIES[num];
                    const isThisPlaying = isPlayingAudio && playingFreq === rem.solfeggio;

                    return (
                      <div
                        key={num}
                        className="p-6 bg-gradient-to-br from-rose-50/60 via-purple-50/30 to-white rounded-3xl border border-rose-200 space-y-5 flex flex-col justify-between shadow-xs"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                            <div>
                              <span className="text-[18px] font-black text-rose-900">Missing Number {num} Void</span>
                              <span className="text-xs text-slate-500 font-bold block">{rem.planet} ({rem.element})</span>
                            </div>
                            <span className={`text-[14px] font-extrabold px-3 py-1 rounded-full ${rem.badgeBg}`}>
                              {rem.solfeggio} Hz Freq
                            </span>
                          </div>

                          <div className="space-y-2 text-[18px]">
                            <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                              <span className="font-extrabold text-rose-900 block uppercase">Real-World Void Challenge:</span>
                              <p className="text-slate-800 font-medium">{rem.challenge}</p>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                              <span className="font-extrabold text-purple-900 block uppercase flex items-center gap-1">
                                <Gem className="w-4 h-4 text-purple-600" /> Prescribed Crystals & Gemstones:
                              </span>
                              <p className="text-slate-900 font-bold">{rem.crystal}</p>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-1">
                              <span className="font-extrabold text-amber-900 block uppercase">Vedic Bija Mantra:</span>
                              <p className="text-slate-900 font-extrabold italic">"{rem.mantra}"</p>
                            </div>
                          </div>
                        </div>

                        {/* Sacred Energy Circle Graphic */}
                        <div className="pt-3 border-t border-rose-100 space-y-3">
                          <span className="font-bold text-[18px] text-slate-900 block">Sacred Energy Circle (EC) & Switchwords:</span>

                          <div className={`p-4 rounded-full border-2 text-center flex flex-col items-center justify-center space-y-1 transition-all ${rem.circleColor} shadow-inner`}>
                            <span className="text-xs font-black uppercase tracking-widest block">{name || "User Name"}</span>
                            <span className="text-base font-black tracking-wider block">{rem.switchwords}</span>
                            <span className="text-xs font-bold block">{rem.solfeggio} Hz | Zone: {rem.direction}</span>
                          </div>

                          {/* Sound Therapy Button */}
                          <button
                            onClick={() => isThisPlaying ? stopAudio() : playSolfeggioTone(rem.solfeggio)}
                            className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${isThisPlaying
                              ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                              : "bg-purple-900 hover:bg-purple-950 text-white"
                              }`}
                          >
                            {isThisPlaying ? (
                              <>
                                <Square className="w-4 h-4 fill-current" />
                                <span>Stop {rem.solfeggio} Hz Audio Tone</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>Play {rem.solfeggio} Hz Solfeggio Audio Remedy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-2">
                  <p className="text-[18px] font-bold text-emerald-950">Your Birth Chart is Perfectly Balanced!</p>
                  <p className="text-[18px] text-slate-700 font-semibold">You have all numbers present in your planetary grid matrix. You can use general 528 Hz or 432 Hz Solfeggio frequencies for routine relaxation.</p>
                </div>
              )}
            </div>

            {/* Complete 1 to 9 Remedies Master Reference Table */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-[18px] font-bold text-slate-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" /> Complete 1 to 9 Remedies Master Reference Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(MASTER_REMEDIES).map(([num, rem]) => (
                  <div key={num} className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                      <span className="font-black text-rose-900 text-[18px]">Number {num} ({rem.planet})</span>
                      <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">{rem.solfeggio} Hz</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800"><strong>Crystal:</strong> {rem.crystal}</p>
                    <p className="text-xs font-bold text-purple-900"><strong>Switchword:</strong> {rem.switchwords}</p>
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed"><strong>Mantra:</strong> "{rem.mantra}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setHasCalculated(false)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 text-[18px]"
              >
                <RefreshCw className="w-4 h-4 text-white" />
                <span>Analyze Another Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
