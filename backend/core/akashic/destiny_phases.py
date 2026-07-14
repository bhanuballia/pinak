def build_destiny_phases(cosmic):

    score = cosmic.get("weighted_scores",{}).get("cosmic_score",1)

    if score > 1.3:
        return [
            "Expansion Phase",
            "Leadership Awakening",
            "Legacy Building"
        ]

    elif score < 0.9:
        return [
            "Karmic Clearing",
            "Inner Transformation",
            "Spiritual Reset"
        ]

    else:
        return [
            "Growth Phase",
            "Stability Phase",
            "Refinement Phase"
        ]
