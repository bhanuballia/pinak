
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from core.decision.cosmic_decision_engine import evaluate_decision


def build_oracle_context(intent, report_data):

    timeline = report_data.get("timeline", [])
    dosha = report_data.get("dosha", {})
    strength = report_data.get("strength", {})
    karma = report_data.get("karma_simulation", {})
    probability = report_data.get("probability_matrix", {})

    context = {}

    # Career reasoning
    if intent == "career":

        decision = evaluate_decision(
            question="career",
            year=report_data["timeline"][0]["year"],
            chart=report_data["chart"],
            timeline=timeline,
            probability_matrix=probability,
            karma_simulation=karma,
            dosha=dosha,
            strength=strength,
        )

        context["decision"] = decision

    # Relationship reasoning
    if intent == "relationship":
        context["dosha"] = dosha.get("manglik", {})
        context["love_probability"] = probability

    # Finance reasoning
    if intent == "finance":
        context["jupiter_strength"] = _get_strength(strength, "jupiter", 50)

    return context
