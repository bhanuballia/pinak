def calculate_focus_weights(ctx):

    weights = {
        "career": 1.0,
        "relationships": 1.0,
        "finance": 1.0,
        "health": 1.0
    }

    dosha = ctx.get("dosha", {})

    if dosha.get("mangalik", {}).get("present"):
        weights["relationships"] += 0.5

    if dosha.get("sadesati", {}).get("present"):
        weights["career"] += 0.4
        weights["health"] += 0.3

    return weights
