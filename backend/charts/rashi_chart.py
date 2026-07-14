"""
RASI CHART - minimal clean implementation

This file provides a compact, ASCII-only implementation of the
rashi chart builder. It exists to ensure the repository contains a
valid, importable module for chart construction and testing.
"""

from __future__ import annotations

from typing import Dict, Any, List, Optional

from core.utils import get_sign_index, get_sign_name
from astronomy.positions import get_all_planetary_positions
from charts.houses import compute_houses
from nakshatra.nakshatra_engine import NakshatraEngine


def group_planets_by_sign(planet_positions: Dict[str, Dict[str, Any]]) -> Dict[int, List[Dict[str, Any]]]:
    sign_map: Dict[int, List[Dict[str, Any]]] = {i: [] for i in range(12)}
    nak_engine = NakshatraEngine()
    for planet, data in planet_positions.items():
        sid = data["sidereal"]["lon"]
        sign_idx = get_sign_index(sid)
        nak_info = nak_engine.calculate(sid)
        sign_map[sign_idx].append({
            "name": planet,
            "is_retrograde": data.get("is_retrograde", False),
            "is_combust": data.get("is_combust", False),
            "nakshatra": nak_info["nakshatra"]
        })
    return sign_map


def group_planets_by_house(planet_positions: Dict[str, Dict[str, Any]], cusps: List[Optional[float]]) -> Dict[int, List[Dict[str, Any]]]:
    from charts.houses import get_house_number
    house_map: Dict[int, List[Dict[str, Any]]] = {i: [] for i in range(1, 13)}
    nak_engine = NakshatraEngine()
    for planet, data in planet_positions.items():
        lon = data["sidereal"]["lon"]
        house = get_house_number(lon, cusps)
        nak_info = nak_engine.calculate(lon)
        house_map[house].append({
            "name": planet,
            "is_retrograde": data.get("is_retrograde", False),
            "is_combust": data.get("is_combust", False),
            "nakshatra": nak_info["nakshatra"]
        })
    return house_map


def build_rashi_chart(jd_ut: float, lat: float, lon: float, house_system: str = "W", style: str = "north") -> Dict[str, Any]:
    planet_positions = get_all_planetary_positions(jd_ut)
    houses_data = compute_houses(jd_ut, lat, lon, system=house_system)
    asc_deg = houses_data["ascendant_deg"]
    cusps = houses_data["cusps"]

    asc_sign_index = get_sign_index(asc_deg)
    asc_sign_name = get_sign_name(asc_deg)

    signs = group_planets_by_sign(planet_positions)
    houses = group_planets_by_house(planet_positions, cusps)

    # Build houses with sign_name from cusp_deg
    houses_dict = {}
    for h in range(1, 13):
        # cusps is a list with index 0 unused, so cusps[1..12] are valid
        cusp_deg = cusps[h] if h < len(cusps) and cusps[h] is not None else None
        sign_name = get_sign_name(cusp_deg) if cusp_deg is not None else ""
        # Ensure planets list is always present (even if empty)
        planet_list = houses.get(h, [])
        if not isinstance(planet_list, list):
            planet_list = []
        houses_dict[h] = {
            "house_number": h,
            "planets": planet_list,
            "cusp_deg": cusp_deg,
            "sign_name": sign_name,
        }
    
    chart = {
        "style": style.lower(),
        "house_system": house_system,
        "ascendant_deg": asc_deg,
        "ascendant_sign_index": asc_sign_index,
        "ascendant_sign": asc_sign_name,
        "signs": {i: {"sign_index": i, "sign_name": get_sign_name(i * 30), "planets": signs[i]} for i in range(12)},
        "houses": houses_dict,
        "planet_positions": planet_positions,
    }
    return chart


if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian

    dt = datetime.datetime(2024, 1, 1, 14, 30)
    lat = 28.6139
    lon = 77.2090
    jd = datetime_to_julian(dt)

    model = build_rashi_chart(jd, lat, lon, house_system="W", style="north")
    print("Ascendant:", model["ascendant_sign"])
    print("Planets in House 1:", model["houses"][1]["planets"])
