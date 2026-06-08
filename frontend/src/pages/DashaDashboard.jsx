import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MonthlyTimeline from '../components/MonthlyTimeline';

export default function DashaDashboard({ data: worksheetData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Determine birth details from worksheet data
    const basic = worksheetData?.basic_details || {};
    const meta = worksheetData?.meta || {};
    
    const birthDate = basic.birth_date || meta.date || '1990-10-01';
    const birthTime = basic.birth_time || meta.time || '12:00:00';
    const name = meta.name || basic.name || 'User';

    // API Call to the Dasha Report endpoint
    axios.post('/api/dasha-report', {
      name: name,
      date: birthDate,
      time: birthTime,
      lat: basic.lat || 28.6,
      lon: basic.lon || 77.2,
      tz: basic.tz_offset || 5.5
    })
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load AI Dasha Intelligence. Please check backend connectivity.");
      setLoading(false);
    });
  }, [worksheetData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              AI Dasha <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Intelligence</span>
            </h1>
            <p className="text-slate-500 mt-2">Enterprise-grade astrological forecasting powered by Swiss Ephemeris</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-all">
              Export PDF
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all">
              Refresh Data
            </button>
          </div>
        </header>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Stats */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Current Period Overview</h2>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 whitespace-pre-line text-indigo-900 leading-relaxed">
                  {data.summary}
                </div>
              </div>

              {data.timeline && <MonthlyTimeline timeline={data.timeline} />}
            </div>

            {/* Sidebar / AI Scores */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">AI Probability Scores</h3>
                <div className="space-y-4">
                  <ScoreCard 
                    label="Marriage Timing" 
                    score={data.marriage_ai?.probability} 
                    result={data.marriage_ai?.result}
                    color="rose"
                  />
                  <ScoreCard 
                    label="Wealth Probability" 
                    score={data.wealth_ai?.wealth_probability} 
                    result={data.wealth_ai?.wealth_period ? "High Opportunity" : "Steady"}
                    color="emerald"
                  />
                  <ScoreCard 
                    label="Health Risk" 
                    score={data.health_ai?.risk_score} 
                    result={`${data.health_ai?.risk_level} Risk`}
                    color="amber"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl text-white">
                <h3 className="text-lg font-bold mb-2">Nakshatra Detail</h3>
                <div className="flex items-center gap-3 mt-4">
                   <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <span className="text-2xl font-bold">{data.nakshatra?.pada}</span>
                   </div>
                   <div>
                      <div className="text-sm opacity-80">Moon Nakshatra</div>
                      <div className="text-xl font-bold">{data.nakshatra?.nakshatra}</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getExplanation(label, score) {
  if (label === 'Marriage Timing') {
    if (score >= 75) return "High probability of union or engagement. Dasha lords strongly support the 7th house and Venus.";
    if (score >= 55) return "Neutral period. Some delays might occur, but overall possibility exists.";
    return "Focus on personal growth. Relationship indicators are dormant or under karmic pressure.";
  }
  if (label === 'Wealth Probability') {
    if (score >= 75) return "Golden period for financial expansion. Investment and career growth are highly favored.";
    if (score >= 55) return "Steady financial phase. Avoid high-risk speculation but maintain consistent efforts.";
    return "Phase of consolidation. Minimize debt and avoid large financial risks.";
  }
  if (label === 'Health Risk') {
    if (score > 70) return "Higher sensitivity to stress and ailments. Focus on preventative care and adequate rest.";
    if (score > 40) return "Average vitality. Maintain regular routine and avoid excessive fatigue.";
    return "Vitality is high. Immunity is strong. Good period for physical recovery.";
  }
  return "";
}

function ScoreCard({ label, score, result, color }) {
  const colors = {
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    indigo: "bg-indigo-500"
  };
  
  const explanation = getExplanation(label, score);

  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-white text-${color}-600 shadow-sm border border-${color}-100`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
        <div 
          className={`${colors[color]} h-full transition-all duration-1000`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="flex flex-col gap-1.5 mt-3 border-t border-slate-200/60 pt-3">
        <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{result}</div>
        <div className="text-[11px] text-slate-500 leading-relaxed italic">{explanation}</div>
      </div>
    </div>
  );
}
