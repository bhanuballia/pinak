def build_archetype(chart, strength):
    if isinstance(strength, dict) and "planets" in strength:
        planets_data = strength["planets"]
        valid_planets = [p for p in planets_data if p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]]
        dominant = max(valid_planets, key=lambda p: planets_data[p].get("total_score", 0) if isinstance(planets_data[p], dict) else 0) if valid_planets else "Jupiter"
    elif isinstance(strength, dict):
        valid_keys = [k for k in strength if isinstance(strength[k], (int, float))]
        dominant = max(valid_keys, key=lambda k: strength[k]) if valid_keys else "Jupiter"
    else:
        dominant = "Jupiter"

    mapping = {
        "Sun": "The Leader",
        "Moon": "The Empath",
        "Mars": "The Warrior",
        "Mercury": "The Analyst",
        "Jupiter": "The Teacher",
        "Venus": "The Artist",
        "Saturn": "The Builder",
        "Rahu": "The Explorer",
        "Ketu": "The Mystic"
    }

    return {
        "dominant_planet": dominant,
        "archetype": mapping.get(dominant, "The Seeker")
    }
