import datetime
from api.routes.solar_return import api_solar_return_strengths
import json

payload = {
    "date": "2000-01-01",
    "time": "12:00:00",
    "lat": 28.6139,
    "lon": 77.2090,
    "tz_offset": 5.5,
    "start_age": 1
}

try:
    res = api_solar_return_strengths(payload)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
    import pprint; pprint.pprint(res)
