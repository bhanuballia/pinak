
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from core.karma.simulator import run_karma_simulation

def test_karma_variance():
    report_data = {
        "chart": {
            "planets": {
                "Saturn": {"house": 10},
                "Jupiter": {"house": 2},
                "Sun": {"house": 1}
            }
        },
        "dosha": {"kalsarp": {"present": False}},
        "strength": {"Jupiter": 0.8, "Saturn": 0.6, "Sun": 0.7},
        "dasha": {
            "current": {"lord": "Jupiter"}
        }
    }

    # Simulate 2025 to 2030
    res = run_karma_simulation(report_data, 2025, 2030)
    timeline = res.get("karma_timeline", [])
    
    print(f"{'Year':<6} | {'Lord':<10} | {'Score':<10}")
    print("-" * 30)
    
    scores = []
    for item in timeline:
        print(f"{item['year']:<6} | {item['lord']:<10} | {item['score']:<10.4f}")
        scores.append(item['score'])
    
    unique_scores = set(scores)
    print(f"\nUnique scores: {len(unique_scores)}")
    
    if len(unique_scores) == 1:
        print("\n[REPRODUCED] Karma scores are identical for all years.")
    else:
        print("\n[OK] Karma scores vary.")

if __name__ == "__main__":
    test_karma_variance()
