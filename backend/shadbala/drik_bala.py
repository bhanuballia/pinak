# shadbala/drik_bala.py
"""
Drik Bala (Aspectual Strength) - Shadbala Component 6/6

Drik Bala measures the benefit or harm a planet receives from the
aspects of other planets.

Classical aspect strengths (fraction of full aspect):
  Full aspect (1/1) : 7th house from planet
  3/4 aspect        : 4th and 8th house
  1/2 aspect        : 5th and 9th house
  1/4 aspect        : 3rd and 10th house

Benefics (Jupiter, Venus, unafflicted Mercury, waxing Moon) contribute
positive Drik Bala; malefics (Sun, Mars, Saturn, Rahu, Ketu) contribute
negative Drik Bala.
"""

BENEFICS = {"Jupiter", "Venus", "Moon", "Mercury"}
MALEFICS = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}

# Aspect fraction by house distance from aspected planet (1-12)
ASPECT_FRACTION = {
    7:  1.0,
    4:  0.75,
    8:  0.75,
    5:  0.50,
    9:  0.50,
    3:  0.25,
    10: 0.25,
}

# Special full aspects (in addition to 7th)
SPECIAL_ASPECTS = {
    "Mars":    [4, 7, 8],
    "Jupiter": [5, 7, 9],
    "Saturn":  [3, 7, 10],
    "Rahu":    [5, 7, 9],
    "Ketu":    [5, 7, 9],
}

FULL_DRIK_BALA = 60.0


def _house_distance(from_house: int, to_house: int) -> int:
    """1-based circular distance from one house to another (1–12)."""
    return ((to_house - from_house) % 12) or 12


def _get_aspect_strength(aspecting: str, dist: int) -> float:
    """Return fraction of aspect strength for a given planet and distance."""
    specials = SPECIAL_ASPECTS.get(aspecting, [7])
    if dist in specials:
        return 1.0
    return ASPECT_FRACTION.get(dist, 0.0)


def calculate_drik_bala(chart: dict, planet: str) -> float:
    """
    Calculate Drik Bala (Aspectual Strength) for a planet.

    Positive contributions from benefics, negative from malefics.
    Returns score in range 0–60 Rupas.
    """
    planet_data  = chart.get("planet_positions", {}).get(planet, {})
    target_house = int(planet_data.get("house", 1))

    net_score = 0.0

    for aspecting_planet, ap_data in chart.get("planet_positions", {}).items():
        if aspecting_planet == planet:
            continue

        ap_house = int(ap_data.get("house", 1))
        dist     = _house_distance(ap_house, target_house)

        frac = _get_aspect_strength(aspecting_planet, dist)
        if frac == 0.0:
            continue

        contribution = frac * (FULL_DRIK_BALA / 6)  # normalise to ~10 per aspect

        if aspecting_planet in BENEFICS:
            net_score += contribution
        elif aspecting_planet in MALEFICS:
            net_score -= contribution

    # Clamp to -60 to +60
    return round(max(-60.0, min(net_score, 60.0)), 2)
