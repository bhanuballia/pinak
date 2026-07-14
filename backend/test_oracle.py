def test(q_lower):
    if any(k in q_lower for k in ["job", "interview", "career", "profession", "work", "meeting", "promotion"]):
        return "Career"
    elif any(k in q_lower for k in ["love", "marriage", "relationship", "propose", "engagement"]):
        return "Relationship"
    elif any(k in q_lower for k in ["money", "invest", "business", "finance", "buy", "sell"]):
        return "Money"
    elif any(k in q_lower for k in ["travel", "journey", "trip", "flight", "relocate"]):
        return "Travel"
    elif any(k in q_lower for k in ["property", "house", "land", "real estate", "griha", "home"]):
        return "Property"
    elif any(k in q_lower for k in ["health", "surgery", "medical", "treatment", "healing", "therapy"]):
        return "Health"
    else:
        return "Neutral"

print("property ->", test("property"))
print("relationship ->", test("relationship"))
print("health ->", test("health"))
print("job ->", test("job"))
