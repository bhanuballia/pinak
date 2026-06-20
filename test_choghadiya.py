import requests
try:
    res = requests.get('http://127.0.0.1:8000/api/panchang/daily?lat=19.076&lon=72.8777&tz=5.5').json()
    choghadiya = res.get('choghadiya', {})
    print("Choghadiya keys:", list(choghadiya.keys()))
    print("Day slots:", len(choghadiya.get('day', [])))
    print("Night slots:", len(choghadiya.get('night', [])))
    if choghadiya.get('day'):
        print("First Day Slot:", choghadiya['day'][0])
except Exception as e:
    print("Error:", e)
