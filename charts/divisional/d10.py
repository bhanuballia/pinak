# charts/divisional/d10.py
"""
D10 (Dasamsa) chart builder.

Dasamsa divides each sign into 10 parts (each = 3° per part), then maps to signs.
This module implements a standard Dasamsa mapping:
- For an input longitude L (0..360):
    dasamsa_index = floor(L / 3)  (0..119)
    dasamsa_sign_index = dasamsa_index % 12
Returns dasamsa index, sign and degrees inside the dasamsa.
"""
from __future__ import annotations
import math
from typing import Tuple, Dict, Any, List

from core.utils import normalize_angle, get_sign_index, get_sign_name
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant
from charts.houses import compute_whole_sign_houses, get_house_number

DASAMSA_DIVISIONS = 120  # 360 / 3 = 120
DASAMSA_SIZE_DEG = 360.0 / DASAMSA_DIVISIONS  # 3.0


def d10_from_longitude(long_deg: float) -> Tuple[int, int, float]:
    """
    Return (dasamsa_index 0..119, dasamsa_sign_index 0..11, deg_inside 0..3)
    """
    long_deg = long_deg % 360.0
    idx = int(math.floor(long_deg / DASAMSA_SIZE_DEG))
    idx = min(max(idx, 0), DASAMSA_DIVISIONS - 1)
    sign_idx = idx % 12
    start = idx * DASAMSA_SIZE_DEG
    deg_inside = long_deg - start
    if deg_inside < 0:
        deg_inside += DASAMSA_SIZE_DEG
    return idx, sign_idx, deg_inside


def _dasamsa_index_from_longitude(long_deg: float) -> int:
    """Return dasamsa index (0..119) for a given sidereal longitude (0..360)."""
    long_deg = normalize_angle(long_deg)
    idx = int(math.floor(long_deg / DASAMSA_SIZE_DEG))
    # Defensive clamp
    if idx < 0:
        idx = 0
    if idx >= DASAMSA_DIVISIONS:
        idx = DASAMSA_DIVISIONS - 1
    return idx


def _dasamsa_sign_from_dasamsa_index(dasamsa_idx: int) -> int:
    """Convert dasamsa index (0..119) -> dasamsa sign index (0..11)."""
    return dasamsa_idx % 12


def build_dasamsa_positions(planet_positions: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Compute dasamsa info for each planet given the structure returned by
    astronomy.positions.get_all_planetary_positions().

    Returns dict keyed by planet name with dasamsa metadata.
    """
    result: Dict[str, Dict[str, Any]] = {}

    for planet, pdata in planet_positions.items():
        sid_lon = float(pdata["sidereal"]["lon"])
        dasamsa_idx = _dasamsa_index_from_longitude(sid_lon)
        dasamsa_sign = _dasamsa_sign_from_dasamsa_index(dasamsa_idx)
        dasamsa_start_deg = dasamsa_idx * DASAMSA_SIZE_DEG
        lon_in_dasamsa = normalize_angle(sid_lon - dasamsa_start_deg)
        # Ensure 0..DASAMSA_SIZE_DEG
        if lon_in_dasamsa < 0:
            lon_in_dasamsa += DASAMSA_SIZE_DEG

        result[planet] = {
            "sidereal_lon": sid_lon,
            "dasamsa_index": dasamsa_idx,
            "dasamsa_sign_index": dasamsa_sign,
            "lon_in_dasamsa_deg": lon_in_dasamsa,
        }

    return result


def group_planets_by_dasamsa_sign(dasamsa_positions: Dict[str, Dict[str, Any]]) -> Dict[int, List[str]]:
    """Group planets into dasamsa signs 0..11."""
    sign_map: Dict[int, List[str]] = {i: [] for i in range(12)}
    for planet, pdata in dasamsa_positions.items():
        sign_idx = pdata["dasamsa_sign_index"]
        sign_map[sign_idx].append(planet)
    return sign_map


def build_d10_chart(
    jd_ut: float,
    lat: float,
    lon: float,
    house_system: str = "W",
    style: str = "north",
) -> Dict[str, Any]:
    """
    Build a Dasamsa (D10) chart model.

    Parameters:
    - jd_ut: Julian Day (UT)
    - lat, lon: geographic location (used to compute Ascendant -> dasamsa ascendant)
    - house_system: used to compute base ascendant; dasamsa houses are presented as whole-sign
    - style: placeholder to match rashi_chart API (renderers may ignore)

    Returns a dictionary model describing the dasamsa chart.
    """
    # 1) Get sidereal planetary positions
    planet_positions = get_all_planetary_positions(jd_ut)

    # 2) Build dasamsa positions
    dasamsa_positions = build_dasamsa_positions(planet_positions)

    # 3) Determine dasamsa ascendant from main ascendant
    asc_data = get_ascendant(jd_ut, lat, lon, house_system=house_system)
    asc_deg = float(asc_data["ascendant_deg"])
    asc_dasamsa_idx = _dasamsa_index_from_longitude(asc_deg)
    asc_dasamsa_sign = _dasamsa_sign_from_dasamsa_index(asc_dasamsa_idx)
    asc_dasamsa_sign_name = get_sign_name(asc_dasamsa_sign * 30.0)
    dasamsa_asc_deg = asc_dasamsa_sign * 30.0  # 0° of dasamsa ascendant sign

    # 4) Group planets by dasamsa sign
    signs = group_planets_by_dasamsa_sign(dasamsa_positions)

    # 5) Compute whole-sign dasamsa cusps starting at dasamsa_asc_deg
    whole_dasamsa = compute_whole_sign_houses(dasamsa_asc_deg)
    dasamsa_cusps = whole_dasamsa["cusps"]  # list [None, c1..c12]

    # 6) Map planets into dasamsa houses using dasamsa_cusps
    dasamsa_houses_map: Dict[int, List[str]] = {i: [] for i in range(1, 13)}
    for planet, pdata in dasamsa_positions.items():
        dasamsa_sign_idx = pdata["dasamsa_sign_index"]
        dasamsa_sign_start = dasamsa_sign_idx * 30.0
        dasamsa_full_lon = normalize_angle(dasamsa_sign_start + pdata["lon_in_dasamsa_deg"])
        house_no = get_house_number(dasamsa_full_lon, dasamsa_cusps)
        dasamsa_houses_map[house_no].append(planet)

    # 7) Build output model
    model: Dict[str, Any] = {
        "style": style.lower(),
        "house_system": house_system,
        "dasamsa_size_deg": DASAMSA_SIZE_DEG,
        "ascendant_dasamsa_index": asc_dasamsa_sign,
        "ascendant_dasamsa_sign": asc_dasamsa_sign_name,
        "dasamsa_ascendant_deg": dasamsa_asc_deg,
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
                "sign_index": get_sign_index(dasamsa_cusps[h]),
                "sign_name": get_sign_name(get_sign_index(dasamsa_cusps[h]) * 30.0),
                "planets": dasamsa_houses_map[h],
                "cusp_deg": dasamsa_cusps[h],
            }
            for h in range(1, 13)
        },
        "planet_dasamsa": dasamsa_positions,
        "raw_planet_positions": planet_positions,
    }

    return model
