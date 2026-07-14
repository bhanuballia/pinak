def classify_phase(score):

    if score > 0.75:
        return "Expansion Phase"

    if score > 0.55:
        return "Growth Phase"

    if score > 0.35:
        return "Neutral Phase"

    return "Karmic Challenge Phase"
