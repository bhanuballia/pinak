
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

"""
ASTROCONSULT — COSMIC DECISION ENGINE SUPREME
Compares alternate future paths and returns decision advice.
"""


# -------------------------------------------------------
# MAIN ENTRY
# -------------------------------------------------------
def evaluate_decision(
    question,
    year,
    chart,
    timeline,
    probability_matrix,
    karma_simulation,
    dosha,
    strength,
):

    qtype = _detect_question_type(question)

    if qtype == "career":
        return _career_decision(year, timeline, karma_simulation, strength)

    if qtype == "marriage":
        return _marriage_decision(year, timeline, probability_matrix, dosha)

    if qtype == "finance":
        return _finance_decision(year, timeline, strength)

    return {
        "decision": "neutral",
        "confidence": 50,
        "reason": "Insufficient astrological signals detected.",
    }


# -------------------------------------------------------
# QUESTION CLASSIFIER
# -------------------------------------------------------
def _detect_question_type(question):

    q = question.lower()

    if "job" in q or "career" in q or "business" in q:
        return "career"

    if "marriage" in q or "relationship" in q or "love" in q or "marry" in q or "married" in q:
        return "marriage"

    if "money" in q or "finance" in q or "investment" in q:
        return "finance"

    return "general"


# -------------------------------------------------------
# CAREER DECISION
# -------------------------------------------------------
def _career_decision(year, timeline, karma_sim, strength):

    base = _get_year_data(year, timeline)

    effort_path = _get_karmic_score(year, karma_sim, "high_effort_path")

    if effort_path > 70:
        return {
            "decision": "YES — Strong period for career change.",
            "confidence": 82,
            "reason": "High effort path shows upward destiny trend.",
        }

    if base.get("risk_level") == "high":
        return {
            "decision": "WAIT — Not stable for big career moves.",
            "confidence": 70,
            "reason": "Timeline shows elevated karmic resistance.",
        }

    return {
        "decision": "PROCEED CAUTIOUSLY",
        "confidence": 60,
        "reason": "Mixed planetary signals detected.",
    }


# -------------------------------------------------------
# MARRIAGE DECISION
# -------------------------------------------------------
def _marriage_decision(year, timeline, probability_matrix, dosha):

    prob = probability_matrix.get(year, {}).get("love", 50)

    if dosha.get("manglik", {}).get("present"):
        prob -= 10

    if prob > 65:
        return {
            "decision": "FAVORABLE YEAR FOR RELATIONSHIP PROGRESS.",
            "confidence": prob,
            "reason": "Planetary harmony supports bonding.",
        }

    return {
        "decision": "DELAY MAJOR COMMITMENT.",
        "confidence": prob,
        "reason": "Emotional volatility possible.",
    }


# -------------------------------------------------------
# FINANCE DECISION
# -------------------------------------------------------
def _finance_decision(year, timeline, strength):

    base = _get_year_data(year, timeline)

    if _get_strength(strength, "jupiter", 50) > 70:
        return {
            "decision": "GOOD FOR INVESTMENT GROWTH.",
            "confidence": 75,
            "reason": "Strong expansion indicators present.",
        }

    if base.get("risk_level") == "high":
        return {
            "decision": "AVOID HIGH RISK FINANCIAL ACTIONS.",
            "confidence": 80,
            "reason": "Saturnine pressure visible.",
        }

    return {
        "decision": "MODERATE FINANCIAL OUTLOOK.",
        "confidence": 60,
        "reason": "Balanced planetary signals.",
    }


# -------------------------------------------------------
# HELPERS
# -------------------------------------------------------
def _get_year_data(year, timeline):

    for t in timeline:
        if t["year"] == year:
            return t

    return {}


def _get_karmic_score(year, karma_sim, key):

    for item in karma_sim.get(key, []):
        if item["year"] == year:
            return item["score"]

    return 50
