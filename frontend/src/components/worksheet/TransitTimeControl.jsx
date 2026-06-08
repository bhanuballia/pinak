import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Time step definitions ────────────────────────────────────────────────────
const TIME_STEPS = [
  { id: "10y",  label: "10 वर्ष", seconds: 10 * 365.25 * 24 * 3600, color: "#7c3aed" },
  { id: "1y",   label: "1 वर्ष",  seconds: 365.25 * 24 * 3600,      color: "#6d28d9" },
  { id: "1m",   label: "1 मास",   seconds: 30.44 * 24 * 3600,       color: "#1d4ed8" },
  { id: "1w",   label: "सप्ताह",  seconds: 7 * 24 * 3600,           color: "#0369a1" },
  { id: "1d",   label: "दिन",     seconds: 24 * 3600,               color: "#0f766e" },
  { id: "lagna",label: "लग्न",    seconds: 2 * 3600,                color: "#b45309", special: true },
  { id: "1h",   label: "घंटे",    seconds: 3600,                    color: "#065f46" },
  { id: "10min",label: "10 मिनट", seconds: 600,                     color: "#166534" },
  { id: "1min", label: "मिनट",    seconds: 60,                      color: "#15803d" },
  { id: "10s",  label: "10 सेकेंड",seconds: 10,                      color: "#4d7c0f" },
  { id: "1s",   label: "सेकेंड",  seconds: 1,                       color: "#86198f" },
];

// ─── Hindi day / month names ──────────────────────────────────────────────────
const HINDI_DAYS = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
const HINDI_MONTHS = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];

function pad(n) { return String(n).padStart(2, "0"); }

