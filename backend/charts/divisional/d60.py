"""
charts/divisional/d60.py
==========================
D60 – Shastiamsa | Past-Life Karma · Foundational Blueprint

Classical Odd/Even Mapping:
- Odd Signs: Forward progression from natal sign.
- Even Signs: Reverse progression from natal sign.
"""
from __future__ import annotations
from typing import Dict, Tuple

from charts.divisional.base_varga import SIGNS


class D60Shastiamsa:
    """
    Calculator for the Shastiamsa (D60) divisional chart.
    Uses classical odd/even directional mapping for past-life karma analysis.
    """

    DIVISION = 60
    PART_SIZE = 0.5  # 30° / 60 parts

    def calculate(self, longitude: float) -> Dict:
        """
        Calculate the D60 position for a given sidereal longitude.
        """
        longitude = longitude % 360.0
        sign_index = int(longitude / 30.0)
        degree_in_sign = longitude % 30.0

        division_part = min(
            int(degree_in_sign / self.PART_SIZE),
            self.DIVISION - 1
        )

        # Standard Parashara/Jagannatha Hora D60 Calculation:
        # Continuous forward progression from the natal sign for all signs.
        final_sign = (sign_index + division_part) % 12

        # Professional Fix: Float safety for degree_inside
        degree_inside = min(
            (degree_in_sign % self.PART_SIZE) * self.DIVISION,
            29.999999
        )

        return {
            "division_part": division_part + 1,
            "sign_index": final_sign,
            "sign_name": SIGNS[final_sign],
            "degree": round(degree_inside, 4),
            "varga_longitude": round(
                (final_sign * 30.0) + degree_inside,
                4
            )
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for D60.
        Essential for deep karmic diagnostic analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1


def d60_from_longitude(longitude: float) -> Tuple[int, int, float]:
    """
    Compatibility wrapper for legacy systems.
    Returns (d60_index 0..59, sign_index 0..11, deg_inside 0..30)
    """
    res = D60Shastiamsa().calculate(longitude)
    return (res["division_part"] - 1, res["sign_index"], res["degree"])
