def destiny_scores(chart, strength, dasha):
    if isinstance(strength, dict) and "planets" in strength:
        planets_data = strength["planets"]
        vals = [p.get("total_score", 60) / 60.0 for p in planets_data.values() if isinstance(p, dict)]
        score = sum(vals) / len(vals) if vals else 1.0
    elif isinstance(strength, dict):
        vals = [float(v) for v in strength.values() if isinstance(v, (int, float))]
        score = sum(vals) / len(vals) if vals else 1.0
    else:
        score = 1.0

    if score > 1.2:
        future = "High Fortune Cycle"
    elif score > 1.0:
        future = "Growth Phase"
    else:
        future = "Stable Phase"

    return {
        "fortune_level": future,
        "score": round(score,2)
    }
