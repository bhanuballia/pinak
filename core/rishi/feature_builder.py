
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

PLANET_INDEX = {
    "Sun":0,"Moon":1,"Mars":2,"Mercury":3,
    "Jupiter":4,"Venus":5,"Saturn":6,"Rahu":7,"Ketu":8
}

def build_features(chart, dosha, strength):

    vector = [0]*30

    # planet houses
    for p, data in chart.get("planet_positions", {}).items():
        idx = PLANET_INDEX.get(p)
        if idx is not None:
            vector[idx] = data.get("house", 0)

    # dosha flags
    vector[20] = int(dosha.get("manglik",{}).get("present",False))
    vector[21] = int(dosha.get("kalsarp",{}).get("present",False))
    vector[22] = int(dosha.get("pitra",{}).get("present",False))

    # strength score
    vector[25] = sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) if strength else 0

    return vector
