# core/astrology/divisional/d40_khavedamsa.py
"""
🪐 D40 — KHAVEDAMSA
Maternal Karma · Auspicious Karma

✅ CLASSICAL RULE
D40 uses ODD / EVEN mapping:
- Odd Signs: Start from Aries (0)
- Even Signs: Start from Libra (6)
"""
from core.astrology.divisional.base.constants import SIGNS, ODD_SIGNS
from core.astrology.divisional.base.helpers import (
    normalize_longitude,
    sign_index,
    degree_in_sign,
    safe_division_part,
    safe_varga_degree,
    calculate_varga_house
)
from core.astrology.divisional.base.varga_result import build_varga_result


class D40Khavedamsa:
    DIVISION = 40
    PART_SIZE = 30.0 / 40

    def calculate(self, longitude):
        longitude = normalize_longitude(longitude)
        natal_sign = sign_index(longitude)
        deg = degree_in_sign(longitude)

        division_part = safe_division_part(deg, self.PART_SIZE, self.DIVISION)

        # Odd signs start from Aries (0), Even from Libra (6)
        start_sign = 0 if natal_sign in ODD_SIGNS else 6

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
        Standardized house calculation for D40 analysis.
        """
        return calculate_varga_house(asc_sign, planet_sign)
