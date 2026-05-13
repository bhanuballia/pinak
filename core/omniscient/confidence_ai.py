
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def calculate_confidence(strength, dosha, fused):

    base = sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) / max(len(strength),1)

    penalty = 0

    for d in dosha.values():
        if d.get("present"):
            penalty += 0.05

    score = max(0.5, min(1.0, base - penalty))

    return round(score,2)
