from core.oracle_matrix.matrix_core import omniscient_oracle
import os

# Mock Data
report_data = {
    "timeline": [],
    "dosha": {"kalsarp": {"present": False}},
    "strength": {"jupiter": 80},
    "chart": {},
    "karma_simulation": {"karma_score": 50},
    "probability_matrix": {}
}

# Clear memory for test
memory_file = "core/adaptive/adaptive_memory.json"
if os.path.exists(memory_file):
    os.remove(memory_file)

print("Running Adaptive Cosmic Matrix Verification...")

# Iteration 1: Init (No History)
print("\n--- Iteration 1 ---")
q1 = "Should I switch jobs?"
r1 = omniscient_oracle(q1, report_data, history=[])
print(f"Response: {r1}")

# Iteration 2: Heavy Career History (Should trigger adaptive response)
print("\n--- Iteration 2 (With Career History) ---")
history = ["job change", "career growth", "promotion timing", "business success"]
q2 = "Is now a good time?"
r2 = omniscient_oracle(q2, report_data, history=history)
print(f"Response: {r2}")

if "Your destiny path currently emphasizes career evolution" in r2:
    print("PASS: Adaptive career focus detected.")
else:
    print("FAIL: Adaptive response missing.")
