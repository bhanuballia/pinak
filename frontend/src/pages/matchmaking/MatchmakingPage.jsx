import React, { useState, useEffect } from 'react';
import CompatibilityDashboard from '../../components/matchmaking/CompatibilityDashboard';
import PlaceAutocomplete from '../../components/PlaceAutocomplete';

const MatchmakingPage = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [wsAlert, setWsAlert] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/matchmaking/alerts');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setWsAlert(data);
        setTimeout(() => setWsAlert(null), 3500);
      } catch (e) {}
    };
    return () => ws.close();
  }, []);
  
  const [brideData, setBrideData] = useState({ 
    title: 'Kumari',
    name: 'Anjali', 
    birth_date: '1992-06-15', 
    birth_time: '14:30', 
    tz_offset: 5.5, 
    lat: 28.6139, 
    lon: 77.2090,
    location_name: 'Delhi, India'
  });
  const [groomData, setGroomData] = useState({ 
    title: 'Shri',
    name: 'Rahul', 
    birth_date: '1988-02-07', 
    birth_time: '14:06', 
    tz_offset: 5.5, 
    lat: 25.7592, 
    lon: 84.1504,
    location_name: 'Ballia, Uttar Pradesh'
  });

  const runMatchmaking = async () => {
    setLoading(true);
    try {
      const payload = {
        bride: {
            ...brideData,
            lat: parseFloat(brideData.lat),
            lon: parseFloat(brideData.lon),
            tz_offset: parseFloat(brideData.tz_offset)
        },
        groom: {
            ...groomData,
            lat: parseFloat(groomData.lat),
            lon: parseFloat(groomData.lon),
            tz_offset: parseFloat(groomData.tz_offset)
        }
      };

      const response = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("Matchmaking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Input Section */}
      {!report && (
        <div className="max-w-6xl mx-auto p-4 md:p-12 pt-20 pb-32">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
             
             <div className="flex justify-center mb-8">
                <div className="relative group">
                   <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
                   <img 
                      src="/deities/marriage.jpg" 
                      alt="Divine Marriage" 
                      className="relative z-10 w-48 h-48 object-cover rounded-full border-4 border-white shadow-2xl transition-transform group-hover:scale-105"
                   />
                </div>
             </div>
             
             <div className="text-center mb-16">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-4 bg-indigo-50/50 px-6 py-2 rounded-full inline-block">Vedic Compatibility Portal</p>
                <h1 className="text-5xl md:text-6xl font-serif italic text-slate-900">Matchmaking Synthesis</h1>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-16 relative">
                <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-slate-100 -translate-x-1/2"></div>
                
                {/* Bride Section */}
                <div className="space-y-10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">👸</div>
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Bride's Attributes</h3>
                         <div className="text-[10px] font-bold text-pink-500 uppercase tracking-tighter">Female Energy (Shakti)</div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-4">
                         <div className="col-span-1">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Title</label>
                            <select 
                               value={brideData.title}
                               onChange={e => setBrideData({...brideData, title: e.target.value})}
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 text-sm font-bold text-slate-700"
                            >
                               <option>Kumari</option>
                               <option>Shrimati</option>
                            </select>
                         </div>
                         <div className="col-span-3">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Full Name</label>
                            <input 
                               placeholder="Enter name..." 
                               value={brideData.name} 
                               onChange={e => setBrideData({...brideData, name: e.target.value})} 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold placeholder:text-slate-300" 
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Date of Birth</label>
                            <input type="date" value={brideData.birth_date} onChange={e => setBrideData({...brideData, birth_date: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold" />
                         </div>
                         <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Time of Birth</label>
                            <input type="time" value={brideData.birth_time} onChange={e => setBrideData({...brideData, birth_time: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Birth Location</label>
                         <div className="relative matchmaking-place-search">
                            <PlaceAutocomplete value={brideData.location_name || ""} onSelect={(place) => {
                               setBrideData({
                                  ...brideData,
                                  lat: place.lat,
                                  lon: place.lon,
                                  tz_offset: place.tz_offset_hours,
                                  location_name: place.display_name
                               });
                            }} />
                            <div className="mt-3 grid grid-cols-3 gap-2 opacity-50 pointer-events-none">
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LAT: {parseFloat(brideData.lat).toFixed(4)}</div>
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LON: {parseFloat(brideData.lon).toFixed(4)}</div>
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">TZ: {brideData.tz_offset}</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Groom Section */}
                <div className="space-y-10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🤴</div>
                      <div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Groom's Attributes</h3>
                         <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Male Energy (Purusha)</div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-4">
                         <div className="col-span-1">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Title</label>
                            <select 
                               value={groomData.title}
                               onChange={e => setGroomData({...groomData, title: e.target.value})}
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700"
                            >
                               <option>Shri</option>
                               <option>Kumar</option>
                            </select>
                         </div>
                         <div className="col-span-3">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Full Name</label>
                            <input 
                               placeholder="Enter name..." 
                               value={groomData.name} 
                               onChange={e => setGroomData({...groomData, name: e.target.value})} 
                               className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold placeholder:text-slate-300" 
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Date of Birth</label>
                            <input type="date" value={groomData.birth_date} onChange={e => setGroomData({...groomData, birth_date: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                         </div>
                         <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Time of Birth</label>
                            <input type="time" value={groomData.birth_time} onChange={e => setGroomData({...groomData, birth_time: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1">Birth Location</label>
                         <div className="relative matchmaking-place-search">
                            <PlaceAutocomplete value={groomData.location_name || ""} onSelect={(place) => {
                               setGroomData({
                                  ...groomData,
                                  lat: place.lat,
                                  lon: place.lon,
                                  tz_offset: place.tz_offset_hours,
                                  location_name: place.display_name
                               });
                            }} />
                            <div className="mt-3 grid grid-cols-3 gap-2 opacity-50 pointer-events-none">
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LAT: {parseFloat(groomData.lat).toFixed(4)}</div>
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">LON: {parseFloat(groomData.lon).toFixed(4)}</div>
                               <div className="text-[8px] font-bold uppercase text-slate-400 p-2 bg-slate-50 rounded-lg text-center">TZ: {groomData.tz_offset}</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-center">
                <button 
                   onClick={runMatchmaking} 
                   disabled={loading}
                   className="w-full md:w-auto px-20 py-6 bg-slate-900 text-white rounded-[2rem] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 disabled:opacity-50 group overflow-hidden relative"
                >
                   <span className="relative z-10">{loading ? 'Synchronizing Cosmic Alignments...' : 'Synthesize Match'}</span>
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Report Section */}
      {report && (
        <div className="relative">
          <button 
            onClick={() => setReport(null)} 
            className="fixed top-8 left-8 z-50 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl text-slate-900 font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all border border-slate-100"
          >
            ← Modify Data
          </button>
          <CompatibilityDashboard 
            bride={`${brideData.title} ${brideData.name}`} 
            groom={`${groomData.title} ${groomData.name}`} 
            brideFullData={brideData}
            groomFullData={groomData}
            report={report} 
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

    </div>
  );
};

export default MatchmakingPage;
