
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from core.ai_engine.prediction_templates import *

def build_career_text(strength, timeline):

    text = []

    career_score = _get_strength(strength, "career_score", 50)

    if career_score > 70:
        text.extend(CAREER_STRONG)
    else:
        text.extend(CAREER_WEAK)

    for y in timeline:
        for e in y.get("events", []):
            if e["type"] == "career_growth":
                text.append(f"{y['year']} may bring opportunities for expansion.")

    return " ".join(text)


def build_relationship_text(strength, timeline):

    text = []

    rel = _get_strength(strength, "relationship_score", 50)

    if rel > 60:
        text.extend(RELATIONSHIP_STRONG)
    else:
        text.extend(RELATIONSHIP_WEAK)

    return " ".join(text)


def build_health_text(dosha):

    text = []

    if dosha.get("sadesati", {}).get("active"):
        text.extend(HEALTH_CAUTION)

    return " ".join(text)
