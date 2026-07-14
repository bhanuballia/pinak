
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def calculate_soul_purpose(chart, strength):

    moon = _get_strength(strength, "Moon", 0.5)
    jupiter = _get_strength(strength, "Jupiter", 0.5)
    saturn = _get_strength(strength, "Saturn", 0.5)

    soul_index = (moon*0.4 + jupiter*0.4 + saturn*0.2)

    if soul_index > 0.7:
        theme = "Spiritual Guide"
    elif soul_index > 0.5:
        theme = "Teacher / Advisor"
    else:
        theme = "Karma Learner"

    return {
        "soul_index": round(soul_index,2),
        "soul_theme": theme
    }
