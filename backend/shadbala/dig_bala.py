# shadbala/dig_bala.py
"""
Dig Bala (Directional Strength) - Shadbala Component 2/6

Classical directional strength: each planet has a direction of maximum
strength. The score decreases linearly as the planet moves away from
its ideal house to the exact opposite house (0 Rupas).

Classical ideal houses:
  Jupiter, Mercury -> 1st  (East / Lagna)
  Moon, Venus      -> 4th  (North)
  Saturn           -> 7th  (West)
  Sun, Mars        -> 10th (South / Midheaven)
"""

DIG_IDEAL_HOUSE = {
    "Jupiter":  1,
    "Mercury":  1,
    "Moon":     4,
    "Venus":    4,
    "Saturn":   7,
    "Sun":      10,
    "Mars":     10,
}

# Rahu/Ketu follow shadow-node conventions; give them moderate fixed values
_RAHU_KETU_DIG = 15.0


def calculate_dig_bala(chart: dict, planet: str) -> float:
    """
    Calculate Dig Bala (Directional Strength) for a planet.

    Returns a score in the range 0–60 Rupas (classical scale).
    """
    if planet in ("Rahu", "Ketu"):
        return _RAHU_KETU_DIG

    planet_data = chart.get("planet_positions", {}).get(planet, {})
    house = int(planet_data.get("house", 1))

    ideal = DIG_IDEAL_HOUSE.get(planet, 1)

    # Angular distance between actual house and ideal house (circular, 1-12)
    dist = abs(house - ideal)
    if dist > 6:
        dist = 12 - dist

    # Full strength (60) at ideal house; 0 at opposite (6 houses away)
    score = 60.0 * (1.0 - dist / 6.0)

    return max(0.0, round(score, 2))
