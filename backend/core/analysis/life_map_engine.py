

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



def compute_life_map(chart, strength, dosha, predictions):
    """
    Produces normalized 0-100 scores for major life domains.
    Uses your existing engines:
        - shadbala strength
        - dosha detection
        - ai predictions
    """

    # Base strength influence
    avg_strength = _get_strength(strength, "average", 60)

    scores = {
        "career": avg_strength,
        "finance": avg_strength,
        "relationships": avg_strength,
        "health": avg_strength,
        "spirituality": avg_strength,
        "happiness": avg_strength,
        "purpose": avg_strength,
        "stability": avg_strength,
    }

    # --------------------------
    # DOSHA MODIFIERS
    # --------------------------
    if dosha.get("mangalik", {}).get("present"):
        scores["relationships"] -= 12

    if dosha.get("sadesati", {}).get("present"):
        scores["stability"] -= 10
        scores["happiness"] -= 8

    if dosha.get("kalsarp", {}).get("present"):
        scores["purpose"] += 6
        scores["stability"] -= 6

    if dosha.get("pitra", {}).get("present"):
        scores["career"] -= 5

    # --------------------------
    # PREDICTION KEYWORD BOOSTS
    # --------------------------
    text_blob = str(predictions).lower()

    if "business" in text_blob:
        scores["career"] += 5

    if "wealth" in text_blob:
        scores["finance"] += 7

    if "spiritual" in text_blob:
        scores["spirituality"] += 10

    # clamp values
    for k in scores:
        scores[k] = max(20, min(100, int(scores[k])))

    return scores
