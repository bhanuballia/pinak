from core.visualization.cosmic_graph_engine import run_cosmic_graph_engine
import os

# Mock Data
report_data = {
    "life_path": {
        "destiny_curve": [
            {"year": 2025, "score": 3},
            {"year": 2026, "score": 5},
            {"year": 2027, "score": -1}
        ]
    },
    "omniscient_timeline": {
        "omniscient_timeline": [
            {
                "year": 2025,
                "events": [{"type": "career_growth"}] 
            },
            {
                "year": 2026,
                "events": [{"type": "relationship_peak"}, {"type": "career_growth"}] 
            },
            {
                "year": 2027,
                "events": [{"type": "health_caution"}] 
            }
        ]
    }
}

print("Running Cosmic Graph Engine Verification...")

graphs = run_cosmic_graph_engine(report_data)

print(f"Generated Graphs: {list(graphs.keys())}")

expected_graphs = ["destiny_curve", "career_curve", "relationship_curve", "risk_heatmap"]
missing = [g for g in expected_graphs if g not in graphs]

if not missing:
    print("PASS: All graphs generated.")
else:
    print(f"FAIL: Missing graphs: {missing}")

# Check files exist
for name, path in graphs.items():
    if os.path.exists(path):
        print(f"PASS: {name} saved at {path}")
    else:
        print(f"FAIL: {name} file missing at {path}")
