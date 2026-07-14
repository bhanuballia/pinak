
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def calculate_destiny_score(year, dasha, dosha, strength, transits):

    score = 50  # neutral baseline

    # Dasha impact
    lord = None
    for p in dasha.get("list", []):
        p_start = int(p["start_date"].split("/")[-1]) if "/" in p["start_date"] else int(p["start_date"][:4])
        p_end = int(p["end_date"].split("/")[-1]) if "/" in p["end_date"] else int(p["end_date"][:4])
        if p_start <= year <= p_end:
            lord = p["lord"]
            break

    if lord in ["Jupiter","Venus","Moon"]:
        score += 15
    if lord in ["Saturn","Rahu","Ketu"]:
        score -= 10

    # Dosha modifiers
    if dosha.get("kalsarp",{}).get("present"):
        score -= 5

    if dosha.get("manglik",{}).get("present"):
        score -= 3

    # Strength modifier
    score += int(_get_strength(strength, "overall", 50) / 10)

    # Transit boost
    if transits.get("Jupiter",{}).get("house") in [10,11]:
        score += 10

    return max(0,min(100,score))
