def transit_text(event):

    texts = {
        "career_boost":
            "Jupiter transit supports career elevation and recognition.",

        "pressure_phase":
            "Saturn indicates responsibility, patience and emotional endurance.",

        "relationship_window":
            "Venus transit activates attraction and relationship possibilities.",

        "life_shift":
            "Rahu transit may trigger sudden karmic changes and new direction."
    }

    return texts.get(event,"Important planetary movement detected.")
