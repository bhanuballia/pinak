
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

# core/predictions/dasha_scoring.py

from .utils import get_dasha_lord_for_year


def score_dasha_periods(year, dasha, strength):

    lord = get_dasha_lord_for_year(year, dasha)

    power = _get_strength(strength, lord, 1)

    if power >= 1.3:
        return 5
    elif power >= 1.1:
        return 3
    elif power >= 0.9:
        return 1
    else:
        return -2
