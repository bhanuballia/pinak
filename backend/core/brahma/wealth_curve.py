
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def build_wealth_curve(dasha, strength):

    curve = []

    for period in dasha.get("list", [])[:20]:

        lord = period["lord"]

        base = _get_strength(strength, lord, 0.5)

        wealth_score = int(base * 100)

        curve.append({
            "lord": lord,
            "start": period["start_date"],
            "score": wealth_score
        })

    return curve
