# astronomy/positions.py
"""
High-precision astronomical positions for planets, Sun, and Moon.

This module wraps Swiss Ephemeris to provide:
- Tropical ecliptic positions
- Sidereal positions (using configured ayanamsa)
- Long/lat/speed/distance for each body
- Flags for calculation quality: speed, Swiss ephemeris, refraction, etc.
- Combustion and Retrograde status identification

Dependencies:
- swisseph (pyswisseph)
- astronomy.sidereal (get_ayanamsa)
- core.config (EPHEMERIS_PATH)
"""

from __future__ import annotations

try:
    import swisseph as swe
except Exception:  # pragma: no cover - allow import without swisseph installed
    swe = None

from typing import Dict, Any

from astronomy.sidereal import get_ayanamsa, set_ayanamsa
from core.config import EPHEMERIS_PATH


# If the swisseph library is available, apply startup configuration now.
# Otherwise, define safe placeholders so importing this module doesn't fail.


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

if swe:
    # Set ephemeris file path and ensure sidereal mode
    try:
        swe.set_ephe_path(EPHEMERIS_PATH)
    except Exception:
        # If ephemeris path isn't available at import time, skip silently.
        pass

    # Make sure sidereal mode is applied when swisseph is present
    try:
        set_ayanamsa()
    except Exception:
        pass

    PLANETS = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mercury": swe.MERCURY,
        "Venus": swe.VENUS,
        "Mars": swe.MARS,
        "Jupiter": swe.JUPITER,
        "Saturn": swe.SATURN,
        "Rahu": swe.TRUE_NODE,        # Vedic astrology: Rahu = True Node
        "Ketu": swe.TRUE_NODE,        # Ketu = 180° opposite Rahu (computed manually)
    }

    NAK_NAMES = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
        "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]

    NAK_LORDS = [
        "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
        "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
        "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
    ]


    # Combustion (Astangata) Orbs from Sun (degrees)
    # Ref: Standard Vedic Astrology texts
    COMBUSTION_ORBS = {
        "Moon": 12.0,
        "Mars": 17.0,
        "Mercury": 14.0, # 12.0 when retrograde
        "Jupiter": 11.0,
        "Venus": 10.0,
        "Saturn": 15.0
    }


    # Swiss Ephemeris flags:
    FLAGS = (
        swe.FLG_SWIEPH    |   # Use Swiss ephemeris files (highest accuracy)
        swe.FLG_SPEED         # Include motion speed values
    )
else:
    # Placeholders so module can be imported without swisseph installed.
    PLANETS = {
        "Sun": 0,
        "Moon": 1,
        "Mercury": 2,
        "Venus": 3,
        "Mars": 4,
        "Jupiter": 5,
        "Saturn": 6,
        "Rahu": 10,
        "Ketu": 11,
    }

    FLAGS = 0


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalize_degrees(deg: float) -> float:
    """Normalize any angle into 0..360 degrees."""
    return deg % 360.0


# ---------------------------------------------------------------------------
# CORE FUNCTIONS
# ---------------------------------------------------------------------------

def get_tropical_position(jd_ut: float, planet_id: int) -> Dict[str, float]:
    """
    Return the tropical (non-sidereal) planetary position.

    Returns:
        {
          "lon": float,
          "lat": float,
          "dist": float,
          "speed_lon": float,
        }
    """

    if swe is None:
        raise RuntimeError("Swiss Ephemeris library (swisseph) is not loaded. Cannot calculate positions.")

    flags = FLAGS  # tropical mode (default)

    try:
        res = swe.calc_ut(jd_ut, planet_id, flags)
        lon, lat, dist, lon_speed = res[0][0], res[0][1], res[0][2], res[0][3]
    except Exception as exc:
        raise RuntimeError(f"Swiss Ephemeris calc failed: {exc}")

    return {
        "lon": normalize_degrees(lon),
        "lat": lat,
        "dist": dist,
        "speed_lon": lon_speed,
    }


