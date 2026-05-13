def monthly_transits(chart):

    saturn_house = 1
    jupiter_house = 1
    
    for h, data in chart.get("houses", {}).items():
        if "Saturn" in data.get("planets", []):
            saturn_house = int(h)
        if "Jupiter" in data.get("planets", []):
            jupiter_house = int(h)

    months = []

    for m in range(1,13):

        if jupiter_house in [1,5,9]:
            effect = "Expansion and growth"
        elif saturn_house in [6,8,12]:
            effect = "Discipline and karmic lessons"
        else:
            effect = "Balanced progress"

        months.append({
            "month": m,
            "prediction": effect
        })

    return months
