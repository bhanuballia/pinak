import time
from reports.report_data import assemble_report_data

def test_run():
    print("Testing assemble_report_data...", flush=True)
    assemble_report_data(
        name="Test", 
        date="1990-01-01", 
        time="12:00:00", 
        tz_offset=5.5, 
        lat=28.61, 
        lon=77.21
    )
    print("Done!", flush=True)

if __name__ == "__main__":
    test_run()
