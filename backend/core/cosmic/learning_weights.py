def apply_prediction_weights(strength, dosha, supreme):
    if isinstance(strength, dict) and "planets" in strength:
        planets_data = strength["planets"]
        vals = [p.get("total_score", 60) / 60.0 for p in planets_data.values() if isinstance(p, dict)]
        score = sum(vals) / len(vals) if vals else 1.0
    elif isinstance(strength, dict):
        vals = [float(v) for v in strength.values() if isinstance(v, (int, float))]
        score = sum(vals) / len(vals) if vals else 1.0
    else:
        score = 1.0

    if dosha.get("kalsarp",{}).get("present"):
        score -= 0.2

    if supreme.get("navamsa_analysis",{}).get("navamsa_score",0) >= 3:
        score += 0.3

    return {
        "cosmic_score": round(score,2)
    }
