
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def predict_marriage_window(chart, dasha, strength, dosha):

    venus = _get_strength(strength, "Venus", 0.5)

    score = venus

    if dosha.get("manglik", {}).get("present"):
        score -= 0.15

    probable_years = []

    for period in dasha.get("list", []):
        if period["lord"] in ["Venus", "Moon", "Jupiter"]:
            year = period["start_date"].split("/")[-1] if "/" in period["start_date"] else period["start_date"][:4]
            probable_years.append(year)

    return {
        "probability": round(max(0, min(1, score)), 2),
        "windows": probable_years[:5]
    }
