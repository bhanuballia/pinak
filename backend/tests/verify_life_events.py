from core.analysis.life_event_detector import detect_life_events
import datetime

# Mock Data
chart = {}
dasha = {
    "list": [
        {"lord": "Jupiter", "start_date": "15/05/2020", "end_date": "15/05/2036"},
        {"lord": "Saturn", "start_date": "15/05/2036", "end_date": "15/05/2055"}
    ],
    "current": {"lord": "Jupiter"}
}
dosha = {
    "manglik": {"present": False},
    "sadesati": {"present": True}
}
strength = {"average": 70}

print("Running detect_life_events...")
try:
    events = detect_life_events(chart, dasha, dosha, strength)
    print("Events detected:", len(events))
    for e in events:
        print(e)
except Exception as e:
    print("Error:", e)
