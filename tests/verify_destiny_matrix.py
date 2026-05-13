from core.destiny_matrix.destiny_engine import run_destiny_matrix

# Mock Data
report_data = {
    "chart": {},
    "dasha": {
        "list": [
            {"lord": "Jupiter", "start_date": "2024-01-01", "end_date": "2030-01-01"},
            {"lord": "Saturn", "start_date": "2030-01-01", "end_date": "2049-01-01"}
        ]
    },
    "dosha": {
        "sadesati": {"present": True}
    },
    "strength": {
        "Mars": 1.5
    },
    "timeline": [
        {"year": 2026, "risk_level": "low"},
        {"year": 2027, "risk_level": "high"},
        {"year": 2028, "risk_level": "low"}
    ],
    # Also verify backward compatibility if needed
    # "timeline": []
}

print("Running Destiny Matrix Verification...")

result = run_destiny_matrix(report_data, start=2025, end=2030)

print(f"Matrix Rows: {len(result['matrix'])}")
print(f"Peaks: {len(result['peaks'])}")

# Check 2026 (Jupiter -> Career Growth)
r2026 = next((x for x in result['matrix'] if x['year'] == 2026), None)
if r2026:
    print(f"2026 Events: {r2026['events']}")
    if "career_growth" in r2026['events']:
        print("PASS: Jupiter Career Growth detected.")
    else:
        print("FAIL: Event detection mismatch.")

# Check Risk (Sade Sati + High Risk Year)
r2027 = next((x for x in result['matrix'] if x['year'] == 2027), None)
if r2027:
    print(f"2027 Risk: {r2027['risk']}")
    if r2027['risk']['level'] == "high":
        print("PASS: High Risk detected.")
    else:
        print("FAIL: Risk detection mismatch.")

# Check Peaks
if len(result['peaks']) >= 2:
     print("PASS: Growth Peaks detected.")
else:
     print("FAIL: Peak detection mismatch.")
