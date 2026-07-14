from core.analysis.destiny_graph_engine import build_destiny_graph
import os

# Mock Data
yearly_predictions = [
    {"year": 2025, "risk_level": "medium", "focus": "career"},
    {"year": 2026, "risk_level": "low", "focus": "relationship"},
    {"year": 2027, "risk_level": "high", "focus": "health"},
    {"year": 2028, "risk_level": "medium", "focus": "wealth"},
    {"year": 2029, "risk_level": "low", "focus": "spirituality"}
]
probability_matrix = {
    "career_growth": 72,
    "wealth_index": 78,
    "marriage_probability": 68
}
strength = {"average": 65}

life_events = [
    {"year": 2025, "type": "career_peak", "label": "Career Rise"},
    {"year": 2026, "type": "relationship_window", "label": "Love"},
    {"year": 2027, "type": "risk_period", "label": "Caution"},
    {"year": 2028, "type": "wealth_peak", "label": "Wealth"},
    {"year": 2029, "type": "spiritual_shift", "label": "Spirit"}
]

output_file = "tests/test_destiny_graph_ultra.png"

print("Running build_destiny_graph (Ultra)...")
try:
    path = build_destiny_graph(
        yearly_predictions, 
        probability_matrix, 
        strength, 
        life_events=life_events, 
        out_png=output_file
    )
    print("Graph Path:", path)
    
    if path and os.path.exists(path):
        print("Success: Ultra Graph file created.")
    else:
        print("Failure: Graph file not found.")

except Exception as e:
    print("Error:", e)
