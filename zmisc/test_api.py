import urllib.request
import json

payload = {
    "name": "John",
    "date": "1990-01-01",
    "time": "12:00",
    "tz_offset": 5.5,
    "lat": 28.61,
    "lon": 77.2,
    "gender": "male",
    "location_name": "New Delhi"
}

req = urllib.request.Request(
    'http://localhost:8000/api/report/data', 
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    print("VIMSOPAKA_BALA:", data.get('vimsopaka_bala'))
except Exception as e:
    print(e)
