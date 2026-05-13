
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def compute_rajyoga_index(chart, strength):

    score = 0

    score = 0

    # House-based lookups
    houses = chart.get("houses", {})
    
    h10 = houses.get(10, houses.get("10", {}))
    if "Jupiter" in h10.get("planets", []):
        score += 3
        
    h1 = houses.get(1, houses.get("1", {}))
    if "Sun" in h1.get("planets", []):
        score += 2

    score += int(_get_strength(strength, "Jupiter", 1) * 2)

    if score >= 7:
        level = "Royal"
    elif score >= 4:
        level = "Strong"
    else:
        level = "Moderate"

    return {
        "score": score,
        "level": level
    }
