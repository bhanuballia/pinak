def calculate_event_probability(events, dosha):

    score = 0.5

    if "career_growth" in events:
        score += 0.2

    if "relationship_focus" in events:
        score += 0.15

    if dosha.get("kalsarp", {}).get("present"):
        score -= 0.1

    return max(0.0, min(score, 1.0))
