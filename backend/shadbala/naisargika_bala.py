# shadbala/naisargika_bala.py
"""
Naisargika Bala (Natural Strength) - Shadbala Component 5/6

Natural / permanent strength is fixed for each planet and never changes.
Classical order (highest to lowest):
  Sun 60, Moon 51.43, Venus 42.85, Jupiter 34.28, Mercury 25.71, Mars 17.14, Saturn 8.57

Rahu and Ketu are shadow nodes without classical Naisargika values;
we assign them a conservative fixed score.
"""

NAISARGIKA_SCORES = {
    "Sun":     60.00,
    "Moon":    51.43,
    "Venus":   42.85,
    "Jupiter": 34.28,
    "Mercury": 25.71,
    "Mars":    17.14,
    "Saturn":   8.57,
    "Rahu":    10.00,   # Shadow node — conservative
    "Ketu":    10.00,   # Shadow node — conservative
}


def calculate_naisargika_bala(planet: str) -> float:
    """
    Return classical Naisargika Bala (Natural Strength) for a planet.

    This value is constant and does not depend on chart position.
    Score: 0–60 Rupas.
    """
    return NAISARGIKA_SCORES.get(planet, 10.0)
