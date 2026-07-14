import requests

res = requests.get('http://127.0.0.1:8000/api/panchang/daily?lat=19.076&lon=72.8777&tz=5.5&date=2026-01-14').json()
print("Sankranti data for Jan 14 2026:", res.get("sankranti"))

res2 = requests.get('http://127.0.0.1:8000/api/panchang/daily?lat=19.076&lon=72.8777&tz=5.5&date=2026-01-15').json()
print("Sankranti data for Jan 15 2026:", res2.get("sankranti"))
