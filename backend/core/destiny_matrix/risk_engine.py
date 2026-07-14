def detect_risk(year, ctx):

    risk_score = 0
    reasons = []

    dosha = ctx.get("dosha", {})
    timeline = ctx.get("timeline", [])

    # Check timeline for risk
    for t in timeline:
        if t["year"] == year and t.get("risk_level") == "high":
            risk_score += 50
            reasons.append("High Risk Timeline Year")

    # Check Sade Sati
    if dosha.get("sadesati", {}).get("present"):
        risk_score += 20
        reasons.append("Sade Sati Active")

    if risk_score > 40:
        return {"level": "high", "score": risk_score, "reasons": reasons}
    
    if risk_score > 20:
        return {"level": "medium", "score": risk_score, "reasons": reasons}

    return {"level": "low", "score": risk_score, "reasons": []}
