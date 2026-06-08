# core/astrology/divisional/d27_bhamsa.py
"""
🪐 D27 — BHAMSA (Nakshatramsha)
Strength · Weakness · Inner Power

✅ CLASSICAL RULE
D27 uses ELEMENTAL GROUPING:
- Fire Signs (Ar, Le, Sg)      -> Start from Aries (0)
- Earth Signs (Ta, Vi, Cp)     -> Start from Cancer (3)
- Air Signs (Ge, Li, Aq)       -> Start from Libra (6)
- Water Signs (Cn, Sc, Pi)     -> Start from Capricorn (9)
"""
from core.astrology.divisional.base.constants import SIGNS
from core.astrology.divisional.base.helpers import (
    normalize_longitude,
    sign_index,
    degree_in_sign,
    safe_division_part,
    safe_varga_degree,
    calculate_varga_house
)
from core.astrology.divisional.base.varga_result import build_varga_result

FIRE = {0, 4, 8}
EARTH = {1, 5, 9}
AIR = {2, 6, 10}
WATER = {3, 7, 11}


class D27Bhamsa:
    DIVISION = 27
    PART_SIZE = 30.0 / 27

    def calculate(self, longitude):
        longitude = normalize_longitude(longitude)
        natal_sign = sign_index(longitude)
        deg = degree_in_sign(longitude)

        division_part = safe_division_part(deg, self.PART_SIZE, self.DIVISION)

        if natal_sign in FIRE:
            start_sign = 0
        elif natal_sign in EARTH:
            start_sign = 3
        elif natal_sign in AIR:
            start_sign = 6
        else: # WATER
            start_sign = 9

        final_sign = (start_sign + division_part) % 12
        
        # Professional Fix: Float safety for degree_inside
        degree_inside = safe_varga_degree((deg % self.PART_SIZE) * self.DIVISION)

        return build_varga_result(
            final_sign,
            SIGNS[final_sign],
            division_part + 1,
            degree_inside
        )

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Standardized house calculation for D27 analysis.
        """
        return calculate_varga_house(asc_sign, planet_sign)
