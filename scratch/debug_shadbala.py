# scratch/debug_shadbala.py
"""Debug script to inspect the chart data flowing into Shadbala calculations."""
import sys, os, datetime, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart

# Same params as the test API call
dt_local = datetime.datetime(1990, 1, 1, 12, 0, 0)
dt_utc = dt_local - datetime.timedelta(hours=5.5)
jd_ut = datetime_to_julian(dt_utc)

chart = build_rashi_chart(jd_ut, 28.6, 77.2, house_system="W", style="north")
chart["jd_ut"] = jd_ut

# Check what keys the chart has
print("=== CHART TOP-LEVEL KEYS ===")
for k in sorted(chart.keys()):
    val = chart[k]
    if isinstance(val, dict) and len(str(val)) > 200:
        print(f"  {k}: dict with {len(val)} keys: {list(val.keys())[:10]}")
    else:
        print(f"  {k}: {type(val).__name__} = {str(val)[:150]}")

print("\n=== PLANET POSITIONS (detail) ===")
pp = chart.get("planet_positions", {})
for planet in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
    pd = pp.get(planet, {})
    print(f"\n  {planet}:")
    for k, v in pd.items():
        print(f"    {k}: {v}")

print("\n=== BIRTH_INFO ===")
bi = chart.get("birth_info", {})
if bi:
    for k, v in bi.items():
        print(f"  {k}: {v}")
else:
    print("  NOT PRESENT IN CHART")

print("\n=== HOUSES ===")
houses = chart.get("houses", {})
if houses:
    for h, data in list(houses.items())[:3]:
        print(f"  House {h}: {str(data)[:120]}")
else:
    print("  NOT PRESENT IN CHART")
