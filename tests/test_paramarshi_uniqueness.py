
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from core.paramarshi.paramarshi_engine import ask_paramarshi

def test_paramarshi_uniqueness():
    report_data = {
        "brahma": {"profession_prediction": "Elite management role in 2026."},
        "dosha": {"kalsarp": {"present": True}},
        "strength": {"Sun": 1.5, "Moon": 1.2}
    }

    questions = [
        "What is the supreme summary of my life purpose?", # General
        "Tell me about my career destiny.", # Career
        "What are my karmic lessons?", # General fallback
        "Inform me about my job prospects." # Career
    ]

    answers = []
    for q in questions:
        res = ask_paramarshi(q, report_data)
        print(f"\nQ: {q}")
        print(f"A: {res['answer']}")
        answers.append(res['answer'])

    unique_answers = set(answers)
    print(f"\nTotal questions: {len(questions)}")
    print(f"Unique answers: {len(unique_answers)}")

if __name__ == "__main__":
    test_paramarshi_uniqueness()
