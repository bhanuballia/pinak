
import sys
import os
import swisseph as swe
from datetime import datetime, timedelta

# Add the project root to sys.path
sys.path.append(r'd:\vedic-astrology-app')

from astronomy.julian import datetime_to_julian

# Test data for New Delhi, 1990-01-01 12:00 PM
dt = datetime(1990, 1, 1, 12, 0, 0)
tz_offset = 5.5
dt_utc = dt - timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)
lat = 28.6139
lon = 77.2090

# Set sidereal mode
swe.set_sid_mode(swe.SIDM_LAHIRI)

# Calculate Lagna (Ascendant)
# swe.houses returns (cusps, ascmc)
cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'P', swe.FLG_SIDEREAL)
lagna_deg = ascmc[0]
lagna_sign_idx = int(lagna_deg / 30)
lagna_sign_deg = lagna_deg % 30

signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

print(f"D1 Lagna: {lagna_deg:.4f} ({signs[lagna_sign_idx]} {lagna_sign_deg:.4f})")

# Calculate D9 Lagna
d9_lagna_deg = (lagna_deg * 9) % 360
d9_sign_idx = int(d9_lagna_deg / 30)
d9_sign_deg = d9_lagna_deg % 30

print(f"D9 Calculated Lagna: {d9_lagna_deg:.4f} ({signs[d9_sign_idx]} {d9_sign_deg:.4f})")

# Check planets
planets = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE
}

print("\nPlanets Sidereal:")
for name, id in planets.items():
    res, err = swe.calc_ut(jd_ut, id, swe.FLG_SIDEREAL)
    lon_sid = res[0]
    sign_idx = int(lon_sid / 30)
    sign_deg = lon_sid % 30
    
    # D9 Position
    d9_lon = (lon_sid * 9) % 360
    d9_s_idx = int(d9_lon / 30)
    
    print(f"{name:8}: {lon_sid:8.4f} ({signs[sign_idx]} {sign_deg:7.4f}) -> D9: {signs[d9_s_idx]}")
