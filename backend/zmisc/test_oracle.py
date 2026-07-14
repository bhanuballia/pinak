import sys
import json
import logging
from pprint import pprint

# Add the project root to the python path
sys.path.append('d:/vedic-astrology-app')

from core.analysis.life_oracle import analyze_life_oracle

def main():
    try:
        # Generate some dummy report_data
        dob = "2000-01-01"
        tob = "12:00"
        lat = 28.6139
        lon = 77.2090
        
        # We need a basic chart structure to pass to analyze_life_oracle.
        # But wait, calculating the chart requires many modules. Let's just create a mock.
        report_data = {
            "chart": {
                "houses": {
                    "1": {"sign_index": 0, "planets": [{"name": "Sun"}]},
                    "2": {"sign_index": 1, "planets": []},
                    "4": {"sign_index": 3, "planets": [{"name": "Moon"}]},
                    "7": {"sign_index": 6, "planets": [{"name": "Venus"}]},
                    "9": {"sign_index": 8, "planets": [{"name": "Jupiter"}]},
                    "10": {"sign_index": 9, "planets": []},
                    "11": {"sign_index": 10, "planets": []}
                }
            },
            "planet_positions": {
                "Sun": {"sidereal": {"lon": 10}},
                "Moon": {"sidereal": {"lon": 100}},
                "Mars": {"sidereal": {"lon": 150}},
                "Mercury": {"sidereal": {"lon": 30}},
                "Jupiter": {"sidereal": {"lon": 200}},
                "Venus": {"sidereal": {"lon": 250}},
                "Saturn": {"sidereal": {"lon": 300}},
                "Rahu": {"sidereal": {"lon": 350}},
                "Ketu": {"sidereal": {"lon": 170}}
            },
            "strength": {
                "planets": {
                    "Sun": {"total": 100},
                    "Moon": {"total": 80},
                    "Mars": {"total": 60},
                    "Mercury": {"total": 70},
                    "Jupiter": {"total": 120},
                    "Venus": {"total": 90},
                    "Saturn": {"total": 50},
                    "Rahu": {"total": 40},
                    "Ketu": {"total": 40}
                }
            },
            "dasha": {
                "current": {
                    "mahadasha": {"planet": "Jupiter"},
                    "antardasha": {"planet": "Venus"}
                }
            }
        }
        
        # Test it
        res = analyze_life_oracle(report_data)
        print("SUCCESS! Output keys:", res.keys())
        print("Finance score:", res.get("finance", {}).get("score"))
        
    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
