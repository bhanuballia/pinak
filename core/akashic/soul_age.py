
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def detect_soul_age(chart, strength):

    score = 0

    if _get_strength(strength, "Saturn", 1) > 1.2:
        score += 1

    if _get_strength(strength, "Ketu", 1) > 1.2:
        score += 1

    if _get_strength(strength, "Moon", 1) > 1.2:
        score += 1

    if score == 3:
        stage = "Ancient Soul"
    elif score == 2:
        stage = "Mature Soul"
    else:
        stage = "Young Soul"

    return {
        "stage": stage,
        "score": score
    }
