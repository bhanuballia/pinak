# charts/navamsa_chart.py
"""
Navamsa (D9) chart builder.

Computes Navamsa positions and builds a structured chart model similar to
charts/rashi_chart.py. Uses sidereal planetary longitudes produced by
astronomy.positions.get_all_planetary_positions().

Key rules:
- Navamsa divides the 360° zodiac into 108 equal parts (each = 360/108 = 3°20' = 3.333...°).
- navamsa_index = floor(longitude / (360/108)) -> 0..107
- navamsa_sign_index = navamsa_index % 12 -> 0..11 (Aries=0)
- Navamsa houses in this implementation are presented as whole-sign starting
  from the Navamsa ascendant (common practice).

Output model example:
{
  "navamsa_size_deg": 3.3333333,
  "ascendant_navamsa_sign": "Gemini",
  "signs": {0: {"planets":[...]}, ...},
  "houses": {1: {"planets":[...], "cusp_deg": ...}, ...},
  "planet_navamsa": {"Sun": {"navamsa_index":..., ...}, ...},
  "raw_planet_positions": {...}
}
"""
from __future__ import annotations

import math
from typing import Dict, Any, List, Optional, Tuple

from core.utils import normalize_angle, get_sign_index, get_sign_name
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant
from charts.houses import compute_whole_sign_houses, get_house_number

# 108 divisions in D9
NAVAMSA_DIVISIONS = 108
NAVAMSA_SIZE_DEG = 360.0 / NAVAMSA_DIVISIONS  # 3.3333333333333335


def _navamsa_index_from_longitude(long_deg: float) -> int:
    """Return navamsa index (0..107) for a given sidereal longitude (0..360)."""
    long_deg = normalize_angle(long_deg)
    idx = int(math.floor(long_deg / NAVAMSA_SIZE_DEG))
    # Defensive clamp
    if idx < 0:
        idx = 0
    if idx >= NAVAMSA_DIVISIONS:
        idx = NAVAMSA_DIVISIONS - 1
    return idx


def _navamsa_sign_from_navamsa_index(nav_idx: int) -> int:
    """Convert navamsa index (0..107) -> navamsa sign index (0..11)."""
    return nav_idx % 12


def d9_from_longitude(long_deg: float) -> Tuple[int, int, float]:
    """
    Return (navamsa_index 0..107, navamsa_sign_index 0..11, deg_inside 0..NAVAMSA_SIZE_DEG)
    """
    long_deg = long_deg % 360.0
    idx = int(math.floor(long_deg / NAVAMSA_SIZE_DEG))
    idx = min(max(idx, 0), NAVAMSA_DIVISIONS - 1)
    sign_idx = idx % 12
    start = idx * NAVAMSA_SIZE_DEG
    deg_inside = long_deg - start
    if deg_inside < 0:
        deg_inside += NAVAMSA_SIZE_DEG
    return idx, sign_idx, deg_inside


