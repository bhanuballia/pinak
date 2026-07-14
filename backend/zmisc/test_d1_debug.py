
import sys
import os

# Add the project root to sys.path
sys.path.append(r'd:\vedic-astrology-app')

from charts.rashi_chart import build_rashi_chart
from astronomy.julian import datetime_to_julian
import datetime
from astronomy.sidereal import get_ayanamsa

# Test data for New Delhi, 1990-01-01 12:00 PM
dt = datetime.datetime(1990, 1, 1, 12, 0, 0)
tz_offset = 5.5
dt_utc = dt - datetime.timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)
lat = 28.6139
lon = 77.2090

# Check Ayanamsa
ayana = get_ayanamsa(jd_ut)
print(f"Ayanamsa: {ayana:.4f}")

# Build D1 chart
d1 = build_rashi_chart(jd_ut, lat, lon)

print(f"D1 Ascendant Deg: {d1['ascendant_deg']:.4f}")
print(f"D1 Ascendant Sign: {d1['ascendant_sign']}")

print("D1 Houses Cusps:")
for h, info in d1['houses'].items():
    print(f"  House {h}: cusp={info['cusp_deg']:.4f}, sign={info['sign_name']}")
