
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

            score = (jupiter+venus)/2
            wealth.append({
                "start": p["start_date"],
                "end": p["end_date"],
                "confidence": "High" if score > 60 else "Medium",
                "note": "Major financial growth window" if score > 60 else "Gradual accumulation of wealth"
            })

    return wealth