function formatHindi(dt) {
  const day   = HINDI_DAYS[dt.getDay()];
  const date  = dt.getDate();
  const month = HINDI_MONTHS[dt.getMonth()];
  const year  = dt.getFullYear();
  const hh    = pad(dt.getHours());
  const mm    = pad(dt.getMinutes());
  const ss    = pad(dt.getSeconds());
  return `${day} ${date} ${month} ${year}  ${hh}:${mm}:${ss}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TransitTimeControl = ({ lat, lon, varga = 1, onTransitChange }) => {
  const [simTime, setSimTime]       = useState(new Date());
  const [mode, setMode]             = useState("pause");   // pause | current | dynamic
  const [activeStep, setActiveStep] = useState("1d");
  const [direction, setDirection]   = useState(1);         // +1 forward, -1 backward
  const [picklist, setPicklist]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  const dynamicRef = useRef(null);
  const fetchDebounce = useRef(null);

  // ── Fetch transit for given datetime ────────────────────────────────────────
  const fetchTransit = useCallback(async (dt) => {
    setIsLoading(true);
    try {
      const dateStr = dt.toISOString().split("T")[0];
      const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
      const tz_offset = (dt.getTimezoneOffset() / -60.0).toFixed(1);
      const res = await fetch(
        `/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat || 28.6}&lon=${lon || 77.2}&varga=${varga}`
      );
      const json = await res.json();
      if (json.positions) {
        onTransitChange(json.positions, new Date(dt));
        setLastFetched(new Date(dt));
      }
    } catch (e) {
      console.error("TransitTimeControl fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lon, varga, onTransitChange]);

  // ── Debounced fetch ──────────────────────────────────────────────────────────
  const scheduleFetch = useCallback((dt) => {
    clearTimeout(fetchDebounce.current);
    fetchDebounce.current = setTimeout(() => fetchTransit(dt), 350);
  }, [fetchTransit]);

  // ── Step increment / decrement ───────────────────────────────────────────────
  const step = useCallback((dir) => {
    const stepDef = TIME_STEPS.find(s => s.id === activeStep);
    if (!stepDef) return;
    setSimTime(prev => {
      const next = new Date(prev.getTime() + dir * stepDef.seconds * 1000);
      scheduleFetch(next);
      return next;
    });
    setMode("pause");
  }, [activeStep, scheduleFetch]);

  // ── Mode effects ─────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(dynamicRef.current);

    if (mode === "current") {
      const now = new Date();
      setSimTime(now);
      fetchTransit(now);
      dynamicRef.current = setInterval(() => {
        const n = new Date();
        setSimTime(n);
        fetchTransit(n);
      }, 30000); // refresh every 30 s
    }

    if (mode === "dynamic") {
      const stepDef = TIME_STEPS.find(s => s.id === activeStep);
      const interval = Math.max(800, 5000 / Math.max(1, Math.log10(stepDef?.seconds || 60)));
      dynamicRef.current = setInterval(() => {
        setSimTime(prev => {
          const next = new Date(prev.getTime() + direction * (stepDef?.seconds || 86400) * 1000);
          scheduleFetch(next);
          return next;
        });
      }, interval);
    }

    return () => clearInterval(dynamicRef.current);
  }, [mode, activeStep, direction, fetchTransit, scheduleFetch]);

  // ── Initial fetch on mount ───────────────────────────────────────────────────
  useEffect(() => { fetchTransit(new Date()); }, []); // eslint-disable-line

  // ── Add to picklist ──────────────────────────────────────────────────────────
  const addToPicklist = () => {
    const entry = { dt: new Date(simTime), label: formatHindi(simTime) };
    setPicklist(prev => [entry, ...prev].slice(0, 20));
  };

  const loadFromPicklist = (entry) => {
    setSimTime(new Date(entry.dt));
    setMode("pause");
    fetchTransit(new Date(entry.dt));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>⏱</span>
        <span style={styles.headerTitle}>काल नियंत्रण — Transit Time Engine</span>
        {isLoading && <span style={styles.spinner}>⟳</span>}
      </div>

      {/* ── Time display ── */}
      <div style={styles.timeDisplay}>
        <div style={styles.timeText}>{formatHindi(simTime)}</div>
        {lastFetched && (
          <div style={styles.timeSubtext}>
            गणना: {formatHindi(lastFetched)}
          </div>
        )}
      </div>

      {/* ── Step selector ── */}
      <div style={styles.stepsGrid}>
        {TIME_STEPS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id)}
            style={{
              ...styles.stepBtn,
              background: activeStep === s.id ? s.color : "rgba(255,255,255,0.07)",
              color: activeStep === s.id ? "#fff" : "#ccc",
              border: `1px solid ${activeStep === s.id ? s.color : "rgba(255,255,255,0.12)"}`,
              fontWeight: s.special ? "900" : "700",
              boxShadow: activeStep === s.id ? `0 0 12px ${s.color}66` : "none",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── +/- navigation buttons ── */}
      <div style={styles.navRow}>
        <button onClick={() => step(-1)} style={{ ...styles.navBtn, background: "#dc2626" }}>
          ← पीछे
        </button>
        <div style={styles.activeStepLabel}>
          {TIME_STEPS.find(s => s.id === activeStep)?.label}
        </div>
        <button onClick={() => step(1)} style={{ ...styles.navBtn, background: "#16a34a" }}>
          आगे →
        </button>
      </div>

      {/* ── Mode selector ── */}
      <div style={styles.modeRow}>
        {[
          { id: "pause",   label: "विश्राम ⏸",  color: "#64748b" },
          { id: "current", label: "वर्तमान 🔴",  color: "#dc2626" },
          { id: "dynamic", label: "गतिशील ▶",   color: "#d97706" },
        ].map(m => (
          <label key={m.id} style={styles.modeLabel}>
            <input
              type="radio"
              name="transit_mode"
              value={m.id}
              checked={mode === m.id}
              onChange={() => setMode(m.id)}
              style={{ accentColor: m.color }}
            />
            <span style={{ color: mode === m.id ? m.color : "#aaa", fontWeight: mode === m.id ? "900" : "600", marginLeft: 4 }}>
              {m.label}
            </span>
          </label>
        ))}
      </div>

      {/* ── Dynamic direction (only when dynamic) ── */}
      {mode === "dynamic" && (
        <div style={styles.dirRow}>
          <span style={styles.dirLabel}>दिशा:</span>
          <button
            onClick={() => setDirection(-1)}
            style={{ ...styles.dirBtn, background: direction === -1 ? "#7c3aed" : "rgba(255,255,255,0.08)" }}
          >◀ पीछे</button>
          <button
            onClick={() => setDirection(1)}
            style={{ ...styles.dirBtn, background: direction === 1 ? "#7c3aed" : "rgba(255,255,255,0.08)" }}
          >आगे ▶</button>
        </div>
      )}

      {/* ── Date jump input ── */}
      <div style={styles.jumpRow}>
        <span style={styles.jumpLabel}>तिथि:</span>
        <input
          type="datetime-local"
          style={styles.jumpInput}
          value={simTime.toISOString().slice(0, 16)}
          onChange={e => {
            const d = new Date(e.target.value);
            if (!isNaN(d)) { setSimTime(d); setMode("pause"); scheduleFetch(d); }
          }}
        />
      </div>

      {/* ── Picklist ── */}
      <div style={styles.pickRow}>
        <button onClick={addToPicklist} style={styles.pickBtn}>
          📌 पिकलिस्ट में जोड़ें
        </button>
      </div>

      {picklist.length > 0 && (
        <div style={styles.picklist}>
          <div style={styles.picklistTitle}>सहेजे गए क्षण</div>
          {picklist.map((entry, i) => (
            <button key={i} onClick={() => loadFromPicklist(entry)} style={styles.picklistItem}>
              {entry.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Inline styles (dark glassmorphism theme) ─────────────────────────────────
const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
    borderRadius: 16,
    padding: "14px 16px",
    border: "1px solid rgba(99,102,241,0.3)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#e2e8f0",
    userSelect: "none",
  },
  header: {
    display: "flex", alignItems: "center", gap: 8,
    marginBottom: 10, borderBottom: "1px solid rgba(99,102,241,0.2)", paddingBottom: 8,
  },
  headerIcon: { fontSize: 18 },
  headerTitle: { fontSize: 12, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#a5b4fc" },
  spinner: { marginLeft: "auto", fontSize: 16, animation: "spin 1s linear infinite", color: "#fbbf24" },
  timeDisplay: {
    background: "rgba(0,0,0,0.35)", borderRadius: 10, padding: "10px 14px",
    marginBottom: 12, border: "1px solid rgba(99,102,241,0.2)",
  },
  timeText: { fontSize: 15, fontWeight: 800, color: "#fbbf24", letterSpacing: "0.03em", textAlign: "center" },
  timeSubtext: { fontSize: 9, color: "#64748b", textAlign: "center", marginTop: 2 },
  stepsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 10,
  },
  stepBtn: {
    padding: "6px 2px", borderRadius: 7, fontSize: 10, cursor: "pointer",
    transition: "all 0.15s", letterSpacing: "0.02em", textAlign: "center",
  },
  navRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  navBtn: {
    flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
    color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: "0.04em",
    transition: "opacity 0.15s",
  },
  activeStepLabel: {
    flex: 0, minWidth: 60, textAlign: "center", fontSize: 11, fontWeight: 800,
    color: "#a5b4fc", background: "rgba(99,102,241,0.15)", borderRadius: 6, padding: "4px 8px",
  },
  modeRow: {
    display: "flex", justifyContent: "space-around", alignItems: "center",
    background: "rgba(0,0,0,0.25)", borderRadius: 9, padding: "7px 10px",
    marginBottom: 10, gap: 8,
  },
  modeLabel: { display: "flex", alignItems: "center", cursor: "pointer", fontSize: 11 },
  dirRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  dirLabel: { fontSize: 10, color: "#94a3b8", fontWeight: 700 },
  dirBtn: {
    flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)",
    color: "#e2e8f0", fontSize: 10, fontWeight: 700, cursor: "pointer",
  },
  jumpRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  jumpLabel: { fontSize: 10, color: "#94a3b8", fontWeight: 700, flexShrink: 0 },
  jumpInput: {
    flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 7, padding: "5px 8px", color: "#e2e8f0", fontSize: 10, outline: "none",
    colorScheme: "dark",
  },
  pickRow: { marginBottom: 8 },
  pickBtn: {
    width: "100%", padding: "8px", borderRadius: 8,
    background: "linear-gradient(135deg, #6d28d9, #4338ca)",
    border: "none", color: "#fff", fontSize: 11, fontWeight: 800,
    cursor: "pointer", letterSpacing: "0.05em",
    boxShadow: "0 2px 12px rgba(109,40,217,0.4)",
  },
  picklist: {
    background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 10,
    border: "1px solid rgba(99,102,241,0.2)", maxHeight: 140, overflowY: "auto",
  },
  picklistTitle: { fontSize: 9, color: "#6d28d9", fontWeight: 800, marginBottom: 6, textTransform: "uppercase" },
  picklistItem: {
    display: "block", width: "100%", textAlign: "left", background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "5px 8px",
    color: "#c7d2fe", fontSize: 10, cursor: "pointer", marginBottom: 4, fontFamily: "inherit",
  },
};

export default TransitTimeControl;
