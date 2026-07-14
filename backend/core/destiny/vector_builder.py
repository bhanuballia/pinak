
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def build_destiny_vector(report_data, neural):

    basic = report_data.get("basic_details", {})
    strength = report_data.get("strength", {})
    dosha = report_data.get("dosha", {})
    dasha = report_data.get("dasha", {})

    vector = {
        "asc": basic.get("ascendant"),
        "moon_sign": basic.get("sign"),
        "dominant_planets": _get_strength(strength, "strong_planets", []),
        "dosha_score": 0,
        "current_dasha": dasha.get("current", {}).get("lord"),
        "archetype": neural.get("archetype") if neural else None
    }

    # Dosha weighting
    if dosha.get("kalsarp", {}).get("present"):
        vector["dosha_score"] += 2

    if dosha.get("mangalik", {}).get("present"):
        vector["dosha_score"] += 1

    if dosha.get("sadesati", {}).get("present"):
        vector["dosha_score"] += 2

    return vector
