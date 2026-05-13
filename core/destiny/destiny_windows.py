def detect_windows(timeline):

    marriage_years = []
    career_years = []

    for y in timeline:
        if y["score"] >= 75:
            career_years.append(y["year"])

        if y["score"] >= 65:
            marriage_years.append(y["year"])

    return {
        "career_windows": career_years,
        "marriage_windows": marriage_years,
    }
