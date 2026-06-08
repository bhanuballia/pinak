import React from 'react';

export default function MonthlyTimeline({ timeline }) {
  if (!timeline) return null;

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'High': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Intense': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Caution': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Moderate':
      default: return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    }
  };

  const getSidebarColor = (intensity) => {
    switch (intensity) {
      case 'High': return 'bg-emerald-500 group-hover:bg-emerald-600';
      case 'Intense': return 'bg-purple-500 group-hover:bg-purple-600';
      case 'Caution': return 'bg-rose-500 group-hover:bg-rose-600';
      case 'Moderate':
      default: return 'bg-indigo-500 group-hover:bg-indigo-600';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">Monthly Forecast Timeline</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timeline.map((item, index) => {
          const intensity = item.intensity || 'Active';
          const badgeColor = getIntensityColor(intensity);
          const sidebarColor = getSidebarColor(intensity);

          return (
            <div
              key={index}
              className="group relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${sidebarColor} transition-colors`}></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{item.month}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
                  {intensity}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {item.prediction}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
