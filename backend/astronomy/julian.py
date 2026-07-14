# astronomy/julian.py
"""
Julian Day (JD) and related astronomical time calculations.

Implements:
- datetime → Julian Day (Meeus algorithm)
- Julian Day → datetime (inverse)
- Delta-T placeholder (for nutation & sidereal time corrections)
- J2000 offset helpers

All datetime inputs are expected in UTC.
"""

from __future__ import annotations

import datetime
from typing import Optional


# ---------------------------------------------------------------------------
# CORE JULIAN DAY FUNCTIONS
# ---------------------------------------------------------------------------

def datetime_to_julian(dt: datetime.datetime) -> float:
    """
    Convert a UTC datetime to Julian Day Number (floating point).

    Implements the standard algorithm from:
    Jean Meeus — Astronomical Algorithms (1998), Chapter 7.
    """

    year = dt.year
    month = dt.month
    day = dt.day

    # Convert time to fractional day
    frac_day = (
        dt.hour / 24.0 +
        dt.minute / 1440.0 +
        dt.second / 86400.0 +
        dt.microsecond / 86400_000_000.0
    )

    # January & February → treat as months 13 & 14 of previous year
    if month <= 2:
        year -= 1
        month += 12

    # Gregorian calendar correction
    A = year // 100
    B = 2 - A + (A // 4)

    # Core JD formula
    jd = (
        int(365.25 * (year + 4716))
        + int(30.6001 * (month + 1))
        + day + frac_day + B - 1524.5
    )

    return float(jd)


def julian_to_datetime(jd: float) -> datetime.datetime:
    """
    Convert Julian Day back to a UTC datetime.

    Inverse of the Meeus algorithm.
    """
    jd += 0.5
    Z = int(jd)
    F = jd - Z

    if Z < 2299161:
        A = Z
    else:
        alpha = int((Z - 1867216.25) / 36524.25)
        A = Z + 1 + alpha - (alpha // 4)

    B = A + 1524
    C = int((B - 122.1) / 365.25)
    D = int(365.25 * C)
    E = int((B - D) / 30.6001)

    day = B - D - int(30.6001 * E) + F

    # Extract date
    if E < 14:
        month = E - 1
    else:
        month = E - 13

    if month > 2:
        year = C - 4716
    else:
        year = C - 4715

    # Convert fractional day to time
    day_int = int(day)
    frac = day - day_int

    seconds = frac * 86400.0
    hour = int(seconds // 3600)
    minute = int((seconds % 3600) // 60)
    second = int(seconds % 60)
    micro = int((seconds - int(seconds)) * 1_000_000)

    return datetime.datetime(year, month, day_int, hour, minute, second, micro)


# ---------------------------------------------------------------------------
# J2000 & ASTRONOMICAL UTILITY HELPERS
# ---------------------------------------------------------------------------

J2000 = 2451545.0  # Julian Day of 2000-01-01 12:00 UTC

def julian_centuries_T(jd: float) -> float:
    """
    Julian centuries since J2000 epoch.
    Used for nutation, obliquity, sidereal time, etc.
    """
    return (jd - J2000) / 36525.0


# ---------------------------------------------------------------------------
# DELTA-T (placeholder for high-precision expansions)
# ---------------------------------------------------------------------------

def delta_t(jd: Optional[float] = None, year: Optional[int] = None) -> float:
    """
    ΔT ≈ difference between Terrestrial Time (TT) and Universal Time (UT).

    Placeholder:
        Returns a fixed estimate of 69 seconds (≈ modern average).

    Later you may replace with:
        - Morrison–Stephenson polynomial expansions
        - NASA ΔT tables
        - Espenak & Meeus model (recommended)

    ΔT is needed for:
        - Sidereal time accuracy
        - High-precision eclipse predictions
        - Advanced ayanamsa corrections
    """
    return 69.0  # seconds (placeholder)


# ---------------------------------------------------------------------------
# DEBUG / SELF TEST
# ---------------------------------------------------------------------------

def _self_test():
    """
    Simple internal test to verify correctness.
    """
    dt = datetime.datetime(2000, 1, 1, 12, 0, 0)
    jd = datetime_to_julian(dt)
    print("JD of J2000:", jd)         # Should be 2451545.0
    print("Inverse:", julian_to_datetime(jd))


if __name__ == "__main__":
    _self_test()
