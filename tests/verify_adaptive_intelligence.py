from core.adaptive.adaptive_engine import run_adaptive_intelligence

# Mock Data
report_data = {
    "chart": {},
    "dosha": {
        "mangalik": {"present": True},
        "sadesati": {"present": False}
    },
    "strength": {
        "Jupiter": 120,
        "Sun": 100,
        "Moon": 80
    },
    "dasha": {},
    "life_vector_predictions": {},
    "timeline_predictions": [],
    "yogas": []
}

print("Running Adaptive Intelligence Verification...")

result = run_adaptive_intelligence(report_data)

print(f"Dominant Energy: {result['profile']['dominant_energy']}")
print(f"Tone: {result['tone']}")
print(f"Weights: {result['weights']}")

if result['profile']['dominant_energy'] == "Jupiter" and result['tone'] == "wisdom":
    print("PASS: Spiritual profile detected.")
else:
    print("FAIL: Profile mismatch.")

if result['weights']['relationships'] == 1.5:
    print("PASS: Mangalik relationship weight applied.")
else:
    print("FAIL: Weight mismatch.")
