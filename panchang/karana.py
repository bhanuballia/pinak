# panchang/karana.py
"""
Karana calculation.

Karana are half-tithis (each = 6° of Moon-Sun elongation).
There are 11 karanas in the classical sequence; the names and fixed/movable
behaviour are traditional (different sources slightly vary).

This module:
  - Computes half_tithi_index = floor( (Moon - Sun) mod 360 / 6 )  (0..59)
  - Returns karana_index = half_tithi_index mod 11 (0..10)
  - Returns human name from a conventional list (see comment)
Note: representations and labeling vary between traditions — this module
returns numeric indices as authoritative.
"""

from __future__ import annotations
from typing import Dict, Any

from core.utils import normalize_angle
from astronomy.positions import get_all_planetary_positions

# Half-tithi size
HALF_TITHI_DEG = 360.0 / 60.0  # = 6 degrees

# Conventional list of 11 karana names (common mapping).
# NOTE: Traditions differ. If you need a different mapping, tell me and I'll adapt.
KARANA_NAMES = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garija",
    "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
]


def compute_karana_from_longitudes(sun_lon: float, moon_lon: float) -> Dict[str, Any]:
    diff = normalize_angle(moon_lon - sun_lon)  # 0..360
    half_tithi_index = int(diff // HALF_TITHI_DEG)  # 0..59 (or 0..59 inclusive)
    karana_index = half_tithi_index % 11  # 0..10
    name = KARANA_NAMES[karana_index]

    # degrees into current half-tithi
    deg_into = diff - (half_tithi_index * HALF_TITHI_DEG)
    fraction = deg_into / HALF_TITHI_DEG

    return {
        "half_tithi_index": int(half_tithi_index),
        "karana_index": int(karana_index),
        "karana_name": name,
        "degrees_into": float(deg_into),
        "fraction": float(fraction),
        "raw_angle": float(diff),
    }


def get_karana(jd_ut: float) -> Dict[str, Any]:
    planets = get_all_planetary_positions(jd_ut)
    sun_lon = float(planets["Sun"]["sidereal"]["lon"])
    moon_lon = float(planets["Moon"]["sidereal"]["lon"])
    return compute_karana_from_longitudes(sun_lon, moon_lon)
