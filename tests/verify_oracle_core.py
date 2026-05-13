from core.oracle.oracle_core import oracle_query

# Mock Data
report_data = {
    "timeline": [{"year": 2027, "risk_level": "medium"}],
    "dosha": {"manglik": {"present": False}},
    "strength": {"jupiter": 80},
    "chart": {},
    "karma_simulation": {},
    "probability_matrix": {2027: {"love": 75}}
}

# Test Cases
questions = [
    "Should I change career in 2027?",
    "Will I find love soon?",
    "How is my financial outlook?",
    "What is my life purpose?"
]

print("Running Oracle Intelligence Core Verification...")

for q in questions:
    print(f"\nQuestion: {q}")
    result = oracle_query(q, report_data)
    print(f"Intent: {result['intent']}")
    print(f"Answer: {result['answer']}")
    
    if result["intent"] != "general" or "life purpose" in q:
        print("PASS")
    else:
        print("FAIL (Intent detection issue?)")
