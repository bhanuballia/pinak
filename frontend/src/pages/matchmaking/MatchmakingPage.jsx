import React, { useState, useEffect } from 'react';
import CompatibilityDashboard from '../../components/matchmaking/CompatibilityDashboard';
import PlaceAutocomplete from '../../components/PlaceAutocomplete';
import VimshottariDashaDisplay from '../../components/matchmaking/VimshottariDashaDisplay.jsx';

const MatchmakingPage = () => {
  const [loading, setLoading] = useState(false);
  const [wsAlert, setWsAlert] = useState(null);

  // Multi-match state
  const [primaryGender, setPrimaryGender] = useState('boy');
  const [primaryProfile, setPrimaryProfile] = useState({
    title: 'Shri',
    name: 'Rahul',
    birth_date: '1988-02-07',
    birth_time: '14:06',
    tz_offset: 5.5,
    lat: 25.7592,
    lon: 84.1504,
    location_name: 'Ballia, Uttar Pradesh'
  });

  const defaultCandidateData = (gender) => ({
    title: gender === 'boy' ? 'Shri' : 'Kumari',
    name: '',
    birth_date: '1992-06-15',
    birth_time: '14:30',
    tz_offset: 5.5,
    lat: 28.6139,
    lon: 77.2090,
    location_name: 'Delhi, India'
  });

  const [candidates, setCandidates] = useState([defaultCandidateData('girl')]);
  const [multiResults, setMultiResults] = useState(null);
  const [activeReportData, setActiveReportData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/matchmaking/alerts');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setWsAlert(data);
        setTimeout(() => setWsAlert(null), 3500);
      } catch (e) { }
    };
    return () => ws.close();
  }, []);

  const handlePrimaryGenderChange = (newGender) => {
    setPrimaryGender(newGender);
    setPrimaryProfile(prev => ({
      ...prev,
      title: newGender === 'boy' ? 'Shri' : 'Kumari'
    }));
    // Reset candidates for the opposite gender
    setCandidates([defaultCandidateData(newGender === 'boy' ? 'girl' : 'boy')]);
  };

  const addCandidate = () => {
    if (candidates.length < 4) {
      setCandidates([...candidates, defaultCandidateData(primaryGender === 'boy' ? 'girl' : 'boy')]);
    }
  };

  const removeCandidate = (index) => {
    if (candidates.length > 1) {
      const newCandidates = [...candidates];
      newCandidates.splice(index, 1);
      setCandidates(newCandidates);
    }
  };

  const updateCandidate = (index, field, value) => {
    const newCandidates = [...candidates];
    newCandidates[index][field] = value;
    setCandidates(newCandidates);
  };

  const updateCandidatePlace = (index, place) => {
    const newCandidates = [...candidates];
    newCandidates[index].lat = place.lat;
    newCandidates[index].lon = place.lon;
    newCandidates[index].tz_offset = place.tz_offset_hours;
    newCandidates[index].location_name = place.display_name;
    setCandidates(newCandidates);
  };

  const runMatchmaking = async () => {
    setLoading(true);
    try {
      const payload = {
        primary_gender: primaryGender,
        primary_profile: {
          ...primaryProfile,
          lat: parseFloat(primaryProfile.lat),
          lon: parseFloat(primaryProfile.lon),
          tz_offset: parseFloat(primaryProfile.tz_offset)
        },
        candidates: candidates.map(c => ({
          ...c,
          lat: parseFloat(c.lat),
          lon: parseFloat(c.lon),
          tz_offset: parseFloat(c.tz_offset)
        }))
      };

      const response = await fetch('/api/matchmaking/multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setMultiResults(data);
    } catch (err) {
      console.error("Matchmaking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileForm = (data, onChange, placeOnSelect, titleColorClass) => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Title</label>
          <select
            value={data.title}
            onChange={e => onChange('title', e.target.value)}
            className={`w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-${titleColorClass}-500 text-sm font-bold text-slate-700`}
          >
            <option>Shri</option>
            <option>Kumar</option>
            <option>Kumari</option>
            <option>Shrimati</option>
          </select>
        </div>
        <div className="col-span-3">
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Full Name</label>
          <input
            placeholder="Enter name..."
            value={data.name}
            onChange={e => onChange('name', e.target.value)}
            className={`w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-${titleColorClass}-500 font-bold placeholder:text-slate-300`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Date of Birth</label>
          <input type="date" value={data.birth_date} onChange={e => onChange('birth_date', e.target.value)} className={`w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-${titleColorClass}-500 font-bold`}
          />
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Time of Birth</label>
          <input type="time" value={data.birth_time} onChange={e => onChange('birth_time', e.target.value)} className={`w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-${titleColorClass}-500 font-bold`} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Birth Location</label>
        <div className="relative matchmaking-place-search">
          <PlaceAutocomplete value={data.location_name || ""} onSelect={placeOnSelect} />
          <div className="mt-3 grid grid-cols-3 gap-2 opacity-50 pointer-events-none">
            <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LAT: {parseFloat(data.lat).toFixed(4)}</div>
            <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LON: {parseFloat(data.lon).toFixed(4)}</div>
            <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">TZ: {data.tz_offset}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to transform raw vimshottari data for display
  const mapVimshottari = (data) => {
    const list = Array.isArray(data) ? data : data?.list;
    return list?.map(d => ({
      planet: d.lord,
      start_date: new Date((d.start_jd - 2440587.5) * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      end_date: new Date((d.end_jd - 2440587.5) * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: d.antardashas ? `Antardashas: ${d.antardashas.map(a => a.lord).join(', ')}` : ''
    })) || [];
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      {/* Input Section */}
      {!multiResults && !activeReportData && (
        <div className="max-w-4xl mx-auto p-4 md:p-12 pt-20 pb-32">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <img src="/deities/marriage.jpg" alt="Marriage Deity" className="h-48 w-48 object-cover rounded-full shadow-2xl border-4 border-indigo-50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-4 bg-indigo-50/50 px-6 py-2 rounded-full inline-block">Vedic Compatibility Portal</p>
              <h1 className="text-5xl md:text-6xl font-serif italic text-slate-900">Multi-Match Synthesis</h1>
            </div>

            {/* Primary Profile Section */}
            <div className="mb-16 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
              <div className="absolute -top-4 left-8 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">Primary Profile</div>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex gap-4">
                  <button
                    onClick={() => handlePrimaryGenderChange('boy')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${primaryGender === 'boy' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-400 hover:bg-indigo-50'}`}
                  >
                    Boy 🤴
                  </button>
                  <button
                    onClick={() => handlePrimaryGenderChange('girl')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${primaryGender === 'girl' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-white text-slate-400 hover:bg-pink-50'}`}
                  >
                    Girl 👸
                  </button>
                </div>
              </div>

              {renderProfileForm(
                primaryProfile,
                (field, val) => setPrimaryProfile({ ...primaryProfile, [field]: val }),
                (place) => setPrimaryProfile({
                  ...primaryProfile,
                  lat: place.lat, lon: place.lon,
                  tz_offset: place.tz_offset_hours, location_name: place.display_name
                }),
                primaryGender === 'boy' ? 'indigo' : 'pink'
              )}
            </div>

            {/* Candidates Section */}
            <div className="space-y-8">
              <h3 className="text-center text-sm font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-100 pb-4">
                Candidates to Match Against
              </h3>

              {candidates.map((candidate, index) => (
                <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
                  <div className="absolute -top-4 left-8 bg-slate-800 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                    Candidate {index + 1}
                  </div>
                  {candidates.length > 1 && (
                    <button
                      onClick={() => removeCandidate(index)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-all font-bold"
                    >
                      ✕
                    </button>
                  )}

                  <div className="mt-4">
                    {renderProfileForm(
                      candidate,
                      (field, val) => updateCandidate(index, field, val),
                      (place) => updateCandidatePlace(index, place),
                      primaryGender === 'boy' ? 'pink' : 'indigo'
                    )}
                  </div>
                </div>
              ))}

              {candidates.length < 4 && (
                <button
                  onClick={addCandidate}
                  className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                >
                  + Add Another Candidate (Max 4)
                </button>
              )}
            </div>

            <div className="flex justify-center mt-16">
              <button
                onClick={runMatchmaking}
                disabled={loading || candidates.length === 0}
                className="w-full md:w-auto px-20 py-6 bg-slate-900 text-white rounded-[2rem] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 disabled:opacity-50 group overflow-hidden relative"
              >
                <span className="relative z-10">{loading ? 'Synchronizing Cosmic Alignments...' : 'Synthesize Match'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      {multiResults && !activeReportData && (
        <div className="max-w-5xl mx-auto p-4 pt-20 pb-32">
          <button
            onClick={() => setMultiResults(null)}
            className="mb-8 bg-white px-6 py-3 rounded-full shadow-sm text-slate-900 font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all border border-slate-100"
          >
            ← Back to Editor
          </button>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif italic text-black mb-4">Compatibility Leaderboard</h2>
            <p className="text-slate-500 font-medium">Ranked matches for {primaryProfile.name}</p>
          </div>

          <div className="space-y-6">
            {multiResults.map((result, index) => (
              <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center font-black text-2xl text-indigo-500">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{result.candidate_info.title} {result.candidate_info.name}</h3>
                    <div className="flex gap-4">
                      <div className="bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/50">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">Success Prob</span>
                        <span className="text-sm font-bold text-indigo-900">{result.report?.success_probability?.toFixed(1) || 0}%</span>
                      </div>
                      <div className="bg-pink-50 px-3 py-1 rounded-lg border border-pink-100/50">
                        <span className="text-[9px] font-black uppercase tracking-widest text-pink-400 block mb-0.5">Guna Score</span>
                        <span className="text-sm font-bold text-pink-900">{result.report?.guna_milan?.total_score?.toFixed(1) || 0} / 36</span>
                      </div>
                    </div>
                    {/* Vimshottari Dasha preview */}

                  </div>
                </div>
                <button
                  onClick={() => setActiveReportData(result)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Analyze
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Report Section */}
      {activeReportData && (
        <div className="relative">
          <button
            onClick={() => setActiveReportData(null)}
            className="fixed top-8 left-8 z-50 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl text-slate-900 font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all border border-slate-100"
          >
            ← Back to Leaderboard
          </button>
          <CompatibilityDashboard
            bride={`${activeReportData.bride_info.title} ${activeReportData.bride_info.name}`}
            groom={`${activeReportData.groom_info.title} ${activeReportData.groom_info.name}`}
            brideFullData={activeReportData.bride_info}
            groomFullData={activeReportData.groom_info}
            report={activeReportData.report}
            bride_vimshottari={activeReportData.bride_vimshottari}
            groom_vimshottari={activeReportData.groom_vimshottari}
          />
        </div>
      )}

      {wsAlert && (
        <div className="fixed bottom-6 right-6 bg-indigo-900/90 backdrop-blur-md border border-indigo-500 rounded-2xl p-4 shadow-2xl z-50 animate-bounce flex items-start gap-4 max-w-sm">
          <div className="text-2xl mt-1">📡</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{wsAlert.event}</div>
            <div className="text-sm text-indigo-50 leading-tight">
              {wsAlert.data?.step || wsAlert.data?.status || (wsAlert.data?.final_score && `Analysis Complete! Score: ${Math.round(wsAlert.data.final_score)}`) || 'Processing...'}
            </div>
          </div>
        </div>
      )}

      {!activeReportData && (
        <footer className="w-full text-center py-8 text-slate-500 text-xs font-semibold border-t border-slate-100 bg-white mt-12">
          Copyright © 2026 Phanom Technologies. All Rights Reserved
        </footer>
      )}

    </div>
  );
};

export default MatchmakingPage;
