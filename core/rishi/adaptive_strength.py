
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def adjust_prediction_strength(report_data):

    strength = report_data.get("strength", {})

    score = sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) if strength else 5

    if score > 6:
        return "High Confidence"
    elif score > 3:
        return "Moderate Confidence"
    else:
        return "Developing Potential"
