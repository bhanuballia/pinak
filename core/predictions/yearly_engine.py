
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

# core/predictions/yearly_engine.py

from .utils import get_dasha_lord_for_year
from .transit_engine import jupiter_transit_effect, saturn_transit_effect


def dasha_effect(lord, strength):

    power = _get_strength(strength, lord, 1)

    if power >= 1.2:
        return f"{lord} dasha supports growth and confidence."
    elif power <= 0.9:
        return f"{lord} dasha requires caution and effort."
    else:
        return f"{lord} dasha gives mixed results."


def yearly_focus(lord):
    return f"Focus on themes ruled by {lord}."


def yearly_risk(lord, dosha):
    if dosha.get("kalsarp", {}).get("present"):
        return "Medium"
    return "Low"


def yearly_prediction(year, chart, dasha, dosha, strength):

    effects = []

    lord = get_dasha_lord_for_year(year, dasha)

    effects.append(dasha_effect(lord, strength))
    effects.append(jupiter_transit_effect(year, chart))
    effects.append(saturn_transit_effect(year, chart))

    if dosha.get("kalsarp", {}).get("present"):
        effects.append(
            "Hidden challenges demand patience and spiritual grounding."
        )

    return {
        "year": year,
        "summary": " ".join(effects),
        "focus": yearly_focus(lord),
        "risk_level": yearly_risk(lord, dosha),
    }
