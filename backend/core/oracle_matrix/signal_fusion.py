def fuse_astrology_signals(report_data):

    timeline = report_data.get("timeline", [])
    probability = report_data.get("probability_matrix", {})
    karma = report_data.get("karma_simulation", {})
    dosha = report_data.get("dosha", {})

    score = 50

    # Timeline peak boost
    if timeline:
        score += 10

    # Dosha reduction
    if dosha.get("kalsarp", {}).get("present"):
        score -= 10

    # Karma score
    score += karma.get("karma_score", 0) * 0.2

    return {
        "cosmic_score": max(0, min(100, score)),
        "timeline": timeline,
    }
