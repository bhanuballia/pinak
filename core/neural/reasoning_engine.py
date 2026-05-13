def build_neural_summary(report_data, signals, archetype, patterns, adaptive):

    text = []

    text.append(f"Neural Archetype: {archetype}.")

    if patterns:
        text.append("Life patterns detected: " + ", ".join(patterns))

    lord = signals.get("current_dasha_lord")
    if lord:
        text.append(f"Current destiny influence comes from {lord} Mahadasha.")

    if adaptive:
        weights = adaptive.get("weights", {})
        if weights.get("career", 1) > 1.3:
            text.append("Career evolution is a dominant focus right now.")

    return " ".join(text)
