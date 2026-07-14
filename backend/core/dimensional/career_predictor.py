
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def predict_career_growth(chart, strength, timeline):
    """
    Predicts career growth phases based on dimensional metrics.
    """
    saturn = _get_strength(strength, "Saturn", 1.0)
    jupiter = _get_strength(strength, "Jupiter", 1.0)
    
    momentum = (saturn + jupiter) / 2
    
    if momentum > 1.3:
        status = "Rapid Acceleration"
    elif momentum > 1.0:
        status = "Steady Climbing"
    else:
        status = "Consolidation Phase"
        
    return {
        "momentum": round(momentum, 2),
        "status": status,
        "advice": "Focus on skill acquisition" if momentum < 1.0 else "Capitalize on opportunities"
    }
