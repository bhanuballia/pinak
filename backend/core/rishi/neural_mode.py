
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from .feature_builder import build_features
from .neural_predictor import neural_score
from .confidence_engine import build_confidence
from .adaptive_writer import neural_style
from .neural_memory import add_chart_to_memory

def run_rishi_neural_mode(report_data):

    chart = report_data.get("chart",{})
    dosha = report_data.get("dosha",{})
    strength = report_data.get("strength",{})

    # Build ML features
    features = build_features(chart,dosha,strength)

    # Neural similarity score
    n_score = neural_score(features)

    # Confidence
    classical_strength = sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) if strength else 5
    confidence = build_confidence(n_score,classical_strength)

    report_data["neural_confidence"] = confidence
    report_data["neural_score"] = n_score

    # Enhance prediction text
    preds = report_data.get("predictions",{})
    for k,v in preds.items():
        preds[k]["text"] = neural_style(v["text"], n_score)

    # Learn from this chart
    add_chart_to_memory(features)

    return report_data
