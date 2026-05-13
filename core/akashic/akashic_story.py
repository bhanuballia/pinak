def generate_akashic_story(soul, cycles, phases, sentient):

    text = ""

    text += f"Soul Evolution Stage: {soul['stage']}\n\n"

    text += "Karmic Patterns:\n"
    for c in cycles:
        text += f"• {c}\n"

    text += "\nLife Destiny Phases:\n"
    for p in phases:
        text += f"• {p}\n"

    text += "\nInner Archetype Insight:\n"
    text += sentient.get("sentient_story","")

    return text

