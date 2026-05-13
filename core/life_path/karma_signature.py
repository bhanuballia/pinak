
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def karma_signature(dosha, strength):

    karma = []

    if dosha.get("kalsarp", {}).get("present"):
        karma.append("Deep karmic transformation cycles")

    if dosha.get("pitra", {}).get("present"):
        karma.append("Ancestral healing themes")

    if _get_strength(strength, "Saturn", 0) > 1.2:
        karma.append("Lessons through responsibility")

    return karma
