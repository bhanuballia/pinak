def build_personality_profile(ctx):

    strength_data = ctx.get("strength", {})
    # If the strength data has a 'planets' key, use that
    if isinstance(strength_data, dict) and "planets" in strength_data:
        strength_items = strength_data["planets"].items()
    else:
        strength_items = strength_data.items()

    def get_score(val):
        if isinstance(val, dict):
            return val.get("total", val.get("total_score", 0))
        return val if isinstance(val, (int, float)) else 0

    strong_planets = sorted(
        strength_items,
        key=lambda x: get_score(x[1]),
        reverse=True
    )

    dominant = strong_planets[0][0] if strong_planets else "Sun"

    profile = {
        "dominant_energy": dominant,
        "is_spiritual": dominant in ["Jupiter", "Ketu"],
        "is_practical": dominant in ["Saturn", "Mercury"],
        "is_emotional": dominant in ["Moon", "Venus"]
    }

    return profile
