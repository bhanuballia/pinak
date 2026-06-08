# shadbala/cheshta_bala.py
"""
Cheshta Bala (Motional Strength) - Shadbala Component 4/6

Cheshta Bala is based on a planet's apparent motion:
- Vakra (Retrograde)          -> Maximum strength (60)
- Vikala (Near stationary)    -> 30
- Sama (Mean motion)          -> 15
- Mandatara (Slower than mean)-> 7.5
- Manda (At apogee / slow)    -> 15
- Cheshta (Direct / faster)   -> Proportional to speed

Sun and Moon do not retrograde; they use a simplified motion model.

Classical mean daily motions (degrees/day):
  Sun     1.0
  Moon   13.2
  Mars    0.524
  Mercury 1.383
  Jupiter 0.083
  Venus   1.2
  Saturn  0.034
  Rahu   -0.053  (always retrograde in Western sense)
  Ketu   -0.053
"""

from math import fabs

MEAN_SPEED = {
    "Sun":     1.000,
    "Moon":   13.200,
    "Mars":    0.524,
    "Mercury": 1.383,
    "Jupiter": 0.083,
    "Venus":   1.200,
    "Saturn":  0.034,
    "Rahu":   -0.053,
    "Ketu":   -0.053,
}


def calculate_cheshta_bala(chart: dict, planet: str) -> float:
    """
    Calculate Cheshta Bala (Motional Strength).

    Reads planet speed from chart['planet_positions'][planet]['speed'].
    Returns score 0–60 Rupas.
    """
    planet_data = chart.get("planet_positions", {}).get(planet, {})
    speed = float(planet_data.get("speed", planet_data.get("speed_lon", 0.0)))

    mean = MEAN_SPEED.get(planet, 1.0)

    # Sun and Moon: proportional to how close to mean motion
    if planet in ("Sun", "Moon"):
        ratio = fabs(speed) / fabs(mean) if mean != 0 else 0.5
        score = min(60.0, ratio * 30.0)
        return round(score, 2)

    # Rahu/Ketu always retrograde — classical gives them fixed cheshta
    if planet in ("Rahu", "Ketu"):
        return 30.0

    # Retrograde (Vakra) — maximum cheshta
    if speed < 0:
        return 60.0

    # Direct motion: score proportional to speed ratio vs mean
    if mean == 0:
        return 15.0

    ratio = speed / mean
    if ratio > 1.0:
        # Faster than mean (Atichara) — still strong
        score = min(60.0, 30.0 + ratio * 10.0)
    elif ratio > 0.5:
        # Near mean (Sama)
        score = 30.0
    elif ratio > 0.1:
        # Slower than mean
        score = 15.0
    else:
        # Near stationary (Vikala)
        score = 30.0

    return round(score, 2)
