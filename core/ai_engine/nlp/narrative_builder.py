
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from core.ai_engine.nlp.language_matrix import *
from core.ai_engine.nlp.sentence_variator import join_sentences


def build_career_narrative(strength, timeline):

    text = []

    score = _get_strength(strength, "career_score", 50)

    text.append(pick(CAREER_OPENINGS))

    if score > 70:
        text.append("confidence and leadership qualities become more visible")
    else:
        text.append("consistent effort helps stabilize professional progress")

    for y in timeline:
        for e in y.get("events", []):
            if e["type"] == "career_growth":
                text.append(f"{y['year']} may highlight a turning point")

    return join_sentences(text)


def build_relationship_narrative(strength):

    text = []

    text.append(pick(RELATIONSHIP_OPENINGS))

    if _get_strength(strength, "relationship_score", 50) < 50:
        text.append("clear communication will be essential")

    text.append(pick(SPIRITUAL_TONE))

    return join_sentences(text)
