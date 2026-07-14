# panchang/tithi.py
"""
Tithi (lunar day) calculations.

Tithi is based on difference in ecliptic longitudes:
    tithi_angle = (Moon_lon - Sun_lon) normalized to 0..360
Each tithi spans 12° (360° / 30 tithis).
Returns:
  - tithi_index (0..29)  -- 0 = Pratipat (Shukla 1), 14 = Purnima, 29 = Amavasya
  - tithi_name (common Sanskrit names)
  - fraction: progress inside the tithi (0..1)
  - degrees_completed: degrees progressed inside tithi (0..12)
"""
from __future__ import annotations
from typing import Dict, Any
import math

from core.utils import normalize_angle
from astronomy.positions import get_all_planetary_positions

TITHI_SIZE_DEG = 360.0 / 30.0  # 12 degrees

# Common tithi names for indices 0..29.
# Indices 0..14: Shukla paksha (Pratipat..Purnima)
# Indices 15..29: Krishna paksha (Pratipat..Amavasya)
TITHI_NAMES = [
    "Pratipat", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipat (Krishna)", "Dvitiya (Krishna)", "Tritiya (Krishna)",
    "Chaturthi (Krishna)", "Panchami (Krishna)",
    "Shashthi (Krishna)", "Saptami (Krishna)", "Ashtami (Krishna)",
    "Navami (Krishna)", "Dashami (Krishna)",
    "Ekadashi (Krishna)", "Dwadashi (Krishna)", "Trayodashi (Krishna)",
    "Chaturdashi (Krishna)", "Amavasya"
]


def compute_tithi_from_longitudes(sun_lon: float, moon_lon: float) -> Dict[str, Any]:
    """
    Compute tithi given sidereal longitudes of Sun and Moon (in degrees).
    """
    diff = normalize_angle(moon_lon - sun_lon)  # 0..360
    tithi_index = int(diff // TITHI_SIZE_DEG)  # 0..29
    degrees_completed = diff - (tithi_index * TITHI_SIZE_DEG)
    fraction = degrees_completed / TITHI_SIZE_DEG

    name = TITHI_NAMES[tithi_index] if 0 <= tithi_index < len(TITHI_NAMES) else f"Tithi {tithi_index+1}"

    return {
        "tithi_index": int(tithi_index),
        "tithi_name": name,
        "degrees_completed": float(degrees_completed),
        "fraction": float(fraction),
        "raw_angle": float(diff),
    }


def get_tithi(jd_ut: float) -> Dict[str, Any]:
    """
    Compute tithi at given Julian Day (UT).
    Uses sidereal positions from astronomy.positions (Moon & Sun sidereal longitudes).
    """
    planets = get_all_planetary_positions(jd_ut)
    sun_lon = float(planets["Sun"]["sidereal"]["lon"])
    moon_lon = float(planets["Moon"]["sidereal"]["lon"])
    return compute_tithi_from_longitudes(sun_lon, moon_lon)
