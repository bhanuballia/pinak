def build_curve(timeline):

    values = [y["score"] for y in timeline]

    if not values:
        return timeline

    avg = sum(values)/len(values)

    for y in timeline:
        if y["score"] > avg+10:
            y["phase"] = "Peak"
        elif y["score"] < avg-10:
            y["phase"] = "Challenge"
        else:
            y["phase"] = "Balanced"

    return timeline
