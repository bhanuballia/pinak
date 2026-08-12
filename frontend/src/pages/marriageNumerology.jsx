import React, { useState, useEffect } from "react";
import { Heart, Calendar, User, ArrowLeft, RefreshCw, Sparkles, CheckCircle, ShieldAlert, Award, Compass, Sun, Zap, Users, Lock, Activity } from "lucide-react";

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

// Friendly Marriage Matrix
const FRIENDLY_MATCHES = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 7],
  3: [1, 3, 5, 7, 9],
  4: [1, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [1, 5, 6, 9],
  7: [1, 2, 3, 5, 7],
  8: [3, 5, 6],
  9: [1, 3, 5, 9]
};

// Marriage Archetype & Timing Matrix (1 to 9)
const MARRIAGE_ARCHETYPES = {
  1: {
    planet: "Sun (Surya)",
    marriageType: "Arranged or Executive Alliance",
    traits: "Requires mutual respect & autonomy. Partner should honor leadership.",
    bestYears: "Personal Years 1, 3, 5, 6",
    harmonyTip: "Avoid ego clashes; share decision-making power."
  },
  2: {
    planet: "Moon (Chandra)",
    marriageType: "Love & Emotional Soulmate Alliance",
    traits: "Deep emotional bonding, care, and domestic warmth.",
    bestYears: "Personal Years 2, 6, 3",
    harmonyTip: "Communicate feelings clearly without over-sensitivity."
  },
  3: {
    planet: "Guru (Jupiter)",
    marriageType: "Wisdom & Family-Approved Alliance",
    traits: "Built on shared morals, intellectual growth, and family blessings.",
    bestYears: "Personal Years 3, 6, 9",
    harmonyTip: "Support partner's career and spiritual growth."
  },
  4: {
    planet: "Rahu",
    marriageType: "Unconventional or Out-of-Box Match",
    traits: "Unique modern partnership; values space and practical structure.",
    bestYears: "Personal Years 4, 5, 6, 7",
    harmonyTip: "Maintain transparent communication to prevent misunderstandings."
  },
  5: {
    planet: "Mercury (Budh)",
    marriageType: "Dynamic Love & Travel Alliance",
    traits: "Youthful energy, high communication, intellectual companionship.",
    bestYears: "Personal Years 5, 6, 1",
    harmonyTip: "Keep romance fresh with spontaneous trips and humor."
  },
  6: {
    planet: "Venus (Shukra)",
    marriageType: "Romantic, Luxury & Family Bliss",
    traits: "Supreme marriage number. High romance, luxury, and domestic joy.",
    bestYears: "Personal Years 6, 3, 2",
    harmonyTip: "Enjoy domestic aesthetics and shared romantic moments."
  },
  7: {
    planet: "Ketu",
    marriageType: "Spiritual & Intuitive Bond",
    traits: "Deep telepathic connection; values quiet quality time.",
    bestYears: "Personal Years 7, 2, 3",
    harmonyTip: "Give each other creative space without emotional isolation."
  },
  8: {
    planet: "Saturn (Shani)",
    marriageType: "Pragmatic & Stable Life Alliance",
    traits: "Long-lasting, highly loyal, realistic, and commercially secure.",
    bestYears: "Personal Years 8, 3, 6",
    harmonyTip: "Express affection openly; do not let work stress overshadow love."
  },
  9: {
    planet: "Mars (Mangal)",
    marriageType: "Passionate & Energetic Alliance",
    traits: "High physical vitality, protective nature, and active lifestyle.",
    bestYears: "Personal Years 9, 1, 3, 6",
    harmonyTip: "Channel energy into joint fitness and shared adventures."
  }
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

export default function MarriageNumerology() {
  const [p1Name, setP1Name] = useState("");
  const [p1Dob, setP1Dob] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Dob, setP2Dob] = useState("");

  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setP1Name(urlName);
    if (urlDob) {
      setP1Dob(urlDob);
    }
  }, []);

  const computeMarriagePrediction = () => {
    if (!p1Dob) return;

    // Partner 1 Calculations
    const p1Day = parseInt(p1Dob.split("-")[2], 10);
    const p1Mulank = reduceToSingleDigit(p1Day);
    const p1Digits = p1Dob.replace(/\D/g, "").split("").map(Number);
    const p1Bhagyank = reduceToSingleDigit(p1Digits.reduce((a, b) => a + b, 0));

    // Partner 2 Calculations (Optional)
    let p2Mulank = null;
    let p2Bhagyank = null;
    let compatibilityScore = null;
    let isHarmonious = false;

    if (p2Dob) {
      const p2Day = parseInt(p2Dob.split("-")[2], 10);
      p2Mulank = reduceToSingleDigit(p2Day);
      const p2Digits = p2Dob.replace(/\D/g, "").split("").map(Number);
      p2Bhagyank = reduceToSingleDigit(p2Digits.reduce((a, b) => a + b, 0));

      isHarmonious = FRIENDLY_MATCHES[p1Mulank]?.includes(p2Mulank);
      
      // Calculate percentage
      if (p1Mulank === p2Mulank) compatibilityScore = 95;
      else if (isHarmonious) compatibilityScore = 85;
      else compatibilityScore = 65;
    }

    // Marriage Timing (Current Year Personal Year)
    const currentYear = new Date().getFullYear();
    const uyn = reduceToSingleDigit(currentYear.toString().split("").map(Number).reduce((a, b) => a + b, 0));
    const p1Month = parseInt(p1Dob.split("-")[1], 10);
    const p1Pyn = reduceToSingleDigit(p1Mulank + reduceToSingleDigit(p1Month) + uyn);

    const archetype = MARRIAGE_ARCHETYPES[p1Mulank];

    setPredictionData({
      p1Mulank,
      p1Bhagyank,
      p2Mulank,
      p2Bhagyank,
      compatibilityScore,
      isHarmonious,
      p1Pyn,
      currentYear,
      archetype
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computeMarriagePrediction();
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
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 rounded-2xl shadow-md shadow-pink-200">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Vedic Marriage & Love Compatibility Numerology
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Marital Timing, Couple Compatibility Score, Marriage Archetype & Venus Alignment
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="max-w-2xl mx-auto bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50">
          <h2 className="text-[18px] font-bold text-rose-955 text-center mb-6 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-600 fill-pink-500" /> Enter Partner Details For Marriage Prediction
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Partner 1 */}
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <h3 className="text-[18px] font-extrabold text-rose-900 flex items-center gap-2">
                <User className="w-4 h-4 text-rose-600" /> Partner 1 (Primary Chart)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[18px] font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium text-[18px]"
                  />
                </div>
                <div>
                  <label className="text-[18px] font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={p1Dob}
                    onChange={(e) => setP1Dob(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium text-[18px]"
                  />
                </div>
              </div>
            </div>

            {/* Partner 2 (Optional) */}
            <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-200 space-y-3">
              <h3 className="text-[18px] font-extrabold text-pink-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" /> Partner 2 (Optional Compatibility Match)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[18px] font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    placeholder="e.g. Ananya Sen"
                    className="w-full bg-white border border-pink-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium text-[18px]"
                  />
                </div>
                <div>
                  <label className="text-[18px] font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={p2Dob}
                    onChange={(e) => setP2Dob(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium text-[18px]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-500/20 transition-all transform hover:-translate-y-0.5 text-[18px] flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Calculate Marriage Prediction & Compatibility</span>
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        {predictionData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 bg-pink-500/20 text-pink-200 border border-pink-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Heart className="w-4 h-4 text-pink-300 fill-pink-300" /> Marital Destiny Report
                  </span>
                  <h2 className="text-2xl md:text-[30px] font-bold text-white">
                    Marriage & Love Alignment
                  </h2>
                  <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                    Calculated for <strong className="text-pink-200">{p1Name || "Partner 1"}</strong> (Mulank {predictionData.p1Mulank} & Bhagyank {predictionData.p1Bhagyank}).
                  </p>
                </div>

                {predictionData.compatibilityScore && (
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/20 text-center backdrop-blur-md">
                    <span className="text-[14px] font-bold text-pink-200 uppercase block">Compatibility Score</span>
                    <span className="text-4xl font-black text-pink-300">{predictionData.compatibilityScore}%</span>
                    <span className="text-xs text-white font-bold block mt-1">
                      {predictionData.isHarmonious ? "🌟 High Marital Harmony" : "⚖️ Remedial Adjustment Needed"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Marriage Archetype & Personal Year Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Marriage Archetype Card */}
              <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-[18px] font-bold text-slate-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-pink-500" /> Marriage Archetype & Traits
                </h3>
                <div className="space-y-3 text-[18px]">
                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1">
                    <span className="font-extrabold text-rose-900 uppercase block">Destiny Marriage Type:</span>
                    <p className="text-slate-900 font-extrabold text-xl">{predictionData.archetype.marriageType}</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-rose-100 space-y-1">
                    <span className="font-extrabold text-slate-900 uppercase block">Marital Relationship Traits:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{predictionData.archetype.traits}</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="font-extrabold text-emerald-900 uppercase block">Key To Long-Term Harmony:</span>
                    <p className="text-slate-900 font-bold">{predictionData.archetype.harmonyTip}</p>
                  </div>
                </div>
              </div>

              {/* Personal Year Timing Card */}
              <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-[18px] font-bold text-slate-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-600" /> Auspicious Marriage Timing & Personal Year
                </h3>
                <div className="space-y-3 text-[18px]">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 space-y-1">
                    <span className="font-extrabold text-purple-900 uppercase block">Your Current Personal Year ({predictionData.currentYear}):</span>
                    <p className="text-2xl font-black text-purple-950">Personal Year {predictionData.p1Pyn} ({PLANET_NAMES[predictionData.p1Pyn]})</p>
                    <span className="text-xs text-slate-600 font-bold block">
                      {predictionData.p1Pyn === 6 ? "💖 Venus Year: Most auspicious year for marriage & romance!" : 
                       predictionData.p1Pyn === 3 ? "✨ Jupiter Year: Excellent year for family blessings & wedding!" : 
                       predictionData.p1Pyn === 2 ? "🌙 Moon Year: High emotional connection & engagement year." : 
                       "Standard preparation year for relationship growth."}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-rose-100 space-y-1">
                    <span className="font-extrabold text-rose-900 uppercase block">Most Auspicious Personal Marriage Years:</span>
                    <p className="text-slate-900 font-extrabold">{predictionData.archetype.bestYears}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete 1 to 9 Marriage Reference Matrix */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-600" /> Complete 1 to 9 Marriage Archetype Matrix
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Reference guide for how all 9 planetary numbers experience love and marriage.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-pink-100 text-pink-900 px-3 py-1 rounded-full border border-pink-200">
                  Venus Harmony
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(MARRIAGE_ARCHETYPES).map(([num, info]) => (
                  <div key={num} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                        <span className="font-black text-rose-950 text-[18px]">Number {num} ({info.planet})</span>
                        <span className="text-xs font-bold bg-pink-100 text-pink-900 px-2 py-0.5 rounded-full">{info.bestYears}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-[16px]">{info.marriageType}</h5>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed"><strong>Traits:</strong> {info.traits}</p>
                    </div>

                    <div className="pt-2 border-t border-rose-100 text-xs font-bold text-emerald-800">
                      <strong>Tip:</strong> {info.harmonyTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setPredictionData(null)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 text-[18px]"
              >
                <RefreshCw className="w-4 h-4 text-white" />
                <span>Calculate Another Couple Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
