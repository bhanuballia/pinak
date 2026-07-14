def classify_destiny(vector):

    dom = vector.get("dominant_planets", [])
    archetype = vector.get("archetype")

    if "Sun" in dom:
        return "Royal Destiny"

    if "Saturn" in dom:
        return "Karmic Builder"

    if "Jupiter" in dom:
        return "Wisdom Path"

    if archetype:
        return f"{archetype} Destiny"

    return "Adaptive Destiny"
