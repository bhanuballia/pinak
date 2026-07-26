// src/components/PlaceAutocomplete.jsx
import React, { useState, useEffect, useRef } from "react";
import { searchPlaces } from "../services/api";

/**
 * PlaceAutocomplete
 * Props:
 *  - onSelect(place) -> { display_name, lat, lon, raw }
 *
 * This component calls backend /api/locations/search?q=... and displays a dropdown.
 * Backend should implement a route that proxies geolocation (Nominatim) or your DB.
 */

const formatOffset = (offset) => {
  if (typeof offset !== "number" || Number.isNaN(offset)) return "";
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
};

export default function PlaceAutocomplete({ onSelect, value, inputClassName, dropdownClassName }) {
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const trimmedQuery = query?.trim().toLowerCase();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (cacheRef.current[trimmedQuery]) {
      setResults(cacheRef.current[trimmedQuery]);
      setOpen(true);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPlaces(query, controller.signal);
        const finalResults = res || [];
        setResults(finalResults);
        cacheRef.current[trimmedQuery] = finalResults;
        
        if (finalResults.length > 0) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("Place search failed", err);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [query]);

  const choose = (item) => {
    setQuery(item.display_name);
    setOpen(false);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="relative">
      <input
        className={inputClassName || "mt-1 w-full border rounded p-2 text-black bg-white"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type city / town / village"
      />
      {loading && <div className="absolute right-3 top-3.5 text-xs text-slate-400">Searching…</div>}
      {open && results.length > 0 && (
        <div className={dropdownClassName || "absolute z-50 bg-white border rounded w-full mt-1 max-h-60 overflow-auto shadow text-black"}>
          {results.map((r, idx) => (
            <div
              key={idx}
              className="p-2.5 hover:bg-slate-700/30 dark:hover:bg-slate-700/80 cursor-pointer text-sm border-b border-slate-700/10"
              onClick={() => choose(r)}
            >
              <div className="font-medium">{r.display_name}</div>
              <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                <span>
                  {r.lat.toFixed(4)}, {r.lon.toFixed(4)}
                </span>
                {(r.timezone || typeof r.tz_offset_hours === "number") && (
                  <span>
                    {r.timezone || "Timezone unknown"}
                    {r.tz_offset_hours != null ? ` • ${formatOffset(r.tz_offset_hours)}` : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
