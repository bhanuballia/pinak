import React, { useState, useEffect } from "react";
import { Star, Calendar, User, ArrowLeft, RefreshCw, Sparkles, Sun, Clock, Zap, CheckCircle, ShieldAlert, Award, Compass, Heart, Activity } from "lucide-react";

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

// Daily Personal Day Numerology Guide Data
const PERSONAL_DAY_INFO = {
  1: {
    planet: "Sun (Surya)",
    title: "New Beginnings, Leadership & High Power",
    desc: "High energy day. Excellent for starting new projects, launching ideas, meeting leaders, and taking independent initiatives.",
    colors: "Gold, Bright Yellow, Warm Orange",
    action: "Launch new deals, pitch ideas, lead from the front",
    avoid: "Procrastination and hesitation",
    icon: "☀️"
  },
  2: {
    planet: "Moon (Chandra)",
    title: "Harmony, Relationships & Gentle Peace",
    desc: "Emotional and sensitive day. Focus on teamwork, resolving disputes, partner bonding, and peaceful negotiations.",
    colors: "White, Cream, Silver, Off-White",
    action: "Negotiate calmly, listen to loved ones, foster peace",
    avoid: "Overreacting emotionally or engaging in harsh arguments",
    icon: "🌙"
  },
  3: {
    planet: "Jupiter (Guru)",
    title: "Expansion, Creativity & Wisdom",
    desc: "Vibrant social day. Highly auspicious for creative writing, advice, spiritual learning, and joyful networking.",
    colors: "Bright Yellow, Golden, Amber",
    action: "Express ideas, attend social events, study sacred knowledge",
    avoid: "Scattering energy across too many goals",
    icon: "✨"
  },
  4: {
    planet: "Rahu",
    title: "Discipline, Routine & Practical Work",
    desc: "Focuses on hard work, routines, financial paperwork, and organizing pending office tasks with high discipline.",
    colors: "Metallic Grey, Slate, Navy Blue",
    action: "Organize finances, complete pending chores, build structure",
    avoid: "Taking uncalculated shortcuts or risky gambles",
    icon: "⚙️"
  },
  5: {
    planet: "Mercury (Budh)",
    title: "Speed, Communication & Trading",
    desc: "Dynamic high-speed day. Auspicious for marketing campaigns, trading, short travel, closing deals, and networking.",
    colors: "Emerald Green, Light Blue, Turquoise",
    action: "Travel, close sales deals, send important emails",
    avoid: "Impulsive speech or restless distraction",
    icon: "🚀"
  },
  6: {
    planet: "Venus (Shukra)",
    title: "Family, Luxury, Romance & Comfort",
    desc: "Loving, harmonious day. Ideal for family gatherings, buying luxury goods, home interior decor, and romantic dates.",
    colors: "Pink, Rose Gold, Pure White, Silver",
    action: "Host family dinners, buy luxury items, spend quality time",
    avoid: "Overspending beyond budget",
    icon: "💖"
  },
  7: {
    planet: "Ketu",
    title: "Introspection, Research & Meditation",
    desc: "Quiet spiritual day. Best for deep study, self-reflection, research, meditation, and strategic inner planning.",
    colors: "Off-White, Pearl, Light Grey",
    action: "Meditate, research, read books, plan future strategy",
    avoid: "Rushing into crowded social noise",
    icon: "🔮"
  },
  8: {
    planet: "Saturn (Shani)",
    title: "Authority, Financial Karma & Power",
    desc: "High business impact day. Excellent for legal matters, large financial investments, corporate meetings, and hard execution.",
    colors: "Dark Blue, Royal Blue, Charcoal",
    action: "Execute corporate decisions, manage investments, show discipline",
    avoid: "Irresponsible financial risks",
    icon: "👑"
  },
  9: {
    planet: "Mars (Mangal)",
    title: "Completion, Courage & High Energy",
    desc: "High kinetic energy day for completing old pending projects, gym workouts, and clearing physical clutter.",
    colors: "Deep Red, Crimson, Warm Orange",
    action: "Finish old tasks, workout, take courageous action",
    avoid: "Aggressive arguments or careless driving",
    icon: "🔥"
  }
};

