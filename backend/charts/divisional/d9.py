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

SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
]

MOVABLE = [0, 3, 6, 9]
FIXED = [1, 4, 7, 10]
DUAL = [2, 5, 8, 11]

NAVAMSA_SIZE = 30.0 / 9.0


def calculate_d9_position(longitude):
    longitude = longitude % 360.0
    sign_index = int(longitude / 30.0)
    deg_in_sign = longitude % 30.0
    
    # Refinement 1: Float boundary safety
    navamsa_part = min(int(deg_in_sign / (30.0 / 9.0)), 8)

    # Movable signs
    if sign_index in MOVABLE:
        start_sign = sign_index
    # Fixed signs
    elif sign_index in FIXED:
        start_sign = (sign_index + 8) % 12
    # Dual signs
    else:
        start_sign = (sign_index + 4) % 12

    final_sign = (start_sign + navamsa_part) % 12
    
    # Professional Fix: Float safety for degree_inside
    degree_inside_navamsa = min(
        (deg_in_sign % (30.0 / 9.0)) * 9.0,
        29.999999
    )

    return {
        "d9_sign_index": final_sign,
        "d9_sign_name": SIGNS[final_sign],
        "degree_inside_d9": round(degree_inside_navamsa, 4),
        "navamsa_part": navamsa_part + 1
    }


def build_navamsa_positions(planet_positions: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Compute navamsa info for each planet given the structure returned by
    astronomy.positions.get_all_planetary_positions().

    Returns dict keyed by planet name with navamsa metadata.
    """
    result: Dict[str, Dict[str, Any]] = {}

    for planet, pdata in planet_positions.items():
        sid_lon = float(pdata["sidereal"]["lon"])
        d9_info = calculate_d9_position(sid_lon)
        natal_sign = int(sid_lon / 30.0)

        result[planet] = {
            "sidereal_lon": sid_lon,
            "navamsa_sign_index": d9_info["d9_sign_index"],
            "lon_in_navamsa_deg": d9_info["degree_inside_d9"],
            "navamsa_part": d9_info["navamsa_part"],
            "vargottama": natal_sign == d9_info["d9_sign_index"],
        }
        
    # Enforce exact Rahu/Ketu opposite placement in D9
    if "Rahu" in result and "Ketu" in result:
        result["Ketu"]["navamsa_sign_index"] = (result["Rahu"]["navamsa_sign_index"] + 6) % 12
        result["Ketu"]["lon_in_navamsa_deg"] = result["Rahu"]["lon_in_navamsa_deg"]
        
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
    asc_d9 = calculate_d9_position(asc_deg)
    asc_nav_sign = asc_d9["d9_sign_index"]
    asc_nav_sign_name = asc_d9["d9_sign_name"]
    nav_asc_deg = (asc_nav_sign * 30.0) + asc_d9["degree_inside_d9"]

    # 4) Group planets by navamsa sign
    signs = group_planets_by_navamsa_sign(nav_positions)

    # 5) Compute whole-sign navamsa cusps starting at nav_asc_deg
    whole_nav = compute_whole_sign_houses(nav_asc_deg)
    nav_cusps = whole_nav["cusps"]  # list [None, c1..c12]

    # 6) Professional whole-sign relative house mapping
    nav_houses_map: Dict[int, List[str]] = {i: [] for i in range(1, 13)}
    for planet, pdata in nav_positions.items():
        planet_sign = pdata["navamsa_sign_index"]
        house_no = ((planet_sign - asc_nav_sign) % 12) + 1
        nav_houses_map[house_no].append(planet)

    # 7) Build output model
    model: Dict[str, Any] = {
        "style": style.lower(),
        "house_system": house_system,
        "navamsa_size_deg": NAVAMSA_SIZE,
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
