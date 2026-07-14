"""
charts/divisional/d5_panchamsha.py
====================================
D5 – Panchamsha  |  Fame · Power · Authority · Recognition

Classical Parashara Rule (NOT movable/fixed/dual):
  Each 6° part is mapped using ODD / EVEN sign logic:

  ODD  signs: Aries(0), Aquarius(10), Sagittarius(8), Gemini(2), Leo(4)
  EVEN signs: Taurus(1), Virgo(5), Pisces(11), Capricorn(9), Cancer(3)

  The five parts are mapped to these specific signs (not consecutive).

NOTE: D5 is a special-case Varga and must NOT use the generic
BaseVargaCalculator (movable/fixed/dual offsets).
"""
from __future__ import annotations

from charts.divisional.base_varga import SIGNS

# 0-based sign indices
_ODD_SIGNS  = {0, 2, 4, 6, 8, 10}   # Aries, Gemini, Leo, Libra, Sg, Aq
_EVEN_SIGNS = {1, 3, 5, 7, 9, 11}   # Taurus, Cancer, Virgo, Sc, Cp, Pi


class D5Panchamsha:
    """
    Calculator for the Panchamsha (D5) divisional chart.

    Uses the authentic classical Parashara odd/even sign rule:
      - Odd  signs  → parts begin at Aries  (index 0)
      - Even signs  → parts begin at Libra  (index 6)
    """

    DIVISION = 5  # five 6°-parts per sign
    PART_SIZE = 30.0 / 5

    def calculate(self, longitude: float) -> dict:
        """
        Calculate the D5 position for a given sidereal longitude.

        Parameters
        ----------
        longitude : sidereal ecliptic longitude in degrees (0–360)

        Returns
        -------
        dict with keys:
          sign_index    – 0-based D5 sign index (0=Aries … 11=Pisces)
          sign_name     – English sign name
          division_part – which 6° part (1–5)
          degree        – degree within the D5 sign (0–30)
          varga_longitude – absolute longitude within the Varga (0-360)
        """
        longitude     = float(longitude) % 360.0
        sign_index    = int(longitude // 30)
        deg_in_sign   = longitude % 30.0
        
        # Issue 1: Float boundary safety
        division_part = min(int(deg_in_sign / self.PART_SIZE), self.DIVISION - 1)

        # Classical Parashara Rule:
        # Odd Signs:  Aries(0), Aquarius(10), Sagittarius(8), Gemini(2), Libra(6)
        # Even Signs: Taurus(1), Virgo(5), Pisces(11), Capricorn(9), Scorpio(7)
        _ODD_MAP  = [0, 10, 8, 2, 6]
        _EVEN_MAP = [1, 5, 11, 9, 7]
        
        if sign_index in _ODD_SIGNS:
            final_sign = _ODD_MAP[division_part]
        else:
            final_sign = _EVEN_MAP[division_part]
        
        # Professional Fix: Float safety for degree_inside
        degree_inside = min(
            (deg_in_sign % self.PART_SIZE) * self.DIVISION,
            29.999999
        )

        # Issue 2: Degree reconstruction
        varga_lon = (final_sign * 30.0) + degree_inside

        return {
            "sign_index"    : final_sign,
            "sign_name"     : SIGNS[final_sign],
            "division_part" : division_part + 1,       # 1-based (1–5)
            "degree"        : round(degree_inside, 4),
            "varga_longitude": round(varga_lon, 4),
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for D5.
        Essential for Fame and Power analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1
