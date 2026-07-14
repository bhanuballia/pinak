
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default


# core/predictions/life_areas_engine.py

def build_life_area_predictions(chart, strength, dosha):

    predictions = {}

    if _get_strength(strength, "Sun", 1) > 1.1:
        predictions["career"] = "Leadership and authority roles favored."
    else:
        predictions["career"] = "Steady career growth through effort."

    if dosha.get("manglik", {}).get("present"):
        predictions["relationships"] = "Emotional intensity in partnerships."
    else:
        predictions["relationships"] = "Balanced emotional connections."

    predictions["health"] = "Maintain routine and grounding habits."
    predictions["finance"] = "Gradual financial stability indicated."
    predictions["purpose"] = "Strong karmic learning phase."

    return predictions
