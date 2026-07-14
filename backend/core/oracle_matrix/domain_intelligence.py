def analyse_domains(question, report_data):

    q = question.lower()

    domain = "general"

    if "career" in q:
        domain = "career"

    elif "love" in q or "marriage" in q:
        domain = "relationship"

    elif "money" in q:
        domain = "finance"

    return {
        "domain": domain,
        "strength": report_data.get("strength", {}),
        "dosha": report_data.get("dosha", {}),
    }
