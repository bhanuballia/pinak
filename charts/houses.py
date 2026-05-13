# charts/houses.py
"""
House systems for Vedic & Western astrology.

Provides:
- compute_houses(jd_ut, lat, lon, system="P")
- compute_whole_sign_houses(ascendant_deg)
- get_house_number(longitude_deg, cusps)

Supported systems (Swiss Ephemeris codes):
    "P" = Placidus
    "K" = Koch
    "O" = Porphyry
    "W" = Whole-Sign (handled manually)
    "C" = Campanus
    "R" = Regiomontanus
    "A" = Alcabitius
    "E" = Equal House (Ascendant-based)
    
The returned structure is consistent for integration with:
- ascendant.py
- positions.py
- full chart engines
"""

from __future__ import annotations

from typing import Dict, Any, List, Optional
import math

from astronomy.ascendant import get_house_cusps
from core.utils import normalize_angle, get_sign_index


# ------------------------------------------------------------------------------
# WHOLE SIGN SYSTEM
# ------------------------------------------------------------------------------

def compute_whole_sign_houses(ascendant_deg: float) -> Dict[str, Any]:
    """
    Whole-sign house system:
    - House 1 = entire sign of the Ascendant (0–30°)
    - House 2 = next sign, etc.
    - House cusps start at 0° of each sign
    """
    asc_sign_index = get_sign_index(ascendant_deg)

    # Build 12 cusps: each is the beginning of a zodiac sign
    cusps = [None]  # index 0 unused (1–12)
    for i in range(12):
        start_sign = (asc_sign_index + i) % 12
        cusp_deg = start_sign * 30.0
        cusps.append(normalize_angle(cusp_deg))

    return {
        "cusps": cusps,                     # 1..12
        "ascendant_deg": ascendant_deg,     # same as input
        "house_system": "W"                 # whole sign
    }


# ------------------------------------------------------------------------------
# EQUAL HOUSE SYSTEM (optional)
# ------------------------------------------------------------------------------

def compute_equal_houses(ascendant_deg: float) -> Dict[str, Any]:
    """
    Equal house system:
    - House 1 begins at the Ascendant degree
    - Each house is 30°
    """
    cusps = [None]

    for i in range(12):
        cusps.append(normalize_angle(ascendant_deg + i * 30.0))

    return {
        "cusps": cusps,
        "ascendant_deg": ascendant_deg,
        "house_system": "E"
    }


# ------------------------------------------------------------------------------
# HELPER: Determine in which house a longitude falls
# ------------------------------------------------------------------------------

def get_house_number(longitude_deg: float, cusps: List[Optional[float]]) -> int:
    """
    Determine the house index (1–12) in which a given longitude falls.
    
    Handles cusp wrapping and loops through each interval:
        cusp[i] → cusp[i+1]

    Returns:
        int in range 1..12
    """
    longitude_deg = normalize_angle(longitude_deg)

    # Wrap cusp list properly
    c = cusps[1:]  # exclude index 0
    c = [normalize_angle(x) for x in c]

    for i in range(12):
        start = c[i]
        end   = c[(i + 1) % 12]

        # Handle wrap cases (e.g., 350° → 20°)
        if start < end:
            if start <= longitude_deg < end:
                return i + 1
        else:  
            # Example: start=350°, end=10°
            if longitude_deg >= start or longitude_deg < end:
                return i + 1

    return 12  # fallback default


# ------------------------------------------------------------------------------
# MAIN ENTRY
# ------------------------------------------------------------------------------

def compute_houses(
    jd_ut: float,
    lat: float,
    lon: float,
    system: str = "P"
) -> Dict[str, Any]:
    """
    Compute house cusps for a given system.

    Parameters:
    - jd_ut: Julian Day (UT)
    - lat, lon: latitude & longitude
    - system: house system code (W=whole sign, E=equal, etc.)

    Returns unified structure:
    {
        "cusps": [...],        # 1..12
        "ascendant_deg": float,
        "mc_deg": float or None,
        "house_system": system
    }
    """

    system = system.upper().strip()

    # Manual whole-sign
    if system == "W":
        asc_data = get_house_cusps(jd_ut, lat, lon)  # to get ascendant
        asc_deg = asc_data["ascendant_deg"]
        return compute_whole_sign_houses(asc_deg)

    # Manual equal house
    if system == "E":
        asc_data = get_house_cusps(jd_ut, lat, lon)
        asc_deg = asc_data["ascendant_deg"]
        return compute_equal_houses(asc_deg)

    # Otherwise use Swiss Ephemeris for real house systems
    swe_data = get_house_cusps(jd_ut, lat, lon, house_system=system)

    return {
        "cusps": swe_data["cusps"],
        "ascendant_deg": swe_data["ascendant_deg"],
        "mc_deg": swe_data["mc_deg"],
        "vertex_deg": swe_data.get("vertex_deg"),
        "house_system": system,
    }


# ------------------------------------------------------------------------------
# DEMO / SELF-TEST
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian

    dt = datetime.datetime(2024, 1, 1, 0, 0)
    lat = 28.6139
    lon = 77.2090
    jd = datetime_to_julian(dt)

    print("\nPlacidus houses:")
    h = compute_houses(jd, lat, lon, "P")
    print(h)

    print("\nWhole-sign houses:")
    w = compute_houses(jd, lat, lon, "W")
    print(w)

    print("\nEqual houses:")
    e = compute_houses(jd, lat, lon, "E")
    print(e)
