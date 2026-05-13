
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def career_matrix(chart, strength):

    saturn = _get_strength(strength, "Saturn", 0.5)
    sun = _get_strength(strength, "Sun", 0.5)
    mercury = _get_strength(strength, "Mercury", 0.5)

    breakthrough = (saturn*0.5 + sun*0.3 + mercury*0.2)

    if breakthrough > 0.7:
        level = "High Leadership Karma"
    elif breakthrough > 0.5:
        level = "Stable Growth"
    else:
        level = "Learning Phase"

    return {
        "career_index": round(breakthrough,2),
        "career_phase": level
    }
