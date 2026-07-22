# backend/scratch/test_custom_topics.py
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from matchmaking.family.custom_topics import CustomTopicsEngine

def test_engine():
    engine = CustomTopicsEngine()
    
    # Mock data
    bride_data = {
        "planet_positions": [
            {"planet": "Moon", "sign": "Taurus", "house": 1},
            {"planet": "Jupiter", "sign": "Cancer", "house": 8}
        ],
        "chart": {
            "houses": {
                "2": {"planets": ["Venus"]},
                "4": {"planets": ["Jupiter"]},
                "8": {"planets": ["Jupiter"]},
                "10": {"planets": ["Sun"]},
                "6": {"planets": ["Jupiter"]}
            }
        }
    }
    
    groom_data = {
        "planet_positions": [
            {"planet": "Moon", "sign": "Taurus", "house": 1},
            {"planet": "Saturn", "sign": "Scorpio", "house": 3}
        ],
        "chart": {
            "houses": {
                "3": {"planets": ["Saturn"]},
                "8": {"planets": ["Jupiter"]}
            }
        }
    }
    
    precomputed = {
        "guna_milan": {
            "scores": {
                "Bhakoot": 7,
                "Graha Maitri": 5,
                "Vashya": 2,
                "Nadi": 8
            }
        },
        "manglik": {
            "bride": {"is_manglik": False},
            "groom": {"is_manglik": False}
        }
    }
    
    results = engine.analyze(bride_data, groom_data, precomputed)
    print("SUCCESS: Computed custom topics:")
    for r in results:
        print(f"- {r['topic']} ({r['category']}): {r['verdict']}")
        print(f"  Explanation: {r['explanation']}\n")

if __name__ == "__main__":
    test_engine()
