import requests
import json
import datetime

url = "http://localhost:8000/api/muhurt/search_advanced"

today = datetime.datetime.now().strftime("%Y-%m-%d")
end_date = (datetime.datetime.now() + datetime.timedelta(days=60)).strftime("%Y-%m-%d")

payload = {
    "start_date": "2024-01-01",
    "end_date": "2024-02-28",
    "ceremony": "Marriage",
    "user_profile": {
        "moon_lon": 45.0  # Taurus Moon
    }
}

try:
    print(f"Testing /search_advanced from {today} to {end_date}...")
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        print("Success! Results:")
        print(json.dumps(data, indent=2))
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"Connection error: {e}")
