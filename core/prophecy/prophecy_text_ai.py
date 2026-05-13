def generate_prophecy_text(timeline, destiny_score):

    lines = []

    if destiny_score > 75:
        lines.append(
            "The horoscope shows strong karmic momentum with progressive life events."
        )
    else:
        lines.append(
            "Life path develops through steady effort and gradual transformation."
        )

    for t in timeline:

        if t["phase"] == "Marriage Potential":
            lines.append(
                "Relationship energies become active during this period."
            )

        if t["phase"] == "Career Rise":
            lines.append(
                "Professional growth and authority expansion are highlighted."
            )

    return " ".join(lines)
