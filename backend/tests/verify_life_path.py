from core.life_path.life_path_engine import run_life_path_engine

# Mock Data
report_data = {
    "chart": {"ascendant": "Leo"},
    "dosha": {
        "kalsarp": {"present": True},
        "pitra": {"present": False}
    },
    "strength": {
        "Jupiter": 1.5, # Strongest
        "Saturn": 1.0,
        "Venus": 0.8
    },
    "omniscient_timeline": {
        "omniscient_timeline": [
            {
                "year": 2025,
                "events": [{"type": "career_growth"}] # Score +3
            },
            {
                "year": 2026,
                "events": [{"type": "relationship_peak"}, {"type": "career_growth"}] # Score +2 +3 = 5
            },
            {
                "year": 2027,
                "events": [{"type": "health_caution"}] # Score -1
            }
        ]
    }
}

print("Running Life Path Engine Verification...")

result = run_life_path_engine(report_data)

print(f"Life Theme: {result['life_theme']}")
print(f"Karma Signature: {result['karma_signature']}")
print("Destiny Curve:")
for point in result['destiny_curve']:
    print(f" - {point['year']}: {point['score']}")
print(f"Growth Peaks: {result['growth_peaks']}")
print(f"Narrative: {result['life_narrative']}")

# Checks
if result['life_theme'] == "Wisdom & Expansion Path":
    print("PASS: Jupiter Life Theme detected.")
else:
    print("FAIL: Life Theme mismatch.")

if "Deep karmic transformation cycles" in result['karma_signature']:
    print("PASS: Kalsarp Karma detected.")
else:
    print("FAIL: Karma detection mismatch.")

# Check score calculation
# 2025: +3
# 2026: +5
# 2027: -1
s2026 = next((x['score'] for x in result['destiny_curve'] if x['year'] == 2026), 0)
if s2026 == 5:
    print("PASS: Destiny Score calculation correct.")
else:
    print(f"FAIL: Destiny Score mismatch. Expected 5, got {s2026}.")

# Check Growth Peaks (>= 2 events)
if 2026 in result['growth_peaks']:
    print("PASS: Growth Peak 2026 detected.")
else:
    print("FAIL: Growth Peak missing.")
