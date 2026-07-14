
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def calculate_probabilities(chart, strength, dosha):

    career_score = _get_strength(strength, "Saturn", 1) * 0.4 + _get_strength(strength, "Sun", 1)*0.3
    marriage_score = _get_strength(strength, "Venus", 1) * 0.5
    finance_score = _get_strength(strength, "Jupiter", 1) * 0.6

    # Dosha penalties
    if dosha.get("manglik",{}).get("present"):
        marriage_score -= 0.1

    if dosha.get("pitra",{}).get("present"):
        finance_score -= 0.05

    return {
        "career": round(max(0,min(1,career_score)),2),
        "marriage": round(max(0,min(1,marriage_score)),2),
        "finance": round(max(0,min(1,finance_score)),2),
    }
