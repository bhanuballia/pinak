
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def marriage_matrix(chart, dasha, strength):

    venus = _get_strength(strength, "Venus", 0.5)
    moon = _get_strength(strength, "Moon", 0.5)
    jupiter = _get_strength(strength, "Jupiter", 0.5)

    score = venus*0.4 + moon*0.3 + jupiter*0.3

    windows = []

    for period in dasha.get("list",[]):
        if period["lord"] in ["Venus","Moon","Jupiter"]:
            year = period["start_date"].split("/")[-1] if "/" in period["start_date"] else period["start_date"][:4]
            windows.append(year)

    return {
        "score": round(score,2),
        "best_years": windows[:6]
    }
