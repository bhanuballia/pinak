# shadbala/threshold_engine.py

# Minimum required Shadbala (in Rupas) per classical texts (B.V. Raman)
MINIMUM_THRESHOLDS = {

    "Sun":     5.0,
    "Moon":    6.0,
    "Mars":    5.0,
    "Mercury": 7.0,
    "Jupiter": 6.5,
    "Venus":   5.5,
    "Saturn":  5.0,
    "Rahu":    5.0,
    "Ketu":    5.0
}


def get_threshold(
    planet
):
    """
    Return the minimum required Shadbala Rupa strength for a planet.

    If the planet is not found in the table, a conservative default
    of 5.0 Rupas is returned.
    """
    return MINIMUM_THRESHOLDS.get(
        planet,
        5.0
    )


def is_sufficient(planet, score):
    """
    Return True if a planet's normalized score meets or exceeds its
    minimum threshold.
    """
    return score >= get_threshold(planet)