def get_sidereal_position(jd_ut: float, planet_id: int) -> Dict[str, float]:
    """
    Return sidereal (ayanamsa adjusted) planetary position.
    """

    if swe is None:
        raise RuntimeError("Swiss Ephemeris library (swisseph) is not loaded. Cannot calculate positions.")

    # Must call this to ensure Swiss sidereal mode is active:
    set_ayanamsa()

    flags = FLAGS | swe.FLG_SIDEREAL

    try:
        res = swe.calc_ut(jd_ut, planet_id, flags)
        lon, lat, dist, lon_speed = res[0][0], res[0][1], res[0][2], res[0][3]
    except Exception as exc:
        raise RuntimeError(f"Swiss Ephemeris sidereal calc failed: {exc}")

    # Normalize the sidereal longitude
    lon = normalize_degrees(lon)

    return {
        "lon": lon,
        "lat": lat,
        "dist": dist,
        "speed_lon": lon_speed,
    }


def get_ketu_from_rahu(rahu_lon: float) -> float:
    """Ketu = Rahu + 180° (sidereal)."""
    return normalize_degrees(rahu_lon + 180.0)


def get_nakshatra_info(lon: float) -> Dict[str, Any]:
    """
    Calculate nakshatra, pada, and lord for a given sidereal longitude.
    """
    nak_deg = 360.0 / 27  # 13°20'
    idx = int(lon // nak_deg) % 27
    frac = (lon % nak_deg) / nak_deg
    pada = int(frac * 4) + 1
    
    # Vimshottari Sub-lord divisions within a Nakshatra (360/27 = 13°20')
    # Divisions are proportional to Mahadasha years (7, 20, 6, 10, 7, 18, 16, 19, 17)
    # Total = 120 years
    SUB_DIVISIONS = [7, 20, 6, 10, 7, 18, 16, 19, 17]
    total_years = 120
    
    # Cumulative percentages for the 9 sub-lords starting from the Nakshatra Lord
    cumulative = 0
    sub_lord_idx = -1
    # We find which subdivision the fraction belongs to
    for i in range(9):
        lord_of_sub = (idx + i) % 9
        # In NAK_LORDS, we use the planet name. 
        # But we need to find the correct planet from the sequence starting at the Nakshatra lord.
        # Actually, the sequence is ALWAYS Ketu, Venus, Sun... 
        # So we start the loop from the nakshatra lord's position in the sequence.
        
        # Mapping Nakshatra Lord Name back to Sequence Index
        SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        start_idx = SEQUENCE.index(NAK_LORDS[idx])
        
        # Correctly mapping the 9 sub-lords starting from 'start_idx'
        sub_seq_idx = (start_idx + i) % 9
        sub_years = SUB_DIVISIONS[sub_seq_idx]
        
        cumulative += (sub_years / total_years)
        if frac <= cumulative:
            sub_lord_idx = sub_seq_idx
            break
            
    if sub_lord_idx == -1: sub_lord_idx = (start_idx + 8) % 9

    return {
        "name": NAK_NAMES[idx],
        "index": idx,
        "pada": pada,
        "lord": NAK_LORDS[idx],
        "sub_lord": SEQUENCE[sub_lord_idx],
        "fraction": frac
    }

def get_equatorial_position(jd_ut: float, planet_id: int) -> Dict[str, float]:
    """
    Return RA and Declination in equatorial coordinates.
    """
    if swe is None:
        return {"ra": 0, "dec": 0}
    
    flags = swe.FLG_SWIEPH | swe.FLG_EQUATORIAL
    res = swe.calc_ut(jd_ut, planet_id, flags)
    # res[0][0] = RA (degrees), res[0][1] = Dec (degrees)
    return {
        "ra": normalize_degrees(res[0][0]),
        "dec": res[0][1]
    }


# ---------------------------------------------------------------------------
# PUBLIC API
# ---------------------------------------------------------------------------

def get_all_planetary_positions(jd_ut: float) -> Dict[str, Dict[str, Any]]:
    """
    Calculate HIGH-PRECISION planetary positions (sidereal + tropical + equatorial + nakshatra).

    Returns:
    {
      "Sun": {
        "tropical": {...},
        "sidereal": {...},
        "equatorial": {"ra": ..., "dec": ...},
        "nakshatra": {"name": ..., "pada": ..., "lord": ...}
      },
      ...
    }
    """

    results: Dict[str, Dict[str, Any]] = {}

    # 1. First Pass: Calculate all positions
    for name, pid in PLANETS.items():
        if name == "Ketu": continue
        
        tropical = get_tropical_position(jd_ut, pid)
        sidereal = get_sidereal_position(jd_ut, pid)
        equatorial = get_equatorial_position(jd_ut, pid)

        results[name] = {
            "tropical": tropical,
            "sidereal": sidereal,
            "equatorial": equatorial,
            "nakshatra": get_nakshatra_info(sidereal["lon"]),
            "is_retrograde": sidereal["speed_lon"] < 0 if sidereal["speed_lon"] is not None else False,
            "is_combust": False # To be computed in second pass
        }

    # 2. Second Pass: Compute combustion status relative to Sun
    if "Sun" in results:
        sun_lon = results["Sun"]["sidereal"]["lon"]
        for name, data in results.items():
            if name in ["Sun", "Rahu", "Ketu", "Ascendant"]:
                continue
            
            orb = COMBUSTION_ORBS.get(name)
            if orb:
                # Use a smaller orb for Mercury if it's retrograde
                if name == "Mercury" and data["is_retrograde"]:
                    orb = 12.0
                
                diff = abs(data["sidereal"]["lon"] - sun_lon)
                if diff > 180: diff = 360 - diff
                
                if diff <= orb:
                    data["is_combust"] = True

    # 3. Final Step: Ketu calculation (mirrors Rahu)
    if "Rahu" in results:
        rahu_lon = results["Rahu"]["sidereal"]["lon"]
        ketu_lon = get_ketu_from_rahu(rahu_lon)
        rahu_equ = results["Rahu"]["equatorial"]

        results["Ketu"] = {
            "sidereal": {"lon": ketu_lon, "lat": 0, "dist": 0, "speed_lon": 0},
            "tropical": None,
            "equatorial": {
                "ra": normalize_degrees(rahu_equ["ra"] + 180.0),
                "dec": -rahu_equ["dec"]
            },
            "nakshatra": get_nakshatra_info(ketu_lon),
            "is_retrograde": False,
            "is_combust": False
        }

    return results


def get_sun_moon_sidereal(jd_ut: float) -> Dict[str, float]:
    """
    ULTRA-LIGHT fetcher for just Sun and Moon sidereal longitudes.
    Used for bulk Muhurt calculations where full planet data is overkill.
    NOTE: set_ayanamsa() must be called once BEFORE calling this in a loop for speed.
    """
    if swe is None:
        raise RuntimeError("Swiss Ephemeris not loaded.")
    
    flags = FLAGS | swe.FLG_SIDEREAL

    # Sun
    sun_res = swe.calc_ut(jd_ut, swe.SUN, flags)
    # Moon
    moon_res = swe.calc_ut(jd_ut, swe.MOON, flags)
    # Jupiter
    jup_res = swe.calc_ut(jd_ut, swe.JUPITER, flags)
    # Venus
    ven_res = swe.calc_ut(jd_ut, swe.VENUS, flags)

    return {
        "Sun": normalize_degrees(sun_res[0][0]),
        "Moon": normalize_degrees(moon_res[0][0]),
        "Jupiter": normalize_degrees(jup_res[0][0]),
        "Venus": normalize_degrees(ven_res[0][0])
    }


# ---------------------------------------------------------------------------
# Self-Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian

    now = datetime.datetime.utcnow()
    jd = datetime_to_julian(now)

    out = get_all_planetary_positions(jd)
    for k, v in out.items():
        print(f"{k}: {v['sidereal']['lon']:.4f}° sidereal")
