import requests
import json

data = {
    "fcm_token": "test_token_123",
    "name": "Test",
    "date": "1990-01-01",
    "time": "12:00"
}

print("Testing /api/profiles/subscribe...")
response = requests.post("http://localhost:8000/api/profiles/subscribe", json=data)
print(f"Status: {response.status_code}")
print(f"Body: {response.text}")

print("Testing /api/profiles/...")
response2 = requests.get("http://localhost:8000/api/profiles/")
print(f"Status: {response2.status_code}")
print(f"Body: {response2.text[:100]}")
