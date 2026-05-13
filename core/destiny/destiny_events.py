def detect_destiny_events(report_data, vector):

    events = []

    dasha = report_data.get("dasha", {})
    lord = vector.get("current_dasha")

    if lord == "Saturn":
        events.append({
            "type": "Growth Cycle",
            "message": "Slow but powerful restructuring phase."
        })

    if lord == "Venus":
        events.append({
            "type": "Relationship Window",
            "message": "Strong focus on harmony and partnerships."
        })

    if vector.get("dosha_score", 0) >= 3:
        events.append({
            "type": "Karmic Period",
            "message": "Spiritual transformation phase active."
        })

    return events
