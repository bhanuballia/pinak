# panchang/yoga.py
"""
Yoga calculation.

Yoga is classically defined as fractional part of (Sun longitude + Moon longitude)
divided into 27 equal parts (360°/27 = 13°20' = 13.333333...°).

This module returns:
  - yoga_index (0..26)
  - yoga_degree (the combined angle mod 360)
  - degrees_into_yoga (0..13.333...)
  - fraction (0..1)
  - optional yoga_name (standard list included; names/traditions may vary)
"""

from __future__ import annotations
from typing import Dict, Any
import math

from core.utils import normalize_angle
from astronomy.positions import get_all_planetary_positions

YOGA_SIZE_DEG = 360.0 / 27.0  # 13.333333333333334

# Common yoga names (widely used list) — note: different texts may use variants.
YOGA_NAMES = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi",
    "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata",
    "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti"
]


def compute_yoga_from_longitudes(sun_lon: float, moon_lon: float) -> Dict[str, Any]:
    """
    Compute yoga from sidereal Sun & Moon longitudes.
    """
    combined = normalize_angle(sun_lon + moon_lon)  # 0..360
    yoga_index = int(combined // YOGA_SIZE_DEG) % 27
    degrees_into = combined - (yoga_index * YOGA_SIZE_DEG)
    fraction = degrees_into / YOGA_SIZE_DEG

    name = YOGA_NAMES[yoga_index] if 0 <= yoga_index < len(YOGA_NAMES) else f"Yoga {yoga_index+1}"

    return {
        "yoga_index": int(yoga_index),
        "yoga_name": name,
        "combined_angle": float(combined),
        "degrees_into_yoga": float(degrees_into),
        "fraction": float(fraction),
    }


def get_yoga(jd_ut: float) -> Dict[str, Any]:
    """
    Compute yoga for a JD (UT) using sidereal Sun & Moon.
    """
    planets = get_all_planetary_positions(jd_ut)
    sun_lon = float(planets["Sun"]["sidereal"]["lon"])
    moon_lon = float(planets["Moon"]["sidereal"]["lon"])
    return compute_yoga_from_longitudes(sun_lon, moon_lon)
