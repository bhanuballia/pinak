import requests
import json

data = {
    "question": "Is this a good time to travel?",
    "current_time": "10:00 AM",
    "choghadiya_data": {
        "day": [
            {"name": "Rog", "start": "06:00 AM", "end": "07:30 AM", "quality": "Bad"},
            {"name": "Udveg", "start": "07:30 AM", "end": "09:00 AM", "quality": "Bad"},
            {"name": "Chal", "start": "09:00 AM", "end": "10:30 AM", "quality": "Neutral"},
            {"name": "Labh", "start": "10:30 AM", "end": "12:00 PM", "quality": "Good"}
        ],
        "night": []
    }
}

res = requests.post("http://127.0.0.1:8000/api/panchang/choghadiya-oracle", json=data)
print(res.status_code)
print(res.text)
