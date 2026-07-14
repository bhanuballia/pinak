def oracle_tone(score):

    if score > 75:
        return "optimistic"

    if score > 50:
        return "balanced"

    return "cautious"
