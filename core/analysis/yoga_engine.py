# core/analysis/yoga_engine.py

from .utils import get_planet_house


def detect_yogas(chart):

    yogas = []

    moon = get_planet_house(chart, "Moon")
    jupiter = get_planet_house(chart, "Jupiter")

    # Standard Gajakesari: Moon and Jupiter in Kendras from each other (1, 4, 7, 10 houses)
    # Mathematical house diff: 0, 3, 6, 9
    if moon is not None and jupiter is not None and abs(moon - jupiter) in [0, 3, 6, 9]:
        yogas.append("Gajakesari Yoga")

    sun = get_planet_house(chart, "Sun")
    mercury = get_planet_house(chart, "Mercury")

    if sun == mercury:
        yogas.append("Budhaditya Yoga")

    return yogas
