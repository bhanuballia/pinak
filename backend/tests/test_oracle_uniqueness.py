
from core.oracle.oracle_engine import oracle_answer

# Mock data
chart = {
    "houses": {
        1: {"sign_name": "Aries", "planets": ["Mars"]},
        2: {"sign_name": "Taurus", "planets": []},
        7: {"sign_name": "Libra", "planets": ["Jupiter"]},
        10: {"sign_name": "Capricorn", "planets": ["Sun", "Saturn"]}
    }
}
strength = {"Sun": 1.5, "Saturn": 1.4, "Jupiter": 1.6, "Venus": 0.8, "Moon": 1.1, "Mercury": 1.2, "Ketu": 1.3}
dosha = {"manglik": {"present": False}}
dasha = {"current": {"planet": "Sun"}}
cosmic = {"weighted_scores": {"cosmic_score": 1.4}}

questions = [
    "What is my primary life purpose?",
    "When will I see significant career growth?",
    "What are the major obstacles in my career?",
    "How will my relationships evolve?",
    "What health precautions should I take?"
]

print("--- Oracle Test Results ---")
answers = []
for q in questions:
    res = oracle_answer(q, chart, strength, dosha, dasha, cosmic)
    print(f"Q: {q}")
    print(f"Type: {res['type']}")
    print(f"A: {res['answer']}")
    print("-" * 20)
    answers.append(res['answer'])

# Check for identical answers
if len(set(answers)) == len(answers):
    print("SUCCESS: All answers are unique!")
else:
    print("WARNING: Some answers are identical.")
