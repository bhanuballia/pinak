def build_life_context(history):

    context = {
        "career_focus": 0,
        "relationship_focus": 0,
        "finance_focus": 0,
    }

    for q in history:
        text = q.lower()

        if "career" in text or "job" in text:
            context["career_focus"] += 1

        if "love" in text or "marriage" in text:
            context["relationship_focus"] += 1

        if "money" in text or "finance" in text:
            context["finance_focus"] += 1

    return context
