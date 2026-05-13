import React from "react";

const PLANET_DATA = {
  "Sun": { color: "#ef4444", hindi: "Surya", min: 5.0, icon: "☀️", bg: "bg-red-50", text: "text-red-800" },
  "Moon": { color: "#475569", hindi: "Chandra", min: 6.0, icon: "🌙", bg: "bg-slate-50", text: "text-slate-800" },
  "Mars": { color: "#dc2626", hindi: "Mangal", min: 5.0, icon: "⚔️", bg: "bg-red-50", text: "text-red-900" },
  "Mercury": { color: "#16a34a", hindi: "Budha", min: 7.0, icon: "🌱", bg: "bg-emerald-50", text: "text-emerald-800" },
  "Jupiter": { color: "#d97706", hindi: "Guru", min: 6.5, icon: "☸️", bg: "bg-amber-50", text: "text-amber-800" },
  "Venus": { color: "#db2777", hindi: "Shukra", min: 5.5, icon: "💎", bg: "bg-pink-50", text: "text-pink-800" },
  "Saturn": { color: "#4338ca", hindi: "Shani", min: 5.0, icon: "🪐", bg: "bg-indigo-50", text: "text-indigo-800" }
};

const ShadbalaChart = ({ data, title }) => {
  if (!data || !data.planets) return <div className="p-6 text-center text-xs text-gray-400 italic font-serif">Awaiting Shad Bala Computations...</div>;

  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const scores = planets.map(p => {
    const pData = data.planets[p] || {};
    const config = PLANET_DATA[p];
    const total = pData.total || 0;
    // We scale based on common max possible usually around 10-12
    const percent = Math.min((total / 10) * 100, 100); 
    const isSufficient = total >= config.min;
    
    return { name: p, ...config, total, percent, isSufficient };
  });

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] font-serif overflow-hidden select-none border border-gray-300 shadow-inner">
      <div className="w-full text-center py-2 border-b bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 border-[#94a3b8] text-[#1e293b] font-serif font-black text-[10px] uppercase italic tracking-[0.2em] shadow-sm">
        {title || "Shad Bala Analysis • Power Index"}
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-2.5 custom-scrollbar bg-white/50">
        {scores.map(s => (
          <div key={s.name} className={`p-2 rounded-lg border border-gray-100 shadow-sm ${s.bg} transition-all hover:shadow-md`}>
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm shadow-sm p-1 bg-white/80 rounded-full border border-gray-200 leading-none">{s.icon}</span>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter leading-none">{s.name}</span>
                   <span className="text-[7.5px] text-gray-400 italic font-serif mt-0.5 leading-none">{s.hindi}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[12px] font-mono font-black ${s.isSufficient ? 'text-green-600' : 'text-amber-600'} drop-shadow-sm`}>
                    {s.total.toFixed(2)}
                  </span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/50 px-1 rounded">Rupa</span>
                </div>
                <span className="text-[7px] uppercase tracking-tighter text-gray-400 font-bold">Req: {s.min}</span>
              </div>
            </div>

            <div className="relative h-2.5 bg-gray-200/50 rounded-full border border-gray-300/40 p-[1px] shadow-inner overflow-hidden">
               {/* Minimal Benchmark Notch */}
               <div 
                 className="absolute top-0 bottom-0 w-[2px] bg-red-400/80 z-20 shadow-[0_0_2px_rgba(0,0,0,0.2)]" 
                 style={{ left: `${(s.min/10)*100}%` }}
                 title={`Required Minimum: ${s.min} Rupa`}
               ></div>
               
               {/* Progress Fill */}
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[inset_-2px_0_4px_rgba(255,255,255,0.4)]`}
                 style={{ 
                   width: `${s.percent}%`,
                   backgroundColor: s.color,
                   opacity: 0.85,
                   backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                 }}
               />
               
               {/* Subtle Glass Tint */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="flex justify-between mt-1 px-1">
               <span className="text-[6.5px] font-bold text-gray-400 uppercase">Potency Index</span>
               <span className={`text-[6.5px] font-black uppercase ${s.isSufficient ? 'text-green-500' : 'text-amber-500'}`}>
                 {s.isSufficient ? 'Sufficient' : 'Weak Status'}
               </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 bg-[#f8fafc] border-t border-gray-200">
         <div className="flex items-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[7px] font-black text-red-800 uppercase tracking-widest leading-none">Vedic Threshold Indicator</span>
         </div>
         <p className="text-[7.5px] text-gray-500 font-serif leading-tight text-justify">
           Shad Bala represents the mathematical aggregate strength of planets across six distinct dimensions. A score above the <b className="text-red-700">threshold</b> signifies a planet's ability to manifest its results fully during its dasha periods.
         </p>
      </div>
    </div>
  );
};

export default ShadbalaChart;
