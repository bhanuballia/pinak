
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def career_cycles(chart, dasha, strength):

    peaks = []

    saturn = _get_strength(strength, "Saturn", 50)
    sun = _get_strength(strength, "Sun", 50)

    for period in dasha.get("list",[]):

        if period["lord"] in ["Saturn","Sun","Mars"]:

            level = (saturn + sun)/2

            peaks.append({
                "start": period["start_date"],
                "end": period["end_date"],
                "career_score": int(level)
            })

    return peaks
