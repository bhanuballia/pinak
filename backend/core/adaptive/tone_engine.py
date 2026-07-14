def choose_tone(profile):

    if profile["is_spiritual"]:
        return "wisdom"

    if profile["is_practical"]:
        return "strategic"

    if profile["is_emotional"]:
        return "supportive"

    return "balanced"
