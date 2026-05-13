from core.decision.cosmic_decision_engine import evaluate_decision

# Mock Data
year = 2027
chart = {}
timeline = [
    {"year": 2027, "risk_level": "medium", "focus": "career"},
]
probability_matrix = {2027: {"love": 70}}
karma_sim = {
    "high_effort_path": [{"year": 2027, "score": 75}]
}
dosha = {"manglik": {"present": False}}
strength = {"average": 65, "jupiter": 75}

# Test Cases
questions = [
    ("Should I change job in 2027?", "career"),
    ("Will I get married in 2027?", "marriage"),
    ("Is 2027 good for investment?", "finance"),
    ("General outlook for 2027?", "general") # Should return neutral
]

print("Running Cosmic Decision Engine Verification...")

for q, type_label in questions:
    print(f"\nQuestion: {q}")
    decision = evaluate_decision(
        question=q,
        year=year,
        chart=chart,
        timeline=timeline,
        probability_matrix=probability_matrix,
        karma_simulation=karma_sim,
        dosha=dosha,
        strength=strength
    )
    print(f"Decision: {decision}")
    
    if decision["confidence"] > 0:
        print("PASS")
    else:
        print("FAIL (Zero confidence)")
