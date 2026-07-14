import json
import sys
import os

# Add the root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from astronomy.ephemeris import initialize_ephemeris
from reports.report_data import assemble_report_data

def test_assembly():
    print("Testing report data assembly with new engines...")
    initialize_ephemeris()

    
    # Sample birth details
    data = assemble_report_data(
        name="Test User",
        date="1990-01-01",
        time="10:00:00",
        tz_offset=5.5,
        lat=28.61,
        lon=77.23,
        gender="male",
        location_name="Delhi, India"
    )
    
    print(f"Data assembly successful. Keys found: {list(data.keys())}")
    
    # Verify new keys
    new_keys = [
        "oracle_insights", "karma_timeline", "destiny_graphs", 
        "life_events", "transit_events", "destiny_timeline",
        "rishi_strength", "paramarshi", "ai_life_analysis"
    ]
    
    print("\nVerifying integration:")
    for key in new_keys:
        status = "PRESENT" if key in data else "MISSING"
        print(f" - {key}: {status}")
        if status == "PRESENT" and key == "oracle_insights":
            print(f"   (Count: {len(data[key])})")
            print("   (Samples: )")
            for i in range(min(5, len(data[key]))):
                q = data[key][i]["question"]
                a = data[key][i]["answer"].replace("\n", " ")
                print(f"     Q: {q}")
                print(f"     A: {a[:100]}...")


if __name__ == "__main__":
    try:
        test_assembly()
    except Exception as e:
        print(f"Error during assembly: {e}")
        import traceback
        traceback.print_exc()
