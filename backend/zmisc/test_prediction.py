import requests
import json

payload = {
    "natal_moon_lon": 120.0 # Example Moon in Cancer
}

# Assume backend is running on 8000
try:
    response = requests.post("http://localhost:8000/api/horoscope/predict", json=payload)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", e)
