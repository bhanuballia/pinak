# shadbala/sthana_bala.py
"""
Sthana Bala (Positional Strength) - Shadbala Component 1/6

Classical positional strength based on:
- Exaltation/Debilitation
- Own Sign / Moolatrikona
- Kendra / Trikona house placement
- Sign position within degree
"""

from math import fabs

EXALTED = {
    "Sun": 0,     # Aries
    "Moon": 1,    # Taurus
    "Mars": 9,    # Capricorn
    "Mercury": 5, # Virgo
    "Jupiter": 3, # Cancer
    "Venus": 11,  # Pisces
    "Saturn": 6,  # Libra
    "Rahu": 1,    # Taurus
    "Ketu": 7,    # Scorpio
}

DEBILITATED = {
    "Sun": 6,     # Libra
    "Moon": 7,    # Scorpio
    "Mars": 3,    # Cancer
    "Mercury": 11,# Pisces
    "Jupiter": 9, # Capricorn
    "Venus": 5,   # Virgo
    "Saturn": 0,  # Aries
    "Rahu": 7,    # Scorpio
    "Ketu": 1,    # Taurus
}

OWN_SIGNS = {
    "Sun":     [4],        # Leo
    "Moon":    [3],        # Cancer
    "Mars":    [0, 7],     # Aries, Scorpio
    "Mercury": [2, 5],     # Gemini, Virgo
    "Jupiter": [8, 11],    # Sagittarius, Pisces
    "Venus":   [1, 6],     # Taurus, Libra
    "Saturn":  [9, 10],    # Capricorn, Aquarius
    "Rahu":    [5],        # Virgo
    "Ketu":    [11],       # Pisces
}

MOOLATRIKONA = {
    "Sun":     (4, 0, 20),      # Leo 0–20
    "Moon":    (1, 4, 30),      # Taurus 4–30
    "Mars":    (0, 0, 12),      # Aries 0–12
    "Mercury": (5, 16, 20),     # Virgo 16–20
    "Jupiter": (8, 0, 10),      # Sagittarius 0–10
    "Venus":   (6, 0, 15),      # Libra 0–15
    "Saturn":  (10, 0, 20),     # Aquarius 0–20
}


def _get_sign_index(longitude: float) -> int:
    return int(longitude // 30) % 12


def _get_degree_in_sign(longitude: float) -> float:
    return longitude % 30.0


def calculate_sthana_bala(chart: dict, planet: str) -> float:
    """
    Calculate Sthana Bala (Positional Strength) for a planet.

    Returns a score in the range 0–60 Rupas (classical scale).
    """
    planet_data = chart.get("planet_positions", {}).get(planet, {})

    lon = float(planet_data.get("longitude", 0.0))
    house = int(planet_data.get("house", 1))

    sign_idx = _get_sign_index(lon)
    deg_in_sign = _get_degree_in_sign(lon)

    score = 30.0  # Base neutral score

    # Exaltation / Debilitation
    if sign_idx == EXALTED.get(planet):
        score = 60.0
    elif sign_idx == DEBILITATED.get(planet):
        score = 10.0
    else:
        # Moolatrikona check
        mt = MOOLATRIKONA.get(planet)
        if mt and sign_idx == mt[0] and mt[1] <= deg_in_sign <= mt[2]:
            score = 52.0
        elif sign_idx in OWN_SIGNS.get(planet, []):
            score = 45.0

    # House placement bonus/penalty
    if house in [1, 4, 7, 10]:   # Kendra
        score += 10.0
    elif house in [5, 9]:         # Trikona
        score += 7.0
    elif house in [6, 8, 12]:     # Dusthana
        score -= 10.0

    # Scale from 0-60 to 0-250 classical range
    scaled_score = (score / 60.0) * 250.0
    return max(0.0, min(round(scaled_score, 2), 250.0))
