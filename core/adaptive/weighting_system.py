def calculate_adaptive_weights(profile, report_data):

    weights = {
        "career": 1.0,
        "relationship": 1.0,
        "finance": 1.0,
    }

    # Increase importance based on user focus
    weights["career"] += profile["career_interest"] * 0.10
    weights["relationship"] += profile["relationship_interest"] * 0.10
    weights["finance"] += profile["finance_interest"] * 0.10

    # Reduce weight if heavy dosha present
    dosha = report_data.get("dosha", {})

    if dosha.get("kalsarp", {}).get("present"):
        weights["career"] *= 0.9

    return weights
