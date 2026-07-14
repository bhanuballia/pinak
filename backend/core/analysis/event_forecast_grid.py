

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



def build_event_forecast_grid(chart, dasha, dosha, strength):
    """
    Creates structured probability-style forecasts.
    Output is NUMERIC analytics — not deterministic fate.
    """

    avg_strength = _get_strength(strength, "average", 60)

    start_year = 2025
    end_year = 2035

    grid = []

    for year in range(start_year, end_year + 1):

        # ---------------------------
        # Base Scores
        # ---------------------------
        career = avg_strength
        marriage = avg_strength
        wealth = avg_strength
        health = avg_strength

        # ---------------------------
        # Dosha modifiers
        # ---------------------------
        if dosha.get("mangalik", {}).get("present"):
            marriage -= 12

        if dosha.get("kalsarp", {}).get("present"):
            career -= 6
            wealth -= 4

        if dosha.get("sadesati", {}).get("present"):
            health -= 10
            career -= 6

        # ---------------------------
        # Simple dasha influence
        # ---------------------------
        lord = _get_dasha_lord(year, dasha)

        if lord in ["Jupiter", "Venus"]:
            wealth += 10
            marriage += 6

        if lord in ["Saturn", "Rahu"]:
            health -= 8

        # Clamp values
        def clamp(v):
            return max(10, min(100, int(v)))

        grid.append({
            "year": year,
            "career": clamp(career),
            "marriage": clamp(marriage),
            "wealth": clamp(wealth),
            "health": clamp(health),
            "dasha_lord": lord,
        })

    return grid


# ----------------------------------------
# Helper
# ----------------------------------------
def _get_dasha_lord(year, dasha):

    for p in dasha.get("list", []):
        try:
            s = int(p["start_date"][:4])
            e = int(p["end_date"][:4])
            if s <= year <= e:
                return p.get("lord")
        except Exception:
            continue

    return dasha.get("current", {}).get("lord", "Unknown")
