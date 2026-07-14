import traceback
from reports.report_data import assemble_report_data

try:
    data = assemble_report_data(
        name="Test",
        date="1990-01-01",
        time="12:00",
        tz_offset=5.5,
        lat=28.6,
        lon=77.2,
        gender="male",
        location_name="Delhi"
    )
    print("Success! No crash.")
except Exception as e:
    traceback.print_exc()
