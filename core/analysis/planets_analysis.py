# core/analysis/planet_analysis.py

from .utils import get_sign_of_planet

EXALTED_SIGNS = {
    "Sun": "Aries",
    "Moon": "Taurus",
    "Mars": "Capricorn"
}


def analyze_planets(chart):

    result = {}

    for planet in EXALTED_SIGNS.keys():

        sign = get_sign_of_planet(chart, planet)

        if sign == EXALTED_SIGNS[planet]:
            result[planet] = "Exalted"
        else:
            result[planet] = "Neutral"

    return result
