import requests
import json

data = {
    "name": "Test",
    "date": "1990-01-01",
    "time": "12:00:00",
    "lat": 28.6139,
    "lon": 77.2090,
    "tz_offset": -5.5
}

r = requests.post("http://localhost:8000/api/report/data", json=data)
if r.status_code == 200:
    res = r.json()
    print("Keys in response:", res.keys())
    if "ashtakavarga" in res:
        print("ashtakavarga keys:", res["ashtakavarga"].keys())
        if "bhinna_breakdown" in res["ashtakavarga"]:
            print("bhinna_breakdown keys:", res["ashtakavarga"]["bhinna_breakdown"].keys())
        else:
            print("NO bhinna_breakdown found inside ashtakavarga!")
    else:
        print("NO ashtakavarga found in response!")
else:
    print("Error:", r.status_code, r.text)
