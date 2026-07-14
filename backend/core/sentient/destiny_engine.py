def destiny_vector(chart, cosmic):

    score = cosmic.get("weighted_scores", {}).get("cosmic_score", 1)

    if score > 1.3:
        purpose = "Expansion & leadership path"
    elif score < 0.9:
        purpose = "Inner transformation & healing path"
    else:
        purpose = "Balanced evolution path"

    return {
        "cosmic_score": score,
        "life_purpose": purpose
    }
