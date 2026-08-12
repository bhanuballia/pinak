import React, { useState, useEffect } from "react";
import { Star, Calendar, User, ArrowLeft, RefreshCw, Sparkles, Brain, Compass, Award, Shield, CheckCircle, Lightbulb, Sun, Zap, Heart, Eye } from "lucide-react";

// Chaldean Numerology Mapping for Letters
const CHALDEAN_MAP = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3,
  'H': 5, 'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
  'O': 7, 'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6,
  'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
};

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

// Personality & Decision Style Matrix (1 to 9)
const PERSONALITY_MATRIX = {
  1: {
    planet: "Sun (Surya)",
    title: "Executive & Independent Pioneer",
    impulse: "Takes immediate charge, hates micromanagement, commands respect.",
    decisionStyle: "Swift, Executive & Direct. Prefers full ownership of consequences.",
    strengths: "Leadership, high ambition, originality, strong willpower.",
    challenges: "Ego clashes, reluctance to delegate, impatience with slowness.",
    badgeBg: "bg-amber-500 text-white"
  },
  2: {
    planet: "Moon (Chandra)",
    title: "Intuitive & Harmonious Diplomat",
    impulse: "Seeks emotional harmony, avoids unnecessary conflict, acts with care.",
    decisionStyle: "Consultative & Intuitive. Relies on gut feel and relationship impact.",
    strengths: "Empathy, artistic imagination, teamwork, deep intuition.",
    challenges: "Over-sensitivity, mood swings, difficulty saying 'no'.",
    badgeBg: "bg-pink-500 text-white"
  },
  3: {
    planet: "Guru (Jupiter)",
    title: "Wise & Visionary Strategist",
    impulse: "Seeks growth, learning, knowledge expansion, and optimistic outlook.",
    decisionStyle: "Analytical & Growth-Oriented. Evaluates moral alignment and wisdom.",
    strengths: "Counseling, academic brilliance, optimism, expressive speech.",
    challenges: "Over-extending promises, unorganized multi-tasking.",
    badgeBg: "bg-yellow-500 text-slate-900"
  },
  4: {
    planet: "Rahu",
    title: "Systematic & Out-of-Box Architect",
    impulse: "Questions outdated rules, demands logical structure, highly practical.",
    decisionStyle: "Structured & Tech-Driven. Looks for out-of-the-box digital solutions.",
    strengths: "Unconventional genius, high discipline, attention to detail.",
    challenges: "Rigidity, stubbornness, over-analyzing worst-case scenarios.",
    badgeBg: "bg-indigo-600 text-white"
  },
  5: {
    planet: "Budh (Mercury)",
    title: "Fast, Versatile & Dynamic Trader",
    impulse: "Loves speed, quick variety, networking, and instant adaptability.",
    decisionStyle: "Fast & Adaptable. Pivots rapidly when new market information arrives.",
    strengths: "Commercial acumen, sharp communication, versatility, speed.",
    challenges: "Restlessness, getting bored easily, lack of long-term patience.",
    badgeBg: "bg-emerald-600 text-white"
  },
  6: {
    planet: "Venus (Shukra)",
    title: "Luxury, Beauty & Family Custodian",
    impulse: "Prioritizes domestic comfort, artistic aesthetics, and love.",
    decisionStyle: "Harmony-Seeking & Aesthetic. Evaluates family comfort and long-term peace.",
    strengths: "Magnetism, luxury sense, relationship bonding, responsibility.",
    challenges: "Over-indulgence, seeking external approval, martyr complex.",
    badgeBg: "bg-purple-600 text-white"
  },
  7: {
    planet: "Ketu",
    title: "Deep Researcher & Mystic Thinker",
    impulse: "Refuses to rush; searches for hidden truth and spiritual depth.",
    decisionStyle: "Reflective & Philosophical. Analyzes underlying causes before acting.",
    strengths: "Sixth sense, deep research, analytical sharpness, detachment.",
    challenges: "Introversion, feeling misunderstood, over-thinking past errors.",
    badgeBg: "bg-slate-700 text-white"
  },
  8: {
    planet: "Saturn (Shani)",
    title: "Pragmatic Corporate Judge",
    impulse: "Focuses on hard reality, duty, financial security, and law.",
    decisionStyle: "Pragmatic & Commercial. Evaluates ROI, legal safety, and long-term durability.",
    strengths: "Endurance, financial discipline, organizational management.",
    challenges: "Excessive caution, heavy sense of burden, harsh self-criticism.",
    badgeBg: "bg-blue-800 text-white"
  },
  9: {
    planet: "Mangal (Mars)",
    title: "Courageous Action Leader",
    impulse: "Driven by passion, protective instincts, and fearlessness.",
    decisionStyle: "Action-Oriented & Bold. Decides with high energy and speed.",
    strengths: "Physical courage, sportsmanship, technical execution, passion.",
    challenges: "Anger spikes, impulsiveness, rushing without backup plans.",
    badgeBg: "bg-rose-600 text-white"
  }
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

function calculateNameNumbers(fullName) {
  if (!fullName) return { namank: null, soulUrge: null };
  const clean = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  let totalNamank = 0;
  let totalSoulUrge = 0;

  const vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const val = CHALDEAN_MAP[char] || 0;
    totalNamank += val;
    if (vowels.has(char)) {
      totalSoulUrge += val;
    }
  }

  return {
    namank: totalNamank > 0 ? reduceToSingleDigit(totalNamank) : null,
    soulUrge: totalSoulUrge > 0 ? reduceToSingleDigit(totalSoulUrge) : null
  };
}

