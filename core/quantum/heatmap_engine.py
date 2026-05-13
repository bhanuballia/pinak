def build_heatmap(events):

    risk = 0
    opportunity = len(events) * 0.25

    if opportunity > 0.5:
        status = "High Opportunity Phase"
    else:
        status = "Balanced Phase"

    return {
        "risk": round(risk,2),
        "opportunity": round(opportunity,2),
        "status": status
    }
