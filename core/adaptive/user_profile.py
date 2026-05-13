def build_user_profile(history, memory):

    profile = memory.get("profile", {
        "career_interest": 0,
        "relationship_interest": 0,
        "finance_interest": 0
    })

    for q in history:
        text = q.lower()

        if "career" in text or "job" in text or "business" in text or "work" in text or "promotion" in text:
            profile["career_interest"] += 1

        if "love" in text or "marriage" in text:
            profile["relationship_interest"] += 1

        if "money" in text or "finance" in text:
            profile["finance_interest"] += 1

    return profile