def build_navamsa_positions(planet_positions: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Compute navamsa info for each planet given the structure returned by
    astronomy.positions.get_all_planetary_positions().

    Returns dict keyed by planet name with navamsa metadata.
    """
    result: Dict[str, Dict[str, Any]] = {}

    for planet, pdata in planet_positions.items():
        sid_lon = float(pdata["sidereal"]["lon"])
        nav_idx = _navamsa_index_from_longitude(sid_lon)
        nav_sign = _navamsa_sign_from_navamsa_index(nav_idx)
        navamsa_start_deg = nav_idx * NAVAMSA_SIZE_DEG
        lon_in_navamsa = normalize_angle(sid_lon - navamsa_start_deg)
        # Ensure 0..NAVAMSA_SIZE_DEG
        if lon_in_navamsa < 0:
            lon_in_navamsa += NAVAMSA_SIZE_DEG

        result[planet] = {
            "sidereal_lon": sid_lon,
            "navamsa_index": nav_idx,
            "navamsa_sign_index": nav_sign,
            "lon_in_navamsa_deg": lon_in_navamsa,
        }

    return result


def group_planets_by_navamsa_sign(nav_positions: Dict[str, Dict[str, Any]]) -> Dict[int, List[str]]:
    """Group planets into navamsa signs 0..11."""
    sign_map: Dict[int, List[str]] = {i: [] for i in range(12)}
    for planet, pdata in nav_positions.items():
        sign_idx = pdata["navamsa_sign_index"]
        sign_map[sign_idx].append(planet)
    return sign_map


def build_navamsa_chart(
    jd_ut: float,
    lat: float,
    lon: float,
    house_system: str = "W",
    style: str = "north",
) -> Dict[str, Any]:
    """
    Build a Navamsa (D9) chart model.

    Parameters:
    - jd_ut: Julian Day (UT)
    - lat, lon: geographic location (used to compute Ascendant -> navamsa ascendant)
    - house_system: used to compute base ascendant; navamsa houses are presented as whole-sign
    - style: placeholder to match rashi_chart API (renderers may ignore)

    Returns a dictionary model describing the navamsa chart.
    """
    # 1) Get sidereal planetary positions
    planet_positions = get_all_planetary_positions(jd_ut)

    # 2) Build navamsa positions
    nav_positions = build_navamsa_positions(planet_positions)

    # 3) Determine navamsa ascendant from main ascendant
    asc_data = get_ascendant(jd_ut, lat, lon, house_system=house_system)
    asc_deg = float(asc_data["ascendant_deg"])
    asc_nav_idx = _navamsa_index_from_longitude(asc_deg)
    asc_nav_sign = _navamsa_sign_from_navamsa_index(asc_nav_idx)
    asc_nav_sign_name = get_sign_name(asc_nav_sign * 30.0)
    nav_asc_deg = asc_nav_sign * 30.0  # 0° of navamsa ascendant sign

    # 4) Group planets by navamsa sign
    signs = group_planets_by_navamsa_sign(nav_positions)

    # 5) Compute whole-sign navamsa cusps starting at nav_asc_deg
    whole_nav = compute_whole_sign_houses(nav_asc_deg)
    nav_cusps = whole_nav["cusps"]  # list [None, c1..c12]

    # 6) Map planets into navamsa houses using nav_cusps
    nav_houses_map: Dict[int, List[str]] = {i: [] for i in range(1, 13)}
    for planet, pdata in nav_positions.items():
        nav_sign_idx = pdata["navamsa_sign_index"]
        nav_sign_start = nav_sign_idx * 30.0
        nav_full_lon = normalize_angle(nav_sign_start + pdata["lon_in_navamsa_deg"])
        house_no = get_house_number(nav_full_lon, nav_cusps)
        nav_houses_map[house_no].append(planet)

    # 7) Build output model
    model: Dict[str, Any] = {
        "style": style.lower(),
        "house_system": house_system,
        "navamsa_size_deg": NAVAMSA_SIZE_DEG,
        "ascendant_navamsa_index": asc_nav_sign,
        "ascendant_navamsa_sign": asc_nav_sign_name,
        "navamsa_ascendant_deg": nav_asc_deg,
        "signs": {
            i: {
                "sign_index": i,
                "sign_name": get_sign_name(i * 30.0),
                "planets": signs[i],
            }
            for i in range(12)
        },
        "houses": {
            h: {
                "house_number": h,
                "sign_index": get_sign_index(nav_cusps[h]),
                "sign_name": get_sign_name(get_sign_index(nav_cusps[h]) * 30.0),
                "planets": nav_houses_map[h],
                "cusp_deg": nav_cusps[h],
            }
            for h in range(1, 13)
        },
        "planet_navamsa": nav_positions,
        "raw_planet_positions": planet_positions,
    }

    return model


# -------------------------
# CLI / SELF-TEST
# -------------------------
if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian

    dt = datetime.datetime(2024, 1, 1, 14, 30)
    lat = 28.6139
    lon = 77.2090
    jd = datetime_to_julian(dt)

    model = build_navamsa_chart(jd, lat, lon, house_system="W", style="north")
    print("Navamsa Ascendant sign:", model["ascendant_navamsa_sign"])
    print("Planets in Navamsa Aries:", model["signs"][0]["planets"])
    print("Navamsa House 1 planets:", model["houses"][1]["planets"])
