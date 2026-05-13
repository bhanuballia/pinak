def emotional_signature(chart):

    moon = chart.get("moon_house",1)

    if moon in [8,12]:
        return "Deeply introspective and emotionally intense."
    elif moon in [3,6]:
        return "Active and mentally restless."
    else:
        return "Balanced emotional expression."
