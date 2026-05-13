
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
ASTROCONSULT — KARMA SIMULATION ENGINE ULTRA
Simulates alternate life outcomes based on karma effort and remedies.
"""


# ---------------------------------------------------------
# CORE SIMULATION ENTRY
# ---------------------------------------------------------
def run_karma_simulation(
    yearly_predictions,
    probability_matrix,
    dosha,
    strength,
    remedies,
):

    return {
        "baseline": _baseline_path(yearly_predictions),
        "with_remedies": _remedy_path(yearly_predictions, dosha, remedies),
        "high_effort_path": _effort_path(yearly_predictions, strength),
        "spiritual_path": _spiritual_path(yearly_predictions, dosha),
    }


# ---------------------------------------------------------
# BASELINE — original timeline
# ---------------------------------------------------------
def _baseline_path(timeline):
    return [dict(year=t["year"], score=_base_score(t)) for t in timeline]


# ---------------------------------------------------------
# REMEDY PATH — reduces dosha risk
# ---------------------------------------------------------
def _remedy_path(timeline, dosha, remedies):

    modified = []

    for t in timeline:
        score = _base_score(t)

        if remedies:
            score += 5

        if dosha.get("sadesati", {}).get("present"):
            score += 3

        modified.append({
            "year": t["year"],
            "score": min(score, 100)
        })

    return modified


# ---------------------------------------------------------
# HIGH EFFORT PATH — strong personal action
# ---------------------------------------------------------
def _effort_path(timeline, strength):

    modified = []
    effort_bonus = _get_strength(strength, "average", 60) / 10

    for t in timeline:
        score = _base_score(t) + effort_bonus
        modified.append({
            "year": t["year"],
            "score": min(score, 100)
        })

    return modified


# ---------------------------------------------------------
# SPIRITUAL PATH — reduces negative spikes
# ---------------------------------------------------------
def _spiritual_path(timeline, dosha):

    modified = []

    for t in timeline:
        score = _base_score(t)

        if dosha.get("kalsarp", {}).get("present"):
            score += 2

        if dosha.get("pitra", {}).get("present"):
            score += 2

        modified.append({
            "year": t["year"],
            "score": min(score, 100)
        })

    return modified


# ---------------------------------------------------------
# INTERNAL SCORING LOGIC
# ---------------------------------------------------------
def _base_score(year_item):

    risk = year_item.get("risk_level", "medium")

    if risk == "low":
        return 75
    elif risk == "high":
        return 45
    else:
        return 60
