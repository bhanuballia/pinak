import React, { useState, useEffect } from "react";
import { Star, Calendar, User, ArrowLeft, RefreshCw, Sparkles, Activity, ShieldAlert, Heart, Eye, Brain, Sun, Gem, AlertTriangle, CheckCircle, Flame, Droplets, Wind, Shield } from "lucide-react";

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

// Medical Numerology Body Organs & Health Data (1 to 9)
const MEDICAL_NUMEROLOGY_MATRIX = {
  1: {
    planet: "Sun (Surya)",
    dosha: "Pitta (Fire)",
    organs: "Heart, Eyes, Bones, Spine, Blood Circulation",
    vulnerabilities: "High blood pressure, heart palpitation, eye strain, sunstroke, weak bone density",
    herbalRemedy: "Cinnamon, Ginger, Tulsi water, Warm Solarized water",
    crystal: "Ruby, Sunstone, Pyrite",
    badge: "bg-amber-500 text-white"
  },
  2: {
    planet: "Moon (Chandra)",
    dosha: "Kapha / Vata (Water)",
    organs: "Mind, Stomach, Lungs, Fluids, Lymphatic System",
    vulnerabilities: "Mood volatility, emotional anxiety, insomnia, stomach acidity, water retention",
    herbalRemedy: "Milk with Cardamom, Ashwagandha, Chamomile tea",
    crystal: "Moonstone, Rose Quartz, Natural Pearl",
    badge: "bg-pink-500 text-white"
  },
  3: {
    planet: "Guru (Jupiter)",
    dosha: "Kapha (Fat/Ether)",
    organs: "Liver, Thighs, Arteries, Pancreas, Fat Tissue",
    vulnerabilities: "Liver congestion, diabetes, high cholesterol, weight gain, arterial blockage",
    herbalRemedy: "Turmeric milk, Haritaki, Amla, Dandelion tea",
    crystal: "Yellow Topaz, Citrine, Yellow Sapphire",
    badge: "bg-yellow-500 text-slate-900"
  },
  4: {
    planet: "Rahu",
    dosha: "Vata (Air/Shadow)",
    organs: "Nervous System, Respiratory Tract, Skin, Intestines",
    vulnerabilities: "Unexplained phobias, respiratory allergies, sudden skin rashes, insomnia",
    herbalRemedy: "Gotu Kola, Shankhpushpi, Eucalyptus steam",
    crystal: "Hessonite (Gomed), Tiger's Eye",
    badge: "bg-indigo-600 text-white"
  },
  5: {
    planet: "Budh (Mercury)",
    dosha: "Vata / Pitta (Air)",
    organs: "Nervous System, Brain, Hands, Speech, Lungs",
    vulnerabilities: "Nerve exhaustion, anxiety spikes, speech stuttering, indigestion, skin allergies",
    herbalRemedy: "Brahmi, Shankhpushpi, Mint tea, Tulsi",
    crystal: "Green Emerald, Green Aventurine",
    badge: "bg-emerald-600 text-white"
  },
  6: {
    planet: "Venus (Shukra)",
    dosha: "Kapha / Vata (Water)",
    organs: "Kidneys, Throat, Hormones, Reproductive System",
    vulnerabilities: "Kidney stones, throat infections, hormonal imbalance, urinary tract issues",
    herbalRemedy: "Shatavari, Rosewater, Licorice tea",
    crystal: "Diamond, Clear Quartz, Opal, Selenite",
    badge: "bg-purple-600 text-white"
  },
  7: {
    planet: "Ketu",
    dosha: "Vata (Spiritual/Shadow)",
    organs: "Spine, Lower Abdomen, Epidermis, Pineal Gland",
    vulnerabilities: "Mysterious un-diagnosed ailments, gut issues, spinal stiffness, skin allergies",
    herbalRemedy: "Triphala, Giloy, Neem leaves, Holy Basil",
    crystal: "Cat's Eye (Lahsuniya), Smokey Quartz",
    badge: "bg-slate-700 text-white"
  },
  8: {
    planet: "Saturn (Shani)",
    dosha: "Vata (Cold Earth)",
    organs: "Teeth, Joint Bones, Knees, Hair, Chronic System",
    vulnerabilities: "Joint pain, arthritis, calcium deficiency, weak teeth, chronic constipation",
    herbalRemedy: "Sesame oil massage, Guggulu, Castor oil, Triphala",
    crystal: "Amethyst, Black Tourmaline, Blue Sapphire",
    badge: "bg-blue-800 text-white"
  },
  9: {
    planet: "Mangal (Mars)",
    dosha: "Pitta (High Fire)",
    organs: "Blood, Muscles, Bone Marrow, Head, Hemoglobin",
    vulnerabilities: "High fevers, blood pressure spikes, muscle inflammation, burns, injuries",
    herbalRemedy: "Aloe Vera juice, Beetroot, Coriander water, Sandalwood paste",
    crystal: "Red Coral, Carnelian, Red Jasper",
    badge: "bg-rose-600 text-white"
  }
};

