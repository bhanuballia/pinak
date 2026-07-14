import urllib.request
import json
url = "http://localhost:8000/api/prashna/ask"
data = json.dumps({"latitude": 28.6139, "longitude": 77.2090, "question": "Will I get married soon?", "category": "Marriage / Relationship"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    if hasattr(e, 'read'):
        print(e.read().decode())
    else:
        print(e)
