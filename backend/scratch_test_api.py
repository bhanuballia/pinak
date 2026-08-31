import requests
import json

url = "http://127.0.0.1:8000/api/report/data"
payload = {
    "name": "Test",
    "date": "1990-01-01",
    "time": "12:00",
    "lat": 28.6139,
    "lon": 77.2090,
    "tz_offset": 5.5,
    "gender": "male"
}
response = requests.post(url, json=payload)
data = response.json()
print("Status:", response.status_code)
print("Keys in data:", data.keys())
print("Is 'yogini' in data?", 'yogini' in data)
if 'yogini' in data:
    print("Length of yogini array:", len(data['yogini']))
    if len(data['yogini']) > 0:
        print("First yogini:", list(data['yogini'][0].keys()))