const FRIENDLY_NUMBERS = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 7],
  3: [1, 3, 5, 7, 9],
  4: [1, 3, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [3, 5, 6, 9],
  7: [1, 2, 3, 5, 7],
  8: [3, 5, 6],
  9: [1, 3, 5, 9]
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

export default function DailyNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computeDailyForecast(urlName || "", urlDob, targetDate);
    }
  }, []);

  const computeDailyForecast = (inputName, inputDob, inputTargetDate) => {
    if (!inputDob || !inputTargetDate) return;

    // Parse DOB
    const dobParts = inputDob.split("-");
    if (dobParts.length < 3) return;
    const birthDay = parseInt(dobParts[2], 10);
    const birthMonth = parseInt(dobParts[1], 10);

    const mulank = reduceToSingleDigit(birthDay);
    const dobDigits = inputDob.replace(/\D/g, "").split("").map(Number);
    const bhagyank = reduceToSingleDigit(dobDigits.reduce((a, b) => a + b, 0));

    // Parse Target Date
    const targetParts = inputTargetDate.split("-");
    if (targetParts.length < 3) return;
    const targetYear = parseInt(targetParts[0], 10);
    const targetMonth = parseInt(targetParts[1], 10);
    const targetDay = parseInt(targetParts[2], 10);

    // Universal Year Number (UYN)
    const uyn = reduceToSingleDigit(targetYear.toString().split("").map(Number).reduce((a, b) => a + b, 0));

    // Personal Year Number (PYN) = Birth Day + Birth Month + UYN
    const pyn = reduceToSingleDigit(reduceToSingleDigit(birthDay) + reduceToSingleDigit(birthMonth) + uyn);

    // Personal Month Number (PMN) = PYN + Target Month
    const pmn = reduceToSingleDigit(pyn + targetMonth);

    // Personal Day Number (PDN) = PMN + Target Day
    const pdn = reduceToSingleDigit(pmn + targetDay);

    const isFriendly = FRIENDLY_NUMBERS[mulank]?.includes(pdn);

    setPredictionData({
      mulank,
      bhagyank,
      uyn,
      pyn,
      pmn,
      pdn,
      isFriendly,
      dayInfo: PERSONAL_DAY_INFO[pdn],
      targetFormatted: new Date(inputTargetDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computeDailyForecast(name, dob, targetDate);
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
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-3 rounded-2xl shadow-md shadow-rose-200">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Daily Numerology & Personal Day Forecast
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Real-Time Daily Transit Vibrations, Lucky Actions & Personal Energy Clock
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
        <div className="max-w-xl mx-auto bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50">
          <h2 className="text-[18px] font-bold text-rose-955 text-center mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" /> Calculate Your Daily Numerology Forecast
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-1.5">
              <label className="text-[18px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" /> Target Prediction Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  if (dob) computeDailyForecast(name, dob, e.target.value);
                }}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium text-[18px]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 text-[18px] flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>Get Today's Personal Day Prediction</span>
            </button>
          </form>
        </div>

        {/* Prediction Results Output */}
        {predictionData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sun className="w-4 h-4 text-rose-300" /> Personal Day Forecast
                  </span>
                  <h2 className="text-2xl md:text-[30px] font-bold text-white">
                    {predictionData.targetFormatted}
                  </h2>
                  <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                    Calculated for <strong className="text-rose-200">{name || "Your Chart"}</strong> (Mulank {predictionData.mulank} & Bhagyank {predictionData.bhagyank}).
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                  <div className="text-center">
                    <span className="text-[14px] font-bold text-rose-200 uppercase block">Personal Day</span>
                    <span className="text-4xl font-black text-rose-300">{predictionData.pdn}</span>
                  </div>
                  <div className="text-center border-l border-white/20 pl-4">
                    <span className="text-[14px] font-bold text-rose-200 uppercase block">Ruling Planet</span>
                    <span className="text-lg font-extrabold text-white">{predictionData.dayInfo.planet}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Energy & Advice Card */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <span>{predictionData.dayInfo.icon}</span> Today's Core Vibration: {predictionData.dayInfo.title}
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Universal Year: <strong>{predictionData.uyn}</strong> | Personal Year: <strong>{predictionData.pyn}</strong> | Personal Month: <strong>{predictionData.pmn}</strong>
                  </p>
                </div>

                <span className={`text-[18px] font-extrabold px-4 py-1.5 rounded-full border ${
                  predictionData.isFriendly
                    ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                    : "bg-amber-100 text-amber-900 border-amber-200"
                }`}>
                  {predictionData.isFriendly ? "🌟 Highly Harmonious Day" : "⚖️ Moderate / Caution Day"}
                </span>
              </div>

              {/* Grid Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[18px]">
                
                {/* Description & Action Card */}
                <div className="p-6 bg-gradient-to-br from-rose-50/80 to-pink-50/40 rounded-2xl border border-rose-200 space-y-4">
                  <div>
                    <span className="font-extrabold text-rose-900 uppercase block mb-1">Daily Energy Overview:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{predictionData.dayInfo.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-rose-200/60 space-y-2">
                    <span className="font-extrabold text-emerald-900 uppercase block flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Best Action For Today:
                    </span>
                    <p className="text-slate-900 font-bold bg-white p-3 rounded-xl border border-emerald-200">{predictionData.dayInfo.action}</p>
                  </div>
                </div>

                {/* Avoid & Palette Card */}
                <div className="p-6 bg-white rounded-2xl border border-rose-200 space-y-4">
                  <div>
                    <span className="font-extrabold text-rose-900 uppercase block mb-1">Lucky Color Palette For Today:</span>
                    <p className="text-slate-900 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{predictionData.dayInfo.colors}</p>
                  </div>

                  <div className="pt-2 border-t border-rose-100 space-y-2">
                    <span className="font-extrabold text-rose-900 uppercase block flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> What To Avoid Today:
                    </span>
                    <p className="text-slate-900 font-bold bg-rose-50/80 p-3 rounded-xl border border-rose-200">{predictionData.dayInfo.avoid}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 9-Day Personal Day Reference Grid */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-[18px] font-bold text-slate-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" /> Complete 1 to 9 Personal Day Vibrations Guide
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(PERSONAL_DAY_INFO).map(([num, info]) => {
                  const isCurrent = parseInt(num, 10) === predictionData.pdn;
                  return (
                    <div
                      key={num}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300"
                          : "bg-rose-50/50 border-rose-100 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-black text-xl ${isCurrent ? "text-white" : "text-rose-600"}`}>Day {num} ({info.planet})</span>
                        <span className="text-lg">{info.icon}</span>
                      </div>
                      <h5 className={`font-extrabold text-xs mb-1 ${isCurrent ? "text-rose-100" : "text-slate-900"}`}>{info.title}</h5>
                      <p className={`text-[12px] font-medium leading-relaxed ${isCurrent ? "text-rose-50" : "text-slate-700"}`}>{info.action}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
