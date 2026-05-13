def jupiter_career_trigger(transits):
    return transits.get("Jupiter",{}).get("house") in [10,11]


def saturn_pressure(transits):
    return transits.get("Saturn",{}).get("house") in [8,12]


def venus_relationship_window(transits):
    return transits.get("Venus",{}).get("house") == 7


def rahu_life_shift(transits):
    return transits.get("Rahu",{}).get("house") == 1
