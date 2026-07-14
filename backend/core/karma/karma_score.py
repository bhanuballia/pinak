
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def compute_karma_score(year, lord, strength, dosha):

    base = _get_strength(strength, lord, 0.5)

    if dosha.get("kalsarp",{}).get("present"):
        base -= 0.1

    if dosha.get("manglik",{}).get("present"):
        base -= 0.05

    return max(0,min(1,base))
