import React, { useState, useEffect } from 'react';

const ORACLE_CATEGORIES = [
  {
    name: "Live Nakshatra",
    icon: "✨",
    questions: [
      "What is the current Nakshatra right now?",
      "Which Nakshatra is active at this moment?",
      "When did the current Nakshatra begin?",
      "When will the current Nakshatra end?",
      "What is the ruling planet of today's Nakshatra?",
      "Is today's Nakshatra auspicious?",
      "What are the characteristics of the current Nakshatra?",
      "Which Pada of the Nakshatra is active now?",
      "Is the current Nakshatra favorable for important work?",
      "What is the next Nakshatra after this one?"
    ]
  },
  {
    name: "Planetary Position",
    icon: "🌟",
    questions: [
      "Where is the Sun currently placed?",
      "Which sign is the Moon transiting now?",
      "What is Mercury's current position?",
      "Which house is Jupiter transiting in my chart?",
      "Is Saturn retrograde right now?",
      "Which Nakshatra is Venus transiting?",
      "What sign is Mars currently in?",
      "Is Rahu changing signs soon?",
      "Is Ketu retrograde at present?",
      "What are the exact planetary degrees today?"
    ]
  },
  {
    name: "Live Moon",
    icon: "🌙",
    questions: [
      "What Nakshatra is the Moon currently transiting?",
      "What Pada of the Moon is active now?",
      "How does today's Moon affect my emotions?",
      "Is today's Moon favorable for decision-making?",
      "What house is the Moon transiting from my Lagna?",
      "What house is the Moon transiting from my Moon sign?",
      "Is the Moon afflicted today?",
      "Is the Moon waxing or waning?",
      "What Tithi is active according to the Moon?",
      "How long will the Moon stay in this Nakshatra?"
    ]
  },
  {
    name: "Career",
    icon: "💼",
    questions: [
      "Is today's Nakshatra favorable for job interviews?",
      "Can I start a new business today?",
      "Is the current Moon transit good for career growth?",
      "Which planet is activating my 10th house?",
      "Is Mercury supporting communication today?",
      "Is Jupiter helping professional expansion?",
      "Should I avoid important meetings today?",
      "Is Saturn causing delays in my career?",
      "Is today's Nakshatra favorable for promotions?",
      "What is my career activation score today?"
    ]
  },
  {
    name: "Relationship",
    icon: "💍",
    questions: [
      "Is today's Nakshatra favorable for marriage talks?",
      "Can I propose today?",
      "Is Venus supporting relationships right now?",
      "Is today's Moon transit emotionally harmonious?",
      "Which planet is activating my 7th house?",
      "Is today's Nakshatra good for engagement ceremonies?",
      "Are there any relationship obstacles today?",
      "Is Rahu affecting my love life?",
      "What is my relationship compatibility score today?",
      "When is the next favorable Nakshatra for relationships?"
    ]
  },
  {
    name: "Property",
    icon: "🏠",
    questions: [
      "Is today's Nakshatra good for buying property?",
      "Can I register land today?",
      "Is this a favorable day for Griha Pravesh?",
      "Which planets support real estate matters today?",
      "Is the Moon favorable for house construction?",
      "Is today's transit suitable for home renovations?",
      "Which Nakshatra is best for property investments?",
      "Should I postpone property decisions today?",
      "Is Jupiter blessing property matters?",
      "What is the next auspicious Nakshatra for real estate?"
    ]
  },
  {
    name: "Travel",
    icon: "✈️",
    questions: [
      "Is today's Nakshatra favorable for travel?",
      "Can I start a long journey now?",
      "Is the Moon supporting safe travel?",
      "Should I avoid travel during this transit?",
      "Which Nakshatra is best for pilgrimage?",
      "Is Rahu causing travel disruptions?",
      "Is today's planetary alignment favorable for international travel?",
      "What is the next good travel Nakshatra?",
      "Is this a suitable day for relocation?",
      "What is my travel success score today?"
    ]
  },
  {
    name: "Health",
    icon: "🏥",
    questions: [
      "Is today's Nakshatra favorable for surgery?",
      "Can I start medical treatment now?",
      "Which planets are affecting my health today?",
      "Is Saturn increasing health risks?",
      "Is Mars causing inflammation or accidents?",
      "Is the Moon indicating emotional stress?",
      "What is my health vulnerability score today?",
      "Is today's Nakshatra good for healing therapies?",
      "Which house is currently activated for health matters?",
      "When is the next favorable time for medical procedures?"
    ]
  },
  {
    name: "Spiritual",
    icon: "🕉️",
    questions: [
      "Is today's Nakshatra good for meditation?",
      "Which deity rules the current Nakshatra?",
      "What mantra should I chant today?",
      "Is the Moon supporting spiritual practices?",
      "Which planet is activating my spiritual house?",
      "Is today's Nakshatra favorable for initiation?",
      "Can I perform Havan today?",
      "Is this a good time for fasting?",
      "Which spiritual practices are recommended today?",
      "What is today's spiritual energy score?"
    ]
  },
  {
    name: "Live Transit",
    icon: "📈",
    questions: [
      "Which planets are changing signs soon?",
      "Which planets are retrograde right now?",
      "What major transits are active today?",
      "Is Saturn aspecting my natal Moon?",
      "Is Jupiter activating my career house?",
      "Is Rahu affecting my finances?",
      "What is the strongest transit today?",
      "Which house receives the most planetary energy?",
      "How do today's transits affect my Dasha?",
      "What is my overall transit activation score?"
    ]
  },
  {
    name: "Personalized AI",
    icon: "🤖",
    questions: [
      "How does today's Nakshatra affect my Kundali?",
      "Which planet is most beneficial for me today?",
      "Which planet should I be cautious about?",
      "Is today favorable according to my Janma Nakshatra?",
      "What opportunities are activated today?",
      "What challenges should I avoid today?",
      "Is today's energy good for financial decisions?",
      "Which remedies are recommended for today's transits?",
      "What are today's top three life themes for me?",
      "Give me a personalized daily prediction based on my live Nakshatra and planetary positions."
    ]
  }
];

