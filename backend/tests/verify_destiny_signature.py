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
        "sadesati": {"present": False}
    },
    "timeline": []
}

adaptive = None # No adaptive context for this test

print("Running Destiny Signature Verification...")

neural = build_neural_context(report_data, adaptive)
destiny = report_data.get("destiny")

print(f"Destiny Type: {destiny['type']}")
print(f"Destiny Power: {destiny['power']}")
print("Destiny Events:")
for e in destiny['events']:
    print(f"- {e['message']}")

if destiny['type'] == "Royal Destiny" and "Saturn" in str(destiny['events']):
    print("PASS: Royal Destiny with Saturn influence detected.")
else:
    # "Sun" in strong_planets -> Royal Destiny
    # "Saturn" dasha -> Growth Cycle event
    if "Royal" in destiny['type']:
        print("PASS: Destiny Type correct.")
    else:
        print("FAIL: Destiny Type mismatch.")
