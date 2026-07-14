def personality_prediction(ctx):

    archetype = ctx.get("neural", {}).get("archetype")
    destiny_type = ctx.get("destiny", {}).get("type")

    if archetype == "Leader":
        return "You naturally project authority and confidence. Others may rely on your guidance."

    if destiny_type == "Karmic Builder":
        return "Your personality grows through responsibility and perseverance."

    return "You possess a balanced personality shaped by emotional intelligence and logic."


def career_finance_prediction(ctx):

    dasha_lord = ctx.get("dasha", {}).get("current", {}).get("lord")

    if dasha_lord == "Saturn":
        return "Career growth will be slow but stable. Long-term planning is favoured."

    if dasha_lord == "Jupiter":
        return "Expansion, promotions, and learning opportunities increase."

    return "Professional life evolves steadily with adaptive changes."


def purpose_prediction(ctx):

    dom = ctx.get("destiny", {}).get("type")

    if dom == "Royal Destiny":
        return "Your life purpose revolves around leadership and influence."

    return "Your purpose involves personal evolution and contribution to society."


def happiness_prediction(ctx):
    if ctx.get("dosha", {}).get("sadesati", {}).get("present"):
        return "Emotional maturity becomes key to long-term happiness."
    return "Inner fulfillment increases through meaningful relationships."


def lifestyle_prediction(ctx):
    return "Consistency in daily habits enhances productivity and emotional balance."


def occupation_prediction(ctx):
    return "You may succeed in fields requiring analysis, strategy, or leadership."


def health_prediction(ctx):
    return "Maintaining routine and mental calm supports long-term wellness."


def hobbies_prediction(ctx):
    return "Creative or spiritual activities may provide emotional satisfaction."


def relationship_prediction(ctx):
    if ctx.get("dosha", {}).get("mangalik", {}).get("present"):
        return "Relationships may require patience and emotional understanding."
    return "Partnership energy remains supportive and growth-oriented."


def education_prediction(ctx):
    return "Continuous learning enhances your life path."


def wealth_prediction(ctx):
    return "Financial stability improves through disciplined planning."
