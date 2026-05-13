# core/utils.py
"""
General-purpose utility functions used across the astrology engine.

Contains:
- Angle normalization and arithmetic
- Zodiac sign helpers
- Datetime helpers
- Safe parsing utilities
"""

from __future__ import annotations

import math
import datetime
from typing import Optional, Union


# ---------------------------------------------------------------------------
# ANGLE / DEGREE UTILITIES
# ---------------------------------------------------------------------------

def normalize_angle(deg: float) -> float:
    """
    Normalize any angle to the range [0, 360).
    """
    return deg % 360.0


def normalize_angle_signed(deg: float) -> float:
    """
    Normalize angle to [-180, 180).
    Useful for relative angular difference.
    """
    deg = normalize_angle(deg)
    if deg >= 180:
        deg -= 360
    return deg


def angle_diff(a: float, b: float) -> float:
    """
    Shortest signed angular difference from a → b.
    Range: [-180, 180).
    """
    return normalize_angle_signed(b - a)


def in_range(angle: float, start: float, end: float) -> bool:
    """
    Check if an angle is inside [start, end] on a circular range.
    Works even when range wraps across 360 degrees.

    Example:
        in_range(350, 300, 20) → True
    """
    angle = normalize_angle(angle)
    start = normalize_angle(start)
    end = normalize_angle(end)

    if start <= end:
        return start <= angle <= end
    else:
        # wrapped range
        return angle >= start or angle <= end


# ---------------------------------------------------------------------------
# ZODIAC HELPERS
# ---------------------------------------------------------------------------

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def get_sign_index(longitude: float) -> int:
    """
    Convert sidereal longitude to zodiac sign index (0–11).
    """
    return int(normalize_angle(longitude) // 30)


def get_sign_name(longitude: float) -> str:
    """
    Convert longitude to sign name.
    """
    return ZODIAC_SIGNS[get_sign_index(longitude)]


def get_house_from_lagna(lagna: float, longitude: float) -> int:
    """
    Compute house number (1–12) given lagna (ascendant) and object longitude.

    House = floor((planet - lagna) / 30) + 1
    """
    diff = normalize_angle(longitude - lagna)
    return int(diff // 30) + 1


# ---------------------------------------------------------------------------
# DATETIME HELPERS
# ---------------------------------------------------------------------------

def to_datetime(
    date_str: str,
    time_str: str = "00:00:00",
) -> datetime.datetime:
    """
    Safely parse date and time strings into a datetime.

    Accepts:
        "2024-04-02"
        "14:30"
        "14:30:45"

    Returns datetime object (naive, local representation).
    """
    if len(time_str) <= 5:
        time_str += ":00"

    return datetime.datetime.fromisoformat(date_str + " " + time_str)


def apply_timezone(dt: datetime.datetime, tz_offset: float) -> datetime.datetime:
    """
    Convert local datetime to UTC based on tz offset (in hours).
    """
    return dt - datetime.timedelta(hours=float(tz_offset))


# ---------------------------------------------------------------------------
# SAFE PARSERS
# ---------------------------------------------------------------------------

def parse_float(value: Optional[Union[str, float, int]], default: float = 0.0) -> float:
    """
    Safe float parser: returns default on failure.
    """
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def parse_int(value: Optional[Union[str, float, int]], default: int = 0) -> int:
    """
    Safe int parser: returns default on failure.
    """
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


# ---------------------------------------------------------------------------
# LOGGING HELPER (optional)
# ---------------------------------------------------------------------------

def log_header(title: str) -> str:
    """
    Create a nicely formatted header block for debug/log output.
    """
    line = "=" * 50
    return f"\n{line}\n{title}\n{line}\n"


# ---------------------------------------------------------------------------
# MISC UTILS
# ---------------------------------------------------------------------------

def clamp(value: float, min_val: float, max_val: float) -> float:
    """
    Clamp a value between [min_val, max_val].
    """
    return max(min_val, min(value, max_val))
