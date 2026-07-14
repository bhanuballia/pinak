
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def build_personality_profile(chart, strength):

    moon_house = chart.get("moon_house", 1)

    if moon_house in [1,5,9]:
        archetype = "Visionary"
    elif moon_house in [4,8,12]:
        archetype = "Mystic"
    else:
        archetype = "Strategist"

    confidence = round(_get_strength(strength, "Sun", 1)*0.5 +
                       _get_strength(strength, "Moon", 1)*0.5,2)

    return {
        "archetype": archetype,
        "confidence": confidence
    }
