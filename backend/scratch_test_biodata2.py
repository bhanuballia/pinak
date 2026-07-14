from reports.report_data import assemble_report_data
import json

data = assemble_report_data(
    "User",
    "1990-10-10",
    "12:00",
    5.5,
    28.6139,
    77.2090
)

print(list(data.keys()))
if "chart" in data:
    print(list(data["chart"].keys()))
    # Let's check how planets are structured in chart
    if "houses" in data["chart"]:
        print("Planets inside houses?")
