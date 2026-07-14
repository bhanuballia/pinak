def detect_life_patterns(report_data, signals):

    patterns = []

    dasha_lord = signals.get("current_dasha_lord")

    if dasha_lord == "Saturn":
        patterns.append("Slow structured growth phase")

    if signals.get("dosha_intensity", 0) > 1:
        patterns.append("Karmic balancing cycle")

    return patterns
