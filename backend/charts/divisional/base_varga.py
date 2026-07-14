"""
charts/divisional/base_varga.py
================================
Master BaseVargaCalculator engine for all Parashara divisional charts.

Classical sign groupings (0-indexed):
  MOVABLE  (Chara)  : Aries(0), Cancer(3), Libra(6), Capricorn(9)
  FIXED    (Sthira) : Taurus(1), Leo(4), Scorpio(7), Aquarius(10)
  DUAL     (Dwiswabhava) : Gemini(2), Virgo(5), Sagittarius(8), Pisces(11)
"""
from __future__ import annotations

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

MOVABLE = {0, 3, 6, 9}   # Chara
FIXED   = {1, 4, 7, 10}  # Sthira
DUAL    = {2, 5, 8, 11}  # Dwiswabhava


class BaseVargaCalculator:
    """
    Generic divisional chart calculator using Parashara offsets.

    Parameters
    ----------
    division       : number of divisions per sign (e.g. 5 for D5)
    movable_offset : start offset for Movable signs  (added to sign_index)
    fixed_offset   : start offset for Fixed signs    (added to sign_index)
    dual_offset    : start offset for Dual signs     (added to sign_index)
    """

    def __init__(
        self,
        division: int,
        movable_offset: int,
        fixed_offset: int,
        dual_offset: int,
    ) -> None:
        self.division       = division
        self.part_size      = 30.0 / division
        self.movable_offset = movable_offset
        self.fixed_offset   = fixed_offset
        self.dual_offset    = dual_offset

    # ------------------------------------------------------------------
    def calculate(self, longitude: float) -> dict:
        """
        Returns a dict with sign_index, sign_name, division_part, degree.

        Parameters
        ----------
        longitude : sidereal ecliptic longitude in degrees (0–360)
        """
        longitude    = float(longitude) % 360.0
        sign_index   = int(longitude // 30)
        deg_in_sign  = longitude % 30.0
        
        # Refinement 1: Floating precision safety - prevent index overflow at sign boundaries
        division_part = min(int(deg_in_sign / self.part_size), self.division - 1)

        # Pick the classical offset
        if sign_index in MOVABLE:
            offset = self.movable_offset
        elif sign_index in FIXED:
            offset = self.fixed_offset
        else:  # DUAL
            offset = self.dual_offset

        # Start sign + division number
        final_sign = (sign_index + offset + division_part) % 12

        # Professional Fix: Float safety for degree_inside
        degree_inside = min(
            (deg_in_sign % self.part_size) * self.division,
            29.999999
        )
        
        # Issue 2: Degree reconstruction - total varga longitude for Shadbala/AI
        varga_lon = (final_sign * 30.0) + degree_inside

        return {
            "sign_index"    : final_sign,
            "sign_name"     : SIGNS[final_sign],
            "division_part" : division_part + 1,          # 1-based
            "degree"        : round(degree_inside, 4),
            "varga_longitude": round(varga_lon, 4),
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for the Varga.
        Essential for diagnostic analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1
