def simulate_timelines(timeline, probabilities):

    paths = []

    for year, info in timeline.items():

        modifier = probabilities["career"] * 0.2

        paths.append({
            "year": year,
            "trend": "growth" if modifier > 0.1 else "stable",
            "summary": info.get("summary","")
        })

    return paths
