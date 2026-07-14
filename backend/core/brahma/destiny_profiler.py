
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def predict_profession(chart, strength):

    tenth = chart.get("houses", {}).get(10, {})
    planets = tenth.get("planets", [])

    if "Sun" in planets and _get_strength(strength, "Sun", 0)>0.6:
        return "Government, leadership, administration"

    if "Mercury" in planets:
        return "Business, trading, consulting, IT"

    if "Mars" in planets:
        return "Engineering, defence, surgery"

    if "Venus" in planets:
        return "Luxury, design, media"

    if "Jupiter" in planets:
        return "Teaching, law, spirituality"

    return "Multiple career paths indicated"
