def forecast_events(chart, dasha, probabilities):

    events = []

    if probabilities["career"] > 0.7:
        events.append({
            "type": "Career Breakthrough",
            "window": "Next 2-3 Years"
        })

    if probabilities["marriage"] > 0.6:
        events.append({
            "type": "Relationship Milestone",
            "window": "Upcoming Dasha"
        })

    if probabilities["finance"] > 0.75:
        events.append({
            "type": "Financial Expansion",
            "window": "Jupiter Transit"
        })

    return events
