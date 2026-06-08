# scratch/test_advanced.py

import numpy as np

# 1. Test KP Sub Lord calculation
from nakshatra_advanced.kp.kp_sub_lords import calculate_kp_sub_lord
kp_sub = calculate_kp_sub_lord(13.245)
print("1. KP Sub Lord (Rohini, 13.245 deg):", kp_sub)

# 2. Test Heatmap Matrix generation
from nakshatra_advanced.heatmaps.nakshatra_heatmap import NakshatraHeatmap
hmap = NakshatraHeatmap()
matrix = hmap.build_matrix([
    {"source": 3, "target": 4, "score": 90.0},
    {"source": 10, "target": 12, "score": 75.0}
])
print("2. Heatmap Matrix sum:", matrix.sum())

# 3. Test Dasha Synchronization scoring
from nakshatra_advanced.dasha_sync.dasha_nakshatra_sync import DashaNakshatraSync
dsync = DashaNakshatraSync()
score = dsync.synchronize("Moon", "Moon", "Moon")
print("3. Dasha Nakshatra Sync Score (Triple Alignment):", score)

# 4. Test Remedies Gemstone recommendations
from nakshatra_advanced.remedies.gemstone_engine import recommend_gemstone
gem = recommend_gemstone("Saturn")
print("4. Remedial Gemstone (Saturn):", gem)

# 5. Test Multilingual Hindi interpretations
from nakshatra_advanced.multilingual.hindi_interpretations import get_hindi_interpretation
text = get_hindi_interpretation("Rohini")
print("5. Hindi Interpretation (Rohini):", text.encode('ascii', 'backslashreplace'))

# 6. Test Transit Alerts generation
from nakshatra_advanced.alerts.transit_alerts import TransitAlerts
alerts_eng = TransitAlerts()
alert = alerts_eng.generate("Rohini", "Rohini")
print("6. Transit Alert (Double Rohini):", alert)

# 7. Test Marriage AI Compatibility scoring
from nakshatra_advanced.compatibility.marriage_ai import MarriageAI
marry_ai = MarriageAI()
compatibility = marry_ai.compatibility(4, 7)
print("7. Marriage AI Compatibility (Nakshatras 4 & 7):", compatibility)

# 8. Test Machine Learning Prediction (with graceful fallback verification)
from nakshatra_advanced.ml.prediction_model import NakshatraMLModel
ml_model = NakshatraMLModel()
# Should not crash even if scikit-learn is not installed!
mock_predict = ml_model.predict([42, 12])
print("8. ML Prediction (Mock Output):", mock_predict)

# 9. Test GPU Processing Engine (with cupy fallback verification)
from nakshatra_advanced.gpu.cuda_engine import GPUAstroEngine
gpu_engine = GPUAstroEngine()
values = [1.0, 4.0, 9.0, 16.0]
processed = gpu_engine.process(values)
print("9. GPU Astro Engine output (List fallback or CuPy sqrt):", processed)

# 10. Test API blue-print loading
from nakshatra_advanced.api.nakshatra_routes import nakshatra_api
print("10. API Blueprint name successfully loaded:", nakshatra_api.name)

print("\n--- ALL ADVANCED SYSTEM TESTS COMPLETED SUCCESSFULLY ---")
