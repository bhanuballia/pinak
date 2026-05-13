def generate_cosmic_narrative(soul, karma, life_path):

    text = ""

    text += f"Your soul theme reflects {soul['soul_theme']}. "

    if "Ancestral karma influence" in karma:
        text += "The chart indicates strong ancestral karmic patterns requiring spiritual balance. "

    if life_path["direction"] == "Guiding Others":
        text += "Your destiny aligns with teaching, advising, or guiding people."

    elif life_path["direction"] == "Material Achievement":
        text += "Career growth and leadership roles dominate your karmic journey."

    else:
        text += "Life path encourages inner exploration and personal evolution."

    return text
