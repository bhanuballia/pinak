
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from core.oracle.oracle_engine import oracle_answer

def test_oracle_uniqueness():
    chart = {"houses": {10: {"sign_name": "Taurus", "planets": ["Sun"]}, 7: {"sign_name": "Scorpio", "planets": ["Mars"]}}}
    strength = {"Sun": 1.5, "Saturn": 1.3, "Jupiter": 1.2, "Venus": 1.4, "Moon": 1.2, "Ketu": 1.3}
    dosha = {}
    dasha = {"current": {"lord": "Jupiter"}}
    cosmic = {"weighted_scores": {"cosmic_score": 1.5}}

    questions = [
        "What is my primary life purpose according to these planets?",
        "When will I see significant career growth?",
        "How can I improve my financial stability in the next 5 years?",
        "What are the karmic lessons I need to learn in this lifetime?",
        "How will my relationships evolve in the coming decade?"
    ]

    answers = []
    for q in questions:
        res = oracle_answer(q, chart, strength, dosha, dasha, cosmic)
        print(f"\nQ: {q}")
        print(f"Type: {res['type']}")
        print(f"A: {res['answer'][:100]}...")
        answers.append(res['answer'])

    # Check for exact matches (ignoring shuffle and guidance which are deterministic per question)
    # But if reasoning is identical, the bullets will be identical.
    
    unique_answers = set(answers)
    print(f"\nTotal questions: {len(questions)}")
    print(f"Unique answers: {len(unique_answers)}")

if __name__ == "__main__":
    test_oracle_uniqueness()
