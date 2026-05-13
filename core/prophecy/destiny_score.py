
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def calculate_destiny_score(chart, strength, dosha):

    base = 50

    # Strength bonus
    base += int(_get_strength(strength, "Jupiter", 50) / 10)
    base += int(_get_strength(strength, "Sun", 50) / 15)

    # Dosha penalties
    if dosha.get("kalsarp",{}).get("present"):
        base -= 8

    if dosha.get("manglik",{}).get("present"):
        base -= 5

    if dosha.get("sadesati",{}).get("present"):
        base -= 6

    return max(0, min(100, base))
