import React, { useState, useEffect, useRef } from 'react';

const TARA_COLORS = {
  'जन्म': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-200' },
  'सम्पद': { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-200' },
  'विपद': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-200' },
  'क्षेम': { bg: 'bg-teal-50', text: 'text-teal-700', badge: 'bg-teal-200' },
  'प्रत्यरि': { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-200' },
  'साधक': { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-200' },
  'वध': { bg: 'bg-rose-50', text: 'text-rose-800', badge: 'bg-rose-200' },
  'मित्र': { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-200' },
  'परम मित्र': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-200' },
};

const PLANET_COLORS = {
  Sun: '#f59e0b', Moon: '#6366f1', Mars: '#ef4444', Mercury: '#10b981',
  Jupiter: '#f97316', Venus: '#ec4899', Saturn: '#64748b', Rahu: '#0ea5e9', Ketu: '#8b5cf6',
};

export default function VimshottariTable({ data: worksheetData, transitDate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [levels, setLevels] = useState(5); // 2 = MD-AD, 5 = Panchastariya
  const [showWindowsModal, setShowWindowsModal] = useState(false);
  const PAGE_SIZE = 12;
  const currentRowRef = useRef(null);

  useEffect(() => {
    if (!worksheetData) return;

    const basic = worksheetData?.basic_details || {};
    const meta = worksheetData?.meta || {};

    const date = basic.birth_date || meta.date || '1990-10-01';
    let time = basic.birth_time || meta.time || '12:00:00';
    if (time && time.split(':').length === 2) time = time + ':00';

    const tz = parseFloat(basic.tz_offset ?? meta.tz_offset ?? 5.5);
    const lat = parseFloat(basic.lat ?? 28.6);
    const lon = parseFloat(basic.lon ?? 77.2);

    // Extract moon_lon from planet_positions if available
    const moonPos = (worksheetData.planet_positions || []).find(p => p.planet === 'Moon');
    const moon_lon = moonPos?.degree ?? -1;

    setLoading(true);
    setError(null);

    fetch('/api/vimshottari-table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        time,
        tz,
        lat,
        lon,
        moon_lon,
        levels,
        transit_date: transitDate ? transitDate.toISOString() : null
      }),
    })
      .then(r => r.json())
      .then(json => {
        const fetchedRows = json.rows || [];
        setRows(fetchedRows);
        const idx = fetchedRows.findIndex(r => r.is_current);
        const ci = idx >= 0 ? idx : 0;
        setCurrentIdx(ci);
        setPage(Math.floor(ci / PAGE_SIZE));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load Vimshottari data. Check backend.');
        setLoading(false);
      });
  }, [worksheetData, levels, transitDate]);

  useEffect(() => {
    if (currentRowRef.current) {
      currentRowRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [rows, page]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToCurrent = () => {
    setPage(Math.floor(currentIdx / PAGE_SIZE));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-rose-100 font-sans">
        <Header page={page} totalPages={totalPages} onPrev={() => { }} onNext={() => { }} onCurrent={() => { }} levels={levels} onLevelsChange={setLevels} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="text-xs text-gray-400 font-serif italic">दशा गणना हो रही है...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white font-sans">
        <Header page={page} totalPages={totalPages} onPrev={() => { }} onNext={() => { }} onCurrent={() => { }} levels={levels} onLevelsChange={setLevels} />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-red-500 italic text-center">{error}</p>
        </div>
      </div>
    );
  }

  const jumpTime = (yearsToAdd) => {
    if (rows.length === 0) return;
    const currentFirstRow = rows[page * PAGE_SIZE] || rows[0];
    const currentDate = new Date(currentFirstRow.start_date);

    if (isNaN(currentDate.getTime())) {
      setPage(p => Math.max(0, Math.min(totalPages - 1, p + Math.sign(yearsToAdd) * 5)));
      return;
    }

    currentDate.setFullYear(currentDate.getFullYear() + yearsToAdd);
    const targetTime = currentDate.getTime();

    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < rows.length; i++) {
      const d = new Date(rows[i].start_date);
      if (!isNaN(d.getTime())) {
        const diff = Math.abs(d.getTime() - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
    }

    setPage(Math.floor(closestIdx / PAGE_SIZE));
  };
  const nextMarriageRow = rows.slice(currentIdx).find(r => r.marriage_favorable);
  const getUpcomingWindows = () => {
    const list = [];
    const seenChains = new Set();
    for (let i = currentIdx; i < rows.length; i++) {
      const r = rows[i];
      if (r.marriage_favorable) {
        const key = `${r.md}-${r.ad}`;
        if (!seenChains.has(key)) {
          seenChains.add(key);
          list.push({ ...r, index: i });
          if (list.length >= 3) break;
        }
      }
    }
    return list;
  };
  const upcomingWindows = getUpcomingWindows();

  return (
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
      <Header
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(0, p - 1))}
        onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))}
        onFirst={() => jumpTime(-1)}
        onLast={() => jumpTime(1)}
        onCurrent={goToCurrent}
        rowCount={rows.length}
        levels={levels}
        onLevelsChange={setLevels}
      />

      {nextMarriageRow && (
        <div className="shrink-0 bg-pink-50 border-b border-pink-100 px-3 py-2 flex items-center justify-between text-xs text-pink-900 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-sm">💍</span>
            <span>
              {nextMarriageRow.is_current 
                ? <strong>Active Marriage Dasha!</strong> 
                : <span>Next Marriage Dasha:</span>}
              {' '}{nextMarriageRow.dasha_chain} starting at age <strong>{nextMarriageRow.age}</strong> ({nextMarriageRow.start_date})
            </span>
          </span>
          <button 
            onClick={() => setShowWindowsModal(true)}
            className="text-[9px] font-black uppercase tracking-widest text-pink-600 bg-pink-100 hover:bg-pink-200 px-2.5 py-1 rounded-lg transition-all border border-pink-200/50"
          >
            Show Windows
          </button>
        </div>
      )}

      {/* Column Headers */}
      <div className="shrink-0 grid grid-cols-[2.2fr_0.4fr_1fr_0.5fr_0.9fr_0.4fr_1.6fr] bg-indigo-100 text-black text-[12px] font-black uppercase tracking-wider border-b border-slate-700">
        <div className="px-1.5 py-1.5 border-r border-slate-600">दशाएँ</div>
        <div className="px-1 py-1.5 border-r border-slate-600 text-center">उम्र</div>
        <div className="px-1.5 py-1.5 border-r border-slate-600">आरम्भ दिनांक</div>
        <div className="px-1 py-1.5 border-r border-slate-600 text-center">समय</div>
        <div className="px-1.5 py-1.5 border-r border-slate-600 text-center">नक्षत्र दूरी</div>
        <div className="px-1 py-1.5 border-r border-slate-600 text-center">राशि दूरी</div>
        <div className="px-1.5 py-1.5 text-center">गोचर में दशा स्वामी</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {pageRows.map((row, i) => {
          const globalIdx = page * PAGE_SIZE + i;
          const isCurrent = row.is_current;
          const tColors = TARA_COLORS[row.tara_name] || { bg: '', text: 'text-slate-600', badge: 'bg-slate-100' };
          const chainParts = (row.dasha_chain || '').split('-');
          const mdColor = PLANET_COLORS[row.md] || '#666';

          return (
            <div
              key={globalIdx}
              ref={isCurrent ? currentRowRef : null}
              className={`grid grid-cols-[2.2fr_0.4fr_1fr_0.5fr_0.9fr_0.4fr_1.6fr] text-[14px] border-black transition-all
                ${isCurrent
                  ? 'bg-amber-100 border-amber-300 shadow-inner'
                  : i % 2 === 0 ? 'bg-rose-100 hover:bg-slate-50' : 'bg-rose-100 hover:bg-slate-100'
                }`}
            >
              {/* Dasha Chain */}
              <div className="px-1.5 py-1 flex items-center gap-1 border-r border-slate-100 overflow-hidden">
                <div className="w-1 h-full min-h-[12px] rounded-full shrink-0" style={{ backgroundColor: mdColor }}></div>
                <span className="font-bold text-slate-800 truncate tracking-tight leading-tight" title={row.dasha_chain}>
                  {row.dasha_chain}
                </span>
                {row.marriage_favorable && (
                  <span className="shrink-0 text-[10px]" title="Favorable Marriage Period">💍</span>
                )}
                {isCurrent && (
                  <span className="ml-auto shrink-0 text-[12px] bg-amber-500 text-white px-1 rounded font-black">●</span>
                )}
              </div>
              {/* Age */}
              <div className="px-1 py-1 text-center font-bold text-slate-900 border-r border-slate-100">{row.age}</div>
              {/* Start Date */}
              <div className="px-1.5 py-1 font-mono text-indigo-800 font-semibold border-r border-slate-100">{row.start_date}</div>
              {/* Time */}
              <div className="px-1 py-1 text-center font-mono text-slate-900 border-r border-slate-100">{row.start_time}</div>
              {/* Nakshatra Distance */}
              <div className={`px-1 py-1 text-center border-r border-slate-100 flex flex-col items-center justify-center gap-0.5`}>
                <span className={`text-[14px] font-black ${tColors.text}`}>{row.nak_distance ?? row.tara_num}</span>
                <span className={`text-[12px] font-bold leading-none ${tColors.text} opacity-75 truncate max-w-full`}>{row.tara_name}</span>
              </div>
              {/* Rashi Distance */}
              <div className="px-1 py-1 text-center font-black text-slate-700 border-r border-slate-100">{row.rashi_distance}</div>
              {/* Gochar */}
              <div className="px-1.5 py-1 text-center text-slate-900 font-mono text-[13px] leading-tight break-words">{row.gochar}</div>
            </div>
          );
        })}

        {pageRows.length === 0 && (
          <div className="flex items-center justify-center h-24 text-[10px] text-gray-400 italic">
            इस समय के आसपास कोई दशा पंक्ति नहीं मिली।
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-3 py-1 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-[7.5px] text-slate-400 italic font-serif">
          {levels === 1 ? `एकस्तरीय विंशोत्तरी दशा · महादशा स्तर · ${rows.length} पंक्तियाँ` :
            levels === 2 ? `द्विस्तरीय विंशोत्तरी दशा · महादशा - अंतरदशा स्तर · ${rows.length} पंक्तियाँ` :
              levels === 3 ? `त्रिस्तरीय विंशोत्तरी दशा · प्रत्यंतर दशा स्तर · ${rows.length} पंक्तियाँ` :
                levels === 4 ? `चतुःस्तरीय विंशोत्तरी दशा · सूक्ष्म दशा स्तर · ${rows.length} पंक्तियाँ` :
                  `पंचस्तरीय विंशोत्तरी दशा · प्राण दशा स्तर · ${rows.length} पंक्तियाँ`}
        </p>
        <p className="text-[7.5px] text-slate-500 font-mono">
          पृष्ठ {page + 1} / {totalPages}
        </p>
      </div>

      {showWindowsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setShowWindowsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg"
            >
              ✕
            </button>
            <h4 className="text-lg font-serif italic font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>💍</span> Favorable Marriage Windows
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Here are the next upcoming favorable Vimshottari dasha periods for marriage:
            </p>
            
            <div className="space-y-3 mb-4">
              {upcomingWindows.map((win, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-pink-200 hover:bg-pink-50/20 transition-all">
                  <div>
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block mb-1">
                      Window #{idx + 1} {win.is_current && "(Active)"}
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {win.dasha_chain}
                    </span>
                    <span className="text-xs text-slate-500">
                      Starts Age {win.age} · {win.start_date}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPage(Math.floor(win.index / PAGE_SIZE));
                      setShowWindowsModal(false);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    Jump to Row
                  </button>
                </div>
              ))}
              {upcomingWindows.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">No upcoming favorable marriage windows found in this sequence.</p>
              )}
            </div>
            
            <button
              onClick={() => setShowWindowsModal(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ page, totalPages, onPrev, onNext, onFirst, onLast, rowCount, levels, onLevelsChange }) {
  const levelNames = {
    1: "महादशा",
    2: "महादशा - अंतरदशा",
    3: "त्रिस्तरीय · Dasha",
    4: "चतुःस्तरीय · Dasha",
    5: "पंचस्तरीय · Dasha"
  };

  return (
    <div className="shrink-0 flex items-center justify-between px-2 py-1 bg-indigo-100 border-b border-slate-700">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-white flex items-center justify-center text-white text-[10px] font-black">⏳</div>
        <span className="text-black text-[14px] font-black font-serif tracking-widest uppercase">विंशोत्तरी</span>
        {rowCount > 0 && (
          <span className="text-[12px] text-black font-bold bg-indigo-100 px-1.5 py-0.5 rounded-full ml-1">
            {levelNames[levels]}
          </span>
        )}
      </div>

      {/* Levels Selector Switch */}
      <div className="flex items-center rounded border border-black mx-2 overflow-hidden bg-amber-100">
        <button
          onClick={() => onLevelsChange && onLevelsChange(Math.max(1, levels - 1))}
          disabled={levels <= 1}
          className="px-2.5 py-0.5 text-black text-[25px] font-bold hover:bg-slate-600 disabled:opacity-30 border-r border-black"
          title="Decrease Depth"
        >
          -
        </button>
        <span className="px-2 text-[20px] text-black font-bold tracking-widest uppercase">
          L{levels}
        </span>
        <button
          onClick={() => onLevelsChange && onLevelsChange(Math.min(5, levels + 1))}
          disabled={levels >= 5}
          className="px-2.5 py-0.5 text-black  text-[25px] font-bold hover:bg-slate-600 disabled:opacity-30 border-l border-black"
          title="Increase Depth"
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-1">
        <NavBtn onClick={onFirst} title="-1 वर्ष" disabled={page === 0}>⟪</NavBtn>
        <NavBtn onClick={onPrev} title="पिछला" disabled={page === 0}>◀</NavBtn>
        <NavBtn onClick={onNext} title="अगला" disabled={page >= totalPages - 1}>▶</NavBtn>
        <NavBtn onClick={onLast} title="+1 वर्ष" disabled={page >= totalPages - 1}>⟫</NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ onClick, children, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-6 h-6 rounded flex items-center justify-center text-[20px] font-black transition-all
        ${disabled
          ? 'bg-white text-slate-900 cursor-not-allowed'
          : 'bg-white text-slate-900 hover:bg-indigo-500 active:scale-90'
        }`}
    >
      {children}
    </button>
  );
}
