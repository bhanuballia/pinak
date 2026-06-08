import asyncio, sys, json
import urllib.request, urllib.error
sys.path.insert(0, '.')
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def test():
    payload = json.dumps({
        "name": "Test User",
        "date": "1995-05-10",
        "time": "10:30:00",
        "lat": 19.076,
        "lon": 72.877,
        "tz": 5.5
    }).encode('utf-8')

    req = urllib.request.Request(
        "http://localhost:8000/api/dasha-report",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            print(f"Status: {resp.status}")
            print("SUCCESS - Keys:", list(data.keys()))
            print("Summary:", str(data.get("summary", ""))[:300])
            print("Nakshatra:", data.get("nakshatra"))
            print("Marriage AI:", data.get("marriage_ai"))
            print("Wealth AI:", data.get("wealth_ai"))
            print("Health AI:", data.get("health_ai"))
    except urllib.error.HTTPError as e:
        print(f"HTTP ERROR {e.code}: {e.read().decode()[:500]}")
    except Exception as e:
        print(f"ERROR: {e}")

test()

