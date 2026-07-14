def detect_sade_sati(chart):

    moon_house = 1
    saturn_house = 1
    
    for h, data in chart.get("houses", {}).items():
        if "Moon" in data.get("planets", []):
            moon_house = int(h)
        if "Saturn" in data.get("planets", []):
            saturn_house = int(h)

    phases = []

    if saturn_house == moon_house - 1:
        phases.append("Rising Phase")

    if saturn_house == moon_house:
        phases.append("Peak Phase")

    if saturn_house == moon_house + 1:
        phases.append("Setting Phase")

    return {
        "active": len(phases) > 0,
        "phases": phases
    }
