# panchang/nakshatra.py
"""
Nakshatra Calculator

Computes:
- Nakshatra name (1–27)
- Nakshatra index (0–26)
- Pada (1–4)
- Degrees completed inside the Nakshatra
- Percentage completion

Uses sidereal Moon longitude from astronomy.positions.get_all_planetary_positions().
"""

from __future__ import annotations
from typing import Dict, Any
import math

from core.utils import normalize_angle
from astronomy.positions import get_all_planetary_positions

# ------------------------------------
# CONSTANTS
# ------------------------------------

# 27 Nakshatras, each 13°20' = 13.333333333333°
NAKSHATRA_SIZE_DEG = 360.0 / 27.0   # 13.33333333°
PADA_SIZE_DEG = NAKSHATRA_SIZE_DEG / 4.0  # 3.33333333°

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
    "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]


# ------------------------------------
# CORE CALCULATION
# ------------------------------------

def compute_nakshatra_from_lon(moon_lon: float) -> Dict[str, Any]:
    """
    Compute Nakshatra details given the Moon's sidereal longitude.

    Args:
        moon_lon: float — sidereal Moon longitude 0–360°

    Returns:
        {
           "nakshatra_index": int (0–26),
           "nakshatra_name": str,
           "pada": int (1–4),
           "degrees_completed": float,
           "percentage_completed": float,
           "start_deg": float,
           "end_deg": float,
        }
    """
    moon_lon = normalize_angle(moon_lon)

    # Which Nakshatra?
    nak_index = int(moon_lon // NAKSHATRA_SIZE_DEG)
    nak_name = NAKSHATRAS[nak_index]

    start_deg = nak_index * NAKSHATRA_SIZE_DEG
    end_deg   = start_deg + NAKSHATRA_SIZE_DEG

    degrees_completed = moon_lon - start_deg
    percentage_completed = (degrees_completed / NAKSHATRA_SIZE_DEG) * 100.0

    # Pada calculation
    pada = int(degrees_completed // PADA_SIZE_DEG) + 1
    if pada < 1:
        pada = 1
    if pada > 4:
        pada = 4

    return {
        "nakshatra_index": nak_index,
        "nakshatra_name": nak_name,
        "pada": pada,
        "degrees_completed": degrees_completed,
        "percentage_completed": percentage_completed,
        "start_deg": start_deg,
        "end_deg": end_deg,
    }


# ------------------------------------
# PUBLIC API
# ------------------------------------

def get_nakshatra(jd_ut: float) -> Dict[str, Any]:
    """
    Compute Nakshatra from JD using sidereal Moon longitude.

    Args:
        jd_ut: Julian Day (UT)

    Returns:
        Nakshatra metadata dict (see compute_nakshatra_from_lon)
    """
    planets = get_all_planetary_positions(jd_ut)
    moon_sidereal_lon = planets["Moon"]["sidereal"]["lon"]

    return compute_nakshatra_from_lon(moon_sidereal_lon)


# ------------------------------------
# SELF-TEST
# ------------------------------------

if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian

    dt = datetime.datetime(2024, 1, 1, 6, 30)
    jd = datetime_to_julian(dt)

    info = get_nakshatra(jd)
    print("Nakshatra:", info["nakshatra_name"])
    print("Pada:", info["pada"])
    print("Progress:", round(info["percentage_completed"], 2), "%")
