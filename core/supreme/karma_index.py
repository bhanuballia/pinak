def compute_karma_index(chart, navamsa):

    saturn_house = 1
    for h, data in chart.get("houses", {}).items():
        if "Saturn" in data.get("planets", []):
            saturn_house = int(h)

    if saturn_house in [8,12]:
        return "Deep karmic lessons"

    if navamsa.get("navamsa_score",0) >= 3:
        return "Dharmic life path"

    return "Balanced karma"
