import requests

def test_triple_fallback():
    url = "http://127.0.0.1:8000/api/conjunction/triple/detail/Sun/Mercury/Ketu"
    print(f"Testing URL: {url}")
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Response Data:")
            print(f"  Description: {data.get('description')}")
            print(f"  Fallback: {data.get('_fallback')}")
            print("  Effects:")
            for key, val in data.get('effects', {}).items():
                print(f"    - {key}: {val[:100]}...")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_triple_fallback()
