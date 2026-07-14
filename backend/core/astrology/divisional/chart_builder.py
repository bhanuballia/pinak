# core/astrology/divisional/chart_builder.py
"""
High-level builder for divisional charts.
Integrates the new registry-based calculators.
"""
from core.astrology.divisional.varga_registry import get_varga_calculator

class DivisionalChartBuilder:
    """
    Standard builder for calculating a full set of planet positions 
    for a specific divisional chart.
    """

    def build(self, planets, d_number):
        """
        Parameters
        ----------
        planets    : dict {name: longitude, ...}
        d_number   : int (e.g. 20 for D20)

        Returns
        -------
        dict {name: varga_result, ...}
        """
        calculator = get_varga_calculator(d_number)
        if not calculator:
            return None

        result = {}
        for planet, longitude in planets.items():
            result[planet] = calculator.calculate(longitude)

        return result
