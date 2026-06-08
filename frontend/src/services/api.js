// src/services/api.js
// Small API client for report generation and place search.
// Assumes your backend is served under the same origin (or configure base URL).

const BASE = ""; // leave empty to use same origin, or set e.g. "https://api.example.com"

export async function searchPlaces(q) {
  if (!q) return [];
  const url = `${BASE}/api/locations/search?q=${encodeURIComponent(q)}`;
  console.log('Fetching from URL:', url);

  try {
    const res = await fetch(url, { method: "GET" });
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Location search failed:', res.status, errorText);
      throw new Error(`Location search failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log('Received data:', data);
    return data; // expected: [{display_name, lat, lon, raw}, ...]
  } catch (error) {
    console.error('Error in searchPlaces:', error);
    throw error;
  }
}

/**
 * createReport: send payload and receive a blob URL for the PDF.
 * Payload fields:
 *  - name, date (YYYY-MM-DD), time (HH:MM), tz_offset (number), lat (float), lon (float), style, language
 */
export async function createReport(payload) {
  const url = `${BASE}/api/report/generate`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Generate report failed");
  }

  // some backends return a file stream (application/pdf). If so, we create blob URL.
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/pdf")) {
    const blob = await res.blob();
    const urlObj = URL.createObjectURL(blob);
    return urlObj;
  }

  // otherwise, assume JSON with { url: "/path/to/pdf" } or direct url string
  const ct = res.headers.get("content-type") || "";
  try {
    const json = await res.json();
    if (json.url) return json.url;
    if (typeof json === "string") return json;
    return null;
  } catch (err) {
    return null;
  }
}

// Static timezone list — same 15 zones the backend serves.
// Hardcoded here to eliminate the network round-trip entirely.
const STATIC_TIMEZONES = [
  { name: "UTC",                  tz_offset_hours: 0    },
  { name: "Asia/Kolkata",         tz_offset_hours: 5.5  },
  { name: "Asia/Dubai",           tz_offset_hours: 4    },
  { name: "Asia/Singapore",       tz_offset_hours: 8    },
  { name: "Asia/Tokyo",           tz_offset_hours: 9    },
  { name: "Europe/London",        tz_offset_hours: 1    },
  { name: "Europe/Paris",         tz_offset_hours: 2    },
  { name: "Europe/Berlin",        tz_offset_hours: 2    },
  { name: "America/New_York",     tz_offset_hours: -4   },
  { name: "America/Chicago",      tz_offset_hours: -5   },
  { name: "America/Denver",       tz_offset_hours: -6   },
  { name: "America/Los_Angeles",  tz_offset_hours: -7   },
  { name: "Australia/Sydney",     tz_offset_hours: 10   },
  { name: "Australia/Perth",      tz_offset_hours: 8    },
  { name: "Pacific/Auckland",     tz_offset_hours: 12   },
];

// Returns instantly — no network call needed since the list is static.
export async function fetchTimezones() {
  return STATIC_TIMEZONES;
}


export async function fetchReportData(payload) {
  const url = `${BASE}/api/report/data`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch report data");
  }
  return res.json();
}

export async function fetchShodashottari(payload = {}) {
  const url = `${BASE}/api/dasha/shodashottari`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch Shodashottari dasha");
  return res.json();
}

export async function fetchChaturshitisama(payload = {}) {
  const url = `${BASE}/api/dasha/chaturshitisama`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch Chaturshitisama dasha");
  return res.json();
}

// === MongoDB Profiles API ===

export async function saveProfileToDB(payload) {
  const url = `${BASE}/api/profiles/`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save profile to database");
  return res.json();
}

export async function fetchSavedProfiles() {
  const url = `${BASE}/api/profiles/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch saved profiles");
  return res.json();
}

export async function fetchProfileById(id) {
  const url = `${BASE}/api/profiles/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// === Lal Kitab API ===

export async function fetchLalKitabRemedies(planet) {
  const url = `${BASE}/api/lalkitab/remedies/${planet}`;
  const res = await fetch(url);
  if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch Lal Kitab remedies");
  }
  return res.json();
}

export async function fetchDailyPanchang(lat, lon, tz, dateStr = "") {
  let url = `${BASE}/api/panchang/daily?lat=${lat}&lon=${lon}&tz=${tz}`;
  if (dateStr) {
      url += `&date=${dateStr}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Daily Panchang");
  return res.json();
}

export async function fetchMonthlyPanchang(lat, lon, tz, year, month) {
  const url = `${BASE}/api/panchang/monthly?lat=${lat}&lon=${lon}&tz=${tz}&year=${year}&month=${month}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Monthly Panchang");
  return res.json();
}

export async function fetchHoroscope(name, date, time, lat, lon, tz) {
  return fetchReportData({ name, date, time, lat, lon, tz_offset: tz });
}

export async function fetchStudyInsights() {
  const url = `${BASE}/api/study`;
  console.log('Fetching Study Insights from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Study insights");
  return res.json();
}

export async function fetchPersonalStudyInsights(data) {
  const url = `${BASE}/api/study/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Study analysis");
  return res.json();
}

export async function fetchCareerInsights() {
  const url = `${BASE}/api/career`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Career insights");
  return res.json();
}

export async function fetchPersonalCareerInsights(data) {
  const url = `${BASE}/api/career/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Career analysis");
  return res.json();
}

export async function fetchFinanceInsights() {
  const url = `${BASE}/api/finance`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Finance insights");
  return res.json();
}

export async function fetchPersonalFinanceInsights(data) {
  const url = `${BASE}/api/finance/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Finance analysis");
  return res.json();
}
export async function fetchMarriageInsights() {
  const url = `${BASE}/api/marriage`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Marriage insights");
  return res.json();
}

export async function fetchPersonalMarriageInsights(data) {
  const url = `${BASE}/api/marriage/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Marriage analysis");
  return res.json();
}

export async function fetchBusinessInsights() {
  const url = `${BASE}/api/business`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Business insights");
  return res.json();
}

export async function fetchPersonalBusinessInsights(data) {
  const url = `${BASE}/api/business/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Business analysis");
  return res.json();
}

export async function fetchHealthInsights() {
  const url = `${BASE}/api/health`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Health insights");
  return res.json();
}

export async function fetchPersonalHealthInsights(data) {
  const url = `${BASE}/api/health/personal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to fetch personal Health analysis");
  return res.json();
}

export async function fetchParentsHealthInsights() {
  const url = `${BASE}/api/family-health/parents`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Parents Health insights");
  return res.json();
}

export async function fetchSpouseHealthInsights() {
  const url = `${BASE}/api/family-health/spouse`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Spouse Health insights");
  return res.json();
}

export async function fetchChildrenHealthInsights() {
  const url = `${BASE}/api/family-health/children`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Children's Health insights");
  return res.json();
}
