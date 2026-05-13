from core.omniscient_timeline.omniscient_engine import run_omniscient_timeline

# Mock Data
report_data = {
    "chart": {},
    "dasha": {
        "current": {"lord": "Jupiter"},
        "list": [
            {"lord": "Jupiter", "start_date": "2024-01-01", "end_date": "2030-01-01"},
            {"lord": "Saturn", "start_date": "2030-01-01", "end_date": "2049-01-01"}
        ]
    },
    "dosha": {
        "sadesati": {"present": True}
    },
    "strength": {
        "Venus": 1.5,
        "Jupiter": 1.2
    },
    "timeline": [],
    "adaptive_intelligence": {}
}

print("Running Omniscient Timeline Verification...")

result = run_omniscient_timeline(report_data, start=2025, end=2030)
timeline = result.get("omniscient_timeline", [])

print(f"Timeline Years: {len(timeline)}")

# Check 2025 (Jupiter Lord -> Finance Window?)
# finance_window(lord, strength) -> Jupiter = Wealth Cycle
r2025 = next((x for x in timeline if x['year'] == 2025), None)
if r2025:
    print(f"2025 Lord: {r2025['lord']}")
    events = [e['type'] for e in r2025['events']]
    print(f"2025 Events: {events}")
    
    if "wealth_cycle" in events:
         print("PASS: Jupiter Wealth Cycle detected.")
    else:
         print("FAIL: Wealth Cycle missing.")

# Check Marriage Window (Venus Strength > 1.1)
# marriage_window(year, lord, strength) -> Venus Strength 1.5 -> score += 1, need +2. 
# wait, code says:
# if lord in ["Venus", "Moon"]: score += 2
# if strength > 1.1: score += 1
# if score >= 2: return relationship_peak
# My mock has Lord=Jupiter. So score=0. +1 for strength. Total 1. No event.
# Let's change 2030 Lord to Venus to test.
# Wait, dasha list says Saturn starts 2030.
# Let's mock Lord="Venus" in dasha list for 2028.

report_data["dasha"]["list"].append(
     {"lord": "Venus", "start_date": "2028-01-01", "end_date": "2029-01-01"}
)

# Run again focusing on 2028
result_v = run_omniscient_timeline(report_data, start=2028, end=2028)
t2028 = result_v["omniscient_timeline"][0]
print(f"2028 Lord: {t2028['lord']}")
events_2028 = [e['type'] for e in t2028['events']]
print(f"2028 Events: {events_2028}")

if "relationship_peak" in events_2028:
    print("PASS: Venus Relationship Peak detected.")
else:
    print("FAIL: Relationship Peak missing.")
