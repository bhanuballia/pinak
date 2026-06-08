# scratch/test_enterprise.py
import sys
import os
from datetime import datetime

# Setup workspace PYTHONPATH so we can import enterprise_astrology
workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

print("="*80)
print("RUNNING ENTERPRISE ASTROLOGY INTEGRATION & VERIFICATION CHECKS")
print("="*80)

# 1. Test Cache Subsystem (redis fallback)
print("[TEST] Testing Cache Subsystem (RedisFallback)...")
from enterprise_astrology.backend.cache.redis_engine import RedisCache
cache = RedisCache()
cache.set_cache("karmic_node", "Rahu", expiry=10)
val = cache.get_cache("karmic_node")
assert val == "Rahu", f"Cache retrieval mismatch: {val}"
print(f"  - SUCCESS: Set and retrieved '{val}' from Redis/Fallback Cache successfully.")

# 2. Test Swiss Ephemeris position calculations
print("[TEST] Testing Swiss Ephemeris calculations...")
from enterprise_astrology.backend.astronomy.swiss_ephemeris import SwissEphemerisEngine
engine = SwissEphemerisEngine()
# Test calculation for Sun (planet_id = 0) at epoch
dt = datetime(2026, 5, 20, 12, 0, 0)
sun_pos = engine.planetary_position(dt, 0)
print(f"  - SUCCESS: Sun position: {sun_pos}")
assert "longitude" in sun_pos
assert "latitude" in sun_pos
assert "speed" in sun_pos

# 3. Test AI event probability calculations
print("[TEST] Testing AI Event Probability calculations...")
from enterprise_astrology.backend.ai.event_probability_ai import EventProbabilityAI
prob_ai = EventProbabilityAI()
result = prob_ai.calculate_probability(dasha_score=80, transit_score=75, divisional_support=85)
print(f"  - SUCCESS: Event Probability result: {result}")
assert result["status"] == "HIGH"
assert result["probability"] == 80.0

# 4. Test AI Timeline Forecaster
print("[TEST] Testing AI Timeline Forecaster...")
from enterprise_astrology.backend.ai.timeline_forecaster import TimelineForecaster
forecaster = TimelineForecaster()
natal_chart = {"ascendant": 45.0}
transits = [
    {"planet": "Saturn", "house": 7, "sign": "Aquarius", "date": "2026-06-01"},
    {"planet": "Jupiter", "house": 2, "sign": "Taurus", "date": "2026-06-15"}
]
raw_forecast = forecaster.forecast_events(natal_chart, transits)
print(f"  - SUCCESS: Forecaster generated {len(raw_forecast)} events.")
assert len(raw_forecast) == 2
assert raw_forecast[0]["planet"] == "Saturn"
assert raw_forecast[0]["impact_score"] == 75

# 5. Test Dashboard Animated Transits Interpolator
print("[TEST] Testing Dashboard Animated Transits...")
from enterprise_astrology.backend.dashboard.animated_transits import AnimatedTransits
animator = AnimatedTransits()
path = animator.interpolate_degrees(350, 10, steps=4)
print(f"  - SUCCESS: Shortest path interpolation from 350 to 10: {path}")
assert path[0] == 350.0
assert path[-1] == 10.0
assert len(path) == 5

# 6. Test Dashboard Timeline Visualizer
print("[TEST] Testing Dashboard Timeline Visualizer...")
from enterprise_astrology.backend.dashboard.timeline_visualizer import TimelineVisualizer
visualizer = TimelineVisualizer()
nodes = visualizer.format_timeline(raw_forecast)
print(f"  - SUCCESS: Visualizer formatted {len(nodes)} timeline nodes.")
assert len(nodes) == 2
assert nodes[0]["title"] == "Challenging Transit"
assert nodes[0]["weight"] == 75

# 7. Test WebSocket Transit Alerts
print("[TEST] Testing WebSocket Transit Alerts...")
from enterprise_astrology.backend.websocket.transit_alerts import TransitAlertEngine
alert_engine = TransitAlertEngine()
transit_positions = {
    "Saturn": {"house": 7, "sign": "Aquarius"},
    "Jupiter": {"house": 2, "sign": "Taurus"}
}
alerts = alert_engine.check_alerts({}, transit_positions)
print(f"  - SUCCESS: Alert engine caught {len(alerts)} alerts.")
assert len(alerts) == 2
assert alerts[0]["planet"] == "Saturn"
assert alerts[0]["severity"] == "HIGH"

# 8. Test Route Blueprint loading
print("[TEST] Testing API APIRouter Blueprint loading...")
from enterprise_astrology.backend.api.astrology_routes import router as ast_r
from enterprise_astrology.backend.api.websocket_routes import router as ws_r
from enterprise_astrology.backend.api.prediction_routes import router as pred_r
from enterprise_astrology.backend.api.muhurat_routes import router as muh_r
assert ast_r is not None
assert ws_r is not None
assert pred_r is not None
assert muh_r is not None
print("  - SUCCESS: All API routing Blueprints loaded successfully.")

print("="*80)
print("ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!")
print("="*80)
