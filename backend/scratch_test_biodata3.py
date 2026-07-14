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

# See how planet_positions look
print("Top-level planet_positions type:", type(data.get("planet_positions")))
if data.get("planet_positions"):
    print("Top-level sample:", data["planet_positions"][0] if isinstance(data["planet_positions"], list) else data["planet_positions"])
    
if "chart" in data:
    print("Chart planet_positions type:", type(data["chart"].get("planet_positions")))
    if data["chart"].get("planet_positions"):
        print("Chart sample:", data["chart"]["planet_positions"][0] if isinstance(data["chart"]["planet_positions"], list) else data["chart"]["planet_positions"])

print("Ascendant info in chart:", data.get("chart", {}).get("ascendant_sign_index"))
