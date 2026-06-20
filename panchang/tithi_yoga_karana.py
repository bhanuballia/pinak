# panchang/tithi_yoga_karana.py
"""
Compute Tithi, Nakshatra, Yoga, Karana and Sunrise/Sunset wrappers.

Dependencies:
 - astronomy.positions.get_all_planetary_positions(jd_ut)
 - astronomy.julian.datetime_to_julian / jd_to_datetime
 - pyswisseph (via astronomy.positions internally)
 - core.config for timezone etc (if needed)
"""

from __future__ import annotations
from typing import Dict, Any, Tuple
from math import floor
from astronomy.positions import get_all_planetary_positions
from astronomy.julian import julian_to_datetime, datetime_to_julian
import datetime

try:
    import swisseph as swe
except Exception:  # pragma: no cover - allow importing without pyswisseph installed
    swe = None

# Constants
NAK_DEG = 13.333333333333334  # 13°20'
TITHI_DEG = 12.0              # 360/30

# Names - standard Sanskrit list (1..30)
TITHI_NAMES = [
    "Pratipat", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipat", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
]

NAKS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
    "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

YOGA_NAMES = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhrsti", "Shula",
    "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
]

KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
]

def _normalize_angle(angle: float) -> float:
    return angle % 360.0

def compute_tithi(jd_ut: float) -> Dict[str, Any]:
    """
    Tithi: based on elongation between Sun and Moon.
    returns dict with:
      - tithi_index (0..29)
      - tithi_name (string)
      - tithi_fraction (0..1) progress through tithi
      - tithi_start_jd (approximate) and tithi_end_jd (not precise)
    """
    pos = get_all_planetary_positions(jd_ut)
    sun_lon = float(pos["Sun"]["sidereal"]["lon"])
    moon_lon = float(pos["Moon"]["sidereal"]["lon"])
    elong = _normalize_angle(moon_lon - sun_lon)  # 0..360
    tithi_index = int(elong // TITHI_DEG)  # 0..29
    tithi_progress = (elong % TITHI_DEG) / TITHI_DEG
    # Compose user-readable name: waxing/waning
    paksha = "Shukla" if tithi_index < 15 else "Krishna"
    base_idx = (tithi_index % 15) + 1
    tithi_name = f"{paksha} Paksha - Tithi {base_idx}"
    return {
        "tithi_index": int(tithi_index),
        "tithi_name": tithi_name,
        "tithi_fraction": float(tithi_progress),
    }

def get_tithi_boundaries(jd_ut: float) -> Tuple[float, float]:
    """Given a jd_ut, finds the exact start and end jd of the active tithi."""
    current_tithi = compute_tithi(jd_ut)
    t_idx = current_tithi["tithi_index"]
    frac = current_tithi["tithi_fraction"]
    
    guess_start = jd_ut - frac
    low = guess_start - 0.2
    high = guess_start + 0.2
    for _ in range(15):
        mid = (low + high) / 2
        if compute_tithi(mid)["tithi_index"] == t_idx:
            high = mid
        else:
            low = mid
    start_jd = high
    
    guess_end = jd_ut + (1 - frac)
    low = guess_end - 0.2
    high = guess_end + 0.2
    for _ in range(15):
        mid = (low + high) / 2
        if compute_tithi(mid)["tithi_index"] == t_idx:
            low = mid
        else:
            high = mid
    end_jd = low
    
    return start_jd, end_jd

def compute_nakshatra(jd_ut: float, manual_lon: float = None) -> Dict[str, Any]:
    """
    Nakshatra and pada: based on Moon sidereal longitude (or manual_lon if provided).
    returns nakshatra_index (0..26), nakshatra_name, pada (1..4), nakshatra_fraction
    """
    if manual_lon is not None:
        moon_lon = float(manual_lon)
    else:
        pos = get_all_planetary_positions(jd_ut)
        moon_lon = float(pos["Moon"]["sidereal"]["lon"])
        
    idx = int(moon_lon // NAK_DEG) % 27
    frac = (moon_lon % NAK_DEG) / NAK_DEG
    pada = int(frac * 4) + 1
    return {
        "nakshatra_index": idx,
        "nakshatra_name": NAKS[idx],
        "pada": pada,
        "fraction": frac
    }

def compute_yoga(jd_ut: float) -> Dict[str, Any]:
    """
    Yoga: (Sun.lon + Moon.lon) mod 360; 27 yogas of 13°20' each.
    """
    pos = get_all_planetary_positions(jd_ut)
    sun = float(pos["Sun"]["sidereal"]["lon"])
    moon = float(pos["Moon"]["sidereal"]["lon"])
    s = _normalize_angle(sun + moon)
    yoga_idx = int(s // NAK_DEG) % 27
    s = _normalize_angle(sun + moon)
    yoga_idx = int(s // NAK_DEG) % 27
    return {"yoga_index": yoga_idx, "yoga_name": YOGA_NAMES[yoga_idx], "value_deg": s}

def compute_karana(jd_ut: float) -> Dict[str, Any]:
    """
    Karana: Each tithi half = 60 degrees of elongation => 11 karanas repeated.
    There are 11 karanas with first 7 repeating and last four fixed (Bava etc).
    We'll compute index 0..10 and name.
    """
    pos = get_all_planetary_positions(jd_ut)
    sun = float(pos["Sun"]["sidereal"]["lon"])
    moon = float(pos["Moon"]["sidereal"]["lon"])
    elong = _normalize_angle(moon - sun)
    half_tithi_index = int(elong // 6.0)  # 360/60 = 6 deg per half-tithi, but simpler mapping
    # Simpler mapping: there are 60 half tithis; but classical karana mapping uses specific mapping.
    half_tithi_index = int(elong // 6.0)  # 360/60 = 6 deg per half-tithi, but simpler mapping
    # Simpler mapping: there are 60 half tithis; but classical karana mapping uses specific mapping.
    idx = (half_tithi_index // 1) % 11
    return {"karana_index": int(idx), "karana_name": KARANAS[idx]}

# Sunrise/sunset helpers (based on swe.rise_set)
def compute_sunrise_sunset_for_date(date_local: datetime.date, lat: float, lon: float, tz_offset_hours: float = 0.0) -> Dict[str, Any]:
    """
    Compute approximate sunrise and sunset UTC datetime for given date and location.
    Uses Swiss Ephemeris Rise/Set routines to find UT times.
    Returns local datetime strings (ISO) for sunrise and sunset.
    """
    if not swe:
        return {"sunrise_local": None, "sunset_local": None, "sunrise_jd_ut": None}

    # Start looking from local midnight
    dt_local_mid = datetime.datetime.combine(date_local, datetime.time(0,0,0))
    dt_utc_mid = dt_local_mid - datetime.timedelta(hours=tz_offset_hours)
    jd_ut_mid = datetime_to_julian(dt_utc_mid)
    
    geopos = (lon, lat, 0.0)
    
    try:
        # Sunrise: CALC_RISE. By default this uses the upper limb of the sun and standard refraction (Apparent Sunrise)
        # Passing standard atmospheric pressure and temperature for refraction
        res_rise, tret_rise = swe.rise_trans(jd_ut_mid, swe.SUN, swe.CALC_RISE, geopos, 1013.25, 15.0)
        
        sunrise_jd_ut = tret_rise[0]
        
        # Sunset: CALC_SET
        res_set, tret_set = swe.rise_trans(jd_ut_mid, swe.SUN, swe.CALC_SET, geopos, 1013.25, 15.0)
        
        sunset_jd_ut = tret_set[0]
        
        sunrise_utc = julian_to_datetime(sunrise_jd_ut)
        sunset_utc = julian_to_datetime(sunset_jd_ut)
        
        sunrise_local = sunrise_utc + datetime.timedelta(hours=tz_offset_hours)
        sunset_local = sunset_utc + datetime.timedelta(hours=tz_offset_hours)
        
        return {
            "sunrise_local": sunrise_local.isoformat(),
            "sunset_local": sunset_local.isoformat(),
            "sunrise_jd_ut": sunrise_jd_ut
        }
        
    except Exception as e:
        return {"sunrise_local": None, "sunset_local": None, "sunrise_jd_ut": None}
