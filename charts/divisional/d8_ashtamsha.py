"""
charts/divisional/d8_ashtamsha.py
====================================
D8 – Ashtamsha  |  Longevity · Obstacles · Hidden Matters · Transformation

Classical Parashara Rule (Absolute Mapping):
  Each 3.75° part is mapped based on the sign's modality (NOT simple offsets):

  MOVABLE (Aries, Cancer, Libra, Capricorn)
       → sequence starts from Aries (index 0)

  FIXED   (Taurus, Leo, Scorpio, Aquarius)
       → sequence starts from Sagittarius (index 8)

  DUAL    (Gemini, Virgo, Sagittarius, Pisces)
       → sequence starts from Leo (index 4)

  The eight parts then run consecutively from that start sign.
"""
from __future__ import annotations

from charts.divisional.base_varga import SIGNS, MOVABLE, FIXED, DUAL


class D8Ashtamsha:
    """
    Calculator for the Ashtamsha (D8) divisional chart.

    Uses the authentic classical Parashara modality-based mapping:
      - Movable → parts begin at Aries (index 0)
      - Fixed   → parts begin at Sagittarius (index 8)
      - Dual    → parts begin at Leo (index 4)
    """

    DIVISION = 8  # eight 3.75°-parts per sign
    PART_SIZE = 30.0 / 8

    def calculate(self, longitude: float) -> dict:
        """
        Calculate the D8 position for a given sidereal longitude.

        Parameters
        ----------
        longitude : sidereal ecliptic longitude in degrees (0–360)

        Returns
        -------
        dict with keys:
          sign_index      – 0-based D8 sign index (0=Aries … 11=Pisces)
          sign_name       – English sign name
          division_part   – which 3.75° part (1–8)
          degree          – degree within the D8 sign (0–30)
          varga_longitude – absolute longitude within the Varga (0-360)
        """
        longitude     = float(longitude) % 360.0
        sign_index    = int(longitude // 30)
        deg_in_sign   = longitude % 30.0
        
        # Issue 1: Float boundary safety
        division_part = min(int(deg_in_sign / self.PART_SIZE), self.DIVISION - 1)

        # Classical Parashara start sign based on modality
        if sign_index in MOVABLE:
            start_sign = 0   # Aries
        elif sign_index in FIXED:
            start_sign = 8   # Sagittarius
        else: # DUAL
            start_sign = 4   # Leo

        final_sign    = (start_sign + division_part) % 12
        
        # Professional Fix: Float safety for degree_inside
        degree_inside = min(
            (deg_in_sign % self.PART_SIZE) * self.DIVISION,
            29.999999
        )
        
        # Issue 2: Degree reconstruction
        varga_lon = (final_sign * 30.0) + degree_inside

        return {
            "sign_index"     : final_sign,
            "sign_name"      : SIGNS[final_sign],
            "division_part"  : division_part + 1,
            "degree"         : round(degree_inside, 4),
            "varga_longitude": round(varga_lon, 4),
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for D8.
        Essential for Longevity and Transformation analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1
