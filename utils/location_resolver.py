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
_geolocator = None if Nominatim is None else Nominatim(user_agent="vedic_astrology_app", timeout=10, ssl_context=_geolocator_ctx)
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

@lru_cache(maxsize=512)
def search_city(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Query Nominatim for places matching `query`.
    Returns up to `limit` results with: display_name, lat, lon, boundingbox.
    """
    if _geolocator is None:
        return []
        
    try:
        # Use a slightly shorter timeout for better responsiveness
        results = _geolocator.geocode(query, exactly_one=False, limit=limit, addressdetails=True, timeout=5)
    except Exception as e:
        logger.error(f"Geocode exception for query='{query}': {e}")
        # Raise so safe_search_city can handle retry or fallback
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
            "raw": getattr(r, "raw", {}),
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
def safe_search_city(query: str, limit: int = 5, retries: int = 2, delay: float = 0.5):
    """
    Search city with retries and slightly more aggressive caching.
    """
    for i in range(retries):
        try:
            return search_city(query, limit=limit)
        except Exception:
            if i < retries - 1:
                time.sleep(delay)
            else:
                # If all retries fail, maybe try a simple fallback or return empty
                # For now, return empty to avoid blocking the user further
                return []
    return []
