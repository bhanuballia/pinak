def detect_life_theme(chart, strength):

    asc = chart.get("ascendant", "")

    strong_planet = max(strength, key=strength.get)

    if strong_planet == "Jupiter":
        return "Wisdom & Expansion Path"

    if strong_planet == "Saturn":
        return "Discipline & Mastery Path"

    if strong_planet == "Venus":
        return "Harmony & Creativity Path"

    return f"{asc} Evolution Path"
