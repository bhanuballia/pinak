import React, { useState } from "react";
import { Sparkles, Calendar, User, ArrowLeft, RefreshCw, Star, Compass, Flame, ShieldAlert, Award, AlertCircle, ToggleLeft, CheckCircle, Heart, Coins, Baby, Briefcase, Landmark } from "lucide-react";

export default function NumerologyDashboard() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [nameSystem, setNameSystem] = useState("Chaldean"); // "Chaldean" | "Pythagorean"

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date");
    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      if (urlName) {
        // Auto trigger calculation if both parameters exist
        (async () => {
          setLoading(true);
          try {
            const response = await fetch("/api/numerology/detailed-report", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
              },
              body: JSON.stringify({ name: urlName, dob: urlDob }),
            });
            if (response.ok) {
              const data = await response.json();
              setResult(data);
            }
          } catch (e) {
            console.error("Auto calculation failed:", e);
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name || !dob) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/numerology/detailed-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ name, dob }),
      });
      if (!response.ok) {
        throw new Error("Failed to compute detailed numerology report");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || "An error occurred while calculating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.close();
  };

  const resetForm = () => {
    setResult(null);
    setName("");
    setDob("");
  };

  // Loshu Grid indices mapper
  const getGridVal = (num) => {
    const count = result?.loshuGrid?.[num] || 0;
    if (count === 0) return "-";
    return String(num).repeat(count);
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-600 text-white p-2.5 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-rose-950 tracking-tight">
                Vedic & Chaldean Numerology
              </h1>
              <p className="text-xs md:text-sm text-rose-700 font-medium">
                Deep numerical analytics of your name, personality, destiny, and remedies
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-bold transition-all text-sm border border-rose-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Dashboard</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!result ? (
          <div className="max-w-md mx-auto bg-white border border-rose-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50 mt-10">
            <h2 className="text-xl font-bold text-rose-950 text-center mb-6">
              Enter Birth Details
            </h2>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Calculate Numerology Profile"}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Core Numbers, Profile Analysis, and Loshu Grid Visual */}
            <div className="space-y-6 lg:col-span-2">

              {/* Core Numbers Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Mulank (Ruling) */}
                <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-3">
                      <Star className="w-3 h-3" /> Mulank (Ruling)
                    </span>
                    <p className="text-slate-500 text-xs font-medium mb-1">Birth Date Day Vibration</p>
                  </div>
                  <div className="my-3">
                    <span className="text-5xl font-black text-rose-600">{result.mulank}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                    Planet: {result.mulankDetails.planet}
                  </div>
                </div>

                {/* Bhagyank (Destiny) */}
                <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-3">
                      <Compass className="w-3 h-3" /> Bhagyank (Destiny)
                    </span>
                    <p className="text-slate-500 text-xs font-medium mb-1">Full Date of Birth Sum</p>
                  </div>
                  <div className="my-3">
                    <span className="text-5xl font-black text-rose-600">{result.bhagyank}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                    Planet: {result.bhagyankDetails.planet}
                  </div>
                </div>

                {/* Namank (Name Vibration with Chaldean vs Pythagorean Toggle) */}
                <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-2">
                      <User className="w-3 h-3" /> Namank ({nameSystem})
                    </span>
                    <div className="flex justify-center mb-1">
                      <button
                        onClick={() => setNameSystem(nameSystem === "Chaldean" ? "Pythagorean" : "Chaldean")}
                        className="inline-flex items-center gap-1 text-[9px] bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold px-2 py-0.5 rounded-full transition-all border border-rose-200"
                      >
                        Toggle System
                      </button>
                    </div>
                  </div>
                  <div className="my-2">
                    <span className="text-5xl font-black text-rose-600">
                      {nameSystem === "Chaldean" ? result.namank : result.pythagoreanNamank}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                    Planet: {nameSystem === "Chaldean" ? result.namankDetails.planet : "Calculated"}
                  </div>
                </div>

              </div>

              {/* Chaldean vs Pythagorean Comparison Card */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-black text-rose-950 mb-3 flex items-center gap-2">
                  <ToggleLeft className="w-5 h-5 text-rose-600" /> Name Number System Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className={`p-4 rounded-2xl border transition-all ${nameSystem === "Chaldean" ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100"}`}>
                    <h4 className="font-extrabold text-rose-950 text-sm mb-1">Chaldean / Cheiro System</h4>
                    <p className="text-slate-600 mb-2 leading-relaxed">Originating in ancient Babylon, it assigns values based on sounds and vibration rather than alphabetical order.</p>
                    <span className="text-sm font-black text-rose-700">Namank Score: {result.namank}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border transition-all ${nameSystem === "Pythagorean" ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100"}`}>
                    <h4 className="font-extrabold text-rose-950 text-sm mb-1">Pythagorean System</h4>
                    <p className="text-slate-600 mb-2 leading-relaxed">Developed by the Greek philosopher Pythagoras, it maps letters sequentially from 1 to 9 based on the alphabet.</p>
                    <span className="text-sm font-black text-rose-700">Namank Score: {result.pythagoreanNamank}</span>
                  </div>
                </div>
              </div>

              {/* In-depth Core Profile Panels */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-rose-950 border-b border-rose-100 pb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-600" /> Numerological Profile Analysis
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-rose-950 mb-1">
                      Mulank {result.mulank} - Core Personality
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                      {result.mulankDetails.traits}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-rose-955 mb-1">
                      Bhagyank {result.bhagyank} - Destiny & Careers
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                      <strong>Best Fields:</strong> {result.bhagyankDetails.careers}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-rose-950 mb-1">
                      Personal Year Forecast ({result.currentYear})
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                      Your Personal Year vibration is <strong className="text-rose-700">{result.personalYear}</strong>.
                      This year is ruled by <strong>{result.personalYearDetails.planet}</strong>, indicating a phase of:{" "}
                      {result.personalYearDetails.traits}
                    </p>
                  </div>
                </div>
              </div>

              {/* Loshu Grid Visual Card - Displayed below Numerological Profile Analysis */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col items-stretch w-full">
                <h3 className="text-lg font-black text-rose-950 mb-1 text-center w-full">Loshu Grid</h3>
                <p className="text-[11px] text-slate-900 font-semibold uppercase tracking-wider mb-5 text-center w-full">3x3 Saturnine Magic Square</p>

                <div className="grid grid-cols-3 gap-4 w-full">

                  {/* Row 1 */}
                  {/* Cell 4 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-amber-400">
                    <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">4</div>
                    <div className="my-3">
                      {result.loshuGrid[4] > 0 ? (
                        <span className="text-3xl font-black text-amber-600">{getGridVal(4)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">4</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Discipline, Stability, Hard Work, Practicality, Organization, Structure</p>
                      <div className="text-[16px] bg-amber-50/70 border border-amber-100 py-1.5 rounded space-y-0.5 font-bold text-amber-900 w-full">
                        <p>Element: Wood</p>
                        <p>Planet: Rahu</p>
                        <p>Merit: Stability</p>
                        <p>Direction: Southeast</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 9 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-orange-400">
                    <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">9</div>
                    <div className="my-3">
                      {result.loshuGrid[9] > 0 ? (
                        <span className="text-3xl font-black text-orange-600">{getGridVal(9)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">9</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Compassion, Empathy, Idealism, Generosity, Sacrifice, Vision, Humanitarianism</p>
                      <div className="text-[16px] bg-orange-50/70 border border-orange-100 py-1.5 rounded space-y-0.5 font-bold text-orange-900 w-full">
                        <p>Element: Fire</p>
                        <p>Planet: Mars</p>
                        <p>Merit: Compassion</p>
                        <p>Direction: South</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 2 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-indigo-400">
                    <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">2</div>
                    <div className="my-3">
                      {result.loshuGrid[2] > 0 ? (
                        <span className="text-3xl font-black text-indigo-600">{getGridVal(2)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">2</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Cooperation, Sensitivity, Harmony, Balance, Partnership, Diplomacy, Receptivity</p>
                      <div className="text-[16px] bg-indigo-50/70 border border-indigo-100 py-1.5 rounded space-y-0.5 font-bold text-indigo-900 w-full">
                        <p>Element: Earth</p>
                        <p>Planet: Moon</p>
                        <p>Merit: Supportiveness</p>
                        <p>Direction: Southwest</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  {/* Cell 3 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-emerald-400">
                    <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">3</div>
                    <div className="my-3">
                      {result.loshuGrid[3] > 0 ? (
                        <span className="text-3xl font-black text-emerald-600">{getGridVal(3)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">3</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Expression, Creativity, Joy, Charisma, Communication, Art, Optimism</p>
                      <div className="text-[16px] bg-emerald-50/70 border border-emerald-100 py-1.5 rounded space-y-0.5 font-bold text-emerald-900 w-full">
                        <p>Element: Wood</p>
                        <p>Planet: Jupiter</p>
                        <p>Merit: Creativity</p>
                        <p>Direction: East</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 5 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-indigo-500">
                    <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">5</div>
                    <div className="my-3">
                      {result.loshuGrid[5] > 0 ? (
                        <span className="text-3xl font-black text-indigo-700">{getGridVal(5)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">5</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Freedom, Adaptability, Change, Adventure, Versatility, Movement, Exploration</p>
                      <div className="text-[16px] bg-indigo-50/70 border border-indigo-100 py-1.5 rounded space-y-0.5 font-bold text-indigo-950 w-full">
                        <p>Element: Earth</p>
                        <p>Planet: Mercury</p>
                        <p>Merit: Balance</p>
                        <p>Direction: Center</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 7 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-teal-400">
                    <div className="absolute top-2 right-2 bg-teal-100 text-teal-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">7</div>
                    <div className="my-3">
                      {result.loshuGrid[7] > 0 ? (
                        <span className="text-3xl font-black text-teal-600">{getGridVal(7)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">7</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Spirituality, Wisdom, Research, Inner Growth, Solitude, Introspection, Knowledge</p>
                      <div className="text-[16px] bg-teal-50/70 border border-teal-100 py-1.5 rounded space-y-0.5 font-bold text-teal-900 w-full">
                        <p>Element: Metal</p>
                        <p>Planet: Ketu</p>
                        <p>Merit: Wisdom</p>
                        <p>Direction: West</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  {/* Cell 8 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-purple-400">
                    <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">8</div>
                    <div className="my-3">
                      {result.loshuGrid[8] > 0 ? (
                        <span className="text-3xl font-black text-purple-600">{getGridVal(8)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">8</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Power, Ambition, Authority, Status, Success, Control, Leadership</p>
                      <div className="text-[16px] bg-purple-50/70 border border-purple-100 py-1.5 rounded space-y-0.5 font-bold text-purple-900 w-full">
                        <p>Element: Earth</p>
                        <p>Planet: Saturn</p>
                        <p>Merit: Success</p>
                        <p>Direction: Northeast</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 1 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-blue-400">
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">1</div>
                    <div className="my-3">
                      {result.loshuGrid[1] > 0 ? (
                        <span className="text-3xl font-black text-blue-600">{getGridVal(1)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">1</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Leadership, Individualism, Confidence, Creativity, Determination, Originality, Willpower</p>
                      <div className="text-[16px] bg-blue-50/70 border border-blue-100 py-1.5 rounded space-y-0.5 font-bold text-blue-900 w-full">
                        <p>Element: Water</p>
                        <p>Planet: Sun</p>
                        <p>Merit: Individualism</p>
                        <p>Direction: North</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell 6 */}
                  <div className="p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-rose-350">
                    <div className="absolute top-2 right-2 bg-rose-100 text-rose-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">6</div>
                    <div className="my-3">
                      {result.loshuGrid[6] > 0 ? (
                        <span className="text-3xl font-black text-rose-600">{getGridVal(6)}</span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300 line-through">6</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[16px]">
                      <p className="font-semibold text-slate-700 leading-tight">Responsibility, Love, Service, Family, Compassion, Support, Harmony</p>
                      <div className="text-[16px] bg-rose-50/70 border border-rose-100 py-1.5 rounded space-y-0.5 font-bold text-rose-900 w-full">
                        <p>Element: Metal</p>
                        <p>Planet: Venus</p>
                        <p>Merit: Service</p>
                        <p>Direction: Northwest</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-6 text-xs text-slate-500 space-y-2 leading-relaxed text-center">
                  <p>
                    <strong>Loshu Grid</strong> indicates which elements and planes are fully active. Repeating numbers boost the respective element, while absent numbers suggest fields for remedy focus.
                  </p>
                </div>
              </div>

              {/* Loshu Planes Analysis */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-rose-950 border-b border-rose-100 pb-3 mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-600" /> Loshu Grid Planes Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.loshuPlanes.map((plane, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-rose-100/50 bg-rose-50/10 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold text-rose-950 text-base">{plane.name}</h4>
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${plane.status === "Strong" ? "bg-green-100 text-green-800" :
                            plane.status === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                              "bg-orange-100 text-orange-800"
                            }`}>
                            {plane.status}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 mb-2">{plane.description}</p>
                      </div>
                      {plane.status === "Missing/Weak" && (
                        <div className="mt-2 text-xs md:text-sm bg-orange-50 text-orange-950 p-2.5 rounded-xl border border-orange-100 flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-orange-700 shrink-0" />
                          <div>
                            <span className="font-bold">Missing Remedy:</span> {plane.remedy}
                          </div>
                        </div>
                      )}
                      {plane.status !== "Missing/Weak" && (
                        <div className="mt-2 text-xs md:text-sm bg-green-50 text-green-950 p-2.5 rounded-xl border border-green-100 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-green-700 shrink-0" />
                          <span className="font-semibold">Plane elements are well balanced!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lo Shu Grid Life Domain Analytics */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-rose-950 border-b border-rose-100 pb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-600" /> Lo Shu Life Domain Analytics
                </h3>

                {result.domainAnalytics ? (
                  <div className="space-y-6">

                    {/* Marriage & Money Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Marriage Card */}
                      <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-pink-100 text-pink-700 rounded-xl">
                              <Heart className="w-5 h-5" />
                            </div>
                            <h4 className="font-extrabold text-rose-950 text-base md:text-lg">Marriage & Relationship</h4>
                          </div>
                          <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${result.domainAnalytics.marriage.score >= 80 ? "bg-green-100 text-green-800" :
                              result.domainAnalytics.marriage.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                                "bg-orange-100 text-orange-800"
                            }`}>
                            {result.domainAnalytics.marriage.score}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status: {result.domainAnalytics.marriage.status}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.marriage.analysis}</p>
                        </div>
                        <div className="bg-pink-50/50 text-slate-800 p-3 rounded-xl border border-pink-100 text-sm">
                          <span className="font-bold text-pink-900 block mb-0.5">🌸 Relationship Remedies:</span>
                          {result.domainAnalytics.marriage.remedies}
                        </div>
                      </div>

                      {/* Money Card */}
                      <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                              <Coins className="w-5 h-5" />
                            </div>
                            <h4 className="font-extrabold text-rose-950 text-base md:text-lg">Wealth & Assets</h4>
                          </div>
                          <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${result.domainAnalytics.money.score >= 80 ? "bg-green-100 text-green-800" :
                              result.domainAnalytics.money.score >= 50 ? "bg-yellow-100 text-yellow-800" :
                                "bg-orange-100 text-orange-800"
                            }`}>
                            {result.domainAnalytics.money.score}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status: {result.domainAnalytics.money.status}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.money.analysis}</p>
                        </div>
                        <div className="bg-emerald-50/50 text-slate-800 p-3 rounded-xl border border-emerald-100 text-sm">
                          <span className="font-bold text-emerald-900 block mb-0.5">💰 Wealth Remedies:</span>
                          {result.domainAnalytics.money.remedies}
                        </div>
                      </div>

                    </div>

                    {/* Child Birth, Career & Gov Job Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Child Birth Card */}
                      <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                              <Baby className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-rose-950 text-sm md:text-base">Child Birth</h4>
                          </div>
                          <span className="text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.child_birth.score}%</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.child_birth.analysis}</p>
                        <div className="bg-blue-50/50 text-slate-700 p-2.5 rounded-xl border border-blue-100 text-xs md:text-sm leading-snug">
                          <span className="font-bold text-blue-900 block mb-0.5">🍼 Progeny Remedy:</span>
                          {result.domainAnalytics.child_birth.remedies}
                        </div>
                      </div>

                      {/* Career Card */}
                      <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-rose-950 text-sm md:text-base">Career & Success</h4>
                          </div>
                          <span className="text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.career.score}%</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.career.analysis}</p>
                        <div className="bg-amber-50/50 text-slate-700 p-2.5 rounded-xl border border-amber-100 text-xs md:text-sm leading-snug">
                          <span className="font-bold text-amber-900 block mb-0.5">💼 Career Remedy:</span>
                          {result.domainAnalytics.career.remedies}
                        </div>
                      </div>

                      {/* Gov Job Card */}
                      <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                              <Landmark className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-rose-950 text-sm md:text-base">Government Job</h4>
                          </div>
                          <span className="text-xs font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.government_job.score}%</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.government_job.analysis}</p>
                        <div className="bg-purple-50/50 text-slate-700 p-2.5 rounded-xl border border-purple-100 text-xs md:text-sm leading-snug">
                          <span className="font-bold text-purple-900 block mb-0.5">🏛️ Exam Remedy:</span>
                          {result.domainAnalytics.government_job.remedies}
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Loading domain analytics details...</p>
                )}
              </div>

              {/* Remedies & Lucky Factors */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-rose-950 border-b border-rose-100 pb-3 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600" /> Vedic Remedies & Auspicious Energies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-rose-900">Lucky Colors: </span>
                      <span className="text-slate-600">{result.mulankDetails.colors.join(", ")}</span>
                    </div>
                    <div>
                      <span className="font-bold text-rose-900">Lucky Directions: </span>
                      <span className="text-slate-600">{result.mulankDetails.lucky_directions.join(", ")}</span>
                    </div>
                    <div>
                      <span className="font-bold text-rose-900">Auspicious Gemstone: </span>
                      <span className="text-slate-600">{result.mulankDetails.gemstone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-rose-900">Friendly Numbers: </span>
                      <span className="text-slate-600">{result.mulankDetails.friendly_numbers.join(", ")}</span>
                    </div>
                    <div>
                      <span className="font-bold text-rose-900">Numbers to Avoid: </span>
                      <span className="text-slate-600">{result.mulankDetails.enemy_numbers.join(", ")}</span>
                    </div>
                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                      <span className="block font-bold text-rose-950 text-xs mb-1 uppercase tracking-wider">Auspicious Beej Mantra:</span>
                      <span className="font-semibold text-rose-800 text-xs italic">"{result.mulankDetails.mantra}"</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Lucky Matrix */}
            <div className="space-y-6">

              {/* Lucky Match Matrix */}
              <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-rose-950 text-center w-full">Lucky Match Matrix</h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-center">Best Calendar Dates of the Month</p>
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-green-50/60 border border-green-100 rounded-2xl">
                    <span className="block font-extrabold text-green-800 mb-1">🌟 Super Lucky Dates</span>
                    <span className="text-slate-700 font-bold">{result.luckyDates.super_lucky.join(", ")}</span>
                  </div>
                  <div className="p-3 bg-yellow-50/60 border border-yellow-100 rounded-2xl">
                    <span className="block font-extrabold text-yellow-800 mb-1">⚖️ Neutral Dates</span>
                    <span className="text-slate-700 font-bold">{result.luckyDates.neutral.join(", ")}</span>
                  </div>
                  <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-2xl">
                    <span className="block font-extrabold text-orange-800 mb-1">⚠️ Dates to Avoid</span>
                    <span className="text-slate-700 font-bold">{result.luckyDates.avoid.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Action Button to test another */}
              <button
                onClick={resetForm}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-600/20"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Analyze Another Profile</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
