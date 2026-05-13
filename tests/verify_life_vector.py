from core.neural.neural_core import build_neural_context

# Mock Data
report_data = {
    "basic_details": {
        "ascendant": "Leo",
        "sign": "Aries"
    },
    "strength": {
        "strong_planets": ["Sun", "Saturn"]
    },
    "dasha": {
        "current": {"lord": "Saturn"}
    },
    "dosha": {
        "kalsarp": {"present": False},
        "manglik": {"present": False},
        "sadesati": {"present": True} # Test happiness prediction
    },
    "timeline": []
}

adaptive = None

print("Running Life Vector Engine Verification...")

neural = build_neural_context(report_data, adaptive)
predictions = report_data.get("life_vector_predictions")

print("\n--- Predictions ---")
for key, text in predictions.items():
    print(f"{key}: {text}")

if "Career growth will be slow" in predictions["career_finance"]:
    print("\nPASS: Saturn Career prediction correct.")
else:
    print("\nFAIL: Career prediction mismatch.")

if "Emotional maturity" in predictions["happiness"]:
    print("PASS: Sade Sati happiness prediction correct.")
else:
    print("FAIL: Happiness prediction mismatch.")
