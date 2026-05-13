import requests

def test_study_endpoint():
    try:
        url = "http://localhost:8000/api/study"
        print(f"Testing {url}...")
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response JSON:", response.json())
        else:
            print("Error Detail:", response.text)
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_study_endpoint()
