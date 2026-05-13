
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def marriage_window(year, lord, strength):

    score = 0

    if lord in ["Venus", "Moon"]:
        score += 2

    if _get_strength(strength, "Venus", 0) > 1.1:
        score += 1

    if score >= 2:
        return {
            "type": "relationship_peak",
            "message": "Strong partnership and marriage opportunities."
        }

    return None
