
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def career_success_probability(chart, strength):

    saturn = _get_strength(strength, "Saturn", 1)
    sun = _get_strength(strength, "Sun", 1)
    mars = _get_strength(strength, "Mars", 1)

    score = (saturn + sun + mars) / 3

    if score > 1.2:
        level = "Very High"
    elif score > 1.0:
        level = "High"
    elif score > 0.8:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "score": round(score, 2),
        "level": level
    }
