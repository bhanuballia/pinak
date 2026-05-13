
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def compute_karma_score(strength, dosha, maharishi):

    score = 60

    for v in ([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]):
        score += v*5

    for d in dosha.values():
        if d.get("present"):
            score -= 3

    score += len(maharishi.get("yogas",[]))*2

    return max(0, min(100, int(score)))
