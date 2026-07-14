from core.oracle_matrix.matrix_core import omniscient_oracle

# Mock Data
report_data = {
    "timeline": [{"year": 2027, "risk_level": "medium"}],
    "dosha": {"kalsarp": {"present": False}},
    "strength": {"jupiter": 80},
    "chart": {},
    "karma_simulation": {"karma_score": 50},
    "probability_matrix": {2027: {"love": 75}}
}

# Test Cases
tests = [
    {
        "question": "Should I change career in 2027?",
        "history": ["job stress", "money worries"]
    },
    {
        "question": "Will my relationship improve?",
        "history": ["marriage timing", "love life"]
    },
    {
        "question": "Investing in real estate?",
        "history": []
    }
]

print("Running Omniscient Oracle Matrix Verification...")

for t in tests:
    q = t["question"]
    h = t["history"]
    print(f"\nQuestion: {q}")
    print(f"History: {h}")
    
    response = omniscient_oracle(q, report_data, history=h)
    print(f"Response: {response}")
    
    if "Oracle Insight" in response:
        print("PASS")
    else:
        print("FAIL (Formatting issue?)")
