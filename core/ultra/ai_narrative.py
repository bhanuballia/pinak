def build_ai_narrative(chart, rajyoga, career, sade_sati, kalsarp):

    text = []

    if rajyoga["level"] == "Royal":
        text.append(
            "Your chart shows powerful Rajyoga combinations indicating leadership and recognition."
        )

    if career["level"] in ["High", "Very High"]:
        text.append(
            "Career growth is strongly supported, especially in structured or technical professions."
        )

    if sade_sati["active"]:
        text.append(
            "Saturn’s Sade-Sati phase may bring karmic lessons, requiring patience and discipline."
        )

    if kalsarp != "Unknown":
        text.append(
            f"The presence of {kalsarp} Kaal Sarp Yoga suggests intense transformation phases."
        )

    return " ".join(text)
