

from __future__ import annotations
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default



def compute_destiny_matrix(chart, dasha, dosha, strength):
    """
    Generates numeric destiny signals used by visualizers.
    Returns structured matrix data.
    """

    avg_strength = _get_strength(strength, "average", 60)

    # -------------------------
    # BASE SCORES
    # -------------------------
    marriage = []
    wealth = []
    karma = []

    start_year = 2025
    end_year = 2035

    for year in range(start_year, end_year + 1):

        base = avg_strength

        # Saturn Sade Sati impact
        if dosha.get("sadesati", {}).get("present"):
            stability_penalty = 8
        else:
            stability_penalty = 0

        # Mangalik affects relationship curve
        marriage_score = base - (12 if dosha.get("mangalik", {}).get("present") else 0)

        # Kalsarp increases karma intensity
        karma_density = base + (10 if dosha.get("kalsarp", {}).get("present") else 0)

        # Wealth influenced by Jupiter periods
        wealth_score = base + (year % 3) * 4

        marriage.append({"year": year, "value": max(20, min(100, marriage_score))})
        wealth.append({"year": year, "value": max(20, min(100, wealth_score))})
        karma.append({"year": year, "value": max(20, min(100, karma_density - stability_penalty))})

    # Major event windows (example logic)
    events = []
    for p in dasha.get("list", [])[:6]:
        events.append({
            "lord": p.get("lord"),
            "start": p.get("start_date"),
            "end": p.get("end_date"),
        })

    return {
        "marriage_curve": marriage,
        "wealth_curve": wealth,
        "karma_curve": karma,
        "events": events,
    }
