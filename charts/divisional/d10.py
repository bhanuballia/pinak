# charts/divisional/d10.py
"""
D10 (Dasamsa) chart builder.
Uses the authentic Iyer Method (Parashari Dashamsha).
Odd Signs: Start from same sign.
Even Signs: Start from 9th sign.
"""
from __future__ import annotations
from typing import Tuple, Dict, Any, List

from core.utils import normalize_angle, get_sign_index, get_sign_name
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant
from charts.houses import compute_whole_sign_houses
from core.astrology.divisional.d10.d10_iyer import D10Iyer

def d10_from_longitude(long_deg: float) -> Tuple[int, int, float]:
    """
    Return (division_part 0..9, sign_index 0..11, deg_inside 0..30)
    Compatibility wrapper for legacy systems.
    """
    engine = D10Iyer()
    res = engine.calculate(long_deg)
    return (res["division_part"] - 1, res["sign_index"], res["degree"])


def build_d10_chart(
    jd_ut: float,
    lat: float,
    lon: float,
    house_system: str = "W",
    style: str = "north",
) -> Dict[str, Any]:
    """
    Build a Dasamsa (D10) chart model using the Iyer Method engine.
    """
    # 1) Get sidereal planetary positions
    planet_positions = get_all_planetary_positions(jd_ut)
    engine = D10Iyer()

    # 2) Build dasamsa positions
    v_positions = {}
    sign_planets = {i: [] for i in range(12)}
    
    for planet, pdata in planet_positions.items():
        sid_lon = float(pdata["sidereal"]["lon"])
        res = engine.calculate(sid_lon)
        v_positions[planet] = {
            "sign_index": res["sign_index"],
            "sign_name": res["sign_name"],
            "division_part": res["division_part"],
            "degree": res["degree"],
            "varga_longitude": res["varga_longitude"],
            "deity": res.get("deity")
        }
        sign_planets[res["sign_index"]].append(planet)

    # 3) Determine dasamsa ascendant
    asc_data = get_ascendant(jd_ut, lat, lon, house_system=house_system)
    asc_deg = float(asc_data["ascendant_deg"])
    asc_res = engine.calculate(asc_deg)
    asc_v_sign = asc_res["sign_index"]
    asc_v_sign_name = asc_res["sign_name"]
    v_asc_deg = asc_res["varga_longitude"]
    asc_v_deity = asc_res.get("deity")

    # 4) Compute whole-sign dasamsa cusps
    whole_dasamsa = compute_whole_sign_houses(v_asc_deg)
    dasamsa_cusps = whole_dasamsa["cusps"]

    # 5) Map into houses
    dasamsa_houses_map: Dict[int, List[str]] = {i: [] for i in range(1, 13)}
    for planet, pdata in v_positions.items():
        p_sign = pdata["sign_index"]
        house_no = engine.calculate_house(asc_v_sign, p_sign)
        dasamsa_houses_map[house_no].append(planet)

    # 6) Build output model (aligned with builder.py standard)
    model: Dict[str, Any] = {
        "d_number": 10,
        "style": style.lower(),
        "house_system": house_system,
        "ascendant_sign": asc_v_sign_name,
        "ascendant_sign_index": asc_v_sign,
        "varga_ascendant_deg": v_asc_deg,
        "ascendant_deity": asc_v_deity,
        "signs": {
            i: {
                "sign_index": i,
                "sign_name": get_sign_name(i * 30.0),
                "planets": sign_planets[i],
            }
            for i in range(12)
        },
        "houses": {
            h: {
                "house_number": h,
                "sign_index": (asc_v_sign + h - 1) % 12,
                "sign_name": get_sign_name(((asc_v_sign + h - 1) % 12) * 30.0),
                "planets": dasamsa_houses_map[h],
                "cusp_deg": dasamsa_cusps[h],
            }
            for h in range(1, 13)
        },
        "varga_positions": v_positions,
        "planet_dasamsa": v_positions, # Keep legacy key for safety
        "raw_planet_positions": planet_positions,
    }

    return model
