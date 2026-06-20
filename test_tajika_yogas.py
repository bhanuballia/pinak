import requests

payload = {
    "date": "2000-01-01",
    "time": "12:00:00",
    "lat": 28.6139,
    "lon": 77.2090,
    "tz_offset": 5.5,
    "start_age": 1
}

try:
    response = requests.post("http://localhost:8000/api/solar_return/tajika_yogas", json=payload)
    print(f"Status Code: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
