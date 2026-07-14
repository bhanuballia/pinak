
import sys
import os

# Add the project root to sys.path
sys.path.append(r'd:\vedic-astrology-app')

from charts.divisional.builder import build_varga_chart
from astronomy.julian import datetime_to_julian
import datetime

# Test data for New Delhi, 1990-01-01 12:00 PM
dt = datetime.datetime(1990, 1, 1, 12, 0, 0)
tz_offset = 5.5
dt_utc = dt - datetime.timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)
lat = 28.6139
lon = 77.2090

# Build D9 chart
d9 = build_varga_chart(9, jd_ut, lat, lon)

print(f"D9 Ascendant Sign: {d9['ascendant_sign']}")
print("D9 Houses:")
for h, info in d9['houses'].items():
    print(f"  House {h}: sign={info['sign_name']} (idx={info['sign_index']}), planets={info['planets']}")
