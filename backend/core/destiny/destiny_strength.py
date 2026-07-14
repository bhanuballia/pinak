def compute_destiny_power(vector):

    score = 50

    score += len(vector.get("dominant_planets", [])) * 5

    if vector.get("dosha_score", 0) > 2:
        score -= 10

    if vector.get("current_dasha") in ["Sun", "Jupiter"]:
        score += 10

    return max(0, min(100, score))
