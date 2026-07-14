import requests
try:
    res = requests.post("http://127.0.0.1:8000/api/dasha/rashi", json={"date": "2000-01-01", "time": "12:00:00", "tz_offset": 5.5})
    print("Status:", res.status_code)
    data = res.json()
    for k, v in data.items():
        print(k, ":", len(v) if isinstance(v, list) else v)
    if "kalachakraData" in data and len(data["kalachakraData"]) > 0:
        print("Sample:", data["kalachakraData"][0])
except Exception as e:
    print("Error:", e)
