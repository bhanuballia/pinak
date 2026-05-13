def detect_career_path(chart, strength):

    tenth_house = chart.get("houses", {}).get(10, {})

    planets = tenth_house.get("planets", [])

    if "Mercury" in planets:
        return "Business, communication, analytics"

    if "Mars" in planets:
        return "Engineering, police, military"

    if "Venus" in planets:
        return "Design, luxury, entertainment"

    return "Flexible career path"
