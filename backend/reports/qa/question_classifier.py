def classify_question(question: str) -> str:
    q = question.lower()

    if any(w in q for w in ["job", "career", "promotion", "work"]):
        return "career"

    if any(w in q for w in ["marriage", "wife", "husband", "love"]):
        return "marriage"

    if any(w in q for w in ["money", "finance", "wealth", "income"]):
        return "finance"

    if any(w in q for w in ["health", "disease", "illness"]):
        return "health"

    if any(w in q for w in ["study", "education", "exam"]):
        return "education"

    return "general"