export default function PersonalityNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mulank, setMulank] = useState(null);
  const [bhagyank, setBhagyank] = useState(null);
  const [namank, setNamank] = useState(null);
  const [soulUrge, setSoulUrge] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computePersonalityMatrix(urlName || "", urlDob);
    }
  }, []);

  const computePersonalityMatrix = (inputName, inputDob) => {
    if (!inputDob) return;
    const parts = inputDob.split("-");
    if (parts.length < 3) return;

    const day = parseInt(parts[2], 10);
    const m = reduceToSingleDigit(day);

    const digits = inputDob.replace(/\D/g, "").split("").map(Number);
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const b = reduceToSingleDigit(sum);

    const { namank: nVal, soulUrge: sVal } = calculateNameNumbers(inputName);

    setMulank(m);
    setBhagyank(b);
    setNamank(nVal);
    setSoulUrge(sVal);
    setHasCalculated(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computePersonalityMatrix(name, dob);
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-rose-200 pb-5">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="p-2.5 bg-white border border-rose-200 hover:bg-rose-100 rounded-2xl transition-all text-slate-800 shadow-xs"
            >
              <ArrowLeft className="w-5 h-5 text-rose-700" />
            </button>
            <div className="bg-gradient-to-r from-amber-500 to-rose-600 p-3 rounded-2xl shadow-md shadow-amber-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Personality & Decision-Making Numerology Matrix
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Psychic Mulank, Destiny Bhagyank & Namank Decision Drivers Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        {!hasCalculated ? (
          <div className="max-w-md mx-auto bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50">
            <h2 className="text-[18px] font-bold text-rose-955 text-center mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" /> Enter Details for Personality Matrix
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
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 text-[18px]"
              >
                Analyze Personality & Decision Matrix
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-amber-300" /> Psychological Numerology Matrix
                </span>
                <h2 className="text-2xl md:text-[30px] font-bold text-white">
                  Your 4-Core Decision Drivers Profile
                </h2>
                <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                  Calculated for <strong className="text-amber-200">{name || "User Profile"}</strong> (DOB: {dob}).
                </p>

                {/* 4 Core Pills Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[14px] font-bold text-amber-200 uppercase block">1. Psychic (Mulank)</span>
                    <span className="text-2xl font-black text-amber-300">{mulank} ({PLANET_NAMES[mulank]})</span>
                    <span className="text-xs text-slate-300 font-semibold block">Inner Impulse</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[14px] font-bold text-rose-200 uppercase block">2. Destiny (Bhagyank)</span>
                    <span className="text-2xl font-black text-rose-300">{bhagyank} ({PLANET_NAMES[bhagyank]})</span>
                    <span className="text-xs text-slate-300 font-semibold block">Long-Term Strategy</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[14px] font-bold text-cyan-200 uppercase block">3. Name (Namank)</span>
                    <span className="text-2xl font-black text-cyan-300">{namank || "-"} {namank ? `(${PLANET_NAMES[namank]})` : ""}</span>
                    <span className="text-xs text-slate-300 font-semibold block">Public Persona</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
                    <span className="text-[14px] font-bold text-purple-200 uppercase block">4. Soul Urge</span>
                    <span className="text-2xl font-black text-purple-300">{soulUrge || "-"} {soulUrge ? `(${PLANET_NAMES[soulUrge]})` : ""}</span>
                    <span className="text-xs text-slate-300 font-semibold block">Heart's Motivation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Driver Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Mulank Inner Impulse Card */}
              {(() => {
                const info = PERSONALITY_MATRIX[mulank];
                return (
                  <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">First Impulse Driver</span>
                        <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-600" /> Mulank {mulank}: {info.title}
                        </h3>
                      </div>
                      <span className={`text-[14px] font-bold px-3 py-1 rounded-full ${info.badgeBg}`}>{info.planet}</span>
                    </div>

                    <div className="space-y-3 text-[18px]">
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-1">
                        <span className="font-extrabold text-amber-900 uppercase block">First Subconscious Reaction:</span>
                        <p className="text-slate-800 leading-relaxed font-semibold">{info.impulse}</p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-amber-100 space-y-1">
                        <span className="font-extrabold text-amber-900 uppercase block">Decision-Making Style:</span>
                        <p className="text-slate-900 font-bold leading-relaxed">{info.decisionStyle}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Bhagyank Long-Term Strategy Card */}
              {(() => {
                const info = PERSONALITY_MATRIX[bhagyank];
                return (
                  <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Long-Term Life Strategy</span>
                        <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                          <Compass className="w-5 h-5 text-rose-600" /> Bhagyank {bhagyank}: {info.title}
                        </h3>
                      </div>
                      <span className={`text-[14px] font-bold px-3 py-1 rounded-full ${info.badgeBg}`}>{info.planet}</span>
                    </div>

                    <div className="space-y-3 text-[18px]">
                      <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1">
                        <span className="font-extrabold text-rose-900 uppercase block">Mature Life Direction:</span>
                        <p className="text-slate-800 leading-relaxed font-semibold">{info.decisionStyle}</p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-rose-100 space-y-1">
                        <span className="font-extrabold text-rose-900 uppercase block">Core Personality Strengths & Blindspots:</span>
                        <p className="text-slate-900 font-bold"><strong>Strengths:</strong> {info.strengths}</p>
                        <p className="text-slate-700 font-semibold mt-1"><strong>Blindspot Warning:</strong> {info.challenges}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Complete 1 to 9 Decision-Making Master Matrix */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-amber-600" /> Complete 1 to 9 Decision-Making & Personality Matrix
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Reference guide for how all 9 planetary numbers make choices and handle pressure.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                  Master Archetypes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(PERSONALITY_MATRIX).map(([num, info]) => (
                  <div key={num} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                        <span className="font-black text-rose-950 text-[18px]">Number {num}</span>
                        <span className={`text-[14px] font-bold px-2.5 py-0.5 rounded-full ${info.badgeBg}`}>{info.planet}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-[18px]">{info.title}</h5>
                      <p className="text-[18px] font-bold text-slate-800"><strong>Decision Style:</strong> {info.decisionStyle}</p>
                      <p className="text-[18px] text-slate-700 font-semibold leading-relaxed"><strong>Impulse:</strong> {info.impulse}</p>
                    </div>

                    <div className="pt-2 border-t border-rose-100 text-[18px] font-bold space-y-1">
                      <p className="text-emerald-800"><strong>Strengths:</strong> {info.strengths}</p>
                      <p className="text-rose-800"><strong>Challenges:</strong> {info.challenges}</p>
                    </div>
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
