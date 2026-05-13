from core.analysis.probability_matrix import build_probability_matrix

# Mock Data
chart = {}
dasha = {"current": {"lord": "Jupiter"}}
dosha = {"manglik": {"present": False}, "sadesati": {"present": True}}
strength = {"average": 70}
life_events = [{"events": ["Career Breakthrough"]}]

print("Running build_probability_matrix...")
try:
    matrix = build_probability_matrix(chart, dasha, dosha, strength, life_events)
    print("Matrix:", matrix)
    
    expected_keys = ["career_growth", "marriage_probability", "wealth_index", "health_stability", "life_balance_index"]
    for k in expected_keys:
        if k not in matrix:
            print(f"Missing key: {k}")
            exit(1)
    print("Structure verification passed.")

except Exception as e:
    print("Error:", e)
