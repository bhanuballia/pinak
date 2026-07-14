def build_prophecy_timeline(events, destiny_score):

    timeline = []

    for e in events:

        level = "Strong" if destiny_score > 70 else "Moderate"

        timeline.append({
            "phase": e["type"],
            "period": f"{e['start']} → {e['end']}",
            "intensity": level
        })

    return timeline
