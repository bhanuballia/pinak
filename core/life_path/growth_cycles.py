def detect_growth_cycles(timeline):

    peaks = []

    for year_data in timeline:
        if len(year_data.get("events", [])) >= 2:
            peaks.append(year_data["year"])

    return peaks
