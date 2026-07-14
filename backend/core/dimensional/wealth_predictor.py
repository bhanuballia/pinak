
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def predict_wealth_curve(chart, strength, timeline):

    jupiter = _get_strength(strength, "Jupiter", 0.5)
    venus = _get_strength(strength, "Venus", 0.5)

    wealth = []

    for year in timeline.keys():

        index = (jupiter * 0.7 + venus * 0.3)

        wealth.append({
            "year": year,
            "wealth_index": round(index,2)
        })

    return wealth
