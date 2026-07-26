import requests
import json

payload_astro = {
    "mode": "astrology",
    "partner_a": {
        "name": "Amit",
        "date": "1995-05-15",
        "time": "08:30",
        "lat": 28.6139,
        "lon": 77.2090,
        "tz_offset": 5.5
    },
    "partner_b": {
        "name": "Priya",
        "date": "1997-08-20",
        "time": "14:45",
        "lat": 19.0760,
        "lon": 72.8777,
        "tz_offset": 5.5
    },
    "start_date": "2026-07-25"
}

payload_num = {
    "mode": "numerology",
    "partner_a": {
        "name": "Amit",
        "date": "1995-05-15"
    },
    "partner_b": {
        "name": "Priya",
        "date": "1997-08-20"
    },
    "start_date": "2026-07-25"
}

url = "http://localhost:8000/api/astrology/compatibility/weekly-horoscope"

try:
    print("--- TESTING ASTROLOGY MODE ---")
    res_astro = requests.post(url, json=payload_astro)
    print("Astro Status:", res_astro.status_code)
    if res_astro.status_code == 200:
        print("Success! A sample day:")
        print(json.dumps(res_astro.json()["weekly_data"][0], indent=2))
        
    print("\n--- TESTING NUMEROLOGY MODE ---")
    res_num = requests.post(url, json=payload_num)
    print("Numerology Status:", res_num.status_code)
    if res_num.status_code == 200:
        print("Success! Response overview:")
        print("Partner A:", res_num.json()["partner_a_name"], "Sign:", res_num.json()["partner_a_sign"])
        print("Partner B:", res_num.json()["partner_b_name"], "Sign:", res_num.json()["partner_b_sign"])
        print("Baseline compatibility:", res_num.json()["baseline_compatibility_score"], "%")
        print("A sample day:")
        print(json.dumps(res_num.json()["weekly_data"][0], indent=2))
        
except Exception as e:
    print("Error connecting to server:", e)
