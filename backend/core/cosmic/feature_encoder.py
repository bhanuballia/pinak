
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

def encode_chart(chart, dosha, strength):

    vec = [0]*40

    for p,data in chart.get("planets",{}).items():
        idx = PLANET_INDEX.get(p)
        if idx is not None:
            vec[idx] = data.get("house",0)

    # dosha flags
    vec[20] = int(dosha.get("manglik",{}).get("present",False))
    vec[21] = int(dosha.get("kalsarp",{}).get("present",False))
    vec[22] = int(dosha.get("pitra",{}).get("present",False))

    # strength total
    vec[30] = sum(([p.get('total_score', 60) for p in _get_strength(strength, 'planets', {}).values()] if isinstance(strength, dict) and 'planets' in strength else [v for v in strength.values() if isinstance(v, (int, float))]) if strength else []) if strength else 0

    return vec
