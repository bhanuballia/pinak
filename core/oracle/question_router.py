def detect_question_type(question: str):
    q = question.lower()
    
    # Career sub-types
    if "career" in q or "job" in q:
        if "growth" in q or "elevation" in q: return "career_growth"
        if "obstacle" in q or "challenge" in q: return "career_obstacle"
        if "timing" in q or "when" in q: return "career_timing"
        return "career"

    # Finance sub-types
    if "money" in q or "finance" in q or "wealth" in q:
        if "stability" in q: return "finance_stability"
        if "opportunity" in q: return "finance_opportunity"
        return "finance"

    # Relationship sub-types
    if "marriage" in q or "love" in q or "relationship" in q:
        if "evolution" in q or "decades" in q: return "relationship_evolution"
        return "relationship"

    # Health & Vitality
    if "health" in q or "vitality" in q:
        return "health"

    # Destiny & Purpose
    if "purpose" in q or "life" in q or "lessons" in q or "legacy" in q:
        if "purpose" in q: return "destiny_purpose"
        if "lessons" in q: return "destiny_lessons"
        return "destiny"
        
    # Spiritual
    if "spiritual" in q or "soul" in q or "devotion" in q:
        return "spiritual"

    return "general"
