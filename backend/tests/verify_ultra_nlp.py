from core.ai_engine.nlp.ultra_nlp_engine import run_ultra_nlp_engine

# Mock Data
report_data = {
    "strength_analysis": {
        "career_score": 75,
        "relationship_score": 40
    },
    "omniscient_timeline": {
        "omniscient_timeline": [
            {
                "year": 2029,
                "events": [{"type": "career_growth"}] 
            }
        ]
    }
}

print("Running Ultra NLP Engine Verification...")

narratives = run_ultra_nlp_engine(report_data)

print(f"Generated Narratives: {list(narratives.keys())}")

for key, text in narratives.items():
    print(f"\n--- {key} ---")
    print(text)

# Checks
if "career_finance" in narratives:
    if "leadership qualities" in narratives["career_finance"]:
         print("PASS: High Career Score text detected.")
    else:
         print("FAIL: High Career Score text missing.")
    
    if "2029 may highlight a turning point" in narratives["career_finance"]:
         print("PASS: Career Timeline Event text detected.")
else:
    print("FAIL: Career section missing.")

if "love_relationship" in narratives:
    if "clear communication" in narratives["love_relationship"]:
        print("PASS: Low Relationship Score text detected.")
    else:
        print("FAIL: Low Relationship Score text missing.")
