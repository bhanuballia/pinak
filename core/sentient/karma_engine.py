def karmic_profile(chart, dosha):

    themes = []

    if dosha.get("kalsarp", {}).get("present"):
        themes.append("Intense karmic transformation across lifetimes.")

    if dosha.get("pitra", {}).get("present"):
        themes.append("Ancestral duties shaping present life decisions.")

    ketu_house = chart.get("ketu_house", None)

    if ketu_house:
        themes.append(f"Past-life focus linked to House {ketu_house} experiences.")

    return {
        "karmic_themes": themes,
        "depth_score": len(themes)
    }
