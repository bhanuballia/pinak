import React from 'react';

const PanchangPanel = ({ data }) => {
  const p = data?.panchang || {};
  // Check if we have any actual data beyond just the keys
  const hasPanchang = !!(p.tithi?.tithi_name || p.nakshatra?.nakshatra_name || p.yoga?.yoga_name || p.karana?.karana_name);

  if (!hasPanchang) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🗞️ Panchang & Solar data
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">📅</span>
          <p className="text-[10px] text-gray-400 italic">Panchang data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load Tithi, Nakshatra & Yoga.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Tithi", value: p.tithi?.tithi_name, icon: "🌑" },
    { label: "Nakshatra", value: p.nakshatra?.nakshatra_name, icon: "⭐" },
    { label: "Yoga", value: p.yoga?.yoga_name, icon: "🌀" },
    { label: "Karana", value: p.karana?.karana_name, icon: "🐘" },
    { label: "Sunrise", value: data.meta?.sunrise || "N/A", icon: "🌅" },
    { label: "Sunset", value: data.meta?.sunset || "N/A", icon: "🌇" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🗞️ Panchang & Solar data
      </div>
      <div className="flex-1 p-2 grid grid-cols-2 gap-2 overflow-auto custom-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-2 rounded border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{item.icon}</span>
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-800 truncate">{item.value || "---"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanchangPanel;
