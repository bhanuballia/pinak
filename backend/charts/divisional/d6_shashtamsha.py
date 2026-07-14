"""
charts/divisional/d6_shashtamsha.py
=====================================
D6 – Shashtamsha  |  Health · Diseases · Debts · Enemies

Classical Parashara Rule (NOT movable/fixed/dual):
  Each 5° part is mapped using ODD / EVEN sign logic:

  ODD  signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius)
       → sequence starts from Aries  (sign_index 0)

  EVEN signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces)
       → sequence starts from Libra  (sign_index 6)

  The six parts then run consecutively from that start sign.

NOTE: D6 is a special-case Varga and must NOT use the generic
BaseVargaCalculator (movable/fixed/dual offsets). Authentic
classical Jyotish software applies the odd/even directional rule
for accurate health, disease, and enemy karma analysis.
"""
from __future__ import annotations

from charts.divisional.base_varga import SIGNS

# 0-based sign indices
_ODD_SIGNS  = {0, 2, 4, 6, 8, 10}   # Aries, Gemini, Leo, Libra, Sg, Aq
_EVEN_SIGNS = {1, 3, 5, 7, 9, 11}   # Taurus, Cancer, Virgo, Sc, Cp, Pi


class D6Shashtamsha:
    """
    Calculator for the Shashtamsha (D6) divisional chart.

    Uses the authentic classical Parashara odd/even sign rule:
      - Odd  signs  → parts begin at Aries  (index 0)
      - Even signs  → parts begin at Libra  (index 6)
    """

    DIVISION = 6  # six 5°-parts per sign
    PART_SIZE = 30.0 / 6

    def calculate(self, longitude: float) -> dict:
        """
        Calculate the D6 position for a given sidereal longitude.

        Parameters
        ----------
        longitude : sidereal ecliptic longitude in degrees (0–360)

        Returns
        -------
        dict with keys:
          sign_index    – 0-based D6 sign index (0=Aries … 11=Pisces)
          sign_name     – English sign name
          division_part – which 5° part (1–6)
          degree        – degree within the D6 sign (0–30)
          varga_longitude – absolute longitude within the Varga (0-360)
        """
        longitude     = float(longitude) % 360.0
        sign_index    = int(longitude // 30)
        deg_in_sign   = longitude % 30.0
        
        # Issue 1: Float boundary safety
        division_part = min(int(deg_in_sign / self.PART_SIZE), self.DIVISION - 1)

        # Classical Parashara start sign
        start_sign = 0 if sign_index in _ODD_SIGNS else 6  # Aries or Libra

        final_sign    = (start_sign + division_part) % 12
        
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
            "division_part" : division_part + 1,       # 1-based (1–6)
            "degree"        : round(degree_inside, 4),
            "varga_longitude": round(varga_lon, 4),
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for D6.
        Essential for Health and Enemy karma analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1
