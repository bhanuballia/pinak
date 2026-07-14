# core/astrology/divisional/d45_akshavedamsa.py
"""
🪐 D45 — AKSHAVEDAMSA
Paternal Karma · Soul Inheritance

✅ CLASSICAL RULE
D45 uses Movable / Fixed / Dual mapping:
- Movable Signs: Start from Aries (0)
- Fixed Signs: Start from Leo (4)
- Dual Signs: Start from Sagittarius (8)
"""
from core.astrology.divisional.base.constants import SIGNS, MOVABLE, FIXED
from core.astrology.divisional.base.helpers import (
    normalize_longitude,
    sign_index,
    degree_in_sign,
    safe_division_part,
    safe_varga_degree,
    calculate_varga_house
)
from core.astrology.divisional.base.varga_result import build_varga_result


class D45Akshavedamsa:
    DIVISION = 45
    PART_SIZE = 30.0 / 45

    def calculate(self, longitude):
        longitude = normalize_longitude(longitude)
        natal_sign = sign_index(longitude)
        deg = degree_in_sign(longitude)

        division_part = safe_division_part(deg, self.PART_SIZE, self.DIVISION)

        if natal_sign in MOVABLE:
            start_sign = 0
        elif natal_sign in FIXED:
            start_sign = 4
        else: # DUAL
            start_sign = 8

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
        Standardized house calculation for D45 analysis.
        """
        return calculate_varga_house(asc_sign, planet_sign)