function reduceToSingleDigit(num) {
  let temp = num;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

export default function MedicalNumerology() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mulank, setMulank] = useState(null);
  const [bhagyank, setBhagyank] = useState(null);
  const [presentCounts, setPresentCounts] = useState({});
  const [missingNumbers, setMissingNumbers] = useState([]);
  const [excessNumbers, setExcessNumbers] = useState([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date") || params.get("dob");

    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      computeMedicalDiagnosis(urlName || "", urlDob);
    }
  }, []);

  const computeMedicalDiagnosis = (inputName, inputDob) => {
    if (!inputDob) return;
    const parts = inputDob.split("-");
    if (parts.length < 3) return;

    const day = parseInt(parts[2], 10);
    const m = reduceToSingleDigit(day);

    const digits = inputDob.replace(/\D/g, "").split("").map(Number);
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const b = reduceToSingleDigit(sum);

    const counts = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;

    digits.forEach(d => { if (d >= 1 && d <= 9) counts[d] += 1; });
    counts[m] += 1;
    counts[b] += 1;

    const missing = [];
    const excess = [];

    for (let i = 1; i <= 9; i++) {
      if (counts[i] === 0) missing.push(i);
      else if (counts[i] >= 3) excess.push({ num: i, count: counts[i] });
    }

    setMulank(m);
    setBhagyank(b);
    setPresentCounts(counts);
    setMissingNumbers(missing);
    setExcessNumbers(excess);
    setHasCalculated(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    computeMedicalDiagnosis(name, dob);
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
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-md shadow-emerald-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-rose-955 tracking-tight">
                Vedic Medical Numerology Health Diagnostics
              </h1>
              <p className="text-xs md:text-[18px] text-slate-700 font-bold">
                Anatomical Organ Mapping, Ayurvedic Dosha Diagnosis & Holistic Health Remedies
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
              <Activity className="w-5 h-5 text-emerald-600" /> Enter Birth Details for Health Diagnosis
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
                className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 text-[18px]"
              >
                Diagnose Health Profile
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-300" /> Medical Numerology Diagnostic Report
                </span>
                <h2 className="text-2xl md:text-[30px] font-bold text-white">
                  Anatomical Vulnerability & Health Analysis
                </h2>
                <p className="text-slate-200 text-sm md:text-[18px] leading-relaxed font-medium">
                  Calculated for <strong className="text-emerald-200">{name || "Patient Profile"}</strong> (DOB: {dob}). Mulank (Psychic): <strong className="text-emerald-200">{mulank}</strong> | Bhagyank (Destiny): <strong className="text-emerald-200">{bhagyank}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-[18px]">
                  <span className="font-bold text-emerald-300">Primary Health Drivers:</span>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black">
                    Mulank {mulank} ({PLANET_NAMES[mulank]})
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-teal-600 text-white font-black">
                    Bhagyank {bhagyank} ({PLANET_NAMES[bhagyank]})
                  </span>
                </div>
              </div>
            </div>

            {/* Health Vulnerabilities & Over-Frequency Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Missing Numbers Deficiency Alert */}
              <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-[18px] font-bold text-rose-950 flex items-center gap-2 border-b border-rose-100 pb-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600" /> Missing Number Health Deficiencies
                </h3>
                {missingNumbers.length > 0 ? (
                  <div className="space-y-3">
                    {missingNumbers.map(n => {
                      const info = MEDICAL_NUMEROLOGY_MATRIX[n];
                      return (
                        <div key={n} className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-rose-900 text-[18px]">Missing Number {n} ({info.planet})</span>
                            <span className="text-xs font-bold bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full">{info.dosha}</span>
                          </div>
                          <p className="text-[16px] text-slate-800 font-bold"><strong>Vulnerable Organs:</strong> {info.organs}</p>
                          <p className="text-[16px] text-slate-700 font-semibold"><strong>Risk:</strong> {info.vulnerabilities}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[18px] font-bold text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    No missing numbers detected! Your elemental health matrix is balanced.
                  </p>
                )}
              </div>

              {/* Excess Numbers Over-Frequency Alert */}
              <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-[18px] font-bold text-amber-950 flex items-center gap-2 border-b border-amber-100 pb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Excess Number Over-Frequency Alerts
                </h3>
                {excessNumbers.length > 0 ? (
                  <div className="space-y-3">
                    {excessNumbers.map(item => {
                      const info = MEDICAL_NUMEROLOGY_MATRIX[item.num];
                      return (
                        <div key={item.num} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-amber-900 text-[18px]">Number {item.num} Repeated ({item.count}x Times)</span>
                            <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">Excess {info.dosha}</span>
                          </div>
                          <p className="text-[16px] text-slate-800 font-bold"><strong>Over-Stimulated Organs:</strong> {info.organs}</p>
                          <p className="text-[16px] text-slate-700 font-semibold"><strong>Over-Active Risk:</strong> {info.vulnerabilities}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[18px] font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    No over-frequency numbers detected (No single digit repeated 3+ times).
                  </p>
                )}
              </div>
            </div>

            {/* Complete 1 to 9 Medical Numerology Reference Table */}
            <div className="bg-white border border-rose-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-rose-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" /> Complete 1 to 9 Anatomical & Ayurvedic Dosha Matrix
                  </h3>
                  <p className="text-[18px] text-slate-700 font-bold mt-1">
                    Anatomy mapping, Ayurvedic herbal remedies, and healing crystals for all 9 numbers.
                  </p>
                </div>
                <span className="text-[18px] font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                  Ayurveda Fused
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px]">
                {Object.entries(MEDICAL_NUMEROLOGY_MATRIX).map(([num, info]) => (
                  <div key={num} className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between border-b border-rose-200/60 pb-1.5">
                        <span className="font-black text-rose-950 text-[18px]">Number {num} ({info.planet})</span>
                        <span className={`text-[18px] font-bold px-2 py-0.5 rounded-full ${info.badge}`}>{info.dosha}</span>
                      </div>
                      <p className="text-[18px] font-bold text-slate-900"><strong>Governed Organs:</strong> {info.organs}</p>
                      <p className="text-[18px] text-slate-700 font-semibold leading-relaxed"><strong>Health Risks:</strong> {info.vulnerabilities}</p>
                    </div>

                    <div className="pt-2 border-t border-rose-100 text-[18px] font-bold space-y-1">
                      <p className="text-emerald-800"><strong>🌿 Ayurvedic Herbs:</strong> {info.herbalRemedy}</p>
                      <p className="text-purple-900"><strong>💎 Healing Crystals:</strong> {info.crystal}</p>
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
