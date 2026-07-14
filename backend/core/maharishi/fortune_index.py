
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def compute_fortune_index(strength, yogas, dosha):

    score = 50

    # Planetary strength boost
    for v in ([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]):
        score += v * 10

    # Yoga bonus
    score += len(yogas) * 3

    # Dosha penalty
    for d in dosha.values():
        if d.get("present"):
            score -= 4

    return max(0, min(100, int(score)))
