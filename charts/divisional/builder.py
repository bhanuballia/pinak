# charts/divisional/builder.py
"""
Generalized Divisional (Varga) Chart Builder.
D5, D6, D8, D11 delegate to modular BaseVargaCalculator-backed classes.
All other charts are computed inline using classical Parashara rules.
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

    # D5 - Panchamsha (1/5) — classical odd/even sign rule (Aries / Libra start)
    if d_number == 5:
        from charts.divisional.d5_panchamsha import D5Panchamsha
        return D5Panchamsha().calculate(lon)["sign_index"]

    # D6 - Shashtamsha (1/6) — classical odd/even sign rule (Aries / Libra start)
    if d_number == 6:
        from charts.divisional.d6_shashtamsha import D6Shashtamsha
        return D6Shashtamsha().calculate(lon)["sign_index"]

    # D7 - Saptamsa (1/7)
    if d_number == 7:
        # Odd sign: Start from sign itself. Even sign: Start from 7th from sign.
        div = int(deg_in_sign // (30 / 7))
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 6)
        return (start_sign + div) % 12

    # D8 - Ashtamsha (1/8) — modality-based mapping (Ar/Sg/Le start)
    if d_number == 8:
        from charts.divisional.d8_ashtamsha import D8Ashtamsha
        return D8Ashtamsha().calculate(lon)["sign_index"]

    # D9 - Navamsa (1/9)
    if d_number == 9:
        from charts.divisional.d9 import calculate_d9_position
        return calculate_d9_position(lon)["d9_sign_index"]

    # D10 - Dasamsa (1/10)
    if d_number == 10:
        from core.astrology.divisional.d10.d10_iyer import D10Iyer
        return D10Iyer().calculate(lon)["sign_index"]

    # D11 - Rudramsha (1/11) — sequential mapping (starts from natal sign)
    if d_number == 11:
        from charts.divisional.d11_rudramsha import D11Rudramsha
        return D11Rudramsha().calculate(lon)["sign_index"]

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

    # D20 - Vimsamsa (1/20) — modular registry call
    if d_number == 20:
        from core.astrology.divisional.varga_registry import get_varga_calculator
        calc = get_varga_calculator(20)
        return calc.calculate(lon)["sign_index"] if calc else sign_idx

    # D24 - Chaturvimsamsa (1/24)
    if d_number == 24:
        # Odd: Leo, Even: Cancer
        start_sign = 4 if (sign_idx % 2 == 0) else 3
        div = int(deg_in_sign // 1.25)
        return (start_sign + div) % 12

    # D27 - Saptavimsamsa (1/27) — modular registry call
    if d_number == 27:
        from core.astrology.divisional.varga_registry import get_varga_calculator
        calc = get_varga_calculator(27)
        return calc.calculate(lon)["sign_index"] if calc else sign_idx

    # D30 - Trimsamsa (1/30)
    if d_number == 30:
        # Odd: 5 Ar, 5 Ta, 8 Sg, 7 Ge, 5 Aq
        # Even: 5 Cp, 7 Vi, 8 Pi, 5 Li, 5 Sc
        d = deg_in_sign
        if (sign_idx % 2 == 0): # Odd sign
            if d < 5: return 0  # Aries (Mars)
            if d < 10: return 10 # Aquarius (Saturn)
            if d < 18: return 8  # Sagittarius (Jupiter)
            if d < 25: return 2  # Gemini (Mercury)
            return 6             # Libra (Venus)
        else: # Even sign
            if d < 5: return 1   # Taurus (Venus)
            if d < 12: return 5  # Virgo (Mercury)
            if d < 20: return 11 # Pisces (Jupiter)
            if d < 25: return 9  # Capricorn (Saturn)
            return 7             # Scorpio (Mars)

    # D40 - Khavedamsa (1/40) — modular registry call
    if d_number == 40:
        from core.astrology.divisional.varga_registry import get_varga_calculator
        calc = get_varga_calculator(40)
        return calc.calculate(lon)["sign_index"] if calc else sign_idx

    # D45 - Akshavedamsa (1/45) — modular registry call
    if d_number == 45:
        from core.astrology.divisional.varga_registry import get_varga_calculator
        calc = get_varga_calculator(45)
        return calc.calculate(lon)["sign_index"] if calc else sign_idx

    # D60 - Shastiamsa (1/60)
    if d_number == 60:
        from charts.divisional.d60 import D60Shastiamsa
        return D60Shastiamsa().calculate(lon)["sign_index"]

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
