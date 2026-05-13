from core.neural.neural_core import build_neural_context

# Mock Data
report_data = {
    "basic_details": {"ascendant": "Leo"},
    "strength": {"strong_planets": ["Sun", "Jupiter"]},
    "dosha": {
        "kalsarp": {"present": False},
        "manglik": {"present": True}
    },
    "dasha": {"current": {"lord": "Saturn"}},
    "timeline": []
}

adaptive = {
    "weights": {"career": 1.5, "relationship": 0.8}
}

print("Running Cosmic Neural Core Verification...")

# Test 1: With Adaptive
print("\n--- Test 1 (With Adaptive) ---")
neural = build_neural_context(report_data, adaptive)
print(f"Archetype: {neural['archetype']}")
print(f"Summary: {neural['summary']}")

if "Leader Archetype" in neural['archetype'] and "Career evolution" in neural['summary']:
    print("PASS: Archetype and Adaptive Focus detected.")
else:
    print("FAIL: Neural logic mismatch.")

# Test 2: Without Adaptive
print("\n--- Test 2 (No Adaptive) ---")
neural2 = build_neural_context(report_data, adaptive=None)
print(f"Summary: {neural2['summary']}")

if "Career evolution" not in neural2['summary']:
    print("PASS: Adaptive logic correctly skipped.")
else:
    print("FAIL: Adaptive logic shouldn't run.")
