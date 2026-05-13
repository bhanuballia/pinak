# charts/divisional/builder.py
"""
Generalized Divisional (Varga) Chart Builder.
Implements mathematical rules for D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60.
"""
from __future__ import annotations
import math
from typing import Dict, Any, List, Tuple, Optional

from core.utils import normalize_angle, get_sign_index, get_sign_name
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant
from charts.houses import compute_whole_sign_houses, get_house_number

def get_varga_sign(longitude: float, d_number: int) -> int:
    """
    Calculate the sign index (0-11) for any planet/point in a specific divisional chart (Varga).
    Implemented per Parashara rules.
    """
    lon = longitude % 360.0
    sign_idx = int(lon // 30)
    deg_in_sign = lon % 30
    
    # D1 - Rashi
    if d_number == 1:
        return sign_idx
    
    # D2 - Hora
    if d_number == 2:
        # Odd sign (Sun/Moon): 0-15 Leo (4), 15-30 Cancer (3)
        # Even sign (Moon/Sun): 0-15 Cancer (3), 15-30 Leo (4)
        is_odd = (sign_idx % 2 == 0) # 0=Aries (Odd relative to counting)
        # Wait, sign_idx 0 is Aries (Odd), 1 is Taurus (Even)
        if (sign_idx % 2 == 0): # Odd sign (1, 3, 5, 7, 9, 11 - Aries, Gemini...)
            return 4 if deg_in_sign < 15 else 3
        else: # Even sign
            return 3 if deg_in_sign < 15 else 4

    # D3 - Drekkana (1/3)
    if d_number == 3:
        # 0-10: Sign itself, 10-20: 5th from it, 20-30: 9th from it
        div = int(deg_in_sign // 10)
        return (sign_idx + (div * 4)) % 12

    # D4 - Chaturthamsa (1/4)
    if d_number == 4:
        # 1st, 2nd, 3rd, 4th divisions map to 1st, 4th, 7th, 10th from sign
        div = int(deg_in_sign // 7.5)
        return (sign_idx + (div * 3)) % 12

    # D7 - Saptamsa (1/7)
    if d_number == 7:
        # Odd sign: Start from sign itself. Even sign: Start from 7th from sign.
        div = int(deg_in_sign // (30/7))
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 6)
        return (start_sign + div) % 12

    # D9 - Navamsa (1/9)
    if d_number == 9:
        # Fire: Ar, Earth: Cp, Air: Li, Water: Cn
        group = sign_idx % 4
        start_map = {0: 0, 1: 9, 2: 6, 3: 3}
        div = int(deg_in_sign // (30/9))
        return (start_map[group] + div) % 12

    # D10 - Dasamsa (1/10)
    if d_number == 10:
        # Odd sign: From sign itself. Even sign: From 9th from sign.
        div = int(deg_in_sign // 3)
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 8)
        return (start_sign + div) % 12

    # D12 - Dwadasamsa (1/12)
    if d_number == 12:
        # Start from sign itself
        div = int(deg_in_sign // 2.5)
        return (sign_idx + div) % 12

    # D16 - Shodashamsa (1/16)
    if d_number == 16:
        # Moveable: Ar, Fixed: Leo, Dual: Sg
        group = sign_idx % 3
        start_map = {0: 0, 1: 4, 2: 8}
        div = int(deg_in_sign // (30/16))
        return (start_map[group] + div) % 12

    # D20 - Vimsamsa (1/20)
    if d_number == 20:
        # Moveable: Ar, Fixed: Sg, Dual: Leo
        group = sign_idx % 3
        start_map = {0: 0, 1: 8, 2: 4}
        div = int(deg_in_sign // 1.5)
        return (start_map[group] + div) % 12

    # D24 - Chaturvimsamsa (1/24)
    if d_number == 24:
        # Odd: Leo, Even: Cancer
        start_sign = 4 if (sign_idx % 2 == 0) else 3
        div = int(deg_in_sign // 1.25)
        return (start_sign + div) % 12

    # D27 - Saptavimsamsa (1/27)
    if d_number == 27:
        # Ar, Cn, Li, Cp for groups
        group = sign_idx % 4
        start_map = {0: 0, 1: 3, 2: 6, 3: 9}
        div = int(deg_in_sign // (30/27))
        return (start_map[group] + div) % 12

    # D30 - Trimsamsa (1/30)
    if d_number == 30:
        # Odd: 5 Ar, 5 Ta, 8 Sg, 7 Ge, 5 Aq
        # Even: 5 Cp, 7 Vi, 8 Pi, 5 Li, 5 Sc
        d = deg_in_sign
        if (sign_idx % 2 == 0): # Odd
            if d < 5: return 0 # Ar
            if d < 10: return 1 # Ta
            if d < 18: return 8 # Sg
            if d < 25: return 2 # Ge
            return 10 # Aq
        else: # Even
            if d < 5: return 9 # Cp
            if d < 12: return 5 # Vi
            if d < 20: return 11 # Pi
            if d < 25: return 6 # Li
            return 7 # Sc

    # D40 - Khavedamsa (1/40)
    if d_number == 40:
        # Odd: Ar, Even: Li
        start_sign = 0 if (sign_idx % 2 == 0) else 6
        div = int(deg_in_sign // 0.75)
        return (start_sign + div) % 12

    # D45 - Akshavedamsa (1/45)
    if d_number == 45:
        # Moveable: Ar, Fixed: Leo, Dual: Sg
        group = sign_idx % 3
        start_map = {0: 0, 1: 4, 2: 8}
        div = int(deg_in_sign // (2.0/3.0))
        return (start_map[group] + div) % 12

    # D60 - Shastiamsa (1/60)
    if d_number == 60:
        # Start from sign itself
        div = int(deg_in_sign // 0.5)
        return (sign_idx + div) % 12

    return sign_idx # Fallback to D1

def build_varga_chart(
    d_number: int,
    jd_ut: float,
    lat: float,
    lon: float,
    house_system: str = "W",
    style: str = "north",
    planet_positions: Optional[Dict[str, Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Build a divisional (varga) chart model for any D-number.
    """
    # 1) Get sidereal positions
    if planet_positions is None:
        planet_positions = get_all_planetary_positions(jd_ut)
    
    # 2) Calculate varga sign for each planet
    varga_positions = {}
    sign_planets = {i: [] for i in range(12)}
    
    for planet, pdata in planet_positions.items():
        sid_lon = float(pdata["sidereal"]["lon"])
        v_sign = get_varga_sign(sid_lon, d_number)
        varga_positions[planet] = {
            "sign_index": v_sign,
            "sign_name": get_sign_name(v_sign * 30.0),
        }
        sign_planets[v_sign].append(planet)

    # 3) Ascendant varga sign
    asc_data = get_ascendant(jd_ut, lat, lon, house_system=house_system)
    asc_deg = float(asc_data["ascendant_deg"])
    asc_v_sign = get_varga_sign(asc_deg, d_number)
    
    # 4) Houses (Whole Sign starting from varga ascendant)
    v_asc_deg = asc_v_sign * 30.0
    whole_houses = compute_whole_sign_houses(v_asc_deg)
    cusps = whole_houses["cusps"]
    
    houses_model = {}
    for h in range(1, 13):
        h_sign = (asc_v_sign + h - 1) % 12
        houses_model[h] = {
            "house_number": h,
            "sign_index": h_sign,
            "sign_name": get_sign_name(h_sign * 30.0),
            "planets": sign_planets[h_sign],
            "cusp_deg": cusps[h]
        }

    return {
        "d_number": d_number,
        "style": style.lower(),
        "ascendant_sign": get_sign_name(v_asc_deg),
        "signs": {
            i: {"sign_index": i, "sign_name": get_sign_name(i * 30.0), "planets": sign_planets[i]}
            for i in range(12)
        },
        "houses": houses_model,
        "planet_positions": planet_positions, # Keep raw for reference if needed
        "varga_positions": varga_positions,
        "jd_ut": jd_ut
    }
