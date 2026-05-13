import React from 'react';

const NumericalPanel = ({ data }) => {
  const n = data?.favourable?.numerology || {};
  const hasData = n.radical_number != null || n.destiny_number != null || n.life_path_number != null;

  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-[#f8fbff]">
        <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🔢 Numerology Insights
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">🔢</span>
          <p className="text-[10px] text-gray-400 italic">Numerology data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load numerology insights.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Radical", val: n.radical_number, color: "text-blue-600" },
    { label: "Destiny", val: n.destiny_number, color: "text-purple-600" },
    { label: "Life Path", val: n.life_path_number, color: "text-indigo-600" },
    { label: "Lucky Day", val: n.lucky_day?.[0], color: "text-green-600" },
    { label: "Mantra", val: n.lucky_mantra, color: "text-amber-600", full: true },
    { label: "Lucky Stone", val: n.lucky_stone, color: "text-rose-600" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fbff]">
      <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🔢 Numerology Insights
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-2">
          {items.filter(i => !i.full).map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-blue-50/50 shadow-sm">
              <div className="text-[7px] font-black text-gray-400 uppercase mb-0.5">{item.label}</div>
              <div className={`text-[11px] font-black ${item.color}`}>{item.val || "---"}</div>
            </div>
          ))}
        </div>
        {items.filter(i => i.full).map((item, idx) => (
          <div key={idx} className="bg-indigo-50/50 p-2 rounded border border-indigo-100">
            <div className="text-[7px] font-black text-indigo-400 uppercase mb-1">{item.label}</div>
            <div className="text-[9px] font-serif italic text-indigo-900 leading-tight">"{item.val}"</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumericalPanel;
