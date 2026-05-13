
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def wealth_cycles(chart, dasha, strength):

    wealth = []

    jupiter = _get_strength(strength, "Jupiter", 50)
    venus = _get_strength(strength, "Venus", 50)

    for p in dasha.get("list",[]):

        if p["lord"] in ["Jupiter","Venus"]:

            wealth.append({
                "start": p["start_date"],
                "end": p["end_date"],
                "wealth_growth": int((jupiter+venus)/2)
            })

    return wealth
