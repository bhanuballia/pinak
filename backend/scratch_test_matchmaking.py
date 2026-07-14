import requests
import json

payload = {
    "bride": {
        "title": "Kumari",
        "name": "Anjali",
        "birth_date": "1992-06-15",
        "birth_time": "14:30",
        "tz_offset": 5.5,
        "lat": 28.6139,
        "lon": 77.2090,
        "location_name": "Delhi, India"
    },
    "groom": {
        "title": "Shri",
        "name": "Rahul",
        "birth_date": "1988-02-07",
        "birth_time": "14:06",
        "tz_offset": 5.5,
        "lat": 25.7592,
        "lon": 84.1504,
        "location_name": "Ballia, Uttar Pradesh"
    }
}

try:
    res = requests.post("http://localhost:8000/api/matchmaking", json=payload)
    data = res.json()
    print("BRIDE D9 CHART HOUSES:")
    for key, val in data.get("bride_d9_chart", {}).get("houses", {}).items():
        print(f"House {key}: sign_index={val.get('sign_index')}")
except Exception as e:
    print("Error:", e)
