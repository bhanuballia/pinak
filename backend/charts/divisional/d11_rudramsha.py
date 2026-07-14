"""
charts/divisional/d11_rudramsha.py
=====================================
D11 – Ekadashamsha (Labhamsha)  |  Gains · Power · Success · Elder Siblings

This version uses the Continuous Harmonic 11 Rule (Parashara's Light standard):
- The absolute longitude is multiplied by 11 to determine the D11 position.
"""
from __future__ import annotations
from charts.divisional.base_varga import SIGNS

class D11Rudramsha:
    """
    Calculator for the D11 (Rudramsha/Labhamsha) divisional chart.
    Uses the Harmonic 11 mapping rule to match professional software standards like Parashara's Light.
    """
    
    DIVISION = 11

    def calculate(self, longitude: float) -> dict:
        """
        Calculate the D11 position using the Harmonic 11 rule.
        """
        longitude = float(longitude) % 360.0
        
        # Harmonic 11 calculation: multiply absolute longitude by 11
        varga_lon = (longitude * 11.0) % 360.0
        
        final_sign = int(varga_lon // 30)
        degree_inside = varga_lon % 30.0
        
        # Calculate division part for reporting (1 to 11)
        deg_in_sign = longitude % 30.0
        division_part = min(int(deg_in_sign / (30.0 / 11.0)), 10)

        return {
            "sign_index"    : final_sign,
            "sign_name"     : SIGNS[final_sign],
            "division_part" : division_part + 1,
            "degree"        : round(degree_inside, 4),
            "varga_longitude": round(varga_lon, 4),
        }

    def calculate_house(self, asc_sign: int, planet_sign: int) -> int:
        """
        Calculates the whole-sign house position for D11 analysis.
        """
        return ((planet_sign - asc_sign) % 12) + 1

