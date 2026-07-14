# utils/location_resolver.py
try:
    # pyrefly: ignore [missing-import]
    from geopy.geocoders import Nominatim
except Exception:  # pragma: no cover - graceful fallback when geopy is not installed
    Nominatim = None

try:
    # pyrefly: ignore [missing-import]
    from timezonefinder import TimezoneFinder
except Exception:
    TimezoneFinder = None

from typing import Any, Dict, List, Optional
import logging
import time
from datetime import datetime
import requests

_http_session = requests.Session()
_http_session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"})

logger = logging.getLogger(__name__)

try:
    from zoneinfo import ZoneInfo, available_timezones
except Exception:  # pragma: no cover
    ZoneInfo = None

    def available_timezones():  # type: ignore
        return set()

import ssl
import certifi

_geolocator_ctx = ssl.create_default_context(cafile=certifi.where())
_geolocator = None if Nominatim is None else Nominatim(user_agent="vedic_astrology_web_client", timeout=10, ssl_context=_geolocator_ctx)
_tzf = None

def get_tzf():
    """Lazy loader for TimezoneFinder."""
    global _tzf
    if _tzf is None:
        if TimezoneFinder is not None:
            try:
                _tzf = TimezoneFinder()
                # Warm up
                _tzf.timezone_at(lng=0, lat=0)
            except Exception:
                pass
    return _tzf


from functools import lru_cache

@lru_cache(maxsize=256)
def _tz_offset_hours(tz_name: Optional[str]) -> Optional[float]:
    """
    Return current UTC offset in hours for the provided timezone name.
    """
    if tz_name is None or ZoneInfo is None:
        return None
    try:
        # Use a fixed reference point to avoid floating now() calls if not strictly needed
        # but now() is fine for current offset.
        dt = datetime.now(ZoneInfo(tz_name))
        offset = dt.utcoffset()
        if offset is None:
            return None
        return round(offset.total_seconds() / 3600.0, 2)
    except Exception:
        return None


def list_timezones_with_offsets() -> List[Dict[str, Any]]:
    """
    Return a curated list of common/major timezones with offsets.
    Avoids loading all 900+ zones which can be very slow.
    """
    if ZoneInfo is None:
        return []
    
    # Priority major timezones across world regions
    common_tzs = [
        "UTC", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", 
        "Europe/London", "Europe/Paris", "Europe/Berlin", 
        "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
        "Australia/Sydney", "Australia/Perth", "Pacific/Auckland"
    ]
    
    # Return common zones immediately with offsets
    collection: List[Dict[str, Any]] = []
    for name in common_tzs:
        offset = _tz_offset_hours(name)
        if offset is not None:
            collection.append({"name": name, "tz_offset_hours": offset})
            
    # We can add others later if needed, but for now 15 major zones is plenty 
    # and keeps it very snappy both on backend and frontend load.
    
    return collection

