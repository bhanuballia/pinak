
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def psyche_profile(strength):

    profile = []

    if _get_strength(strength, "Moon", 1) > 1.2:
        profile.append("Emotionally intuitive")

    if _get_strength(strength, "Saturn", 1) > 1.2:
        profile.append("Disciplined and resilient")

    if _get_strength(strength, "Mercury", 1) > 1.2:
        profile.append("Highly analytical thinker")

    return profile
