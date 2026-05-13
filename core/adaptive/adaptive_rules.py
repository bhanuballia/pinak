def apply_adaptive_rules(ctx, profile, weights):

    summary = []

    if profile["is_spiritual"]:
        summary.append("Life path leans toward inner growth and higher knowledge.")

    if weights["career"] > 1.2:
        summary.append("Professional evolution is a major theme of this period.")

    if weights["relationships"] > 1.2:
        summary.append("Emotional maturity and partnerships shape destiny cycles.")

    return " ".join(summary)
