def astral_narrative(marriage, career, karma, dimensional):

    text = ""

    if marriage["score"] > 0.65:
        text += "Marriage karma is strongly activated during favourable Venus cycles. "

    if career["career_index"] > 0.7:
        text += "Your destiny indicates leadership and authority roles. "

    if karma:
        text += "Certain karmic lessons repeat across Saturn/Rahu phases, guiding spiritual evolution. "

    if dimensional.get("marriage",{}).get("probability",0) > 0.6:
        text += "Dimensional analysis confirms emotional partnership growth."

    return text
