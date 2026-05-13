from core.ai_engine.cosmic_ai_engine import run_cosmic_ai_engine

# Mock Data
report_data = {
    "strength_analysis": {
        "career_score": 80,
        "relationship_score": 50
    },
    "dosha_analysis": {
        "sadesati": {"active": True}
    },
    "omniscient_timeline": {
        "omniscient_timeline": [
            {
                "year": 2025,
                "events": [{"type": "career_growth"}] 
            }
        ]
    }
}

print("Running Cosmic AI Engine Verification...")

interpretations = run_cosmic_ai_engine(report_data)

print(f"Generated Sections: {list(interpretations.keys())}")

for key, text in interpretations.items():
    print(f"\n--- {key} ---")
    print(text[:100] + "...") # Print first 100 chars

# Checks
if "career_finance" in interpretations:
    if "immense potential" in interpretations["career_finance"]:
         print("PASS: Strong Career Text detected.")
    else:
         print("FAIL: Strong Career Text missing.")
    
    if "2025 may bring opportunities" in interpretations["career_finance"]:
         print("PASS: Career Timeline Event text detected.")
else:
    print("FAIL: Career section missing.")

if "health_wellness" in interpretations and "Pay attention" in interpretations["health_wellness"]:
    print("PASS: Health Caution detected.")
else:
     print("FAIL: Health Caution missing.")
