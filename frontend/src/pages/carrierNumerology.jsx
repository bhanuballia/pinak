import React, { useState, useEffect } from "react";
import { Briefcase, Calendar, User, ArrowLeft, RefreshCw, Sparkles, TrendingUp, Award, Building, DollarSign, Compass, Sun, Zap, CheckCircle, ShieldAlert } from "lucide-react";

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

// Full Master Career Matrix (1 to 9)
const CAREER_MATRIX = {
  1: {
    planet: "Sun (Surya)",
    archetype: "The Executive Commander & Entrepreneur",
    sectors: "Government Services, Civil Administration, Politics, CEO/C-Suite Leadership, Real Estate Development, Solar Energy.",
    workStyle: "Independent command, high ownership, visionary leadership. Dislikes micromanagement.",
    peakYears: "Personal Years 1, 3, 5, 8",
    badgeBg: "bg-amber-500 text-white"
  },
  2: {
    planet: "Moon (Chandra)",
    archetype: "The Diplomat, Mediator & Caregiver",
    sectors: "Psychology & Counseling, Healthcare/Nursing, Dairy & Beverage Industry, Arts & Design, HR Management, Hospitality.",
    workStyle: "Collaborative, intuitive, empathetic. Thrives in supportive teamwork environments.",
    peakYears: "Personal Years 2, 3, 6, 7",
    badgeBg: "bg-pink-500 text-white"
  },
  3: {
    planet: "Guru (Jupiter)",
    archetype: "The Strategic Counselor & Academic Sage",
    sectors: "Higher Education, Law & Judiciary, Banking & Corporate Finance, Publishing, Mentorship, Religious/Spiritual Advisory.",
    workStyle: "Knowledge-driven, ethical, growth-focused. Excellent at training and public advising.",
    peakYears: "Personal Years 3, 5, 6, 9",
    badgeBg: "bg-yellow-500 text-slate-900"
  },
  4: {
    planet: "Rahu",
    archetype: "The Digital Architect & Technology Pioneer",
    sectors: "Software Engineering, AI & Machine Learning, Data Analytics, Media Production, Aviation, Electronics & Robotics.",
    workStyle: "Unconventional problem-solver, structured tech builder. Loves out-of-the-box digital innovation.",
    peakYears: "Personal Years 4, 5, 6, 8",
    badgeBg: "bg-indigo-600 text-white"
  },
  5: {
    planet: "Budh (Mercury)",
    archetype: "The Agility Trader & Master Communicator",
    sectors: "Stock Trading & Brokerage, E-commerce, Marketing & PR, Journalism, Sales & Business Development, Accounting.",
    workStyle: "Fast-paced, versatile, high speed. Thrives on rapid transactions and dynamic networking.",
    peakYears: "Personal Years 1, 3, 5, 6",
    badgeBg: "bg-emerald-600 text-white"
  },
  6: {
    planet: "Venus (Shukra)",
    archetype: "The Luxury Stylist & Commercial Creator",
    sectors: "Fashion Design, Luxury Retail, Entertainment & Cinema, Hotel & Tourism, Interior Decoration, Fine Arts & Cosmetics.",
    workStyle: "Aesthetic, detail-oriented, luxury-focused. Builds premium high-value brands.",
    peakYears: "Personal Years 6, 3, 2, 5",
    badgeBg: "bg-purple-600 text-white"
  },
  7: {
    planet: "Ketu",
    archetype: "The Deep Investigator & Occult Researcher",
    sectors: "Research Science, Data Security, Astrology/Numerology, Pharmaceuticals, Spiritual Teaching, Forensic Investigation.",
    workStyle: "Introspective, highly analytical, sharp intuition. Prefers quiet deep research roles.",
    peakYears: "Personal Years 7, 2, 3, 5",
    badgeBg: "bg-slate-700 text-white"
  },
  8: {
    planet: "Saturn (Shani)",
    archetype: "The Heavy Corporate Administrator & Builder",
    sectors: "Corporate Law, Real Estate Infrastructure, Mining & Metals, Manufacturing, Heavy Machinery, Logistics & Supply Chain.",
    workStyle: "Pragmatic, disciplined, highly enduring. Builds long-term commercial empires step-by-step.",
    peakYears: "Personal Years 8, 1, 3, 5",
    badgeBg: "bg-blue-800 text-white"
  },
  9: {
    planet: "Mangal (Mars)",
    archetype: "The Action Commander & Technical Specialist",
    sectors: "Military & Defense, Police Services, Surgery & Medicine, Professional Sports, Civil Construction, Real Estate Development.",
    workStyle: "Courageous, physical execution, high energy. Thrives under pressure and direct action.",
    peakYears: "Personal Years 9, 1, 3, 5",
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

export default function CarrierNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mulank, setMulank] = useState(null);
  const [bhagyank, setBhagyank] = useState(null);
  const [pyn, setPyn] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computeCareerPrediction(urlName || "", urlDob);
    }
  }, []);

  const computeCareerPrediction = (inputName, inputDob) => {
    if (!inputDob) return;
    const parts = inputDob.split("-");
    if (parts.length < 3) return;

    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const m = reduceToSingleDigit(day);

    const digits = inputDob.replace(/\D/g, "").split("").map(Number);
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const b = reduceToSingleDigit(sum);

    // Personal Year Calculation
    const currY = new Date().getFullYear();
    const uyn = reduceToSingleDigit(currY.toString().split("").map(Number).reduce((acc, d) => acc + d, 0));
    const pYear = reduceToSingleDigit(m + reduceToSingleDigit(month) + uyn);

    setMulank(m);
    setBhagyank(b);
    setPyn(pYear);
    setCurrentYear(currY);
    setHasCalculated(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computeCareerPrediction(name, dob);
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md shadow-blue-200">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Vedic Career & Wealth Prediction Numerology
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Professional Sectors, Executive Work Style, Business Growth & Career Timing
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        {!hasCalculated ? (
          <div className="max-w-md mx-auto bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50">
            <h2 className="text-[18px] font-bold text-rose-955 text-center mb-6 flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Calculate Your Career Matrix
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
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 text-[18px]"
              >
                Analyze Career & Wealth Profile
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-blue-300" /> Professional Career Analysis
                </span>
                <h2 className="text-2xl md:text-[30px] font-bold text-white">
                  Career Destiny & Wealth Sector Diagnostics
                </h2>
                <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                  Calculated for <strong className="text-blue-200">{name || "Professional Profile"}</strong> (DOB: {dob}). Mulank (Talent Driver): <strong className="text-blue-200">{mulank}</strong> | Bhagyank (Destiny Sector): <strong className="text-blue-200">{bhagyank}</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-[18px]">
                  <span className="font-bold text-blue-300">Current Career Transit ({currentYear}):</span>
                  <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white font-extrabold">
                    Personal Year {pyn} ({PLANET_NAMES[pyn]})
                  </span>
                </div>
              </div>
            </div>

            {/* Core Driver Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Mulank Work Style Card */}
              {(() => {
                const info = CAREER_MATRIX[mulank];
                return (
                  <div className="bg-white border border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Primary Work Style Driver</span>
                        <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" /> Mulank {mulank}: {info.archetype}
                        </h3>
                      </div>
                      <span className={`text-[18px] font-bold px-3 py-1 rounded-full ${info.badgeBg}`}>{info.planet}</span>
                    </div>

                    <div className="space-y-3 text-[18px]">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                        <span className="font-bold text-blue-900 uppercase block">Natural Executive Work Style:</span>
                        <p className="text-slate-800 leading-relaxed font-semibold">{info.workStyle}</p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-blue-100 space-y-1">
                        <span className="font-extrabold text-blue-900 uppercase block">Best Ideal Business & Job Sectors:</span>
                        <p className="text-slate-900 font-bold leading-relaxed">{info.sectors}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Bhagyank Career Destiny Card */}
              {(() => {
                const info = CAREER_MATRIX[bhagyank];
                return (
                  <div className="bg-white border border-indigo-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ultimate Wealth & Destiny Sector</span>
                        <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                          <Building className="w-5 h-5 text-indigo-600" /> Bhagyank {bhagyank}: {info.archetype}
                        </h3>
                      </div>
                      <span className={`text-[18px] font-bold px-3 py-1 rounded-full ${info.badgeBg}`}>{info.planet}</span>
                    </div>

                    <div className="space-y-3 text-[18px]">
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1">
                        <span className="font-extrabold text-indigo-900 uppercase block">Destiny Career Sectors:</span>
                        <p className="text-slate-900 font-bold leading-relaxed">{info.sectors}</p>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                        <span className="font-bold text-emerald-900 uppercase block">Career Promotion & Growth Years:</span>
                        <p className="text-slate-900 font-bold text-[18px">{info.peakYears}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Complete 1 to 9 Career Master Matrix */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" /> Complete 1 to 9 Career & Professional Sectors Matrix
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Reference matrix for ideal job roles, business sectors, and peak growth years for all 9 numbers.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
                  Career Master Grid
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(CAREER_MATRIX).map(([num, info]) => (
                  <div key={num} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                        <span className="font-black text-rose-955 text-[18px]">Number {num} ({info.planet})</span>
                        <span className={`text-[18px] font-bold px-2.5 py-0.5 rounded-full ${info.badgeBg}`}>{info.peakYears}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-[18px]">{info.archetype}</h5>
                      <p className="text-[18px] font-bold text-slate-900"><strong>Sectors:</strong> {info.sectors}</p>
                      <p className="text-[18px] text-slate-700 font-semibold leading-relaxed"><strong>Style:</strong> {info.workStyle}</p>
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
