def marriage_analysis(chart, d9):

    venus_house = 1
    mars_house = 1
    
    for h, data in chart.get("houses", {}).items():
        if "Venus" in data.get("planets", []):
            venus_house = int(h)
        if "Mars" in data.get("planets", []):
            mars_house = int(h)

    risk = "Low"

    if mars_house in [1,4,7,8,12]:
        risk = "Manglik Influence"

    return {
        "marriage_risk": risk,
        "relationship_style": "Emotionally intense"
    }
