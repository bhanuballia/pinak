import React, { useState, useEffect } from "react";
import { Star, Calendar, User, ArrowLeft, RefreshCw, Sparkles, ShieldAlert, Award, Compass, Heart, Flame, CheckCircle, Lock, BookOpen, Key, Activity, Home, Search, Lightbulb, ThumbsUp, Shield, Sun, Check, Car, Zap } from "lucide-react";

// Chaldean Numerology Mapping
const CHALDEAN_MAP = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3,
  'H': 5, 'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
  'O': 7, 'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6,
  'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
};

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

const VEHICLE_FRIENDLY_NUMBERS = {
  1: [1, 2, 3, 5, 6, 9],
  2: [1, 2, 3, 7],
  3: [1, 3, 5, 7, 9],
  4: [1, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [1, 5, 6, 9],
  7: [1, 2, 3, 5, 7],
  8: [3, 5, 6],
  9: [1, 3, 5, 9]
};

const HOUSE_VIBRATIONS_INFO = {
  1: { planet: "Sun (Surya)", title: "Leadership & Independence", desc: "Fosters self-reliance, innovation, and leadership. Ideal for entrepreneurs and pioneers.", bestFor: "Entrepreneurs, Executives, Self-Employed", sampleHouses: "1, 10, 19, 28, 100, 109", material: "Brass, Copper, Rich Teak Wood", colors: "Gold, Warm Yellow, Deep Orange" },
  2: { planet: "Moon (Chandra)", title: "Harmony, Love & Peace", desc: "Encourages emotional bonding, tranquility, and warm relationships.", bestFor: "Families, Couples, Artists & Healers", sampleHouses: "2, 11, 20, 29, 101, 110", material: "White Marble, Acrylic, Frosted Glass", colors: "Pure White, Silver, Cream" },
  3: { planet: "Jupiter (Guru)", title: "Expansion, Learning & Joy", desc: "Vibrant energy for teaching, creative arts, spiritual growth, and social gatherings.", bestFor: "Teachers, Writers, Creative Professionals", sampleHouses: "3, 12, 21, 30, 102, 111", material: "Solid Teak Wood, Brass Inlay", colors: "Yellow, Gold, Warm Natural Wood" },
  4: { planet: "Rahu", title: "Discipline, Work & Structure", desc: "Focuses on hard work, routines, financial security, and solid foundations.", bestFor: "IT Professionals, Engineers, Accountants", sampleHouses: "4, 13, 22, 31, 103, 112", material: "Stainless Steel, Slate Stone", colors: "Metallic Grey, Silver, Charcoal" },
  5: { planet: "Mercury (Budh)", title: "Communication, Trading & Fun", desc: "Dynamic energy promoting trade, networking, frequent travel, and quick ideas.", bestFor: "Traders, Marketers, Travel Enthusiasts", sampleHouses: "5, 14, 23, 32, 104, 113", material: "Green Jade, Polished Wood, Acrylic", colors: "Emerald Green, Light Wood" },
  6: { planet: "Venus (Shukra)", title: "Luxury, Family & Comfort", desc: "Attracts domestic harmony, luxury lifestyle, aesthetics, and artistic comfort.", bestFor: "Families, Designers, Luxury Lifestyle", sampleHouses: "6, 15, 24, 33, 105, 114", material: "Silver, Polished Mirror, Crystal Glass", colors: "Metallic White, Rose Gold, Silver" },
  7: { planet: "Ketu", title: "Research, Meditation & Peace", desc: "Promotes deep introspection, spiritual practice, analytical research, and quiet study.", bestFor: "Researchers, Spiritual Seekers, Introverts", sampleHouses: "7, 16, 25, 34, 106, 115", material: "Matte Stone, White Marble, Ceramic", colors: "Off-White, Pearl, Metallic Grey" },
  8: { planet: "Saturn (Shani)", title: "Authority, Power & Wealth", desc: "Brings commercial authority, high management responsibility, and wealth through discipline.", bestFor: "Corporate Leaders, Investors, Legal Experts", sampleHouses: "8, 17, 26, 35, 107, 116", material: "Heavy Granite, Cast Iron, Dark Slate", colors: "Navy Blue, Bronze, Dark Charcoal" },
  9: { planet: "Mars (Mangal)", title: "Energy, Courage & Passion", desc: "Dynamic, high-energy environment encouraging action, fitness, and humanitarian work.", bestFor: "Doctors, Athletes, Social Reformers", sampleHouses: "9, 18, 27, 36, 108, 117", material: "Copper, Terracotta, Red Mahogany Wood", colors: "Deep Red, Copper Gold, Terracotta" }
};

const VEHICLE_VIBRATIONS_INFO = {
  1: { planet: "Sun (Surya)", title: "Prestige & Command", desc: "Drives executive presence, authority, and high command on the road. Best for business leaders and CEOs.", samplePlates: "0001, 1000, 1111, 1234 (Sum 10 -> 1)" },
  2: { planet: "Moon (Chandra)", title: "Gentle & Smooth Commute", desc: "Brings calm, peaceful driving and smooth family journeys. Requires disciplined speed.", samplePlates: "0002, 1100, 2000, 1010" },
  3: { planet: "Jupiter (Guru)", title: "Wisdom & Safe Long Journeys", desc: "Highly fortunate vibration for long highway tours, family protection, and safe travels.", samplePlates: "0003, 1200, 3000, 1110" },
  4: { planet: "Rahu", title: "Tech-Savvy & High Speed", desc: "Dynamic energy for electric vehicles (EVs) and sports cars. Needs regular routine maintenance.", samplePlates: "0004, 1300, 4000, 2200" },
  5: { planet: "Mercury (Budh)", title: "Commercial Agility & Speed", desc: "Best for commercial transport, daily office commutes, and sales travel. Very versatile.", samplePlates: "0005, 1400, 5000, 2300" },
  6: { planet: "Venus (Shukra)", title: "Ultimate Luxury & Smooth Ride", desc: "Most auspicious vibration for luxury cars, smooth travel, aesthetics, and accident protection.", samplePlates: "0006, 1500, 6000, 2400" },
  7: { planet: "Ketu", title: "Analytical & Solo Driving", desc: "Great for researchers, solo bike riders, and spiritual road trips.", samplePlates: "0007, 1600, 7000, 2500" },
  8: { planet: "Saturn (Shani)", title: "Heavy Duty & Long Endurance", desc: "Ideal for heavy transport trucks, commercial fleets, and rugged off-road vehicles.", samplePlates: "0008, 1700, 8000, 2600" },
  9: { planet: "Mars (Mangal)", title: "Power, Energy & Action", desc: "High kinetic energy for sports bikes and performance cars. Requires defensive driving.", samplePlates: "0009, 1800, 9000, 2700" }
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

function calculateHouseNumberVibration(houseStr) {
  if (!houseStr) return null;
  const clean = houseStr.trim().toUpperCase();
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/\d/.test(char)) {
      total += parseInt(char, 10);
    } else if (CHALDEAN_MAP[char]) {
      total += CHALDEAN_MAP[char];
    }
  }
  if (total === 0) return null;
  const single = reduceToSingleDigit(total);
  return { rawSum: total, singleDigit: single, info: HOUSE_VIBRATIONS_INFO[single] };
}

