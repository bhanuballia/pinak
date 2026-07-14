def build_sentient_story(archetype, karma, destiny, psyche):

    text = ""

    text += f"Your soul archetype is {archetype['archetype']}.\n\n"

    text += "Psychological Nature:\n"
    for p in psyche:
        text += f"• {p}\n"

    text += "\nKarmic Lessons:\n"
    for k in karma["karmic_themes"]:
        text += f"• {k}\n"

    text += f"\nLife Purpose Direction:\n{destiny['life_purpose']}."

    return text
