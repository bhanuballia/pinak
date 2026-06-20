import React, { useState, useEffect, useRef, useCallback } from 'react';

const CompactTransitControl = ({ lat, lon, onTransitChange }) => {
  const [transitDate, setTransitDate] = useState(new Date());
  const [stepUnit, setStepUnit] = useState('1d');
  const [stepValue, setStepValue] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const fetchDebounce = useRef(null);

  const fetchTransit = useCallback(async (dt) => {
    try {
      const dateStr = dt.toISOString().split("T")[0];
      const pad = n => String(n).padStart(2, "0");
      const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
      const tz_offset = (dt.getTimezoneOffset() / -60.0).toFixed(1);

      const res = await fetch(
        `/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat || 28.6}&lon=${lon || 77.2}`
      );
      const json = await res.json();
      if (json.positions) {
        onTransitChange(json.positions, dt);
      }
    } catch (e) {
      console.error(e);
    }
  }, [lat, lon, onTransitChange]);

  const scheduleFetch = useCallback((dt) => {
    clearTimeout(fetchDebounce.current);
    fetchDebounce.current = setTimeout(() => fetchTransit(dt), 300);
  }, [fetchTransit]);

  // Initial fetch and on transitDate change (when not animating)
  useEffect(() => {
    scheduleFetch(transitDate);
  }, [transitDate, scheduleFetch]);

  useEffect(() => {
    let interval = null;
    if (isAnimating) {
      interval = setInterval(() => {
        handleStep(1);
      }, 1500); // 1.5s
    } else if (!isAnimating && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAnimating, stepUnit, stepValue]);

  const handleStep = (direction) => {
    setTransitDate(prevDate => {
      const newDate = new Date(prevDate);
      const amount = direction * stepValue;
      if (stepUnit === 'day' || stepUnit === '1d') newDate.setDate(newDate.getDate() + amount);
      else if (stepUnit === 'month') newDate.setMonth(newDate.getMonth() + amount);
      else if (stepUnit === 'year') newDate.setFullYear(newDate.getFullYear() + amount);
      else if (stepUnit === '1w') newDate.setDate(newDate.getDate() + amount * 7);
      else if (stepUnit === 'lagna') newDate.setHours(newDate.getHours() + amount * 2);
      else if (stepUnit === '1h') newDate.setHours(newDate.getHours() + amount);
      else if (stepUnit === '10min') newDate.setMinutes(newDate.getMinutes() + amount * 10);
      else if (stepUnit === '1min') newDate.setMinutes(newDate.getMinutes() + amount);
      else if (stepUnit === '10s') newDate.setSeconds(newDate.getSeconds() + amount * 10);
      else if (stepUnit === '1s') newDate.setSeconds(newDate.getSeconds() + amount);
      return newDate;
    });
  };

  return (
    <div className="flex items-center gap-3 bg-rose-250 p-2 rounded-lg border border-[#333] shadow-md font-sans">
      <button
        onClick={() => { setIsAnimating(false); handleStep(-1); }}
        className="px-3 py-1 bg-rose-50 hover:bg-[#444] rounded text-black  text-[22px] font-bold"
      >
        -
      </button>

      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className={`px-4 py-1 rounded text-white font-bold ${isAnimating ? 'bg-rose-50 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
      >
        {isAnimating ? 'Stop' : 'Animate'}
      </button>

      <button
        onClick={() => { setIsAnimating(false); handleStep(1); }}
        className="px-3 py-1 bg-rose-50 hover:bg-[#444] rounded text-white text-[22px] font-bold"
      >
        +
      </button>

      <select
        className="bg-rose-50 border border-[#444] text-[18px] text-black px-2 py-1 rounded outline-none"
        value={stepValue}
        onChange={(e) => setStepValue(parseInt(e.target.value))}
      >
        {[1, 2, 3, 4, 5, 10].map(v => <option key={v} value={v}>{v}</option>)}
      </select>

      <select
        className="bg-rose-50 border border-[#444] text-[18px] text-black px-2 py-1 rounded outline-none"
        value={stepUnit}
        onChange={(e) => setStepUnit(e.target.value)}
      >
        <option value="year">Year(s)</option>
        <option value="month">Month(s)</option>
        <option value="1w">सप्ताह</option>
        <option value="1d">दिन</option>
        <option value="lagna">लग्न</option>
        <option value="1h">घंटे</option>
        <option value="10min">10 मिनट</option>
        <option value="1min">मिनट</option>
        <option value="10s">10 सेकेंड</option>
        <option value="1s">सेकेंड</option>
      </select>
    </div>
  );
};

export default CompactTransitControl;
