import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Time step definitions ────────────────────────────────────────────────────
const TIME_STEPS = [
  { id: "10y", label: "10 Years", seconds: 10 * 365.25 * 24 * 3600 },
  { id: "1y", label: "Year", seconds: 365.25 * 24 * 3600 },
  { id: "1m", label: "Month", seconds: 30.44 * 24 * 3600 },
  { id: "1w", label: "Week", seconds: 7 * 24 * 3600 },
  { id: "1d", label: "Day", seconds: 24 * 3600 },
  { id: "lagna", label: "Ascendant", seconds: 2 * 3600 },
  { id: "navamsha", label: "Navamsha", seconds: 800 },
  { id: "1h", label: "Hours", seconds: 3600 },
  { id: "10min", label: "10 Minutes", seconds: 600 },
  { id: "1min", label: "Minutes", seconds: 60 },
  { id: "10s", label: "10 Seconds", seconds: 10 },
  { id: "1s", label: "Seconds", seconds: 1 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n) { return String(n).padStart(2, "0"); }

function formatClassic(dt) {
  const date = dt.getDate();
  const month = MONTHS[dt.getMonth()];
  const year = dt.getFullYear();
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  const ss = pad(dt.getSeconds());
  return `${date} ${month} ${year}  ${hh}:${mm}:${ss}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TransitTimeControl = ({ lat, lon, varga = 1, onTransitChange }) => {
  const [simTime, setSimTime] = useState(new Date());
  const [mode, setMode] = useState("pause");   // pause | current | dynamic
  const [activeStep, setActiveStep] = useState("1d");
  const [direction, setDirection] = useState(1); // 1 for Animate forward
  const [picklist, setPicklist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      }
    } catch (e) {
      console.error("TransitTimeControl fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lon, varga, onTransitChange]);

  const scheduleFetch = useCallback((dt) => {
    clearTimeout(fetchDebounce.current);
    fetchDebounce.current = setTimeout(() => fetchTransit(dt), 350);
  }, [fetchTransit]);

  // ── Manual Step ─────────────────────────────────────────────────────────────
  const stepManual = useCallback((stepId, dir) => {
    const stepDef = TIME_STEPS.find(s => s.id === stepId);
    if (!stepDef) return;
    setActiveStep(stepId);
    setSimTime(prev => {
      const next = new Date(prev.getTime() + dir * stepDef.seconds * 1000);
      scheduleFetch(next);
      return next;
    });
    if (mode === "dynamic") setMode("pause");
  }, [scheduleFetch, mode]);

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
      }, 30000);
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

  useEffect(() => { fetchTransit(new Date()); }, []); // eslint-disable-line

  // ── Picklist ────────────────────────────────────────────────────────────────
  const addToPicklist = () => {
    const entry = { dt: new Date(simTime), label: formatClassic(simTime) };
    setPicklist(prev => [entry, ...prev].slice(0, 20));
  };

  const removeFromPicklist = () => {
    setPicklist(prev => prev.slice(1));
  };

  const loadFromPicklist = (entry) => {
    setSimTime(new Date(entry.dt));
    setMode("pause");
    fetchTransit(new Date(entry.dt));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {/* ── Vertical Step Controls ── */}
      <div style={styles.stepContainer}>
        {TIME_STEPS.map(s => (
          <div key={s.id} style={styles.stepRow}>
            <span style={styles.stepLabel}>{s.label}</span>
            <div style={styles.stepBtnGroup}>
              <button
                onClick={() => stepManual(s.id, -1)}
                style={styles.classicBtn}
                title={`Subtract 1 ${s.label}`}
              >
                -
              </button>
              <button
                onClick={() => stepManual(s.id, 1)}
                style={styles.classicBtn}
                title={`Add 1 ${s.label}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mode Selector ── */}
      <div style={styles.modeBox}>
        {[
          { id: "pause", label: "Stop (Manual)" },
          { id: "current", label: "Realtime" },
          { id: "dynamic", label: "Animate" },
        ].map(m => (
          <label key={m.id} style={styles.modeLabel}>
            <input
              type="radio"
              name="transit_mode"
              value={m.id}
              checked={mode === m.id}
              onChange={() => setMode(m.id)}
              style={styles.radioInput}
            />
            {m.label}
          </label>
        ))}
      </div>

      {/* ── Edit Date ── */}
      <div style={styles.editDateBox}>
        <select style={styles.editDateSelect}>
          <option>Edit Date</option>
        </select>
        {/* Hidden datetime input acting behind the dropdown conceptually */}
        <input
          type="datetime-local"
          style={styles.hiddenJumpInput}
          value={simTime.toISOString().slice(0, 16)}
          onChange={e => {
            const d = new Date(e.target.value);
            if (!isNaN(d)) { setSimTime(d); setMode("pause"); scheduleFetch(d); }
          }}
        />
      </div>

      {/* ── Current Date Display ── */}
      <div style={styles.dateDisplay}>
        {formatClassic(simTime)} {isLoading && <span style={styles.loadingPulse}>...</span>}
      </div>

      {/* ── Picklist Buttons ── */}
      <div style={styles.pickButtonsContainer}>
        <button onClick={addToPicklist} style={{ ...styles.classicBtn, ...styles.fullBtn }}>
          Add to pick list
        </button>
        <button onClick={removeFromPicklist} style={{ ...styles.classicBtn, ...styles.fullBtn }}>
          Remove from Picklist
        </button>
      </div>

      {picklist.length > 0 && (
        <div style={styles.picklist}>
          {picklist.map((entry, i) => (
            <div key={i} onClick={() => loadFromPicklist(entry)} style={styles.picklistItem}>
              {entry.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Inline styles (Classic UI Theme) ─────────────────────────────────
const styles = {
  wrapper: {
    background: "#fcfbcc", // Classic pale yellow
    padding: "8px 12px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#000",
    userSelect: "none",
    width: "100%",
    minHeight: "100%",
    boxSizing: "border-box",
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    marginBottom: "10px",
  },
  stepRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: "13px",
    color: "#000",
  },
  stepBtnGroup: {
    display: "flex",
    gap: "4px",
  },
  classicBtn: {
    background: "#f0f0f0",
    borderTop: "1px solid #fff",
    borderLeft: "1px solid #fff",
    borderRight: "1px solid #888",
    borderBottom: "1px solid #888",
    color: "#000",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "1px 8px",
    minWidth: "26px",
    textAlign: "center",
    fontFamily: "inherit",
  },
  fullBtn: {
    width: "100%",
    padding: "4px",
    marginBottom: "4px",
    fontWeight: "normal",
  },
  modeBox: {
    border: "1px solid #888",
    borderRightColor: "#fff",
    borderBottomColor: "#fff",
    padding: "6px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "8px",
  },
  modeLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    cursor: "pointer",
  },
  radioInput: {
    margin: "0 6px 0 0",
  },
  editDateBox: {
    position: "relative",
    marginBottom: "8px",
  },
  editDateSelect: {
    width: "100%",
    padding: "2px",
    fontSize: "12px",
    border: "1px solid #888",
    borderBottomColor: "#fff",
    borderRightColor: "#fff",
  },
  hiddenJumpInput: {
    position: "absolute",
    top: 0, left: 0, width: "100%", height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  dateDisplay: {
    fontSize: "13px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    marginBottom: "10px",
  },
  loadingPulse: {
    color: "#d97706",
    fontWeight: "bold",
  },
  pickButtonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  picklist: {
    marginTop: "8px",
    background: "#fff",
    border: "1px solid #888",
    borderRightColor: "#fff",
    borderBottomColor: "#fff",
    maxHeight: "100px",
    overflowY: "auto",
    padding: "2px",
  },
  picklistItem: {
    fontSize: "11px",
    padding: "2px 4px",
    cursor: "pointer",
  },
};

export default TransitTimeControl;
