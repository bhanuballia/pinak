import requests

url = "http://localhost:8000/api/biodata/astro-details"
payload = {
    "birth_date": "1990-10-10",
    "birth_time": "12:00",
    "latitude": 28.6139,
    "longitude": 77.2090
}
res = requests.post(url, json=payload)
print(res.status_code)
print(res.text)
