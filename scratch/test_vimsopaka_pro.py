import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from reports.report_data import assemble_report_data
import json

# Mock data
name = "Test User"
date = "1990-01-01"
time = "12:00:00"
tz_offset = 5.5
lat = 28.6139
lon = 77.2090

try:
    data = assemble_report_data(
        name=name,
        date=date,
        time=time,
        tz_offset=tz_offset,
        lat=lat,
        lon=lon
    )

    print("Vimsopaka Assessment Keys:")
    if "vimsopaka_assessment" in data:
        print(data["vimsopaka_assessment"].keys())
        print("\nWealth/Career:")
        print(json.dumps(data["vimsopaka_assessment"]["wealth_career"], indent=2))
        print("\nSummary:")
        print(json.dumps(data["vimsopaka_assessment"]["summary"], indent=2))
    else:
        print("ERROR: vimsopaka_assessment NOT FOUND in data")

except Exception as e:
    import traceback
    traceback.print_exc()
