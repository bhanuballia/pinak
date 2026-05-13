def build_life_narrative(theme, karma, peaks):

    text = f"Your life follows a {theme}. "

    if karma:
        text += "Key karmic lessons include: " + ", ".join(karma) + ". "

    if peaks:
        text += f"Major growth periods appear around {peaks[:5]}."

    return text
