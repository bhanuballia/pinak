# scratch/test_shadbala_api.py
import requests

def test_get_shadbala():
    url = "http://127.0.0.1:8000/api/shadbala"
    params = {
        "date": "1990-01-01",
        "time": "12:00:00",
        "tz_offset": 5.5,
        "lat": 28.6,
        "lon": 77.2
    }
    print(f"Testing GET request to {url} with params {params}...")
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("GET Response Keys:", list(data.keys()))
            if "planets" in data:
                print("GET Sun strength details:", data["planets"].get("Sun"))
            else:
                print("Response data structure mismatch:", data)
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

def test_post_shadbala():
    url = "http://127.0.0.1:8000/api/shadbala"
    payload = {
        "date": "1990-01-01",
        "time": "12:00:00",
        "tz_offset": 5.5,
        "lat": 28.6,
        "lon": 77.2
    }
    print(f"\nTesting POST request to {url} with payload {payload}...")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("POST Response Keys:", list(data.keys()))
            if "planets" in data:
                print("POST Sun strength details:", data["planets"].get("Sun"))
            else:
                print("Response data structure mismatch:", data)
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_get_shadbala()
    test_post_shadbala()
