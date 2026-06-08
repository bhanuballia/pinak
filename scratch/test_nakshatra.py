from nakshatra.nakshatra_engine import NakshatraEngine
from nakshatra.nakshatra_visualizer import render_nakshatra

# 1. Initialize Nakshatra Engine
engine = NakshatraEngine()

# 2. Run computation for longitude 53.245
result = engine.calculate(53.245)
print("--- Nakshatra Calculation ---")
print(result)

# 3. Render raw visualization
rendered = render_nakshatra(result)
print("\n--- Rendered Visual Card ---")
print(rendered)
