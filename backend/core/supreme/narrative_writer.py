def build_supreme_narrative(profession, marriage, destiny, karma):

    parts = []

    parts.append(
        f"You are naturally inclined toward {profession}."
    )

    parts.append(
        f"Marriage pattern indicates {marriage['marriage_risk']}."
    )

    parts.append(
        f"Your destiny cycle shows {destiny['fortune_level']}."
    )

    parts.append(
        f"Karmic direction suggests {karma}."
    )

    return " ".join(parts)