const AdvancedNakshatraViewer = () => {
  const onlyPlanetary = new URLSearchParams(window.location.search).get('only_planetary') === 'true';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Time Machine State
  const [isLive, setIsLive] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  // Oracle State
  const [oracleQuestion, setOracleQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ORACLE_CATEGORIES[0].name);
  const [oracleResponse, setOracleResponse] = useState(null);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [futureOracleResponse, setFutureOracleResponse] = useState(null);
  const [futureOracleLoading, setFutureOracleLoading] = useState(false);
  const [futureDaysCount, setFutureDaysCount] = useState(7);
  const [userData, setUserData] = useState(null);

  // Load user data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('worksheetData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.basic_details) {
          let tz = 5.5; // fallback
          if (parsed.meta && parsed.meta.timezone) {
            const tzStr = parsed.meta.timezone; // e.g. "UTC+05:30"
            const sign = tzStr.includes('-') ? -1 : 1;
            const match = tzStr.match(/(\d{2}):(\d{2})/);
            if (match) {
              tz = sign * (parseInt(match[1]) + parseInt(match[2]) / 60.0);
            }
          }
          setUserData({
            date: parsed.basic_details.birth_date,
            time: parsed.basic_details.birth_time,
            lat: parsed.basic_details.lat,
            lon: parsed.basic_details.lon,
            tz_offset: tz
          });
        }
      }
    } catch (e) {
      console.error("Error loading user data for Oracle", e);
    }
  }, []);

  const handlePersonalOracleSubmit = async (e, directQuestion = null) => {
    e?.preventDefault();
    const q = directQuestion || oracleQuestion;
    if (!q.trim() || !userData) return;

    setOracleQuestion(q);
    setOracleLoading(true);
    setOracleResponse(null);
    setFutureOracleResponse(null);

    try {
      const payload = {
        date: userData.date,
        time: userData.time,
        lat: parseFloat(userData.lat),
        lon: parseFloat(userData.lon),
        tz_offset: (userData.tz_offset !== undefined && userData.tz_offset !== null && userData.tz_offset !== "") ? parseFloat(userData.tz_offset) : 5.5,
        question: q
      };

      if (!isLive && viewDate) {
        payload.target_datetime = viewDate.toISOString();
      }

      const response = await fetch('/api/nakshatra_advanced/personalized_oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to consult Oracle");
      const result = await response.json();
      setOracleResponse(result);
    } catch (err) {
      setOracleResponse({
        error: true,
        response: "The Oracle is currently meditating and unavailable. Please try again later.",
        quality: "Inauspicious"
      });
    } finally {
      setOracleLoading(false);
    }
  };

  const handleCheckFutureDays = async (days = 7) => {
    if (!userData) return;
    setFutureOracleLoading(true);
    setFutureOracleResponse(null);

    try {
      const payload = {
        date: userData.date,
        time: userData.time,
        lat: parseFloat(userData.lat),
        lon: parseFloat(userData.lon),
        tz_offset: (userData.tz_offset !== undefined && userData.tz_offset !== null && userData.tz_offset !== "") ? parseFloat(userData.tz_offset) : 5.5,
        question: oracleQuestion || "General",
        days: parseInt(futureDaysCount, 10) || 7
      };

      if (!isLive && viewDate) {
        payload.target_datetime = viewDate.toISOString();
      }

      const response = await fetch('/api/nakshatra_advanced/personalized_oracle_future', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to consult Oracle for future");
      const result = await response.json();
      setFutureOracleResponse(result);
    } catch (err) {
      console.error(err);
      setFutureOracleResponse({
        error: true,
        response: "The Oracle is currently meditating and unavailable for future predictions. Please try again later."
      });
    } finally {
      setFutureOracleLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchLiveNakshatra = async () => {
      try {
        let url = '/api/nakshatra_advanced/live';
        if (!isLive && viewDate) {
          // Adjust to ISO format but preserving local timezone offset if desired, or just sending UTC
          url += `?target_datetime=${encodeURIComponent(viewDate.toISOString())}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch Nakshatra data');
        }
        const result = await response.json();
        if (active) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    fetchLiveNakshatra();

    // Refresh every minute to keep it truly live (ONLY IF LIVE)
    let interval;
    if (isLive) {
      interval = setInterval(fetchLiveNakshatra, 60000);
    }
    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [isLive, viewDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-5xl mb-4">🌌</span>
          <p className="tracking-widest uppercase">Initializing Live Nakshatra Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center font-sans">
        <div className="text-center bg-red-900/50 p-8 rounded-2xl border border-red-500">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl text-red-300 mb-2 tracking-widest uppercase">Engine Error</h2>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-100 text-black flex flex-col font-sans">
      {!onlyPlanetary && (
        <div className="bg-rose-50 border-b border-[#333] flex justify-between items-center px-4 py-3 text-[18px] font-bold  text-black shadow-md">
          <span>Cosmic Time Machine Dashboard</span>

          <div className="flex items-center gap-4">
            {!isLive && (
              <button
                onClick={() => {
                  setIsLive(true);
                  setViewDate(new Date());
                }}
                className="bg-red-900/20 hover:bg-red-800/80 text-black px-3 py-1 rounded-full text-xl font-bold uppercase tracking-wider flex items-center gap-1 border border-red-500/50 transition-colors"
              >
                ⏱️ Reset to Live
              </button>
            )}

            <div className="flex items-center bg-orange-100 rounded-full border border-[#333] p-1">
              <button
                onClick={() => {
                  const newD = new Date(viewDate);
                  newD.setDate(newD.getDate() - 1);
                  setViewDate(newD);
                  setIsLive(false);
                }}
                className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                title="Previous Day"
              >
                ⏮️
              </button>
              <input
                type="datetime-local"
                // slice out seconds/milliseconds, keeping standard HTML datetime-local format
                value={new Date(viewDate.getTime() - (viewDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                onChange={(e) => {
                  if (e.target.value) {
                    setViewDate(new Date(e.target.value));
                    setIsLive(false);
                  }
                }}
                className="bg-transparent text-black text-xl font-bold outline-none px-2 text-center"
              />
              <button
                onClick={() => {
                  const newD = new Date(viewDate);
                  newD.setDate(newD.getDate() + 1);
                  setViewDate(newD);
                  setIsLive(false);
                }}
                className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                title="Next Day"
              >
                ⏭️
              </button>
            </div>

            <span className="text-black hidden md:inline ml-2">Displaying: {data.timestamp}</span>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto">
        <div className="bg-[#16213e] rounded-xl shadow-lg border border-[#333] overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-[#00ffcc]">●</span> Live Planetary Positions
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0f1a] border-b border-[#333]">
                    <th className="p-3 text-sm font-semibold text-gray-300">Planet / Point</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Current Sign</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Exact Degree</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Current Nakshatra</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Pada</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Speed (deg/day)</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">RA</th>
                    <th className="p-3 text-sm font-semibold text-gray-300">Dec (Kranti)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#333] hover:bg-[#1a264a] transition-colors">
                      <td className="p-3 font-medium text-[#00ffcc]">{item.planet}</td>
                      <td className="p-3 text-gray-300">{item.sign}</td>
                      <td className="p-3 text-gray-300">{item.degree.toFixed(2)}°</td>
                      <td className="p-3 font-semibold text-white">{item.nakshatra}</td>
                      <td className="p-3 text-gray-300">Pada {item.pada}</td>
                      <td className="p-3 text-gray-300">{item.speed !== 0 ? item.speed.toFixed(4) + '°/d' : 'N/A'}</td>
                      <td className="p-3 text-gray-300">{item.ra !== 0 ? item.ra.toFixed(2) + '°' : 'N/A'}</td>
                      <td className="p-3 text-gray-300">{item.dec !== 0 ? item.dec.toFixed(2) + '°' : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {!onlyPlanetary && (
          <>
            {data.muhurat && data.muhurat.nature && (
              <div className="bg-[#16213e] rounded-xl shadow-lg border border-[#333] overflow-hidden mt-2">
                <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-yellow-400">✨</span> Live Muhurat Analysis
              </h2>
              <p className="text-gray-300 mb-6">
                The Moon is currently transiting <strong>{data.muhurat.current_moon_nakshatra}</strong>, which has a <strong>{data.muhurat.nature}</strong> nature.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-green-900/50 rounded-lg p-4">
                  <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">✅</span> Favorable For
                  </h3>
                  <ul className="space-y-2">
                    {data.muhurat.favorable_activities.map((act, i) => (
                      <li key={i} className="text-green-100 flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">◆</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0f172a] border border-red-900/50 rounded-lg p-4">
                  <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">❌</span> Unfavorable For
                  </h3>
                  <ul className="space-y-2">
                    {data.muhurat.unfavorable_activities.map((act, i) => (
                      <li key={i} className="text-red-100 flex items-start gap-2">
                        <span className="text-red-500 mt-1 text-xs">◆</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Transit Oracle */}
        <div className="bg-[#16213e] rounded-xl shadow-lg border border-[#333] overflow-hidden mt-2">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-purple-400">🔮</span> Ask My Personalized Oracle
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              Ask any question to the stars! This Oracle calculates the Tara Bala (Star Strength) between your Birth Nakshatra and the Live Moon Nakshatra for highly personalized answers.
            </p>

            {!userData ? (
              <div className="bg-orange-900/40 border border-orange-500/50 p-4 rounded-lg text-orange-200 text-sm">
                ⚠️ No Birth Profile Found. Please generate your Kundali chart on the main Workstation page first, so the Oracle knows your Birth Nakshatra!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-[#0f172a] border border-[#333] p-4 rounded-lg text-sm text-gray-300 flex justify-between items-center">
                  <div>
                    <span className="text-[#00ffcc] font-semibold">User Profile Loaded:</span> Born on {userData.date} at {userData.time}
                  </div>
                  <div className="text-xs text-gray-500 italic">(From Saved Kundali)</div>
                </div>

                <form onSubmit={handlePersonalOracleSubmit} className="flex gap-4 flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder="e.g., Is today favorable for job interviews?"
                    value={oracleQuestion}
                    onChange={(e) => setOracleQuestion(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#00ffcc] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={oracleLoading || !oracleQuestion.trim()}
                    className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${oracleLoading
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                      }`}
                  >
                    {oracleLoading ? 'Consulting...' : 'Ask Oracle'}
                  </button>
                </form>

                {/* Category Buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {ORACLE_CATEGORIES.map(cat => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.name
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-[#1a264a] text-gray-300 hover:bg-[#233566]'
                        }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>

                {/* Question Chips */}
                <div className="bg-[#0f172a] border border-[#333] p-4 rounded-xl mt-2">
                  <h3 className="text-[#00ffcc] text-xs font-bold uppercase tracking-wider mb-3">
                    Select a question to auto-ask:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ORACLE_CATEGORIES.find(c => c.name === selectedCategory)?.questions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => handlePersonalOracleSubmit(e, q)}
                        className="bg-[#16213e] hover:bg-[#1f2f5c] border border-[#333] hover:border-purple-500 text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-lg text-left transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {oracleResponse && !oracleResponse.error && (
                  <div className={`mt-4 p-5 rounded-xl border-l-4 bg-[#0f172a] ${oracleResponse.quality === 'Extremely Auspicious' ? 'border-green-500' :
                    oracleResponse.quality === 'Auspicious' ? 'border-green-400' :
                      oracleResponse.quality === 'Inauspicious' ? 'border-red-500' : 'border-yellow-500'
                    }`}>
                    <div className="flex flex-col sm:flex-row gap-6 mb-4 pb-4 border-b border-[#333]">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Birth Star</div>
                        <div className="text-lg text-[#00ffcc] font-bold">{oracleResponse.natal_nakshatra}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Live Transit Star</div>
                        <div className="text-lg text-white font-bold">{oracleResponse.live_nakshatra}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Tara</div>
                        <div className={`text-lg font-bold ${oracleResponse.quality.includes('Auspicious') ? 'text-green-400' :
                          oracleResponse.quality === 'Inauspicious' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                          {oracleResponse.tara_name} Tara
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                      {oracleResponse.response}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#333]">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-bold text-gray-300">Days to check:</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="30" 
                            value={futureDaysCount} 
                            onChange={(e) => setFutureDaysCount(e.target.value)} 
                            className="w-16 bg-[#0f172a] border border-[#333] text-white px-2 py-1 rounded-md focus:outline-none focus:border-purple-500 text-center"
                          />
                        </div>
                        <button
                          onClick={() => handleCheckFutureDays()}
                          disabled={futureOracleLoading}
                          className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wider transition-all ${futureOracleLoading
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-[#1a264a] hover:bg-[#233566] text-white border border-purple-500/50 hover:border-purple-500'
                            }`}
                        >
                          {futureOracleLoading ? 'Consulting the Future...' : `Check Coming ${futureDaysCount} Days`}
                        </button>
                      </div>

                      {futureOracleResponse && !futureOracleResponse.error && (
                        <div className="mt-4 overflow-x-auto">
                          <h4 className="text-[#00ffcc] text-xs font-bold uppercase tracking-wider mb-3">{futureDaysCount}-Day Forecast based on {futureOracleResponse.natal_nakshatra} (Your Birth Star)</h4>
                          <div className="flex gap-3 min-w-max pb-2">
                            {futureOracleResponse.future_days?.map((day, idx) => (
                              <div key={idx} className={`flex flex-col p-3 rounded-lg border-2 min-w-[120px] ${
                                day.quality.includes('Auspicious') ? 'bg-green-900/20 border-green-500/50' :
                                day.quality === 'Inauspicious' ? 'bg-red-900/20 border-red-500/50' :
                                'bg-yellow-900/20 border-yellow-500/50'
                              }`}>
                                <div className="text-xs text-gray-400 mb-1">{day.date}</div>
                                <div className="text-sm font-bold text-white mb-0.5">{day.nakshatra}</div>
                                <div className="text-[10px] text-gray-300 mb-1 italic">until {day.end_time}</div>
                                <div className={`text-xs font-semibold ${
                                  day.quality.includes('Auspicious') ? 'text-green-400' :
                                  day.quality === 'Inauspicious' ? 'text-red-400' :
                                  'text-yellow-400'
                                }`}>
                                  {day.tara_name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {futureOracleResponse && futureOracleResponse.error && (
                        <div className="mt-4 p-3 rounded-lg border-l-4 border-red-500 bg-red-900/20 text-red-200 text-sm">
                          {futureOracleResponse.response}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {oracleResponse && oracleResponse.error && (
                  <div className="mt-4 p-5 rounded-xl border-l-4 border-red-500 bg-red-900/20 text-red-200">
                    {oracleResponse.response}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedNakshatraViewer;
