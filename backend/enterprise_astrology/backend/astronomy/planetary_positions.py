# astronomy/planetary_positions.py

from datetime import datetime
from enterprise_astrology.backend.astronomy.swiss_ephemeris import SwissEphemerisEngine

def get_positions(dt: datetime, planets: list):
    """
    Stub to calculate positions of multiple planets in a batch.
    """
    engine = SwissEphemerisEngine()
    results = {}
    for p in planets:
        # Standard planet IDs: Sun=0, Moon=1, Saturn=6
        results[p] = engine.planetary_position(dt, planets.get(p, 0) if isinstance(planets, dict) else 0)
    return results