# Curated list of popular Indian cities for instant results
POPULAR_CITIES = [
    # India
    {"display_name": "Mumbai, Maharashtra, India", "lat": 19.0760, "lon": 72.8777, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Delhi, India", "lat": 28.6139, "lon": 77.2090, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Bangalore, Karnataka, India", "lat": 12.9716, "lon": 77.5946, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Hyderabad, Telangana, India", "lat": 17.3850, "lon": 78.4867, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Chennai, Tamil Nadu, India", "lat": 13.0827, "lon": 80.2707, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Kolkata, West Bengal, India", "lat": 22.5726, "lon": 88.3639, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Pune, Maharashtra, India", "lat": 18.5204, "lon": 73.8567, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Ahmedabad, Gujarat, India", "lat": 23.0225, "lon": 72.5714, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Ballia, Uttar Pradesh, India", "lat": 25.7600, "lon": 84.1500, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Varanasi, Uttar Pradesh, India", "lat": 25.3176, "lon": 82.9739, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Patna, Bihar, India", "lat": 25.5941, "lon": 85.1376, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Jaipur, Rajasthan, India", "lat": 26.9124, "lon": 75.7873, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Indore, Madhya Pradesh, India", "lat": 22.7196, "lon": 75.8577, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Bhopal, Madhya Pradesh, India", "lat": 23.2599, "lon": 77.4126, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Nagpur, Maharashtra, India", "lat": 21.1458, "lon": 79.0882, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Kanpur, Uttar Pradesh, India", "lat": 26.4499, "lon": 80.3319, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    {"display_name": "Chandigarh, India", "lat": 30.7333, "lon": 76.7794, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
    
    # Global
    {"display_name": "London, United Kingdom", "lat": 51.5074, "lon": -0.1278, "timezone": "Europe/London", "tz_offset_hours": 0.0},
    {"display_name": "New York, NY, USA", "lat": 40.7128, "lon": -74.0060, "timezone": "America/New_York", "tz_offset_hours": -5.0},
    {"display_name": "Dubai, United Arab Emirates", "lat": 25.2048, "lon": 55.2708, "timezone": "Asia/Dubai", "tz_offset_hours": 4.0},
    {"display_name": "Singapore", "lat": 1.3521, "lon": 103.8198, "timezone": "Asia/Singapore", "tz_offset_hours": 8.0},
    {"display_name": "Sydney, NSW, Australia", "lat": -33.8688, "lon": 151.2093, "timezone": "Australia/Sydney", "tz_offset_hours": 10.0},
    {"display_name": "San Francisco, CA, USA", "lat": 37.7749, "lon": -122.4194, "timezone": "America/Los_Angeles", "tz_offset_hours": -8.0},
    {"display_name": "Toronto, ON, Canada", "lat": 43.6532, "lon": -79.3832, "timezone": "America/Toronto", "tz_offset_hours": -5.0},
    {"display_name": "Lucknow, Uttar Pradesh, India", "lat": 26.8467, "lon": 80.9462, "timezone": "Asia/Kolkata", "tz_offset_hours": 5.5},
]

@lru_cache(maxsize=512)
def search_city(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Query Photon (fast) or Nominatim for places matching `query`.
    """
    query_lower = query.lower().strip()
    
    # 1. Instant check in popular cities
    hits = [c for c in POPULAR_CITIES if query_lower in c["display_name"].lower()]
    if hits:
        return hits[:limit]

    # 2. Try Open-Meteo Geocoding API (extremely fast, includes timezones natively)
    try:
        om_url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count={limit}&language=en&format=json"
        resp = _http_session.get(om_url, timeout=1.5)
        if resp.status_code == 200:
            data = resp.json()
            out = []
            for feat in data.get("results", []):
                lat = feat.get("latitude")
                lon = feat.get("longitude")
                
                # Format name nicely
                name_parts = [feat.get("name"), feat.get("admin2"), feat.get("admin1"), feat.get("country")]
                # Deduplicate and remove empty parts
                seen = set()
                clean_parts = []
                for p in name_parts:
                    if p and p not in seen:
                        seen.add(p)
                        clean_parts.append(p)
                
                display_name = ", ".join(clean_parts)
                
                # Open-Meteo provides timezone directly
                tz_name = feat.get("timezone")
                if not tz_name:
                    tz_name = get_timezone(lat, lon)
                    
                out.append({
                    "display_name": display_name,
                    "lat": lat,
                    "lon": lon,
                    "timezone": tz_name,
                    "tz_offset_hours": _tz_offset_hours(tz_name),
                })
            if out:
                return out
    except Exception as e:
        logger.warning(f"Open-Meteo search failed, falling back: {e}")

    # 3. Fallback to Nominatim if Photon fails
    if _geolocator is None:
        return []
        
    try:
        results = _geolocator.geocode(query, exactly_one=False, limit=limit, addressdetails=True, timeout=2.0)
    except Exception as e:
        logger.error(f"Geocode exception for query='{query}': {e}")
        raise
        
    out = []
    if not results:
        return out
        
    for r in results:
        lat = float(r.latitude)
        lon = float(r.longitude)
        tz_name = get_timezone(lat, lon)
        out.append({
            "display_name": r.address,
            "lat": lat,
            "lon": lon,
            "timezone": tz_name,
            "tz_offset_hours": _tz_offset_hours(tz_name),
        })
    return out

def get_latlon_for_city(display_name: str) -> Optional[Dict[str, float]]:
    """
    Find best match for display_name and return lat/lon.
    """
    if _geolocator is None:
        return None
    r = _geolocator.geocode(display_name, exactly_one=True, timeout=5)
    if not r:
        return None
    return {"lat": float(r.latitude), "lon": float(r.longitude)}

def get_timezone(lat: float, lon: float) -> Optional[str]:
    """
    Return tz name like 'Asia/Kolkata' for given lat/lon.
    """
    tz = None
    tzf = get_tzf()
    if tzf is not None:
        try:
            tz = tzf.timezone_at(lng=lon, lat=lat)
        except Exception:
            pass # Graceful fallback handled below
    
    # Fallback for common coordinates (e.g. India) if tzf/numpy fails
    if tz is None:
        # Simple bounding box for India (approximate)
        if 8.0 <= lat <= 37.0 and 68.0 <= lon <= 97.0:
            return "Asia/Kolkata"
            
    return tz

# Simple utility: when Nominatim throttles, retry
@lru_cache(maxsize=512)
def safe_search_city(query: str, limit: int = 5, retries: int = 1, delay: float = 0.0):
    """
    Search city with retries and slightly more aggressive caching.
    """
    for i in range(retries):
        try:
            return search_city(query, limit=limit)
        except Exception:
            if i < retries - 1 and delay > 0:
                time.sleep(delay)
            else:
                # If all retries fail, maybe try a simple fallback or return empty
                # For now, return empty to avoid blocking the user further
                return []
    return []
