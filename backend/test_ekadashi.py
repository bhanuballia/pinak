import requests
res = requests.get('http://127.0.0.1:8000/api/panchang/monthly?lat=19.076&lon=72.8777&tz=5.5&year=2026&month=7').json()
for d in res['data']:
    if d.get('ekadashi_vrat_type') or d.get('smarta_ekadashi_vrat_type'):
        print(f"Date: {d['date']}, Vaishnava: {d.get('ekadashi_vrat_type')}, Smarta: {d.get('smarta_ekadashi_vrat_type')}")