function calculateVehicleNumberVibration(vehStr) {
  if (!vehStr) return null;
  const clean = vehStr.trim().toUpperCase();
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (/\d/.test(char)) {
      total += parseInt(char, 10);
    } else if (CHALDEAN_MAP[char]) {
      total += CHALDEAN_MAP[char];
    }
  }
  if (total === 0) return null;
  const single = reduceToSingleDigit(total);
  return { rawSum: total, singleDigit: single, info: VEHICLE_VIBRATIONS_INFO[single] };
}

export default function PredictionNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mulank, setMulank] = useState(null);
  const [bhagyank, setBhagyank] = useState(null);
  const [gridSet, setGridSet] = useState(new Set());
  const [hasCalculated, setHasCalculated] = useState(false);

  // House Number Calculator States
  const [houseInput, setHouseInput] = useState("");
  const [houseResult, setHouseResult] = useState(null);

  // Vehicle Calculator States
  const [vehInput, setVehInput] = useState("");
  const [vehResult, setVehResult] = useState(null);

  // Custom Car Color State
  const [customCarColor, setCustomCarColor] = useState("");
  const [showCarRemedy, setShowCarRemedy] = useState(false);

  // Active Prediction Tab
  const [activePredictionTab, setActivePredictionTab] = useState('vehicle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computePredictions(urlName || "", urlDob);
    }
  }, []);

  const computePredictions = (inputName, inputDob) => {
    if (!inputDob) return;
    const parts = inputDob.split("-");
    if (parts.length < 3) return;

    const day = parseInt(parts[2], 10);
    const m = reduceToSingleDigit(day);

    const digits = inputDob.replace(/\D/g, "").split("").map(Number);
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const b = reduceToSingleDigit(sum);

    setMulank(m);
    setBhagyank(b);
    setGridSet(new Set(digits));
    setHasCalculated(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computePredictions(name, dob);
  };

  const handleAnalyzeHouse = () => {
    if (!houseInput.trim()) return;
    const res = calculateHouseNumberVibration(houseInput);
    setHouseResult(res);
  };

  const handleAnalyzeVehicle = () => {
    if (!vehInput.trim()) return;
    const res = calculateVehicleNumberVibration(vehInput);
    setVehResult(res);
  };

  // Generate Special Yogas List
  const yogaList = [];

  if (gridSet.has(4) && gridSet.has(5) && gridSet.has(6)) {
    yogaList.push({
      title: "Golden Raj Yoga (4 - 5 - 6)",
      type: "ROYAL",
      badge: "🌟 Auspicious",
      summary: "Complete Will Power & Financial Fortune Plane",
      desc: "Extremely lucky combination. Grants high wealth, authority, luxury cars, real estate, and extraordinary administrative success.",
      remedy: "Maintain high moral integrity and donate yellow/green items on Thursdays."
    });
  }

  if (gridSet.has(2) && gridSet.has(5) && gridSet.has(8)) {
    yogaList.push({
      title: "Silver Raj Yoga (2 - 5 - 8)",
      type: "ROYAL",
      badge: "💎 Property & Stability",
      summary: "Earth Element & Real Estate Dominance",
      desc: "Brings massive success in real estate, land acquisition, multi-property ownership, and long-term financial security.",
      remedy: "Keep a crystal quartz globe or rock salt lamp in the Northeast corner of your house."
    });
  }

  if ((gridSet.has(5) && gridSet.has(6) && gridSet.has(7)) || (gridSet.has(5) && gridSet.has(6) && (mulank === 7 || bhagyank === 7))) {
    yogaList.push({
      title: "Foreign Travel & Settlement Yoga (Pardesh Yoga)",
      type: "TRAVEL",
      badge: "✈️ International Luck",
      summary: "Global Commerce & Overseas Prosperity",
      desc: "Indicates strong planetary drive for foreign education, overseas business trips, international client deals, and permanent settlement abroad.",
      remedy: "Keep a silver metallic globe or model airplane in the Northwest zone (Number 6 direction)."
    });
  }

  if ((gridSet.has(2) && gridSet.has(4)) || (gridSet.has(2) && gridSet.has(8)) || (mulank === 2 && (bhagyank === 4 || bhagyank === 8)) || (mulank === 4 && bhagyank === 2)) {
    yogaList.push({
      title: "Vish Yoga (Poison / Mental Stress Combination)",
      type: "DOSHA",
      badge: "⚠️ Mental Vulnerability",
      summary: "Moon-Rahu / Moon-Saturn Emotional Conflict",
      desc: "Causes overthinking, mood volatility, emotional anxiety, or feeling misunderstood despite honest efforts.",
      remedy: "Offer water/milk to Shivling on Mondays, wear a natural Pearl or Rose Quartz, and avoid overthinking late at night."
    });
  }

  if ((gridSet.has(4) && gridSet.has(8)) && (!gridSet.has(5) || !gridSet.has(6))) {
    yogaList.push({
      title: "Bandhan Yoga (Restriction & Struggle Combination)",
      type: "DOSHA",
      badge: "🔒 Career Blockages",
      summary: "Rahu-Saturn Structural Constraint",
      desc: "Creates feeling of being trapped in unfulfilling jobs or sticky legal/contractual situations. Delays outcomes despite hard effort.",
      remedy: "Light a mustard oil lamp under a Peepal tree on Saturday evenings and chant 'Om Sham Shanaishcharaya Namah'."
    });
  }

  if (gridSet.has(3) && gridSet.has(5) && gridSet.has(7)) {
    yogaList.push({
      title: "Intuition & Mystical Yoga (3 - 5 - 7)",
      type: "SPIRITUAL",
      badge: "🔮 Sixth Sense",
      summary: "Emotional & Occult Mastery Plane",
      desc: "Bestows high intuitive gut feel, healing power, spiritual insight, and deep psychological empathy for others.",
      remedy: "Practice daily morning meditation and wear 5-Mukhi or 7-Mukhi Rudraksha."
    });
  }

  if (gridSet.has(4) && gridSet.has(3) && gridSet.has(8)) {
    yogaList.push({
      title: "Intellectual Genius Yoga (4 - 3 - 8)",
      type: "INTELLECT",
      badge: "🧠 Master Mind",
      summary: "Mental & Strategic Vision Plane",
      desc: "Exceptional analytical brain, visionary strategic planning, problem solving, and digital/academic sharpness.",
      remedy: "Engage in research, writing, or strategic advisory work."
    });
  }

  // Calculate Best House Numbers to Buy based on Mulank & Bhagyank
  const getRecommendedHouseNumbers = () => {
    if (!mulank) return { topPicks: [], secondaryPicks: [] };
    const mulFriendly = FRIENDLY_NUMBERS[mulank] || [];
    const bhagFriendly = FRIENDLY_NUMBERS[bhagyank] || [];

    // Intersection = Highest Priority (Best)
    const topPicks = mulFriendly.filter(n => bhagFriendly.includes(n));
    // Remaining Friendly
    const secondaryPicks = Array.from(new Set([...mulFriendly, ...bhagFriendly])).filter(n => !topPicks.includes(n));

    return { topPicks, secondaryPicks };
  };

  // Calculate Best Vehicle Numbers to Buy
  const getRecommendedVehicleNumbers = () => {
    if (!mulank) return { topPicks: [], secondaryPicks: [] };
    const mulFriendly = VEHICLE_FRIENDLY_NUMBERS[mulank] || [];
    const bhagFriendly = VEHICLE_FRIENDLY_NUMBERS[bhagyank] || [];

    const topPicks = mulFriendly.filter(n => bhagFriendly.includes(n));
    const secondaryPicks = Array.from(new Set([...mulFriendly, ...bhagFriendly])).filter(n => !topPicks.includes(n));

    return { topPicks, secondaryPicks };
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
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Vedic Special Yogas & Prediction Engine
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Dedicated planetary combinations, Raj Yogas, Foreign Travel, House & Vehicle Numerology
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
            <h2 className="text-[18px] font-bold text-rose-950 text-center mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" /> Enter Birth Details for Predictions
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
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
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
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Analyze Special Yogas
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
                <Star className="w-96 h-96 text-rose-200" />
              </div>
              <div className="relative z-10 max-w-3xl space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Star className="w-4 h-4 text-rose-300" /> Vedic Planetary Combinations
                </span>
                <h2 className="text-2xl md:text-[30px] font-bold text-white">
                  Car & Home Number Predictions
                </h2>
                <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                  Calculated for <strong className="text-rose-200">{name || "Birth Profile"}</strong> (DOB: {dob}). Mulank (Psychic) Number: <strong className="text-rose-200">{mulank}</strong> | Bhagyank (Destiny) Number: <strong className="text-rose-200">{bhagyank}</strong>.
                </p>
              </div>
            </div>


            {/* Toggle Switch */}
            <div className="flex justify-center my-6">
              <div className="bg-slate-100 p-1.5 rounded-full flex gap-2 shadow-inner border border-slate-200">
                <button
                  onClick={() => setActivePredictionTab('vehicle')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[18px] transition-all duration-300 ${activePredictionTab === 'vehicle' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Car className="w-5 h-5" /> Vehicle & License Plate Guide
                </button>
                <button
                  onClick={() => setActivePredictionTab('home')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[18px] transition-all duration-300 ${activePredictionTab === 'home' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Home className="w-5 h-5" /> House & Nameplate Guide
                </button>
              </div>
            </div>

            {/* Lucky Vehicle Number & Car Buying Guide Card */}
            {activePredictionTab === 'vehicle' && (() => {
              const { topPicks, secondaryPicks } = getRecommendedVehicleNumbers();
              return (
                <div className="bg-gradient-to-br from-blue-500/10 via-cyan-50 to-white border border-cyan-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-cyan-200/80 pb-4">
                    <div>
                      <h3 className="text-[18px] font-bold text-cyan-950 flex items-center gap-2">
                        <Car className="w-5 h-5 text-cyan-600" /> Lucky Vehicle & Car License Plate Guide
                      </h3>
                      <p className="text-[18px] text-slate-700 font-bold mt-1">
                        Personalized registration sum vibrations for <strong>{name || "Your Chart"}</strong> (Mulank {mulank} & Bhagyank {bhagyank}) for safety and smooth travel.
                      </p>
                    </div>
                    <span className="text-[18px] font-black text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
                      Kinetic Vibration Engine
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Lucky Vehicle Registration Number Analyzer Input */}
                    <div className="bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-2xl p-6 shadow-sm space-y-6 mb-8">
                      <div className="border-b border-cyan-100 pb-4">
                        <h3 className="text-[18px] font-bold text-rose-900 flex items-center gap-2 bg-indigo-300 border border-rose-200 px-6 py-2 rounded-full w-fit shadow-sm">
                          <Zap className="w-5 h-5 text-cyan-600" /> LICENSE PLATE & VEHICLE NUMBER ANALYZER
                        </h3>
                        <p className="text-[18px] text-black font-semibold mt-1">
                          Enter full license plate (e.g. MH 12 AB 3456) or 4-digit number (e.g. 3456) to check vibration.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={vehInput}
                          onChange={(e) => setVehInput(e.target.value)}
                          placeholder="e.g. MH 12 AB 3456 or 7890"
                          className="flex-1 px-4 py-3 bg-cyan-50/40 border border-cyan-900 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-cyan-500 text-[18px]"
                        />
                        <button
                          onClick={handleAnalyzeVehicle}
                          className="px-6 py-3 bg-yellow-300 hover:bg-cyan-800 text-black font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-[18px]"
                        >
                          <Search className="w-4 h-4" />
                          <span>Analyze Vehicle Energy</span>
                        </button>
                      </div>

                      {vehResult && (
                        <div className="p-6 bg-gradient-to-br from-cyan-50/80 via-blue-50/40 to-white rounded-2xl border border-cyan-200 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-100 pb-4">
                            <div>
                              <span className="text-[18px] font-extrabold text-slate-500 uppercase tracking-wider block">License Plate Number</span>
                              <span className="text-[18px] font-black text-cyan-950">{vehInput.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center bg-white px-4 py-2 rounded-2xl border border-cyan-200 shadow-2xs">
                                <span className="text-[18px] font-bold text-slate-400 uppercase block">Single Vibration</span>
                                <span className="text-[18px] font-black text-cyan-600">{vehResult.singleDigit}</span>
                              </div>
                              <div className="text-center bg-white px-4 py-2 rounded-2xl border border-cyan-200 shadow-2xs">
                                <span className="text-[18px] font-bold text-slate-400 uppercase block">Ruling Planet</span>
                                <span className="text-[18px] font-black text-slate-800">{vehResult.info.planet}</span>
                              </div>
                            </div>
                          </div>

                          {/* Compatibility Status Banner */}
                          {(() => {
                            const isMulFriendly = VEHICLE_FRIENDLY_NUMBERS[mulank]?.includes(vehResult.singleDigit);
                            const isBhagFriendly = VEHICLE_FRIENDLY_NUMBERS[bhagyank]?.includes(vehResult.singleDigit);

                            return (
                              <div className="space-y-4">
                                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isMulFriendly && isBhagFriendly
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                                  : isMulFriendly || isBhagFriendly
                                    ? "bg-amber-50 border-amber-200 text-amber-950"
                                    : "bg-rose-50 border-rose-200 text-rose-950"
                                  }`}>
                                  <CheckCircle className="w-6 h-6 shrink-0 text-cyan-600" />
                                  <div className="text-[18px] font-medium space-y-0.5">
                                    <span className="font-extrabold text-[18px] block">
                                      {isMulFriendly && isBhagFriendly
                                        ? "🌟 Highly Auspicious Vehicle Alignment!"
                                        : isMulFriendly || isBhagFriendly
                                          ? "⚖️ Good Harmonious Balance"
                                          : "⚠️ Challenging Vehicle Vibration Alignment"}
                                    </span>
                                    <p>
                                      Vehicle Number sum {vehResult.singleDigit} is{" "}
                                      {isMulFriendly ? <strong className="text-emerald-700">Harmonious with Psychic ({mulank})</strong> : "Neutral/Hostile with Psychic"}{" "}
                                      and{" "}
                                      {isBhagFriendly ? <strong className="text-emerald-700">Harmonious with Destiny ({bhagyank})</strong> : "Neutral/Hostile with Destiny"}.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div className="p-4 bg-white rounded-2xl border border-cyan-100 space-y-1">
                                    <span className="font-bold text-[18px] text-cyan-900 uppercase block">Vehicle Energy & Driving Traits:</span>
                                    <p className="text-slate-700 text-[18px] leading-relaxed font-semibold">{vehResult.info.desc}</p>
                                  </div>
                                  <div className="p-4 bg-white rounded-2xl border border-cyan-100 space-y-1">
                                    <span className="font-bold text-[18px] text-cyan-900 uppercase block">Sample Auspicious Plates:</span>
                                    <p className="text-slate-800 text-[18px] font-bold leading-relaxed">{vehResult.info.samplePlates}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Lucky Vehicle Colors Section */}
                    <div className="pb-6 mb-6 border-b border-cyan-100">
                      <span className="text-[18px] font-bold text-rose-900 uppercase tracking-wider block mb-4 bg-indigo-300 border border-rose-200 px-6 py-2 rounded-full w-fit shadow-sm">
                        🎨 Highly Recommended Vehicle Colors (Based on Mulank {mulank}):
                      </span>
                      <div className="flex flex-wrap gap-4">
                        {(() => {
                          const luckyColorsMap = {
                            1: [{ name: 'Golden Yellow', bg: 'bg-yellow-400', text: 'text-yellow-950' }, { name: 'Royal Orange', bg: 'bg-orange-500', text: 'text-white' }, { name: 'Copper Red', bg: 'bg-red-700', text: 'text-white' }],
                            2: [{ name: 'Pearl White', bg: 'bg-slate-50', text: 'text-slate-800 border-slate-200 border' }, { name: 'Silver Metallic', bg: 'bg-gray-300', text: 'text-gray-900 border-gray-400 border' }, { name: 'Light Blue', bg: 'bg-blue-200', text: 'text-blue-900 border-blue-300 border' }],
                            3: [{ name: 'Yellow', bg: 'bg-yellow-300', text: 'text-yellow-900' }, { name: 'Light Pink', bg: 'bg-pink-200', text: 'text-pink-900' }, { name: 'Golden', bg: 'bg-yellow-500', text: 'text-yellow-950' }],
                            4: [{ name: 'Metallic Grey', bg: 'bg-gray-400', text: 'text-gray-900' }, { name: 'Light Blue', bg: 'bg-blue-300', text: 'text-blue-900' }, { name: 'Silver Metallic', bg: 'bg-slate-300', text: 'text-slate-900' }],
                            5: [{ name: 'Emerald Green', bg: 'bg-emerald-500', text: 'text-white' }, { name: 'Pearl White', bg: 'bg-slate-50', text: 'text-slate-800 border-slate-200 border' }, { name: 'Light Brown', bg: 'bg-amber-700', text: 'text-white' }],
                            6: [{ name: 'Silver', bg: 'bg-gray-300', text: 'text-gray-900' }, { name: 'Luxurious White', bg: 'bg-slate-50', text: 'text-slate-800 border-slate-200 border' }, { name: 'Sky Blue', bg: 'bg-sky-300', text: 'text-sky-900' }],
                            7: [{ name: 'Light Green', bg: 'bg-green-200', text: 'text-green-900' }, { name: 'Pale Yellow', bg: 'bg-yellow-100', text: 'text-yellow-900' }, { name: 'Smokey Grey', bg: 'bg-gray-500', text: 'text-white' }],
                            8: [{ name: 'Midnight Black', bg: 'bg-zinc-900', text: 'text-white' }, { name: 'Dark Navy Blue', bg: 'bg-blue-900', text: 'text-white' }, { name: 'Steel Grey', bg: 'bg-slate-600', text: 'text-white' }],
                            9: [{ name: 'Racing Red', bg: 'bg-red-600', text: 'text-white' }, { name: 'Maroon', bg: 'bg-rose-900', text: 'text-white' }, { name: 'Metallic Copper', bg: 'bg-orange-800', text: 'text-white' }]
                          };
                          const colors = luckyColorsMap[mulank] || luckyColorsMap[1];
                          return colors.map((col, idx) => (
                            <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border border-transparent ${col.bg} ${col.text}`}>
                              <span className="font-bold text-[18px]">{col.name}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Custom Color Remedy Section */}
                    <div className="pb-6 mb-6 border-b border-cyan-100 space-y-4">
                      <span className="text-[18px] font-bold text-slate-700 block">
                        Didn't find your desired color? Check remedies for other colors:
                      </span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={customCarColor}
                          onChange={(e) => {
                            setCustomCarColor(e.target.value);
                            setShowCarRemedy(false);
                          }}
                          className="flex-1 px-4 py-3 bg-white border border-cyan-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-cyan-500 text-[16px]"
                        >
                          <option value="">Select your desired car color...</option>
                          <option value="Black">Black</option>
                          <option value="White">White</option>
                          <option value="Silver">Silver</option>
                          <option value="Red">Red</option>
                          <option value="Blue">Blue</option>
                          <option value="Grey">Grey</option>
                          <option value="Yellow">Yellow</option>
                          <option value="Green">Green</option>
                          <option value="Brown">Brown</option>
                        </select>
                        <button
                          onClick={() => {
                            if (customCarColor) setShowCarRemedy(true);
                          }}
                          className="px-6 py-3 bg-yellow-300 hover:bg-cyan-200 text-cyan-900 font-bold rounded-2xl transition-all border border-cyan-300 flex items-center justify-center gap-2 text-[16px]"
                        >
                          <Search className="w-4 h-4" />
                          <span>Check Remedy</span>
                        </button>
                      </div>

                      {showCarRemedy && customCarColor && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in duration-300">
                          <h4 className="text-[18px] font-bold text-amber-900 flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-amber-600" /> Protective Remedy for {customCarColor} Car
                          </h4>
                          <p className="text-[16px] text-amber-950 font-medium leading-relaxed">
                            {(() => {
                              const remedies = {
                                'Black': 'Black (Saturn): Tie a black or dark blue thread on the steering column, and keep a small piece of iron or a horseshoe in the trunk to absorb heavy energies.',
                                'White': 'White (Moon/Venus): Keep a small silver coin or a white crystal (like Clear Quartz or Moonstone) in the dashboard for emotional balance and safe travels.',
                                'Silver': 'Silver (Moon/Rahu): Place a small silver pyramid or a metallic wind chime inside the car to deflect sudden negative impacts.',
                                'Red': 'Red (Mars): Tie a red thread on the steering wheel or keep a small copper coin/yantra in the glove box to calm aggressive driving energy.',
                                'Blue': 'Blue (Saturn/Rahu): Keep a blue evil eye (Nazar Battu) hanging from the rearview mirror to ward off jealousy and protect from accidents.',
                                'Grey': 'Grey (Rahu/Ketu): Keep a small piece of sandalwood or a wooden rudraksha hanging in the car to bring grounding and focus while driving.',
                                'Yellow': 'Yellow (Jupiter): Keep a yellow cloth or a small brass yantra in the dashboard. Avoid driving on an empty stomach on Thursdays.',
                                'Green': 'Green (Mercury): Keep a small green plant (like a lucky bamboo in a spill-proof container) or a green jade crystal in the car to maintain focus and agility.',
                                'Brown': 'Brown (Rahu): Place a small grounding stone like Tiger\'s Eye or Black Tourmaline in the car to keep you grounded and avoid rash decisions.'
                              };
                              return remedies[customCarColor] || 'Keep your vehicle clean, perform regular servicing, and always keep a small clear quartz crystal in the glove compartment for overall protection and positive energy.';
                            })()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[18px] font-extrabold text-cyan-950 uppercase tracking-wider block mb-2">
                        🚗 Top Lucky License Plate Vibrations (Dual Compatibility):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {topPicks.map((num) => {
                          const info = VEHICLE_VIBRATIONS_INFO[num];
                          return (
                            <div key={num} className="p-4 bg-white rounded-2xl border border-cyan-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[18px] font-black text-cyan-700">Vehicle Sum {num}</span>
                                <span className="text-[18px] font-bold text-slate-500 bg-cyan-50 px-2 py-0.5 rounded-full">{info.planet}</span>
                              </div>
                              <h5 className="font-extrabold text-slate-900 text-[18px]">{info.title}</h5>
                              <p className="text-[18px] text-slate-600 font-semibold">{info.desc}</p>
                              <div className="pt-1 text-[18px] font-bold text-cyan-900 border-t border-cyan-100">
                                <strong>Sample Plates (4-digit):</strong> {info.samplePlates}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {secondaryPicks.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[18px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                          🏎️ Secondary Good License Plate Options:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {secondaryPicks.map((num) => (
                            <span key={num} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[18px] font-bold text-slate-800 shadow-2xs">
                              Sum {num} ({VEHICLE_VIBRATIONS_INFO[num]?.planet})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}


                  </div>
                </div>
              );
            })()}

            {/* Lucky House Recommendation & Buyer's Guide Card */}
            {activePredictionTab === 'home' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {(() => {
              const { topPicks, secondaryPicks } = getRecommendedHouseNumbers();
              return (
                <div className="bg-gradient-to-br from-amber-500/10 via-rose-50 to-white border border-amber-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-4">
                    <div>
                      <h3 className="text-[18px] font-bold text-amber-950 flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-amber-600" /> House Buying Guide: Which House Number to Choose?
                      </h3>
                      <p className="text-[18px] text-slate-700 font-bold mt-1">
                        Personalized house sum vibrations for <strong>{name || "Your Chart"}</strong> (Mulank {mulank} & Bhagyank {bhagyank}) to ensure prosperity and peace.
                      </p>
                    </div>
                    <span className="text-[18px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      Buyer's Choice Guide
                    </span>
                  </div>

                  {/* Recommended Numbers Grid */}
                  <div className="space-y-4">
                    {/* Lucky House Number Calculator Card */}
                    <div className="bg-white/80 backdrop-blur-sm border border-rose-200 rounded-2xl p-6 shadow-sm space-y-6 mb-8">
                      <div className="border-b border-rose-100 pb-4">
                        <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                          <Home className="w-5 h-5 text-rose-600" /> Lucky House & Flat Number Analyzer
                        </h3>
                        <p className="text-[18px] text-slate-600 font-semibold mt-1">
                          Evaluates home address vibrations against your Psychic Mulank ({mulank}) & Destiny Bhagyank ({bhagyank}) numbers using Chaldean Numerology.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={houseInput}
                          onChange={(e) => setHouseInput(e.target.value)}
                          placeholder="e.g. 42, Flat 1204, or 302-B"
                          className="flex-1 px-4 py-3 bg-rose-50/50 border border-rose-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-rose-500 text-[18px]"
                        />
                        <button
                          onClick={handleAnalyzeHouse}
                          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-[18px]"
                        >
                          <Search className="w-4 h-4" />
                          <span>Analyze House Energy</span>
                        </button>
                      </div>

                      {houseResult && (
                        <div className="p-6 bg-gradient-to-br from-rose-50/80 via-pink-50/40 to-white rounded-2xl border border-rose-200 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rose-100 pb-4">
                            <div>
                              <span className="text-[18px] font-extrabold text-slate-500 uppercase tracking-wider block">House / Flat Address</span>
                              <span className="text-[18px] font-black text-rose-950">{houseInput.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center bg-white px-4 py-2 rounded-2xl border border-rose-200 shadow-2xs">
                                <span className="text-[18px] font-bold text-slate-400 uppercase block">Single Vibration</span>
                                <span className="text-[18px] font-black text-rose-600">{houseResult.singleDigit}</span>
                              </div>
                              <div className="text-center bg-white px-4 py-2 rounded-2xl border border-rose-200 shadow-2xs">
                                <span className="text-[18px] font-bold text-slate-400 uppercase block">Ruling Planet</span>
                                <span className="text-[18px] font-black text-slate-800">{houseResult.info.planet}</span>
                              </div>
                            </div>
                          </div>

                          {/* Compatibility Status Banner */}
                          {(() => {
                            const isMulFriendly = FRIENDLY_NUMBERS[mulank]?.includes(houseResult.singleDigit);
                            const isBhagFriendly = FRIENDLY_NUMBERS[bhagyank]?.includes(houseResult.singleDigit);

                            return (
                              <div className="space-y-4">
                                <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isMulFriendly && isBhagFriendly
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                                  : isMulFriendly || isBhagFriendly
                                    ? "bg-amber-50 border-amber-200 text-amber-950"
                                    : "bg-rose-50 border-rose-200 text-rose-950"
                                  }`}>
                                  <CheckCircle className="w-6 h-6 shrink-0 text-rose-600" />
                                  <div className="text-[18px] font-medium space-y-0.5">
                                    <span className="font-extrabold text-[18px] block">
                                      {isMulFriendly && isBhagFriendly
                                        ? "🌟 Highly Auspicious House Alignment!"
                                        : isMulFriendly || isBhagFriendly
                                          ? "⚖️ Good Harmonious Balance"
                                          : "⚠️ Challenging Vibration Alignment"}
                                    </span>
                                    <p>
                                      House Number sum {houseResult.singleDigit} is{" "}
                                      {isMulFriendly ? <strong className="text-emerald-700">Harmonious with Psychic ({mulank})</strong> : "Neutral/Hostile with Psychic"}{" "}
                                      and{" "}
                                      {isBhagFriendly ? <strong className="text-emerald-700">Harmonious with Destiny ({bhagyank})</strong> : "Neutral/Hostile with Destiny"}.
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div className="p-4 bg-white rounded-2xl border border-rose-100 space-y-1">
                                    <span className="font-bold text-[18px] text-rose-900 uppercase block">Core Atmosphere & Energy:</span>
                                    <p className="text-slate-700 text-[18px] leading-relaxed font-semibold">{houseResult.info.desc}</p>
                                  </div>
                                  <div className="p-4 bg-white rounded-2xl border border-rose-100 space-y-1">
                                    <span className="font-bold text-[18px] text-rose-900 uppercase block">Best Suited For:</span>
                                    <p className="text-slate-800 text-[18px] font-bold leading-relaxed">{houseResult.info.bestFor}</p>
                                  </div>
                                </div>

                                {/* Structural & Decor Enhancements */}
                                <div className="pt-6 mt-4 border-t border-rose-100">
                                  <h4 className="text-[18px] font-bold text-slate-900 mb-4">
                                    Structural & Decor Enhancements (Based on Single-Digit House Vibration):
                                  </h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    {[
                                      { num: 1, vibe: "Independence & Ambition", decor: "Keep lighting bright; use bold accent pieces; great for solo dwellers or entrepreneurs." },
                                      { num: 2, vibe: "Harmony & Cooperation", decor: "Use soft textures, pairs of items (like two identical vases), and warm colors to foster relationships." },
                                      { num: 3, vibe: "Creativity & Expression", decor: "Create an entertainment space; use vibrant colors; display art and books." },
                                      { num: 4, vibe: "Stability & Grounding", decor: "Incorporate wooden furniture, plants, and earthy tones; keep structure and organization high." },
                                      { num: 5, vibe: "Change & Adventure", decor: "Keep spaces open and uncluttered; use travel decor; ensure plenty of windows and airflow." },
                                      { num: 6, vibe: "Family & Nurturing", decor: "Focus on a large dining table, comfortable seating, and family photos; ideal for nesting." },
                                      { num: 7, vibe: "Spirituality & Reflection", decor: "Set up a quiet reading or meditation nook; use cool colors like blue or green; limit chaotic tech." },
                                      { num: 8, vibe: "Abundance & Power", decor: "Use high-quality materials; keep the entrance pristine to invite wealth; balance luxury with tidiness." },
                                      { num: 9, vibe: "Universal Love & Healing", decor: "Incorporate eco-friendly materials, community spaces, and neutral, welcoming tones." },
                                    ].filter(item => item.num === houseResult.singleDigit).map((item, i) => (
                                      <div key={i} className="p-5 bg-rose-50 rounded-2xl border border-rose-200 shadow-sm space-y-3 animate-in fade-in">
                                        <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
                                          <span className="w-10 h-10 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-[18px] shrink-0 shadow-md">
                                            {item.num}
                                          </span>
                                          <span className="font-black text-[18px] text-rose-950 leading-tight">{item.vibe}</span>
                                        </div>
                                        <p className="text-[16px] text-slate-800 font-bold leading-relaxed">
                                          {item.decor}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[18px] font-extrabold text-amber-900 uppercase tracking-wider block mb-2">
                        🌟 Top Recommended House Vibrations (Perfect Dual Synergy):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {topPicks.map((num) => {
                          const info = HOUSE_VIBRATIONS_INFO[num];
                          return (
                            <div key={num} className="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[18px] font-black text-amber-600">House Sum {num}</span>
                                <span className="text-[18px] font-bold text-slate-500 bg-amber-50 px-2 py-0.5 rounded-full">{info.planet}</span>
                              </div>
                              <h5 className="font-extrabold text-slate-900 text-[18px]">{info.title}</h5>
                              <p className="text-[18px] text-slate-600 font-semibold">{info.desc}</p>
                              <div className="pt-1 text-[18px] font-bold text-amber-800 border-t border-amber-100">
                                <strong>Sample House/Flat Nos:</strong> {info.sampleHouses}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {secondaryPicks.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[18px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                          👍 Secondary Good Options (Compatible Balance):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {secondaryPicks.map((num) => (
                            <span key={num} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[18px] font-bold text-slate-800 shadow-2xs">
                              Sum {num} ({HOUSE_VIBRATIONS_INFO[num]?.planet})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Lucky House Nameplate Guide Card */}
            <div className="bg-white border border-purple-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-purple-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-purple-950 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" /> House Nameplate Vastu & Numerology Guide
                  </h3>
                  <p className="text-[18px] text-purple-800 font-bold mt-1">
                    Selecting the auspicious material, color, and Chaldean spelling sum for your main door entrance nameplate.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-200">
                  Entrance Prana Shield
                </span>
              </div>

              {/* Recommended Nameplate Material Grid */}
              <div className="space-y-4">
                <h4 className="text-[18px] font-bold text-slate-900">
                  Material & Color Selection Matched to House Vibration:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { sums: [1, 9], title: "Fire Element (Sum 1 & 9)", planet: "Sun / Mars", material: "Brass, Copper, Rich Teak Wood", colors: "Gold, Warm Yellow, Deep Orange, Red", icon: "🔥" },
                    { sums: [2, 7], title: "Water Element (Sum 2 & 7)", planet: "Moon / Ketu", material: "White Marble, Acrylic, Frosted Glass", colors: "Pure White, Silver, Cream, Off-White", icon: "💧" },
                    { sums: [3, 5], title: "Wood Element (Sum 3 & 5)", planet: "Jupiter / Mercury", material: "Solid Teak Wood, Green Jade, Acrylic", colors: "Yellow, Gold, Emerald Green, Light Wood", icon: "🌿" },
                    { sums: [6], title: "Metal / Luxury (Sum 6)", planet: "Venus (Shukra)", material: "Silver, Mirror Finish, Crystal Glass", colors: "Metallic White, Rose Gold, Bright Silver", icon: "💎" },
                    { sums: [4, 8], title: "Earth / Metal (Sum 4 & 8)", planet: "Rahu / Saturn", material: "Stainless Steel, Slate Stone, Cast Iron", colors: "Metallic Grey, Silver, Dark Slate, Charcoal", icon: "🪨" },
                  ]
                  .filter(mat => !houseResult || mat.sums.includes(houseResult.singleDigit))
                  .map((mat, i) => (
                    <div key={i} className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[18px] font-bold text-purple-900">{mat.icon} {mat.title}</span>
                        <span className="text-[14px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-purple-100">{mat.planet}</span>
                      </div>
                      <p className="text-[16px] text-slate-800 font-bold"><strong>Ideal Materials:</strong> {mat.material}</p>
                      <p className="text-[16px] text-slate-700 font-semibold"><strong>Favourable Palette:</strong> {mat.colors}</p>
                    </div>
                  ))}
                </div>

                {/* 3 Essential Nameplate Rules */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                    <h5 className="font-bold text-[18px] text-amber-950 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-600" /> 1. Door Illumination
                    </h5>
                    <p className="text-[16px] text-slate-800 font-medium leading-relaxed">
                      Place a warm light directly above the nameplate. Light activates Sun (Surya) energy for fame, career growth, and success.
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                    <h5 className="font-bold text-[18px] text-emerald-950 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> 2. Chaldean Name Sum
                    </h5>
                    <p className="text-[16px] text-slate-800 font-medium leading-relaxed">
                      Ensure the Chaldean sum of written name (e.g. "SHARMA HOUSE") reduces to fortunate digits 1, 3, 5, or 6.
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1">
                    <h5 className="font-bold text-[18px] text-rose-950 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> 3. Protection Symbols
                    </h5>
                    <p className="text-[16px] text-slate-800 font-medium leading-relaxed">
                      Incorporate auspicious Swastik, Om, or Kalash icons at the top corners to shield against negative entrance Nazar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
            )}
          </div>
        )}



        {/* Recalculate Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setHasCalculated(false)}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 text-[18px]"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Analyze Another Date of Birth</span>
          </button>
        </div>
      </div>

    </div>

  );
}
