# nakshatra_advanced/kp/ruling_planets.py

def get_ruling_planets(lagna_lord: str, moon_lord: str, day_lord: str):
    """
    Stub to compute the KP ruling planets (RPs) for a given query moment.
    """
    return {
        "ruling_planets": [lagna_lord, moon_lord, day_lord],
        "strongest": lagna_lord
    }
