def detect_intent(question):

    q = question.lower()

    if "career" in q or "job" in q or "business" in q:
        return "career"

    if "marriage" in q or "relationship" in q or "love" in q:
        return "relationship"

    if "money" in q or "finance" in q or "financial" in q:
        return "finance"

    if "health" in q:
        return "health"

    if "purpose" in q or "life path" in q:
        return "life_purpose"

    return "general"
