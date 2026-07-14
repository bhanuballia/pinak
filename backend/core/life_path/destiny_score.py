def destiny_score(year, timeline):

    score = 0

    for e in timeline.get("events", []):
        if e["type"] == "career_growth":
            score += 3
        if e["type"] == "relationship_peak":
            score += 2
        if e["type"] == "health_caution":
            score -= 1

    return score
