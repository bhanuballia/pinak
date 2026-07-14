from core.analysis.destiny_graph_engine import build_destiny_graph
import os

# Mock Data
yearly_predictions = [
    {"year": 2025}, {"year": 2026}, {"year": 2027}, {"year": 2028}, {"year": 2029}
]
probability_matrix = {
    "career_growth": 65,
    "wealth_index": 60,
    "marriage_probability": 70
}
strength = {"average": 70}

life_events = [
    {"year": 2027, "type": "career_peak", "label": "Big Promote"}
]

karma_sim = {
    "with_remedies": [
        {"year": 2025, "score": 65},
        {"year": 2026, "score": 68},
        {"year": 2027, "score": 75},
        {"year": 2028, "score": 78},
        {"year": 2029, "score": 80}
    ],
    "high_effort_path": [
        {"year": 2025, "score": 70},
        {"year": 2026, "score": 75},
        {"year": 2027, "score": 85},
        {"year": 2028, "score": 88},
        {"year": 2029, "score": 90}
    ]
}

output_file = "tests/test_destiny_graph_karma.png"

print("Running build_destiny_graph (Karma Edition)...")
try:
    path = build_destiny_graph(
        yearly_predictions, 
        probability_matrix, 
        strength, 
        life_events=life_events,
        karma_sim=karma_sim,
        out_png=output_file
    )
    print("Graph Path:", path)
    
    if path and os.path.exists(path):
        print("Success: Karma Graph file created.")
    else:
        print("Failure: Graph file not found.")

except Exception as e:
    print("Error:", e)
