# backend/scratch/test_vastu.py
import requests

url = "http://127.0.0.1:8000/api/vastu/analyze"
payload = {
    "date": "1995-05-15",
    "time": "14:30:00",
    "tz_offset": 5.5,
    "lat": 28.6139,
    "lon": 77.2090,
    "property_type": "commercial",
    "layout": {
        "Northeast": "Reception",
        "Southeast": "Cash Counter",
        "Southwest": "Owner's Cabin/Desk",
        "Northwest": "Store Room/Inventory",
        "North": "Main Entrance"
    }
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        data = response.json()
        print("Overall Score:", data.get("overall_score"))
        print("Astro-Vastu Score:", data.get("astro_vastu_score"))
        print("Layout Score:", data.get("layout_compatibility_score"))
        print("\nDirections:")
        for direction, details in data.get("directions", {}).items():
            print(f"- {direction}: Planet={details['planet']}, Strength={details['planet_strength']}, Assigned Room={details['room_assigned']}, Room Compatibility={details['is_room_compatible']}")
            print(f"  Remedies: {details['remedies'][:2]}")
    else:
        print("Error Response:", response.text)
except Exception as e:
    print("Request failed:", e)
