
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def fuse_signals(report_data):

    chart = report_data.get("chart", {})
    dosha = report_data.get("dosha", {})
    dasha = report_data.get("dasha", {})
    strength = report_data.get("strength", {})

    signals = {
        "dominant_planets": [],
        "dosha_intensity": 0,
        "current_dasha_lord": dasha.get("current", {}).get("lord"),
    }

    # Example fusion logic
    for p in _get_strength(strength, "strong_planets", []):
        signals["dominant_planets"].append(p)

    if dosha.get("kalsarp", {}).get("present"):
        signals["dosha_intensity"] += 2

    if dosha.get("mangalik", {}).get("present"):
        signals["dosha_intensity"] += 1

    return signals
