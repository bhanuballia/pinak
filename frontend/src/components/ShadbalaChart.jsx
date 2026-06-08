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

const ABBREV = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa" };

const MiniSvgChart = ({ title, data, dataKey, forceMin, forceMax, step = 10 }) => {
  const chartHeight = 160;
  const chartWidth = 240;
  const margin = { top: 20, right: 10, bottom: 40, left: 35 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  let calcMin = Math.min(...data.map(d => d[dataKey] || 0));
  let calcMax = Math.max(...data.map(d => d[dataKey] || 0));

  let yMin = forceMin !== undefined ? forceMin : Math.max(0, Math.floor(calcMin / 10) * 10 - 10);
  let yMax = forceMax !== undefined ? forceMax : Math.ceil(calcMax / 10) * 10 + 10;

  if (forceMin === undefined && forceMax === undefined && (yMax - yMin) > 100) {
    step = 20;
    if ((yMax - yMin) > 200) step = 50;
  }

  const ticks = [];
  for (let i = yMin; i <= yMax; i += step) {
    ticks.push(i);
  }
  if (ticks[ticks.length - 1] < yMax) ticks.push(yMax);

  const getY = (val) => {
    const v = Math.max(yMin, Math.min(yMax, val));
    return innerHeight - ((v - yMin) / (yMax - yMin)) * innerHeight;
  };

  const barWidth = innerWidth / data.length * 0.7;
  const spacing = innerWidth / data.length;

  return (
    <div className="bg-white flex flex-col items-center justify-center pt-2 pb-1 w-full h-full">
      <div className="text-[11px] font-bold text-gray-600 mb-2 font-sans tracking-tight">{title}</div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines and Y-axis labels */}
          {ticks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={`y-${i}`}>
                <text x="-6" y={y} dominantBaseline="middle" textAnchor="end" className="text-[9px] fill-gray-500 font-sans">
                  {tick}
                </text>
                <line x1="0" y1={y} x2={innerWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              </g>
            );
          })}

          {/* Axes */}
          <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="#e5e7eb" strokeWidth="1.5" />
          <line x1="0" y1={getY(0)} x2={innerWidth} y2={getY(0)} stroke="#e5e7eb" strokeWidth="1.5" />

          {/* Bars and X-axis labels */}
          {data.map((d, i) => {
            const val = d[dataKey] || 0;
            const x = i * spacing + (spacing - barWidth) / 2;
            const y = val >= 0 ? getY(val) : getY(0);
            const height = Math.abs(getY(val) - getY(0));

            return (
              <g key={`x-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(height, 1)}
                  fill="#a7b8ff"
                />
                <text
                  x={i * spacing + spacing / 2}
                  y={innerHeight + 14}
                  textAnchor="end"
                  transform={`rotate(-25, ${i * spacing + spacing / 2}, ${innerHeight + 14})`}
                  className="text-[9px] fill-gray-600 font-sans"
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const ShadbalaChart = ({ data, title }) => {
  if (!data || !data.planets) return <div className="p-6 text-center text-xs text-gray-400 italic font-serif">Awaiting Shad Bala Computations...</div>;

  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const scores = planets.map(p => {
    const pData = data.planets[p] || {};
    const config = PLANET_DATA[p];
    let total = pData.total || 0;

    // The backend now returns the correctly normalized Rupa score (0..10 scale).

    const percent = Math.min((total / 10) * 100, 100);
    const isSufficient = total >= config.min;

    return {
      name: p,
      ...config,
      total,
      percent,
      isSufficient,
      sthana: pData.sthana || 0,
      dig: pData.dig || 0,
      kala: pData.kala || 0,
      cheshta: pData.cheshta || 0,
      naisargika: pData.naisargika || 0,
      drik: pData.drik || 0,
      ratio_data: pData.ratio_data || { actual: 0, required: 1, ratio: 0, percent: 0 }
    };
  });

  const maxVal = Math.max(...scores.map(s => s.total), 10);
  const avgMinFrac = scores.reduce((acc, s) => acc + s.min, 0) / scores.length / maxVal;
  const greenHeightPct = (1 - avgMinFrac) * 100;
  const redHeightPct = avgMinFrac * 100;

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] font-serif overflow-hidden select-none border border-gray-300 shadow-inner">
      <div className="w-full text-center py-2 border-b bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 border-[#94a3b8] text-[#1e293b] font-serif font-black text-[14px] uppercase italic tracking-[0.2em] shadow-sm z-10 shrink-0">
        {title || "Shad Bala Analysis • Power Index"}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar flex flex-col relative">
        {/* Detailed List */}
        <div className="p-2 space-y-2.5 bg-white/50">
          {scores.map(s => (
            <div key={s.name} className={`p-2 rounded-lg border border-gray-100 shadow-sm ${s.bg} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-center mb-1.5 px-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm shadow-sm p-1 bg-white/80 rounded-full border border-gray-200 leading-none">{s.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-gray-800 uppercase tracking-tighter leading-none">{s.name}</span>
                    <span className="text-[10px] text-black-400 italic font-serif mt-0.5 leading-none">{s.hindi}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[12px] font-mono font-black ${s.isSufficient ? 'text-green-600' : 'text-amber-600'} drop-shadow-sm`}>
                      {s.total.toFixed(2)}
                    </span>
                    <span className="text-[14px] font-bold text-black-400 bg-white/50 px-1 rounded">Rupa</span>
                  </div>
                  <span className="text-[12px] uppercase tracking-tighter text-black-400 font-bold">Req: {s.min}</span>
                </div>
              </div>

              <div className="relative h-2.5 bg-gray-200/50 rounded-full border border-gray-300/40 p-[1px] shadow-inner overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-red-400/80 z-20 shadow-[0_0_2px_rgba(0,0,0,0.2)]"
                  style={{ left: `${(s.min / 10) * 100}%` }}
                  title={`Required Minimum: ${s.min} Rupa`}
                ></div>

                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[inset_-2px_0_4px_rgba(255,255,255,0.4)]`}
                  style={{
                    width: `${s.percent}%`,
                    backgroundColor: s.color,
                    opacity: 0.85,
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              </div>

              <div className="flex justify-between mt-1 px-1">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase">Potency Index</span>
                <span className={`text-[10.5px] font-black uppercase ${s.isSufficient ? 'text-green-500' : 'text-amber-500'}`}>
                  {s.isSufficient ? 'Sufficient' : 'Weak Status'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Strength Chart */}
        <div className="border-t-2 border-[#94a3b8] bg-[#fdfbf7] px-3 pt-2 pb-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-[#1e293b] uppercase tracking-widest font-serif">Shad Bala • Strength Chart</span>
            <div className="flex gap-3 ml-auto">
              <span className="flex items-center gap-1 text-[7px] font-bold text-green-700">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500"></span>Sufficient
              </span>
              <span className="flex items-center gap-1 text-[7px] font-bold text-red-700">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500"></span>Weak
              </span>
            </div>
          </div>

          <div
            className="relative w-full rounded-lg overflow-hidden border-[3px] border-pink-400 shadow-lg"
            style={{ height: "350px" }}
          >
            {/* Green zone (sufficient zone) */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{ height: `${greenHeightPct}%`, background: "#e9f0ecff" }}
            />
            {/* Red zone (weak zone) */}
            <div
              className="absolute left-0 right-0 bottom-0"
              style={{ height: `${redHeightPct}%`, background: "#f3ececff" }}
            />
            {/* White divider line at threshold */}
            <div
              className="absolute left-0 right-0 h-[1px] bg-white/80 z-10"
              style={{ top: `${greenHeightPct}%` }}
            />
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around px-3 pb-0 z-20">
              {scores.map((s) => {
                const barHeightPct = (s.total / maxVal) * 100;
                const barColor = s.isSufficient
                  ? "linear-gradient(to top, #15803d 0%, #22c55e 60%, #4ade80 100%)"
                  : "linear-gradient(to top, #991b1b 0%, #ef4444 60%, #fca5a5 100%)";
                const barBorder = s.isSufficient ? "#16a34a" : "#dc2626";
                return (
                  <div
                    key={s.name}
                    className="flex flex-col items-center justify-end h-full"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <div
                      className="w-full rounded-t-sm relative group"
                      style={{
                        maxWidth: "52px",
                        height: `${barHeightPct}%`,
                        background: barColor,
                        border: `1.5px solid ${barBorder}`,
                        boxShadow: s.isSufficient
                          ? "inset 0 2px 8px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.25)"
                          : "inset 0 2px 8px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.3)"
                      }}
                    >
                    </div>
                    <div
                      className="w-full text-center"
                      style={{ background: "transparent", minHeight: "36px", paddingTop: "4px" }}
                    >
                      <div
                        className="text-[14px] font-bold font-serif leading-tight"
                        style={{ color: s.isSufficient ? "#020f07ff" : "#0f0606ff" }}
                      >
                        {ABBREV[s.name]}
                      </div>
                      <div
                        className="text-[12px] font-mono font-bold leading-tight"
                        style={{ color: s.isSufficient ? "#04130aff" : "#1b0404ff" }}
                      >
                        {s.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Relative Strength Ratio Chart (Parashara Style) */}
        <div className="border-t-2 border-[#94a3b8] bg-[#fdfbf7] px-3 pt-3 pb-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-[#1e293b] uppercase tracking-widest font-serif">Relative Strength Ratio (BPHS)</span>
          </div>

          {/* Pure-div chart — no SVG distortion */}
          <div className="relative w-full border-2 border-black overflow-hidden shadow-sm" style={{ height: "400px" }}>
            {/* Background: green top half (ratio > 1.0), red bottom half (ratio < 1.0) */}
            <div className="absolute inset-0 top-0 h-1/2 bg-[#009900]"></div>
            <div className="absolute inset-0 top-1/2 h-1/2 bg-[#ff0000]"></div>
            {/* Midline at ratio = 1.0 (exactly 50% from top) */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-10"></div>

            {/* Bars container — flex row, no gap */}
            <div className="absolute inset-0 flex flex-row items-end gap-4 mx-4">
              {scores.map((s, i) => {
                const ratio = s.ratio_data.ratio;
                const clampedRatio = Math.min(Math.max(ratio, 0), 2.0);
                // height as % of container (200px = ratio 2.0)
                const barHeightPct = (clampedRatio / 2.0) * 100;

                const PLANET_TEXT_COLORS = {
                  Sun: "#cc0000",
                  Moon: "#333333",
                  Mars: "#cc0000",
                  Mercury: "#006600",
                  Jupiter: "#cc6600",
                  Venus: "#cc00cc",
                  Saturn: "#0000cc",
                };
                const textColor = PLANET_TEXT_COLORS[s.name] || "#333333";

                return (
                  <div
                    key={s.name}
                    className="relative flex-1 border-r border-black last:border-r-0 flex flex-col justify-end items-center"
                    style={{
                      height: `${barHeightPct}%`,
                      backgroundColor: "#fffff0",
                      borderTop: "1px solid #000",
                    }}
                  >
                    {/* Planet abbreviation */}
                    <span
                      className="text-[14px] font-bold font-serif leading-none mb-0.5"
                      style={{ color: textColor }}
                    >
                      {ABBREV[s.name]}
                    </span>
                    {/* Ratio value */}
                    <span
                      className="text-[12px] font-serif leading-none mb-8"
                      style={{ color: "#111111" }}
                    >
                      {ratio.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Breakdown Mini Charts */}
        <div className="border-t-2 border-[#94a3b8] bg-[#fdfbf7] p-3 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <MiniSvgChart title="Sthaana Bala In Rupas" data={scores} dataKey="sthana" forceMin={0} forceMax={250} step={50} />
            <MiniSvgChart title="Dig Bala In Rupas" data={scores} dataKey="dig" forceMin={0} forceMax={60} step={10} />
            <MiniSvgChart title="Kala Bala In Rupas" data={scores} dataKey="kala" forceMin={0} forceMax={300} step={50} />
            <MiniSvgChart title="Cheshta Bala In Rupas" data={scores} dataKey="cheshta" forceMin={0} forceMax={60} step={10} />
            <MiniSvgChart title="Naisargika Bala In Rupas" data={scores} dataKey="naisargika" forceMin={0} forceMax={60} step={10} />
            <MiniSvgChart title="Drik Bala In Rupas" data={scores} dataKey="drik" forceMin={-60} forceMax={60} step={20} />
          </div>
        </div>
      </div>

      <div className="p-2 bg-[#f8fafc] border-t border-gray-200 shrink-0">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[7px] font-black text-red-800 uppercase tracking-widest leading-none">Vedic Threshold Indicator</span>
        </div>
        <p className="text-[7.5px] text-gray-500 font-serif leading-tight text-justify">
          Shad Bala represents the mathematical aggregate strength of planets across six distinct dimensions. A score above the <b className="text-red-700">threshold</b> signifies a planet's ability to manifest its results fully during its dasha periods. Component breakdowns are displayed in classical Virupas.
        </p>
      </div>
    </div>
  );
};

export default ShadbalaChart;

