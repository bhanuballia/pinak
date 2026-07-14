
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def predict_career_growth(chart, strength, timeline):

    saturn = _get_strength(strength, "Saturn", 0.5)
    sun = _get_strength(strength, "Sun", 0.5)

    growth_curve = []

    for year, info in timeline.items():

        value = (saturn * 0.6 + sun * 0.4)

        growth_curve.append({
            "year": year,
            "career_index": round(value, 2)
        })

    return growth_curve
