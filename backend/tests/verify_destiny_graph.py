from core.analysis.destiny_graph_engine import build_destiny_graph
import os

# Mock Data
yearly_predictions = [
    {"year": 2025}, {"year": 2026}, {"year": 2027}, {"year": 2028}, {"year": 2029}
]
probability_matrix = {
    "career_growth": 70,
    "wealth_index": 65,
    "marriage_probability": 80
}
strength = {"average": 75}

output_file = "tests/test_destiny_graph.png"

print("Running build_destiny_graph...")
try:
    path = build_destiny_graph(yearly_predictions, probability_matrix, strength, out_png=output_file)
    print("Graph Path:", path)
    
    if path and os.path.exists(path):
        print("Success: Graph file created.")
    else:
        print("Failure: Graph file not found.")

except Exception as e:
    print("Error:", e)
